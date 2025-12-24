"use client";

import { useState, useEffect } from 'react';
import { useCart } from '@/context/cartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function CheckoutPage() {
  const { cartItems } = useCart();
  
  // State untuk form input
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '', // Di aplikasi nyata, ini bisa berupa dropdown/pencarian
  });
  
  // State untuk ongkos kirim
  const [shippingOptions, setShippingOptions] = useState([]);
  const [selectedShippingCost, setSelectedShippingCost] = useState(0);
  const [isLoadingShipping, setIsLoadingShipping] = useState(false);
  
  // State untuk total harga
  const [total, setTotal] = useState(0);

  // Hitung subtotal dari item di keranjang
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  // Update total harga setiap kali subtotal atau ongkir berubah
  useEffect(() => {
    setTotal(subtotal + selectedShippingCost);
  }, [subtotal, selectedShippingCost]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckShipping = async () => {
    // PENTING: Di aplikasi nyata, Anda perlu logic untuk mengubah nama kota menjadi ID Kota RajaOngkir
    // Untuk contoh ini, kita gunakan ID Kota Karawang (152) secara manual
    const destinationId = '152'; 
    
    // Asumsi berat setiap item 200g
    const totalWeight = cartItems.reduce((total, item) => total + (200 * item.quantity), 0);
    
    if (totalWeight === 0) {
      alert("Keranjang Anda kosong!");
      return;
    }

    setIsLoadingShipping(true);
    setShippingOptions([]);
    setSelectedShippingCost(0);

    try {
      const response = await fetch('/api/shipping-cost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destination: destinationId, weight: totalWeight, courier: 'jne' })
      });
      const data = await response.json();
      if (data && data[0] && data[0].costs) {
        setShippingOptions(data[0].costs);
      } else {
        alert('Gagal mengambil opsi pengiriman. Coba lagi.');
      }
    } catch (error) {
      console.error("Gagal cek ongkir:", error);
      alert('Terjadi kesalahan saat mengecek ongkir.');
    } finally {
      setIsLoadingShipping(false);
    }
  };

  const handleShippingChange = (cost) => {
    setSelectedShippingCost(cost);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedShippingCost === 0) {
      alert("Silakan pilih opsi pengiriman terlebih dahulu.");
      return;
    }
    // Tahap selanjutnya: Integrasi Payment Gateway
    console.log({
      customerDetails: formData,
      cartItems,
      subtotal,
      shippingCost: selectedShippingCost,
      total,
    });
    alert('Memproses ke pembayaran...');
  };
  
  if (cartItems.length === 0 && subtotal === 0) {
     return (
        <>
            <div className="flex flex-col justify-center items-center h-screen text-center">
                <h1 className="text-2xl font-bold mb-4">Keranjang Anda Kosong</h1>
                <p className="text-gray-500 mb-6">Anda tidak bisa melanjutkan ke checkout tanpa barang di keranjang.</p>
                <Link href="/" className="bg-gray-900 text-white px-6 py-3 rounded-md hover:bg-gray-700">
                  Kembali Belanja
                </Link>
            </div>
            <Footer />
        </>
     )
  }

  return (
    <>
      <main className="container mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Checkout</h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Kolom Kiri: Informasi Pengiriman */}
          <div className="bg-white p-6 border rounded-lg">
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
                <textarea id="address" name="address" rows="3" onChange={handleInputChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan..."></textarea>
              </div>
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">Kota/Kabupaten</label>
                <input type="text" id="city" name="city" onChange={handleInputChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
              </div>
              <button type="button" onClick={handleCheckShipping} disabled={isLoadingShipping} className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 disabled:opacity-50">
                {isLoadingShipping ? 'Mencari...' : 'Cek Ongkos Kirim'}
              </button>
            </div>
            
            {shippingOptions.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-bold">Pilih Opsi Pengiriman (JNE)</h3>
                <div className="space-y-2 mt-2">
                  {shippingOptions.map(option => (
                    <label key={option.service} htmlFor={option.service} className="flex items-center p-3 border rounded-md has-[:checked]:bg-gray-100 has-[:checked]:border-gray-900">
                      <input type="radio" name="shipping" id={option.service} onChange={() => handleShippingChange(option.cost[0].value)} className="h-4 w-4" />
                      <div className="ml-3 flex justify-between w-full text-sm">
                        <div className="flex flex-col">
                          <span className="font-semibold">{option.service}</span>
                          <span className="text-gray-500">{option.description}</span>
                        </div>
                        <div className="flex flex-col text-right">
                          <span className="font-semibold">Rp {option.cost[0].value.toLocaleString('id-ID')}</span>
                          <span className="text-gray-500">{option.cost[0].etd} hari</span>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Kolom Kanan: Ringkasan Pesanan */}
          <div className="bg-white p-6 border rounded-lg h-fit sticky top-24">
            <h2 className="text-2xl font-bold mb-4">Ringkasan Pesanan</h2>
            <div className="space-y-2 text-gray-600">
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between">
                  <span>{item.name} (x{item.quantity})</span>
                  <span>Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                </div>
              ))}
            </div>
            <div className="w-full h-px bg-gray-200 my-4"></div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rp {subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between">
                <span>Ongkos Kirim</span>
                <span>Rp {selectedShippingCost.toLocaleString('id-ID')}</span>
              </div>
            </div>
            <div className="w-full h-px bg-gray-200 my-4"></div>
            <div className="flex justify-between font-bold text-xl">
              <span>Total</span>
              <span>Rp {total.toLocaleString('id-ID')}</span>
            </div>
            <button type="submit" disabled={selectedShippingCost === 0 || isLoadingShipping} className="mt-6 w-full bg-gray-900 text-white py-3 rounded-md hover:bg-gray-700 font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed">
              Bayar Sekarang
            </button>
          </div>
        </form>
      </main>
    </>
  );
}