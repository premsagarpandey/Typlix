import { FileText, AlertTriangle, Mail, ShieldAlert, HeartPulse, Building2, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TermsOfService() {
  const lastUpdated = 'September 27, 2026';

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 space-y-10 animate-fade-in text-neutral-800 dark:text-neutral-200">
      {/* Header */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-8 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
          <FileText className="w-3.5 h-3.5" />
          <span>Legal Agreement</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
          Terms & Conditions
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Last updated: {lastUpdated} · Effective Date: January 1, 2025 · Business Identity, Image Copyright & Risk Disclosures
        </p>
      </div>

      {/* Intro Note */}
      <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
        Please read these Terms & Conditions ("Terms", "Agreement") carefully before using the <strong>Typlix</strong> touch-typing training web platform operated by <strong>Typlix Interactive</strong> (lead maintainer Prem Sagar Pandey, India). By accessing or using Typlix, you agree to be legally bound by these Terms and our <Link to="/privacy" className="underline text-neutral-900 dark:text-white font-medium">Privacy Policy</Link>.
      </div>

      {/* Terms Sections */}
      <div className="space-y-8 text-sm leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <span>1.</span> Acceptance and Eligibility
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            By creating an account or by using any portion of Typlix, you affirm that you are at least 13 years of age (or the minimum legal age required in your jurisdiction) and possess the legal authority to enter into this binding agreement. If you are using Typlix on behalf of an educational institution or organization, you represent that you have authority to bind that entity.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <span>2.</span> User Accounts and Security
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            While basic typing lessons can be utilized anonymously without registration, signing in unlocks cloud synchronization, cross-device stats, and public leaderboard rankings.
          </p>
          <ul className="list-disc list-inside space-y-1 text-neutral-600 dark:text-neutral-400">
            <li>You are responsible for safeguarding your login credentials (passwords or Google authentication tokens).</li>
            <li>You must provide accurate, non-fraudulent email credentials.</li>
            <li>You must notify us immediately upon suspecting any unauthorized access to your account.</li>
          </ul>
        </section>

        {/* Section 3: Fair Play & Acceptable Use */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
              3. Fair Play, Anti-Cheat, and Acceptable Use
            </h2>
            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-neutral-200/80 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700">
              Strict Policy
            </span>
          </div>
          <p className="text-neutral-600 dark:text-neutral-400">
            Typlix is designed to help human typists hone real muscle memory and measurable keyboard skills. To maintain competitive integrity across leaderboards:
          </p>
          <div className="p-4 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-100/50 dark:bg-neutral-900/40 space-y-2">
            <div className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Prohibited Behaviors
            </div>
            <ul className="list-disc list-inside text-xs text-neutral-700 dark:text-neutral-300 space-y-1">
              <li>Using automated typing bots, macros, autoclickers, or headless scripts to simulate keystrokes.</li>
              <li>Injecting artificial high scores or tampering with WebSocket/HTTP payloads to skew leaderboard rankings.</li>
              <li>Attempting to reverse-engineer, decompile, or exploit vulnerabilities in our application API.</li>
              <li>Engaging in offensive, defamatory, or abusive behavior in public usernames or profile avatars.</li>
            </ul>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Violations of this section will result in immediate disqualification of high-scores and possible suspension of cloud synchronization rights.
          </p>
        </section>

        {/* Section 4: Image Copyright & Intellectual Property */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-neutral-700 dark:text-neutral-300" aria-hidden="true" />
              <span>4.</span> Image Copyright, Intellectual Property & Fair Use
            </h2>
          </div>
          <p className="text-neutral-600 dark:text-neutral-400">
            We respect intellectual property rights and maintain strict provenance for all media and software assets:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 space-y-1">
              <div className="font-semibold text-neutral-900 dark:text-neutral-100">Tutorial Graphics & Brand Assets</div>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                The visual hand placement guide graphic (<code>tutorial-image.jpg</code>) and the Typlix brand mark (<code>logo.png</code>) are proprietary original designs © {new Date().getFullYear()} Typlix. All rights reserved. Reproduction or redistribution without written consent is prohibited.
              </p>
            </div>
            <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 space-y-1">
              <div className="font-semibold text-neutral-900 dark:text-neutral-100">Third-Party Open Source Components</div>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                UI icons are provided by the Lucide project under the MIT License. Typography is licensed under the SIL Open Font License (Inter) and Apache License 2.0 (JetBrains Mono). Sound effects are procedurally generated via Web Audio API oscillators.
              </p>
            </div>
          </div>
          <p className="text-xs text-neutral-600 dark:text-neutral-400">
            <strong>Quotes Practice Mode (Fair Use):</strong> Literary, historical, and philosophical quotes featured in the quotes practice mode are presented under the doctrine of <em>Fair Use</em> (17 U.S. Code § 107 / Section 52 of the Indian Copyright Act, 1957) purely for educational, non-commercial typing practice and literacy advancement.
          </p>
        </section>

        {/* Section 5: DMCA & Copyright Infringement Notice */}
        <section className="space-y-3 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/40 text-xs">
          <h3 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-neutral-500" />
            5. DMCA & Copyright Infringement Notice Procedure
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
            If you are a copyright owner or authorized agent and believe that any visual asset, quotation, or content accessible on Typlix infringes upon your copyright, you may submit a formal notification to our designated maintainer at <a href="mailto:premsagarpandey.cs@gmail.com" className="underline font-medium text-neutral-900 dark:text-white">premsagarpandey.cs@gmail.com</a> with:
          </p>
          <ul className="list-disc list-inside space-y-1 text-neutral-600 dark:text-neutral-400 pl-1">
            <li>Identification of the copyrighted work claimed to have been infringed;</li>
            <li>Exact location (URL or mode) of the infringing material on Typlix;</li>
            <li>Your contact information (name, address, telephone number, and email);</li>
            <li>A statement that you hold a good faith belief that the disputed use is not authorized by the copyright owner;</li>
            <li>A statement under penalty of perjury that the notification is accurate and that you are authorized to act.</li>
          </ul>
        </section>

        {/* Section 6: Ergonomic Safety, RSI & Health Risk Warning */}
        <section className="space-y-3 p-4 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-100/50 dark:bg-neutral-900/40">
          <div className="flex items-center gap-2 text-neutral-900 dark:text-neutral-100 font-semibold text-sm">
            <HeartPulse className="w-4 h-4" />
            <span>6. Ergonomic Safety, Repetitive Strain Injury (RSI) & Medical Disclaimer</span>
          </div>
          <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
            Touch-typing involves repetitive finger, wrist, and hand movements. Practicing for prolonged intervals without rest may lead to physical discomfort or Repetitive Strain Injuries (RSI), such as carpal tunnel syndrome or tendonitis.
          </p>
          <ul className="list-disc list-inside text-xs text-neutral-700 dark:text-neutral-300 space-y-1">
            <li><strong>Rest Intervals:</strong> We strongly advise taking a 5-minute break every 20 to 30 minutes of continuous typing.</li>
            <li><strong>Neutral Posture:</strong> Keep your wrists straight, elevated off hard edges, and shoulders relaxed.</li>
            <li><strong>Stop on Pain:</strong> If you feel persistent numbness, tingling, burning, or aching, stop typing immediately and consult a qualified medical professional.</li>
            <li><strong>Disclaimer:</strong> Typlix is an educational software tool, not a medical or ergonomic therapy device. Typlix disclaims any liability for personal injuries arising from improper typing posture or overuse.</li>
          </ul>
        </section>

        {/* Section 7: User-Generated Content & Custom Mode */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <span>7.</span> User-Generated Content & Custom Practice Mode
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            Typlix provides a Custom Text practice mode allowing users to paste or type custom text.
          </p>
          <ul className="list-disc list-inside space-y-1 text-neutral-600 dark:text-neutral-400">
            <li><strong>Strictly Client-Side:</strong> Custom practice text is stored exclusively in your local browser memory (<code>localStorage</code>) and is never transmitted to, monitored by, or retained on Typlix servers.</li>
            <li><strong>Content Responsibility:</strong> You are solely responsible for any text you paste into the custom mode. You agree not to input classified information, proprietary trade secrets, malicious payloads, or defamatory material.</li>
          </ul>
        </section>

        {/* Section 8 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <span>8.</span> Service Availability & Updates
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            We strive to provide a reliable, uninterrupted touch-typing practice experience. However, Typlix may occasionally undergo maintenance, feature enhancements, or unexpected downtime. We reserve the right to update, modify, or deprecate features with or without prior notice.
          </p>
        </section>

        {/* Section 9 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <span>9.</span> Disclaimer of Warranties
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            Typlix is provided on an <strong>"AS IS"</strong> and <strong>"AS AVAILABLE"</strong> basis without warranties of any kind, whether express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, or non-infringement. We do not warrant that typing metrics will guarantee specific professional employment or typing exam outcomes.
          </p>
        </section>

        {/* Section 10 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <span>10.</span> Limitation of Liability
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            To the maximum extent permitted by applicable law, in no event shall Typlix, its operators, or contributors be liable for any indirect, punitive, incidental, special, or consequential damages resulting from your use of or inability to use the platform.
          </p>
        </section>

        {/* Section 11 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <span>11.</span> Termination
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            We reserve the right to terminate or suspend your account and access to Typlix immediately, without prior notice or liability, for any reason, including without limitation if you breach these Terms. You may stop using the service at any time and purge your data from the Settings page.
          </p>
        </section>

        {/* Section 12: Business Details, Governing Law & Jurisdiction */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-neutral-700 dark:text-neutral-300" aria-hidden="true" />
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
              12. Business Identity, Governing Law & Jurisdiction
            </h2>
          </div>
          <p className="text-neutral-600 dark:text-neutral-400">
            These Terms shall be governed by and construed in accordance with the laws of <strong>India</strong> (including the Information Technology Act, 2000 and the Digital Personal Data Protection Act, 2023), without regard to its conflict of law provisions. Any legal action or proceeding arising out of or related to these Terms shall be instituted exclusively in the competent courts in India.
          </p>
        </section>

        {/* Section 13 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <span>13.</span> Changes to Terms
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            We may revise these Terms occasionally. When changes occur, we will update the "Last Updated" date at the top of this document. Continued usage after modifications implies your acceptance of the updated terms.
          </p>
        </section>

        {/* Section 14 */}
        <section className="space-y-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <span>14.</span> Inquiries and Legal Contact
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            For questions, copyright inquiries, or legal notices regarding these Terms, contact our legal operations team:
          </p>
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 flex items-center gap-3">
            <Mail className="w-5 h-5 text-neutral-500" />
            <div>
              <div className="font-semibold text-neutral-900 dark:text-neutral-100">Maintainer & Legal Contact</div>
              <div className="flex flex-wrap gap-x-4 text-xs text-neutral-500 mt-0.5">
                <a href="mailto:premsagarpandey.cs@gmail.com" className="hover:text-neutral-900 dark:hover:text-white underline">
                  premsagarpandey.cs@gmail.com
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer navigation */}
      <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 flex flex-wrap gap-4 text-xs text-neutral-600 dark:text-neutral-400">
        <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
        <span aria-hidden="true">•</span>
        <Link to="/cookies" className="hover:underline">Cookie Policy</Link>
        <span aria-hidden="true">•</span>
        <Link to="/refund" className="hover:underline">No-Charge Policy</Link>
      </div>
    </div>
  );
}
