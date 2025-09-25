// src/components/CategoryCard.js
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function CategoryCard({ category, index }) {
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, delay: index * 0.15, ease: "easeOut" },
    },
  };

  return (
    <motion.div variants={cardVariants}>
      <Link href={category.href} className="block relative h-96 rounded-lg overflow-hidden group">
        <Image
          src={category.imageUrl}
          alt={`Koleksi ${category.name}`}
          fill // <-- Ganti layout="fill"
          className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110" // <-- Tambahkan object-cover
        />
        <div className="absolute inset-0 bg-black/50 group-hover:bg-black/60 transition-colors duration-300"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
          <h3 className="text-3xl font-bold tracking-wider uppercase">{category.name}</h3>
          <div className="mt-4 px-6 py-2 border-2 border-white text-sm font-semibold uppercase tracking-widest transition-colors duration-300 group-hover:bg-white group-hover:text-black">
            Lihat Koleksi
          </div>
        </div>
      </Link>
    </motion.div>
  );
}