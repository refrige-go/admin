/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: "class",
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    colors: {
      primary: {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a',
      },
      secondary: {
        50: '#f8fafc',
        100: '#f1f5f9',
        200: '#e2e8f0',
        300: '#cbd5e1',
        400: '#94a3b8',
        500: '#64748b',
        600: '#475569',
        700: '#334155',
        800: '#1e293b',
        900: '#0f172a',
      },
      blue: {
        200: '#e1f5fa',
        300: '#46caeb',
        400: '#3cacc8',
        500: '#e5f3fb',
        600: '#0085db',
        700: '#0071ba'
      },
      teal: {
        400: "#dffff3",
        500: '#4bd08b',
        600: '#40b176',
      },
      yellow: {
        400: "#fff6ea",
        500: '#f8c076',
        600: '#d7a564',
      },
      red: {
        400: "#ffede9",
        500: '#fb977d',
        600: '#d5806a',
      },
      gray: {
        100: '#e6ecf1',
        200: '#e7ecf0',
        300: '#0000008c',
        400: '#707a82',
        500: '#111c2d',
        600: '#c4c9cc',
        700: '#5f686f',
        800: '#e2e4e6',
      },
      "transparent": 'transparent',
      "surface": '#f0f5f9',
      "white": "#fff",
    },

    fontFamily: {
      sans: ['Inter', 'sans-serif'],
    },
    borderRadius: {
      none: "0px",
      sm: '2px',
      md: "6px",
      full: "50%",
      "2xl": "16px",
      "3xl": "24px",
    },
    extend: {
      boxShadow: {
        sm: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
        DEFAULT: "1px 2px 4px -2px rgba(16, 24, 40, 0.1), 1px 4px 8px -2px rgba(16, 24, 40, 0.1)",
        md: "0px 2px 6px rgba(37,83,185,0.1)",
        xl: "inset 0 1px 2px rgba(90,106,133,0.075)",
      },
    },
    container: {
      center: true,
      padding: "1rem",
    },
  },
  variants: {},
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
