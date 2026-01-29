import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, Star } from "lucide-react";
import { spots, type Spot } from "@/data/spots";

const dailyQuotes = [
  "Today's ride calls to your soul",
  "The road has chosen you today",
  "Let this path awaken your spirit",
  "Your soul's journey begins here",
  "Today, the horizon whispers your name",
];

const DailySoulGem = () => {
  // Get a "random" spot based on the day - consistent throughout the day
  const dailySpot = useMemo(() => {
    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 
      (1000 * 60 * 60 * 24)
    );
    const index = dayOfYear % spots.length;
    return spots[index];
  }, []);

  const dailyQuote = useMemo(() => {
    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 
      (1000 * 60 * 60 * 24)
    );
    return dailyQuotes[dayOfYear % dailyQuotes.length];
  }, []);

  return (
    <section className="py-16 px-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      <div className="absolute inset-0 road-pattern opacity-10" />
      
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <Star size={16} className="text-soul-amber fill-soul-amber" />
            <span className="font-display text-lg tracking-[0.3em] text-soul-amber uppercase">
              Daily Soul Gem
            </span>
            <Star size={16} className="text-soul-amber fill-soul-amber" />
          </div>
          <p className="text-muted-foreground italic text-sm">
            {dailyQuote}
          </p>
        </div>

        {/* Featured Card with glowing border */}
        <Link
          to={`/spots/${dailySpot.id}`}
          className="block group relative"
        >
          {/* Animated glowing gradient border */}
          <div 
            className="absolute -inset-1 rounded-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-500 blur-sm"
            style={{
              background: 'linear-gradient(135deg, hsl(215 40% 30%), hsl(160 50% 35%), hsl(32 85% 50%), hsl(160 50% 35%), hsl(215 40% 30%))',
              backgroundSize: '300% 300%',
              animation: 'gradient-shift 8s ease infinite',
            }}
          />
          
          {/* Card content */}
          <div className="relative rounded-2xl overflow-hidden bg-card">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Image side */}
              <div className="relative aspect-[4/3] md:aspect-auto overflow-hidden">
                <img
                  src={dailySpot.images[0]}
                  alt={dailySpot.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Overlay gradients */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-card md:block hidden" />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent md:hidden" />
                
                {/* Vignette */}
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{ boxShadow: 'inset 0 0 60px 15px hsl(0 0% 0% / 0.3)' }}
                />
                
                {/* Tags */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  {dailySpot.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="tag-pill">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Content side */}
              <div className="p-8 md:p-10 flex flex-col justify-center relative">
                {/* Decorative elements */}
                <div className="absolute top-4 right-4 opacity-20">
                  <Sparkles size={40} className="text-soul-amber" />
                </div>
                
                <p className="text-earth-green-glow italic text-sm mb-3 font-light">
                  "{dailySpot.poeticTagline}"
                </p>
                
                <h3 className="font-display text-3xl md:text-4xl tracking-wide mb-4 text-gradient-card">
                  {dailySpot.title}
                </h3>
                
                <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-3 text-high-contrast">
                  {dailySpot.description}
                </p>
                
                <div className="flex items-center gap-2 text-earth-green-glow font-medium group-hover:gap-3 transition-all">
                  <span>Discover Today's Gem</span>
                  <ArrowRight 
                    size={18} 
                    className="transition-transform duration-300 group-hover:translate-x-1" 
                  />
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* CSS for gradient animation */}
      <style>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </section>
  );
};

export default DailySoulGem;
