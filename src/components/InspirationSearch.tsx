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

  // Poetic intro phrases for search results
  const poeticIntros = [
    "This path calls to the wanderer in you...",
    "Here, the horizon whispers your name...",
    "A journey that awakens something ancient within...",
    "Where the road becomes a meditation...",
    "The soul finds its rhythm in these curves...",
    "Time dissolves into timeless beauty here...",
    "A destination written in the language of the heart...",
  ];

  const getRandomIntro = (index: number) => {
    return poeticIntros[index % poeticIntros.length];
  };

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

      // Extended synonym mappings for better conversational matching
      const keywordMappings: Record<string, string[]> = {
        // Location-based
        "ohrid": ["galicica", "trpejca", "lake", "old town", "overlook"],
        "lake": ["mavrovo", "trpejca", "ohrid", "prespa", "water", "shore"],
        "mountain": ["galicica", "pelister", "mavrovo", "bistra", "treskavec", "peak", "summit", "altitude"],
        
        // Time of day synonyms
        "sunset": ["trpejca", "lake", "peaceful", "ohrid", "golden", "dusk", "evening"],
        "sunrise": ["dawn", "morning", "early", "pelister", "monastery"],
        "golden": ["sunset", "sunrise", "dusk", "dawn"],
        "dusk": ["sunset", "evening", "golden"],
        "dawn": ["sunrise", "morning", "early"],
        
        // Mood synonyms
        "peaceful": ["vevcani", "trpejca", "serene", "prespa", "quiet", "calm", "tranquil"],
        "serene": ["peaceful", "quiet", "calm", "prespa", "vevcani", "tranquil"],
        "quiet": ["hidden", "peaceful", "serene", "prespa", "secluded", "calm"],
        "calm": ["peaceful", "serene", "quiet", "tranquil"],
        "tranquil": ["peaceful", "serene", "calm", "quiet"],
        
        // Experience synonyms
        "epic": ["views", "panorama", "dramatic", "adventure", "galicica", "bistra"],
        "views": ["panorama", "overlook", "pelister", "galicica", "vista", "scenic"],
        "scenic": ["views", "panorama", "beautiful", "overlook"],
        "panorama": ["views", "overlook", "vista", "scenic"],
        "dramatic": ["epic", "canyon", "adventure", "stunning"],
        
        // Road synonyms
        "twisty": ["roads", "curves", "hairpin", "winding", "bistra"],
        "winding": ["twisty", "curves", "roads", "serpentine"],
        "curves": ["twisty", "winding", "roads", "hairpin"],
        "roads": ["twisty", "pass", "bistra", "route", "path"],
        
        // Food synonyms
        "food": ["trpejca", "fish", "ohrid", "taverna", "restaurant", "cuisine"],
        "taverna": ["food", "restaurant", "trpejca", "ohrid", "local"],
        "restaurant": ["food", "taverna", "cuisine", "dining"],
        "cuisine": ["food", "taverna", "local", "traditional"],
        
        // Hidden gems synonyms
        "hidden": ["gem", "secret", "vevcani", "prespa", "quiet", "secluded", "unknown"],
        "secret": ["hidden", "gem", "secluded", "unknown", "vevcani"],
        "gem": ["hidden", "secret", "special", "treasure"],
        "village": ["vevcani", "trpejca", "local", "traditional", "hidden"],
        
        // Adventure/spiritual
        "spiritual": ["monastery", "church", "ancient", "treskavec", "sacred", "holy"],
        "sacred": ["spiritual", "monastery", "church", "holy"],
        "adventure": ["canyon", "dramatic", "epic", "bistra", "wild", "thrill"],
        "wild": ["bistra", "wilderness", "untamed", "adventure", "remote"],
        "nature": ["forest", "springs", "pine", "vevcani", "prespa", "natural", "wildlife"],
        
        // History/culture
        "history": ["ohrid", "treskavec", "monastery", "ancient", "old", "heritage"],
        "ancient": ["history", "old", "monastery", "heritage", "ohrid"],
        "heritage": ["history", "ancient", "cultural", "old"],
        
        // Wildlife
        "birds": ["prespa", "pelican", "nature", "wildlife"],
        "wildlife": ["birds", "nature", "prespa", "animals"],
        
        // Water-related
        "water": ["lake", "springs", "shore", "river", "cascade"],
        "springs": ["vevcani", "water", "natural", "crystal"],
        "shore": ["lake", "beach", "trpejca", "water"],
      };

      keywords.forEach(keyword => {
        const mappedTerms = keywordMappings[keyword] || [];
        mappedTerms.forEach(term => {
          if (searchableText.includes(term)) score += 2;
        });
      });

      return { spot, score };
    });

    // Sort by score and return top matches (up to 5)
    return scoredSpots
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
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
                placeholder="Tell me your mood... e.g., 'twisty roads at sunset' or 'hidden lake serenity'"
                className="flex-1 bg-transparent px-6 py-4 text-foreground placeholder:text-muted-foreground focus:outline-none text-base md:text-lg"
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
                {/* Soul Matches Header */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 mb-3">
                    <div className="h-px w-8 bg-gradient-to-r from-transparent to-earth-green/50" />
                    <Sparkles size={14} className="text-soul-amber" />
                    <span className="text-sm uppercase tracking-widest text-earth-green-glow font-medium">Soul Matches</span>
                    <Sparkles size={14} className="text-soul-amber" />
                    <div className="h-px w-8 bg-gradient-to-l from-transparent to-earth-green/50" />
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {results.length} {results.length === 1 ? 'destination calls' : 'destinations call'} to your wandering spirit
                  </p>
                </div>
                
                <div className="flex justify-end mb-4">
                  <button
                    onClick={() => {
                      setQuery("");
                      setResults([]);
                      setHasSearched(false);
                    }}
                    className="text-sm text-earth-green-glow hover:underline transition-colors"
                  >
                    Seek again
                  </button>
                </div>
                
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.map((spot, index) => (
                    <div
                      key={spot.id}
                      className="animate-scale-in opacity-0"
                      style={{ animationDelay: `${index * 100}ms`, animationFillMode: "forwards" }}
                    >
                      {/* Poetic intro above each card */}
                      <p className="text-sm text-earth-green-glow/80 italic mb-2 px-1 line-clamp-1">
                        {getRandomIntro(index)}
                      </p>
                      <SpotCard spot={spot} index={index} />
                    </div>
                  ))}
                </div>
                <div className="text-center mt-10">
                  <Link
                    to="/spots"
                    className="inline-flex items-center gap-2 text-earth-green-glow hover:text-foreground transition-colors group"
                  >
                    <span>Explore all destinations</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
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
