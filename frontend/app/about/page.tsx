import React from 'react';
import { FiCpu, FiZap, FiSearch, FiDatabase, FiCode, FiLayers } from 'react-icons/fi';

const TECH_STACK = [
  { icon: FiCode, label: 'Next.js 14', desc: 'App Router, Server Components, TypeScript' },
  { icon: FiZap, label: 'FastAPI', desc: 'Async Python backend with automatic docs' },
  { icon: FiDatabase, label: 'MongoDB Atlas', desc: 'Cloud database for users, orders, reviews' },
  { icon: FiCpu, label: 'Sentence Transformers', desc: 'all-mpnet-base-v2 for semantic embeddings' },
  { icon: FiSearch, label: 'Google Books API', desc: 'Access to 1M+ books with rich metadata' },
  { icon: FiLayers, label: 'Tailwind CSS', desc: 'Responsive, dark-mode first design system' },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'You describe it', desc: 'Type what kind of book you\'re in the mood for in plain language — no need for exact titles or authors.' },
  { step: '02', title: 'AI encodes meaning', desc: 'Our sentence-transformer model converts your description into a 768-dimensional semantic vector.' },
  { step: '03', title: 'Books are fetched', desc: 'Google Books API returns a pool of candidate books matching your broad topic.' },
  { step: '04', title: 'Semantic ranking', desc: 'Cosine similarity scores rank the candidates by how well their descriptions match your intent.' },
  { step: '05', title: 'You discover', desc: 'The top matches are returned with similarity scores, so you know exactly why each book was recommended.' },
];

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="font-serif text-4xl md:text-6xl font-bold text-white mb-4">
          Why <span className="gradient-text">BookAI</span>?
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
          Traditional search finds books by matching keywords. We match by <em className="text-white not-italic font-semibold">meaning</em>.
          Describe what you want in any way you like, and our AI understands your intent.
        </p>
      </div>

      {/* How it works */}
      <section className="mb-16">
        <h2 className="section-title mb-8 text-center">How Semantic Search Works</h2>
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-600 to-purple-600 hidden md:block" />
          <div className="space-y-6">
            {HOW_IT_WORKS.map(({ step, title, desc }) => (
              <div key={step} className="flex gap-6 items-start">
                <div className="shrink-0 w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-700/40 flex items-center justify-center">
                  <span className="text-indigo-400 font-bold text-lg">{step}</span>
                </div>
                <div className="glass rounded-2xl p-5 flex-1">
                  <h3 className="font-semibold text-white mb-1">{title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* vs keyword search */}
      <section className="mb-16">
        <h2 className="section-title mb-6 text-center">Semantic vs. Keyword Search</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass rounded-2xl p-6 border border-red-800/30">
            <h3 className="font-semibold text-red-400 mb-3">❌ Keyword Search</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>• Matches exact words only</li>
              <li>• &quot;space exploration&quot; misses books about &quot;interstellar travel&quot;</li>
              <li>• Requires knowing what to search for</li>
              <li>• Returns high quantity, low relevance</li>
            </ul>
          </div>
          <div className="glass rounded-2xl p-6 border border-indigo-700/40">
            <h3 className="font-semibold text-indigo-400 mb-3">✅ Semantic Search (BookAI)</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>• Understands meaning and context</li>
              <li>• &quot;lonely astronaut&quot; finds &quot;The Martian&quot; automatically</li>
              <li>• Works with vague, descriptive queries</li>
              <li>• Returns fewer, highly relevant results</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Tech stack */}
      <section className="mb-16">
        <h2 className="section-title mb-6 text-center">Technology Stack</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TECH_STACK.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="glass rounded-2xl p-5 hover:border-indigo-500/40 transition-all">
              <Icon className="text-indigo-400 mb-3" size={22} />
              <h3 className="font-semibold text-white mb-1">{label}</h3>
              <p className="text-gray-400 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="glass rounded-3xl p-10 text-center border border-indigo-700/40">
        <h2 className="font-serif text-2xl font-bold text-white mb-3">Ready to discover your next favourite book?</h2>
        <p className="text-gray-400 mb-6">Join thousands of readers using AI to find exactly what they want to read.</p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <a href="/shop" className="btn-primary">Browse Books</a>
          <a href="/auth/signup" className="btn-secondary">Create Account</a>
        </div>
      </div>
    </div>
  );
}
