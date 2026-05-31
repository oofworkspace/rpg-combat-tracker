/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Matches the inline style: "'Crimson Pro', 'Georgia', serif"
        serif: ['"Crimson Pro"', 'Georgia', 'serif'],
      },
      colors: {
        // Tailwind's zinc/amber/red palette covers everything the dashboard
        // uses. No custom colours are required. Extend here if you add more.
      },
      keyframes: {
        'fade-in': {
          '0%':   { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%':       { opacity: '0.5' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.2s ease-out both',
        pulse:     'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite',
      },
    },
  },
  plugins: [],
}
