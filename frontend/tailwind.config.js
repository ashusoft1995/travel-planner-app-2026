/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}", "./context/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          950: "#06152a",
          900: "#082046",
          800: "#0b2c5f",
          700: "#103a7a",
          600: "#184a97",
          500: "#1f5bb5"
        },
        accent: {
          yellow: "#f4c430",
          green: "#2aa65a"
        }
      }
    }
  },
  plugins: []
};

