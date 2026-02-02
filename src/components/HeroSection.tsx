import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import BikerLogo from "./BikerLogo";

const HeroSection = () => {
  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: 'hsl(222 47% 7%)' }}
    >
      {/* Subtle gradient overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, hsl(160 84% 39% / 0.08) 0%, transparent 60%)',
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

      {/* Main content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Biker Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex justify-center mb-8"
        >
          <BikerLogo size="lg" />
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold tracking-tight mb-4 text-foreground"
        >
          SoulRide
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="text-sm sm:text-base md:text-lg uppercase tracking-[0.3em] font-semibold mb-8"
          style={{ color: 'hsl(160 84% 50%)' }}
        >
          Ride With Soul
        </motion.p>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed text-muted-foreground"
        >
          Discover Macedonia's Quiet Beauties, Hidden Views, Local Flavors & Fellow Explorers
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          {/* Primary Button */}
          <Link
            to="/spots"
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-semibold transition-all duration-300 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, hsl(160 84% 39%) 0%, hsl(168 80% 42%) 100%)',
              color: 'hsl(222 47% 7%)',
              boxShadow: '0 4px 20px hsl(160 84% 39% / 0.3)',
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
              color: 'hsl(160 84% 50%)',
              border: '2px solid hsl(160 84% 39%)',
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
          background: 'linear-gradient(to top, hsl(222 47% 7%) 0%, transparent 100%)',
        }}
      />

      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div 
          className="w-6 h-10 rounded-full border-2 flex items-start justify-center pt-2 animate-bounce"
          style={{ borderColor: 'hsl(222 20% 25%)' }}
        >
          <div 
            className="w-1.5 h-2.5 rounded-full"
            style={{ backgroundColor: 'hsl(160 84% 50%)' }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
