import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from '../common/ThemeToggle';
import { useAuth } from '../../hooks/useAuth';
import { LogIn } from 'lucide-react';
import AuthModal from '../common/AuthModal';
import UserAvatar from '../common/UserAvatar';

const NAV_LINKS = [
  { path: '/', label: 'Home' },
  { path: '/game', label: 'Practice' },
  { path: '/stats', label: 'Stats' },
  { path: '/leaderboard', label: 'Leaderboard' },
  { path: '/settings', label: 'Settings' },
];

export default function Navbar() {
  const location = useLocation();
  const { user } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <>
      <nav
        aria-label="Main Navigation"
        className="border-b border-neutral-200 dark:border-neutral-800/80 px-4 sm:px-8 py-2.5 flex items-center justify-between sticky top-0 z-50 bg-neutral-50/90 dark:bg-neutral-950/90 backdrop-blur-md transition-colors"
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

        <div className="flex items-center gap-1 sm:gap-2">
          <div className="flex items-center gap-0.5 sm:gap-1" role="menubar">
            {NAV_LINKS.map(({ path, label }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  aria-current={isActive ? 'page' : undefined}
                  className={`px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-neutral-100 ${
                    isActive
                      ? 'bg-neutral-200/80 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-900/60'
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </div>

          <div className="pl-1.5 sm:pl-2 ml-1 sm:ml-2 border-l border-neutral-200 dark:border-neutral-800 flex items-center gap-2">
            {user ? (
              <Link
                to="/profile"
                className="flex items-center gap-2 group cursor-pointer rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-neutral-100"
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
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-neutral-100 cursor-pointer"
              >
                <LogIn className="w-4 h-4" aria-hidden="true" />
                <span>Sign In</span>
              </button>
            )}
            
            <div className="border-l border-neutral-200 dark:border-neutral-800 h-5 mx-1" aria-hidden="true" />
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </>
  );
}

