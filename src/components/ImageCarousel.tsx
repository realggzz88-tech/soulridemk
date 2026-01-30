import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, X, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageCarouselProps {
  images: string[];
  title: string;
  poeticTagline?: string;
}

// Poetic captions for carousel images
const poeticCaptions = [
  "The moment the horizon opens",
  "Where silence speaks in colors",
  "A breath before the infinite",
  "Time pauses, beauty remains",
  "The road's secret whispered here",
  "Where earth meets sky in reverence",
  "A view that changes everything",
  "The world, distilled to wonder",
];

const ImageCarousel = ({ images, title, poeticTagline }: ImageCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const goToPrevious = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [isTransitioning, images.length]);

  const goToNext = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [isTransitioning, images.length]);

  useEffect(() => {
    const timer = setTimeout(() => setIsTransitioning(false), 700);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  // Auto-advance slides
  useEffect(() => {
    if (isFullscreen) return;
    const interval = setInterval(() => {
      if (!isTransitioning) {
        goToNext();
      }
    }, 6000);
    return () => clearInterval(interval);
  }, [isTransitioning, isFullscreen, goToNext]);

  // Parallax effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard navigation for fullscreen
  useEffect(() => {
    if (!isFullscreen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsFullscreen(false);
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, goToPrevious, goToNext]);

  const getCaption = (index: number) => {
    return poeticCaptions[index % poeticCaptions.length];
  };

  const parallaxOffset = scrollY * 0.3;

  // Fullscreen Gallery
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-background/98 backdrop-blur-md flex items-center justify-center">
        {/* Close button */}
        <button
          onClick={() => setIsFullscreen(false)}
          className="absolute top-6 right-6 p-3 rounded-full bg-muted/50 border border-border/50 text-foreground hover:bg-muted transition-all z-10"
        >
          <X size={24} />
        </button>

        {/* Main image */}
        <div className="relative w-full h-full flex items-center justify-center p-8 md:p-16">
          {images.map((image, index) => (
            <div
              key={index}
              className={cn(
                "absolute inset-8 md:inset-16 transition-all duration-700 ease-out",
                index === currentIndex 
                  ? "opacity-100 scale-100" 
                  : "opacity-0 scale-95"
              )}
            >
              <img
                src={image}
                alt={`${title} - Image ${index + 1}`}
                className="w-full h-full object-contain"
              />
            </div>
          ))}

          {/* Caption overlay */}
          <div className="absolute bottom-20 left-0 right-0 text-center">
            <p 
              className={cn(
                "text-foreground/80 italic text-lg md:text-xl tracking-wide transition-all duration-700",
                isTransitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
              )}
            >
              "{getCaption(currentIndex)}"
            </p>
            <p className="text-muted-foreground text-sm mt-2">{title}</p>
          </div>
        </div>

        {/* Navigation */}
        <button
          onClick={goToPrevious}
          className="absolute left-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-muted/50 border border-border/50 text-foreground hover:bg-muted transition-all"
        >
          <ChevronLeft size={28} />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-muted/50 border border-border/50 text-foreground hover:bg-muted transition-all"
        >
          <ChevronRight size={28} />
        </button>

        {/* Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (!isTransitioning) {
                  setIsTransitioning(true);
                  setCurrentIndex(index);
                }
              }}
              className={cn(
                "h-2 rounded-full transition-all duration-500",
                index === currentIndex
                  ? "bg-soul-amber w-10"
                  : "bg-foreground/30 w-2 hover:bg-foreground/50"
              )}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-[16/9] sm:aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-xl group film-grain">
      {/* Images with parallax and enhanced fade transition */}
      <div 
        className="relative w-full h-full"
        style={{ transform: `translateY(${parallaxOffset}px)` }}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className={cn(
              "absolute inset-0 transition-all duration-700 ease-in-out",
              index === currentIndex 
                ? "opacity-100 scale-100" 
                : "opacity-0 scale-105"
            )}
          >
            <img
              src={image}
              alt={`${title} - Image ${index + 1}`}
              className="w-full h-full object-cover"
              style={{ transform: `scale(${1 + parallaxOffset * 0.0003})` }}
            />
          </div>
        ))}
      </div>

      {/* Enhanced Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-background/40 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/50 via-transparent to-background/50 pointer-events-none" />
      <div className="absolute inset-0 road-pattern pointer-events-none opacity-15" />
      
      {/* Artistic vignette - stronger */}
      <div className="absolute inset-0 pointer-events-none" style={{
        boxShadow: 'inset 0 0 150px 40px hsl(0 0% 0% / 0.5)'
      }} />

      {/* Poetic Caption Overlay */}
      <div className="absolute bottom-16 sm:bottom-20 md:bottom-24 left-0 right-0 text-center pointer-events-none px-4">
        <p 
          className={cn(
            "text-foreground italic text-sm sm:text-base md:text-lg tracking-wide transition-all duration-700 text-high-contrast",
            isTransitioning ? "opacity-0 translate-y-3" : "opacity-100 translate-y-0"
          )}
          style={{ textShadow: '0 2px 10px hsl(0 0% 0% / 0.6)' }}
        >
          "{getCaption(currentIndex)}"
        </p>
      </div>

      {/* Poetic Tagline at top */}
      {poeticTagline && (
        <div className="absolute top-6 left-0 right-0 text-center pointer-events-none">
          <p 
            className="text-earth-green-glow text-sm md:text-base font-light tracking-[0.2em] uppercase"
            style={{ textShadow: '0 2px 8px hsl(0 0% 0% / 0.5)' }}
          >
            {poeticTagline}
          </p>
        </div>
      )}

      {/* Fullscreen button */}
      <button
        onClick={() => setIsFullscreen(true)}
        className="absolute top-6 right-6 p-2 rounded-full bg-background/50 backdrop-blur-sm border border-border/50 text-foreground hover:bg-background/80 transition-all duration-300 opacity-0 group-hover:opacity-100"
        aria-label="View fullscreen"
      >
        <Maximize2 size={18} />
      </button>

      {/* Navigation Buttons - appear on hover, better touch targets on mobile */}
      <button
        onClick={goToPrevious}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-background/50 backdrop-blur-sm border border-border/50 text-foreground hover:bg-background/80 transition-all duration-300 opacity-60 sm:opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95"
        aria-label="Previous image"
      >
        <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-background/50 backdrop-blur-sm border border-border/50 text-foreground hover:bg-background/80 transition-all duration-300 opacity-60 sm:opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95"
        aria-label="Next image"
      >
        <ChevronRight size={20} className="sm:w-6 sm:h-6" />
      </button>

      {/* Enhanced Dots Indicator - better mobile sizing */}
      <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 max-w-[85vw]">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (!isTransitioning) {
                setIsTransitioning(true);
                setCurrentIndex(index);
              }
            }}
            className={cn(
              "h-1.5 sm:h-2 rounded-full transition-all duration-500 flex-shrink-0",
              index === currentIndex
                ? "bg-soul-amber w-6 sm:w-8 shadow-[0_0_12px_hsl(var(--amber-soul)/0.6)]"
                : "bg-foreground/30 w-1.5 sm:w-2 hover:bg-foreground/50"
            )}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground/10">
        <div 
          className="h-full bg-gradient-to-r from-mountain-blue via-earth-green to-soul-amber transition-all duration-700"
          style={{ width: `${((currentIndex + 1) / images.length) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default ImageCarousel;
