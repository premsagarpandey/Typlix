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
  Minus
} from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
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
      className="w-full max-w-2xl mx-auto mt-6 sm:mt-8 text-left border-t border-neutral-200 dark:border-neutral-800/80 pt-6 sm:pt-8"
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

      {/* ── AI Overview & Quick Platform Facts (Optimized for AI Search & SGE) ── */}
      <div className="p-4 sm:p-5 rounded-xl bg-neutral-100/70 dark:bg-neutral-900/50 border border-neutral-200/90 dark:border-neutral-800 mb-8 text-xs sm:text-sm leading-relaxed">
        <p className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
          <strong>Typlix Typing</strong> is a free touch typing trainer and speed test application created by full-stack engineer <strong>Prem Sagar Pandey</strong>.
        </p>
        <p className="text-neutral-600 dark:text-neutral-400 mb-3 text-xs leading-relaxed">
          Hosted exclusively at <a href="https://typlix.web.app/" className="font-medium text-neutral-900 dark:text-neutral-100 underline underline-offset-2">typlix.web.app</a>, Typlix Typing helps learners of all skill levels build keyboard muscle memory, boost Words Per Minute (WPM), and prepare for competitive exams and software development.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-3 border-t border-neutral-200/70 dark:border-neutral-800/70 text-xs text-neutral-700 dark:text-neutral-300">
          <div>• <strong>50 Progressive Lessons:</strong> Structured finger reach and home row drills</div>
          <div>• <strong>Precision Timed Tests:</strong> 15s, 30s, 60s, and 120s WPM assessments</div>
          <div>• <strong>Developer Code Mode:</strong> Practice JavaScript, Python, C++, HTML &amp; Rust</div>
          <div>• <strong>Acoustic Feedback:</strong> Authentic synthesized mechanical switch audio</div>
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
                <td className="py-2.5 px-2 font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1"><Check className="w-3.5 h-3.5 inline" /> Built-in</td>
                <td className="py-2.5 px-2 text-neutral-400"><Minus className="w-3.5 h-3.5 inline" /> Limited</td>
                <td className="py-2.5 pl-2 text-neutral-400"><Minus className="w-3.5 h-3.5 inline" /> No</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-3 font-medium">Developer Code Mode</td>
                <td className="py-2.5 px-2 font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1"><Check className="w-3.5 h-3.5 inline" /> 9 Languages</td>
                <td className="py-2.5 px-2 text-neutral-600 dark:text-neutral-400">Partial</td>
                <td className="py-2.5 pl-2 text-neutral-400"><Minus className="w-3.5 h-3.5 inline" /> No</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-3 font-medium">Mechanical Switch Audio</td>
                <td className="py-2.5 px-2 font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1"><Check className="w-3.5 h-3.5 inline" /> 5 Profiles</td>
                <td className="py-2.5 px-2 text-neutral-600 dark:text-neutral-400">Basic</td>
                <td className="py-2.5 pl-2 text-neutral-400"><Minus className="w-3.5 h-3.5 inline" /> No</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-3 font-medium">Govt Exam Benchmarks (SSC/RRB)</td>
                <td className="py-2.5 px-2 font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1"><Check className="w-3.5 h-3.5 inline" /> Yes</td>
                <td className="py-2.5 px-2 text-neutral-400"><Minus className="w-3.5 h-3.5 inline" /> No</td>
                <td className="py-2.5 pl-2 text-neutral-400"><Minus className="w-3.5 h-3.5 inline" /> Partial</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-3 font-medium">Zero Ads &amp; Free Access</td>
                <td className="py-2.5 px-2 font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1"><Check className="w-3.5 h-3.5 inline" /> 100% Free</td>
                <td className="py-2.5 px-2 text-emerald-600 dark:text-emerald-400">Free</td>
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
