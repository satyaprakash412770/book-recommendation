'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiSearch, FiArrowRight, FiZap, FiCpu, FiBook } from 'react-icons/fi';
import { api, Book } from '@/lib/api';
import BookCard from '@/components/BookCard';

const CATEGORIES = ['Fiction', 'Science Fiction', 'Fantasy', 'Mystery', 'Thriller', 'Romance', 'History', 'Biography', 'Self Help', 'Technology'];

function HeroSection({ onSearch }: { onSearch: (q: string) => void }) {
  const [query, setQuery] = useState('');
  const [isAI, setIsAI] = useState(true);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    if (isAI) {
      onSearch(query);
    } else {
      router.push(`/shop?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <section className="relative overflow-hidden py-20 lg:py-32">
      {/* Background blobs */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-700/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-700/20 rounded-full blur-3xl" />
      </div>
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 badge bg-indigo-950/80 text-indigo-300 border border-indigo-700/50 mb-6">
          <FiCpu size={13} /> AI-Powered Book Discovery
        </div>
        <h1 className="font-serif text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Find Your Next <br />
          <span className="gradient-text">Favourite Book</span>
        </h1>
        <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          Describe what you want to read in plain English. Our AI understands meaning, not just keywords—
          and surfaces books you'll actually love.
        </p>

        {/* Search bar */}
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          <div className="glass rounded-2xl p-2 flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={isAI ? "e.g. A thrilling space adventure with complex characters..." : "Search by title or author..."}
                className="w-full pl-11 pr-4 py-3.5 bg-transparent text-white placeholder-gray-500 outline-none text-sm"
              />
            </div>
            <div className="flex items-center gap-2 px-2">
              <button type="button" onClick={() => setIsAI(!isAI)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${isAI ? 'bg-indigo-600 text-white' : 'bg-white/10 text-gray-400'}`}>
                <FiZap size={12} /> AI
              </button>
              <button type="submit" className="btn-primary py-2.5 px-5 text-sm">
                Search <FiArrowRight size={14} />
              </button>
            </div>
          </div>
        </form>

        <p className="mt-4 text-gray-600 text-sm">
          Try: &quot;sci-fi about AI and consciousness&quot; · &quot;cozy mystery in a small town&quot; · &quot;epic fantasy with magic systems&quot;
        </p>
      </div>
    </section>
  );
}

export default function HomePage() {
  const [featured, setFeatured] = useState<Book[]>([]);
  const [aiResults, setAiResults] = useState<Book[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiQuery, setAiQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('');
  const [catBooks, setCatBooks] = useState<Book[]>([]);
  const [catLoading, setCatLoading] = useState(false);

  useEffect(() => {
    api.getFeaturedBooks().then(d => {
      setFeatured(d.books.slice(0, 8));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleAISearch = async (query: string) => {
    setAiLoading(true);
    setAiQuery(query);
    setAiResults([]);
    try {
      const data = await api.recommend(query, 6);
      setAiResults(data.books);
    } catch { /* empty */ } finally {
      setAiLoading(false);
    }
  };

  const handleCategory = async (cat: string) => {
    if (activeCategory === cat) { setActiveCategory(''); setCatBooks([]); return; }
    setActiveCategory(cat);
    setCatLoading(true);
    try {
      const data = await api.getBooks({ q: cat, genre: cat, max_results: 8 });
      setCatBooks(data.books.slice(0, 8));
    } catch { /* empty */ } finally { setCatLoading(false); }
  };

  return (
    <div>
      <HeroSection onSearch={handleAISearch} />

      {/* AI Results */}
      {(aiLoading || aiResults.length > 0) && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 flex items-center justify-center">
              <FiCpu className="text-indigo-400" size={16} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">AI Recommendations</h2>
              <p className="text-sm text-gray-400">For &ldquo;{aiQuery}&rdquo;</p>
            </div>
          </div>
          {aiLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {Array(6).fill(0).map((_, i) => <div key={i} className="aspect-[3/4] skeleton rounded-2xl" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {aiResults.map(book => <BookCard key={book.google_id} book={book} showScore />)}
            </div>
          )}
        </section>
      )}

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="section-title mb-6">Browse Categories</h2>
        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => handleCategory(cat)}
              className={`tag transition-all ${activeCategory === cat ? '!bg-indigo-600 !text-white border-indigo-500' : ''}`}>
              {cat}
            </button>
          ))}
        </div>
        {catLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {Array(8).fill(0).map((_, i) => <div key={i} className="aspect-[3/4] skeleton rounded-2xl" />)}
          </div>
        )}
        {catBooks.length > 0 && !catLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {catBooks.map(book => <BookCard key={book.google_id} book={book} />)}
          </div>
        )}
      </section>

      {/* Featured Books */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="section-title">Featured Books</h2>
          <Link href="/shop" className="text-indigo-400 hover:text-indigo-300 text-sm font-medium flex items-center gap-1">
            View all <FiArrowRight size={14} />
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array(8).fill(0).map((_, i) => <div key={i} className="aspect-[3/4] skeleton rounded-2xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {featured.map(book => <BookCard key={book.google_id} book={book} />)}
          </div>
        )}
      </section>

      {/* Feature strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="glass rounded-3xl p-8 md:p-12 grid md:grid-cols-3 gap-8">
          {[
            { icon: FiCpu, title: 'Semantic AI Search', desc: 'Our AI understands the meaning behind your words, not just keywords.' },
            { icon: FiBook, title: '1M+ Books', desc: 'Powered by Google Books API with millions of titles across all genres.' },
            { icon: FiZap, title: 'Instant Recs', desc: 'Get personalised recommendations in seconds based on your taste.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 flex items-center justify-center mx-auto mb-4">
                <Icon className="text-indigo-400" size={22} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
