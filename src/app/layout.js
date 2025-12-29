import { Playfair_Display, Lato } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/cartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import prisma from "@/lib/prisma";

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: '--font-playfair',
  display: 'swap',
});

const lato = Lato({ 
  weight: ['100', '300', '400', '700', '900'],
  subsets: ["latin"],
  variable: '--font-lato',
  display: 'swap',
});

export const metadata = {
  title: "Dhinda Hijab",
  description: "Toko Hijab Online Modern dan Berkualitas",
};

export default async function RootLayout({ children }) {
  // Fetch categories for the Navbar
  const categories = await prisma.category.findMany({
    orderBy: {
      name: 'asc'
    }
  });

  return (
    <html lang="id">
      <body className={`${playfair.variable} ${lato.variable} font-sans`}>
        <CartProvider>
          <Navbar categories={categories} />
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}