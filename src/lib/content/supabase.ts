import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { mapRouteRow, mapSpotRow, type RouteRow, type SpotRow } from "./supabase-map";
import { readContentEnv, resolveContentSource } from "./source";
import type { Route, Spot } from "./types";

/**
 * Reads published content from the planned Supabase tables.
 * Uses only the anon/publishable key. No storage downloads and no image transforms.
 */

let client: SupabaseClient | null = null;

export function contentSupabaseClient(): SupabaseClient {
  const env = readContentEnv();
  if (resolveContentSource(env) !== "supabase") {
    throw new Error("Supabase content source is not enabled.");
  }
  if (!client) {
    client = createClient(env.supabaseUrl!.trim(), env.supabaseKey!.trim(), {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });
  }
  return client;
}

const SPOT_SELECT = "*, spot_photos(position, photos(*))";
const ROUTE_SELECT = "*, cover:photos!cover_photo_id(*), route_spots(position, things_to_do_mk, things_to_do_en, spots(slug))";

export async function fetchSupabaseSpots(): Promise<Spot[]> {
  const { data, error } = await contentSupabaseClient()
    .from("spots")
    .select(SPOT_SELECT)
    .eq("status", "published")
    .order("sort_order", { ascending: true });

  if (error) throw error;

  return ((data ?? []) as SpotRow[]).flatMap((row) => {
    const spot = mapSpotRow(row);
    return spot ? [spot] : [];
  });
}

export async function fetchSupabaseRoutes(): Promise<Route[]> {
  const { data, error } = await contentSupabaseClient()
    .from("routes")
    .select(ROUTE_SELECT)
    .eq("status", "published")
    .order("sort_order", { ascending: true });

  if (error) throw error;

  return ((data ?? []) as RouteRow[]).flatMap((row) => {
    const route = mapRouteRow(row);
    return route ? [route] : [];
  });
}
