const CACHE_NAME = 'simplicissimus-v1.1.1'; // Bei Updates erhöhen
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './version.json',
  './simp-logo.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    })
  );
  self.clients.claim();
});

// Blitzschneller Fetch-Handler (Stale-While-Revalidate)
self.addEventListener('fetch', (event) => {
  if (!event.request.url.startsWith('http')) return;

  // 1. version.json IMMER direkt vom Netzwerk laden (damit das Banner sofort reagiert)
  if (event.request.url.includes('version.json')) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  // 2. Für HTML (Navigation): Network First, damit die Grundstruktur aktuell bleibt
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // 3. Für JS, CSS, Bilder: STALE-WHILE-REVALIDATE (Blitzschnell!)
  // Liefert sofort die gecachte Version (App startet ohne Wartezeit)
  // und aktualisiert den Cache im Hintergrund für das nächste Mal.
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
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