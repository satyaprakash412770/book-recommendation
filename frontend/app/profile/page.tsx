'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FiUser, FiLogOut, FiShoppingBag, FiHeart, FiClock, FiBookOpen } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import { api, Order, WishlistItem, Book } from '@/lib/api';

type Tab = 'overview' | 'orders' | 'wishlist' | 'history';

export default function ProfilePage() {
  const { user, logout, loading: authLoading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('overview');
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [recs, setRecs] = useState<Book[]>([]);
  const [dataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.push('/auth/login');
  }, [user, authLoading]);

  useEffect(() => {
    if (!user) return;
    setDataLoading(true);
    Promise.all([
      api.getOrders(),
      api.getWishlist(),
      api.recommend('bestseller fiction mystery', 6),
    ]).then(([o, w, r]) => {
      setOrders(o.orders);
      setWishlist(w.wishlist);
      setRecs(r.books);
    }).catch(() => {}).finally(() => setDataLoading(false));
  }, [user]);

  if (authLoading || !user) {
    return <div className="flex items-center justify-center min-h-[60vh]"><div className="w-10 h-10 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" /></div>;
  }

  const handleLogout = () => { logout(); router.push('/'); };
  const removeWish = async (book_id: string) => {
    await api.removeFromWishlist(book_id);
    setWishlist(prev => prev.filter(w => w.book_id !== book_id));
  };

  const TABS: { id: Tab; icon: typeof FiUser; label: string }[] = [
    { id: 'overview', icon: FiUser, label: 'Overview' },
    { id: 'orders', icon: FiShoppingBag, label: `Orders (${orders.length})` },
    { id: 'wishlist', icon: FiHeart, label: `Wishlist (${wishlist.length})` },
    { id: 'history', icon: FiClock, label: 'Recommendations' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Profile header */}
      <div className="glass rounded-3xl p-6 mb-8 flex flex-col sm:flex-row items-center sm:items-start gap-5">
        <div className="w-20 h-20 rounded-2xl bg-indigo-600 flex items-center justify-center text-3xl font-bold text-white shrink-0">
          {user.name[0].toUpperCase()}
        </div>
        <div className="text-center sm:text-left flex-1">
          <h1 className="font-serif text-2xl font-bold text-white">{user.name}</h1>
          <p className="text-gray-400">{user.email}</p>
          <p className="text-gray-600 text-sm mt-1">Member since {new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</p>
        </div>
        <button onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-red-400 border border-red-800/40 hover:bg-red-950/30 text-sm font-medium transition-all">
          <FiLogOut size={14} /> Sign out
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Orders', value: orders.length, icon: FiShoppingBag },
          { label: 'Wishlist', value: wishlist.length, icon: FiHeart },
          { label: 'Recs for you', value: recs.length, icon: FiBookOpen },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="glass rounded-2xl p-4 text-center">
            <Icon className="text-indigo-400 mx-auto mb-1" size={18} />
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-gray-400 text-xs">{label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 glass rounded-xl p-1 mb-6 overflow-x-auto">
        {TABS.map(({ id, icon: Icon, label }) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${tab === id ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}>
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {dataLoading ? (
        <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <>
          {/* Overview */}
          {tab === 'overview' && (
            <div className="glass rounded-2xl p-6 text-center">
              <p className="text-gray-400 mb-4">Welcome back, <span className="text-white font-semibold">{user.name.split(' ')[0]}</span>! Here&apos;s a quick look at your account.</p>
              <div className="grid sm:grid-cols-2 gap-4 text-left">
                <Link href="/shop" className="glass rounded-xl p-4 hover:border-indigo-500/40 transition-all flex items-center gap-3">
                  <FiBookOpen className="text-indigo-400" size={20} />
                  <div><p className="text-white font-medium text-sm">Browse Books</p><p className="text-gray-400 text-xs">Discover new reads</p></div>
                </Link>
                <Link href="/cart" className="glass rounded-xl p-4 hover:border-indigo-500/40 transition-all flex items-center gap-3">
                  <FiShoppingBag className="text-indigo-400" size={20} />
                  <div><p className="text-white font-medium text-sm">View Cart</p><p className="text-gray-400 text-xs">Complete your order</p></div>
                </Link>
              </div>
            </div>
          )}

          {/* Orders */}
          {tab === 'orders' && (
            orders.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <FiShoppingBag size={40} className="mx-auto mb-3 opacity-40" />
                <p>No orders yet. <Link href="/shop" className="text-indigo-400">Start shopping!</Link></p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map(o => (
                  <div key={o.id} className="glass rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-white font-medium text-sm">Order #{o.id.slice(-8).toUpperCase()}</p>
                        <p className="text-gray-400 text-xs">{new Date(o.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <span className="badge bg-green-950/60 text-green-400 border border-green-800/40">{o.status}</span>
                        <p className="text-white font-bold mt-1">${o.total.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      {o.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm text-gray-400">
                          <span className="truncate flex-1">{item.title} × {item.quantity}</span>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {/* Wishlist */}
          {tab === 'wishlist' && (
            wishlist.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <FiHeart size={40} className="mx-auto mb-3 opacity-40" />
                <p>Your wishlist is empty. <Link href="/shop" className="text-indigo-400">Browse books!</Link></p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {wishlist.map(w => (
                  <div key={w.book_id} className="glass rounded-2xl p-4 flex gap-3">
                    <div className="w-12 h-16 rounded-lg overflow-hidden bg-gray-800 shrink-0">
                      {w.thumbnail ? <Image src={w.thumbnail} alt={w.title} width={48} height={64} className="object-cover w-full h-full" unoptimized /> : <div className="w-full h-full flex items-center justify-center text-xl">📚</div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{w.title}</p>
                      <p className="text-gray-400 text-xs truncate">{w.authors}</p>
                      <p className="text-indigo-400 font-bold text-sm mt-1">${w.price.toFixed(2)}</p>
                      <button onClick={() => removeWish(w.book_id)} className="text-xs text-red-400 hover:text-red-300 mt-1">Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {/* Recs */}
          {tab === 'history' && (
            <div>
              <p className="text-gray-400 text-sm mb-4">Personalised picks based on popular reads</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {recs.map(book => (
                  <Link key={book.google_id} href={`/books/${book.google_id}`} className="glass rounded-2xl p-4 flex gap-3 hover:border-indigo-500/40 transition-all">
                    <div className="w-12 h-16 rounded-lg overflow-hidden bg-gray-800 shrink-0">
                      {book.thumbnail ? <Image src={book.thumbnail} alt={book.title} width={48} height={64} className="object-cover w-full h-full" unoptimized /> : <div className="w-full h-full flex items-center justify-center text-xl">📚</div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium line-clamp-2">{book.title}</p>
                      <p className="text-gray-400 text-xs truncate">{book.authors}</p>
                      <p className="text-indigo-400 font-bold text-sm mt-1">${book.price?.toFixed(2)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
