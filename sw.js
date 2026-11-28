/**
 * Service Worker for Slay the Spire Lite (PWA offline play + fresh online deploys).
 * Strategy: Network-first with HTTP cache revalidation (`no-cache` on fetch, `reload` on precache)
 * and immediate `skipWaiting()` + `clients.claim()` so GitHub Pages `max-age=600` never traps
 * returning browsers on stale JS/CSS versions across deploys.
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
  './styles/tokens.css',
  './styles/hud.css',
  './styles/screens.css',
  './styles/combat.css',
  './styles/cards.css',
  './styles/modals.css',
  './styles/fx.css',
  './styles/responsive.css',
  './src/main.js',
  './src/data/cards.js',
  './src/data/cards/colorless_neutral.js',
  './src/data/cards/defect.js',
  './src/data/cards/format.js',
  './src/data/cards/hermit.js',
  './src/data/cards/ironclad.js',
  './src/data/cards/library.js',
  './src/data/cards/silent.js',
  './src/data/cards/watcher.js',
  './src/data/characters.js',
  './src/data/enemies.js',
  './src/data/enemies/ai_act1.js',
  './src/data/enemies/ai_act2.js',
  './src/data/enemies/ai_act3_4.js',
  './src/data/enemies/ai.js',
  './src/data/enemies/factory.js',
  './src/data/enemies/scaling.js',
  './src/data/enemies/templates.js',
  './src/data/events.js',
  './src/data/relics.js',
  './src/engine/combat.js',
  './src/engine/combat/card_play.js',
  './src/engine/combat/hermit_mechanics.js',
  './src/engine/combat/orbs.js',
  './src/engine/combat/resolution.js',
  './src/engine/combat/state.js',
  './src/engine/combat/turn_flow.js',
  './src/engine/daily.js',
  './src/engine/game.js',
  './src/engine/math.js',
  './src/engine/meta.js',
  './src/engine/rng.js',
  './src/engine/run/combat_flow.js',
  './src/engine/run/events_resolver.js',
  './src/engine/run/neow.js',
  './src/engine/run/outpost.js',
  './src/engine/run/state_helpers.js',
  './src/engine/tactics.js',
  './src/ui/actions/combat.js',
  './src/ui/actions/index.js',
  './src/ui/actions/menu.js',
  './src/ui/actions/modals.js',
  './src/ui/actions/outpost.js',
  './src/ui/app.js',
  './src/ui/audio.js',
  './src/ui/card_art.js',
  './src/ui/card_art/themes.js',
  './src/ui/card_art/wrap.js',
  './src/ui/combat_interact.js',
  './src/ui/enemy_art.js',
  './src/ui/fx.js',
  './src/ui/glossary.js',
  './src/ui/helpers.js',
  './src/ui/icons.js',
  './src/ui/potion_art.js',
  './src/ui/relic_art.js',
  './src/ui/screens/character_select.js',
  './src/ui/screens/combat.js',
  './src/ui/screens/event.js',
  './src/ui/screens/hud.js',
  './src/ui/screens/map.js',
  './src/ui/screens/modals.js',
  './src/ui/screens/outpost.js',
  './src/ui/settings.js',
  './src/ui/status_art.js',
];

const LAZY_PRECACHE_URLS = [
  './src/ui/card_art/colorless_special.js',
  './src/ui/card_art/defect_a.js',
  './src/ui/card_art/defect_b.js',
  './src/ui/card_art/defect_c.js',
  './src/ui/card_art/defect.js',
  './src/ui/card_art/exp_colorless_curses.js',
  './src/ui/card_art/exp_iron_silent.js',
  './src/ui/card_art/exp_watcher_colorless.js',
  './src/ui/card_art/hermit_a.js',
  './src/ui/card_art/hermit.js',
  './src/ui/card_art/ironclad.js',
  './src/ui/card_art/silent.js',
  './src/ui/card_art/watcher.js',
];

async function precacheFreshUrls(urls) {
  if (!Array.isArray(urls) || urls.length === 0) return;
  const cache = await caches.open(CACHE_NAME);
  let nextIdx = 0;
  const workerCount = Math.min(8, urls.length);
  const runWorker = async () => {
    while (nextIdx < urls.length) {
      const url = urls[nextIdx];
      nextIdx += 1;
      try {
        const freshReq = new Request(url, { cache: 'reload', credentials: 'same-origin' });
        const res = await fetch(freshReq);
        if (res && res.ok) {
          await cache.put(url, res);
        }
      } catch {
        // Ignore transient errors on background chunk warming
      }
    }
  };
  await Promise.all(Array.from({ length: workerCount }, () => runWorker()));
}

async function precacheFreshAssets() {
  const cache = await caches.open(CACHE_NAME);
  let nextIdx = 0;
  const workerCount = Math.min(8, PRECACHE_URLS.length);
  const runWorker = async () => {
    while (nextIdx < PRECACHE_URLS.length) {
      const url = PRECACHE_URLS[nextIdx];
      nextIdx += 1;
      const freshReq = new Request(url, { cache: 'reload', credentials: 'same-origin' });
      const res = await fetch(freshReq);
      if (res && res.ok) {
        await cache.put(url, res);
      }
    }
  };
  await Promise.all(Array.from({ length: workerCount }, () => runWorker()));
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    precacheFreshAssets().then(() => self.skipWaiting())
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
      .then(() => {
        // Warm lazy per-class card art chunks in background for full offline PWA support
        precacheFreshUrls(LAZY_PRECACHE_URLS).catch(() => {});
      })
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // For navigations (including ?seed= / ?daily= / ?debug=1), normalize offline cache key to ./index.html
  const isNav = req.mode === 'navigate';
  const networkReq = isNav
    ? new Request(req.url, { cache: 'no-cache', credentials: 'same-origin' })
    : req.cache === 'only-if-cached' && req.mode !== 'same-origin'
      ? req
      : new Request(req, { cache: 'no-cache' });

  event.respondWith(
    fetch(networkReq)
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
        const exact = (await cache.match(req)) || (await cache.match(req, { ignoreSearch: true }));
        if (exact) return exact;
        if (isNav) {
          return (await cache.match('./index.html')) || (await cache.match('./'));
        }
        return Response.error();
      })
  );
});
