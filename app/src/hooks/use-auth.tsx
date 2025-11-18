
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
  const [user, setUser] = useState<AppUser | null | undefined>(undefined);

  useEffect(() => {
    if (!auth || !firestore) return;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const userDocRef = doc(firestore, 'users', firebaseUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data() as AppUser;
          setUser({ ...userData, uid: firebaseUser.uid });
        } else {
          // This might happen if user record in Firestore is deleted but auth record remains.
          setUser(null); 
        }
      } else {
        setUser(null);
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
        role: 'buyer', // default role
        ...additionalData,
      };

      await setDoc(userDocRef, newUser);
      setUser(newUser);
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
    // This is a mock admin login. In a real app, this should be handled securely.
    if (password === 'BeninShell@2025') {
      const adminUser: AppUser = {
        uid: 'admin_user',
        email: 'admin@marketconnect.com',
        role: 'admin',
        displayName: 'Admin'
      };
      // In a real app, you wouldn't set a user like this.
      // This is a workaround for the prototype.
      setUser(adminUser);
      return adminUser;
    }
    throw new Error("Mot de passe administrateur incorrect.");
  }, []);

  const signOut = useCallback(async () => {
    if (!auth) throw new Error("Firebase Auth not initialized");
    // If it's our mock admin, just clear state.
    if (user?.role === 'admin') {
        setUser(null);
    } else {
        await firebaseSignOut(auth);
    }
  }, [auth, user]);

  return { user, signUp, signIn, adminLogin, signOut };
};
