import { afterEach, describe, expect, it, vi } from "vitest";
import { PUBLISHED_SUPABASE_ANON_KEY, PUBLISHED_SUPABASE_URL, resolveSupabasePublicConfig } from "@/lib/public-env";

describe("Supabase public config", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("uses both env values when they are set", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(resolveSupabasePublicConfig("https://custom.supabase.co", "custom-anon")).toEqual({
      url: "https://custom.supabase.co",
      publishableKey: "custom-anon",
      source: "env",
    });
    expect(warn).not.toHaveBeenCalled();
  });

  it("does not throw when env is missing and falls back to the published anon project", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(resolveSupabasePublicConfig(null, null)).toEqual({
      url: PUBLISHED_SUPABASE_URL,
      publishableKey: PUBLISHED_SUPABASE_ANON_KEY,
      source: "published-fallback",
    });
    expect(resolveSupabasePublicConfig("https://custom.supabase.co", null).source).toBe(
      "published-fallback",
    );
    expect(warn).toHaveBeenCalled();
  });
});
