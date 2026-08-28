import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Sun, 
  CloudSun, 
  CloudRain, 
  Moon, 
  Play, 
  Sparkles, 
  Award,
  FileText,
  Activity,
  Crown,
  LogOut,
  ChevronDown,
  Building2,
  LayoutDashboard,
  BrainCircuit,
  Sliders,
  BarChart2,
  Languages
} from 'lucide-react';
import { GreenGridLogo } from './GreenGridLogo';
import { WeatherCondition, SystemModeType, UserProfile, NavigationView } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface NavbarProps {
  currentView: NavigationView;
  onViewChange: (view: NavigationView) => void;
  weather: WeatherCondition;
  onWeatherChange: (w: WeatherCondition) => void;
  systemMode: SystemModeType;
  onModeChange: (m: SystemModeType) => void;
  isSimulating: boolean;
  onToggleSimulate: () => void;
  onOpenPitchModal: () => void;
  onOpenReportModal: () => void;
  currentUser?: UserProfile | null;
  onOpenSubscriptionModal: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onViewChange,
  weather,
  onWeatherChange,
  systemMode,
  onModeChange,
  isSimulating,
  onToggleSimulate,
  onOpenPitchModal,
  onOpenReportModal,
  currentUser,
  onOpenSubscriptionModal,
  onLogout,
}) => {
  const { language, toggleLanguage, t } = useLanguage();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const navItems: { id: NavigationView; label: string; sectionId: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: t.navOverview, sectionId: 'section-overview', icon: <LayoutDashboard className="w-3.5 h-3.5" /> },
    { id: 'autopilot', label: t.navAutopilot, sectionId: 'section-autopilot', icon: <BrainCircuit className="w-3.5 h-3.5" /> },
    { id: 'weather', label: t.navWeather, sectionId: 'section-weather', icon: <Sun className="w-3.5 h-3.5 text-amber-400" /> },
    { id: 'digital_twin', label: t.navDigitalTwin, sectionId: 'section-digital-twin', icon: <Building2 className="w-3.5 h-3.5" /> },
    { id: 'scenarios', label: t.navScenarios, sectionId: 'section-scenarios', icon: <Sliders className="w-3.5 h-3.5" /> },
    { id: 'analytics', label: t.navAnalytics, sectionId: 'section-analytics', icon: <BarChart2 className="w-3.5 h-3.5" /> },
  ];

  // Check scroll boundary to show/hide subtle left & right fade indicators
  const checkScrollState = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const hasLeft = el.scrollLeft > 6;
    const hasRight = el.scrollLeft < el.scrollWidth - el.clientWidth - 6;
    setCanScrollLeft(hasLeft);
    setCanScrollRight(hasRight);
  }, []);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    checkScrollState();

    const handleScroll = () => checkScrollState();
    el.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', checkScrollState, { passive: true });

    return () => {
      el.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', checkScrollState);
    };
  }, [checkScrollState]);

  // Automatically scroll active navigation item into view inside the navbar container only
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const activeItem = container.querySelector<HTMLElement>(`[data-nav-id="${currentView}"]`);
    if (activeItem) {
      const itemLeft = activeItem.offsetLeft;
      const itemWidth = activeItem.offsetWidth;
      const containerLeft = container.scrollLeft;
      const containerWidth = container.clientWidth;

      if (itemLeft < containerLeft) {
        container.scrollTo({ left: Math.max(0, itemLeft - 24), behavior: 'smooth' });
      } else if (itemLeft + itemWidth > containerLeft + containerWidth) {
        container.scrollTo({ left: itemLeft + itemWidth - containerWidth + 24, behavior: 'smooth' });
      }
    }
  }, [currentView]);

  const handleNavClick = (viewId: NavigationView, sectionId: string) => {
    onViewChange(viewId);
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -76; // header height offset
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-2xl border-b border-white/[0.08] text-slate-100 shadow-2xl shadow-black/50 select-none">
      <div className="relative max-w-[100vw] w-full overflow-hidden">
        
        {/* Subtle Left Fade Indicator when scrollable content exists on left */}
        <div 
          aria-hidden="true"
          className={`pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent transition-opacity duration-300 z-20 ${
            canScrollLeft ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Subtle Right Fade Indicator when scrollable content exists on right */}
        <div 
          aria-hidden="true"
          className={`pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-l from-slate-950 via-slate-950/85 to-transparent transition-opacity duration-300 z-20 ${
            canScrollRight ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Single Horizontally Scrollable Navigation Container */}
        <div
          ref={scrollContainerRef}
          className="w-full overflow-x-auto overflow-y-hidden no-scrollbar flex items-center h-16 px-4 sm:px-6 lg:px-8 space-x-3 sm:space-x-4 whitespace-nowrap"
          role="navigation"
          aria-label="SCADA Navigation Taskbar"
        >
          
          {/* Logo & Branding */}
          <div 
            onClick={() => handleNavClick('overview', 'section-overview')}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleNavClick('overview', 'section-overview');
              }
            }}
            title="GreenGrid AI - SCADA Autonomous Dispatch"
          >
            <GreenGridLogo size={36} animated />
            <div className="shrink-0">
              <div className="flex items-center gap-2">
                <span className="font-black text-base tracking-tight text-white flex items-baseline">
                  <span className="text-white">green</span>
                  <span className="text-emerald-400">grid</span>
                  <span className="text-teal-300 font-semibold text-sm ml-0.5">.ai</span>
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  SCADA v2.4
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono tracking-tight hidden 2xl:block">
                Predictive Microgrid & Autonomous Dispatch Core
              </p>
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="h-6 w-px bg-white/10 shrink-0" aria-hidden="true" />

          {/* Center Navigation View Switcher with Smooth Scroll Anchors */}
          <nav className="flex items-center bg-black/40 backdrop-blur-md rounded-2xl p-1 border border-white/[0.08] text-xs font-mono shrink-0">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-btn-${item.id}`}
                  data-nav-id={item.id}
                  onClick={() => handleNavClick(item.id, item.sectionId)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all duration-200 cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500/25 to-teal-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm shadow-emerald-950/50'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
                  }`}
                >
                  <span className={isActive ? 'text-emerald-400' : 'text-slate-400'}>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Vertical Divider */}
          <div className="h-6 w-px bg-white/10 shrink-0" aria-hidden="true" />

          {/* Weather Scenario Simulator */}
          <div className="flex items-center bg-black/40 backdrop-blur-md rounded-xl p-1 border border-white/[0.08] text-xs font-mono shrink-0">
            <span className="text-slate-500 px-2 flex items-center gap-1 font-medium text-[11px]">
              {t.envLabel}
            </span>
            <button
              id="btn-weather-sunny"
              onClick={() => onWeatherChange('Sunny')}
              title="Sunny (High Solar Irradiance)"
              aria-label="Set weather to Sunny"
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 ${
                weather === 'Sunny' ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/40 shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>{t.weatherSunny}</span>
            </button>
            <button
              id="btn-weather-cloudy"
              onClick={() => onWeatherChange('Partly Cloudy')}
              title="Partly Cloudy"
              aria-label="Set weather to Partly Cloudy"
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sky-400 ${
                weather === 'Partly Cloudy' ? 'bg-sky-500/20 text-sky-300 font-semibold border border-sky-500/40 shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <CloudSun className="w-3.5 h-3.5" />
              <span>{t.weatherCloudy}</span>
            </button>
            <button
              id="btn-weather-rainy"
              onClick={() => onWeatherChange('Rainy / Monsoon')}
              title="Monsoon / Rainy"
              aria-label="Set weather to Monsoon"
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-400 ${
                weather === 'Rainy / Monsoon' ? 'bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/40 shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <CloudRain className="w-3.5 h-3.5" />
              <span>{t.weatherRain}</span>
            </button>
            <button
              id="btn-weather-night"
              onClick={() => onWeatherChange('Night / Twilight')}
              title="Night / Twilight"
              aria-label="Set weather to Night"
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-400 ${
                weather === 'Night / Twilight' ? 'bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/40 shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>{t.weatherNight}</span>
            </button>
            <div className="h-4 w-px bg-white/10 mx-0.5" />
            <button
              id="btn-nav-to-weather-forecast"
              onClick={() => handleNavClick('weather', 'section-weather')}
              title="Open 7-Day Solar & Weather Forecast Hub"
              aria-label="Open 7-Day Solar & Weather Forecast Hub"
              className="px-2 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-bold flex items-center gap-1 transition cursor-pointer shrink-0"
            >
              <Sun className="w-3 h-3 text-amber-400" />
              <span>{t.forecastHub}</span>
            </button>
          </div>

          {/* Mode Selector */}
          <div className="flex items-center bg-black/40 backdrop-blur-md rounded-xl p-1 border border-white/[0.08] text-xs shrink-0">
            <span className="text-slate-400 px-2 flex items-center gap-1 text-[11px] font-mono">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              {t.modeLabel}
            </span>
            <select
              id="select-system-mode"
              aria-label="Select System Optimization Mode"
              value={systemMode}
              onChange={(e) => onModeChange(e.target.value as SystemModeType)}
              className="bg-transparent text-slate-200 text-xs font-semibold focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400 rounded cursor-pointer pr-1"
            >
              <option value="AI_AUTO" className="bg-slate-900 text-slate-100">{t.modeAiAuto}</option>
              <option value="PEAK_SHAVING" className="bg-slate-900 text-slate-100">{t.modePeakShaving}</option>
              <option value="GREEN_MAX" className="bg-slate-900 text-slate-100">{t.modeGreenMax}</option>
              <option value="STORM_GUARD" className="bg-slate-900 text-slate-100">{t.modeStormGuard}</option>
              <option value="MANUAL" className="bg-slate-900 text-slate-100">{t.modeManual}</option>
            </select>
          </div>

          {/* Live Play/Pause simulation tick */}
          <button
            id="btn-toggle-sim"
            onClick={onToggleSimulate}
            title={isSimulating ? 'Pause Live Telemetry' : 'Resume Live Telemetry'}
            aria-label={isSimulating ? 'Pause Live Telemetry' : 'Resume Live Telemetry'}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition backdrop-blur-md cursor-pointer active:scale-95 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
              isSimulating
                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25 shadow-sm'
                : 'bg-amber-500/15 text-amber-300 border-amber-500/30 hover:bg-amber-500/25'
            }`}
          >
            {isSimulating ? (
              <>
                <Activity className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
                <span className="font-mono text-[11px]">{t.liveTelemetry}</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-mono text-[11px]">{t.pausedTelemetry}</span>
              </>
            )}
          </button>

          {/* Language Toggle Button (SIH 2024 Bilingual Mode) */}
          <button
            id="btn-toggle-language"
            onClick={toggleLanguage}
            title={t.langToggleTitle}
            aria-label={t.langToggleTitle}
            className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-emerald-500/15 hover:from-amber-500/25 hover:to-emerald-500/25 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition backdrop-blur-md shadow-sm active:scale-95 cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            <Languages className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono tracking-tight text-[11px] flex items-center gap-1">
              <span className={language === 'en' ? 'text-amber-300 font-black' : 'text-slate-400'}>EN</span>
              <span className="text-slate-500">/</span>
              <span className={language === 'hi' ? 'text-emerald-300 font-black' : 'text-slate-400'}>हिंदी</span>
            </span>
          </button>

          {/* Report Generator */}
          <button
            id="btn-open-audit-report"
            onClick={onOpenReportModal}
            className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] backdrop-blur-md border border-white/[0.08] text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer active:scale-95 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            title="Audit Report & Energy Accounting"
            aria-label="Open Audit Report & Energy Accounting Modal"
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>{t.auditReport}</span>
          </button>

          {/* SIH Hackathon Pitch Mode Button */}
          <button
            id="btn-open-sih-pitch"
            onClick={onOpenPitchModal}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 border border-white/20 backdrop-blur-md transition active:scale-95 cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            title="Open SIH Hackathon Jury Presentation Deck"
            aria-label="Open SIH Presentation Deck"
          >
            <Award className="w-3.5 h-3.5 text-slate-950" />
            <span className="font-mono">{t.sihDeck}</span>
          </button>

          {/* Subscription & Plan Status Button */}
          {currentUser && (
            <button
              id="btn-open-subscription"
              onClick={onOpenSubscriptionModal}
              className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition backdrop-blur-md shadow-sm cursor-pointer active:scale-95 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              title="Manage SCADA Subscription & Upgrade Plan"
              aria-label="Manage Subscription"
            >
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span className="uppercase font-mono text-[11px]">{currentUser.tier}</span>
            </button>
          )}

          {/* User Profile & Logout Popover */}
          {currentUser && (
            <div className="relative shrink-0 pr-2">
              <button
                id="btn-user-menu-trigger"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                aria-expanded={isUserMenuOpen}
                aria-label="User Account Menu"
                className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs transition backdrop-blur-md cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-bold text-[11px] flex items-center justify-center overflow-hidden shrink-0">
                  {currentUser.avatarUrl ? (
                    <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" />
                  ) : (
                    currentUser.name.charAt(0)
                  )}
                </div>
                <span className="font-semibold text-slate-200 truncate max-w-[100px]">
                  {currentUser.name.split(' ')[0]}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40 bg-black/20" 
                    onClick={() => setIsUserMenuOpen(false)} 
                  />
                  <div className="fixed right-4 top-16 w-64 rounded-2xl bg-slate-900/95 backdrop-blur-2xl border border-white/[0.12] p-3 shadow-2xl z-50 text-xs text-slate-200 space-y-3 ring-1 ring-white/[0.08]">
                    <div className="pb-2 border-b border-white/[0.08]">
                      <div className="font-bold text-white text-sm">{currentUser.name}</div>
                      <div className="text-slate-400 text-[11px] truncate font-mono">{currentUser.email}</div>
                      <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-emerald-400 font-medium">
                        <Building2 className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span className="truncate">{currentUser.facility}</span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-1.5">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-400">License Tier:</span>
                        <span className="font-bold text-amber-400 uppercase font-mono flex items-center gap-1">
                          <Crown className="w-3 h-3" />
                          {currentUser.tier}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-400">Role:</span>
                        <span className="text-slate-300 font-medium">{currentUser.role}</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-400">Renewal Date:</span>
                        <span className="text-slate-300 font-mono text-[10px]">{currentUser.nextBillingDate}</span>
                      </div>
                    </div>

                    <div className="space-y-1 pt-1">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onOpenSubscriptionModal();
                        }}
                        className="w-full text-left p-2 rounded-xl hover:bg-white/[0.06] text-amber-300 flex items-center justify-between transition font-semibold cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <Crown className="w-3.5 h-3.5 text-amber-400" />
                          Plans & Billing
                        </span>
                        <span className="text-[10px] bg-amber-400/20 px-1.5 py-0.5 rounded text-amber-200 font-mono">
                          UPGRADE
                        </span>
                      </button>

                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onLogout();
                        }}
                        className="w-full text-left p-2 rounded-xl hover:bg-rose-500/15 text-rose-300 flex items-center gap-2 transition font-semibold cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5 text-rose-400" />
                        <span>Sign Out Workstation</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

        </div>
      </div>
    </header>
  );
};
