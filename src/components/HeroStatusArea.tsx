import React from 'react';
import { 
  Zap, 
  BrainCircuit, 
  Sparkles, 
  Leaf, 
  IndianRupee, 
  ShieldCheck, 
  Activity, 
  Sun,
  Crown,
  Building2,
  CheckCircle2,
  TrendingUp,
  Clock
} from 'lucide-react';
import { GridTelemetry, SystemModeType, UserProfile } from '../types';

interface HeroStatusAreaProps {
  telemetry: GridTelemetry;
  systemMode: SystemModeType;
  currentUser: UserProfile;
  isAutopilotActive: boolean;
  onToggleAutopilot: () => void;
  onOpenSubscriptionModal: () => void;
  onOpenPitchModal: () => void;
}

export const HeroStatusArea: React.FC<HeroStatusAreaProps> = ({
  telemetry,
  systemMode,
  currentUser,
  isAutopilotActive,
  onToggleAutopilot,
  onOpenSubscriptionModal,
  onOpenPitchModal,
}) => {
  const cleanEnergyPercent = telemetry.loadKw > 0 
    ? Math.min(100, Math.round((telemetry.solarKw / telemetry.loadKw) * 100))
    : 100;

  return (
    <section className="relative rounded-3xl bg-gradient-to-b from-slate-900/90 via-slate-900/70 to-slate-950/80 backdrop-blur-2xl border border-white/[0.1] p-6 sm:p-7 lg:p-8 shadow-2xl shadow-black/60 overflow-hidden ring-1 ring-white/[0.06]">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/[0.07] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-teal-500/[0.05] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-64 h-64 bg-cyan-500/[0.04] rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        
        {/* Left: Core Brand & Status Intelligence */}
        <div className="space-y-3 max-w-2xl">
          
          {/* Live system state bar */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 backdrop-blur-md shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>AI SYSTEM ONLINE</span>
            </div>

            <span className="text-slate-400 text-xs flex items-center gap-1 font-mono">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              Last updated: <span className="text-slate-300 font-semibold">Just now</span>
            </span>

            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-white/[0.04] text-slate-300 border border-white/[0.08]">
              <Building2 className="w-3 h-3 text-emerald-400" />
              <span className="truncate max-w-[150px] sm:max-w-[220px]">{currentUser.facility}</span>
            </div>

            <button
              onClick={() => document.getElementById('section-weather')?.scrollIntoView({ behavior: 'smooth' })}
              title="View 7-Day Solar & Weather Forecast"
              aria-label="View 7-Day Solar & Weather Forecast"
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition cursor-pointer"
            >
              <Sun className="w-3 h-3 text-amber-400" />
              <span>{telemetry.weather}: {telemetry.irradiance} W/m²</span>
              <span className="text-[10px] text-amber-400 font-bold ml-0.5">Forecast →</span>
            </button>
          </div>

          {/* Heading */}
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white flex items-center gap-3">
              Campus Energy Intelligence
            </h1>
            <p className="text-sm sm:text-base text-slate-300 mt-1 font-medium flex items-center gap-2">
              <span className="text-emerald-400 font-semibold">Predict.</span>
              <span className="text-cyan-400 font-semibold">Optimize.</span>
              <span className="text-teal-400 font-semibold">Control.</span>
              <span className="text-slate-500 hidden sm:inline">•</span>
              <span className="text-slate-400 text-xs sm:text-sm hidden sm:inline">Autonomous renewable microgrid dispatch for educational campuses</span>
            </p>
          </div>

        </div>

        {/* Right: AI Autopilot Master Control Switch */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          
          {/* Autopilot Button */}
          <button
            id="btn-toggle-ai-autopilot"
            onClick={onToggleAutopilot}
            className={`group relative p-4 sm:px-6 sm:py-4 rounded-2xl border transition-all duration-300 backdrop-blur-xl flex items-center justify-between sm:justify-start gap-4 cursor-pointer shadow-xl active:scale-[0.98] ${
              isAutopilotActive
                ? 'bg-gradient-to-r from-emerald-950/80 via-slate-900/90 to-teal-950/80 border-emerald-500/50 shadow-emerald-950/40 ring-2 ring-emerald-500/20'
                : 'bg-slate-900/80 border-white/[0.1] hover:border-white/[0.2] shadow-black/40'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
                isAutopilotActive
                  ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/30'
                  : 'bg-white/[0.05] text-slate-400 border border-white/[0.08]'
              }`}>
                <BrainCircuit className={`w-6 h-6 ${isAutopilotActive ? 'animate-pulse' : ''}`} />
              </div>

              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                    AI Energy Autopilot
                  </span>
                  <span className={`w-2 h-2 rounded-full ${isAutopilotActive ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
                </div>
                <div className="text-sm font-bold text-white flex items-center gap-1.5">
                  {isAutopilotActive ? (
                    <span className="text-emerald-400 font-mono">AUTONOMOUS ACTIVE</span>
                  ) : (
                    <span className="text-slate-400 font-mono">MANUAL OVERRIDE</span>
                  )}
                </div>
              </div>
            </div>

            {/* Switch knob visual */}
            <div className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-300 ml-2 ${
              isAutopilotActive ? 'bg-emerald-500' : 'bg-slate-700'
            }`}>
              <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
                isAutopilotActive ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </div>
          </button>

        </div>

      </div>

      {/* Quick Impact Metrics Bar */}
      <div className="mt-6 pt-5 border-t border-white/[0.08] grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10 font-mono text-xs">
        
        <div className="p-3.5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] backdrop-blur-md border border-white/[0.06] transition">
          <span className="text-slate-400 block text-[11px] flex items-center gap-1">
            <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
            Today's Net Savings
          </span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-lg font-bold text-emerald-300">
              ₹{telemetry.dailySavedInr.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold">↑ 18.5%</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-0.5 block font-sans">vs standard tariff baseline</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] backdrop-blur-md border border-white/[0.06] transition">
          <span className="text-slate-400 block text-[11px] flex items-center gap-1">
            <Leaf className="w-3.5 h-3.5 text-teal-400" />
            Carbon Avoided
          </span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-lg font-bold text-teal-300">
              {telemetry.co2OffsetKg.toFixed(0)} kg
            </span>
            <span className="text-[10px] text-teal-400 font-semibold">CO₂e</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-0.5 block font-sans">~24 mature trees planted</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] backdrop-blur-md border border-white/[0.06] transition">
          <span className="text-slate-400 block text-[11px] flex items-center gap-1">
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            Clean Self-Sufficiency
          </span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-lg font-bold text-amber-300">
              {cleanEnergyPercent}%
            </span>
            <span className="text-[10px] text-amber-400 font-semibold">
              {cleanEnergyPercent >= 100 ? 'Zero-Carbon' : 'Solar + BESS'}
            </span>
          </div>
          <span className="text-[10px] text-slate-500 mt-0.5 block font-sans">Direct clean consumption</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] backdrop-blur-md border border-white/[0.06] transition">
          <span className="text-slate-400 block text-[11px] flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            Active Grid Tariff
          </span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-lg font-bold text-cyan-300">
              ₹{telemetry.tariffRate}/kWh
            </span>
            <span className="text-[10px] text-slate-400">ToD</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-0.5 block font-sans">Peak window arbitrage armed</span>
        </div>

      </div>

    </section>
  );
};
