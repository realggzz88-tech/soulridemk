import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const STATIC_SPA_PATHS = ["/about", "/chat", "/login", "/profile", "/routes", "/signup", "/spots"];

const TILE_ORIGINS = [
  "https://a.basemaps.cartocdn.com",
  "https://b.basemaps.cartocdn.com",
  "https://basemaps.cartocdn.com",
  "https://c.basemaps.cartocdn.com",
  "https://d.basemaps.cartocdn.com",
];

export function quotedIds(relativeFile) {
  const source = readFileSync(path.join(root, relativeFile), "utf8");
  return [...source.matchAll(/id:\s*"([^"]+)"/g)].map((match) => match[1]);
}

export function httpsUrls(relativeFile) {
  const source = readFileSync(path.join(root, relativeFile), "utf8");
  return [...source.matchAll(/https:\/\/[^"'\\\s)]+/g)].map((match) => match[0]);
}

export function knownSpaPaths(spotIds, routeIds) {
  return [
    ...STATIC_SPA_PATHS,
    ...spotIds.map((id) => `/spots/${id}`),
    ...routeIds.map((id) => `/routes/${id}`),
  ].sort();
}

export function normalizePath(pathname) {
  const withoutQuery = pathname.split("?")[0]?.split("#")[0] ?? "/";
  if (withoutQuery.length > 1) return withoutQuery.replace(/\/+$/, "");
  return withoutQuery || "/";
}

export function spaDocumentStatus(pathname, paths) {
  const normalized = normalizePath(pathname);
  if (normalized === "/") return 200;
  return paths.includes(normalized) ? 200 : 404;
}

function imageOrigins(urls) {
  const origins = new Set(TILE_ORIGINS);
  origins.add("https://*.supabase.co");
  for (const url of urls) {
    try {
      const parsed = new URL(url);
      if (parsed.protocol === "https:") origins.add(parsed.origin);
    } catch {
      // Ignore fragments that are not absolute URLs.
    }
  }
  return [...origins].sort();
}

export function contentSecurityPolicy(imageUrls) {
  const images = imageOrigins(imageUrls).join(" ");
  return [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    `img-src 'self' data: blob: ${images}`,
    "media-src 'self' blob: https://*.supabase.co",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.openweathermap.org https://router.project-osrm.org",
    "worker-src 'self' blob:",
    "manifest-src 'self'",
    "upgrade-insecure-requests",
  ].join("; ");
}

export function createVercelConfig(spotIds, routeIds, imageUrls) {
  return {
    trailingSlash: false,
    rewrites: knownSpaPaths(spotIds, routeIds).map((source) => ({
      source,
      destination: "/index.html",
    })),
    headers: [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: contentSecurityPolicy(imageUrls) },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "geolocation=(self), camera=(), microphone=(), payment=()",
          },
        ],
      },
    ],
  };
}

export function repoVercelConfig() {
  const imageUrls = [
    ...httpsUrls("src/data/spots.ts"),
    ...httpsUrls("src/data/routes.ts"),
    ...httpsUrls("src/data/journeyData.ts"),
  ];
  return createVercelConfig(
    quotedIds("src/data/spots.ts"),
    quotedIds("src/data/routes.ts"),
    imageUrls,
  );
}
