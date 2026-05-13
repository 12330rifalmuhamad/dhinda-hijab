"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Package, Clock, CheckCircle, XCircle, Truck, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [trackingData, setTrackingData] = useState(null);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [isLoadingTracking, setIsLoadingTracking] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login'); // Pastikan Anda memiliki halaman login, atau ganti dengan rute auth Anda
    } else if (status === 'authenticated') {
      fetchUserOrders();
    }
  }, [status, router]);

  const fetchUserOrders = async () => {
    try {
      const response = await fetch('/api/user/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Gagal mengambil pesanan:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'PAID': return 'bg-blue-100 text-blue-800';
      case 'SHIPPED': return 'bg-purple-100 text-purple-800';
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusBadge = (status) => {
    switch (status) {
      case 'success':
        return <span className="flex items-center gap-1 text-green-600 text-sm"><CheckCircle size={16} /> Berhasil</span>;
      case 'pending':
        return <span className="flex items-center gap-1 text-yellow-600 text-sm"><Clock size={16} /> Menunggu Pembayaran</span>;
      case 'failed': case 'expire': case 'cancel':
        return <span className="flex items-center gap-1 text-red-600 text-sm"><XCircle size={16} /> Gagal / Kadaluarsa</span>;
      default:
        return <span className="text-gray-500 text-sm capitalize">{status}</span>;
    }
  };

  const handleTrackPackage = async (trackingNumber, courier) => {
    if (!trackingNumber) return;
    setIsTrackingModalOpen(true);
    setIsLoadingTracking(true);
    setTrackingData(null);
    try {
      // courier is usually saved in lower case for biteship (e.g. jne, sicepat)
      const parsedCourier = courier ? courier.toLowerCase().replace(/[^a-z0-9]/g, '') : 'jne';
      const res = await fetch(`/api/biteship-tracking?waybill_id=${trackingNumber}&courier=${parsedCourier}`);
      if (res.ok) {
        const data = await res.json();
        setTrackingData(data);
      } else {
        setTrackingData({ error: 'Gagal melacak resi.' });
      }
    } catch (error) {
      setTrackingData({ error: 'Terjadi kesalahan.' });
    } finally {
      setIsLoadingTracking(false);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">Memuat data profil...</div>
        <Footer />
      </>
    );
  }

  if (!session) return null;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-5xl">

          {/* Header Profil */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8 flex items-center gap-6">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-2xl font-bold">
              {session.user?.name ? session.user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{session.user?.name || 'Pengguna'}</h1>
              <p className="text-gray-500">{session.user?.email}</p>
            </div>
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-4">Riwayat Pesanan Saya</h2>

          {orders.length === 0 ? (
            <div className="bg-white p-12 rounded-lg shadow-sm border border-gray-100 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada pesanan</h3>
              <p className="text-gray-500 mb-6">Anda belum pernah melakukan pemesanan di toko kami.</p>
              <Link href="/" className="inline-block bg-gray-900 text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors">
                Mulai Belanja
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">

                  {/* Header Card */}
                  <div className="bg-gray-50 px-6 py-4 border-b flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-gray-500">ID Pesanan: <span className="font-mono text-gray-900">#{order.id.substring(order.id.length - 8).toUpperCase()}</span></p>
                      <p className="text-xs text-gray-400 mt-1">{new Date(order.createdAt).toLocaleString('id-ID')}</p>
                    </div>
                    <div className="flex flex-col md:items-end gap-1">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                      {order.trackingNumber && (
                        <button
                          onClick={() => handleTrackPackage(order.trackingNumber, order.courier)}
                          className="flex items-center gap-1 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full mt-1 transition-colors"
                        >
                          <Truck size={14} /> Lacak: {order.trackingNumber}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Body Card */}
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row justify-between gap-6">

                      {/* Items */}
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-500 mb-3">Produk</h4>
                        <div className="space-y-3">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex gap-3 items-center">
                              <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden relative flex-shrink-0">
                                {item.product.images?.[0]?.url && (
                                  <img src={item.product.images[0].url} alt={item.product.name} className="w-full h-full object-cover" />
                                )}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{item.product.name}</p>
                                <p className="text-xs text-gray-500">{item.quantity} x Barang</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Summary */}
                      <div className="w-full md:w-64 flex flex-col justify-between border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Total Belanja</h4>
                          <p className="text-lg font-bold text-gray-900">Rp {order.totalAmount.toLocaleString('id-ID')}</p>
                        </div>

                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Status Pembayaran</h4>
                          {getPaymentStatusBadge(order.paymentStatus)}

                          {order.paymentStatus === 'pending' && order.snapRedirectUrl && (
                            <a
                              href={order.snapRedirectUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded"
                            >
                              Selesaikan Pembayaran <ExternalLink size={12} />
                            </a>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Tracking Modal */}
      {isTrackingModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[80vh] flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-bold text-lg flex items-center gap-2"><Truck size={20} /> Lacak Paket</h3>
              <button onClick={() => setIsTrackingModalOpen(false)} className="text-gray-400 hover:text-gray-600">&times;</button>
            </div>
            <div className="p-4 overflow-y-auto flex-1">
              {isLoadingTracking ? (
                <div className="text-center py-8 text-gray-500">Mencari data resi...</div>
              ) : trackingData?.error ? (
                <div className="text-center py-8 text-red-500">{trackingData.error}</div>
              ) : trackingData?.history ? (
                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                  {trackingData.history.map((hist, idx) => (
                    <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-4 h-4 rounded-full border border-white bg-blue-500 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 ml-[2px] md:ml-0"></div>
                      <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-3 rounded border border-slate-200 bg-white shadow-sm ml-4 md:ml-0">
                        <div className="flex items-center justify-between space-x-2 mb-1">
                          <div className="font-bold text-slate-900 text-xs">{hist.status}</div>
                          <time className="font-mono text-[10px] text-slate-500">{new Date(hist.updated_at).toLocaleString('id-ID')}</time>
                        </div>
                        <div className="text-slate-500 text-xs">{hist.note}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">Riwayat pelacakan belum tersedia.</div>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
