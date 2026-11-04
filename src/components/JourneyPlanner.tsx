import { lazy, Suspense, useState, useMemo, useEffect, useRef } from "react";
import { MapPin, Route, Clock, Utensils, Mountain, Zap, Sparkles, ExternalLink, Compass } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { spots } from "@/data/spots";
import { macedonianLocations, foodDrinkStops, regionRouteMap, foodRegionMap } from "@/data/journeyData";
import LocationCombobox from "./LocationCombobox";

const JourneyRouteMap = lazy(() => import("./JourneyRouteMap"));

const ADVENTURE_LEVELS = ["easy", "moderate", "challenging"] as const;
type AdventureLevel = (typeof ADVENTURE_LEVELS)[number];

function isAdventureLevel(value: string): value is AdventureLevel {
  return (ADVENTURE_LEVELS as readonly string[]).includes(value);
}

interface JourneyPreferences {
  prioritizeViews: boolean;
  includeFoodStops: boolean;
  maxDriveTime: number;
  adventureLevel: AdventureLevel;
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

  useEffect(() => {
    const handlePrefill = (event: CustomEvent<{ 
      startLocation: string; 
      endLocation: string;
      preferences?: Partial<JourneyPreferences>;
    }>) => {
      setStartInput(event.detail.startLocation);
      setEndInput(event.detail.endLocation);
      
      if (event.detail.preferences) {
        setPreferences(prev => ({ ...prev, ...event.detail.preferences }));
      }
      
      setGeneratedRoute(null);
      
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

  const getIntermediateSpots = (startId: string, endId: string): string[] => {
    const intermediateSpots: string[] = [];
    
    if ((startId === "skopje" || startId === "tetovo") && 
        (endId === "ohrid" || endId === "struga")) {
      intermediateSpots.push("matka-canyon", "mavrovo-lake-loop", "galicica-pass");
    }
    
    if ((startId === "ohrid" || startId === "struga") && 
        (endId === "skopje" || endId === "tetovo")) {
      intermediateSpots.push("galicica-pass", "mavrovo-lake-loop", "matka-canyon");
    }
    
    if (startId === "skopje" && endId === "mavrovo") {
      intermediateSpots.push("matka-canyon", "vodno-mountain-cross");
    }
    
    if (endId === "kavadarci" || startId === "kavadarci" || 
        endId === "demir-kapija" || startId === "demir-kapija" ||
        endId === "negotino" || startId === "negotino") {
      intermediateSpots.push("demir-kapija-gorge", "popova-kula-winery", "stobi-ancient-city");
    }
    
    if (endId === "bitola" || startId === "bitola" || 
        endId === "pelister" || startId === "pelister") {
      intermediateSpots.push("pelister-viewpoint", "pelister-national-park");
    }
    
    if (startId === "ohrid" && endId === "ohrid") {
      intermediateSpots.push("st-jovan-kaneo-overlook", "trpejca-beach", "sv-naum-monastery");
    }
    
    if (endId === "strumica" || startId === "strumica" ||
        endId === "berovo" || startId === "berovo") {
      intermediateSpots.push("smolari-waterfall", "carevi-kuli", "berovo-lake");
    }
    
    if (endId === "kratovo" || startId === "kratovo" ||
        endId === "kumanovo" || startId === "kumanovo") {
      intermediateSpots.push("kokino-observatory-overlook", "kratovo-old-town", "kuklica-stone-dolls");
    }
    
    if (endId === "resen" || startId === "resen") {
      intermediateSpots.push("prespa-lake-shore", "galicica-national-park-summit");
    }
    
    if ((startId === "gostivar" || startId === "tetovo") && endId === "mavrovo") {
      intermediateSpots.push("mavrovo-lake-loop", "bistra-mountain-pass");
    }
    
    return intermediateSpots;
  };

  const getRouteFoodStops = (startId: string, endId: string, intermediateSpots: string[]): typeof foodDrinkStops => {
    const foodRegions = new Set<string>();
    
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
    
    (locationFoodMap[startId] || []).forEach(r => foodRegions.add(r));
    (locationFoodMap[endId] || []).forEach(r => foodRegions.add(r));
    
    if (intermediateSpots.some(s => s.includes("galicica"))) foodRegions.add("galicica");
    if (intermediateSpots.some(s => s.includes("mavrovo"))) foodRegions.add("mavrovo");
    if (intermediateSpots.some(s => s.includes("prespa"))) foodRegions.add("prespa");
    
    return foodDrinkStops.filter(f => foodRegions.has(f.region));
  };

  const generateRoute = () => {
    if (!startInput.trim() || !endInput.trim()) return;
    
    setIsGenerating(true);
    
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

    const intermediateSpotIds = getIntermediateSpots(startLoc.id, endLoc.id);
    const startSpotIds = regionRouteMap[startLoc.id] || [];
    const endSpotIds = regionRouteMap[endLoc.id] || [];
    const allSpotIds = [...new Set([...intermediateSpotIds, ...startSpotIds, ...endSpotIds])];
    
    let routeSpots = spots.filter(s => allSpotIds.includes(s.id));
    
    if (routeSpots.length === 0) {
      routeSpots = spots.slice(0, 3);
    }
    
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
    
    const maxStops = Math.min(Math.max(Math.floor(preferences.maxDriveTime / 1.5), 2), 6);
    routeSpots = routeSpots.slice(0, maxStops);
    
    let routeFoodStops: typeof foodDrinkStops = [];
    if (preferences.includeFoodStops) {
      routeFoodStops = getRouteFoodStops(startLoc.id, endLoc.id, intermediateSpotIds);
      routeFoodStops = routeFoodStops.slice(0, Math.min(3, Math.floor(preferences.maxDriveTime / 2)));
    }

    const baseTime = 2;
    const stopTime = routeSpots.length * 0.5;
    const foodTime = routeFoodStops.length * 0.75;
    const totalTime = baseTime + stopTime + foodTime;
    
    const estimatedTime = totalTime < 3 
      ? `${Math.round(totalTime * 60)} minutes`
      : `${Math.floor(totalTime)}-${Math.ceil(totalTime + 1)} hours`;
    
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
    <section 
      ref={sectionRef} 
      id="journey-planner" 
      className="py-20 px-4 relative overflow-hidden grain-overlay"
      style={{ 
        background: 'linear-gradient(180deg, hsl(180 15% 10%) 0%, hsl(200 20% 9%) 50%, hsl(25 12% 10%) 100%)' 
      }}
    >
      {/* Aged paper texture */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg mb-6"
            style={{
              backgroundColor: 'hsl(35 50% 45% / 0.15)',
              border: '1px dashed hsl(35 50% 50% / 0.4)',
            }}
          >
          <Sparkles size={14} style={{ color: 'hsl(35 50% 55%)' }} />
            <span 
              className="text-xs tracking-[0.15em] uppercase"
              style={{ 
                fontFamily: "'Special Elite', monospace",
                color: 'hsl(35 50% 60%)',
              }}
            >
              Креатор на патување
            </span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl mb-4 tracking-wider"
            style={{
              fontFamily: "'Bitter', 'Rockwell', Georgia, serif",
              fontWeight: 700,
              color: 'hsl(40 30% 94%)',
              textShadow: '2px 2px 0 hsl(0 0% 0% / 0.4)',
            }}
          >
            СОЗДАЈ СВОЕ ПАТУВАЊЕ
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-lg"
            style={{ 
              fontFamily: "'Caveat', cursive",
              color: 'hsl(140 22% 55%)',
            }}
          >
            Внеси почеток и крај, добиј рута полна со погледи, мирни застанувања и локални вкусови.
          </motion.p>
        </div>

        {/* Journey Form Card - Vintage Map Legend Style */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="rounded-xl p-6 sm:p-8"
          style={{
            backgroundColor: 'hsl(180 12% 11%)',
            border: '2px solid hsl(140 15% 25% / 0.4)',
            boxShadow: '0 8px 40px hsl(0 0% 0% / 0.4), inset 0 1px 0 hsl(40 30% 90% / 0.03)',
          }}
        >
          {/* Brass rivets */}
          <div className="absolute top-3 left-3 w-2.5 h-2.5 rounded-full" style={{ background: 'linear-gradient(135deg, hsl(35 50% 55%) 0%, hsl(30 40% 35%) 100%)' }} />
          <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full" style={{ background: 'linear-gradient(135deg, hsl(35 50% 55%) 0%, hsl(30 40% 35%) 100%)' }} />
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <LocationCombobox
              locations={macedonianLocations}
              value={startInput}
              onChange={setStartInput}
              label="Почетна локација"
              placeholder="пр. Скопје"
              iconColor="hsl(140 22% 55%)"
            />

            <LocationCombobox
              locations={macedonianLocations}
              value={endInput}
              onChange={setEndInput}
              label="Дестинација"
              placeholder="пр. Охрид"
              iconColor="hsl(25 40% 55%)"
            />
          </div>

          {/* Preferences - Vintage Style */}
          <div className="mb-8">
            <h3 
              className="text-sm mb-4 tracking-wide flex items-center gap-2"
              style={{ 
                fontFamily: "'Special Elite', monospace",
                color: 'hsl(35 50% 60%)',
              }}
            >
              <Compass size={14} />
              Преференции на патување
            </h3>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Prioritize Views */}
              <label 
                className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors"
                style={{
                  backgroundColor: 'hsl(140 22% 42% / 0.1)',
                  border: '1px solid hsl(140 22% 42% / 0.25)',
                }}
              >
                <input
                  type="checkbox"
                  checked={preferences.prioritizeViews}
                  onChange={(e) => setPreferences(p => ({ ...p, prioritizeViews: e.target.checked }))}
                  className="w-4 h-4 rounded"
                  style={{ accentColor: 'hsl(140 22% 50%)' }}
                />
                <div className="flex items-center gap-2">
                  <Mountain size={16} style={{ color: 'hsl(140 22% 55%)' }} />
                  <span 
                    className="text-sm"
                    style={{ 
                      fontFamily: "'Special Elite', monospace",
                      color: 'hsl(40 30% 80%)',
                    }}
                  >
                    Погледи
                  </span>
                </div>
              </label>

              {/* Include Food Stops */}
              <label 
                className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors"
                style={{
                  backgroundColor: 'hsl(25 40% 35% / 0.1)',
                  border: '1px solid hsl(25 40% 40% / 0.25)',
                }}
              >
                <input
                  type="checkbox"
                  checked={preferences.includeFoodStops}
                  onChange={(e) => setPreferences(p => ({ ...p, includeFoodStops: e.target.checked }))}
                  className="w-4 h-4 rounded"
                  style={{ accentColor: 'hsl(25 40% 50%)' }}
                />
                <div className="flex items-center gap-2">
                  <Utensils size={16} style={{ color: 'hsl(25 40% 55%)' }} />
                  <span 
                    className="text-sm"
                    style={{ 
                      fontFamily: "'Special Elite', monospace",
                      color: 'hsl(40 30% 80%)',
                    }}
                  >
                    Храна и пијалок
                  </span>
                </div>
              </label>

              {/* Max Drive Time */}
              <div 
                className="p-3 rounded-lg"
                style={{
                  backgroundColor: 'hsl(35 50% 45% / 0.1)',
                  border: '1px solid hsl(35 50% 45% / 0.25)',
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={16} style={{ color: 'hsl(35 50% 55%)' }} />
                  <span 
                    className="text-sm"
                    style={{ 
                      fontFamily: "'Special Elite', monospace",
                      color: 'hsl(40 30% 80%)',
                    }}
                  >
                    {preferences.maxDriveTime}h max
                  </span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={12}
                  value={preferences.maxDriveTime}
                  onChange={(e) => setPreferences(p => ({ ...p, maxDriveTime: Number(e.target.value) }))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{ 
                    backgroundColor: 'hsl(35 15% 25%)',
                    accentColor: 'hsl(35 50% 55%)',
                  }}
                />
              </div>

              {/* Adventure Level */}
              <div 
                className="p-3 rounded-lg"
                style={{
                  backgroundColor: 'hsl(140 22% 42% / 0.1)',
                  border: '1px solid hsl(140 22% 42% / 0.25)',
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Zap size={16} style={{ color: 'hsl(35 50% 55%)' }} />
                  <span 
                    className="text-sm"
                    style={{ 
                      fontFamily: "'Special Elite', monospace",
                      color: 'hsl(40 30% 80%)',
                    }}
                  >
                    Авантура
                  </span>
                </div>
                <select
                  value={preferences.adventureLevel}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (!isAdventureLevel(value)) return;
                    setPreferences((p) => ({ ...p, adventureLevel: value }));
                  }}
                  className="w-full bg-transparent text-sm border-none focus:outline-none cursor-pointer"
                  style={{ 
                    fontFamily: "'Special Elite', monospace",
                    color: 'hsl(40 30% 85%)',
                  }}
                >
                  <option value="easy" style={{ backgroundColor: 'hsl(200 20% 12%)' }}>Лесно живописно</option>
                  <option value="moderate" style={{ backgroundColor: 'hsl(200 20% 12%)' }}>Умерено</option>
                  <option value="challenging" style={{ backgroundColor: 'hsl(200 20% 12%)' }}>Кривулести патишта</option>
                </select>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <div className="text-center">
            <button
              onClick={generateRoute}
              disabled={isGenerating || !startInput.trim() || !endInput.trim()}
              className="btn-soul-primary inline-flex items-center gap-3 px-8 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                  <span>Се мапира твојата рута...</span>
                </>
              ) : (
                <>
                  <Route size={20} />
                  <span>Генерирај мој SoulRide</span>
                </>
              )}
            </button>
            
            {(!startInput.trim() || !endInput.trim()) && (
              <p 
                className="text-xs mt-3"
                style={{ 
                  fontFamily: "'Libre Baskerville', serif",
                  color: 'hsl(35 15% 50%)',
                }}
              >
                Избери почетна локација и дестинација за да ја генерираш рутата
              </p>
            )}
          </div>
        </motion.div>

        {/* Generated Route Results */}
        {generatedRoute && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12"
          >
            {/* Route Summary */}
            <div className="text-center mb-8">
              <h3 
                className="text-2xl sm:text-3xl tracking-wider mb-2"
                style={{
                  fontFamily: "'Bitter', serif",
                  color: 'hsl(40 30% 94%)',
                }}
              >
                ТВОЕТО ПАТУВАЊЕ ТЕ ЧЕКА
              </h3>
              <p 
                className="text-lg"
                style={{ 
                  fontFamily: "'Caveat', cursive",
                  color: 'hsl(140 22% 55%)',
                }}
              >
                {generatedRoute.startLocation.name} → {generatedRoute.endLocation.name}
              </p>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              {[
                { icon: Clock, value: generatedRoute.estimatedTime, label: "Вкупно време" },
                { icon: Route, value: generatedRoute.estimatedDistance, label: "Растојание" },
                { icon: Mountain, value: `${generatedRoute.stops.length} постојки`, label: "Погледи" },
                { icon: Utensils, value: `${generatedRoute.foodStops.length} места`, label: "Храна и одмор" },
              ].map((stat) => (
                <div 
                  key={stat.label}
                  className="text-center px-4 py-3 rounded-lg"
                  style={{
                    backgroundColor: 'hsl(140 22% 42% / 0.1)',
                    border: '1px solid hsl(140 22% 42% / 0.25)',
                  }}
                >
                  <stat.icon size={18} className="mx-auto mb-1" style={{ color: 'hsl(140 22% 55%)' }} />
                  <div 
                    className="text-lg font-bold"
                    style={{ 
                      fontFamily: "'Bitter', serif",
                      color: 'hsl(40 30% 90%)',
                    }}
                  >
                    {stat.value}
                  </div>
                  <div 
                    className="text-xs"
                    style={{ 
                      fontFamily: "'Special Elite', monospace",
                      color: 'hsl(35 15% 50%)',
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Map */}
            <div 
              className="rounded-xl overflow-hidden mb-8"
              style={{
                border: '2px solid hsl(140 15% 25% / 0.4)',
                boxShadow: '0 4px 20px hsl(0 0% 0% / 0.3)',
              }}
            >
              <Suspense
                fallback={<div className="w-full h-[400px] sm:h-[500px]" style={{ background: "hsl(200 20% 8%)" }} />}
              >
                <JourneyRouteMap
                  startLocation={generatedRoute.startLocation}
                  endLocation={generatedRoute.endLocation}
                  stops={generatedRoute.stops}
                  foodStops={generatedRoute.foodStops}
                />
              </Suspense>
            </div>

            {/* Open in Google Maps */}
            <div className="text-center">
              <a
                href={generateMapsUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-soul-secondary inline-flex items-center gap-2"
              >
                <ExternalLink size={16} />
                <span>Отвори во Google Maps</span>
              </a>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default JourneyPlanner;
