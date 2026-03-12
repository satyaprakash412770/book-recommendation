'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiShoppingCart, FiHeart, FiExternalLink } from 'react-icons/fi';
import { Book } from '@/lib/api';
import { useCart } from '@/context/CartContext';

interface Props {
  book: Book;
  showScore?: boolean;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <svg key={s} className={`w-3 h-3 ${s <= Math.round(rating) ? 'text-amber-400' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export { StarRating };

export default function BookCard({ book, showScore }: Props) {
  const { addItem } = useCart();

  return (
    <div className="card group flex flex-col">
      {/* Cover */}
      <Link href={`/books/${book.google_id}`} className="relative block w-full aspect-[3/4] overflow-hidden bg-gray-800">
        {book.thumbnail ? (
          <Image
            src={book.thumbnail}
            alt={book.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-900/60 to-purple-900/60">
            <span className="text-5xl">📚</span>
          </div>
        )}
        {showScore && book.score !== undefined && (
          <div className="absolute top-2 right-2 bg-indigo-600/90 backdrop-blur text-white text-xs px-2 py-1 rounded-lg font-semibold">
            {Math.round(book.score * 100)}% match
          </div>
        )}
        {book.genre && (
          <div className="absolute top-2 left-2 badge bg-black/60 text-gray-200">{book.genre}</div>
        )}
      </Link>

      {/* Info */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <Link href={`/books/${book.google_id}`}>
          <h3 className="text-sm font-semibold text-white line-clamp-2 hover:text-indigo-400 transition-colors leading-snug">{book.title}</h3>
        </Link>
        <p className="text-xs text-gray-400 truncate">{book.authors}</p>
        <div className="flex items-center gap-2">
          <StarRating rating={book.rating ?? 4} />
          <span className="text-xs text-gray-500">({book.rating?.toFixed(1) ?? '4.0'})</span>
        </div>
        <div className="flex items-center justify-between mt-auto pt-2">
          <span className="text-lg font-bold text-white">${book.price?.toFixed(2) ?? '14.99'}</span>
          <div className="flex items-center gap-1">
            {book.link && (
              <a href={book.link} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg text-gray-500 hover:text-indigo-400 hover:bg-indigo-950/50 transition-all">
                <FiExternalLink size={14} />
              </a>
            )}
            <button
              onClick={() => addItem(book)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-all"
            >
              <FiShoppingCart size={12} /> Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
