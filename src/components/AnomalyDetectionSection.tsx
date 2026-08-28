import React from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Wrench, 
  TrendingUp, 
  Zap, 
  Building,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { CampusBuilding } from '../types';

interface AnomalyDetectionSectionProps {
  buildings: CampusBuilding[];
  onMitigateAnomaly: (buildingId: string) => void;
}

export const AnomalyDetectionSection: React.FC<AnomalyDetectionSectionProps> = ({
  buildings,
  onMitigateAnomaly,
}) => {
  const anomalyBuildings = buildings.filter(b => b.hasAnomaly);

  if (anomalyBuildings.length === 0) {
    return (
      <div className="bg-slate-900/60 backdrop-blur-2xl rounded-3xl p-5 sm:p-6 border border-white/[0.08] shadow-xl text-center">
        <div className="flex items-center justify-center gap-2 text-emerald-400 text-xs font-mono font-bold">
          <CheckCircle2 className="w-4 h-4" />
          <span>ALL CAMPUS CIRCUITS NOMINAL • ZERO ENERGY ANOMALIES ACTIVE</span>
        </div>
      </div>
    );
  }

  const primaryAnomaly = anomalyBuildings[0];

  return (
    <div className="bg-gradient-to-r from-rose-950/40 via-slate-900/90 to-slate-950/90 backdrop-blur-2xl rounded-3xl p-5 sm:p-7 border border-rose-500/40 shadow-2xl shadow-rose-950/30 relative overflow-hidden ring-1 ring-white/[0.06]">
      
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/[0.06] rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-rose-500/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-300">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white tracking-tight uppercase font-mono">
                  Automated Energy Anomaly Diagnostic
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse">
                  CRITICAL OVERCONSUMPTION
                </span>
              </div>
              <p className="text-xs text-slate-400">
                SCADA telemetry detected unexpected baseline deviation exceeding the ±15% standard error band.
              </p>
            </div>
          </div>

          <button
            onClick={() => onMitigateAnomaly(primaryAnomaly.id)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-xs flex items-center gap-2 transition shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer font-mono"
          >
            <Wrench className="w-3.5 h-3.5 fill-current" />
            <span>Apply Automated AI Mitigation</span>
          </button>
        </div>

        {/* Anomaly Highlight Card */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          
          <div className="md:col-span-8 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
              <Building className="w-4 h-4 text-rose-400" />
              <span className="font-bold text-white text-sm">{primaryAnomaly.name}</span>
              <span className="text-slate-400">({primaryAnomaly.type} Facility)</span>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed font-sans bg-black/40 p-3.5 rounded-xl border border-white/[0.06]">
              {primaryAnomaly.anomalyDetails?.diagnosis || "Continuous 10kW baseline spike detected. Suspected central water heater thermostat failure or unmetered kitchen HVAC bypass."}
            </p>

            {/* Metric Comparison Bar */}
            <div className="space-y-1.5 font-mono text-xs">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Expected Baseline: <strong>{primaryAnomaly.anomalyDetails?.expectedKw || primaryAnomaly.nominalLoadKw} kW</strong></span>
                <span className="text-rose-400 font-bold">
                  Actual Telemetry: {primaryAnomaly.currentLoadKw.toFixed(1)} kW (+{primaryAnomaly.anomalyDetails?.deviationPercent || 54}%)
                </span>
              </div>

              {/* Dual Progress Bar */}
              <div className="w-full bg-slate-950/80 rounded-full h-2.5 overflow-hidden border border-white/[0.08] relative">
                <div 
                  className="bg-cyan-400 h-full rounded-full absolute left-0 top-0 opacity-80"
                  style={{ width: `${Math.min(100, ((primaryAnomaly.anomalyDetails?.expectedKw || 18.5) / 35) * 100)}%` }}
                />
                <div 
                  className="bg-rose-500 h-full rounded-full opacity-90"
                  style={{ width: `${Math.min(100, (primaryAnomaly.currentLoadKw / 35) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="md:col-span-4 p-4 rounded-xl bg-black/40 border border-white/[0.06] text-xs font-mono space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Financial Impact:</span>
              <span className="font-bold text-rose-300">~₹140 / hr Waste</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Carbon Waste:</span>
              <span className="font-bold text-rose-300">+8.2 kg CO₂/hr</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Mitigation:</span>
              <span className="font-bold text-emerald-400">Modbus Circuit Shedding</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
