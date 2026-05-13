"use client";

import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WhatsAppWidget() {
  const phoneNumber = "6281234567890"; // Ganti dengan nomor asli
  const message = "Halo Dhinda Hijab, saya ingin bertanya tentang produk Anda.";
  const waUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <motion.a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg flex items-center justify-center hover:bg-[#1ebd5b] transition-colors"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      title="Chat dengan CS via WhatsApp"
    >
      <MessageCircle size={28} />
      <span className="absolute -top-10 right-0 bg-white text-gray-800 text-xs py-1 px-3 rounded shadow-md font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
        Butuh Bantuan?
      </span>
    </motion.a>
  );
}
