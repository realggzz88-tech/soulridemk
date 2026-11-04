import { copyFileSync, mkdirSync, readFileSync } from "fs";
import path from "path";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import { componentTagger } from "lovable-tagger";

function githubPagesBase(): string {
  const raw = process.env.VITE_BASE?.trim() || "/";
  if (raw === "/") return "/";
  const withLeading = raw.startsWith("/") ? raw : `/${raw}`;
  return withLeading.endsWith("/") ? withLeading : `${withLeading}/`;
}

function quotedIds(file: string): string[] {
  const source = readFileSync(path.resolve(__dirname, file), "utf8");
  return [...source.matchAll(/id:\s*"([^"]+)"/g)].map((match) => match[1]);
}

/**
 * GitHub Pages has no SPA rewrite. Unknown URLs get 404.html (status 404).
 * Known screens are also copied to path.html so those URLs return 200.
 */
function spaFallbackPlugin(): Plugin {
  return {
    name: "spa-fallback",
    apply: "build",
    closeBundle() {
      const dist = path.resolve(__dirname, "dist");
      const index = path.join(dist, "index.html");
      copyFileSync(index, path.join(dist, "404.html"));
      if (githubPagesBase() === "/") return;
      const pages = [
        "routes.html",
        "spots.html",
        "about.html",
        "login.html",
        "signup.html",
        "chat.html",
        "profile.html",
        ...quotedIds("src/data/routes.ts").map((id) => `routes/${id}.html`),
        ...quotedIds("src/data/spots.ts").map((id) => `spots/${id}.html`),
      ];
      for (const page of pages) {
        const target = path.join(dist, page);
        mkdirSync(path.dirname(target), { recursive: true });
        copyFileSync(index, target);
        const slashDir = path.join(dist, page.replace(/\.html$/, ""));
        mkdirSync(slashDir, { recursive: true });
        copyFileSync(index, path.join(slashDir, "index.html"));
      }
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: githubPagesBase(),
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger(), spaFallbackPlugin()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Do not set manualChunks. Stage 1 split React into its own chunk and the
    // app crashed on load because other chunks ran before React initialized.
    // Leaflet, framer-motion, and Supabase are split with dynamic import().
  },
}));
