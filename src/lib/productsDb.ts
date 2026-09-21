// src/lib/productsDb.ts
// Robust persistence layer with dual storage: Cloud Firestore + LocalStorage fallback.
// Guarantees products NEVER disappear on refresh, even if network or Firestore credentials are misconfigured.

import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  writeBatch,
  Unsubscribe,
  query,
} from 'firebase/firestore';
import { db } from './firebase';
import { Product } from '../types';
import { PRODUCTS } from '../data/products';

const COLLECTION = 'products';
const STORAGE_KEY = 'danitech_products';
const INITIALIZED_KEY = 'danitech_db_initialized';

/**
 * Load cached products from localStorage, falling back to default PRODUCTS.
 */
export function getStoredProducts(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn('[Dani Tech] Could not read local products cache:', e);
  }
  return PRODUCTS;
}

/**
 * Persist products to localStorage and dispatch update event.
 */
export function persistLocalProducts(products: Product[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    window.dispatchEvent(new Event('danitech_products_updated'));
  } catch (e) {
    console.error('[Dani Tech] Failed to write local products cache:', e);
  }
}

/**
 * Subscribe to real-time product updates from Firestore.
 * Updates local cache on every snapshot and handles errors gracefully without resetting user data.
 */
export function subscribeToProducts(
  onData: (products: Product[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  let isSubscribed = true;

  try {
    const q = query(collection(db, COLLECTION));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!isSubscribed) return;

        // If Firestore is completely empty on very first install
        if (snapshot.empty) {
          const hasInitialized = localStorage.getItem(INITIALIZED_KEY);
          if (!hasInitialized) {
            // First time setup: seed the defaults into Firestore
            localStorage.setItem(INITIALIZED_KEY, 'true');
            seedDefaultProducts().catch((err) =>
              console.warn('[Dani Tech] Seed error:', err)
            );
            return;
          }
          // If already initialized and empty, the user intentionally deleted all products
          persistLocalProducts([]);
          onData([]);
          return;
        }

        localStorage.setItem(INITIALIZED_KEY, 'true');
        const firestoreProducts: Product[] = snapshot.docs.map((d) => d.data() as Product);
        persistLocalProducts(firestoreProducts);
        onData(firestoreProducts);
      },
      (err) => {
        console.warn('[Dani Tech] Firestore live sync unavailable, using local cache:', err.message);
        // DO NOT overwrite user products with defaults! Keep existing products from localStorage.
        onData(getStoredProducts());
        onError?.(err);
      }
    );

    return () => {
      isSubscribed = false;
      unsubscribe();
    };
  } catch (err: any) {
    console.warn('[Dani Tech] Firestore init error, using local storage:', err.message);
    onData(getStoredProducts());
    return () => {};
  }
}

/**
 * Save (create or update) a single product in both Firestore and local cache.
 */
export async function saveProduct(product: Product): Promise<void> {
  // 1. Immediately update local cache so UI is instant and persistent
  const current = getStoredProducts();
  const index = current.findIndex((p) => p.id === product.id);
  const updated = index >= 0
    ? current.map((p) => (p.id === product.id ? product : p))
    : [product, ...current];
  persistLocalProducts(updated);

  // 2. Sync to Firestore in the cloud
  try {
    const ref = doc(db, COLLECTION, product.id);
    await setDoc(ref, product, { merge: true });
  } catch (err) {
    console.warn('[Dani Tech] Firestore save warning (stored locally):', err);
  }
}

/**
 * Delete a single product by id from both Firestore and local cache.
 */
export async function deleteProduct(productId: string): Promise<void> {
  // 1. Immediately update local cache
  const current = getStoredProducts();
  const updated = current.filter((p) => p.id !== productId);
  persistLocalProducts(updated);

  // 2. Delete from Firestore in the cloud
  try {
    const ref = doc(db, COLLECTION, productId);
    await deleteDoc(ref);
  } catch (err) {
    console.warn('[Dani Tech] Firestore delete warning (deleted locally):', err);
  }
}

/**
 * Replace entire catalogue in batch (used for "Reset to Defaults").
 */
export async function replaceAllProducts(products: Product[]): Promise<void> {
  persistLocalProducts(products);

  try {
    const batch = writeBatch(db);
    products.forEach((p) => {
      const ref = doc(db, COLLECTION, p.id);
      batch.set(ref, p);
    });
    await batch.commit();
  } catch (err) {
    console.warn('[Dani Tech] Firestore replace batch warning:', err);
  }
}

/**
 * One-time seed of initial catalog.
 */
export async function seedDefaultProducts(): Promise<void> {
  await replaceAllProducts(PRODUCTS);
}
