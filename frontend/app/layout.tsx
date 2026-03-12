import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'BookAI — AI-Powered Book Discovery',
  description: 'Find your next favourite book with the power of AI semantic search and personalised recommendations.',
  keywords: ['books', 'AI', 'semantic search', 'book recommendations', 'reading'],
  openGraph: {
    title: 'BookAI — AI-Powered Book Discovery',
    description: 'Find your next favourite book with the power of AI semantic search.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CartProvider>
            <Header />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
