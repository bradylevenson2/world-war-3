/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'war-red': '#DC2626',
        'war-dark': '#111827',
        'war-gray': '#374151',
      },
      fontFamily: {
        'military': ['Orbitron', 'monospace'],
      },
      animation: {
        'pulse-urgent': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'countdown': 'pulse 2s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
