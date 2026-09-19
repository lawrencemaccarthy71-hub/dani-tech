import React, { useState } from 'react';
import {
  X,
  Laptop,
  Smartphone,
  Tablet,
  Monitor,
  Check,
  Truck,
  ShieldCheck,
  Zap,
  MapPin,
  MessageSquare,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Sparkles,
  HelpCircle,
  RefreshCw,
  Star,
  CheckCircle2
} from 'lucide-react';
import { WHATSAPP_PHONE_RAW, WHATSAPP_PHONE_FORMATTED } from '../utils/format';
import { Category } from '../types';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExploreCatalog?: () => void;
  onSelectCategory?: (category: Category) => void;
}

type DeviceType = 'macbook' | 'iphone' | 'ipad' | 'desk';
type GhanaRegion = 'accra' | 'kumasi' | 'takoradi' | 'other';

export const AboutModal: React.FC<AboutModalProps> = ({
  isOpen,
  onClose,
  onExploreCatalog,
  onSelectCategory
}) => {
  if (!isOpen) return null;

  // Interactive State
  const [selectedDevice, setSelectedDevice] = useState<DeviceType>('macbook');
  const [selectedRegion, setSelectedRegion] = useState<GhanaRegion>('accra');
  const [compareChoice, setCompareChoice] = useState<'danitech' | 'clones'>('danitech');
  const [openFaq, setOpenFaq] = useState<number | null>(0); // First FAQ open by default

  const handleExplore = () => {
    onClose();
    if (onExploreCatalog) {
      onExploreCatalog();
    } else {
      const catalogueEl = document.getElementById('catalogue');
      if (catalogueEl) {
        catalogueEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleBrowseLaptops = () => {
    if (onSelectCategory) {
      onSelectCategory('laptops');
    }
    onClose();
    const catalogueEl = document.getElementById('catalogue');
    if (catalogueEl) {
      catalogueEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Device Guides Content
  const deviceGuides = {
    macbook: {
      title: 'For MacBook & Laptop Owners (Or Buyers)',
      icon: Laptop,
      painPoint: 'Worried about buying a second-hand laptop with bad battery health or hidden repairs, and tired of wobbly plastic stands that shake whenever you type.',
      solution: 'We supply 100% verified, clean-serial MacBooks with pristine battery health, plus solid heavy metal elevator stands that bring your screen to eye-level with zero wobble.',
      recommended: 'Clean Verified MacBooks + Apex Aluminum Elevator Stand',
      badge: 'Verified Clean Hardware'
    },
    iphone: {
      title: 'For iPhone & AirPods',
      icon: Smartphone,
      painPoint: 'Cheap cables snap after a few weeks, and unbranded chargers get dangerously hot and damage your battery health.',
      solution: 'Safe certified fast-chargers and weighted magnetic docks that snap firmly in place and charge quickly without overheating.',
      recommended: 'Titanium Duo Magnetic Wireless Charging Stand',
      badge: 'Battery-Safe Fast Charge'
    },
    ipad: {
      title: 'For iPad & Tablets',
      icon: Tablet,
      painPoint: 'Floppy folio cases slip flat when you tap the screen, and drawing or taking video calls on your desk feels awkward.',
      solution: 'Solid 360° magnetic stands with fluid hinges that lock securely at any angle for drawing, video calls, and movie watching.',
      recommended: 'Apex Neodymium Magnetic iPad Studio Mount',
      badge: 'Firm Magnetic Hold'
    },
    desk: {
      title: 'For Full Workspaces',
      icon: Monitor,
      painPoint: 'A messy tangle of adapters that disconnect your external monitors, lag your mouse, or drop hard drives unexpectedly.',
      solution: 'Clean multi-port hubs and heavy stands that turn your laptop into an executive multi-screen workstation with one cord.',
      recommended: 'HyperDrive 8-in-1 4K Precision Dock',
      badge: 'Single Cable Setup'
    }
  };

  // Delivery Destinations
  const deliveryInfo = {
    accra: {
      title: 'Greater Accra',
      sub: 'East Legon, Osu, Airport, Spintex, Tema, Dansoman, Legon Campus...',
      time: '⚡ 2 to 4 Hours Same-Day Delivery',
      courier: 'Dedicated dispatch rider straight to your doorstep',
      payment: '💵 Cash on Delivery or Mobile Money (MTN MoMo, Telecel Cash) when rider arrives'
    },
    kumasi: {
      title: 'Kumasi & Ashanti Region',
      sub: 'Adum, KNUST, Ahodwo, Asokwa, Bantama, Santasi...',
      time: '📦 Next-Day Delivery (Within 24 Hours)',
      courier: 'VIP / STC Parcel Express with trackable waybill code',
      payment: '📱 Mobile Money (MTN MoMo / Telecel Cash) with instant payment receipt'
    },
    takoradi: {
      title: 'Takoradi & Western Region',
      sub: 'Takoradi Market Circle, Sekondi, Tarkwa, Cape Coast...',
      time: '📦 Next-Day Delivery (Within 24 Hours)',
      courier: 'Direct regional courier parcel pickup or door delivery',
      payment: '📱 Mobile Money (MTN MoMo / Telecel Cash) with instant payment receipt'
    },
    other: {
      title: 'Tamale, Sunyani, Ho, Koforidua & All 16 Regions',
      sub: 'Delivered securely to any town in Ghana',
      time: '📦 24 to 48 Hours Delivery',
      courier: 'Tracked intercity express parcel network',
      payment: '📱 Mobile Money (MTN MoMo / Telecel Cash) with instant payment receipt'
    }
  };

  // FAQs
  const faqs = [
    {
      q: 'Do you sell laptops or only accessories?',
      a: 'We sell both! We specialize in verified, clean Apple MacBooks (MacBook Air & MacBook Pro M1, M2, M3, M4) as well as premium business laptops. Every machine undergoes a comprehensive 25-point hardware diagnostic: battery health verified, genuine charger included, and 100% free of any iCloud, MDM, or firmware locks. You can inspect it at our East Legon Hub or test it on delivery in Accra before paying.'
    },
    {
      q: 'Can I inspect or test the item before paying?',
      a: 'Yes, 100%! If you are anywhere in Greater Accra, our dispatch rider brings the package (laptop or accessory) to your location and you can inspect, boot it up, and test it before paying Cash on Delivery or MoMo. You can also message us on WhatsApp for a live video demonstration of any product before we dispatch.'
    },
    {
      q: 'Will your stands scratch my laptop, iPad, or phone?',
      a: 'Never. Every single stand and holder has soft, thick, non-slip rubber and silicone cushions covering every spot where your device rests. Pure metal never touches your device.'
    },
    {
      q: 'What if an accessory does not fit my laptop size or phone case?',
      a: 'We give you a full 7-day hassle-free exchange or money-back guarantee. If it doesn’t fit your device like a glove, just message us on WhatsApp and we will swap it for another size or refund you without any stress.'
    },
    {
      q: 'Can I walk into your shop in Accra?',
      a: 'Yes, warmly welcome! We are located at the Dani Tech Hub in East Legon, Accra. You can come by to test your laptop on different stands, see our available MacBook models in person, or pick up an order directly.'
    }
  ];

  const activeDeviceData = deviceGuides[selectedDevice];
  const activeDeliveryData = deliveryInfo[selectedRegion];

  const conciergeWhatsAppUrl = `https://wa.me/${WHATSAPP_PHONE_RAW}?text=${encodeURIComponent(
    `Hello Dani Tech! I was on your About page reading about accessories for ${activeDeviceData.title}. Can you recommend the best option for my setup?`
  )}`;

  const laptopInquiryWhatsAppUrl = `https://wa.me/${WHATSAPP_PHONE_RAW}?text=${encodeURIComponent(
    `Hello Dani Tech! I'm interested in purchasing a laptop / MacBook from you. Can you share your current available stock, specs, and prices?`
  )}`;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 md:p-8 animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-3xl bg-[#161518] border border-[#424656]/40 rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-200">
        
        {/* Top Accent Gradient */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#00dce6] via-[#0066ff] to-[#ffb77d]" />

        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#1e1d21] border-b border-[#424656]/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0066ff]/20 border border-[#0066ff]/40 flex items-center justify-center text-[#00dce6]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-['Geist',sans-serif] text-lg sm:text-xl font-bold text-[#e5e1e4]">
                  About Dani Tech
                </h3>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-[#00dce6]/10 text-[#00dce6] border border-[#00dce6]/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00dce6] animate-pulse" />
                  East Legon, Accra
                </span>
              </div>
              <p className="text-xs text-[#8c90a1] mt-0.5">
                Verified Laptops & Heavy-Duty Hardware • Made for Real Work in Ghana
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#2c2b30] hover:bg-[#3d3c42] text-[#c2c6d8] hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-7 max-h-[80vh] overflow-y-auto space-y-7 text-[#c2c6d8] custom-scrollbar">

          {/* Natural Story & Mission */}
          <div className="rounded-2xl bg-gradient-to-br from-[#201f24] to-[#17161a] p-5 sm:p-6 border border-[#424656]/30">
            <h4 className="font-['Geist',sans-serif] text-lg sm:text-xl font-bold text-[#e5e1e4] leading-snug mb-2">
              Why We Built Dani Tech
            </h4>
            <p className="text-xs sm:text-sm text-[#b0b4c6] leading-relaxed">
              We’ve all been there: You buy a laptop or charger in town or online. Two weeks later, the laptop has hidden motherboard issues, the stand shakes violently every time you type, or the charger gets burning hot and ruins your battery health.
            </p>
            <p className="text-xs sm:text-sm text-[#b0b4c6] leading-relaxed mt-2.5">
              At Dani Tech in <strong className="text-[#e5e1e4]">East Legon, Accra</strong>, we take the risk out of tech buying in Ghana. We supply <span className="text-[#ffb77d] font-semibold">100% verified, battery-tested MacBooks and laptops</span> alongside the <span className="text-[#00dce6] font-medium">rock-solid metal stands</span>, <span className="text-[#b3c5ff] font-medium">protective rubber pads</span>, and <span className="text-[#00dce6] font-medium">safe GaN fast chargers</span> you need to work comfortably every single day.
            </p>

            {/* Quick Guarantees Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4 mt-4 border-t border-[#424656]/30">
              <div className="text-center p-2 rounded-lg bg-[#141316]">
                <div className="text-xs font-bold text-[#e5e1e4]">Clean Laptops</div>
                <div className="text-[10px] text-[#8c90a1]">100% verified batteries</div>
              </div>
              <div className="text-center p-2 rounded-lg bg-[#141316]">
                <div className="text-xs font-bold text-[#00dce6]">Zero Scratches</div>
                <div className="text-[10px] text-[#8c90a1]">Soft rubber padding</div>
              </div>
              <div className="text-center p-2 rounded-lg bg-[#141316]">
                <div className="text-xs font-bold text-[#ffb77d]">2-4 Hr Delivery</div>
                <div className="text-[10px] text-[#8c90a1]">Accra door-to-door</div>
              </div>
              <div className="text-center p-2 rounded-lg bg-[#141316]">
                <div className="text-xs font-bold text-[#b3c5ff]">7-Day Swap</div>
                <div className="text-[10px] text-[#8c90a1]">100% fit or refund</div>
              </div>
            </div>
          </div>

          {/* DEDICATED SALES-DRIVEN LAPTOP PURCHASING SPOTLIGHT */}
          <div className="relative rounded-2xl bg-gradient-to-r from-[#172033] via-[#1a1c29] to-[#201d24] p-5 sm:p-6 border border-[#0066ff]/40 shadow-xl overflow-hidden">
            <div className="absolute top-0 right-0 w-56 h-56 bg-[#0066ff]/15 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-[#0066ff]/20 text-[#00dce6]">
                <Laptop className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono uppercase text-[#00dce6] tracking-wider font-bold">
                Looking to Buy a Laptop?
              </span>
            </div>

            <h5 className="font-['Geist',sans-serif] text-base sm:text-xl font-bold text-[#e5e1e4] mb-2 leading-snug">
              Get Pristine, Verified MacBooks & Pro Machines in Ghana.
            </h5>

            <p className="text-xs sm:text-sm text-[#b8c2d8] leading-relaxed mb-4">
              Buying a laptop in Ghana shouldn't be a gamble. Whether you're a software engineer, creative designer, student, or business executive, every MacBook (Air & Pro M1/M2/M3/M4) and pro laptop at Dani Tech passes our strict 25-point hardware inspection before it reaches your hands:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <div className="p-3 rounded-xl bg-[#111622] border border-[#0066ff]/20">
                <div className="flex items-center gap-2 text-xs font-bold text-[#e5e1e4] mb-1">
                  <CheckCircle2 className="w-4 h-4 text-[#00dce6] shrink-0" />
                  <span>Tested Battery Health</span>
                </div>
                <p className="text-[11px] text-[#8c9cb8] leading-relaxed">
                  Low cycle counts, pristine battery endurance, and original Apple chargers. No swapped parts.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#111622] border border-[#0066ff]/20">
                <div className="flex items-center gap-2 text-xs font-bold text-[#e5e1e4] mb-1">
                  <ShieldCheck className="w-4 h-4 text-[#4ade80] shrink-0" />
                  <span>100% Clean Serial & No Locks</span>
                </div>
                <p className="text-[11px] text-[#8c9cb8] leading-relaxed">
                  Clean serial numbers, zero MDM corporate management, zero iCloud locks. Clean, ready to set up.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#111622] border border-[#0066ff]/20">
                <div className="flex items-center gap-2 text-xs font-bold text-[#e5e1e4] mb-1">
                  <MapPin className="w-4 h-4 text-[#ffb77d] shrink-0" />
                  <span>Inspect Before You Pay</span>
                </div>
                <p className="text-[11px] text-[#8c9cb8] leading-relaxed">
                  Boot it up, test the keyboard and screen at our East Legon Hub or on delivery in Accra before paying.
                </p>
              </div>
            </div>

            {/* Laptop Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1">
              <button
                onClick={handleBrowseLaptops}
                className="py-2.5 px-4 rounded-xl bg-[#0066ff] hover:bg-[#0054d6] text-white text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <span>Browse Available Laptops</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={laptopInquiryWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-4 rounded-xl bg-[#192c22] hover:bg-[#203a2d] text-[#4ade80] border border-[#22c55e]/30 text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Ask for Today's Laptop Deals on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* INTERACTIVE FEATURE 1: Device Setup Guide */}
          <div className="rounded-2xl bg-[#1d1c21] p-5 sm:p-6 border border-[#424656]/40">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <span className="text-[11px] font-mono uppercase text-[#00dce6] tracking-wider font-semibold">
                  Interactive Setup Guide
                </span>
                <h5 className="font-['Geist',sans-serif] text-base sm:text-lg font-bold text-[#e5e1e4]">
                  What device are you using? (Tap to explore)
                </h5>
              </div>
              <span className="text-[11px] text-[#8c90a1] hidden sm:block">
                Tailored recommendations
              </span>
            </div>

            {/* Device Selector Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
              {(
                [
                  { id: 'macbook', label: 'MacBook / Laptop', icon: Laptop },
                  { id: 'iphone', label: 'iPhone', icon: Smartphone },
                  { id: 'ipad', label: 'iPad / Tablet', icon: Tablet },
                  { id: 'desk', label: 'Full Desk', icon: Monitor },
                ] as const
              ).map((tab) => {
                const IconComponent = tab.icon;
                const isSelected = selectedDevice === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedDevice(tab.id)}
                    className={`p-3 rounded-xl flex flex-col items-center gap-1.5 transition-all text-xs font-medium cursor-pointer border ${
                      isSelected
                        ? 'bg-[#0066ff] text-white border-[#0066ff] shadow-md shadow-[#0066ff]/20 scale-[1.02]'
                        : 'bg-[#141316] text-[#c2c6d8] border-[#424656]/30 hover:bg-[#252429] hover:text-white'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Dynamic Card Display */}
            <div className="p-4 rounded-xl bg-[#141316] border border-[#424656]/30 animate-in fade-in duration-200">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-semibold text-[#e5e1e4] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#00dce6]" />
                  {activeDeviceData.title}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#ffb77d]/10 text-[#ffb77d] border border-[#ffb77d]/30 font-medium">
                  {activeDeviceData.badge}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-[#1f1e24] border border-[#424656]/20">
                  <span className="text-[#ff9494] font-semibold block mb-0.5">The Common Headache:</span>
                  <p className="text-[#a6abbd]">{activeDeviceData.painPoint}</p>
                </div>

                <div className="p-2.5 rounded-lg bg-[#14231f] border border-[#22c55e]/25">
                  <span className="text-[#4ade80] font-semibold block mb-0.5">How Dani Tech Fixes It:</span>
                  <p className="text-[#c2dfd1]">{activeDeviceData.solution}</p>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-[#424656]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                <div>
                  <span className="text-[#8c90a1] text-[11px] block">Top Recommendation:</span>
                  <span className="text-[#e5e1e4] font-semibold">{activeDeviceData.recommended}</span>
                </div>
                <button
                  onClick={selectedDevice === 'macbook' ? handleBrowseLaptops : handleExplore}
                  className="px-3 py-1.5 rounded-lg bg-[#0066ff] hover:bg-[#0054d6] text-white text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>{selectedDevice === 'macbook' ? 'Browse Laptops & Gear' : 'See in Catalogue'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* INTERACTIVE FEATURE 2: Street Clones vs. Dani Tech (Interactive Switcher) */}
          <div className="rounded-2xl bg-[#1d1c21] p-5 sm:p-6 border border-[#424656]/40">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <span className="text-[11px] font-mono uppercase text-[#ffb77d] tracking-wider font-semibold">
                  Compare Quality
                </span>
                <h5 className="font-['Geist',sans-serif] text-base sm:text-lg font-bold text-[#e5e1e4]">
                  Dani Tech vs. Cheap Street Clones
                </h5>
              </div>

              {/* Interactive Toggle Pill */}
              <div className="flex p-1 bg-[#141316] rounded-xl border border-[#424656]/40 self-start sm:self-auto">
                <button
                  onClick={() => setCompareChoice('danitech')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    compareChoice === 'danitech'
                      ? 'bg-[#00dce6] text-[#0e0e10] shadow-sm'
                      : 'text-[#8c90a1] hover:text-white'
                  }`}
                >
                  Dani Tech Quality
                </button>
                <button
                  onClick={() => setCompareChoice('clones')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    compareChoice === 'clones'
                      ? 'bg-[#ef4444] text-white shadow-sm'
                      : 'text-[#8c90a1] hover:text-white'
                  }`}
                >
                  Cheap Street Clones
                </button>
              </div>
            </div>

            {/* Dynamic Comparison Cards */}
            {compareChoice === 'danitech' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in duration-200">
                <div className="p-3.5 rounded-xl bg-[#14231f] border border-[#22c55e]/30 flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#22c55e]/20 text-[#4ade80] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <h6 className="text-xs font-bold text-[#e5e1e4]">Verified Laptops & Heavy Metal Stands</h6>
                    <p className="text-[11px] text-[#b8dbca] mt-0.5 leading-relaxed">
                      Laptops with tested battery health, plus solid stands heavy enough to never wobble when you type.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#14231f] border border-[#22c55e]/30 flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#22c55e]/20 text-[#4ade80] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <h6 className="text-xs font-bold text-[#e5e1e4]">Thick Protective Rubber Pads</h6>
                    <p className="text-[11px] text-[#b8dbca] mt-0.5 leading-relaxed">
                      Zero raw metal touches your laptop or phone. Complete protection against scuffs and scratches.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#14231f] border border-[#22c55e]/30 flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#22c55e]/20 text-[#4ade80] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <h6 className="text-xs font-bold text-[#e5e1e4]">Certified Battery-Safe Charging</h6>
                    <p className="text-[11px] text-[#b8dbca] mt-0.5 leading-relaxed">
                      Smart GaN chips regulate power and heat so your MacBook and iPhone battery health stays protected.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#14231f] border border-[#22c55e]/30 flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#22c55e]/20 text-[#4ade80] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <h6 className="text-xs font-bold text-[#e5e1e4]">Inspect Before Paying & Real Warranty</h6>
                    <p className="text-[11px] text-[#b8dbca] mt-0.5 leading-relaxed">
                      Boot up and test on delivery or at our East Legon Hub. If you're not happy, we swap or refund.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in duration-200">
                <div className="p-3.5 rounded-xl bg-[#291717] border border-[#ef4444]/30 flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#ef4444]/20 text-[#f87171] flex items-center justify-center shrink-0 mt-0.5">
                    <X className="w-4 h-4" />
                  </div>
                  <div>
                    <h6 className="text-xs font-bold text-[#fca5a5]">Hidden Faults & Flimsy Plastic</h6>
                    <p className="text-[11px] text-[#e0b4b4] mt-0.5 leading-relaxed">
                      Laptops with swapped degraded batteries, and stands that shake violently with every keystroke.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#291717] border border-[#ef4444]/30 flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#ef4444]/20 text-[#f87171] flex items-center justify-center shrink-0 mt-0.5">
                    <X className="w-4 h-4" />
                  </div>
                  <div>
                    <h6 className="text-xs font-bold text-[#fca5a5]">Raw Metal & Poor Pads</h6>
                    <p className="text-[11px] text-[#e0b4b4] mt-0.5 leading-relaxed">
                      Cheap glue falls off, leaving sharp edges that scratch your expensive laptop finish.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#291717] border border-[#ef4444]/30 flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#ef4444]/20 text-[#f87171] flex items-center justify-center shrink-0 mt-0.5">
                    <X className="w-4 h-4" />
                  </div>
                  <div>
                    <h6 className="text-xs font-bold text-[#fca5a5]">Dangerous Heat Buildup</h6>
                    <p className="text-[11px] text-[#e0b4b4] mt-0.5 leading-relaxed">
                      Unregulated current overheats your device, accelerating battery health degradation.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#291717] border border-[#ef4444]/30 flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#ef4444]/20 text-[#f87171] flex items-center justify-center shrink-0 mt-0.5">
                    <X className="w-4 h-4" />
                  </div>
                  <div>
                    <h6 className="text-xs font-bold text-[#fca5a5]">Zero Warranty ("Sold as is")</h6>
                    <p className="text-[11px] text-[#e0b4b4] mt-0.5 leading-relaxed">
                      Once you pay, the seller won’t pick up your calls if issues develop next week.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* INTERACTIVE FEATURE 3: Ghana Delivery Estimator */}
          <div className="rounded-2xl bg-[#1d1c21] p-5 sm:p-6 border border-[#424656]/40">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <span className="text-[11px] font-mono uppercase text-[#ffb77d] tracking-wider font-semibold">
                  Live Dispatch Check
                </span>
                <h5 className="font-['Geist',sans-serif] text-base sm:text-lg font-bold text-[#e5e1e4]">
                  Where in Ghana are you located? (Tap your area)
                </h5>
              </div>
              <span className="text-[11px] text-[#8c90a1] hidden sm:block">
                Same-day & nationwide
              </span>
            </div>

            {/* Region Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3.5">
              {(
                [
                  { id: 'accra', label: 'Greater Accra' },
                  { id: 'kumasi', label: 'Kumasi' },
                  { id: 'takoradi', label: 'Takoradi / Cape Coast' },
                  { id: 'other', label: 'Other Regions' },
                ] as const
              ).map((reg) => {
                const isSelected = selectedRegion === reg.id;
                return (
                  <button
                    key={reg.id}
                    onClick={() => setSelectedRegion(reg.id)}
                    className={`p-2.5 rounded-xl text-center text-xs font-semibold transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-[#ffb77d] text-[#131315] border-[#ffb77d] shadow-sm font-bold scale-[1.02]'
                        : 'bg-[#141316] text-[#c2c6d8] border-[#424656]/30 hover:bg-[#252429] hover:text-white'
                    }`}
                  >
                    {reg.label}
                  </button>
                );
              })}
            </div>

            {/* Dynamic Delivery Output */}
            <div className="p-4 rounded-xl bg-[#141316] border border-[#424656]/30 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 mb-2">
                <Truck className="w-4 h-4 text-[#ffb77d]" />
                <span className="text-xs font-bold text-[#e5e1e4]">{activeDeliveryData.title}</span>
                <span className="text-[11px] text-[#8c90a1]">({activeDeliveryData.sub})</span>
              </div>

              <div className="space-y-1.5 text-xs text-[#c2c6d8] pl-6 border-l-2 border-[#ffb77d]/40">
                <div className="font-semibold text-[#ffb77d]">{activeDeliveryData.time}</div>
                <div className="text-[11px] text-[#a6abbd]">🚚 {activeDeliveryData.courier}</div>
                <div className="text-[11px] text-[#a6abbd]">💳 {activeDeliveryData.payment}</div>
              </div>
            </div>
          </div>

          {/* INTERACTIVE FEATURE 4: FAQ Accordion */}
          <div className="rounded-2xl bg-[#1d1c21] p-5 sm:p-6 border border-[#424656]/40">
            <div className="flex items-center gap-2 mb-4">
              <HelpCircle className="w-5 h-5 text-[#00dce6]" />
              <div>
                <h5 className="font-['Geist',sans-serif] text-base sm:text-lg font-bold text-[#e5e1e4]">
                  Frequently Asked Questions
                </h5>
                <p className="text-[11px] text-[#8c90a1]">Straightforward, honest answers to common questions</p>
              </div>
            </div>

            <div className="space-y-2.5">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div
                    key={index}
                    className="rounded-xl bg-[#141316] border border-[#424656]/30 overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="w-full p-3.5 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold text-[#e5e1e4] hover:text-[#00dce6] transition-colors cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-[#00dce6] shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#8c90a1] shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-3.5 pb-3.5 text-xs text-[#a6abbd] leading-relaxed border-t border-[#424656]/20 pt-2 animate-in fade-in duration-150">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* East Legon Physical Hub Details */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#201f24] border border-[#424656]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#ffb77d] shrink-0 mt-0.5" />
              <div>
                <h6 className="text-xs sm:text-sm font-bold text-[#e5e1e4]">
                  Visit the Dani Tech Hub in East Legon, Accra
                </h6>
                <p className="text-xs text-[#a6abbd] mt-0.5">
                  Looking to buy a MacBook, test a laptop stand, or try different accessories? Walk in anytime or arrange direct pickup.
                </p>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleExplore}
              className="flex-1 py-3.5 px-5 rounded-xl bg-[#0066ff] hover:bg-[#0054d6] text-white text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#0066ff]/25 cursor-pointer hover:scale-[1.01]"
            >
              <span>Explore Entire Catalogue</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href={laptopInquiryWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3.5 px-5 rounded-xl bg-[#1f2e26] hover:bg-[#263c30] text-[#4ade80] border border-[#22c55e]/40 text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Inquire Laptop Deals on WhatsApp</span>
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};
