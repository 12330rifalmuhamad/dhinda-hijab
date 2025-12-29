"use client";

import Image from 'next/image';
import Link from 'next/link'; 
import { motion } from 'framer-motion';

export default function ProductCard({ product, index }) {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: index * 0.1 },
    },
  };

  const imageUrl = product.images && product.images.length > 0 
    ? product.images[0].url 
    : 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg';

  // Mocking original price calculation for visual demo if not in DB
  const originalPrice = product.price * 1.1; 

  return (
    <motion.div
      className="group cursor-pointer bg-white p-0 rounded-none overflow-hidden" 
      variants={cardVariants}
      initial="hidden"
      whileInView="visible" // Animate when in view
      viewport={{ once: true }}
    >
      <Link href={`/produk/${product.id}`} className="block">
        {/* Image Container */}
        <div className="relative w-full aspect-square overflow-hidden">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          
          {/* On Sale Badge - Top Left */}
          <div className="absolute top-6 left-6 z-10">
            <span className="bg-[#EEE4E4] text-gray-800 text-xs tracking-[0.2em] font-medium px-4 py-2 uppercase">
              On Sale
            </span>
          </div>
        </div>
        
        {/* Content Container */}
        <div className="pt-6 pb-8 px-4 text-center">
          {/* Title */}
          <h3 className="text-sm md:text-base font-medium text-gray-600 uppercase tracking-[0.15em] leading-relaxed mb-4 line-clamp-2">
            {product.name}
          </h3>
          
          {/* Prices */}
          <div className="flex items-center justify-center gap-4 text-sm md:text-base tracking-widest font-semibold">
            <span className="text-[#c48b94]">
              RP {product.price.toLocaleString('id-ID')}
            </span>
            <span className="text-gray-400 line-through decoration-1">
              RP {originalPrice.toLocaleString('id-ID', { maximumFractionDigits: 0 })}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}