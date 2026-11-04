import { useEffect, useState, useRef, useCallback } from "react";
import type { FeatureGroup, Map as LeafletMap, Marker } from "leaflet";
import type { Spot } from "@/lib/content";
import { Compass, Maximize2, Minimize2, ZoomIn, ZoomOut } from "lucide-react";
import { createMarkerClusterGroup } from "@/lib/leaflet-plugins";
import { cn } from "@/lib/utils";
import MapLoadingSpinner from "./MapLoadingSpinner";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

// Default center: Central North Macedonia (Skopje)
const SKOPJE_COORDS = { lat: 41.9973, lng: 21.4280 };
const DEFAULT_ZOOM = 8;
const USER_ZOOM = 12;

interface SpotsOverviewMapProps {
  spots: Spot[];
}

export const SpotsOverviewMap = ({ spots }: SpotsOverviewMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const userMarkerRef = useRef<Marker | null>(null);
  const clusterGroupRef = useRef<FeatureGroup | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [userPosition, setUserPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const getUserLocation = useCallback((forcePrompt = false) => {
    if (!navigator.geolocation) {
      setLocationStatus("error");
      return;
    }

    const hasPrompted = sessionStorage.getItem("soulride-geo-prompted");
    if (!forcePrompt && hasPrompted) {
      return;
    }

    setLocationStatus("loading");
    sessionStorage.setItem("soulride-geo-prompted", "true");
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserPosition(coords);
        setLocationStatus("success");

        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([coords.lat, coords.lng], USER_ZOOM, {
            duration: 1.5,
          });
        }
      },
      () => {
        // Geolocation denied or unavailable - stay on default view
        setLocationStatus("error");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
    }, 100);
  };

  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  useEffect(() => {
    let cancelled = false;

    const initMap = async () => {
      try {
      if (!mapRef.current || mapInstanceRef.current) return;
      
      const L = (await import("leaflet")).default;
      await import("leaflet.markercluster");
      if (cancelled || !mapRef.current || mapInstanceRef.current) return;
      
      const map = L.map(mapRef.current, {
        scrollWheelZoom: true,
        zoomControl: false,
      }).setView([SKOPJE_COORDS.lat, SKOPJE_COORDS.lng], DEFAULT_ZOOM);
      
      // Vintage earthy dark tiles
      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
        updateWhenIdle: true,
        keepBuffer: 4,
        className: 'vintage-map-tiles',
      }).addTo(map);

      // Vintage brass tack cluster styling
      const clusterGroup = createMarkerClusterGroup(L, {
        maxClusterRadius: 60,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
        iconCreateFunction: (cluster) => {
          const count = cluster.getChildCount();
          return L.divIcon({
            className: "custom-cluster-icon",
            html: `
              <div style="
                width: ${36 + count * 2}px;
                height: ${36 + count * 2}px;
                background: linear-gradient(135deg, hsl(140 22% 38%) 0%, hsl(20 45% 42%) 100%);
                border-radius: 50%;
                border: 3px solid hsl(40 30% 85%);
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: 'Bitter', 'Rockwell', serif;
                font-size: ${14 + Math.min(count, 10)}px;
                color: hsl(40 30% 94%);
                letter-spacing: 0.05em;
                box-shadow: 0 4px 15px hsl(20 45% 38% / 0.5), 0 0 20px hsl(140 22% 42% / 0.3), inset 0 1px 0 hsl(40 30% 70% / 0.3);
              ">
                ${count}
              </div>
            `,
            iconSize: [36 + count * 2, 36 + count * 2],
            iconAnchor: [(36 + count * 2) / 2, (36 + count * 2) / 2],
          });
        },
      });

      // Vintage brass tack marker icon
      const createSpotIcon = (spot: Spot) => {
        return L.divIcon({
          className: "custom-marker",
          html: `
            <div style="
              width: 28px; 
              height: 28px; 
              background: linear-gradient(135deg, hsl(140 22% 38%) 0%, hsl(140 22% 32%) 100%); 
              border-radius: 50%; 
              border: 2px solid hsl(40 30% 85%); 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              box-shadow: 0 4px 12px hsl(0 0% 0% / 0.5), 0 0 15px hsl(140 22% 42% / 0.4), inset 0 1px 0 hsl(40 30% 70% / 0.3);
              transition: transform 0.2s ease;
            ">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="hsl(40 30% 94%)" stroke-width="2.5">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 28],
          popupAnchor: [0, -28],
        });
      };

      // Add spots with vintage popups
      spots.forEach((spot) => {
        const marker = L.marker([spot.coordinates.lat, spot.coordinates.lng], {
          icon: createSpotIcon(spot),
        });

        const distanceFromSkopje = Math.round(
          map.distance(
            [SKOPJE_COORDS.lat, SKOPJE_COORDS.lng],
            [spot.coordinates.lat, spot.coordinates.lng]
          ) / 1000
        );

        marker.bindPopup(`
          <div style="padding: 12px; min-width: 200px; max-width: 280px; font-family: 'Libre Baskerville', Georgia, serif;">
            <h3 style="font-family: 'Bitter', 'Rockwell', serif; font-size: 1.1rem; letter-spacing: 0.05em; margin-bottom: 4px; color: hsl(40 30% 94%);">${spot.title}</h3>
            <p style="font-size: 0.75rem; color: hsl(20 45% 55%); font-style: italic; margin-bottom: 8px; font-family: 'Caveat', cursive;">"${spot.poeticTagline}"</p>
            <p style="font-size: 0.8rem; color: hsl(40 15% 60%); margin-bottom: 10px; line-height: 1.6;">${spot.description}</p>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
              <span style="font-size: 0.7rem; padding: 3px 8px; background: hsl(140 22% 42% / 0.2); border: 1px solid hsl(140 22% 42% / 0.3); border-radius: 999px; color: hsl(140 22% 55%); font-family: 'Special Elite', monospace;">📍 ${distanceFromSkopje} km</span>
              <span style="font-size: 0.7rem; padding: 3px 8px; background: hsl(20 45% 38% / 0.2); border: 1px solid hsl(20 45% 38% / 0.3); border-radius: 999px; color: hsl(20 45% 55%); font-family: 'Special Elite', monospace;">${spot.region}</span>
            </div>
            <a href="${import.meta.env.BASE_URL}spots/${spot.id}" style="display: inline-flex; align-items: center; gap: 6px; font-size: 0.8rem; color: hsl(140 22% 55%); text-decoration: none; font-weight: 500; font-family: 'Bitter', serif;">
              Explore this spot
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
          </div>
        `, {
          className: "vintage-popup",
          maxWidth: 300,
        });

        clusterGroup.addLayer(marker);
      });

      map.addLayer(clusterGroup);
      clusterGroupRef.current = clusterGroup;
      mapInstanceRef.current = map;
      setIsLoaded(true);
      setIsLoading(false);

      getUserLocation();
      } catch {
        if (!cancelled) setIsLoading(false);
      }
    };

    initMap();

    return () => {
      cancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [spots, getUserLocation]);

  // Add/update user marker when position changes
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
          <div style="position: relative; width: 28px; height: 28px;">
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
              inset: 4px;
              background: linear-gradient(135deg, hsl(32, 85%, 55%) 0%, hsl(38, 90%, 60%) 100%);
              border-radius: 50%;
              border: 2px solid rgba(255,255,255,0.6);
              box-shadow: 0 0 20px hsla(32, 85%, 52%, 0.6), 0 0 40px hsla(32, 85%, 52%, 0.3);
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              <div style="width: 6px; height: 6px; background: white; border-radius: 50%;"></div>
            </div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -14],
      });

      const marker = L.marker([userPosition.lat, userPosition.lng], {
        icon: userIcon,
        zIndexOffset: 1000,
      }).addTo(mapInstanceRef.current);

      marker.bindPopup(`
        <div style="padding: 8px; text-align: center;">
          <span style="color: hsl(32, 85%, 52%); font-size: 0.875rem; font-weight: 500;">✨ Your Position ✨</span>
          <p style="font-size: 0.75rem; color: hsl(220, 10%, 60%); margin-top: 4px;">Start exploring nearby soul spots!</p>
        </div>
      `);

      userMarkerRef.current = marker;
    };

    addUserMarker();
  }, [userPosition]);

  return (
    <div className="space-y-4">
      <div className={cn(
        "relative rounded-xl overflow-hidden transition-all duration-300",
        isFullscreen && "fixed inset-2 sm:inset-4 z-50 rounded-2xl"
      )}
      style={{
        border: '1px solid hsl(140 15% 25% / 0.4)',
        boxShadow: '0 0 40px hsl(140 22% 42% / 0.1), inset 0 0 60px hsl(20 45% 38% / 0.05)',
      }}
      >
        {isLoading && <MapLoadingSpinner message="Loading spots map..." />}
        
        {/* Grain overlay */}
        <div className="absolute inset-0 pointer-events-none z-[500] grain-overlay opacity-15" />
        
        {/* Custom Controls */}
        <div className="absolute top-3 right-3 z-[1001] flex flex-col gap-2">
          {/* Locate Me */}
          <button
            onClick={() => getUserLocation(true)}
            disabled={locationStatus === "loading"}
            className={cn(
              "p-2.5 rounded-full transition-all duration-300",
              "backdrop-blur-sm",
              locationStatus === "loading" && "animate-pulse",
            )}
            style={{
              background: locationStatus === "success" 
                ? 'hsl(140 22% 42% / 0.3)' 
                : 'hsl(200 20% 10% / 0.8)',
              border: locationStatus === "success"
                ? '1px solid hsl(140 22% 42% / 0.5)'
                : '1px solid hsl(140 15% 25% / 0.4)',
            }}
            aria-label="Locate me"
            title="Locate me"
          >
            <Compass 
              size={18} 
              className={cn(
                "transition-all duration-300",
                locationStatus === "loading" && "animate-spin"
              )}
              style={{
                color: locationStatus === "success" ? 'hsl(140 22% 55%)' : 'hsl(40 15% 55%)',
              }}
            />
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-2.5 rounded-full transition-all duration-300 backdrop-blur-sm"
            style={{
              background: 'hsl(200 20% 10% / 0.8)',
              border: '1px solid hsl(140 15% 25% / 0.4)',
              color: 'hsl(40 15% 55%)',
            }}
            aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? (
              <Minimize2 size={18} />
            ) : (
              <Maximize2 size={18} />
            )}
          </button>

          {/* Zoom Controls */}
          <div 
            className="flex flex-col rounded-full overflow-hidden backdrop-blur-sm"
            style={{
              background: 'hsl(200 20% 10% / 0.8)',
              border: '1px solid hsl(140 15% 25% / 0.4)',
            }}
          >
            <button
              onClick={handleZoomIn}
              className="p-2 transition-colors"
              style={{ 
                borderBottom: '1px solid hsl(140 15% 25% / 0.3)',
                color: 'hsl(40 15% 55%)',
              }}
              aria-label="Zoom in"
            >
              <ZoomIn size={16} />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-2 transition-colors"
              style={{ color: 'hsl(40 15% 55%)' }}
              aria-label="Zoom out"
            >
              <ZoomOut size={16} />
            </button>
          </div>
        </div>

        {isFullscreen && (
          <button
            onClick={toggleFullscreen}
            className="absolute top-3 left-3 z-[1001] p-2.5 rounded-full backdrop-blur-sm transition-all"
            style={{
              background: 'hsl(200 20% 10% / 0.8)',
              border: '1px solid hsl(140 15% 25% / 0.4)',
              color: 'hsl(40 30% 90%)',
            }}
          >
            <Minimize2 size={18} className="text-foreground" />
          </button>
        )}

        <div
          ref={mapRef}
          className={cn(
            "w-full transition-all duration-300",
            isFullscreen ? "h-full" : "h-56 sm:h-64 md:h-80"
          )}
          style={{ background: "hsl(200 20% 8%)" }}
        />

        {/* Vintage Legend */}
        <div 
          className="absolute bottom-3 left-3 z-[1001] p-3 rounded-lg backdrop-blur-sm"
          style={{
            background: 'hsl(200 20% 10% / 0.85)',
            border: '1px solid hsl(140 15% 25% / 0.4)',
          }}
        >
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center gap-2">
              <div 
                className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                style={{
                  background: 'linear-gradient(135deg, hsl(140 22% 38%) 0%, hsl(20 45% 42%) 100%)',
                  border: '2px solid hsl(40 30% 85%)',
                  color: 'hsl(40 30% 94%)',
                  fontFamily: "'Bitter', serif",
                }}
              >
                5
              </div>
              <span style={{ color: 'hsl(40 15% 55%)', fontFamily: "'Special Elite', monospace", fontSize: '10px' }}>
                Grouped spots (click to expand)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded-full"
                style={{
                  background: 'hsl(140 22% 38%)',
                  border: '2px solid hsl(40 30% 85%)',
                }}
              />
              <span style={{ color: 'hsl(40 15% 55%)', fontFamily: "'Special Elite', monospace", fontSize: '10px' }}>
                Individual spot
              </span>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes pulse-ring {
            0% { transform: scale(1); opacity: 0.4; }
            100% { transform: scale(2.5); opacity: 0; }
          }
          .vintage-popup .leaflet-popup-content-wrapper {
            background: hsl(200 20% 10%);
            color: hsl(40 30% 94%);
            border: 1px solid hsl(140 15% 25% / 0.4);
            border-radius: 10px;
            box-shadow: 0 8px 30px hsl(0 0% 0% / 0.5);
          }
          .vintage-popup .leaflet-popup-tip {
            background: hsl(200 20% 10%);
            border: 1px solid hsl(140 15% 25% / 0.4);
          }
          .leaflet-marker-icon {
            transition: transform 0.2s ease;
          }
          .leaflet-marker-icon:hover {
            transform: scale(1.1);
          }
          .vintage-map-tiles {
            filter: sepia(15%) saturate(85%) brightness(95%);
          }
        `}</style>
      </div>
      
      {/* Offline Navigation Note */}
      <div 
        className="flex items-start gap-3 p-4 rounded-xl backdrop-blur-sm"
        style={{
          background: 'hsl(140 22% 42% / 0.1)',
          border: '1px solid hsl(140 22% 42% / 0.2)',
        }}
      >
        <div 
          className="p-1.5 rounded-lg flex-shrink-0"
          style={{ background: 'hsl(20 45% 38% / 0.2)' }}
        >
          <Compass size={14} style={{ color: 'hsl(20 45% 50%)' }} />
        </div>
        <p 
          className="text-xs tracking-wide leading-relaxed"
          style={{ 
            color: 'hsl(40 15% 55%)',
            fontFamily: "'Libre Baskerville', Georgia, serif",
          }}
        >
          <span style={{ color: 'hsl(40 30% 88%)', fontWeight: '500' }}>For full offline GPS navigation:</span>{" "}
          Export routes to apps like <span style={{ color: 'hsl(140 22% 55%)' }}>OsmAnd</span> or browser-cache OSM tiles. 
          Enable location for routes from your spot.
        </p>
      </div>
    </div>
  );
};

interface SpotDetailMapProps {
  spot: Spot;
}

export const SpotDetailMap = ({ spot }: SpotDetailMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
    }, 100);
  };

  useEffect(() => {
    let cancelled = false;

    const initMap = async () => {
      try {
      if (!mapRef.current || mapInstanceRef.current) return;
      
      const L = (await import("leaflet")).default;
      if (cancelled || !mapRef.current || mapInstanceRef.current) return;

      const map = L.map(mapRef.current, {
        scrollWheelZoom: true,
        zoomControl: false,
      }).setView([spot.coordinates.lat, spot.coordinates.lng], 13);

      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(map);

      const customIcon = L.divIcon({
        className: "custom-marker-detail",
        html: `
          <div style="
            position: relative;
            width: 40px;
            height: 40px;
          ">
            <div style="
              position: absolute;
              inset: 0;
              background: hsl(32, 85%, 52%);
              border-radius: 50%;
              opacity: 0.2;
              animation: pulse-ring 2s ease-out infinite;
            "></div>
            <div style="
              position: absolute;
              inset: 4px;
              background: linear-gradient(135deg, hsl(32, 80%, 50%) 0%, hsl(38, 90%, 55%) 100%);
              border-radius: 50%;
              border: 3px solid rgba(255,255,255,0.5);
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 0 25px hsla(32, 85%, 52%, 0.5), 0 4px 15px rgba(0,0,0,0.5);
            ">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
      });

      const marker = L.marker([spot.coordinates.lat, spot.coordinates.lng], {
        icon: customIcon,
      }).addTo(map);

      marker.bindPopup(`
        <div style="padding: 12px; text-align: center;">
          <span style="color: hsl(32, 85%, 52%); font-size: 0.75rem;">🏁 DESTINATION</span>
          <h3 style="font-family: 'Bebas Neue', sans-serif; font-size: 1.2rem; letter-spacing: 0.05em; margin-top: 4px;">${spot.title}</h3>
          <p style="font-size: 0.75rem; color: hsl(160 50% 55%); font-style: italic; margin-top: 4px;">"${spot.poeticTagline}"</p>
        </div>
      `, { className: "dark-popup" }).openPopup();

      mapInstanceRef.current = map;
      } catch {
        if (!cancelled && mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
      }
    };

    initMap();

    return () => {
      cancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [spot]);

  return (
    <div className="space-y-4">
      <div className={cn(
        "relative rounded-xl overflow-hidden border border-border/50 gradient-border transition-all duration-300",
        isFullscreen && "fixed inset-2 sm:inset-4 z-50 rounded-2xl"
      )}>
        <div className="absolute inset-0 pointer-events-none z-[500] watercolor-overlay opacity-15" />
        
        {/* Controls */}
        <div className="absolute top-3 right-3 z-[400] flex gap-2">
          <button
            onClick={toggleFullscreen}
            className={cn(
              "p-2 sm:p-2.5 rounded-full transition-all duration-300",
              "bg-background/80 backdrop-blur-sm border border-border/50",
              "hover:bg-earth-green/20 hover:border-earth-green/50 hover:scale-105"
            )}
            aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? (
              <Minimize2 size={16} className="sm:w-[18px] sm:h-[18px] text-muted-foreground" />
            ) : (
              <Maximize2 size={16} className="sm:w-[18px] sm:h-[18px] text-muted-foreground" />
            )}
          </button>
        </div>

        {isFullscreen && (
          <button
            onClick={toggleFullscreen}
            className="absolute top-3 left-3 z-[400] p-2 sm:p-2.5 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 hover:bg-destructive/20 transition-all"
          >
            <Minimize2 size={16} className="sm:w-[18px] sm:h-[18px] text-foreground" />
          </button>
        )}

        <div
          ref={mapRef}
          className={cn(
            "w-full transition-all duration-300",
            isFullscreen ? "h-full" : "h-56 sm:h-64 md:h-96"
          )}
          style={{ background: "hsl(220, 15%, 10%)" }}
        />

        <style>{`
          @keyframes pulse-ring {
            0% { transform: scale(1); opacity: 0.3; }
            100% { transform: scale(2.5); opacity: 0; }
          }
          .dark-popup .leaflet-popup-content-wrapper {
            background: hsl(0 0% 9%);
            color: hsl(40 15% 94%);
            border: 1px solid hsl(220 8% 20%);
            border-radius: 12px;
          }
          .dark-popup .leaflet-popup-tip {
            background: hsl(0 0% 9%);
          }
        `}</style>
      </div>
      
      {/* Offline Navigation Note */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-mountain-blue/10 border border-mountain-blue/20 backdrop-blur-sm">
        <div className="p-1.5 rounded-lg bg-soul-amber/20 flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-soul-amber">
            <circle cx="12" cy="12" r="10"/>
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
          </svg>
        </div>
        <p className="text-xs text-muted-foreground tracking-wide leading-relaxed">
          <span className="text-foreground/90 font-medium">For full offline GPS navigation:</span>{" "}
          Export routes to apps like <span className="text-earth-green-glow">OsmAnd</span> or browser-cache OSM tiles. 
          Enable location for routes from your spot – fallback to central view if no permission.
        </p>
      </div>
    </div>
  );
};
