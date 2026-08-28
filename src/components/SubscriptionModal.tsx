import React, { useState } from 'react';
import { 
  X, 
  Crown, 
  CheckCircle2, 
  Zap, 
  ShieldCheck, 
  CreditCard, 
  QrCode, 
  FileCheck, 
  ArrowRight,
  Sparkles,
  IndianRupee,
  Check
} from 'lucide-react';
import { UserProfile, SubscriptionTier, BillingCycle } from '../types';
import { SUBSCRIPTION_PLANS } from '../data/subscriptionData';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onUpgradePlan: (newTier: SubscriptionTier, billingCycle: BillingCycle) => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpgradePlan,
}) => {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>(currentUser.billingCycle || 'monthly');
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>(currentUser.tier || 'pro');
  const [checkoutStep, setCheckoutStep] = useState<'plans' | 'payment' | 'success'>('plans');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'invoice'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const currentPlan = SUBSCRIPTION_PLANS.find((p) => p.id === currentUser.tier) || SUBSCRIPTION_PLANS[1];
  const targetPlan = SUBSCRIPTION_PLANS.find((p) => p.id === selectedTier) || currentPlan;
  const targetPrice = billingCycle === 'monthly' ? targetPlan.priceMonthlyInr : targetPlan.priceAnnuallyInr;

  const handleStartUpgrade = (tier: SubscriptionTier) => {
    setSelectedTier(tier);
    if (tier === currentUser.tier && billingCycle === currentUser.billingCycle) {
      return;
    }
    if (tier === 'starter') {
      onUpgradePlan('starter', billingCycle);
      setCheckoutStep('success');
    } else {
      setCheckoutStep('payment');
    }
  };

  const handleConfirmPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      onUpgradePlan(selectedTier, billingCycle);
      setIsProcessing(false);
      setCheckoutStep('success');
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl overflow-y-auto">
      <div className="relative w-full max-w-4xl my-8 bg-slate-900/90 backdrop-blur-2xl border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 ring-1 ring-white/10">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 border border-white/10 transition backdrop-blur-md"
        >
          <X className="w-4 h-4" />
        </button>

        {/* STEP 1: PLANS VIEW */}
        {checkoutStep === 'plans' && (
          <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                    <Crown className="w-4 h-4" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Microgrid SCADA Subscription & Licenses</h2>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Active Tier for <strong>{currentUser.facility}</strong>: <span className="text-emerald-400 font-bold uppercase">{currentUser.tier}</span> ({currentUser.billingCycle})
                </p>
              </div>

              {/* Monthly vs Annual billing toggle */}
              <div className="flex items-center gap-1 text-xs bg-white/5 p-1 rounded-xl border border-white/10 self-start sm:self-auto">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                    billingCycle === 'monthly' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle('annually')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1 ${
                    billingCycle === 'annually' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Annual <span className="text-[10px] px-1 bg-amber-400 text-slate-950 font-bold rounded">20% OFF</span>
                </button>
              </div>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {SUBSCRIPTION_PLANS.map((plan) => {
                const isCurrent = currentUser.tier === plan.id;
                const price = billingCycle === 'monthly' ? plan.priceMonthlyInr : plan.priceAnnuallyInr;
                
                return (
                  <div
                    key={plan.id}
                    className={`p-5 rounded-2xl border flex flex-col justify-between backdrop-blur-xl relative transition ${
                      isCurrent
                        ? 'bg-emerald-950/40 border-emerald-400/60 ring-2 ring-emerald-500/50 shadow-lg shadow-emerald-950/40'
                        : plan.popular
                        ? 'bg-teal-950/30 border-teal-400/40 shadow-md'
                        : 'bg-white/[0.03] border-white/10'
                    }`}
                  >
                    {isCurrent && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-bold bg-emerald-400 text-slate-950 shadow-md">
                        ✓ Current Active Plan
                      </span>
                    )}

                    {!isCurrent && plan.popular && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 shadow-md">
                        ⭐ Most Popular
                      </span>
                    )}

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-base font-bold text-white">{plan.name}</h3>
                        {plan.badge && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-slate-300 font-semibold">
                            {plan.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 min-h-[34px]">{plan.tagline}</p>

                      <div className="my-4 py-3 border-y border-white/10">
                        <div className="text-2xl font-black text-emerald-400 font-mono">
                          {price === 0 ? 'Free' : `₹${price.toLocaleString('en-IN')}`}
                          <span className="text-xs font-normal text-slate-400 font-sans">
                            {price === 0 ? ' forever' : ' / month'}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1">
                          Node Limit: <strong>{plan.maxSolarCapacityKw} kWp Solar</strong> / <strong>{plan.maxBatteryCapacityKwh} kWh BESS</strong>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs mb-6">
                        {plan.features.map((feat, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <CheckCircle2
                              className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                                feat.included
                                  ? feat.highlight
                                    ? 'text-teal-300 font-bold'
                                    : 'text-emerald-400'
                                  : 'text-slate-600'
                              }`}
                            />
                            <span
                              className={
                                feat.included
                                  ? feat.highlight
                                    ? 'text-slate-100 font-semibold'
                                    : 'text-slate-300'
                                  : 'text-slate-500 line-through'
                              }
                            >
                              {feat.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => handleStartUpgrade(plan.id)}
                      disabled={isCurrent}
                      className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition ${
                        isCurrent
                          ? 'bg-white/10 text-slate-400 cursor-default'
                          : plan.popular
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 shadow-md shadow-emerald-500/20'
                          : 'bg-white/10 hover:bg-white/20 text-slate-100 border border-white/15'
                      }`}
                    >
                      {isCurrent ? (
                        <span>Currently Active</span>
                      ) : (
                        <>
                          <span>Switch to {plan.name}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Enterprise Guarantee Footer */}
            <div className="mt-6 p-4 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Zero-risk 30-day money-back guarantee • Official GST tax invoice issued automatically.</span>
              </div>
              <div className="flex items-center gap-3 font-semibold text-slate-300">
                <span>UPI / NetBanking</span>
                <span>•</span>
                <span>Visa / Mastercard</span>
                <span>•</span>
                <span>PO Invoicing</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: PAYMENT / CHECKOUT MODAL */}
        {checkoutStep === 'payment' && (
          <div className="max-w-xl mx-auto space-y-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/30 text-slate-950 mb-3">
                <Crown className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-white">Upgrade to {targetPlan.name}</h2>
              <p className="text-xs text-slate-400 mt-1">Unlock AI automated dispatch & dynamic ToD tariff arbitrage.</p>
            </div>

            {/* Order Summary */}
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Plan:</span>
                <strong className="text-white">{targetPlan.name} ({billingCycle === 'monthly' ? 'Monthly' : 'Annual - 20% Off'})</strong>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Facility:</span>
                <span className="text-slate-300">{currentUser.facility}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Billing Amount:</span>
                <span className="text-base font-bold text-emerald-400 font-mono">₹{targetPrice.toLocaleString('en-IN')}{billingCycle === 'monthly' ? '/mo' : '/year'}</span>
              </div>
              <div className="flex justify-between text-slate-400 text-[11px] pt-1 border-t border-white/10">
                <span>Applicable GST (18% included):</span>
                <span>₹{(targetPrice * 0.18).toFixed(0)}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-300">Select Payment Method</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition ${
                    paymentMethod === 'upi'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <QrCode className="w-5 h-5" />
                  <span className="text-xs font-bold">UPI / QR</span>
                </button>

                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition ${
                    paymentMethod === 'card'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span className="text-xs font-bold">Card / NetBanking</span>
                </button>

                <button
                  onClick={() => setPaymentMethod('invoice')}
                  className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition ${
                    paymentMethod === 'invoice'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <FileCheck className="w-5 h-5" />
                  <span className="text-xs font-bold">Corporate PO</span>
                </button>
              </div>

              {/* Payment Details Simulated */}
              {paymentMethod === 'upi' && (
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-center text-xs space-y-2">
                  <div className="font-mono text-emerald-400 font-bold text-sm">greengridai.scada@icici</div>
                  <p className="text-slate-400 text-[11px]">Instant UPI auto-mandate supported for Google Pay, PhonePe, and BHIM.</p>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-xs space-y-2">
                  <input
                    type="text"
                    placeholder="4111 •••• •••• 4242"
                    defaultValue="4111 2234 5678 9012"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-100 font-mono text-xs focus:outline-none"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      defaultValue="12/28"
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-100 font-mono text-xs focus:outline-none"
                    />
                    <input
                      type="password"
                      placeholder="CVV"
                      defaultValue="888"
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-100 font-mono text-xs focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'invoice' && (
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-xs space-y-2">
                  <input
                    type="text"
                    placeholder="GSTIN (e.g. 27AAAAA0000A1Z5)"
                    defaultValue="27AABCT3928Q1ZP"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-100 font-mono text-xs focus:outline-none"
                  />
                  <p className="text-slate-400 text-[11px]">30-day net payment terms with automated e-invoice submission.</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setCheckoutStep('plans')}
                className="flex-1 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-semibold transition"
              >
                Back to Plans
              </button>
              <button
                onClick={handleConfirmPayment}
                disabled={isProcessing}
                className="flex-2 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition cursor-pointer"
              >
                {isProcessing ? (
                  <span>Authorizing SCADA License...</span>
                ) : (
                  <>
                    <span>Pay ₹{targetPrice.toLocaleString('en-IN')} & Activate</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SUCCESS CONFIRMATION */}
        {checkoutStep === 'success' && (
          <div className="max-w-md mx-auto text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
              <Check className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white">License Successfully Upgraded!</h2>
              <p className="text-xs text-slate-300 mt-1">
                Your microgrid is now running on the <strong>{targetPlan.name}</strong> tier. AI predictive dispatch and peak shaving have been fully unlocked.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 text-xs text-left space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Target Facility:</span>
                <span className="font-bold text-white">{currentUser.facility}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Subscription Status:</span>
                <span className="text-emerald-400 font-bold">Active & Synchronized</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Next Renewal:</span>
                <span className="text-slate-200">September 27, 2026</span>
              </div>
            </div>

            <button
              onClick={() => {
                setCheckoutStep('plans');
                onClose();
              }}
              className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition cursor-pointer"
            >
              Return to SCADA Control Dashboard
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
