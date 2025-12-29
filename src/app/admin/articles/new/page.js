import ArticleForm from '@/components/admin/ArticleForm';

export default function NewArticlePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-6 py-8">
        <ArticleForm />
      </main>
    </div>
  );
}
