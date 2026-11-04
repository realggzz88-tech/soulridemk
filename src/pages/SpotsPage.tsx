import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { spots, type Region } from "@/data/spots";
import SpotCard from "@/components/SpotCard";
import TagFilter from "@/components/TagFilter";
import SpotSearch from "@/components/SpotSearch";
import { DeferMount } from "@/components/DeferMount";
import { MapPlaceholder } from "@/components/MapPlaceholder";
import Seo from "@/components/Seo";
import { spotsSeo } from "@/lib/seo";
import { Map, Compass } from "lucide-react";

const SpotsOverviewMap = lazy(() =>
  import("@/components/SpotMap").then((module) => ({ default: module.SpotsOverviewMap })),
);

const mapFrame = "h-56 sm:h-64 md:h-80";

const SpotsPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<Region>("All");

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]));
  };

  const handleClearAll = () => {
    setSelectedTags([]);
    setSelectedRegion("All");
  };

  const filteredSpots = useMemo(() => {
    let filtered = spots;
    if (selectedRegion !== "All") {
      filtered = filtered.filter((spot) => spot.region === selectedRegion);
    }
    if (selectedTags.length > 0) {
      filtered = filtered.filter((spot) => selectedTags.some((tag) => spot.tags.includes(tag)));
    }
    return filtered;
  }, [selectedTags, selectedRegion]);

  return (
    <div className="min-h-screen pt-24 sm:pt-28 pb-16" style={{ backgroundColor: "hsl(20 15% 8%)" }}>
      <Seo title={spotsSeo.title} description={spotsSeo.description} path={spotsSeo.path} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full"
            style={{
              background: "hsl(15 70% 50% / 0.12)",
              border: "1px solid hsl(15 70% 50% / 0.25)",
            }}
          >
            <Compass className="h-4 w-4" style={{ color: "hsl(15 70% 55%)" }} />
            <span className="text-xs uppercase tracking-[0.2em] font-medium" style={{ color: "hsl(15 70% 60%)" }}>
              Soul Destinations
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4" style={{ color: "hsl(0 0% 100%)" }}>
            Explore Spots
          </h1>

          <p className="text-lg max-w-2xl mx-auto mb-2 font-script" style={{ color: "hsl(30 15% 65%)" }}>
            "Where Macedonia's secrets await the curious rider"
          </p>

          <p className="text-sm" style={{ color: "hsl(30 10% 55%)" }}>
            <span style={{ color: "hsl(170 60% 55%)" }}>{filteredSpots.length}</span> destinations waiting to be discovered
          </p>

          <div className="flex justify-center mt-6">
            <SpotSearch />
          </div>
        </div>

        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Map size={20} style={{ color: "hsl(170 60% 55%)" }} />
            <h2 className="text-xl font-bold tracking-tight" style={{ color: "hsl(0 0% 100%)" }}>
              {selectedRegion === "All" ? "All Locations" : `${selectedRegion}ern Macedonia`}
            </h2>
            <span className="text-xs ml-2" style={{ color: "hsl(30 10% 50%)" }}>
              (Click clusters to expand)
            </span>
          </div>
          <DeferMount
            fallback={(activate) => <MapPlaceholder onActivate={activate} className={mapFrame} />}
          >
            <Suspense fallback={<MapPlaceholder busy onActivate={() => undefined} className={mapFrame} />}>
              <SpotsOverviewMap spots={filteredSpots} />
            </Suspense>
          </DeferMount>
        </div>

        <div className="mb-10">
          <TagFilter
            selectedTags={selectedTags}
            onTagToggle={handleTagToggle}
            onClearAll={handleClearAll}
            selectedRegion={selectedRegion}
            onRegionChange={setSelectedRegion}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredSpots.map((spot, index) => (
            <SpotCard key={spot.id} spot={spot} index={index} />
          ))}
        </div>

        {filteredSpots.length === 0 && (
          <div className="text-center py-16">
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6"
              style={{
                background: "hsl(15 70% 50% / 0.12)",
                border: "1px solid hsl(15 70% 50% / 0.25)",
              }}
            >
              <Map className="h-8 w-8" style={{ color: "hsl(15 70% 55%)" }} />
            </div>
            <p className="text-lg mb-4" style={{ color: "hsl(30 10% 60%)" }}>
              No spots match your filters
            </p>
            <button
              onClick={handleClearAll}
              className="hover:underline transition-colors"
              style={{ color: "hsl(170 60% 55%)" }}
            >
              Clear all filters
            </button>
          </div>
        )}

        <div className="text-center mt-16 py-8" style={{ borderTop: "1px solid hsl(25 15% 18%)" }}>
          <p className="font-script text-xl" style={{ color: "hsl(30 15% 55%)" }}>
            "Every road has a story. Every spot holds a secret. Ride on, explorer."
          </p>
        </div>
      </div>
    </div>
  );
};

export default SpotsPage;
