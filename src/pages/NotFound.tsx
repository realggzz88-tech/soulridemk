import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home, MapPin, Compass } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 grain-overlay"
      style={{ backgroundColor: 'hsl(200 20% 8%)' }}
    >
      <div className="text-center max-w-lg">
        {/* Lost rider illustration */}
        <div 
          className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-8"
          style={{
            background: 'linear-gradient(135deg, hsl(140 22% 42% / 0.2) 0%, hsl(20 45% 38% / 0.2) 100%)',
            border: '2px solid hsl(140 15% 25% / 0.4)',
          }}
        >
          <Compass 
            className="w-12 h-12 animate-pulse" 
            style={{ color: 'hsl(140 22% 48%)' }} 
          />
        </div>

        {/* 404 number */}
        <h1 
          className="text-8xl md:text-9xl font-extrabold tracking-wider mb-4"
          style={{
            fontFamily: "'Bitter', 'Rockwell', Georgia, serif",
            color: 'hsl(40 30% 94%)',
            textShadow: '4px 4px 0 hsl(0 0% 0% / 0.5), -1px -1px 0 hsl(40 30% 60% / 0.1)',
          }}
        >
          404
        </h1>

        {/* Poetic message */}
        <p 
          className="text-xl mb-2 italic"
          style={{
            fontFamily: "'Caveat', 'Brush Script MT', cursive",
            color: 'hsl(20 45% 55%)',
            fontSize: '1.5rem',
          }}
        >
          "The road you seek has wandered off the map..."
        </p>

        <p 
          className="mb-8"
          style={{
            fontFamily: "'Libre Baskerville', Georgia, serif",
            color: 'hsl(40 15% 55%)',
            lineHeight: '1.7',
          }}
        >
          Even the best riders take wrong turns. Let's get you back on the soul roads.
        </p>

        {/* Navigation options */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/" 
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-medium tracking-wide transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, hsl(140 22% 38%) 0%, hsl(145 18% 45%) 100%)',
              color: 'hsl(40 30% 94%)',
              fontFamily: "'Bitter', 'Rockwell', Georgia, serif",
              boxShadow: 'inset 0 1px 0 hsl(140 30% 55% / 0.2), 0 2px 8px hsl(0 0% 0% / 0.4)',
              border: '1px solid hsl(140 25% 30%)',
            }}
          >
            <Home size={18} />
            Return Home
          </Link>
          
          <Link 
            to="/spots" 
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-medium tracking-wide transition-all duration-300"
            style={{
              background: 'transparent',
              color: 'hsl(40 15% 65%)',
              fontFamily: "'Libre Baskerville', Georgia, serif",
              border: '1px solid hsl(140 15% 25% / 0.5)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'hsl(20 45% 38% / 0.15)';
              e.currentTarget.style.borderColor = 'hsl(20 45% 38% / 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'hsl(140 15% 25% / 0.5)';
            }}
          >
            <MapPin size={18} />
            Explore Spots
          </Link>
        </div>

        {/* Vintage footer note */}
        <p 
          className="mt-12 text-xs"
          style={{
            fontFamily: "'Special Elite', 'Courier New', monospace",
            color: 'hsl(40 15% 40%)',
          }}
        >
          Lost at: {location.pathname}
        </p>
      </div>
    </div>
  );
};

export default NotFound;
