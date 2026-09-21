// src/lib/productsDb.ts
// All Firestore read/write operations for the product catalogue.
// This is the single source of truth — replaces localStorage for products.

import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  writeBatch,
  Unsubscribe,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from './firebase';
import { Product } from '../types';
import { PRODUCTS } from '../data/products';

const COLLECTION = 'products';

/**
 * Subscribe to real-time product updates.
 * The callback fires immediately with current data, then again on every change.
 * Returns an unsubscribe function to clean up.
 */
export function subscribeToProducts(
  onData: (products: Product[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const q = query(collection(db, COLLECTION));
  return onSnapshot(
    q,
    (snapshot) => {
      if (snapshot.empty) {
        // First run — seed the default products into Firestore
        seedDefaultProducts().then(() => {
          // onSnapshot will fire again automatically after seeding
        });
        return;
      }
      const products: Product[] = snapshot.docs.map((d) => d.data() as Product);
      onData(products);
    },
    (err) => {
      console.error('[Dani Tech] Firestore error:', err);
      onError?.(err);
    }
  );
}

/**
 * Save (create or update) a single product in Firestore.
 */
export async function saveProduct(product: Product): Promise<void> {
  const ref = doc(db, COLLECTION, product.id);
  await setDoc(ref, product, { merge: true });
}

/**
 * Delete a single product from Firestore by id.
 */
export async function deleteProduct(productId: string): Promise<void> {
  const ref = doc(db, COLLECTION, productId);
  await deleteDoc(ref);
}

/**
 * Replace the entire catalogue in one atomic batch write.
 * Used for "Reset to defaults" and full catalogue overwrites.
 */
export async function replaceAllProducts(products: Product[]): Promise<void> {
  const batch = writeBatch(db);
  products.forEach((p) => {
    const ref = doc(db, COLLECTION, p.id);
    batch.set(ref, p);
  });
  await batch.commit();
}

/**
 * One-time seed: writes all 6 default products into Firestore.
 * Called automatically on first visit when collection is empty.
 */
export async function seedDefaultProducts(): Promise<void> {
  await replaceAllProducts(PRODUCTS);
}
