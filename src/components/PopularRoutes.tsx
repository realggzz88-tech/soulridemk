import { useState } from "react";
import { Link } from "react-router-dom";
import { Clock, Route, ChevronRight, Star, Mountain, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { popularRoutes } from "@/data/journeyData";

interface PopularRoutesProps {
  onSelectRoute?: (startLocation: string, endLocation: string) => void;
}

const PopularRoutes = ({ onSelectRoute }: PopularRoutesProps) => {
  const [hoveredRoute, setHoveredRoute] = useState<string | null>(null);

  const difficultyColors = {
    easy: "text-earth-green-glow bg-earth-green/20",
    moderate: "text-mountain-blue bg-mountain-blue/20",
    challenging: "text-soul-amber bg-soul-amber/20",
  };

  return (
    <section className="py-16 sm:py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 road-pattern opacity-8" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-mountain-blue/20 border border-mountain-blue/30 mb-6">
            <Star size={16} className="text-mountain-blue" />
            <span className="text-sm text-mountain-blue tracking-wide font-medium">RIDER FAVORITES</span>
          </div>
          
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl tracking-wider mb-4 text-gradient-subtle">
            MOST LOVED SOULRIDES
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground">
            Curated routes tested by soul riders. Each journey chosen for its perfect blend of views, roads, and local flavors.
          </p>
        </div>

        {/* Routes Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularRoutes.map((route) => (
            <div
              key={route.id}
              className={cn(
                "group relative rounded-2xl overflow-hidden border transition-all duration-500",
                hoveredRoute === route.id 
                  ? "border-soul-amber/50 shadow-[0_0_40px_hsl(var(--amber-soul)/0.2)]" 
                  : "border-border/30"
              )}
              onMouseEnter={() => setHoveredRoute(route.id)}
              onMouseLeave={() => setHoveredRoute(null)}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={route.image}
                  alt={route.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                
                {/* Duration Badge */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur-sm border border-border/50">
                  <Clock size={14} className="text-soul-amber" />
                  <span className="text-xs font-medium">{route.duration}</span>
                </div>

                {/* Difficulty Badge */}
                <div className={cn(
                  "absolute top-3 left-3 px-3 py-1.5 rounded-full text-xs font-medium capitalize",
                  difficultyColors[route.difficulty]
                )}>
                  {route.difficulty}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-display text-xl tracking-wide mb-1 text-gradient-card group-hover:text-soul-amber transition-colors">
                  {route.title}
                </h3>
                <p className="text-sm text-earth-green-glow mb-3">{route.subtitle}</p>
                
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {route.description}
                </p>

                {/* Key Stops */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {route.keyStops.slice(0, 3).map((stop) => (
                    <span
                      key={stop}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-muted/50 text-xs text-muted-foreground"
                    >
                      <Mountain size={10} />
                      {stop}
                    </span>
                  ))}
                  {route.keyStops.length > 3 && (
                    <span className="px-2 py-1 rounded-md bg-muted/50 text-xs text-muted-foreground">
                      +{route.keyStops.length - 3} more
                    </span>
                  )}
                </div>

                {/* Route Info */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                  <MapPin size={12} className="text-earth-green-glow" />
                  <span>{route.startLocation}</span>
                  <ChevronRight size={12} />
                  <MapPin size={12} className="text-soul-amber" />
                  <span>{route.endLocation}</span>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => onSelectRoute?.(route.startLocation, route.endLocation)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-muted/30 border border-border/30 text-foreground/80 hover:bg-soul-amber/20 hover:border-soul-amber/30 hover:text-soul-amber transition-all duration-300"
                >
                  <Route size={16} />
                  <span className="text-sm font-medium">Plan This Journey</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Routes Link */}
        <div className="text-center mt-10">
          <Link
            to="/routes"
            className="inline-flex items-center gap-2 text-earth-green-glow hover:text-foreground transition-colors group"
          >
            <span>Explore All Soul Routes</span>
            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PopularRoutes;
