// src/app/layout.js
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/cartContext"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Dhinda Hijab",
  description: "Toko Hijab Online",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}