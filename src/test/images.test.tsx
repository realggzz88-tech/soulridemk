import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SmartImage } from "@/components/SmartImage";
import { photoCatalog } from "@/lib/content/catalog";
import type { Photo } from "@/lib/content/types";

const sample: Photo = {
  id: "spots/demo/01",
  key: "spots/demo/01",
  width: 1600,
  height: 1200,
  widths: [800, 1600],
  alt: { mk: "Охридското Езеро", en: "Lake Ohrid" },
  needsNativeCheck: false,
  focal: { x: 0.5, y: 0.4 },
  credit: {
    author: "Nik",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Example.jpg",
    modified: true,
  },
};

describe("SmartImage", () => {
  it("lazy-loads ordinary photos and keeps the hero eager", () => {
    const { rerender } = render(<SmartImage photo={sample} />);
    const image = screen.getByRole("img", { name: "Охридското Езеро" });
    expect(image).toHaveAttribute("loading", "lazy");
    expect(image).toHaveAttribute("data-alt-en", "Lake Ohrid");
    expect(image.getAttribute("fetchpriority")).not.toBe("high");

    rerender(<SmartImage photo={sample} priority />);
    const hero = screen.getByRole("img", { name: "Охридското Езеро" });
    expect(hero).toHaveAttribute("loading", "eager");
    expect(hero).toHaveAttribute("fetchpriority", "high");
  });

  it("shows the designed fallback when a file fails", () => {
    render(<SmartImage photo={sample} />);
    fireEvent.error(screen.getByRole("img", { name: "Охридското Езеро" }));
    expect(screen.getByRole("img", { name: "Охридското Езеро" })).toBeInTheDocument();
    expect(screen.getByText("Фотографијата не е достапна")).toBeInTheDocument();
    expect(screen.getByText("Photo unavailable")).toBeInTheDocument();
  });
});

describe("photo catalog fixes", () => {
  it("follows the v3.1 manifest, including the ten designer replacements", () => {
    expect(photoCatalog.entries).toBe(193);
    expect(photoCatalog.uniqueFiles).toBe(172);
    expect(photoCatalog.photos).toHaveLength(193);
    expect(photoCatalog.p07).toMatch(/172 unique spot files/);

    for (const photo of photoCatalog.photos) {
      expect(photo.alt_mk.trim().length).toBeGreaterThan(2);
      expect(photo.alt_en.trim().length).toBeGreaterThan(2);
      expect(typeof photo.needs_native_check).toBe("boolean");
      expect(photo.author.trim().length).toBeGreaterThan(0);
      expect(photo.licence_url).toMatch(/^https:\/\//);
      expect(photo.source_url).toMatch(/^https:\/\/commons\.wikimedia\.org\//);
      expect(photo.licence).not.toMatch(/NC|ND/i);
      const heroFile = photoCatalog.photos.some(
        (other) => other.commons_title === photo.commons_title && other.role === "hero",
      );
      expect(photo.widths).toEqual(heroFile ? [800, 1600] : [800]);
    }

    const replaced = photoCatalog.photos.filter((photo) => photo.replaces);
    expect(replaced).toHaveLength(10);
    const titles = photoCatalog.photos.map((photo) => photo.commons_title);
    for (const title of [
      "Kruševo, Krushevë Krushevo.jpg",
      "Markovi Kuli - Letevci 1.jpg",
      "St. John Kaneo Church 2022.jpg",
      "Belasica from Sinanitsa peak.jpg",
      "Зајдисонце на Беровско Езеро.jpg",
    ]) {
      expect(titles).not.toContain(title);
    }
    expect(titles).toContain("Krushevo - P1100209.JPG");
    expect(titles).toContain("Marko's Towers area 5.JPG");
    expect(titles).toContain("Cerkiew św. Jana Teologa w Kaneo.jpg");
    expect(titles).toContain("Small Turk and Titov Vrv.jpg");
    expect(titles).toContain("Berovsko ezero 2013 (10).JPG");
    expect(titles).not.toContain("Krusevo Lake (Autumn Colors).jpg");
    expect(titles).not.toContain("Зајдисонце на Беровско Езеро.jpg");
  });
});
