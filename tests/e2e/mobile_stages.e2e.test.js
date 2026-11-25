import test, { after } from "node:test";
import assert from "node:assert/strict";
import {
  createSharedBrowserSuite,
  launchHeroFromCharacterSelect,
  resolveBrowserBinary,
} from "../helpers/cdp.js";

const suite = createSharedBrowserSuite();
after(async () => {
  await suite.stop();
});

test('Real Chromium E2E: Mobile portrait (<=768px) modal top-row clearance & overscroll lock, potion-row restart/new-run actions, and right-side End Turn & Proceed buttons', async (t) => {
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
      const banner = document.getElementById('combat-banner').getBoundingClientRect();
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
        bannerInlineBetweenEnergyAndEndTurn:
          Boolean(document.querySelector('.dock-controls #combat-banner')) &&
          banner.left >= energy.right - 1 &&
          banner.right <= endTurn.left + 1 &&
          Math.abs((banner.top + banner.height / 2) - (energy.top + energy.height / 2)) <= 4,
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
    assert.equal(combat390.bannerInlineBetweenEnergyAndEndTurn, true, 'Combat banner must sit inline between Energy orb and End Turn button at 390px');

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
      const banner = document.getElementById('combat-banner').getBoundingClientRect();
      const restartBtn = document.getElementById('btn-restart-combat').getBoundingClientRect();
      const deckBtn = document.getElementById('btn-open-deck').getBoundingClientRect();
      const moreBtn = document.getElementById('btn-hud-more').getBoundingClientRect();
      return {
        endTurnRightAligned: Math.abs(dock.right - endTurn.right) <= 2,
        pilesRightAligned: Math.abs(dock.right - exhaust.right) <= 2 && draw.right <= discard.left && discard.right <= exhaust.left,
        restartAboveEnergy: restartBtn.bottom <= energy.top + 1 && Math.abs(restartBtn.left - dock.left) <= 2,
        moreSameRowAsDeck: Math.abs(moreBtn.top - deckBtn.top) <= 2 && moreBtn.width > 0,
        bannerBetweenEnergyAndEndTurn: banner.left >= energy.right - 1 && banner.right <= endTurn.left + 1,
      };
    })()`);
    assert.equal(combat640.endTurnRightAligned, true, '640px End Turn button must align to right edge');
    assert.equal(combat640.pilesRightAligned, true, '640px Draw/Discard/Exhaust pile buttons must align to right edge');
    assert.equal(combat640.restartAboveEnergy, true, '640px Restart Combat button must sit far-left above Energy');
    assert.equal(combat640.moreSameRowAsDeck, true, '640px More menu button must share the Deck/Map row');
    assert.equal(combat640.bannerBetweenEnergyAndEndTurn, true, '640px Combat banner must sit inline between Energy and End Turn');

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
  } finally {
    await session?.close();
  }
});

test('Stage 1 Real Chromium E2E: per-character Ascension isolation, interactive Armaments/True Grit+/Scry modal, Act 2 new enemies SVG/statuses, and new Event UI', async (t) => {
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
  } finally {
    await session?.close();
  }
});

test('Stage 1.1 & Stage 2 Real Chromium E2E: 3-hero Character Select, Watcher Stances/Wrath Danger/Divinity UI, Cut Through Fate Scry Modal, and Mobile 390px HUD & Scry Polish', async (t) => {
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
    assert.ok(potionTip.title.includes('狂怒药水'), `Unexpected potion tooltip title: ${potionTip.title}`);

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
  } finally {
    await session?.close();
  }
});

test('P0 & P1 Real Chromium E2E: ?debug=1 unlock guard, PWA endpoints, 4-tab Compendium (Desktop + 390px Mobile), HUD P1 relic counters & Black Star/Singing Bowl reward UI', async (t) => {
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
      const desktopDiscEl = document.querySelector('#compendium-cards-grid .game-card');
      const desktopSilEl = document.querySelector('#compendium-cards-grid .compendium-silhouette-card');
      const desktopDiscWidth = desktopDiscEl ? desktopDiscEl.getBoundingClientRect().width : 0;
      const desktopSilWidth = desktopSilEl ? desktopSilEl.getBoundingClientRect().width : 0;
      const desktopTopBorder = desktopDiscEl?.querySelector('.card-top')
        ? getComputedStyle(desktopDiscEl.querySelector('.card-top')).borderBottomWidth
        : '';
      const desktopArtH = desktopDiscEl?.querySelector('.card-art-frame')
        ? desktopDiscEl.querySelector('.card-art-frame').getBoundingClientRect().height
        : 0;
      const desktopArtViewBox = desktopDiscEl?.querySelector('.card-art-svg')?.getAttribute('viewBox') || '';
      document.getElementById('btn-comp-tab-relics').click();
      const discoveredRelics = document.querySelectorAll('#compendium-relics-grid [data-discovered="true"]').length;
      return {
        penNibPill,
        nunchakuPill,
        lizardPill,
        hasExtraRelicBtn,
        proceedBtnText,
        discoveredCards,
        desktopDiscWidth,
        desktopSilWidth,
        desktopTopBorder,
        desktopArtH,
        desktopArtViewBox,
        discoveredRelics,
      };
    })()`);
    assert.equal(p1UiAudit.penNibPill, '9/10 就绪!');
    assert.equal(p1UiAudit.nunchakuPill, '4/10');
    assert.equal(p1UiAudit.lizardPill, '已耗尽');
    assert.equal(p1UiAudit.hasExtraRelicBtn, true, 'Black Star renders #btn-claim-extra-relic on Reward screen');
    assert.ok(p1UiAudit.proceedBtnText.includes('+2 最大生命'), 'Singing Bowl shows +2 Max HP skip hint');
    assert.ok(p1UiAudit.discoveredCards >= 4, 'Starter Watcher cards auto-discovered in Compendium');
    assert.ok(p1UiAudit.discoveredRelics >= 6, 'Owned relics auto-discovered in Compendium');
    assert.ok(p1UiAudit.desktopDiscWidth > 0 && p1UiAudit.desktopSilWidth > 0, 'Desktop Compendium must show both discovered and silhouette cards');
    assert.ok(
      Math.abs(p1UiAudit.desktopDiscWidth - p1UiAudit.desktopSilWidth) <= 1,
      `Desktop Compendium silhouette width (${p1UiAudit.desktopSilWidth}) must match discovered card width (${p1UiAudit.desktopDiscWidth})`
    );
    assert.equal(p1UiAudit.desktopTopBorder, '0px', 'Card header (.card-top) must not have a bottom divider line');
    assert.ok(p1UiAudit.desktopArtH >= 72, `Desktop showcase .card-art-frame height must be enlarged (>=72px), got ${p1UiAudit.desktopArtH}`);
    assert.equal(p1UiAudit.desktopArtViewBox, '0 0 128 72', 'Card SVG art must use expanded 128x72 viewBox');

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
      const silCard = document.querySelector('#compendium-cards-grid .compendium-silhouette-card');
      const compCardWidth = compCard ? compCard.getBoundingClientRect().width : 0;
      const silCardWidth = silCard ? silCard.getBoundingClientRect().width : 0;
      const mobileArtH = compCard?.querySelector('.card-art-frame')
        ? compCard.querySelector('.card-art-frame').getBoundingClientRect().height
        : 0;
      const compCardOpacity = compCard ? getComputedStyle(compCard).opacity : '0';
      document.getElementById('btn-comp-tab-enemies').click();
      const enemiesOverflow = document.documentElement.scrollWidth > window.innerWidth + 1;
      document.getElementById('btn-close-modal').click();

      // Open Deck modal and verify cards render at full opacity (NOT dimmed like disabled buttons)
      document.getElementById('btn-open-deck').click();
      const deckCard = document.querySelector('#modal-backdrop .game-card');
      const deckCardOpacity = deckCard ? getComputedStyle(deckCard).opacity : '0';
      const deckCardCursor = deckCard ? getComputedStyle(deckCard).cursor : '';
      return {
        cardsOverflow,
        enemiesOverflow,
        compCardWidth,
        silCardWidth,
        mobileArtH,
        compCardOpacity,
        deckCardOpacity,
        deckCardCursor,
      };
    })()`);
    assert.equal(mobileCompAudit.cardsOverflow, false, 'Compendium Cards tab must not overflow 390px mobile');
    assert.equal(mobileCompAudit.enemiesOverflow, false, 'Compendium Enemies tab must not overflow 390px mobile');
    assert.ok(mobileCompAudit.compCardWidth > 0 && mobileCompAudit.silCardWidth > 0, 'Mobile Compendium must show both discovered and silhouette cards');
    assert.ok(
      Math.abs(mobileCompAudit.compCardWidth - mobileCompAudit.silCardWidth) <= 1,
      `Mobile Compendium silhouette width (${mobileCompAudit.silCardWidth}) must match discovered card width (${mobileCompAudit.compCardWidth})`
    );
    assert.ok(mobileCompAudit.mobileArtH >= 74, `Mobile showcase .card-art-frame height must be enlarged (>=74px), got ${mobileCompAudit.mobileArtH}`);
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

    // 6. Debug URL (/?debug=1) on 390px mobile: return to Main Menu -> verify Daily Challenge distinct cerulean theme -> Daily Challenge screen & verify #btn-unlock-all-meta
    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${port}/?debug=1` });
    await new Promise((r) => setTimeout(r, 350));
    const menuThemeAudit = await cdp.evaluate(`(() => {
      if (!document.getElementById('main-menu-screen') && !document.getElementById('daily-challenge-banner')) {
        document.getElementById('btn-new-run')?.click();
        document.getElementById('btn-confirm-new-run')?.click();
      }
      if (!document.getElementById('main-menu-screen')) {
        document.getElementById('btn-back-main-menu')?.click();
      }
      const parseRgb = (str) => {
        const m = String(str || '').match(/rgba?\\((\\d+),\\s*(\\d+),\\s*(\\d+)/);
        return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : null;
      };
      const dailyBtn = document.getElementById('btn-menu-daily');
      const watcherCrest = document.querySelector('.main-menu-crest-avatar.theme-amethyst');
      const dailyBorder = dailyBtn ? parseRgb(getComputedStyle(dailyBtn).borderColor) : null;
      const dailyBg = dailyBtn ? parseRgb(getComputedStyle(dailyBtn).backgroundImage) : null;
      const watcherBorder = watcherCrest ? parseRgb(getComputedStyle(watcherCrest).borderColor) : null;
      document.getElementById('btn-menu-daily')?.click();
      return { dailyBorder, dailyBg, watcherBorder };
    })()`);
    assert.ok(menuThemeAudit.dailyBorder && menuThemeAudit.watcherBorder, 'Main menu daily card and watcher crest must exist');
    assert.ok(
      menuThemeAudit.watcherBorder[0] > menuThemeAudit.watcherBorder[1] &&
        menuThemeAudit.watcherBorder[2] > menuThemeAudit.watcherBorder[1],
      `Watcher crest border should remain purple (R,B > G), got ${JSON.stringify(menuThemeAudit.watcherBorder)}`
    );
    assert.ok(
      menuThemeAudit.dailyBorder[2] > menuThemeAudit.dailyBorder[0] &&
        menuThemeAudit.dailyBorder[1] > menuThemeAudit.dailyBorder[0],
      `Daily Challenge menu card border should be cerulean blue (B,G > R, distinct from Watcher purple), got ${JSON.stringify(menuThemeAudit.dailyBorder)}`
    );
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
  } finally {
    await session?.close();
  }
});

test('v2 Real Chromium E2E: Mobile icon relics, nav emojis, mobile next-intent popover, Deck stats/sort/stack, Settings Save Backup, Campfire Relics, Interactive Headbutt/Meditate/Well-Laid Plans, Restart count & SW Update banner', async (t) => {
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
  } finally {
    await session?.close();
  }
});
