/**
 * Values Vite inlines into the browser bundle.
 * They are public by the time the app ships — do not put service-role keys here.
 */

function normalize(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export const publicEnv = {
  supabaseUrl: normalize(import.meta.env.VITE_SUPABASE_URL),
  supabasePublishableKey: normalize(import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY),
  supabaseProjectId: normalize(import.meta.env.VITE_SUPABASE_PROJECT_ID),
  openWeatherApiKey: normalize(import.meta.env.VITE_OPENWEATHER_API_KEY),
};

const OPENWEATHER_PLACEHOLDER = "YOUR_API_KEY";

/** True when a real OpenWeather key is available. The placeholder string is treated as unset. */
export function isOpenWeatherConfigured(
  key: string | undefined = publicEnv.openWeatherApiKey,
): boolean {
  if (typeof key !== "string") return false;
  const trimmed = key.trim();
  if (!trimmed || trimmed === OPENWEATHER_PLACEHOLDER) return false;
  return true;
}

/**
 * Public anon config that used to ship in the committed `.env`.
 * Used only when the host did not provide both Vite variables, so a build
 * without env still starts instead of blanking the page.
 */
export const PUBLISHED_SUPABASE_URL = "https://mmgnqtruwthyxakskgus.supabase.co";
export const PUBLISHED_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1tZ25xdHJ1d3RoeXhha3NrZ3VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwNTA1NjUsImV4cCI6MjA4NTYyNjU2NX0.u7VGjABXbHX38QrAF1hJ614KQQ8DC9VoLekXReJzWlA";

export function resolveSupabasePublicConfig(
  url: string | null = publicEnv.supabaseUrl ?? null,
  publishableKey: string | null = publicEnv.supabasePublishableKey ?? null,
): { url: string; publishableKey: string; source: "env" | "published-fallback" } {
  if (url && publishableKey) {
    return { url, publishableKey, source: "env" };
  }
  console.warn(
    "[SoulRide] VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY is missing. Using the previously published public Supabase anon configuration so the app can still start. Set both variables to override.",
  );
  return {
    url: PUBLISHED_SUPABASE_URL,
    publishableKey: PUBLISHED_SUPABASE_ANON_KEY,
    source: "published-fallback",
  };
}
