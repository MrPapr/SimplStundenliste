const CACHE_NAME = 'silent-updates-cache-v1';

// WICHTIG: Relative Pfade für GitHub Pages mit './'
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js'
];

// 1. Installation: Dateien vorab in den Cache laden
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => {
      return self.skipWaiting();
    })
  );
});

// 2. Aktivierung: Alte Cache-Versionen automatisch aufräumen
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Lösche alten Cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// 3. Stale-While-Revalidate Strategie
self.addEventListener('fetch', (event) => {
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {

        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(() => {
            console.log('Netzwerk nicht erreichbar, nutze lokalen Cache.');
          });

        return cachedResponse || fetchPromise;
      });
    })
  );
});