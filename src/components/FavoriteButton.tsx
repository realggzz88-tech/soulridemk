import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFavorites } from "@/hooks/use-favorites";
import { useState } from "react";

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
  const [isAnimating, setIsAnimating] = useState(false);

  const sizeClasses = {
    sm: "p-1.5",
    md: "p-2.5",
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
    setIsAnimating(true);
    toggleFavorite(spotId);
    setTimeout(() => setIsAnimating(false), 600);
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "group/fav relative rounded-full transition-all duration-300",
        "bg-background/60 backdrop-blur-sm border border-border/50",
        "hover:bg-background/90 hover:border-soul-amber/50",
        "hover:shadow-[0_0_20px_hsl(var(--amber-soul)/0.3)]",
        isActive && "bg-soul-amber/20 border-soul-amber/40 shadow-[0_0_15px_hsl(var(--amber-soul)/0.25)]",
        sizeClasses[size],
        className
      )}
      aria-label={isActive ? "Remove from favorites" : "Add to favorites"}
    >
      <div className="flex items-center gap-2">
        {/* Pulse ring animation */}
        <span 
          className={cn(
            "absolute inset-0 rounded-full bg-soul-amber/30",
            "transition-all duration-600",
            isAnimating && "animate-ping"
          )}
        />
        
        <Heart
          size={iconSizes[size]}
          className={cn(
            "relative z-10 transition-all duration-300",
            isActive
              ? "fill-soul-amber text-soul-amber"
              : "text-foreground/70 group-hover/fav:text-soul-amber",
            isAnimating && "scale-125",
            !isAnimating && isActive && "scale-110",
            !isAnimating && !isActive && "group-hover/fav:scale-110"
          )}
          style={{
            filter: isActive ? "drop-shadow(0 0 8px hsl(32 85% 52% / 0.6))" : undefined
          }}
        />
        {showLabel && (
          <span
            className={cn(
              "text-sm font-medium tracking-wide transition-colors relative z-10",
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
