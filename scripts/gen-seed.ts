/**
 * Reproducible content seed for stage 2.
 *
 * Reads src/data/spots.ts, src/data/routes.ts, content-src/spots-extra.json,
 * content-src/i18n/mk/content.json, and (if present) content-src/photos/manifest.json.
 * Writes supabase/migrations/20261104130000_stage2_seed_content_v1.sql
 * and supabase/seed-report.json.
 *
 * Run from the repo root:
 *   node --experimental-strip-types scripts/gen-seed.ts
 *
 * Never talks to a live database. Re-running overwrites only the v1 seed
 * migration in this working tree. After that file is merged, bump the version
 * and emit a new migration instead of editing it.
 */
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spots as spotsFromTs, type Spot } from "../src/data/spots.ts";
import { routes as routesFromTs, type Route } from "../src/data/routes.ts";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const VERSION = 1;
const MIGRATION = resolve(
  root,
  "supabase/migrations/20261104130000_stage2_seed_content_v1.sql",
);
const REPORT = resolve(root, "supabase/seed-report.json");

type MkStatus = "machine" | "reviewed";

interface SpotMk {
  _status: MkStatus;
  name: string;
  description: string;
  long_description: string;
  tagline: string;
  rider_tips: string[];
}

interface RouteMk {
  _status: MkStatus;
  name: string;
  description: string;
  long_description: string;
  tagline: string;
  duration: string;
  highlights: string[];
  activities: string[];
  rider_tips: string[];
  things_to_do: Record<string, string>;
  eat_and_rest: Record<string, string>;
  details: {
    elevation: string;
    roadCondition: string;
    bestSeason: string;
    fuelStops: string;
  };
}

interface ContentFile {
  spots: Record<string, SpotMk>;
  routes: Record<string, RouteMk>;
}

interface PhotoManifestEntry {
  key: string;
  width: number;
  height: number;
  alt_en?: string;
  alt_mk?: string;
  alt_mk_status?: MkStatus;
  is_own?: boolean;
  author: string;
  license: string;
  license_url?: string | null;
  source_url?: string | null;
  modified?: boolean;
  focal_x?: number;
  focal_y?: number;
  placeholder_color?: string | null;
  lqip?: string | null;
  spot_slug?: string;
  route_slug?: string;
  position?: number;
}

const errors: string[] = [];

function fail(message: string) {
  errors.push(message);
}

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(path, "utf8")) as T;
}

function dollar(value: string): string {
  if (value.includes("$sr$")) {
    throw new Error("text contains the dollar-quote tag $sr$");
  }
  return `$sr$${value}$sr$`;
}

function sqlText(value: string | null | undefined): string {
  if (value == null) return "null";
  return dollar(value);
}

function sqlArray(values: string[]): string {
  if (values.length === 0) return `array[]::text[]`;
  return `array[${values.map((value) => dollar(value)).join(", ")}]::text[]`;
}

function sqlJson(value: unknown): string {
  return `${dollar(JSON.stringify(value))}::jsonb`;
}

function distanceKm(distance: string): number {
  const match = distance.replace(",", ".").match(/(\d+(?:\.\d+)?)/);
  if (!match) {
    fail(`could not parse distance "${distance}"`);
    return 0;
  }
  return Number(match[1]);
}

function assertLen(label: string, value: string | null | undefined, max: number) {
  const len = (value ?? "").length;
  if (len > max) fail(`${label} is ${len} chars (max ${max})`);
}

const extraPath = resolve(root, "content-src/spots-extra.json");
const contentPath = resolve(root, "content-src/i18n/mk/content.json");
const manifestPath = resolve(root, "content-src/photos/manifest.json");

const extraRaw = readJson<Spot | Spot[]>(extraPath);
const extras = Array.isArray(extraRaw) ? extraRaw : [extraRaw];
const content = readJson<ContentFile>(contentPath);

const spots: Spot[] = spotsFromTs.map((spot) => ({ ...spot, images: [] }));
const deviations: { slug: string; note: string; spots_ts?: unknown; extra?: unknown }[] = [];

for (const extra of extras) {
  const existing = spots.find((spot) => spot.id === extra.id);
  if (existing) {
    deviations.push({
      slug: extra.id,
      note: "slug already exists in src/data/spots.ts; the TypeScript row is seeded and spots-extra.json is only a fallback",
      spots_ts: existing.coordinates,
      extra: extra.coordinates,
    });
    continue;
  }
  spots.push({ ...extra, images: [] });
}

if (spots.length !== 36) {
  fail(`expected 36 spots after extras, got ${spots.length}`);
}
if (!spots.some((spot) => spot.id === "vodoca-monastery")) {
  fail("vodoca-monastery is missing");
}

const slugSet = new Set<string>();
for (const spot of spots) {
  if (slugSet.has(spot.id)) fail(`duplicate spot slug ${spot.id}`);
  slugSet.add(spot.id);
  if (!/^[a-z0-9-]{2,80}$/.test(spot.id)) fail(`bad spot slug ${spot.id}`);
  if (spot.region === ("Multi-Region" as Spot["region"])) {
    fail(`spot ${spot.id} cannot use Multi-Region`);
  }
  if (
    spot.coordinates.lat < 40.8 ||
    spot.coordinates.lat > 42.4 ||
    spot.coordinates.lng < 20.4 ||
    spot.coordinates.lng > 23.1
  ) {
    fail(`spot ${spot.id} coordinates are outside the schema bounds`);
  }
  const mk = content.spots[spot.id];
  if (!mk) {
    fail(`missing MK entry for spot ${spot.id}`);
    continue;
  }
  if (mk._status !== "machine" && mk._status !== "reviewed") {
    fail(`spot ${spot.id} _status must be machine or reviewed`);
  }
  if (mk.rider_tips.length !== spot.riderTips.length) {
    fail(`spot ${spot.id} rider tip count differs (${mk.rider_tips.length} mk, ${spot.riderTips.length} en)`);
  }
  assertLen(`spot ${spot.id} name_en`, spot.title, 120);
  assertLen(`spot ${spot.id} name_mk`, mk.name, 120);
  assertLen(`spot ${spot.id} description_en`, spot.description, 500);
  assertLen(`spot ${spot.id} description_mk`, mk.description, 500);
  assertLen(`spot ${spot.id} long_en`, spot.longDescription, 5000);
  assertLen(`spot ${spot.id} long_mk`, mk.long_description, 5000);
  assertLen(`spot ${spot.id} tagline_en`, spot.poeticTagline, 200);
  assertLen(`spot ${spot.id} tagline_mk`, mk.tagline, 200);
  for (const tip of [...spot.riderTips, ...mk.rider_tips]) {
    if (!tip.trim()) fail(`empty rider tip on ${spot.id}`);
  }
}

if (routesFromTs.length !== 7) fail(`expected 7 routes, got ${routesFromTs.length}`);

let stopCount = 0;
const routeSlugSet = new Set<string>();
for (const route of routesFromTs) {
  if (routeSlugSet.has(route.id)) fail(`duplicate route slug ${route.id}`);
  routeSlugSet.add(route.id);
  if (!/^[a-z0-9-]{2,80}$/.test(route.id)) fail(`bad route slug ${route.id}`);
  const seen = new Set<string>();
  route.spotIds.forEach((slug, index) => {
    stopCount += 1;
    if (!slugSet.has(slug)) fail(`route ${route.id} references unknown spot ${slug}`);
    if (seen.has(slug)) fail(`route ${route.id} repeats spot ${slug}`);
    seen.add(slug);
    if (index !== route.spotIds.indexOf(slug)) fail(`duplicate position on ${route.id}`);
  });
  const mk = content.routes[route.id];
  if (!mk) {
    fail(`missing MK entry for route ${route.id}`);
    continue;
  }
  if (mk._status !== "machine" && mk._status !== "reviewed") {
    fail(`route ${route.id} _status must be machine or reviewed`);
  }
  if (mk.highlights.length !== route.highlights.length) fail(`${route.id} highlight count`);
  if (mk.activities.length !== route.activities.length) fail(`${route.id} activity count`);
  if (mk.rider_tips.length !== route.riderTips.length) fail(`${route.id} rider tip count`);
  for (const slug of route.spotIds) {
    if (!route.thingsToDo[slug]) fail(`${route.id} missing EN thingsToDo for ${slug}`);
    if (!mk.things_to_do[slug]) fail(`${route.id} missing MK things_to_do for ${slug}`);
    assertLen(`${route.id} things_en ${slug}`, route.thingsToDo[slug], 500);
    assertLen(`${route.id} things_mk ${slug}`, mk.things_to_do[slug], 500);
  }
  for (const stop of route.eatAndRest) {
    if (!mk.eat_and_rest[stop.name]) fail(`${route.id} missing MK eat_and_rest for ${stop.name}`);
  }
  for (const key of ["elevation", "roadCondition", "bestSeason", "fuelStops"] as const) {
    if (!route.routeDetails[key]) fail(`${route.id} missing EN detail ${key}`);
    if (!mk.details[key]) fail(`${route.id} missing MK detail ${key}`);
  }
  assertLen(`${route.id} name_en`, route.title, 120);
  assertLen(`${route.id} name_mk`, mk.name, 120);
  assertLen(`${route.id} description_en`, route.description, 500);
  assertLen(`${route.id} description_mk`, mk.description, 500);
  assertLen(`${route.id} long_en`, route.longDescription, 5000);
  assertLen(`${route.id} long_mk`, mk.long_description, 5000);
  assertLen(`${route.id} tagline_en`, route.poeticTagline, 200);
  assertLen(`${route.id} tagline_mk`, mk.tagline, 200);
  assertLen(`${route.id} duration_en`, route.duration, 80);
  assertLen(`${route.id} duration_mk`, mk.duration, 80);
  distanceKm(route.distance);
}

if (stopCount !== 16) fail(`expected 16 stops, got ${stopCount}`);

interface SeedPhoto {
  entry: PhotoManifestEntry;
  spotSlug: string | null;
  routeSlug: string | null;
  position: number;
}

const photos: SeedPhoto[] = [];
const photoWarnings: string[] = [];
if (existsSync(manifestPath)) {
  const manifest = readJson<PhotoManifestEntry[]>(manifestPath);
  const seenKeys = new Set<string>();
  manifest.forEach((entry, index) => {
    if (!/^((spots|routes)\/[a-z0-9-]+\/[0-9]{2})$/.test(entry.key)) {
      fail(`photo key ${entry.key} does not match spots|routes/<slug>/NN`);
    }
    if (seenKeys.has(entry.key)) fail(`duplicate photo key ${entry.key}`);
    seenKeys.add(entry.key);
    if (!(entry.width > 0) || !(entry.height > 0)) fail(`photo ${entry.key} needs width and height`);
    if (/NC|ND/i.test(entry.license)) fail(`photo ${entry.key} uses an NC or ND licence`);
    const own = Boolean(entry.is_own);
    if (!own && (!entry.license_url || !entry.source_url)) {
      fail(`photo ${entry.key} needs license_url and source_url`);
    }
    const altMk = entry.alt_mk ?? "";
    if (altMk.length < 3 || altMk.length > 250) fail(`photo ${entry.key} alt_mk length`);
    if ((entry.alt_en ?? "").length > 250) fail(`photo ${entry.key} alt_en length`);
    const variantStem = resolve(root, "public/img", entry.key.replaceAll("/", "-"));
    const hasVariant = ["webp", "avif", "jpg", "jpeg"].some((ext) =>
      existsSync(`${variantStem}-640.${ext}`) || existsSync(`${variantStem}.${ext}`),
    );
    if (!hasVariant) fail(`photo ${entry.key} has no generated variant under public/img`);
    const spotSlug = entry.spot_slug ?? (entry.key.startsWith("spots/") ? entry.key.split("/")[1] : null);
    const routeSlug = entry.route_slug ?? (entry.key.startsWith("routes/") ? entry.key.split("/")[1] : null);
    if (spotSlug && !slugSet.has(spotSlug)) fail(`photo ${entry.key} spot ${spotSlug} is unknown`);
    if (routeSlug && !routeSlugSet.has(routeSlug)) fail(`photo ${entry.key} route ${routeSlug} is unknown`);
    photos.push({
      entry,
      spotSlug: spotSlug && slugSet.has(spotSlug) ? spotSlug : null,
      routeSlug,
      position: entry.position ?? index,
    });
  });
} else {
  photoWarnings.push("content-src/photos/manifest.json is absent; no photo rows are seeded");
}

const spotsWithoutPhotos = spots
  .filter((spot) => !photos.some((photo) => photo.spotSlug === spot.id))
  .map((spot) => spot.id);
if (spotsWithoutPhotos.length > 0) {
  photoWarnings.push(`${spotsWithoutPhotos.length} spots have no photos yet`);
}

if (errors.length > 0) {
  throw new Error(errors.join("\n"));
}

function spotValues(spot: Spot, sortOrder: number): string {
  const mk = content.spots[spot.id];
  const status = mk._status === "reviewed" ? "published" : "draft";
  return `(
    ${dollar(spot.id)},
    ${dollar(spot.region)}::public.region,
    ${sqlArray(spot.tags)},
    ${spot.coordinates.lat},
    ${spot.coordinates.lng},
    ${sqlText(mk.name)},
    ${sqlText(spot.title)},
    ${sqlText(mk.description)},
    ${sqlText(spot.description)},
    ${sqlText(mk.long_description)},
    ${sqlText(spot.longDescription)},
    ${sqlText(mk.tagline)},
    ${sqlText(spot.poeticTagline)},
    ${sqlArray(mk.rider_tips)},
    ${sqlArray(spot.riderTips)},
    ${dollar(status)}::public.publish_status,
    ${sortOrder},
    ${dollar(mk._status)}::public.translation_status
  )`;
}

function routeValues(route: Route, sortOrder: number): string {
  const mk = content.routes[route.id];
  const status = mk._status === "reviewed" ? "published" : "draft";
  const eat = route.eatAndRest.map((stop) => ({
    name: stop.name,
    description_mk: mk.eat_and_rest[stop.name],
    description_en: stop.description,
  }));
  return `(
    ${dollar(route.id)},
    ${dollar(route.region)}::public.region,
    ${dollar(route.difficulty)}::public.difficulty,
    ${distanceKm(route.distance)},
    ${sqlText(mk.name)},
    ${sqlText(route.title)},
    ${sqlText(mk.description)},
    ${sqlText(route.description)},
    ${sqlText(mk.long_description)},
    ${sqlText(route.longDescription)},
    ${sqlText(mk.tagline)},
    ${sqlText(route.poeticTagline)},
    ${sqlText(mk.duration)},
    ${sqlText(route.duration)},
    ${sqlArray(mk.highlights)},
    ${sqlArray(route.highlights)},
    ${sqlArray(mk.activities)},
    ${sqlArray(route.activities)},
    ${sqlArray(mk.rider_tips)},
    ${sqlArray(route.riderTips)},
    ${sqlJson(eat)},
    ${sqlJson(mk.details)},
    ${sqlJson(route.routeDetails)},
    ${dollar(status)}::public.publish_status,
    ${sortOrder},
    ${dollar(mk._status)}::public.translation_status
  )`;
}

const spotRows = spots.map((spot, index) => spotValues(spot, index + 1)).join(",\n");
const routeRows = routesFromTs.map((route, index) => routeValues(route, index + 1)).join(",\n");

const stopSource = `(
${routesFromTs
  .flatMap((route) => {
    const mk = content.routes[route.id];
    return route.spotIds.map((slug, position) => {
      return `  select ${dollar(route.id)}, ${dollar(slug)}, ${position}::smallint, ${sqlText(mk.things_to_do[slug])}, ${sqlText(route.thingsToDo[slug])}`;
    });
  })
  .join("\n  union all\n")}
) src (route_slug, slug, position, things_mk, things_en)`

const photoSql = photos.length
  ? `
  insert into public.photos (
    key, width, height, alt_mk, alt_en, alt_mk_status, is_own, author, license,
    license_url, source_url, modified, focal_x, focal_y, placeholder_color, lqip
  )
  values
${photos
  .map(({ entry }) => {
    return `  (
      ${dollar(entry.key)}, ${entry.width}, ${entry.height},
      ${sqlText(entry.alt_mk ?? null)}, ${sqlText(entry.alt_en ?? null)},
      ${dollar(entry.alt_mk_status ?? "machine")}::public.translation_status,
      ${entry.is_own ? "true" : "false"}, ${sqlText(entry.author)}, ${sqlText(entry.license)},
      ${sqlText(entry.license_url ?? null)}, ${sqlText(entry.source_url ?? null)},
      ${entry.modified ? "true" : "false"},
      ${entry.focal_x ?? 0.5}, ${entry.focal_y ?? 0.5},
      ${sqlText(entry.placeholder_color ?? null)}, ${sqlText(entry.lqip ?? null)}
    )`;
  })
  .join(",\n")}
  on conflict (key) do nothing;

  insert into public.spot_photos (spot_id, photo_id, position)
  select s.id, p.id, src.position
  from (
${photos
  .filter((photo) => photo.spotSlug)
  .map(
    (photo) =>
      `    select ${dollar(photo.spotSlug!)} as spot_slug, ${dollar(photo.entry.key)} as key, ${photo.position}::smallint as position`,
  )
  .join("\n    union all\n")}
  ) src
  join public.spots s on s.slug = src.spot_slug and s.updated_by is null
  join public.photos p on p.key = src.key
  on conflict (spot_id, photo_id) do nothing;
`
  : "  -- No photo manifest yet. Files stay on the static host when the manifest lands.\n";

const sql = `-- Generated by scripts/gen-seed.ts. Do not edit by hand.
-- Content version ${VERSION}. Machine MK, every catalog row loaded as draft.
-- Idempotent: ON CONFLICT updates only rows that an admin has not touched
-- (spots/routes.updated_by is null). Re-running never overwrites those edits.
-- vodoca-monastery is included as a draft. Coordinates come from src/data/spots.ts
-- (41.4506, 22.5903) and still need Dev Content review. See seed-report.json.

create or replace function public.apply_content_seed_v1()
returns void
language plpgsql
security definer
set search_path = public
as $seed$
begin
  insert into public.spots (
    slug, region, tags, lat, lng,
    name_mk, name_en, description_mk, description_en,
    long_description_mk, long_description_en, tagline_mk, tagline_en,
    rider_tips_mk, rider_tips_en, status, sort_order, mk_status
  )
  values
${spotRows}
  on conflict (slug) do update set
    region = excluded.region,
    tags = excluded.tags,
    lat = excluded.lat,
    lng = excluded.lng,
    name_mk = excluded.name_mk,
    name_en = excluded.name_en,
    description_mk = excluded.description_mk,
    description_en = excluded.description_en,
    long_description_mk = excluded.long_description_mk,
    long_description_en = excluded.long_description_en,
    tagline_mk = excluded.tagline_mk,
    tagline_en = excluded.tagline_en,
    rider_tips_mk = excluded.rider_tips_mk,
    rider_tips_en = excluded.rider_tips_en,
    status = excluded.status,
    sort_order = excluded.sort_order,
    mk_status = excluded.mk_status
  where public.spots.updated_by is null;

  insert into public.routes (
    slug, region, difficulty, distance_km,
    name_mk, name_en, description_mk, description_en,
    long_description_mk, long_description_en, tagline_mk, tagline_en,
    duration_mk, duration_en,
    highlights_mk, highlights_en, activities_mk, activities_en,
    rider_tips_mk, rider_tips_en, eat_and_rest, details_mk, details_en,
    status, sort_order, mk_status
  )
  values
${routeRows}
  on conflict (slug) do update set
    region = excluded.region,
    difficulty = excluded.difficulty,
    distance_km = excluded.distance_km,
    name_mk = excluded.name_mk,
    name_en = excluded.name_en,
    description_mk = excluded.description_mk,
    description_en = excluded.description_en,
    long_description_mk = excluded.long_description_mk,
    long_description_en = excluded.long_description_en,
    tagline_mk = excluded.tagline_mk,
    tagline_en = excluded.tagline_en,
    duration_mk = excluded.duration_mk,
    duration_en = excluded.duration_en,
    highlights_mk = excluded.highlights_mk,
    highlights_en = excluded.highlights_en,
    activities_mk = excluded.activities_mk,
    activities_en = excluded.activities_en,
    rider_tips_mk = excluded.rider_tips_mk,
    rider_tips_en = excluded.rider_tips_en,
    eat_and_rest = excluded.eat_and_rest,
    details_mk = excluded.details_mk,
    details_en = excluded.details_en,
    status = excluded.status,
    sort_order = excluded.sort_order,
    mk_status = excluded.mk_status
  where public.routes.updated_by is null;

  delete from public.route_spots rs
  using public.routes r
  where rs.route_id = r.id
    and r.updated_by is null
    and not exists (
      select 1
      from ${stopSource}
      join public.spots s on s.slug = src.slug
      where src.route_slug = r.slug
        and s.id = rs.spot_id
    );

  insert into public.route_spots (route_id, spot_id, position, things_to_do_mk, things_to_do_en)
  select r.id, s.id, src.position, src.things_mk, src.things_en
  from ${stopSource}
  join public.routes r on r.slug = src.route_slug and r.updated_by is null
  join public.spots s on s.slug = src.slug
  on conflict (route_id, spot_id) do update set
    position = excluded.position,
    things_to_do_mk = excluded.things_to_do_mk,
    things_to_do_en = excluded.things_to_do_en
  where exists (
    select 1 from public.routes r
    where r.id = public.route_spots.route_id
      and r.updated_by is null
  );

${photoSql}end;
$seed$;

revoke all on function public.apply_content_seed_v1() from public, anon, authenticated;

select public.apply_content_seed_v1();

do $$
begin
  assert (select count(*) from public.spots) = 36, 'spots != 36';
  assert (select count(*) from public.routes) = 7, 'routes != 7';
  assert (select count(*) from public.route_spots) = 16, 'route_spots != 16';
  assert (
    select count(*) from public.spots
    where slug = 'vodoca-monastery' and status = 'draft'
  ) = 1, 'spot 36 missing';
  assert not exists (select 1 from public.spots where mk_status = 'missing'), 'MK missing on a spot';
  assert not exists (select 1 from public.routes where mk_status = 'missing'), 'MK missing on a route';
  assert not exists (select 1 from public.spots where status = 'published'), 'machine MK must stay draft';
  assert not exists (select 1 from public.routes where status = 'published'), 'machine routes must stay draft';
end $$;
`;

if (!sql.includes("route_slug") || !sql.includes("things_mk")) {
  throw new Error("seed SQL lost stop columns");
}

mkdirSync(dirname(MIGRATION), { recursive: true });
writeFileSync(MIGRATION, sql);

const vodoca = spots.find((spot) => spot.id === "vodoca-monastery");
const report = {
  version: VERSION,
  generated_from: [
    "src/data/spots.ts",
    "src/data/routes.ts",
    "content-src/spots-extra.json",
    "content-src/i18n/mk/content.json",
    existsSync(manifestPath) ? "content-src/photos/manifest.json" : null,
  ].filter(Boolean),
  counts: {
    spots: spots.length,
    routes: routesFromTs.length,
    route_spots: stopCount,
    photos: photos.length,
  },
  drafts: {
    spots: spots.filter((spot) => content.spots[spot.id]._status !== "reviewed").map((spot) => spot.id),
    routes: routesFromTs.filter((route) => content.routes[route.id]._status !== "reviewed").map((route) => route.id),
  },
  mk_status: {
    spots: Object.fromEntries(spots.map((spot) => [spot.id, content.spots[spot.id]._status])),
    routes: Object.fromEntries(routesFromTs.map((route) => [route.id, content.routes[route.id]._status])),
  },
  spots_without_photos: spotsWithoutPhotos,
  warnings: photoWarnings,
  coordinate_review: [
    {
      slug: "vodoca-monastery",
      seeded: vodoca?.coordinates ?? null,
      spec_approximate: { lat: 41.43, lng: 22.58 },
      status: "draft",
      reason:
        "Dev Content must verify the pin before this draft can be reviewed for publishing. src/data/spots.ts already has a pin; it is close to the spec's approximate 41.43, 22.58.",
    },
  ],
  deviations: deviations,
};

writeFileSync(REPORT, JSON.stringify(report, null, 2) + "\n");
console.log(`wrote ${MIGRATION}`);
console.log(`wrote ${REPORT}`);
console.log(`spots ${spots.length}, routes ${routesFromTs.length}, stops ${stopCount}, photos ${photos.length}`);
if (photoWarnings.length) console.log(photoWarnings.join("\n"));
