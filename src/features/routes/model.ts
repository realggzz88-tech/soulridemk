export type Surface = "asphalt" | "mixed" | "gravel";

export type RouteRegion = "East" | "West" | "Central" | "Multi-Region";
export type RouteDifficulty = "Easy" | "Moderate" | "Challenging";

/** Fields the list needs from whatever source later replaces the static catalog. */
export interface RouteSourceRecord {
  id: string;
  region: RouteRegion;
  difficulty: RouteDifficulty;
  duration: string;
  distance: string;
  spotIds: readonly string[];
  routeDetails: { roadCondition: string };
}

export interface RouteListItem {
  id: string;
  region: RouteRegion;
  difficulty: RouteDifficulty;
  distanceKm: number;
  durationMin: number;
  durationMax: number;
  stops: number;
  surface: Surface;
  order: number;
}

export function surfaceFromRoadCondition(roadCondition: string): Surface {
  const text = roadCondition.toLowerCase();
  const gravel = /gravel|macadam|макадам|unpaved/.test(text);
  const paved = /asphalt|paved|sealed/.test(text);
  if (gravel && paved) return "mixed";
  if (gravel) return "gravel";
  return "asphalt";
}

export function parseDistanceKm(distance: string): number {
  const match = distance.match(/(\d+(?:[.,]\d+)?)/);
  if (!match) {
    throw new Error(`Unparsed distance: ${distance}`);
  }
  return Number(match[1].replace(",", "."));
}

export function parseDurationHours(duration: string): { min: number; max: number } {
  const range = duration.match(/(\d+)\s*[–-]\s*(\d+)/);
  if (range) {
    return { min: Number(range[1]), max: Number(range[2]) };
  }
  const single = duration.match(/(\d+)/);
  if (!single) {
    throw new Error(`Unparsed duration: ${duration}`);
  }
  const hours = Number(single[1]);
  return { min: hours, max: hours };
}

export function toRouteListItem(route: RouteSourceRecord, order: number): RouteListItem {
  const duration = parseDurationHours(route.duration);
  return {
    id: route.id,
    region: route.region,
    difficulty: route.difficulty,
    distanceKm: parseDistanceKm(route.distance),
    durationMin: duration.min,
    durationMax: duration.max,
    stops: route.spotIds.length,
    surface: surfaceFromRoadCondition(route.routeDetails.roadCondition),
    order,
  };
}
