import { mountSpireApp } from './ui/app.js';

const root = document.getElementById('app');
if (root) {
  window.__SPIRE_APP__ = mountSpireApp(root);
}
