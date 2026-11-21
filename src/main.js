import { mountSpireApp } from './ui/app.js';

const root = document.getElementById('app');
if (root) {
  window.__SPIRE_APP__ = mountSpireApp(root);
}

function showSwUpdateBanner(waitingWorker) {
  if (typeof document === 'undefined' || !document.body) return null;
  let banner = document.getElementById('sw-update-banner');
  if (!banner) {
    banner = document.createElement('div');
    banner.id = 'sw-update-banner';
    banner.className = 'sw-update-banner';
    banner.setAttribute('role', 'status');
    banner.setAttribute('aria-live', 'polite');
    banner.innerHTML = `
      <span class="sw-update-text">✨ 发现新版本，点击刷新以加载最新内容</span>
      <div class="sw-update-actions">
        <button type="button" id="btn-sw-refresh" class="btn-brass btn-compact">立即刷新</button>
        <button type="button" id="btn-sw-dismiss" class="btn-stone btn-compact">稍后</button>
      </div>
    `;
    document.body.appendChild(banner);
  }
  const refreshBtn = banner.querySelector('#btn-sw-refresh');
  const dismissBtn = banner.querySelector('#btn-sw-dismiss');
  if (refreshBtn) {
    refreshBtn.onclick = () => {
      refreshBtn.disabled = true;
      refreshBtn.textContent = '正在刷新…';
      if (waitingWorker && typeof waitingWorker.postMessage === 'function') {
        waitingWorker.postMessage({ type: 'SKIP_WAITING' });
      } else {
        window.location.reload();
      }
    };
  }
  if (dismissBtn) {
    dismissBtn.onclick = () => {
      banner.remove();
    };
  }
  return banner;
}

if (typeof window !== 'undefined') {
  window.__SPIRE_SHOW_SW_UPDATE__ = showSwUpdateBanner;
}

if (
  typeof window !== 'undefined' &&
  'serviceWorker' in navigator &&
  (window.location.protocol === 'https:' || window.location.hostname === 'localhost') &&
  !window.location.pathname.endsWith('slay_the_spire_lite.html')
) {
  let swRefreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (swRefreshing) return;
    swRefreshing = true;
    window.location.reload();
  });

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('./sw.js', { scope: './' })
      .then((registration) => {
        if (registration.waiting && navigator.serviceWorker.controller) {
          showSwUpdateBanner(registration.waiting);
        }
        registration.addEventListener('updatefound', () => {
          const installing = registration.installing;
          if (!installing) return;
          installing.addEventListener('statechange', () => {
            if (installing.state === 'installed' && navigator.serviceWorker.controller) {
              showSwUpdateBanner(registration.waiting || installing);
            }
          });
        });
      })
      .catch(() => {
        // Ignore SW registration failures on restricted contexts
      });
  });
}
