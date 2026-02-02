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
      className="group block rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
      style={{
        animationDelay: `${index * 100}ms`,
        background: 'linear-gradient(180deg, hsl(20 18% 12%) 0%, hsl(25 15% 10%) 100%)',
        border: '1px solid hsl(25 15% 18%)',
        boxShadow: '0 4px 24px -4px hsl(0 0% 0% / 0.4)',
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
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to top, hsl(20 15% 8% / 0.9) 0%, hsl(20 15% 8% / 0.3) 40%, transparent 70%)',
            }}
          />
          
          {/* Poetic Tagline Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
            <div 
              className="backdrop-blur-md px-5 py-3 rounded-xl"
              style={{
                backgroundColor: 'hsl(20 15% 10% / 0.9)',
                border: '1px solid hsl(15 70% 50% / 0.3)',
                boxShadow: '0 0 20px hsl(15 70% 50% / 0.2)'
              }}
            >
              <p 
                className="text-sm italic font-light tracking-wide"
                style={{ 
                  color: 'hsl(35 20% 85%)',
                  fontFamily: "'Caveat', cursive",
                  fontSize: '1rem',
                }}
              >
                "{spot.poeticTagline}"
              </p>
            </div>
          </div>
          
          {/* Tags */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
            {/* Region badge */}
            <span 
              className="px-3 py-1 rounded-full text-xs font-medium tracking-wide"
              style={{ 
                background: 'linear-gradient(135deg, hsl(15 70% 50%) 0%, hsl(25 75% 55%) 100%)',
                color: 'hsl(0 0% 100%)',
                fontSize: '11px',
              }}
            >
              {spot.region}
            </span>
            {spot.tags.slice(0, 2).map((tag) => (
              <span 
                key={tag} 
                className="px-3 py-1 rounded-full text-xs tracking-wide"
                style={{
                  backgroundColor: 'hsl(170 60% 45% / 0.2)',
                  color: 'hsl(170 60% 60%)',
                  border: '1px solid hsl(170 60% 45% / 0.3)',
                  fontSize: '11px',
                }}
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
        <div className="p-5 sm:p-6">
          {/* Title */}
          <h3 
            className="text-xl sm:text-2xl font-bold tracking-tight mb-2 transition-colors"
            style={{ color: 'hsl(0 0% 100%)' }}
          >
            {spot.title}
          </h3>
          <p 
            className="text-sm leading-relaxed mb-4 line-clamp-2"
            style={{ color: 'hsl(30 10% 60%)' }}
          >
            {spot.description}
          </p>
          
          {/* CTA */}
          <div 
            className="flex items-center gap-2 text-sm font-medium tracking-wide arrow-animate"
            style={{ color: 'hsl(15 70% 55%)' }}
          >
            <span>Discover</span>
            <ArrowRight 
              size={16} 
              className="arrow-icon transition-transform duration-300" 
            />
          </div>
        </div>
      </Link>
      
      {/* Share buttons */}
      <div className="px-5 sm:px-6 pb-5 pt-0">
        <ShareButtons variant="compact" spotName={spot.title} />
      </div>
    </div>
  );
};

export default SpotCard;
