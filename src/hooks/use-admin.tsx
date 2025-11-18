
"use client";

import { useCallback } from 'react';
import { AdminProfile } from '@/lib/types';

const ADMIN_PROFILE_KEY = 'admin_profile';

const defaultProfile: AdminProfile = {
  firstName: 'Admin',
  lastName: 'MarketConnect',
  email: 'admin@marketconnect.com',
  phone: '',
  whatsapp: '',
  bio: 'Dédié à la promotion des artisans et vendeurs locaux du Bénin.',
};

export const useAdmin = () => {
    
    const getFromStorage = useCallback((key: string): any | null => {
        if (typeof window === 'undefined') return null;
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error(`Error reading from localStorage key “${key}”:`, error);
            return null;
        }
    }, []);

    const saveToStorage = useCallback((key: string, value: any) => {
        if (typeof window === 'undefined') return;
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Error writing to localStorage key “${key}”:`, error);
        }
    }, []);

    const getAdminProfile = useCallback((): AdminProfile => {
        const profile = getFromStorage(ADMIN_PROFILE_KEY);
        return profile || defaultProfile;
    }, [getFromStorage]);

    const saveAdminProfile = useCallback((profileData: Partial<AdminProfile>) => {
        const currentProfile = getAdminProfile();
        const newProfile = { ...currentProfile, ...profileData };
        saveToStorage(ADMIN_PROFILE_KEY, newProfile);
    }, [getAdminProfile, saveToStorage]);

    return {
        getAdminProfile,
        saveAdminProfile,
    };
};
