"use client";
import Link from "next/link";
import Image from "next/image";
import { Search, User, ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/context/cartContext";
import { useState } from "react";
import { usePathname } from 'next/navigation';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import CustomerLoginModal from "./CustomerLoginModal";

export default function Navbar({ categories = [] }) {
  const pathname = usePathname();
  const { getTotalItems } = useCart();
  const { data: session } = useSession();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const totalItems = getTotalItems();

  // Hide Navbar on admin pages
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleUserClick = () => {
    if (session) {
      router.push('/profile');
    } else {
      setIsLoginOpen(true);
    }
  };

  const navLinks = categories.length > 0
    ? categories.map(cat => ({
      name: cat.name.toUpperCase(),
      href: `/collections/${cat.name.toLowerCase().replace(/\s+/g, '-')}`
    }))
    : [
      { name: "ALL PRODUCTS", href: "/collections/all" },
    ];

  return (
    <>
      {/* Placeholder to prevent layout shift */}
      <div className="h-[120px] w-full block"></div>

      <CustomerLoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={() => { }}
      />

      <header className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md shadow-sm transition-all duration-300">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col">
            {/* Main Header Row: Logo & Icons */}
            <div className="flex justify-between items-center py-4 relative">
              {/* Left Side: Mobile Menu & Placeholder */}
              <div className="flex-1 flex justify-start items-center gap-4">
                <button
                  onClick={toggleMobileMenu}
                  className="lg:hidden p-2 text-[#4a4042] hover:text-[#dca5ad] transition-colors"
                >
                  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Logo Placeholder */}
                <div className="hidden lg:block relative w-20 h-20">
                  <Image
                    src="/img/logo.JPEG"
                    alt="Logo"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Logo (Center) */}
              <div className="flex-1 flex justify-center py-2">
                <Link href="/" className="flex flex-col items-center">
                  {/* Mobile Logo Image */}
                  <div className="lg:hidden relative w-20 h-20">
                    <Image src="/img/logo.JPEG" alt="Logo" fill className="object-contain" />
                  </div>

                  {/* Desktop Logo Text */}
                  <div className="hidden lg:flex flex-col items-center">
                    <span className="text-3xl font-serif tracking-[0.15em] text-[#4a4042] whitespace-nowrap">
                      DHINDA HIJAB
                    </span>
                    <span className="block text-[10px] tracking-[0.4em] text-[#dca5ad] font-medium mt-1 uppercase">
                      Modern Muslim Wear
                    </span>
                  </div>
                </Link>
              </div>

              {/* Right Icons */}
              <div className="flex-1 flex justify-end items-center gap-x-2 md:gap-x-4">
                <button
                  onClick={handleUserClick}
                  className="p-2 text-[#4a4042] hover:text-[#dca5ad] transition-colors flex items-center gap-2"
                >
                  {session?.user?.image ? (
                    <img src={session.user.image} alt="User" className="w-6 h-6 rounded-full border border-gray-200" />
                  ) : (
                    <User size={20} strokeWidth={1.5} />
                  )}
                  {session?.user && <span className="hidden md:inline text-xs font-medium uppercase tracking-wider">{session.user.name?.split(' ')[0]}</span>}
                </button>
              </div>
            </div>

            {/* Navigation Links (Desktop) */}
            <nav className="hidden lg:flex justify-center items-center py-3 border-t border-gray-100">
              <ul className="flex flex-wrap justify-center gap-x-8">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-[11px] font-bold tracking-[0.15em] text-[#4a4042] hover:text-[#dca5ad] transition-colors uppercase relative group"
                    >
                      {link.name}
                      <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#dca5ad] transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-lg animate-slide-up z-50 h-screen">
              <nav className="flex flex-col p-6 space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-[#4a4042] hover:text-[#dca5ad] font-medium text-lg py-2 border-b border-gray-50 tracking-wide flex justify-between items-center group"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                    <span className="text-[#dca5ad] opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </Link>
                ))}
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
