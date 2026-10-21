import { Link, useLocation } from 'react-router-dom';
import { Home, Quote, BarChart2, Settings, User } from 'lucide-react';
import { triggerHaptic } from '../../utils/haptics';
import { usePwaInstall } from '../../hooks/usePwaInstall';

interface NavTab {
  path: string;
  label: string;
  icon: typeof Home;
  isPractice?: boolean;
}

const TABS: NavTab[] = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/game?mode=quotes', label: 'Practice', icon: Quote, isPractice: true },
  { path: '/stats', label: 'Stats', icon: BarChart2 },
  { path: '/settings', label: 'Settings', icon: Settings },
  { path: '/about', label: 'About', icon: User },
];

export default function AppBottomNav() {
  const location = useLocation();
  const { hasAppUpdate } = usePwaInstall();

  return (
    <nav
      aria-label="App Navigation Bar"
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md border-t border-neutral-200/80 dark:border-neutral-800/80 pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-4px_20px_rgba(0,0,0,0.04)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.4)] transition-colors select-none"
    >
      <div className="flex items-center justify-around h-15 max-w-lg mx-auto px-2">
        {TABS.map((tab) => {
          const isActive = tab.isPractice
            ? location.pathname === '/game'
            : location.pathname === tab.path;
          const Icon = tab.icon;

          return (
            <Link
              key={tab.label}
              to={tab.path}
              onClick={() => {
                triggerHaptic('tap');
                if (tab.isPractice) {
                  try {
                    localStorage.setItem('typlix_game_mode', JSON.stringify('quotes'));
                  } catch {}
                }
              }}
              aria-current={isActive ? 'page' : undefined}
              className={`relative flex flex-col items-center justify-center flex-1 h-full py-1 text-center transition-all duration-150 cursor-pointer active:scale-95 touch-manipulation focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900 dark:focus-visible:ring-white rounded-xl ${
                isActive
                  ? 'text-neutral-950 dark:text-neutral-50 font-bold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 font-medium'
              }`}
            >
              <div className="relative">
                <div
                  className={`p-1 rounded-xl transition-all ${
                    isActive
                      ? 'bg-neutral-200/70 dark:bg-neutral-800/80 shadow-2xs'
                      : ''
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 transition-transform ${
                      isActive ? 'scale-105 stroke-[2.25]' : 'stroke-[1.8]'
                    }`}
                  />
                </div>

                {/* Update indicator on Settings tab */}
                {tab.path === '/settings' && hasAppUpdate && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neutral-900 dark:bg-neutral-100 opacity-60"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-neutral-900 dark:bg-neutral-100 border border-white dark:border-neutral-950"></span>
                  </span>
                )}
              </div>

              <span className="text-[10px] tracking-tight leading-tight mt-0.5">
                {tab.label}
              </span>

              {/* Minimalist active indicator dot */}
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-neutral-900 dark:bg-neutral-100 mt-0.5" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
