import { Link } from "react-router-dom";
import type { Spot } from "@/data/spots";
import { ArrowRight } from "lucide-react";

interface SpotCardProps {
  spot: Spot;
  index: number;
}

const SpotCard = ({ spot, index }: SpotCardProps) => {
  return (
    <Link
      to={`/spots/${spot.id}`}
      className="spot-card group block"
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={spot.images[0]}
          alt={spot.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        
        {/* Poetic Tagline Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
          <div className="bg-background/60 backdrop-blur-sm px-4 py-2 rounded-lg border border-earth-green/30">
            <p className="text-sm italic text-foreground/90 font-light tracking-wide">
              "{spot.poeticTagline}"
            </p>
          </div>
        </div>
        
        {/* Tags */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {spot.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="tag-pill">
              {tag}
            </span>
          ))}
        </div>

        {/* Line Art Overlay */}
        <div className="absolute inset-0 road-pattern opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
      </div>

      {/* Content */}
      <div className="p-6 relative">
        {/* Inner shadow effect */}
        <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-background/50 to-transparent pointer-events-none" />
        
        <h3 className="font-display text-2xl tracking-wide text-foreground mb-2 group-hover:text-gradient-glow transition-all duration-300">
          {spot.title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">
          {spot.description}
        </p>
        
        {/* Hidden poetic line that reveals on hover */}
        <p className="text-earth-green-glow/80 text-xs italic mb-4 max-h-0 overflow-hidden group-hover:max-h-12 transition-all duration-500 opacity-0 group-hover:opacity-100">
          Twists that carve through time, revealing landscapes that mirror your soul...
        </p>
        
        {/* CTA */}
        <div className="flex items-center gap-2 text-earth-green-glow text-sm font-medium">
          <span>Discover</span>
          <ArrowRight 
            size={16} 
            className="transition-transform duration-300 group-hover:translate-x-2" 
          />
        </div>
      </div>
    </Link>
  );
};

export default SpotCard;
