/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  mode: 'jit',
  theme: {
    boxShadow: {
      none: 'none',
    },
    extend: {
      container: {
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1290px',
          '2xl': '1290px',
        },
        padding: {
          DEFAULT: '1.25rem',
          sm: '1.25rem',
          lg: '35px',
          xl: '0px',
          '2xl': '0px',
        },
        center: true,
      },
      fontFamily: {
        ['sledge-font-family-1']: ['inter'],
        ['sledge-font-family-2']: [
          'Cabinet Grotesk Variable',
          '-apple-system',
          'BlinkMacSystemFont',
          'San Francisco',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'sans-serif',
        ],
        ['sledge-font-family-3']: [
          'Satoshi',
          '-apple-system',
          'BlinkMacSystemFont',
          'San Francisco',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'sans-serif',
        ],
        ['sledge-font-family-4']: [
          'Poppins',
          '-apple-system',
          'BlinkMacSystemFont',
          'San Francisco',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'sans-serif',
        ],
      },
      colors: {
        'sledge-color-primary-black': 'var(--sledge-color-primary-black)',

        'sledge-color-primary-red-1': 'var(--sledge-color-primary-red-1)',
        'sledge-color-primary-red-2': 'var(--sledge-color-primary-red-2)',
        'sledge-color-primary-red-3': 'var(--sledge-color-primary-red-3)',
        'sledge-color-primary-red-4': 'var(--sledge-color-primary-red-4)',
        'sledge-color-primary-red-5': 'var(--sledge-color-primary-red-5)',

        'sledge-color-primary-green-1': 'var(--sledge-color-primary-green-1)',
        'sledge-color-primary-green-2': 'var(--sledge-color-primary-green-2)',
        'sledge-color-primary-green-3': 'var(--sledge-color-primary-green-3)',
        'sledge-color-primary-green-4': 'var(--sledge-color-primary-green-4)',
        'sledge-color-primary-green-5': 'var(--sledge-color-primary-green-5)',

        'sledge-color-text-hover': 'var(--sledge-color-text-hover)',

        'sledge-color-grey-1': 'var(--sledge-color-grey-1)',
        'sledge-color-grey-2': 'var(--sledge-color-grey-2)',
        'sledge-color-grey-3': 'var(--sledge-color-grey-3)',
        'sledge-color-grey-4': 'var(--sledge-color-grey-4)',
        'sledge-color-grey-5': 'var(--sledge-color-grey-5)',
        'sledge-color-grey-6': 'var(--sledge-color-grey-6)',
        'sledge-color-grey-7': 'var(--sledge-color-grey-7)',
        'sledge-color-grey-8': 'var(--sledge-color-grey-8)',
        'sledge-color-grey-9': 'var(--sledge-color-grey-9)',

        'sledge-color-yellow-1': 'var(--sledge-color-yellow-1)',
        'sledge-color-yellow-2': 'var(--sledge-color-yellow-2)',
        'sledge-color-yellow-3': 'var(--sledge-color-yellow-3)',

        'sledge-color-text-primary': 'var(--sledge-color-text-primary)',

        'sledge-color-text-secondary-1': 'var(--sledge-color-text-secondary-1)',
        'sledge-color-text-secondary-2': 'var(--sledge-color-text-secondary-2)',
        'sledge-color-text-secondary-3': 'var(--sledge-color-text-secondary-3)',
        'sledge-color-text-secondary-4': 'var(--sledge-color-text-secondary-4)',
        'sledge-color-text-secondary-5': 'var(--sledge-color-text-secondary-5)',
        'sledge-color-text-secondary-6': 'var(--sledge-color-text-secondary-6)',
        'sledge-color-text-secondary-7': 'var(--sledge-color-text-secondary-7)',
        'sledge-color-text-secondary-8': 'var(--sledge-color-text-secondary-8)',
      },
    },
  },

  plugins: [require('@tailwindcss/forms')],
};
