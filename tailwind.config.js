/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0b0f14',
          900: '#0f141c',
          850: '#131a24',
          800: '#18212e',
          700: '#22303f',
          600: '#33465a',
          500: '#5b7186',
          400: '#8ba0b3',
          300: '#b6c6d3',
          200: '#dbe5ec',
          100: '#eef3f7',
          50: '#f7fafc'
        },
        accent: {
          DEFAULT: '#22d3ee',
          soft: '#67e8f9',
          deep: '#0891b2',
          glow: 'rgba(34,211,238,0.35)'
        },
        ember: { DEFAULT: '#fb923c', deep: '#ea580c' },
        lime: { DEFAULT: '#a3e635' }
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif']
      },
      boxShadow: {
        glow: '0 0 24px -4px rgba(34,211,238,0.45)',
        card: '0 10px 30px -12px rgba(0,0,0,0.55)'
      },
      backgroundImage: {
        'hero-grid':
          'linear-gradient(rgba(34,211,238,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.06) 1px, transparent 1px)',
        'animated-gradient':
          'linear-gradient(120deg,#0b0f14,#123047,#0b0f14,#2a1240,#0b0f14)'
      },
      backgroundSize: { animated: '400% 400%' },
      animation: {
        gradient: 'gradientShift 14s ease infinite',
        floaty: 'floaty 7s ease-in-out infinite',
        marquee: 'marquee 38s linear infinite'
      },
      keyframes: {
        gradientShift: {
          '0%,100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' }
        },
        floaty: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } }
      }
    }
  },
  plugins: []
};
