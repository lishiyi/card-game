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

test('Real Chromium E2E: Treasure loot plaque, subdued unplayable cards, Lethal/Shield-Break previews, card synergy highlights, and desktop drag-to-play', async (t) => {
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
  } finally {
    await session?.close();
  }
});

test('Real Chromium E2E: Character Select screen (Desktop & Mobile), The Silent 3 archetypes (Poison-Lethal, Shivs, Interactive Discard), Resume Active Run, and ?char=silent URL Challenge', async (t) => {
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
  } finally {
    await session?.close();
  }
});

test('Real Chromium E2E: Daily Challenge + ?daily= invite + Shop Colorless shelf + Battle Report/History Review + Mobile 390x844 compact HUD, collapsible log, 2-tap confirm & touch swipe-up drag', async (t) => {
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
  } finally {
    await session?.close();
  }
});

test('Real Chromium E2E: New-Run Confirmation, Tiered Chests, Dual Shop Relics + Membership Card Live Discount, Act 2->3 Altar & Act 3 Boss UI (Desktop + Mobile)', async (t) => {
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
  } finally {
    await session?.close();
  }
});

test('Real Chromium E2E: Ascension 6-10 progression (11 pills/buttons, damaged start & 2 potion slots, A8 dynamic events, and A10 Act 3 Twin Boss UI)', async (t) => {
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
  } finally {
    await session?.close();
  }
});

test('The Defect Real Chromium E2E: 4-hero select, Adaptive Orb Rail (Desktop 1280px & Mobile 390px/375px zero-bloat/zero-overlap), Hologram/Seek modals, Orb FX/Audio & Compendium', async (t) => {
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
      height: 820,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${port}/index.html` });
    await new Promise((r) => setTimeout(r, 420));

    // 1. Desktop 1280px: Main Menu retains 杀戮尖塔 title; 4-hero Character Select (1 horizontal row, zero overflow, azure Defect card & launch)
    const selectAudit = await cdp.evaluate(`(() => {
      const mainMenuHasTitle = Boolean(document.querySelector('.menu-home-hud .game-title'));
      document.getElementById('btn-menu-standard')?.click();
      const stdSubmenuHasTitle = Boolean(document.querySelector('.top-hud .game-title'));
      const cards = [...document.querySelectorAll('.character-card')];
      const ids = cards.map((el) => el.dataset.characterId);
      const tops = cards.map((el) => Math.round(el.getBoundingClientRect().top));
      const overflowX = document.documentElement.scrollWidth - window.innerWidth;
      document.getElementById('char-card-defect')?.click();
      const defectSelected = document.getElementById('char-card-defect')?.classList.contains('selected');
      const defectAzure = document.getElementById('char-card-defect')?.classList.contains('theme-azure');
      const defectSvg = Boolean(document.querySelector('#char-card-defect .character-portrait-stage svg'));
      const launchBtn = document.getElementById('btn-start-character-run');
      const launchText = launchBtn?.textContent?.trim() || '';
      const launchAzure = launchBtn?.classList.contains('theme-azure');
      launchBtn?.click();
      const st = window.__SPIRE_APP__.getState();
      const inRunHasTitle = Boolean(document.querySelector('.top-hud.run-hud .game-title'));
      const seedInTopBrand = Boolean(document.querySelector('.top-hud.run-hud .brand-cluster #btn-copy-seed'));
      const seedInMoreMenu = Boolean(document.querySelector('#hud-more-menu #btn-copy-seed'));
      const seedHiddenOnDesktopTopBar = getComputedStyle(document.getElementById('btn-copy-seed')).display === 'none';
      document.getElementById('btn-open-settings')?.click();
      const settingsHasSeedBtn = Boolean(document.getElementById('btn-settings-copy-seed'));
      document.getElementById('btn-close-modal')?.click();
      return {
        mainMenuHasTitle,
        stdSubmenuHasTitle,
        inRunHasTitle,
        seedInTopBrand,
        seedInMoreMenu,
        seedHiddenOnDesktopTopBar,
        settingsHasSeedBtn,
        ids,
        allSameRow: Math.max(...tops) - Math.min(...tops) <= 4,
        overflowX,
        defectSelected,
        defectAzure,
        defectSvg,
        launchText,
        launchAzure,
        charId: st.characterId,
        maxHp: st.player.maxHp,
        starterRelic: st.player.relics[0],
        starterPotion: st.player.potions[0],
      };
    })()`);

    assert.equal(selectAudit.mainMenuHasTitle, true, 'Main Menu must retain top-left 杀戮尖塔 title');
    assert.equal(selectAudit.stdSubmenuHasTitle, false, 'Submenu must omit top-left 杀戮尖塔 title');
    assert.equal(selectAudit.inRunHasTitle, false, 'In-run HUD must omit top-left 杀戮尖塔 title');
    assert.equal(selectAudit.seedInTopBrand, false, 'Seed button must no longer occupy top brand bar');
    assert.equal(selectAudit.seedInMoreMenu, true, 'Seed button must live inside More menu');
    assert.equal(selectAudit.seedHiddenOnDesktopTopBar, true, 'Seed button must not clutter desktop top action bar');
    assert.equal(selectAudit.settingsHasSeedBtn, true, 'Settings modal must expose active run Seed & Copy Link button');
    assert.deepEqual(selectAudit.ids, ['ironclad', 'silent', 'watcher', 'defect']);
    assert.equal(selectAudit.allSameRow, true, 'All 4 hero cards must sit cleanly on 1 horizontal row on 1280px desktop');
    assert.ok(selectAudit.overflowX <= 1, `Desktop 4-hero select must not overflow horizontally: ${selectAudit.overflowX}`);
    assert.equal(selectAudit.defectSelected, true);
    assert.equal(selectAudit.defectAzure, true);
    assert.equal(selectAudit.defectSvg, true);
    assert.ok(selectAudit.launchText.includes('故障机器人'));
    assert.equal(selectAudit.launchAzure, true);
    assert.equal(selectAudit.charId, 'defect');
    assert.equal(selectAudit.maxHp, 75);
    assert.equal(selectAudit.starterRelic, 'cracked_core');
    assert.equal(selectAudit.starterPotion, 'focus_potion');

    // 2. Desktop 1280x820 Combat: verify Adaptive Side Rail geometry across 1, 2, 3 enemies × 3 & 10 orbs (ZERO overlap, 0px vertical bloat, rightmost front orb in 2-col)
    const desktopCombatAudit = await cdp.evaluate(`(() => {
      const app = window.__SPIRE_APP__;
      const st = app.getState();
      st.neowState = null;
      st.screen = 'map';
      app.render();
      document.getElementById('map-node-f1_c0')?.click();

      const s = app.getState();
      const baseEnemy = JSON.parse(JSON.stringify(s.combat.enemies[0]));
      baseEnemy.hp = 80;
      baseEnemy.maxHp = 80;
      baseEnemy.block = 0;
      baseEnemy.statuses = {};
      baseEnemy.intent = { id: 'idle', name: '蓄力', type: 'buff', summary: '蓄力' };

      const makeEnemies = (n) => Array.from({ length: n }, (_, i) => ({
        ...JSON.parse(JSON.stringify(baseEnemy)),
        id: 'e_' + i,
        name: '构装试炼体 ' + (i + 1),
      }));
      const makeOrbs = (n) => {
        const types = ['lightning', 'frost', 'dark', 'plasma'];
        return Array.from({ length: n }, (_, i) => ({
          type: types[i % 4],
          ...(types[i % 4] === 'dark' ? { darkStored: 12 } : {}),
        }));
      };

      const matrix = [];
      for (const enemyCount of [1, 2, 3]) {
        s.combat.enemies = makeEnemies(enemyCount);
        // Baseline without orb rail
        s.player.maxOrbSlots = 0;
        s.player.orbs = [];
        app.render();
        const baseArenaH = Math.round(document.getElementById('combat-arena').getBoundingClientRect().height);

        for (const slotCount of [3, 10]) {
          s.player.maxOrbSlots = slotCount;
          s.player.orbs = makeOrbs(slotCount);
          app.render();
          const arenaRect = document.getElementById('combat-arena').getBoundingClientRect();
          const desktopRail = document.getElementById('player-orb-rail-desktop');
          const mobileRail = document.getElementById('player-orb-rail-mobile');
          const enemySide = document.querySelector('.fighters-group.enemy-side');
          const railRect = desktopRail.getBoundingClientRect();
          const enemyRect = enemySide.getBoundingClientRect();
          const slot0Rect = desktopRail.querySelector('[data-orb-index="0"]').getBoundingClientRect();
          const slot1Rect = desktopRail.querySelector('[data-orb-index="1"]').getBoundingClientRect();
          matrix.push({
            enemyCount,
            slotCount,
            desktopVisible: railRect.width > 0 && railRect.height > 0,
            mobileHidden: getComputedStyle(mobileRail).display === 'none',
            slotDomCount: desktopRail.querySelectorAll('.orb-slot').length,
            hasFrontRing: Boolean(desktopRail.querySelector('.orb-slot.orb-front')),
            frontRightOfSecondInTwoCol: slotCount > 5 ? slot0Rect.left > slot1Rect.left : true,
            overlapEnemy: Math.round(railRect.right - enemyRect.left),
            arenaHeightDelta: Math.round(arenaRect.height - baseArenaH),
            overflowX: document.documentElement.scrollWidth - window.innerWidth,
          });
        }
      }
      return matrix;
    })()`);

    for (const row of desktopCombatAudit) {
      assert.equal(row.desktopVisible, true, `Desktop orb rail must be visible (${row.enemyCount}e/${row.slotCount}o)`);
      assert.equal(row.mobileHidden, true, `Mobile inline orb rail must be hidden on desktop (${row.enemyCount}e/${row.slotCount}o)`);
      assert.equal(row.slotDomCount, row.slotCount);
      assert.equal(row.hasFrontRing, true);
      assert.equal(row.frontRightOfSecondInTwoCol, true, `Desktop 2-col orb rail must place front orb #1 in rightmost column (${row.enemyCount}e/${row.slotCount}o)`);
      assert.ok(row.overlapEnemy <= 1, `Desktop orb rail overlapped enemy side by ${row.overlapEnemy}px (${row.enemyCount}e/${row.slotCount}o)`);
      assert.ok(row.arenaHeightDelta <= 4, `Desktop orb rail bloated arena height by ${row.arenaHeightDelta}px (${row.enemyCount}e/${row.slotCount}o)`);
      assert.ok(row.overflowX <= 1, `Desktop overflowX=${row.overflowX} (${row.enemyCount}e/${row.slotCount}o)`);
    }

    // 3. Interactive Defect Card Play: Zap + Dualcast (Orb audio/FX), Hologram modal, Seek modal, Negative Focus & Defect Strike/Defend SVGs
    const interactionAudit = await cdp.evaluate(`(() => {
      const app = window.__SPIRE_APP__;
      const s = app.getState();
      s.combat.enemies = [s.combat.enemies[0]];
      s.combat.enemies[0].hp = 100;
      s.combat.enemies[0].maxHp = 100;
      s.combat.enemies[0].statuses = { lockOn: 2 };
      s.player.maxOrbSlots = 3;
      s.player.orbs = [];
      s.player.energy = 6;
      s.player.statuses = { focus: -2 };
      s.combat.discardPile = [{ instanceId: 'disc_claw', cardId: 'claw', upgraded: false }];
      s.combat.drawPile = [{ instanceId: 'draw_turbo', cardId: 'turbo', upgraded: false }];
      s.combat.hand = [
        { instanceId: 'h_strike', cardId: 'strike', upgraded: false },
        { instanceId: 'h_defend', cardId: 'defend', upgraded: false },
        { instanceId: 'h_zap', cardId: 'zap', upgraded: false },
        { instanceId: 'h_dual', cardId: 'dualcast', upgraded: false },
        { instanceId: 'h_holo', cardId: 'hologram', upgraded: false },
        { instanceId: 'h_seek', cardId: 'seek', upgraded: false },
      ];
      app.render();

      const hasNegFocusSvg = Boolean(document.querySelector('[data-status-svg="focus_down"]'));
      const hasLockOnSvg = Boolean(document.querySelector('[data-status-svg="lockOn"]'));
      const hasDefectStrikeArt = Boolean(document.querySelector('#hand-card-h_strike [id^="ca-defect_strike"]'));
      const hasDefectDefendArt = Boolean(document.querySelector('#hand-card-h_defend [id^="ca-defect_defend"]'));

      // Play Zap -> channels Lightning
      app.clearRecentAudioCues();
      document.getElementById('hand-card-h_zap')?.click();
      const orbsAfterZap = app.getState().player.orbs.map((o) => o.type);

      // Play Dualcast -> evokes Lightning & triggers orb_evoke audio
      app.clearRecentAudioCues();
      document.getElementById('hand-card-h_dual')?.click();
      const cuesAfterDualcast = app.getRecentAudioCues();
      const orbsAfterDualcast = app.getState().player.orbs.length;

      // Play Hologram -> opens discard modal -> click candidate -> returns claw to hand
      document.getElementById('hand-card-h_holo')?.click();
      const holoModalOpen = Boolean(document.getElementById('discard-choice-modal'));
      document.querySelector('#discard-choice-modal [data-action="resolve-card-choice"]')?.click();
      const clawInHand = app.getState().combat.hand.some((c) => c.instanceId === 'disc_claw');

      // Play Seek -> opens draw-pile search modal -> click candidate -> adds turbo to hand
      document.getElementById('hand-card-h_seek')?.click();
      const seekModalOpen = Boolean(document.getElementById('discard-choice-modal'));
      const seekTitle = document.querySelector('#discard-choice-modal #modal-title')?.textContent || '';
      document.querySelector('#discard-choice-modal [data-action="resolve-card-choice"]')?.click();
      const turboInHand = app.getState().combat.hand.some((c) => c.instanceId === 'draw_turbo');

      return {
        hasNegFocusSvg,
        hasLockOnSvg,
        hasDefectStrikeArt,
        hasDefectDefendArt,
        orbsAfterZap,
        cuesAfterDualcast,
        orbsAfterDualcast,
        holoModalOpen,
        clawInHand,
        seekModalOpen,
        seekTitle,
        turboInHand,
      };
    })()`);

    assert.equal(interactionAudit.hasNegFocusSvg, true, 'Negative Focus must render crimson focus_down SVG chip');
    assert.equal(interactionAudit.hasLockOnSvg, true, 'Lock-On must render bespoke lockOn SVG chip');
    assert.equal(interactionAudit.hasDefectStrikeArt, true, 'Defect Strike must render bespoke defect_strike SVG');
    assert.equal(interactionAudit.hasDefectDefendArt, true, 'Defect Defend must render bespoke defect_defend SVG');
    assert.deepEqual(interactionAudit.orbsAfterZap, ['lightning']);
    assert.equal(interactionAudit.orbsAfterDualcast, 0);
    assert.ok(interactionAudit.cuesAfterDualcast.includes('orb_evoke'), `Expected orb_evoke cue, got ${JSON.stringify(interactionAudit.cuesAfterDualcast)}`);
    assert.equal(interactionAudit.holoModalOpen, true, 'Hologram must open discard retrieval modal');
    assert.equal(interactionAudit.clawInHand, true, 'Selecting card in Hologram modal must move it into hand');
    assert.equal(interactionAudit.seekModalOpen, true, 'Seek must open draw pile search modal');
    assert.ok(interactionAudit.seekTitle.includes('抽牌堆'), `Seek modal title should reference draw pile: ${interactionAudit.seekTitle}`);
    assert.equal(interactionAudit.turboInHand, true, 'Selecting card in Seek modal must add it into hand');

    // 4. Compendium "故障机器人" class filter lists all 73 Defect cards
    const compAudit = await cdp.evaluate(`(() => {
      document.getElementById('btn-open-compendium')?.click();
      document.querySelector('[data-action="set-compendium-char"][data-char-filter="defect"]')?.click();
      const total = document.querySelectorAll('#compendium-cards-grid .game-card, #compendium-cards-grid .compendium-silhouette-card').length;
      document.getElementById('btn-close-modal')?.click();
      return { total };
    })()`);
    assert.equal(compAudit.total, 73, 'Compendium Defect filter must display all 73 Defect cards');

    // 5. Mobile 390x844 & 375x667: Adaptive Inline Orb Rail (zero-bloat, zero-overflow, rightmost front orb, tooltip tap, Seed in ☰ menu)
    for (const vp of [
      { width: 390, height: 844 },
      { width: 375, height: 667 },
    ]) {
      await cdp.send('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 2,
        mobile: true,
      });
      await new Promise((r) => setTimeout(r, 150));

      const mobileCombatAudit = await cdp.evaluate(`(() => {
        const app = window.__SPIRE_APP__;
        const s = app.getState();
        const baseEnemy = JSON.parse(JSON.stringify(s.combat.enemies[0]));
        baseEnemy.hp = 60;
        baseEnemy.maxHp = 60;
        baseEnemy.statuses = {};
        const makeEnemies = (n) => Array.from({ length: n }, (_, i) => ({
          ...JSON.parse(JSON.stringify(baseEnemy)),
          id: 'me_' + i,
          name: '试炼体 ' + (i + 1),
        }));
        const makeOrbs = (n) => {
          const types = ['lightning', 'frost', 'dark', 'plasma'];
          return Array.from({ length: n }, (_, i) => ({
            type: types[i % 4],
            ...(types[i % 4] === 'dark' ? { darkStored: 18 } : {}),
          }));
        };

        const cases = [];
        for (const [enemyCount, slotCount] of [
          [1, 3],
          [1, 5],
          [2, 3],
          [3, 10],
        ]) {
          s.combat.enemies = makeEnemies(enemyCount);
          s.player.maxOrbSlots = slotCount;
          s.player.orbs = makeOrbs(slotCount);
          app.render();
          const mRail = document.getElementById('player-orb-rail-mobile');
          const dRail = document.getElementById('player-orb-rail-desktop');
          const turnBadge = document.querySelector('#player-unit .player-turn-badge');
          const handBarText = document.getElementById('mobile-hand-bar')?.textContent || '';
          const mRect = mRail.getBoundingClientRect();
          const frontSlotRect = mRail.querySelector('[data-orb-index="0"]').getBoundingClientRect();
          const secondSlotRect = mRail.querySelector('[data-orb-index="1"]').getBoundingClientRect();
          const sameRowMaxRight = Math.max(
            ...[...mRail.querySelectorAll('.orb-slot')]
              .map((el) => el.getBoundingClientRect())
              .filter((r) => Math.abs(r.top - frontSlotRect.top) <= 4)
              .map((r) => Math.round(r.right))
          );
          cases.push({
            enemyCount,
            slotCount,
            mobileVisible: mRect.width > 0 && mRect.height > 0,
            desktopHidden: getComputedStyle(dRail).display === 'none',
            turnBadgeHidden: getComputedStyle(turnBadge).display === 'none',
            handBarHasTurn: /T\\d+/.test(handBarText),
            frontIsRightmost: Math.round(frontSlotRect.right) >= sameRowMaxRight - 1 && frontSlotRect.left > secondSlotRect.left,
            overflowX: document.documentElement.scrollWidth - window.innerWidth,
            scrollHeight: document.documentElement.scrollHeight,
          });
        }

        // Open mobile ☰ menu -> verify Seed button visible inside drawer -> clicking closes drawer
        document.getElementById('btn-hud-more')?.click();
        const seedRectInDrawer = document.getElementById('btn-copy-seed')?.getBoundingClientRect();
        const mobileSeedVisibleInMenu = Boolean(seedRectInDrawer && seedRectInDrawer.width > 0 && seedRectInDrawer.height > 0);
        document.getElementById('btn-copy-seed')?.click();
        const menuClosedAfterSeedCopy = !document.getElementById('hud-more-menu')?.classList.contains('open');

        // Tap mobile orb rail to open ordered tooltip
        document.getElementById('player-orb-rail-mobile')?.click();
        const tip = document.getElementById('spire-tooltip');
        const tipVisible = Boolean(tip && !tip.hidden);
        const tipDesc = tip?.textContent || '';
        return { cases, mobileSeedVisibleInMenu, menuClosedAfterSeedCopy, tipVisible, tipDesc };
      })()`);

      for (const c of mobileCombatAudit.cases) {
        assert.equal(c.mobileVisible, true, `Mobile ${vp.width}px inline orb rail must be visible (${c.enemyCount}e/${c.slotCount}o)`);
        assert.equal(c.desktopHidden, true, `Mobile ${vp.width}px must hide desktop side rail`);
        assert.equal(c.turnBadgeHidden, true, `Mobile ${vp.width}px must swap out .player-turn-badge for +0px bloat`);
        assert.equal(c.handBarHasTurn, true, `Mobile ${vp.width}px hand bar must show compact turn tag (T1)`);
        assert.equal(c.frontIsRightmost, true, `Mobile ${vp.width}px front next-to-evoke orb #1 must sit on the FAR RIGHT (${c.enemyCount}e/${c.slotCount}o)`);
        assert.ok(c.overflowX <= 1, `Mobile ${vp.width}px overflowX=${c.overflowX} (${c.enemyCount}e/${c.slotCount}o)`);
        if (vp.width === 390 && c.enemyCount === 1 && c.slotCount <= 5) {
          assert.ok(c.scrollHeight <= 844, `390x844 1-enemy ${c.slotCount}-orb combat must fit cleanly in 844px (got ${c.scrollHeight}px)`);
        }
      }
      assert.equal(mobileCombatAudit.mobileSeedVisibleInMenu, true, `Mobile ${vp.width}px ☰ menu must show Seed copy button`);
      assert.equal(mobileCombatAudit.menuClosedAfterSeedCopy, true, `Mobile ${vp.width}px ☰ menu must close after tapping Seed`);
      assert.equal(mobileCombatAudit.tipVisible, true, `Tapping mobile ${vp.width}px orb rail must open ordered tooltip`);
      assert.ok(mobileCombatAudit.tipDesc.includes('#1 队首·最右'), `Tooltip should note rightmost front orb first: ${mobileCombatAudit.tipDesc}`);
    }

    // 6. Verify 375px Mobile 4-tab Character Select stays single-line with zero horizontal overflow
    await cdp.evaluate(`window.localStorage.clear();`);
    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${port}/index.html` });
    await new Promise((r) => setTimeout(r, 380));
    const mobile375Tabs = await cdp.evaluate(`(() => {
      document.getElementById('btn-menu-standard')?.click();
      const tabs = [...document.querySelectorAll('#mobile-char-tabs .mobile-char-tab')];
      const defectNameEl = document.querySelector('#mobile-char-tab-defect .mobile-char-tab-name');
      return {
        tabCount: tabs.length,
        overflowX: document.documentElement.scrollWidth - window.innerWidth,
        defectNameHeight: defectNameEl ? Math.round(defectNameEl.getBoundingClientRect().height) : 0,
      };
    })()`);
    assert.equal(mobile375Tabs.tabCount, 4);
    assert.ok(mobile375Tabs.overflowX <= 1, `375px 4-tab Character Select must not overflow horizontally: ${mobile375Tabs.overflowX}`);
    assert.ok(mobile375Tabs.defectNameHeight > 0 && mobile375Tabs.defectNameHeight <= 20, `故障机器人 tab name must stay single-line on 375px (height=${mobile375Tabs.defectNameHeight})`);

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
