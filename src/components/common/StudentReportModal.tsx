import { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Printer,
  Download,
  Copy,
  Check,
  FileText,
  Code,
  ShieldCheck,
  Layers,
} from 'lucide-react';
import type { TypingSessionRecord } from '../../utils/secureStorage';

interface StudentReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: {
    displayName?: string | null;
    email?: string | null;
    photoURL?: string | null;
    uid?: string;
  } | null;
  level: number;
  sessions: TypingSessionRecord[];
  summary: {
    bestWpm: number;
    avgAccuracy: number;
    totalTests: number;
  };
}

function formatDuration(totalSeconds: number): string {
  if (!totalSeconds || totalSeconds <= 0) return '0m';
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${Math.max(1, minutes)}m`;
}

export default function StudentReportModal({
  isOpen,
  onClose,
  user,
  level,
  sessions,
  summary,
}: StudentReportModalProps) {
  const [copied, setCopied] = useState(false);

  // General typing sessions (non-code)
  const generalSessions = useMemo(() => sessions.filter((s) => s.mode !== 'code'), [sessions]);
  const generalBestWpm = useMemo(
    () => (generalSessions.length ? Math.max(...generalSessions.map((s) => s.wpm || 0), 0) : 0),
    [generalSessions]
  );
  const generalAvgAcc = useMemo(
    () =>
      generalSessions.length
        ? Math.round(generalSessions.reduce((a, s) => a + (s.accuracy || 0), 0) / generalSessions.length)
        : 0,
    [generalSessions]
  );
  const generalTimeSeconds = useMemo(
    () => generalSessions.reduce((a, s) => a + (s.durationSeconds || 60), 0),
    [generalSessions]
  );

  // Coding typing sessions
  const codeSessions = useMemo(() => sessions.filter((s) => s.mode === 'code'), [sessions]);
  const codeBestWpm = useMemo(
    () => (codeSessions.length ? Math.max(...codeSessions.map((s) => s.wpm || 0), 0) : 0),
    [codeSessions]
  );
  const codeAvgAcc = useMemo(
    () =>
      codeSessions.length
        ? Math.round(codeSessions.reduce((a, s) => a + (s.accuracy || 0), 0) / codeSessions.length)
        : 0,
    [codeSessions]
  );
  const codeTimeSeconds = useMemo(
    () => codeSessions.reduce((a, s) => a + (s.durationSeconds || 60), 0),
    [codeSessions]
  );

  // Languages practiced
  const languagesList = useMemo(() => {
    const langs = new Set<string>();
    for (const s of codeSessions) {
      if (s.modeLabel && s.modeLabel.includes('·')) {
        langs.add(s.modeLabel.split('·')[1]?.trim());
      } else if (s.modeLabel && s.modeLabel.toLowerCase().includes('code')) {
        langs.add(s.modeLabel.replace(/^Code\s*[-–—:]?\s*/i, '').trim());
      } else {
        langs.add('General Code');
      }
    }
    return Array.from(langs).filter(Boolean);
  }, [codeSessions]);

  // Overall totals
  const totalPracticeSeconds = useMemo(
    () => sessions.reduce((a, s) => a + (s.durationSeconds || 60), 0),
    [sessions]
  );

  // Recent 8 sessions
  const recentSessions = useMemo(() => [...sessions].reverse().slice(0, 8), [sessions]);

  // Student identifier & generation metadata
  const studentName = user?.displayName || user?.email?.split('@')[0] || 'Typlix Student';
  const studentEmail = user?.email || 'Local / Guest Practice Profile';
  const reportDate = useMemo(
    () =>
      new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
    []
  );

  const reportId = useMemo(() => {
    const raw = user?.uid ? user.uid.substring(0, 6) : Date.now().toString(36).substring(2, 8);
    return `TYP-${raw.toUpperCase()}`;
  }, [user]);

  if (!isOpen) return null;

  // Print function (triggers standard print-to-pdf)
  const handlePrint = () => {
    window.print();
  };

  // Copy text summary to clipboard for WhatsApp / Email submission
  const handleCopySummary = async () => {
    const text = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 TYPLIX STUDENT TYPING REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Student: ${studentName}
Email: ${studentEmail}
Date: ${reportDate} | Ref: ${reportId}
Current Level: Level ${level}

⌨️ GENERAL TYPING:
• Best Speed: ${generalBestWpm} WPM
• Avg Accuracy: ${generalAvgAcc}%
• Tests Completed: ${generalSessions.length}
• Practice Time: ${formatDuration(generalTimeSeconds)}

💻 CODING TYPING:
• Best Speed: ${codeBestWpm} WPM
• Avg Accuracy: ${codeAvgAcc}%
• Code Tests: ${codeSessions.length}
• Languages: ${languagesList.join(', ') || 'None yet'}
• Code Time: ${formatDuration(codeTimeSeconds)}

🏆 LIFETIME TOTALS:
• Overall Best Speed: ${summary.bestWpm} WPM
• Overall Avg Accuracy: ${summary.avgAccuracy}%
• Total Tests: ${sessions.length}
• Total Practice Time: ${formatDuration(totalPracticeSeconds)}

Verified on Typlix Touch Typing Platform (https://typlix.web.app)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error('Clipboard copy failed', e);
    }
  };

  // Download standalone HTML report file
  const handleDownloadHtml = () => {
    const recentRowsHtml = recentSessions
      .map(
        (s) => `<tr>
          <td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0; font-size: 12px;">${s.modeLabel || (s.level > 0 ? 'Level ' + s.level : 'Practice')}</td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0; font-size: 12px; font-weight: bold; font-family: monospace;">${s.wpm} wpm</td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0; font-size: 12px; font-family: monospace;">${s.accuracy}%</td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">${s.date}</td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0; font-size: 12px; text-align: right; color: ${s.passed ? '#059669' : '#64748b'};">${s.passed ? 'Passed' : 'Practice'}</td>
        </tr>`
      )
      .join('');

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Typlix Student Report - ${studentName}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f8fafc; color: #0f172a; padding: 32px 16px; margin: 0; }
    .container { max-width: 760px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
    .header { display: flex; justify-content: space-between; border-bottom: 2px solid #0f172a; padding-bottom: 16px; margin-bottom: 24px; }
    .logo { font-size: 20px; font-weight: 800; letter-spacing: 1px; color: #0f172a; }
    .badge { display: inline-block; padding: 4px 10px; background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 11px; font-weight: 600; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
    .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; }
    .card-title { font-size: 12px; font-weight: 700; text-transform: uppercase; color: #475569; margin-bottom: 8px; }
    .stat-row { display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 13px; }
    .stat-val { font-weight: 700; font-family: monospace; }
    table { width: 100%; border-collapse: collapse; margin-top: 12px; }
    th { text-align: left; padding: 8px 12px; background: #f1f5f9; font-size: 11px; text-transform: uppercase; color: #475569; }
    .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #64748b; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div>
        <div class="logo">TYPLIX</div>
        <div style="font-size: 12px; color: #64748b; margin-top: 2px;">Official Student Performance Record</div>
      </div>
      <div style="text-align: right;">
        <span class="badge">Verified Training Record</span>
        <div style="font-size: 11px; color: #64748b; margin-top: 4px;">Date: ${reportDate} · Ref: ${reportId}</div>
      </div>
    </div>

    <div style="margin-bottom: 24px; padding: 14px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; display: flex; justify-content: space-between;">
      <div>
        <div style="font-size: 16px; font-weight: 700;">${studentName}</div>
        <div style="font-size: 12px; color: #64748b;">${studentEmail}</div>
      </div>
      <div style="text-align: right;">
        <div style="font-size: 12px; color: #64748b;">Current Level</div>
        <div style="font-size: 18px; font-weight: 800; font-family: monospace;">Level ${level}</div>
      </div>
    </div>

    <div class="grid">
      <div class="card">
        <div class="card-title">⌨️ General Typing Mastery</div>
        <div class="stat-row"><span>Best Speed:</span><span class="stat-val">${generalBestWpm} WPM</span></div>
        <div class="stat-row"><span>Average Accuracy:</span><span class="stat-val">${generalAvgAcc}%</span></div>
        <div class="stat-row"><span>Tests Completed:</span><span class="stat-val">${generalSessions.length}</span></div>
        <div class="stat-row"><span>Practice Time:</span><span class="stat-val">${formatDuration(generalTimeSeconds)}</span></div>
      </div>

      <div class="card">
        <div class="card-title">💻 Coding Typing Proficiency</div>
        <div class="stat-row"><span>Coding Best Speed:</span><span class="stat-val">${codeBestWpm} WPM</span></div>
        <div class="stat-row"><span>Average Accuracy:</span><span class="stat-val">${codeAvgAcc}%</span></div>
        <div class="stat-row"><span>Coding Tests:</span><span class="stat-val">${codeSessions.length}</span></div>
        <div class="stat-row"><span>Code Practice Time:</span><span class="stat-val">${formatDuration(codeTimeSeconds)}</span></div>
        ${languagesList.length ? `<div style="font-size: 11px; color: #64748b; margin-top: 8px;">Languages: ${languagesList.join(', ')}</div>` : ''}
      </div>
    </div>

    <div class="card" style="margin-bottom: 24px; background: #0f172a; color: #ffffff;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; opacity: 0.8;">Total Training Duration</div>
          <div style="font-size: 22px; font-weight: 800; font-family: monospace;">${formatDuration(totalPracticeSeconds)}</div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; opacity: 0.8;">Overall Best WPM</div>
          <div style="font-size: 22px; font-weight: 800; font-family: monospace;">${summary.bestWpm} WPM</div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; opacity: 0.8;">Total Tests</div>
          <div style="font-size: 22px; font-weight: 800; font-family: monospace;">${sessions.length}</div>
        </div>
      </div>
    </div>

    <div style="margin-bottom: 24px;">
      <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: #475569; margin-bottom: 8px;">Recent Practice Sessions</div>
      <table>
        <thead>
          <tr>
            <th>Mode</th>
            <th>Speed</th>
            <th>Accuracy</th>
            <th>Date</th>
            <th style="text-align: right;">Result</th>
          </tr>
        </thead>
        <tbody>
          ${recentRowsHtml || '<tr><td colspan="5" style="padding: 12px; text-align: center; color: #64748b;">No session logs recorded.</td></tr>'}
        </tbody>
      </table>
    </div>

    <div class="footer">
      This document certifies touch typing practice on Typlix (https://typlix.web.app). Validated with local storage and cloud synchronization.
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `typlix-student-report-${studentName.toLowerCase().replace(/\s+/g, '-')}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fade-in"
    >
      <div className="relative w-full max-w-2xl bg-white dark:bg-neutral-950 rounded-xl border border-neutral-300 dark:border-neutral-800 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Top Bar (Hidden in Print) */}
        <div className="no-print p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-2 bg-neutral-50 dark:bg-neutral-900/50 shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-neutral-900 dark:text-neutral-100" />
            <h2 id="report-modal-title" className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              Student Progress Report Card
            </h2>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrint}
              aria-label="Print or save report card as PDF"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
              title="Print / Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Save PDF / Print</span>
            </button>

            <button
              onClick={handleDownloadHtml}
              aria-label="Download standalone HTML report"
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
              title="Download standalone HTML file"
            >
              <Download className="w-3.5 h-3.5" />
              <span>HTML</span>
            </button>

            <button
              onClick={handleCopySummary}
              aria-label="Copy text summary for WhatsApp or email"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
              title="Copy text summary"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>

            <button
              onClick={onClose}
              aria-label="Close report card modal"
              className="p-1.5 rounded-md text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors cursor-pointer ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Report Card Document Area */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
          <div
            id="typlix-printable-report"
            className="p-6 sm:p-8 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 text-neutral-900 dark:text-neutral-100 space-y-6"
          >
            {/* Report Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b-2 border-neutral-900 dark:border-neutral-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-extrabold tracking-wider font-mono">TYPLIX</span>
                  <span className="text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700">
                    Touch Typing Platform
                  </span>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  Official Student Typing & Coding Progress Record
                </p>
              </div>

              <div className="sm:text-right text-xs">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified Training Log
                </span>
                <div className="text-[11px] text-neutral-500 font-mono mt-1">
                  Issued: {reportDate} · Ref: {reportId}
                </div>
              </div>
            </div>

            {/* Student Info Box */}
            <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 flex items-center justify-center font-bold text-sm shrink-0">
                  {studentName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">{studentName}</h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">{studentEmail}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-neutral-200 dark:border-neutral-700">
                <div>
                  <div className="text-[10px] uppercase font-semibold text-neutral-500">Current Level</div>
                  <div className="text-base font-bold font-mono text-neutral-900 dark:text-neutral-100">
                    Level {level}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-semibold text-neutral-500">Total Practice</div>
                  <div className="text-base font-bold font-mono text-neutral-900 dark:text-neutral-100">
                    {formatDuration(totalPracticeSeconds)}
                  </div>
                </div>
              </div>
            </div>

            {/* 2-Column Mastery Breakdown: General vs Coding */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* General Typing Box */}
              <div className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-2">
                  <div className="flex items-center gap-1.5 font-semibold text-xs text-neutral-900 dark:text-neutral-100 uppercase tracking-wide">
                    <Layers className="w-3.5 h-3.5 text-neutral-500" />
                    General Typing Mastery
                  </div>
                  <span className="text-[10px] text-neutral-500 font-mono">
                    {generalSessions.length} sessions
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                    <div className="text-[10px] text-neutral-500">Best Speed</div>
                    <div className="text-sm font-bold font-mono text-neutral-900 dark:text-neutral-100 mt-0.5">
                      {generalBestWpm} <span className="text-[10px] font-normal text-neutral-500">wpm</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                    <div className="text-[10px] text-neutral-500">Avg Accuracy</div>
                    <div className="text-sm font-bold font-mono text-neutral-900 dark:text-neutral-100 mt-0.5">
                      {generalAvgAcc}%
                    </div>
                  </div>

                  <div className="p-2.5 rounded bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                    <div className="text-[10px] text-neutral-500">Tests Done</div>
                    <div className="text-sm font-bold font-mono text-neutral-900 dark:text-neutral-100 mt-0.5">
                      {generalSessions.length}
                    </div>
                  </div>

                  <div className="p-2.5 rounded bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                    <div className="text-[10px] text-neutral-500">Practice Time</div>
                    <div className="text-sm font-bold font-mono text-neutral-900 dark:text-neutral-100 mt-0.5">
                      {formatDuration(generalTimeSeconds)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Coding Typing Box */}
              <div className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-2">
                  <div className="flex items-center gap-1.5 font-semibold text-xs text-neutral-900 dark:text-neutral-100 uppercase tracking-wide">
                    <Code className="w-3.5 h-3.5 text-neutral-500" />
                    Coding Proficiency
                  </div>
                  <span className="text-[10px] text-neutral-500 font-mono">
                    {codeSessions.length} sessions
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                    <div className="text-[10px] text-neutral-500">Coding Best</div>
                    <div className="text-sm font-bold font-mono text-neutral-900 dark:text-neutral-100 mt-0.5">
                      {codeBestWpm} <span className="text-[10px] font-normal text-neutral-500">wpm</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                    <div className="text-[10px] text-neutral-500">Coding Accuracy</div>
                    <div className="text-sm font-bold font-mono text-neutral-900 dark:text-neutral-100 mt-0.5">
                      {codeAvgAcc}%
                    </div>
                  </div>

                  <div className="p-2.5 rounded bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                    <div className="text-[10px] text-neutral-500">Code Tests</div>
                    <div className="text-sm font-bold font-mono text-neutral-900 dark:text-neutral-100 mt-0.5">
                      {codeSessions.length}
                    </div>
                  </div>

                  <div className="p-2.5 rounded bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                    <div className="text-[10px] text-neutral-500">Code Time</div>
                    <div className="text-sm font-bold font-mono text-neutral-900 dark:text-neutral-100 mt-0.5">
                      {formatDuration(codeTimeSeconds)}
                    </div>
                  </div>
                </div>

                {languagesList.length > 0 && (
                  <div className="pt-1 text-[11px] text-neutral-500">
                    <span className="font-semibold text-neutral-700 dark:text-neutral-300">Languages: </span>
                    {languagesList.join(', ')}
                  </div>
                )}
              </div>
            </div>

            {/* Lifetime Aggregate Banner */}
            <div className="p-4 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 flex items-center justify-between text-center sm:text-left">
              <div>
                <div className="text-[10px] uppercase font-bold tracking-wider opacity-75">Overall Best Speed</div>
                <div className="text-xl font-extrabold font-mono mt-0.5">{summary.bestWpm} WPM</div>
              </div>
              <div className="border-l border-white/20 dark:border-black/20 pl-4 sm:pl-6">
                <div className="text-[10px] uppercase font-bold tracking-wider opacity-75">Avg Accuracy</div>
                <div className="text-xl font-extrabold font-mono mt-0.5">{summary.avgAccuracy}%</div>
              </div>
              <div className="border-l border-white/20 dark:border-black/20 pl-4 sm:pl-6">
                <div className="text-[10px] uppercase font-bold tracking-wider opacity-75">Total Tests Done</div>
                <div className="text-xl font-extrabold font-mono mt-0.5">{sessions.length}</div>
              </div>
            </div>

            {/* Recent Verified Sessions Table */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                  Recent Verified Practice Sessions
                </h4>
                <span className="text-[10px] text-neutral-500 font-mono">Last {recentSessions.length} records</span>
              </div>

              {recentSessions.length === 0 ? (
                <div className="p-4 rounded border border-neutral-200 dark:border-neutral-800 text-center text-xs text-neutral-500">
                  No practice sessions recorded yet.
                </div>
              ) : (
                <div className="overflow-x-auto rounded border border-neutral-200 dark:border-neutral-800">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-neutral-100 dark:bg-neutral-800/80 uppercase text-[10px] text-neutral-500 font-medium">
                      <tr>
                        <th className="py-2 px-3">Mode / Snippet</th>
                        <th className="py-2 px-3">Speed</th>
                        <th className="py-2 px-3">Accuracy</th>
                        <th className="py-2 px-3">Date</th>
                        <th className="py-2 px-3 text-right">Result</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                      {recentSessions.map((s) => (
                        <tr key={s.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/40">
                          <td className="py-2 px-3 font-medium text-neutral-900 dark:text-neutral-100">
                            {s.modeLabel || (s.level > 0 ? `Level ${s.level}` : 'Practice')}
                          </td>
                          <td className="py-2 px-3 font-mono font-bold">{s.wpm} wpm</td>
                          <td className="py-2 px-3 font-mono">{s.accuracy}%</td>
                          <td className="py-2 px-3 text-neutral-500">{s.date}</td>
                          <td className="py-2 px-3 text-right">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                                s.passed
                                  ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                                  : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                              }`}
                            >
                              {s.passed ? 'Passed' : 'Practice'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Verification Footer & Sign-off */}
            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-neutral-500">
              <div className="text-center sm:text-left">
                <span>Verified Touch Typing & Programming Training Record · </span>
                <span className="font-mono text-neutral-700 dark:text-neutral-300">typlix.web.app</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-[10px] text-neutral-400">
                <span>SEAL: {reportId}</span>
                <span>•</span>
                <span>STATUS: VERIFIED</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
