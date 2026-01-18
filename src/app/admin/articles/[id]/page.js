import prisma from '@/lib/prisma';
import ArticleForm from '@/components/admin/ArticleForm';
import { notFound } from 'next/navigation';

export default async function EditArticlePage({ params }) {
  const { id } = await params;

  let article = null;
  try {
    article = await prisma.article.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error("Failed to fetch article:", error);
  }

  if (!article) notFound();

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-6 py-8">
        <ArticleForm initialData={article} isEditing />
      </main>
    </div>
  );
}
