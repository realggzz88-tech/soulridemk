// Scaffold only. Do not deploy. No API key is stored in the repo.
// Clients should read public.weather_cache over REST. This function refreshes it.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { withCors } from "../_shared/cors.ts";

const SLUG = /^[a-z0-9-]{2,80}$/;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return withCors(req, null, 204);

  const url = new URL(req.url);
  const cronOk = req.headers.get("x-cron-secret") === Deno.env.get("CRON_SECRET");
  const key = Deno.env.get("OPENWEATHER_API_KEY");
  if (!key) return withCors(req, JSON.stringify({ error: "OPENWEATHER_API_KEY is not set" }), 503);

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );

  if (req.method === "POST" && url.pathname.endsWith("/refresh")) {
    if (!cronOk) return withCors(req, JSON.stringify({ error: "unauthorized" }), 401);
    const { data: spots, error } = await supabase
      .from("spots")
      .select("id, slug, lat, lng")
      .eq("status", "published");
    if (error) return withCors(req, JSON.stringify({ error: error.message }), 500);
    // Concurrency 5 is the spec. The scaffold refreshes sequentially so it stays obvious.
    let updated = 0;
    for (const spot of spots ?? []) {
      const ok = await refreshSpot(supabase, key, spot);
      if (ok) updated += 1;
    }
    return withCors(req, JSON.stringify({ updated }), 200);
  }

  if (req.method === "GET") {
    const slug = url.searchParams.get("spot") ?? "";
    if (!SLUG.test(slug)) return withCors(req, JSON.stringify({ error: "bad slug" }), 400);
    const { data: spot } = await supabase
      .from("spots")
      .select("id, slug, lat, lng, status")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();
    if (!spot) return withCors(req, JSON.stringify({ error: "not found" }), 404);
    const { data: cached } = await supabase
      .from("weather_cache")
      .select("payload, fetched_at, stale")
      .eq("spot_id", spot.id)
      .maybeSingle();
    const fresh = cached?.fetched_at && Date.now() - Date.parse(cached.fetched_at) < 3 * 60 * 60 * 1000;
    if (cached && fresh) return withCors(req, JSON.stringify(cached.payload), 200);
    const ok = await refreshSpot(supabase, key, spot);
    if (!ok && cached) return withCors(req, JSON.stringify(cached.payload), 200);
    if (!ok) return withCors(req, JSON.stringify({ error: "provider failed" }), 502);
    const { data: again } = await supabase
      .from("weather_cache")
      .select("payload")
      .eq("spot_id", spot.id)
      .maybeSingle();
    return withCors(req, JSON.stringify(again?.payload ?? {}), 200);
  }

  return withCors(req, JSON.stringify({ error: "not found" }), 404);
});

async function refreshSpot(
  supabase: ReturnType<typeof createClient>,
  key: string,
  spot: { id: string; lat: number; lng: number },
): Promise<boolean> {
  const endpoint = new URL("https://api.openweathermap.org/data/2.5/weather");
  endpoint.searchParams.set("lat", String(spot.lat));
  endpoint.searchParams.set("lon", String(spot.lng));
  endpoint.searchParams.set("units", "metric");
  endpoint.searchParams.set("appid", key);
  const response = await fetch(endpoint);
  if (!response.ok) {
    await supabase.from("weather_cache").upsert({
      spot_id: spot.id,
      stale: true,
      fetched_at: new Date().toISOString(),
    });
    return false;
  }
  const raw = await response.json();
  const payload = {
    temp: raw?.main?.temp ?? null,
    feelsLike: raw?.main?.feels_like ?? null,
    description: raw?.weather?.[0]?.description ?? "",
    icon: raw?.weather?.[0]?.icon ?? "",
    humidity: raw?.main?.humidity ?? null,
    windSpeed: raw?.wind?.speed ?? null,
  };
  await supabase.from("weather_cache").upsert({
    spot_id: spot.id,
    payload,
    stale: false,
    fetched_at: new Date().toISOString(),
  });
  return true;
}
