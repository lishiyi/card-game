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
    const proc = spawn(
      browserBin,
      [
        '--headless',
        '--no-sandbox',
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--window-size=1280,880',
        '--remote-debugging-port=0',
        'about:blank',
      ],
      { stdio: ['ignore', 'pipe', 'pipe'] }
    );

    let stderrBuf = '';
    const timer = setTimeout(() => {
      proc.kill('SIGKILL');
      reject(new Error(`Timed out waiting for Chromium DevTools endpoint: ${stderrBuf}`));
    }, 8000);

    proc.stderr.on('data', (chunk) => {
      stderrBuf += chunk.toString();
      const match = stderrBuf.match(/DevTools listening on (ws:\/\/[^\s]+)/);
      if (match) {
        clearTimeout(timer);
        resolve({ proc, browserWsUrl: match[1] });
      }
    });

    proc.on('error', (err) => {
      clearTimeout(timer);
      reject(err);
    });
  });
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

test('Real Chromium browser E2E flow: map -> modal -> combat -> play card -> potion -> end turn -> new run with zero console/page errors', async (t) => {
  if (!resolveBrowserBinary()) {
    t.skip('Chromium/Chrome binary not available');
    return;
  }

  const { server, port } = await startStaticServer();
  const { proc, browserWsUrl } = await launchHeadlessChromium();

  try {
    const debugPort = new URL(browserWsUrl).port;
    const targetsResp = await fetch(`http://127.0.0.1:${debugPort}/json/list`);
    const targets = await targetsResp.json();
    const pageTarget = targets.find((x) => x.type === 'page');
    assert.ok(pageTarget, 'Expected a page target in Chromium');

    const cdp = await createCdpClient(pageTarget.webSocketDebuggerUrl);
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

    // 3. Enter Floor 1 Combat
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
    proc.kill('SIGKILL');
    server.close();
  }
});

test('Real Chromium E2E: Common/Uncommon/Rare card colors, Smith cost-reduction green preview (Seeing Red), and real pointer hover tooltips on relics, potions, and player/enemy buffs & debuffs', async (t) => {
  if (!resolveBrowserBinary()) {
    t.skip('Chromium/Chrome binary not available');
    return;
  }

  const { server, port } = await startStaticServer();
  const { proc, browserWsUrl } = await launchHeadlessChromium();

  try {
    const debugPort = new URL(browserWsUrl).port;
    const targetsResp = await fetch(`http://127.0.0.1:${debugPort}/json/list`);
    const targets = await targetsResp.json();
    const pageTarget = targets.find((x) => x.type === 'page');
    assert.ok(pageTarget, 'Expected a page target in Chromium');

    const cdp = await createCdpClient(pageTarget.webSocketDebuggerUrl);
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
    proc.kill('SIGKILL');
    server.close();
  }
});

test('Real Chromium E2E: 3-4 col map + F9 Treasure Chest + Curse card UI + Boss Relic Altar -> Act 2 + Meta/Ascension 5 progression', async (t) => {
  if (!resolveBrowserBinary()) {
    t.skip('Chromium/Chrome binary not available');
    return;
  }

  const { server, port } = await startStaticServer();
  const { proc, browserWsUrl } = await launchHeadlessChromium();

  try {
    const debugPort = new URL(browserWsUrl).port;
    const targetsResp = await fetch(`http://127.0.0.1:${debugPort}/json/list`);
    const targets = await targetsResp.json();
    const pageTarget = targets.find((x) => x.type === 'page');
    assert.ok(pageTarget, 'Expected a page target in Chromium');

    const cdp = await createCdpClient(pageTarget.webSocketDebuggerUrl);
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

    // 3. Test Boss Relic Altar -> pick Boss Relic -> proceed to Act 2!
    await cdp.evaluate(`(() => {
      const app = window.__SPIRE_APP__;
      const st = app.getState();
      st.player.hp = 40;
      st.screen = 'boss_reward';
      st.bossReward = {
        bossGold: 105,
        relicChoices: ['black_blood', 'velvet_choker', 'sacred_bark'],
        pickedRelicId: null,
      };
      app.render();
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
    proc.kill('SIGKILL');
    server.close();
  }
});

test('P2 Real Chromium E2E: @keyframes FX & shield shatter, Settings modal, Glossary/Tutorial, Next-Turn Intent UI, Run History & Seeded Run', async (t) => {
  if (!resolveBrowserBinary()) {
    t.skip('Chromium/Chrome binary not available');
    return;
  }

  const { server, port } = await startStaticServer();
  const { proc, browserWsUrl } = await launchHeadlessChromium();

  try {
    const debugPort = new URL(browserWsUrl).port;
    const targets = await (await fetch(`http://127.0.0.1:${debugPort}/json/list`)).json();
    const pageTarget = targets.find((x) => x.type === 'page');
    assert.ok(pageTarget);

    const cdp = await createCdpClient(pageTarget.webSocketDebuggerUrl);
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
    proc.kill('SIGKILL');
    server.close();
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
  const { proc, browserWsUrl } = await launchHeadlessChromium();

  try {
    const debugPort = new URL(browserWsUrl).port;
    const targets = await (await fetch(`http://127.0.0.1:${debugPort}/json/list`)).json();
    const pageTarget = targets.find((x) => x.type === 'page');
    assert.ok(pageTarget);

    const cdp = await createCdpClient(pageTarget.webSocketDebuggerUrl);
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

    // 2. Mobile 390x844 Combat audit: zero horizontal page overflow, scrollable hand tray, tap-to-inspect next-turn intent
    const mobileCombatAudit = await cdp.evaluate(`(() => {
      document.querySelector('.map-node-btn.available').click();
      const docScrollWidth = document.documentElement.scrollWidth;
      const innerWidth = window.innerWidth;
      const handOverflowX = getComputedStyle(document.querySelector('.hand-tray')).overflowX;

      const nextHint = document.querySelector('.enemy-side .next-intent-hint');
      nextHint.click();
      const tip = document.getElementById('spire-tooltip');
      const tipOpen = !tip.hidden;
      const tipTag = tip.querySelector('.spire-tooltip-tag')?.textContent?.trim() || '';

      return { docScrollWidth, innerWidth, handOverflowX, tipOpen, tipTag };
    })()`);
    assert.ok(
      mobileCombatAudit.docScrollWidth <= mobileCombatAudit.innerWidth,
      `Mobile combat overflowed horizontally: ${mobileCombatAudit.docScrollWidth} > ${mobileCombatAudit.innerWidth}`
    );
    assert.equal(mobileCombatAudit.handOverflowX, 'auto');
    assert.equal(mobileCombatAudit.tipOpen, true);
    assert.equal(mobileCombatAudit.tipTag, '行动预判');

    // 3. Boot generated standalone single-file HTML bundle directly in Chromium & verify full interactivity
    await cdp.evaluate(`window.localStorage.clear()`);
    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${port}/dist/slay_the_spire_lite.html` });
    await new Promise((r) => setTimeout(r, 350));

    const standaloneAudit = await cdp.evaluate(`(() => {
      const hasApp = Boolean(window.__SPIRE_APP__);
      const rowCount = document.querySelectorAll('.map-row').length;
      document.getElementById('btn-open-settings').click();
      const hasSettings = Boolean(document.getElementById('settings-modal'));
      document.getElementById('btn-close-modal').click();
      return { hasApp, rowCount, hasSettings };
    })()`);
    assert.equal(standaloneAudit.hasApp, true);
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
    proc.kill('SIGKILL');
    server.close();
  }
});


