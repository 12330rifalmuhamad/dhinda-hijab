
import prisma from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';

/*
  Stories / Articles Index Page
  Displays all articles with pagination or infinite scroll logic (initially just all for simplicity).
*/

// Fetch all articles
async function getArticles() {
    try {
        return await prisma.article.findMany({
            orderBy: { createdAt: 'desc' },
        });
    } catch (error) {
        console.error("Failed to fetch articles:", error);
        return [];
    }
}

export default async function StoriesPage() {
    const articles = await getArticles();

    return (
        <main className="min-h-screen bg-white pb-16 pt-24 md:pt-32 md:pb-24">
            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="flex flex-col items-center mb-12 md:mb-20 text-center">
                    <span className="text-sm font-medium text-[#dca5ad] uppercase tracking-[0.2em] mb-4">Dhinda Hijab Stories</span>
                    <h1 className="text-3xl md:text-6xl font-serif text-gray-900 mb-6 font-medium">
                        Latest News & Articles
                    </h1>
                    <p className="text-gray-500 max-w-xl text-lg font-light leading-relaxed">
                        Explore our latest updates, fashion tips, and stories from behind the scenes.
                    </p>
                </div>

                {articles.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-lg">
                        <p className="text-gray-500">No articles found yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                        {articles.map((article, index) => (
                            <article key={article.id} className="group flex flex-col h-full">
                                <Link href={`/stories/${article.slug}`} className="block overflow-hidden mb-6 relative aspect-[3/2] rounded-lg shadow-sm">
                                    <div className="absolute inset-0 bg-gray-200" />
                                    {article.imageUrl ? (
                                        <Image
                                            src={article.imageUrl}
                                            alt={article.title}
                                            fill
                                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                                            No Image
                                        </div>
                                    )}
                                    
                                    {/* Overlay on hover */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                                </Link>

                                <div className="flex flex-col flex-grow">
                                    <div className="flex items-center text-xs text-gray-500 mb-3 space-x-2 uppercase tracking-wide">
                                        <time dateTime={article.createdAt}>
                                            {new Date(article.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                        </time>
                                    </div>

                                    <h2 className="text-2xl font-serif font-medium text-gray-900 mb-3 leading-tight group-hover:text-[#dca5ad] transition-colors">
                                        <Link href={`/stories/${article.slug}`}>
                                            {article.title}
                                        </Link>
                                    </h2>

                                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-6 flex-grow font-light">
                                        {article.excerpt}
                                    </p>

                                    <Link
                                        href={`/stories/${article.slug}`}
                                        className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-black hover:text-[#dca5ad] transition-colors mt-auto group/link"
                                    >
                                        Read Story
                                        <svg className="w-4 h-4 ml-1 transform transition-transform group-hover/link:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
