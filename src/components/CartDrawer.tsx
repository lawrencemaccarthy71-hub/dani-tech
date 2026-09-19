import React from 'react';
import { ShoppingBag, X, Plus, Minus, Trash2, MessageSquare, ArrowRight, ShieldCheck } from 'lucide-react';
import { CartItem, Currency, DeliveryOption } from '../types';
import { formatPrice, generateCartWhatsAppUrl } from '../utils/format';
import { DELIVERY_OPTIONS } from '../data/products';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currency: Currency;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  selectedDelivery: DeliveryOption;
  onSelectDelivery: (option: DeliveryOption) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  currency,
  onUpdateQuantity,
  onRemoveItem,
  selectedDelivery,
  onSelectDelivery,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const subtotalGhs = items.reduce(
    (sum, item) => sum + item.product.priceGhs * item.quantity,
    0
  );
  const totalGhs = subtotalGhs + (items.length > 0 ? selectedDelivery.priceGhs : 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
      />

      {/* Slide-over Drawer Panel */}
      <aside className="fixed top-0 right-0 h-full w-full max-w-md bg-[#1c1b1d] shadow-2xl z-50 flex flex-col border-l border-[#424656]/30 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#201f21] flex items-center justify-between border-b border-[#424656]/30">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#ffb77d]" />
            <h3 className="font-['Geist',sans-serif] text-xl font-medium text-[#e5e1e4]">
              Bag Summary
            </h3>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[#353437] text-[#c2c6d8]">
              {items.reduce((sum, item) => sum + item.quantity, 0)} items
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#2a2a2c] hover:bg-[#353437] text-[#c2c6d8] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Cart Items */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-3">
          {items.length === 0 ? (
            <div className="text-center py-16 flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-[#201f21] flex items-center justify-center text-[#8c90a1] mb-4">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p className="text-base font-medium text-[#e5e1e4] mb-1">Your bag is empty</p>
              <p className="text-xs text-[#c2c6d8] max-w-xs mb-6">
                Explore our curated hardware catalogue and add accessories to your bag.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-full bg-[#353437] hover:bg-[#e5e1e4] hover:text-[#131315] text-xs font-medium text-[#e5e1e4] transition-colors"
              >
                Browse Hardware
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center gap-3.5 p-3.5 rounded-xl bg-[#201f21] border border-[#424656]/20 shadow-sm"
              >
                <div className="w-16 h-16 rounded-lg bg-[#1c1b1d] p-1.5 flex items-center justify-center shrink-0 border border-[#424656]/20">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs sm:text-sm font-medium text-[#e5e1e4] truncate mb-1">
                    {item.product.name}
                  </h4>
                  <div className="text-xs font-mono font-bold text-[#ffb77d] mb-2">
                    {formatPrice(item.product.priceGhs * item.quantity, currency)}
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center bg-[#2a2a2c] rounded-lg border border-[#424656]/30">
                      <button
                        onClick={() =>
                          onUpdateQuantity(item.product.id, Math.max(1, item.quantity - 1))
                        }
                        className="w-6 h-6 flex items-center justify-center text-[#c2c6d8] hover:text-white"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-7 text-center text-xs font-mono text-[#e5e1e4]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          onUpdateQuantity(item.product.id, item.quantity + 1)
                        }
                        className="w-6 h-6 flex items-center justify-center text-[#c2c6d8] hover:text-white"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      className="p-1 text-[#8c90a1] hover:text-[#ffb4ab] transition-colors ml-auto"
                      aria-label="Remove item"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Delivery Zone Selector */}
          {items.length > 0 && (
            <div className="pt-4 border-t border-[#424656]/30">
              <label className="text-[11px] font-mono text-[#8c90a1] uppercase tracking-wider block mb-2">
                Accra & Greater Ghana Delivery Options
              </label>
              <div className="space-y-2">
                {DELIVERY_OPTIONS.map((opt) => {
                  const isSelected = selectedDelivery.id === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => onSelectDelivery(opt)}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#201f21] border-[#0066ff] shadow-sm'
                          : 'bg-[#1c1b1d] border-[#424656]/20 hover:border-[#424656]/40'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="text-xs font-medium text-[#e5e1e4]">
                          {opt.name}
                        </span>
                        <span className="text-xs font-mono font-bold text-[#ffb77d]">
                          {formatPrice(opt.priceGhs, currency)}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#c2c6d8]">{opt.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer with Totals & CTAs */}
        {items.length > 0 && (
          <div className="p-5 sm:p-6 bg-[#201f21] border-t border-[#424656]/30 space-y-4">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-[#c2c6d8]">
                <span>Subtotal</span>
                <span className="font-mono font-bold text-[#e5e1e4]">
                  {formatPrice(subtotalGhs, currency)}
                </span>
              </div>
              <div className="flex justify-between text-[#c2c6d8]">
                <span>Delivery ({selectedDelivery.name.split('(')[0]})</span>
                <span className="font-mono text-[#ffb77d]">
                  {formatPrice(selectedDelivery.priceGhs, currency)}
                </span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-[#424656]/30 font-medium">
                <span className="text-[#e5e1e4]">Total Amount</span>
                <span className="font-mono font-bold text-[#e5e1e4] text-base">
                  {formatPrice(totalGhs, currency)}
                </span>
              </div>
            </div>

            <div className="space-y-2.5 pt-1">
              {/* WhatsApp Direct Ordering */}
              <a
                href={generateCartWhatsAppUrl(
                  items,
                  subtotalGhs,
                  selectedDelivery,
                  totalGhs
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-xl bg-[#e5e1e4] hover:bg-white text-[#131315] text-xs sm:text-sm font-semibold shadow-md hover:scale-[1.01] transition-transform flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-[#007e85]" />
                <span>Order via WhatsApp (MoMo)</span>
              </a>

              {/* Direct MoMo / Card Checkout */}
              <button
                onClick={onProceedToCheckout}
                className="w-full py-3 rounded-xl bg-[#0066ff] hover:bg-[#0054d6] text-white text-xs sm:text-sm font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <span>Instant MoMo / Card Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onClose}
                className="w-full py-2 text-center text-xs text-[#8c90a1] hover:text-[#e5e1e4] transition-colors cursor-pointer"
              >
                Continue Browsing
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
};
