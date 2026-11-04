export const NAME_MIN = 3;
export const NAME_MAX = 60;
export const STORY_MIN = 40;
export const STORY_MAX = 500;
export const PHOTO_MIN = 1;
export const PHOTO_MAX = 5;
export const PHOTO_UPLOAD_MAX_BYTES = 15 * 1024 * 1024;
export const PHOTO_STORED_MAX_BYTES = 2 * 1024 * 1024;

export type GemCategory = "nature" | "food" | "culture" | "road";

const PHONE = /(?:\+?\d[\s-]?){8,}/;
const LINK = /(?:https?:\/\/|www\.)\S+/i;

export function nameError(name: string): "required" | null {
  const length = name.trim().length;
  if (length < NAME_MIN || length > NAME_MAX) return "required";
  return null;
}

export function storyError(story: string): "length" | "banned" | null {
  const text = story.trim();
  if (PHONE.test(text) || LINK.test(text)) return "banned";
  if (text.length < STORY_MIN || text.length > STORY_MAX) return "length";
  return null;
}

export function photoCountError(count: number): "min" | "max" | null {
  if (count < PHOTO_MIN) return "min";
  if (count > PHOTO_MAX) return "max";
  return null;
}

export function uploadTooLarge(bytes: number): boolean {
  return bytes > PHOTO_UPLOAD_MAX_BYTES;
}

export function formatMegabytes(bytes: number): string {
  const value = bytes / (1024 * 1024);
  return value.toFixed(1).replace(".", ",");
}
