import React, { useMemo } from 'react';
import { Product, Category, Currency } from '../types';
import { ProductCard } from './ProductCard';

interface CatalogueProps {
  products: Product[];
  activeCategory: Category;
  onSelectCategory: (cat: Category) => void;
  currency: Currency;
  onToggleCurrency: () => void;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  GHS: 'GH₵',
  USD: '$',
  EUR: '€',
  GBP: '£',
};

export const Catalogue: React.FC<CatalogueProps> = ({
  products,
  activeCategory,
  onSelectCategory,
  currency,
  onAddToCart,
  onQuickView,
}) => {
  const filteredProducts = useMemo(() => {
    return activeCategory === 'all'
      ? products
      : products.filter((p) => p.category === activeCategory);
  }, [products, activeCategory]);

  const categories: { id: Category; label: string }[] = [
    { id: 'all', label: 'All Hardware' },
    { id: 'laptops', label: 'Laptops' },
    { id: 'iphone', label: 'iPhone' },
    { id: 'ipad', label: 'iPad' },
    { id: 'adapters-hubs', label: 'Adapters & Hubs' },
  ];

  return (
    <section className="w-full py-16 md:py-20 bg-[#f0f0f2]/50 dark:bg-[#0e0e10] transition-colors duration-250" id="catalogue">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 md:mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#c26d2b] dark:text-[#ffb77d] text-[11px] font-mono uppercase tracking-widest mb-2 transition-colors">
              <span>Curated Inventory</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#c26d2b] dark:bg-[#ffb77d]"></span>
              <span>Ready for Dispatch</span>
            </div>
            <h2 className="font-['Geist',sans-serif] text-2xl sm:text-3xl md:text-4xl font-medium text-[#161618] dark:text-[#e5e1e4] transition-colors">
              Featured Hardware Spotlight
            </h2>
          </div>

          {/* Currency Badge — read-only indicator (changed via header picker) */}
          <div className="flex items-center gap-2 bg-white dark:bg-[#201f21] px-3.5 py-1.5 rounded-full border border-black/8 dark:border-[#424656]/30 shadow-sm transition-colors">
            <span className="text-[11px] font-mono text-[#6e6e73] dark:text-[#c2c6d8]">Currency:</span>
            <span className="px-2 py-0.5 rounded-full bg-black/5 dark:bg-[#353437] text-[#161618] dark:text-[#e5e1e4] text-[11px] font-mono font-semibold">
              {currency} ({CURRENCY_SYMBOLS[currency]})
            </span>
          </div>
        </div>

        {/* Category Pill Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#0066ff] text-white shadow-md'
                    : 'bg-white dark:bg-[#1c1b1d] text-[#555558] dark:text-[#c2c6d8] hover:text-[#161618] dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-[#201f21] border border-black/8 dark:border-[#424656]/20 shadow-sm'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              currency={currency}
              onAddToCart={onAddToCart}
              onQuickView={onQuickView}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-[#1c1b1d] rounded-2xl border border-black/8 dark:border-[#424656]/30 shadow-sm transition-colors">
            <p className="text-[#555558] dark:text-[#c2c6d8] text-sm mb-4">No items currently found in this category.</p>
            <button
              onClick={() => onSelectCategory('all')}
              className="px-4 py-2 rounded-full bg-black/5 hover:bg-black/10 dark:bg-[#353437] text-[#161618] dark:text-[#e5e1e4] text-xs font-medium hover:dark:bg-[#e5e1e4] hover:dark:text-[#131315] transition-colors cursor-pointer"
            >
              View All Hardware
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
