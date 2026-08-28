import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  School, 
  Home, 
  Building, 
  BookOpen, 
  FlaskConical, 
  UtensilsCrossed, 
  Car, 
  Zap, 
  Sun, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowUpRight,
  TrendingUp,
  Activity,
  Sliders,
  X,
  Sparkles,
  Search,
  Users,
  Grid,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Filter
} from 'lucide-react';
import { CampusBuilding, BuildingCategory } from '../types';

interface CampusDigitalTwinProps {
  buildings: CampusBuilding[];
  onSelectBuilding?: (building: CampusBuilding) => void;
  onMitigateAnomaly?: (buildingId: string) => void;
}

type FilterCategory = 'ALL' | 'BOYS_HOSTEL' | 'GIRLS_HOSTEL' | 'ACADEMIC' | 'FACILITY' | 'ANOMALIES';
type ViewMode = 'GRID' | 'MAP';

export const CampusDigitalTwin: React.FC<CampusDigitalTwinProps> = ({
  buildings,
  onSelectBuilding,
  onMitigateAnomaly,
}) => {
  const [selectedBuildingId, setSelectedBuildingId] = useState<string>(buildings[0]?.id || 'bld-kp-1');
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<ViewMode>('GRID');

  // Filtered buildings calculation
  const filteredBuildings = useMemo(() => {
    return buildings.filter(building => {
      // Search query filter
      const matchesSearch = 
        building.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (building.code && building.code.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (building.campusZone && building.campusZone.toLowerCase().includes(searchQuery.toLowerCase())) ||
        building.type.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // Category filter
      switch (activeFilter) {
        case 'BOYS_HOSTEL':
          return building.type === 'Boys Hostel';
        case 'GIRLS_HOSTEL':
          return building.type === 'Girls Hostel';
        case 'ACADEMIC':
          return building.type === 'Academic' || building.type === 'Research';
        case 'FACILITY':
          return building.type === 'Facility' || building.type === 'Mobility' || building.type === 'Residential';
        case 'ANOMALIES':
          return building.hasAnomaly;
        case 'ALL':
        default:
          return true;
      }
    });
  }, [buildings, activeFilter, searchQuery]);

  const selectedBuilding = buildings.find(b => b.id === selectedBuildingId) || buildings[0];

  // Aggregate Metrics
  const stats = useMemo(() => {
    const boysList = buildings.filter(b => b.type === 'Boys Hostel');
    const girlsList = buildings.filter(b => b.type === 'Girls Hostel');
    const totalCampusDemand = buildings.reduce((acc, b) => acc + b.currentLoadKw, 0);
    const totalSolarAllocation = buildings.reduce((acc, b) => acc + b.solarAllocationKw, 0);
    const boysDemand = boysList.reduce((acc, b) => acc + b.currentLoadKw, 0);
    const girlsDemand = girlsList.reduce((acc, b) => acc + b.currentLoadKw, 0);
    const totalOccupancy = buildings.reduce((acc, b) => acc + (b.occupancy || 0), 0);
    const anomalyCount = buildings.filter(b => b.hasAnomaly).length;

    return {
      totalCampusDemand,
      totalSolarAllocation,
      boysDemand,
      girlsDemand,
      totalOccupancy,
      anomalyCount,
      boysCount: boysList.length,
      girlsCount: girlsList.length,
      totalNodes: buildings.length,
    };
  }, [buildings]);

  const getBuildingIcon = (iconName: string, className: string = "w-5 h-5") => {
    switch (iconName) {
      case 'School': return <School className={className} />;
      case 'Home': return <Home className={className} />;
      case 'Building': return <Building className={className} />;
      case 'BookOpen': return <BookOpen className={className} />;
      case 'FlaskConical': return <FlaskConical className={className} />;
      case 'UtensilsCrossed': return <UtensilsCrossed className={className} />;
      case 'Car': return <Car className={className} />;
      default: return <Building2 className={className} />;
    }
  };

  const getStatusBadge = (status: CampusBuilding['aiStatus']) => {
    switch (status) {
      case 'Optimized':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            OPTIMIZED
          </span>
        );
      case 'Normal':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
            NORMAL
          </span>
        );
      case 'Throttled':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
            ECO-THROTTLED
          </span>
        );
      case 'Anomaly Detected':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
            ANOMALY SPIKE
          </span>
        );
    }
  };

  // Quick navigation handlers
  const handleSelectBuilding = (building: CampusBuilding) => {
    setSelectedBuildingId(building.id);
    if (onSelectBuilding) onSelectBuilding(building);
  };

  const handleNextBuilding = () => {
    const currentIndex = buildings.findIndex(b => b.id === selectedBuildingId);
    const nextIndex = (currentIndex + 1) % buildings.length;
    handleSelectBuilding(buildings[nextIndex]);
  };

  const handlePrevBuilding = () => {
    const currentIndex = buildings.findIndex(b => b.id === selectedBuildingId);
    const prevIndex = (currentIndex - 1 + buildings.length) % buildings.length;
    handleSelectBuilding(buildings[prevIndex]);
  };

  return (
    <div className="bg-slate-900/70 backdrop-blur-2xl rounded-3xl p-5 sm:p-7 border border-white/[0.08] shadow-2xl shadow-black/50 relative overflow-hidden ring-1 ring-white/[0.06]">
      
      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/3 w-80 h-80 bg-cyan-500/[0.05] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-emerald-500/[0.04] rounded-full blur-3xl pointer-events-none" />

      {/* Header with KIIT Branding & Summary */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-white/[0.08] relative z-10">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
              <Building2 className="w-4 h-4 text-cyan-400" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Kalinga Institute of Industrial Technology (KIIT) Digital Twin
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              56 Connected Facilities
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              25 Boys Hostels (KP) • 25 Girls Hostels (QC)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Bhubaneswar Green Campus SCADA sub-meter matrix, real-time rooftop solar allocation, and residential peak-shaving dispatch.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 bg-black/40 rounded-xl border border-white/[0.08]">
            <button
              onClick={() => setViewMode('GRID')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer ${
                viewMode === 'GRID' 
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-bold' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Sub-Meter Grid</span>
            </button>
            <button
              onClick={() => setViewMode('MAP')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer ${
                viewMode === 'MAP' 
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-bold' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>2D Spatial Twin</span>
            </button>
          </div>
        </div>
      </div>

      {/* Aggregate Telemetry Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mb-6 relative z-10">
        <div className="p-3 rounded-2xl bg-black/30 border border-white/[0.06] backdrop-blur-md">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Total Campus Load</span>
          <span className="text-base sm:text-lg font-bold font-mono text-cyan-300 block mt-0.5">
            {stats.totalCampusDemand.toFixed(1)} kW
          </span>
          <span className="text-[10px] text-slate-500 font-mono">56 Sub-meters sync</span>
        </div>

        <div className="p-3 rounded-2xl bg-black/30 border border-white/[0.06] backdrop-blur-md">
          <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider block flex items-center gap-1">
            <Home className="w-3 h-3" /> Boys (KP 1-25)
          </span>
          <span className="text-base sm:text-lg font-bold font-mono text-blue-300 block mt-0.5">
            {stats.boysDemand.toFixed(1)} kW
          </span>
          <span className="text-[10px] text-slate-500 font-mono">25 King's Palace Blocks</span>
        </div>

        <div className="p-3 rounded-2xl bg-black/30 border border-white/[0.06] backdrop-blur-md">
          <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider block flex items-center gap-1">
            <Building className="w-3 h-3" /> Girls (QC 1-25)
          </span>
          <span className="text-base sm:text-lg font-bold font-mono text-purple-300 block mt-0.5">
            {stats.girlsDemand.toFixed(1)} kW
          </span>
          <span className="text-[10px] text-slate-500 font-mono">25 Queen's Castle Blocks</span>
        </div>

        <div className="p-3 rounded-2xl bg-black/30 border border-white/[0.06] backdrop-blur-md">
          <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block flex items-center gap-1">
            <Sun className="w-3 h-3" /> Solar Allocation
          </span>
          <span className="text-base sm:text-lg font-bold font-mono text-amber-300 block mt-0.5">
            {stats.totalSolarAllocation.toFixed(1)} kW
          </span>
          <span className="text-[10px] text-slate-500 font-mono">Rooftop Distributed PV</span>
        </div>

        <div className="p-3 rounded-2xl bg-black/30 border border-white/[0.06] backdrop-blur-md">
          <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block flex items-center gap-1">
            <Users className="w-3 h-3" /> Resident Population
          </span>
          <span className="text-base sm:text-lg font-bold font-mono text-emerald-300 block mt-0.5">
            {stats.totalOccupancy.toLocaleString()}
          </span>
          <span className="text-[10px] text-slate-500 font-mono">Students & Staff</span>
        </div>

        <div className="p-3 rounded-2xl bg-black/30 border border-white/[0.06] backdrop-blur-md">
          <span className="text-[10px] font-mono text-rose-400 uppercase tracking-wider block flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Anomaly Status
          </span>
          <span className={`text-base sm:text-lg font-bold font-mono block mt-0.5 ${stats.anomalyCount > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
            {stats.anomalyCount} Active Flags
          </span>
          <span className="text-[10px] text-slate-500 font-mono">AI Watch Active</span>
        </div>
      </div>

      {/* Filter Tabs and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 relative z-10">
        
        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
          <button
            onClick={() => setActiveFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition cursor-pointer whitespace-nowrap ${
              activeFilter === 'ALL'
                ? 'bg-white/15 text-white border border-white/20 shadow-sm'
                : 'bg-white/[0.03] text-slate-400 hover:text-slate-200 border border-white/[0.06]'
            }`}
          >
            All Campus (56)
          </button>
          
          <button
            onClick={() => setActiveFilter('BOYS_HOSTEL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeFilter === 'BOYS_HOSTEL'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-sm'
                : 'bg-white/[0.03] text-slate-400 hover:text-blue-300 border border-white/[0.06]'
            }`}
          >
            <Home className="w-3.5 h-3.5 text-blue-400" />
            Boys Hostels (KP-1 to KP-25)
          </button>

          <button
            onClick={() => setActiveFilter('GIRLS_HOSTEL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeFilter === 'GIRLS_HOSTEL'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                : 'bg-white/[0.03] text-slate-400 hover:text-purple-300 border border-white/[0.06]'
            }`}
          >
            <Building className="w-3.5 h-3.5 text-purple-400" />
            Girls Hostels (QC-1 to QC-25)
          </button>

          <button
            onClick={() => setActiveFilter('ACADEMIC')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeFilter === 'ACADEMIC'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'bg-white/[0.03] text-slate-400 hover:text-cyan-300 border border-white/[0.06]'
            }`}
          >
            <School className="w-3.5 h-3.5 text-cyan-400" />
            Academic & Labs
          </button>

          <button
            onClick={() => setActiveFilter('FACILITY')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeFilter === 'FACILITY'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'bg-white/[0.03] text-slate-400 hover:text-amber-300 border border-white/[0.06]'
            }`}
          >
            <UtensilsCrossed className="w-3.5 h-3.5 text-amber-400" />
            Facilities & EV
          </button>

          {stats.anomalyCount > 0 && (
            <button
              onClick={() => setActiveFilter('ANOMALIES')}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeFilter === 'ANOMALIES'
                  ? 'bg-rose-500/25 text-rose-300 border border-rose-500/50 shadow-sm'
                  : 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30 animate-pulse'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              Anomalies ({stats.anomalyCount})
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative min-w-[220px] sm:min-w-[280px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search KP-1, QC-12, SCE, Campus..."
            className="w-full pl-9 pr-8 py-1.5 rounded-xl bg-black/40 border border-white/[0.08] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono transition"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>

      {/* Main Content Area: Left Grid/Map (7 cols) + Right Selected Building Inspector (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        
        {/* Left: View Modes */}
        <div className="lg:col-span-7 bg-black/40 backdrop-blur-xl rounded-2xl p-4 border border-white/[0.08] flex flex-col justify-between overflow-hidden min-h-[480px]">
          
          {/* Subtle grid pattern background */}
          <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-25 pointer-events-none" />

          {/* Header info */}
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-3 relative z-10 pb-2 border-b border-white/[0.06]">
            <span className="flex items-center gap-1.5">
              <span className="font-bold text-white">
                {viewMode === 'GRID' ? 'SUB-METER TELEMETRY MATRIX' : 'CAMPUS SPATIAL TOPOLOGY (2D)'}
              </span>
              <span>({filteredBuildings.length} items shown)</span>
            </span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Live RTU Telemetry
            </span>
          </div>

          {/* VIEW MODE 1: Interactive Sub-Meter Grid Matrix */}
          {viewMode === 'GRID' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 my-2 max-h-[460px] overflow-y-auto pr-1 relative z-10 no-scrollbar">
              {filteredBuildings.map((building) => {
                const isSelected = building.id === selectedBuildingId;
                const hasAnomaly = building.hasAnomaly;
                const isBoys = building.type === 'Boys Hostel';
                const isGirls = building.type === 'Girls Hostel';

                return (
                  <button
                    key={building.id}
                    id={`btn-twin-node-${building.id}`}
                    onClick={() => handleSelectBuilding(building)}
                    className={`p-2.5 rounded-xl border text-left transition-all duration-200 cursor-pointer backdrop-blur-md relative group ${
                      isSelected
                        ? hasAnomaly
                          ? 'bg-rose-950/60 border-rose-400 ring-2 ring-rose-400/40 shadow-lg shadow-rose-950/50'
                          : 'bg-cyan-950/60 border-cyan-400 ring-2 ring-cyan-400/40 shadow-lg shadow-cyan-950/50'
                        : hasAnomaly
                        ? 'bg-rose-950/20 border-rose-500/30 hover:border-rose-500/50 hover:bg-rose-950/30'
                        : 'bg-white/[0.03] hover:bg-white/[0.07] border-white/[0.08] hover:border-cyan-500/30'
                    }`}
                  >
                    {hasAnomaly && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 border-2 border-slate-900 rounded-full animate-ping" />
                    )}

                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center ${
                          hasAnomaly 
                            ? 'bg-rose-500/20 text-rose-300' 
                            : isBoys
                            ? 'bg-blue-500/15 text-blue-300'
                            : isGirls
                            ? 'bg-purple-500/15 text-purple-300'
                            : 'bg-cyan-500/10 text-cyan-400'
                        }`}>
                          {getBuildingIcon(building.iconName, "w-3 h-3")}
                        </div>
                        <span className={`text-[11px] font-mono font-bold ${
                          isBoys ? 'text-blue-300' : isGirls ? 'text-purple-300' : 'text-slate-200'
                        }`}>
                          {building.code || building.name}
                        </span>
                      </div>

                      <span className="text-[10px] font-mono font-bold text-slate-300">
                        {building.currentLoadKw.toFixed(1)}k
                      </span>
                    </div>

                    <div className="font-semibold text-[11px] text-white truncate group-hover:text-cyan-300 transition">
                      {building.name}
                    </div>
                    
                    <div className="flex items-center justify-between mt-1 text-[9px] font-mono text-slate-400">
                      <span className="truncate max-w-[65px]">{building.campusZone || building.type}</span>
                      <span className={hasAnomaly ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                        {building.efficiencyPercent}%
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* VIEW MODE 2: 2D Spatial Campus Topology Map */}
          {viewMode === 'MAP' && (
            <div className="relative w-full h-[450px] bg-slate-950/80 rounded-xl border border-white/[0.06] overflow-hidden my-2">
              
              {/* Grid Background */}
              <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:20px_20px] opacity-30 pointer-events-none" />

              {/* Campus Zones Annotations */}
              <div className="absolute top-2 left-3 text-[10px] font-mono font-bold text-blue-400/60 pointer-events-none">
                WEST QUADRANT: BOYS HOSTELS (KP 1-25)
              </div>
              <div className="absolute top-2 right-3 text-[10px] font-mono font-bold text-purple-400/60 pointer-events-none">
                EAST QUADRANT: GIRLS HOSTELS (QC 1-25)
              </div>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold text-cyan-400/60 pointer-events-none">
                CENTRAL ACADEMIC & MOBILITY SPINE (CAMPUS 1-15)
              </div>

              {/* Central SCADA Hub */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 text-center pointer-events-none">
                <div className="w-14 h-14 rounded-full bg-emerald-500/15 border-2 border-emerald-500/40 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20 animate-pulse">
                  <Zap className="w-6 h-6 text-emerald-400" />
                </div>
                <span className="text-[9px] font-mono text-emerald-400 font-bold mt-1 block">
                  KIIT SCADA CORE
                </span>
              </div>

              {/* Nodes placed on 2D coordinates */}
              {filteredBuildings.map((building) => {
                const isSelected = building.id === selectedBuildingId;
                const hasAnomaly = building.hasAnomaly;
                const isBoys = building.type === 'Boys Hostel';
                const isGirls = building.type === 'Girls Hostel';

                return (
                  <button
                    key={building.id}
                    onClick={() => handleSelectBuilding(building)}
                    style={{
                      left: `${building.coordinates.x}%`,
                      top: `${building.coordinates.y}%`,
                    }}
                    title={`${building.name} (${building.currentLoadKw} kW)`}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 p-1.5 rounded-lg border transition-all duration-200 cursor-pointer z-10 group ${
                      isSelected
                        ? hasAnomaly
                          ? 'bg-rose-600 border-white ring-4 ring-rose-400/50 scale-125 z-30'
                          : 'bg-cyan-500 border-white ring-4 ring-cyan-400/50 scale-125 z-30'
                        : hasAnomaly
                        ? 'bg-rose-900/80 border-rose-400 text-rose-300 animate-bounce'
                        : isBoys
                        ? 'bg-blue-950/80 border-blue-500/50 text-blue-300 hover:scale-110 hover:border-blue-400'
                        : isGirls
                        ? 'bg-purple-950/80 border-purple-500/50 text-purple-300 hover:scale-110 hover:border-purple-400'
                        : 'bg-slate-800/90 border-cyan-500/50 text-cyan-300 hover:scale-110'
                    }`}
                  >
                    <span className="text-[9px] font-mono font-bold block leading-none">
                      {building.code || building.name.substring(0, 3)}
                    </span>
                  </button>
                );
              })}

            </div>
          )}

          {/* Map & Grid Legend Footer */}
          <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-white/[0.06] relative z-10">
            <span className="flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1 text-blue-300">
                <span className="w-2 h-2 rounded-full bg-blue-400" /> KP Boys
              </span>
              <span className="flex items-center gap-1 text-purple-300">
                <span className="w-2 h-2 rounded-full bg-purple-400" /> QC Girls
              </span>
              <span className="flex items-center gap-1 text-cyan-300">
                <span className="w-2 h-2 rounded-full bg-cyan-400" /> Academic
              </span>
              <span className="flex items-center gap-1 text-rose-400">
                <span className="w-2 h-2 rounded-full bg-rose-400" /> Anomaly
              </span>
            </span>
            <span>Click any node to inspect telemetry</span>
          </div>

        </div>

        {/* Right: Selected Building Telemetry & Diagnostic Inspector */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          
          <div className="p-5 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] shadow-sm flex flex-col justify-between h-full">
            
            <div>
              {/* Header with Prev / Next Navigation */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    selectedBuilding.hasAnomaly 
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' 
                      : selectedBuilding.type === 'Boys Hostel'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      : selectedBuilding.type === 'Girls Hostel'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                  }`}>
                    {getBuildingIcon(selectedBuilding.iconName, "w-5 h-5")}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white">{selectedBuilding.name}</h3>
                      {selectedBuilding.code && (
                        <span className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono text-[10px] font-bold">
                          {selectedBuilding.code}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                      {selectedBuilding.type} • {selectedBuilding.campusZone || 'Main Campus'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={handlePrevBuilding}
                    title="Previous Node"
                    className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNextBuilding}
                    title="Next Node"
                    className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Status and Occupancy row */}
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-1.5 text-xs text-slate-300 font-mono">
                  <Users className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Capacity: <strong className="text-white font-bold">{selectedBuilding.occupancy || 450}</strong> Students</span>
                </div>
                {getStatusBadge(selectedBuilding.aiStatus)}
              </div>

              {/* Anomaly Callout Banner if detected */}
              {selectedBuilding.hasAnomaly && selectedBuilding.anomalyDetails && (
                <div className="mb-4 p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-xs space-y-2">
                  <div className="flex items-center gap-1.5 text-rose-300 font-bold font-mono">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    <span>ENERGY ANOMALY DETECTED (+{selectedBuilding.anomalyDetails.deviationPercent}%)</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed font-sans text-xs">
                    {selectedBuilding.anomalyDetails.diagnosis}
                  </p>
                  <div className="pt-1 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-400">
                      Expected: <strong>{selectedBuilding.anomalyDetails.expectedKw} kW</strong> • Actual: <strong className="text-rose-400">{selectedBuilding.currentLoadKw} kW</strong>
                    </span>
                    <button
                      onClick={() => onMitigateAnomaly && onMitigateAnomaly(selectedBuilding.id)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold font-mono transition cursor-pointer active:scale-95"
                    >
                      Auto-Mitigate
                    </button>
                  </div>
                </div>
              )}

              {/* Building Telemetry KPI Matrix */}
              <div className="grid grid-cols-2 gap-2.5 font-mono text-xs mb-4">
                
                <div className="p-3 rounded-xl bg-black/30 border border-white/[0.05]">
                  <span className="text-slate-400 text-[10px] block">Active Sub-Load</span>
                  <span className="text-base font-bold text-white block mt-0.5">
                    {selectedBuilding.currentLoadKw.toFixed(1)} kW
                  </span>
                  <span className="text-[10px] text-slate-500">Nominal: {selectedBuilding.nominalLoadKw} kW</span>
                </div>

                <div className="p-3 rounded-xl bg-black/30 border border-white/[0.05]">
                  <span className="text-slate-400 text-[10px] block">Rooftop Solar Feed</span>
                  <span className="text-base font-bold text-amber-300 block mt-0.5">
                    {selectedBuilding.solarAllocationKw.toFixed(1)} kW
                  </span>
                  <span className="text-[10px] text-slate-500">Distributed Microgrid PV</span>
                </div>

                <div className="p-3 rounded-xl bg-black/30 border border-white/[0.05]">
                  <span className="text-slate-400 text-[10px] block">Energy Efficiency</span>
                  <span className={`text-base font-bold block mt-0.5 ${
                    selectedBuilding.efficiencyPercent >= 90 ? 'text-emerald-400' : 'text-amber-400'
                  }`}>
                    {selectedBuilding.efficiencyPercent}%
                  </span>
                  <span className="text-[10px] text-slate-500">Hostel Benchmark: 88%</span>
                </div>

                <div className="p-3 rounded-xl bg-black/30 border border-white/[0.05]">
                  <span className="text-slate-400 text-[10px] block">Daily Cumulative</span>
                  <span className="text-base font-bold text-cyan-300 block mt-0.5">
                    {selectedBuilding.dailyKwh.toFixed(1)} kWh
                  </span>
                  <span className="text-[10px] text-slate-500">Peak: {selectedBuilding.peakHour}</span>
                </div>

              </div>

              {/* AI Dispatch Optimization Directive */}
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-slate-300 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-emerald-300 font-bold block font-mono text-[11px]">AI Microgrid Dispatch State:</span>
                  <p className="text-slate-300 text-[11px] leading-snug font-sans mt-0.5">
                    {selectedBuilding.aiStatus === 'Optimized' 
                      ? 'Rooftop solar yield maximized; geyser and central water pump cycles balanced during off-peak windows.'
                      : selectedBuilding.aiStatus === 'Anomaly Detected'
                      ? 'Active anomaly interlock: sub-panel circuit diagnostics dispatched to campus maintenance team.'
                      : selectedBuilding.aiStatus === 'Throttled'
                      ? 'Non-critical common area lighting & auxiliary ventilation throttled for peak tariff avoidance.'
                      : 'Telemetry nominal within ±5% bounds of predicted residential baseline envelope.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Sub-meter ID: <strong className="text-slate-200">{selectedBuilding.id}</strong></span>
              <span className="text-emerald-400 font-semibold">Modbus TCP / RTU (Campus Fiber)</span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
