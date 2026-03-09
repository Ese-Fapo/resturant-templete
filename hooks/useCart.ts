"use client";

import { useState, useCallback, useEffect, useRef } from "react";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;
};

export type CartState = {
  items: CartItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
};

const TAX_RATE = 0.1; // 10% tax
const DELIVERY_FEE = 5; // Fixed delivery fee

function getInitialCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  const savedCart = localStorage.getItem("cart");
  if (savedCart) {
    try {
      return JSON.parse(savedCart);
    } catch (e) {
      console.error("Failed to parse saved cart:", e);
      return [];
    }
  }
  return [];
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(getInitialCart);
  const isMountedRef = useRef(false);

  // Save to localStorage whenever items change
  useEffect(() => {
    if (isMountedRef.current) {
      localStorage.setItem("cart", JSON.stringify(items));
    }
  }, [items]);

  // Mark as mounted after first render
  useEffect(() => {
    isMountedRef.current = true;
  }, []);

  const addItem = useCallback((item: CartItem) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      if (existingItem) {
        return prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prevItems, item];
    });
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setItems((prevItems) => prevItems.filter((i) => i.id !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((i) => (i.id === itemId ? { ...i, quantity } : i))
    );
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  const total = Math.round((subtotal + tax + DELIVERY_FEE) * 100) / 100;

  const state: CartState = {
    items,
    subtotal: Math.round(subtotal * 100) / 100,
    tax,
    deliveryFee: DELIVERY_FEE,
    total,
  };

  return {
    ...state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isEmpty: items.length === 0,
    itemCount: items.length,
    itemQuantityTotal: items.reduce((sum, item) => sum + item.quantity, 0),
  };
}
