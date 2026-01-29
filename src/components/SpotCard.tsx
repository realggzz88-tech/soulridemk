import { Link } from "react-router-dom";
import type { Spot } from "@/data/spots";
import { ArrowRight } from "lucide-react";
import FavoriteButton from "./FavoriteButton";

interface SpotCardProps {
  spot: Spot;
  index: number;
}

const SpotCard = ({ spot, index }: SpotCardProps) => {
  return (
    <Link
      to={`/spots/${spot.id}`}
      className="spot-card group block film-grain"
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
        
        {/* Enhanced Gradient Overlay with vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-transparent" />
        
        {/* Vignette shadow */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            boxShadow: 'inset 0 0 80px 20px hsl(0 0% 0% / 0.4)'
          }}
        />
        
        {/* Poetic Tagline Overlay - enhanced */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
          <div className="bg-background/70 backdrop-blur-md px-5 py-3 rounded-xl border border-earth-green/40 shadow-[0_0_30px_hsl(var(--earth-green)/0.2)]">
            <p className="text-sm italic text-foreground font-light tracking-wide text-high-contrast">
              "{spot.poeticTagline}"
            </p>
          </div>
        </div>
        
        {/* Tags */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
          {spot.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="tag-pill">
              {tag}
            </span>
          ))}
        </div>

        {/* Favorite Button */}
        <div className="absolute top-4 right-4 z-10">
          <FavoriteButton spotId={spot.id} size="sm" />
        </div>

        {/* Line Art Overlay */}
        <div className="absolute inset-0 road-pattern opacity-15 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none" />
      </div>

      {/* Content */}
      <div className="p-6 relative">
        {/* Inner shadow effect */}
        <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-background/60 to-transparent pointer-events-none" />
        
        {/* Title with gradient */}
        <h3 className="font-display text-2xl tracking-wide mb-2 text-gradient-card group-hover:text-gradient-glow transition-all duration-300">
          {spot.title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2 text-high-contrast">
          {spot.description}
        </p>
        
        {/* Hidden poetic line that reveals on hover */}
        <p className="text-earth-green-glow text-xs italic mb-4 max-h-0 overflow-hidden group-hover:max-h-16 transition-all duration-500 opacity-0 group-hover:opacity-100">
          Feel the call of the curve... where the road becomes your meditation.
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
