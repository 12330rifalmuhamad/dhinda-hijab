"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';

export default function CollectionPage() {
  const params = useParams();
  const slug = params.slug; // Mengambil 'pashmina' atau 'bergo' dari URL

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    if (!slug) return; // Jangan lakukan apa-apa jika slug belum ada

    // Ubah slug menjadi format judul (contoh: 'pashmina' -> 'Pashmina')
    const formattedName = decodeURIComponent(slug).charAt(0).toUpperCase() + decodeURIComponent(slug).slice(1);
    setCategoryName(formattedName);

    const fetchProductsByCategory = async () => {
      try {
        setIsLoading(true);
        // Panggil API dengan query parameter untuk filtering
        const response = await fetch(`/api/products?category=${slug}`);
        if (!response.ok) {
          throw new Error('Gagal mengambil data produk');
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductsByCategory();
  }, [slug]); // Jalankan ulang efek ini jika slug berubah (misal: navigasi antar koleksi)

  return (
    <>
      <main className="container mx-auto px-4 sm:px-6 py-12 min-h-screen">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Koleksi {categoryName}</h1>
        <p className="text-gray-500 mb-8">Temukan pilihan terbaik dari koleksi {categoryName} kami.</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
          {isLoading ? (
            // Tampilkan 8 placeholder saat loading
            Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="bg-gray-100 rounded-lg aspect-square animate-pulse"></div>
            ))
          ) : products.length > 0 ? (
            // Tampilkan produk jika ada
            products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))
          ) : (
            // Tampilkan pesan jika tidak ada produk
            <p className="col-span-full text-center text-gray-500 py-10">
              Belum ada produk di koleksi ini.
            </p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}