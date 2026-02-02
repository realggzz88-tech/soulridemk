import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home, MapPin, Compass } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Грешка: Корисникот се обиде да пристапи до непостоечка рута:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: 'hsl(20 15% 8%)' }}>
      <div className="text-center max-w-lg">
        {/* Lost rider illustration */}
        <div 
          className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-8"
          style={{
            background: 'linear-gradient(135deg, hsl(15 70% 50% / 0.2) 0%, hsl(170 60% 45% / 0.2) 100%)',
            border: '2px solid hsl(25 15% 25% / 0.4)',
          }}
        >
          <Compass 
            className="w-12 h-12 animate-pulse" 
            style={{ color: 'hsl(15 70% 55%)' }} 
          />
        </div>

        {/* 404 number */}
        <h1 
          className="text-8xl md:text-9xl font-extrabold tracking-wider mb-4"
          style={{
            color: 'hsl(0 0% 100%)',
            textShadow: '4px 4px 0 hsl(0 0% 0% / 0.5)',
          }}
        >
          404
        </h1>

        {/* Poetic message */}
        <p 
          className="text-xl mb-2 font-script"
          style={{
            color: 'hsl(15 70% 55%)',
            fontSize: '1.5rem',
          }}
        >
          "Патот што го барате талка некаде надвор од картата..."
        </p>

        <p 
          className="mb-8"
          style={{
            color: 'hsl(30 10% 55%)',
            lineHeight: '1.7',
          }}
        >
          Дури и најдобрите возачи понекогаш залутуваат. Ајде да ве вратиме на патиштата со душа.
        </p>

        {/* Navigation options */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/" 
            className="btn-primary inline-flex items-center justify-center gap-2"
          >
            <Home size={18} />
            Врати се дома
          </Link>
          
          <Link 
            to="/spots" 
            className="btn-secondary inline-flex items-center justify-center gap-2"
          >
            <MapPin size={18} />
            Истражи места
          </Link>
        </div>

        {/* Vintage footer note */}
        <p 
          className="mt-12 text-xs"
          style={{
            color: 'hsl(30 10% 40%)',
          }}
        >
          Изгубен на: {location.pathname}
        </p>
      </div>
    </div>
  );
};

export default NotFound;
