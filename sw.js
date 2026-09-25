const CACHE_NAME = 'simplicissimus-v1.1.3'; // Bei Updates erhöhen
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './version.json',
  './simp-logo.png'
];


// 1. Installieren und sicher cachen (einzeln, damit ein Fehler nicht alles blockiert)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      for (const asset of PRECACHE_ASSETS) {
        try {
          await cache.add(asset);
        } catch (err) {
          console.warn('Konnte Asset nicht vorab cachen:', asset, err);
        }
      }
    })
  );
  self.skipWaiting();
});

// 2. Alte Caches aufräumen
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

  // B) Für die Hauptseite (Navigation / Start) -> Netz zuerst, Fallback auf Cache/index.html
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
          return caches.match(event.request).then((res) => {
            return res || caches.match('./index.html') || caches.match('./');
          });
        })
    );
    return;
  }

  // C) Für alle anderen Assets (JS, CSS, Bilder): Stale-While-Revalidate (Blitzschnell + Offline-fähig)
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