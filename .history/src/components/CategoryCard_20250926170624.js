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
    <motion.div 
      variants={cardVariants} 
      className="group w-3/4 sm:w-1/2 md:w-1/3 lg:w-full flex-shrink-0"
    >
      {/* Ubah tinggi dari h-96 menjadi h-80 atau sesuai selera */}
      <Link href={category.href} className="block relative h-50 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
        <Image
          src={category.imageUrl || '/img/placeholder.png'}
          alt={`Koleksi ${category.name}`}
          fill
          className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent group-hover:from-black/80 transition-all duration-300"></div>
        
        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white text-center">
          <h3 className="text-2xl font-bold tracking-wider uppercase">
            {category.name}
          </h3>
          <div 
            className="mt-4 max-w-max mx-auto px-6 py-2 border-2 border-white/50 rounded-full text-sm font-semibold uppercase tracking-widest transition-all duration-300 group-hover:bg-white group-hover:text-black flex items-center gap-2"
          >
            Lihat Koleksi
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}