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
      },
      fontFamily: {
        'bharatshaala': ['"Suranna"', 'serif'],
        'body': ['"Cormorant Garamond"', 'serif'],
      },
    },
  },
  plugins: [],
});
