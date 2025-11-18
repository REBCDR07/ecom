
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { User as AppUser, SellerApplication } from '@/lib/types';
import { useSellers } from './use-sellers';

const AUTH_USER_KEY = 'marketconnect_user';

interface AuthContextType {
  user: AppUser | null | undefined;
  signUp: (email: string, password?: string, additionalData?: Partial<AppUser>) => Promise<AppUser>;
  signIn: (email: string, password?: string) => Promise<AppUser>;
  adminLogin: (password: string) => Promise<AppUser>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(AUTH_USER_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      setUser(null);
    } finally {
        setLoading(false);
    }
  }, []);

  const updateUserInStorage = (userState: AppUser | null) => {
    setUser(userState);
    if (userState) {
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userState));
    } else {
        localStorage.removeItem(AUTH_USER_KEY);
    }
  }

  const signUp = useCallback(
    async (email: string, password?: string, additionalData: Partial<AppUser> = {}): Promise<AppUser> => {
        const users: AppUser[] = JSON.parse(localStorage.getItem('users') || '[]');
        if (users.find(u => u.email === email)) {
            throw new Error("Un compte avec cet email existe déjà.");
        }

        const newUser: AppUser = {
            id: `user_${crypto.randomUUID()}`,
            uid: `user_${crypto.randomUUID()}`,
            email: email,
            password: password, // In a real app, hash this!
            role: 'buyer',
            ...additionalData,
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        return newUser;
    },
    []
  );
  
  const signIn = useCallback(
    async (email: string, password?: string): Promise<AppUser> => {
        const users: (AppUser & {password?: string})[] = JSON.parse(localStorage.getItem('users') || '[]');
        const approvedSellers: (AppUser & {password?: string})[] = JSON.parse(localStorage.getItem('approved_sellers') || '[]');
        
        const allUsers = [...users, ...approvedSellers];

        const foundUser = allUsers.find(u => u.email === email);
        
        if (foundUser && foundUser.password === password) {
            const { password, ...userToAuth } = foundUser;
            updateUserInStorage(userToAuth);
            return userToAuth;
        }
        
        throw new Error("Email ou mot de passe incorrect.");
    },
    []
  );

  const adminLogin = useCallback(async (password: string): Promise<AppUser> => {
    if (password === 'BeninShell@2025') {
      const adminUser: AppUser = {
        id: 'admin_user',
        uid: 'admin_user',
        email: 'admin@marketconnect.com',
        role: 'admin',
        displayName: 'Admin'
      };
      updateUserInStorage(adminUser);
      return adminUser;
    }
    throw new Error("Mot de passe administrateur incorrect.");
  }, []);

  const signOut = useCallback(async () => {
    updateUserInStorage(null);
  }, []);

  const value = { user, signUp, signIn, adminLogin, signOut, loading };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
