import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFavorites } from "@/hooks/use-favorites";

interface FavoriteButtonProps {
  spotId: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  showLabel?: boolean;
}

const FavoriteButton = ({
  spotId,
  size = "md",
  className,
  showLabel = false,
}: FavoriteButtonProps) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isActive = isFavorite(spotId);

  const sizeClasses = {
    sm: "p-1.5",
    md: "p-2",
    lg: "p-3",
  };

  const iconSizes = {
    sm: 14,
    md: 18,
    lg: 22,
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(spotId);
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "group/fav rounded-full transition-all duration-300",
        "bg-background/60 backdrop-blur-sm border border-border/50",
        "hover:bg-background/90 hover:border-soul-amber/50",
        isActive && "bg-soul-amber/20 border-soul-amber/40",
        sizeClasses[size],
        className
      )}
      aria-label={isActive ? "Remove from favorites" : "Add to favorites"}
    >
      <div className="flex items-center gap-2">
        <Heart
          size={iconSizes[size]}
          className={cn(
            "transition-all duration-300",
            isActive
              ? "fill-soul-amber text-soul-amber scale-110"
              : "text-foreground/70 group-hover/fav:text-soul-amber group-hover/fav:scale-110"
          )}
        />
        {showLabel && (
          <span
            className={cn(
              "text-sm font-medium transition-colors",
              isActive ? "text-soul-amber" : "text-foreground/70"
            )}
          >
            {isActive ? "Saved" : "Save"}
          </span>
        )}
      </div>
    </button>
  );
};

export default FavoriteButton;
