/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'match': {
          bg: '#0f172a',
          component: '#1e293b',
          'component-hover': '#334155',
          accent: '#38bdf8',
          'accent-hover': '#7dd3fc',
          text: '#f8fafc',
          muted: '#94a3b8',
          border: '#334155',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'match': '0 4px 24px -4px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05)',
        'match-glow': '0 0 20px -4px rgba(56, 189, 248, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out both',
        'button-enter': 'fadeIn 0.4s ease-out both',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
