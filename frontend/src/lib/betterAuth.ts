// src/lib/betterAuth.ts

interface BetterAuthConfig {
  baseURL?: string;
  clientKey?: string;
}

interface SignInCredentials {
  email: string;
  password: string;
  callbackURL?: string;
}

interface SignUpCredentials {
  email: string;
  password: string;
  callbackURL?: string;
}

interface AuthResponse {
  user: {
    id: string;
    email: string;
    emailVerified: boolean;
    name?: string;
    image?: string;
    createdAt: string;
    updatedAt: string;
  };
  session: {
    accessToken: string;
    refreshToken?: string;
    expiresAt: Date;
  };
}

interface SessionResponse {
  user: {
    id: string;
    email: string;
    emailVerified: boolean;
    name?: string;
    image?: string;
    createdAt: string;
    updatedAt: string;
  };
  session: {
    accessToken: string;
    refreshToken?: string;
    expiresAt: Date;
  };
}

interface ErrorResponse {
  error: string;
  message: string;
}

export class BetterAuthClient {
  private baseURL: string;
  private clientKey?: string;

  constructor(config?: BetterAuthConfig) {
    this.baseURL = config?.baseURL || process.env.NEXT_PUBLIC_BETTER_AUTH_URL || 'http://localhost:8000';
    this.clientKey = config?.clientKey || process.env.NEXT_PUBLIC_BETTER_AUTH_CLIENT_KEY;
  }

  private getHeaders(includeAuth = false, token?: string) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.clientKey) {
      headers['X-Client-Key'] = this.clientKey;
    }

    if (includeAuth && token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorResponse = await response.json().catch(() => ({ error: 'Unknown error', message: 'Request failed' }));
      throw new Error(errorResponse.message || 'Request failed');
    }
    return response.json();
  }

    async signIn(credentials: SignInCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseURL}/api/auth/login`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Login failed' }));
        throw new Error(errorData.detail || errorData.message || 'Login failed');
      }

      const result = await response.json();

      // Extract the access token from the response
      const accessToken = result.session?.accessToken || result.access_token;

      // Store the token for future API calls
      if (accessToken) {
        this.storeToken(accessToken);
      }

      return {
        user: {
          id: result.user?.id || result.user_id || 'unknown',
          email: result.user?.email || credentials.email,
          emailVerified: result.user?.emailVerified || true,
          name: result.user?.name || credentials.email.split('@')[0],
          createdAt: result.user?.createdAt || new Date().toISOString(),
          updatedAt: result.user?.updatedAt || new Date().toISOString(),
        },
        session: {
          accessToken: accessToken,
          expiresAt: result.session?.expiresAt || new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
        }
      };
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  async signUp(credentials: SignUpCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseURL}/api/auth/register`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Registration failed' }));
        throw new Error(errorData.detail || errorData.message || 'Registration failed');
      }

      const result = await response.json();

      // Extract the access token from the response
      const accessToken = result.session?.accessToken || result.access_token;

      // Store the token for future API calls
      if (accessToken) {
        this.storeToken(accessToken);
      }

      return {
        user: {
          id: result.user?.id || result.user_id || 'unknown',
          email: result.user?.email || credentials.email,
          emailVerified: result.user?.emailVerified || true,
          name: result.user?.name || credentials.email.split('@')[0],
          createdAt: result.user?.createdAt || new Date().toISOString(),
          updatedAt: result.user?.updatedAt || new Date().toISOString(),
        },
        session: {
          accessToken: accessToken,
          expiresAt: result.session?.expiresAt || new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
        }
      };
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }

  // Simulate Better Auth sign out
  async signOut(callbackURL?: string): Promise<void> {
    try {
      // Remove token from localStorage
      localStorage.removeItem('better-auth-token');
    } catch (error) {
      console.error('Sign out error:', error);
      // Still remove the token locally even if the server request fails
      localStorage.removeItem('better-auth-token');
      throw error;
    }
  }

  // Get session from backend API - this is the real call to backend
  async getSession(): Promise<SessionResponse | null> {
    try {
      const token = localStorage.getItem('better-auth-token');
      if (!token) {
        return null;
      }

      const response = await fetch(`${this.baseURL}/api/auth/me`, {
        method: 'GET',
        headers: this.getHeaders(true, token),
      });

      const userData = await this.handleResponse<any>(response);

      // Transform the backend user data to match our expected format
      return {
        user: {
          id: userData.id || userData.user_id || userData.sub || 'unknown',
          email: userData.email || userData.user_email || 'unknown@example.com',
          emailVerified: userData.email_verified || userData.emailVerified || true,
          name: userData.name || userData.email?.split('@')[0] || 'User',
          image: userData.image || userData.avatar || undefined,
          createdAt: userData.created_at || userData.createdAt || new Date().toISOString(),
          updatedAt: userData.updated_at || userData.updatedAt || new Date().toISOString(),
        },
        session: {
          accessToken: token,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
        }
      };
    } catch (error) {
      console.error('Get session error:', error);
      // If session is invalid, remove the token
      localStorage.removeItem('better-auth-token');
      return null;
    }
  }

  // Helper method to store token in localStorage
  storeToken(token: string): void {
    localStorage.setItem('better-auth-token', token);
  }

  // Helper method to get token from localStorage
  getToken(): string | null {
    return localStorage.getItem('better-auth-token');
  }
}