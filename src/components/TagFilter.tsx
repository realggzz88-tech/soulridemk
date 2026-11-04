import { cn } from "@/lib/utils";
import { allTags, regions, type Region } from "@/lib/content";
import { Filter, MapPin } from "lucide-react";

interface TagFilterProps {
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  onClearAll: () => void;
  selectedRegion?: Region;
  onRegionChange?: (region: Region) => void;
}

const TagFilter = ({ 
  selectedTags, 
  onTagToggle, 
  onClearAll,
  selectedRegion = "All",
  onRegionChange
}: TagFilterProps) => {
  const filterTags = ["Viewpoints", "Views", "Roads", "Nature", "Cultural", "Waterfalls", "Fortress", "Mountain", "Adventure", "Hidden Gem"];

  return (
    <div className="relative space-y-4">
      {/* Region Filter */}
      {onRegionChange && (
        <div className="gradient-border rounded-xl p-[1px]">
          <div className="bg-card rounded-xl p-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin size={18} className="text-soul-amber" />
                <span className="text-sm font-medium uppercase tracking-wider">Region</span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {regions.map((region) => (
                  <button
                    key={region}
                    onClick={() => onRegionChange(region)}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                      selectedRegion === region
                        ? "bg-soul-amber text-primary-foreground shadow-[0_0_20px_hsl(var(--amber-soul)/0.3)]"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/50"
                    )}
                  >
                    {region === "All" ? "Whole Country" : `${region}ern Macedonia`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tag Filter */}
      <div className="gradient-border rounded-xl p-[1px]">
        <div className="bg-card rounded-xl p-4 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Label */}
            <div className="flex items-center gap-2 text-muted-foreground">
              <Filter size={18} />
              <span className="text-sm font-medium uppercase tracking-wider">Filter by</span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 flex-1">
              {filterTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => onTagToggle(tag)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                    selectedTags.includes(tag)
                      ? "bg-earth-green text-primary-foreground shadow-[0_0_20px_hsl(var(--earth-green)/0.3)]"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/50"
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Clear button */}
            {(selectedTags.length > 0 || selectedRegion !== "All") && (
              <button
                onClick={onClearAll}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Active filter indicator */}
          {(selectedTags.length > 0 || selectedRegion !== "All") && (
            <div className="mt-4 pt-4 border-t border-border/50">
              <p className="text-sm text-muted-foreground">
                Showing spots
                {selectedRegion !== "All" && (
                  <span> in <span className="text-soul-amber">{selectedRegion}ern Macedonia</span></span>
                )}
                {selectedTags.length > 0 && (
                  <span>
                    {selectedRegion !== "All" ? " with: " : " with: "}
                    {selectedTags.map((tag, i) => (
                      <span key={tag}>
                        <span className="text-earth-green-glow">{tag}</span>
                        {i < selectedTags.length - 1 && ", "}
                      </span>
                    ))}
                  </span>
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TagFilter;
