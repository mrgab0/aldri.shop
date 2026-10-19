/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2a0002',
          burgundy: '#8B0024',
          modern: '#D81B60',
          dark: '#1a0001',
          light: '#fff0ef',
        },
        secondary: {
          DEFAULT: '#745b0f',
          gold: '#D4AF37',
          light: '#ffdf92',
        },
        surface: {
          DEFAULT: '#fff8f7',
          container: '#faeae9',
          high: '#f5e5e3',
        },
        carbon: '#221a19',
        stitch: {
          gold: '#F2CA50',
          champagne: '#D4AF37',
          'champagne-light': '#E5C378',
          'champagne-deep': '#C5A059',
          obsidian: '#0A0A0C',
          'surface-dark': '#131315',
          'card-dark': '#161619',
          'card-elevated': '#1A1A1F',
          'border-subtle': 'rgba(255, 255, 255, 0.08)',
          'border-gold': 'rgba(212, 175, 55, 0.35)',
          indigo: '#4F46E5',
          'light-bg': '#FAF8F5',
          'light-card': '#FFFFFF',
          'light-border': '#EAE4DC',
        },
      },
      fontFamily: {
        sans: ['var(--font-montserrat)', 'var(--font-plus-jakarta)', 'Montserrat', 'Plus Jakarta Sans', 'sans-serif'],
        serif: ['var(--font-playfair)', 'var(--font-manrope)', 'Playfair Display', 'Manrope', 'serif'],
        display: ['var(--font-playfair)', 'Playfair Display', 'serif'],
        body: ['var(--font-montserrat)', 'Montserrat', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0px 4px 20px rgba(42,0,2,0.06)',
        'premium-hover': '0px 12px 30px rgba(42,0,2,0.12)',
        'stitch-card': '0px 8px 32px rgba(0, 0, 0, 0.35)',
        'stitch-glow': '0px 0px 24px rgba(212, 175, 55, 0.25)',
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
}
