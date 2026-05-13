"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { MapPin, Plus, Edit2, Trash2, Check, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AddressBookPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    recipientName: '',
    phone: '',
    fullAddress: '',
    province: '',
    city: '',
    district: '',
    postalCode: '',
    isDefault: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchAddresses();
    }
  }, [status, router]);

  const fetchAddresses = async () => {
    try {
      const res = await fetch('/api/user/addresses');
      if (res.ok) {
        const data = await res.json();
        setAddresses(data);
      }
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (address = null) => {
    if (address) {
      setEditingAddress(address);
      setFormData({
        recipientName: address.recipientName,
        phone: address.phone,
        fullAddress: address.fullAddress,
        province: address.province || '',
        city: address.city || '',
        district: address.district || '',
        postalCode: address.postalCode || '',
        isDefault: address.isDefault
      });
    } else {
      setEditingAddress(null);
      setFormData({
        recipientName: '',
        phone: '',
        fullAddress: '',
        province: '',
        city: '',
        district: '',
        postalCode: '',
        isDefault: addresses.length === 0
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAddress(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = editingAddress
        ? `/api/user/addresses/${editingAddress.id}`
        : '/api/user/addresses';
      const method = editingAddress ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        await fetchAddresses();
        handleCloseModal();
      } else {
        alert('Gagal menyimpan alamat');
      }
    } catch (error) {
      console.error('Error saving address:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus alamat ini?')) return;

    try {
      const res = await fetch(`/api/user/addresses/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchAddresses();
      }
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  };

  const setAsDefault = async (address) => {
    if (address.isDefault) return;
    try {
      const res = await fetch(`/api/user/addresses/${address.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...address, isDefault: true })
      });
      if (res.ok) {
        await fetchAddresses();
      }
    } catch (error) {
      console.error('Error setting default address:', error);
    }
  };

  if (status === 'loading' || isLoading) return <div className="min-h-screen flex items-center justify-center">Memuat...</div>;
  if (!session) return null;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">

          <div className="mb-6 flex items-center gap-4">
            <Link href="/profile" className="text-gray-500 hover:text-gray-900">
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Buku Alamat</h1>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-gray-900">Alamat Pengiriman Anda</h2>
              <button
                onClick={() => handleOpenModal()}
                className="flex items-center gap-2 bg-brand-primary text-white px-4 py-2 rounded-md hover:bg-brand-secondary transition-colors"
              >
                <Plus size={16} /> Tambah Alamat
              </button>
            </div>

            {addresses.length === 0 ? (
              <div className="text-center py-12">
                <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada alamat</h3>
                <p className="text-gray-500">Anda belum menyimpan alamat pengiriman apa pun.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {addresses.map((address) => (
                  <div key={address.id} className={`p-4 rounded-lg border ${address.isDefault ? 'border-brand-primary bg-brand-50' : 'border-gray-200'} relative`}>
                    {address.isDefault && (
                      <span className="absolute top-4 right-4 bg-brand-primary text-white text-xs px-2 py-1 rounded">Utama</span>
                    )}

                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                      {address.recipientName}
                      <span className="text-gray-500 font-normal text-sm">| {address.phone}</span>
                    </h3>

                    <p className="text-gray-600 mt-2 text-sm">{address.fullAddress}</p>
                    <p className="text-gray-600 text-sm">
                      {address.district && `${address.district}, `}{address.city && `${address.city}, `}{address.province} {address.postalCode}
                    </p>

                    <div className="mt-4 flex gap-3 text-sm">
                      <button onClick={() => handleOpenModal(address)} className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
                        <Edit2 size={14} /> Ubah
                      </button>
                      <button onClick={() => handleDelete(address.id)} className="text-red-600 hover:text-red-800 font-medium flex items-center gap-1">
                        <Trash2 size={14} /> Hapus
                      </button>
                      {!address.isDefault && (
                        <button onClick={() => setAsDefault(address)} className="text-gray-600 hover:text-gray-900 font-medium ml-auto">
                          Jadikan Utama
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">{editingAddress ? 'Ubah Alamat' : 'Tambah Alamat Baru'}</h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                <Check className="w-5 h-5 opacity-0" /> {/* placeholder for symmetry or close icon */}
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Penerima</label>
                <input required type="text" name="recipientName" value={formData.recipientName} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label>
                <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Lengkap</label>
                <textarea required name="fullAddress" value={formData.fullAddress} onChange={handleChange} rows="3" className="w-full border border-gray-300 rounded-md px-3 py-2" placeholder="Nama Jalan, Gedung, No. Rumah"></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Provinsi</label>
                  <input type="text" name="province" value={formData.province} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kota/Kabupaten</label>
                  <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kecamatan</label>
                  <input type="text" name="district" value={formData.district} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kode Pos</label>
                  <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2" />
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <input type="checkbox" id="isDefault" name="isDefault" checked={formData.isDefault} onChange={handleChange} className="rounded text-brand-primary focus:ring-brand-primary" />
                <label htmlFor="isDefault" className="text-sm text-gray-700">Jadikan alamat utama</label>
              </div>

              <div className="mt-6">
                <button disabled={isSubmitting} type="submit" className="w-full bg-brand-primary text-white py-2 rounded-md hover:bg-brand-secondary transition-colors disabled:opacity-50">
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Alamat'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
