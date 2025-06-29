const CACHE_NAME = 'meditations-cache-v1';
const API_CACHE_NAME = 'meditations-api-cache-v1';
const MP3_CACHE_NAME = 'meditations-mp3-cache-v1';

// Liste des ressources statiques à mettre en cache
const STATIC_ASSETS = [
  '/',
  '/logo.png',
  '/share-icon.png',
  '/manifest.json'
];

// Installation du service worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activation du service worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activated');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME && cacheName !== MP3_CACHE_NAME) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Gestion des requêtes (fetch)
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Stratégie pour les API
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request).then((fetchResponse) => {
        return caches.open(API_CACHE_NAME).then((cache) => {
          cache.put(event.request, fetchResponse.clone());
          return fetchResponse;
        });
      }).catch(() => {
        return caches.match(event.request);
      })
    );
  }
  // Stratégie pour les fichiers MP3
  else if (url.pathname.endsWith('.mp3')) {
    event.respondWith(
      caches.open(MP3_CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return fetch(event.request).then((fetchResponse) => {
            // Vérifie que la réponse est OK avant de la mettre en cache
            if (fetchResponse.status === 200) {
              return cache.put(event.request, fetchResponse.clone()).then(() => {
                return fetchResponse;
              });
            }
            return fetchResponse;
          }).catch(() => {
            return cache.match(event.request); // Retourne le cache en cas d'échec
          });
        });
      })
    );
  }
  // Stratégie pour les ressources statiques
  else {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request).then((fetchResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        }).catch(() => {
          if (event.request.mode === 'navigate') {
            return caches.match('/');
          }
        })
      })
    );
  }
});

// Écoute les messages du client pour forcer une mise à jour
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
