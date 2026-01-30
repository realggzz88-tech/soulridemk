import { useState } from "react";
import { Navigation, ExternalLink, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Skopje fallback coordinates
const SKOPJE_COORDS = { lat: 41.9981, lng: 21.4254 };

interface StartDrivingButtonProps {
  destinationLat: number;
  destinationLng: number;
  destinationName: string;
  className?: string;
  variant?: "primary" | "secondary" | "hero";
}

const StartDrivingButton = ({
  destinationLat,
  destinationLng,
  destinationName,
  className,
  variant = "primary",
}: StartDrivingButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const openGoogleMaps = (originLat: number, originLng: number) => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${originLat},${originLng}&destination=${destinationLat},${destinationLng}&travelmode=driving`;
    window.open(url, "_blank");
  };

  const handleStartDriving = async () => {
    setIsLoading(true);

    // Try to get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIsLoading(false);
          openGoogleMaps(position.coords.latitude, position.coords.longitude);
        },
        () => {
          // Permission denied or error - fallback to Skopje
          setIsLoading(false);
          openGoogleMaps(SKOPJE_COORDS.lat, SKOPJE_COORDS.lng);
        },
        { timeout: 5000, maximumAge: 60000 }
      );
    } else {
      // Geolocation not supported - fallback to Skopje
      setIsLoading(false);
      openGoogleMaps(SKOPJE_COORDS.lat, SKOPJE_COORDS.lng);
    }
  };

  const isHero = variant === "hero";
  const isPrimary = variant === "primary";

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <button
        onClick={handleStartDriving}
        disabled={isLoading}
        className={cn(
          "group relative inline-flex items-center gap-3 font-display tracking-wider transition-all duration-300 overflow-hidden",
          isHero && [
            "px-10 py-5 rounded-2xl text-lg",
            "bg-gradient-to-r from-[hsl(160_35%_25%)] via-[hsl(100_30%_30%)] to-[hsl(32_60%_42%)]",
            "text-[hsl(40_15%_96%)]",
            "hover:scale-105 hover:shadow-[0_0_50px_hsl(32_70%_50%/0.5),0_0_100px_hsl(160_50%_40%/0.3)]",
            "shadow-[0_4px_30px_hsl(160_40%_30%/0.4),0_0_60px_hsl(32_70%_50%/0.2),inset_0_1px_0_hsl(40_30%_80%/0.15)]",
          ],
          isPrimary && [
            "px-6 py-3.5 rounded-xl text-base",
            "bg-gradient-to-r from-earth-green to-soul-amber text-background",
            "hover:shadow-[0_0_30px_hsl(var(--amber-soul)/0.5),0_0_60px_hsl(var(--earth-green)/0.3)]",
            "hover:scale-105",
          ],
          variant === "secondary" && [
            "px-4 py-2.5 rounded-xl text-sm",
            "bg-soul-amber/20 border border-soul-amber/30 text-soul-amber",
            "hover:bg-soul-amber/30 hover:shadow-[0_0_25px_hsl(var(--amber-soul)/0.4)]",
          ],
          "disabled:opacity-70 disabled:cursor-wait"
        )}
      >
        {/* Shine effect on hover */}
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
        
        {/* Motorbike-inspired icon or navigation */}
        {isLoading ? (
          <Loader2 size={isHero ? 24 : 20} className="animate-spin" />
        ) : (
          <Navigation 
            size={isHero ? 24 : 20} 
            className={cn(
              "relative z-10 transition-transform duration-300",
              "group-hover:translate-x-0.5 group-hover:translate-y-[-1px]"
            )}
            style={{ 
              filter: isHero || isPrimary 
                ? "drop-shadow(0 2px 4px hsl(0 0% 0% / 0.3))" 
                : "drop-shadow(0 0 6px hsl(32 85% 52% / 0.5))" 
            }} 
          />
        )}
        
        <span className="relative z-10">
          {isLoading ? "Getting Location..." : "Start Driving Now"}
        </span>
        
        <ExternalLink 
          size={isHero ? 16 : 14} 
          className="relative z-10 opacity-60 group-hover:opacity-100 transition-opacity" 
        />
      </button>
      
      {/* Helper note */}
      {isHero && (
        <p className="text-xs text-muted-foreground/70 tracking-wide text-center">
          Opens Google Maps — perfect for your ride
        </p>
      )}
    </div>
  );
};

// Multi-stop version for routes with geolocation
interface StartRouteButtonProps {
  waypoints: Array<{ lat: number; lng: number; name: string }>;
  className?: string;
  variant?: "primary" | "hero";
}

export const StartRouteButton = ({ 
  waypoints, 
  className,
  variant = "hero" 
}: StartRouteButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const openGoogleMapsRoute = (originLat: number, originLng: number) => {
    if (waypoints.length === 0) return;

    const destination = waypoints[waypoints.length - 1];
    const intermediateWaypoints = waypoints.slice(0, -1);
    
    let url = `https://www.google.com/maps/dir/?api=1&origin=${originLat},${originLng}&destination=${destination.lat},${destination.lng}&travelmode=driving`;
    
    // Add intermediate waypoints (Google Maps supports up to 10)
    if (intermediateWaypoints.length > 0) {
      const waypointsParam = intermediateWaypoints
        .slice(0, 10) // Limit to 10 waypoints
        .map((wp) => `${wp.lat},${wp.lng}`)
        .join("|");
      url += `&waypoints=${encodeURIComponent(waypointsParam)}`;
    }
    
    window.open(url, "_blank");
  };

  const handleStartRoute = async () => {
    if (waypoints.length === 0) return;
    
    setIsLoading(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIsLoading(false);
          openGoogleMapsRoute(position.coords.latitude, position.coords.longitude);
        },
        () => {
          // Fallback to Skopje
          setIsLoading(false);
          openGoogleMapsRoute(SKOPJE_COORDS.lat, SKOPJE_COORDS.lng);
        },
        { timeout: 5000, maximumAge: 60000 }
      );
    } else {
      setIsLoading(false);
      openGoogleMapsRoute(SKOPJE_COORDS.lat, SKOPJE_COORDS.lng);
    }
  };

  const isHero = variant === "hero";

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <button
        onClick={handleStartRoute}
        disabled={isLoading}
        className={cn(
          "group relative inline-flex items-center gap-3 font-display tracking-wider transition-all duration-300 overflow-hidden",
          isHero && [
            "px-8 py-4 sm:px-10 sm:py-5 rounded-2xl text-base sm:text-lg",
            "bg-gradient-to-r from-[hsl(160_35%_25%)] via-[hsl(100_30%_30%)] to-[hsl(32_60%_42%)]",
            "text-[hsl(40_15%_96%)]",
            "hover:scale-105 hover:shadow-[0_0_50px_hsl(32_70%_50%/0.5),0_0_100px_hsl(160_50%_40%/0.3)]",
            "shadow-[0_4px_30px_hsl(160_40%_30%/0.4),0_0_60px_hsl(32_70%_50%/0.2),inset_0_1px_0_hsl(40_30%_80%/0.15)]",
          ],
          variant === "primary" && [
            "px-6 py-3.5 rounded-xl text-base",
            "bg-gradient-to-r from-earth-green to-soul-amber text-background",
            "hover:shadow-[0_0_30px_hsl(var(--amber-soul)/0.5),0_0_60px_hsl(var(--earth-green)/0.3)]",
            "hover:scale-105",
          ],
          "disabled:opacity-70 disabled:cursor-wait"
        )}
      >
        {/* Shine effect */}
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
        
        {isLoading ? (
          <Loader2 size={isHero ? 24 : 20} className="animate-spin relative z-10" />
        ) : (
          <Navigation 
            size={isHero ? 24 : 20} 
            className="relative z-10 group-hover:translate-x-0.5 group-hover:translate-y-[-1px] transition-transform"
            style={{ filter: "drop-shadow(0 2px 4px hsl(0 0% 0% / 0.3))" }}
          />
        )}
        
        <span className="relative z-10">
          {isLoading 
            ? "Getting Location..." 
            : `Start ${waypoints.length}-Stop Journey`
          }
        </span>
        
        <ExternalLink 
          size={isHero ? 16 : 14} 
          className="relative z-10 opacity-60 group-hover:opacity-100 transition-opacity" 
        />
      </button>
      
      {/* Helper note */}
      {isHero && (
        <p className="text-xs text-muted-foreground/70 tracking-wide text-center max-w-xs">
          Opens Google Maps with all {waypoints.length} waypoints — ride the full route
        </p>
      )}
    </div>
  );
};

export default StartDrivingButton;
