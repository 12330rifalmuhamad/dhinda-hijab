"use client";
import { useState, useEffect } from 'react';
import { X, User, Phone, Mail, Calendar, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

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
    gender: 'FEMALE',
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

  const handleGoogleLogin = () => {
    signIn('google');
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

          {/* Google Login Button */}
          {!isRegistering && (
            <>
              <button
                onClick={handleGoogleLogin}
                type="button"
                className="w-full h-11 flex items-center justify-center gap-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-medium mb-5 text-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </button>

              <div className="relative flex py-2 items-center mb-5">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink-0 mx-4 text-gray-400 text-xs uppercase tracking-widest">Or</span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>
            </>
          )}

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
