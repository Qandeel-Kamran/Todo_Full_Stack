import axios from 'axios';
import { BetterAuthClient } from './betterAuth';

// Create a client instance to access tokens
const authClient = new BetterAuthClient();

// Create axios instance with default config for Vercel functions
const api = axios.create({
  baseURL: '/', // Using relative paths for Vercel functions
});

// Add auth token to requests if available from Better Auth
api.interceptors.request.use(
  (config) => {
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
      authClient.signOut({ callbackURL: '/login' });
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Better Auth API functions
export const authAPI = {
  register: async (email: string, password: string) => {
    const response = await authClient.signUp({
      email,
      password,
      callbackURL: '/'
    });
    return response;
  },

  login: async (email: string, password: string) => {
    const response = await authClient.signIn({
      email,
      password,
      callbackURL: '/'
    });
    return response;
  },

  logout: async () => {
    await authClient.signOut({ callbackURL: '/login' });
  },

  getCurrentUser: async () => {
    const session = await authClient.getSession();
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