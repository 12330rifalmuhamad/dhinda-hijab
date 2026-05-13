"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Eye, Clock, CheckCircle, XCircle, Truck, Package } from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders');
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Gagal mengambil data pesanan:", error);
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

  const getPaymentStatusIcon = (status) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed': case 'expire': case 'cancel': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return null;
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Memuat data pesanan...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Manajemen Pesanan</h1>
        <button 
          onClick={() => window.open('/api/admin/reports', '_blank')}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <Package className="w-4 h-4" /> Export Excel
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
              <tr>
                <th scope="col" className="px-6 py-4">ID Pesanan</th>
                <th scope="col" className="px-6 py-4">Tanggal</th>
                <th scope="col" className="px-6 py-4">Pelanggan</th>
                <th scope="col" className="px-6 py-4">Total</th>
                <th scope="col" className="px-6 py-4">Pembayaran</th>
                <th scope="col" className="px-6 py-4">Status Pesanan</th>
                <th scope="col" className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    <Package className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                    Belum ada pesanan masuk
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      #{order.id.substring(order.id.length - 8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4">
                      {new Date(order.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{order.recipientName || order.user?.name}</div>
                      <div className="text-xs text-gray-500">{order.user?.email}</div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      Rp {order.totalAmount.toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getPaymentStatusIcon(order.paymentStatus)}
                        <span className="capitalize">{order.paymentStatus}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Link 
                        href={`/admin/orders/${order.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        Detail
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
