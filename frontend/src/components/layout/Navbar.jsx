import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'Clothes', to: '/shop?category=clothes' },
  { label: 'Shoes', to: '/shop?category=shoes' },
  { label: 'Slippers', to: '/shop?category=slippers' },
  { label: 'New Arrivals', to: '/new-arrivals' },
  { label: 'About Us', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const { itemCount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
      setOpen(false);
      setQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-bone/95 backdrop-blur border-b border-stone/15">
      <div className="max-w-content mx-auto px-5 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="font-display text-2xl md:text-[28px] tracking-wide text-ink">
            LUXE CART
          </Link>

          <nav className="hidden lg:flex items-center gap-7">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                className="text-[13.5px] text-ink/80 hover:text-wine transition-colors"
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-4 md:gap-5">
            <button
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="Search"
              className="inline-flex text-ink/80 hover:text-wine transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
              </svg>
            </button>
            <Link
              to={user ? '/account' : '/login'}
              aria-label={user ? `Account — ${user.name}` : 'Sign in'}
              className="hidden sm:inline-flex items-center gap-1.5 text-ink/80 hover:text-wine transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <circle cx="12" cy="8" r="3.5" />
                <path d="M4.5 20c1.4-3.6 4.4-5.5 7.5-5.5s6.1 1.9 7.5 5.5" strokeLinecap="round" />
              </svg>
              {user && <span className="text-xs">{user.name.split(' ')[0]}</span>}
            </Link>
            <Link to="/cart" aria-label="Cart" className="relative inline-flex text-ink/80 hover:text-wine transition-colors">
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M6 8h12l-1 12H7L6 8z" strokeLinejoin="round" />
                <path d="M9 8V6a3 3 0 016 0v2" strokeLinecap="round" />
              </svg>
              <AnimatePresence>
                {itemCount > 0 && (
                  <motion.span
                    key={itemCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                    className="absolute -top-2 -right-2 bg-wine text-bone text-[10px] w-4 h-4 rounded-full flex items-center justify-center"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            <button
              className="lg:hidden text-ink"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((v) => !v)}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                {open ? (
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                ) : (
                  <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-stone/15 bg-bone overflow-hidden"
          >
            <form onSubmit={handleSearch} className="max-w-content mx-auto flex gap-2 px-5 md:px-8 py-4">
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for products…"
                className="flex-1 border border-stone/30 bg-transparent px-4 py-2.5 text-sm focus:border-wine outline-none"
              />
              <button type="submit" className="bg-ink text-bone px-5 text-sm hover:bg-wine transition-colors">
                Search
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden border-t border-stone/15 bg-bone overflow-hidden"
          >
            <div className="px-5 py-4 flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.label}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className="text-[15px] text-ink/85"
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
