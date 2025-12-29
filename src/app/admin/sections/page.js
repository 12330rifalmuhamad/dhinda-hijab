"use client";
import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, GripVertical, Layers } from 'lucide-react';
import SectionBuilder from '@/components/admin/SectionBuilder';

export default function AdminSectionsPage() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSection, setEditingSection] = useState(null);

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const res = await fetch('/api/admin/sections');
      if (res.ok) {
        setSections(await res.json());
      }
    } catch (error) {
      console.error('Failed to fetch sections');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (formData) => {
    try {
      const res = await fetch('/api/admin/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setShowForm(false);
        fetchSections();
      }
    } catch (error) {
      alert('Failed to create section');
    }
  };

  const handleUpdate = async (formData) => {
    try {
      const res = await fetch(`/api/admin/sections/${editingSection.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setEditingSection(null);
        fetchSections();
      }
    } catch (error) {
      alert('Failed to update section');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this section?')) return;
    try {
      const res = await fetch(`/api/admin/sections/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchSections();
      }
    } catch (error) {
      alert('Failed to delete section');
    }
  };

  const moveSection = async (index, direction) => {
     const newSections = [...sections];
     if (direction === 'up' && index > 0) {
        [newSections[index], newSections[index - 1]] = [newSections[index - 1], newSections[index]];
     } else if (direction === 'down' && index < newSections.length - 1) {
        [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
     } else {
        return;
     }
     
     // Optimistic update
     setSections(newSections);

     // Sync to DB (update orders)
     const updates = newSections.map((s, i) => ({ id: s.id, order: i }));
     try {
        await fetch('/api/admin/sections', {
           method: 'PUT',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ sections: updates }),
        });
     } catch (err) {
        fetchSections(); // Revert on failure
     }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Homepage Sections</h1>
        {!showForm && !editingSection && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-[#dca5ad] text-white px-4 py-2 rounded-lg hover:bg-[#c48b94] transition-colors"
          >
            <Plus size={20} />
            <span>Add Section</span>
          </button>
        )}
      </div>

      {(showForm || editingSection) ? (
        <SectionBuilder
          initialData={editingSection}
          onSubmit={editingSection ? handleUpdate : handleCreate}
          onCancel={() => {
            setShowForm(false);
            setEditingSection(null);
          }}
        />
      ) : (
        <div className="space-y-4">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading sections...</div>
          ) : sections.length === 0 ? (
            <div className="p-12 text-center text-gray-500 flex flex-col items-center bg-white rounded-xl border">
              <div className="bg-gray-100 p-4 rounded-full mb-4">
                <Layers size={32} className="text-gray-400" />
              </div>
              <p>No sections found. Start building your homepage.</p>
            </div>
          ) : (
            sections.map((section, index) => (
              <div key={section.id} className="bg-white p-4 rounded-xl shadow-sm border flex items-center gap-4 group">
                <div className="flex flex-col gap-1">
                   <button onClick={() => moveSection(index, 'up')} disabled={index === 0} className="text-gray-400 hover:text-gray-600 disabled:opacity-30">▲</button>
                   <button onClick={() => moveSection(index, 'down')} disabled={index === sections.length - 1} className="text-gray-400 hover:text-gray-600 disabled:opacity-30">▼</button>
                </div>
                
                <div className="p-3 bg-gray-100 rounded-lg">
                   <Layers size={24} className="text-gray-500" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                     <h3 className="font-semibold text-gray-900">{section.type.replace('_', ' ')}</h3>
                     {!section.isActive && <span className="px-2 py-0.5 bg-gray-200 text-gray-600 text-xs rounded-full">Inactive</span>}
                  </div>
                  {section.title && <p className="text-sm text-gray-500">Title: {section.title}</p>}
                </div>
                
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => setEditingSection(section)}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(section.id)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
