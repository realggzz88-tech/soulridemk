import { Link } from "react-router-dom";
import { useUiRoutes, type Route } from "@/lib/content";
import { ArrowRight, Route as RouteIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const RouteSuggestions = () => {
  const routes = useUiRoutes();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-background via-secondary/20 to-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 road-pattern opacity-10" />
      <div className="absolute inset-0 mountain-contours opacity-10" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-soul-amber/10 border border-soul-amber/20 mb-4">
            <RouteIcon size={16} className="text-soul-amber" />
            <span className="text-sm text-soul-amber tracking-wider font-medium">CURATED JOURNEYS</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl tracking-wider mb-4 text-gradient-subtle">
            SOUL ROUTES
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-high-contrast">
            Epic multi-stop adventures connecting the most soulful destinations. Each route tells a story.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Scroll Buttons */}
          <button
            onClick={() => scroll('left')}
            className={cn(
              "absolute left-0 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 text-foreground transition-all duration-300",
              canScrollLeft 
                ? "opacity-100 hover:bg-background hover:border-soul-amber/50 hover:shadow-[0_0_20px_hsl(32_85%_52%/0.3)]" 
                : "opacity-0 pointer-events-none"
            )}
          >
            <ChevronLeft size={24} />
          </button>
          
          <button
            onClick={() => scroll('right')}
            className={cn(
              "absolute right-0 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 text-foreground transition-all duration-300",
              canScrollRight 
                ? "opacity-100 hover:bg-background hover:border-soul-amber/50 hover:shadow-[0_0_20px_hsl(32_85%_52%/0.3)]" 
                : "opacity-0 pointer-events-none"
            )}
          >
            <ChevronRight size={24} />
          </button>

          {/* Gradient Edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

          {/* Scrollable Cards */}
          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 px-8 -mx-4 snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {routes.map((route, index) => (
              <div
                key={route.id}
                className="flex-shrink-0 w-[340px] md:w-[400px] snap-center animate-fade-up opacity-0"
                style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
              >
                <RouteCard route={route} />
              </div>
            ))}
          </div>
        </div>

        {/* View All Link */}
        <div className="text-center mt-8">
          <Link
            to="/spots"
            className="inline-flex items-center gap-2 text-earth-green-glow hover:text-foreground transition-colors group text-sm tracking-wide"
          >
            <span>View all 25 destinations</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

interface RouteCardProps {
  route: Route;
}

const RouteCard = ({ route }: RouteCardProps) => {
  return (
    <Link
      to={`/routes/${route.id}`}
      className="group block relative h-[320px] rounded-2xl overflow-hidden film-grain"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={route.mainImage}
          alt={route.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Multi-layer Gradient Overlays - Moody */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-br from-midnight-blue/40 via-transparent to-deep-forest/30" />
        
        {/* Vignette */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            boxShadow: 'inset 0 0 100px 30px hsl(0 0% 0% / 0.5)'
          }}
        />
        
        {/* Artistic overlay on hover */}
        <div className="absolute inset-0 road-pattern opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
      </div>

      {/* Region Badge */}
      <div className="absolute top-4 left-4 z-10">
        <span className="px-3 py-1 rounded-full text-xs font-medium tracking-wide bg-soul-amber/80 text-background backdrop-blur-sm">
          {route.region}
        </span>
      </div>

      {/* Difficulty Badge */}
      <div className="absolute top-4 right-4 z-10">
        <span className={cn(
          "px-3 py-1 rounded-full text-xs font-medium tracking-wide backdrop-blur-sm",
          route.difficulty === "Easy" && "bg-earth-green/80 text-background",
          route.difficulty === "Moderate" && "bg-mountain-blue/80 text-background",
          route.difficulty === "Challenging" && "bg-rose-500/80 text-background"
        )}>
          {route.difficulty}
        </span>
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
        {/* Poetic Tagline */}
        <p className="text-earth-green-glow text-xs italic mb-2 tracking-wide opacity-80">
          "{route.poeticTagline}"
        </p>
        
        {/* Title */}
        <h3 className="font-display text-2xl tracking-wider mb-2 text-gradient-glow group-hover:text-foreground transition-colors">
          {route.title}
        </h3>
        
        {/* Description */}
        <p className="text-foreground/80 text-sm leading-relaxed mb-4 line-clamp-2 text-high-contrast">
          {route.description}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
          <span>{route.distance}</span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground" />
          <span>{route.duration}</span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground" />
          <span>{route.spotIds.length} stops</span>
        </div>

        {/* CTA Button */}
        <button
          className="w-full py-3 rounded-xl bg-soul-amber/20 border border-soul-amber/30 text-soul-amber font-medium tracking-wide transition-all duration-300 group-hover:bg-soul-amber/30 group-hover:shadow-[0_0_25px_hsl(32_85%_52%/0.4)] group-hover:border-soul-amber/50 flex items-center justify-center gap-2"
        >
          <span>Explore Route</span>
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </Link>
  );
};

export default RouteSuggestions;
