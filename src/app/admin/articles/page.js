"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2, FileText } from 'lucide-react';

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/articles');
      const data = await res.json();
      if (Array.isArray(data)) {
        setArticles(data);
      } else {
        console.error('Unexpected API response:', data);
        setArticles([]);
      }
    } catch (error) {
      console.error('Failed to fetch articles', error);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    try {
      const res = await fetch(`/api/admin/articles/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        fetchArticles();
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
            <h1 className="text-2xl font-bold text-gray-800">Articles / Stories</h1>
            <p className="text-gray-500">Manage your blog content and stories</p>
          </div>
          <Link 
            href="/admin/articles/new" 
            className="flex items-center gap-2 px-4 py-2 bg-[#dca5ad] text-white rounded-lg hover:bg-[#c48b94] transition-colors font-medium"
          >
            <Plus size={18} />
            Write New Article
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
           <div className="overflow-x-auto">
             <table className="w-full text-left">
               <thead className="bg-gray-50 border-b">
                 <tr>
                   <th className="px-6 py-4 font-semibold text-gray-600">Cover</th>
                   <th className="px-6 py-4 font-semibold text-gray-600">Title</th>
                   <th className="px-6 py-4 font-semibold text-gray-600">Date</th>
                   <th className="px-6 py-4 font-semibold text-gray-600 text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y">
                 {loading ? (
                    <tr>
                        <td colSpan="4" className="px-6 py-12 text-center text-gray-500">Loading...</td>
                    </tr>
                 ) : articles.length === 0 ? (
                    <tr>
                        <td colSpan="4" className="px-6 py-12 text-center text-gray-500">No articles found. Start writing!</td>
                    </tr>
                 ) : (
                    articles.map(article => (
                      <tr key={article.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                            <div className="relative w-16 h-12 rounded bg-gray-100 overflow-hidden">
                                {article.imageUrl ? (
                                   <Image src={article.imageUrl} alt={article.title} fill className="object-cover" />
                                ) : (
                                   <div className="w-full h-full flex items-center justify-center text-gray-400">
                                       <FileText size={20} />
                                   </div>
                                )}
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            <div className="font-medium text-gray-800">{article.title}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">{article.excerpt}</div>
                        </td>
                         <td className="px-6 py-4 text-sm text-gray-500">
                            {new Date(article.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                           <div className="flex items-center justify-end gap-2">
                             <Link href={`/admin/articles/${article.id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                               <Edit size={18} />
                             </Link>
                             <button onClick={() => handleDelete(article.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
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
