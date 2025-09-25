import prisma from "@/lib/prisma";
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductView from '@/components/ProductView'; // Impor komponen client yang baru

// Fungsi ini berjalan di server untuk mengambil data
async function getProduct(id) {
  const product = await prisma.product.findUnique({
    where: { id: id },
    include: {
      category: true,
    },
  });

  // Jika produk tidak ada, tampilkan halaman 404
  if (!product) {
    notFound();
  }
  return product;
}

// Halaman ini sekarang adalah async Server Component
export default async function ProductDetailPage({ params }) {
  // Ambil data produk di server
  const product = await getProduct(params.id);

  // Kirim data produk sebagai prop ke komponen client
  return (
    <>
      <Navbar />
      <ProductView product={product} />
      <Footer />
    </>
  );
}