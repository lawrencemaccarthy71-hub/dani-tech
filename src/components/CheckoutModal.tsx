import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck, Phone, CreditCard, ArrowLeft, Loader2 } from 'lucide-react';
import { CartItem, Currency, DeliveryOption, MoMoNetwork } from '../types';
import { formatPrice, WHATSAPP_PHONE_RAW } from '../utils/format';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currency: Currency;
  deliveryOption: DeliveryOption;
  onOrderSuccess: (
    orderId: string,
    orderDetails?: {
      name: string;
      phone: string;
      address: string;
      totalGhs: number;
      items: CartItem[];
      delivery: DeliveryOption;
    }
  ) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  currency,
  deliveryOption,
  onOrderSuccess,
}) => {
  const [step, setStep] = useState<'details' | 'payment' | 'processing' | 'confirmed'>('details');
  const [momoNetwork, setMomoNetwork] = useState<MoMoNetwork>('MTN');
  const [paymentMethod, setPaymentMethod] = useState<'momo' | 'card'>('momo');

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [ghanaPostGps, setGhanaPostGps] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [orderNumber, setOrderNumber] = useState('');

  if (!isOpen) return null;

  const subtotalGhs = items.reduce(
    (sum, item) => sum + item.product.priceGhs * item.quantity,
    0
  );
  const totalGhs = subtotalGhs + deliveryOption.priceGhs;

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    setStep('payment');
  };

  const handleAuthorizePayment = () => {
    setStep('processing');
    const newOrderId = `DANI-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderNumber(newOrderId);

    const fullAddress = `${deliveryAddress}${ghanaPostGps ? ` (${ghanaPostGps})` : ''}`;

    // Simulate MoMo prompt push on phone network
    setTimeout(() => {
      setStep('confirmed');
      onOrderSuccess(newOrderId, {
        name,
        phone,
        address: fullAddress,
        totalGhs,
        items,
        delivery: deliveryOption,
      });
    }, 2800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 dark:bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#1c1b1d] border border-black/10 dark:border-[#424656]/40 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 transition-colors">
        {/* Header */}
        <div className="p-5 bg-[#f5f5f7] dark:bg-[#201f21] border-b border-black/8 dark:border-[#424656]/30 flex items-center justify-between transition-colors">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00838f] dark:bg-[#00dce6]"></span>
            <h3 className="font-['Geist',sans-serif] text-lg font-medium text-[#161618] dark:text-[#e5e1e4]">
              {step === 'confirmed' ? 'Order Confirmed' : 'Checkout & Express Delivery'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 dark:bg-[#2a2a2c] dark:hover:bg-[#353437] text-[#555558] hover:text-[#161618] dark:text-[#c2c6d8] dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* STEP 1: Delivery & Contact Details */}
          {step === 'details' && (
            <form onSubmit={handleProceedToPayment} className="space-y-4">
              <div className="bg-[#f5f5f7] dark:bg-[#201f21] p-3 rounded-xl border border-black/8 dark:border-[#424656]/20 flex justify-between items-center text-xs transition-colors">
                <span className="text-[#555558] dark:text-[#c2c6d8]">Order Total ({items.length} items):</span>
                <span className="font-mono font-bold text-[#c26d2b] dark:text-[#ffb77d] text-sm">
                  {formatPrice(totalGhs, currency)}
                </span>
              </div>

              <div>
                <label className="block text-xs font-mono text-[#555558] dark:text-[#c2c6d8] uppercase tracking-wider mb-1.5">
                  Full Name / Recipient *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kwame Mensah"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#131315] border border-black/10 dark:border-[#424656]/40 text-[#161618] dark:text-[#e5e1e4] text-sm focus:outline-none focus:border-[#0066ff] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#555558] dark:text-[#c2c6d8] uppercase tracking-wider mb-1.5">
                  WhatsApp / Phone Number (for delivery courier) *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 024 123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white dark:bg-[#131315] border border-black/10 dark:border-[#424656]/40 text-[#161618] dark:text-[#e5e1e4] text-sm focus:outline-none focus:border-[#0066ff] transition-colors"
                  />
                  <Phone className="w-4 h-4 text-[#8c90a1] absolute left-3.5 top-3" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-[#555558] dark:text-[#c2c6d8] uppercase tracking-wider mb-1.5">
                    Ghana Post GPS (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. GA-183-9021"
                    value={ghanaPostGps}
                    onChange={(e) => setGhanaPostGps(e.target.value.toUpperCase())}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#131315] border border-black/10 dark:border-[#424656]/40 text-[#161618] dark:text-[#e5e1e4] text-sm font-mono focus:outline-none focus:border-[#0066ff] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#555558] dark:text-[#c2c6d8] uppercase tracking-wider mb-1.5">
                    Area / Landmark *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Madina / East Legon"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#131315] border border-black/10 dark:border-[#424656]/40 text-[#161618] dark:text-[#e5e1e4] text-sm focus:outline-none focus:border-[#0066ff] transition-colors"
                  />
                </div>
              </div>

              <div className="p-3 bg-[#f5f5f7] dark:bg-[#131315] rounded-xl border border-black/8 dark:border-[#424656]/20 text-[11px] text-[#555558] dark:text-[#c2c6d8] flex items-center gap-2 transition-colors">
                <ShieldCheck className="w-4 h-4 text-[#00838f] dark:text-[#00dce6] shrink-0" />
                <span>
                  Delivery: <strong className="text-[#161618] dark:text-[#e5e1e4]">{deliveryOption.name}</strong> ({deliveryOption.estimatedTime})
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#0066ff] hover:bg-[#0054d6] text-white text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <span>Continue to Payment</span>
              </button>
            </form>
          )}

          {/* STEP 2: Payment Rail Selection */}
          {step === 'payment' && (
            <div className="space-y-4">
              <button
                onClick={() => setStep('details')}
                className="flex items-center gap-1.5 text-xs text-[#555558] hover:text-[#161618] dark:text-[#c2c6d8] dark:hover:text-white transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Delivery Details</span>
              </button>

              <div className="space-y-2">
                <label className="text-xs font-mono text-[#555558] dark:text-[#c2c6d8] uppercase tracking-wider block">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('momo')}
                    className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      paymentMethod === 'momo'
                        ? 'bg-[#f5f5f7] dark:bg-[#201f21] border-[#c26d2b] dark:border-[#ffb77d] shadow-md ring-1 ring-[#c26d2b]/30'
                        : 'bg-white dark:bg-[#131315] border-black/8 dark:border-[#424656]/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[#161618] dark:text-[#e5e1e4]">Mobile Money</span>
                      <span className="w-2 h-2 rounded-full bg-[#c26d2b] dark:bg-[#ffb77d]"></span>
                    </div>
                    <span className="text-[11px] text-[#555558] dark:text-[#c2c6d8]">MTN, Telecel, AT</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'bg-[#f5f5f7] dark:bg-[#201f21] border-[#0066ff] shadow-md ring-1 ring-[#0066ff]/30'
                        : 'bg-white dark:bg-[#131315] border-black/8 dark:border-[#424656]/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[#161618] dark:text-[#e5e1e4]">Debit / Card</span>
                      <CreditCard className="w-3.5 h-3.5 text-[#0066ff] dark:text-[#b3c5ff]" />
                    </div>
                    <span className="text-[11px] text-[#555558] dark:text-[#c2c6d8]">Visa & Mastercard</span>
                  </button>
                </div>
              </div>

              {paymentMethod === 'momo' ? (
                <div className="p-4 bg-[#f5f5f7] dark:bg-[#131315] rounded-xl border border-black/8 dark:border-[#424656]/30 space-y-3 transition-colors">
                  <label className="text-xs font-mono text-[#555558] dark:text-[#c2c6d8] uppercase tracking-wider block">
                    Choose Mobile Rail
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['MTN', 'TELECEL', 'AT'] as MoMoNetwork[]).map((net) => (
                      <button
                        key={net}
                        type="button"
                        onClick={() => setMomoNetwork(net)}
                        className={`py-2 px-3 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                          momoNetwork === net
                            ? 'bg-[#c26d2b] dark:bg-[#ffb77d] text-white dark:text-[#131315] shadow-sm'
                            : 'bg-white dark:bg-[#2a2a2c] text-[#555558] dark:text-[#c2c6d8] hover:text-[#161618] dark:hover:text-white border border-black/8 dark:border-transparent'
                        }`}
                      >
                        {net}
                      </button>
                    ))}
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-[#6e6e73] dark:text-[#8c90a1] uppercase mb-1">
                      Registered MoMo Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white dark:bg-[#201f21] border border-black/10 dark:border-[#424656]/40 text-[#161618] dark:text-[#e5e1e4] text-xs font-mono"
                    />
                    <p className="text-[10px] text-[#6e6e73] dark:text-[#8c90a1] mt-1">
                      A prompt will be pushed to this handset to authorize payment of{' '}
                      <strong className="text-[#161618] dark:text-white">{formatPrice(totalGhs, currency)}</strong>.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-[#f5f5f7] dark:bg-[#131315] rounded-xl border border-black/8 dark:border-[#424656]/30 space-y-3 transition-colors">
                  <div className="text-xs text-[#555558] dark:text-[#c2c6d8]">
                    Secure card checkout powered by local Ghanaian payment gateways with 3D Secure verification.
                  </div>
                  <input
                    type="text"
                    placeholder="Card Number (4000 1234 5678 9010)"
                    defaultValue="4242 •••• •••• 4242"
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-[#201f21] border border-black/10 dark:border-[#424656]/40 text-[#161618] dark:text-[#e5e1e4] text-xs font-mono"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      defaultValue="08/28"
                      className="w-full px-3 py-2 rounded-lg bg-white dark:bg-[#201f21] border border-black/10 dark:border-[#424656]/40 text-[#161618] dark:text-[#e5e1e4] text-xs font-mono"
                    />
                    <input
                      type="password"
                      placeholder="CVC"
                      defaultValue="789"
                      className="w-full px-3 py-2 rounded-lg bg-white dark:bg-[#201f21] border border-black/10 dark:border-[#424656]/40 text-[#161618] dark:text-[#e5e1e4] text-xs font-mono"
                    />
                  </div>
                </div>
              )}

              <button
                onClick={handleAuthorizePayment}
                className="w-full py-3.5 rounded-xl bg-[#0066ff] hover:bg-[#0054d6] text-white text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <span>Authorize {formatPrice(totalGhs, currency)}</span>
              </button>
            </div>
          )}

          {/* STEP 3: Processing Simulation */}
          {step === 'processing' && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <Loader2 className="w-10 h-10 text-[#c26d2b] dark:text-[#ffb77d] animate-spin" />
              <div>
                <h4 className="font-['Geist',sans-serif] text-base font-semibold text-[#161618] dark:text-[#e5e1e4]">
                  {paymentMethod === 'momo'
                    ? `Pushing ${momoNetwork} MoMo USSD Prompt...`
                    : 'Contacting Card Issuer...'}
                </h4>
                <p className="text-xs text-[#555558] dark:text-[#c2c6d8] mt-1 max-w-xs">
                  Please approve the transaction prompt on {phone || 'your phone'} to complete payment.
                </p>
              </div>
            </div>
          )}

          {/* STEP 4: Order Confirmed Receipt */}
          {step === 'confirmed' && (
            <div className="space-y-4 text-center">
              <div className="w-14 h-14 rounded-full bg-[#00838f]/10 dark:bg-[#007e85]/20 text-[#00838f] dark:text-[#00dce6] flex items-center justify-center mx-auto border border-[#00838f]/30 dark:border-[#00dce6]/40 shadow-sm">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[11px] font-mono text-[#c26d2b] dark:text-[#ffb77d] uppercase tracking-widest font-semibold">
                  Order Successfully Placed
                </span>
                <h4 className="font-['Geist',sans-serif] text-xl font-bold text-[#161618] dark:text-[#e5e1e4] mt-1">
                  {orderNumber}
                </h4>
                <p className="text-xs text-[#555558] dark:text-[#c2c6d8] mt-1">
                  Thank you, <strong className="text-[#161618] dark:text-white">{name}</strong>! Your hardware has been queued for dispatch at Dani Tech Hub, Madina, Accra.
                </p>
              </div>

              <div className="p-4 bg-[#f5f5f7] dark:bg-[#201f21] rounded-xl border border-black/8 dark:border-[#424656]/30 text-left text-xs space-y-2 transition-colors">
                <div className="flex justify-between">
                  <span className="text-[#6e6e73] dark:text-[#8c90a1]">Recipient:</span>
                  <span className="text-[#161618] dark:text-[#e5e1e4] font-medium">{name} ({phone})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6e6e73] dark:text-[#8c90a1]">Delivery Zone:</span>
                  <span className="text-[#161618] dark:text-[#e5e1e4] font-medium">{deliveryOption.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6e6e73] dark:text-[#8c90a1]">Destination:</span>
                  <span className="text-[#161618] dark:text-[#e5e1e4] font-medium">
                    {deliveryAddress} {ghanaPostGps ? `(${ghanaPostGps})` : ''}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-black/8 dark:border-[#424656]/30">
                  <span className="text-[#6e6e73] dark:text-[#8c90a1]">Total Paid:</span>
                  <span className="font-mono font-bold text-[#c26d2b] dark:text-[#ffb77d]">
                    {formatPrice(totalGhs, currency)}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <a
                  href={`https://wa.me/${WHATSAPP_PHONE_RAW}?text=Hello%20Dani%20Tech,%20I%20just%20completed%20order%20${orderNumber}%20(${name})%20for%20delivery%20to%20${deliveryAddress}.%20Please%20confirm%20tracking.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl bg-[#00838f] hover:bg-[#006b74] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>Notify Dani Tech Team on WhatsApp</span>
                </a>

                <button
                  onClick={onClose}
                  className="w-full py-2.5 rounded-xl bg-black/5 hover:bg-black/10 dark:bg-[#2a2a2c] dark:hover:bg-[#353437] text-xs text-[#161618] dark:text-[#e5e1e4] transition-colors cursor-pointer"
                >
                  Return to Store
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
