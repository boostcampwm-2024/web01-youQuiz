/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#053cd5',
        secondary: '#3fe27e',
        'weak-primary': '#E5F4FF',
        text: '#1a1a1a',
        textWeak: '#525252',
        border: '#e5e5e5',
        weak: '#f5f5f5',
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
      },
      animation: {
        'progress-5s': 'progress 5s linear forwards',
        'progress-10s': 'progress 10s linear forwards',
        'progress-15s': 'progress 15s linear forwards',
        'progress-20s': 'progress 20s linear forwards',
        'progress-30s': 'progress 30s linear forwards',
        'slide-out': 'slide-out 0.5s ease-in forwards',
        'spin-slow': 'spin-slow 6s linear infinite',
      },
      keyframes: {
        progress: {
          '0%': { width: '100%' },
          '100%': { width: '0%' },
        },
        'slide-out': {
          '0%': {
            transform: 'translateX(0)',
            opacity: 1,
          },
          '20%': {
            transform: 'translateX(-10px)' /* 잠깐 왼쪽으로 이동 */,
          },
          '100%': {
            transform: 'translateX(100%)',
            opacity: 0,
          },
        },
        floatUp: {
          '0%': {
            transform: 'translateY(0)',
            opacity: 1,
          },
          '100%': {
            transform: 'translateY(-100px)',
            opacity: 0,
          },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
      },
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
