import { Mountain, Heart, Compass } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-display text-5xl md:text-6xl tracking-wider mb-6 animate-fade-up">
            ABOUT SOULRIDE
          </h1>
          <p className="text-xl text-muted-foreground animate-fade-up opacity-0" style={{ animationDelay: "0.1s" }}>
            Inspiring motorbike journeys through undiscovered beauty
          </p>
        </div>

        {/* Story Section */}
        <div className="space-y-8 mb-16">
          <div className="spot-card p-8 md:p-12 animate-fade-up opacity-0" style={{ animationDelay: "0.2s" }}>
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
              className="spot-card p-6 text-center animate-fade-up opacity-0"
              style={{ animationDelay: `${(index + 3) * 100}ms` }}
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-earth-green/20 mb-4">
                <value.icon className="w-6 h-6 text-earth-green-glow" />
              </div>
              <h3 className="font-display text-xl tracking-wide mb-2">{value.title}</h3>
              <p className="text-sm text-muted-foreground">{value.description}</p>
            </div>
          ))}
        </div>

        {/* Built in Ohrid */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground text-sm">
            Built with soul in <span className="text-earth-green-glow">Ohrid, Macedonia</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
