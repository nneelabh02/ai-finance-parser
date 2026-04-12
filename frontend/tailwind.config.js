/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brutal: {
          bg: '#e5e5e5',      // Gritty light gray background
          dark: '#0f0f0f',    // Harsh black
          accent: '#ff003c',  // Aggressive neon red/pink for CTA buttons
        }
      },
      boxShadow: {
        // This gives us that classic hard-shadow brutalist look
        'hard': '6px 6px 0px 0px #0f0f0f',
        'hard-sm': '3px 3px 0px 0px #0f0f0f',
      }
    },
  },
  plugins: [],
}