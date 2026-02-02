import { useState } from "react";
import { Link } from "react-router-dom";
import { Clock, Route, ChevronRight, Star, Mountain, MapPin, Compass } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { popularRoutes } from "@/data/journeyData";

const PopularRoutes = () => {
  const [hoveredRoute, setHoveredRoute] = useState<string | null>(null);

  const difficultyStyles = {
    easy: { bg: 'hsl(140 22% 42% / 0.2)', color: 'hsl(140 22% 55%)', border: 'hsl(140 22% 42% / 0.3)' },
    moderate: { bg: 'hsl(35 50% 45% / 0.2)', color: 'hsl(35 50% 55%)', border: 'hsl(35 50% 45% / 0.3)' },
    challenging: { bg: 'hsl(25 40% 40% / 0.2)', color: 'hsl(25 40% 55%)', border: 'hsl(25 40% 40% / 0.3)' },
  };

  const handleSelectRoute = (route: typeof popularRoutes[0]) => {
    const event = new CustomEvent("prefillJourney", {
      detail: {
        startLocation: route.startLocation,
        endLocation: route.endLocation,
        preferences: {
          prioritizeViews: true,
          includeFoodStops: true,
          maxDriveTime: route.difficulty === "easy" ? 4 : route.difficulty === "moderate" ? 6 : 8,
          adventureLevel: route.difficulty,
        },
      },
    });
    window.dispatchEvent(event);
  };

  return (
    <section 
      className="py-20 px-4 relative overflow-hidden grain-overlay"
      style={{ 
        background: 'linear-gradient(180deg, hsl(25 12% 10%) 0%, hsl(200 20% 9%) 50%, hsl(180 15% 10%) 100%)' 
      }}
    >
      {/* Aged paper texture */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-14">
          {/* Handwritten badge */}
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
            <Star size={14} style={{ color: 'hsl(35 50% 55%)' }} />
            <span 
              className="text-xs tracking-[0.15em] uppercase"
              style={{ 
                fontFamily: "'Special Elite', monospace",
                color: 'hsl(35 50% 60%)',
              }}
            >
              Rider Favorites
            </span>
          </motion.div>
          
          {/* Title - distressed slab */}
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
            MOST LOVED SOULRIDES
          </motion.h2>
          
          {/* Handwritten subtitle */}
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
            Curated routes tested by soul riders. Click any route to auto-fill the journey planner.
          </motion.p>
        </div>

        {/* Routes Grid - Vintage Postcards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularRoutes.map((route, index) => {
            const difficulty = difficultyStyles[route.difficulty];
            return (
              <motion.div
                key={route.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "group relative rounded-xl overflow-hidden cursor-pointer transition-all duration-500",
                  hoveredRoute === route.id && "transform -translate-y-1"
                )}
                style={{
                  backgroundColor: 'hsl(180 12% 11%)',
                  border: hoveredRoute === route.id 
                    ? '1px solid hsl(25 40% 45% / 0.5)' 
                    : '1px solid hsl(140 15% 25% / 0.3)',
                  boxShadow: hoveredRoute === route.id 
                    ? '0 12px 40px hsl(25 40% 30% / 0.3)' 
                    : '0 4px 20px hsl(0 0% 0% / 0.3)',
                }}
                onMouseEnter={() => setHoveredRoute(route.id)}
                onMouseLeave={() => setHoveredRoute(null)}
                onClick={() => handleSelectRoute(route)}
              >
                {/* Polaroid-style image with sepia */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={route.image}
                    alt={route.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    style={{ filter: 'sepia(15%) saturate(85%)' }}
                  />
                  {/* Vintage gradient overlay */}
                  <div 
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(to top, hsl(200 20% 8% / 0.9) 0%, hsl(200 20% 8% / 0.4) 50%, transparent 80%)',
                    }}
                  />
                  
                  {/* Duration Badge - brass tack style */}
                  <div 
                    className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                    style={{
                      backgroundColor: 'hsl(180 12% 12% / 0.9)',
                      border: '1px solid hsl(35 50% 50% / 0.4)',
                    }}
                  >
                    <Clock size={12} style={{ color: 'hsl(35 50% 55%)' }} />
                    <span 
                      className="text-xs"
                      style={{ 
                        fontFamily: "'Special Elite', monospace",
                        color: 'hsl(40 30% 85%)',
                      }}
                    >
                      {route.duration}
                    </span>
                  </div>

                  {/* Difficulty Badge */}
                  <div 
                    className="absolute top-3 left-3 px-3 py-1.5 rounded-lg text-xs capitalize"
                    style={{
                      fontFamily: "'Special Elite', monospace",
                      backgroundColor: difficulty.bg,
                      color: difficulty.color,
                      border: `1px solid ${difficulty.border}`,
                    }}
                  >
                    {route.difficulty}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  {/* Title */}
                  <h3 
                    className="text-xl mb-1 tracking-wide transition-colors"
                    style={{
                      fontFamily: "'Bitter', serif",
                      fontWeight: 600,
                      color: hoveredRoute === route.id ? 'hsl(35 50% 60%)' : 'hsl(40 30% 94%)',
                    }}
                  >
                    {route.title}
                  </h3>
                  
                  {/* Subtitle - handwritten */}
                  <p 
                    className="text-sm mb-3"
                    style={{ 
                      fontFamily: "'Caveat', cursive",
                      color: 'hsl(140 22% 55%)',
                      fontSize: '1rem',
                    }}
                  >
                    {route.subtitle}
                  </p>
                  
                  {/* Description */}
                  <p 
                    className="text-sm mb-4 line-clamp-2"
                    style={{
                      fontFamily: "'Libre Baskerville', Georgia, serif",
                      color: 'hsl(40 15% 55%)',
                      lineHeight: 1.7,
                    }}
                  >
                    {route.description}
                  </p>

                  {/* Key Stops - aged tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {route.keyStops.slice(0, 3).map((stop) => (
                      <span
                        key={stop}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs"
                        style={{
                          fontFamily: "'Special Elite', monospace",
                          fontSize: '10px',
                          backgroundColor: 'hsl(140 22% 42% / 0.15)',
                          color: 'hsl(140 22% 60%)',
                          border: '1px solid hsl(140 22% 42% / 0.25)',
                        }}
                      >
                        <Mountain size={10} />
                        {stop}
                      </span>
                    ))}
                    {route.keyStops.length > 3 && (
                      <span 
                        className="px-2 py-1 rounded-md text-xs"
                        style={{
                          fontFamily: "'Special Elite', monospace",
                          fontSize: '10px',
                          backgroundColor: 'hsl(35 18% 30% / 0.3)',
                          color: 'hsl(35 18% 55%)',
                        }}
                      >
                        +{route.keyStops.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Route Info */}
                  <div 
                    className="flex items-center gap-2 text-xs mb-4"
                    style={{ color: 'hsl(35 15% 50%)' }}
                  >
                    <MapPin size={12} style={{ color: 'hsl(140 22% 55%)' }} />
                    <span style={{ fontFamily: "'Special Elite', monospace" }}>{route.startLocation}</span>
                    <ChevronRight size={12} />
                    <MapPin size={12} style={{ color: 'hsl(25 40% 55%)' }} />
                    <span style={{ fontFamily: "'Special Elite', monospace" }}>{route.endLocation}</span>
                  </div>

                  {/* Action Button - vintage style */}
                  <button
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-lg transition-all duration-300"
                    style={{
                      backgroundColor: hoveredRoute === route.id ? 'hsl(25 40% 35% / 0.3)' : 'hsl(140 15% 20% / 0.3)',
                      border: hoveredRoute === route.id ? '1px solid hsl(25 40% 45% / 0.4)' : '1px solid hsl(140 15% 30% / 0.3)',
                      color: hoveredRoute === route.id ? 'hsl(25 40% 60%)' : 'hsl(40 30% 80%)',
                      fontFamily: "'Special Elite', monospace",
                    }}
                  >
                    <Compass size={14} />
                    <span className="text-sm">Plan This Journey</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* View All Routes Link */}
        <div className="text-center mt-12">
          <Link
            to="/routes"
            className="inline-flex items-center gap-2 transition-colors group arrow-animate"
            style={{ 
              color: 'hsl(140 22% 55%)',
              fontFamily: "'Bitter', serif",
            }}
          >
            <span>Explore All Soul Routes</span>
            <ChevronRight size={18} className="arrow-icon transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PopularRoutes;
