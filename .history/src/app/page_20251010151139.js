import prisma from '@/lib/prisma';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Impor komponen-komponen section
import HeroSection from '@/components/homepage/HeroSection';
import ProductCarousel from '@/components/homepage/ProductCarousel';
import ProductGrid from '@/components/homepage/ProductGrid';
import Image from 'next/image';
import Link from 'next/link';

// Fungsi untuk mengambil semua data homepage di server
async function getHomepageData() {
  try {
    const [heroProducts, newArrivals, bestSellers, pashminaProducts] = await Promise.all([
      // 4 produk untuk Hero Section
      prisma.product.findMany({
        take: 4,
        orderBy: { updatedAt: 'desc' },
        include: { images: { take: 1, orderBy: { createdAt: 'asc' } } },
      }),
      // 8 Produk Terbaru untuk Carousel
      prisma.product.findMany({
        take: 8,
        orderBy: { createdAt: 'desc' },
        include: { images: { take: 1, orderBy: { createdAt: 'asc' } } },
      }),
      // 4 Produk Terlaris untuk Grid
      prisma.product.findMany({
        take: 4,
        orderBy: { stock: 'asc' }, // Asumsi stok sedikit = laris
        include: { images: { take: 1, orderBy: { createdAt: 'asc' } } },
      }),
      // 4 Produk dari kategori Pashmina untuk Grid
      prisma.product.findMany({
        where: { category: { name: { equals: 'Pashmina', mode: 'insensitive' } } },
        take: 4,
        include: { images: { take: 1, orderBy: { createdAt: 'asc' } } },
      }),
    ]);
    return { heroProducts, newArrivals, bestSellers, pashminaProducts };
  } catch (error) {
    console.error("Gagal mengambil data homepage:", error);
    // Kembalikan array kosong jika terjadi error agar tidak crash
    return { heroProducts: [], newArrivals: [], bestSellers: [], pashminaProducts: [] };
  }
}

export default async function HomePage() {
  const { heroProducts, newArrivals, bestSellers, pashminaProducts } = await getHomepageData();

  return (
    <>
      <Navbar />
      <main>
        <HeroSection products={heroProducts} />
        <ProductCarousel title="Koleksi Terbaru" products={newArrivals} />
        <ProductGrid title="Pilihan Terlaris" products={bestSellers} />

        {/* Banner Promosi Sederhana */}
        <section className="container mx-auto px-4 sm:px-6 my-20">
          <Link href="/collections/sale" className="block relative w-full h-64 rounded-lg overflow-hidden group">
            <Image src="/img/banner-promo.png" alt="Promo Banner" fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/30 flex flex-col justify-center items-center text-white p-4">
              <h2 className="text-4xl font-bold text-center">SALE UP TO 50%</h2>
              <p className="mt-2 text-center">Shop Our Biggest Sale of the Season</p>
            </div>
          </Link>
        </section>

        <ProductGrid title="Pashmina Essentials" products={pashminaProducts} />
      </main>
      <Footer />
    </>
  );
}