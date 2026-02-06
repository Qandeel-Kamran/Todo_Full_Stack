// Better Auth integration
import jwtDecode from 'jwt-decode';
import { BetterAuthClient } from './betterAuth';

// Initialize Better Auth client
export const authClient = new BetterAuthClient();

// Types for Better Auth integration
interface BetterAuthUser {
  id: string;
  email: string;
  emailVerified: boolean;
  name?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

interface BetterAuthSession {
  user: BetterAuthUser;
  token: string; // The JWT token from Better Auth
  expiresAt: Date;
}

// Get current auth session from Better Auth
export const getCurrentAuthSession = async (): Promise<BetterAuthSession | null> => {
  try {
    const session = await authClient.getSession();

    if (!session) {
      return null;
    }

    // Extract token information
    const accessToken = session.session.accessToken;

    // Decode token to check if it's still valid
    const decoded: any = jwtDecode(accessToken);
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      // Token expired
      return null;
    }

    // Get user info from session
    return {
      user: {
        id: session.user.id,
        email: session.user.email,
        emailVerified: !!session.user.emailVerified,
        name: session.user.name || session.user.email?.split('@')[0],
        image: session.user.image,
        createdAt: session.user.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      token: accessToken,
      expiresAt: new Date(decoded.exp * 1000),
    };
  } catch (error) {
    console.error('Error getting auth session:', error);
    return null;
  }
};

// Sign in function using Better Auth
export const signIn = async (
  provider: string,
  credentials: { email: string; password: string; redirectTo?: string }
): Promise<any> => {
  const { email, password, redirectTo = '/' } = credentials;

  try {
    // Use Better Auth client to sign in
    const result = await authClient.signIn({
      email,
      password,
      callbackURL: redirectTo,
    });

    if (result?.session) {
      // Store the token in localStorage for future requests
      authClient.storeToken(result.session.accessToken);

      return {
        ok: true,
        user: result.user,
        token: result.session.accessToken,
        redirectTo
      };
    } else {
      throw new Error('Login failed');
    }
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
};

// Sign out function using Better Auth
export const signOut = async (options: { redirectTo?: string } = {}): Promise<void> => {
  const { redirectTo = '/login' } = options;

  try {
    // Use Better Auth client to sign out
    await authClient.signOut({ callbackURL: redirectTo });
  } catch (error) {
    console.error('Sign out error:', error);
  }
};

// Register function using Better Auth
export const signUp = async (
  email: string,
  password: string,
  options: { redirectTo?: string } = {}
): Promise<any> => {
  const { redirectTo = '/' } = options;

  try {
    // Use Better Auth client to sign up
    const result = await authClient.signUp({
      email,
      password,
      callbackURL: redirectTo,
    });

    if (result?.session) {
      // Store the token in localStorage for future requests
      authClient.storeToken(result.session.accessToken);

      return {
        ok: true,
        user: result.user,
        token: result.session.accessToken,
        redirectTo
      };
    } else {
      throw new Error('Registration failed');
    }
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};