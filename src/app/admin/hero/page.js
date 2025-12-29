"use client";
import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, GripVertical, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import HeroSlideForm from '@/components/admin/HeroSlideForm';

export default function AdminHeroPage() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const res = await fetch('/api/admin/hero-slides');
      if (res.ok) {
        const data = await res.json();
        setSlides(data);
      }
    } catch (error) {
      console.error('Failed to fetch slides');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (formData) => {
    try {
      const res = await fetch('/api/admin/hero-slides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setShowForm(false);
        fetchSlides();
      }
    } catch (error) {
      alert('Failed to create slide');
    }
  };

  const handleUpdate = async (formData) => {
    try {
      const res = await fetch(`/api/admin/hero-slides/${editingSlide.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setEditingSlide(null);
        fetchSlides();
      }
    } catch (error) {
      alert('Failed to update slide');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this slide?')) return;
    try {
      const res = await fetch(`/api/admin/hero-slides/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchSlides();
      }
    } catch (error) {
      alert('Failed to delete slide');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Hero Slides</h1>
        {!showForm && !editingSlide && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-[#dca5ad] text-white px-4 py-2 rounded-lg hover:bg-[#c48b94] transition-colors"
          >
            <Plus size={20} />
            <span>Add Slide</span>
          </button>
        )}
      </div>

      {(showForm || editingSlide) ? (
        <HeroSlideForm
          initialData={editingSlide}
          onSubmit={editingSlide ? handleUpdate : handleCreate}
          onCancel={() => {
            setShowForm(false);
            setEditingSlide(null);
          }}
        />
      ) : (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading slides...</div>
          ) : slides.length === 0 ? (
            <div className="p-12 text-center text-gray-500 flex flex-col items-center">
              <div className="bg-gray-100 p-4 rounded-full mb-4">
                <ImageIcon size={32} className="text-gray-400" />
              </div>
              <p>No slides found. Create one to get started.</p>
            </div>
          ) : (
            <div className="divide-y">
              {slides.map((slide) => (
                <div key={slide.id} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                  <div className="text-gray-400 cursor-move">
                    <GripVertical size={20} />
                  </div>
                  
                  <div className="relative w-24 h-16 rounded-lg overflow-hidden bg-gray-100 border">
                    <Image src={slide.image} alt="Slide" fill className="object-cover" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">
                      {slide.leftTitle} {slide.leftSubtitle}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">
                      {slide.rightTitle} {slide.rightSubtitle}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                     <span className={`px-2 py-1 rounded-full text-xs font-medium ${slide.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                        {slide.isActive ? 'Active' : 'Inactive'}
                     </span>
                    <button 
                      onClick={() => setEditingSlide(slide)}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(slide.id)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
