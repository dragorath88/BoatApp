/** @type {import('tailwindcss').Config} */
module.exports = {
  important: ":root",
  content: ["./src/**/*.{html,ts}"],
  theme: {
    screens: {
      "dm-lt-sm": "599px",
      sm: "640px",
      md: "768px",
      "dm-sm": "960px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {},
  },
  plugins: [],
};
