import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowRight, Globe, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { spots } from "@/data/spots";

// 12 featured spots for the hero carousel - diverse regional coverage
const heroSlides = [
  { spot: spots.find(s => s.id === "galicica-pass"), tagline: "Where the soul meets the horizon" },
  { spot: spots.find(s => s.id === "st-jovan-kaneo-overlook"), tagline: "Ancient beauty suspended over crystal waters" },
  { spot: spots.find(s => s.id === "mavrovo-lake-loop"), tagline: "Where reflections tell stories" },
  { spot: spots.find(s => s.id === "matka-canyon-overlook"), tagline: "Emerald depths beneath endless skies" },
  { spot: spots.find(s => s.id === "vodno-mountain-cross"), tagline: "Rise above the world below" },
  { spot: spots.find(s => s.id === "carevi-kuli-fortress-overlook"), tagline: "Where history whispers through stone" },
  { spot: spots.find(s => s.id === "galicica-national-park-summit"), tagline: "Two lakes, one infinite view" },
  { spot: spots.find(s => s.id === "treskavec-monastery-cliff"), tagline: "Solitude carved into the mountain" },
  { spot: spots.find(s => s.id === "shar-mountain-range"), tagline: "Peaks touching the divine" },
  { spot: spots.find(s => s.id === "kokino-observatory-overlook"), tagline: "Where ancient eyes first mapped the stars" },
  { spot: spots.find(s => s.id === "smolare-waterfall"), tagline: "Where water sings eternal songs" },
  { spot: spots.find(s => s.id === "kratovo-old-town"), tagline: "Stone bridges to forgotten eras" },
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
    }, 6000);
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
      className="relative h-[100svh] min-h-[700px] overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Background Images with Ken Burns Effect */}
      {heroSlides.map((slide, index) => (
        <div
          key={slide.spot.id}
          className={cn(
            "absolute inset-0 transition-all duration-[1500ms] ease-out",
            index === currentIndex ? "opacity-100 scale-100" : "opacity-0 scale-110"
          )}
        >
          <img
            src={slide.spot.images[0]}
            alt={slide.spot.title}
            className={cn(
              "w-full h-full object-cover transition-transform duration-[12000ms] ease-out",
              index === currentIndex && "scale-110"
            )}
            style={{ 
              filter: 'brightness(0.35) contrast(1.15) saturate(1.1)',
              objectPosition: 'center 30%'
            }}
          />
        </div>
      ))}

      {/* Premium Gradient Overlays */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(180deg, hsl(0 0% 0% / 0.7) 0%, transparent 30%, transparent 60%, hsl(0 0% 2%) 100%),
            linear-gradient(90deg, hsl(174 40% 8% / 0.4) 0%, transparent 50%, hsl(16 40% 8% / 0.3) 100%)
          `
        }}
      />
      
      {/* Animated Fog/Mist Layer */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background: `
            radial-gradient(ellipse at 20% 80%, hsl(0 0% 100% / 0.05) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 70%, hsl(174 50% 50% / 0.04) 0%, transparent 40%),
            radial-gradient(ellipse at 50% 100%, hsl(0 0% 100% / 0.06) 0%, transparent 50%)
          `,
          animation: 'fog-drift 20s ease-in-out infinite',
        }}
      />
      
      {/* Cinematic Vignette */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, hsl(0 0% 0% / 0.7) 100%)'
        }}
      />

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-4">
        {/* Premium Brand Title */}
        <div className="text-center mb-6 animate-fade-up opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
          <h1 
            className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-[0.15em] mb-3"
            style={{ 
              background: 'linear-gradient(135deg, hsl(0 0% 100%) 0%, hsl(174 50% 70%) 40%, hsl(16 70% 65%) 80%, hsl(0 0% 100%) 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 80px hsl(174 60% 50% / 0.4)) drop-shadow(0 0 120px hsl(16 70% 50% / 0.3)) drop-shadow(0 8px 30px hsl(0 0% 0% / 0.6))',
            }}
          >
            SOULRIDE
          </h1>
          
          {/* Tagline */}
          <p 
            className="font-display text-sm sm:text-base md:text-lg tracking-[0.4em] uppercase"
            style={{ 
              color: 'hsl(174 50% 60%)',
              textShadow: '0 0 40px hsl(174 60% 50% / 0.5)',
            }}
          >
            Ride with Soul
          </p>
        </div>

        {/* Subtitle */}
        <p 
          className="text-center text-sm sm:text-base md:text-lg max-w-2xl mx-auto mb-10 animate-fade-up opacity-0 font-light tracking-wide"
          style={{ 
            animationDelay: '0.3s', 
            animationFillMode: 'forwards',
            color: 'hsl(220 15% 75%)',
            textShadow: '0 2px 20px hsl(0 0% 0% / 0.5)',
          }}
        >
          Discover North Macedonia's Hidden Gems, Nature Views & Global Rider Community
        </p>

        {/* CTA Buttons */}
        <div 
          className="flex flex-col sm:flex-row gap-4 mb-16 animate-fade-up opacity-0"
          style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}
        >
          <Link
            to="/signup"
            className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full font-display tracking-[0.12em] text-sm transition-all duration-300 group"
            style={{
              background: 'linear-gradient(135deg, hsl(174 60% 45%) 0%, hsl(16 80% 55%) 100%)',
              color: 'white',
              boxShadow: '0 8px 40px -10px hsl(174 60% 45% / 0.5), 0 0 60px -20px hsl(16 80% 55% / 0.4)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 12px 50px -10px hsl(174 60% 50% / 0.6), 0 0 80px -20px hsl(16 85% 60% / 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 40px -10px hsl(174 60% 45% / 0.5), 0 0 60px -20px hsl(16 80% 55% / 0.4)';
            }}
          >
            <span>JOIN THE COMMUNITY</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link
            to="/spots"
            className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full font-display tracking-[0.12em] text-sm transition-all duration-300"
            style={{
              background: 'hsl(0 0% 100% / 0.08)',
              backdropFilter: 'blur(10px)',
              border: '1px solid hsl(0 0% 100% / 0.15)',
              color: 'hsl(0 0% 95%)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'hsl(0 0% 100% / 0.15)';
              e.currentTarget.style.borderColor = 'hsl(174 50% 50% / 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'hsl(0 0% 100% / 0.08)';
              e.currentTarget.style.borderColor = 'hsl(0 0% 100% / 0.15)';
            }}
          >
            <span>EXPLORE GEMS</span>
          </Link>
        </div>

        {/* Dynamic Spot Showcase */}
        <div 
          className="text-center max-w-3xl mx-auto animate-fade-up opacity-0"
          style={{ animationDelay: '0.7s', animationFillMode: 'forwards' }}
        >
          {/* Eyebrow */}
          <p 
            className={cn(
              "text-[10px] sm:text-xs uppercase tracking-[0.4em] mb-3 transition-all duration-700 font-medium flex items-center justify-center gap-2",
              isTransitioning ? "opacity-0 -translate-y-3" : "opacity-100 translate-y-0"
            )}
            style={{ color: 'hsl(16 70% 60%)' }}
          >
            <span className="w-8 h-px bg-gradient-to-r from-transparent to-[hsl(16_60%_50%)]" />
            Now Featuring
            <span className="w-8 h-px bg-gradient-to-l from-transparent to-[hsl(16_60%_50%)]" />
          </p>
          
          {/* Spot Title */}
          <h2 
            className={cn(
              "font-display text-xl sm:text-2xl md:text-4xl tracking-wider mb-3 transition-all duration-700",
              isTransitioning ? "opacity-0 translate-y-5" : "opacity-100 translate-y-0"
            )}
            style={{ 
              color: 'hsl(40 20% 92%)',
              textShadow: '0 0 50px hsl(174 40% 40% / 0.3), 0 4px 30px hsl(0 0% 0% / 0.5)'
            }}
          >
            {currentSlide.spot.title}
          </h2>
          
          {/* Tagline */}
          <p 
            className={cn(
              "text-sm sm:text-base italic font-light tracking-wide transition-all duration-700 delay-75",
              isTransitioning ? "opacity-0 translate-y-5" : "opacity-100 translate-y-0"
            )}
            style={{ color: 'hsl(220 15% 65%)' }}
          >
            "{currentSlide.tagline}"
          </p>

          {/* View Spot Link */}
          <Link
            to={`/spots/${currentSlide.spot.id}`}
            className={cn(
              "inline-flex items-center gap-2 mt-5 text-sm font-medium transition-all duration-300 group",
              isTransitioning ? "opacity-0" : "opacity-100"
            )}
            style={{ color: 'hsl(174 60% 55%)' }}
          >
            <span>View this gem</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Global Riders Badge - Bottom Left */}
      <div 
        className="absolute bottom-8 left-6 md:left-10 z-20 flex items-center gap-3 px-4 py-2.5 rounded-full animate-fade-up opacity-0"
        style={{ 
          animationDelay: '1s', 
          animationFillMode: 'forwards',
          background: 'hsl(0 0% 0% / 0.5)',
          backdropFilter: 'blur(10px)',
          border: '1px solid hsl(0 0% 100% / 0.1)',
        }}
      >
        <Globe size={16} style={{ color: 'hsl(174 60% 55%)' }} />
        <span className="text-xs font-medium tracking-wide" style={{ color: 'hsl(220 15% 80%)' }}>
          10K+ Riders from 50+ Countries
        </span>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 p-3 md:p-4 rounded-full transition-all duration-300"
        style={{
          background: 'hsl(0 0% 0% / 0.4)',
          backdropFilter: 'blur(10px)',
          border: '1px solid hsl(0 0% 100% / 0.1)',
          color: 'hsl(0 0% 90%)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'hsl(0 0% 0% / 0.6)';
          e.currentTarget.style.borderColor = 'hsl(174 50% 50% / 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'hsl(0 0% 0% / 0.4)';
          e.currentTarget.style.borderColor = 'hsl(0 0% 100% / 0.1)';
        }}
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 p-3 md:p-4 rounded-full transition-all duration-300"
        style={{
          background: 'hsl(0 0% 0% / 0.4)',
          backdropFilter: 'blur(10px)',
          border: '1px solid hsl(0 0% 100% / 0.1)',
          color: 'hsl(0 0% 90%)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'hsl(0 0% 0% / 0.6)';
          e.currentTarget.style.borderColor = 'hsl(174 50% 50% / 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'hsl(0 0% 0% / 0.4)';
          e.currentTarget.style.borderColor = 'hsl(0 0% 100% / 0.1)';
        }}
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-28 md:bottom-24 left-1/2 -translate-x-1/2 z-20 flex gap-2">
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
                ? "w-10 h-2"
                : "w-2 h-2 hover:bg-white/40"
            )}
            style={index === currentIndex ? {
              background: 'linear-gradient(90deg, hsl(174 60% 50%), hsl(16 80% 55%))',
              boxShadow: '0 0 20px hsl(174 60% 50% / 0.5)',
            } : {
              background: 'hsl(0 0% 100% / 0.25)',
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5 z-20 overflow-hidden">
        <div 
          key={`progress-${currentIndex}-${isPaused}`}
          className="h-full"
          style={{ 
            background: 'linear-gradient(90deg, hsl(174 60% 50%), hsl(16 80% 55%))',
            width: isPaused ? '100%' : '0%',
            animation: isPaused ? 'none' : 'hero-progress 6s linear forwards',
            boxShadow: '0 0 20px hsl(174 60% 50% / 0.5)',
          }}
        />
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-float opacity-50">
        <div 
          className="w-6 h-10 rounded-full flex items-start justify-center p-2"
          style={{ border: '1px solid hsl(0 0% 100% / 0.2)' }}
        >
          <div 
            className="w-1 h-2.5 rounded-full animate-pulse"
            style={{ background: 'hsl(174 60% 55%)' }}
          />
        </div>
      </div>

      {/* Slide counter */}
      <div className="absolute bottom-10 right-6 md:right-10 z-20 font-display text-sm tracking-wider opacity-50">
        <span style={{ color: 'hsl(174 60% 60%)' }}>{String(currentIndex + 1).padStart(2, '0')}</span>
        <span className="mx-1.5" style={{ color: 'hsl(0 0% 50%)' }}>/</span>
        <span style={{ color: 'hsl(0 0% 50%)' }}>{String(heroSlides.length).padStart(2, '0')}</span>
      </div>

      <style>{`
        @keyframes hero-progress {
          from { width: 0%; }
          to { width: 100%; }
        }
        @keyframes fog-drift {
          0%, 100% { transform: translateX(0) translateY(0); opacity: 0.4; }
          50% { transform: translateX(40px) translateY(-20px); opacity: 0.6; }
        }
      `}</style>
    </section>
  );
};

export default HeroCarousel;
