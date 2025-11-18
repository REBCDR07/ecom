
// src/firebase/config.ts
import { FirebaseOptions, initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';

const firebaseConfig: FirebaseOptions = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// Initialize Firebase safely
function initializeAppIfNotExists(): FirebaseApp {
    if (typeof window === 'undefined') {
        // On the server, we don't initialize. 
        // We might need a different setup for server-side Firebase actions in the future.
        // For now, client-side only is fine.
        return null as any; 
    }

    const apps = getApps();
    if (apps.length > 0) {
        return getApp(); // Return the existing app
    }
    return initializeApp(firebaseConfig); // Initialize a new app
}

export const firebaseApp = initializeAppIfNotExists();
