import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '../common/ThemeToggle';
import { useAuth } from '../../hooks/useAuth';
import { useIsMobile } from '../../hooks/useIsMobile';
import { LogIn, Menu, X, Home } from 'lucide-react';
import AuthModal from '../common/AuthModal';
import UserAvatar from '../common/UserAvatar';

const NAV_LINKS = [
  { path: '/', label: 'Home' },
  { path: '/game', label: 'Practice' },
  { path: '/stats', label: 'Stats' },
  { path: '/settings', label: 'Settings' },
];

export default function Navbar() {
  const location = useLocation();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const isTypingMode = location.pathname.startsWith('/game');

  // Close mobile menu on route change
  const [prevPath, setPrevPath] = useState(location.pathname);
  if (location.pathname !== prevPath) {
    setPrevPath(location.pathname);
    setIsMobileMenuOpen(false);
  }

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Close mobile menu on click/touch outside
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside, { passive: true });
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <nav
        aria-label="Main Navigation"
        className={`border-b border-neutral-200 dark:border-neutral-800/80 px-3 sm:px-6 md:px-8 py-2 md:py-2.5 flex items-center justify-between sticky top-0 z-50 transition-colors ${
          isMobileMenuOpen
            ? 'bg-white dark:bg-neutral-900 shadow-xs'
            : 'bg-neutral-50/90 dark:bg-neutral-950/90 backdrop-blur-md'
        }`}
        ref={mobileMenuRef}
      >
        <Link
          to="/"
          className="flex items-center gap-2 group cursor-pointer rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-neutral-100"
          aria-label="Typlix Touch Typing Trainer Home"
        >
          <div className="w-7 h-7 rounded-md bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-extrabold text-xs flex items-center justify-center font-mono shadow-xs group-hover:scale-105 transition-transform">
            T
          </div>
          <span className="text-base font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Typlix
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className={`${isMobile ? 'hidden' : 'hidden md:flex'} items-center gap-1 sm:gap-2`}>
          <div className="flex items-center gap-0.5 sm:gap-1" role="menubar">
            {NAV_LINKS.map(({ path, label }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-neutral-100 ${
                    isActive
                      ? 'text-neutral-900 dark:text-neutral-100 font-semibold'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-100/70 dark:hover:bg-neutral-800/40'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-nav-pill"
                      className="absolute inset-0 bg-neutral-200/90 dark:bg-neutral-800 rounded-md shadow-2xs -z-10"
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    />
                  )}
                  <span className="relative z-10">{label}</span>
                </Link>
              );
            })}
          </div>

          <div className="pl-1.5 sm:pl-2 ml-1 sm:ml-2 border-l border-neutral-200 dark:border-neutral-800 flex items-center gap-2">
            {user ? (
              <Link
                to="/profile"
                className="flex items-center gap-2 group cursor-pointer rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-neutral-100 active:scale-95 transition-transform"
                aria-label={`View profile for ${user.displayName || user.email || 'user'}`}
              >
                <UserAvatar
                  photoURL={user.photoURL}
                  name={user.displayName}
                  email={user.email}
                  size="sm"
                  className="group-hover:ring-2 ring-neutral-400 dark:ring-neutral-500 transition-all"
                />
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 active:scale-[0.97] shadow-xs transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-neutral-100 cursor-pointer"
              >
                <LogIn className="w-4 h-4" aria-hidden="true" />
                <span>Sign In</span>
              </button>
            )}
            
            <div className="border-l border-neutral-200 dark:border-neutral-800 h-5 mx-1" aria-hidden="true" />
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile: Theme + Home (typing mode only) + Hamburger */}
        <div className={`${isMobile ? 'flex' : 'flex md:hidden'} items-center gap-1 sm:gap-1.5`}>
          <ThemeToggle />
          {isTypingMode && (
            <Link
              to="/"
              aria-label="Go to Home"
              title="Home"
              className="p-2 rounded-lg text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white"
            >
              <Home className="w-5 h-5" />
            </Link>
          )}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMobileMenuOpen}
            className="p-2 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile Dropdown Menu (Solid Opaque, Scrollable, No Transparency/Blur Bleed) */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.99 }}
              transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
              className={`absolute top-full left-0 right-0 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 shadow-2xl ${isMobile ? 'block' : 'md:hidden'} z-50 max-h-[80vh] overflow-y-auto`}
            >
              <div className="flex flex-col py-2 px-4 divide-y divide-neutral-100 dark:divide-neutral-800/60">
                <div className="flex flex-col gap-1 pb-2">
                  {NAV_LINKS.map(({ path, label }) => {
                    const isActive = location.pathname === path;
                    return (
                      <Link
                        key={path}
                        to={path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        aria-current={isActive ? 'page' : undefined}
                        className={`px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                          isActive
                            ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-semibold'
                            : 'text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                        }`}
                      >
                        {label}
                      </Link>
                    );
                  })}
                </div>

                {/* Auth in mobile menu */}
                <div className="pt-3 pb-1">
                  {user ? (
                    <Link
                      to="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-all"
                    >
                      <UserAvatar
                        photoURL={user.photoURL}
                        name={user.displayName}
                        email={user.email}
                        size="sm"
                      />
                      <span>{user.displayName || user.email?.split('@')[0] || 'Profile'}</span>
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsAuthModalOpen(true);
                      }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 active:scale-[0.98] transition-all cursor-pointer shadow-xs"
                    >
                      <LogIn className="w-4 h-4" aria-hidden="true" />
                      <span>Sign In</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Backdrop overlay when mobile menu is open */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className={`fixed inset-0 bg-black/40 z-40 ${isMobile ? 'block' : 'md:hidden'}`}
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </>
  );
}
