import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  User, 
  Building2, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Activity, 
  Sun, 
  BatteryCharging, 
  Crown,
  ChevronRight,
  HelpCircle
} from 'lucide-react';
import { GreenGridLogo } from './GreenGridLogo';
import { UserProfile, SubscriptionTier, BillingCycle } from '../types';
import { SUBSCRIPTION_PLANS, DEMO_USERS, AVAILABLE_FACILITIES } from '../data/subscriptionData';

interface LoginPageProps {
  onLogin: (user: UserProfile) => void;
  onOpenPlansPreview?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'plans'>('signin');
  
  // Sign In Form States
  const [email, setEmail] = useState('aditi.sharma@tatagreentech.com');
  const [password, setPassword] = useState('••••••••••••');
  const [rememberMe, setRememberMe] = useState(true);

  // Sign Up Form States
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupRole, setSignupRole] = useState<UserProfile['role']>('Facility Manager');
  const [signupFacility, setSignupFacility] = useState(AVAILABLE_FACILITIES[0]);
  const [selectedPlanTier, setSelectedPlanTier] = useState<SubscriptionTier>('pro');
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');

  // Loading animation state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle Form Submit for Sign In
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    setTimeout(() => {
      // Find matching demo user or create session user
      const matched = DEMO_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (matched) {
        onLogin(matched);
      } else {
        // Log in with entered credentials
        const newUser: UserProfile = {
          id: `usr_${Date.now()}`,
          name: email.split('@')[0].replace('.', ' ').replace(/^./, (str) => str.toUpperCase()) || 'Grid Operator',
          email: email || 'operator@greengrid.ai',
          role: 'Facility Manager',
          facility: 'Commercial Microgrid Site (Pune)',
          tier: 'pro',
          billingCycle: 'monthly',
          joinedDate: 'August 2026',
          nextBillingDate: 'Sept 27, 2026',
        };
        onLogin(newUser);
      }
      setIsSubmitting(false);
    }, 600);
  };

  // Handle Form Submit for Sign Up
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName.trim() || !signupEmail.trim()) {
      setErrorMessage('Please enter your full name and organization email address.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const newUser: UserProfile = {
        id: `usr_${Date.now()}`,
        name: signupName,
        email: signupEmail,
        role: signupRole,
        facility: signupFacility,
        tier: selectedPlanTier,
        billingCycle,
        joinedDate: 'August 2026',
        nextBillingDate: billingCycle === 'monthly' ? 'Sept 27, 2026' : 'August 27, 2027',
      };
      onLogin(newUser);
      setIsSubmitting(false);
    }, 700);
  };

  // 1-Click Quick Demo Login
  const handleQuickDemoLogin = (demoUser: UserProfile) => {
    setIsSubmitting(true);
    setTimeout(() => {
      onLogin(demoUser);
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col justify-between relative overflow-x-hidden selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Ambient background glows */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-10 right-10 w-[500px] h-[500px] bg-teal-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed top-1/3 right-1/4 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Header */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between z-10">
        <div className="flex items-center gap-3.5 select-none">
          <GreenGridLogo size={44} animated />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-xl tracking-tight flex items-baseline">
                <span className="text-white">green</span>
                <span className="text-emerald-400">grid</span>
                <span className="text-teal-300 font-semibold text-base ml-0.5">.ai</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                SCADA Cloud v2.6
              </span>
            </div>
            <p className="text-xs text-slate-400">Autonomous Renewable Microgrid Dispatch</p>
          </div>
        </div>

        {/* Top Right Navigation Pills */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAuthMode(authMode === 'plans' ? 'signin' : 'plans')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition backdrop-blur-md flex items-center gap-1.5 ${
              authMode === 'plans'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
            }`}
          >
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>Pricing & Plans</span>
          </button>
        </div>
      </header>

      {/* Main Authentication Card Area */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 z-10">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Value Proposition & Live Telemetry Teaser */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-semibold backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5" />
                Smart India Hackathon 2026 Edition
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
                AI-Driven Microgrid & <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 bg-clip-text text-transparent">Zero-Carbon Energy</span> Command
              </h1>
              <p className="text-sm text-slate-300 leading-relaxed">
                Connect your solar PV arrays, BESS battery storage, and dynamic building loads to maximize self-consumption and eliminate peak Discom penalties.
              </p>
            </div>

            {/* Quick Live Preview Badges */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10">
                <div className="flex items-center gap-2 text-amber-400 mb-1">
                  <Sun className="w-4 h-4" />
                  <span className="text-xs font-semibold text-slate-300">Peak Solar Dispatch</span>
                </div>
                <div className="text-xl font-bold text-slate-100 font-mono">150 kWp</div>
                <p className="text-[11px] text-slate-400 mt-0.5">Automated MPPT balance</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10">
                <div className="flex items-center gap-2 text-emerald-400 mb-1">
                  <BatteryCharging className="w-4 h-4" />
                  <span className="text-xs font-semibold text-slate-300">BESS Storage</span>
                </div>
                <div className="text-xl font-bold text-slate-100 font-mono">250 kWh</div>
                <p className="text-[11px] text-slate-400 mt-0.5">LiFePO4 Safe Chemistry</p>
              </div>
            </div>

            {/* SIH / Industrial Trust Badges */}
            <div className="p-4 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 space-y-2.5">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Enterprise Security & Standards
              </div>
              <ul className="text-xs text-slate-400 space-y-1.5">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Central Electricity Authority (CEA) Grid-Code Compliant</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>ISO 50001 Energy Management & Carbon ESG Accounting</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>256-bit TLS hardware telemetry & Modbus/DNP3 bridging</span>
                </li>
              </ul>
            </div>

            {/* Quick Demo Logins Section */}
            <div className="pt-2">
              <div className="text-xs font-bold text-slate-300 mb-2 flex items-center justify-between">
                <span>⚡ 1-Click Instant Demo Login:</span>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">No password needed</span>
              </div>
              <div className="space-y-2">
                {DEMO_USERS.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleQuickDemoLogin(user)}
                    disabled={isSubmitting}
                    className="w-full p-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/10 hover:border-emerald-500/40 text-left transition flex items-center justify-between group backdrop-blur-md shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/20 flex items-center justify-center text-xs font-bold text-emerald-400 overflow-hidden">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-200 group-hover:text-emerald-300 transition flex items-center gap-1.5">
                          {user.name}
                          <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-semibold uppercase ${
                            user.tier === 'enterprise' 
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' 
                              : user.tier === 'pro'
                              ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                              : 'bg-slate-700 text-slate-300'
                          }`}>
                            {user.tier}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400">{user.role} • {user.facility.split('(')[0]}</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition" />
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Login / Register / Plans Card */}
          <div className="lg:col-span-7">
            <div className="bg-slate-900/80 backdrop-blur-2xl border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/60 ring-1 ring-white/10 relative">
              
              {/* Tab Navigation */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                <div className="flex gap-2 p-1 rounded-2xl bg-white/5 border border-white/10 text-xs font-semibold backdrop-blur-md">
                  <button
                    onClick={() => { setAuthMode('signin'); setErrorMessage(''); }}
                    className={`px-4 py-2 rounded-xl transition ${
                      authMode === 'signin'
                        ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/30'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => { setAuthMode('signup'); setErrorMessage(''); }}
                    className={`px-4 py-2 rounded-xl transition ${
                      authMode === 'signup'
                        ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/30'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Register Facility
                  </button>
                  <button
                    onClick={() => { setAuthMode('plans'); setErrorMessage(''); }}
                    className={`px-3 py-2 rounded-xl transition flex items-center gap-1 ${
                      authMode === 'plans'
                        ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/30'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Crown className="w-3.5 h-3.5" />
                    <span>Plans</span>
                  </button>
                </div>

                <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  SCADA Gateway Online
                </div>
              </div>

              {errorMessage && (
                <div className="mb-4 p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* VIEW 1: SIGN IN FORM */}
              {authMode === 'signin' && (
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <h2 className="text-xl font-bold text-white">Sign In to SCADA Dispatch Hub</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Enter your operator credentials to access microgrid telemetry.</p>
                  </div>

                  <div className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Work Email Address
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="operator@greengrid.ai"
                          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 focus:border-emerald-400 focus:outline-none text-sm text-slate-100 placeholder:text-slate-500 transition"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-semibold text-slate-300">
                          Password
                        </label>
                        <span className="text-[11px] text-emerald-400 hover:underline cursor-pointer">
                          Forgot access key?
                        </span>
                      </div>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 focus:border-emerald-400 focus:outline-none text-sm text-slate-100 placeholder:text-slate-500 transition font-mono"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="w-4 h-4 rounded bg-white/5 border-white/20 accent-emerald-500"
                        />
                        <span>Remember this workstation</span>
                      </label>
                      <span className="text-slate-500 text-[11px]">TLS 1.3 256-bit Encrypted</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition active:scale-[0.99] cursor-pointer mt-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Activity className="w-4 h-4 animate-spin text-slate-950" />
                        <span>Authenticating SCADA Token...</span>
                      </>
                    ) : (
                      <>
                        <span>Access Microgrid Control Room</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="text-center pt-2">
                    <p className="text-xs text-slate-400">
                      Need to connect a new microgrid?{' '}
                      <button
                        type="button"
                        onClick={() => setAuthMode('signup')}
                        className="text-emerald-400 font-semibold hover:underline"
                      >
                        Create an Account & Choose Plan
                      </button>
                    </p>
                  </div>
                </form>
              )}

              {/* VIEW 2: SIGN UP / REGISTER FACILITY FORM WITH SUBSCRIPTION SELECTION */}
              {authMode === 'signup' && (
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div>
                    <h2 className="text-xl font-bold text-white">Register Smart Microgrid Facility</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Deploy AI dispatch for your commercial rooftop or industrial microgrid.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Full Name / Title
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={signupName}
                          onChange={(e) => setSignupName(e.target.value)}
                          placeholder="e.g. Dr. Rajesh Mehra"
                          className="w-full pl-9 pr-3 py-2 rounded-2xl bg-white/5 border border-white/10 focus:border-emerald-400 text-xs text-slate-100 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Work / Org Email
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
                          placeholder="rajesh@tatapower.in"
                          className="w-full pl-9 pr-3 py-2 rounded-2xl bg-white/5 border border-white/10 focus:border-emerald-400 text-xs text-slate-100 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Operator Role
                      </label>
                      <select
                        value={signupRole}
                        onChange={(e) => setSignupRole(e.target.value as UserProfile['role'])}
                        className="w-full px-3 py-2 rounded-2xl bg-slate-900 border border-white/10 text-xs text-slate-100 focus:outline-none"
                      >
                        <option value="Facility Manager">Facility Manager</option>
                        <option value="SCADA Grid Dispatcher">SCADA Grid Dispatcher</option>
                        <option value="Sustainability Auditor">Sustainability Auditor</option>
                        <option value="Energy Engineer">Energy Engineer</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Target Microgrid Facility
                      </label>
                      <div className="relative">
                        <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <select
                          value={signupFacility}
                          onChange={(e) => setSignupFacility(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 rounded-2xl bg-slate-900 border border-white/10 text-xs text-slate-100 focus:outline-none truncate"
                        >
                          {AVAILABLE_FACILITIES.map((fac) => (
                            <option key={fac} value={fac}>{fac}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Plan Tier Selection inside registration */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                        <Crown className="w-3.5 h-3.5 text-amber-400" />
                        Select Subscription Tier:
                      </label>
                      
                      <div className="flex items-center gap-1 text-[10px] bg-white/5 p-0.5 rounded-lg border border-white/10">
                        <button
                          type="button"
                          onClick={() => setBillingCycle('monthly')}
                          className={`px-2 py-0.5 rounded ${billingCycle === 'monthly' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'}`}
                        >
                          Monthly
                        </button>
                        <button
                          type="button"
                          onClick={() => setBillingCycle('annually')}
                          className={`px-2 py-0.5 rounded flex items-center gap-1 ${billingCycle === 'annually' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'}`}
                        >
                          Annual <span className="text-[9px] text-amber-300 font-bold">-20%</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {SUBSCRIPTION_PLANS.map((plan) => {
                        const price = billingCycle === 'monthly' ? plan.priceMonthlyInr : plan.priceAnnuallyInr;
                        const isSelected = selectedPlanTier === plan.id;
                        return (
                          <div
                            key={plan.id}
                            onClick={() => setSelectedPlanTier(plan.id)}
                            className={`p-3 rounded-2xl border cursor-pointer transition text-left relative ${
                              isSelected
                                ? 'bg-emerald-500/15 border-emerald-400 ring-1 ring-emerald-400 shadow-md shadow-emerald-950/40'
                                : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.07]'
                            }`}
                          >
                            {plan.popular && (
                              <span className="absolute -top-2 right-2 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-400 text-slate-950">
                                Popular
                              </span>
                            )}
                            <div className="text-xs font-bold text-slate-100">{plan.name}</div>
                            <div className="text-sm font-extrabold text-emerald-400 font-mono mt-1">
                              {price === 0 ? 'Free' : `₹${price.toLocaleString('en-IN')}`}
                              <span className="text-[10px] text-slate-400 font-normal">/mo</span>
                            </div>
                            <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                              Cap: {plan.maxSolarCapacityKw} kWp
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition active:scale-[0.99] cursor-pointer mt-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Activity className="w-4 h-4 animate-spin text-slate-950" />
                        <span>Provisioning SCADA Microgrid Node...</span>
                      </>
                    ) : (
                      <>
                        <span>Complete Registration & Launch</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="text-center">
                    <p className="text-xs text-slate-400">
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => setAuthMode('signin')}
                        className="text-emerald-400 font-semibold hover:underline"
                      >
                        Sign In Here
                      </button>
                    </p>
                  </div>
                </form>
              )}

              {/* VIEW 3: FULL SUBSCRIPTION PLANS COMPARISON */}
              {authMode === 'plans' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Crown className="w-5 h-5 text-amber-400" />
                        Subscription & SCADA License Tiers
                      </h2>
                      <p className="text-xs text-slate-400 mt-0.5">Flexible plans for academic testbeds, commercial parks, and heavy industry.</p>
                    </div>

                    {/* Monthly vs Annual Toggle */}
                    <div className="flex items-center gap-1 text-xs bg-white/5 p-1 rounded-xl border border-white/10">
                      <button
                        onClick={() => setBillingCycle('monthly')}
                        className={`px-3 py-1 rounded-lg font-semibold transition ${
                          billingCycle === 'monthly' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        Monthly
                      </button>
                      <button
                        onClick={() => setBillingCycle('annually')}
                        className={`px-3 py-1 rounded-lg font-semibold transition flex items-center gap-1 ${
                          billingCycle === 'annually' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        Annually <span className="text-[10px] px-1 bg-amber-400 text-slate-950 font-bold rounded">20% OFF</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    {SUBSCRIPTION_PLANS.map((plan) => {
                      const price = billingCycle === 'monthly' ? plan.priceMonthlyInr : plan.priceAnnuallyInr;
                      return (
                        <div
                          key={plan.id}
                          className={`p-4 sm:p-5 rounded-2xl border flex flex-col justify-between backdrop-blur-xl relative transition ${
                            plan.popular
                              ? 'bg-teal-950/40 border-teal-400/50 shadow-lg shadow-teal-950/40 ring-1 ring-teal-400/30'
                              : 'bg-white/[0.03] border-white/10'
                          }`}
                        >
                          {plan.popular && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 shadow-md">
                              ⭐ Recommended for Tech Parks
                            </div>
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
                            <p className="text-xs text-slate-400 min-h-[32px]">{plan.tagline}</p>

                            <div className="my-4 py-3 border-y border-white/10">
                              <div className="text-2xl font-black text-emerald-400 font-mono">
                                {price === 0 ? 'Free' : `₹${price.toLocaleString('en-IN')}`}
                                <span className="text-xs font-normal text-slate-400 font-sans">
                                  {price === 0 ? ' forever' : ' / month'}
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-400 mt-1">
                                Max Capacity: <strong>{plan.maxSolarCapacityKw} kWp Solar</strong> / <strong>{plan.maxBatteryCapacityKwh} kWh BESS</strong>
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
                            onClick={() => {
                              setSelectedPlanTier(plan.id);
                              setAuthMode('signup');
                            }}
                            className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition ${
                              plan.popular
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 shadow-md shadow-emerald-500/20'
                                : 'bg-white/10 hover:bg-white/15 text-slate-100 border border-white/10'
                            }`}
                          >
                            <span>Choose {plan.name}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  <div className="text-center pt-2">
                    <button
                      onClick={() => setAuthMode('signin')}
                      className="text-xs text-slate-400 hover:text-emerald-300 transition"
                    >
                      ← Back to Operator Sign In
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2 z-10">
        <div>🌱 GreenGridAI • Smart India Hackathon (SIH) 2026 Submission</div>
        <div className="flex items-center gap-4 text-slate-400">
          <span>Grid Code ISO 50001</span>
          <span>•</span>
          <span>Zero-Carbon Protocol</span>
          <span>•</span>
          <span>Discom Net-Metering Compliant</span>
        </div>
      </footer>

    </div>
  );
};
