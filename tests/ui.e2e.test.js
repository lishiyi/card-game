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
  '.svg': 'image/svg+xml',
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

function launchHeadlessChromium() {
  return new Promise((resolve, reject) => {
    const browserBin = resolveBrowserBinary();
    const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'spire-chrome-'));
    const proc = spawn(
      browserBin,
      [
        '--headless',
        '--no-sandbox',
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--no-first-run',
        '--no-default-browser-check',
        '--disable-background-networking',
        '--disable-extensions',
        `--user-data-dir=${userDataDir}`,
        '--window-size=1280,880',
        '--remote-debugging-port=0',
        'about:blank',
      ],
      { stdio: ['ignore', 'pipe', 'pipe'] }
    );

    const cleanupProfile = () => {
      try {
        fs.rmSync(userDataDir, { recursive: true, force: true });
      } catch {
        // Ignore temp cleanup race
      }
    };

    let stderrBuf = '';
    const timer = setTimeout(() => {
      proc.kill('SIGKILL');
      cleanupProfile();
      reject(new Error(`Timed out waiting for Chromium DevTools endpoint: ${stderrBuf}`));
    }, 20000);

    proc.stderr.on('data', (chunk) => {
      stderrBuf += chunk.toString();
      const match = stderrBuf.match(/DevTools listening on (ws:\/\/[^\s]+)/);
      if (match) {
        clearTimeout(timer);
        resolve({ proc, browserWsUrl: match[1], userDataDir, cleanupProfile });
      }
    });

    proc.on('error', (err) => {
      clearTimeout(timer);
      cleanupProfile();
      reject(err);
    });
  });
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
    try {
      browser.proc.kill('SIGKILL');
    } catch {
      // Ignore kill error
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

  ws.addEventListener('message', (ev) => {
    const msg = JSON.parse(String(ev.data));
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) reject(new Error(msg.error.message));
      else resolve(msg.result);
    } else if (msg.method) {
      events.push(msg);
    }
  });

  function send(method, params = {}) {
    const id = nextId++;
    ws.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => {
      pending.set(id, { resolve, reject });
    });
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
  const launched = await cdp.evaluate(`(() => {
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
    assert.equal(initialAudit.deckBtnText, '牌组 (10)');
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
      document.querySelector('#hand-tray .game-card.playable').click();
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
    assert.equal(relicTip.title, '燃烧之血');
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
      return {
        commonBorder: getComputedStyle(commonEl).borderTopColor,
        uncommonBorder: getComputedStyle(uncommonEl).borderTopColor,
        rareBorder: getComputedStyle(rareEl).borderTopColor,
        commonBadge: commonEl.querySelector('.rarity-badge')?.textContent?.trim(),
        uncommonBadge: uncommonEl.querySelector('.rarity-badge')?.textContent?.trim(),
        rareBadge: rareEl.querySelector('.rarity-badge')?.textContent?.trim(),
        seeingRedPreview: uncommonEl.querySelector('.card-upgrade-preview')?.textContent?.trim(),
        seeingRedPreviewColor: getComputedStyle(uncommonEl.querySelector('.card-upgrade-preview')).color,
        bodySlamPreview: commonEl.querySelector('.card-upgrade-preview')?.textContent?.trim(),
        strikePreview: document.getElementById('modal-card-c_starter').querySelector('.card-upgrade-preview')?.textContent?.trim(),
      };
    })()`);

    // Verify Common / Uncommon / Rare badges & distinct border colors
    assert.equal(smithAudit.commonBadge, '普通');
    assert.equal(smithAudit.uncommonBadge, '罕见');
    assert.equal(smithAudit.rareBadge, '稀有');
    assert.notEqual(smithAudit.commonBorder, smithAudit.uncommonBorder);
    assert.notEqual(smithAudit.uncommonBorder, smithAudit.rareBorder);
    assert.notEqual(smithAudit.commonBorder, smithAudit.rareBorder);

    // Verify Upgrade Cost Reduction Green Text on Seeing Red (盛怒) & Body Slam (全身撞击)
    assert.ok(
      smithAudit.seeingRedPreview.includes('费用 1 → 0（减少 1 点）'),
      `Expected cost reduction in Seeing Red preview, got: ${smithAudit.seeingRedPreview}`
    );
    assert.ok(smithAudit.seeingRedPreview.includes('获得 2 点能量'));
    assert.ok(smithAudit.bodySlamPreview.includes('费用 1 → 0（减少 1 点）'));
    assert.equal(smithAudit.strikePreview.includes('费用'), false);

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

    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${port}/` });
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
    assert.equal(asc5Audit.deckBtnText, '牌组 (11)');
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
    await cdp.send('Emulation.setTouchEmulationEnabled', { enabled: true });

    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${port}/` });
    await new Promise((r) => setTimeout(r, 350));
    await launchHeroFromCharacterSelect(cdp, 'ironclad');

    // 1. Mobile 390x844 Map viewport audit: zero page horizontal overflow, compact node labels visible, zero overlapping nodes
    const mobileMapAudit = await cdp.evaluate(`(() => {
      const docScrollWidth = document.documentElement.scrollWidth;
      const innerWidth = window.innerWidth;
      const boardRect = document.querySelector('.map-board').getBoundingClientRect();
      const shortTitleDisplay = getComputedStyle(document.querySelector('.node-short-title')).display;
      const fullTitleDisplay = getComputedStyle(document.querySelector('.node-title')).display;

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
        shortTitleDisplay,
        fullTitleDisplay,
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
    assert.notEqual(mobileMapAudit.shortTitleDisplay, 'none');
    assert.equal(mobileMapAudit.fullTitleDisplay, 'none');
    assert.equal(mobileMapAudit.overlapCount, 0, 'Map nodes must never overlap on 390px mobile screen');
    assert.equal(mobileMapAudit.outOfBoundsCount, 0, 'Map nodes must stay within .map-board on 390px screen');
    assert.equal(mobileMapAudit.tipShownOnFirstTap, true);
    assert.equal(mobileMapAudit.tipHiddenOnSecondTap, true);

    // 2. Mobile 390x844 Combat audit: resolve Floor 0 Neow blessing on mobile, zero horizontal page overflow, left-player / right-enemies across 1v1, 1v2, 1v3, scrollable hand tray, tap-to-inspect next-turn intent
    const mobileCombatAudit = await cdp.evaluate(`(() => {
      if (document.getElementById('neow-blessing-panel')) {
        document.getElementById('neow-choice-0').click();
        if (document.getElementById('neow-action-modal')) {
          document.querySelector('#neow-action-modal [data-action="complete-neow-action"]').click();
        }
      }
      document.querySelector('.map-node-btn.available').click();
      const docScrollWidth = document.documentElement.scrollWidth;
      const innerWidth = window.innerWidth;
      const handOverflowX = getComputedStyle(document.querySelector('.hand-tray')).overflowX;

      const nextHint = document.querySelector('.enemy-side .next-intent-hint');
      nextHint.click();
      const tip = document.getElementById('spire-tooltip');
      const tipOpen = !tip.hidden;
      const tipTag = tip.querySelector('.spire-tooltip-tag')?.textContent?.trim() || '';
      if (!tip.hidden) nextHint.click();

      return { docScrollWidth, innerWidth, handOverflowX, tipOpen, tipTag };
    })()`);
    assert.ok(
      mobileCombatAudit.docScrollWidth <= mobileCombatAudit.innerWidth,
      `Mobile combat overflowed horizontally: ${mobileCombatAudit.docScrollWidth} > ${mobileCombatAudit.innerWidth}`
    );
    assert.equal(mobileCombatAudit.handOverflowX, 'auto');
    assert.equal(mobileCombatAudit.tipOpen, true);
    assert.equal(mobileCombatAudit.tipTag, '行动预判');

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
      const hasCharSelect = Boolean(document.getElementById('character-select-screen'));
      if (hasCharSelect) {
        document.getElementById('btn-start-character-run').click();
      }
      const rowCount = document.querySelectorAll('.map-row').length;
      document.getElementById('btn-open-settings').click();
      const hasSettings = Boolean(document.getElementById('settings-modal'));
      document.getElementById('btn-close-modal').click();
      return { hasApp, hasCharSelect, rowCount, hasSettings };
    })()`);
    assert.equal(standaloneAudit.hasApp, true);
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
      const outcomeBanner = document.getElementById('neow-outcome-banner')?.textContent?.trim() || '';
      const f1Unlocked = document.getElementById('map-node-f1_c0')?.getAttribute('aria-disabled') === 'false';
      const relics = [...app.getState().player.relics];
      return { modalOpened, modalClosedAfterEsc, stillPendingAfterEsc, outcomeBanner, f1Unlocked, relics };
    })()`);
    assert.equal(neowFlowAudit.modalOpened, true);
    assert.equal(neowFlowAudit.modalClosedAfterEsc, true);
    assert.equal(neowFlowAudit.stillPendingAfterEsc, true);
    assert.ok(neowFlowAudit.outcomeBanner.includes('涅奥换核成功'));
    assert.equal(neowFlowAudit.f1Unlocked, true);
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
      const hasConfusedChip = [...document.querySelectorAll('#player-unit .status-chip')].some((el) =>
        el.textContent.includes('混乱')
      );
      const hasIncreasedCostBadge = Boolean(document.querySelector('#hand-tray .card-cost.cost-increased'));
      const hasReducedCostBadge = Boolean(document.querySelector('#hand-tray .card-cost.upgraded'));

      return { healBtnDisabled, healBtnText, handCount, hasConfusedChip, hasIncreasedCostBadge, hasReducedCostBadge };
    })()`);
    assert.equal(relicUiAudit.healBtnDisabled, true);
    assert.ok(relicUiAudit.healBtnText.includes('咖啡滤滴器'));
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
    await new Promise((r) => setTimeout(r, 420));
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
      const screen = document.getElementById('character-select-screen');
      const ironcladCard = document.getElementById('char-card-ironclad');
      const silentCard = document.getElementById('char-card-silent');
      const startBtn = document.getElementById('btn-start-character-run');
      const hasResumeBeforeRun = Boolean(document.getElementById('btn-resume-active-run'));
      return {
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
    assert.equal(charSelectAudit.hasScreen, true, 'Fresh load must render Character Select screen');
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
      const relicText = document.querySelector('.relic-badge')?.textContent?.trim() || '';
      const potionTitle = document.getElementById('potion-slot-0')?.parentElement?.dataset?.tooltipTitle || '';
      return {
        characterId: st.characterId,
        heroName: st.player.name,
        hp: st.player.hp,
        maxHp: st.player.maxHp,
        deckBtnText: document.getElementById('btn-open-deck')?.textContent?.trim() || '',
        heroBadgeText: document.getElementById('hud-character-pill')?.textContent?.trim() || '',
        relicText,
        potionTitle,
        neowBossSwap,
      };
    })()`);
    assert.equal(silentHudAudit.characterId, 'silent');
    assert.equal(silentHudAudit.heroName, '静默猎手');
    assert.equal(silentHudAudit.hp, 70);
    assert.equal(silentHudAudit.maxHp, 70);
    assert.equal(silentHudAudit.deckBtnText, '牌组 (12)');
    assert.equal(silentHudAudit.heroBadgeText, '静默猎手');
    assert.equal(silentHudAudit.relicText, '蛇之戒指');
    assert.equal(silentHudAudit.potionTitle, '剧毒药水');
    assert.ok(silentHudAudit.neowBossSwap.includes('蛇之戒指'), `Expected Silent Boss Swap text, got: ${silentHudAudit.neowBossSwap}`);

    // Click HUD "切换角色 / 新开局" -> verifies active run is preserved behind "← 返回当前对局"
    const resumeAudit = await cdp.evaluate(`(() => {
      document.getElementById('btn-new-run').click();
      const onCharSelect = Boolean(document.getElementById('character-select-screen'));
      const hasResumeBtn = Boolean(document.getElementById('btn-resume-active-run'));
      document.getElementById('btn-resume-active-run').click();
      const resumedMap = Boolean(document.getElementById('map-node-f1_c0'));
      const stillSilent = window.__SPIRE_APP__.getState().characterId === 'silent';
      return { onCharSelect, hasResumeBtn, resumedMap, stillSilent };
    })()`);
    assert.equal(resumeAudit.onCharSelect, true);
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

    await cdp.evaluate(`document.getElementById('char-card-silent').click()`);
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





