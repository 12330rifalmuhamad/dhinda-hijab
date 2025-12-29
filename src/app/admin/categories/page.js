"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/categories');
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this category? Products in this category might be affected.')) return;
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        fetchCategories();
      } else {
        alert(data.error || 'Failed to delete');
      }
    } catch (error) {
      alert('Failed to delete');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
            <p className="text-gray-500">Manage product categories</p>
          </div>
          <Link 
            href="/admin/categories/new" 
            className="flex items-center gap-2 px-4 py-2 bg-[#dca5ad] text-white rounded-lg hover:bg-[#c48b94] transition-colors font-medium"
          >
            <Plus size={18} />
            Add Category
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
           <div className="overflow-x-auto">
             <table className="w-full text-left">
               <thead className="bg-gray-50 border-b">
                 <tr>
                   <th className="px-6 py-4 font-semibold text-gray-600">Image</th>
                   <th className="px-6 py-4 font-semibold text-gray-600">Name</th>
                   <th className="px-6 py-4 font-semibold text-gray-600 text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y">
                 {loading ? (
                    <tr>
                        <td colSpan="3" className="px-6 py-12 text-center text-gray-500">Loading...</td>
                    </tr>
                 ) : categories.length === 0 ? (
                    <tr>
                        <td colSpan="3" className="px-6 py-12 text-center text-gray-500">No categories found.</td>
                    </tr>
                 ) : (
                    categories.map(category => (
                      <tr key={category.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                            <div className="relative w-12 h-16 rounded bg-gray-100 overflow-hidden">
                                {category.imageUrl ? (
                                   <Image src={category.imageUrl} alt={category.name} fill className="object-cover" />
                                ) : (
                                   <div className="w-full h-full flex items-center justify-center text-gray-400 text-[10px]">No Img</div>
                                )}
                            </div>
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-800">{category.name}</td>
                        <td className="px-6 py-4 text-right">
                           <div className="flex items-center justify-end gap-2">
                             <Link href={`/admin/categories/${category.id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                               <Edit size={18} />
                             </Link>
                             <button onClick={() => handleDelete(category.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
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
