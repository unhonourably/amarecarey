/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
      colors: {
        canvas: "#000000",
        ink: {
          50: "#F2F2F2",
          100: "#E0E0E0",
          200: "#B8B8B8",
          300: "#888888",
          400: "#5C5C5C",
          500: "#3F3F3F",
          600: "#1A1A1A",
          700: "#0F0F0F",
          800: "#080808",
          900: "#000000",
        },
        accent: {
          DEFAULT: "#A3A3A3",
          muted: "#6B6B6B",
        },
      },
      maxWidth: {
        reading: "42rem",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "fade-in": "fade-in 0.5s ease-out forwards",
      },
    },
  },
  plugins: [],
};
