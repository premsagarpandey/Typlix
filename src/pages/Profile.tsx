import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useUserProgress } from '../hooks/useUserProgress';
import { LogOut, User, Mail, Calendar, Shield, Activity, TrendingUp, Trophy, RefreshCw, CheckCircle2, X, Code, ArrowRight, FileText } from 'lucide-react';
import UserAvatar from '../components/common/UserAvatar';
import StudentReportModal from '../components/common/StudentReportModal';

function formatDuration(totalSeconds: number): string {
  if (!totalSeconds || totalSeconds <= 0) return '0m';
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${Math.max(1, minutes)}m`;
}

export default function Profile() {
  const { user, logout } = useAuth();
  const { level, stats, summary, isSyncing, lastSyncedAt, syncNow } = useUserProgress();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  // Coding specific metrics
  const codeStats = useMemo(() => {
    const list = stats.filter((s) => s.mode === 'code');
    const total = list.length;
    if (total === 0) {
      return { total: 0, bestWpm: 0, avgAccuracy: 0, totalSeconds: 0, languages: [] as string[] };
    }
    const bestWpm = Math.max(...list.map((s) => s.wpm || 0), 0);
    const avgAccuracy = Math.round(list.reduce((acc, s) => acc + (s.accuracy || 0), 0) / total);
    const totalSeconds = list.reduce((acc, s) => acc + (s.durationSeconds || 60), 0);

    const languages = Array.from(
      new Set(
        list.map((s) => {
          if (s.modeLabel && s.modeLabel.includes('·')) {
            return s.modeLabel.split('·')[1]?.trim();
          }
          return 'Code';
        })
      )
    ).filter(Boolean) as string[];

    return { total, bestWpm, avgAccuracy, totalSeconds, languages };
  }, [stats]);

  // If user accesses /profile without logging in, render fallback prompt
  if (!user) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">Not Signed In</h2>
        <p className="text-sm text-neutral-500">Please sign in to view your profile and sync your progress.</p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 mt-4 text-sm font-medium rounded-md bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 transition-opacity hover:opacity-90 cursor-pointer"
        >
          Go Home
        </button>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed', error);
      setIsLoggingOut(false);
    }
  };

  const handleManualSync = async () => {
    try {
      await syncNow();
      setSyncFeedback('All progress synced with Firestore!');
      setTimeout(() => setSyncFeedback(null), 3500);
    } catch {
      setSyncFeedback('Sync failed. Please check connection.');
      setTimeout(() => setSyncFeedback(null), 3500);
    }
  };

  const getCreationDate = () => {
    if (user.metadata.creationTime) {
      return new Date(user.metadata.creationTime).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    return 'Unknown';
  };

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">User Profile</h1>
        <p className="text-xs text-neutral-500 mt-1">Manage your cloud account and view lifetime statistics</p>
      </div>

      {syncFeedback && (
        <div className="p-3 text-xs rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 font-medium flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-neutral-900 dark:text-white" aria-hidden="true" />
            <span>{syncFeedback}</span>
          </div>
          <button
            onClick={() => setSyncFeedback(null)}
            aria-label="Dismiss feedback message"
            className="cursor-pointer opacity-70 hover:opacity-100 p-1 rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900 dark:focus-visible:ring-white"
          >
            <X className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      )}

      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50/50 dark:bg-neutral-900/20">
        <UserAvatar
          photoURL={user.photoURL}
          name={user.displayName}
          email={user.email}
          size="xl"
          className="shadow-sm"
          alt="Your profile avatar"
        />
        <div className="flex-1 space-y-4 text-center sm:text-left">
          <div>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
              {user.displayName || user.email?.split('@')[0] || 'Typist'}
            </h3>
            <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-4 mt-1 text-sm text-neutral-600 dark:text-neutral-400">
              <span className="flex items-center justify-center sm:justify-start gap-1.5"><Mail className="w-4 h-4" aria-hidden="true" /> {user.email}</span>
              <span className="hidden sm:inline text-neutral-300 dark:text-neutral-700" aria-hidden="true">•</span>
              <span className="flex items-center justify-center sm:justify-start gap-1.5"><Calendar className="w-4 h-4" aria-hidden="true" /> Joined {getCreationDate()}</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="px-2.5 py-1 text-[11px] font-medium rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-neutral-800 dark:text-neutral-200" aria-hidden="true" /> Firestore Cloud Synced
            </span>
            <button
              onClick={() => setIsReportModalOpen(true)}
              aria-label="Generate official student progress report card"
              className="px-2.5 py-1 text-[11px] font-medium rounded-md bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 flex items-center gap-1.5 hover:opacity-90 transition-opacity cursor-pointer shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white"
              title="View and download student progress report card"
            >
              <FileText className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Report Card</span>
            </button>
            <button
              onClick={handleManualSync}
              disabled={isSyncing}
              aria-label="Sync latest local typing progress with Firestore cloud"
              className="px-2.5 py-1 text-[11px] font-medium rounded-md border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white"
              title="Sync latest local progress with Firestore"
            >
              <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin text-neutral-900 dark:text-white' : ''}`} aria-hidden="true" />
              <span>{isSyncing ? 'Syncing...' : lastSyncedAt ? 'Synced' : 'Sync Now'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Lifetime Stats */}
      <div>
        <h3 className="font-medium text-neutral-900 dark:text-neutral-100 text-sm mb-3">Lifetime Statistics</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-neutral-200 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
          <div className="p-4 bg-neutral-50 dark:bg-neutral-950 flex flex-col items-center justify-center text-center">
            <TrendingUp className="w-5 h-5 text-neutral-500 dark:text-neutral-400 mb-2" aria-hidden="true" />
            <div className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">Best WPM</div>
            <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-0.5 font-mono">
              {summary.bestWpm}
            </div>
          </div>

          <div className="p-4 bg-neutral-50 dark:bg-neutral-950 flex flex-col items-center justify-center text-center">
            <Activity className="w-5 h-5 text-neutral-500 dark:text-neutral-400 mb-2" aria-hidden="true" />
            <div className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">Avg Accuracy</div>
            <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-0.5 font-mono">
              {summary.avgAccuracy}<span className="text-sm font-normal text-neutral-600 dark:text-neutral-400">%</span>
            </div>
          </div>

          <div className="p-4 bg-neutral-50 dark:bg-neutral-950 flex flex-col items-center justify-center text-center">
            <User className="w-5 h-5 text-neutral-500 dark:text-neutral-400 mb-2" aria-hidden="true" />
            <div className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">Total Tests</div>
            <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-0.5 font-mono">
              {summary.totalTests}
            </div>
          </div>

          <div className="p-4 bg-neutral-50 dark:bg-neutral-950 flex flex-col items-center justify-center text-center">
            <Trophy className="w-5 h-5 text-neutral-500 dark:text-neutral-400 mb-2" aria-hidden="true" />
            <div className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">Current Level</div>
            <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-0.5 font-mono">
              {level}
            </div>
          </div>
        </div>
      </div>

      {/* Coding Typing Proficiency Card */}
      <div className="p-5 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50/50 dark:bg-neutral-900/20 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-md bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900">
              <Code className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">Coding Proficiency</h3>
              <p className="text-xs text-neutral-500">Programming syntax speed & accuracy</p>
            </div>
          </div>
          <Link
            to="/stats"
            className="text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 flex items-center gap-1"
          >
            Detailed Stats <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {codeStats.total > 0 ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              <div className="p-3 rounded-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                <div className="text-[11px] text-neutral-500 font-medium">Best Speed</div>
                <div className="text-lg font-bold font-mono text-neutral-900 dark:text-neutral-100 mt-0.5">
                  {codeStats.bestWpm} <span className="text-[11px] font-normal text-neutral-500">wpm</span>
                </div>
              </div>
              <div className="p-3 rounded-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                <div className="text-[11px] text-neutral-500 font-medium">Avg Accuracy</div>
                <div className="text-lg font-bold font-mono text-neutral-900 dark:text-neutral-100 mt-0.5">
                  {codeStats.avgAccuracy}%
                </div>
              </div>
              <div className="p-3 rounded-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                <div className="text-[11px] text-neutral-500 font-medium">Code Tests</div>
                <div className="text-lg font-bold font-mono text-neutral-900 dark:text-neutral-100 mt-0.5">
                  {codeStats.total}
                </div>
              </div>
              <div className="p-3 rounded-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                <div className="text-[11px] text-neutral-500 font-medium">Practice Time</div>
                <div className="text-lg font-bold font-mono text-neutral-900 dark:text-neutral-100 mt-0.5">
                  {formatDuration(codeStats.totalSeconds)}
                </div>
              </div>
            </div>

            {codeStats.languages.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
                <span className="text-neutral-500 text-[11px] font-medium mr-1">Languages:</span>
                {codeStats.languages.map((lang) => (
                  <span
                    key={lang}
                    className="px-2 py-0.5 rounded text-[11px] font-mono bg-neutral-200/70 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 rounded-md bg-white dark:bg-neutral-900 border border-dashed border-neutral-300 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div>
              <p className="text-xs font-medium text-neutral-900 dark:text-neutral-100">No coding sessions completed yet</p>
              <p className="text-[11px] text-neutral-500 mt-0.5">Practice programming syntax in TypeScript, Python, C++, Java, and more.</p>
            </div>
            <Link
              to="/game?mode=code"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:opacity-90 shrink-0"
            >
              <Code className="w-3.5 h-3.5" />
              Practice Code
            </Link>
          </div>
        )}
      </div>

      {/* Account Settings / Log Out */}
      <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
        <h3 className="font-medium text-neutral-900 dark:text-neutral-100 text-sm mb-3">Account Actions</h3>
        <div className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Sign Out</div>
            <div className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">End your current session on this device.</div>
          </div>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            aria-label="Sign out of your account on this device"
            className="flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 hover:text-neutral-950 dark:hover:text-white hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors cursor-pointer disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white"
          >
            <LogOut className="w-4 h-4" aria-hidden="true" />
            <span>{isLoggingOut ? 'Signing out...' : 'Sign Out'}</span>
          </button>
        </div>
      </div>

      {/* Student Progress Report Card Modal */}
      <StudentReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        user={user}
        level={level}
        sessions={stats}
        summary={summary}
      />
    </div>
  );
}
