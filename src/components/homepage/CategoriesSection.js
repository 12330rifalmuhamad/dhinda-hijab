"use client";
import { motion } from 'framer-motion';
import CategoryCard from '@/components/CategoryCard';

// Komponen ini juga tidak lagi 'use client'
// Ia menerima 'categories' sebagai prop
export default function CategoriesSection({ categories }) {
  return (
    <section id="categories" className="py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-12">
          <span className="text-sm font-medium text-[#dca5ad] uppercase tracking-[0.2em] mb-3 block">Hana Collection</span>
          <h2 className="text-2xl md:text-3xl font-serif text-[#4a4042] mb-4">Explore Our Collections</h2>
          <p className=" text-gray-500 max-w-xl mx-auto font-light">Find the style that speaks to your personality.</p>
        </motion.div>

        <motion.div className="flex lg:grid lg:grid-cols-4 gap-6 mt-12 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
          {categories && categories.length > 0 ? (
            categories.map((category, index) => {
              const categoryWithHref = { ...category, href: `/collections/${category.name.toLowerCase()}` };
              return <CategoryCard key={category.id} category={categoryWithHref} index={index} />;
            })
          ) : (
            <p className="w-full text-center text-gray-500">Kategori tidak ditemukan.</p>
          )}
        </motion.div>
      </div>
    </section>
  );
}