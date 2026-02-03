/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'media',
  content: [
    './index.html',
    './src/**/*.{js,jsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      colors: {
        primary: {
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA'
        }
      },
      boxShadow: {
        glow: '0 0 0 4px rgba(99, 102, 241, 0.15)',
        card: '0 24px 60px -30px rgba(15, 23, 42, 0.45)'
      }
    }
  },
  plugins: []
};
