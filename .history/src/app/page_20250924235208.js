// app/page.js

import Image from 'next/image';
import Navbar from '@/components/Navbar';
import { ArrowRight } from 'lucide-react';
import Footer from '@/components/Footer';

const mostWantedProducts = [
  {
    id: 1,
    name: 'Pashmina Silk Premium',
    price: '75.000',
    imageUrl: '/img/product-1.jpg', // Ganti dengan path gambar Anda
  },
  {
    id: 2,
    name: 'Bergo Maryam Diamond',
    price: '55.000',
    imageUrl: '/img/product-2.jpg', // Ganti dengan path gambar Anda
  },
  {
    id: 3,
    name: 'Square Voal Motif',
    price: '60.000',
    imageUrl: '/img/product-3.jpg', // Ganti dengan path gambar Anda
  },
  {
    id: 4,
    name: 'Instant Jersey Hijab',
    price: '85.000',
    imageUrl: '/img/product-4.jpg', // Ganti dengan path gambar Anda
  },
];

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
              src="/img/heroPage.png"
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


      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-bold text-center text-gray-900">Most Wanted Items</h2>
            <p className="text-center text-gray-500 mt-2">Discover the products that everyone is talking about.</p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12"
            initial="hidden"
            whileInView="visible" // Animasi dimulai saat section terlihat
            viewport={{ once: true, amount: 0.2 }} // `amount: 0.2` artinya animasi jalan saat 20% section terlihat
            transition={{ staggerChildren: 0.1 }}
          >
            {mostWantedProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
}