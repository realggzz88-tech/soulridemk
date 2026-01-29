import { useEffect, useState, useRef, useCallback } from "react";
import type { Spot } from "@/data/spots";
import { Compass } from "lucide-react";
import { cn } from "@/lib/utils";
import "leaflet/dist/leaflet.css";

// Default center: Strumica, Macedonia
const STRUMICA_COORDS = { lat: 41.4375, lng: 22.6433 };
const DEFAULT_ZOOM = 8;
const USER_ZOOM = 13;

interface SpotsOverviewMapProps {
  spots: Spot[];
}

export const SpotsOverviewMap = ({ spots }: SpotsOverviewMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const userMarkerRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [userPosition, setUserPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

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

        // Fly to user position
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([coords.lat, coords.lng], USER_ZOOM, {
            duration: 1.5,
          });
        }
      },
      (error) => {
        console.log("Geolocation error:", error.message);
        setLocationStatus("error");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  useEffect(() => {
    const initMap = async () => {
      if (!mapRef.current || mapInstanceRef.current) return;
      
      const L = (await import("leaflet")).default;
      
      const map = L.map(mapRef.current, {
        scrollWheelZoom: false,
      }).setView([STRUMICA_COORDS.lat, STRUMICA_COORDS.lng], DEFAULT_ZOOM);
      
      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      // Custom icon for spots
      const customIcon = L.divIcon({
        className: "custom-marker",
        html: `<div style="width: 24px; height: 24px; background: hsl(160, 35%, 30%); border-radius: 50%; border: 2px solid rgba(255,255,255,0.3); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.4);">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 24],
        popupAnchor: [0, -24],
      });

      spots.forEach((spot) => {
        const marker = L.marker([spot.coordinates.lat, spot.coordinates.lng], {
          icon: customIcon,
        }).addTo(map);

        marker.bindPopup(`
          <div style="padding: 8px; min-width: 160px;">
            <h3 style="font-family: 'Bebas Neue', sans-serif; font-size: 1.1rem; letter-spacing: 0.05em; margin-bottom: 4px;">${spot.title}</h3>
            <p style="font-size: 0.75rem; color: hsl(220, 10%, 55%); margin-bottom: 8px;">${spot.description}</p>
            <a href="/spots/${spot.id}" style="font-size: 0.75rem; color: hsl(160, 40%, 40%);">Explore this spot →</a>
          </div>
        `);
      });

      mapInstanceRef.current = map;
      setIsLoaded(true);

      // Try to get user location on first load
      getUserLocation();
    };

    initMap();

    return () => {
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

      // Remove existing user marker
      if (userMarkerRef.current) {
        userMarkerRef.current.remove();
      }

      // Pulsing user position marker with amber glow
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
    <div className="relative rounded-xl overflow-hidden border border-border/50 gradient-border">
      <div className="absolute inset-0 pointer-events-none z-[1000] watercolor-overlay opacity-20" />
      
      {/* Center on Me button */}
      <button
        onClick={getUserLocation}
        disabled={locationStatus === "loading"}
        className={cn(
          "absolute top-3 right-3 z-[1001] p-2.5 rounded-full transition-all duration-300",
          "bg-background/80 backdrop-blur-sm border border-border/50",
          "hover:bg-soul-amber/20 hover:border-soul-amber/50",
          "hover:shadow-[0_0_20px_hsl(var(--amber-soul)/0.4)]",
          locationStatus === "loading" && "animate-pulse",
          locationStatus === "success" && "bg-soul-amber/20 border-soul-amber/40"
        )}
        aria-label="Center on my location"
        title="Center on my location"
      >
        <Compass 
          size={18} 
          className={cn(
            "transition-all duration-300",
            locationStatus === "success" ? "text-soul-amber" : "text-muted-foreground",
            locationStatus === "loading" && "animate-spin"
          )}
          style={{
            filter: locationStatus === "success" ? "drop-shadow(0 0 6px hsl(32 85% 52% / 0.6))" : undefined
          }}
        />
      </button>

      <div
        ref={mapRef}
        className="h-64 md:h-80 w-full"
        style={{ background: "hsl(220, 15%, 10%)" }}
      />

      {/* Add keyframes for pulse animation */}
      <style>{`
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.4; }
          100% { transform: scale(2.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

interface SpotDetailMapProps {
  spot: Spot;
}

export const SpotDetailMap = ({ spot }: SpotDetailMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    const initMap = async () => {
      if (!mapRef.current || mapInstanceRef.current) return;
      
      const L = (await import("leaflet")).default;

      const map = L.map(mapRef.current, {
        scrollWheelZoom: false,
      }).setView([spot.coordinates.lat, spot.coordinates.lng], 12);

      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      // Custom amber icon for detail
      const customIcon = L.divIcon({
        className: "custom-marker-detail",
        html: `<div style="width: 32px; height: 32px; background: hsl(30, 80%, 50%); border-radius: 50%; border: 2px solid rgba(255,255,255,0.4); display: flex; align-items: center; justify-content: center; box-shadow: 0 0 20px hsla(30, 80%, 50%, 0.4), 0 4px 12px rgba(0,0,0,0.4);">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });

      const marker = L.marker([spot.coordinates.lat, spot.coordinates.lng], {
        icon: customIcon,
      }).addTo(map);

      marker.bindPopup(`
        <div style="padding: 12px; text-align: center;">
          <span style="color: hsl(30, 80%, 50%); font-size: 0.875rem; font-weight: 500;">✨ Soulful stop here! ✨</span>
          <h3 style="font-family: 'Bebas Neue', sans-serif; font-size: 1.1rem; letter-spacing: 0.05em; margin-top: 4px;">${spot.title}</h3>
        </div>
      `).openPopup();

      mapInstanceRef.current = map;
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [spot]);

  return (
    <div className="relative rounded-xl overflow-hidden border border-border/50 gradient-border">
      <div className="absolute inset-0 pointer-events-none z-[1000] watercolor-overlay opacity-15" />
      <div
        ref={mapRef}
        className="h-64 md:h-96 w-full"
        style={{ background: "hsl(220, 15%, 10%)" }}
      />
    </div>
  );
};
