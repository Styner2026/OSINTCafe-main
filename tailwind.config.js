/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cyber-blue': '#00f5ff',
        'cyber-green': '#39ff14',
        'dark-bg': '#0a0a0a',
        'dark-panel': '#1a1a1a',
        'accent-orange': '#ff6b35',
      },
      fontFamily: {
        'cyber': ['Orbitron', 'monospace'],
        'sans': ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'scroll': 'scroll 3s linear infinite',
      },
      keyframes: {
        glow: {
          '0%': { 
            'text-shadow': '0 0 5px #00f5ff, 0 0 10px #00f5ff, 0 0 15px #00f5ff',
          },
          '100%': { 
            'text-shadow': '0 0 10px #00f5ff, 0 0 20px #00f5ff, 0 0 30px #00f5ff',
          },
        },
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}
