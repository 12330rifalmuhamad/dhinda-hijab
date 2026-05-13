"use client";

import { useState, useEffect } from 'react';
import { useCart } from '@/context/cartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function CheckoutPage() {
  const { cartItems, clearCart } = useCart();
  const { data: session } = useSession();
  
  // State untuk form input
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const [userAddresses, setUserAddresses] = useState([]);

  // State untuk Voucher
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isApplyingVoucher, setIsApplyingVoucher] = useState(false);

  // State untuk pencarian area Biteship
  const [areaQuery, setAreaQuery] = useState('');
  const [areaResults, setAreaResults] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);
  const [isSearchingArea, setIsSearchingArea] = useState(false);
  
  // State untuk ongkos kirim
  const [shippingOptions, setShippingOptions] = useState([]);
  const [selectedShippingCost, setSelectedShippingCost] = useState(0);
  const [selectedCourierData, setSelectedCourierData] = useState(null);
  const [isLoadingShipping, setIsLoadingShipping] = useState(false);
  
  // State untuk total harga
  const [total, setTotal] = useState(0);

  // Debounce search area
  useEffect(() => {
    const searchArea = async () => {
      if (areaQuery.length < 3) {
        setAreaResults([]);
        return;
      }
      setIsSearchingArea(true);
      try {
        const res = await fetch(`/api/biteship-areas?input=${areaQuery}`);
        const data = await res.json();
        if (data.areas) {
          setAreaResults(data.areas);
        }
      } catch (error) {
        console.error("Error search area", error);
      } finally {
        setIsSearchingArea(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      searchArea();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [areaQuery]);

  // Fetch Address Book
  useEffect(() => {
    if (session) {
      // Set email to logged-in user email
      setFormData(prev => ({ ...prev, email: session.user.email, name: session.user.name || '' }));
      
      const fetchAddresses = async () => {
        try {
          const res = await fetch('/api/user/addresses');
          if (res.ok) {
            const data = await res.json();
            setUserAddresses(data);
            
            // Auto-select default address if exists
            const defaultAddress = data.find(addr => addr.isDefault) || data[0];
            if (defaultAddress) {
              handleSelectAddress(defaultAddress);
            }
          }
        } catch (error) {
          console.error("Error fetching addresses:", error);
        }
      };
      fetchAddresses();
    }
  }, [session]);

  const handleSelectAddress = async (addr) => {
    setFormData(prev => ({
      ...prev,
      name: addr.recipientName,
      phone: addr.phone,
      address: addr.fullAddress,
    }));
    
    // Attempt to set area if city/district match
    if (addr.district && addr.city) {
      setAreaQuery(`${addr.district}, ${addr.city}`);
    }
  };

  // Hitung subtotal dari item di keranjang
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  // Update total harga setiap kali subtotal, ongkir, atau diskon berubah
  useEffect(() => {
    setTotal(Math.max(0, subtotal - discountAmount) + selectedShippingCost);
  }, [subtotal, selectedShippingCost, discountAmount]);

  // Load Midtrans Snap Script
  useEffect(() => {
    const snapScript = "https://app.sandbox.midtrans.com/snap/snap.js";
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY; // Harus diekspos di .env
    const script = document.createElement("script");
    script.src = snapScript;
    script.setAttribute("data-client-key", clientKey);
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckShipping = async () => {
    if (!selectedArea) {
      alert("Silakan pilih Kecamatan/Kota terlebih dahulu.");
      return;
    }

    const destinationAreaId = selectedArea.id;
    const totalWeight = cartItems.reduce((acc, item) => acc + (item.quantity * 200), 0); // Asumsi 1 item 200 gram

    setIsLoadingShipping(true);
    setShippingOptions([]);
    setSelectedShippingCost(0);

    try {
      // Panggil API Biteship yang baru
      const response = await fetch('/api/biteship-rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          destination_area_id: destinationAreaId,
          weight: totalWeight
        })
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.message?.includes('No courier available') || data.error?.includes('No courier available')) {
          alert('Error: Kurir belum diaktifkan di dashboard Biteship Anda. Silakan login ke biteship.com > menu Couriers, lalu aktifkan JNE, SiCepat, atau J&T.');
        } else {
          alert(data.message || data.error || 'Gagal mengambil opsi pengiriman');
        }
        return;
      }

      setShippingOptions(data);

    } catch (error) {
      console.error("Gagal cek ongkir:", error);
      alert('Terjadi kesalahan saat mengecek ongkir.');
    } finally {
      setIsLoadingShipping(false);
    }
  };

  const handleShippingChange = (option) => {
    setSelectedShippingCost(option.price);
    setSelectedCourierData(option);
  };

  const handleApplyVoucher = async () => {
    if (!voucherCode) return;
    setIsApplyingVoucher(true);
    try {
      const res = await fetch('/api/vouchers/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: voucherCode, subtotal })
      });
      const data = await res.json();
      
      if (res.ok) {
        setAppliedVoucher(data.voucher);
        setDiscountAmount(data.discountAmount);
        alert('Voucher berhasil digunakan!');
      } else {
        alert(data.error || 'Voucher tidak valid');
        setAppliedVoucher(null);
        setDiscountAmount(0);
      }
    } catch (error) {
      console.error(error);
      alert('Terjadi kesalahan saat memvalidasi voucher');
    } finally {
      setIsApplyingVoucher(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedShippingCost === 0) {
      alert("Silakan pilih opsi pengiriman terlebih dahulu.");
      return;
    }
    
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerDetails: formData,
          cartItems,
          subtotal,
          discountAmount,
          voucherCode: appliedVoucher?.code,
          shippingCost: selectedShippingCost,
          total,
          selectedAreaId: selectedArea.id,
          courierData: selectedCourierData
        })
      });

      const data = await response.json();

      if (data.success) {
        // Panggil Midtrans Snap Popup
        window.snap.pay(data.token, {
          onSuccess: function(result){
            alert("Pembayaran berhasil!");
            clearCart();
            window.location.href = "/profile"; // Redirect ke riwayat pesanan
          },
          onPending: function(result){
            alert("Menunggu pembayaran Anda.");
            clearCart();
            window.location.href = "/profile"; // Redirect ke riwayat pesanan
          },
          onError: function(result){
            alert("Pembayaran gagal.");
          },
          onClose: function(){
            alert("Anda menutup popup sebelum menyelesaikan pembayaran. Anda dapat melanjutkannya di halaman profil.");
            clearCart(); // Kita juga clear cart di sini agar tidak dobel pesanan jika dia ke keranjang lagi, karena order sudah terbuat di DB
            window.location.href = "/profile"; 
          }
        });
      } else {
        alert("Gagal memproses checkout: " + data.message);
      }
    } catch (error) {
      console.error("Error submit checkout", error);
      alert("Terjadi kesalahan saat memproses pembayaran.");
    }
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
            
            {userAddresses.length > 0 && (
              <div className="mb-6 p-4 bg-gray-50 border rounded-md">
                <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Alamat Tersimpan</label>
                <select 
                  className="w-full border border-gray-300 rounded-md p-2"
                  onChange={(e) => {
                    if (e.target.value) {
                      const addr = userAddresses.find(a => a.id === e.target.value);
                      if (addr) handleSelectAddress(addr);
                    }
                  }}
                >
                  <option value="">-- Pilih Alamat --</option>
                  {userAddresses.map(addr => (
                    <option key={addr.id} value={addr.id}>
                      {addr.recipientName} - {addr.fullAddress} {addr.isDefault ? '(Utama)' : ''}
                    </option>
                  ))}
                </select>
              </div>
            )}

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
              <div className="relative">
                <label htmlFor="area" className="block text-sm font-medium text-gray-700">Kecamatan/Kota</label>
                <input 
                  type="text" 
                  id="area" 
                  value={selectedArea ? `${selectedArea.name}, ${selectedArea.administrative_division_level_2_name}` : areaQuery}
                  onChange={(e) => {
                    setAreaQuery(e.target.value);
                    if (selectedArea) setSelectedArea(null);
                  }}
                  required 
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" 
                  placeholder="Ketik minimal 3 huruf..."
                />
                {isSearchingArea && <div className="absolute right-3 top-9 text-sm text-gray-400">Mencari...</div>}
                
                {areaResults.length > 0 && !selectedArea && (
                  <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {areaResults.map((area) => (
                      <li 
                        key={area.id} 
                        onClick={() => {
                          setSelectedArea(area);
                          setAreaQuery('');
                          setAreaResults([]);
                        }}
                        className="cursor-pointer hover:bg-gray-100 p-2 text-sm border-b"
                      >
                        {area.name}, {area.administrative_division_level_2_name}, {area.administrative_division_level_1_name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <button type="button" onClick={handleCheckShipping} disabled={isLoadingShipping} className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 disabled:opacity-50">
                {isLoadingShipping ? 'Mencari...' : 'Cek Ongkos Kirim'}
              </button>
            </div>
            
            {shippingOptions.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-bold">Pilih Opsi Pengiriman</h3>
                <div className="space-y-2 mt-2">
                  {shippingOptions.map((option, index) => {
                    const uniqueId = `${option.courier_name}-${option.courier_service_code}-${index}`.replace(/\s+/g, '-');
                    return (
                      <label key={uniqueId} htmlFor={uniqueId} className="flex items-center p-3 border rounded-md has-[:checked]:bg-gray-100 has-[:checked]:border-gray-900">
                        <input type="radio" name="shipping" id={uniqueId} onChange={() => handleShippingChange(option)} className="h-4 w-4" />
                        <div className="ml-3 flex justify-between w-full text-sm">
                          <div className="flex flex-col">
                            <span className="font-semibold">{option.courier_name} - {option.courier_service_name}</span>
                            <span className="text-gray-500">{option.courier_service_type}</span>
                          </div>
                          <div className="flex flex-col text-right">
                            <span className="font-semibold">Rp {option.price.toLocaleString('id-ID')}</span>
                            <span className="text-gray-500">{option.shipment_duration_range} hari</span>
                          </div>
                        </div>
                      </label>
                    );
                  })}
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
            
            {/* Voucher Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Kode Promo / Voucher</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                  placeholder="Masukkan kode"
                  disabled={!!appliedVoucher}
                  className="flex-1 border border-gray-300 rounded-md shadow-sm p-2 text-sm uppercase"
                />
                {!appliedVoucher ? (
                  <button 
                    type="button" 
                    onClick={handleApplyVoucher}
                    disabled={!voucherCode || isApplyingVoucher}
                    className="bg-gray-900 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800 disabled:opacity-50"
                  >
                    {isApplyingVoucher ? 'Cek...' : 'Terapkan'}
                  </button>
                ) : (
                  <button 
                    type="button" 
                    onClick={() => {
                      setAppliedVoucher(null);
                      setDiscountAmount(0);
                      setVoucherCode('');
                    }}
                    className="bg-red-100 text-red-600 px-4 py-2 rounded-md text-sm hover:bg-red-200"
                  >
                    Hapus
                  </button>
                )}
              </div>
              {appliedVoucher && (
                <p className="text-sm text-green-600 mt-2 font-medium">✅ Voucher {appliedVoucher.code} berhasil digunakan!</p>
              )}
            </div>

            <div className="w-full h-px bg-gray-200 my-4"></div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>Rp {subtotal.toLocaleString('id-ID')}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-sm text-green-600 font-medium">
                  <span>Diskon Voucher</span>
                  <span>- Rp {discountAmount.toLocaleString('id-ID')}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
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