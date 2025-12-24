"use client";

import { motion } from 'framer-motion';
import FeatureCard from '@/components/FeatureCard';
import { features } from '@/data/home'; // Impor data statis

export default function FeaturesSection() {
  return (
    <section id="features" className="bg-gray-50 py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ duration: 0.5 }} 
          className="text-center"
        >
          <h2 className="text-4xl font-bold text-gray-900">Kenyamanan dalam Genggaman Anda</h2>
          <p className="mt-2 text-gray-500 max-w-2xl mx-auto">Kami percaya hijab bukan hanya soal penampilan, tapi juga tentang rasa nyaman.</p>
        </motion.div>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-16" 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, amount: 0.2 }}
        >
          {features.map((feature, index) => (
            <FeatureCard 
              key={feature.title} 
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={index}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}