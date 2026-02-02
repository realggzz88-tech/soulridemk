import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import BikerLogo from "./BikerLogo";

const HeroSection = () => {
  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden grain-overlay vignette"
      style={{ background: 'hsl(222 47% 7%)' }}
    >
      {/* Aged paper texture overlay */}
      <div 
        className="absolute inset-0 pointer-events-none aged-paper"
        style={{
          background: `
            radial-gradient(ellipse at center, hsl(174 72% 40% / 0.06) 0%, transparent 50%),
            radial-gradient(ellipse at 20% 80%, hsl(21 90% 42% / 0.04) 0%, transparent 40%)
          `,
        }}
      />
      
      {/* Subtle worn road pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'%3E%3Cpath d='M-100 550 Q200 400 350 300 T600 100 T900 -50' stroke='%230EA5E9' stroke-width='3' fill='none' stroke-dasharray='15,8'/%3E%3Cpath d='M-50 600 Q250 450 400 350 T700 150' stroke='%23C2410C' stroke-width='2' fill='none' opacity='0.5' stroke-dasharray='10,5'/%3E%3C/svg%3E")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Main content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Vintage Biker Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex justify-center mb-10"
        >
          <BikerLogo size="lg" />
        </motion.div>

        {/* Main headline - vintage distressed */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="hero-title-vintage text-6xl sm:text-7xl md:text-8xl lg:text-9xl mb-4 vintage-glow"
        >
          SoulRide
        </motion.h1>

        {/* Subtitle - typewriter style */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="hero-subtitle-vintage text-base sm:text-lg md:text-xl mb-10"
        >
          — Ride With Soul —
        </motion.p>

        {/* Poetic Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
          style={{ 
            color: 'hsl(40 8% 70%)',
            fontFamily: "'Inter', system-ui, sans-serif",
          }}
        >
          Discover Macedonia's Quiet Beauties, Hidden Views, Local Flavors & Fellow Explorers
        </motion.p>

        {/* CTA Buttons - vintage badge style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          {/* Primary Button - rust/teal vintage */}
          <Link
            to="/spots"
            className="group arrow-animate inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg, hsl(174 72% 40%) 0%, hsl(180 65% 45%) 100%)',
              color: 'hsl(40 20% 95%)',
              boxShadow: 'inset 0 2px 4px hsl(0 0% 0% / 0.3), 0 4px 12px hsl(174 72% 40% / 0.3), 0 1px 0 hsl(40 20% 95% / 0.1)',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontSize: '0.875rem',
            }}
          >
            Start Your Journey
            <ArrowRight size={16} className="arrow-icon transition-transform" />
          </Link>

          {/* Secondary Button - outlined vintage */}
          <Link
            to="/chat"
            className="btn-secondary-vintage"
          >
            Join Riders
          </Link>
        </motion.div>

        {/* Vintage soul quote */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="mt-16 text-sm italic handwriting"
          style={{ color: 'hsl(40 8% 55%)' }}
        >
          "The road remembers those who ride with heart"
        </motion.p>
      </div>

      {/* Bottom fade */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, hsl(222 47% 7%) 0%, transparent 100%)',
        }}
      />

      {/* Scroll indicator - vintage style */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div 
          className="w-6 h-10 rounded-full border-2 flex items-start justify-center pt-2"
          style={{ 
            borderColor: 'hsl(174 72% 40% / 0.4)',
            boxShadow: '0 0 10px hsl(174 72% 40% / 0.1)'
          }}
        >
          <motion.div 
            className="w-1.5 h-2.5 rounded-full"
            style={{ backgroundColor: 'hsl(174 72% 50%)' }}
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
