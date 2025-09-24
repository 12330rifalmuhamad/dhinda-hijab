// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'images.pexels.com', // Contoh jika pakai Pexels
        },
        // Anda bisa tambahkan domain lain di sini
      ],
    },
  };
  
  export default nextConfig;