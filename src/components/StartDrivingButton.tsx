import { Navigation, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface StartDrivingButtonProps {
  destinationLat: number;
  destinationLng: number;
  destinationName: string;
  className?: string;
  variant?: "primary" | "secondary";
}

const StartDrivingButton = ({
  destinationLat,
  destinationLng,
  destinationName,
  className,
  variant = "primary",
}: StartDrivingButtonProps) => {
  const handleStartDriving = () => {
    // Detect iOS for Apple Maps
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    if (isIOS) {
      // Apple Maps URL scheme
      const appleMapsUrl = `maps://maps.apple.com/?daddr=${destinationLat},${destinationLng}&dirflg=d`;
      window.location.href = appleMapsUrl;
      
      // Fallback to Google Maps if Apple Maps doesn't open
      setTimeout(() => {
        window.open(
          `https://www.google.com/maps/dir/?api=1&destination=${destinationLat},${destinationLng}&travelmode=driving`,
          "_blank"
        );
      }, 500);
    } else {
      // Google Maps for Android and desktop
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${destinationLat},${destinationLng}&travelmode=driving`,
        "_blank"
      );
    }
  };

  return (
    <button
      onClick={handleStartDriving}
      className={cn(
        "group inline-flex items-center gap-2 px-5 py-3 rounded-xl font-medium tracking-wide transition-all duration-300",
        variant === "primary"
          ? "bg-gradient-to-r from-earth-green to-soul-amber text-background hover:shadow-[0_0_30px_hsl(var(--amber-soul)/0.5),0_0_60px_hsl(var(--earth-green)/0.3)] hover:scale-105"
          : "bg-soul-amber/20 border border-soul-amber/30 text-soul-amber hover:bg-soul-amber/30 hover:shadow-[0_0_25px_hsl(var(--amber-soul)/0.4)]",
        className
      )}
    >
      <Navigation size={18} className="group-hover:animate-pulse" style={{ filter: variant === "primary" ? undefined : "drop-shadow(0 0 6px hsl(32 85% 52% / 0.5))" }} />
      <span>Start Driving Now</span>
      <ExternalLink size={14} className="opacity-60 group-hover:opacity-100" />
    </button>
  );
};

// Multi-stop version for routes
interface StartRouteButtonProps {
  waypoints: Array<{ lat: number; lng: number; name: string }>;
  className?: string;
}

export const StartRouteButton = ({ waypoints, className }: StartRouteButtonProps) => {
  const handleStartRoute = () => {
    if (waypoints.length === 0) return;

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    if (isIOS && waypoints.length <= 2) {
      // Apple Maps for simple routes (doesn't support multiple waypoints well)
      const destination = waypoints[waypoints.length - 1];
      const appleMapsUrl = `maps://maps.apple.com/?daddr=${destination.lat},${destination.lng}&dirflg=d`;
      window.location.href = appleMapsUrl;
    } else {
      // Google Maps with waypoints
      const destination = waypoints[waypoints.length - 1];
      const intermediateWaypoints = waypoints.slice(0, -1);
      
      let url = `https://www.google.com/maps/dir/?api=1&destination=${destination.lat},${destination.lng}&travelmode=driving`;
      
      if (intermediateWaypoints.length > 0) {
        const waypointsParam = intermediateWaypoints
          .map((wp) => `${wp.lat},${wp.lng}`)
          .join("|");
        url += `&waypoints=${encodeURIComponent(waypointsParam)}`;
      }
      
      window.open(url, "_blank");
    }
  };

  return (
    <button
      onClick={handleStartRoute}
      className={cn(
        "group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-medium tracking-wide transition-all duration-300",
        "bg-gradient-to-r from-earth-green via-earth-green-glow to-soul-amber text-background",
        "hover:shadow-[0_0_40px_hsl(var(--amber-soul)/0.5),0_0_80px_hsl(var(--earth-green)/0.3)]",
        "hover:scale-105 active:scale-100",
        className
      )}
    >
      <Navigation size={20} className="group-hover:animate-pulse" />
      <span className="font-display text-lg">Start {waypoints.length}-Stop Journey</span>
      <ExternalLink size={14} className="opacity-60 group-hover:opacity-100" />
    </button>
  );
};

export default StartDrivingButton;
