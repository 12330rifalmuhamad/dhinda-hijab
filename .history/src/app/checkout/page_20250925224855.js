// src/app/checkout/page.js
"use client";

import { useState } from 'react';
import { useCart } from '@/context/cartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function CheckoutPage() {
  const { cartItems } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
  });

  // Hitung subtotal
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logika untuk proses pembayaran akan ditambahkan di sini
    console.log('Form data:', formData);
    console.log('Cart items:', cartItems);
    alert('Memproses ke pembayaran...');
  };

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 py-12 min-h-screen">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Checkout</h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Kolom Kiri: Informasi Pengiriman */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Informasi Pengiriman</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                <input type="text" id="name" name="name" onChange={handleInputChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" id="email" name="email" onChange={handleInputChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Nomor Telepon</label>
                <input type="tel" id="phone" name="phone" onChange={handleInputChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Alamat Lengkap</label>
                <textarea id="address" name="address" rows="3" onChange={handleInputChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"></textarea>
              </div>
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">Kota/Kabupaten</label>
                <input type="text" id="city" name="city" onChange={handleInputChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Ringkasan Pesanan */}
          <div className="bg-white p-6 border rounded-lg h-fit sticky top-24">
            <h2 className="text-2xl font-bold mb-4">Ringkasan Pesanan</h2>
            <div className="space-y-2">
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between">
                  <span>{item.name} (x{item.quantity})</span>
                  <span>Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                </div>
              ))}
            </div>
            <div className="w-full h-px bg-gray-200 my-4"></div>
            <div className="flex justify-between font-bold text-lg">
              <span>Subtotal</span>
              <span>Rp {subtotal.toLocaleString('id-ID')}</span>
            </div>
            {/* Tempat untuk menampilkan ongkir nanti */}
            <button type="submit" className="mt-6 w-full bg-gray-900 text-white py-3 rounded-md hover:bg-gray-700 font-semibold">
              Bayar Sekarang
            </button>
          </div>
        </form>
      </main>
      <Footer />
    </>
  );
}