"use client";

import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { User, LogOut, Package, Ticket } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
    const { data: session, status, update: updateSession } = useSession();
    const router = useRouter();
    const [userProfile, setUserProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        gender: '',
        birthDate: ''
    });

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        } else if (status === "authenticated") {
            fetchProfile();
        }
    }, [status, router]);

    const fetchProfile = async () => {
        try {
            const res = await fetch('/api/user/profile');
            const data = await res.json();
            if (res.ok) {
                setUserProfile(data);
                setFormData({
                    name: data.name || '',
                    phone: data.phone || '',
                    gender: data.gender || '',
                    birthDate: data.birthDate ? new Date(data.birthDate).toISOString().split('T')[0] : ''
                });
            }
        } catch (error) {
            console.error("Failed to fetch profile", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await fetch('/api/user/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                const updated = await res.json();
                setUserProfile(prev => ({ ...prev, ...updated.user }));
                setIsEditing(false);
                // Try to update session name if changed
                if (session?.user?.name !== formData.name) {
                    await updateSession({ ...session, user: { ...session.user, name: formData.name } });
                }
                alert("Biodata berhasil diperbarui!");
            } else {
                alert("Gagal memperbarui biodata");
            }
        } catch (error) {
            console.error(error);
            alert("Terjadi kesalahan");
        } finally {
            setIsSaving(false);
        }
    };

    if (status === "loading" || isLoading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!session) return null;

    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Header */}
                    <div className="bg-[#fff8f8] p-8 border-b border-gray-100 flex flex-col md:flex-row items-center gap-6">
                        <div className="w-24 h-24 rounded-full bg-[#dca5ad]/20 flex items-center justify-center text-[#dca5ad] overflow-hidden">
                            {session.user.image ? (
                                <Image src={session.user.image} alt={session.user.name} width={96} height={96} className="w-full h-full object-cover" />
                            ) : (
                                <User size={40} />
                            )}
                        </div>
                        <div className="text-center md:text-left">
                            <h1 className="text-2xl font-serif text-[#4a4042] mb-1">{userProfile?.name || session.user.name}</h1>
                            <p className="text-gray-500">{userProfile?.email || session.user.email}</p>
                            <span className="inline-block mt-2 bg-[#dca5ad]/10 text-[#dca5ad] text-xs px-3 py-1 rounded-full uppercase tracking-widest font-bold">
                                {userProfile?.role || session.user.role || 'Customer'}
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
                            <div className="border border-gray-100 rounded-xl p-6 hover:shadow-md transition-shadow bg-white">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-purple-50 text-purple-500 rounded-lg flex items-center justify-center">
                                            <User size={20} />
                                        </div>
                                        <h3 className="font-serif text-lg text-gray-800">Biodata Diri</h3>
                                    </div>
                                    {!isEditing && (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="text-sm text-purple-500 hover:text-purple-600 font-medium"
                                        >
                                            Edit
                                        </button>
                                    )}
                                </div>

                                {isEditing ? (
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div>
                                            <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1">Nama Lengkap</label>
                                            <input
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-purple-200 outline-none"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1">No. Telepon</label>
                                            <input
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-purple-200 outline-none"
                                                placeholder="Contoh: 08123456789"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1">Jenis Kelamin</label>
                                            <select
                                                name="gender"
                                                value={formData.gender}
                                                onChange={handleInputChange}
                                                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-purple-200 outline-none"
                                            >
                                                <option value="">Pilih...</option>
                                                <option value="Laki-laki">Laki-laki</option>
                                                <option value="Perempuan">Perempuan</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1">Tanggal Lahir</label>
                                            <input
                                                type="date"
                                                name="birthDate"
                                                value={formData.birthDate}
                                                onChange={handleInputChange}
                                                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-purple-200 outline-none"
                                            />
                                        </div>
                                        <div className="flex gap-2 pt-2">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIsEditing(false);
                                                    setFormData({
                                                        name: userProfile?.name || '',
                                                        phone: userProfile?.phone || '',
                                                        gender: userProfile?.gender || '',
                                                        birthDate: userProfile?.birthDate ? new Date(userProfile.birthDate).toISOString().split('T')[0] : ''
                                                    });
                                                }}
                                                className="flex-1 px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                                            >
                                                Batal
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isSaving}
                                                className="flex-1 px-4 py-2 text-sm text-white bg-purple-500 rounded-lg hover:bg-purple-600 disabled:opacity-70"
                                            >
                                                {isSaving ? 'Menyimpan...' : 'Simpan'}
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="space-y-3 mt-4">
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase tracking-wider">Nama Lengkap</p>
                                            <p className="text-sm font-medium text-gray-700">{userProfile?.name || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase tracking-wider">Email</p>
                                            <p className="text-sm font-medium text-gray-700">{userProfile?.email || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase tracking-wider">No. Telepon</p>
                                            <p className="text-sm font-medium text-gray-700">{userProfile?.phone || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase tracking-wider">Jenis Kelamin</p>
                                            <p className="text-sm font-medium text-gray-700">{userProfile?.gender || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase tracking-wider">Tanggal Lahir</p>
                                            <p className="text-sm font-medium text-gray-700">
                                                {userProfile?.birthDate ? new Date(userProfile.birthDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Vouchers Card */}
                            <div className="border border-gray-100 rounded-xl p-6 hover:shadow-md transition-shadow cursor-pointer group bg-white">
                                <div className="w-12 h-12 bg-[#dca5ad]/20 text-[#dca5ad] rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#dca5ad]/30 transition-colors">
                                    <Ticket size={24} />
                                </div>
                                <h3 className="font-serif text-lg text-gray-800 mb-2">Voucher Saya</h3>
                                <p className="text-sm text-gray-500 mb-4">Klaim dan gunakan voucher belanja Anda.</p>

                                {/* Placeholder Voucher List - could be dynamic later */}
                                <div className="space-y-3">
                                    <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 text-center">
                                        <p className="text-sm text-gray-500">Lihat semua voucher yang tersedia di halaman Voucher Center.</p>
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
