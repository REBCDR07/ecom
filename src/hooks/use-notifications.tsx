
"use client";

import { useCallback } from 'react';
import { Notification } from '@/lib/types';

const NOTIFICATIONS_KEY = 'marketconnect_notifications';

export const useNotifications = () => {

    const getFromStorage = useCallback((key: string): Notification[] => {
        if (typeof window === 'undefined') return [];
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : [];
        } catch (error) {
            console.error(`Error reading from localStorage key “${key}”:`, error);
            return [];
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

    const createNotification = useCallback((data: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
        const allNotifications = getFromStorage(NOTIFICATIONS_KEY);
        const newNotification: Notification = {
            ...data,
            id: `notif_${crypto.randomUUID()}`,
            timestamp: new Date().toISOString(),
            isRead: false,
        };
        saveToStorage(NOTIFICATIONS_KEY, [...allNotifications, newNotification]);
    }, [getFromStorage, saveToStorage]);

    const getUnreadNotificationsForUser = useCallback((userIdOrAdmin: string) => {
        const allNotifications = getFromStorage(NOTIFICATIONS_KEY);
        return allNotifications.filter(n => {
            const isForAdmin = n.userType === 'admin' && userIdOrAdmin === 'admin';
            const isForSeller = n.userType === 'seller' && n.userId === userIdOrAdmin;
            return (isForAdmin || isForSeller) && !n.isRead;
        }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }, [getFromStorage]);

    const markNotificationsAsRead = useCallback((userIdOrAdmin: string) => {
        const allNotifications = getFromStorage(NOTIFICATIONS_KEY);
        const updatedNotifications = allNotifications.map(n => {
            const isForAdmin = n.userType === 'admin' && userIdOrAdmin === 'admin';
            const isForSeller = n.userType === 'seller' && n.userId === userIdOrAdmin;
            if (isForAdmin || isForSeller) {
                return { ...n, isRead: true };
            }
            return n;
        });
        saveToStorage(NOTIFICATIONS_KEY, updatedNotifications);
    }, [getFromStorage, saveToStorage]);

    return {
        createNotification,
        getUnreadNotificationsForUser,
        markNotificationsAsRead,
    };
};
