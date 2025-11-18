
"use client";

import { Seller, SellerApplication, Product } from '@/lib/types';
import { useCallback } from 'react';

const PENDING_SELLERS_KEY = 'pending_sellers';
const APPROVED_SELLERS_KEY = 'approved_sellers';


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
            id: `seller_${crypto.randomUUID()}`,
            submissionDate: new Date().toISOString(),
            status: 'pending',
        };
        saveToStorage(PENDING_SELLERS_KEY, [...pendingSellers, newSellerApplication]);
    }, [getPendingSellers, saveToStorage]);

    const approveSeller = useCallback((sellerId: string) => {
        const pendingSellers: SellerApplication[] = getFromStorage(PENDING_SELLERS_KEY);
        const approvedSellers: Seller[] = getFromStorage(APPROVED_SELLERS_KEY);

        const sellerToApprove = pendingSellers.find(s => s.id === sellerId);

        if (sellerToApprove) {
            const remainingPending = pendingSellers.filter(s => s.id !== sellerId);
            
            const defaultProfilePic = `https://picsum.photos/seed/${sellerToApprove.id}/100/100`;
            const defaultBannerPic = `https://picsum.photos/seed/${sellerToApprove.id}-banner/1600/400`;

            const newApprovedSeller: Seller = {
                id: sellerToApprove.id,
                companyName: sellerToApprove.companyName,
                profilePicture: sellerToApprove.profilePicture || defaultProfilePic,
                bannerPicture: sellerToApprove.bannerPicture || defaultBannerPic,
                imageHint: 'portrait',
                firstName: sellerToApprove.firstName,
                lastName: sellerToApprove.lastName,
                email: sellerToApprove.email,
                phone: sellerToApprove.phone,
                whatsapp: sellerToApprove.whatsapp,
                address: sellerToApprove.address,
                password: sellerToApprove.password, 
                type: 'seller',
                products: []
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

    const addProduct = useCallback((sellerId: string, productData: Omit<Product, 'id' | 'sellerId' | 'sellerName'>) => {
        const approvedSellers: Seller[] = getFromStorage(APPROVED_SELLERS_KEY);
        const seller = approvedSellers.find(s => s.id === sellerId);

        if (seller) {
            const newProduct: Product = {
                ...productData,
                id: `prod_${crypto.randomUUID()}`,
                sellerId: seller.id,
                sellerName: seller.companyName,
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

    return {
        getPendingSellers,
        addPendingSeller,
        approveSeller,
        rejectSeller,
        addProduct,
        updateProduct,
        deleteProduct,
        getSellerById,
    };
};
