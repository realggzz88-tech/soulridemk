import { useState, useMemo, useEffect } from "react";
import { spots, type Region } from "@/data/spots";
import SpotCard from "@/components/SpotCard";
import TagFilter from "@/components/TagFilter";
import { SpotsOverviewMap } from "@/components/SpotMap";
import SpotSearch from "@/components/SpotSearch";
import { Map } from "lucide-react";

const SpotsPage = () => {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<Region>("All");

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleClearAll = () => {
    setSelectedTags([]);
    setSelectedRegion("All");
  };

  const filteredSpots = useMemo(() => {
    let filtered = spots;
    
    // Filter by region
    if (selectedRegion !== "All") {
      filtered = filtered.filter((spot) => spot.region === selectedRegion);
    }
    
    // Filter by tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter((spot) =>
        selectedTags.some((tag) => spot.tags.includes(tag))
      );
    }
    
    return filtered;
  }, [selectedTags, selectedRegion]);

  return (
    <div 
      className="min-h-screen pt-20 sm:pt-24 pb-12 sm:pb-16 page-enter"
      style={{ backgroundColor: 'hsl(222 47% 7%)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 
            className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-3 sm:mb-4 animate-fade-up text-foreground"
            style={{ animationFillMode: 'forwards' }}
          >
            EXPLORE SPOTS
          </h1>
          <p
            className="text-sm sm:text-base max-w-2xl mx-auto animate-fade-up mb-4 sm:mb-6 px-2 text-muted-foreground"
            style={{ animationDelay: "0.1s", animationFillMode: 'forwards' }}
          >
            {filteredSpots.length} handpicked destinations across North Macedonia where the road becomes poetry
          </p>
          
          {/* Search Bar */}
          <div 
            className="flex justify-center animate-fade-up"
            style={{ animationDelay: "0.12s" }}
          >
            <SpotSearch />
          </div>
        </div>

        {/* Overview Map */}
        <div
          className="mb-10 animate-fade-up"
          style={{ animationDelay: "0.15s" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Map size={20} style={{ color: 'hsl(160 84% 50%)' }} />
            <h2 className="font-display text-xl font-bold tracking-tight text-foreground">
              {selectedRegion === "All" ? "ALL LOCATIONS" : `${selectedRegion.toUpperCase()}ERN MACEDONIA`}
            </h2>
            <span className="text-xs text-muted-foreground ml-2">(Click clusters to expand)</span>
          </div>
          <SpotsOverviewMap spots={filteredSpots} />
        </div>

        {/* Filter Bar */}
        <div
          className="mb-10 animate-fade-up"
          style={{ animationDelay: "0.2s" }}
        >
          <TagFilter
            selectedTags={selectedTags}
            onTagToggle={handleTagToggle}
            onClearAll={handleClearAll}
            selectedRegion={selectedRegion}
            onRegionChange={setSelectedRegion}
          />
        </div>

        {/* Spots Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {filteredSpots.map((spot, index) => (
            <div
              key={spot.id}
              className="animate-fade-up"
              style={{ animationDelay: `${(index + 3) * 50}ms`, animationFillMode: 'forwards' }}
            >
              <SpotCard spot={spot} index={index} />
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredSpots.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg mb-4">
              No spots match your filters
            </p>
            <button
              onClick={handleClearAll}
              className="hover:underline"
              style={{ color: 'hsl(160 84% 50%)' }}
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpotsPage;
