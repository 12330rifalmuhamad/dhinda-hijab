"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { motion } from 'framer-motion';
import { Autoplay, EffectFade, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export default function HeroSection() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/hero-slides')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setSlides(data);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="w-full h-[calc(100vh-140px)] min-h-[600px] bg-[#e8d5b5] animate-pulse"></div>;
  }

  // Fallback if no slides or API fails to ensure site doesn't look broken
  const displaySlides = slides.length > 0 ? slides : [
    {
      id: 'fallback',
      image: '/img/new-banner.png',
      leftTitle: '',
      leftSubtitle: '',
      rightTitle: '',
      rightSubtitle: ''
    }
  ];

  return (
    <div className="relative w-full h-[600px] md:h-auto md:aspect-video overflow-hidden bg-[#e8d5b5]">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination, Navigation]}
        effect="fade"
        loop={true}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation={false}
        className="h-full w-full"
      >
        {displaySlides.map((slide) => (
          <SwiperSlide key={slide.id}>
            {({ isActive }) => (
              <div className="relative w-full h-full">
                {/* Background Image */}
                <div className="absolute inset-0 w-full h-full">
                  {/* Desktop Image (Hidden on Mobile) */}
                  <div className="hidden md:block w-full h-full relative">
                    <Image
                      src={slide.image}
                      alt={slide.leftTitle || "Hero Slide"}
                      fill
                      className="object-cover object-center"
                      priority={slide.id === displaySlides[0].id}
                    />
                  </div>

                  {/* Mobile Image (Visible only on Mobile) */}
                  <div className="block md:hidden w-full h-full relative">
                    <Image
                      src={slide.mobileImage || slide.image}
                      alt={slide.leftTitle || "Hero Slide"}
                      fill
                      className="object-cover object-center"
                      priority={slide.id === displaySlides[0].id}
                    />
                  </div>

                  <div className="absolute inset-0 bg-black/10"></div> {/* Mild Overlay for text readability */}
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 container mx-auto px-4 sm:px-6 pointer-events-none">
                  <div className="flex flex-col md:flex-row h-full items-center justify-between relative">

                    {/* Left Text */}
                    {slide.leftTitle && (
                      <div className="md:w-1/3 text-left z-10 mt-12 md:mt-0">
                        <motion.h2
                          initial={{ opacity: 0, x: -50 }}
                          animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                          transition={{ duration: 0.8, delay: 0.2 }}
                          className="text-white text-3xl md:text-5xl font-serif leading-tight drop-shadow-sm"
                        >
                          {slide.leftTitle} <br />
                          <span className="font-light">{slide.leftSubtitle}</span>
                        </motion.h2>
                      </div>
                    )}

                    {/* Center Space */}
                    <div className="md:w-1/3 h-full"></div>

                    {/* Right Text */}
                    {slide.rightTitle && (
                      <div className="md:w-1/3 text-right z-10 mb-12 md:mb-0 flex flex-col items-end justify-center">
                        <motion.h1
                          initial={{ opacity: 0, x: 50 }}
                          animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
                          transition={{ duration: 0.8, delay: 0.4 }}
                          className="text-white text-4xl md:text-8xl font-serif italic mb-2 drop-shadow-sm"
                          style={{ fontFamily: "cursive" }}
                        >
                          {slide.rightTitle}
                        </motion.h1>
                        <motion.p
                          initial={{ opacity: 0, x: 50 }}
                          animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
                          transition={{ duration: 0.8, delay: 0.6 }}
                          className="text-white text-lg md:text-xl tracking-[0.2em] font-light uppercase drop-shadow-sm"
                        >
                          {slide.rightSubtitle}
                        </motion.p>
                      </div>
                    )}

                  </div>
                </div>
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
