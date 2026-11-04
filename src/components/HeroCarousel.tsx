import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowRight, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUiSpots, type Spot } from "@/lib/content";
import { SmartImage } from "./SmartImage";

const HERO_SLIDE_IDS = [
  { id: "galicica-pass", tagline: "Where mountain air whispers secrets" },
  { id: "st-jovan-kaneo-overlook", tagline: "Ancient serenity by crystal waters" },
  { id: "mavrovo-lake-loop", tagline: "Stillness reflected in alpine calm" },
  { id: "matka-canyon-overlook", tagline: "Emerald depths, endless peace" },
  { id: "vodno-mountain-cross", tagline: "Rise gently above the everyday" },
  { id: "galicica-national-park-summit", tagline: "Two lakes cradled by mountains" },
  { id: "smolare-waterfall", tagline: "Where water finds its voice" },
  { id: "kratovo-old-town", tagline: "Stone bridges to quieter times" },
] as const;

function buildHeroSlides(spots: Spot[]) {
  return HERO_SLIDE_IDS.flatMap((slide) => {
    const spot = spots.find((item) => item.id === slide.id);
    return spot ? [{ spot, tagline: slide.tagline }] : [];
  });
}

const HeroCarousel = () => {
  const spots = useUiSpots();
  const heroSlides = useMemo(() => buildHeroSlides(spots), [spots]);
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
  }, [isTransitioning, heroSlides.length]);

  const goToNext = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
  }, [isTransitioning, heroSlides.length]);

  useEffect(() => {
    const timer = setTimeout(() => setIsTransitioning(false), 1000);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      if (!isTransitioning) goToNext();
    }, 8000); // Slower, calmer transitions
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
      className="relative h-[100svh] min-h-[650px] overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Background Images - Gentle crossfade */}
      {heroSlides.map((slide, index) => (
        <div
          key={slide.spot.id}
          className={cn(
            "absolute inset-0 transition-all duration-[2000ms] ease-out",
            index === currentIndex ? "opacity-100" : "opacity-0"
          )}
        >
          <SmartImage
            photo={slide.spot.photos[0]}
            alt={slide.spot.photos[0]?.alt.mk || slide.spot.title}
            variant="hero"
            imgStyle={{ filter: "brightness(0.55) saturate(0.85) contrast(1.05)" }}
          />
        </div>
      ))}

      {/* Soft natural gradient overlays */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(180deg, 
              hsl(200 15% 12% / 0.6) 0%, 
              transparent 35%, 
              transparent 55%, 
              hsl(200 15% 12% / 0.85) 100%
            )
          `
        }}
      />
      
      {/* Soft vignette - like misty edges */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, hsl(200 15% 10% / 0.5) 100%)'
        }}
      />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-6">
        {/* Brand Title - Elegant serif */}
        <div className="text-center mb-6 animate-fade-up opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
          <h1 
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-3 font-serif tracking-wide"
            style={{ 
              fontFamily: "'Playfair Display', serif",
              color: 'hsl(45 25% 92%)',
              textShadow: '0 4px 40px hsl(160 30% 30% / 0.3), 0 2px 20px hsl(200 20% 10% / 0.4)',
            }}
          >
            SoulRide
          </h1>
          
          {/* Tagline with leaf accent */}
          <div className="flex items-center justify-center gap-3">
            <span className="w-8 h-px bg-gradient-to-r from-transparent to-[hsl(160_25%_50%/0.5)]" />
            <Leaf size={16} style={{ color: 'hsl(160 30% 55%)' }} />
            <span className="w-8 h-px bg-gradient-to-l from-transparent to-[hsl(160_25%_50%/0.5)]" />
          </div>
          
          <p 
            className="mt-3 text-sm sm:text-base tracking-[0.2em] uppercase font-light"
            style={{ color: 'hsl(160 25% 60%)' }}
          >
            Ride with Soul
          </p>
        </div>

        {/* Subtitle */}
        <p 
          className="text-center text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-10 animate-fade-up opacity-0 font-light leading-relaxed"
          style={{ 
            animationDelay: '0.4s', 
            animationFillMode: 'forwards',
            color: 'hsl(45 15% 80%)',
          }}
        >
          Discover Macedonia's Quiet Beauties, Hidden Views, Local Flavors & Fellow Explorers
        </p>

        {/* Organic CTA Buttons */}
        <div 
          className="flex flex-col sm:flex-row gap-4 mb-14 animate-fade-up opacity-0"
          style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}
        >
          <Link
            to="/signup"
            className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full text-sm font-medium transition-all duration-400 group"
            style={{
              background: 'linear-gradient(135deg, hsl(160 25% 40%) 0%, hsl(160 20% 35%) 100%)',
              color: 'hsl(45 20% 95%)',
              boxShadow: '0 4px 20px -4px hsl(160 30% 30% / 0.4)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 30px -6px hsl(160 30% 35% / 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px -4px hsl(160 30% 30% / 0.4)';
            }}
          >
            <span>Start Your Journey</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
          
          <Link
            to="/chat"
            className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full text-sm font-medium transition-all duration-400"
            style={{
              background: 'hsl(200 15% 20% / 0.6)',
              backdropFilter: 'blur(8px)',
              border: '1px solid hsl(160 20% 40% / 0.3)',
              color: 'hsl(45 20% 88%)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'hsl(200 15% 25% / 0.7)';
              e.currentTarget.style.borderColor = 'hsl(160 25% 50% / 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'hsl(200 15% 20% / 0.6)';
              e.currentTarget.style.borderColor = 'hsl(160 20% 40% / 0.3)';
            }}
          >
            <span>Join Riders</span>
          </Link>
        </div>

        {/* Current Spot Showcase */}
        <div 
          className="text-center max-w-2xl mx-auto animate-fade-up opacity-0"
          style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}
        >
          <p 
            className={cn(
              "text-xs uppercase tracking-[0.25em] mb-2 transition-all duration-700 font-medium",
              isTransitioning ? "opacity-0 -translate-y-2" : "opacity-100 translate-y-0"
            )}
            style={{ color: 'hsl(25 40% 60%)' }}
          >
            Featured Destination
          </p>
          
          <h2 
            className={cn(
              "text-xl sm:text-2xl md:text-3xl font-serif mb-2 transition-all duration-700",
              isTransitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
            )}
            style={{ 
              fontFamily: "'Playfair Display', serif",
              color: 'hsl(45 20% 90%)',
            }}
          >
            {currentSlide.spot.title}
          </h2>
          
          <p 
            className={cn(
              "text-sm sm:text-base italic font-light transition-all duration-700 delay-75",
              isTransitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
            )}
            style={{ color: 'hsl(45 15% 70%)' }}
          >
            "{currentSlide.tagline}"
          </p>

          <Link
            to={`/spots/${currentSlide.spot.id}`}
            className={cn(
              "inline-flex items-center gap-2 mt-4 text-sm font-medium transition-all duration-300 group",
              isTransitioning ? "opacity-0" : "opacity-100"
            )}
            style={{ color: 'hsl(160 30% 55%)' }}
          >
            <span>Explore this spot</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Navigation Arrows - Softer, organic style */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full transition-all duration-300"
        style={{
          background: 'hsl(200 15% 15% / 0.5)',
          backdropFilter: 'blur(8px)',
          border: '1px solid hsl(160 20% 40% / 0.2)',
          color: 'hsl(45 15% 85%)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'hsl(200 15% 20% / 0.6)';
          e.currentTarget.style.borderColor = 'hsl(160 25% 45% / 0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'hsl(200 15% 15% / 0.5)';
          e.currentTarget.style.borderColor = 'hsl(160 20% 40% / 0.2)';
        }}
        aria-label="Previous slide"
      >
        <ChevronLeft size={22} />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full transition-all duration-300"
        style={{
          background: 'hsl(200 15% 15% / 0.5)',
          backdropFilter: 'blur(8px)',
          border: '1px solid hsl(160 20% 40% / 0.2)',
          color: 'hsl(45 15% 85%)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'hsl(200 15% 20% / 0.6)';
          e.currentTarget.style.borderColor = 'hsl(160 25% 45% / 0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'hsl(200 15% 15% / 0.5)';
          e.currentTarget.style.borderColor = 'hsl(160 20% 40% / 0.2)';
        }}
        aria-label="Next slide"
      >
        <ChevronRight size={22} />
      </button>

      {/* Organic Pagination Dots */}
      <div className="absolute bottom-24 md:bottom-20 left-1/2 -translate-x-1/2 z-20 flex gap-2">
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
                ? "w-8 h-2"
                : "w-2 h-2 hover:bg-[hsl(45_20%_70%/0.5)]"
            )}
            style={index === currentIndex ? {
              background: 'linear-gradient(90deg, hsl(160 30% 50%), hsl(25 40% 55%))',
            } : {
              background: 'hsl(45 15% 70% / 0.3)',
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Gentle Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[hsl(160_20%_30%/0.2)] z-20 overflow-hidden">
        <div 
          key={`progress-${currentIndex}-${isPaused}`}
          className="h-full"
          style={{ 
            background: 'linear-gradient(90deg, hsl(160 30% 45%), hsl(25 40% 55%))',
            width: isPaused ? '100%' : '0%',
            animation: isPaused ? 'none' : 'hero-progress 8s linear forwards',
          }}
        />
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-float opacity-40">
        <div 
          className="w-5 h-8 rounded-full flex items-start justify-center p-1.5"
          style={{ border: '1px solid hsl(160 25% 50% / 0.3)' }}
        >
          <div 
            className="w-1 h-2 rounded-full animate-pulse"
            style={{ background: 'hsl(160 30% 55%)' }}
          />
        </div>
      </div>

      {/* Slide counter */}
      <div className="absolute bottom-8 right-6 md:right-10 z-20 text-sm tracking-wider opacity-40 font-light">
        <span style={{ color: 'hsl(160 25% 60%)' }}>{String(currentIndex + 1).padStart(2, '0')}</span>
        <span className="mx-1.5" style={{ color: 'hsl(45 15% 50%)' }}>/</span>
        <span style={{ color: 'hsl(45 15% 50%)' }}>{String(heroSlides.length).padStart(2, '0')}</span>
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
