import prisma from '@/lib/prisma';
import ArticleForm from '@/components/admin/ArticleForm';
import { notFound } from 'next/navigation';

export default async function EditArticlePage({ params }) {
  const { id } = await params;
  
  const article = await prisma.article.findUnique({
    where: { id },
  });

  if (!article) notFound();

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-6 py-8">
        <ArticleForm initialData={article} isEditing />
      </main>
    </div>
  );
}
