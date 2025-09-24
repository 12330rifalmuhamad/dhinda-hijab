// app/layout.js

import { Inter } from "next/font/google";
import "./globals.css";

// Tambahkan weight '900' untuk font-black
const inter = Inter({ subsets: ["latin"], weight: ["400", "700", "900"] });

export const metadata = {
  title: "Dhinda Hijab Official Website",
  description: "Modest Fashion for the modern soul.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      {/* Ganti warna background dan teks default */}
      <body className={`${inter.className} bg-white text-gray-900`}>
        {children}
      </body>
    </html>
  );
}