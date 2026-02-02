import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Mountain, 
  Users, 
  Compass, 
  Globe, 
  ArrowRight,
  Wine,
  Camera,
  Map
} from "lucide-react";
import { cn } from "@/lib/utils";
import { spots } from "@/data/spots";

// Featured spots for the beauties carousel
const featuredSpots = [
  spots.find(s => s.id === "st-jovan-kaneo-overlook"),
  spots.find(s => s.id === "matka-canyon-overlook"),
  spots.find(s => s.id === "galicica-pass"),
  spots.find(s => s.id === "mavrovo-lake-loop"),
].filter(Boolean);

const WhySoulRide = () => {
  const [activeBeauty, setActiveBeauty] = useState(0);

  const features = [
    {
      icon: Mountain,
      title: "Epic Macedonian Beauties",
      description: "From Lake Ohrid's timeless shores to Galicica's serpentine passes — discover landscapes that steal your breath and feed your soul.",
      color: "from-[hsl(174_60%_45%)] to-[hsl(180_50%_35%)]",
      glowColor: "hsl(174 60% 45% / 0.4)",
      hasCarousel: true,
    },
    {
      icon: Users,
      title: "Global Rider Community",
      description: "Connect with passionate riders from 50+ countries. Share routes, photos, and stories in themed chat rooms — from Motorbike Riders to Scenic Drivers.",
      color: "from-[hsl(16_85%_55%)] to-[hsl(24_90%_50%)]",
      glowColor: "hsl(16 85% 55% / 0.4)",
      link: "/chat",
      linkText: "Join Community",
    },
    {
      icon: Compass,
      title: "Travel & Explore",
      description: "Custom journey planner with hidden gems, canyon viewpoints, traditional konobas, and award-winning wineries — all mapped for the soulful explorer.",
      color: "from-[hsl(200_50%_45%)] to-[hsl(174_60%_40%)]",
      glowColor: "hsl(200 50% 45% / 0.4)",
      extras: [
        { icon: Wine, text: "Wineries" },
        { icon: Camera, text: "Hidden Gems" },
        { icon: Map, text: "Scenic Routes" },
      ],
    },
    {
      icon: Globe,
      title: "Global Soul Seekers",
      description: "Join thousands of adventurers discovering the untouched beauty of North Macedonia — the Balkans' best-kept secret.",
      color: "from-[hsl(260_50%_55%)] to-[hsl(280_60%_45%)]",
      glowColor: "hsl(260 50% 55% / 0.4)",
      stats: [
        { value: "10K+", label: "Riders" },
        { value: "50+", label: "Countries" },
        { value: "100+", label: "Routes" },
      ],
    },
  ];

  return (
    <section className="relative py-20 sm:py-32 px-4 overflow-hidden">
      {/* Deep gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-[hsl(220_20%_6%)] to-background" />
      
      {/* Animated gradient orbs */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-[hsl(174_60%_30%/0.08)] blur-[150px] animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-[hsl(16_70%_40%/0.06)] blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      
      {/* Content */}
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20">
          <p 
            className="text-xs sm:text-sm uppercase tracking-[0.4em] mb-4 font-medium"
            style={{ color: 'hsl(174 60% 55%)' }}
          >
            Why Choose SoulRide
          </p>
          <h2 
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-wider mb-6"
            style={{
              background: 'linear-gradient(135deg, hsl(40 15% 95%) 0%, hsl(174 50% 65%) 50%, hsl(16 70% 60%) 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 4px 30px hsl(174 50% 40% / 0.3))',
            }}
          >
            THE SOUL OF MACEDONIA
          </h2>
          <p 
            className="max-w-2xl mx-auto text-base sm:text-lg"
            style={{ color: 'hsl(220 10% 65%)' }}
          >
            Experience the Balkans like never before — breathtaking landscapes, soulful community, and adventures that transform riders into explorers.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative rounded-2xl p-6 sm:p-8 transition-all duration-500 hover:-translate-y-2"
              style={{
                background: 'linear-gradient(180deg, hsl(0 0% 8%) 0%, hsl(0 0% 5%) 100%)',
                boxShadow: `0 20px 60px -20px hsl(0 0% 0% / 0.8), inset 0 1px 0 0 hsl(0 0% 100% / 0.05)`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 30px 80px -20px hsl(0 0% 0% / 0.9), 0 0 60px -20px ${feature.glowColor}, inset 0 1px 0 0 hsl(0 0% 100% / 0.1)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = `0 20px 60px -20px hsl(0 0% 0% / 0.8), inset 0 1px 0 0 hsl(0 0% 100% / 0.05)`;
              }}
            >
              {/* Gradient border on hover */}
              <div 
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `linear-gradient(135deg, ${feature.glowColor}, transparent 60%)`,
                  padding: '1px',
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                }}
              />

              {/* Icon */}
              <div 
                className={cn(
                  "w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110",
                  `bg-gradient-to-br ${feature.color}`
                )}
                style={{
                  boxShadow: `0 8px 30px -8px ${feature.glowColor}`,
                }}
              >
                <feature.icon className="w-7 h-7 text-white" />
              </div>

              {/* Title */}
              <h3 
                className="font-display text-xl sm:text-2xl tracking-wide mb-3"
                style={{ color: 'hsl(40 15% 92%)' }}
              >
                {feature.title}
              </h3>

              {/* Description */}
              <p 
                className="text-sm leading-relaxed mb-5"
                style={{ color: 'hsl(220 10% 60%)' }}
              >
                {feature.description}
              </p>

              {/* Beauties Carousel */}
              {feature.hasCarousel && (
                <div className="mt-4 space-y-3">
                  <div className="relative h-24 rounded-lg overflow-hidden">
                    {featuredSpots.map((spot, i) => (
                      <img
                        key={spot?.id}
                        src={spot?.images[0]}
                        alt={spot?.title}
                        className={cn(
                          "absolute inset-0 w-full h-full object-cover transition-all duration-500",
                          i === activeBeauty ? "opacity-100 scale-100" : "opacity-0 scale-105"
                        )}
                        style={{ filter: 'brightness(0.7)' }}
                      />
                    ))}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <p className="absolute bottom-2 left-3 text-xs font-medium text-white/90">
                      {featuredSpots[activeBeauty]?.title}
                    </p>
                  </div>
                  <div className="flex gap-1.5">
                    {featuredSpots.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveBeauty(i)}
                        className={cn(
                          "flex-1 h-1 rounded-full transition-all duration-300",
                          i === activeBeauty 
                            ? "bg-gradient-to-r from-[hsl(174_60%_45%)] to-[hsl(16_80%_55%)]" 
                            : "bg-white/20 hover:bg-white/30"
                        )}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Link Button */}
              {feature.link && (
                <Link
                  to={feature.link}
                  className="inline-flex items-center gap-2 mt-4 text-sm font-medium transition-all duration-300 group/link"
                  style={{ color: 'hsl(16 85% 60%)' }}
                >
                  <span>{feature.linkText}</span>
                  <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
                </Link>
              )}

              {/* Extras */}
              {feature.extras && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {feature.extras.map((extra) => (
                    <span 
                      key={extra.text}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                      style={{
                        background: 'hsl(174 40% 25% / 0.3)',
                        color: 'hsl(174 60% 65%)',
                        border: '1px solid hsl(174 50% 40% / 0.3)',
                      }}
                    >
                      <extra.icon size={12} />
                      {extra.text}
                    </span>
                  ))}
                </div>
              )}

              {/* Stats */}
              {feature.stats && (
                <div className="flex justify-between mt-5 pt-5 border-t border-white/5">
                  {feature.stats.map((stat) => (
                    <div key={stat.label} className="text-center">
                      <p 
                        className="font-display text-2xl tracking-wider"
                        style={{
                          background: 'linear-gradient(135deg, hsl(260 50% 65%), hsl(280 60% 55%))',
                          WebkitBackgroundClip: 'text',
                          backgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                      >
                        {stat.value}
                      </p>
                      <p className="text-[10px] uppercase tracking-wider text-white/40">{stat.label}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Global CTA */}
        <div className="mt-16 sm:mt-20 text-center">
          <Link
            to="/spots"
            className="inline-flex items-center gap-3 px-10 py-4 rounded-full font-display tracking-[0.15em] text-sm transition-all duration-300 group"
            style={{
              background: 'linear-gradient(135deg, hsl(174 60% 42%) 0%, hsl(16 80% 55%) 100%)',
              color: 'white',
              boxShadow: '0 8px 40px -10px hsl(174 60% 40% / 0.5), 0 0 60px -20px hsl(16 80% 50% / 0.4)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 12px 50px -10px hsl(174 60% 45% / 0.6), 0 0 80px -20px hsl(16 80% 55% / 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 40px -10px hsl(174 60% 40% / 0.5), 0 0 60px -20px hsl(16 80% 50% / 0.4)';
            }}
          >
            <span>START YOUR JOURNEY</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WhySoulRide;
