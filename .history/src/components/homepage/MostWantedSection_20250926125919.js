"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '@/components/ProductCard';

export default function MostWantedSection() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Gagal mengambil data');
        const data = await response.json();
        setProducts(data.products.slice(0, 4));
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <section id="most-wanted" className="bg-gradient-to-br from-soft-pink-50 to-soft-pink-100 py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-soft-pink-800 mb-4">
            Produk Paling Dicari
          </h2>
          <p className="text-lg text-soft-pink-600 max-w-2xl mx-auto">
            Temukan produk yang sedang trending dan paling diminati pelanggan kami
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-brand-primary to-brand-secondary mx-auto mt-6 rounded-full"></div>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mt-16" 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, amount: 0.2 }} 
          transition={{ staggerChildren: 0.1 }}
        >
          {isLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="bg-white rounded-xl p-4 animate-pulse">
                <div className="bg-soft-pink-200 rounded-lg aspect-square mb-4"></div>
                <div className="h-4 bg-soft-pink-200 rounded mb-2"></div>
                <div className="h-6 bg-soft-pink-200 rounded w-2/3"></div>
              </div>
            ))
          ) : (
            products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))
          )}
        </motion.div>
        
        {/* View All Button */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <button className="bg-gradient-to-r from-brand-primary to-brand-secondary text-white px-8 py-3 rounded-full font-semibold hover:from-brand-secondary hover:to-brand-primary transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
            Lihat Semua Produk
          </button>
        </motion.div>
      </div>
    </section>
  );
}