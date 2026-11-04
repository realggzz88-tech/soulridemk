import type { Route as UiRoute } from "@/data/routes";
import type { Spot as UiSpot } from "@/data/spots";
import { bundledRoute, bundledSpot } from "./static";
import type { Photo, Route, Spot } from "./types";

/** URL the current `<img>` tags should use. Local files replace legacy hotlinks later. */
export function photoDisplaySrc(photo: Photo): string {
  if (photo.legacySrc) return photo.legacySrc;
  const base = import.meta.env.BASE_URL ?? "/";
  return `${base}img/${photo.key}-800.jpg`;
}

function projectSpot(spot: Spot): UiSpot {
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
  };
}

function projectRoute(route: Route): UiRoute {
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

/** Same object the page used to import, when the row came from `src/data`. */
export function toUiSpot(spot: Spot): UiSpot {
  return bundledSpot(spot) ?? projectSpot(spot);
}

export function toUiRoute(route: Route): UiRoute {
  return bundledRoute(route) ?? projectRoute(route);
}
