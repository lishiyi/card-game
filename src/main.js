import { mountSpireApp } from './ui/app.js';

const root = document.getElementById('app');
if (root) {
  window.__SPIRE_APP__ = mountSpireApp(root);
}

if (
  typeof window !== 'undefined' &&
  'serviceWorker' in navigator &&
  (window.location.protocol === 'https:' || window.location.hostname === 'localhost') &&
  !window.location.pathname.endsWith('slay_the_spire_lite.html')
) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js', { scope: './' }).catch(() => {
      // Ignore SW registration failures on restricted contexts
    });
  });
}
