import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { spots } from "../src/data/spots.ts";
import { routes } from "../src/data/routes.ts";
import {
  knownSpaPaths,
  quotedIds,
  repoVercelConfig,
  spaDocumentStatus,
} from "./vercel-config.mjs";

describe("vercel hosting", () => {
  const config = repoVercelConfig();
  const committed = JSON.parse(readFileSync(path.resolve("vercel.json"), "utf8"));
  const paths = knownSpaPaths(
    spots.map((spot) => spot.id),
    routes.map((route) => route.id),
  );

  it("matches the committed vercel.json", () => {
    expect(committed).toEqual(config);
  });

  it("covers every published spot and route without a catch-all rewrite", () => {
    expect(quotedIds("src/data/spots.ts")).toEqual(spots.map((spot) => spot.id));
    expect(quotedIds("src/data/routes.ts")).toEqual(routes.map((route) => route.id));
    expect(config.rewrites.map((rewrite) => rewrite.source)).toEqual(paths);
    expect(config.rewrites.some((rewrite) => rewrite.source.includes("*"))).toBe(false);
    expect(config.rewrites.every((rewrite) => rewrite.destination === "/index.html")).toBe(true);
  });

  it("keeps known screens on 200 and unknown urls on 404", () => {
    expect(spaDocumentStatus("/", paths)).toBe(200);
    expect(spaDocumentStatus("/spots", paths)).toBe(200);
    expect(spaDocumentStatus("/spots/", paths)).toBe(200);
    expect(spaDocumentStatus("/spots/galicica-pass", paths)).toBe(200);
    expect(spaDocumentStatus("/routes/eastern-waterfalls-loop", paths)).toBe(200);
    expect(spaDocumentStatus("/about", paths)).toBe(200);
    expect(spaDocumentStatus("/nope-xyz", paths)).toBe(404);
    expect(spaDocumentStatus("/this-does-not-exist", paths)).toBe(404);
    expect(spaDocumentStatus("/spots/not-a-real-spot", paths)).toBe(404);
    expect(spaDocumentStatus("/routes/not-a-real-route", paths)).toBe(404);
  });

  it("sends the security headers the app can live with", () => {
    const headers = Object.fromEntries(
      config.headers[0].headers.map((header) => [header.key, header.value]),
    );
    expect(headers["X-Frame-Options"]).toBe("DENY");
    expect(headers["X-Content-Type-Options"]).toBe("nosniff");
    expect(headers["Referrer-Policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["Permissions-Policy"]).toContain("geolocation=(self)");
    expect(headers["Permissions-Policy"]).toContain("camera=()");

    const csp = headers["Content-Security-Policy"];
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("script-src 'self'");
    expect(csp).not.toContain("unsafe-eval");
    expect(csp).toContain("https://fonts.googleapis.com");
    expect(csp).toContain("https://fonts.gstatic.com");
    expect(csp).toContain("https://a.basemaps.cartocdn.com");
    expect(csp).toContain("https://upload.wikimedia.org");
    expect(csp).toContain("https://live.staticflickr.com");
    expect(csp).toContain("https://www.beinmacedonia.com");
    expect(csp).toContain("https://*.supabase.co");
    expect(csp).toContain("wss://*.supabase.co");
    expect(csp).toContain("https://router.project-osrm.org");
    expect(csp).toContain("https://api.openweathermap.org");
    expect(config.trailingSlash).toBe(false);
  });
});
