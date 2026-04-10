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
          50:  '#fbf7f1',
          100: '#f7ebdd',
          200: '#ebd5bb',
          300: '#dbbc95',
          400: '#cea579',
          500: '#bc8c61',
          600: '#a2724c',
          700: '#84583c',
          800: '#66432f',
          900: '#483024',
          950: '#211612',
        },
        crimson: {
          DEFAULT: '#70433A',
          deep:    '#402520',
          glow:    '#A26B5A',
        },
        void: '#040505',
        ash:  '#0C0E0E',
        bone: '#F4EEE4',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body:    ['"EB Garamond"', 'Georgia', 'serif'],
        label:   ['"Cormorant SC"', '"Cormorant"', 'serif'],
      },
      backgroundImage: {
        'ember-radial': 'radial-gradient(ellipse at 50% 80%, #a2724c 0%, #483024 32%, #040505 70%)',
        'ember-top':    'radial-gradient(ellipse at 50% 0%, #bc8c61 0%, #66432f 38%, #040505 76%)',
        'gold-glow':    'radial-gradient(ellipse at 50% 50%, #e6c89b 0%, #a2724c 48%, transparent 80%)',
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
