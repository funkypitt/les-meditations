// sw.js
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  // Force l’activation immédiate du nouveau service worker
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activated');
  // Prend le contrôle des pages immédiatement
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).then((fetchResponse) => {
        // Met en cache les réponses API pour une utilisation hors ligne
        if (event.request.url.includes('/api/')) {
          return caches.open('meditations-api-cache').then((cache) => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        }
        return fetchResponse;
      });
    }).catch(() => {
      // Si la requête échoue (par exemple, hors ligne), utilise le cache
      return caches.match(event.request);
    })
  );
});

// Écoute les messages du client pour forcer une mise à jour
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
