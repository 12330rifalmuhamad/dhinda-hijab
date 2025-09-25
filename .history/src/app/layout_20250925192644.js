// app/layout.js

import { Inter } from "next/font/google";
import "./globals.css";

// Tambahkan weight '900' untuk font-black
const inter = Inter({ subsets: ["latin"], weight: ["400", "700", "900"] });

export const metadata = {
  title: "Dhinda Hijab Official Website",
  description: "Modest Fashion for the modern soul.",
};

// src/app/layout.js
// ...
export default function RootLayout({ children }) {
  return (
    <html lang="id">
      {/* Ganti bg-white menjadi bg-cream dan text-gray-900 menjadi text-brand-text */}
      <body className={`${inter.className} bg-cream text-brand-text`}>
        {children}
      </body>
    </html>
  );
}