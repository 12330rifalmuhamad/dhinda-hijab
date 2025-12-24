import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Dhinda Hijab",
  description: "Toko Hijab Online Modern dan Berkualitas",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <CartProvider>
          <Navbar />
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}