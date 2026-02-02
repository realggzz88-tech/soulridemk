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
      title: "Епски македонски убавини",
      description: "Од вечните брегови на Охридското Езеро до кривулестите премини на Галичица — откријте пејзажи што ви го одземаат здивот.",
      hasCarousel: true,
    },
    {
      icon: Users,
      title: "Заедница на возачи",
      description: "Поврзете се со истражувачи кои ја споделуваат вашата љубов кон отворените патишта. Споделете приказни, рути и фотографии во тематски соби.",
      link: "/chat",
      linkText: "Приклучи се на заедницата",
    },
    {
      icon: Compass,
      title: "Патувај и откриј",
      description: "Планирајте патувања низ скриени бисери, кањонски видиковци, традиционални коноби и локални винарии — се е мапирано за љубопитниот патник.",
      extras: [
        { icon: Coffee, text: "Коноби" },
        { icon: Camera, text: "Видиковци" },
        { icon: TreePine, text: "Природа" },
      ],
    },
    {
      icon: MapPin,
      title: "Локални богатства",
      description: "Истражете ја автентична Македонија — од планински манастири до речни кафулиња. Секое застанување раскажува приказна.",
      stats: [
        { value: "35+", label: "Места" },
        { value: "8", label: "Региони" },
        { value: "∞", label: "Приказни" },
      ],
    },
  ];

  return (
    <section 
      className="relative py-24 sm:py-32 px-4 overflow-hidden"
      style={{ backgroundColor: 'hsl(20 15% 8%)' }}
    >
      {/* Subtle gradient glow */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, hsl(15 70% 50%) 0%, transparent 70%)',
          filter: 'blur(100px)',
        }}
      />
      
      {/* Content */}
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p 
            className="text-sm uppercase tracking-[0.3em] mb-4 font-medium"
            style={{ color: 'hsl(170 60% 55%)' }}
          >
            Зошто SoulRide
          </p>
          <h2 
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6"
            style={{ color: 'hsl(0 0% 100%)' }}
          >
            Истражи ја душата на Македонија
          </h2>
          <p 
            className="max-w-xl mx-auto text-lg font-light leading-relaxed"
            style={{ color: 'hsl(30 10% 60%)' }}
          >
            Патување низ неверојатни пејзажи, топла заедница и патишта што водат кон чудо.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid sm:grid-cols-2 gap-6 lg:gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1"
              style={{
                background: 'linear-gradient(180deg, hsl(20 18% 12%) 0%, hsl(25 15% 10%) 100%)',
                border: '1px solid hsl(25 15% 18%)',
                boxShadow: '0 4px 24px -4px hsl(0 0% 0% / 0.4)',
              }}
            >
              {/* Icon */}
              <div 
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-105"
                style={{
                  background: 'hsl(15 70% 50% / 0.15)',
                  border: '1px solid hsl(15 70% 50% / 0.25)',
                }}
              >
                <feature.icon 
                  className="w-7 h-7" 
                  style={{ color: 'hsl(15 70% 55%)' }}
                />
              </div>

              {/* Title */}
              <h3 
                className="text-xl sm:text-2xl font-bold tracking-tight mb-3"
                style={{ color: 'hsl(0 0% 100%)' }}
              >
                {feature.title}
              </h3>

              {/* Description */}
              <p 
                className="text-sm leading-relaxed mb-5"
                style={{ color: 'hsl(30 10% 60%)' }}
              >
                {feature.description}
              </p>

              {/* Beauties Carousel */}
              {feature.hasCarousel && (
                <div className="mt-4 space-y-3">
                  <div className="relative h-32 rounded-xl overflow-hidden">
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
                    <div 
                      className="absolute inset-0"
                      style={{ background: 'linear-gradient(to top, hsl(20 15% 8% / 0.8) 0%, transparent 60%)' }}
                    />
                    <p 
                      className="absolute bottom-3 left-4 text-sm font-medium"
                      style={{ color: 'hsl(0 0% 100%)' }}
                    >
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
                          backgroundColor: i === activeBeauty ? 'hsl(15 70% 50%)' : 'hsl(25 15% 25%)',
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
                  style={{ color: 'hsl(170 60% 55%)' }}
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
                        background: 'hsl(15 70% 50% / 0.1)',
                        color: 'hsl(25 60% 65%)',
                        border: '1px solid hsl(15 70% 50% / 0.2)',
                      }}
                    >
                      <extra.icon size={12} style={{ color: 'hsl(15 70% 55%)' }} />
                      {extra.text}
                    </span>
                  ))}
                </div>
              )}

              {/* Stats */}
              {feature.stats && (
                <div 
                  className="flex justify-between mt-6 pt-6"
                  style={{ borderTop: '1px solid hsl(25 15% 18%)' }}
                >
                  {feature.stats.map((stat) => (
                    <div key={stat.label} className="text-center">
                      <p 
                        className="text-2xl font-bold"
                        style={{ color: 'hsl(15 70% 55%)' }}
                      >
                        {stat.value}
                      </p>
                      <p 
                        className="text-[10px] uppercase tracking-wider"
                        style={{ color: 'hsl(30 10% 50%)' }}
                      >
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Link
            to="/spots"
            className="btn-primary arrow-animate group"
          >
            <span>Истражи ги сите дестинации</span>
            <ArrowRight size={16} className="arrow-icon group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WhySoulRide;
