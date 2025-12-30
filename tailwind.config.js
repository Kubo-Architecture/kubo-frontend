/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
      },
      screens: {
        'desktop-portrait': {
          'raw': '(min-height: 481px) and (max-width: 944px)'
        },
        'large-screen': {
          'raw': '(min-height: 700px) and (min-width: 760px)'
        }
      },
      animation: {
        'fade': 'fade 2.5s ease-in-out infinite',
      },
      keyframes: {
        fade: {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}