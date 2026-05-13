"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Truck, Package, CreditCard, User, Printer, ExternalLink } from 'lucide-react';
import Image from 'next/image';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isRequestingPickup, setIsRequestingPickup] = useState(false);
  
  // Form State
  const [trackingNumber, setTrackingNumber] = useState('');
  const [orderStatus, setOrderStatus] = useState('');

  useEffect(() => {
    fetchOrderDetail();
  }, [params.id]);

  const handleRequestPickup = async () => {
    if (!confirm("Apakah Anda yakin ingin melakukan Request Pickup otomatis ke Biteship? Kurir akan menjemput paket ke gudang Anda.")) {
      return;
    }
    setIsRequestingPickup(true);
    try {
      const response = await fetch('/api/admin/biteship/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order.id })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Gagal melakukan request pickup");
      }
      alert("Request pickup berhasil dilakukan! Status pesanan otomatis diubah menjadi SHIPPED.");
      fetchOrderDetail();
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setIsRequestingPickup(false);
    }
  };


  const fetchOrderDetail = async () => {
    try {
      const response = await fetch(`/api/admin/orders/${params.id}`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setOrder(data);
      setTrackingNumber(data.trackingNumber || '');
      setOrderStatus(data.status);
    } catch (error) {
      console.error("Gagal mengambil detail pesanan:", error);
      alert("Pesanan tidak ditemukan.");
      router.push('/admin/orders');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateOrder = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Auto-update status to SHIPPED if tracking number is provided and status is still PAID
    let newStatus = orderStatus;
    if (trackingNumber && trackingNumber.trim() !== '' && orderStatus === 'PAID') {
      newStatus = 'SHIPPED';
    }

    try {
      const response = await fetch(`/api/admin/orders/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          trackingNumber: trackingNumber.trim() || null
        })
      });

      if (!response.ok) throw new Error('Gagal memperbarui');
      
      alert("Pesanan berhasil diperbarui!");
      fetchOrderDetail(); // Refresh data
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Terjadi kesalahan saat menyimpan pembaruan.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-8 text-center">Memuat detail pesanan...</div>;
  if (!order) return null;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/admin/orders" className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
          <ArrowLeft size={20} className="text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Detail Pesanan</h1>
          <p className="text-sm text-gray-500">
            ID: #{order.id.toUpperCase()} • Tanggal: {new Date(order.createdAt).toLocaleString('id-ID')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom Kiri: Info Utama */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Daftar Produk */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4 pb-4 border-b">
              <Package className="text-gray-400" />
              <h2 className="text-lg font-semibold">Produk yang Dipesan</h2>
            </div>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 items-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden relative flex-shrink-0">
                    {item.product.images?.[0]?.url ? (
                      <Image src={item.product.images[0].url} alt={item.product.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Img</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                    <p className="text-sm text-gray-500">Rp {item.product.price.toLocaleString('id-ID')} x {item.quantity}</p>
                  </div>
                  <div className="font-semibold text-gray-900">
                    Rp {(item.product.price * item.quantity).toLocaleString('id-ID')}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Ringkasan Biaya */}
            <div className="mt-6 pt-4 border-t space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal Produk</span>
                <span>Rp {order.subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Ongkos Kirim ({order.courier} - {order.shippingService})</span>
                <span>Rp {order.shippingCost.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-gray-900 mt-2 pt-2 border-t">
                <span>Total Keseluruhan</span>
                <span>Rp {order.totalAmount.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>

          {/* Info Pelanggan & Pengiriman */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-4 pb-4 border-b">
                <User className="text-gray-400" />
                <h2 className="text-lg font-semibold">Info Pelanggan</h2>
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-500">Nama Akun</p>
                  <p className="font-medium">{order.user?.name || '-'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Email</p>
                  <p className="font-medium">{order.user?.email}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-4 pb-4 border-b">
                <Truck className="text-gray-400" />
                <h2 className="text-lg font-semibold">Info Pengiriman</h2>
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-500">Penerima</p>
                  <p className="font-medium">{order.recipientName} ({order.recipientPhone})</p>
                </div>
                <div>
                  <p className="text-gray-500">Alamat Lengkap</p>
                  <p className="font-medium leading-relaxed">{order.shippingAddress}</p>
                </div>
                {order.notes && (
                  <div>
                    <p className="text-gray-500">Catatan Pembeli</p>
                    <p className="font-medium bg-yellow-50 p-2 rounded mt-1 text-yellow-800">{order.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Aksi Admin */}
        <div className="space-y-6">
          
          {/* Biteship Integration Card */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4 pb-4 border-b">
              <Truck className="text-[#dca5ad]" />
              <h2 className="text-lg font-semibold">Integrasi Logistik (Biteship)</h2>
            </div>
            
            {order.waybillUrl ? (
              <div className="space-y-4">
                <div className="bg-green-50 p-3 rounded-lg text-xs text-green-800 font-medium">
                  ✓ Pengiriman terdaftar otomatis di Biteship.
                </div>
                <div className="text-xs text-gray-600">
                  <span className="font-semibold">Biteship Order ID:</span> <span className="font-mono">{order.biteshipOrderId || '-'}</span>
                </div>
                <a 
                  href={order.waybillUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-full flex items-center justify-center gap-2 bg-[#dca5ad] text-white p-2.5 rounded-md hover:bg-[#c9949c] transition-colors font-semibold text-sm shadow-sm"
                >
                  <Printer size={18} />
                  <span>Cetak Label Resi</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-gray-500 leading-relaxed">
                  Kirim data pesanan langsung ke kurir (JNE/SiCepat/J&T) secara otomatis. Kurir akan datang menjemput paket ke alamat Anda, nomor resi otomatis terbuat, dan Anda dapat langsung mencetak label pengiriman.
                </p>
                <button 
                  onClick={handleRequestPickup}
                  disabled={isRequestingPickup || (order.status !== 'PAID' && order.status !== 'PENDING')}
                  className="w-full flex items-center justify-center gap-2 bg-[#dca5ad] text-white p-2.5 rounded-md hover:bg-[#c9949c] transition-colors disabled:bg-gray-100 disabled:text-gray-400 font-semibold text-sm shadow-sm"
                >
                  <Truck size={18} />
                  {isRequestingPickup ? 'Memproses...' : 'Request Pickup Otomatis'}
                </button>
                {order.status !== 'PAID' && order.status !== 'PENDING' && (
                  <p className="text-[10px] text-red-500 text-center font-medium">
                    * Hanya pesanan status PAID/PENDING yang dapat melakukan request pickup otomatis.
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4 pb-4 border-b">
              <CreditCard className="text-gray-400" />
              <h2 className="text-lg font-semibold">Status Transaksi</h2>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">Status Pembayaran</p>
              <div className="inline-block px-3 py-1 rounded bg-gray-100 font-medium capitalize">
                {order.paymentStatus}
              </div>
            </div>

            <form onSubmit={handleUpdateOrder} className="space-y-4 pt-4 border-t">
              <div>
                <label className="block text-sm text-gray-500 mb-1">Status Pesanan</label>
                <select 
                  value={orderStatus} 
                  onChange={(e) => setOrderStatus(e.target.value)}
                  className="w-full border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-gray-900 focus:border-gray-900"
                >
                  <option value="PENDING">PENDING (Menunggu Dibayar)</option>
                  <option value="PAID">PAID (Sudah Dibayar, Perlu Dikirim)</option>
                  <option value="SHIPPED">SHIPPED (Sedang Dikirim)</option>
                  <option value="DELIVERED">DELIVERED (Selesai/Sampai)</option>
                  <option value="CANCELLED">CANCELLED (Dibatalkan)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-1">Nomor Resi Pelacakan</label>
                <input 
                  type="text" 
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Masukkan nomor resi kurir..."
                  className="w-full border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-gray-900 focus:border-gray-900"
                />
                <p className="text-xs text-gray-400 mt-1">Mengisi resi akan otomatis mengubah status menjadi SHIPPED (jika saat ini PAID).</p>
              </div>

              <button 
                type="submit" 
                disabled={isSaving}
                className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white p-2 rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-400"
              >
                <Save size={18} />
                {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
