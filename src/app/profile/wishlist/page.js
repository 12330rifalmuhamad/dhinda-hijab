"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Heart, Trash2, ShoppingCart, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/context/cartContext';

export default function WishlistPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [wishlist, setWishlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchWishlist();
    }
  }, [status, router]);

  const fetchWishlist = async () => {
    try {
      const res = await fetch('/api/wishlist');
      if (res.ok) {
        const data = await res.json();
        setWishlist(data);
      }
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      });
      if (res.ok) {
        setWishlist(prev => prev.filter(item => item.product.id !== productId));
      }
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    alert('Produk ditambahkan ke keranjang!');
  };

  if (status === 'loading' || isLoading) return <div className="min-h-screen flex items-center justify-center">Memuat...</div>;
  if (!session) return null;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-5xl">

          <div className="mb-6 flex items-center gap-4">
            <Link href="/profile" className="text-gray-500 hover:text-gray-900">
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Wishlist Saya</h1>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            {wishlist.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Wishlist masih kosong</h3>
                <p className="text-gray-500 mb-6">Anda belum menambahkan produk ke daftar favorit Anda.</p>
                <Link href="/collections" className="inline-block bg-brand-primary text-white px-6 py-2 rounded-md hover:bg-brand-secondary transition-colors">
                  Mulai Belanja
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlist.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4 flex flex-col hover:shadow-md transition-shadow bg-white relative group">
                    <button
                      onClick={() => handleRemove(item.product.id)}
                      className="absolute top-2 right-2 bg-white/80 p-1.5 rounded-full text-red-500 hover:bg-red-50 transition-colors z-10"
                      title="Hapus dari wishlist"
                    >
                      <Trash2 size={18} />
                    </button>

                    <Link href={`/produk/${item.product.id}`} className="block flex-1">
                      <div className="aspect-square bg-gray-100 rounded-md overflow-hidden mb-4 relative">
                        {item.product.images?.[0]?.url ? (
                          <img src={item.product.images[0].url} alt={item.product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                        )}
                        {item.product.stock === 0 && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="text-white font-medium bg-red-600 px-3 py-1 rounded">Habis</span>
                          </div>
                        )}
                      </div>
                      <h3 className="font-medium text-gray-900 line-clamp-2 min-h-[3rem]">{item.product.name}</h3>
                      <div className="mt-2 mb-4">
                        <span className="text-brand-primary font-bold">Rp {item.product.price.toLocaleString('id-ID')}</span>
                        {item.product.originalPrice && (
                          <span className="text-xs text-gray-400 line-through ml-2">Rp {item.product.originalPrice.toLocaleString('id-ID')}</span>
                        )}
                      </div>
                    </Link>

                    <button
                      disabled={item.product.stock === 0}
                      onClick={() => handleAddToCart(item.product)}
                      className="w-full py-2 flex items-center justify-center gap-2 rounded-md font-medium text-sm transition-colors
                        disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed
                        bg-gray-900 text-white hover:bg-gray-800"
                    >
                      <ShoppingCart size={16} /> Tambah ke Keranjang
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
