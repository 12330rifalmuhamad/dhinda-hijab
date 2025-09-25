// src/components/ProductCard.js
"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';

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
    <motion.div className="bg-white rounded-lg overflow-hidden group" variants={cardVariants}>
      <div className="relative w-full aspect-square bg-gray-100">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill // <-- Ganti layout="fill"
          className="object-cover transition-transform duration-500 group-hover:scale-105" // <-- Tambahkan object-cover
        />
        <button className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full text-gray-800 hover:bg-white transition-colors">
          <ShoppingBag size={20} />
        </button>
      </div>
      <div className="p-4 text-center">
        <h3 className="font-semibold text-gray-800">{product.name}</h3>
        <p className="text-gray-500 mt-1">Rp {product.price}</p>
      </div>
    </motion.div>
  );
}