import React, { useState } from 'react';
import { 
  Sparkles, 
  Sun, 
  CloudSun, 
  CloudRain, 
  Flame, 
  ZapOff, 
  BatteryLow, 
  IndianRupee, 
  TrendingDown, 
  TrendingUp, 
  ShieldCheck, 
  Leaf, 
  Zap, 
  ArrowRight,
  Sliders,
  CheckCircle2,
  Play,
  GraduationCap,
  School,
  Home,
  Cpu,
  BatteryCharging
} from 'lucide-react';
import { ScenarioPreset, WeatherCondition, SystemModeType } from '../types';

interface WhatIfSimulatorProps {
  scenarios: ScenarioPreset[];
  onApplyScenarioToLive: (scenario: ScenarioPreset) => void;
}

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({
  scenarios,
  onApplyScenarioToLive,
}) => {
  const [activeScenarioId, setActiveScenarioId] = useState<string>(scenarios[0]?.id || 'sc-hostel-shift');

  const activeScenario = scenarios.find(s => s.id === activeScenarioId) || scenarios[0];

  const getScenarioIcon = (iconName: string) => {
    switch (iconName) {
      case 'GraduationCap': return <GraduationCap className="w-4 h-4 text-cyan-400" />;
      case 'Sun': return <Sun className="w-4 h-4 text-amber-400" />;
      case 'CloudSun': return <CloudSun className="w-4 h-4 text-sky-400" />;
      case 'CloudRain': return <CloudRain className="w-4 h-4 text-indigo-400" />;
      case 'Flame': return <Flame className="w-4 h-4 text-rose-400" />;
      case 'ZapOff': return <ZapOff className="w-4 h-4 text-rose-400" />;
      case 'BatteryLow': return <BatteryLow className="w-4 h-4 text-amber-400" />;
      case 'IndianRupee': return <IndianRupee className="w-4 h-4 text-emerald-400" />;
      default: return <Sparkles className="w-4 h-4 text-emerald-400" />;
    }
  };

  const isHostelShiftScenario = activeScenario.id === 'sc-hostel-shift';

  return (
    <div className="bg-slate-900/70 backdrop-blur-2xl rounded-3xl p-5 sm:p-7 border border-white/[0.08] shadow-2xl shadow-black/50 relative overflow-hidden ring-1 ring-white/[0.06]">
      
      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-indigo-500/[0.05] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-emerald-500/[0.05] rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-white/[0.08] relative z-10">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-indigo-400" />
            </div>
            <h2 className="text-base font-bold text-white tracking-tight">
              What-If Contingency & Predictive Demand Dispatch Simulator
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
              Interactive AI Stress-Testing
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
              SIMULATED / ESTIMATED
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Simulate dynamic campus transitions (e.g. 8:00 AM hostel-to-class migrations), grid outages, and weather changes to evaluate GreenGrid AI predictive dispatch.
          </p>
        </div>

        <button
          onClick={() => onApplyScenarioToLive(activeScenario)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-xs flex items-center gap-2 transition shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer font-mono"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Apply to Live SCADA Feed</span>
        </button>
      </div>

      {/* Scenario Selection Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 mb-6 relative z-10">
        {scenarios.map((scenario) => {
          const isSelected = scenario.id === activeScenarioId;

          return (
            <button
              key={scenario.id}
              onClick={() => setActiveScenarioId(scenario.id)}
              className={`p-3 rounded-2xl border text-left transition-all duration-300 cursor-pointer backdrop-blur-md flex flex-col justify-between ${
                isSelected
                  ? 'bg-gradient-to-b from-slate-800 to-slate-900 border-emerald-400/60 ring-2 ring-emerald-400/20 shadow-lg shadow-emerald-950/30'
                  : 'bg-white/[0.02] hover:bg-white/[0.05] border-white/[0.07] hover:border-white/[0.15]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                  isSelected ? 'bg-emerald-500/20' : 'bg-white/[0.04]'
                }`}>
                  {getScenarioIcon(scenario.icon)}
                </div>
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                )}
              </div>

              <div>
                <div className="font-bold text-xs text-white leading-tight">
                  {scenario.name}
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">
                  {scenario.solarKw} kW Solar
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Predictive Shift Pipeline Visualizer (Especially active for 8AM Shift) */}
      {isHostelShiftScenario && (
        <div className="mb-6 p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 backdrop-blur-xl relative z-10">
          <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-cyan-500/20 flex-wrap">
            <span className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-cyan-400" />
              PREDICTIVE CAMPUS SHIFTING PIPELINE: 08:00 AM MIGRATION
            </span>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-200 border border-cyan-500/40">
              Autonomous Demand Shifting
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs font-mono">
            
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.06]">
              <span className="text-[10px] text-slate-400 block uppercase">1. Monitor Demand</span>
              <div className="mt-1 flex items-center justify-between text-slate-200">
                <span className="flex items-center gap-1 text-blue-300"><Home className="w-3 h-3" /> Hostels</span>
                <span className="font-bold text-amber-400">8.0 kW → 2.0 kW</span>
              </div>
              <span className="text-[9px] text-slate-500 block mt-0.5">Students leave rooms</span>
            </div>

            <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.06]">
              <span className="text-[10px] text-slate-400 block uppercase">2. Predict Surge</span>
              <div className="mt-1 flex items-center justify-between text-slate-200">
                <span className="flex items-center gap-1 text-cyan-300"><School className="w-3 h-3" /> Academic</span>
                <span className="font-bold text-cyan-400">3.0 kW → 10.0 kW</span>
              </div>
              <span className="text-[9px] text-slate-500 block mt-0.5">Classes & Labs ignite</span>
            </div>

            <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.06]">
              <span className="text-[10px] text-slate-400 block uppercase">3. Optimize Routing</span>
              <div className="mt-1 flex items-center justify-between text-slate-200">
                <span className="flex items-center gap-1 text-emerald-300"><Cpu className="w-3 h-3" /> Solar Shift</span>
                <span className="font-bold text-emerald-400">+16.3 kW Reallocated</span>
              </div>
              <span className="text-[9px] text-slate-500 block mt-0.5">Priority to Computing & Lab</span>
            </div>

            <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.06]">
              <span className="text-[10px] text-slate-400 block uppercase">4. Battery Storage</span>
              <div className="mt-1 flex items-center justify-between text-slate-200">
                <span className="flex items-center gap-1 text-amber-300"><BatteryCharging className="w-3 h-3" /> BESS</span>
                <span className="font-bold text-amber-400">+7.5 kW Charge</span>
              </div>
              <span className="text-[9px] text-slate-500 block mt-0.5">Genuine surplus stored</span>
            </div>

            <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.06]">
              <span className="text-[10px] text-slate-400 block uppercase">5. Grid Reduction</span>
              <div className="mt-1 flex items-center justify-between text-slate-200">
                <span className="flex items-center gap-1 text-teal-300"><Zap className="w-3 h-3" /> Grid Draw</span>
                <span className="font-bold text-teal-300">0.0 kW (Zero Draw)</span>
              </div>
              <span className="text-[9px] text-slate-500 block mt-0.5">₹0 Grid penalty fees</span>
            </div>

          </div>
        </div>
      )}

      {/* Main Comparison Section: WITHOUT AI vs WITH AI */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 relative z-10">
        
        {/* Left: WITHOUT AI (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-rose-950/20 border border-rose-500/30 backdrop-blur-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-rose-400" />
                Conventional Dispatch (Without AI)
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                UNOPTIMIZED
              </span>
            </div>

            <p className="text-xs text-slate-300 mb-4 font-sans leading-relaxed">
              Standard rigid timer-based schedules without occupancy awareness: surplus clean solar at vacant hostels goes wasted/curtailed while academic blocks pull expensive grid energy.
            </p>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-black/40 border border-white/[0.05] flex justify-between items-center">
                <span className="text-slate-400">⚡ Grid Dependency:</span>
                <span className="font-bold text-rose-300 text-sm">
                  {activeScenario.withoutAi.gridDependencyPercent}% (Higher)
                </span>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/[0.05] flex justify-between items-center">
                <span className="text-slate-400">💰 Hourly Operating Cost:</span>
                <span className="font-bold text-rose-300 text-sm">
                  ₹{activeScenario.withoutAi.hourlyCostInr.toLocaleString('en-IN')}/hr
                </span>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/[0.05] flex justify-between items-center">
                <span className="text-slate-400">🌱 Clean Energy Waste:</span>
                <span className="font-bold text-rose-300 text-sm">
                  18.6 kWh / hr (Curtailed)
                </span>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/[0.05] flex justify-between items-center">
                <span className="text-slate-400">♻️ Renewable Utilization:</span>
                <span className="font-bold text-amber-300 text-sm">
                  52.4% (Lower)
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-rose-500/20 text-[11px] font-mono text-rose-300 flex items-center justify-between">
            <span>Hostel energy surplus wasted / unredirected.</span>
            <span className="text-[10px] text-slate-500">SIMULATED / ESTIMATED</span>
          </div>
        </div>

        {/* Right: WITH GREEN GRID AI (7 cols) */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-gradient-to-b from-emerald-950/40 to-slate-900/90 border border-emerald-500/40 backdrop-blur-xl flex flex-col justify-between shadow-xl shadow-emerald-950/20">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-300">
                  GreenGrid AI Autonomous Optimizer
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                PROACTIVE ALLOCATION
              </span>
            </div>

            {/* AI Recommendation Strategy */}
            <div className="p-3.5 rounded-xl bg-black/40 border border-emerald-500/30 text-xs text-slate-200 mb-4 font-sans">
              <span className="text-emerald-400 font-bold font-mono text-[11px] block mb-0.5">
                Predictive Energy Shift Directive:
              </span>
              <p className="leading-relaxed">{activeScenario.withAi.recommendation}</p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              
              <div className="p-3 rounded-xl bg-black/40 border border-white/[0.05]">
                <span className="text-slate-400 text-[11px] block flex items-center gap-1">
                  ♻️ Renewable Utilization
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-lg font-bold text-emerald-300">
                    96.8%
                  </span>
                  <span className="text-[10px] text-emerald-400">
                    (↑ +44.4%)
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/[0.05]">
                <span className="text-slate-400 text-[11px] block flex items-center gap-1">
                  ⚡ Grid Dependency
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-lg font-bold text-emerald-300">
                    {activeScenario.withAi.gridDependencyPercent}%
                  </span>
                  <span className="text-[10px] text-emerald-400">
                    (↓ {activeScenario.withoutAi.gridDependencyPercent - activeScenario.withAi.gridDependencyPercent}%)
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/[0.05]">
                <span className="text-slate-400 text-[11px] block flex items-center gap-1">
                  💰 Energy Cost
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-lg font-bold text-emerald-400">
                    ₹{activeScenario.withAi.hourlyCostInr.toLocaleString('en-IN')}/hr
                  </span>
                  <span className="text-[10px] text-emerald-300">
                    (Save ₹{activeScenario.withAi.estimatedSavingsInr})
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/[0.05]">
                <span className="text-slate-400 text-[11px] block flex items-center gap-1">
                  🌱 Energy Waste
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-lg font-bold text-teal-300">
                    0.2 kWh
                  </span>
                  <span className="text-[10px] text-teal-400">(↓ -98.9%)</span>
                </div>
              </div>

            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-emerald-500/20 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Surplus Stored or Reallocated to High-Demand Academic Nodes
            </span>
            <span className="text-amber-400/80 font-bold">SIMULATED / ESTIMATED</span>
          </div>

        </div>

      </div>

    </div>
  );
};
