import React, { useState } from 'react';
import { ShoppingBag, MessageSquare, Check, Eye } from 'lucide-react';
import { Product, Currency } from '../types';
import { formatPrice, generateProductWhatsAppUrl } from '../utils/format';

interface ProductCardProps {
  product: Product;
  currency: Currency;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = React.memo(({
  product,
  currency,
  onAddToCart,
  onQuickView,
}) => {
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const getBadgeStyle = () => {
    switch (product.badgeColor) {
      case 'secondary':
        return 'text-[#ffb77d] bg-[#353437]/90 border border-[#ffb77d]/30';
      case 'tertiary':
        return 'text-[#00dce6] bg-[#353437]/90 border border-[#00dce6]/30';
      case 'primary':
        return 'text-[#b3c5ff] bg-[#353437]/90 border border-[#b3c5ff]/30';
      default:
        return 'text-[#c2c6d8] bg-[#353437]/90 border border-[#424656]/40';
    }
  };

  return (
    <div className="group flex flex-col rounded-2xl bg-[#201f21] p-5 transition-all duration-300 hover:-translate-y-1.5 shadow-md border border-[#424656]/25 hover:border-[#ffb77d]/40">
      {/* Product Image Frame */}
      <div className="relative w-full aspect-square rounded-xl bg-[#1c1b1d] overflow-hidden mb-4 flex items-center justify-center p-6 border border-[#424656]/20">
        {product.inStock === false ? (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full backdrop-blur-md text-[10px] font-mono font-bold uppercase tracking-wider text-red-400 bg-red-950/80 border border-red-500/40 shadow-sm flex items-center gap-1.5 z-10">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
            Out of Stock
          </div>
        ) : product.badge ? (
          <div
            className={`absolute top-3 left-3 px-2.5 py-1 rounded-full backdrop-blur-sm text-[10px] font-mono font-medium uppercase tracking-wider ${getBadgeStyle()}`}
          >
            {product.badge}
          </div>
        ) : null}

        {/* Quick View overlay trigger on image hover */}
        <button
          onClick={() => onQuickView(product)}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#131315]/80 hover:bg-[#131315] text-[#c2c6d8] hover:text-white flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all cursor-pointer shadow-sm"
          title="Quick Specs & Details"
          aria-label="Quick View Specs"
        >
          <Eye className="w-4 h-4" />
        </button>

        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          decoding="async"
          className={`w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 cursor-pointer ${
            product.inStock === false ? 'opacity-60 grayscale-[30%]' : ''
          }`}
          onClick={() => onQuickView(product)}
        />
      </div>

      {/* Details & Specs */}
      <div className="flex flex-col flex-1">
        <span className="text-[11px] font-mono text-[#8c90a1] uppercase tracking-wider mb-1">
          {product.categoryLabel}
        </span>

        <h3
          onClick={() => onQuickView(product)}
          className="font-['Geist',sans-serif] text-base md:text-[17px] text-[#e5e1e4] font-medium line-clamp-1 mb-2 hover:text-[#ffb77d] transition-colors cursor-pointer"
        >
          {product.name}
        </h3>

        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono text-[#e5e1e4] font-bold">
              {formatPrice(product.priceGhs, currency)}
            </span>
            <span className="text-[10px] font-mono text-[#ffb77d] px-2 py-0.5 rounded-full bg-[#353437] border border-[#424656]/30">
              {product.featureTag}
            </span>
          </div>

          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded-full flex items-center gap-1.5 border shrink-0 ${
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

        {/* Action Buttons */}
        <div className="mt-auto flex items-center gap-2">
          <button
            onClick={handleAdd}
            disabled={product.inStock === false}
            className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 shadow-sm ${
              product.inStock === false
                ? 'bg-[#2a2a2c] text-[#8c90a1] opacity-60 cursor-not-allowed border border-[#424656]/30'
                : added
                ? 'bg-[#007e85] text-white cursor-pointer'
                : 'bg-[#353437] hover:bg-[#e5e1e4] hover:text-[#131315] text-[#e5e1e4] cursor-pointer'
            }`}
          >
            {product.inStock === false ? (
              <span>Out of Stock</span>
            ) : added ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added to Bag</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </>
            )}
          </button>

          <a
            href={generateProductWhatsAppUrl(product.name, product.priceGhs)}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-lg bg-[#353437] hover:bg-[#39393b] text-[#00dce6] transition-colors flex items-center justify-center"
            title={product.inStock === false ? `Inquire about ${product.name} restock via WhatsApp` : `Instant Order ${product.name} via WhatsApp`}
            aria-label={`Order ${product.name} via WhatsApp`}
          >
            <MessageSquare className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
});
