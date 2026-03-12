import React from 'react';
import { FiBookOpen, FiHeart, FiCoffee, FiTrendingUp } from 'react-icons/fi';

const BLOG_POSTS = [
  {
    id: 1,
    title: 'The 10 Best Sci-Fi Novels of the Decade',
    excerpt: 'From mind-bending explorations of AI consciousness to galaxy-spanning adventures, these science fiction masterpieces will keep you up all night.',
    category: 'Reading Guide',
    readTime: '6 min read',
    date: 'Mar 10, 2024',
    emoji: '🚀',
    color: 'from-indigo-900 to-purple-900',
  },
  {
    id: 2,
    title: 'Why Fantasy Literature Matters More Than Ever',
    excerpt: 'In a world saturated with information, fantasy novels offer something rare: the freedom to imagine entirely new worlds and the wisdom to understand our own.',
    category: 'Essay',
    readTime: '8 min read',
    date: 'Mar 8, 2024',
    emoji: '🐉',
    color: 'from-emerald-900 to-teal-900',
  },
  {
    id: 3,
    title: 'How to Build a Reading Habit That Sticks',
    excerpt: 'Science-backed strategies and practical techniques to make reading a consistent, joyful part of your daily routine — starting tonight.',
    category: 'Tips',
    readTime: '5 min read',
    date: 'Mar 5, 2024',
    emoji: '📖',
    color: 'from-amber-900 to-orange-900',
  },
  {
    id: 4,
    title: "Mystery Thrillers: A Beginner's Guide",
    excerpt: "Whether you're new to the genre or looking to expand your reading list, these gateway mysteries will hook you from the very first page.",
    category: 'Reading Guide',
    readTime: '7 min read',
    date: 'Mar 1, 2024',
    emoji: '🔍',
    color: 'from-slate-900 to-gray-900',
  },
  {
    id: 5,
    title: 'The Rise of AI in Storytelling',
    excerpt: "Can artificial intelligence write the next great novel? We explore what's happening at the intersection of machine learning and creative writing.",
    category: 'Technology',
    readTime: '10 min read',
    date: 'Feb 28, 2024',
    emoji: '🤖',
    color: 'from-blue-900 to-cyan-900',
  },
  {
    id: 6,
    title: "2024's Most Anticipated Book Releases",
    excerpt: "From debut literary fiction to long-awaited sequels, here are the books that every reader should have on their radar this year.",
    category: 'News',
    readTime: '4 min read',
    date: 'Feb 25, 2024',
    emoji: '📅',
    color: 'from-rose-900 to-pink-900',
  },
];

const STATS = [
  { icon: FiBookOpen, label: 'Articles Published', value: '120+' },
  { icon: FiHeart, label: 'Books Reviewed', value: '850+' },
  { icon: FiCoffee, label: 'Reading Guides', value: '45+' },
  { icon: FiTrendingUp, label: 'Monthly Readers', value: '15K+' },
];

export default function BlogPage() {
  const featured = BLOG_POSTS[0];
  const rest = BLOG_POSTS.slice(1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="section-title mb-3">BookAI <span className="gradient-text">Blog</span></h1>
        <p className="text-gray-400 max-w-xl mx-auto">Reading guides, book reviews, and deep dives into the stories that shape our world.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {STATS.map(({ icon: Icon, label, value }) => (
          <div key={label} className="glass rounded-2xl p-5 text-center">
            <Icon className="text-indigo-400 mx-auto mb-2" size={20} />
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-gray-400 text-sm">{label}</p>
          </div>
        ))}
      </div>

      {/* Featured post */}
      <div className={`rounded-3xl bg-gradient-to-br ${featured.color} p-8 md:p-12 mb-8 border border-white/10`}>
        <span className="badge bg-white/20 text-white mb-4">{featured.category} · Featured</span>
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="text-7xl">{featured.emoji}</div>
          <div>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-white mb-3">{featured.title}</h2>
            <p className="text-gray-200 leading-relaxed mb-4 max-w-2xl">{featured.excerpt}</p>
            <div className="flex items-center gap-4 text-sm text-gray-300">
              <span>{featured.date}</span>
              <span>·</span>
              <span>{featured.readTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Post grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {rest.map(post => (
          <article key={post.id} className="card cursor-pointer group">
            <div className={`h-32 bg-gradient-to-br ${post.color} flex items-center justify-center text-5xl`}>
              {post.emoji}
            </div>
            <div className="p-5">
              <span className="badge bg-indigo-950/80 text-indigo-300 border border-indigo-700/40 mb-3">{post.category}</span>
              <h3 className="font-serif text-lg font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors leading-snug">{post.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">{post.excerpt}</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{post.date}</span>
                <span>{post.readTime}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
