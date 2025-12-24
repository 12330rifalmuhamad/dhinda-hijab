import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSlider from '@/components/HeroSlider';
import MostWantedSection from '@/components/homepage/MostWantedSection';
import CategoriesSection from '@/components/homepage/CategoriesSection';
import FeaturesSection from '@/components/homepage/FeaturesSection';
import OfflineStoreSection from '@/components/homepage/OfflineStoreSection';
import prisma from '@/lib/prisma';

// Fungsi untuk mengambil data produk di server
async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      take: 4, // Ambil 4 produk terbaru
      orderBy: { createdAt: 'desc' },
      include: {
        images: { take: 1, orderBy: { createdAt: 'asc' } },
      },
    });
    return products;
  } catch (error) {
    console.error("Gagal mengambil produk:", error);
    return []; // Kembalikan array kosong jika error
  }
}

// Fungsi untuk mengambil data kategori di server
async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
    return categories;
  } catch (error) {
    console.error("Gagal mengambil kategori:", error);
    return []; // Kembalikan array kosong jika error
  }
}

// Halaman utama sekarang adalah async Server Component
export default async function HomePage() {
  // Panggil kedua fungsi secara bersamaan untuk efisiensi
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return (
    <>
      {/* Navbar & Footer ada di layout, jadi tidak perlu di sini */}
      <main>
        <HeroSlider />
        {/* Kirim data sebagai props ke komponen */}
        <MostWantedSection products={products} />
        <FeaturesSection />
        <CategoriesSection categories={categories} />
        <OfflineStoreSection />
      </main>
    </>
  );
}