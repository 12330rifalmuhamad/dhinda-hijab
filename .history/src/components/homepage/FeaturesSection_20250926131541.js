"use client";

import { motion } from 'framer-motion';
import FeatureCard from '@/components/FeatureCard';
import { features } from '@/data/home'; // Impor data statis

export default function FeaturesSection() {
  return (
    <section id="features" className="bg-gradient-to-br from-soft-pink-50 via-white to-soft-pink-50 py-20">
      {/* <div className="container mx-auto px-4 sm:px-6"> */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ duration: 0.5 }} 
          className="text-center"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-soft-pink-800 mb-4">
            Kenyamanan dalam Genggaman Anda
          </h2>
          <p className="text-lg text-soft-pink-600 max-w-3xl mx-auto mb-8">
            Kami percaya hijab bukan hanya soal penampilan, tapi juga tentang rasa nyaman dan kepercayaan diri
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-brand-primary to-brand-secondary mx-auto rounded-full"></div>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 mt-16" 
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
      {/* </div> */}
    </section>
  );
}