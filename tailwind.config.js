/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF6B35',
          light: '#FF8A5C',
          dark: '#E5531E',
        },
        secondary: {
          DEFAULT: '#2196F3',
          light: '#64B5F6',
          dark: '#1976D2',
        },
        accent: {
          DEFAULT: '#FFC107',
          light: '#FFD54F',
          dark: '#FFA000',
        },
        status: {
          success: '#27AE60',
          error: '#E74C3C',
          warning: '#F39C12',
          info: '#2196F3',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          background: '#F7F7F8',
          border: '#EBEBEB',
        },
        text: {
          primary: '#1A1A2E',
          secondary: '#6B7280',
          disabled: '#BDBDBD',
          inverse: '#FFFFFF',
        },
      },
      borderRadius: {
        'sm': '6px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        'full': '9999px',
      },
      boxShadow: {
        'light': '0 2px 8px rgba(0, 0, 0, 0.06)',
        'medium': '0 4px 12px rgba(0, 0, 0, 0.10)',
        'heavy': '0 8px 20px rgba(0, 0, 0, 0.14)',
        'tabbar': '0 -6px 16px rgba(0, 0, 0, 0.07)',
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
}
