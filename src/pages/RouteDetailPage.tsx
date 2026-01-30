import { useParams, Link, useNavigate } from "react-router-dom";
import { getRouteById, routes } from "@/data/routes";
import { spots as allSpots } from "@/data/spots";
import { ArrowLeft, Clock, MapPin, Mountain, ChevronRight, Star, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";
import ShareButtons from "@/components/ShareButtons";

const RouteDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const route = getRouteById(id || "");

  if (!route) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
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
    .filter(Boolean);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[70vh] md:h-[80vh] flex items-end overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={route.mainImage}
            alt={route.title}
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.6) contrast(1.1)' }}
          />
          
          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-midnight-blue/30 via-transparent to-deep-forest/20" />
          <div className="absolute inset-0 hero-vignette" />
          <div className="absolute inset-0 road-pattern opacity-20" />
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-24 left-4 md:left-8 z-20 flex items-center gap-2 px-4 py-2 rounded-full bg-background/50 backdrop-blur-sm border border-border/50 text-foreground hover:bg-background/80 transition-all"
        >
          <ArrowLeft size={18} />
          <span className="hidden sm:inline">Back</span>
        </button>

        {/* Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 pb-12">
          {/* Badges */}
          <div className="flex flex-wrap gap-3 mb-4">
            <span className="px-4 py-1.5 rounded-full text-sm font-medium bg-soul-amber/80 text-background">
              {route.region}
            </span>
            <span className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium",
              route.difficulty === "Easy" && "bg-earth-green/80 text-background",
              route.difficulty === "Moderate" && "bg-mountain-blue/80 text-background",
              route.difficulty === "Challenging" && "bg-rose-500/80 text-background"
            )}>
              {route.difficulty}
            </span>
          </div>

          {/* Poetic Tagline */}
          <p className="text-earth-green-glow text-sm md:text-base italic mb-3 tracking-wider">
            "{route.poeticTagline}"
          </p>

          {/* Title */}
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl tracking-wider mb-4 text-gradient-glow">
            {route.title}
          </h1>

          {/* Stats Row */}
          <div className="flex flex-wrap items-center gap-6 text-foreground/80 mb-6">
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

          {/* Share */}
          <ShareButtons variant="compact" spotName={route.title} />
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Left Column - Description & Highlights */}
            <div className="lg:col-span-2 space-y-12">
              {/* Description */}
              <div>
                <h2 className="font-display text-2xl tracking-wider mb-4 text-gradient-card">
                  THE JOURNEY
                </h2>
                <p className="text-foreground/90 leading-relaxed text-lg tracking-wide">
                  {route.longDescription}
                </p>
              </div>

              {/* Highlights */}
              <div>
                <h2 className="font-display text-2xl tracking-wider mb-6 text-gradient-card">
                  ROUTE HIGHLIGHTS
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {route.highlights.map((highlight, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 rounded-xl bg-muted/20 border border-border/30"
                    >
                      <Star size={16} className="text-soul-amber mt-1 flex-shrink-0" />
                      <p className="text-foreground/90 text-sm tracking-wide">{highlight}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Route Stops */}
              <div>
                <h2 className="font-display text-2xl tracking-wider mb-6 text-gradient-card">
                  DESTINATIONS ON THIS ROUTE
                </h2>
                <div className="space-y-4">
                  {routeSpots.map((spot, index) => spot && (
                    <Link
                      key={spot.id}
                      to={`/spots/${spot.id}`}
                      className="group flex items-center gap-4 p-4 rounded-xl bg-card border border-border/50 hover:border-earth-green/50 hover:shadow-[0_0_30px_hsl(160_40%_28%/0.2)] transition-all duration-300"
                    >
                      {/* Stop Number */}
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-earth-green/20 flex items-center justify-center font-display text-earth-green-glow">
                        {index + 1}
                      </div>
                      
                      {/* Image */}
                      <div className="flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden">
                        <img
                          src={spot.images[0]}
                          alt={spot.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display text-lg tracking-wide text-foreground group-hover:text-earth-green-glow transition-colors truncate">
                          {spot.title}
                        </h3>
                        <p className="text-sm text-muted-foreground truncate">
                          {spot.poeticTagline}
                        </p>
                      </div>
                      
                      {/* Arrow */}
                      <ChevronRight size={20} className="text-muted-foreground group-hover:text-earth-green-glow group-hover:translate-x-1 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Quick Info Card */}
              <div className="gradient-border rounded-xl p-[1px]">
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
                        route.difficulty === "Challenging" && "text-rose-400"
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
                className="block w-full py-4 rounded-xl bg-gradient-to-r from-earth-green/30 via-earth-green/20 to-soul-amber/30 border border-earth-green/40 text-center font-display tracking-wider text-foreground hover:shadow-[0_0_30px_hsl(160_40%_28%/0.4)] transition-all duration-300 group"
              >
                <div className="flex items-center justify-center gap-3">
                  <Navigation size={20} className="text-soul-amber group-hover:animate-pulse" />
                  <span>Start This Journey</span>
                </div>
              </Link>

              {/* Tips */}
              <div className="p-5 rounded-xl bg-muted/20 border border-border/30">
                <h4 className="font-display text-sm tracking-wider text-soul-amber mb-3">
                  💡 RIDER TIPS
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Start early for best light and fewer crowds</li>
                  <li>• Check weather conditions for mountain passes</li>
                  <li>• Download offline maps before departing</li>
                  <li>• Fuel up at larger towns along the route</li>
                </ul>
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
              .map(otherRoute => (
                <Link
                  key={otherRoute.id}
                  to={`/routes/${otherRoute.id}`}
                  className="group relative h-[200px] rounded-xl overflow-hidden"
                >
                  <img
                    src={otherRoute.mainImage}
                    alt={otherRoute.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
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
