/**
 * Values Vite inlines into the browser bundle.
 * They are public by the time the app ships — do not put service-role keys here.
 *
 * A missing or placeholder pair does not fall back to any hosted project.
 * The app stays up and shows "Backend not configured".
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

/** Non-secret stand-ins used by CI, GitHub Pages, and .env.example. */
const PLACEHOLDER_URLS = new Set([
  "https://example.supabase.co",
  "https://your_project_ref.supabase.co",
]);

const PLACEHOLDER_KEYS = new Set([
  "public-anon-key-placeholder",
  "your_supabase_anon_key",
  "your_api_key",
]);

/** True when a real OpenWeather key is available. The placeholder string is treated as unset. */
export function isOpenWeatherConfigured(
  key: string | undefined = publicEnv.openWeatherApiKey,
): boolean {
  if (typeof key !== "string") return false;
  const trimmed = key.trim();
  if (!trimmed || trimmed === OPENWEATHER_PLACEHOLDER) return false;
  return true;
}

export type SupabasePublicConfig = {
  url: string | null;
  publishableKey: string | null;
  configured: boolean;
};

function isPlaceholder(url: string, publishableKey: string): boolean {
  if (PLACEHOLDER_URLS.has(url.toLowerCase())) return true;
  if (PLACEHOLDER_KEYS.has(publishableKey.toLowerCase())) return true;
  return false;
}

/**
 * Real URL and anon key, or not configured.
 * Never returns the legacy Lovable project.
 */
export function resolveSupabasePublicConfig(
  url: string | null = publicEnv.supabaseUrl ?? null,
  publishableKey: string | null = publicEnv.supabasePublishableKey ?? null,
): SupabasePublicConfig {
  if (url && publishableKey && !isPlaceholder(url, publishableKey)) {
    return { url, publishableKey, configured: true };
  }
  console.error(
    "[SoulRide] Backend not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to the Free Supabase project. Missing values and CI placeholders do not connect anywhere.",
  );
  return { url: null, publishableKey: null, configured: false };
}
