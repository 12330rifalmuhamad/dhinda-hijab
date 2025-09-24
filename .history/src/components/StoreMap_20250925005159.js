// components/StoreMap.js

"use client";
import { motion } from 'framer-motion';

export default function StoreMap() {
  // Link Google Maps Embed. Anda bisa membuat link kustom Anda sendiri di Google Maps.
  // Cara membuat: Buka Google Maps > Cari lokasi > Klik Share > Pilih Embed a map > Salin HTML.
  // Untuk beberapa lokasi, cara termudah adalah membuat peta kustom di Google My Maps.
  const mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.9699174248813!2d107.46034147467691!3d-6.397878162574348!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e697300527e1ff3%3A0xd35b8b5770514629!2sDhinda%20Hijab%20store%20cikampek%20(cabang%202)!5e0!3m2!1sid!2sid!4v1758736240498!5m2!1sid!2sid";

  return (
    <motion.div 
      className="h-96 md:h-full w-full rounded-lg overflow-hidden shadow-lg"
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <iframe
        src={mapEmbedUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </motion.div>
  );
}