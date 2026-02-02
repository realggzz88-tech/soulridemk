import { Link } from "react-router-dom";
import { ArrowRight, Mountain, Compass, Users, Flame, MapPin, Wind } from "lucide-react";
import { motion } from "framer-motion";
import DailySoulGem from "@/components/DailySoulGem";
import HeroSection from "@/components/HeroSection";
import JourneyPlanner from "@/components/JourneyPlanner";
import PopularRoutes from "@/components/PopularRoutes";
import WhySoulRide from "@/components/WhySoulRide";

const HomePage = () => {
  return (
    <div className="min-h-screen grain-overlay" style={{ background: 'hsl(200 20% 8%)' }}>
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
        className="py-16 sm:py-24 px-4 pine-scatter"
        style={{ backgroundColor: 'hsl(200 20% 8%)' }}
      >
        <div className="max-w-7xl mx-auto">
          <DailySoulGem />
        </div>
      </section>

      {/* Features Section - natural soul */}
      <section 
        className="py-20 sm:py-28 px-4 relative overflow-hidden aged-parchment"
        style={{ background: 'hsl(180 15% 10%)' }}
      >
        {/* Subtle grain */}
        <div className="absolute inset-0 opacity-[0.08]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grain)'/%3E%3C/svg%3E")`,
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
            {/* Natural divider */}
            <div className="inline-flex items-center gap-4 mb-5">
              <span className="w-12 h-px" style={{ background: 'hsl(20 45% 38%)' }} />
              <Wind className="w-5 h-5" style={{ color: 'hsl(140 22% 50%)' }} />
              <span className="w-12 h-px" style={{ background: 'hsl(20 45% 38%)' }} />
            </div>
            
            <h2 
              className="font-display text-3xl sm:text-4xl md:text-5xl tracking-wider mb-5"
              style={{ 
                color: 'hsl(40 30% 92%)',
                textShadow: '2px 2px 0 hsl(0 0% 0% / 0.4)'
              }}
            >
              RIDE WITH PURPOSE
            </h2>
            <p 
              className="max-w-xl mx-auto text-base sm:text-lg leading-relaxed px-4 handwriting text-xl"
              style={{ color: 'hsl(35 20% 55%)' }}
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
                color: 'hsl(140 22% 42%)',
              },
              {
                icon: Compass,
                title: "Curated Routes",
                description: "Hand-picked roads that wind, twist, and reward. Routes chosen for the joy of the journey, not efficiency.",
                color: 'hsl(20 45% 42%)',
              },
              {
                icon: Users,
                title: "Rider Brotherhood",
                description: "Tips and tales from souls who live for the next curve. Wisdom shared, stories exchanged, roads remembered.",
                color: 'hsl(140 22% 42%)',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                className="group rounded-xl p-7 sm:p-8 text-center transition-all duration-300 hover:-translate-y-2 vintage-card"
              >
                <div 
                  className="inline-flex items-center justify-center w-14 h-14 rounded-lg mb-5 transition-all duration-300 group-hover:scale-110"
                  style={{
                    backgroundColor: `${feature.color.replace(')', ' / 0.12)')}`,
                    border: `1px solid ${feature.color.replace(')', ' / 0.25)')}`,
                  }}
                >
                  <feature.icon className="w-7 h-7" style={{ color: feature.color }} />
                </div>
                <h3 
                  className="font-display text-lg sm:text-xl tracking-wider mb-3"
                  style={{ color: 'hsl(40 30% 92%)' }}
                >
                  {feature.title.toUpperCase()}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'hsl(35 15% 50%)' }}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - soul deep */}
      <section 
        className="py-20 sm:py-28 px-4 relative overflow-hidden road-dust"
        style={{ background: 'hsl(200 20% 8%)' }}
      >
        {/* Natural gradient glow */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full"
          style={{
            background: `
              radial-gradient(circle, hsl(140 22% 42% / 0.08) 0%, transparent 45%),
              radial-gradient(circle at 35% 65%, hsl(25 40% 38% / 0.05) 0%, transparent 35%)
            `,
            filter: 'blur(80px)',
          }}
        />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center relative z-10 px-4"
        >
          <div className="inline-flex items-center gap-3 mb-6">
            <Flame className="w-5 h-5" style={{ color: 'hsl(25 45% 45%)' }} />
            <MapPin className="w-4 h-4" style={{ color: 'hsl(140 22% 50%)' }} />
          </div>
          
          <h2 
            className="font-display text-3xl sm:text-4xl md:text-5xl tracking-wider mb-5 vintage-pulse"
            style={{ 
              color: 'hsl(40 30% 92%)',
              textShadow: '2px 2px 0 hsl(0 0% 0% / 0.4)'
            }}
          >
            YOUR JOURNEY AWAITS
          </h2>
          <p 
            className="mb-12 max-w-lg mx-auto leading-relaxed handwriting text-xl"
            style={{ color: 'hsl(35 20% 55%)' }}
          >
            "Countless hidden spots. Endless memories waiting to be made. Where will the road take you?"
          </p>
          <Link
            to="/spots"
            className="btn-rust arrow-animate inline-flex items-center gap-3 group"
          >
            <span>Explore All Spots</span>
            <ArrowRight size={16} className="arrow-icon transition-transform" />
          </Link>
          
          {/* Soul quote */}
          <p 
            className="mt-16 typewriter text-sm"
            style={{ color: 'hsl(35 12% 40%)' }}
          >
            "The road is calling. Will you answer?"
          </p>
        </motion.div>
      </section>
    </div>
  );
};

export default HomePage;
