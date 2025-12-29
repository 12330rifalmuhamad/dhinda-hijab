"use client";
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Upload, X, Save, ArrowLeft } from 'lucide-react';

export default function ProductForm({ initialData, categories, isEditing = false }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    price: initialData?.price || '',
    stock: initialData?.stock || 0,
    categoryId: initialData?.categoryId || (categories?.[0]?.id || ''),
    shopeeUrl: initialData?.shopeeUrl || '',
    tiktokUrl: initialData?.tiktokUrl || '',
    material: initialData?.material || '',
    images: initialData?.images?.map(img => img.url) || []
  });

  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? (value === '' ? '' : parseInt(value)) : value
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Upload logic here - utilizing the existing upload API
    // We upload one by one for simplicity
    for (const file of files) {
        const uploadData = new FormData();
        uploadData.append('file', file);

        try {
            const res = await fetch('/api/upload', { method: 'POST', body: uploadData });
            const data = await res.json();
            if (res.ok) {
                setFormData(prev => ({
                    ...prev,
                    images: [...prev.images, data.url]
                }));
            }
        } catch (error) {
            console.error('Upload failed', error);
        }
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEditing ? `/api/admin/products/${initialData.id}` : '/api/admin/products';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push('/admin/products');
        router.refresh();
      } else {
        alert('Failed to save product');
      }
    } catch (error) {
      console.error(error);
      alert('Error saving product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex items-center gap-4 mb-6 border-b pb-4">
         <button type="button" onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft size={20} className="text-gray-500"/>
         </button>
         <h1 className="text-xl font-bold text-gray-800">
            {isEditing ? 'Edit Product' : 'Add New Product'}
         </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Details */}
        <div className="space-y-6">
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
             <input
               name="name"
               value={formData.name}
               onChange={handleChange}
               required
               className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#dca5ad] outline-none"
             />
           </div>

           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
             <select
               name="categoryId"
               value={formData.categoryId}
               onChange={handleChange}
               className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#dca5ad] outline-none"
             >
               {categories.map(cat => (
                 <option key={cat.id} value={cat.id}>{cat.name}</option>
               ))}
             </select>
           </div>

           <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
               <input
                 type="number"
                 name="price"
                 value={formData.price}
                 onChange={handleChange}
                 required
                 className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#dca5ad] outline-none"
               />
             </div>
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
               <input
                 type="number"
                 name="stock"
                 value={formData.stock}
                 onChange={handleChange}
                 className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#dca5ad] outline-none"
               />
             </div>
           </div>

           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
             <textarea
               name="description"
               value={formData.description}
               onChange={handleChange}
               rows={4}
               className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#dca5ad] outline-none"
             />
           </div>

           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Material (Bahan)</label>
             <input
               name="material"
               value={formData.material || ''}
               onChange={handleChange}
               placeholder="Ex: Katun Bordir"
               className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#dca5ad] outline-none"
             />
           </div>

           <div className="bg-gray-50 p-4 rounded-lg border">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Marketplace Links</h3>
              <div className="space-y-3">
                 <div>
                   <label className="block text-xs font-medium text-orange-600 mb-1">Shopee URL</label>
                   <input
                     name="shopeeUrl"
                     value={formData.shopeeUrl}
                     onChange={handleChange}
                     placeholder="https://shopee.co.id/..."
                     className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                   />
                 </div>
                 <div>
                   <label className="block text-xs font-medium text-black mb-1">TikTok Shop URL</label>
                   <input
                     name="tiktokUrl"
                     value={formData.tiktokUrl}
                     onChange={handleChange}
                     placeholder="https://tiktok.com/@..."
                     className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                   />
                 </div>
              </div>
           </div>
        </div>

        {/* Right Column: Images */}
        <div>
           <label className="block text-sm font-medium text-gray-700 mb-3">Product Images</label>
           
           <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
              {formData.images.map((url, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden border group">
                   <Image src={url} alt="Product" fill className="object-cover" />
                   <button
                     type="button"
                     onClick={() => removeImage(index)}
                     className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                   >
                     <X size={14} />
                   </button>
                </div>
              ))}

              <div 
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors text-gray-400"
              >
                 <Upload size={24} />
                 <span className="text-xs mt-2">Upload</span>
              </div>
           </div>
           
           <input 
             type="file" 
             ref={fileInputRef} 
             multiple 
             accept="image/*"
             className="hidden" 
             onChange={handleImageUpload}
           />
           <p className="text-xs text-gray-500">Upload multiple images. The first image will be the main thumbnail.</p>
        </div>
      </div>

      <div className="mt-8 flex justify-end pt-6 border-t font-medium">
         <button
           type="submit"
           disabled={loading}
           className="flex items-center gap-2 px-6 py-2.5 bg-[#dca5ad] text-white rounded-lg hover:bg-[#c48b94] transition-colors disabled:opacity-50"
         >
           <Save size={18} />
           {loading ? 'Saving...' : 'Save Product'}
         </button>
      </div>
    </form>
  );
}
