
'use client';

import { useState, useEffect, useCallback } from 'react';
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

export const useAuthLogic = () => {
  const auth = useFirebaseAuth();
  const firestore = useFirestore();
  const [user, setUser] = useState<AppUser | null | undefined>(undefined); // undefined means loading, null means not logged in

  useEffect(() => {
    // This check is crucial. It ensures that the effect only runs when
    // auth and firestore services are fully available from the context.
    if (!auth || !firestore) {
      setUser(undefined); // Explicitly set to loading if services are not ready
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
          // If the user exists in Auth but not Firestore, treat them as logged out.
          // This can happen if the user record in Firestore is deleted but the Auth record remains.
          setUser(null); 
        }
      } else {
        // No user is signed in.
        setUser(null);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [auth, firestore]); // The dependency array ensures this effect re-runs if auth/firestore instances change.

  const signUp = useCallback(
    async (email: string, password?: string, additionalData: Partial<AppUser> = {}) => {
      if (!auth || !firestore) throw new Error("Firebase not initialized");

      const userCredential = await createUserWithEmailAndPassword(auth, email, password!);
      const firebaseUser = userCredential.user;

      const userDocRef = doc(firestore, 'users', firebaseUser.uid);
      const newUser: AppUser = {
        uid: firebaseUser.uid,
        email: firebaseUser.email!,
        role: 'buyer', // default role
        ...additionalData,
      };

      await setDoc(userDocRef, newUser);
      // onAuthStateChanged will handle setting the user state, so no need to call setUser here.
      return userCredential;
    },
    [auth, firestore]
  );
  
  const signIn = useCallback(
    async (email: string, password?: string) => {
        if (!auth) throw new Error("Firebase Auth not initialized");
        // onAuthStateChanged will handle setting the user state.
        return signInWithEmailAndPassword(auth, email, password!);
    },
    [auth]
  );

  const adminLogin = useCallback(async (password: string) => {
    // This is a mock admin login for the prototype.
    if (password === 'BeninShell@2025') {
      const adminUser: AppUser = {
        uid: 'admin_user',
        email: 'admin@marketconnect.com',
        role: 'admin',
        displayName: 'Admin'
      };
      // For the mock admin, we set the user state directly.
      setUser(adminUser);
      return adminUser;
    }
    throw new Error("Mot de passe administrateur incorrect.");
  }, []);

  const signOut = useCallback(async () => {
    // Check if the current user is the mock admin
    if (user?.uid === 'admin_user') {
        setUser(null); // Just clear the state for the mock admin
    } else if (auth) {
        // For regular Firebase users, sign them out.
        // onAuthStateChanged will then set the user state to null.
        await firebaseSignOut(auth);
    }
  }, [auth, user]);

  return { user, signUp, signIn, adminLogin, signOut };
};
