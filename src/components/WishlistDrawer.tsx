import React, { useState } from 'react';
import { Heart, X, ShoppingBag, Trash2, MessageSquare, ArrowRight, Eye, Check } from 'lucide-react';
import { Product, Currency } from '../types';
import { formatPrice } from '../utils/format';
import { generateWishlistWhatsAppUrl } from '../lib/wishlist';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  currency: Currency;
  onRemoveItem: (productId: string) => void;
  onClearWishlist: () => void;
  onAddToCart: (product: Product) => void;
  onAddAllToCart: (products: Product[]) => void;
  onQuickView: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  products,
  currency,
  onRemoveItem,
  onClearWishlist,
  onAddToCart,
  onAddAllToCart,
  onQuickView,
}) => {
  const [addedAll, setAddedAll] = useState(false);
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const totalValueGhs = products.reduce((sum, p) => sum + p.priceGhs, 0);

  const handleAddSingle = (p: Product) => {
    onAddToCart(p);
    setAddedItemIds((prev) => ({ ...prev, [p.id]: true }));
    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [p.id]: false }));
    }, 1800);
  };

  const handleAddAll = () => {
    if (products.length === 0) return;
    onAddAllToCart(products.filter((p) => p.inStock !== false));
    setAddedAll(true);
    setTimeout(() => setAddedAll(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 dark:bg-black/75 backdrop-blur-sm transition-opacity"
      />

      {/* Slide-over Drawer Panel */}
      <aside className="fixed top-0 right-0 h-full w-full max-w-md bg-[#fbfbfa] dark:bg-[#1c1b1d] shadow-2xl z-50 flex flex-col border-l border-black/8 dark:border-[#424656]/30 animate-in slide-in-from-right duration-300 transition-colors">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-white dark:bg-[#201f21] flex items-center justify-between border-b border-black/8 dark:border-[#424656]/30 transition-colors">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center text-rose-500">
              <Heart className="w-4 h-4 fill-rose-500" />
            </div>
            <div>
              <h3 className="font-['Geist',sans-serif] text-lg sm:text-xl font-medium text-[#161618] dark:text-[#e5e1e4]">
                My Stash
              </h3>
              <p className="text-[10px] font-mono text-[#6e6e73] dark:text-[#8c90a1] -mt-0.5">
                Saved Hardware Setup
              </p>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-black/5 dark:bg-[#353437] text-[#555558] dark:text-[#c2c6d8] ml-1">
              {products.length}
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 dark:bg-[#2a2a2c] dark:hover:bg-[#353437] text-[#555558] hover:text-[#161618] dark:text-[#c2c6d8] dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close wishlist"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Items */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-3">
          {products.length === 0 ? (
            <div className="text-center py-16 flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-black/5 dark:bg-[#201f21] flex items-center justify-center text-[#6e6e73] dark:text-[#8c90a1] mb-4">
                <Heart className="w-8 h-8" />
              </div>
              <p className="text-base font-medium text-[#161618] dark:text-[#e5e1e4] mb-1">Your stash is empty</p>
              <p className="text-xs text-[#555558] dark:text-[#c2c6d8] max-w-xs mb-6">
                Tap the heart on any laptop, stand, adapter, or cable to save your ideal workspace setup.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-full bg-black/5 hover:bg-black/10 text-[#161618] dark:bg-[#353437] dark:hover:bg-[#e5e1e4] dark:hover:text-[#131315] dark:text-[#e5e1e4] text-xs font-medium transition-colors cursor-pointer"
              >
                Explore Hardware
              </button>
            </div>
          ) : (
            products.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-3.5 p-3.5 rounded-xl bg-white dark:bg-[#201f21] border border-black/8 dark:border-[#424656]/20 shadow-sm transition-colors group"
              >
                {/* Thumbnail */}
                <div
                  onClick={() => onQuickView(product)}
                  className="w-16 h-16 rounded-lg bg-[#f5f5f7] dark:bg-[#1c1b1d] p-1.5 flex items-center justify-center shrink-0 border border-black/5 dark:border-[#424656]/20 cursor-pointer"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[10px] font-mono text-[#6e6e73] dark:text-[#8c90a1] uppercase">
                      {product.categoryLabel}
                    </span>
                    <span className="text-[9px] font-mono text-[#c26d2b] dark:text-[#ffb77d] px-1.5 py-0.2 rounded bg-[#c26d2b]/10 dark:bg-[#353437]">
                      {product.featureTag}
                    </span>
                  </div>

                  <h4
                    onClick={() => onQuickView(product)}
                    className="text-xs sm:text-sm font-medium text-[#161618] dark:text-[#e5e1e4] truncate mb-1 hover:text-[#0066ff] cursor-pointer"
                  >
                    {product.name}
                  </h4>

                  <div className="flex items-center justify-between">
                    <div className="text-xs font-mono font-bold text-[#161618] dark:text-[#e5e1e4]">
                      {formatPrice(product.priceGhs, currency)}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onQuickView(product)}
                        className="p-1.5 rounded-lg bg-black/5 hover:bg-black/10 dark:bg-[#2a2a2c] dark:hover:bg-[#353437] text-[#555558] dark:text-[#c2c6d8] transition-colors cursor-pointer"
                        title="View details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleAddSingle(product)}
                        disabled={product.inStock === false}
                        className={`py-1 px-2.5 rounded-lg text-[11px] font-medium transition-all flex items-center gap-1 ${
                          product.inStock === false
                            ? 'bg-neutral-200 dark:bg-[#2a2a2c] text-neutral-400 dark:text-[#8c90a1] opacity-50 cursor-not-allowed'
                            : addedItemIds[product.id]
                            ? 'bg-[#00838f] text-white'
                            : 'bg-[#0066ff] hover:bg-[#0054d6] text-white cursor-pointer'
                        }`}
                      >
                        {addedItemIds[product.id] ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3 h-3" />
                            <span>Bag</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => onRemoveItem(product.id)}
                        className="p-1.5 text-[#6e6e73] hover:text-rose-600 dark:text-[#8c90a1] dark:hover:text-rose-400 transition-colors cursor-pointer"
                        title="Remove from stash"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with Totals & CTAs */}
        {products.length > 0 && (
          <div className="p-5 sm:p-6 bg-white dark:bg-[#201f21] border-t border-black/8 dark:border-[#424656]/30 space-y-3.5 transition-colors">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#555558] dark:text-[#c2c6d8]">Estimated Setup Value:</span>
              <span className="font-mono font-bold text-sm sm:text-base text-[#161618] dark:text-[#e5e1e4]">
                {formatPrice(totalValueGhs, currency)}
              </span>
            </div>

            <div className="space-y-2">
              {/* Move All to Bag */}
              <button
                onClick={handleAddAll}
                className="w-full py-3 rounded-xl bg-[#0066ff] hover:bg-[#0054d6] text-white text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                {addedAll ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>All Items Added to Bag!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Move All In-Stock Gear to Bag</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Share Setup via WhatsApp */}
              <a
                href={generateWishlistWhatsAppUrl(products, currency)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-[#00838f] hover:bg-[#006b74] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Inquire Entire Setup on WhatsApp</span>
              </a>

              <div className="flex items-center justify-between pt-1 text-xs">
                <button
                  onClick={onClearWishlist}
                  className="text-[11px] text-[#6e6e73] hover:text-rose-600 dark:text-[#8c90a1] dark:hover:text-rose-400 transition-colors cursor-pointer"
                >
                  Clear Stash
                </button>

                <button
                  onClick={onClose}
                  className="text-[11px] text-[#6e6e73] hover:text-[#161618] dark:text-[#8c90a1] dark:hover:text-white transition-colors cursor-pointer"
                >
                  Continue Browsing
                </button>
              </div>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
};
