import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { createElement, type ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { spots } from "@/data/spots";
import { routes } from "@/data/routes";
import { getCredits, getRoute, getRoutes, getSpot, getSpots, loadRoutes, loadSpots } from "@/lib/content/api";
import { useUiRoute, useUiRoutes, useUiSpot, useUiSpots } from "@/lib/content/hooks";
import { toUiRoute, toUiSpot } from "@/lib/content/present";
import { resolveContentSource } from "@/lib/content/source";
import { fetchSupabaseRoutes, fetchSupabaseSpots } from "@/lib/content/supabase";
import { mapPhotoRow, mapRouteRow, mapSpotRow, type PhotoRow, type RouteRow, type SpotRow } from "@/lib/content/supabase-map";

vi.mock("@/lib/content/supabase", () => ({
  fetchSupabaseSpots: vi.fn(),
  fetchSupabaseRoutes: vi.fn(),
}));

function photo(overrides: Partial<PhotoRow> = {}): PhotoRow {
  return {
    id: "photo-1",
    key: "spots/galicica-pass/01",
    width: 1600,
    height: 1200,
    alt_mk: "Поглед од Галичица",
    alt_en: "View from Galicica Pass",
    is_own: false,
    author: "Nik",
    license: "CC BY-SA 4.0",
    license_url: "https://creativecommons.org/licenses/by-sa/4.0",
    source_url: "https://commons.wikimedia.org/wiki/File:Example.jpg",
    modified: false,
    focal_x: 0.2,
    focal_y: 0.4,
    placeholder_color: "#123456",
    lqip: "data:image/webp;base64,aaaa",
    ...overrides,
  };
}

function spotRow(overrides: Partial<SpotRow> = {}): SpotRow {
  return {
    id: "uuid-1",
    slug: "galicica-pass",
    region: "West",
    tags: ["Views"],
    lat: 40.95,
    lng: 20.8,
    name_mk: "Галичица",
    name_en: "Galicica Pass",
    description_mk: null,
    description_en: "A high pass",
    long_description_mk: null,
    long_description_en: "Long text",
    tagline_mk: null,
    tagline_en: "Where the road meets the heavens",
    rider_tips_mk: [],
    rider_tips_en: ["Dawn rides"],
    spot_photos: [{ position: 1, photos: photo() }, { position: 0, photos: photo({ id: "photo-0", key: "spots/galicica-pass/00" }) }],
    ...overrides,
  };
}

function wrapper({ children }: { children: ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return createElement(QueryClientProvider, { client }, children);
}

describe("content source", () => {
  it("stays on the bundled catalog unless the flag and both public vars are set", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(resolveContentSource({})).toBe("static");
    expect(resolveContentSource({ source: "static", supabaseUrl: "https://db.supabase.co", supabaseKey: "anon" })).toBe(
      "static",
    );
    expect(resolveContentSource({ source: "supabase", supabaseUrl: "  ", supabaseKey: "anon" })).toBe("static");
    expect(resolveContentSource({ source: " Supabase ", supabaseUrl: "https://db.supabase.co", supabaseKey: "anon" })).toBe(
      "supabase",
    );
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });
});

describe("static catalog", () => {
  it("keeps the bundled copy and serves local photos instead of hotlinks", async () => {
    const page = await getSpots();
    expect(page.total).toBe(spots.length);
    expect(page.items).toHaveLength(spots.length);
    page.items.forEach((item, index) => {
      const ui = toUiSpot(item);
      expect(ui.title).toBe(spots[index].title);
      expect(ui.id).toBe(spots[index].id);
      expect(ui.description).toBe(spots[index].description);
      expect(ui.coordinates).toEqual(spots[index].coordinates);
      expect(ui.photos.length).toBeGreaterThan(0);
      expect(ui.images.every((src) => src.includes("/img/") && !src.startsWith("http"))).toBe(true);
      expect(ui.photos.every((photo) => !photo.legacySrc)).toBe(true);
      expect(ui.photos[0].alt.mk.trim().length).toBeGreaterThan(0);
    });

    const loadedRoutes = await getRoutes();
    expect(loadedRoutes).toHaveLength(routes.length);
    loadedRoutes.forEach((item, index) => {
      const ui = toUiRoute(item);
      expect(ui.title).toBe(routes[index].title);
      expect(ui.spotIds).toEqual(routes[index].spotIds);
      expect(ui.mainImage.includes("/img/")).toBe(true);
      expect(ui.mainImage.startsWith("http")).toBe(false);
      expect(ui.photos.length).toBeGreaterThan(0);
    });
  });

  it("filters and pages without dropping the total", async () => {
    const west = spots.filter((spot) => spot.region === "West");
    const page = await getSpots({ region: "West", tags: ["Views"], page: 1, pageSize: 2 });
    const expected = west.filter((spot) => spot.tags.includes("Views"));
    expect(page.total).toBe(expected.length);
    expect(page.items.map((spot) => spot.slug)).toEqual(expected.slice(0, 2).map((spot) => spot.id));
  });

  it("finds one record and misses an unknown slug", async () => {
    const spot = await getSpot("galicica-pass");
    expect(spot?.t.en.title).toBe("Galicica Pass");
    expect(await getSpot("not-a-spot")).toBeNull();

    const route = await getRoute("eastern-waterfalls-loop");
    expect(route?.stops.map((stop) => stop.spotSlug)).toEqual([
      "kolesino-waterfall",
      "smolare-waterfall",
      "vodoca-monastery",
    ]);
    expect(await getRoute("not-a-route")).toBeNull();
  });

  it("lists a credit group for every spot and route", async () => {
    const credits = await getCredits();
    expect(credits.filter((group) => group.kind === "spot").length).toBeGreaterThanOrEqual(spots.length);
    expect(credits.filter((group) => group.kind === "route")).toHaveLength(routes.length);
    expect(credits.every((group) => group.photos.length > 0)).toBe(true);
  });

  it("does not query Supabase while the flag is off", async () => {
    vi.mocked(fetchSupabaseSpots).mockClear();
    vi.mocked(fetchSupabaseRoutes).mockClear();
    await getSpots();
    await getRoutes();
    expect(fetchSupabaseSpots).not.toHaveBeenCalled();
    expect(fetchSupabaseRoutes).not.toHaveBeenCalled();
  });
});

describe("supabase mapping", () => {
  beforeEach(() => {
    vi.mocked(fetchSupabaseSpots).mockReset();
    vi.mocked(fetchSupabaseRoutes).mockReset();
  });

  it("maps bilingual columns, photo order and focal metadata", () => {
    const spot = mapSpotRow(spotRow());
    expect(spot?.t.en.title).toBe("Galicica Pass");
    expect(spot?.t.mk.title).toBe("Галичица");
    expect(spot?.t.en.description).toBe("A high pass");
    expect(spot?.t.mk.description).toBe("A high pass");
    expect(spot?.photos.map((item) => item.key)).toEqual(["spots/galicica-pass/00", "spots/galicica-pass/01"]);
    expect(spot?.photos[1]).toMatchObject({
      focal: { x: 0.2, y: 0.4 },
      dominantColor: "#123456",
      alt: { en: "View from Galicica Pass", mk: "Поглед од Галичица" },
      credit: { author: "Nik", license: "CC BY-SA 4.0", modified: false },
    });
    expect(toUiSpot(spot!).images[0]).toContain("spots/galicica-pass/00-800.webp");
  });

  it("falls back to Macedonian when the English column is empty", () => {
    const spot = mapSpotRow(spotRow({ name_en: null, description_en: "   ", rider_tips_en: [], rider_tips_mk: ["Совет"] }));
    expect(spot?.t.en.title).toBe("Галичица");
    expect(spot?.t.en.riderTips).toEqual(["Совет"]);
  });

  it("drops NC/ND photos and spots with a route-only region", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(mapPhotoRow(photo({ license: "CC BY-NC 4.0" }))).toBeNull();
    expect(mapPhotoRow(photo({ license: "CC BY-ND 4.0" }))).toBeNull();
    expect(mapSpotRow(spotRow({ region: "Multi-Region" }))).toBeNull();
    const own = mapPhotoRow(photo({ is_own: true, license: "own", license_url: null, source_url: null }));
    expect(own?.credit).toEqual({ own: true, author: "Nik" });
    warn.mockRestore();
  });

  it("maps a route cover, stop order and distance", () => {
    const row: RouteRow = {
      id: "uuid-r",
      slug: "eastern-waterfalls-loop",
      region: "East",
      difficulty: "Moderate",
      distance_km: "85.0",
      name_mk: null,
      name_en: "Eastern Waterfalls Loop",
      description_mk: null,
      description_en: "Waterfalls",
      long_description_mk: null,
      long_description_en: "Long",
      tagline_mk: null,
      tagline_en: "Waters fall",
      duration_mk: null,
      duration_en: "4-5 hours",
      highlights_mk: null,
      highlights_en: ["Two waterfalls"],
      activities_mk: null,
      activities_en: ["Hike"],
      rider_tips_mk: null,
      rider_tips_en: ["Gravel"],
      eat_and_rest: [{ name: "Cafe", description_en: "Coffee", description_mk: "Кафе" }],
      details_mk: {},
      details_en: { elevation: "400m", roadCondition: "Asphalt", bestSeason: "April", fuelStops: "Strumica" },
      cover: photo({ id: "cover", key: "routes/eastern-waterfalls-loop/01" }),
      route_spots: [
        { position: 1, things_to_do_en: "Second", things_to_do_mk: null, spots: { slug: "smolare-waterfall" } },
        { position: 0, things_to_do_en: "First", things_to_do_mk: null, spots: { slug: "kolesino-waterfall" } },
      ],
    };
    const route = mapRouteRow(row);
    expect(route?.stops.map((stop) => stop.spotSlug)).toEqual(["kolesino-waterfall", "smolare-waterfall"]);
    expect(route?.distanceKm).toBe(85);
    expect(route?.t.mk.eatAndRest[0].description).toBe("Кафе");
    expect(toUiRoute(route!).distance).toBe("~85 km");
    expect(toUiRoute(route!).mainImage).toContain("routes/eastern-waterfalls-loop/01-800.webp");
    expect(toUiRoute(route!).thingsToDo["kolesino-waterfall"]).toBe("First");
  });

  it("uses Supabase rows when that source is selected and the bundled catalog when it fails", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const mapped = mapSpotRow(spotRow({ slug: "remote-spot", name_en: "Remote" }));
    vi.mocked(fetchSupabaseSpots).mockResolvedValue([mapped!]);
    const remote = await loadSpots("supabase");
    expect(remote.items.map((spot) => spot.slug)).toEqual(["remote-spot"]);

    vi.mocked(fetchSupabaseSpots).mockRejectedValue(new Error("paused"));
    const fallback = await loadSpots("supabase");
    expect(fallback.total).toBe(spots.length);
    expect(warn).toHaveBeenCalled();

    vi.mocked(fetchSupabaseRoutes).mockRejectedValue(new Error("paused"));
    const routeFallback = await loadRoutes("supabase");
    expect(routeFallback).toHaveLength(routes.length);
    warn.mockRestore();
  });
});

describe("content hooks", () => {
  it("renders the bundled spots on the first pass", () => {
    const { result } = renderHook(() => useUiSpots(), { wrapper });
    expect(result.current).toHaveLength(spots.length);
    expect(result.current[0].id).toBe(spots[0].id);
    expect(result.current[0].title).toBe(spots[0].title);
    expect(result.current[0].photos.length).toBeGreaterThan(0);
    expect(result.current.map((spot) => spot.id)).toEqual(spots.map((spot) => spot.id));
  });

  it("resolves a spot and a route without waiting", () => {
    const spot = renderHook(() => useUiSpot("galicica-pass"), { wrapper });
    expect(spot.result.current?.id).toBe("galicica-pass");
    expect(spot.result.current?.title).toBe("Galicica Pass");

    const missing = renderHook(() => useUiSpot("not-a-spot"), { wrapper });
    expect(missing.result.current).toBeUndefined();

    const route = renderHook(() => useUiRoute("eastern-waterfalls-loop"), { wrapper });
    expect(route.result.current?.id).toBe(routes[0].id);
    expect(route.result.current?.mainImage.startsWith("http")).toBe(false);

    const list = renderHook(() => useUiRoutes(), { wrapper });
    expect(list.result.current.map((item) => item.id)).toEqual(routes.map((item) => item.id));
  });
});

describe("ui imports", () => {
  it("keeps pages and components off src/data", () => {
    const root = path.resolve("src");
    const files: string[] = [];
    const walk = (dir: string) => {
      for (const entry of readdirSync(dir)) {
        const full = path.join(dir, entry);
        if (statSync(full).isDirectory()) walk(full);
        else if (/\.(ts|tsx)$/.test(entry)) files.push(full);
      }
    };
    walk(path.join(root, "components"));
    walk(path.join(root, "pages"));

    const offenders = files.filter((file) => {
      const source = readFileSync(file, "utf8");
      return /@\/data\/|from ["'][^"']*\/data\/(spots|routes|journeyData)/.test(source);
    });
    expect(offenders).toEqual([]);
  });
});
