const CACHE_NAME = 'setline-v7-0-2-shell-v1';
const RUNTIME_CACHE = 'setline-v7-0-2-runtime-v1';
const CDN_ASSETS = [
  'https://unpkg.com/react@18.3.1/umd/react.production.min.js',
  'https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js',
  'https://unpkg.com/@mui/material@5.16.7/umd/material-ui.production.min.js',
  'https://unpkg.com/htm@3.1.1/dist/htm.umd.js'
];
const APP_SHELL = [
  './', './index.html', './app.js', './styles.css', './manifest.webmanifest',
  './setline-s.svg', './setline-s-32.png', './setline-s-180.png', './setline-s-192.png',
  './setline-s-512.png', './setline-s-maskable-192.png', './setline-s-maskable-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(Promise.all([
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)),
    caches.open(RUNTIME_CACHE).then(cache => Promise.allSettled(CDN_ASSETS.map(url => fetch(url, {mode:'no-cors'}).then(response => cache.put(url, response)))))
  ]));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(key => ![CACHE_NAME,RUNTIME_CACHE].includes(key)).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).then(response => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put('./index.html', copy));
        return response;
      }).catch(() => caches.match('./index.html'))
    );
    return;
  }

  const isDependency = ['unpkg.com','fonts.googleapis.com','fonts.gstatic.com'].includes(url.hostname);
  if (isDependency) {
    event.respondWith(
      caches.open(RUNTIME_CACHE).then(async cache => {
        const cached = await cache.match(request);
        const network = fetch(request).then(response => {
          if (response && (response.ok || response.type === 'opaque')) cache.put(request, response.clone());
          return response;
        }).catch(() => cached);
        return cached || network;
      })
    );
    return;
  }

  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(request).then(cached => cached || fetch(request).then(response => {
        if (response.ok) caches.open(RUNTIME_CACHE).then(cache => cache.put(request,response.clone()));
        return response;
      }))
    );
  }
});
