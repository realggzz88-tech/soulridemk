import { render, screen } from "@testing-library/react";
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
    expect(screen.getByRole("link", { name: "Истражи ги сите рути" })).toHaveAttribute("href", "/routes");
  });

  it("renders the route catalog", async () => {
    await renderAt("/routes");
    expect(await screen.findByRole("heading", { level: 1, name: "Сите рути" })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Рути" })[0]).toHaveAttribute("href", "/routes");
    expect(screen.getAllByRole("link", { name: "Места" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: "Омилени" })[0]).toHaveAttribute("href", "/favorites");
    expect(screen.getByRole("link", { name: /Источни водопади/ })).toHaveAttribute(
      "href",
      "/routes/eastern-waterfalls-loop",
    );
  });

  it("renders the spots list", async () => {
    await renderAt("/spots");
    expect(await screen.findByRole("heading", { name: "Explore Spots" })).toBeInTheDocument();
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
  });
});
