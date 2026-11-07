/* Spottr: cache the app shell so it opens without a connection. Map tiles are not cached. */
const C = "relay-v11";
const FILES = ["./", "index.html", "onboard-find.webp", "onboard-exit.webp", "data-bluegate.js", "data-bluegate-places.js", "data-dam.js", "data-buried-city.js", "data-spaceport.js", "data-stella-montis.js", "data-riven-tides.js", "data-pendola-pass.js", "data-zones.js", "data-loot.js", "data-items.js", "fonts/inter-tight-400.woff2", "fonts/inter-tight-500.woff2", "fonts/inter-tight-600.woff2", "fonts/inter-tight-700.woff2", "leaflet.js", "leaflet.css", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(C).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (u.origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(r => { const copy = r.clone(); caches.open(C).then(c => c.put(e.request, copy)); return r; }).catch(() => caches.match(e.request)));
});
