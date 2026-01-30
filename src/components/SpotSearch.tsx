import { useState, useMemo, useRef, useEffect } from "react";
import { Search, MapPin, X } from "lucide-react";
import { spots } from "@/data/spots";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface SpotSearchProps {
  onSpotSelect?: (spotId: string) => void;
}

const SpotSearch = ({ onSpotSelect }: SpotSearchProps) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredSpots = useMemo(() => {
    if (!query.trim()) return [];
    
    const lowerQuery = query.toLowerCase();
    return spots.filter(
      (spot) =>
        spot.title.toLowerCase().includes(lowerQuery) ||
        spot.description.toLowerCase().includes(lowerQuery) ||
        spot.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)) ||
        spot.region.toLowerCase().includes(lowerQuery)
    ).slice(0, 6);
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !inputRef.current?.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (spotId: string) => {
    setQuery("");
    setIsOpen(false);
    onSpotSelect?.(spotId);
  };

  return (
    <div className="relative w-full max-w-md">
      {/* Search Input */}
      <div className="relative">
        <Search 
          size={18} 
          className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search spots, regions, or tags..."
          className={cn(
            "w-full h-12 pl-11 pr-10 rounded-xl",
            "bg-muted/30 border border-border/50",
            "text-foreground placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-earth-green/40 focus:border-earth-green/50",
            "hover:bg-muted/40 hover:border-border/70",
            "transition-all duration-300",
            "tracking-wide"
          )}
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-muted/50 transition-colors"
          >
            <X size={14} className="text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Dropdown Results */}
      {isOpen && filteredSpots.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 z-50 rounded-xl bg-card/95 backdrop-blur-md border border-border/50 shadow-xl overflow-hidden animate-fade-up"
        >
          <div className="p-2">
            <p className="text-xs text-muted-foreground px-3 py-1 tracking-wide">
              {filteredSpots.length} spot{filteredSpots.length !== 1 ? "s" : ""} found
            </p>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {filteredSpots.map((spot) => (
              <Link
                key={spot.id}
                to={`/spots/${spot.id}`}
                onClick={() => handleSelect(spot.id)}
                className="flex items-start gap-3 px-4 py-3 hover:bg-muted/40 transition-colors group"
              >
                <div className="p-2 rounded-lg bg-earth-green/20 mt-0.5 group-hover:bg-earth-green/30 transition-colors">
                  <MapPin size={14} className="text-earth-green-glow" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-display text-sm tracking-wide text-foreground group-hover:text-earth-green-glow transition-colors">
                    {spot.title}
                  </h4>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {spot.description}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground">
                      {spot.region}
                    </span>
                    {spot.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="text-xs text-earth-green-glow/70">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="p-3 border-t border-border/30 bg-muted/20">
            <p className="text-xs text-center text-muted-foreground">
              Press Enter or click to navigate
            </p>
          </div>
        </div>
      )}

      {/* No results */}
      {isOpen && query.trim() && filteredSpots.length === 0 && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 z-50 rounded-xl bg-card/95 backdrop-blur-md border border-border/50 shadow-xl p-6 text-center animate-fade-up"
        >
          <Search size={24} className="mx-auto mb-2 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">No spots match "{query}"</p>
          <p className="text-xs text-muted-foreground/70 mt-1">Try a different search term</p>
        </div>
      )}
    </div>
  );
};

export default SpotSearch;
