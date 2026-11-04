import { afterEach, describe, expect, it, vi } from "vitest";
import { resolveSupabasePublicConfig } from "@/lib/public-env";

describe("Supabase public config", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("uses both env values when they are a real project", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(resolveSupabasePublicConfig("https://custom.supabase.co", "custom-anon")).toEqual({
      url: "https://custom.supabase.co",
      publishableKey: "custom-anon",
      configured: true,
    });
    expect(error).not.toHaveBeenCalled();
  });

  it("does not fall back to a hosted project when env is missing", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const missing = resolveSupabasePublicConfig(null, null);
    expect(missing).toEqual({
      url: null,
      publishableKey: null,
      configured: false,
    });
    expect(missing.url).toBeNull();
    expect(missing.publishableKey).toBeNull();
    expect(resolveSupabasePublicConfig("https://custom.supabase.co", null).configured).toBe(false);
    expect(error).toHaveBeenCalled();
  });

  it("treats CI placeholders as not configured", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(
      resolveSupabasePublicConfig("https://example.supabase.co", "public-anon-key-placeholder"),
    ).toEqual({
      url: null,
      publishableKey: null,
      configured: false,
    });
    expect(error).toHaveBeenCalled();
  });
});
