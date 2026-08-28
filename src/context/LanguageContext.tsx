import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'hi';

export interface Translations {
  // Brand & General
  brandTitle: string;
  brandSubtitle: string;
  scadaVersion: string;
  sihContextBadge: string;
  sihDeck: string;
  
  // Navigation tabs
  navOverview: string;
  navAutopilot: string;
  navWeather: string;
  navDigitalTwin: string;
  navScenarios: string;
  navAnalytics: string;

  // Environment & Weather
  envLabel: string;
  weatherSunny: string;
  weatherCloudy: string;
  weatherRain: string;
  weatherNight: string;
  forecastHub: string;

  // Modes
  modeLabel: string;
  modeAiAuto: string;
  modePeakShaving: string;
  modeGreenMax: string;
  modeStormGuard: string;
  modeManual: string;

  // Status & Telemetry actions
  liveTelemetry: string;
  pausedTelemetry: string;
  auditReport: string;
  
  // Hero section
  systemOnline: string;
  autonomousDispatch: string;
  heroHeading: string;
  heroSubheading: string;
  cleanEnergyRatio: string;
  carbonAvoided: string;
  dailySavings: string;
  
  // Metric Cards
  solarPv: string;
  campusLoad: string;
  bessStorage: string;
  gridExchange: string;
  dailySolarGen: string;
  dailyConsumption: string;
  gridImport: string;
  gridExport: string;
  islandedMode: string;

  // Language switcher
  langToggleTitle: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    brandTitle: 'green',
    brandSubtitle: 'Predictive Microgrid & Autonomous Dispatch Core',
    scadaVersion: 'SCADA v2.4',
    sihContextBadge: 'Smart India Hackathon 2024 Edition',
    sihDeck: 'SIH Deck',
    
    navOverview: 'Overview',
    navAutopilot: 'AI Autopilot',
    navWeather: 'Weather & Solar',
    navDigitalTwin: 'Digital Twin',
    navScenarios: 'What-If Lab',
    navAnalytics: 'Analytics',

    envLabel: 'ENV:',
    weatherSunny: 'Sunny',
    weatherCloudy: 'Cloudy',
    weatherRain: 'Rain',
    weatherNight: 'Night',
    forecastHub: 'Forecast Hub',

    modeLabel: 'MODE:',
    modeAiAuto: 'AI Auto Optimizer',
    modePeakShaving: 'Peak Shaving Mode',
    modeGreenMax: '100% Green Self-Supply',
    modeStormGuard: 'Storm Guard / Backup',
    modeManual: 'Manual Dispatch',

    liveTelemetry: 'LIVE',
    pausedTelemetry: 'PAUSED',
    auditReport: 'Report',

    systemOnline: 'AI SYSTEM ONLINE',
    autonomousDispatch: 'AUTONOMOUS DISPATCH ACTIVE',
    heroHeading: 'Smart Campus Microgrid & Energy Dispatch',
    heroSubheading: 'AI-driven load balancing, battery storage arbitrage, and zero-curtailment solar synchronization for educational campuses.',
    cleanEnergyRatio: 'Clean Energy Ratio',
    carbonAvoided: 'CO₂ Avoided Today',
    dailySavings: 'Est. Daily Savings',

    solarPv: 'Solar PV',
    campusLoad: 'Campus Demand',
    bessStorage: 'BESS Storage',
    gridExchange: 'Grid Exchange',
    dailySolarGen: 'Daily Solar',
    dailyConsumption: 'Daily Consumed',
    gridImport: 'Grid Import',
    gridExport: 'Green Export',
    islandedMode: 'Microgrid Islanded',

    langToggleTitle: 'Switch Language / भाषा बदलें (SIH 2024)',
  },
  hi: {
    brandTitle: 'ग्रीन',
    brandSubtitle: 'स्मार्ट इंडिया हैकाथॉन • स्वायत्त माइक्रोग्रिड नियंत्रण प्रणाली',
    scadaVersion: 'स्कैडा v2.4',
    sihContextBadge: 'स्मार्ट इंडिया हैकाथॉन 2024 संस्करण',
    sihDeck: 'एसआईएच प्रस्तुति',
    
    navOverview: 'अवलोकन (Overview)',
    navAutopilot: 'एआई ऑटोपायलट',
    navWeather: 'मौसम व सौर ऊर्जा',
    navDigitalTwin: 'डिजिटल ट्विन',
    navScenarios: 'सिमुलेशन लैब',
    navAnalytics: 'ऊर्जा विश्लेषण',

    envLabel: 'मौसम:',
    weatherSunny: 'धूप',
    weatherCloudy: 'बादल',
    weatherRain: 'बारिश',
    weatherNight: 'रात',
    forecastHub: 'पूर्वानुमान',

    modeLabel: 'मोड:',
    modeAiAuto: 'एआई ऑटो अनुकूलक',
    modePeakShaving: 'पीक शेविंग मोड',
    modeGreenMax: '100% हरित ऊर्जा',
    modeStormGuard: 'तूफान सुरक्षा बैकअप',
    modeManual: 'मैनुअल नियंत्रण',

    liveTelemetry: 'सक्रिय (LIVE)',
    pausedTelemetry: 'रोका गया (PAUSED)',
    auditReport: 'रिपोर्ट',

    systemOnline: 'एआई प्रणाली सक्रिय',
    autonomousDispatch: 'स्वायत्त ऊर्जा वितरण चालू',
    heroHeading: 'स्मार्ट कैंपस माइक्रोग्रिड व ऊर्जा प्रबंधन',
    heroSubheading: 'स्मार्ट इंडिया हैकाथॉन: शैक्षणिक परिसरों के लिए एआई आधारित लोड संतुलन, बैटरी भंडारण तथा सौर ऊर्जा का कुशल उपयोग।',
    cleanEnergyRatio: 'हरित ऊर्जा अनुपात',
    carbonAvoided: 'आज CO₂ बचत',
    dailySavings: 'अनुमानित दैनिक बचत',

    solarPv: 'सौर ऊर्जा (PV)',
    campusLoad: 'कैंपस कुल लोड',
    bessStorage: 'बैटरी स्टोरेज (BESS)',
    gridExchange: 'ग्रिड विनिमय',
    dailySolarGen: 'दैनिक सौर उत्पादन',
    dailyConsumption: 'दैनिक कुल खपत',
    gridImport: 'ग्रिड आयात',
    gridExport: 'ग्रिड निर्यात',
    islandedMode: 'माइक्रोग्रिड आइसोलेटेड',

    langToggleTitle: 'भाषा बदलें / Switch Language (SIH 2024)',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('greengrid_lang');
      return (saved === 'hi' || saved === 'en') ? saved : 'en';
    } catch {
      return 'en';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('greengrid_lang', language);
    } catch (e) {
      console.warn('Unable to persist language choice', e);
    }
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'hi' : 'en'));
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    toggleLanguage,
    t: translations[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
