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

export function requireSupabasePublicConfig(): { url: string; publishableKey: string } {
  const url = publicEnv.supabaseUrl;
  const publishableKey = publicEnv.supabasePublishableKey;
  if (!url || !publishableKey) {
    throw new Error(
      "Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY. Copy .env.example to .env and fill in the Supabase project values.",
    );
  }
  return { url, publishableKey };
}
