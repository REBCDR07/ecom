

"use client";

import { useCallback } from 'react';
import { Order, Product, User, Seller } from '@/lib/types';
import { useNotifications } from './use-notifications';

const ORDERS_KEY = 'marketconnect_orders';
const APPROVED_SELLERS_KEY = 'approved_sellers';

export const useOrders = () => {
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

    const createOrder = useCallback((product: Product, buyer: User, orderDetails: Pick<Order, 'buyerInfo'>) => {
        const orders: Order[] = getFromStorage(ORDERS_KEY);
        const approvedSellers: Seller[] = getFromStorage(APPROVED_SELLERS_KEY);
        const seller = approvedSellers.find(s => s.id === product.sellerId);

        if (!seller) {
            console.error("Seller not found for product:", product.id);
            return;
        }

        const newOrder: Order = {
            id: `order_${crypto.randomUUID()}`,
            productId: product.id,
            productName: product.name,
            productImage: product.image,
            price: product.promotionalPrice || product.price,
            quantity: 1, // Defaulting to 1 for simplicity
            sellerId: product.sellerId,
            sellerPhone: seller.phone, // Store seller's phone on the order
            buyerId: buyer.id,
            ...orderDetails,
            orderDate: new Date().toISOString(),
            status: 'pending',
        };
        saveToStorage(ORDERS_KEY, [...orders, newOrder]);
        
        // Create a notification for the seller
        createNotification({
            userId: product.sellerId,
            userType: 'seller',
            type: 'new_order',
            message: `Nouvelle commande pour : ${product.name}.`,
            link: `/seller/dashboard`
        });

    }, [getFromStorage, saveToStorage, createNotification]);

    const getOrdersForSeller = useCallback((sellerId: string): Order[] => {
        const allOrders: Order[] = getFromStorage(ORDERS_KEY);
        return allOrders.filter(order => order.sellerId === sellerId).sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
    }, [getFromStorage]);

    const getOrdersForBuyer = useCallback((buyerId: string): Order[] => {
        const allOrders: Order[] = getFromStorage(ORDERS_KEY);
        return allOrders.filter(order => order.buyerId === buyerId).sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
    }, [getFromStorage]);

    const getOrderById = useCallback((orderId: string): Order | null => {
        const allOrders: Order[] = getFromStorage(ORDERS_KEY);
        return allOrders.find(order => order.id === orderId) || null;
    }, [getFromStorage]);

    const updateOrderStatus = useCallback((orderId: string, status: Order['status']) => {
        const allOrders: Order[] = getFromStorage(ORDERS_KEY);
        const updatedOrders = allOrders.map(order => 
            order.id === orderId ? { ...order, status } : order
        );
        saveToStorage(ORDERS_KEY, updatedOrders);
    }, [getFromStorage, saveToStorage]);
    
    const submitPaymentProof = useCallback((orderId: string, proofDataUrl: string) => {
        const allOrders: Order[] = getFromStorage(ORDERS_KEY);
        let sellerToNotifyId: string | null = null;

        const updatedOrders = allOrders.map(order => {
            if (order.id === orderId) {
                sellerToNotifyId = order.sellerId;
                return { ...order, status: 'awaiting_confirmation' as const, paymentProof: proofDataUrl };
            }
            return order;
        });

        saveToStorage(ORDERS_KEY, updatedOrders);

        if(sellerToNotifyId) {
            createNotification({
                userId: sellerToNotifyId,
                userType: 'seller',
                type: 'payment_proof_submitted',
                message: `Preuve de paiement reçue pour la commande #${orderId.slice(0,6)}...`,
                link: `/seller/dashboard`
            });
        }
    }, [createNotification, getFromStorage, saveToStorage]);


    return {
        createOrder,
        getOrdersForSeller,
        getOrdersForBuyer,
        getOrderById,
        updateOrderStatus,
        submitPaymentProof
    };
};
