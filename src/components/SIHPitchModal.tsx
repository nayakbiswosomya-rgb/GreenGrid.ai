import React from 'react';
import { 
  X, 
  Award, 
  Target, 
  TrendingUp, 
  ShieldCheck, 
  Layers, 
  Sparkles, 
  CheckCircle 
} from 'lucide-react';
import { GreenGridLogo } from './GreenGridLogo';
import confetti from 'canvas-confetti';

interface SIHPitchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SIHPitchModal: React.FC<SIHPitchModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl overflow-y-auto">
      <div className="relative w-full max-w-3xl my-8 bg-slate-900/80 backdrop-blur-2xl border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 ring-1 ring-white/10">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 border border-white/10 transition backdrop-blur-md"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Banner */}
        <div className="flex items-center gap-3.5 mb-6 select-none">
          <GreenGridLogo size={48} animated />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-black tracking-tight flex items-baseline">
                <span className="text-white">green</span>
                <span className="text-emerald-400">grid</span>
                <span className="text-teal-300 font-semibold text-lg ml-0.5">.ai</span>
              </span>
              <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 backdrop-blur-md font-mono">
                SIH 2026 Pitch Deck
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Next-Generation AI Microgrid Management & Demand-Response Platform
            </p>
          </div>
        </div>

        {/* 4 Pillar Grid for Judges */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          
          {/* Pillar 1: Problem Statement */}
          <div className="p-5 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/10 space-y-2 shadow-md">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
              <Target className="w-4 h-4 text-rose-400" />
              The Problem Statement
            </div>
            <h4 className="text-sm font-bold text-slate-200">
              Renewable Intermittency & High Peak Tariffs
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Industrial microgrids suffer from solar duck-curve volatility, steep Time-of-Day (ToD) tariff penalties during evening peak (₹12+/kWh), and uncoordinated EV fleet charging causing transformer overloads.
            </p>
          </div>

          {/* Pillar 2: AI Solution */}
          <div className="p-5 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-emerald-500/30 space-y-2 shadow-md">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Our AI Innovation
            </div>
            <h4 className="text-sm font-bold text-slate-200">
              Gemini-Driven Sub-Second Dispatch Engine
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              GreenGridAI forecasts load and solar curves 24 hours in advance, auto-schedules BESS pre-charging, executes dynamic load-shedding, and optimizes Net-Metering export in real time.
            </p>
          </div>

          {/* Pillar 3: Quantifiable ROI */}
          <div className="p-5 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-amber-500/30 space-y-2 shadow-md">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              Quantifiable Impact
            </div>
            <ul className="text-xs text-slate-300 space-y-1.5">
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <strong>38% - 45% reduction</strong> in monthly peak electricity bills
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <strong>98.4% clean solar yield</strong> self-consumption
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <strong>100% blackout resilience</strong> via automated microgrid islanding
              </li>
            </ul>
          </div>

          {/* Pillar 4: Architecture & Indian Grid Code */}
          <div className="p-5 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-cyan-500/30 space-y-2 shadow-md">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
              <Layers className="w-4 h-4 text-cyan-400" />
              Architecture & Compliance
            </div>
            <ul className="text-xs text-slate-300 space-y-1.5">
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <strong>CEA / CERC Grid Code compliant</strong> 50Hz frequency regulation
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <strong>Full-stack React 19 + Express</strong> with Gemini 3.7 Flash
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <strong>Edge SCADA integration</strong> for sub-second Modbus/MQTT telemetry
              </li>
            </ul>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Designed for SIH 2026 Smart Energy & Microgrid Track
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={triggerConfetti}
              className="px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-900/30 transition active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Celebrate Innovation 🎉</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/15 text-slate-200 font-semibold text-xs transition backdrop-blur-md"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
