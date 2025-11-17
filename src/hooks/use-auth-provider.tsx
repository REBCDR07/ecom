"use client";
import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { useAuth } from './use-auth'; // The actual hook logic

// Define the shape of the context data
type AuthContextType = ReturnType<typeof useAuth> | { user: undefined | null };

// Create the context
const AuthContext = createContext<AuthContextType>({ user: undefined });

// Create the provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useAuth();
  const contextValue = useMemo(() => auth, [auth.user]);
  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

// Create a hook to use the auth context
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  // The user can be undefined while loading, so we have to cast here
  // after ensuring our components can handle the undefined state.
  return context as ReturnType<typeof useAuth>;
};
