// components/FeatureCard.js
"use client";

import { motion } from 'framer-motion';

export default function FeatureCard({ icon, title, description, index }) {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.15,
      },
    },
  };

  return (
    <motion.div 
      className="text-center"
      variants={cardVariants}
    >
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-900">
        {icon}
      </div>
      <h3 className="mt-6 text-xl font-bold text-gray-900">{title}</h3>
      <p className="mt-2 text-gray-500">{description}</p>
    </motion.div>
  );
}