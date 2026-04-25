/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          DEFAULT: '#B2AC88',
          light: '#C5C0A4',
          dark: '#938E6A',
        },
        moss: {
          DEFAULT: '#4A5D23',
          light: '#617931',
          dark: '#344118',
        },
        cream: {
          DEFAULT: '#F5F5DC',
          dark: '#E1E1C9',
        },
        rose: {
          DEFAULT: '#D8AC9C',
          light: '#E5C5BA',
          dark: '#C18F7D',
        },
        gold: {
          DEFAULT: '#C5A021',
          light: '#DBC14B',
          dark: '#A3841B',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        cursive: ['"Great Vibes"', 'cursive'],
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 1s ease-out forwards',
        'bloom': 'bloom 0.6s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        bloom: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
