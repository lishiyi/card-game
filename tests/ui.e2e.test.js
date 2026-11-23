import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { writeStandaloneBundle } from '../scripts/build-standalone.mjs';

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
};

function startStaticServer() {
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

function resolveBrowserBinary() {
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

async function launchHeadlessChromium() {
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

async function teardownSession({ server, browser, cdp }) {
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

async function createCdpClient(pageWsUrl) {
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

async function launchHeroFromCharacterSelect(cdp, characterId = 'ironclad') {
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

test('Real Chromium browser E2E flow: map -> modal -> combat -> play card -> potion -> end turn -> new run with zero console/page errors', async (t) => {
  if (!resolveBrowserBinary()) {
    t.skip('Chromium/Chrome binary not available');
    return;
  }

  const { server, port } = await startStaticServer();
  let browser = null;
  let cdp = null;

  try {
    browser = await launchHeadlessChromium();
    const debugPort = new URL(browser.browserWsUrl).port;
    const targetsResp = await fetch(`http://127.0.0.1:${debugPort}/json/list`);
    const targets = await targetsResp.json();
    const pageTarget = targets.find((x) => x.type === 'page');
    assert.ok(pageTarget, 'Expected a page target in Chromium');

    cdp = await createCdpClient(pageTarget.webSocketDebuggerUrl);
    await cdp.send('Runtime.enable');
    await cdp.send('Page.enable');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 880,
      deviceScaleFactor: 1,
      mobile: false,
    });

    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${port}/` });
    await new Promise((r) => setTimeout(r, 350));
    await launchHeroFromCharacterSelect(cdp, 'ironclad');

    // 1. Verify SEO, 3 starter potion slots, 16-Floor Map Bezier curve routes, and distinct monster icons for Combat vs Elite
    const initialAudit = await cdp.evaluate(`(() => {
      const nodeBtns = [...document.querySelectorAll('.map-node-btn')];
      const edgePaths = [...document.querySelectorAll('.map-edges-svg path.map-edge-path')];
      const combatIconWrap = document.querySelector('.node-icon-wrap.node-type-combat');
      const eliteIconWrap = document.querySelector('.node-icon-wrap.node-type-elite');
      return {
        h1Count: document.querySelectorAll('h1').length,
        title: document.title,
        floorIndicator: document.querySelector('.floor-indicator')?.textContent?.trim(),
        potionSlotCount: document.querySelectorAll('[id^="potion-slot-"]').length,
        hasPotionSlot2: Boolean(document.getElementById('potion-slot-2')),
        mapRowCount: document.querySelectorAll('.map-row').length,
        hasMapNode: Boolean(document.getElementById('map-node-f1_c0')),
        hasBossFloor16: Boolean(document.getElementById('map-node-f16_c0')),
        legacySvgLines: document.querySelectorAll('.map-edges-svg line').length,
        bezierEdgeCount: edgePaths.length,
        allCubicBezier: edgePaths.length > 0 && edgePaths.every((p) => /^M\\s+[\\d.]+\\s+[\\d.]+\\s+C\\s+/.test(p.getAttribute('d') || '')),
        deckBtnText: document.getElementById('btn-open-deck')?.textContent?.trim(),
        allNodesHaveIcons: nodeBtns.length > 0 && nodeBtns.every((b) => Boolean(b.querySelector('[data-node-icon]'))),
        combatSvgMarkup: combatIconWrap?.innerHTML || '',
        eliteSvgMarkup: eliteIconWrap?.innerHTML || '',
        combatIconColor: combatIconWrap ? getComputedStyle(combatIconWrap).color : '',
        eliteIconColor: eliteIconWrap ? getComputedStyle(eliteIconWrap).color : '',
      };
    })()`);

    assert.equal(initialAudit.h1Count, 1, 'Should have exactly 1 h1');
    assert.ok(initialAudit.title.includes('杀戮尖塔'));
    assert.equal(initialAudit.floorIndicator, '第 1 / 16 层');
    assert.equal(initialAudit.potionSlotCount, 3, 'HUD must render 3 starter potion belt slots');
    assert.equal(initialAudit.hasPotionSlot2, true, 'HUD must render #potion-slot-2');
    assert.equal(initialAudit.mapRowCount, 16);
    assert.equal(initialAudit.hasMapNode, true);
    assert.equal(initialAudit.hasBossFloor16, true);
    assert.equal(initialAudit.legacySvgLines, 0, 'Map must no longer use straight dashed <line> elements');
    assert.ok(initialAudit.bezierEdgeCount >= 22, 'Expected 16-floor Spire map cubic Bezier route curves');
    assert.equal(initialAudit.allCubicBezier, true, 'Every map edge must be a smooth cubic Bezier curve');
    assert.equal(initialAudit.deckBtnText, '🃏 牌组 (10)');
    assert.equal(initialAudit.allNodesHaveIcons, true, 'Every map node must render an icon');
    assert.notEqual(initialAudit.combatSvgMarkup, initialAudit.eliteSvgMarkup, 'Normal combat and Elite must use distinct monster icons');
    assert.notEqual(initialAudit.combatIconColor, initialAudit.eliteIconColor, 'Normal combat and Elite icons must have distinct color accents');

    // Optional screenshot export when SCRATCH_SCREENSHOT_DIR env is provided
    if (process.env.SCRATCH_SCREENSHOT_DIR) {
      fs.mkdirSync(process.env.SCRATCH_SCREENSHOT_DIR, { recursive: true });
      const shotMap = await cdp.send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(
        path.join(process.env.SCRATCH_SCREENSHOT_DIR, 'map_screen.png'),
        Buffer.from(shotMap.data, 'base64')
      );
    }

    // 2. Open Deck modal and close with Escape
    await cdp.evaluate(`document.getElementById('btn-open-deck').click()`);
    assert.equal(await cdp.evaluate(`Boolean(document.getElementById('modal-backdrop'))`), true);
    await cdp.evaluate(`window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))`);
    assert.equal(await cdp.evaluate(`Boolean(document.getElementById('modal-backdrop'))`), false);

    // 3. Verify Floor 0 Neow's Blessing locks F1 until chosen, then resolve Neow and enter Floor 1 Combat
    const neowGateAudit = await cdp.evaluate(`(() => {
      const f1Before = document.getElementById('map-node-f1_c0');
      const lockedBefore = f1Before?.getAttribute('aria-disabled') === 'true';
      const hasNeowPanel = Boolean(document.getElementById('neow-blessing-panel'));
      document.getElementById('neow-choice-0').click();
      if (document.getElementById('neow-action-modal')) {
        document.querySelector('#neow-action-modal [data-action="complete-neow-action"]').click();
      }
      const unlockedAfter = document.getElementById('map-node-f1_c0')?.getAttribute('aria-disabled') === 'false';
      return { lockedBefore, hasNeowPanel, unlockedAfter };
    })()`);
    assert.equal(neowGateAudit.hasNeowPanel, true);
    assert.equal(neowGateAudit.lockedBefore, true);
    assert.equal(neowGateAudit.unlockedAfter, true);

    await cdp.evaluate(`document.getElementById('map-node-f1_c0').click()`);
    const combatAudit = await cdp.evaluate(`({
      screen: window.__SPIRE_APP__.getState().screen,
      handCount: document.querySelectorAll('#hand-tray .game-card').length,
      energyText: document.getElementById('energy-orb')?.textContent?.replace(/\\s+/g, ''),
    })`);
    assert.equal(combatAudit.screen, 'combat');
    assert.equal(combatAudit.handCount, 5);
    assert.ok(combatAudit.energyText.startsWith('3/3'));

    if (process.env.SCRATCH_SCREENSHOT_DIR) {
      const shotCombat = await cdp.send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(
        path.join(process.env.SCRATCH_SCREENSHOT_DIR, 'combat_screen.png'),
        Buffer.from(shotCombat.data, 'base64')
      );
    }

    // 4. Play first card in hand & use starting potion & end turn (clicking targetable enemy if 2+ enemies spawned)
    const initialHandIds = await cdp.evaluate(`window.__SPIRE_APP__.getState().combat.hand.map(c => c.instanceId)`);
    await cdp.evaluate(`(() => {
      const hand = window.__SPIRE_APP__.getState().combat.hand;
      const basic = hand.find((c) => ['defend', 'strike', 'bash'].includes(c.cardId));
      const cardEl =
        (basic && document.getElementById('hand-card-' + basic.instanceId)) ||
        document.querySelector('#hand-tray .game-card.playable');
      cardEl.click();
      const targetEl = document.querySelector('.fighter-unit.enemy-targetable');
      if (targetEl) targetEl.click();
    })()`);
    const afterCardHand = await cdp.evaluate(`document.querySelectorAll('#hand-tray .game-card').length`);
    assert.equal(afterCardHand, 4);

    if (await cdp.evaluate(`window.__SPIRE_APP__.getState().screen === 'combat'`)) {
      await cdp.evaluate(`(() => {
        document.getElementById('potion-slot-0').click();
        const targetEl = document.querySelector('.fighter-unit.enemy-targetable');
        if (targetEl) targetEl.click();
      })()`);
      const potionUsed = await cdp.evaluate(`window.__SPIRE_APP__.getState().player.potions[0] === null`);
      assert.equal(potionUsed, true);
    }

    // If enemy survived, end turn and verify Turn 2, then restart current combat!
    const stillCombat = await cdp.evaluate(`window.__SPIRE_APP__.getState().screen === 'combat'`);
    if (stillCombat) {
      await cdp.evaluate(`document.getElementById('btn-end-turn').click()`);
      const turnNow = await cdp.evaluate(`window.__SPIRE_APP__.getState().combat?.turn ?? 2`);
      assert.ok(turnNow >= 2);

      // Click Restart Combat button
      assert.equal(await cdp.evaluate(`Boolean(document.getElementById('btn-restart-combat'))`), true);
      await cdp.evaluate(`document.getElementById('btn-restart-combat').click()`);

      const restartedAudit = await cdp.evaluate(`({
        turn: window.__SPIRE_APP__.getState().combat.turn,
        handIds: window.__SPIRE_APP__.getState().combat.hand.map(c => c.instanceId),
        potion0: window.__SPIRE_APP__.getState().player.potions[0],
        energyText: document.getElementById('energy-orb')?.textContent?.replace(/\\s+/g, ''),
        bannerText: document.getElementById('combat-banner')?.textContent || '',
      })`);
      assert.equal(restartedAudit.turn, 1);
      assert.deepEqual(restartedAudit.handIds, initialHandIds);
      assert.equal(restartedAudit.potion0, 'fire_potion');
      assert.ok(restartedAudit.energyText.startsWith('3/3'));
      assert.ok(restartedAudit.bannerText.includes('已重启本场战斗'));
    }

    // 5. Verify zero runtime exceptions or console.error messages
    const exceptions = cdp.events.filter((e) => e.method === 'Runtime.exceptionThrown');
    const consoleErrors = cdp.events.filter(
      (e) => e.method === 'Runtime.consoleAPICalled' && e.params?.type === 'error'
    );
    assert.equal(exceptions.length, 0, `Uncaught exceptions: ${JSON.stringify(exceptions)}`);
    assert.equal(consoleErrors.length, 0, `Console errors: ${JSON.stringify(consoleErrors)}`);

    cdp.ws.close();
  } finally {
    await teardownSession({ server, browser, cdp });
  }
});

test('Real Chromium E2E: Common/Uncommon/Rare card colors, Smith cost-reduction green preview (Seeing Red), and real pointer hover tooltips on relics, potions, and player/enemy buffs & debuffs', async (t) => {
  if (!resolveBrowserBinary()) {
    t.skip('Chromium/Chrome binary not available');
    return;
  }

  const { server, port } = await startStaticServer();
  let browser = null;
  let cdp = null;

  try {
    browser = await launchHeadlessChromium();
    const debugPort = new URL(browser.browserWsUrl).port;
    const targetsResp = await fetch(`http://127.0.0.1:${debugPort}/json/list`);
    const targets = await targetsResp.json();
    const pageTarget = targets.find((x) => x.type === 'page');
    assert.ok(pageTarget, 'Expected a page target in Chromium');

    cdp = await createCdpClient(pageTarget.webSocketDebuggerUrl);
    await cdp.send('Runtime.enable');
    await cdp.send('Page.enable');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 880,
      deviceScaleFactor: 1,
      mobile: false,
    });

    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${port}/` });
    await new Promise((r) => setTimeout(r, 350));
    await launchHeroFromCharacterSelect(cdp, 'ironclad');

    async function hoverSelector(selector) {
      const pt = await cdp.evaluate(`(() => {
        const el = document.querySelector(${JSON.stringify(selector)});
        if (!el) return null;
        let r = el.getBoundingClientRect();
        if (r.top < 0 || r.bottom > window.innerHeight) {
          el.scrollIntoView({ block: 'center', behavior: 'instant' });
          r = el.getBoundingClientRect();
        }
        return { x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2) };
      })()`);
      assert.ok(pt, `Selector not found for hover: ${selector}`);
      await cdp.send('Input.dispatchMouseEvent', {
        type: 'mouseMoved',
        x: pt.x,
        y: pt.y,
      });
      await new Promise((r) => setTimeout(r, 40));
      return cdp.evaluate(`(() => {
        const tip = document.getElementById('spire-tooltip');
        const cs = getComputedStyle(tip);
        return {
          hidden: tip.hidden,
          display: cs.display,
          title: tip.querySelector('.spire-tooltip-title')?.textContent || '',
          tag: tip.querySelector('.spire-tooltip-tag')?.textContent || '',
          desc: tip.querySelector('.spire-tooltip-desc')?.textContent || '',
        };
      })()`);
    }

    // 1. Hover HUD Relic & disabled HUD Potion on Map screen (outside combat!)
    const relicTip = await hoverSelector('.relic-badge');
    assert.equal(relicTip.hidden, false);
    assert.notEqual(relicTip.display, 'none');
    assert.equal(relicTip.title, '🩸 燃烧之血');
    assert.ok(relicTip.desc.includes('回复 6 点生命'));

    const isPotionDisabledOnMap = await cdp.evaluate(`document.getElementById('potion-slot-0').disabled`);
    assert.equal(isPotionDisabledOnMap, true, 'Potion button should be disabled outside combat');
    const mapPotionTip = await hoverSelector('#potion-slot-0');
    assert.equal(mapPotionTip.hidden, false, 'Hovering disabled potion button must still trigger wrapper tooltip');
    assert.equal(mapPotionTip.title, '火焰药水');
    assert.ok(mapPotionTip.desc.includes('造成 20 点固定伤害'));

    const emptySlot2Tip = await hoverSelector('#potion-slot-2');
    assert.equal(emptySlot2Tip.hidden, false, 'Hovering 3rd empty potion slot must show tooltip');
    assert.ok(
      emptySlot2Tip.desc.includes('最多可携带 3 瓶药水'),
      `Expected 3-potion tooltip on #potion-slot-2, got: ${emptySlot2Tip.desc}`
    );

    // Hover F16 Boss node (locked upper floor) -> verifies both Boss tooltip & incoming route highlight!
    const bossHoverTip = await hoverSelector('#map-node-f16_c0');
    assert.equal(bossHoverTip.hidden, false, 'Hovering F16 Boss node must show Boss tooltip');
    assert.ok(bossHoverTip.title.includes('本幕首领'));
    assert.equal(
      await cdp.evaluate(`document.querySelectorAll('.map-edge-path.edge-hover-highlight').length`),
      1,
      'Hovering F16 Boss node must highlight incoming F15->F16 route'
    );

    // Hover F1 available node -> highlights outgoing F1->F2 Bezier curve(s)
    await hoverSelector('#map-node-f1_c0');
    const hoveredEdgeCount = await cdp.evaluate(
      `document.querySelectorAll('.map-edge-path.edge-hover-highlight').length`
    );
    assert.ok(hoveredEdgeCount >= 1, 'Hovering a map node must highlight its connected route curves');

    // Scroll back to top & move mouse to empty corner -> tooltip & hover highlight clear
    await cdp.evaluate(`window.scrollTo(0, 0)`);
    await cdp.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 4, y: 4 });
    await new Promise((r) => setTimeout(r, 30));
    assert.equal(await cdp.evaluate(`document.getElementById('spire-tooltip').hidden`), true);
    assert.equal(
      await cdp.evaluate(`document.querySelectorAll('.map-edge-path.edge-hover-highlight').length`),
      0
    );

    // 2. Add Common (body_slam), Uncommon (seeing_red), and Rare (bludgeon) cards to deck, open Rest -> Smith modal
    await cdp.evaluate(`(() => {
      const app = window.__SPIRE_APP__;
      const st = app.getState();
      st.screen = 'rest';
      st.restState = { completed: false, lastAction: null };
      st.player.deck = [
        { instanceId: 'c_common', cardId: 'body_slam', upgraded: false },
        { instanceId: 'c_uncommon', cardId: 'seeing_red', upgraded: false },
        { instanceId: 'c_rare', cardId: 'bludgeon', upgraded: false },
        { instanceId: 'c_starter', cardId: 'strike', upgraded: false },
      ];
      app.openModal('smith');
    })()`);

    const smithAudit = await cdp.evaluate(`(() => {
      const commonEl = document.getElementById('modal-card-c_common');
      const uncommonEl = document.getElementById('modal-card-c_uncommon');
      const rareEl = document.getElementById('modal-card-c_rare');
      const starterEl = document.getElementById('modal-card-c_starter');
      const strikePreviewEl = starterEl.querySelector('.card-upgrade-preview');
      const srPreviewEl = uncommonEl.querySelector('.card-upgrade-preview');
      return {
        commonBorder: getComputedStyle(commonEl).borderTopColor,
        uncommonBorder: getComputedStyle(uncommonEl).borderTopColor,
        rareBorder: getComputedStyle(rareEl).borderTopColor,
        commonBadge: commonEl.querySelector('.rarity-badge')?.textContent?.trim(),
        uncommonBadge: uncommonEl.querySelector('.rarity-badge')?.textContent?.trim(),
        rareBadge: rareEl.querySelector('.rarity-badge')?.textContent?.trim(),
        seeingRedPreview: srPreviewEl?.textContent?.trim(),
        seeingRedBaseColor: getComputedStyle(srPreviewEl).color,
        seeingRedCardDescColor: getComputedStyle(uncommonEl.querySelector('.card-desc')).color,
        seeingRedLabelColor: getComputedStyle(srPreviewEl.querySelector('.upgrade-diff-label')).color,
        seeingRedHlColor: getComputedStyle(srPreviewEl.querySelector('.upgrade-diff-hl')).color,
        seeingRedHlTexts: [...srPreviewEl.querySelectorAll('.upgrade-diff-hl')].map((el) => el.textContent.trim()),
        bodySlamPreview: commonEl.querySelector('.card-upgrade-preview')?.textContent?.trim(),
        strikePreview: strikePreviewEl?.textContent?.trim(),
        strikeLabelText: strikePreviewEl.querySelector('.upgrade-diff-label')?.textContent?.trim(),
        strikeHlTexts: [...strikePreviewEl.querySelectorAll('.upgrade-diff-hl')].map((el) => el.textContent.trim()),
      };
    })()`);

    // Verify Common / Uncommon / Rare badges & distinct border colors
    assert.equal(smithAudit.commonBadge, '普通');
    assert.equal(smithAudit.uncommonBadge, '罕见');
    assert.equal(smithAudit.rareBadge, '稀有');
    assert.notEqual(smithAudit.commonBorder, smithAudit.uncommonBorder);
    assert.notEqual(smithAudit.uncommonBorder, smithAudit.rareBorder);
    assert.notEqual(smithAudit.commonBorder, smithAudit.rareBorder);

    // Verify selective green diff highlighting: unchanged text matches normal .card-desc color; only "升级后" and changed spans are green!
    assert.ok(
      smithAudit.seeingRedPreview.includes('费用 1 → 0（减少 1 点）'),
      `Expected cost reduction in Seeing Red preview, got: ${smithAudit.seeingRedPreview}`
    );
    assert.ok(smithAudit.seeingRedPreview.includes('获得 2 点能量'));
    assert.ok(smithAudit.bodySlamPreview.includes('费用 1 → 0（减少 1 点）'));
    assert.equal(smithAudit.strikePreview.includes('费用'), false);
    assert.equal(smithAudit.strikeLabelText, '升级后');
    assert.deepEqual(smithAudit.strikeHlTexts, ['9']);
    assert.deepEqual(smithAudit.seeingRedHlTexts, ['费用 1 → 0（减少 1 点）。']);
    assert.equal(
      smithAudit.seeingRedBaseColor,
      smithAudit.seeingRedCardDescColor,
      'Unchanged upgrade preview text must keep original card description color'
    );
    assert.notEqual(
      smithAudit.seeingRedLabelColor,
      smithAudit.seeingRedBaseColor,
      '"升级后" label must use distinct green highlight color'
    );
    assert.equal(
      smithAudit.seeingRedHlColor,
      smithAudit.seeingRedLabelColor,
      'Changed diff spans must use the same green highlight color as "升级后"'
    );

    if (process.env.SCRATCH_SCREENSHOT_DIR) {
      fs.mkdirSync(process.env.SCRATCH_SCREENSHOT_DIR, { recursive: true });
      const shotSmith = await cdp.send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(
        path.join(process.env.SCRATCH_SCREENSHOT_DIR, 'smith_upgrade_preview.png'),
        Buffer.from(shotSmith.data, 'base64')
      );
    }

    // Click Seeing Red to smith-upgrade it!
    await cdp.evaluate(`document.getElementById('modal-card-c_uncommon').click()`);

    // 3. Enter Floor 1 Combat with Common, Uncommon (Seeing Red+), Rare cards & inspect buffs/debuffs tooltips
    await cdp.evaluate(`(() => {
      const app = window.__SPIRE_APP__;
      const st = app.getState();
      st.screen = 'map';
      st.currentNodeId = null;
      if (st.neowState) st.neowState.resolved = true;
      app.render();
      document.getElementById('map-node-f1_c0').click();
    })()`);

    // Ensure player has both a Buff (strength) and a Debuff (weak), and enemy has both a Buff (ritual) and a Debuff (vulnerable)
    await cdp.evaluate(`(() => {
      const app = window.__SPIRE_APP__;
      const st = app.getState();
      st.player.statuses.strength = 2;
      st.player.statuses.weak = 1;
      const enemy = st.combat.enemies[0];
      enemy.statuses.ritual = 3;
      enemy.statuses.vulnerable = 2;
      app.render();
    })()`);

    // Verify Seeing Red+ in hand has green upgraded cost orb '0' and rarity badges remain visible alongside hotkeys!
    const handSeeingRedAudit = await cdp.evaluate(`(() => {
      const srEl = document.getElementById('hand-card-c_uncommon');
      if (!srEl) return null;
      const costEl = srEl.querySelector('.card-cost');
      return {
        hasUpgradedCostClass: costEl.classList.contains('upgraded'),
        costText: costEl.textContent.trim(),
        badgeText: srEl.querySelector('.rarity-badge')?.textContent?.trim(),
        hasHotkey: Boolean(srEl.querySelector('.card-hotkey')),
      };
    })()`);
    assert.ok(handSeeingRedAudit, 'Expected Seeing Red+ in 4-card hand');
    assert.equal(handSeeingRedAudit.hasUpgradedCostClass, true);
    assert.equal(handSeeingRedAudit.costText, '0');
    assert.equal(handSeeingRedAudit.badgeText, '罕见');
    assert.equal(handSeeingRedAudit.hasHotkey, true);

    // Hover Player Buff (力量 2) & Player Debuff (虚弱 1)
    const playerBuffTip = await hoverSelector('#player-unit .status-chip.buff');
    assert.equal(playerBuffTip.hidden, false);
    assert.ok(playerBuffTip.tag.includes('自身'));
    assert.ok(playerBuffTip.desc.includes('每次攻击额外造成 2 点伤害'));

    const playerDebuffTip = await hoverSelector('#player-unit .status-chip.debuff');
    assert.equal(playerDebuffTip.hidden, false);
    assert.ok(playerDebuffTip.tag.includes('自身'));
    assert.ok(playerDebuffTip.desc.includes('造成的攻击伤害降低 25%'));

    // Hover Enemy Buff (仪式 3) & Enemy Debuff (易伤 2)
    const enemyBuffTip = await hoverSelector('[id^="enemy-unit-"] .status-chip.buff');
    assert.equal(enemyBuffTip.hidden, false);
    assert.ok(enemyBuffTip.desc.includes('获得 3 点力量') || enemyBuffTip.desc.includes('格挡'));

    const enemyDebuffTip = await hoverSelector('[id^="enemy-unit-"] .status-chip.debuff');
    assert.equal(enemyDebuffTip.hidden, false);
    assert.ok(enemyDebuffTip.desc.includes('受到的攻击伤害增加 50%'));

    if (process.env.SCRATCH_SCREENSHOT_DIR) {
      const shotCombatTooltip = await cdp.send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(
        path.join(process.env.SCRATCH_SCREENSHOT_DIR, 'combat_rarity_tooltip.png'),
        Buffer.from(shotCombatTooltip.data, 'base64')
      );
    }

    // 4. Verify Shining Light event displays exact upgraded card names AND renders the upgraded cards visually
    await cdp.evaluate(`(() => {
      const app = window.__SPIRE_APP__;
      const st = app.getState();
      st.screen = 'event';
      st.player.hp = 60;
      st.eventState = {
        eventId: 'shining_light',
        resolved: false,
        pendingPurge: false,
        outcomeText: '',
        upgradedCardIds: [],
      };
      app.render();
      document.getElementById('event-choice-enter_light').click();
    })()`);

    const eventAudit = await cdp.evaluate(`(() => {
      const outcome = document.querySelector('.summary-stats p')?.textContent?.trim() || '';
      const showcasedNames = [...document.querySelectorAll('#event-upgraded-cards .card-name')].map(
        (el) => el.textContent.trim()
      );
      return { outcome, showcasedNames };
    })()`);

    assert.equal(eventAudit.showcasedNames.length, 2, 'Expected 2 upgraded cards showcased in Shining Light');
    assert.match(eventAudit.outcome, /^失去 12 点生命，成功升级了 2 张卡牌：【.+?\+】、【.+?\+】！$/);
    for (const cardName of eventAudit.showcasedNames) {
      assert.ok(eventAudit.outcome.includes(`【${cardName}】`), `Outcome "${eventAudit.outcome}" missing ${cardName}`);
    }

    if (process.env.SCRATCH_SCREENSHOT_DIR) {
      const shotEvent = await cdp.send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(
        path.join(process.env.SCRATCH_SCREENSHOT_DIR, 'event_shining_light_upgrade.png'),
        Buffer.from(shotEvent.data, 'base64')
      );
    }

    // 5. Verify Attack / Skill / Power cards render distinct card-type icons beside their labels
    const cardTypeAudit = await cdp.evaluate(`(() => {
      const app = window.__SPIRE_APP__;
      const st = app.getState();
      st.player.deck = [
        { instanceId: 't_atk', cardId: 'strike', upgraded: false },
        { instanceId: 't_skl', cardId: 'defend', upgraded: false },
        { instanceId: 't_pwr', cardId: 'inflame', upgraded: false },
      ];
      app.openModal('deck');
      const atkIcon = document.querySelector('#modal-card-t_atk [data-card-type-icon="attack"]')?.outerHTML || '';
      const sklIcon = document.querySelector('#modal-card-t_skl [data-card-type-icon="skill"]')?.outerHTML || '';
      const pwrIcon = document.querySelector('#modal-card-t_pwr [data-card-type-icon="power"]')?.outerHTML || '';
      const atkText = document.querySelector('#modal-card-t_atk .card-type-label')?.textContent?.trim() || '';
      const sklText = document.querySelector('#modal-card-t_skl .card-type-label')?.textContent?.trim() || '';
      const pwrText = document.querySelector('#modal-card-t_pwr .card-type-label')?.textContent?.trim() || '';
      document.getElementById('btn-close-modal').click();
      return { atkIcon, sklIcon, pwrIcon, atkText, sklText, pwrText };
    })()`);
    assert.ok(cardTypeAudit.atkIcon.length > 0, 'Attack card must render sword icon');
    assert.ok(cardTypeAudit.sklIcon.length > 0, 'Skill card must render shield icon');
    assert.ok(cardTypeAudit.pwrIcon.length > 0, 'Power card must render power icon');
    assert.notEqual(cardTypeAudit.atkIcon, cardTypeAudit.sklIcon);
    assert.notEqual(cardTypeAudit.sklIcon, cardTypeAudit.pwrIcon);
    assert.equal(cardTypeAudit.atkText, '攻击');
    assert.equal(cardTypeAudit.sklText, '技能');
    assert.equal(cardTypeAudit.pwrText, '能力');

    // 6. Verify Reward Screen prompts on unclaimed Gold / Relic, and does NOT prompt on unclaimed Potion / Card!
    await cdp.evaluate(`(() => {
      const app = window.__SPIRE_APP__;
      const st = app.getState();
      st.screen = 'reward';
      st.reward = {
        role: 'elite',
        gold: 48,
        goldClaimed: false,
        relicId: 'vajra',
        relicClaimed: false,
        potionId: 'block_potion',
        potionClaimed: false,
        cardChoices: [
          { instanceId: 'rw_1', cardId: 'cleave', upgraded: false },
          { instanceId: 'rw_2', cardId: 'shrug_it_off', upgraded: false },
          { instanceId: 'rw_3', cardId: 'inflame', upgraded: false },
        ],
        cardClaimed: false,
        pickedCardId: null,
      };
      app.render();
    })()`);

    const lootCardsAudit = await cdp.evaluate(`(() => {
      const goldEl = document.getElementById('btn-claim-gold');
      const relicEl = document.getElementById('btn-claim-relic');
      const potionEl = document.getElementById('btn-claim-potion');
      return {
        goldHeight: goldEl?.getBoundingClientRect().height || 0,
        relicHeight: relicEl?.getBoundingClientRect().height || 0,
        potionHeight: potionEl?.getBoundingClientRect().height || 0,
        hasGoldIcon: Boolean(goldEl?.querySelector('[data-loot-icon="gold"]')),
        hasRelicIcon: Boolean(relicEl?.querySelector('[data-loot-icon="relic"]')),
        hasPotionIcon: Boolean(potionEl?.querySelector('[data-loot-icon="potion"]')),
        goldIconSvg: goldEl?.querySelector('[data-loot-icon="gold"]')?.outerHTML || '',
        relicIconSvg: relicEl?.querySelector('[data-loot-icon="relic"]')?.outerHTML || '',
        potionIconSvg: potionEl?.querySelector('[data-loot-icon="potion"]')?.outerHTML || '',
      };
    })()`);

    assert.ok(lootCardsAudit.goldHeight >= 76, `Expected prominent gold loot plaque >= 76px tall, got ${lootCardsAudit.goldHeight}`);
    assert.ok(lootCardsAudit.relicHeight >= 76, `Expected prominent relic loot plaque >= 76px tall, got ${lootCardsAudit.relicHeight}`);
    assert.ok(lootCardsAudit.potionHeight >= 76, `Expected prominent potion loot plaque >= 76px tall, got ${lootCardsAudit.potionHeight}`);
    assert.equal(lootCardsAudit.hasGoldIcon, true, 'Gold loot card must render gold SVG icon');
    assert.equal(lootCardsAudit.hasRelicIcon, true, 'Relic loot card must render relic SVG icon');
    assert.equal(lootCardsAudit.hasPotionIcon, true, 'Potion loot card must render potion SVG icon');
    assert.notEqual(lootCardsAudit.goldIconSvg, lootCardsAudit.relicIconSvg);
    assert.notEqual(lootCardsAudit.relicIconSvg, lootCardsAudit.potionIconSvg);

    await cdp.evaluate(`document.getElementById('btn-proceed-reward').click()`);

    const promptAudit = await cdp.evaluate(`({
      screen: window.__SPIRE_APP__.getState().screen,
      hasPromptModal: Boolean(document.getElementById('reward-unclaimed-modal')),
      promptText: document.getElementById('reward-skip-desc')?.textContent?.trim() || '',
    })`);
    assert.equal(promptAudit.screen, 'reward', 'Must stay on reward screen when Gold/Relic unclaimed');
    assert.equal(promptAudit.hasPromptModal, true, 'Must show unclaimed loot prompt modal');
    assert.ok(promptAudit.promptText.includes('48 金币'));
    assert.ok(promptAudit.promptText.includes('金刚杵'));

    if (process.env.SCRATCH_SCREENSHOT_DIR) {
      const shotPrompt = await cdp.send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(
        path.join(process.env.SCRATCH_SCREENSHOT_DIR, 'reward_unclaimed_prompt.png'),
        Buffer.from(shotPrompt.data, 'base64')
      );
    }

    // Click "返回拾取" -> closes modal, manually claim Gold & Relic, leave Potion & Card unclaimed -> Proceed succeeds without modal!
    await cdp.evaluate(`(() => {
      document.getElementById('btn-cancel-skip-reward').click();
      document.getElementById('btn-claim-gold').click();
      document.getElementById('btn-claim-relic').click();
      document.getElementById('btn-proceed-reward').click();
    })()`);

    const afterProceedAudit = await cdp.evaluate(`({
      screen: window.__SPIRE_APP__.getState().screen,
      hasPromptModal: Boolean(document.getElementById('reward-unclaimed-modal')),
      hasVajra: window.__SPIRE_APP__.getState().player.relics.includes('vajra'),
    })`);
    assert.equal(afterProceedAudit.screen, 'map', 'Leaving Potion and Card unclaimed must NOT block proceeding to Map');
    assert.equal(afterProceedAudit.hasPromptModal, false);
    assert.equal(afterProceedAudit.hasVajra, true);

    const exceptions = cdp.events.filter((e) => e.method === 'Runtime.exceptionThrown');
    const consoleErrors = cdp.events.filter(
      (e) => e.method === 'Runtime.consoleAPICalled' && e.params?.type === 'error'
    );
    assert.equal(exceptions.length, 0, `Uncaught exceptions: ${JSON.stringify(exceptions)}`);
    assert.equal(consoleErrors.length, 0, `Console errors: ${JSON.stringify(consoleErrors)}`);

    cdp.ws.close();
  } finally {
    await teardownSession({ server, browser, cdp });
  }
});

test('Real Chromium E2E: 3-4 col map + F9 Treasure Chest + Curse card UI + Boss Relic Altar -> Act 2 + Meta/Ascension 5 progression', async (t) => {
  if (!resolveBrowserBinary()) {
    t.skip('Chromium/Chrome binary not available');
    return;
  }

  const { server, port } = await startStaticServer();
  let browser = null;
  let cdp = null;

  try {
    browser = await launchHeadlessChromium();
    const debugPort = new URL(browser.browserWsUrl).port;
    const targetsResp = await fetch(`http://127.0.0.1:${debugPort}/json/list`);
    const targets = await targetsResp.json();
    const pageTarget = targets.find((x) => x.type === 'page');
    assert.ok(pageTarget, 'Expected a page target in Chromium');

    cdp = await createCdpClient(pageTarget.webSocketDebuggerUrl);
    await cdp.send('Runtime.enable');
    await cdp.send('Page.enable');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 880,
      deviceScaleFactor: 1,
      mobile: false,
    });

    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${port}/?debug=1` });
    await new Promise((r) => setTimeout(r, 350));
    await launchHeroFromCharacterSelect(cdp, 'ironclad');

    // 1. Audit 3-4 col map, zero F1-F5 Elites, and Floor 9 Treasure Chest icon
    const mapAudit = await cdp.evaluate(`(() => {
      const rows = [...document.querySelectorAll('.map-row')];
      const f1Count = rows[0]?.querySelectorAll('.map-node-btn').length ?? 0;
      const earlyElites = rows.slice(0, 5).flatMap((r) => [...r.querySelectorAll('[data-node-type="elite"]')]).length;
      const f9TreasureIcons = rows[8]?.querySelectorAll('[data-node-icon="treasure"]').length ?? 0;
      const f9Nodes = rows[8]?.querySelectorAll('.map-node-btn').length ?? 0;
      return { f1Count, earlyElites, f9TreasureIcons, f9Nodes };
    })()`);
    assert.ok(mapAudit.f1Count >= 3 && mapAudit.f1Count <= 4);
    assert.equal(mapAudit.earlyElites, 0);
    assert.ok(mapAudit.f9Nodes >= 1 && mapAudit.f9TreasureIcons === mapAudit.f9Nodes);

    // 2. Test Treasure Chest screen with Cursed Key -> renders Curse card with violet styling & skull icon
    await cdp.evaluate(`(() => {
      const app = window.__SPIRE_APP__;
      const st = app.getState();
      st.player.relics.push('cursed_key');
      st.screen = 'treasure';
      st.treasureState = {
        opened: false,
        relicId: null,
        gold: 0,
        curseCardId: null,
        outcomeText: '',
      };
      app.render();
      document.getElementById('btn-open-treasure').click();
    })()`);

    const treasureAudit = await cdp.evaluate(`(() => {
      const curseEl = document.querySelector('#treasure-curse-showcase .game-card');
      return {
        hasLeaveBtn: Boolean(document.getElementById('btn-leave-treasure')),
        hasCurseCard: Boolean(curseEl),
        hasCurseClass: curseEl?.classList.contains('rarity-curse') ?? false,
        curseBadge: curseEl?.querySelector('.rarity-badge')?.textContent?.trim() || '',
        hasSkullIcon: Boolean(curseEl?.querySelector('[data-card-type-icon="curse"]')),
      };
    })()`);
    assert.equal(treasureAudit.hasLeaveBtn, true);
    assert.equal(treasureAudit.hasCurseCard, true);
    assert.equal(treasureAudit.hasCurseClass, true);
    assert.equal(treasureAudit.curseBadge, '诅咒');
    assert.equal(treasureAudit.hasSkullIcon, true);

    await cdp.evaluate(`document.getElementById('btn-leave-treasure').click()`);
    assert.equal(await cdp.evaluate(`window.__SPIRE_APP__.getState().screen`), 'map');

    // 3. Defeat Act 1 Boss in real combat -> verify 3 Rare reward cards + Boss Relic Altar -> pick 1 Rare card & Boss Relic -> proceed to Act 2!
    const bossVictoryAudit = await cdp.evaluate(`(() => {
      const app = window.__SPIRE_APP__;
      const st = app.getState();
      // Jump to Floor 15 node pointing to Floor 16 Boss, enter Boss combat, finish with Fire Potion
      const bossNode = st.map[15][0];
      const f15Node = st.map[14][0];
      st.screen = 'map';
      st.currentNodeId = f15Node.id;
      f15Node.nextIds = [bossNode.id];
      if (st.neowState) st.neowState.resolved = true;
      st.player.potions[0] = 'fire_potion';
      app.render();

      document.getElementById('map-node-' + bossNode.id).click();
      // Reset relics/maxHp so random Treasure Chest relics (e.g. Strawberry/Meat on the Bone) cannot flake the exact Burning Blood (+6) + Act 2 heal (40 -> 70) check
      st.player.relics = ['burning_blood'];
      st.player.maxHp = 80;
      st.player.hp = 34;
      st.combat.enemies[0].hp = 10;
      app.render();
      document.getElementById('potion-slot-0').click();

      const rareCards = [...document.querySelectorAll('#boss-reward-cards .game-card')];
      const allRareRarity = rareCards.length === 3 && rareCards.every((el) => el.dataset.rarity === 'rare');
      const deckBefore = st.player.deck.length;
      rareCards[0].click();
      const deckAfter = st.player.deck.length;
      const allDisabledAfterPick = [...document.querySelectorAll('#boss-reward-cards .game-card')].every(
        (el) => el.disabled
      );

      // Force velvet_choker in altar for deterministic +1 energy check, then pick & advance to Act 2
      st.bossReward.relicChoices = ['black_blood', 'velvet_choker', 'sacred_bark'];
      app.render();
      return {
        screen: st.screen,
        rareCount: rareCards.length,
        allRareRarity,
        deckBefore,
        deckAfter,
        allDisabledAfterPick,
      };
    })()`);
    assert.equal(bossVictoryAudit.screen, 'boss_reward');
    assert.equal(bossVictoryAudit.rareCount, 3);
    assert.equal(bossVictoryAudit.allRareRarity, true);
    assert.equal(bossVictoryAudit.deckAfter, bossVictoryAudit.deckBefore + 1);
    assert.equal(bossVictoryAudit.allDisabledAfterPick, true);

    if (process.env.SCRATCH_SCREENSHOT_DIR) {
      fs.mkdirSync(process.env.SCRATCH_SCREENSHOT_DIR, { recursive: true });
      const shotBossReward = await cdp.send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(
        path.join(process.env.SCRATCH_SCREENSHOT_DIR, 'boss_reward_rare_cards.png'),
        Buffer.from(shotBossReward.data, 'base64')
      );
    }

    await cdp.evaluate(`(() => {
      document.getElementById('boss-relic-velvet_choker').click();
      document.getElementById('btn-proceed-act2').click();
    })()`);

    const act2Audit = await cdp.evaluate(`({
      act: window.__SPIRE_APP__.getState().act,
      maxEnergy: window.__SPIRE_APP__.getState().player.maxEnergy,
      hp: window.__SPIRE_APP__.getState().player.hp,
      floorIndicator: document.querySelector('.floor-indicator')?.textContent?.trim(),
      mapHeading: document.getElementById('map-heading')?.textContent?.trim(),
    })`);
    assert.equal(act2Audit.act, 2);
    assert.equal(act2Audit.maxEnergy, 4);
    assert.equal(act2Audit.hp, 70);
    assert.equal(act2Audit.floorIndicator, '第 2 幕 · 第 1 / 16 层');
    assert.equal(act2Audit.mapHeading, '第二幕 · 钢铁城邦攀登路线');

    // 4. Open Meta/Ascension modal -> Unlock all -> Select Ascension 5 -> Start new Ascension 5 run!
    await cdp.evaluate(`document.getElementById('btn-open-meta').click()`);
    assert.equal(await cdp.evaluate(`Boolean(document.getElementById('meta-progression-modal'))`), true);
    await cdp.evaluate(`document.getElementById('btn-unlock-all-meta').click()`);
    await cdp.evaluate(`document.getElementById('btn-select-ascension-5').click()`);
    await cdp.evaluate(`document.getElementById('btn-start-ascension-run').click()`);

    const asc5Audit = await cdp.evaluate(`({
      ascension: window.__SPIRE_APP__.getState().ascension,
      maxHp: window.__SPIRE_APP__.getState().player.maxHp,
      ascPillText: document.querySelector('.ascension-pill')?.textContent?.trim() || '',
      deckBtnText: document.getElementById('btn-open-deck')?.textContent?.trim() || '',
      hasClumsy: window.__SPIRE_APP__.getState().player.deck.some((c) => c.cardId === 'clumsy'),
    })`);
    assert.equal(asc5Audit.ascension, 5);
    assert.equal(asc5Audit.maxHp, 75);
    assert.equal(asc5Audit.ascPillText, '进阶 5');
    assert.equal(asc5Audit.deckBtnText, '🃏 牌组 (11)');
    assert.equal(asc5Audit.hasClumsy, true);

    const exceptions = cdp.events.filter((e) => e.method === 'Runtime.exceptionThrown');
    const consoleErrors = cdp.events.filter(
      (e) => e.method === 'Runtime.consoleAPICalled' && e.params?.type === 'error'
    );
    assert.equal(exceptions.length, 0, `Uncaught exceptions: ${JSON.stringify(exceptions)}`);
    assert.equal(consoleErrors.length, 0, `Console errors: ${JSON.stringify(consoleErrors)}`);

    cdp.ws.close();
  } finally {
    await teardownSession({ server, browser, cdp });
  }
});

test('P2 Real Chromium E2E: @keyframes FX & shield shatter, Settings modal, Glossary/Tutorial, Next-Turn Intent UI, Run History & Seeded Run', async (t) => {
  if (!resolveBrowserBinary()) {
    t.skip('Chromium/Chrome binary not available');
    return;
  }

  const { server, port } = await startStaticServer();
  let browser = null;
  let cdp = null;

  try {
    browser = await launchHeadlessChromium();
    const debugPort = new URL(browser.browserWsUrl).port;
    const targets = await (await fetch(`http://127.0.0.1:${debugPort}/json/list`)).json();
    const pageTarget = targets.find((x) => x.type === 'page');
    assert.ok(pageTarget);

    cdp = await createCdpClient(pageTarget.webSocketDebuggerUrl);
    await cdp.send('Runtime.enable');
    await cdp.send('Page.enable');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 880,
      deviceScaleFactor: 1,
      mobile: false,
    });

    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${port}/` });
    await new Promise((r) => setTimeout(r, 350));
    await launchHeroFromCharacterSelect(cdp, 'ironclad');

    // 1. Verify @keyframes animations exist in stylesheet & newbie banner shows on Floor 0
    const cssAndBannerAudit = await cdp.evaluate(`(() => {
      const keyframes = [];
      for (const sheet of document.styleSheets) {
        for (const rule of sheet.cssRules) {
          if (rule.type === CSSRule.KEYFRAMES_RULE) keyframes.push(rule.name);
        }
      }
      return {
        keyframes,
        hasNewbieBanner: Boolean(document.getElementById('newbie-guide-banner')),
        hasFxLayer: Boolean(document.getElementById('spire-fx-layer')),
        hasCopySeedBtn: Boolean(document.getElementById('btn-copy-seed')),
      };
    })()`);
    for (const kf of ['cardFlyGhost', 'cardDealIn', 'unitHitShake', 'floatPopupRise', 'shieldShatterRing']) {
      assert.ok(cssAndBannerAudit.keyframes.includes(kf), `Missing @keyframes ${kf}`);
    }
    assert.equal(cssAndBannerAudit.hasNewbieBanner, true);
    assert.equal(cssAndBannerAudit.hasFxLayer, true);
    assert.equal(cssAndBannerAudit.hasCopySeedBtn, true);

    // 2. Open Help/Glossary modal -> filter search -> switch to 3-step Tutorial tab
    await cdp.evaluate(`document.getElementById('btn-open-help').click()`);
    const helpAudit = await cdp.evaluate(`(() => {
      const searchInput = document.getElementById('input-glossary-search');
      searchInput.value = '易伤';
      searchInput.dispatchEvent(new Event('input', { bubbles: true }));
      const filteredCards = [...document.querySelectorAll('#glossary-results-container .glossary-card')];
      const filteredTitles = filteredCards.map((el) => el.querySelector('.glossary-card-title')?.textContent?.trim());

      document.getElementById('tab-help-tutorial').click();
      const tutorialStepCount = document.querySelectorAll('.tutorial-step-card').length;
      document.getElementById('btn-close-modal').click();

      return { filteredCount: filteredCards.length, filteredTitles, tutorialStepCount };
    })()`);
    assert.ok(helpAudit.filteredCount >= 1);
    assert.ok(helpAudit.filteredTitles.some((t) => t?.includes('易伤')));
    assert.equal(helpAudit.tutorialStepCount, 3);

    // 3. Open Settings modal -> adjust volume, toggle animation speed off -> fast
    await cdp.evaluate(`document.getElementById('btn-open-settings').click()`);
    const settingsAudit = await cdp.evaluate(`(() => {
      const volSlider = document.getElementById('input-sound-volume');
      volSlider.value = '35';
      volSlider.dispatchEvent(new Event('input', { bubbles: true }));
      const volumeLabel = document.getElementById('settings-volume-label')?.textContent?.trim();

      document.getElementById('btn-anim-speed-off').click();
      const speedWhenOff = document.getElementById('app').dataset.animSpeed;

      document.getElementById('btn-anim-speed-fast').click();
      const speedWhenFast = document.getElementById('app').dataset.animSpeed;

      document.getElementById('btn-close-modal').click();
      return { volumeLabel, speedWhenOff, speedWhenFast };
    })()`);
    assert.equal(settingsAudit.volumeLabel, '35%');
    assert.equal(settingsAudit.speedWhenOff, 'off');
    assert.equal(settingsAudit.speedWhenFast, 'fast');

    // 4. Enter Combat -> verify Next-Turn Intent hint + play Strike to shatter enemy 4-Block shield -> verify FX layer popups
    const combatFxAudit = await cdp.evaluate(`(() => {
      if (document.getElementById('neow-blessing-panel')) {
        document.getElementById('neow-choice-0').click();
        if (document.getElementById('neow-action-modal')) {
          document.querySelector('#neow-action-modal [data-action="complete-neow-action"]').click();
        }
      }
      const firstNode = document.querySelector('.map-node-btn.available');
      firstNode.click();

      const app = window.__SPIRE_APP__;
      const st = app.getState();
      // Ensure single alive enemy with 4 Block & 30 HP (without Louse Curl Up re-armoring), and a playable Strike in hand
      st.combat.enemies = [st.combat.enemies[0]];
      const enemy = st.combat.enemies[0];
      enemy.hp = 30;
      enemy.maxHp = 40;
      enemy.block = 4;
      delete enemy.statuses.curlUp;
      if (!st.combat.hand.some((c) => c.cardId === 'strike')) {
        st.combat.hand[0] = { instanceId: 'fx_strike_1', cardId: 'strike', upgraded: false };
      }
      app.render();

      const nextIntentText = document.querySelector('.enemy-side .next-intent-hint')?.textContent?.trim() || '';
      const intentTooltipDesc = document.querySelector('.enemy-side .intent-badge')?.dataset?.tooltipDesc || '';

      const strikeCard = st.combat.hand.find((c) => c.cardId === 'strike');
      document.getElementById('hand-card-' + strikeCard.instanceId).click();

      const fxLayer = document.getElementById('spire-fx-layer');
      return {
        nextIntentText,
        intentTooltipDesc,
        hasCardGhost: Boolean(fxLayer.querySelector('.fx-card-ghost')),
        hasFloatPopup: Boolean(fxLayer.querySelector('.fx-float-popup')),
        hasShieldShatter: Boolean(fxLayer.querySelector('.fx-shield-shatter')),
        shatterText: fxLayer.querySelector('.fx-tone-shatter')?.textContent?.trim() || '',
      };
    })()`);
    assert.ok(combatFxAudit.nextIntentText.startsWith('下回合：'), `Unexpected nextIntentText: ${combatFxAudit.nextIntentText}`);
    assert.ok(combatFxAudit.intentTooltipDesc.includes('下回合可能行动'));
    assert.equal(combatFxAudit.hasCardGhost, true);
    assert.equal(combatFxAudit.hasFloatPopup, true);
    assert.equal(combatFxAudit.hasShieldShatter, true);
    assert.ok(combatFxAudit.shatterText.includes('破盾'));

    // 5. Complete run -> verify Run History recorded -> launch Seeded Run with 'S-16' (seed 42)
    const seedAndHistoryAudit = await cdp.evaluate(`(() => {
      const app = window.__SPIRE_APP__;
      const st = app.getState();
      st.screen = 'game_over';
      st.runOutcome = 'defeat';
      app.render();

      const hasGameOverReplay = Boolean(document.getElementById('btn-replay-current-seed'));
      document.getElementById('btn-open-meta').click();
      const historyCount = document.querySelectorAll('#run-history-list .history-row').length;

      const seedInput = document.getElementById('seed-input-box');
      seedInput.value = 'S-16';
      seedInput.dispatchEvent(new Event('input', { bubbles: true }));
      document.getElementById('btn-start-seeded-run').click();

      return {
        hasGameOverReplay,
        historyCount,
        newSeed: app.getState().seed,
        hudSeedText: document.getElementById('btn-copy-seed')?.textContent?.trim() || '',
      };
    })()`);
    assert.equal(seedAndHistoryAudit.hasGameOverReplay, true);
    assert.ok(seedAndHistoryAudit.historyCount >= 1);
    assert.equal(seedAndHistoryAudit.newSeed, 42);
    assert.ok(seedAndHistoryAudit.hudSeedText.includes('S-16'));

    const exceptions = cdp.events.filter((e) => e.method === 'Runtime.exceptionThrown');
    const consoleErrors = cdp.events.filter(
      (e) => e.method === 'Runtime.consoleAPICalled' && e.params?.type === 'error'
    );
    assert.equal(exceptions.length, 0, `Uncaught exceptions: ${JSON.stringify(exceptions)}`);
    assert.equal(consoleErrors.length, 0, `Console errors: ${JSON.stringify(consoleErrors)}`);

    cdp.ws.close();
  } finally {
    await teardownSession({ server, browser, cdp });
  }
});

test('P2 Real Chromium E2E: Mobile 390x844 responsive layout, non-overlapping 4-col map nodes, tap-to-inspect tooltips, and standalone HTML bundle boot', async (t) => {
  if (!resolveBrowserBinary()) {
    t.skip('Chromium/Chrome binary not available');
    return;
  }

  // Generate standalone HTML bundle into dist/ so the static server can serve it directly
  const bundleOut = path.join(ROOT_DIR, 'dist/slay_the_spire_lite.html');
  writeStandaloneBundle(bundleOut, ROOT_DIR);
  assert.equal(fs.existsSync(bundleOut), true);

  const { server, port } = await startStaticServer();
  let browser = null;
  let cdp = null;

  try {
    browser = await launchHeadlessChromium();
    const debugPort = new URL(browser.browserWsUrl).port;
    const targets = await (await fetch(`http://127.0.0.1:${debugPort}/json/list`)).json();
    const pageTarget = targets.find((x) => x.type === 'page');
    assert.ok(pageTarget);

    cdp = await createCdpClient(pageTarget.webSocketDebuggerUrl);
    await cdp.send('Runtime.enable');
    await cdp.send('Page.enable');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });

    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${port}/` });
    await cdp.send('Emulation.setTouchEmulationEnabled', { enabled: true });
    await new Promise((r) => setTimeout(r, 350));
    await launchHeroFromCharacterSelect(cdp, 'ironclad');

    // 1. Mobile 390x844 Map viewport audit: zero page horizontal overflow, enlarged icon-only medallions, zero overlapping nodes
    const mobileMapAudit = await cdp.evaluate(`(() => {
      const docScrollWidth = document.documentElement.scrollWidth;
      const innerWidth = window.innerWidth;
      const boardRect = document.querySelector('.map-board').getBoundingClientRect();
      const hasNodeText = Boolean(document.querySelector('.map-node-btn .node-text'));
      const sampleNode = document.querySelector('.map-node-btn:not(.node-kind-boss)');
      const sampleRect = sampleNode.getBoundingClientRect();
      const sampleSvgRect = sampleNode.querySelector('.node-icon-wrap svg').getBoundingClientRect();

      let overlapCount = 0;
      let outOfBoundsCount = 0;
      for (const row of document.querySelectorAll('.map-row')) {
        const rects = [...row.querySelectorAll('.map-node-btn')]
          .map((b) => b.getBoundingClientRect())
          .sort((a, b) => a.left - b.left);
        for (let i = 0; i < rects.length; i += 1) {
          if (rects[i].left < boardRect.left - 2 || rects[i].right > boardRect.right + 2) {
            outOfBoundsCount += 1;
          }
          if (i > 0 && rects[i - 1].right > rects[i].left + 1.5) {
            overlapCount += 1;
          }
        }
      }

      // Tap-to-inspect passive relic badge on mobile
      const relicEl = document.querySelector('.relic-badge');
      relicEl.click();
      const tip = document.getElementById('spire-tooltip');
      const tipRect = tip.getBoundingClientRect();
      const tipShownOnFirstTap = !tip.hidden && tipRect.left >= 0 && tipRect.right <= innerWidth;
      relicEl.click();
      const tipHiddenOnSecondTap = tip.hidden;

      return {
        docScrollWidth,
        innerWidth,
        hasNodeText,
        nodeWidth: Math.round(sampleRect.width),
        nodeHeight: Math.round(sampleRect.height),
        svgWidth: Math.round(sampleSvgRect.width),
        overlapCount,
        outOfBoundsCount,
        tipShownOnFirstTap,
        tipHiddenOnSecondTap,
      };
    })()`);
    assert.ok(
      mobileMapAudit.docScrollWidth <= mobileMapAudit.innerWidth,
      `Mobile map overflowed horizontally: ${mobileMapAudit.docScrollWidth} > ${mobileMapAudit.innerWidth}`
    );
    assert.equal(mobileMapAudit.hasNodeText, false, 'Map rooms must render icon-only without inline text labels');
    assert.ok(mobileMapAudit.nodeWidth >= 42 && mobileMapAudit.nodeHeight >= 42, `Mobile map icon button must be >=42px touch target, got ${mobileMapAudit.nodeWidth}x${mobileMapAudit.nodeHeight}`);
    assert.ok(mobileMapAudit.svgWidth >= 22, `Mobile map room SVG icon must be enlarged >=22px, got ${mobileMapAudit.svgWidth}px`);
    assert.equal(mobileMapAudit.overlapCount, 0, 'Map nodes must never overlap on 390px mobile screen');
    assert.equal(mobileMapAudit.outOfBoundsCount, 0, 'Map nodes must stay within .map-board on 390px screen');
    assert.equal(mobileMapAudit.tipShownOnFirstTap, true);
    assert.equal(mobileMapAudit.tipHiddenOnSecondTap, true);

    // 2. Mobile 390x844 Combat audit: resolve Floor 0 Neow blessing on mobile -> verify outcome banner + F1 are BOTH immediately visible in viewport without manual scrolling -> enter combat
    const mobileNeowOutcomeAudit = await cdp.evaluate(`(() => {
      if (document.getElementById('neow-blessing-panel')) {
        document.getElementById('neow-choice-0').click();
        if (document.getElementById('neow-action-modal')) {
          document.querySelector('#neow-action-modal [data-action="complete-neow-action"]').click();
        }
      }
      const bannerEl = document.getElementById('neow-outcome-banner');
      const f1El = document.querySelector('.map-node-btn.available');
      const bannerRect = bannerEl ? bannerEl.getBoundingClientRect() : null;
      const f1Rect = f1El ? f1El.getBoundingClientRect() : null;
      const hudHeight = document.querySelector('.top-hud')?.getBoundingClientRect()?.bottom || 0;
      return {
        hasBanner: Boolean(bannerEl),
        bannerInViewport: Boolean(
          bannerRect && bannerRect.top >= hudHeight - 2 && bannerRect.bottom <= window.innerHeight + 4
        ),
        f1InViewport: Boolean(
          f1Rect && f1Rect.top >= hudHeight - 2 && f1Rect.bottom <= window.innerHeight + 4
        ),
        bannerBelowF1: Boolean(bannerRect && f1Rect && bannerRect.top >= f1Rect.bottom - 2),
      };
    })()`);
    assert.equal(mobileNeowOutcomeAudit.hasBanner, true, 'Neow outcome banner must render after choosing blessing');
    assert.equal(mobileNeowOutcomeAudit.bannerInViewport, true, 'Neow outcome banner must stay visible inside 390x844 mobile viewport without manual scrolling');
    assert.equal(mobileNeowOutcomeAudit.f1InViewport, true, 'F1 starting node must also be visible inside 390x844 mobile viewport');
    assert.equal(mobileNeowOutcomeAudit.bannerBelowF1, true, 'Neow outcome banner must sit directly below F1 starting nodes');

    if (process.env.SCRATCH_SCREENSHOT_DIR) {
      fs.mkdirSync(process.env.SCRATCH_SCREENSHOT_DIR, { recursive: true });
      const shotNeowMob = await cdp.send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(
        path.join(process.env.SCRATCH_SCREENSHOT_DIR, 'mobile_neow_outcome.png'),
        Buffer.from(shotNeowMob.data, 'base64')
      );
    }

    const mobileCombatAudit = await cdp.evaluate(`(() => {
      document.querySelector('.map-node-btn.available').click();
      const docScrollWidth = document.documentElement.scrollWidth;
      const innerWidth = window.innerWidth;
      const handOverflowX = getComputedStyle(document.querySelector('.hand-tray')).overflowX;

      const nextHint = document.querySelector('.enemy-side .next-intent-hint');
      const nextHintDisplay = nextHint ? getComputedStyle(nextHint).display : 'none';
      const duplicateTriggerCount = document.querySelectorAll('.enemy-side .next-intent-trigger').length;
      const intentBadge = document.querySelector('.enemy-side .intent-badge');
      const intentBadgeRect = intentBadge ? intentBadge.getBoundingClientRect() : null;
      intentBadge.click();
      const tip = document.getElementById('spire-tooltip');
      const tipOpen = !tip.hidden;
      const tipDesc = tip.querySelector('.spire-tooltip-desc')?.textContent?.trim() || '';
      if (!tip.hidden) intentBadge.click();

      return {
        docScrollWidth,
        innerWidth,
        handOverflowX,
        nextHintDisplay,
        duplicateTriggerCount,
        intentBadgeVisible: Boolean(intentBadgeRect && intentBadgeRect.width >= 24 && intentBadgeRect.height >= 20),
        tipOpen,
        tipDesc,
      };
    })()`);
    assert.ok(
      mobileCombatAudit.docScrollWidth <= mobileCombatAudit.innerWidth,
      `Mobile combat overflowed horizontally: ${mobileCombatAudit.docScrollWidth} > ${mobileCombatAudit.innerWidth}`
    );
    assert.equal(mobileCombatAudit.handOverflowX, 'auto');
    assert.equal(mobileCombatAudit.nextHintDisplay, 'none', 'Multi-line .next-intent-hint must be hidden on 390px mobile');
    assert.equal(mobileCombatAudit.duplicateTriggerCount, 0, 'Duplicate 🔮 .next-intent-trigger icon must be removed');
    assert.equal(mobileCombatAudit.intentBadgeVisible, true, 'Unified .intent-badge must be visible on 390px mobile');
    assert.equal(mobileCombatAudit.tipOpen, true);
    assert.ok(
      mobileCombatAudit.tipDesc.includes('下回合可能行动'),
      `Unified .intent-badge tooltip must include next-turn forecast, got: ${mobileCombatAudit.tipDesc}`
    );

    const auditSideBySideCombat = async (enemyCount) => {
      return cdp.evaluate(`(() => {
        const app = window.__SPIRE_APP__;
        const st = app.getState();
        const baseEnemy = st.combat.enemies[0];
        st.combat.enemies = Array.from({ length: ${enemyCount} }, (_, idx) => ({
          ...structuredClone(baseEnemy),
          id: 'e_layout_' + idx,
          name: idx === 0 ? '邪教徒' : idx === 1 ? '巨型尖刺史莱姆' : '远古哨卫',
        }));
        app.render();

        const arena = document.querySelector('.combat-arena');
        const arenaRect = arena.getBoundingClientRect();
        const playerRect = document.getElementById('player-unit').getBoundingClientRect();
        const enemyRects = [...document.querySelectorAll('[id^="enemy-unit-"]')].map((el) =>
          el.getBoundingClientRect()
        );
        const minEnemyLeft = Math.min(...enemyRects.map((r) => r.left));
        const maxEnemyRight = Math.max(...enemyRects.map((r) => r.right));

        let enemyOverlapCount = 0;
        for (let i = 0; i < enemyRects.length; i += 1) {
          for (let j = i + 1; j < enemyRects.length; j += 1) {
            const a = enemyRects[i];
            const b = enemyRects[j];
            const horizOverlap = a.left < b.right - 1.5 && b.left < a.right - 1.5;
            const vertOverlap = a.top < b.bottom - 1.5 && b.top < a.bottom - 1.5;
            if (horizOverlap && vertOverlap) enemyOverlapCount += 1;
          }
        }

        return {
          innerWidth: window.innerWidth,
          docScrollWidth: document.documentElement.scrollWidth,
          enemyDensityAttr: arena.dataset.enemyCount,
          playerRight: playerRect.right,
          playerLeft: playerRect.left,
          arenaLeft: arenaRect.left,
          arenaRight: arenaRect.right,
          minEnemyLeft,
          maxEnemyRight,
          enemyOverlapCount,
        };
      })()`);
    };

    for (const count of [1, 2, 3]) {
      const layout390 = await auditSideBySideCombat(count);
      assert.equal(layout390.enemyDensityAttr, String(count));
      assert.ok(
        layout390.docScrollWidth <= layout390.innerWidth,
        `390px 1v${count} overflowed horizontally: ${layout390.docScrollWidth} > ${layout390.innerWidth}`
      );
      assert.ok(
        layout390.playerRight <= layout390.minEnemyLeft + 2,
        `390px 1v${count} expected player on left of enemies, got playerRight=${layout390.playerRight}, minEnemyLeft=${layout390.minEnemyLeft}`
      );
      assert.ok(
        layout390.maxEnemyRight <= layout390.arenaRight + 1.5 &&
          layout390.playerLeft >= layout390.arenaLeft - 1.5,
        `390px 1v${count} fighter overflowed arena bounds`
      );
      assert.equal(layout390.enemyOverlapCount, 0, `390px 1v${count} enemies must not overlap`);

      if (process.env.SCRATCH_SCREENSHOT_DIR) {
        fs.mkdirSync(process.env.SCRATCH_SCREENSHOT_DIR, { recursive: true });
        const shot = await cdp.send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(
          path.join(process.env.SCRATCH_SCREENSHOT_DIR, `combat_390_1v${count}.png`),
          Buffer.from(shot.data, 'base64')
        );
      }
    }

    // 2b. Half-screen desktop / tablet 720x880 Combat audit (exact <=768px window class where vertical stacking previously occurred)
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 720,
      height: 880,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await cdp.send('Emulation.setTouchEmulationEnabled', { enabled: false });
    await new Promise((r) => setTimeout(r, 120));

    for (const count of [1, 2, 3]) {
      const layout720 = await auditSideBySideCombat(count);
      assert.equal(layout720.enemyDensityAttr, String(count));
      assert.ok(
        layout720.docScrollWidth <= layout720.innerWidth,
        `720px 1v${count} overflowed horizontally: ${layout720.docScrollWidth} > ${layout720.innerWidth}`
      );
      assert.ok(
        layout720.playerRight <= layout720.minEnemyLeft + 2,
        `720px 1v${count} expected player on left of enemies, got playerRight=${layout720.playerRight}, minEnemyLeft=${layout720.minEnemyLeft}`
      );
      assert.ok(
        layout720.maxEnemyRight <= layout720.arenaRight + 1.5 &&
          layout720.playerLeft >= layout720.arenaLeft - 1.5,
        `720px 1v${count} fighter overflowed arena bounds`
      );
      assert.equal(layout720.enemyOverlapCount, 0, `720px 1v${count} enemies must not overlap`);

      if (process.env.SCRATCH_SCREENSHOT_DIR) {
        const shot = await cdp.send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(
          path.join(process.env.SCRATCH_SCREENSHOT_DIR, `combat_720_1v${count}.png`),
          Buffer.from(shot.data, 'base64')
        );
      }
    }

    // 3. Boot generated standalone single-file HTML bundle directly in Chromium & verify full interactivity
    await cdp.evaluate(`window.localStorage.clear()`);
    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${port}/dist/slay_the_spire_lite.html` });
    await new Promise((r) => setTimeout(r, 350));

    const standaloneAudit = await cdp.evaluate(`(() => {
      const hasApp = Boolean(window.__SPIRE_APP__);
      const hasMainMenu = Boolean(document.getElementById('main-menu-screen'));
      if (hasMainMenu) {
        document.getElementById('btn-menu-standard')?.click();
      }
      const hasCharSelect = Boolean(document.getElementById('character-select-screen'));
      if (hasCharSelect) {
        document.getElementById('btn-start-character-run').click();
      }
      const rowCount = document.querySelectorAll('.map-row').length;
      document.getElementById('btn-open-settings').click();
      const hasSettings = Boolean(document.getElementById('settings-modal'));
      document.getElementById('btn-close-modal').click();
      return { hasApp, hasMainMenu, hasCharSelect, rowCount, hasSettings };
    })()`);
    assert.equal(standaloneAudit.hasApp, true);
    assert.equal(standaloneAudit.hasMainMenu, true);
    assert.equal(standaloneAudit.hasCharSelect, true);
    assert.equal(standaloneAudit.rowCount, 16);
    assert.equal(standaloneAudit.hasSettings, true);

    const exceptions = cdp.events.filter((e) => e.method === 'Runtime.exceptionThrown');
    const consoleErrors = cdp.events.filter(
      (e) => e.method === 'Runtime.consoleAPICalled' && e.params?.type === 'error'
    );
    assert.equal(exceptions.length, 0, `Uncaught exceptions: ${JSON.stringify(exceptions)}`);
    assert.equal(consoleErrors.length, 0, `Console errors: ${JSON.stringify(consoleErrors)}`);

    cdp.ws.close();
  } finally {
    await teardownSession({ server, browser, cdp });
  }
});

test('Real Chromium E2E: Floor 0 Neow Blessing UI (cancel & Boss Swap), URL Seeded Challenge invite modal & parity, URL paste, Coffee Dripper & Snecko Eye UI', async (t) => {
  if (!resolveBrowserBinary()) {
    t.skip('Chromium/Chrome binary not available');
    return;
  }

  const { server, port } = await startStaticServer();
  let browser = null;
  let cdp = null;

  try {
    browser = await launchHeadlessChromium();
    const debugPort = new URL(browser.browserWsUrl).port;
    const targets = await (await fetch(`http://127.0.0.1:${debugPort}/json/list`)).json();
    const pageTarget = targets.find((x) => x.type === 'page');
    assert.ok(pageTarget);

    cdp = await createCdpClient(pageTarget.webSocketDebuggerUrl);
    await cdp.send('Runtime.enable');
    await cdp.send('Page.enable');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 880,
      deviceScaleFactor: 1,
      mobile: false,
    });

    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${port}/` });
    await new Promise((r) => setTimeout(r, 350));
    await launchHeroFromCharacterSelect(cdp, 'ironclad');

    // 1. Floor 0 Neow's Blessing panel renders above map, locks Floor 1, warns on clicking locked F1, supports cancelable deck picker & Boss Swap
    const neowStartAudit = await cdp.evaluate(`(() => {
      const hasPanel = Boolean(document.getElementById('neow-blessing-panel'));
      const choiceCount = document.querySelectorAll('.neow-choice-card').length;
      const f1Locked = document.getElementById('map-node-f1_c0')?.getAttribute('aria-disabled') === 'true';

      // Click locked F1 node -> notice prompts player to pick Neow blessing first
      document.getElementById('map-node-f1_c0').click();
      const warnText = document.querySelector('.toast-banner')?.textContent?.trim() || '';

      return { hasPanel, choiceCount, f1Locked, warnText };
    })()`);
    assert.equal(neowStartAudit.hasPanel, true);
    assert.equal(neowStartAudit.choiceCount, 4);
    assert.equal(neowStartAudit.f1Locked, true);
    assert.ok(neowStartAudit.warnText.includes('鲸鱼赐福'));

    if (process.env.SCRATCH_SCREENSHOT_DIR) {
      fs.mkdirSync(process.env.SCRATCH_SCREENSHOT_DIR, { recursive: true });
      const shotNeow = await cdp.send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(
        path.join(process.env.SCRATCH_SCREENSHOT_DIR, 'neow_blessing_map.png'),
        Buffer.from(shotNeow.data, 'base64')
      );
    }

    // Test cancelable deck picker (upgrade_1) via Escape, then perform Boss Swap (#neow-choice-3)
    const neowFlowAudit = await cdp.evaluate(`(() => {
      const app = window.__SPIRE_APP__;
      const st = app.getState();
      st.neowState.options[0] = {
        id: 'upgrade_1',
        tier: 'small',
        badge: '稳健增益',
        title: '锻造升级 1 张牌',
        detail: '自选升级 1 张牌',
      };
      app.render();

      document.getElementById('neow-choice-0').click();
      const modalOpened = Boolean(document.getElementById('neow-action-modal'));
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      const modalClosedAfterEsc = !document.getElementById('neow-action-modal');
      const stillPendingAfterEsc = Boolean(document.getElementById('neow-blessing-panel'));

      // Now choose Boss Swap (#neow-choice-3)
      document.getElementById('neow-choice-3').click();
      const bannerEl = document.getElementById('neow-outcome-banner');
      const f1El = document.getElementById('map-node-f1_c0');
      const outcomeBanner = bannerEl?.textContent?.trim() || '';
      const f1Unlocked = f1El?.getAttribute('aria-disabled') === 'false';
      const bannerRect = bannerEl ? bannerEl.getBoundingClientRect() : null;
      const f1Rect = f1El ? f1El.getBoundingClientRect() : null;
      const bannerInViewport = Boolean(bannerRect && bannerRect.top >= 0 && bannerRect.bottom <= window.innerHeight + 4);
      const f1InViewport = Boolean(f1Rect && f1Rect.top >= 0 && f1Rect.bottom <= window.innerHeight + 4);
      const relics = [...app.getState().player.relics];
      return { modalOpened, modalClosedAfterEsc, stillPendingAfterEsc, outcomeBanner, f1Unlocked, bannerInViewport, f1InViewport, relics };
    })()`);
    assert.equal(neowFlowAudit.modalOpened, true);
    assert.equal(neowFlowAudit.modalClosedAfterEsc, true);
    assert.equal(neowFlowAudit.stillPendingAfterEsc, true);
    assert.ok(neowFlowAudit.outcomeBanner.includes('涅奥换核成功'));
    assert.equal(neowFlowAudit.f1Unlocked, true);
    assert.equal(neowFlowAudit.bannerInViewport, true, 'Desktop Neow outcome banner must be immediately visible in viewport after Boss Swap');
    assert.equal(neowFlowAudit.f1InViewport, true, 'Desktop F1 node must remain immediately visible above Neow outcome banner');
    assert.equal(neowFlowAudit.relics.includes('burning_blood'), false);
    assert.equal(neowFlowAudit.relics.includes('black_blood'), false);
    assert.equal(neowFlowAudit.relics.length, 1);

    // 2. Navigate with ?seed=S-16&asc=3 while an active save exists -> verify confirmation modal, URL cleanup, and temporary Asc 3 parity
    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${port}/?seed=S-16&asc=3` });
    await new Promise((r) => setTimeout(r, 350));

    const inviteAudit = await cdp.evaluate(`(() => {
      const hasInviteModal = Boolean(document.getElementById('challenge-invite-modal'));
      const desc = document.getElementById('challenge-invite-desc')?.textContent?.trim() || '';
      const cleanedSearch = window.location.search;
      return { hasInviteModal, desc, cleanedSearch };
    })()`);
    assert.equal(inviteAudit.hasInviteModal, true, 'Active save must trigger challenge invite confirmation modal');
    assert.ok(inviteAudit.desc.includes('S-16') && inviteAudit.desc.includes('进阶 3'));
    assert.equal(inviteAudit.cleanedSearch, '', 'Query string should be cleaned via history.replaceState');

    if (process.env.SCRATCH_SCREENSHOT_DIR) {
      const shotInvite = await cdp.send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(
        path.join(process.env.SCRATCH_SCREENSHOT_DIR, 'challenge_invite_modal.png'),
        Buffer.from(shotInvite.data, 'base64')
      );
    }

    const acceptAudit = await cdp.evaluate(`(() => {
      document.getElementById('btn-accept-challenge').click();
      const app = window.__SPIRE_APP__;
      const st = app.getState();
      const meta = app.getMeta();

      // Click HUD copy seed pill -> verifies full challenge URL notice
      document.getElementById('btn-copy-seed').click();
      const copyNotice = document.querySelector('.toast-banner')?.textContent?.trim() || '';

      return {
        seed: st.seed,
        ascension: st.ascension,
        isChallengeRun: st.isChallengeRun,
        unlockAllOverride: st.unlockAllOverride,
        metaMaxAsc: meta.maxAscensionUnlocked,
        hasChallengePill: Boolean(document.getElementById('hud-challenge-pill')),
        ascPillText: document.getElementById('hud-ascension-pill')?.textContent?.trim() || '',
        copyNotice,
      };
    })()`);
    assert.equal(acceptAudit.seed, 42);
    assert.equal(acceptAudit.ascension, 3);
    assert.equal(acceptAudit.isChallengeRun, true);
    assert.equal(acceptAudit.unlockAllOverride, true);
    assert.equal(acceptAudit.metaMaxAsc, 0, 'Challenge link must NOT permanently elevate career maxAscensionUnlocked');
    assert.equal(acceptAudit.hasChallengePill, true);
    assert.equal(acceptAudit.ascPillText, '进阶 3');
    assert.ok(acceptAudit.copyNotice.includes('?seed=S-16&asc=3'), `Expected full challenge URL in notice, got: ${acceptAudit.copyNotice}`);

    // 3. Paste a full challenge URL into Meta modal seed launcher -> parses seed & ascension automatically
    const pasteUrlAudit = await cdp.evaluate(`(() => {
      document.getElementById('btn-open-meta').click();
      const input = document.getElementById('seed-input-box');
      input.value = 'https://lishiyi.github.io/card-game/?seed=S-2A&asc=2';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      document.getElementById('btn-start-seeded-run').click();
      const st = window.__SPIRE_APP__.getState();
      return {
        seed: st.seed,
        ascension: st.ascension,
        isChallengeRun: st.isChallengeRun,
      };
    })()`);
    assert.equal(pasteUrlAudit.seed, 82); // '2A' base36 = 2*36 + 10 = 82
    assert.equal(pasteUrlAudit.ascension, 2);
    assert.equal(pasteUrlAudit.isChallengeRun, true);

    // 4. Verify Coffee Dripper disables Rest heal button and Snecko Eye displays Confusion status + randomized cost badges in combat
    const relicUiAudit = await cdp.evaluate(`(() => {
      const app = window.__SPIRE_APP__;
      const st = app.getState();
      st.player.relics = ['coffee_dripper', 'snecko_eye'];
      st.screen = 'rest';
      st.restState = { completed: false, lastAction: null, featherHealed: 0 };
      app.render();

      const healBtnDisabled = document.getElementById('btn-rest-heal')?.disabled === true;
      const healBtnText = document.getElementById('btn-rest-heal')?.textContent?.trim() || '';

      // Jump back to map, resolve Neow, enter combat with Snecko Eye
      st.screen = 'map';
      st.currentNodeId = null;
      if (st.neowState) st.neowState.resolved = true;
      app.render();
      document.getElementById('map-node-f1_c0').click();

      const stCombat = app.getState();
      // Force one card higher cost and one card lower cost to confirm visual badge classes
      if (stCombat.combat.hand.length >= 2) {
        stCombat.combat.hand[0].combatCost = 3;
        stCombat.combat.hand[1].combatCost = 0;
        app.render();
      }
      const handCount = document.querySelectorAll('#hand-tray .game-card').length;
      const confusedChip = document.querySelector('#player-unit .status-chip[data-status-key="confused"]');
      const hasConfusedChip = Boolean(
        confusedChip?.querySelector('svg[data-status-svg="confused"]') &&
          (confusedChip.dataset.tooltipTitle || '').includes('混乱')
      );
      const hasIncreasedCostBadge = Boolean(document.querySelector('#hand-tray .card-cost.cost-increased'));
      const hasReducedCostBadge = Boolean(document.querySelector('#hand-tray .card-cost.upgraded'));

      return { healBtnDisabled, healBtnText, handCount, hasConfusedChip, hasIncreasedCostBadge, hasReducedCostBadge };
    })()`);
    assert.equal(relicUiAudit.healBtnDisabled, true);
    assert.ok(relicUiAudit.healBtnText.includes('咖啡滤杯'));
    assert.equal(relicUiAudit.handCount, 7, 'Snecko Eye should draw 7 cards on Turn 1');
    assert.equal(relicUiAudit.hasConfusedChip, true);
    assert.equal(relicUiAudit.hasIncreasedCostBadge, true);
    assert.equal(relicUiAudit.hasReducedCostBadge, true);

    const exceptions = cdp.events.filter((e) => e.method === 'Runtime.exceptionThrown');
    const consoleErrors = cdp.events.filter(
      (e) => e.method === 'Runtime.consoleAPICalled' && e.params?.type === 'error'
    );
    assert.equal(exceptions.length, 0, `Uncaught exceptions: ${JSON.stringify(exceptions)}`);
    assert.equal(consoleErrors.length, 0, `Console errors: ${JSON.stringify(consoleErrors)}`);

    cdp.ws.close();
  } finally {
    await teardownSession({ server, browser, cdp });
  }
});

test('Real Chromium E2E: Treasure loot plaque, subdued unplayable cards, Lethal/Shield-Break previews, card synergy highlights, and desktop drag-to-play', async (t) => {
  if (!resolveBrowserBinary()) {
    t.skip('Chromium/Chrome binary not available');
    return;
  }

  const { server, port } = await startStaticServer();
  let browser = null;
  let cdp = null;

  try {
    browser = await launchHeadlessChromium();
    const debugPort = new URL(browser.browserWsUrl).port;
    const targets = await (await fetch(`http://127.0.0.1:${debugPort}/json/list`)).json();
    const pageTarget = targets.find((x) => x.type === 'page');
    assert.ok(pageTarget);

    cdp = await createCdpClient(pageTarget.webSocketDebuggerUrl);
    await cdp.send('Runtime.enable');
    await cdp.send('Page.enable');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 880,
      deviceScaleFactor: 1,
      mobile: false,
    });

    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${port}/` });
    await new Promise((r) => setTimeout(r, 350));
    await launchHeroFromCharacterSelect(cdp, 'ironclad');

    // 1. Treasure Room prominent loot plaque matching battle gold reward style
    const treasureAudit = await cdp.evaluate(`(() => {
      const app = window.__SPIRE_APP__;
      const st = app.getState();
      st.screen = 'treasure';
      st.treasureState = {
        opened: false,
        relicId: null,
        gold: 0,
        curseCardId: null,
        outcomeText: '',
      };
      app.render();

      const btn = document.getElementById('btn-open-treasure');
      const rect = btn.getBoundingClientRect();
      return {
        hasLootCardClass: btn.classList.contains('loot-reward-card') && btn.classList.contains('loot-kind-gold'),
        hasChestIcon: Boolean(btn.querySelector('[data-loot-icon="chest"]')),
        hasCtaBadge: Boolean(btn.querySelector('.loot-claim-cta')),
        height: rect.height,
      };
    })()`);
    assert.equal(treasureAudit.hasLootCardClass, true);
    assert.equal(treasureAudit.hasChestIcon, true);
    assert.equal(treasureAudit.hasCtaBadge, true);
    assert.ok(treasureAudit.height >= 80, `Expected prominent treasure plaque height >= 80px, got ${treasureAudit.height}`);

    if (process.env.SCRATCH_SCREENSHOT_DIR) {
      fs.mkdirSync(process.env.SCRATCH_SCREENSHOT_DIR, { recursive: true });
      const shotTreasure = await cdp.send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(
        path.join(process.env.SCRATCH_SCREENSHOT_DIR, 'treasure_plaque.png'),
        Buffer.from(shotTreasure.data, 'base64')
      );
    }

    // 2. Setup 2-enemy combat to test: unplayable card dimming, Lethal/Shield-Break previews, Synergy/Warning highlights, and Desktop Drag-to-Play
    await cdp.evaluate(`(() => {
      const app = window.__SPIRE_APP__;
      const st = app.getState();
      st.screen = 'map';
      st.currentNodeId = null;
      if (st.neowState) st.neowState.resolved = true;
      st.player.relics = ['burning_blood', 'paper_phrog', 'charons_ashes'];
      app.render();
      document.getElementById('map-node-f1_c0').click();

      const stc = app.getState();
      const baseEnemy = stc.combat.enemies[0];
      stc.combat.enemies = [
        {
          ...structuredClone(baseEnemy),
          id: 'enemy_nob',
          name: '地精大块头',
          artKey: 'gremlin_nob',
          hp: 10,
          maxHp: 84,
          block: 0,
          statuses: { enrage: 2 },
        },
        {
          ...structuredClone(baseEnemy),
          id: 'enemy_shield',
          name: '邪教徒',
          artKey: 'cultist',
          hp: 25,
          maxHp: 48,
          block: 5,
          statuses: { vulnerable: 2 },
        },
      ];
      stc.player.energy = 2;
      stc.player.statuses = { strength: 2, feelNoPain: 3 };
      stc.combat.hand = [
        { instanceId: 'ux_strike', cardId: 'strike', upgraded: false }, // cost 1 -> playable, 8 dmg (14 w/ vuln+phrog -> Shield Break on enemy_shield)
        { instanceId: 'ux_defend', cardId: 'defend', upgraded: false }, // cost 1 -> playable, triggers Enrage warn on enemy_nob
        { instanceId: 'ux_bludgeon', cardId: 'bludgeon', upgraded: false }, // cost 3 -> UNPLAYABLE at 2 energy!
        { instanceId: 'ux_second_wind', cardId: 'second_wind', upgraded: false }, // cost 1 -> playable, exhausts non-attack ux_defend!
      ];
      app.render();
    })()`);
    // Wait for .card-deal-in (240ms + stagger) to complete before reading settled styles
    await cdp.evaluate(`(async () => {
      const el = document.getElementById('hand-card-ux_strike');
      if (!el) return;
      const anims = typeof el.getAnimations === 'function' ? el.getAnimations() : [];
      if (anims.length > 0) {
        await Promise.race([
          Promise.allSettled(anims.map((a) => a.finished)),
          new Promise((r) => setTimeout(r, 1500)),
        ]);
      } else {
        await new Promise((r) => setTimeout(r, 450));
      }
    })()`);
    const setupAudit = await cdp.evaluate(`(() => {
      const playableStyle = getComputedStyle(document.getElementById('hand-card-ux_strike'));
      const unplayableEl = document.getElementById('hand-card-ux_bludgeon');
      const unplayableStyle = getComputedStyle(unplayableEl);
      return {
        playableOpacity: Number(playableStyle.opacity),
        unplayableOpacity: Number(unplayableStyle.opacity),
        unplayableFilter: unplayableStyle.filter,
        unplayableReason: unplayableEl.dataset.unplayableReason,
      };
    })()`);
    assert.ok(setupAudit.playableOpacity >= 0.95, `Playable card should be bright, got ${setupAudit.playableOpacity}`);
    assert.ok(setupAudit.unplayableOpacity <= 0.45, `Unplayable card should be clearly dimmed, got ${setupAudit.unplayableOpacity}`);
    assert.ok(setupAudit.unplayableFilter.includes('saturate'), `Unplayable card should be desaturated, got ${setupAudit.unplayableFilter}`);
    assert.equal(setupAudit.unplayableReason, 'energy');

    const getCenter = async (selector) =>
      cdp.evaluate(`(() => {
        const el = document.querySelector(${JSON.stringify(selector)});
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2) };
      })()`);

    // 3. Hover Defend (Skill) -> verify Gremlin Nob Enrage warning highlight + callout bar
    const defendPos = await getCenter('#hand-card-ux_defend');
    await cdp.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: defendPos.x, y: defendPos.y });
    await new Promise((r) => setTimeout(r, 60));
    const defendHoverAudit = await cdp.evaluate(`(() => {
      const enrageChip = document.querySelector('#enemy-unit-enemy_nob .status-chip[data-status-key="enrage"]');
      const callout = document.getElementById('synergy-callout-bar');
      return {
        enrageWarnGlow: enrageChip?.classList.contains('synergy-glow-warn') ?? false,
        calloutVisible: callout ? !callout.hidden : false,
        calloutText: callout?.textContent?.trim() || '',
      };
    })()`);
    assert.equal(defendHoverAudit.enrageWarnGlow, true);
    assert.equal(defendHoverAudit.calloutVisible, true);
    assert.ok(defendHoverAudit.calloutText.includes('激怒'));

    // 4. Hover Second Wind -> verify Feel No Pain, Charon's Ashes, and other non-attack card (ux_defend) highlight
    const swPos = await getCenter('#hand-card-ux_second_wind');
    await cdp.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: swPos.x, y: swPos.y });
    await new Promise((r) => setTimeout(r, 60));
    const swHoverAudit = await cdp.evaluate(`(() => ({
      fnpGlow: document.querySelector('#player-unit .status-chip[data-status-key="feelNoPain"]')?.classList.contains('synergy-glow-buff') ?? false,
      charonGlow: document.querySelector('.relic-badge[data-relic-id="charons_ashes"]')?.classList.contains('synergy-glow-buff') ?? false,
      defendExhaustGlow: document.getElementById('hand-card-ux_defend')?.classList.contains('synergy-card-exhaust') ?? false,
      strikeExhaustGlow: document.getElementById('hand-card-ux_strike')?.classList.contains('synergy-card-exhaust') ?? false,
    }))()`);
    assert.equal(swHoverAudit.fnpGlow, true);
    assert.equal(swHoverAudit.charonGlow, true);
    assert.equal(swHoverAudit.defendExhaustGlow, true);
    assert.equal(swHoverAudit.strikeExhaustGlow, false);

    // 5. Hover Strike (8 dmg vs 7 HP Nob -> Lethal; 14 dmg vs 5 block + 25 HP Vulnerable Cultist -> Shield Break + Paper Phrog glow!)
    await cdp.evaluate(`(() => {
      const app = window.__SPIRE_APP__;
      app.getState().combat.enemies[0].hp = 7;
      app.render();
    })()`);
    await new Promise((r) => setTimeout(r, 420));
    await cdp.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 4, y: 4 });
    await new Promise((r) => setTimeout(r, 40));
    const layoutBeforePreview = await cdp.evaluate(`(() => ({
      arenaHeight: Math.round(document.getElementById('combat-arena').getBoundingClientRect().height),
      handTrayTop: Math.round(document.getElementById('hand-tray').getBoundingClientRect().top),
    }))()`);

    const strikePos = await getCenter('#hand-card-ux_strike');
    await cdp.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: strikePos.x, y: strikePos.y });
    await new Promise((r) => setTimeout(r, 60));

    const tacticsHoverAudit = await cdp.evaluate(`(() => ({
      nobLethalBadge: Boolean(document.querySelector('[data-preview-badges="enemy_nob"] [data-preview-kind="lethal"]')),
      shieldBreakBadge: Boolean(document.querySelector('[data-preview-badges="enemy_shield"] [data-preview-kind="shield-break"]')),
      paperPhrogGlow: document.querySelector('.relic-badge[data-relic-id="paper_phrog"]')?.classList.contains('synergy-glow-buff') ?? false,
      strengthGlow: document.querySelector('#player-unit .status-chip[data-status-key="strength"]')?.classList.contains('synergy-glow-buff') ?? false,
      arenaHeight: Math.round(document.getElementById('combat-arena').getBoundingClientRect().height),
      handTrayTop: Math.round(document.getElementById('hand-tray').getBoundingClientRect().top),
    }))()`);
    assert.equal(tacticsHoverAudit.nobLethalBadge, true, 'Expected Lethal badge on 7 HP Gremlin Nob');
    assert.equal(tacticsHoverAudit.shieldBreakBadge, true, 'Expected Shield-Break badge on 5-Block Cultist');
    assert.equal(tacticsHoverAudit.paperPhrogGlow, true, 'Expected Paper Phrog relic glow on Vulnerable attack');
    assert.equal(tacticsHoverAudit.strengthGlow, true, 'Expected Strength chip glow on attack');
    assert.equal(
      tacticsHoverAudit.arenaHeight,
      layoutBeforePreview.arenaHeight,
      `Combat arena height must not shift when attack preview badges appear (${layoutBeforePreview.arenaHeight} -> ${tacticsHoverAudit.arenaHeight})`
    );
    assert.equal(
      tacticsHoverAudit.handTrayTop,
      layoutBeforePreview.handTrayTop,
      `Hand tray vertical position must stay fixed when attack preview badges appear (${layoutBeforePreview.handTrayTop} -> ${tacticsHoverAudit.handTrayTop})`
    );

    if (process.env.SCRATCH_SCREENSHOT_DIR) {
      const shotTactics = await cdp.send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(
        path.join(process.env.SCRATCH_SCREENSHOT_DIR, 'combat_tactics_synergy.png'),
        Buffer.from(shotTactics.data, 'base64')
      );
    }

    // 6. Real Desktop Drag-to-Play #1: Drag single-target Strike onto Cultist (#enemy-unit-enemy_shield)
    const cultistPos = await getCenter('#enemy-unit-enemy_shield');
    await cdp.send('Input.dispatchMouseEvent', {
      type: 'mousePressed',
      x: strikePos.x,
      y: strikePos.y,
      button: 'left',
      buttons: 1,
      clickCount: 1,
    });
    await cdp.send('Input.dispatchMouseEvent', {
      type: 'mouseMoved',
      x: Math.round((strikePos.x + cultistPos.x) / 2),
      y: Math.round((strikePos.y + cultistPos.y) / 2),
      buttons: 1,
    });
    await cdp.send('Input.dispatchMouseEvent', {
      type: 'mouseMoved',
      x: cultistPos.x,
      y: cultistPos.y,
      buttons: 1,
    });
    await new Promise((r) => setTimeout(r, 50));

    const midDragAimAudit = await cdp.evaluate(`(() => ({
      hasAimSvg: Boolean(document.querySelector('#spire-drag-layer .drag-aim-svg')),
      targetHovered: document.getElementById('enemy-unit-enemy_shield')?.classList.contains('drag-target-hover') ?? false,
    }))()`);
    assert.equal(midDragAimAudit.hasAimSvg, true, 'Dragging single-target card must render SVG aiming arrow');
    assert.equal(midDragAimAudit.targetHovered, true, 'Aimed enemy unit must receive drag-target-hover highlight');

    if (process.env.SCRATCH_SCREENSHOT_DIR) {
      const shotDrag = await cdp.send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(
        path.join(process.env.SCRATCH_SCREENSHOT_DIR, 'combat_drag_aim.png'),
        Buffer.from(shotDrag.data, 'base64')
      );
    }

    await cdp.send('Input.dispatchMouseEvent', {
      type: 'mouseReleased',
      x: cultistPos.x,
      y: cultistPos.y,
      button: 'left',
      buttons: 0,
      clickCount: 1,
    });
    await new Promise((r) => setTimeout(r, 60));

    const afterSingleDragAudit = await cdp.evaluate(`(() => {
      const st = window.__SPIRE_APP__.getState();
      const cultist = st.combat.enemies.find((e) => e.id === 'enemy_shield');
      return {
        cultistBlock: cultist.block,
        cultistHp: cultist.hp,
        strikeStillInHand: st.combat.hand.some((c) => c.instanceId === 'ux_strike'),
        energyLeft: st.player.energy,
      };
    })()`);
    assert.equal(afterSingleDragAudit.cultistBlock, 0);
    assert.equal(afterSingleDragAudit.cultistHp, 16); // 25 - (14 - 5) = 16
    assert.equal(afterSingleDragAudit.strikeStillInHand, false);
    assert.equal(afterSingleDragAudit.energyLeft, 1);

    // 7. Real Desktop Drag-to-Play #2: Drag self-target Defend up into #combat-arena drop zone
    const defendPos2 = await getCenter('#hand-card-ux_defend');
    const arenaPos = await getCenter('#combat-arena');
    await cdp.send('Input.dispatchMouseEvent', {
      type: 'mousePressed',
      x: defendPos2.x,
      y: defendPos2.y,
      button: 'left',
      buttons: 1,
      clickCount: 1,
    });
    await cdp.send('Input.dispatchMouseEvent', {
      type: 'mouseMoved',
      x: arenaPos.x,
      y: arenaPos.y,
      buttons: 1,
    });
    await new Promise((r) => setTimeout(r, 50));

    const midDragSelfAudit = await cdp.evaluate(`(() => ({
      hasGhostCard: Boolean(document.querySelector('#spire-drag-layer .drag-card-ghost')),
      arenaDropReady: document.getElementById('combat-arena')?.classList.contains('drag-drop-ready') ?? false,
    }))()`);
    assert.equal(midDragSelfAudit.hasGhostCard, true, 'Dragging self-target card must show floating ghost card');
    assert.equal(midDragSelfAudit.arenaDropReady, true, 'Dragging self-target card into arena must light up drop zone');

    await cdp.send('Input.dispatchMouseEvent', {
      type: 'mouseReleased',
      x: arenaPos.x,
      y: arenaPos.y,
      button: 'left',
      buttons: 0,
      clickCount: 1,
    });
    await new Promise((r) => setTimeout(r, 60));

    const afterSelfDragAudit = await cdp.evaluate(`(() => {
      const st = window.__SPIRE_APP__.getState();
      return {
        playerBlock: st.player.block,
        defendStillInHand: st.combat.hand.some((c) => c.instanceId === 'ux_defend'),
        energyLeft: st.player.energy,
      };
    })()`);
    assert.equal(afterSelfDragAudit.playerBlock, 5);
    assert.equal(afterSelfDragAudit.defendStillInHand, false);
    assert.equal(afterSelfDragAudit.energyLeft, 0);

    const exceptions = cdp.events.filter((e) => e.method === 'Runtime.exceptionThrown');
    const consoleErrors = cdp.events.filter(
      (e) => e.method === 'Runtime.consoleAPICalled' && e.params?.type === 'error'
    );
    assert.equal(exceptions.length, 0, `Uncaught exceptions: ${JSON.stringify(exceptions)}`);
    assert.equal(consoleErrors.length, 0, `Console errors: ${JSON.stringify(consoleErrors)}`);

    cdp.ws.close();
  } finally {
    await teardownSession({ server, browser, cdp });
  }
});

test('Real Chromium E2E: Character Select screen (Desktop & Mobile), The Silent 3 archetypes (Poison-Lethal, Shivs, Interactive Discard), Resume Active Run, and ?char=silent URL Challenge', async (t) => {
  if (!resolveBrowserBinary()) {
    t.skip('Chromium/Chrome binary not available');
    return;
  }

  const { server, port } = await startStaticServer();
  let browser = null;
  let cdp = null;

  try {
    browser = await launchHeadlessChromium();
    const debugPort = new URL(browser.browserWsUrl).port;
    const targets = await (await fetch(`http://127.0.0.1:${debugPort}/json/list`)).json();
    const pageTarget = targets.find((x) => x.type === 'page');
    assert.ok(pageTarget);

    cdp = await createCdpClient(pageTarget.webSocketDebuggerUrl);
    await cdp.send('Runtime.enable');
    await cdp.send('Page.enable');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 880,
      deviceScaleFactor: 1,
      mobile: false,
    });

    // 1. Fresh load lands on Character Select screen with Ironclad & Silent showcase cards
    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${port}/` });
    await new Promise((r) => setTimeout(r, 350));

    const charSelectAudit = await cdp.evaluate(`(() => {
      const hasMainMenu = Boolean(document.getElementById('main-menu-screen'));
      const hasResumeBeforeRun = Boolean(document.getElementById('btn-resume-active-run'));
      document.getElementById('btn-menu-standard')?.click();
      const screen = document.getElementById('character-select-screen');
      const ironcladCard = document.getElementById('char-card-ironclad');
      const silentCard = document.getElementById('char-card-silent');
      const startBtn = document.getElementById('btn-start-character-run');
      return {
        hasMainMenu,
        hasScreen: Boolean(screen),
        hasIronclad: Boolean(ironcladCard),
        hasSilent: Boolean(silentCard),
        ironcladSelectedInitially: ironcladCard?.classList.contains('selected') ?? false,
        silentSelectedInitially: silentCard?.classList.contains('selected') ?? false,
        startBtnTextBefore: startBtn?.textContent?.trim() || '',
        hasResumeBeforeRun,
        docScrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
      };
    })()`);
    assert.equal(charSelectAudit.hasMainMenu, true, 'Fresh load must render Main Menu Hall');
    assert.equal(charSelectAudit.hasScreen, true, 'Clicking Start Climb must render Character Select screen');
    assert.equal(charSelectAudit.hasIronclad, true);
    assert.equal(charSelectAudit.hasSilent, true);
    assert.equal(charSelectAudit.ironcladSelectedInitially, true);
    assert.equal(charSelectAudit.silentSelectedInitially, false);
    assert.equal(charSelectAudit.hasResumeBeforeRun, false);
    assert.ok(charSelectAudit.startBtnTextBefore.includes('铁甲战士'));
    assert.ok(charSelectAudit.docScrollWidth <= charSelectAudit.innerWidth);

    // Select The Silent & capture Desktop Character Select screenshot
    await cdp.evaluate(`document.getElementById('char-card-silent').click()`);
    const silentSelectedAudit = await cdp.evaluate(`(() => {
      const silentCard = document.getElementById('char-card-silent');
      const shellChar = document.querySelector('.spire-shell')?.dataset?.character || '';
      const startBtnText = document.getElementById('btn-start-character-run')?.textContent?.trim() || '';
      return {
        selected: silentCard?.classList.contains('selected') ?? false,
        cardText: silentCard?.textContent || '',
        shellChar,
        startBtnText,
      };
    })()`);
    assert.equal(silentSelectedAudit.selected, true);
    assert.equal(silentSelectedAudit.shellChar, 'silent');
    assert.ok(silentSelectedAudit.startBtnText.includes('静默猎手'));
    assert.ok(silentSelectedAudit.cardText.includes('蛇之戒指'));
    assert.ok(silentSelectedAudit.cardText.includes('剧毒药水'));
    assert.ok(silentSelectedAudit.cardText.includes('12 张'));

    if (process.env.SCRATCH_SCREENSHOT_DIR) {
      fs.mkdirSync(process.env.SCRATCH_SCREENSHOT_DIR, { recursive: true });
      const shotCharDesktop = await cdp.send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(
        path.join(process.env.SCRATCH_SCREENSHOT_DIR, 'char_select_desktop.png'),
        Buffer.from(shotCharDesktop.data, 'base64')
      );
    }

    // 2. Launch Silent run -> verify HUD, starter gear, 12-card deck, Neow Boss Swap text, and HUD Switch-Hero + Resume
    await cdp.evaluate(`document.getElementById('btn-start-character-run').click()`);
    const silentHudAudit = await cdp.evaluate(`(() => {
      const st = window.__SPIRE_APP__.getState();
      const neowBossSwap = document.getElementById('neow-choice-3')?.textContent || '';
      const relicEl = document.querySelector('.relic-badge');
      const relicText = relicEl?.textContent?.trim() || '';
      const relicSvgKey = relicEl?.querySelector('svg.relic-svg')?.dataset?.relicSvg || '';
      const potionTitle = document.getElementById('potion-slot-0')?.parentElement?.dataset?.tooltipTitle || '';
      return {
        characterId: st.characterId,
        heroName: st.player.name,
        hp: st.player.hp,
        maxHp: st.player.maxHp,
        deckBtnText: document.getElementById('btn-open-deck')?.textContent?.trim() || '',
        heroBadgeText: document.getElementById('hud-character-pill')?.textContent?.trim() || '',
        relicText,
        relicSvgKey,
        potionTitle,
        neowBossSwap,
      };
    })()`);
    assert.equal(silentHudAudit.characterId, 'silent');
    assert.equal(silentHudAudit.heroName, '静默猎手');
    assert.equal(silentHudAudit.hp, 70);
    assert.equal(silentHudAudit.maxHp, 70);
    assert.equal(silentHudAudit.deckBtnText, '🃏 牌组 (12)');
    assert.equal(silentHudAudit.heroBadgeText, '静默猎手');
    assert.equal(silentHudAudit.relicText, '蛇之戒指');
    assert.equal(silentHudAudit.relicSvgKey, 'ring_of_the_snake');
    assert.equal(silentHudAudit.potionTitle, '剧毒药水');
    assert.ok(silentHudAudit.neowBossSwap.includes('蛇之戒指'), `Expected Silent Boss Swap text, got: ${silentHudAudit.neowBossSwap}`);

    // Click HUD "新的一局" -> opens confirmation modal -> Cancel keeps active run -> Confirm opens Character Select with "继续当前对局"
    const resumeAudit = await cdp.evaluate(`(() => {
      document.getElementById('btn-new-run').click();
      const hasConfirmModal = Boolean(document.getElementById('confirm-new-run-modal'));
      document.getElementById('btn-cancel-new-run').click();
      const stayedOnMapAfterCancel = Boolean(document.getElementById('map-node-f1_c0')) && !document.getElementById('confirm-new-run-modal');
      document.getElementById('btn-new-run').click();
      document.getElementById('btn-confirm-new-run').click();
      const onMainMenu = Boolean(document.getElementById('main-menu-screen'));
      const hasResumeBtn = Boolean(document.getElementById('btn-resume-active-run'));
      document.getElementById('btn-resume-active-run').click();
      const resumedMap = Boolean(document.getElementById('map-node-f1_c0'));
      const stillSilent = window.__SPIRE_APP__.getState().characterId === 'silent';
      return { hasConfirmModal, stayedOnMapAfterCancel, onMainMenu, hasResumeBtn, resumedMap, stillSilent };
    })()`);
    assert.equal(resumeAudit.hasConfirmModal, true);
    assert.equal(resumeAudit.stayedOnMapAfterCancel, true);
    assert.equal(resumeAudit.onMainMenu, true);
    assert.equal(resumeAudit.hasResumeBtn, true);
    assert.equal(resumeAudit.resumedMap, true);
    assert.equal(resumeAudit.stillSilent, true);

    // 3. Resolve Neow Blessing & enter Floor 1 Combat -> verify Turn 1 draws 7 cards (Ring of the Snake) + Silent SVG portrait
    const silentCombatStartAudit = await cdp.evaluate(`(() => {
      document.getElementById('neow-choice-0').click();
      if (document.getElementById('neow-action-modal')) {
        document.querySelector('#neow-action-modal [data-action="complete-neow-action"]').click();
      }
      document.getElementById('map-node-f1_c0').click();
      const st = window.__SPIRE_APP__.getState();
      return {
        screen: st.screen,
        handCount: document.querySelectorAll('#hand-tray .game-card').length,
        playerName: document.querySelector('#player-unit .unit-name-text')?.textContent?.trim() || '',
        hasSilentPortraitSvg: Boolean(document.querySelector('#player-unit .unit-figure svg')),
      };
    })()`);
    assert.equal(silentCombatStartAudit.screen, 'combat');
    assert.equal(silentCombatStartAudit.handCount, 7, 'Ring of the Snake must draw 7 cards on Turn 1');
    assert.equal(silentCombatStartAudit.playerName, '静默猎手');
    assert.equal(silentCombatStartAudit.hasSilentPortraitSvg, true);

    const getCenter = async (selector) =>
      cdp.evaluate(`(() => {
        const el = document.querySelector(${JSON.stringify(selector)});
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2) };
      })()`);

    // 4. Poison-Lethal preview (☠ 毒杀) with Catalyst+ over a 20 HP / 7 Poison enemy
    await cdp.evaluate(`(() => {
      const app = window.__SPIRE_APP__;
      const st = app.getState();
      st.combat.enemies = [st.combat.enemies[0]];
      const enemy = st.combat.enemies[0];
      enemy.id = 'silent_poison_target';
      enemy.name = '邪教徒';
      enemy.hp = 20;
      enemy.maxHp = 48;
      enemy.block = 0;
      enemy.statuses = { poison: 7 };
      enemy.intent = { id: 'stab', name: '重击', type: 'attack', damage: 15, hits: 1 };
      st.player.energy = 3;
      st.combat.hand = [
        { instanceId: 'sil_cat_plus', cardId: 'catalyst', upgraded: true }, // 7 x 3 = 21 >= 20 -> ☠ 毒杀!
        { instanceId: 'sil_blade_dance', cardId: 'blade_dance', upgraded: false },
        { instanceId: 'sil_survivor', cardId: 'survivor', upgraded: false },
        { instanceId: 'sil_tactician', cardId: 'tactician', upgraded: false },
        { instanceId: 'sil_strike', cardId: 'strike', upgraded: false },
      ];
      app.render();
    })()`);
    await new Promise((r) => setTimeout(r, 420));

    const catPos = await getCenter('#hand-card-sil_cat_plus');
    await cdp.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: catPos.x, y: catPos.y });
    await new Promise((r) => setTimeout(r, 60));

    const poisonLethalAudit = await cdp.evaluate(`(() => ({
      hasPoisonLethalBadge: Boolean(
        document.querySelector('[data-preview-badges="silent_poison_target"] [data-preview-kind="poison-lethal"]')
      ),
      badgeText:
        document.querySelector('[data-preview-badges="silent_poison_target"] [data-preview-kind="poison-lethal"]')?.textContent?.trim() || '',
      hasPoisonCut:
        document.querySelector('[data-preview-cut="silent_poison_target"]')?.classList.contains('poison-cut') ?? false,
      poisonChipGlow:
        document.querySelector('#enemy-unit-silent_poison_target .status-chip[data-status-key="poison"]')?.classList.contains('synergy-glow-buff') ?? false,
    }))()`);
    assert.equal(poisonLethalAudit.hasPoisonLethalBadge, true, 'Hovering Catalyst+ must render Poison-Lethal badge');
    assert.ok(poisonLethalAudit.badgeText.includes('毒杀'));
    assert.equal(poisonLethalAudit.hasPoisonCut, true, 'HP bar must show emerald .poison-cut preview');
    assert.equal(poisonLethalAudit.poisonChipGlow, true, 'Poison status chip must glow with Catalyst synergy');

    if (process.env.SCRATCH_SCREENSHOT_DIR) {
      const shotPoison = await cdp.send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(
        path.join(process.env.SCRATCH_SCREENSHOT_DIR, 'silent_poison_lethal.png'),
        Buffer.from(shotPoison.data, 'base64')
      );
    }

    // 5. Play Blade Dance -> 3x Shiv (rarity-special), then play Survivor -> Interactive Manual Discard Mode + Tactician highlight!
    const shivAndDiscardAudit = await cdp.evaluate(`(() => {
      document.getElementById('hand-card-sil_blade_dance').click();
      const shivCards = [...document.querySelectorAll('#hand-tray .game-card[data-rarity="special"]')];

      document.getElementById('hand-card-sil_survivor').click();
      const banner = document.getElementById('combat-banner');
      const handTray = document.getElementById('hand-tray');
      const endTurnDisabled = document.getElementById('btn-end-turn')?.disabled === true;
      const tacticianEl = document.getElementById('hand-card-sil_tactician');

      return {
        shivCount: shivCards.length,
        hasDiscardPromptBanner: banner?.classList.contains('discard-prompt') ?? false,
        bannerText: banner?.textContent?.trim() || '',
        handSelectingDiscard: handTray?.classList.contains('discard-selecting') ?? false,
        endTurnDisabled,
        tacticianDiscardSelectable: tacticianEl?.classList.contains('discard-selectable') ?? false,
        tacticianDiscardSynergy: tacticianEl?.classList.contains('discard-synergy-card') ?? false,
        energyBeforeDiscard: window.__SPIRE_APP__.getState().player.energy,
      };
    })()`);
    assert.equal(shivAndDiscardAudit.shivCount, 3, 'Blade Dance must add 3 special Shiv cards to hand');
    assert.equal(shivAndDiscardAudit.hasDiscardPromptBanner, true);
    assert.ok(shivAndDiscardAudit.bannerText.includes('请选择 1 张手牌弃置'));
    assert.equal(shivAndDiscardAudit.handSelectingDiscard, true);
    assert.equal(shivAndDiscardAudit.endTurnDisabled, true, 'End Turn must be disabled during pendingDiscard');
    assert.equal(shivAndDiscardAudit.tacticianDiscardSelectable, true);
    assert.equal(shivAndDiscardAudit.tacticianDiscardSynergy, true, 'Tactician must highlight as discard synergy');

    if (process.env.SCRATCH_SCREENSHOT_DIR) {
      const shotDiscard = await cdp.send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(
        path.join(process.env.SCRATCH_SCREENSHOT_DIR, 'silent_discard_mode.png'),
        Buffer.from(shotDiscard.data, 'base64')
      );
    }

    // Click Tactician to discard it -> gains +1 energy & exits pendingDiscard cleanly, then cast Catalyst+ & End Turn to verify Poison-Lethal kills enemy!
    const afterDiscardAndPoisonWin = await cdp.evaluate(`(() => {
      document.getElementById('hand-card-sil_tactician').click();
      const st = window.__SPIRE_APP__.getState();
      const energyAfterDiscard = st.player.energy;
      const pendingAfterDiscard = st.combat.pendingDiscard;

      const hpBeforeEndTurn = st.player.hp;
      document.getElementById('hand-card-sil_cat_plus').click();
      document.getElementById('btn-end-turn').click();
      return {
        energyAfterDiscard,
        pendingAfterDiscard,
        hpBeforeEndTurn,
        hpAfterEndTurn: st.player.hp,
        screenAfterPoisonKill: st.screen,
      };
    })()`);
    assert.equal(
      afterDiscardAndPoisonWin.energyAfterDiscard,
      shivAndDiscardAudit.energyBeforeDiscard + 1,
      'Discarding Tactician must grant +1 energy'
    );
    assert.equal(afterDiscardAndPoisonWin.pendingAfterDiscard, null);
    assert.equal(
      afterDiscardAndPoisonWin.hpAfterEndTurn,
      afterDiscardAndPoisonWin.hpBeforeEndTurn,
      'Lethal Poison tick at start of enemy turn must kill enemy before its 15 dmg attack'
    );
    assert.equal(afterDiscardAndPoisonWin.screenAfterPoisonKill, 'reward');

    // 6. Mobile 390x844 Character Select responsive audit & screenshot
    await cdp.evaluate(`window.localStorage.clear()`);
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await cdp.send('Emulation.setTouchEmulationEnabled', { enabled: true });
    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${port}/` });
    await new Promise((r) => setTimeout(r, 350));

    await cdp.evaluate(`(() => {
      document.getElementById('btn-menu-standard')?.click();
      document.getElementById('char-card-silent')?.click();
    })()`);
    const mobileCharAudit = await cdp.evaluate(`({
      hasCharSelect: Boolean(document.getElementById('character-select-screen')),
      docScrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
    })`);
    assert.equal(mobileCharAudit.hasCharSelect, true);
    assert.ok(
      mobileCharAudit.docScrollWidth <= mobileCharAudit.innerWidth,
      `Mobile Character Select overflowed: ${mobileCharAudit.docScrollWidth} > ${mobileCharAudit.innerWidth}`
    );

    if (process.env.SCRATCH_SCREENSHOT_DIR) {
      const shotCharMobile = await cdp.send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(
        path.join(process.env.SCRATCH_SCREENSHOT_DIR, 'char_select_mobile.png'),
        Buffer.from(shotCharMobile.data, 'base64')
      );
    }

    // 7. URL Seeded Challenge with ?seed=S-16&asc=2&char=silent boots directly into Silent Asc 2 run!
    await cdp.evaluate(`window.localStorage.clear()`);
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 880,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await cdp.send('Emulation.setTouchEmulationEnabled', { enabled: false });
    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${port}/?seed=S-16&asc=2&char=silent` });
    await new Promise((r) => setTimeout(r, 350));

    const silentChallengeAudit = await cdp.evaluate(`(() => {
      const st = window.__SPIRE_APP__.getState();
      document.getElementById('btn-copy-seed').click();
      const copyNotice = document.querySelector('.toast-banner')?.textContent?.trim() || '';
      return {
        onMap: Boolean(document.getElementById('map-node-f1_c0')),
        characterId: st.characterId,
        seed: st.seed,
        ascension: st.ascension,
        isChallengeRun: st.isChallengeRun,
        copyNotice,
      };
    })()`);
    assert.equal(silentChallengeAudit.onMap, true, 'Challenge URL with empty save must launch directly onto Map');
    assert.equal(silentChallengeAudit.characterId, 'silent');
    assert.equal(silentChallengeAudit.seed, 42);
    assert.equal(silentChallengeAudit.ascension, 2);
    assert.equal(silentChallengeAudit.isChallengeRun, true);
    assert.ok(
      silentChallengeAudit.copyNotice.includes('char=silent'),
      `Expected Silent challenge share link to include char=silent, got: ${silentChallengeAudit.copyNotice}`
    );

    const exceptions = cdp.events.filter((e) => e.method === 'Runtime.exceptionThrown');
    const consoleErrors = cdp.events.filter(
      (e) => e.method === 'Runtime.consoleAPICalled' && e.params?.type === 'error'
    );
    assert.equal(exceptions.length, 0, `Uncaught exceptions: ${JSON.stringify(exceptions)}`);
    assert.equal(consoleErrors.length, 0, `Console errors: ${JSON.stringify(consoleErrors)}`);

    cdp.ws.close();
  } finally {
    await teardownSession({ server, browser, cdp });
  }
});

test('Real Chromium E2E: Daily Challenge + ?daily= invite + Shop Colorless shelf + Battle Report/History Review + Mobile 390x844 compact HUD, collapsible log, 2-tap confirm & touch swipe-up drag', async (t) => {
  if (!resolveBrowserBinary()) {
    t.skip('Chromium/Chrome binary not available');
    return;
  }

  const { server, port } = await startStaticServer();
  let browser = null;
  let cdp = null;

  try {
    browser = await launchHeadlessChromium();
    const debugPort = new URL(browser.browserWsUrl).port;
    const targets = await (await fetch(`http://127.0.0.1:${debugPort}/json/list`)).json();
    const pageTarget = targets.find((x) => x.type === 'page');
    assert.ok(pageTarget);

    cdp = await createCdpClient(pageTarget.webSocketDebuggerUrl);
    await cdp.send('Runtime.enable');
    await cdp.send('Page.enable');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 880,
      deviceScaleFactor: 1,
      mobile: false,
    });

    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${port}/` });
    await new Promise((r) => setTimeout(r, 350));

    // 1. Desktop Main Menu -> Daily Challenge Level 2 screen with A0-A6 Ascension & 3 modifiers
    const charDailyAudit = await cdp.evaluate(`(() => {
      document.getElementById('btn-menu-daily')?.click();
      const banner = document.getElementById('daily-challenge-banner');
      const launchBtn = document.getElementById('btn-start-daily-challenge');
      const ascPill = document.getElementById('daily-banner-ascension-pill');
      const modChips = [...document.querySelectorAll('#daily-challenge-banner .daily-mod-chip')];
      return {
        hasBanner: Boolean(banner),
        hasLaunchBtn: Boolean(launchBtn),
        dailyDate: launchBtn?.dataset?.dailyDate || '',
        ascPillText: ascPill?.textContent?.trim() || '',
        modCount: modChips.length,
      };
    })()`);
    assert.equal(charDailyAudit.hasBanner, true);
    assert.equal(charDailyAudit.hasLaunchBtn, true);
    assert.match(charDailyAudit.dailyDate, /^\d{4}-\d{2}-\d{2}$/);
    assert.match(charDailyAudit.ascPillText, /^进阶 [0-6]$/);
    const expectedDailyAsc = Number(charDailyAudit.ascPillText.replace('进阶 ', ''));
    assert.equal(charDailyAudit.modCount, 3);

    if (process.env.SCRATCH_SCREENSHOT_DIR) {
      fs.mkdirSync(process.env.SCRATCH_SCREENSHOT_DIR, { recursive: true });
      const shot = await cdp.send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(
        path.join(process.env.SCRATCH_SCREENSHOT_DIR, 'daily_char_select.png'),
        Buffer.from(shot.data, 'base64')
      );
    }

    // 2. Launch Today's Daily Challenge -> verify HUD Daily pill, daily Ascension, NO Neow Blessing, & Map modifier bar
    await cdp.evaluate(`document.getElementById('btn-start-daily-challenge').click()`);
    const dailyStartAudit = await cdp.evaluate(`(() => {
      const st = window.__SPIRE_APP__.getState();
      return {
        hasHudDailyPill: Boolean(document.getElementById('hud-daily-pill')),
        hudDailyText: document.getElementById('hud-daily-pill')?.textContent?.trim() || '',
        hasHudAscPill: Boolean(document.getElementById('hud-ascension-pill')),
        hudAscText: document.getElementById('hud-ascension-pill')?.textContent?.trim() || '',
        stateAscension: st.ascension,
        hasNeowState: Boolean(st.neowState),
        hasNeowPanel: Boolean(document.getElementById('neow-blessing-panel')),
        mapDailyLabel: document.querySelector('#map-daily-modifiers .daily-active-label')?.textContent?.trim() || '',
        mapModCount: document.querySelectorAll('#map-daily-modifiers .daily-mod-chip').length,
        dailyDateKey: st.dailyChallenge?.dateKey || '',
        copySeedDailyAttr: document.getElementById('btn-copy-seed')?.dataset?.dailyDate || '',
        hasMapBtnOnMapScreen: Boolean(document.getElementById('btn-open-map')),
      };
    })()`);
    assert.equal(dailyStartAudit.hasHudDailyPill, true);
    assert.equal(dailyStartAudit.stateAscension, expectedDailyAsc);
    assert.equal(dailyStartAudit.hasHudAscPill, expectedDailyAsc > 0);
    if (expectedDailyAsc > 0) {
      assert.equal(dailyStartAudit.hudAscText, `进阶 ${expectedDailyAsc}`);
    }
    assert.equal(dailyStartAudit.hasNeowState, false, 'Daily Challenge must not generate Neow Blessing');
    assert.equal(dailyStartAudit.hasNeowPanel, false, 'Daily Challenge map must not show Neow Blessing panel');
    assert.ok(dailyStartAudit.mapDailyLabel.includes(`进阶 ${expectedDailyAsc}`));
    assert.ok(dailyStartAudit.mapDailyLabel.includes('无鲸鱼赐福'));
    assert.equal(dailyStartAudit.mapModCount, 3);
    assert.equal(dailyStartAudit.dailyDateKey, charDailyAudit.dailyDate);
    assert.equal(dailyStartAudit.copySeedDailyAttr, charDailyAudit.dailyDate);
    assert.equal(dailyStartAudit.hasMapBtnOnMapScreen, false, 'HUD Map button should not duplicate on Map screen');

    // 3. Open Shop -> verify dedicated Colorless Shelf (1 Uncommon + 1 Rare), verify In-Room Map Modal & M hotkey, buy 1 colorless card
    const shopSetupAudit = await cdp.evaluate(`(() => {
      const app = window.__SPIRE_APP__;
      const st = app.getState();
      if (st.neowState) st.neowState.resolved = true;
      const shopNode = st.map.flat().find((n) => n.type === 'shop');
      const prevNode = st.map[shopNode.row - 1][0];
      st.currentNodeId = prevNode.id;
      prevNode.nextIds = [shopNode.id];
      st.player.gold = 600;
      app.render();
      document.getElementById('map-node-' + shopNode.id).click();

      const colorlessCards = [...document.querySelectorAll('#shop-colorless-cards .game-card')];
      return {
        screen: st.screen,
        hasMapBtnInShop: Boolean(document.getElementById('btn-open-map')),
        colorlessCount: colorlessCards.length,
        allHaveColorlessClass: colorlessCards.every((el) => el.classList.contains('card-colorless')),
        rarities: colorlessCards.map((el) => el.dataset.rarity),
        badges: colorlessCards.map((el) => el.querySelector('.rarity-badge')?.textContent?.trim() || ''),
      };
    })()`);
    assert.equal(shopSetupAudit.screen, 'shop');
    assert.equal(shopSetupAudit.hasMapBtnInShop, true, 'HUD Map button must appear inside Shop');
    assert.equal(shopSetupAudit.colorlessCount, 2);
    assert.equal(shopSetupAudit.allHaveColorlessClass, true);
    assert.deepEqual(shopSetupAudit.rarities, ['uncommon', 'rare']);
    assert.deepEqual(shopSetupAudit.badges, ['无色·罕见', '无色·稀有']);

    // Open Map Modal from Shop via HUD button -> verify read-only nodes, current pos, clicking node does NOT leave shop, M hotkey toggles closed/open
    const shopMapModalAudit = await cdp.evaluate(`(() => {
      const st = window.__SPIRE_APP__.getState();
      const nodeBefore = st.currentNodeId;
      document.getElementById('btn-open-map').click();
      const modal = document.getElementById('map-inspector-modal');
      const isReadonly = Boolean(modal?.querySelector('.map-board.map-readonly'));
      const currentPosNode = modal?.querySelector('#map-modal-node-' + CSS.escape(nodeBefore));
      const hasCurrentClass = currentPosNode?.classList.contains('current-pos') ?? false;
      const nextBranchNode = modal?.querySelector('.map-node-btn.available');
      if (nextBranchNode) nextBranchNode.click();
      const stillInShopAfterClick = st.screen === 'shop' && st.currentNodeId === nodeBefore;
      return {
        hasModal: Boolean(modal),
        isReadonly,
        hasCurrentClass,
        rowCount: modal ? modal.querySelectorAll('.map-row').length : 0,
        stillInShopAfterClick,
      };
    })()`);
    assert.equal(shopMapModalAudit.hasModal, true);
    assert.equal(shopMapModalAudit.isReadonly, true);
    assert.equal(shopMapModalAudit.hasCurrentClass, true);
    assert.equal(shopMapModalAudit.rowCount, 16);
    assert.equal(shopMapModalAudit.stillInShopAfterClick, true, 'Clicking a node in read-only map modal must not leave current room');

    if (process.env.SCRATCH_SCREENSHOT_DIR) {
      await new Promise((r) => setTimeout(r, 220));
      const shotMapModal = await cdp.send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(
        path.join(process.env.SCRATCH_SCREENSHOT_DIR, 'in_room_map_modal_desktop.png'),
        Buffer.from(shotMapModal.data, 'base64')
      );
    }

    const mapHotkeyAudit = await cdp.evaluate(`(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'm' }));
      const closedByM = !document.getElementById('map-inspector-modal');
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'M' }));
      const reopenedByM = Boolean(document.getElementById('map-inspector-modal'));
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      const closedByEsc = !document.getElementById('map-inspector-modal');
      return { closedByM, reopenedByM, closedByEsc, screen: window.__SPIRE_APP__.getState().screen };
    })()`);
    assert.equal(mapHotkeyAudit.closedByM, true);
    assert.equal(mapHotkeyAudit.reopenedByM, true);
    assert.equal(mapHotkeyAudit.closedByEsc, true);
    assert.equal(mapHotkeyAudit.screen, 'shop');

    if (process.env.SCRATCH_SCREENSHOT_DIR) {
      const shot = await cdp.send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(
        path.join(process.env.SCRATCH_SCREENSHOT_DIR, 'shop_colorless_desktop.png'),
        Buffer.from(shot.data, 'base64')
      );
    }

    const buyColorlessAudit = await cdp.evaluate(`(() => {
      const app = window.__SPIRE_APP__;
      const st = app.getState();
      const goldBefore = st.player.gold;
      const deckBefore = st.player.deck.length;
      const firstOfferPrice = st.shop.colorlessCards[0].price;
      const btn = document.querySelector('#shop-colorless-cards .game-card[data-offer-index="0"]');
      btn.click();
      const btnAfter = document.querySelector('#shop-colorless-cards .game-card[data-offer-index="0"]');
      return {
        goldDelta: goldBefore - st.player.gold,
        firstOfferPrice,
        deckDelta: st.player.deck.length - deckBefore,
        colorlessBought: st.stats.colorlessBought,
        disabledAfter: btnAfter?.disabled === true,
      };
    })()`);
    assert.equal(buyColorlessAudit.goldDelta, buyColorlessAudit.firstOfferPrice);
    assert.equal(buyColorlessAudit.deckDelta, 1);
    assert.equal(buyColorlessAudit.colorlessBought, 1);
    assert.equal(buyColorlessAudit.disabledAfter, true);

    // 4. Transition to Game Over Battle Report -> verify score, grade, breakdown, relics, copy report -> capture screenshot
    const gameOverAudit = await cdp.evaluate(`(() => {
      const app = window.__SPIRE_APP__;
      const st = app.getState();
      st.act = 2;
      st.floor = 16;
      st.stats.floorsCleared = 32;
      st.stats.combatsWon = 14;
      st.stats.perfectCombats = 5;
      st.stats.elitesSlain = 3;
      st.stats.bossesSlain = 2;
      st.stats.enemiesSlain = 21;
      st.stats.cardsPlayed = 118;
      st.stats.totalDamageDealt = 1640;
      st.stats.totalBlockGained = 520;
      st.stats.highestSingleHit = 54;
      st.player.relics.push('vajra', 'anchor', 'paper_phrog');
      st.runOutcome = 'victory';
      st.screen = 'game_over';
      app.render();

      document.getElementById('btn-copy-battle-report').click();
      const copied = app.getLastCopiedReport();
      return {
        hasReportCard: Boolean(document.getElementById('battle-report-card')),
        scoreText: document.getElementById('gameover-score-value')?.textContent?.trim() || '',
        gradeText: document.querySelector('#gameover-score-badge .score-rank-letter')?.textContent?.trim() || '',
        breakdownCount: document.querySelectorAll('#battle-report-card .score-breakdown-item').length,
        relicBadgeCount: document.querySelectorAll('#battle-report-card .report-relics-strip .relic-badge').length,
        copied,
      };
    })()`);
    assert.equal(gameOverAudit.hasReportCard, true);
    assert.ok(Number(gameOverAudit.scoreText.replace(/,/g, '')) >= 1000);
    assert.ok(['S+', 'S', 'A'].includes(gameOverAudit.gradeText));
    assert.ok(gameOverAudit.breakdownCount >= 6);
    assert.ok(gameOverAudit.relicBadgeCount >= 4);
    assert.ok(gameOverAudit.copied.includes(`每日挑战 ${charDailyAudit.dailyDate}`));
    assert.ok(gameOverAudit.copied.includes('总输出 1640'));
    assert.ok(gameOverAudit.copied.includes(`?daily=${charDailyAudit.dailyDate}`));

    if (process.env.SCRATCH_SCREENSHOT_DIR) {
      const shot = await cdp.send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(
        path.join(process.env.SCRATCH_SCREENSHOT_DIR, 'gameover_report_desktop.png'),
        Buffer.from(shot.data, 'base64')
      );
    }

    // 5. Open Meta Modal -> verify today's personal best in #meta-daily-banner -> open History Review Modal (#history-detail-modal)
    const historyReviewAudit = await cdp.evaluate(`(() => {
      document.getElementById('btn-gameover-meta').click();
      const dailyBannerText = document.getElementById('meta-daily-banner')?.textContent?.trim() || '';
      const inspectBtn = document.querySelector('#run-history-list [data-action="inspect-history-run"]');
      inspectBtn.click();

      const modal = document.getElementById('history-detail-modal');
      const deckCards = modal ? [...modal.querySelectorAll('.card-showcase .game-card')] : [];
      const stackBadges = modal ? [...modal.querySelectorAll('.card-stack-badge')] : [];
      const relicBadges = modal ? [...modal.querySelectorAll('.report-relics-strip .relic-badge')] : [];
      document.getElementById('btn-copy-history-report').click();
      const copiedHist = window.__SPIRE_APP__.getLastCopiedReport();
      return {
        dailyBannerText,
        hasHistoryModal: Boolean(modal),
        deckCardCount: deckCards.length,
        stackBadgeCount: stackBadges.length,
        relicCount: relicBadges.length,
        copiedHistHasDaily: copiedHist.includes('每日挑战'),
      };
    })()`);
    assert.ok(historyReviewAudit.dailyBannerText.includes('今日最高'));
    assert.equal(historyReviewAudit.hasHistoryModal, true);
    assert.ok(historyReviewAudit.deckCardCount >= 4);
    assert.ok(historyReviewAudit.stackBadgeCount >= 1, 'Duplicate cards should merge with ×N stack badge in history review');
    assert.ok(historyReviewAudit.relicCount >= 4);
    assert.equal(historyReviewAudit.copiedHistHasDaily, true);

    if (process.env.SCRATCH_SCREENSHOT_DIR) {
      await new Promise((r) => setTimeout(r, 250));
      const shot = await cdp.send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(
        path.join(process.env.SCRATCH_SCREENSHOT_DIR, 'history_detail_modal.png'),
        Buffer.from(shot.data, 'base64')
      );
    }

    // 6. ?daily=2026-11-19 deep link with active run -> verify confirmation modal & accept
    await cdp.evaluate(`(() => {
      document.getElementById('btn-close-modal').click();
      document.getElementById('btn-replay-current-seed').click();
    })()`);
    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${port}/?daily=2026-11-19` });
    await new Promise((r) => setTimeout(r, 350));

    const dailyInviteAudit = await cdp.evaluate(`(() => {
      const hasInvite = Boolean(document.getElementById('challenge-invite-modal'));
      const title = document.getElementById('modal-title')?.textContent?.trim() || '';
      const desc = document.getElementById('challenge-invite-desc')?.textContent?.trim() || '';
      document.getElementById('btn-accept-challenge').click();
      const st = window.__SPIRE_APP__.getState();
      return {
        hasInvite,
        title,
        desc,
        acceptedDateKey: st.dailyChallenge?.dateKey || '',
        acceptedAsc: st.ascension,
        acceptedHasNeow: Boolean(st.neowState),
        acceptedModCount: st.dailyChallenge?.modifierIds?.length ?? 0,
      };
    })()`);
    assert.equal(dailyInviteAudit.hasInvite, true);
    assert.ok(dailyInviteAudit.title.includes('2026-11-19'));
    assert.ok(dailyInviteAudit.desc.includes('无鲸鱼赐福'));
    assert.ok(dailyInviteAudit.desc.includes('规则词条'));
    assert.equal(dailyInviteAudit.acceptedDateKey, '2026-11-19');
    assert.ok(dailyInviteAudit.acceptedAsc >= 0 && dailyInviteAudit.acceptedAsc <= 6);
    assert.equal(dailyInviteAudit.acceptedHasNeow, false);
    assert.equal(dailyInviteAudit.acceptedModCount, 3);

    // 7. Mobile 390x844 Experience Upgrade Audits (Touch Emulation ON)
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await cdp.send('Emulation.setTouchEmulationEnabled', { enabled: true });
    await cdp.evaluate(`window.localStorage.clear()`);
    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${port}/` });
    await new Promise((r) => setTimeout(r, 350));

    // 7a. Mobile Main Menu -> Dedicated Daily Challenge Screen
    const mobileSelectAudit = await cdp.evaluate(`(() => {
      document.getElementById('btn-menu-daily')?.click();
      return {
        hasDailyBanner: Boolean(document.getElementById('daily-challenge-banner')),
        docScrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
      };
    })()`);
    assert.equal(mobileSelectAudit.hasDailyBanner, true);
    assert.ok(
      mobileSelectAudit.docScrollWidth <= mobileSelectAudit.innerWidth,
      `Mobile Char Select overflowed: ${mobileSelectAudit.docScrollWidth} > ${mobileSelectAudit.innerWidth}`
    );

    if (process.env.SCRATCH_SCREENSHOT_DIR) {
      const shot = await cdp.send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(
        path.join(process.env.SCRATCH_SCREENSHOT_DIR, 'mobile_daily_select.png'),
        Buffer.from(shot.data, 'base64')
      );
    }

    // 7b. Mobile Shop 2-Column Colorless Grid + zero overflow
    await cdp.evaluate(`document.getElementById('btn-start-daily-challenge').click()`);
    const mobileShopAudit = await cdp.evaluate(`(() => {
      const app = window.__SPIRE_APP__;
      const st = app.getState();
      if (st.neowState) st.neowState.resolved = true;
      const shopNode = st.map.flat().find((n) => n.type === 'shop');
      const prevNode = st.map[shopNode.row - 1][0];
      st.currentNodeId = prevNode.id;
      prevNode.nextIds = [shopNode.id];
      st.player.gold = 500;
      app.render();
      document.getElementById('map-node-' + shopNode.id).click();

      const colorlessCards = [...document.querySelectorAll('#shop-colorless-cards .game-card')];
      const r0 = colorlessCards[0]?.getBoundingClientRect();
      const r1 = colorlessCards[1]?.getBoundingClientRect();
      return {
        docScrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
        twoColSideBySide: Boolean(r0 && r1 && r1.left > r0.left + 20 && Math.abs(r0.top - r1.top) < 16),
      };
    })()`);
    assert.ok(
      mobileShopAudit.docScrollWidth <= mobileShopAudit.innerWidth,
      `Mobile Shop overflowed: ${mobileShopAudit.docScrollWidth} > ${mobileShopAudit.innerWidth}`
    );
    assert.equal(mobileShopAudit.twoColSideBySide, true, 'Mobile Shop colorless shelf should render 2-column side-by-side');

    if (process.env.SCRATCH_SCREENSHOT_DIR) {
      const shot = await cdp.send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(
        path.join(process.env.SCRATCH_SCREENSHOT_DIR, 'mobile_shop_colorless.png'),
        Buffer.from(shot.data, 'base64')
      );
    }

    // 7c. Mobile Combat: Compact single-row HUD with 6 relics, collapsible log, 2-tap confirm, and directional touch swipe-up drag
    const mobileCombatBaseAudit = await cdp.evaluate(`(() => {
      const app = window.__SPIRE_APP__;
      const st = app.getState();
      document.getElementById('btn-leave-shop').click();
      // Jump to Floor 1 combat and equip 6 relics to stress-test single-row scrollable HUD
      st.currentNodeId = null;
      st.player.relics = ['burning_blood', 'vajra', 'anchor', 'lantern', 'akabeko', 'paper_phrog'];
      app.render();
      document.querySelector('.map-node-btn.available').click();

      // Keep 1 healthy enemy + deterministic hand (Defend + Strike) for touch tests
      st.combat.enemies = [st.combat.enemies[0]];
      st.combat.enemies[0].hp = 40;
      st.combat.enemies[0].maxHp = 40;
      st.combat.enemies[0].block = 0;
      delete st.combat.enemies[0].statuses.curlUp;
      st.player.energy = 3;
      st.player.block = 0;
      st.combat.hand = [
        { instanceId: 'mob_defend_1', cardId: 'defend', upgraded: false },
        { instanceId: 'mob_strike_1', cardId: 'strike', upgraded: false },
        { instanceId: 'mob_strike_2', cardId: 'strike', upgraded: false },
      ];
      app.render();

      const combatLog = document.getElementById('combat-log');
      const logDisplayBefore = combatLog ? getComputedStyle(combatLog).display : '';

      document.getElementById('btn-toggle-mobile-log').click();
      const logDisplayAfter = document.getElementById('combat-log')
        ? getComputedStyle(document.getElementById('combat-log')).display
        : '';
      // Collapse back so combat stays compact for screenshot
      document.getElementById('btn-toggle-mobile-log').click();

      const hudRect = document.querySelector('.top-hud')?.getBoundingClientRect();
      const gearScroll = document.querySelector('.hud-gear-scroll');
      const potionStrip = document.querySelector('.potion-strip');
      const potionSlots = [...document.querySelectorAll('.potion-strip .potion-slot')];
      const allPotionsVisibleInViewport =
        potionSlots.length >= 2 &&
        potionSlots.every((btn) => {
          const r = btn.getBoundingClientRect();
          return r.width > 0 && r.left >= 0 && r.right <= window.innerWidth;
        });
      const mobileBar = document.getElementById('mobile-hand-bar');

      return {
        docScrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
        hudHeight: Math.round(hudRect?.height ?? 999),
        gearOverflowX: gearScroll ? getComputedStyle(gearScroll).overflowX : '',
        gearScrollLeft: gearScroll ? gearScroll.scrollLeft : -1,
        potionsInsideGearScroll: gearScroll ? Boolean(gearScroll.querySelector('.potion-strip')) : true,
        allPotionsVisibleInViewport,
        potionStripPresent: Boolean(potionStrip),
        mobileBarVisible: mobileBar ? getComputedStyle(mobileBar).display !== 'none' : false,
        logDisplayBefore,
        logDisplayAfter,
      };
    })()`);
    assert.ok(
      mobileCombatBaseAudit.docScrollWidth <= mobileCombatBaseAudit.innerWidth,
      `Mobile Combat with 6 relics overflowed: ${mobileCombatBaseAudit.docScrollWidth} > ${mobileCombatBaseAudit.innerWidth}`
    );
    assert.ok(
      mobileCombatBaseAudit.hudHeight <= 170,
      `Compact mobile HUD with 6 relics should stay compact (<=170px), got ${mobileCombatBaseAudit.hudHeight}px`
    );
    assert.equal(mobileCombatBaseAudit.gearOverflowX, 'auto');
    assert.equal(mobileCombatBaseAudit.potionsInsideGearScroll, false, 'Potions must NOT share horizontal scroll container with relics');
    assert.equal(mobileCombatBaseAudit.potionStripPresent, true);
    assert.equal(mobileCombatBaseAudit.gearScrollLeft, 0);
    assert.equal(
      mobileCombatBaseAudit.allPotionsVisibleInViewport,
      true,
      'All potion slots must be immediately visible in 390px mobile viewport without scrolling relics'
    );
    assert.equal(mobileCombatBaseAudit.mobileBarVisible, true);
    assert.equal(mobileCombatBaseAudit.logDisplayBefore, 'none');
    assert.notEqual(mobileCombatBaseAudit.logDisplayAfter, 'none');

    if (process.env.SCRATCH_SCREENSHOT_DIR) {
      const shot = await cdp.send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(
        path.join(process.env.SCRATCH_SCREENSHOT_DIR, 'mobile_combat_compact.png'),
        Buffer.from(shot.data, 'base64')
      );
    }

    // 7c-2. Open In-Room Map Modal directly from Mobile Combat -> verify zero overflow & zero node overlap -> close back to combat
    const mobileCombatMapAudit = await cdp.evaluate(`(() => {
      const btn = document.getElementById('btn-open-map');
      btn.click();
      const modal = document.getElementById('map-inspector-modal');
      const board = modal?.querySelector('.map-board');
      const boardRect = board?.getBoundingClientRect();
      let overlapCount = 0;
      if (board && boardRect) {
        for (const row of board.querySelectorAll('.map-row')) {
          const rects = [...row.querySelectorAll('.map-node-btn')]
            .map((b) => b.getBoundingClientRect())
            .sort((a, b) => a.left - b.left);
          for (let i = 1; i < rects.length; i += 1) {
            if (rects[i - 1].right > rects[i].left + 1.5) overlapCount += 1;
          }
        }
      }
      return {
        hasModal: Boolean(modal),
        docScrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
        overlapCount,
      };
    })()`);
    assert.equal(mobileCombatMapAudit.hasModal, true);
    assert.ok(
      mobileCombatMapAudit.docScrollWidth <= mobileCombatMapAudit.innerWidth,
      `Mobile Map Modal overflowed: ${mobileCombatMapAudit.docScrollWidth} > ${mobileCombatMapAudit.innerWidth}`
    );
    assert.equal(mobileCombatMapAudit.overlapCount, 0, 'Mobile Map Modal 4-col nodes must not overlap');

    if (process.env.SCRATCH_SCREENSHOT_DIR) {
      await new Promise((r) => setTimeout(r, 220));
      const shotMobMap = await cdp.send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(
        path.join(process.env.SCRATCH_SCREENSHOT_DIR, 'in_room_map_modal_mobile.png'),
        Buffer.from(shotMobMap.data, 'base64')
      );
    }

    await cdp.evaluate(`document.getElementById('btn-close-modal').click()`);
    assert.equal(await cdp.evaluate(`window.__SPIRE_APP__.getState().screen`), 'combat');

    // 7d. Two-tap confirm mode on mobile (via Settings toggle)
    const twoTapAudit = await cdp.evaluate(`(() => {
      document.getElementById('btn-open-settings').click();
      document.getElementById('btn-toggle-mobile-tap-confirm').click();
      const btnText = document.getElementById('btn-toggle-mobile-tap-confirm')?.textContent?.trim() || '';
      document.getElementById('btn-close-modal').click();

      const st = window.__SPIRE_APP__.getState();
      const blockBefore = st.player.block;
      // 1st tap selects Defend without playing it
      document.getElementById('hand-card-mob_defend_1').click();
      const selectedAfterTap1 = document.getElementById('hand-card-mob_defend_1')?.classList.contains('selected-card') ?? false;
      const blockAfterTap1 = st.player.block;
      // 2nd tap plays Defend
      document.getElementById('hand-card-mob_defend_1').click();
      const blockAfterTap2 = st.player.block;

      // Turn off tap-confirm afterwards
      document.getElementById('btn-open-settings').click();
      document.getElementById('btn-toggle-mobile-tap-confirm').click();
      document.getElementById('btn-close-modal').click();

      return { btnText, blockBefore, selectedAfterTap1, blockAfterTap1, blockAfterTap2 };
    })()`);
    assert.ok(twoTapAudit.btnText.includes('已开启'));
    assert.equal(twoTapAudit.selectedAfterTap1, true);
    assert.equal(twoTapAudit.blockAfterTap1, twoTapAudit.blockBefore, '1st tap must preview without playing');
    assert.ok(twoTapAudit.blockAfterTap2 > twoTapAudit.blockBefore, '2nd tap must play selected card');

    // 7e. Directional touch drag: horizontal swipe does NOT play card; upward swipe onto enemy plays Strike!
    const touchDragAudit = await cdp.evaluate(`(() => {
      const st = window.__SPIRE_APP__.getState();
      const enemy = st.combat.enemies[0];
      const hpBefore = enemy.hp;
      const strikeEl = document.getElementById('hand-card-mob_strike_1');
      const sRect = strikeEl.getBoundingClientRect();
      const startX = sRect.left + sRect.width / 2;
      const startY = sRect.top + sRect.height / 2;

      // A) Horizontal swipe (should cancel drag & preserve horizontal scroll)
      strikeEl.dispatchEvent(new PointerEvent('pointerdown', {
        bubbles: true, pointerId: 11, pointerType: 'touch', clientX: startX, clientY: startY,
      }));
      window.dispatchEvent(new PointerEvent('pointermove', {
        bubbles: true, pointerId: 11, pointerType: 'touch', clientX: startX - 50, clientY: startY - 4,
      }));
      window.dispatchEvent(new PointerEvent('pointerup', {
        bubbles: true, pointerId: 11, pointerType: 'touch', clientX: startX - 50, clientY: startY - 4,
      }));
      const hpAfterHorizSwipe = enemy.hp;

      // B) Clear upward swipe aiming onto enemy unit (accounting for thumb offset)
      const enemyEl = document.getElementById('enemy-unit-' + enemy.id);
      const eRect = enemyEl.getBoundingClientRect();
      const targetX = eRect.left + eRect.width / 2;
      const targetY = eRect.top + eRect.height / 2 + 24;

      strikeEl.dispatchEvent(new PointerEvent('pointerdown', {
        bubbles: true, pointerId: 12, pointerType: 'touch', clientX: startX, clientY: startY,
      }));
      window.dispatchEvent(new PointerEvent('pointermove', {
        bubbles: true, pointerId: 12, pointerType: 'touch', clientX: startX, clientY: startY - 36,
      }));
      window.dispatchEvent(new PointerEvent('pointermove', {
        bubbles: true, pointerId: 12, pointerType: 'touch', clientX: targetX, clientY: targetY,
      }));
      window.dispatchEvent(new PointerEvent('pointerup', {
        bubbles: true, pointerId: 12, pointerType: 'touch', clientX: targetX, clientY: targetY,
      }));

      return {
        hpBefore,
        hpAfterHorizSwipe,
        hpAfterUpwardSwipe: enemy.hp,
      };
    })()`);
    assert.equal(touchDragAudit.hpAfterHorizSwipe, touchDragAudit.hpBefore, 'Horizontal touch swipe must NOT play card');
    assert.ok(touchDragAudit.hpAfterUpwardSwipe < touchDragAudit.hpBefore, 'Upward touch drag onto enemy must play Strike');

    // 7f. Mobile Game Over Battle Report zero overflow + screenshot
    const mobileReportAudit = await cdp.evaluate(`(() => {
      const app = window.__SPIRE_APP__;
      const st = app.getState();
      st.runOutcome = 'defeat';
      st.stats.defeatedBy = '大颚虫';
      st.screen = 'game_over';
      app.render();
      return {
        hasReportCard: Boolean(document.getElementById('battle-report-card')),
        docScrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
      };
    })()`);
    assert.equal(mobileReportAudit.hasReportCard, true);
    assert.ok(
      mobileReportAudit.docScrollWidth <= mobileReportAudit.innerWidth,
      `Mobile Game Over report overflowed: ${mobileReportAudit.docScrollWidth} > ${mobileReportAudit.innerWidth}`
    );

    if (process.env.SCRATCH_SCREENSHOT_DIR) {
      const shot = await cdp.send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(
        path.join(process.env.SCRATCH_SCREENSHOT_DIR, 'mobile_gameover_report.png'),
        Buffer.from(shot.data, 'base64')
      );
    }

    const exceptions = cdp.events.filter((e) => e.method === 'Runtime.exceptionThrown');
    const consoleErrors = cdp.events.filter(
      (e) => e.method === 'Runtime.consoleAPICalled' && e.params?.type === 'error'
    );
    assert.equal(exceptions.length, 0, `Uncaught exceptions: ${JSON.stringify(exceptions)}`);
    assert.equal(consoleErrors.length, 0, `Console errors: ${JSON.stringify(consoleErrors)}`);

    cdp.ws.close();
  } finally {
    await teardownSession({ server, browser, cdp });
  }
});

test('Real Chromium E2E: New-Run Confirmation, Tiered Chests, Dual Shop Relics + Membership Card Live Discount, Act 2->3 Altar & Act 3 Boss UI (Desktop + Mobile)', async (t) => {
  if (!resolveBrowserBinary()) {
    t.skip('Chromium/Chrome binary not available');
    return;
  }

  const { server, port } = await startStaticServer();
  let browser = null;
  let cdp = null;

  try {
    browser = await launchHeadlessChromium();
    const debugPort = new URL(browser.browserWsUrl).port;
    const targets = await (await fetch(`http://127.0.0.1:${debugPort}/json/list`)).json();
    const pageTarget = targets.find((x) => x.type === 'page');
    assert.ok(pageTarget);

    cdp = await createCdpClient(pageTarget.webSocketDebuggerUrl);
    await cdp.send('Runtime.enable');
    await cdp.send('Page.enable');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${port}/` });
    await new Promise((r) => setTimeout(r, 350));

    await launchHeroFromCharacterSelect(cdp, 'ironclad');

    // 1. Resolve Neow Blessing, enter F9 Treasure Chest via DOM click, and enter Shop -> verify dual relic slots & Membership Card 50% live discount
    const shopTreasureAudit = await cdp.evaluate(`(() => {
      const app = window.__SPIRE_APP__;
      document.getElementById('neow-choice-0').click();
      if (document.getElementById('neow-action-modal')) {
        const pick = document.querySelector('#neow-action-modal [data-action="complete-neow-action"]');
        if (pick) pick.click();
      }
      const st = app.getState();
      st.player.gold = 600;

      // Enter F9 Treasure Chest -> check chest tier badge
      const f9 = st.map[8][0];
      st.currentNodeId = st.map[7].find((n) => n.nextIds.includes(f9.id)).id;
      app.render();
      document.getElementById('map-node-' + f9.id).click();
      const chestBadgeText = document.querySelector('#treasure-heading .chest-tier-badge')?.textContent?.trim() || '';

      // Enter a Shop node via real DOM click -> verify both #btn-buy-relic and #btn-buy-shop-relic and live 50% discount!
      const shopNode = st.map.flat().find((n) => n.type === 'shop');
      st.screen = 'map';
      st.currentNodeId =
        shopNode.floor === 1
          ? null
          : st.map[shopNode.floor - 2].find((n) => n.nextIds.includes(shopNode.id)).id;
      app.render();
      document.getElementById('map-node-' + shopNode.id).click();

      st.shop.shopRelicOffer = { relicId: 'membership_card', basePrice: 150, price: 150, sold: false };
      app.render();
      const hasGeneralRelicBtn = Boolean(document.getElementById('btn-buy-relic'));
      const hasShopRelicBtn = Boolean(document.getElementById('btn-buy-shop-relic'));
      const shopRelicText = document.getElementById('btn-buy-shop-relic')?.textContent || '';
      const genPriceBefore = st.shop.relicOffer.price;
      const purgePriceBefore = st.shop.purgeCost;
      document.getElementById('btn-buy-shop-relic').click();
      const hasMemberBadge = Boolean(document.querySelector('.shop-member-badge'));
      const genPriceAfter = st.shop.relicOffer.price;
      const purgePriceAfter = st.shop.purgeCost;
      return {
        chestBadgeText,
        hasGeneralRelicBtn,
        hasShopRelicBtn,
        shopRelicHasLabel: shopRelicText.includes('[商店专属]'),
        hasMemberBadge,
        genPriceHalved: genPriceAfter <= Math.ceil(genPriceBefore * 0.5) + 1,
        purgePriceHalved: purgePriceAfter <= Math.ceil(purgePriceBefore * 0.5) + 1,
      };
    })()`);
    assert.ok(['小宝箱', '中宝箱', '大宝箱'].includes(shopTreasureAudit.chestBadgeText));
    assert.equal(shopTreasureAudit.hasGeneralRelicBtn, true);
    assert.equal(shopTreasureAudit.hasShopRelicBtn, true);
    assert.equal(shopTreasureAudit.shopRelicHasLabel, true);
    assert.equal(shopTreasureAudit.hasMemberBadge, true);
    assert.equal(shopTreasureAudit.genPriceHalved, true);
    assert.equal(shopTreasureAudit.purgePriceHalved, true);

    // 2. Act 2 Boss Altar -> proceed to Act 3 -> Act 3 Map, Medical Kit playable Wound, Time Eater SVG, Happy Flower counter HUD, Game Over skips confirmation
    const act3UiAudit = await cdp.evaluate(`(() => {
      const app = window.__SPIRE_APP__;
      const st = app.getState();
      st.act = 2;
      st.bossReward = {
        actCleared: 2,
        bossGold: 135,
        cardChoices: [],
        cardClaimed: true,
        pickedCardId: null,
        relicChoices: ['sozu', 'velvet_choker', 'astrolabe'],
        pickedRelicId: null,
      };
      st.screen = 'boss_reward';
      app.render();
      const hasAct3Btn = Boolean(document.getElementById('btn-proceed-act3'));
      const hasSettleAct2Btn = Boolean(document.getElementById('btn-settle-act2'));
      document.getElementById('btn-proceed-act3').click();

      const afterProceedAct = app.getState().act;
      const act3MapTitle = document.getElementById('map-heading')?.textContent?.trim() || '';

      // Equip Medical Kit, Happy Flower, Red Mask, then enter Act 3 Boss via DOM click
      const s2 = app.getState();
      s2.player.relics.push('medical_kit', 'happy_flower', 'red_mask');
      s2.bossEncounterId = 'time_eater_boss';
      const bossNode = s2.map[15][0];
      s2.currentNodeId = s2.map[14].find((n) => n.nextIds.includes(bossNode.id)).id;
      app.render();
      document.getElementById('map-node-' + bossNode.id).click();

      const cState = app.getState();
      cState.nextUid = (cState.nextUid ?? 100) + 1;
      const wId = 'e2e_wound_' + cState.nextUid;
      cState.combat.hand.push({ instanceId: wId, cardId: 'wound', upgraded: false });
      app.render();

      const woundEl = document.getElementById('hand-card-' + wId);
      const woundPlayable = Boolean(woundEl && !woundEl.disabled && woundEl.textContent.includes('医药箱'));
      const hasHappyCounter = Boolean(document.querySelector('[data-relic-id="happy_flower"] .relic-counter-pill'));
      const hasShopTierClass = Boolean(document.querySelector('.relic-badge.tier-shop'));
      const hasEventTierClass = Boolean(document.querySelector('.relic-badge.tier-event'));
      const hasBossSvg = Boolean(document.querySelector('.enemy-side .unit-figure svg'));

      // Check map modal heading displays Act 3
      document.getElementById('btn-open-map').click();
      const mapModalTitle = document.getElementById('modal-title')?.textContent?.trim() || '';
      document.getElementById('btn-close-modal').click();

      // Game Over #btn-restart-gameover goes straight to character select WITHOUT confirm modal
      cState.runOutcome = 'victory';
      cState.screen = 'game_over';
      app.render();
      const goTitle = document.getElementById('gameover-heading')?.textContent?.trim() || '';
      document.getElementById('btn-restart-gameover').click();
      const bypassedConfirmOnGameOver = Boolean(document.getElementById('main-menu-screen')) && !document.getElementById('confirm-new-run-modal');

      return {
        hasAct3Btn,
        hasSettleAct2Btn,
        afterProceedAct,
        act3MapTitle,
        woundPlayable,
        hasHappyCounter,
        hasShopTierClass,
        hasEventTierClass,
        hasBossSvg,
        mapModalTitle,
        goTitle,
        bypassedConfirmOnGameOver,
      };
    })()`);

    assert.equal(act3UiAudit.hasAct3Btn, true);
    assert.equal(act3UiAudit.hasSettleAct2Btn, true);
    assert.equal(act3UiAudit.afterProceedAct, 3);
    assert.ok(act3UiAudit.act3MapTitle.includes('第三幕 · 深渊圣殿'));
    assert.equal(act3UiAudit.woundPlayable, true, 'Medical Kit must render Wound as playable in hand');
    assert.equal(act3UiAudit.hasHappyCounter, true, 'Happy Flower must show counter pill in HUD');
    assert.equal(act3UiAudit.hasShopTierClass, true, 'Shop relics must use .tier-shop badge');
    assert.equal(act3UiAudit.hasEventTierClass, true, 'Event relics must use .tier-event badge');
    assert.equal(act3UiAudit.hasBossSvg, true);
    assert.ok(act3UiAudit.mapModalTitle.includes('第三幕 · 深渊圣殿'));
    assert.ok(act3UiAudit.goTitle.includes('三幕终极登顶'));
    assert.equal(act3UiAudit.bypassedConfirmOnGameOver, true);

    // 3. Mobile 390x844 check for Confirm New Run modal (after starting a fresh run from Character Select)
    await launchHeroFromCharacterSelect(cdp, 'ironclad');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });
    const mobileAudit = await cdp.evaluate(`(() => {
      document.getElementById('btn-new-run').click();
      const modalOk = Boolean(document.getElementById('confirm-new-run-modal'));
      const rect = document.getElementById('confirm-new-run-modal').getBoundingClientRect();
      return {
        modalOk,
        fitsViewport: rect.width <= 390 && document.documentElement.scrollWidth <= window.innerWidth,
      };
    })()`);
    assert.equal(mobileAudit.modalOk, true);
    assert.equal(mobileAudit.fitsViewport, true);

    const exceptions = cdp.events.filter((e) => e.method === 'Runtime.exceptionThrown');
    const consoleErrors = cdp.events.filter(
      (e) => e.method === 'Runtime.consoleAPICalled' && e.params?.type === 'error'
    );
    assert.equal(exceptions.length, 0, `Uncaught exceptions: ${JSON.stringify(exceptions)}`);
    assert.equal(consoleErrors.length, 0, `Console errors: ${JSON.stringify(consoleErrors)}`);

    cdp.ws.close();
  } finally {
    await teardownSession({ server, browser, cdp });
  }
});

test('Real Chromium E2E: Ascension 6-10 progression (11 pills/buttons, damaged start & 2 potion slots, A8 dynamic events, and A10 Act 3 Twin Boss UI)', async (t) => {
  if (!resolveBrowserBinary()) {
    t.skip('Chromium/Chrome binary not available');
    return;
  }

  const { server, port } = await startStaticServer();
  let browser = null;
  let cdp = null;

  try {
    browser = await launchHeadlessChromium();
    const debugPort = new URL(browser.browserWsUrl).port;
    const targets = await (await fetch(`http://127.0.0.1:${debugPort}/json/list`)).json();
    const pageTarget = targets.find((x) => x.type === 'page');
    assert.ok(pageTarget);

    cdp = await createCdpClient(pageTarget.webSocketDebuggerUrl);
    await cdp.send('Runtime.enable');
    await cdp.send('Page.enable');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${port}/?debug=1` });
    await new Promise((r) => setTimeout(r, 350));

    // 1. Unlock all via Meta modal and inspect Character Select A6 & A10 vitals + mobile fit
    await cdp.evaluate(`document.getElementById('btn-open-meta').click()`);
    await cdp.evaluate(`document.getElementById('btn-unlock-all-meta').click()`);
    const metaAudit = await cdp.evaluate(`({
      btnCount: document.querySelectorAll('.ascension-btn').length,
      hasA6: Boolean(document.getElementById('btn-select-ascension-6')),
      hasA10: Boolean(document.getElementById('btn-select-ascension-10')),
      a10Disabled: document.getElementById('btn-select-ascension-10')?.disabled ?? true,
    })`);
    assert.equal(metaAudit.btnCount, 11);
    assert.equal(metaAudit.hasA6, true);
    assert.equal(metaAudit.hasA10, true);
    assert.equal(metaAudit.a10Disabled, false);
    await cdp.evaluate(`document.getElementById('btn-close-modal').click()`);
    await cdp.evaluate(`document.getElementById('btn-menu-standard')?.click()`);

    await cdp.evaluate(`document.getElementById('btn-char-asc-6').click()`);
    const charA6Audit = await cdp.evaluate(`({
      pillCount: document.querySelectorAll('.char-asc-pill').length,
      ironHpText: document.querySelector('#char-card-ironclad .vital-hp')?.textContent?.trim() || '',
      silentHpText: document.querySelector('#char-card-silent .vital-hp')?.textContent?.trim() || '',
      ironLabelText: document.querySelector('#char-card-ironclad .char-stat-label')?.textContent?.trim() || '',
    })`);
    assert.equal(charA6Audit.pillCount, 11);
    assert.equal(charA6Audit.ironLabelText, '起始/最大生命');
    assert.equal(charA6Audit.ironHpText, '68/75');
    assert.equal(charA6Audit.silentHpText, '59/65');

    // Mobile 390x844 check on Character Select with 11 ascension pills
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });
    const mobileCharAudit = await cdp.evaluate(`({
      scrollW: document.documentElement.scrollWidth,
      innerW: window.innerWidth,
      dockFit: document.querySelector('.character-launch-dock').getBoundingClientRect().width <= 390,
    })`);
    assert.ok(mobileCharAudit.scrollW <= mobileCharAudit.innerW, `Overflow on mobile char select: ${mobileCharAudit.scrollW} > ${mobileCharAudit.innerW}`);
    assert.equal(mobileCharAudit.dockFit, true);
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });

    // 2. Select A10 -> Start Ironclad run -> Verify A6 damaged HP (68/75), 2 potion slots, and A5 Clumsy
    await cdp.evaluate(`document.getElementById('btn-char-asc-10').click()`);
    await cdp.evaluate(`document.getElementById('btn-start-character-run').click()`);
    const a10StartAudit = await cdp.evaluate(`({
      asc: window.__SPIRE_APP__.getState().ascension,
      hp: window.__SPIRE_APP__.getState().player.hp,
      maxHp: window.__SPIRE_APP__.getState().player.maxHp,
      potionSlots: document.querySelectorAll('.potion-slot').length,
      ascPill: document.getElementById('hud-ascension-pill')?.textContent?.trim() || '',
      hasClumsy: window.__SPIRE_APP__.getState().player.deck.some((c) => c.cardId === 'clumsy'),
    })`);
    assert.equal(a10StartAudit.asc, 10);
    assert.equal(a10StartAudit.hp, 68);
    assert.equal(a10StartAudit.maxHp, 75);
    assert.equal(a10StartAudit.potionSlots, 2);
    assert.equal(a10StartAudit.ascPill, '进阶 10');
    assert.equal(a10StartAudit.hasClumsy, true);

    // 3. Verify A8 Event screen shows scaled 16 HP penalty & enforces it in UI
    const a8EventAudit = await cdp.evaluate(`(() => {
      const s = window.__SPIRE_APP__.getState();
      s.neowState = null;
      s.screen = 'event';
      s.eventState = {
        eventId: 'shining_light',
        resolved: false,
        pendingPurge: false,
        pendingCardAction: null,
        libraryChoices: null,
        outcomeText: '',
        upgradedCardIds: [],
        addedCardIds: [],
      };
      window.__SPIRE_APP__.render();
      const detail = document.querySelector('#event-choice-enter_light .choice-detail')?.textContent?.trim() || '';
      document.getElementById('event-choice-enter_light').click();
      return {
        detail,
        hpAfter: window.__SPIRE_APP__.getState().player.hp,
        outcome: window.__SPIRE_APP__.getState().eventState.outcomeText,
      };
    })()`);
    assert.ok(a8EventAudit.detail.includes('失去 16 点生命'), `Expected A8 detail, got ${a8EventAudit.detail}`);
    assert.equal(a8EventAudit.hpAfter, 52);
    assert.ok(a8EventAudit.outcome.includes('失去 16 点生命'));

    // 4. Verify A10 disables Act 2 early settle and transitions live from Act 3 Boss 1/2 to Boss 2/2 -> Victory
    const a10BossAudit = await cdp.evaluate(`(() => {
      const s = window.__SPIRE_APP__.getState();
      s.act = 2;
      s.floor = 16;
      s.bossEncounterId = 'automaton_boss';
      s.screen = 'boss_reward';
      s.bossReward = {
        actCleared: 2,
        bossGold: 100,
        cardChoices: [],
        cardClaimed: true,
        pickedCardId: null,
        relicChoices: ['sozu'],
        pickedRelicId: null,
      };
      window.__SPIRE_APP__.render();
      const settleDisabled = document.getElementById('btn-settle-act2')?.disabled ?? false;
      document.getElementById('btn-proceed-act3').click();

      const sAct3 = window.__SPIRE_APP__.getState();
      sAct3.bossEncounterId = 'time_eater_boss';
      const bossNode = sAct3.map[15][0];
      sAct3.floor = 15;
      sAct3.currentNodeId = sAct3.map[14][0].id;
      window.__SPIRE_APP__.render();
      document.getElementById('map-node-' + bossNode.id).click();

      const boss1Banner = document.getElementById('combat-banner')?.textContent?.trim() || '';
      const boss1Id = window.__SPIRE_APP__.getState().bossEncounterId;
      // Put a Strike+ in hand and defeat Boss 1 via card play
      const st = window.__SPIRE_APP__.getState();
      st.combat.enemies.forEach((e) => {
        e.hp = 1;
        e.block = 0;
      });
      st.combat.hand = [{ instanceId: 'e2e_strike_1', cardId: 'strike', upgraded: true }];
      st.player.energy = 3;
      window.__SPIRE_APP__.render();
      document.getElementById('hand-card-e2e_strike_1').click();

      const afterBoss1State = window.__SPIRE_APP__.getState();
      const boss2Banner = document.getElementById('combat-banner')?.textContent?.trim() || '';
      const boss2Id = afterBoss1State.bossEncounterId;
      const rushStageAfter1 = afterBoss1State.act3BossRushStage;

      // Defeat Boss 2 cleanly via AoE Cleave+ card play (handles both Donu/Deca & Awakened One rebirth)
      afterBoss1State.combat.enemies.forEach((e) => {
        e.hp = 1;
        e.block = 0;
        e.unawakened = false;
      });
      afterBoss1State.combat.hand = [{ instanceId: 'e2e_cleave_2', cardId: 'cleave', upgraded: true }];
      afterBoss1State.player.energy = 3;
      window.__SPIRE_APP__.render();
      document.getElementById('hand-card-e2e_cleave_2').click();

      return {
        settleDisabled,
        boss1Banner,
        boss1Id,
        rushStageAfter1,
        boss2Banner,
        boss2Id,
        finalScreen: window.__SPIRE_APP__.getState().screen,
        finalOutcome: window.__SPIRE_APP__.getState().runOutcome,
        bossesSlain: window.__SPIRE_APP__.getState().stats.bossesSlain,
      };
    })()`);

    assert.equal(a10BossAudit.settleDisabled, true);
    assert.ok(a10BossAudit.boss1Banner.includes('终末双王 · 第 1/2 战'), `Got banner: ${a10BossAudit.boss1Banner}`);
    assert.equal(a10BossAudit.rushStageAfter1, 2);
    assert.notEqual(a10BossAudit.boss2Id, a10BossAudit.boss1Id);
    assert.ok(a10BossAudit.boss2Banner.includes('终末双王 · 第 2/2 战'), `Got boss2 banner: ${a10BossAudit.boss2Banner}`);
    assert.equal(a10BossAudit.finalScreen, 'game_over');
    assert.equal(a10BossAudit.finalOutcome, 'victory');
    assert.equal(a10BossAudit.bossesSlain, 2);

    const exceptions = cdp.events.filter((e) => e.method === 'Runtime.exceptionThrown');
    const consoleErrors = cdp.events.filter(
      (e) => e.method === 'Runtime.consoleAPICalled' && e.params?.type === 'error'
    );
    assert.equal(exceptions.length, 0, `Uncaught exceptions: ${JSON.stringify(exceptions)}`);
    assert.equal(consoleErrors.length, 0, `Console errors: ${JSON.stringify(consoleErrors)}`);

    cdp.ws.close();
  } finally {
    await teardownSession({ server, browser, cdp });
  }
});

test('Real Chromium E2E: Mobile portrait (<=768px) modal top-row clearance & overscroll lock, potion-row restart/new-run actions, and right-side End Turn & Proceed buttons', async (t) => {
  if (!resolveBrowserBinary()) {
    t.skip('Chromium/Chrome binary not available');
    return;
  }

  const { server, port } = await startStaticServer();
  let browser = null;
  let cdp = null;

  try {
    browser = await launchHeadlessChromium();
    const debugPort = new URL(browser.browserWsUrl).port;
    const targetsResp = await fetch(`http://127.0.0.1:${debugPort}/json/list`);
    const targets = await targetsResp.json();
    const pageTarget = targets.find((x) => x.type === 'page');
    assert.ok(pageTarget, 'Expected a page target in Chromium');

    cdp = await createCdpClient(pageTarget.webSocketDebuggerUrl);
    await cdp.send('Runtime.enable');
    await cdp.send('Page.enable');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 700,
      deviceScaleFactor: 2,
      mobile: true,
    });

    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${port}/` });
    await new Promise((r) => setTimeout(r, 400));
    await launchHeroFromCharacterSelect(cdp, 'ironclad');

    // Enter Floor 1 combat with 6 relics and 3 potion slots
    await cdp.evaluate(`(() => {
      const st = window.__SPIRE_APP__.getState();
      if (st.neowState) st.neowState.resolved = true;
      st.player.relics = ['burning_blood', 'vajra', 'anchor', 'lantern', 'akabeko', 'paper_phrog'];
      window.__SPIRE_APP__.render();
      document.querySelector('.map-node-btn.available').click();
    })()`);
    await new Promise((r) => setTimeout(r, 120));

    // 1. 390px Combat HUD (Option A+C 3-row HUD: Row 2 = Vitals + SVG Potion icons + Deck/Map/More; Row 3 = Full-width Relics) & Combat Dock
    const combat390 = await cdp.evaluate(`(() => {
      const hud = document.querySelector('.top-hud').getBoundingClientRect();
      const hpRect = document.getElementById('hud-player-hp').getBoundingClientRect();
      const potionStripEl = document.querySelector('.potion-strip');
      const potionStrip = potionStripEl.getBoundingClientRect();
      const potions = [...document.querySelectorAll('.potion-strip .potion-slot:not(.potion-discard-inline)')].map((el) => el.getBoundingClientRect());
      const topActionsEl = document.querySelector('.top-actions');
      const topActions = topActionsEl.getBoundingClientRect();
      const deckBtn = document.getElementById('btn-open-deck').getBoundingClientRect();
      const mapBtn = document.getElementById('btn-open-map').getBoundingClientRect();
      const moreBtn = document.getElementById('btn-hud-more')?.getBoundingClientRect();
      const relicScrollRect = document.querySelector('.hud-gear-scroll').getBoundingClientRect();
      const menuClosedInitially = getComputedStyle(document.getElementById('hud-more-menu')).display === 'none';

      // Open More menu and confirm New Run & secondary actions are visibly inside viewport
      document.getElementById('btn-hud-more').click();
      const menuOpen = document.getElementById('hud-more-menu').classList.contains('open');
      const newRunBtn = document.getElementById('btn-new-run')?.getBoundingClientRect();
      const newRunVisibleInMenu = Boolean(newRunBtn) && newRunBtn.width > 0 && newRunBtn.right <= window.innerWidth && newRunBtn.left >= 0;
      document.getElementById('btn-hud-more').click();

      const dock = document.querySelector('.dock-controls').getBoundingClientRect();
      const restartBtn = document.getElementById('btn-restart-combat')?.getBoundingClientRect();
      const endTurn = document.getElementById('btn-end-turn').getBoundingClientRect();
      const energy = document.getElementById('energy-orb').getBoundingClientRect();
      const drawBtn = document.getElementById('btn-draw-pile').getBoundingClientRect();
      const discardBtn = document.getElementById('btn-discard-pile').getBoundingClientRect();
      const exhaustBtn = document.getElementById('btn-exhaust-pile').getBoundingClientRect();
      return {
        docScrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
        hudHeight: Math.round(hud.height),
        potionCount: potions.length,
        potionStripOnlyPotions: [...potionStripEl.children].every(
          (el) => el.classList.contains('potion-tooltip-anchor') || el.classList.contains('potion-slot-group')
        ),
        allPotionsFitStrip: potions.every((p) => p.left >= potionStrip.left - 1 && p.right <= potionStrip.right + 1),
        row2Aligned:
          Boolean(moreBtn) &&
          Math.abs(hpRect.top - potions[0].top) <= 6 &&
          Math.abs(potions[0].top - deckBtn.top) <= 6 &&
          Math.abs(deckBtn.top - mapBtn.top) <= 4 &&
          Math.abs(mapBtn.top - moreBtn.top) <= 4,
        moreVisibleInHud: Boolean(moreBtn) && moreBtn.right <= topActions.right + 1 && moreBtn.right <= hud.right + 1,
        relicsFullWidthRow3:
          relicScrollRect.top >= deckBtn.bottom - 1 && relicScrollRect.width >= hud.width - 28,
        newRunInTopActions: Boolean(topActionsEl.querySelector('#btn-new-run')),
        menuClosedInitially,
        menuOpen,
        newRunVisibleInMenu,
        restartInCombatDock: Boolean(document.querySelector('.combat-dock #btn-restart-combat')),
        restartNotInHud: !document.querySelector('.top-hud #btn-restart-combat'),
        restartLeftAlignedDock: Boolean(restartBtn) && Math.abs(restartBtn.left - dock.left) <= 2,
        restartAboveEnergy: Boolean(restartBtn) && restartBtn.bottom <= energy.top + 1 && Math.abs(restartBtn.left - energy.left) <= 2,
        restartLeftOfDraw: Boolean(restartBtn) && restartBtn.right <= drawBtn.left,
        pilesSameRowAsRestart:
          Boolean(restartBtn) &&
          Math.abs((drawBtn.top + drawBtn.height / 2) - (restartBtn.top + restartBtn.height / 2)) <= 3 &&
          Math.abs(drawBtn.top - discardBtn.top) <= 2 &&
          Math.abs(discardBtn.top - exhaustBtn.top) <= 2,
        pilesRightAligned:
          Math.abs(exhaustBtn.right - dock.right) <= 2 &&
          drawBtn.right <= discardBtn.left &&
          discardBtn.right <= exhaustBtn.left,
        endTurnRightAligned: Math.abs(dock.right - endTurn.right) <= 2,
        endTurnRightOfEnergy: endTurn.left > energy.right,
      };
    })()`);
    assert.ok(combat390.docScrollWidth <= combat390.innerWidth, `390px combat overflowed: ${combat390.docScrollWidth} > ${combat390.innerWidth}`);
    assert.ok(combat390.hudHeight <= 125, `390px 3-row HUD should stay ultra-compact (<=125px), got ${combat390.hudHeight}px`);
    assert.equal(combat390.potionCount, 3);
    assert.equal(combat390.potionStripOnlyPotions, true, 'Potion strip must contain only potion slots');
    assert.equal(combat390.allPotionsFitStrip, true, 'All 3 icon potion slots must fit inside potion strip at 390px');
    assert.equal(combat390.row2Aligned, true, 'HP/Gold, Potions, Deck, Map, and More button must align cleanly on Row 2');
    assert.equal(combat390.moreVisibleInHud, true, 'More menu trigger must fit cleanly inside 390px HUD');
    assert.equal(combat390.relicsFullWidthRow3, true, 'Relic strip must occupy full-width dedicated Row 3 below Row 2');
    assert.equal(combat390.newRunInTopActions, true, 'New run button must remain inside .top-actions');
    assert.equal(combat390.menuClosedInitially, true, 'Mobile More menu starts collapsed');
    assert.equal(combat390.menuOpen, true, 'Tapping ☰ opens mobile More menu');
    assert.equal(combat390.newRunVisibleInMenu, true, 'New run button must be visible inside open More menu at 390px');
    assert.equal(combat390.restartInCombatDock, true, 'Restart combat button must live inside .combat-dock');
    assert.equal(combat390.restartNotInHud, true, 'Restart combat button must not be inside .top-hud');
    assert.equal(combat390.restartLeftAlignedDock, true, 'Restart combat button must align to far left of combat dock');
    assert.equal(combat390.restartAboveEnergy, true, 'Restart combat button must sit above the Energy orb');
    assert.equal(combat390.restartLeftOfDraw, true, 'Restart combat button must sit to the left of Draw Pile');
    assert.equal(combat390.pilesSameRowAsRestart, true, 'Draw/Discard/Exhaust pile buttons should share Row 1 with Restart Combat');
    assert.equal(combat390.pilesRightAligned, true, 'Draw/Discard/Exhaust pile buttons must align to the right edge at 390px');
    assert.equal(combat390.endTurnRightAligned, true, 'End Turn button must be aligned to the right edge at 390px');
    assert.equal(combat390.endTurnRightOfEnergy, true, 'End Turn button must sit to the right of Energy orb');

    // 2. Deck & Map Modals during combat: top-row clearance, non-scrolling header, body scroll lock, and overscroll touch guard
    const deckModalAudit = await cdp.evaluate(`(() => {
      window.scrollTo(0, 80);
      const scrollBeforeModal = window.scrollY;
      document.getElementById('btn-open-deck').click();
      const sheet = document.querySelector('.modal-sheet');
      const header = document.querySelector('.modal-header');
      const body = document.querySelector('.modal-body');
      const firstCard = body?.querySelector('.game-card');
      const sheetRect = sheet.getBoundingClientRect();
      const headerRect = header.getBoundingClientRect();
      const firstCardRect = firstCard.getBoundingClientRect();

      // Scroll inside modal body and confirm header does not move or clip
      body.scrollTop = 140;
      const headerRectAfterScroll = header.getBoundingClientRect();

      // At bottom boundary: upward swipe (scrolling down past bottom) must be prevented
      body.scrollTop = body.scrollHeight;
      const tsBottom = new TouchEvent('touchstart', {
        bubbles: true, cancelable: true,
        touches: [new Touch({ identifier: 101, target: body, clientX: 195, clientY: 420 })],
      });
      body.dispatchEvent(tsBottom);
      const tmBottom = new TouchEvent('touchmove', {
        bubbles: true, cancelable: true,
        touches: [new Touch({ identifier: 101, target: body, clientX: 195, clientY: 360 })],
      });
      body.dispatchEvent(tmBottom);

      // At top boundary: downward pull must be prevented
      body.scrollTop = 0;
      const tsTop = new TouchEvent('touchstart', {
        bubbles: true, cancelable: true,
        touches: [new Touch({ identifier: 102, target: body, clientX: 195, clientY: 220 })],
      });
      body.dispatchEvent(tsTop);
      const tmTop = new TouchEvent('touchmove', {
        bubbles: true, cancelable: true,
        touches: [new Touch({ identifier: 102, target: body, clientX: 195, clientY: 280 })],
      });
      body.dispatchEvent(tmTop);

      // Dragging header itself must be prevented
      const tsHeader = new TouchEvent('touchstart', {
        bubbles: true, cancelable: true,
        touches: [new Touch({ identifier: 103, target: header, clientX: 195, clientY: 75 })],
      });
      header.dispatchEvent(tsHeader);
      const tmHeader = new TouchEvent('touchmove', {
        bubbles: true, cancelable: true,
        touches: [new Touch({ identifier: 103, target: header, clientX: 195, clientY: 120 })],
      });
      header.dispatchEvent(tmHeader);

      const lockedWhileOpen =
        document.documentElement.classList.contains('spire-modal-open') &&
        document.body.classList.contains('spire-modal-open') &&
        document.body.style.position === 'fixed';
      const bodyOverscroll = getComputedStyle(body).overscrollBehavior;

      document.getElementById('btn-close-modal').click();
      const unlockedAfterClose =
        !document.documentElement.classList.contains('spire-modal-open') &&
        !document.body.classList.contains('spire-modal-open') &&
        document.body.style.position === '';
      const scrollAfterClose = window.scrollY;

      return {
        scrollBeforeModal,
        scrollAfterClose,
        sheetWithinViewport: sheetRect.top >= 0 && sheetRect.bottom <= window.innerHeight + 1,
        firstCardBelowHeader: firstCardRect.top >= headerRect.bottom - 0.5,
        headerStableOnScroll: Math.abs(headerRectAfterScroll.top - headerRect.top) < 0.5,
        lockedWhileOpen,
        unlockedAfterClose,
        bodyOverscroll,
        bottomOverscrollPrevented: tmBottom.defaultPrevented,
        topOverscrollPrevented: tmTop.defaultPrevented,
        headerDragPrevented: tmHeader.defaultPrevented,
      };
    })()`);
    assert.equal(deckModalAudit.sheetWithinViewport, true, 'Deck modal must fit completely inside mobile viewport');
    assert.equal(deckModalAudit.firstCardBelowHeader, true, 'Deck modal first row must not be occluded by header');
    assert.equal(deckModalAudit.headerStableOnScroll, true, 'Modal header must stay fixed above .modal-body while scrolling');
    assert.equal(deckModalAudit.lockedWhileOpen, true, 'Background scroll must be locked while modal is open');
    assert.equal(deckModalAudit.unlockedAfterClose, true, 'Background scroll lock must clear on modal close');
    assert.equal(deckModalAudit.scrollAfterClose, deckModalAudit.scrollBeforeModal, 'Closing modal must restore underlying scrollY');
    assert.equal(deckModalAudit.bodyOverscroll, 'contain', '.modal-body must enforce overscroll-behavior: contain');
    assert.equal(deckModalAudit.bottomOverscrollPrevented, true, 'Bottom overscroll inside modal must prevent underlying page bounce');
    assert.equal(deckModalAudit.topOverscrollPrevented, true, 'Top overscroll inside modal must prevent underlying page bounce');
    assert.equal(deckModalAudit.headerDragPrevented, true, 'Dragging modal header must not scroll underlying page');

    // Verify Map modal in combat: legend & F16 top row strictly below modal header when scrolled to top
    const mapModalAudit = await cdp.evaluate(`(() => {
      document.getElementById('btn-open-map').click();
      const modal = document.getElementById('map-inspector-modal');
      const header = modal.querySelector('.modal-header').getBoundingClientRect();
      const body = modal.querySelector('.modal-body');
      body.scrollTop = 0;
      const legend = body.querySelector('.map-legend-strip').getBoundingClientRect();
      const bossRow = body.querySelector('.map-row:last-child').getBoundingClientRect();
      const ok = {
        legendBelowHeader: legend.top >= header.bottom - 0.5,
        bossRowBelowHeader: bossRow.top >= header.bottom - 0.5,
        headerWithinViewport: header.top >= 0,
      };
      document.getElementById('btn-close-modal').click();
      return ok;
    })()`);
    assert.equal(mapModalAudit.headerWithinViewport, true);
    assert.equal(mapModalAudit.legendBelowHeader, true, 'Map modal legend must not be occluded by header');
    assert.equal(mapModalAudit.bossRowBelowHeader, true, 'Map modal top boss row must not be occluded by header');

    // 3. 640px (tablet/wide portrait <=768px) check: End Turn right-aligned + Restart above Energy + Piles right-aligned
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 640,
      height: 800,
      deviceScaleFactor: 2,
      mobile: true,
    });
    const combat640 = await cdp.evaluate(`(() => {
      const dock = document.querySelector('.dock-controls').getBoundingClientRect();
      const endTurn = document.getElementById('btn-end-turn').getBoundingClientRect();
      const draw = document.getElementById('btn-draw-pile').getBoundingClientRect();
      const discard = document.getElementById('btn-discard-pile').getBoundingClientRect();
      const exhaust = document.getElementById('btn-exhaust-pile').getBoundingClientRect();
      const energy = document.getElementById('energy-orb').getBoundingClientRect();
      const restartBtn = document.getElementById('btn-restart-combat').getBoundingClientRect();
      const deckBtn = document.getElementById('btn-open-deck').getBoundingClientRect();
      const moreBtn = document.getElementById('btn-hud-more').getBoundingClientRect();
      return {
        endTurnRightAligned: Math.abs(dock.right - endTurn.right) <= 2,
        pilesRightAligned: Math.abs(dock.right - exhaust.right) <= 2 && draw.right <= discard.left && discard.right <= exhaust.left,
        restartAboveEnergy: restartBtn.bottom <= energy.top + 1 && Math.abs(restartBtn.left - dock.left) <= 2,
        moreSameRowAsDeck: Math.abs(moreBtn.top - deckBtn.top) <= 2 && moreBtn.width > 0,
      };
    })()`);
    assert.equal(combat640.endTurnRightAligned, true, '640px End Turn button must align to right edge');
    assert.equal(combat640.pilesRightAligned, true, '640px Draw/Discard/Exhaust pile buttons must align to right edge');
    assert.equal(combat640.restartAboveEnergy, true, '640px Restart Combat button must sit far-left above Energy');
    assert.equal(combat640.moreSameRowAsDeck, true, '640px More menu button must share the Deck/Map row');

    // 4. Post-combat Reward screen ("继续前进 →") aligned right at both 640px and 390px
    await cdp.evaluate(`(() => {
      const st = window.__SPIRE_APP__.getState();
      st.combat.enemies.forEach((e) => { e.hp = 1; e.block = 0; });
      st.combat.hand = [{ instanceId: 'mob_ux_cleave', cardId: 'cleave', upgraded: false }];
      st.player.energy = 3;
      window.__SPIRE_APP__.render();
      document.getElementById('hand-card-mob_ux_cleave').click();
    })()`);

    const reward640 = await cdp.evaluate(`(() => {
      const sh = document.querySelector('.stage-header').getBoundingClientRect();
      const btn = document.getElementById('btn-proceed-reward').getBoundingClientRect();
      return { rightAligned: Math.abs(sh.right - btn.right) <= 2 };
    })()`);
    assert.equal(reward640.rightAligned, true, '640px Reward Proceed button must align to right edge');

    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 700,
      deviceScaleFactor: 2,
      mobile: true,
    });
    const reward390 = await cdp.evaluate(`(() => {
      const sh = document.querySelector('.stage-header').getBoundingClientRect();
      const btn = document.getElementById('btn-proceed-reward').getBoundingClientRect();
      return {
        rightAligned: Math.abs(sh.right - btn.right) <= 2,
        docScrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
      };
    })()`);
    assert.equal(reward390.rightAligned, true, '390px Reward Proceed button must align to right edge');
    assert.ok(reward390.docScrollWidth <= reward390.innerWidth, '390px Reward screen must not overflow horizontally');

    const exceptions = cdp.events.filter((e) => e.method === 'Runtime.exceptionThrown');
    const consoleErrors = cdp.events.filter(
      (e) => e.method === 'Runtime.consoleAPICalled' && e.params?.type === 'error'
    );
    assert.equal(exceptions.length, 0, `Uncaught exceptions: ${JSON.stringify(exceptions)}`);
    assert.equal(consoleErrors.length, 0, `Console errors: ${JSON.stringify(consoleErrors)}`);

    cdp.ws.close();
  } finally {
    await teardownSession({ server, browser, cdp });
  }
});

test('Stage 1 Real Chromium E2E: per-character Ascension isolation, interactive Armaments/True Grit+/Scry modal, Act 2 new enemies SVG/statuses, and new Event UI', async (t) => {
  if (!resolveBrowserBinary()) {
    t.skip('Chromium/Chrome binary not available');
    return;
  }

  const { server, port } = await startStaticServer();
  let browser = null;
  let cdp = null;

  try {
    browser = await launchHeadlessChromium();
    const debugPort = new URL(browser.browserWsUrl).port;
    const targets = await (await fetch(`http://127.0.0.1:${debugPort}/json/list`)).json();
    const pageTarget = targets.find((x) => x.type === 'page');
    assert.ok(pageTarget);

    cdp = await createCdpClient(pageTarget.webSocketDebuggerUrl);
    await cdp.send('Runtime.enable');
    await cdp.send('Page.enable');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 880,
      deviceScaleFactor: 1,
      mobile: false,
    });

    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${port}/` });
    await new Promise((r) => setTimeout(r, 350));

    // 1. Seed per-character Meta progress (Ironclad A3 vs Silent A0) -> reload -> verify Character Select & Meta Modal isolation
    await cdp.evaluate(`(() => {
      localStorage.setItem('sts_lite_meta_v1', JSON.stringify({
        xp: 520,
        unlockedTier: 2,
        maxAscensionUnlocked: 3,
        selectedAscension: 3,
        selectedCharacterId: 'ironclad',
        runsPlayed: 4,
        victories: 2,
        bestFloor: 48,
        bestScore: 1240,
        characterProgress: {
          ironclad: { runsPlayed: 3, victories: 2, maxAscensionUnlocked: 3, bestFloor: 48, bestScore: 1240 },
          silent: { runsPlayed: 1, victories: 0, maxAscensionUnlocked: 0, bestFloor: 12, bestScore: 340 },
        },
        runHistory: [],
        dailyRecords: {},
      }));
    })()`);
    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${port}/` });
    await new Promise((r) => setTimeout(r, 350));

    const charSelectAudit = await cdp.evaluate(`(() => {
      document.getElementById('btn-menu-standard')?.click();
      const ironCareer = document.getElementById('char-career-ironclad')?.textContent?.trim() || '';
      const silentCareer = document.getElementById('char-career-silent')?.textContent?.trim() || '';
      const ironAsc3Enabled = !document.getElementById('btn-char-asc-3')?.disabled;
      const ironAsc3Active = document.getElementById('btn-char-asc-3')?.classList.contains('active') ?? false;

      // Switch to Silent -> Ascension must clamp from A3 down to A0 and disable A1..A3
      document.getElementById('char-card-silent').click();
      const silentAsc1Disabled = document.getElementById('btn-char-asc-1')?.disabled ?? false;
      const silentAsc0Active = document.getElementById('btn-char-asc-0')?.classList.contains('active') ?? false;

      // Open Meta modal and verify per-character archive cards
      document.getElementById('btn-open-meta').click();
      const metaIronText = document.getElementById('meta-char-card-ironclad')?.textContent?.trim() || '';
      const metaSilentText = document.getElementById('meta-char-card-silent')?.textContent?.trim() || '';
      document.getElementById('btn-close-modal').click();

      // Switch back to Ironclad and launch run at A0 for combat testing
      document.getElementById('char-card-ironclad').click();
      document.getElementById('btn-char-asc-0').click();
      document.getElementById('btn-start-character-run').click();

      return {
        ironCareer,
        silentCareer,
        ironAsc3Enabled,
        ironAsc3Active,
        silentAsc1Disabled,
        silentAsc0Active,
        metaIronText,
        metaSilentText,
      };
    })()`);

    assert.ok(charSelectAudit.ironCareer.includes('A3'), `Expected Ironclad career strip A3, got ${charSelectAudit.ironCareer}`);
    assert.ok(charSelectAudit.ironCareer.includes('2/3'), `Expected Ironclad 2/3 W/R, got ${charSelectAudit.ironCareer}`);
    assert.ok(charSelectAudit.silentCareer.includes('A0'), `Expected Silent career strip A0, got ${charSelectAudit.silentCareer}`);
    assert.equal(charSelectAudit.ironAsc3Enabled, true);
    assert.equal(charSelectAudit.ironAsc3Active, true);
    assert.equal(charSelectAudit.silentAsc1Disabled, true, 'Silent A1 must remain locked when only Ironclad unlocked A3');
    assert.equal(charSelectAudit.silentAsc0Active, true, 'Switching to Silent must clamp selected Ascension to A0');
    assert.ok(charSelectAudit.metaIronText.includes('最高进阶 A3'));
    assert.ok(charSelectAudit.metaSilentText.includes('最高进阶 A0'));

    // 2. Enter combat -> test interactive Armaments (upgrade), True Grit+ (exhaust), and Scry modal workflow
    const choiceAudit = await cdp.evaluate(`(async () => {
      const app = window.__SPIRE_APP__;
      const st = app.getState();
      if (st.neowState) st.neowState.resolved = true;
      app.render();
      document.querySelector('.map-node-btn.available').click();

      // Stage deterministic hand & draw pile
      st.player.energy = 5;
      st.combat.hand = [
        { instanceId: 's1_arm', cardId: 'armaments', upgraded: false },
        { instanceId: 's1_tg', cardId: 'true_grit', upgraded: true },
        { instanceId: 's1_str', cardId: 'strike', upgraded: false },
        { instanceId: 's1_def', cardId: 'defend', upgraded: false },
      ];
      st.combat.drawPile = [
        { instanceId: 'scry_top_1', cardId: 'bash', upgraded: false },
        { instanceId: 'scry_top_2', cardId: 'cleave', upgraded: false },
        { instanceId: 'scry_top_3', cardId: 'shrug_it_off', upgraded: false },
        { instanceId: 'scry_rest_4', cardId: 'strike', upgraded: false },
      ];
      st.combat.discardPile = [];
      st.combat.exhaustPile = [];
      app.render();

      // A) Play base Armaments -> upgrade-selecting mode -> click Strike to upgrade
      document.getElementById('hand-card-s1_arm').click();
      const armBanner = document.getElementById('combat-banner')?.textContent?.trim() || '';
      const armHasUpgradeTray = document.getElementById('hand-tray')?.classList.contains('upgrade-selecting') ?? false;
      const armEndDisabled = document.getElementById('btn-end-turn')?.disabled ?? false;
      const strikeUpgradeSelectable =
        document.getElementById('hand-card-s1_str')?.classList.contains('upgrade-selectable') ?? false;
      document.getElementById('hand-card-s1_str').click();
      const strikeUpgradedAfter = st.combat.hand.find((c) => c.instanceId === 's1_str')?.upgraded ?? false;
      const pendingAfterArm = st.combat.pendingCardChoice;

      // B) Play True Grit+ -> exhaust-selecting mode -> click Defend to exhaust
      document.getElementById('hand-card-s1_tg').click();
      const tgHasExhaustTray = document.getElementById('hand-tray')?.classList.contains('exhaust-selecting') ?? false;
      const defExhaustSelectable =
        document.getElementById('hand-card-s1_def')?.classList.contains('exhaust-selectable') ?? false;
      document.getElementById('hand-card-s1_def').click();
      const defInExhaust = st.combat.exhaustPile.some((c) => c.instanceId === 's1_def');
      const pendingAfterTg = st.combat.pendingCardChoice;

      // C) Trigger Scry 3 -> verify #scry-choice-modal opens -> toggle 1st & 3rd -> confirm
      const scryInit = app.initiateScry(3, '预见测试');
      const hasScryModal = Boolean(document.getElementById('scry-choice-modal'));
      const scryCardCount = document.querySelectorAll('#scry-card-list .game-card').length;
      document.getElementById('scry-card-scry_top_1').click();
      document.getElementById('scry-card-scry_top_3').click();
      const marked1 = document.getElementById('scry-card-scry_top_1')?.classList.contains('scry-marked-discard') ?? false;
      const marked3 = document.getElementById('scry-card-scry_top_3')?.classList.contains('scry-marked-discard') ?? false;
      const confirmBtnText = document.getElementById('btn-confirm-scry')?.textContent?.trim() || '';
      document.getElementById('btn-confirm-scry').click();
      const scryModalClosed = !document.getElementById('scry-choice-modal');
      const drawTopIds = st.combat.drawPile.map((c) => c.instanceId);
      const discardHas1And3 =
        st.combat.discardPile.some((c) => c.instanceId === 'scry_top_1') &&
        st.combat.discardPile.some((c) => c.instanceId === 'scry_top_3');

      return {
        armBanner,
        armHasUpgradeTray,
        armEndDisabled,
        strikeUpgradeSelectable,
        strikeUpgradedAfter,
        pendingAfterArm,
        tgHasExhaustTray,
        defExhaustSelectable,
        defInExhaust,
        pendingAfterTg,
        scryOk: scryInit.ok,
        hasScryModal,
        scryCardCount,
        marked1,
        marked3,
        confirmBtnText,
        scryModalClosed,
        drawTopIds,
        discardHas1And3,
      };
    })()`);

    assert.equal(choiceAudit.armHasUpgradeTray, true);
    assert.equal(choiceAudit.armEndDisabled, true, 'End Turn must be locked during interactive card choice');
    assert.equal(choiceAudit.strikeUpgradeSelectable, true);
    assert.equal(choiceAudit.strikeUpgradedAfter, true, 'Clicking Strike during Armaments must upgrade it');
    assert.equal(choiceAudit.pendingAfterArm, null);
    assert.equal(choiceAudit.tgHasExhaustTray, true);
    assert.equal(choiceAudit.defExhaustSelectable, true);
    assert.equal(choiceAudit.defInExhaust, true, 'Clicking Defend during True Grit+ must exhaust it');
    assert.equal(choiceAudit.pendingAfterTg, null);
    assert.equal(choiceAudit.scryOk, true);
    assert.equal(choiceAudit.hasScryModal, true);
    assert.equal(choiceAudit.scryCardCount, 3);
    assert.equal(choiceAudit.marked1, true);
    assert.equal(choiceAudit.marked3, true);
    assert.ok(choiceAudit.confirmBtnText.includes('弃置 2 · 保留 1'), `Unexpected confirm text: ${choiceAudit.confirmBtnText}`);
    assert.equal(choiceAudit.scryModalClosed, true);
    assert.deepEqual(choiceAudit.drawTopIds, ['scry_top_2', 'scry_rest_4']);
    assert.equal(choiceAudit.discardHas1And3, true);

    // 3. Render all 4 new Act 2 enemies (Byrd, Spheric Guardian, Snake Plant, Gremlin Leader) and verify bespoke SVG + status chips + next-turn hints
    const act2EnemiesAudit = await cdp.evaluate(`(async () => {
      const { createEnemyInstance, rollEnemyIntent } = await import('/src/data/enemies.js');
      const app = window.__SPIRE_APP__;
      const st = app.getState();
      const byrd = createEnemyInstance(st, { templateId: 'byrd', customName: '异鸟 A' });
      const spheric = createEnemyInstance(st, { templateId: 'spheric_guardian' });
      const snake = createEnemyInstance(st, { templateId: 'snake_plant' });
      const leader = createEnemyInstance(st, { templateId: 'gremlin_leader' });
      for (const e of [byrd, spheric, snake, leader]) {
        rollEnemyIntent(st, e, st.player, st.combat);
      }
      st.combat.enemies = [byrd, spheric, snake];
      app.render();
      const svgCount3 = document.querySelectorAll('.enemy-side .unit-figure svg').length;
      const statusBadges = [...document.querySelectorAll('.enemy-side .status-chip')].map((el) => ({
        key: el.dataset.statusKey || '',
        svgKey: el.querySelector('svg.status-svg')?.dataset?.statusSvg || '',
        tip: el.dataset.tooltipTitle || '',
      }));
      const nextHintCount3 = document.querySelectorAll('.enemy-side .next-intent-hint').length;

      st.combat.enemies = [leader];
      app.render();
      const leaderSvg = Boolean(document.querySelector('.enemy-side .unit-figure svg'));
      const leaderNextHint = document.querySelector('.enemy-side .next-intent-hint')?.textContent?.trim() || '';

      return { svgCount3, statusBadges, nextHintCount3, leaderSvg, leaderNextHint };
    })()`);

    assert.equal(act2EnemiesAudit.svgCount3, 3);
    assert.ok(
      act2EnemiesAudit.statusBadges.some((b) => b.key === 'flight' && b.svgKey === 'flight' && b.tip.includes('飞行')),
      `Expected Flight SVG badge, got ${JSON.stringify(act2EnemiesAudit.statusBadges)}`
    );
    assert.ok(
      act2EnemiesAudit.statusBadges.some((b) => b.key === 'barricade' && b.svgKey === 'barricade' && b.tip.includes('壁垒')),
      `Expected Barricade SVG badge, got ${JSON.stringify(act2EnemiesAudit.statusBadges)}`
    );
    assert.ok(
      act2EnemiesAudit.statusBadges.some((b) => b.key === 'malleable' && b.svgKey === 'malleable' && b.tip.includes('可塑护甲')),
      `Expected Malleable SVG badge, got ${JSON.stringify(act2EnemiesAudit.statusBadges)}`
    );
    assert.equal(act2EnemiesAudit.nextHintCount3, 3);
    assert.equal(act2EnemiesAudit.leaderSvg, true);
    assert.ok(act2EnemiesAudit.leaderNextHint.startsWith('下回合：'));

    // 4. Render new Event UI (Forgotten Altar & Scrap Ooze) and verify dynamic gating + live retry banner
    const newEventUiAudit = await cdp.evaluate(`(() => {
      const app = window.__SPIRE_APP__;
      const st = app.getState();
      st.screen = 'event';
      st.player.hp = 60;
      st.eventState = {
        eventId: 'forgotten_altar',
        resolved: false,
        pendingPurge: false,
        pendingCardAction: null,
        libraryChoices: null,
        outcomeText: '',
        upgradedCardIds: [],
        addedCardIds: [],
      };
      app.render();
      const offerDisabledWithoutIdol = document.getElementById('event-choice-offer_golden_idol')?.disabled ?? false;
      st.player.relics.push('golden_idol_relic');
      app.render();
      const offerEnabledWithIdol = !(document.getElementById('event-choice-offer_golden_idol')?.disabled ?? true);
      document.getElementById('event-choice-offer_golden_idol').click();
      const hasBloodyIdol = st.player.relics.includes('bloody_idol');
      const healedToFull = st.player.hp === st.player.maxHp;

      return { offerDisabledWithoutIdol, offerEnabledWithIdol, hasBloodyIdol, healedToFull };
    })()`);

    assert.equal(newEventUiAudit.offerDisabledWithoutIdol, true);
    assert.equal(newEventUiAudit.offerEnabledWithIdol, true);
    assert.equal(newEventUiAudit.hasBloodyIdol, true);
    assert.equal(newEventUiAudit.healedToFull, true);

    const exceptions = cdp.events.filter((e) => e.method === 'Runtime.exceptionThrown');
    const consoleErrors = cdp.events.filter(
      (e) => e.method === 'Runtime.consoleAPICalled' && e.params?.type === 'error'
    );
    assert.equal(exceptions.length, 0, `Uncaught exceptions: ${JSON.stringify(exceptions)}`);
    assert.equal(consoleErrors.length, 0, `Console errors: ${JSON.stringify(consoleErrors)}`);

    cdp.ws.close();
  } finally {
    await teardownSession({ server, browser, cdp });
  }
});

test('Stage 1.1 & Stage 2 Real Chromium E2E: 3-hero Character Select, Watcher Stances/Wrath Danger/Divinity UI, Cut Through Fate Scry Modal, and Mobile 390px HUD & Scry Polish', async (t) => {
  if (!resolveBrowserBinary()) {
    t.skip('Chromium/Chrome binary not available');
    return;
  }

  const { server, port } = await startStaticServer();
  let browser = null;
  let cdp = null;

  try {
    browser = await launchHeadlessChromium();
    const debugPort = new URL(browser.browserWsUrl).port;
    const targets = await (await fetch(`http://127.0.0.1:${debugPort}/json/list`)).json();
    const pageTarget = targets.find((x) => x.type === 'page');
    assert.ok(pageTarget);

    cdp = await createCdpClient(pageTarget.webSocketDebuggerUrl);
    await cdp.send('Runtime.enable');
    await cdp.send('Page.enable');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 880,
      deviceScaleFactor: 1,
      mobile: false,
    });

    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${port}/` });
    await new Promise((r) => setTimeout(r, 350));

    // 1. Verify all 3 heroes render on Character Select, Watcher has bespoke SVG & amethyst theme, launch Watcher run
    const selectAudit = await cdp.evaluate(`(() => {
      document.getElementById('btn-menu-standard')?.click();
      const cards = [...document.querySelectorAll('.character-card')].map((el) => el.dataset.characterId);
      document.getElementById('char-card-watcher').click();
      const watcherSelected = document.getElementById('char-card-watcher').classList.contains('selected');
      const hasWatcherSvg = Boolean(document.querySelector('#char-card-watcher .character-portrait-stage svg'));
      const launchText = document.getElementById('btn-start-character-run')?.textContent?.trim() || '';
      const shellChar = document.querySelector('.spire-shell')?.dataset?.character;
      document.getElementById('btn-start-character-run').click();
      const st = window.__SPIRE_APP__.getState();
      return {
        cards,
        watcherSelected,
        hasWatcherSvg,
        launchText,
        shellChar,
        runChar: st.characterId,
        starterRelic: st.player.relics[0],
        maxHp: st.player.maxHp,
      };
    })()`);

    assert.deepEqual(selectAudit.cards, ['ironclad', 'silent', 'watcher']);
    assert.equal(selectAudit.watcherSelected, true);
    assert.equal(selectAudit.hasWatcherSvg, true);
    assert.ok(selectAudit.launchText.includes('观者'));
    assert.equal(selectAudit.shellChar, 'watcher');
    assert.equal(selectAudit.runChar, 'watcher');
    assert.equal(selectAudit.starterRelic, 'pure_water');
    assert.equal(selectAudit.maxHp, 72);

    // 2. Enter combat -> verify Pure Water Miracle, Calm -> Wrath stance dance, doubled enemy intent & Wrath Danger banner!
    const stanceUiAudit = await cdp.evaluate(`(() => {
      const app = window.__SPIRE_APP__;
      const st = app.getState();
      if (st.neowState) st.neowState.resolved = true;
      app.render();
      document.querySelector('.map-node-btn.available').click();

      const enemy = st.combat.enemies[0];
      enemy.hp = 80;
      enemy.maxHp = 80;
      enemy.block = 0;
      enemy.intent = { id: 'test_atk', name: '重击', type: 'attack', damage: 10, hits: 1 };
      st.act = 2;
      st.floor = 11;
      st.ascension = 2;
      st.player.energy = 3;
      st.player.block = 0;
      st.combat.hand = [
        { instanceId: 'e2e_vig', cardId: 'vigilance', upgraded: false },
        { instanceId: 'e2e_erup', cardId: 'eruption', upgraded: true },
        { instanceId: 'e2e_ctf', cardId: 'cut_through_fate', upgraded: false },
        { instanceId: 'e2e_str', cardId: 'strike', upgraded: false },
      ];
      st.combat.drawPile = [
        { instanceId: 'e2e_d1', cardId: 'clumsy', upgraded: false },
        { instanceId: 'e2e_d2', cardId: 'halt', upgraded: false },
        { instanceId: 'e2e_d3', cardId: 'ragnarok', upgraded: false },
      ];
      app.render();

      const intentBefore = document.querySelector('.enemy-side .intent-badge')?.textContent?.trim() || '';

      // Play Vigilance -> Calm
      document.getElementById('hand-card-e2e_vig').click();
      const calmPill = document.getElementById('player-stance-pill');
      const calmPillText = calmPill?.textContent?.trim() || '';
      calmPill?.click();
      const calmTipOpen = !document.getElementById('spire-tooltip')?.hidden;
      const calmTipDesc = document.querySelector('#spire-tooltip .spire-tooltip-desc')?.textContent?.trim() || '';
      if (calmTipOpen) calmPill?.click();
      const hasCalmAura = document.getElementById('player-unit')?.classList.contains('stance-calm');

      // Play Eruption+ -> exits Calm (+2E -> 1 - 1 + 2 = 2E) and enters Wrath!
      document.getElementById('hand-card-e2e_erup').click();
      document.getElementById('enemy-unit-' + enemy.id).click();
      const wrathPill = document.getElementById('player-stance-pill');
      const wrathPillText = wrathPill?.textContent?.trim() || '';
      wrathPill?.click();
      const wrathTipOpen = !document.getElementById('spire-tooltip')?.hidden;
      const wrathTipDesc = document.querySelector('#spire-tooltip .spire-tooltip-desc')?.textContent?.trim() || '';
      if (wrathTipOpen) wrathPill?.click();
      const hasWrathAura = document.getElementById('player-unit')?.classList.contains('stance-wrath');
      const intentInWrath = document.querySelector('.enemy-side .intent-badge')?.textContent?.trim() || '';
      const hasWrathBanner = Boolean(document.getElementById('wrath-danger-banner'));
      const strikeDescInWrath = document.querySelector('#hand-card-e2e_str .card-desc')?.textContent?.trim() || '';
      const energyAfterCalmExit = st.player.energy;

      // Also verify Divinity renders concise name only and shows full tooltip on click
      const prevStance = st.combat.stance;
      st.combat.stance = 'divinity';
      st.player.stance = 'divinity';
      app.render();
      const divPill = document.getElementById('player-stance-pill');
      const divPillText = divPill?.textContent?.trim() || '';
      const divTipDesc = divPill?.dataset?.tooltipDesc || '';
      st.combat.stance = prevStance;
      st.player.stance = prevStance;
      app.render();

      return {
        intentBefore,
        calmPillText,
        calmTipOpen,
        calmTipDesc,
        hasCalmAura,
        wrathPillText,
        wrathTipOpen,
        wrathTipDesc,
        hasWrathAura,
        divPillText,
        divTipDesc,
        intentInWrath,
        hasWrathBanner,
        strikeDescInWrath,
        energyAfterCalmExit,
      };
    })()`);

    assert.equal(stanceUiAudit.intentBefore, '10');
    assert.equal(stanceUiAudit.calmPillText, '平静', 'Calm pill must show concise name only');
    assert.equal(stanceUiAudit.calmTipOpen, true, 'Tapping Calm pill must open stance tooltip');
    assert.ok(stanceUiAudit.calmTipDesc.includes('2 点能量'), 'Calm tooltip must explain +2 exit energy');
    assert.equal(stanceUiAudit.hasCalmAura, true);
    assert.equal(stanceUiAudit.wrathPillText, '愤怒', 'Wrath pill must show concise name only');
    assert.equal(stanceUiAudit.wrathTipOpen, true, 'Tapping Wrath pill must open stance tooltip');
    assert.ok(stanceUiAudit.wrathTipDesc.includes('翻倍'), 'Wrath tooltip must explain doubled attack damage');
    assert.equal(stanceUiAudit.hasWrathAura, true);
    assert.equal(stanceUiAudit.divPillText, '神格', 'Divinity pill must show concise name only');
    assert.ok(stanceUiAudit.divTipDesc.includes('3 倍'), 'Divinity tooltip must explain 3x attack damage');
    assert.equal(stanceUiAudit.intentInWrath, '20', 'Enemy attack intent must double to 20 in Wrath');
    assert.equal(stanceUiAudit.hasWrathBanner, true, 'Wrath Danger banner must appear when incoming exceeds block');
    assert.ok(stanceUiAudit.strikeDescInWrath.includes('12'), 'Strike damage must preview doubled 12 in Wrath');
    assert.equal(stanceUiAudit.energyAfterCalmExit, 2, 'Exiting Calm via 1E Eruption+ must refund +2 energy');

    // 3. Play Cut Through Fate -> open real Scry modal -> switch to Mobile 390x844 -> verify single confirm button, compact header, discard + deferred draw, and non-clipped HUD Ascension pill!
    await cdp.evaluate(`(() => {
      const st = window.__SPIRE_APP__.getState();
      const enemy = st.combat.enemies[0];
      document.getElementById('hand-card-e2e_ctf').click();
      document.getElementById('enemy-unit-' + enemy.id).click();
    })()`);

    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await cdp.send('Emulation.setTouchEmulationEnabled', { enabled: true });
    await new Promise((r) => setTimeout(r, 120));

    const mobileAudit = await cdp.evaluate(`(() => {
      const modal = document.getElementById('scry-choice-modal');
      const hasBottomDuplicate = Boolean(document.getElementById('btn-confirm-scry-bottom'));
      const confirmBtn = document.getElementById('btn-confirm-scry');
      const headerRect = modal.querySelector('.modal-header').getBoundingClientRect();
      const firstCardRect = modal.querySelector('#scry-card-list .game-card').getBoundingClientRect();

      // Mark Clumsy for discard, then confirm Scry -> should draw Halt!
      document.getElementById('scry-card-e2e_d1').click();
      document.getElementById('btn-confirm-scry').click();

      const st = window.__SPIRE_APP__.getState();
      const handIdsAfter = st.combat.hand.map((c) => c.instanceId);
      const discardIdsAfter = st.combat.discardPile.map((c) => c.instanceId);
      const ascRect = document.getElementById('hud-ascension-pill')?.getBoundingClientRect();
      const scrollWidth = document.documentElement.scrollWidth;
      const innerWidth = window.innerWidth;

      return {
        hasBottomDuplicate,
        headerHeight: Math.round(headerRect.height),
        firstCardBelowHeader: firstCardRect.top >= headerRect.bottom - 1,
        drewHalt: handIdsAfter.includes('e2e_d2'),
        discardedClumsy: discardIdsAfter.includes('e2e_d1'),
        ascRight: ascRect ? Math.round(ascRect.right) : 999,
        innerWidth,
        scrollWidth,
      };
    })()`);

    assert.equal(mobileAudit.hasBottomDuplicate, false, 'Duplicate bottom Scry confirm button must be removed');
    assert.ok(mobileAudit.headerHeight <= 155, `Mobile Scry header should be compact, got ${mobileAudit.headerHeight}px`);
    assert.equal(mobileAudit.firstCardBelowHeader, true);
    assert.equal(mobileAudit.drewHalt, true, 'Cut Through Fate must draw top kept card after Scry confirmation');
    assert.equal(mobileAudit.discardedClumsy, true);
    assert.ok(mobileAudit.ascRight <= mobileAudit.innerWidth - 2, `Mobile 390px HUD Ascension pill clipped: right=${mobileAudit.ascRight}, width=${mobileAudit.innerWidth}`);
    assert.ok(mobileAudit.scrollWidth <= mobileAudit.innerWidth, `Horizontal overflow on 390px mobile: ${mobileAudit.scrollWidth} > ${mobileAudit.innerWidth}`);

    // 5. Verify mobile combat polish (hidden PC hints & (E), card art SVGs, compact hand width) + bottom Leave Shop button
    const mobileCombatPolish = await cdp.evaluate(`(() => {
      const handCards = [...document.querySelectorAll('#hand-tray .game-card')];
      const artSvgs = document.querySelectorAll('#hand-tray .card-art-svg').length;
      const firstCardW = Math.round(handCards[0]?.getBoundingClientRect().width || 999);
      const endTurnText = document.getElementById('btn-end-turn')?.innerText?.trim() || '';
      const bannerText = document.getElementById('combat-banner')?.innerText?.trim() || '';
      const enemyGrad = Boolean(document.querySelector('.enemy-side .unit-svg linearGradient, .enemy-side .unit-svg radialGradient'));

      // Switch to Shop to verify #btn-leave-shop-bottom works cleanly
      const app = window.__SPIRE_APP__;
      const st = app.getState();
      st.screen = 'map';
      const shopNode = st.map.flat().find((n) => n.type === 'shop');
      const prevNode = st.map[shopNode.row - 1][0];
      st.currentNodeId = prevNode.id;
      prevNode.nextIds = [shopNode.id];
      app.render();
      document.getElementById('map-node-' + shopNode.id).click();
      const hasBottomLeave = Boolean(document.getElementById('btn-leave-shop-bottom'));
      document.getElementById('btn-leave-shop-bottom').click();
      const leftShopScreen = st.screen;

      return {
        handCount: handCards.length,
        artSvgs,
        firstCardW,
        endTurnText,
        bannerHasKeyboardHint: bannerText.includes('数字键'),
        enemyGrad,
        hasBottomLeave,
        leftShopScreen,
      };
    })()`);
    assert.equal(mobileCombatPolish.artSvgs, mobileCombatPolish.handCount, 'Every hand card must render an inline card-art SVG');
    assert.ok(mobileCombatPolish.firstCardW <= 122, `Mobile hand card should be compact (<=122px), got ${mobileCombatPolish.firstCardW}px`);
    assert.equal(mobileCombatPolish.endTurnText, '结束回合', 'Mobile End Turn button should hide desktop (E) shortcut');
    assert.equal(mobileCombatPolish.bannerHasKeyboardHint, false, 'Mobile combat banner should hide desktop keyboard hints');
    assert.equal(mobileCombatPolish.enemyGrad, true, 'Enemy SVG should render hero-tier gradient shading');
    assert.equal(mobileCombatPolish.hasBottomLeave, true, 'Shop must include bottom Leave Shop button');
    assert.equal(mobileCombatPolish.leftShopScreen, 'map', 'Clicking bottom Leave Shop button must return to map');

    // 6. Verify mobile 3-hero tab switcher, real-touch persistent tooltips (relic/potion, daily pills, modal pills, unlocked A1/A2 & locked A3), & Daily Challenge auto-scroll to Floor 1
    await cdp.evaluate(`(() => {
      window.localStorage.clear();
      const metaRaw = {
        xp: 0,
        unlockedTier: 0,
        maxAscensionUnlocked: 2,
        selectedAscension: 0,
        selectedCharacterId: 'ironclad',
        characterProgress: {
          ironclad: { maxAscensionUnlocked: 2, runsPlayed: 2, victories: 2, bestFloor: 16, bestScore: 900 },
          silent: { maxAscensionUnlocked: 0, runsPlayed: 0, victories: 0, bestFloor: 0, bestScore: 0 },
          watcher: { maxAscensionUnlocked: 0, runsPlayed: 0, victories: 0, bestFloor: 0, bestScore: 0 },
        },
        unlockAllOverride: false,
        runsPlayed: 2,
        victories: 2,
        bestFloor: 16,
        bestScore: 900,
        totalEnemiesSlain: 20,
        recordedRunKeys: [],
        dailyRecords: {},
        runHistory: [],
      };
      window.localStorage.setItem('sts_lite_meta_v1', JSON.stringify(metaRaw));
    })()`);
    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${port}/` });
    await new Promise((r) => setTimeout(r, 350));

    const realTouchTap = async (selector) => {
      const pt = await cdp.evaluate(`(() => {
        const el = document.querySelector(${JSON.stringify(selector)});
        if (!el) return null;
        el.scrollIntoView({ block: 'center', behavior: 'auto' });
        const r = el.getBoundingClientRect();
        return { x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2) };
      })()`);
      assert.ok(pt, `Expected touch target to exist: ${selector}`);
      await cdp.send('Input.dispatchTouchEvent', {
        type: 'touchStart',
        touchPoints: [{ x: pt.x, y: pt.y, id: 1 }],
      });
      await cdp.send('Input.dispatchTouchEvent', {
        type: 'touchEnd',
        touchPoints: [],
      });
      await new Promise((r) => setTimeout(r, 140));
    };

    const readTooltip = () =>
      cdp.evaluate(`(() => {
        const tip = document.getElementById('spire-tooltip');
        return {
          open: Boolean(tip && !tip.hidden),
          title: tip?.querySelector('.spire-tooltip-title')?.textContent?.trim() || '',
          tag: tip?.querySelector('.spire-tooltip-tag')?.textContent?.trim() || '',
          desc: tip?.querySelector('.spire-tooltip-desc')?.textContent?.trim() || '',
        };
      })()`);

    // 6a. Enter Level 2 Standard Character Select via real touch tap; verify Relic & Potion tooltips stay open (no flash-dismiss!)
    await realTouchTap('#btn-menu-standard');
    await realTouchTap('#char-card-ironclad .relic-badge');
    const relicTip = await readTooltip();
    assert.equal(relicTip.open, true, 'Relic tooltip on Character Select must stay open after real touch tap');
    assert.ok(relicTip.title.includes('燃烧之血'), `Unexpected relic tooltip title: ${relicTip.title}`);

    await realTouchTap('#char-card-ironclad .char-potion-pill');
    const potionTip = await readTooltip();
    assert.equal(potionTip.open, true, 'Potion tooltip on Character Select must stay open after real touch tap');
    assert.ok(potionTip.title.includes('火焰药水'), `Unexpected potion tooltip title: ${potionTip.title}`);

    // 6c. Real touch tap on unlocked A1 & A2 pills + locked A3 pill must show detailed tooltip & inline desc
    await realTouchTap('#btn-char-asc-1');
    const a1Tip = await readTooltip();
    const a1InlineDesc = await cdp.evaluate(`document.getElementById('launch-asc-desc')?.textContent?.trim() || ''`);
    assert.equal(a1Tip.open, true, 'Unlocked A1 pill tooltip must stay open after real touch tap');
    assert.ok(a1Tip.title.includes('进阶 1'));
    assert.ok(a1InlineDesc.includes('精英'));

    await realTouchTap('#btn-char-asc-2');
    const a2Tip = await readTooltip();
    assert.equal(a2Tip.open, true, 'Unlocked A2 pill tooltip must stay open after real touch tap');
    assert.ok(a2Tip.title.includes('进阶 2'));

    await realTouchTap('#btn-char-asc-2');
    assert.equal((await readTooltip()).open, false, 'Second tap on already-selected A2 pill should toggle tooltip closed');

    await realTouchTap('.asc-pill-tooltip-anchor');
    const lockedAscTip = await readTooltip();
    assert.equal(lockedAscTip.open, true, 'Locked Ascension pill tooltip must open on real touch tap');
    assert.ok(lockedAscTip.title.includes('进阶 3') && lockedAscTip.tag.includes('解锁'));

    // 6d. Real touch tap on Daily Ascension & Modifier chips inside Meta Modal (#modal-backdrop) must also stay open!
    await realTouchTap('#btn-open-meta');
    await realTouchTap('#meta-daily-banner .ascension-pill');
    const modalAscTip = await readTooltip();
    assert.equal(modalAscTip.open, true, 'Modal Daily Ascension tooltip must stay open after real touch tap');
    await realTouchTap('#meta-daily-banner .daily-mod-chip');
    const modalModTip = await readTooltip();
    assert.equal(modalModTip.open, true, 'Modal Daily Modifier tooltip must stay open after real touch tap');
    await realTouchTap('#btn-close-modal');

    const mobileCharTabAudit = await cdp.evaluate(`(() => {
      const tabCount = document.querySelectorAll('#mobile-char-tabs .mobile-char-tab').length;
      const visibleCardsBefore = [...document.querySelectorAll('.character-card')].filter(
        (el) => getComputedStyle(el).display !== 'none'
      ).length;
      document.getElementById('mobile-char-tab-watcher').click();
      const watcherSelected = document.getElementById('char-card-watcher')?.classList.contains('selected');
      const visibleCardsAfter = [...document.querySelectorAll('.character-card')].filter(
        (el) => getComputedStyle(el).display !== 'none'
      ).length;
      return {
        tabCount,
        visibleCardsBefore,
        watcherSelected,
        visibleCardsAfter,
      };
    })()`);
    assert.equal(mobileCharTabAudit.tabCount, 3, 'Mobile Character Select must render 3 hero tabs');
    assert.equal(mobileCharTabAudit.visibleCardsBefore, 1, 'Mobile Character Select must show only 1 active hero card');
    assert.equal(mobileCharTabAudit.watcherSelected, true, 'Clicking mobile Watcher tab must select Watcher');
    assert.equal(mobileCharTabAudit.visibleCardsAfter, 1);

    // 6b. Return to Main Menu -> enter Level 2 Daily Challenge screen -> verify touch tooltips & map scroll on launch
    await realTouchTap('#btn-back-main-menu');
    await realTouchTap('#btn-menu-daily');
    await realTouchTap('#daily-banner-ascension-pill');
    const dailyAscTip = await readTooltip();
    assert.equal(dailyAscTip.open, true, 'Daily Ascension pill tooltip must stay open after real touch tap');
    assert.ok(dailyAscTip.title.includes('进阶'), `Unexpected daily asc tooltip title: ${dailyAscTip.title}`);
    await realTouchTap('#daily-banner-ascension-pill');
    assert.equal((await readTooltip()).open, false, 'Second real touch tap on Daily Ascension pill should toggle closed');

    await realTouchTap('#daily-challenge-banner .daily-mod-chip');
    const dailyModTip = await readTooltip();
    assert.equal(dailyModTip.open, true, 'Daily modifier chip tooltip must stay open after real touch tap');
    assert.ok(dailyModTip.desc.length > 5);

    const dailyMapScrollAudit = await cdp.evaluate(`(() => {
      document.getElementById('btn-start-daily-challenge').click();
      const availRect = document.querySelector('.map-node-btn.available')?.getBoundingClientRect();
      return {
        f1InViewport: Boolean(availRect && availRect.top >= 0 && availRect.bottom <= window.innerHeight + 4),
      };
    })()`);
    assert.equal(dailyMapScrollAudit.f1InViewport, true, 'Daily Challenge map must auto-scroll Floor 1 available nodes into mobile viewport');

    const exceptions = cdp.events.filter((e) => e.method === 'Runtime.exceptionThrown');
    const consoleErrors = cdp.events.filter(
      (e) => e.method === 'Runtime.consoleAPICalled' && e.params?.type === 'error'
    );
    assert.equal(exceptions.length, 0, `Uncaught exceptions: ${JSON.stringify(exceptions)}`);
    assert.equal(consoleErrors.length, 0, `Console errors: ${JSON.stringify(consoleErrors)}`);

    cdp.ws.close();
  } finally {
    await teardownSession({ server, browser, cdp });
  }
});

test('P0 & P1 Real Chromium E2E: ?debug=1 unlock guard, PWA endpoints, 4-tab Compendium (Desktop + 390px Mobile), HUD P1 relic counters & Black Star/Singing Bowl reward UI', async (t) => {
  if (!resolveBrowserBinary()) {
    t.skip('Chromium/Chrome binary not available');
    return;
  }

  const { server, port } = await startStaticServer();
  let browser = null;
  let cdp = null;

  try {
    // 1. Verify PWA manifest, service worker & PNG icons return HTTP 200 with valid content
    const manifestResp = await fetch(`http://127.0.0.1:${port}/manifest.webmanifest`);
    assert.equal(manifestResp.status, 200);
    const manifestJson = await manifestResp.json();
    assert.equal(manifestJson.display, 'standalone');
    assert.ok(manifestJson.icons.length >= 2);

    const swResp = await fetch(`http://127.0.0.1:${port}/sw.js`);
    assert.equal(swResp.status, 200);
    const swText = await swResp.text();
    assert.ok(swText.includes('self.addEventListener'));

    const icon192Resp = await fetch(`http://127.0.0.1:${port}/icons/icon-192.png`);
    assert.equal(icon192Resp.status, 200);

    browser = await launchHeadlessChromium();
    const debugPort = new URL(browser.browserWsUrl).port;
    const targetsResp = await fetch(`http://127.0.0.1:${debugPort}/json/list`);
    const targets = await targetsResp.json();
    const pageTarget = targets.find((x) => x.type === 'page');
    assert.ok(pageTarget);

    cdp = await createCdpClient(pageTarget.webSocketDebuggerUrl);
    await cdp.send('Runtime.enable');
    await cdp.send('Page.enable');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });

    // 2. Normal URL (/): #btn-unlock-all-meta MUST be hidden!
    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${port}/` });
    await new Promise((r) => setTimeout(r, 400));
    await cdp.evaluate(`document.getElementById('btn-open-meta').click()`);
    const normalMetaAudit = await cdp.evaluate(`({
      hasMetaModal: Boolean(document.getElementById('meta-progression-modal')),
      hasUnlockAllBtn: Boolean(document.getElementById('btn-unlock-all-meta')),
    })`);
    assert.equal(normalMetaAudit.hasMetaModal, true);
    assert.equal(normalMetaAudit.hasUnlockAllBtn, false, '#btn-unlock-all-meta must be hidden without ?debug=1');
    await cdp.evaluate(`document.getElementById('btn-close-modal').click()`);

    // 3. Open 4-tab Compendium from Character Select -> switch all 4 tabs, filter, verify locked silhouettes -> launch run -> verify auto-discovery!
    await cdp.evaluate(`document.getElementById('btn-open-compendium').click()`);
    const compInitial = await cdp.evaluate(`(() => {
      const modal = document.getElementById('compendium-modal');
      const cardTabText = document.getElementById('btn-comp-tab-cards')?.textContent || '';
      const relicTabText = document.getElementById('btn-comp-tab-relics')?.textContent || '';
      const potionTabText = document.getElementById('btn-comp-tab-potions')?.textContent || '';
      const enemyTabText = document.getElementById('btn-comp-tab-enemies')?.textContent || '';
      const undiscoveredCount = document.querySelectorAll('#compendium-cards-grid .compendium-silhouette-card').length;
      document.getElementById('btn-comp-tab-relics').click();
      const totalRelicCards = document.querySelectorAll('#compendium-relics-grid .compendium-entry-card').length;
      document.getElementById('btn-comp-tab-potions').click();
      const totalPotionCards = document.querySelectorAll('#compendium-potions-grid .compendium-entry-card').length;
      document.getElementById('btn-comp-tab-enemies').click();
      const totalEnemyCards = document.querySelectorAll('#compendium-enemies-grid .compendium-enemy-card').length;
      const silhouettes = document.querySelectorAll('#compendium-enemies-grid .compendium-enemy-portrait.silhouette').length;
      return {
        open: Boolean(modal),
        cardTabText,
        relicTabText,
        potionTabText,
        enemyTabText,
        undiscoveredCount,
        totalRelicCards,
        totalPotionCards,
        totalEnemyCards,
        silhouettes,
      };
    })()`);
    assert.equal(compInitial.open, true);
    assert.ok(compInitial.cardTabText.includes('/234') || compInitial.cardTabText.includes('/'), 'Card tab shows total count');
    assert.equal(compInitial.totalRelicCards, 103, 'Relics tab lists all 103 relics');
    assert.equal(compInitial.totalPotionCards, 28, 'Potions tab lists all 28 potions');
    assert.equal(compInitial.totalEnemyCards, 64, 'Enemies tab lists all 64 enemies');
    assert.ok(compInitial.undiscoveredCount > 0 && compInitial.silhouettes > 0, 'Unseen entries render as silhouettes');
    await cdp.evaluate(`document.getElementById('btn-close-modal').click()`);

    // 4. Launch Watcher run -> auto-discovers Watcher starter cards & Pure Water -> verify HUD P1 counters + Black Star/Singing Bowl Reward UI
    await launchHeroFromCharacterSelect(cdp, 'watcher');
    const p1UiAudit = await cdp.evaluate(`(() => {
      const app = window.__SPIRE_APP__;
      const st = app.getState();
      st.player.relics.push('nunchaku', 'pen_nib', 'sundial', 'lizard_tail', 'singing_bowl', 'black_star');
      st.relicCounters = { ...(st.relicCounters || {}), nunchaku: 4, pen_nib: 9, sundial: 2 };
      st.relicFlags = { ...(st.relicFlags || {}), lizardTailUsed: true };
      st.screen = 'reward';
      st.reward = {
        gold: 35,
        goldClaimed: false,
        relicId: 'vajra',
        relicClaimed: false,
        extraRelicId: 'nunchaku',
        extraRelicClaimed: false,
        potionId: 'stance_potion',
        potionClaimed: false,
        cardChoices: st.player.deck.slice(0, 3),
        cardClaimed: false,
        pickedCardId: null,
      };
      app.render();
      const penNibPill = document.querySelector('[data-relic-id="pen_nib"] .relic-counter-full')?.textContent?.trim() || '';
      const nunchakuPill = document.querySelector('[data-relic-id="nunchaku"] .relic-counter-full')?.textContent?.trim() || '';
      const lizardPill = document.querySelector('[data-relic-id="lizard_tail"] .relic-counter-full')?.textContent?.trim() || '';
      const hasExtraRelicBtn = Boolean(document.getElementById('btn-claim-extra-relic'));
      const proceedBtnText = document.getElementById('btn-proceed-reward')?.textContent?.trim() || '';
      // Open Compendium from HUD and verify Watcher starter cards & relics are now discovered!
      document.getElementById('btn-open-compendium').click();
      document.getElementById('btn-comp-tab-cards').click();
      const discoveredCards = document.querySelectorAll('#compendium-cards-grid .game-card').length;
      document.getElementById('btn-comp-tab-relics').click();
      const discoveredRelics = document.querySelectorAll('#compendium-relics-grid [data-discovered="true"]').length;
      return { penNibPill, nunchakuPill, lizardPill, hasExtraRelicBtn, proceedBtnText, discoveredCards, discoveredRelics };
    })()`);
    assert.equal(p1UiAudit.penNibPill, '9/10 就绪!');
    assert.equal(p1UiAudit.nunchakuPill, '4/10');
    assert.equal(p1UiAudit.lizardPill, '已耗尽');
    assert.equal(p1UiAudit.hasExtraRelicBtn, true, 'Black Star renders #btn-claim-extra-relic on Reward screen');
    assert.ok(p1UiAudit.proceedBtnText.includes('+2 最大生命'), 'Singing Bowl shows +2 Max HP skip hint');
    assert.ok(p1UiAudit.discoveredCards >= 4, 'Starter Watcher cards auto-discovered in Compendium');
    assert.ok(p1UiAudit.discoveredRelics >= 6, 'Owned relics auto-discovered in Compendium');

    // 5. Mobile 390x844 layout audit on Compendium & Deck modals (full-color non-dimmed read-only cards!) + Compact 2-row Daily Banner
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await new Promise((r) => setTimeout(r, 150));
    const mobileCompAudit = await cdp.evaluate(`(() => {
      document.getElementById('btn-comp-tab-cards').click();
      const cardsOverflow = document.documentElement.scrollWidth > window.innerWidth + 1;
      const compCard = document.querySelector('#compendium-cards-grid .game-card');
      const compCardOpacity = compCard ? getComputedStyle(compCard).opacity : '0';
      document.getElementById('btn-comp-tab-enemies').click();
      const enemiesOverflow = document.documentElement.scrollWidth > window.innerWidth + 1;
      document.getElementById('btn-close-modal').click();

      // Open Deck modal and verify cards render at full opacity (NOT dimmed like disabled buttons)
      document.getElementById('btn-open-deck').click();
      const deckCard = document.querySelector('#modal-backdrop .game-card');
      const deckCardOpacity = deckCard ? getComputedStyle(deckCard).opacity : '0';
      const deckCardCursor = deckCard ? getComputedStyle(deckCard).cursor : '';
      return { cardsOverflow, enemiesOverflow, compCardOpacity, deckCardOpacity, deckCardCursor };
    })()`);
    assert.equal(mobileCompAudit.cardsOverflow, false, 'Compendium Cards tab must not overflow 390px mobile');
    assert.equal(mobileCompAudit.enemiesOverflow, false, 'Compendium Enemies tab must not overflow 390px mobile');
    assert.equal(mobileCompAudit.compCardOpacity, '1', 'Compendium read-only cards must render at full opacity 1');
    assert.equal(mobileCompAudit.deckCardOpacity, '1', 'Deck modal read-only cards must render at full opacity 1');
    assert.equal(mobileCompAudit.deckCardCursor, 'default', 'Deck modal read-only cards must use default cursor');

    if (process.env.SCRATCH_SCREENSHOT_DIR) {
      fs.mkdirSync(process.env.SCRATCH_SCREENSHOT_DIR, { recursive: true });
      const shotDeck = await cdp.send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(
        path.join(process.env.SCRATCH_SCREENSHOT_DIR, 'mobile_deck_modal.png'),
        Buffer.from(shotDeck.data, 'base64')
      );
    }

    // 6. Debug URL (/?debug=1) on 390px mobile: return to Main Menu -> Daily Challenge screen & verify #btn-unlock-all-meta
    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${port}/?debug=1` });
    await new Promise((r) => setTimeout(r, 350));
    await cdp.evaluate(`(() => {
      if (!document.getElementById('main-menu-screen') && !document.getElementById('daily-challenge-banner')) {
        document.getElementById('btn-new-run')?.click();
        document.getElementById('btn-confirm-new-run')?.click();
      }
      if (document.getElementById('main-menu-screen')) {
        document.getElementById('btn-menu-daily')?.click();
      }
    })()`);
    const mobileDailyAudit = await cdp.evaluate(`(() => {
      const screen = document.getElementById('daily-challenge-screen');
      const banner = document.getElementById('daily-challenge-banner');
      const chips = [...banner.querySelectorAll('.daily-mod-chip')];
      const detailCards = [...banner.querySelectorAll('.daily-mod-detail-card')];
      const conciseNames = chips.every((el) => !el.textContent.includes('·') && el.textContent.trim().length <= 6);
      const hasFreshPill = Boolean(banner.querySelector('.daily-best-pill.fresh'));
      const overflow = document.documentElement.scrollWidth > window.innerWidth + 1;
      return {
        hasDailyScreen: Boolean(screen),
        chipCount: chips.length,
        detailCardCount: detailCards.length,
        conciseNames,
        hasFreshPill,
        overflow,
      };
    })()`);
    assert.equal(mobileDailyAudit.hasDailyScreen, true, 'Dedicated Level 2 Daily Challenge screen must render');
    assert.equal(mobileDailyAudit.hasFreshPill, false, 'Fresh 无鲸鱼赐福 filler pill must be removed from Daily banner');
    assert.equal(mobileDailyAudit.conciseNames, true, 'Daily modifier chips must display concise 4-char names only');
    assert.equal(mobileDailyAudit.chipCount, 3, 'Daily Challenge screen must display 3 modifier chips');
    assert.equal(mobileDailyAudit.detailCardCount, 3, 'Daily Challenge screen must display 3 modifier detail cards');
    assert.equal(mobileDailyAudit.overflow, false, '390px Daily Challenge screen must have zero horizontal overflow');

    if (process.env.SCRATCH_SCREENSHOT_DIR) {
      const shotStart = await cdp.send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(
        path.join(process.env.SCRATCH_SCREENSHOT_DIR, 'mobile_char_select_compact.png'),
        Buffer.from(shotStart.data, 'base64')
      );
    }

    await cdp.evaluate(`document.getElementById('btn-open-meta').click()`);
    const debugMetaAudit = await cdp.evaluate(`Boolean(document.getElementById('btn-unlock-all-meta'))`);
    assert.equal(debugMetaAudit, true, '#btn-unlock-all-meta must appear when ?debug=1 is present');

    const exceptions = cdp.events.filter((e) => e.method === 'Runtime.exceptionThrown');
    const consoleErrors = cdp.events.filter(
      (e) => e.method === 'Runtime.consoleAPICalled' && e.params?.type === 'error'
    );
    assert.equal(exceptions.length, 0, `Uncaught exceptions: ${JSON.stringify(exceptions)}`);
    assert.equal(consoleErrors.length, 0, `Console errors: ${JSON.stringify(consoleErrors)}`);

    cdp.ws.close();
  } finally {
    await teardownSession({ server, browser, cdp });
  }
});

test('v2 Real Chromium E2E: Mobile icon relics, nav emojis, mobile next-intent popover, Deck stats/sort/stack, Settings Save Backup, Campfire Relics, Interactive Headbutt/Meditate/Well-Laid Plans, Restart count & SW Update banner', async (t) => {
  if (!resolveBrowserBinary()) {
    t.skip('No local Chromium/Chrome binary available');
    return;
  }
  const { server, port } = await startStaticServer();
  let browser = null;
  let cdp = null;
  try {
    browser = await launchHeadlessChromium();
    const debugPort = new URL(browser.browserWsUrl).port;
    const targetsResp = await fetch(`http://127.0.0.1:${debugPort}/json/list`);
    const targets = await targetsResp.json();
    const pageTarget = targets.find((x) => x.type === 'page');
    assert.ok(pageTarget);
    cdp = await createCdpClient(pageTarget.webSocketDebuggerUrl);
    await cdp.send('Runtime.enable');
    await cdp.send('Page.enable');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1366,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${port}/` });
    await new Promise((r) => setTimeout(r, 400));
    await launchHeroFromCharacterSelect(cdp, 'ironclad');

    // 1. Enhanced Deck Modal: stats bar, sorting, stack toggle, and anti-cheat Draw Pile hides "获得顺序"
    const deckUiAudit = await cdp.evaluate(`(() => {
      document.getElementById('btn-open-deck').click();
      const statsText = document.getElementById('deck-stats-bar')?.textContent?.replace(/\\s+/g, ' ').trim() || '';
      const stackedCardCount = document.querySelectorAll('#modal-backdrop .game-card').length;
      const stackBadges = [...document.querySelectorAll('#modal-backdrop .card-stack-badge')].map((el) => el.textContent.trim());
      document.getElementById('btn-toggle-deck-stack').click();
      const unstackedCardCount = document.querySelectorAll('#modal-backdrop .game-card').length;
      document.getElementById('btn-toggle-deck-stack').click();
      document.getElementById('btn-deck-sort-cost').click();
      const costSortActive = document.getElementById('btn-deck-sort-cost')?.classList.contains('active') || false;
      const firstCardCostAfterCostSort = document.querySelector('#modal-backdrop .game-card .card-cost')?.textContent?.trim() || '';
      document.getElementById('btn-close-modal').click();
      return { statsText, stackedCardCount, stackBadges, unstackedCardCount, costSortActive, firstCardCostAfterCostSort };
    })()`);
    assert.ok(deckUiAudit.statsText.includes('攻击 6') && deckUiAudit.statsText.includes('技能 4'), `Deck stats bar mismatch: ${deckUiAudit.statsText}`);
    assert.equal(deckUiAudit.stackedCardCount, 3, 'Ironclad starter 10 cards stack into 3 unique cards (5 Strike, 4 Defend, 1 Bash)');
    assert.ok(deckUiAudit.stackBadges.includes('×5') && deckUiAudit.stackBadges.includes('×4'));
    assert.equal(deckUiAudit.unstackedCardCount, 10, 'Unstacking expands back to all 10 individual cards');
    assert.equal(deckUiAudit.costSortActive, true);
    assert.equal(deckUiAudit.firstCardCostAfterCostSort, '1');

    // 2. Settings Save Backup: Copy JSON -> invalid JSON error -> valid JSON import updates meta
    const backupAudit = await cdp.evaluate(`(() => {
      document.getElementById('btn-open-settings').click();
      document.getElementById('btn-copy-save-json').click();
      const exported = document.getElementById('input-import-save-json')?.value || '';
      const copyFb = document.getElementById('settings-backup-feedback')?.textContent?.trim() || '';

      // Invalid JSON must fail gracefully with tone-warn
      const ta = document.getElementById('input-import-save-json');
      ta.value = '{bad json';
      ta.dispatchEvent(new Event('input', { bubbles: true }));
      document.getElementById('btn-import-save-json').click();
      const invalidTone = document.getElementById('settings-backup-feedback')?.className || '';

      // Valid JSON with modified XP imports cleanly
      const parsed = JSON.parse(exported);
      parsed.meta.xp = 777;
      const ta2 = document.getElementById('input-import-save-json');
      ta2.value = JSON.stringify(parsed);
      ta2.dispatchEvent(new Event('input', { bubbles: true }));
      document.getElementById('btn-import-save-json').click();
      const validTone = document.getElementById('settings-backup-feedback')?.className || '';
      const importedXp = window.__SPIRE_APP__.getMeta().xp;
      document.getElementById('btn-close-modal').click();
      return { exportedLen: exported.length, copyFb, invalidTone, validTone, importedXp };
    })()`);
    assert.ok(backupAudit.exportedLen > 200, 'Exported backup JSON must contain full save payload');
    assert.ok(backupAudit.copyFb.includes('已复制'));
    assert.ok(backupAudit.invalidTone.includes('tone-warn'), 'Invalid backup JSON must show warning tone');
    assert.ok(backupAudit.validTone.includes('tone-ok'), 'Valid backup JSON must show ok tone');
    assert.equal(backupAudit.importedXp, 777, 'Imported backup must restore meta XP');

    // 3. Campfire Relics (Girya, Shovel, Peace Pipe) UI
    const campAudit = await cdp.evaluate(`(() => {
      const app = window.__SPIRE_APP__;
      const st = app.getState();
      st.player.relics.push('girya', 'shovel', 'peace_pipe');
      st.screen = 'rest';
      st.restState = { completed: false };
      app.render();
      const hasLift = Boolean(document.getElementById('btn-rest-lift'));
      const hasDig = Boolean(document.getElementById('btn-rest-dig'));
      const hasToke = Boolean(document.getElementById('btn-rest-toke'));

      document.getElementById('btn-rest-lift').click();
      const giryaAfterLift = st.relicCounters?.girya ?? 0;

      st.screen = 'rest';
      st.restState = { completed: false };
      app.render();
      const relicsBeforeDig = st.player.relics.length;
      document.getElementById('btn-rest-dig').click();
      const digOpenedRewardScreen = st.screen === 'reward' && st.reward?.source === 'campfire_dig';
      const hasDigClaimBtn = Boolean(document.getElementById('btn-claim-relic'));
      const relicsBeforeClaim = st.player.relics.length;
      document.getElementById('btn-claim-relic').click();
      if (document.getElementById('btn-close-upgrade-reveal')) {
        document.getElementById('btn-close-upgrade-reveal').click();
      }
      const relicsAfterDig = st.player.relics.length;

      st.screen = 'rest';
      st.restState = { completed: false };
      app.render();
      const deckBeforeToke = st.player.deck.length;
      document.getElementById('btn-rest-toke').click();
      const tokeModalOpen = Boolean(document.getElementById('modal-backdrop'));
      document.querySelector('#modal-backdrop [data-action="confirm-rest-toke"]').click();
      const deckAfterToke = st.player.deck.length;
      return {
        hasLift,
        hasDig,
        hasToke,
        giryaAfterLift,
        digOpenedRewardScreen,
        hasDigClaimBtn,
        relicsBeforeDig,
        relicsBeforeClaim,
        relicsAfterDig,
        tokeModalOpen,
        deckBeforeToke,
        deckAfterToke,
      };
    })()`);
    assert.equal(campAudit.hasLift, true);
    assert.equal(campAudit.hasDig, true);
    assert.equal(campAudit.hasToke, true);
    assert.equal(campAudit.giryaAfterLift, 1);
    assert.equal(campAudit.digOpenedRewardScreen, true);
    assert.equal(campAudit.hasDigClaimBtn, true);
    assert.equal(campAudit.relicsBeforeClaim, campAudit.relicsBeforeDig);
    assert.equal(campAudit.relicsAfterDig, campAudit.relicsBeforeDig + 1);
    assert.equal(campAudit.tokeModalOpen, true);
    assert.equal(campAudit.deckAfterToke, campAudit.deckBeforeToke - 1);

    // 4. Interactive Headbutt, Meditate, Well-Laid Plans + Combat Restart count in Game Over & History
    const combatV2Audit = await cdp.evaluate(`(() => {
      const app = window.__SPIRE_APP__;
      const st = app.getState();
      // Enter first floor combat via map node
      if (document.getElementById('neow-blessing-panel')) {
        document.getElementById('neow-choice-0').click();
        if (document.getElementById('neow-action-modal')) {
          document.querySelector('#neow-action-modal [data-action="complete-neow-action"]').click();
        }
      }
      document.querySelector('.map-node-btn.available').click();

      // Restart combat once and check count
      document.getElementById('btn-restart-combat').click();
      const restartsAfterClick = st.stats.combatRestarts;

      // Verify Draw pile hides "获得顺序" sort option
      document.getElementById('btn-draw-pile').click();
      const drawHasOrderSort = Boolean(document.getElementById('btn-deck-sort-order'));
      const drawHasTypeSort = Boolean(document.getElementById('btn-deck-sort-type'));
      document.getElementById('btn-close-modal').click();

      // Inject Headbutt + discard card and play it -> discard_to_draw modal opens
      const hbCard = { instanceId: 'e2e_hb_1', cardId: 'headbutt', upgraded: false };
      const discCard = { instanceId: 'e2e_disc_1', cardId: 'bash', upgraded: true };
      const wlpCard = { instanceId: 'e2e_wlp_1', cardId: 'well_laid_plans', upgraded: false };
      const keepCard = { instanceId: 'e2e_keep_1', cardId: 'defend', upgraded: false };
      st.combat.enemies = [st.combat.enemies[0]];
      st.combat.enemies[0].hp = 120;
      st.combat.hand = [hbCard, wlpCard, keepCard];
      st.combat.discardPile = [discCard];
      st.player.energy = 5;
      app.render();

      document.getElementById('hand-card-e2e_hb_1').click();
      const hbModalOpen = Boolean(document.getElementById('discard-choice-modal'));
      const hbMode = document.getElementById('discard-choice-modal')?.dataset?.choiceMode || '';
      document.getElementById('discard-choice-card-e2e_disc_1').click();
      const hbTopMatches = st.combat.drawPile[0]?.instanceId === 'e2e_disc_1';

      // Play Well-Laid Plans then End Turn -> Retain hand selection UI + #btn-confirm-retain
      document.getElementById('hand-card-e2e_wlp_1').click();
      document.getElementById('btn-end-turn').click();
      const retainBtnVisible = Boolean(document.getElementById('btn-confirm-retain'));
      document.getElementById('hand-card-e2e_keep_1').click();
      const keepCardSelected = document.getElementById('hand-card-e2e_keep_1')?.classList.contains('retain-selected') || false;
      document.getElementById('btn-confirm-retain').click();
      const keptIntoNextTurn = st.combat.hand.some((c) => c.instanceId === 'e2e_keep_1');

      return {
        restartsAfterClick,
        drawHasOrderSort,
        drawHasTypeSort,
        hbModalOpen,
        hbMode,
        hbTopMatches,
        retainBtnVisible,
        keepCardSelected,
        keptIntoNextTurn,
      };
    })()`);
    assert.equal(combatV2Audit.restartsAfterClick, 1);
    assert.equal(combatV2Audit.drawHasOrderSort, false, 'Draw pile must hide order sort for fairness');
    assert.equal(combatV2Audit.drawHasTypeSort, true);
    assert.equal(combatV2Audit.hbModalOpen, true);
    assert.equal(combatV2Audit.hbMode, 'discard_to_draw');
    assert.equal(combatV2Audit.hbTopMatches, true);
    assert.equal(combatV2Audit.retainBtnVisible, true);
    assert.equal(combatV2Audit.keepCardSelected, true);
    assert.equal(combatV2Audit.keptIntoNextTurn, true);

    // 5. Switch to 390x844 Mobile: verify compact 30x30px icon relic tiles (10 relics!), tap tooltip, Darkling regrowing SVG, next-intent trigger with card selected, and SW update banner
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await new Promise((r) => setTimeout(r, 150));

    const mobileV2Audit = await cdp.evaluate(`(() => {
      const app = window.__SPIRE_APP__;
      const st = app.getState();
      // Give 10 relics to test compact mobile icon bar
      const extras = ['vajra', 'anchor', 'lantern', 'pen_nib', 'nunchaku', 'happy_flower', 'akabeko', 'bag_of_marbles', 'girya', 'shovel'];
      for (const r of extras) {
        if (!st.player.relics.includes(r)) st.player.relics.push(r);
      }
      st.relicCounters = { ...(st.relicCounters || {}), pen_nib: 9, girya: 2 };
      // Render Darkling trio (one regrowing) to verify new Act 3 SVG + regrowing UI
      const baseEn = st.combat.enemies[0];
      st.combat.enemies = [
        { ...structuredClone(baseEn), id: 'dk_0', templateId: 'darkling', name: '暗影虫 A', artKey: 'darkling', hp: 0, maxHp: 48, darklingRegrowTurns: 2, statuses: { lifeLink: 1 } },
        { ...structuredClone(baseEn), id: 'dk_1', templateId: 'writhing_mass', name: '蠕动之块', artKey: 'writhing_mass', hp: 140, maxHp: 140, statuses: { reactive: 1, malleable: 3 } },
      ];
      app.render();

      const firstRelic = document.querySelector('.top-hud .relic-badge');
      const relicRect = firstRelic.getBoundingClientRect();
      const nameLabelDisplay = getComputedStyle(firstRelic.querySelector('.relic-name-label')).display;
      const penShortDisplay = getComputedStyle(document.querySelector('[data-relic-id="pen_nib"] .relic-counter-short')).display;
      const penFullDisplay = getComputedStyle(document.querySelector('[data-relic-id="pen_nib"] .relic-counter-full')).display;
      const docOverflow = document.documentElement.scrollWidth > window.innerWidth + 1;

      // Tap icon relic -> opens tooltip with full name & description
      firstRelic.click();
      const relicTipOpen = !document.getElementById('spire-tooltip').hidden;
      const relicTipTitle = document.querySelector('#spire-tooltip .spire-tooltip-title')?.textContent?.trim() || '';
      firstRelic.click();

      // Select an Attack card, then tap unified .intent-badge inside enemy card -> opens combined intent + next-turn forecast tooltip without attacking enemy
      const firstStrike = st.combat.hand.find((c) => c.cardId === 'strike');
      if (firstStrike) {
        document.getElementById('hand-card-' + firstStrike.instanceId)?.click();
      }
      const intentBadge = document.querySelector('#enemy-unit-dk_1 .intent-badge');
      const duplicateTriggers = document.querySelectorAll('.enemy-side .next-intent-trigger').length;
      const wmHpBefore = st.combat.enemies[1].hp;
      intentBadge.click();
      const intentTipOpen = !document.getElementById('spire-tooltip').hidden;
      const intentTipDesc = document.querySelector('#spire-tooltip .spire-tooltip-desc')?.textContent?.trim() || '';
      const wmHpAfter = st.combat.enemies[1].hp;
      intentBadge.click();

      const hasRegrowingEl = Boolean(document.querySelector('#enemy-unit-dk_0.regrowing'));
      const moreRect = document.getElementById('btn-hud-more').getBoundingClientRect();
      const topActionsRect = document.querySelector('.top-actions').getBoundingClientRect();
      const moreFits = moreRect.width > 0 && moreRect.right <= topActionsRect.right + 1;
      document.getElementById('btn-hud-more').click();
      const newRunRect = document.getElementById('btn-new-run').getBoundingClientRect();
      const newRunFits = newRunRect.width > 0 && newRunRect.right <= window.innerWidth + 1;
      document.getElementById('btn-hud-more').click();

      // SW update banner test
      window.__SPIRE_SHOW_SW_UPDATE__({ postMessage: () => {} });
      const swBannerOpen = Boolean(document.getElementById('sw-update-banner'));
      const swBannerText = document.getElementById('sw-update-banner')?.textContent?.trim() || '';
      document.getElementById('btn-sw-dismiss').click();
      const swBannerClosed = !document.getElementById('sw-update-banner');

      return {
        relicWidth: Math.round(relicRect.width),
        relicHeight: Math.round(relicRect.height),
        nameLabelDisplay,
        penShortDisplay,
        penFullDisplay,
        docOverflow,
        relicTipOpen,
        relicTipTitle,
        duplicateTriggers,
        intentTipOpen,
        intentTipDesc,
        wmHpUnchanged: wmHpBefore === wmHpAfter,
        hasRegrowingEl,
        moreFits,
        newRunFits,
        swBannerOpen,
        swBannerText,
        swBannerClosed,
      };
    })()`);

    assert.ok(mobileV2Audit.relicWidth <= 34 && mobileV2Audit.relicHeight <= 34, `Mobile relic icon must be compact <=34px, got ${mobileV2Audit.relicWidth}x${mobileV2Audit.relicHeight}`);
    assert.equal(mobileV2Audit.nameLabelDisplay, 'none', 'Mobile relic badge hides long text label');
    assert.notEqual(mobileV2Audit.penShortDisplay, 'none', 'Mobile relic badge shows short corner counter');
    assert.equal(mobileV2Audit.penFullDisplay, 'none', 'Mobile relic badge hides long counter text');
    assert.equal(mobileV2Audit.docOverflow, false, 'Mobile combat with 10+ relics must not overflow horizontally');
    assert.equal(mobileV2Audit.relicTipOpen, true);
    assert.ok(mobileV2Audit.relicTipTitle.includes('燃烧之血'));
    assert.equal(mobileV2Audit.duplicateTriggers, 0, 'No duplicate 🔮 next-intent trigger button may appear');
    assert.equal(mobileV2Audit.intentTipOpen, true);
    assert.ok(mobileV2Audit.intentTipDesc.includes('下回合可能行动'), `Unified intent tooltip must include next-turn forecast, got: ${mobileV2Audit.intentTipDesc}`);
    assert.equal(mobileV2Audit.wmHpUnchanged, true, 'Tapping enemy .intent-badge must never attack enemy even with a card selected');
    assert.equal(mobileV2Audit.hasRegrowingEl, true, 'Downed Darkling renders .regrowing state');
    assert.equal(mobileV2Audit.moreFits, true, 'Mobile ☰ More button fits inside 390px .top-actions');
    assert.equal(mobileV2Audit.newRunFits, true, 'Mobile More drawer displays New Run cleanly within 390px viewport');
    assert.equal(mobileV2Audit.swBannerOpen, true);
    assert.ok(mobileV2Audit.swBannerText.includes('发现新版本'));
    assert.equal(mobileV2Audit.swBannerClosed, true);

    if (process.env.SCRATCH_SCREENSHOT_DIR) {
      fs.mkdirSync(process.env.SCRATCH_SCREENSHOT_DIR, { recursive: true });
      const shotV2Combat = await cdp.send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(
        path.join(process.env.SCRATCH_SCREENSHOT_DIR, 'mobile_v2_combat_icons.png'),
        Buffer.from(shotV2Combat.data, 'base64')
      );
    }

    // 6. Game Over & Run History display restart count badge cleanly
    const restartReportAudit = await cdp.evaluate(`(() => {
      const app = window.__SPIRE_APP__;
      const st = app.getState();
      st.stats.combatRestarts = 3;
      st.screen = 'game_over';
      st.outcome = 'victory';
      app.render();
      const gameoverPill = document.getElementById('gameover-restart-pill')?.textContent?.trim() || '';
      document.getElementById('btn-open-meta').click();
      const historyRestartBadge = document.querySelector('.history-badge.restart')?.textContent?.trim() || '';
      document.querySelector('[data-action="inspect-history-run"]')?.click();
      const detailText = document.getElementById('history-detail-modal')?.textContent || '';
      return { gameoverPill, historyRestartBadge, detailHasRestart: detailText.includes('重启 3 次') };
    })()`);
    assert.ok(restartReportAudit.gameoverPill.includes('重启 3 次'), `Expected Game Over restart pill, got: ${restartReportAudit.gameoverPill}`);
    assert.ok(restartReportAudit.historyRestartBadge.includes('重启 3次'), `Expected History restart badge, got: ${restartReportAudit.historyRestartBadge}`);
    assert.equal(restartReportAudit.detailHasRestart, true, 'History Detail modal must show combat restart count');

    const exceptions = cdp.events.filter((e) => e.method === 'Runtime.exceptionThrown');
    const consoleErrors = cdp.events.filter(
      (e) => e.method === 'Runtime.consoleAPICalled' && e.params?.type === 'error'
    );
    assert.equal(exceptions.length, 0, `Uncaught exceptions: ${JSON.stringify(exceptions)}`);
    assert.equal(consoleErrors.length, 0, `Console errors: ${JSON.stringify(consoleErrors)}`);

    cdp.ws.close();
  } finally {
    await teardownSession({ server, browser, cdp });
  }
});

test('Real Chromium E2E: Concise card keyword tooltips (no card play), Map click direct-connection highlight (main + modal), Map room-type filter legend (Desktop + 390px Mobile), and Official Chinese card names', async (t) => {
  if (!resolveBrowserBinary()) {
    t.skip('No local Chromium/Chrome binary available');
    return;
  }
  const { server, port } = await startStaticServer();
  let browser = null;
  let cdp = null;
  try {
    browser = await launchHeadlessChromium();
    const debugPort = new URL(browser.browserWsUrl).port;
    const targetsResp = await fetch(`http://127.0.0.1:${debugPort}/json/list`);
    const targets = await targetsResp.json();
    const pageTarget = targets.find((x) => x.type === 'page');
    assert.ok(pageTarget);
    cdp = await createCdpClient(pageTarget.webSocketDebuggerUrl);
    await cdp.send('Runtime.enable');
    await cdp.send('Page.enable');
    // === 1. Desktop (1280x900): Main Map direct-connection click + room-type filter legend ===
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${port}/index.html` });
    await new Promise((r) => setTimeout(r, 350));
    await launchHeroFromCharacterSelect(cdp, 'watcher');
    await cdp.evaluate(`(() => {
      document.getElementById('neow-choice-0')?.click();
      const neowCard = document.querySelector('#modal-backdrop .game-card');
      if (neowCard) neowCard.click();
    })()`);
    await new Promise((r) => setTimeout(r, 120));

    // Pick a non-available middle-floor node (e.g. Floor 6 or 7) and click it to highlight direct upstream + downstream connections
    const mapClickAudit = await cdp.evaluate(`(() => {
      const st = window.__SPIRE_APP__.getState();
      const targetNode = st.map[6]?.[0];
      const expectedParents = st.map[5].filter((n) => n.nextIds.includes(targetNode.id)).map((n) => n.id);
      const expectedChildren = [...targetNode.nextIds];
      const expectedConnected = [...new Set([...expectedParents, ...expectedChildren])];

      const btn = document.getElementById('map-node-' + targetNode.id);
      btn.scrollIntoView({ block: 'center', behavior: 'instant' });
      btn.click();

      const board = document.querySelector('.map-board');
      const inspectedIds = [...board.querySelectorAll('.map-node-btn.map-node-inspected')].map((el) => el.dataset.nodeId);
      const connectedIds = [...board.querySelectorAll('.map-node-btn.map-node-connected')].map((el) => el.dataset.nodeId);
      const highlightedEdges = board.querySelectorAll('.map-edge-path.edge-hover-highlight').length;
      const hasInspectClass = board.classList.contains('has-node-inspect');

      // Clicking the same node again toggles highlight off cleanly
      btn.click();
      const clearedInspect = !board.classList.contains('has-node-inspect') &&
        board.querySelectorAll('.map-node-btn.map-node-connected').length === 0;

      // Re-click a higher-floor node near the top of the map so both filter bar + connected rooms appear together in screenshot
      const topTarget = st.map[12]?.[0] || targetNode;
      document.getElementById('map-node-' + topTarget.id)?.click();

      return {
        targetId: targetNode.id,
        expectedConnected: expectedConnected.sort(),
        inspectedIds,
        connectedIds: connectedIds.sort(),
        highlightedEdges,
        hasInspectClass,
        clearedInspect,
      };
    })()`);

    assert.equal(mapClickAudit.hasInspectClass, true, 'Clicking a non-available map room must activate .has-node-inspect');
    assert.deepEqual(mapClickAudit.inspectedIds, [mapClickAudit.targetId]);
    assert.deepEqual(
      mapClickAudit.connectedIds,
      mapClickAudit.expectedConnected,
      'Clicking a map room must highlight every direct upstream parent and direct downstream child room'
    );
    assert.equal(
      mapClickAudit.highlightedEdges,
      mapClickAudit.expectedConnected.length,
      'Highlighted edge count must match direct upstream + downstream room connections'
    );
    assert.equal(mapClickAudit.clearedInspect, true, 'Clicking inspected room a second time must clear highlight');

    // Room-type highlight filter bar (campfire / elite / combat)
    const mapFilterAudit = await cdp.evaluate(`(() => {
      const restBtn = document.querySelector('.map-type-filter-btn[data-filter-node-type="rest"]');
      const eliteBtn = document.querySelector('.map-type-filter-btn[data-filter-node-type="elite"]');
      const combatBtn = document.querySelector('.map-type-filter-btn[data-filter-node-type="combat"]');
      const board = document.querySelector('.map-board');

      restBtn.click();
      const totalRestNodes = board.querySelectorAll('.map-node-btn[data-node-type="rest"]').length;
      const matchedRestNodes = board.querySelectorAll('.map-node-btn.map-node-type-match[data-node-type="rest"]').length;
      const wrongMatches = board.querySelectorAll('.map-node-btn.map-node-type-match:not([data-node-type="rest"])').length;
      const restActive = restBtn.classList.contains('active') && restBtn.getAttribute('aria-pressed') === 'true';
      const boardHasFilter = board.classList.contains('has-type-filter');

      // Switch to Elite
      eliteBtn.click();
      const totalElite = board.querySelectorAll('.map-node-btn[data-node-type="elite"]').length;
      const matchedElite = board.querySelectorAll('.map-node-btn.map-node-type-match[data-node-type="elite"]').length;
      const restDeactivated = !restBtn.classList.contains('active');

      // Toggle off by clicking Elite again, then switch back to Rest for visual screenshot
      eliteBtn.click();
      const filterCleared = !board.classList.contains('has-type-filter') &&
        board.querySelectorAll('.map-node-btn.map-node-type-match').length === 0;
      restBtn.click();
      document.querySelector('.map-type-filter-bar')?.scrollIntoView({ block: 'start', behavior: 'instant' });

      return {
        hasRestBtn: Boolean(restBtn),
        hasEliteBtn: Boolean(eliteBtn),
        hasCombatBtn: Boolean(combatBtn),
        totalRestNodes,
        matchedRestNodes,
        wrongMatches,
        restActive,
        boardHasFilter,
        totalElite,
        matchedElite,
        restDeactivated,
        filterCleared,
      };
    })()`);

    assert.equal(mapFilterAudit.hasRestBtn, true);
    assert.equal(mapFilterAudit.hasEliteBtn, true);
    assert.equal(mapFilterAudit.hasCombatBtn, true);
    assert.ok(mapFilterAudit.totalRestNodes > 0, 'Map must contain campfire rooms');
    assert.equal(mapFilterAudit.matchedRestNodes, mapFilterAudit.totalRestNodes, 'All campfire rooms must be highlighted');
    assert.equal(mapFilterAudit.wrongMatches, 0, 'Non-campfire rooms must not match rest filter');
    assert.equal(mapFilterAudit.restActive, true);
    assert.equal(mapFilterAudit.boardHasFilter, true);
    assert.equal(mapFilterAudit.matchedElite, mapFilterAudit.totalElite);
    assert.equal(mapFilterAudit.restDeactivated, true);
    assert.equal(mapFilterAudit.filterCleared, true);

    if (process.env.SCRATCH_SCREENSHOT_DIR) {
      fs.mkdirSync(process.env.SCRATCH_SCREENSHOT_DIR, { recursive: true });
      const shotDesktopMap = await cdp.send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(
        path.join(process.env.SCRATCH_SCREENSHOT_DIR, 'desktop_map_filter_inspect.png'),
        Buffer.from(shotDesktopMap.data, 'base64')
      );
    }

    // === 2. Enter combat -> Verify concise card descriptions, interactive keyword tooltip (NO card play!), Official Chinese card names, and Read-Only Map Modal ===
    await cdp.evaluate(`document.querySelector('.map-node-btn.available').click()`);
    await new Promise((r) => setTimeout(r, 120));

    const cardKeywordAudit = await cdp.evaluate(`(() => {
      const app = window.__SPIRE_APP__;
      const st = app.getState();
      st.combat.hand = [
        { instanceId: 'kw_app', cardId: 'apparition', upgraded: false },
        { instanceId: 'kw_eye', cardId: 'third_eye', upgraded: false },
        { instanceId: 'kw_rush', cardId: 'rushdown', upgraded: false },
        { instanceId: 'kw_erup', cardId: 'eruption', upgraded: false },
        { instanceId: 'kw_pan', cardId: 'panacea', upgraded: false },
      ];
      st.player.energy = 3;
      app.render();

      const appCard = document.getElementById('hand-card-kw_app');
      const eyeCard = document.getElementById('hand-card-kw_eye');
      const rushCard = document.getElementById('hand-card-kw_rush');
      const erupCard = document.getElementById('hand-card-kw_erup');
      const panCard = document.getElementById('hand-card-kw_pan');

      const appDesc = appCard.querySelector('.card-desc').textContent.trim();
      const eyeDesc = eyeCard.querySelector('.card-desc').textContent.trim();
      const panDesc = panCard.querySelector('.card-desc').textContent.trim();
      const appInlineKws = [...appCard.querySelectorAll('.card-kw-inline')].map((el) => el.textContent);

      // Click the keyword trigger on playable Apparition -> tooltip opens, card is NOT played!
      const energyBefore = st.player.energy;
      const handLenBefore = st.combat.hand.length;
      const kwTrigger = appCard.querySelector('.card-kw-trigger');
      kwTrigger.click();
      const tip = document.getElementById('spire-tooltip');
      const tipOpen = Boolean(tip && !tip.hidden);
      const tipTitle = tip?.querySelector('.spire-tooltip-title')?.textContent?.trim() || '';
      const tipDesc = tip?.querySelector('.spire-tooltip-desc')?.textContent?.trim() || '';

      return {
        appName: appCard.querySelector('.card-name').textContent.trim(),
        eyeName: eyeCard.querySelector('.card-name').textContent.trim(),
        rushName: rushCard.querySelector('.card-name').textContent.trim(),
        erupName: erupCard.querySelector('.card-name').textContent.trim(),
        panName: panCard.querySelector('.card-name').textContent.trim(),
        appDesc,
        eyeDesc,
        panDesc,
        appInlineKws,
        tipOpen,
        tipTitle,
        tipDesc,
        cardNotPlayed: st.player.energy === energyBefore && st.combat.hand.length === handLenBefore,
      };
    })()`);

    assert.equal(cardKeywordAudit.appName, '灵体');
    assert.equal(cardKeywordAudit.eyeName, '天眼');
    assert.equal(cardKeywordAudit.rushName, '猛虎下山');
    assert.equal(cardKeywordAudit.erupName, '暴怒');
    assert.equal(cardKeywordAudit.panName, '万能药');
    assert.equal(cardKeywordAudit.appDesc.includes('虚无（'), false, 'Ethereal must not show verbose inline parenthetical');
    assert.equal(cardKeywordAudit.appDesc.includes('无实体】（'), false, 'Intangible must not show verbose inline parenthetical');
    assert.equal(cardKeywordAudit.eyeDesc.includes('预见 3（'), false, 'Scry must not show verbose inline parenthetical');
    assert.equal(cardKeywordAudit.panDesc.includes('人工制品】（'), false, 'Artifact must not show verbose inline parenthetical');
    assert.ok(cardKeywordAudit.appInlineKws.includes('虚无'), 'Keyword 虚无 must be highlighted inline');
    assert.equal(cardKeywordAudit.tipOpen, true, 'Clicking .card-kw-trigger must open keyword tooltip');
    assert.ok(cardKeywordAudit.tipTitle.includes('灵体'));
    assert.ok(cardKeywordAudit.tipDesc.includes('虚无：'), 'Tooltip must explain 虚无');
    assert.ok(cardKeywordAudit.tipDesc.includes('无实体：'), 'Tooltip must explain 无实体');
    assert.ok(cardKeywordAudit.tipDesc.includes('消耗：'), 'Tooltip must explain 消耗');
    assert.equal(cardKeywordAudit.cardNotPlayed, true, 'Clicking .card-kw-trigger must NEVER play the card');

    if (process.env.SCRATCH_SCREENSHOT_DIR) {
      await new Promise((r) => setTimeout(r, 340));
      const shotCardKw = await cdp.send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(
        path.join(process.env.SCRATCH_SCREENSHOT_DIR, 'desktop_card_keyword_tooltip.png'),
        Buffer.from(shotCardKw.data, 'base64')
      );
    }

    // === 2b. Golden Condition-Met Hand Glow (Sash Whip, Crush Joints, Halt, Fear No Evil, 0-Energy Suppression) ===
    const condGlowAudit = await cdp.evaluate(`(() => {
      const app = window.__SPIRE_APP__;
      const st = app.getState();
      st.combat.lastCardTypePlayed = null;
      st.combat.stance = 'neutral';
      st.combat.enemies[0].intent = { id: 'chomp', name: '猛咬', type: 'attack', damage: 11, hits: 1 };
      st.combat.hand = [
        { instanceId: 'cg_strike', cardId: 'strike', upgraded: false },
        { instanceId: 'cg_defend', cardId: 'defend', upgraded: false },
        { instanceId: 'cg_sash', cardId: 'sash_whip', upgraded: false },
        { instanceId: 'cg_crush', cardId: 'crush_joints', upgraded: false },
        { instanceId: 'cg_fear', cardId: 'fear_no_evil', upgraded: false },
        { instanceId: 'cg_halt', cardId: 'halt', upgraded: false },
      ];
      st.player.energy = 3;
      app.render();

      const hasGlow = (id) => document.getElementById('hand-card-' + id)?.classList.contains('condition-active') ?? false;
      const beforeAny = {
        sash: hasGlow('cg_sash'),
        crush: hasGlow('cg_crush'),
        fear: hasGlow('cg_fear'),
        halt: hasGlow('cg_halt'),
      };

      // Simulate last played Attack -> Sash Whip lights up gold! Crush Joints stays off!
      st.combat.lastCardTypePlayed = 'attack';
      st.combat.stance = 'wrath';
      app.render();
      const afterAttackAndWrath = {
        sash: hasGlow('cg_sash'),
        sashAttr: document.getElementById('hand-card-cg_sash')?.dataset.conditionActive || '',
        crush: hasGlow('cg_crush'),
        fear: hasGlow('cg_fear'),
        halt: hasGlow('cg_halt'),
      };

      // Switch last played to Skill -> Crush Joints lights up gold, Sash Whip turns off!
      st.combat.lastCardTypePlayed = 'skill';
      st.combat.stance = 'neutral';
      app.render();
      const afterSkill = {
        sash: hasGlow('cg_sash'),
        crush: hasGlow('cg_crush'),
        halt: hasGlow('cg_halt'),
      };

      // When 0 energy -> Crush Joints (cost 1) is unplayable so MUST NOT glow gold!
      st.player.energy = 0;
      app.render();
      const atZeroEnergy = {
        crush: hasGlow('cg_crush'),
        halt: hasGlow('cg_halt'),
      };

      // Restore iconic glowing hand for visual screenshot: Attack played + Wrath + attacking enemy
      st.player.energy = 3;
      st.combat.lastCardTypePlayed = 'attack';
      st.combat.stance = 'wrath';
      app.render();

      return { beforeAny, afterAttackAndWrath, afterSkill, atZeroEnergy };
    })()`);

    assert.equal(condGlowAudit.beforeAny.sash, false, 'Sash Whip must not glow before an Attack is played');
    assert.equal(condGlowAudit.beforeAny.crush, false, 'Crush Joints must not glow before a Skill is played');
    assert.equal(condGlowAudit.beforeAny.fear, true, 'Fear No Evil must glow gold when enemy intends to attack');
    assert.equal(condGlowAudit.beforeAny.halt, false, 'Halt must not glow outside Wrath');
    assert.equal(condGlowAudit.afterAttackAndWrath.sash, true, 'Sash Whip must glow gold after playing an Attack');
    assert.equal(condGlowAudit.afterAttackAndWrath.sashAttr, 'true');
    assert.equal(condGlowAudit.afterAttackAndWrath.crush, false, 'Crush Joints must not glow after playing an Attack');
    assert.equal(condGlowAudit.afterAttackAndWrath.halt, true, 'Halt must glow gold in Wrath stance');
    assert.equal(condGlowAudit.afterSkill.sash, false, 'Sash Whip glow must clear after playing a Skill');
    assert.equal(condGlowAudit.afterSkill.crush, true, 'Crush Joints must glow gold after playing a Skill');
    assert.equal(condGlowAudit.atZeroEnergy.crush, false, 'Unplayable 1-cost card must not glow gold at 0 Energy');

    if (process.env.SCRATCH_SCREENSHOT_DIR) {
      await new Promise((r) => setTimeout(r, 340));
      const shotGlow = await cdp.send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(
        path.join(process.env.SCRATCH_SCREENSHOT_DIR, 'desktop_condition_gold_glow.png'),
        Buffer.from(shotGlow.data, 'base64')
      );
    }

    // Also verify Deck modal passive cards still allow tapping .card-kw-trigger
    const deckKwAudit = await cdp.evaluate(`(() => {
      document.getElementById('btn-open-deck').click();
      const deckTrigger = document.querySelector('#modal-backdrop .card-kw-trigger');
      deckTrigger?.click();
      const tip = document.getElementById('spire-tooltip');
      const opened = Boolean(tip && !tip.hidden);
      const desc = tip?.querySelector('.spire-tooltip-desc')?.textContent?.trim() || '';
      document.getElementById('btn-close-modal')?.click();
      return { hasTrigger: Boolean(deckTrigger), opened, desc };
    })()`);
    assert.equal(deckKwAudit.hasTrigger, true, 'Deck modal cards must expose keyword triggers');
    assert.equal(deckKwAudit.opened, true, 'Passive cards in Deck modal must open keyword tooltip on click');
    assert.ok(deckKwAudit.desc.length > 0);

    // === 3. Read-Only Map Modal during combat: direct-connection click + room-type filter ===
    const modalMapAudit = await cdp.evaluate(`(() => {
      document.getElementById('btn-open-map').click();
      const modal = document.getElementById('map-inspector-modal');
      const st = window.__SPIRE_APP__.getState();
      const midNode = st.map[7][0];
      const modalNodeBtn = document.getElementById('map-modal-node-' + midNode.id);
      modalNodeBtn.click();
      const connectedCount = modal.querySelectorAll('.map-node-btn.map-node-connected').length;
      const edgeCount = modal.querySelectorAll('.map-edge-path.edge-hover-highlight').length;
      const eliteBtn = modal.querySelector('.map-type-filter-btn[data-filter-node-type="elite"]');
      eliteBtn.click();
      const eliteMatched = modal.querySelectorAll('.map-node-btn.map-node-type-match[data-node-type="elite"]').length;
      document.getElementById('btn-close-modal').click();
      return {
        isInspected: modalNodeBtn.classList.contains('map-node-inspected'),
        connectedCount,
        edgeCount,
        eliteMatched,
      };
    })()`);
    assert.equal(modalMapAudit.isInspected, true, 'Clicking room inside read-only Map modal must inspect it');
    assert.ok(modalMapAudit.connectedCount >= 2, 'Read-only Map modal click must highlight upstream + downstream rooms');
    assert.equal(modalMapAudit.edgeCount, modalMapAudit.connectedCount);
    assert.ok(modalMapAudit.eliteMatched > 0, 'Read-only Map modal room-type filter must highlight all elites');

    // === 4. Mobile 390x844 touch viewport: Icon-only enlarged medallions + Map filter + click direct connection + zero overflow ===
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });
    const mobileMapAudit = await cdp.evaluate(`(() => {
      const app = window.__SPIRE_APP__;
      const st = app.getState();
      st.screen = 'map';
      st.combat = null;
      app.render();

      const restBtn = document.querySelector('.map-type-filter-btn[data-filter-node-type="rest"]');
      restBtn.click();
      const midNode = st.map[6][0];
      const midBtn = document.getElementById('map-node-' + midNode.id);
      midBtn.scrollIntoView({ block: 'center', behavior: 'instant' });
      // Simulate touch mark then click on mobile
      window.dispatchEvent(new Event('touchstart'));
      midBtn.click();

      const board = document.querySelector('.map-board');
      const filterBar = document.querySelector('.map-type-filter-bar');
      const nodeRect = midBtn.getBoundingClientRect();
      const iconSvgRect = midBtn.querySelector('.node-icon-wrap svg').getBoundingClientRect();
      return {
        docOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
        filterBarVisible: Boolean(filterBar && filterBar.getBoundingClientRect().height > 0),
        hasNodeText: Boolean(board.querySelector('.node-text')),
        nodeSize: Math.round(nodeRect.width),
        iconSize: Math.round(iconSvgRect.width),
        restMatched: board.querySelectorAll('.map-node-btn.map-node-type-match[data-node-type="rest"]').length,
        inspected: midBtn.classList.contains('map-node-inspected'),
        connectedCount: board.querySelectorAll('.map-node-btn.map-node-connected').length,
      };
    })()`);

    assert.equal(mobileMapAudit.docOverflow, false, 'Mobile 390px map with filter bar must not overflow horizontally');
    assert.equal(mobileMapAudit.filterBarVisible, true);
    assert.equal(mobileMapAudit.hasNodeText, false, 'Icon-only map rooms must not render text labels');
    assert.ok(mobileMapAudit.nodeSize >= 42, `Mobile icon-only room medallion must be >=42px, got ${mobileMapAudit.nodeSize}`);
    assert.ok(mobileMapAudit.iconSize >= 22, `Mobile room icon SVG must be >=22px, got ${mobileMapAudit.iconSize}`);
    assert.ok(mobileMapAudit.restMatched > 0, 'Mobile campfire filter highlights all campfire rooms');
    assert.equal(mobileMapAudit.inspected, true, 'Mobile touch tap on non-available room must highlight it');
    assert.ok(mobileMapAudit.connectedCount >= 2, 'Mobile touch tap must highlight directly connected upstream/downstream rooms');

    if (process.env.SCRATCH_SCREENSHOT_DIR) {
      const shotMobileMap = await cdp.send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(
        path.join(process.env.SCRATCH_SCREENSHOT_DIR, 'mobile_map_filter_inspect.png'),
        Buffer.from(shotMobileMap.data, 'base64')
      );
    }

    // === 5. Mobile 390x844 Combat: Horizontal hand-tray touch swipe scrolls cards cleanly without panning page & preserves scrollLeft ===
    await cdp.send('Emulation.setTouchEmulationEnabled', { enabled: true });
    const mobileSwipeSetup = await cdp.evaluate(`(() => {
      const app = window.__SPIRE_APP__;
      const st = app.getState();
      st.currentNodeId = null;
      st.map[0].forEach((n) => { n.visited = false; });
      app.render();
      document.querySelector('.map-node-btn.available').click();
      st.combat.hand = Array.from({ length: 8 }, (_, i) => ({
        instanceId: 'ms_' + i,
        cardId: i % 2 === 0 ? 'sash_whip' : 'defend',
        upgraded: false,
      }));
      st.combat.lastCardTypePlayed = 'attack';
      st.player.energy = 3;
      app.render();

      const tray = document.getElementById('hand-tray');
      tray.scrollIntoView({ block: 'center', behavior: 'instant' });
      const rect = tray.getBoundingClientRect();
      const cardEl = tray.querySelector('.game-card');
      const docStyle = getComputedStyle(document.documentElement);
      const trayStyle = getComputedStyle(tray);
      const cardStyle = getComputedStyle(cardEl);
      const endTurnStyle = getComputedStyle(document.getElementById('btn-end-turn'));
      return {
        xStart: Math.round(rect.right - 30),
        xEnd: Math.round(rect.left + 30),
        yMid: Math.round(rect.top + rect.height / 2),
        docOverflowX: docStyle.overflowX,
        docOverscrollX: docStyle.overscrollBehaviorX,
        docTouchAction: docStyle.touchAction,
        btnTouchAction: endTurnStyle.touchAction,
        trayOverscrollX: trayStyle.overscrollBehaviorX,
        trayTouchAction: trayStyle.touchAction,
        cardTouchAction: cardStyle.touchAction,
        traySnap: trayStyle.scrollSnapType,
        trayMaxScroll: Math.max(0, tray.scrollWidth - tray.clientWidth),
      };
    })()`);

    assert.equal(mobileSwipeSetup.docOverflowX, 'clip', 'html must clip horizontal page overflow without breaking sticky');
    assert.equal(mobileSwipeSetup.docOverscrollX, 'none', 'html must disable horizontal page overscroll');
    assert.equal(mobileSwipeSetup.docTouchAction, 'manipulation', 'html must disable double-tap zoom via touch-action: manipulation');
    assert.equal(mobileSwipeSetup.btnTouchAction, 'manipulation', 'Buttons must disable double-tap zoom via touch-action: manipulation');
    assert.equal(mobileSwipeSetup.trayOverscrollX, 'contain', '#hand-tray must contain horizontal overscroll');
    assert.equal(mobileSwipeSetup.trayTouchAction, 'pan-x', '#hand-tray must allow pan-x');
    assert.equal(mobileSwipeSetup.cardTouchAction, 'pan-x', 'Cards inside #hand-tray must explicitly set touch-action: pan-x');
    assert.equal(mobileSwipeSetup.traySnap, 'none', '#hand-tray must not fight horizontal swipes with scroll-snap');
    assert.ok(mobileSwipeSetup.trayMaxScroll > 300, '8-card mobile hand must be horizontally scrollable');

    // Perform real touch swipe (slightly diagonal, starting on a card) across #hand-tray -> scrolls cards, NOT the page!
    const swipeSteps = 10;
    for (let i = 0; i <= swipeSteps; i++) {
      const tx = Math.round(
        mobileSwipeSetup.xStart + ((mobileSwipeSetup.xEnd - mobileSwipeSetup.xStart) * i) / swipeSteps
      );
      const ty = Math.round(mobileSwipeSetup.yMid + i * 2);
      await cdp.send('Input.dispatchTouchEvent', {
        type: i === 0 ? 'touchStart' : i === swipeSteps ? 'touchEnd' : 'touchMove',
        touchPoints: i === swipeSteps ? [] : [{ x: tx, y: ty, id: 1 }],
      });
      await new Promise((r) => setTimeout(r, 12));
    }
    await new Promise((r) => setTimeout(r, 140));

    // Also test selecting a card on the right half preserves scrollLeft across re-render
    const afterMobileSwipe = await cdp.evaluate(`(() => {
      const tray = document.getElementById('hand-tray');
      const scrollAfterSwipe = Math.round(tray.scrollLeft);
      const winXAfterSwipe = Math.round(window.scrollX);

      // Tap card #4 (mobile 2-tap confirm selects card and triggers render())
      document.getElementById('hand-card-ms_4')?.click();
      const scrollAfterSelect = Math.round(document.getElementById('hand-tray')?.scrollLeft ?? 0);

      // Verify boundary touchmove guard prevents overscroll at left edge (scrollLeft === 0, swiping right)
      const tray2 = document.getElementById('hand-tray');
      tray2.scrollLeft = 0;
      const card0 = document.getElementById('hand-card-ms_0');
      const r0 = card0.getBoundingClientRect();
      const mkTouch = (x, y) => new Touch({ identifier: 1, target: card0, clientX: x, clientY: y });
      card0.dispatchEvent(new TouchEvent('touchstart', { bubbles: true, cancelable: true, touches: [mkTouch(r0.left + 20, r0.top + 30)] }));
      const moveRightAtLeftEdge = new TouchEvent('touchmove', { bubbles: true, cancelable: true, touches: [mkTouch(r0.left + 55, r0.top + 32)] });
      card0.dispatchEvent(moveRightAtLeftEdge);
      card0.dispatchEvent(new TouchEvent('touchend', { bubbles: true, cancelable: true, touches: [] }));

      return {
        scrollAfterSwipe,
        winXAfterSwipe,
        scrollAfterSelect,
        leftEdgeGuardPrevented: moveRightAtLeftEdge.defaultPrevented,
        docOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
      };
    })()`);

    assert.ok(afterMobileSwipe.scrollAfterSwipe > 80, `Horizontal touch swipe must scroll #hand-tray cards, got scrollLeft=${afterMobileSwipe.scrollAfterSwipe}`);
    assert.equal(afterMobileSwipe.winXAfterSwipe, 0, 'Horizontal swipe on cards must NEVER move window.scrollX');
    assert.ok(
      Math.abs(afterMobileSwipe.scrollAfterSelect - afterMobileSwipe.scrollAfterSwipe) <= 4,
      `Selecting a scrolled card must preserve #hand-tray scrollLeft (${afterMobileSwipe.scrollAfterSwipe} -> ${afterMobileSwipe.scrollAfterSelect})`
    );
    assert.equal(afterMobileSwipe.leftEdgeGuardPrevented, true, 'Swiping right at left edge of #hand-tray must call preventDefault to block page overscroll');
    assert.equal(afterMobileSwipe.docOverflow, false, 'Mobile combat must never overflow horizontally');

    // === 6. Top HUD Vitals use crisp SVG icons instead of '生命'/'金币' words ===
    const hudVitalsAudit = await cdp.evaluate(`(() => {
      const hpEl = document.getElementById('hud-player-hp');
      const goldEl = document.getElementById('hud-player-gold');
      hpEl?.click();
      const tipTitle = document.getElementById('spire-tooltip')?.querySelector('.spire-tooltip-title')?.textContent?.trim() || '';
      return {
        hpText: hpEl?.textContent?.trim() || '',
        goldText: goldEl?.textContent?.trim() || '',
        hpSvg: Boolean(hpEl?.querySelector('svg[data-vital-icon="hp"]')),
        goldSvg: Boolean(goldEl?.querySelector('svg[data-vital-icon="gold"]')),
        hpAria: hpEl?.getAttribute('aria-label') || '',
        goldAria: goldEl?.getAttribute('aria-label') || '',
        tipTitle,
      };
    })()`);
    assert.equal(hudVitalsAudit.hpSvg, true, 'Top HUD HP chip must render crisp HP heart SVG icon');
    assert.equal(hudVitalsAudit.goldSvg, true, 'Top HUD Gold chip must render crisp Gold coin SVG icon');
    assert.equal(/生命/.test(hudVitalsAudit.hpText), false, `HUD HP chip must use icon instead of '生命' word, got "${hudVitalsAudit.hpText}"`);
    assert.equal(/金币/.test(hudVitalsAudit.goldText), false, `HUD Gold chip must use icon instead of '金币' word, got "${hudVitalsAudit.goldText}"`);
    assert.match(hudVitalsAudit.hpText, /^\d+\/\d+$/, 'HUD HP chip displays compact hp/maxHp value');
    assert.match(hudVitalsAudit.goldText, /^\d+$/, 'HUD Gold chip displays numeric gold value');
    assert.ok(hudVitalsAudit.hpAria.includes('生命'), 'HUD HP chip keeps accessible aria-label');
    assert.ok(hudVitalsAudit.goldAria.includes('金币'), 'HUD Gold chip keeps accessible aria-label');
    assert.equal(hudVitalsAudit.tipTitle, '当前生命值', 'Tapping HUD HP chip opens explanatory tooltip');

    // === 7. Mobile Option A+C HUD: SVG potion icons, Potion Action Popover, More Menu Drawer, Full-Width Relics & 360px Fit ===
    const hudAcAudit = await cdp.evaluate(`(() => {
      const app = window.__SPIRE_APP__;
      const st = app.getState();
      st.player.potions = ['fire_potion', 'block_potion', 'fire_potion'];
      st.player.relics = [
        'burning_blood', 'vajra', 'anchor', 'lantern', 'akabeko',
        'paper_phrog', 'pen_nib', 'happy_flower', 'nunchaku', 'girya',
      ];
      if (st.combat?.enemies?.length) {
        // Normalize to deterministic 1 alive enemy for 1-tap Fire Potion drink verification
        const baseEnemy = st.combat.enemies[0];
        baseEnemy.hp = 60;
        baseEnemy.maxHp = 60;
        baseEnemy.block = 0;
        st.combat.enemies = [baseEnemy];
        st.combat.status = 'ongoing';
        st.combat.phase = 'player';
      }
      app.render();

      const hudRect = document.querySelector('.top-hud.run-hud').getBoundingClientRect();
      const pot0 = document.getElementById('potion-slot-0');
      const pot0Rect = pot0.getBoundingClientRect();
      const pot0Svg = pot0.querySelector('svg[data-potion-icon="fire_potion"]');
      st.player.potions[2] = null;
      app.render();
      const pot2Svg = document.getElementById('potion-slot-2')?.querySelector('svg[data-potion-icon="empty"]');
      const potLabelHidden = getComputedStyle(document.getElementById('potion-slot-0').querySelector('.potion-name-label')).display === 'none';
      const visibleRelics = [...document.querySelectorAll('.top-hud .relic-badge')]
        .filter((el) => el.getBoundingClientRect().right <= hudRect.right + 1).length;

      // 7a. Tapping filled potion icon on 390px opens Potion Popover without consuming it immediately
      document.getElementById('potion-slot-0').click();
      const popoverEl = document.getElementById('hud-potion-popover');
      const popoverTitle = popoverEl?.querySelector('.hud-potion-popover-title')?.textContent?.trim() || '';
      const stillOwnedAfterFirstTap = st.player.potions[0] === 'fire_potion';
      const drinkBtn = document.getElementById('btn-popover-drink-potion');
      const discardBtn = document.getElementById('btn-popover-discard-potion');

      // Confirm drink from popover against single alive enemy
      const enemyHpBefore = st.combat.enemies[0].hp;
      drinkBtn.click();
      const enemyHpAfter = st.combat.enemies[0].hp;
      const consumedAfterDrink = st.player.potions[0] === null;
      const popoverClosedAfterDrink = !document.getElementById('hud-potion-popover');

      // 7a-2. Multi-enemy combat: Fire Potion popover prompts target pick, then throws on clicked enemy
      st.player.potions[0] = 'fire_potion';
      const enemyClone = JSON.parse(JSON.stringify(st.combat.enemies[0]));
      enemyClone.id = 'hud_ac_dummy_2';
      enemyClone.hp = 50;
      enemyClone.maxHp = 50;
      enemyClone.block = 0;
      st.combat.enemies.push(enemyClone);
      app.render();
      document.getElementById('potion-slot-0').click();
      const multiTargetDrinkLabel = document.getElementById('btn-popover-drink-potion')?.textContent?.trim() || '';
      document.getElementById('btn-popover-drink-potion').click();
      const awaitingTargetStillOwned = st.player.potions[0] === 'fire_potion';
      const secondEnemyEl = document.getElementById('enemy-unit-hud_ac_dummy_2');
      const cloneHpBefore = enemyClone.hp;
      secondEnemyEl?.click();
      const cloneHpAfter = enemyClone.hp;
      const multiTargetConsumed = st.player.potions[0] === null;
      st.combat.enemies = [st.combat.enemies[0]];

      // 7b. Discard slot 1 from popover outside combat (disabled button -> tap anchor)
      const prevScreen = st.screen;
      st.screen = 'shop';
      app.render();
      const slot1Anchor = document.querySelector('.potion-tooltip-anchor[data-filled-potion-slot="1"]');
      slot1Anchor.click();
      const shopPopoverOpen = Boolean(document.getElementById('hud-potion-popover'));
      const shopDrinkDisabled = Boolean(document.getElementById('btn-popover-drink-potion')?.disabled);
      document.getElementById('btn-popover-discard-potion').click();
      const slot1Discarded = st.player.potions[1] === null;
      st.screen = prevScreen;
      app.render();

      // 7c. More menu opens with all 5 unbroken Chinese labels and closes on outside tap
      document.getElementById('btn-hud-more').click();
      const menuOpen = document.getElementById('hud-more-menu')?.classList.contains('open');
      const menuLabels = [...document.querySelectorAll('#hud-more-menu button')].map((b) =>
        b.textContent.replace(/\s+/g, ' ').trim()
      );
      document.querySelector('.combat-header-bar, .stage-viewport')?.click();
      const menuClosedAfterOutsideTap = !document.getElementById('hud-more-menu')?.classList.contains('open');

      return {
        hudHeight: Math.round(hudRect.height),
        pot0Width: Math.round(pot0Rect.width),
        pot0Height: Math.round(pot0Rect.height),
        hasFireSvg: Boolean(pot0Svg),
        hasEmptySvg: Boolean(pot2Svg),
        potLabelHidden,
        visibleRelics,
        popoverOpen: Boolean(popoverEl),
        popoverTitle,
        stillOwnedAfterFirstTap,
        hasDrinkAndDiscard: Boolean(drinkBtn && discardBtn),
        enemyTookFireDamage: enemyHpAfter < enemyHpBefore,
        consumedAfterDrink,
        popoverClosedAfterDrink,
        multiTargetDrinkLabel,
        awaitingTargetStillOwned,
        multiEnemyTookDamage: cloneHpAfter < cloneHpBefore,
        multiTargetConsumed,
        shopPopoverOpen,
        shopDrinkDisabled,
        slot1Discarded,
        menuOpen,
        menuLabels,
        menuClosedAfterOutsideTap,
      };
    })()`);

    assert.ok(hudAcAudit.hudHeight <= 125, `Option A+C mobile HUD must be <= 125px tall, got ${hudAcAudit.hudHeight}px`);
    assert.ok(hudAcAudit.pot0Width <= 32 && hudAcAudit.pot0Height <= 32, `Mobile potion icon must be compact <=32px, got ${hudAcAudit.pot0Width}x${hudAcAudit.pot0Height}`);
    assert.equal(hudAcAudit.hasFireSvg, true, 'Fire potion renders dedicated SVG bottle');
    assert.equal(hudAcAudit.hasEmptySvg, true, 'Empty potion slot renders empty glass flask SVG');
    assert.equal(hudAcAudit.potLabelHidden, true, 'Mobile potion icon hides long name label');
    assert.ok(hudAcAudit.visibleRelics >= 9, `Dedicated Row 3 relic bar should display >= 9 relics on 390px, got ${hudAcAudit.visibleRelics}`);
    assert.equal(hudAcAudit.popoverOpen, true, 'Tapping mobile potion icon opens Potion Action Popover');
    assert.equal(hudAcAudit.popoverTitle, '火焰药水');
    assert.equal(hudAcAudit.stillOwnedAfterFirstTap, true, 'Opening mobile potion popover must not accidentally consume potion');
    assert.equal(hudAcAudit.hasDrinkAndDiscard, true, 'Potion popover renders Drink and Discard actions');
    assert.equal(hudAcAudit.enemyTookFireDamage, true, 'Confirming Drink from popover damages enemy');
    assert.equal(hudAcAudit.consumedAfterDrink, true, 'Potion slot clears after confirming Drink');
    assert.equal(hudAcAudit.popoverClosedAfterDrink, true, 'Popover closes automatically after Drink');
    assert.ok(hudAcAudit.multiTargetDrinkLabel.includes('选择目标'), `Expected multi-target label, got ${hudAcAudit.multiTargetDrinkLabel}`);
    assert.equal(hudAcAudit.awaitingTargetStillOwned, true, 'Selecting target from multi-enemy popover keeps potion until target tap');
    assert.equal(hudAcAudit.multiEnemyTookDamage, true, 'Tapping target enemy deals Fire Potion damage');
    assert.equal(hudAcAudit.multiTargetConsumed, true, 'Potion consumes after clicking target enemy');
    assert.equal(hudAcAudit.shopPopoverOpen, true, 'Tapping filled potion icon outside combat opens Potion Popover');
    assert.equal(hudAcAudit.shopDrinkDisabled, true, 'Drink button inside popover is disabled outside combat');
    assert.equal(hudAcAudit.slot1Discarded, true, 'Discard button inside popover discards potion cleanly');
    assert.equal(hudAcAudit.menuOpen, true, 'Tapping ☰ opens More menu drawer');
    assert.equal(hudAcAudit.menuLabels.length, 5, 'More menu holds all 5 secondary navigation items');
    assert.ok(hudAcAudit.menuLabels.some((t) => t.includes('新的一局')), `Expected unbroken '新的一局' label, got ${JSON.stringify(hudAcAudit.menuLabels)}`);
    assert.equal(hudAcAudit.menuClosedAfterOutsideTap, true, 'Tapping outside dismisses More menu drawer');

    // 7d. 360px small-phone viewport zero overflow & full Row 2 fit even with 3-digit HP & 3-digit Gold
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 360,
      height: 760,
      deviceScaleFactor: 2,
      mobile: true,
    });
    const hud360Audit = await cdp.evaluate(`(() => {
      const app = window.__SPIRE_APP__;
      const st = app.getState();
      st.player.hp = 100;
      st.player.maxHp = 100;
      st.player.gold = 999;
      st.player.potions = ['fire_potion', 'block_potion', 'energy_potion'];
      app.render();
      const hud = document.querySelector('.top-hud.run-hud').getBoundingClientRect();
      const pot2 = document.getElementById('potion-slot-2').getBoundingClientRect();
      const deck = document.getElementById('btn-open-deck').getBoundingClientRect();
      const more = document.getElementById('btn-hud-more').getBoundingClientRect();
      return {
        overflow: document.documentElement.scrollWidth > window.innerWidth,
        pot2Fits: pot2.right <= deck.left + 1,
        moreFits: more.right <= hud.right + 1,
        slackPx: Math.round(deck.left - pot2.right),
      };
    })()`);
    assert.equal(hud360Audit.overflow, false, '360px small phone HUD must never overflow horizontally');
    assert.equal(hud360Audit.pot2Fits, true, `All 3 potion icons fit left of Deck button on 360px phone (slack=${hud360Audit.slackPx}px)`);
    assert.equal(hud360Audit.moreFits, true, '☰ More trigger fits inside 360px HUD');

    const exceptions = cdp.events.filter((e) => e.method === 'Runtime.exceptionThrown');
    const consoleErrors = cdp.events.filter(
      (e) => e.method === 'Runtime.consoleAPICalled' && e.params?.type === 'error'
    );
    assert.equal(exceptions.length, 0, `Uncaught exceptions: ${JSON.stringify(exceptions)}`);
    assert.equal(consoleErrors.length, 0, `Console errors: ${JSON.stringify(consoleErrors)}`);

    cdp.ws.close();
  } finally {
    await teardownSession({ server, browser, cdp });
  }
});

test('E2E: Larger potion row tap targets, clickable campfire dig loot, War Paint/Whetstone upgrade modal, combat buff alignment, and official ZHS relic names', async (t) => {
  if (!resolveBrowserBinary()) {
    t.skip('No local Chromium/Chrome binary available');
    return;
  }
  const { server, port } = await startStaticServer();
  let browser = null;
  let cdp = null;
  try {
    browser = await launchHeadlessChromium();
    const debugPort = new URL(browser.browserWsUrl).port;
    const targetsResp = await fetch(`http://127.0.0.1:${debugPort}/json/list`);
    const targets = await targetsResp.json();
    const pageTarget = targets.find((x) => x.type === 'page');
    assert.ok(pageTarget);
    cdp = await createCdpClient(pageTarget.webSocketDebuggerUrl);
    await cdp.send('Runtime.enable');
    await cdp.send('Page.enable');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${port}/index.html` });
    await new Promise((r) => setTimeout(r, 350));
    await launchHeroFromCharacterSelect(cdp, 'ironclad');
    await new Promise((r) => setTimeout(r, 120));

    // 1. Desktop (1280px): Larger potion slot buttons + official ZHS relic names in HUD & Compendium
    const desktopAudit = await cdp.evaluate(`(() => {
      const app = window.__SPIRE_APP__;
      const st = app.getState();
      st.player.potions = ['fire_potion', 'block_potion', null];
      st.player.relics.push('war_paint', 'whetstone', 'pure_water', 'peace_pipe', 'mummified_hand', 'coffee_dripper', 'velvet_choker');
      app.render();
      const pot0 = document.getElementById('potion-slot-0');
      const potRect = pot0.getBoundingClientRect();
      const potFs = parseFloat(getComputedStyle(pot0).fontSize);

      document.getElementById('btn-open-compendium').click();
      document.querySelector('[data-action="set-compendium-tab"][data-tab="relics"]').click();
      const compText = document.getElementById('compendium-modal')?.textContent || '';
      document.getElementById('btn-close-modal').click();
      return {
        potHeight: Math.round(potRect.height),
        potFs,
        hasWarPaintZhs: compText.includes('战纹涂料'),
        hasWhetstoneZhs: compText.includes('磨刀石'),
        hasPureWaterZhs: compText.includes('至纯之水'),
        hasPeacePipeZhs: compText.includes('宁静烟斗'),
        hasMummifiedHandZhs: compText.includes('干瘪之手'),
        hasCoffeeDripperZhs: compText.includes('咖啡滤杯'),
        hasVelvetChokerZhs: compText.includes('天鹅绒颈圈'),
      };
    })()`);
    assert.ok(desktopAudit.potHeight >= 31, `Desktop potion button should be >= 31px tall, got ${desktopAudit.potHeight}px`);
    assert.ok(desktopAudit.potFs >= 13.4, `Desktop potion font-size should be >= 13.4px, got ${desktopAudit.potFs}px`);
    assert.equal(desktopAudit.hasWarPaintZhs, true);
    assert.equal(desktopAudit.hasWhetstoneZhs, true);
    assert.equal(desktopAudit.hasPureWaterZhs, true);
    assert.equal(desktopAudit.hasPeacePipeZhs, true);
    assert.equal(desktopAudit.hasMummifiedHandZhs, true);
    assert.equal(desktopAudit.hasCoffeeDripperZhs, true);
    assert.equal(desktopAudit.hasVelvetChokerZhs, true);

    // 2. Campfire Dig -> Clickable Relic Reward Screen + Unclaimed Confirmation
    const digFlowAudit = await cdp.evaluate(`(() => {
      const app = window.__SPIRE_APP__;
      const st = app.getState();
      if (!st.player.relics.includes('shovel')) st.player.relics.push('shovel');
      st.screen = 'rest';
      st.restState = { completed: false };
      app.render();

      const relicsBefore = st.player.relics.length;
      document.getElementById('btn-rest-dig').click();
      const heading = document.getElementById('reward-heading')?.textContent || '';
      const hasGoldCard = Boolean(document.getElementById('btn-claim-gold'));
      const hasCardChoices = document.querySelectorAll('[data-action="claim-card"]').length > 0;
      const hasRelicCard = Boolean(document.getElementById('btn-claim-relic'));
      const relicsBeforeClick = st.player.relics.length;

      // Attempting to leave before clicking relic opens unclaimed-loot warning
      document.getElementById('btn-proceed-reward').click();
      const unclaimedModalOpen = Boolean(document.getElementById('reward-unclaimed-modal'));
      document.getElementById('btn-cancel-skip-reward').click();

      // Clicking relic plaque claims it, then Proceed returns to map
      document.getElementById('btn-claim-relic').click();
      if (document.getElementById('btn-close-upgrade-reveal')) {
        document.getElementById('btn-close-upgrade-reveal').click();
      }
      const relicsAfterClick = st.player.relics.length;
      const hasClaimedPlaque = Boolean(document.querySelector('.loot-kind-relic.loot-claimed'));
      document.getElementById('btn-proceed-reward').click();
      const returnedToMap = st.screen === 'map';

      return {
        heading,
        hasGoldCard,
        hasCardChoices,
        hasRelicCard,
        relicsBefore,
        relicsBeforeClick,
        unclaimedModalOpen,
        relicsAfterClick,
        hasClaimedPlaque,
        returnedToMap,
      };
    })()`);
    assert.ok(digFlowAudit.heading.includes('营地挖掘'), `Expected campfire dig heading, got ${digFlowAudit.heading}`);
    assert.equal(digFlowAudit.hasGoldCard, false, 'Campfire dig reward screen should omit gold card');
    assert.equal(digFlowAudit.hasCardChoices, false, 'Campfire dig reward screen should omit card choices');
    assert.equal(digFlowAudit.hasRelicCard, true, 'Campfire dig reward screen renders clickable relic plaque');
    assert.equal(digFlowAudit.relicsBeforeClick, digFlowAudit.relicsBefore);
    assert.equal(digFlowAudit.unclaimedModalOpen, true, 'Proceeding without claiming dug relic shows confirmation modal');
    assert.equal(digFlowAudit.relicsAfterClick, digFlowAudit.relicsBefore + 1);
    assert.equal(digFlowAudit.hasClaimedPlaque, true);
    assert.equal(digFlowAudit.returnedToMap, true);

    // 3. War Paint (战纹涂料) from Reward & Whetstone (磨刀石) from Shop both reveal exact upgraded cards
    const upgradeModalAudit = await cdp.evaluate(`(() => {
      const app = window.__SPIRE_APP__;
      const st = app.getState();
      // Reset deck upgrades & remove war_paint/whetstone if randomly dug above
      st.player.relics = st.player.relics.filter((id) => id !== 'war_paint' && id !== 'whetstone');
      for (const c of st.player.deck) c.upgraded = false;

      // 3a. Claim War Paint from reward plaque
      st.screen = 'reward';
      st.reward = {
        source: 'campfire_dig',
        gold: 0,
        goldClaimed: true,
        relicId: 'war_paint',
        relicClaimed: false,
        extraRelicId: null,
        extraRelicClaimed: true,
        potionId: null,
        potionClaimed: true,
        cardChoices: [],
        cardClaimed: true,
        pickedCardId: null,
      };
      app.render();
      document.getElementById('btn-claim-relic').click();
      const wpModalOpen = Boolean(document.getElementById('relic-upgrade-reveal-modal'));
      const wpSummary = document.getElementById('relic-upgrade-reveal-summary')?.textContent || '';
      const wpCards = [...document.querySelectorAll('#relic-upgrade-reveal-cards .card-name')].map(
        (el) => el.textContent.trim()
      );
      document.getElementById('btn-close-upgrade-reveal').click();
      const wpInlineSummary = document.querySelector('.loot-upgrade-summary')?.textContent || '';

      // 3b. Buy Whetstone from shop
      st.screen = 'shop';
      st.player.gold = 500;
      st.shop = {
        cards: [],
        colorlessCards: [],
        relicOffer: { relicId: 'whetstone', price: 150, sold: false },
        shopRelicOffer: null,
        potionOffer: null,
        purgeCost: 75,
        purgeUsed: false,
      };
      app.render();
      document.getElementById('btn-buy-relic').click();
      const whModalOpen = Boolean(document.getElementById('relic-upgrade-reveal-modal'));
      const whSummary = document.getElementById('relic-upgrade-reveal-summary')?.textContent || '';
      const whCards = [...document.querySelectorAll('#relic-upgrade-reveal-cards .card-name')].map(
        (el) => el.textContent.trim()
      );
      document.getElementById('btn-close-upgrade-reveal').click();

      return {
        wpModalOpen,
        wpSummary,
        wpCards,
        wpInlineSummary,
        whModalOpen,
        whSummary,
        whCards,
      };
    })()`);
    assert.equal(upgradeModalAudit.wpModalOpen, true, 'Claiming 战纹涂料 opens upgrade reveal modal');
    assert.ok(upgradeModalAudit.wpSummary.includes('战纹涂料'), upgradeModalAudit.wpSummary);
    assert.equal(upgradeModalAudit.wpCards.length, 2, 'War Paint modal displays 2 upgraded skill cards');
    assert.ok(upgradeModalAudit.wpCards.every((n) => n.endsWith('+')), JSON.stringify(upgradeModalAudit.wpCards));
    assert.ok(upgradeModalAudit.wpInlineSummary.includes(upgradeModalAudit.wpCards[0]));

    assert.equal(upgradeModalAudit.whModalOpen, true, 'Buying 磨刀石 opens upgrade reveal modal');
    assert.ok(upgradeModalAudit.whSummary.includes('磨刀石'), upgradeModalAudit.whSummary);
    assert.equal(upgradeModalAudit.whCards.length, 2, 'Whetstone modal displays 2 upgraded attack cards');
    assert.ok(upgradeModalAudit.whCards.every((n) => n.endsWith('+')), JSON.stringify(upgradeModalAudit.whCards));

    // 4. Combat Fighter Alignment (Desktop 1280px & Mobile 390px) across 0 buffs, 1 buff + block, and 5 wrapped buffs
    await cdp.evaluate(`(() => {
      const app = window.__SPIRE_APP__;
      const st = app.getState();
      st.screen = 'map';
      if (st.neowState) st.neowState.resolved = true;
      app.render();
      document.querySelector('.map-node-btn.available').click();
    })()`);
    await new Promise((r) => setTimeout(r, 120));

    const measureAlignmentExpr = `(() => {
      const app = window.__SPIRE_APP__;
      const st = app.getState();
      const snapshot = () => {
        app.render();
        const pUnit = document.getElementById('player-unit');
        const eUnit = document.querySelector('.enemy-side .fighter-unit');
        const pRect = pUnit.getBoundingClientRect();
        const eRect = eUnit.getBoundingClientRect();
        const pFig = pUnit.querySelector('.unit-figure').getBoundingClientRect();
        const eFig = eUnit.querySelector('.unit-figure').getBoundingClientRect();
        const pHp = pUnit.querySelector('.hp-track').getBoundingClientRect();
        const eHp = eUnit.querySelector('.hp-track').getBoundingClientRect();
        return {
          topDiff: Math.abs(pRect.top - eRect.top),
          heightDiff: Math.abs(pRect.height - eRect.height),
          figTopDiff: Math.abs(pFig.top - eFig.top),
          hpTopDiff: Math.abs(pHp.top - eHp.top),
        };
      };
      // Normalize to single enemy for clean 1v1 alignment check
      st.combat.enemies = [st.combat.enemies[0]];
      st.combat.enemies[0].statuses = {};
      st.combat.enemies[0].block = 0;

      // Case A: 0 buffs on both
      st.player.statuses = {};
      st.player.block = 0;
      const zeroBuff = snapshot();

      // Case B: 1 buff + block on player vs 0 on enemy
      st.player.statuses = { strength: 2 };
      st.player.block = 10;
      const oneBuff = snapshot();

      // Case C: 5 buffs (wrapping 2 rows) on player vs 0 on enemy
      st.player.statuses = { strength: 3, dexterity: 2, metallicize: 4, thorns: 3, ritual: 2 };
      st.player.block = 12;
      const multiBuff = snapshot();

      return { zeroBuff, oneBuff, multiBuff };
    })()`;

    const desktopAlign = await cdp.evaluate(measureAlignmentExpr);
    for (const [label, m] of Object.entries(desktopAlign)) {
      assert.ok(m.topDiff <= 1, `Desktop ${label} topDiff=${m.topDiff}`);
      assert.ok(m.heightDiff <= 1, `Desktop ${label} heightDiff=${m.heightDiff}`);
      assert.ok(m.figTopDiff <= 1, `Desktop ${label} figTopDiff=${m.figTopDiff}`);
      assert.ok(m.hpTopDiff <= 1, `Desktop ${label} hpTopDiff=${m.hpTopDiff}`);
    }

    // Switch to 390px mobile and verify BOTH combat buff alignment AND enlarged Row 2 potion/vital/nav sizing
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });
    const mobileAlign = await cdp.evaluate(measureAlignmentExpr);
    for (const [label, m] of Object.entries(mobileAlign)) {
      assert.ok(m.topDiff <= 1, `Mobile 390px ${label} topDiff=${m.topDiff}`);
      assert.ok(m.heightDiff <= 1, `Mobile 390px ${label} heightDiff=${m.heightDiff}`);
      assert.ok(m.figTopDiff <= 1, `Mobile 390px ${label} figTopDiff=${m.figTopDiff}`);
      assert.ok(m.hpTopDiff <= 1, `Mobile 390px ${label} hpTopDiff=${m.hpTopDiff}`);
    }

    const mobile390Row2 = await cdp.evaluate(`(() => {
      const app = window.__SPIRE_APP__;
      const st = app.getState();
      st.player.hp = 100;
      st.player.maxHp = 100;
      st.player.gold = 999;
      st.player.potions = ['fire_potion', 'block_potion', 'energy_potion'];
      app.render();
      const hud = document.querySelector('.top-hud.run-hud').getBoundingClientRect();
      const pot0 = document.getElementById('potion-slot-0').getBoundingClientRect();
      const pot2 = document.getElementById('potion-slot-2').getBoundingClientRect();
      const deck = document.getElementById('btn-open-deck');
      const deckRect = deck.getBoundingClientRect();
      const moreRect = document.getElementById('btn-hud-more').getBoundingClientRect();
      const vitalFs = parseFloat(getComputedStyle(document.querySelector('.vital-chip')).fontSize);
      const deckFs = parseFloat(getComputedStyle(deck).fontSize);
      return {
        overflow: document.documentElement.scrollWidth > window.innerWidth,
        potHeight: Math.round(pot0.height),
        deckHeight: Math.round(deckRect.height),
        vitalFs,
        deckFs,
        pot2Fits: pot2.right <= deckRect.left + 1,
        moreFits: moreRect.right <= hud.right + 1,
        slackPx: Math.round(deckRect.left - pot2.right),
      };
    })()`);
    assert.equal(mobile390Row2.overflow, false, '390px Row 2 enlarged HUD must not overflow horizontally');
    assert.ok(mobile390Row2.potHeight >= 31, `390px potion tap target should be >= 31px, got ${mobile390Row2.potHeight}px`);
    assert.ok(mobile390Row2.deckHeight >= 31, `390px Deck button should be >= 31px, got ${mobile390Row2.deckHeight}px`);
    assert.ok(mobile390Row2.vitalFs >= 12.6, `390px vital font-size should be >= 12.6px, got ${mobile390Row2.vitalFs}px`);
    assert.ok(mobile390Row2.deckFs >= 12.6, `390px Deck font-size should be >= 12.6px, got ${mobile390Row2.deckFs}px`);
    assert.equal(mobile390Row2.pot2Fits, true, `All 3 enlarged potions fit left of Deck on 390px (slack=${mobile390Row2.slackPx}px)`);
    assert.equal(mobile390Row2.moreFits, true, 'More trigger fits inside 390px HUD');

    // Switch to 360px compact phone and verify enlarged Row 2 (30px buttons) still fits worst-case 100/100 + 999
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 360,
      height: 760,
      deviceScaleFactor: 2,
      mobile: true,
    });
    const mobile360Row2 = await cdp.evaluate(`(() => {
      const app = window.__SPIRE_APP__;
      app.render();
      const hud = document.querySelector('.top-hud.run-hud').getBoundingClientRect();
      const pot0 = document.getElementById('potion-slot-0').getBoundingClientRect();
      const pot2 = document.getElementById('potion-slot-2').getBoundingClientRect();
      const deckRect = document.getElementById('btn-open-deck').getBoundingClientRect();
      const moreRect = document.getElementById('btn-hud-more').getBoundingClientRect();
      return {
        overflow: document.documentElement.scrollWidth > window.innerWidth,
        potHeight: Math.round(pot0.height),
        pot2Fits: pot2.right <= deckRect.left + 1,
        moreFits: moreRect.right <= hud.right + 1,
      };
    })()`);
    assert.equal(mobile360Row2.overflow, false, '360px Row 2 enlarged HUD must not overflow horizontally');
    assert.ok(mobile360Row2.potHeight >= 30, `360px potion tap target should be >= 30px, got ${mobile360Row2.potHeight}px`);
    assert.equal(mobile360Row2.pot2Fits, true, 'All 3 enlarged potions fit left of Deck on 360px');
    assert.equal(mobile360Row2.moreFits, true, 'More trigger fits inside 360px HUD');

    const exceptions = cdp.events.filter((e) => e.method === 'Runtime.exceptionThrown');
    const consoleErrors = cdp.events.filter(
      (e) => e.method === 'Runtime.consoleAPICalled' && e.params?.type === 'error'
    );
    assert.equal(exceptions.length, 0, `Uncaught exceptions: ${JSON.stringify(exceptions)}`);
    assert.equal(consoleErrors.length, 0, `Console errors: ${JSON.stringify(consoleErrors)}`);

    cdp.ws.close();
  } finally {
    await teardownSession({ server, browser, cdp });
  }
});

test('E2E: Original Slay the Spire two-level Main Menu Hall, pure Standard Character Select with collapsed Seed drawer, and dedicated Daily Challenge screen', async (t) => {
  if (!resolveBrowserBinary()) {
    t.skip('No local Chromium/Chrome binary available');
    return;
  }
  const { server, port } = await startStaticServer();
  let browser = null;
  let cdp = null;
  try {
    browser = await launchHeadlessChromium();
    const debugPort = new URL(browser.browserWsUrl).port;
    const targetsResp = await fetch(`http://127.0.0.1:${debugPort}/json/list`);
    const targets = await targetsResp.json();
    const pageTarget = targets.find((x) => x.type === 'page');
    assert.ok(pageTarget);
    cdp = await createCdpClient(pageTarget.webSocketDebuggerUrl);
    await cdp.send('Runtime.enable');
    await cdp.send('Page.enable');

    // 1. Mobile 390x844: Level 1 Main Menu Hall fits in 1 screen with zero overflow & zero scroll
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${port}/index.html` });
    await new Promise((r) => setTimeout(r, 380));

    const home390Audit = await cdp.evaluate(`(() => {
      const screen = document.getElementById('main-menu-screen');
      const stdBtn = document.getElementById('btn-menu-standard');
      const dailyBtn = document.getElementById('btn-menu-daily');
      const utilCount = document.querySelectorAll('.main-menu-utility-grid .menu-util-tile').length;
      const hasResume = Boolean(document.getElementById('btn-resume-active-run'));
      const hasCharSelect = Boolean(document.getElementById('character-select-screen'));
      return {
        hasMainMenu: Boolean(screen),
        hasStdBtn: Boolean(stdBtn),
        hasDailyBtn: Boolean(dailyBtn),
        stdHeight: Math.round(stdBtn?.getBoundingClientRect().height || 0),
        utilCount,
        hasResume,
        hasCharSelect,
        overflowX: document.documentElement.scrollWidth > window.innerWidth,
        fitsOneScreen: document.documentElement.scrollHeight <= window.innerHeight + 2,
      };
    })()`);
    assert.equal(home390Audit.hasMainMenu, true);
    assert.equal(home390Audit.hasStdBtn, true);
    assert.equal(home390Audit.hasDailyBtn, true);
    assert.ok(home390Audit.stdHeight >= 58, `Main Menu primary button should be >= 58px tall, got ${home390Audit.stdHeight}px`);
    assert.equal(home390Audit.utilCount, 4);
    assert.equal(home390Audit.hasResume, false);
    assert.equal(home390Audit.hasCharSelect, false);
    assert.equal(home390Audit.overflowX, false, '390px Main Menu Hall must not overflow horizontally');
    assert.equal(home390Audit.fitsOneScreen, true, '390px Main Menu Hall should fit cleanly in one viewport');

    // 2. Mobile 360x760: Level 1 Main Menu Hall also fits cleanly in 1 screen with zero horizontal overflow
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 360,
      height: 760,
      deviceScaleFactor: 2,
      mobile: true,
    });
    const home360Audit = await cdp.evaluate(`(() => ({
      overflowX: document.documentElement.scrollWidth > window.innerWidth,
      fitsOneScreen: document.documentElement.scrollHeight <= window.innerHeight + 2,
    }))()`);
    assert.equal(home360Audit.overflowX, false, '360px Main Menu Hall must not overflow horizontally');
    assert.equal(home360Audit.fitsOneScreen, true, '360px Main Menu Hall should fit in 760px height');

    // Back to 390x844 for Level 2A & Level 2B flow checks
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });

    // 3. Level 2A: Standard Character Select — NO Daily banner, 3 hero tabs right under heading, Seed drawer collapsed by default
    const std390Audit = await cdp.evaluate(`(() => {
      document.getElementById('btn-menu-standard').click();
      const hasCharSelect = Boolean(document.getElementById('character-select-screen'));
      const hasDailyBannerInsideStd = Boolean(document.getElementById('daily-challenge-banner'));
      const headingRect = document.getElementById('char-select-heading').getBoundingClientRect();
      const tabsRect = document.getElementById('mobile-char-tabs').getBoundingClientRect();
      const hasBackBtn = Boolean(document.getElementById('btn-back-main-menu'));
      const seedToggle = document.getElementById('btn-toggle-seed-drawer');
      const seedCollapsedInitially =
        seedToggle?.getAttribute('aria-expanded') === 'false' &&
        !document.getElementById('char-seed-input');

      // Expand seed drawer, type custom seed, verify input opens cleanly
      seedToggle.click();
      const seedExpandedAfterClick =
        document.getElementById('btn-toggle-seed-drawer')?.getAttribute('aria-expanded') === 'true' &&
        Boolean(document.getElementById('char-seed-input'));
      const seedInput = document.getElementById('char-seed-input');
      seedInput.value = '123456';
      seedInput.dispatchEvent(new Event('input', { bubbles: true }));

      // Collapse again -> value preserved in label badge
      document.getElementById('btn-toggle-seed-drawer').click();
      const toggleLabelAfterCollapse = document.getElementById('btn-toggle-seed-drawer')?.textContent || '';

      // Back to Main Menu Hall
      document.getElementById('btn-back-main-menu').click();
      const returnedHome = Boolean(document.getElementById('main-menu-screen'));

      return {
        hasCharSelect,
        hasDailyBannerInsideStd,
        tabsRightBelowHeading: tabsRect.top >= headingRect.bottom - 2 && tabsRect.top - headingRect.bottom <= 48,
        hasBackBtn,
        seedCollapsedInitially,
        seedExpandedAfterClick,
        toggleLabelAfterCollapse,
        returnedHome,
        overflowX: document.documentElement.scrollWidth > window.innerWidth,
      };
    })()`);
    assert.equal(std390Audit.hasCharSelect, true);
    assert.equal(std390Audit.hasDailyBannerInsideStd, false, 'Standard Character Select must NOT contain Daily Challenge banner');
    assert.equal(std390Audit.tabsRightBelowHeading, true, '3 hero tabs must sit directly below the heading');
    assert.equal(std390Audit.hasBackBtn, true);
    assert.equal(std390Audit.seedCollapsedInitially, true, 'Seed input must be collapsed by default');
    assert.equal(std390Audit.seedExpandedAfterClick, true, 'Clicking seed toggle expands #char-seed-input');
    assert.ok(std390Audit.toggleLabelAfterCollapse.includes('123456'), std390Audit.toggleLabelAfterCollapse);
    assert.equal(std390Audit.returnedHome, true);
    assert.equal(std390Audit.overflowX, false);

    // 4. Level 2B: Dedicated Daily Challenge Screen
    const daily390Audit = await cdp.evaluate(`(() => {
      document.getElementById('btn-menu-daily').click();
      const hasDailyScreen = Boolean(document.getElementById('daily-challenge-screen'));
      const hasCopyLink = Boolean(document.getElementById('btn-copy-daily-link'));
      const detailCards = document.querySelectorAll('.daily-mod-detail-card').length;
      const overflowX = document.documentElement.scrollWidth > window.innerWidth;
      document.getElementById('btn-back-main-menu').click();
      const returnedHome = Boolean(document.getElementById('main-menu-screen'));
      return { hasDailyScreen, hasCopyLink, detailCards, overflowX, returnedHome };
    })()`);
    assert.equal(daily390Audit.hasDailyScreen, true);
    assert.equal(daily390Audit.hasCopyLink, true);
    assert.equal(daily390Audit.detailCards, 3);
    assert.equal(daily390Audit.overflowX, false);
    assert.equal(daily390Audit.returnedHome, true);

    // 5. Start seeded run from Standard -> open New Run -> Confirm -> Main Menu shows single Continue card with live summary
    const activeResumeAudit = await cdp.evaluate(`(() => {
      document.getElementById('btn-menu-standard').click();
      document.getElementById('btn-start-character-run').click();
      const st = window.__SPIRE_APP__.getState();
      const seededOk = st.seed === 123456;
      // Open mobile More menu -> New Run -> Confirm
      document.getElementById('btn-hud-more').click();
      document.getElementById('btn-new-run').click();
      document.getElementById('btn-confirm-new-run').click();
      const resumeBtns = document.querySelectorAll('[data-action="resume-active-run"]');
      const resumeText = resumeBtns[0]?.textContent || '';
      const overflowX = document.documentElement.scrollWidth > window.innerWidth;
      resumeBtns[0].click();
      const backInRun = Boolean(document.querySelector('.map-board'));
      return {
        seededOk,
        resumeCount: resumeBtns.length,
        resumeText,
        overflowX,
        backInRun,
      };
    })()`);
    assert.equal(activeResumeAudit.seededOk, true, 'Collapsed seed input value must still launch the seeded run');
    assert.equal(activeResumeAudit.resumeCount, 1, 'Main Menu must show exactly one deduplicated Continue Active Run button');
    assert.ok(activeResumeAudit.resumeText.includes('继续当前对局') && activeResumeAudit.resumeText.includes('铁甲战士'));
    assert.equal(activeResumeAudit.overflowX, false);
    assert.equal(activeResumeAudit.backInRun, true);

    const exceptions = cdp.events.filter((e) => e.method === 'Runtime.exceptionThrown');
    const consoleErrors = cdp.events.filter(
      (e) => e.method === 'Runtime.consoleAPICalled' && e.params?.type === 'error'
    );
    assert.equal(exceptions.length, 0, `Uncaught exceptions: ${JSON.stringify(exceptions)}`);
    assert.equal(consoleErrors.length, 0, `Console errors: ${JSON.stringify(consoleErrors)}`);

    cdp.ws.close();
  } finally {
    await teardownSession({ server, browser, cdp });
  }
});

test('E2E: Service Worker bypasses GitHub Pages max-age=600 HTTP cache and auto-updates returning tab across deploys', async (t) => {
  if (!resolveBrowserBinary()) {
    t.skip('No local Chromium/Chrome binary available');
    return;
  }
  let deployPhase = 'v1';
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
    let body = fs.readFileSync(fullPath);
    if (relPath === 'sw.js') {
      body = Buffer.from(
        body.toString('utf8').replace('__SW_CACHE_VERSION__', `test-${deployPhase}`),
        'utf8'
      );
    } else if (relPath === 'src/ui/screens/character_select.js' && deployPhase === 'v1') {
      body = Buffer.from(
        body.toString('utf8').replace('构筑专属牌组 · 运筹遗物协同 · 征服尖塔之巅', 'OLD_V1_SUBTITLE_MARKER'),
        'utf8'
      );
    }
    const etag = `"${deployPhase}-${relPath}"`;
    if (req.headers['if-none-match'] === etag) {
      res.writeHead(304, {
        'Cache-Control': 'max-age=600',
        ETag: etag,
      });
      res.end();
      return;
    }
    res.writeHead(200, {
      'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
      'Cache-Control': 'max-age=600',
      ETag: etag,
    });
    res.end(body);
  });
  await new Promise((resolve, reject) => {
    server.on('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  const port = server.address().port;

  let browser = null;
  let cdp = null;
  try {
    browser = await launchHeadlessChromium();
    const debugPort = new URL(browser.browserWsUrl).port;
    const targets = await (await fetch(`http://127.0.0.1:${debugPort}/json/list`)).json();
    const pageTarget = targets.find((x) => x.type === 'page');
    assert.ok(pageTarget);
    cdp = await createCdpClient(pageTarget.webSocketDebuggerUrl);
    await cdp.send('Runtime.enable');
    await cdp.send('Page.enable');

    // Visit during v1 with max-age=600 headers -> Wait until SW v1 activates and controls page
    const evalSafe = (expr) =>
      Promise.race([
        cdp.evaluate(expr).catch(() => null),
        new Promise((r) => setTimeout(() => r(null), 900)),
      ]);
    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${port}/index.html` });
    await new Promise((r) => setTimeout(r, 200));
    let v1Ready = false;
    for (let i = 0; i < 60; i += 1) {
      const ready = await evalSafe(`(async () => {
        const reg = await navigator.serviceWorker?.getRegistration?.();
        return Boolean(navigator.serviceWorker?.controller && reg?.active?.state === 'activated' && document.querySelector('.main-menu-subtitle'));
      })()`);
      if (ready) {
        v1Ready = true;
        break;
      }
      await new Promise((r) => setTimeout(r, 80));
    }
    assert.equal(v1Ready, true, 'Service Worker v1 must activate and control page');
    const v1Sub = await evalSafe(`document.querySelector('.main-menu-subtitle')?.textContent || ''`);
    assert.equal(v1Sub, 'OLD_V1_SUBTITLE_MARKER');

    // Simulate new GitHub Pages deployment (still returning Cache-Control: max-age=600!)
    deployPhase = 'v2';

    // Returning browser simply reloads WITHOUT clearing cache or opening incognito
    await cdp.send('Page.reload', { ignoreCache: false });
    await new Promise((r) => setTimeout(r, 200));
    let upgradedText = '';
    for (let i = 0; i < 60; i += 1) {
      const cur = await evalSafe(`document.querySelector('.main-menu-subtitle')?.textContent || ''`);
      if (cur) upgradedText = cur;
      if (upgradedText === '构筑专属牌组 · 运筹遗物协同 · 征服尖塔之巅') break;
      await new Promise((r) => setTimeout(r, 100));
    }
    assert.equal(
      upgradedText,
      '构筑专属牌组 · 运筹遗物协同 · 征服尖塔之巅',
      `Returning browser tab must auto-upgrade past max-age=600 SW cache, still got: ${upgradedText}`
    );

    cdp.ws.close();
  } finally {
    await teardownSession({ server, browser, cdp });
  }
});

test('E2E: Combat SVG Impact VFX, Attacker Lunge & Hit-Flash, Persistent Status/Stance Auras (0px Alignment), animSpeed=off & Bespoke Class Card Art', async (t) => {
  if (!resolveBrowserBinary()) {
    t.skip('No local Chromium/Chrome binary available');
    return;
  }
  const { server, port } = await startStaticServer();
  let browser = null;
  let cdp = null;

  try {
    browser = await launchHeadlessChromium();
    const debugPort = new URL(browser.browserWsUrl).port;
    const targetsResp = await fetch(`http://127.0.0.1:${debugPort}/json/list`);
    const targets = await targetsResp.json();
    const pageTarget = targets.find((x) => x.type === 'page');
    assert.ok(pageTarget);
    cdp = await createCdpClient(pageTarget.webSocketDebuggerUrl);
    await cdp.send('Runtime.enable');
    await cdp.send('Page.enable');

    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${port}/index.html` });
    await new Promise((r) => setTimeout(r, 420));

    // 1. Start Silent run -> enter F1 combat -> verify Silent bespoke Strike/Defend art + Poison/Block aura + SVG impact VFX + 0px alignment
    const silentAudit = await cdp.evaluate(`(() => {
      const app = window.__SPIRE_APP__;
      window.localStorage.clear();
      app.render();
      document.getElementById('btn-menu-standard')?.click();
      document.querySelector('[data-action="select-character"][data-character-id="silent"]')?.click();
      document.getElementById('btn-start-character-run')?.click();
      const st = app.getState();
      st.neowState = null;
      app.render();
      document.getElementById('map-node-f1_c0')?.click();

      const c = app.getState().combat;
      c.enemies = [c.enemies[0]];
      const enemy = c.enemies[0];
      enemy.hp = 80;
      enemy.maxHp = 80;
      enemy.block = 0;
      enemy.statuses = {};
      // Put bespoke Strike, Defend, Deadly Poison, and Shiv into hand
      c.hand = [
        { instanceId: 'fx_s1', cardId: 'strike', upgraded: false },
        { instanceId: 'fx_d1', cardId: 'defend', upgraded: false },
        { instanceId: 'fx_p1', cardId: 'deadly_poison', upgraded: false },
        { instanceId: 'fx_sh1', cardId: 'shiv', upgraded: false },
      ];
      app.getState().player.energy = 6;
      app.render();

      const strikeArt = document.querySelector('#hand-card-fx_s1 .card-art-svg')?.dataset?.cardArt || '';
      const defendArt = document.querySelector('#hand-card-fx_d1 .card-art-svg')?.dataset?.cardArt || '';

      // Play card cleanly (supports both 1-tap and 2-tap mobileTapConfirm modes)
      const playCard = (id) => {
        const el = document.getElementById('hand-card-' + id);
        el?.click();
        const stillThere = document.getElementById('hand-card-' + id);
        if (stillThere) stillThere.click();
      };

      playCard('fx_d1');
      const blockImpact = Boolean(document.querySelector('#spire-fx-layer .fx-impact-svg[data-fx-type="block"]'));
      const playerHasBlockAura = document.getElementById('player-unit')?.classList.contains('has-block');

      playCard('fx_p1');
      const poisonImpact = Boolean(document.querySelector('#spire-fx-layer .fx-impact-svg[data-fx-type="poison"]'));
      const enemyHasPoisonAura = document.getElementById('enemy-unit-' + enemy.id)?.classList.contains('is-poisoned');

      playCard('fx_sh1');
      const shivImpact = Boolean(document.querySelector('#spire-fx-layer .fx-impact-svg[data-fx-type="shiv"]'));
      const playerLunged = document.getElementById('player-unit')?.classList.contains('fx-lunge-right');
      const enemyHitFlashed = document.getElementById('enemy-unit-' + enemy.id)?.classList.contains('fx-hit-flash');

      // Check 0px vertical alignment on 390px mobile WITH persistent block + poison auras active!
      const pTop = document.getElementById('player-unit')?.getBoundingClientRect().top ?? -1;
      const eTop = document.getElementById('enemy-unit-' + enemy.id)?.getBoundingClientRect().top ?? -1;
      const mobileAlignDiff = Math.abs(pTop - eTop);
      const mobileOverflow = document.documentElement.scrollWidth - window.innerWidth;

      // Also verify Deck modal renders Silent's bespoke Strike/Defend art outside combat
      document.getElementById('btn-open-deck')?.click();
      const modalArtKeys = [...document.querySelectorAll('#modal-backdrop .card-art-svg')].map((el) => el.dataset.cardArt);
      document.querySelector('#modal-backdrop [data-action="close-modal"]')?.click();

      return {
        strikeArt,
        defendArt,
        blockImpact,
        playerHasBlockAura,
        poisonImpact,
        enemyHasPoisonAura,
        shivImpact,
        playerLunged,
        enemyHitFlashed,
        mobileAlignDiff,
        mobileOverflow,
        modalHasSilentStrike: modalArtKeys.includes('silent_shiv'),
        modalHasSilentDefend: modalArtKeys.includes('silent_cloak'),
      };
    })()`);

    assert.equal(silentAudit.strikeArt, 'silent_shiv', 'Silent Strike must use bespoke Silent dagger art');
    assert.equal(silentAudit.defendArt, 'silent_cloak', 'Silent Defend must use bespoke Silent cloak art');
    assert.equal(silentAudit.blockImpact, true, 'Playing Defend must spawn SVG block Aegis impact overlay');
    assert.equal(silentAudit.playerHasBlockAura, true, 'Player unit must gain persistent .has-block aura class');
    assert.equal(silentAudit.poisonImpact, true, 'Applying poison must spawn SVG venom splash overlay');
    assert.equal(silentAudit.enemyHasPoisonAura, true, 'Poisoned enemy must gain persistent .is-poisoned aura class');
    assert.equal(silentAudit.shivImpact, true, 'Playing Shiv must spawn SVG shiv dart streak overlay');
    assert.equal(silentAudit.playerLunged, true, 'Player unit must trigger attacker lunge animation (.fx-lunge-right)');
    assert.equal(silentAudit.enemyHitFlashed, true, 'Struck enemy must trigger hit-flash animation (.fx-hit-flash)');
    assert.ok(silentAudit.mobileAlignDiff <= 1, `Persistent status auras must preserve 0px mobile alignment, got diff=${silentAudit.mobileAlignDiff}px`);
    assert.ok(silentAudit.mobileOverflow <= 1, `Mobile combat with auras must have zero horizontal overflow, got ${silentAudit.mobileOverflow}px`);
    assert.equal(silentAudit.modalHasSilentStrike, true, 'Deck modal must render bespoke Silent Strike art');
    assert.equal(silentAudit.modalHasSilentDefend, true, 'Deck modal must render bespoke Silent Defend art');

    // 2. Verify Watcher bespoke Strike/Defend art + Wrath Stance SVG ring & animSpeed='off' suppression on Desktop 1280px
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 820,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await cdp.evaluate(`window.localStorage.clear();`);
    await cdp.send('Page.reload', { ignoreCache: true });
    for (let w = 0; w < 40; w += 1) {
      const ready = await cdp.evaluate(`Boolean(window.__SPIRE_APP__ && document.getElementById('btn-menu-standard'))`);
      if (ready) break;
      await new Promise((r) => setTimeout(r, 80));
    }
    const watcherAudit = await cdp.evaluate(`(() => {
      const app = window.__SPIRE_APP__;
      document.getElementById('btn-menu-standard')?.click();
      document.querySelector('[data-action="select-character"][data-character-id="watcher"]')?.click();
      document.getElementById('btn-start-character-run')?.click();
      const st = app.getState();
      st.neowState = null;
      app.render();
      document.getElementById('map-node-f1_c0')?.click();

      const c = app.getState().combat;
      c.enemies = [c.enemies[0]];
      const enemy = c.enemies[0];
      enemy.hp = 90;
      enemy.maxHp = 90;
      enemy.block = 0;
      enemy.statuses = {};
      c.hand = [
        { instanceId: 'wt_s1', cardId: 'strike', upgraded: false },
        { instanceId: 'wt_d1', cardId: 'defend', upgraded: false },
        { instanceId: 'wt_e1', cardId: 'eruption', upgraded: true },
      ];
      app.getState().player.energy = 5;
      app.render();

      const watcherStrikeArt = document.querySelector('#hand-card-wt_s1 .card-art-svg')?.dataset?.cardArt || '';
      const watcherDefendArt = document.querySelector('#hand-card-wt_d1 .card-art-svg')?.dataset?.cardArt || '';

      document.getElementById('hand-card-wt_e1')?.click();
      const stanceWrathFx = Boolean(document.querySelector('#spire-fx-layer .fx-impact-svg[data-fx-type="stance_wrath"]'));
      const playerWrathClass = document.getElementById('player-unit')?.classList.contains('stance-wrath');
      const pTop = document.getElementById('player-unit')?.getBoundingClientRect().top ?? -1;
      const eTop = document.getElementById('enemy-unit-' + enemy.id)?.getBoundingClientRect().top ?? -1;
      const desktopAlignDiff = Math.abs(pTop - eTop);

      // Turn animations OFF via Settings modal -> playing Strike spawns ZERO impact SVGs
      document.getElementById('spire-fx-layer').innerHTML = '';
      document.getElementById('btn-open-settings')?.click();
      document.querySelector('[data-action="set-anim-speed"][data-speed="off"]')?.click();
      document.querySelector('#modal-backdrop [data-action="close-modal"]')?.click();
      document.getElementById('hand-card-wt_s1')?.click();
      const fxCountWhenOff = document.querySelectorAll('#spire-fx-layer .fx-impact-svg').length;

      return {
        watcherStrikeArt,
        watcherDefendArt,
        stanceWrathFx,
        playerWrathClass,
        desktopAlignDiff,
        fxCountWhenOff,
      };
    })()`);

    assert.equal(watcherAudit.watcherStrikeArt, 'watcher_martial', 'Watcher Strike must use bespoke Watcher martial staff art');
    assert.equal(watcherAudit.watcherDefendArt, 'watcher_calm', 'Watcher Defend must use bespoke Watcher lotus calm art');
    assert.equal(watcherAudit.stanceWrathFx, true, 'Entering Wrath must spawn stance_wrath SVG burst');
    assert.equal(watcherAudit.playerWrathClass, true, 'Player unit must render persistent .stance-wrath aura class');
    assert.ok(watcherAudit.desktopAlignDiff <= 1, `Watcher stance aura must preserve 0px desktop alignment, got diff=${watcherAudit.desktopAlignDiff}px`);
    assert.equal(watcherAudit.fxCountWhenOff, 0, 'Setting animSpeed=off must suppress all combat SVG impact overlays');

    cdp.ws.close();
  } finally {
    await teardownSession({ server, browser, cdp });
  }
});

test('E2E: Bespoke Relic SVGs across Character Select, 390px Mobile HUD, Reward, Boss Altar, Shop, Campfire, Upgrade Reveal & Compendium', async (t) => {
  if (!resolveBrowserBinary()) {
    t.skip('No local Chromium/Chrome binary available');
    return;
  }
  const { server, port } = await startStaticServer();
  let browser = null;
  let cdp = null;

  try {
    browser = await launchHeadlessChromium();
    const debugPort = new URL(browser.browserWsUrl).port;
    const targetsResp = await fetch(`http://127.0.0.1:${debugPort}/json/list`);
    const targets = await targetsResp.json();
    const pageTarget = targets.find((x) => x.type === 'page');
    assert.ok(pageTarget);
    cdp = await createCdpClient(pageTarget.webSocketDebuggerUrl);
    await cdp.send('Runtime.enable');
    await cdp.send('Page.enable');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 820,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${port}/index.html` });
    await new Promise((r) => setTimeout(r, 420));

    // 1. Desktop: Character Select starter relic SVGs + Daily Challenge inline starter relic SVG
    const preRunAudit = await cdp.evaluate(`(() => {
      window.localStorage.clear();
      window.__SPIRE_APP__.render();
      document.getElementById('btn-menu-standard')?.click();
      const charRelicSvgs = ['ironclad', 'silent', 'watcher'].map((cid) => {
        const svg = document.querySelector('#char-card-' + cid + ' .relic-badge svg.relic-svg');
        const rect = svg ? svg.getBoundingClientRect() : null;
        return {
          cid,
          key: svg?.dataset?.relicSvg || '',
          w: rect ? Math.round(rect.width) : 0,
          h: rect ? Math.round(rect.height) : 0,
        };
      });
      document.getElementById('btn-back-main-menu')?.click();
      document.getElementById('btn-menu-daily')?.click();
      const dailySvg = document.querySelector('#daily-challenge-screen svg.relic-svg');
      const dailyRect = dailySvg ? dailySvg.getBoundingClientRect() : null;
      return {
        charRelicSvgs,
        dailyKey: dailySvg?.dataset?.relicSvg || '',
        dailyW: dailyRect ? Math.round(dailyRect.width) : 0,
      };
    })()`);

    assert.deepEqual(
      preRunAudit.charRelicSvgs.map((x) => x.key),
      ['burning_blood', 'ring_of_the_snake', 'pure_water'],
      'Standard Character Select must render bespoke starter relic SVGs for all 3 heroes'
    );
    for (const item of preRunAudit.charRelicSvgs) {
      assert.ok(item.w >= 16 && item.h >= 16, `Character ${item.cid} starter relic SVG must be visible, got ${item.w}x${item.h}`);
    }
    assert.ok(preRunAudit.dailyKey.length > 0 && preRunAudit.dailyW >= 14, `Daily Challenge must render starter relic SVG, got ${preRunAudit.dailyKey} (${preRunAudit.dailyW}px)`);

    // 2. Desktop: Start run -> verify Boss Relic Altar, Shop, Campfire, War Paint Reveal Modal & Compendium (zero duplicate SVG IDs!)
    const desktopScreensAudit = await cdp.evaluate(`(() => {
      const app = window.__SPIRE_APP__;
      document.getElementById('btn-back-main-menu')?.click();
      document.getElementById('btn-menu-standard')?.click();
      document.getElementById('btn-start-character-run')?.click();
      const st = app.getState();
      st.neowState = null;
      st.player.gold = 999;
      st.player.relics = [
        'burning_blood', 'vajra', 'akabeko', 'shuriken', 'torii',
        'membership_card', 'golden_idol', 'snecko_eye', 'girya', 'shovel', 'peace_pipe',
      ];

      // 2a. Boss Relic Altar
      st.screen = 'boss_reward';
      st.bossReward = {
        actCleared: 1,
        bossGold: 100,
        cardChoices: [],
        cardClaimed: true,
        pickedCardId: null,
        relicChoices: ['velvet_choker', 'runic_pyramid', 'black_star'],
        pickedRelicId: null,
      };
      app.render();
      const bossKeys = [...document.querySelectorAll('.boss-relic-card .boss-relic-art svg.relic-svg')].map((el) => ({
        key: el.dataset.relicSvg,
        w: Math.round(el.getBoundingClientRect().width),
      }));

      // 2b. Merchant Shop
      st.screen = 'shop';
      st.shop = {
        cards: [],
        colorlessCards: [],
        relicOffer: { relicId: 'whetstone', price: 150, sold: false },
        shopRelicOffer: { relicId: 'clockwork_souvenir', price: 160, sold: false },
        potionOffer: null,
        purgeCost: 75,
        purgeUsed: false,
        mealTicketHealed: 0,
      };
      app.render();
      const shopRelicKey = document.querySelector('#btn-buy-relic svg.relic-svg')?.dataset?.relicSvg || '';
      const shopExKey = document.querySelector('#btn-buy-shop-relic svg.relic-svg')?.dataset?.relicSvg || '';

      // 2c. Campfire with Girya, Shovel & Peace Pipe
      st.screen = 'rest';
      st.restState = { completed: false };
      app.render();
      const restKeys = [
        document.querySelector('#btn-rest-lift svg.relic-svg')?.dataset?.relicSvg || '',
        document.querySelector('#btn-rest-dig svg.relic-svg')?.dataset?.relicSvg || '',
        document.querySelector('#btn-rest-toke svg.relic-svg')?.dataset?.relicSvg || '',
      ];

      // 2d. Combat Reward / Campfire Dig relic plaque
      st.screen = 'reward';
      st.reward = {
        source: 'campfire_dig',
        gold: 0,
        goldClaimed: true,
        relicId: 'war_paint',
        relicClaimed: false,
        extraRelicId: 'calipers',
        extraRelicClaimed: false,
        potionId: null,
        potionClaimed: true,
        cardChoices: [],
        cardClaimed: true,
      };
      app.render();
      const rewardSvg = document.querySelector('#btn-claim-relic .loot-badge-relic svg.relic-svg');
      const extraRewardSvg = document.querySelector('#btn-claim-extra-relic .loot-badge-relic svg.relic-svg');
      const rewardKey = rewardSvg?.dataset?.relicSvg || '';
      const rewardW = rewardSvg ? Math.round(rewardSvg.getBoundingClientRect().width) : 0;
      const extraRewardKey = extraRewardSvg?.dataset?.relicSvg || '';

      // Claim War Paint -> triggers Relic Upgrade Reveal modal with bespoke war_paint SVG
      document.getElementById('btn-claim-relic')?.click();
      const revealSvg = document.querySelector('#relic-upgrade-reveal-modal .relic-modal-icon svg.relic-svg');
      const revealKey = revealSvg?.dataset?.relicSvg || '';
      const revealW = revealSvg ? Math.round(revealSvg.getBoundingClientRect().width) : 0;
      document.getElementById('btn-close-upgrade-reveal')?.click();

      // 2e. Compendium Relics tab open simultaneously with HUD -> verify discovered + undiscovered SVGs & zero duplicate SVG gradient IDs!
      document.getElementById('btn-open-compendium')?.click();
      document.getElementById('btn-comp-tab-relics')?.click();
      const compDiscoveredCount = document.querySelectorAll('#compendium-relics-grid article[data-discovered="true"] svg.relic-svg').length;
      const compUndiscoveredCount = document.querySelectorAll('#compendium-relics-grid article[data-discovered="false"] svg[data-relic-svg="undiscovered"]').length;
      const allSvgDefIds = [...document.querySelectorAll('svg defs [id]')].map((el) => el.id);
      const uniqueDefIds = new Set(allSvgDefIds).size;
      document.querySelector('#modal-backdrop [data-action="close-modal"]')?.click();

      return {
        bossKeys,
        shopRelicKey,
        shopExKey,
        restKeys,
        rewardKey,
        rewardW,
        extraRewardKey,
        revealKey,
        revealW,
        compDiscoveredCount,
        compUndiscoveredCount,
        dupSvgDefIds: allSvgDefIds.length - uniqueDefIds,
      };
    })()`);

    assert.deepEqual(
      desktopScreensAudit.bossKeys.map((x) => x.key),
      ['velvet_choker', 'runic_pyramid', 'black_star'],
      'Boss Relic Altar must render bespoke SVGs for all 3 offered boss relics'
    );
    assert.ok(desktopScreensAudit.bossKeys.every((x) => x.w >= 32), 'Boss Relic Altar SVGs must render >=32px');
    assert.equal(desktopScreensAudit.shopRelicKey, 'whetstone', 'Shop general relic must render bespoke whetstone SVG');
    assert.equal(desktopScreensAudit.shopExKey, 'clockwork_souvenir', 'Shop exclusive relic must render bespoke clockwork_souvenir SVG');
    assert.deepEqual(desktopScreensAudit.restKeys, ['girya', 'shovel', 'peace_pipe'], 'Campfire relic actions must render bespoke Girya, Shovel & Peace Pipe SVGs');
    assert.equal(desktopScreensAudit.rewardKey, 'war_paint', 'Reward relic plaque must render bespoke war_paint SVG');
    assert.ok(desktopScreensAudit.rewardW >= 32, `Desktop reward relic SVG must be >=32px, got ${desktopScreensAudit.rewardW}px`);
    assert.equal(desktopScreensAudit.extraRewardKey, 'calipers', 'Black Star extra reward plaque must render bespoke calipers SVG');
    assert.equal(desktopScreensAudit.revealKey, 'war_paint', 'Upgrade reveal modal must render bespoke war_paint SVG');
    assert.ok(desktopScreensAudit.revealW >= 28, `Upgrade reveal modal relic SVG must be >=28px, got ${desktopScreensAudit.revealW}px`);
    assert.ok(desktopScreensAudit.compDiscoveredCount >= 1, 'Compendium Relics tab must render bespoke discovered relic SVGs');
    assert.ok(desktopScreensAudit.compUndiscoveredCount >= 1, 'Compendium Relics tab must render undiscovered silhouette SVGs');
    assert.equal(desktopScreensAudit.dupSvgDefIds, 0, 'Simultaneous HUD + Compendium relic SVGs must have zero duplicate gradient IDs');

    // 3. 390px Mobile: 12 equipped relics in top HUD + Reward screen -> crisp tiles <=34px & zero horizontal overflow
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await new Promise((r) => setTimeout(r, 120));
    const mobileAudit = await cdp.evaluate(`(() => {
      const app = window.__SPIRE_APP__;
      app.render();
      const hudBadges = [...document.querySelectorAll('.top-hud .relic-badge')];
      const maxBadgeW = Math.max(...hudBadges.map((el) => Math.round(el.getBoundingClientRect().width)));
      const maxBadgeH = Math.max(...hudBadges.map((el) => Math.round(el.getBoundingClientRect().height)));
      const hudSvgs = [...document.querySelectorAll('.top-hud .relic-badge svg.relic-svg')];
      const minSvgW = Math.min(...hudSvgs.map((el) => Math.round(el.getBoundingClientRect().width)));
      const mobileOverflow = document.documentElement.scrollWidth - window.innerWidth;
      return {
        badgeCount: hudBadges.length,
        svgCount: hudSvgs.length,
        maxBadgeW,
        maxBadgeH,
        minSvgW,
        mobileOverflow,
      };
    })()`);

    assert.ok(mobileAudit.badgeCount >= 11 && mobileAudit.svgCount === mobileAudit.badgeCount, `Every mobile HUD relic badge must render a bespoke SVG (${mobileAudit.svgCount}/${mobileAudit.badgeCount})`);
    assert.ok(mobileAudit.maxBadgeW <= 34 && mobileAudit.maxBadgeH <= 34, `Mobile HUD relic badges must remain compact <=34px, got ${mobileAudit.maxBadgeW}x${mobileAudit.maxBadgeH}`);
    assert.ok(mobileAudit.minSvgW >= 20, `Mobile HUD relic SVGs must stay crisp >=20px, got ${mobileAudit.minSvgW}px`);
    assert.ok(mobileAudit.mobileOverflow <= 1, `390px mobile screen with 12 relic SVGs must have zero horizontal overflow, got ${mobileAudit.mobileOverflow}px`);

    cdp.ws.close();
  } finally {
    await teardownSession({ server, browser, cdp });
  }
});

test('E2E: Event & Relic card-upgrade smith audio parity + Combat Buff/Debuff SVG icon chips (Desktop & 390px Mobile)', async (t) => {
  if (!resolveBrowserBinary()) {
    t.skip('No local Chromium/Chrome binary available');
    return;
  }
  const { server, port } = await startStaticServer();
  let browser = null;
  let cdp = null;

  try {
    browser = await launchHeadlessChromium();
    const debugPort = new URL(browser.browserWsUrl).port;
    const targetsResp = await fetch(`http://127.0.0.1:${debugPort}/json/list`);
    const targets = await targetsResp.json();
    const pageTarget = targets.find((x) => x.type === 'page');
    assert.ok(pageTarget);
    cdp = await createCdpClient(pageTarget.webSocketDebuggerUrl);
    await cdp.send('Runtime.enable');
    await cdp.send('Page.enable');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 820,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${port}/index.html` });
    await new Promise((r) => setTimeout(r, 420));

    // 1. Verify smith audio parity across Campfire, War Paint (Reward), Whetstone (Shop), and Events (direct + interactive)
    const audioAudit = await cdp.evaluate(`(() => {
      const app = window.__SPIRE_APP__;
      window.localStorage.clear();
      app.render();
      document.getElementById('btn-menu-standard')?.click();
      document.getElementById('btn-start-character-run')?.click();
      const st = app.getState();
      st.neowState = null;
      st.player.gold = 999;

      // 1a. Campfire Smith baseline
      st.screen = 'rest';
      st.restState = { completed: false };
      app.render();
      app.clearRecentAudioCues();
      document.getElementById('btn-rest-smith')?.click();
      document.querySelector('#modal-backdrop [data-action="confirm-smith"]')?.click();
      const campfireCue = app.getLastAudioCue();

      // 1b. War Paint claimed from Reward -> smith cue!
      st.screen = 'reward';
      st.reward = {
        source: 'combat',
        gold: 0,
        goldClaimed: true,
        relicId: 'war_paint',
        relicClaimed: false,
        extraRelicId: null,
        extraRelicClaimed: true,
        potionId: null,
        potionClaimed: true,
        cardChoices: [],
        cardClaimed: true,
      };
      app.render();
      app.clearRecentAudioCues();
      document.getElementById('btn-claim-relic')?.click();
      const warPaintCue = app.getLastAudioCue();
      document.getElementById('btn-close-upgrade-reveal')?.click();

      // 1c. Whetstone bought in Shop -> smith cue!
      st.screen = 'shop';
      st.shop = {
        cards: [],
        colorlessCards: [],
        relicOffer: { relicId: 'whetstone', price: 150, sold: false },
        shopRelicOffer: null,
        potionOffer: null,
        purgeCost: 75,
        purgeUsed: false,
        mealTicketHealed: 0,
      };
      app.render();
      app.clearRecentAudioCues();
      document.getElementById('btn-buy-relic')?.click();
      const whetstoneCue = app.getLastAudioCue();
      document.getElementById('btn-close-upgrade-reveal')?.click();

      // 1d. Direct Event upgrade (Shining Light -> enter_light) -> smith cue!
      st.screen = 'event';
      st.eventState = { eventId: 'shining_light', resolved: false, outcomeText: '', upgradedCardIds: [] };
      app.render();
      app.clearRecentAudioCues();
      document.querySelector('[data-action="choose-event"][data-choice-id="enter_light"]')?.click();
      const directEventCue = app.getLastAudioCue();

      // 1e. Interactive Event upgrade (Living Wall -> wall_grow -> pick card) -> smith cue!
      st.screen = 'event';
      st.eventState = { eventId: 'living_wall', resolved: false, outcomeText: '', upgradedCardIds: [] };
      app.render();
      app.clearRecentAudioCues();
      document.querySelector('[data-action="choose-event"][data-choice-id="wall_grow"]')?.click();
      document.querySelector('[data-action="confirm-event-card-action"]')?.click();
      const interactiveEventCue = app.getLastAudioCue();

      return { campfireCue, warPaintCue, whetstoneCue, directEventCue, interactiveEventCue };
    })()`);

    assert.equal(audioAudit.campfireCue, 'smith', 'Campfire smith must play smith cue');
    assert.equal(audioAudit.warPaintCue, 'smith', 'War Paint relic upgrade must play identical smith cue');
    assert.equal(audioAudit.whetstoneCue, 'smith', 'Whetstone shop relic upgrade must play identical smith cue');
    assert.equal(audioAudit.directEventCue, 'smith', 'Direct Event card upgrade (Shining Light) must play identical smith cue');
    assert.equal(audioAudit.interactiveEventCue, 'smith', 'Interactive Event card upgrade (Living Wall) must play identical smith cue');

    // 2. Combat Buff/Debuff SVG Icon Chips (Desktop 1280px) + Glossary Visual Legend
    const desktopStatusAudit = await cdp.evaluate(`(() => {
      const app = window.__SPIRE_APP__;
      const st = app.getState();
      st.screen = 'map';
      app.render();
      document.getElementById('map-node-f1_c0')?.click();

      const c = app.getState().combat;
      c.enemies = [c.enemies[0]];
      const enemy = c.enemies[0];
      app.getState().player.statuses = {
        strength: 3,
        dexterity: -2,
        vulnerable: 1,
        artifact: 1,
        barricade: 1,
        metallicize: 4,
      };
      enemy.statuses = {
        strength: -1,
        poison: 6,
        weak: 1,
        flight: 3,
        malleable: 3,
        slow: 1,
      };
      enemy.slowStacks = 3;
      app.render();

      const allChips = [...document.querySelectorAll('.status-chip')];
      const anyChineseText = allChips.some((el) => /[\u4e00-\u9fff]/.test(el.textContent || ''));
      const allHaveLargeFramelessSvg = allChips.every((el) => {
        const svg = el.querySelector('svg.status-svg');
        const r = svg ? svg.getBoundingClientRect() : null;
        const cs = getComputedStyle(el);
        const frameless = cs.borderTopWidth === '0px' && cs.backgroundColor === 'rgba(0, 0, 0, 0)';
        const isDebuff = el.classList.contains('debuff');
        const polMatch = svg?.dataset?.statusPolarity === (isDebuff ? 'debuff' : 'buff');
        return Boolean(svg?.dataset?.statusSvg && r && r.width >= 24 && r.height >= 24 && frameless && polMatch);
      });
      const negDexSvg = document.querySelector('#player-unit .status-chip[data-status-key="dexterity"] svg.status-svg')?.dataset?.statusSvg || '';
      const negStrSvg = document.querySelector('.enemy-side .status-chip[data-status-key="strength"] svg.status-svg')?.dataset?.statusSvg || '';
      const negStrVal = document.querySelector('.enemy-side .status-chip[data-status-key="strength"] .status-val')?.textContent?.trim() || '';
      const barricadeChip = document.querySelector('#player-unit .status-chip[data-status-key="barricade"]');
      const barricadeIconOnly = Boolean(barricadeChip?.classList.contains('icon-only') && (barricadeChip.textContent || '').trim() === '');
      const vuln1Chip = document.querySelector('#player-unit .status-chip[data-status-key="vulnerable"]');
      const vuln1Omitted = Boolean(vuln1Chip?.classList.contains('icon-only') && !vuln1Chip.querySelector('.status-val') && (vuln1Chip.textContent || '').trim() === '');
      const artifact1Chip = document.querySelector('#player-unit .status-chip[data-status-key="artifact"]');
      const artifact1Omitted = Boolean(artifact1Chip?.classList.contains('icon-only') && !artifact1Chip.querySelector('.status-val'));
      const weak1Chip = document.querySelector('.enemy-side .status-chip[data-status-key="weak"]');
      const weak1Omitted = Boolean(weak1Chip?.classList.contains('icon-only') && !weak1Chip.querySelector('.status-val'));
      const slowVal = document.querySelector('.enemy-side .status-chip[data-status-key="slow"] .status-val')?.textContent?.trim() || '';

      // Tap player Dexterity debuff chip -> verifies rich Chinese tooltip preserved!
      const dexChip = document.querySelector('#player-unit .status-chip[data-status-key="dexterity"]');
      dexChip?.click();
      const tipOpen = !document.getElementById('spire-tooltip').hidden;
      const tipTitle = document.querySelector('#spire-tooltip .spire-tooltip-title')?.textContent?.trim() || '';
      dexChip?.click();

      // Open Glossary modal simultaneously -> verify matching status SVG icons & zero duplicate SVG gradient IDs!
      document.getElementById('btn-open-help')?.click();
      document.querySelector('[data-action="set-glossary-cat"][data-category="buffs"]')?.click();
      const glossIconsCount = document.querySelectorAll('.glossary-status-icon svg.status-svg').length;
      const statusDefIds = [...document.querySelectorAll('svg.status-svg defs [id]')].map((el) => el.id);
      const dupDefIds = statusDefIds.length - new Set(statusDefIds).size;
      document.querySelector('#modal-backdrop [data-action="close-modal"]')?.click();

      const pTop = document.getElementById('player-unit')?.getBoundingClientRect().top ?? -1;
      const eTop = document.getElementById('enemy-unit-' + enemy.id)?.getBoundingClientRect().top ?? -1;

      return {
        chipCount: allChips.length,
        anyChineseText,
        allHaveLargeFramelessSvg,
        negDexSvg,
        negStrSvg,
        negStrVal,
        barricadeIconOnly,
        vuln1Omitted,
        artifact1Omitted,
        weak1Omitted,
        slowVal,
        tipOpen,
        tipTitle,
        glossIconsCount,
        dupDefIds,
        desktopAlignDiff: Math.abs(pTop - eTop),
      };
    })()`);

    assert.equal(desktopStatusAudit.chipCount, 12, 'Expected 6 player + 6 enemy status SVG chips');
    assert.equal(desktopStatusAudit.anyChineseText, false, 'Combat status chips must replace Chinese labels with SVG icons');
    assert.equal(desktopStatusAudit.allHaveLargeFramelessSvg, true, 'Every combat status chip must render a frameless >=24px polarity-coded SVG badge');
    assert.equal(desktopStatusAudit.negDexSvg, 'dexterity_down', 'Negative Dexterity must render dedicated dexterity_down SVG');
    assert.equal(desktopStatusAudit.negStrSvg, 'strength_down', 'Negative Strength must render dedicated strength_down SVG');
    assert.equal(desktopStatusAudit.negStrVal, '-1', 'Negative -1 status must keep its -1 stack counter (only positive 1 is omitted)');
    assert.equal(desktopStatusAudit.barricadeIconOnly, true, 'Boolean flag status (Barricade) must render icon-only without 1');
    assert.equal(desktopStatusAudit.vuln1Omitted, true, 'Single-stack Vulnerable (1) must omit trailing 1');
    assert.equal(desktopStatusAudit.artifact1Omitted, true, 'Single-stack Artifact (1) must omit trailing 1');
    assert.equal(desktopStatusAudit.weak1Omitted, true, 'Single-stack Weak (1) must omit trailing 1');
    assert.equal(desktopStatusAudit.slowVal, '+30%', 'Slow status must keep its +30% stack counter beside SVG icon');
    assert.equal(desktopStatusAudit.tipOpen, true, 'Tapping SVG status chip must open full Chinese tooltip');
    assert.ok(desktopStatusAudit.tipTitle.includes('敏捷 (-2)'), `Expected tooltip title 敏捷 (-2), got ${desktopStatusAudit.tipTitle}`);
    assert.ok(desktopStatusAudit.glossIconsCount >= 40, `Glossary buffs tab must display matching status SVG icons, got ${desktopStatusAudit.glossIconsCount}`);
    assert.equal(desktopStatusAudit.dupDefIds, 0, 'Simultaneous Player + Enemy + Glossary status SVGs must have zero duplicate gradient IDs');
    assert.ok(desktopStatusAudit.desktopAlignDiff <= 1, `Desktop player/enemy cards must remain top-aligned, got diff=${desktopStatusAudit.desktopAlignDiff}px`);

    // 3. 390px Mobile: Enlarged frameless >=22px SVG status badges with 0px alignment & zero horizontal overflow
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await new Promise((r) => setTimeout(r, 120));
    const mobileStatusAudit = await cdp.evaluate(`(() => {
      const app = window.__SPIRE_APP__;
      app.render();
      const enemyId = app.getState().combat.enemies[0].id;
      const pTop = document.getElementById('player-unit')?.getBoundingClientRect().top ?? -1;
      const eTop = document.getElementById('enemy-unit-' + enemyId)?.getBoundingClientRect().top ?? -1;
      const svgs = [...document.querySelectorAll('.status-chip svg.status-svg')];
      const minW = Math.min(...svgs.map((el) => Math.round(el.getBoundingClientRect().width)));
      const overflow = document.documentElement.scrollWidth - window.innerWidth;
      return {
        alignDiff: Math.abs(pTop - eTop),
        minW,
        overflow,
      };
    })()`);

    assert.ok(mobileStatusAudit.alignDiff <= 1, `390px mobile status SVG chips must keep 0px alignment, got diff=${mobileStatusAudit.alignDiff}px`);
    assert.ok(mobileStatusAudit.minW >= 22, `390px mobile frameless status SVGs must remain crisp >=22px, got ${mobileStatusAudit.minW}px`);
    assert.ok(mobileStatusAudit.overflow <= 1, `390px mobile combat with 12 status SVG chips must have zero horizontal overflow, got ${mobileStatusAudit.overflow}px`);

    cdp.ws.close();
  } finally {
    await teardownSession({ server, browser, cdp });
  }
});

test('E2E: Distinct Bespoke Potion SVGs (HUD/Reward/Shop/Compendium/CharSelect) + Dead Enemy Battlefield Cleanup & Minion Flee Victory', async (t) => {
  if (!resolveBrowserBinary()) {
    t.skip('No local Chromium/Chrome binary available');
    return;
  }
  const { server, port } = await startStaticServer();
  let browser = null;
  let cdp = null;

  try {
    browser = await launchHeadlessChromium();
    const debugPort = new URL(browser.browserWsUrl).port;
    const targetsResp = await fetch(`http://127.0.0.1:${debugPort}/json/list`);
    const targets = await targetsResp.json();
    const pageTarget = targets.find((x) => x.type === 'page');
    assert.ok(pageTarget);
    cdp = await createCdpClient(pageTarget.webSocketDebuggerUrl);
    await cdp.send('Runtime.enable');
    await cdp.send('Page.enable');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 820,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${port}/index.html` });
    await new Promise((r) => setTimeout(r, 420));

    // 1. Desktop: Character Select starter potions + HUD duplicate potions (zero dup IDs) + Reward + Shop + Compendium Potions tab
    const potionUiAudit = await cdp.evaluate(`(() => {
      const app = window.__SPIRE_APP__;
      window.localStorage.clear();
      app.render();
      document.getElementById('btn-menu-standard')?.click();
      const charPotionIcons = ['ironclad', 'silent', 'watcher'].map(
        (cid) => document.querySelector('#char-card-' + cid + ' .char-potion-pill svg.potion-icon-svg')?.dataset?.potionIcon || ''
      );

      document.getElementById('btn-start-character-run')?.click();
      const st = app.getState();
      st.neowState = null;
      st.player.gold = 999;
      st.player.potions = ['duplication_potion', 'duplication_potion', 'ghost_in_a_jar'];

      // Reward plaque
      st.screen = 'reward';
      st.reward = {
        source: 'combat',
        gold: 0,
        goldClaimed: true,
        relicId: null,
        relicClaimed: true,
        extraRelicId: null,
        extraRelicClaimed: true,
        potionId: 'stance_potion',
        potionClaimed: false,
        cardChoices: [],
        cardClaimed: true,
      };
      app.render();
      const rewardPotionIcon = document.querySelector('#btn-claim-potion svg[data-loot-icon="potion"]')?.dataset?.potionIcon || '';

      // Shop shelf
      st.screen = 'shop';
      st.shop = {
        cards: [],
        colorlessCards: [],
        relicOffer: null,
        shopRelicOffer: null,
        potionOffer: { potionId: 'gamblers_brew', price: 50, sold: false },
        purgeCost: 75,
        purgeUsed: false,
        mealTicketHealed: 0,
      };
      app.render();
      const shopPotionIcon = document.querySelector('#btn-buy-potion svg.potion-icon-svg')?.dataset?.potionIcon || '';

      // Compendium Potions tab open simultaneously with duplicate HUD potions -> zero duplicate gradient IDs!
      document.getElementById('btn-open-compendium')?.click();
      document.getElementById('btn-comp-tab-potions')?.click();
      const compDiscoveredPotions = document.querySelectorAll('#compendium-potions-grid article[data-discovered="true"] svg.potion-icon-svg').length;
      const compUndiscoveredPotions = document.querySelectorAll('#compendium-potions-grid article[data-discovered="false"] svg[data-potion-icon="undiscovered"]').length;
      const potDefIds = [...document.querySelectorAll('svg.potion-icon-svg defs [id]')].map((el) => el.id);
      const dupPotDefIds = potDefIds.length - new Set(potDefIds).size;
      document.querySelector('#modal-backdrop [data-action="close-modal"]')?.click();

      return {
        charPotionIcons,
        rewardPotionIcon,
        shopPotionIcon,
        compDiscoveredPotions,
        compUndiscoveredPotions,
        dupPotDefIds,
      };
    })()`);

    assert.deepEqual(
      potionUiAudit.charPotionIcons,
      ['fire_potion', 'poison_potion', 'miracle_potion'],
      'Character Select must render bespoke starter potion SVGs for all 3 classes'
    );
    assert.equal(potionUiAudit.rewardPotionIcon, 'stance_potion', 'Reward plaque must render bespoke stance_potion SVG');
    assert.equal(potionUiAudit.shopPotionIcon, 'gamblers_brew', 'Shop shelf must render bespoke gamblers_brew SVG');
    assert.ok(potionUiAudit.compDiscoveredPotions >= 1, 'Compendium Potions tab must render bespoke discovered potion SVGs');
    assert.ok(potionUiAudit.compUndiscoveredPotions >= 1, 'Compendium Potions tab must render undiscovered potion silhouettes');
    assert.equal(potionUiAudit.dupPotDefIds, 0, 'Duplicate HUD potions + Compendium potions must have zero duplicate SVG gradient IDs');

    // 2. 390px Mobile: Gremlin Leader Elite -> Minion tags, Dead Enemy removed from battlefield immediately, and Leader death causes surviving minions to flee for immediate victory!
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await new Promise((r) => setTimeout(r, 120));

    const minionBattleAudit = await cdp.evaluate(`(() => {
      const app = window.__SPIRE_APP__;
      const st = app.getState();
      st.screen = 'map';
      app.render();
      document.getElementById('map-node-f1_c0')?.click();

      // Build an authentic Gremlin Leader + 2 Mad Gremlin minions encounter
      const c = app.getState().combat;
      const baseTemplate = structuredClone(c.enemies[0]);
      c.enemies = [
        { ...structuredClone(baseTemplate), id: 'mg_1', templateId: 'mad_gremlin', name: '狂怒地精 A', artKey: 'mad_gremlin', hp: 5, maxHp: 17, block: 0, isMinion: true, statuses: { angry: 1 } },
        { ...structuredClone(baseTemplate), id: 'gl_boss', templateId: 'gremlin_leader', name: '地精首领', artKey: 'gremlin_leader', hp: 5, maxHp: 143, block: 0, isMinion: false, statuses: {} },
        { ...structuredClone(baseTemplate), id: 'mg_2', templateId: 'mad_gremlin', name: '狂怒地精 B', artKey: 'mad_gremlin', hp: 17, maxHp: 17, block: 0, isMinion: true, statuses: { angry: 1 } },
      ];
      c.hadNonMinionEnemy = true;
      c.defeatedEnemiesCount = 0;
      c.hand = [
        { instanceId: 'kill_m1', cardId: 'strike', upgraded: true },
        { instanceId: 'kill_gl', cardId: 'strike', upgraded: true },
      ];
      app.getState().player.energy = 5;
      app.render();

      const initialEnemyDomCount = document.querySelectorAll('.enemy-side .fighter-unit').length;
      const minionTagCount = document.querySelectorAll('.enemy-side .minion-tag').length;
      const leaderHasMinionTag = Boolean(document.querySelector('#enemy-unit-gl_boss .minion-tag'));

      // Kill minion mg_1 -> must immediately disappear from DOM (zero dead corpses left!)
      document.getElementById('hand-card-kill_m1')?.click();
      document.getElementById('enemy-unit-mg_1')?.click();
      const afterMinionKillDomCount = document.querySelectorAll('.enemy-side .fighter-unit').length;
      const deadDomCountAfterMinionKill = document.querySelectorAll('.enemy-side .fighter-unit.dead').length;
      const stillInCombatAfterMinionKill = app.getState().screen === 'combat';

      // Kill Gremlin Leader while mg_2 is still at 17/17 HP -> mg_2 must flee & combat transitions IMMEDIATELY to reward!
      document.getElementById('hand-card-kill_gl')?.click();
      document.getElementById('enemy-unit-gl_boss')?.click();
      const screenAfterLeaderKill = app.getState().screen;
      const combatStatusAfterLeaderKill = app.getState().combat?.status || '';
      const fledLogs = (app.getState().combat?.logs || []).map((l) => l.message || l.text || '').join(' | ');

      return {
        initialEnemyDomCount,
        minionTagCount,
        leaderHasMinionTag,
        afterMinionKillDomCount,
        deadDomCountAfterMinionKill,
        stillInCombatAfterMinionKill,
        screenAfterLeaderKill,
        combatStatusAfterLeaderKill,
        hasFleeLog: fledLogs.includes('仓皇逃窜'),
      };
    })()`);

    assert.equal(minionBattleAudit.initialEnemyDomCount, 3, 'Initial encounter renders Leader + 2 minions');
    assert.equal(minionBattleAudit.minionTagCount, 2, 'Both Mad Gremlins must display the 爪牙 Minion badge');
    assert.equal(minionBattleAudit.leaderHasMinionTag, false, 'Gremlin Leader must not display 爪牙 badge');
    assert.equal(minionBattleAudit.afterMinionKillDomCount, 2, 'Killed minion must be removed immediately from battlefield DOM');
    assert.equal(minionBattleAudit.deadDomCountAfterMinionKill, 0, 'Zero dead enemy corpses may remain on battlefield');
    assert.equal(minionBattleAudit.stillInCombatAfterMinionKill, true, 'Killing a minion keeps combat ongoing while Leader lives');
    assert.equal(minionBattleAudit.screenAfterLeaderKill, 'reward', 'Killing Gremlin Leader must trigger immediate victory & reward transition despite full-HP surviving minion');
    assert.equal(minionBattleAudit.combatStatusAfterLeaderKill, 'victory');
    assert.equal(minionBattleAudit.hasFleeLog, true, 'Combat log must record minions fleeing');

    // 4. Canonical Enemy Artifact UI & 免疫! floating FX verification (Sentry 1-stack omitted, Spheric Guardian 3, Bash blocked)
    const artifactAudit = await cdp.evaluate(`(async () => {
      const app = window.__SPIRE_APP__;
      const { ENCOUNTERS } = await import('./src/data/enemies.js');
      const { startCombat } = await import('./src/engine/combat.js');
      const st = app.getState();
      st.screen = 'combat';
      startCombat(st, ENCOUNTERS.elite.find((e) => e.id === 'twin_sentries_elite'), 'elite');
      const sentry0 = st.combat.enemies[0];
      st.combat.hand = [{ instanceId: 'bash_art_test', cardId: 'bash', upgraded: false }];
      st.player.energy = 3;
      app.render();

      const artChipBefore = document.querySelector('#enemy-unit-' + sentry0.id + ' .status-chip[data-status-key="artifact"]');
      const sentry1IconOnly = Boolean(artChipBefore?.classList.contains('icon-only') && !artChipBefore.querySelector('.status-val'));
      const artSvgPol = artChipBefore?.querySelector('svg.status-svg')?.dataset?.statusPolarity || '';

      // Play Bash onto Sentry 0 -> strips Artifact 1 -> 0, blocks Vulnerable, spawns 免疫! popup!
      document.getElementById('hand-card-bash_art_test')?.click();
      document.getElementById('enemy-unit-' + sentry0.id)?.click();
      const popups = [...document.querySelectorAll('#spire-fx-layer .fx-float-popup.fx-tone-artifact')].map((el) => el.textContent?.trim());
      const artChipAfter = document.querySelector('#enemy-unit-' + sentry0.id + ' .status-chip[data-status-key="artifact"]');
      const vulnChipAfter = document.querySelector('#enemy-unit-' + sentry0.id + ' .status-chip[data-status-key="vulnerable"]');

      // Also verify Spheric Guardian starts with visible "3" Artifact stack
      startCombat(st, ENCOUNTERS.act2Early.find((e) => e.id === 'spheric_guardian_solo'), 'normal');
      app.render();
      const sgArtVal = document.querySelector('.enemy-side .status-chip[data-status-key="artifact"] .status-val')?.textContent?.trim() || '';

      return {
        sentry1IconOnly,
        artSvgPol,
        hasImmunePopup: popups.includes('免疫!'),
        artRemoved: !artChipAfter,
        vulnBlocked: !vulnChipAfter,
        sgArtVal,
      };
    })()`);

    assert.equal(artifactAudit.sentry1IconOnly, true, 'Sentry 1 Artifact must render frameless icon-only buff badge');
    assert.equal(artifactAudit.artSvgPol, 'buff', 'Artifact badge must use emerald buff polarity frame');
    assert.equal(artifactAudit.hasImmunePopup, true, 'Blocking Bash Vulnerable must spawn golden 免疫! floating popup');
    assert.equal(artifactAudit.artRemoved, true, 'Sentry Artifact badge must disappear once stripped to 0');
    assert.equal(artifactAudit.vulnBlocked, true, 'Vulnerable must not appear on Sentry when negated by Artifact');
    assert.equal(artifactAudit.sgArtVal, '3', 'Spheric Guardian must display 3 Artifact stacks in combat UI');

    // 5. Section A E2E: Bronze Orb Stasis card-name tooltip, Red Slaver Entangled Attack lock UI, Bandits Trio & 4-Gremlin Pack SVGs
    const sectionAAudit = await cdp.evaluate(`(async () => {
      const app = window.__SPIRE_APP__;
      const { ENCOUNTERS } = await import('./src/data/enemies.js');
      const { endPlayerTurn, startCombat } = await import('./src/engine/combat.js');
      const { createCardInstance } = await import('./src/data/cards.js');
      const st = app.getState();

      // 5a. Bronze Automaton spawns 2 Bronze Orbs -> Stasis steals Rare Bludgeon -> UI shows Stasis chip with exact sealed card name
      startCombat(st, ENCOUNTERS.act2Boss.find((e) => e.id === 'automaton_boss'), 'boss');
      st.player.block = 40;
      endPlayerTurn(st);
      const orbs = st.combat.enemies.filter((e) => e.templateId === 'bronze_orb');
      const rareCard = createCardInstance(st, 'bludgeon', false);
      st.combat.drawPile = [createCardInstance(st, 'strike', false), rareCard];
      st.combat.discardPile = [];
      orbs[0].intent = { id: 'orb_stasis', name: '静止力场', type: 'debuff', stasisSteal: true };
      orbs[1].intent = { id: 'orb_support', name: '支援光束', type: 'defend', block: 8, supportBossBlock: true };
      st.player.block = 40;
      endPlayerTurn(st);
      app.render();

      const orbMinionTags = document.querySelectorAll('.enemy-side .minion-tag').length;
      const orbSvgPresent = Boolean(document.querySelector('#enemy-unit-' + orbs[0].id + ' svg #ea-bo-eye'));
      const stasisChip = document.querySelector('#enemy-unit-' + orbs[0].id + ' .status-chip[data-status-key="stasis"]');
      const stasisTooltip = stasisChip?.dataset?.tooltipDesc || '';

      // 5b. Red Slaver Entangled debuff disables Attack cards while keeping Skill cards playable
      startCombat(st, ENCOUNTERS.normal.find((e) => e.id === 'red_slaver_solo'), 'normal');
      st.player.statuses.entangled = 1;
      const atkCard = createCardInstance(st, 'strike', false);
      const sklCard = createCardInstance(st, 'defend', false);
      st.combat.hand = [atkCard, sklCard];
      st.player.energy = 3;
      app.render();

      const entangledChip = document.querySelector('#player-unit .status-chip[data-status-key="entangled"]');
      const entangledPol = entangledChip?.querySelector('svg.status-svg')?.dataset?.statusPolarity || '';
      const atkEl = document.getElementById('hand-card-' + atkCard.instanceId);
      const sklEl = document.getElementById('hand-card-' + sklCard.instanceId);
      const atkBlockedUi = Boolean(
        atkEl?.classList.contains('unplayable-dim') &&
          !atkEl?.classList.contains('playable') &&
          atkEl?.dataset?.unplayableReason === 'unplayable'
      );
      const sklPlayableUi = Boolean(
        sklEl?.classList.contains('playable') && !sklEl?.classList.contains('unplayable-dim')
      );

      // 5c. Bandits Trio & 4-Gremlin Pack bespoke SVGs render cleanly
      startCombat(st, ENCOUNTERS.act2Hard.find((e) => e.id === 'bandit_trio'), 'normal');
      app.render();
      const banditDomCount = document.querySelectorAll('.enemy-side .fighter-unit').length;
      const banditSvgsOk = Boolean(
        document.querySelector('.enemy-side svg #ea-bp-cloak') &&
          document.querySelector('.enemy-side svg #ea-br-cape') &&
          document.querySelector('.enemy-side svg #ea-bb-body')
      );

      startCombat(st, ENCOUNTERS.hardNormal.find((e) => e.id === 'gremlin_pack'), 'normal');
      app.render();
      const gremlinDomCount = document.querySelectorAll('.enemy-side .fighter-unit').length;

      return {
        orbCount: orbs.length,
        orbMinionTags,
        orbSvgPresent,
        stasisTooltip,
        entangledPol,
        atkBlockedUi,
        sklPlayableUi,
        banditDomCount,
        banditSvgsOk,
        gremlinDomCount,
      };
    })()`);

    assert.equal(sectionAAudit.orbCount, 2, 'Automaton must spawn 2 Bronze Orbs');
    assert.equal(sectionAAudit.orbMinionTags, 2, 'Both Bronze Orbs must render 爪牙 minion tag');
    assert.equal(sectionAAudit.orbSvgPresent, true, 'Bronze Orb must render bespoke SVG');
    assert.ok(
      sectionAAudit.stasisTooltip.includes('重锤'),
      `Stasis tooltip must name sealed card 【重锤】, got: ${sectionAAudit.stasisTooltip}`
    );
    assert.equal(sectionAAudit.entangledPol, 'debuff', 'Entangled must render crimson debuff octagonal badge');
    assert.equal(sectionAAudit.atkBlockedUi, true, 'Entangled must dim & lock Attack cards as unplayable in hand UI');
    assert.equal(sectionAAudit.sklPlayableUi, true, 'Entangled must keep Skill cards playable in hand UI');
    assert.equal(sectionAAudit.banditDomCount, 3, 'Bandits Trio must render 3 enemies');
    assert.equal(sectionAAudit.banditSvgsOk, true, 'Pointy, Romeo, and Bear must each render bespoke SVGs');
    assert.equal(sectionAAudit.gremlinDomCount, 4, 'Gremlin Pack must render 4 gremlins');

    cdp.ws.close();
  } finally {
    await teardownSession({ server, browser, cdp });
  }
});

test('E2E Act 4 & Three Keys: HUD 3-key pill (desktop & 390px mobile zero overflow), Burning Elite map flame, Campfire Recall, Treasure Sapphire Key choice, Reward Emerald Key, Act 4 Spire Door Gate, 4-floor Map, Shield & Spear + Corrupt Heart bespoke SVGs & True Ending', async (t) => {
  if (!resolveBrowserBinary()) {
    t.skip('No local Chromium/Chrome binary available');
    return;
  }
  const { server, port } = await startStaticServer();
  let browser = null;
  let cdp = null;
  try {
    browser = await launchHeadlessChromium();
    const debugPort = new URL(browser.browserWsUrl).port;
    const targetsResp = await fetch(`http://127.0.0.1:${debugPort}/json/list`);
    const targets = await targetsResp.json();
    const pageTarget = targets.find((x) => x.type === 'page');
    assert.ok(pageTarget);
    cdp = await createCdpClient(pageTarget.webSocketDebuggerUrl);
    await cdp.send('Runtime.enable');
    await cdp.send('Page.enable');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${port}/` });
    await new Promise((r) => setTimeout(r, 350));
    await launchHeroFromCharacterSelect(cdp, 'ironclad');

    // 1. Verify initial 0/3 HUD keys pill + Burning Elite emerald flame node on map
    const mapAndHudAudit = await cdp.evaluate(`(() => {
      const pill = document.getElementById('hud-keys-pill');
      const burningNodes = document.querySelectorAll('.map-node-btn.node-burning-elite[data-burning-elite="true"]');
      const flameBadge = burningNodes[0]?.querySelector('.burning-elite-flame');
      return {
        hasKeysPill: Boolean(pill),
        keysText: pill?.textContent?.trim() || '',
        rubyAttr: pill?.dataset?.ruby,
        emeraldAttr: pill?.dataset?.emerald,
        sapphireAttr: pill?.dataset?.sapphire,
        burningEliteCount: burningNodes.length,
        hasFlameBadge: Boolean(flameBadge),
      };
    })()`);
    assert.equal(mapAndHudAudit.hasKeysPill, true);
    assert.equal(mapAndHudAudit.keysText, '0/3');
    assert.equal(mapAndHudAudit.burningEliteCount, 1, 'Act 1 map must show exactly 1 Burning Elite node');
    assert.equal(mapAndHudAudit.hasFlameBadge, true);

    // 2. Campfire Recall -> collects Ruby Key (1/3)
    const rubyAudit = await cdp.evaluate(`(() => {
      const app = window.__SPIRE_APP__;
      const st = app.getState();
      st.screen = 'rest';
      st.restState = { completed: false, lastAction: null, featherHealed: 0 };
      app.render();
      const recallBtn = document.getElementById('btn-rest-recall');
      const hasRecallBtn = Boolean(recallBtn);
      recallBtn?.click();
      const pill = document.getElementById('hud-keys-pill');
      return {
        hasRecallBtn,
        screenAfter: st.screen,
        rubyCollected: st.keys.ruby,
        keysText: pill?.textContent?.trim() || '',
        rubyAttr: pill?.dataset?.ruby,
      };
    })()`);
    assert.equal(rubyAudit.hasRecallBtn, true);
    assert.equal(rubyAudit.screenAfter, 'map');
    assert.equal(rubyAudit.rubyCollected, true);
    assert.equal(rubyAudit.keysText, '1/3');
    assert.equal(rubyAudit.rubyAttr, '1');

    // 3. Treasure Chest -> opens 2-choice Relic vs Sapphire Key -> click Sapphire Key (2/3)
    const sapphireAudit = await cdp.evaluate(`(() => {
      const app = window.__SPIRE_APP__;
      const st = app.getState();
      st.screen = 'treasure';
      st.treasureState = {
        opened: false,
        chestTier: 'medium',
        chestLabel: '远古中宝箱',
        relicId: null,
        gold: 0,
        curseCardId: null,
        outcomeText: '',
      };
      app.render();
      document.getElementById('btn-open-treasure')?.click();
      const hasRelicChoice = Boolean(document.getElementById('btn-claim-treasure-relic'));
      const hasSapphireChoice = Boolean(document.getElementById('btn-claim-sapphire-key'));
      const relicCountBefore = st.player.relics.length;
      document.getElementById('btn-claim-sapphire-key')?.click();
      const pill = document.getElementById('hud-keys-pill');
      return {
        hasRelicChoice,
        hasSapphireChoice,
        sapphireCollected: st.keys.sapphire,
        relicSkipped: st.player.relics.length === relicCountBefore,
        keysText: pill?.textContent?.trim() || '',
        sapphireAttr: pill?.dataset?.sapphire,
      };
    })()`);
    assert.equal(sapphireAudit.hasRelicChoice, true);
    assert.equal(sapphireAudit.hasSapphireChoice, true);
    assert.equal(sapphireAudit.sapphireCollected, true);
    assert.equal(sapphireAudit.relicSkipped, true, 'Choosing Sapphire Key must forfeit the chest relic');
    assert.equal(sapphireAudit.keysText, '2/3');
    assert.equal(sapphireAudit.sapphireAttr, '1');

    // 4. Burning Elite reward -> claim Emerald Key (3/3 + .keys-complete)
    const emeraldAudit = await cdp.evaluate(`(() => {
      const app = window.__SPIRE_APP__;
      const st = app.getState();
      st.screen = 'reward';
      st.reward = {
        role: 'elite',
        gold: 40,
        goldClaimed: false,
        relicId: 'vajra',
        relicClaimed: false,
        extraRelicId: null,
        extraRelicClaimed: true,
        emeraldKey: true,
        emeraldKeyClaimed: false,
        potionId: null,
        potionClaimed: true,
        cardChoices: [],
        cardClaimed: true,
        pickedCardId: null,
      };
      app.render();
      const hasEmeraldBtn = Boolean(document.getElementById('btn-claim-emerald-key'));
      document.getElementById('btn-claim-emerald-key')?.click();
      const pill = document.getElementById('hud-keys-pill');
      return {
        hasEmeraldBtn,
        emeraldCollected: st.keys.emerald,
        keysText: pill?.textContent?.trim() || '',
        isComplete: pill?.classList.contains('keys-complete') ?? false,
      };
    })()`);
    assert.equal(emeraldAudit.hasEmeraldBtn, true);
    assert.equal(emeraldAudit.emeraldCollected, true);
    assert.equal(emeraldAudit.keysText, '3/3');
    assert.equal(emeraldAudit.isComplete, true);

    // 5. Act 3 -> Act 4 Spire Door Gate -> 4-floor linear map -> Shield & Spear -> Corrupt Heart -> True Ending!
    const act4FlowAudit = await cdp.evaluate(`(async () => {
      const app = window.__SPIRE_APP__;
      const st = app.getState();
      const { ENCOUNTERS } = await import('./src/data/enemies.js');
      const { startCombat } = await import('./src/engine/combat.js');
      const { transitionCombatVictory } = await import('./src/engine/game.js');

      st.act = 3;
      st.bossReward = {
        actCleared: 3,
        isAct4Gate: true,
        bossGold: 0,
        cardChoices: [],
        cardClaimed: true,
        pickedCardId: null,
        relicChoices: [],
        pickedRelicId: null,
      };
      st.screen = 'boss_reward';
      app.render();

      const hasGateScreen = Boolean(document.getElementById('act4-gate-screen'));
      const gateMedallions = document.querySelectorAll('.act4-key-medallion').length;
      document.getElementById('btn-proceed-act4')?.click();

      const act4Num = st.act;
      const act4Rows = document.querySelectorAll('.map-board .map-row').length;
      const hudFloorText = document.querySelector('.floor-indicator')?.textContent?.trim() || '';

      // Inspect Spire Shield & Spear combat DOM
      startCombat(st, ENCOUNTERS.act4Elite[0], 'elite', transitionCombatVictory);
      app.render();
      const hasShieldSvg = Boolean(document.querySelector('.enemy-side svg #ea-spsh-plate'));
      const hasSpearSvg = Boolean(document.querySelector('.enemy-side svg #ea-spsp-blade'));
      const hasSurroundedChip = Boolean(
        document.querySelector('#player-unit .status-chip[data-status-key="surrounded"]')
      );
      const backAttackText = document.querySelector('.enemy-side .back-attack-tag')?.textContent?.trim() || '';

      // Inspect Corrupt Heart combat DOM & True Victory screen
      startCombat(st, ENCOUNTERS.act4Boss[0], 'boss', transitionCombatVictory);
      app.render();
      const hasHeartSvg = Boolean(document.querySelector('.enemy-side svg #ea-chrt-flesh'));
      const invincibleVal =
        document.querySelector('.enemy-side .status-chip[data-status-key="invincible"] .status-val')?.textContent?.trim() || '';
      const hasBeatOfDeathChip = Boolean(
        document.querySelector('.enemy-side .status-chip[data-status-key="beatOfDeath"]')
      );

      // Defeat Heart via transitionCombatVictory -> Heart Victory true ending
      transitionCombatVictory(st);
      app.render();
      const victoryHeading = document.getElementById('gameover-heading')?.textContent?.trim() || '';
      const hasHeartVictoryPill = Boolean(document.querySelector('.heart-victory-pill'));

      return {
        hasGateScreen,
        gateMedallions,
        act4Num,
        act4Rows,
        hudFloorText,
        hasShieldSvg,
        hasSpearSvg,
        hasSurroundedChip,
        backAttackText,
        hasHeartSvg,
        invincibleVal,
        hasBeatOfDeathChip,
        victoryHeading,
        hasHeartVictoryPill,
      };
    })()`);
    assert.equal(act4FlowAudit.hasGateScreen, true);
    assert.equal(act4FlowAudit.gateMedallions, 3);
    assert.equal(act4FlowAudit.act4Num, 4);
    assert.equal(act4FlowAudit.act4Rows, 4, 'Act 4 map must render exactly 4 linear floors');
    assert.ok(act4FlowAudit.hudFloorText.includes('第 4 幕') && act4FlowAudit.hudFloorText.includes('/ 4 层'));
    assert.equal(act4FlowAudit.hasShieldSvg, true, 'Spire Shield must render bespoke SVG');
    assert.equal(act4FlowAudit.hasSpearSvg, true, 'Spire Spear must render bespoke SVG');
    assert.equal(act4FlowAudit.hasSurroundedChip, true, 'Player must display Surrounded debuff chip');
    assert.ok(act4FlowAudit.backAttackText.includes('背袭'), `Expected back-attack tag, got: ${act4FlowAudit.backAttackText}`);
    assert.equal(act4FlowAudit.hasHeartSvg, true, 'Corrupt Heart must render bespoke SVG');
    assert.equal(act4FlowAudit.invincibleVal, '200', 'Corrupt Heart must display Invincible 200 cap');
    assert.equal(act4FlowAudit.hasBeatOfDeathChip, true, 'Corrupt Heart must display Beat of Death chip');
    assert.ok(act4FlowAudit.victoryHeading.includes('心脏斩杀'), `Expected Heart Victory heading, got: ${act4FlowAudit.victoryHeading}`);
    assert.equal(act4FlowAudit.hasHeartVictoryPill, true);

    // 6. Verify 390px mobile HUD with #hud-keys-pill has ZERO horizontal overflow
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });
    const mobileAudit = await cdp.evaluate(`(() => {
      const app = window.__SPIRE_APP__;
      app.render();
      return {
        overflowPx: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        hasKeysPill: Boolean(document.getElementById('hud-keys-pill')),
      };
    })()`);
    assert.equal(mobileAudit.hasKeysPill, true);
    assert.ok(mobileAudit.overflowPx <= 0, `390px mobile must have zero horizontal overflow with 3-key HUD pill (got ${mobileAudit.overflowPx}px)`);

    cdp.ws.close();
  } finally {
    await teardownSession({ server, browser, cdp });
  }
});
