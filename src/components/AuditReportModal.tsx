import React from 'react';
import { 
  X, 
  FileText, 
  Download, 
  CheckCircle2, 
  IndianRupee, 
  Leaf, 
  Sun, 
  Zap, 
  Battery
} from 'lucide-react';
import { GreenGridLogo } from './GreenGridLogo';
import { GridTelemetry, SubLoad } from '../types';

interface AuditReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  telemetry: GridTelemetry;
  subLoads: SubLoad[];
}

export const AuditReportModal: React.FC<AuditReportModalProps> = ({
  isOpen,
  onClose,
  telemetry,
  subLoads,
}) => {
  if (!isOpen) return null;

  const downloadCSV = () => {
    const rows = [
      ['Metric', 'Value', 'Unit'],
      ['Solar PV Generation', telemetry.dailySolarKwh.toFixed(1), 'kWh'],
      ['Total Energy Consumed', telemetry.dailyConsumedKwh.toFixed(1), 'kWh'],
      ['Net-Metering Exported', telemetry.dailyExportedKwh.toFixed(1), 'kWh'],
      ['Financial Savings', telemetry.dailySavedInr.toFixed(0), 'INR (₹)'],
      ['Carbon Offset Avoided', telemetry.co2OffsetKg.toFixed(1), 'kg CO2e'],
      ['Battery SoC', `${Math.round(telemetry.batterySoc)}%`, 'Percent'],
      ['Grid Frequency', `${telemetry.gridFrequency.toFixed(2)}`, 'Hz'],
      ['Grid Voltage', `${telemetry.gridVoltage.toFixed(1)}`, 'V'],
      ...subLoads.map((l) => [`Sub-Load: ${l.name}`, l.powerKw.toFixed(1), 'kW']),
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `GreenGridAI_Audit_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-2xl overflow-y-auto">
      <div className="relative w-full max-w-2xl my-8 bg-slate-900/90 backdrop-blur-2xl border border-white/[0.12] rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 ring-1 ring-white/[0.08]">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-slate-200 border border-white/[0.08] transition backdrop-blur-md cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-white/[0.08]">
          <GreenGridLogo size={42} />
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span>Microgrid Performance Audit & Carbon Accounting Report</span>
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              GreenGrid.ai SCADA Verification Log • {new Date().toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Audit Metrics Summary Grid */}
        <div className="space-y-4 text-xs">
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/[0.06]">
              <span className="text-slate-400 block mb-1 flex items-center gap-1.5 font-mono text-[11px]">
                <Sun className="w-3.5 h-3.5 text-amber-400" /> Daily Solar Yield
              </span>
              <strong className="text-white text-sm font-bold font-mono">{telemetry.dailySolarKwh.toFixed(1)} kWh</strong>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/[0.06]">
              <span className="text-slate-400 block mb-1 flex items-center gap-1.5 font-mono text-[11px]">
                <Zap className="w-3.5 h-3.5 text-cyan-400" /> Total Load Served
              </span>
              <strong className="text-white text-sm font-bold font-mono">{telemetry.dailyConsumedKwh.toFixed(1)} kWh</strong>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/[0.06]">
              <span className="text-slate-400 block mb-1 flex items-center gap-1.5 font-mono text-[11px]">
                <IndianRupee className="w-3.5 h-3.5 text-emerald-400" /> Financial Value Saved
              </span>
              <strong className="text-emerald-400 text-sm font-bold font-mono">₹{telemetry.dailySavedInr.toLocaleString('en-IN')}</strong>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/[0.06]">
              <span className="text-slate-400 block mb-1 flex items-center gap-1.5 font-mono text-[11px]">
                <Leaf className="w-3.5 h-3.5 text-teal-400" /> Net Carbon Offset
              </span>
              <strong className="text-teal-300 text-sm font-bold font-mono">{telemetry.co2OffsetKg.toFixed(1)} kg CO₂e</strong>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/[0.06]">
              <span className="text-slate-400 block mb-1 flex items-center gap-1.5 font-mono text-[11px]">
                <Battery className="w-3.5 h-3.5 text-emerald-400" /> Storage Capacity
              </span>
              <strong className="text-white text-sm font-bold font-mono">{telemetry.batteryCapacityKwh} kWh</strong>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/[0.06]">
              <span className="text-slate-400 block mb-1 flex items-center gap-1.5 font-mono text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" /> Grid Compliance
              </span>
              <strong className="text-indigo-300 text-sm font-bold font-mono">CEA 50Hz Std</strong>
            </div>
          </div>

          {/* Sub Loads Breakdown Table */}
          <div className="pt-2">
            <h4 className="font-bold text-slate-300 mb-2.5">Demand Breakdown by Managed Zone:</h4>
            <div className="rounded-2xl border border-white/[0.08] overflow-hidden backdrop-blur-md">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/[0.04] text-slate-400 border-b border-white/[0.08] font-mono text-[11px]">
                  <tr>
                    <th className="p-3">Zone / Equipment</th>
                    <th className="p-3">Priority</th>
                    <th className="p-3">Active Demand</th>
                    <th className="p-3">Optimization Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04] text-slate-200 font-mono">
                  {subLoads.map((l) => (
                    <tr key={l.id} className="bg-white/[0.01] hover:bg-white/[0.04] transition">
                      <td className="p-3 font-sans font-medium text-slate-100">{l.name}</td>
                      <td className="p-3 text-slate-400">{l.priority}</td>
                      <td className="p-3 font-bold text-cyan-300">{l.status === 'Shed' ? '0.0 kW (Shed)' : `${l.powerKw.toFixed(1)} kW`}</td>
                      <td className="p-3">
                        <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-semibold ${
                          l.status === 'Shed' 
                            ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30' 
                            : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                        }`}>
                          {l.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="mt-6 pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={downloadCSV}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV Report</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 text-xs font-semibold transition backdrop-blur-md cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
