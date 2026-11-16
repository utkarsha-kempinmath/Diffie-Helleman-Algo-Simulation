/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          50: '#FDFCF7',
          100: '#F7F5EE',
          200: '#EFECE1',
          300: '#E1DDCF',
          400: '#C7C2B2',
          500: '#A49F8F',
          800: '#2A2925',
          900: '#1A1916',
        },
        stone: {
          850: '#211E1C',
          950: '#141210',
        },
        // Warm Terracotta / Rust for Alice
        rust: {
          50: '#FDF6F3',
          100: '#F9ECE5',
          200: '#F2D7CA',
          500: '#C85A32',
          600: '#B04B26',
          700: '#8E3A1C',
          800: '#6C2B14',
          900: '#4D1E0E',
        },
        // Forest / Sage Olive for Bob
        olive: {
          50: '#F4F7F4',
          100: '#E5EDE5',
          200: '#CBDBCB',
          500: '#3D6A52',
          600: '#315542',
          700: '#264233',
          800: '#1B2F24',
          900: '#122018',
        },
        // Warm Walnut / Ochre Amber for Eve & Shared Keys
        amberwarm: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          500: '#D97706',
          600: '#B45309',
          700: '#92400E',
          800: '#78350F',
        },
        // Charcoal Slate for public channel & eavesdropper
        charcoal: {
          50: '#F8F9FA',
          100: '#F1F3F5',
          200: '#E5E7EB',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
        }
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', '"Times New Roman"', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}
