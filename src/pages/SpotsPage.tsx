import { useState, useMemo } from "react";
import { spots, type Region } from "@/data/spots";
import SpotCard from "@/components/SpotCard";
import TagFilter from "@/components/TagFilter";
import { SpotsOverviewMap } from "@/components/SpotMap";
import { Map } from "lucide-react";

const SpotsPage = () => {
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
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-display text-5xl md:text-6xl tracking-wider mb-4 animate-fade-up">
            EXPLORE SPOTS
          </h1>
          <p
            className="text-muted-foreground max-w-2xl mx-auto animate-fade-up opacity-0"
            style={{ animationDelay: "0.1s" }}
          >
            {filteredSpots.length} handpicked destinations across North Macedonia where the road becomes poetry
          </p>
        </div>

        {/* Overview Map */}
        <div
          className="mb-10 animate-fade-up opacity-0"
          style={{ animationDelay: "0.15s" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Map size={20} className="text-earth-green-glow" />
            <h2 className="font-display text-xl tracking-wide">
              {selectedRegion === "All" ? "ALL LOCATIONS" : `${selectedRegion.toUpperCase()}ERN MACEDONIA`}
            </h2>
          </div>
          <SpotsOverviewMap spots={filteredSpots} />
        </div>

        {/* Filter Bar */}
        <div
          className="mb-10 animate-fade-up opacity-0"
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSpots.map((spot, index) => (
            <div
              key={spot.id}
              className="animate-fade-up opacity-0"
              style={{ animationDelay: `${(index + 3) * 100}ms` }}
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
              className="text-earth-green-glow hover:underline"
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
