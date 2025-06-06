self.addEventListener("install", event => {
  event.waitUntil(
    caches.open("v1").then(cache => {
      return cache.addAll([
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
        "/public/android-chrome-512x512.png"
      ]);
    })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request);
    })
  );
});
