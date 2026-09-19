import React, { useState, useEffect } from 'react';
import { MessageSquare, PlayCircle, Instagram, Zap, Clock, MapPin, CreditCard } from 'lucide-react';
import { WHATSAPP_PHONE_RAW, WHATSAPP_PHONE_FORMATTED } from '../utils/format';

const AccraClock: React.FC = React.memo(() => {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Accra is UTC+0 (GMT)
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Africa/Accra',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      };
      setCurrentTime(new Intl.DateTimeFormat('en-GB', options).format(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!currentTime) return null;

  return (
    <span className="text-[11px] font-mono text-[#8c90a1] hidden sm:inline">
      ({currentTime} GMT)
    </span>
  );
});

export const CommunitySection: React.FC = () => {

  return (
    <section className="w-full py-16 md:py-20 bg-[#0e0e10]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#1c1b1d] p-7 sm:p-10 md:p-14 relative overflow-hidden shadow-2xl border border-[#424656]/30">
          {/* Ambient lighting orb */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[#0066ff]/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            {/* Left Content */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <div className="inline-flex items-center gap-2 text-[#ffb77d] text-[11px] font-mono uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-[#ffb77d]"></span>
                <span>Direct Studio Channel</span>
              </div>

              <h2 className="font-['Geist',sans-serif] text-2xl sm:text-3xl md:text-4xl font-medium text-[#e5e1e4]">
                Connect Directly with Dani Tech
              </h2>

              <p className="text-sm sm:text-base text-[#c2c6d8] leading-relaxed max-w-xl">
                We publish drop announcements, desk setup inspiration, and hardware test clips directly across TikTok and WhatsApp. Order via DM or speak to our engineers directly.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-4">
                <a
                  href={`https://wa.me/${WHATSAPP_PHONE_RAW}?text=Hello%20Dani%20Tech,%20I%20am%20messaging%20from%20the%20website`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 rounded-xl bg-[#007e85] hover:bg-[#00dce6] text-[#e0fdff] hover:text-[#002022] text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 shadow-md hover:scale-[1.01] cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat on WhatsApp ({WHATSAPP_PHONE_FORMATTED})</span>
                </a>

                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3.5 rounded-xl bg-[#2a2a2c] hover:bg-[#353437] text-[#e5e1e4] text-xs sm:text-sm font-medium transition-colors flex items-center gap-2 border border-[#424656]/30 shadow-sm cursor-pointer"
                >
                  <PlayCircle className="w-4 h-4 text-[#ffb77d]" />
                  <span>Follow on TikTok</span>
                </a>

                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3.5 rounded-xl bg-[#2a2a2c] hover:bg-[#353437] text-[#e5e1e4] text-xs sm:text-sm font-medium transition-colors flex items-center gap-2 border border-[#424656]/30 shadow-sm cursor-pointer"
                >
                  <Instagram className="w-4 h-4 text-[#b3c5ff]" />
                  <span>Instagram</span>
                </a>
              </div>
            </div>

            {/* Right Telemetry Card */}
            <div className="lg:col-span-5 flex flex-col gap-4 bg-[#201f21] p-6 rounded-2xl border border-[#424656]/30 shadow-inner">
              <div className="flex items-center justify-between pb-3 border-b border-[#424656]/30">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-[#e5e1e4] uppercase tracking-wider font-semibold">
                    Live Dispatch Telemetry
                  </span>
                  <AccraClock />
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#2a2a2c] text-[#ffb77d] text-[10px] font-mono border border-[#424656]/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ffb77d] animate-pulse"></span> Open Now
                </span>
              </div>

              <div className="space-y-2.5 text-xs text-[#c2c6d8]">
                <div className="flex justify-between items-center py-2 bg-[#1c1b1d] px-3.5 rounded-lg border border-[#424656]/20">
                  <div className="flex items-center gap-2 text-[#8c90a1] font-mono text-[10px]">
                    <MapPin className="w-3.5 h-3.5 text-[#ffb77d]" />
                    <span>LOCATION</span>
                  </div>
                  <span className="text-[#e5e1e4] font-medium">East Legon, Dani Tech Hub, Accra</span>
                </div>

                <div className="flex justify-between items-center py-2 bg-[#1c1b1d] px-3.5 rounded-lg border border-[#424656]/20">
                  <div className="flex items-center gap-2 text-[#8c90a1] font-mono text-[10px]">
                    <Clock className="w-3.5 h-3.5 text-[#00dce6]" />
                    <span>SAME-DAY CUTOFF</span>
                  </div>
                  <span className="text-[#e5e1e4] font-medium">Orders placed before 4:00 PM</span>
                </div>

                <div className="flex justify-between items-center py-2 bg-[#1c1b1d] px-3.5 rounded-lg border border-[#424656]/20">
                  <div className="flex items-center gap-2 text-[#8c90a1] font-mono text-[10px]">
                    <CreditCard className="w-3.5 h-3.5 text-[#b3c5ff]" />
                    <span>PAYMENT METHODS</span>
                  </div>
                  <span className="text-[#e5e1e4] font-medium">MTN MoMo, Telecel, Card</span>
                </div>
              </div>

              <div className="p-3.5 bg-[#2a2a2c] rounded-xl flex items-center gap-3 border border-[#424656]/20">
                <Zap className="w-5 h-5 text-[#ffb77d] shrink-0" />
                <p className="text-xs text-[#e5e1e4]">
                  Instant delivery dispatch available on <span className="font-semibold text-white">Bolt</span> and <span className="font-semibold text-white">Yango</span> across Greater Accra.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
