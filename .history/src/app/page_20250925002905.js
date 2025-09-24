// app/page.js

"use client";

import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import HeroSlider from '@/components/HeroSlider';


export default function HomePage() {
  
  const mostWantedProducts = [
    {
      id: 1,
      name: 'Pashmina Silk Premium',
      price: '75.000',
      imageUrl: '/img/product-1.png',
    },
    {
      id: 2,
      name: 'Bergo Maryam Diamond',
      price: '55.000',
      imageUrl: '/img/product-2.png',
    },
    {
      id: 3,
      name: 'Square Voal Motif',
      price: '60.000',
      imageUrl: '/img/product-3.png',
    },
    {
      id: 4,
      name: 'Instant Jersey Hijab',
      price: '85.000',
      imageUrl: '/img/product-4.png',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const imageVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <>
      <Navbar />
      
      <HeroSlider />

      {/* Bagian Most Wanted Items (sudah responsif) */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-bold text-center text-gray-900">Most Wanted Items</h2>
            <p className="text-center text-gray-500 mt-2">Discover the products that everyone is talking about.</p>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ staggerChildren: 0.1 }}
          >
            {mostWantedProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </>
  );
}