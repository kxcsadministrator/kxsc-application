/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        black_bg: "#1b1c1e",
        tgray: "#a3a4a6",
        gray_bg: "#f7f7f7",
        tgray2: "#b1b2b4",
        green_bg: "#52cb83",
      },
    },
  },
  plugins: [],
};
