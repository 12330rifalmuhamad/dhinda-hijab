'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export default function ArticlesSection({ articles, title }) {
  if (!articles || articles.length === 0) return null;

  return (
    <section className="py-12">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center mb-10 md:mb-16"
        >
          <span className="text-sm font-medium text-[#dca5ad] uppercase tracking-[0.2em] mb-3">Blog & News</span>
          <h2 className="text-2xl md:text-4xl font-serif text-[#4a4042] mb-6">{title || "Latest Articles"}</h2>
          <div className="w-16 h-[1px] bg-black/20"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-12">
          {articles.map((article, index) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group flex flex-col h-full"
            >
              <Link href={`/stories/${article.slug}`} className="block overflow-hidden mb-6 relative aspect-[3/2]">
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
              </Link>

              <div className="flex flex-col flex-grow">
                <div className="flex items-center text-xs text-gray-500 mb-3 space-x-2 uppercase tracking-wide">
                  <time dateTime={article.createdAt}>{new Date(article.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</time>
                  <span>•</span>
                  <span>Article</span>
                </div>

                <h3 className="text-xl font-medium text-gray-900 mb-3 leading-snug group-hover:text-gray-600 transition-colors">
                  <Link href={`/stories/${article.slug}`}>
                    {article.title}
                  </Link>
                </h3>

                <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-6 flex-grow">
                  {article.excerpt}
                </p>

                <Link
                  href={`/stories/${article.slug}`}
                  className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-[#4a4042] hover:text-[#dca5ad] transition-colors mt-auto group/link"
                >
                  Read Article
                  <svg className="w-4 h-4 ml-1 transform transition-transform group-hover/link:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
