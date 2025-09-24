// components/Navbar.js

import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-gray-800">
          Dhinda Hijab
        </Link>
        <div className="flex space-x-6">
          <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
            Beranda
          </Link>
          <Link href="/produk" className="text-gray-600 hover:text-gray-900 transition-colors">
            Produk
          </Link>
          <Link href="/tentang" className="text-gray-600 hover:text-gray-900 transition-colors">
            Tentang Kami
          </Link>
        </div>
      </nav>
    </header>
  );
}