/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f7fa',
          100: '#e4e8f0',
          200: '#c5d0e2',
          300: '#97add0',
          400: '#6382b7',
          500: '#42639a',
          600: '#324e7e',
          700: '#293f66',
          800: '#253757',
          900: '#222f4b',
        },
      },
    },
  },
  plugins: [],
}
