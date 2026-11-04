// Scaffold only. Do not deploy.
// Verifies the caller JWT, removes that user's objects in the four upload buckets,
// then deletes the auth user. Profiles, messages, routes, likes and favourites
// cascade from auth.users.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { withCors } from "../_shared/cors.ts";

const BUCKETS = ["avatars", "rides", "route-photos", "chat-photos"] as const;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return withCors(req, null, 204);
  if (req.method !== "POST") return withCors(req, JSON.stringify({ error: "POST only" }), 405);

  const url = Deno.env.get("SUPABASE_URL") ?? "";
  const anon = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
  const service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const header = req.headers.get("authorization") ?? "";
  if (!header.toLowerCase().startsWith("bearer ")) {
    return withCors(req, JSON.stringify({ error: "missing bearer token" }), 401);
  }

  const userClient = createClient(url, anon, {
    global: { headers: { authorization: header } },
  });
  const { data: userData, error: userError } = await userClient.auth.getUser();
  if (userError || !userData.user) {
    return withCors(req, JSON.stringify({ error: "invalid session" }), 401);
  }

  const admin = createClient(url, service);
  const { data: paths, error: pathError } = await admin.rpc("user_upload_paths", {
    p_user_id: userData.user.id,
  });
  if (pathError) return withCors(req, JSON.stringify({ error: pathError.message }), 500);

  const grouped = new Map<string, string[]>();
  for (const row of (paths ?? []) as { bucket_id: string; name: string }[]) {
    const list = grouped.get(row.bucket_id) ?? [];
    list.push(row.name);
    grouped.set(row.bucket_id, list);
  }
  for (const bucket of BUCKETS) {
    const names = grouped.get(bucket) ?? [];
    if (names.length === 0) continue;
    const removed = await admin.storage.from(bucket).remove(names);
    if (removed.error) {
      return withCors(req, JSON.stringify({ error: removed.error.message }), 500);
    }
  }

  const deleted = await admin.auth.admin.deleteUser(userData.user.id);
  if (deleted.error) return withCors(req, JSON.stringify({ error: deleted.error.message }), 500);
  return withCors(req, JSON.stringify({ deleted: true }), 200);
});
