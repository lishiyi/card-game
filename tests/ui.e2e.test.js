import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

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

function launchHeadlessChromium() {
  return new Promise((resolve, reject) => {
    const proc = spawn(
      'chromium',
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
  if (!fs.existsSync('/usr/bin/chromium')) {
    t.skip('Chromium binary not available');
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

    // 1. Verify SEO & 10-Floor Map Screen structure
    const initialAudit = await cdp.evaluate(`({
      h1Count: document.querySelectorAll('h1').length,
      title: document.title,
      floorIndicator: document.querySelector('.floor-indicator')?.textContent?.trim(),
      mapRowCount: document.querySelectorAll('.map-row').length,
      hasMapNode: Boolean(document.getElementById('map-node-f1_c0')),
      hasBossFloor10: Boolean(document.getElementById('map-node-f10_c0')),
      svgLines: document.querySelectorAll('.map-edges-svg line').length,
      deckBtnText: document.getElementById('btn-open-deck')?.textContent?.trim(),
    })`);

    assert.equal(initialAudit.h1Count, 1, 'Should have exactly 1 h1');
    assert.ok(initialAudit.title.includes('杀戮尖塔'));
    assert.equal(initialAudit.floorIndicator, '第 1 / 10 层');
    assert.equal(initialAudit.mapRowCount, 10);
    assert.equal(initialAudit.hasMapNode, true);
    assert.equal(initialAudit.hasBossFloor10, true);
    assert.ok(initialAudit.svgLines >= 14, 'Expected 10-floor Spire map SVG route lines');
    assert.equal(initialAudit.deckBtnText, '牌组 (10)');

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

    // 4. Play first card in hand & use starting potion & end turn
    const initialHandIds = await cdp.evaluate(`window.__SPIRE_APP__.getState().combat.hand.map(c => c.instanceId)`);
    await cdp.evaluate(`document.querySelector('#hand-tray .game-card.playable').click()`);
    const afterCardHand = await cdp.evaluate(`document.querySelectorAll('#hand-tray .game-card').length`);
    assert.equal(afterCardHand, 4);

    await cdp.evaluate(`document.getElementById('potion-slot-0').click()`);
    const potionUsed = await cdp.evaluate(`window.__SPIRE_APP__.getState().player.potions[0] === null`);
    assert.equal(potionUsed, true);

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
  if (!fs.existsSync('/usr/bin/chromium')) {
    t.skip('Chromium binary not available');
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
        const r = el.getBoundingClientRect();
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

    // Move mouse to empty corner -> tooltip hides
    await cdp.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 4, y: 4 });
    await new Promise((r) => setTimeout(r, 30));
    assert.equal(await cdp.evaluate(`document.getElementById('spire-tooltip').hidden`), true);

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

