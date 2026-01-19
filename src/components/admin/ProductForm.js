"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Upload, X, Save, ArrowLeft } from 'lucide-react';

export default function ProductForm({ initialData, categories, isEditing = false }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    price: initialData?.price || '',
    price: initialData?.price || '',
    originalPrice: initialData?.originalPrice || '',
    label: initialData?.label || '',
    shopeeUrl: initialData?.shopeeUrl || '',
    tiktokUrl: initialData?.tiktokUrl || '',
    videoUrl: initialData?.videoUrl || '',
    isBestSeller: initialData?.isBestSeller || false,
    images: initialData?.images?.map(img => img.url) || []
  });



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      ...prev,
      [name]: (name === 'price' || name === 'originalPrice') ? (value === '' ? '' : parseInt(value)) : value
    }));
  };

  const uploadFileWithProgress = (file) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const uploadData = new FormData();
      uploadData.append('file', file);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percentComplete);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            resolve(data.url);
          } catch (e) {
            reject(new Error('Invalid JSON response'));
          }
        } else {
          reject(new Error('Upload failed'));
        }
      };

      xhr.onerror = () => reject(new Error('Upload error'));
      xhr.open('POST', '/api/upload', true);
      xhr.send(uploadData);
    });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploadProgress(1); // Start progress

    for (const file of files) {
      try {
        const url = await uploadFileWithProgress(file);
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, url]
        }));
      } catch (error) {
        console.error('Upload failed', error);
        alert('Upload failed for one or more files');
      }
    }
    setUploadProgress(0); // Reset after done
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
          <ArrowLeft size={20} className="text-gray-500" />
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (Promo)</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Original Price (Coret)</label>
              <input
                type="number"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleChange}
                placeholder="Optional"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#dca5ad] outline-none"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Label / Tag (e.g. Best Seller, Almost Sold)</label>
            <input
              name="label"
              value={formData.label}
              onChange={handleChange}
              placeholder="Optional label overlay"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#dca5ad] outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isBestSeller"
              name="isBestSeller"
              checked={formData.isBestSeller}
              onChange={(e) => setFormData(prev => ({ ...prev, isBestSeller: e.target.checked }))}
              className="w-4 h-4 text-[#dca5ad] border-gray-300 rounded focus:ring-[#dca5ad]"
            />
            <label htmlFor="isBestSeller" className="text-sm font-medium text-gray-700">Set as Best Seller</label>
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
              <div>
                <label className="block text-xs font-medium text-blue-600 mb-1">Video URL (e.g. Cloudinary/MP4)</label>
                <div className="flex gap-2">
                  <input
                    name="videoUrl"
                    value={formData.videoUrl}
                    onChange={handleChange}
                    placeholder="https://res.cloudinary.com/..."
                    className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                  />
                  <div
                    className="bg-blue-600 text-white px-3 py-2 rounded-lg cursor-pointer hover:bg-blue-700 relative overflow-hidden flex items-center justify-center min-w-[40px]"
                    title="Upload Video"
                  >
                    <Upload size={16} />
                    <input
                      type="file"
                      accept="video/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (!file) return;

                        // Basic loading indicator could be added here
                        const uploadData = new FormData();
                        uploadData.append('file', file);

                        try {
                          e.target.disabled = true;
                          const originalText = e.target.parentNode.innerHTML;

                          const res = await fetch('/api/upload', { method: 'POST', body: uploadData });
                          const data = await res.json();
                          if (res.ok) {
                            setFormData(prev => ({ ...prev, videoUrl: data.url }));
                          } else {
                            alert('Video upload failed: ' + (data.error || 'Unknown error'));
                          }
                        } catch (err) {
                          console.error(err);
                          alert('Video upload failed');
                        } finally {
                          e.target.disabled = false;
                          e.target.value = null; // Reset input
                        }
                      }}
                    />
                  </div>
                </div>
                {formData.videoUrl && (
                  <div className="mt-2 relative rounded overflow-hidden bg-black aspect-video max-w-[200px]">
                    <video src={formData.videoUrl} className="w-full h-full object-cover" controls muted />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, videoUrl: '' }))}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Product Images</label>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
            {formData.images.map((url, index) => (
              <div key={index} className="relative aspect-square rounded-lg overflow-hidden border group bg-gray-50 flex items-center justify-center">
                {(url.endsWith('.mp4') || url.endsWith('.webm') || url.match(/\/video\/upload\//)) ? (
                  <video src={url} className="w-full h-full object-cover" muted playsInline />
                ) : (
                  <Image src={url} alt="Product" fill className="object-cover" />
                )}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                >
                  <X size={14} />
                </button>
                {(url.endsWith('.mp4') || url.endsWith('.webm') || url.match(/\/video\/upload\//)) && (
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/50 text-white text-[10px] rounded">VIDEO</div>
                )}
              </div>
            ))}

            <div
              className="relative aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors text-gray-400"
            >
              <Upload size={24} />
              <span className="text-xs mt-2">Upload Media</span>
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleImageUpload}
              />
            </div>
          </div>

          {uploadProgress > 0 && (
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-[#dca5ad] h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          <p className="text-xs text-gray-500">Upload multiple images or videos. The first item will be the main thumbnail.</p>
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
    </form >
  );
}
