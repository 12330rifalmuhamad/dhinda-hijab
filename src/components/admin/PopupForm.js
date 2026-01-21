"use client";
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Upload, X, Save } from 'lucide-react';

import { uploadToCloudinary } from '@/lib/cloudinary';

export default function PopupForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [formData, setFormData] = useState({
        id: '',
        imageUrl: '',
        title: '',
        linkUrl: '',
        isActive: true,
    });

    const fileInputRef = useRef(null);

    useEffect(() => {
        fetch('/api/admin/popup')
            .then(res => res.json())
            .then(data => {
                if (data && data.id) {
                    setFormData({
                        id: data.id,
                        imageUrl: data.imageUrl || '',
                        title: data.title || '',
                        linkUrl: data.linkUrl || '',
                        isActive: data.isActive,
                    });
                }
            })
            .catch(err => console.error(err))
            .finally(() => setFetching(false));
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setLoading(true);
            const url = await uploadToCloudinary(file);
            setFormData(prev => ({ ...prev, imageUrl: url }));
        } catch (error) {
            console.error('Upload failed', error);
            alert('Upload failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const removeImage = () => {
        setFormData(prev => ({ ...prev, imageUrl: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/admin/popup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                const data = await res.json();
                setFormData(prev => ({ ...prev, id: data.id })); // Update ID if it was new
                alert('Popup settings saved!');
                router.refresh();
            } else {
                alert('Failed to save popup settings');
            }
        } catch (error) {
            console.error(error);
            alert('Error saving popup settings');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="p-8 text-center text-gray-500">Loading settings...</div>;

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border p-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-6 border-b pb-4">
                <h1 className="text-xl font-bold text-gray-800">
                    Popup Banner Settings
                </h1>
            </div>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Banner Image</label>

                    {formData.imageUrl ? (
                        <div className="relative aspect-video w-full rounded-lg overflow-hidden border group bg-gray-50">
                            <Image src={formData.imageUrl} alt="Popup Banner" fill className="object-contain" />
                            <button
                                type="button"
                                onClick={removeImage}
                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ) : (
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="aspect-video w-full rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors text-gray-400"
                        >
                            <Upload size={32} />
                            <span className="text-sm mt-2">Click to Upload Banner</span>
                        </div>
                    )}

                    <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title (Optional)</label>
                    <input
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#dca5ad] outline-none"
                        placeholder="Promo Spesial Hari Ini!"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Link URL (Optional)</label>
                    <input
                        name="linkUrl"
                        value={formData.linkUrl}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#dca5ad] outline-none"
                        placeholder="https://..."
                    />
                </div>

                <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
                    <input
                        type="checkbox"
                        id="isActive"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleChange}
                        className="w-5 h-5 text-[#dca5ad] rounded focus:ring-[#dca5ad]"
                    />
                    <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Activate Popup</label>
                    <span className="text-xs text-gray-500">(If unchecked, popup will not appear on the website)</span>
                </div>
            </div>

            <div className="mt-8 flex justify-end pt-6 border-t font-medium">
                <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#dca5ad] text-white rounded-lg hover:bg-[#c48b94] transition-colors disabled:opacity-50"
                >
                    <Save size={18} />
                    {loading ? 'Saving...' : 'Save Settings'}
                </button>
            </div>
        </form>
    );
}
