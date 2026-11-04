import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";
import { resolveSupabasePublicConfig } from "@/lib/public-env";

const config = resolveSupabasePublicConfig();

/** False when the build has no real Supabase URL and anon key. */
export const supabaseConfigured = config.configured;

// createClient rejects an empty URL. This address is closed and is not a project.
const SUPABASE_URL = config.url ?? "http://127.0.0.1:9";
const SUPABASE_PUBLISHABLE_KEY = config.publishableKey ?? "public-anon-key-placeholder";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: config.configured,
  },
});
