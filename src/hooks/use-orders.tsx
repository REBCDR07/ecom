
"use client";

import { useCallback } from 'react';
import { Order, Product, User } from '@/lib/types';
import { useNotifications } from './use-notifications';

const ORDERS_KEY = 'marketconnect_orders';

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

    const createOrder = useCallback((product: Product, buyer: User, orderDetails: Omit<Order, 'id' | 'productId' | 'productName' | 'productImage' | 'price' | 'quantity' | 'sellerId' | 'buyerId' | 'orderDate' | 'status'>) => {
        const orders: Order[] = getFromStorage(ORDERS_KEY);
        const newOrder: Order = {
            id: `order_${crypto.randomUUID()}`,
            productId: product.id,
            productName: product.name,
            productImage: product.image,
            price: product.promotionalPrice || product.price,
            quantity: 1, // Defaulting to 1 for simplicity
            sellerId: product.sellerId,
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
            link: '/seller/dashboard'
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

    const updateOrderStatus = useCallback((orderId: string, status: 'pending' | 'shipped' | 'delivered') => {
        const allOrders: Order[] = getFromStorage(ORDERS_KEY);
        const updatedOrders = allOrders.map(order => 
            order.id === orderId ? { ...order, status } : order
        );
        saveToStorage(ORDERS_KEY, updatedOrders);
    }, [getFromStorage, saveToStorage]);


    return {
        createOrder,
        getOrdersForSeller,
        getOrdersForBuyer,
        updateOrderStatus,
    };
};
