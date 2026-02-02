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

const HomePage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Carousel - Dynamic spot showcase */}
      <HeroCarousel />

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
      <section className="py-16 sm:py-24 px-4 bg-gradient-to-b from-secondary/40 to-background relative overflow-hidden film-grain">
        {/* Background art */}
        <div className="absolute inset-0 road-pattern opacity-8" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-wider mb-3 sm:mb-4 text-gradient-subtle">
              RIDE WITH PURPOSE
            </h2>
            <p className="max-w-2xl mx-auto px-4" style={{ color: 'hsl(220 10% 75%)' }}>
              Every road tells a story. Every destination holds a secret. We map the journeys that transform riders into explorers.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {[
              {
                icon: Mountain,
                title: "Hidden Viewpoints",
                description: "Discover overlooks and panoramas that most maps forgot to mention. Where the world falls away and perspective is earned.",
              },
              {
                icon: Compass,
                title: "Curated Routes",
                description: "Hand-picked roads that wind, twist, and reward. Routes chosen not for efficiency, but for the joy of the journey.",
              },
              {
                icon: Wind,
                title: "Rider Community",
                description: "Tips and tales from souls who live for the next curve. Wisdom shared, stories exchanged, roads remembered.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="feature-card p-6 sm:p-8 text-center group"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-earth-green/20 mb-4 sm:mb-6 group-hover:bg-earth-green/30 group-hover:shadow-[0_0_40px_hsl(var(--earth-green)/0.4)] transition-all duration-300">
                  <feature.icon className="w-6 h-6 sm:w-8 sm:h-8 text-earth-green-glow" />
                </div>
                <h3 className="font-display text-xl sm:text-2xl tracking-wide mb-2 sm:mb-3 text-gradient-card">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'hsl(220 10% 72%)' }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Soul Quote Section */}
      <section className="py-8 px-4 bg-gradient-to-b from-background to-secondary/30 relative overflow-hidden">
        <div className="absolute inset-0 road-pattern opacity-8" />
        <div className="max-w-4xl mx-auto relative z-10">
          <SoulQuote />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 px-4 relative overflow-hidden film-grain">
        <div className="absolute inset-0 road-pattern opacity-40" />
        <div className="absolute inset-0 mountain-contours opacity-15" />
        <div className="max-w-3xl mx-auto text-center relative z-10 px-4">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-wider mb-4 sm:mb-6 text-gradient-subtle">
            YOUR NEXT ADVENTURE AWAITS
          </h2>
          <p className="mb-6 sm:mb-8 max-w-xl mx-auto" style={{ color: 'hsl(220 10% 72%)' }}>
            Ten legendary spots. Countless memories waiting to be made. Where will the road take you?
          </p>
          <Link
            to="/spots"
            className="inline-flex items-center gap-2 text-earth-green-glow font-medium hover:text-foreground transition-colors group"
          >
            <span>Explore All Spots</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
