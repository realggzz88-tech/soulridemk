import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Mountain, Droplets } from "lucide-react";

const FeaturedEasternLoop = () => {
  const loopStops = [
    { id: "carevi-kuli", name: "Carevi Kuli", icon: Mountain },
    { id: "kolesino-waterfall", name: "Kolesino Falls", icon: Droplets },
    { id: "smolare-waterfall", name: "Smolare Falls", icon: Droplets },
  ];

  return (
    <section className="py-16 px-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 road-pattern opacity-10" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-earth-green/5 to-transparent" />
      
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="spot-card p-8 md:p-10 film-grain">
          {/* Decorative corner elements */}
          <div className="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-earth-green/30 rounded-tl-xl" />
          <div className="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-soul-amber/30 rounded-br-xl" />
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-soul-amber/20 border border-soul-amber/30 mb-4">
              <MapPin size={14} className="text-soul-amber" />
              <span className="text-xs font-medium tracking-widest text-soul-amber uppercase">Featured Route</span>
            </div>
            
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl tracking-wider mb-3 text-gradient-subtle">
              FEATURED STRUMICA LOOP
            </h2>
            
            <p className="text-earth-green-glow text-lg italic font-light tracking-wide max-w-2xl mx-auto">
              "Start local: Eastern soul rides through waterfalls, fortresses, and forgotten paths"
            </p>
          </div>

          {/* Route visualization */}
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-mountain-blue/20 border border-mountain-blue/30">
              <MapPin size={16} className="text-foreground/80" />
              <span className="text-sm font-medium tracking-wide">Strumica</span>
            </div>
            
            {loopStops.map((stop, index) => (
              <div key={stop.id} className="flex items-center gap-3">
                <div className="w-8 h-px bg-gradient-to-r from-earth-green/50 to-soul-amber/50 hidden md:block" />
                <ArrowRight size={16} className="text-muted-foreground md:hidden" />
                <Link
                  to={`/spots/${stop.id}`}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-earth-green/15 border border-earth-green/25 hover:bg-earth-green/25 hover:border-earth-green/40 transition-all duration-300 group"
                >
                  <stop.icon size={16} className="text-earth-green-glow" />
                  <span className="text-sm font-medium tracking-wide group-hover:text-earth-green-glow transition-colors">
                    {stop.name}
                  </span>
                </Link>
                {index < loopStops.length - 1 && (
                  <div className="w-8 h-px bg-gradient-to-r from-soul-amber/50 to-earth-green/50 hidden md:block" />
                )}
              </div>
            ))}
            
            <ArrowRight size={16} className="text-muted-foreground hidden md:block" />
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-mountain-blue/20 border border-mountain-blue/30">
              <MapPin size={16} className="text-foreground/80" />
              <span className="text-sm font-medium tracking-wide">Strumica</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-8 tracking-wide text-high-contrast">
            A full-day adventure through Macedonia's hidden east. Start from Strumica, climb to the ancient fortress ruins of Carevi Kuli, 
            then descend through lush Belasica hills to discover the cascading beauty of Kolesino and Smolare waterfalls. 
            Return as the sun sets over the valley – forever changed.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-10 mb-8">
            <div className="text-center">
              <div className="font-display text-2xl md:text-3xl text-soul-amber">~65 km</div>
              <div className="text-xs text-muted-foreground tracking-wide uppercase">Total Distance</div>
            </div>
            <div className="text-center">
              <div className="font-display text-2xl md:text-3xl text-earth-green-glow">4-5 hrs</div>
              <div className="text-xs text-muted-foreground tracking-wide uppercase">Scenic Pace</div>
            </div>
            <div className="text-center">
              <div className="font-display text-2xl md:text-3xl text-foreground">3 Stops</div>
              <div className="text-xs text-muted-foreground tracking-wide uppercase">Soul Spots</div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link
              to="/spots"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-earth-green/30 to-soul-amber/20 border border-earth-green/40 hover:from-earth-green/40 hover:to-soul-amber/30 hover:shadow-[0_0_30px_hsl(var(--earth-green)/0.3)] transition-all duration-300 group"
            >
              <span className="font-medium tracking-wide">Explore Eastern Gems</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedEasternLoop;