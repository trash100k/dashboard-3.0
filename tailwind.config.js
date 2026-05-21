/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // enable dark mode via class
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // We can customize the dark mode colors here if needed
        // Tailwind's default dark mode is already dark, but we can adjust
        background: {
          DEFAULT: '#0f0f0f', // very dark
          100: '#1a1a1a',
          200: '#252525',
        },
        foreground: {
          DEFAULT: '#fafafa',
          100: '#e5e5e5',
        }
      },
    },
  },
  plugins: [],
}
