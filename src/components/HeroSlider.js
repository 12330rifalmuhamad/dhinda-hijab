"use client";
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { motion } from 'framer-motion';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

const sliderData = [
  { id: 1, imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1312461204/cld-sample.jpg', title: 'Koleksi Pashmina', subtitle: 'Kelembutan Sutra, senyaman sentuhan.'},
  { id: 2, imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1312461204/cld-sample-2.jpg', title: 'Bergo Praktis', subtitle: 'Kenyamanan dan Gaya untuk setiap aktivitas.'},
  { id: 3, imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1312461204/cld-sample-3.jpg', title: 'Hijab Motif Terbaru', subtitle: 'Ekspresikan dirimu dengan motif eksklusif.'},
];

export default function HeroSlider() {
  return (
    <div className="w-full h-[60vh] md:h-[90vh] bg-gray-200">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        loop={true}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        className="h-full w-full"
      >
        {sliderData.map((slide) => (
          <SwiperSlide key={slide.id}>
             {({ isActive }) => (
              <div className="relative w-full h-full">
                <Image src={slide.imageUrl} alt={slide.title} fill className="object-cover" priority={slide.id === 1} />
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white p-4">
                  <motion.h1
                    className="text-4xl md:text-6xl font-bold tracking-tight"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
                  >
                    {slide.title}
                  </motion.h1>
                  <motion.p
                    className="mt-4 text-lg md:text-xl max-w-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
                  >
                    {slide.subtitle}
                  </motion.p>
                </div>
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}