"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function SocialLinksSection({ data }) {
    if (!data || !data.content || !data.content.links || data.content.links.length === 0) {
        return null;
    }

    const { links } = data.content;
    return (
        <section className="py-8 md:py-12 relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">

                {/* Section Header */}
                {(title || subtitle) && (
                    <div className="text-center mb-10 md:mb-14">
                        {subtitle && (
                            <span className="block text-[#dca5ad] font-medium tracking-[0.2em] uppercase text-xs or mb-3">
                                {subtitle}
                            </span>
                        )}
                        {title && (
                            <h2 className="text-3xl md:text-4xl font-serif text-[#4a4042]">
                                {title}
                            </h2>
                        )}
                        <div className="w-16 h-0.5 bg-[#dca5ad] mx-auto mt-6"></div>
                    </div>
                )}

                {/* Links Grid */}
                <div className="flex flex-wrap justify-center gap-6 md:gap-10">
                    {links.map((link, index) => (
                        <motion.div
                            key={link.id || index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            viewport={{ once: true }}
                        >
                            <Link
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex flex-col items-center gap-4 transition-transform hover:-translate-y-1"
                            >
                                <div className="w-16 h-16 md:w-20 md:h-20 relative bg-white rounded-2xl shadow-sm border border-gray-100 p-3 group-hover:shadow-md transition-shadow flex items-center justify-center">
                                    {link.icon ? (
                                        <div className="relative w-full h-full">
                                            <Image
                                                src={link.icon}
                                                alt={link.name}
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-10 h-10 bg-gray-200 rounded-full" />
                                    )}
                                </div>
                                {link.name && (
                                    <span className="text-sm md:text-base font-medium text-[#4a4042] group-hover:text-[#dca5ad] transition-colors">
                                        {link.name}
                                    </span>
                                )}
                            </Link>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}
