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
      {/* Ganti 'bg-cream' dengan kode hex #FFFBF5 */}
      {/* Ganti 'text-brand-text' dengan kode hex #5C4B4B */}
      <body className={`${inter.className} bg-[#FFFBF5] text-[#5C4B4B]`}>
        {children}
      </body>
    </html>
  );
}