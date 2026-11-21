/**
 * Service Worker for Slay the Spire Lite (PWA offline play + fresh online deploys).
 * Strategy: Network-first with automatic cache update for same-origin app assets,
 * falling back seamlessly to cached resources when offline.
 */

const CACHE_VERSION = '__SW_CACHE_VERSION__';
const CACHE_NAME = `sts-lite-pwa-${CACHE_VERSION}`;

const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './styles/main.css',
  './src/main.js',
  './src/data/cards.js',
  './src/data/characters.js',
  './src/data/enemies.js',
  './src/data/events.js',
  './src/data/relics.js',
  './src/engine/combat.js',
  './src/engine/daily.js',
  './src/engine/game.js',
  './src/engine/math.js',
  './src/engine/meta.js',
  './src/engine/rng.js',
  './src/engine/tactics.js',
  './src/ui/app.js',
  './src/ui/audio.js',
  './src/ui/card_art.js',
  './src/ui/combat_interact.js',
  './src/ui/enemy_art.js',
  './src/ui/fx.js',
  './src/ui/glossary.js',
  './src/ui/helpers.js',
  './src/ui/icons.js',
  './src/ui/settings.js',
  './src/ui/screens/character_select.js',
  './src/ui/screens/combat.js',
  './src/ui/screens/event.js',
  './src/ui/screens/hud.js',
  './src/ui/screens/map.js',
  './src/ui/screens/modals.js',
  './src/ui/screens/outpost.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => {
        // Activate immediately on first install; on updates, wait for user confirmation via SKIP_WAITING
        if (!self.registration.active) {
          return self.skipWaiting();
        }
        return undefined;
      })
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // For navigations (including ?seed= / ?daily= / ?debug=1), normalize cache fallback to ./index.html
  const isNav = req.mode === 'navigate';

  event.respondWith(
    fetch(req)
      .then((res) => {
        if (res && res.ok) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(isNav ? './index.html' : req, clone).catch(() => {});
          });
        }
        return res;
      })
      .catch(async () => {
        const cache = await caches.open(CACHE_NAME);
        const exact = await cache.match(req);
        if (exact) return exact;
        if (isNav) {
          return (await cache.match('./index.html')) || (await cache.match('./'));
        }
        return Response.error();
      })
  );
});
