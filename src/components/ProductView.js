"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ShoppingBag, Star } from 'lucide-react';
import { useCart } from '@/context/cartContext';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function ProductView({ product }) {
  const { addToCart } = useCart();
  const router = useRouter();

  // Mockup Data for Variants (Since DB currently doesn't have them)
  const dummyColors = ['Dark Denim', 'Black'];
  const dummySizes = ['S-M', 'L-XL'];

  const [activeImage, setActiveImage] = useState(null);
  const [selectedColor, setSelectedColor] = useState(dummyColors[0]);
  const [selectedSize, setSelectedSize] = useState(dummySizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const { data: session } = useSession();
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    if (product) {
      const initialImage = product.images && product.images.length > 0
        ? product.images[0].url
        : (product.imageUrl || 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg');
      setActiveImage(initialImage);

      const fetchReviews = async () => {
        try {
          const res = await fetch(`/api/products/${product.id}/reviews`);
          if (res.ok) {
            setReviews(await res.json());
          }
        } catch (e) {
          console.error(e);
        }
      };
      fetchReviews();
    }
  }, [product]);

  if (!product) {
    return <div className="text-center text-gray-500 py-10">Produk tidak ditemukan.</div>;
  }

  const allImages = product.images && product.images.length > 0
    ? product.images.map(img => img.url)
    : (product.imageUrl ? [product.imageUrl] : ['https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg']);

  const handleDecreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncreaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    setIsAdding(true);
    
    // Add selected variants to product object
    const productWithVariants = {
      ...product,
      cartItemId: `${product.id}-${selectedColor}-${selectedSize}`,
      selectedColor,
      selectedSize
    };
    
    addToCart(productWithVariants, quantity);
    
    // Reset state after a brief moment to show visual feedback
    setTimeout(() => {
      setIsAdding(false);
      // Optional: open a cart drawer or redirect to cart
      // router.push('/keranjang');
    }, 500);
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!session) {
      alert("Silakan login untuk memberikan ulasan.");
      return;
    }
    setIsSubmittingReview(true);
    try {
      const res = await fetch(`/api/products/${product.id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview)
      });
      if (res.ok) {
        const addedReview = await res.json();
        setReviews([addedReview, ...reviews]);
        setNewReview({ rating: 5, comment: '' });
        alert("Ulasan berhasil dikirim!");
      } else {
        alert("Gagal mengirim ulasan.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const currentPrice = product.price;
  const originalPrice = product.originalPrice;

  return (
    <main className="container mx-auto px-4 sm:px-6 py-12 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7 flex flex-col md:flex-row gap-4">
          
          {/* Thumbnails (Vertical) - Hidden on Mobile */}
          <div className="hidden md:flex flex-col gap-4 w-20 flex-shrink-0 sticky top-24 h-fit max-h-[80vh] overflow-y-auto scrollbar-hide">
            {allImages.map((img, index) => {
              const isVideo = img.match(/\.(mp4|webm)$/) || img.match(/\/video\/upload\//);
              return (
                <button
                  key={index}
                  onClick={() => {
                    const el = document.getElementById(`image-${index}`);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }}
                  className="relative w-full aspect-[3/4] overflow-hidden bg-gray-100"
                >
                  {isVideo ? (
                    <video src={img} className="w-full h-full object-cover" muted />
                  ) : (
                    <Image
                      src={img}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Main Stacked Images */}
          <div className="flex-1 flex flex-col gap-4">
            {allImages.map((img, index) => {
              const isVideo = img.match(/\.(mp4|webm)$/) || img.match(/\/video\/upload\//);
              return (
                <div key={index} id={`image-${index}`} className="relative w-full aspect-[3/4] bg-gray-50 overflow-hidden">
                  {isVideo ? (
                    <video
                      src={img}
                      className="w-full h-full object-cover"
                      controls
                      autoPlay
                      loop
                      muted
                    />
                  ) : (
                    <Image
                      src={img}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      priority={index === 0}
                      className="object-cover"
                    />
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Mobile Thumbnails (Horizontal) */}
          <div className="flex md:hidden gap-3 overflow-x-auto pb-2 scrollbar-hide">
             {allImages.map((img, index) => {
               const isVideo = img.match(/\.(mp4|webm)$/) || img.match(/\/video\/upload\//);
               return (
                 <button
                   key={index}
                   onClick={() => {
                     const el = document.getElementById(`image-${index}`);
                     if (el) el.scrollIntoView({ behavior: 'smooth' });
                   }}
                   className="relative min-w-[80px] w-20 aspect-[3/4] overflow-hidden bg-gray-100"
                 >
                   {isVideo ? (
                     <video src={img} className="w-full h-full object-cover" muted />
                   ) : (
                     <Image
                       src={img}
                       alt={`${product.name} ${index + 1}`}
                       fill
                       className="object-cover"
                     />
                   )}
                 </button>
               );
             })}
          </div>
        </div>

        {/* Right Column: Product Information (Sticky) */}
        <div className="lg:col-span-5 relative">
          <div className="sticky top-24 pt-4 lg:pt-0">
            
            {/* Title */}
            <h1 className="text-2xl md:text-[28px] font-sans tracking-[0.15em] text-gray-800 uppercase leading-snug mb-6">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-center gap-4 mb-8">
              <span className="text-xl font-sans tracking-widest text-[#d46a6a]">
                RP {currentPrice.toLocaleString('id-ID')}
              </span>
              {originalPrice && (
                <span className="text-lg font-sans tracking-widest text-gray-400 line-through">
                  RP {originalPrice.toLocaleString('id-ID')}
                </span>
              )}
            </div>

            {/* Warna Selector */}
            <div className="mb-6">
              <span className="block text-sm text-gray-600 mb-3">Warna:</span>
              <div className="flex flex-wrap gap-3">
                {dummyColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-6 py-2.5 text-sm font-sans transition-colors border ${
                      selectedColor === color 
                        ? 'border-gray-800 text-gray-800' 
                        : 'border-gray-200 text-gray-600 hover:border-gray-400'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="mb-6">
              <span className="block text-sm text-gray-600 mb-3">Size:</span>
              <div className="flex flex-wrap gap-3">
                {dummySizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-6 py-2.5 text-sm font-sans transition-colors border ${
                      selectedSize === size 
                        ? 'border-gray-800 text-gray-800' 
                        : 'border-gray-200 text-gray-600 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <span className="block text-sm text-gray-600 mb-3">Quantity:</span>
              <div className="flex items-center border border-gray-200 w-32 h-12">
                <button 
                  onClick={handleDecreaseQuantity}
                  className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                >
                  &minus;
                </button>
                <div className="flex-1 h-full flex items-center justify-center text-gray-800 font-sans">
                  {quantity}
                </div>
                <button 
                  onClick={handleIncreaseQuantity}
                  className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                >
                  &#43;
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="w-full bg-[#dca5ad] text-white py-4 text-sm font-sans tracking-[0.2em] uppercase hover:bg-[#c9929a] transition-colors mb-8 flex justify-center items-center"
            >
              {isAdding ? 'ADDING...' : 'ADD TO CART'}
            </button>

            {/* Description / Content */}
            <div className="prose prose-sm font-sans text-gray-600 font-light leading-relaxed">
              <p className="whitespace-pre-line">{product.description}</p>
              
              {product.material && (
                <p>
                  Bahan : {product.material}<br />
                </p>
              )}
            </div>

          </div>
        </div>

      </div>

      {/* Reviews Section */}
      <div className="mt-16 border-t border-gray-100 pt-12">
        <h2 className="text-2xl font-sans tracking-widest text-gray-800 uppercase mb-8">Ulasan Pembeli</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* List Reviews */}
          <div>
            {reviews.length === 0 ? (
              <p className="text-gray-500 font-light">Belum ada ulasan untuk produk ini.</p>
            ) : (
              <div className="space-y-6">
                {reviews.map((rev) => (
                  <div key={rev.id} className="border-b border-gray-100 pb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} className={i < rev.rating ? "fill-yellow-400" : "text-gray-300"} />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{rev.user.name}</span>
                      <span className="text-xs text-gray-400">{new Date(rev.createdAt).toLocaleDateString('id-ID')}</span>
                    </div>
                    {rev.comment && <p className="text-gray-600 text-sm">{rev.comment}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Write Review Form */}
          <div className="bg-gray-50 p-6 rounded-lg h-fit">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Tulis Ulasan</h3>
            {!session ? (
              <p className="text-sm text-gray-600 mb-4">Silakan login untuk memberikan ulasan produk ini.</p>
            ) : (
              <form onSubmit={submitReview}>
                <div className="mb-4">
                  <label className="block text-sm text-gray-600 mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button 
                        type="button" 
                        key={star} 
                        onClick={() => setNewReview({...newReview, rating: star})}
                        className="focus:outline-none"
                      >
                        <Star size={24} className={star <= newReview.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm text-gray-600 mb-2">Komentar (Opsional)</label>
                  <textarea 
                    value={newReview.comment}
                    onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                    rows="3" 
                    className="w-full border border-gray-200 rounded p-3 text-sm focus:outline-none focus:border-gray-400"
                    placeholder="Bagaimana kualitas produk ini?"
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  disabled={isSubmittingReview}
                  className="bg-gray-900 text-white px-6 py-2 text-sm uppercase tracking-wider hover:bg-gray-800 disabled:opacity-50"
                >
                  {isSubmittingReview ? 'MENGIRIM...' : 'KIRIM ULASAN'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

    </main>
  );
}