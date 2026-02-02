import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Mountain, 
  Users, 
  Compass, 
  MapPin,
  ArrowRight,
  Coffee,
  Camera,
  TreePine
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
      title: "Quiet Macedonian Beauties",
      description: "From Lake Ohrid's peaceful shores to Galicica's gentle passes — discover landscapes that invite you to slow down and breathe.",
      accentColor: "hsl(160 30% 45%)",
      hasCarousel: true,
    },
    {
      icon: Users,
      title: "Rider Community",
      description: "Connect with fellow explorers who share your love for open roads. Share stories, routes, and photos in welcoming chat rooms.",
      accentColor: "hsl(25 45% 55%)",
      link: "/chat",
      linkText: "Join the Community",
    },
    {
      icon: Compass,
      title: "Travel & Discover",
      description: "Plan journeys through hidden gems, canyon viewpoints, traditional konobas, and local wineries — all mapped for the curious traveler.",
      accentColor: "hsl(200 35% 50%)",
      extras: [
        { icon: Coffee, text: "Konobas" },
        { icon: Camera, text: "Viewpoints" },
        { icon: TreePine, text: "Nature" },
      ],
    },
    {
      icon: MapPin,
      title: "Local Treasures",
      description: "Explore authentic Macedonia — from mountain monasteries to riverside cafes. Every stop tells a story.",
      accentColor: "hsl(160 25% 50%)",
      stats: [
        { value: "35+", label: "Spots" },
        { value: "8", label: "Regions" },
        { value: "∞", label: "Stories" },
      ],
    },
  ];

  return (
    <section className="relative py-20 sm:py-28 px-4 overflow-hidden">
      {/* Soft gradient background */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, hsl(200 12% 12%) 0%, hsl(180 15% 14%) 50%, hsl(200 12% 12%) 100%)'
        }}
      />
      
      {/* Subtle organic shapes */}
      <div 
        className="absolute top-20 left-0 w-[500px] h-[500px] rounded-full opacity-30"
        style={{
          background: 'radial-gradient(circle, hsl(160 25% 25% / 0.15) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
      <div 
        className="absolute bottom-20 right-0 w-[400px] h-[400px] rounded-full opacity-25"
        style={{
          background: 'radial-gradient(circle, hsl(25 35% 30% / 0.12) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
      
      {/* Content */}
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-14 sm:mb-18">
          <p 
            className="text-xs sm:text-sm uppercase tracking-[0.3em] mb-4 font-medium"
            style={{ color: 'hsl(160 30% 55%)' }}
          >
            Why SoulRide
          </p>
          <h2 
            className="text-3xl sm:text-4xl md:text-5xl font-serif mb-5"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: 'hsl(45 20% 90%)',
            }}
          >
            Explore Macedonia's Soul
          </h2>
          <p 
            className="max-w-xl mx-auto text-base sm:text-lg font-light leading-relaxed"
            style={{ color: 'hsl(45 15% 65%)' }}
          >
            A gentle invitation to discover the Balkans — breathtaking landscapes, warm community, and roads that lead to wonder.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid sm:grid-cols-2 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative rounded-2xl p-7 sm:p-8 transition-all duration-400"
              style={{
                background: 'linear-gradient(180deg, hsl(200 10% 16%) 0%, hsl(200 12% 14%) 100%)',
                border: '1px solid hsl(160 15% 25% / 0.2)',
                boxShadow: '0 8px 30px -8px hsl(200 20% 8% / 0.5)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = `${feature.accentColor.replace(')', ' / 0.3)')}`;
                e.currentTarget.style.boxShadow = `0 12px 40px -10px hsl(200 20% 8% / 0.6)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'hsl(160 15% 25% / 0.2)';
                e.currentTarget.style.boxShadow = '0 8px 30px -8px hsl(200 20% 8% / 0.5)';
              }}
            >
              {/* Icon */}
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-105"
                style={{
                  background: `linear-gradient(135deg, ${feature.accentColor.replace(')', ' / 0.2)')}, ${feature.accentColor.replace(')', ' / 0.1)')})`,
                  border: `1px solid ${feature.accentColor.replace(')', ' / 0.3)')}`,
                }}
              >
                <feature.icon 
                  className="w-6 h-6" 
                  style={{ color: feature.accentColor }}
                />
              </div>

              {/* Title */}
              <h3 
                className="text-xl sm:text-2xl font-serif mb-3"
                style={{ 
                  fontFamily: "'Playfair Display', serif",
                  color: 'hsl(45 20% 90%)',
                }}
              >
                {feature.title}
              </h3>

              {/* Description */}
              <p 
                className="text-sm leading-relaxed mb-5 font-light"
                style={{ color: 'hsl(45 15% 65%)' }}
              >
                {feature.description}
              </p>

              {/* Beauties Carousel */}
              {feature.hasCarousel && (
                <div className="mt-4 space-y-3">
                  <div className="relative h-28 rounded-xl overflow-hidden">
                    {featuredSpots.map((spot, i) => (
                      <img
                        key={spot?.id}
                        src={spot?.images[0]}
                        alt={spot?.title}
                        className={cn(
                          "absolute inset-0 w-full h-full object-cover transition-all duration-700",
                          i === activeBeauty ? "opacity-100" : "opacity-0"
                        )}
                        style={{ filter: 'brightness(0.75) saturate(0.9)' }}
                      />
                    ))}
                    <div 
                      className="absolute inset-0"
                      style={{ background: 'linear-gradient(180deg, transparent 50%, hsl(200 15% 12% / 0.8) 100%)' }}
                    />
                    <p 
                      className="absolute bottom-3 left-4 text-sm font-medium"
                      style={{ color: 'hsl(45 20% 90%)' }}
                    >
                      {featuredSpots[activeBeauty]?.title}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {featuredSpots.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveBeauty(i)}
                        className={cn(
                          "flex-1 h-1.5 rounded-full transition-all duration-400",
                          i === activeBeauty 
                            ? "bg-gradient-to-r" 
                            : "hover:opacity-60"
                        )}
                        style={i === activeBeauty ? {
                          background: `linear-gradient(90deg, ${feature.accentColor}, hsl(25 40% 55%))`,
                        } : {
                          background: 'hsl(45 15% 50% / 0.25)',
                        }}
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
                  style={{ color: feature.accentColor }}
                >
                  <span>{feature.linkText}</span>
                  <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
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
                        background: 'hsl(200 15% 20% / 0.5)',
                        color: 'hsl(45 15% 75%)',
                        border: '1px solid hsl(160 20% 30% / 0.2)',
                      }}
                    >
                      <extra.icon size={12} style={{ color: feature.accentColor }} />
                      {extra.text}
                    </span>
                  ))}
                </div>
              )}

              {/* Stats */}
              {feature.stats && (
                <div className="flex justify-between mt-5 pt-5 border-t" style={{ borderColor: 'hsl(160 15% 25% / 0.2)' }}>
                  {feature.stats.map((stat) => (
                    <div key={stat.label} className="text-center">
                      <p 
                        className="text-2xl font-serif"
                        style={{
                          fontFamily: "'Playfair Display', serif",
                          color: feature.accentColor,
                        }}
                      >
                        {stat.value}
                      </p>
                      <p className="text-[10px] uppercase tracking-wider" style={{ color: 'hsl(45 15% 55%)' }}>{stat.label}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Gentle CTA */}
        <div className="mt-14 sm:mt-18 text-center">
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
            <span>Explore All Destinations</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Wavy organic divider at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-16 overflow-hidden">
        <svg 
          viewBox="0 0 1200 60" 
          preserveAspectRatio="none" 
          className="absolute bottom-0 w-full h-full"
          style={{ opacity: 0.15 }}
        >
          <path 
            d="M0,40 C200,60 400,20 600,40 C800,60 1000,20 1200,40 L1200,60 L0,60 Z" 
            fill="hsl(160 25% 35%)"
          />
          <path 
            d="M0,50 C200,30 400,55 600,35 C800,55 1000,30 1200,50 L1200,60 L0,60 Z" 
            fill="hsl(200 12% 12%)"
          />
        </svg>
      </div>
    </section>
  );
};

export default WhySoulRide;
