/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#053cad',
        secondary: '#3fe27e',
        text: '#1a1a1a',
        textWeak: '#525252',
        border: '#e5e5e5',
        yellow: {
          100: '#ffdb43',
          200: '#fdb400',
          weak: '#ffdb43',
        },
        red: {
          100: '#fb3748',
          200: '#d00416',
          weak: '#fb3748',
        },
      },
      fontSize: {
        xs: '10px',
        sm: '12px',
        md: '14px',
        lg: '16px',
        xl: '20px',
      },
      fontWeight: {
        bold: '700',
        medium: '500',
      },
      fontFamily: {
        sans: ['Pretendard'],
      },
      borderRadius: {
        base: '12px',
      }
    },
  },
  plugins: [
    function ({ addUtilities, theme }) {
      addUtilities({
        '.text-weak-xs': {
          color: theme('colors.textWeak'),
          fontSize: theme('fontSize.xs'),
        },
        '.text-weak-sm': {
          color: theme('colors.textWeak'),
          fontSize: theme('fontSize.sm'),
          fontWeight: theme('fontWeight.medium'),
        },
        '.text-weak-md': {
          color: theme('colors.textWeak'),
          fontSize: theme('fontSize.md'),
          fontWeight: theme('fontWeight.medium'),
        },
        '.text-bold-sm': {
          color: theme('colors.text'),
          fontSize: theme('fontSize.sm'),
          fontWeight: theme('fontWeight.bold'),
        },
        '.text-bold-md': {
          color: theme('colors.text'),
          fontSize: theme('fontSize.md'),
          fontWeight: theme('fontWeight.bold'),
        },
        '.text-bold-lg': {
          color: theme('colors.text'),
          fontSize: theme('fontSize.lg'),
          fontWeight: theme('fontWeight.bold'),
        },
        '.text-bold-xl': {
          color: theme('colors.text'),
          fontSize: theme('fontSize.xl'),
          fontWeight: theme('fontWeight.bold'),
        },
        '.text-md-sm': {
          color: theme('colors.text'),
          fontSize: theme('fontSize.sm'),
          fontWeight: theme('fontWeight.medium'),
        },
        '.text-md-md': {
          color: theme('colors.text'),
          fontSize: theme('fontSize.md'),
          fontWeight: theme('fontWeight.medium'),
        },
        '.text-md-lg': {
          color: theme('colors.text'),
          fontSize: theme('fontSize.lg'),
          fontWeight: theme('fontWeight.medium'),
        },
        '.text-md-xl': {
          color: theme('colors.text'),
          fontSize: theme('fontSize.xl'),
          fontWeight: theme('fontWeight.medium'),
        },
      });
    },
  ],
};
