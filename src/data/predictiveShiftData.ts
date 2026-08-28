import { BuildingEnergyProfile, CampusPredictiveShiftState } from '../types';

/**
 * Predictive Campus Energy Shifting Model
 * KIIT / Campus-Wide Smart Microgrid Simulation
 */

export const CAMPUS_BUILDING_PROFILES: BuildingEnergyProfile[] = [
  {
    id: 'bld-hostel-a',
    name: 'Hostel A (KP North Wing)',
    code: 'KP-A',
    category: 'Hostel',
    icon: 'Home',
    currentDemandKw: 2.4,
    predictedDemand7amKw: 8.5,
    predictedDemand8amKw: 2.1,
    predictedDemand1pmKw: 1.8,
    predictedDemand8pmKw: 9.6,
    currentOccupancy: 'Low',
    predictedOccupancy8am: 'Vacant',
    priorityLevel: 3,
    priorityLabel: 'Normal',
    energyStatus: 'LOW DEMAND EXPECTED',
    solarSurplusKw: 9.9,
    allocatedSolarKw: 2.1,
  },
  {
    id: 'bld-hostel-b',
    name: 'Hostel B (QC East Wing)',
    code: 'QC-B',
    category: 'Hostel',
    icon: 'Building',
    currentDemandKw: 2.8,
    predictedDemand7amKw: 9.0,
    predictedDemand8amKw: 2.5,
    predictedDemand1pmKw: 2.0,
    predictedDemand8pmKw: 10.2,
    currentOccupancy: 'Low',
    predictedOccupancy8am: 'Vacant',
    priorityLevel: 3,
    priorityLabel: 'Normal',
    energyStatus: 'LOW DEMAND EXPECTED',
    solarSurplusKw: 11.5,
    allocatedSolarKw: 2.5,
  },
  {
    id: 'bld-academic-main',
    name: 'Academic Block (School of Computing)',
    code: 'SCE-Main',
    category: 'Academic',
    icon: 'School',
    currentDemandKw: 10.4,
    predictedDemand7amKw: 3.2,
    predictedDemand8amKw: 10.8,
    predictedDemand1pmKw: 8.5,
    predictedDemand8pmKw: 1.5,
    currentOccupancy: 'High',
    predictedOccupancy8am: 'High',
    priorityLevel: 2,
    priorityLabel: 'High Demand',
    energyStatus: 'HIGH DEMAND EXPECTED',
    solarSurplusKw: 0,
    allocatedSolarKw: 10.8,
  },
  {
    id: 'bld-central-library',
    name: 'Central Kalinga Library',
    code: 'LIB-Central',
    category: 'Library',
    icon: 'BookOpen',
    currentDemandKw: 4.2,
    predictedDemand7amKw: 1.0,
    predictedDemand8amKw: 4.5,
    predictedDemand1pmKw: 5.8,
    predictedDemand8pmKw: 3.2,
    currentOccupancy: 'Moderate',
    predictedOccupancy8am: 'Moderate',
    priorityLevel: 3,
    priorityLabel: 'Normal',
    energyStatus: 'NORMAL',
    solarSurplusKw: 0,
    allocatedSolarKw: 4.5,
  },
  {
    id: 'bld-ai-lab',
    name: 'Advanced AI & Electronics Lab',
    code: 'LAB-Core',
    category: 'Laboratory',
    icon: 'FlaskConical',
    currentDemandKw: 6.8,
    predictedDemand7amKw: 4.0,
    predictedDemand8amKw: 7.2,
    predictedDemand1pmKw: 6.5,
    predictedDemand8pmKw: 4.0,
    currentOccupancy: 'High',
    predictedOccupancy8am: 'High',
    priorityLevel: 1,
    priorityLabel: 'Critical',
    energyStatus: 'HIGH DEMAND EXPECTED',
    solarSurplusKw: 0,
    allocatedSolarKw: 7.2,
  },
  {
    id: 'bld-canteen-plaza',
    name: 'Central Campus Canteen & Dining',
    code: 'CANTEEN-01',
    category: 'Canteen',
    icon: 'UtensilsCrossed',
    currentDemandKw: 3.5,
    predictedDemand7amKw: 2.0,
    predictedDemand8amKw: 2.8,
    predictedDemand1pmKw: 12.4,
    predictedDemand8pmKw: 7.5,
    currentOccupancy: 'Low',
    predictedOccupancy8am: 'Low',
    priorityLevel: 3,
    priorityLabel: 'Normal',
    energyStatus: 'NORMAL',
    solarSurplusKw: 0,
    allocatedSolarKw: 2.8,
  },
  {
    id: 'bld-ev-depot',
    name: 'Green EV Fleet & Bus Depot',
    code: 'EV-Depot',
    category: 'EV Charging',
    icon: 'Car',
    currentDemandKw: 5.0,
    predictedDemand7amKw: 2.5,
    predictedDemand8amKw: 3.5,
    predictedDemand1pmKw: 4.0,
    predictedDemand8pmKw: 2.0,
    currentOccupancy: 'Moderate',
    predictedOccupancy8am: 'Moderate',
    priorityLevel: 4,
    priorityLabel: 'Flexible',
    energyStatus: 'EV FLEXIBLE THROTTLE',
    solarSurplusKw: 0,
    allocatedSolarKw: 3.5,
  },
];

/**
 * 24-Hour Campus Demand Matrix by Building (Hourly breakdown)
 * Demonstrating dynamic campus migrations (Morning Prep -> Classrooms -> Lunch -> Evening Study -> Night Sleep)
 */
export interface HourlyCampusDemand {
  hour: string; // e.g. "06:00", "08:00"
  timeLabel: string;
  hostelDemandKw: number;
  academicDemandKw: number;
  libraryDemandKw: number;
  labDemandKw: number;
  canteenDemandKw: number;
  evChargingKw: number;
  totalCampusLoadKw: number;
  solarGenerationKw: number;
  shiftedSolarKw: number;
  batteryStoredKw: number;
  activePhase: string;
}

export const CAMPUS_24H_DEMAND_CURVE: HourlyCampusDemand[] = [
  { hour: '00:00', timeLabel: '12:00 AM', hostelDemandKw: 8.5, academicDemandKw: 1.0, libraryDemandKw: 0.5, labDemandKw: 2.0, canteenDemandKw: 0.2, evChargingKw: 4.0, totalCampusLoadKw: 16.2, solarGenerationKw: 0, shiftedSolarKw: 0, batteryStoredKw: 0, activePhase: 'Night Baselines' },
  { hour: '02:00', timeLabel: '02:00 AM', hostelDemandKw: 6.2, academicDemandKw: 0.8, libraryDemandKw: 0.2, labDemandKw: 2.0, canteenDemandKw: 0.2, evChargingKw: 4.5, totalCampusLoadKw: 13.9, solarGenerationKw: 0, shiftedSolarKw: 0, batteryStoredKw: 0, activePhase: 'Night Baselines' },
  { hour: '04:00', timeLabel: '04:00 AM', hostelDemandKw: 5.5, academicDemandKw: 0.8, libraryDemandKw: 0.2, labDemandKw: 2.0, canteenDemandKw: 0.5, evChargingKw: 3.0, totalCampusLoadKw: 12.0, solarGenerationKw: 0, shiftedSolarKw: 0, batteryStoredKw: 0, activePhase: 'Night Baselines' },
  { hour: '06:00', timeLabel: '06:00 AM', hostelDemandKw: 12.8, academicDemandKw: 1.5, libraryDemandKw: 0.5, labDemandKw: 2.5, canteenDemandKw: 2.0, evChargingKw: 2.0, totalCampusLoadKw: 21.3, solarGenerationKw: 3.5, shiftedSolarKw: 3.5, batteryStoredKw: 0, activePhase: 'Morning Prep (Hostels High)' },
  { hour: '07:00', timeLabel: '07:00 AM', hostelDemandKw: 17.5, academicDemandKw: 3.2, libraryDemandKw: 1.0, labDemandKw: 4.0, canteenDemandKw: 4.8, evChargingKw: 2.5, totalCampusLoadKw: 33.0, solarGenerationKw: 12.0, shiftedSolarKw: 12.0, batteryStoredKw: 0, activePhase: 'Hostel Geysers & Prep' },
  { hour: '07:45', timeLabel: '07:45 AM', hostelDemandKw: 14.2, academicDemandKw: 5.8, libraryDemandKw: 2.0, labDemandKw: 5.5, canteenDemandKw: 3.5, evChargingKw: 3.0, totalCampusLoadKw: 34.0, solarGenerationKw: 18.5, shiftedSolarKw: 16.0, batteryStoredKw: 2.5, activePhase: 'AI Detects Student Movement' },
  { hour: '08:00', timeLabel: '08:00 AM', hostelDemandKw: 4.6, academicDemandKw: 21.2, libraryDemandKw: 4.5, labDemandKw: 7.2, canteenDemandKw: 2.8, evChargingKw: 3.5, totalCampusLoadKw: 43.8, solarGenerationKw: 28.0, shiftedSolarKw: 24.5, batteryStoredKw: 3.5, activePhase: 'Classes Begin: Solar Redirected' },
  { hour: '09:00', timeLabel: '09:00 AM', hostelDemandKw: 3.8, academicDemandKw: 24.5, libraryDemandKw: 5.2, labDemandKw: 8.0, canteenDemandKw: 2.5, evChargingKw: 4.0, totalCampusLoadKw: 48.0, solarGenerationKw: 42.0, shiftedSolarKw: 36.5, batteryStoredKw: 5.5, activePhase: 'Peak Lecture Hours' },
  { hour: '10:00', timeLabel: '10:00 AM', hostelDemandKw: 3.5, academicDemandKw: 26.0, libraryDemandKw: 6.0, labDemandKw: 8.5, canteenDemandKw: 3.0, evChargingKw: 4.5, totalCampusLoadKw: 51.5, solarGenerationKw: 56.0, shiftedSolarKw: 43.5, batteryStoredKw: 12.5, activePhase: 'High Academic Demand + Solar Surplus' },
  { hour: '11:00', timeLabel: '11:00 AM', hostelDemandKw: 3.2, academicDemandKw: 26.5, libraryDemandKw: 6.5, labDemandKw: 8.8, canteenDemandKw: 4.2, evChargingKw: 4.8, totalCampusLoadKw: 54.0, solarGenerationKw: 68.0, shiftedSolarKw: 46.0, batteryStoredKw: 14.0, activePhase: 'Solar Peak Generation' },
  { hour: '12:00', timeLabel: '12:00 PM', hostelDemandKw: 4.0, academicDemandKw: 22.0, libraryDemandKw: 5.8, labDemandKw: 7.5, canteenDemandKw: 8.5, evChargingKw: 4.0, totalCampusLoadKw: 51.8, solarGenerationKw: 72.5, shiftedSolarKw: 43.8, batteryStoredKw: 16.2, activePhase: 'Midday Transition' },
  { hour: '13:00', timeLabel: '01:00 PM', hostelDemandKw: 4.8, academicDemandKw: 12.5, libraryDemandKw: 4.0, labDemandKw: 6.0, canteenDemandKw: 18.2, evChargingKw: 3.5, totalCampusLoadKw: 49.0, solarGenerationKw: 69.0, shiftedSolarKw: 40.7, batteryStoredKw: 15.5, activePhase: 'Canteen Lunch Peak' },
  { hour: '14:00', timeLabel: '02:00 PM', hostelDemandKw: 4.2, academicDemandKw: 20.0, libraryDemandKw: 5.5, labDemandKw: 7.8, canteenDemandKw: 7.0, evChargingKw: 3.0, totalCampusLoadKw: 47.5, solarGenerationKw: 61.0, shiftedSolarKw: 40.3, batteryStoredKw: 13.5, activePhase: 'Afternoon Labs & Research' },
  { hour: '15:00', timeLabel: '03:00 PM', hostelDemandKw: 4.0, academicDemandKw: 19.5, libraryDemandKw: 6.2, labDemandKw: 8.2, canteenDemandKw: 4.5, evChargingKw: 3.0, totalCampusLoadKw: 45.4, solarGenerationKw: 48.0, shiftedSolarKw: 38.4, batteryStoredKw: 9.6, activePhase: 'Afternoon Classes' },
  { hour: '16:00', timeLabel: '04:00 PM', hostelDemandKw: 5.5, academicDemandKw: 16.0, libraryDemandKw: 7.0, labDemandKw: 7.0, canteenDemandKw: 4.0, evChargingKw: 3.0, totalCampusLoadKw: 42.5, solarGenerationKw: 32.0, shiftedSolarKw: 29.5, batteryStoredKw: 2.5, activePhase: 'Library Study Surge' },
  { hour: '17:00', timeLabel: '05:00 PM', hostelDemandKw: 9.8, academicDemandKw: 8.5, libraryDemandKw: 6.0, labDemandKw: 5.0, canteenDemandKw: 5.2, evChargingKw: 4.5, totalCampusLoadKw: 39.0, solarGenerationKw: 14.5, shiftedSolarKw: 14.5, batteryStoredKw: 0, activePhase: 'Students Return to Hostels' },
  { hour: '18:00', timeLabel: '06:00 PM', hostelDemandKw: 15.2, academicDemandKw: 4.0, libraryDemandKw: 4.5, labDemandKw: 3.5, canteenDemandKw: 6.5, evChargingKw: 5.0, totalCampusLoadKw: 38.7, solarGenerationKw: 2.0, shiftedSolarKw: 2.0, batteryStoredKw: 0, activePhase: 'Evening Recreation & Hostels' },
  { hour: '19:00', timeLabel: '07:00 PM', hostelDemandKw: 21.0, academicDemandKw: 2.5, libraryDemandKw: 3.5, labDemandKw: 3.0, canteenDemandKw: 8.0, evChargingKw: 5.5, totalCampusLoadKw: 43.5, solarGenerationKw: 0, shiftedSolarKw: 0, batteryStoredKw: 0, activePhase: 'Hostel Evening Peak (BESS Dispatch)' },
  { hour: '20:00', timeLabel: '08:00 PM', hostelDemandKw: 24.5, academicDemandKw: 1.8, libraryDemandKw: 3.0, labDemandKw: 3.0, canteenDemandKw: 9.5, evChargingKw: 4.0, totalCampusLoadKw: 45.8, solarGenerationKw: 0, shiftedSolarKw: 0, batteryStoredKw: 0, activePhase: 'Hostel Study & Dinner Rush' },
  { hour: '21:00', timeLabel: '09:00 PM', hostelDemandKw: 23.8, academicDemandKw: 1.5, libraryDemandKw: 2.5, labDemandKw: 2.5, canteenDemandKw: 6.0, evChargingKw: 3.5, totalCampusLoadKw: 39.8, solarGenerationKw: 0, shiftedSolarKw: 0, batteryStoredKw: 0, activePhase: 'Hostel Night Peak' },
  { hour: '22:00', timeLabel: '10:00 PM', hostelDemandKw: 18.5, academicDemandKw: 1.2, libraryDemandKw: 1.5, labDemandKw: 2.2, canteenDemandKw: 2.0, evChargingKw: 3.5, totalCampusLoadKw: 28.9, solarGenerationKw: 0, shiftedSolarKw: 0, batteryStoredKw: 0, activePhase: 'Night Study' },
  { hour: '23:00', timeLabel: '11:00 PM', hostelDemandKw: 12.0, academicDemandKw: 1.0, libraryDemandKw: 0.8, labDemandKw: 2.0, canteenDemandKw: 0.5, evChargingKw: 4.0, totalCampusLoadKw: 20.3, solarGenerationKw: 0, shiftedSolarKw: 0, batteryStoredKw: 0, activePhase: 'Late Night Dorms' },
];

/**
 * Calculates real-time or simulated campus energy shift state
 */
export function calculateCampusPredictiveShift(
  simulatedTime: string | number = '08:00 AM',
  currentSolarKw: number = 32.0,
  batterySoc: number = 68.0
): CampusPredictiveShiftState {
  const timeStr = typeof simulatedTime === 'number'
    ? `${simulatedTime < 10 ? '0' : ''}${simulatedTime}:00`
    : String(simulatedTime || '08:00 AM');

  // Extract hour number safely
  const hourMatch = timeStr.match(/(\d{1,2})/);
  const hourNumber = typeof simulatedTime === 'number'
    ? simulatedTime
    : hourMatch ? parseInt(hourMatch[1], 10) : 8;

  const is8amScenario = timeStr.includes('08:00') || timeStr.includes('8:00') || timeStr.includes('07:45') || (hourNumber >= 7 && hourNumber <= 11);
  const isCanteenNoon = timeStr.includes('13:00') || timeStr.includes('1:00') || timeStr.includes('12:00') || (hourNumber >= 12 && hourNumber <= 14);
  const isEveningHostel = timeStr.includes('19:00') || timeStr.includes('20:00') || timeStr.includes('8:00 PM') || (hourNumber >= 18 && hourNumber <= 23);

  // Baseline load numbers
  let hostelDemandKw = is8amScenario ? 4.9 : isEveningHostel ? 23.5 : 14.5;
  let academicDemandKw = is8amScenario ? 21.2 : isEveningHostel ? 2.5 : 8.5;
  let timeSlot: CampusPredictiveShiftState['timeSlot'] = is8amScenario 
    ? '08:00-13:00' 
    : isCanteenNoon 
    ? '13:00-14:00' 
    : isEveningHostel 
    ? '19:00-23:00' 
    : '06:00-08:00';

  const solarGenerationKw = currentSolarKw > 0 ? currentSolarKw : (is8amScenario ? 32.0 : isCanteenNoon ? 65.0 : 0);
  
  // Reallocation math
  const reallocatedKw = is8amScenario ? 16.3 : isCanteenNoon ? 18.2 : 0;
  const batteryStoredKw = Math.max(0, solarGenerationKw - (academicDemandKw + hostelDemandKw + 8.5));
  const gridAvoidedKw = Number((reallocatedKw + (solarGenerationKw > 20 ? 12.4 : 4.2)).toFixed(1));
  const wasteAvoidedKwh = Number((reallocatedKw * 1.85).toFixed(1));

  const explanationTitle = is8amScenario
    ? '🤖 AI Energy Decision: 08:00 AM Hostel → Academic Demand Shift'
    : isCanteenNoon
    ? '🤖 AI Energy Decision: 01:00 PM Dining & Canteen Peak Shift'
    : '🤖 AI Energy Decision: Proactive Campus Load Reallocation';

  const shiftDescription = is8amScenario
    ? 'At 08:00, hostel occupancy is predicted to decrease as students move to academic blocks. Hostel demand is expected to fall from 17.5 kW to 4.9 kW, while Academic Block demand is expected to rise from 5.8 kW to 21.2 kW.'
    : isCanteenNoon
    ? 'At 13:00, academic class occupancy pauses for lunch. Canteen power spikes to 18.2 kW. Solar surplus from vacant lecture halls is instantly redirected to the Central Canteen.'
    : 'GreenGrid AI is continuously tracking campus occupancy and building sub-meters, proactively redirecting clean solar energy to high-demand campus sectors.';

  const actionTaken = is8amScenario
    ? 'GreenGrid AI has identified the upcoming demand shift and is prioritizing renewable energy allocation toward the Academic Block while storing any remaining surplus energy into the BESS.'
    : 'Surplus clean energy redirected to priority building loads and BESS storage, zero solar curtailment.';

  return {
    currentSimulatedTime: timeStr,
    timeSlot,
    hostelDemandKw,
    academicDemandKw,
    solarGenerationKw,
    reallocatedKw,
    batteryStoredKw: Number(batteryStoredKw.toFixed(1)),
    gridAvoidedKw,
    wasteAvoidedKwh,
    aiExplanation: {
      title: explanationTitle,
      shiftDescription,
      actionTaken,
      decisionSteps: {
        monitor: 'Live SCADA monitors 56 building sub-meters and student activity levels across campus.',
        predict: 'Predictive neural model forecasts that 4,000+ students will transition from dorms to lecture halls at 08:00 AM.',
        optimize: 'Dynamic priority matrix prioritizes Academic Labs & Computing Block while curtailing unused hostel allocations.',
        control: 'Virtual microgrid bus routes +16.3 kW of solar surplus directly to lecture halls and BESS storage.',
      },
    },
    withoutAiVsWithAi: {
      renewableUtilizationWithout: 58.4,
      renewableUtilizationWith: 96.2,
      gridDependencyWithout: 46.8,
      gridDependencyWith: 8.2,
      hourlyCostWithoutInr: 540,
      hourlyCostWithInr: 165,
      energyWasteWithoutKwh: 18.6,
      energyWasteWithKwh: 0.4,
    },
  };
}
