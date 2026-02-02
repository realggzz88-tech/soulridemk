import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { spots, Spot } from "@/data/spots";
import { macedonianLocations, foodDrinkStops } from "@/data/journeyData";

interface JourneyRouteMapProps {
  startLocation: typeof macedonianLocations[0];
  endLocation: typeof macedonianLocations[0];
  stops: Spot[];
  foodStops: typeof foodDrinkStops;
}

const JourneyRouteMap = ({ startLocation, endLocation, stops, foodStops }: JourneyRouteMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Clean up previous map instance
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Initialize map
    const map = L.map(mapRef.current, {
      center: [41.5, 21.0],
      zoom: 8,
      scrollWheelZoom: false,
    });

    mapInstanceRef.current = map;

    // Dark theme tiles
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(map);

    // Custom icons
    const startIcon = L.divIcon({
      className: "custom-marker",
      html: `
        <div style="
          width: 32px; height: 32px; 
          background: linear-gradient(135deg, hsl(160, 45%, 40%), hsl(160, 45%, 30%));
          border: 3px solid hsl(160, 45%, 50%);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 20px hsl(160 45% 40% / 0.5);
        ">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    const endIcon = L.divIcon({
      className: "custom-marker",
      html: `
        <div style="
          width: 32px; height: 32px; 
          background: linear-gradient(135deg, hsl(32, 85%, 52%), hsl(32, 85%, 40%));
          border: 3px solid hsl(32, 85%, 60%);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 20px hsl(32 85% 52% / 0.5);
        ">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });

    const spotIcon = L.divIcon({
      className: "custom-marker",
      html: `
        <div style="
          width: 28px; height: 28px; 
          background: linear-gradient(135deg, hsl(215, 50%, 50%), hsl(215, 50%, 40%));
          border: 2px solid hsl(215, 50%, 60%);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 15px hsl(215 50% 50% / 0.4);
        ">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
            <path d="m2 17 10 5 10-5"></path>
            <path d="m2 12 10 5 10-5"></path>
          </svg>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    const foodIcon = L.divIcon({
      className: "custom-marker",
      html: `
        <div style="
          width: 24px; height: 24px; 
          background: linear-gradient(135deg, hsl(32, 70%, 45%), hsl(32, 70%, 35%));
          border: 2px solid hsl(32, 70%, 55%);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 12px hsl(32 70% 45% / 0.4);
        ">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
            <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
            <line x1="6" y1="1" x2="6" y2="4"></line>
            <line x1="10" y1="1" x2="10" y2="4"></line>
            <line x1="14" y1="1" x2="14" y2="4"></line>
          </svg>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    // Add markers
    const allPoints: L.LatLngExpression[] = [];

    // Start marker
    const startLatLng: L.LatLngExpression = [startLocation.lat, startLocation.lng];
    allPoints.push(startLatLng);
    L.marker(startLatLng, { icon: startIcon })
      .addTo(map)
      .bindPopup(`
        <div style="text-align: center; padding: 8px;">
          <strong style="color: hsl(160, 45%, 40%);">Start</strong>
          <p style="margin: 4px 0 0; font-weight: 500;">${startLocation.name}</p>
        </div>
      `);

    // Spot markers
    stops.forEach((spot, index) => {
      const latLng: L.LatLngExpression = [spot.coordinates.lat, spot.coordinates.lng];
      allPoints.push(latLng);
      
      L.marker(latLng, { icon: spotIcon })
        .addTo(map)
        .bindPopup(`
          <div style="min-width: 200px; padding: 8px;">
            <img src="${spot.images[0]}" alt="${spot.title}" style="width: 100%; height: 80px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;" />
            <strong style="display: block; margin-bottom: 4px;">${spot.title}</strong>
            <em style="color: #888; font-size: 12px;">"${spot.poeticTagline}"</em>
          </div>
        `);
    });

    // Food stop markers
    foodStops.forEach((food) => {
      const latLng: L.LatLngExpression = [food.lat, food.lng];
      
      L.marker(latLng, { icon: foodIcon })
        .addTo(map)
        .bindPopup(`
          <div style="min-width: 180px; padding: 8px;">
            <strong style="display: block; margin-bottom: 4px; color: hsl(32, 70%, 50%);">${food.name}</strong>
            <p style="margin: 0; font-size: 12px; color: #888;">${food.description}</p>
          </div>
        `);
    });

    // End marker
    const endLatLng: L.LatLngExpression = [endLocation.lat, endLocation.lng];
    allPoints.push(endLatLng);
    L.marker(endLatLng, { icon: endIcon })
      .addTo(map)
      .bindPopup(`
        <div style="text-align: center; padding: 8px;">
          <strong style="color: hsl(32, 85%, 52%);">Destination</strong>
          <p style="margin: 4px 0 0; font-weight: 500;">${endLocation.name}</p>
        </div>
      `);

    // Draw route polyline
    const routeLine = L.polyline(allPoints, {
      color: "hsl(32, 85%, 52%)",
      weight: 3,
      opacity: 0.8,
      dashArray: "10, 10",
      lineCap: "round",
    }).addTo(map);

    // Fit bounds to show all markers
    if (allPoints.length > 1) {
      const bounds = L.latLngBounds(allPoints);
      map.fitBounds(bounds, { padding: [50, 50] });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [startLocation, endLocation, stops, foodStops]);

  return (
    <div className="rounded-xl overflow-hidden border border-border/30 shadow-lg">
      <div 
        ref={mapRef} 
        className="w-full h-[400px] sm:h-[500px]"
        style={{ background: "hsl(220 20% 10%)" }}
      />
    </div>
  );
};

export default JourneyRouteMap;
