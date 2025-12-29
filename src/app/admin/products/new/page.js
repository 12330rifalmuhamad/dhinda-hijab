import prisma from '@/lib/prisma';
import ProductForm from '@/components/admin/ProductForm';

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' }});

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-6 py-8">
        <ProductForm categories={categories} />
      </main>
    </div>
  );
}
