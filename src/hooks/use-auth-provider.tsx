
"use client";
import React, { createContext, useContext, ReactNode } from 'react';
import { useAuthLogic } from './use-auth';

// Define the shape of the context data
// We add "user: undefined" to represent the loading state
type AuthContextType = ReturnType<typeof useAuthLogic> | { user: undefined };

// Create the context with undefined user as default (loading)
const AuthContext = createContext<AuthContextType>({ user: undefined });

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
  // The user can be undefined while loading, so we have to cast here
  // after ensuring our components can handle the undefined state.
  return context as ReturnType<typeof useAuthLogic>;
};
