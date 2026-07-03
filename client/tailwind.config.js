/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          300: '#f5d76e',
          400: '#e8c340',
          500: '#D4AF37',
          600: '#b8941e',
          700: '#9a7a10',
        },
        dark: {
          900: '#0a0a0f',
          800: '#0f0f16',
          700: '#111118',
          600: '#1a1a24',
          500: '#222230',
          400: '#2e2e3e',
        }
      },
      fontFamily: {
        amharic: ['"Noto Sans Ethiopic"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 1s ease forwards',
        'fade-up': 'fadeUp 0.8s ease forwards',
        'pulse-gold': 'pulseGold 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:    { from: { opacity: '0' },                        to: { opacity: '1' } },
        fadeUp:    { from: { opacity: '0', transform: 'translateY(30px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        pulseGold: { '0%,100%': { boxShadow: '0 0 20px rgba(212,175,55,0.3)' }, '50%': { boxShadow: '0 0 40px rgba(212,175,55,0.7)' } },
        float:     { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
      }
    }
  },
  plugins: []
}
