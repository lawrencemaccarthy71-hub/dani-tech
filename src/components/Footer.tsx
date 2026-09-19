import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Instagram, PlayCircle, ArrowRight, Check, Lock } from 'lucide-react';
import { Category } from '../types';
import { WHATSAPP_PHONE_RAW } from '../utils/format';

interface FooterProps {
  onSelectCategory: (category: Category) => void;
  onOpenAbout: () => void;
  onOpenProfile: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenAbout,
  onOpenProfile,
}) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="w-full bg-[#0a0a0c] border-t border-[#424656]/30 text-[#c2c6d8] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#424656]/20">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
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
                <span className="font-['Geist',sans-serif] text-xl font-bold tracking-tight text-[#e5e1e4]">
                  Dani Tech
                </span>
                <span className="text-[9px] font-mono text-[#8c90a1] -mt-1 tracking-wider uppercase">
                  Workspace & Mobile Hardware
                </span>
              </div>
              <span className="px-2 py-0.5 ml-2 rounded bg-[#201f21] text-[#ffb77d] text-[10px] font-mono border border-[#424656]/30">
                ACCRA / GH
              </span>
            </button>

            <p className="text-xs sm:text-sm text-[#8c90a1] max-w-sm leading-relaxed">
              High-performance hardware accessories engineered for modern laptops, iPads, and iPhones. Physical hardware hub based in East Legon, Accra.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono text-[#8c90a1] uppercase tracking-wider block w-full mb-1">
                Accepted Payment Rails
              </span>
              <span className="px-2.5 py-1 rounded bg-[#1c1b1d] text-[11px] font-mono text-[#ffb77d] border border-[#424656]/30">
                MTN MoMo
              </span>
              <span className="px-2.5 py-1 rounded bg-[#1c1b1d] text-[11px] font-mono text-[#00dce6] border border-[#424656]/30">
                Telecel Cash
              </span>
              <span className="px-2.5 py-1 rounded bg-[#1c1b1d] text-[11px] font-mono text-[#b3c5ff] border border-[#424656]/30">
                Visa / MC
              </span>
            </div>
          </div>

          {/* Collections Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#e5e1e4] font-semibold">
              Hardware Tiers
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => {
                    onSelectCategory('laptops');
                    document.getElementById('catalogue')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Workspace Heavy (Laptops)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectCategory('iphone');
                    document.getElementById('catalogue')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Mobile Armour (iPhone)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectCategory('ipad');
                    document.getElementById('catalogue')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Studio & Field (iPad)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectCategory('adapters-hubs');
                    document.getElementById('catalogue')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Adapters & Hubs
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectCategory('all');
                    document.getElementById('catalogue')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  All Curated Hardware
                </button>
              </li>
            </ul>
          </div>

          {/* Client Care Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#e5e1e4] font-semibold">
              Client Care
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href={`https://wa.me/${WHATSAPP_PHONE_RAW}?text=Hello%20Dani%20Tech,%20I%20have%20a%20support%20question`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#00dce6]" />
                  <span>WhatsApp Support</span>
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenProfile}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Track Order / Delivery
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAbout}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  East Legon Hardware Hub
                </button>
              </li>
              <li>
                <span className="text-[#8c90a1]">1-Year Dani Tech Guarantee</span>
              </li>
              <li>
                <span className="text-[#8c90a1]">Same-Day Accra Courier</span>
              </li>
              <li className="pt-1">
                <Link
                  to="/admin"
                  className="text-[11px] font-mono text-[#8c90a1] hover:text-[#ffb77d] transition-colors inline-flex items-center gap-1"
                >
                  <Lock className="w-3 h-3" /> Staff Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Dani Tech Dispatch Newsletter */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#e5e1e4] font-semibold">
              Dani Tech Dispatch
            </h4>
            <p className="text-xs text-[#8c90a1] leading-relaxed">
              Receive notifications on new alloy hardware drops, adapter releases, and Accra restocks.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#1c1b1d] border border-[#424656]/40 text-xs text-[#e5e1e4] placeholder-[#8c90a1] focus:outline-none focus:border-[#0066ff]"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 px-3 rounded-lg bg-[#201f21] hover:bg-[#353437] text-xs font-medium text-[#e5e1e4] transition-colors flex items-center justify-center gap-1.5 border border-[#424656]/30 cursor-pointer"
              >
                {subscribed ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#00dce6]" />
                    <span>Subscribed</span>
                  </>
                ) : (
                  <>
                    <span>Subscribe</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Credits & Social */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-[#8c90a1]">
          <div className="flex items-center gap-2">
            <span>© 2025 DANI TECH. ALL RIGHTS RESERVED.</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={`https://wa.me/${WHATSAPP_PHONE_RAW}?text=Hello%20Dani%20Tech,%20I%20am%20interested%20in%20ordering%20hardware`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#00dce6] transition-colors flex items-center gap-1"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#ffb77d] transition-colors flex items-center gap-1"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>Instagram</span>
            </a>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#b3c5ff] transition-colors flex items-center gap-1"
            >
              <PlayCircle className="w-3.5 h-3.5" />
              <span>TikTok</span>
            </a>
          </div>

          <div className="text-[10px] uppercase text-[#ffb77d]">
            ENGINEERED IN ACCRA, GHANA
          </div>
        </div>
      </div>
    </footer>
  );
};
