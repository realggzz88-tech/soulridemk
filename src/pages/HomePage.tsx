import { Link } from "react-router-dom";
import { ArrowRight, Mountain, Compass, Wind } from "lucide-react";
import InspirationSearch from "@/components/InspirationSearch";
import SoulQuote from "@/components/SoulQuote";
import DailySoulGem from "@/components/DailySoulGem";
import FeaturedEasternLoop from "@/components/FeaturedEasternLoop";

const HomePage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden road-particles">
        {/* Background Image - cinematic moody shot */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80"
            alt="Motorbike on misty mountain road at dusk"
            className="w-full h-full object-cover animate-fade-in"
            style={{ 
              objectPosition: 'center 40%',
              filter: 'brightness(0.7) contrast(1.1) saturate(0.9)'
            }}
          />
          
          {/* Multiple gradient overlays for depth - intensified */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/30 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-midnight-blue/40 via-transparent to-deep-forest/30" />
          <div className="absolute inset-0 hero-vignette" />
          
          {/* Artistic line art overlay */}
          <div className="absolute inset-0 road-art-overlay opacity-40" />
          <div className="absolute inset-0 mountain-contours opacity-25" />
          
          {/* Fog/mist effect */}
          <div className="absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-t from-background via-background/90 to-transparent" />
          <div className="absolute inset-0 fog-overlay" />
          
          {/* Film grain overlay */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          {/* Glowing title with gradient text */}
          <h1 
            className="hero-title-glow animate-fade-up opacity-0"
            style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
          >
            SOULRIDE
          </h1>
          <p 
            className="hero-subtitle-glow mx-auto mb-4 animate-fade-up opacity-0"
            style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
          >
            Ride with Soul
          </p>
          <p 
            className="text-foreground/80 max-w-2xl mx-auto mb-4 animate-fade-up opacity-0 text-lg md:text-xl font-light tracking-wider text-high-contrast"
            style={{ 
              animationDelay: "0.5s", 
              animationFillMode: "forwards",
              textShadow: '0 2px 10px hsl(0 0% 0% / 0.4)'
            }}
          >
            Ride with soul across North Macedonia: From eastern waterfalls to western lakes – twisty roads, hidden gems, and views that call you
          </p>
          <p 
            className="text-muted-foreground max-w-lg mx-auto mb-10 animate-fade-up opacity-0 text-sm md:text-base font-light tracking-wide"
            style={{ 
              animationDelay: "0.55s", 
              animationFillMode: "forwards",
              textShadow: '0 1px 6px hsl(0 0% 0% / 0.3)'
            }}
          >
            <span className="text-soul-amber">Start from your location</span> – enable GPS for routes to nearby soul spots across the country
          </p>
          <div 
            className="animate-fade-up opacity-0"
            style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}
          >
            <Link
              to="/spots"
              className="btn-glow inline-flex items-center gap-3 px-12 py-5 text-lg font-display tracking-widest rounded-xl transition-all duration-300 hover:scale-105 group"
              style={{
                background: "linear-gradient(135deg, hsl(215 40% 20%) 0%, hsl(160 40% 25%) 50%, hsl(32 70% 45%) 100%)",
                color: "hsl(40 15% 96%)",
                boxShadow: "0 4px 40px -5px hsl(160 40% 28% / 0.5), 0 0 60px -10px hsl(32 85% 52% / 0.3), inset 0 1px 0 0 hsl(160 50% 50% / 0.3)",
              }}
            >
              <span>START EXPLORING</span>
              <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
          <div className="w-6 h-10 rounded-full border-2 border-foreground/40 flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-foreground/60 rounded-full animate-pulse" />
          </div>
        </div>

        {/* Corner decorative elements */}
        <div className="absolute top-20 left-8 w-32 h-32 border-l-2 border-t-2 border-earth-green/25 rounded-tl-3xl opacity-60 hidden md:block" />
        <div className="absolute bottom-32 right-8 w-32 h-32 border-r-2 border-b-2 border-amber-soul/25 rounded-br-3xl opacity-60 hidden md:block" />
        
        {/* Animated road line at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-px road-line-anim" />
      </section>

      {/* Daily Soul Gem - Featured spot of the day */}
      <DailySoulGem />

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
