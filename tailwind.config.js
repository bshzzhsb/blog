module.exports = {
  content: ['./app/**/*.{ts,tsx}'],
  darkMode: 'class',
  plugins: [],
  theme: {
    extend: {
      colors: {
        'dark-bg': 'var(--color-dark-bg)',
      },
    },
    screens: {
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
    fontFamily: {
      sans: ['wotfard', 'system-ui'],
      mono: ['jetbrains mono'],
    },
  },
};
