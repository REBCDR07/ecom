
'use client';
import { firebaseApp } from '@/firebase/config';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';
import React from 'react';
import { FirebaseProvider } from './provider';

// Create a client-side provider that initializes Firebase on the client
export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
    // Firebase app must be initialized before we can get auth and firestore
    if (!firebaseApp) {
        // You can return a loading state here if you want
        return <>{children}</>;
    }

    const auth = getAuth(firebaseApp);
    const firestore = getFirestore(firebaseApp);

    return (
        <FirebaseProvider firebaseApp={firebaseApp} auth={auth} firestore={firestore}>
            {children}
        </FirebaseProvider>
    );
}
