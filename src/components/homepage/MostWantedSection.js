"use client";

import { motion } from 'framer-motion';
import ProductCard from '@/components/ProductCard';

// Komponen ini tidak lagi 'use client', lebih ringan
// Ia menerima 'products' sebagai prop
export default function MostWantedSection({ products }) {
  return (
    <section id="most-wanted" className="bg-white py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <h2 className="text-3xl md:text-5xl font-serif text-center text-[#4a4042] mb-4">Most Wanted Items</h2>
          <p className="text-center text-gray-500 max-w-2xl mx-auto font-light leading-relaxed">Discover the pieces everyone is talking about. Curated just for you.</p>
        </motion.div>
        <motion.div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 mt-12" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} transition={{ staggerChildren: 0.1 }}>
          {/* Tidak perlu lagi state isLoading */}
          {products && products.length > 0 ? (
            products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">Produk tidak ditemukan.</p>
          )}
        </motion.div>
      </div>
    </section>
  );
}