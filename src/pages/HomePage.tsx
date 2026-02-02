import { Link } from "react-router-dom";
import { ArrowRight, Mountain, Compass, Wind } from "lucide-react";
import InspirationSearch from "@/components/InspirationSearch";
import SoulQuote from "@/components/SoulQuote";
import DailySoulGem from "@/components/DailySoulGem";
import FeaturedEasternLoop from "@/components/FeaturedEasternLoop";
import RouteSuggestions from "@/components/RouteSuggestions";
import HeroCarousel from "@/components/HeroCarousel";
import JourneyPlanner from "@/components/JourneyPlanner";
import PopularRoutes from "@/components/PopularRoutes";
import WhySoulRide from "@/components/WhySoulRide";

const HomePage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Carousel - Premium immersive showcase */}
      <HeroCarousel />

      {/* Why SoulRide - Premium feature cards */}
      <WhySoulRide />

      {/* Journey Planner - Create Your SoulRide */}
      <JourneyPlanner />

      {/* Popular Routes - Most Loved SoulRides */}
      <PopularRoutes />

      {/* Daily Soul Gem - Featured spot of the day */}
      <DailySoulGem />

      {/* Soul Routes - Curated journeys carousel */}
      <RouteSuggestions />

      {/* Featured Eastern Loop */}
      <FeaturedEasternLoop />

      {/* Inspiration Search Section */}
      <InspirationSearch />

      {/* Features Section */}
      <section className="py-20 sm:py-28 px-4 bg-gradient-to-b from-secondary/40 to-background relative overflow-hidden film-grain">
        {/* Background art */}
        <div className="absolute inset-0 road-pattern opacity-5" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12 sm:mb-20">
            <p 
              className="text-xs uppercase tracking-[0.4em] mb-4 font-medium"
              style={{ color: 'hsl(174 60% 55%)' }}
            >
              The SoulRide Way
            </p>
            <h2 
              className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-wider mb-4"
              style={{
                background: 'linear-gradient(135deg, hsl(40 15% 95%) 0%, hsl(174 50% 65%) 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              RIDE WITH PURPOSE
            </h2>
            <p className="max-w-2xl mx-auto px-4" style={{ color: 'hsl(220 10% 65%)' }}>
              Every road tells a story. Every destination holds a secret. We map the journeys that transform riders into explorers.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: Mountain,
                title: "Hidden Viewpoints",
                description: "Discover overlooks and panoramas that most maps forgot to mention. Where the world falls away and perspective is earned.",
                gradient: "from-[hsl(174_60%_45%)] to-[hsl(180_50%_35%)]",
              },
              {
                icon: Compass,
                title: "Curated Routes",
                description: "Hand-picked roads that wind, twist, and reward. Routes chosen not for efficiency, but for the joy of the journey.",
                gradient: "from-[hsl(16_85%_55%)] to-[hsl(24_90%_50%)]",
              },
              {
                icon: Wind,
                title: "Rider Community",
                description: "Tips and tales from souls who live for the next curve. Wisdom shared, stories exchanged, roads remembered.",
                gradient: "from-[hsl(200_50%_45%)] to-[hsl(174_60%_40%)]",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group relative rounded-2xl p-8 sm:p-10 text-center transition-all duration-500 hover:-translate-y-2"
                style={{
                  background: 'linear-gradient(180deg, hsl(0 0% 8%) 0%, hsl(0 0% 5%) 100%)',
                  boxShadow: '0 20px 60px -20px hsl(0 0% 0% / 0.8), inset 0 1px 0 0 hsl(0 0% 100% / 0.05)',
                }}
              >
                <div 
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${feature.gradient} mb-6 group-hover:scale-110 transition-transform duration-300`}
                  style={{ boxShadow: '0 8px 30px -8px hsl(174 50% 40% / 0.4)' }}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 
                  className="font-display text-xl sm:text-2xl tracking-wide mb-3"
                  style={{ color: 'hsl(40 15% 92%)' }}
                >
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'hsl(220 10% 60%)' }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Soul Quote Section */}
      <section className="py-12 px-4 bg-gradient-to-b from-background to-secondary/30 relative overflow-hidden">
        <div className="absolute inset-0 road-pattern opacity-5" />
        <div className="max-w-4xl mx-auto relative z-10">
          <SoulQuote />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-28 px-4 relative overflow-hidden">
        <div className="absolute inset-0 road-pattern opacity-30" />
        <div className="absolute inset-0 mountain-contours opacity-10" />
        
        {/* Gradient orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[hsl(174_60%_30%/0.08)] blur-[150px]" />
        
        <div className="max-w-3xl mx-auto text-center relative z-10 px-4">
          <p 
            className="text-xs uppercase tracking-[0.4em] mb-4 font-medium"
            style={{ color: 'hsl(16 70% 60%)' }}
          >
            Your Next Chapter Awaits
          </p>
          <h2 
            className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-wider mb-6"
            style={{
              background: 'linear-gradient(135deg, hsl(40 15% 95%) 0%, hsl(174 50% 65%) 50%, hsl(16 70% 60%) 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            YOUR ADVENTURE AWAITS
          </h2>
          <p className="mb-10 max-w-xl mx-auto" style={{ color: 'hsl(220 10% 65%)' }}>
            Ten legendary spots. Countless memories waiting to be made. Where will the road take you?
          </p>
          <Link
            to="/spots"
            className="inline-flex items-center gap-3 px-10 py-4 rounded-full font-display tracking-[0.12em] text-sm transition-all duration-300 group"
            style={{
              background: 'linear-gradient(135deg, hsl(174 60% 45%) 0%, hsl(16 80% 55%) 100%)',
              color: 'white',
              boxShadow: '0 8px 40px -10px hsl(174 60% 45% / 0.5), 0 0 60px -20px hsl(16 80% 55% / 0.4)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 12px 50px -10px hsl(174 60% 50% / 0.6), 0 0 80px -20px hsl(16 85% 60% / 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 40px -10px hsl(174 60% 45% / 0.5), 0 0 60px -20px hsl(16 80% 55% / 0.4)';
            }}
          >
            <span>EXPLORE ALL SPOTS</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
