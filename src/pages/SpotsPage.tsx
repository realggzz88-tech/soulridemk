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
    <div className="page-container pt-20 sm:pt-24 pb-12 sm:pb-16 page-enter grain-overlay">
      <div className="content-wrapper px-4 sm:px-6 lg:px-8">
        {/* Header with vintage soul */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6 sm:mb-8"
        >
          {/* Soul badge */}
          <div 
            className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full"
            style={{
              background: 'hsl(140 22% 42% / 0.15)',
              border: '1px solid hsl(140 22% 42% / 0.3)',
            }}
          >
            <Sparkles className="h-4 w-4" style={{ color: 'hsl(20 45% 50%)' }} />
            <span 
              className="text-xs uppercase tracking-[0.3em] font-medium"
              style={{ 
                color: 'hsl(140 22% 55%)',
                fontFamily: "'Special Elite', 'Courier New', monospace",
              }}
            >
              Soul Destinations
            </span>
            <Sparkles className="h-4 w-4" style={{ color: 'hsl(20 45% 50%)' }} />
          </div>
          
          <h1 
            className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-wider mb-3 sm:mb-4 road-underline inline-block"
            style={{
              fontFamily: "'Bitter', 'Rockwell', Georgia, serif",
              color: 'hsl(40 30% 94%)',
              textShadow: '3px 3px 0 hsl(0 0% 0% / 0.5)',
            }}
          >
            EXPLORE SPOTS
          </h1>
          
          <p 
            className="text-base sm:text-lg max-w-2xl mx-auto mb-2 px-2 italic mt-6"
            style={{
              fontFamily: "'Caveat', 'Brush Script MT', cursive",
              color: 'hsl(20 45% 55%)',
              fontSize: '1.25rem',
            }}
          >
            "Where Macedonia's secrets await the curious rider"
          </p>
          
          <p 
            className="text-sm"
            style={{ 
              color: 'hsl(40 15% 55%)',
              fontFamily: "'Special Elite', 'Courier New', monospace",
            }}
          >
            <span style={{ color: 'hsl(140 22% 55%)' }}>{filteredSpots.length}</span> destinations waiting to be discovered
          </p>
          
          {/* Search Bar */}
          <div className="flex justify-center mt-6">
            <SpotSearch />
          </div>
        </motion.div>

        {/* Overview Map with vintage styling */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-10"
        >
          <div className="flex items-center gap-2 mb-4">
            <Map size={20} style={{ color: 'hsl(140 22% 50%)' }} />
            <h2 
              className="font-display text-xl font-bold tracking-wider"
              style={{
                fontFamily: "'Bitter', 'Rockwell', Georgia, serif",
                color: 'hsl(40 30% 94%)',
              }}
            >
              {selectedRegion === "All" ? "ALL LOCATIONS" : `${selectedRegion.toUpperCase()}ERN MACEDONIA`}
            </h2>
            <span 
              className="text-xs ml-2"
              style={{ 
                color: 'hsl(40 15% 50%)',
                fontFamily: "'Special Elite', monospace",
              }}
            >
              (Click clusters to expand)
            </span>
          </div>
          <div 
            className="rounded-xl overflow-hidden"
            style={{
              border: '1px solid hsl(140 22% 42% / 0.3)',
              boxShadow: '0 0 40px hsl(140 22% 42% / 0.1), inset 0 0 80px hsl(20 45% 38% / 0.05)',
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

        {/* Empty State with vintage soul */}
        {filteredSpots.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div 
              className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6"
              style={{
                background: 'hsl(140 22% 42% / 0.15)',
                border: '1px solid hsl(140 22% 42% / 0.3)',
              }}
            >
              <Map className="h-8 w-8" style={{ color: 'hsl(140 22% 50%)' }} />
            </div>
            <p 
              className="text-lg mb-4"
              style={{ 
                color: 'hsl(40 15% 60%)',
                fontFamily: "'Libre Baskerville', Georgia, serif",
              }}
            >
              No spots match your filters
            </p>
            <button
              onClick={handleClearAll}
              className="hover:underline transition-colors"
              style={{ 
                color: 'hsl(20 45% 50%)',
                fontFamily: "'Special Elite', monospace",
              }}
            >
              Clear all filters
            </button>
          </motion.div>
        )}

        {/* Vintage footer quote */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-16 py-8"
          style={{ borderTop: '1px solid hsl(140 15% 25% / 0.3)' }}
        >
          <p 
            className="italic"
            style={{
              fontFamily: "'Caveat', 'Brush Script MT', cursive",
              color: 'hsl(20 45% 50%)',
              fontSize: '1.1rem',
            }}
          >
            "Every road has a story. Every spot holds a secret. Ride on, explorer."
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SpotsPage;