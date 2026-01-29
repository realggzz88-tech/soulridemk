import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import type { Spot } from "@/data/spots";
import "leaflet/dist/leaflet.css";

interface SpotsOverviewMapProps {
  spots: Spot[];
}

export const SpotsOverviewMap = ({ spots }: SpotsOverviewMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const initMap = async () => {
      if (!mapRef.current || mapInstanceRef.current) return;
      
      const L = (await import("leaflet")).default;
      
      const map = L.map(mapRef.current, {
        scrollWheelZoom: false,
      }).setView([41.3, 20.9], 8);
      
      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      // Custom icon
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
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [spots]);

  return (
    <div className="relative rounded-xl overflow-hidden border border-border/50 gradient-border">
      <div className="absolute inset-0 pointer-events-none z-[1000] watercolor-overlay opacity-20" />
      <div
        ref={mapRef}
        className="h-64 md:h-80 w-full"
        style={{ background: "hsl(220, 15%, 10%)" }}
      />
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
