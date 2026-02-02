import { Link } from "react-router-dom";
import { ArrowRight, Mountain, Compass, Users, Leaf } from "lucide-react";
import InspirationSearch from "@/components/InspirationSearch";
import SoulQuote from "@/components/SoulQuote";
import DailySoulGem from "@/components/DailySoulGem";
import FeaturedEasternLoop from "@/components/FeaturedEasternLoop";
import RouteSuggestions from "@/components/RouteSuggestions";
import HeroSection from "@/components/HeroSection";
import JourneyPlanner from "@/components/JourneyPlanner";
import PopularRoutes from "@/components/PopularRoutes";
import WhySoulRide from "@/components/WhySoulRide";

const HomePage = () => {
  return (
    <div className="min-h-screen" style={{ background: '#0F172A' }}>
      {/* Hero Section - Minimal, premium */}
      <HeroSection />

      {/* Why SoulRide - Organic feature cards */}
      <WhySoulRide />

      {/* Journey Planner */}
      <JourneyPlanner />

      {/* Popular Routes */}
      <PopularRoutes />

      {/* Daily Soul Gem */}
      <DailySoulGem />

      {/* Soul Routes */}
      <RouteSuggestions />

      {/* Featured Eastern Loop */}
      <FeaturedEasternLoop />

      {/* Inspiration Search */}
      <InspirationSearch />

      {/* Features Section */}
      <section 
        className="py-20 sm:py-28 px-4 relative overflow-hidden"
        style={{ background: '#0F172A' }}
      >
        {/* Subtle organic background shapes */}
        <div 
          className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, hsl(160 25% 30% / 0.15) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-14 sm:mb-18">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="w-10 h-px" style={{ background: 'linear-gradient(90deg, transparent, hsl(160 25% 45% / 0.5))' }} />
              <Leaf size={18} style={{ color: 'hsl(160 30% 55%)' }} />
              <span className="w-10 h-px" style={{ background: 'linear-gradient(90deg, hsl(160 25% 45% / 0.5), transparent)' }} />
            </div>
            <h2 
              className="text-3xl sm:text-4xl md:text-5xl font-serif mb-5"
              style={{
                fontFamily: "'Playfair Display', serif",
                color: 'hsl(45 20% 90%)',
              }}
            >
              Ride with Purpose
            </h2>
            <p 
              className="max-w-xl mx-auto text-base sm:text-lg font-light leading-relaxed px-4"
              style={{ color: 'hsl(45 15% 65%)' }}
            >
              Every road tells a story. Every destination holds a secret. We map the journeys that transform travelers into explorers.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              {
                icon: Mountain,
                title: "Hidden Viewpoints",
                description: "Discover overlooks and panoramas that most maps forgot to mention. Where perspective is earned through winding roads.",
                color: "hsl(160 30% 45%)",
              },
              {
                icon: Compass,
                title: "Curated Routes",
                description: "Hand-picked roads that wind, twist, and reward. Routes chosen not for efficiency, but for the joy of the journey.",
                color: "hsl(25 40% 55%)",
              },
              {
                icon: Users,
                title: "Rider Community",
                description: "Tips and tales from souls who live for the next curve. Wisdom shared, stories exchanged, roads remembered.",
                color: "hsl(200 35% 50%)",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl p-7 sm:p-8 text-center transition-all duration-400"
                style={{
                  background: 'linear-gradient(180deg, hsl(200 10% 16%) 0%, hsl(200 12% 14%) 100%)',
                  border: '1px solid hsl(160 15% 25% / 0.2)',
                  boxShadow: '0 8px 30px -8px hsl(200 20% 8% / 0.4)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 40px -10px hsl(200 20% 8% / 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 30px -8px hsl(200 20% 8% / 0.4)';
                }}
              >
                <div 
                  className="inline-flex items-center justify-center w-14 h-14 rounded-xl mb-5 transition-transform duration-300 group-hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, ${feature.color.replace(')', ' / 0.2)')}, ${feature.color.replace(')', ' / 0.1)')})`,
                    border: `1px solid ${feature.color.replace(')', ' / 0.3)')}`,
                  }}
                >
                  <feature.icon className="w-7 h-7" style={{ color: feature.color }} />
                </div>
                <h3 
                  className="text-xl sm:text-2xl font-serif mb-3"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    color: 'hsl(45 20% 90%)',
                  }}
                >
                  {feature.title}
                </h3>
                <p 
                  className="text-sm leading-relaxed font-light"
                  style={{ color: 'hsl(45 15% 62%)' }}
                >
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Soul Quote Section */}
      <section 
        className="py-14 px-4 relative overflow-hidden"
        style={{ background: '#0F172A' }}
      >
        <div className="max-w-3xl mx-auto relative z-10">
          <SoulQuote />
        </div>
      </section>

      {/* CTA Section */}
      <section 
        className="py-20 sm:py-28 px-4 relative overflow-hidden"
        style={{ background: '#0F172A' }}
      >
        {/* Soft gradient orb */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-25"
          style={{
            background: 'radial-gradient(circle, hsl(160 25% 30% / 0.2) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        
        <div className="max-w-2xl mx-auto text-center relative z-10 px-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-8 h-px" style={{ background: 'linear-gradient(90deg, transparent, hsl(25 40% 50% / 0.5))' }} />
            <Leaf size={16} style={{ color: 'hsl(25 40% 55%)' }} />
            <span className="w-8 h-px" style={{ background: 'linear-gradient(90deg, hsl(25 40% 50% / 0.5), transparent)' }} />
          </div>
          <h2 
            className="text-3xl sm:text-4xl md:text-5xl font-serif mb-5"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: 'hsl(45 20% 90%)',
            }}
          >
            Your Journey Awaits
          </h2>
          <p 
            className="mb-10 max-w-lg mx-auto font-light leading-relaxed"
            style={{ color: 'hsl(45 15% 65%)' }}
          >
            Countless hidden spots. Endless memories waiting to be made. Where will the road take you?
          </p>
          <Link
            to="/spots"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-sm font-medium transition-all duration-400 group"
            style={{
              background: 'linear-gradient(135deg, hsl(160 25% 40%) 0%, hsl(160 20% 35%) 100%)',
              color: 'hsl(45 20% 95%)',
              boxShadow: '0 6px 25px -6px hsl(160 30% 30% / 0.4)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 10px 35px -8px hsl(160 30% 35% / 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 6px 25px -6px hsl(160 30% 30% / 0.4)';
            }}
          >
            <span>Explore All Spots</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
