import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar({ darkMode, onToggleTheme, onOpenCart, onOpenAuth }) {
  const { count } = useCart();
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-ink/90 backdrop-blur border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="font-display text-2xl tracking-wide text-bone">
          PESHKASH
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-widest2 text-stone">
          <Link to="/" className="hover:text-gold transition-colors">
            Catalog
          </Link>
          <Link to="/products/new" className="hover:text-gold transition-colors">
            Add Product
          </Link>
          <a href="#about" className="hover:text-gold transition-colors">
            About
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onToggleTheme}
            className="w-9 h-9 flex items-center justify-center text-stone hover:text-gold border border-white/10 transition-colors"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-pressed={darkMode}
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
              </svg>
            ) : (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
              </svg>
            )}
          </button>
          {user?.verified ? (
            <button
              onClick={logout}
              className="text-xs uppercase tracking-widest2 text-stone hover:text-gold transition-colors"
              title="Verified via DigiLocker"
            >
              21+ Verified
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="text-xs uppercase tracking-widest2 text-gold border border-gold/50 px-3 py-1.5 hover:bg-gold hover:text-ink transition-colors"
            >
              Verify Age
            </button>
          )}

          <button onClick={onOpenCart} className="relative text-bone hover:text-gold transition-colors" aria-label="Open cart">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 3h2l.4 2M7 13h10l3-8H5.4M7 13L5.4 5M7 13l-2.3 5H17M9 21a1 1 0 100-2 1 1 0 000 2zM17 21a1 1 0 100-2 1 1 0 000 2z" />
            </svg>
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-ink text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
