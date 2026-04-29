import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.tsx"],
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
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Montserrat"', 'system-ui', 'sans-serif'],
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body: ['"Montserrat"', 'system-ui', 'sans-serif'],
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
        // RDM Digital 2026 Brand Colors
        gold: {
          DEFAULT: "hsl(var(--gold))",
          foreground: "hsl(var(--gold-foreground))",
          400: "#D4B26A",
          500: "#C8A356",
          600: "#B8944C",
        },
        night: {
          900: "#05070A",
          800: "#0B0F16",
          700: "#101622",
          600: "#1A2332",
        },
        silver: {
          300: "#C4CCD8",
          400: "#9EA7BA",
          500: "#78819A",
          light: "hsl(var(--gold-light))",
          dark: "hsl(var(--gold-dark))",
        },
        navy: {
          DEFAULT: "hsl(var(--navy))",
          light: "hsl(var(--navy-light))",
          dark: "hsl(var(--navy-dark))",
        },
        platinum: {
          DEFAULT: "hsl(var(--platinum))",
          light: "hsl(var(--platinum-light))",
        },
        electric: {
          DEFAULT: "hsl(var(--electric))",
          light: "hsl(var(--electric-light))",
        },
        terracotta: {
          DEFAULT: "hsl(var(--terracotta))",
          light: "hsl(var(--terracotta-light))",
        },
        charcoal: {
          DEFAULT: "hsl(var(--charcoal))",
        },
        slate: {
          DEFAULT: "hsl(var(--slate))",
        },
        cream: {
          DEFAULT: "hsl(var(--cream))",
        },
        forest: {
          DEFAULT: "hsl(var(--forest))",
        },
        copper: {
          DEFAULT: "hsl(var(--copper))",
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
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px -5px hsla(210, 100%, 55%, 0.3)" },
          "50%": { boxShadow: "0 0 40px -5px hsla(210, 100%, 55%, 0.6)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fade-up 0.6s ease-out forwards",
        "fade-in": "fade-in 0.5s ease-out forwards",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
      },
      boxShadow: {
        "soft": "0 2px 20px -4px hsla(220, 45%, 18%, 0.08)",
        "medium": "0 4px 30px -6px hsla(220, 45%, 18%, 0.12)",
        "elevated": "0 8px 40px -8px hsla(220, 45%, 18%, 0.18)",
        "gold": "0 4px 20px -4px hsla(43, 80%, 55%, 0.35)",
        "electric": "0 4px 25px -4px hsla(210, 100%, 55%, 0.4)",
        "glow": "0 0 40px -10px hsla(210, 100%, 55%, 0.5)",
      },
    },
  },
  plugins: [animate],
} satisfies Config;
