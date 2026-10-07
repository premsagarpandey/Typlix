import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import ErrorBoundary from './components/common/ErrorBoundary';
import GlobalToast from './components/common/GlobalToast';
import CookieConsent from './components/common/CookieConsent';
import { openCookieConsentModal } from './utils/cookieConsent';
import { initSecurityShield } from './utils/securityShield';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { useIsMobile } from './hooks/useIsMobile';

const Game = lazy(() => import('./pages/Game'));
const Stats = lazy(() => import('./pages/Stats'));
const Settings = lazy(() => import('./pages/Settings'));
const Profile = lazy(() => import('./pages/Profile'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const CookiesPolicy = lazy(() => import('./pages/CookiesPolicy'));
const RefundPolicy = lazy(() => import('./pages/RefundPolicy'));

function PageFallback() {
  return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <div className="w-5 h-5 border-2 border-neutral-300 dark:border-neutral-700 border-t-neutral-900 dark:border-t-neutral-100 rounded-full animate-spin" />
    </div>
  );
}

function AppLayout() {
  const location = useLocation();
  const isGamePage = location.pathname === '/game';
  const isMobile = useIsMobile();

  useEffect(() => {
    return initSecurityShield();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col transition-colors duration-200">
      {/* Accessible Skip to Content Link (WCAG 2.4.1) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[99999] focus:px-4 focus:py-2 focus:bg-neutral-900 focus:text-white dark:focus:bg-neutral-100 dark:focus:text-neutral-900 focus:rounded-lg focus:shadow-xl focus:font-semibold focus:text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-900 dark:focus:ring-white"
      >
        Skip to main content
      </a>
      <Navbar />
      <main
        id="main-content"
        tabIndex={-1}
        role="main"
        className={`flex-1 w-full focus:outline-none ${isGamePage ? 'px-2 sm:px-4 py-1 sm:py-2 h-[calc(100dvh-48px)] overflow-hidden' : 'px-4 sm:px-6 md:px-8 py-4'}`}
      >
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/game" element={<Game />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/cookies" element={<CookiesPolicy />} />
            <Route path="/refund" element={<RefundPolicy />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      {!isGamePage && (
        <footer className={`w-full py-6 text-xs text-neutral-600 dark:text-neutral-400 border-t border-neutral-200 dark:border-neutral-800/80 max-w-4xl mx-auto px-4 sm:px-6 md:px-8 ${isMobile ? 'space-y-0' : 'space-y-4'}`}>
          {!isMobile && (
            <div className="hidden sm:flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
                <span className="font-bold text-neutral-800 dark:text-neutral-200 text-sm">Typlix</span>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-neutral-200/80 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700">
                  Data Minimization
                </span>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-neutral-200/80 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700">
                  DPDP Act 2023
                </span>
              </div>
              <p className="text-neutral-600 dark:text-neutral-400 text-[11px]">
                Operated by Typlix Interactive (Prem Sagar Pandey) · Minimalist touch typing training.
              </p>
            </div>
          )}

          <div className={`flex flex-wrap items-center justify-center sm:justify-between gap-3 ${!isMobile ? 'pt-2 border-t border-neutral-200/60 dark:border-neutral-800/50' : ''}`}>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[11px]">
              <Link to="/privacy" className="hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors">
                Cookie Policy
              </Link>
              <Link to="/refund" className="hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors">
                No-Charge Policy
              </Link>
              <button
                type="button"
                onClick={openCookieConsentModal}
                aria-label="Open cookie preferences settings modal"
                className="hover:text-neutral-900 dark:hover:text-neutral-200 underline underline-offset-2 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900 dark:focus-visible:ring-white rounded-xs"
              >
                Cookie Preferences
              </button>
            </div>
            <div className="text-[11px] text-neutral-600 dark:text-neutral-400 text-center sm:text-right">
              All images & media © {new Date().getFullYear()} Typlix.
            </div>
          </div>
        </footer>
      )}
      <GlobalToast />
      <CookieConsent />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider>
          <Router>
            <AppLayout />
          </Router>
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
