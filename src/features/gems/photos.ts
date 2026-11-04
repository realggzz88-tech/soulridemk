import { PHOTO_STORED_MAX_BYTES, PHOTO_UPLOAD_MAX_BYTES, uploadTooLarge } from "./validate";

export class PhotoTooLargeError extends Error {
  bytes: number;
  constructor(bytes: number) {
    super("photo-too-large");
    this.bytes = bytes;
  }
}

export interface CompressedPhoto {
  name: string;
  type: string;
  blob: Blob;
  bytes: number;
  width: number;
  height: number;
  previewUrl: string;
}

export function fittedEdge(width: number, height: number, maxEdge: number): { width: number; height: number } {
  const edge = Math.max(width, height);
  if (edge <= maxEdge) return { width, height };
  const scale = maxEdge / edge;
  return { width: Math.max(1, Math.round(width * scale)), height: Math.max(1, Math.round(height * scale)) };
}

async function encode(bitmap: ImageBitmap, maxEdge: number, quality: number): Promise<{ blob: Blob; width: number; height: number }> {
  const size = fittedEdge(bitmap.width, bitmap.height, maxEdge);
  const canvas = document.createElement("canvas");
  canvas.width = size.width;
  canvas.height = size.height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("canvas");
  context.drawImage(bitmap, 0, 0, size.width, size.height);
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", quality));
  const jpeg = blob && blob.size > 0 ? blob : await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
  if (!jpeg) throw new Error("encode");
  return { blob: jpeg, width: size.width, height: size.height };
}

/** Redraws the image so GPS EXIF is dropped, then shrinks until the file is at most 2 MB. */
export async function compressPhoto(file: File, onProgress?: (ratio: number) => void): Promise<CompressedPhoto> {
  if (uploadTooLarge(file.size)) throw new PhotoTooLargeError(file.size);
  if (file.size > PHOTO_UPLOAD_MAX_BYTES) throw new PhotoTooLargeError(file.size);
  const bitmap = await createImageBitmap(file);
  let edge = 2000;
  let quality = 0.82;
  let encoded = await encode(bitmap, edge, quality);
  onProgress?.(0.2);
  while (encoded.blob.size > PHOTO_STORED_MAX_BYTES && (quality > 0.42 || edge > 900)) {
    if (quality > 0.5) quality = Math.round((quality - 0.12) * 100) / 100;
    else edge = Math.round(edge * 0.8);
    encoded = await encode(bitmap, edge, quality);
    onProgress?.(Math.min(0.95, 1 - encoded.blob.size / Math.max(file.size, encoded.blob.size)));
  }
  bitmap.close?.();
  if (encoded.blob.size > PHOTO_STORED_MAX_BYTES) throw new Error("compress");
  onProgress?.(1);
  const type = encoded.blob.type || "image/webp";
  const base = file.name.replace(/\.[^.]+$/, "") || "photo";
  return {
    name: `${base}.${type === "image/jpeg" ? "jpg" : "webp"}`,
    type,
    blob: encoded.blob,
    bytes: encoded.blob.size,
    width: encoded.width,
    height: encoded.height,
    previewUrl: URL.createObjectURL(encoded.blob),
  };
}
