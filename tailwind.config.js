/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Legacy blue scale — still used for a couple of neutral info accents.
        brand: {
          50: "#eef4ff",
          100: "#d9e6ff",
          200: "#b6ccff",
          300: "#8aa8ff",
          400: "#5c7dfa",
          500: "#3b5bdb",
          600: "#2f47b3",
          700: "#27398c",
          800: "#22316f",
          900: "#1f2c5c",
        },
        // Neo-brutalist palette: flat, saturated, no gradients.
        ink: "#171310",
        paper: "#FCF6E9",
        sun: "#FFD400",
        bubble: "#FF5C8A",
        sky: "#4C6FFF",
        leaf: "#7ED957",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        display: [
          '"Space Grotesk"',
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
      },
      boxShadow: {
        brutal: "4px 4px 0 0 #171310",
        "brutal-sm": "2px 2px 0 0 #171310",
        "brutal-lg": "7px 7px 0 0 #171310",
        "brutal-pink": "4px 4px 0 0 #FF5C8A",
        "brutal-blue": "4px 4px 0 0 #4C6FFF",
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
        wiggle: "wiggle 0.4s ease-in-out",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: 0, transform: "translateY(10px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-2deg)" },
          "50%": { transform: "rotate(2deg)" },
        },
      },
    },
  },
  plugins: [],
};
