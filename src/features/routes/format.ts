import { translate, plural, type Lang } from "./copy";
import type { RouteListItem } from "./model";

const difficultyKey = {
  Easy: "easy",
  Moderate: "moderate",
  Challenging: "challenging",
} as const;

export function difficultyLabel(lang: Lang, difficulty: RouteListItem["difficulty"]): string {
  return translate(lang, `difficulty.${difficultyKey[difficulty]}`);
}

export function regionLabel(lang: Lang, region: RouteListItem["region"]): string {
  const key = {
    East: "east",
    West: "west",
    Central: "central",
    "Multi-Region": "multi",
  }[region];
  return translate(lang, `region.${key}`);
}

export function surfaceLabel(lang: Lang, surface: RouteListItem["surface"]): string {
  return translate(lang, `surface.${surface}`);
}

export function formatDistance(lang: Lang, distanceKm: number): string {
  return `~${distanceKm} ${translate(lang, "units.km")}`;
}

export function formatDuration(lang: Lang, item: Pick<RouteListItem, "durationMin" | "durationMax">): string {
  return translate(lang, "units.hours", { min: item.durationMin, max: item.durationMax });
}

export function formatStops(lang: Lang, stops: number): string {
  return plural(lang, "routes.stops", stops);
}

export function formatStats(lang: Lang, item: RouteListItem): string {
  return `${formatDistance(lang, item.distanceKm)} · ${formatDuration(lang, item)} · ${formatStops(lang, item.stops)}`;
}

export function routeTitle(lang: Lang, id: string): string {
  return translate(lang, `routes.items.${id}.title`);
}

export function routeTagline(lang: Lang, id: string): string {
  return translate(lang, `routes.items.${id}.tagline`);
}

export function cardLabel(lang: Lang, item: RouteListItem): string {
  return translate(lang, "routes.card.aria", {
    title: routeTitle(lang, item.id),
    distance: formatDistance(lang, item.distanceKm),
    difficulty: difficultyLabel(lang, item.difficulty),
  });
}
