const CACHE = "pwa", offlineFallbackPage = "offline";

self.addEventListener("install", event => event.waitUntil(caches.open(CACHE).then(cache => cache.add(offlineFallbackPage))));

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  event.respondWith(fetch(event.request).catch(error => {
      if (event.request.destination !== "document" || event.request.mode !== "navigate") return;
      console.error("[PWA] Network request Failed. Serving offline page " + error);
      return caches.open(CACHE).then(cache => cache.match(offlineFallbackPage));
    })
  );
});

self.addEventListener("refreshOffline", () => {
  const offlinePageRequest = new Request(offlineFallbackPage);

  return fetch(offlineFallbackPage).then(response => caches.open(CACHE).then(cache => {
    console.log("[PWA Builder] Offline page updated from refreshOffline event: " + response.url);
    return cache.put(offlinePageRequest, response);
  }))
});
