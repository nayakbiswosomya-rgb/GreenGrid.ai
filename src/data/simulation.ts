import { 
  GridTelemetry, 
  HourlyForecastPoint, 
  SubLoad, 
  AlertItem,
  CampusBuilding,
  ScenarioPreset 
} from '../types';
import { KIIT_CAMPUS_BUILDINGS } from './kiitCampusData';

export const INITIAL_SUB_LOADS: SubLoad[] = [
  {
    id: 'load-ind',
    name: 'Industrial Motors & CNC Lines',
    category: 'Industrial / Manufacturing',
    powerKw: 42,
    nominalKw: 45,
    priority: 'Critical',
    status: 'Active',
    controllable: false,
  },
  {
    id: 'load-hvac',
    name: 'Central Chiller & HVAC System',
    category: 'HVAC & Climate',
    powerKw: 26,
    nominalKw: 32,
    priority: 'Flexible',
    status: 'Optimized',
    controllable: true,
  },
  {
    id: 'load-ev',
    name: 'EV Fast Charging Plaza (4 Bays)',
    category: 'EV Charging Hub',
    powerKw: 18,
    nominalKw: 24,
    priority: 'Flexible',
    status: 'Eco-Throttled',
    controllable: true,
  },
  {
    id: 'load-dc',
    name: 'Microgrid SCADA & Edge Server',
    category: 'Essential Data Center',
    powerKw: 8,
    nominalKw: 8,
    priority: 'Critical',
    status: 'Active',
    controllable: false,
  },
  {
    id: 'load-light',
    name: 'Campus LED & Smart Auxiliary',
    category: 'Smart Lighting',
    powerKw: 4,
    nominalKw: 6,
    priority: 'Deferrable',
    status: 'Optimized',
    controllable: true,
  },
];

export const INITIAL_TELEMETRY: GridTelemetry = {
  solarKw: 125.4,
  loadKw: 98.0,
  batterySoc: 82,
  batteryPowerKw: -22.5, // charging from solar surplus
  batteryCapacityKwh: 250,
  batterySoH: 98.6,
  gridKw: -4.9, // negative = net export
  gridStatus: 'Normal',
  gridFrequency: 50.02,
  gridVoltage: 415,
  tariffRate: 8.5,
  dailySolarKwh: 642.5,
  dailyConsumedKwh: 512.0,
  dailyExportedKwh: 130.5,
  dailySavedInr: 4890,
  co2OffsetKg: 526.8,
  weather: 'Sunny',
  temperature: 32.4,
  irradiance: 840,
};

export const INITIAL_ALERTS: AlertItem[] = [
  {
    id: 'alt-1',
    title: 'ToD Peak Tariff Window Approaching (18:00 - 22:00)',
    description: 'Autonomous BESS pre-charging active to reach 95% SoC. Scheduled to shave peak ₹12.5/kWh tariff.',
    severity: 'warning',
    timestamp: '2 mins ago',
    code: 'TOD_TARIFF_PREP',
    resolved: false,
    actionLabel: 'Pre-Charging',
  },
  {
    id: 'alt-2',
    title: 'High Solar Surplus Generated (Net-Metering Export Active)',
    description: 'Campus generating +27.4 kW surplus clean energy. Inverting to local grid feed with zero penalty.',
    severity: 'success',
    timestamp: '14 mins ago',
    code: 'SOLAR_EXPORT_SURPLUS',
    resolved: false,
    actionLabel: 'Exporting',
  },
  {
    id: 'alt-3',
    title: 'HVAC Compressor Modulated (AI Load Balancing)',
    description: 'Chiller setpoint increased 0.8°C automatically without thermal breach to preserve battery buffer.',
    severity: 'info',
    timestamp: '32 mins ago',
    code: 'LOAD_SHED_OPTIMIZE',
    resolved: true,
    actionLabel: 'Balanced',
  },
];

export function generate24HourForecast(): HourlyForecastPoint[] {
  const hours = [
    '00:00', '02:00', '04:00', '06:00', '08:00', '10:00',
    '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'
  ];

  const points: HourlyForecastPoint[] = [];

  for (let i = 0; i < hours.length; i++) {
    const time = hours[i];
    let solarKw = 0;
    let baseDemand = 40;
    let tariff = 6.5;

    // Solar bell curve peak around noon (12:00)
    if (i >= 3 && i <= 9) {
      const peakFactor = Math.sin(((i - 3) / 6) * Math.PI);
      solarKw = Math.round(peakFactor * 145);
    }

    // Industrial / Academic diurnal load
    if (i >= 4 && i <= 10) {
      baseDemand = 85 + Math.round(Math.sin(((i - 4) / 6) * Math.PI) * 45);
    }

    // Evening Peak Tariff Window (18:00 - 22:00)
    if (i >= 8 && i <= 10) {
      tariff = 12.5;
    } else if (i >= 4 && i <= 7) {
      tariff = 8.5;
    }

    const net = solarKw - baseDemand;
    let batterySoc = 75;

    if (i <= 3) batterySoc = 60 - i * 5;
    else if (i <= 7) batterySoc = Math.min(98, 45 + (i - 3) * 14);
    else if (i <= 10) batterySoc = Math.max(35, 95 - (i - 7) * 18);
    else batterySoc = 40;

    points.push({
      time,
      solarKw,
      predictedLoadKw: baseDemand,
      actualLoadKw: i <= 6 ? baseDemand + (Math.random() * 8 - 4) : undefined,
      batterySoc: Math.round(batterySoc),
      tariff,
      gridExchange: Number(net.toFixed(1)),
    });
  }

  return points;
}

export const INITIAL_CAMPUS_BUILDINGS: CampusBuilding[] = KIIT_CAMPUS_BUILDINGS;

export const SCENARIO_PRESETS: ScenarioPreset[] = [
  {
    id: 'sc-hostel-shift',
    name: '🎓 Students Leave Hostels — 8:00 AM',
    icon: 'GraduationCap',
    tagline: 'Predictive Campus Demand Shift: Hostels 8kW→2kW, Academic Block 3kW→10kW',
    solarKw: 38.0,
    loadKw: 36.5,
    batterySoc: 72,
    tariffRate: 8.5,
    weather: 'Sunny',
    systemMode: 'AI_AUTO',
    gridStatus: 'Normal',
    withoutAi: {
      gridDependencyPercent: 54,
      hourlyCostInr: 485,
      carbonKgPerHour: 36,
      peakDeficitKw: 18,
    },
    withAi: {
      gridDependencyPercent: 8,
      hourlyCostInr: 65,
      carbonKgPerHour: 5,
      peakDeficitKw: 0,
      estimatedSavingsInr: 420,
      co2AvoidedKg: 31,
      recommendation: 'At 08:00 AM, hostel occupancy decreases as students move to classes. GreenGrid AI identifies the shift, prioritizing renewable allocation to Academic Blocks & BESS.',
    },
  },
  {
    id: 'sc-normal',
    name: 'Normal Day',
    icon: 'Sun',
    tagline: 'Standard sunny diurnal cycle with balanced load',
    solarKw: 125.4,
    loadKw: 98.0,
    batterySoc: 82,
    tariffRate: 8.5,
    weather: 'Sunny',
    systemMode: 'AI_AUTO',
    gridStatus: 'Normal',
    withoutAi: {
      gridDependencyPercent: 48,
      hourlyCostInr: 833,
      carbonKgPerHour: 42,
      peakDeficitKw: 25,
    },
    withAi: {
      gridDependencyPercent: 12,
      hourlyCostInr: 102,
      carbonKgPerHour: 8,
      peakDeficitKw: 0,
      estimatedSavingsInr: 731,
      co2AvoidedKg: 34,
      recommendation: 'Autonomous BESS arbitrage pre-charges storage to 95% before 6 PM peak tariff window.',
    },
  },
  {
    id: 'sc-cloudy',
    name: 'Cloudy Day',
    icon: 'CloudSun',
    tagline: '50% Solar reduction with intermittent irradiance dips',
    solarKw: 62.0,
    loadKw: 94.0,
    batterySoc: 70,
    tariffRate: 8.5,
    weather: 'Partly Cloudy',
    systemMode: 'AI_AUTO',
    gridStatus: 'Normal',
    withoutAi: {
      gridDependencyPercent: 62,
      hourlyCostInr: 960,
      carbonKgPerHour: 58,
      peakDeficitKw: 32,
    },
    withAi: {
      gridDependencyPercent: 26,
      hourlyCostInr: 340,
      carbonKgPerHour: 22,
      peakDeficitKw: 8,
      estimatedSavingsInr: 620,
      co2AvoidedKg: 36,
      recommendation: 'AI dynamically throttles non-critical HVAC and delays flexible EV charging during cloud cover.',
    },
  },
  {
    id: 'sc-monsoon',
    name: 'Heavy Rain / Monsoon',
    icon: 'CloudRain',
    tagline: 'Severe overcast with only 25kW diffuse solar yield',
    solarKw: 24.0,
    loadKw: 86.0,
    batterySoc: 55,
    tariffRate: 8.5,
    weather: 'Rainy / Monsoon',
    systemMode: 'PEAK_SHAVING',
    gridStatus: 'Normal',
    withoutAi: {
      gridDependencyPercent: 78,
      hourlyCostInr: 1120,
      carbonKgPerHour: 72,
      peakDeficitKw: 62,
    },
    withAi: {
      gridDependencyPercent: 38,
      hourlyCostInr: 480,
      carbonKgPerHour: 34,
      peakDeficitKw: 18,
      estimatedSavingsInr: 640,
      co2AvoidedKg: 38,
      recommendation: 'Controlled battery discharge scheduled during highest tariff slots; deferrable loads shed.',
    },
  },
  {
    id: 'sc-peak',
    name: 'Peak Demand Spike',
    icon: 'Flame',
    tagline: 'Full campus operations + simultaneous EV fleet arrival',
    solarKw: 110.0,
    loadKw: 138.0,
    batterySoc: 85,
    tariffRate: 12.5,
    weather: 'Sunny',
    systemMode: 'PEAK_SHAVING',
    gridStatus: 'Peak Demand',
    withoutAi: {
      gridDependencyPercent: 68,
      hourlyCostInr: 1725,
      carbonKgPerHour: 95,
      peakDeficitKw: 48,
    },
    withAi: {
      gridDependencyPercent: 18,
      hourlyCostInr: 310,
      carbonKgPerHour: 24,
      peakDeficitKw: 0,
      estimatedSavingsInr: 1415,
      co2AvoidedKg: 71,
      recommendation: 'Peak-shaving algorithm injects 38kW from BESS to prevent exceeding the 140kW contract demand cap.',
    },
  },
  {
    id: 'sc-outage',
    name: 'Grid Failure (Outage)',
    icon: 'ZapOff',
    tagline: 'Complete 11kV utility blackout; Microgrid islanded',
    solarKw: 120.0,
    loadKw: 92.0,
    batterySoc: 80,
    tariffRate: 0,
    weather: 'Sunny',
    systemMode: 'STORM_GUARD',
    gridStatus: 'Islanded (Outage)',
    withoutAi: {
      gridDependencyPercent: 100,
      hourlyCostInr: 2800,
      carbonKgPerHour: 180,
      peakDeficitKw: 92,
    },
    withAi: {
      gridDependencyPercent: 0,
      hourlyCostInr: 0,
      carbonKgPerHour: 0,
      peakDeficitKw: 0,
      estimatedSavingsInr: 2800,
      co2AvoidedKg: 180,
      recommendation: 'Microgrid formed instant black-start island. Solar PV + BESS supply 100% of critical & essential circuits.',
    },
  },
  {
    id: 'sc-lowbat',
    name: 'Low Battery (20% SoC)',
    icon: 'BatteryLow',
    tagline: 'Depleted storage requiring controlled smart recharge',
    solarKw: 135.0,
    loadKw: 88.0,
    batterySoc: 22,
    tariffRate: 8.5,
    weather: 'Sunny',
    systemMode: 'GREEN_MAX',
    gridStatus: 'Normal',
    withoutAi: {
      gridDependencyPercent: 42,
      hourlyCostInr: 748,
      carbonKgPerHour: 38,
      peakDeficitKw: 0,
    },
    withAi: {
      gridDependencyPercent: 5,
      hourlyCostInr: 45,
      carbonKgPerHour: 4,
      peakDeficitKw: 0,
      estimatedSavingsInr: 703,
      co2AvoidedKg: 34,
      recommendation: 'Surplus 47kW solar directed entirely to high-rate BESS charging to restore 70% SoC within 90 minutes.',
    },
  },
  {
    id: 'sc-tariff',
    name: 'High Peak ToD Tariff',
    icon: 'IndianRupee',
    tagline: 'Evening peak window tariff surges to ₹14.00/kWh',
    solarKw: 15.0,
    loadKw: 108.0,
    batterySoc: 92,
    tariffRate: 14.0,
    weather: 'Night / Twilight',
    systemMode: 'PEAK_SHAVING',
    gridStatus: 'Peak Demand',
    withoutAi: {
      gridDependencyPercent: 86,
      hourlyCostInr: 1512,
      carbonKgPerHour: 78,
      peakDeficitKw: 93,
    },
    withAi: {
      gridDependencyPercent: 12,
      hourlyCostInr: 180,
      carbonKgPerHour: 11,
      peakDeficitKw: 0,
      estimatedSavingsInr: 1332,
      co2AvoidedKg: 67,
      recommendation: 'AI maximizes battery discharge (45kW) and curtails EV bays to eliminate expensive peak grid import.',
    },
  },
];
