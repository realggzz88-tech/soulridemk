import { Mountain, Heart, Compass } from "lucide-react";
import { useEffect } from "react";

const AboutPage = () => {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div 
      className="min-h-screen pt-24 pb-16 page-enter"
      style={{ backgroundColor: 'hsl(222 47% 7%)' }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-display text-5xl md:text-6xl font-extrabold tracking-tight mb-6 animate-fade-up text-foreground">
            ABOUT SOULRIDE
          </h1>
          <p className="text-xl text-muted-foreground animate-fade-up" style={{ animationDelay: "0.1s" }}>
            Inspiring motorbike journeys through undiscovered beauty
          </p>
        </div>

        {/* Story Section */}
        <div className="space-y-8 mb-16">
          <div 
            className="p-8 md:p-12 rounded-xl animate-fade-up border"
            style={{ 
              animationDelay: "0.2s",
              backgroundColor: 'hsl(222 40% 10%)',
              borderColor: 'hsl(222 20% 18%)'
            }}
          >
            <p className="text-lg leading-relaxed text-foreground/90 mb-6">
              Soulride was born from a simple truth: the best roads are the ones most riders never find. 
              They're not on popular GPS routes or tourist maps. They hide in the folds of mountains, 
              wind through villages time forgot, and lead to viewpoints that make you pull over and 
              simply breathe.
            </p>
            <p className="text-lg leading-relaxed text-foreground/90 mb-6">
              We are a collective of riders, dreamers, and wanderers based in Ohrid, Macedonia—a land 
              where ancient lakes mirror endless skies and mountain passes test both machine and spirit. 
              Every spot we share has been ridden, felt, and earned through countless kilometers of 
              exploration.
            </p>
            <p className="text-lg leading-relaxed text-foreground/90">
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
              className="p-6 text-center rounded-xl animate-fade-up border transition-all duration-300 hover:border-primary/30"
              style={{ 
                animationDelay: `${(index + 3) * 100}ms`,
                backgroundColor: 'hsl(222 40% 10%)',
                borderColor: 'hsl(222 20% 18%)'
              }}
            >
              <div 
                className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4"
                style={{ backgroundColor: 'hsl(160 84% 39% / 0.15)' }}
              >
                <value.icon className="w-6 h-6" style={{ color: 'hsl(160 84% 50%)' }} />
              </div>
              <h3 className="font-display text-xl font-bold tracking-tight mb-2 text-foreground">{value.title}</h3>
              <p className="text-sm text-muted-foreground">{value.description}</p>
            </div>
          ))}
        </div>

        {/* Built in Ohrid */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground text-sm">
            Built with soul in <span style={{ color: 'hsl(160 84% 50%)' }}>Ohrid, Macedonia</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
