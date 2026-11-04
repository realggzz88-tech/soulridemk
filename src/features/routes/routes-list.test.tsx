import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import RoutesPage from "@/pages/RoutesPage";
import { catalogKeys } from "./copy";
import { applyRouteQuery, lengthBucket, queryFromParams } from "./filter";
import { formatStats, routeTitle } from "./format";
import { surfaceFromRoadCondition } from "./model";
import { loadRouteList } from "./source";

describe("route list model", () => {
  it("matches the designer's surface, distance and stop table", async () => {
    const items = await loadRouteList();
    const byId = Object.fromEntries(items.map((item) => [item.id, item]));

    expect(byId["eastern-waterfalls-loop"]).toMatchObject({
      region: "East",
      difficulty: "Moderate",
      distanceKm: 85,
      durationMin: 4,
      durationMax: 5,
      stops: 3,
      surface: "mixed",
    });
    expect(byId["western-lakes-tour"].surface).toBe("mixed");
    expect(byId["central-canyon-ride"]).toMatchObject({ distanceKm: 140, surface: "asphalt", stops: 2 });
    expect(byId["northern-mountain-pass"].surface).toBe("asphalt");
    expect(byId["southern-winery-escape"]).toMatchObject({ difficulty: "Easy", distanceKm: 70, surface: "asphalt" });
    expect(byId["pelister-peaks-hike"]).toMatchObject({ distanceKm: 80, surface: "mixed" });
    expect(byId["prespa-hidden-shores"]).toMatchObject({ distanceKm: 65, surface: "asphalt" });
    expect(surfaceFromRoadCondition("Gravel track")).toBe("gravel");
    expect(lengthBucket(80)).toBe("short");
    expect(lengthBucket(81)).toBe("mid");
    expect(lengthBucket(120)).toBe("mid");
    expect(lengthBucket(121)).toBe("long");
  });

  it("filters and sorts without changing the source order for the default view", async () => {
    const items = await loadRouteList();
    expect(applyRouteQuery(items, queryFromParams(new URLSearchParams())).map((item) => item.id)).toEqual(
      items.map((item) => item.id),
    );

    const easy = applyRouteQuery(items, queryFromParams(new URLSearchParams("d=easy")));
    expect(easy.map((item) => item.id)).toEqual(["southern-winery-escape"]);

    const eastEasy = applyRouteQuery(items, queryFromParams(new URLSearchParams("d=easy&r=east")));
    expect(eastEasy).toEqual([]);

    const shortest = applyRouteQuery(items, queryFromParams(new URLSearchParams("sort=shortest")));
    expect(shortest[0].distanceKm).toBe(65);
    expect(shortest.at(-1)?.distanceKm).toBe(140);
  });

  it("keeps Macedonian and English catalogs in parity and uses MK plurals", () => {
    expect(catalogKeys("en")).toEqual(catalogKeys("mk"));
    expect(routeTitle("mk", "eastern-waterfalls-loop")).toBe("Источни водопади");
    expect(routeTitle("en", "pelister-peaks-hike")).toBe("Pelister Peaks Ride");
    const sample = {
      id: "x",
      region: "East" as const,
      difficulty: "Moderate" as const,
      distanceKm: 85,
      durationMin: 4,
      durationMax: 5,
      stops: 3,
      surface: "mixed" as const,
      order: 0,
    };
    expect(formatStats("mk", sample)).toBe("~85 км · 4–5 ч · 3 места");
    expect(formatStats("en", { ...sample, stops: 1 })).toBe("~85 km · 4–5 h · 1 stop");
  });
});

describe("routes page", () => {
  it("renders the Macedonian list with fallback art and no hotlinked photos", async () => {
    render(
      <MemoryRouter initialEntries={["/routes"]}>
        <RoutesPage />
      </MemoryRouter>,
    );

    expect(await screen.findByRole("heading", { level: 1, name: "Сите рути" })).toBeInTheDocument();
    expect(screen.getByText("Рути за мотор")).toBeInTheDocument();
    expect(screen.queryByText("Soul Routes")).not.toBeInTheDocument();
    expect(screen.queryByText("Eastern Waterfalls Loop")).not.toBeInTheDocument();

    const card = await screen.findByRole("link", { name: /Источни водопади/ });
    expect(screen.getByText("7 рути")).toBeInTheDocument();
    expect(card).toHaveAttribute("href", "/routes/eastern-waterfalls-loop");
    expect(card.className).toMatch(/focus-visible:outline/);

    const images = document.querySelectorAll("img");
    expect(images.length).toBe(7);
    images.forEach((image) => {
      expect(image.getAttribute("src") ?? "").not.toMatch(/^https?:\/\//);
      expect(image.getAttribute("src")).toContain("/img/routes/");
    });
    expect(images[0]).toHaveAttribute("loading", "eager");
    expect(images[0]).toHaveAttribute("fetchpriority", "high");
    expect(images[1]).toHaveAttribute("loading", "lazy");
  });

  it("filters from the difficulty chips and announces the new count", async () => {
    render(
      <MemoryRouter initialEntries={["/routes"]}>
        <RoutesPage />
      </MemoryRouter>,
    );
    const easy = await screen.findByRole("button", { name: /Лесна \(1\)/ });
    expect(easy).toHaveAttribute("aria-pressed", "false");
    expect(easy.className).toContain("h-11");
    fireEvent.click(easy);
    expect(easy).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("1 од 7 рути")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Источни водопади/ })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Винарии на Демир Капија/ })).toBeInTheDocument();
  });

  it("shows the empty state and clears it", async () => {
    render(
      <MemoryRouter initialEntries={["/routes?d=easy&r=east"]}>
        <RoutesPage />
      </MemoryRouter>,
    );
    expect(await screen.findByRole("heading", { name: "Нема рути за овие филтри" })).toBeInTheDocument();
    fireEvent.click(screen.getAllByRole("button", { name: "Исчисти филтри" })[0]);
    expect(await screen.findByRole("link", { name: /Источни водопади/ })).toBeInTheDocument();
  });

  it("shows an error state and retries", async () => {
    let calls = 0;
    render(
      <MemoryRouter initialEntries={["/routes"]}>
        <RoutesPage
          loadRouteList={() => {
            calls += 1;
            if (calls === 1) return Promise.reject(new Error("offline"));
            return loadRouteList();
          }}
        />
      </MemoryRouter>,
    );
    expect(await screen.findByRole("heading", { name: "Нешто тргна наопаку" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Обиди се повторно" }));
    expect(await screen.findByRole("link", { name: /Источни водопади/ })).toBeInTheDocument();
  });
});
