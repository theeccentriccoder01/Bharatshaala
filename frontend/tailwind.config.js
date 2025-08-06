/** @type {import('tailwindcss').Config} */
const withMT = require('@material-tailwind/react/utils/withMT');

module.exports = withMT({
  content: [
    "./src/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        'brsl_cream': '#FAEBC8',
        'brsl_ochre': '#E17D00',
        'brsl_brick': '#AF3200',
        'brsl_mahogany': '#641900',
        'brsl_vine': '#649619',
        'brsl_moss': '#4B6419',
        // Add Tailwind Emerald palette
        emerald: {
          50:  '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        }
      },
      fontFamily: {
        'bharatshaala': ['"Suranna"', 'serif'],
        'body': ['"Cormorant Garamond"', 'serif'],
        'hindi': ['"Noto Sans Devanagari"', 'sans-serif'],
        'english': ['Inter', 'sans-serif'],
        'mono': ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/line-clamp'),
  ],
});