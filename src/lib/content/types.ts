/**
 * Frontend view of spots, routes and photos.
 * Mapped from `src/data` today and from Dev Backend's planned tables when
 * `VITE_CONTENT_SOURCE=supabase`.
 */

export type Lang = "mk" | "en";

export type Region = "West" | "Central" | "East" | "Multi-Region";

export type SpotRegion = Exclude<Region, "Multi-Region">;

export type Difficulty = "Easy" | "Moderate" | "Challenging";

/** Commons / Unsplash style credit. NC and ND licences are never stored. */
export interface ExternalCredit {
  author: string;
  license: string;
  licenseUrl: string;
  sourceUrl: string;
  modified: boolean;
}

export interface OwnCredit {
  own: true;
  author: string;
}

export interface Photo {
  id: string;
  /** Storage key without an extension, e.g. `spots/galicica-pass/01`. */
  key: string;
  width: number;
  height: number;
  /** WebP widths on disk. Every photo has 800. Heroes also have 1600. */
  widths: number[];
  /** Commons filename this row replaced, when Dev Designer swapped a bad file. */
  replaces?: string;
  /**
   * `mk` is the primary alt. `en` is the secondary alt.
   * `needsNativeCheck` marks copy that Dev Designer flagged for a native reader.
   */
  alt: { mk: string; en: string };
  needsNativeCheck: boolean;
  altNote?: string;
  /** Set for rows touched by the P-01..P-06 photo fixes. */
  fix?: string;
  /** Focal point in 0–1 space. Default is the centre. */
  focal: { x: number; y: number };
  lqip?: string;
  dominantColor?: string;
  /** Set only when a row still points at a remote file. Served photos leave this empty. */
  legacySrc?: string;
  credit?: ExternalCredit | OwnCredit;
}

export interface SpotText {
  title: string;
  description: string;
  longDescription: string;
  tagline: string;
  riderTips: string[];
}

export interface Spot {
  id: string;
  slug: string;
  region: SpotRegion;
  tags: string[];
  lat: number;
  lng: number;
  photos: Photo[];
  t: Record<Lang, SpotText>;
}

export interface RouteStop {
  spotSlug: string;
  position: number;
  thingsToDo: Record<Lang, string>;
}

export interface EatAndRest {
  name: string;
  description: string;
}

export interface RouteText {
  title: string;
  description: string;
  longDescription: string;
  tagline: string;
  durationText: string;
  highlights: string[];
  activities: string[];
  riderTips: string[];
  eatAndRest: EatAndRest[];
}

export interface RouteDetails {
  elevation?: string;
  roadCondition?: string;
  bestSeason?: string;
  fuelStops?: string;
}

export interface Route {
  id: string;
  slug: string;
  region: Region;
  difficulty: Difficulty;
  distanceKm?: number;
  cover?: Photo;
  /** Every route photo. `cover` is the hero, and it is also `photos[0]` when one exists. */
  photos: Photo[];
  stops: RouteStop[];
  t: Record<Lang, RouteText>;
  details: Record<Lang, RouteDetails>;
}

export interface SpotQuery {
  region?: SpotRegion;
  /** Match a spot that has any of these tags. */
  tags?: string[];
  page?: number;
  pageSize?: number;
}

export interface SpotPage {
  items: Spot[];
  total: number;
}

export interface CreditGroup {
  kind: "spot" | "route";
  slug: string;
  t: Record<Lang, { title: string }>;
  photos: Photo[];
}
