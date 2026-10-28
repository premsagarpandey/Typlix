import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, ArrowRight, ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { toast } from '../../utils/toast';
import { authDefense } from '../../utils/secureStorage';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { user, loginWithGoogle, loginWithGoogleRedirect, loginWithEmail, signupWithEmail, sendPasswordReset } = useAuth();
  const navigate = useNavigate();
  
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [botTrap, setBotTrap] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeDataConsent, setAgreeDataConsent] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [lockoutRemaining, setLockoutRemaining] = useState<number>(() => authDefense.getRemainingLockoutSeconds());
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      const initial = authDefense.getRemainingLockoutSeconds();
      setLockoutRemaining(initial);
    }, 0);

    const interval = setInterval(() => {
      const rem = authDefense.getRemainingLockoutSeconds();
      setLockoutRemaining(rem);
      if (rem <= 0) clearInterval(interval);
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setEmail('');
    setPassword('');
    setBotTrap('');
    setAgreeTerms(false);
    setAgreeDataConsent(false);
    setEmailLoading(false);
    setGoogleLoading(false);
    setIsForgotMode(false);
    setResetSent(false);
    onClose();
  }, [onClose]);

  // Automatically close modal and navigate to home whenever user is signed in
  useEffect(() => {
    if (user && isOpen) {
      onClose();
      navigate('/');
    }
  }, [user, isOpen, onClose, navigate]);

  // Close modal on escape key & trap focus inside dialog (WCAG 2.4.3)
  useEffect(() => {
    if (!isOpen) return;

    // Auto-focus email input on open
    const focusTimer = setTimeout(() => {
      const emailInput = document.getElementById('auth-email');
      emailInput?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
        return;
      }
      if (e.key === 'Tab' && modalRef.current) {
        const focusables = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearTimeout(focusTimer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (emailLoading || googleLoading) return;

    // 1. Silent Honeypot Trap: Automated bot detection
    if (botTrap.trim().length > 0) {
      // Simulate fake processing for malicious automated bot
      setEmailLoading(true);
      setTimeout(() => {
        setEmailLoading(false);
        toast.error('Security verification failed.', 'Shield Active');
      }, 800);
      return;
    }

    // 2. Persistent Rate Limiting & Brute-Force Lockdown Check
    const currentLockout = authDefense.getRemainingLockoutSeconds();
    if (currentLockout > 0) {
      setLockoutRemaining(currentLockout);
      toast.error(`Security guard active. Please wait ${currentLockout}s before retrying.`, 'Brute-Force Protection');
      return;
    }

    const emailLower = email.toLowerCase().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!emailRegex.test(emailLower)) {
      toast.error('Please enter a valid email address.', 'Invalid Email');
      return;
    }

    // Handle Password Reset Mode
    if (isForgotMode) {
      setEmailLoading(true);
      try {
        await sendPasswordReset(emailLower);
        setResetSent(true);
        toast.success('Password reset link sent to your email!', 'Check Your Inbox');
      } catch (err: unknown) {
        console.error('Password reset request completed:', err);
        // Anti-enumeration: Always show friendly message to prevent email discovery
        setResetSent(true);
        toast.success('If an account exists with this email, a reset link has been dispatched.', 'Check Your Inbox');
      } finally {
        setEmailLoading(false);
      }
      return;
    }

    // Sign up specific checks
    if (!isLoginMode) {
      if (!agreeTerms) {
        toast.error('Please accept the Terms & Conditions and Privacy Policy to continue.', 'Consent Required');
        return;
      }
      if (!agreeDataConsent) {
        toast.error('Please consent to necessary data processing to create your account.', 'Consent Required');
        return;
      }

      // Strong password validation
      if (password.length < 8) {
        toast.error('Password must be at least 8 characters long for account security.', 'Weak Password');
        return;
      }
      if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
        toast.error('Password must contain both letters and at least one number.', 'Weak Password');
        return;
      }
    }

    setEmailLoading(true);

    try {
      if (isLoginMode) {
        await loginWithEmail(emailLower, password);
        authDefense.resetAttempts();
        setLockoutRemaining(0);
        toast.success('Signed in successfully!', 'Welcome Back');
      } else {
        await signupWithEmail(emailLower, password);
        authDefense.resetAttempts();
        setLockoutRemaining(0);
        toast.success('Account created successfully!', 'Welcome to Typlix');
      }
      handleClose();
    } catch (err: unknown) {
      console.error('Auth request completed:', err);

      // Track failed attempt in persistent multi-tier ledger
      const cooldownSeconds = authDefense.recordFailedAttempt();
      setLockoutRemaining(cooldownSeconds);

      const authError = err as { code?: string; message?: string };
      let message = 'An error occurred during authentication.';

      // Anti-Account-Enumeration defense: Never tell hackers whether an email is registered or not
      if (
        authError.code === 'auth/invalid-credential' ||
        authError.code === 'auth/wrong-password' ||
        authError.code === 'auth/user-not-found' ||
        authError.code === 'auth/invalid-email'
      ) {
        message = 'Invalid email or password. Please verify your credentials or reset your password.';
      } else if (authError.code === 'auth/email-already-in-use') {
        message = 'This email is already registered. Please sign in or use password reset.';
      } else if (authError.code === 'auth/weak-password') {
        message = 'Password is too weak. Please use at least 8 characters with letters and numbers.';
      } else if (authError.code === 'auth/too-many-requests') {
        message = 'Too many attempts detected. Please wait a few moments before trying again.';
      } else if (authError.message) {
        message = authError.message;
      }

      toast.error(message, isLoginMode ? 'Login Failed' : 'Sign Up Failed');
    } finally {
      setEmailLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    if (googleLoading || emailLoading) return;
    setGoogleLoading(true);

    try {
      await loginWithGoogle();
      authDefense.resetAttempts();
      setLockoutRemaining(0);
      toast.success('Signed in with Google successfully!', 'Welcome Back');
      handleClose();
    } catch (err: unknown) {
      console.error('Google Auth Error:', err);
      const authError = err as { code?: string; message?: string };
      let message = 'Failed to authenticate with Google.';
      if (authError.code === 'auth/popup-closed-by-user') {
        message = 'Sign-in cancelled. You closed the Google window.';
      } else if (authError.code === 'auth/popup-blocked') {
        // Try fallback to redirect
        try {
          await loginWithGoogleRedirect();
          return;
        } catch {
          message = 'Google sign-in popup was blocked. Please allow popups or use redirect.';
        }
      } else if (authError.code === 'auth/cancelled-popup-request') {
        message = 'Sign-in request was interrupted. Please click once.';
      } else if (authError.code === 'auth/unauthorized-domain') {
        message = 'This domain is not authorized in Firebase settings.';
      } else if (authError.message) {
        message = authError.message;
      }

      toast.error(message, 'Google Sign-In');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleRedirect = async () => {
    if (googleLoading || emailLoading) return;
    setGoogleLoading(true);

    try {
      await loginWithGoogleRedirect();
    } catch (err: unknown) {
      const authError = err as { message?: string };
      toast.error(authError.message || 'Failed to redirect to Google.', 'Redirect Error');
      setGoogleLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-neutral-950/60 backdrop-blur-sm"
          />

          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-modal-title"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="absolute top-4 right-4">
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close authentication dialog"
                className="p-1 text-neutral-500 hover:text-neutral-900 dark:hover:text-white bg-neutral-100 dark:bg-neutral-800 rounded-full transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <div className="p-8">
              <div className="mb-6 text-center">
                <img
                  src="/logo192.png"
                  alt="Typlix Logo"
                  width="48"
                  height="48"
                  className="w-12 h-12 mx-auto mb-4 rounded-xl object-contain shadow-md"
                />
                <h2 id="auth-modal-title" className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white mb-2">
                  {isForgotMode ? 'Reset password' : isLoginMode ? 'Welcome back' : 'Create an account'}
                </h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {isForgotMode
                    ? 'Enter your account email to receive a secure password reset link'
                    : isLoginMode
                    ? 'Sign in to sync your typing progress and practice records'
                    : 'Create your account to sync your stats and progress across devices'}
                </p>
              </div>

              {/* ─── PRIMARY 1-CLICK GOOGLE AUTH (Only on Login/Signup) ─── */}
              {!isForgotMode && (
                <>
                  <div className="space-y-2 mb-6">
                    <button
                      type="button"
                      onClick={handleGoogleAuth}
                      aria-label={googleLoading ? 'Connecting to Google...' : 'Continue with Google'}
                      disabled={googleLoading || emailLoading}
                      className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-neutral-300 dark:border-neutral-700 rounded-xl shadow-xs text-sm font-semibold text-neutral-800 dark:text-neutral-100 bg-white dark:bg-neutral-800/90 hover:bg-neutral-50 dark:hover:bg-neutral-750 hover:border-neutral-400 dark:hover:border-neutral-600 active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {googleLoading ? (
                        <div className="w-5 h-5 border-2 border-neutral-400 border-t-neutral-900 dark:border-t-white rounded-full animate-spin" />
                      ) : (
                        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                          <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                          />
                          <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                          />
                          <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                          />
                          <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                          />
                          <path d="M1 1h22v22H1z" fill="none" />
                        </svg>
                      )}
                      <span>{googleLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
                    </button>

                    <div className="text-center">
                      <button
                        type="button"
                        onClick={handleGoogleRedirect}
                        aria-label="Sign in using Google redirect instead of popup"
                        className="text-[11px] text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors cursor-pointer"
                      >
                        Popup not opening? Try with redirect &rarr;
                      </button>
                    </div>
                  </div>

                  {/* ─── OR DIVIDER ─── */}
                  <div className="my-5 relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-neutral-200 dark:border-neutral-800" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="px-2.5 bg-white dark:bg-neutral-900 text-neutral-500 dark:text-neutral-400 font-medium uppercase tracking-wider">
                        or continue with email
                      </span>
                    </div>
                  </div>
                </>
              )}

              {/* ─── FORGOT PASSWORD CONFIRMATION STATE ─── */}
              {isForgotMode && resetSent ? (
                <div className="text-center space-y-4 py-4">
                  <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-semibold text-neutral-900 dark:text-white">Check your email</h3>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 max-w-xs mx-auto">
                      A password reset link was sent to <span className="font-semibold text-neutral-900 dark:text-neutral-200">{email}</span>. Click the link in the email to set a new password.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotMode(false);
                      setResetSent(false);
                      setIsLoginMode(true);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-900 dark:text-white hover:underline cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back to sign in
                  </button>
                </div>
              ) : (
                /* ─── EMAIL FORM ─── */
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Invisible Honeypot to trap automated bots & credential stuffers */}
                  <div style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', zIndex: -1 }}>
                    <input
                      type="text"
                      name="site_access_token_verify"
                      value={botTrap}
                      onChange={(e) => setBotTrap(e.target.value)}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  <div>
                    <label htmlFor="auth-email" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5 cursor-pointer">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" aria-hidden="true">
                        <Mail className="h-5 w-5 text-neutral-400" />
                      </div>
                      <input
                        id="auth-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                        className="block w-full pl-10 pr-3 py-2.5 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white focus:border-transparent transition-all sm:text-sm"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  {!isForgotMode && (
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label htmlFor="auth-password" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 cursor-pointer">
                          Password
                        </label>
                        {isLoginMode && (
                          <button
                            type="button"
                            onClick={() => {
                              setIsForgotMode(true);
                              setResetSent(false);
                            }}
                            className="text-xs font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:underline transition-colors cursor-pointer"
                          >
                            Forgot password?
                          </button>
                        )}
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" aria-hidden="true">
                          <Lock className="h-5 w-5 text-neutral-400" />
                        </div>
                        <input
                          id="auth-password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          minLength={isLoginMode ? 6 : 8}
                          autoComplete={isLoginMode ? 'current-password' : 'new-password'}
                          className="block w-full pl-10 pr-3 py-2.5 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white focus:border-transparent transition-all sm:text-sm"
                          placeholder="••••••••"
                        />
                      </div>

                      {/* Password strength indicator for signup */}
                      {!isLoginMode && password.length > 0 && (
                        <div className="mt-2 space-y-1">
                          <div className="flex gap-1 h-1 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                            <div className={`h-full transition-all ${password.length >= 8 ? 'w-1/3 bg-emerald-500' : 'w-1/4 bg-amber-500'}`} />
                            <div className={`h-full transition-all ${/[A-Za-z]/.test(password) && /[0-9]/.test(password) ? 'w-1/3 bg-emerald-500' : 'w-0'}`} />
                            <div className={`h-full transition-all ${password.length >= 10 && /[^A-Za-z0-9]/.test(password) ? 'w-1/3 bg-emerald-500' : 'w-0'}`} />
                          </div>
                          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-500" />
                            {password.length < 8
                              ? 'Must be at least 8 characters'
                              : !/[A-Za-z]/.test(password) || !/[0-9]/.test(password)
                              ? 'Add letters and numbers'
                              : 'Strong password'}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {!isForgotMode && !isLoginMode && (
                    <div className="space-y-2.5 pt-1 text-left">
                      <label className="flex items-start gap-2.5 cursor-pointer text-xs text-neutral-600 dark:text-neutral-400 select-none">
                        <input
                          type="checkbox"
                          checked={agreeTerms}
                          onChange={(e) => setAgreeTerms(e.target.checked)}
                          className="mt-0.5 rounded border-neutral-300 dark:border-neutral-700 text-neutral-900 focus:ring-neutral-900 dark:focus:ring-white cursor-pointer"
                          required
                        />
                        <span>
                          I agree to the{' '}
                          <a
                            href="/terms"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-neutral-900 dark:text-white underline underline-offset-2 hover:opacity-80"
                          >
                            Terms & Conditions
                          </a>{' '}
                          and acknowledge the{' '}
                          <a
                            href="/privacy"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-neutral-900 dark:text-white underline underline-offset-2 hover:opacity-80"
                          >
                            Privacy Policy
                          </a>.
                        </span>
                      </label>

                      <label className="flex items-start gap-2.5 cursor-pointer text-xs text-neutral-600 dark:text-neutral-400 select-none">
                        <input
                          type="checkbox"
                          checked={agreeDataConsent}
                          onChange={(e) => setAgreeDataConsent(e.target.checked)}
                          className="mt-0.5 rounded border-neutral-300 dark:border-neutral-700 text-neutral-900 focus:ring-neutral-900 dark:focus:ring-white cursor-pointer"
                          required
                        />
                        <span>
                          <strong className="text-neutral-900 dark:text-neutral-100 font-semibold">Only Necessary Data:</strong> I consent to processing account metrics to synchronize my progress.
                        </span>
                      </label>
                    </div>
                  )}

                  {!isForgotMode && isLoginMode && (
                    <p className="text-[11px] text-neutral-600 dark:text-neutral-400 text-center leading-normal pt-0.5">
                      By signing in, you agree to our{' '}
                      <a
                        href="/terms"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white"
                      >
                        Terms
                      </a>{' '}
                      and{' '}
                      <a
                        href="/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white"
                      >
                        Privacy Policy
                      </a>.
                    </p>
                  )}

                  <button
                    type="submit"
                    aria-label={
                      isForgotMode
                        ? 'Send password reset link'
                        : isLoginMode
                        ? 'Sign in with email and password'
                        : 'Create new Typlix account'
                    }
                    disabled={
                      emailLoading ||
                      googleLoading ||
                      lockoutRemaining > 0 ||
                      (!isForgotMode && !isLoginMode && (!agreeTerms || !agreeDataConsent))
                    }
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-transparent rounded-xl shadow-xs text-sm font-semibold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {emailLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 dark:border-neutral-900/30 border-t-white dark:border-t-neutral-900 rounded-full animate-spin" />
                    ) : lockoutRemaining > 0 ? (
                      <span>Wait {lockoutRemaining}s (Security lockout)</span>
                    ) : (
                      <>
                        {isForgotMode ? 'Send Password Reset Link' : isLoginMode ? 'Sign In with Email' : 'Create Account'}
                        <ArrowRight className="w-4 h-4" aria-hidden="true" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            <div className="bg-neutral-50 dark:bg-neutral-800/50 py-4 px-8 border-t border-neutral-200 dark:border-neutral-800 text-center">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {isForgotMode ? (
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotMode(false);
                      setResetSent(false);
                    }}
                    className="font-semibold text-neutral-900 dark:text-white hover:underline transition-all cursor-pointer inline-flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back to sign in
                  </button>
                ) : isLoginMode ? (
                  <>
                    {"Don't have an account? "}
                    <button
                      type="button"
                      onClick={() => {
                        setIsLoginMode(false);
                        setAgreeTerms(false);
                        setAgreeDataConsent(false);
                      }}
                      aria-label="Switch to sign up form"
                      className="font-semibold text-neutral-900 dark:text-white hover:underline transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900 dark:focus-visible:ring-white rounded-xs"
                    >
                      Sign up
                    </button>
                  </>
                ) : (
                  <>
                    {'Already have an account? '}
                    <button
                      type="button"
                      onClick={() => {
                        setIsLoginMode(true);
                        setAgreeTerms(false);
                        setAgreeDataConsent(false);
                      }}
                      aria-label="Switch to sign in form"
                      className="font-semibold text-neutral-900 dark:text-white hover:underline transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900 dark:focus-visible:ring-white rounded-xs"
                    >
                      Sign in
                    </button>
                  </>
                )}
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
