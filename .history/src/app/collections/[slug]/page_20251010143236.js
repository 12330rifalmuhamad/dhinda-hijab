"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';

export default function CollectionPage() {
  const params = useParams();
  const slug = params.slug;

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    if (!slug) return;

    const formattedName = decodeURIComponent(slug).charAt(0).toUpperCase() + decodeURIComponent(slug).slice(1);
    setCategoryName(formattedName);

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchProductsByCategory = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/products?category=${slug}`, { signal });
        const data = await response.json();
        
        if (response.ok && Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          console.error("API tidak mengembalikan array produk di dalam 'products':", data);
          setProducts([]);
        }

      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error("Error:", error);
        }
      } finally {
        if (!signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchProductsByCategory();

    return () => {
      controller.abort();
    };
  }, [slug]);

  return (
    <>
      <main className="container mx-auto px-4 sm:px-6 py-12 min-h-screen">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Koleksi {categoryName}</h1>
        <p className="text-gray-500 mb-8">Temukan pilihan terbaik dari koleksi {categoryName} kami.</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="bg-gray-100 rounded-lg aspect-square animate-pulse"></div>
            ))
          ) : products.length > 0 ? (
            products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500 py-10">
              Belum ada produk di koleksi ini.
            </p>
          )}
        </div>
      </main>
    </>
  );
}