import prisma from '@/lib/prisma';
import CategoryForm from '@/components/admin/CategoryForm';
import { notFound } from 'next/navigation';

export default async function EditCategoryPage({ params }) {
  const { id } = await params;
  
  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) notFound();

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-6 py-8">
        <CategoryForm initialData={category} isEditing />
      </main>
    </div>
  );
}
