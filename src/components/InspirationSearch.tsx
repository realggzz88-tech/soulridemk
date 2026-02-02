import { useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, Search, Compass } from "lucide-react";
import { motion } from "framer-motion";
import { spots, type Spot } from "@/data/spots";

const InspirationSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Spot[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Poetic intro phrases for search results
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
    
    const scoredSpots = spots.map(spot => {
      let score = 0;
      const searchableText = `
        ${spot.title.toLowerCase()} 
        ${spot.description.toLowerCase()} 
        ${spot.longDescription.toLowerCase()} 
        ${spot.tags.join(" ").toLowerCase()}
      `;

      keywords.forEach(keyword => {
        if (searchableText.includes(keyword)) score += 2;
        if (spot.tags.some(tag => tag.toLowerCase().includes(keyword))) score += 3;
        if (spot.title.toLowerCase().includes(keyword)) score += 5;
      });

      const keywordMappings: Record<string, string[]> = {
        "twist": ["twisty", "curves", "hairpin", "winding", "bend", "serpentine", "roads", "bistra", "galicica"],
        "view": ["views", "panorama", "overlook", "vista", "scenic", "horizon", "pelister", "galicica"],
        "hidden": ["gem", "secret", "secluded", "unknown", "vevcani", "prespa", "quiet", "off-beaten"],
        "lake": ["mavrovo", "trpejca", "ohrid", "prespa", "water", "shore", "lakeside"],
        "mountain": ["galicica", "pelister", "mavrovo", "bistra", "treskavec", "peak", "summit", "altitude", "high"],
        "peaceful": ["vevcani", "trpejca", "serene", "prespa", "quiet", "calm", "tranquil", "still"],
        "sunset": ["trpejca", "lake", "peaceful", "ohrid", "golden", "dusk", "evening", "twilight"],
        "spiritual": ["monastery", "church", "ancient", "treskavec", "sacred", "holy", "soul"],
        "nature": ["forest", "springs", "pine", "vevcani", "prespa", "natural", "wildlife", "green"],
      };

      keywords.forEach(keyword => {
        const mappedTerms = keywordMappings[keyword] || [];
        mappedTerms.forEach(term => {
          if (searchableText.includes(term)) score += 2;
        });
      });

      return { spot, score };
    });

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
    <section 
      className="py-20 px-4 relative overflow-hidden grain-overlay"
      style={{ 
        background: 'linear-gradient(180deg, hsl(180 15% 10%) 0%, hsl(200 20% 9%) 50%, hsl(25 12% 10%) 100%)' 
      }}
    >
      {/* Aged paper texture */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg mb-6"
            style={{
              backgroundColor: 'hsl(140 22% 42% / 0.15)',
              border: '1px dashed hsl(140 22% 50% / 0.4)',
            }}
          >
            <Compass size={14} style={{ color: 'hsl(140 22% 55%)' }} />
            <span 
              className="text-xs tracking-[0.15em] uppercase"
              style={{ 
                fontFamily: "'Special Elite', monospace",
                color: 'hsl(140 22% 60%)',
              }}
            >
              Soul-Powered Discovery
            </span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl mb-4 tracking-wider"
            style={{
              fontFamily: "'Bitter', 'Rockwell', Georgia, serif",
              fontWeight: 700,
              color: 'hsl(40 30% 94%)',
              textShadow: '2px 2px 0 hsl(0 0% 0% / 0.4)',
            }}
          >
            SEEK YOUR RIDE
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="max-w-xl mx-auto text-lg"
            style={{ 
              fontFamily: "'Caveat', cursive",
              color: 'hsl(35 50% 55%)',
            }}
          >
            Whisper your wanderlust and let the road reveal itself
          </motion.p>
        </div>

        {/* Search Form - Old map legend style */}
        <form onSubmit={handleSubmit} className="relative mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="rounded-xl p-1"
            style={{
              backgroundColor: 'hsl(180 12% 11%)',
              border: '2px solid hsl(140 15% 25% / 0.4)',
              boxShadow: '0 4px 20px hsl(0 0% 0% / 0.3), inset 0 1px 0 hsl(40 30% 90% / 0.03)',
            }}
          >
            <div className="flex flex-col sm:flex-row gap-3 p-3">
              <div className="flex-1 flex items-center gap-3">
                <Search size={20} style={{ color: 'hsl(140 22% 50%)' }} />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Whisper your ride mood... 'sunset twists', 'serene hidden lake'"
                  className="flex-1 bg-transparent py-3 focus:outline-none text-base md:text-lg"
                  style={{
                    fontFamily: "'Special Elite', monospace",
                    color: 'hsl(40 30% 90%)',
                  }}
                />
              </div>
              <button
                type="submit"
                disabled={isSearching || !query.trim()}
                className="btn-soul-primary flex items-center justify-center gap-2 px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSearching ? (
                  <span className="animate-pulse">Seeking...</span>
                ) : (
                  <>
                    <Sparkles size={16} />
                    <span>Seek Inspiration</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </form>

        {/* Suggested Queries - Aged tags */}
        {!hasSearched && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-3 mb-8"
          >
            <span 
              className="text-sm"
              style={{ 
                fontFamily: "'Libre Baskerville', serif",
                color: 'hsl(35 15% 50%)',
              }}
            >
              Try:
            </span>
            {suggestedQueries.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setQuery(suggestion)}
                className="text-sm px-3 py-1.5 rounded-lg transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  fontFamily: "'Special Elite', monospace",
                  backgroundColor: 'hsl(140 22% 42% / 0.1)',
                  color: 'hsl(140 22% 60%)',
                  border: '1px solid hsl(140 22% 42% / 0.25)',
                }}
              >
                {suggestion}
              </button>
            ))}
          </motion.div>
        )}

        {/* Results */}
        {hasSearched && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {results.length > 0 ? (
              <>
                {/* Soul Matches Header */}
                <div className="text-center mb-10">
                  <div className="inline-flex items-center gap-3 mb-4">
                    <div className="h-px w-12" style={{ background: 'linear-gradient(90deg, transparent, hsl(140 22% 42% / 0.5))' }} />
                    <Sparkles size={18} style={{ color: 'hsl(35 50% 55%)' }} />
                    <h3 
                      className="text-2xl md:text-3xl tracking-[0.15em]"
                      style={{
                        fontFamily: "'Bitter', serif",
                        color: 'hsl(40 30% 94%)',
                      }}
                    >
                      SOUL MATCHES
                    </h3>
                    <Sparkles size={18} style={{ color: 'hsl(35 50% 55%)' }} />
                    <div className="h-px w-12" style={{ background: 'linear-gradient(90deg, hsl(140 22% 42% / 0.5), transparent)' }} />
                  </div>
                  <p 
                    className="text-sm italic"
                    style={{ 
                      fontFamily: "'Caveat', cursive",
                      color: 'hsl(140 22% 55%)',
                      fontSize: '1rem',
                    }}
                  >
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
                    className="text-sm transition-colors flex items-center gap-1"
                    style={{ 
                      fontFamily: "'Special Elite', monospace",
                      color: 'hsl(140 22% 55%)',
                    }}
                  >
                    <span>Seek again</span>
                  </button>
                </div>
                
                {/* Results Grid - Polaroid style */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.map((spot, index) => (
                    <motion.div
                      key={spot.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        to={`/spots/${spot.id}`}
                        className="group block rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
                        style={{
                          backgroundColor: 'hsl(180 12% 11%)',
                          border: '1px solid hsl(140 15% 25% / 0.3)',
                          boxShadow: '0 4px 20px hsl(0 0% 0% / 0.3)',
                        }}
                      >
                        {/* Image with sepia */}
                        <div className="relative aspect-[3/2] overflow-hidden">
                          <img
                            src={spot.images[0]}
                            alt={spot.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            style={{ filter: 'sepia(15%) saturate(85%)' }}
                          />
                          
                          <div 
                            className="absolute inset-0"
                            style={{
                              background: 'linear-gradient(to top, hsl(200 20% 8% / 0.9) 0%, hsl(200 20% 8% / 0.3) 50%, transparent 80%)',
                            }}
                          />
                          
                          {/* Poetic intro overlay */}
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <p 
                              className="text-xs italic mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                              style={{ 
                                fontFamily: "'Caveat', cursive",
                                color: 'hsl(140 22% 60%)',
                                fontSize: '0.85rem',
                              }}
                            >
                              {getRandomIntro(index)}
                            </p>
                            <h4 
                              className="text-xl tracking-wide"
                              style={{
                                fontFamily: "'Bitter', serif",
                                color: 'hsl(40 30% 94%)',
                              }}
                            >
                              {spot.title}
                            </h4>
                          </div>
                          
                          {/* Tags */}
                          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                            {spot.tags.slice(0, 2).map((tag) => (
                              <span 
                                key={tag} 
                                className="px-2 py-1 rounded-md text-xs"
                                style={{
                                  fontFamily: "'Special Elite', monospace",
                                  fontSize: '10px',
                                  backgroundColor: 'hsl(140 22% 42% / 0.25)',
                                  color: 'hsl(140 22% 65%)',
                                  border: '1px solid hsl(140 22% 42% / 0.3)',
                                }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        {/* Content */}
                        <div className="p-4">
                          <p 
                            className="text-sm line-clamp-2"
                            style={{
                              fontFamily: "'Libre Baskerville', Georgia, serif",
                              color: 'hsl(40 15% 55%)',
                              lineHeight: 1.7,
                            }}
                          >
                            {spot.description}
                          </p>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
                
                <div className="text-center mt-12">
                  <Link
                    to="/spots"
                    className="inline-flex items-center gap-2 transition-colors group arrow-animate"
                    style={{ 
                      fontFamily: "'Bitter', serif",
                      color: 'hsl(140 22% 55%)',
                    }}
                  >
                    <span>Explore all destinations</span>
                    <ArrowRight size={18} className="arrow-icon transition-transform" />
                  </Link>
                </div>
              </>
            ) : (
              <div 
                className="text-center py-16 rounded-xl"
                style={{
                  backgroundColor: 'hsl(180 12% 11%)',
                  border: '1px solid hsl(140 15% 25% / 0.3)',
                }}
              >
                <Sparkles size={32} className="mx-auto mb-4" style={{ color: 'hsl(35 15% 40%)' }} />
                <p 
                  className="mb-4"
                  style={{ 
                    fontFamily: "'Libre Baskerville', serif",
                    color: 'hsl(40 15% 55%)',
                  }}
                >
                  No spots matched your vision, but the road has more secrets...
                </p>
                <Link
                  to="/spots"
                  className="inline-flex items-center gap-2 transition-colors"
                  style={{ color: 'hsl(140 22% 55%)' }}
                >
                  <span>Explore all spots</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default InspirationSearch;
