import { ShieldCheck, CheckCircle, HeartHandshake } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RefundPolicy() {
  const lastUpdated = 'September 27, 2026';

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 space-y-10 animate-fade-in text-neutral-800 dark:text-neutral-200">
      {/* Header */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-8 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700">
          <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
          <span>100% Free & Transparent</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
          No-Charge & Cancellation Policy
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Last updated: {lastUpdated} · Honest Access Disclosure
        </p>
      </div>

      {/* Free Tier Notice Card */}
      <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/40 space-y-2">
        <div className="flex items-center gap-2 text-neutral-900 dark:text-white font-bold text-base">
          <CheckCircle className="w-5 h-5 text-neutral-900 dark:text-neutral-100" aria-hidden="true" />
          <span>100% Free Platform — Zero Financial Charges</span>
        </div>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
          <strong>Typlix is completely free to use.</strong> All 50 touch-typing lessons, mechanical sound profiles, speed sprint tests (quotes, code snippets, custom texts), finger placement tutorials, and local/cloud analytics are provided with zero charges, no subscriptions, and no credit card requirements.
        </p>
      </div>

      {/* Policy Sections */}
      <div className="space-y-8 text-sm leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <span>1.</span> No Monetary Transactions
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            Because Typlix is a 100% free web application, no financial transactions occur on this platform. We do not collect credit or debit card details, process payment transactions, or integrate commercial payment gateways.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <span>2.</span> Inapplicability of Refunds or Money-Back Guarantees
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            Because no money is ever requested, collected, or held by Typlix:
          </p>
          <ul className="list-disc list-inside space-y-1 text-neutral-600 dark:text-neutral-400">
            <li>Monetary refunds, chargebacks, and commercial money-back guarantees are entirely inapplicable.</li>
            <li>You will never be billed, charged recurring renewal fees, or placed on trial periods that convert into paid subscriptions.</li>
            <li>No false claims of paid tier upgrades or commercial guarantees are made on this platform.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <span>3.</span> Complete Feature Access Without Paywalls
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            Every feature on Typlix is unlocked and fully accessible:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
            <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/20">
              <div className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">Curriculum & Practice</div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                50 structured progressive lessons, quotes library, programming snippets, and custom text engine are 100% free.
              </p>
            </div>
            <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/20">
              <div className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">Audio & Customization</div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                All mechanical switch profiles, sound volume controls, and alternative keyboard layouts (QWERTY, Dvorak, Colemak, AZERTY) are completely unrestricted.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <span>4.</span> Effortless Cancellation & Data Removal
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            Because there are no recurring subscriptions or financial contracts:
          </p>
          <ul className="list-disc list-inside space-y-1 text-neutral-600 dark:text-neutral-400">
            <li>You may stop using Typlix at any time without fees, penalties, or formal cancellation procedures.</li>
            <li>You can export all your session data anytime as JSON or CSV from <Link to="/settings" className="underline text-neutral-900 dark:text-neutral-100 font-medium">Settings</Link>.</li>
            <li>You can permanently erase your local statistics or wipe your account data with one click using the Danger Zone in Settings.</li>
          </ul>
        </section>

        {/* Section 5: Support & Business Details */}
        <section className="space-y-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <span>5.</span> Operating Entity & Contact
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            If you have questions about Typlix or need assistance with your data or typing practice, please reach out to our team:
          </p>
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 flex items-center gap-3">
            <HeartHandshake className="w-5 h-5 text-neutral-700 dark:text-neutral-300 shrink-0" aria-hidden="true" />
            <div>
              <div className="font-semibold text-neutral-900 dark:text-neutral-100">Typlix Interactive · Open Educational Project</div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                Lead Maintainer: Prem Sagar Pandey · Contact: <a href="mailto:support@typlix.app" className="underline hover:text-neutral-900 dark:hover:text-white">support@typlix.app</a>
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Footer navigation */}
      <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 flex flex-wrap gap-4 text-xs text-neutral-600 dark:text-neutral-400">
        <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
        <span aria-hidden="true">•</span>
        <Link to="/terms" className="hover:underline">Terms & Conditions</Link>
        <span aria-hidden="true">•</span>
        <Link to="/cookies" className="hover:underline">Cookie Policy</Link>
      </div>
    </div>
  );
}
