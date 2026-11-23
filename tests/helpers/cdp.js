import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

export const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
};

export function startStaticServer() {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const urlPath = (req.url || '/').split('?')[0];
      const relPath = urlPath === '/' ? 'index.html' : urlPath.replace(/^\/+/, '');
      const fullPath = path.resolve(ROOT_DIR, relPath);
      if (!fullPath.startsWith(ROOT_DIR) || !fs.existsSync(fullPath) || fs.statSync(fullPath).isDirectory()) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }
      const ext = path.extname(fullPath);
      res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
      res.end(fs.readFileSync(fullPath));
    });
    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const addr = server.address();
      resolve({ server, port: addr.port });
    });
  });
}

export function resolveBrowserBinary() {
  const candidates = [
    process.env.CHROME_BIN,
    'chromium',
    'chromium-browser',
    'google-chrome',
    'google-chrome-stable',
  ].filter(Boolean);

  for (const bin of candidates) {
    if (bin.includes('/') && fs.existsSync(bin)) return bin;
    const probe = spawnSync('which', [bin], { encoding: 'utf8' });
    if (probe.status === 0 && probe.stdout.trim()) {
      return probe.stdout.trim();
    }
  }
  return null;
}

function spawnSingleHeadlessChromium(timeoutMs = 12000) {
  return new Promise((resolve, reject) => {
    const browserBin = resolveBrowserBinary();
    const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'spire-chrome-'));
    const proc = spawn(
      browserBin,
      [
        '--headless=new',
        '--no-sandbox',
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--no-first-run',
        '--no-default-browser-check',
        '--password-store=basic',
        '--use-mock-keychain',
        '--metrics-recording-only',
        '--disable-breakpad',
        '--disable-background-networking',
        '--disable-renderer-backgrounding',
        '--disable-background-timer-throttling',
        '--disable-ipc-flooding-protection',
        '--disable-extensions',
        '--disable-component-extensions-with-background-pages',
        '--disable-default-apps',
        '--disable-sync',
        '--mute-audio',
        '--disable-features=Translate,BackForwardCache,AcceptCHFrame',
        `--user-data-dir=${userDataDir}`,
        '--window-size=1280,880',
        '--remote-debugging-port=0',
        'about:blank',
      ],
      { stdio: ['ignore', 'ignore', 'pipe'], detached: true }
    );

    const cleanupProfile = () => {
      try {
        fs.rmSync(userDataDir, { recursive: true, force: true });
      } catch {
        // Ignore temp cleanup race
      }
    };

    const killGroup = () => {
      try {
        process.kill(-proc.pid, 'SIGKILL');
      } catch {
        try {
          proc.kill('SIGKILL');
        } catch {
          // Ignore kill race
        }
      }
    };

    let settled = false;
    let stderrBuf = '';
    const activePortPath = path.join(userDataDir, 'DevToolsActivePort');

    const finishResolve = (browserWsUrl) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      clearInterval(portPoller);
      resolve({ proc, browserWsUrl, userDataDir, cleanupProfile, killGroup });
    };

    const finishReject = (err) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      clearInterval(portPoller);
      killGroup();
      cleanupProfile();
      reject(err);
    };

    const timer = setTimeout(() => {
      finishReject(new Error(`Timed out waiting for Chromium DevTools endpoint: ${stderrBuf}`));
    }, timeoutMs);

    const portPoller = setInterval(() => {
      try {
        if (!fs.existsSync(activePortPath)) return;
        const lines = fs.readFileSync(activePortPath, 'utf8').trim().split(/\r?\n/);
        if (lines.length >= 2 && /^\d+$/.test(lines[0]) && lines[1].startsWith('/')) {
          finishResolve(`ws://127.0.0.1:${lines[0]}${lines[1]}`);
        }
      } catch {
        // File may still be mid-write; retry next tick
      }
    }, 100);

    proc.stderr.on('data', (chunk) => {
      stderrBuf += chunk.toString();
      const match = stderrBuf.match(/DevTools listening on (ws:\/\/[^\s]+)/);
      if (match) {
        finishResolve(match[1]);
      }
    });

    proc.on('error', (err) => {
      finishReject(err);
    });

    proc.on('exit', (code, signal) => {
      if (!settled) {
        finishReject(
          new Error(`Chromium exited before DevTools ready (code=${code}, signal=${signal}): ${stderrBuf}`)
        );
      }
    });
  });
}

async function probeBrowserRendererReady(browser) {
  const debugPort = new URL(browser.browserWsUrl).port;
  const targets = await (await fetch(`http://127.0.0.1:${debugPort}/json/list`)).json();
  const pageTarget = targets.find((x) => x.type === 'page');
  if (!pageTarget?.webSocketDebuggerUrl) return false;
  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  try {
    await new Promise((resolve, reject) => {
      const tm = setTimeout(() => reject(new Error('probe ws timeout')), 2500);
      ws.addEventListener('open', () => { clearTimeout(tm); resolve(); }, { once: true });
      ws.addEventListener('error', (err) => { clearTimeout(tm); reject(err); }, { once: true });
    });
    const ok = await new Promise((resolve) => {
      const tm = setTimeout(() => resolve(false), 2500);
      ws.addEventListener('message', (ev) => {
        const msg = JSON.parse(String(ev.data));
        if (msg.id === 1) {
          clearTimeout(tm);
          resolve(msg.result?.result?.value === 1);
        }
      });
      ws.send(JSON.stringify({ id: 1, method: 'Runtime.evaluate', params: { expression: '1', returnByValue: true } }));
    });
    return ok;
  } catch {
    return false;
  } finally {
    try { ws.close(); } catch { /* ignore */ }
  }
}

export async function launchHeadlessChromium() {
  let lastError = null;
  const attemptTimeouts = [10000, 12000, 15000];
  for (let attempt = 0; attempt < attemptTimeouts.length; attempt += 1) {
    let browser = null;
    try {
      browser = await spawnSingleHeadlessChromium(attemptTimeouts[attempt]);
      const healthy = await probeBrowserRendererReady(browser);
      if (healthy) return browser;
      lastError = new Error('Chromium renderer healthcheck failed');
    } catch (err) {
      lastError = err;
    }
    if (browser) {
      browser.killGroup();
      browser.cleanupProfile();
    }
  }
  throw lastError || new Error('Failed to launch headless Chromium');
}

export async function teardownSession({ server, browser, cdp }) {
  try {
    cdp?.ws?.close();
  } catch {
    // Ignore ws close error
  }
  if (browser?.proc) {
    const exited = new Promise((r) => {
      if (browser.proc.exitCode !== null) r();
      else browser.proc.once('exit', r);
    });
    if (browser.killGroup) {
      browser.killGroup();
    } else {
      try {
        browser.proc.kill('SIGKILL');
      } catch {
        // Ignore kill error
      }
    }
    await Promise.race([exited, new Promise((r) => setTimeout(r, 500))]);
    browser.cleanupProfile?.();
  }
  if (server) {
    server.closeAllConnections?.();
    await new Promise((r) => server.close(r));
  }
}

export async function createCdpClient(pageWsUrl) {
  const ws = new WebSocket(pageWsUrl);
  await new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve, { once: true });
    ws.addEventListener('error', reject, { once: true });
  });

  let nextId = 1;
  const pending = new Map();
  const events = [];
  const methodWaiters = new Map();
  let pageDomainEnabled = false;

  const waitForAnyEvent = (eventNames, timeoutMs = 5000) =>
    new Promise((resolve) => {
      let settled = false;
      const cleanups = [];
      const finish = (result) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        for (const fn of cleanups) fn();
        resolve(result);
      };
      const timer = setTimeout(() => finish({ event: null, params: null }), timeoutMs);
      for (const eventName of eventNames) {
        const list = methodWaiters.get(eventName) || [];
        const handler = (params = null) => finish({ event: eventName, params });
        list.push(handler);
        methodWaiters.set(eventName, list);
        cleanups.push(() => {
          const cur = methodWaiters.get(eventName);
          if (cur) {
            const idx = cur.indexOf(handler);
            if (idx !== -1) cur.splice(idx, 1);
          }
        });
      }
    });

  let lastEmulationParams = null;

  ws.addEventListener('close', () => {
    for (const [, p] of pending) {
      clearTimeout(p.timer);
      p.reject(new Error('CDP WebSocket closed before receiving response'));
    }
    pending.clear();
    for (const [, waiters] of methodWaiters) {
      for (const fn of [...waiters]) fn(null);
    }
    methodWaiters.clear();
  });

  ws.addEventListener('message', (ev) => {
    const msg = JSON.parse(String(ev.data));
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject, timer } = pending.get(msg.id);
      clearTimeout(timer);
      pending.delete(msg.id);
      if (msg.error) reject(new Error(msg.error.message));
      else resolve(msg.result);
    } else if (msg.method) {
      events.push(msg);
      const waiters = methodWaiters.get(msg.method);
      if (waiters && waiters.length > 0) {
        const snapshot = [...waiters];
        waiters.length = 0;
        for (const fn of snapshot) fn(msg.params);
      }
    }
  });

  function sendRaw(method, params = {}, timeoutMs = 15000) {
    const id = nextId++;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        if (pending.has(id)) {
          pending.delete(id);
          reject(new Error(`CDP call timed out after ${Math.round(timeoutMs / 1000)}s: ${method}`));
        }
      }, timeoutMs);
      pending.set(id, { resolve, reject, timer });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async function send(method, params = {}) {
    if (method === 'Page.enable') {
      const res = await sendRaw(method, params);
      pageDomainEnabled = true;
      return res;
    }
    if (method === 'Emulation.setDeviceMetricsOverride') {
      lastEmulationParams = params;
      return sendRaw(method, params);
    }
    if (method === 'Page.navigate' && pageDomainEnabled) {
      const targetUrl = String(params?.url || '');
      const navToken = `nav_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      try {
        await sendRaw(
          'Runtime.evaluate',
          {
            expression: `window.__CDP_NAV_TOKEN__ = ${JSON.stringify(navToken)}; true`,
            returnByValue: true,
          },
          1500
        );
      } catch {
        // Ignore if previous execution context is not ready.
      }
      let lastRes = null;
      for (let attempt = 0; attempt < 6; attempt += 1) {
        const navOutcomePromise = waitForAnyEvent(
          ['Page.loadEventFired', 'Inspector.targetCrashed'],
          4000
        );
        try {
          lastRes = await sendRaw(method, params, 5000);
        } catch {
          await new Promise((r) => setTimeout(r, 120));
          continue;
        }
        const outcome = await navOutcomePromise;
        if (outcome.event === 'Inspector.targetCrashed') {
          await new Promise((r) => setTimeout(r, 120));
          try {
            await sendRaw('Runtime.enable', {}, 2000);
            await sendRaw('Page.enable', {}, 2000);
            if (lastEmulationParams) {
              await sendRaw('Emulation.setDeviceMetricsOverride', lastEmulationParams, 2000);
            }
          } catch {
            // Re-enable domains best-effort before retrying navigation.
          }
          continue;
        }
        if (!targetUrl.startsWith('http://127.0.0.1:')) {
          if (outcome.event === 'Page.loadEventFired') {
            break;
          }
          continue;
        }
        let committed = false;
        const readyDeadline = Date.now() + 2500;
        while (Date.now() < readyDeadline) {
          try {
            const check = await sendRaw(
              'Runtime.evaluate',
              {
                expression: `location.href.startsWith('http://127.0.0.1:') && Boolean(window.__SPIRE_APP__) && document.readyState === 'complete' && window.__CDP_NAV_TOKEN__ !== ${JSON.stringify(navToken)}`,
                returnByValue: true,
              },
              1500
            );
            if (check?.result?.value === true) {
              committed = true;
              break;
            }
          } catch {
            // Transient execution-context destruction while navigation commits.
          }
          await new Promise((r) => setTimeout(r, 40));
        }
        if (committed) {
          break;
        }
      }
      return lastRes;
    }
    return sendRaw(method, params);
  }

  async function evaluate(expression) {
    const res = await send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    if (res.exceptionDetails) {
      throw new Error(`Page evaluation error: ${JSON.stringify(res.exceptionDetails)}`);
    }
    return res.result.value;
  }

  return { ws, send, evaluate, events };
}

export async function launchHeroFromCharacterSelect(cdp, characterId = 'ironclad') {
  const deadline = Date.now() + 8000;
  while (Date.now() < deadline) {
    const ready = await cdp.evaluate(`Boolean(window.__SPIRE_APP__)`);
    if (ready) break;
    await new Promise((r) => setTimeout(r, 30));
  }
  const launched = await cdp.evaluate(`(() => {
    if (document.getElementById('main-menu-screen')) {
      document.getElementById('btn-menu-standard')?.click();
    }
    const screen = document.getElementById('character-select-screen');
    if (!screen) return false;
    const card = document.getElementById('char-card-${characterId}');
    if (card && !card.classList.contains('selected')) {
      card.click();
    }
    const startBtn = document.getElementById('btn-start-character-run');
    if (startBtn) startBtn.click();
    return true;
  })()`);
  if (launched) {
    await new Promise((r) => setTimeout(r, 80));
  }
}

/**
 * Shares a single headless Chromium process and static HTTP server across all E2E tests
 * in a test file, isolating each test inside its own fresh incognito BrowserContext + Tab.
 */
export function createSharedBrowserSuite() {
  let server = null;
  let port = 0;
  let browser = null;
  let browserCdp = null;

  async function ensureStarted() {
    if (!server) {
      const started = await startStaticServer();
      server = started.server;
      port = started.port;
    }
    if (!browser || browser.proc.exitCode !== null || !browserCdp || browserCdp.ws.readyState !== WebSocket.OPEN) {
      if (browser) {
        await teardownSession({ server: null, browser, cdp: browserCdp });
      }
      browser = await launchHeadlessChromium();
      browserCdp = await createCdpClient(browser.browserWsUrl);
    }
  }

  async function openIsolatedPage() {
    await ensureStarted();
    const { browserContextId } = await browserCdp.send('Target.createBrowserContext', {
      disposeOnDetach: true,
    });
    const { targetId } = await browserCdp.send('Target.createTarget', {
      url: 'about:blank',
      browserContextId,
    });
    const debugPort = new URL(browser.browserWsUrl).port;
    let pageTarget = null;
    for (let i = 0; i < 20; i += 1) {
      const targets = await (await fetch(`http://127.0.0.1:${debugPort}/json/list`)).json();
      pageTarget = targets.find((x) => x.id === targetId && x.webSocketDebuggerUrl);
      if (pageTarget) break;
      await new Promise((r) => setTimeout(r, 30));
    }
    if (!pageTarget) {
      throw new Error(`Failed to resolve WebSocket URL for target ${targetId}`);
    }
    const cdp = await createCdpClient(pageTarget.webSocketDebuggerUrl);

    let closed = false;
    async function close() {
      if (closed) return;
      closed = true;
      try {
        cdp.ws.close();
      } catch {
        // Ignore close race
      }
      if (browserCdp && browserCdp.ws.readyState === WebSocket.OPEN) {
        try {
          await browserCdp.send('Target.closeTarget', { targetId });
        } catch {
          // Ignore target close race
        }
        try {
          await browserCdp.send('Target.disposeBrowserContext', { browserContextId });
        } catch {
          // Ignore context dispose race
        }
      }
    }

    return { cdp, port, server, browser, close };
  }

  async function stop() {
    await teardownSession({ server, browser, cdp: browserCdp });
    server = null;
    port = 0;
    browser = null;
    browserCdp = null;
  }

  return { ensureStarted, openIsolatedPage, stop };
}
