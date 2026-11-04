import { unlistedSpotPhotos } from "./catalog";
import { fetchSupabaseRoutes, fetchSupabaseSpots } from "./supabase";
import { staticContentRoutes, staticContentSpots } from "./static";
import { resolveContentSource, type ContentSource } from "./source";
import type { CreditGroup, Route, Spot, SpotPage, SpotQuery } from "./types";

export function querySpots(items: Spot[], opts: SpotQuery = {}): SpotPage {
  let filtered = items;
  if (opts.region) {
    filtered = filtered.filter((spot) => spot.region === opts.region);
  }
  if (opts.tags && opts.tags.length > 0) {
    const tags = opts.tags;
    filtered = filtered.filter((spot) => tags.some((tag) => spot.tags.includes(tag)));
  }

  const total = filtered.length;
  const pageSize = opts.pageSize;
  if (pageSize && pageSize > 0) {
    const page = Math.max(1, opts.page ?? 1);
    const start = (page - 1) * pageSize;
    filtered = filtered.slice(start, start + pageSize);
  }

  return { items: filtered, total };
}

async function readSpots(source: ContentSource): Promise<Spot[]> {
  if (source === "supabase") {
    try {
      return await fetchSupabaseSpots();
    } catch (error) {
      console.warn("[SoulRide] Supabase spots are unavailable. Using the bundled catalog.", error);
    }
  }
  return staticContentSpots();
}

async function readRoutes(source: ContentSource): Promise<Route[]> {
  if (source === "supabase") {
    try {
      return await fetchSupabaseRoutes();
    } catch (error) {
      console.warn("[SoulRide] Supabase routes are unavailable. Using the bundled catalog.", error);
    }
  }
  return staticContentRoutes();
}

export async function loadSpots(source: ContentSource, opts?: SpotQuery): Promise<SpotPage> {
  return querySpots(await readSpots(source), opts);
}

export async function loadSpot(source: ContentSource, slug: string): Promise<Spot | null> {
  const spots = await readSpots(source);
  return spots.find((spot) => spot.slug === slug) ?? null;
}

export async function loadRoutes(source: ContentSource): Promise<Route[]> {
  return readRoutes(source);
}

export async function loadRoute(source: ContentSource, slug: string): Promise<Route | null> {
  const routes = await readRoutes(source);
  return routes.find((route) => route.slug === slug) ?? null;
}

export async function loadCredits(source: ContentSource): Promise<CreditGroup[]> {
  const [spots, routes] = await Promise.all([readSpots(source), readRoutes(source)]);
  const spotGroups: CreditGroup[] = spots.map((spot) => ({
    kind: "spot",
    slug: spot.slug,
    t: { en: { title: spot.t.en.title }, mk: { title: spot.t.mk.title } },
    photos: spot.photos,
  }));
  if (source === "static") {
    for (const extra of unlistedSpotPhotos(new Set(spots.map((spot) => spot.slug)))) {
      spotGroups.push({
        kind: "spot",
        slug: extra.slug,
        t: { en: { title: extra.title }, mk: { title: extra.title } },
        photos: extra.photos,
      });
    }
  }
  const routeGroups: CreditGroup[] = routes.map((route) => ({
    kind: "route",
    slug: route.slug,
    t: { en: { title: route.t.en.title }, mk: { title: route.t.mk.title } },
    photos: route.photos.length > 0 ? route.photos : route.cover ? [route.cover] : [],
  }));
  return [...spotGroups, ...routeGroups];
}

export function getSpots(opts?: SpotQuery): Promise<SpotPage> {
  return loadSpots(resolveContentSource(), opts);
}

export function getSpot(slug: string): Promise<Spot | null> {
  return loadSpot(resolveContentSource(), slug);
}

export function getRoutes(): Promise<Route[]> {
  return loadRoutes(resolveContentSource());
}

export function getRoute(slug: string): Promise<Route | null> {
  return loadRoute(resolveContentSource(), slug);
}

export function getCredits(): Promise<CreditGroup[]> {
  return loadCredits(resolveContentSource());
}
