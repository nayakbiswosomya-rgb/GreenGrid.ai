import React from 'react';
import { 
  X, 
  Sun, 
  BatteryCharging, 
  Zap, 
  Globe 
} from 'lucide-react';
import { GridTelemetry } from '../types';

interface NodeInspectorModalProps {
  selectedNode: 'solar' | 'load' | 'battery' | 'grid' | null;
  onClose: () => void;
  telemetry: GridTelemetry;
  onUpdateSolarRating?: (val: number) => void;
  onUpdateBatterySoc?: (val: number) => void;
}

export const NodeInspectorModal: React.FC<NodeInspectorModalProps> = ({
  selectedNode,
  onClose,
  telemetry,
  onUpdateSolarRating,
  onUpdateBatterySoc,
}) => {
  if (!selectedNode) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-2xl overflow-y-auto">
      <div className="relative w-full max-w-lg my-8 bg-slate-900/90 backdrop-blur-2xl border border-white/[0.12] rounded-3xl p-6 sm:p-7 shadow-2xl text-slate-100 ring-1 ring-white/[0.08]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-slate-200 border border-white/[0.08] transition backdrop-blur-md cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Node Details based on selected type */}
        {selectedNode === 'solar' && (
          <div>
            <div className="flex items-center gap-3.5 mb-5">
              <div className="w-11 h-11 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/30 text-amber-400">
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">Solar PV Array Sub-System</h3>
                <p className="text-xs text-slate-400 font-mono">150 kWp Bifacial PV • MPPT String Inverters</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs mb-4">
              <div className="p-3.5 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/[0.06]">
                <span className="text-slate-400 block font-mono text-[11px]">Instantaneous Output</span>
                <strong className="text-base text-amber-400 font-mono font-bold">{telemetry.solarKw.toFixed(1)} kW</strong>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/[0.06]">
                <span className="text-slate-400 block font-mono text-[11px]">Solar Irradiance</span>
                <strong className="text-base text-slate-100 font-mono font-bold">{telemetry.irradiance} W/m²</strong>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/[0.06]">
                <span className="text-slate-400 block font-mono text-[11px]">Panel Cell Temp</span>
                <strong className="text-base text-slate-100 font-mono font-bold">{telemetry.temperature + 12}°C</strong>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/[0.06]">
                <span className="text-slate-400 block font-mono text-[11px]">Inverter Efficiency</span>
                <strong className="text-base text-emerald-400 font-mono font-bold">98.4% (Euro Std)</strong>
              </div>
            </div>

            {onUpdateSolarRating && (
              <div className="p-4 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/[0.06] text-xs">
                <div className="flex justify-between mb-2 font-mono">
                  <span className="text-slate-300 font-medium">Simulate Irradiance Override:</span>
                  <span className="text-amber-400 font-bold">{telemetry.solarKw.toFixed(0)} kW</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="150"
                  step="5"
                  value={telemetry.solarKw}
                  onChange={(e) => onUpdateSolarRating(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-950/80 rounded-lg appearance-none cursor-pointer accent-amber-400 border border-white/[0.06]"
                />
              </div>
            )}
          </div>
        )}

        {selectedNode === 'battery' && (
          <div>
            <div className="flex items-center gap-3.5 mb-5">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/30 text-emerald-400">
                <BatteryCharging className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">BESS (Battery Energy Storage)</h3>
                <p className="text-xs text-slate-400 font-mono">250 kWh LiFePO4 Chemistry • Liquid Cooled ESS</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs mb-4">
              <div className="p-3.5 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/[0.06]">
                <span className="text-slate-400 block font-mono text-[11px]">State of Charge (SoC)</span>
                <strong className="text-base text-emerald-400 font-mono font-bold">{Math.round(telemetry.batterySoc)}%</strong>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/[0.06]">
                <span className="text-slate-400 block font-mono text-[11px]">State of Health (SoH)</span>
                <strong className="text-base text-slate-100 font-mono font-bold">{telemetry.batterySoH}%</strong>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/[0.06]">
                <span className="text-slate-400 block font-mono text-[11px]">Active Flow Vector</span>
                <strong className="text-base text-slate-100 font-mono font-bold">
                  {telemetry.batteryPowerKw > 0 ? `-${telemetry.batteryPowerKw.toFixed(1)} kW (Discharge)` : `+${Math.abs(telemetry.batteryPowerKw).toFixed(1)} kW (Charge)`}
                </strong>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/[0.06]">
                <span className="text-slate-400 block font-mono text-[11px]">Cycle Life Counter</span>
                <strong className="text-base text-slate-100 font-mono font-bold">428 / 6000</strong>
              </div>
            </div>

            {onUpdateBatterySoc && (
              <div className="p-4 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/[0.06] text-xs">
                <div className="flex justify-between mb-2 font-mono">
                  <span className="text-slate-300 font-medium">Simulate Battery SoC Override:</span>
                  <span className="text-emerald-400 font-bold">{Math.round(telemetry.batterySoc)}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="1"
                  value={telemetry.batterySoc}
                  onChange={(e) => onUpdateBatterySoc(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-950/80 rounded-lg appearance-none cursor-pointer accent-emerald-400 border border-white/[0.06]"
                />
              </div>
            )}
          </div>
        )}

        {selectedNode === 'load' && (
          <div>
            <div className="flex items-center gap-3.5 mb-5">
              <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/30 text-cyan-400">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">Facility Demand Telemetry</h3>
                <p className="text-xs text-slate-400 font-mono">Total Synchronized Load • 5 Monitored Sub-Buses</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs mb-4">
              <div className="p-3.5 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/[0.06]">
                <span className="text-slate-400 block font-mono text-[11px]">Total Active Load</span>
                <strong className="text-base text-cyan-400 font-mono font-bold">{telemetry.loadKw.toFixed(1)} kW</strong>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/[0.06]">
                <span className="text-slate-400 block font-mono text-[11px]">Power Factor</span>
                <strong className="text-base text-emerald-400 font-mono font-bold">0.98 Lagging</strong>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/[0.06]">
                <span className="text-slate-400 block font-mono text-[11px]">Daily Energy Total</span>
                <strong className="text-base text-slate-100 font-mono font-bold">{telemetry.dailyConsumedKwh.toFixed(1)} kWh</strong>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/[0.06]">
                <span className="text-slate-400 block font-mono text-[11px]">Peak Shaving Status</span>
                <strong className="text-base text-emerald-400 font-mono font-bold">Active (Cap: 140 kW)</strong>
              </div>
            </div>
          </div>
        )}

        {selectedNode === 'grid' && (
          <div>
            <div className="flex items-center gap-3.5 mb-5">
              <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/30 text-indigo-400">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">Utility Grid Interconnection</h3>
                <p className="text-xs text-slate-400 font-mono">11 kV / 415 V Step-Down • Bi-Directional Net-Meter</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs mb-4">
              <div className="p-3.5 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/[0.06]">
                <span className="text-slate-400 block font-mono text-[11px]">Grid Frequency</span>
                <strong className="text-base text-slate-100 font-mono font-bold">{telemetry.gridFrequency.toFixed(2)} Hz</strong>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/[0.06]">
                <span className="text-slate-400 block font-mono text-[11px]">3-Phase RMS Voltage</span>
                <strong className="text-base text-slate-100 font-mono font-bold">{telemetry.gridVoltage.toFixed(1)} V</strong>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/[0.06]">
                <span className="text-slate-400 block font-mono text-[11px]">Time-of-Day Tariff</span>
                <strong className="text-base text-amber-400 font-mono font-bold">₹{telemetry.tariffRate}/kWh</strong>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/[0.06]">
                <span className="text-slate-400 block font-mono text-[11px]">Net Exchange Vector</span>
                <strong className="text-base text-slate-100 font-mono font-bold">
                  {telemetry.gridKw < 0 ? `Exporting ${Math.abs(telemetry.gridKw).toFixed(1)} kW` : `Importing ${telemetry.gridKw.toFixed(1)} kW`}
                </strong>
              </div>
            </div>
          </div>
        )}

        <div className="mt-5 pt-4 border-t border-white/[0.08] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 text-xs font-semibold transition backdrop-blur-md cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
