"use client";
import { useState, useEffect } from 'react';
import { X, User, Phone, Mail, Calendar, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CustomerLoginModal({ isOpen, onClose, onLoginSuccess, initialIsRegistering = false }) {
  const router = useRouter();
  const [isRegistering, setIsRegistering] = useState(initialIsRegistering);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    gender: 'FEMALE', // Default target market is female
    birthDate: ''
  });

  useEffect(() => {
    if (isOpen) {
      setIsRegistering(initialIsRegistering);
    }
  }, [isOpen, initialIsRegistering]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const endpoint = isRegistering ? '/api/auth/customer/register' : '/api/auth/customer/login';
    
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (res.ok) {
        if (onLoginSuccess) {
          onLoginSuccess(data.user);
        } else {
             window.location.reload(); 
        }
        onClose();
        router.refresh(); 
      } else {
        alert(data.error || 'Terjadi kesalahan');
      }
    } catch (error) {
      console.error(error);
      alert('Gagal menghubungi server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden relative animate-slide-up">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X size={20} className="text-gray-500" />
        </button>

        {/* Header */}
        <div className="bg-[#FFF8F8] px-8 py-8 text-center border-b border-[#ffe4e6]">
          <h2 className="text-2xl font-serif text-[#4a4042] mb-2">
            {isRegistering ? 'Join Dhinda Hijab' : 'Welcome Back'}
          </h2>
          <p className="text-gray-500 text-sm font-light">
            {isRegistering ? 'Lengkapi data diri untuk klaim voucher eksklusif!' : 'Masuk untuk mengakses akun Anda.'}
          </p>
        </div>

        {/* Form */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email (Always visible) */}
            <div className="relative">
              <Mail className="absolute top-3 left-3 text-gray-400" size={18} />
              <input 
                type="email" 
                name="email"
                placeholder="Email Address" 
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#dca5ad] focus:border-transparent outline-none transition-all text-sm"
              />
            </div>

            {/* Password (Always visible) */}
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password" 
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-4 pr-10 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#dca5ad] focus:border-transparent outline-none transition-all text-sm"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Registration Fields */}
            {isRegistering && (
              <>
                 <div className="relative">
                    <User className="absolute top-3 left-3 text-gray-400" size={18} />
                    <input 
                      type="text" 
                      name="name"
                      placeholder="Nama Lengkap" 
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#dca5ad] focus:border-transparent outline-none transition-all text-sm"
                    />
                 </div>

                 <div className="relative">
                    <Phone className="absolute top-3 left-3 text-gray-400" size={18} />
                    <input 
                      type="tel" 
                      name="phone"
                      placeholder="Nomor WhatsApp" 
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#dca5ad] focus:border-transparent outline-none transition-all text-sm"
                    />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#dca5ad] outline-none text-sm text-gray-600 bg-white"
                        >
                           <option value="FEMALE">Wanita</option>
                           <option value="MALE">Pria</option>
                        </select>
                    </div>
                    <div className="relative">
                        <Calendar className="absolute top-3 left-3 text-gray-400" size={16} />
                         <input 
                          type="date"
                          name="birthDate"
                          value={formData.birthDate}
                          onChange={handleChange}
                          className="w-full pl-10 pr-2 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#dca5ad] outline-none text-sm text-gray-600"
                        />
                    </div>
                 </div>
              </>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#dca5ad] hover:bg-[#c98d96] text-white font-medium py-3 rounded-lg transition-colors shadow-md mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : (isRegistering ? 'Daftar & Klaim Voucher' : 'Masuk')}
            </button>

          </form>

          {/* Toggle */}
          <div className="mt-6 text-center text-sm text-gray-500">
            {isRegistering ? 'Sudah punya akun? ' : 'Belum punya akun? '}
            <button 
              onClick={() => setIsRegistering(!isRegistering)}
              className="font-semibold text-[#dca5ad] hover:underline"
            >
              {isRegistering ? 'Login disini' : 'Daftar sekarang'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
