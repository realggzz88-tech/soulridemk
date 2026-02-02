import { Mountain, Heart, Compass } from "lucide-react";
import { useEffect } from "react";

const AboutPage = () => {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div className="page-container pt-24 pb-16 page-enter grain-overlay">
      <div className="content-wrapper px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 
            className="text-5xl md:text-6xl font-extrabold tracking-wider mb-6 animate-fade-up"
            style={{
              fontFamily: "'Bitter', 'Rockwell', Georgia, serif",
              color: 'hsl(40 30% 94%)',
              textShadow: '3px 3px 0 hsl(0 0% 0% / 0.5)',
            }}
          >
            ABOUT SOULRIDE
          </h1>
          <p 
            className="text-xl animate-fade-up italic" 
            style={{ 
              animationDelay: "0.1s",
              fontFamily: "'Caveat', 'Brush Script MT', cursive",
              color: 'hsl(20 45% 55%)',
              fontSize: '1.5rem',
            }}
          >
            Inspiring motorbike journeys through undiscovered beauty
          </p>
        </div>

        {/* Story Section */}
        <div className="space-y-8 mb-16">
          <div 
            className="p-8 md:p-12 rounded-xl animate-fade-up"
            style={{ 
              animationDelay: "0.2s",
              backgroundColor: 'hsl(180 15% 11%)',
              border: '1px solid hsl(140 15% 25% / 0.3)',
              boxShadow: 'inset 0 0 60px hsl(20 45% 38% / 0.05)',
            }}
          >
            <p 
              className="text-lg leading-relaxed mb-6"
              style={{
                fontFamily: "'Libre Baskerville', Georgia, serif",
                color: 'hsl(40 25% 85%)',
                lineHeight: '1.8',
              }}
            >
              Soulride was born from a simple truth: the best roads are the ones most riders never find. 
              They're not on popular GPS routes or tourist maps. They hide in the folds of mountains, 
              wind through villages time forgot, and lead to viewpoints that make you pull over and 
              simply breathe.
            </p>
            <p 
              className="text-lg leading-relaxed mb-6"
              style={{
                fontFamily: "'Libre Baskerville', Georgia, serif",
                color: 'hsl(40 25% 85%)',
                lineHeight: '1.8',
              }}
            >
              We are a collective of riders, dreamers, and wanderers based in Ohrid, Macedonia—a land 
              where ancient lakes mirror endless skies and mountain passes test both machine and spirit. 
              Every spot we share has been ridden, felt, and earned through countless kilometers of 
              exploration.
            </p>
            <p 
              className="text-lg leading-relaxed"
              style={{
                fontFamily: "'Libre Baskerville', Georgia, serif",
                color: 'hsl(40 25% 85%)',
                lineHeight: '1.8',
              }}
            >
              This isn't just a directory of destinations. It's an invitation to ride with intention, 
              to seek beauty in the forgotten corners, and to let the road transform you one curve at a time.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: Mountain,
              title: "Adventure",
              description: "We chase horizons and embrace the unknown paths.",
            },
            {
              icon: Heart,
              title: "Authenticity",
              description: "Every spot is personally discovered and passionately shared.",
            },
            {
              icon: Compass,
              title: "Freedom",
              description: "The road answers to no schedule. Neither do we.",
            },
          ].map((value, index) => (
            <div
              key={value.title}
              className="p-6 text-center rounded-xl animate-fade-up transition-all duration-300"
              style={{ 
                animationDelay: `${(index + 3) * 100}ms`,
                backgroundColor: 'hsl(180 15% 11%)',
                border: '1px solid hsl(140 15% 25% / 0.3)',
              }}
            >
              <div 
                className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4"
                style={{ background: 'hsl(140 22% 42% / 0.2)' }}
              >
                <value.icon className="w-6 h-6" style={{ color: 'hsl(140 22% 50%)' }} />
              </div>
              <h3 
                className="text-xl font-bold tracking-wider mb-2"
                style={{
                  fontFamily: "'Bitter', 'Rockwell', Georgia, serif",
                  color: 'hsl(40 30% 94%)',
                }}
              >
                {value.title}
              </h3>
              <p 
                className="text-sm"
                style={{
                  fontFamily: "'Libre Baskerville', Georgia, serif",
                  color: 'hsl(40 15% 55%)',
                }}
              >
                {value.description}
              </p>
            </div>
          ))}
        </div>

        {/* Soulful quote */}
        <div 
          className="mt-16 p-6 rounded-xl text-center"
          style={{
            background: 'hsl(20 45% 38% / 0.1)',
            border: '1px solid hsl(20 45% 38% / 0.2)',
          }}
        >
          <p 
            className="italic"
            style={{
              fontFamily: "'Caveat', 'Brush Script MT', cursive",
              color: 'hsl(20 45% 55%)',
              fontSize: '1.25rem',
            }}
          >
            "The best roads are not marked on any map — they are found by those who ride with soul."
          </p>
        </div>

        {/* Built in Ohrid */}
        <div className="mt-16 text-center">
          <p 
            className="text-sm"
            style={{
              fontFamily: "'Special Elite', 'Courier New', monospace",
              color: 'hsl(40 15% 45%)',
            }}
          >
            Built with soul in <span style={{ color: 'hsl(140 22% 50%)' }}>Ohrid, Macedonia</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
