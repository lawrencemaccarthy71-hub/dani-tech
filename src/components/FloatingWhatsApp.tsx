import React from 'react';
import { MessageSquare } from 'lucide-react';
import { WHATSAPP_PHONE_RAW } from '../utils/format';

export const FloatingWhatsApp: React.FC = () => {
  return (
    <aside aria-label="WhatsApp Support" className="fixed bottom-6 right-6 z-30 flex items-center group">
      {/* Tooltip on hover */}
      <div className="hidden md:flex mr-3 px-3 py-1.5 rounded-full bg-[#1c1b1d]/90 backdrop-blur-md border border-[#424656]/40 text-[#e5e1e4] text-xs font-mono shadow-xl items-center gap-2 opacity-0 group-hover:opacity-100 transition-all pointer-events-none transform translate-x-2 group-hover:translate-x-0">
        <span className="w-1.5 h-1.5 rounded-full bg-[#00dce6] animate-pulse"></span>
        <span>Dani Tech Support Online</span>
      </div>

      <a
        href={`https://wa.me/${WHATSAPP_PHONE_RAW}?text=Hello%20Dani%20Tech,%20I%20am%20interested%20in%20ordering%20hardware`}
        target="_blank"
        rel="noopener noreferrer"
        className="relative w-13 h-13 rounded-full bg-[#007e85] hover:bg-[#00dce6] text-[#e0fdff] hover:text-[#002022] shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 border border-[#00dce6]/40 cursor-pointer"
        aria-label="Chat with Dani Tech on WhatsApp"
        title="Chat with Dani Tech on WhatsApp"
      >
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00dce6] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00dce6]"></span>
        </span>
        <MessageSquare className="w-6 h-6" />
      </a>
    </aside>
  );
};
