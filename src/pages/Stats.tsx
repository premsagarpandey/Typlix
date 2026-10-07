import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { exportStatsAsCSV, exportDataAsJSON } from '../utils/dataBackup';
import WpmProgressChart, { type ChartFilter } from '../components/stats/WpmProgressChart';
import { useUserProgress } from '../hooks/useUserProgress';
import { useAuth } from '../hooks/useAuth';
import StudentReportModal from '../components/common/StudentReportModal';
import { X, FileSpreadsheet, Download, Code, Layers, BookOpen, Clock, ArrowRight, FileText } from 'lucide-react';

type StatsCategory = 'all' | 'general' | 'code';

function formatDuration(totalSeconds: number): string {
  if (!totalSeconds || totalSeconds <= 0) return '0m';
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${Math.max(1, minutes)}m`;
}

export default function Stats() {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState<StatsCategory>('all');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const { level: currentLevel, stats: sessions, summary } = useUserProgress();

  const codeCount = useMemo(() => sessions.filter((s) => s.mode === 'code').length, [sessions]);
  const generalCount = useMemo(() => sessions.filter((s) => s.mode !== 'code').length, [sessions]);

  // Filter sessions according to selected category
  const filteredSessions = useMemo(() => {
    if (activeCategory === 'code') {
      return sessions.filter((s) => s.mode === 'code');
    }
    if (activeCategory === 'general') {
      return sessions.filter((s) => s.mode !== 'code');
    }
    return sessions;
  }, [sessions, activeCategory]);

  // Reverse chronological order for history table
  const recentSessions = useMemo(() => {
    return [...filteredSessions].reverse();
  }, [filteredSessions]);

  // Summary statistics for current active category
  const categoryStats = useMemo(() => {
    const list = filteredSessions;
    const total = list.length;
    if (total === 0) {
      return {
        bestWpm: 0,
        avgAccuracy: 0,
        total: 0,
        totalTimeSeconds: 0,
      };
    }
    const bestWpm = Math.max(...list.map((s) => s.wpm || 0), 0);
    const avgAccuracy = Math.round(
      list.reduce((acc, s) => acc + (s.accuracy || 0), 0) / total
    );
    const totalTimeSeconds = list.reduce(
      (acc, s) => acc + (s.durationSeconds || 60),
      0
    );
    return {
      bestWpm,
      avgAccuracy,
      total,
      totalTimeSeconds,
    };
  }, [filteredSessions]);

  // Breakdown by programming language for Coding view
  const languageBreakdown = useMemo(() => {
    if (activeCategory !== 'code') return [];
    const codeSessions = sessions.filter((s) => s.mode === 'code');
    const map = new Map<string, { count: number; totalWpm: number; bestWpm: number; totalAcc: number }>();

    for (const s of codeSessions) {
      let lang = 'General';
      if (s.modeLabel && s.modeLabel.includes('·')) {
        lang = s.modeLabel.split('·')[1]?.trim() || 'General';
      } else if (s.modeLabel && s.modeLabel.toLowerCase().includes('code')) {
        lang = s.modeLabel.replace(/^Code\s*[-–—:]?\s*/i, '').trim() || 'General';
      }
      const existing = map.get(lang) || { count: 0, totalWpm: 0, bestWpm: 0, totalAcc: 0 };
      existing.count += 1;
      existing.totalWpm += s.wpm || 0;
      existing.bestWpm = Math.max(existing.bestWpm, s.wpm || 0);
      existing.totalAcc += s.accuracy || 0;
      map.set(lang, existing);
    }

    return Array.from(map.entries())
      .map(([lang, stat]) => ({
        lang,
        count: stat.count,
        bestWpm: stat.bestWpm,
        avgWpm: Math.round(stat.totalWpm / stat.count),
        avgAcc: Math.round(stat.totalAcc / stat.count),
      }))
      .sort((a, b) => b.count - a.count);
  }, [sessions, activeCategory]);

  const handleExportCSV = () => {
    try {
      exportStatsAsCSV();
      setFeedback('Stats exported to CSV!');
      setTimeout(() => setFeedback(null), 3000);
    } catch (e) {
      setFeedback((e as Error).message);
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const handleExportJSON = () => {
    try {
      exportDataAsJSON();
      setFeedback('Full backup exported to JSON!');
      setTimeout(() => setFeedback(null), 3000);
    } catch (e) {
      setFeedback((e as Error).message);
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const chartFilterProp: ChartFilter | undefined =
    activeCategory === 'code' ? 'code' : activeCategory === 'all' ? 'all' : undefined;

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">Statistics</h1>
          <p className="text-xs text-neutral-600 dark:text-neutral-400">Track your typing velocity, accuracy trends, and coding progress</p>
        </div>

        <div className="flex items-center gap-2">
          {sessions.length > 0 && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsReportModalOpen(true)}
                aria-label="View and download student progress report card"
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:opacity-90 transition-opacity cursor-pointer shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white"
                title="View & Download Student Report Card"
              >
                <FileText className="w-3.5 h-3.5" />
                Report Card
              </button>
              <button
                onClick={handleExportCSV}
                aria-label="Export recorded typing sessions as CSV spreadsheet"
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white"
                title="Export session data as CSV"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" aria-hidden="true" />
                CSV Export
              </button>
              <button
                onClick={handleExportJSON}
                aria-label="Export complete typing progress backup as JSON file"
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white"
                title="Export full JSON backup"
              >
                <Download className="w-3.5 h-3.5" aria-hidden="true" />
                JSON Backup
              </button>
            </div>
          )}
          <Link
            to={activeCategory === 'code' ? '/game?mode=code' : '/game'}
            aria-label="Go to typing practice arena"
            className="px-3 py-1.5 text-xs font-medium rounded-md bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white"
          >
            {activeCategory === 'code' ? 'Practice Code' : 'Practice'}
          </Link>
        </div>
      </div>

      {feedback && (
        <div className="p-2.5 text-xs rounded-md bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-medium animate-fade-in flex items-center justify-between">
          <span>{feedback}</span>
          <button
            onClick={() => setFeedback(null)}
            aria-label="Dismiss feedback message"
            className="cursor-pointer opacity-70 hover:opacity-100 p-1 rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white dark:focus-visible:ring-neutral-900"
          >
            <X className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      )}

      {/* Category Filter Tabs: All vs General vs Coding */}
      <div className="flex items-center gap-1 p-1 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs">
        <button
          type="button"
          onClick={() => setActiveCategory('all')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-md font-medium transition-all cursor-pointer ${
            activeCategory === 'all'
              ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>All Practice</span>
          <span className="text-[11px] opacity-70 font-mono">({sessions.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveCategory('general')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-md font-medium transition-all cursor-pointer ${
            activeCategory === 'general'
              ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>General Typing</span>
          <span className="text-[11px] opacity-70 font-mono">({generalCount})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveCategory('code')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-md font-medium transition-all cursor-pointer ${
            activeCategory === 'code'
              ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 shadow-xs font-semibold'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
          }`}
        >
          <Code className="w-3.5 h-3.5" />
          <span>Coding Typing</span>
          <span className="text-[11px] opacity-70 font-mono">({codeCount})</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-neutral-200 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
        <div className="p-4 bg-neutral-50 dark:bg-neutral-950">
          <div className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">
            {activeCategory === 'code' ? 'Code Best Speed' : activeCategory === 'general' ? 'General Best Speed' : 'Best Speed'}
          </div>
          <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-1 font-mono">
            {categoryStats.bestWpm} <span className="text-xs font-normal text-neutral-600 dark:text-neutral-400">wpm</span>
          </div>
        </div>

        <div className="p-4 bg-neutral-50 dark:bg-neutral-950">
          <div className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">
            {activeCategory === 'code' ? 'Code Avg Acc' : activeCategory === 'general' ? 'General Avg Acc' : 'Avg Accuracy'}
          </div>
          <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-1 font-mono">
            {categoryStats.avgAccuracy}<span className="text-xs font-normal text-neutral-600 dark:text-neutral-400">%</span>
          </div>
        </div>

        <div className="p-4 bg-neutral-50 dark:bg-neutral-950">
          <div className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">
            {activeCategory === 'code' ? 'Code Tests' : activeCategory === 'general' ? 'General Tests' : 'Tests Done'}
          </div>
          <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-1 font-mono">
            {categoryStats.total}
          </div>
        </div>

        <div className="p-4 bg-neutral-50 dark:bg-neutral-950">
          <div className="text-xs text-neutral-600 dark:text-neutral-400 font-medium flex items-center gap-1">
            {activeCategory === 'general' ? (
              'Lesson Level'
            ) : (
              <>
                <Clock className="w-3 h-3 text-neutral-500" />
                {activeCategory === 'code' ? 'Code Practice' : 'Total Practice'}
              </>
            )}
          </div>
          <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-1 font-mono">
            {activeCategory === 'general'
              ? currentLevel
              : formatDuration(categoryStats.totalTimeSeconds)}
          </div>
        </div>
      </div>

      {/* Language Breakdown for Code Mode */}
      {activeCategory === 'code' && languageBreakdown.length > 0 && (
        <div className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5" />
              Programming Languages Breakdown
            </h3>
            <span className="text-xs text-neutral-500 font-mono">
              {languageBreakdown.length} language{languageBreakdown.length > 1 ? 's' : ''} practiced
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {languageBreakdown.map((item) => (
              <div
                key={item.lang}
                className="p-3 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-semibold text-neutral-900 dark:text-neutral-100">
                    {item.lang}
                  </div>
                  <div className="text-[11px] text-neutral-500 mt-0.5 font-mono">
                    {item.count} {item.count === 1 ? 'test' : 'tests'}
                  </div>
                </div>
                <div className="text-right font-mono">
                  <div className="font-bold text-neutral-900 dark:text-neutral-100">
                    {item.bestWpm} <span className="text-[10px] font-normal text-neutral-500">wpm</span>
                  </div>
                  <div className="text-[10px] text-neutral-500">
                    {item.avgAcc}% acc
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* WPM Progress Chart */}
      <WpmProgressChart
        sessions={filteredSessions}
        activeFilter={chartFilterProp}
      />

      {/* Session History Table */}
      <div className="overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950">
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <h3 className="font-medium text-neutral-900 dark:text-neutral-100 text-sm">
            {activeCategory === 'code'
              ? 'Recent Coding Sessions'
              : activeCategory === 'general'
              ? 'Recent General Typing Sessions'
              : 'Recent Sessions'}
          </h3>
          <span className="text-xs text-neutral-600 dark:text-neutral-400 font-mono">{recentSessions.length} recorded</span>
        </div>

        {recentSessions.length === 0 ? (
          <div className="py-12 text-center text-neutral-600 dark:text-neutral-400 text-sm space-y-3 px-4">
            {activeCategory === 'code' ? (
              <>
                <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 flex items-center justify-center mx-auto text-neutral-900 dark:text-white">
                  <Code className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-neutral-900 dark:text-neutral-100">No coding sessions recorded yet</p>
                  <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1">
                    Practice code snippets in TypeScript, Python, C++, Java, and more to build programming syntax speed!
                  </p>
                </div>
                <Link
                  to="/game?mode=code"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:opacity-90 transition-opacity"
                >
                  <Code className="w-3.5 h-3.5" />
                  Start Coding Practice
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </>
            ) : (
              <>
                <p className="font-medium">No sessions yet in this category.</p>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                  Complete a typing test or lesson to start tracking progress.
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table aria-label="Recent typing sessions history" className="w-full text-left text-sm">
              <thead className="bg-neutral-100/80 dark:bg-neutral-900/80 text-xs uppercase font-medium text-neutral-600 dark:text-neutral-400 border-b border-neutral-200 dark:border-neutral-800">
                <tr>
                  <th className="py-3 px-4">Mode / Language</th>
                  <th className="py-3 px-4">Speed</th>
                  <th className="py-3 px-4">Accuracy</th>
                  <th className="py-3 px-4">Combo</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800/60">
                {recentSessions.map((session) => (
                  <tr key={session.id} className="hover:bg-neutral-100/50 dark:hover:bg-neutral-900/50 transition-colors">
                    <td className="py-3 px-4 font-medium text-neutral-900 dark:text-neutral-100 text-xs">
                      {session.mode === 'code' ? (
                        <span className="inline-flex items-center gap-1 font-mono text-[11px] px-1.5 py-0.5 rounded bg-neutral-200/80 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700">
                          <Code className="w-3 h-3" />
                          {session.modeLabel || 'Code'}
                        </span>
                      ) : (
                        session.modeLabel || (session.level > 0 ? `Level ${session.level}` : 'Practice')
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-neutral-700 dark:text-neutral-300 text-xs">
                      {session.wpm} wpm
                    </td>
                    <td className="py-3 px-4 font-mono text-neutral-700 dark:text-neutral-300 text-xs">
                      {session.accuracy}%
                    </td>
                    <td className="py-3 px-4 font-mono text-neutral-700 dark:text-neutral-300 text-xs">
                      {session.maxCombo}x
                    </td>
                    <td className="py-3 px-4 text-xs text-neutral-600 dark:text-neutral-400">
                      {session.date}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${
                          session.passed
                            ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                            : 'bg-neutral-100 dark:bg-neutral-800/50 text-neutral-600 dark:text-neutral-400'
                        }`}
                      >
                        {session.passed ? 'Passed' : 'Practice'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Student Progress Report Card Modal */}
      <StudentReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        user={user}
        level={currentLevel}
        sessions={sessions}
        summary={summary}
      />
    </div>
  );
}
