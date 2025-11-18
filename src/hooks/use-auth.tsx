"use client";

import { User } from '@/lib/types';
import { useState, useEffect, useCallback } from 'react';

const AUTH_KEY = 'marketconnect_auth';

export const useAuth = () => {
  // undefined means we haven't checked localStorage yet
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(AUTH_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null); // No user in storage
      }
    } catch (error) {
      console.error("Failed to parse auth user from localStorage", error);
      localStorage.removeItem(AUTH_KEY);
      setUser(null); // Set to null on error
    }
  }, []);

  const login = useCallback((email: string, password?: string, isAdmin = false): User | null => {
    try {
      if (typeof window === 'undefined') return null;

      if (isAdmin) {
          const adminUser: User = {
              id: 'admin_user',
              firstName: 'Admin',
              lastName: 'User',
              email: 'admin@marketconnect.com',
              type: 'admin',
          };
          localStorage.setItem(AUTH_KEY, JSON.stringify(adminUser));
          setUser(adminUser);
          return adminUser;
      }

      const approvedSellers: User[] = JSON.parse(localStorage.getItem('approved_sellers') || '[]');
      const buyers: User[] = JSON.parse(localStorage.getItem('buyers') || '[]');
      
      const foundSeller = approvedSellers.find((s: User) => s.email === email && s.password === password);
      const foundBuyer = buyers.find((b: User) => b.email === email && b.password === password);

      const foundUser = foundSeller || foundBuyer;

      if (foundUser) {
        localStorage.setItem(AUTH_KEY, JSON.stringify(foundUser));
        setUser(foundUser);
        return foundUser;
      }
      return null;
    } catch (error) {
       console.error("Failed to login", error);
       return null;
    }
  }, []);

  const logout = useCallback(() => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(AUTH_KEY);
    setUser(null);
  }, []);

  return { user, login, logout };
};
