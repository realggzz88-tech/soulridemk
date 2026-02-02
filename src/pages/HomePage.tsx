import { Link } from "react-router-dom";
import { ArrowRight, Mountain, Compass, Users, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import DailySoulGem from "@/components/DailySoulGem";
import HeroSection from "@/components/HeroSection";
import JourneyPlanner from "@/components/JourneyPlanner";
import PopularRoutes from "@/components/PopularRoutes";
import WhySoulRide from "@/components/WhySoulRide";

const tealColor = 'hsl(160 84% 50%)';
const amberColor = 'hsl(38 95% 55%)';
const pageBg = 'hsl(222 47% 7%)';
const cardBg = 'hsl(222 40% 10%)';
const borderColor = 'hsl(222 20% 18%)';

const HomePage = () => {
  return (
    <div className="min-h-screen" style={{ background: pageBg }}>
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

      {/* Features Section with soul */}
      <section 
        className="py-20 sm:py-28 px-4 relative overflow-hidden pine-overlay"
        style={{ background: cardBg }}
      >
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            {/* Soul badge */}
            <div className="inline-flex items-center gap-2 mb-4">
              <Sparkles className="h-4 w-4" style={{ color: amberColor }} />
              <span 
                className="text-xs uppercase tracking-[0.3em] font-medium"
                style={{ color: tealColor }}
              >
                Why Explore With Us
              </span>
              <Sparkles className="h-4 w-4" style={{ color: amberColor }} />
            </div>
            
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-5 text-foreground">
              Ride with Purpose
            </h2>
            <p className="max-w-xl mx-auto text-base sm:text-lg text-muted-foreground leading-relaxed px-4 italic">
              "Every road tells a story. Every destination holds a secret. We map the journeys that transform travelers into explorers."
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              {
                icon: Mountain,
                title: "Hidden Viewpoints",
                description: "Discover overlooks and panoramas that most maps forgot. Where perspective is earned through winding roads.",
                color: tealColor,
              },
              {
                icon: Compass,
                title: "Curated Routes",
                description: "Hand-picked roads that wind, twist, and reward. Routes chosen for the joy of the journey, not efficiency.",
                color: amberColor,
              },
              {
                icon: Users,
                title: "Rider Community",
                description: "Tips and tales from souls who live for the next curve. Wisdom shared, stories exchanged, roads remembered.",
                color: tealColor,
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group rounded-xl p-7 sm:p-8 text-center transition-all duration-300 hover:-translate-y-1 soul-card"
              >
                <div 
                  className="inline-flex items-center justify-center w-14 h-14 rounded-xl mb-5 transition-all duration-300 group-hover:scale-110"
                  style={{
                    backgroundColor: `${feature.color.replace(')', ' / 0.15)')}`,
                    border: `1px solid ${feature.color.replace(')', ' / 0.25)')}`,
                    boxShadow: `0 0 20px ${feature.color.replace(')', ' / 0.1)')}`,
                  }}
                >
                  <feature.icon className="w-7 h-7" style={{ color: feature.color }} />
                </div>
                <h3 className="font-display text-xl sm:text-2xl font-bold tracking-tight mb-3 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section with soul */}
      <section 
        className="py-20 sm:py-28 px-4 relative overflow-hidden mountain-overlay"
        style={{ background: pageBg }}
      >
        {/* Gradient glow with warm undertones */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{
            background: `
              radial-gradient(circle, hsl(160 84% 39% / 0.15) 0%, transparent 50%),
              radial-gradient(circle at 30% 70%, hsl(38 95% 55% / 0.08) 0%, transparent 40%)
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
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-5 text-foreground soul-pulse">
            Your Journey Awaits
          </h2>
          <p className="mb-10 max-w-lg mx-auto text-muted-foreground leading-relaxed italic">
            "Countless hidden spots. Endless memories waiting to be made. Where will the road take you?"
          </p>
          <Link
            to="/spots"
            className="arrow-animate inline-flex items-center gap-3 px-8 py-4 rounded-full text-base font-semibold transition-all duration-300 hover:scale-105 group"
            style={{
              background: 'linear-gradient(135deg, hsl(160 84% 39%) 0%, hsl(168 80% 42%) 100%)',
              color: 'hsl(222 47% 7%)',
              boxShadow: '0 4px 25px hsl(160 84% 39% / 0.35)',
            }}
          >
            <span>Explore All Spots</span>
            <ArrowRight size={16} className="arrow-icon transition-transform" />
          </Link>
          
          {/* Soul quote */}
          <p className="mt-12 text-sm italic text-muted-foreground/60">
            "The road is calling. Will you answer?"
          </p>
        </motion.div>
      </section>
    </div>
  );
};

export default HomePage;
