// components/Footer.js

import Link from 'next/link';
import Image from 'next/image'; // <-- 1. Import Image
import { Instagram, Facebook, Youtube } from 'lucide-react';
import { FaCcVisa, FaCcMastercard, FaRegCreditCard } from 'react-icons/fa';
import { SiWebmoney } from 'react-icons/si'; // Anda bisa ganti dengan ikon lain jika perlu

export default function Footer() {
  return (
    // 2. Sesuaikan warna tema
    <footer className="bg-[#4F3F3F] text-gray-300">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          <div className="lg:col-span-1">
            {/* 1. Gunakan logo gambar agar konsisten */}
            <Link href="/">
              <Image 
                src="/img/logo.png" 
                alt="Dhinda Hijab Logo" 
                width={140}
                height={40}
                className="h-10 w-auto"
              />
            </Link>
            <p className="mt-4 text-sm text-gray-400">Elegance in Every Drape. Discover modest fashion that reflects your inner strength and style.</p>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white">Jelajahi</h4>
            <ul className="mt-4 space-y-3">
              <li><Link href="/collections/new-arrivals" className="hover:text-white transition-colors">Koleksi Baru</Link></li>
              <li><Link href="/collections/hijabs" className="hover:text-white transition-colors">Hijabs</Link></li>
              <li><Link href="/collections/abayas" className="hover:text-white transition-colors">Abayas</Link></li>
              <li><Link href="/collections/best-sellers" className="hover:text-white transition-colors">Paling Laris</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white">Bantuan</h4>
            <ul className="mt-4 space-y-3">
              <li><Link href="/faq" className="hover:text-white transition-colors">Tanya Jawab (FAQ)</Link></li>
              <li><Link href="/how-to-order" className="hover:text-white transition-colors">Cara Pemesanan</Link></li>
              <li><Link href="/shipping-info" className="hover:text-white transition-colors">Info Pengiriman</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Hubungi Kami</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-white">Dapatkan Info Spesial</h4>
            <p className="mt-4 text-sm text-gray-400">Jadilah yang pertama tahu tentang koleksi baru dan penawaran eksklusif.</p>
            <form className="mt-4 flex">
              <input 
                type="email" 
                placeholder="Email Anda" 
                className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-l-md focus:outline-none focus:ring-2 focus:ring-brand-pink/50"
              />
              <button className="bg-[#FADCD9] text-[#5C4B4B] px-4 py-2 rounded-r-md font-semibold hover:bg-[#F8C8C3] transition-colors">
              Daftar
              </button>
            </form>
            <div className="mt-6 flex space-x-4">
              <Link href="#" aria-label="Instagram" className="hover:text-white transition-colors"><Instagram /></Link>
              <Link href="#" aria-label="Facebook" className="hover:text-white transition-colors"><Facebook /></Link>
              <Link href="#" aria-label="YouTube" className="hover:text-white transition-colors"><Youtube /></Link>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-700 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-400 text-center sm:text-left">
            &copy; {new Date().getFullYear()} Dhinda Hijab. All Rights Reserved.
          </p>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0 text-3xl text-gray-500">
            <FaCcVisa />
            <FaCcMastercard />
            <SiWebmoney />
            <FaRegCreditCard />
          </div>
        </div>
      </div>
    </footer>
  );
}