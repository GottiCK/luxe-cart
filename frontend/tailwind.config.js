/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1C1815',
        bone: '#F6F3EE',
        cloud: '#EDE9E1',
        wine: '#7C2438',
        'wine-dark': '#5E1A29',
        brass: '#B08D57',
        stone: '#6B655D',
        sage: '#3F6B4C',
      },
      fontFamily: {
        display: ['"Bodoni Moda"', 'Georgia', 'serif'],
        sans: ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        content: '1440px',
      },
    },
  },
  plugins: [],
};
