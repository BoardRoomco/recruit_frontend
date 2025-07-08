/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        violet: '#594CE9',
        corePurple: '#4D3EF0',
        softLavender: '#E8E6FC',
        graphite: '#383838',
      },
      fontFamily: {
        fustat: ['Fustat', 'sans-serif'],
        dmsans: ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 