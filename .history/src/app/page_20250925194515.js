// src/app/page.js

"use client";

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSlider from '@/components/HeroSlider';
import ProductCard from '@/components/ProductCard';
import CategoryCard from '@/components/CategoryCard';
import FeatureCard from '@/components/FeatureCard';
import StoreMap from '@/components/StoreMap';
import { motion } from 'framer-motion';
import { MapPin, Clock, Gem, ShieldCheck, Truck } from 'lucide-react';

// --- DATA UNTUK HALAMAN UTAMA ---

const mostWantedProducts = [
  { id: '1', name: 'Pashmina Silk Premium', price: '75.000', imageUrl: '/img/product-1.png' },
  { id: '2', name: 'Bergo Maryam Diamond', price: '55.000', imageUrl: '/img/product-2.png' },
  { id: '3', name: 'Square Voal Motif', price: '60.000', imageUrl: '/img/product-3.png' },
  { id: '4', name: 'Instant Jersey Hijab', price: '85.000', imageUrl: '/img/product-4.png' },
];

const categories = [
  { name: 'Pashmina', imageUrl: '/img/pashmina-cat.png', href: '/collections/pashmina' },
  { name: 'Bergo', imageUrl: '/img/bergo-cat.png', href: '/collections/bergo' },
  { name: 'Square', imageUrl: '/img/square-cat.png', href: '/collections/square' },
];

const features = [
  { icon: <Gem size={32} />, title: 'Bahan Premium', description: 'Kain berkualitas tinggi yang nyaman, ringan, dan tidak menerawang.' },
  { icon: <ShieldCheck size={32} />, title: 'Kualitas Terjamin', description: 'Melewati quality control yang ketat untuk memastikan jahitan rapi dan sempurna.' },
  { icon: <Truck size={32} />, title: 'Pengiriman Cepat', description: 'Pesanan Anda kami proses dan kirimkan secepat mungkin ke seluruh Indonesia.' },
];

const storeLocations = [
  { city: 'Karawang', mall: 'Dhinda Hijab Store (Cabang 1)', address: 'Sukaharja, Telukjambe Timur, Karawang, Jawa Barat 41361' },
  { city: 'Cikampek', mall: 'Dhinda Hijab Store (Cabang 2)', address: 'Jl. Sukamanah No.40, Cikampek Bar., Kec. Cikampek, Karawang, Jawa Barat 41373' },
  { city: 'Salatiga', mall: 'Dhinda Hijab Store (Cabang 3)', address: 'JHJ9+Q39, Pandean, Suruh, Kec. Suruh, Kabupaten Semarang, Jawa Tengah 50776' },
];


// --- KOMPONEN UTAMA HALAMAN ---

export default function HomePage() {
  
  // Di masa depan, data di atas bisa diganti dengan fetch data dari API
  // const [products, setProducts] = useState([]);
  // useEffect(() => { /* fetch data */ }, []);

  return (
    <>
      <Navbar />
      
      <main>
        <HeroSlider />

        {/* Most Wanted */}
        <section id="most-wanted" className="bg-white py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
              <h2 className="text-4xl font-bold text-center text-[#4C3B4D]">Most Wanted Items</h2>
              <p className="text-center text-[#9E8B9E] mt-2">Discover the products that everyone is talking about.</p>
            </motion.div>
            <motion.div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 mt-12" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} transition={{ staggerChildren: 0.1 }}>
              {mostWantedProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="bg-[#FFF9FB] py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center">
              <h2 className="text-4xl font-bold text-[#4C3B4D]">Kenyamanan dalam Genggaman Anda</h2>
              <p className="mt-2 text-[#9E8B9E] max-w-2xl mx-auto">Kami percaya hijab bukan hanya soal penampilan, tapi juga tentang rasa nyaman.</p>
            </motion.div>
            <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-16" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
              {features.map((feature, index) => (
                <FeatureCard key={feature.title} icon={feature.icon} title={feature.title} description={feature.description} index={index} />
              ))}
            </motion.div>
          </div>
        </section>

        {/* Categories */}
        <section id="categories" className="bg-white py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center">
              <h2 className="text-4xl font-bold text-[#4C3B4D]">Jelajahi Koleksi Kami</h2>
              <p className="mt-2 text-[#9E8B9E]">Temukan gaya yang paling sesuai dengan kepribadian Anda.</p>
            </motion.div>
            <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
              {categories.map((category, index) => (
                <CategoryCard key={category.name} category={category} index={index} />
              ))}
            </motion.div>
          </div>
        </section>

        {/* Offline Store */}
        <section id="offline-store" className="bg-[#FDECF4] py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center">
              <h2 className="text-4xl font-bold text-[#4C3B4D]">Kunjungi Toko Offline Kami</h2>
              <p className="mt-2 text-[#9E8B9E] max-w-2xl mx-auto">Rasakan langsung kualitas premium dari koleksi kami.</p>
            </motion.div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-16 items-center">
              <motion.div className="space-y-8" initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ staggerChildren: 0.2 }}>
                {storeLocations.map((store) => (
                  <motion.div key={store.city} variants={{ hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } } }}>
                    <h3 className="text-2xl font-bold text-[#4C3B4D]">{store.city}</h3>
                    <p className="mt-2 text-lg font-semibold text-[#312231]">{store.mall}</p>
                    <div className="flex items-start mt-2 text-[#9E8B9E]"><MapPin className="w-5 h-5 mr-3 mt-1 flex-shrink-0" /><span>{store.address}</span></div>
                    <div className="flex items-center mt-2 text-[#9E8B9E]"><Clock className="w-5 h-5 mr-3" /><span>Buka Setiap Hari: 10.00 - 22.00</span></div>
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