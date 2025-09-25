// src/components/ProductCard.js
"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import Link from 'next/link'; // <-- 1. Import Link


export default function ProductCard({ product, index }) {
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: index * 0.1 },
    },
  };

  return (
    // 2. Bungkus semua dengan Link, arahkan ke halaman detail produk
    <Link href={`/produk/${product.id}`}> 
      <motion.div
        className="bg-white rounded-lg overflow-hidden group border border-gray-200 hover:shadow-xl transition-shadow duration-300"
        variants={cardVariants}
      >
        <div className="relative w-full aspect-square bg-gray-100">
          <Image
            src={product.imageUrl}
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