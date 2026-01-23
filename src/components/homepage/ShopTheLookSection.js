"use client";


import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, ShoppingBag } from 'lucide-react';

export default function ShopTheLookSection({ section }) {
  // Support both legacy (single object) and new (array) structure
  const rawContent = section.content || {};

  // Normalize to array
  const looks = rawContent.looks || [
    {
      featureImage: rawContent.featureImage,
      productImage: rawContent.productImage,
      productName: rawContent.productName,
      productLink: rawContent.productLink,
      price: rawContent.price,
      originalPrice: rawContent.originalPrice
    }
  ].filter(l => l.featureImage); // Filter out empty if any

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % looks.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + looks.length) % looks.length);
  };

  if (looks.length === 0) return null;

  const currentLook = looks[currentIndex];

  return (
    <section className="relative w-full py-8 md:py-12 px-[5%] md:px-[10%] overflow-hidden">
      {/* Title */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-lg md:text-2xl font-serif tracking-[0.2em] text-gray-700 uppercase">
          Shop The Look
        </h2>
      </motion.div>

      <div className="relative">
        {looks.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-12 z-10 p-1 md:p-2 text-gray-400 hover:text-gray-800 transition-colors"
            >
              <ChevronLeft size={24} className="md:w-8 md:h-8" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-12 z-10 p-1 md:p-2 text-gray-400 hover:text-gray-800 transition-colors"
            >
              <ChevronRight size={24} className="md:w-8 md:h-8" />
            </button>
          </>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-24"
          >
            {/* Left: Feature Image */}
            <div
              className="relative w-full md:w-5/12 aspect-[3/4] cursor-pointer md:cursor-default"
              onClick={() => window.innerWidth < 768 && setShowPopup(true)}
            >
              {currentLook.featureImage ? (
                <Image
                  src={currentLook.featureImage}
                  alt="Lookbook"
                  fill
                  className="object-cover shadow-xl"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                  No Feature Image
                </div>
              )}

              {/* Mobile Tap Hint */}
              <div className="md:hidden absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium text-gray-800 shadow-sm flex items-center gap-2 animate-bounce-slow">
                <ShoppingBag size={14} />
                <span>Tap to view items</span>
              </div>

              {/* Center Interaction Dot (Decorative) */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>

            {/* Right: Product Card - Desktop Only */}
            <div className="hidden md:flex w-full md:w-4/12 flex-col items-center text-center">
              {/* Product Image */}
              <div className="relative w-full aspect-square mb-6 shadow-lg bg-white p-2">
                {currentLook.productImage ? (
                  <Image
                    src={currentLook.productImage}
                    alt={currentLook.productName || 'Product'}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100"></div>
                )}
              </div>

              {/* Details */}
              <h3 className="text-sm font-serif tracking-[0.15em] uppercase text-gray-700 mb-3">
                {currentLook.productName || 'PRODUCT NAME'}
              </h3>

              <div className="flex items-center gap-4 text-sm font-medium tracking-widest mb-6">
                <span className="text-[#FF5C5C]">
                  RP {(currentLook.price || 0).toLocaleString('id-ID')}
                </span>
                {currentLook.originalPrice > 0 && (
                  <span className="text-gray-400 line-through text-xs">
                    RP {(currentLook.originalPrice || 0).toLocaleString('id-ID')}
                  </span>
                )}
              </div>

              <Link
                href={currentLook.productLink || '#'}
                className="px-8 py-3 bg-[#dca5ad] text-white text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#c48b94] transition-colors"
              >
                View This Product
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Mobile Product Popup */}
        <AnimatePresence>
          {showPopup && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowPopup(false)}
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden"
              />
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="fixed bottom-0 left-0 w-full z-50 bg-white rounded-t-3xl p-6 md:hidden shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.2)]"
              >
                <button
                  onClick={() => setShowPopup(false)}
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-800"
                >
                  <X size={24} />
                </button>

                <div className="flex gap-4">
                  <div className="relative w-24 h-24 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden">
                    {currentLook.productImage && (
                      <Image
                        src={currentLook.productImage}
                        alt={currentLook.productName}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <h3 className="text-sm font-serif tracking-wide uppercase text-gray-800 mb-2 line-clamp-2">
                      {currentLook.productName}
                    </h3>
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-[#FF5C5C] font-semibold">
                        RP {(currentLook.price || 0).toLocaleString('id-ID')}
                      </span>
                      {currentLook.originalPrice > 0 && (
                        <span className="text-gray-400 line-through text-xs">
                          {(currentLook.originalPrice || 0).toLocaleString('id-ID')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <Link
                  href={currentLook.productLink || '#'}
                  onClick={() => setShowPopup(false)}
                  className="mt-6 w-full block text-center py-3.5 bg-[#dca5ad] text-white text-xs font-bold tracking-[0.2em] uppercase rounded-full shadow-lg shadow-pink-100"
                >
                  View Product Details
                </Link>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Dots */}
      {looks.length > 1 && (
        <div className="flex justify-center gap-3 mt-8">
          {looks.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2 h-2 rounded-full transition-colors ${idx === currentIndex ? 'bg-gray-800' : 'bg-gray-300'}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
