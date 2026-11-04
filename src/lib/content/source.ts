/**
 * Which catalog the UI reads.
 * `static` (default) uses `src/data`. `supabase` reads the planned content
 * tables and stays off unless `VITE_CONTENT_SOURCE=supabase` and both public
 * Supabase env vars are set. The published anon fallback is never used here.
 */

export type ContentSource = "static" | "supabase";

export interface ContentEnv {
  source?: string;
  supabaseUrl?: string;
  supabaseKey?: string;
}

function normalize(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function readContentEnv(): ContentEnv {
  return {
    source: import.meta.env.VITE_CONTENT_SOURCE,
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
    supabaseKey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  };
}

export function resolveContentSource(env: ContentEnv = readContentEnv()): ContentSource {
  const source = normalize(env.source)?.toLowerCase();
  if (source !== "supabase") return "static";

  const url = normalize(env.supabaseUrl);
  const key = normalize(env.supabaseKey);
  if (!url || !key) {
    console.warn(
      "[SoulRide] VITE_CONTENT_SOURCE=supabase but VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY is empty. Staying on the bundled catalog. No secret key is read.",
    );
    return "static";
  }

  return "supabase";
}

export const CONTENT_STALE_TIME_MS = 10 * 60 * 1000;
