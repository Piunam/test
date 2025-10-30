/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        sand: {
          50: '#fdfaf6',
          100: '#f6ede1',
          200: '#e6d4b8',
          300: '#d6bb8f',
          400: '#c6a367',
          500: '#b5893d',
          600: '#936e30',
          700: '#705222',
          800: '#4e3714',
          900: '#2c1d07'
        },
        teal: {
          100: '#e6f6f4',
          300: '#8bd4ca',
          500: '#2a9d8f',
          700: '#1f6f66'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    }
  }
};
