"use client";

import { motion } from 'framer-motion';
import { MapPin, Clock } from 'lucide-react';
import { storeLocations } from '@/data/home';

export default function OfflineStoreSection({ section }) {
  const stores = section?.content?.stores || storeLocations;

  return (
    <section id="offline-store" className="py-8 md:py-12">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-xs md:text-sm font-medium text-[#dca5ad] uppercase tracking-[0.2em] mb-2 md:mb-3 block">Offline Stores</span>
          <h2 className="text-xl md:text-3xl font-serif text-[#4a4042] mb-3 md:mb-4">{section?.title || "Visit Our Boutiques"}</h2>
          <p className="text-gray-500 max-w-2xl mx-auto font-light">Experience the premium quality of our collections in person.</p>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-12">
          {stores.map((store, index) => (
            <motion.div
              key={store.city}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6"
            >
              {/* Text Details */}
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{store.city}</h3>
                  <p className="text-pink-500 font-medium">{store.mall}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start text-gray-500">
                    <MapPin className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-gray-400" />
                    <span className="text-sm leading-relaxed">{store.address}</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <Clock className="w-5 h-5 mr-3 flex-shrink-0 text-gray-400" />
                    <span className="text-sm">Open Daily: {store.hours}</span>
                  </div>
                </div>

                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(store.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 text-sm font-semibold text-pink-500 hover:text-pink-600 transition-colors"
                >
                  Get Directions &rarr;
                </a>
              </div>

              {/* Square Map */}
              <div className="w-full md:w-48 aspect-square flex-shrink-0 bg-gray-200 rounded-xl overflow-hidden border">
                <iframe
                  src={store.mapUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Map of ${store.city}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}