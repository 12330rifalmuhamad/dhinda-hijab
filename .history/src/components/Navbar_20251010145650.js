// src/components/Navbar.js
"use client";
import Link from 'next/link';
import { Search, User, ShoppingBag } from 'lucide-react';

export default function Navbar() {
  const navLinks = ["BEST SELLER", "HAJI & UMRAH", "HIJAB", "SYAR'I", "COLLABORATION", "OUTFIT", "PRAYER SET", "ACCESSORIES", "NEW ARRIVAL", "CLEARANCE SALE"];

  return (
    <>
      <div className="bg-accent text-center text-sm py-2 px-4">
        FREE SHIPPING ALL OVER INDONESIA | EXCLUSIVE PRICE ONLY ON WEBSITE
      </div>
      <header className="w-full bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          {/* Sisi Kiri - Kosongkan untuk menyeimbangkan */}
          <div className="w-1/3"></div>
          
          {/* Sisi Tengah - Logo */}
          <div className="w-1/3 flex justify-center">
            <Link href="/">
              <h1 className="text-4xl font-extrabold tracking-widest">LOZY</h1>
            </Link>
          </div>

          {/* Sisi Kanan - Ikon */}
          <div className="w-1/3 flex justify-end items-center gap-x-6">
            <button><Search size={22} /></button>
            <button><User size={22} /></button>
            <button><ShoppingBag size={22} /></button>
          </div>
        </div>
        {/* Navigasi Bawah */}
        <nav className="border-t border-b border-gray-200">
          <div className="container mx-auto px-6 flex justify-center items-center gap-x-8 text-xs font-semibold tracking-wider h-12">
            {navLinks.map(link => (
              <Link key={link} href="#" className="text-text-secondary hover:text-text-primary transition-colors">{link}</Link>
            ))}
          </div>
        </nav>
      </header>
    </>
  );
}