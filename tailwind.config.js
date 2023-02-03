const { typewindTransforms } = require("typewind/transform");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: {
    files: [
      "./app/**/*.{js,ts,jsx,tsx}",
      "./pages/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    transform: typewindTransforms,
  },
  theme: {
    extend: {},
  },
  plugins: [],
};
