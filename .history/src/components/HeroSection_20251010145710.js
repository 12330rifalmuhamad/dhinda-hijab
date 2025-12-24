// src/components/HeroSection.js
import Image from 'next/image';

export default function HeroSection() {
  return (
    <section className="relative w-full h-[70vh] text-text-primary">
      <Image 
        src="/img/hero-lozy.jpg" // Ganti dengan gambar hero Anda
        alt="Hero Image"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="container mx-auto px-6 h-full flex flex-col justify-center">
        <div className="relative max-w-md">
          <h2 className="text-5xl font-serif font-medium leading-tight">Printed Perfection</h2>
          <p className="mt-2 text-lg">Beauty in Every Detail</p>
        </div>
      </div>
    </section>
  );
}