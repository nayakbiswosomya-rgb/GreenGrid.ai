import React from 'react';
import { 
  Sliders, 
  Cpu, 
  Flame, 
  Car, 
  Server, 
  Lightbulb, 
  ShieldCheck, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { SubLoad } from '../types';

interface SmartLoadControllerProps {
  subLoads: SubLoad[];
  onUpdateLoad: (id: string, newKw: number) => void;
  onToggleStatus: (id: string) => void;
  onTriggerDemandResponse: () => void;
  onSimulateEvSurge: () => void;
  onResetLoads: () => void;
}

export const SmartLoadController: React.FC<SmartLoadControllerProps> = ({
  subLoads,
  onUpdateLoad,
  onToggleStatus,
  onTriggerDemandResponse,
  onSimulateEvSurge,
  onResetLoads,
}) => {
  const totalLoad = subLoads.reduce((acc, l) => acc + (l.status === 'Shed' ? 0 : l.powerKw), 0);

  const getCategoryIcon = (category: SubLoad['category']) => {
    switch (category) {
      case 'Industrial / Manufacturing':
        return <Cpu className="w-4 h-4 text-cyan-400" />;
      case 'HVAC & Climate':
        return <Flame className="w-4 h-4 text-amber-400" />;
      case 'EV Charging Hub':
        return <Car className="w-4 h-4 text-emerald-400" />;
      case 'Essential Data Center':
        return <Server className="w-4 h-4 text-indigo-400" />;
      case 'Smart Lighting':
        return <Lightbulb className="w-4 h-4 text-yellow-400" />;
    }
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-2xl rounded-3xl p-5 sm:p-7 border border-white/[0.08] shadow-2xl shadow-black/50 relative overflow-hidden ring-1 ring-white/[0.05]">
      
      {/* Ambient background glow */}
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-cyan-500/[0.04] rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-white/[0.08] relative z-10">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
              <Sliders className="w-4 h-4 text-cyan-400" />
            </div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Dynamic Demand-Side Flexibility & Sub-Load Controller
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
              5 Managed Busses
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time telemetry, automated load shedding, and flexible demand response orchestration.
          </p>
        </div>

        {/* Quick Simulation Trigger Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            id="btn-demand-response"
            onClick={onTriggerDemandResponse}
            className="px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition backdrop-blur-md shadow-sm active:scale-95 cursor-pointer"
            title="Auto-shed non-critical loads to shave grid peak"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Demand-Response (Shed 20%)</span>
          </button>
          
          <button
            id="btn-ev-surge"
            onClick={onSimulateEvSurge}
            className="px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition backdrop-blur-md shadow-sm active:scale-95 cursor-pointer"
            title="Simulate sudden EV fleet arrival"
          >
            <Car className="w-3.5 h-3.5 text-amber-400" />
            <span>+30 kW EV Surge</span>
          </button>

          <button
            id="btn-reset-loads"
            onClick={onResetLoads}
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/[0.08] transition backdrop-blur-md shadow-sm active:scale-95 cursor-pointer"
            title="Reset to baseline nominal load"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sub Loads List */}
      <div className="space-y-3 relative z-10">
        {subLoads.map((load) => {
          const isShed = load.status === 'Shed';
          const isOptimized = load.status === 'Optimized' || load.status === 'Eco-Throttled';

          return (
            <div 
              key={load.id}
              className={`p-4 rounded-2xl border transition-all duration-300 backdrop-blur-lg ${
                isShed
                  ? 'bg-white/[0.01] border-white/[0.04] opacity-50'
                  : 'bg-white/[0.02] border-white/[0.07] hover:border-white/[0.15] shadow-sm'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center shadow-inner">
                    {getCategoryIcon(load.category)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-100">{load.name}</h4>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold border ${
                        load.priority === 'Critical'
                          ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                          : load.priority === 'Flexible'
                          ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                          : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                      }`}>
                        {load.priority}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">
                      Nominal: {load.nominalKw} kW • {load.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-cyan-300">
                      {isShed ? '0.0 kW' : `${load.powerKw.toFixed(1)} kW`}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 block">
                      Status: <strong className={isShed ? 'text-rose-400' : isOptimized ? 'text-emerald-400' : 'text-slate-200'}>{load.status}</strong>
                    </span>
                  </div>

                  {load.controllable && (
                    <button
                      onClick={() => onToggleStatus(load.id)}
                      className={`px-3 py-1 rounded-xl text-[11px] font-semibold transition border backdrop-blur-md cursor-pointer ${
                        isShed
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30 shadow-sm'
                          : 'bg-white/[0.04] text-slate-200 border-white/[0.08] hover:bg-white/[0.08] shadow-sm'
                      }`}
                    >
                      {isShed ? 'Restore Bus' : 'Shed Load'}
                    </button>
                  )}
                </div>
              </div>

              {/* Slider for controllable loads */}
              {load.controllable && !isShed && (
                <div className="mt-2.5 flex items-center gap-3 pt-2.5 border-t border-white/[0.04]">
                  <span className="text-[11px] font-mono text-slate-400 w-14">Throttle:</span>
                  <input
                    type="range"
                    min="5"
                    max={load.nominalKw * 1.5}
                    step="1"
                    value={load.powerKw}
                    onChange={(e) => onUpdateLoad(load.id, parseFloat(e.target.value))}
                    className="flex-1 h-1.5 bg-slate-950/80 rounded-lg appearance-none cursor-pointer accent-cyan-400 border border-white/[0.06]"
                  />
                  <span className="text-xs font-mono font-bold text-slate-200 w-14 text-right">
                    {load.powerKw} kW
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Aggregate load summary */}
      <div className="mt-5 pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs text-slate-300 relative z-10 font-mono">
        <span>Aggregate Active Demand: <strong className="text-cyan-300 font-bold text-sm">{totalLoad.toFixed(1)} kW</strong></span>
        <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Grid Frequency Safe (50.02 Hz)
        </span>
      </div>

    </div>
  );
};
