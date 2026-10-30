import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  X,
  Smartphone,
  Loader2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export interface CheckoutItem {
  id: string;
  type: 'subscription' | 'masterclass';
  title: string;
  subtitle: string;
  price: string;
  period?: string;
}

interface PaymentCheckoutModalProps {
  item: CheckoutItem;
  onClose: () => void;
  onPaymentSuccess: (item: CheckoutItem) => void;
  isMobileMode?: boolean;
}

export const PaymentCheckoutModal: React.FC<PaymentCheckoutModalProps> = ({
  item,
  onClose,
  onPaymentSuccess,
  isMobileMode = false,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'apple' | 'google' | 'card' | 'click' | 'payme'>('apple');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Card form state
  const [cardName, setCardName] = useState('Alex Vance');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 9842');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvc, setCardCvc] = useState('884');

  const handleProcessPayment = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.5 },
          colors: ['#A3E635', '#22C55E', '#38BDF8', '#F59E0B'],
        });
      } catch (e) {
        // Confetti fallback safe
      }
    }, 1200);
  };

  const handleFinish = () => {
    onPaymentSuccess(item);
    onClose();
  };

  return (
    <div className={`${isMobileMode ? 'absolute inset-0' : 'fixed inset-0'} z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/90 backdrop-blur-md overflow-hidden`}>
      <div className="bg-[#10161D] border border-[#212C3B] rounded-2xl w-full max-w-[345px] sm:max-w-md max-h-[92%] flex flex-col p-3.5 sm:p-5 text-slate-100 shadow-2xl relative overflow-hidden">
        {!isSuccess && (
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 p-1.5 text-slate-400 hover:text-white rounded-lg bg-[#16202B] z-10"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {!isSuccess ? (
          <div className="flex-1 overflow-y-auto pr-1 space-y-3.5">
            {/* Checkout Header */}
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-lime-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>256-Bit Encrypted Gateway</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white mt-0.5">Complete Your Order</h2>
            </div>

            {/* Order Summary Box */}
            <div className="bg-[#141C25] border border-[#212E3E] rounded-xl p-3 flex items-center justify-between">
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-lime-400">
                  {item.type === 'subscription' ? 'Tier Upgrade' : 'Coach Masterclass'}
                </span>
                <p className="text-xs sm:text-sm font-bold text-white mt-0.5">{item.title}</p>
                <p className="text-[10px] text-slate-400 truncate max-w-[200px]">{item.subtitle}</p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-lg sm:text-xl font-black text-white font-mono">{item.price}</span>
                {item.period && <p className="text-[9px] text-slate-400">{item.period}</p>}
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold text-slate-300">Select Payment Method</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'apple', label: 'Apple Pay', desc: 'Touch ID' },
                  { id: 'google', label: 'Google Pay', desc: 'Android Wallet' },
                  { id: 'card', label: 'Credit Card', desc: 'Visa / MC' },
                  { id: 'click', label: 'Click Pay', desc: 'Direct' },
                  { id: 'payme', label: 'Payme', desc: 'Instant Portal' },
                ].map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setSelectedMethod(method.id as any)}
                    className={`p-2 rounded-xl border text-left transition-all ${
                      selectedMethod === method.id
                        ? 'border-lime-400 bg-lime-500/10 text-white'
                        : 'border-[#222E3E] bg-[#141B24] text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    <p className="text-xs font-bold text-slate-200">{method.label}</p>
                    <p className="text-[9px] text-slate-400">{method.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Method Details Form */}
            {selectedMethod === 'card' && (
              <div className="space-y-2.5 bg-[#131B24] p-3 rounded-xl border border-[#202C3B]">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">Cardholder Name</label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full bg-[#16202B] border border-[#263547] rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full bg-[#16202B] border border-[#263547] rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">Expires (MM/YY)</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full bg-[#16202B] border border-[#263547] rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">CVV</label>
                    <input
                      type="password"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="w-full bg-[#16202B] border border-[#263547] rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {(selectedMethod === 'apple' || selectedMethod === 'google') && (
              <div className="p-3 rounded-xl bg-[#131B24] border border-[#202C3B] text-center space-y-1.5">
                <div className="w-8 h-8 rounded-full bg-slate-800 text-lime-400 flex items-center justify-center mx-auto">
                  <Smartphone className="w-4 h-4" />
                </div>
                <p className="text-xs font-bold text-white">
                  Biometric Authentication Ready
                </p>
                <p className="text-[10px] text-slate-400 max-w-xs mx-auto">
                  Confirm payment with Touch ID, Face ID, or Passcode.
                </p>
              </div>
            )}

            {(selectedMethod === 'click' || selectedMethod === 'payme') && (
              <div className="p-3 rounded-xl bg-[#131B24] border border-[#202C3B] text-center space-y-1">
                <p className="text-xs font-bold text-white">
                  {selectedMethod === 'click' ? 'Click' : 'Payme'} Direct Portal Simulation
                </p>
                <p className="text-[10px] text-slate-400">
                  Ready for instant one-click merchant checkout verification.
                </p>
              </div>
            )}

            {/* Total Strip & Pay Button */}
            <div className="pt-2 border-t border-[#1C2532] flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] text-slate-400">Total:</span>
                <p className="text-lg font-black text-lime-400 font-mono">{item.price}</p>
              </div>

              <button
                onClick={handleProcessPayment}
                disabled={isProcessing}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-lime-400 hover:bg-lime-300 disabled:opacity-50 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-lime-500/20 transition-all active:scale-[0.98]"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="w-3 h-3" />
                    Pay {item.price} Now
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Payment Success Confirmation */
          <div className="text-center py-4 space-y-3.5 flex-1 flex flex-col justify-center">
            <div className="w-12 h-12 rounded-full bg-lime-500/20 text-lime-400 border border-lime-500/40 flex items-center justify-center mx-auto shadow-lg shadow-lime-500/20">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <span className="text-[10px] font-bold text-lime-400 uppercase tracking-wider">
                Transaction Approved
              </span>
              <h2 className="text-xl font-black text-white mt-0.5">Access Unlocked!</h2>
              <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto">
                Payment for <span className="font-bold text-white">{item.title}</span> was successful.
              </p>
            </div>

            <div className="bg-[#141C25] border border-[#212E3E] rounded-xl p-2.5 text-xs text-slate-400 font-mono space-y-1 max-w-sm mx-auto text-left w-full">
              <div className="flex justify-between text-[11px]">
                <span>Ref:</span>
                <span className="text-slate-200">KTX_{Date.now().toString().slice(-8)}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span>Method:</span>
                <span className="text-slate-200 capitalize">{selectedMethod} Gateway</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span>Paid:</span>
                <span className="text-lime-400 font-bold">{item.price}</span>
              </div>
            </div>

            <button
              onClick={handleFinish}
              className="w-full py-2.5 bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-lime-500/20 transition-colors"
            >
              Continue to Experience
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
