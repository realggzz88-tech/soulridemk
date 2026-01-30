import { useEffect, useRef, useState, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Spot } from "@/data/spots";
import { Compass, Navigation, Loader2, Maximize2, Minimize2, ZoomIn, ZoomOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface RouteMapProps {
  spots: Spot[];
  routeTitle: string;
}

// Default fallback: Skopje center
const SKOPJE_COORDS = { lat: 41.9973, lng: 21.4280 };

const RouteMap = ({ spots, routeTitle }: RouteMapProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const routeLineRef = useRef<L.Polyline | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const userMarkerRef = useRef<L.Marker | null>(null);

  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState<"idle" | "success" | "denied">("idle");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [routeStats, setRouteStats] = useState<{ distance: number; duration: number } | null>(null);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setTimeout(() => {
      mapRef.current?.invalidateSize();
    }, 100);
  };

  const handleZoomIn = () => mapRef.current?.zoomIn();
  const handleZoomOut = () => mapRef.current?.zoomOut();

  // Create custom marker icons
  const createSpotIcon = (index: number) => {
    return L.divIcon({
      className: "custom-route-marker",
      html: `
        <div style="
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, hsl(160 40% 28%) 0%, hsl(32 85% 52%) 100%);
          border: 3px solid hsl(40 15% 96%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Cinzel', serif;
          font-weight: bold;
          color: hsl(40 15% 96%);
          font-size: 14px;
          box-shadow: 0 4px 20px hsl(32 85% 52% / 0.5), 0 0 30px hsl(160 40% 28% / 0.3);
        ">
          ${index + 1}
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });
  };

  const createUserIcon = () => {
    return L.divIcon({
      className: "custom-user-marker",
      html: `
        <div style="
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: hsl(215 70% 55%);
          border: 3px solid hsl(40 15% 96%);
          box-shadow: 0 0 20px hsl(215 70% 55% / 0.6);
          animation: pulse 2s ease-in-out infinite;
        "></div>
        <style>
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.2); opacity: 0.8; }
          }
        </style>
      `,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });
  };

  // Get user location
  const getUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationStatus("denied");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(coords);
        setLocationStatus("success");
        setIsLocating(false);
        toast({
          title: "Location found!",
          description: "Route will start from your current position.",
        });
      },
      () => {
        setLocationStatus("denied");
        setIsLocating(false);
        toast({
          title: "Location unavailable",
          description: "Route starts from Skopje. Enable GPS for personalized routing.",
          variant: "destructive",
        });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Calculate center from spots
    const lats = spots.map((s) => s.coordinates.lat);
    const lngs = spots.map((s) => s.coordinates.lng);
    const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;
    const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;

    const map = L.map(mapContainerRef.current, {
      center: [centerLat, centerLng],
      zoom: 9,
      zoomControl: false,
      scrollWheelZoom: true,
    });

    // Add zoom control to bottom right
    L.control.zoom({ position: "bottomright" }).addTo(map);

    // Dark artistic tiles
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
        maxZoom: 19,
      }
    ).addTo(map);

    mapRef.current = map;

    // Try to get user location on mount
    getUserLocation();

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [spots, getUserLocation]);

  // Update markers and route line when spots or user location changes
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }
    if (routeLineRef.current) {
      routeLineRef.current.remove();
      routeLineRef.current = null;
    }

    // Build waypoints array: user location (or Skopje) -> spots in order
    const startPoint = userLocation || SKOPJE_COORDS;
    const waypoints: [number, number][] = [
      [startPoint.lat, startPoint.lng],
      ...spots.map((s) => [s.coordinates.lat, s.coordinates.lng] as [number, number]),
    ];

    // Add user/start marker
    const userIcon = createUserIcon();
    const userMarker = L.marker([startPoint.lat, startPoint.lng], { icon: userIcon })
      .addTo(mapRef.current)
      .bindPopup(
        `<div style="text-align: center; font-family: sans-serif;">
          <strong style="color: hsl(215 70% 55%);">${userLocation ? "Your Location" : "Start: Skopje"}</strong>
          <p style="margin: 4px 0 0; font-size: 12px; color: #666;">Route departure point</p>
        </div>`
      );
    userMarkerRef.current = userMarker;

    // Add spot markers
    spots.forEach((spot, index) => {
      const icon = createSpotIcon(index);
      const marker = L.marker([spot.coordinates.lat, spot.coordinates.lng], { icon })
        .addTo(mapRef.current!)
        .bindPopup(
          `<div style="text-align: center; font-family: sans-serif; min-width: 150px;">
            <strong style="color: hsl(32 85% 52%); font-size: 14px;">Stop ${index + 1}</strong>
            <h3 style="margin: 4px 0; font-size: 16px; color: #fff;">${spot.title}</h3>
            <p style="margin: 0; font-size: 12px; color: #999; font-style: italic;">${spot.poeticTagline}</p>
          </div>`,
          { className: "dark-popup" }
        );
      markersRef.current.push(marker);
    });

    // Draw artistic route line
    const routeLine = L.polyline(waypoints, {
      color: "hsl(160, 40%, 35%)",
      weight: 4,
      opacity: 0.9,
      dashArray: "12, 8",
      lineCap: "round",
      lineJoin: "round",
    }).addTo(mapRef.current);

    // Add glow effect line underneath
    const glowLine = L.polyline(waypoints, {
      color: "hsl(32, 85%, 52%)",
      weight: 8,
      opacity: 0.3,
      lineCap: "round",
      lineJoin: "round",
    }).addTo(mapRef.current);
    
    glowLine.bringToBack();
    routeLineRef.current = routeLine;

    // Fit bounds to show entire route
    const bounds = L.latLngBounds(waypoints);
    mapRef.current.fitBounds(bounds, { padding: [50, 50] });
  }, [spots, userLocation]);

  return (
    <div className={cn(
      "relative rounded-xl overflow-hidden border border-border/50 transition-all duration-300",
      isFullscreen && "fixed inset-4 z-50 rounded-2xl"
    )}>
      {/* Map Container */}
      <div
        ref={mapContainerRef}
        className={cn(
          "w-full transition-all duration-300",
          isFullscreen ? "h-full" : "h-[400px] md:h-[500px]"
        )}
        style={{ background: "hsl(220 20% 10%)" }}
      />

      {/* Custom Controls */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
        {/* Location Button */}
        <button
          onClick={getUserLocation}
          disabled={isLocating}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md border transition-all duration-300",
            locationStatus === "success"
              ? "bg-earth-green/30 border-earth-green/50 text-earth-green-glow"
              : "bg-background/70 border-soul-amber/40 text-soul-amber hover:bg-background/90 hover:shadow-[0_0_20px_hsl(32_85%_52%/0.3)]"
          )}
        >
          {isLocating ? (
            <Loader2 size={16} className="animate-spin" />
          ) : locationStatus === "success" ? (
            <Navigation size={16} />
          ) : (
            <Compass size={16} />
          )}
          <span className="text-sm font-medium">
            {isLocating
              ? "Locating..."
              : locationStatus === "success"
              ? "Located"
              : "Use My Location"}
          </span>
        </button>

        {/* Fullscreen */}
        <button
          onClick={toggleFullscreen}
          className="p-2.5 rounded-full bg-background/70 backdrop-blur-md border border-border/50 hover:bg-earth-green/20 hover:border-earth-green/50 transition-all"
        >
          {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>

        {/* Zoom Controls */}
        <div className="flex flex-col rounded-full overflow-hidden border border-border/50 bg-background/70 backdrop-blur-md">
          <button onClick={handleZoomIn} className="p-2 hover:bg-muted/50 border-b border-border/30">
            <ZoomIn size={14} />
          </button>
          <button onClick={handleZoomOut} className="p-2 hover:bg-muted/50">
            <ZoomOut size={14} />
          </button>
        </div>
      </div>

      {/* Close fullscreen */}
      {isFullscreen && (
        <button
          onClick={toggleFullscreen}
          className="absolute top-4 left-4 z-[1000] p-2.5 rounded-full bg-background/80 backdrop-blur-md border border-border/50 hover:bg-destructive/20"
        >
          <Minimize2 size={16} />
        </button>
      )}

      {/* Route Info Overlay */}
      <div className="absolute bottom-4 left-4 right-4 z-[1000]">
        <div className="bg-background/80 backdrop-blur-md rounded-xl p-4 border border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">
                {userLocation ? "Route from your location" : "Route from Skopje (enable GPS for custom start)"}
              </p>
              <h4 className="font-display text-lg tracking-wide text-gradient-card">
                {routeTitle}
              </h4>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-mountain-blue border border-foreground/50" />
                Start
              </span>
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-earth-green to-soul-amber border border-foreground/50" />
                Stops
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Artistic vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: "inset 0 0 60px 20px hsl(0 0% 0% / 0.4)",
        }}
      />
    </div>
  );
};

export default RouteMap;
