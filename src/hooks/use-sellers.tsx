"use client";

import { Seller, SellerApplication } from '@/lib/types';
import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

const PENDING_SELLERS_KEY = 'pending_sellers';
const APPROVED_SELLERS_KEY = 'approved_sellers';

// Mock uuid for client-side rendering
const mockUuid = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

export const useSellers = () => {
    
    const getFromStorage = useCallback((key: string) => {
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

    const getPendingSellers = useCallback((): SellerApplication[] => {
        return getFromStorage(PENDING_SELLERS_KEY);
    }, [getFromStorage]);

    const addPendingSeller = useCallback((sellerData: Omit<SellerApplication, 'id' | 'submissionDate' | 'status'>) => {
        const pendingSellers = getPendingSellers();
        const newSellerApplication: SellerApplication = {
            ...sellerData,
            id: mockUuid(),
            submissionDate: new Date().toISOString(),
            status: 'pending',
            type: 'seller'
        };
        saveToStorage(PENDING_SELLERS_KEY, [...pendingSellers, newSellerApplication]);
    }, [getPendingSellers, saveToStorage]);

    const approveSeller = useCallback((sellerId: string) => {
        const pendingSellers: SellerApplication[] = getFromStorage(PENDING_SELLERS_KEY);
        const approvedSellers: Seller[] = getFromStorage(APPROVED_SELLERS_KEY);

        const sellerToApprove = pendingSellers.find(s => s.id === sellerId);

        if (sellerToApprove) {
            const remainingPending = pendingSellers.filter(s => s.id !== sellerId);
            
            const newApprovedSeller: Seller = {
                id: sellerToApprove.id,
                companyName: sellerToApprove.companyName,
                profilePicture: `https://picsum.photos/seed/${sellerToApprove.id}/100/100`, // Placeholder
                imageHint: 'portrait', // Placeholder
                // Transfer other relevant data
                firstName: sellerToApprove.firstName,
                lastName: sellerToApprove.lastName,
                email: sellerToApprove.email,
                phone: sellerToApprove.phone,
                whatsapp: sellerToApprove.whatsapp,
                address: sellerToApprove.address,
                password: sellerToApprove.password, // IMPORTANT: In a real app, never store passwords like this.
                type: 'seller'
            };

            saveToStorage(PENDING_SELLERS_KEY, remainingPending);
            saveToStorage(APPROVED_SELLERS_KEY, [...approvedSellers, newApprovedSeller]);
        }
    }, [getFromStorage, saveToStorage]);

    const rejectSeller = useCallback((sellerId: string) => {
        const pendingSellers: SellerApplication[] = getFromStorage(PENDING_SELLERS_KEY);
        const remainingPending = pendingSellers.filter(s => s.id !== sellerId);
        saveToStorage(PENDING_SELLERS_KEY, remainingPending);
    }, [getFromStorage, saveToStorage]);
    
    return {
        getPendingSellers,
        addPendingSeller,
        approveSeller,
        rejectSeller,
    };
};
