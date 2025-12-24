// src/components/Navbar.js
"use client"; // Navbar perlu menjadi Client Component untuk mengakses useCart

import Link from 'next/link';
import Image from 'next/image';
import { Search, User, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext'; // <-- 1. Impor useCart

export default function Navbar() {
  const { cartItems } = useCart(); // <-- 2. Ambil data keranjang

  // Hitung total item di keranjang
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="w-full bg-white/80 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-200">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/">
          <Image src="/img/logo.png" alt="Dhinda Hijab Logo" width={140} height={40} className="h-10 w-auto" priority />
        </Link>

        <nav className="hidden md:flex items-center gap-x-8">
          {/* ... link navigasi ... */}
        </nav>

        <div className="flex items-center gap-x-6">
          {/* ... search & user icon ... */}

          {/* 3. Ubah tombol keranjang menjadi Link dan tampilkan jumlah item */}
          <Link href="/keranjang" className="relative text-gray-600 hover:text-gray-900 transition-colors">
            <ShoppingBag size={24} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}