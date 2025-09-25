"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Minus, Plus } from 'lucide-react';

import { useCart } from '@/context/CartContext'; // <-- 1. Impor useCart

export default function ProductView({ product }) {
  const { addToCart } = useCart(); // <-- 2. Ambil fungsi addToCart
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    // 3. Panggil fungsi addToCart dengan data produk dan kuantitas
    addToCart(product, quantity);
  };

  if (!product) {
    return <div className="text-center text-gray-500 py-10">Produk tidak ditemukan.</div>;
  }
  return (
    <main className="container mx-auto px-4 sm:px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Kolom Gambar */}
        <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Kolom Detail & Aksi */}
        <div className="flex flex-col">
          <Link href={`/collections/${product.category.name.toLowerCase()}`} className="text-sm text-gray-500 hover:underline">
            {product.category.name}
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mt-2">{product.name}</h1>
          <p className="text-3xl text-gray-800 mt-4">Rp {product.price.toLocaleString('id-ID')}</p>
          
          <div className="w-full h-px bg-gray-200 my-8"></div>

          <p className="text-gray-600 leading-relaxed">{product.description}</p>

          <div className="mt-8 flex items-center gap-4">
            <p className="font-semibold">Kuantitas:</p>
            <div className="flex items-center border border-gray-300 rounded-md">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-2 text-gray-600 hover:bg-gray-100"><Minus size={16} /></button>
              <span className="px-4 font-semibold">{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)} className="p-2 text-gray-600 hover:bg-gray-100"><Plus size={16} /></button>
            </div>
          </div>

          <button onClick={handleAddToCart} className="mt-8 w-full flex items-center justify-center gap-3 bg-gray-900 text-white py-3 rounded-md hover:bg-gray-700 transition-colors font-semibold">
            <ShoppingBag size={20} />
            Tambah ke Keranjang
          </button>
        </div>
      </div>
    </main>
  );
}