"use client";
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export default function StoriesSection({ articles }) {
  if (!articles || articles.length === 0) return null;

  return (
    <section className="bg-[#fff0f3] py-20">
      <div className="container mx-auto px-6">
        <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.5 }} 
            className="text-center mb-12"
        >
          <h2 className="text-xl tracking-[0.2em] font-medium text-gray-500 uppercase">Stories</h2>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {articles.map((article, index) => (
                <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex flex-col"
                >
                    <Link href={`/stories/${article.slug}`} className="block group mb-6 overflow-hidden">
                        <div className="relative aspect-[4/3] w-full overflow-hidden">
                             <Image 
                                src={article.imageUrl} 
                                alt={article.title} 
                                fill 
                                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
                             />
                        </div>
                    </Link>
                    
                    <h3 className="text-xl font-medium text-gray-800 mb-4 tracking-wide uppercase leading-snug">
                        <Link href={`/stories/${article.slug}`}>
                            {article.title}
                        </Link>
                    </h3>
                    
                    <p className="text-gray-500 mb-6 leading-relaxed line-clamp-3 text-sm">
                        {article.excerpt}
                    </p>
                    
                    <Link 
                        href={`/stories/${article.slug}`}
                        className="inline-block text-sm text-gray-500 border-b border-gray-400 pb-1 uppercase tracking-wider hover:text-black hover:border-black transition-colors self-start"
                    >
                        Read more
                    </Link>
                </motion.div>
            ))}
        </div>
        
        <div className="mt-16 text-center">
            <Link 
                href="/stories"
                className="inline-block bg-[#dca5ad] text-white px-8 py-3 rounded-sm uppercase tracking-widest text-sm hover:bg-[#c48b94] transition-colors shadow-sm"
            >
                View all articles
            </Link>
        </div>
      </div>
    </section>
  );
}
