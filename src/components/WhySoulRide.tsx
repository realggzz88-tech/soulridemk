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

// Premium colors
const tealColor = 'hsl(160 84% 50%)';
const tealBg = 'hsl(160 84% 39%)';
const cardBg = 'hsl(222 40% 10%)';
const borderColor = 'hsl(222 20% 18%)';
const pageBg = 'hsl(222 47% 7%)';

const WhySoulRide = () => {
  const [activeBeauty, setActiveBeauty] = useState(0);

  const features = [
    {
      icon: Mountain,
      title: "Epic Macedonian Beauties",
      description: "From Lake Ohrid's timeless shores to Galicica's winding passes — discover landscapes that take your breath away.",
      accentColor: tealColor,
      hasCarousel: true,
    },
    {
      icon: Users,
      title: "Rider Community",
      description: "Connect with fellow explorers who share your love for open roads. Share stories, routes, and photos in themed chat rooms.",
      accentColor: tealColor,
      link: "/chat",
      linkText: "Join the Community",
    },
    {
      icon: Compass,
      title: "Travel & Discover",
      description: "Plan journeys through hidden gems, canyon viewpoints, traditional konobas, and local wineries — all mapped for the curious traveler.",
      accentColor: tealColor,
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
      accentColor: tealColor,
      stats: [
        { value: "35+", label: "Spots" },
        { value: "8", label: "Regions" },
        { value: "∞", label: "Stories" },
      ],
    },
  ];

  return (
    <section 
      className="relative py-20 sm:py-28 px-4 overflow-hidden"
      style={{ backgroundColor: pageBg }}
    >
      {/* Subtle gradient accent */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-20"
        style={{
          background: `radial-gradient(circle, ${tealBg} 0%, transparent 70%)`,
          filter: 'blur(100px)',
        }}
      />
      
      {/* Content */}
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-14 sm:mb-18">
          <p 
            className="text-xs sm:text-sm uppercase tracking-[0.3em] mb-4 font-medium"
            style={{ color: tealColor }}
          >
            Why SoulRide
          </p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-5 text-foreground">
            Explore Macedonia's Soul
          </h2>
          <p className="max-w-xl mx-auto text-base sm:text-lg font-light leading-relaxed text-muted-foreground">
            A journey through breathtaking landscapes, warm community, and roads that lead to wonder.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid sm:grid-cols-2 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative rounded-xl p-7 sm:p-8 transition-all duration-300 hover:-translate-y-1"
              style={{
                backgroundColor: cardBg,
                border: `1px solid ${borderColor}`,
                boxShadow: '0 4px 24px -4px hsl(222 47% 3% / 0.5)',
              }}
            >
              {/* Icon */}
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-105"
                style={{
                  backgroundColor: 'hsl(160 84% 39% / 0.15)',
                  border: '1px solid hsl(160 84% 39% / 0.25)',
                }}
              >
                <feature.icon 
                  className="w-6 h-6" 
                  style={{ color: tealColor }}
                />
              </div>

              {/* Title */}
              <h3 className="font-display text-xl sm:text-2xl font-bold tracking-tight mb-3 text-foreground">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-sm leading-relaxed mb-5 text-muted-foreground">
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
                      />
                    ))}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <p className="absolute bottom-3 left-4 text-sm font-medium text-white">
                      {featuredSpots[activeBeauty]?.title}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {featuredSpots.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveBeauty(i)}
                        className="flex-1 h-1.5 rounded-full transition-all duration-300"
                        style={{
                          backgroundColor: i === activeBeauty ? tealBg : 'hsl(222 20% 25%)',
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
                  style={{ color: tealColor }}
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
                        backgroundColor: 'hsl(160 84% 39% / 0.1)',
                        color: 'hsl(160 70% 60%)',
                        border: '1px solid hsl(160 84% 39% / 0.2)',
                      }}
                    >
                      <extra.icon size={12} style={{ color: tealColor }} />
                      {extra.text}
                    </span>
                  ))}
                </div>
              )}

              {/* Stats */}
              {feature.stats && (
                <div 
                  className="flex justify-between mt-5 pt-5 border-t"
                  style={{ borderColor }}
                >
                  {feature.stats.map((stat) => (
                    <div key={stat.label} className="text-center">
                      <p 
                        className="text-2xl font-bold"
                        style={{ color: tealColor }}
                      >
                        {stat.value}
                      </p>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{stat.label}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 sm:mt-18 text-center">
          <Link
            to="/spots"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-sm font-semibold transition-all duration-300 group hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, hsl(160 84% 39%) 0%, hsl(168 80% 42%) 100%)',
              color: 'hsl(222 47% 7%)',
              boxShadow: '0 4px 20px hsl(160 84% 39% / 0.3)',
            }}
          >
            <span>Explore All Destinations</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WhySoulRide;
