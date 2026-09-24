const C = 'simpl-stunden-v2.1'; // Ändere hier bei jedem Update die Nummer (z.B. v3, v4...)

const A = [
    './',
    './index.html',
    './styles.css',
    './app.js',
    './manifest.webmanifest',
    './simp-logo.png',
    './icon-192.png',
    './icon-512.png'
];

// 1. Installieren und alte Versionen verwerfen
self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(C)
            .then(c => c.addAll(A))
            .then(() => self.skipWaiting())
    );
});

// 2. Aktivieren und alten Cache aufräumen
self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== C).map(key => caches.delete(key))
            );
        }).then(() => self.clients.claim())
    );
});

// 3. IMMER erst online nachschauen, bei Offline-Fall den Cache nutzen
self.addEventListener('fetch', e => {
    if (e.request.method !== 'GET') return;

    e.respondWith(
        fetch(e.request)
            .then(networkResponse => {
                // Wenn die Datei online verfügbar ist, aktualisiere den Cache im Hintergrund
                let responseClone = networkResponse.clone();
                caches.open(C).then(cache => {
                    cache.put(e.request, responseClone);
                });
                return networkResponse;
            })
            .catch(() => {
                // Wenn kein Internet da ist (Offline), nimm den Cache
                return caches.match(e.request).then(cachedResponse => {
                    return cachedResponse || caches.match('./index.html');
                });
            })
    );
});