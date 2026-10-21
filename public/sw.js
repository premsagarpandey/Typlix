// Typlix Production Offline PWA Service Worker
const SW_VERSION = '2.2.0';
const CACHE_NAME = `typlix-cache-${SW_VERSION}`;

// Core static shell assets required for offline launch
const STATIC_SHELL_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/favicon.svg',
  '/favicon-48x48.png',
  '/favicon-96x96.png',
  '/favicon-144x144.png',
  '/favicon-16x16.png',
  '/favicon-32x32.png',
  '/logo192.png',
  '/logo512.png',
  '/apple-touch-icon.png',
  '/tutorial-image.jpg',
  '/logo.png'
];

// Injected during production build by vite.config.ts
const INJECTED_BUNDLE_ASSETS = /* BUILD_INJECTED_ASSETS */ [];

const PRECACHE_ASSETS = Array.from(
  new Set([
    ...STATIC_SHELL_ASSETS,
    ...(Array.isArray(INJECTED_BUNDLE_ASSETS) ? INJECTED_BUNDLE_ASSETS : [])
  ])
);

// Install: Precache all assets and activate immediately
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Parallel resilient precache: single-asset failure never aborts other assets
      await Promise.allSettled(
        PRECACHE_ASSETS.map(async (assetUrl) => {
          try {
            const response = await fetch(assetUrl, { cache: 'no-cache' });
            if (response && (response.ok || response.type === 'opaque')) {
              await cache.put(assetUrl, response);
            }
          } catch {
            // Non-fatal for individual asset
          }
        })
      );
    })
  );
});

// Activate: Prune stale caches and immediately take control of open tabs
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Support user-triggered in-app update activation
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // 1. Google Fonts caching (so Inter & JetBrains Mono render when offline)
  if (url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com') {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;
        return fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const copy = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
            }
            return networkResponse;
          })
          .catch(() => new Response('', { status: 200, headers: { 'Content-Type': 'text/css' } }));
      })
    );
    return;
  }

  // Only handle same-origin requests from here on
  if (url.origin !== self.location.origin) return;

  // 2. Never cache version.json - always network direct with cache busting
  if (url.pathname === '/version.json') {
    event.respondWith(
      fetch(event.request, { cache: 'no-store' }).catch(() => {
        return new Response(JSON.stringify({ offline: true }), {
          headers: { 'Content-Type': 'application/json' }
        });
      })
    );
    return;
  }

  // 3. Navigation requests (Opening the PWA, refreshing, clicking deep links)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          // Fast-timeout race: If network takes > 2000ms (spotty mobile data), fall back immediately to cached shell
          const fetchPromise = fetch(event.request);
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Navigation network timeout')), 2000)
          );
          const networkResponse = await Promise.race([fetchPromise, timeoutPromise]);

          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            const cache = await caches.open(CACHE_NAME);
            // Cache under current request, root '/', and '/index.html'
            cache.put(event.request, copy.clone());
            cache.put('/', copy.clone());
            cache.put('/index.html', copy);
          }
          return networkResponse;
        } catch {
          // Device is offline or network timed out -> Serve SPA shell from cache
          const cache = await caches.open(CACHE_NAME);
          const cached =
            (await cache.match(event.request, { ignoreSearch: true })) ||
            (await cache.match('/index.html', { ignoreSearch: true })) ||
            (await cache.match('/', { ignoreSearch: true }));

          if (cached) return cached;

          return new Response(
            '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Typlix Offline</title></head><body style="background:#0a0a0a;color:#fff;font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;text-align:center"><div><h1>Typlix Offline</h1><p>Please connect to the internet once to cache all game assets.</p><button onclick="location.reload()" style="padding:10px 20px;border-radius:8px;background:#fff;color:#000;font-weight:bold;border:none;cursor:pointer">Retry</button></div></body></html>',
            { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
          );
        }
      })()
    );
    return;
  }

  // 4. Same-origin Static Assets (JS bundles, CSS, images, icons, fonts)
  // Cache-First with background revalidation strategy for ultra-fast offline & online performance
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cachedResponse = await cache.match(event.request, { ignoreSearch: true });

      if (cachedResponse) {
        // If online, revalidate in background silently
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
              cache.put(event.request, networkResponse);
            }
          })
          .catch(() => {});
        return cachedResponse;
      }

      // Not yet in cache, fetch from network and store for next time
      try {
        const networkResponse = await fetch(event.request);
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          cache.put(event.request, networkResponse.clone());
        }
        return networkResponse;
      } catch {
        // Network failed offline: try matching pathname without query or hashes
        const fallback = await cache.match(url.pathname, { ignoreSearch: true });
        if (fallback) return fallback;
        return new Response(null, { status: 404, statusText: 'Not Found' });
      }
    })()
  );
});
