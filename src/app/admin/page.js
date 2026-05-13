"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  Package, 
  ArrowRight, 
  MoreVertical,
  Plus,
  Search,
  Megaphone
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch dashboard stats", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PAID': return 'bg-green-100 text-green-700 border-green-200';
      case 'SHIPPED': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'DELIVERED': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'PENDING': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'CANCELLED': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-white rounded-2xl border"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-white rounded-2xl border"></div>
          <div className="h-96 bg-white rounded-2xl border"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, Admin. Here's what's happening today.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/products" className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <Plus size={18} />
            <span>New Product</span>
          </Link>
          <button onClick={fetchStats} className="bg-[#dca5ad] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#c9949c] transition-colors">
            Refresh Data
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value={`Rp ${stats?.totalRevenue?.toLocaleString('id-ID')}`} 
          icon={<TrendingUp className="text-green-600" />} 
          trend="+12% from last month"
          trendColor="text-green-600"
        />
        <StatCard 
          title="Total Orders" 
          value={stats?.totalOrders} 
          icon={<Package className="text-blue-600" />} 
          trend="+5 new orders today"
          trendColor="text-blue-600"
        />
        <StatCard 
          title="Total Customers" 
          value={stats?.totalCustomers} 
          icon={<Users className="text-purple-600" />} 
          trend="+18 new signups"
          trendColor="text-purple-600"
        />
        <StatCard 
          title="Total Products" 
          value={stats?.totalProducts} 
          icon={<ShoppingBag className="text-[#dca5ad]" />} 
          trend="8 items low in stock"
          trendColor="text-red-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Chart Section */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-gray-900">Weekly Revenue</h2>
            <select className="bg-gray-50 border-none text-sm rounded-lg focus:ring-0 cursor-pointer">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          
          {/* Simple Bar Chart */}
          <div className="flex items-end justify-between h-64 gap-2 px-2">
            {stats?.salesTrend?.map((day, idx) => {
              const maxRevenue = Math.max(...stats.salesTrend.map(d => d.revenue), 1);
              const heightPercentage = (day.revenue / maxRevenue) * 100;
              
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-3 h-full justify-end group">
                  <div className="relative w-full flex justify-center items-end h-full">
                    <div 
                      className="w-full sm:w-8 md:w-12 bg-gray-100 rounded-t-lg transition-all duration-500 group-hover:bg-[#dca5ad] cursor-pointer"
                      style={{ height: `${Math.max(heightPercentage, 5)}%` }}
                    >
                      {/* Tooltip */}
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                        Rp {day.revenue.toLocaleString('id-ID')}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">{day.date.split(',')[0]}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity / Quick Actions */}
        <div className="space-y-8">
          
          {/* Low Stock Alert */}
          {stats?.lowStockProducts && stats.lowStockProducts.length > 0 && (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-red-900 mb-4 flex items-center gap-2">
                Peringatan Stok Rendah
              </h2>
              <ul className="space-y-3">
                {stats.lowStockProducts.map(product => (
                  <li key={product.id} className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm border border-red-50">
                    <span className="text-sm font-medium text-gray-900 truncate pr-2">{product.name}</span>
                    <span className="text-xs font-bold bg-red-100 text-red-800 px-2 py-1 rounded">Sisa {product.stock}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 gap-4">
              <QuickActionLink icon={<ShoppingBag size={20} />} label="Add New Product" href="/admin/products" color="bg-[#fdf2f4] text-[#dca5ad]" />
              <QuickActionLink icon={<Megaphone size={20} />} label="Campaign Promo" href="/admin/popup" color="bg-blue-50 text-blue-600" />
              <QuickActionLink icon={<Users size={20} />} label="Manage Customers" href="/admin/users" color="bg-purple-50 text-purple-600" />
              <QuickActionLink icon={<ArrowRight size={20} />} label="View All Orders" href="/admin/orders" color="bg-gray-50 text-gray-600" />
            </div>
          </div>

          <div className="bg-[#dca5ad] rounded-2xl p-6 text-white overflow-hidden relative group">
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-2">Need Support?</h3>
              <p className="text-white/80 text-sm mb-4">Check our documentation or contact the tech team for assistance.</p>
              <button className="bg-white/20 hover:bg-white/30 backdrop-blur-md px-4 py-2 rounded-xl text-sm font-medium transition-colors">
                Contact Developer
              </button>
            </div>
            {/* Abstract Background Shape */}
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full group-hover:scale-125 transition-transform duration-700"></div>
            <div className="absolute -left-4 -top-4 w-24 h-24 bg-white/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search orders..." 
              className="pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-1 focus:ring-[#dca5ad] w-full sm:w-64"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider font-semibold">
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stats?.recentOrders?.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs font-medium text-gray-900">#{order.id.slice(-8).toUpperCase()}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">{order.user?.name || 'Guest'}</span>
                      <span className="text-xs text-gray-500">{order.user?.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">
                    Rp {order.totalAmount.toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/admin/orders/${order.id}`} className="p-2 hover:bg-gray-100 rounded-lg inline-block transition-colors">
                      <ArrowRight size={18} className="text-gray-400" />
                    </Link>
                  </td>
                </tr>
              ))}
              {(!stats?.recentOrders || stats.recentOrders.length === 0) && (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500 text-sm">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-gray-50/50 border-t border-gray-100 text-center">
          <Link href="/admin/orders" className="text-sm font-bold text-[#dca5ad] hover:text-[#c9949c] transition-colors">
            View All Transactions
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend, trendColor }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-gray-50 rounded-xl group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <button className="text-gray-300 hover:text-gray-600 transition-colors">
          <MoreVertical size={18} />
        </button>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      </div>
      {trend && (
        <div className={`mt-4 flex items-center gap-1 text-[11px] font-medium ${trendColor}`}>
          {trend}
        </div>
      )}
    </div>
  );
}

function QuickActionLink({ icon, label, href, color }) {
  return (
    <Link href={href} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl hover:border-[#dca5ad] hover:shadow-sm transition-all group">
      <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-xl ${color}`}>
          {icon}
        </div>
        <span className="text-sm font-bold text-gray-700">{label}</span>
      </div>
      <ArrowRight size={16} className="text-gray-300 group-hover:text-[#dca5ad] group-hover:translate-x-1 transition-all" />
    </Link>
  );
}
