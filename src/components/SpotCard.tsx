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
      className="group block rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
      style={{
        animationDelay: `${index * 100}ms`,
        backgroundColor: 'hsl(180 15% 11%)',
        border: '1px solid hsl(140 15% 25% / 0.3)',
        boxShadow: '0 4px 20px hsl(0 0% 0% / 0.3)',
      }}
    >
      <Link to={`/spots/${spot.id}`}>
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={spot.images[0]}
            alt={spot.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            style={{ filter: 'sepia(10%) saturate(90%)' }}
          />
          
          {/* Vintage Gradient Overlay */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to top, hsl(200 20% 8% / 0.9) 0%, hsl(200 20% 8% / 0.4) 40%, transparent 70%)',
            }}
          />
          
          {/* Poetic Tagline Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
            <div 
              className="backdrop-blur-md px-5 py-3 rounded-xl"
              style={{
                backgroundColor: 'hsl(180 15% 10% / 0.9)',
                border: '1px solid hsl(140 22% 42% / 0.4)',
                boxShadow: '0 0 20px hsl(140 22% 42% / 0.2)'
              }}
            >
              <p 
                className="text-sm italic font-light tracking-wide"
                style={{ 
                  color: 'hsl(40 30% 90%)',
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
              className="px-2 py-1 rounded-md text-xs font-medium tracking-wide"
              style={{ 
                background: 'linear-gradient(135deg, hsl(20 45% 38%) 0%, hsl(25 40% 45%) 100%)',
                color: 'hsl(40 30% 94%)',
                fontFamily: "'Special Elite', monospace",
                fontSize: '10px',
              }}
            >
              {spot.region}
            </span>
            {spot.tags.slice(0, 2).map((tag) => (
              <span 
                key={tag} 
                className="px-2 py-1 rounded-md text-xs tracking-wide"
                style={{
                  backgroundColor: 'hsl(140 22% 42% / 0.25)',
                  color: 'hsl(140 22% 65%)',
                  border: '1px solid hsl(140 22% 42% / 0.3)',
                  fontFamily: "'Special Elite', monospace",
                  fontSize: '10px',
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
          
          {/* Small rider silhouette icon */}
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-60 transition-opacity duration-300">
            <Bike className="h-6 w-6" style={{ color: 'hsl(40 30% 80% / 0.6)' }} />
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          {/* Title */}
          <h3 
            className="text-xl sm:text-2xl font-bold tracking-wider mb-2 transition-colors"
            style={{
              fontFamily: "'Bitter', 'Rockwell', Georgia, serif",
              color: 'hsl(40 30% 94%)',
            }}
          >
            {spot.title}
          </h3>
          <p 
            className="text-sm leading-relaxed mb-4 line-clamp-2"
            style={{
              fontFamily: "'Libre Baskerville', Georgia, serif",
              color: 'hsl(40 15% 55%)',
              lineHeight: '1.7',
            }}
          >
            {spot.description}
          </p>
          
          {/* CTA */}
          <div 
            className="flex items-center gap-2 text-sm font-medium tracking-wide arrow-animate"
            style={{ color: 'hsl(140 22% 50%)' }}
          >
            <span style={{ fontFamily: "'Bitter', serif" }}>Discover</span>
            <ArrowRight 
              size={16} 
              className="arrow-icon transition-transform duration-300" 
            />
          </div>
        </div>
      </Link>
      
      {/* Share buttons */}
      <div className="px-4 sm:px-6 pb-4 sm:pb-5 pt-0">
        <ShareButtons variant="compact" spotName={spot.title} />
      </div>
    </div>
  );
};

export default SpotCard;
