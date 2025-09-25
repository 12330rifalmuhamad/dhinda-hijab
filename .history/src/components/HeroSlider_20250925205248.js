// components/HeroSlider.js

"use client";

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { motion } from 'framer-motion';

// Import modul-modul Swiper yang akan digunakan
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';

// Import CSS untuk Swiper
import 'swiper/css';
import 'swiper/css/effect-fade';
// import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Data untuk setiap slide
const sliderData = [
  {
    id: 1,
    imageUrl: '/img/product-1.png',
    title: 'Koleksi Bergo',
    subtitle: 'Sentuhan Kemewahan untuk Setiap Momen',
  },
  {
    id: 2,
    imageUrl: '/img/product-2.png',
    title: 'Koleksi Pashmina',
    subtitle: 'Kenyamanan dan Gaya dalam Satu Helaian',
  },
  {
    id: 3,
    imageUrl: '/img/product-3.png',
    title: 'New Arrivals',
    subtitle: 'Temukan Gaya Terbaru Anda Hari Ini',
  },
];

export default function HeroSlider() {
  return (
    <div className="w-full h-[30vh] md:h-[90vh] bg-gray-200">
      <Swiper
        // Konfigurasi Swiper
        modules={[Autoplay, EffectFade, Navigation, Pagination]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        className="h-full w-full"
      >
        {sliderData.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative w-full h-full">
              {/* Gambar Background */}
              <Image
                src={slide.imageUrl}
                alt={slide.title}
                layout="fill"
                objectFit="cover"
                priority={slide.id === 1} // Prioritaskan load gambar pertama
              />
              {/* Overlay untuk menggelapkan gambar agar teks terbaca */}
              <div className="absolute inset-0 bg-black/40"></div>
              
              {/* Konten Teks di Tengah */}
              <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white p-4">
                <motion.h1
                  className="text-4xl md:text-6xl font-black tracking-tighter"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
                >
                  {slide.title}
                </motion.h1>
                <motion.p
                  className="mt-4 text-lg md:text-xl max-w-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
                >
                  {slide.subtitle}
                </motion.p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}