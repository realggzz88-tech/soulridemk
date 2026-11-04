import { describe, expect, it } from "vitest";
import { shouldMountDeferred } from "@/lib/defer-decision";

const hidden = {
  eager: false,
  requested: false,
  seen: true,
  startedInView: false,
  intersecting: false,
  scrolled: false,
};

describe("shouldMountDeferred", () => {
  it("stays unloaded until the browser has measured the placeholder", () => {
    expect(shouldMountDeferred({ ...hidden, seen: false, intersecting: true })).toBe(false);
  });

  it("loads a below-the-fold map when it scrolls into view", () => {
    expect(shouldMountDeferred({ ...hidden, intersecting: true })).toBe(true);
  });

  it("does not load an on-screen map during the first paint", () => {
    expect(
      shouldMountDeferred({ ...hidden, startedInView: true, intersecting: true, scrolled: false }),
    ).toBe(false);
  });

  it("loads an on-screen map after the reader scrolls", () => {
    expect(
      shouldMountDeferred({ ...hidden, startedInView: true, intersecting: true, scrolled: true }),
    ).toBe(true);
  });

  it("loads immediately when the reader asks or the caller is eager", () => {
    expect(shouldMountDeferred({ ...hidden, requested: true })).toBe(true);
    expect(shouldMountDeferred({ ...hidden, seen: false, eager: true })).toBe(true);
  });
});
