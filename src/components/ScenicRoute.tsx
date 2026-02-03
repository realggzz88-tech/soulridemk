import { useEffect, useRef, useState, useCallback } from "react";
import type { Spot } from "@/data/spots";
import { MapPin, Navigation, Compass, Clock, Route, Share2, Copy, Check, Smartphone, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import "leaflet/dist/leaflet.css";

// Social icons (line style)
const FacebookIcon = ({ size = 16, className }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const WhatsAppIcon = ({ size = 16, className }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

// Default center: Central North Macedonia (Skopje)
const SKOPJE_COORDS = { lat: 41.9973, lng: 21.4280 };

interface ScenicRouteProps {
  spot: Spot;
}

interface RouteInfo {
  distance: number; // in km
  duration: number; // in minutes
}

const ScenicRoute = ({ spot }: ScenicRouteProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const routingControlRef = useRef<any>(null);
  const userMarkerRef = useRef<any>(null);
  
  const [userPosition, setUserPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [activeRoute, setActiveRoute] = useState<"user" | "skopje" | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [isRouteLoading, setIsRouteLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Get user location
  const getUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationStatus("error");
      return;
    }

    setLocationStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserPosition(coords);
        setLocationStatus("success");
      },
      () => {
        // Geolocation denied or unavailable - fallback to default location
        setLocationStatus("error");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  // Initialize map
  useEffect(() => {
    const initMap = async () => {
      if (!mapRef.current || mapInstanceRef.current) return;
      
      const L = (await import("leaflet")).default;
      
      // Calculate center between Skopje and spot for overview
      const centerLat = (SKOPJE_COORDS.lat + spot.coordinates.lat) / 2;
      const centerLng = (SKOPJE_COORDS.lng + spot.coordinates.lng) / 2;

      const map = L.map(mapRef.current, {
        scrollWheelZoom: true,
        zoomControl: true,
      }).setView([centerLat, centerLng], 9);

      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      // Destination marker (the spot)
      const spotIcon = L.divIcon({
        className: "spot-destination-marker",
        html: `
          <div style="position: relative; width: 36px; height: 36px;">
            <div style="
              position: absolute;
              inset: 0;
              background: hsl(160, 40%, 35%);
              border-radius: 50%;
              opacity: 0.3;
              animation: pulse-ring 2s ease-out infinite;
            "></div>
            <div style="
              position: absolute;
              inset: 4px;
              background: linear-gradient(135deg, hsl(160, 40%, 35%) 0%, hsl(160, 50%, 45%) 100%);
              border-radius: 50%;
              border: 2px solid rgba(255,255,255,0.5);
              box-shadow: 0 0 20px hsla(160, 40%, 35%, 0.5), 0 4px 12px rgba(0,0,0,0.4);
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -18],
      });

      L.marker([spot.coordinates.lat, spot.coordinates.lng], {
        icon: spotIcon,
      }).addTo(map).bindPopup(`
        <div style="padding: 8px; text-align: center;">
          <span style="color: hsl(160, 50%, 45%); font-size: 0.75rem;">🏁 DESTINATION</span>
          <h3 style="font-family: 'Bebas Neue', sans-serif; font-size: 1.1rem; letter-spacing: 0.05em; margin-top: 4px;">${spot.title}</h3>
        </div>
      `);

      mapInstanceRef.current = map;
      setIsMapReady(true);

      // Try to get user location on mount
      getUserLocation();
    };

    initMap();

    return () => {
      if (routingControlRef.current && mapInstanceRef.current) {
        mapInstanceRef.current.removeControl(routingControlRef.current);
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [spot, getUserLocation]);

  // Add user marker when position is available
  useEffect(() => {
    const addUserMarker = async () => {
      if (!mapInstanceRef.current || !userPosition) return;

      const L = (await import("leaflet")).default;

      if (userMarkerRef.current) {
        userMarkerRef.current.remove();
      }

      const userIcon = L.divIcon({
        className: "user-position-marker",
        html: `
          <div style="position: relative; width: 24px; height: 24px;">
            <div style="
              position: absolute;
              inset: 0;
              background: hsl(32, 85%, 52%);
              border-radius: 50%;
              opacity: 0.3;
              animation: pulse-ring 2s ease-out infinite;
            "></div>
            <div style="
              position: absolute;
              inset: 3px;
              background: linear-gradient(135deg, hsl(32, 85%, 55%) 0%, hsl(38, 90%, 60%) 100%);
              border-radius: 50%;
              border: 2px solid rgba(255,255,255,0.6);
              box-shadow: 0 0 15px hsla(32, 85%, 52%, 0.6);
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              <div style="width: 4px; height: 4px; background: white; border-radius: 50%;"></div>
            </div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      userMarkerRef.current = L.marker([userPosition.lat, userPosition.lng], {
        icon: userIcon,
        zIndexOffset: 1000,
      }).addTo(mapInstanceRef.current).bindPopup(`
        <div style="padding: 6px; text-align: center;">
          <span style="color: hsl(32, 85%, 52%); font-size: 0.75rem;">📍 Your Position</span>
        </div>
      `);
    };

    addUserMarker();
  }, [userPosition]);

  // Create route
  const createRoute = useCallback(async (startCoords: { lat: number; lng: number }, routeType: "user" | "skopje") => {
    if (!mapInstanceRef.current || !isMapReady) return;

    const L = (await import("leaflet")).default;
    
    // Import routing machine
    await import("leaflet-routing-machine");

    // Remove existing route
    if (routingControlRef.current) {
      mapInstanceRef.current.removeControl(routingControlRef.current);
    }

    // Custom line styles for scenic route
    const routingControl = (L as any).Routing.control({
      waypoints: [
        L.latLng(startCoords.lat, startCoords.lng),
        L.latLng(spot.coordinates.lat, spot.coordinates.lng),
      ],
      routeWhileDragging: false,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      showAlternatives: true,
      altLineOptions: {
        styles: [
          { color: 'hsl(32, 85%, 52%)', opacity: 0.4, weight: 5, dashArray: '10, 10' },
        ],
        extendToWaypoints: true,
        missingRouteTolerance: 0,
      },
      lineOptions: {
        styles: [
          // Outer glow
          { color: 'hsl(160, 50%, 30%)', opacity: 0.3, weight: 12 },
          // Main line with gradient effect (using multiple layers)
          { color: 'hsl(160, 45%, 40%)', opacity: 0.8, weight: 6 },
          // Inner highlight
          { color: 'hsl(160, 55%, 55%)', opacity: 1, weight: 3, dashArray: '15, 8' },
        ],
        extendToWaypoints: true,
        missingRouteTolerance: 0,
      },
      createMarker: () => null, // We handle our own markers
      router: (L as any).Routing.osrmv1({
        serviceUrl: 'https://router.project-osrm.org/route/v1',
        profile: 'driving', // car profile
      }),
    });

    routingControl.on('routesfound', (e: any) => {
      const routes = e.routes;
      if (routes && routes.length > 0) {
        const route = routes[0];
        setRouteInfo({
          distance: Math.round(route.summary.totalDistance / 1000 * 10) / 10,
          duration: Math.round(route.summary.totalTime / 60),
        });
      }
    });

    routingControl.addTo(mapInstanceRef.current);
    routingControlRef.current = routingControl;
    setActiveRoute(routeType);

    // Add start marker
    const startIcon = L.divIcon({
      className: "start-marker",
      html: `
        <div style="
          width: 28px; 
          height: 28px; 
          background: linear-gradient(135deg, hsl(215, 40%, 25%) 0%, hsl(215, 50%, 35%) 100%);
          border-radius: 50%; 
          border: 2px solid rgba(255,255,255,0.5);
          box-shadow: 0 0 15px hsla(215, 50%, 40%, 0.5), 0 4px 12px rgba(0,0,0,0.4);
          display: flex; 
          align-items: center; 
          justify-content: center;
        ">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 8v8"/>
            <path d="M8 12h8"/>
          </svg>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    L.marker([startCoords.lat, startCoords.lng], {
      icon: startIcon,
    }).addTo(mapInstanceRef.current).bindPopup(`
      <div style="padding: 6px; text-align: center;">
        <span style="color: hsl(215, 50%, 50%); font-size: 0.75rem;">🚀 START</span>
        <p style="font-size: 0.7rem; color: hsl(220, 10%, 55%); margin-top: 2px;">
          ${routeType === "user" ? "Your Location" : "Skopje"}
        </p>
      </div>
    `);
  }, [spot, isMapReady]);

  const handleRouteFromLocation = () => {
    if (userPosition) {
      setIsRouteLoading(true);
      createRoute(userPosition, "user").finally(() => setIsRouteLoading(false));
    } else {
      getUserLocation();
    }
  };

  const handleRouteFromSkopje = () => {
    setIsRouteLoading(true);
    createRoute(SKOPJE_COORDS, "skopje").finally(() => setIsRouteLoading(false));
  };

  const handleShareRidePlan = async () => {
    const startLocation = activeRoute === "user" ? "your location" : "Skopje";
    const ridePlanText = `🏍️ Soulride to ${spot.title} from ${startLocation}: ~${routeInfo?.distance || "??"} km of twisty beauty. ${spot.tags.includes("Views") ? "Epic views await!" : spot.tags.includes("Waterfalls") ? "Refreshing waterfalls along the way!" : "A soul-stirring journey through Macedonia's hidden landscapes."}\n\n${window.location.href}`;
    
    try {
      await navigator.clipboard.writeText(ridePlanText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard API not available - fail silently
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-soul-amber/20" style={{ boxShadow: '0 0 15px hsl(32 85% 52% / 0.2)' }}>
          <Route className="w-5 h-5 text-soul-amber" />
        </div>
        <h2 className="font-display text-2xl tracking-wider">PLAN RIDE FROM YOUR LOCATION</h2>
      </div>

      {/* Note about geolocation */}
      <div className="p-3 rounded-lg bg-muted/20 border border-border/30">
        <p className="text-xs text-muted-foreground tracking-wide">
          <span className="text-soul-amber font-medium">🧭 Dynamic routing:</span>{" "}
          Click "Route from My Location" to use GPS. Falls back to Skopje if no permission granted.
        </p>
      </div>

      {/* Route Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleRouteFromLocation}
          disabled={locationStatus === "loading"}
          className={cn(
            "flex items-center gap-2 px-5 py-3 rounded-xl transition-all duration-300",
            "bg-soul-amber/20 border border-soul-amber/30",
            "hover:bg-soul-amber/30 hover:shadow-[0_0_25px_hsl(var(--amber-soul)/0.3)]",
            activeRoute === "user" && "bg-soul-amber/30 border-soul-amber/50 shadow-[0_0_20px_hsl(var(--amber-soul)/0.25)]",
            locationStatus === "loading" && "opacity-70"
          )}
        >
          <Compass 
            size={18} 
            className={cn(
              "text-soul-amber",
              locationStatus === "loading" && "animate-spin"
            )}
          />
          <span className="font-medium tracking-wide text-soul-amber">
            {locationStatus === "loading" ? "Getting Location..." : "Route from My Location"}
          </span>
        </button>

        <button
          onClick={handleRouteFromSkopje}
          className={cn(
            "flex items-center gap-2 px-5 py-3 rounded-xl transition-all duration-300",
            "bg-mountain-blue/20 border border-mountain-blue/30",
            "hover:bg-mountain-blue/30 hover:shadow-[0_0_25px_hsl(var(--mountain-blue)/0.3)]",
            activeRoute === "skopje" && "bg-mountain-blue/30 border-mountain-blue/50 shadow-[0_0_20px_hsl(var(--mountain-blue)/0.25)]"
          )}
        >
          <MapPin size={18} className="text-foreground/80" />
          <span className="font-medium tracking-wide">Route from Skopje</span>
        </button>
      </div>

      {/* Route Loading Spinner */}
      {isRouteLoading && (
        <div className="flex items-center justify-center gap-3 p-4 rounded-xl bg-muted/20 border border-border/30">
          <div className="route-loading-spinner" />
          <span className="text-sm text-muted-foreground tracking-wide animate-pulse">
            Calculating scenic route...
          </span>
        </div>
      )}

      {/* Route Info */}
      {routeInfo && !isRouteLoading && (
        <div className="space-y-3 animate-fade-up">
          <div className="flex flex-wrap gap-4 p-4 rounded-xl bg-muted/30 border border-border/40">
            <div className="flex items-center gap-2">
              <Route size={16} className="text-earth-green-glow" />
              <span className="text-sm tracking-wide">
                <span className="text-muted-foreground">Distance:</span>{" "}
                <span className="text-foreground font-medium">{routeInfo.distance} km</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-soul-amber" />
              <span className="text-sm tracking-wide">
                <span className="text-muted-foreground">Est. Time:</span>{" "}
                <span className="text-foreground font-medium">
                  {Math.floor(routeInfo.duration / 60)}h {routeInfo.duration % 60}min
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Navigation size={16} className="text-mountain-blue" />
              <span className="text-sm text-muted-foreground tracking-wide italic">
                Scenic route via OSRM
              </span>
            </div>
          </div>

          {/* Share Ride Plan Section */}
          <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl bg-muted/20 border border-border/30">
            <span className="text-sm text-muted-foreground font-medium tracking-wide">Share This Ride:</span>
            
            {/* Copy Button */}
            <button
              onClick={handleShareRidePlan}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300",
                "bg-earth-green/20 border border-earth-green/30",
                "hover:bg-earth-green/30 hover:shadow-[0_0_20px_hsl(var(--earth-green)/0.25)]",
                copied && "bg-earth-green/30 border-earth-green/50"
              )}
            >
              {copied ? (
                <>
                  <Check size={14} className="text-earth-green-glow" />
                  <span className="text-xs font-medium tracking-wide text-earth-green-glow">Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={14} className="text-earth-green-glow" />
                  <span className="text-xs font-medium tracking-wide text-earth-green-glow">Copy Plan</span>
                </>
              )}
            </button>

            {/* Social Icons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const startLocation = activeRoute === "user" ? "your location" : "Skopje";
                  const text = `🏍️ Soulride to ${spot.title} from ${startLocation}: ~${routeInfo?.distance || "??"} km of twisty beauty!`;
                  window.open(`https://wa.me/?text=${encodeURIComponent(`${text}\n${window.location.href}`)}`, "_blank");
                }}
                className="group p-2.5 rounded-full bg-muted/30 border border-border/40 hover:bg-earth-green/20 hover:border-earth-green/40 hover:shadow-[0_0_15px_hsl(var(--earth-green)/0.3)] transition-all duration-300"
                aria-label="Share on WhatsApp"
              >
                <WhatsAppIcon size={14} className="text-muted-foreground group-hover:text-earth-green-glow transition-colors" />
              </button>
              <button
                onClick={() => {
                  const text = `Discover ${spot.title} on Soulride – scenic routes for soul riders`;
                  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(text)}`, "_blank", "width=600,height=400");
                }}
                className="group p-2.5 rounded-full bg-muted/30 border border-border/40 hover:bg-soul-amber/20 hover:border-soul-amber/40 hover:shadow-[0_0_15px_hsl(var(--amber-soul)/0.3)] transition-all duration-300"
                aria-label="Share on Facebook"
              >
                <FacebookIcon size={14} className="text-muted-foreground group-hover:text-soul-amber transition-colors" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Map */}
      <div className="relative rounded-xl overflow-hidden border border-border/50 gradient-border">
        <div className="absolute inset-0 pointer-events-none z-[999] watercolor-overlay opacity-10" />
        <div
          ref={mapRef}
          className="h-80 md:h-[450px] w-full"
          style={{ background: "hsl(220, 15%, 10%)" }}
        />

        {/* Legend */}
        <div className="absolute bottom-3 left-3 z-[1001] p-3 rounded-lg bg-background/80 backdrop-blur-sm border border-border/50">
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 rounded-full bg-earth-green" style={{ boxShadow: '0 0 6px hsl(160, 50%, 45%)' }} />
              <span className="text-muted-foreground">Main Route</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 rounded-full bg-soul-amber opacity-60" style={{ background: 'repeating-linear-gradient(90deg, hsl(32, 85%, 52%) 0px, hsl(32, 85%, 52%) 3px, transparent 3px, transparent 6px)' }} />
              <span className="text-muted-foreground">Alternative</span>
            </div>
          </div>
        </div>

        {/* Pulse animation styles */}
        <style>{`
          @keyframes pulse-ring {
            0% { transform: scale(1); opacity: 0.4; }
            100% { transform: scale(2.5); opacity: 0; }
          }
          .leaflet-routing-container {
            display: none !important;
          }
          .route-loading-spinner {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            border: 2px solid hsl(160, 40%, 28%);
            border-top-color: hsl(160, 50%, 50%);
            animation: spin 1s linear infinite;
            position: relative;
          }
          .route-loading-spinner::after {
            content: '';
            position: absolute;
            inset: 3px;
            border-radius: 50%;
            border: 1px dashed hsl(32, 85%, 52%);
            animation: spin 2s linear reverse infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>

      {/* Offline Note */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-mountain-blue/10 border border-mountain-blue/20">
        <Smartphone size={18} className="text-mountain-blue mt-0.5 flex-shrink-0" />
        <p className="text-sm text-muted-foreground tracking-wide">
          <span className="text-foreground font-medium">Preview twisty beauty:</span> For real GPS navigation, export routes to{" "}
          <span className="text-earth-green-glow">OsmAnd</span> or use phone navigation apps. Soulride shows scenic previews!
        </p>
      </div>

      {/* Scenic note */}
      <p className="text-sm text-muted-foreground italic tracking-wide text-center">
        ✨ Routes via Leaflet Routing Machine (OSM) – embrace the journey, not just the destination
      </p>
    </div>
  );
};

export default ScenicRoute;