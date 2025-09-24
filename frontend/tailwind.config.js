/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#D9D9D9',
          100: '#BCBCBC',
          200: '#B2B2B2',
          300: '#B2B2B2',
          400: '#9E9E9E',
          500: '#959595',
          600: '#8B8B8B',
          700: '#818181',
          800: '#777777',
          900: '#6D6D6D',
        },
      },
    },
  },
  plugins: [],
};
