"use client";
import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product, quantity) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      // Ambil gambar pertama untuk ditampilkan di keranjang
      const imageUrl = product.images && product.images.length > 0 ? product.images[0].url : '/img/placeholder.png';
      return [...prevItems, { ...product, quantity, imageUrl }];
    });
    alert(`${quantity} x ${product.name} telah ditambahkan ke keranjang!`);
  };

  const value = { cartItems, addToCart };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  return useContext(CartContext);
};