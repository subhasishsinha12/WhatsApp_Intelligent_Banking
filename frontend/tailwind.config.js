/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#006644',
          whatsapp: '#25D366',
          orange: '#FF6B35',
          dark: '#1a1a2e',
          light: '#f0f2f5',
        },
      },
    },
  },
  plugins: [],
};
