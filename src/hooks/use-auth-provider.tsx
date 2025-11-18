
"use client";
import React, { createContext, useContext, ReactNode } from 'react';
import { useAuthLogic } from './use-auth'; // The actual hook logic

// Define the shape of the context data
type AuthContextType = ReturnType<typeof useAuthLogic>;

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create the provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const authHook = useAuthLogic();

  return (
    <AuthContext.Provider value={authHook}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a hook to use the auth context
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
