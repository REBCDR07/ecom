
"use client";

import { Seller, SellerApplication, Product, User } from '@/lib/types';
import { useCallback } from 'react';
import { useNotifications } from './use-notifications';

const PENDING_SELLERS_KEY = 'pending_sellers';
const APPROVED_SELLERS_KEY = 'approved_sellers';
const USERS_KEY = 'users';


export const useSellers = () => {
    const { createNotification } = useNotifications();
    
    const getFromStorage = useCallback((key: string): any[] => {
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
            id: `seller_app_${crypto.randomUUID()}`,
            submissionDate: new Date().toISOString(),
            status: 'pending',
        };
        saveToStorage(PENDING_SELLERS_KEY, [...pendingSellers, newSellerApplication]);
         // Create a notification for the admin
        createNotification({
            userType: 'admin',
            type: 'new_seller_application',
            message: `Nouvelle demande de vendeur: ${sellerData.companyName}.`,
            link: '/admin/dashboard'
        });
    }, [getPendingSellers, saveToStorage, createNotification]);

    const approveSeller = useCallback(async (applicationId: string) => {
        const pendingSellers: SellerApplication[] = getFromStorage(PENDING_SELLERS_KEY);
        const approvedSellers: Seller[] = getFromStorage(APPROVED_SELLERS_KEY);

        const appToApprove = pendingSellers.find(s => s.id === applicationId);

        if (appToApprove) {
            const sellerId = `seller_${crypto.randomUUID()}`;
            const newSeller: Seller = {
                uid: sellerId,
                id: sellerId,
                role: 'seller',
                email: appToApprove.email,
                displayName: `${appToApprove.firstName} ${appToApprove.lastName}`,
                companyName: appToApprove.companyName,
                profilePicture: appToApprove.profilePicture || `https://picsum.photos/seed/${sellerId}/100/100`,
                bannerPicture: appToApprove.bannerPicture || `https://picsum.photos/seed/${sellerId}-banner/1600/400`,
                imageHint: 'portrait',
                phone: appToApprove.phone,
                whatsapp: appToApprove.whatsapp,
                address: appToApprove.address,
                products: [],
                password: appToApprove.password
            };

            const remainingPending = pendingSellers.filter(s => s.id !== applicationId);
            saveToStorage(PENDING_SELLERS_KEY, remainingPending);
            saveToStorage(APPROVED_SELLERS_KEY, [...approvedSellers, newSeller]);
        }
    }, [getFromStorage, saveToStorage]);

    const rejectSeller = useCallback((applicationId: string) => {
        const pendingSellers: SellerApplication[] = getFromStorage(PENDING_SELLERS_KEY);
        const remainingPending = pendingSellers.filter(s => s.id !== applicationId);
        saveToStorage(PENDING_SELLERS_KEY, remainingPending);
    }, [getFromStorage, saveToStorage]);

    const addProduct = useCallback((sellerId: string, productData: Omit<Product, 'id' | 'sellerId' | 'sellerName' | 'createdAt'>) => {
        const approvedSellers: Seller[] = getFromStorage(APPROVED_SELLERS_KEY);
        const seller = approvedSellers.find(s => s.id === sellerId);

        if (seller) {
            const newProduct: Product = {
                ...productData,
                id: `prod_${crypto.randomUUID()}`,
                sellerId: seller.id,
                sellerName: seller.companyName,
                createdAt: new Date().toISOString()
            };

            const updatedSellers = approvedSellers.map(s => 
                s.id === sellerId 
                ? { ...s, products: [...(s.products || []), newProduct] }
                : s
            );
            saveToStorage(APPROVED_SELLERS_KEY, updatedSellers);
        }
    }, [getFromStorage, saveToStorage]);

    const updateProduct = useCallback((sellerId: string, updatedProduct: Product) => {
        const approvedSellers: Seller[] = getFromStorage(APPROVED_SELLERS_KEY);
        const updatedSellers = approvedSellers.map(seller => {
            if (seller.id === sellerId) {
                const updatedProducts = (seller.products || []).map(p => 
                    p.id === updatedProduct.id ? updatedProduct : p
                );
                return { ...seller, products: updatedProducts };
            }
            return seller;
        });
        saveToStorage(APPROVED_SELLERS_KEY, updatedSellers);
    }, [getFromStorage, saveToStorage]);

    const deleteProduct = useCallback((sellerId: string, productId: string) => {
        const approvedSellers: Seller[] = getFromStorage(APPROVED_SELLERS_KEY);
        const updatedSellers = approvedSellers.map(seller => {
            if (seller.id === sellerId) {
                const remainingProducts = (seller.products || []).filter(p => p.id !== productId);
                return { ...seller, products: remainingProducts };
            }
            return seller;
        });
        saveToStorage(APPROVED_SELLERS_KEY, updatedSellers);
    }, [getFromStorage, saveToStorage]);
    
    const getSellerById = useCallback((sellerId: string): Seller | null => {
        const approvedSellers: Seller[] = getFromStorage(APPROVED_SELLERS_KEY);
        return approvedSellers.find(s => s.id === sellerId) || null;
    }, [getFromStorage]);

    const updateSellerProfile = useCallback((sellerId: string, profileData: Partial<Seller>) => {
        const sellers = getFromStorage(APPROVED_SELLERS_KEY) as Seller[];
        const updatedSellers = sellers.map(seller => 
            seller.id === sellerId ? { ...seller, ...profileData } : seller
        );
        saveToStorage(APPROVED_SELLERS_KEY, updatedSellers);
    }, [getFromStorage, saveToStorage]);

    return {
        getPendingSellers,
        addPendingSeller,
        approveSeller,
        rejectSeller,
        addProduct,
        updateProduct,
        deleteProduct,
        getSellerById,
        updateSellerProfile
    };
};
