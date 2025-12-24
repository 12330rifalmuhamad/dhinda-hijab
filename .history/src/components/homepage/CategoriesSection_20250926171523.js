"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CategoryCard from '@/components/CategoryCard';

export default function CategoriesSection() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/categories');
        if (!response.ok) throw new Error('Gagal mengambil data');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <section id="categories" className="bg-white py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ duration: 0.5 }} 
          className="text-center"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-soft-pink-800 mb-4">
            Jelajahi Koleksi Kami
          </h2>
          <p className="text-lg text-soft-pink-600 max-w-2xl mx-auto mb-8">
            Temukan gaya yang paling sesuai dengan kepribadian Anda
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-brand-primary to-brand-secondary mx-auto rounded-full"></div>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16" 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, amount: 0.2 }}
        >
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="bg-gradient-to-br from-soft-pink-100 to-soft-pink-200 rounded-xl h-96 animate-pulse"></div>
            ))
          ) : (
            categories.map((category, index) => (
              <CategoryCard 
                key={category.id} // Gunakan ID unik dari database
                category={category} // <-- Meneruskan seluruh objek 'category'
                index={index} 
              />
            ))
          )}
        </motion.div>
      </div>
    </section>
  );
}