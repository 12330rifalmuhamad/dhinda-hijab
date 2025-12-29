"use client";
import { useState, useRef } from 'react';
import { Image as ImageIcon, Check, X, Upload } from 'lucide-react';
import Image from 'next/image';

export default function HeroSlideForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(initialData || {
    leftTitle: '',
    leftSubtitle: '',
    rightTitle: '',
    rightSubtitle: '',
    image: '',
    isActive: true
  });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      const data = await res.json();
      if (res.ok) {
        setFormData(prev => ({ ...prev, image: data.url }));
      } else {
        alert('Upload failed');
      }
    } catch (error) {
      alert('Upload error');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800">
          {initialData ? 'Edit Slide' : 'New Slide'}
        </h2>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Slide Image</label>
          <div className="flex items-start gap-6">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="relative w-full aspect-[21/9] bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-50 overflow-hidden"
            >
              {formData.image ? (
                <Image src={formData.image} alt="Preview" fill className="object-cover" />
              ) : (
                <div className="flex flex-col items-center text-gray-400">
                  {uploading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400"></div> : <Upload size={20} />}
                  <span className="text-xs mt-1">Upload</span>
                </div>
              )}
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleImageUpload}
            />
            <div className="flex-1 text-sm text-gray-500">
              <p>Recommended size: 3360x940px (Ultra Wide)</p>
              <p>Note: Mobile will crop to center (Vertical 3:4)</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Text */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900 border-b pb-2">Left Text Content</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                name="leftTitle"
                value={formData.leftTitle}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-[#dca5ad] outline-none"
                placeholder="e.g. RAMADAN"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
              <input
                name="leftSubtitle"
                value={formData.leftSubtitle}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-[#dca5ad] outline-none"
                placeholder="e.g. EXCLUSIVE"
              />
            </div>
          </div>

          {/* Right Text */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900 border-b pb-2">Right Text Content</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                name="rightTitle"
                value={formData.rightTitle}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-[#dca5ad] outline-none"
                placeholder="e.g. Collection"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
              <input
                name="rightSubtitle"
                value={formData.rightSubtitle}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-[#dca5ad] outline-none"
                placeholder="e.g. 2024"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isActive"
            id="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="rounded text-[#dca5ad] focus:ring-[#dca5ad]"
          />
          <label htmlFor="isActive" className="text-sm text-gray-700">Set as Active Slide</label>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-[#dca5ad] hover:bg-[#c48b94] rounded-lg transition-colors"
          >
            Save Slide
          </button>
        </div>
      </form>
    </div>
  );
}
