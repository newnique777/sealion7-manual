self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('sealion7').then(cache => {
      return cache.addAll([
        './',
        './index.html',
        './app.js',
        './styles.css',
        './data.json',
        './manifest.json'
      ]);
    })
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    })
  );
});