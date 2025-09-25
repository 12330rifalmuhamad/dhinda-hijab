// components/Navbar.js
import Link from 'next/link';
import Image from 'next/image';
import { Search, User, ShoppingBag } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="w-full bg-[#FFF9FB]/80 backdrop-blur-sm sticky top-0 z-50 border-b border-[#FDECF4]">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/">
          <Image src="/img/logo.png" alt="Dhinda Hijab Logo" width={140} height={40} className="h-10 w-auto" priority />
        </Link>
        <nav className="hidden md:flex items-center gap-x-8">
          <Link href="/collections/hijabs" className="text-[#9E8B9E] hover:text-[#4C3B4D] transition-colors">Hijabs</Link>
          <Link href="/collections/abayas" className="text-[#9E8B9E] hover:text-[#4C3B4D] transition-colors">Abayas</Link>
          <Link href="/collections/new-arrivals" className="text-[#9E8B9E] hover:text-[#4C3B4D] transition-colors">New Arrivals</Link>
        </nav>
        <div className="flex items-center gap-x-6">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="search"
              placeholder="Search Product"
              className="pl-10 pr-4 py-2 w-48 bg-[#FDECF4] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#FBC2EB]"
            />
          </div>
          <button className="text-[#9E8B9E] hover:text-[#4C3B4D] transition-colors">
            <User size={24} />
          </button>
          <button className="text-[#9E8B9E] hover:text-[#4C3B4D] transition-colors">
            <ShoppingBag size={24} />
          </button>
        </div>
      </div>
    </header>
  );
}