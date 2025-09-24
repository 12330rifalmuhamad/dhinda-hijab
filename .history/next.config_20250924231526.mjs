// next.config.mjs
// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
    // Tambahkan konfigurasi 'images' di sini
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'placehold.co',
          port: '',
          pathname: '/**',
        },
      ],
    },
  };
  
  export default nextConfig;