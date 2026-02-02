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
      className="py-24 px-4 relative overflow-hidden"
      style={{ backgroundColor: 'hsl(20 15% 10%)' }}
    >
      {/* Subtle glow */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, hsl(170 60% 50%) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
      
      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative p-8 md:p-12 rounded-3xl"
          style={{
            background: 'linear-gradient(180deg, hsl(20 18% 13%) 0%, hsl(25 15% 11%) 100%)',
            border: '1px solid hsl(25 15% 18%)',
            boxShadow: '0 8px 40px hsl(0 0% 0% / 0.4)',
          }}
        >
          {/* Header */}
          <div className="text-center mb-10">
            {/* Badge */}
            <div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
              style={{
                background: 'hsl(15 70% 50% / 0.12)',
                border: '1px solid hsl(15 70% 50% / 0.25)',
              }}
            >
              <Compass size={14} style={{ color: 'hsl(15 70% 55%)' }} />
              <span 
                className="text-xs tracking-[0.15em] uppercase font-medium"
                style={{ color: 'hsl(15 70% 60%)' }}
              >
                Featured Soul Route
              </span>
            </div>
            
            {/* Title */}
            <h2 
              className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4"
              style={{ color: 'hsl(0 0% 100%)' }}
            >
              Eastern Soul Loop
            </h2>
            
            {/* Quote */}
            <p 
              className="text-xl font-script max-w-2xl mx-auto"
              style={{ color: 'hsl(170 60% 55%)' }}
            >
              "Waterfalls, fortresses, and forgotten paths through Macedonia's hidden east"
            </p>
          </div>

          {/* Route visualization */}
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 mb-10">
            {/* Start point */}
            <div 
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
              style={{
                background: 'hsl(170 60% 45% / 0.12)',
                border: '1px solid hsl(170 60% 45% / 0.25)',
              }}
            >
              <MapPin size={16} style={{ color: 'hsl(170 60% 55%)' }} />
              <span 
                className="text-sm font-medium"
                style={{ color: 'hsl(0 0% 90%)' }}
              >
                Your Location
              </span>
            </div>
            
            {loopStops.map((stop, index) => (
              <div key={stop.id} className="flex items-center gap-3">
                {/* Connector */}
                <div 
                  className="w-8 h-px hidden md:block"
                  style={{ 
                    background: 'linear-gradient(90deg, hsl(15 70% 50% / 0.3), hsl(15 70% 50% / 0.5))',
                  }}
                />
                <ArrowRight size={14} className="md:hidden" style={{ color: 'hsl(30 10% 50%)' }} />
                
                <Link
                  to={`/spots/${stop.id}`}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 hover:-translate-y-0.5 group"
                  style={{
                    background: 'hsl(15 70% 50% / 0.1)',
                    border: '1px solid hsl(15 70% 50% / 0.2)',
                  }}
                >
                  <stop.icon size={16} style={{ color: 'hsl(15 70% 55%)' }} />
                  <span 
                    className="text-sm font-medium group-hover:text-white transition-colors"
                    style={{ color: 'hsl(30 15% 80%)' }}
                  >
                    {stop.name}
                  </span>
                </Link>
                
                {index < loopStops.length - 1 && (
                  <div 
                    className="w-8 h-px hidden md:block"
                    style={{ 
                      background: 'linear-gradient(90deg, hsl(15 70% 50% / 0.5), hsl(15 70% 50% / 0.3))',
                    }}
                  />
                )}
              </div>
            ))}
            
            {/* End point */}
            <ArrowRight size={14} className="hidden md:block" style={{ color: 'hsl(30 10% 50%)' }} />
            <div 
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
              style={{
                background: 'hsl(170 60% 45% / 0.12)',
                border: '1px solid hsl(170 60% 45% / 0.25)',
              }}
            >
              <MapPin size={16} style={{ color: 'hsl(170 60% 55%)' }} />
              <span 
                className="text-sm font-medium"
                style={{ color: 'hsl(0 0% 90%)' }}
              >
                Back Home
              </span>
            </div>
          </div>

          {/* Description */}
          <p 
            className="text-center max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{ color: 'hsl(30 10% 60%)' }}
          >
            A full-day adventure through Macedonia's hidden east. Start from your location, climb to the ancient fortress ruins of Carevi Kuli,
            then descend through lush Belasica hills to discover the cascading beauty of Kolesino and Smolare waterfalls.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-12 mb-10">
            {[
              { value: "~65 km", label: "Total Distance", color: 'hsl(15 70% 55%)' },
              { value: "4-5 hrs", label: "Scenic Pace", color: 'hsl(170 60% 55%)' },
              { value: "3 Stops", label: "Soul Spots", color: 'hsl(0 0% 100%)' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div 
                  className="text-3xl font-bold mb-1"
                  style={{ color: stat.color }}
                >
                  {stat.value}
                </div>
                <div 
                  className="text-xs tracking-wider uppercase"
                  style={{ color: 'hsl(30 10% 50%)' }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link
              to="/spots"
              className="btn-primary inline-flex items-center gap-2 arrow-animate group"
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
