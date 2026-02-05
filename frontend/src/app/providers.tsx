'use client';

import { AppProvider } from '@/context/AppContext';
import React, { createContext, useContext, ReactNode } from 'react';
import { BetterAuthClient } from '@/lib/betterAuth';

// Create Auth Context
interface AuthContextType {
  authClient: BetterAuthClient;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Component
export function AuthProvider({ children }: { children: ReactNode }) {
  const authClient = new BetterAuthClient();

  return (
    <AuthContext.Provider value={{ authClient }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Main Providers component
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AppProvider>
        {children}
      </AppProvider>
    </AuthProvider>
  );
}
