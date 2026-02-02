import { useState, useMemo, useEffect, useRef } from "react";
import { MapPin, Route, Clock, Utensils, Mountain, Zap, Sparkles, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { spots } from "@/data/spots";
import { macedonianLocations, foodDrinkStops, regionRouteMap, foodRegionMap } from "@/data/journeyData";
import JourneyRouteMap from "./JourneyRouteMap";
import LocationCombobox from "./LocationCombobox";

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
  const sectionRef = useRef<HTMLElement>(null);

  // Listen for prefill events from PopularRoutes
  useEffect(() => {
    const handlePrefill = (event: CustomEvent<{ 
      startLocation: string; 
      endLocation: string;
      preferences?: Partial<JourneyPreferences>;
    }>) => {
      setStartInput(event.detail.startLocation);
      setEndInput(event.detail.endLocation);
      
      // Apply preferences if provided
      if (event.detail.preferences) {
        setPreferences(prev => ({ ...prev, ...event.detail.preferences }));
      }
      
      setGeneratedRoute(null); // Reset any existing route
      
      // Scroll to the section
      setTimeout(() => {
        sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    };

    window.addEventListener("prefillJourney", handlePrefill as EventListener);
    return () => window.removeEventListener("prefillJourney", handlePrefill as EventListener);
  }, []);

  const [preferences, setPreferences] = useState<JourneyPreferences>({
    prioritizeViews: true,
    includeFoodStops: true,
    maxDriveTime: 6,
    adventureLevel: "moderate",
  });
  const [generatedRoute, setGeneratedRoute] = useState<GeneratedRoute | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Smart route generation based on start/end regions
  const getIntermediateSpots = (startId: string, endId: string): string[] => {
    const intermediateSpots: string[] = [];
    
    // Skopje to Ohrid/Struga - classic route
    if ((startId === "skopje" || startId === "tetovo") && 
        (endId === "ohrid" || endId === "struga")) {
      intermediateSpots.push("matka-canyon", "mavrovo-lake-loop", "galicica-pass");
    }
    
    // Ohrid/Struga to Skopje - reverse
    if ((startId === "ohrid" || startId === "struga") && 
        (endId === "skopje" || endId === "tetovo")) {
      intermediateSpots.push("galicica-pass", "mavrovo-lake-loop", "matka-canyon");
    }
    
    // Skopje to Mavrovo
    if (startId === "skopje" && endId === "mavrovo") {
      intermediateSpots.push("matka-canyon", "vodno-mountain-cross");
    }
    
    // Routes involving wine country
    if (endId === "kavadarci" || startId === "kavadarci" || 
        endId === "demir-kapija" || startId === "demir-kapija" ||
        endId === "negotino" || startId === "negotino") {
      intermediateSpots.push("demir-kapija-gorge", "popova-kula-winery", "stobi-ancient-city");
    }
    
    // Routes to/from Bitola
    if (endId === "bitola" || startId === "bitola" || 
        endId === "pelister" || startId === "pelister") {
      intermediateSpots.push("pelister-viewpoint", "pelister-national-park");
    }
    
    // Lake Ohrid loop
    if (startId === "ohrid" && endId === "ohrid") {
      intermediateSpots.push("st-jovan-kaneo-overlook", "trpejca-beach", "sv-naum-monastery");
    }
    
    // Eastern Macedonia routes
    if (endId === "strumica" || startId === "strumica" ||
        endId === "berovo" || startId === "berovo") {
      intermediateSpots.push("smolari-waterfall", "carevi-kuli", "berovo-lake");
    }
    
    // Northeastern routes
    if (endId === "kratovo" || startId === "kratovo" ||
        endId === "kumanovo" || startId === "kumanovo") {
      intermediateSpots.push("kokino-observatory-overlook", "kratovo-old-town", "kuklica-stone-dolls");
    }
    
    // Prespa routes
    if (endId === "resen" || startId === "resen") {
      intermediateSpots.push("prespa-lake-shore", "galicica-national-park-summit");
    }
    
    // Gostivar/Tetovo to Mavrovo
    if ((startId === "gostivar" || startId === "tetovo") && endId === "mavrovo") {
      intermediateSpots.push("mavrovo-lake-loop", "bistra-mountain-pass");
    }
    
    return intermediateSpots;
  };

  // Get food stops based on route regions
  const getRouteFoodStops = (startId: string, endId: string, intermediateSpots: string[]): typeof foodDrinkStops => {
    const foodRegions = new Set<string>();
    
    // Map locations to food regions
    const locationFoodMap: Record<string, string[]> = {
      skopje: ["matka"],
      ohrid: ["ohrid"],
      struga: ["ohrid"],
      mavrovo: ["mavrovo"],
      gostivar: ["mavrovo"],
      tetovo: ["mavrovo"],
      bitola: ["pelister"],
      kavadarci: ["tikves"],
      "demir-kapija": ["tikves"],
      negotino: ["tikves"],
      veles: ["tikves"],
      kratovo: ["kratovo"],
      resen: ["prespa"],
    };
    
    // Add food regions for start and end
    (locationFoodMap[startId] || []).forEach(r => foodRegions.add(r));
    (locationFoodMap[endId] || []).forEach(r => foodRegions.add(r));
    
    // Add food regions for intermediate spots
    if (intermediateSpots.some(s => s.includes("galicica"))) foodRegions.add("galicica");
    if (intermediateSpots.some(s => s.includes("mavrovo"))) foodRegions.add("mavrovo");
    if (intermediateSpots.some(s => s.includes("prespa"))) foodRegions.add("prespa");
    
    return foodDrinkStops.filter(f => foodRegions.has(f.region));
  };

  // Generate route based on start/end and preferences
  const generateRoute = () => {
    if (!startInput.trim() || !endInput.trim()) return;
    
    setIsGenerating(true);
    
    // Find selected locations (case-insensitive match)
    const startLoc = macedonianLocations.find(l => 
      l.name.toLowerCase() === startInput.toLowerCase()
    ) || { 
      id: startInput.toLowerCase().replace(/\s+/g, "-"), 
      name: startInput, 
      lat: 41.9973, 
      lng: 21.4280 
    };
    
    const endLoc = macedonianLocations.find(l => 
      l.name.toLowerCase() === endInput.toLowerCase()
    ) || { 
      id: endInput.toLowerCase().replace(/\s+/g, "-"), 
      name: endInput, 
      lat: 41.1231, 
      lng: 20.8016 
    };

    // Get intermediate spots based on route
    const intermediateSpotIds = getIntermediateSpots(startLoc.id, endLoc.id);
    
    // Also get spots from region mappings
    const startSpotIds = regionRouteMap[startLoc.id] || [];
    const endSpotIds = regionRouteMap[endLoc.id] || [];
    
    // Combine all spot IDs (prioritize intermediate spots)
    const allSpotIds = [...new Set([...intermediateSpotIds, ...startSpotIds, ...endSpotIds])];
    
    // Get actual spot objects
    let routeSpots = spots.filter(s => allSpotIds.includes(s.id));
    
    // If no spots found, suggest popular ones
    if (routeSpots.length === 0) {
      routeSpots = spots.slice(0, 3);
    }
    
    // Filter by adventure level if needed
    if (preferences.adventureLevel === "easy") {
      const filtered = routeSpots.filter(s => 
        !s.tags.includes("Adventure") && !s.tags.includes("Off-Road")
      );
      if (filtered.length > 0) routeSpots = filtered;
    } else if (preferences.adventureLevel === "challenging") {
      const filtered = routeSpots.filter(s => 
        s.tags.includes("Adventure") || s.tags.includes("Mountain") || s.tags.includes("Roads")
      );
      if (filtered.length > 0) routeSpots = filtered;
    }
    
    // Limit based on max drive time (roughly 1.5 hours per stop)
    const maxStops = Math.min(Math.max(Math.floor(preferences.maxDriveTime / 1.5), 2), 6);
    routeSpots = routeSpots.slice(0, maxStops);
    
    // Get food stops if preference is enabled
    let routeFoodStops: typeof foodDrinkStops = [];
    if (preferences.includeFoodStops) {
      routeFoodStops = getRouteFoodStops(startLoc.id, endLoc.id, intermediateSpotIds);
      // Limit food stops
      routeFoodStops = routeFoodStops.slice(0, Math.min(3, Math.floor(preferences.maxDriveTime / 2)));
    }

    // Calculate estimated time
    const baseTime = 2;
    const stopTime = routeSpots.length * 0.5;
    const foodTime = routeFoodStops.length * 0.75;
    const totalTime = baseTime + stopTime + foodTime;
    
    const estimatedTime = totalTime < 3 
      ? `${Math.round(totalTime * 60)} minutes`
      : `${Math.floor(totalTime)}-${Math.ceil(totalTime + 1)} hours`;
    
    // Rough distance estimate
    const estimatedDistance = `${Math.round(50 + routeSpots.length * 25 + routeFoodStops.length * 10)} km`;

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
    }, 1000);
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
    <section ref={sectionRef} id="journey-planner" className="py-16 sm:py-24 px-4 relative overflow-hidden">
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
            <LocationCombobox
              locations={macedonianLocations}
              value={startInput}
              onChange={setStartInput}
              label="Starting Location"
              placeholder="e.g., Skopje"
              iconColor="text-earth-green-glow"
            />

            {/* Destination */}
            <LocationCombobox
              locations={macedonianLocations}
              value={endInput}
              onChange={setEndInput}
              label="Destination"
              placeholder="e.g., Ohrid"
              iconColor="text-soul-amber"
            />
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
              disabled={isGenerating || !startInput.trim() || !endInput.trim()}
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
            
            {(!startInput.trim() || !endInput.trim()) && (
              <p className="text-xs text-muted-foreground mt-3">
                Select both starting location and destination to generate your route
              </p>
            )}
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
              {generatedRoute.foodStops.map((food) => (
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
