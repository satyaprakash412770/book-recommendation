import Link from 'next/link';
import { FiBookOpen, FiGithub, FiTwitter } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-gray-950 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 font-bold text-xl mb-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                <FiBookOpen className="text-white" size={16} />
              </div>
              <span className="gradient-text">BookAI</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              AI-powered book discovery platform. Find your next great read with semantic search and personalised recommendations.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a href="#" className="text-gray-500 hover:text-white transition-colors"><FiGithub size={18} /></a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors"><FiTwitter size={18} /></a>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Navigate</h4>
            <ul className="space-y-2">
              {[['/', 'Home'], ['/shop', 'Shop'], ['/blog', 'Blog'], ['/about', 'About']].map(([href, label]) => (
                <li key={href}><Link href={href} className="text-gray-400 hover:text-white text-sm transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Account</h4>
            <ul className="space-y-2">
              {[['/auth/login', 'Sign In'], ['/auth/signup', 'Sign Up'], ['/profile', 'Profile'], ['/cart', 'Cart']].map(([href, label]) => (
                <li key={href}><Link href={href} className="text-gray-400 hover:text-white text-sm transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-white/5 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-gray-500 text-sm">© 2024 BookAI. Powered by Google Books API & AI Semantic Search.</p>
          <p className="text-gray-600 text-xs">Built with Next.js · FastAPI · MongoDB Atlas</p>
        </div>
      </div>
    </footer>
  );
}
