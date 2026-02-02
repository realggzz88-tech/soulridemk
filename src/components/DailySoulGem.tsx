import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, Star } from "lucide-react";
import { spots } from "@/data/spots";

const dailyQuotes = [
  "Денешното возење ја повикува твојата душа",
  "Патот те избра денес",
  "Нека оваа патека ти го разбуди духот",
  "Твоето патување со душа започнува тука",
  "Денес, хоризонтот го шепоти твоето име",
];

const DailySoulGem = () => {
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
    <section className="relative overflow-hidden">
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <Star size={16} style={{ color: 'hsl(15 70% 55%)' }} className="fill-current" />
            <span 
              className="text-sm tracking-[0.2em] uppercase font-medium"
              style={{ color: 'hsl(15 70% 60%)' }}
            >
              Дневен бисер
            </span>
            <Star size={16} style={{ color: 'hsl(15 70% 55%)' }} className="fill-current" />
          </div>
          <p 
            className="font-script text-lg"
            style={{ color: 'hsl(30 15% 60%)' }}
          >
            {dailyQuote}
          </p>
        </div>

        {/* Featured Card */}
        <Link
          to={`/spots/${dailySpot.id}`}
          className="block group relative"
        >
          {/* Glowing border */}
          <div 
            className="absolute -inset-1 rounded-3xl opacity-50 group-hover:opacity-80 transition-opacity duration-500 blur-sm"
            style={{
              background: 'linear-gradient(135deg, hsl(15 70% 50%), hsl(170 60% 45%), hsl(35 80% 55%), hsl(170 60% 45%), hsl(15 70% 50%))',
              backgroundSize: '300% 300%',
              animation: 'gradient-shift 8s ease infinite',
            }}
          />
          
          {/* Card content */}
          <div 
            className="relative rounded-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, hsl(20 18% 12%) 0%, hsl(25 15% 10%) 100%)',
            }}
          >
            <div className="grid md:grid-cols-2 gap-0">
              {/* Image side */}
              <div className="relative aspect-[4/3] md:aspect-auto overflow-hidden">
                <img
                  src={dailySpot.images[0]}
                  alt={dailySpot.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Overlay gradients */}
                <div 
                  className="absolute inset-0 md:block hidden"
                  style={{ background: 'linear-gradient(to right, transparent 50%, hsl(20 18% 12%) 100%)' }}
                />
                <div 
                  className="absolute inset-0 md:hidden"
                  style={{ background: 'linear-gradient(to top, hsl(20 18% 12%) 0%, transparent 50%)' }}
                />
                
                {/* Vignette */}
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{ boxShadow: 'inset 0 0 60px 15px hsl(0 0% 0% / 0.3)' }}
                />
                
                {/* Tags */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  {dailySpot.tags.slice(0, 2).map((tag) => (
                    <span 
                      key={tag} 
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{
                        background: 'hsl(15 70% 50% / 0.2)',
                        color: 'hsl(15 70% 65%)',
                        border: '1px solid hsl(15 70% 50% / 0.3)',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Content side */}
              <div className="p-8 md:p-10 flex flex-col justify-center relative">
                {/* Decorative elements */}
                <div className="absolute top-4 right-4 opacity-20">
                  <Sparkles size={40} style={{ color: 'hsl(15 70% 55%)' }} />
                </div>
                
                <p 
                  className="font-script text-lg mb-3"
                  style={{ color: 'hsl(170 60% 55%)' }}
                >
                  "{dailySpot.poeticTagline}"
                </p>
                
                <h3 
                  className="text-3xl md:text-4xl font-bold tracking-tight mb-4"
                  style={{ color: 'hsl(0 0% 100%)' }}
                >
                  {dailySpot.title}
                </h3>
                
                <p 
                  className="text-sm leading-relaxed mb-6 line-clamp-3"
                  style={{ color: 'hsl(30 10% 60%)' }}
                >
                  {dailySpot.description}
                </p>
                
                <div 
                  className="flex items-center gap-2 font-medium group-hover:gap-3 transition-all"
                  style={{ color: 'hsl(15 70% 55%)' }}
                >
                  <span>Откриј го денешниот бисер</span>
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
