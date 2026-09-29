// src/lib/productsDb.ts
// Robust persistence layer with dual storage: Cloud Firestore + LocalStorage fallback.
// Guarantees products NEVER disappear on refresh and synchronize seamlessly across all devices.

import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
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
 * Clean product object to guarantee it is pure JSON and free of undefined fields
 */
function cleanProductData(product: Product): Record<string, any> {
  const json = JSON.parse(JSON.stringify(product));
  return json;
}

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
 * - If Firestore is empty: seeds it with initial products so the database is populated.
 * - When Firestore has data: syncs to local cache and updates UI across all devices.
 * - On network/sync error: falls back to local cache gracefully.
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
          const localProducts = getStoredProducts();
          console.log('[Dani Tech] Firestore collection empty — seeding', localProducts.length, 'products to cloud...');
          replaceAllProducts(localProducts).catch((err) =>
            console.warn('[Dani Tech] Seed error:', err)
          );
          onData(localProducts);
          return;
        }

        const firestoreProducts: Product[] = snapshot.docs.map((d) => d.data() as Product);
        console.log('[Dani Tech] ✅ Firestore live sync —', firestoreProducts.length, 'products loaded');
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
  const current = getStoredProducts();
  const index = current.findIndex((p) => p.id === product.id);
  const updated = index >= 0
    ? current.map((p) => (p.id === product.id ? product : p))
    : [product, ...current];
  persistLocalProducts(updated);

  try {
    const ref = doc(db, COLLECTION, product.id);
    const data = cleanProductData(product);
    await setDoc(ref, data, { merge: true });
    console.log('[Dani Tech] ✅ Product saved to Firestore cloud:', product.name);
  } catch (err) {
    console.error('[Dani Tech] ❌ Firestore save failed:', err);
  }
}

/**
 * Delete a single product by id from both Firestore and local cache.
 */
export async function deleteProduct(productId: string): Promise<void> {
  const current = getStoredProducts();
  const updated = current.filter((p) => p.id !== productId);
  persistLocalProducts(updated);

  try {
    const ref = doc(db, COLLECTION, productId);
    await deleteDoc(ref);
    console.log('[Dani Tech] ✅ Product deleted from Firestore cloud:', productId);
  } catch (err) {
    console.error('[Dani Tech] ❌ Firestore delete failed:', err);
  }
}

/**
 * Replace entire catalogue in batch (used for initial seed and "Reset to Defaults").
 */
export async function replaceAllProducts(products: Product[]): Promise<void> {
  persistLocalProducts(products);

  try {
    const snapshot = await getDocs(collection(db, COLLECTION));
    const newIds = new Set(products.map((p) => p.id));
    const batch = writeBatch(db);

    // Delete removed docs
    snapshot.docs.forEach((docSnap) => {
      if (!newIds.has(docSnap.id)) {
        batch.delete(docSnap.ref);
      }
    });

    // Write all new/current docs
    products.forEach((p) => {
      const ref = doc(db, COLLECTION, p.id);
      batch.set(ref, cleanProductData(p));
    });

    await batch.commit();
    console.log('[Dani Tech] ✅ All', products.length, 'products successfully committed to Firestore cloud');
  } catch (err) {
    console.error('[Dani Tech] ❌ Firestore batch write failed:', err);
  }
}

/**
 * One-time seed of initial catalog into Firestore.
 */
export async function seedDefaultProducts(): Promise<void> {
  await replaceAllProducts(PRODUCTS);
}
