/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_PUBLISHABLE_KEY?: string;
  readonly VITE_SUPABASE_PROJECT_ID?: string;
  readonly VITE_OPENWEATHER_API_KEY?: string;
  /** `static` (default) or `supabase`. Supabase stays off unless this is exactly `supabase`. */
  readonly VITE_CONTENT_SOURCE?: string;
}
