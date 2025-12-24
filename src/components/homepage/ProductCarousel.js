"use client";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import ProductCard from '@/components/ProductCard';
import 'swiper/css';
import 'swiper/css/navigation';

export default function ProductCarousel({ title, products }) {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">{title}</h2>
        <Swiper
          modules={[Navigation]}
          navigation
          spaceBetween={16}
          slidesPerView={'auto'}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
          className="!px-10" // Menambah padding untuk tombol navigasi
        >
          {products.map((product, index) => (
            <SwiperSlide key={product.id}>
              <ProductCard product={product} index={index} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}