import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        display: ['Bitter', 'Rockwell', 'Georgia', 'serif'],
        sans: ['Libre Baskerville', 'Georgia', 'Times New Roman', 'serif'],
        body: ['Libre Baskerville', 'Georgia', 'serif'],
        typewriter: ['Special Elite', 'Courier New', 'monospace'],
        handwriting: ['Caveat', 'Brush Script MT', 'cursive'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sage: {
          DEFAULT: "hsl(var(--sage-green))",
          muted: "hsl(var(--sage-muted))",
          deep: "hsl(var(--sage-deep))",
          glow: "hsl(var(--sage-glow))",
        },
        rust: {
          DEFAULT: "hsl(var(--rust-terra))",
          sienna: "hsl(var(--rust-sienna))",
          warm: "hsl(var(--rust-warm))",
        },
        sepia: {
          gold: "hsl(var(--sepia-gold))",
          amber: "hsl(var(--sepia-amber))",
        },
        cream: {
          DEFAULT: "hsl(var(--cream-aged))",
          paper: "hsl(var(--cream-paper))",
          worn: "hsl(var(--cream-worn))",
        },
        forest: {
          floor: "hsl(var(--forest-floor))",
          deep: "hsl(var(--forest-deep))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fade-up 0.8s ease-out forwards",
        "fade-in": "fade-in 0.6s ease-out forwards",
        "scale-in": "scale-in 0.5s ease-out forwards",
        float: "float 6s ease-in-out infinite",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-gradient": "linear-gradient(180deg, hsl(200 20% 8%) 0%, hsl(180 15% 10%) 50%, hsl(25 15% 11%) 100%)",
        "card-gradient": "linear-gradient(180deg, hsl(180 15% 11%) 0%, hsl(170 18% 8%) 100%)",
        "sage-gradient": "linear-gradient(135deg, hsl(140 22% 42%), hsl(145 18% 48%))",
        "rust-gradient": "linear-gradient(135deg, hsl(20 45% 38%), hsl(25 40% 45%))",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
