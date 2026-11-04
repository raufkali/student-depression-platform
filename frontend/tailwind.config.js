/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,jsx}",
    "./src/components/**/*.{js,jsx}",
    "./src/app/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        surface: "var(--surface)",
        subtle: "var(--subtle)",
        border: "var(--border)",
        muted: "var(--muted)",
        emerald: {
          accent: "var(--emerald-accent)",
          secondary: "var(--emerald-secondary)",
        },
      },
      fontFamily: {
        serif: ["'Cormorant Garamond'", "Georgia", "Cambria", "'Times New Roman'", "serif"],
        sans: ["'DM Sans'", "-apple-system", "BlinkMacSystemFont", "'Segoe UI'", "Roboto", "sans-serif"],
        editorial: ["'Manrope'", "'DM Sans'", "sans-serif"],
      },
      borderRadius: {
        none: "0px",
        sm: "2px",
      },
    },
  },
  plugins: [],
};
