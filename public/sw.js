// Typlix Lightweight PWA Service Worker
const CACHE_NAME = 'typlix-cache-v1';
const PRECACHE_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.ico',
  '/favicon-48x48.png',
  '/favicon-96x96.png',
  '/logo192.png',
  '/logo512.png',
  '/apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch(() => {
        // Precache errors are non-fatal
      });
    })
  );
  self.skipWaiting();
});

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

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Only handle same-origin requests; ignore third-party & Firebase auth/API requests
  if (url.origin !== self.location.origin) return;

  // Network first with cache fallback for HTML page navigation
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(async () => {
        const cachedUrl = await caches.match(event.request);
        if (cachedUrl) return cachedUrl;
        const cachedRoot = await caches.match('/');
        if (cachedRoot) return cachedRoot;
        const cachedIndex = await caches.match('/index.html');
        if (cachedIndex) return cachedIndex;
        return new Response('Network offline. Typlix cached assets unavailable.', {
          status: 503,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });
      })
    );
    return;
  }

  // Stale-while-revalidate strategy for static assets
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          return cachedResponse || new Response(null, { status: 404, statusText: 'Not Found' });
        });

      return cachedResponse || fetchPromise;
    })
  );
});
