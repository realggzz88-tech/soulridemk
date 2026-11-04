// SoulRide Tailwind theme extension v1.0 (Tailwind 3.4, shadcn/ui).
// Usage in tailwind.config.ts:
//   import { soulrideTheme } from "./design/tailwind.tokens.js";   // or copy this file into src/styles/
//   export default { darkMode: ["class"], content: [...],
//     theme: { container: soulrideTheme.container, screens: soulrideTheme.screens, extend: soulrideTheme.extend },
//     plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")] } satisfies Config;
// Requires the CSS variables in tokens.css.

const c = (name) => `hsl(var(--${name}) / <alpha-value>)`;
const solid = (name) => `hsl(var(--${name}))`; // for tokens that already carry alpha

export const soulrideTheme = {
  screens: {
    xs: "390px",   // reference phone
    sm: "640px",
    md: "768px",   // tablet portrait: top header replaces bottom nav
    lg: "1024px",
    xl: "1280px",
    "2xl": "1440px",
  },
  container: {
    center: true,
    padding: { DEFAULT: "1rem", sm: "1.5rem", lg: "2rem" },
    screens: { "2xl": "1280px" },
  },
  extend: {
    fontFamily: {
      display: ['"Manrope"', "system-ui", "sans-serif"],
      sans: ['"Inter"', "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
      script: ['"Caveat"', "cursive"],
      mono: ['"JetBrains Mono"', "ui-monospace", "SFMono-Regular", "monospace"],
    },
    fontSize: {
      // [size, { lineHeight, letterSpacing, fontWeight }]
      "display-xl": ["clamp(2.5rem, 1.6rem + 4.5vw, 4.5rem)", { lineHeight: "1.05", letterSpacing: "-0.03em", fontWeight: "800" }],
      "display-lg": ["clamp(2rem, 1.5rem + 2.5vw, 3.25rem)", { lineHeight: "1.1", letterSpacing: "-0.025em", fontWeight: "800" }],
      h1: ["clamp(1.875rem, 1.5rem + 1.8vw, 2.75rem)", { lineHeight: "1.15", letterSpacing: "-0.02em", fontWeight: "700" }],
      h2: ["clamp(1.5rem, 1.3rem + 1vw, 2rem)", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "700" }],
      h3: ["1.25rem", { lineHeight: "1.3", letterSpacing: "-0.01em", fontWeight: "700" }],
      h4: ["1.0625rem", { lineHeight: "1.4", letterSpacing: "-0.005em", fontWeight: "600" }],
      "body-lg": ["1.125rem", { lineHeight: "1.65" }],
      body: ["1rem", { lineHeight: "1.6" }],
      "body-sm": ["0.875rem", { lineHeight: "1.55" }],
      caption: ["0.8125rem", { lineHeight: "1.45", letterSpacing: "0.005em" }],
      overline: ["0.75rem", { lineHeight: "1.3", letterSpacing: "0.12em", fontWeight: "600" }],
      tagline: ["1.375rem", { lineHeight: "1.3" }], // Caveat only, never below 1.25rem
    },
    colors: {
      border: c("border"),
      input: c("input"),
      ring: c("ring"),
      background: c("background"),
      foreground: c("foreground"),
      primary: { DEFAULT: c("primary"), foreground: c("primary-foreground"), hover: c("primary-hover"), active: c("primary-active") },
      secondary: { DEFAULT: c("secondary"), foreground: c("secondary-foreground") },
      destructive: { DEFAULT: c("destructive"), foreground: c("destructive-foreground") },
      muted: { DEFAULT: c("muted"), foreground: c("muted-foreground") },
      accent: { DEFAULT: c("accent"), foreground: c("accent-foreground") },
      popover: { DEFAULT: c("popover"), foreground: c("popover-foreground") },
      card: { DEFAULT: c("card"), foreground: c("card-foreground") },
      success: { DEFAULT: c("success"), foreground: c("success-foreground") },
      warning: { DEFAULT: c("warning"), foreground: c("warning-foreground") },
      info: { DEFAULT: c("info"), foreground: c("info-foreground") },
      difficulty: {
        easy: { DEFAULT: c("difficulty-easy"), bg: solid("difficulty-easy-bg") },
        moderate: { DEFAULT: c("difficulty-moderate"), bg: solid("difficulty-moderate-bg") },
        challenging: { DEFAULT: c("difficulty-challenging"), bg: solid("difficulty-challenging-bg") },
      },
      region: { DEFAULT: c("region"), bg: solid("region-bg") },
      brand: {
        ember: c("brand-ember"),
        "ember-deep": c("brand-ember-deep"),
        lake: c("brand-lake"),
        pine: c("brand-pine"),
        sand: c("brand-sand"),
        stone: c("brand-stone"),
      },
      rating: c("rating"),
      scrim: c("scrim"),
      sidebar: {
        DEFAULT: solid("sidebar-background"),
        foreground: solid("sidebar-foreground"),
        primary: solid("sidebar-primary"),
        "primary-foreground": solid("sidebar-primary-foreground"),
        accent: solid("sidebar-accent"),
        "accent-foreground": solid("sidebar-accent-foreground"),
        border: solid("sidebar-border"),
        ring: solid("sidebar-ring"),
      },
    },
    spacing: {
      // 4px base grid; Tailwind defaults cover 0-96. Named layout tokens:
      "tap": "2.75rem",            // 44px minimum tap target
      "header": "var(--header-h)",
      "bottom-nav": "var(--bottom-nav-h)",
      "section": "4rem",           // mobile section rhythm (md: 6rem via section-lg)
      "section-lg": "6rem",
    },
    maxWidth: { content: "var(--container-max)", prose: "68ch" },
    borderRadius: {
      xl: "calc(var(--radius) + 4px)",  // 16px – cards, sheets
      lg: "var(--radius)",              // 12px – inputs, buttons (rect)
      md: "calc(var(--radius) - 4px)",  // 8px  – chips (rect), thumbnails
      sm: "calc(var(--radius) - 6px)",  // 6px  – small controls
      pill: "9999px",
    },
    boxShadow: {
      sm: "var(--shadow-sm)",
      md: "var(--shadow-md)",
      lg: "var(--shadow-lg)",
      glow: "var(--shadow-glow)",
    },
    zIndex: { map: "0", "map-controls": "10", sticky: "30", header: "40", overlay: "50", toast: "60" },
    transitionTimingFunction: {
      standard: "var(--ease-standard)",
      emphasized: "var(--ease-emphasized)",
      exit: "var(--ease-exit)",
    },
    transitionDuration: { fast: "120ms", base: "200ms", slow: "320ms", page: "400ms" },
    aspectRatio: { card: "4 / 3", hero: "16 / 9", "hero-mobile": "4 / 5", map: "16 / 10" },
    keyframes: {
      "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
      "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
      "fade-up": { "0%": { opacity: "0", transform: "translateY(12px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
      "fade-in": { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
      shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
    },
    animation: {
      "accordion-down": "accordion-down 200ms var(--ease-standard)",
      "accordion-up": "accordion-up 200ms var(--ease-standard)",
      "fade-up": "fade-up 320ms var(--ease-standard) both",
      "fade-in": "fade-in 200ms var(--ease-standard) both",
      shimmer: "shimmer 1.6s linear infinite",
    },
  },
};

export default soulrideTheme;
