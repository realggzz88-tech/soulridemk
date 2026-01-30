import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface RoutePhoto {
  url: string;
  title: string;
  caption: string;
}

interface RoutePhotoSliderProps {
  photos: RoutePhoto[];
  routeTitle: string;
}

const RoutePhotoSlider = ({ photos, routeTitle }: RoutePhotoSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const goToPrevious = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  }, [isTransitioning, photos.length]);

  const goToNext = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  }, [isTransitioning, photos.length]);

  // Reset transition lock
  useEffect(() => {
    const timer = setTimeout(() => setIsTransitioning(false), 600);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  // Auto-advance every 4 seconds
  useEffect(() => {
    if (isPaused || photos.length <= 1) return;
    const interval = setInterval(() => {
      if (!isTransitioning) goToNext();
    }, 4000);
    return () => clearInterval(interval);
  }, [isTransitioning, isPaused, goToNext, photos.length]);

  if (photos.length === 0) return null;

  const currentPhoto = photos[currentIndex];

  return (
    <section 
      className="relative w-full h-[50vh] min-h-[350px] max-h-[500px] overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Photo Slides */}
      {photos.map((photo, index) => (
        <div
          key={`${photo.url}-${index}`}
          className={cn(
            "absolute inset-0 transition-all duration-[800ms] ease-out",
            index === currentIndex ? "opacity-100" : "opacity-0"
          )}
        >
          <img
            src={photo.url}
            alt={photo.title}
            className="w-full h-full object-cover"
            style={{ 
              filter: 'brightness(0.5) contrast(1.1) saturate(0.9)',
              objectPosition: 'center 40%'
            }}
          />
        </div>
      ))}

      {/* Dark Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(220_25%_6%/0.7)] via-transparent to-[hsl(220_20%_8%/0.9)] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />
      
      {/* Vignette */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 50%, hsl(220 20% 5% / 0.5) 100%)'
        }}
      />

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-4">
        {/* Route Title */}
        <p 
          className="text-xs md:text-sm uppercase tracking-[0.3em] mb-3"
          style={{ 
            color: 'hsl(160 35% 50%)',
            textShadow: '0 0 20px hsl(160 40% 35% / 0.4)'
          }}
        >
          {routeTitle}
        </p>
        
        {/* Photo Caption - Poetic */}
        <h2 
          className={cn(
            "font-display text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-wider text-center max-w-3xl transition-all duration-600",
            isTransitioning ? "opacity-0 translate-y-3" : "opacity-100 translate-y-0"
          )}
          style={{ 
            color: 'hsl(40 20% 92%)',
            textShadow: '0 0 30px hsl(32 50% 40% / 0.3), 0 4px 20px hsl(0 0% 0% / 0.5)'
          }}
        >
          {currentPhoto.caption}
        </h2>
        
        {/* Spot Name */}
        <p 
          className={cn(
            "text-sm md:text-base mt-3 italic transition-all duration-600 delay-75",
            isTransitioning ? "opacity-0 translate-y-3" : "opacity-100 translate-y-0"
          )}
          style={{ 
            color: 'hsl(32 45% 60%)',
            textShadow: '0 2px 10px hsl(0 0% 0% / 0.4)'
          }}
        >
          — {currentPhoto.title}
        </p>
      </div>

      {/* Navigation Arrows */}
      {photos.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-[hsl(220_20%_10%/0.5)] backdrop-blur-sm border border-[hsl(0_0%_100%/0.1)] text-[hsl(0_0%_90%)] hover:bg-[hsl(220_20%_15%/0.7)] hover:border-[hsl(32_50%_50%/0.3)] transition-all duration-300"
            aria-label="Previous photo"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-[hsl(220_20%_10%/0.5)] backdrop-blur-sm border border-[hsl(0_0%_100%/0.1)] text-[hsl(0_0%_90%)] hover:bg-[hsl(220_20%_15%/0.7)] hover:border-[hsl(32_50%_50%/0.3)] transition-all duration-300"
            aria-label="Next photo"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {/* Pagination Dots */}
      {photos.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {photos.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (!isTransitioning) {
                  setIsTransitioning(true);
                  setCurrentIndex(index);
                }
              }}
              className={cn(
                "rounded-full transition-all duration-300",
                index === currentIndex
                  ? "w-6 h-2 bg-gradient-to-r from-[hsl(160_40%_40%)] to-[hsl(32_55%_50%)]"
                  : "w-2 h-2 bg-[hsl(0_0%_100%/0.3)] hover:bg-[hsl(0_0%_100%/0.5)]"
              )}
              style={index === currentIndex ? { boxShadow: '0 0 12px hsl(32 55% 45% / 0.5)' } : {}}
              aria-label={`Go to photo ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Progress Bar */}
      {photos.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[hsl(0_0%_100%/0.1)] z-20 overflow-hidden">
          <div 
            key={`progress-${currentIndex}-${isPaused}`}
            className="h-full bg-gradient-to-r from-[hsl(160_40%_45%)] to-[hsl(32_55%_50%)]"
            style={{ 
              width: isPaused ? '100%' : '0%',
              animation: isPaused ? 'none' : 'route-slider-progress 4s linear forwards'
            }}
          />
        </div>
      )}

      <style>{`
        @keyframes route-slider-progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </section>
  );
};

export default RoutePhotoSlider;
