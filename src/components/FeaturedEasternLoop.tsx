import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Mountain, Droplets, Compass } from "lucide-react";
import { motion } from "framer-motion";

const FeaturedEasternLoop = () => {
  const loopStops = [
    { id: "carevi-kuli", name: "Carevi Kuli", icon: Mountain },
    { id: "kolesino-waterfall", name: "Kolesino Falls", icon: Droplets },
    { id: "smolare-waterfall", name: "Smolare Falls", icon: Droplets },
  ];

  return (
    <section 
      className="py-20 px-4 relative overflow-hidden grain-overlay"
      style={{ 
        background: 'linear-gradient(180deg, hsl(200 20% 8%) 0%, hsl(180 15% 10%) 50%, hsl(25 12% 10%) 100%)' 
      }}
    >
      {/* Aged paper texture */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Coffee stain accents */}
      <div 
        className="absolute top-20 right-10 w-32 h-32 rounded-full opacity-[0.03] pointer-events-none"
        style={{ background: 'radial-gradient(circle, hsl(25 40% 35%) 0%, transparent 70%)' }}
      />
      
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Vintage Scrapbook Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative p-8 md:p-12 rounded-xl"
          style={{
            backgroundColor: 'hsl(180 12% 11%)',
            border: '1px solid hsl(140 15% 25% / 0.4)',
            boxShadow: '0 8px 40px hsl(0 0% 0% / 0.4), inset 0 1px 0 hsl(40 30% 90% / 0.03)',
          }}
        >
          {/* Decorative worn corners */}
          <div 
            className="absolute top-0 left-0 w-20 h-20 pointer-events-none"
            style={{
              borderLeft: '3px solid hsl(140 22% 42% / 0.3)',
              borderTop: '3px solid hsl(140 22% 42% / 0.3)',
              borderRadius: '8px 0 0 0',
            }}
          />
          <div 
            className="absolute bottom-0 right-0 w-20 h-20 pointer-events-none"
            style={{
              borderRight: '3px solid hsl(25 40% 40% / 0.3)',
              borderBottom: '3px solid hsl(25 40% 40% / 0.3)',
              borderRadius: '0 0 8px 0',
            }}
          />
          
          {/* Brass rivet decoration */}
          <div className="absolute top-4 left-4 w-3 h-3 rounded-full" style={{ background: 'linear-gradient(135deg, hsl(35 50% 55%) 0%, hsl(30 40% 35%) 100%)' }} />
          <div className="absolute top-4 right-4 w-3 h-3 rounded-full" style={{ background: 'linear-gradient(135deg, hsl(35 50% 55%) 0%, hsl(30 40% 35%) 100%)' }} />
          <div className="absolute bottom-4 left-4 w-3 h-3 rounded-full" style={{ background: 'linear-gradient(135deg, hsl(35 50% 55%) 0%, hsl(30 40% 35%) 100%)' }} />
          <div className="absolute bottom-4 right-4 w-3 h-3 rounded-full" style={{ background: 'linear-gradient(135deg, hsl(35 50% 55%) 0%, hsl(30 40% 35%) 100%)' }} />
          
          {/* Header */}
          <div className="text-center mb-10">
            {/* Typewriter badge */}
            <div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg mb-6"
              style={{
                backgroundColor: 'hsl(25 40% 35% / 0.2)',
                border: '1px dashed hsl(25 40% 45% / 0.4)',
              }}
            >
              <Compass size={14} style={{ color: 'hsl(25 40% 55%)' }} />
              <span 
                className="text-xs tracking-[0.15em] uppercase"
                style={{ 
                  fontFamily: "'Special Elite', monospace",
                  color: 'hsl(25 40% 60%)',
                }}
              >
                Featured Soul Route
              </span>
            </div>
            
            {/* Title - distressed slab */}
            <h2 
              className="text-3xl md:text-4xl lg:text-5xl mb-4 tracking-wider"
              style={{
                fontFamily: "'Bitter', 'Rockwell', Georgia, serif",
                fontWeight: 700,
                color: 'hsl(40 30% 94%)',
                textShadow: '2px 2px 0 hsl(0 0% 0% / 0.4)',
              }}
            >
              EASTERN SOUL LOOP
            </h2>
            
            {/* Handwritten quote */}
            <p 
              className="text-lg md:text-xl italic max-w-2xl mx-auto"
              style={{ 
                fontFamily: "'Caveat', cursive",
                color: 'hsl(140 22% 55%)',
                lineHeight: 1.6,
              }}
            >
              "Waterfalls, fortresses, and forgotten paths through Macedonia's hidden east"
            </p>
          </div>

          {/* Route visualization - vintage style */}
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 mb-10">
            {/* Start point */}
            <div 
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg"
              style={{
                backgroundColor: 'hsl(140 22% 42% / 0.15)',
                border: '1px solid hsl(140 22% 42% / 0.3)',
              }}
            >
              <MapPin size={16} style={{ color: 'hsl(140 22% 55%)' }} />
              <span 
                className="text-sm tracking-wide"
                style={{ 
                  fontFamily: "'Special Elite', monospace",
                  color: 'hsl(40 30% 85%)',
                }}
              >
                Your Location
              </span>
            </div>
            
            {loopStops.map((stop, index) => (
              <div key={stop.id} className="flex items-center gap-3">
                {/* Dashed connector */}
                <div 
                  className="w-8 h-px hidden md:block"
                  style={{ 
                    background: 'repeating-linear-gradient(90deg, hsl(140 22% 42% / 0.5), hsl(140 22% 42% / 0.5) 4px, transparent 4px, transparent 8px)',
                  }}
                />
                <ArrowRight size={14} className="md:hidden" style={{ color: 'hsl(35 18% 50%)' }} />
                
                <Link
                  to={`/spots/${stop.id}`}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-300 hover:-translate-y-0.5 group"
                  style={{
                    backgroundColor: 'hsl(25 40% 35% / 0.15)',
                    border: '1px solid hsl(25 40% 40% / 0.3)',
                  }}
                >
                  <stop.icon size={16} style={{ color: 'hsl(25 40% 55%)' }} />
                  <span 
                    className="text-sm tracking-wide group-hover:text-amber-400 transition-colors"
                    style={{ 
                      fontFamily: "'Special Elite', monospace",
                      color: 'hsl(40 30% 80%)',
                    }}
                  >
                    {stop.name}
                  </span>
                </Link>
                
                {index < loopStops.length - 1 && (
                  <div 
                    className="w-8 h-px hidden md:block"
                    style={{ 
                      background: 'repeating-linear-gradient(90deg, hsl(25 40% 45% / 0.5), hsl(25 40% 45% / 0.5) 4px, transparent 4px, transparent 8px)',
                    }}
                  />
                )}
              </div>
            ))}
            
            {/* End point */}
            <ArrowRight size={14} className="hidden md:block" style={{ color: 'hsl(35 18% 50%)' }} />
            <div 
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg"
              style={{
                backgroundColor: 'hsl(140 22% 42% / 0.15)',
                border: '1px solid hsl(140 22% 42% / 0.3)',
              }}
            >
              <MapPin size={16} style={{ color: 'hsl(140 22% 55%)' }} />
              <span 
                className="text-sm tracking-wide"
                style={{ 
                  fontFamily: "'Special Elite', monospace",
                  color: 'hsl(40 30% 85%)',
                }}
              >
                Back Home
              </span>
            </div>
          </div>

          {/* Description - vintage body text */}
          <p 
            className="text-center max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{
              fontFamily: "'Libre Baskerville', Georgia, serif",
              color: 'hsl(40 15% 55%)',
              lineHeight: 1.8,
            }}
          >
            A full-day adventure through Macedonia's hidden east. Start from your location, climb to the ancient fortress ruins of Carevi Kuli,
            then descend through lush Belasica hills to discover the cascading beauty of Kolesino and Smolare waterfalls. 
            Return as the sun sets over the valley – forever changed.
          </p>

          {/* Stats - worn metal plaques */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-10 mb-10">
            {[
              { value: "~65 km", label: "Total Distance", color: 'hsl(25 40% 55%)' },
              { value: "4-5 hrs", label: "Scenic Pace", color: 'hsl(140 22% 55%)' },
              { value: "3 Stops", label: "Soul Spots", color: 'hsl(40 30% 80%)' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div 
                  className="text-2xl md:text-3xl font-bold mb-1"
                  style={{ 
                    fontFamily: "'Bitter', serif",
                    color: stat.color,
                  }}
                >
                  {stat.value}
                </div>
                <div 
                  className="text-xs tracking-[0.1em] uppercase"
                  style={{ 
                    fontFamily: "'Special Elite', monospace",
                    color: 'hsl(35 15% 45%)',
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* CTA - stitched leather button */}
          <div className="text-center">
            <Link
              to="/spots"
              className="btn-soul-primary inline-flex items-center gap-2 arrow-animate group"
            >
              <span>Explore Eastern Gems</span>
              <ArrowRight size={16} className="arrow-icon transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedEasternLoop;
