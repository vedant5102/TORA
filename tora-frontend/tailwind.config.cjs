/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        toraBg: '#071021',
        toraCard: '#0b1220',
        toraAccent: '#16a34a'
      }
    },
  },
  plugins: [],
}
