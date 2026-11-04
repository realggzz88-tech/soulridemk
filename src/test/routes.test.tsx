import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "@/App";

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      onAuthStateChange: (callback: (event: string, session: null) => void) => {
        callback("INITIAL_SESSION", null);
        return { data: { subscription: { unsubscribe: () => undefined } } };
      },
      getSession: async () => ({ data: { session: null } }),
      signInWithPassword: async () => ({ data: { session: null, user: null }, error: null }),
      signUp: async () => ({ data: { user: null, session: null }, error: null }),
      signOut: async () => ({ error: null }),
    },
  },
}));

async function renderAt(path: string) {
  window.history.pushState({}, "", path);
  render(<App />);
}

describe("routes", () => {
  beforeEach(() => {
    window.history.pushState({}, "", "/");
  });

  it("renders the home page", async () => {
    await renderAt("/");
    expect(await screen.findByRole("heading", { name: /Заборавените/i })).toBeInTheDocument();
    expect(await screen.findByRole("link", { name: "Истражи ги сите рути" })).toHaveAttribute("href", "/routes");
    await waitFor(() => expect(document.title).toContain("Заборавените патишта"));
  });

  it("renders the route catalog", async () => {
    await renderAt("/routes");
    expect(await screen.findByRole("heading", { level: 1, name: "Истражи ги сите рути" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Eastern Waterfalls Loop/ })).toHaveAttribute(
      "href",
      "/routes/eastern-waterfalls-loop",
    );
  });

  it("renders the spots list without mounting the map", async () => {
    await renderAt("/spots");
    expect(await screen.findByRole("heading", { name: "Explore Spots" })).toBeInTheDocument();
    expect(await screen.findByRole("button", { name: "Прикажи ја картата" })).toBeInTheDocument();
    expect(document.querySelector(".leaflet-container")).toBeNull();
    await waitFor(() => expect(document.title).toContain("Места за возење"));
  });

  it("renders a known spot", async () => {
    await renderAt("/spots/galicica-pass");
    expect(await screen.findByRole("heading", { name: "Galicica Pass" })).toBeInTheDocument();
  });

  it("renders a missing spot as not found", async () => {
    await renderAt("/spots/not-a-real-spot");
    expect(await screen.findByRole("heading", { name: "Spot Not Found" })).toBeInTheDocument();
  });

  it("renders a known route", async () => {
    await renderAt("/routes/eastern-waterfalls-loop");
    expect(
      await screen.findByRole("heading", { level: 1, name: "Eastern Waterfalls Loop" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Vodoča Monastery" })).toBeInTheDocument();
  });

  it("renders the about page", async () => {
    await renderAt("/about");
    expect(await screen.findByRole("heading", { name: "За SoulRide" })).toBeInTheDocument();
  });

  it("renders login", async () => {
    await renderAt("/login");
    expect(await screen.findByRole("heading", { name: "Добредојде назад" })).toBeInTheDocument();
  });

  it("renders signup", async () => {
    await renderAt("/signup");
    expect(await screen.findByRole("heading", { name: "Приклучи се на возењето" })).toBeInTheDocument();
  });

  it("sends guests from the community page to login", async () => {
    await renderAt("/chat");
    expect(await screen.findByRole("heading", { name: "Добредојде назад" })).toBeInTheDocument();
  });

  it("renders an unknown path as the lost-road page", async () => {
    await renderAt("/nowhere");
    expect(await screen.findByRole("heading", { name: "404" })).toBeInTheDocument();
    expect(screen.getByText(/Изгубен на: \/nowhere/)).toBeInTheDocument();
    await waitFor(() => {
      expect(document.querySelector('meta[name="robots"]')?.getAttribute("content")).toContain("noindex");
    });
  });

  it("gives public pages distinct titles", async () => {
    const expected: Record<string, string> = {
      "/": "Заборавените патишта",
      "/spots": "Места за возење",
      "/spots/galicica-pass": "Galicica Pass",
      "/routes": "Рути низ Северна Македонија",
      "/routes/eastern-waterfalls-loop": "Eastern Waterfalls Loop",
      "/about": "За SoulRide",
      "/login": "Најава",
    };
    const titles: string[] = [];
    for (const [path, fragment] of Object.entries(expected)) {
      window.history.pushState({}, "", path);
      render(<App />);
      await screen.findByRole("heading", { level: 1 });
      await waitFor(() => expect(document.title).toContain(fragment));
      titles.push(document.title);
      cleanup();
    }
    expect(new Set(titles).size).toBe(titles.length);
    await renderAt("/login");
    await waitFor(() => {
      expect(document.querySelector('meta[name="robots"]')?.getAttribute("content")).toContain("noindex");
    });
  });
});
