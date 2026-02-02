import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import BikerLogo from "./BikerLogo";

const HeroSection = () => {
  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden mountain-overlay"
      style={{ background: 'hsl(222 47% 7%)' }}
    >
      {/* Subtle gradient overlay with warm undertones */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at center, hsl(160 84% 39% / 0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 20% 80%, hsl(38 95% 55% / 0.04) 0%, transparent 40%),
            radial-gradient(ellipse at 80% 20%, hsl(215 50% 55% / 0.03) 0%, transparent 45%)
          `,
        }}
      />
      
      {/* Very subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(hsl(0 0% 100% / 0.1) 1px, transparent 1px),
            linear-gradient(90deg, hsl(0 0% 100% / 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
      
      {/* Faint road curve overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'%3E%3Cpath d='M-100 550 Q200 400 350 300 T600 100 T900 -50' stroke='%2310B981' stroke-width='2' fill='none'/%3E%3Cpath d='M-50 600 Q250 450 400 350 T700 150' stroke='%23D97706' stroke-width='1' fill='none' opacity='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Main content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Biker Logo with breathing animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex justify-center mb-8"
        >
          <div className="breathe">
            <BikerLogo size="lg" />
          </div>
        </motion.div>

        {/* Main headline with soul pulse */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold tracking-tight mb-4 text-foreground soul-pulse"
        >
          SoulRide
        </motion.h1>

        {/* Subtitle with italic soul styling */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="hero-subtitle-soul mb-10"
        >
          Ride With Soul
        </motion.p>

        {/* Poetic Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed text-muted-foreground"
        >
          Chase Macedonia's Quiet Wonders, Hidden Roads, Honest Flavors & Kindred Spirits
        </motion.p>

        {/* CTA Buttons with soul animations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          {/* Primary Button with animated arrow */}
          <Link
            to="/spots"
            className="group arrow-animate inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-semibold transition-all duration-300 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, hsl(160 84% 39%) 0%, hsl(168 80% 42%) 100%)',
              color: 'hsl(222 47% 7%)',
              boxShadow: '0 4px 20px hsl(160 84% 39% / 0.3)',
            }}
          >
            Start Your Journey
            <ArrowRight size={18} className="arrow-icon transition-transform" />
          </Link>

          {/* Secondary Button with leaf swirl */}
          <Link
            to="/chat"
            className="btn-soul-secondary"
          >
            Join Riders
          </Link>
        </motion.div>

        {/* Soul quote */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="mt-16 text-sm italic text-muted-foreground/70"
        >
          "The road remembers those who ride with heart"
        </motion.p>
      </div>

      {/* Bottom fade with warm undertone */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, hsl(222 47% 7%) 0%, transparent 100%)',
        }}
      />

      {/* Scroll indicator with gentle pulse */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div 
          className="w-6 h-10 rounded-full border-2 flex items-start justify-center pt-2 glow-soft"
          style={{ borderColor: 'hsl(160 84% 39% / 0.4)' }}
        >
          <motion.div 
            className="w-1.5 h-2.5 rounded-full"
            style={{ backgroundColor: 'hsl(160 84% 50%)' }}
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;