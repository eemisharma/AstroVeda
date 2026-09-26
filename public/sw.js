const CACHE_NAME = 'astroconsult-v1';
const STATIC_ASSETS = [
  '/',
  '/offline',
  '/manifest.webmanifest',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon.svg',
];

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate Event
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

// Fetch Event
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Do not cache API routes, checkout, or auth requests
  if (
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/admin') ||
    request.method !== 'GET'
  ) {
    return;
  }

  // Handle static assets with CacheFirst strategy
  if (
    url.pathname.startsWith('/icons/') ||
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.ico')
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // Handle HTML document navigations with NetworkFirst strategy
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          // Cache successful public pages
          if (
            networkResponse.status === 200 &&
            !url.pathname.startsWith('/dashboard')
          ) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          const offlinePage = await caches.match('/offline');
          if (offlinePage) return offlinePage;
          return new Response(
            '<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Offline | AstroConsult</title><style>body{background:#0b0e17;color:#fff;font-family:sans-serif;text-align:center;padding:40px 20px;}h1{color:#f5c518;font-size:24px;}p{color:#9ca3af;}</style></head><body><h1>You are currently offline</h1><p>Please check your internet connection to continue your astrology consultation.</p><button onclick="window.location.reload()" style="background:#e5b842;color:#0b0e17;border:none;padding:12px 24px;border-radius:8px;font-weight:bold;cursor:pointer;margin-top:20px;">Retry</button></body></html>',
            { headers: { 'Content-Type': 'text/html' } }
          );
        })
    );
  }
});
