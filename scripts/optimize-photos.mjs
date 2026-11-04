/**
 * Build self-hosted variants from content-src/photos/manifest.json (Designer v3.1).
 *
 * Phones: AVIF and WebP at 400 and 800.
 * Heroes (the large detail image): also AVIF and WebP at 1600.
 * One JPEG fallback, 800px, for browsers without AVIF/WebP.
 *
 * Reuses an existing 1600 JPEG as the master when the Commons file did not change.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const manifest = JSON.parse(readFileSync(path.join(root, "content-src/photos/manifest.json"), "utf8"));
const previousPath = process.env.PREVIOUS_CATALOG || path.join(root, "src/lib/content/photo-catalog.json");
const previous = JSON.parse(readFileSync(previousPath, "utf8"));
const UA = "SoulRidePhotoMirror/1.0 (educational travel guide; self-hosted CC copies)";
const CARD_BYTES = 80 * 1024;
const HERO_BYTES = 250 * 1024;

function https(url) {
  return String(url || "").replace(/^http:\/\//, "https://");
}

function focalPoint(text) {
  const value = (text || "").toLowerCase();
  let x = 0.5;
  let y = 0.5;
  if (value.includes("left")) x = 0.33;
  if (value.includes("right")) x = 0.67;
  if (value.includes("lower") || value.includes("bottom")) y = 0.7;
  if (value.includes("upper") || value.includes("top")) y = 0.33;
  return { x, y };
}

function hex(channel) {
  return Math.max(0, Math.min(255, Math.round(channel))).toString(16).padStart(2, "0");
}

async function download(title) {
  const url = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(title)}?width=1600`;
  let lastError;
  for (let attempt = 1; attempt <= 4; attempt += 1) {
    try {
      const response = await fetch(url, { headers: { "User-Agent": UA }, redirect: "follow" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const buffer = Buffer.from(await response.arrayBuffer());
      if (buffer.length < 2000) throw new Error(`file too small (${buffer.length})`);
      return buffer;
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, 400 * attempt));
    }
  }
  throw new Error(`Download failed for ${title}: ${lastError}`);
}

async function encode(input, width, format) {
  const limit = width <= 800 ? CARD_BYTES : HERO_BYTES;
  let quality = format === "avif" ? 45 : format === "webp" ? 62 : 68;
  let buffer;
  for (let attempt = 0; attempt < 12; attempt += 1) {
    let pipeline = sharp(input).resize({ width, withoutEnlargement: true });
    if (format === "avif") buffer = await pipeline.avif({ quality, effort: 4 }).toBuffer();
    else if (format === "webp") buffer = await pipeline.webp({ quality }).toBuffer();
    else buffer = await pipeline.jpeg({ quality, mozjpeg: true }).toBuffer();
    if (buffer.length <= limit || quality <= 8) break;
    quality -= 6;
  }
  return buffer;
}

const oldByTitle = new Map(previous.photos.map((photo) => [photo.commons_title, photo]));
const usedKeys = new Set();
const keyByTitle = new Map();

function allocate(photo) {
  if (keyByTitle.has(photo.title)) return keyByTitle.get(photo.title);
  const existing = oldByTitle.get(photo.title);
  if (existing && !usedKeys.has(existing.key)) {
    usedKeys.add(existing.key);
    keyByTitle.set(photo.title, existing.key);
    return existing.key;
  }
  const folder = photo.type === "route" ? "routes" : "spots";
  let n = 1;
  let key = "";
  do {
    key = `${folder}/${photo.id}/${String(n).padStart(2, "0")}`;
    n += 1;
  } while (usedKeys.has(key));
  usedKeys.add(key);
  keyByTitle.set(photo.title, key);
  return key;
}

const heroTitles = new Set(manifest.photos.filter((photo) => photo.role === "hero").map((photo) => photo.title));
// Keep the on-disk key for every file we already mirrored, before new titles take a slot.
for (const photo of manifest.photos) {
  if (keyByTitle.has(photo.title)) continue;
  const existing = oldByTitle.get(photo.title);
  if (!existing || usedKeys.has(existing.key)) continue;
  usedKeys.add(existing.key);
  keyByTitle.set(photo.title, existing.key);
}
for (const photo of manifest.photos) {
  if (!keyByTitle.has(photo.title)) allocate(photo);
}

function widthsFor(title) {
  // WebP only. 1600 is limited to heroes so the repo stays under 30 MB.
  return heroTitles.has(title) ? [800, 1600] : [800];
}

function variantPath(key, width, format) {
  return path.join(root, "public/img", `${key}-${width}.${format}`);
}

function formatsFor() {
  return ["webp"];
}

async function masterFor(title, key) {
  const reused = oldByTitle.get(title)?.key === key;
  const masterDir = process.env.MASTER_DIR;
  const candidates = reused
    ? [masterDir ? path.join(masterDir, `${key}-1600.jpg`) : "", variantPath(key, 1600, "jpg"), variantPath(key, 800, "jpg")].filter(Boolean)
    : [];
  for (const file of candidates) {
    if (existsSync(file) && statSync(file).size > 2000) return readFileSync(file);
  }
  console.error("download", title);
  const original = await download(title);
  return sharp(original).rotate().toColorspace("srgb").toBuffer();
}

const rendered = new Map();
const titles = [...keyByTitle.keys()];
for (const title of titles) {
  const key = keyByTitle.get(title);
  const reused = oldByTitle.get(title)?.key === key;
  if (!reused) {
    for (const width of [400, 800, 1600]) {
      for (const format of ["avif", "webp", "jpg"]) rmSync(variantPath(key, width, format), { force: true });
    }
  }
  const input = await sharp(await masterFor(title, key)).rotate().toColorspace("srgb").toBuffer();
  const meta = await sharp(input).metadata();
  const stats = await sharp(input).stats();
  const lqip = await sharp(input).resize(16).webp({ quality: 35 }).toBuffer();
  const widths = widthsFor(title).filter((width) => width <= (meta.width || width));
  const used = widths.length ? widths : [meta.width];
  for (const width of used) {
    for (const format of formatsFor()) {
      const file = variantPath(key, width, format);
      const limit = width <= 800 ? CARD_BYTES : HERO_BYTES;
      if (existsSync(file)) {
        const size = statSync(file).size;
        if (format === "jpg" || size <= limit) continue;
      }
      mkdirSync(path.dirname(file), { recursive: true });
      writeFileSync(file, await encode(input, width, format));
    }
  }
  rendered.set(title, {
    width: meta.width,
    height: meta.height,
    widths: used,
    dominantColor: `#${hex(stats.dominant.r)}${hex(stats.dominant.g)}${hex(stats.dominant.b)}`,
    lqip: `data:image/webp;base64,${lqip.toString("base64")}`,
  });
}

const keep = new Set();
for (const [title, key] of keyByTitle) {
  const file = rendered.get(title);
  for (const width of file.widths) {
    for (const format of formatsFor()) keep.add(variantPath(key, width, format));
  }
}

function walk(dir) {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) walk(full);
    else if (!keep.has(full)) rmSync(full);
  }
}
walk(path.join(root, "public/img"));

const catalogPhotos = manifest.photos.map((photo) => {
  const file = rendered.get(photo.title);
  if (!file) throw new Error(`Missing render for ${photo.title}`);
  return {
    type: photo.type,
    id: photo.id,
    role: photo.role,
    key: keyByTitle.get(photo.title),
    width: file.width,
    height: file.height,
    widths: file.widths,
    jpegWidths: [800],
    alt_mk: photo.alt_mk,
    alt_en: photo.alt_en,
    needs_native_check: Boolean(photo.needs_native_check),
    alt_note: photo.alt_note || "",
    replaces: photo.replaces || "",
    focal: focalPoint(photo.crop_focal),
    dominantColor: file.dominantColor,
    lqip: file.lqip,
    author: photo.author,
    licence: photo.licence,
    licence_url: https(photo.licence_url),
    source_url: https(photo.page_url),
    modified: true,
    commons_title: photo.title,
  };
});

const unique = new Set(manifest.photos.map((photo) => photo.title));
if (manifest.photos.length !== 193 || unique.size !== 172) {
  throw new Error(`Expected 193 entries and 172 unique files, got ${manifest.photos.length}/${unique.size}`);
}

const catalog = {
  source: "content-src/photos/manifest.json",
  generated: "2026-11-04",
  designerEntries: 193,
  designerUniqueFiles: 172,
  entries: catalogPhotos.length,
  uniqueFiles: unique.size,
  p07: "193 manifest rows = 172 unique spot files + 21 route rows that reuse those files. 172 is the photo count.",
  variants: "AVIF and WebP at 400 and 800. Heroes also get AVIF and WebP at 1600. JPEG fallback is 800 only.",
  photos: catalogPhotos,
};

writeFileSync(path.join(root, "src/lib/content/photo-catalog.json"), JSON.stringify(catalog));
const bytes = keep.size;
console.log(`catalog ${catalogPhotos.length} entries, ${unique.size} files, ${bytes} variant files`);
