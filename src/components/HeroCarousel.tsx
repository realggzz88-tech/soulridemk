import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { spots } from "@/data/spots";

// Select 12 featured spots for the hero carousel
const featuredSpots = [
  spots.find(s => s.id === "treskavec-monastery-cliff"),
  spots.find(s => s.id === "galicica-pass"),
  spots.find(s => s.id === "matka-canyon-overlook"),
  spots.find(s => s.id === "st-jovan-kaneo-overlook"),
  spots.find(s => s.id === "vodno-mountain-cross"),
  spots.find(s => s.id === "pelister-viewpoint"),
  spots.find(s => s.id === "mavrovo-lake-loop"),
  spots.find(s => s.id === "galicica-national-park-summit"),
  spots.find(s => s.id === "kokino-observatory-overlook"),
  spots.find(s => s.id === "smolare-waterfall"),
  spots.find(s => s.id === "baba-mountain-summit"),
  spots.find(s => s.id === "demir-kapija-gorge"),
].filter(Boolean) as typeof spots;

// Poetic subtitles for slides
const poeticSubtitles = [
  "Where the road meets the heavens",
  "Discover soul views that call you home",
  "Where silence speaks in colors",
  "A breath before the infinite",
  "The moment the horizon opens",
  "Where earth and sky become one",
  "Feel the call of the wild curve",
  "Where beauty awaits the brave",
  "Roads that speak to your soul",
  "Where the journey becomes the destination",
  "Ride into the unknown beauty",
  "Where mountains whisper secrets",
];

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
    setCurrentIndex((prev) => (prev === 0 ? featuredSpots.length - 1 : prev - 1));
  }, [isTransitioning]);

  const goToNext = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev === featuredSpots.length - 1 ? 0 : prev + 1));
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

  const currentSpot = featuredSpots[currentIndex];

  return (
    <section 
      ref={carouselRef}
      className="relative h-[100svh] min-h-[500px] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Background Images */}
      {featuredSpots.map((spot, index) => (
        <div
          key={spot.id}
          className={cn(
            "absolute inset-0 transition-all duration-1000 ease-out",
            index === currentIndex 
              ? "opacity-100 scale-100" 
              : "opacity-0 scale-105"
          )}
        >
          <img
            src={spot.images[0]}
            alt={spot.title}
            className="w-full h-full object-cover"
            style={{ 
              filter: 'brightness(0.6) contrast(1.1) saturate(0.9)',
              objectPosition: 'center 40%'
            }}
          />
        </div>
      ))}

      {/* Artistic Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/20 to-background pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-midnight-blue/30 via-transparent to-deep-forest/20 pointer-events-none" />
      <div className="absolute inset-0 hero-vignette pointer-events-none" />
      
      {/* Line art overlays */}
      <div className="absolute inset-0 road-art-overlay opacity-30 pointer-events-none" />
      <div className="absolute inset-0 mountain-contours opacity-20 pointer-events-none" />
      
      {/* Fog effect at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />
      <div className="absolute inset-0 fog-overlay pointer-events-none" />
      
      {/* Film grain */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
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

        {/* Dynamic Spot Title */}
        <div className="text-center max-w-4xl mx-auto px-4">
          <p 
            className={cn(
              "text-soul-amber text-xs sm:text-sm md:text-base uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-2 sm:mb-3 transition-all duration-700",
              isTransitioning ? "opacity-0 -translate-y-2" : "opacity-100 translate-y-0"
            )}
            style={{ textShadow: '0 2px 10px hsl(0 0% 0% / 0.5)' }}
          >
            Discover Soul Views
          </p>
          
          <h2 
            className={cn(
              "font-display text-2xl sm:text-3xl md:text-5xl lg:text-6xl tracking-wider mb-3 sm:mb-4 text-title transition-all duration-700",
              isTransitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
            )}
            style={{ textShadow: '0 4px 20px hsl(0 0% 0% / 0.6)' }}
          >
            {currentSpot.title}
          </h2>
          
          <p 
            className={cn(
              "text-foreground/90 text-base sm:text-lg md:text-xl italic font-light tracking-wide mb-6 sm:mb-8 max-w-2xl mx-auto transition-all duration-700 delay-100 px-2",
              isTransitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
            )}
            style={{ textShadow: '0 2px 10px hsl(0 0% 0% / 0.5)' }}
          >
            "{poeticSubtitles[currentIndex % poeticSubtitles.length]}"
          </p>

          {/* CTA Button */}
          <Link
            to={`/spots/${currentSpot.id}`}
            className={cn(
              "btn-glow inline-flex items-center gap-3 px-10 py-4 text-base font-display tracking-widest rounded-xl transition-all duration-500 hover:scale-105 group",
              isTransitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
            )}
            style={{
              background: "linear-gradient(135deg, hsl(215 40% 20%) 0%, hsl(160 40% 25%) 50%, hsl(32 70% 45%) 100%)",
              color: "hsl(40 15% 96%)",
              boxShadow: "0 4px 40px -5px hsl(160 40% 28% / 0.5), 0 0 60px -10px hsl(32 85% 52% / 0.3), inset 0 1px 0 0 hsl(160 50% 50% / 0.3)",
              transitionDelay: "150ms"
            }}
          >
            <span>EXPLORE THIS GEM</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
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

      {/* Pagination Dots - Hidden on very small screens, show fewer on mobile */}
      <div className="absolute bottom-24 md:bottom-20 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 md:gap-2 max-w-[80vw] overflow-hidden">
        {featuredSpots.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (!isTransitioning) {
                setIsTransitioning(true);
                setCurrentIndex(index);
              }
            }}
            className={cn(
              "h-1.5 md:h-2 rounded-full transition-all duration-500 flex-shrink-0",
              index === currentIndex
                ? "bg-soul-amber w-6 md:w-8 shadow-[0_0_15px_hsl(var(--amber-soul)/0.6)]"
                : "bg-foreground/30 w-1.5 md:w-2 hover:bg-foreground/50"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-foreground/10 z-20">
        <div 
          className="h-full bg-gradient-to-r from-mountain-blue via-earth-green to-soul-amber transition-all duration-300"
          style={{ 
            width: isPaused ? `${((currentIndex + 1) / featuredSpots.length) * 100}%` : "0%",
            animation: isPaused ? "none" : `progress-bar 5s linear infinite`
          }}
        />
        <style>{`
          @keyframes progress-bar {
            0% { width: 0%; }
            100% { width: ${((currentIndex + 1) / featuredSpots.length) * 100}%; }
          }
        `}</style>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-float">
        <div className="w-6 h-10 rounded-full border-2 border-foreground/40 flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-foreground/60 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Corner decorative elements */}
      <div className="absolute top-20 left-8 w-32 h-32 border-l-2 border-t-2 border-earth-green/25 rounded-tl-3xl opacity-60 hidden md:block pointer-events-none" />
      <div className="absolute bottom-32 right-8 w-32 h-32 border-r-2 border-b-2 border-amber-soul/25 rounded-br-3xl opacity-60 hidden md:block pointer-events-none" />
    </section>
  );
};

export default HeroCarousel;