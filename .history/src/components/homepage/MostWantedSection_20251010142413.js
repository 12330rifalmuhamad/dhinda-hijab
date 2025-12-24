"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '@/components/ProductCard';

export default function MostWantedSection() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/products', { signal });
        
        const data = await response.json();

        // PENGECEKAN PENTING DI SINI
        if (response.ok && Array.isArray(data)) {
          // Hanya jalankan slice jika data adalah array
          setProducts(data.slice(0, 4));
        } else {
          // Jika tidak, log error dan set produk ke array kosong
          console.error("API tidak mengembalikan array produk:", data);
          setProducts([]);
        }

      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error("Error fetching products:", error);
        }
      } finally {
        if (!signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <section id="most-wanted" className="bg-white py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <h2 className="text-4xl font-bold text-center text-gray-900">Most Wanted Items</h2>
          <p className="text-center text-gray-500 mt-2">Discover the products that everyone is talking about.</p>
        </motion.div>
        <motion.div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 mt-12" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} transition={{ staggerChildren: 0.1 }}>
          {isLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="bg-gray-100 rounded-lg aspect-square animate-pulse"></div>
            ))
          ) : products.length > 0 ? (
            products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">Gagal memuat produk. Coba refresh halaman.</p>
          )}
        </motion.div>
      </div>
    </section>
  );
}