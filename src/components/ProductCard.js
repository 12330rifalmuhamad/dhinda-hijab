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

  // Helper to check if url is video
  const isVideo = (url) => url?.match(/\.(mp4|webm)$/) || url?.match(/\/video\/upload\//);

  const primaryMedia = product.images && product.images.length > 0 ? product.images[0].url : null;
  const isPrimaryVideo = isVideo(primaryMedia);

  const imageUrl = (!isPrimaryVideo && primaryMedia)
    ? primaryMedia
    : 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'; // Fallback if first item is video (we'll handle video rendering separately or rely on videoUrl)

  // Mocking original price calculation for visual demo if not in DB
  const originalPrice = product.price * 1.1;

  return (
    <motion.div
      className="group cursor-pointer bg-white p-0 rounded-xl overflow-hidden"
      variants={cardVariants}
      initial="hidden"
      whileInView="visible" // Animate when in view
      viewport={{ once: true }}
    >
      <Link href={`/produk/${product.id}`} className="block">
        {/* Media Container - Video First, then Image on Hover */}
        <div className="relative w-full aspect-square overflow-hidden bg-gray-100">
          {/* If videoUrl exists, show video. It will autoplay. On hover, we hide it or show image on top? 
               Request: "menampilkan video seperti gif dan ketika hover cursor berubah menjadi foto produk"
               So:
               Default: Video (if available)
               Hover: Image
               
               Implementation:
               Stack them. 
               Layer 1 (Bottom): Image (always there? or only if no video?)
               Layer 2 (Top): Video (Visible by default. On hover, Opacity 0 to reveal image?)
               
               Let's try:
               Render Image (absolute inset-0).
               Render Video (absolute inset-0, z-10).
               CSS: .group:hover video { opacity: 0 }
               
               Wait, "Video default, Image on hover".
               So Video is on top. Hover hides video.
           */}


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
              className="object-cover z-0"
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

          {/* On Sale Badge - Top Left (Ensure z-20 to be above video) */}
          <div className="absolute top-6 left-6 z-20">
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