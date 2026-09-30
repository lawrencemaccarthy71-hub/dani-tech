import React from 'react';
import { ShieldCheck, ShoppingCart, Truck, Headphones } from 'lucide-react';

export const TrustPillars: React.FC = () => {
  const pillars = [
    {
      icon: ShieldCheck,
      iconColor: 'text-[#0066ff] dark:text-[#b3c5ff]',
      title: 'Quality Products',
      description:
        'Carefully selected accessories for your everyday devices. Every batch is calibrated and verified against real Apple hardware for exact tolerances.',
    },
    {
      icon: ShoppingCart,
      iconColor: 'text-[#c26d2b] dark:text-[#ffb77d]',
      title: 'Easy Ordering',
      description:
        'Browse, add to cart, and order seamlessly through WhatsApp or checkout directly with automated MTN MoMo & Telecel Cash validation.',
    },
    {
      icon: Truck,
      iconColor: 'text-[#00838f] dark:text-[#00dce6]',
      title: 'Convenient Delivery',
      description:
        'Provide your Ghana Post GPS location and we handle the rest. Dedicated couriers deliver across Accra in hours, plus Kumasi & Takoradi overnight.',
    },
    {
      icon: Headphones,
      iconColor: 'text-[#161618] dark:text-[#e5e1e4]',
      title: 'Direct Client Support',
      description:
        'Reach our Madina hardware desk anytime via WhatsApp voice or direct chat. Real engineers handling device compatibility and setup advice.',
    },
  ];

  return (
    <section className="w-full py-16 md:py-20 bg-[#fbfbfa] dark:bg-[#131315] transition-colors duration-250">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 text-[#c26d2b] dark:text-[#ffb77d] text-[11px] font-mono uppercase tracking-widest mb-3 transition-colors">
            <span>The Dani Tech Benchmark</span>
          </div>
          <h2 className="font-['Geist',sans-serif] text-2xl sm:text-3xl md:text-4xl font-medium text-[#161618] dark:text-[#e5e1e4] transition-colors">
            Engineered for Daily Reliability
          </h2>
          <p className="text-sm md:text-base text-[#555558] dark:text-[#c2c6d8] mt-3 transition-colors">
            Built with aerospace-grade materials, rapid local dispatch, and genuine engineer-backed support.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="p-7 rounded-2xl bg-white dark:bg-[#1c1b1d] border border-black/8 dark:border-[#424656]/25 flex flex-col shadow-sm hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-black/5 dark:bg-[#2a2a2c] flex items-center justify-center mb-6 shadow-inner transition-colors">
                  <Icon className={`w-6 h-6 ${pillar.iconColor}`} />
                </div>
                <h3 className="font-['Geist',sans-serif] text-lg md:text-[20px] text-[#161618] dark:text-[#e5e1e4] font-medium mb-2 transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#555558] dark:text-[#c2c6d8] leading-relaxed transition-colors">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
