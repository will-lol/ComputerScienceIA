/** @type {import('tailwindcss').Config} */
import colors from "tailwind/colors";
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    fontFamily: {
      'display': ["Libre Baskerville", "Baskerville", "Times New Roman"],
      'body': ["Libre Franklin", "Helvetica", "Arial"],
      'mono': ["'IBM Plex Mono'", "ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", '"Liberation Mono"', '"Courier New"', "monospace"],
      'ipod': ["'Myriad'", "'Myraid Pro'", "'Noto Sans'"]
    },
    extend: {
      boxShadow: {
        'xs': '0 0.15rem 0 0px rgba(0,0,0,0.2)'
      },
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
        'praiseTheSun': '#f4f3d8'
      },
      aspectRatio: {
        'ipod': '2.4 / 4.1'
      }
    },
  },
  plugins: [],
}
