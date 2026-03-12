'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Book } from '@/lib/api';

export interface CartItem {
  book_id: string;
  title: string;
  authors: string;
  thumbnail?: string;
  price: number;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  count: number;
  total: number;
  addItem: (book: Book) => void;
  removeItem: (book_id: string) => void;
  updateQty: (book_id: string, qty: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType>({} as CartContextType);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('cart');
    if (saved) setItems(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem = (book: Book) => {
    setItems(prev => {
      const existing = prev.find(i => i.book_id === book.google_id);
      if (existing) return prev.map(i => i.book_id === book.google_id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, {
        book_id: book.google_id,
        title: book.title,
        authors: book.authors,
        thumbnail: book.thumbnail,
        price: book.price ?? 14.99,
        quantity: 1,
      }];
    });
  };

  const removeItem = (book_id: string) =>
    setItems(prev => prev.filter(i => i.book_id !== book_id));

  const updateQty = (book_id: string, qty: number) => {
    if (qty <= 0) return removeItem(book_id);
    setItems(prev => prev.map(i => i.book_id === book_id ? { ...i, quantity: qty } : i));
  };

  const clearCart = () => setItems([]);

  const count = items.reduce((s, i) => s + i.quantity, 0);
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, count, total, addItem, removeItem, updateQty, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
