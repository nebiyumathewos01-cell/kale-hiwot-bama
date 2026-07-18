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
        'fade-in':     'fadeIn 1s ease forwards',
        'fade-up':     'fadeUp 0.8s ease forwards',
        'pulse-gold':  'pulseGold 3s ease-in-out infinite',
        'float':       'float 5s ease-in-out infinite',
        'rotate-slow': 'rotateSlow 30s linear infinite',
        'glow-pulse':  'glowPulse 3s ease-in-out infinite',
        'shimmer':     'shimmer 5s linear infinite',
        'ripple':      'ripple 2.5s ease-out infinite',
      },
      keyframes: {
        fadeIn:     { from: { opacity: '0' }, to: { opacity: '1' } },
        fadeUp:     { from: { opacity: '0', transform: 'translateY(30px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        pulseGold:  { '0%,100%': { boxShadow: '0 0 20px rgba(212,175,55,0.3)' }, '50%': { boxShadow: '0 0 60px rgba(212,175,55,0.7)' } },
        float:      { '0%,100%': { transform: 'translateY(0) rotate(0deg)' }, '33%': { transform: 'translateY(-12px) rotate(1deg)' }, '66%': { transform: 'translateY(-6px) rotate(-1deg)' } },
        rotateSlow: { from: { transform: 'rotate(0deg)' }, to: { transform: 'rotate(360deg)' } },
        glowPulse:  { '0%,100%': { boxShadow: '0 0 20px rgba(212,175,55,0.25)' }, '50%': { boxShadow: '0 0 60px rgba(212,175,55,0.65), 0 0 100px rgba(212,175,55,0.25)' } },
        shimmer:    { '0%': { backgroundPosition: '0% center' }, '100%': { backgroundPosition: '300% center' } },
        ripple:     { '0%': { transform: 'scale(1)', opacity: '0.6' }, '100%': { transform: 'scale(2.5)', opacity: '0' } },
      }
    }
  },
  plugins: []
}
