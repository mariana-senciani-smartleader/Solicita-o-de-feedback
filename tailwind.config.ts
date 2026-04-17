import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
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
        sans: ["Inter", "sans-serif"],
        display: ["Inter", "sans-serif"],
      },

      /* ─── SmartLeader Design System 4.0 ─── */
      colors: {
        border:     "hsl(var(--border))",
        input:      "hsl(var(--input))",
        ring:       "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        primary: {
          DEFAULT:    "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT:    "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT:    "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT:    "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT:    "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT:    "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT:    "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        /* Brand blue scale (SmartLeader DS 4.0) */
        brand: {
          25:  "#F5FAFF",
          50:  "#EFF8FF",
          100: "#D1E9FF",
          200: "#B2DDFF",
          300: "#84CAFF",
          400: "#53B1FD",
          500: "#2E90FA",
          600: "#1570EF",
          700: "#175CD3",
          800: "#1849A9",
          900: "#194185",
          950: "#2C1C5F",
        },

        /* Gray scale (SmartLeader DS 4.0) */
        gray: {
          25:  "#FDFDFD",
          50:  "#FAFAFA",
          100: "#F5F5F5",
          200: "#E9EAEB",
          300: "#D5D7DA",
          400: "#A4A7AE",
          500: "#717680",
          600: "#535862",
          700: "#414651",
          800: "#252B37",
          900: "#181D27",
          950: "#0A0D12",
        },

        /* Semantic states */
        error: {
          25:  "#FFFBFA",
          50:  "#FEF3F2",
          100: "#FEE4E2",
          200: "#FECDCA",
          300: "#FDA29B",
          400: "#F97066",
          500: "#F04438",
          600: "#D92D20",
          700: "#B42318",
        },
        warning: {
          50:  "#FFFAEB",
          100: "#FEF0C7",
          200: "#FEDF89",
          300: "#FEC84B",
          400: "#FDB022",
          500: "#F79009",
          600: "#DC6803",
          700: "#B54708",
        },
        success: {
          50:  "#ECFDF3",
          100: "#DCFAE6",
          200: "#ABEFC6",
          300: "#75E0A7",
          400: "#47CD89",
          500: "#17B26A",
          600: "#079455",
          700: "#067647",
        },

        /* App-specific aliases */
        navbar: {
          DEFAULT:    "hsl(var(--navbar-bg))",
          foreground: "hsl(var(--navbar-foreground))",
        },
        "blue-link":     "hsl(var(--blue-link))",
        "channel-active": "hsl(var(--channel-active-bg))",
        "badge-new":     "hsl(var(--badge-new))",

        sidebar: {
          DEFAULT:              "hsl(var(--sidebar-background))",
          foreground:           "hsl(var(--sidebar-foreground))",
          primary:              "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent:               "hsl(var(--sidebar-accent))",
          "accent-foreground":  "hsl(var(--sidebar-accent-foreground))",
          border:               "hsl(var(--sidebar-border))",
          ring:                 "hsl(var(--sidebar-ring))",
        },
      },

      /* Border radius (DS 4.0 tokens) */
      borderRadius: {
        none: "0rem",
        xxs:  "0.125rem",
        xs:   "0.25rem",
        sm:   "0.375rem",
        md:   "0.5rem",
        lg:   "0.625rem",
        xl:   "0.75rem",
        "2xl": "1rem",
        "3xl": "1.25rem",
        "4xl": "1.5rem",
        full:  "9999px",
      },

      /* Spacing additions */
      spacing: {
        "xxs":  "2px",
        "xs":   "4px",
        "sm-space": "6px",
        "md-space": "8px",
        "lg-space": "12px",
        "xl-space": "16px",
      },

      /* Font sizes (DS 4.0 tokens) */
      fontSize: {
        "text-xs": ["12px", { lineHeight: "18px" }],
        "text-sm": ["14px", { lineHeight: "20px" }],
        "text-md": ["16px", { lineHeight: "24px" }],
        "text-lg": ["18px", { lineHeight: "28px" }],
        "text-xl": ["20px", { lineHeight: "30px" }],
        "display-xs": ["24px", { lineHeight: "32px" }],
        "display-sm": ["30px", { lineHeight: "38px" }],
        "display-md": ["36px", { lineHeight: "44px" }],
        "display-lg": ["48px", { lineHeight: "60px" }],
      },

      /* Animations */
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to:   { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to:   { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up":   "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
