"use client";

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Ticket, CheckCircle, XCircle } from 'lucide-react';
import VoucherForm from '@/components/admin/VoucherForm';

export default function VouchersPage() {
    const [vouchers, setVouchers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentVoucher, setCurrentVoucher] = useState(null);

    useEffect(() => {
        fetchVouchers();
    }, []);

    const fetchVouchers = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/vouchers');
            const data = await res.json();
            setVouchers(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setCurrentVoucher(null);
        setIsEditing(true);
    };

    const handleEdit = (voucher) => {
        setCurrentVoucher(voucher);
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this voucher?')) return;

        try {
            const res = await fetch(`/api/admin/vouchers/${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchVouchers();
            } else {
                alert('Failed to delete');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (formData) => {
        try {
            const url = currentVoucher
                ? `/api/admin/vouchers/${currentVoucher.id}`
                : '/api/admin/vouchers';

            const method = currentVoucher ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                setIsEditing(false);
                fetchVouchers();
            } else {
                alert(data.error || 'Operation failed');
            }
        } catch (error) {
            console.error(error);
            alert('Error saving voucher');
        }
    };

    if (loading && !vouchers.length) {
        return <div className="p-8 text-center text-gray-500">Loading vouchers...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-serif text-[#4a4042]">Vouchers</h1>
                    <p className="text-gray-500 text-sm">Manage discount vouchers and promo codes</p>
                </div>
                {!isEditing && (
                    <button
                        onClick={handleAdd}
                        className="flex items-center gap-2 px-4 py-2 bg-[#dca5ad] text-white rounded-lg hover:bg-[#c48b94] transition-colors shadow-sm"
                    >
                        <Plus size={20} />
                        <span>Add Voucher</span>
                    </button>
                )}
            </div>

            {isEditing ? (
                <VoucherForm
                    initialData={currentVoucher}
                    onSubmit={handleSubmit}
                    onCancel={() => setIsEditing(false)}
                />
            ) : (
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 text-gray-600 text-sm border-b">
                                    <th className="p-4 font-medium">Code</th>
                                    <th className="p-4 font-medium">Discount</th>
                                    <th className="p-4 font-medium">Type</th>
                                    <th className="p-4 font-medium">Usage</th>
                                    <th className="p-4 font-medium">Status</th>
                                    <th className="p-4 font-medium">Validity</th>
                                    <th className="p-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y text-sm">
                                {vouchers.map((v) => {
                                    const isExpired = new Date(v.endDate) < new Date();
                                    const isOutOfStock = v.stock <= 0;
                                    let statusColor = "text-green-600 bg-green-50";
                                    let statusText = "Active";

                                    if (!v.isActive) {
                                        statusColor = "text-gray-500 bg-gray-100";
                                        statusText = "Inactive";
                                    } else if (isExpired) {
                                        statusColor = "text-red-500 bg-red-50";
                                        statusText = "Expired";
                                    } else if (isOutOfStock) {
                                        statusColor = "text-orange-500 bg-orange-50";
                                        statusText = "Out of Stock";
                                    }

                                    return (
                                        <tr key={v.id} className="hover:bg-gray-50">
                                            <td className="p-4 font-mono font-bold text-gray-800">{v.code}</td>
                                            <td className="p-4 text-gray-600">
                                                {v.type === 'PERCENTAGE' ? `${v.discount}%` : `Rp ${v.discount.toLocaleString('id-ID')}`}
                                            </td>
                                            <td className="p-4 text-gray-500 text-xs uppercase tracking-wider">{v.type}</td>
                                            <td className="p-4 text-gray-600">{v.stock} left</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${statusColor}`}>
                                                    {statusText}
                                                </span>
                                            </td>
                                            <td className="p-4 text-gray-500 text-xs">
                                                {new Date(v.endDate).toLocaleDateString()}
                                            </td>
                                            <td className="p-4 flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(v)}
                                                    className="p-2 text-blue-500 hover:bg-blue-50 rounded"
                                                    title="Edit"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(v.id)}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {vouchers.length === 0 && (
                                    <tr>
                                        <td colSpan="7" className="p-8 text-center text-gray-400">
                                            <Ticket size={48} className="mx-auto mb-3 opacity-20" />
                                            No vouchers found. Create one!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
