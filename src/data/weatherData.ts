import { MicrogridLocation, WeatherForecastDay, WeatherHourlyForecast, WeatherCondition } from '../types';

export const MICROGRID_LOCATIONS: MicrogridLocation[] = [
  {
    id: 'kiit-bhubaneswar',
    name: 'Kalinga Institute of Industrial Technology (KIIT Campus)',
    state: 'Bhubaneswar, Odisha',
    lat: 20.3533,
    lon: 85.8164,
    nominalPvKw: 750,
    nominalBatteryKwh: 900,
    climateZone: 'Tropical Savanna (Coastal Eastern)',
    elevationM: 45,
  },
  {
    id: 'iit-kgp',
    name: 'IIT Kharagpur Main Campus',
    state: 'West Bengal',
    lat: 22.3149,
    lon: 87.3105,
    nominalPvKw: 250,
    nominalBatteryKwh: 300,
    climateZone: 'Tropical Wet & Dry',
    elevationM: 61,
  },
  {
    id: 'delhi-solar',
    name: 'Delhi Tech University Solar Array',
    state: 'New Delhi (NCR)',
    lat: 28.7495,
    lon: 77.1180,
    nominalPvKw: 350,
    nominalBatteryKwh: 450,
    climateZone: 'Subtropical Semi-Arid',
    elevationM: 216,
  },
  {
    id: 'jodhpur-thar',
    name: 'Jodhpur Solar Park & Microgrid',
    state: 'Rajasthan',
    lat: 26.2389,
    lon: 73.0243,
    nominalPvKw: 500,
    nominalBatteryKwh: 600,
    climateZone: 'Arid Desert (High GHI)',
    elevationM: 231,
  },
  {
    id: 'bengaluru-tech',
    name: 'IISc Bengaluru Innovation Hub',
    state: 'Karnataka',
    lat: 13.0163,
    lon: 77.5685,
    nominalPvKw: 200,
    nominalBatteryKwh: 250,
    climateZone: 'Tropical Savanna (Highland)',
    elevationM: 920,
  },
  {
    id: 'chennai-coast',
    name: 'IIT Madras Research Park (Hybrid Wind-PV)',
    state: 'Tamil Nadu',
    lat: 12.9915,
    lon: 80.2337,
    nominalPvKw: 220,
    nominalBatteryKwh: 280,
    climateZone: 'Tropical Coastal Maritime',
    elevationM: 14,
  },
];

export function generate7DayWeatherForecast(locationId: string, currentCondition: WeatherCondition): WeatherForecastDay[] {
  const days = ['Today', 'Tomorrow', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'];
  const today = new Date();

  // Location baseline irradiance multipliers
  const locMultiplier = locationId === 'jodhpur-thar' ? 1.25 : locationId === 'delhi-solar' ? 1.1 : locationId === 'chennai-coast' ? 1.05 : 1.0;

  const conditionMap: Record<WeatherCondition, { cloud: number; irr: number; rain: number; tempOffset: number }> = {
    'Sunny': { cloud: 12, irr: 920 * locMultiplier, rain: 5, tempOffset: 2 },
    'Partly Cloudy': { cloud: 48, irr: 640 * locMultiplier, rain: 25, tempOffset: 0 },
    'Rainy / Monsoon': { cloud: 88, irr: 280 * locMultiplier, rain: 85, tempOffset: -4 },
    'Night / Twilight': { cloud: 20, irr: 0, rain: 10, tempOffset: -6 },
  };

  const currentStats = conditionMap[currentCondition] || conditionMap['Sunny'];

  return days.map((dayLabel, idx) => {
    const d = new Date(today);
    d.setDate(d.getDate() + idx);
    const dateFormatted = d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    const weekday = idx === 0 ? 'Today' : idx === 1 ? 'Tomorrow' : d.toLocaleDateString('en-IN', { weekday: 'short' });

    let condition: WeatherCondition = currentCondition;
    let cloudCover = currentStats.cloud;
    let rainProb = currentStats.rain;
    let tempMax = Math.round(34 + currentStats.tempOffset + (Math.sin(idx * 1.5) * 2));
    let tempMin = Math.round(23 + (Math.cos(idx * 1.2) * 2));
    let peakIrr = Math.round(currentStats.irr + (idx > 0 ? (Math.random() - 0.5) * 100 : 0));

    if (idx === 1) {
      condition = currentCondition === 'Rainy / Monsoon' ? 'Partly Cloudy' : 'Sunny';
      cloudCover = condition === 'Sunny' ? 15 : 45;
      rainProb = condition === 'Sunny' ? 10 : 30;
      peakIrr = Math.round(850 * locMultiplier);
    } else if (idx === 2) {
      condition = 'Sunny';
      cloudCover = 10;
      rainProb = 5;
      peakIrr = Math.round(910 * locMultiplier);
    } else if (idx === 3) {
      condition = 'Partly Cloudy';
      cloudCover = 52;
      rainProb = 35;
      peakIrr = Math.round(680 * locMultiplier);
    } else if (idx === 4) {
      condition = 'Rainy / Monsoon';
      cloudCover = 84;
      rainProb = 80;
      peakIrr = Math.round(310 * locMultiplier);
      tempMax -= 3;
    } else if (idx === 5) {
      condition = 'Partly Cloudy';
      cloudCover = 40;
      rainProb = 20;
      peakIrr = Math.round(740 * locMultiplier);
    } else if (idx === 6) {
      condition = 'Sunny';
      cloudCover = 12;
      rainProb = 5;
      peakIrr = Math.round(890 * locMultiplier);
    }

    if (peakIrr < 0) peakIrr = 0;
    const estKwh = Math.round((peakIrr / 1000) * 5.2 * 140 * (1 - cloudCover / 200));

    let advisory = 'Optimal solar generation expected. Standard AI Peak-Shaving dispatch armed.';
    let outageRisk: 'Low' | 'Moderate' | 'High' = 'Low';

    if (rainProb > 60) {
      advisory = 'High thunderstorm/cloud probability. Pre-charging BESS to 95% prior to 13:00.';
      outageRisk = 'High';
    } else if (cloudCover > 40) {
      advisory = 'Moderate cloud intermittency detected. Ramping microgrid fast-response battery inverter.';
      outageRisk = 'Moderate';
    } else if (tempMax > 38) {
      advisory = 'High thermal derating warning (>38°C). PV panel cooling spray advisory recommended.';
      outageRisk = 'Low';
    }

    return {
      date: dateFormatted,
      dayName: weekday,
      condition,
      tempMin,
      tempMax,
      irradiancePeak: peakIrr,
      estimatedSolarKwh: estKwh,
      windSpeedMs: Number((3.2 + Math.random() * 3.5 + (condition === 'Rainy / Monsoon' ? 4 : 0)).toFixed(1)),
      rainProbability: rainProb,
      cloudCoverPercent: cloudCover,
      uvIndex: condition === 'Sunny' ? 9 : condition === 'Partly Cloudy' ? 6 : 3,
      airQualityIndex: locationId === 'delhi-solar' ? 142 : locationId === 'jodhpur-thar' ? 65 : 82,
      outageRisk,
      aiAdvisory: advisory,
    };
  });
}

export function generate24HourWeatherForecast(condition: WeatherCondition, locationId: string): WeatherHourlyForecast[] {
  const result: WeatherHourlyForecast[] = [];
  const loc = MICROGRID_LOCATIONS.find(l => l.id === locationId) || MICROGRID_LOCATIONS[0];
  const pvCapacity = loc.nominalPvKw;

  for (let hour = 0; hour < 24; hour++) {
    const hourStr = hour < 10 ? `0${hour}:00` : `${hour}:00`;
    let irradiance = 0;
    let expectedSolarKw = 0;
    let cloudCover = condition === 'Sunny' ? 10 : condition === 'Partly Cloudy' ? 45 : condition === 'Rainy / Monsoon' ? 85 : 20;

    // Diurnal temperature curve
    const baseTemp = 24 + Math.sin(((hour - 5) / 24) * 2 * Math.PI) * 9;
    const temp = Math.round(baseTemp + (condition === 'Rainy / Monsoon' ? -3 : condition === 'Sunny' ? 2 : 0));

    // Solar radiation curve between 06:00 and 18:00 (peak around 12:30)
    if (hour >= 6 && hour <= 18) {
      const sunElevation = Math.sin(((hour - 6) / 12) * Math.PI);
      const clearSkyIrr = 950 * Math.pow(sunElevation, 1.1);
      
      const cloudAttenuation = 1 - (cloudCover / 100) * 0.75;
      irradiance = Math.max(0, Math.round(clearSkyIrr * cloudAttenuation));

      // PV generation factoring in thermal derating above 25°C
      const tempDerating = Math.max(0, (temp - 25) * 0.0038);
      const panelEfficiency = 0.19 * (1 - tempDerating);
      expectedSolarKw = Number(((irradiance / 1000) * (pvCapacity * 0.88) * (1 - tempDerating)).toFixed(1));
    }

    // Wind speed with diurnal breeze
    const windSpeed = Number((2.8 + Math.sin(hour * 0.4) * 2.2 + (condition === 'Rainy / Monsoon' ? 3.5 : 0)).toFixed(1));
    const expectedWindKw = Number((Math.pow(windSpeed / 10, 3) * (loc.nominalPvKw * 0.15)).toFixed(1));

    const rainProb = condition === 'Rainy / Monsoon' ? (hour >= 11 && hour <= 17 ? 85 : 65) : condition === 'Partly Cloudy' ? 20 : 5;

    result.push({
      hour: hourStr,
      timeLabel: hourStr,
      temp,
      irradiance,
      cloudCover,
      windSpeed,
      expectedSolarKw,
      expectedWindKw,
      rainProb,
    });
  }

  return result;
}
