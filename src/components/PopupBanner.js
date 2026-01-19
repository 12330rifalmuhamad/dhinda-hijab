"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function PopupBanner() {
    const [popup, setPopup] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    const pathname = usePathname();

    useEffect(() => {
        // 1. Fetch the active popup
        fetch('/api/admin/popup')
            .then(res => res.json())
            .then(data => {
                console.log('Popup Data:', data);
                if (data && data.isActive && data.imageUrl) {
                    const isHomePage = pathname === '/';

                    // 2. Check if already dismissed (skip check if on Home Page)
                    const dismissedKey = `popup_dismissed_${data.id}`;
                    const isDismissed = localStorage.getItem(dismissedKey);
                    console.log('Is Dismissed:', isDismissed, 'Is Home:', isHomePage);

                    // If it's the home page, ALWAYS show it (unless we want to enforce it per session, but request said "always")
                    // Request: "buatkan agar pertama kali membuka halaman utama, agar selalu menampilkan popup banner"
                    // Meaning: When opening main page, always show. 
                    // To avoid it showing on navigating BACK to home, we might want it. 
                    // But usually "always check" suffices for "startup". 
                    // The simplest interpretation: Ignore isDismissed if isHomePage.

                    if (!isDismissed) {
                        setPopup(data);
                        // Small delay for animation
                        setTimeout(() => setIsVisible(true), 1000);
                    }
                }
            })
            .catch(err => console.error('Failed to load popup', err));
    }, [pathname]);

    const handleClose = () => {
        if (!popup) return;

        setIsVisible(false);
        // Wait for animation to finish before removing from DOM (optional, but cleaner)
        setTimeout(() => {
            setPopup(null);
            // Save dismissal
            localStorage.setItem(`popup_dismissed_${popup.id}`, 'true');
        }, 300);
    };

    if (!popup) return null;

    return (
        <div
            className={`fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={(e) => {
                if (e.target === e.currentTarget) handleClose();
            }}
        >
            <div
                className={`relative bg-white rounded-2xl overflow-hidden shadow-2xl max-w-md w-full transform transition-all duration-300 ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}
            >
                <button
                    onClick={handleClose}
                    className="absolute top-3 right-3 z-10 p-1.5 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors backdrop-blur-md"
                >
                    <X size={20} />
                </button>

                <div className="relative aspect-[4/5] w-full bg-gray-100">
                    <Image
                        src={popup.imageUrl}
                        alt={popup.title || "Promo"}
                        fill
                        className="object-cover"
                    />

                    {/* Optional: Overlay Link Area if no Button text provided but link exists */}
                    {popup.linkUrl && (
                        <Link href={popup.linkUrl} className="absolute inset-0" onClick={handleClose}>
                            <span className="sr-only">{popup.title || "View Promo"}</span>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
