'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FiShoppingCart, FiHeart, FiArrowLeft, FiExternalLink, FiStar } from 'react-icons/fi';
import { api, Book, Review } from '@/lib/api';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import BookCard from '@/components/BookCard';
import { StarRating } from '@/components/BookCard';

export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = params.id as string;
  const { addItem } = useCart();
  const { user } = useAuth();

  const [book, setBook] = useState<Book | null>(null);
  const [similar, setSimilar] = useState<Book[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    if (!bookId) return;
    setLoading(true);
    Promise.all([
      api.getBook(bookId),
      api.getReviews(bookId),
    ]).then(([bookData, reviewData]) => {
      setBook(bookData);
      setReviews(reviewData.reviews);
      // Fetch similar books
      if (bookData.title) {
        api.recommend(`${bookData.title} ${bookData.genre ?? ''}`, 6).then(d => setSimilar(d.books.filter(b => b.google_id !== bookId)));
      }
    }).catch(() => router.push('/shop'))
      .finally(() => setLoading(false));
  }, [bookId]);

  const handleAddToCart = () => {
    if (!book) return;
    for (let i = 0; i < qty; i++) addItem(book);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleWishlist = async () => {
    if (!user || !book) return;
    if (wishlisted) {
      await api.removeFromWishlist(book.google_id);
    } else {
      await api.addToWishlist({ book_id: book.google_id, title: book.title, authors: book.authors, thumbnail: book.thumbnail, price: book.price ?? 14.99 });
    }
    setWishlisted(!wishlisted);
  };

  const handleReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !book) return;
    setSubmitting(true);
    try {
      await api.addReview(book.google_id, reviewRating, reviewComment);
      const d = await api.getReviews(book.google_id);
      setReviews(d.reviews);
      setReviewComment('');
    } catch { /* empty */ } finally { setSubmitting(false); }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-[300px_1fr] gap-10 animate-pulse">
          <div className="aspect-[3/4] skeleton rounded-2xl" />
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => <div key={i} className="skeleton h-6 rounded-lg" style={{ width: `${80 - i * 10}%` }} />)}
          </div>
        </div>
      </div>
    );
  }

  if (!book) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-8 transition-colors">
        <FiArrowLeft size={16} /> Back
      </button>

      {/* Main detail section */}
      <div className="grid md:grid-cols-[280px_1fr] gap-12 mb-16">
        {/* Cover */}
        <div className="flex flex-col gap-4">
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-800 shadow-2xl shadow-black/50">
            {book.thumbnail ? (
              <Image src={book.thumbnail} alt={book.title} fill className="object-cover" unoptimized />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-900/60 to-purple-900/60 text-7xl">📚</div>
            )}
          </div>
          {/* Buy section on mobile */}
          <div className="md:hidden space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-white">${book.price?.toFixed(2) ?? '14.99'}</span>
              <div className="flex items-center gap-2">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-8 h-8 rounded-lg glass text-white flex items-center justify-center">-</button>
                <span className="text-white font-semibold w-6 text-center">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="w-8 h-8 rounded-lg glass text-white flex items-center justify-center">+</button>
              </div>
            </div>
            <button onClick={handleAddToCart} className={`btn-primary w-full justify-center ${addedToCart ? 'bg-green-600 hover:bg-green-500' : ''}`}>
              <FiShoppingCart size={16} /> {addedToCart ? 'Added!' : 'Add to Cart'}
            </button>
          </div>
        </div>

        {/* Info */}
        <div>
          {book.genre && <span className="badge bg-indigo-950/80 text-indigo-300 border border-indigo-700/40 mb-3">{book.genre}</span>}
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-white mb-2 leading-tight">{book.title}</h1>
          <p className="text-lg text-gray-400 mb-4">by {book.authors}</p>

          <div className="flex items-center gap-3 mb-6">
            <StarRating rating={book.rating ?? 4} />
            <span className="text-gray-400 text-sm">({book.rating?.toFixed(1) ?? '4.0'}) · {book.pages ? `${book.pages} pages` : ''} {book.published_date ? `· Published ${book.published_date}` : ''}</span>
          </div>

          {book.description && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-white mb-3">About this book</h2>
              <p className="text-gray-400 leading-relaxed">{book.description}</p>
            </div>
          )}

          {/* Book metadata */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            {[
              ['Publisher', book.publisher], ['Published', book.published_date], ['Pages', book.pages?.toString()], ['Genre', book.genre]
            ].filter(([, v]) => v).map(([label, value]) => (
              <div key={label} className="glass rounded-xl p-3">
                <p className="text-xs text-gray-500 mb-1">{label}</p>
                <p className="text-sm font-medium text-white">{value}</p>
              </div>
            ))}
          </div>

          {/* Desktop Buy section */}
          <div className="hidden md:block">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-3xl font-bold text-white">${book.price?.toFixed(2) ?? '14.99'}</span>
              <div className="flex items-center gap-2">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-8 h-8 rounded-lg glass text-white flex items-center justify-center hover:bg-white/10 transition-all">-</button>
                <span className="text-white font-semibold w-6 text-center">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="w-8 h-8 rounded-lg glass text-white flex items-center justify-center hover:bg-white/10 transition-all">+</button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={handleAddToCart} className={`btn-primary flex-1 justify-center ${addedToCart ? '!bg-green-600 hover:!bg-green-500' : ''}`}>
                <FiShoppingCart size={16} /> {addedToCart ? 'Added to Cart!' : 'Add to Cart'}
              </button>
              <button onClick={handleWishlist}
                className={`p-3 rounded-xl border transition-all ${wishlisted ? 'bg-pink-600/20 border-pink-500/40 text-pink-400' : 'glass text-gray-400 hover:text-pink-400 border-white/10'}`}>
                <FiHeart size={18} fill={wishlisted ? 'currentColor' : 'none'} />
              </button>
              {book.link && (
                <a href={book.link} target="_blank" rel="noopener noreferrer"
                  className="p-3 rounded-xl glass text-gray-400 hover:text-indigo-400 transition-all border border-white/10">
                  <FiExternalLink size={18} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Similar Books */}
      {similar.length > 0 && (
        <section className="mb-16">
          <h2 className="section-title mb-6">Similar Books</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {similar.map(b => <BookCard key={b.google_id} book={b} showScore />)}
          </div>
        </section>
      )}

      {/* Reviews */}
      <section>
        <h2 className="section-title mb-6">Reviews</h2>
        {user && (
          <form onSubmit={handleReview} className="glass rounded-2xl p-6 mb-8">
            <h3 className="text-white font-semibold mb-4">Write a Review</h3>
            <div className="flex items-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map(s => (
                <button key={s} type="button" onClick={() => setReviewRating(s)}
                  className={`text-2xl transition-all ${s <= reviewRating ? 'text-amber-400' : 'text-gray-600 hover:text-amber-300'}`}>★</button>
              ))}
              <span className="text-gray-400 text-sm ml-2">{reviewRating}/5</span>
            </div>
            <textarea value={reviewComment} onChange={e => setReviewComment(e.target.value)}
              placeholder="Share your thoughts about this book..."
              className="input mb-4 resize-none" rows={4} required />
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        )}
        {reviews.length === 0 ? (
          <div className="text-center py-10 text-gray-500">No reviews yet. Be the first to review!</div>
        ) : (
          <div className="space-y-4">
            {reviews.map(r => (
              <div key={r.id} className="glass rounded-2xl p-6">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-white">{r.user_name}</p>
                    <p className="text-xs text-gray-500">{new Date(r.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(s => (
                      <FiStar key={s} size={14} className={s <= r.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-600'} />
                    ))}
                  </div>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">{r.comment}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
