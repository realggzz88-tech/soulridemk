import { useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";
import { spots, type Spot } from "@/data/spots";

const InspirationSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Spot[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Poetic intro phrases for search results - expanded
  const poeticIntros = [
    "This path awakens the quiet rider within you...",
    "Here, the horizon whispers your name...",
    "A journey that stirs something ancient in your soul...",
    "Where the road becomes your meditation...",
    "The soul finds its rhythm in these curves...",
    "Time dissolves into timeless beauty here...",
    "A destination written in the language of the heart...",
    "Let this vista remind you why you ride...",
    "Where wheels meet wonder...",
    "The call of the curve awaits...",
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

      // Comprehensive synonym mappings
      const keywordMappings: Record<string, string[]> = {
        // Road/curve synonyms - expanded
        "twist": ["twisty", "curves", "hairpin", "winding", "bend", "serpentine", "roads", "bistra", "galicica"],
        "twisty": ["twist", "curves", "hairpin", "winding", "bend", "serpentine", "roads", "bistra"],
        "twists": ["twist", "curves", "hairpin", "winding", "bend", "serpentine", "roads"],
        "curve": ["curves", "twist", "twisty", "winding", "bend", "hairpin"],
        "curves": ["curve", "twist", "twisty", "winding", "bend", "hairpin", "roads"],
        "bend": ["bends", "curve", "twist", "winding", "hairpin"],
        "bends": ["bend", "curve", "twist", "winding", "hairpin"],
        "winding": ["twisty", "curves", "roads", "serpentine", "bend"],
        "roads": ["road", "twisty", "pass", "bistra", "route", "path", "drive"],
        "road": ["roads", "twisty", "pass", "route", "path", "drive"],
        
        // View/panorama synonyms - expanded
        "view": ["views", "panorama", "overlook", "vista", "scenic", "horizon", "pelister", "galicica"],
        "views": ["view", "panorama", "overlook", "vista", "scenic", "horizon"],
        "panorama": ["panoramic", "view", "views", "overlook", "vista", "scenic"],
        "panoramic": ["panorama", "view", "views", "overlook", "vista"],
        "overlook": ["view", "views", "panorama", "vista", "lookout"],
        "vista": ["view", "views", "panorama", "overlook", "scenic"],
        "scenic": ["view", "views", "panorama", "beautiful", "overlook"],
        "horizon": ["view", "views", "panorama", "vast", "endless"],
        
        // Hidden/secret synonyms - expanded  
        "hidden": ["gem", "secret", "secluded", "unknown", "vevcani", "prespa", "quiet", "off-beaten"],
        "secret": ["hidden", "gem", "secluded", "unknown", "quiet", "mysterious"],
        "village": ["vevcani", "trpejca", "local", "traditional", "hidden", "rural"],
        "gem": ["hidden", "secret", "special", "treasure", "jewel"],
        "secluded": ["hidden", "secret", "quiet", "remote", "isolated"],
        
        // Lake/water synonyms - expanded
        "lake": ["mavrovo", "trpejca", "ohrid", "prespa", "water", "shore", "lakeside"],
        "water": ["lake", "springs", "shore", "river", "cascade", "stream"],
        "serene": ["peaceful", "quiet", "calm", "prespa", "vevcani", "tranquil", "still"],
        "shore": ["lake", "beach", "trpejca", "water", "lakeside", "coast"],
        "springs": ["vevcani", "water", "natural", "crystal", "source"],
        
        // Mountain/high synonyms - expanded
        "mountain": ["galicica", "pelister", "mavrovo", "bistra", "treskavec", "peak", "summit", "altitude", "high"],
        "mountains": ["mountain", "peaks", "summits", "highland", "alpine"],
        "high": ["altitude", "mountain", "peak", "summit", "elevated", "lofty"],
        "pass": ["mountain", "road", "bistra", "galicica", "crossing", "col"],
        "peak": ["summit", "mountain", "top", "pinnacle"],
        "summit": ["peak", "mountain", "top", "apex"],
        "altitude": ["high", "mountain", "elevated"],
        "solitude": ["quiet", "peaceful", "isolated", "alone", "remote", "secluded"],
        
        // Food/rest synonyms - expanded
        "food": ["trpejca", "fish", "ohrid", "taverna", "restaurant", "cuisine", "eat", "dine"],
        "taverna": ["food", "restaurant", "trpejca", "ohrid", "local", "traditional", "inn"],
        "restaurant": ["food", "taverna", "cuisine", "dining", "eat"],
        "rest": ["stop", "break", "taverna", "food", "pause", "refresh"],
        "stop": ["rest", "break", "pause", "food"],
        
        // Time of day synonyms
        "sunset": ["trpejca", "lake", "peaceful", "ohrid", "golden", "dusk", "evening", "twilight"],
        "sunrise": ["dawn", "morning", "early", "pelister", "monastery", "first-light"],
        "golden": ["sunset", "sunrise", "dusk", "dawn", "hour"],
        "dusk": ["sunset", "evening", "golden", "twilight"],
        "dawn": ["sunrise", "morning", "early", "first-light"],
        
        // Mood synonyms - expanded
        "peaceful": ["vevcani", "trpejca", "serene", "prespa", "quiet", "calm", "tranquil", "still"],
        "quiet": ["hidden", "peaceful", "serene", "prespa", "secluded", "calm", "silent"],
        "calm": ["peaceful", "serene", "quiet", "tranquil", "still"],
        "tranquil": ["peaceful", "serene", "calm", "quiet", "still"],
        
        // Experience synonyms
        "epic": ["views", "panorama", "dramatic", "adventure", "galicica", "bistra", "grand"],
        "dramatic": ["epic", "canyon", "adventure", "stunning", "impressive"],
        "adventure": ["canyon", "dramatic", "epic", "bistra", "wild", "thrill", "explore"],
        "wild": ["bistra", "wilderness", "untamed", "adventure", "remote", "rugged"],
        
        // Spiritual/cultural
        "spiritual": ["monastery", "church", "ancient", "treskavec", "sacred", "holy", "soul"],
        "ancient": ["history", "old", "monastery", "heritage", "ohrid", "historic"],
        "monastery": ["treskavec", "spiritual", "sacred", "church", "holy"],
        "history": ["ohrid", "treskavec", "monastery", "ancient", "old", "heritage"],
        
        // Location-based
        "ohrid": ["galicica", "trpejca", "lake", "old town", "overlook", "ancient"],
        
        // Nature/wildlife
        "nature": ["forest", "springs", "pine", "vevcani", "prespa", "natural", "wildlife", "green"],
        "birds": ["prespa", "pelican", "nature", "wildlife", "birdwatching"],
        "wildlife": ["birds", "nature", "prespa", "animals", "fauna"],
      };

      keywords.forEach(keyword => {
        const mappedTerms = keywordMappings[keyword] || [];
        mappedTerms.forEach(term => {
          if (searchableText.includes(term)) score += 2;
        });
      });

      return { spot, score };
    });

    // Sort by score and return top matches (up to 6)
    return scoredSpots
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
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
    }, 600);
  };

  const suggestedQueries = [
    "sunset twists",
    "serene hidden lake",
    "mountain solitude",
    "panoramic overlook",
  ];

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 road-pattern opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
      
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-earth-green/15 border border-earth-green/25 mb-6">
            <Sparkles size={16} className="text-soul-amber" />
            <span className="text-sm text-earth-green-glow font-medium tracking-wide">Soul-Powered Discovery</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-wider mb-4 text-gradient-subtle">
            SEEK YOUR RIDE
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-high-contrast">
            Whisper your wanderlust and let the road reveal itself
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSubmit} className="relative mb-8">
          <div className="gradient-border rounded-2xl p-[2px]">
            <div className="bg-card/90 backdrop-blur-sm rounded-2xl p-3 flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Whisper your ride mood... 'sunset twists', 'serene hidden lake', 'mountain solitude'"
                className="flex-1 bg-transparent px-6 py-4 text-foreground placeholder:text-muted-foreground/70 focus:outline-none text-base md:text-lg font-light"
              />
              <button
                type="submit"
                disabled={isSearching || !query.trim()}
                className="flex items-center justify-center gap-2 px-8 py-4 font-display tracking-wider rounded-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                style={{
                  background: "linear-gradient(135deg, hsl(215 40% 22%) 0%, hsl(160 40% 28%) 50%, hsl(32 75% 48%) 100%)",
                  color: "hsl(40 15% 96%)",
                  boxShadow: "0 4px 20px -5px hsl(160 40% 28% / 0.4), inset 0 1px 0 0 hsl(160 50% 50% / 0.2)",
                }}
              >
                {isSearching ? (
                  <span className="animate-pulse">Seeking...</span>
                ) : (
                  <>
                    <Sparkles size={18} />
                    <span>Seek Inspiration</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Suggested Queries */}
        {!hasSearched && (
          <div className="flex flex-wrap justify-center gap-3 mb-8 animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <span className="text-sm text-muted-foreground">Try:</span>
            {suggestedQueries.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setQuery(suggestion)}
                className="text-sm text-earth-green-glow hover:text-foreground transition-colors px-3 py-1 rounded-full border border-earth-green/20 hover:border-earth-green/40 hover:bg-earth-green/10"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {/* Results */}
        {hasSearched && (
          <div className="animate-fade-in">
            {results.length > 0 ? (
              <>
                {/* Soul Matches Header - Artistic */}
                <div className="text-center mb-10">
                  <div className="inline-flex items-center gap-3 mb-4">
                    <div className="h-px w-12 bg-gradient-to-r from-transparent via-earth-green/50 to-earth-green/80" />
                    <Sparkles size={18} className="text-soul-amber" />
                    <h3 className="font-display text-2xl md:text-3xl tracking-[0.2em] text-gradient-subtle">
                      SOUL MATCHES
                    </h3>
                    <Sparkles size={18} className="text-soul-amber" />
                    <div className="h-px w-12 bg-gradient-to-l from-transparent via-earth-green/50 to-earth-green/80" />
                  </div>
                  <p className="text-muted-foreground text-sm italic">
                    {results.length} {results.length === 1 ? 'destination calls' : 'destinations call'} to your wandering spirit
                  </p>
                </div>
                
                <div className="flex justify-end mb-6">
                  <button
                    onClick={() => {
                      setQuery("");
                      setResults([]);
                      setHasSearched(false);
                    }}
                    className="text-sm text-earth-green-glow hover:text-foreground transition-colors flex items-center gap-1"
                  >
                    <span>Seek again</span>
                  </button>
                </div>
                
                {/* Results Grid - Larger cards with poetic overlay */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.map((spot, index) => (
                    <Link
                      key={spot.id}
                      to={`/spots/${spot.id}`}
                      className="group block spot-card animate-scale-in opacity-0 overflow-hidden"
                      style={{ 
                        animationDelay: `${index * 100}ms`, 
                        animationFillMode: "forwards" 
                      }}
                    >
                      {/* Larger image */}
                      <div className="relative aspect-[3/2] overflow-hidden">
                        <img
                          src={spot.images[0]}
                          alt={spot.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        
                        {/* Subtle gradient - doesn't obscure image */}
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                        
                        {/* Poetic intro overlay - positioned at bottom */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background/90 to-transparent">
                          <p className="text-xs italic text-earth-green-glow/90 mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                            {getRandomIntro(index)}
                          </p>
                          <h4 className="font-display text-xl tracking-wide text-foreground group-hover:text-gradient-glow transition-all">
                            {spot.title}
                          </h4>
                        </div>
                        
                        {/* Tags */}
                        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                          {spot.tags.slice(0, 2).map((tag) => (
                            <span key={tag} className="tag-pill text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      {/* Minimal content */}
                      <div className="p-4">
                        <p className="text-muted-foreground text-sm line-clamp-2 text-high-contrast">
                          {spot.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
                
                <div className="text-center mt-12">
                  <Link
                    to="/spots"
                    className="inline-flex items-center gap-2 text-earth-green-glow hover:text-foreground transition-colors group font-medium"
                  >
                    <span>Explore all destinations</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </>
            ) : (
              <div className="text-center py-16 spot-card">
                <Sparkles size={32} className="text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground mb-4 text-high-contrast">
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
