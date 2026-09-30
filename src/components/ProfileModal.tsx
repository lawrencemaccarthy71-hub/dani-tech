import React, { useState, useEffect } from 'react';
import { X, Package, PhoneCall, AlertCircle } from 'lucide-react';
import { WHATSAPP_PHONE_RAW, formatPrice } from '../utils/format';
import { searchOrder } from '../lib/ordersDb';
import { OrderRecord, OrderStatus } from '../types';

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
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [order, setOrder] = useState<OrderRecord | null>(null);

  useEffect(() => {
    if (isOpen && recentOrderId) {
      setTrackQuery(recentOrderId);
      handleSearch(recentOrderId);
    }
  }, [isOpen, recentOrderId]);

  if (!isOpen) return null;

  const handleSearch = async (term: string) => {
    if (!term.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const found = await searchOrder(term);
      setOrder(found);
    } catch (e) {
      console.error('Order tracking search error:', e);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(trackQuery);
  };

  const getStatusBadge = (status?: OrderStatus) => {
    switch (status) {
      case 'delivered':
        return { label: 'Delivered', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-300 dark:border-emerald-500/30' };
      case 'dispatched':
        return { label: 'In Transit', color: 'bg-cyan-100 text-cyan-800 dark:bg-[#007e85]/20 dark:text-[#00dce6] border-cyan-300 dark:border-[#007e85]/30' };
      case 'processing':
        return { label: 'Processing', color: 'bg-blue-100 text-blue-700 dark:bg-[#0066ff]/20 dark:text-[#60a5fa] border-blue-300 dark:border-[#0066ff]/30' };
      case 'cancelled':
        return { label: 'Cancelled', color: 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400 border-rose-300 dark:border-rose-500/30' };
      default:
        return { label: 'Pending Verification', color: 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-400 border-amber-300 dark:border-amber-500/30' };
    }
  };

  const getStatusDescription = (status?: OrderStatus) => {
    switch (status) {
      case 'delivered':
        return 'Package handed over and completed.';
      case 'dispatched':
        return 'En route with dispatch rider / regional courier.';
      case 'processing':
        return 'Inspected and packaged at Dani Tech Madina Hub, Accra.';
      case 'cancelled':
        return 'This order has been cancelled.';
      default:
        return 'Order received. Awaiting express dispatch assignment.';
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 dark:bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
    >
      <div className="relative w-full max-w-lg bg-white dark:bg-[#1c1b1d] border border-black/10 dark:border-[#424656]/40 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 transition-colors">
        <div className="p-5 bg-[#f5f5f7] dark:bg-[#201f21] border-b border-black/8 dark:border-[#424656]/30 flex items-center justify-between transition-colors">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00838f] dark:bg-[#00dce6]"></span>
            <h3 className="font-['Geist',sans-serif] text-lg font-medium text-[#161618] dark:text-[#e5e1e4]">
              Client Support & Order Tracking
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 dark:bg-[#2a2a2c] dark:hover:bg-[#353437] text-[#555558] hover:text-[#161618] dark:text-[#c2c6d8] dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Track an order form */}
          <div>
            <label className="block text-xs font-mono text-[#555558] dark:text-[#c2c6d8] uppercase tracking-wider mb-2">
              Live Dispatch Tracking
            </label>
            <form onSubmit={handleTrackSubmit} className="flex gap-2">
              <input
                type="text"
                placeholder="Enter Order # (e.g. DANI-...) or Phone Number"
                value={trackQuery}
                onChange={(e) => setTrackQuery(e.target.value)}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#131315] border border-black/10 dark:border-[#424656]/40 text-[#161618] dark:text-[#e5e1e4] text-xs font-mono focus:outline-none focus:border-[#0066ff] transition-colors"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2.5 rounded-xl bg-[#0066ff] hover:bg-[#0054d6] text-white text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Searching...' : 'Track'}
              </button>
            </form>
          </div>

          {/* Found Order Card */}
          {order && (
            <div className="p-4 bg-[#f5f5f7] dark:bg-[#201f21] rounded-xl border border-black/8 dark:border-[#424656]/30 space-y-3 text-xs transition-colors">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[#00838f] dark:text-[#00dce6] font-mono font-bold">
                  <Package className="w-4 h-4" />
                  <span>{order.id}</span>
                </span>
                <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-mono border ${getStatusBadge(order.status).color}`}>
                  {getStatusBadge(order.status).label}
                </span>
              </div>

              <p className="text-[#161618] dark:text-[#e5e1e4] font-medium">
                {getStatusDescription(order.status)}
              </p>

              <div className="text-[#555558] dark:text-[#c2c6d8] space-y-1.5 text-[11px] pt-2 border-t border-black/8 dark:border-[#424656]/20">
                <div className="flex justify-between">
                  <span className="text-[#6e6e73] dark:text-[#8c90a1]">Recipient:</span>
                  <span className="text-[#161618] dark:text-[#e5e1e4] font-medium">{order.name} ({order.phone})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6e6e73] dark:text-[#8c90a1]">Destination:</span>
                  <span className="text-[#161618] dark:text-[#e5e1e4] text-right truncate max-w-[200px]">{order.address}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6e6e73] dark:text-[#8c90a1]">Delivery Option:</span>
                  <span className="text-[#00838f] dark:text-[#00dce6]">{order.delivery.name.split('(')[0]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6e6e73] dark:text-[#8c90a1]">Est. Delivery:</span>
                  <span className="text-[#c26d2b] dark:text-[#ffb77d] font-mono font-bold">{order.delivery.estimatedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6e6e73] dark:text-[#8c90a1]">Total Amount:</span>
                  <span className="text-[#c26d2b] dark:text-[#ffb77d] font-mono font-bold">{formatPrice(order.totalGhs, 'GHS')}</span>
                </div>
              </div>

              {/* Items summary */}
              <div className="pt-2 border-t border-black/8 dark:border-[#424656]/20">
                <p className="text-[10px] font-mono text-[#6e6e73] dark:text-[#8c90a1] uppercase mb-1.5">Items in Package</p>
                <div className="space-y-1">
                  {order.items.map((item) => (
                    <div key={item.product.id} className="flex justify-between text-[11px] text-[#555558] dark:text-[#c2c6d8]">
                      <span className="truncate max-w-[220px]">{item.product.name} ×{item.quantity}</span>
                      <span className="font-mono text-[#c26d2b] dark:text-[#ffb77d]">{formatPrice(item.product.priceGhs * item.quantity, 'GHS')}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* WhatsApp direct help for this order */}
              <div className="pt-2">
                <a
                  href={`https://wa.me/${WHATSAPP_PHONE_RAW}?text=Hello%20Dani%20Tech,%20following%20up%20on%20my%20order%20*${order.id}*%20for%20${encodeURIComponent(order.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-[#1f2e26] dark:hover:bg-[#263c30] dark:text-[#4ade80] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Chat Dispatch Rider on WhatsApp</span>
                </a>
              </div>
            </div>
          )}

          {/* Searched but not found */}
          {searched && !order && !loading && (
            <div className="p-4 bg-amber-50 dark:bg-[#201f21]/60 rounded-xl border border-amber-200 dark:border-[#424656]/20 text-center space-y-1.5 text-xs">
              <AlertCircle className="w-5 h-5 text-amber-500 mx-auto" />
              <p className="text-[#161618] dark:text-[#e5e1e4] font-medium">No order found matching "{trackQuery}"</p>
              <p className="text-[#6e6e73] dark:text-[#8c90a1] text-[11px]">
                Please verify the Order ID or phone number used during checkout.
              </p>
            </div>
          )}

          {/* Quick Payment & Support Guide */}
          <div className="space-y-3 pt-2 border-t border-black/8 dark:border-[#424656]/20">
            <h4 className="text-xs font-mono uppercase text-[#6e6e73] dark:text-[#8c90a1] tracking-wider">
              Ghana Payment Rails
            </h4>

            <div className="p-3 bg-[#f5f5f7] dark:bg-[#131315] rounded-xl border border-black/8 dark:border-[#424656]/20 space-y-1 text-xs transition-colors">
              <div className="flex justify-between font-medium text-[#161618] dark:text-[#e5e1e4]">
                <span>MTN Mobile Money</span>
                <span className="text-[#c26d2b] dark:text-[#ffb77d] font-mono">*170#</span>
              </div>
              <p className="text-[11px] text-[#555558] dark:text-[#c2c6d8]">
                Instant USSD push authorization or Merchant ID transfer with 0% processing fee.
              </p>
            </div>

            <div className="p-3 bg-[#f5f5f7] dark:bg-[#131315] rounded-xl border border-black/8 dark:border-[#424656]/20 space-y-1 text-xs transition-colors">
              <div className="flex justify-between font-medium text-[#161618] dark:text-[#e5e1e4]">
                <span>Telecel Cash</span>
                <span className="text-[#c26d2b] dark:text-[#ffb77d] font-mono">*110#</span>
              </div>
              <p className="text-[11px] text-[#555558] dark:text-[#c2c6d8]">
                Generate a voucher code or approve instant push prompt on Telecel handsets.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <a
              href={`https://wa.me/${WHATSAPP_PHONE_RAW}?text=Hello%20Dani%20Tech%20Support,%20I%20need%20assistance%20with%20my%20order`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-xl bg-black/5 hover:bg-black/10 text-[#00838f] dark:bg-[#201f21] dark:hover:bg-[#2a2a2c] dark:text-[#00dce6] text-xs font-medium transition-colors flex items-center justify-center gap-2 border border-black/8 dark:border-[#424656]/30 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Contact Madina Support Desk</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
