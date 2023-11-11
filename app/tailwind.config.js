/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      animation: {
        orbit: 'spin 4s linear forwards infinite',
        orbit2: 'spin 7s linear reverse infinite',
        orbit3: 'spin 9s linear forwards infinite',
        orbit4: 'spin 10s linear reverse infinite'
      }
    }
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: ['light', 'dark']
  }
};
