export type WeatherCondition = 'Sunny' | 'Partly Cloudy' | 'Rainy / Monsoon' | 'Night / Twilight';
export type SubscriptionTier = 'starter' | 'pro' | 'enterprise';
export type BillingCycle = 'monthly' | 'annually';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'Facility Manager' | 'SCADA Grid Dispatcher' | 'Sustainability Auditor' | 'Energy Engineer';
  facility: string;
  tier: SubscriptionTier;
  avatarUrl?: string;
  billingCycle: BillingCycle;
  joinedDate: string;
  nextBillingDate: string;
}

export interface SubscriptionPlan {
  id: SubscriptionTier;
  name: string;
  tagline: string;
  badge?: string;
  priceMonthlyInr: number;
  priceAnnuallyInr: number;
  maxSolarCapacityKw: number;
  maxBatteryCapacityKwh: number;
  features: {
    label: string;
    included: boolean;
    highlight?: boolean;
  }[];
  color: string;
  popular?: boolean;
}

export type GridStatusType = 'Normal' | 'Peak Demand' | 'Islanded (Outage)' | 'Eco Feed-In' | 'Frequency Alert';

export type SystemModeType = 'AI_AUTO' | 'PEAK_SHAVING' | 'GREEN_MAX' | 'STORM_GUARD' | 'MANUAL';

export interface GridTelemetry {
  solarKw: number;
  loadKw: number;
  batterySoc: number; // 0 - 100%
  batteryPowerKw: number; // positive = discharging to loads, negative = charging
  batteryCapacityKwh: number; // max capacity (e.g., 250 kWh)
  batterySoH: number; // State of Health % (e.g. 98.4%)
  gridKw: number; // positive = importing from grid, negative = exporting to grid
  gridStatus: GridStatusType;
  gridFrequency: number; // e.g. 50.02 Hz
  gridVoltage: number; // e.g. 415 V (3-phase standard)
  tariffRate: number; // ₹ per kWh
  dailySolarKwh: number;
  dailyConsumedKwh: number;
  dailyExportedKwh: number;
  dailySavedInr: number;
  co2OffsetKg: number;
  weather: WeatherCondition;
  temperature: number;
  irradiance: number; // W/m²
}

export interface SubLoad {
  id: string;
  name: string;
  category: 'Industrial / Manufacturing' | 'HVAC & Climate' | 'EV Charging Hub' | 'Smart Lighting' | 'Essential Data Center';
  powerKw: number;
  nominalKw: number;
  priority: 'Critical' | 'Flexible' | 'Deferrable';
  status: 'Active' | 'Optimized' | 'Shed' | 'Eco-Throttled';
  controllable: boolean;
}

export interface AlertItem {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'warning' | 'info' | 'success';
  timestamp: string;
  code: string;
  resolved: boolean;
  actionLabel?: string;
}

export interface HourlyForecastPoint {
  time: string;
  solarKw: number;
  predictedLoadKw: number;
  actualLoadKw?: number;
  batterySoc: number;
  tariff: number;
  gridExchange: number; // + import, - export
}

export interface AIAdvisorResult {
  summary: string;
  actionPlan: string[];
  predictedSavings: string | number;
  carbonAvoided: string | number;
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  sihJudgePitch: string;
}

export interface WeatherForecastDay {
  date: string;
  dayName: string;
  condition: WeatherCondition;
  tempMin: number;
  tempMax: number;
  irradiancePeak: number; // W/m²
  estimatedSolarKwh: number;
  windSpeedMs: number;
  rainProbability: number; // %
  cloudCoverPercent: number; // %
  uvIndex: number;
  airQualityIndex: number; // AQI
  outageRisk: 'Low' | 'Moderate' | 'High';
  aiAdvisory: string;
}

export interface WeatherHourlyForecast {
  hour: string;
  timeLabel: string;
  temp: number;
  irradiance: number; // W/m²
  cloudCover: number; // %
  windSpeed: number; // m/s
  expectedSolarKw: number;
  expectedWindKw: number;
  rainProb: number;
}

export interface MicrogridLocation {
  id: string;
  name: string;
  state: string;
  lat: number;
  lon: number;
  nominalPvKw: number;
  nominalBatteryKwh: number;
  climateZone: string;
  elevationM: number;
}

export type NavigationView = 
  | 'overview'
  | 'dashboard'
  | 'autopilot'
  | 'weather'
  | 'energy_flow'
  | 'digital_twin'
  | 'scenarios'
  | 'predictions'
  | 'analytics'
  | 'simulator'
  | 'alerts';

export type BuildingCategory = 'Boys Hostel' | 'Girls Hostel' | 'Academic' | 'Residential' | 'Research' | 'Facility' | 'Mobility';

export interface CampusBuilding {
  id: string;
  name: string;
  code?: string; // e.g. "KP-1", "QC-1", "SCE-C15"
  type: BuildingCategory;
  campusZone?: string; // e.g. "Campus 1-3", "Campus 6-8", "Campus 12-15", "Campus 17-25"
  occupancy?: number; // student or staff capacity
  iconName: string;
  currentLoadKw: number;
  nominalLoadKw: number;
  solarAllocationKw: number;
  efficiencyPercent: number;
  aiStatus: 'Optimized' | 'Normal' | 'Throttled' | 'Anomaly Detected';
  hasAnomaly: boolean;
  anomalyDetails?: {
    expectedKw: number;
    deviationPercent: number;
    diagnosis: string;
  };
  dailyKwh: number;
  peakHour: string;
  coordinates: { x: number; y: number }; // percentage on 2D map
}

export interface ScenarioPreset {
  id: string;
  name: string;
  icon: string;
  tagline: string;
  solarKw: number;
  loadKw: number;
  batterySoc: number;
  tariffRate: number;
  weather: WeatherCondition;
  systemMode: SystemModeType;
  gridStatus: GridStatusType;
  withoutAi: {
    gridDependencyPercent: number;
    hourlyCostInr: number;
    carbonKgPerHour: number;
    peakDeficitKw: number;
  };
  withAi: {
    gridDependencyPercent: number;
    hourlyCostInr: number;
    carbonKgPerHour: number;
    peakDeficitKw: number;
    estimatedSavingsInr: number;
    co2AvoidedKg: number;
    recommendation: string;
  };
}

export interface BuildingEnergyProfile {
  id: string;
  name: string;
  code: string;
  category: 'Hostel' | 'Academic' | 'Library' | 'Laboratory' | 'Canteen' | 'EV Charging';
  icon: string;
  currentDemandKw: number;
  predictedDemand7amKw: number;
  predictedDemand8amKw: number;
  predictedDemand1pmKw: number;
  predictedDemand8pmKw: number;
  currentOccupancy: 'High' | 'Moderate' | 'Low' | 'Vacant';
  predictedOccupancy8am: 'High' | 'Moderate' | 'Low' | 'Vacant';
  priorityLevel: 1 | 2 | 3 | 4 | 5; // 1: Critical, 2: High Demand, 3: Normal, 4: Flexible, 5: Low
  priorityLabel: 'Critical' | 'High Demand' | 'Normal' | 'Flexible' | 'Low Priority';
  energyStatus: 'HIGH DEMAND EXPECTED' | 'LOW DEMAND EXPECTED' | 'NORMAL' | 'PEAK LUNCH DEMAND' | 'EV FLEXIBLE THROTTLE';
  solarSurplusKw: number;
  allocatedSolarKw: number;
}

export interface CampusPredictiveShiftState {
  currentSimulatedTime: string; // e.g. "08:00 AM"
  timeSlot: '06:00-08:00' | '08:00-13:00' | '13:00-14:00' | '14:00-17:00' | '17:00-19:00' | '19:00-23:00' | '23:00-06:00';
  hostelDemandKw: number;
  academicDemandKw: number;
  solarGenerationKw: number;
  reallocatedKw: number;
  batteryStoredKw: number;
  gridAvoidedKw: number;
  wasteAvoidedKwh: number;
  aiExplanation: {
    title: string;
    shiftDescription: string;
    actionTaken: string;
    decisionSteps: {
      monitor: string;
      predict: string;
      optimize: string;
      control: string;
    };
  };
  withoutAiVsWithAi: {
    renewableUtilizationWithout: number;
    renewableUtilizationWith: number;
    gridDependencyWithout: number;
    gridDependencyWith: number;
    hourlyCostWithoutInr: number;
    hourlyCostWithInr: number;
    energyWasteWithoutKwh: number;
    energyWasteWithKwh: number;
  };
}
