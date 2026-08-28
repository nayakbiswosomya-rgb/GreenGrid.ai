import React, { useState, useEffect } from 'react';
import { 
  Sun, 
  CloudSun, 
  CloudRain, 
  Moon, 
  Wind, 
  Thermometer, 
  Droplets, 
  Zap, 
  BrainCircuit, 
  RefreshCw, 
  MapPin, 
  Compass, 
  AlertTriangle, 
  ShieldCheck, 
  Sparkles, 
  TrendingUp, 
  Eye, 
  BarChart3, 
  Activity, 
  Layers, 
  ChevronRight,
  Info
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { WeatherCondition, GridTelemetry } from '../types';
import { 
  MICROGRID_LOCATIONS, 
  generate7DayWeatherForecast, 
  generate24HourWeatherForecast 
} from '../data/weatherData';

interface WeatherForecastSectionProps {
  currentWeather: WeatherCondition;
  onWeatherChange: (w: WeatherCondition) => void;
  telemetry: GridTelemetry;
}

export const WeatherForecastSection: React.FC<WeatherForecastSectionProps> = ({
  currentWeather,
  onWeatherChange,
  telemetry,
}) => {
  const [selectedLocationId, setSelectedLocationId] = useState<string>('iit-kgp');
  const [isFetchingLive, setIsFetchingLive] = useState(false);
  const [activeTab, setActiveTab] = useState<'24h' | '7day' | 'ai_insights'>('24h');
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);

  const selectedLoc = MICROGRID_LOCATIONS.find(l => l.id === selectedLocationId) || MICROGRID_LOCATIONS[0];
  const forecast7Days = generate7DayWeatherForecast(selectedLocationId, currentWeather);
  const hourly24h = generate24HourWeatherForecast(currentWeather, selectedLocationId);

  const activeDay = forecast7Days[selectedDayIdx] || forecast7Days[0];

  // Thermal derating calculation (-0.38% per °C over 25°C standard test condition)
  const ambientTemp = telemetry.temperature || 32.4;
  const cellTemp = Number((ambientTemp + (telemetry.irradiance / 800) * 28).toFixed(1));
  const thermalDeratingPercent = Math.max(0, Number(((cellTemp - 25) * 0.38).toFixed(1)));

  // Clean energy yield estimation for today
  const estTodayKwh = activeDay.estimatedSolarKwh;

  const handleSyncLiveMet = async () => {
    setIsFetchingLive(true);
    try {
      // Attempt live Open-Meteo fetch for solar irradiance and temperature
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${selectedLoc.lat}&longitude=${selectedLoc.lon}&current=temperature_2m,relative_humidity_2m,direct_normal_irradiance,global_tilted_irradiance,cloud_cover,wind_speed_10m&hourly=temperature_2m,cloud_cover,direct_normal_irradiance&forecast_days=3`
      );
      if (res.ok) {
        const data = await res.json();
        if (data.current) {
          const cloud = data.current.cloud_cover ?? 20;
          if (cloud > 75) {
            onWeatherChange('Rainy / Monsoon');
          } else if (cloud > 35) {
            onWeatherChange('Partly Cloudy');
          } else {
            onWeatherChange('Sunny');
          }
        }
      }
    } catch {
      // Graceful fallback to physics simulation
    } finally {
      setTimeout(() => setIsFetchingLive(false), 600);
    }
  };

  const getWeatherIcon = (cond: WeatherCondition, className = "w-5 h-5") => {
    switch (cond) {
      case 'Sunny':
        return <Sun className={`${className} text-amber-400`} />;
      case 'Partly Cloudy':
        return <CloudSun className={`${className} text-sky-400`} />;
      case 'Rainy / Monsoon':
        return <CloudRain className={`${className} text-indigo-400`} />;
      case 'Night / Twilight':
        return <Moon className={`${className} text-purple-400`} />;
    }
  };

  return (
    <div className="bg-slate-900/70 backdrop-blur-2xl rounded-3xl p-6 sm:p-7 lg:p-8 border border-white/[0.08] shadow-2xl shadow-black/50 relative overflow-hidden ring-1 ring-white/[0.06] space-y-6">
      
      {/* Subtle Background Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/[0.04] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-sky-500/[0.04] rounded-full blur-3xl pointer-events-none" />

      {/* Top Header & Microgrid Site Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-white/[0.08] relative z-10">
        
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono text-[11px] font-bold flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
              SOLAR METEOROLOGY & FORECAST
            </span>
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              {selectedLoc.name} ({selectedLoc.climateZone})
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            Solar Irradiance & Weather Dispatch Center
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Real-time Global Horizontal Irradiance (GHI), thermal PV derating analysis, and 7-day predictive yield generation for campus microgrid dispatch.
          </p>
        </div>

        {/* Site Picker & Live Sync Controls */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          
          {/* Location Dropdown */}
          <div className="flex items-center bg-black/40 backdrop-blur-md rounded-xl px-3 py-1.5 border border-white/[0.08] text-xs font-mono text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-emerald-400 mr-2 shrink-0" />
            <select
              id="select-weather-location"
              aria-label="Select Campus Microgrid Location"
              value={selectedLocationId}
              onChange={(e) => setSelectedLocationId(e.target.value)}
              className="bg-transparent text-slate-200 text-xs font-bold focus:outline-none cursor-pointer pr-2"
            >
              {MICROGRID_LOCATIONS.map(loc => (
                <option key={loc.id} value={loc.id} className="bg-slate-900 text-slate-100">
                  {loc.name} ({loc.state})
                </option>
              ))}
            </select>
          </div>

          {/* Sync Live Met Button */}
          <button
            id="btn-sync-live-weather"
            onClick={handleSyncLiveMet}
            disabled={isFetchingLive}
            className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5 transition active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetchingLive ? 'animate-spin' : ''}`} />
            <span>{isFetchingLive ? 'Syncing...' : 'Sync Met'}</span>
          </button>

          {/* Quick Weather Simulator Switcher */}
          <div className="flex items-center bg-black/40 rounded-xl p-1 border border-white/[0.08] text-xs">
            <button
              onClick={() => onWeatherChange('Sunny')}
              className={`p-1.5 rounded-lg transition cursor-pointer ${currentWeather === 'Sunny' ? 'bg-amber-500/25 text-amber-300' : 'text-slate-400 hover:text-slate-200'}`}
              title="Simulate Sunny"
              aria-label="Simulate Sunny"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onWeatherChange('Partly Cloudy')}
              className={`p-1.5 rounded-lg transition cursor-pointer ${currentWeather === 'Partly Cloudy' ? 'bg-sky-500/25 text-sky-300' : 'text-slate-400 hover:text-slate-200'}`}
              title="Simulate Partly Cloudy"
              aria-label="Simulate Partly Cloudy"
            >
              <CloudSun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onWeatherChange('Rainy / Monsoon')}
              className={`p-1.5 rounded-lg transition cursor-pointer ${currentWeather === 'Rainy / Monsoon' ? 'bg-indigo-500/25 text-indigo-300' : 'text-slate-400 hover:text-slate-200'}`}
              title="Simulate Monsoon Rain"
              aria-label="Simulate Monsoon Rain"
            >
              <CloudRain className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onWeatherChange('Night / Twilight')}
              className={`p-1.5 rounded-lg transition cursor-pointer ${currentWeather === 'Night / Twilight' ? 'bg-purple-500/25 text-purple-300' : 'text-slate-400 hover:text-slate-200'}`}
              title="Simulate Night"
              aria-label="Simulate Night"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

      {/* Primary Meteorological Sensor Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono">
        
        {/* Metric 1: Solar Irradiance */}
        <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.07] hover:border-amber-500/30 transition">
          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <span className="flex items-center gap-1">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              Global Irradiance
            </span>
            <span className="text-[10px] text-amber-400 font-bold">GHI</span>
          </div>
          <div className="mt-1.5 flex items-baseline gap-1">
            <span className="text-xl font-bold text-white">
              {telemetry.irradiance}
            </span>
            <span className="text-xs text-slate-400">W/m²</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500">
            <span>DNI: {Math.round(telemetry.irradiance * 0.82)} W/m²</span>
            <span className="text-amber-400 font-semibold">{telemetry.irradiance > 700 ? 'High' : telemetry.irradiance > 300 ? 'Moderate' : 'Low'}</span>
          </div>
        </div>

        {/* Metric 2: Cloud Cover & Optical Attenuation */}
        <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.07] hover:border-sky-500/30 transition">
          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <span className="flex items-center gap-1">
              <CloudSun className="w-3.5 h-3.5 text-sky-400" />
              Cloud Cover
            </span>
            <span className="text-[10px] text-sky-400 font-bold">OCTA</span>
          </div>
          <div className="mt-1.5 flex items-baseline gap-1">
            <span className="text-xl font-bold text-white">
              {activeDay.cloudCoverPercent}%
            </span>
            <span className="text-xs text-slate-400">coverage</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500">
            <span>PV Atten: -{Math.round((activeDay.cloudCoverPercent * 0.75))}%</span>
            <span className="text-sky-400">{activeDay.cloudCoverPercent < 25 ? 'Clear' : 'Scattered'}</span>
          </div>
        </div>

        {/* Metric 3: Ambient & Cell Temperature */}
        <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.07] hover:border-rose-500/30 transition">
          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <span className="flex items-center gap-1">
              <Thermometer className="w-3.5 h-3.5 text-rose-400" />
              Ambient / Cell
            </span>
            <span className="text-[10px] text-rose-400 font-bold">TEMP</span>
          </div>
          <div className="mt-1.5 flex items-baseline gap-1">
            <span className="text-xl font-bold text-white">
              {ambientTemp}°C
            </span>
            <span className="text-xs text-slate-400">/ {cellTemp}°C</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-[10px]">
            <span className="text-slate-500">Loss:</span>
            <span className="text-rose-400 font-semibold">-{thermalDeratingPercent}% derate</span>
          </div>
        </div>

        {/* Metric 4: Wind Speed & Micro-Turbine Output */}
        <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.07] hover:border-teal-500/30 transition">
          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <span className="flex items-center gap-1">
              <Wind className="w-3.5 h-3.5 text-teal-400" />
              Wind Speed
            </span>
            <span className="text-[10px] text-teal-400 font-bold">WIND</span>
          </div>
          <div className="mt-1.5 flex items-baseline gap-1">
            <span className="text-xl font-bold text-white">
              {activeDay.windSpeedMs}
            </span>
            <span className="text-xs text-slate-400">m/s</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500">
            <span>Turbine Yield:</span>
            <span className="text-teal-400 font-semibold">{(activeDay.windSpeedMs * 1.8).toFixed(1)} kW</span>
          </div>
        </div>

        {/* Metric 5: Estimated Clean Energy Yield */}
        <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.07] hover:border-emerald-500/30 transition">
          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <span className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              Day Solar Yield
            </span>
            <span className="text-[10px] text-emerald-400 font-bold">YIELD</span>
          </div>
          <div className="mt-1.5 flex items-baseline gap-1">
            <span className="text-xl font-bold text-emerald-300">
              {estTodayKwh}
            </span>
            <span className="text-xs text-slate-400">kWh</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500">
            <span>Peak Hours:</span>
            <span className="text-emerald-400 font-semibold">5.4 PSH</span>
          </div>
        </div>

        {/* Metric 6: Outage / Grid Contingency Risk */}
        <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.07] hover:border-cyan-500/30 transition">
          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              Grid Stability
            </span>
            <span className="text-[10px] text-cyan-400 font-bold">RISK</span>
          </div>
          <div className="mt-1.5 flex items-baseline gap-1">
            <span className={`text-xl font-bold ${
              activeDay.outageRisk === 'High' ? 'text-rose-400' : activeDay.outageRisk === 'Moderate' ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {activeDay.outageRisk}
            </span>
            <span className="text-xs text-slate-400">risk</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500">
            <span>Rain Prob:</span>
            <span className="text-slate-300 font-semibold">{activeDay.rainProbability}%</span>
          </div>
        </div>

      </div>

      {/* Navigation Tabs for Weather Analysis */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
        <div className="flex items-center gap-2">
          <button
            id="tab-weather-24h"
            onClick={() => setActiveTab('24h')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === '24h'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>24-Hour Solar Radiation Curve</span>
          </button>

          <button
            id="tab-weather-7day"
            onClick={() => setActiveTab('7day')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === '7day'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>7-Day Meteorological Outlook</span>
          </button>

          <button
            id="tab-weather-ai-insights"
            onClick={() => setActiveTab('ai_insights')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'ai_insights'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
            }`}
          >
            <BrainCircuit className="w-3.5 h-3.5" />
            <span>AI Weather Dispatch Advisory</span>
          </button>
        </div>

        <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
          Model: SolCast GHI + ECMWF-IFS 0.1°
        </span>
      </div>

      {/* Tab 1: 24-Hour Solar Curve Chart */}
      {activeTab === '24h' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Diurnal Solar Irradiance (W/m²) & Photovoltaic Power Output (kW)</span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-amber-400">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                Solar Irradiance (W/m²)
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                PV Generation (kW)
              </span>
              <span className="flex items-center gap-1.5 text-sky-400">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                Cloud Cover (%)
              </span>
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourly24h} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIrr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorSolar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorCloud" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
                <XAxis dataKey="timeLabel" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis yAxisId="left" stroke="#94a3b8" fontSize={11} tickLine={false} domain={[0, 1000]} />
                <YAxis yAxisId="right" orientation="right" stroke="#10b981" fontSize={11} tickLine={false} domain={[0, selectedLoc.nominalPvKw]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#f8fafc',
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
                  }}
                  formatter={(val: any, name: string) => {
                    if (name === 'Irradiance') return [`${val} W/m²`, 'GHI Irradiance'];
                    if (name === 'PV Power') return [`${val} kW`, 'Estimated Solar Output'];
                    if (name === 'Cloud Cover') return [`${val}%`, 'Cloud Cover'];
                    if (name === 'Temperature') return [`${val}°C`, 'Ambient Temp'];
                    return [val, name];
                  }}
                />
                <Area yAxisId="left" type="monotone" dataKey="irradiance" name="Irradiance" stroke="#f59e0b" fillOpacity={1} fill="url(#colorIrr)" strokeWidth={2} />
                <Area yAxisId="right" type="monotone" dataKey="expectedSolarKw" name="PV Power" stroke="#10b981" fillOpacity={1} fill="url(#colorSolar)" strokeWidth={2.5} />
                <Area yAxisId="left" type="monotone" dataKey="cloudCover" name="Cloud Cover" stroke="#38bdf8" fillOpacity={1} fill="url(#colorCloud)" strokeWidth={1.5} strokeDasharray="4 4" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Tab 2: 7-Day Multi-Day Outlook Cards */}
      {activeTab === '7day' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {forecast7Days.map((day, idx) => {
            const isSelected = selectedDayIdx === idx;
            return (
              <button
                key={day.dayName + idx}
                onClick={() => setSelectedDayIdx(idx)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? 'bg-slate-800/90 border-amber-500/50 ring-2 ring-amber-500/20 shadow-lg shadow-amber-950/30'
                    : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.12]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-mono text-white">{day.dayName}</span>
                    <span className="text-[10px] font-mono text-slate-400">{day.date}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    {getWeatherIcon(day.condition, "w-6 h-6")}
                    <span className="text-xs font-semibold text-slate-200 truncate">{day.condition}</span>
                  </div>
                </div>

                <div className="space-y-1 pt-2 border-t border-white/[0.06] font-mono text-[11px]">
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">Temp:</span>
                    <span className="font-bold">{day.tempMax}° / {day.tempMin}°</span>
                  </div>
                  <div className="flex justify-between text-amber-300">
                    <span className="text-slate-400">Peak GHI:</span>
                    <span className="font-bold">{day.irradiancePeak} W/m²</span>
                  </div>
                  <div className="flex justify-between text-emerald-300">
                    <span className="text-slate-400">Est Yield:</span>
                    <span className="font-bold">{day.estimatedSolarKwh} kWh</span>
                  </div>
                </div>

                <div className="pt-1">
                  <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${
                    day.outageRisk === 'High' 
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' 
                      : day.outageRisk === 'Moderate'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}>
                    {day.outageRisk} Risk
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Tab 3: AI Solar-Meteorological Autonomous Dispatch Strategy */}
      {activeTab === 'ai_insights' && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900/60 to-teal-950/40 border border-emerald-500/30 space-y-4">
          <div className="flex items-center gap-2.5 text-emerald-300 font-mono text-xs font-bold">
            <BrainCircuit className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>AUTONOMOUS WEATHER-AWARE DISPATCH LOGIC (SIH AI ENGINE)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.08] space-y-1.5">
              <span className="text-amber-400 font-bold flex items-center gap-1">
                <Sun className="w-3.5 h-3.5" />
                1. Solar Surplus Self-Consumption
              </span>
              <p className="text-slate-300 text-[11px] font-sans">
                Predicts solar noon peak (11:30 - 14:00) with irradiance &gt; 850 W/m². Schedules EV Charging Bay clusters and HVAC chillers to consume zero-marginal-cost renewable electrons directly on-site.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.08] space-y-1.5">
              <span className="text-indigo-400 font-bold flex items-center gap-1">
                <CloudRain className="w-3.5 h-3.5" />
                2. Monsoon & Cloud Intermittency Guard
              </span>
              <p className="text-slate-300 text-[11px] font-sans">
                When cloud attenuation &gt; 50% or thunderstorms are forecasted within 3 hours, BESS automatically charges to 95% SoC from base solar to prevent grid import spike penalties.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.08] space-y-1.5">
              <span className="text-rose-400 font-bold flex items-center gap-1">
                <Thermometer className="w-3.5 h-3.5" />
                3. High Ambient Heat Derating Mitigation
              </span>
              <p className="text-slate-300 text-[11px] font-sans">
                When cell temperatures exceed 50°C, the AI factors a -9.5% efficiency loss and dynamically coordinates micro-wind turbine inverters to maintain campus voltage stability.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong>Selected Day Action:</strong> {activeDay.aiAdvisory}
              </span>
            </div>
            <span className="font-mono text-[10px] text-emerald-400 font-bold uppercase tracking-wider shrink-0 ml-2">
              Dispatch Mode: {activeDay.outageRisk === 'High' ? 'STORM_GUARD' : 'AI_AUTO'}
            </span>
          </div>
        </div>
      )}

    </div>
  );
};
