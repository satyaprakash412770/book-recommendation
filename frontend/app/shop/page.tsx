'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { FiSearch, FiFilter, FiZap } from 'react-icons/fi';
import { api, Book } from '@/lib/api';
import BookCard from '@/components/BookCard';

const GENRES = ['All', 'Fiction', 'Science Fiction', 'Fantasy', 'Mystery', 'Thriller', 'Romance', 'History', 'Biography', 'Self Help', 'Technology', 'Philosophy', 'Science', 'Children'];
const SORT_OPTIONS = [
  { label: 'Relevance', value: '' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Rating', value: 'rating' },
];

function ShopContent() {
  const searchParams = useSearchParams();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [inputVal, setInputVal] = useState(searchParams.get('q') || '');
  const [genre, setGenre] = useState('All');
  const [sort, setSort] = useState('');
  const [isAI, setIsAI] = useState(false);
  const [aiMode, setAiMode] = useState(false);

  const fetchBooks = async (q: string, g: string, ai: boolean) => {
    setLoading(true);
    try {
      let data;
      const genreParam = g === 'All' ? undefined : g;
      if (ai && q) {
        data = await api.recommend(q, 20, genreParam);
        setAiMode(true);
      } else {
        const searchQ = q || (g !== 'All' ? g : 'bestseller books');
        data = await api.search(searchQ, genreParam, 24);
        setAiMode(false);
      }
      setBooks(data.books);
    } catch { /* empty */ } finally { setLoading(false); }
  };

  useEffect(() => { fetchBooks(query, genre, isAI); }, [genre]);
  useEffect(() => {
    const q = searchParams.get('q') || '';
    setQuery(q); setInputVal(q);
    if (q) fetchBooks(q, genre, false);
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(inputVal);
    fetchBooks(inputVal, genre, isAI);
  };

  const sorted = [...books].sort((a, b) => {
    if (sort === 'price_asc') return (a.price ?? 0) - (b.price ?? 0);
    if (sort === 'price_desc') return (b.price ?? 0) - (a.price ?? 0);
    if (sort === 'rating') return (b.rating ?? 0) - (a.rating ?? 0);
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="section-title mb-2">Book Shop</h1>
        <p className="text-gray-400">Discover your next great read from millions of titles</p>
      </div>

      {/* Controls */}
      <div className="glass rounded-2xl p-4 mb-8 flex flex-col sm:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex-1 flex items-center gap-2">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
            <input type="text" value={inputVal} onChange={e => setInputVal(e.target.value)}
              placeholder="Search books, authors..." className="input pl-9 py-2.5 text-sm" />
          </div>
          <button type="button" onClick={() => setIsAI(!isAI)}
            className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all border ${isAI ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'}`}>
            <FiZap size={12} /> AI
          </button>
          <button type="submit" className="btn-primary py-2.5 px-4 text-sm">Search</button>
        </form>
        <div className="flex items-center gap-2">
          <FiFilter className="text-gray-400" size={15} />
          <select value={sort} onChange={e => setSort(e.target.value)}
            className="input py-2.5 text-sm bg-gray-800 cursor-pointer">
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <aside className="hidden lg:block w-52 shrink-0">
          <div className="glass rounded-2xl p-4 sticky top-20">
            <h3 className="text-sm font-semibold text-white mb-3">Genres</h3>
            <ul className="space-y-1">
              {GENRES.map(g => (
                <li key={g}>
                  <button onClick={() => setGenre(g)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${genre === g ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                    {g}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Grid */}
        <div className="flex-1">
          {aiMode && (
            <div className="flex items-center gap-2 mb-4 text-sm text-indigo-400">
              <FiZap size={14} /> AI-ranked results for &ldquo;{query}&rdquo;
            </div>
          )}
          {/* Mobile genre pills */}
          <div className="lg:hidden flex gap-2 overflow-x-auto pb-2 mb-4">
            {GENRES.map(g => (
              <button key={g} onClick={() => setGenre(g)}
                className={`tag shrink-0 ${genre === g ? '!bg-indigo-600 !text-white border-indigo-500' : ''}`}>{g}</button>
            ))}
          </div>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array(12).fill(0).map((_, i) => <div key={i} className="aspect-[3/4] skeleton rounded-2xl" />)}
            </div>
          ) : sorted.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <span className="text-5xl">📚</span>
              <p className="mt-4">No books found. Try a different search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {sorted.map(book => <BookCard key={book.google_id} book={book} showScore={aiMode} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-40"><div className="w-12 h-12 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" /></div>}>
      <ShopContent />
    </Suspense>
  );
}
