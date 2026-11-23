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

test('E2E: Distinct Bespoke Potion SVGs (HUD/Reward/Shop/Compendium/CharSelect) + Dead Enemy Battlefield Cleanup & Minion Flee Victory', async (t) => {
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
  } finally {
    await session?.close();
  }
});

test('E2E Act 4 & Three Keys: HUD 3-key pill (desktop & 390px mobile zero overflow), Burning Elite map flame, Campfire Recall, Treasure Sapphire Key choice, Reward Emerald Key, Act 4 Spire Door Gate, 4-floor Map, Shield & Spear + Corrupt Heart bespoke SVGs & True Ending', async (t) => {
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
  } finally {
    await session?.close();
  }
});

test('E2E: Havoc & random card reveal overlay + Fatal (斩杀) keyword tooltip & Minion preview suppression (Desktop & 390px Mobile)', async (t) => {
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
    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${port}/` });
    await new Promise((r) => setTimeout(r, 350));
    await launchHeroFromCharacterSelect(cdp, 'ironclad');

    const desktopAudit = await cdp.evaluate(`(async () => {
      const app = window.__SPIRE_APP__;
      const st = app.getState();
      const { ENCOUNTERS } = await import('./src/data/enemies.js');
      const { startCombat } = await import('./src/engine/combat.js');
      const { transitionCombatVictory } = await import('./src/engine/game.js');

      const glEnc = ENCOUNTERS.act2Elite.find((e) => e.id === 'gremlin_leader_elite');
      startCombat(st, glEnc, 'elite', transitionCombatVictory);
      const c = st.combat;
      const minion = c.enemies.find((e) => e.isMinion);
      const leader = c.enemies.find((e) => e.templateId === 'gremlin_leader');
      minion.hp = 5;
      minion.block = 0;
      leader.hp = 5;
      leader.block = 0;

      c.hand = [
        { instanceId: 'e2e_havoc', cardId: 'havoc', upgraded: false },
        { instanceId: 'e2e_feed', cardId: 'feed', upgraded: false },
        { instanceId: 'e2e_tg', cardId: 'true_grit', upgraded: false },
        { instanceId: 'e2e_def', cardId: 'defend', upgraded: false },
      ];
      c.drawPile = [{ instanceId: 'e2e_bash', cardId: 'bash', upgraded: false }];
      c.discardPile = [];
      st.player.energy = 6;
      app.render();

      // 1. Feed keyword trigger displays 斩杀 and opens tooltip without playing card
      const feedKwEl = document.querySelector('#hand-card-e2e_feed .card-kw-trigger');
      const feedKwText = feedKwEl?.textContent?.trim() || '';
      const handLenBeforeKw = c.hand.length;
      feedKwEl?.click();
      const tooltipEl = document.getElementById('spire-tooltip');
      const tooltipVisible = Boolean(tooltipEl && !tooltipEl.hidden);
      const tooltipText = tooltipEl?.textContent || '';
      const handLenAfterKw = c.hand.length;
      document.body.click();

      // 2. Select Feed -> verify Minion preview warns 爪牙不触发斩杀 while Leader preview shows +3上限
      document.getElementById('hand-card-e2e_feed')?.click();
      const minionPreviewText =
        document.querySelector('#enemy-unit-' + minion.id + ' .preview-pill.lethal')?.textContent?.trim() || '';
      const leaderPreviewText =
        document.querySelector('#enemy-unit-' + leader.id + ' .preview-pill.lethal')?.textContent?.trim() || '';

      // 3. Kill Minion with Feed -> maxHp must NOT increase!
      const maxHpBeforeFeed = st.player.maxHp;
      document.getElementById('enemy-unit-' + minion.id)?.click();
      const maxHpAfterFeed = st.player.maxHp;

      // Keep leader alive with high HP so Havoc -> Bash doesn't end combat prematurely
      leader.hp = 80;
      leader.maxHp = 80;
      for (const e of c.enemies) {
        if (e.hp > 0 && e.id !== leader.id) e.hp = 80;
      }
      app.render();

      // 4. Play Havoc -> verify visual .fx-card-reveal-stage shows Bash + #combat-banner names 痛击
      document.getElementById('hand-card-e2e_havoc')?.click();
      const revealStage = document.querySelector('#spire-fx-layer .fx-card-reveal-stage[data-fx-reveal="true"]');
      const revealItem = revealStage?.querySelector('.fx-card-reveal-item[data-reveal-kind="auto_play"][data-reveal-card-id="bash"]');
      const revealCardName = revealItem?.querySelector('.card-name')?.textContent?.trim() || '';
      const revealBadgeText = revealItem?.querySelector('.fx-card-reveal-badge')?.textContent?.trim() || '';
      const bannerTextAfterHavoc = document.getElementById('combat-banner')?.textContent?.trim() || '';

      return {
        feedKwText,
        handUnchangedOnKwClick: handLenBeforeKw === handLenAfterKw,
        tooltipVisible,
        tooltipHasFatalExplain: tooltipText.includes('斩杀') && tooltipText.includes('爪牙'),
        minionPreviewText,
        leaderPreviewText,
        maxHpBeforeFeed,
        maxHpAfterFeed,
        hasRevealStage: Boolean(revealStage),
        hasBashRevealItem: Boolean(revealItem),
        revealCardName,
        revealBadgeText,
        bannerTextAfterHavoc,
      };
    })()`);

    assert.ok(desktopAudit.feedKwText.includes('斩杀'), `Feed must show 斩杀 keyword chip, got: ${desktopAudit.feedKwText}`);
    assert.equal(desktopAudit.handUnchangedOnKwClick, true, 'Clicking 斩杀 keyword chip must NOT play Feed');
    assert.equal(desktopAudit.tooltipVisible, true, 'Clicking 斩杀 keyword chip must open tooltip');
    assert.equal(desktopAudit.tooltipHasFatalExplain, true, 'Fatal tooltip must mention 斩杀 & 爪牙');
    assert.ok(
      desktopAudit.minionPreviewText.includes('爪牙不触发斩杀') && !desktopAudit.minionPreviewText.includes('+3上限'),
      `Minion lethal preview for Feed must suppress +3上限 and warn 爪牙不触发斩杀, got: ${desktopAudit.minionPreviewText}`
    );
    assert.ok(
      desktopAudit.leaderPreviewText.includes('+3上限'),
      `Non-minion leader lethal preview for Feed must show +3上限, got: ${desktopAudit.leaderPreviewText}`
    );
    assert.equal(desktopAudit.maxHpAfterFeed, desktopAudit.maxHpBeforeFeed, 'Killing Minion with Feed in UI must not increase maxHp');
    assert.equal(desktopAudit.hasRevealStage, true, 'Playing Havoc must spawn .fx-card-reveal-stage overlay');
    assert.equal(desktopAudit.hasBashRevealItem, true, 'Havoc reveal stage must display the auto-played Bash card');
    assert.equal(desktopAudit.revealCardName, '痛击', 'Havoc reveal card must render card title 痛击');
    assert.ok(desktopAudit.revealBadgeText.includes('破灭自动打出'), `Reveal badge must say 破灭自动打出, got: ${desktopAudit.revealBadgeText}`);
    assert.ok(
      desktopAudit.bannerTextAfterHavoc.includes('破灭自动打出【痛击】'),
      `Combat banner must show Havoc played card summary, got: ${desktopAudit.bannerTextAfterHavoc}`
    );

    // 5. Switch to 390x844 mobile viewport and play True Grit (random exhaust) -> reveal + 0px horizontal overflow
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });
    const mobileAudit = await cdp.evaluate(`(() => {
      const app = window.__SPIRE_APP__;
      app.render();
      const el = document.getElementById('hand-card-e2e_tg');
      el?.click();
      const stillThere = document.getElementById('hand-card-e2e_tg');
      if (stillThere) stillThere.click();

      const revealItem = document.querySelector('#spire-fx-layer .fx-card-reveal-item[data-reveal-kind="random_exhaust"][data-reveal-card-id="defend"]');
      const bannerText = document.getElementById('combat-banner')?.textContent?.trim() || '';
      const overflowPx = document.documentElement.scrollWidth - document.documentElement.clientWidth;
      return {
        hasRandomExhaustReveal: Boolean(revealItem),
        bannerText,
        overflowPx,
      };
    })()`);

    assert.equal(mobileAudit.hasRandomExhaustReveal, true, 'Mobile True Grit must spawn random_exhaust card reveal for Defend');
    assert.ok(
      mobileAudit.bannerText.includes('坚毅随机消耗【防御】'),
      `Mobile combat banner must show True Grit random exhaust summary, got: ${mobileAudit.bannerText}`
    );
    assert.ok(mobileAudit.overflowPx <= 0, `390px mobile with card reveal overlay must have zero horizontal overflow (got ${mobileAudit.overflowPx}px)`);

    // 6. Verify every distinct header/banner/footer layout class across ALL 234 upgraded cards stays single-line on 390px mobile hand (116px), 360px showcase & 126px reveal
    const allCardsSingleLineAudit = await cdp.evaluate(`(async () => {
      const { CARD_LIBRARY, getCardStats, formatCardDescription } = await import('./src/data/cards.js');
      const { extractCardKeywords, renderCardHtml } = await import('./src/ui/helpers.js');

      const mustInclude = new Set([
        'finesse', 'dramatic_entrance', 'hand_of_greed', 'apotheosis', 'apparition',
        'feed', 'lesson_learned', 'die_die_die', 'sword_boomerang', 'cloak_and_dagger',
        'ragnarok', 'uppercut', 'backstab', 'through_violence', 'deus_ex_machina', 'reach_heaven',
      ]);
      const seenClasses = new Set();
      const sampleCards = [];
      for (const c of Object.values(CARD_LIBRARY)) {
        const inst = { instanceId: 'sl_' + c.id, cardId: c.id, upgraded: true };
        const stats = getCardStats(inst);
        const desc = formatCardDescription(inst, null);
        const kws = extractCardKeywords(stats, desc.text);
        const traitKey = kws.filter((k) => k.isTrait && k.key !== '不能被打出').map((k) => k.key).join('·') || (kws.length > 1 ? 'multi' : kws[0]?.key || '');
        const key = [stats.type, stats.rarity, stats.character === 'colorless' ? 'C' : 'N', stats.target, stats.unplayable ? 'U' : 'P', traitKey, stats.name.length >= 6 ? 6 : stats.name.length >= 5 ? 5 : 4].join('|');
        if (mustInclude.has(c.id) || !seenClasses.has(key)) {
          seenClasses.add(key);
          sampleCards.push(inst);
        }
      }

      const auditBox = (cls, widthPx, opts = {}) => {
        const host = document.createElement('div');
        host.className = cls;
        host.style.position = 'fixed';
        host.style.top = '0';
        host.style.left = '0';
        host.style.width = widthPx + 'px';
        host.style.zIndex = '9999';
        document.body.appendChild(host);
        host.innerHTML = sampleCards
          .map((inst) => renderCardHtml(inst, { idPrefix: 'sl', ...opts }))
          .join('');

        let bannerWraps = 0;
        let bannerClips = 0;
        let footerWraps = 0;
        let topWraps = 0;
        for (const cardEl of host.querySelectorAll('.game-card')) {
          const bRect = cardEl.querySelector('.card-banner')?.getBoundingClientRect();
          const tRect = cardEl.querySelector('.card-type-label')?.getBoundingClientRect();
          const rRect = cardEl.querySelector('.rarity-badge')?.getBoundingClientRect();
          const fRect = cardEl.querySelector('.card-footer')?.getBoundingClientRect();
          const tgtRect = cardEl.querySelector('.card-target-label')?.getBoundingClientRect();
          const nRect = cardEl.querySelector('.card-name')?.getBoundingClientRect();
          if (bRect && (bRect.height > 26 || (rRect && rRect.height > 22) || (tRect && tRect.height > 22))) bannerWraps += 1;
          if (bRect && rRect && (rRect.right > bRect.right + 1 || (tRect && tRect.right > rRect.left + 0.5))) bannerClips += 1;
          if (fRect && ((tgtRect && tgtRect.height > 20) || fRect.height > 28)) footerWraps += 1;
          if (nRect && nRect.height > 24) topWraps += 1;
        }
        host.remove();
        return { checked: sampleCards.length, bannerWraps, bannerClips, footerWraps, topWraps };
      };

      return {
        mobileHand116: auditBox('hand-tray', 390),
        mobileShowcase: auditBox('card-showcase', 306),
        mobileReveal126: auditBox('fx-card-reveal-card-wrap', 390),
      };
    })()`);
    assert.ok(allCardsSingleLineAudit.mobileHand116.checked >= 30);
    assert.equal(allCardsSingleLineAudit.mobileHand116.bannerWraps, 0);
    assert.equal(allCardsSingleLineAudit.mobileHand116.bannerClips, 0);
    assert.equal(allCardsSingleLineAudit.mobileHand116.footerWraps, 0);
    assert.equal(allCardsSingleLineAudit.mobileHand116.topWraps, 0);
    assert.equal(allCardsSingleLineAudit.mobileShowcase.bannerWraps, 0);
    assert.equal(allCardsSingleLineAudit.mobileShowcase.bannerClips, 0);
    assert.equal(allCardsSingleLineAudit.mobileShowcase.footerWraps, 0);
    assert.equal(allCardsSingleLineAudit.mobileShowcase.topWraps, 0);
    assert.equal(allCardsSingleLineAudit.mobileReveal126.bannerWraps, 0);
    assert.equal(allCardsSingleLineAudit.mobileReveal126.bannerClips, 0);
    assert.equal(allCardsSingleLineAudit.mobileReveal126.footerWraps, 0);
    assert.equal(allCardsSingleLineAudit.mobileReveal126.topWraps, 0);
  } finally {
    await session?.close();
  }
});
