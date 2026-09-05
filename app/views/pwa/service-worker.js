// Service worker for Rails Utilities PWA
// Navigations: network-first (never serve a stale app shell).
// Static assets: stale-while-revalidate.

const VERSION = 'v2';
const STATIC_CACHE = `static-${VERSION}`;
const DYNAMIC_CACHE = `dynamic-${VERSION}`;
const KEEP_CACHES = [STATIC_CACHE, DYNAMIC_CACHE];

// App shell entries pre-cached so a cold offline launch still boots.
const APP_SHELL_FILES = ['/', '/manifest.json', '/icon.png', '/icon.svg'];

// Paths the service worker must never touch: the Vite dev server pipeline
// (unhashed, constantly changing), the SW itself, and Rails health/PWA routes.
const BYPASS = [/^\/vite-dev\//, /^\/@vite/, /^\/@id\//, /^\/@fs\//, /^\/service-worker/, /^\/up$/];

const isBypassed = (pathname) => BYPASS.some((re) => re.test(pathname));

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) =>
      // addAll() rejects the whole install if a single entry 404s, so add
      // each entry independently and tolerate individual failures.
      Promise.allSettled(APP_SHELL_FILES.map((url) => cache.add(new Request(url, { cache: 'reload' }))))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(names.filter((n) => !KEEP_CACHES.includes(n)).map((n) => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (isBypassed(url.pathname)) return;

  // Navigations: always try the network first so a deploy is picked up
  // immediately; fall back to cache, then to the cached app shell.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match('/')))
    );
    return;
  }

  // Assets: serve from cache immediately, refresh in the background.
  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((response) => {
          if (response && response.status === 200 && response.type === 'basic') {
            const copy = response.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});

// Handle push notifications (placeholder for future implementation)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icon.png',
      badge: '/icon.png',
      data: {
        url: data.url || '/'
      }
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // If window already open, focus it
      for (const client of clientList) {
        const clientPath = (new URL(client.url)).pathname;
        if (clientPath === event.notification.data.url && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise open new window
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url);
      }
    })
  );
});
