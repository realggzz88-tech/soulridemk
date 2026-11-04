import type { GemCategory } from "./validate";

export type Season = "spring" | "summer" | "autumn" | "winter";

/** Device-only draft. Never sent to a server. */
export interface GemDraftPhoto {
  name: string;
  type: string;
  bytes: number;
  width: number;
  height: number;
  dataUrl: string;
}

export interface GemDraft {
  savedAt: string;
  lat: number;
  lng: number;
  name: string;
  category: GemCategory | null;
  subcategories: string[];
  altMk: string;
  altEn: string;
  story: string;
  storyLang: "mk" | "en";
  seasons: Season[];
  own: boolean;
  licence: boolean;
  privacy: boolean;
  photos: GemDraftPhoto[];
}

const KEY = "soulride.gem-draft";

export async function saveGemDraft(draft: GemDraft, write: (value: string) => void = (value) => localStorage.setItem(KEY, value)): Promise<void> {
  write(JSON.stringify(draft));
}

export async function loadGemDraft(read: () => string | null = () => localStorage.getItem(KEY)): Promise<GemDraft | null> {
  try {
    const raw = read();
    if (!raw) return null;
    const parsed = JSON.parse(raw) as GemDraft;
    if (!parsed || typeof parsed.savedAt !== "string") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}
