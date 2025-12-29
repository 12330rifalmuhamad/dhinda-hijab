"use client";

import { motion } from 'framer-motion';
import { MapPin, Clock } from 'lucide-react';
import StoreMap from '@/components/StoreMap';
import { storeLocations } from '@/data/home'; // Impor data statis

export default function OfflineStoreSection() {
  return (
    <section id="offline-store" className="bg-[#fffbfa] py-24">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ duration: 0.5 }} 
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-[#dca5ad] uppercase tracking-[0.2em] mb-3 block">Offline Stores</span>
          <h2 className="text-3xl md:text-4xl font-serif text-[#4a4042] mb-4">Visit Our Boutiques</h2>
          <p className="text-gray-500 max-w-2xl mx-auto font-light">Experience the premium quality of our collections in person.</p>
        </motion.div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-16 items-center">
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
                variants={{ hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } } }}
              >
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
  );
}