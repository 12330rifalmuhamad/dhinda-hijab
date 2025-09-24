// app/page.js

import Image from 'next/image';
import Navbar from '@/components/Navbar';
import { ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="container mx-auto px-6 mt-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-150px)]">
          
          {/* Left Column: Text Content */}
          <div className="relative">
            <div className="absolute -left-6 top-0 bottom-0 w-1 bg-gray-200 rounded-full"></div>
            <h1 className="text-8xl md:text-9xl font-black tracking-tighter leading-none">
              MODEST
            </h1>
            
            <div className="mt-8">
              <h2 className="text-lg font-bold">About</h2>
              <p className="mt-2 max-w-md text-gray-600">
                The hijab is more than just a piece of clothing — its a symbol of modesty, faith, and identity. Designed for comfort and elegance, it reflects the beauty of inner strength an personal choice. Our hijabs are crafted with premium fabrics to ensure a lightweight, breathable feel all day long.
              </p>
            </div>

            <div className="mt-8 flex items-center gap-12">
              <a href="#" className="flex items-center gap-3 font-bold group">
                Explore Our World
                <div className="bg-gray-900 text-white p-2 rounded-full group-hover:bg-gray-700 transition-colors">
                  <ArrowRight size={16} />
                </div>
              </a>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li>Soft, breathable hijabs that blend modesty elegance.</li>
                <li>Designed for comfort, style, self-expression.</li>
              </ul>
            </div>
          </div>

          {/* Right Column: Image */}
          <div className="relative w-full h-[50vh] lg:h-[75vh]">
            <Image
              src="/public/img/heroPage.png" // PASTIKAN NAMA FILE SESUAI
              alt="Model wearing a modest hijab"
              layout="fill"
              objectFit="cover"
              className="rounded-xl"
              priority
            />
            <h2 className="absolute bottom-8 right-8 text-7xl md:text-8xl font-black text-white/90 tracking-tighter leading-none">
              FASHION
            </h2>
          </div>
        </div>

        {/* Bottom Info Bar */}
        <div className="border-t border-gray-200 mt-12 py-6">
          <p className="text-2xl font-bold">
            500+ <span className="font-normal text-gray-500">Premium Product</span>
          </p>
        </div>
      </main>
    </>
  );
}