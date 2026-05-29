const CACHE_NAME = 'quera-water-v1';
const ASSETS = [
  './index.html',
  './order.html',
  './order-style.css',
  './order-script.js',
  './logo.png',
  './logo_crest.png',
  './background.jpg',
  './bottle-200ml.png',
  './bottle-750ml.png',
  './bottle-1l.png',
  './bbottle-200ml.png',
  './manifest.json'
];

// Install Service Worker
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate Service Worker
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Assets
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request);
    })
  );
});
