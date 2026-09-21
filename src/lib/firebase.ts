// src/lib/firebase.ts
// Firebase app initialisation — reads config from Vite environment variables.
// All VITE_FIREBASE_* vars must be set in Vercel → Environment Variables.

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

// Prevent duplicate initialisation in HMR dev environments
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);
