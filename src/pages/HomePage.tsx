import { Link } from "react-router-dom";
import { ArrowRight, Mountain, Compass, Wind } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import InspirationSearch from "@/components/InspirationSearch";

const HomePage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={heroBg}
            alt="Motorbike at mountain overlook"
            className="w-full h-full object-cover animate-fade-in"
          />
          <div className="absolute inset-0 bg-hero-gradient" />
          <div className="absolute inset-0 road-pattern" />
          <div className="absolute inset-0 mountain-overlay" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <h1 
            className="hero-title animate-fade-up opacity-0"
            style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
          >
            SOULRIDE
          </h1>
          <p 
            className="hero-subtitle mx-auto mb-4 animate-fade-up opacity-0"
            style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
          >
            Ride with Soul
          </p>
          <p 
            className="text-muted-foreground max-w-xl mx-auto mb-8 animate-fade-up opacity-0"
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
              className="btn-glow inline-flex items-center gap-3 px-8 py-4 bg-accent-gradient text-accent-foreground font-display text-lg tracking-wider rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_hsl(var(--amber-soul)/0.4)]"
            >
              <span>START EXPLORING</span>
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
          <div className="w-6 h-10 rounded-full border-2 border-foreground/30 flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-foreground/50 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Inspiration Search Section */}
      <InspirationSearch />

      {/* Features Section */}
      <section className="py-24 px-4 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 
              className="font-display text-4xl md:text-5xl tracking-wider mb-4"
            >
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
                className="spot-card p-8 text-center group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-earth-green/20 mb-6 group-hover:bg-earth-green/30 transition-colors duration-300">
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

      {/* CTA Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 road-pattern opacity-50" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="font-display text-4xl md:text-5xl tracking-wider mb-6">
            YOUR NEXT ADVENTURE AWAITS
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Six legendary spots. Countless memories waiting to be made. Where will the road take you?
          </p>
          <Link
            to="/spots"
            className="inline-flex items-center gap-2 text-earth-green-glow font-medium hover:text-foreground transition-colors"
          >
            <span>Explore All Spots</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
