/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pirate: {
          dark: '#140c08',
          espresso: '#23140c',
          coffee: '#3e2414',
          wood: '#5c381e',
          parchment: '#f4e8d3',
          parchmentDark: '#d9c4a5',
          gold: '#d4af37',
          goldBright: '#ffd700',
          bronze: '#b87333',
          crimson: '#8b0000',
        }
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'serif'],
        mono: ['Fira Code', 'monospace'],
      }
    },
  },
  plugins: [],
}
