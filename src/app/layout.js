import { Montserrat } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/cartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import prisma from "@/lib/prisma";

import PopupBanner from "@/components/PopupBanner";

import AuthProvider from "@/components/AuthProvider";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata = {
  title: "Dhinda Hijab Official",
  description: "Toko Hijab Online Modern dan Berkualitas",
};

export default async function RootLayout({ children }) {
  // Fetch categories for the Navbar
  let categories = [];
  try {
    categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc'
      }
    });
  } catch (error) {
    console.error("Failed to fetch categories during build:", error);
    // Continue with empty categories to allow build to finish
  }

  return (
    <html lang="id">
      <body className={`${montserrat.variable} font-sans`}>
        <AuthProvider>
          <CartProvider>
            <PopupBanner />
            <Navbar categories={categories} />
            {children}
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}