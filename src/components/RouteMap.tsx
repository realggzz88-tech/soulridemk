import { useEffect, useRef, useState, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Spot } from "@/data/spots";
import { Compass, Navigation, Loader2, Maximize2, Minimize2, ZoomIn, ZoomOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import MapLoadingSpinner from "./MapLoadingSpinner";

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
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [locationStatus, setLocationStatus] = useState<"idle" | "success" | "denied">("idle");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setTimeout(() => {
      mapRef.current?.invalidateSize();
    }, 100);
  };

  const handleZoomIn = () => mapRef.current?.zoomIn();
  const handleZoomOut = () => mapRef.current?.zoomOut();

  // Create vintage brass tack marker icons
  const createSpotIcon = (index: number) => {
    return L.divIcon({
      className: "custom-route-marker",
      html: `
        <div style="
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, hsl(140 22% 35%) 0%, hsl(20 45% 42%) 100%);
          border: 3px solid hsl(40 30% 85%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Bitter', 'Rockwell', serif;
          font-weight: bold;
          color: hsl(40 30% 94%);
          font-size: 14px;
          box-shadow: 0 4px 15px hsl(20 45% 38% / 0.5), 0 0 20px hsl(140 22% 42% / 0.3), inset 0 1px 0 hsl(40 30% 70% / 0.3);
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
          background: hsl(140 22% 45%);
          border: 3px solid hsl(40 30% 90%);
          box-shadow: 0 0 15px hsl(140 22% 45% / 0.6), 0 0 30px hsl(140 22% 45% / 0.3);
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

  // Initialize map with vintage earthy tiles
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

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

    L.control.zoom({ position: "bottomright" }).addTo(map);

    // Vintage earthy dark tiles with sepia filter applied via CSS
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
        maxZoom: 19,
        className: 'vintage-map-tiles',
      }
    ).addTo(map);

    mapRef.current = map;
    setIsMapLoading(false);

    getUserLocation();

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [spots, getUserLocation]);

  // Update markers and route line
  useEffect(() => {
    if (!mapRef.current) return;

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

    const startPoint = userLocation || SKOPJE_COORDS;
    const waypoints: [number, number][] = [
      [startPoint.lat, startPoint.lng],
      ...spots.map((s) => [s.coordinates.lat, s.coordinates.lng] as [number, number]),
    ];

    const userIcon = createUserIcon();
    const userMarker = L.marker([startPoint.lat, startPoint.lng], { icon: userIcon })
      .addTo(mapRef.current)
      .bindPopup(
        `<div style="text-align: center; font-family: 'Bitter', serif; padding: 8px;">
          <strong style="color: hsl(140 22% 50%);">${userLocation ? "Your Location" : "Start: Skopje"}</strong>
          <p style="margin: 4px 0 0; font-size: 12px; color: hsl(40 15% 60%); font-family: 'Libre Baskerville', serif;">Route departure point</p>
        </div>`,
        { className: 'vintage-popup' }
      );
    userMarkerRef.current = userMarker;

    spots.forEach((spot, index) => {
      const icon = createSpotIcon(index);
      const marker = L.marker([spot.coordinates.lat, spot.coordinates.lng], { icon })
        .addTo(mapRef.current!)
        .bindPopup(
          `<div style="text-align: center; font-family: 'Bitter', serif; min-width: 150px; padding: 8px;">
            <strong style="color: hsl(20 45% 50%); font-size: 12px;">Stop ${index + 1}</strong>
            <h3 style="margin: 4px 0; font-size: 15px; color: hsl(40 30% 92%); font-family: 'Bitter', serif;">${spot.title}</h3>
            <p style="margin: 0; font-size: 11px; color: hsl(40 15% 55%); font-style: italic; font-family: 'Caveat', cursive;">"${spot.poeticTagline}"</p>
          </div>`,
          { className: "vintage-popup" }
        );
      markersRef.current.push(marker);
    });

    // Draw vintage route line with rusty colors
    const routeLine = L.polyline(waypoints, {
      color: "hsl(140, 22%, 40%)",
      weight: 4,
      opacity: 0.9,
      dashArray: "12, 8",
      lineCap: "round",
      lineJoin: "round",
    }).addTo(mapRef.current);

    // Rusty glow effect underneath
    const glowLine = L.polyline(waypoints, {
      color: "hsl(20, 45%, 45%)",
      weight: 8,
      opacity: 0.3,
      lineCap: "round",
      lineJoin: "round",
    }).addTo(mapRef.current);
    
    glowLine.bringToBack();
    routeLineRef.current = routeLine;

    const bounds = L.latLngBounds(waypoints);
    mapRef.current.fitBounds(bounds, { padding: [50, 50] });
  }, [spots, userLocation]);

  return (
    <div className={cn(
      "relative rounded-xl overflow-hidden transition-all duration-300",
      isFullscreen && "fixed inset-2 sm:inset-4 z-50 rounded-2xl"
    )}
    style={{
      border: '1px solid hsl(140 15% 25% / 0.4)',
      boxShadow: '0 0 40px hsl(140 22% 42% / 0.1), inset 0 0 60px hsl(20 45% 38% / 0.05)',
    }}
    >
      {isMapLoading && <MapLoadingSpinner message="Loading route map..." />}
      
      {/* Grain overlay */}
      <div className="absolute inset-0 pointer-events-none z-[500] grain-overlay opacity-20" />
      
      <div
        ref={mapContainerRef}
        className={cn(
          "w-full transition-all duration-300",
          isFullscreen ? "h-full" : "h-[300px] sm:h-[400px] md:h-[500px]"
        )}
        style={{ background: "hsl(200 20% 8%)" }}
      />

      {/* Custom Controls */}
      <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-[400] flex flex-col gap-2">
        <button
          onClick={getUserLocation}
          disabled={isLocating}
          className={cn(
            "flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full backdrop-blur-md border transition-all duration-300 text-sm",
            locationStatus === "success"
              ? "border-sage-DEFAULT/50"
              : "border-rust-DEFAULT/40"
          )}
          style={{
            background: locationStatus === "success" 
              ? 'hsl(140 22% 42% / 0.3)' 
              : 'hsl(200 20% 10% / 0.8)',
            color: locationStatus === "success" 
              ? 'hsl(140 22% 55%)' 
              : 'hsl(20 45% 55%)',
          }}
        >
          {isLocating ? (
            <Loader2 size={16} className="animate-spin" />
          ) : locationStatus === "success" ? (
            <Navigation size={16} />
          ) : (
            <Compass size={16} />
          )}
          <span className="font-medium hidden sm:inline" style={{ fontFamily: "'Bitter', serif" }}>
            {isLocating
              ? "Locating..."
              : locationStatus === "success"
              ? "Located"
              : "Use My Location"}
          </span>
        </button>

        <button
          onClick={toggleFullscreen}
          className="p-2 sm:p-2.5 rounded-full backdrop-blur-md border transition-all"
          style={{
            background: 'hsl(200 20% 10% / 0.8)',
            borderColor: 'hsl(140 15% 25% / 0.4)',
            color: 'hsl(40 15% 60%)',
          }}
        >
          {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>

        <div 
          className="flex flex-col rounded-full overflow-hidden border backdrop-blur-md"
          style={{
            background: 'hsl(200 20% 10% / 0.8)',
            borderColor: 'hsl(140 15% 25% / 0.4)',
          }}
        >
          <button 
            onClick={handleZoomIn} 
            className="p-2 transition-colors border-b"
            style={{ 
              borderColor: 'hsl(140 15% 25% / 0.3)',
              color: 'hsl(40 15% 60%)',
            }}
          >
            <ZoomIn size={14} />
          </button>
          <button 
            onClick={handleZoomOut} 
            className="p-2 transition-colors"
            style={{ color: 'hsl(40 15% 60%)' }}
          >
            <ZoomOut size={14} />
          </button>
        </div>
      </div>

      {isFullscreen && (
        <button
          onClick={toggleFullscreen}
          className="absolute top-3 sm:top-4 left-3 sm:left-4 z-[400] p-2 sm:p-2.5 rounded-full backdrop-blur-md border"
          style={{
            background: 'hsl(200 20% 10% / 0.8)',
            borderColor: 'hsl(140 15% 25% / 0.4)',
            color: 'hsl(40 30% 90%)',
          }}
        >
          <Minimize2 size={16} />
        </button>
      )}

      {/* Route Info Overlay */}
      <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 z-[400]">
        <div 
          className="backdrop-blur-md rounded-xl p-3 sm:p-4"
          style={{
            background: 'hsl(200 20% 10% / 0.85)',
            border: '1px solid hsl(140 15% 25% / 0.4)',
          }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
            <div>
              <p 
                className="text-xs mb-1"
                style={{ 
                  color: 'hsl(40 15% 50%)',
                  fontFamily: "'Special Elite', monospace",
                }}
              >
                {userLocation ? "Route from your location" : "Route from Skopje (enable GPS for custom start)"}
              </p>
              <h4 
                className="text-base sm:text-lg tracking-wider"
                style={{
                  fontFamily: "'Bitter', 'Rockwell', serif",
                  color: 'hsl(40 30% 92%)',
                }}
              >
                {routeTitle}
              </h4>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm" style={{ color: 'hsl(40 15% 55%)' }}>
              <span className="flex items-center gap-1">
                <div 
                  className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border"
                  style={{ 
                    background: 'hsl(140 22% 45%)',
                    borderColor: 'hsl(40 30% 85%)',
                  }}
                />
                Start
              </span>
              <span className="flex items-center gap-1">
                <div 
                  className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border"
                  style={{ 
                    background: 'linear-gradient(135deg, hsl(140 22% 40%) 0%, hsl(20 45% 45%) 100%)',
                    borderColor: 'hsl(40 30% 85%)',
                  }}
                />
                Stops
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: "inset 0 0 80px 30px hsl(0 0% 0% / 0.5)",
        }}
      />

      <style>{`
        .vintage-popup .leaflet-popup-content-wrapper {
          background: hsl(200 20% 10%);
          color: hsl(40 30% 92%);
          border: 1px solid hsl(140 15% 25% / 0.4);
          border-radius: 10px;
          box-shadow: 0 8px 30px hsl(0 0% 0% / 0.5);
        }
        .vintage-popup .leaflet-popup-tip {
          background: hsl(200 20% 10%);
          border: 1px solid hsl(140 15% 25% / 0.4);
        }
        .vintage-map-tiles {
          filter: sepia(15%) saturate(85%) brightness(95%);
        }
      `}</style>
    </div>
  );
};

export default RouteMap;
