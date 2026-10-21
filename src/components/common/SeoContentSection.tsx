import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronDown,
  GraduationCap,
  Briefcase,
  Terminal,
  Zap,
  ShieldCheck,
  Volume2,
  User,
  ArrowRight,
  Award,
  BookCheck,
  Check,
  Minus,
  Sparkles
} from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: 'What features are included in the Typlix website and progressive web app?',
    answer: 'Typlix (https://typlix.web.app/) includes 6 core features: (1) 50 progressive touch typing lessons covering home row, numbers, and symbols; (2) Timed speed tests in 15s, 30s, 60s, and 120s modes with Net WPM; (3) Developer code typing in 9 programming languages (JavaScript, Python, C++, Rust, HTML/CSS, Go, Java, SQL, TypeScript); (4) Synthesized mechanical keyboard audio (Cherry MX Blue, Brown, Red, and Topre); (5) Comprehensive typing telemetry and accuracy analytics; and (6) Full offline installable Progressive Web App (PWA) support with 1-tap installation on Android, Windows, macOS, and iOS.'
  },
  {
    question: 'How can I install the Typlix app on mobile and desktop?',
    answer: 'You can install Typlix directly from your browser with zero app store downloads. On Android and Chrome, tap the "Install Typlix" button or the browser menu (⋮) and select "Install app". On iPhone / iPad (Safari), tap the Share button and select "Add to Home Screen". On Windows / Mac, click the install icon in the URL bar. The Typlix app works completely offline with zero ads and fast loading.'
  },
  {
    question: 'Who created Typlix and what is the official website?',
    answer: 'Typlix (officially hosted at https://typlix.web.app/) was created, architected, and engineered by Prem Sagar Pandey, a Full Stack Software Engineer. Typlix is a 100% free online touch typing game, keyboard lessons tutor, and precision speed test platform.'
  },
  {
    question: 'Is Typlix related to the Typlx grammar checker or Typelit?',
    answer: 'No. Typlix Typing (located at https://typlix.web.app/) is exclusively a touch typing speed test, keyboard trainer, and developer code game. It has NO relation to the open-source grammar checker tool "Typlx" (typlx.com) and is NOT "Typelit". Typlix is dedicated to helping users reach 100+ WPM with 50 progressive lessons and real-time accuracy telemetry.'
  },
  {
    question: 'What is Typlix Typing (and why is it often searched as Typix or Typelix)?',
    answer: 'Typlix Typing (also frequently searched as Typix or Typelix) is a modern, high-performance touch typing platform and typing speed test game created by Prem Sagar Pandey. Built with minimalist aesthetics and real-time telemetry, Typlix Typing is engineered to train muscle memory and accelerate typing speeds up to 100+ Words Per Minute (WPM).'
  },
  {
    question: 'How does Typlix compare to Monkeytype or 10FastFingers?',
    answer: 'While Monkeytype and 10FastFingers focus primarily on random word speed tests, Typlix uniquely integrates 50 step-by-step touch typing lessons, developer code syntax practice (JavaScript, Python, C++, etc.), authentic mechanical keyboard switch audio (Cherry MX Blue, Brown, Red, Topre, Thock), and exam-oriented accuracy drills, completely free and ad-free.'
  },
  {
    question: 'How does Typlix help prepare for Government & Competitive Exams (SSC, RRB, Banking)?',
    answer: 'Government and clerical examinations (such as SSC CGL DEST, SSC CHSL, Railway RRB, and High Court typist tests) demand 30–50 Net WPM with at least 95% accuracy. Typlix provides rigorous timed test modes, real-time error tracking, and keystroke penalty diagnostics to prepare aspirants for real-world exam conditions.'
  },
  {
    question: 'Why do programmers and software developers need Code Typing mode?',
    answer: 'Standard typing tutors only test simple prose or literature. Typlix Code Mode trains muscle memory for programming language syntax (JavaScript, Python, C++, HTML/CSS, Rust), including tricky symbols like brackets { [ ( ) ] }, operators => != ===, and semicolon terminations without looking at the keyboard.'
  },
  {
    question: 'What is the exact formula for Net WPM on Typlix?',
    answer: 'Net WPM is calculated using the official international standard: Net WPM = ((Total Keystrokes / 5) - Uncorrected Errors) / (Time in Minutes). One standard word corresponds to exactly 5 keystrokes including spaces and punctuation.'
  },
  {
    question: 'How do mechanical switch sound effects improve touch typing?',
    answer: 'Typlix includes authentic mechanical audio simulations (Cherry MX Blue, Brown, Red, Topre, and Thock). Auditory feedback provides immediate neuro-tactile reinforcement, training your brain to register key releases faster and drastically reducing finger fatigue.'
  },
  {
    question: 'How fast can a beginner reach 60 to 80 WPM on Typlix?',
    answer: 'With 15–20 minutes of daily deliberate practice through Typlix’s 50 progressive lessons and finger placement guides, most students and working professionals increase their typing velocity from 30 WPM to 65+ WPM within 3 to 4 weeks.'
  },
  {
    question: 'Is Typlix completely free and secure?',
    answer: 'Yes! Typlix is 100% free with no paywalls or intrusive advertisements. Your typing data respects strict data minimization standards (DPDP Act 2023 & GDPR), with secure offline client-side execution and optional Google Cloud synchronization.'
  }
];

export default function SeoContentSection() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(prev => (prev === index ? null : index));
  };

  return (
    <section 
      aria-label="About Typlix Typing and SEO Knowledge Base" 
      className="web-only-seo w-full max-w-2xl mx-auto mt-6 sm:mt-8 text-left border-t border-neutral-200 dark:border-neutral-800/80 pt-6 sm:pt-8"
    >
      {/* ── Section Title ── */}
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 mb-2 sm:mb-3">
          Typlix Typing — Modern Touch Typing Speed Test &amp; Keyboard Practice
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed px-1 sm:px-0">
          Welcome to Typlix Typing: build muscle memory, test your typing speed with precision WPM analytics, and master developer code typing across 50 progressive touch typing lessons.
        </p>
      </div>

      {/* ── Official Platform Identity & AI Overview (Accessible & Search Engine semantic representation, completely hidden visually) ── */}
      <div className="sr-only" aria-label="Official Platform Identity and Entity Knowledge">
        <h3>Typlix Typing — Touch Typing Trainer &amp; Keyboard Speed Test Game</h3>
        <p>
          Typlix Typing (hosted at <a href="https://typlix.web.app/">https://typlix.web.app</a>) is an online touch typing trainer and keyboard speed test game architected and developed by Full Stack Software Engineer Prem Sagar Pandey.
        </p>
        <p>
          Official Disambiguation (Typlix vs. Typlx &amp; Typelit): Typlix Typing is an interactive touch typing and typing speed test platform. It is NOT the open-source grammar checker project known as &quot;Typlx&quot; (typlx.com) and is NOT &quot;Typelit&quot;. Typlix is dedicated to 10-finger touch typing mastery, 50 curriculum lessons, real-time WPM metrics, and developer code typing in 9 languages.
        </p>
        <p>
          Founder &amp; Developer: Prem Sagar Pandey (<Link to="/about">Profile &amp; Contact</Link>)
        </p>
      </div>

      {/* ── Official Platform & App Features Grid ── */}
      <div className="mb-8 sm:mb-10">
        <div className="flex items-center justify-between mb-3 px-0.5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-neutral-800 dark:text-neutral-200" />
            <h3 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-neutral-100">
              Typlix Website &amp; App Core Features
            </h3>
          </div>
          <span className="text-[11px] text-neutral-500 font-medium">6 Built-in Tools</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          <Link
            to="/game?mode=lesson"
            className="group p-3.5 rounded-xl bg-neutral-100/70 dark:bg-neutral-900/50 hover:bg-neutral-200/60 dark:hover:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-800 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors">
                  50 Touch Typing Lessons
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="text-[11px] sm:text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Step-by-step 10-finger muscle memory curriculum with real-time finger placement guide.
              </p>
            </div>
            <span className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 mt-2 block">
              mode=lesson
            </span>
          </Link>

          <Link
            to="/game?mode=timed"
            className="group p-3.5 rounded-xl bg-neutral-100/70 dark:bg-neutral-900/50 hover:bg-neutral-200/60 dark:hover:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-800 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors">
                  Timed Speed Tests
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="text-[11px] sm:text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                15s, 30s, 60s, and 120s standardized benchmarks calculating Gross and Net WPM.
              </p>
            </div>
            <span className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 mt-2 block">
              mode=timed
            </span>
          </Link>

          <Link
            to="/game?mode=code"
            className="group p-3.5 rounded-xl bg-neutral-100/70 dark:bg-neutral-900/50 hover:bg-neutral-200/60 dark:hover:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-800 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors">
                  Developer Code Mode
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="text-[11px] sm:text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Real code typing across 9 programming languages: JavaScript, Python, C++, Rust, SQL, and more.
              </p>
            </div>
            <span className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 mt-2 block">
              mode=code
            </span>
          </Link>

          <Link
            to="/game"
            className="group p-3.5 rounded-xl bg-neutral-100/70 dark:bg-neutral-900/50 hover:bg-neutral-200/60 dark:hover:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-800 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors">
                  Mechanical Switch Audio
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="text-[11px] sm:text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Acoustic neuro-tactile sounds replicating Cherry MX Blue, Brown, Red, Topre, and Thock switches.
              </p>
            </div>
            <span className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 mt-2 block">
              Synthesized Audio
            </span>
          </Link>

          <Link
            to="/stats"
            className="group p-3.5 rounded-xl bg-neutral-100/70 dark:bg-neutral-900/50 hover:bg-neutral-200/60 dark:hover:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-800 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors">
                  Typing Telemetry &amp; Stats
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="text-[11px] sm:text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Detailed WPM velocity graphs, keystroke accuracy metrics, and error frequency diagnostics.
              </p>
            </div>
            <span className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 mt-2 block">
              /stats
            </span>
          </Link>

          <div
            className="group p-3.5 rounded-xl bg-neutral-100/70 dark:bg-neutral-900/50 border border-neutral-200/80 dark:border-neutral-800 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold text-xs sm:text-sm text-neutral-900 dark:text-neutral-100">
                  Offline Progressive Web App
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-neutral-900/10 dark:bg-neutral-100/10 text-neutral-900 dark:text-neutral-100 border border-neutral-900/15 dark:border-neutral-100/15">
                  PWA
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                1-tap installation on Android, Windows, Mac, and iOS. Works completely offline with zero ads.
              </p>
            </div>
            <span className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 mt-2 block">
              Offline Cache
            </span>
          </div>
        </div>
      </div>

      {/* ── Audience Segment Cards (Ages 12 to 38) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 sm:mb-12">
        {/* Card 1: Students */}
        <article className="p-4 rounded-xl bg-neutral-100/60 dark:bg-neutral-900/40 border border-neutral-200/80 dark:border-neutral-800 flex flex-col justify-between">
          <div>
            <div className="w-8 h-8 rounded-lg bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-neutral-800 dark:text-neutral-200 mb-3">
              <GraduationCap className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm mb-1.5">
              Students (Ages 12–18)
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 text-xs leading-relaxed">
              Step-by-step home row guides and interactive finger placement tutorials that eliminate hunt-and-peck habits early.
            </p>
          </div>
          <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-500 mt-3 block">
            50 Progressive Lessons
          </span>
        </article>

        {/* Card 2: Competitive Exams */}
        <article className="p-4 rounded-xl bg-neutral-100/60 dark:bg-neutral-900/40 border border-neutral-200/80 dark:border-neutral-800 flex flex-col justify-between">
          <div>
            <div className="w-8 h-8 rounded-lg bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-neutral-800 dark:text-neutral-200 mb-3">
              <Briefcase className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm mb-1.5">
              Govt Aspirants (Ages 18–25)
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 text-xs leading-relaxed">
              Targeted speed test drills calibrated for SSC CGL, CHSL, RRB, and clerical typing exams requiring 95%+ accuracy.
            </p>
          </div>
          <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-500 mt-3 block">
            Timed Tests (1–5 min)
          </span>
        </article>

        {/* Card 3: Developers */}
        <article className="p-4 rounded-xl bg-neutral-100/60 dark:bg-neutral-900/40 border border-neutral-200/80 dark:border-neutral-800 flex flex-col justify-between">
          <div>
            <div className="w-8 h-8 rounded-lg bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-neutral-800 dark:text-neutral-200 mb-3">
              <Terminal className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm mb-1.5">
              Coders (Ages 20–38)
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 text-xs leading-relaxed">
              Specialized syntax practice for JavaScript, Python, C++, HTML tags, and nested code blocks to break past 100+ WPM.
            </p>
          </div>
          <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-500 mt-3 block">
            Developer Code Mode
          </span>
        </article>
      </div>

      {/* ── Key Differentiators / Feature Badges ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-neutral-100/50 dark:bg-neutral-900/30 border border-neutral-200 dark:border-neutral-800 mb-8 sm:mb-12">
        <div className="flex items-center gap-2.5">
          <Zap className="w-4 h-4 text-neutral-700 dark:text-neutral-300 shrink-0" />
          <span className="text-xs text-neutral-700 dark:text-neutral-300 font-medium">Real-time Net WPM Telemetry</span>
        </div>
        <div className="flex items-center gap-2.5">
          <Volume2 className="w-4 h-4 text-neutral-700 dark:text-neutral-300 shrink-0" />
          <span className="text-xs text-neutral-700 dark:text-neutral-300 font-medium">Cherry MX Switch Audio</span>
        </div>
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-neutral-700 dark:text-neutral-300 shrink-0" />
          <span className="text-xs text-neutral-700 dark:text-neutral-300 font-medium">100% Free &amp; Ad-Free</span>
        </div>
      </div>

      {/* ── Platform Comparison Matrix (AI Search / GEO Super-Booster) ── */}
      <div className="mb-8 sm:mb-12 p-4 sm:p-5 rounded-xl bg-neutral-100/50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-2 mb-3">
          <Award className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
          <h3 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-neutral-100">
            Why Typlix vs Other Typing Platforms
          </h3>
        </div>
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400">
                <th className="py-2 pr-3 font-semibold">Feature</th>
                <th className="py-2 px-2 font-bold text-neutral-900 dark:text-neutral-100">Typlix</th>
                <th className="py-2 px-2 font-normal">Monkeytype</th>
                <th className="py-2 pl-2 font-normal">10FastFingers</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200/60 dark:divide-neutral-800/60 text-neutral-700 dark:text-neutral-300">
              <tr>
                <td className="py-2.5 pr-3 font-medium">50 Progressive Lessons</td>
                <td className="py-2.5 px-2 font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1"><Check className="w-3.5 h-3.5 inline" /> Built-in</td>
                <td className="py-2.5 px-2 text-neutral-400"><Minus className="w-3.5 h-3.5 inline" /> Limited</td>
                <td className="py-2.5 pl-2 text-neutral-400"><Minus className="w-3.5 h-3.5 inline" /> No</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-3 font-medium">Developer Code Mode</td>
                <td className="py-2.5 px-2 font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1"><Check className="w-3.5 h-3.5 inline" /> 9 Languages</td>
                <td className="py-2.5 px-2 text-neutral-600 dark:text-neutral-400">Partial</td>
                <td className="py-2.5 pl-2 text-neutral-400"><Minus className="w-3.5 h-3.5 inline" /> No</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-3 font-medium">Mechanical Switch Audio</td>
                <td className="py-2.5 px-2 font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1"><Check className="w-3.5 h-3.5 inline" /> 5 Profiles</td>
                <td className="py-2.5 px-2 text-neutral-600 dark:text-neutral-400">Basic</td>
                <td className="py-2.5 pl-2 text-neutral-400"><Minus className="w-3.5 h-3.5 inline" /> No</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-3 font-medium">Govt Exam Benchmarks (SSC/RRB)</td>
                <td className="py-2.5 px-2 font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1"><Check className="w-3.5 h-3.5 inline" /> Yes</td>
                <td className="py-2.5 px-2 text-neutral-400"><Minus className="w-3.5 h-3.5 inline" /> No</td>
                <td className="py-2.5 pl-2 text-neutral-400"><Minus className="w-3.5 h-3.5 inline" /> Partial</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-3 font-medium">Zero Ads &amp; Free Access</td>
                <td className="py-2.5 px-2 font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1"><Check className="w-3.5 h-3.5 inline" /> 100% Free</td>
                <td className="py-2.5 px-2 text-neutral-700 dark:text-neutral-300">Free</td>
                <td className="py-2.5 pl-2 text-neutral-500">Ad-supported</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 5-Step Touch Typing Mastery Guide (Schema HowTo Companion) ── */}
      <div className="mb-8 sm:mb-12 p-4 sm:p-5 rounded-xl bg-neutral-100/50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-2 mb-3">
          <BookCheck className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
          <h3 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-neutral-100">
            How to Reach 100+ WPM on Typlix
          </h3>
        </div>
        <ol className="space-y-2.5 text-xs text-neutral-600 dark:text-neutral-400">
          <li className="flex items-start gap-2">
            <span className="font-bold text-neutral-900 dark:text-neutral-100 shrink-0">1.</span>
            <span><strong>Master the Home Row:</strong> Anchor left hand on <code className="px-1 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 font-mono">ASDF</code> and right hand on <code className="px-1 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 font-mono">JKL;</code> with index fingers on the tactile bumps of F and J.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-neutral-900 dark:text-neutral-100 shrink-0">2.</span>
            <span><strong>Never Look at the Keys:</strong> Rely solely on muscle memory. Typlix’s on-screen finger guides show the exact finger to press for every character.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-neutral-900 dark:text-neutral-100 shrink-0">3.</span>
            <span><strong>Complete the 50 Lessons:</strong> Advance through home row, top row, bottom row, numbers, and symbol drills sequentially.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-neutral-900 dark:text-neutral-100 shrink-0">4.</span>
            <span><strong>Enable Mechanical Audio:</strong> Tactile audio feedback reinforces keystroke cadence and rhythm.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-neutral-900 dark:text-neutral-100 shrink-0">5.</span>
            <span><strong>Daily 60-Second Timed Tests:</strong> Dedicate 10 minutes daily to test Net WPM and maintain over 98% accuracy.</span>
          </li>
        </ol>
      </div>

      {/* ── Frequently Asked Questions (FAQ) with Schema Compatibility ── */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-4">
          Frequently Asked Questions
        </h3>
        {FAQS.map((faq, index) => {
          const isOpen = openFaqIndex === index;
          return (
            <div
              key={faq.question}
              className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden transition-all bg-neutral-50/50 dark:bg-neutral-900/30"
            >
              <button
                type="button"
                onClick={() => toggleFaq(index)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between p-3.5 sm:p-4 text-left font-medium text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 hover:bg-neutral-100/70 dark:hover:bg-neutral-800/40 transition-colors cursor-pointer"
              >
                <span className="pr-2">{faq.question}</span>
                <ChevronDown
                  className={`w-4 h-4 text-neutral-500 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {isOpen && (
                <div className="px-3.5 sm:px-4 pb-3.5 sm:pb-4 pt-1 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed border-t border-neutral-100 dark:border-neutral-800/60">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Attractive Centered About Developer Callout ── */}
      <div className="pt-6 sm:pt-7 pb-1 flex flex-col items-center justify-center text-center px-2 sm:px-0">
        <Link
          to="/about"
          aria-label="Learn more about the developer of Typlix"
          className="group relative inline-flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200 shadow-md hover:shadow-lg active:scale-[0.98] border border-neutral-800 dark:border-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white w-full sm:w-auto max-w-xs sm:max-w-none"
        >
          <div className="w-5 h-5 rounded-md bg-neutral-800 dark:bg-neutral-200 text-neutral-200 dark:text-neutral-800 flex items-center justify-center group-hover:scale-110 transition-transform">
            <User className="w-3.5 h-3.5" />
          </div>
          <span>About Developer</span>
          <ArrowRight className="w-4 h-4 text-neutral-400 dark:text-neutral-500 group-hover:text-white dark:group-hover:text-neutral-900 group-hover:translate-x-1 transition-all" />
        </Link>
        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-2">
          Meet Prem Sagar Pandey &amp; explore the vision behind Typlix
        </p>
      </div>
    </section>
  );
}
