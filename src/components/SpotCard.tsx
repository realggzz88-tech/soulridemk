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
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        
        {/* Tags */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {spot.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="tag-pill">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-display text-2xl tracking-wide text-foreground mb-2 group-hover:text-earth-green-glow transition-colors duration-300">
          {spot.title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
          {spot.description}
        </p>
        
        {/* CTA */}
        <div className="flex items-center gap-2 text-earth-green-glow text-sm font-medium">
          <span>Discover</span>
          <ArrowRight 
            size={16} 
            className="transition-transform duration-300 group-hover:translate-x-1" 
          />
        </div>
      </div>
    </Link>
  );
};

export default SpotCard;
