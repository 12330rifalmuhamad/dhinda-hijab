"use client";

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function CategoryCard({ category, index }) {
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 30 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.6, delay: index * 0.15, ease: "easeOut" },
    },
  };

  return (
    <motion.div variants={cardVariants} className="group">
      <Link href={category.href} className="block relative h-96 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
        <Image
          src={category.imageUrl || '/img/product-1.png'}
          alt={`Koleksi ${category.name}`}
          fill
          className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-soft-pink-900/80 via-soft-pink-800/40 to-transparent group-hover:from-soft-pink-900/90 group-hover:via-soft-pink-800/60 transition-all duration-300"></div>
        
        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
          <motion.h3 
            className="text-3xl lg:text-4xl font-bold tracking-wider uppercase text-center mb-4"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            {category.name}
          </motion.h3>
          
          <motion.div 
            className="mt-6 px-8 py-3 bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-full text-sm font-semibold uppercase tracking-widest transition-all duration-300 group-hover:bg-white group-hover:text-soft-pink-800 group-hover:border-white flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            Lihat Koleksi
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-4 right-4 w-2 h-2 bg-white/60 rounded-full group-hover:bg-white transition-colors duration-300"></div>
        <div className="absolute bottom-4 left-4 w-1 h-1 bg-white/40 rounded-full group-hover:bg-white transition-colors duration-300"></div>
      </Link>
    </motion.div>
  );
}