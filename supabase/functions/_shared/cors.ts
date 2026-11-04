// Exact origins only. PostgREST itself stays open; RLS is the boundary.
const EXACT = new Set([
  "https://realggzz88-tech.github.io",
  "http://localhost:8080",
  "http://127.0.0.1:8080",
]);

// Filled in when the Cloudflare project exists. No paid custom domain required.
const PAGES_DEV = /^https:\/\/[a-z0-9-]+\.pages\.dev$/;

export function corsHeaders(req: Request): Headers {
  const headers = new Headers();
  const origin = req.headers.get("origin");
  if (origin && (EXACT.has(origin) || PAGES_DEV.test(origin))) {
    headers.set("access-control-allow-origin", origin);
    headers.set("vary", "origin");
  }
  headers.set("access-control-allow-headers", "authorization, apikey, content-type, x-cron-secret");
  headers.set("access-control-allow-methods", "GET, POST, OPTIONS");
  return headers;
}

export function withCors(req: Request, body: BodyInit | null, status: number): Response {
  const headers = corsHeaders(req);
  if (body && !headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }
  return new Response(body, { status, headers });
}
