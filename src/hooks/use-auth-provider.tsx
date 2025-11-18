
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuth as useFirebaseAuth, useFirestore } from '@/firebase/provider';
import type { User as AppUser } from '@/lib/types';

// Define the shape of the context data
interface AuthContextType {
  user: AppUser | null | undefined;
  signUp: (email: string, password?: string, additionalData?: Partial<AppUser>) => Promise<any>;
  signIn: (email: string, password?: string) => Promise<any>;
  adminLogin: (password: string) => Promise<AppUser>;
  signOut: () => Promise<void>;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create the provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useFirebaseAuth();
  const firestore = useFirestore();
  const [user, setUser] = useState<AppUser | null | undefined>(undefined);

  useEffect(() => {
    if (!auth || !firestore) {
      setUser(undefined);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const userDocRef = doc(firestore, 'users', firebaseUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data() as AppUser;
          setUser({ ...userData, uid: firebaseUser.uid });
        } else {
          setUser(null); 
        }
      } else {
        // If no firebase user, and current user is not mock admin, set to null.
        // This prevents the mock admin from being logged out on auth state changes.
        setUser(currentUser => {
            if (currentUser && currentUser.role === 'admin') {
                return currentUser;
            }
            return null;
        });
      }
    });

    return () => unsubscribe();
  }, [auth, firestore]);

  const signUp = useCallback(
    async (email: string, password?: string, additionalData: Partial<AppUser> = {}) => {
      if (!auth || !firestore) throw new Error("Firebase not initialized");

      const userCredential = await createUserWithEmailAndPassword(auth, email, password!);
      const firebaseUser = userCredential.user;

      const userDocRef = doc(firestore, 'users', firebaseUser.uid);
      const newUser: AppUser = {
        uid: firebaseUser.uid,
        email: firebaseUser.email!,
        role: 'buyer',
        ...additionalData,
      };

      await setDoc(userDocRef, newUser);
      return userCredential;
    },
    [auth, firestore]
  );
  
  const signIn = useCallback(
    async (email: string, password?: string) => {
        if (!auth) throw new Error("Firebase Auth not initialized");
        return signInWithEmailAndPassword(auth, email, password!);
    },
    [auth]
  );

  const adminLogin = useCallback(async (password: string) => {
    if (password === 'BeninShell@2025') {
      const adminUser: AppUser = {
        uid: 'admin_user',
        email: 'admin@marketconnect.com',
        role: 'admin',
        displayName: 'Admin'
      };
      setUser(adminUser);
      return adminUser;
    }
    throw new Error("Mot de passe administrateur incorrect.");
  }, []);

  const signOut = useCallback(async () => {
    // For both mock admin and real users, setting state to null and signing out is safe.
    // onAuthStateChanged will handle the final state for real users.
    setUser(null);
    if (auth) {
        await firebaseSignOut(auth);
    }
  }, [auth]);

  const value = { user, signUp, signIn, adminLogin, signOut };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a hook to use the auth context
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
