// src/lib/firebase.ts
// Firebase app initialisation — reads config from Vite environment variables.
// Automatically cleans accidental quotes, commas, or semicolons from pasted env vars.

import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeFirestore, getFirestore } from 'firebase/firestore';

function cleanEnv(val: unknown): string {
  if (typeof val !== 'string') return '';
  return val.trim().replace(/^["']+|["',;]+$/g, '').trim();
}

const firebaseConfig = {
  apiKey:            cleanEnv(import.meta.env.VITE_FIREBASE_API_KEY),
  authDomain:        cleanEnv(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN),
  projectId:         cleanEnv(import.meta.env.VITE_FIREBASE_PROJECT_ID),
  storageBucket:     cleanEnv(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: cleanEnv(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID),
  appId:             cleanEnv(import.meta.env.VITE_FIREBASE_APP_ID),
};

if (firebaseConfig.apiKey && firebaseConfig.projectId) {
  console.log('[Dani Tech] ✅ Firebase initialized for project:', firebaseConfig.projectId);
} else {
  console.error('[Dani Tech] ❌ Firebase configuration missing or incomplete.');
}

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore with ignoreUndefinedProperties to prevent write rejections
export const db = (() => {
  try {
    return initializeFirestore(app, {
      ignoreUndefinedProperties: true,
    });
  } catch {
    return getFirestore(app);
  }
})();
