// components/StoreMap.js

"use client";
import { motion } from 'framer-motion';

export default function StoreMap() {
  // Link Google Maps Embed. Anda bisa membuat link kustom Anda sendiri di Google Maps.
  // Cara membuat: Buka Google Maps > Cari lokasi > Klik Share > Pilih Embed a map > Salin HTML.
  // Untuk beberapa lokasi, cara termudah adalah membuat peta kustom di Google My Maps.
  const mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15843.834015797087!2d107.6191228!3d-6.9147448!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e64c5e824773%3A0x247ac4708338d773!2sBandung!5e0!3m2!1sen!2sid!4v1695582928372!5m2!1sen!2sid";

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