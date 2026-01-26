"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import CategoryCard from '@/components/CategoryCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/navigation';

export default function CategoriesSection({ categories }) {
  return (
    <section id="categories" className="py-8 md:py-12">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="text-sm font-medium text-[#dca5ad] uppercase tracking-[0.2em] mb-3 block">Dhinda Collection</span>
          <h2 className="text-2xl md:text-3xl font-serif text-[#4a4042] mb-4">Explore Our Collections</h2>
          <p className=" text-gray-500 max-w-xl mx-auto font-light">Find the style that speaks to your personality.</p>
        </motion.div>

        {categories && categories.length > 0 ? (
          <div className="relative group">
            <Swiper
              modules={[Navigation, Autoplay]}
              spaceBetween={20}
              navigation={{
                nextEl: '.swiper-button-next-custom',
                prevEl: '.swiper-button-prev-custom',
              }}
              loop={true}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
              }}
              breakpoints={{
                320: { slidesPerView: 1.2, spaceBetween: 15 },
                640: { slidesPerView: 2.2, spaceBetween: 20 },
                768: { slidesPerView: 3.2, spaceBetween: 24 },
                1024: { slidesPerView: 4, spaceBetween: 30 },
              }}
              className="px-4 py-8 !overflow-visible"
            >
              {categories.map((category, index) => {
                const categoryWithHref = { ...category, href: `/collections/${category.name.toLowerCase()}` };
                return (
                  <SwiperSlide key={category.id} className="h-auto">
                    <CategoryCard category={categoryWithHref} index={index} />
                  </SwiperSlide>
                );
              })}
            </Swiper>

            {/* Custom Navigation Buttons */}
            {categories.length > 4 && (
              <>
                <button
                  className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 -ml-4 bg-white shadow-lg p-3 rounded-full text-gray-800 hover:text-[#dca5ad] transition-all z-20 border border-gray-100 hover:scale-110 flex items-center justify-center cursor-pointer disabled:opacity-50"
                  aria-label="Previous Slide"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 -mr-4 bg-white shadow-lg p-3 rounded-full text-gray-800 hover:text-[#dca5ad] transition-all z-20 border border-gray-100 hover:scale-110 flex items-center justify-center cursor-pointer disabled:opacity-50"
                  aria-label="Next Slide"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>
        ) : (
          <p className="w-full text-center text-gray-500">Kategori tidak ditemukan.</p>
        )}
      </div>
    </section>
  );
}