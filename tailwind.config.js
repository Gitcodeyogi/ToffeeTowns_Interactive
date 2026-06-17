/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        brand: ['"Luckiest Guy"', 'cursive'],
        sans: ['"Inter"', 'sans-serif'],
        body: ['"Libre Baskerville"', 'serif'],
      },
    },
  },
  plugins: [],
}
