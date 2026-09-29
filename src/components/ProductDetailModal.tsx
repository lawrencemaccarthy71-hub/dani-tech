import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, MessageSquare, ShieldCheck, Check, Truck, Layers, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const [activeIdx, setActiveIdx] = useState(0);
  const [added, setAdded] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  useEffect(() => {
    setActiveIdx(0);
    setAdded(false);
  }, [product?.id]);

  if (!product) return null;

  const images = (product.images && product.images.length > 0)
    ? product.images
    : [product.image];
  const hasMultipleImages = images.length > 1;

  const handleAdd = () => {
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const nextImage = () => {
    setActiveIdx((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActiveIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null || !hasMultipleImages) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 35) {
      if (diff > 0) nextImage();
      else prevImage();
    }
    setTouchStartX(null);
  };

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
          {/* Visual Showcase with Gallery and Swipe */}
          <div className="bg-[#131315] p-6 flex flex-col justify-between relative border-b md:border-b-0 md:border-r border-[#424656]/30">
            {/* Badges */}
            <div className="flex items-center justify-between w-full mb-2">
              {product.inStock === false ? (
                <span className="px-2.5 py-1 rounded-full bg-red-950/80 text-red-400 text-[10px] font-mono uppercase tracking-wider border border-red-500/40 shadow-sm flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                  Out of Stock
                </span>
              ) : product.badge ? (
                <span className="px-2.5 py-1 rounded-full bg-[#353437] text-[#ffb77d] text-[10px] font-mono uppercase tracking-wider border border-[#424656]/30">
                  {product.badge}
                </span>
              ) : <div />}

              {hasMultipleImages && (
                <span className="text-[10px] font-mono text-[#8c90a1] bg-[#1c1b1d] px-2 py-0.5 rounded-full border border-[#424656]/30">
                  Photo {activeIdx + 1} of {images.length}
                </span>
              )}
            </div>

            {/* Main Active Image Display */}
            <div
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="relative w-full aspect-square my-2 flex items-center justify-center select-none"
            >
              {hasMultipleImages && (
                <>
                  <button
                    type="button"
                    onClick={prevImage}
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#1c1b1d]/80 hover:bg-[#1c1b1d] text-[#e5e1e4] flex items-center justify-center transition-all cursor-pointer shadow-md z-10"
                    title="Previous photo"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={nextImage}
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#1c1b1d]/80 hover:bg-[#1c1b1d] text-[#e5e1e4] flex items-center justify-center transition-all cursor-pointer shadow-md z-10"
                    title="Next photo"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              <img
                src={images[activeIdx] || product.image}
                alt={`${product.name} - Angle ${activeIdx + 1}`}
                className={`max-h-64 w-auto object-contain transition-all duration-200 ${
                  product.inStock === false ? 'opacity-60 grayscale-[25%]' : ''
                }`}
              />
            </div>

            {/* Thumbnails Row for Multiple Photos */}
            {hasMultipleImages ? (
              <div className="flex items-center justify-center gap-2 pt-2 overflow-x-auto scrollbar-none">
                {images.map((imgUrl, thumbIdx) => (
                  <button
                    key={thumbIdx}
                    type="button"
                    onClick={() => setActiveIdx(thumbIdx)}
                    className={`w-12 h-12 rounded-lg bg-[#1c1b1d] p-1 border transition-all cursor-pointer shrink-0 ${
                      thumbIdx === activeIdx
                        ? 'border-[#0066ff] ring-2 ring-[#0066ff]/50 scale-105'
                        : 'border-[#424656]/30 hover:border-[#8c90a1]'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`Thumbnail ${thumbIdx + 1}`}
                      className="w-full h-full object-contain rounded"
                    />
                  </button>
                ))}
              </div>
            ) : (
              <div className="w-full text-center">
                <span className="text-[11px] font-mono text-[#00dce6]">
                  Guaranteed Fit for Apple Ecosystem
                </span>
              </div>
            )}
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

              {/* Hardware Specifications */}
              <div className="rounded-xl bg-[#131315] p-3.5 border border-[#424656]/20 space-y-2 text-xs">
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#ffb77d] uppercase tracking-wider mb-1">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Hardware Specifications</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-[#8c90a1]">Material:</span>{' '}
                    <span className="text-[#e5e1e4]">{product.specs.material}</span>
                  </div>
                  <div>
                    <span className="text-[#8c90a1]">Finish:</span>{' '}
                    <span className="text-[#e5e1e4]">{product.specs.finish}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[#8c90a1]">Compatibility:</span>{' '}
                    <span className="text-[#e5e1e4]">{product.specs.compatibility}</span>
                  </div>
                  {product.specs.dimensions && (
                    <div>
                      <span className="text-[#8c90a1]">Dimensions:</span>{' '}
                      <span className="text-[#e5e1e4]">{product.specs.dimensions}</span>
                    </div>
                  )}
                  {product.specs.weight && (
                    <div>
                      <span className="text-[#8c90a1]">Weight:</span>{' '}
                      <span className="text-[#e5e1e4]">{product.specs.weight}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Delivery & Warranty Trust Signals */}
            <div className="space-y-2 text-[11px] font-mono text-[#8c90a1]">
              <div className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-[#00dce6]" />
                <span>Accra Same-Day Delivery available (Bolt / Yango dispatch)</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#ffb77d]" />
                <span>{product.specs.warranty}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2.5 pt-2">
              <button
                onClick={handleAdd}
                disabled={product.inStock === false}
                className={`flex-1 py-3 px-4 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                  product.inStock === false
                    ? 'bg-[#2a2a2c] text-[#8c90a1] opacity-50 cursor-not-allowed'
                    : added
                    ? 'bg-[#007e85] text-white'
                    : 'bg-[#0066ff] hover:bg-[#0054d6] text-white'
                }`}
              >
                {product.inStock === false ? (
                  <span>Out of Stock</span>
                ) : added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart ({formatPrice(product.priceGhs, currency)})</span>
                  </>
                )}
              </button>

              <a
                href={generateProductWhatsAppUrl(product.name, product.priceGhs)}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-xl bg-[#201f21] hover:bg-[#2a2a2c] text-[#00dce6] text-xs font-semibold flex items-center justify-center gap-1.5 border border-[#424656]/30 transition-colors"
                title="Direct WhatsApp Order"
              >
                <MessageSquare className="w-4 h-4" />
                <span className="hidden sm:inline">WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
