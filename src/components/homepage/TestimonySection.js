"use client";
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export default function TestimonySection({ section }) {
    const testimonies = section.content?.estimoni || [];

    if (testimonies.length === 0) return null;

    return (
        <section className="py-12 overflow-hidden relative">
            <div className="container mx-auto px-4 sm:px-6 relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <span className="text-sm font-medium text-[#dca5ad] uppercase tracking-[0.2em] mb-3 block">Testimonials</span>
                    <h2 className="text-2xl md:text-3xl font-serif text-[#4a4042] mb-4">{section.title || 'What Our Customers Say'}</h2>
                    {section.subtitle && <p className="text-gray-500 max-w-xl mx-auto font-light">{section.subtitle}</p>}
                </div>

                <div className="relative group">
                    <Swiper
                        modules={[Autoplay, Pagination, Navigation]}
                        spaceBetween={30}
                        centeredSlides={true}
                        autoplay={{ delay: 5000, disableOnInteraction: false }}
                        pagination={{ clickable: true }}
                        navigation={{
                            nextEl: '.swiper-button-next-custom',
                            prevEl: '.swiper-button-prev-custom',
                        }}
                        loop={true}
                        breakpoints={{
                            640: { slidesPerView: 1 },
                            768: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                        }}
                        className="pb-12"
                    >
                        {testimonies.map((item, index) => (
                            <SwiperSlide key={item.id || index} className="h-auto">
                                <div className="bg-white p-8 rounded-2xl shadow-sm border h-full flex flex-col items-center text-center relative mx-2">
                                    <Quote size={40} className="text-[#dca5ad]/20 absolute top-6 left-6" />

                                    <div className="relative w-20 h-20 mb-6 rounded-full overflow-hidden border-2 border-white shadow-md">
                                        {item.image ? (
                                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-xl font-bold">
                                                {item.name?.charAt(0) || '?'}
                                            </div>
                                        )}
                                    </div>

                                    <p className="text-gray-600 italic mb-6 leading-relaxed flex-1">
                                        &quot;{item.message}&quot;
                                    </p>

                                    <div>
                                        <h4 className="font-serif text-lg text-[#4a4042]">{item.name}</h4>
                                        {item.role && <p className="text-xs text-[#dca5ad] font-bold uppercase tracking-wider mt-1">{item.role}</p>}
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Custom Navigation Buttons */}
                    <>
                        <button
                            className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 -ml-2 sm:-ml-4 bg-white shadow-lg p-3 rounded-full text-gray-800 hover:text-[#dca5ad] transition-all z-20 border border-gray-100 hover:scale-110 flex items-center justify-center cursor-pointer disabled:opacity-50"
                            aria-label="Previous Slide"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button
                            className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 -mr-2 sm:-mr-4 bg-white shadow-lg p-3 rounded-full text-gray-800 hover:text-[#dca5ad] transition-all z-20 border border-gray-100 hover:scale-110 flex items-center justify-center cursor-pointer disabled:opacity-50"
                            aria-label="Next Slide"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </>
                </div>
            </div>
        </section>
    );
}
