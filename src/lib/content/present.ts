import type { Route as UiRoute } from "@/data/routes";
import type { Spot as UiSpot } from "@/data/spots";
import { bundledRoute, bundledSpot } from "./static";
import type { Photo, Route, Spot } from "./types";

export interface SpotWithPhotos extends UiSpot {
  photos: Photo[];
  images: string[];
}

export interface RouteWithPhotos extends UiRoute {
  photos: Photo[];
  mainImage: string;
}

/** Local variant URL. `legacySrc` is only for a row that has not been mirrored yet. */
export function variantSrc(photo: Photo, width = 800, extension: "webp" = "webp"): string {
  if (photo.legacySrc) return photo.legacySrc;
  const widths = photo.widths?.length ? photo.widths : [width];
  const chosen = widths.reduce((best, item) => (Math.abs(item - width) < Math.abs(best - width) ? item : best));
  const base = import.meta.env.BASE_URL ?? "/";
  return `${base}img/${photo.key}-${chosen}.${extension}`;
}

export function photoDisplaySrc(photo: Photo): string {
  return variantSrc(photo, 800, "webp");
}

function projectSpot(spot: Spot): SpotWithPhotos {
  const text = spot.t.en;
  return {
    id: spot.slug,
    title: text.title,
    description: text.description,
    longDescription: text.longDescription,
    poeticTagline: text.tagline,
    tags: [...spot.tags],
    region: spot.region,
    images: spot.photos.map(photoDisplaySrc),
    riderTips: [...text.riderTips],
    coordinates: { lat: spot.lat, lng: spot.lng },
    photos: spot.photos,
  };
}

function projectRoute(route: Route): RouteWithPhotos {
  const text = route.t.en;
  const thingsToDo: UiRoute["thingsToDo"] = {};
  for (const stop of route.stops) {
    const line = stop.thingsToDo.en || stop.thingsToDo.mk;
    if (line) thingsToDo[stop.spotSlug] = line;
  }
  const distance =
    route.distanceKm == null
      ? ""
      : `~${Number.isInteger(route.distanceKm) ? route.distanceKm : route.distanceKm} km`;

  return {
    id: route.slug,
    title: text.title,
    description: text.description,
    poeticTagline: text.tagline,
    longDescription: text.longDescription,
    spotIds: route.stops.map((stop) => stop.spotSlug),
    region: route.region,
    difficulty: route.difficulty,
    duration: text.durationText,
    distance,
    mainImage: route.cover ? photoDisplaySrc(route.cover) : "",
    photos: route.photos,
    highlights: [...text.highlights],
    activities: [...text.activities],
    riderTips: [...text.riderTips],
    thingsToDo,
    eatAndRest: text.eatAndRest.map((stop) => ({ name: stop.name, description: stop.description })),
    routeDetails: {
      elevation: route.details.en.elevation ?? "",
      roadCondition: route.details.en.roadCondition ?? "",
      bestSeason: route.details.en.bestSeason ?? "",
      fuelStops: route.details.en.fuelStops ?? "",
    },
  };
}

/**
 * Text and coordinates stay the bundled record. Image URLs come from the
 * self-hosted catalog, so the old hotlinks are not what the page renders.
 */
export function toUiSpot(spot: Spot): SpotWithPhotos {
  const bundled = bundledSpot(spot);
  const images = spot.photos.map(photoDisplaySrc);
  if (!bundled) return projectSpot(spot);
  return { ...bundled, images, photos: spot.photos };
}

export function toUiRoute(route: Route): RouteWithPhotos {
  const bundled = bundledRoute(route);
  const mainImage = route.cover ? photoDisplaySrc(route.cover) : "";
  if (!bundled) return projectRoute(route);
  return { ...bundled, mainImage, photos: route.photos };
}
