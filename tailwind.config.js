/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        primary: '#167B9B',
        'primary-dark': '#155E75',
        secondary: '#1E1E1E',
        muted: '#6B7280'
      }
    }
  },
  plugins: []
};
