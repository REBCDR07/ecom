
// src/firebase/config.ts
import { FirebaseOptions, initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';

// Using valid-format but dummy credentials to allow Firebase to initialize without errors.
// In a real production app, these would be replaced with actual credentials from environment variables.
const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyA_...dummy...",
  authDomain: "dummy-project.firebaseapp.com",
  projectId: "dummy-project",
  storageBucket: "dummy-project.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:dummy",
};

// Initialize Firebase safely for both client and server environments
let firebaseApp: FirebaseApp;

if (getApps().length === 0) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApp();
}

export { firebaseApp };
