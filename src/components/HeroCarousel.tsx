import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { spots } from "@/data/spots";

// 8 best spots for the hero carousel - curated for visual impact
const heroSlides = [
  {
    spot: spots.find(s => s.id === "galicica-pass"),
    tagline: "Where the soul meets the horizon",
  },
  {
    spot: spots.find(s => s.id === "st-jovan-kaneo-overlook"),
    tagline: "Ancient beauty suspended over crystal waters",
  },
  {
    spot: spots.find(s => s.id === "mavrovo-lake-loop"),
    tagline: "Where reflections tell stories",
  },
  {
    spot: spots.find(s => s.id === "matka-canyon-overlook"),
    tagline: "Emerald depths beneath endless skies",
  },
  {
    spot: spots.find(s => s.id === "vodno-mountain-cross"),
    tagline: "Rise above the world below",
  },
  {
    spot: spots.find(s => s.id === "carevi-kuli-fortress-overlook"),
    tagline: "Where history whispers through stone",
  },
  {
    spot: spots.find(s => s.id === "galicica-national-park-summit"),
    tagline: "Two lakes, one infinite view",
  },
  {
    spot: spots.find(s => s.id === "treskavec-monastery-cliff"),
    tagline: "Solitude carved into the mountain",
  },
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

  // Reset transition lock
  useEffect(() => {
    const timer = setTimeout(() => setIsTransitioning(false), 800);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  // Auto-advance every 5 seconds (paused on hover)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      if (!isTransitioning) {
        goToNext();
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [isTransitioning, isPaused, goToNext]);

  // Touch handlers for mobile swipe
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
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) goToNext();
    if (isRightSwipe) goToPrevious();
  };

  // Keyboard navigation
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
      className="relative h-[100svh] min-h-[600px] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Background Images with Ken Burns effect */}
      {heroSlides.map((slide, index) => (
        <div
          key={slide.spot.id}
          className={cn(
            "absolute inset-0 transition-all duration-[1200ms] ease-out",
            index === currentIndex 
              ? "opacity-100 scale-100" 
              : "opacity-0 scale-110"
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
              filter: 'brightness(0.55) contrast(1.15) saturate(0.85)',
              objectPosition: 'center 35%'
            }}
          />
        </div>
      ))}

      {/* Cinematic Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-transparent to-background pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[hsl(215_40%_8%/0.6)] via-transparent to-[hsl(160_30%_8%/0.4)] pointer-events-none" />
      <div className="absolute inset-0 hero-vignette pointer-events-none" />
      
      {/* Artistic line overlays - road/mountain contours */}
      <div className="absolute inset-0 road-art-overlay opacity-25 pointer-events-none" />
      <div className="absolute inset-0 mountain-contours opacity-15 pointer-events-none" />
      
      {/* Corner line art decorations */}
      <svg className="absolute top-16 left-6 w-40 h-40 opacity-20 pointer-events-none hidden md:block" viewBox="0 0 100 100">
        <path d="M0 30 Q 30 30, 30 0" fill="none" stroke="hsl(160 50% 45%)" strokeWidth="0.5" />
        <path d="M0 50 Q 50 50, 50 0" fill="none" stroke="hsl(32 70% 50%)" strokeWidth="0.3" />
        <path d="M0 70 Q 70 70, 70 0" fill="none" stroke="hsl(215 50% 50%)" strokeWidth="0.3" />
      </svg>
      <svg className="absolute bottom-32 right-6 w-40 h-40 opacity-20 pointer-events-none hidden md:block" viewBox="0 0 100 100">
        <path d="M100 70 Q 70 70, 70 100" fill="none" stroke="hsl(32 70% 50%)" strokeWidth="0.5" />
        <path d="M100 50 Q 50 50, 50 100" fill="none" stroke="hsl(160 50% 45%)" strokeWidth="0.3" />
        <path d="M100 30 Q 30 30, 30 100" fill="none" stroke="hsl(215 50% 50%)" strokeWidth="0.3" />
      </svg>
      
      {/* Bottom fog gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-background via-background/90 to-transparent pointer-events-none" />
      <div className="absolute inset-0 fog-overlay pointer-events-none" />
      
      {/* Film grain texture */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
        }}
      />

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-4">
        {/* Main Title */}
        <h1 
          className="hero-title-glow mb-2 animate-fade-up opacity-0"
          style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
        >
          SOULRIDE
        </h1>
        <p 
          className="hero-subtitle-glow mb-6 animate-fade-up opacity-0"
          style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}
        >
          Ride with Soul
        </p>

        {/* Dynamic Spot Content */}
        <div className="text-center max-w-5xl mx-auto px-4">
          {/* Eyebrow text */}
          <p 
            className={cn(
              "text-xs sm:text-sm md:text-base uppercase tracking-[0.25em] sm:tracking-[0.4em] mb-3 sm:mb-4 transition-all duration-700 font-medium",
              isTransitioning ? "opacity-0 -translate-y-3" : "opacity-100 translate-y-0"
            )}
            style={{ 
              background: 'linear-gradient(90deg, hsl(215 60% 65%), hsl(160 50% 55%), hsl(32 80% 60%))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: 'none',
              filter: 'drop-shadow(0 2px 8px hsl(0 0% 0% / 0.4))'
            }}
          >
            Discover Soul Views
          </p>
          
          {/* Main title with gradient */}
          <h2 
            className={cn(
              "font-display text-3xl sm:text-4xl md:text-6xl lg:text-7xl tracking-wider mb-4 sm:mb-5 transition-all duration-700",
              isTransitioning ? "opacity-0 translate-y-5" : "opacity-100 translate-y-0"
            )}
            style={{ 
              background: 'linear-gradient(135deg, hsl(215 50% 75%) 0%, hsl(40 20% 95%) 40%, hsl(32 70% 65%) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 4px 20px hsl(0 0% 0% / 0.5))'
            }}
          >
            {currentSlide.spot.title}
          </h2>
          
          {/* Poetic tagline */}
          <p 
            className={cn(
              "text-base sm:text-lg md:text-xl lg:text-2xl italic font-light tracking-wide mb-8 sm:mb-10 max-w-3xl mx-auto transition-all duration-700 delay-75 px-2",
              isTransitioning ? "opacity-0 translate-y-5" : "opacity-100 translate-y-0"
            )}
            style={{ 
              color: 'hsl(220 15% 80%)',
              textShadow: '0 2px 15px hsl(0 0% 0% / 0.6)'
            }}
          >
            "{currentSlide.tagline}"
          </p>

          {/* CTA Button with enhanced glow */}
          <Link
            to={`/spots/${currentSlide.spot.id}`}
            className={cn(
              "hero-cta-button inline-flex items-center gap-3 px-8 sm:px-12 py-4 sm:py-5 text-sm sm:text-base font-display tracking-[0.15em] rounded-2xl transition-all duration-500 hover:scale-105 group relative overflow-hidden",
              isTransitioning ? "opacity-0 translate-y-5" : "opacity-100 translate-y-0"
            )}
            style={{ transitionDelay: "150ms" }}
          >
            {/* Button gradient background */}
            <span className="absolute inset-0 bg-gradient-to-r from-[hsl(215_35%_25%)] via-[hsl(160_35%_28%)] to-[hsl(32_60%_40%)] opacity-90" />
            {/* Shine effect on hover */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            {/* Button content */}
            <span className="relative z-10 text-[hsl(40_15%_96%)]">EXPLORE THIS GEM</span>
            <ArrowRight size={20} className="relative z-10 text-[hsl(40_15%_96%)] group-hover:translate-x-1.5 transition-transform duration-300" />
          </Link>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 p-3 md:p-4 rounded-full bg-background/30 backdrop-blur-sm border border-foreground/20 text-foreground hover:bg-background/50 hover:border-soul-amber/50 transition-all duration-300 group"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} className="group-hover:-translate-x-0.5 transition-transform" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 p-3 md:p-4 rounded-full bg-background/30 backdrop-blur-sm border border-foreground/20 text-foreground hover:bg-background/50 hover:border-soul-amber/50 transition-all duration-300 group"
        aria-label="Next slide"
      >
        <ChevronRight size={24} className="group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-28 md:bottom-24 left-1/2 -translate-x-1/2 z-20 flex gap-2 md:gap-3">
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
              "rounded-full transition-all duration-500",
              index === currentIndex
                ? "bg-gradient-to-r from-[hsl(215_50%_60%)] via-[hsl(160_45%_50%)] to-[hsl(32_70%_55%)] w-8 md:w-10 h-2 md:h-2.5 shadow-[0_0_20px_hsl(32_70%_50%/0.5)]"
                : "bg-foreground/25 w-2 md:w-2.5 h-2 md:h-2.5 hover:bg-foreground/40"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-foreground/10 z-20 overflow-hidden">
        <div 
          key={`progress-${currentIndex}-${isPaused}`}
          className="h-full bg-gradient-to-r from-[hsl(215_50%_55%)] via-[hsl(160_45%_50%)] to-[hsl(32_70%_55%)]"
          style={{ 
            width: isPaused ? '100%' : '0%',
            animation: isPaused ? 'none' : 'hero-progress 5s linear forwards'
          }}
        />
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-float opacity-60">
        <div className="w-6 h-10 rounded-full border-2 border-foreground/30 flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-foreground/50 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Slide counter */}
      <div className="absolute bottom-10 right-6 md:right-10 z-20 font-display text-sm tracking-wider opacity-50">
        <span className="text-foreground">{String(currentIndex + 1).padStart(2, '0')}</span>
        <span className="text-foreground/40 mx-1">/</span>
        <span className="text-foreground/40">{String(heroSlides.length).padStart(2, '0')}</span>
      </div>

      {/* CSS for progress animation */}
      <style>{`
        @keyframes hero-progress {
          from { width: 0%; }
          to { width: 100%; }
        }
        .hero-cta-button {
          box-shadow: 
            0 4px 30px -5px hsl(160 40% 35% / 0.4),
            0 0 50px -10px hsl(32 70% 50% / 0.3),
            inset 0 1px 0 0 hsl(40 30% 80% / 0.15),
            inset 0 -1px 0 0 hsl(0 0% 0% / 0.2);
        }
        .hero-cta-button:hover {
          box-shadow: 
            0 8px 50px -5px hsl(160 45% 40% / 0.5),
            0 0 80px -10px hsl(32 75% 55% / 0.4),
            inset 0 1px 0 0 hsl(40 30% 80% / 0.2),
            inset 0 -1px 0 0 hsl(0 0% 0% / 0.2);
        }
      `}</style>
    </section>
  );
};

export default HeroCarousel;