import { Link } from "react-router-dom";
import { ArrowRight, Mountain, Compass, Wind } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import InspirationSearch from "@/components/InspirationSearch";
import SoulQuote from "@/components/SoulQuote";

const HomePage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with enhanced overlay */}
        <div className="absolute inset-0">
          <img
            src={heroBg}
            alt="Motorbike at mountain overlook"
            className="w-full h-full object-cover animate-fade-in scale-105"
          />
          {/* Multiple gradient overlays for depth */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/40 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-deep-forest/30 via-transparent to-mountain-blue/20" />
          <div className="absolute inset-0 hero-vignette" />
          
          {/* Artistic line art overlay */}
          <div className="absolute inset-0 road-art-overlay opacity-30" />
          <div className="absolute inset-0 mountain-contours opacity-20" />
          
          {/* Fog/mist effect */}
          <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 fog-overlay" />
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
            className="text-foreground/70 max-w-xl mx-auto mb-8 animate-fade-up opacity-0 text-lg font-light tracking-wide"
            style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}
          >
            Uncover hidden views, twisty roads, and serene gems that stir the soul
          </p>
          <div 
            className="animate-fade-up opacity-0"
            style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}
          >
            <Link
              to="/spots"
              className="btn-glow inline-flex items-center gap-3 px-10 py-5 text-lg font-display tracking-wider rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_50px_hsl(var(--earth-green)/0.4),0_0_80px_hsl(var(--amber-soul)/0.3)]"
              style={{
                background: "linear-gradient(135deg, hsl(160 35% 30%) 0%, hsl(210 30% 35%) 50%, hsl(160 35% 25%) 100%)",
                color: "hsl(40 20% 95%)",
                boxShadow: "0 4px 30px -5px hsl(160 35% 30% / 0.4), inset 0 1px 0 0 hsl(160 40% 50% / 0.3)",
              }}
            >
              <span>START EXPLORING</span>
              <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
          <div className="w-6 h-10 rounded-full border-2 border-foreground/30 flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-foreground/50 rounded-full animate-pulse" />
          </div>
        </div>

        {/* Corner decorative elements */}
        <div className="absolute top-20 left-8 w-32 h-32 border-l-2 border-t-2 border-earth-green/20 rounded-tl-3xl opacity-50" />
        <div className="absolute bottom-32 right-8 w-32 h-32 border-r-2 border-b-2 border-amber-soul/20 rounded-br-3xl opacity-50" />
      </section>

      {/* Inspiration Search Section */}
      <InspirationSearch />

      {/* Features Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-secondary/30 to-background relative overflow-hidden">
        {/* Background art */}
        <div className="absolute inset-0 road-pattern opacity-10" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl tracking-wider mb-4 text-gradient-subtle">
              RIDE WITH PURPOSE
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
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
            ].map((feature, index) => (
              <div
                key={feature.title}
                className="feature-card p-8 text-center group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-earth-green/20 mb-6 group-hover:bg-earth-green/30 group-hover:shadow-[0_0_30px_hsl(var(--earth-green)/0.3)] transition-all duration-300">
                  <feature.icon className="w-8 h-8 text-earth-green-glow" />
                </div>
                <h3 className="font-display text-2xl tracking-wide mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Soul Quote Section */}
      <section className="py-8 px-4 bg-gradient-to-b from-background to-secondary/20 relative overflow-hidden">
        <div className="absolute inset-0 road-pattern opacity-10" />
        <div className="max-w-4xl mx-auto relative z-10">
          <SoulQuote />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 road-pattern opacity-50" />
        <div className="absolute inset-0 mountain-contours opacity-10" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="font-display text-4xl md:text-5xl tracking-wider mb-6 text-gradient-subtle">
            YOUR NEXT ADVENTURE AWAITS
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
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
