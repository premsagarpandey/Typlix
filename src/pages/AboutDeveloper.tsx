import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  Terminal,
  ShieldCheck,
  Zap,
  Keyboard,
  ArrowRight
} from 'lucide-react';
import { toast } from '../utils/toast';

// Custom SVG Icons matching exact brand guidelines
function LinkedInIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76c-.97 0-1.75-.79-1.75-1.76s.78-1.76 1.75-1.76 1.75.79 1.75 1.76-.78 1.76-1.75 1.76m1.39 9.74v-8.37H5.07v8.37h2.78z" />
    </svg>
  );
}

function InstagramIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export default function AboutDeveloper() {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const developerEmail = 'premsagarpandey.cs@gmail.com';
  const linkedinUrl = 'https://www.linkedin.com/in/prem-sagar-pandey-2b0022382/';
  const instagramUrl = 'https://www.instagram.com/premsagar__1/?hl=en';

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(developerEmail);
      setCopiedEmail(true);
      toast.success('Email copied to clipboard: ' + developerEmail);
      setTimeout(() => setCopiedEmail(false), 2500);
    } catch {
      toast.info('Email: ' + developerEmail);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6 sm:py-16 px-3 sm:px-4 animate-fade-in text-neutral-900 dark:text-neutral-100">

      {/* ── Top Badge / Intro ── */}
      <div className="flex items-center justify-center gap-2 mb-5 sm:mb-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-neutral-200/80 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700">
          <Sparkles className="w-3.5 h-3.5 text-neutral-700 dark:text-neutral-300" />
          The Creator Behind Typlix
        </span>
      </div>

      {/* ── Hero Profile Card ── */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 shadow-sm mb-8 sm:mb-10 text-center flex flex-col items-center">

        {/* Name and Designation */}
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100 mb-1.5">
          Prem Sagar Pandey
        </h1>
        <p className="text-xs sm:text-sm font-medium text-neutral-600 dark:text-neutral-400 max-w-md leading-relaxed mb-5 sm:mb-6">
          Founder, Architect &amp; Full Stack Software Engineer of <strong className="text-neutral-900 dark:text-neutral-200">Typlix</strong>.
        </p>

        {/* ── Social & Contact Buttons (Strictly matching Typlix theme) ── */}
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center gap-2.5 w-full max-w-lg">

          {/* 1. Email Button (Mailto + Copy Action) */}
          <div className="inline-flex rounded-lg border border-neutral-300 dark:border-neutral-700 overflow-hidden shadow-xs w-full sm:w-auto">
            <a
              href={`mailto:${developerEmail}`}
              aria-label="Send email to Prem Sagar Pandey"
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 py-2.5 bg-neutral-900 dark:bg-neutral-100 hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-neutral-900 text-xs sm:text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white"
            >
              <Mail className="w-4 h-4" />
              <span>Email Me</span>
            </a>
            <button
              type="button"
              onClick={handleCopyEmail}
              aria-label="Copy email address to clipboard"
              title="Copy Email"
              className="px-3 py-2.5 bg-neutral-800 dark:bg-neutral-200 hover:bg-neutral-700 dark:hover:bg-neutral-300 text-white dark:text-neutral-900 transition-colors border-l border-neutral-700 dark:border-neutral-300 cursor-pointer"
            >
              {copiedEmail ? <Check className="w-4 h-4 text-emerald-400 dark:text-emerald-700" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* 2. LinkedIn Button */}
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit Prem Sagar Pandey on LinkedIn"
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-neutral-800/80 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs sm:text-sm font-semibold rounded-lg shadow-xs transition-all active:scale-[0.98] w-full sm:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white cursor-pointer"
          >
            <LinkedInIcon className="w-4 h-4" />
            <span>LinkedIn</span>
            <ExternalLink className="w-3 h-3 text-neutral-500" />
          </a>

          {/* 3. Instagram Button */}
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit Prem Sagar Pandey on Instagram"
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-neutral-800/80 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs sm:text-sm font-semibold rounded-lg shadow-xs transition-all active:scale-[0.98] w-full sm:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white cursor-pointer"
          >
            <InstagramIcon className="w-4 h-4" />
            <span>Instagram</span>
            <ExternalLink className="w-3 h-3 text-neutral-500" />
          </a>
        </div>
      </div>

      {/* ── Why Typlix was Built (The Story & Vision) ── */}
      <div className="space-y-6 text-left mb-12">
        <div className="p-6 rounded-2xl bg-neutral-100/60 dark:bg-neutral-900/40 border border-neutral-200/80 dark:border-neutral-800">
          <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-3 flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-neutral-800 dark:text-neutral-200" />
            Why I Built Typlix
          </h2>
          <div className="space-y-3 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            <p>
              Most existing typing tutors on the internet are overloaded with intrusive ads, noisy animations, or paywalled lessons. I built <strong>Typlix</strong> with a clear, singular obsession: <em>create the cleanest, fastest, and most distraction-free typing trainer in the world.</em>
            </p>
            <p>
              Whether you are a <strong>student</strong> learning home row finger ergonomics, a candidate preparing for high-pressure <strong>government typing tests</strong> (SSC CGL, CHSL, RRB), or a <strong>software engineer</strong> typing code syntax in JavaScript and Python, Typlix is engineered to make muscle memory training feel natural, tactile, and rewarding.
            </p>
          </div>
        </div>

        {/* ── Engineering Highlights ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60">
            <Zap className="w-4 h-4 mb-2 text-neutral-800 dark:text-neutral-200" />
            <h3 className="font-semibold text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 mb-1">
              Zero Latency Audio
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Synthesized mechanical switch audio (Cherry MX Blue, Brown, Red, Thock) engineered with Web Audio API.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60">
            <ShieldCheck className="w-4 h-4 mb-2 text-neutral-800 dark:text-neutral-200" />
            <h3 className="font-semibold text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 mb-1">
              Privacy by Design
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Strict data minimization adhering to DPDP Act 2023. No third-party trackers, and full offline practice mode.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60">
            <Terminal className="w-4 h-4 mb-2 text-neutral-800 dark:text-neutral-200" />
            <h3 className="font-semibold text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 mb-1">
              Modern Tech Stack
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Crafted using React 19, TypeScript, Tailwind CSS, Vite, and Firebase Cloud Architecture.
            </p>
          </div>
        </div>
      </div>

      {/* ── Bottom CTA ── */}
      <div className="p-6 rounded-2xl bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-center flex flex-col items-center justify-center gap-3 shadow-md">
        <h3 className="text-base sm:text-lg font-bold">
          Ready to break your typing speed record?
        </h3>
        <p className="text-xs text-neutral-300 dark:text-neutral-700 max-w-sm">
          Jump into a 60-second speed test or start from Lesson 1 to hone your accuracy.
        </p>
        <Link
          to="/game"
          className="mt-1 inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white rounded-lg text-xs sm:text-sm font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors shadow-xs"
        >
          <span>Start Practice</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}
