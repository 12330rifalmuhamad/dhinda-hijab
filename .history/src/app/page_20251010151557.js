import prisma from '@/lib/prisma';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Impor komponen-komponen baru/lama yang akan kita gunakan
import HeroSection from '@/components/homepage/HeroSection';
import ProductCarousel from '@/components/homepage/ProductCarousel';
import ProductGrid from '@/components/homepage/ProductGrid';
import Image from 'next/image';
import Link from 'next/link';

// Fungsi untuk mengambil berbagai jenis data produk di server
async function getHomepageData() {
  try {
    const [newArrivals, bestSellers, pashminaProducts] = await Promise.all([
      // 8 Produk Terbaru
      prisma.product.findMany({
        take: 8,
        orderBy: { createdAt: 'desc' },
        include: { images: { take: 1, orderBy: { createdAt: 'asc' } } },
      }),
      // 4 Produk Terlaris (saat ini kita urutkan berdasarkan stok, nanti bisa diganti)
      prisma.product.findMany({
        take: 4,
        orderBy: { stock: 'asc' }, // Asumsi stok sedikit = laris
        include: { images: { take: 1, orderBy: { createdAt: 'asc' } } },
      }),
      // 4 Produk dari kategori Pashmina
      prisma.product.findMany({
        where: { category: { name: { equals: 'Pashmina', mode: 'insensitive' } } },
        take: 4,
        include: { images: { take: 1, orderBy: { createdAt: 'asc' } } },
      }),
    ]);
    return { newArrivals, bestSellers, pashminaProducts };
  } catch (error) {
    console.error("Gagal mengambil data homepage:", error);
    return { newArrivals: [], bestSellers: [], pashminaProducts: [] };
  }
}


export default async function HomePage() {
  const { newArrivals, bestSellers, pashminaProducts } = await getHomepageData();

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ProductCarousel title="Koleksi Terbaru" products={newArrivals} />
        <ProductGrid title="Pilihan Terlaris" products={bestSellers} />

        {/* Banner Promosi Sederhana */}
        <section className="container mx-auto px-4 sm:px-6 my-20">
          <Link href="/collections/sale" className="block relative w-full h-64 rounded-lg overflow-hidden">
            <Image src="/img/banner-promo.png" alt="Promo Banner" fill className="object-cover" />
            <div className="absolute inset-0 bg-black/30 flex flex-col justify-center items-center text-white">
              <h2 className="text-4xl font-bold">SALE UP TO 50%</h2>
              <p className="mt-2">Shop Our Biggest Sale of the Season</p>
            </div>
          </Link>
        </section>

        <ProductGrid title="Pashmina Essentials" products={pashminaProducts} />
      </main>
      <Footer />
    </>
  );
}