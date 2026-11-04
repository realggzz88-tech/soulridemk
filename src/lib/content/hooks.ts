import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCredits, getRoute, getRoutes, getSpot, getSpots } from "./api";
import { unlistedSpotPhotos } from "./catalog";
import { toUiRoute, toUiSpot, type RouteWithPhotos, type SpotWithPhotos } from "./present";
import { CONTENT_STALE_TIME_MS, resolveContentSource } from "./source";
import { staticContentRoutes, staticContentSpots } from "./static";
import type { CreditGroup, SpotQuery } from "./types";

const FRESH_AT = Date.now();

function staticSpotPage(opts?: SpotQuery) {
  // Imported lazily through getSpots would refetch the source. The cached
  // static list is synchronous, so the first paint matches the old import.
  return opts ? undefined : { items: staticContentSpots(), total: staticContentSpots().length };
}

export function useSpots(opts?: SpotQuery) {
  const source = resolveContentSource();
  return useQuery({
    queryKey: ["content", "spots", source, opts ?? null],
    queryFn: () => getSpots(opts),
    staleTime: CONTENT_STALE_TIME_MS,
    initialData: source === "static" ? staticSpotPage(opts) : undefined,
    initialDataUpdatedAt: source === "static" && !opts ? FRESH_AT : undefined,
    placeholderData: source === "supabase" && !opts ? staticSpotPage() : undefined,
  });
}

export function useSpot(slug: string | undefined) {
  const source = resolveContentSource();
  return useQuery({
    queryKey: ["content", "spot", source, slug ?? ""],
    queryFn: () => getSpot(slug ?? ""),
    enabled: Boolean(slug),
    staleTime: CONTENT_STALE_TIME_MS,
    initialData: source === "static" && slug ? staticContentSpots().find((spot) => spot.slug === slug) ?? null : undefined,
    initialDataUpdatedAt: source === "static" && slug ? FRESH_AT : undefined,
  });
}

export function useRoutes() {
  const source = resolveContentSource();
  const bundled = staticContentRoutes();
  return useQuery({
    queryKey: ["content", "routes", source],
    queryFn: () => getRoutes(),
    staleTime: CONTENT_STALE_TIME_MS,
    initialData: source === "static" ? bundled : undefined,
    initialDataUpdatedAt: source === "static" ? FRESH_AT : undefined,
    placeholderData: source === "supabase" ? bundled : undefined,
  });
}

export function useRoute(slug: string | undefined) {
  const source = resolveContentSource();
  return useQuery({
    queryKey: ["content", "route", source, slug ?? ""],
    queryFn: () => getRoute(slug ?? ""),
    enabled: Boolean(slug),
    staleTime: CONTENT_STALE_TIME_MS,
    initialData:
      source === "static" && slug ? staticContentRoutes().find((route) => route.slug === slug) ?? null : undefined,
    initialDataUpdatedAt: source === "static" && slug ? FRESH_AT : undefined,
  });
}

export function useCredits() {
  const source = resolveContentSource();
  return useQuery<CreditGroup[]>({
    queryKey: ["content", "credits", source],
    queryFn: () => getCredits(),
    staleTime: CONTENT_STALE_TIME_MS,
    initialData: source === "static" ? creditPreview() : undefined,
    initialDataUpdatedAt: source === "static" ? FRESH_AT : undefined,
  });
}

function creditPreview(): CreditGroup[] {
  const spots = staticContentSpots();
  return [
    ...spots.map((spot) => ({
      kind: "spot" as const,
      slug: spot.slug,
      t: { en: { title: spot.t.en.title }, mk: { title: spot.t.mk.title } },
      photos: spot.photos,
    })),
    ...unlistedSpotPhotos(new Set(spots.map((spot) => spot.slug))).map((extra) => ({
      kind: "spot" as const,
      slug: extra.slug,
      t: { en: { title: extra.title }, mk: { title: extra.title } },
      photos: extra.photos,
    })),
    ...staticContentRoutes().map((route) => ({
      kind: "route" as const,
      slug: route.slug,
      t: { en: { title: route.t.en.title }, mk: { title: route.t.mk.title } },
      photos: route.photos,
    })),
  ];
}

export function useUiSpots(): SpotWithPhotos[] {
  const query = useSpots();
  return useMemo(() => (query.data?.items ?? []).map(toUiSpot), [query.data]);
}

export function useUiSpot(slug: string | undefined): SpotWithPhotos | undefined {
  const query = useSpot(slug);
  return useMemo(() => (query.data ? toUiSpot(query.data) : undefined), [query.data]);
}

export function useUiRoutes(): RouteWithPhotos[] {
  const query = useRoutes();
  return useMemo(() => (query.data ?? []).map(toUiRoute), [query.data]);
}

export function useUiRoute(slug: string | undefined): RouteWithPhotos | undefined {
  const query = useRoute(slug);
  return useMemo(() => (query.data ? toUiRoute(query.data) : undefined), [query.data]);
}
