"use client";
import { useState, useEffect, useRef } from 'react';
import { X, Save, Upload } from 'lucide-react';
import Image from 'next/image';

const SECTION_Types = [
  { value: 'HERO', label: 'Hero Slider' },
  { value: 'PRODUCT_SLIDER', label: 'Product Slider (Most Wanted)' },
  { value: 'CATEGORY_GRID', label: 'Category Grid' },
  { value: 'OFFLINE_STORE', label: 'Offline Store Banner' },
  { value: 'BANNER', label: 'Simple Banner' },
  { value: 'SHOP_THE_LOOK', label: 'Shop The Look' },
  { value: 'ARTICLES', label: 'Latest Articles / Stories' },
];

export default function SectionBuilder({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(initialData || {
    type: 'BANNER',
    title: '',
    subtitle: '',
    content: {}, // Flexible based on type
    isActive: true
  });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

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
        handleContentChange('imageUrl', data.url);
      } else {
        alert('Upload failed');
      }
    } catch (error) {
      alert('Upload error');
    } finally {
      setUploading(false);
    }
  };

  const handleFieldUpload = async (e, fieldName) => {
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
        handleContentChange(fieldName, data.url);
      } else {
        alert('Upload failed');
      }
    } catch (error) {
      alert('Upload error');
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleContentChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        [key]: value
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800">
          {initialData ? 'Edit Section' : 'Add New Section'}
        </h2>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Section Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              disabled={!!initialData} // Lock type on edit for simplicity
              className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-[#dca5ad] outline-none"
            >
              {SECTION_Types.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Active Status</label>
             <div className="flex items-center gap-2 h-[42px]">
                <input
                    type="checkbox"
                    name="isActive"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="rounded text-[#dca5ad] focus:ring-[#dca5ad]"
                />
                <label htmlFor="isActive" className="text-sm text-gray-700">Display on Homepage</label>
             </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title (Optional)</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-[#dca5ad] outline-none"
            placeholder="e.g. New Arrivals"
          />
        </div>
        
        {/* Dynamic Fields based on Type */}
        {formData.type === 'BANNER' && (
           <div className="bg-gray-50 p-4 rounded-lg border">
              <h3 className="text-sm font-medium mb-2 text-gray-500">Banner Config</h3>
              <div className="grid grid-cols-1 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Banner Image</label>
                    <div className="flex items-start gap-6">
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="relative w-full aspect-[21/9] bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-50 overflow-hidden"
                      >
                        {formData.content?.imageUrl ? (
                          <Image src={formData.content.imageUrl} alt="Preview" fill className="object-cover" />
                        ) : (
                          <div className="flex flex-col items-center text-gray-400">
                            {uploading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400"></div> : <Upload size={20} />}
                            <span className="text-xs mt-1">Upload Image</span>
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
                    </div>
                    <div className="mt-2">
                       <label className="block text-xs font-medium text-gray-500 mb-1">Or use Image URL directly</label>
                       <input
                           type="text"
                           value={formData.content?.imageUrl || ''}
                           onChange={(e) => handleContentChange('imageUrl', e.target.value)}
                           className="w-full px-3 py-2 border rounded-lg outline-none text-sm"
                           placeholder="https://..."
                       />
                    </div>
                 </div>
              </div>
           </div>
        )}
        


        {formData.type === 'SHOP_THE_LOOK' && (
           <div className="bg-gray-50 p-4 rounded-lg border space-y-6">
              <h3 className="text-sm font-medium mb-2 text-gray-500">Shop The Look Config</h3>
              
              {/* Looks List */}
              <div className="space-y-3">
                 <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-gray-700">Looks ({formData.content?.looks?.length || 0})</label>
                    <button 
                        type="button"
                        onClick={() => {
                            // Add empty look
                            const newLook = { id: Date.now(), featureImage: '', productImage: '', productName: '', price: '' };
                            const currentLooks = formData.content?.looks || [];
                            handleContentChange('looks', [...currentLooks, newLook]);
                        }}
                        className="text-xs bg-[#dca5ad] text-white px-3 py-1.5 rounded hover:bg-[#c48b94]"
                    >
                        + Add Look
                    </button>
                 </div>
                 
                 <div className="grid grid-cols-1 gap-4 max-h-[400px] overflow-y-auto pr-2">
                    {(formData.content?.looks || []).map((look, index) => (
                        <div key={look.id || index} className="bg-white p-4 rounded border relative group">
                            <button
                                type="button"
                                onClick={() => {
                                    const newLooks = formData.content.looks.filter((_, i) => i !== index);
                                    handleContentChange('looks', newLooks);
                                }}
                                className="absolute top-2 right-2 text-red-400 hover:text-red-600 p-1"
                            >
                                <X size={16} />
                            </button>
                            
                            <h4 className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">Look #{index + 1}</h4>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Feature Image */}
                                <div>
                                    <label className="text-xs text-gray-500 block mb-1">Feature Img</label>
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-16 bg-gray-100 rounded overflow-hidden relative border">
                                            {look.featureImage && <Image src={look.featureImage} alt="Feature" fill className="object-cover" />}
                                        </div>
                                        <div className="flex-1">
                                             <input 
                                                type="file" 
                                                id={`file-feature-${index}`}
                                                className="hidden"
                                                accept="image/*"
                                                onChange={async (e) => {
                                                    const file = e.target.files[0];
                                                    if(!file) return;
                                                    
                                                    const data = new FormData();
                                                    data.append('file', file);
                                                    const res = await fetch('/api/upload', { method: 'POST', body: data });
                                                    const json = await res.json();
                                                    
                                                    if(res.ok) {
                                                        const updatedLooks = [...formData.content.looks];
                                                        updatedLooks[index].featureImage = json.url;
                                                        handleContentChange('looks', updatedLooks);
                                                    }
                                                }}
                                             />
                                             <button 
                                                type="button" 
                                                onClick={() => document.getElementById(`file-feature-${index}`).click()}
                                                className="text-xs border px-2 py-1 rounded hover:bg-gray-50"
                                             >
                                                Upload
                                             </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Product Image */}
                                <div>
                                    <label className="text-xs text-gray-500 block mb-1">Product Img</label>
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden relative border">
                                            {look.productImage && <Image src={look.productImage} alt="Product" fill className="object-cover" />}
                                        </div>
                                        <div className="flex-1">
                                             <input 
                                                type="file" 
                                                id={`file-product-${index}`}
                                                className="hidden"
                                                accept="image/*"
                                                onChange={async (e) => {
                                                    const file = e.target.files[0];
                                                    if(!file) return;
                                                    
                                                    const data = new FormData();
                                                    data.append('file', file);
                                                    const res = await fetch('/api/upload', { method: 'POST', body: data });
                                                    const json = await res.json();
                                                    
                                                    if(res.ok) {
                                                        const updatedLooks = [...formData.content.looks];
                                                        updatedLooks[index].productImage = json.url;
                                                        handleContentChange('looks', updatedLooks);
                                                    }
                                                }}
                                             />
                                             <button 
                                                type="button" 
                                                onClick={() => document.getElementById(`file-product-${index}`).click()}
                                                className="text-xs border px-2 py-1 rounded hover:bg-gray-50"
                                             >
                                                Upload
                                             </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Texts */}
                                <div className="md:col-span-2 grid grid-cols-2 gap-3">
                                    <input 
                                        placeholder="Product Name"
                                        className="text-sm border rounded px-2 py-1 w-full"
                                        value={look.productName || ''}
                                        onChange={(e) => {
                                            const updatedLooks = [...formData.content.looks];
                                            updatedLooks[index].productName = e.target.value;
                                            handleContentChange('looks', updatedLooks);
                                        }}
                                    />
                                    <input 
                                        placeholder="Link (/produk/..)"
                                        className="text-sm border rounded px-2 py-1 w-full"
                                        value={look.productLink || ''}
                                        onChange={(e) => {
                                            const updatedLooks = [...formData.content.looks];
                                            updatedLooks[index].productLink = e.target.value;
                                            handleContentChange('looks', updatedLooks);
                                        }}
                                    />
                                    <input 
                                        type="number"
                                        placeholder="Price"
                                        className="text-sm border rounded px-2 py-1 w-full"
                                        value={look.price || ''}
                                        onChange={(e) => {
                                            const updatedLooks = [...formData.content.looks];
                                            updatedLooks[index].price = parseInt(e.target.value);
                                            handleContentChange('looks', updatedLooks);
                                        }}
                                    />
                                    <input 
                                        type="number"
                                        placeholder="Original Price"
                                        className="text-sm border rounded px-2 py-1 w-full"
                                        value={look.originalPrice || ''}
                                        onChange={(e) => {
                                            const updatedLooks = [...formData.content.looks];
                                            updatedLooks[index].originalPrice = parseInt(e.target.value);
                                            handleContentChange('looks', updatedLooks);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {(!formData.content?.looks || formData.content.looks.length === 0) && (
                        <div className="text-center py-8 text-gray-400 bg-white rounded border border-dashed">
                            No looks added yet.
                        </div>
                    )}
                 </div>
              </div>
           </div>
        )}

         {formData.type === 'PRODUCT_SLIDER' && (
           <div className="bg-gray-50 p-4 rounded-lg border">
              <h3 className="text-sm font-medium mb-2 text-gray-500">Slider Config</h3>
              <div className="grid grid-cols-1 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Limit Products</label>
                    <input
                        type="number"
                        value={formData.content?.limit || 10}
                        onChange={(e) => handleContentChange('limit', parseInt(e.target.value))}
                         className="w-full px-3 py-2 border rounded-lg outline-none"
                    />
                 </div>
              </div>
           </div>
        )}


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
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#dca5ad] hover:bg-[#c48b94] rounded-lg transition-colors"
          >
            <Save size={16} />
            <span>Save Section</span>
          </button>
        </div>
      </form>
    </div>
  );
}
