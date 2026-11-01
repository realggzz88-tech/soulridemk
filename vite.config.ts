import { copyFileSync } from "fs";
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

/** Project Pages has no SPA rewrite, so unknown paths must serve the built app. */
function spaFallbackPlugin(): Plugin {
  return {
    name: "spa-fallback",
    apply: "build",
    closeBundle() {
      if (githubPagesBase() === "/") return;
      const dist = path.resolve(__dirname, "dist");
      copyFileSync(path.join(dist, "index.html"), path.join(dist, "404.html"));
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
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("@supabase")) return "supabase";
          if (id.includes("framer-motion")) return "motion";
          if (id.includes("@radix-ui")) return "radix";
          if (id.includes("react-dom") || id.includes("react-router") || id.includes("/react/")) return "react";
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
