// src/components/homepage/CategoriesSection.js
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
          <h2 className="text-4xl font-bold text-gray-900">Jelajahi Koleksi Kami</h2>
          <p className="mt-2 text-gray-500">Temukan gaya yang paling sesuai dengan kepribadian Anda.</p>
        </motion.div>
        
        <motion.div 
          className="flex lg:grid lg:grid-cols-4 gap-6 mt-12 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="w-3/4 sm:w-1/2 md:w-1/3 lg:w-full flex-shrink-0">
                <div className="bg-gray-100 rounded-lg h-80 animate-pulse"></div>
              </div>
            ))
          ) : (
            categories.map((category, index) => {
              // Buat objek baru dengan menambahkan properti 'href'
              const categoryWithHref = {
                ...category,
                href: `/collections/${category.name.toLowerCase()}`
              };

              return (
                <CategoryCard 
                  key={category.id}
                  category={categoryWithHref} // Kirim objek yang sudah memiliki 'href'
                  index={index} 
                />
              );
            })
          )}
        </motion.div>
      </div>
    </section>
  );
}