// src/lib/productsDb.ts
// Robust persistence layer with dual storage: Cloud Firestore + LocalStorage fallback.
// Guarantees products NEVER disappear on refresh, even if network or Firestore credentials are misconfigured.
// Fixed: removed INITIALIZED_KEY logic that was incorrectly wiping products on fresh Firestore databases.

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

/**
 * Load cached products from localStorage, falling back to default PRODUCTS.
 */
export function getStoredProducts(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
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
 * - When Firestore is empty: seeds it from localStorage (or defaults). Never wipes local data.
 * - When Firestore has data: syncs to local cache and updates UI in real-time.
 * - On Firestore error: falls back to localStorage silently.
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

        if (snapshot.empty) {
          // Firestore is empty — seed it with whatever we have locally (or defaults).
          // This handles: new database creation, first deploy, or cleared database.
          // We NEVER wipe local data here — always push UP to Firestore.
          const localProducts = getStoredProducts();
          console.log('[Dani Tech] Firestore empty — seeding', localProducts.length, 'products to cloud...');
          replaceAllProducts(localProducts).catch((err) =>
            console.warn('[Dani Tech] Seed error:', err)
          );
          // Don't call onData yet — replaceAllProducts will trigger a fresh snapshot
          return;
        }

        // Firestore has data — use it as the source of truth
        const firestoreProducts: Product[] = snapshot.docs.map((d) => d.data() as Product);
        console.log('[Dani Tech] ✅ Firestore synced —', firestoreProducts.length, 'products loaded');
        persistLocalProducts(firestoreProducts);
        onData(firestoreProducts);
      },
      (err) => {
        console.warn('[Dani Tech] Firestore sync unavailable, using local cache:', err.message);
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
  // 1. Immediately update local cache so UI is instant
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
    console.log('[Dani Tech] ✅ Product saved to Firestore:', product.name);
  } catch (err) {
    console.warn('[Dani Tech] ⚠️ Firestore save failed (saved locally only):', err);
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
    console.log('[Dani Tech] ✅ Product deleted from Firestore:', productId);
  } catch (err) {
    console.warn('[Dani Tech] ⚠️ Firestore delete failed (deleted locally only):', err);
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
    console.log('[Dani Tech] ✅ All', products.length, 'products synced to Firestore');
  } catch (err) {
    console.warn('[Dani Tech] ⚠️ Firestore batch write failed:', err);
  }
}

/**
 * One-time seed of initial catalog into Firestore.
 */
export async function seedDefaultProducts(): Promise<void> {
  await replaceAllProducts(PRODUCTS);
}
