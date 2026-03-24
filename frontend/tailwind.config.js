/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Quicksand', 'sans-serif'],
      },
      colors: {
        ivory: '#faf7f2',
        parchment: '#f5f0e8',
        'parchment-2': '#ede6d8',
        cream: '#fefcf8',
        rose: { DEFAULT: '#f2c4b8', mid: '#e8a090', deep: '#d4705a' },
        sage: { DEFAULT: '#b8cdb8', mid: '#8aaa8a', deep: '#5a7a5a' },
        sky: '#bdd4e8',
        lavender: '#d4cce8',
        gold: '#d4a864',
        ink: { DEFAULT: '#2a2420', mid: '#5c5048', soft: '#8a8078', ghost: '#b8b0a8' },
        border: { DEFAULT: '#e8e0d4', soft: '#f0e8e0' },
      },
      backgroundImage: {
        'line-texture': 'repeating-linear-gradient(transparent, transparent 27px, rgba(232,224,212,0.25) 27px, rgba(232,224,212,0.25) 28px)',
      },
      keyframes: {
        riseIn: { from: { opacity: 0, transform: 'translateY(24px) scale(0.98)' }, to: { opacity: 1, transform: 'translateY(0) scale(1)' } },
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideIn: { from: { opacity: 0, transform: 'translateX(16px)' }, to: { opacity: 1, transform: 'translateX(0)' } },
      },
      animation: {
        riseIn: 'riseIn 0.5s cubic-bezier(0.22,1,0.36,1) both',
        fadeIn: 'fadeIn 0.2s ease both',
        slideIn: 'slideIn 0.22s ease both',
      },
    },
  },
  plugins: [],
}
