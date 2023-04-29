/** @type {import('tailwindcss').Config} */
import colors from "tailwind/colors";
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    fontFamily: {
      'display': ["Libre Baskerville", "Baskerville", "Times New Roman"],
      'body': ["Libre Franklin", "Helvetica", "Arial"]
    },
    extend: {
      animation: {
        'fade': '1s ease-in-out 2s 1 normal both running fadeIn'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 }
        }
      },
      colors: {
      }
    },
  },
  plugins: [],
}
