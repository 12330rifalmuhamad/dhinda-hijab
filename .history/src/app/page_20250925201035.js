// src/app/page.js

"use client";

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSlider from '@/components/HeroSlider';
import ProductCard from '@/components/ProductCard';
import CategoryCard from '@/components/CategoryCard';
import FeatureCard from '@/components/FeatureCard';
import StoreMap from '@/components/StoreMap';
import { motion } from 'framer-motion';
import { MapPin, Clock } from 'lucide-react';

// Impor data statis yang belum memiliki API
import { categories, features, storeLocations } from '@/data/home';

export default function HomePage() {
  // State untuk menyimpan data produk yang diambil dari API
  const [mostWantedProducts, setMostWantedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // State untuk loading

  useEffect(() => {
    // Fungsi untuk mengambil data produk dari API kita
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Gagal mengambil data produk');
        }
        const data = await response.json();
        // Ambil 4 produk pertama untuk ditampilkan di "Most Wanted"
        setMostWantedProducts(data.slice(0, 4));
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []); // `[]` memastikan fungsi ini hanya berjalan sekali saat komponen dimuat

  return (
    <>
      <Navbar />
      
      <main>
        <HeroSlider />

        {/* Most Wanted */}
        <section id="most-wanted" className="bg-white py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
              <h2 className="text-4xl font-bold text-center text-gray-900">Most Wanted Items</h2>
              <p className="text-center text-gray-500 mt-2">Discover the products that everyone is talking about.</p>
            </motion.div>
            <motion.div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 mt-12" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} transition={{ staggerChildren: 0.1 }}>
              {isLoading ? (
                // Tampilkan placeholder saat loading
                Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="bg-gray-100 rounded-lg aspect-square animate-pulse"></div>
                ))
              ) : (
                // Tampilkan produk setelah data diterima
                mostWantedProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))
              )}
            </motion.div>
          </div>
        </section>

        {/* Features (data masih statis) */}
        <section id="features" className="bg-gray-50 py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center">
              <h2 className="text-4xl font-bold text-gray-900">Kenyamanan dalam Genggaman Anda</h2>
              <p className="mt-2 text-gray-500 max-w-2xl mx-auto">Kami percaya hijab bukan hanya soal penampilan, tapi juga tentang rasa nyaman.</p>
            </motion.div>
            <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-16" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
              {features.map((feature, index) => (
                <FeatureCard key={feature.title} icon={feature.icon} title={feature.title} description={feature.description} index={index} />
              ))}
            </motion.div>
          </div>
        </section>

        {/* Categories (data masih statis) */}
        <section id="categories" className="bg-white py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center">
              <h2 className="text-4xl font-bold text-gray-900">Jelajahi Koleksi Kami</h2>
              <p className="mt-2 text-gray-500">Temukan gaya yang paling sesuai dengan kepribadian Anda.</p>
            </motion.div>
            <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
              {categories.map((category, index) => (
                <CategoryCard key={category.name} category={category} index={index} />
              ))}
            </motion.div>
          </div>
        </section>

        {/* Offline Store (data masih statis) */}
        <section id="offline-store" className="bg-gray-50 py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center">
              <h2 className="text-4xl font-bold text-gray-900">Kunjungi Toko Offline Kami</h2>
              <p className="mt-2 text-gray-500 max-w-2xl mx-auto">Rasakan langsung kualitas premium dari koleksi kami.</p>
            </motion.div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-16 items-center">
              <motion.div className="space-y-8" initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ staggerChildren: 0.2 }}>
                {storeLocations.map((store) => (
                  <motion.div key={store.city} variants={{ hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } } }}>
                    <h3 className="text-2xl font-bold text-gray-900">{store.city}</h3>
                    <p className="mt-2 text-lg font-semibold text-gray-700">{store.mall}</p>
                    <div className="flex items-start mt-2 text-gray-500"><MapPin className="w-5 h-5 mr-3 mt-1 flex-shrink-0" /><span>{store.address}</span></div>
                    <div className="flex items-center mt-2 text-gray-500"><Clock className="w-5 h-5 mr-3" /><span>Buka Setiap Hari: 10.00 - 22.00</span></div>
                  </motion.div>
                ))}
              </motion.div>
              <div className="w-full h-96 md:h-[500px]"><StoreMap /></div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
}