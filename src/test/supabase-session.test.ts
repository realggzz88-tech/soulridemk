import { describe, expect, it } from "vitest";
import { hasStoredSupabaseSession } from "@/lib/supabase-session";

describe("hasStoredSupabaseSession", () => {
  it("ignores an empty browser", () => {
    localStorage.clear();
    expect(hasStoredSupabaseSession()).toBe(false);
  });

  it("notices a stored Supabase auth token", () => {
    localStorage.setItem("sb-example-auth-token", "{\"access_token\":\"x\"}");
    expect(hasStoredSupabaseSession()).toBe(true);
    localStorage.clear();
  });
});
