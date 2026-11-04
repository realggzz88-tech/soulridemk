import raw from "./photo-catalog.json";
import type { Photo } from "./types";

export interface CatalogFile {
  source: string;
  generated: string;
  designerEntries: number;
  designerUniqueFiles: number;
  entries: number;
  uniqueFiles: number;
  p07: string;
  photos: CatalogPhoto[];
}

export interface CatalogPhoto {
  type: "spot" | "route";
  id: string;
  role: string;
  key: string;
  width: number;
  height: number;
  widths: number[];
  replaces?: string;
  alt_mk: string;
  alt_en: string;
  needs_native_check: boolean;
  alt_note?: string;
  fix?: string;
  focal: { x: number; y: number };
  dominantColor?: string;
  lqip?: string;
  author: string;
  licence: string;
  licence_url: string;
  source_url: string;
  modified: boolean;
  commons_title?: string;
}

export const photoCatalog = raw as CatalogFile;

export function toCatalogPhoto(row: CatalogPhoto): Photo {
  return {
    id: row.key,
    key: row.key,
    width: row.width,
    height: row.height,
    widths: row.widths,
    replaces: row.replaces || undefined,
    alt: { mk: row.alt_mk, en: row.alt_en },
    needsNativeCheck: Boolean(row.needs_native_check),
    altNote: row.alt_note || undefined,
    fix: row.fix || undefined,
    focal: row.focal ?? { x: 0.5, y: 0.5 },
    lqip: row.lqip,
    dominantColor: row.dominantColor,
    credit: {
      author: row.author,
      license: row.licence,
      licenseUrl: row.licence_url,
      sourceUrl: row.source_url,
      modified: Boolean(row.modified),
    },
  };
}

export function catalogPhotos(type: "spot" | "route", id: string): Photo[] {
  return photoCatalog.photos.filter((photo) => photo.type === type && photo.id === id).map(toCatalogPhoto);
}

const EXTRA_TITLES: Record<string, string> = {
  "vodoca-monastery": "Vodoča Monastery",
};

/** Catalog spots that are not in the published spot list still need a credit. */
export function unlistedSpotPhotos(knownSlugs: Set<string>): { slug: string; title: string; photos: Photo[] }[] {
  const ids = [...new Set(photoCatalog.photos.filter((photo) => photo.type === "spot").map((photo) => photo.id))];
  return ids
    .filter((id) => !knownSlugs.has(id))
    .map((id) => ({
      slug: id,
      title: EXTRA_TITLES[id] ?? id,
      photos: catalogPhotos("spot", id),
    }));
}
