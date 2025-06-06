// sw.js
const CACHE_NAME = 'meditations-cache-v1';
const API_CACHE_NAME = 'meditations-api-cache-v1';

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
  // Force l’activation immédiate du nouveau service worker
  self.skipWaiting();
});

// Activation du service worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activated');
  // Supprime les anciens caches pour éviter les conflits
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Prend le contrôle des pages immédiatement
  self.clients.claim();
});

// Gestion des requêtes (fetch)
self.addEventListener('fetch', (event) => {
  // Stratégie : Cache First pour les ressources statiques, Network First pour les API
  if (event.request.url.includes('/api/')) {
    // Network First pour les requêtes API
    event.respondWith(
      fetch(event.request).then((fetchResponse) => {
        // Met en cache la réponse API
        return caches.open(API_CACHE_NAME).then((cache) => {
          cache.put(event.request, fetchResponse.clone());
          return fetchResponse;
        });
      }).catch(() => {
        // Si hors ligne, utilise le cache
        return caches.match(event.request);
      })
    );
  } else {
    // Cache First pour les ressources statiques
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request).then((fetchResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        });
      }).catch(() => {
        // Si hors ligne et rien dans le cache, retourne une réponse par défaut si nécessaire
        if (event.request.mode === 'navigate') {
          return caches.match('/');
        }
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
