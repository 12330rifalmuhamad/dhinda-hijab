"use client";
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Upload, X, Save, ArrowLeft } from 'lucide-react';

import { uploadToCloudinary } from '@/lib/cloudinary';

export default function CategoryForm({ initialData, isEditing = false }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    imageUrl: initialData?.imageUrl || '',
  });

  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setUploadProgress(0);
      const url = await uploadToCloudinary(file, setUploadProgress);
      setFormData(prev => ({
        ...prev,
        imageUrl: url
      }));
    } catch (error) {
      console.error('Upload failed', error);
      alert('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      imageUrl: ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEditing ? `/api/admin/categories/${initialData.id}` : '/api/admin/categories';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push('/admin/categories');
        router.refresh();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to save category');
      }
    } catch (error) {
      console.error(error);
      alert('Error saving category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6 border-b pb-4">
        <button type="button" onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft size={20} className="text-gray-500" />
        </button>
        <h1 className="text-xl font-bold text-gray-800">
          {isEditing ? 'Edit Category' : 'Add New Category'}
        </h1>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#dca5ad] outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Category Banner Image</label>

          <div className="relative w-full aspect-[4/3] sm:aspect-[3/4] max-w-xs mx-auto rounded-lg overflow-hidden border group">
            {formData.imageUrl ? (
              <>
                <Image src={formData.imageUrl} alt="Category" fill className="object-cover" />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={14} />
                </button>
              </>
            ) : (
              <div
                onClick={() => {
                  if (!formData.imageUrl) fileInputRef.current?.click();
                }}
                className="w-full h-full bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors text-gray-400"
              >
                {uploading ? (
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#dca5ad] mb-2"></div>
                    <span className="text-xs font-medium">{uploadProgress}% Uploading...</span>
                  </div>
                ) : (
                  <>
                    <Upload size={24} />
                    <span className="text-xs mt-2">Upload Image</span>
                  </>
                )}
              </div>
            )}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
          <p className="text-xs text-gray-500 text-center mt-2">Recommended: Portrait or Square image for best display on Category Cards.</p>
        </div>
      </div>

      <div className="mt-8 flex justify-end pt-6 border-t font-medium">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#dca5ad] text-white rounded-lg hover:bg-[#c48b94] transition-colors disabled:opacity-50"
        >
          <Save size={18} />
          {loading ? 'Saving...' : 'Save Category'}
        </button>
      </div>
    </form>
  );
}
