import test, { after } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import {
  createCdpClient,
  createSharedBrowserSuite,
  launchHeadlessChromium,
  launchHeroFromCharacterSelect,
  MIME_TYPES,
  resolveBrowserBinary,
  ROOT_DIR,
  teardownSession,
} from "../helpers/cdp.js";

const suite = createSharedBrowserSuite();
after(async () => {
  await suite.stop();
});

test('Real Chromium E2E: Concise card keyword tooltips (no card play), Map click direct-connection highlight (main + modal), Map room-type filter legend (Desktop + 390px Mobile), and Official Chinese card names', async (t) => {
  if (!resolveBrowserBinary()) {
    t.skip('No local Chromium/Chrome binary available');
    return;
  }
  let session = null;
  try {
    session = await suite.openIsolatedPage();
    const { cdp, port } = session;
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

    // === 5. Mobile 390x844 Combat: Fan mode fits 5 cards without scrolling; Spread & 8-card hand touch swipe scrolls cleanly without panning page & preserves scrollLeft ===
    await cdp.send('Emulation.setTouchEmulationEnabled', { enabled: true });
    const mobileSwipeSetup = await cdp.evaluate(`(() => {
      const app = window.__SPIRE_APP__;
      const st = app.getState();
      st.currentNodeId = null;
      st.map[0].forEach((n) => { n.visited = false; });
      app.render();
      document.querySelector('.map-node-btn.available').click();
      // First verify default 'fan' mode fits 5 cards on 1 screen with 0px scroll
      st.combat.hand = Array.from({ length: 5 }, (_, i) => ({
        instanceId: 'mf_' + i,
        cardId: i % 2 === 0 ? 'sash_whip' : 'defend',
        upgraded: false,
      }));
      st.player.energy = 3;
      app.render();
      const fanTray5 = document.getElementById('hand-tray');
      const fanLayoutAttr = fanTray5.dataset.handLayout;
      const fan5MaxScroll = Math.max(0, fanTray5.scrollWidth - fanTray5.clientWidth);

      // Now switch to 'spread' mode via Settings toggle to test wide 8-card horizontal swipe scrolling
      document.getElementById('btn-hud-more')?.click();
      document.getElementById('btn-open-settings')?.click();
      document.getElementById('btn-toggle-mobile-hand-layout')?.click();
      document.getElementById('btn-close-modal')?.click();

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
        fanLayoutAttr,
        fan5MaxScroll,
        spreadLayoutAttr: tray.dataset.handLayout,
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

    assert.equal(mobileSwipeSetup.fanLayoutAttr, 'fan', 'Mobile hand must default to stacked fan layout');
    assert.ok(mobileSwipeSetup.fan5MaxScroll <= 2, `5-card mobile fan must fit on 1 screen without scrolling, got maxScroll=${mobileSwipeSetup.fan5MaxScroll}`);
    assert.equal(mobileSwipeSetup.spreadLayoutAttr, 'spread', 'Settings toggle must switch hand tray to spread layout');
    assert.equal(mobileSwipeSetup.docOverflowX, 'clip', 'html must clip horizontal page overflow without breaking sticky');
    assert.equal(mobileSwipeSetup.docOverscrollX, 'none', 'html must disable horizontal page overscroll');
    assert.equal(mobileSwipeSetup.docTouchAction, 'manipulation', 'html must disable double-tap zoom via touch-action: manipulation');
    assert.equal(mobileSwipeSetup.btnTouchAction, 'manipulation', 'Buttons must disable double-tap zoom via touch-action: manipulation');
    assert.equal(mobileSwipeSetup.trayOverscrollX, 'contain', '#hand-tray must contain horizontal overscroll');
    assert.equal(mobileSwipeSetup.trayTouchAction, 'pan-x', '#hand-tray must allow pan-x');
    assert.equal(mobileSwipeSetup.cardTouchAction, 'pan-x', 'Cards inside #hand-tray must explicitly set touch-action: pan-x');
    assert.equal(mobileSwipeSetup.traySnap, 'none', '#hand-tray must not fight horizontal swipes with scroll-snap');
    assert.ok(mobileSwipeSetup.trayMaxScroll > 300, '8-card mobile spread hand must be horizontally scrollable');

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

      // Toggle hand layout back to default 'fan'
      document.getElementById('btn-hud-more')?.click();
      document.getElementById('btn-open-settings')?.click();
      document.getElementById('btn-toggle-mobile-hand-layout')?.click();
      document.getElementById('btn-close-modal')?.click();

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
      const pot0Border = getComputedStyle(pot0).borderStyle;
      const pot0Svg = pot0.querySelector('svg[data-potion-icon="fire_potion"]');
      const pot0SvgW = pot0Svg ? Math.round(pot0Svg.getBoundingClientRect().width) : 0;
      st.player.potions[2] = null;
      app.render();
      const pot2Svg = document.getElementById('potion-slot-2')?.querySelector('svg[data-potion-icon="empty"]');
      const potLabelHidden = getComputedStyle(document.getElementById('potion-slot-0').querySelector('.potion-name-label')).display === 'none';
      const visibleRelics = [...document.querySelectorAll('.top-hud .relic-badge')]
        .filter((el) => el.getBoundingClientRect().right <= hudRect.right + 1).length;

      // 7a. Tapping filled potion icon on 390px opens Potion Popover without consuming it immediately
      document.getElementById('potion-slot-0').click();
      const popoverEl = document.getElementById('hud-potion-popover');
      const popoverIconEl = popoverEl?.querySelector('.hud-potion-popover-icon');
      const popoverIconBorder = popoverIconEl ? getComputedStyle(popoverIconEl).borderStyle : '';
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
        pot0Border,
        pot0SvgW,
        popoverIconBorder,
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
    assert.equal(hudAcAudit.pot0Border, 'none', 'Mobile HUD potion slot must not have a square outer border');
    assert.ok(hudAcAudit.pot0SvgW >= 30, `Frameless mobile HUD potion bottle SVG must enlarge to >=30px, got ${hudAcAudit.pot0SvgW}px`);
    assert.equal(hudAcAudit.popoverIconBorder, 'none', 'Mobile potion popover icon must not have a square outer border');
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
    assert.equal(hudAcAudit.menuLabels.length, 7, 'Combat More menu holds all 7 secondary navigation items including Seed and Restart Combat');
    assert.ok(hudAcAudit.menuLabels.some((t) => t.includes('种子')), `Expected Seed item inside More menu, got ${JSON.stringify(hudAcAudit.menuLabels)}`);
    assert.ok(hudAcAudit.menuLabels.some((t) => t.includes('重启本场战斗')), `Expected Restart Combat item inside More menu, got ${JSON.stringify(hudAcAudit.menuLabels)}`);
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
  } finally {
    await session?.close();
  }
});

test('E2E: Larger potion row tap targets, clickable campfire dig loot, War Paint/Whetstone upgrade modal, combat buff alignment, and official ZHS relic names', async (t) => {
  if (!resolveBrowserBinary()) {
    t.skip('No local Chromium/Chrome binary available');
    return;
  }
  let session = null;
  try {
    session = await suite.openIsolatedPage();
    const { cdp, port } = session;
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
        hasVelvetChokerZhs: compText.includes('天鹅绒项圈'),
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
  } finally {
    await session?.close();
  }
});

test('E2E: Original Slay the Spire two-level Main Menu Hall, pure Standard Character Select with collapsed Seed drawer, and dedicated Daily Challenge screen', async (t) => {
  if (!resolveBrowserBinary()) {
    t.skip('No local Chromium/Chrome binary available');
    return;
  }
  let session = null;
  try {
    session = await suite.openIsolatedPage();
    const { cdp, port } = session;
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
  } finally {
    await session?.close();
  }
});

test('E2E: Service Worker bypasses GitHub Pages max-age=600 HTTP cache and auto-updates returning tab across deploys', async (t) => {
  if (!resolveBrowserBinary()) {
    t.skip('No local Chromium/Chrome binary available');
    return;
  }
  let deployPhase = 'v1';
  const rawFileCache = new Map();
  const server = http.createServer((req, res) => {
    const urlPath = (req.url || '/').split('?')[0];
    const relPath = urlPath === '/' ? 'index.html' : urlPath.replace(/^\/+/, '');
    const fullPath = path.resolve(ROOT_DIR, relPath);
    if (!fullPath.startsWith(ROOT_DIR)) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    let cached = rawFileCache.get(fullPath);
    if (!cached) {
      if (!fs.existsSync(fullPath) || fs.statSync(fullPath).isDirectory()) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }
      const ext = path.extname(fullPath);
      cached = {
        contentType: MIME_TYPES[ext] || 'application/octet-stream',
        body: fs.readFileSync(fullPath),
      };
      rawFileCache.set(fullPath, cached);
    }
    let body = cached.body;
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
      'Content-Type': cached.contentType,
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

  let lastFailure = null;
  try {
    for (let browserAttempt = 0; browserAttempt < 3; browserAttempt += 1) {
      deployPhase = 'v1';
      let browser = null;
      let cdp = null;
      let networkServiceCrashed = false;
      try {
        browser = await launchHeadlessChromium();
        browser.proc.stderr.on('data', (chunk) => {
          if (chunk.toString().includes('Network service crashed')) {
            networkServiceCrashed = true;
          }
        });
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
        const sendBounded = (method, params = {}, ms = 4000) =>
          Promise.race([
            cdp.send(method, params).catch(() => null),
            new Promise((r) => setTimeout(() => r(null), ms)),
          ]);
        const recoverTarget = async () => {
          await sendBounded('Runtime.enable', {}, 2000);
          await sendBounded('Page.enable', {}, 2000);
          await sendBounded('Page.navigate', { url: `http://127.0.0.1:${port}/index.html` }, 12000);
          await new Promise((r) => setTimeout(r, 200));
        };

        await cdp.send('Page.navigate', { url: `http://127.0.0.1:${port}/index.html` });
        await new Promise((r) => setTimeout(r, 200));
        let handledCrashIdx = cdp.events.length;
        let consecutiveNulls = 0;
        let idleNoWorkerPolls = 0;
        let v1Ready = false;
        let lastV1Status = null;
        for (let i = 0; i < 45; i += 1) {
          if (networkServiceCrashed) break;
          const crashed = cdp.events
            .slice(handledCrashIdx)
            .some((e) => e.method === 'Inspector.targetCrashed');
          if (crashed || consecutiveNulls >= 3) {
            handledCrashIdx = cdp.events.length;
            consecutiveNulls = 0;
            idleNoWorkerPolls = 0;
            await recoverTarget();
            handledCrashIdx = cdp.events.length;
            continue;
          }
          const status = await evalSafe(`(async () => {
            const reg = await navigator.serviceWorker?.getRegistration?.();
            const ctrl = Boolean(navigator.serviceWorker?.controller);
            const active = reg?.active?.state || null;
            const installing = reg?.installing?.state || null;
            const waiting = reg?.waiting?.state || null;
            const hasSub = Boolean(document.querySelector('.main-menu-subtitle'));
            return {
              ready: Boolean(ctrl && active === 'activated' && hasSub),
              hasAnyWorker: Boolean(ctrl || active || installing || waiting),
              hasSub,
            };
          })()`);
          lastV1Status = status;
          if (status === null) {
            consecutiveNulls += 1;
          } else {
            consecutiveNulls = 0;
            if (status.ready) {
              v1Ready = true;
              break;
            }
            if (!status.hasAnyWorker && status.hasSub) {
              idleNoWorkerPolls += 1;
              // If SW worker/storage service crashed silently leaving zero workers for >1.5s, restart browser cleanly
              if (idleNoWorkerPolls >= 15) {
                break;
              }
            } else {
              idleNoWorkerPolls = 0;
            }
          }
          await new Promise((r) => setTimeout(r, 100));
        }

        if (!v1Ready) {
          throw new Error(
            `Service Worker v1 did not activate (attempt=${browserAttempt + 1}, netCrash=${networkServiceCrashed}, status=${JSON.stringify(lastV1Status)})`
          );
        }
        const v1Sub = await evalSafe(`document.querySelector('.main-menu-subtitle')?.textContent || ''`);
        assert.equal(v1Sub, 'OLD_V1_SUBTITLE_MARKER');

        // Simulate new GitHub Pages deployment (still returning Cache-Control: max-age=600!)
        deployPhase = 'v2';

        // Returning browser simply reloads WITHOUT clearing cache or opening incognito
        handledCrashIdx = cdp.events.length;
        await sendBounded('Page.reload', { ignoreCache: false }, 4000);
        await new Promise((r) => setTimeout(r, 200));
        let upgradedText = '';
        consecutiveNulls = 0;
        let staleIdlePolls = 0;
        for (let i = 0; i < 60; i += 1) {
          if (networkServiceCrashed) break;
          const crashed = cdp.events
            .slice(handledCrashIdx)
            .some((e) => e.method === 'Inspector.targetCrashed');
          if (crashed || consecutiveNulls >= 3) {
            handledCrashIdx = cdp.events.length;
            consecutiveNulls = 0;
            staleIdlePolls = 0;
            await recoverTarget();
            handledCrashIdx = cdp.events.length;
            continue;
          }
          const snap = await evalSafe(`(async () => {
            const reg = await navigator.serviceWorker?.getRegistration?.();
            return {
              text: document.querySelector('.main-menu-subtitle')?.textContent || '',
              busy: Boolean(reg?.installing || reg?.waiting),
            };
          })()`);
          if (snap === null) {
            consecutiveNulls += 1;
          } else {
            consecutiveNulls = 0;
            if (snap.text) upgradedText = snap.text;
            if (upgradedText === '构筑专属牌组 · 运筹遗物协同 · 征服尖塔之巅') break;
            if (!snap.busy) {
              staleIdlePolls += 1;
              if (staleIdlePolls >= 8) {
                staleIdlePolls = 0;
                await evalSafe(`(async () => {
                  const reg = await navigator.serviceWorker?.getRegistration?.();
                  await reg?.update?.();
                })()`);
              }
            } else {
              staleIdlePolls = 0;
            }
          }
          await new Promise((r) => setTimeout(r, 100));
        }
        assert.equal(
          upgradedText,
          '构筑专属牌组 · 运筹遗物协同 · 征服尖塔之巅',
          `Returning browser tab must auto-upgrade past max-age=600 SW cache, still got: ${upgradedText} (netCrash=${networkServiceCrashed})`
        );

        cdp.ws.close();
        lastFailure = null;
        break;
      } catch (err) {
        lastFailure = err;
        // Retry with a fresh browser process only on transient Chromium infra crashes (max 3 attempts)
        if (browserAttempt === 2) throw err;
      } finally {
        await teardownSession({ server: null, browser, cdp });
      }
    }
    if (lastFailure) throw lastFailure;
  } finally {
    await teardownSession({ server, browser: null, cdp: null });
  }
});

test('E2E: Combat SVG Impact VFX, Attacker Lunge & Hit-Flash, Persistent Status/Stance Auras (0px Alignment), animSpeed=off & Bespoke Class Card Art', async (t) => {
  if (!resolveBrowserBinary()) {
    t.skip('No local Chromium/Chrome binary available');
    return;
  }
  let session = null;
  try {
    session = await suite.openIsolatedPage();
    const { cdp, port } = session;
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
    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${port}/index.html` });
    await new Promise((r) => setTimeout(r, 150));
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
  } finally {
    await session?.close();
  }
});

test('E2E: Bespoke Relic SVGs across Character Select, 390px Mobile HUD, Reward, Boss Altar, Shop, Campfire, Upgrade Reveal & Compendium', async (t) => {
  if (!resolveBrowserBinary()) {
    t.skip('No local Chromium/Chrome binary available');
    return;
  }
  let session = null;
  try {
    session = await suite.openIsolatedPage();
    const { cdp, port } = session;
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
        potionId: 'fire_potion',
        potionClaimed: false,
        cardChoices: [],
        cardClaimed: true,
      };
      app.render();
      const rewardBadge = document.querySelector('#btn-claim-relic .loot-badge-relic');
      const rewardSvg = rewardBadge?.querySelector('svg.relic-svg');
      const rewardPotionBadge = document.querySelector('#btn-claim-potion .loot-badge-potion');
      const rewardPotionSvg = rewardPotionBadge?.querySelector('svg.potion-icon-svg');
      const extraRewardSvg = document.querySelector('#btn-claim-extra-relic .loot-badge-relic svg.relic-svg');
      const rewardKey = rewardSvg?.dataset?.relicSvg || '';
      const rewardW = rewardSvg ? Math.round(rewardSvg.getBoundingClientRect().width) : 0;
      const rewardBadgeBorder = rewardBadge ? getComputedStyle(rewardBadge).borderStyle : '';
      const rewardPotionW = rewardPotionSvg ? Math.round(rewardPotionSvg.getBoundingClientRect().width) : 0;
      const rewardPotionBorder = rewardPotionBadge ? getComputedStyle(rewardPotionBadge).borderStyle : '';
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
        rewardBadgeBorder,
        rewardPotionW,
        rewardPotionBorder,
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
    assert.ok(desktopScreensAudit.bossKeys.every((x) => x.w >= 44), 'Boss Relic Altar SVGs must render >=44px without redundant rim padding');
    assert.equal(desktopScreensAudit.shopRelicKey, 'whetstone', 'Shop general relic must render bespoke whetstone SVG');
    assert.equal(desktopScreensAudit.shopExKey, 'clockwork_souvenir', 'Shop exclusive relic must render bespoke clockwork_souvenir SVG');
    assert.deepEqual(desktopScreensAudit.restKeys, ['girya', 'shovel', 'peace_pipe'], 'Campfire relic actions must render bespoke Girya, Shovel & Peace Pipe SVGs');
    assert.equal(desktopScreensAudit.rewardKey, 'war_paint', 'Reward relic plaque must render bespoke war_paint SVG');
    assert.equal(desktopScreensAudit.rewardBadgeBorder, 'none', 'Reward relic medallion must not have a square outer border');
    assert.ok(desktopScreensAudit.rewardW >= 46, `Desktop reward relic SVG must be enlarged >=46px, got ${desktopScreensAudit.rewardW}px`);
    assert.equal(desktopScreensAudit.rewardPotionBorder, 'none', 'Reward potion icon must not have a square outer border');
    assert.ok(desktopScreensAudit.rewardPotionW >= 44, `Desktop reward potion SVG must be enlarged >=44px, got ${desktopScreensAudit.rewardPotionW}px`);
    assert.equal(desktopScreensAudit.extraRewardKey, 'calipers', 'Black Star extra reward plaque must render bespoke calipers SVG');
    assert.equal(desktopScreensAudit.revealKey, 'war_paint', 'Upgrade reveal modal must render bespoke war_paint SVG');
    assert.ok(desktopScreensAudit.revealW >= 36, `Upgrade reveal modal relic SVG must be >=36px, got ${desktopScreensAudit.revealW}px`);
    assert.ok(desktopScreensAudit.compDiscoveredCount >= 1, 'Compendium Relics tab must render bespoke discovered relic SVGs');
    assert.ok(desktopScreensAudit.compUndiscoveredCount >= 1, 'Compendium Relics tab must render undiscovered silhouette SVGs');
    assert.equal(desktopScreensAudit.dupSvgDefIds, 0, 'Simultaneous HUD + Compendium relic SVGs must have zero duplicate gradient IDs');

    // 3. 390px Mobile: 12 equipped relics in top HUD + Reward screen -> frameless enlarged medallions <=34px & zero horizontal overflow
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
      const firstBadgeStyle = hudBadges[0] ? getComputedStyle(hudBadges[0]) : null;
      const mobileOverflow = document.documentElement.scrollWidth - window.innerWidth;
      return {
        badgeCount: hudBadges.length,
        svgCount: hudSvgs.length,
        maxBadgeW,
        maxBadgeH,
        minSvgW,
        firstBadgeBorder: firstBadgeStyle?.borderStyle || '',
        firstBadgeRadius: firstBadgeStyle?.borderRadius || '',
        mobileOverflow,
      };
    })()`);

    assert.ok(mobileAudit.badgeCount >= 11 && mobileAudit.svgCount === mobileAudit.badgeCount, `Every mobile HUD relic badge must render a bespoke SVG (${mobileAudit.svgCount}/${mobileAudit.badgeCount})`);
    assert.ok(mobileAudit.maxBadgeW <= 34 && mobileAudit.maxBadgeH <= 34, `Mobile HUD relic badges must remain compact <=34px, got ${mobileAudit.maxBadgeW}x${mobileAudit.maxBadgeH}`);
    assert.equal(mobileAudit.firstBadgeBorder, 'none', 'Mobile HUD relic badge must have zero outer square border');
    assert.equal(mobileAudit.firstBadgeRadius, '50%', 'Mobile HUD relic badge container must match circular medallion shape');
    assert.ok(mobileAudit.minSvgW >= 30, `Frameless mobile HUD relic SVGs must enlarge to >=30px, got ${mobileAudit.minSvgW}px`);
    assert.ok(mobileAudit.mobileOverflow <= 1, `390px mobile screen with 12 relic SVGs must have zero horizontal overflow, got ${mobileAudit.mobileOverflow}px`);

    // 4. Mobile tap regression: tapping HUD relics must never apply nested parent filter/transform or hide SVG icons
    const firstRelicPt = await cdp.evaluate(`(() => {
      const el = document.querySelector('.top-hud .relic-badge');
      const r = el.getBoundingClientRect();
      return { x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2) };
    })()`);
    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchStart',
      touchPoints: [{ x: firstRelicPt.x, y: firstRelicPt.y, id: 1 }],
    });
    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchEnd',
      touchPoints: [],
    });
    await new Promise((r) => setTimeout(r, 80));

    const tapOpenAudit = await cdp.evaluate(`(() => {
      const badge = document.querySelector('.top-hud .relic-badge');
      const svg = badge?.querySelector('svg.relic-svg');
      const tip = document.getElementById('spire-tooltip');
      const badgeCs = badge ? getComputedStyle(badge) : null;
      const svgCs = svg ? getComputedStyle(svg) : null;
      const svgRect = svg ? svg.getBoundingClientRect() : { width: 0, height: 0 };
      return {
        tooltipVisible: Boolean(tip && !tip.hidden),
        hasActiveClass: badge?.classList.contains('tooltip-active') ?? false,
        badgeFilter: badgeCs?.filter || '',
        badgeTransform: badgeCs?.transform || '',
        svgOpacity: svgCs?.opacity || '',
        svgVisibility: svgCs?.visibility || '',
        svgWidthAttr: svg?.getAttribute('width') || '',
        svgHeightAttr: svg?.getAttribute('height') || '',
        svgW: Math.round(svgRect.width),
        svgH: Math.round(svgRect.height),
      };
    })()`);
    assert.equal(tapOpenAudit.tooltipVisible, true, 'Tapping mobile HUD relic must show pinned tooltip');
    assert.equal(tapOpenAudit.hasActiveClass, true, 'Tapped HUD relic must receive .tooltip-active highlight');
    assert.equal(tapOpenAudit.badgeFilter, 'none', 'Mobile HUD relic badge must NOT nest CSS filter on parent element');
    assert.equal(tapOpenAudit.badgeTransform, 'none', 'Mobile HUD relic badge must NOT trigger transform layer promotion on tap');
    assert.equal(tapOpenAudit.svgOpacity, '1');
    assert.equal(tapOpenAudit.svgVisibility, 'visible');
    assert.equal(tapOpenAudit.svgWidthAttr, '36');
    assert.equal(tapOpenAudit.svgHeightAttr, '36');
    assert.ok(tapOpenAudit.svgW >= 30 && tapOpenAudit.svgH >= 30, `Tapped relic SVG must remain >=30px, got ${tapOpenAudit.svgW}x${tapOpenAudit.svgH}`);

    // Tap same relic again to dismiss tooltip -> active class clears and all relic SVGs stay visible
    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchStart',
      touchPoints: [{ x: firstRelicPt.x, y: firstRelicPt.y, id: 2 }],
    });
    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchEnd',
      touchPoints: [],
    });
    await new Promise((r) => setTimeout(r, 80));

    const tapCloseAudit = await cdp.evaluate(`(() => {
      const badge = document.querySelector('.top-hud .relic-badge');
      const tip = document.getElementById('spire-tooltip');
      const svgs = [...document.querySelectorAll('.top-hud .relic-badge svg.relic-svg')];
      return {
        tooltipHidden: Boolean(tip && tip.hidden),
        hasActiveClass: badge?.classList.contains('tooltip-active') ?? false,
        allVisible: svgs.every((s) => {
          const cs = getComputedStyle(s);
          const r = s.getBoundingClientRect();
          return cs.opacity === '1' && cs.visibility === 'visible' && r.width >= 30 && r.height >= 30;
        }),
      };
    })()`);
    assert.equal(tapCloseAudit.tooltipHidden, true, 'Second tap on HUD relic must dismiss tooltip');
    assert.equal(tapCloseAudit.hasActiveClass, false, 'Dismissing tooltip must remove .tooltip-active');
    assert.equal(tapCloseAudit.allVisible, true, 'All HUD relic SVGs must remain visible after tap-to-dismiss');
  } finally {
    await session?.close();
  }
});

test('E2E: Event & Relic card-upgrade smith audio parity + Combat Buff/Debuff SVG icon chips (Desktop & 390px Mobile)', async (t) => {
  if (!resolveBrowserBinary()) {
    t.skip('No local Chromium/Chrome binary available');
    return;
  }
  let session = null;
  try {
    session = await suite.openIsolatedPage();
    const { cdp, port } = session;
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
  } finally {
    await session?.close();
  }
});

test('E2E: Slay-the-Spire Turn Transition Banner & Discard/Reshuffle/Draw Card Sweeps (Desktop, 390px Mobile & animSpeed=off)', async (t) => {
  if (!resolveBrowserBinary()) {
    t.skip('No local Chromium/Chrome binary available');
    return;
  }
  let session = null;
  try {
    session = await suite.openIsolatedPage();
    const { cdp, port } = session;
    await cdp.send('Runtime.enable');
    await cdp.send('Page.enable');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 820,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${port}/` });
    await new Promise((r) => setTimeout(r, 320));
    await launchHeroFromCharacterSelect(cdp, 'ironclad');

    // 1. Clear Floor 0 Neow blessing and enter Floor 1 combat -> verify Turn 1 opening banner + draw sweep ghosts
    const enteredCombat = await cdp.evaluate(`(() => {
      const app = window.__SPIRE_APP__;
      const st = app.getState();
      st.neowState = null;
      app.render();
      const node = document.querySelector('.map-node-btn.available') || document.getElementById('map-node-f1_c0');
      if (!node) return false;
      node.click();
      return app.getState().screen === 'combat';
    })()`);
    assert.equal(enteredCombat, true, 'Must enter Floor 1 combat');
    await new Promise((r) => setTimeout(r, 40));

    const openingAudit = await cdp.evaluate(`(() => {
      const banner = document.querySelector('#spire-fx-layer .fx-turn-banner[data-fx-turn-banner="true"]');
      const drawGhosts = document.querySelectorAll('#spire-fx-layer .fx-pile-card-ghost[data-fx-sweep="from-draw"]').length;
      const cs = banner ? getComputedStyle(banner) : null;
      return {
        hasBanner: Boolean(banner),
        turn: banner?.dataset?.turn || '',
        kind: banner?.dataset?.turnKind || '',
        text: banner?.textContent?.replace(/\\s+/g, ' ').trim() || '',
        pointerEvents: cs?.pointerEvents || '',
        drawGhosts,
      };
    })()`);
    assert.equal(openingAudit.hasBanner, true, 'Entering combat must spawn opening turn banner');
    assert.equal(openingAudit.turn, '1');
    assert.equal(openingAudit.kind, 'opening');
    assert.ok(openingAudit.text.includes('第 1 回合') && openingAudit.text.includes('抽牌'), `Expected opening draw text, got: ${openingAudit.text}`);
    assert.equal(openingAudit.pointerEvents, 'none', 'Turn banner must remain 100% non-blocking');
    assert.ok(openingAudit.drawGhosts >= 1, `Opening turn must spawn from-draw card sweep ghosts, got ${openingAudit.drawGhosts}`);

    // 2. Click End Turn -> immediately verify Turn 2 banner with Discard + Draw chips & to-discard sweep,
    //    then after ~180ms verify from-draw sweep appears!
    await cdp.evaluate(`(() => {
      const app = window.__SPIRE_APP__;
      const st = app.getState();
      st.combat.enemies.forEach((e) => {
        e.hp = 120;
        e.maxHp = 120;
        e.intent = { id: 'idle', name: '待机', type: 'buff', summary: '待机' };
      });
      app.render();
      document.getElementById('btn-end-turn')?.click();
    })()`);
    await new Promise((r) => setTimeout(r, 35));

    const turn2DiscardAudit = await cdp.evaluate(`(() => {
      const banner = document.querySelector('#spire-fx-layer .fx-turn-banner[data-fx-turn-banner="true"]');
      const discardGhosts = document.querySelectorAll('#spire-fx-layer .fx-pile-card-ghost[data-fx-sweep="to-discard"]').length;
      const hasDiscardChip = Boolean(banner?.querySelector('[data-turn-chip="discard"]'));
      const hasDrawChip = Boolean(banner?.querySelector('[data-turn-chip="draw"]'));
      return {
        turn: banner?.dataset?.turn || '',
        kind: banner?.dataset?.turnKind || '',
        text: banner?.textContent?.replace(/\\s+/g, ' ').trim() || '',
        discardGhosts,
        hasDiscardChip,
        hasDrawChip,
      };
    })()`);
    assert.equal(turn2DiscardAudit.turn, '2');
    assert.equal(turn2DiscardAudit.kind, 'turn');
    assert.equal(turn2DiscardAudit.hasDiscardChip, true, `Turn 2 banner must display 弃牌 chip, got: ${turn2DiscardAudit.text}`);
    assert.equal(turn2DiscardAudit.hasDrawChip, true, `Turn 2 banner must display 抽牌 chip, got: ${turn2DiscardAudit.text}`);
    assert.ok(turn2DiscardAudit.discardGhosts >= 1, `Ending turn with cards in hand must sweep cards to discard pile, got ${turn2DiscardAudit.discardGhosts}`);

    await new Promise((r) => setTimeout(r, 175));
    const turn2DrawAudit = await cdp.evaluate(`(() => ({
      drawGhosts: document.querySelectorAll('#spire-fx-layer .fx-pile-card-ghost[data-fx-sweep="from-draw"]').length,
      freshCards: document.querySelectorAll('#hand-tray .game-card.fx-card-fresh-draw').length,
    }))()`);
    assert.ok(turn2DrawAudit.drawGhosts >= 1, `New turn must sweep newly drawn cards from draw pile, got ${turn2DrawAudit.drawGhosts}`);

    // 3. 390px Mobile: force reshuffle on Turn 3 -> verify ↻ 洗牌重抽 chip & zero overflow
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await new Promise((r) => setTimeout(r, 80));
    await cdp.evaluate(`(() => {
      const app = window.__SPIRE_APP__;
      const st = app.getState();
      st.combat.drawPile = st.combat.drawPile.slice(0, 1);
      app.render();
      document.getElementById('btn-end-turn')?.click();
    })()`);
    await new Promise((r) => setTimeout(r, 40));

    const mobileShuffleAudit = await cdp.evaluate(`(() => {
      const banner = document.querySelector('#spire-fx-layer .fx-turn-banner[data-fx-turn-banner="true"]');
      const rect = banner ? banner.getBoundingClientRect() : { left: -1, right: 999, width: 0 };
      const hasShuffleChip = Boolean(banner?.querySelector('[data-turn-chip="shuffle"]'));
      const overflow = document.documentElement.scrollWidth - window.innerWidth;
      return {
        turn: banner?.dataset?.turn || '',
        hasShuffleChip,
        left: Math.round(rect.left),
        right: Math.round(rect.right),
        width: Math.round(rect.width),
        overflow,
      };
    })()`);
    assert.equal(mobileShuffleAudit.turn, '3');
    assert.equal(mobileShuffleAudit.hasShuffleChip, true, 'Reshuffling on turn draw must display ↻ 洗牌重抽 chip');
    assert.ok(mobileShuffleAudit.left >= 0 && mobileShuffleAudit.right <= 390 && mobileShuffleAudit.width > 80, `390px mobile turn banner must fit within viewport, got [${mobileShuffleAudit.left}, ${mobileShuffleAudit.right}]`);
    assert.ok(mobileShuffleAudit.overflow <= 1, `390px mobile turn transition must cause zero horizontal overflow, got ${mobileShuffleAudit.overflow}px`);

    // 4. animSpeed='off' suppresses overlay banner & card sweep ghosts cleanly
    await cdp.evaluate(`(() => {
      document.getElementById('btn-hud-more')?.click();
      document.getElementById('btn-open-settings')?.click();
      document.querySelector('[data-action="set-anim-speed"][data-speed="off"]')?.click();
      document.querySelector('[data-action="close-modal"]')?.click();
      document.getElementById('spire-fx-layer').innerHTML = '';
      document.getElementById('btn-end-turn')?.click();
    })()`);
    await new Promise((r) => setTimeout(r, 60));
    const offAudit = await cdp.evaluate(`(() => ({
      banners: document.querySelectorAll('#spire-fx-layer .fx-turn-banner').length,
      sweeps: document.querySelectorAll('#spire-fx-layer .fx-pile-card-ghost').length,
    }))()`);
    assert.equal(offAudit.banners, 0, 'animSpeed=off must suppress turn transition banner');
    assert.equal(offAudit.sweeps, 0, 'animSpeed=off must suppress discard/draw sweep ghosts');
  } finally {
    await session?.close();
  }
});

test('E2E Part A: Run History Filters & Card Win-Rate Table, First-Time Mechanic Tip Toast + Settings Toggle, and Lazy Card Art Hydration (Desktop + 390px Mobile)', async (t) => {
  if (!resolveBrowserBinary()) {
    t.skip('No local Chromium/Chrome binary available');
    return;
  }
  let session = null;
  try {
    session = await suite.openIsolatedPage();
    const { cdp, port } = session;
    await cdp.send('Runtime.enable');
    await cdp.send('Page.enable');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });
    const waitUntil = async (expr, timeoutMs = 4000) => {
      const deadline = Date.now() + timeoutMs;
      while (Date.now() < deadline) {
        if (await cdp.evaluate(`Boolean(${expr})`)) return true;
        await new Promise((r) => setTimeout(r, 40));
      }
      throw new Error(`Timed out waiting for: ${expr}`);
    };
    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${port}/index.html` });
    await waitUntil('window.__SPIRE_APP__?.getState');

    // 1. Seed meta with multi-class Run History (victories + defeat with cause) & cardStats -> verify Meta modal filters & Card Win-Rate table
    await cdp.evaluate(`(() => {
      const app = window.__SPIRE_APP__;
      const meta = app.getMeta();
      meta.totalRuns = 3;
      meta.victories = 2;
      meta.xp = 400;
      meta.unlockedTier = 2;
      meta.maxAscensionUnlocked = 1;
      meta.cardStats = {
        pommel_strike: { runs: 2, wins: 2, copies: 3, upgradedCopies: 2 },
        tantrum: { runs: 1, wins: 0, copies: 1, upgradedCopies: 1 },
      };
      meta.runHistory = [
        {
          characterId: 'ironclad',
          ascension: 0,
          outcome: 'victory',
          act: 3,
          floor: 16,
          seed: 1001,
          seedText: '1001',
          score: 820,
          deckSize: 18,
          relicCount: 9,
          enemiesSlain: 22,
          deckSummary: [{ cardId: 'pommel_strike', count: 2, upgraded: true }],
        },
        {
          characterId: 'watcher',
          ascension: 0,
          outcome: 'defeat',
          act: 2,
          floor: 10,
          seed: 1002,
          seedText: '1002',
          score: 310,
          deckSize: 15,
          relicCount: 4,
          enemiesSlain: 11,
          defeatedBy: '地精首领',
          deckSummary: [{ cardId: 'tantrum', count: 1, upgraded: true }],
        },
      ];
      app.openModal('meta');
    })()`);
    await waitUntil('document.getElementById("meta-card-stats-section")');

    const metaAudit = await cdp.evaluate(`(() => {
      const allHistoryRows = document.querySelectorAll('#run-history-list .history-row').length;
      const defeatCauseText = document.querySelector('#run-history-list .history-defeat-cause')?.textContent?.trim() || '';
      const cardRowsAll = document.querySelectorAll('#meta-card-stats-grid .card-stat-row').length;
      document.querySelector('[data-action="set-history-outcome"][data-outcome-filter="victory"]')?.click();
      const historyWinsOnly = document.querySelectorAll('#run-history-list .history-row').length;
      document.querySelector('[data-action="set-history-outcome"][data-outcome-filter="all"]')?.click();
      document.querySelector('[data-action="set-history-char"][data-char-filter="watcher"]')?.click();
      const historyWatcherOnly = document.querySelectorAll('#run-history-list .history-row').length;
      document.querySelector('[data-action="set-card-stats-char"][data-char-filter="ironclad"]')?.click();
      const cardRowsIron = document.querySelectorAll('#meta-card-stats-grid .card-stat-row').length;
      document.querySelector('[data-action="close-modal"]')?.click();
      return { allHistoryRows, defeatCauseText, cardRowsAll, historyWinsOnly, historyWatcherOnly, cardRowsIron };
    })()`);
    assert.equal(metaAudit.allHistoryRows, 2);
    assert.ok(metaAudit.defeatCauseText.includes('地精首领'), `Defeat cause pill should show enemy name, got: ${metaAudit.defeatCauseText}`);
    assert.equal(metaAudit.cardRowsAll, 2);
    assert.equal(metaAudit.historyWinsOnly, 1);
    assert.equal(metaAudit.historyWatcherOnly, 1);
    assert.equal(metaAudit.cardRowsIron, 1);

    // 2. Launch Watcher run -> enter Floor 1 combat -> verify First-Time Mechanic Tip toast & Lazy Card Art hydration
    await launchHeroFromCharacterSelect(cdp, 'watcher');
    await cdp.evaluate(`(() => {
      const app = window.__SPIRE_APP__;
      const st = app.getState();
      st.neowState = null;
      app.render();
      document.querySelector('.map-node-btn.available')?.click();
    })()`);
    await waitUntil('document.querySelectorAll("#hand-tray .game-card").length >= 4');
    // Wait briefly for lazy Watcher card art chunk to hydrate
    await waitUntil(`(() => {
      const svgs = [...document.querySelectorAll('#hand-tray .card-art-svg')];
      return svgs.length >= 4 && svgs.every((s) => s.querySelector('path, circle, polygon, rect, ellipse, line'));
    })()`);

    const tipAudit = await cdp.evaluate(`(() => {
      const toast = document.getElementById('mechanic-tip-toast');
      const tipId = toast?.dataset?.tipId || '';
      const tipVisible = Boolean(toast && getComputedStyle(toast).display !== 'none');
      document.getElementById('btn-dismiss-mechanic-tip')?.click();
      const toastAfterDismiss = Boolean(document.getElementById('mechanic-tip-toast'));
      return { tipId, tipVisible, toastAfterDismiss };
    })()`);
    assert.equal(tipAudit.tipVisible, true, 'Watcher first combat must show Mechanic Tip toast');
    assert.equal(tipAudit.tipId, 'watcher_stance');
    assert.equal(tipAudit.toastAfterDismiss, false, 'Clicking 知道了 dismisses the tip toast');

    // 3. Settings modal toggles Mechanic Tips cleanly & 390px mobile has zero overflow
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await new Promise((r) => setTimeout(r, 80));
    const settingsAudit = await cdp.evaluate(`(() => {
      document.getElementById('btn-hud-more')?.click();
      document.getElementById('btn-open-settings')?.click();
      const btn = document.getElementById('btn-toggle-mechanic-tips');
      const beforeText = btn?.textContent?.trim() || '';
      btn?.click();
      const afterText = document.getElementById('btn-toggle-mechanic-tips')?.textContent?.trim() || '';
      document.querySelector('[data-action="close-modal"]')?.click();
      const overflow = document.documentElement.scrollWidth - window.innerWidth;
      return { beforeText, afterText, overflow };
    })()`);
    assert.ok(settingsAudit.beforeText.includes('已开启'), `Expected 机制提示：已开启, got: ${settingsAudit.beforeText}`);
    assert.ok(settingsAudit.afterText.includes('已关闭'), `Expected 机制提示：已关闭, got: ${settingsAudit.afterText}`);
    assert.ok(settingsAudit.overflow <= 1, `390px mobile must have zero overflow, got ${settingsAudit.overflow}px`);

    const exceptions = cdp.events.filter((e) => e.method === 'Runtime.exceptionThrown');
    const consoleErrors = cdp.events.filter(
      (e) => e.method === 'Runtime.consoleAPICalled' && e.params?.type === 'error'
    );
    assert.equal(exceptions.length, 0, `Uncaught exceptions: ${JSON.stringify(exceptions)}`);
    assert.equal(consoleErrors.length, 0, `Console errors: ${JSON.stringify(consoleErrors)}`);
  } finally {
    await session?.close();
  }
});

test('E2E Plan 2: Mobile portrait stacked fan hand (5-6 cards 1-screen, opaque dim, tap focus/inspect, single-finger scrub), 100dvh one-screen lock, single-row 3-enemy stagger, incoming total damage badge, End Turn ready glow & HUD More restart', async (t) => {
  if (!resolveBrowserBinary()) {
    t.skip('Chromium/Chrome binary not available');
    return;
  }

  let session = null;
  try {
    session = await suite.openIsolatedPage();
    const { cdp, port } = session;
    await cdp.send('Runtime.enable');
    await cdp.send('Page.enable');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 700,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await cdp.send('Emulation.setTouchEmulationEnabled', { enabled: true });

    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${port}/` });
    await new Promise((r) => setTimeout(r, 400));
    await launchHeroFromCharacterSelect(cdp, 'ironclad');

    const fanAndCombatAudit = await cdp.evaluate(`(() => {
      const app = window.__SPIRE_APP__;
      const st = app.getState();
      if (st.neowState) st.neowState.resolved = true;
      st.player.relics = ['burning_blood', 'vajra', 'anchor', 'lantern'];
      app.render();
      document.querySelector('.map-node-btn.available').click();

      // Normalize 3 enemies + 6-card hand (with 1 unplayable 3-cost Bludgeon at energy=2)
      const baseEnemy = JSON.parse(JSON.stringify(st.combat.enemies[0]));
      st.combat.enemies = [
        { ...JSON.parse(JSON.stringify(baseEnemy)), id: 'p2e_0', name: '红虱', hp: 30, maxHp: 30, block: 0, intent: { type: 'attack', damage: 7, hits: 1, name: '啃咬' } },
        { ...JSON.parse(JSON.stringify(baseEnemy)), id: 'p2e_1', name: '邪教徒', hp: 44, maxHp: 44, block: 0, intent: { type: 'attack', damage: 11, hits: 1, name: '暗击' } },
        { ...JSON.parse(JSON.stringify(baseEnemy)), id: 'p2e_2', name: '哨卫', hp: 38, maxHp: 38, block: 4, intent: { type: 'attack', damage: 9, hits: 1, name: '激光' } },
      ];
      st.combat.hand = [
        { instanceId: 'p2_d1', cardId: 'defend', upgraded: false },
        { instanceId: 'p2_s1', cardId: 'strike', upgraded: false },
        { instanceId: 'p2_d2', cardId: 'defend', upgraded: false },
        { instanceId: 'p2_s2', cardId: 'strike', upgraded: false },
        { instanceId: 'p2_pwr', cardId: 'inflame', upgraded: false },
        { instanceId: 'p2_blud', cardId: 'bludgeon', upgraded: false },
      ];
      st.player.energy = 2;
      st.player.block = 5;
      st.player.hp = 60;
      app.render();

      const tray = document.getElementById('hand-tray');
      const fan6MaxScroll = Math.max(0, tray.scrollWidth - tray.clientWidth);
      const bludOpacity = Number(getComputedStyle(document.getElementById('hand-card-p2_blud')).opacity);
      const powerBorderLeftW = getComputedStyle(document.getElementById('hand-card-p2_pwr')).borderLeftWidth;
      const attackCostRadius = getComputedStyle(document.querySelector('#hand-card-p2_s1 .card-cost')).borderRadius;
      const skillCostRadius = getComputedStyle(document.querySelector('#hand-card-p2_d1 .card-cost')).borderRadius;
      const powerArtRadius = getComputedStyle(document.querySelector('#hand-card-p2_pwr .card-art-frame')).borderRadius;
      const docScrollH390 = document.documentElement.scrollHeight;
      const winH390 = window.innerHeight;
      const docScrollW390 = document.documentElement.scrollWidth;

      // 3-enemy single horizontal row & middle stagger check
      const enemyRects = [...document.querySelectorAll('.enemy-side .fighter-unit')].map((el) => el.getBoundingClientRect());
      const enemyTopSpan = Math.max(...enemyRects.map((r) => r.top)) - Math.min(...enemyRects.map((r) => r.top));
      const enemySingleRow =
        enemyRects.length === 3 &&
        enemyTopSpan <= 14 &&
        enemyRects[0].right <= enemyRects[1].left + 2 &&
        enemyRects[1].right <= enemyRects[2].left + 2;
      const middleStaggerHigher = enemyRects[1].top < enemyRects[0].top && enemyRects[1].top < enemyRects[2].top;

      // Incoming damage badge initial state: total 27, block 5 -> danger (-22)
      const incomingInitial = {
        text: document.getElementById('incoming-damage-badge')?.textContent?.trim() || '',
        state: document.getElementById('incoming-damage-badge')?.dataset?.incomingState || '',
        total: Number(document.getElementById('incoming-damage-badge')?.dataset?.totalIncoming || 0),
        unblocked: Number(document.getElementById('incoming-damage-badge')?.dataset?.unblocked || 0),
      };

      // Overlapped fan card (card #0 Defend): 1st tap pops up selected without playing, 2nd tap plays it
      const blockBeforeTap = st.player.block;
      document.getElementById('hand-card-p2_d1').click();
      const selectedAfterTap1 = document.getElementById('hand-card-p2_d1')?.classList.contains('selected-card') ?? false;
      const blockAfterTap1 = st.player.block;
      document.getElementById('hand-card-p2_d1').click();
      const blockAfterTap2 = st.player.block;

      // Tapping unplayable Bludgeon pops up .inspected-card, empty combat arena tap dismisses it
      document.getElementById('hand-card-p2_blud').click();
      const inspectedAfterTap = document.getElementById('hand-card-p2_blud')?.classList.contains('inspected-card') ?? false;
      document.getElementById('combat-arena').click();
      const inspectedAfterEmptyTap = document.getElementById('hand-card-p2_blud')?.classList.contains('inspected-card') ?? false;

      // Single-finger horizontal touch scrub across 5-card fan highlights card under finger & focuses on release without playing
      const trayNow = document.getElementById('hand-tray');
      const card0 = trayNow.querySelector('.game-card[data-instance-id]');
      const card2 = trayNow.querySelectorAll('.game-card[data-instance-id]')[2];
      const r0 = card0.getBoundingClientRect();
      const r2 = card2.getBoundingClientRect();
      const handLenBeforeScrub = st.combat.hand.length;
      card0.dispatchEvent(new PointerEvent('pointerdown', {
        bubbles: true, pointerId: 41, pointerType: 'touch', clientX: r0.left + 16, clientY: r0.top + 60,
      }));
      window.dispatchEvent(new PointerEvent('pointermove', {
        bubbles: true, pointerId: 41, pointerType: 'touch', clientX: r2.left + 20, clientY: r2.top + 60,
      }));
      const scrubbedClassLive = Boolean(trayNow.querySelector('.game-card.scrub-focused'));
      window.dispatchEvent(new PointerEvent('pointerup', {
        bubbles: true, pointerId: 41, pointerType: 'touch', clientX: r2.left + 20, clientY: r2.top + 60,
      }));
      const handLenAfterScrub = st.combat.hand.length;
      const focusedAfterScrub = Boolean(document.querySelector('#hand-tray .game-card.selected-card, #hand-tray .game-card.inspected-card'));

      // Incoming badge updates to safe (全挡) when block >= 27, and lethal when hp <= unblocked
      st.player.block = 30;
      st.player.energy = 0;
      app.render();
      const incomingSafeState = document.getElementById('incoming-damage-badge')?.dataset?.incomingState || '';
      const endTurnReadyAtZeroEnergy = document.getElementById('btn-end-turn')?.classList.contains('end-turn-ready') ?? false;

      st.player.block = 0;
      st.player.hp = 20;
      app.render();
      const incomingLethalState = document.getElementById('incoming-damage-badge')?.dataset?.incomingState || '';

      // Mobile floating log expands without increasing document scrollHeight and dismisses on outside tap
      document.getElementById('btn-toggle-mobile-log')?.click();
      const logExpandedVisible = getComputedStyle(document.getElementById('combat-log')).display !== 'none';
      const docScrollHWithLog = document.documentElement.scrollHeight;
      document.getElementById('combat-arena')?.click();
      const logClosedAfterOutsideTap = getComputedStyle(document.getElementById('combat-log')).display === 'none';

      // HUD More drawer Restart Combat works on 390px phone and closes menu
      const restartsBefore = st.stats.combatRestarts || 0;
      document.getElementById('btn-hud-more')?.click();
      document.getElementById('btn-hud-restart-combat')?.click();
      const restartsAfter = st.stats.combatRestarts || 0;
      const moreMenuClosedAfterRestart = !document.getElementById('hud-more-menu')?.classList.contains('open');

      return {
        fan6MaxScroll,
        bludOpacity,
        powerBorderLeftW,
        attackCostRadius,
        skillCostRadius,
        powerArtRadius,
        docScrollH390,
        winH390,
        docScrollW390,
        enemySingleRow,
        middleStaggerHigher,
        incomingInitial,
        blockBeforeTap,
        selectedAfterTap1,
        blockAfterTap1,
        blockAfterTap2,
        inspectedAfterTap,
        inspectedAfterEmptyTap,
        scrubbedClassLive,
        handLenBeforeScrub,
        handLenAfterScrub,
        focusedAfterScrub,
        incomingSafeState,
        endTurnReadyAtZeroEnergy,
        incomingLethalState,
        logExpandedVisible,
        docScrollHWithLog,
        logClosedAfterOutsideTap,
        restartsBefore,
        restartsAfter,
        moreMenuClosedAfterRestart,
      };
    })()`);

    assert.ok(fanAndCombatAudit.fan6MaxScroll <= 2, `6-card fan must fit in 1 screen without scroll, got maxScroll=${fanAndCombatAudit.fan6MaxScroll}`);
    assert.equal(fanAndCombatAudit.bludOpacity, 1, 'Stacked unplayable fan card must stay opaque (opacity=1) so cards underneath never bleed through');
    assert.equal(fanAndCombatAudit.powerBorderLeftW, '1px', 'Fan cards must keep unified 1px rarity border with no conflicting left-edge type stripe');
    assert.equal(fanAndCombatAudit.attackCostRadius, '5px', 'Attack cost emblem must use angular 5px silhouette');
    assert.equal(fanAndCombatAudit.skillCostRadius, '50%', 'Skill cost emblem must use round 50% silhouette');
    assert.equal(fanAndCombatAudit.powerArtRadius, '999px', 'Power art portrait must use oval medallion 999px silhouette');
    assert.ok(fanAndCombatAudit.docScrollH390 <= fanAndCombatAudit.winH390 + 1, `390x700 combat must fit in one screen (${fanAndCombatAudit.docScrollH390} <= ${fanAndCombatAudit.winH390})`);
    assert.ok(fanAndCombatAudit.docScrollW390 <= 390, `390px combat must have zero horizontal overflow (${fanAndCombatAudit.docScrollW390})`);
    assert.equal(fanAndCombatAudit.enemySingleRow, true, '3 enemies must render in a single horizontal row on 390px portrait');
    assert.equal(fanAndCombatAudit.middleStaggerHigher, true, 'Middle enemy in 3-enemy row should have subtle upward depth stagger');
    assert.equal(fanAndCombatAudit.incomingInitial.state, 'danger');
    assert.equal(fanAndCombatAudit.incomingInitial.total, 27);
    assert.equal(fanAndCombatAudit.incomingInitial.unblocked, 22);
    assert.equal(fanAndCombatAudit.selectedAfterTap1, true, '1st tap on overlapped fan card must focus/pop it up without playing');
    assert.equal(fanAndCombatAudit.blockAfterTap1, fanAndCombatAudit.blockBeforeTap);
    assert.ok(fanAndCombatAudit.blockAfterTap2 > fanAndCombatAudit.blockBeforeTap, '2nd tap on focused fan card must play it');
    assert.equal(fanAndCombatAudit.inspectedAfterTap, true, 'Tapping unplayable fan card must pop up .inspected-card preview');
    assert.equal(fanAndCombatAudit.inspectedAfterEmptyTap, false, 'Tapping empty combat area must dismiss inspected card');
    assert.equal(fanAndCombatAudit.scrubbedClassLive, true, 'Single-finger horizontal scrub across 1-screen fan must activate live .scrub-focused');
    assert.equal(fanAndCombatAudit.handLenAfterScrub, fanAndCombatAudit.handLenBeforeScrub, 'Scrubbing and releasing in tray must not accidentally play cards');
    assert.equal(fanAndCombatAudit.focusedAfterScrub, true, 'Releasing scrub over a card must leave it focused for preview/play');
    assert.equal(fanAndCombatAudit.incomingSafeState, 'safe', 'Incoming badge must turn safe when fully blocked');
    assert.equal(fanAndCombatAudit.endTurnReadyAtZeroEnergy, true, 'End Turn button must glow ready when no playable cards remain');
    assert.equal(fanAndCombatAudit.incomingLethalState, 'lethal', 'Incoming badge must turn lethal when unblocked damage >= HP');
    assert.equal(fanAndCombatAudit.logExpandedVisible, true, 'Tapping mobile log toggle must open floating log drawer');
    assert.ok(fanAndCombatAudit.docScrollHWithLog <= fanAndCombatAudit.winH390 + 1, 'Floating mobile log drawer must not expand page scrollHeight');
    assert.equal(fanAndCombatAudit.logClosedAfterOutsideTap, true, 'Tapping outside mobile log drawer must collapse it');
    assert.equal(fanAndCombatAudit.restartsAfter, fanAndCombatAudit.restartsBefore + 1, 'HUD More menu Restart Combat must restart encounter');
    assert.equal(fanAndCombatAudit.moreMenuClosedAfterRestart, true, 'Restarting combat from More menu must close drawer');

    // Verify 375x667 (iPhone SE) one-screen fit & zero overflow with 5-card fan + 4-enemy swarm fallback
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 375,
      height: 667,
      deviceScaleFactor: 2,
      mobile: true,
    });
    const seAudit = await cdp.evaluate(`(() => {
      const app = window.__SPIRE_APP__;
      const st = app.getState();
      const base = JSON.parse(JSON.stringify(st.combat.enemies[0]));
      st.combat.enemies = Array.from({ length: 4 }, (_, i) => ({
        ...JSON.parse(JSON.stringify(base)),
        id: 'sw_' + i,
        name: '史莱姆' + (i + 1),
        hp: 12,
        maxHp: 12,
      }));
      st.combat.hand = Array.from({ length: 5 }, (_, i) => ({
        instanceId: 'se_' + i,
        cardId: i % 2 === 0 ? 'strike' : 'defend',
        upgraded: false,
      }));
      app.render();
      const tray = document.getElementById('hand-tray');
      return {
        winW: window.innerWidth,
        winH: window.innerHeight,
        scrollW: document.documentElement.scrollWidth,
        scrollH: document.documentElement.scrollHeight,
        enemyDensity: document.getElementById('combat-arena')?.dataset?.enemyCount,
        trayMaxScroll: Math.max(0, tray.scrollWidth - tray.clientWidth),
      };
    })()`);
    assert.ok(seAudit.scrollW <= seAudit.winW, `375px iPhone SE must have zero horizontal overflow (${seAudit.scrollW} > ${seAudit.winW})`);
    assert.ok(seAudit.scrollH <= seAudit.winH + 1, `375x667 iPhone SE combat must fit in one screen (${seAudit.scrollH} > ${seAudit.winH})`);
    assert.equal(seAudit.enemyDensity, '4', '4-enemy swarm must activate data-enemy-count="4" compact 2x2 fallback');
    assert.ok(seAudit.trayMaxScroll <= 2, `5-card fan on 375px iPhone SE must fit in 1 screen without scroll, got maxScroll=${seAudit.trayMaxScroll}`);

    const exceptions = cdp.events.filter((e) => e.method === 'Runtime.exceptionThrown');
    const consoleErrors = cdp.events.filter(
      (e) => e.method === 'Runtime.consoleAPICalled' && e.params?.type === 'error'
    );
    assert.equal(exceptions.length, 0, `Uncaught exceptions: ${JSON.stringify(exceptions)}`);
    assert.equal(consoleErrors.length, 0, `Console errors: ${JSON.stringify(consoleErrors)}`);
  } finally {
    await session?.close();
  }
});

test('E2E toggle buttons keep identical dimensions and preserve modal scroll on desktop & mobile', { timeout: 60000 }, async (t) => {
  if (!resolveBrowserBinary()) {
    t.skip('Chromium/Chrome binary not available');
    return;
  }

  let session = null;
  try {
    session = await suite.openIsolatedPage();
    const { cdp, port } = session;
    await cdp.send('Runtime.enable');
    await cdp.send('Page.enable');
    await cdp.send('Page.bringToFront');
    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${port}/` });
    await new Promise((r) => setTimeout(r, 400));
    await launchHeroFromCharacterSelect(cdp, 'ironclad');

    async function runToggleStabilityAudit(viewport) {
      await cdp.send('Emulation.setDeviceMetricsOverride', {
        width: viewport.width,
        height: viewport.height,
        deviceScaleFactor: viewport.mobile ? 2 : 1,
        mobile: viewport.mobile,
      });
      await new Promise((r) => setTimeout(r, 60));

      return await cdp.evaluate(`(async () => {
        const waitForModalAnimations = async () => {
          const sheet = document.querySelector('#modal-backdrop .modal-sheet');
          if (!sheet) return;
          if (typeof sheet.getAnimations === 'function') {
            const anims = sheet.getAnimations();
            for (const anim of anims) {
              try {
                anim.finish();
              } catch {}
            }
            await Promise.race([
              Promise.all(anims.map((a) => a.finished.catch(() => {}))),
              new Promise((r) => setTimeout(r, 80)),
            ]);
          }
          await new Promise((r) => setTimeout(r, 20));
          const backdrop = document.getElementById('modal-backdrop');
          if (backdrop && backdrop.dataset.modalEnter !== 'false') {
            sheet.dispatchEvent(new AnimationEvent('animationend', { animationName: 'modalSheetIn', bubbles: true }));
          }
        };

        document.getElementById('btn-open-settings')?.click();
        const settingsModalInitialNode = document.getElementById('settings-modal');
        const settingsOpenAnimName = getComputedStyle(settingsModalInitialNode).animationName;
        await waitForModalAnimations();
        const settingsSettledAttr = document.getElementById('modal-backdrop')?.dataset?.modalEnter || '';

        const settingsToggleIds = [
          'btn-toggle-sound',
          'btn-toggle-damage-numbers',
          'btn-toggle-mobile-tap-confirm',
          'btn-toggle-mobile-hand-layout',
          'btn-toggle-expansion-characters',
          'btn-toggle-mechanic-tips',
        ];

        const measureRowTops = () =>
          Array.from(document.querySelectorAll('#settings-modal .settings-row')).map((row) =>
            Math.round(row.getBoundingClientRect().top * 10) / 10
          );

        const settingsResults = [];
        for (const id of settingsToggleIds) {
          const btnBefore = document.getElementById(id);
          const rectBefore = btnBefore.getBoundingClientRect();
          const topsBefore = measureRowTops();
          const testSoundBefore = document.getElementById('btn-test-sound')?.getBoundingClientRect();

          btnBefore.click();

          const btnAfter = document.getElementById(id);
          const rectAfter = btnAfter.getBoundingClientRect();
          const topsAfter = measureRowTops();
          const testSoundAfter = document.getElementById('btn-test-sound')?.getBoundingClientRect();
          const animAfterToggle = getComputedStyle(document.getElementById('settings-modal')).animationName;
          const sameNodeAfterToggle = document.getElementById('settings-modal') === settingsModalInitialNode;

          // Toggle back to verify reverse transition too
          btnAfter.click();
          const btnBack = document.getElementById(id);
          const rectBack = btnBack.getBoundingClientRect();
          const topsBack = measureRowTops();

          const maxRowShift1 = Math.max(
            0,
            ...topsBefore.map((t, i) => Math.abs((topsAfter[i] ?? t) - t))
          );
          const maxRowShift2 = Math.max(
            0,
            ...topsBefore.map((t, i) => Math.abs((topsBack[i] ?? t) - t))
          );

          settingsResults.push({
            id,
            wBefore: rectBefore.width,
            wAfter: rectAfter.width,
            wBack: rectBack.width,
            hBefore: rectBefore.height,
            hAfter: rectAfter.height,
            hBack: rectBack.height,
            maxRowShift: Math.max(maxRowShift1, maxRowShift2),
            animAfterToggle,
            sameNodeAfterToggle,
            soundPairHeightDiff:
              id === 'btn-toggle-sound' && testSoundBefore
                ? Math.max(
                    Math.abs(rectBefore.height - testSoundBefore.height),
                    Math.abs(rectAfter.height - testSoundAfter.height)
                  )
                : 0,
            testSoundShiftX:
              id === 'btn-toggle-sound' && testSoundBefore && testSoundAfter
                ? Math.abs(testSoundAfter.left - testSoundBefore.left)
                : 0,
          });
        }

        // Scroll down inside Settings modal and toggle a lower switch: scrollTop must be preserved
        const settingsBody = document.querySelector('#settings-modal .modal-body');
        const maxScroll = Math.max(0, settingsBody.scrollHeight - settingsBody.clientHeight);
        const targetScroll = Math.min(180, maxScroll);
        settingsBody.scrollTop = targetScroll;
        const scrollBeforeToggle = settingsBody.scrollTop;
        document.getElementById('btn-toggle-mechanic-tips')?.click();
        const scrollAfterToggle = document.querySelector('#settings-modal .modal-body').scrollTop;
        document.getElementById('btn-toggle-mechanic-tips')?.click();

        // Test animation speed buttons including off -> normal (must NOT replay modalSheetIn!)
        const speedBefore = document.getElementById('btn-anim-speed-fast').getBoundingClientRect();
        const topsSpeedBefore = measureRowTops();
        document.getElementById('btn-anim-speed-off')?.click();
        document.getElementById('btn-anim-speed-fast')?.click();
        const speedAfter = document.getElementById('btn-anim-speed-fast').getBoundingClientRect();
        const topsSpeedAfter = measureRowTops();
        const settingsAnimAfterOffToFast = getComputedStyle(document.getElementById('settings-modal')).animationName;
        const settingsSameNodeAfterSpeed = document.getElementById('settings-modal') === settingsModalInitialNode;
        document.getElementById('btn-anim-speed-normal')?.click();
        const speedShift = Math.max(
          Math.abs(speedAfter.width - speedBefore.width),
          Math.abs(speedAfter.height - speedBefore.height),
          ...topsSpeedBefore.map((t, i) => Math.abs((topsSpeedAfter[i] ?? t) - t))
        );

        document.getElementById('btn-close-modal')?.click();

        // Compendium upgrade toggle stability + scroll preservation + zero modalSheetIn replay
        document.getElementById('btn-open-compendium')?.click();
        await waitForModalAnimations();
        const compBody = document.querySelector('#compendium-modal .modal-body');
        compBody.scrollTop = Math.min(120, Math.max(0, compBody.scrollHeight - compBody.clientHeight));
        const compScrollBefore = compBody.scrollTop;
        const compBtnBefore = document.getElementById('btn-compendium-toggle-upgrade').getBoundingClientRect();
        document.getElementById('btn-compendium-toggle-upgrade')?.click();
        const compBtnAfter = document.getElementById('btn-compendium-toggle-upgrade').getBoundingClientRect();
        const compScrollAfter = document.querySelector('#compendium-modal .modal-body').scrollTop;
        const compAnimAfterToggle = getComputedStyle(document.getElementById('compendium-modal')).animationName;
        document.getElementById('btn-close-modal')?.click();

        // Deck stack toggle stability + zero modalSheetIn replay
        document.getElementById('btn-open-deck')?.click();
        await waitForModalAnimations();
        const deckBtnBefore = document.getElementById('btn-toggle-deck-stack').getBoundingClientRect();
        document.getElementById('btn-toggle-deck-stack')?.click();
        const deckBtnAfter = document.getElementById('btn-toggle-deck-stack').getBoundingClientRect();
        const deckAnimAfterToggle = getComputedStyle(document.querySelector('#modal-backdrop .modal-sheet')).animationName;
        document.getElementById('btn-close-modal')?.click();

        // Meta card-stats starter toggle stability + scroll preservation + zero modalSheetIn replay
        document.getElementById('btn-open-meta')?.click();
        await waitForModalAnimations();
        const metaBody = document.querySelector('#meta-progression-modal .modal-body');
        metaBody.scrollTop = Math.min(200, Math.max(0, metaBody.scrollHeight - metaBody.clientHeight));
        const metaScrollBefore = metaBody.scrollTop;
        const metaBtnBefore = document.getElementById('btn-toggle-card-stats-starters').getBoundingClientRect();
        document.getElementById('btn-toggle-card-stats-starters')?.click();
        const metaBtnAfter = document.getElementById('btn-toggle-card-stats-starters').getBoundingClientRect();
        const metaScrollAfter = document.querySelector('#meta-progression-modal .modal-body').scrollTop;
        const metaAnimAfterToggle = getComputedStyle(document.getElementById('meta-progression-modal')).animationName;
        document.getElementById('btn-close-modal')?.click();

        return {
          settingsOpenAnimName,
          settingsSettledAttr,
          settingsResults,
          maxScroll,
          scrollBeforeToggle,
          scrollAfterToggle,
          speedShift,
          settingsAnimAfterOffToFast,
          settingsSameNodeAfterSpeed,
          compDelta: {
            w: Math.abs(compBtnAfter.width - compBtnBefore.width),
            h: Math.abs(compBtnAfter.height - compBtnBefore.height),
            scrollDiff: Math.abs(compScrollAfter - compScrollBefore),
            scrollBefore: compScrollBefore,
            animAfterToggle: compAnimAfterToggle,
          },
          deckDelta: {
            w: Math.abs(deckBtnAfter.width - deckBtnBefore.width),
            h: Math.abs(deckBtnAfter.height - deckBtnBefore.height),
            animAfterToggle: deckAnimAfterToggle,
          },
          metaDelta: {
            w: Math.abs(metaBtnAfter.width - metaBtnBefore.width),
            h: Math.abs(metaBtnAfter.height - metaBtnBefore.height),
            scrollDiff: Math.abs(metaScrollAfter - metaScrollBefore),
            scrollBefore: metaScrollBefore,
            animAfterToggle: metaAnimAfterToggle,
          },
        };
      })()`);
    }

    for (const vp of [
      { label: 'desktop 1280x800', width: 1280, height: 800, mobile: false },
      { label: 'mobile 390x844', width: 390, height: 844, mobile: true },
    ]) {
      const audit = await runToggleStabilityAudit(vp);
      assert.equal(audit.settingsOpenAnimName, 'modalSheetIn', `[${vp.label}] initial Settings open should animate cleanly`);
      assert.equal(audit.settingsSettledAttr, 'false', `[${vp.label}] animationend should auto-settle data-modal-enter="false"`);
      for (const r of audit.settingsResults) {
        assert.ok(
          Math.abs(r.hAfter - r.hBefore) <= 0.5 && Math.abs(r.hBack - r.hBefore) <= 0.5,
          `[${vp.label}] ${r.id} height shifted: ${r.hBefore} -> ${r.hAfter} -> ${r.hBack}`
        );
        assert.ok(
          Math.abs(r.wAfter - r.wBefore) <= 1.5 && Math.abs(r.wBack - r.wBefore) <= 1.5,
          `[${vp.label}] ${r.id} width shifted: ${r.wBefore} -> ${r.wAfter} -> ${r.wBack}`
        );
        assert.ok(
          r.maxRowShift <= 0.5,
          `[${vp.label}] toggling ${r.id} shifted settings rows vertically by ${r.maxRowShift}px`
        );
        assert.equal(
          r.sameNodeAfterToggle,
          true,
          `[${vp.label}] toggling ${r.id} must update Settings modal in-place without recreating DOM`
        );
        assert.equal(
          r.animAfterToggle,
          'none',
          `[${vp.label}] toggling ${r.id} must not replay modalSheetIn flash (got ${r.animAfterToggle})`
        );
        assert.ok(
          r.soundPairHeightDiff <= 0.5,
          `[${vp.label}] #btn-toggle-sound and #btn-test-sound height mismatch: ${r.soundPairHeightDiff}px`
        );
        assert.ok(
          r.testSoundShiftX <= 1.5,
          `[${vp.label}] toggling sound shifted #btn-test-sound horizontally by ${r.testSoundShiftX}px`
        );
      }
      assert.ok(audit.speedShift <= 0.5, `[${vp.label}] anim speed toggle shifted layout by ${audit.speedShift}px`);
      assert.equal(audit.settingsSameNodeAfterSpeed, true, `[${vp.label}] switching animSpeed must update Settings in-place`);
      assert.equal(
        audit.settingsAnimAfterOffToFast,
        'none',
        `[${vp.label}] switching animSpeed off -> fast must not replay modalSheetIn flash`
      );
      if (audit.scrollBeforeToggle > 0) {
        assert.ok(
          Math.abs(audit.scrollAfterToggle - audit.scrollBeforeToggle) <= 1,
          `[${vp.label}] Settings modal scrollTop jumped from ${audit.scrollBeforeToggle} to ${audit.scrollAfterToggle}`
        );
      }
      assert.ok(
        audit.compDelta.w <= 1.5 && audit.compDelta.h <= 0.5,
        `[${vp.label}] Compendium upgrade toggle shifted size: w=${audit.compDelta.w}, h=${audit.compDelta.h}`
      );
      assert.equal(audit.compDelta.animAfterToggle, 'none', `[${vp.label}] Compendium toggle must not replay modalSheetIn`);
      if (audit.compDelta.scrollBefore > 0) {
        assert.ok(
          audit.compDelta.scrollDiff <= 1,
          `[${vp.label}] Compendium modal scrollTop jumped by ${audit.compDelta.scrollDiff}px`
        );
      }
      assert.ok(
        audit.deckDelta.w <= 1.5 && audit.deckDelta.h <= 0.5,
        `[${vp.label}] Deck stack toggle shifted size: w=${audit.deckDelta.w}, h=${audit.deckDelta.h}`
      );
      assert.equal(audit.deckDelta.animAfterToggle, 'none', `[${vp.label}] Deck stack toggle must not replay modalSheetIn`);
      assert.ok(
        audit.metaDelta.w <= 1.5 && audit.metaDelta.h <= 0.5,
        `[${vp.label}] Meta starter toggle shifted size: w=${audit.metaDelta.w}, h=${audit.metaDelta.h}`
      );
      assert.equal(audit.metaDelta.animAfterToggle, 'none', `[${vp.label}] Meta starter toggle must not replay modalSheetIn`);
      if (audit.metaDelta.scrollBefore > 0) {
        assert.ok(
          audit.metaDelta.scrollDiff <= 1,
          `[${vp.label}] Meta modal scrollTop jumped by ${audit.metaDelta.scrollDiff}px`
        );
      }
    }

    const exceptions = cdp.events.filter((e) => e.method === 'Runtime.exceptionThrown');
    const consoleErrors = cdp.events.filter(
      (e) => e.method === 'Runtime.consoleAPICalled' && e.params?.type === 'error'
    );
    assert.equal(exceptions.length, 0, `Uncaught exceptions: ${JSON.stringify(exceptions)}`);
    assert.equal(consoleErrors.length, 0, `Console errors: ${JSON.stringify(consoleErrors)}`);
  } finally {
    await session?.close();
  }
});
