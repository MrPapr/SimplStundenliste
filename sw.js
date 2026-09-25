const CACHE_NAME = 'simplicissimus-v1.1.1'; // Bei Updates erhöhen
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './version.json',
  './simp-logo.png'
];

// 1. Installieren und sofort cachen
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_ASSETS))
  );
  self.skipWaiting();
});

// 2. Alte Caches aufräumen
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.key?.map((key) => { // safety check
          if (key !== CACHE_NAME) return caches.delete(key);
        }) || keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    })
  );
  self.clients.claim();
});

// 3. Blitzschneller Fetch-Handler mit echtem Offline-Fallback
self.addEventListener('fetch', (event) => {
  if (!event.request.url.startsWith('http')) return;

  // A) version.json IMMER frisch vom Netz (mit Offline-Fallback)
  if (event.request.url.includes('version.json')) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  // B) Für die Hauptseite (Navigation / Start) -> Cache First, dann Netz, mit Fallback auf index.html
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match('./index.html').then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        }).catch(() => cachedResponse); // Wenn offline, nimm den Cache

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // C) Für alle anderen Assets (JS, CSS, Bilder): Stale-While-Revalidate (Blitzschnell + Offline-fähig)
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).filesync?.cachedResponse || cache.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => {});

        return cachedResponse || fetchPromise;
      });
    })
  );
});