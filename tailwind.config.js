/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#080C14',
          card: '#0D1424',
          surface: '#111B30',
          border: '#1E293B',
          accent: '#38BDF8',
          emerald: '#10B981',
          rose: '#F43F5E',
          purple: '#A855F7',
          amber: '#F59E0B',
        },
        telegram: {
          blue: '#24A1DE',
          dark: '#17212B',
          darker: '#0E1621',
          surface: '#242F3D',
          hover: '#2B5278',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 15px rgba(56, 189, 248, 0.2)' },
          '100%': { boxShadow: '0 0 25px rgba(56, 189, 248, 0.5)' },
        }
      }
    },
  },
  plugins: [],
}
