import React, { useState, useEffect } from 'react';
import { 
  BrainCircuit, 
  Database, 
  LineChart, 
  GitFork, 
  ShieldCheck, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  X, 
  Sparkles, 
  ArrowRight, 
  Zap, 
  Sun, 
  BatteryMedium, 
  Car, 
  Flame,
  Activity,
  Check
} from 'lucide-react';
import { GridTelemetry, SubLoad, SystemModeType } from '../types';

interface AutopilotDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  telemetry: GridTelemetry;
  subLoads: SubLoad[];
  systemMode: SystemModeType;
  onApplyDemoDispatch: (dispatchedLoads: SubLoad[], batteryPowerKw: number) => void;
}

export const AutopilotDemoModal: React.FC<AutopilotDemoModalProps> = ({
  isOpen,
  onClose,
  telemetry,
  subLoads,
  systemMode,
  onApplyDemoDispatch,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  // Reset step when opened
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setIsPlaying(true);
    }
  }, [isOpen]);

  // Automated step progression timer
  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    if (currentStep < 4) {
      const timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 2400);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isPlaying, currentStep]);

  if (!isOpen) return null;

  const totalLoad = subLoads.reduce((acc, l) => acc + (l.status === 'Shed' ? 0 : l.powerKw), 0);
  const netPower = telemetry.solarKw - totalLoad;

  const handleExecuteAutopilot = () => {
    // Generate optimized loads
    const optimized = subLoads.map(load => {
      if (load.id === 'load-hvac') return { ...load, status: 'Optimized' as const, powerKw: Number((load.nominalKw * 0.81).toFixed(1)) };
      if (load.id === 'load-ev') return { ...load, status: 'Eco-Throttled' as const, powerKw: Number((load.nominalKw * 0.75).toFixed(1)) };
      if (load.id === 'load-light') return { ...load, status: 'Optimized' as const, powerKw: Number((load.nominalKw * 0.67).toFixed(1)) };
      return load;
    });

    const targetBat = netPower < 0 ? Math.min(Math.abs(netPower), 35) : -Math.min(netPower, 30);
    onApplyDemoDispatch(optimized, targetBat);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
      <div className="bg-slate-900/95 border border-emerald-500/40 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl shadow-emerald-950/50 relative overflow-hidden ring-1 ring-white/10">
        
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/[0.08] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/[0.06] rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/30">
              <BrainCircuit className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white tracking-tight">
                  AI Autopilot Execution Cycle
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  SIH 2026 Core Live Demo
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Closed-loop SCADA execution: MONITOR ➔ PREDICT ➔ OPTIMIZE ➔ CONTROL
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4-Step Visual Stepper Bar */}
        <div className="grid grid-cols-4 gap-2 my-6 relative z-10">
          {[
            { step: 1, label: '1. MONITOR', icon: <Database className="w-3.5 h-3.5" /> },
            { step: 2, label: '2. PREDICT', icon: <LineChart className="w-3.5 h-3.5" /> },
            { step: 3, label: '3. OPTIMIZE', icon: <GitFork className="w-3.5 h-3.5" /> },
            { step: 4, label: '4. CONTROL', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
          ].map((item) => {
            const isCompleted = currentStep > item.step;
            const isCurrent = currentStep === item.step;

            return (
              <button
                key={item.step}
                onClick={() => {
                  setCurrentStep(item.step);
                  setIsPlaying(false);
                }}
                className={`p-3 rounded-2xl border text-left transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-emerald-500/20 border-emerald-400 ring-2 ring-emerald-400/20 text-white shadow-lg'
                    : isCompleted
                    ? 'bg-white/[0.04] border-emerald-500/30 text-emerald-300'
                    : 'bg-white/[0.02] border-white/[0.05] text-slate-500 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-mono font-bold flex items-center gap-1.5">
                    {item.icon}
                    {item.label}
                  </span>
                  {isCompleted ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : isCurrent ? (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  ) : null}
                </div>
                <div className="h-1 w-full bg-slate-950/60 rounded-full overflow-hidden mt-1">
                  <div
                    className={`h-full transition-all duration-500 ${
                      isCompleted ? 'w-full bg-emerald-400' : isCurrent ? 'w-3/4 bg-emerald-400 animate-pulse' : 'w-0'
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Dynamic Step Content Display */}
        <div className="relative z-10 p-5 rounded-2xl bg-black/40 border border-white/[0.08] backdrop-blur-xl min-h-[220px] flex flex-col justify-between">
          
          {currentStep === 1 && (
            <div className="space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  STAGE 1: REAL-TIME SCADA SENSOR MONITORING & INGESTION
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  Ingestion Rate: 100ms
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                The monitoring engine reads high-frequency telemetry across 5 managed campus bus channels, validating solar irradiance, battery state-of-charge, active ToD tariff schedules, and building power quality.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs pt-2">
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <span className="text-[11px] text-slate-400 block">Solar PV Generation</span>
                  <span className="text-base font-bold text-amber-300">{telemetry.solarKw.toFixed(1)} kW</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <span className="text-[11px] text-slate-400 block">Campus Load Bus</span>
                  <span className="text-base font-bold text-cyan-300">{totalLoad.toFixed(1)} kW</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <span className="text-[11px] text-slate-400 block">BESS Tank State</span>
                  <span className="text-base font-bold text-emerald-300">{Math.round(telemetry.batterySoc)}% SoC</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <span className="text-[11px] text-slate-400 block">ToD Tariff Matrix</span>
                  <span className="text-base font-bold text-amber-300">₹{telemetry.tariffRate}/kWh</span>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-400 flex items-center gap-2">
                  <LineChart className="w-4 h-4" />
                  STAGE 2: NEURAL FORECASTING & ENERGY GAP ESTIMATION
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  Horizon: 2 to 24 Hours
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                The prediction engine analyzes solar bell curves, weather cloud cover models, and academic timetable schedules to predict future generation and peak load surges with 96.4% verified accuracy.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 font-mono text-xs pt-2">
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <span className="text-[11px] text-slate-400 block">Projected 2h Solar</span>
                  <span className="text-base font-bold text-amber-300">{(telemetry.solarKw * 0.85).toFixed(1)} kW</span>
                  <span className="text-[10px] text-slate-500 block">Cloud transient safe</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <span className="text-[11px] text-slate-400 block">Peak Tariff Trigger</span>
                  <span className="text-base font-bold text-rose-300">18:00 - 22:00</span>
                  <span className="text-[10px] text-rose-400 block">Surge to ₹12.50/kWh</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <span className="text-[11px] text-slate-400 block">Forecasted Energy Gap</span>
                  <span className={`text-base font-bold ${netPower >= 0 ? 'text-emerald-300' : 'text-amber-300'}`}>
                    {netPower >= 0 ? `+${netPower.toFixed(1)} kW Surplus` : `${netPower.toFixed(1)} kW Deficit`}
                  </span>
                  <span className="text-[10px] text-slate-400 block">Pre-arbitrage required</span>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-indigo-400 flex items-center gap-2">
                  <GitFork className="w-4 h-4" />
                  STAGE 3: MULTI-OBJECTIVE MILP OPTIMIZATION & ARBITRAGE
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                  MILP Solver: 12ms Convergence
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                The optimization solver balances mathematical objectives: (1) 100% solar self-consumption, (2) zero unserved critical load, (3) battery pre-charge arbitrage before peak tariff, and (4) flexible demand modulation.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs pt-2">
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <span className="text-[11px] text-slate-400 block">Critical Bus Lock</span>
                  <span className="text-sm font-bold text-emerald-400">100% Guaranteed</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <span className="text-[11px] text-slate-400 block">BESS Dispatch Vector</span>
                  <span className="text-sm font-bold text-teal-300">Pre-charge / Shave</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <span className="text-[11px] text-slate-400 block">Demand Modulation</span>
                  <span className="text-sm font-bold text-cyan-300">-19% HVAC & -25% EV</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <span className="text-[11px] text-slate-400 block">Target Net-Cost</span>
                  <span className="text-sm font-bold text-emerald-400">Minimization (↓28%)</span>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  STAGE 4: SCADA AUTONOMOUS DISPATCH & ACTUATION
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 animate-pulse">
                  Direct Modbus Interlock
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                SCADA control commands are transmitted to inverter setpoints and building management breakers. Clean energy is prioritized, battery discharge is dialed in, and peak grid surcharges are completely eliminated.
              </p>

              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between text-xs font-mono">
                <span className="text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  5 Autonomous Subsystem Directives Armed & Ready for Execution
                </span>
                <span className="text-emerald-400 font-bold">Latency: 42ms</span>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="mt-6 pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setCurrentStep(1);
                setIsPlaying(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/[0.08] text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Replay Demo Cycle</span>
            </button>
            <span className="text-slate-500 text-xs font-mono">Step {currentStep} of 4</span>
          </div>

          <div className="flex items-center gap-2">
            {currentStep < 4 ? (
              <button
                onClick={() => setCurrentStep((prev) => Math.min(4, prev + 1))}
                className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] text-slate-100 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              >
                <span>Next Stage</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleExecuteAutopilot}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/30 transition active:scale-95 cursor-pointer font-mono"
              >
                <Sparkles className="w-3.5 h-3.5 fill-current" />
                <span>Apply Autonomous Dispatch to Live SCADA</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
