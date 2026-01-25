"use client";
import { useState, useEffect } from 'react';
import { Save, X, Info } from 'lucide-react';

export default function VoucherForm({ initialData, onSubmit, onCancel }) {
    const [formData, setFormData] = useState({
        code: '',
        discount: '',
        type: 'FLAT', // FLAT or PERCENTAGE
        minPurchase: 0,
        maxDiscount: '', // Only for PERCENTAGE
        stock: 100,
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        isActive: true
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                startDate: initialData.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : '',
                endDate: initialData.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : '',
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        // Basic validation could go here
        onSubmit(formData);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800">
                    {initialData ? 'Edit Voucher' : 'Add New Voucher'}
                </h2>
                <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
                    <X size={20} />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Code */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Voucher Code</label>
                        <input
                            type="text"
                            name="code"
                            value={formData.code}
                            onChange={handleChange}
                            placeholder="e.g. SUMMERLINK"
                            className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-[#dca5ad] outline-none uppercase font-bold tracking-wider"
                            required
                        />
                        <p className="text-xs text-gray-400 mt-1">Kode unik, gunakan huruf kapital dan angka tanpa spasi.</p>
                    </div>

                    {/* Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-[#dca5ad] outline-none"
                        >
                            <option value="FLAT">Nominal (Rp)</option>
                            <option value="PERCENTAGE">Persentase (%)</option>
                        </select>
                    </div>

                    {/* Discount Value */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {formData.type === 'FLAT' ? 'Nominal Diskon (Rp)' : 'Persentase Diskon (%)'}
                        </label>
                        <input
                            type="number"
                            name="discount"
                            value={formData.discount}
                            onChange={handleChange}
                            placeholder={formData.type === 'FLAT' ? '10000' : '10'}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-[#dca5ad] outline-none"
                            required
                        />
                    </div>

                    {/* Min Purchase */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Min. Belanja (Rp)</label>
                        <div className="relative">
                            <span className="absolute left-3 top-2 text-gray-400 text-sm">Rp</span>
                            <input
                                type="number"
                                name="minPurchase"
                                value={formData.minPurchase}
                                onChange={handleChange}
                                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-1 focus:ring-[#dca5ad] outline-none"
                            />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Kosongkan atau 0 jika tanpa minimum pembelian.</p>
                    </div>

                    {/* Max Discount (Percentage only) */}
                    <div className={formData.type === 'FLAT' ? 'opacity-50 pointer-events-none' : ''}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Max. Potongan (Rp)</label>
                        <div className="relative">
                            <span className="absolute left-3 top-2 text-gray-400 text-sm">Rp</span>
                            <input
                                type="number"
                                name="maxDiscount"
                                value={formData.maxDiscount || ''}
                                onChange={handleChange}
                                disabled={formData.type === 'FLAT'}
                                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-1 focus:ring-[#dca5ad] outline-none"
                            />
                        </div>
                        {formData.type === 'PERCENTAGE' && <p className="text-xs text-gray-400 mt-1">Batas maksimal potongan untuk diskon persen.</p>}
                    </div>

                    {/* Stock */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Stock / Quota</label>
                        <input
                            type="number"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-[#dca5ad] outline-none"
                            required
                        />
                    </div>

                    {/* Active */}
                    <div className="flex items-center pt-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleChange}
                                className="w-5 h-5 text-[#dca5ad] rounded focus:ring-[#dca5ad]"
                            />
                            <span className="text-gray-700 font-medium">Status Aktif</span>
                        </label>
                    </div>

                    {/* Date Range */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai</label>
                        <input
                            type="date"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-[#dca5ad] outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Berakhir</label>
                        <input
                            type="date"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-[#dca5ad] outline-none"
                            required
                        />
                    </div>

                </div>

                <div className="flex justify-end gap-3 pt-4 border-t mt-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#dca5ad] hover:bg-[#c48b94] rounded-lg transition-colors disabled:opacity-70"
                    >
                        <Save size={16} />
                        <span>{loading ? 'Saving...' : 'Save Voucher'}</span>
                    </button>
                </div>

            </form>
        </div>
    );
}
