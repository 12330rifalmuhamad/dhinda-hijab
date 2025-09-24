// app/page.js

"use client";

import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { motion } from 'framer-motion';
import HeroSlider from '@/components/HeroSlider';
import CategoryCard from '@/components/CategoryCard'; // <-- 1. IMPORT CategoryCard
import FeatureCard from '@/components/FeatureCard'; // <-- 1. IMPORT FeatureCard
import { Gem, ShieldCheck, Truck, MapPin, Clock } from 'lucide-react'; // <-- 2. IMPORT IKON
import StoreMap from '@/components/StoreMap'; // <-- 1. IMPORT StoreMap




export default function HomePage() {
  
  const mostWantedProducts = [
    {
      id: 1,
      name: 'Pashmina Silk Premium',
      price: '75.000',
      imageUrl: '/img/product-1.png',
    },
    {
      id: 2,
      name: 'Bergo Maryam Diamond',
      price: '55.000',
      imageUrl: '/img/product-2.png',
    },
    {
      id: 3,
      name: 'Square Voal Motif',
      price: '60.000',
      imageUrl: '/img/product-3.png',
    },
    {
      id: 4,
      name: 'Instant Jersey Hijab',
      price: '85.000',
      imageUrl: '/img/product-4.png',
    },
  ];

  const categories = [
    {
      name: 'Pashmina',
      imageUrl: '/img/pashmina-cat.png',
      href: '/collections/pashmina',
    },
    {
      name: 'Bergo',
      imageUrl: '/img/bergo-cat.png',
      href: '/collections/bergo',
    },
    {
      name: 'Square',
      imageUrl: '/img/square-cat.png',  
      href: '/collections/square',
    },
  ];


  const features = [
    {
      icon: <Gem size={32} />,
      title: 'Bahan Premium',
      description: 'Kami hanya memilih kain berkualitas tinggi yang nyaman, ringan, dan tidak menerawang.',
    },
    {
      icon: <ShieldCheck size={32} />,
      title: 'Kualitas Terjamin',
      description: 'Setiap produk melewati proses quality control yang ketat untuk memastikan jahitan rapi dan sempurna.',
    },
    {
      icon: <Truck size={32} />,
      title: 'Pengiriman Cepat',
      description: 'Pesanan Anda kami proses dan kirimkan secepat mungkin ke seluruh penjuru Indonesia.',
    },
  ];

  ript

  const storeLocations = [
    {
      city: 'Jakarta',
      mall: 'Central Park Mall, Lantai 1',
      address: 'Jl. Letjen S. Parman No.Kav. 28, Jakarta Barat',
    },
    {
      city: 'Bandung',
      mall: '23 Paskal Shopping Center, Lantai 2',
      address: 'Jl. Pasir Kaliki No.25-27, Kb. Jeruk, Bandung',
    },
    {
      city: 'Surabaya',
      mall: 'Tunjungan Plaza 3, Lantai 3',
      address: 'Jl. Jenderal Basuki Rachmat No.8-12, Surabaya',
    },
  ];

  return (
    <>
      <Navbar />
      
      <HeroSlider />

      {/* Most Wanted */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-bold text-center text-gray-900">Most Wanted Items</h2>
            <p className="text-center text-gray-500 mt-2">Discover the products that everyone is talking about.</p>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ staggerChildren: 0.1 }}
          >
            {mostWantedProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </motion.div>
        </div>
      </section>

            {/* FEATURE */}
            <section className="bg-white py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h2 className="text-4xl font-bold text-gray-900">Kenyamanan dalam Genggaman Anda</h2>
            <p className="mt-2 text-gray-500 max-w-2xl mx-auto">Kami percaya bahwa hijab bukan hanya soal penampilan, tapi juga tentang rasa nyaman dan percaya diri sepanjang hari.</p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {features.map((feature, index) => (
              <FeatureCard 
                key={feature.title} 
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                index={index}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* CATEGORY */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h2 className="text-4xl font-bold text-gray-900">Jelajahi Koleksi Kami</h2>
            <p className="mt-2 text-gray-500">Temukan gaya yang paling sesuai dengan kepribadian Anda.</p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {categories.map((category, index) => (
              <CategoryCard key={category.name} category={category} index={index} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* 4. TAMBAHKAN SECTION TOKO OFFLINE DI SINI */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h2 className="text-4xl font-bold text-gray-900">Kunjungi Toko Offline Kami</h2>
            <p className="mt-2 text-gray-500 max-w-2xl mx-auto">Rasakan langsung kualitas premium dari koleksi kami dan dapatkan bantuan dari tim profesional kami.</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-16 items-center">
            {/* Kolom Kiri: Daftar Lokasi */}
            <motion.div 
              className="space-y-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ staggerChildren: 0.2 }}
            >
              {storeLocations.map((store) => (
                <motion.div 
                  key={store.city}
                  variants={{
                    hidden: { opacity: 0, x: -50 },
                    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } },
                  }}
                >
                  <h3 className="text-2xl font-bold text-gray-900">{store.city}</h3>
                  <p className="mt-2 text-lg font-semibold text-gray-700">{store.mall}</p>
                  <div className="flex items-start mt-2 text-gray-500">
                    <MapPin className="w-5 h-5 mr-3 mt-1 flex-shrink-0" />
                    <span>{store.address}</span>
                  </div>
                  <div className="flex items-center mt-2 text-gray-500">
                    <Clock className="w-5 h-5 mr-3" />
                    <span>Buka Setiap Hari: 10.00 - 22.00</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Kolom Kanan: Peta */}
            <div className="w-full h-96 md:h-[500px]">
              <StoreMap />
            </div>
          </div>
        </div>
      </section>


      
      <Footer />
    </>
  );
}