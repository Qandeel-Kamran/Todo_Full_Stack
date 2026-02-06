'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import jwtDecode from 'jwt-decode';
import { authAPI, taskAPI } from '@/lib/api';

// Define types
interface User {
  id: string;
  email: string;
  name?: string;
  created_at?: string;
  updated_at?: string;
}

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
}

interface AppContextType {
  user: User | null;
  tasks: Task[];
  loading: boolean;
  error: string | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  addTask: (title: string, description?: string) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  updateTask: (id: string, data: Partial<{ title: string; description: string; completed: boolean }>) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is logged in on initial load
  useEffect(() => {
    verifyTokenAndLoadData();
  }, []);

  const verifyTokenAndLoadData = async () => {
    try {
      // Use Better Auth to check if user is authenticated
      const session = await authAPI.getCurrentUser();

      if (session) {
        setIsLoggedIn(true);
        await loadUserData();
      }
    } catch (err) {
      console.error('Token verification failed:', err);
      setIsLoggedIn(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const loadUserData = async () => {
    try {
      setError(null);

      // Get user info from Better Auth
      const userResponse = await authAPI.getCurrentUser();
      setUser(userResponse);

      // Get user's tasks
      const tasksResponse = await taskAPI.getAll();
      setTasks(tasksResponse.data);
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to load user data');
      if ((err as any)?.message?.includes('No active session') || (err as any).response?.status === 401) {
        // Unauthorized - token might be invalid
        setIsLoggedIn(false);
        setUser(null);
      }
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const response = await authAPI.login(email, password);

      // If we reach this point, login was successful
      // The authClient.signIn method throws an error on failure
      setIsLoggedIn(true);
      await loadUserData();
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed');
      throw err;
    }
  };

  const register = async (email: string, password: string) => {
    try {
      setError(null);
      await authAPI.register(email, password);

      // User is automatically logged in after registration
      setIsLoggedIn(true);
      await loadUserData();
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed');
      throw err;
    }
  };

  const logout = async () => {
    await authAPI.logout();
    setIsLoggedIn(false);
    setUser(null);
    setTasks([]);
  };

  const addTask = async (title: string, description?: string) => {
    try {
      setError(null);
      const response = await taskAPI.create(title, description);
      setTasks([...tasks, response.data]);
    } catch (err: any) {
      console.error('Error creating task:', err);
      setError(err.response?.data?.detail || 'Failed to create task');
      throw err;
    }
  };

  const toggleTask = async (id: string) => {
    try {
      setError(null);
      const response = await taskAPI.toggleCompleted(id);
      setTasks(tasks.map(task =>
        task.id === id ? response.data : task
      ));
    } catch (err: any) {
      console.error('Error toggling task:', err);
      setError(err.response?.data?.detail || 'Failed to update task');
      throw err;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      setError(null);
      await taskAPI.delete(id);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (err: any) {
      console.error('Error deleting task:', err);
      setError(err.response?.data?.detail || 'Failed to delete task');
      throw err;
    }
  };

  const updateTask = async (id: string, data: Partial<{ title: string; description: string; completed: boolean }>) => {
    try {
      setError(null);
      const response = await taskAPI.update(id, data);
      setTasks(tasks.map(task =>
        task.id === id ? response.data : task
      ));
    } catch (err: any) {
      console.error('Error updating task:', err);
      setError(err.response?.data?.detail || 'Failed to update task');
      throw err;
    }
  };

  const value = {
    user,
    tasks,
    loading,
    error,
    isLoggedIn,
    login,
    register,
    logout,
    addTask,
    toggleTask,
    deleteTask,
    updateTask,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};