'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiCheck, FiLock, FiArrowLeft } from 'react-icons/fi';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';

type Step = 'shipping' | 'payment' | 'success';

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState<Step>('shipping');
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState('');

  const [shipping, setShipping] = useState({
    name: user?.name || '',
    email: user?.email || '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'India',
  });

  const [payment, setPayment] = useState({
    method: 'mock',
    cardName: '',
    cardNum: '',
    expiry: '',
    cvv: '',
  });

  if (items.length === 0 && step !== 'success') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-7xl mb-4">🛒</div>
        <h2 className="font-serif text-2xl font-bold text-white mb-3">Cart is empty</h2>
        <Link href="/shop" className="btn-primary">Browse Books</Link>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    if (!user) { router.push('/auth/login'); return; }
    setLoading(true);
    try {
      const fullAddress = `${shipping.address}, ${shipping.city}, ${shipping.state} ${shipping.zip}, ${shipping.country}`;
      const res = await api.placeOrder({
        items: items.map(i => ({ book_id: i.book_id, title: i.title, price: i.price, quantity: i.quantity })),
        total,
        shipping_address: fullAddress,
        payment_method: payment.method,
      });
      setOrderId(res.order_id);
      clearCart();
      setStep('success');
    } catch { /* empty */ } finally { setLoading(false); }
  };

  if (step === 'success') {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-green-600/20 border border-green-500/40 flex items-center justify-center mx-auto mb-6">
          <FiCheck className="text-green-400" size={36} />
        </div>
        <h1 className="font-serif text-3xl font-bold text-white mb-2">Order Confirmed!</h1>
        <p className="text-gray-400 mb-2">Thank you for your order, {user?.name?.split(' ')[0]}!</p>
        <p className="text-gray-500 text-sm mb-8">Order #{orderId.slice(-8).toUpperCase()}</p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/profile" className="btn-primary">View Order</Link>
          <Link href="/shop" className="btn-secondary">Keep Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-8 transition-colors">
        <FiArrowLeft size={16} /> Back to Cart
      </button>

      <h1 className="section-title mb-8">Checkout</h1>

      {/* Steps indicator */}
      <div className="flex items-center gap-3 mb-10">
        {(['shipping', 'payment'] as Step[]).map((s, i) => (
          <React.Fragment key={s}>
            <div className={`flex items-center gap-2 text-sm font-medium ${step === s ? 'text-white' : (step as string) === 'success' || (s === 'shipping' && step === 'payment') ? 'text-indigo-400' : 'text-gray-500'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border ${step === s ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-gray-700 text-gray-500'}`}>
                {step === 'payment' && s === 'shipping' ? <FiCheck size={12} /> : i + 1}
              </div>
              <span className="capitalize hidden sm:inline">{s}</span>
            </div>
            {i < 1 && <div className="flex-1 h-px bg-gray-800" />}
          </React.Fragment>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-8">
        <div>
          {step === 'shipping' && (
            <div className="glass rounded-2xl p-6 space-y-4">
              <h2 className="font-semibold text-white mb-4">Shipping Information</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { label: 'Full Name', key: 'name', placeholder: 'Jane Smith' },
                  { label: 'Email', key: 'email', placeholder: 'you@example.com', type: 'email' },
                ].map(({ label, key, placeholder, type }) => (
                  <div key={key}>
                    <label className="text-sm text-gray-400 block mb-1.5">{label}</label>
                    <input type={type || 'text'} value={shipping[key as keyof typeof shipping]}
                      onChange={e => setShipping(p => ({ ...p, [key]: e.target.value }))}
                      placeholder={placeholder} className="input" required />
                  </div>
                ))}
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-1.5">Street Address</label>
                <input type="text" value={shipping.address} onChange={e => setShipping(p => ({ ...p, address: e.target.value }))}
                  placeholder="123 Main Street" className="input" required />
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[['City', 'city', 'Mumbai'], ['State', 'state', 'MH'], ['ZIP', 'zip', '400001']].map(([label, key, ph]) => (
                  <div key={key}>
                    <label className="text-sm text-gray-400 block mb-1.5">{label}</label>
                    <input type="text" value={shipping[key as keyof typeof shipping]}
                      onChange={e => setShipping(p => ({ ...p, [key]: e.target.value }))}
                      placeholder={ph} className="input" />
                  </div>
                ))}
              </div>
              <button onClick={() => setStep('payment')} disabled={!shipping.name || !shipping.address}
                className="btn-primary w-full justify-center mt-2">Continue to Payment</button>
            </div>
          )}

          {step === 'payment' && (
            <div className="glass rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <FiLock className="text-green-400" size={16} />
                <h2 className="font-semibold text-white">Payment (Demo)</h2>
              </div>
              <div className="glass rounded-xl p-4 border border-indigo-700/30 mb-2">
                <p className="text-indigo-300 text-sm">🎭 This is a demo checkout. No real payment is processed.</p>
              </div>
              {[
                { label: 'Cardholder Name', key: 'cardName', placeholder: 'Jane Smith' },
                { label: 'Card Number', key: 'cardNum', placeholder: '4242 4242 4242 4242' },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="text-sm text-gray-400 block mb-1.5">{label}</label>
                  <input type="text" value={payment[key as keyof typeof payment]}
                    onChange={e => setPayment(p => ({ ...p, [key]: e.target.value }))}
                    placeholder={placeholder} className="input" />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 block mb-1.5">Expiry</label>
                  <input type="text" value={payment.expiry} onChange={e => setPayment(p => ({ ...p, expiry: e.target.value }))} placeholder="MM/YY" className="input" />
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-1.5">CVV</label>
                  <input type="text" value={payment.cvv} onChange={e => setPayment(p => ({ ...p, cvv: e.target.value }))} placeholder="123" className="input" />
                </div>
              </div>
              <div className="flex gap-3 mt-2">
                <button onClick={() => setStep('shipping')} className="btn-secondary flex-1 justify-center">Back</button>
                <button onClick={handlePlaceOrder} disabled={loading} className="btn-primary flex-1 justify-center">
                  {loading ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Placing...</span> : `Place Order · $${total.toFixed(2)}`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order summary */}
        <div className="glass rounded-2xl p-5 h-fit sticky top-20">
          <h3 className="font-semibold text-white mb-4 text-sm">Order Summary</h3>
          <div className="space-y-2 mb-4">
            {items.map(item => (
              <div key={item.book_id} className="flex justify-between text-xs">
                <span className="text-gray-400 truncate flex-1 mr-2">{item.title} × {item.quantity}</span>
                <span className="text-gray-300 shrink-0">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 pt-3">
            <div className="flex justify-between text-xs text-gray-400 mb-1"><span>Subtotal</span><span>${total.toFixed(2)}</span></div>
            <div className="flex justify-between text-xs text-gray-400 mb-2"><span>Shipping</span><span className="text-green-400">Free</span></div>
            <div className="flex justify-between font-bold text-white"><span>Total</span><span>${total.toFixed(2)}</span></div>
          </div>
          {shipping.address && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-xs text-gray-500 mb-1">Delivering to:</p>
              <p className="text-xs text-gray-300">{shipping.name}</p>
              <p className="text-xs text-gray-400">{shipping.address}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
