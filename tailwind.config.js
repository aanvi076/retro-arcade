/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-purple': '#b026ff',
        'electric-blue': '#00d2ff',
        'hot-pink': '#ff007f',
        'retro-cyan': '#00ffff',
      },
      fontFamily: {
        'press-start': ['"Press Start 2P"', 'cursive'],
        'vt323': ['VT323', 'monospace'],
        'orbitron': ['Orbitron', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
