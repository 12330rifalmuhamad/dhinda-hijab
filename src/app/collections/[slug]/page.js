// src/app/collections/[slug]/page.js
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
    const formattedCategoryName = slug.charAt(0).toUpperCase() + slug.slice(1);
    setCategoryName(formattedCategoryName);

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
  }, [slug]); // Jalankan ulang efek ini jika slug berubah

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Koleksi {categoryName}</h1>
        <p className="text-gray-500 mb-8">Temukan pilihan terbaik dari koleksi {categoryName} kami.</p>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="bg-gray-100 rounded-lg aspect-square animate-pulse"></div>
            ))
          ) : products.length > 0 ? (
            products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              Belum ada produk di koleksi ini.
            </p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}