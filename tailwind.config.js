/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        fredoka: ['Fredoka', 'Nunito', 'sans-serif'],
        nunito: ['Nunito', 'sans-serif'],
      },
      colors: {
        chalkboard: {
          dark: '#142a20',
          DEFAULT: '#1c382b',
          light: '#254b3a',
        },
        wood: {
          light: '#a4683c',
          DEFAULT: '#854d27',
          dark: '#5a3215',
        }
      },
      boxShadow: {
        'chunky': '0 5px 0 0 rgba(0, 0, 0, 0.18)',
        'chunky-sm': '0 3px 0 0 rgba(0, 0, 0, 0.15)',
        'wood': '0 8px 0 #5a3215, 0 16px 24px rgba(0, 0, 0, 0.25)',
        'board': '0 10px 0 #5a3215, 0 20px 30px rgba(0, 0, 0, 0.25)',
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-8px)' },
          '40%, 80%': { transform: 'translateX(8px)' },
        },
        pop: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '70%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { transform: 'scale(1)', filter: 'drop-shadow(0 0 4px rgba(239, 68, 68, 0.6))' },
          '50%': { transform: 'scale(1.15)', filter: 'drop-shadow(0 0 12px rgba(239, 68, 68, 0.9))' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-8px) scale(1.02)' },
        },
        cheer: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '25%': { transform: 'translateY(-5px) rotate(-2deg)' },
          '75%': { transform: 'translateY(-5px) rotate(2deg)' },
        }
      },
      animation: {
        shake: 'shake 0.4s ease-in-out',
        pop: 'pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        pulseGlow: 'pulseGlow 0.8s ease-in-out infinite',
        float: 'float 2.5s ease-in-out infinite',
        floatSlow: 'floatSlow 4s ease-in-out infinite',
        cheer: 'cheer 2s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
