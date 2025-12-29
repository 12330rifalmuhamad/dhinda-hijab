import prisma from '@/lib/prisma';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, Share2 } from 'lucide-react';
import Link from 'next/link';

export default async function ArticleDetailPage({ params }) {
  const { slug } = await params;

  const article = await prisma.article.findUnique({
    where: { slug }
  });

  if (!article) notFound();

  // Determine if content is HTML (simple check)
  const isHtml = article.content.trim().startsWith('<');

  return (
    <article className="min-h-screen bg-white">
      {/* Editorial Header */}
      <div className="relative pt-24 pb-12 md:py-40 bg-gray-50 flex flex-col items-center px-6">
         <div className="max-w-3xl w-full text-center z-10">
            <Link href="/" className="inline-flex items-center text-xs font-bold tracking-widest uppercase text-gray-400 hover:text-black mb-8 transition-colors">
                <ArrowLeft size={14} className="mr-2" />
                Back to Home
            </Link>
            
            <span className="block text-sm font-medium text-[#dca5ad] uppercase tracking-[0.2em] mb-4">
                {new Date(article.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            
            <h1 className="text-2xl md:text-5xl md:leading-[1.2] font-serif text-gray-900 mb-8 font-medium">
                {article.title}
            </h1>
         </div>
      </div>

      {/* Main Image */}
      <div className="container mx-auto px-0 md:px-6 -mt-10 md:-mt-20 mb-16 md:mb-24 relative z-20">
         <div className="relative w-full aspect-[16/9] md:aspect-[21/9] max-h-[70vh] shadow-xl md:rounded-lg overflow-hidden">
            <Image 
                src={article.imageUrl} 
                alt={article.title} 
                fill 
                className="object-cover" 
                priority 
                sizes="100vw"
            />
         </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 mb-16 md:mb-24">
         <div className="max-w-2xl mx-auto">
             <div className="prose prose-lg prose-headings:font-serif prose-headings:font-medium prose-p:font-light prose-p:leading-8 prose-p:text-gray-600 prose-a:text-[#dca5ad] hover:prose-a:text-[#c48b94] prose-img:rounded-lg mb-16">
                 {isHtml ? (
                     <div dangerouslySetInnerHTML={{ __html: article.content }} />
                 ) : (
                     article.content.split('\n').map((paragraph, index) => (
                        paragraph.trim() && <p key={index}>{paragraph}</p>
                     ))
                 )}
             </div>

             {/* Footer / Share */}
             <div className="border-t border-gray-100 pt-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h3 className="font-serif text-lg text-gray-900 mb-1">Dhinda Hijab Stories</h3>
                    <p className="text-gray-400 text-sm font-light">Inspiration for your daily style</p>
                </div>
                
                <div className="flex items-center gap-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Share</span>
                    <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#dca5ad] hover:text-[#dca5ad] transition-colors bg-white">
                        <Share2 size={16} />
                    </button>
                    {/* Add real share functionality if needed later */}
                </div>
             </div>
         </div>
      </div>
    </article>
  );
}
