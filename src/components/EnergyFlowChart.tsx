import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, BarChart3, Clock, Calendar, School, Home, Sparkles } from 'lucide-react';
import { HourlyForecastPoint } from '../types';
import { CAMPUS_24H_DEMAND_CURVE } from '../data/predictiveShiftData';

interface EnergyFlowChartProps {
  forecastData: HourlyForecastPoint[];
}

export const EnergyFlowChart: React.FC<EnergyFlowChartProps> = ({ forecastData }) => {
  const [activeTab, setActiveTab] = useState<'generation_load' | 'campus_shift' | 'battery_soc' | 'tariff_arbitrage'>('generation_load');
  const [timeHorizon, setTimeHorizon] = useState<'1H' | '6H' | '12H' | '24H'>('24H');

  // Filter forecast data based on time horizon
  const filteredData = React.useMemo(() => {
    switch (timeHorizon) {
      case '1H':
        return forecastData.slice(5, 7);
      case '6H':
        return forecastData.slice(4, 8);
      case '12H':
        return forecastData.slice(2, 10);
      case '24H':
      default:
        return forecastData;
    }
  }, [forecastData, timeHorizon]);

  return (
    <div className="bg-slate-900/70 backdrop-blur-2xl rounded-3xl p-5 sm:p-7 border border-white/[0.08] shadow-2xl shadow-black/50 relative overflow-hidden ring-1 ring-white/[0.06]">
      
      {/* Ambient background glow */}
      <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-cyan-500/[0.04] rounded-full blur-3xl pointer-events-none" />

      {/* Header and Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-white/[0.08] relative z-10">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
            </div>
            <h2 className="text-base font-bold text-white tracking-tight">
              24-Hour Predictive Load & Campus Shifting Flow
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
              ML Model Horizon
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
              SIMULATED / ESTIMATED
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Machine Learning predictive dispatch curves vs telemetry with real-time dynamic campus shifting and ToD tariff arbitrage.
          </p>
        </div>

        {/* Tab & Horizon Controls */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Timeframe selector (1H, 6H, 12H, 24H) */}
          <div className="flex items-center bg-black/40 backdrop-blur-md rounded-xl p-1 border border-white/[0.08] text-xs font-mono">
            {(['1H', '6H', '12H', '24H'] as const).map((h) => (
              <button
                key={h}
                onClick={() => setTimeHorizon(h)}
                className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                  timeHorizon === h
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {h}
              </button>
            ))}
          </div>

          {/* Metric Tab Selector */}
          <div className="flex items-center bg-black/40 backdrop-blur-md rounded-xl p-1 border border-white/[0.08] text-xs">
            <button
              id="tab-chart-gen-load"
              onClick={() => setActiveTab('generation_load')}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                activeTab === 'generation_load'
                  ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Solar vs Load
            </button>
            <button
              id="tab-chart-campus-shift"
              onClick={() => setActiveTab('campus_shift')}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                activeTab === 'campus_shift'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Campus Demand Shift
            </button>
            <button
              id="tab-chart-battery-soc"
              onClick={() => setActiveTab('battery_soc')}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                activeTab === 'battery_soc'
                  ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              BESS SoC (%)
            </button>
            <button
              id="tab-chart-tariff"
              onClick={() => setActiveTab('tariff_arbitrage')}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                activeTab === 'tariff_arbitrage'
                  ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Tariff (₹/kWh)
            </button>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-72 sm:h-80 relative z-10 font-mono">
        <ResponsiveContainer width="100%" height="100%">
          {activeTab === 'generation_load' ? (
            <AreaChart data={filteredData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSolar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.45}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.35}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
              <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} unit=" kW" tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                  backdropFilter: 'blur(20px)',
                  borderColor: 'rgba(255, 255, 255, 0.12)', 
                  borderRadius: '0.875rem',
                  fontSize: '12px',
                  color: '#f8fafc',
                  boxShadow: '0 12px 32px 0 rgba(0, 0, 0, 0.5)'
                }} 
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '12px' }} />
              <Area 
                type="monotone" 
                dataKey="solarKw" 
                name="Solar Generation (kW)" 
                stroke="#f59e0b" 
                strokeWidth={2.5}
                fillOpacity={1} 
                fill="url(#colorSolar)" 
              />
              <Area 
                type="monotone" 
                dataKey="predictedLoadKw" 
                name="AI Predicted Load (kW)" 
                stroke="#06b6d4" 
                strokeWidth={2}
                strokeDasharray="4 4"
                fillOpacity={1} 
                fill="url(#colorLoad)" 
              />
              <Line 
                type="monotone" 
                dataKey="actualLoadKw" 
                name="Actual Load (kW)" 
                stroke="#10b981" 
                strokeWidth={2.5} 
                dot={{ r: 3, fill: '#10b981' }}
              />
            </AreaChart>
          ) : activeTab === 'campus_shift' ? (
            <AreaChart data={CAMPUS_24H_DEMAND_CURVE} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorHostels" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="colorAcademic" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="colorBess" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
              <XAxis dataKey="timeLabel" stroke="#64748b" fontSize={10} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={10} unit=" kW" tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                  backdropFilter: 'blur(20px)',
                  borderColor: 'rgba(255, 255, 255, 0.12)', 
                  borderRadius: '0.875rem',
                  fontSize: '11px',
                  color: '#f8fafc',
                  boxShadow: '0 12px 32px 0 rgba(0, 0, 0, 0.5)'
                }} 
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '12px' }} />
              <Area type="monotone" dataKey="hostelDemandKw" name="Hostels (KP & QC)" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorHostels)" />
              <Area type="monotone" dataKey="academicDemandKw" name="Academic Lecture Halls" stroke="#06b6d4" strokeWidth={2.5} fillOpacity={1} fill="url(#colorAcademic)" />
              <Area type="monotone" dataKey="batteryChargeKw" name="Surplus Stored to BESS" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorBess)" />
              <Line type="monotone" dataKey="avoidedGridDrawKw" name="Avoided Grid Draw (Waste Prevention)" stroke="#f59e0b" strokeWidth={2} strokeDasharray="3 3" dot={false} />
            </AreaChart>
          ) : activeTab === 'battery_soc' ? (
            <AreaChart data={filteredData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSoc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.5}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.03}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
              <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} unit="%" tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                  backdropFilter: 'blur(20px)',
                  borderColor: 'rgba(255, 255, 255, 0.12)', 
                  borderRadius: '0.875rem',
                  fontSize: '12px',
                  color: '#f8fafc',
                  boxShadow: '0 12px 32px 0 rgba(0, 0, 0, 0.5)'
                }} 
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '12px' }} />
              <Area 
                type="monotone" 
                dataKey="batterySoc" 
                name="BESS State of Charge (SoC %)" 
                stroke="#10b981" 
                strokeWidth={2.5}
                fillOpacity={1} 
                fill="url(#colorSoc)" 
              />
            </AreaChart>
          ) : (
            <BarChart data={filteredData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
              <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} unit=" ₹" tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                  backdropFilter: 'blur(20px)',
                  borderColor: 'rgba(255, 255, 255, 0.12)', 
                  borderRadius: '0.875rem',
                  fontSize: '12px',
                  color: '#f8fafc',
                  boxShadow: '0 12px 32px 0 rgba(0, 0, 0, 0.5)'
                }} 
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '12px' }} />
              <Bar 
                dataKey="tariff" 
                name="ToD Tariff Rate (₹/kWh)" 
                fill="#6366f1" 
                radius={[4, 4, 0, 0]} 
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Footer Key Statistics Readout */}
      <div className="mt-5 pt-4 border-t border-white/[0.08] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-300 relative z-10">
        <div className="bg-white/[0.02] backdrop-blur-md p-3.5 rounded-xl border border-white/[0.06]">
          <span className="text-slate-400 block text-[11px] font-mono">08:00 Campus Shift</span>
          <span className="text-cyan-400 font-bold font-mono text-sm">Hostel ↓85% / Acad ↑300%</span>
        </div>
        <div className="bg-white/[0.02] backdrop-blur-md p-3.5 rounded-xl border border-white/[0.06]">
          <span className="text-slate-400 block text-[11px] font-mono">Clean Solar Redirected</span>
          <span className="text-amber-400 font-bold font-mono text-sm">+21.0 kW to Classes</span>
        </div>
        <div className="bg-white/[0.02] backdrop-blur-md p-3.5 rounded-xl border border-white/[0.06]">
          <span className="text-slate-400 block text-[11px] font-mono">Surplus Battery Charge</span>
          <span className="text-emerald-400 font-bold font-mono text-sm">+7.5 kW Stored</span>
        </div>
        <div className="bg-white/[0.02] backdrop-blur-md p-3.5 rounded-xl border border-white/[0.06]">
          <span className="text-slate-400 block text-[11px] font-mono">Avoided Utility Draw</span>
          <span className="text-indigo-300 font-bold font-mono text-sm">0.0 kW (100% Green)</span>
        </div>
      </div>

    </div>
  );
};
