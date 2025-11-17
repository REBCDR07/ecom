"use client";

import { User } from '@/lib/types';
import { useState, useEffect, useCallback } from 'react';

const AUTH_KEY = 'marketconnect_auth';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(AUTH_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse auth user from localStorage", error);
      localStorage.removeItem(AUTH_KEY);
    }
  }, []);

  const login = useCallback((email: string, password?: string): User | null => {
    try {
      const approvedSellers = JSON.parse(localStorage.getItem('approved_sellers') || '[]');
      // In a real app, you'd also check buyers.
      // const buyers = JSON.parse(localStorage.getItem('buyers') || '[]');
      
      const foundSeller = approvedSellers.find((s: User) => s.email === email && s.password === password);
      // const foundBuyer = buyers.find((b: User) => b.email === email && b.password === password);

      const foundUser = foundSeller; // Or combine with buyer logic

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
    localStorage.removeItem(AUTH_KEY);
    setUser(null);
  }, []);

  return { user, login, logout };
};
