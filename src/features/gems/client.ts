import type { Season } from "./draft";
import type { GemCategory } from "./validate";
import { recordSend } from "./limits";

/**
 * User suggestion. Column names follow `public.spots` (name_*, description_*, lat, lng, tags).
 * TODO(backend): insert into the submissions table. This stub stores nothing remotely and uses no keys.
 * `status: "pending"` is the review state until that table exists.
 */
export interface GemPhotoMeta {
  name: string;
  type: string;
  bytes: number;
  width: number;
  height: number;
}

export interface GemSubmissionInput {
  name: string;
  category: GemCategory;
  subcategories: string[];
  altMk: string;
  altEn: string;
  seasons: Season[];
  story: string;
  storyLang: "mk" | "en";
  lat: number;
  lng: number;
  photos: GemPhotoMeta[];
  ownWork: true;
  licence: "non-exclusive";
  privacy: true;
}

export interface GemSubmission extends GemSubmissionInput {
  id: string;
  status: "pending";
  created_at: string;
  name_mk: string | null;
  name_en: string | null;
  description_mk: string | null;
  description_en: string | null;
  description_mk_status: "author" | "machine";
  description_en_status: "author" | "machine";
}

export interface GemSubmissionClient {
  submit(input: GemSubmissionInput): Promise<GemSubmission>;
}

export function toSubmission(input: GemSubmissionInput, now = new Date()): GemSubmission {
  const machine = input.storyLang === "mk" ? "en" : "mk";
  return {
    ...input,
    id: crypto.randomUUID(),
    status: "pending",
    created_at: now.toISOString(),
    name_mk: input.storyLang === "mk" ? input.name : null,
    name_en: input.storyLang === "en" ? input.name : null,
    description_mk: input.storyLang === "mk" ? input.story : null,
    description_en: input.storyLang === "en" ? input.story : null,
    description_mk_status: machine === "mk" ? "machine" : "author",
    description_en_status: machine === "en" ? "machine" : "author",
  };
}

export const mockGemClient: GemSubmissionClient = {
  async submit(input) {
    if (typeof navigator !== "undefined" && navigator.onLine === false) {
      throw new Error("offline");
    }
    const row = toSubmission(input);
    recordSend();
    return row;
  },
};
