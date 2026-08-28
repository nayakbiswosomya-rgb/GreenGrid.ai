import { CampusBuilding } from '../types';

/**
 * Kalinga Institute of Industrial Technology (KIIT Deemed to be University, Bhubaneswar)
 * Smart Green Campus Microgrid Telemetry Matrix
 * Includes 25 Boys Hostels (KP-1 to KP-25) and 25 Girls Hostels (QC-1 to QC-25)
 * plus core Academic, Research, and Clean Mobility Infrastructure.
 */

// Generate the 25 Boys Hostels (KP-1 to KP-25: King's Palace)
const boysHostels: CampusBuilding[] = Array.from({ length: 25 }, (_, i) => {
  const num = i + 1;
  const code = `KP-${num}`;
  const campusNum = num <= 6 ? 1 : num <= 12 ? 3 : num <= 18 ? 12 : num <= 22 ? 15 : 20;
  
  // Specific simulated loads & anomalies
  const isAnomaly = false;
  const currentLoad = isAnomaly 
    ? (num === 7 ? 32.4 : 29.8) 
    : Number((14.5 + ((num * 7) % 11) * 1.1).toFixed(1));
  const nominalLoad = isAnomaly ? 18.0 : Number((currentLoad * (0.95 + ((num % 5) * 0.03))).toFixed(1));
  const solarAlloc = Number((12.0 + ((num * 5) % 18) * 1.2).toFixed(1));
  const efficiency = isAnomaly ? 64.2 : Number((88 + (num % 10) * 1.1).toFixed(1));

  // 2D Spatial coordinate distribution across Northwest and West quadrants
  const row = Math.floor(i / 5);
  const col = i % 5;
  const x = Math.round(8 + col * 7.5 + (row % 2 === 1 ? 2 : 0));
  const y = Math.round(18 + row * 14.5);

  return {
    id: `bld-kp-${num}`,
    name: `King's Palace ${num} (${code})`,
    code: code,
    type: 'Boys Hostel',
    campusZone: `Campus ${campusNum}`,
    occupancy: 420 + ((num * 37) % 350),
    iconName: 'Home',
    currentLoadKw: currentLoad,
    nominalLoadKw: nominalLoad,
    solarAllocationKw: solarAlloc,
    efficiencyPercent: efficiency,
    aiStatus: isAnomaly ? 'Anomaly Detected' : num % 3 === 0 ? 'Optimized' : num % 5 === 0 ? 'Throttled' : 'Normal',
    hasAnomaly: isAnomaly,
    anomalyDetails: isAnomaly ? {
      expectedKw: nominalLoad,
      deviationPercent: Number((((currentLoad - nominalLoad) / nominalLoad) * 100).toFixed(1)),
      diagnosis: num === 7 
        ? 'Continuous 14kW geyser & HVAC compressor baseline surge detected in North Wing sub-feeder.'
        : 'Power factor degradation detected (0.78 PF) due to unmetered motor load in pantry pumps.',
    } : undefined,
    dailyKwh: Number((currentLoad * 14.2).toFixed(1)),
    peakHour: num % 2 === 0 ? '07:45 AM' : '08:30 PM',
    coordinates: { x, y },
  };
});

// Generate the 25 Girls Hostels (QC-1 to QC-25: Queen's Castle)
const girlsHostels: CampusBuilding[] = Array.from({ length: 25 }, (_, i) => {
  const num = i + 1;
  const code = `QC-${num}`;
  const campusNum = num <= 6 ? 2 : num <= 12 ? 6 : num <= 18 ? 14 : num <= 22 ? 17 : 24;

  const isAnomaly = false;
  const currentLoad = isAnomaly 
    ? 31.6 
    : Number((13.8 + ((num * 9) % 10) * 1.15).toFixed(1));
  const nominalLoad = isAnomaly ? 17.5 : Number((currentLoad * (0.94 + ((num % 4) * 0.03))).toFixed(1));
  const solarAlloc = Number((14.0 + ((num * 6) % 16) * 1.1).toFixed(1));
  const efficiency = isAnomaly ? 67.5 : Number((89 + (num % 9) * 1.05).toFixed(1));

  // 2D Spatial coordinate distribution across Northeast and East quadrants
  const row = Math.floor(i / 5);
  const col = i % 5;
  const x = Math.round(56 + col * 7.8 + (row % 2 === 1 ? 2 : 0));
  const y = Math.round(18 + row * 14.5);

  return {
    id: `bld-qc-${num}`,
    name: `Queen's Castle ${num} (${code})`,
    code: code,
    type: 'Girls Hostel',
    campusZone: `Campus ${campusNum}`,
    occupancy: 450 + ((num * 41) % 360),
    iconName: 'Building',
    currentLoadKw: currentLoad,
    nominalLoadKw: nominalLoad,
    solarAllocationKw: solarAlloc,
    efficiencyPercent: efficiency,
    aiStatus: isAnomaly ? 'Anomaly Detected' : num % 4 === 0 ? 'Optimized' : num % 6 === 0 ? 'Throttled' : 'Normal',
    hasAnomaly: isAnomaly,
    anomalyDetails: isAnomaly ? {
      expectedKw: nominalLoad,
      deviationPercent: 80.5,
      diagnosis: 'Excessive thermal load detected: Laundry heat recovery circuit offline in Central Wing.',
    } : undefined,
    dailyKwh: Number((currentLoad * 13.8).toFixed(1)),
    peakHour: num % 2 === 0 ? '08:15 AM' : '09:00 PM',
    coordinates: { x, y },
  };
});

// Core Academic, Research, and Infrastructure Facilities of KIIT Campus
const academicAndCentralFacilities: CampusBuilding[] = [
  {
    id: 'bld-sce-c15',
    name: 'School of Computer Engineering',
    code: 'SCE-C15',
    type: 'Academic',
    campusZone: 'Campus 15 (Patia)',
    occupancy: 4500,
    iconName: 'School',
    currentLoadKw: 58.4,
    nominalLoadKw: 65.0,
    solarAllocationKw: 75.0,
    efficiencyPercent: 95.8,
    aiStatus: 'Optimized',
    hasAnomaly: false,
    dailyKwh: 680.0,
    peakHour: '11:30 AM',
    coordinates: { x: 48, y: 12 },
  },
  {
    id: 'bld-soee-c3',
    name: 'School of Electrical & Electronics',
    code: 'SEEE-C3',
    type: 'Academic',
    campusZone: 'Campus 3',
    occupancy: 3200,
    iconName: 'School',
    currentLoadKw: 44.2,
    nominalLoadKw: 48.0,
    solarAllocationKw: 50.0,
    efficiencyPercent: 93.4,
    aiStatus: 'Normal',
    hasAnomaly: false,
    dailyKwh: 490.0,
    peakHour: '02:30 PM',
    coordinates: { x: 42, y: 35 },
  },
  {
    id: 'bld-library-c6',
    name: 'Central Kalinga Library Hub',
    code: 'LIB-C6',
    type: 'Facility',
    campusZone: 'Campus 6',
    occupancy: 1800,
    iconName: 'BookOpen',
    currentLoadKw: 18.6,
    nominalLoadKw: 24.0,
    solarAllocationKw: 30.0,
    efficiencyPercent: 97.2,
    aiStatus: 'Optimized',
    hasAnomaly: false,
    dailyKwh: 210.5,
    peakHour: '04:00 PM',
    coordinates: { x: 50, y: 52 },
  },
  {
    id: 'bld-research-c11',
    name: 'Advanced Materials & AI Research Lab',
    code: 'CRF-C11',
    type: 'Research',
    campusZone: 'Campus 11',
    occupancy: 650,
    iconName: 'FlaskConical',
    currentLoadKw: 36.8,
    nominalLoadKw: 40.0,
    solarAllocationKw: 45.0,
    efficiencyPercent: 96.0,
    aiStatus: 'Normal',
    hasAnomaly: false,
    dailyKwh: 380.0,
    peakHour: '01:30 PM',
    coordinates: { x: 48, y: 72 },
  },
  {
    id: 'bld-ksac-c13',
    name: 'KSAC Student Activity & Dining Plaza',
    code: 'KSAC-C13',
    type: 'Facility',
    campusZone: 'Campus 13',
    occupancy: 2800,
    iconName: 'UtensilsCrossed',
    currentLoadKw: 22.4,
    nominalLoadKw: 28.0,
    solarAllocationKw: 25.0,
    efficiencyPercent: 91.5,
    aiStatus: 'Optimized',
    hasAnomaly: false,
    dailyKwh: 245.0,
    peakHour: '01:00 PM',
    coordinates: { x: 50, y: 88 },
  },
  {
    id: 'bld-evshuttle-c8',
    name: 'KIIT Green EV Fleet & Solar Bus Depot',
    code: 'EV-C8',
    type: 'Mobility',
    campusZone: 'Campus 8',
    occupancy: 120,
    iconName: 'Car',
    currentLoadKw: 28.5,
    nominalLoadKw: 35.0,
    solarAllocationKw: 40.0,
    efficiencyPercent: 98.2,
    aiStatus: 'Throttled',
    hasAnomaly: false,
    dailyKwh: 310.0,
    peakHour: '05:30 PM',
    coordinates: { x: 50, y: 95 },
  },
];

// All 56 Campus Microgrid Nodes: 25 Boys Hostels + 25 Girls Hostels + 6 Central Academic/Facilities
export const KIIT_CAMPUS_BUILDINGS: CampusBuilding[] = [
  ...boysHostels,
  ...girlsHostels,
  ...academicAndCentralFacilities,
];
