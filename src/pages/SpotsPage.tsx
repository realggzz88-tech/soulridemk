import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { spots, type Region } from "@/data/spots";
import SpotCard from "@/components/SpotCard";
import TagFilter from "@/components/TagFilter";
import { SpotsOverviewMap } from "@/components/SpotMap";
import SpotSearch from "@/components/SpotSearch";
import { Link } from "react-router-dom";
import { Map, Compass, Plus } from "lucide-react";

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
      className="min-h-screen pt-24 sm:pt-28 pb-16 page-enter"
      style={{ backgroundColor: 'hsl(20 15% 8%)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          {/* Badge */}
          <div 
            className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full"
            style={{
              background: 'hsl(15 70% 50% / 0.12)',
              border: '1px solid hsl(15 70% 50% / 0.25)',
            }}
          >
            <Compass className="h-4 w-4" style={{ color: 'hsl(15 70% 55%)' }} />
            <span 
              className="text-xs uppercase tracking-[0.2em] font-medium"
              style={{ color: 'hsl(15 70% 60%)' }}
            >
              Soul Destinations
            </span>
          </div>
          
          <h1 
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4"
            style={{ color: 'hsl(0 0% 100%)' }}
          >
            Explore Spots
          </h1>
          
          <p 
            className="text-lg max-w-2xl mx-auto mb-2 font-script"
            style={{ color: 'hsl(30 15% 65%)' }}
          >
            "Where Macedonia's secrets await the curious rider"
          </p>
          
          <p 
            className="text-sm"
            style={{ color: 'hsl(30 10% 55%)' }}
          >
            <span style={{ color: 'hsl(170 60% 55%)' }}>{filteredSpots.length}</span> destinations waiting to be discovered
          </p>
          
          {/* Search Bar */}
          <Link
            to="/suggest"
            className="mx-auto mt-6 flex max-w-xl items-center gap-3 rounded-xl border border-primary/50 bg-card p-4 text-left"
          >
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-primary/15 text-primary">
              <Plus className="h-6 w-6" />
            </span>
            <span>
              <b className="block font-display text-base">Знаеш место што вреди?</b>
              <span className="text-sm text-muted-foreground">Сподели го со заедницата. Секој предлог го проверуваме пред да се објави.</span>
            </span>
          </Link>
          <div className="flex justify-center mt-6">
            <SpotSearch />
          </div>
        </motion.div>

        {/* Overview Map */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-10"
        >
          <div className="flex items-center gap-2 mb-4">
            <Map size={20} style={{ color: 'hsl(170 60% 55%)' }} />
            <h2 
              className="text-xl font-bold tracking-tight"
              style={{ color: 'hsl(0 0% 100%)' }}
            >
              {selectedRegion === "All" ? "All Locations" : `${selectedRegion}ern Macedonia`}
            </h2>
            <span 
              className="text-xs ml-2"
              style={{ color: 'hsl(30 10% 50%)' }}
            >
              (Click clusters to expand)
            </span>
          </div>
          <div 
            className="rounded-2xl overflow-hidden"
            style={{
              border: '1px solid hsl(25 15% 18%)',
              boxShadow: '0 4px 24px -4px hsl(0 0% 0% / 0.4)',
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

        {/* Spots Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
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

        {/* Empty State */}
        {filteredSpots.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div 
              className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6"
              style={{
                background: 'hsl(15 70% 50% / 0.12)',
                border: '1px solid hsl(15 70% 50% / 0.25)',
              }}
            >
              <Map className="h-8 w-8" style={{ color: 'hsl(15 70% 55%)' }} />
            </div>
            <p 
              className="text-lg mb-4"
              style={{ color: 'hsl(30 10% 60%)' }}
            >
              No spots match your filters
            </p>
            <button
              onClick={handleClearAll}
              className="hover:underline transition-colors"
              style={{ color: 'hsl(170 60% 55%)' }}
            >
              Clear all filters
            </button>
          </motion.div>
        )}

        {/* Footer quote */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-16 py-8"
          style={{ borderTop: '1px solid hsl(25 15% 18%)' }}
        >
          <p 
            className="font-script text-xl"
            style={{ color: 'hsl(30 15% 55%)' }}
          >
            "Every road has a story. Every spot holds a secret. Ride on, explorer."
          </p>
        </motion.div>
      </div>
      <Link
        to="/suggest"
        className="fixed bottom-[calc(var(--bottom-nav-h)+1rem)] left-4 z-30 inline-flex h-14 items-center gap-2 rounded-pill bg-primary px-5 font-semibold text-primary-foreground shadow-glow md:bottom-6"
      >
        <Plus className="h-5 w-5" />
        Додај место
      </Link>
    </div>
  );
};

export default SpotsPage;
