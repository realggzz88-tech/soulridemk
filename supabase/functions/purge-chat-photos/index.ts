// Scaffold only. Do not deploy. Deletes chat-photos objects older than 12 months.
// pg_cron calls this with x-cron-secret. It does not log message content.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204 });
  if (req.headers.get("x-cron-secret") !== Deno.env.get("CRON_SECRET")) {
    return new Response("unauthorized", { status: 401 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );
  const cutoff = new Date();
  cutoff.setUTCMonth(cutoff.getUTCMonth() - 12);

  const { data: names, error } = await supabase.rpc("chat_photo_names_older_than", {
    cutoff: cutoff.toISOString(),
    lim: 1000,
  });
  if (error) return Response.json({ error: error.message }, { status: 500 });

  const list = Array.isArray(names) ? names : [];
  if (list.length > 0) {
    const removed = await supabase.storage.from("chat-photos").remove(list);
    if (removed.error) return Response.json({ error: removed.error.message }, { status: 500 });
  }

  await supabase.from("maintenance_log").insert({
    job: "purge-chat-photos",
    rows_affected: list.length,
    detail: "chat-photos objects older than 12 months",
  });

  return Response.json({ removed: list.length });
});
