"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';

export default function ProductView({ product }) {
  const [activeImage, setActiveImage] = useState(null);

  useEffect(() => {
    if (product) {
        const initialImage = product.images && product.images.length > 0 
            ? product.images[0].url 
            : (product.imageUrl || 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg');
        setActiveImage(initialImage);
    }
  }, [product]);

  if (!product) {
    return <div className="text-center text-gray-500 py-10">Produk tidak ditemukan.</div>;
  }

  const allImages = product.images && product.images.length > 0 
    ? product.images.map(img => img.url)
    : (product.imageUrl ? [product.imageUrl] : ['https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg']);

  const currentImage = activeImage || allImages[0];

  return (
    <main className="container mx-auto px-4 sm:px-6 py-12 bg-[#FFF8F8]"> {/* Background matched to pinkish tone if desired, or keep white */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Thumbnails (Desktop: Left Column, Mobile: Hidden/Bottom) */}
        <div className="hidden lg:flex lg:col-span-1 flex-col gap-4">
             {allImages.map((img, index) => (
               <button 
                 key={index} 
                 onClick={() => setActiveImage(img)}
                 className={`relative w-full aspect-[3/4] overflow-hidden border-2 transition-all ${currentImage === img ? 'border-[#dca5ad]' : 'border-transparent hover:border-gray-200'}`}
               >
                 <Image
                   src={img}
                   alt={`${product.name} ${index + 1}`}
                   fill
                   className="object-cover"
                 />
               </button>
             ))}
        </div>

        {/* Main Image */}
        <div className="col-span-1 lg:col-span-6">
           <div className="relative w-full aspect-[3/4] bg-white rounded-sm overflow-hidden shadow-sm">
             <Image
               src={currentImage}
               alt={product.name}
               fill
               className="object-cover"
               priority
             />
           </div>
           
           {/* Mobile Thumbnails (Horizontal) */}
           <div className="flex lg:hidden gap-3 mt-4 overflow-x-auto pb-2 scrollbar-hide">
              {allImages.map((img, index) => (
               <button 
                 key={index} 
                 onClick={() => setActiveImage(img)}
                 className={`relative min-w-[80px] w-20 aspect-[3/4] overflow-hidden border-2 rounded-sm transition-all ${currentImage === img ? 'border-[#dca5ad]' : 'border-transparent'}`}
               >
                 <Image
                   src={img}
                   alt={`${product.name} ${index + 1}`}
                   fill
                   className="object-cover"
                 />
               </button>
             ))}
           </div>
        </div>

        {/* Product Information */}
        <div className="col-span-1 lg:col-span-5 flex flex-col pt-2 lg:pl-8">
          {/* Brand / Category */}
          <span className="text-xs font-bold tracking-[0.2em] text-gray-500 uppercase mb-3">
             {product.category?.name || 'DHINDA HIJAB'}
          </span>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-serif text-[#4a4042] leading-tight mb-4 tracking-wide">
             {product.name}
          </h1>

          {/* Price */}
          <div className="flex items-center gap-4 mb-8">
             <span className="text-xl font-bold text-[#dca5ad] tracking-widest">
               IDR {product.price.toLocaleString('id-ID')}
             </span>
             {/* Placeholder for discount/strikethrough if needed in future */}
             {/* <span className="text-gray-400 line-through text-sm">IDR 459.000</span> */}
          </div>

          {/* Description */}
          <div className="prose prose-sm text-gray-600 font-light leading-relaxed mb-8">
             <h3 className="text-sm font-medium text-gray-800 mb-2">Detail Produk</h3>
             <p className="whitespace-pre-line">{product.description}</p>
          </div>

          {/* Material */}
          {product.material && (
             <div className="mb-8">
                <h3 className="text-sm font-medium text-gray-800 mb-1">Bahan</h3>
                <p className="text-gray-600 font-light">{product.material}</p>
             </div>
          )}

          {/* Size Chart (Static Link/Placeholder) */}
          <div className="mb-10">
             <button className="text-sm text-gray-500 underline decoration-gray-300 underline-offset-4 hover:text-black transition-colors">
                View Size Chart
             </button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            {product.shopeeUrl && (
              <a 
                href={product.shopeeUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-3 bg-[#EE4D2D] text-white py-3.5 rounded-sm hover:bg-[#d03e1f] transition-all font-medium tracking-widest uppercase text-xs shadow-sm hover:shadow-md"
              >
                <div className="w-4 h-4 relative flex items-center justify-center">
                  <ShoppingBag size={14} />
                </div>
                Shop via Shopee
              </a>
            )}

            {product.tiktokUrl && (
              <a 
                href={product.tiktokUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-3 bg-black text-white py-3.5 rounded-sm hover:bg-gray-800 transition-all font-medium tracking-widest uppercase text-xs shadow-sm hover:shadow-md"
              >
                 <div className="w-4 h-4 relative flex items-center justify-center">
                  <ShoppingBag size={14} />
                </div>
                Shop via TikTok
              </a>
            )}

            <a 
                 href={`https://wa.me/6281234567890?text=Halo, saya tertarik dengan produk ${product.name}`}
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="w-full flex items-center justify-center gap-3 bg-[#25D366] text-white py-3.5 rounded-sm hover:bg-[#20b85a] transition-all font-medium tracking-widest uppercase text-xs shadow-sm hover:shadow-md"
               >
                 <div className="w-4 h-4 relative flex items-center justify-center">
                   <ShoppingBag size={14} />
                 </div>
                 Shop via WhatsApp
               </a>
          </div>
        </div>
      </div>
    </main>
  );
}