import { useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";
import { spots, type Spot } from "@/data/spots";
import SpotCard from "@/components/SpotCard";

interface InspirationSearchProps {}

const InspirationSearch = ({}: InspirationSearchProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Spot[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const searchSpots = (searchQuery: string): Spot[] => {
    const lowerQuery = searchQuery.toLowerCase();
    const keywords = lowerQuery.split(/\s+/).filter(k => k.length > 2);
    
    // Score each spot based on keyword matches
    const scoredSpots = spots.map(spot => {
      let score = 0;
      const searchableText = `
        ${spot.title.toLowerCase()} 
        ${spot.description.toLowerCase()} 
        ${spot.longDescription.toLowerCase()} 
        ${spot.tags.join(" ").toLowerCase()}
      `;

      keywords.forEach(keyword => {
        // Direct matches
        if (searchableText.includes(keyword)) score += 2;
        
        // Tag matches (higher weight)
        if (spot.tags.some(tag => tag.toLowerCase().includes(keyword))) score += 3;
        
        // Title matches (highest weight)
        if (spot.title.toLowerCase().includes(keyword)) score += 5;
      });

      // Special keyword mappings
      const keywordMappings: Record<string, string[]> = {
        "ohrid": ["galicica", "trpejca", "lake"],
        "lake": ["mavrovo", "trpejca", "ohrid"],
        "mountain": ["galicica", "pelister", "mavrovo"],
        "food": ["trpejca", "fish"],
        "view": ["views", "panorama", "overlook"],
        "road": ["roads", "twisty", "pass"],
        "quiet": ["hidden", "peaceful", "serene"],
        "spiritual": ["monastery", "church", "ancient"],
        "adventure": ["canyon", "dramatic", "epic"],
        "nature": ["forest", "springs", "pine"],
        "sunset": ["trpejca", "lake", "peaceful"],
        "peaceful": ["vevcani", "trpejca", "serene"],
      };

      keywords.forEach(keyword => {
        const mappedTerms = keywordMappings[keyword] || [];
        mappedTerms.forEach(term => {
          if (searchableText.includes(term)) score += 2;
        });
      });

      return { spot, score };
    });

    // Sort by score and return top matches
    return scoredSpots
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map(s => s.spot);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    
    // Simulate a brief search delay for UX
    setTimeout(() => {
      const matchedSpots = searchSpots(query);
      setResults(matchedSpots);
      setHasSearched(true);
      setIsSearching(false);
    }, 500);
  };

  const suggestedQueries = [
    "peaceful lake views",
    "twisty mountain roads",
    "hidden gems near Ohrid",
    "sunset food spots",
  ];

  return (
    <section className="py-20 px-4 relative">
      <div className="absolute inset-0 road-pattern opacity-30" />
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-earth-green/10 border border-earth-green/20 mb-6">
            <Sparkles size={16} className="text-soul-amber" />
            <span className="text-sm text-earth-green-glow font-medium">AI-Powered Discovery</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl tracking-wider mb-4">
            SEEK YOUR RIDE
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Whisper your wanderlust and let the road reveal itself
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSubmit} className="relative mb-8">
          <div className="gradient-border rounded-2xl p-[1px]">
            <div className="bg-card rounded-2xl p-2 flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Describe your perfect ride... 'peaceful views near water'"
                className="flex-1 bg-transparent px-6 py-4 text-foreground placeholder:text-muted-foreground focus:outline-none text-base"
              />
              <button
                type="submit"
                disabled={isSearching || !query.trim()}
                className="btn-glow flex items-center justify-center gap-2 px-8 py-4 bg-accent-gradient text-accent-foreground font-display tracking-wider rounded-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isSearching ? (
                  <span className="animate-pulse">Seeking...</span>
                ) : (
                  <>
                    <Sparkles size={18} />
                    <span>Ask for Inspiration</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Suggested Queries */}
        {!hasSearched && (
          <div className="flex flex-wrap justify-center gap-2 mb-8 animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <span className="text-sm text-muted-foreground">Try:</span>
            {suggestedQueries.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setQuery(suggestion)}
                className="text-sm text-earth-green-glow hover:text-foreground transition-colors underline underline-offset-4"
              >
                "{suggestion}"
              </button>
            ))}
          </div>
        )}

        {/* Results */}
        {hasSearched && (
          <div className="animate-fade-up">
            {results.length > 0 ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <p className="text-muted-foreground">
                    <span className="text-foreground font-medium">{results.length} soulful {results.length === 1 ? 'spot' : 'spots'}</span> match your vision
                  </p>
                  <button
                    onClick={() => {
                      setQuery("");
                      setResults([]);
                      setHasSearched(false);
                    }}
                    className="text-sm text-earth-green-glow hover:underline"
                  >
                    New search
                  </button>
                </div>
                <div className="grid sm:grid-cols-2 gap-6">
                  {results.map((spot, index) => (
                    <div
                      key={spot.id}
                      className="animate-scale-in opacity-0"
                      style={{ animationDelay: `${index * 100}ms`, animationFillMode: "forwards" }}
                    >
                      <SpotCard spot={spot} index={index} />
                    </div>
                  ))}
                </div>
                <div className="text-center mt-8">
                  <Link
                    to="/spots"
                    className="inline-flex items-center gap-2 text-earth-green-glow hover:text-foreground transition-colors"
                  >
                    <span>Explore all spots</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </>
            ) : (
              <div className="text-center py-12 spot-card">
                <p className="text-muted-foreground mb-4">
                  No spots matched your vision, but the road has more secrets...
                </p>
                <Link
                  to="/spots"
                  className="inline-flex items-center gap-2 text-earth-green-glow hover:text-foreground transition-colors"
                >
                  <span>Explore all spots</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default InspirationSearch;
