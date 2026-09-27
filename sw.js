const CACHE_NAME = 'meine-webapp-v1'; // Wichtig: Bei GitHub-Updates hier z.B. v2 draus machen!

const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js'
];

// Dateien beim Installieren cachen
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// Alten Cache bei Versionswechsel aufräumen
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// App offline aus dem Cache laden
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});

// Auf das Signal von forceManualUpdate hören und sofort aktivieren
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});