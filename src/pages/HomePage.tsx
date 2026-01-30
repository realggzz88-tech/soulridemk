import { Link } from "react-router-dom";
import { ArrowRight, Mountain, Compass, Wind } from "lucide-react";
import InspirationSearch from "@/components/InspirationSearch";
import SoulQuote from "@/components/SoulQuote";
import DailySoulGem from "@/components/DailySoulGem";
import FeaturedEasternLoop from "@/components/FeaturedEasternLoop";
import RouteSuggestions from "@/components/RouteSuggestions";
import HeroCarousel from "@/components/HeroCarousel";

const HomePage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Carousel - Dynamic spot showcase */}
      <HeroCarousel />

      {/* Daily Soul Gem - Featured spot of the day */}
      <DailySoulGem />

      {/* Soul Routes - Curated journeys carousel */}
      <RouteSuggestions />

      {/* Featured Eastern Loop */}
      <FeaturedEasternLoop />

      {/* Inspiration Search Section */}
      <InspirationSearch />

      {/* Features Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-secondary/40 to-background relative overflow-hidden film-grain">
        {/* Background art */}
        <div className="absolute inset-0 road-pattern opacity-8" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-wider mb-4 text-gradient-subtle">
              RIDE WITH PURPOSE
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-high-contrast">
              Every road tells a story. Every destination holds a secret. We map the journeys that transform riders into explorers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
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
                className="feature-card p-8 text-center group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-earth-green/20 mb-6 group-hover:bg-earth-green/30 group-hover:shadow-[0_0_40px_hsl(var(--earth-green)/0.4)] transition-all duration-300">
                  <feature.icon className="w-8 h-8 text-earth-green-glow" />
                </div>
                <h3 className="font-display text-2xl tracking-wide mb-3 text-gradient-card">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed text-high-contrast">
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
      <section className="py-24 px-4 relative overflow-hidden film-grain">
        <div className="absolute inset-0 road-pattern opacity-40" />
        <div className="absolute inset-0 mountain-contours opacity-15" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-wider mb-6 text-gradient-subtle">
            YOUR NEXT ADVENTURE AWAITS
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto text-high-contrast">
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
