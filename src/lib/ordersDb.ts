// src/lib/ordersDb.ts
// Dual-layer order management with Cloud Firestore real-time sync + LocalStorage fallback.

import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  Unsubscribe,
  getDocs,
} from 'firebase/firestore';
import { db } from './firebase';
import { OrderRecord, OrderStatus } from '../types';

const COLLECTION = 'orders';
const STORAGE_KEY = 'danitech_orders';

function cleanOrderData(order: OrderRecord): Record<string, any> {
  return JSON.parse(JSON.stringify(order));
}

/**
 * Load cached orders from localStorage
 */
export function getStoredOrders(): OrderRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn('[Dani Tech] Could not read local orders cache:', e);
  }
  return [];
}

/**
 * Persist orders to localStorage and notify app components
 */
export function persistLocalOrders(orders: OrderRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    window.dispatchEvent(new Event('danitech_orders_updated'));
  } catch (e) {
    console.error('[Dani Tech] Failed to write local orders cache:', e);
  }
}

/**
 * Subscribe to real-time order updates from Firestore (for Admin Dashboard)
 */
export function subscribeToOrders(
  onData: (orders: OrderRecord[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  let isSubscribed = true;

  try {
    const q = query(collection(db, COLLECTION), orderBy('placedAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!isSubscribed) return;

        const firestoreOrders: OrderRecord[] = snapshot.docs.map((d) => {
          const data = d.data() as OrderRecord;
          return {
            ...data,
            id: d.id || data.id,
            status: data.status || 'pending',
          };
        });

        persistLocalOrders(firestoreOrders);
        onData(firestoreOrders);
      },
      (err) => {
        console.warn('[Dani Tech] Orders Firestore sync unavailable, falling back to local cache:', err.message);
        onData(getStoredOrders());
        onError?.(err);
      }
    );

    return () => {
      isSubscribed = false;
      unsubscribe();
    };
  } catch (err: any) {
    console.warn('[Dani Tech] Orders Firestore init warning, using local cache:', err.message);
    onData(getStoredOrders());
    return () => {};
  }
}

/**
 * Create or save an order into both Firestore cloud and local storage
 */
export async function createOrder(order: OrderRecord): Promise<void> {
  const current = getStoredOrders();
  const index = current.findIndex((o) => o.id === order.id);
  const updated = index >= 0
    ? current.map((o) => (o.id === order.id ? order : o))
    : [order, ...current];
  persistLocalOrders(updated);

  try {
    const ref = doc(db, COLLECTION, order.id);
    const cleanData = cleanOrderData({
      ...order,
      status: order.status || 'pending',
    });
    await setDoc(ref, cleanData, { merge: true });
    console.log('[Dani Tech] ✅ Order synced to Firestore cloud:', order.id);
  } catch (err) {
    console.warn('[Dani Tech] ⚠️ Order cloud sync warning (stored locally):', err);
  }
}

/**
 * Update the status of an existing order (e.g. pending -> dispatched -> delivered)
 */
export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
  const current = getStoredOrders();
  const updated = current.map((o) => (o.id === orderId ? { ...o, status } : o));
  persistLocalOrders(updated);

  try {
    const ref = doc(db, COLLECTION, orderId);
    await updateDoc(ref, { status });
    console.log('[Dani Tech] ✅ Order status updated in Firestore:', orderId, '->', status);
  } catch (err) {
    console.warn('[Dani Tech] ⚠️ Order status cloud update warning:', err);
  }
}

/**
 * Delete an order from Firestore and local storage
 */
export async function deleteOrder(orderId: string): Promise<void> {
  const current = getStoredOrders();
  const updated = current.filter((o) => o.id !== orderId);
  persistLocalOrders(updated);

  try {
    const ref = doc(db, COLLECTION, orderId);
    await deleteDoc(ref);
    console.log('[Dani Tech] ✅ Order deleted from Firestore:', orderId);
  } catch (err) {
    console.warn('[Dani Tech] ⚠️ Order cloud delete warning:', err);
  }
}

/**
 * Search for an order by ID or phone number (for customer Track Order modal)
 */
export async function searchOrder(term: string): Promise<OrderRecord | null> {
  const trimmed = term.trim().toLowerCase();
  if (!trimmed) return null;

  // First check local cache
  const local = getStoredOrders();
  const matchLocal = local.find(
    (o) => o.id.toLowerCase() === trimmed || o.phone.replace(/\D/g, '').includes(trimmed.replace(/\D/g, ''))
  );
  if (matchLocal) return matchLocal;

  // Query Firestore
  try {
    const snapshot = await getDocs(collection(db, COLLECTION));
    for (const d of snapshot.docs) {
      const data = d.data() as OrderRecord;
      if (
        d.id.toLowerCase() === trimmed ||
        data.id?.toLowerCase() === trimmed ||
        data.phone?.replace(/\D/g, '').includes(trimmed.replace(/\D/g, ''))
      ) {
        return { ...data, id: d.id, status: data.status || 'pending' };
      }
    }
  } catch (e) {
    console.warn('[Dani Tech] Order search query error:', e);
  }

  return null;
}
