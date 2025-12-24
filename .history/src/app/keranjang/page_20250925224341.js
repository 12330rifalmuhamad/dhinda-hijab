// src/app/keranjang/page.js
"use client";

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function CartPage() {
  const { cartItems } = useCart(); // Ambil item dari context

  // Hitung subtotal
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 py-12 min-h-screen">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Keranjang Belanja Anda</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-20 border border-dashed rounded-lg">
            <p className="text-gray-500">Keranjang Anda masih kosong.</p>
            <Link href="/" className="mt-4 inline-block bg-gray-900 text-white px-6 py-2 rounded-md hover:bg-gray-700">
              Mulai Belanja
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Kolom Kiri: Daftar Item */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center bg-white p-4 border rounded-lg">
                  <div className="relative h-24 w-24 rounded-md overflow-hidden mr-4">
                    <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-gray-500">Kuantitas: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-lg">
                    Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                  </p>
                </div>
              ))}
            </div>

            {/* Kolom Kanan: Ringkasan Pesanan */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 border rounded-lg sticky top-24">
                <h2 className="text-2xl font-bold mb-4">Ringkasan Pesanan</h2>
                <div className="flex justify-between text-lg mb-2">
                  <span>Subtotal</span>
                  <span>Rp {subtotal.toLocaleString('id-ID')}</span>
                </div>
                <p className="text-sm text-gray-500 mb-6">
                  Pajak dan ongkos kirim akan dihitung saat checkout.
                </p>
                <button className="w-full bg-gray-900 text-white py-3 rounded-md hover:bg-gray-700 font-semibold">
                  Lanjut ke Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}