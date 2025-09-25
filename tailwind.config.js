// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
      "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
      "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
      extend: {
        colors: {
          'cream': 'rgb(var(--color-cream) / <alpha-value>)',
          'brand-pink': 'rgb(var(--color-brand-pink) / <alpha-value>)',
          'brand-pink-dark': 'rgb(var(--color-brand-pink-dark) / <alpha-value>)',
          'brand-text': 'rgb(var(--color-brand-text) / <alpha-value>)',
          'brand-text-light': 'rgb(var(--color-brand-text-light) / <alpha-value>)',
          'brand-dark': 'rgb(var(--color-brand-dark) / <alpha-value>)',
        },
        // ... sisa extend lainnya
      },
    },
    plugins: [],
  };