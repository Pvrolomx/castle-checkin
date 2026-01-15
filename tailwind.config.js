/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        castle: {
          gold: '#C9A227',
          cream: '#F5F1E6',
          dark: '#1A1A1A',
          sand: '#E8DCC4'
        }
      }
    }
  },
  plugins: [],
}
