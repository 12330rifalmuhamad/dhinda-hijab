"use client";
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Upload, X, Save, ArrowLeft } from 'lucide-react';

import { uploadToCloudinary } from '@/lib/cloudinary';

export default function ArticleForm({ initialData, isEditing = false }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    excerpt: initialData?.excerpt || '',
    content: initialData?.content || '',
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
      const url = await uploadToCloudinary(file);
      setFormData(prev => ({
        ...prev,
        imageUrl: url
      }));
    } catch (error) {
      console.error('Upload failed', error);
      alert('Upload failed: ' + error.message);
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
      const url = isEditing ? `/api/admin/articles/${initialData.id}` : '/api/admin/articles';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push('/admin/articles');
        router.refresh();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to save article');
      }
    } catch (error) {
      console.error(error);
      alert('Error saving article');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6 border-b pb-4">
        <button type="button" onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft size={20} className="text-gray-500" />
        </button>
        <h1 className="text-xl font-bold text-gray-800">
          {isEditing ? 'Edit Article' : 'Write New Article'}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#dca5ad] outline-none text-lg font-medium"
              placeholder="Enter article title..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt (Short Summary)</label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              required
              rows={3}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#dca5ad] outline-none"
              placeholder="Brief summary to display on the homepage card..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <div className="border rounded-lg overflow-hidden flex flex-col h-[500px]">
              <div className="bg-gray-50 border-b px-3 py-2 flex items-center gap-2">
                <button type="button" onClick={() => {
                  const textarea = document.getElementById('article-content');
                  const start = textarea.selectionStart;
                  const end = textarea.selectionEnd;
                  const text = formData.content;
                  const before = text.substring(0, start);
                  const after = text.substring(end, text.length);
                  const newText = before + '<b>' + text.substring(start, end) + '</b>' + after;
                  handleChange({ target: { name: 'content', value: newText } });
                }} className="p-1.5 hover:bg-gray-200 rounded text-xs font-bold w-8 text-center" title="Bold">B</button>

                <button type="button" onClick={() => {
                  const textarea = document.getElementById('article-content');
                  const start = textarea.selectionStart;
                  const end = textarea.selectionEnd;
                  const text = formData.content;
                  const before = text.substring(0, start);
                  const after = text.substring(end, text.length);
                  const newText = before + '<i>' + text.substring(start, end) + '</i>' + after;
                  handleChange({ target: { name: 'content', value: newText } });
                }} className="p-1.5 hover:bg-gray-200 rounded text-xs italic w-8 text-center" title="Italic">I</button>

                <div className="w-[1px] h-6 bg-gray-300 mx-1"></div>

                <button type="button" onClick={() => {
                  const textarea = document.getElementById('article-content');
                  const start = textarea.selectionStart;
                  const end = textarea.selectionEnd;
                  const text = formData.content;
                  const before = text.substring(0, start);
                  const after = text.substring(end, text.length);
                  const newText = before + '<h3>' + text.substring(start, end) + '</h3>' + after;
                  handleChange({ target: { name: 'content', value: newText } });
                }} className="p-1.5 hover:bg-gray-200 rounded text-xs font-bold" title="Heading">H3</button>

                <button type="button" onClick={() => {
                  const textarea = document.getElementById('article-content');
                  const start = textarea.selectionStart;
                  const end = textarea.selectionEnd;
                  const text = formData.content;
                  const before = text.substring(0, start);
                  const after = text.substring(end, text.length);
                  const newText = before + '<p>' + text.substring(start, end) + '</p>' + after;
                  handleChange({ target: { name: 'content', value: newText } });
                }} className="p-1.5 hover:bg-gray-200 rounded text-xs" title="Paragraph">P</button>
              </div>
              <textarea
                id="article-content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                className="w-full h-full px-4 py-4 focus:outline-none resize-none font-mono text-sm"
                placeholder="Write your article content here... Use the toolbar for formatting or just write plain text."
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">Accepts HTML or plain text.</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Cover Image</label>

            <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden border group bg-gray-50">
              {formData.imageUrl ? (
                <>
                  <Image src={formData.imageUrl} alt="Cover" fill className="object-cover" />
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
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors text-gray-400"
                >
                  <Upload size={24} />
                  <span className="text-xs mt-2">Upload Cover</span>
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
            <p className="text-xs text-gray-500 mt-2">Used for homepage card and article header.</p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end pt-6 border-t font-medium">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#dca5ad] text-white rounded-lg hover:bg-[#c48b94] transition-colors disabled:opacity-50"
        >
          <Save size={18} />
          {loading ? 'Publishing...' : 'Publish Article'}
        </button>
      </div>
    </form>
  );
}
