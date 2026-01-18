"use client";

import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { User, LogOut, Package, Ticket } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    if (status === "loading") {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!session) {
        return null; // Will redirect
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Header */}
                    <div className="bg-[#fff8f8] p-8 border-b border-gray-100 flex flex-col md:flex-row items-center gap-6">
                        <div className="w-24 h-24 rounded-full bg-[#dca5ad]/20 flex items-center justify-center text-[#dca5ad]">
                            {session.user.image ? (
                                <Image src={session.user.image} alt={session.user.name} width={96} height={96} className="rounded-full object-cover" />
                            ) : (
                                <User size={40} />
                            )}
                        </div>
                        <div className="text-center md:text-left">
                            <h1 className="text-2xl font-serif text-[#4a4042] mb-1">{session.user.name}</h1>
                            <p className="text-gray-500">{session.user.email}</p>
                            <span className="inline-block mt-2 bg-[#dca5ad]/10 text-[#dca5ad] text-xs px-3 py-1 rounded-full uppercase tracking-widest font-bold">
                                {session.user.role || 'Customer'}
                            </span>
                        </div>
                        <div className="md:ml-auto">
                            <button
                                onClick={() => signOut({ callbackUrl: '/' })}
                                className="flex items-center gap-2 text-red-500 hover:text-red-700 transition-colors px-4 py-2 border border-red-100 rounded-lg hover:bg-red-50"
                            >
                                <LogOut size={18} />
                                Logout
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Biodata Card */}
                            <div className="border border-gray-100 rounded-xl p-6 hover:shadow-md transition-shadow cursor-pointer group bg-white">
                                <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-100 transition-colors">
                                    <User size={24} />
                                </div>
                                <h3 className="font-serif text-lg text-gray-800 mb-2">Biodata Diri</h3>
                                <div className="space-y-3 mt-4">
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase tracking-wider">Nama Lengkap</p>
                                        <p className="text-sm font-medium text-gray-700">{session.user.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase tracking-wider">Email</p>
                                        <p className="text-sm font-medium text-gray-700">{session.user.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase tracking-wider">Status Member</p>
                                        <p className="text-sm font-medium text-gray-700 capitalize">{session.user.role?.toLowerCase() || 'Customer'}</p>
                                    </div>
                                </div>
                                <div className="mt-6 pt-4 border-t border-gray-100">
                                    <button className="text-purple-500 text-sm font-medium hover:underline">Edit Biodata &rarr;</button>
                                </div>
                            </div>

                            {/* Vouchers Card */}
                            <div className="border border-gray-100 rounded-xl p-6 hover:shadow-md transition-shadow cursor-pointer group bg-white">
                                <div className="w-12 h-12 bg-[#dca5ad]/20 text-[#dca5ad] rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#dca5ad]/30 transition-colors">
                                    <Ticket size={24} />
                                </div>
                                <h3 className="font-serif text-lg text-gray-800 mb-2">Voucher Saya</h3>
                                <p className="text-sm text-gray-500 mb-4">Klaim dan gunakan voucher belanja Anda.</p>

                                {/* Placeholder Voucher List */}
                                <div className="space-y-3">
                                    <div className="bg-[#fff8f8] border border-[#fce7e9] border-dashed rounded-lg p-3 flex items-center justify-between">
                                        <div>
                                            <p className="text-xs font-bold text-[#dca5ad]">DISKON 10%</p>
                                            <p className="text-[10px] text-gray-500">Min. belanja 100rb</p>
                                        </div>
                                        <span className="text-xs bg-white text-gray-600 px-2 py-1 rounded border border-gray-100">KLAIM</span>
                                    </div>
                                    <div className="bg-gray-50 border border-gray-200 border-dashed rounded-lg p-3 flex items-center justify-between opacity-60">
                                        <div>
                                            <p className="text-xs font-bold text-gray-500">FREE ONGKIR</p>
                                            <p className="text-[10px] text-gray-400">Sudah terpakai</p>
                                        </div>
                                        <span className="text-xs bg-gray-200 text-gray-500 px-2 py-1 rounded">USED</span>
                                    </div>
                                </div>

                                <div className="mt-6 pt-4 border-t border-gray-100">
                                    <Link href="/profile/vouchers" className="text-[#dca5ad] text-sm font-medium hover:underline">Lihat Semua Voucher &rarr;</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
