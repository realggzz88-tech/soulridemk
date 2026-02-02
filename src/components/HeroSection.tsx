import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import BikerLogo from "./BikerLogo";

const HeroSection = () => {
  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden grain-overlay mountain-mist"
      style={{ background: 'linear-gradient(180deg, hsl(200 20% 8%) 0%, hsl(180 15% 10%) 50%, hsl(25 15% 11%) 100%)' }}
    >
      {/* Aged parchment texture overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at center, hsl(140 22% 42% / 0.05) 0%, transparent 50%),
            radial-gradient(ellipse at 25% 75%, hsl(25 40% 35% / 0.04) 0%, transparent 40%),
            radial-gradient(ellipse at 80% 20%, hsl(35 35% 48% / 0.03) 0%, transparent 35%)
          `,
        }}
      />
      
      {/* Subtle road/horizon pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'%3E%3Cpath d='M-100 520 Q200 380 350 280 T600 100 T850 -30' stroke='%235F7A6A' stroke-width='3' fill='none' stroke-dasharray='20,10'/%3E%3Cpath d='M-50 580 Q250 420 400 320 T700 140' stroke='%238B7355' stroke-width='2' fill='none' opacity='0.6' stroke-dasharray='15,8'/%3E%3C/svg%3E")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Main content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Soulful Biker Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex justify-center mb-12"
        >
          <BikerLogo size="lg" />
        </motion.div>

        {/* Main headline - letterpress soul */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="hero-title-soul text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-6 vintage-pulse"
        >
          SoulRide
        </motion.h1>

        {/* Handwritten tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          className="hero-subtitle-soul text-xl sm:text-2xl md:text-3xl mb-8"
        >
          Where the road meets the soul... Macedonia calls
        </motion.p>

        {/* Poetic Tagline - vintage serif */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
          className="text-base sm:text-lg max-w-2xl mx-auto mb-14 leading-relaxed"
          style={{ 
            color: 'hsl(35 18% 60%)',
            fontFamily: "'Libre Baskerville', Georgia, serif",
          }}
        >
          Discover quiet beauties, hidden views, honest flavors & kindred spirits on Macedonia's forgotten roads
        </motion.p>

        {/* CTA Buttons - stitched leather/metal feel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center justify-center gap-5"
        >
          {/* Primary Button */}
          <Link
            to="/spots"
            className="btn-soul-primary arrow-animate group"
          >
            Start Your Journey
            <ArrowRight size={16} className="arrow-icon transition-transform" />
          </Link>

          {/* Secondary Button */}
          <Link
            to="/chat"
            className="btn-soul-secondary"
          >
            Join the Brotherhood
          </Link>
        </motion.div>

        {/* Soul quote - handwritten */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 1 }}
          className="mt-20 handwriting text-lg"
          style={{ color: 'hsl(35 15% 45%)' }}
        >
          "The road remembers those who ride with heart"
        </motion.p>
      </div>

      {/* Sepia horizon glow at bottom */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, hsl(25 20% 10% / 0.5) 0%, transparent 100%)',
        }}
      />

      {/* Scroll indicator - natural style */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div 
          className="w-6 h-10 rounded-full border-2 flex items-start justify-center pt-2"
          style={{ 
            borderColor: 'hsl(140 22% 42% / 0.35)',
          }}
        >
          <motion.div 
            className="w-1.5 h-2.5 rounded-full"
            style={{ backgroundColor: 'hsl(140 22% 50%)' }}
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
