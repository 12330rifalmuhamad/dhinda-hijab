"use client";

import Image from 'next/image';
import Link from 'next/link'; 
import { motion } from 'framer-motion';
import { Heart, ShoppingCart } from 'lucide-react';

export default function ProductCard({ product, index }) {
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: index * 0.1 },
    },
  };

  const imageUrl = product.images && product.images.length > 0 
    ? product.images[0].url 
    : '/img/product-1.png';

  return (
    <motion.div
      className="bg-white rounded-xl overflow-hidden group border border-soft-pink-200 hover:shadow-2xl hover:shadow-soft-pink-200/20 transition-all duration-300 hover:-translate-y-1"
      variants={cardVariants}
      whileHover={{ scale: 1.02 }}
    >
      <Link href={`/produk/${product.id}`}>
        <div className="relative w-full aspect-square bg-gradient-to-br from-soft-pink-50 to-soft-pink-100 overflow-hidden">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Overlay with actions */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
              <button className="p-2 bg-white/90 rounded-full hover:bg-brand-primary hover:text-white transition-all duration-200 transform hover:scale-110">
                <Heart size={16} />
              </button>
              <button className="p-2 bg-white/90 rounded-full hover:bg-brand-primary hover:text-white transition-all duration-200 transform hover:scale-110">
                <ShoppingCart size={16} />
              </button>
            </div>
          </div>

          {/* Badge for new products */}
          {index < 3 && (
            <div className="absolute top-3 left-3">
              <span className="bg-gradient-to-r from-brand-primary to-brand-secondary text-white text-xs px-2 py-1 rounded-full font-semibold">
                Baru
              </span>
            </div>
          )}
        </div>
      </Link>
      
      <div className="p-4">
        <Link href={`/produk/${product.id}`}>
          <h3 className="font-semibold text-soft-pink-800 hover:text-brand-primary transition-colors duration-200 truncate mb-2">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center justify-between">
          <p className="text-lg font-bold text-brand-primary">
            Rp {product.price.toLocaleString('id-ID')}
          </p>
          
          {product.stock > 0 ? (
            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
              Tersedia
            </span>
          ) : (
            <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded-full">
              Habis
            </span>
          )}
        </div>

        {/* Rating placeholder */}
        <div className="flex items-center mt-2">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-sm">★</span>
            ))}
          </div>
          <span className="text-xs text-soft-pink-600 ml-2">(4.8)</span>
        </div>
      </div>
    </motion.div>
  );
}