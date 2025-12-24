// src/components/ProductCard.js
"use client";

import Image from 'next/image';
import Link from 'next/link'; 
import { motion } from 'framer-motion';

export default function ProductCard({ product, index }) {
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: index * 0.1 },
    },
  };

  // 1. Ambil URL gambar pertama dari array 'images'
  //    Sediakan gambar placeholder sebagai fallback jika produk tidak punya gambar
  const imageUrl = product.images && product.images.length > 0 
    ? product.images[0].url 
    : '/img/placeholder.png'; // Pastikan Anda punya file placeholder.png di public/img

  return (
    <Link href={`/produk/${product.id}`}> 
      <motion.div
        className="bg-white rounded-lg overflow-hidden group border border-gray-200 hover:shadow-xl transition-shadow duration-300"
        variants={cardVariants}
      >
        <div className="relative w-full aspect-square bg-gray-100">
          <Image
            src={imageUrl} // <-- 2. Gunakan variabel imageUrl yang sudah aman
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="p-4 text-center">
          <h3 className="font-semibold text-gray-800 truncate">{product.name}</h3>
          <p className="text-gray-500 mt-1">Rp {product.price.toLocaleString('id-ID')}</p>
        </div>
      </motion.div>
    </Link>
  );
}