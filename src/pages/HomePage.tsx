import { Link } from "react-router-dom";
import { ArrowRight, Mountain, Compass, Users } from "lucide-react";
import { motion } from "framer-motion";
import DailySoulGem from "@/components/DailySoulGem";
import HeroSection from "@/components/HeroSection";
import JourneyPlanner from "@/components/JourneyPlanner";
import PopularRoutes from "@/components/PopularRoutes";
import WhySoulRide from "@/components/WhySoulRide";

const pageBg = 'hsl(222 47% 7%)';
const cardBg = 'hsl(222 35% 11%)';
const vintageTeal = 'hsl(174 72% 40%)';
const rustOrange = 'hsl(21 90% 42%)';
const creamText = 'hsl(40 20% 95%)';

const HomePage = () => {
  return (
    <div className="min-h-screen grain-overlay" style={{ background: pageBg }}>
      {/* Hero Section */}
      <HeroSection />

      {/* Why SoulRide */}
      <WhySoulRide />

      {/* Journey Planner */}
      <JourneyPlanner />

      {/* Popular Routes */}
      <PopularRoutes />

      {/* Daily Soul Gem */}
      <section 
        className="py-16 sm:py-24 px-4"
        style={{ backgroundColor: pageBg }}
      >
        <div className="max-w-7xl mx-auto">
          <DailySoulGem />
        </div>
      </section>

      {/* Features Section - vintage style */}
      <section 
        className="py-20 sm:py-28 px-4 relative overflow-hidden"
        style={{ background: cardBg }}
      >
        {/* Subtle grain overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          mixBlendMode: 'overlay'
        }} />
        
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            {/* Vintage badge */}
            <div className="inline-flex items-center gap-3 mb-4">
              <span className="w-8 h-px" style={{ background: rustOrange }} />
              <span 
                className="text-xs uppercase tracking-[0.3em] font-medium hero-subtitle-vintage"
              >
                Why Explore With Us
              </span>
              <span className="w-8 h-px" style={{ background: rustOrange }} />
            </div>
            
            <h2 
              className="font-display text-4xl sm:text-5xl md:text-6xl tracking-wider mb-5 text-distressed"
              style={{ color: creamText }}
            >
              RIDE WITH PURPOSE
            </h2>
            <p 
              className="max-w-xl mx-auto text-base sm:text-lg leading-relaxed px-4 handwriting"
              style={{ color: 'hsl(40 8% 60%)' }}
            >
              "Every road tells a story. Every destination holds a secret. We map the journeys that transform travelers into explorers."
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              {
                icon: Mountain,
                title: "Hidden Viewpoints",
                description: "Discover overlooks and panoramas that most maps forgot. Where perspective is earned through winding roads.",
                color: vintageTeal,
              },
              {
                icon: Compass,
                title: "Curated Routes",
                description: "Hand-picked roads that wind, twist, and reward. Routes chosen for the joy of the journey, not efficiency.",
                color: rustOrange,
              },
              {
                icon: Users,
                title: "Rider Community",
                description: "Tips and tales from souls who live for the next curve. Wisdom shared, stories exchanged, roads remembered.",
                color: vintageTeal,
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group rounded-xl p-7 sm:p-8 text-center transition-all duration-300 hover:-translate-y-1 vintage-card"
              >
                <div 
                  className="inline-flex items-center justify-center w-14 h-14 rounded-lg mb-5 transition-all duration-300 group-hover:scale-110"
                  style={{
                    backgroundColor: `${feature.color.replace(')', ' / 0.15)')}`,
                    border: `1px solid ${feature.color.replace(')', ' / 0.3)')}`,
                    boxShadow: `inset 0 1px 0 hsl(40 20% 95% / 0.05)`
                  }}
                >
                  <feature.icon className="w-7 h-7" style={{ color: feature.color }} />
                </div>
                <h3 
                  className="font-display text-xl sm:text-2xl tracking-wider mb-3"
                  style={{ color: creamText }}
                >
                  {feature.title.toUpperCase()}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'hsl(40 8% 55%)' }}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - vintage soul */}
      <section 
        className="py-20 sm:py-28 px-4 relative overflow-hidden"
        style={{ background: pageBg }}
      >
        {/* Vintage gradient */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{
            background: `
              radial-gradient(circle, hsl(174 72% 40% / 0.1) 0%, transparent 50%),
              radial-gradient(circle at 30% 70%, hsl(21 90% 42% / 0.06) 0%, transparent 40%)
            `,
            filter: 'blur(60px)',
          }}
        />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center relative z-10 px-4"
        >
          <h2 
            className="font-display text-4xl sm:text-5xl md:text-6xl tracking-wider mb-5 text-distressed vintage-glow"
            style={{ color: creamText }}
          >
            YOUR JOURNEY AWAITS
          </h2>
          <p 
            className="mb-10 max-w-lg mx-auto leading-relaxed handwriting"
            style={{ color: 'hsl(40 8% 60%)' }}
          >
            "Countless hidden spots. Endless memories waiting to be made. Where will the road take you?"
          </p>
          <Link
            to="/spots"
            className="arrow-animate inline-flex items-center gap-3 px-8 py-4 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-[0.98] group uppercase tracking-wider"
            style={{
              background: 'linear-gradient(135deg, hsl(174 72% 40%) 0%, hsl(180 65% 45%) 100%)',
              color: creamText,
              boxShadow: 'inset 0 2px 4px hsl(0 0% 0% / 0.3), 0 4px 20px hsl(174 72% 40% / 0.3), 0 1px 0 hsl(40 20% 95% / 0.1)',
            }}
          >
            <span>Explore All Spots</span>
            <ArrowRight size={16} className="arrow-icon transition-transform" />
          </Link>
          
          {/* Vintage quote */}
          <p 
            className="mt-12 text-sm handwriting"
            style={{ color: 'hsl(40 8% 45%)' }}
          >
            "The road is calling. Will you answer?"
          </p>
        </motion.div>
      </section>
    </div>
  );
};

export default HomePage;
