/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    "./app/**/*.{js,jsx,mdx}",
    "./components/**/*.{js,jsx,mdx}",
    "./lib/**/*.{js,jsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ivory: "#fffaf2",
        sand: "#f1e2c9",
        driftwood: "#8a5a36",
        ocean: "#216e82",
        surf: "#d9eef1",
        olive: "#64754f",
        tomato: "#c84b37",
        charcoal: "#24211d"
      },
      fontFamily: {
        sans: ["Inter", "Arial", "Helvetica", "sans-serif"],
        display: ["Georgia", "Cambria", "Times New Roman", "serif"]
      },
      boxShadow: {
        soft: "0 18px 45px rgba(36, 33, 29, 0.12)"
      }
    }
  },
  plugins: []
};
