import { Link } from "react-router-dom";
import type { Spot } from "@/data/spots";
import { ArrowRight, Bike } from "lucide-react";
import FavoriteButton from "./FavoriteButton";
import ShareButtons from "./ShareButtons";

interface SpotCardProps {
  spot: Spot;
  index: number;
}

const SpotCard = ({ spot, index }: SpotCardProps) => {
  return (
    <div
      className="group block rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 soul-card"
      style={{
        animationDelay: `${index * 100}ms`,
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
          
          {/* Poetic Tagline Overlay with soul glow */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
            <div 
              className="backdrop-blur-md px-5 py-3 rounded-xl border"
              style={{
                backgroundColor: 'hsl(222 40% 10% / 0.9)',
                borderColor: 'hsl(160 84% 39% / 0.3)',
                boxShadow: '0 0 20px hsl(160 84% 39% / 0.15)'
              }}
            >
              <p className="text-sm italic text-foreground font-light tracking-wide">
                "{spot.poeticTagline}"
              </p>
            </div>
          </div>
          
          {/* Tags */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
            {/* Region badge with soul amber */}
            <span 
              className="px-2 py-1 rounded-md text-xs font-medium tracking-wide text-white"
              style={{ 
                background: 'linear-gradient(135deg, hsl(38 95% 55%) 0%, hsl(25 95% 53%) 100%)',
              }}
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
          
          {/* Small rider silhouette icon */}
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-60 transition-opacity duration-300">
            <Bike className="h-6 w-6 text-white/60" />
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
          
          {/* CTA with animated arrow */}
          <div className="flex items-center gap-2 text-sm font-medium arrow-animate" style={{ color: 'hsl(160 84% 50%)' }}>
            <span>Discover</span>
            <ArrowRight 
              size={16} 
              className="arrow-icon transition-transform duration-300" 
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