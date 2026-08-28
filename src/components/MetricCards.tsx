import React from 'react';
import { 
  Sun, 
  Zap, 
  BatteryCharging, 
  BatteryMedium,
  Globe, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight,
  ShieldCheck,
  Activity,
  IndianRupee,
  Leaf,
  Layers
} from 'lucide-react';
import { GridTelemetry } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface MetricCardsProps {
  telemetry: GridTelemetry;
  onSelectNode: (node: 'solar' | 'load' | 'battery' | 'grid') => void;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ telemetry, onSelectNode }) => {
  const { t, language } = useLanguage();
  const netPower = telemetry.solarKw - telemetry.loadKw;
  const isCharging = telemetry.batteryPowerKw < -0.1;
  const isDischarging = telemetry.batteryPowerKw > 0.1;
  const isExporting = telemetry.gridKw < -0.1;
  const isImporting = telemetry.gridKw > 0.1;
  const isIslanded = telemetry.gridStatus === 'Islanded (Outage)';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
      
      {/* 1. Solar Generation Card */}
      <div 
        id="card-solar-metric"
        onClick={() => onSelectNode('solar')}
        className="group relative bg-slate-900/60 hover:bg-slate-900/80 backdrop-blur-2xl rounded-2xl p-4 sm:p-5 border border-white/[0.08] hover:border-amber-500/40 transition-all duration-300 cursor-pointer shadow-xl shadow-black/40 hover:shadow-amber-500/10 ring-1 ring-white/[0.05] flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              {t.solarPv}
            </span>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" />
              +12.4%
            </span>
          </div>

          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-tight">
              {telemetry.solarKw.toFixed(1)}
            </span>
            <span className="text-xs font-mono font-semibold text-amber-400">kW</span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">
            {telemetry.irradiance} W/m² {language === 'hi' ? 'सौर विकिरण' : 'Irradiance'}
          </span>
        </div>

        <div className="mt-3.5 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-slate-400">
          <span>{language === 'hi' ? 'उत्पादन' : 'Yield'}: <strong className="text-slate-200">{telemetry.dailySolarKwh.toFixed(0)} kWh</strong></span>
          <span className="text-emerald-400 font-medium">98.4% Eff</span>
        </div>
      </div>

      {/* 2. Total Energy Consumption Card */}
      <div 
        id="card-load-metric"
        onClick={() => onSelectNode('load')}
        className="group relative bg-slate-900/60 hover:bg-slate-900/80 backdrop-blur-2xl rounded-2xl p-4 sm:p-5 border border-white/[0.08] hover:border-cyan-500/40 transition-all duration-300 cursor-pointer shadow-xl shadow-black/40 hover:shadow-cyan-500/10 ring-1 ring-white/[0.05] flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              {t.campusLoad}
            </span>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 flex items-center gap-0.5">
              <TrendingDown className="w-3 h-3 text-cyan-400" />
              -4.2% Opt
            </span>
          </div>

          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-tight">
              {telemetry.loadKw.toFixed(1)}
            </span>
            <span className="text-xs font-mono font-semibold text-cyan-400">kW</span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">
            {language === 'hi' ? '5 सक्रिय सब-बसें' : '5 Active Sub-Busses'}
          </span>
        </div>

        <div className="mt-3.5 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-slate-400">
          <span>{language === 'hi' ? 'कुल खपत' : 'Total'}: <strong className="text-slate-200">{telemetry.dailyConsumedKwh.toFixed(0)} kWh</strong></span>
          <span className="text-cyan-400 font-medium">140 kW Cap</span>
        </div>
      </div>

      {/* 3. Battery Storage (BESS) Card */}
      <div 
        id="card-battery-metric"
        onClick={() => onSelectNode('battery')}
        className="group relative bg-slate-900/60 hover:bg-slate-900/80 backdrop-blur-2xl rounded-2xl p-4 sm:p-5 border border-white/[0.08] hover:border-emerald-500/40 transition-all duration-300 cursor-pointer shadow-xl shadow-black/40 hover:shadow-emerald-500/10 ring-1 ring-white/[0.05] flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              {isCharging ? (
                <BatteryCharging className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              ) : (
                <BatteryMedium className="w-3.5 h-3.5 text-emerald-400" />
              )}
              {t.bessStorage}
            </span>
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold ${
              isCharging 
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' 
                : isDischarging
                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                : 'bg-white/5 text-slate-300 border border-white/10'
            }`}>
              {isCharging 
                ? (language === 'hi' ? 'चार्जिंग' : 'Charging') 
                : isDischarging 
                ? (language === 'hi' ? 'डिस्चार्ज' : 'Discharge') 
                : (language === 'hi' ? 'स्टैंडबाय' : 'Standby')}
            </span>
          </div>

          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-tight">
              {Math.round(telemetry.batterySoc)}%
            </span>
            <span className="text-xs font-mono text-slate-400">
              ({((telemetry.batterySoc / 100) * telemetry.batteryCapacityKwh).toFixed(0)} kWh)
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">
            {isCharging ? `+${Math.abs(telemetry.batteryPowerKw).toFixed(1)} kW` : isDischarging ? `-${Math.abs(telemetry.batteryPowerKw).toFixed(1)} kW` : (language === 'hi' ? 'फ्लोट मोड' : 'Float Mode')}
          </span>
        </div>

        <div className="mt-3.5 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-slate-400">
          <span>SoH: <strong className="text-slate-200">{telemetry.batterySoH}%</strong></span>
          <span className="text-emerald-400 font-medium">~5.4h Res</span>
        </div>
      </div>

      {/* 4. Grid Status & Net Metering Card */}
      <div 
        id="card-grid-metric"
        onClick={() => onSelectNode('grid')}
        className="group relative bg-slate-900/60 hover:bg-slate-900/80 backdrop-blur-2xl rounded-2xl p-4 sm:p-5 border border-white/[0.08] hover:border-indigo-500/40 transition-all duration-300 cursor-pointer shadow-xl shadow-black/40 hover:shadow-indigo-500/10 ring-1 ring-white/[0.05] flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
              {t.gridExchange}
            </span>
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold ${
              isIslanded
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                : isExporting
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                : 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
            }`}>
              {isIslanded 
                ? (language === 'hi' ? 'आइसोलेटेड' : 'Islanded') 
                : isExporting 
                ? (language === 'hi' ? 'नेट-निर्यात' : 'Net-Export') 
                : (language === 'hi' ? 'ग्रिड आयात' : 'Import')}
            </span>
          </div>

          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-tight">
              {isIslanded ? '0.0' : Math.abs(telemetry.gridKw).toFixed(1)}
            </span>
            <span className="text-xs font-mono font-semibold text-indigo-400">kW</span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">
            {isIslanded ? (language === 'hi' ? 'माइक्रोग्रिड ऑफलाइन' : 'Microgrid Offline') : `₹${telemetry.tariffRate}/kWh ToD Rate`}
          </span>
        </div>

        <div className="mt-3.5 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-slate-400">
          <span>Freq: <strong className="text-slate-200">{telemetry.gridFrequency.toFixed(2)} Hz</strong></span>
          <span className="text-indigo-300 font-medium">415V 3Ø</span>
        </div>
      </div>

      {/* 5. Daily Cost Savings Card */}
      <div 
        id="card-cost-metric"
        className="group relative bg-slate-900/60 hover:bg-slate-900/80 backdrop-blur-2xl rounded-2xl p-4 sm:p-5 border border-white/[0.08] hover:border-emerald-500/40 transition-all duration-300 shadow-xl shadow-black/40 ring-1 ring-white/[0.05] flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
              {t.dailySavings}
            </span>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              +18.5%
            </span>
          </div>

          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-mono font-bold text-emerald-300 tracking-tight">
              ₹{telemetry.dailySavedInr.toLocaleString('en-IN')}
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">
            {language === 'hi' ? 'सौर ऊर्जा + पीक आर्बिट्राज' : 'Solar + ToD Arbitrage'}
          </span>
        </div>

        <div className="mt-3.5 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-slate-400">
          <span>{language === 'hi' ? 'मासिक बचत' : 'Est. Monthly'}: <strong className="text-slate-200">₹1.46L</strong></span>
          <span className="text-emerald-400 font-medium">ROI 2.8 yr</span>
        </div>
      </div>

      {/* 6. CO2 Offset Card */}
      <div 
        id="card-co2-metric"
        className="group relative bg-slate-900/60 hover:bg-slate-900/80 backdrop-blur-2xl rounded-2xl p-4 sm:p-5 border border-white/[0.08] hover:border-teal-500/40 transition-all duration-300 shadow-xl shadow-black/40 ring-1 ring-white/[0.05] flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
              <Leaf className="w-3.5 h-3.5 text-teal-400" />
              {t.carbonAvoided}
            </span>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-teal-500/15 text-teal-300 border border-teal-500/30">
              {language === 'hi' ? 'स्वच्छ स्कैडा' : 'Clean SCADA'}
            </span>
          </div>

          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-mono font-bold text-teal-300 tracking-tight">
              {telemetry.co2OffsetKg.toFixed(0)}
            </span>
            <span className="text-xs font-mono font-semibold text-teal-400">kg CO₂e</span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">
            {language === 'hi' ? '~24 परिपक्व पेड़ लगाने के बराबर' : '~24 mature trees eq.'}
          </span>
        </div>

        <div className="mt-3.5 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-slate-400">
          <span>{language === 'hi' ? 'वार्षिक अनुमान' : 'Annual'}: <strong className="text-slate-200">54.2 Ton</strong></span>
          <span className="text-teal-400 font-medium">Scope-2</span>
        </div>
      </div>

    </div>
  );
};
