import { motion } from 'framer-motion';
import CategoryCard from '@/components/CategoryCard';

// Komponen ini juga tidak lagi 'use client'
// Ia menerima 'categories' sebagai prop
export default function CategoriesSection({ categories }) {
  return (
    <section id="categories" className="bg-white py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center">
          <h2 className="text-4xl font-bold text-gray-900">Jelajahi Koleksi Kami</h2>
          <p className="mt-2 text-gray-500">Temukan gaya yang paling sesuai dengan kepribadian Anda.</p>
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