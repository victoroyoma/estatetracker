export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0E6D31', // Nigerian green
          50: '#E6F4EA',
          100: '#CCEAD5',
          200: '#99D5AB',
          300: '#66C082',
          400: '#33AB58',
          500: '#0E6D31',
          600: '#0B5727',
          700: '#08411D',
          800: '#052C14',
          900: '#03160A',
        },
        secondary: {
          DEFAULT: '#1E40AF', // Trust blue
          50: '#E6EEFB',
          100: '#CCDEF7',
          200: '#99BCEF',
          300: '#669BE7',
          400: '#3379DF',
          500: '#1E40AF',
          600: '#18338C',
          700: '#122669',
          800: '#0C1A46',
          900: '#060D23',
        },
        accent: {
          DEFAULT: '#F59E0B', // Energy yellow/orange
          50: '#FEF5E7',
          100: '#FDEBCF',
          200: '#FBD69F',
          300: '#F9C26F',
          400: '#F7AD3F',
          500: '#F59E0B',
          600: '#C47E09',
          700: '#935F07',
          800: '#623F04',
          900: '#312002',
        },
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'system-ui', 'sans-serif'],
      },
      screens: {
        'xs': '320px',
      },
      boxShadow: {
        'soft': '0 2px 10px rgba(0, 0, 0, 0.05)',
        'medium': '0 4px 20px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
}