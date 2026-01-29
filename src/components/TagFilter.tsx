import { cn } from "@/lib/utils";
import { allTags } from "@/data/spots";
import { Filter } from "lucide-react";

interface TagFilterProps {
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  onClearAll: () => void;
}

const TagFilter = ({ selectedTags, onTagToggle, onClearAll }: TagFilterProps) => {
  const filterTags = ["Views", "Roads", "Food Stops", "Nature", "Cultural", "Waterfalls", "Fortress", "Eastern Gems"];

  return (
    <div className="relative">
      {/* Gradient border wrapper */}
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
            {selectedTags.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Active filter indicator */}
          {selectedTags.length > 0 && (
            <div className="mt-4 pt-4 border-t border-border/50">
              <p className="text-sm text-muted-foreground">
                Showing spots with: {selectedTags.map((tag, i) => (
                  <span key={tag}>
                    <span className="text-earth-green-glow">{tag}</span>
                    {i < selectedTags.length - 1 && ", "}
                  </span>
                ))}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TagFilter;
