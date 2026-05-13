"use client";

import { useCart } from '@/context/cartContext';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart } = useCart();

  // Hitung subtotal
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 py-16 md:py-24 max-w-6xl min-h-screen font-sans text-gray-800">

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-normal text-center tracking-[0.2em] uppercase mb-16">
          Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 tracking-wide mb-8">Your cart is currently empty.</p>
            <Link href="/" className="inline-block bg-[#dca5ad] text-white px-8 py-3 text-sm tracking-[0.15em] uppercase hover:bg-[#c9929a] transition-colors">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="w-full">

            {/* Table Header (Hidden on Mobile) */}
            <div className="hidden md:flex justify-between items-end pb-4 border-b border-gray-200 text-xs tracking-[0.2em] text-gray-500 uppercase">
              <div className="w-1/2">Product</div>
              <div className="w-1/4 text-center">Quantity</div>
              <div className="w-1/4 text-right">Total</div>
            </div>

            {/* Cart Items */}
            <div className="divide-y divide-gray-200">
              {cartItems.map((item) => {
                const uniqueId = item.cartItemId || item.id;
                return (
                  <div key={uniqueId} className="flex flex-col md:flex-row items-start md:items-center py-8 gap-6 md:gap-0">

                    {/* Product Info */}
                    <div className="w-full md:w-1/2 flex items-start gap-6">
                      <div className="relative w-24 h-32 flex-shrink-0 bg-gray-50">
                        <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex flex-col pt-2">
                        <h3 className="text-sm font-medium tracking-wide uppercase mb-2">
                          {item.name}
                        </h3>
                        {(item.selectedColor || item.selectedSize) && (
                          <p className="text-xs text-gray-500 tracking-wider uppercase mb-2">
                            {item.selectedColor} {item.selectedColor && item.selectedSize && '/'} {item.selectedSize}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 tracking-wider">
                          RP {item.price.toLocaleString('id-ID')}
                        </p>
                      </div>
                    </div>

                    {/* Quantity Control */}
                    <div className="w-full md:w-1/4 flex flex-col items-start md:items-center">
                      <div className="flex items-center border border-gray-300 w-28 h-10 mb-3">
                        <button
                          onClick={() => updateQuantity(uniqueId, item.quantity - 1)}
                          className="flex-1 h-full flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors"
                        >
                          &minus;
                        </button>
                        <div className="flex-1 h-full flex items-center justify-center text-sm">
                          {item.quantity}
                        </div>
                        <button
                          onClick={() => updateQuantity(uniqueId, item.quantity + 1)}
                          className="flex-1 h-full flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors"
                        >
                          &#43;
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(uniqueId)}
                        className="text-[10px] tracking-[0.2em] text-gray-400 uppercase hover:text-gray-800 border-b border-gray-300 hover:border-gray-800 transition-all"
                      >
                        Remove
                      </button>
                    </div>

                    {/* Total Price */}
                    <div className="w-full md:w-1/4 text-left md:text-right">
                      <span className="text-sm tracking-widest text-gray-600">
                        RP {(item.price * item.quantity).toLocaleString('id-ID')}
                      </span>
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Bottom Section */}
            <div className="flex flex-col md:flex-row justify-between items-start pt-12 mt-4 border-t border-gray-200 gap-12">

              {/* Order Note */}
              <div className="w-full md:w-1/2 max-w-md">
                <label htmlFor="order-note" className="block text-[13px] text-gray-800 mb-4">
                  Add Order Note
                </label>
                <textarea
                  id="order-note"
                  rows="4"
                  placeholder="How can we help you?"
                  className="w-full border border-gray-200 p-4 text-sm font-light text-gray-500 focus:outline-none focus:border-gray-400 resize-none"
                ></textarea>
              </div>

              {/* Summary & Checkout */}
              <div className="w-full md:w-1/2 flex flex-col items-end text-right">
                <div className="text-sm tracking-[0.15em] mb-3">
                  <span className="text-gray-600 mr-2 uppercase">TOTAL:</span>
                  <span className="font-medium text-gray-800 uppercase">RP {subtotal.toLocaleString('id-ID')}</span>
                </div>

                <p className="text-xs text-gray-500 mb-8 font-light">
                  Shipping & taxes calculated at checkout
                </p>

                {/* Discount Code */}
                <div className="w-full max-w-[280px] mb-6">
                  <label htmlFor="discount" className="block text-[11px] tracking-[0.1em] text-gray-500 uppercase mb-2 text-right">
                    Discount Code
                  </label>
                  <input
                    type="text"
                    id="discount"
                    className="w-full border-2 border-gray-800 p-2 text-sm focus:outline-none"
                  />
                </div>

                {/* Checkout Button */}
                <Link
                  href="/checkout"
                  className="w-full max-w-[280px] bg-[#CD9B8A] text-white text-center py-4 text-xs tracking-[0.2em] font-medium uppercase hover:bg-[#b58778] transition-colors"
                >
                  Checkout
                </Link>
              </div>

            </div>

          </div>
        )}
      </main>
    </>
  );
}