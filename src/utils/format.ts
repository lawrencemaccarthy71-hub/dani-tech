import { CartItem, Currency, DeliveryOption } from '../types';
import { USD_EXCHANGE_RATE } from '../data/products';

export const WHATSAPP_PHONE_RAW = '233537781848';
export const WHATSAPP_PHONE_FORMATTED = '+233 53 778 1848';

// Exchange rates relative to GHS (update periodically)
export const EUR_EXCHANGE_RATE = 16.2; // 1 EUR ≈ 16.2 GHS
export const GBP_EXCHANGE_RATE = 19.1; // 1 GBP ≈ 19.1 GHS

export function formatPrice(priceGhs: number, currency: Currency): string {
  switch (currency) {
    case 'USD': {
      const usd = priceGhs / USD_EXCHANGE_RATE;
      return `$${usd.toFixed(2)}`;
    }
    case 'EUR': {
      const eur = priceGhs / EUR_EXCHANGE_RATE;
      return `€${eur.toFixed(2)}`;
    }
    case 'GBP': {
      const gbp = priceGhs / GBP_EXCHANGE_RATE;
      return `£${gbp.toFixed(2)}`;
    }
    case 'GHS':
    default:
      return `GH₵ ${priceGhs.toLocaleString()}`;
  }
}

export function generateProductWhatsAppUrl(productName: string, priceGhs: number): string {
  const message = `Hello Dani Tech, I would like to order the *${productName}* (GH₵ ${priceGhs.toLocaleString()}). Please confirm availability and delivery to my location in Accra.`;
  return `https://wa.me/${WHATSAPP_PHONE_RAW}?text=${encodeURIComponent(message)}`;
}

export function generateCartWhatsAppUrl(
  items: CartItem[],
  subtotalGhs: number,
  delivery: DeliveryOption | null,
  totalGhs: number,
  customerDetails?: { name: string; phone: string; address: string }
): string {
  let message = `*NEW ORDER — DANI TECH STORE*\n\n`;
  message += `*Items:*\n`;
  items.forEach((item, index) => {
    message += `${index + 1}. ${item.product.name} (Qty: ${item.quantity}) — GH₵ ${(item.product.priceGhs * item.quantity).toLocaleString()}\n`;
  });

  message += `\n*Subtotal:* GH₵ ${subtotalGhs.toLocaleString()}`;
  if (delivery) {
    message += `\n*Delivery:* ${delivery.name} (GH₵ ${delivery.priceGhs})`;
  }
  message += `\n*Total Amount:* GH₵ ${totalGhs.toLocaleString()}\n`;

  if (customerDetails && (customerDetails.name || customerDetails.phone || customerDetails.address)) {
    message += `\n*Client Details:*\n`;
    if (customerDetails.name) message += `Name: ${customerDetails.name}\n`;
    if (customerDetails.phone) message += `Phone: ${customerDetails.phone}\n`;
    if (customerDetails.address) message += `Delivery Address / GPS: ${customerDetails.address}\n`;
  }

  message += `\nPlease provide MoMo payment instructions (MTN / Telecel) and dispatch schedule.`;

  return `https://wa.me/${WHATSAPP_PHONE_RAW}?text=${encodeURIComponent(message)}`;
}
