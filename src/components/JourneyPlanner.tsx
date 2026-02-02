import { useState, useMemo, useEffect } from "react";
import { MapPin, Route, Clock, Utensils, Mountain, Zap, ChevronDown, Sparkles, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { spots } from "@/data/spots";
import { macedonianLocations, foodDrinkStops, regionRouteMap, foodRegionMap } from "@/data/journeyData";
import JourneyRouteMap from "./JourneyRouteMap";

interface JourneyPreferences {
  prioritizeViews: boolean;
  includeFoodStops: boolean;
  maxDriveTime: number;
  adventureLevel: "easy" | "moderate" | "challenging";
}

interface GeneratedRoute {
  startLocation: typeof macedonianLocations[0];
  endLocation: typeof macedonianLocations[0];
  stops: typeof spots;
  foodStops: typeof foodDrinkStops;
  estimatedTime: string;
  estimatedDistance: string;
}

const JourneyPlanner = () => {
  const [startInput, setStartInput] = useState("");
  const [endInput, setEndInput] = useState("");

  // Listen for prefill events from PopularRoutes
  useEffect(() => {
    const handlePrefill = (event: CustomEvent<{ startLocation: string; endLocation: string }>) => {
      setStartInput(event.detail.startLocation);
      setEndInput(event.detail.endLocation);
      setGeneratedRoute(null); // Reset any existing route
    };

    window.addEventListener("prefillJourney", handlePrefill as EventListener);
    return () => window.removeEventListener("prefillJourney", handlePrefill as EventListener);
  }, []);
  const [showStartDropdown, setShowStartDropdown] = useState(false);
  const [showEndDropdown, setShowEndDropdown] = useState(false);
  const [preferences, setPreferences] = useState<JourneyPreferences>({
    prioritizeViews: true,
    includeFoodStops: true,
    maxDriveTime: 6,
    adventureLevel: "moderate",
  });
  const [generatedRoute, setGeneratedRoute] = useState<GeneratedRoute | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Filter locations for autocomplete
  const filteredStartLocations = useMemo(() => {
    if (!startInput) return macedonianLocations;
    return macedonianLocations.filter(loc => 
      loc.name.toLowerCase().includes(startInput.toLowerCase())
    );
  }, [startInput]);

  const filteredEndLocations = useMemo(() => {
    if (!endInput) return macedonianLocations;
    return macedonianLocations.filter(loc => 
      loc.name.toLowerCase().includes(endInput.toLowerCase())
    );
  }, [endInput]);

  // Generate route based on start/end and preferences
  const generateRoute = () => {
    setIsGenerating(true);
    
    // Find selected locations
    const startLoc = macedonianLocations.find(l => 
      l.name.toLowerCase() === startInput.toLowerCase()
    ) || macedonianLocations.find(l => l.id === "skopje")!;
    
    const endLoc = macedonianLocations.find(l => 
      l.name.toLowerCase() === endInput.toLowerCase()
    ) || macedonianLocations.find(l => l.id === "ohrid")!;

    // Get spots for start and end regions
    const startSpotIds = regionRouteMap[startLoc.id] || [];
    const endSpotIds = regionRouteMap[endLoc.id] || [];
    
    // Find intermediary regions based on distance/path
    const intermediateSpotIds: string[] = [];
    
    // Logic: If going from Skopje to Ohrid, add Mavrovo/Galicica
    if ((startLoc.id === "skopje" || startLoc.id === "tetovo") && 
        (endLoc.id === "ohrid" || endLoc.id === "struga")) {
      intermediateSpotIds.push(...(regionRouteMap["mavrovo"] || []));
      intermediateSpotIds.push("galicica-pass");
    }
    
    // If going through wine country
    if ((startLoc.id === "veles" || endLoc.id === "kavadarci") ||
        (startLoc.id === "kavadarci" || endLoc.id === "veles")) {
      intermediateSpotIds.push(...(regionRouteMap["kavadarci"] || []));
    }
    
    // If going to eastern Macedonia
    if (endLoc.id === "strumica" || endLoc.id === "berovo" || endLoc.id === "kratovo") {
      intermediateSpotIds.push(...(regionRouteMap["kratovo"] || []));
    }

    // Collect all spot IDs and deduplicate
    const allSpotIds = [...new Set([...startSpotIds, ...intermediateSpotIds, ...endSpotIds])];
    
    // Get actual spot objects
    let routeSpots = spots.filter(s => allSpotIds.includes(s.id));
    
    // Filter by adventure level if needed
    if (preferences.adventureLevel === "easy") {
      routeSpots = routeSpots.filter(s => !s.tags.includes("Adventure"));
    } else if (preferences.adventureLevel === "challenging") {
      routeSpots = routeSpots.filter(s => s.tags.includes("Adventure") || s.tags.includes("Mountain") || s.tags.includes("Roads"));
    }
    
    // Limit based on max drive time
    const maxStops = Math.min(Math.floor(preferences.maxDriveTime / 1.5), 6);
    routeSpots = routeSpots.slice(0, maxStops);
    
    // Get food stops for relevant regions
    let routeFoodStops: typeof foodDrinkStops = [];
    if (preferences.includeFoodStops) {
      const foodRegions = new Set<string>();
      
      if (startLoc.id === "skopje") foodRegions.add("matka");
      if (endLoc.id === "ohrid" || startLoc.id === "ohrid") foodRegions.add("ohrid");
      if (intermediateSpotIds.some(id => id.includes("mavrovo"))) foodRegions.add("mavrovo");
      if (intermediateSpotIds.some(id => id.includes("galicica"))) foodRegions.add("galicica");
      if (endLoc.id === "kavadarci" || startLoc.id === "veles") foodRegions.add("tikves");
      if (endLoc.id === "bitola" || startLoc.id === "bitola") foodRegions.add("pelister");
      if (endLoc.id === "kratovo" || startLoc.id === "kratovo") foodRegions.add("kratovo");
      if (endLoc.id === "resen" || routeSpots.some(s => s.id.includes("prespa"))) foodRegions.add("prespa");
      
      routeFoodStops = foodDrinkStops.filter(f => foodRegions.has(f.region));
    }

    // Calculate estimated time (rough approximation)
    const baseTime = 2; // Base travel time
    const stopTime = routeSpots.length * 0.5; // 30 min per stop
    const foodTime = routeFoodStops.length * 0.75; // 45 min per food stop
    const totalTime = baseTime + stopTime + foodTime;
    
    const estimatedTime = totalTime < 3 
      ? `${Math.round(totalTime * 60)} minutes`
      : `${Math.floor(totalTime)}-${Math.ceil(totalTime + 1)} hours`;
    
    // Rough distance estimate
    const estimatedDistance = `${Math.round(50 + routeSpots.length * 25)} km`;

    setTimeout(() => {
      setGeneratedRoute({
        startLocation: startLoc,
        endLocation: endLoc,
        stops: routeSpots,
        foodStops: routeFoodStops,
        estimatedTime,
        estimatedDistance,
      });
      setIsGenerating(false);
    }, 1200);
  };

  // Generate Google Maps URL
  const generateMapsUrl = () => {
    if (!generatedRoute) return "";
    
    const origin = encodeURIComponent(`${generatedRoute.startLocation.name}, North Macedonia`);
    const destination = encodeURIComponent(`${generatedRoute.endLocation.name}, North Macedonia`);
    
    const waypoints = generatedRoute.stops
      .map(s => encodeURIComponent(`${s.coordinates.lat},${s.coordinates.lng}`))
      .join("|");
    
    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&waypoints=${waypoints}&travelmode=driving`;
  };

  return (
    <section className="py-16 sm:py-24 px-4 relative overflow-hidden">
      {/* Background gradient */}
      <div 
        className="absolute inset-0 opacity-90"
        style={{
          background: `linear-gradient(135deg, 
            hsl(180 40% 15% / 0.8) 0%, 
            hsl(200 35% 12% / 0.9) 30%,
            hsl(220 30% 10% / 0.95) 50%,
            hsl(25 50% 15% / 0.85) 75%,
            hsl(32 55% 18% / 0.8) 100%
          )`
        }}
      />
      <div className="absolute inset-0 road-pattern opacity-10" />
      
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-soul-amber/20 border border-soul-amber/30 mb-6">
            <Sparkles size={16} className="text-soul-amber" />
            <span className="text-sm text-soul-amber tracking-wide font-medium">JOURNEY BUILDER</span>
          </div>
          
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl tracking-wider mb-4 text-gradient-subtle">
            CREATE YOUR SOULRIDE JOURNEY
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground">
            Enter start and end, get a route full of soul views, peaceful stops, and local flavors.
          </p>
        </div>

        {/* Journey Form Card */}
        <div className="rounded-2xl border border-border/40 bg-background/60 backdrop-blur-md p-6 sm:p-8 shadow-[0_0_60px_hsl(var(--amber-soul)/0.1)]">
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Starting Location */}
            <div className="relative">
              <label className="block text-sm font-medium text-foreground/80 mb-2 tracking-wide">
                <MapPin size={14} className="inline mr-2 text-earth-green-glow" />
                Starting Location
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={startInput}
                  onChange={(e) => setStartInput(e.target.value)}
                  onFocus={() => setShowStartDropdown(true)}
                  onBlur={() => setTimeout(() => setShowStartDropdown(false), 200)}
                  placeholder="e.g., Skopje"
                  className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-soul-amber/50 focus:ring-2 focus:ring-soul-amber/20 transition-all"
                />
                <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                
                {showStartDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border/50 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto">
                    {filteredStartLocations.map((loc) => (
                      <button
                        key={loc.id}
                        type="button"
                        onClick={() => {
                          setStartInput(loc.name);
                          setShowStartDropdown(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors first:rounded-t-xl last:rounded-b-xl"
                      >
                        <span className="text-foreground">{loc.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Destination */}
            <div className="relative">
              <label className="block text-sm font-medium text-foreground/80 mb-2 tracking-wide">
                <MapPin size={14} className="inline mr-2 text-soul-amber" />
                Destination
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={endInput}
                  onChange={(e) => setEndInput(e.target.value)}
                  onFocus={() => setShowEndDropdown(true)}
                  onBlur={() => setTimeout(() => setShowEndDropdown(false), 200)}
                  placeholder="e.g., Ohrid"
                  className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-soul-amber/50 focus:ring-2 focus:ring-soul-amber/20 transition-all"
                />
                <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                
                {showEndDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border/50 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto">
                    {filteredEndLocations.map((loc) => (
                      <button
                        key={loc.id}
                        type="button"
                        onClick={() => {
                          setEndInput(loc.name);
                          setShowEndDropdown(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors first:rounded-t-xl last:rounded-b-xl"
                      >
                        <span className="text-foreground">{loc.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-foreground/80 mb-4 tracking-wide">
              <Sparkles size={14} className="inline mr-2 text-mountain-blue" />
              Journey Preferences
            </h3>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Prioritize Views */}
              <label className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/30 cursor-pointer hover:bg-muted/50 transition-colors">
                <input
                  type="checkbox"
                  checked={preferences.prioritizeViews}
                  onChange={(e) => setPreferences(p => ({ ...p, prioritizeViews: e.target.checked }))}
                  className="w-4 h-4 rounded accent-soul-amber"
                />
                <div className="flex items-center gap-2">
                  <Mountain size={16} className="text-earth-green-glow" />
                  <span className="text-sm">Soul Views</span>
                </div>
              </label>

              {/* Include Food Stops */}
              <label className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/30 cursor-pointer hover:bg-muted/50 transition-colors">
                <input
                  type="checkbox"
                  checked={preferences.includeFoodStops}
                  onChange={(e) => setPreferences(p => ({ ...p, includeFoodStops: e.target.checked }))}
                  className="w-4 h-4 rounded accent-soul-amber"
                />
                <div className="flex items-center gap-2">
                  <Utensils size={16} className="text-soul-amber" />
                  <span className="text-sm">Food & Drink</span>
                </div>
              </label>

              {/* Max Drive Time */}
              <div className="p-3 rounded-xl bg-muted/30 border border-border/30">
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={16} className="text-mountain-blue" />
                  <span className="text-sm">{preferences.maxDriveTime}h max</span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={12}
                  value={preferences.maxDriveTime}
                  onChange={(e) => setPreferences(p => ({ ...p, maxDriveTime: Number(e.target.value) }))}
                  className="w-full h-2 rounded-full appearance-none bg-muted cursor-pointer accent-soul-amber"
                />
              </div>

              {/* Adventure Level */}
              <div className="p-3 rounded-xl bg-muted/30 border border-border/30">
                <div className="flex items-center gap-2 mb-2">
                  <Zap size={16} className="text-soul-amber" />
                  <span className="text-sm">Adventure</span>
                </div>
                <select
                  value={preferences.adventureLevel}
                  onChange={(e) => setPreferences(p => ({ ...p, adventureLevel: e.target.value as any }))}
                  className="w-full bg-transparent text-sm border-none focus:outline-none cursor-pointer text-foreground"
                >
                  <option value="easy" className="bg-background text-foreground">Easy Scenic</option>
                  <option value="moderate" className="bg-background text-foreground">Moderate</option>
                  <option value="challenging" className="bg-background text-foreground">Winding Roads</option>
                </select>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <div className="text-center">
            <button
              onClick={generateRoute}
              disabled={isGenerating || (!startInput && !endInput)}
              className={cn(
                "inline-flex items-center gap-3 px-8 py-4 rounded-full font-medium tracking-wide transition-all duration-300",
                "bg-gradient-to-r from-earth-green via-mountain-blue to-soul-amber",
                "text-white shadow-[0_0_30px_hsl(var(--earth-green)/0.3)]",
                "hover:shadow-[0_0_50px_hsl(var(--amber-soul)/0.4)] hover:scale-105",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              )}
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Mapping Your Soul Route...</span>
                </>
              ) : (
                <>
                  <Route size={20} />
                  <span>Generate My SoulRide</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Generated Route Results */}
        {generatedRoute && (
          <div className="mt-12 animate-fade-up">
            {/* Route Summary */}
            <div className="text-center mb-8">
              <h3 className="font-display text-2xl sm:text-3xl tracking-wider mb-2 text-gradient-subtle">
                YOUR SOULRIDE AWAITS
              </h3>
              <p className="text-muted-foreground">
                {generatedRoute.startLocation.name} → {generatedRoute.endLocation.name} • 
                <span className="text-soul-amber"> {generatedRoute.estimatedTime}</span> • 
                <span className="text-earth-green-glow"> {generatedRoute.estimatedDistance}</span>
              </p>
            </div>

            {/* Route Stops List */}
            <div className="grid gap-4 mb-8">
              {/* Start Point */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-earth-green/10 border border-earth-green/30">
                <div className="w-10 h-10 rounded-full bg-earth-green/20 flex items-center justify-center">
                  <MapPin size={18} className="text-earth-green-glow" />
                </div>
                <div>
                  <p className="font-medium text-earth-green-glow">Start</p>
                  <p className="text-foreground">{generatedRoute.startLocation.name}</p>
                </div>
              </div>

              {/* Soul View Stops */}
              {generatedRoute.stops.map((stop, index) => (
                <div key={stop.id} className="flex items-start gap-4 p-4 rounded-xl bg-muted/30 border border-border/30 group hover:border-soul-amber/30 transition-colors">
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <img 
                      src={stop.images[0]} 
                      alt={stop.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-soul-amber/20 text-soul-amber">Stop {index + 1}</span>
                      <span className="text-xs text-muted-foreground">Soul View</span>
                    </div>
                    <p className="font-medium text-foreground truncate">{stop.title}</p>
                    <p className="text-sm text-muted-foreground italic truncate">"{stop.poeticTagline}"</p>
                  </div>
                </div>
              ))}

              {/* Food Stops */}
              {generatedRoute.foodStops.map((food, index) => (
                <div key={food.id} className="flex items-start gap-4 p-4 rounded-xl bg-soul-amber/10 border border-soul-amber/30">
                  <div className="w-10 h-10 rounded-full bg-soul-amber/20 flex items-center justify-center flex-shrink-0">
                    <Utensils size={18} className="text-soul-amber" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-soul-amber/30 text-soul-amber">Food Stop</span>
                      <span className="text-xs text-muted-foreground capitalize">{food.type}</span>
                    </div>
                    <p className="font-medium text-foreground">{food.name}</p>
                    <p className="text-sm text-muted-foreground">{food.description}</p>
                  </div>
                </div>
              ))}

              {/* End Point */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-soul-amber/10 border border-soul-amber/30">
                <div className="w-10 h-10 rounded-full bg-soul-amber/20 flex items-center justify-center">
                  <MapPin size={18} className="text-soul-amber" />
                </div>
                <div>
                  <p className="font-medium text-soul-amber">Destination</p>
                  <p className="text-foreground">{generatedRoute.endLocation.name}</p>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="mb-8">
              <JourneyRouteMap 
                startLocation={generatedRoute.startLocation}
                endLocation={generatedRoute.endLocation}
                stops={generatedRoute.stops}
                foodStops={generatedRoute.foodStops}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href={generateMapsUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-earth-green to-mountain-blue text-white font-medium tracking-wide hover:shadow-[0_0_30px_hsl(var(--earth-green)/0.4)] transition-all"
              >
                <ExternalLink size={18} />
                <span>Open in Maps App</span>
              </a>
              
              <button
                onClick={() => setGeneratedRoute(null)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border/50 text-foreground/80 hover:bg-muted/50 transition-all"
              >
                <Route size={18} />
                <span>Plan New Journey</span>
              </button>
            </div>

            {/* Disclaimer */}
            <p className="text-center text-xs text-muted-foreground mt-6">
              Routes are suggestions — always check real-time conditions in your Maps app. Drive safe, ride with soul.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default JourneyPlanner;
