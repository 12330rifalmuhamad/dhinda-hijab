"use client";
import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('dhinda-cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever cartItems change
  useEffect(() => {
    localStorage.setItem('dhinda-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setIsLoading(true);
    
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        const updatedItems = prevItems.map(item =>
          item.id === product.id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
        return updatedItems;
      }
      
      const imageUrl = product.images && product.images.length > 0 
        ? product.images[0].url 
        : '/img/product-1.png';
      
      return [...prevItems, { 
        ...product, 
        quantity, 
        imageUrl,
        addedAt: new Date().toISOString()
      }];
    });

    // Show success message
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const value = { 
    cartItems, 
    addToCart, 
    removeFromCart, 
    updateQuantity, 
    clearCart,
    getTotalItems,
    getTotalPrice,
    isLoading
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};