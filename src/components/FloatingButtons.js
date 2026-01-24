"use client";
import { useState } from 'react';
import { MessageCircle, Gift } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CustomerLoginModal from './CustomerLoginModal';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function FloatingButtons() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [showClaimSuccess, setShowClaimSuccess] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const handleVoucherClick = () => {
    if (session) {
      setShowClaimSuccess(true);
      setTimeout(() => setShowClaimSuccess(false), 3000); // Auto hide after 3s
    } else {
      setIsLoginOpen(true);
    }
  };

  return (
    <>
      <CustomerLoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        initialIsRegistering={true}
      />

      {/* Claim Success Modal (Simple) */}
      <AnimatePresence>
        {showClaimSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white rounded-xl shadow-2xl p-6 flex flex-col items-center border border-pink-100 pointer-events-auto">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-500">
                <Gift size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Voucher Diklaim!</h3>
              <p className="text-gray-500 text-center mb-4 text-sm">Selamat! Voucher diskon pengguna baru berhasil disimpan ke akun Anda.</p>
              <button
                onClick={() => setShowClaimSuccess(false)}
                className="bg-[#dca5ad] text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-[#c48b94] transition-colors"
              >
                Tutup
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gift/Reward Button (Bottom Left) */}
      <div className="fixed bottom-6 left-6 z-40 flex items-center group">
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1, type: "spring" }}
          onClick={handleVoucherClick}
          className="bg-[#eebec6] p-3 rounded-full shadow-lg text-white hover:bg-[#dca5ad] transition-colors relative"
        >
          <Gift size={28} />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
          </span>
        </motion.button>

        {/* Tooltip Label */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.5 }}
          className="ml-3 bg-white px-4 py-2 rounded-lg shadow-md border border-[#ffe4e6] text-[#4a4042] font-medium text-sm whitespace-nowrap hidden md:block"
        >
          {session ? "Klaim Voucher Saya" : "Klaim Voucher"}
          <div className="absolute left-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-l border-b border-[#ffe4e6] rotate-45 transform"></div>
        </motion.div>
      </div>

      {/* Chat Button (Bottom Right) */}
      {/* Chat Button (Bottom Right) */}
      <motion.a
        href="https://wa.me/6287747467188?text=Halo, saya ingin bertanya seputar produk Dhinda Hijab"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.2, type: "spring" }}
        className="fixed bottom-6 right-6 z-40 bg-[#dca5ad] p-3 pl-4 pr-4 rounded-full shadow-lg text-white hover:bg-[#eebec6] transition-colors flex items-center gap-2 group cursor-pointer"
      >
        <MessageCircle size={28} />
        <span className="font-medium text-lg">Chat</span>

        {/* Notification Badge */}
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold border-2 border-white">
          1
        </span>
      </motion.a>
    </>
  );
}
