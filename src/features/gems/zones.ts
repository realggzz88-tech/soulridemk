import { listSpotPins, type SpotPin } from "./catalog";

export type ZoneKind = "ok" | "protected" | "strict";

export interface Zone {
  id: string;
  kind: Exclude<ZoneKind, "ok">;
  nameMk: string;
  nameEn: string;
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

/**
 * Approximate boxes. Strict wins over protected.
 * TODO(backend): replace with OSM / WDPA reserve polygons when Dev Backend ships them.
 */
export const ZONES: Zone[] = [
  {
    id: "ezerani",
    kind: "strict",
    nameMk: "Езерани",
    nameEn: "Ezerani",
    minLat: 40.94,
    maxLat: 40.99,
    minLng: 21.01,
    maxLng: 21.08,
  },
  {
    id: "galicica",
    kind: "protected",
    nameMk: "НП Галичица",
    nameEn: "Galičica NP",
    minLat: 40.9,
    maxLat: 41.25,
    minLng: 20.7,
    maxLng: 20.95,
  },
];

export function distanceMeters(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const r = 6371000;
  const dLat = ((bLat - aLat) * Math.PI) / 180;
  const dLng = ((bLng - aLng) * Math.PI) / 180;
  const lat1 = (aLat * Math.PI) / 180;
  const lat2 = (bLat * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * r * Math.asin(Math.min(1, Math.sqrt(h)));
}

export function zoneAt(lat: number, lng: number): Zone | null {
  const hits = ZONES.filter(
    (zone) => lat >= zone.minLat && lat <= zone.maxLat && lng >= zone.minLng && lng <= zone.maxLng,
  );
  return hits.find((zone) => zone.kind === "strict") ?? hits[0] ?? null;
}

export interface NearbySpot {
  spot: SpotPin;
  meters: number;
}

export function nearestSpot(lat: number, lng: number, pins: SpotPin[] = listSpotPins(), within = 150): NearbySpot | null {
  let best: NearbySpot | null = null;
  for (const spot of pins) {
    const meters = distanceMeters(lat, lng, spot.lat, spot.lng);
    if (!best || meters < best.meters) best = { spot, meters };
  }
  if (!best || best.meters > within) return null;
  return best;
}
