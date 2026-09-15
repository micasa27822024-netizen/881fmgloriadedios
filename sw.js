const CACHE_NAME = 'radio-v1';

self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  return self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  // Manejo de peticiones necesario para cumplir con el estándar PWA en Chrome PC
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
