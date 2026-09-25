const CACHE_NAME = 'simplicissimus-v1.1.1'; // Passe das bei jedem großen Update an oder nutze eine Versionsvariable
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './version.json',   // WICHTIG: version.json mit in den Cache aufnehmen
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

// Verbesserter Fetch-Handler
self.addEventListener('fetch', (event) => {
  if (!event.request.url.startsWith('http')) return;

  // 1. WICHTIG: version.json IMMER direkt vom Netzwerk laden (kein Cache!),
  // damit der Update-Check sofort greift.
  if (event.request.url.includes('version.json')) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  // 2. Wenn es sich um eine HTML-Seitenanfrage handelt -> Network First!
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
    return;
  }

  // 3. Für alle anderen Dateien (CSS, JS, Bilder) gilt Stale-While-Revalidate
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