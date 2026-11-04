import type {
  Difficulty,
  ExternalCredit,
  Lang,
  Photo,
  Region,
  Route,
  RouteDetails,
  Spot,
  SpotRegion,
} from "./types";

/**
 * Row shapes for Dev Backend's planned Free-tier schema
 * (`spots`, `routes`, `route_spots`, `photos`, `spot_photos`).
 * Files stay on the static host. These rows are metadata only.
 * No image transforms.
 */

export interface PhotoRow {
  id: string;
  key: string;
  width: number;
  height: number;
  alt_mk: string;
  alt_en: string | null;
  is_own: boolean;
  author: string;
  license: string;
  license_url: string | null;
  source_url: string | null;
  modified: boolean;
  focal_x: number | null;
  focal_y: number | null;
  placeholder_color: string | null;
  lqip: string | null;
}

export interface SpotPhotoJoin {
  position: number;
  photos: PhotoRow | PhotoRow[] | null;
}

export interface SpotRow {
  id: string;
  slug: string;
  region: string;
  tags: string[] | null;
  lat: number;
  lng: number;
  name_mk: string | null;
  name_en: string | null;
  description_mk: string | null;
  description_en: string | null;
  long_description_mk: string | null;
  long_description_en: string | null;
  tagline_mk: string | null;
  tagline_en: string | null;
  rider_tips_mk: string[] | null;
  rider_tips_en: string[] | null;
  status?: string;
  sort_order?: number;
  spot_photos?: SpotPhotoJoin[] | null;
}

export interface RouteSpotJoin {
  position: number;
  things_to_do_mk: string | null;
  things_to_do_en: string | null;
  spots: { slug: string } | { slug: string }[] | null;
}

export interface EatAndRestRow {
  name?: string;
  description_mk?: string;
  description_en?: string;
}

export interface RouteRow {
  id: string;
  slug: string;
  region: string;
  difficulty: string;
  distance_km: number | string | null;
  name_mk: string | null;
  name_en: string | null;
  description_mk: string | null;
  description_en: string | null;
  long_description_mk: string | null;
  long_description_en: string | null;
  tagline_mk: string | null;
  tagline_en: string | null;
  duration_mk: string | null;
  duration_en: string | null;
  highlights_mk: string[] | null;
  highlights_en: string[] | null;
  activities_mk: string[] | null;
  activities_en: string[] | null;
  rider_tips_mk: string[] | null;
  rider_tips_en: string[] | null;
  eat_and_rest: EatAndRestRow[] | null;
  details_mk: RouteDetails | null;
  details_en: RouteDetails | null;
  status?: string;
  sort_order?: number;
  cover?: PhotoRow | PhotoRow[] | null;
  route_spots?: RouteSpotJoin[] | null;
}

const SPOT_REGIONS = new Set<SpotRegion>(["West", "Central", "East"]);
const ROUTE_REGIONS = new Set<Region>(["West", "Central", "East", "Multi-Region"]);
const DIFFICULTIES = new Set<Difficulty>(["Easy", "Moderate", "Challenging"]);

function text(value: string | null | undefined): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

/** EN falls back to MK as a whole value. MK falls back to EN the same way. */
function pair(en: string | null | undefined, mk: string | null | undefined): Record<Lang, string> {
  const english = text(en) ?? text(mk) ?? "";
  const macedonian = text(mk) ?? text(en) ?? "";
  return { en: english, mk: macedonian };
}

function pairList(en: string[] | null | undefined, mk: string[] | null | undefined): Record<Lang, string[]> {
  const english = en && en.length > 0 ? en : mk ?? [];
  const macedonian = mk && mk.length > 0 ? mk : en ?? [];
  return { en: english, mk: macedonian };
}

function one<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

function asNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
}

function clampFocal(value: number | null | undefined): number {
  const n = typeof value === "number" && Number.isFinite(value) ? value : 0.5;
  return Math.min(1, Math.max(0, n));
}

export function isDisallowedLicense(license: string): boolean {
  return /NC|ND/i.test(license);
}

export function mapPhotoRow(row: PhotoRow): Photo | null {
  if (!row.is_own && isDisallowedLicense(row.license)) {
    console.warn(`[SoulRide] Skipping photo ${row.key}: licence "${row.license}" is not allowed.`);
    return null;
  }

  const altMk = text(row.alt_mk);
  const altEn = text(row.alt_en) ?? altMk ?? "";
  const credit: Photo["credit"] = row.is_own
    ? { own: true, author: row.author }
    : ({
        author: row.author,
        license: row.license,
        licenseUrl: row.license_url ?? "",
        sourceUrl: row.source_url ?? "",
        modified: Boolean(row.modified),
      } satisfies ExternalCredit);

  return {
    id: row.id,
    key: row.key,
    width: row.width,
    height: row.height,
    alt: {
      en: altEn,
      // TODO(alt_mk): surface `alt_mk` once bilingual alts are reviewed.
      mk: altMk,
    },
    focal: { x: clampFocal(row.focal_x), y: clampFocal(row.focal_y) },
    lqip: text(row.lqip),
    dominantColor: text(row.placeholder_color),
    credit,
  };
}

export function mapSpotRow(row: SpotRow): Spot | null {
  if (!SPOT_REGIONS.has(row.region as SpotRegion)) {
    console.warn(`[SoulRide] Skipping spot ${row.slug}: region "${row.region}" is not a spot region.`);
    return null;
  }

  const title = pair(row.name_en, row.name_mk);
  const description = pair(row.description_en, row.description_mk);
  const longDescription = pair(row.long_description_en, row.long_description_mk);
  const tagline = pair(row.tagline_en, row.tagline_mk);
  const riderTips = pairList(row.rider_tips_en, row.rider_tips_mk);
  const photos = (row.spot_photos ?? [])
    .slice()
    .sort((a, b) => a.position - b.position)
    .flatMap((join) => {
      const photo = one(join.photos);
      if (!photo) return [];
      const mapped = mapPhotoRow(photo);
      return mapped ? [mapped] : [];
    });

  return {
    id: row.id,
    slug: row.slug,
    region: row.region as SpotRegion,
    tags: row.tags ?? [],
    lat: row.lat,
    lng: row.lng,
    photos,
    t: {
      en: {
        title: title.en,
        description: description.en,
        longDescription: longDescription.en,
        tagline: tagline.en,
        riderTips: riderTips.en,
      },
      mk: {
        title: title.mk,
        description: description.mk,
        longDescription: longDescription.mk,
        tagline: tagline.mk,
        riderTips: riderTips.mk,
      },
    },
  };
}

function mapDetails(row: RouteRow): Record<Lang, RouteDetails> {
  const en = row.details_en ?? {};
  const mk = row.details_mk ?? {};
  const fill = (primary: RouteDetails, fallback: RouteDetails): RouteDetails => ({
    elevation: text(primary.elevation) ?? text(fallback.elevation),
    roadCondition: text(primary.roadCondition) ?? text(fallback.roadCondition),
    bestSeason: text(primary.bestSeason) ?? text(fallback.bestSeason),
    fuelStops: text(primary.fuelStops) ?? text(fallback.fuelStops),
  });
  return { en: fill(en, mk), mk: fill(mk, en) };
}

export function mapRouteRow(row: RouteRow): Route | null {
  if (!ROUTE_REGIONS.has(row.region as Region)) {
    console.warn(`[SoulRide] Skipping route ${row.slug}: region "${row.region}" is unknown.`);
    return null;
  }
  if (!DIFFICULTIES.has(row.difficulty as Difficulty)) {
    console.warn(`[SoulRide] Skipping route ${row.slug}: difficulty "${row.difficulty}" is unknown.`);
    return null;
  }

  const title = pair(row.name_en, row.name_mk);
  const description = pair(row.description_en, row.description_mk);
  const longDescription = pair(row.long_description_en, row.long_description_mk);
  const tagline = pair(row.tagline_en, row.tagline_mk);
  const duration = pair(row.duration_en, row.duration_mk);
  const highlights = pairList(row.highlights_en, row.highlights_mk);
  const activities = pairList(row.activities_en, row.activities_mk);
  const riderTips = pairList(row.rider_tips_en, row.rider_tips_mk);
  const meals = Array.isArray(row.eat_and_rest) ? row.eat_and_rest : [];
  const cover = one(row.cover);
  const mappedCover = cover ? mapPhotoRow(cover) : null;

  const stops = (row.route_spots ?? [])
    .slice()
    .sort((a, b) => a.position - b.position)
    .flatMap((join) => {
      const spot = one(join.spots);
      if (!spot?.slug) return [];
      const things = pair(join.things_to_do_en, join.things_to_do_mk);
      return [{ spotSlug: spot.slug, position: join.position, thingsToDo: things }];
    });

  return {
    id: row.id,
    slug: row.slug,
    region: row.region as Region,
    difficulty: row.difficulty as Difficulty,
    distanceKm: asNumber(row.distance_km),
    cover: mappedCover ?? undefined,
    stops,
    t: {
      en: {
        title: title.en,
        description: description.en,
        longDescription: longDescription.en,
        tagline: tagline.en,
        durationText: duration.en,
        highlights: highlights.en,
        activities: activities.en,
        riderTips: riderTips.en,
        eatAndRest: meals.map((meal) => ({
          name: meal.name ?? "",
          description: text(meal.description_en) ?? text(meal.description_mk) ?? "",
        })),
      },
      mk: {
        title: title.mk,
        description: description.mk,
        longDescription: longDescription.mk,
        tagline: tagline.mk,
        durationText: duration.mk,
        highlights: highlights.mk,
        activities: activities.mk,
        riderTips: riderTips.mk,
        eatAndRest: meals.map((meal) => ({
          name: meal.name ?? "",
          description: text(meal.description_mk) ?? text(meal.description_en) ?? "",
        })),
      },
    },
    details: mapDetails(row),
  };
}
