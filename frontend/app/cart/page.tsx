'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiTrash2, FiMinus, FiPlus, FiShoppingCart, FiArrowRight } from 'react-icons/fi';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { items, count, total, removeItem, updateQty, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="text-8xl mb-6">🛒</div>
        <h1 className="font-serif text-3xl font-bold text-white mb-3">Your cart is empty</h1>
        <p className="text-gray-400 mb-8">Looks like you haven&apos;t added any books yet.</p>
        <Link href="/shop" className="btn-primary">Browse Books <FiArrowRight size={16} /></Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="section-title">Shopping Cart <span className="text-gray-500 text-2xl font-sans font-normal">({count} {count === 1 ? 'item' : 'items'})</span></h1>
        <button onClick={clearCart} className="text-sm text-gray-500 hover:text-red-400 transition-colors">Clear all</button>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-8">
        {/* Items */}
        <div className="space-y-4">
          {items.map(item => (
            <div key={item.book_id} className="glass rounded-2xl p-4 flex gap-4">
              <div className="w-16 h-20 rounded-xl overflow-hidden bg-gray-800 shrink-0">
                {item.thumbnail ? (
                  <Image src={item.thumbnail} alt={item.title} width={64} height={80} className="object-cover w-full h-full" unoptimized />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">📚</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`/books/${item.book_id}`}>
                  <h3 className="text-white font-semibold text-sm hover:text-indigo-400 transition-colors line-clamp-2">{item.title}</h3>
                </Link>
                <p className="text-gray-400 text-xs mb-3">{item.authors}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQty(item.book_id, item.quantity - 1)}
                      className="w-7 h-7 rounded-lg glass text-gray-400 hover:text-white flex items-center justify-center transition-all">
                      <FiMinus size={12} />
                    </button>
                    <span className="text-white font-semibold text-sm w-6 text-center">{item.quantity}</span>
                    <button onClick={() => updateQty(item.book_id, item.quantity + 1)}
                      className="w-7 h-7 rounded-lg glass text-gray-400 hover:text-white flex items-center justify-center transition-all">
                      <FiPlus size={12} />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-white font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                    <button onClick={() => removeItem(item.book_id)} className="text-gray-500 hover:text-red-400 transition-colors">
                      <FiTrash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="glass rounded-2xl p-6 h-fit sticky top-20">
          <h2 className="font-semibold text-white text-lg mb-4">Order Summary</h2>
          <div className="space-y-2 mb-4">
            {items.map(item => (
              <div key={item.book_id} className="flex justify-between text-sm">
                <span className="text-gray-400 truncate flex-1 mr-2">{item.title} × {item.quantity}</span>
                <span className="text-gray-300 shrink-0">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 pt-4 mb-6">
            <div className="flex justify-between text-sm text-gray-400 mb-1">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-400 mb-1">
              <span>Shipping</span>
              <span className="text-green-400">Free</span>
            </div>
            <div className="flex justify-between font-bold text-white text-lg mt-3">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          <Link href="/checkout" className="btn-primary w-full justify-center">
            Checkout <FiArrowRight size={16} />
          </Link>
          <Link href="/shop" className="block text-center text-gray-400 hover:text-white text-sm mt-3 transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
