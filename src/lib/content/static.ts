import { spots as sourceSpots, type Spot as UiSpot } from "@/data/spots";
import { routes as sourceRoutes, type Route as UiRoute } from "@/data/routes";
import type { Lang, Photo, Route, RouteDetails, Spot, SpotText } from "./types";

/**
 * MK copy is not in `src/data` yet (backend B1). Both languages carry the
 * current English text so the view model is complete. The UI keeps reading
 * English until the i18n milestone.
 */
function bothLangs<T>(value: T): Record<Lang, T> {
  return { en: value, mk: value };
}

function spotText(spot: UiSpot): SpotText {
  return {
    title: spot.title,
    description: spot.description,
    longDescription: spot.longDescription,
    tagline: spot.poeticTagline,
    riderTips: spot.riderTips,
  };
}

function legacyPhoto(key: string, url: string, altEn: string): Photo {
  return {
    id: key,
    key,
    width: 1280,
    height: 960,
    alt: { en: altEn },
    focal: { x: 0.5, y: 0.5 },
    legacySrc: url,
  };
}

function parseDistanceKm(distance: string): number | undefined {
  const match = distance.match(/(\d+(?:\.\d+)?)/);
  if (!match) return undefined;
  const value = Number(match[1]);
  return Number.isFinite(value) ? value : undefined;
}

const uiSpots = new WeakMap<Spot, UiSpot>();
const uiRoutes = new WeakMap<Route, UiRoute>();

function mapSpot(spot: UiSpot): Spot {
  const content: Spot = {
    id: spot.id,
    slug: spot.id,
    region: spot.region,
    tags: spot.tags,
    lat: spot.coordinates.lat,
    lng: spot.coordinates.lng,
    photos: spot.images.map((url, index) =>
      legacyPhoto(`spots/${spot.id}/${String(index + 1).padStart(2, "0")}`, url, spot.title),
    ),
    t: bothLangs(spotText(spot)),
  };
  uiSpots.set(content, spot);
  return content;
}

function mapRoute(route: UiRoute): Route {
  const details: RouteDetails = {
    elevation: route.routeDetails.elevation,
    roadCondition: route.routeDetails.roadCondition,
    bestSeason: route.routeDetails.bestSeason,
    fuelStops: route.routeDetails.fuelStops,
  };
  const content: Route = {
    id: route.id,
    slug: route.id,
    region: route.region,
    difficulty: route.difficulty,
    distanceKm: parseDistanceKm(route.distance),
    cover: legacyPhoto(`routes/${route.id}/01`, route.mainImage, route.title),
    stops: route.spotIds.map((spotSlug, position) => ({
      spotSlug,
      position,
      thingsToDo: bothLangs(route.thingsToDo[spotSlug] ?? ""),
    })),
    t: bothLangs({
      title: route.title,
      description: route.description,
      longDescription: route.longDescription,
      tagline: route.poeticTagline,
      durationText: route.duration,
      highlights: route.highlights,
      activities: route.activities,
      riderTips: route.riderTips,
      eatAndRest: route.eatAndRest,
    }),
    details: bothLangs(details),
  };
  uiRoutes.set(content, route);
  return content;
}

let spotCache: Spot[] | null = null;
let routeCache: Route[] | null = null;

export function staticContentSpots(): Spot[] {
  if (!spotCache) spotCache = sourceSpots.map(mapSpot);
  return spotCache;
}

export function staticContentRoutes(): Route[] {
  if (!routeCache) routeCache = sourceRoutes.map(mapRoute);
  return routeCache;
}

/** Original UI object when this content row came from `src/data`. */
export function bundledSpot(spot: Spot): UiSpot | undefined {
  return uiSpots.get(spot);
}

export function bundledRoute(route: Route): UiRoute | undefined {
  return uiRoutes.get(route);
}
