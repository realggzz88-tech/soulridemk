import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";
import typography from "@tailwindcss/typography";
import { soulrideTheme } from "./src/styles/tailwind.tokens.js";

const legacyColor = (name: string) => `hsl(var(--${name}))`;

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    screens: soulrideTheme.screens,
    container: soulrideTheme.container,
    extend: {
      ...soulrideTheme.extend,
      fontFamily: {
        ...soulrideTheme.extend.fontFamily,
        serif: ["Georgia", "serif"],
      },
      colors: {
        ...soulrideTheme.extend.colors,
        sunset: {
          DEFAULT: legacyColor("sunset-orange"),
          coral: legacyColor("sunset-coral"),
          red: legacyColor("sunset-red"),
          gold: legacyColor("sunset-gold"),
          amber: legacyColor("sunset-amber"),
        },
        teal: {
          DEFAULT: legacyColor("teal-accent"),
          glow: legacyColor("teal-glow"),
        },
        sky: {
          pink: legacyColor("sky-pink"),
          purple: legacyColor("sky-purple"),
          dusk: legacyColor("sky-dusk"),
        },
        earth: {
          brown: legacyColor("earth-brown"),
          warm: legacyColor("earth-warm"),
          road: legacyColor("road-dark"),
        },
        cream: {
          DEFAULT: legacyColor("cream-light"),
          warm: legacyColor("cream-warm"),
        },
      },
      keyframes: {
        ...soulrideTheme.extend.keyframes,
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px hsl(15 70% 50% / 0.3)" },
          "50%": { boxShadow: "0 0 40px hsl(15 70% 50% / 0.5)" },
        },
      },
      animation: {
        ...soulrideTheme.extend.animation,
        "scale-in": "scale-in 0.5s ease-out forwards",
        float: "float 6s ease-in-out infinite",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-gradient": "linear-gradient(180deg, transparent 0%, hsl(20 15% 8% / 0.3) 50%, hsl(20 15% 8% / 0.95) 100%)",
        "sunset-gradient": "linear-gradient(135deg, hsl(15 70% 50%), hsl(25 75% 55%))",
        "card-gradient": "linear-gradient(180deg, hsl(20 18% 11%) 0%, hsl(25 15% 9%) 100%)",
      },
    },
  },
  plugins: [tailwindcssAnimate, typography],
} satisfies Config;
