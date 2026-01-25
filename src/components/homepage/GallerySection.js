"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';

const STAGGER_CHILD_VARIANTS = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function GallerySection({ images = [] }) {
    // Use a predefined set of images if none are provided, or mix provided ones
    // For the collage effect, we want a mix of aspect ratios if possible, 
    // but we'll force a grid layout.

    // If we don't have enough images, we might want to hide the section or show placeholders?
    // For now let's assume valid input or handle gracefully.
    if (!images || images.length === 0) return null;

    // Take the first 5 images for a nice 3-column bento grid for instance
    // or a creative masonry. 
    // Layout idea:
    // [ Large Vertical ] [ Small ] [ Small ]
    // [ Large Vertical ] [    Medium     ]
    //
    // Let's go with a responsive Grid with some spanning items.
    const galleryImages = images.slice(0, 6);

    return (
        <section className="py-12 overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span className="text-sm font-medium tracking-widest text-pink-500 uppercase mb-3 block">Inspiration</span>
                    <h2 className="text-3xl md:text-5xl font-serif text-[#4a4042] mb-6">#DhindaHijabStyle</h2>
                    <p className="text-gray-500 max-w-2xl mx-auto font-light leading-relaxed">
                        See how our community styles their favorites. Tag us to be featured in our gallery.
                    </p>
                </motion.div>

                <motion.div
                    className="grid grid-cols-2 md:grid-cols-4 md:grid-rows-2 gap-4 h-auto md:h-[600px]"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ staggerChildren: 0.1 }}
                >
                    {/* Main Large Image - Spans 2 rows, 2 columns on desktop */}
                    {galleryImages[0] && (
                        <motion.div variants={STAGGER_CHILD_VARIANTS} className="relative col-span-2 md:row-span-2 rounded-2xl overflow-hidden group aspect-square md:aspect-auto">
                            <Image
                                src={galleryImages[0].url}
                                alt="Gallery Highlight"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
                        </motion.div>
                    )}

                    {/* Secondary Stack - Right Side */}
                    {/* Image 2 */}
                    {galleryImages[1] && (
                        <motion.div variants={STAGGER_CHILD_VARIANTS} className="relative col-span-1 md:row-span-1 rounded-2xl overflow-hidden group aspect-square md:aspect-auto">
                            <Image
                                src={galleryImages[1].url}
                                alt="Gallery Item"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                sizes="(max-width: 768px) 50vw, 25vw"
                            />
                        </motion.div>
                    )}

                    {/* Image 3 */}
                    {galleryImages[2] && (
                        <motion.div variants={STAGGER_CHILD_VARIANTS} className="relative col-span-1 md:row-span-1 rounded-2xl overflow-hidden group aspect-square md:aspect-auto">
                            <Image
                                src={galleryImages[2].url}
                                alt="Gallery Item"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                sizes="(max-width: 768px) 50vw, 25vw"
                            />
                        </motion.div>
                    )}

                    {/* Image 4 - Wide on bottom right */}
                    {galleryImages[3] && (
                        <motion.div variants={STAGGER_CHILD_VARIANTS} className="relative col-span-2 md:col-span-2 md:row-span-1 rounded-2xl overflow-hidden group aspect-[2/1] md:aspect-auto">
                            <Image
                                src={galleryImages[3].url}
                                alt="Gallery Item"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        </motion.div>
                    )}

                </motion.div>

                <div className="mt-8 text-center md:hidden">
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-pink-500 hover:text-pink-600 transition-colors">
                        View on Instagram &rarr;
                    </a>
                </div>
            </div>
        </section>
    );
}
