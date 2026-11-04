// Scaffold only. Do not deploy.
// The scheduled path of record is public.dispatch_rebuild(), which reads Vault
// and calls GitHub (or a later Cloudflare deploy hook) via pg_net.
// This function is the same contract if a cron caller prefers HTTP.
import { withCors } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return withCors(req, null, 204);
  if (req.headers.get("x-cron-secret") !== Deno.env.get("CRON_SECRET")) {
    return withCors(req, JSON.stringify({ error: "unauthorized" }), 401);
  }

  const hook = Deno.env.get("REBUILD_DISPATCH_URL");
  const token = Deno.env.get("GITHUB_DISPATCH_TOKEN");
  if (!hook && !token) {
    return withCors(req, JSON.stringify({ error: "no dispatch secret configured" }), 503);
  }

  const response = hook
    ? await fetch(hook, { method: "POST", headers: { "content-type": "application/json" }, body: "{}" })
    : await fetch("https://api.github.com/repos/realggzz88-tech/soulridemk/dispatches", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${token}`,
          accept: "application/vnd.github+json",
          "user-agent": "soulride-dispatch",
        },
        body: JSON.stringify({ event_type: "content-changed" }),
      });

  if (!response.ok) {
    return withCors(req, JSON.stringify({ error: `dispatch failed: ${response.status}` }), 502);
  }
  return withCors(req, JSON.stringify({ dispatched: true }), 200);
});
