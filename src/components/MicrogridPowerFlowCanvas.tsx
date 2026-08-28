import React from 'react';
import { 
  Sun, 
  BatteryCharging, 
  BatteryMedium,
  Zap, 
  Globe, 
  Cpu, 
  Shield,
  Layers,
  Activity,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  RefreshCw,
  Gauge,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { GridTelemetry, SystemModeType } from '../types';

interface MicrogridPowerFlowCanvasProps {
  telemetry: GridTelemetry;
  systemMode: SystemModeType;
  selectedNode: 'solar' | 'load' | 'battery' | 'grid' | null;
  onSelectNode: (node: 'solar' | 'load' | 'battery' | 'grid' | null) => void;
  onIsolateGrid: () => void;
}

export const MicrogridPowerFlowCanvas: React.FC<MicrogridPowerFlowCanvasProps> = ({
  telemetry,
  systemMode,
  selectedNode,
  onSelectNode,
  onIsolateGrid,
}) => {
  const netPower = telemetry.solarKw - telemetry.loadKw;
  const isExporting = telemetry.gridKw < -0.1;
  const isImporting = telemetry.gridKw > 0.1;
  const isIslanded = telemetry.gridStatus === 'Islanded (Outage)';
  const isBatteryCharging = telemetry.batteryPowerKw < -0.1;
  const isBatteryDischarging = telemetry.batteryPowerKw > 0.1;
  const hasSolar = telemetry.solarKw > 1;

  // Energy flow animation speeds based on power magnitude
  const solarFlowSpeed = hasSolar ? Math.max(0.6, 2.5 - (telemetry.solarKw / 150) * 1.8) : 0;
  const batteryFlowSpeed = (isBatteryCharging || isBatteryDischarging) ? Math.max(0.6, 2.5 - (Math.abs(telemetry.batteryPowerKw) / 50) * 1.8) : 0;
  const loadFlowSpeed = Math.max(0.6, 2.5 - (telemetry.loadKw / 150) * 1.8);
  const gridFlowSpeed = (isExporting || isImporting) ? Math.max(0.6, 2.5 - (Math.abs(telemetry.gridKw) / 50) * 1.8) : 0;

  return (
    <div className="bg-slate-900/70 backdrop-blur-2xl rounded-3xl p-5 sm:p-7 border border-white/[0.08] shadow-2xl shadow-black/50 relative overflow-hidden ring-1 ring-white/[0.06]">
      
      {/* Background radial energy ambient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-emerald-500/[0.05] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-amber-500/[0.04] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/[0.04] rounded-full blur-3xl pointer-events-none" />

      {/* Header & Status Indicator */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-white/[0.08] relative z-10">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <Layers className="w-4 h-4 text-emerald-400" />
            </div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Live Microgrid Energy Flow Topology
            </h2>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Sub-Second Bus
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Dynamic power dispatch connecting generation, BESS storage, campus loads, and net-metering grid interlock.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="btn-island-microgrid"
            onClick={onIsolateGrid}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition backdrop-blur-md cursor-pointer border active:scale-95 ${
              isIslanded
                ? 'bg-rose-500/20 text-rose-200 border-rose-500/40 hover:bg-rose-500/30 shadow-lg shadow-rose-950/30'
                : 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 border-white/[0.08] shadow-sm'
            }`}
            title="Toggle Microgrid Islanding (Black-Start & Outage Mode)"
          >
            <Shield className={`w-3.5 h-3.5 ${isIslanded ? 'text-rose-400' : 'text-amber-400'}`} />
            <span>{isIslanded ? 'Re-synchronize with Utility Grid' : 'Simulate Grid Outage (Island)'}</span>
          </button>
        </div>
      </div>

      {/* Main Flow Canvas Topology: SOLAR -> AI HUB -> LOADS, BATTERY, GRID */}
      <div className="relative py-3 z-10">
        
        {/* Live Power Transfer Routing Ribbon */}
        <div className="mb-4 p-3.5 rounded-2xl bg-black/40 border border-white/[0.08] backdrop-blur-xl flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 text-[10px] uppercase tracking-wider flex items-center gap-1">
              <RefreshCw className="w-3 h-3 animate-spin text-emerald-400" />
              Active Energy Routing
            </span>
            <span className="text-slate-300">
              {hasSolar && (
                <span className="inline-flex items-center gap-1 text-amber-300 font-bold">
                  <Sun className="w-3.5 h-3.5 inline" /> {telemetry.solarKw.toFixed(1)} kW Solar
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 inline" />
                </span>
              )}
              {isBatteryDischarging && (
                <span className="inline-flex items-center gap-1 text-emerald-300 font-bold ml-1">
                  <BatteryMedium className="w-3.5 h-3.5 inline" /> +{Math.abs(telemetry.batteryPowerKw).toFixed(1)} kW Battery
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 inline" />
                </span>
              )}
              {isImporting && (
                <span className="inline-flex items-center gap-1 text-indigo-300 font-bold ml-1">
                  <Globe className="w-3.5 h-3.5 inline" /> +{telemetry.gridKw.toFixed(1)} kW Grid
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 inline" />
                </span>
              )}
              <span className="text-slate-400 mx-1.5">➔ <strong>[AI Dispatch Core]</strong> ➔</span>
              <span className="inline-flex items-center gap-1 text-cyan-300 font-bold">
                <Zap className="w-3.5 h-3.5 inline" /> {telemetry.loadKw.toFixed(1)} kW Campus Loads
              </span>
              {isBatteryCharging && (
                <span className="inline-flex items-center gap-1 text-emerald-400 font-bold ml-1.5">
                  + <BatteryCharging className="w-3.5 h-3.5 inline" /> {Math.abs(telemetry.batteryPowerKw).toFixed(1)} kW Surplus to BESS
                </span>
              )}
              {isExporting && (
                <span className="inline-flex items-center gap-1 text-emerald-300 font-bold ml-1.5">
                  + <Globe className="w-3.5 h-3.5 inline" /> {Math.abs(telemetry.gridKw).toFixed(1)} kW Net-Meter Export
                </span>
              )}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px]">
            <span className="text-slate-400">Dispatch Status:</span>
            <span className={`font-bold px-2 py-0.5 rounded-lg border ${
              isIslanded 
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' 
                : netPower >= 0 
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
            }`}>
              {isIslanded 
                ? 'Islanded 100% Microgrid Autonomous' 
                : netPower >= 0 
                ? '100% Green Solar Self-Sustained' 
                : 'Hybrid Solar + Battery / Grid Support'}
            </span>
          </div>
        </div>
        
        {/* Animated Connecting SVG lines for Desktop/Tablet */}
        <div className="hidden md:block absolute inset-0 pointer-events-none z-0">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="flowSolarGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.9" />
              </linearGradient>
              <linearGradient id="flowBatteryChargeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.9" />
              </linearGradient>
              <linearGradient id="flowBatteryDischargeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.9" />
              </linearGradient>
              <linearGradient id="flowLoadGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.9" />
              </linearGradient>
              <linearGradient id="flowGridGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0.9" />
              </linearGradient>
            </defs>

            {/* Left line: Solar -> AI Hub */}
            <path
              d="M 270 80 C 330 80, 340 160, 400 160"
              fill="none"
              stroke={hasSolar ? 'url(#flowSolarGrad)' : 'rgba(255,255,255,0.06)'}
              strokeWidth="3"
              strokeDasharray="6 6"
              style={{
                animation: hasSolar ? `flow-forward ${solarFlowSpeed}s linear infinite` : 'none'
              }}
            />

            {/* Left line: Battery Storage <-> AI Hub */}
            <path
              d="M 270 240 C 330 240, 340 180, 400 180"
              fill="none"
              stroke={isBatteryCharging ? 'url(#flowBatteryChargeGrad)' : isBatteryDischarging ? 'url(#flowBatteryDischargeGrad)' : 'rgba(255,255,255,0.06)'}
              strokeWidth="3"
              strokeDasharray="6 6"
              style={{
                animation: isBatteryDischarging 
                  ? `flow-forward ${batteryFlowSpeed}s linear infinite` 
                  : isBatteryCharging 
                  ? `flow-reverse ${batteryFlowSpeed}s linear infinite` 
                  : 'none'
              }}
            />

            {/* Right line: AI Hub -> Loads */}
            <path
              d="M 580 160 C 640 160, 650 80, 710 80"
              fill="none"
              stroke="url(#flowLoadGrad)"
              strokeWidth="3"
              strokeDasharray="6 6"
              style={{
                animation: `flow-forward ${loadFlowSpeed}s linear infinite`
              }}
            />

            {/* Right line: AI Hub <-> Grid */}
            <path
              d="M 580 180 C 640 180, 650 240, 710 240"
              fill="none"
              stroke={isIslanded ? 'rgba(244, 63, 94, 0.4)' : isExporting ? 'url(#flowSolarGrad)' : 'url(#flowGridGrad)'}
              strokeWidth="3"
              strokeDasharray={isIslanded ? '3 3' : '6 6'}
              style={{
                animation: isIslanded 
                  ? 'none' 
                  : isExporting 
                  ? `flow-forward ${gridFlowSpeed}s linear infinite` 
                  : `flow-reverse ${gridFlowSpeed}s linear infinite`
              }}
            />
          </svg>
        </div>

        {/* 3-Column Node Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center relative z-10">
          
          {/* Left Column: Solar PV & Battery Storage (4 cols) */}
          <div className="md:col-span-4 flex flex-col gap-4">
            
            {/* Solar PV Node */}
            <div
              id="node-solar"
              onClick={() => onSelectNode(selectedNode === 'solar' ? null : 'solar')}
              className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 cursor-pointer relative backdrop-blur-xl group ${
                selectedNode === 'solar'
                  ? 'bg-amber-950/30 border-amber-400 ring-2 ring-amber-400/30 shadow-xl shadow-amber-500/10'
                  : 'bg-white/[0.03] hover:bg-white/[0.06] border-white/[0.08] hover:border-amber-500/30 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                    <Sun className={`w-5 h-5 text-amber-400 ${hasSolar ? 'animate-spin-slow' : ''}`} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white group-hover:text-amber-300 transition">Solar PV Generation</h3>
                    <p className="text-[10px] text-slate-400 font-mono">150 kWp Bifacial Rooftop</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <span className="text-xs sm:text-sm font-mono font-bold text-amber-300 bg-amber-500/15 px-2.5 py-1 rounded-lg border border-amber-500/30">
                    {telemetry.solarKw.toFixed(1)} kW
                  </span>
                </div>
              </div>

              {/* Solar Progress Bar */}
              <div className="w-full bg-slate-950/80 rounded-full h-1.5 overflow-hidden border border-white/[0.05]">
                <div 
                  className="bg-gradient-to-r from-amber-500 to-yellow-300 h-1.5 transition-all duration-500 rounded-full"
                  style={{ width: `${Math.min(100, (telemetry.solarKw / 150) * 100)}%` }}
                />
              </div>
              
              <div className="flex justify-between text-[10px] text-slate-400 mt-2 font-mono">
                <span>Irradiance: <strong className="text-slate-200">{telemetry.irradiance} W/m²</strong></span>
                <span className="text-emerald-400">Flow: → AI Hub</span>
              </div>
            </div>

            {/* Battery Storage Node (BESS Tank Visual) */}
            <div
              id="node-battery"
              onClick={() => onSelectNode(selectedNode === 'battery' ? null : 'battery')}
              className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 cursor-pointer relative backdrop-blur-xl group ${
                selectedNode === 'battery'
                  ? 'bg-emerald-950/30 border-emerald-400 ring-2 ring-emerald-400/30 shadow-xl shadow-emerald-500/10'
                  : 'bg-white/[0.03] hover:bg-white/[0.06] border-white/[0.08] hover:border-emerald-500/30 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                    {isBatteryCharging ? (
                      <BatteryCharging className="w-5 h-5 text-emerald-400 animate-pulse" />
                    ) : (
                      <BatteryMedium className="w-5 h-5 text-emerald-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white group-hover:text-emerald-300 transition">BESS Storage Bank</h3>
                    <p className="text-[10px] text-slate-400 font-mono">250 kWh LiFePO4</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <span className="text-xs sm:text-sm font-mono font-bold text-emerald-300 bg-emerald-500/15 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                    {Math.round(telemetry.batterySoc)}% SoC
                  </span>
                </div>
              </div>

              {/* Liquid Level Tank Visualization */}
              <div className="w-full bg-slate-950/80 rounded-lg h-3 overflow-hidden border border-white/[0.08] p-0.5 relative">
                <div 
                  className={`h-full transition-all duration-700 rounded-md relative overflow-hidden ${
                    telemetry.batterySoc > 50 
                      ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300'
                      : telemetry.batterySoc > 20
                      ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300'
                      : 'bg-gradient-to-r from-rose-500 via-red-400 to-rose-300'
                  }`}
                  style={{ width: `${telemetry.batterySoc}%` }}
                >
                  {isBatteryCharging && (
                    <div className="absolute inset-0 bg-white/30 animate-pulse" />
                  )}
                </div>
              </div>

              <div className="flex justify-between text-[10px] text-slate-400 mt-2 font-mono">
                <span className="flex items-center gap-1">
                  {isBatteryCharging ? (
                    <span className="text-emerald-400">⚡ Charging (+{Math.abs(telemetry.batteryPowerKw).toFixed(1)} kW)</span>
                  ) : isBatteryDischarging ? (
                    <span className="text-amber-400">⚡ Discharging (-{Math.abs(telemetry.batteryPowerKw).toFixed(1)} kW)</span>
                  ) : (
                    <span className="text-slate-400">Standby (0 kW)</span>
                  )}
                </span>
                <span className="text-emerald-400">Health: {telemetry.batterySoH}%</span>
              </div>
            </div>

          </div>

          {/* Middle Column: Central AI SCADA Brain & Dispatch Bus (4 cols) */}
          <div className="md:col-span-4 flex flex-col items-center justify-center">
            
            <div className="w-full bg-gradient-to-b from-slate-800/90 via-slate-900/95 to-slate-950/90 backdrop-blur-2xl border border-emerald-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl shadow-emerald-950/50 relative text-center ring-1 ring-white/10">
              
              {/* Central Core Indicator */}
              <div className="relative w-14 h-14 mx-auto mb-3">
                <div className="absolute inset-0 rounded-2xl bg-emerald-500/20 animate-ping opacity-30" />
                <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-xl shadow-emerald-500/40 text-slate-950">
                  <Cpu className="w-7 h-7" />
                </div>
              </div>

              <h3 className="text-sm font-bold text-white tracking-tight">
                AI SCADA Dispatch Core
              </h3>
              <div className="flex items-center justify-center gap-1.5 mt-0.5 text-xs text-emerald-400 font-semibold font-mono">
                <Activity className="w-3.5 h-3.5 animate-pulse" />
                <span>Autonomous Power Routing</span>
              </div>

              {/* Status Readout */}
              <div className="mt-3.5 pt-3 border-t border-white/[0.08] space-y-1.5 text-xs text-left font-mono">
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-slate-400">Active Mode:</span>
                  <span className="font-semibold text-emerald-300 px-2 py-0.5 bg-white/5 rounded-md border border-white/5 text-[11px]">{systemMode}</span>
                </div>
                
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-slate-400">Net Surplus / Deficit:</span>
                  <span className={`font-bold ${netPower >= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {netPower >= 0 ? `+${netPower.toFixed(1)} kW (Surplus)` : `${netPower.toFixed(1)} kW (Deficit)`}
                  </span>
                </div>

                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-slate-400">Frequency Interlock:</span>
                  <span className="font-semibold text-slate-200">{telemetry.gridFrequency.toFixed(2)} Hz</span>
                </div>
              </div>

              {/* Dynamic status chip */}
              <div className="mt-3.5 py-1.5 px-3 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-semibold text-emerald-300 flex items-center justify-center gap-1.5 font-mono">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>{netPower >= 0 ? 'Zero-Carbon Autonomy' : 'BESS Peak-Shaving Injected'}</span>
              </div>

            </div>

          </div>

          {/* Right Column: Campus Demands & Utility Grid Interconnect (4 cols) */}
          <div className="md:col-span-4 flex flex-col gap-4">
            
            {/* Campus Loads Node */}
            <div
              id="node-loads"
              onClick={() => onSelectNode(selectedNode === 'load' ? null : 'load')}
              className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 cursor-pointer relative backdrop-blur-xl group ${
                selectedNode === 'load'
                  ? 'bg-cyan-950/30 border-cyan-400 ring-2 ring-cyan-400/30 shadow-xl shadow-cyan-500/10'
                  : 'bg-white/[0.03] hover:bg-white/[0.06] border-white/[0.08] hover:border-cyan-500/30 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white group-hover:text-cyan-300 transition">Campus Load Demand</h3>
                    <p className="text-[10px] text-slate-400 font-mono">5 Managed Sub-Busses</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <span className="text-xs sm:text-sm font-mono font-bold text-cyan-300 bg-cyan-500/15 px-2.5 py-1 rounded-lg border border-cyan-500/30">
                    {telemetry.loadKw.toFixed(1)} kW
                  </span>
                </div>
              </div>

              <div className="w-full bg-slate-950/80 rounded-full h-1.5 overflow-hidden border border-white/[0.05]">
                <div 
                  className="bg-gradient-to-r from-cyan-500 to-blue-400 h-1.5 transition-all duration-500 rounded-full"
                  style={{ width: `${Math.min(100, (telemetry.loadKw / 140) * 100)}%` }}
                />
              </div>

              <div className="flex justify-between text-[10px] text-slate-400 mt-2 font-mono">
                <span>Peak Cap: <strong className="text-slate-200">140 kW</strong></span>
                <span className="text-cyan-400">Flex Margin: 42.5 kW</span>
              </div>
            </div>

            {/* Utility Grid Interconnect Node */}
            <div
              id="node-grid"
              onClick={() => onSelectNode(selectedNode === 'grid' ? null : 'grid')}
              className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 cursor-pointer relative backdrop-blur-xl group ${
                isIslanded
                  ? 'bg-rose-950/30 border-rose-500/40'
                  : selectedNode === 'grid'
                  ? 'bg-indigo-950/30 border-indigo-400 ring-2 ring-indigo-400/30 shadow-xl shadow-indigo-500/10'
                  : 'bg-white/[0.03] hover:bg-white/[0.06] border-white/[0.08] hover:border-indigo-500/30 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white group-hover:text-indigo-300 transition">Utility Grid Net-Meter</h3>
                    <p className="text-[10px] text-slate-400 font-mono">11 kV Substation Feeder</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-xs sm:text-sm font-mono font-bold px-2.5 py-1 rounded-lg border ${
                    isIslanded
                      ? 'text-rose-300 bg-rose-500/15 border-rose-500/30'
                      : isExporting
                      ? 'text-emerald-300 bg-emerald-500/15 border-emerald-500/30'
                      : 'text-indigo-300 bg-indigo-500/15 border-indigo-500/30'
                  }`}>
                    {isIslanded ? 'ISLANDED (0 kW)' : isExporting ? `-${Math.abs(telemetry.gridKw).toFixed(1)} kW` : `+${telemetry.gridKw.toFixed(1)} kW`}
                  </span>
                </div>
              </div>

              <div className="w-full bg-slate-950/80 rounded-full h-1.5 overflow-hidden border border-white/[0.05]">
                <div 
                  className={`h-1.5 transition-all duration-500 rounded-full ${
                    isIslanded ? 'bg-rose-500' : isExporting ? 'bg-emerald-400' : 'bg-indigo-400'
                  }`}
                  style={{ width: `${isIslanded ? 0 : Math.min(100, Math.abs(telemetry.gridKw) * 5)}%` }}
                />
              </div>

              <div className="flex justify-between text-[10px] text-slate-400 mt-2 font-mono">
                <span>ToD Tariff: <strong className="text-amber-300">₹{telemetry.tariffRate}/kWh</strong></span>
                <span className={isIslanded ? 'text-rose-400' : isExporting ? 'text-emerald-400' : 'text-indigo-400'}>
                  {isIslanded ? 'Isolated' : isExporting ? 'Clean Feed-In' : 'Grid Import'}
                </span>
              </div>
            </div>

          </div>

        </div>

        {/* Real-time Energy Transfer Destination Matrix */}
        <div className="mt-5 pt-4 border-t border-white/[0.08] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block">1. Solar PV Generation</span>
                <span className="text-slate-200 font-bold">{telemetry.solarKw.toFixed(1)} kW Produced</span>
              </div>
            </div>
            <span className="text-[10px] text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
              ➔ Central SCADA
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block">2. Primary Transfer</span>
                <span className="text-cyan-300 font-bold">{telemetry.loadKw.toFixed(1)} kW Delivered</span>
              </div>
            </div>
            <span className="text-[10px] text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
              ➔ 5 Campus Busses
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BatteryCharging className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block">3. BESS Storage Bank</span>
                <span className="text-emerald-300 font-bold">
                  {isBatteryCharging ? `+${Math.abs(telemetry.batteryPowerKw).toFixed(1)} kW Ingest` : isBatteryDischarging ? `-${Math.abs(telemetry.batteryPowerKw).toFixed(1)} kW Injected` : '0 kW Standby'}
                </span>
              </div>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${isBatteryCharging ? 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20' : isBatteryDischarging ? 'text-amber-300 bg-amber-500/10 border-amber-500/20' : 'text-slate-400 bg-white/5 border-white/5'}`}>
              {isBatteryCharging ? '➔ Storing Surplus' : isBatteryDischarging ? '➔ Assisting Load' : 'Idle (Buffer)'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-indigo-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block">4. Utility Grid Feeder</span>
                <span className="text-indigo-300 font-bold">
                  {isIslanded ? '0.0 kW Islanded' : isExporting ? `-${Math.abs(telemetry.gridKw).toFixed(1)} kW Fed` : `+${telemetry.gridKw.toFixed(1)} kW Imported`}
                </span>
              </div>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${isIslanded ? 'text-rose-300 bg-rose-500/10 border-rose-500/20' : isExporting ? 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20' : 'text-indigo-300 bg-indigo-500/10 border-indigo-500/20'}`}>
              {isIslanded ? 'Islanded' : isExporting ? '➔ Grid Export' : '➔ Campus Draw'}
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};
