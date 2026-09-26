import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-devanagari)", "var(--font-inter)", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        heading: ["var(--font-rozha)", "var(--font-devanagari)", "Georgia", "serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        navy: {
          950: "#07090f",
          900: "#0b0e17",
          850: "#0f1320",
          800: "#131728",
          700: "#1b2138",
          600: "#262e4e",
          500: "#36416d",
        },
        gold: {
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#f5c518",
          500: "#e5b842",
          600: "#d4af37",
          700: "#b89125",
        },
        mystic: {
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          900: "#2e1065",
        },
      },
      backgroundImage: {
        "celestial-gradient": "radial-gradient(ellipse at top, #1a2038 0%, #0b0e17 60%, #07090f 100%)",
        "gold-shimmer": "linear-gradient(135deg, #f5c518 0%, #e5b842 50%, #d4af37 100%)",
        "gold-border": "linear-gradient(135deg, rgba(229, 184, 66, 0.4), rgba(139, 92, 246, 0.2), rgba(229, 184, 66, 0.05))",
      },
      boxShadow: {
        "gold-glow": "0 0 25px -5px rgba(229, 184, 66, 0.25)",
        "gold-glow-lg": "0 0 45px -5px rgba(229, 184, 66, 0.35)",
        "mystic-glow": "0 0 25px -5px rgba(139, 92, 246, 0.25)",
      },
      screens: {
        'xs': '375px',
      },
    },
  },
  plugins: [],
};
export default config;
