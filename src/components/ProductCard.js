"use client";

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, Flame, Truck, MapPin } from 'lucide-react';

export default function ProductCard({ product, index }) {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: index * 0.1 },
    },
  };

  // Helper to check if url is video
  const isVideo = (url) => url?.match(/\.(mp4|webm)$/) || url?.match(/\/video\/upload\//);

  const primaryMedia = product.images && product.images.length > 0 ? product.images[0].url : null;
  const isPrimaryVideo = isVideo(primaryMedia);

  const imageUrl = (!isPrimaryVideo && primaryMedia)
    ? primaryMedia
    : 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg';

  // Mocking data for visual match if missing from DB
  const originalPrice = product.price * 1.35; // ~35% diff for visual drama
  const discountPercentage = Math.round(((originalPrice - product.price) / originalPrice) * 100);
  const soldCount = "8.4K+"; // Mock
  const rating = 4.9; // Mock

  return (
    <motion.div
      className="group cursor-pointer bg-white rounded-xl border border-pink-50 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-full relative"
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <Link href={`/produk/${product.id}`} className="block h-full flex flex-col">
        {/* Media Container */}
        <div className="relative w-full aspect-[4/5] overflow-hidden bg-gray-50">
          {/* Overlays - Top Left - Soft & Minimal */}
          <div className="absolute top-3 left-3 z-20 flex flex-col items-start gap-1">
            {/* XTRA Badge - Soft Green/Teal converted to Soft Pink/Sage */}
            <div className="backdrop-blur-md bg-white/80 border border-pink-100 text-[#c48b94] text-[10px] font-medium px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
              <Truck className="w-3 h-3 text-[#dca5ad]" />
              <span>Free Shipping</span>
            </div>
          </div>

          {/* Bottom Overlay - Soft Gradient */}
          <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/40 to-transparent p-3 pt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {/* Optional hover content could go here */}
          </div>

          {(isPrimaryVideo && primaryMedia) ? (
            <video
              src={primaryMedia}
              autoPlay
              loop
              muted
              playsInline
              className="object-cover z-0 w-full h-full absolute inset-0"
            />
          ) : (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-cover z-0 transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
            />
          )}

          {product.videoUrl && (
            <video
              src={product.videoUrl}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover z-10 transition-opacity duration-300 group-hover:opacity-0"
            />
          )}
        </div>

        {/* Content Container */}
        <div className="p-3 flex flex-col flex-grow bg-white">
          {/* Shop Badges - Harmonious Colors */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            <span className="bg-[#fff0f3] text-[#c48b94] text-[9px] font-semibold px-1.5 py-0.5 rounded-md border border-pink-100">
              Official Store
            </span>
            <span className="bg-[#fff0f3] text-[#c48b94] text-[9px] font-semibold px-1.5 py-0.5 rounded-md border border-pink-100">
              Best Seller
            </span>
          </div>

          {/* Title */}
          <h3 className="text-sm text-[#4a4042] font-medium leading-snug line-clamp-2 mb-2 min-h-[2.5em] group-hover:text-[#c48b94] transition-colors">
            {product.name}
          </h3>

          {/* Price Section */}
          <div className="mt-auto">
            <div className="flex items-baseline gap-2 flex-wrap mb-1">
              <span className="text-[#c48b94] font-bold text-lg">
                Rp{product.price.toLocaleString('id-ID')}
              </span>
              <span className="text-xs text-gray-400 line-through decoration-1">
                Rp{originalPrice.toLocaleString('id-ID', { maximumFractionDigits: 0 })}
              </span>
            </div>

            {/* Rating & Sold */}
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-dashed border-pink-50">
              <div className="flex items-center gap-3 text-[11px] text-gray-500">
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-[#ffedd5] text-[#fbbf24]" />
                  <span className="font-medium text-[#4a4042]">{rating}</span>
                </div>
                <span>{soldCount} Sold</span>
              </div>

              {/* Add to Cart / Action Icon (Optional - just visual for now) */}
              <div className="w-6 h-6 rounded-full bg-[#fff0f3] flex items-center justify-center text-[#c48b94] opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}