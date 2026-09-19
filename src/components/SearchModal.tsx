import React, { useState } from 'react';
import { Search, X, ShoppingBag, ArrowRight } from 'lucide-react';
import { Product, Currency } from '../types';
import { formatPrice } from '../utils/format';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  currency: Currency;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  currency,
  onSelectProduct,
  onAddToCart,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filtered = query.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.categoryLabel.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase()) ||
          p.featureTag.toLowerCase().includes(query.toLowerCase())
      )
    : products;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-start justify-center pt-16 sm:pt-24 p-4"
    >
      <div className="relative w-full max-w-2xl bg-[#1c1b1d] border border-[#424656]/40 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in duration-200">
        {/* Search Input Bar */}
        <div className="p-4 bg-[#201f21] border-b border-[#424656]/30 flex items-center gap-3">
          <Search className="w-5 h-5 text-[#8c90a1]" />
          <input
            type="text"
            autoFocus
            placeholder="Search laptops, iPad stands, titanium cases, cables, adapters..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none text-[#e5e1e4] placeholder-[#8c90a1] text-sm focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-[#8c90a1] hover:text-white cursor-pointer"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#2a2a2c] hover:bg-[#353437] text-[#c2c6d8] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close search"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Filter Suggestions */}
        <div className="px-4 py-2 bg-[#131315] border-b border-[#424656]/20 flex items-center gap-2 overflow-x-auto text-[11px] font-mono text-[#8c90a1]">
          <span>Popular:</span>
          {['iPad Stand', 'MagSafe', 'Braided Cable', 'Laptop Riser', 'Titanium'].map((tag) => (
            <button
              key={tag}
              onClick={() => setQuery(tag)}
              className="px-2 py-0.5 rounded-full bg-[#201f21] hover:bg-[#2a2a2c] text-[#c2c6d8] hover:text-white transition-colors cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-2">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-[#8c90a1] text-xs">
              No matching hardware found for "{query}".
            </div>
          ) : (
            filtered.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-[#201f21] hover:bg-[#2a2a2c] border border-[#424656]/20 transition-colors group cursor-pointer"
                onClick={() => {
                  onSelectProduct(product);
                  onClose();
                }}
              >
                <div className="w-14 h-14 rounded-lg bg-[#1c1b1d] p-1.5 flex items-center justify-center shrink-0 border border-[#424656]/20">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-[#8c90a1] uppercase">
                      {product.categoryLabel}
                    </span>
                    <span className="text-[10px] font-mono text-[#ffb77d] px-1.5 py-0.2 rounded bg-[#353437]">
                      {product.featureTag}
                    </span>
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full flex items-center gap-1 border ${
                        product.inStock !== false
                          ? 'text-[#00dce6] border-[#00dce6]/30 bg-[#007e85]/10'
                          : 'text-red-400 border-red-500/30 bg-red-500/10'
                      }`}
                    >
                      {product.inStock !== false ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                  <h4 className="text-sm font-medium text-[#e5e1e4] truncate mt-0.5">
                    {product.name}
                  </h4>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs font-mono font-bold text-[#ffb77d] mb-1">
                    {formatPrice(product.priceGhs, currency)}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (product.inStock !== false) {
                        onAddToCart(product);
                      }
                    }}
                    disabled={product.inStock === false}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors flex items-center gap-1 ${
                      product.inStock === false
                        ? 'bg-[#2a2a2c] text-[#8c90a1] opacity-60 cursor-not-allowed border border-[#424656]/30'
                        : 'bg-[#353437] hover:bg-[#0066ff] text-white cursor-pointer'
                    }`}
                  >
                    <ShoppingBag className="w-3 h-3" />
                    <span>{product.inStock === false ? 'Out' : 'Add'}</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
