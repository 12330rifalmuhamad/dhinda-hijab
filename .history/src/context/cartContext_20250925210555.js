// src/context/CartContext.js
"use client";

import React, { createContext, useState, useContext } from 'react';

// 1. Membuat Context
const CartContext = createContext();

// 2. Membuat "Provider" yang akan membungkus aplikasi kita
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product, quantity) => {
    setCartItems(prevItems => {
      // Cek apakah produk sudah ada di keranjang
      const existingItem = prevItems.find(item => item.id === product.id);

      if (existingItem) {
        // Jika sudah ada, update kuantitasnya
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Jika belum ada, tambahkan sebagai item baru
        return [...prevItems, { ...product, quantity }];
      }
    });
    // Beri notifikasi (bisa diganti dengan toast library nanti)
    alert(`${quantity} x ${product.name} telah ditambahkan ke keranjang!`);
  };

  // (Fungsi lain seperti removeFromCart, updateQuantity bisa ditambahkan di sini)

  const value = {
    cartItems,
    addToCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// 3. Membuat custom hook agar mudah digunakan di komponen lain
export const useCart = () => {
  return useContext(CartContext);
};