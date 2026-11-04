import type { GemCategory } from "./validate";

export type Season = "spring" | "summer" | "autumn" | "winter";

/** Device-only draft. Never sent to a server. Photos live in IndexedDB, not localStorage. */
export interface GemDraftPhoto {
  name: string;
  type: string;
  bytes: number;
  width: number;
  height: number;
  blob: Blob;
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

const TEXT_KEY = "soulride.gem-draft";
const DB_NAME = "soulride-gem";
const STORE = "draft-photos";

export class DraftSaveError extends Error {
  constructor() {
    super("draft-save-failed");
  }
}

type DraftText = Omit<GemDraft, "photos">;

function textOf(draft: GemDraft): DraftText {
  const { photos: _photos, ...text } = draft;
  return text;
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("no-idb"));
      return;
    }
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE)) request.result.createObjectStore(STORE);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function writePhotos(photos: GemDraftPhoto[]): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(photos, "current");
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
}

async function readPhotos(): Promise<GemDraftPhoto[]> {
  const db = await openDb();
  const photos = await new Promise<GemDraftPhoto[]>((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const request = tx.objectStore(STORE).get("current");
    request.onsuccess = () => resolve(Array.isArray(request.result) ? request.result : []);
    request.onerror = () => reject(request.error);
  });
  db.close();
  return photos;
}

async function deletePhotos(): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).delete("current");
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
}

/** Returns "saved" when photos land in IndexedDB, or "text-only" when only the text could be kept. */
export async function saveGemDraft(draft: GemDraft): Promise<"saved" | "text-only"> {
  try {
    localStorage.setItem(TEXT_KEY, JSON.stringify(textOf(draft)));
  } catch {
    throw new DraftSaveError();
  }
  try {
    await writePhotos(draft.photos);
    return "saved";
  } catch {
    return "text-only";
  }
}

export async function loadGemDraft(): Promise<GemDraft | null> {
  try {
    const raw = localStorage.getItem(TEXT_KEY);
    if (!raw) return null;
    const text = JSON.parse(raw) as DraftText;
    if (!text || typeof text.savedAt !== "string") return null;
    let photos: GemDraftPhoto[] = [];
    try {
      photos = await readPhotos();
    } catch {
      photos = [];
    }
    return { ...text, photos };
  } catch {
    return null;
  }
}

export async function clearGemDraft(): Promise<void> {
  try {
    localStorage.removeItem(TEXT_KEY);
  } catch {
    /* ignore */
  }
  try {
    await deletePhotos();
  } catch {
    /* ignore */
  }
}

export function previewHarnessEnabled(dev: boolean, state: string | null): boolean {
  return dev && Boolean(state) && state !== "signin";
}
