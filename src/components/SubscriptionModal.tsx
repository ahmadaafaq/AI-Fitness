import React, { useState } from 'react';
import { Check, X, Shield, Sparkles, ArrowRight } from 'lucide-react';
import { CheckoutItem } from './PaymentCheckoutModal';

interface SubscriptionModalProps {
  onClose: () => void;
  onOpenCheckout: (item: CheckoutItem) => void;
  currentTier?: 'free' | 'premium' | 'pro';
  isMobileMode?: boolean;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  onClose,
  onOpenCheckout,
  currentTier = 'free',
  isMobileMode = false,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'premium' | 'pro'>(
    currentTier === 'free' ? 'premium' : currentTier
  );
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('annual');
  const [gatewayMessage, setGatewayMessage] = useState<string | null>(null);

  const plans = [
    {
      id: 'free',
      name: 'Free Starter',
      price: '$0',
      period: 'Forever free',
      desc: 'Foundational workout logging and nutrition basics.',
      features: [
        'Workout tracking & set recorder',
        'Full 40+ exercise library',
        'Basic nutrition tracking & food database',
        'Standard 30-day weight progress chart',
      ],
    },
    {
      id: 'premium',
      name: 'Athlete Premium',
      price: billingPeriod === 'annual' ? '$9.99' : '$14.99',
      period: 'per month',
      desc: 'Intelligent autoregulation and full AI coaching assistant.',
      popular: true,
      features: [
        'Everything in Free',
        'Kinetix AI Coach (Gemini 2.5 Flash)',
        'Deterministic autoregulation load adjustments',
        'Advanced nutrition & macro breakdown',
        'Bio-readiness & HRV recovery insights',
        'Unlimited custom workout programmes',
      ],
    },
    {
      id: 'pro',
      name: 'Olympian Pro',
      price: billingPeriod === 'annual' ? '$19.99' : '$24.99',
      period: 'per month',
      desc: 'Complete sports laboratory with on-device computer vision form analysis.',
      features: [
        'Everything in Premium',
        'Computer Vision live exercise form analysis',
        'Joint angle & depth metrics (squat, bench, etc.)',
        'Biomechanical repetition segmentation',
        'Exportable sports science PDF reports',
        'Priority cloud synchronization bridge',
      ],
    },
  ];

  const handleSelectGateway = (gateway: string) => {
    const activeP = plans.find((p) => p.id === selectedPlan) || plans[1];
    if (activeP.id === 'free') {
      setGatewayMessage('Free tier is already active on your account.');
      return;
    }
    onOpenCheckout({
      id: `sub_${activeP.id}`,
      type: 'subscription',
      title: activeP.name,
      subtitle: `Billed ${billingPeriod} · Full Access`,
      price: activeP.price,
      period: activeP.period,
    });
  };

  const handleCheckoutCurrent = (planId: 'free' | 'premium' | 'pro') => {
    const plan = plans.find((p) => p.id === planId) || plans[1];
    if (plan.id === 'free') {
      onClose();
      return;
    }
    onOpenCheckout({
      id: `sub_${plan.id}`,
      type: 'subscription',
      title: plan.name,
      subtitle: `Billed ${billingPeriod} · Full Access`,
      price: plan.price,
      period: plan.period,
    });
  };

  return (
    <div className={`${isMobileMode ? 'absolute inset-0' : 'fixed inset-0'} z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/90 backdrop-blur-md overflow-hidden`}>
      <div className="bg-[#10161D] border border-[#212C3B] rounded-2xl w-full max-w-[345px] sm:max-w-xl md:max-w-3xl max-h-[92%] flex flex-col p-3.5 sm:p-6 text-slate-100 shadow-2xl relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 p-1.5 text-slate-400 hover:text-white rounded-lg bg-[#16202B] z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Scrollable Container */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4">
          <div className="text-center max-w-lg mx-auto pt-1">
            <span className="text-[10px] sm:text-[11px] font-bold text-lime-400 uppercase tracking-wider">
              Tier Architecture · Stage 2 Ready
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5">Choose Your Training Tier</h2>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
              Unlock advanced autoregulation, live AI coaching, and computer vision biomechanics.
            </p>

            {/* Billing Switcher */}
            <div className="flex items-center justify-center gap-1 p-1 bg-[#151D27] rounded-xl border border-[#232F3E] inline-flex mt-3">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  billingPeriod === 'monthly' ? 'bg-[#1F2C3C] text-white' : 'text-slate-400'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod('annual')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 ${
                  billingPeriod === 'annual' ? 'bg-lime-400 text-slate-950 font-bold' : 'text-slate-400'
                }`}
              >
                Annual <span className="text-[9px] bg-slate-900/40 text-slate-950 px-1 rounded font-mono">Save 30%</span>
              </button>
            </div>
          </div>

          {/* 3 Tier Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {plans.map((p) => {
              const isSelected = selectedPlan === p.id;
              const isCurrent = currentTier === p.id;

              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPlan(p.id as any)}
                  className={`p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-lime-400 bg-[#141E29] shadow-md shadow-lime-500/10'
                      : 'border-[#1E2734] bg-[#121821] hover:border-slate-600'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      {p.popular ? (
                        <span className="text-[9px] sm:text-[10px] font-bold text-lime-400 uppercase tracking-wider block">
                          Most Recommended
                        </span>
                      ) : (
                        <div />
                      )}
                      {isCurrent && (
                        <span className="text-[9px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono">
                          Active Plan
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-white">{p.name}</h3>
                    <div className="flex items-baseline gap-1 my-1.5">
                      <span className="text-xl sm:text-2xl font-black text-white font-mono">{p.price}</span>
                      <span className="text-[11px] text-slate-400">{p.period}</span>
                    </div>
                    <p className="text-[10px] sm:text-[11px] text-slate-400 mb-3">{p.desc}</p>

                    <div className="space-y-1.5 border-t border-[#1C2633] pt-2.5">
                      {p.features.map((f, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-1.5 text-[11px] text-slate-300">
                          <Check className="w-3.5 h-3.5 text-lime-400 shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCheckoutCurrent(p.id as any);
                    }}
                    className={`w-full py-2 sm:py-2.5 rounded-xl text-xs font-bold mt-4 transition-colors flex items-center justify-center gap-1.5 ${
                      isCurrent
                        ? 'bg-slate-800 text-slate-400 cursor-default'
                        : isSelected
                        ? 'bg-lime-400 hover:bg-lime-300 text-slate-950 shadow-md shadow-lime-500/20'
                        : 'bg-[#182330] text-slate-300 hover:text-white'
                    }`}
                  >
                    {isCurrent ? (
                      'Current Active Plan'
                    ) : p.id === 'free' ? (
                      'Downgrade to Free'
                    ) : (
                      <>
                        Proceed to Checkout
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Native Payment Gateways Integration Points */}
          <div className="bg-[#131A22] border border-[#202C3B] rounded-xl p-3 sm:p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] sm:text-xs font-bold text-slate-200">
                Quick Checkout Via Gateways:
              </span>
              <span className="text-[9px] sm:text-[10px] text-slate-400">Click to Checkout</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'apple', name: 'Apple Pay', sub: 'Touch ID' },
                { id: 'google', name: 'Google Pay', sub: 'Android Wallet' },
                { id: 'click', name: 'Click Pay', sub: 'Direct Merchant' },
                { id: 'payme', name: 'Payme', sub: 'Instant Portal' },
              ].map((gw) => (
                <button
                  key={gw.id}
                  onClick={() => handleSelectGateway(gw.name)}
                  className="p-2 sm:p-2.5 rounded-lg bg-[#10151C] hover:bg-[#16202B] border border-[#232F3E] text-left transition-colors group"
                >
                  <p className="text-xs font-bold text-white group-hover:text-lime-400 truncate transition-colors">
                    {gw.name}
                  </p>
                  <p className="text-[9px] text-slate-500 mt-0.5">{gw.sub}</p>
                </button>
              ))}
            </div>

            {gatewayMessage && (
              <p className="text-xs text-lime-400 bg-lime-500/10 p-2 rounded-lg border border-lime-500/20 font-mono">
                {gatewayMessage}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
