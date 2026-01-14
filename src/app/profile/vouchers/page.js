"use client";

import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { Ticket, Lock, CheckCircle, Percent, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function VouchersPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('available');
    const [availableVouchers, setAvailableVouchers] = useState([]);
    const [myVouchers, setMyVouchers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [claimingId, setClaimingId] = useState(null);

    useEffect(() => {
        if (session) {
            fetchVouchers();
        } else if (session === null) {
            router.push('/login');
        }
    }, [session]);

    const fetchVouchers = async () => {
        setLoading(true);
        try {
            // 1. Fetch available vouchers (all active)
            const resAvailable = await fetch('/api/vouchers');
            const dataAvailable = await resAvailable.json();

            // 2. Fetch my claimed vouchers
            const resMy = await fetch('/api/vouchers/my');
            const dataMy = await resMy.json();

            setAvailableVouchers(dataAvailable);
            setMyVouchers(dataMy);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleClaim = async (voucherId) => {
        setClaimingId(voucherId);
        try {
            const res = await fetch('/api/vouchers/claim', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ voucherId })
            });
            const data = await res.json();

            if (res.ok) {
                // Refresh data
                fetchVouchers();
                alert("Voucher berhasil diklaim!");
            } else {
                alert(data.error || "Gagal klaim voucher");
            }
        } catch (error) {
            console.error(error);
            alert("Error");
        } finally {
            setClaimingId(null);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center pt-20">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-serif text-[#4a4042] mb-2">Voucher Center</h1>
                    <p className="text-gray-500">Klaim voucher menarik untuk belanja lebih hemat.</p>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 mb-8">
                    <button
                        onClick={() => setActiveTab('available')}
                        className={`pb-4 px-6 text-sm font-medium transition-colors relative ${activeTab === 'available' ? 'text-[#dca5ad]' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Available Vouchers
                        {activeTab === 'available' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#dca5ad]"></span>}
                    </button>
                    <button
                        onClick={() => setActiveTab('my')}
                        className={`pb-4 px-6 text-sm font-medium transition-colors relative ${activeTab === 'my' ? 'text-[#dca5ad]' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        My Vouchers
                        {activeTab === 'my' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#dca5ad]"></span>}
                    </button>
                </div>

                {/* List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {activeTab === 'available' ? (
                        availableVouchers.map((voucher) => (
                            <div key={voucher.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none text-[#dca5ad]">
                                    <Ticket size={100} />
                                </div>

                                <div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="bg-[#dca5ad]/10 text-[#dca5ad] p-2 rounded-lg">
                                            {voucher.type === 'PERCENTAGE' ? <Percent size={20} /> : <Ticket size={20} />}
                                        </span>
                                        <span className="text-xs font-bold bg-green-50 text-green-600 px-2 py-1 rounded">
                                            {voucher.stock > 0 ? 'Available' : 'Out of Stock'}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-800 mb-1">{voucher.code}</h3>
                                    <p className="text-gray-500 text-sm mb-4">
                                        {voucher.type === 'PERCENTAGE'
                                            ? `Diskon ${voucher.discount}% (Max ${voucher.maxDiscount / 1000}k)`
                                            : `Potongan Rp ${voucher.discount.toLocaleString('id-ID')}`}
                                        <br />
                                        <span className="text-xs text-gray-400">Min. Belanja: Rp {voucher.minPurchase.toLocaleString('id-ID')}</span>
                                    </p>
                                </div>

                                <div className="mt-auto">
                                    {voucher.isClaimed ? (
                                        <button disabled className="w-full bg-gray-100 text-gray-400 font-medium py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 cursor-not-allowed">
                                            <CheckCircle size={16} />
                                            Sudah Diklaim
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleClaim(voucher.id)}
                                            disabled={claimingId === voucher.id || voucher.stock <= 0}
                                            className="w-full bg-[#dca5ad] hover:bg-[#c98d96] text-white font-medium py-2.5 rounded-lg text-sm transition-colors disabled:opacity-50"
                                        >
                                            {claimingId === voucher.id ? 'Claiming...' : 'Klaim Voucher'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        myVouchers.length > 0 ? (
                            myVouchers.map((uv) => (
                                <div key={uv.id} className="bg-white rounded-xl shadow-sm border border-l-4 border-l-[#dca5ad] border-gray-100 p-6 flex flex-col justify-between relative overflow-hidden">
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-50 rounded-full translate-x-1/2 border border-gray-100"></div>
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-50 rounded-full -translate-x-1/2 border border-gray-100"></div>

                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800 mb-1">{uv.voucher.code}</h3>
                                        <p className="text-gray-500 text-sm mb-4">
                                            {uv.voucher.type === 'PERCENTAGE'
                                                ? `Diskon ${uv.voucher.discount}%`
                                                : `Potongan Rp ${uv.voucher.discount.toLocaleString('id-ID')}`}
                                        </p>
                                        <div className="text-xs text-gray-400 space-y-1">
                                            <p>Berlaku hingga: {new Date(uv.voucher.endDate).toLocaleDateString()}</p>
                                            <p>Min. Belanja: Rp {uv.voucher.minPurchase.toLocaleString('id-ID')}</p>
                                        </div>
                                    </div>

                                    <div className="mt-6 border-t border-dashed border-gray-200 pt-4">
                                        <button className="w-full border border-[#dca5ad] text-[#dca5ad] hover:bg-[#dca5ad] hover:text-white font-medium py-2 rounded-lg text-sm transition-colors">
                                            Gunakan Sekarang
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-12 text-center text-gray-400">
                                <Ticket size={48} className="mx-auto mb-4 opacity-20" />
                                <p>Belum ada voucher yang diklaim.</p>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}
