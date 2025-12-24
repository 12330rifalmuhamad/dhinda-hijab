"use client";
import Link from 'next/link';
import Image from 'next/image';
import { Search, User, ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '@/context/cartContext';
import { useState } from 'react';

export default function Navbar() {
  const { cartItems } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="w-full bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-soft-pink-200 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image 
              src="/img/logo.png" 
              alt="Dhinda Hijab Logo" 
              width={140} 
              height={40} 
              className="h-10 w-auto hover:scale-105 transition-transform duration-200" 
              priority 
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-x-8">
            <Link 
              href="/collections/pashmina" 
              className="text-soft-pink-700 hover:text-brand-primary font-medium transition-colors duration-200 relative group"
            >
              Pashmina
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-primary transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <Link 
              href="/collections/bergo" 
              className="text-soft-pink-700 hover:text-brand-primary font-medium transition-colors duration-200 relative group"
            >
              Bergo
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-primary transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <Link 
              href="/collections/square" 
              className="text-soft-pink-700 hover:text-brand-primary font-medium transition-colors duration-200 relative group"
            >
              Square
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-primary transition-all duration-200 group-hover:w-full"></span>
            </Link>
          </nav>

          {/* Right side icons */}
          <div className="flex items-center gap-x-4">
            {/* Search Icon */}
            <button className="p-2 text-soft-pink-700 hover:text-brand-primary hover:bg-soft-pink-50 rounded-full transition-all duration-200">
              <Search size={20} />
            </button>

            {/* User Icon */}
            <button className="p-2 text-soft-pink-700 hover:text-brand-primary hover:bg-soft-pink-50 rounded-full transition-all duration-200">
              <User size={20} />
            </button>

            {/* Cart Icon */}
            <Link 
              href="/keranjang" 
              className="relative p-2 text-soft-pink-700 hover:text-brand-primary hover:bg-soft-pink-50 rounded-full transition-all duration-200"
            >
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold animate-bounce-gentle">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button 
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 text-soft-pink-700 hover:text-brand-primary hover:bg-soft-pink-50 rounded-full transition-all duration-200"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 py-4 border-t border-soft-pink-200 animate-slide-up">
            <nav className="flex flex-col space-y-4">
              <Link 
                href="/collections/pashmina" 
                className="text-soft-pink-700 hover:text-brand-primary font-medium py-2 px-4 hover:bg-soft-pink-50 rounded-lg transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pashmina
              </Link>
              <Link 
                href="/collections/bergo" 
                className="text-soft-pink-700 hover:text-brand-primary font-medium py-2 px-4 hover:bg-soft-pink-50 rounded-lg transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Bergo
              </Link>
              <Link 
                href="/collections/square" 
                className="text-soft-pink-700 hover:text-brand-primary font-medium py-2 px-4 hover:bg-soft-pink-50 rounded-lg transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Square
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}