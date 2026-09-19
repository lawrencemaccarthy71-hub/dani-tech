import React from 'react';
import { ArrowRight, MessageSquare, Truck, ShieldCheck, Sparkles } from 'lucide-react';
import { WHATSAPP_PHONE_RAW } from '../utils/format';

interface HeroProps {
  onShopClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onShopClick }) => {
  return (
    <section className="relative w-full overflow-hidden bg-[#0e0e10] pt-12 pb-16 md:pt-20 md:pb-24">
      {/* Subtle Atmospheric Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[800px] h-[360px] bg-[#0066ff]/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-10 w-80 h-80 bg-[#ffb77d]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Centered Headline Content */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2a2a2c]/80 text-[#ffb77d] text-[11px] font-mono mb-6 shadow-sm border border-[#424656]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ffb77d] animate-pulse"></span>
            <span className="tracking-widest uppercase">Engineered in Accra • 2025 Release</span>
          </div>

          <h1 className="font-['Geist',sans-serif] text-4xl sm:text-5xl md:text-6xl font-semibold text-[#e5e1e4] tracking-tight leading-[1.1] mb-6">
            Premium Accessories.<br className="hidden sm:inline" /> Built for Your Tech.
          </h1>

          <p className="font-sans text-base sm:text-lg text-[#c2c6d8] max-w-2xl mb-8 leading-relaxed">
            Quality accessories for laptops, iPads and iPhones — carefully selected for everyday performance, architectural symmetry, and enduring style.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onShopClick}
              className="px-8 py-3.5 rounded-full bg-[#e5e1e4] hover:bg-white text-[#131315] text-[15px] font-semibold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Shop Accessories</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href={`https://wa.me/${WHATSAPP_PHONE_RAW}?text=Hello%20Dani%20Tech,%20I%20would%20like%20to%20chat%20with%20your%20team%20about%20ordering%20hardware`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-7 py-3.5 rounded-full bg-[#353437]/60 hover:bg-[#353437] text-[#e5e1e4] text-[15px] font-medium transition-all flex items-center gap-2.5 shadow-sm border border-[#424656]/30 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-[#00dce6]" />
              <span>Contact on WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Hero Visual Frame with Floating Spec Badges */}
        <div className="relative w-full max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-2xl bg-[#1c1b1d] border border-[#424656]/30">
          <div className="aspect-[16/9] w-full relative group">
            <picture>
              <source srcSet="/assets/hero-workspace-4k.webp" type="image/webp" />
              <img
                src="/assets/hero-workspace-4k.jpg"
                alt="Dani Tech Premium Apple Accessories Studio Setup"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.01]"
                loading="eager"
                fetchPriority="high"
                decoding="async"
                width={2560}
                height={1440}
              />
            </picture>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e10] via-transparent to-black/20 pointer-events-none"></div>

            {/* Floating Interactive Callouts */}
            <div className="absolute top-5 left-5 md:top-8 md:left-8 flex items-center gap-2.5 px-3.5 py-1.5 md:px-4 md:py-2 rounded-full bg-[#131315]/85 backdrop-blur-md text-[#e5e1e4] text-xs md:text-sm font-mono shadow-lg border border-[#424656]/40">
              <span className="w-2 h-2 rounded-full bg-[#00dce6] animate-ping"></span>
              <span className="font-medium">Space Grey Anodized Finish</span>
            </div>

            <div className="hidden sm:flex absolute bottom-8 left-8 items-center gap-2.5 px-4 py-2 rounded-full bg-[#131315]/85 backdrop-blur-md text-[#e5e1e4] text-xs md:text-sm font-mono shadow-lg border border-[#424656]/40">
              <Truck className="w-4 h-4 text-[#ffb77d]" />
              <span>Ghana Next-Day Express Delivery</span>
            </div>

            <div className="absolute bottom-5 right-5 md:bottom-8 md:right-8 flex items-center gap-2.5 px-3.5 py-1.5 md:px-4 md:py-2 rounded-full bg-[#131315]/85 backdrop-blur-md text-[#e5e1e4] text-xs md:text-sm font-mono shadow-lg border border-[#424656]/40">
              <ShieldCheck className="w-4 h-4 text-[#b3c5ff]" />
              <span>100% Guaranteed Device Fit</span>
            </div>

            {/* Floating Direct WhatsApp Order Trigger on Canvas */}
            <a
              href={`https://wa.me/${WHATSAPP_PHONE_RAW}?text=Hi%20Dani%20Tech,%20I%20am%20viewing%20the%20setup%20on%20your%20site%20and%20would%20like%20to%20order`}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-5 right-5 hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#131315]/85 hover:bg-[#131315] backdrop-blur-md text-[#e5e1e4] text-xs font-mono border border-[#00dce6]/40 shadow-lg transition-colors cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-[#00dce6]"></span>
              <span>Chat & Order on WhatsApp</span>
              <MessageSquare className="w-3.5 h-3.5 text-[#00dce6]" />
            </a>
          </div>
        </div>

        {/* Quick Metrics Ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-4xl mx-auto -mt-6 relative z-20 px-2 sm:px-4">
          <div className="p-4 rounded-xl bg-[#2a2a2c]/90 backdrop-blur-lg shadow-xl border border-[#424656]/30 flex flex-col items-center text-center">
            <span className="font-['Geist',sans-serif] text-2xl md:text-3xl font-semibold text-[#e5e1e4]">
              2,400+
            </span>
            <span className="text-[10px] md:text-[11px] font-mono text-[#c2c6d8] uppercase mt-1 tracking-wider">
              Accra Setups Upgraded
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#2a2a2c]/90 backdrop-blur-lg shadow-xl border border-[#424656]/30 flex flex-col items-center text-center">
            <span className="font-['Geist',sans-serif] text-2xl md:text-3xl font-semibold text-[#ffb77d]">
              30 Min
            </span>
            <span className="text-[10px] md:text-[11px] font-mono text-[#c2c6d8] uppercase mt-1 tracking-wider">
              WhatsApp Response Time
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#2a2a2c]/90 backdrop-blur-lg shadow-xl border border-[#424656]/30 flex flex-col items-center text-center">
            <span className="font-['Geist',sans-serif] text-lg md:text-2xl font-semibold text-[#e5e1e4] mt-1 md:mt-0">
              MTN & Telecel
            </span>
            <span className="text-[10px] md:text-[11px] font-mono text-[#c2c6d8] uppercase mt-1 tracking-wider">
              Instant MoMo Rail
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#2a2a2c]/90 backdrop-blur-lg shadow-xl border border-[#424656]/30 flex flex-col items-center text-center">
            <span className="font-['Geist',sans-serif] text-2xl md:text-3xl font-semibold text-[#00dce6]">
              1-Year
            </span>
            <span className="text-[10px] md:text-[11px] font-mono text-[#c2c6d8] uppercase mt-1 tracking-wider">
              Hardware Replacement
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
