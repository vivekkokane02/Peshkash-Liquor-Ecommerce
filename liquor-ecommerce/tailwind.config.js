/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: 'rgb(var(--ink) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        surface2: 'rgb(var(--surface-2) / <alpha-value>)',
        gold: 'rgb(var(--gold) / <alpha-value>)',
        goldSoft: 'rgb(var(--gold-soft) / <alpha-value>)',
        burgundy: 'rgb(var(--burgundy) / <alpha-value>)',
        bone: 'rgb(var(--bone) / <alpha-value>)',
        stone: 'rgb(var(--stone) / <alpha-value>)',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.35em',
      },
      backgroundImage: {
        'gold-foil': 'linear-gradient(90deg, transparent, #C9A227 50%, transparent)',
      },
    },
  },
  plugins: [],
};
