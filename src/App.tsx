import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { LoginPage } from './components/LoginPage';
import { SubscriptionModal } from './components/SubscriptionModal';
import { HeroStatusArea } from './components/HeroStatusArea';
import { MetricCards } from './components/MetricCards';
import { MicrogridPowerFlowCanvas } from './components/MicrogridPowerFlowCanvas';
import { EnergyFlowChart } from './components/EnergyFlowChart';
import { AIPredictionAndAdvisor } from './components/AIPredictionAndAdvisor';
import { SmartLoadController } from './components/SmartLoadController';
import { AlertsPanel } from './components/AlertsPanel';
import { CampusDigitalTwin } from './components/CampusDigitalTwin';
import { WhatIfSimulator } from './components/WhatIfSimulator';
import { AnomalyDetectionSection } from './components/AnomalyDetectionSection';
import { AnalyticsView } from './components/AnalyticsView';
import { WeatherForecastSection } from './components/WeatherForecastSection';
import { SIHPitchModal } from './components/SIHPitchModal';
import { AuditReportModal } from './components/AuditReportModal';
import { NodeInspectorModal } from './components/NodeInspectorModal';
import { GreenGridLogo } from './components/GreenGridLogo';
import { 
  GridTelemetry, 
  SubLoad, 
  AlertItem, 
  WeatherCondition, 
  SystemModeType, 
  HourlyForecastPoint,
  AIAdvisorResult,
  UserProfile,
  SubscriptionTier,
  BillingCycle,
  CampusBuilding,
  ScenarioPreset,
  NavigationView
} from './types';
import { 
  INITIAL_TELEMETRY, 
  INITIAL_SUB_LOADS, 
  INITIAL_ALERTS, 
  INITIAL_CAMPUS_BUILDINGS,
  SCENARIO_PRESETS,
  generate24HourForecast 
} from './data/simulation';
import { runAutopilotEngine } from './engine/autopilotEngine';
import { ShieldCheck, Zap, ArrowUp, ChevronUp, Layers, Compass, BrainCircuit, Building2, Sliders, BarChart2, LayoutDashboard, Sun } from 'lucide-react';

export default function App() {
  // Navigation View State with Active ScrollSpy
  const [currentView, setCurrentView] = useState<NavigationView>('overview');
  const [showScrollTop, setShowScrollTop] = useState(false);

  // User Authentication & Session state
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('greengrid_user_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Core application states
  const [telemetry, setTelemetry] = useState<GridTelemetry>(INITIAL_TELEMETRY);
  const [subLoads, setSubLoads] = useState<SubLoad[]>(INITIAL_SUB_LOADS);
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);
  const [weather, setWeather] = useState<WeatherCondition>('Sunny');
  const [systemMode, setSystemMode] = useState<SystemModeType>('AI_AUTO');
  const [forecastData] = useState<HourlyForecastPoint[]>(generate24HourForecast());
  
  // Digital Twin Campus state
  const [buildings, setBuildings] = useState<CampusBuilding[]>(INITIAL_CAMPUS_BUILDINGS);
  const [scenarios] = useState<ScenarioPreset[]>(SCENARIO_PRESETS);

  // AI Advisor state
  const [advisorData, setAdvisorData] = useState<AIAdvisorResult | null>(null);
  const [isLoadingAdvisor, setIsLoadingAdvisor] = useState(false);

  // Simulation loop toggle
  const [isSimulating, setIsSimulating] = useState(true);

  // Modals & Inspectors
  const [isPitchModalOpen, setIsPitchModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<'solar' | 'load' | 'battery' | 'grid' | null>(null);

  // ScrollSpy listener to dynamically track current section in view
  useEffect(() => {
    const sectionIds: { id: NavigationView; elementId: string }[] = [
      { id: 'overview', elementId: 'section-overview' },
      { id: 'autopilot', elementId: 'section-autopilot' },
      { id: 'digital_twin', elementId: 'section-digital-twin' },
      { id: 'scenarios', elementId: 'section-scenarios' },
      { id: 'analytics', elementId: 'section-analytics' },
    ];

    const handleScroll = () => {
      // Toggle floating back-to-top button
      setShowScrollTop(window.pageYOffset > 400);

      const scrollPosition = window.pageYOffset + 220; // offset calculation

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i].elementId);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setCurrentView(sectionIds[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string, viewId: NavigationView) => {
    setCurrentView(viewId);
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -76;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // User Login & Logout handlers
  const handleLogin = (user: UserProfile) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('greengrid_user_session', JSON.stringify(user));
    } catch (e) {
      console.warn('Could not save session to localStorage:', e);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('greengrid_user_session');
    } catch (e) {
      console.warn('Could not remove session from localStorage:', e);
    }
  };

  // Subscription Plan Upgrade handler
  const handleUpgradePlan = (newTier: SubscriptionTier, billingCycle: BillingCycle) => {
    if (!currentUser) return;
    const updated: UserProfile = {
      ...currentUser,
      tier: newTier,
      billingCycle,
      nextBillingDate: billingCycle === 'monthly' ? 'Sept 27, 2026' : 'August 27, 2027',
    };
    setCurrentUser(updated);
    try {
      localStorage.setItem('greengrid_user_session', JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not update session:', e);
    }

    setAlerts((prev) => [
      {
        id: `alt-${Date.now()}`,
        title: `SCADA Plan Activated: ${newTier.toUpperCase()}`,
        description: `Microgrid site '${currentUser.facility}' upgraded to ${newTier} tier. Advanced predictive AI and ToD arbitrage unlocked.`,
        severity: 'success',
        timestamp: 'Just now',
        code: 'TIER_UPGRADE_SYNC',
        resolved: false,
        actionLabel: 'Active',
      },
      ...prev,
    ]);
  };

  // Calculate total active load
  const calculateTotalLoad = useCallback((loads: SubLoad[]) => {
    return loads.reduce((sum, item) => sum + (item.status === 'Shed' ? 0 : item.powerKw), 0);
  }, []);

  // Fetch AI recommendations from server endpoint
  const fetchAIAdvisor = useCallback(async (scenarioPrompt?: string) => {
    setIsLoadingAdvisor(true);
    try {
      const activeLoadsMap: Record<string, number> = {};
      subLoads.forEach((l) => {
        activeLoadsMap[l.name] = l.status === 'Shed' ? 0 : l.powerKw;
      });

      const response = await fetch('/api/grid-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          telemetry,
          mode: systemMode,
          scenarioPrompt,
          loads: activeLoadsMap,
          tier: currentUser?.tier || 'pro',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.advisor) {
          setAdvisorData(data.advisor);
        }
      }
    } catch (err) {
      console.warn('Could not reach /api/grid-advisor, using local intelligence engine:', err);
    } finally {
      setIsLoadingAdvisor(false);
    }
  }, [telemetry, systemMode, subLoads, currentUser]);

  // Initial AI dispatch run on mount
  useEffect(() => {
    if (currentUser) {
      fetchAIAdvisor();
    }
  }, [currentUser]);

  // Weather change handler with instant recalculation of solar irradiance
  const handleWeatherChange = (newWeather: WeatherCondition) => {
    setWeather(newWeather);
    let targetSolar = 125;
    let targetIrradiance = 840;

    if (newWeather === 'Sunny') {
      targetSolar = 125 + Math.random() * 15;
      targetIrradiance = 850;
    } else if (newWeather === 'Partly Cloudy') {
      targetSolar = 75 + Math.random() * 15;
      targetIrradiance = 520;
    } else if (newWeather === 'Rainy / Monsoon') {
      targetSolar = 32 + Math.random() * 10;
      targetIrradiance = 210;
    } else if (newWeather === 'Night / Twilight') {
      targetSolar = 0;
      targetIrradiance = 0;
    }

    setTelemetry((prev) => {
      const net = targetSolar - prev.loadKw;
      let batteryPower = 0;
      let gridKw = 0;

      if (prev.gridStatus === 'Islanded (Outage)') {
        batteryPower = net < 0 ? Math.abs(net) : -net;
        gridKw = 0;
      } else if (net >= 0) {
        batteryPower = -Math.min(net, 35);
        gridKw = -(net + batteryPower); // negative = export
      } else {
        batteryPower = Math.min(Math.abs(net), 45);
        gridKw = Math.abs(net) - batteryPower; // positive = import
      }

      return {
        ...prev,
        weather: newWeather,
        solarKw: Number(targetSolar.toFixed(1)),
        irradiance: targetIrradiance,
        batteryPowerKw: Number(batteryPower.toFixed(1)),
        gridKw: Number(gridKw.toFixed(1)),
      };
    });
  };

  // Continuous microgrid simulation tick
  useEffect(() => {
    if (!isSimulating || !currentUser) return;

    const interval = setInterval(() => {
      setTelemetry((prev) => {
        // Natural jitter in generation & load
        const solarJitter = (Math.random() - 0.5) * 1.5;
        const currentSolar = Math.max(0, prev.solarKw + (prev.weather === 'Night / Twilight' ? 0 : solarJitter));
        
        // If Autopilot is active, continuously evaluate optimization engine
        const isAutopilotActive = systemMode === 'AI_AUTO' || systemMode === 'PEAK_SHAVING' || systemMode === 'GREEN_MAX';
        
        let activeLoads = subLoads;
        if (isAutopilotActive) {
          const autoDecision = runAutopilotEngine(
            { ...prev, solarKw: currentSolar },
            subLoads,
            systemMode,
            prev.weather
          );
          activeLoads = autoDecision.optimizedSubLoads;
        }

        const totalLoad = calculateTotalLoad(activeLoads);
        const net = currentSolar - totalLoad;

        let batteryDeltaKw = 0;
        let gridKw = 0;
        let newSoc = prev.batterySoc;

        if (prev.gridStatus === 'Islanded (Outage)') {
          gridKw = 0;
          if (net < 0) {
            batteryDeltaKw = Math.abs(net);
            newSoc = Math.max(10, prev.batterySoc - (batteryDeltaKw / prev.batteryCapacityKwh) * 0.1);
          } else {
            batteryDeltaKw = -net;
            newSoc = Math.min(100, prev.batterySoc + (Math.abs(batteryDeltaKw) / prev.batteryCapacityKwh) * 0.1);
          }
        } else {
          // Normal connected mode with Autopilot optimization
          if (net >= 0) {
            if (prev.batterySoc < 95) {
              batteryDeltaKw = -Math.min(net, 30);
              newSoc = Math.min(100, prev.batterySoc + 0.05);
            }
            gridKw = -(net + batteryDeltaKw); // export
          } else {
            const deficit = Math.abs(net);
            if (prev.batterySoc > 20 && systemMode !== 'STORM_GUARD') {
              batteryDeltaKw = Math.min(deficit, 35);
              newSoc = Math.max(15, prev.batterySoc - 0.04);
            }
            gridKw = deficit - batteryDeltaKw; // import
          }
        }

        // Daily accumulator increments
        const hourFraction = 2.5 / 3600;
        const incrementalCleanEnergy = (currentSolar * hourFraction);
        const incrementalCostSavings = (incrementalCleanEnergy * prev.tariffRate);
        const incrementalCo2Avoided = (incrementalCleanEnergy * 0.82);

        return {
          ...prev,
          solarKw: Number(currentSolar.toFixed(1)),
          loadKw: Number(totalLoad.toFixed(1)),
          batterySoc: Number(newSoc.toFixed(1)),
          batteryPowerKw: Number(batteryDeltaKw.toFixed(1)),
          gridKw: Number(gridKw.toFixed(1)),
          dailySolarKwh: prev.dailySolarKwh + incrementalCleanEnergy,
          dailyConsumedKwh: prev.dailyConsumedKwh + (totalLoad * hourFraction),
          dailySavedInr: prev.dailySavedInr + incrementalCostSavings,
          co2OffsetKg: prev.co2OffsetKg + incrementalCo2Avoided,
          gridFrequency: Number((49.95 + Math.random() * 0.1).toFixed(2)),
          gridVoltage: Math.round(415 + (Math.random() - 0.5) * 4),
        };
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [isSimulating, subLoads, calculateTotalLoad, systemMode, currentUser]);

  // Load Controller Handlers
  const handleUpdateLoad = (id: string, newPower: number) => {
    setSubLoads((prev) =>
      prev.map((item) => (item.id === id ? { ...item, powerKw: newPower } : item))
    );
  };

  const handleToggleLoadStatus = (id: string) => {
    setSubLoads((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextStatus = item.status === 'Active' || item.status === 'Optimized' ? 'Eco-Throttled' : item.status === 'Eco-Throttled' ? 'Shed' : 'Active';
          return { ...item, status: nextStatus };
        }
        return item;
      })
    );
  };

  const handleTriggerDemandResponse = () => {
    setSubLoads((prev) =>
      prev.map((item) => {
        if (item.priority === 'Deferrable') {
          return { ...item, status: 'Shed' };
        }
        if (item.priority === 'Flexible') {
          return { ...item, status: 'Eco-Throttled', powerKw: Number((item.powerKw * 0.75).toFixed(1)) };
        }
        return item;
      })
    );

    setAlerts((prev) => [
      {
        id: `alt-${Date.now()}`,
        title: 'Automated Demand Response Triggered (Peak Shaving)',
        description: 'GreenGridAI shed non-critical HVAC and throttled parking chargers. Shaved 38 kW from grid demand.',
        severity: 'success',
        timestamp: 'Just now',
        code: 'DR_AUTOPILOT_EXEC',
        resolved: false,
        actionLabel: 'Active',
      },
      ...prev,
    ]);

    fetchAIAdvisor('Executed automated campus-wide demand response to offset peak ToD tariff.');
  };

  const handleSimulateEvSurge = () => {
    setSubLoads((prev) =>
      prev.map((item) =>
        item.id === 'load-ev' ? { ...item, powerKw: item.powerKw + 30, status: 'Active' } : item
      )
    );

    setAlerts((prev) => [
      {
        id: `alt-${Date.now()}`,
        title: 'EV Fast-Charging Plaza Peak Inrush (+30 kW)',
        description: '4 Heavy EV transit vans commenced 60kW DC charging. Battery dispatch increased to prevent grid penalty.',
        severity: 'warning',
        timestamp: 'Just now',
        code: 'EV_PEAK_SURGE',
        resolved: false,
        actionLabel: 'Mitigated',
      },
      ...prev,
    ]);

    fetchAIAdvisor('Heavy EV transit fleet arrival: 30kW surge on charger plaza.');
  };

  // Reset Sub-Loads to nominal
  const handleResetLoads = () => {
    setSubLoads(INITIAL_SUB_LOADS);
    setTelemetry((t) => ({ ...t, loadKw: 98.0 }));
  };

  // Autopilot Master Toggle Handler
  const handleToggleAutopilot = () => {
    const isCurrentlyActive = systemMode === 'AI_AUTO';
    const nextMode: SystemModeType = isCurrentlyActive ? 'MANUAL' : 'AI_AUTO';
    setSystemMode(nextMode);

    if (!isCurrentlyActive) {
      // Engaging Autopilot: Apply autonomous load optimization
      const autoDecision = runAutopilotEngine(telemetry, subLoads, 'AI_AUTO', weather);
      setSubLoads(autoDecision.optimizedSubLoads);
      setTelemetry((prev) => ({
        ...prev,
        batteryPowerKw: autoDecision.recommendedBatteryPowerKw,
        gridKw: autoDecision.recommendedGridKw,
      }));

      setAlerts((prev) => [
        {
          id: `alt-${Date.now()}`,
          title: 'AI Energy Autopilot Engaged (Autonomous Mode)',
          description: 'Closed-loop SCADA interlock active. Real-time multi-objective dispatch, ToD arbitrage, and load shedding engaged.',
          severity: 'success',
          timestamp: 'Just now',
          code: 'AUTOPILOT_ENGAGED',
          resolved: false,
          actionLabel: 'Autonomous',
        },
        ...prev,
      ]);

      fetchAIAdvisor('AI Energy Autopilot engaged: closed-loop SCADA autonomous dispatch active.');
    } else {
      // Disengaging to Manual
      setAlerts((prev) => [
        {
          id: `alt-${Date.now()}`,
          title: 'Manual Dispatch Override Engaged',
          description: 'AI Autopilot paused. Subsystems are operating under manual setpoints without automated ToD tariff arbitrage.',
          severity: 'warning',
          timestamp: 'Just now',
          code: 'AUTOPILOT_OVERRIDE',
          resolved: false,
          actionLabel: 'Manual',
        },
        ...prev,
      ]);
    }
  };

  // Apply Autopilot Walkthrough Demo Dispatch
  const handleApplyDemoDispatch = (dispatchedLoads: SubLoad[], batteryPowerKw: number) => {
    setSubLoads(dispatchedLoads);
    setTelemetry((prev) => ({
      ...prev,
      batteryPowerKw,
      gridKw: Number((telemetry.solarKw - calculateTotalLoad(dispatchedLoads) - batteryPowerKw).toFixed(1)),
    }));
    setSystemMode('AI_AUTO');

    setAlerts((prev) => [
      {
        id: `alt-${Date.now()}`,
        title: 'Autopilot Demo Dispatch Applied to SCADA Feed',
        description: 'Applied 4-stage (Monitor ➔ Predict ➔ Optimize ➔ Control) dispatch commands to all campus circuits.',
        severity: 'success',
        timestamp: 'Just now',
        code: 'AUTOPILOT_DEMO_APPLIED',
        resolved: false,
        actionLabel: 'Dispatched',
      },
      ...prev,
    ]);
  };

  // Microgrid Islanding Toggle
  const handleToggleIslanding = () => {
    setTelemetry((prev) => {
      const isCurrentlyIslanded = prev.gridStatus === 'Islanded (Outage)';
      const nextStatus = isCurrentlyIslanded ? 'Normal' : 'Islanded (Outage)';

      setAlerts((alt) => [
        {
          id: `alt-${Date.now()}`,
          title: isCurrentlyIslanded ? 'Grid Interconnection Restored' : 'Microgrid Islanded (Grid Outage Simulated)',
          description: isCurrentlyIslanded
            ? 'Resynchronized with 11kV substation. Frequency phase-locked at 50.0Hz.'
            : 'Zero power flow to external utility. BESS formed black-start grid voltage reference.',
          severity: isCurrentlyIslanded ? 'success' : 'critical',
          timestamp: 'Just now',
          code: isCurrentlyIslanded ? 'GRID_RESYNC' : 'MICROGRID_ISLAND',
          resolved: false,
          actionLabel: isCurrentlyIslanded ? 'Synchronized' : 'Islanded Mode',
        },
        ...alt,
      ]);

      return {
        ...prev,
        gridStatus: nextStatus,
        gridKw: isCurrentlyIslanded ? -4.9 : 0,
      };
    });
  };

  // Anomaly Mitigation Handler
  const handleMitigateAnomaly = (buildingId: string) => {
    setBuildings(prev => prev.map(b => {
      if (b.id === buildingId) {
        return {
          ...b,
          hasAnomaly: false,
          aiStatus: 'Optimized',
          currentLoadKw: b.nominalLoadKw,
          efficiencyPercent: 94,
          anomalyDetails: undefined,
        };
      }
      return b;
    }));

    setAlerts(prev => [
      {
        id: `alt-${Date.now()}`,
        title: 'Energy Anomaly Auto-Mitigated by SCADA Interlock',
        description: `Modbus load-shedding circuit at '${buildingId}' trimmed rogue auxiliary heating. Saved ~₹140/hr in wasted power.`,
        severity: 'success',
        timestamp: 'Just now',
        code: 'ANOMALY_AUTO_MITIGATED',
        resolved: false,
        actionLabel: 'Fixed',
      },
      ...prev,
    ]);
  };

  // Apply What-If Scenario to live SCADA simulation
  const handleApplyScenarioToLive = (scenario: ScenarioPreset) => {
    setTelemetry(prev => ({
      ...prev,
      solarKw: scenario.solarKw,
      loadKw: scenario.loadKw,
      batterySoc: scenario.batterySoc,
      tariffRate: scenario.tariffRate,
      gridStatus: scenario.gridStatus,
    }));

    setWeather(scenario.weather);
    setSystemMode(scenario.systemMode);

    setAlerts(prev => [
      {
        id: `alt-${Date.now()}`,
        title: `What-If Contingency Active: ${scenario.name}`,
        description: `Applied simulated scenario '${scenario.name}' to live telemetry bus for testing AI optimization response.`,
        severity: 'warning',
        timestamp: 'Just now',
        code: 'SCENARIO_INJECTED',
        resolved: false,
        actionLabel: 'Simulated',
      },
      ...prev,
    ]);

    fetchAIAdvisor(`Simulated scenario '${scenario.name}': Solar ${scenario.solarKw}kW, Load ${scenario.loadKw}kW, Battery ${scenario.batterySoc}%, Tariff ₹${scenario.tariffRate}/kWh.`);
  };

  // Alert Actions
  const handleResolveAlert = (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, resolved: true } : a)));
  };

  const handleSimulateNewAlert = () => {
    const scenariosList = [
      {
        title: 'Monsoon Cloud Transient Detected',
        description: 'Solar generation dropped 45kW within 10 seconds. BESS fast inverter ramped up instantaneously.',
        severity: 'warning' as const,
        code: 'SOLAR_IRR_RAMP',
      },
      {
        title: 'Utility Grid Frequency Dip (49.88 Hz)',
        description: 'Regional grid frequency dropped below 49.90 Hz. GreenGridAI provided synthetic inertia response.',
        severity: 'critical' as const,
        code: 'FREQ_INERTIA_RESP',
      },
      {
        title: 'Net-Metering High Export Window Active',
        description: 'Discom feed-in tariff is currently +₹2.50 bonus. Exporting surplus 18kW clean energy.',
        severity: 'success' as const,
        code: 'FEED_IN_SURPLUS',
      },
    ];

    const pick = scenariosList[Math.floor(Math.random() * scenariosList.length)];
    setAlerts((prev) => [
      {
        id: `alt-${Date.now()}`,
        title: pick.title,
        description: pick.description,
        severity: pick.severity,
        timestamp: 'Just now',
        code: pick.code,
        resolved: false,
        actionLabel: 'Resolved',
      },
      ...prev,
    ]);
  };

  // If user is not logged in, show the Login / Registration & Plans portal
  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const isAutopilotActive = systemMode === 'AI_AUTO' || systemMode === 'PEAK_SHAVING' || systemMode === 'GREEN_MAX';

  return (
    <div className="min-h-screen text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950 flex flex-col relative overflow-x-hidden">
      
      {/* Ambient background glow orbs */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-1/4 right-1/4 w-[500px] h-[500px] bg-teal-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed top-1/2 right-10 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Navbar with controls and user session */}
      <Navbar
        currentView={currentView}
        onViewChange={setCurrentView}
        weather={weather}
        onWeatherChange={handleWeatherChange}
        systemMode={systemMode}
        onModeChange={setSystemMode}
        isSimulating={isSimulating}
        onToggleSimulate={() => setIsSimulating(!isSimulating)}
        onOpenPitchModal={() => setIsPitchModalOpen(true)}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        currentUser={currentUser}
        onOpenSubscriptionModal={() => setIsSubscriptionModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Microgrid Workspace in Unified Scrolling Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12">
        
        {/* Section 1: Overview, Hero Status & SCADA Telemetry Bus */}
        <section id="section-overview" className="space-y-6 scroll-mt-20">
          {/* Top Hero Status Banner */}
          <HeroStatusArea
            telemetry={telemetry}
            currentUser={currentUser}
            systemMode={systemMode}
            isAutopilotActive={isAutopilotActive}
            onToggleAutopilot={handleToggleAutopilot}
            onOpenSubscriptionModal={() => setIsSubscriptionModalOpen(true)}
            onOpenPitchModal={() => setIsPitchModalOpen(true)}
          />

          {/* Metric Cards Grid (6 cards) */}
          <MetricCards 
            telemetry={telemetry} 
            onSelectNode={(node) => setSelectedNode(node)} 
          />

          {/* Live Microgrid Power Flow Canvas */}
          <MicrogridPowerFlowCanvas
            telemetry={telemetry}
            systemMode={systemMode}
            selectedNode={selectedNode}
            onSelectNode={setSelectedNode}
            onIsolateGrid={handleToggleIslanding}
          />
        </section>

        {/* Section 2: AI Energy Autopilot Core */}
        <section id="section-autopilot" className="space-y-4 scroll-mt-20 pt-4 border-t border-white/[0.06]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-[11px] font-bold">
                SECTION 02
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-emerald-400" />
                AI Energy Autopilot Engine
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">
              MONITOR → PREDICT → OPTIMIZE → CONTROL
            </span>
          </div>

          <AIPredictionAndAdvisor
            telemetry={telemetry}
            subLoads={subLoads}
            systemMode={systemMode}
            advisorData={advisorData}
            isLoadingAdvisor={isLoadingAdvisor}
            onRefreshAdvisor={(prompt) => fetchAIAdvisor(prompt)}
            isAutopilotActive={isAutopilotActive}
            onToggleAutopilot={handleToggleAutopilot}
            onApplyDemoDispatch={handleApplyDemoDispatch}
          />
        </section>

        {/* Section 3: Solar Meteorology & 7-Day Weather Dispatch Center */}
        <section id="section-weather" className="space-y-4 scroll-mt-20 pt-4 border-t border-white/[0.06]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono text-[11px] font-bold">
                SECTION 03
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <Sun className="w-5 h-5 text-amber-400" />
                Solar Meteorology & Weather Dispatch Center
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">
              GHI Irradiance • Cloud Attenuation • 7-Day Microgrid Yield
            </span>
          </div>

          <WeatherForecastSection
            currentWeather={weather}
            onWeatherChange={handleWeatherChange}
            telemetry={telemetry}
          />
        </section>

        {/* Section 4: Campus Digital Twin & Sub-Meter Matrix */}
        <section id="section-digital-twin" className="space-y-4 scroll-mt-20 pt-4 border-t border-white/[0.06]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-teal-500/15 border border-teal-500/30 text-teal-300 font-mono text-[11px] font-bold">
                SECTION 04
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <Building2 className="w-5 h-5 text-teal-400" />
                Campus Digital Twin & Sub-Meters
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">
              KIIT Smart Campus • 50 Hostels (KP 1-25 & QC 1-25) • 56 Sub-Meters
            </span>
          </div>

          {/* Energy Anomaly Notification Section (if anomalies detected) */}
          <AnomalyDetectionSection
            buildings={buildings}
            onMitigateAnomaly={handleMitigateAnomaly}
          />

          {/* Campus Digital Twin Component */}
          <CampusDigitalTwin
            buildings={buildings}
            onMitigateAnomaly={handleMitigateAnomaly}
          />
        </section>

        {/* Section 5: What-If Contingency & Stress Lab */}
        <section id="section-scenarios" className="space-y-4 scroll-mt-20 pt-4 border-t border-white/[0.06]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-mono text-[11px] font-bold">
                SECTION 05
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <Sliders className="w-5 h-5 text-cyan-400" />
                What-If Contingency & Stress Lab
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">
              Dynamic In-Memory Stress Simulator
            </span>
          </div>

          <WhatIfSimulator
            scenarios={scenarios}
            onApplyScenarioToLive={handleApplyScenarioToLive}
          />
        </section>

        {/* Section 6: Analytics & 24h Neural Energy Forecast */}
        <section id="section-analytics" className="space-y-4 scroll-mt-20 pt-4 border-t border-white/[0.06]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-purple-500/15 border border-purple-500/30 text-purple-300 font-mono text-[11px] font-bold">
                SECTION 06
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-purple-400" />
                Analytics & 24-Hour Energy Forecast
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">
              ToD Tariff Arbitrage & Historical Trends
            </span>
          </div>

          <AnalyticsView
            telemetry={telemetry}
            subLoads={subLoads}
          />
          
          <EnergyFlowChart forecastData={forecastData} />
        </section>

        {/* Section 7: Smart Sub-Load Controller & Live Alerts Feed */}
        <section id="section-loads-alerts" className="space-y-4 scroll-mt-20 pt-4 border-t border-white/[0.06]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono text-[11px] font-bold">
                SECTION 07
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-400" />
                Smart Load Demand Response & SCADA Alerts
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">
              Modbus Demand Shedding & Real-Time Event Bus
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SmartLoadController
              subLoads={subLoads}
              onUpdateLoad={handleUpdateLoad}
              onToggleStatus={handleToggleLoadStatus}
              onTriggerDemandResponse={handleTriggerDemandResponse}
              onSimulateEvSurge={handleSimulateEvSurge}
              onResetLoads={handleResetLoads}
            />

            <AlertsPanel
              alerts={alerts}
              onResolveAlert={handleResolveAlert}
              onSimulateNewAlert={handleSimulateNewAlert}
              onClearAll={() => setAlerts([])}
            />
          </div>
        </section>

      </main>

      {/* Floating Quick Navigation & Scroll to Top Widget */}
      {showScrollTop && (
        <aside aria-label="Quick Scroll Navigation" className="fixed bottom-6 right-6 z-40 flex flex-col items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-1.5 shadow-2xl shadow-black/80 flex flex-col gap-1">
            <button
              onClick={() => scrollToSection('section-overview', 'overview')}
              title="Jump to Overview"
              className={`p-2 rounded-xl text-xs transition cursor-pointer ${
                currentView === 'overview' ? 'bg-emerald-500/20 text-emerald-400 font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollToSection('section-autopilot', 'autopilot')}
              title="Jump to AI Autopilot"
              className={`p-2 rounded-xl text-xs transition cursor-pointer ${
                currentView === 'autopilot' ? 'bg-emerald-500/20 text-emerald-400 font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <BrainCircuit className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollToSection('section-digital-twin', 'digital_twin')}
              title="Jump to Digital Twin"
              className={`p-2 rounded-xl text-xs transition cursor-pointer ${
                currentView === 'digital_twin' ? 'bg-emerald-500/20 text-emerald-400 font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Building2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollToSection('section-scenarios', 'scenarios')}
              title="Jump to What-If Lab"
              className={`p-2 rounded-xl text-xs transition cursor-pointer ${
                currentView === 'scenarios' ? 'bg-emerald-500/20 text-emerald-400 font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sliders className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollToSection('section-analytics', 'analytics')}
              title="Jump to Analytics"
              className={`p-2 rounded-xl text-xs transition cursor-pointer ${
                currentView === 'analytics' ? 'bg-emerald-500/20 text-emerald-400 font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <BarChart2 className="w-4 h-4" />
            </button>
            <div className="h-px bg-white/10 my-0.5" />
            <button
              onClick={scrollToTop}
              title="Back to Top"
              className="p-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition cursor-pointer active:scale-95 shadow-md shadow-emerald-500/20"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </aside>
      )}

      {/* Frosted Glass Footer */}
      <footer className="mt-auto border-t border-white/10 bg-slate-950/70 backdrop-blur-xl py-4 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <GreenGridLogo size={20} />
            <span className="font-medium text-slate-300">
              <strong className="text-white">green</strong><strong className="text-emerald-400">grid</strong><span className="text-teal-300 font-semibold text-[11px]">.ai</span> • Smart India Hackathon 2026 Core
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              CEA Grid Compliant
            </span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-slate-400 hidden sm:inline">ISO 50001 Verified</span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-teal-300">Microgrid SCADA v2.4</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <SIHPitchModal 
        isOpen={isPitchModalOpen} 
        onClose={() => setIsPitchModalOpen(false)} 
      />

      <AuditReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        telemetry={telemetry}
        subLoads={subLoads}
      />

      <NodeInspectorModal
        selectedNode={selectedNode}
        onClose={() => setSelectedNode(null)}
        telemetry={telemetry}
        onUpdateSolarRating={(v) => setTelemetry((t) => ({ ...t, solarKw: v }))}
        onUpdateBatterySoc={(v) => setTelemetry((t) => ({ ...t, batterySoc: v }))}
      />

      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
        currentUser={currentUser}
        onUpgradePlan={handleUpgradePlan}
      />

    </div>
  );
}
