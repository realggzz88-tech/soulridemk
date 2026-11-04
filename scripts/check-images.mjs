/**
 * Fails when a served photo is missing a file, a credit, or still hotlinked.
 * Map tiles are not photos and are ignored.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const catalog = JSON.parse(readFileSync(path.join(root, "src/lib/content/photo-catalog.json"), "utf8"));
const errors = [];
const CARD_BYTES = 80 * 1024;
const HERO_BYTES = 250 * 1024;
const BUDGET_BYTES = 30 * 1024 * 1024;

function fail(message) {
  errors.push(message);
}

if (!Array.isArray(catalog.photos) || catalog.photos.length === 0) {
  fail("photo catalog is empty");
}

const seenKeys = new Set();
for (const photo of catalog.photos ?? []) {
  if (!photo.alt_mk?.trim()) fail(`${photo.key} is missing alt_mk`);
  if (!photo.alt_en?.trim()) fail(`${photo.key} is missing alt_en`);
  if (typeof photo.needs_native_check !== "boolean") fail(`${photo.key} is missing needs_native_check`);
  if (!photo.author?.trim()) fail(`${photo.key} is missing an author`);
  if (!photo.licence?.trim() || !photo.licence_url?.trim() || !photo.source_url?.trim()) {
    fail(`${photo.key} is missing licence, licence URL, or source URL`);
  }
  if (/NC|ND/i.test(photo.licence || "")) fail(`${photo.key} uses a disallowed licence ${photo.licence}`);
  if (!photo.widths?.length) fail(`${photo.key} has no widths`);
  for (const field of ["lqip", "dominantColor"]) {
    const value = photo[field] || "";
    if (typeof value === "string" && /^https?:\/\//.test(value)) fail(`${photo.key} ${field} is a remote URL`);
  }
  if (seenKeys.has(photo.key)) continue;
  seenKeys.add(photo.key);
  if (!photo.widths.includes(800)) fail(`${photo.key} is missing the 800 WebP`);
  for (const width of photo.widths) {
    if (![800, 1600].includes(width)) fail(`${photo.key} has an unexpected width ${width}`);
    const file = path.join(root, "public/img", `${photo.key}-${width}.webp`);
    try {
      statSync(file);
    } catch {
      fail(`missing public/img/${photo.key}-${width}.webp`);
    }
  }
}

const spots = [...readFileSync(path.join(root, "src/data/spots.ts"), "utf8").matchAll(/^\s+id: "([^"]+)"/gm)].map((match) => match[1]);
const routes = [...readFileSync(path.join(root, "src/data/routes.ts"), "utf8").matchAll(/^\s+id: "([^"]+)"/gm)].map((match) => match[1]);
for (const id of spots) {
  if (!catalog.photos.some((photo) => photo.type === "spot" && photo.id === id)) fail(`spot ${id} has no photo`);
}
for (const id of routes) {
  if (!catalog.photos.some((photo) => photo.type === "route" && photo.id === id && photo.role === "hero")) {
    fail(`route ${id} has no hero`);
  }
}

const replaced = catalog.photos.filter((photo) => photo.replaces);
if (replaced.length !== 10) fail(`expected 10 replaced rows, found ${replaced.length}`);
const servedTitles = new Set(catalog.photos.map((photo) => photo.commons_title));
for (const title of [
  "Kruševo, Krushevë Krushevo.jpg",
  "Markovi Kuli - Letevci 1.jpg",
  "St. John Kaneo Church 2022.jpg",
  "Belasica from Sinanitsa peak.jpg",
  "Kalabak IMG 4600.jpg",
  "Поглед към Беласица.jpg",
  "Šar Mountains - Malet e Sharrit - Šar planina - Шар планина.jpg",
  "- Malet e Sharrit - Šar planina - Шар планина - Šar Mountains.jpg",
  "Зајдисонце на Беровско Езеро.jpg",
]) {
  if (servedTitles.has(title)) fail(`replaced file is still served: ${title}`);
}
if (catalog.entries !== 193 || catalog.uniqueFiles !== 172) {
  fail(`expected 193 entries and 172 unique files, got ${catalog.entries}/${catalog.uniqueFiles}`);
}

const hosts = /upload\.wikimedia\.org|live\.staticflickr\.com|staticflickr\.com|beinmacedonia\.com|ourwanders\.com|getyourguide\.com|euronews\.com|adventurousmiriam\.com|discoveringmacedonia\.com|flickr\.com/i;

function walk(dir, found = []) {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, found);
    else if (/\.(tsx|ts)$/.test(entry)) found.push(full);
  }
  return found;
}

for (const file of [
  ...walk(path.join(root, "src/components")),
  ...walk(path.join(root, "src/pages")),
  ...walk(path.join(root, "src/data")),
]) {
  const source = readFileSync(file, "utf8");
  if (hosts.test(source)) fail(`${path.relative(root, file)} still hotlinks a photo host`);
}

let imageBytes = 0;
function walkImg(dir) {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) walkImg(full);
    else {
      imageBytes += statSync(full).size;
      if (!entry.endsWith(".webp")) fail(`only WebP variants are committed: ${path.relative(root, full)}`);
    }
  }
}
walkImg(path.join(root, "public/img"));
if (imageBytes > BUDGET_BYTES) {
  fail(`public/img is ${imageBytes} bytes, over the 30 MB budget`);
}

if (catalog.uniqueFiles >= catalog.entries) {
  fail("P-07: expected route rows to reuse spot files, so unique files should be fewer than entries");
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(
  `images ok: ${catalog.entries} entries, ${catalog.uniqueFiles} files, ${seenKeys.size} keys, ${(imageBytes / 1024 / 1024).toFixed(1)} MB`,
);
