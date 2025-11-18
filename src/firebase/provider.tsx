
'use client';
import { FirebaseApp } from 'firebase/app';
import { Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import React, { createContext, useContext } from 'react';

// Define the context shape
interface FirebaseContextType {
    firebaseApp: FirebaseApp | null;
    auth: Auth | null;
    firestore: Firestore | null;
}

// Create the context with a default value
const FirebaseContext = createContext<FirebaseContextType>({
    firebaseApp: null,
    auth: null,
    firestore: null,
});

// Create the provider component
export function FirebaseProvider({
    children,
    firebaseApp,
    auth,
    firestore,
}: {
    children: React.ReactNode;
    firebaseApp: FirebaseApp;
    auth: Auth;
    firestore: Firestore;
}) {
    return (
        <FirebaseContext.Provider value={{ firebaseApp, auth, firestore }}>
            {children}
        </FirebaseContext.Provider>
    );
}

// Custom hooks to use the Firebase services
export const useFirebaseApp = () => {
    const context = useContext(FirebaseContext);
    if (!context.firebaseApp) {
        throw new Error('useFirebaseApp must be used within a FirebaseProvider');
    }
    return context.firebaseApp;
};

export const useAuth = () => {
    const context = useContext(FirebaseContext);
    if (!context.auth) {
        throw new Error('useAuth must be used within a FirebaseProvider');
    }
    return context.auth;
};

export const useFirestore = () => {
    const context = useContext(FirebaseContext);
    if (!context.firestore) {
        throw new Error('useFirestore must be used within a FirebaseProvider');
    }
    return context.firestore;
};
