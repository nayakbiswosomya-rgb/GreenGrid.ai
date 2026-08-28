import React from 'react';
import { 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  ShieldAlert, 
  Wrench, 
  PlusCircle,
  Bell,
  Activity
} from 'lucide-react';
import { AlertItem } from '../types';

interface AlertsPanelProps {
  alerts: AlertItem[];
  onResolveAlert: (id: string) => void;
  onSimulateNewAlert: () => void;
  onClearAll: () => void;
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({
  alerts,
  onResolveAlert,
  onSimulateNewAlert,
  onClearAll,
}) => {
  const activeAlerts = alerts.filter((a) => !a.resolved);

  const getSeverityBadge = (severity: AlertItem['severity']) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1">
            <ShieldAlert className="w-3 h-3 text-rose-400" />
            CRITICAL
          </span>
        );
      case 'warning':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            WARNING
          </span>
        );
      case 'info':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-sky-500/20 text-sky-300 border border-sky-500/40 flex items-center gap-1">
            <Info className="w-3 h-3 text-sky-400" />
            TELEMETRY
          </span>
        );
      case 'success':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            OPTIMIZED
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-2xl rounded-3xl p-5 sm:p-7 border border-white/[0.08] shadow-2xl shadow-black/50 relative overflow-hidden ring-1 ring-white/[0.05]">
      
      {/* Ambient background glow */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-amber-500/[0.03] rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-white/[0.08] relative z-10">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
              <Bell className="w-4 h-4 text-amber-400" />
            </div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Microgrid Event & Telemetry Alarm Log
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
              {activeAlerts.length} Active Alarms
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            SCADA fault detection, frequency deviation logs, and autonomous AI mitigation arbitration.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="btn-simulate-alert"
            onClick={onSimulateNewAlert}
            className="px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 border border-white/[0.08] text-xs font-semibold flex items-center gap-1.5 transition backdrop-blur-md shadow-sm active:scale-95 cursor-pointer"
            title="Simulate a new grid anomaly"
          >
            <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Simulate Anomaly</span>
          </button>
          {activeAlerts.length > 0 && (
            <button
              onClick={onClearAll}
              className="text-xs text-slate-400 hover:text-slate-200 font-mono transition px-2 py-1 cursor-pointer"
            >
              Clear Log
            </button>
          )}
        </div>
      </div>

      {/* Alerts list */}
      <div className="space-y-3 relative z-10">
        {activeAlerts.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-white/[0.01] backdrop-blur-md border border-white/[0.04] text-slate-400 text-xs font-mono">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
            ALL MICROGRID PARAMETERS NOMINAL • ZERO ACTIVE FAULTS
          </div>
        ) : (
          activeAlerts.map((alert) => (
            <div 
              key={alert.id}
              className={`p-4 rounded-2xl border transition-all duration-300 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm ${
                alert.severity === 'critical'
                  ? 'bg-rose-950/20 border-rose-500/30'
                  : alert.severity === 'warning'
                  ? 'bg-amber-950/20 border-amber-500/30'
                  : alert.severity === 'success'
                  ? 'bg-emerald-950/20 border-emerald-500/30'
                  : 'bg-white/[0.02] border-white/[0.06]'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {getSeverityBadge(alert.severity)}
                  <h4 className="text-xs font-bold text-slate-100">{alert.title}</h4>
                  <span className="text-[10px] text-slate-400 font-mono">[{alert.code}]</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {alert.description}
                </p>
                <span className="text-[10px] text-slate-400 block font-mono">
                  Timestamp: {alert.timestamp}
                </span>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                <button
                  onClick={() => onResolveAlert(alert.id)}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition backdrop-blur-md shadow-sm cursor-pointer active:scale-95"
                >
                  <Wrench className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{alert.actionLabel || 'Auto-Mitigate'}</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
