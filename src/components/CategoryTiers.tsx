import React from 'react';
import { Laptop, Smartphone, Tablet, ArrowRight } from 'lucide-react';
import { Category } from '../types';

interface CategoryTiersProps {
  onSelectTier: (category: Category) => void;
}

export const CategoryTiers: React.FC<CategoryTiersProps> = ({ onSelectTier }) => {
  return (
    <section className="w-full py-16 md:py-20 bg-[#131315]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#ffb77d] text-[11px] font-mono uppercase tracking-widest mb-2">
              <span>Category Taxonomy</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#ffb77d]"></span>
              <span>Modular Workspace Solutions</span>
            </div>
            <h2 className="font-['Geist',sans-serif] text-2xl sm:text-3xl md:text-4xl font-medium text-[#e5e1e4]">
              Engineered Hardware Tiers
            </h2>
          </div>
          <p className="text-[#c2c6d8] text-sm md:text-base max-w-md">
            Harmonized aluminum alloy structures designed to elevate thermal dissipation, ergonomics, and aesthetic purity.
          </p>
        </div>

        {/* 3-Column Tier Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Laptop Accessories */}
          <div
            onClick={() => {
              onSelectTier('laptops');
              const el = document.getElementById('catalogue');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group relative rounded-2xl bg-[#1c1b1d] p-7 md:p-8 flex flex-col justify-between overflow-hidden shadow-md hover:bg-[#201f21] border border-[#424656]/30 transition-all duration-300 cursor-pointer hover:border-[#ffb77d]/40"
          >
            <div className="relative z-10">
              <div className="w-10 h-10 rounded-xl bg-[#353437] flex items-center justify-center text-[#e5e1e4] mb-6 group-hover:scale-110 transition-transform">
                <Laptop className="w-5 h-5 text-[#e5e1e4]" />
              </div>
              <div className="text-[11px] font-mono text-[#ffb77d] uppercase tracking-wider mb-2">
                01 / Workspace Heavy
              </div>
              <h3 className="font-['Geist',sans-serif] text-xl font-medium text-[#e5e1e4] mb-2">
                Laptop Accessories
              </h3>
              <p className="text-xs sm:text-sm text-[#c2c6d8] leading-relaxed mb-6">
                Accessories designed for laptops and computers. Ergonomic risers, milled stands, braided thunderbolt cables, and multiport docks.
              </p>
            </div>

            <div className="relative z-10 pt-4 border-t border-[#424656]/20 flex items-center justify-between">
              <span className="text-xs font-mono text-[#e5e1e4] font-medium">
                Workspace Hardware Collection
              </span>
              <div className="w-8 h-8 rounded-full bg-[#2a2a2c] group-hover:bg-[#0066ff] group-hover:text-white flex items-center justify-center text-[#e5e1e4] transition-colors">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* Subtle Architectural SVG Motif */}
            <svg
              className="absolute -right-6 -bottom-6 w-44 h-44 text-[#353437]/20 group-hover:text-[#353437]/40 transition-colors pointer-events-none"
              fill="currentColor"
              viewBox="0 0 100 100"
            >
              <rect fill="none" height="48" rx="4" stroke="currentColor" strokeWidth="4" width="70" x="15" y="25" />
              <path d="M5 75h90v4H5z" />
            </svg>
          </div>

          {/* iPhone Accessories */}
          <div
            onClick={() => {
              onSelectTier('iphone');
              const el = document.getElementById('catalogue');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group relative rounded-2xl bg-[#1c1b1d] p-7 md:p-8 flex flex-col justify-between overflow-hidden shadow-md hover:bg-[#201f21] border border-[#424656]/30 transition-all duration-300 cursor-pointer hover:border-[#00dce6]/40"
          >
            <div className="relative z-10">
              <div className="w-10 h-10 rounded-xl bg-[#353437] flex items-center justify-center text-[#00dce6] mb-6 group-hover:scale-110 transition-transform">
                <Smartphone className="w-5 h-5 text-[#00dce6]" />
              </div>
              <div className="text-[11px] font-mono text-[#00dce6] uppercase tracking-wider mb-2">
                02 / Mobile Armour
              </div>
              <h3 className="font-['Geist',sans-serif] text-xl font-medium text-[#e5e1e4] mb-2">
                iPhone Accessories
              </h3>
              <p className="text-xs sm:text-sm text-[#c2c6d8] leading-relaxed mb-6">
                Cases, chargers, cables, protection, and MagSafe accessories. Aircraft-grade titanium bezels with high-tensile silicone bumpers.
              </p>
            </div>

            <div className="relative z-10 pt-4 border-t border-[#424656]/20 flex items-center justify-between">
              <span className="text-xs font-mono text-[#e5e1e4] font-medium">
                Mobile Armour Collection
              </span>
              <div className="w-8 h-8 rounded-full bg-[#2a2a2c] group-hover:bg-[#0066ff] group-hover:text-white flex items-center justify-center text-[#e5e1e4] transition-colors">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            <svg
              className="absolute -right-6 -bottom-6 w-44 h-44 text-[#353437]/20 group-hover:text-[#353437]/40 transition-colors pointer-events-none"
              fill="currentColor"
              viewBox="0 0 100 100"
            >
              <rect fill="none" height="80" rx="8" stroke="currentColor" strokeWidth="4" width="40" x="30" y="10" />
              <circle cx="50" cy="50" fill="none" r="14" stroke="currentColor" strokeWidth="3" />
            </svg>
          </div>

          {/* iPad Accessories */}
          <div
            onClick={() => {
              onSelectTier('ipad');
              const el = document.getElementById('catalogue');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group relative rounded-2xl bg-[#1c1b1d] p-7 md:p-8 flex flex-col justify-between overflow-hidden shadow-md hover:bg-[#201f21] border border-[#424656]/30 transition-all duration-300 cursor-pointer hover:border-[#ffb77d]/40"
          >
            <div className="relative z-10">
              <div className="w-10 h-10 rounded-xl bg-[#353437] flex items-center justify-center text-[#ffb77d] mb-6 group-hover:scale-110 transition-transform">
                <Tablet className="w-5 h-5 text-[#ffb77d]" />
              </div>
              <div className="text-[11px] font-mono text-[#ffb77d] uppercase tracking-wider mb-2">
                03 / Studio & Field
              </div>
              <h3 className="font-['Geist',sans-serif] text-xl font-medium text-[#e5e1e4] mb-2">
                iPad Accessories
              </h3>
              <p className="text-xs sm:text-sm text-[#c2c6d8] leading-relaxed mb-6">
                Keyboards, cases, chargers, stands, and stylus docks. Floating magnetic mounts engineered with dual-axis 360° fluid articulation.
              </p>
            </div>

            <div className="relative z-10 pt-4 border-t border-[#424656]/20 flex items-center justify-between">
              <span className="text-xs font-mono text-[#e5e1e4] font-medium">
                Studio & Field Collection
              </span>
              <div className="w-8 h-8 rounded-full bg-[#2a2a2c] group-hover:bg-[#0066ff] group-hover:text-white flex items-center justify-center text-[#e5e1e4] transition-colors">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            <svg
              className="absolute -right-6 -bottom-6 w-44 h-44 text-[#353437]/20 group-hover:text-[#353437]/40 transition-colors pointer-events-none"
              fill="currentColor"
              viewBox="0 0 100 100"
            >
              <rect fill="none" height="70" rx="6" stroke="currentColor" strokeWidth="4" width="60" x="20" y="15" />
              <line stroke="currentColor" strokeLinecap="round" strokeWidth="4" x1="35" x2="65" y1="85" y2="85" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};
