import React, { useState } from 'react';
import { 
  Sparkles, 
  BrainCircuit, 
  CheckCircle2, 
  IndianRupee, 
  Leaf, 
  Send, 
  RefreshCw, 
  Lightbulb, 
  Cpu, 
  ShieldCheck, 
  Zap, 
  Sun, 
  BatteryMedium, 
  Car, 
  Sliders, 
  ChevronDown, 
  ChevronUp,
  ArrowRight,
  Database,
  LineChart,
  GitFork,
  Check,
  Play,
  Flame,
  Activity,
  Layers,
  GraduationCap,
  School,
  Home,
  BatteryCharging
} from 'lucide-react';
import { AIAdvisorResult, GridTelemetry, SubLoad, SystemModeType, WeatherCondition } from '../types';
import { runAutopilotEngine } from '../engine/autopilotEngine';
import { calculateCampusPredictiveShift } from '../data/predictiveShiftData';
import { AutopilotDemoModal } from './AutopilotDemoModal';

interface AIPredictionAndAdvisorProps {
  telemetry: GridTelemetry;
  subLoads: SubLoad[];
  systemMode: SystemModeType;
  advisorData: AIAdvisorResult | null;
  isLoadingAdvisor: boolean;
  onRefreshAdvisor: (customPrompt?: string) => void;
  isAutopilotActive?: boolean;
  onToggleAutopilot?: () => void;
  onApplyDemoDispatch?: (dispatchedLoads: SubLoad[], batteryPowerKw: number) => void;
}

export const AIPredictionAndAdvisor: React.FC<AIPredictionAndAdvisorProps> = ({
  telemetry,
  subLoads,
  systemMode,
  advisorData,
  isLoadingAdvisor,
  onRefreshAdvisor,
  isAutopilotActive = true,
  onToggleAutopilot,
  onApplyDemoDispatch,
}) => {
  const [customPrompt, setCustomPrompt] = useState('');
  const [showReasoning, setShowReasoning] = useState(true);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [selectedShiftHour, setSelectedShiftHour] = useState<number>(8); // Default 8:00 AM

  // Calculate dynamic predictive shift state
  const predictiveShiftState = calculateCampusPredictiveShift(
    selectedShiftHour,
    telemetry.solarKw,
    telemetry.batterySoc
  );

  // Run dynamic Autopilot engine on live telemetry
  const autopilotResult = runAutopilotEngine(
    telemetry,
    subLoads,
    systemMode,
    telemetry.weather || 'Sunny'
  );

  const handleAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;
    onRefreshAdvisor(customPrompt.trim());
    setCustomPrompt('');
  };

  const samplePrompts = [
    'How does GreenGridAI maximize revenue with Net-Metering arbitrage?',
    'What dispatch strategy is optimal if solar decreases 50%?',
    'Explain the Time-of-Day (ToD) peak-shaving algorithm.',
    'Identify non-critical loads to throttle during peak tariff.',
  ];

  // Tariff category label
  const tariffCategory = telemetry.tariffRate >= 10 ? 'HIGH' : telemetry.tariffRate >= 7 ? 'MODERATE' : 'OFF-PEAK';

  const totalLoad = subLoads.reduce((acc, l) => acc + (l.status === 'Shed' ? 0 : l.powerKw), 0);

  return (
    <section className="bg-slate-900/70 backdrop-blur-2xl rounded-3xl p-6 sm:p-7 lg:p-8 border border-emerald-500/30 shadow-2xl shadow-emerald-950/20 relative overflow-hidden ring-1 ring-white/[0.08]">
      
      {/* Background ambient lighting */}
      <div className="absolute -top-10 -right-10 w-96 h-96 bg-emerald-500/[0.09] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-teal-500/[0.06] rounded-full blur-3xl pointer-events-none" />

      {/* Header: AI Autopilot Centerpiece */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-5 border-b border-white/[0.08] relative z-10">
        
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-xl shadow-emerald-500/30 text-slate-950">
              <BrainCircuit className="w-7 h-7" />
            </div>
            <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 border-2 border-slate-900 rounded-full ${isAutopilotActive ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
          </div>

          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <span>AI ENERGY AUTOPILOT</span>
              </h2>
              
              <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${
                isAutopilotActive 
                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}>
                <span className={`w-2 h-2 rounded-full ${isAutopilotActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                <span>{isAutopilotActive ? '● AUTONOMOUS DISPATCH ACTIVE' : '○ MANUAL OVERRIDE'}</span>
              </div>

              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono text-cyan-300 bg-cyan-500/10 border border-cyan-500/20">
                Gemini 3.7 SCADA Core
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Real-time closed-loop SCADA: MONITOR ➔ PREDICT ➔ OPTIMIZE ➔ CONTROL.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Interactive Step-by-Step Demo Trigger */}
          <button
            id="btn-run-autopilot-demo"
            onClick={() => setIsDemoModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition active:scale-95 cursor-pointer font-mono"
            title="Step-by-step interactive walkthrough of the Autopilot cycle"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Autopilot Demo Walkthrough</span>
          </button>

          <button
            id="btn-refresh-ai-advisor"
            onClick={() => onRefreshAdvisor()}
            disabled={isLoadingAdvisor}
            className="px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 border border-white/[0.08] text-xs font-semibold flex items-center gap-2 transition disabled:opacity-50 backdrop-blur-md shadow-sm cursor-pointer active:scale-95"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isLoadingAdvisor ? 'animate-spin' : ''}`} />
            <span>{isLoadingAdvisor ? 'Evaluating SCADA Dispatch...' : 'Re-Evaluate Dispatch'}</span>
          </button>
        </div>

      </div>

      {/* Current Situation Bar */}
      <div className="relative z-10 mb-6">
        <div className="p-4 sm:p-5 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/[0.08] shadow-inner">
          <div className="flex items-center justify-between mb-3 text-xs font-mono text-slate-400 uppercase tracking-wider">
            <span className="flex items-center gap-1.5 font-bold text-slate-300">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              Live Ingestion Telemetry Matrix (100ms SCADA Bus)
            </span>
            <span className="text-emerald-400 font-semibold font-mono">
              Net Balance: <strong className={autopilotResult.netPowerKw >= 0 ? 'text-emerald-300' : 'text-amber-300'}>{autopilotResult.deficitOrSurplusLabel}</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <span className="text-[11px] text-slate-400 block flex items-center gap-1">
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                Solar Generation
              </span>
              <div className="text-base sm:text-lg font-bold text-amber-300 mt-1">
                {telemetry.solarKw.toFixed(1)} kW
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <span className="text-[11px] text-slate-400 block flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                Active Campus Demand
              </span>
              <div className="text-base sm:text-lg font-bold text-cyan-300 mt-1">
                {totalLoad.toFixed(1)} kW
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <span className="text-[11px] text-slate-400 block flex items-center gap-1">
                <BatteryMedium className="w-3.5 h-3.5 text-emerald-400" />
                Battery State (BESS)
              </span>
              <div className="text-base sm:text-lg font-bold text-emerald-300 mt-1">
                {Math.round(telemetry.batterySoc)}% SoC
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <span className="text-[11px] text-slate-400 block flex items-center gap-1">
                <IndianRupee className="w-3.5 h-3.5 text-amber-400" />
                Active ToD Tariff
              </span>
              <div className="text-base sm:text-lg font-bold text-amber-300 mt-1 flex items-center gap-1">
                <span>₹{telemetry.tariffRate}/kWh</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {tariffCategory}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Decision Banner */}
      <div className="relative z-10 mb-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900/80 to-teal-950/60 backdrop-blur-xl border border-emerald-500/40 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0 text-emerald-300">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400 block">
              Autonomous AI Decision Directive
            </span>
            <p className="text-sm sm:text-base font-semibold text-white mt-0.5 leading-snug">
              {advisorData?.summary || autopilotResult.summary}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowReasoning(!showReasoning)}
          className="px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition self-start sm:self-center shrink-0 cursor-pointer"
        >
          <span>{showReasoning ? 'Hide AI Pipeline' : 'View AI Pipeline'}</span>
          {showReasoning ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Real-Time Autonomous Directives Grid (5 Direct Action Channels) */}
      <div className="relative z-10 mb-6">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center justify-between">
          <span>Active Microgrid Subsystem Directives</span>
          <span className="text-[11px] text-emerald-400 font-normal">5 Autonomous Channels Interlocked</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {autopilotResult.directives.map((directive, idx) => (
            <div 
              key={idx}
              className="p-3.5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.06] transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    {directive.subsystem === 'solar' && <Sun className="w-3.5 h-3.5 text-amber-400" />}
                    {directive.subsystem === 'battery' && <BatteryMedium className="w-3.5 h-3.5 text-emerald-400" />}
                    {directive.subsystem === 'ev' && <Car className="w-3.5 h-3.5 text-cyan-400" />}
                    {directive.subsystem === 'hvac' && <Sliders className="w-3.5 h-3.5 text-indigo-400" />}
                    {directive.subsystem === 'grid' && <Zap className="w-3.5 h-3.5 text-emerald-400" />}
                    {directive.name}
                  </span>
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${directive.actionColor}`}>
                    {directive.actionBadge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-mono leading-relaxed">
                  {directive.reasoning}
                </p>
              </div>
              <div className="mt-2 pt-2 border-t border-white/[0.04] text-[10px] font-mono text-slate-300 flex justify-between">
                <span className="text-slate-500">Flow:</span>
                <span className="font-bold text-emerald-300">{directive.powerFlow}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Collapsible AI Reasoning Pipeline Timeline (MONITOR -> PREDICT -> OPTIMIZE -> CONTROL) */}
      {showReasoning && (
        <div className="relative z-10 mb-6 p-5 rounded-2xl bg-white/[0.02] backdrop-blur-xl border border-white/[0.08] shadow-inner space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              Real-Time AI Reasoning & Optimization Pipeline
            </span>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
              Deterministic MILP + Gemini 3.7 Hybrid
            </span>
          </div>

          {/* Step Sequence Bar: DATA -> PREDICTION -> OPTIMIZATION -> DECISION */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-mono">
            {autopilotResult.reasoningSteps.map((stepItem, idx) => (
              <div 
                key={idx}
                className={`p-3.5 rounded-xl border flex flex-col justify-between ${
                  stepItem.step === 'CONTROL' && isAutopilotActive
                    ? 'bg-emerald-950/30 border-emerald-500/40'
                    : 'bg-black/30 border-white/[0.06]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`font-bold flex items-center gap-1.5 ${
                      stepItem.step === 'MONITOR' ? 'text-cyan-300' :
                      stepItem.step === 'PREDICT' ? 'text-amber-300' :
                      stepItem.step === 'OPTIMIZE' ? 'text-indigo-300' : 'text-emerald-300'
                    }`}>
                      {stepItem.step === 'MONITOR' && <Database className="w-3.5 h-3.5 text-cyan-400" />}
                      {stepItem.step === 'PREDICT' && <LineChart className="w-3.5 h-3.5 text-amber-400" />}
                      {stepItem.step === 'OPTIMIZE' && <GitFork className="w-3.5 h-3.5 text-indigo-400" />}
                      {stepItem.step === 'CONTROL' && <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />}
                      {stepItem.title}
                    </span>
                  </div>
                  <div className={`text-[10px] px-2 py-0.5 rounded-md border mb-2 inline-block ${stepItem.badgeColor}`}>
                    {stepItem.badge}
                  </div>
                  <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                    {stepItem.description}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-white/[0.05] text-[10px] text-emerald-400 flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  <span className="truncate">{stepItem.metric}</span>
                </div>
              </div>
            ))}
          </div>

          {/* SCADA Intelligence Highlight */}
          {(advisorData?.sihJudgePitch || autopilotResult.sihJudgePitch) && (
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-500/[0.08] via-teal-500/[0.05] to-transparent border border-emerald-500/20 text-xs text-slate-300 flex items-start gap-2.5">
              <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-amber-300 font-bold block mb-0.5">Autonomous Dispatch Reasoning:</span>
                <p className="text-slate-300 leading-relaxed font-sans">{advisorData?.sihJudgePitch || autopilotResult.sihJudgePitch}</p>
              </div>
            </div>
          )}

        </div>
      )}

      {/* PREDICTIVE CAMPUS ENERGY SHIFTING ENGINE (Special Feature Card) */}
      <div className="relative z-10 mb-6 p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-cyan-950/40 via-slate-900/90 to-slate-950/90 border border-cyan-500/40 shadow-xl shadow-cyan-950/20">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-cyan-500/20">
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Predictive Campus Energy Shifting Engine
                </h3>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Occupancy & Timetable Aware
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  SIMULATED / ESTIMATED
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Automatically detects student movements (e.g. 08:00 AM hostel departure) and reallocates clean solar to academic buildings.
              </p>
            </div>
          </div>

          {/* Time Selector for Campus Schedule Simulation */}
          <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/[0.08] text-xs font-mono">
            <span className="text-[10px] text-slate-400 px-1.5">Hour:</span>
            {[7, 8, 12, 14, 18, 21].map((hr) => (
              <button
                key={hr}
                onClick={() => setSelectedShiftHour(hr)}
                className={`px-2 py-0.5 rounded-lg font-bold transition cursor-pointer text-[11px] ${
                  selectedShiftHour === hr
                    ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-500/50 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {hr < 10 ? `0${hr}:00` : `${hr}:00`}
              </button>
            ))}
          </div>
        </div>

        {/* AI Explanation of the Shift */}
        <div className="p-3.5 rounded-xl bg-black/40 border border-cyan-500/30 mb-4 text-xs text-slate-200">
          <div className="flex items-center gap-1.5 text-cyan-400 font-mono font-bold text-[11px] mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Autonomous Demand Shifting ({predictiveShiftState.currentSimulatedTime}): {predictiveShiftState.aiExplanation.title}</span>
          </div>
          <p className="leading-relaxed font-sans text-slate-300">{predictiveShiftState.aiExplanation.shiftDescription}</p>
          <div className="mt-2 pt-2 border-t border-white/[0.05] text-[11px] text-emerald-300 font-mono flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span><strong>Interlock Action:</strong> {predictiveShiftState.aiExplanation.actionTaken}</span>
          </div>
        </div>

        {/* 4-Step Pipeline: Monitor -> Predict -> Optimize -> Control */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs mb-4">
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex flex-col justify-between">
            <div>
              <span className="text-[10px] text-cyan-400 font-bold block mb-1 uppercase tracking-wider">
                1. Monitor
              </span>
              <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                {predictiveShiftState.aiExplanation.decisionSteps.monitor}
              </p>
            </div>
            <div className="mt-2 pt-2 border-t border-white/[0.04] text-[10px] text-cyan-400 font-bold">
              Hostel: {predictiveShiftState.hostelDemandKw} kW | Acad: {predictiveShiftState.academicDemandKw} kW
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex flex-col justify-between">
            <div>
              <span className="text-[10px] text-amber-400 font-bold block mb-1 uppercase tracking-wider">
                2. Predict
              </span>
              <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                {predictiveShiftState.aiExplanation.decisionSteps.predict}
              </p>
            </div>
            <div className="mt-2 pt-2 border-t border-white/[0.04] text-[10px] text-amber-400 font-bold">
              Solar Available: {predictiveShiftState.solarGenerationKw} kW
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex flex-col justify-between">
            <div>
              <span className="text-[10px] text-indigo-400 font-bold block mb-1 uppercase tracking-wider">
                3. Optimize
              </span>
              <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                {predictiveShiftState.aiExplanation.decisionSteps.optimize}
              </p>
            </div>
            <div className="mt-2 pt-2 border-t border-white/[0.04] text-[10px] text-indigo-400 font-bold">
              Redirected: {predictiveShiftState.reallocatedKw} kW
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex flex-col justify-between">
            <div>
              <span className="text-[10px] text-emerald-400 font-bold block mb-1 uppercase tracking-wider">
                4. Control & Store
              </span>
              <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                {predictiveShiftState.aiExplanation.decisionSteps.control}
              </p>
            </div>
            <div className="mt-2 pt-2 border-t border-white/[0.04] text-[10px] text-emerald-400 font-bold">
              BESS Store: +{predictiveShiftState.batteryStoredKw} kW | Grid Avoided: {predictiveShiftState.gridAvoidedKw} kW
            </div>
          </div>
        </div>

        {/* Without AI vs With AI Comparative Impact Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs pt-3 border-t border-white/[0.06]">
          <div className="p-2.5 rounded-xl bg-black/30 border border-white/[0.04]">
            <span className="text-[10px] text-slate-400 block">⚡ Grid Dependency</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-sm font-bold text-emerald-300">
                {predictiveShiftState.withoutAiVsWithAi.gridDependencyWith}%
              </span>
              <span className="text-[10px] text-slate-400">
                (vs {predictiveShiftState.withoutAiVsWithAi.gridDependencyWithout}%)
              </span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-black/30 border border-white/[0.04]">
            <span className="text-[10px] text-slate-400 block">💰 Hourly Cost</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-sm font-bold text-emerald-300">
                ₹{predictiveShiftState.withoutAiVsWithAi.hourlyCostWithInr}/hr
              </span>
              <span className="text-[10px] text-emerald-400">
                (Save ₹{(predictiveShiftState.withoutAiVsWithAi.hourlyCostWithoutInr - predictiveShiftState.withoutAiVsWithAi.hourlyCostWithInr).toFixed(0)})
              </span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-black/30 border border-white/[0.04]">
            <span className="text-[10px] text-slate-400 block">🌱 Clean Waste Avoided</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-sm font-bold text-teal-300">
                {predictiveShiftState.withoutAiVsWithAi.energyWasteWithKwh} kWh
              </span>
              <span className="text-[10px] text-teal-400">
                (vs {predictiveShiftState.withoutAiVsWithAi.energyWasteWithoutKwh} kWh lost)
              </span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-black/30 border border-white/[0.04]">
            <span className="text-[10px] text-slate-400 block">♻️ Renewable Share</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-sm font-bold text-amber-300">
                {predictiveShiftState.withoutAiVsWithAi.renewableUtilizationWith}%
              </span>
              <span className="text-[10px] text-amber-400">
                (+{predictiveShiftState.withoutAiVsWithAi.renewableUtilizationWith - predictiveShiftState.withoutAiVsWithAi.renewableUtilizationWithout}%)
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Interactive AI Co-Pilot Query Box & Contingency Tester */}
      <div className="relative z-10 pt-4 border-t border-white/[0.08]">
        <div className="flex items-center gap-2 mb-2.5">
          <Cpu className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-xs font-bold text-slate-300">
            Ask Microgrid AI Autopilot or Test Contingency Scenarios:
          </span>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="flex flex-wrap gap-2 mb-3">
          {samplePrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCustomPrompt(prompt);
                onRefreshAdvisor(prompt);
              }}
              className="text-[11px] px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] text-slate-300 hover:text-white border border-white/[0.07] hover:border-emerald-500/40 transition text-left backdrop-blur-md cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>

        <form onSubmit={handleAsk} className="flex gap-2">
          <input
            type="text"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="Ask scenario question (e.g. 'Optimize for sudden 40kW EV surge during peak tariff')..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20 transition font-sans"
          />
          <button
            type="submit"
            disabled={isLoadingAdvisor || !customPrompt.trim()}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer font-mono"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Ask AI</span>
          </button>
        </form>
      </div>

      {/* Autopilot Demo Walkthrough Modal */}
      <AutopilotDemoModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        telemetry={telemetry}
        subLoads={subLoads}
        systemMode={systemMode}
        onApplyDemoDispatch={(dispatchedLoads, batPower) => {
          if (onApplyDemoDispatch) {
            onApplyDemoDispatch(dispatchedLoads, batPower);
          }
        }}
      />

    </section>
  );
};
