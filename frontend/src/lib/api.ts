import axios from 'axios';
import { getCurrentAuthSession, signIn as betterSignIn, signOut as betterSignOut, signUp } from '@/lib/auth'; // Better Auth integration
import { BetterAuthClient } from './betterAuth';

// Create a client instance to access tokens
const authClient = new BetterAuthClient();

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests if available using Better Auth
api.interceptors.request.use(
  async (config) => {
    const token = authClient.getToken(); // Get token directly from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration or invalidation
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Sign out user and redirect to login if unauthorized
      betterSignOut({ redirectTo: '/' });
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Better Auth API functions
export const authAPI = {
  register: async (email: string, password: string) => {
    const response = await signUp(
      email,
      password,
      { redirectTo: '/' }
    );
    return response;
  },

  login: async (email: string, password: string) => {
    const response = await betterSignIn('credentials', {
      email,
      password,
      redirectTo: '/',
    });
    return response;
  },

  logout: async () => {
    await betterSignOut({ redirectTo: '/login' });
  },

  getCurrentUser: async () => {
    const session = await getCurrentAuthSession();
    if (!session) {
      throw new Error('No active session');
    }
    return session.user;
  },
};

// Task API functions
export const taskAPI = {
  getAll: () =>
    api.get('/api/tasks'),

  create: (title: string, description?: string) =>
    api.post('/api/tasks', { title, description }),

  getById: (id: string) =>
    api.get(`/api/tasks/${id}`),

  update: (id: string, data: Partial<{ title: string; description: string; completed: boolean }>) =>
    api.put(`/api/tasks/${id}`, data),

  toggleCompleted: (id: string) =>
    api.patch(`/api/tasks/${id}/complete`),

  delete: (id: string) =>
    api.delete(`/api/tasks/${id}`),
};