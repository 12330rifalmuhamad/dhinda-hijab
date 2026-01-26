"use client";

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

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
    <div className="group w-full h-full">
      {/* Ubah tinggi dari h-96 menjadi h-80 atau sesuai selera */}
      <Link href={category.href} className="block relative h-80 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 bg-gray-200">
        {category.imageUrl ? (
          <img
            src={category.imageUrl}
            alt={`Koleksi ${category.name}`}
            className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-pink-200 to-pink-100 flex items-center justify-center">
            <span className="text-gray-400">No Image</span>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent group-hover:from-black/80 transition-all duration-300"></div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white text-center">
          <h3 className="text-2xl font-serif font-medium tracking-wide">
            {category.name}
          </h3>
          <div
            className="mt-6 inline-flex items-center gap-2 px-6 py-2 bg-white/10 backdrop-blur-sm border border-white/30 rounded-full text-sm font-medium hover:bg-white hover:text-[#dca5ad] transition-all duration-300"
          >
            Shop Collection
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    </div>
  );
}