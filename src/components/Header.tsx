import React, { useState, useRef, useEffect } from 'react';
import { Search, ShoppingBag, MessageSquare, CheckCircle, Menu, X, User, ChevronDown } from 'lucide-react';
import { Category, Currency } from '../types';
import { WHATSAPP_PHONE_RAW } from '../utils/format';

interface HeaderProps {
  activeCategory: Category;
  onSelectCategory: (category: Category) => void;
  currency: Currency;
  onSelectCurrency: (currency: Currency) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  onOpenAbout: () => void;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeCategory,
  onSelectCategory,
  currency,
  onSelectCurrency,
  cartCount,
  onOpenCart,
  onOpenSearch,
  onOpenAbout,
  onOpenProfile,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyMenuOpen, setCurrencyMenuOpen] = useState(false);
  const currencyRef = useRef<HTMLDivElement>(null);

  const CURRENCIES: { value: Currency; symbol: string; label: string }[] = [
    { value: 'GHS', symbol: 'GH₵', label: 'GHS' },
    { value: 'USD', symbol: '$', label: 'USD' },
    { value: 'EUR', symbol: '€', label: 'EUR' },
    { value: 'GBP', symbol: '£', label: 'GBP' },
  ];

  const activeCurrency = CURRENCIES.find((c) => c.value === currency) ?? CURRENCIES[0];

  // Close currency menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (currencyRef.current && !currencyRef.current.contains(e.target as Node)) {
        setCurrencyMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const navItems: { label: string; category?: Category; isAbout?: boolean }[] = [
    { label: 'Shop All', category: 'all' },
    { label: 'Laptops', category: 'laptops' },
    { label: 'iPhone', category: 'iphone' },
    { label: 'iPad', category: 'ipad' },
    { label: 'Adapters & Hubs', category: 'adapters-hubs' },
    { label: 'About', isAbout: true },
  ];

  return (
    <header className="fixed top-0 w-full z-40 bg-[#131315]/85 backdrop-blur-xl border-b border-[#424656]/25 transition-all">
      {/* Top Delivery Announcement Banner */}
      <div className="bg-[#0e0e10] text-[#c2c6d8] text-center py-1.5 px-4 text-[11px] font-mono border-b border-[#424656]/20 tracking-wider flex items-center justify-center gap-2">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#ffb77d] animate-pulse"></span>
        <span className="truncate">
          Nationwide Delivery Across Accra & Greater Ghana • Express MoMo & WhatsApp Ordering
        </span>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo & Origin Tag */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              onSelectCategory('all');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2.5 group text-left cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0066ff] to-[#00dce6] p-[1px] shadow-sm flex items-center justify-center transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-[#131315] rounded-[7px] flex items-center justify-center">
                <span className="font-mono font-black text-xs text-[#00dce6] tracking-tighter">DT</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-['Geist',sans-serif] text-lg sm:text-xl font-bold tracking-tight text-[#e5e1e4]">
                Dani Tech
              </span>
              <span className="text-[9px] font-mono text-[#8c90a1] -mt-1 tracking-wider uppercase hidden sm:block">
                Workspace & Hardware
              </span>
            </div>
          </button>

          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#353437]/70 text-[#ffb77d] text-[10px] font-mono border border-[#424656]/30 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ffb77d]"></span>
            <span>Accra / Ghana</span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = !item.isAbout && activeCategory === item.category;
            return (
              <button
                key={item.label}
                onClick={() => {
                  if (item.isAbout) {
                    onOpenAbout();
                  } else if (item.category) {
                    onSelectCategory(item.category);
                    const catalogueEl = document.getElementById('catalogue');
                    if (catalogueEl) {
                      catalogueEl.scrollIntoView({ behavior: 'smooth' });
                    }
                  }
                }}
                className={`px-3.5 py-1.5 rounded-full text-[14px] font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#0066ff] text-white'
                    : 'text-[#c2c6d8] hover:text-white hover:bg-[#201f21]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Actions: Search, Currency, WhatsApp, Cart, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search */}
          <button
            onClick={onOpenSearch}
            className="w-9 h-9 flex items-center justify-center rounded-full text-[#c2c6d8] hover:bg-[#2a2a2c] hover:text-white transition-colors cursor-pointer"
            aria-label="Search hardware"
            title="Search Products (Ctrl+K)"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Currency Picker — 4-Currency Dropdown */}
          <div ref={currencyRef} className="relative">
            <button
              onClick={() => setCurrencyMenuOpen((prev) => !prev)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#201f21] hover:bg-[#2a2a2c] text-[#e5e1e4] text-[11px] font-mono border border-[#424656]/40 transition-colors cursor-pointer"
              title="Select currency"
              aria-label="Select currency"
            >
              <span className="text-[#ffb77d] font-bold">{activeCurrency.symbol}</span>
              <span>{activeCurrency.label}</span>
              <ChevronDown className={`w-3 h-3 text-[#8c90a1] transition-transform ${currencyMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {currencyMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-32 rounded-xl bg-[#1c1b1d] border border-[#424656]/40 shadow-2xl overflow-hidden z-50">
                {CURRENCIES.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => {
                      onSelectCurrency(c.value);
                      setCurrencyMenuOpen(false);
                    }}
                    className={`w-full text-left flex items-center gap-2 px-3.5 py-2 text-[12px] font-mono transition-colors cursor-pointer ${
                      c.value === currency
                        ? 'bg-[#0066ff]/20 text-[#ffb77d]'
                        : 'text-[#c2c6d8] hover:bg-[#2a2a2c] hover:text-white'
                    }`}
                  >
                    <span className="font-bold w-5">{c.symbol}</span>
                    <span>{c.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* WhatsApp Direct Concierge */}
          <a
            href={`https://wa.me/${WHATSAPP_PHONE_RAW}?text=Hello%20Dani%20Tech,%20I%20have%20an%20inquiry%20about%20your%20hardware%20accessories`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#2a2a2c] hover:bg-[#353437] text-[#e5e1e4] text-xs font-medium border border-[#424656]/30 transition-all hover:border-[#00dce6]/50"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#00dce6] animate-pulse"></span>
            <span>WhatsApp</span>
            <CheckCircle className="w-3.5 h-3.5 text-[#00dce6]" />
          </a>

          {/* Bag / Cart Trigger */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center justify-center w-9 h-9 rounded-full bg-[#2a2a2c] hover:bg-[#353437] text-white transition-colors cursor-pointer"
            aria-label="View shopping bag"
            title="View Shopping Bag"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#0066ff] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center ring-2 ring-[#131315]">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Profile / Order Tracking Button */}
          <button
            onClick={onOpenProfile}
            className="w-8 h-8 rounded-full bg-[#b3c5ff] hover:opacity-90 flex items-center justify-center text-[#002b75] transition-all cursor-pointer"
            aria-label="Order Status & Client Area"
            title="Order Status & Atelier Info"
          >
            <User className="w-4 h-4" />
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-full text-[#c2c6d8] hover:bg-[#2a2a2c] hover:text-white"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-[#e5e1e4]" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#1c1b1d] border-b border-[#424656]/40 px-4 py-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                setMobileMenuOpen(false);
                if (item.isAbout) {
                  onOpenAbout();
                } else if (item.category) {
                  onSelectCategory(item.category);
                  const catalogueEl = document.getElementById('catalogue');
                  if (catalogueEl) {
                    catalogueEl.scrollIntoView({ behavior: 'smooth' });
                  }
                }
              }}
              className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-[#e5e1e4] hover:bg-[#2a2a2c] transition-colors"
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2 border-t border-[#424656]/30">
            <p className="text-[10px] font-mono text-[#8c90a1] uppercase tracking-wider mb-2 px-1">Currency</p>
            <div className="grid grid-cols-4 gap-1.5">
              {CURRENCIES.map((c) => (
                <button
                  key={c.value}
                  onClick={() => {
                    onSelectCurrency(c.value);
                    setMobileMenuOpen(false);
                  }}
                  className={`py-2 rounded-lg text-[11px] font-mono font-medium transition-colors cursor-pointer ${
                    c.value === currency
                      ? 'bg-[#0066ff] text-white'
                      : 'bg-[#2a2a2c] text-[#c2c6d8] hover:bg-[#353437]'
                  }`}
                >
                  {c.symbol}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
