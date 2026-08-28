import React, { useState } from 'react';
import { 
  BarChart2, 
  TrendingUp, 
  IndianRupee, 
  Leaf, 
  Zap, 
  Sun, 
  BatteryCharging, 
  Globe, 
  ArrowUpRight, 
  ArrowDownRight,
  ShieldCheck,
  Calendar,
  Layers,
  PieChart as PieIcon,
  Activity,
  School,
  Home,
  BookOpen,
  FlaskConical,
  UtensilsCrossed,
  Sparkles
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { GridTelemetry, SubLoad } from '../types';
import { CAMPUS_24H_DEMAND_CURVE } from '../data/predictiveShiftData';

interface AnalyticsViewProps {
  telemetry: GridTelemetry;
  subLoads: SubLoad[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ telemetry, subLoads }) => {
  const [trendRange, setTrendRange] = useState<'7D' | '30D' | 'YTD'>('7D');
  const [buildingFilter, setBuildingFilter] = useState<'ALL' | 'CORE_SHIFT'>('ALL');

  // 7-day historical telemetry performance
  const weeklyTrends = [
    { day: 'Mon', solarKwh: 580, demandKwh: 490, savingsInr: 4200, co2Kg: 475, gridDependency: 14 },
    { day: 'Tue', solarKwh: 610, demandKwh: 520, savingsInr: 4650, co2Kg: 500, gridDependency: 12 },
    { day: 'Wed', solarKwh: 450, demandKwh: 505, savingsInr: 3400, co2Kg: 368, gridDependency: 26 },
    { day: 'Thu', solarKwh: 680, demandKwh: 530, savingsInr: 5120, co2Kg: 557, gridDependency: 8 },
    { day: 'Fri', solarKwh: 640, demandKwh: 510, savingsInr: 4890, co2Kg: 524, gridDependency: 10 },
    { day: 'Sat', solarKwh: 590, demandKwh: 380, savingsInr: 4300, co2Kg: 483, gridDependency: 5 },
    { day: 'Sun (Today)', solarKwh: 642, demandKwh: 512, savingsInr: 4890, co2Kg: 527, gridDependency: 9 },
  ];

  // Subload distribution data
  const subloadDistribution = subLoads.map(l => ({
    name: l.name,
    value: l.powerKw,
    status: l.status
  }));

  const COLORS = ['#06b6d4', '#f59e0b', '#10b981', '#6366f1', '#ec4899'];

  return (
    <div className="space-y-6">
      
      {/* Top Analytics Summary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-slate-900/70 backdrop-blur-2xl rounded-2xl p-5 border border-white/[0.08] shadow-xl shadow-black/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <IndianRupee className="w-3.5 h-3.5" />
              Monthly Energy Cost Savings
            </span>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              +19.4%
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-3xl font-mono font-bold text-white">₹1,46,800</span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono mt-1 block">
            ₹31,400 via Time-of-Day Arbitrage
          </span>
        </div>

        <div className="bg-slate-900/70 backdrop-blur-2xl rounded-2xl p-5 border border-white/[0.08] shadow-xl shadow-black/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
              <Leaf className="w-3.5 h-3.5" />
              Avoided Scope 2 Carbon
            </span>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-teal-500/15 text-teal-300 border border-teal-500/30">
              15.8 Tons
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-3xl font-mono font-bold text-white">15,840</span>
            <span className="text-xs font-mono text-teal-400 font-semibold">kg CO₂e</span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono mt-1 block">
            Equivalent to 720 mature trees
          </span>
        </div>

        <div className="bg-slate-900/70 backdrop-blur-2xl rounded-2xl p-5 border border-white/[0.08] shadow-xl shadow-black/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5" />
              Renewable Penetration Ratio
            </span>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
              Annual Avg
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-3xl font-mono font-bold text-white">88.2%</span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono mt-1 block">
            Grid Dependency Reduced from 68% → 11.8%
          </span>
        </div>

        <div className="bg-slate-900/70 backdrop-blur-2xl rounded-2xl p-5 border border-white/[0.08] shadow-xl shadow-black/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              Peak Demand Shaved
            </span>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
              Contract Safe
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-3xl font-mono font-bold text-white">38.5</span>
            <span className="text-xs font-mono text-cyan-400 font-semibold">kW Peak Cut</span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono mt-1 block">
            Zero Max-Demand Penalty Breaches
          </span>
        </div>

      </div>

      {/* 24-HOUR CAMPUS ENERGY DEMAND BY BUILDING (Predictive Shifting Deep Dive) */}
      <div className="bg-slate-900/70 backdrop-blur-2xl rounded-3xl p-6 border border-white/[0.08] shadow-2xl shadow-black/50 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                <Activity className="w-4 h-4 text-cyan-400" />
              </div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Campus Energy Demand by Building (24-Hour Time-Based Demand Model)
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                Predictive Shift Matrix
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                SIMULATED / ESTIMATED
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Visualizes how campus demand migrates across Hostels, Academic Lecture Halls, Laboratories, Central Library, and Canteen over 24 hours.
            </p>
          </div>

          {/* Filter Switcher */}
          <div className="flex items-center bg-black/40 backdrop-blur-md rounded-xl p-1 border border-white/[0.08] text-xs font-mono">
            <button
              onClick={() => setBuildingFilter('ALL')}
              className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                buildingFilter === 'ALL'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All 6 Building Types
            </button>
            <button
              onClick={() => setBuildingFilter('CORE_SHIFT')}
              className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                buildingFilter === 'CORE_SHIFT'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Hostel vs Academic 08:00 Shift
            </button>
          </div>
        </div>

        {/* Predictive Shift Telemetry Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6 font-mono text-xs">
          <div className="p-3 rounded-2xl bg-black/30 border border-white/[0.06]">
            <span className="text-[10px] text-slate-400 block uppercase">06:00–08:00 Morning</span>
            <span className="font-bold text-blue-300 block mt-0.5">Hostels HIGH</span>
            <span className="text-[10px] text-slate-500">Geysers & Prep (17.5 kW)</span>
          </div>

          <div className="p-3 rounded-2xl bg-black/30 border border-cyan-500/30">
            <span className="text-[10px] text-cyan-400 block uppercase font-bold">08:00–13:00 Shift</span>
            <span className="font-bold text-cyan-300 block mt-0.5">Academic HIGH</span>
            <span className="text-[10px] text-emerald-400 font-semibold">Solar Redirected (+21 kW)</span>
          </div>

          <div className="p-3 rounded-2xl bg-black/30 border border-white/[0.06]">
            <span className="text-[10px] text-slate-400 block uppercase">13:00–14:00 Lunch</span>
            <span className="font-bold text-amber-300 block mt-0.5">Canteen PEAK</span>
            <span className="text-[10px] text-slate-500">Dining Rush (18.2 kW)</span>
          </div>

          <div className="p-3 rounded-2xl bg-black/30 border border-white/[0.06]">
            <span className="text-[10px] text-slate-400 block uppercase">14:00–17:00 Afternoon</span>
            <span className="font-bold text-teal-300 block mt-0.5">Labs & Library</span>
            <span className="text-[10px] text-slate-500">Moderate Academic (20 kW)</span>
          </div>

          <div className="p-3 rounded-2xl bg-black/30 border border-white/[0.06]">
            <span className="text-[10px] text-slate-400 block uppercase">19:00–23:00 Night</span>
            <span className="font-bold text-purple-300 block mt-0.5">Hostels PEAK</span>
            <span className="text-[10px] text-slate-500">BESS Discharge (24.5 kW)</span>
          </div>

          <div className="p-3 rounded-2xl bg-black/30 border border-white/[0.06]">
            <span className="text-[10px] text-slate-400 block uppercase">23:00–06:00 Sleep</span>
            <span className="font-bold text-slate-400 block mt-0.5">Low Baselines</span>
            <span className="text-[10px] text-slate-500">Dorms Idle (12 kW)</span>
          </div>
        </div>

        {/* 24-Hour Multi-Building Chart */}
        <div className="w-full h-80 font-mono text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={CAMPUS_24H_DEMAND_CURVE} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorHostel" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="colorAcademic" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.5}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="colorSolar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0}/>
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
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              
              <Area type="monotone" dataKey="hostelDemandKw" name="Hostels (KP & QC)" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorHostel)" />
              <Area type="monotone" dataKey="academicDemandKw" name="Academic Classrooms" stroke="#06b6d4" strokeWidth={2.5} fillOpacity={1} fill="url(#colorAcademic)" />
              <Area type="monotone" dataKey="solarGenerationKw" name="Total Solar PV" stroke="#f59e0b" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#colorSolar)" />
              
              {buildingFilter === 'ALL' && (
                <>
                  <Line type="monotone" dataKey="canteenDemandKw" name="Campus Canteen" stroke="#ec4899" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="labDemandKw" name="Research Labs" stroke="#10b981" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="libraryDemandKw" name="Central Library" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="evChargingKw" name="EV Charging Depot" stroke="#6366f1" strokeWidth={1.5} dot={false} />
                </>
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 pt-3 border-t border-white/[0.06] flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 gap-2">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>AI Predictive Dispatch Rule: Clean energy surplus from vacant dorms redirected dynamically to lecture halls.</span>
          </span>
          <span className="text-emerald-400 font-bold">Waste Avoided: 18.6 kWh / day</span>
        </div>
      </div>

      {/* Main Charts: 7-Day Performance + Sub-Load Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* 7-Day Performance Trend Chart (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900/70 backdrop-blur-2xl rounded-3xl p-6 border border-white/[0.08] shadow-2xl shadow-black/50">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-white/[0.08]">
            <div>
              <div className="flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white tracking-tight">
                  7-Day Solar Generation vs Campus Demand Trends
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Daily cumulative clean energy generation vs campus power demand.
              </p>
            </div>

            <div className="flex items-center bg-black/40 backdrop-blur-md rounded-xl p-1 border border-white/[0.08] text-xs font-mono">
              {(['7D', '30D', 'YTD'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setTrendRange(r)}
                  className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                    trendRange === r
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="w-full h-72 font-mono text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyTrends} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} unit=" kWh" tickLine={false} axisLine={false} />
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
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="solarKwh" name="Solar Generation (kWh)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="demandKwh" name="Campus Demand (kWh)" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sub-Load Distribution Breakdown (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900/70 backdrop-blur-2xl rounded-3xl p-6 border border-white/[0.08] shadow-2xl shadow-black/50 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <PieIcon className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white tracking-tight">
                Active Load Distribution
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Real-time power consumption breakdown by sub-bus.
            </p>

            <div className="w-full h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={subloadDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {subloadDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                      backdropFilter: 'blur(20px)',
                      borderColor: 'rgba(255, 255, 255, 0.12)', 
                      borderRadius: '0.875rem',
                      fontSize: '11px',
                      color: '#f8fafc',
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 text-xs font-mono mt-2">
              {subLoads.map((load, idx) => (
                <div key={load.id} className="flex items-center justify-between text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                    <span className="truncate max-w-[140px] text-[11px]">{load.name}</span>
                  </div>
                  <span className="font-bold text-white">{load.powerKw.toFixed(1)} kW</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/[0.06] text-[11px] font-mono text-emerald-400 flex items-center justify-between">
            <span>Flexible Margin: 42.5 kW</span>
            <span>Zero Waste</span>
          </div>
        </div>

      </div>

    </div>
  );
};
