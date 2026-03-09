/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ember: {
          50:  '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
        },
        crimson: {
          DEFAULT: '#8B1A1A',
          deep:    '#5C0E0E',
          glow:    '#C0392B',
        },
        void: '#080808',
        ash:  '#1a1a1a',
        bone: '#F5F0E8',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body:    ['"EB Garamond"', 'Georgia', 'serif'],
        label:   ['"Cormorant SC"', '"Cormorant"', 'serif'],
      },
      backgroundImage: {
        'ember-radial': 'radial-gradient(ellipse at 50% 80%, #c2410c 0%, #7c2d12 30%, #080808 70%)',
        'ember-top':    'radial-gradient(ellipse at 50% 0%,  #ea580c 0%, #9a3412 40%, #080808 75%)',
        'gold-glow':    'radial-gradient(ellipse at 50% 50%, #fbbf24 0%, #c2410c 50%, transparent 80%)',
      },
      animation: {
        'fade-up':       'fadeUp 1.2s ease forwards',
        'fade-in':       'fadeIn 1.4s ease forwards',
        'glow-pulse':    'glowPulse 4s ease-in-out infinite',
        'drift':         'drift 8s ease-in-out infinite',
        'flicker':       'flicker 6s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.6' },
          '50%':      { opacity: '1' },
        },
        drift: {
          '0%, 100%': { transform: 'translateY(0px) scale(1)' },
          '50%':      { transform: 'translateY(-12px) scale(1.015)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '45%':      { opacity: '0.85' },
          '50%':      { opacity: '0.95' },
          '55%':      { opacity: '0.80' },
          '60%':      { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
