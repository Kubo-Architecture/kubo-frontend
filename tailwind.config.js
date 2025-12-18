// tailwind.config.js
module.exports = {
  purge: [],
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
      }
    },
  },
  variants: {},
  plugins: [],
  future: {},
}