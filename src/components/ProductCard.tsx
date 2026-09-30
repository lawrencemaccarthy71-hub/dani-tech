import React, { useState, useEffect } from 'react';
import { ShoppingBag, MessageSquare, Check, Eye, ChevronLeft, ChevronRight, Layers, Heart } from 'lucide-react';
import { Product, Currency } from '../types';
import { formatPrice, generateProductWhatsAppUrl } from '../utils/format';
import { isInWishlist, toggleWishlistId } from '../lib/wishlist';

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
  const [currentImgIdx, setCurrentImgIdx] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [isSaved, setIsSaved] = useState(() => isInWishlist(product.id));

  useEffect(() => {
    const handleUpdate = () => {
      setIsSaved(isInWishlist(product.id));
    };
    window.addEventListener('danitech_wishlist_updated', handleUpdate);
    return () => window.removeEventListener('danitech_wishlist_updated', handleUpdate);
  }, [product.id]);

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextSaved = toggleWishlistId(product.id);
    setIsSaved(nextSaved);
  };

  const images = (product.images && product.images.length > 0)
    ? product.images
    : [product.image];
  const hasMultipleImages = images.length > 1;

  const handleAdd = () => {
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIdx((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null || !hasMultipleImages) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > 35) {
      if (diff > 0) {
        // Swipe left -> next image
        setCurrentImgIdx((prev) => (prev + 1) % images.length);
      } else {
        // Swipe right -> previous image
        setCurrentImgIdx((prev) => (prev - 1 + images.length) % images.length);
      }
    }
    setTouchStartX(null);
  };

  const getBadgeStyle = () => {
    switch (product.badgeColor) {
      case 'secondary':
        return 'text-[#c26d2b] dark:text-[#ffb77d] bg-[#c26d2b]/10 dark:bg-[#353437]/90 border border-[#c26d2b]/30 dark:border-[#ffb77d]/30';
      case 'tertiary':
        return 'text-[#00838f] dark:text-[#00dce6] bg-[#00838f]/10 dark:bg-[#353437]/90 border border-[#00838f]/30 dark:border-[#00dce6]/30';
      case 'primary':
        return 'text-[#0066ff] dark:text-[#b3c5ff] bg-[#0066ff]/10 dark:bg-[#353437]/90 border border-[#0066ff]/30 dark:border-[#b3c5ff]/30';
      default:
        return 'text-[#6e6e73] dark:text-[#c2c6d8] bg-black/5 dark:bg-[#353437]/90 border border-black/10 dark:border-[#424656]/40';
    }
  };

  return (
    <div className="group flex flex-col rounded-2xl bg-white dark:bg-[#201f21] p-5 transition-all duration-300 hover:-translate-y-1.5 shadow-sm hover:shadow-xl border border-black/8 dark:border-[#424656]/25 hover:border-[#0066ff]/30 dark:hover:border-[#ffb77d]/40">
      {/* Product Image Frame with Multi-Photo Carousel & Swipe */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative w-full aspect-square rounded-xl bg-[#f5f5f7] dark:bg-[#1c1b1d] overflow-hidden mb-4 flex items-center justify-center p-6 border border-black/5 dark:border-[#424656]/20 select-none transition-colors"
      >
        {/* Badges */}
        {product.inStock === false ? (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full backdrop-blur-md text-[10px] font-mono font-bold uppercase tracking-wider text-red-600 dark:text-red-400 bg-red-100/90 dark:bg-red-950/80 border border-red-300 dark:border-red-500/40 shadow-sm flex items-center gap-1.5 z-10">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 dark:bg-red-400"></span>
            Out of Stock
          </div>
        ) : product.badge ? (
          <div
            className={`absolute top-3 left-3 px-2.5 py-1 rounded-full backdrop-blur-sm text-[10px] font-mono font-medium uppercase tracking-wider z-10 ${getBadgeStyle()}`}
          >
            {product.badge}
          </div>
        ) : null}

        {/* Top-Right: Wishlist Heart & Quick View Action Controls */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          {hasMultipleImages && (
            <div className="px-2 py-0.5 rounded-full bg-white/90 dark:bg-[#131315]/80 backdrop-blur-md text-[#161618] dark:text-[#c2c6d8] text-[9px] font-mono border border-black/10 dark:border-[#424656]/40 flex items-center gap-1 shadow-sm">
              <Layers className="w-3 h-3 text-[#00838f] dark:text-[#00dce6]" />
              <span>{currentImgIdx + 1}/{images.length}</span>
            </div>
          )}

          {/* Wishlist / Stash Toggle Button */}
          <button
            type="button"
            onClick={handleToggleWishlist}
            className={`w-8 h-8 rounded-full bg-white/90 hover:bg-white dark:bg-[#131315]/80 dark:hover:bg-[#131315] flex items-center justify-center backdrop-blur-md transition-all cursor-pointer shadow-sm ${
              isSaved ? 'text-red-500 scale-105' : 'text-[#6e6e73] dark:text-[#c2c6d8] hover:text-red-500 dark:hover:text-red-400'
            }`}
            title={isSaved ? "Saved to My Stash (Click to remove)" : "Save to My Stash"}
            aria-label={isSaved ? "Saved in Stash" : "Save to Stash"}
          >
            <Heart className={`w-4 h-4 transition-transform active:scale-125 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
          </button>

          {/* Quick View overlay trigger on image */}
          <button
            type="button"
            onClick={() => onQuickView(product)}
            className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-[#161618] dark:bg-[#131315]/80 dark:hover:bg-[#131315] dark:text-[#c2c6d8] dark:hover:text-white flex items-center justify-center backdrop-blur-md transition-all cursor-pointer shadow-sm"
            title="See More & Specifications"
            aria-label="See More Specs"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Next / Prev Photo Arrows (Visible on card hover or for quick flipping) */}
        {hasMultipleImages && (
          <>
            <button
              type="button"
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-[#161618] dark:bg-[#131315]/70 dark:hover:bg-[#131315] dark:text-[#e5e1e4] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer shadow-md"
              title="Previous photo"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-[#161618] dark:bg-[#131315]/70 dark:hover:bg-[#131315] dark:text-[#e5e1e4] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer shadow-md"
              title="Next photo"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Active Product Image */}
        <img
          src={images[currentImgIdx] || product.image}
          alt={`${product.name} - Photo ${currentImgIdx + 1}`}
          loading="lazy"
          decoding="async"
          className={`w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 cursor-pointer ${
            product.inStock === false ? 'opacity-60 grayscale-[30%]' : ''
          }`}
          onClick={() => onQuickView(product)}
        />

        {/* Bottom Dot Indicators for Multiple Photos */}
        {hasMultipleImages && (
          <div className="absolute bottom-2 inset-x-0 flex items-center justify-center gap-1.5 z-10">
            {images.map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImgIdx(dotIdx);
                }}
                className={`transition-all rounded-full ${
                  dotIdx === currentImgIdx
                    ? 'w-4 h-1.5 bg-[#0066ff]'
                    : 'w-1.5 h-1.5 bg-black/20 dark:bg-[#8c90a1]/40 hover:bg-black/40 dark:hover:bg-[#c2c6d8]'
                }`}
                aria-label={`View photo ${dotIdx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Details & Specs */}
      <div className="flex flex-col flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-mono text-[#6e6e73] dark:text-[#8c90a1] uppercase tracking-wider">
            {product.categoryLabel}
          </span>
          {hasMultipleImages && (
            <span
              onClick={() => onQuickView(product)}
              className="text-[10px] font-mono text-[#00838f] dark:text-[#00dce6] hover:underline cursor-pointer"
            >
              See {images.length} photos
            </span>
          )}
        </div>

        <h3
          onClick={() => onQuickView(product)}
          className="font-['Geist',sans-serif] text-base md:text-[17px] text-[#161618] dark:text-[#e5e1e4] font-medium line-clamp-1 mb-2 hover:text-[#0066ff] dark:hover:text-[#ffb77d] transition-colors cursor-pointer"
        >
          {product.name}
        </h3>

        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono text-[#161618] dark:text-[#e5e1e4] font-bold">
              {formatPrice(product.priceGhs, currency)}
            </span>
            <span className="text-[10px] font-mono text-[#c26d2b] dark:text-[#ffb77d] px-2 py-0.5 rounded-full bg-[#c26d2b]/10 dark:bg-[#353437] border border-[#c26d2b]/20 dark:border-[#424656]/30">
              {product.featureTag}
            </span>
          </div>

          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded-full flex items-center gap-1.5 border shrink-0 ${
              product.inStock !== false
                ? 'bg-[#00838f]/10 dark:bg-[#007e85]/15 text-[#00838f] dark:text-[#00dce6] border-[#00838f]/30 dark:border-[#00dce6]/30'
                : 'bg-red-100 dark:bg-red-500/15 text-red-600 dark:text-red-400 border-red-300 dark:border-red-500/30'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                product.inStock !== false ? 'bg-[#00838f] dark:bg-[#00dce6] animate-pulse' : 'bg-red-500 dark:bg-red-400'
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
                ? 'bg-neutral-200 dark:bg-[#2a2a2c] text-neutral-400 dark:text-[#8c90a1] opacity-60 cursor-not-allowed border border-black/5 dark:border-[#424656]/30'
                : added
                ? 'bg-[#00838f] text-white cursor-pointer'
                : 'bg-[#161618] hover:bg-black text-white dark:bg-[#353437] dark:hover:bg-[#e5e1e4] dark:hover:text-[#131315] dark:text-[#e5e1e4] cursor-pointer'
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
            className="p-2.5 rounded-lg bg-black/5 hover:bg-black/10 dark:bg-[#353437] dark:hover:bg-[#39393b] text-[#00838f] dark:text-[#00dce6] transition-colors flex items-center justify-center"
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
