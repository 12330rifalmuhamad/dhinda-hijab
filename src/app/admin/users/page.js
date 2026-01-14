"use client";

import { useState, useEffect } from 'react';
import { User, Mail, Phone, Search } from 'lucide-react';

export default function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/admin/users?search=${search}`);
                const data = await res.json();
                setUsers(data);
            } catch (error) {
                console.error('Failed to fetch users', error);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(() => {
            fetchUsers();
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Users</h1>
                    <p className="text-gray-500">Manage registered users</p>
                </div>
            </div>

            {/* Search Bar */}
            <div className="mb-6 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search users by name or email..."
                    className="w-full pl-10 pr-4 py-3 bg-white border rounded-lg focus:ring-1 focus:ring-[#dca5ad] outline-none shadow-sm"
                />
            </div>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-600">User</th>
                                <th className="px-6 py-4 font-semibold text-gray-600">Contact</th>
                                <th className="px-6 py-4 font-semibold text-gray-600">Role</th>
                                <th className="px-6 py-4 font-semibold text-gray-600">Info</th>
                                <th className="px-6 py-4 font-semibold text-gray-600">Orders</th>
                                <th className="px-6 py-4 font-semibold text-gray-600">Joined</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {loading ? (
                                <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-500">Loading...</td></tr>
                            ) : users.length === 0 ? (
                                <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-500">No users found</td></tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                                    {user.name ? <span className="font-bold">{user.name.charAt(0).toUpperCase()}</span> : <User size={20} />}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">{user.name || 'No Name'}</div>
                                                    <div className="text-xs text-gray-400 font-mono">{user.id.slice(0, 8)}...</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1 text-sm text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <Mail size={14} className="text-gray-400" /> {user.email}
                                                </div>
                                                {user.phone && (
                                                    <div className="flex items-center gap-2">
                                                        <Phone size={14} className="text-gray-400" /> {user.phone}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            <div className="text-xs">Gender: {user.gender || '-'}</div>
                                            <div className="text-xs">Birth: {user.birthDate ? new Date(user.birthDate).toLocaleDateString() : '-'}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">
                                                {user._count?.orders || 0} Orders
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                                            {new Date(user.createdAt).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
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
