import React, { useState } from 'react';
import { X, Search, CheckCircle, Package, Clock, HelpCircle, PhoneCall } from 'lucide-react';
import { WHATSAPP_PHONE_RAW } from '../utils/format';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  recentOrderId?: string;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  recentOrderId,
}) => {
  const [trackQuery, setTrackQuery] = useState(recentOrderId || '');
  const [trackResult, setTrackResult] = useState<null | {
    id: string;
    status: string;
    courier: string;
    destination: string;
    eta: string;
  }>(null);

  if (!isOpen) return null;

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackQuery) return;
    setTrackResult({
      id: trackQuery.toUpperCase(),
      status: 'Dispatched from Dani Tech East Legon Hub',
      courier: 'Express Courier (Accra Delivery Fleet)',
      destination: 'Client Address / Ghana Post GPS',
      eta: 'Arriving in approx. 45-60 mins',
    });
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
    >
      <div className="relative w-full max-w-lg bg-[#1c1b1d] border border-[#424656]/40 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-5 bg-[#201f21] border-b border-[#424656]/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00dce6]"></span>
            <h3 className="font-['Geist',sans-serif] text-lg font-medium text-[#e5e1e4]">
              Client Support & Order Tracking
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#2a2a2c] hover:bg-[#353437] text-[#c2c6d8] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Track an order form */}
          <div>
            <label className="block text-xs font-mono text-[#c2c6d8] uppercase tracking-wider mb-2">
              Track Dispatch Status
            </label>
            <form onSubmit={handleTrack} className="flex gap-2">
              <input
                type="text"
                placeholder="Enter Dani Tech Order # (e.g. DANI-384920)"
                value={trackQuery}
                onChange={(e) => setTrackQuery(e.target.value)}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#131315] border border-[#424656]/40 text-[#e5e1e4] text-xs font-mono focus:outline-none focus:border-[#0066ff]"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-[#0066ff] hover:bg-[#0054d6] text-white text-xs font-medium transition-colors cursor-pointer"
              >
                Track
              </button>
            </form>
          </div>

          {trackResult && (
            <div className="p-4 bg-[#201f21] rounded-xl border border-[#424656]/30 space-y-2 text-xs">
              <div className="flex items-center justify-between text-[#00dce6] font-mono">
                <span className="flex items-center gap-1.5">
                  <Package className="w-4 h-4" />
                  <strong>{trackResult.id}</strong>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#007e85]/20 text-[#00dce6]">
                  In Transit
                </span>
              </div>
              <p className="text-[#e5e1e4] font-medium">{trackResult.status}</p>
              <div className="text-[#c2c6d8] space-y-1 text-[11px]">
                <div>Courier: {trackResult.courier}</div>
                <div>ETA: <strong className="text-[#ffb77d]">{trackResult.eta}</strong></div>
              </div>
            </div>
          )}

          {/* Quick Payment & Support Guide */}
          <div className="space-y-3 pt-2 border-t border-[#424656]/20">
            <h4 className="text-xs font-mono uppercase text-[#8c90a1] tracking-wider">
              Ghana Payment Rails
            </h4>

            <div className="p-3 bg-[#131315] rounded-xl border border-[#424656]/20 space-y-1 text-xs">
              <div className="flex justify-between font-medium text-[#e5e1e4]">
                <span>MTN Mobile Money</span>
                <span className="text-[#ffb77d] font-mono">*170#</span>
              </div>
              <p className="text-[11px] text-[#c2c6d8]">
                Instant USSD push authorization or Merchant ID transfer with 0% processing fee.
              </p>
            </div>

            <div className="p-3 bg-[#131315] rounded-xl border border-[#424656]/20 space-y-1 text-xs">
              <div className="flex justify-between font-medium text-[#e5e1e4]">
                <span>Telecel Cash</span>
                <span className="text-[#ffb77d] font-mono">*110#</span>
              </div>
              <p className="text-[11px] text-[#c2c6d8]">
                Generate a voucher code or approve instant push prompt on Telecel handsets.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <a
              href={`https://wa.me/${WHATSAPP_PHONE_RAW}?text=Hello%20Dani%20Tech%20Support,%20I%20need%20assistance%20with%20my%20order`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-xl bg-[#201f21] hover:bg-[#2a2a2c] text-[#00dce6] text-xs font-medium transition-colors flex items-center justify-center gap-2 border border-[#424656]/30 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Contact East Legon Support Desk</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
