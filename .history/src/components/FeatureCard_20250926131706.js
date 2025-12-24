"use client";

import { motion } from 'framer-motion';

export default function FeatureCard({ icon, title, description, index }) {
  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        delay: index * 0.15,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div 
      className="text-center group"
      variants={cardVariants}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative">
        <motion.div 
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary text-white shadow-lg group-hover:shadow-xl transition-all duration-300"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ duration: 0.2 }}
        >
          <div className="text-2xl">
            {icon}
          </div>
        </motion.div>
        
        {/* Decorative ring */}
        {/* <div className="absolute inset-0 rounded-full border-2 border-soft-pink-200 group-hover:border-brand-primary transition-colors duration-300"></div> */}
      </div>
      
      <motion.h3 
        className="mt-6 text-xl font-bold text-soft-pink-800 group-hover:text-brand-primary transition-colors duration-200"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        {title}
      </motion.h3>
      
      <p className="mt-3 text-soft-pink-600 leading-relaxed max-w-sm mx-auto">
        {description}
      </p>
    </motion.div>
  );
}