import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface RouteMetadata {
  title: string;
  description: string;
  canonical: string;
}

const ROUTE_SEO_MAP: Record<string, RouteMetadata> = {
  '/': {
    title: 'Typlix Typing — Touch Typing Speed Test & Practice Game',
    description: 'Typlix Typing is the modern free online touch typing trainer and speed test platform. Accelerate your typing speed, practice developer code typing in 9 languages, and master 50 lessons.',
    canonical: 'https://typlix.web.app/'
  },
  '/game': {
    title: 'Typing Game & Typing Speed Test Arena — Typlix',
    description: 'Play the Typlix typing game. Test typing speed, practice developer code typing in 9 languages, and master 50 progressive lessons.',
    canonical: 'https://typlix.web.app/game'
  },
  '/stats': {
    title: 'Typing Velocity & Analytics Dashboard — Typlix',
    description: 'Analyze your touch typing progression, keystroke accuracy, net Words Per Minute (WPM), and consistency telemetry on Typlix.',
    canonical: 'https://typlix.web.app/stats'
  },
  '/about': {
    title: 'About Developer Prem Sagar Pandey — Typlix',
    description: 'Learn about Prem Sagar Pandey, creator of Typlix — the free minimalist typing speed game and touch typing trainer.',
    canonical: 'https://typlix.web.app/about'
  },
  '/settings': {
    title: 'Typing Preferences, Audio & Themes — Typlix',
    description: 'Customize keyboard layouts (QWERTY, Dvorak, Colemak, AZERTY), Cherry MX mechanical switch audio sounds, and visual themes on Typlix.',
    canonical: 'https://typlix.web.app/settings'
  },
  '/profile': {
    title: 'Profile & Cloud Progress Sync — Typlix',
    description: 'View your typing badges, test history, and sync your touch typing achievements securely with Google Cloud on Typlix.',
    canonical: 'https://typlix.web.app/profile'
  },
  '/privacy': {
    title: 'Privacy Policy & Data Minimization — Typlix',
    description: 'Typlix Privacy Policy adhering to India DPDP Act 2023 and GDPR standards with strict data minimization and zero tracking ads.',
    canonical: 'https://typlix.web.app/privacy'
  },
  '/terms': {
    title: 'Terms of Service — Typlix',
    description: 'Read the terms of service and acceptable usage guidelines for Typlix typing practice and games.',
    canonical: 'https://typlix.web.app/terms'
  },
  '/cookies': {
    title: 'Cookie Policy & Consent — Typlix',
    description: 'Transparent cookie policy details explaining local storage, zero advertising cookies, and essential preferences on Typlix.',
    canonical: 'https://typlix.web.app/cookies'
  },
  '/refund': {
    title: '100% Free Platform & No-Charge Policy — Typlix',
    description: 'Typlix is completely free forever. Learn why there are no subscription charges, purchases, or payment gateways.',
    canonical: 'https://typlix.web.app/refund'
  }
};

export default function RouteSeo() {
  const location = useLocation();

  useEffect(() => {
    const meta = ROUTE_SEO_MAP[location.pathname] || ROUTE_SEO_MAP['/'];

    // Update Document Title
    document.title = meta.title;

    // Update Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', meta.description);

    // Update Open Graph Title & Description
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', meta.title);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', meta.description);

    // Update Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', meta.canonical);
  }, [location.pathname]);

  return null;
}
