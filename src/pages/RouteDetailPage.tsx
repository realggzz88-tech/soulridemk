import { useParams, Link, useNavigate } from "react-router-dom";
import { useUiRoute, useUiRoutes, useUiSpots } from "@/lib/content";
import { SmartImage } from "@/components/SmartImage";
import { 
  ArrowLeft, Clock, MapPin, Mountain, ChevronRight, Star, Navigation, 
  Share2, Copy, Compass, AlertTriangle, Check, Utensils, Route, Eye, Info,
  Fuel, Sun, TrendingUp, Coffee, Bed, Camera
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect, useMemo } from "react";
import { toast } from "@/hooks/use-toast";
import RouteMap from "@/components/RouteMap";
import { StartRouteButton } from "@/components/StartDrivingButton";
import RoutePhotoSlider from "@/components/RoutePhotoSlider";

const RouteDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const route = useUiRoute(id);
  const routes = useUiRoutes();
  const allSpots = useUiSpots();
  const [copied, setCopied] = useState(false);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [id]);

  // Get actual spot data for this route
  const routeSpots = useMemo(() => {
    if (!route) return [];
    return route.spotIds
      .map(spotId => allSpots.find(s => s.id === spotId))
      .filter((spot): spot is NonNullable<typeof spot> => spot !== undefined);
  }, [route, allSpots]);

  // Generate photos for slider from route spots
  const sliderPhotos = useMemo(() => {
    const poeticCaptions = [
      "Beauty along the way",
      "Where the road whispers secrets",
      "A moment of wonder",
      "The soul of the journey",
      "Lost in the horizon",
      "Nature's masterpiece unfolds",
    ];
    
    return routeSpots.slice(0, 6).flatMap((spot, spotIndex) =>
      spot.photos.slice(0, 1).map((photo) => ({
        photo,
        title: spot.title,
        caption: `${poeticCaptions[spotIndex % poeticCaptions.length]}: ${spot.title.split(" ").slice(0, 3).join(" ")}`,
      })),
    );
  }, [routeSpots]);

  if (!route) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center animate-fade-up">
          <h1 className="font-display text-4xl mb-4">Route Not Found</h1>
          <p className="text-muted-foreground mb-6">The soul route you seek has wandered off the map.</p>
          <Link to="/" className="text-earth-green-glow hover:underline">
            Return to homepage
          </Link>
        </div>
      </div>
    );
  }

  // Share functionality
  const handleShare = async () => {
    const shareText = `🏍️ ${route.title} | Soulride Macedonia\n\n"${route.poeticTagline}"\n\n📍 ${route.distance} • ⏱️ ${route.duration} • 🎯 ${route.spotIds.length} stops\n\n`;
    const shareUrl = window.location.href;

    try {
      await navigator.clipboard.writeText(shareText + shareUrl);
      setCopied(true);
      toast({
        title: "Route copied!",
        description: "Share this epic journey with fellow riders.",
      });
      setTimeout(() => setCopied(false), 3000);
    } catch {
      toast({
        title: "Copy failed",
        description: "Please copy the URL manually.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen page-enter grain-overlay" style={{ backgroundColor: 'hsl(var(--background))' }}>
      {/* Hero Photo Slider - Immediate Visual Impact */}
      <RoutePhotoSlider photos={sliderPhotos} routeTitle={route.title} />
      {/* Compact Header with Route Info */}
      <section className="pt-24 pb-6 px-4 md:px-8 bg-gradient-to-b from-background via-secondary/10 to-transparent">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 mb-4 rounded-full bg-muted/30 backdrop-blur-sm border border-border/50 text-foreground hover:bg-muted/50 transition-all"
          >
            <ArrowLeft size={18} />
            <span className="text-sm">Back</span>
          </button>

          {/* Route Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-soul-amber/80 text-primary-foreground">
                  {route.region}
                </span>
                <span className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium",
                  route.difficulty === "Easy" && "bg-earth-green/80 text-primary-foreground",
                  route.difficulty === "Moderate" && "bg-mountain-blue/80 text-primary-foreground",
                  route.difficulty === "Challenging" && "bg-destructive/80 text-primary-foreground"
                )}>
                  {route.difficulty}
                </span>
              </div>

              {/* Title & Tagline */}
              <p className="text-earth-green-glow text-sm italic mb-2 tracking-wider">
                "{route.poeticTagline}"
              </p>
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl tracking-wider text-gradient-glow">
                {route.title}
              </h1>
            </div>

            {/* Quick Stats & Share */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <MapPin size={16} className="text-soul-amber" />
                <span>{route.distance}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={16} className="text-earth-green-glow" />
                <span>{route.duration}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mountain size={16} className="text-mountain-blue" />
                <span>{route.spotIds.length} stops</span>
              </div>
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/30 border border-border/50 hover:bg-muted/50 transition-all"
              >
                {copied ? <Check size={14} className="text-earth-green-glow" /> : <Share2 size={14} />}
                <span>{copied ? "Copied" : "Share"}</span>
                <Copy size={12} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Full-Width Interactive Map - HERO POSITION */}
      <section className="px-4 md:px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-earth-green/20">
                <Compass size={20} className="text-earth-green-glow" />
              </div>
              <h2 className="font-display text-xl md:text-2xl tracking-wider">ROUTE MAP</h2>
            </div>
            
            {/* Start Route Button - Desktop */}
            <StartRouteButton
              waypoints={routeSpots.map(spot => ({
                lat: spot.coordinates.lat,
                lng: spot.coordinates.lng,
                name: spot.title,
              }))}
              className="hidden md:flex"
            />
          </div>
          
          <RouteMap spots={routeSpots} routeTitle={route.title} />

          {/* Mobile Start Button */}
          <div className="mt-4 flex justify-center md:hidden">
            <StartRouteButton
              waypoints={routeSpots.map(spot => ({
                lat: spot.coordinates.lat,
                lng: spot.coordinates.lng,
                name: spot.title,
              }))}
            />
          </div>

          {/* Map Note */}
          <p className="text-xs text-muted-foreground text-center mt-3 tracking-wide">
            📍 Enable GPS for routes from your location • Green-amber line shows your journey
          </p>
        </div>
      </section>

      {/* Clean Information Sections */}
      <section className="py-10 px-4 md:px-8 bg-gradient-to-b from-secondary/20 to-background">
        <div className="max-w-7xl mx-auto">
          
          {/* Poetic Intro */}
          <div className="text-center mb-10">
            <p className="text-earth-green-glow italic text-lg tracking-wide">
              ✦ Savor the soul of the ride with these stops ✦
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Section 1: Views & Spots on This Route */}
            <div className="lg:col-span-2">
              <div className="gradient-border rounded-xl p-[1px]">
                <div className="bg-card rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Eye size={20} className="text-soul-amber" style={{ filter: "drop-shadow(0 0 6px hsl(32 85% 52% / 0.5))" }} />
                    <h3 className="font-display text-xl tracking-wider text-gradient-card">
                      VIEWS & SPOTS ON THIS ROUTE
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground mb-5 ml-8">
                    Scenic viewpoints in sequence — each a reason to pause
                  </p>
                  
                  <div className="space-y-0">
                    {routeSpots.map((spot, index) => (
                      <div key={spot.id}>
                        {/* Spot Item */}
                        <div className="flex gap-4 group py-4">
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-earth-green to-soul-amber flex items-center justify-center font-display text-base text-primary-foreground shadow-[0_0_15px_hsl(32_85%_52%/0.3)]">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Camera size={14} className="text-soul-amber" />
                              <Link 
                                to={`/spots/${spot.id}`}
                                className="font-display text-lg tracking-wide text-foreground group-hover:text-earth-green-glow transition-colors"
                              >
                                {spot.title}
                              </Link>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {route.thingsToDo[spot.id] || spot.poeticTagline}
                            </p>
                          </div>
                          <Link 
                            to={`/spots/${spot.id}`}
                            className="flex-shrink-0 self-center p-2 rounded-full bg-earth-green/10 text-earth-green-glow opacity-60 group-hover:opacity-100 transition-all hover:bg-earth-green/20"
                          >
                            <ChevronRight size={16} />
                          </Link>
                        </div>
                        
                        {/* Distance indicator between stops */}
                        {index < routeSpots.length - 1 && (
                          <div className="flex items-center gap-3 ml-5 py-2">
                            <div className="w-[2px] h-6 bg-gradient-to-b from-earth-green/50 to-soul-amber/50 rounded-full" />
                            <span className="text-xs text-muted-foreground italic flex items-center gap-1.5">
                              <Route size={10} className="text-earth-green-glow" />
                              ~{15 + index * 8} km of scenic road
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Places to Eat & Rest */}
            <div>
              <div className="gradient-border rounded-xl p-[1px] h-full">
                <div className="bg-card rounded-xl p-6 h-full">
                  <div className="flex items-center gap-3 mb-2">
                    <Coffee size={20} className="text-earth-green-glow" style={{ filter: "drop-shadow(0 0 6px hsl(160 50% 45% / 0.5))" }} />
                    <h3 className="font-display text-lg tracking-wider text-gradient-card">
                      EAT & REST STOPS
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground mb-5 ml-8">
                    Refuel body and soul along the way
                  </p>
                  
                  <ul className="space-y-4">
                    {route.eatAndRest.map((place, index) => {
                      // Determine icon based on description
                      const isRest = place.description.toLowerCase().includes('rest') || 
                                     place.description.toLowerCase().includes('stay') ||
                                     place.description.toLowerCase().includes('hut');
                      const IconComponent = isRest ? Bed : Utensils;
                      
                      return (
                        <li key={index} className="pb-4 border-b border-border/30 last:border-0 last:pb-0">
                          <div className="flex items-start gap-2">
                            <div className="p-1.5 rounded-lg bg-soul-amber/10 mt-0.5">
                              <IconComponent size={14} className="text-soul-amber" />
                            </div>
                            <div>
                              <h4 className="font-medium text-foreground text-sm">
                                {place.name}
                              </h4>
                              <p className="text-xs text-muted-foreground mt-1 italic leading-relaxed">
                                {place.description}
                              </p>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Route Details - Enhanced with icons */}
      <section className="py-10 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Route Technical Details */}
            <div className="gradient-border rounded-xl p-[1px]">
              <div className="bg-card rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Route size={20} className="text-mountain-blue" style={{ filter: "drop-shadow(0 0 6px hsl(215 50% 55% / 0.5))" }} />
                  <h3 className="font-display text-lg tracking-wider text-gradient-card">
                    ROUTE ESSENTIALS
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground mb-5 ml-8">
                  Know the road before you ride
                </p>
                
                {/* Table-style details */}
                <div className="space-y-0 border border-border/30 rounded-lg overflow-hidden">
                  <div className="flex items-center justify-between text-sm py-3 px-4 bg-muted/10 border-b border-border/20">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <MapPin size={14} className="text-soul-amber" />
                      Distance
                    </span>
                    <span className="font-medium text-foreground">{route.distance}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm py-3 px-4 border-b border-border/20">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Clock size={14} className="text-earth-green-glow" />
                      Duration
                    </span>
                    <span className="font-medium text-foreground">{route.duration}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm py-3 px-4 bg-muted/10 border-b border-border/20">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <TrendingUp size={14} className="text-mountain-blue" />
                      Elevation
                    </span>
                    <span className="font-medium text-foreground text-right max-w-[55%]">{route.routeDetails.elevation}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm py-3 px-4 border-b border-border/20">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Route size={14} className="text-muted-foreground" />
                      Road
                    </span>
                    <span className="font-medium text-foreground text-right max-w-[55%]">{route.routeDetails.roadCondition}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm py-3 px-4 bg-muted/10 border-b border-border/20">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Sun size={14} className="text-soul-amber" />
                      Best Season
                    </span>
                    <span className="font-medium text-earth-green-glow">{route.routeDetails.bestSeason}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm py-3 px-4">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Fuel size={14} className="text-destructive" />
                      Fuel
                    </span>
                    <span className="font-medium text-soul-amber text-right max-w-[55%]">{route.routeDetails.fuelStops}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Rider Tips */}
            <div className="gradient-border rounded-xl p-[1px]">
              <div className="bg-card rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <AlertTriangle size={20} className="text-soul-amber" style={{ filter: "drop-shadow(0 0 6px hsl(32 85% 52% / 0.5))" }} />
                  <h3 className="font-display text-lg tracking-wider text-soul-amber">
                    RIDER TIPS
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground mb-5 ml-8">
                  Wisdom from those who've ridden before
                </p>
                
                <ul className="space-y-3">
                  {route.riderTips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm p-3 rounded-lg bg-soul-amber/5 border border-soul-amber/10">
                      <span className="text-soul-amber font-display mt-0.5">{index + 1}.</span>
                      <span className="text-foreground/90">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Journey Description */}
      <section className="py-10 px-4 md:px-8 bg-gradient-to-b from-transparent via-secondary/10 to-secondary/20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Info size={20} className="text-earth-green-glow" />
            <h3 className="font-display text-xl tracking-wider text-gradient-card">THE JOURNEY</h3>
          </div>
          <p className="text-foreground/90 leading-relaxed text-lg tracking-wide italic">
            {route.longDescription}
          </p>
        </div>
      </section>

      {/* More Routes */}
      <section className="py-12 px-4 md:px-8 bg-gradient-to-b from-secondary/20 to-background">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-display text-2xl tracking-wider mb-8 text-center text-gradient-subtle">
            MORE SOUL ROUTES
          </h2>
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {routes
              .filter(r => r.id !== route.id)
              .slice(0, 3)
              .map((otherRoute) => (
                <Link
                  key={otherRoute.id}
                  to={`/routes/${otherRoute.id}`}
                  className="group relative h-[200px] rounded-xl overflow-hidden border border-border/30 hover:border-earth-green/50 transition-all duration-300"
                >
                  <SmartImage
                    photo={otherRoute.photos[0]}
                    alt={otherRoute.photos[0]?.alt.mk || otherRoute.title}
                    variant="card"
                    imgClassName="group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                  <div className="absolute inset-0" style={{ boxShadow: 'inset 0 0 40px 10px hsl(0 0% 0% / 0.4)' }} />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <span className="text-xs px-2 py-1 rounded-full bg-soul-amber/80 text-primary-foreground mb-2 inline-block">
                      {otherRoute.region}
                    </span>
                    <h3 className="font-display text-base tracking-wide text-foreground group-hover:text-soul-amber transition-colors">
                      {otherRoute.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">{otherRoute.distance} • {otherRoute.duration}</p>
                  </div>
                </Link>
              ))}
          </div>

          {/* Back to Routes Button */}
          <div className="flex justify-center">
            <Link
              to="/routes"
              className="group flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-earth-green/20 via-muted/30 to-soul-amber/20 border border-border/50 hover:border-earth-green/50 transition-all duration-300 hover:shadow-[0_0_30px_hsl(160_40%_28%/0.3)]"
            >
              <ArrowLeft size={18} className="text-earth-green-glow group-hover:-translate-x-1 transition-transform" />
              <span className="font-display tracking-wider text-foreground">BACK TO ALL ROUTES</span>
              <Compass size={16} className="text-soul-amber" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RouteDetailPage;
