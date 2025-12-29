"use client";
import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Facebook, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { FaCcVisa, FaCcMastercard, FaRegCreditCard } from 'react-icons/fa';
import { SiWebmoney } from 'react-icons/si';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();

  // Hide Footer on admin pages
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-gradient-to-br from-soft-pink-900 via-rose-900 to-soft-pink-800 text-soft-pink-100">
      <div className="container mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block">
              <Image 
                src="/img/logo.png" 
                alt="Dhinda Hijab Logo" 
                width={140}
                height={40}
                className="h-12 w-auto hover:scale-105 transition-transform duration-200"
              />
            </Link>
            <p className="mt-4 text-sm text-soft-pink-200 leading-relaxed">
              Elegance in Every Drape. Discover modest fashion that reflects your inner strength and style.
            </p>
            
            {/* Contact Info */}
            <div className="mt-6 space-y-2">
              <div className="flex items-center gap-2 text-sm text-soft-pink-200">
                <Phone size={16} />
                <span>+62 812-3456-7890</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-soft-pink-200">
                <Mail size={16} />
                <span>info@dhindahijab.com</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-soft-pink-200">
                <MapPin size={16} />
                <span>Jakarta, Indonesia</span>
              </div>
            </div>
          </div>

          {/* Collections */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Koleksi</h4>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/collections/pashmina" 
                  className="text-soft-pink-200 hover:text-white transition-colors duration-200 hover:translate-x-1 transform inline-block"
                >
                  Pashmina
                </Link>
              </li>
              <li>
                <Link 
                  href="/collections/bergo" 
                  className="text-soft-pink-200 hover:text-white transition-colors duration-200 hover:translate-x-1 transform inline-block"
                >
                  Bergo
                </Link>
              </li>
              <li>
                <Link 
                  href="/collections/square" 
                  className="text-soft-pink-200 hover:text-white transition-colors duration-200 hover:translate-x-1 transform inline-block"
                >
                  Square
                </Link>
              </li>
              <li>
                <Link 
                  href="/collections/best-sellers" 
                  className="text-soft-pink-200 hover:text-white transition-colors duration-200 hover:translate-x-1 transform inline-block"
                >
                  Paling Laris
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Bantuan</h4>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/faq" 
                  className="text-soft-pink-200 hover:text-white transition-colors duration-200 hover:translate-x-1 transform inline-block"
                >
                  Tanya Jawab (FAQ)
                </Link>
              </li>
              <li>
                <Link 
                  href="/how-to-order" 
                  className="text-soft-pink-200 hover:text-white transition-colors duration-200 hover:translate-x-1 transform inline-block"
                >
                  Cara Pemesanan
                </Link>
              </li>
              <li>
                <Link 
                  href="/shipping-info" 
                  className="text-soft-pink-200 hover:text-white transition-colors duration-200 hover:translate-x-1 transform inline-block"
                >
                  Info Pengiriman
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="text-soft-pink-200 hover:text-white transition-colors duration-200 hover:translate-x-1 transform inline-block"
                >
                  Hubungi Kami
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Newsletter</h4>
            <p className="text-sm text-soft-pink-200 mb-4">
              Jadilah yang pertama tahu tentang koleksi baru dan penawaran eksklusif.
            </p>
            <form className="space-y-3">
              <input 
                type="email" 
                placeholder="Email Anda" 
                className="w-full px-4 py-3 bg-soft-pink-800/50 text-white border border-soft-pink-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent placeholder-soft-pink-300"
              />
              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-brand-primary to-brand-secondary text-white px-4 py-3 rounded-lg font-semibold hover:from-brand-secondary hover:to-brand-primary transition-all duration-200 transform hover:scale-105"
              >
                Daftar Newsletter
              </button>
            </form>
            
            {/* Social Media */}
            <div className="mt-6">
              <h5 className="text-sm font-semibold text-white mb-3">Ikuti Kami</h5>
              <div className="flex space-x-4">
                <Link 
                  href="#" 
                  aria-label="Instagram" 
                  className="p-2 bg-soft-pink-800/50 rounded-full hover:bg-brand-primary hover:scale-110 transition-all duration-200"
                >
                  <Instagram size={20} />
                </Link>
                <Link 
                  href="#" 
                  aria-label="Facebook" 
                  className="p-2 bg-soft-pink-800/50 rounded-full hover:bg-brand-primary hover:scale-110 transition-all duration-200"
                >
                  <Facebook size={20} />
                </Link>
                <Link 
                  href="#" 
                  aria-label="YouTube" 
                  className="p-2 bg-soft-pink-800/50 rounded-full hover:bg-brand-primary hover:scale-110 transition-all duration-200"
                >
                  <Youtube size={20} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-soft-pink-700/50">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-soft-pink-300 text-center sm:text-left">
              &copy; {new Date().getFullYear()} Dhinda Hijab. All Rights Reserved.
            </p>
            <div className="flex items-center space-x-4 text-2xl text-soft-pink-400">
              <FaCcVisa className="hover:text-white transition-colors duration-200" />
              <FaCcMastercard className="hover:text-white transition-colors duration-200" />
              <SiWebmoney className="hover:text-white transition-colors duration-200" />
              <FaRegCreditCard className="hover:text-white transition-colors duration-200" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}