/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,html}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        aeris: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#0B0F17',
        },
        cyan: {
          glow: '#22D3EE',
          deep: '#0891B2',
          dark: '#164E63'
        },
        thermal: {
          500: '#F59E0B',
          600: '#D97706',
          alert: '#EF4444'
        },
        pressure: {
          500: '#06B6D4',
          600: '#0891B2'
        },
        humidity: {
          500: '#3B82F6',
          600: '#2563EB'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Space Mono', 'Consolas', 'monospace']
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.25)',
        'glow-coral': '0 0 25px -5px rgba(239, 68, 68, 0.25)',
        'surface': '0 10px 30px -10px rgba(0, 0, 0, 0.1)',
        'surface-dark': '0 20px 40px -15px rgba(0, 0, 0, 0.5)'
      },
      backgroundImage: {
        'grid-pattern': "radial-gradient(circle, rgba(148, 163, 184, 0.12) 1px, transparent 1px)",
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      backgroundSize: {
        'grid-sm': '24px 24px',
        'grid-md': '32px 32px'
      }
    },
  },
  plugins: [],
}
