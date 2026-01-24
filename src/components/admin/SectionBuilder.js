"use client";
import { useState, useEffect, useRef } from 'react';
import { X, Save, Upload } from 'lucide-react';
import Image from 'next/image';
import { uploadToCloudinary } from '@/lib/cloudinary';

const SECTION_Types = [
  { value: 'HERO', label: 'Hero Slider' },
  { value: 'PRODUCT_SLIDER', label: 'Product Slider (Most Wanted)' },
  { value: 'CATEGORY_GRID', label: 'Category Grid' },
  { value: 'OFFLINE_STORE', label: 'Offline Store Banner' },
  { value: 'BANNER', label: 'Simple Banner' },
  { value: 'SHOP_THE_LOOK', label: 'Shop The Look' },
  { value: 'ARTICLES', label: 'Latest Articles / Stories' },
  { value: 'TESTIMONY', label: 'Customer Testimonies' },
  { value: 'GALLERY', label: 'Collage Gallery' },
  { value: 'SOCIAL_LINKS', label: 'Social Media & Marketplace' },
];

export default function SectionBuilder({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(initialData || {
    type: 'BANNER',
    title: '',
    subtitle: '',
    content: {}, // Flexible based on type
    backgroundColor: '',
    gradientStart: '',
    gradientEnd: '',
    backgroundImage: '',
    isActive: true
  });
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const url = await uploadToCloudinary(file, setUploadProgress);
      handleContentChange('imageUrl', url);
    } catch (error) {
      alert('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFieldUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const url = await uploadToCloudinary(file, setUploadProgress);
      handleContentChange(fieldName, url);
    } catch (error) {
      alert('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleTopLevelUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const url = await uploadToCloudinary(file, setUploadProgress);
      setFormData(prev => ({
        ...prev,
        [field]: url
      }));
    } catch (error) {
      alert('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
      setUploadProgress(0);
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

        <div className="bg-gray-50 p-4 rounded-lg border space-y-4">
          <h3 className="text-sm font-medium text-gray-800">Background Settings</h3>

          {/* Solid Color */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Solid Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                name="backgroundColor"
                value={formData.backgroundColor || '#ffffff'}
                onChange={handleChange}
                className="h-[38px] w-[50px] p-1 border rounded cursor-pointer"
              />
              <input
                name="backgroundColor"
                value={formData.backgroundColor || ''}
                onChange={handleChange}
                className="flex-1 px-3 py-2 border rounded-lg text-sm outline-none"
                placeholder="#ffffff"
              />
            </div>
          </div>

          {/* Gradient */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Gradient Start</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  name="gradientStart"
                  value={formData.gradientStart || '#ffffff'}
                  onChange={handleChange}
                  className="h-[38px] w-[50px] p-1 border rounded cursor-pointer"
                />
                <input
                  name="gradientStart"
                  value={formData.gradientStart || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg text-sm outline-none"
                  placeholder="Start Color"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Gradient End</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  name="gradientEnd"
                  value={formData.gradientEnd || '#ffffff'}
                  onChange={handleChange}
                  className="h-[38px] w-[50px] p-1 border rounded cursor-pointer"
                />
                <input
                  name="gradientEnd"
                  value={formData.gradientEnd || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg text-sm outline-none"
                  placeholder="End Color"
                />
              </div>
            </div>
          </div>

          {/* Background Image */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Background Image</label>
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 bg-gray-100 rounded border flex-shrink-0 overflow-hidden">
                {formData.backgroundImage ? (
                  <>
                    <Image src={formData.backgroundImage} alt="Bg" fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, backgroundImage: '' }))}
                      className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl"
                    >
                      <X size={12} />
                    </button>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <Upload size={20} />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  id="bg-image-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleFieldUpload(e, 'backgroundImage')}
                />
                <button
                  type="button"
                  onClick={() => document.getElementById('bg-image-upload').click()}
                  className="text-xs bg-white border px-3 py-2 rounded hover:bg-gray-50 mb-2"
                >
                  Upload Image
                </button>
                <input
                  type="text"
                  value={formData.backgroundImage || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, backgroundImage: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg text-xs outline-none"
                  placeholder="Or paste Image URL..."
                />
              </div>
            </div>
          </div>
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
                    onClick={() => {
                      if (!formData.content?.imageUrl) fileInputRef.current?.click();
                    }}
                    className="relative w-full aspect-[21/9] bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center hover:bg-gray-50 overflow-hidden group"
                  >
                    {formData.content?.imageUrl ? (
                      <>
                        <Image src={formData.content.imageUrl} alt="Preview" fill className="object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleContentChange('imageUrl', '');
                            }}
                            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                          >
                            <X size={20} />
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center text-gray-400">
                        {uploading ? (
                          <div className="flex flex-col items-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#dca5ad] mb-2"></div>
                            <span className="text-xs font-medium">{uploadProgress}% Uploading...</span>
                          </div>
                        ) : (
                          <>
                            <Upload size={24} />
                            <span className="text-xs mt-2">Click to Upload Image</span>
                          </>
                        )}
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
                          <div className="w-12 h-16 bg-gray-100 rounded overflow-hidden relative border group">
                            {look.featureImage ? (
                              <>
                                <Image src={look.featureImage} alt="Feature" fill className="object-cover" />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updatedLooks = [...formData.content.looks];
                                    updatedLooks[index].featureImage = '';
                                    handleContentChange('looks', updatedLooks);
                                  }}
                                  className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                                >
                                  <X size={14} />
                                </button>
                              </>
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-300">
                                {uploading ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div> : <Upload size={14} />}
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <input
                              type="file"
                              id={`file-feature-${index}`}
                              className="hidden"
                              accept="image/*"
                              onChange={async (e) => {
                                const file = e.target.files[0];
                                if (!file) return;

                                setUploading(true);
                                setUploadProgress(0);
                                try {
                                  const url = await uploadToCloudinary(file, setUploadProgress);
                                  const updatedLooks = [...formData.content.looks];
                                  updatedLooks[index].featureImage = url;
                                  handleContentChange('looks', updatedLooks);
                                } catch (err) {
                                  console.error(err);
                                  alert('Upload failed');
                                } finally {
                                  setUploading(false);
                                  setUploadProgress(0);
                                }
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => document.getElementById(`file-feature-${index}`).click()}
                              className="text-xs border px-2 py-1 rounded hover:bg-gray-50 flex items-center gap-1"
                              disabled={uploading}
                            >
                              {uploading ? '...' : 'Upload'}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Product Image */}
                      <div>
                        <label className="text-xs text-gray-500 block mb-1">Product Img</label>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden relative border group">
                            {look.productImage ? (
                              <>
                                <Image src={look.productImage} alt="Product" fill className="object-cover" />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updatedLooks = [...formData.content.looks];
                                    updatedLooks[index].productImage = '';
                                    handleContentChange('looks', updatedLooks);
                                  }}
                                  className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                                >
                                  <X size={14} />
                                </button>
                              </>
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-300">
                                {uploading ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div> : <Upload size={14} />}
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <input
                              type="file"
                              id={`file-product-${index}`}
                              className="hidden"
                              accept="image/*"
                              onChange={async (e) => {
                                const file = e.target.files[0];
                                if (!file) return;

                                setUploading(true);
                                setUploadProgress(0);
                                try {
                                  const url = await uploadToCloudinary(file, setUploadProgress);
                                  const updatedLooks = [...formData.content.looks];
                                  updatedLooks[index].productImage = url;
                                  handleContentChange('looks', updatedLooks);
                                } catch (err) {
                                  console.error(err);
                                  alert('Upload failed');
                                } finally {
                                  setUploading(false);
                                  setUploadProgress(0);
                                }
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => document.getElementById(`file-product-${index}`).click()}
                              className="text-xs border px-2 py-1 rounded hover:bg-gray-50 flex items-center gap-1"
                              disabled={uploading}
                            >
                              {uploading ? '...' : 'Upload'}
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

        {formData.type === 'OFFLINE_STORE' && (
          <div className="bg-gray-50 p-4 rounded-lg border space-y-6">
            <h3 className="text-sm font-medium mb-2 text-gray-500">Stores Config</h3>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700">Stores ({formData.content?.stores?.length || 0})</label>
                <button
                  type="button"
                  onClick={() => {
                    const newStore = { id: Date.now(), city: '', mall: '', address: '', hours: '', mapUrl: '' };
                    const current = formData.content?.stores || [];
                    handleContentChange('stores', [...current, newStore]);
                  }}
                  className="text-xs bg-[#dca5ad] text-white px-3 py-1.5 rounded hover:bg-[#c48b94]"
                >
                  + Add Store
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 max-h-[500px] overflow-y-auto pr-2">
                {(formData.content?.stores || []).map((store, index) => (
                  <div key={store.id || index} className="bg-white p-4 rounded border relative group">
                    <button
                      type="button"
                      onClick={() => {
                        const newStores = formData.content.stores.filter((_, i) => i !== index);
                        handleContentChange('stores', newStores);
                      }}
                      className="absolute top-2 right-2 text-red-400 hover:text-red-600 p-1"
                    >
                      <X size={16} />
                    </button>

                    <h4 className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">Store #{index + 1}</h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <input
                          placeholder="City (e.g. Cikampek)"
                          className="text-sm border rounded px-2 py-1 w-full"
                          value={store.city || ''}
                          onChange={(e) => {
                            const newStores = [...formData.content.stores];
                            newStores[index].city = e.target.value;
                            handleContentChange('stores', newStores);
                          }}
                        />
                        <input
                          placeholder="Mall / Location (e.g. Mall Bohemi)"
                          className="text-sm border rounded px-2 py-1 w-full"
                          value={store.mall || ''}
                          onChange={(e) => {
                            const newStores = [...formData.content.stores];
                            newStores[index].mall = e.target.value;
                            handleContentChange('stores', newStores);
                          }}
                        />
                      </div>
                      <div className="space-y-3">
                        <input
                          placeholder="Address (Full Address)"
                          className="text-sm border rounded px-2 py-1 w-full"
                          value={store.address || ''}
                          onChange={(e) => {
                            const newStores = [...formData.content.stores];
                            newStores[index].address = e.target.value;
                            handleContentChange('stores', newStores);
                          }}
                        />
                        <input
                          placeholder="Hours (e.g. 10:00 - 22:00)"
                          className="text-sm border rounded px-2 py-1 w-full"
                          value={store.hours || ''}
                          onChange={(e) => {
                            const newStores = [...formData.content.stores];
                            newStores[index].hours = e.target.value;
                            handleContentChange('stores', newStores);
                          }}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <input
                          placeholder="Map Embed URL (src from iframe)"
                          className="text-sm border rounded px-2 py-1 w-full font-mono text-gray-500"
                          value={store.mapUrl || ''}
                          onChange={(e) => {
                            const newStores = [...formData.content.stores];
                            newStores[index].mapUrl = e.target.value;
                            handleContentChange('stores', newStores);
                          }}
                        />
                        <p className="text-[10px] text-gray-400 mt-1">
                          Paste the &apos;src&apos; link from Google Maps Embed iframe.
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {(!formData.content?.stores || formData.content.stores.length === 0) && (
                  <div className="text-center py-8 text-gray-400 bg-white rounded border border-dashed">
                    No stores added.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}


        {formData.type === 'TESTIMONY' && (
          <div className="bg-gray-50 p-4 rounded-lg border space-y-6">
            <h3 className="text-sm font-medium mb-2 text-gray-500">Testimony Config</h3>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700">Testimonies ({formData.content?.estimoni?.length || 0})</label>
                <button
                  type="button"
                  onClick={() => {
                    const newTestimony = { id: Date.now(), name: '', role: '', message: '', image: '' };
                    const current = formData.content?.estimoni || [];
                    handleContentChange('estimoni', [...current, newTestimony]);
                  }}
                  className="text-xs bg-[#dca5ad] text-white px-3 py-1.5 rounded hover:bg-[#c48b94]"
                >
                  + Add Testimony
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 max-h-[400px] overflow-y-auto pr-2">
                {(formData.content?.estimoni || []).map((item, index) => (
                  <div key={item.id || index} className="bg-white p-4 rounded border relative group">
                    <button
                      type="button"
                      onClick={() => {
                        const newItems = formData.content.estimoni.filter((_, i) => i !== index);
                        handleContentChange('estimoni', newItems);
                      }}
                      className="absolute top-2 right-2 text-red-400 hover:text-red-600 p-1"
                    >
                      <X size={16} />
                    </button>

                    <h4 className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">Testimony #{index + 1}</h4>

                    <div className="flex gap-4">
                      {/* Image */}
                      <div className="w-16 h-16 bg-gray-100 rounded-full overflow-hidden relative flex-shrink-0 border group">
                        {item.image ? (
                          <>
                            <Image src={item.image} alt="User" fill className="object-cover" />
                            <button
                              type="button"
                              onClick={() => {
                                const newItems = [...formData.content.estimoni];
                                newItems[index].image = '';
                                handleContentChange('estimoni', newItems);
                              }}
                              className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                            >
                              <X size={16} />
                            </button>
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            {uploading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400"></div> : <Upload size={16} />}
                          </div>
                        )}
                        <input
                          type="file"
                          id={`testimony-img-${index}`}
                          className="hidden"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            setUploading(true);
                            setUploadProgress(0);
                            try {
                              const url = await uploadToCloudinary(file, setUploadProgress);
                              const newItems = [...formData.content.estimoni];
                              newItems[index].image = url;
                              handleContentChange('estimoni', newItems);
                            } catch (err) {
                              console.error(err);
                              alert('Upload failed');
                            } finally {
                              setUploading(false);
                              setUploadProgress(0);
                            }
                          }}
                        />
                        {!item.image && !uploading && (
                          <button
                            type="button"
                            onClick={() => document.getElementById(`testimony-img-${index}`).click()}
                            className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors"
                          />
                        )}
                      </div>

                      {/* Inputs */}
                      <div className="flex-1 space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            placeholder="Name (e.g. Sarah J.)"
                            className="text-sm border rounded px-2 py-1 w-full"
                            value={item.name || ''}
                            onChange={(e) => {
                              const newItems = [...formData.content.estimoni];
                              newItems[index].name = e.target.value;
                              handleContentChange('estimoni', newItems);
                            }}
                          />
                          <input
                            placeholder="Role (Optional)"
                            className="text-sm border rounded px-2 py-1 w-full"
                            value={item.role || ''}
                            onChange={(e) => {
                              const newItems = [...formData.content.estimoni];
                              newItems[index].role = e.target.value;
                              handleContentChange('estimoni', newItems);
                            }}
                          />
                        </div>
                        <textarea
                          placeholder="Message..."
                          rows={2}
                          className="text-sm border rounded px-2 py-1 w-full"
                          value={item.message || ''}
                          onChange={(e) => {
                            const newItems = [...formData.content.estimoni];
                            newItems[index].message = e.target.value;
                            handleContentChange('estimoni', newItems);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {(!formData.content?.estimoni || formData.content.estimoni.length === 0) && (
                  <div className="text-center py-8 text-gray-400 bg-white rounded border border-dashed">
                    No testimonies added yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {formData.type === 'GALLERY' && (
          <div className="bg-gray-50 p-4 rounded-lg border space-y-4">
            <h3 className="text-sm font-medium mb-2 text-gray-500">Gallery Config</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Source</label>
              <select
                value={formData.content?.source || 'DYNAMIC'}
                onChange={(e) => handleContentChange('source', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg outline-none"
              >
                <option value="DYNAMIC">Dynamic (Latest Products)</option>
                <option value="MANUAL">Manual (Upload Images)</option>
              </select>
            </div>

            {formData.content?.source === 'MANUAL' && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-700">Images ({formData.content?.images?.length || 0})</label>
                  <div className="flex items-center gap-2">
                    {uploading && uploadProgress > 0 && (
                      <span className="text-xs text-[#dca5ad] font-medium">{uploadProgress}%</span>
                    )}
                    <input
                      type="file"
                      id="gallery-upload"
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={async (e) => {
                        const files = Array.from(e.target.files);
                        if (!files.length) return;

                        setUploading(true);
                        setUploadProgress(0);

                        const newUrls = [];
                        for (const file of files) {
                          try {
                            const url = await uploadToCloudinary(file, setUploadProgress);
                            newUrls.push({ url: url });
                          } catch (err) {
                            console.error(err);
                            alert(`Upload failed for ${file.name}`);
                          }
                        }

                        const currentImages = formData.content?.images || [];
                        handleContentChange('images', [...currentImages, ...newUrls]);
                        setUploading(false);
                        setUploadProgress(0);
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => document.getElementById('gallery-upload').click()}
                      disabled={uploading}
                      className="text-xs bg-[#dca5ad] text-white px-3 py-1.5 rounded hover:bg-[#c48b94] disabled:opacity-50 flex items-center gap-2"
                    >
                      {uploading ? (
                        <>
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                          Uploading...
                        </>
                      ) : (
                        "+ Upload Images"
                      )}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {(formData.content?.images || []).map((img, index) => (
                    <div key={index} className="relative aspect-square bg-gray-200 rounded overflow-hidden group">
                      <Image src={img.url} alt="Gallery" fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          const newImages = formData.content.images.filter((_, i) => i !== index);
                          handleContentChange('images', newImages);
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  {(!formData.content?.images || formData.content.images.length === 0) && (
                    <div className="col-span-full text-center py-8 text-gray-400 border border-dashed rounded">
                      No images uploaded. The gallery will look empty.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {formData.type === 'SOCIAL_LINKS' && (
          <div className="bg-gray-50 p-4 rounded-lg border space-y-6">
            <h3 className="text-sm font-medium mb-2 text-gray-500">Social Links & Marketplace</h3>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700">Links ({formData.content?.links?.length || 0})</label>
                <button
                  type="button"
                  onClick={() => {
                    const newLink = { id: Date.now(), name: '', url: '', icon: '' };
                    const current = formData.content?.links || [];
                    handleContentChange('links', [...current, newLink]);
                  }}
                  className="text-xs bg-[#dca5ad] text-white px-3 py-1.5 rounded hover:bg-[#c48b94]"
                >
                  + Add Link
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 max-h-[400px] overflow-y-auto pr-2">
                {(formData.content?.links || []).map((link, index) => (
                  <div key={link.id || index} className="bg-white p-4 rounded border relative group">
                    <button
                      type="button"
                      onClick={() => {
                        const newLinks = formData.content.links.filter((_, i) => i !== index);
                        handleContentChange('links', newLinks);
                      }}
                      className="absolute top-2 right-2 text-red-400 hover:text-red-600 p-1"
                    >
                      <X size={16} />
                    </button>

                    <h4 className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">Link #{index + 1}</h4>

                    <div className="flex gap-4">
                      {/* Icon */}
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden relative flex-shrink-0 border flex items-center justify-center">
                        {link.icon ? (
                          <Image src={link.icon} alt="Icon" fill className="object-cover" />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-gray-300">
                            <Upload size={16} />
                            <span className="text-[9px] mt-1">Icon</span>
                          </div>
                        )}
                        <input
                          type="file"
                          id={`link-icon-${index}`}
                          className="hidden"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            try {
                              const url = await uploadToCloudinary(file);
                              const newLinks = [...formData.content.links];
                              newLinks[index].icon = url;
                              handleContentChange('links', newLinks);
                            } catch (err) {
                              console.error(err);
                              alert('Upload failed');
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => document.getElementById(`link-icon-${index}`).click()}
                          className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors"
                        />
                      </div>

                      {/* Inputs */}
                      <div className="flex-1 space-y-3">
                        <input
                          placeholder="Platform Name (e.g. Shopee)"
                          className="text-sm border rounded px-2 py-1 w-full"
                          value={link.name || ''}
                          onChange={(e) => {
                            const newLinks = [...formData.content.links];
                            newLinks[index].name = e.target.value;
                            handleContentChange('links', newLinks);
                          }}
                        />
                        <input
                          placeholder="URL (https://...)"
                          className="text-sm border rounded px-2 py-1 w-full"
                          value={link.url || ''}
                          onChange={(e) => {
                            const newLinks = [...formData.content.links];
                            newLinks[index].url = e.target.value;
                            handleContentChange('links', newLinks);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                {(!formData.content?.links || formData.content.links.length === 0) && (
                  <div className="text-center py-8 text-gray-400 bg-white rounded border border-dashed">
                    No links added yet.
                  </div>
                )}
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
