import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: '#0F172A' }}
    >
      {/* Subtle gradient overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(16, 185, 129, 0.08) 0%, transparent 60%)',
        }}
      />
      
      {/* Very subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Main content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight mb-4"
          style={{
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            color: '#F8FAFC',
            letterSpacing: '-0.02em',
          }}
        >
          SoulRide
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-sm sm:text-base md:text-lg uppercase tracking-[0.3em] font-medium mb-8"
          style={{ color: '#10B981' }}
        >
          Ride With Soul
        </motion.p>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
          style={{ 
            color: '#94A3B8',
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          }}
        >
          Discover Macedonia's Quiet Beauties, Hidden Views, Local Flavors & Fellow Explorers
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          {/* Primary Button */}
          <Link
            to="/spots"
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #10B981 0%, #00D4B4 100%)',
              color: 'white',
              boxShadow: '0 4px 20px rgba(16, 185, 129, 0.3)',
              fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            }}
          >
            Start Your Journey
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* Secondary Button */}
          <Link
            to="/chat"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-semibold transition-all duration-300 hover:scale-105"
            style={{
              background: 'transparent',
              color: '#F8FAFC',
              border: '2px solid rgba(16, 185, 129, 0.5)',
              fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#10B981';
              e.currentTarget.style.background = 'rgba(16, 185, 129, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.5)';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            Join Riders
          </Link>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, #0F172A 0%, transparent 100%)',
        }}
      />
    </section>
  );
};

export default HeroSection;
