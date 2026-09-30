import { useState, useEffect, useCallback } from 'react';
import { Product, Currency } from '../types';
import { formatPrice, WHATSAPP_PHONE_RAW } from '../utils/format';

const WISHLIST_STORAGE_KEY = 'danitech_wishlist';

export function getStoredWishlistIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Failed to read wishlist:', e);
    return [];
  }
}

export function saveWishlistIds(ids: string[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(ids));
    window.dispatchEvent(new CustomEvent('danitech_wishlist_updated', { detail: ids }));
  } catch (e) {
    console.error('Failed to save wishlist:', e);
  }
}

export function toggleWishlistId(productId: string): boolean {
  const current = getStoredWishlistIds();
  const exists = current.includes(productId);
  const updated = exists ? current.filter((id) => id !== productId) : [...current, productId];
  saveWishlistIds(updated);
  return !exists;
}

export function isInWishlist(productId: string): boolean {
  return getStoredWishlistIds().includes(productId);
}

export function useWishlist(allProducts: Product[] = []) {
  const [wishlistIds, setWishlistIds] = useState<string[]>(getStoredWishlistIds);

  useEffect(() => {
    const handleUpdate = () => {
      setWishlistIds(getStoredWishlistIds());
    };

    window.addEventListener('danitech_wishlist_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('danitech_wishlist_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const toggle = useCallback((productId: string) => {
    return toggleWishlistId(productId);
  }, []);

  const remove = useCallback((productId: string) => {
    const current = getStoredWishlistIds();
    const updated = current.filter((id) => id !== productId);
    saveWishlistIds(updated);
  }, []);

  const clear = useCallback(() => {
    saveWishlistIds([]);
  }, []);

  const wishlistProducts = allProducts.filter((p) => wishlistIds.includes(p.id));

  return {
    wishlistIds,
    wishlistProducts,
    toggle,
    remove,
    clear,
    isSaved: (id: string) => wishlistIds.includes(id),
    count: wishlistIds.length,
  };
}

export function generateWishlistWhatsAppUrl(products: Product[], currency: Currency): string {
  if (products.length === 0) {
    return `https://wa.me/${WHATSAPP_PHONE_RAW}?text=Hello%20Dani%20Tech,%20I%20would%20like%20to%20inquire%20about%20your%20hardware%20accessories.`;
  }

  const totalGhs = products.reduce((sum, p) => sum + p.priceGhs, 0);

  const itemsList = products
    .map((p, idx) => `${idx + 1}. *${p.name}* (${formatPrice(p.priceGhs, currency)})`)
    .join('\n');

  const message = `🇬🇭 *MY DANI TECH HARDWARE STASH*
----------------------------------------
${itemsList}
----------------------------------------
*Total Setup Value:* ${formatPrice(totalGhs, currency)}

Hello Dani Tech! I saved these items to my setup stash on your website. Are all these currently available for delivery in Accra?`;

  return `https://wa.me/${WHATSAPP_PHONE_RAW}?text=${encodeURIComponent(message)}`;
}
