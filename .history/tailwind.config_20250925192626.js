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
          'cream': '#FFFBF5',           // Latar belakang utama yang hangat
          'brand-pink': '#FADCD9',     // Warna pink lembut untuk aksen
          'brand-pink-dark': '#F8C8C3',// Versi lebih gelap untuk hover
          'brand-text': '#5C4B4B',      // Warna teks utama (coklat tua)
          'brand-text-light': '#8D7B7B',// Warna teks sekunder (coklat lebih muda)
          'brand-dark': '#4F3F3F',      // Warna gelap untuk footer
        },
        backgroundImage: {
          "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
          "gradient-conic":
            "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        },
      },
    },
    plugins: [],
  };