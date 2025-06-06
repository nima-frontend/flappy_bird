const CACHE_NAME = "flappy-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/assets/master.css",
  "/assets/app.js",
  "/assets/fonts/flappy-font.ttf",
  "/assets/img/favicon_io/apple-touch-icon.png",
  "/assets/img/favicon_io/favicon-16x16.png",
  "/assets/img/favicon_io/favicon-32x32.png",
  "/assets/img/bg.jpg",
  "/assets/img/bird.blue.png",
  "/assets/img/block.png",
  "/manifest.json",
  "/public/android-chrome-192x192.png",
  "/public/android-chrome-512x512.png",
];

// Install and cache required assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// Activate and clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((oldCache) => caches.delete(oldCache))
      )
    )
  );
  self.clients.claim();
});

// Intercept fetch requests
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return (
        cachedResponse ||
        fetch(event.request).catch(() =>
          caches.match("/flappy_bird/") // fallback for offline
        )
      );
    })
  );
});
