const CACHE_NAME = 'meditations-cache-v2';
const API_CACHE_NAME = 'meditations-api-cache-v2';
const MP3_CACHE_NAME = 'meditations-mp3-cache-v2';

const STATIC_ASSETS = [
  '/',
  '/logo.png',
  '/share-icon.png',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

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

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

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
  } else if (url.pathname.endsWith('.mp3')) {
    event.respondWith(
      caches.open(MP3_CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse.blob().then((blob) => {
              if (blob.size > 0) {
                return cachedResponse;
              } else {
                console.log('Cached MP3 file is empty, re-fetching:', event.request.url);
                return fetch(event.request).then((fetchResponse) => {
                  if (fetchResponse.status === 200) {
                    return cache.put(event.request, fetchResponse.clone()).then(() => {
                      return fetchResponse;
                    });
                  }
                  return fetchResponse;
                }).catch(() => {
                  return null;
                });
              }
            });
          }
          return fetch(event.request).then((fetchResponse) => {
            if (fetchResponse.status === 200) {
              return caches.open(MP3_CACHE_NAME).then((cache) => {
                cache.keys().then((keys) => {
                  let totalSize = 0;
                  keys.forEach((request) => {
                    totalSize += request.size || 0; // Estimation approximative
                  });
                  const maxSize = 65 * 1024 * 1024; // Limite de 65 Mo
                  if (totalSize > maxSize) {
                    keys.sort((a, b) => a.time - b.time); // Tri approximatif par date
                    while (totalSize > maxSize && keys.length > 0) {
                      const oldestRequest = keys.shift();
                      cache.delete(oldestRequest);
                      totalSize -= oldestRequest.size || 0;
                    }
                  }
                });
                return cache.put(event.request, fetchResponse.clone()).then(() => {
                  return fetchResponse;
                });
              });
            }
            return fetchResponse;
          }).catch(() => {
            return cache.match(event.request);
          });
        })
      })
    );
  } else {
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

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
