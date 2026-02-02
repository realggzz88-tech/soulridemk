import { Link } from "react-router-dom";
import type { Spot } from "@/data/spots";
import { ArrowRight } from "lucide-react";
import FavoriteButton from "./FavoriteButton";
import ShareButtons from "./ShareButtons";

interface SpotCardProps {
  spot: Spot;
  index: number;
}

const SpotCard = ({ spot, index }: SpotCardProps) => {
  return (
    <div
      className="group block rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
      style={{
        animationDelay: `${index * 100}ms`,
        backgroundColor: 'hsl(222 40% 10%)',
        border: '1px solid hsl(222 20% 18%)',
        boxShadow: '0 4px 24px -4px hsl(222 47% 3% / 0.5)',
      }}
    >
      <Link to={`/spots/${spot.id}`}>
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={spot.images[0]}
            alt={spot.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          
          {/* Poetic Tagline Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
            <div 
              className="backdrop-blur-md px-5 py-3 rounded-xl border"
              style={{
                backgroundColor: 'hsl(222 40% 10% / 0.9)',
                borderColor: 'hsl(160 84% 39% / 0.3)'
              }}
            >
              <p className="text-sm italic text-foreground font-light tracking-wide">
                "{spot.poeticTagline}"
              </p>
            </div>
          </div>
          
          {/* Tags */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
            {/* Region badge */}
            <span 
              className="px-2 py-1 rounded-md text-xs font-medium tracking-wide text-white"
              style={{ backgroundColor: 'hsl(32 95% 50% / 0.9)' }}
            >
              {spot.region}
            </span>
            {spot.tags.slice(0, 2).map((tag) => (
              <span 
                key={tag} 
                className="tag-pill"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Favorite Button */}
          <div className="absolute top-4 right-4 z-10">
            <FavoriteButton spotId={spot.id} size="sm" />
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          {/* Title */}
          <h3 className="font-display text-xl sm:text-2xl font-bold tracking-tight mb-2 text-foreground group-hover:text-primary transition-colors">
            {spot.title}
          </h3>
          <p className="text-sm leading-relaxed mb-4 line-clamp-2 text-muted-foreground">
            {spot.description}
          </p>
          
          {/* CTA */}
          <div className="flex items-center gap-2 text-sm font-medium" style={{ color: 'hsl(160 84% 50%)' }}>
            <span>Discover</span>
            <ArrowRight 
              size={16} 
              className="transition-transform duration-300 group-hover:translate-x-2" 
            />
          </div>
        </div>
      </Link>
      
      {/* Share buttons - outside main link */}
      <div className="px-4 sm:px-6 pb-4 sm:pb-5 pt-0">
        <ShareButtons variant="compact" spotName={spot.title} />
      </div>
    </div>
  );
};

export default SpotCard;
