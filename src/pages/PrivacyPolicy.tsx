import { Shield, Lock, EyeOff, Database, UserCheck, Mail, FileCheck, Building2, Scale } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  const lastUpdated = 'September 27, 2026';

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 space-y-10 animate-fade-in text-neutral-800 dark:text-neutral-200">
      {/* Header */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-8 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <Shield className="w-3.5 h-3.5" />
          <span>Privacy & Data Protection</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
          Privacy Policy
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Last updated: {lastUpdated} · Effective Date: January 1, 2025 · DPDP Act (India), GDPR & CCPA Compliant
        </p>
      </div>

      {/* Core Principle: Data Minimization Highlight Card */}
      <div className="p-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10 space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
            <Lock className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
            Our Core Commitment: "Only Collect Necessary Data" (Data Minimization)
          </h2>
        </div>
        <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
          At <strong>Typlix</strong>, we adhere strictly to the statutory principle of <em>Data Minimization</em> (consistent with India's Digital Personal Data Protection Act 2023, EU GDPR Article 5(1)(c), and CCPA). We collect <strong>only the minimum data strictly necessary</strong> to deliver touch typing lessons, track your speed and accuracy metrics, and maintain your custom app preferences. We do not sell, rent, monetize, or broker your personal information to third parties or advertising networks.
        </p>
      </div>

      {/* Main Content Sections */}
      <div className="space-y-8 text-sm leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <span>1.</span> Information We Collect
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            Depending on how you use Typlix, we may collect the following limited categories of information:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 space-y-2">
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <Database className="w-4 h-4 text-neutral-500" />
                Typing Performance & Progress Data
              </h3>
              <ul className="list-disc list-inside text-xs text-neutral-600 dark:text-neutral-400 space-y-1">
                <li>Words Per Minute (WPM) and Raw WPM</li>
                <li>Accuracy percentage and error keystrokes</li>
                <li>Lesson level progress (Levels 1 to 50)</li>
                <li>Practice test timestamps & duration</li>
                <li>Speed test mode choices (Quotes, Code, Custom)</li>
              </ul>
              <p className="text-[11px] text-neutral-500 italic mt-1">
                * Kept strictly in your local browser storage by default; only synced to cloud if you explicitly sign in.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 space-y-2">
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-neutral-500" />
                Account Credentials (Optional)
              </h3>
              <ul className="list-disc list-inside text-xs text-neutral-600 dark:text-neutral-400 space-y-1">
                <li>Email address (used solely for authentication)</li>
                <li>Display name or avatar (if signing in via Google)</li>
                <li>Account creation & last login timestamp</li>
                <li>Hashed authentication tokens (managed securely via Firebase Auth)</li>
              </ul>
              <p className="text-[11px] text-neutral-500 italic mt-1">
                * You can use Typlix 100% anonymously without creating an account.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 space-y-2">
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-neutral-500" />
                App Preferences & Configuration
              </h3>
              <ul className="list-disc list-inside text-xs text-neutral-600 dark:text-neutral-400 space-y-1">
                <li>Mechanical switch audio profile & volume</li>
                <li>Color theme (Light / Dark)</li>
                <li>Keyboard layout preference (QWERTY, Dvorak, Colemak, AZERTY)</li>
                <li>Cookie consent selection choices</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 space-y-2">
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <EyeOff className="w-4 h-4 text-rose-500" />
                What We NEVER Collect
              </h3>
              <ul className="list-disc list-inside text-xs text-neutral-600 dark:text-neutral-400 space-y-1">
                <li>No keyloggers or recording of keystrokes outside active game tests</li>
                <li>No financial or credit card numbers stored on our servers</li>
                <li>No precise physical location / GPS coordinates</li>
                <li>No cross-site tracking pixels or advertising identifiers</li>
                <li>No personal data scraping or selling to third parties</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <span>2.</span> How We Use Your Information
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            We use the necessary information strictly for the following purposes:
          </p>
          <ul className="list-disc list-inside space-y-1 text-neutral-600 dark:text-neutral-400">
            <li>To render real-time typing feedback, speed graphs, and finger placement tutorials.</li>
            <li>To calculate your typing statistics, personal records, and unlocked lessons.</li>
            <li>To enable multi-device synchronization if you choose to authenticate.</li>
            <li>To display opt-in rankings on public leaderboards (using your display name or chosen alias).</li>
            <li>To remember your audio preferences and UI dark/light themes.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <span>3.</span> Lawful Bases for Processing & Form Consent
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            When you register, submit forms, or utilize cloud synchronization, our lawful bases include:
          </p>
          <div className="space-y-2">
            <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800">
              <span className="font-semibold text-neutral-900 dark:text-neutral-100">Explicit Consent:</span> For optional account creation, newsletter/contact communication, and non-essential cookies. You have the right to withdraw this consent at any time.
            </div>
            <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800">
              <span className="font-semibold text-neutral-900 dark:text-neutral-100">Contractual & Educational Necessity:</span> To provide touch typing practice services, account authentication, and cloud data persistence as requested by you.
            </div>
            <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800">
              <span className="font-semibold text-neutral-900 dark:text-neutral-100">Legitimate Interest:</span> To ensure the integrity of the platform, prevent leaderboard spam or automated bot abuse, and maintain application security.
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <span>4.</span> Third-Party Service Providers, Fonts & Infrastructure
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            We rely on Google Firebase and Google Cloud managed infrastructure, which adhere to strict industry security standards (SOC 2, ISO 27001, and GDPR compliance):
          </p>
          <ul className="list-disc list-inside space-y-1 text-neutral-600 dark:text-neutral-400">
            <li><strong>Google Firebase Auth:</strong> For secure, tokenized user authentication and login without storing plain-text passwords.</li>
            <li><strong>Google Cloud Firestore:</strong> For encrypted cloud synchronization of your lesson levels and typing high-scores. In accordance with data minimization, user emails are never stored in public Firestore profile documents.</li>
            <li><strong>Zero Third-Party Tracking Embeds:</strong> Typlix does not load any third-party advertising scripts, external tracking pixels, social tracking widgets, or telemetry iframes.</li>
            <li><strong>Client-Side Local Avatars:</strong> All user profile avatars are generated client-side using SVG/CSS initials without transmitting names or emails to external avatar APIs.</li>
            <li><strong>Global Privacy Control (GPC) & DNT:</strong> We actively check for and enforce browser-level GPC (`navigator.globalPrivacyControl`) and Do Not Track headers.</li>
            <li><strong>Google Fonts CDN:</strong> Typography (Inter and JetBrains Mono) is delivered via Google's edge font CDN without cookies or behavioral profiling, with strict `nosniff` and subresource integrity.</li>
            <li><strong>Edge Hosting (Netlify / Global CDN):</strong> For fast, edge-cached SSL content delivery with strict Content Security Policy (CSP).</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <span>5.</span> Global Data Rights (GDPR & CCPA Compliant)
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            You maintain full sovereignty over your data:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
            <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800">
              <div className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">Right to Access & Portability</div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                You can download all your stored session statistics as a standard JSON or CSV file at any time from the <Link to="/settings" className="underline text-neutral-800 dark:text-neutral-200 font-medium">Settings</Link> page.
              </p>
            </div>
            <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800">
              <div className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">Right to Erasure ("Be Forgotten")</div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                You can reset your level progress, purge session history, or wipe local storage with one click in Settings, or contact us to delete your cloud profile.
              </p>
            </div>
            <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800">
              <div className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">Right to Rectification</div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                You can modify your profile display name, change sound settings, or update your registered email.
              </p>
            </div>
            <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800">
              <div className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">Right to Withdraw Consent</div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                You can alter your cookie and storage preferences at any time via the <Link to="/cookies" className="underline text-neutral-800 dark:text-neutral-200 font-medium">Cookie Policy</Link> page or footer link.
              </p>
            </div>
          </div>
        </section>

        {/* Section 6: DPDP Act 2023 Compliance */}
        <section className="space-y-4 p-5 rounded-2xl border border-blue-500/30 bg-blue-500/5 dark:bg-blue-500/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-500/20 text-blue-700 dark:text-blue-300">
              <Scale className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                6. Compliance with India's DPDP Act, 2023 (Digital Personal Data Protection Act)
              </h2>
              <span className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                Statutory Notice for Data Principals in India
              </span>
            </div>
          </div>
          <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
            In compliance with the <strong>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong> of India, Typlix operates as a <strong>Data Fiduciary</strong>. We guarantee the following statutory rights and protections to all Data Principals:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/60">
              <div className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                Section 11: Right to Access Information
              </div>
              <p className="text-neutral-600 dark:text-neutral-400">
                You have the right to obtain a summary of your personal data processed by Typlix and the identities of all data processors (e.g. Firebase) with whom data is shared.
              </p>
            </div>

            <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/60">
              <div className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                Section 12: Right to Correction & Erasure
              </div>
              <p className="text-neutral-600 dark:text-neutral-400">
                You have the right to correct, complete, update, or erase personal data that is no longer necessary for touch typing training.
              </p>
            </div>

            <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/60">
              <div className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                Section 13: Right of Grievance Redressal
              </div>
              <p className="text-neutral-600 dark:text-neutral-400">
                You have the right to accessible grievance redressal through our designated Grievance Officer, with response within 48 to 72 business hours.
              </p>
            </div>

            <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/60">
              <div className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                Section 14: Right to Nominate
              </div>
              <p className="text-neutral-600 dark:text-neutral-400">
                You have the right to nominate any other individual to exercise your rights under the DPDP Act in the event of death or incapacity.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/60 text-xs space-y-1">
            <span className="font-semibold text-neutral-900 dark:text-neutral-100">
              Section 9: Specific Protection of Children & Minors:
            </span>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Typlix does not track, profile, or perform behavioral monitoring of children, nor do we serve targeted advertising. The platform is dedicated exclusively to touch typing skill development.
            </p>
          </div>

          <p className="text-[11px] text-neutral-600 dark:text-neutral-400 italic">
            * In the event an issue is not resolved by our Grievance Officer, you hold the statutory right to register a complaint directly with the <strong>Data Protection Board of India (DPBI)</strong>.
          </p>
        </section>

        {/* Section 7: Business Details & Grievance Officer */}
        <section className="space-y-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-neutral-700 dark:text-neutral-300" aria-hidden="true" />
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
              7. Business Entity Details & Grievance Redressal Officer
            </h2>
          </div>
          <p className="text-neutral-600 dark:text-neutral-400">
            In compliance with Rule 3(2) of the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021 and Section 13 of the DPDP Act, 2023, the details of the Data Fiduciary and Grievance Officer are published below:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 space-y-1.5 text-xs">
              <div className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">
                Operating Entity / Platform
              </div>
              <div><span className="text-neutral-500">Service:</span> <strong className="text-neutral-800 dark:text-neutral-200">Typlix Interactive</strong></div>
              <div><span className="text-neutral-500">Lead Operator:</span> Prem Sagar Pandey</div>
              <div><span className="text-neutral-500">Project Type:</span> Educational Touch-Typing Platform</div>
              <div><span className="text-neutral-500">Jurisdiction:</span> India</div>
              <div><span className="text-neutral-500">Support Desk:</span> <a href="mailto:support@typlix.app" className="underline hover:text-neutral-900 dark:hover:text-white">support@typlix.app</a></div>
            </div>

            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 space-y-1.5 text-xs">
              <div className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-neutral-500" aria-hidden="true" /> Designated Grievance Officer
              </div>
              <div><span className="text-neutral-500">Officer:</span> Grievance Redressal Officer</div>
              <div><span className="text-neutral-500">Grievance Email:</span> <a href="mailto:grievance@typlix.app" className="underline font-medium text-neutral-900 dark:text-white">grievance@typlix.app</a></div>
              <div><span className="text-neutral-500">Privacy Desk:</span> <a href="mailto:privacy@typlix.app" className="underline hover:text-neutral-900 dark:hover:text-white">privacy@typlix.app</a></div>
              <div><span className="text-neutral-500">Acknowledgement:</span> Within 24 hours</div>
              <div><span className="text-neutral-500">Resolution SLA:</span> Within 48–72 business hours</div>
            </div>
          </div>
        </section>

        {/* Section 8 */}
        <section className="space-y-3 pt-2">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <span>8.</span> Data Retention & Security
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            We employ modern encryption standards (TLS 1.3 in transit, AES-256 for cloud databases). Anonymous visitors have data saved only within their browser’s local storage. Stored cloud data is kept until you request deletion or remain inactive for over 24 consecutive months.
          </p>
        </section>
      </div>

      {/* Footer navigation */}
      <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 flex flex-wrap gap-4 text-xs text-neutral-600 dark:text-neutral-400">
        <Link to="/terms" className="hover:underline">Terms & Conditions</Link>
        <span aria-hidden="true">•</span>
        <Link to="/cookies" className="hover:underline">Cookie Policy</Link>
        <span aria-hidden="true">•</span>
        <Link to="/refund" className="hover:underline">No-Charge Policy</Link>
        <span aria-hidden="true">•</span>
        <Link to="/settings" className="hover:underline">Manage Stored Data</Link>
      </div>
    </div>
  );
}
