import React from 'react';
import { X, ShoppingBag, MessageSquare, ShieldCheck, Check, Truck, Layers } from 'lucide-react';
import { Product, Currency } from '../types';
import { formatPrice, generateProductWhatsAppUrl } from '../utils/format';

interface ProductDetailModalProps {
  product: Product | null;
  currency: Currency;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  currency,
  onClose,
  onAddToCart,
}) => {
  if (!product) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
    >
      <div className="relative w-full max-w-2xl bg-[#1c1b1d] border border-[#424656]/40 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-[#131315]/80 hover:bg-[#131315] text-[#c2c6d8] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close details"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Visual Showcase */}
          <div className="bg-[#131315] p-6 flex flex-col items-center justify-center relative border-b md:border-b-0 md:border-r border-[#424656]/30">
            {product.inStock === false ? (
              <span className="absolute top-4 left-4 px-2.5 py-1 rounded-full bg-red-950/80 text-red-400 text-[10px] font-mono uppercase tracking-wider border border-red-500/40 shadow-sm flex items-center gap-1.5 z-10">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                Out of Stock
              </span>
            ) : product.badge ? (
              <span className="absolute top-4 left-4 px-2.5 py-1 rounded-full bg-[#353437] text-[#ffb77d] text-[10px] font-mono uppercase tracking-wider border border-[#424656]/30">
                {product.badge}
              </span>
            ) : null}
            <img
              src={product.image}
              alt={product.name}
              className={`max-h-64 w-auto object-contain my-4 hover:scale-105 transition-transform duration-300 ${
                product.inStock === false ? 'opacity-60 grayscale-[25%]' : ''
              }`}
            />
            <div className="w-full text-center">
              <span className="text-[11px] font-mono text-[#00dce6]">
                Guaranteed Fit for Apple Ecosystem
              </span>
            </div>
          </div>

          {/* Details & Specs */}
          <div className="p-6 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-xs font-mono text-[#ffb77d] uppercase tracking-wider">
                  {product.tier}
                </span>

                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full flex items-center gap-1.5 border ${
                    product.inStock !== false
                      ? 'bg-[#007e85]/15 text-[#00dce6] border-[#00dce6]/30'
                      : 'bg-red-500/15 text-red-400 border-red-500/30'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      product.inStock !== false ? 'bg-[#00dce6] animate-pulse' : 'bg-red-400'
                    }`}
                  />
                  {product.inStock !== false ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              <h2 className="font-['Geist',sans-serif] text-xl sm:text-2xl font-semibold text-[#e5e1e4] leading-snug">
                {product.name}
              </h2>

              <div className="flex items-center gap-3 my-3">
                <span className="text-xl font-mono font-bold text-[#e5e1e4]">
                  {formatPrice(product.priceGhs, currency)}
                </span>
                <span className="text-xs font-mono text-[#00dce6] px-2 py-0.5 rounded-full bg-[#201f21] border border-[#00dce6]/30">
                  {product.featureTag}
                </span>
              </div>

              <p className="text-xs text-[#c2c6d8] leading-relaxed mb-4">
                {product.description}
              </p>

              {/* Technical Specifications */}
              <div className="space-y-2 text-xs border-t border-[#424656]/25 pt-3">
                <div className="flex justify-between py-1 border-b border-[#424656]/15">
                  <span className="text-[#8c90a1]">Availability</span>
                  <span
                    className={`font-mono font-medium text-right ${
                      product.inStock !== false ? 'text-[#00dce6]' : 'text-red-400'
                    }`}
                  >
                    {product.inStock !== false ? 'In Stock (Dispatch Today)' : 'Out of Stock'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#424656]/15">
                  <span className="text-[#8c90a1]">Material</span>
                  <span className="text-[#e5e1e4] font-medium text-right">{product.specs.material}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#424656]/15">
                  <span className="text-[#8c90a1]">Finish</span>
                  <span className="text-[#e5e1e4] font-medium text-right">{product.specs.finish}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#424656]/15">
                  <span className="text-[#8c90a1]">Compatibility</span>
                  <span className="text-[#e5e1e4] font-medium text-right max-w-[180px] truncate">{product.specs.compatibility}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#8c90a1]">Warranty</span>
                  <span className="text-[#00dce6] font-medium text-right">{product.specs.warranty}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  if (product.inStock !== false) {
                    onAddToCart(product);
                    onClose();
                  }
                }}
                disabled={product.inStock === false}
                className={`w-full py-3 rounded-xl text-xs sm:text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-md ${
                  product.inStock === false
                    ? 'bg-[#2a2a2c] text-[#8c90a1] opacity-60 cursor-not-allowed border border-[#424656]/30'
                    : 'bg-[#0066ff] hover:bg-[#0054d6] text-white cursor-pointer'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{product.inStock === false ? 'Out of Stock' : 'Add to Bag'}</span>
              </button>

              <a
                href={generateProductWhatsAppUrl(product.name, product.priceGhs)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-[#201f21] hover:bg-[#2a2a2c] text-[#00dce6] text-xs font-medium transition-colors flex items-center justify-center gap-2 border border-[#424656]/30"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{product.inStock === false ? 'Inquire on WhatsApp (Restock)' : 'Instant Order via WhatsApp'}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
