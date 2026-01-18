import prisma from '@/lib/prisma';
import ProductForm from '@/components/admin/ProductForm';
import { notFound } from 'next/navigation';

export default async function EditProductPage({ params }) {
  const { id } = await params;

  let product = null;
  let categories = [];

  try {
    [product, categories] = await Promise.all([
      prisma.product.findUnique({
        where: { id },
        include: { images: true }
      }),
      prisma.category.findMany({ orderBy: { name: 'asc' } })
    ]);
  } catch (error) {
    console.error("Failed to fetch product data:", error);
  }

  if (!product) notFound();

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-6 py-8">
        <ProductForm initialData={product} categories={categories} isEditing />
      </main>
    </div>
  );
}
