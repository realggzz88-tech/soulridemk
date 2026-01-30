import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { spots } from "@/data/spots";

// 8 best spots for the hero carousel
const heroSlides = [
  { spot: spots.find(s => s.id === "galicica-pass"), tagline: "Where the soul meets the horizon" },
  { spot: spots.find(s => s.id === "st-jovan-kaneo-overlook"), tagline: "Ancient beauty suspended over crystal waters" },
  { spot: spots.find(s => s.id === "mavrovo-lake-loop"), tagline: "Where reflections tell stories" },
  { spot: spots.find(s => s.id === "matka-canyon-overlook"), tagline: "Emerald depths beneath endless skies" },
  { spot: spots.find(s => s.id === "vodno-mountain-cross"), tagline: "Rise above the world below" },
  { spot: spots.find(s => s.id === "carevi-kuli-fortress-overlook"), tagline: "Where history whispers through stone" },
  { spot: spots.find(s => s.id === "galicica-national-park-summit"), tagline: "Two lakes, one infinite view" },
  { spot: spots.find(s => s.id === "treskavec-monastery-cliff"), tagline: "Solitude carved into the mountain" },
].filter(slide => slide.spot) as { spot: typeof spots[0]; tagline: string }[];

const HeroCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const minSwipeDistance = 50;

  const goToPrevious = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
  }, [isTransitioning]);

  const goToNext = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
  }, [isTransitioning]);

  useEffect(() => {
    const timer = setTimeout(() => setIsTransitioning(false), 800);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      if (!isTransitioning) goToNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [isTransitioning, isPaused, goToNext]);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) goToNext();
    if (distance < -minSwipeDistance) goToPrevious();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goToPrevious();
      if (e.key === "ArrowRight") goToNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToPrevious, goToNext]);

  const currentSlide = heroSlides[currentIndex];

  return (
    <section 
      ref={carouselRef}
      className="relative h-[100svh] min-h-[600px] overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Background Images */}
      {heroSlides.map((slide, index) => (
        <div
          key={slide.spot.id}
          className={cn(
            "absolute inset-0 transition-all duration-[1200ms] ease-out",
            index === currentIndex ? "opacity-100 scale-100" : "opacity-0 scale-105"
          )}
        >
          <img
            src={slide.spot.images[0]}
            alt={slide.spot.title}
            className={cn(
              "w-full h-full object-cover transition-transform duration-[8000ms] ease-out",
              index === currentIndex && "scale-105"
            )}
            style={{ 
              filter: 'brightness(0.45) contrast(1.1) saturate(0.9)',
              objectPosition: 'center 35%'
            }}
          />
        </div>
      ))}

      {/* Clean Dark Gradient Overlays - No Rainbow */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(220_25%_6%/0.85)] via-transparent to-[hsl(220_20%_8%)] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[hsl(220_25%_5%/0.5)] via-transparent to-[hsl(160_20%_8%/0.3)] pointer-events-none" />
      
      {/* Subtle vignette */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, hsl(220 20% 5% / 0.6) 100%)'
        }}
      />
      
      {/* Bottom fade to background */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-4">
        {/* Brand Title - Premium Sans-Serif */}
        <h1 
          className="font-display text-5xl md:text-7xl lg:text-8xl tracking-[0.2em] mb-2 animate-fade-up opacity-0"
          style={{ 
            animationDelay: "0.2s", 
            animationFillMode: "forwards",
            color: 'hsl(40 15% 92%)',
            textShadow: '0 0 60px hsl(32 60% 45% / 0.3), 0 4px 20px hsl(0 0% 0% / 0.5)'
          }}
        >
          SOULRIDE
        </h1>
        <p 
          className="font-display text-sm md:text-base tracking-[0.35em] uppercase mb-8 animate-fade-up opacity-0"
          style={{ 
            animationDelay: "0.3s", 
            animationFillMode: "forwards",
            color: 'hsl(160 30% 55%)',
            textShadow: '0 0 30px hsl(160 40% 40% / 0.4)'
          }}
        >
          Ride with Soul
        </p>

        {/* Dynamic Spot Content */}
        <div className="text-center max-w-4xl mx-auto px-4">
          {/* Eyebrow */}
          <p 
            className={cn(
              "text-xs md:text-sm uppercase tracking-[0.3em] mb-4 transition-all duration-700 font-medium",
              isTransitioning ? "opacity-0 -translate-y-3" : "opacity-100 translate-y-0"
            )}
            style={{ 
              color: 'hsl(32 50% 55%)',
              textShadow: '0 0 20px hsl(32 60% 40% / 0.4)'
            }}
          >
            Discover Soul Views
          </p>
          
          {/* Spot Title - Clean Typography */}
          <h2 
            className={cn(
              "font-display text-2xl sm:text-3xl md:text-5xl lg:text-6xl tracking-wider mb-4 transition-all duration-700",
              isTransitioning ? "opacity-0 translate-y-5" : "opacity-100 translate-y-0"
            )}
            style={{ 
              color: 'hsl(40 20% 90%)',
              textShadow: '0 0 40px hsl(160 30% 35% / 0.25), 0 4px 30px hsl(0 0% 0% / 0.5)'
            }}
          >
            {currentSlide.spot.title}
          </h2>
          
          {/* Tagline */}
          <p 
            className={cn(
              "text-base sm:text-lg md:text-xl italic font-light tracking-wide mb-10 max-w-2xl mx-auto transition-all duration-700 delay-75",
              isTransitioning ? "opacity-0 translate-y-5" : "opacity-100 translate-y-0"
            )}
            style={{ 
              color: 'hsl(220 15% 70%)',
              textShadow: '0 2px 15px hsl(0 0% 0% / 0.5)'
            }}
          >
            "{currentSlide.tagline}"
          </p>

          {/* CTA Button - Solid Amber-Green Fill, Rounded */}
          <Link
            to={`/spots/${currentSlide.spot.id}`}
            className={cn(
              "inline-flex items-center gap-3 px-10 py-4 text-sm font-display tracking-[0.15em] rounded-full transition-all duration-300 group",
              isTransitioning ? "opacity-0 translate-y-5" : "opacity-100 translate-y-0"
            )}
            style={{ 
              transitionDelay: "150ms",
              background: 'linear-gradient(135deg, hsl(160 40% 35%) 0%, hsl(32 60% 45%) 100%)',
              color: 'hsl(0 0% 100%)',
              boxShadow: '0 4px 30px hsl(160 40% 30% / 0.3), 0 0 40px hsl(32 60% 40% / 0.2)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 8px 40px hsl(160 45% 35% / 0.4), 0 0 60px hsl(32 65% 45% / 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 30px hsl(160 40% 30% / 0.3), 0 0 40px hsl(32 60% 40% / 0.2)';
            }}
          >
            <span>EXPLORE THIS GEM</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>

      {/* Navigation Arrows - Simple Chevrons */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-[hsl(220_20%_10%/0.5)] backdrop-blur-sm border border-[hsl(0_0%_100%/0.1)] text-[hsl(0_0%_90%)] hover:bg-[hsl(220_20%_15%/0.7)] hover:border-[hsl(32_50%_50%/0.3)] transition-all duration-300"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-[hsl(220_20%_10%/0.5)] backdrop-blur-sm border border-[hsl(0_0%_100%/0.1)] text-[hsl(0_0%_90%)] hover:bg-[hsl(220_20%_15%/0.7)] hover:border-[hsl(32_50%_50%/0.3)] transition-all duration-300"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Clean Pagination Dots - Bottom Center */}
      <div className="absolute bottom-28 md:bottom-24 left-1/2 -translate-x-1/2 z-20 flex gap-2.5">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (!isTransitioning) {
                setIsTransitioning(true);
                setCurrentIndex(index);
              }
            }}
            className={cn(
              "rounded-full transition-all duration-400",
              index === currentIndex
                ? "w-8 h-2.5 bg-gradient-to-r from-[hsl(160_40%_40%)] to-[hsl(32_55%_50%)]"
                : "w-2.5 h-2.5 bg-[hsl(0_0%_100%/0.25)] hover:bg-[hsl(0_0%_100%/0.4)]"
            )}
            style={index === currentIndex ? { boxShadow: '0 0 15px hsl(32 55% 45% / 0.5)' } : {}}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[hsl(0_0%_100%/0.1)] z-20 overflow-hidden">
        <div 
          key={`progress-${currentIndex}-${isPaused}`}
          className="h-full bg-gradient-to-r from-[hsl(160_40%_45%)] to-[hsl(32_55%_50%)]"
          style={{ 
            width: isPaused ? '100%' : '0%',
            animation: isPaused ? 'none' : 'hero-progress 5s linear forwards'
          }}
        />
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-float opacity-50">
        <div className="w-5 h-9 rounded-full border border-[hsl(0_0%_100%/0.25)] flex items-start justify-center p-1.5">
          <div className="w-1 h-2 bg-[hsl(0_0%_100%/0.4)] rounded-full animate-pulse" />
        </div>
      </div>

      {/* Slide counter */}
      <div className="absolute bottom-10 right-6 md:right-10 z-20 font-display text-xs tracking-wider opacity-40">
        <span className="text-[hsl(0_0%_90%)]">{String(currentIndex + 1).padStart(2, '0')}</span>
        <span className="text-[hsl(0_0%_60%)] mx-1">/</span>
        <span className="text-[hsl(0_0%_60%)]">{String(heroSlides.length).padStart(2, '0')}</span>
      </div>

      <style>{`
        @keyframes hero-progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </section>
  );
};

export default HeroCarousel;