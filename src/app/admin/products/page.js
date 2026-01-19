"use client";

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('createdAt'); // default sort
  const [sortOrder, setSortOrder] = useState('desc'); // default order

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/products?search=${search}&sort=${sortBy}&order=${sortOrder}`);
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products', error);
      // Optionally, set an error state to display to the user
    } finally {
      setLoading(false);
    }
  }, [search, sortBy, sortOrder]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const SortIcon = ({ field }) => {
    if (sortBy !== field) return <div className="w-4 h-4 inline-block ml-1 opacity-20">↕</div>;
    return <div className="w-4 h-4 inline-block ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</div>;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 500);
    return () => clearTimeout(timer);
  }, [search, fetchProducts]);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      fetchProducts();
    } catch (error) {
      alert('Failed to delete');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Products</h1>
            <p className="text-gray-500">Manage your product catalog</p>
          </div>
          <Link
            href="/admin/products/new"
            className="flex items-center justify-center gap-2 px-4 py-2 bg-[#dca5ad] text-white rounded-lg hover:bg-[#c48b94] transition-colors font-medium w-full md:w-auto"
          >
            <Plus size={18} />
            Add Product
          </Link>
        </div>

        {/* Search Bar */}
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-3 bg-white border rounded-lg focus:ring-1 focus:ring-[#dca5ad] outline-none shadow-sm"
          />
        </div>

        {/* Product Table */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th
                    className="px-6 py-4 font-semibold text-gray-600 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('name')}
                  >
                    Product <SortIcon field="name" />
                  </th>
                  <th
                    className="px-6 py-4 font-semibold text-gray-600 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('category')}
                  >
                    Category <SortIcon field="category" />
                  </th>
                  <th
                    className="px-6 py-4 font-semibold text-gray-600 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('price')}
                  >
                    Price <SortIcon field="price" />
                  </th>
                  <th className="px-6 py-4 font-semibold text-gray-600">Links</th>
                  <th className="px-6 py-4 font-semibold text-gray-600 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">Loading...</td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">No products found.</td>
                  </tr>
                ) : (
                  products.map(product => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                            {product.images[0] ? (
                              (product.images[0].url.endsWith('.mp4') || product.images[0].url.match(/\/video\/upload\//)) ? (
                                <video src={product.images[0].url} className="w-full h-full object-cover" muted />
                              ) : (
                                <Image src={product.images[0].url} alt={product.name} fill className="object-cover" />
                              )
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Img</div>
                            )}
                          </div>
                          <span className="font-medium text-gray-800">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{product.category?.name || '-'}</td>
                      <td className="px-6 py-4 font-medium text-gray-800">Rp {product.price.toLocaleString('id-ID')}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {product.shopeeUrl && <span className="px-2 py-0.5 bg-orange-100 text-orange-600 rounded text-xs">Shopee</span>}
                          {product.tiktokUrl && <span className="px-2 py-0.5 bg-gray-100 text-black rounded text-xs">TikTok</span>}
                          {!product.shopeeUrl && !product.tiktokUrl && <span className="text-gray-400 text-xs">-</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/products/${product.id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                            <Edit size={18} />
                          </Link>
                          <button onClick={() => handleDelete(product.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
