import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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

  const goToPrevious = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsTransitioning(false), 700);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isTransitioning) {
        goToNext();
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [isTransitioning]);

  const getCaption = (index: number) => {
    return poeticCaptions[index % poeticCaptions.length];
  };

  return (
    <div className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-xl group">
      {/* Images with enhanced fade transition */}
      <div className="relative w-full h-full">
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
              className="w-full h-full object-cover transition-transform duration-[8000ms] ease-out group-hover:scale-105"
            />
          </div>
        ))}
      </div>

      {/* Enhanced Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-background/30 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-transparent to-background/40 pointer-events-none" />
      <div className="absolute inset-0 road-pattern pointer-events-none opacity-20" />
      
      {/* Artistic vignette */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at center, transparent 30%, hsl(var(--background) / 0.4) 100%)'
      }} />

      {/* Poetic Caption Overlay */}
      <div className="absolute bottom-16 md:bottom-20 left-0 right-0 text-center pointer-events-none">
        <p 
          className={cn(
            "text-foreground/80 italic text-sm md:text-base tracking-wide transition-all duration-700",
            isTransitioning ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
          )}
        >
          "{getCaption(currentIndex)}"
        </p>
      </div>

      {/* Poetic Tagline at top */}
      {poeticTagline && (
        <div className="absolute top-6 left-0 right-0 text-center pointer-events-none">
          <p className="text-earth-green-glow/90 text-sm md:text-base font-light tracking-widest uppercase">
            {poeticTagline}
          </p>
        </div>
      )}

      {/* Navigation Buttons - appear on hover */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-background/50 backdrop-blur-sm border border-border/50 text-foreground hover:bg-background/80 transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110"
        aria-label="Previous image"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-background/50 backdrop-blur-sm border border-border/50 text-foreground hover:bg-background/80 transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110"
        aria-label="Next image"
      >
        <ChevronRight size={24} />
      </button>

      {/* Enhanced Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
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
                ? "bg-soul-amber w-8 shadow-[0_0_10px_hsl(var(--amber-soul)/0.5)]"
                : "bg-foreground/30 w-2 hover:bg-foreground/50"
            )}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground/10">
        <div 
          className="h-full bg-gradient-to-r from-earth-green to-soul-amber transition-all duration-700"
          style={{ width: `${((currentIndex + 1) / images.length) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default ImageCarousel;
