import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { spots, type Region } from "@/data/spots";
import SpotCard from "@/components/SpotCard";
import TagFilter from "@/components/TagFilter";
import { SpotsOverviewMap } from "@/components/SpotMap";
import SpotSearch from "@/components/SpotSearch";
import { Map, Sparkles } from "lucide-react";

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
      className="min-h-screen pt-20 sm:pt-24 pb-12 sm:pb-16 page-enter pine-overlay"
      style={{ backgroundColor: 'hsl(222 47% 7%)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with soul */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6 sm:mb-8"
        >
          {/* Soul badge */}
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="h-4 w-4" style={{ color: 'hsl(38 95% 55%)' }} />
            <span 
              className="text-xs uppercase tracking-[0.3em] font-medium"
              style={{ color: 'hsl(160 84% 50%)' }}
            >
              Soul Destinations
            </span>
            <Sparkles className="h-4 w-4" style={{ color: 'hsl(38 95% 55%)' }} />
          </div>
          
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-3 sm:mb-4 text-foreground road-underline inline-block">
            EXPLORE SPOTS
          </h1>
          
          <p className="text-sm sm:text-base max-w-2xl mx-auto mb-2 px-2 italic text-muted-foreground mt-6">
            "Handpicked corners of Macedonia where the soul meets the horizon"
          </p>
          
          <p className="text-sm text-muted-foreground/80">
            <span style={{ color: 'hsl(160 84% 50%)' }}>{filteredSpots.length}</span> destinations waiting to be discovered
          </p>
          
          {/* Search Bar */}
          <div className="flex justify-center mt-6">
            <SpotSearch />
          </div>
        </motion.div>

        {/* Overview Map with soul styling */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-10"
        >
          <div className="flex items-center gap-2 mb-4">
            <Map size={20} style={{ color: 'hsl(160 84% 50%)' }} />
            <h2 className="font-display text-xl font-bold tracking-tight text-foreground">
              {selectedRegion === "All" ? "ALL LOCATIONS" : `${selectedRegion.toUpperCase()}ERN MACEDONIA`}
            </h2>
            <span className="text-xs text-muted-foreground ml-2">(Click clusters to expand)</span>
          </div>
          <div 
            className="rounded-xl overflow-hidden watercolor-overlay"
            style={{
              border: '1px solid hsl(160 84% 39% / 0.2)',
              boxShadow: '0 0 40px hsl(160 84% 39% / 0.08)'
            }}
          >
            <SpotsOverviewMap spots={filteredSpots} />
          </div>
        </motion.div>

        {/* Filter Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-10"
        >
          <TagFilter
            selectedTags={selectedTags}
            onTagToggle={handleTagToggle}
            onClearAll={handleClearAll}
            selectedRegion={selectedRegion}
            onRegionChange={setSelectedRegion}
          />
        </motion.div>

        {/* Spots Grid with staggered animation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {filteredSpots.map((spot, index) => (
            <motion.div
              key={spot.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05, duration: 0.4 }}
            >
              <SpotCard spot={spot} index={index} />
            </motion.div>
          ))}
        </div>

        {/* Empty State with soul */}
        {filteredSpots.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div 
              className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6"
              style={{
                backgroundColor: 'hsl(160 84% 39% / 0.1)',
                border: '1px solid hsl(160 84% 39% / 0.2)'
              }}
            >
              <Map className="h-8 w-8" style={{ color: 'hsl(160 84% 39%)' }} />
            </div>
            <p className="text-muted-foreground text-lg mb-4">
              No spots match your filters
            </p>
            <button
              onClick={handleClearAll}
              className="hover:underline transition-colors"
              style={{ color: 'hsl(160 84% 50%)' }}
            >
              Clear all filters
            </button>
          </motion.div>
        )}

        {/* Soul footer quote */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-16 py-8"
          style={{ borderTop: '1px solid hsl(222 20% 15%)' }}
        >
          <p className="text-sm italic text-muted-foreground/70">
            "Every road has a story. Every spot holds a secret. Ride on, explorer."
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SpotsPage;