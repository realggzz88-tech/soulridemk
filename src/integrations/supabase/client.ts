import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";
import { resolveSupabasePublicConfig } from "@/lib/public-env";

const { url: SUPABASE_URL, publishableKey: SUPABASE_PUBLISHABLE_KEY } = resolveSupabasePublicConfig();

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});