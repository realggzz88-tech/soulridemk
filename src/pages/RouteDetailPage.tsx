import { useParams, Link, useNavigate } from "react-router-dom";
import { getRouteById, routes } from "@/data/routes";
import { spots as allSpots } from "@/data/spots";
import { 
  ArrowLeft, Clock, MapPin, Mountain, ChevronRight, Star, Navigation, 
  Share2, Copy, Compass, Sparkles, AlertTriangle, Check
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import RouteMap from "@/components/RouteMap";

const RouteDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const route = getRouteById(id || "");
  const [copied, setCopied] = useState(false);

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

  // Get actual spot data for this route
  const routeSpots = route.spotIds
    .map(spotId => allSpots.find(s => s.id === spotId))
    .filter((spot): spot is NonNullable<typeof spot> => spot !== undefined);

  // Share functionality
  const handleShare = async () => {
    const shareText = `🏍️ ${route.title} | Soulride Macedonia\n\n"${route.poeticTagline}"\n\n📍 ${route.distance} • ⏱️ ${route.duration} • 🎯 ${route.spotIds.length} stops\n\n${route.description}\n\n`;
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[70vh] flex items-end overflow-hidden">
        {/* Background Image with fade-in */}
        <div className="absolute inset-0 animate-fade-in">
          <img
            src={route.mainImage}
            alt={route.title}
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.55) contrast(1.1) saturate(0.9)' }}
          />
          
          {/* Moody Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-midnight-blue/40 via-transparent to-deep-forest/30" />
          <div className="absolute inset-0 hero-vignette" />
          <div className="absolute inset-0 road-pattern opacity-15" />
          <div className="absolute inset-0 mountain-contours opacity-10" />
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-24 left-4 md:left-8 z-20 flex items-center gap-2 px-4 py-2 rounded-full bg-background/50 backdrop-blur-sm border border-border/50 text-foreground hover:bg-background/80 transition-all animate-fade-up"
          style={{ animationDelay: "0.1s" }}
        >
          <ArrowLeft size={18} />
          <span className="hidden sm:inline">Back</span>
        </button>

        {/* Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 pb-12">
          {/* Badges */}
          <div 
            className="flex flex-wrap gap-3 mb-4 animate-fade-up opacity-0"
            style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
          >
            <span className="px-4 py-1.5 rounded-full text-sm font-medium bg-soul-amber/80 text-primary-foreground">
              {route.region}
            </span>
            <span className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium",
              route.difficulty === "Easy" && "bg-earth-green/80 text-primary-foreground",
              route.difficulty === "Moderate" && "bg-mountain-blue/80 text-primary-foreground",
              route.difficulty === "Challenging" && "bg-destructive/80 text-primary-foreground"
            )}>
              {route.difficulty}
            </span>
          </div>

          {/* Poetic Tagline */}
          <p 
            className="text-earth-green-glow text-sm md:text-base italic mb-3 tracking-wider animate-fade-up opacity-0"
            style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}
          >
            "{route.poeticTagline}"
          </p>

          {/* Title */}
          <h1 
            className="font-display text-4xl md:text-6xl lg:text-7xl tracking-wider mb-4 text-gradient-glow animate-fade-up opacity-0"
            style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
          >
            {route.title}
          </h1>

          {/* Stats Row */}
          <div 
            className="flex flex-wrap items-center gap-6 text-foreground/80 mb-6 animate-fade-up opacity-0"
            style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}
          >
            <div className="flex items-center gap-2">
              <MapPin size={18} className="text-soul-amber" />
              <span>{route.distance}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-earth-green-glow" />
              <span>{route.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mountain size={18} className="text-mountain-blue" />
              <span>{route.spotIds.length} Destinations</span>
            </div>
          </div>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-muted/30 backdrop-blur-sm border border-border/50 text-foreground hover:bg-muted/50 hover:border-soul-amber/30 transition-all duration-300 animate-fade-up opacity-0"
            style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}
          >
            {copied ? <Check size={16} className="text-earth-green-glow" /> : <Share2 size={16} />}
            <span className="text-sm">{copied ? "Copied!" : "Share Route"}</span>
            <Copy size={14} className="text-muted-foreground" />
          </button>
        </div>
      </section>

      {/* Interactive Map Section */}
      <section 
        className="py-12 px-4 md:px-8 bg-gradient-to-b from-background to-secondary/20 animate-fade-up opacity-0"
        style={{ animationDelay: "0.7s", animationFillMode: "forwards" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-earth-green/20">
              <Compass size={20} className="text-earth-green-glow" />
            </div>
            <h2 className="font-display text-2xl tracking-wider">ROUTE MAP</h2>
          </div>
          
          <RouteMap spots={routeSpots} routeTitle={route.title} />

          {/* Map Note */}
          <p className="text-xs text-muted-foreground text-center mt-4 tracking-wide">
            📍 Enable GPS for routes from your location • Fallback to Skopje center if unavailable
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Description */}
              <div className="animate-fade-up opacity-0" style={{ animationDelay: "0.8s", animationFillMode: "forwards" }}>
                <h2 className="font-display text-2xl tracking-wider mb-4 text-gradient-card">
                  THE JOURNEY
                </h2>
                <p className="text-foreground/90 leading-relaxed text-lg tracking-wide">
                  {route.longDescription}
                </p>
              </div>

              {/* Activities Section */}
              <div className="animate-fade-up opacity-0" style={{ animationDelay: "0.9s", animationFillMode: "forwards" }}>
                <div className="flex items-center gap-3 mb-6">
                  <Sparkles size={20} className="text-soul-amber" />
                  <h2 className="font-display text-2xl tracking-wider text-gradient-card">
                    SOUL ACTIVITIES
                  </h2>
                </div>
                <div className="gradient-border rounded-xl p-[1px]">
                  <div className="bg-card rounded-xl p-6">
                    <ul className="space-y-3">
                      {route.activities.map((activity, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="text-soul-amber mt-0.5">✦</span>
                          <span className="text-foreground/90 tracking-wide italic">{activity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Route Stops with Things To Do */}
              <div className="animate-fade-up opacity-0" style={{ animationDelay: "1s", animationFillMode: "forwards" }}>
                <h2 className="font-display text-2xl tracking-wider mb-6 text-gradient-card">
                  DESTINATIONS & EXPERIENCES
                </h2>
                <div className="space-y-6">
                  {routeSpots.map((spot, index) => (
                    <div
                      key={spot.id}
                      className="group relative rounded-xl overflow-hidden border border-border/50 hover:border-earth-green/50 transition-all duration-300"
                    >
                      {/* Background Image */}
                      <div className="absolute inset-0">
                        <img
                          src={spot.images[0]}
                          alt={spot.title}
                          className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-card via-card/95 to-card/80" />
                      </div>

                      <div className="relative p-6 flex flex-col md:flex-row gap-6">
                        {/* Stop Number & Image */}
                        <div className="flex-shrink-0 flex items-start gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-earth-green to-soul-amber flex items-center justify-center font-display text-xl text-primary-foreground shadow-[0_0_20px_hsl(32_85%_52%/0.3)]">
                            {index + 1}
                          </div>
                          <div className="w-24 h-20 rounded-lg overflow-hidden md:hidden">
                            <img
                              src={spot.images[0]}
                              alt={spot.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <h3 className="font-display text-xl tracking-wide text-foreground mb-1 group-hover:text-earth-green-glow transition-colors">
                            {spot.title}
                          </h3>
                          <p className="text-sm text-muted-foreground italic mb-3">
                            "{spot.poeticTagline}"
                          </p>
                          
                          {/* Things to Do */}
                          {route.thingsToDo[spot.id] && (
                            <div className="flex items-start gap-2 p-3 rounded-lg bg-soul-amber/10 border border-soul-amber/20">
                              <Star size={14} className="text-soul-amber mt-0.5 flex-shrink-0" />
                              <p className="text-sm text-foreground/90 tracking-wide">
                                {route.thingsToDo[spot.id]}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Link Arrow */}
                        <Link
                          to={`/spots/${spot.id}`}
                          className="flex-shrink-0 self-center p-3 rounded-full bg-earth-green/20 text-earth-green-glow hover:bg-earth-green/30 transition-all"
                        >
                          <ChevronRight size={20} />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Quick Info Card */}
              <div 
                className="gradient-border rounded-xl p-[1px] animate-fade-up opacity-0"
                style={{ animationDelay: "0.8s", animationFillMode: "forwards" }}
              >
                <div className="bg-card rounded-xl p-6 space-y-4">
                  <h3 className="font-display text-xl tracking-wider text-gradient-card">
                    ROUTE INFO
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Distance</span>
                      <span className="text-foreground font-medium">{route.distance}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Duration</span>
                      <span className="text-foreground font-medium">{route.duration}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Difficulty</span>
                      <span className={cn(
                        "font-medium",
                        route.difficulty === "Easy" && "text-earth-green-glow",
                        route.difficulty === "Moderate" && "text-mountain-blue",
                        route.difficulty === "Challenging" && "text-destructive"
                      )}>
                        {route.difficulty}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Stops</span>
                      <span className="text-foreground font-medium">{route.spotIds.length} destinations</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Region</span>
                      <span className="text-soul-amber font-medium">{route.region}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Start Ride CTA */}
              <Link
                to={`/spots/${route.spotIds[0]}`}
                className="block w-full py-4 rounded-xl bg-gradient-to-r from-earth-green/30 via-earth-green/20 to-soul-amber/30 border border-earth-green/40 text-center font-display tracking-wider text-foreground hover:shadow-[0_0_30px_hsl(160_40%_28%/0.4)] transition-all duration-300 group animate-fade-up opacity-0"
                style={{ animationDelay: "0.9s", animationFillMode: "forwards" }}
              >
                <div className="flex items-center justify-center gap-3">
                  <Navigation size={20} className="text-soul-amber group-hover:animate-pulse" />
                  <span>Start This Journey</span>
                </div>
              </Link>

              {/* Rider Tips */}
              <div 
                className="p-5 rounded-xl bg-muted/20 border border-border/30 animate-fade-up opacity-0"
                style={{ animationDelay: "1s", animationFillMode: "forwards" }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle size={16} className="text-soul-amber" />
                  <h4 className="font-display text-sm tracking-wider text-soul-amber">
                    RIDER TIPS
                  </h4>
                </div>
                <ul className="space-y-3">
                  {route.riderTips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-earth-green-glow mt-0.5">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Highlights */}
              <div 
                className="p-5 rounded-xl bg-earth-green/5 border border-earth-green/20 animate-fade-up opacity-0"
                style={{ animationDelay: "1.1s", animationFillMode: "forwards" }}
              >
                <h4 className="font-display text-sm tracking-wider text-earth-green-glow mb-4">
                  ✨ HIGHLIGHTS
                </h4>
                <ul className="space-y-2">
                  {route.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-foreground/80">
                      <Star size={12} className="text-soul-amber mt-1 flex-shrink-0" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Offline Note */}
              <div className="p-4 rounded-xl bg-mountain-blue/10 border border-mountain-blue/20 text-center">
                <p className="text-xs text-muted-foreground tracking-wide">
                  📱 <span className="text-mountain-blue">For GPS navigation:</span> Export to OsmAnd or use phone apps. Soulride shows scenic previews!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other Routes */}
      <section className="py-16 px-4 bg-gradient-to-b from-secondary/20 to-background">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-display text-3xl tracking-wider mb-8 text-center text-gradient-subtle">
            MORE SOUL ROUTES
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {routes
              .filter(r => r.id !== route.id)
              .slice(0, 3)
              .map((otherRoute, index) => (
                <Link
                  key={otherRoute.id}
                  to={`/routes/${otherRoute.id}`}
                  className="group relative h-[220px] rounded-xl overflow-hidden animate-fade-up opacity-0"
                  style={{ animationDelay: `${1.2 + index * 0.1}s`, animationFillMode: "forwards" }}
                >
                  <img
                    src={otherRoute.mainImage}
                    alt={otherRoute.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                  <div className="absolute inset-0" style={{ boxShadow: 'inset 0 0 60px 15px hsl(0 0% 0% / 0.4)' }} />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <span className="text-xs px-2 py-1 rounded-full bg-soul-amber/80 text-primary-foreground mb-2 inline-block">
                      {otherRoute.region}
                    </span>
                    <p className="text-xs text-earth-green-glow italic mb-1">"{otherRoute.poeticTagline}"</p>
                    <h3 className="font-display text-lg tracking-wide text-foreground group-hover:text-soul-amber transition-colors">
                      {otherRoute.title}
                    </h3>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default RouteDetailPage;
