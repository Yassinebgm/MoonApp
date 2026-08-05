const CACHE_NAME = "hueco-mundo-v1";
const ASSETS = [
    "./",
    "./index.html",
    "./style.css",
    "./app.js",
    "./manifest.json",
    "./img/icon-192.png",
    "./img/icon-512.png",
    "./img/layered-waves-haikei.svg"
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        cashes.open(CACHE_NAME).then((cache) => cache.addALL(ASSETS))     
    );
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        cashes.keys().then((keys) =>
            Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => cashes.delete(k)))
    )
    );
    self.clients.claim();
});
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request);
    })
  );
});