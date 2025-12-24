import prisma from "@/lib/prisma";
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductView from '@/components/ProductView';

// Halaman ini sekarang adalah async Server Component
export default async function ProductDetailPage({ params }) {
  const { id } = params; // Ambil ID dari params

  // Kita letakkan logika getProduct langsung di sini untuk kejelasan
  const product = await prisma.product.findUnique({
    where: { id: id },
    include: {
      category: true,
      images: { // Sertakan semua gambar produk
        orderBy: {
          createdAt: 'asc'
        }
      },
    },
  });

  // Jika produk tidak ditemukan, tampilkan halaman 404
  if (!product) {
    notFound();
  }

  // Kirim data produk sebagai prop ke komponen client
  return (
    <>
      <ProductView product={product} />
    </>
  );
}