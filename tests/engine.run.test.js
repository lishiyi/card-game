import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  canUpgradeCard,
  CARD_LIBRARY,
  COLORLESS_CARD_POOLS,
  createCardInstance,
  formatCardDescription,
  getCardCharacter,
  getCardStats,
} from '../src/data/cards.js';
import { createEnemyInstance, ENCOUNTERS, ENEMY_TEMPLATES, predictNextTurnIntents } from '../src/data/enemies.js';
import { AUDIO_CUES, createSoundEngine } from '../src/ui/audio.js';
import { getCardArtKey, getCardArtSvg, SIGNATURE_CARD_ART } from '../src/ui/card_art.js';
import { extractCardKeywords, formatCardDescHtml } from '../src/ui/helpers.js';
import { getCharacterSvg, getVitalIconSvg } from '../src/ui/icons.js';
import { getRelicSvg, getUndiscoveredRelicSvg, RELIC_SVG_ART } from '../src/ui/relic_art.js';
import {
  getPotionIconSvg,
  getUndiscoveredPotionSvg,
  POTION_ACCENT_COLORS,
  POTION_SVG_ART,
} from '../src/ui/potion_art.js';
import { getStatusSvg, STATUS_NEGATIVE_SVG_ART, STATUS_SVG_ART } from '../src/ui/status_art.js';
import {
  EVENT_IDS,
  EVENT_LIBRARY,
  getEventChoicesForAscension,
  getEventIdsForAct,
  getEventTuning,
  TOTAL_FLOORS,
} from '../src/data/events.js';
import {
  BOSS_RELIC_IDS,
  CAMPFIRE_RELIC_IDS,
  getRelicPoolsForCharacter,
  NON_STARTER_RELIC_IDS,
  POTION_LIBRARY,
  RELIC_LIBRARY,
  STATUS_METADATA,
} from '../src/data/relics.js';
import { startCombat } from '../src/engine/combat.js';
import {
  DAILY_MAX_ASCENSION,
  DAILY_MIN_ASCENSION,
  DAILY_MODIFIERS,
  getDailyChallengeSpec,
  isValidDailyDateKey,
} from '../src/engine/daily.js';
import {
  addCardToMasterDeck,
  buyShopCard,
  buyShopColorlessCard,
  buyShopExclusiveRelic,
  buyShopPotion,
  buyShopPurge,
  buyShopRelic,
  cancelEventPurge,
  cancelNeowAction,
  chooseEventOption,
  chooseNeowOption,
  claimBossRelic,
  claimBossRewardCard,
  claimRewardCard,
  claimRewardEmeraldKey,
  claimRewardExtraRelic,
  claimRewardGold,
  claimRewardPotion,
  claimRewardRelic,
  claimTreasureRelic,
  claimTreasureSapphireKey,
  completeEventCardAction,
  completeEventPurge,
  completeNeowAction,
  continueFromEvent,
  createNewRun,
  digAtCampfire,
  discardPotion,
  findMapNode,
  formatRelicUpgradeSummary,
  getAvailableNodeIds,
  getCurrentPurgeCost,
  getStarterPotionSlotCount,
  getUnclaimedImportantRewards,
  getUpgradableDeckCards,
  grantRelicToPlayer,
  hasAllAct4Keys,
  hasPendingNeowBlessing,
  leaveShop,
  leaveTreasureRoom,
  liftAtCampfire,
  openTreasureChest,
  pickEventLibraryCard,
  playerHasHeavyAttackCard,
  proceedFromReward,
  proceedToNextAct,
  recallRubyKey,
  restHeal,
  restUpgradeCard,
  revealTreasureChest,
  rollRewardCards,
  runEndTurn,
  runPlayCard,
  runRestartCombat,
  runUsePotion,
  selectMapNode,
  settleAct1Victory,
  settleVictory,
  skipNeowCardOffer,
  tokeAtCampfire,
  transitionCombatVictory,
} from '../src/engine/game.js';
import {
  ASCENSION_DEFS,
  buildRunReportFromState,
  calculateRunScore,
  createDefaultCompendium,
  createDefaultMeta,
  exportSaveBackup,
  formatShareableBattleReport,
  getCharacterProgress,
  getLockedContentSets,
  getMaxAscensionForCharacter,
  getScoreGrade,
  loadSavedMeta,
  MAX_ASCENSION,
  META_STORAGE_KEY,
  recordCompletedRun,
  SAVE_BACKUP_APP_ID,
  saveMeta,
  syncCompendiumFromRunState,
  validateSaveBackup,
} from '../src/engine/meta.js';
import {
  buildChallengeUrl,
  buildDailyChallengeUrl,
  formatSeedCode,
  parseChallengeInput,
  parseSeedInput,
} from '../src/engine/rng.js';
import { buildStandaloneHtml, discoverModuleOrder } from '../scripts/build-standalone.mjs';

test('Spire 3-4 col planar map guarantees zero F1-F5 Elites, F9 Treasure, non-crossing paths, quotas, and no consecutive Elites/Rests/Shops across 150 seeds', () => {
  assert.equal(TOTAL_FLOORS, 16);
  for (let seed = 1; seed <= 150; seed += 1) {
    const ascension = seed > 120 ? 1 : 0;
    const state = createNewRun({ seed, ascension });
    assert.equal(state.player.potions.length, 3, 'Player must start with 3 potion belt slots');
    assert.deepEqual(state.player.potions, ['fire_potion', null, null]);
    assert.equal(state.map.length, 16);
    assert.ok(
      state.map[0].length >= 3 && state.map[0].length <= 4,
      `Expected 3-4 starting columns on Floor 1, got ${state.map[0].length}`
    );
    assert.ok(
      state.map[8].every((n) => n.type === 'treasure'),
      `Expected Floor 9 to be Treasure Chest on seed ${seed}`
    );
    assert.equal(state.map[14].length, 1);
    assert.equal(state.map[14][0].type, 'rest');
    assert.equal(state.map[15].length, 1);
    assert.equal(state.map[15][0].type, 'boss');

    let eliteCount = 0;
    let shopCount = 0;
    let earlyRestCount = 0;

    for (let r = 0; r < state.map.length; r += 1) {
      for (const node of state.map[r]) {
        if (node.floor <= 5) {
          assert.notEqual(node.type, 'elite', `Elite appeared too early on floor ${node.floor} (seed ${seed})`);
        }
        if (node.type === 'elite') eliteCount += 1;
        if (node.type === 'shop') shopCount += 1;
        if (node.type === 'rest' && node.floor <= 14) earlyRestCount += 1;
      }
    }

    assert.ok(shopCount >= 2, `Expected >= 2 shops on seed ${seed}, got ${shopCount}`);
    assert.ok(earlyRestCount >= 3, `Expected >= 3 pre-boss rest sites on seed ${seed}, got ${earlyRestCount}`);
    assert.ok(
      eliteCount >= (ascension >= 1 ? 5 : 3),
      `Expected >= ${ascension >= 1 ? 5 : 3} elites on seed ${seed} (A${ascension}), got ${eliteCount}`
    );

    for (let r = 0; r < state.map.length - 1; r += 1) {
      const currRow = state.map[r];
      const nextRow = state.map[r + 1];

      // Every node in currRow must connect to at least 1 node in nextRow, and obey consecutive spacing & local-column rules
      const edges = [];
      for (const node of currRow) {
        assert.ok(node.nextIds.length >= 1, `Node ${node.id} has no outgoing path`);
        for (const targetId of node.nextIds) {
          const child = nextRow.find((n) => n.id === targetId);
          assert.ok(child, `Invalid edge ${node.id} -> ${targetId}`);
          edges.push([node, child]);

          if (currRow.length > 1 && nextRow.length > 1) {
            assert.ok(
              Math.abs(node.slotCol - child.slotCol) <= 1,
              `Multi-column diagonal jump ${node.id} (col ${node.slotCol}) -> ${child.id} (col ${child.slotCol}) on seed ${seed}`
            );
          }

          if (['elite', 'rest', 'shop'].includes(node.type) && r + 1 !== 14) {
            assert.notEqual(
              child.type,
              node.type,
              `Back-to-back ${node.type} along ${node.id} -> ${child.id} (seed ${seed})`
            );
          }
        }
      }

      // Every node in nextRow must have at least 1 incoming parent from currRow
      for (const child of nextRow) {
        assert.ok(
          currRow.some((parent) => parent.nextIds.includes(child.id)),
          `Orphan node ${child.id} on seed ${seed}`
        );
      }

      // General planar non-crossing check across all edges between currRow and nextRow
      for (let i = 0; i < edges.length; i += 1) {
        for (let j = i + 1; j < edges.length; j += 1) {
          const [u1, v1] = edges[i];
          const [u2, v2] = edges[j];
          const cross = (u1.slotCol - u2.slotCol) * (v1.slotCol - v2.slotCol);
          assert.ok(
            cross >= 0,
            `Crossed edges (${u1.id}->${v1.id}) vs (${u2.id}->${v2.id}) on seed ${seed}`
          );
        }
      }
    }
  }
});

test('Combat victory transitions to Reward screen, warns on unclaimed Gold/Relic (never on Potion/Card), and returns to Map', () => {
  const state = createNewRun({ seed: 1234, skipNeow: true });
  const firstNodeId = getAvailableNodeIds(state)[0];
  selectMapNode(state, firstNodeId);
  assert.equal(state.screen, 'combat');

  // Damage player slightly to verify Burning Blood +6 HP heal on victory
  state.player.hp = 60;
  // Set enemy to 15 HP and finish with starting Fire Potion!
  state.combat.enemies.forEach((e, idx) => {
    e.hp = idx === 0 ? 15 : 0;
  });

  const res = runUsePotion(state, 0, state.combat.enemies[0].id);
  assert.equal(res.ok, true);
  assert.equal(state.player.hp, 66); // Burning Blood +6 HP!
  assert.equal(state.screen, 'reward');

  // 1. Unclaimed Gold blocks proceedFromReward with requiresConfirm: true
  const blockedGold = proceedFromReward(state);
  assert.equal(blockedGold.ok, false);
  assert.equal(blockedGold.requiresConfirm, true);
  assert.ok(blockedGold.reason.includes('金币'));
  assert.equal(state.screen, 'reward');

  // Claim Gold once (second attempt rejected)
  const goldBefore = state.player.gold;
  assert.equal(claimRewardGold(state).ok, true);
  assert.equal(state.player.gold > goldBefore, true);
  assert.equal(claimRewardGold(state).ok, false);

  // 2. Force unclaimed Relic -> proceedFromReward warns specifically about Relic
  state.reward.relicId = 'vajra';
  state.reward.relicClaimed = false;
  const blockedRelic = proceedFromReward(state);
  assert.equal(blockedRelic.ok, false);
  assert.equal(blockedRelic.requiresConfirm, true);
  assert.ok(blockedRelic.reason.includes('金刚杵'));
  assert.equal(state.screen, 'reward');

  assert.equal(claimRewardRelic(state).ok, true);
  assert.ok(state.player.relics.includes('vajra'));

  // 3. Force unclaimed Potion AND unclaimed Card while Gold & Relic ARE claimed -> NO warning!
  state.player.potions = ['block_potion', 'strength_potion'];
  state.reward.potionId = 'energy_potion';
  state.reward.potionClaimed = false;
  assert.equal(state.reward.cardClaimed, false);
  assert.equal(getUnclaimedImportantRewards(state).hasUnclaimed, false);

  assert.equal(claimRewardPotion(state).ok, false); // Belt full!
  assert.equal(discardPotion(state, 1).ok, true);
  assert.equal(claimRewardPotion(state).ok, true);
  assert.equal(state.player.potions[1], 'energy_potion');

  // Leave Card unclaimed and verify proceedFromReward succeeds immediately without prompt!
  assert.equal(state.reward.cardClaimed, false);
  assert.equal(proceedFromReward(state).ok, true);
  assert.equal(state.screen, 'map');

  // 4. Verify { force: true } allows deliberately skipping unclaimed Gold/Relic
  const skipState = createNewRun({ seed: 4321 });
  skipState.screen = 'reward';
  skipState.reward = {
    role: 'elite',
    gold: 50,
    goldClaimed: false,
    relicId: 'anchor',
    relicClaimed: false,
    potionId: null,
    potionClaimed: true,
    cardChoices: [],
    cardClaimed: false,
    pickedCardId: null,
  };
  assert.equal(proceedFromReward(skipState).requiresConfirm, true);
  assert.equal(proceedFromReward(skipState, { force: true }).ok, true);
  assert.equal(skipState.screen, 'map');
});

test('Rest site supports 30% Max HP Heal, Eternal Feather passive heal, and Card Upgrade (Smith)', () => {
  const state = createNewRun({ seed: 77 });
  state.player.relics.push('eternal_feather'); // 10 cards -> floor(10/5)*3 = +6 HP on entering rest!
  state.player.hp = 34;

  const restNode = state.map.flat().find((n) => n.type === 'rest');
  const prevRowNode = state.map[restNode.row - 1][0];
  state.currentNodeId = prevRowNode.id;
  prevRowNode.nextIds = [restNode.id];
  assert.equal(selectMapNode(state, restNode.id).ok, true);
  assert.equal(state.screen, 'rest');
  assert.equal(state.restState.featherHealed, 6);
  assert.equal(state.player.hp, 40);

  const healRes = restHeal(state);
  assert.equal(healRes.ok, true);
  assert.equal(state.player.hp, 64); // 40 + 30% of 80 (24) = 64
  assert.equal(state.screen, 'map');

  // Enter another rest site to Smith Bash -> Bash+
  state.screen = 'rest';
  state.restState = { completed: false, lastAction: null };
  const bashCard = state.player.deck.find((c) => c.cardId === 'bash');
  assert.equal(canUpgradeCard(bashCard), true);

  const upgRes = restUpgradeCard(state, bashCard.instanceId);
  assert.equal(upgRes.ok, true);
  assert.equal(bashCard.upgraded, true);
  assert.equal(getCardStats(bashCard).name, '痛击+');
  assert.equal(getCardStats(bashCard).damage, 10);
});

test('Shop enforces gold prices, 1x purge per shop, escalating purge cost (75 -> 100 -> 125), and potion belt capacity', () => {
  const state = createNewRun({ seed: 888 });
  const shopNodes = state.map.flat().filter((n) => n.type === 'shop');
  assert.ok(shopNodes.length >= 2);
  const shopNode = shopNodes[0];
  const prevNode = state.map[shopNode.row - 1][0];
  state.currentNodeId = prevNode.id;
  prevNode.nextIds = [shopNode.id];

  assert.equal(selectMapNode(state, shopNode.id).ok, true);
  assert.equal(state.screen, 'shop');
  assert.equal(state.shop.purgeCost, 75);

  state.player.gold = 900;
  const deckBefore = state.player.deck.length;

  assert.equal(buyShopCard(state, 0).ok, true);
  assert.equal(buyShopCard(state, 0).ok, false); // Already sold
  assert.equal(state.player.deck.length, deckBefore + 1);

  if (state.shop.relicOffer) {
    assert.equal(buyShopRelic(state).ok, true);
  }
  if (state.shop.potionOffer) {
    assert.equal(buyShopPotion(state).ok, true);
  }

  // Purge #1 costs 75 gold
  const goldBeforePurge1 = state.player.gold;
  const strike1 = state.player.deck.find((c) => c.cardId === 'strike');
  assert.equal(buyShopPurge(state, strike1.instanceId).ok, true);
  assert.equal(state.player.gold, goldBeforePurge1 - 75);
  assert.equal(getCurrentPurgeCost(state), 100);
  assert.equal(buyShopPurge(state, state.player.deck[0].instanceId).ok, false); // Only 1 purge per shop!

  assert.equal(leaveShop(state).ok, true);
  assert.equal(state.screen, 'map');

  // Visit 2nd shop -> purgeCost escalated to 100, then after purge becomes 125!
  const shopNode2 = shopNodes[1];
  const prevNode2 = state.map[shopNode2.row - 1][0];
  state.currentNodeId = prevNode2.id;
  prevNode2.nextIds = [shopNode2.id];
  assert.equal(selectMapNode(state, shopNode2.id).ok, true);
  assert.equal(state.shop.purgeCost, 100);
  const strike2 = state.player.deck.find((c) => c.cardId === 'strike');
  assert.equal(buyShopPurge(state, strike2.instanceId).ok, true);
  assert.equal(getCurrentPurgeCost(state), 125);
});

test('All 10 Unknown Events resolve accurately (Shining Light, Forge, Shrine, Reliquary, Golden Idol, Living Wall, Cursed Tome, Alchemist, Mushroom Grotto, Library)', () => {
  // 1. Shining Light explicitly names the 2 upgraded cards and records upgradedCardIds
  const lightState = createNewRun({ seed: 515 });
  lightState.screen = 'event';
  lightState.eventState = {
    eventId: 'shining_light',
    resolved: false,
    pendingPurge: false,
    outcomeText: '',
    upgradedCardIds: [],
    addedCardIds: [],
  };
  assert.equal(chooseEventOption(lightState, 'enter_light').ok, true);
  assert.equal(lightState.player.hp, 68);
  assert.equal(lightState.eventState.upgradedCardIds.length, 2);
  const upgradedNames = lightState.eventState.upgradedCardIds.map((id) => {
    const c = lightState.player.deck.find((x) => x.instanceId === id);
    assert.ok(c && c.upgraded, `Expected card ${id} to be upgraded`);
    return `【${getCardStats(c).name}】`;
  });
  assert.equal(
    lightState.eventState.outcomeText,
    `失去 12 点生命，成功升级了 2 张卡牌：${upgradedNames.join('、')}！`
  );

  // 2. Ancient Forge temper_blade explicitly names upgraded card
  const forgeState = createNewRun({ seed: 616 });
  forgeState.screen = 'event';
  forgeState.eventState = {
    eventId: 'ancient_forge',
    resolved: false,
    pendingPurge: false,
    outcomeText: '',
    upgradedCardIds: [],
    addedCardIds: [],
  };
  assert.equal(chooseEventOption(forgeState, 'temper_blade').ok, true);
  assert.equal(forgeState.eventState.upgradedCardIds.length, 1);
  const forgedCard = forgeState.player.deck.find(
    (x) => x.instanceId === forgeState.eventState.upgradedCardIds[0]
  );
  assert.equal(
    forgeState.eventState.outcomeText,
    `借助炉膛余温，成功升级了 1 张卡牌：【${getCardStats(forgedCard).name}】！`
  );

  // 3. Ancient Shrine purge flow
  const state = createNewRun({ seed: 999 });
  state.screen = 'event';
  state.eventState = {
    eventId: 'ancient_shrine',
    resolved: false,
    pendingPurge: false,
    outcomeText: '',
    upgradedCardIds: [],
    addedCardIds: [],
  };

  assert.equal(chooseEventOption(state, 'pray_purge').pendingPurge, true);
  assert.equal(continueFromEvent(state).ok, false); // Cannot leave mid-purge
  assert.equal(cancelEventPurge(state).ok, true);
  assert.equal(chooseEventOption(state, 'pray_purge').pendingPurge, true);

  const removeTarget = state.player.deck[0];
  assert.equal(completeEventPurge(state, removeTarget.instanceId).ok, true);
  assert.equal(state.player.deck.length, 9);
  assert.equal(continueFromEvent(state).ok, true);
  assert.equal(state.screen, 'map');

  // 4. Thorn Reliquary when player ALREADY owns all non-boss relics -> grants 80 gold fallback!
  state.screen = 'event';
  state.player.relics = ['burning_blood', ...NON_STARTER_RELIC_IDS];
  const goldBefore = state.player.gold;
  state.eventState = {
    eventId: 'thorn_reliquary',
    resolved: false,
    pendingPurge: false,
    outcomeText: '',
    upgradedCardIds: [],
    addedCardIds: [],
  };
  assert.equal(chooseEventOption(state, 'open_reliquary').ok, true);
  assert.equal(state.player.gold, goldBefore + 80);

  // 5. Golden Idol curse-for-gold adds Regret curse
  const idolState = createNewRun({ seed: 701 });
  idolState.screen = 'event';
  idolState.eventState = {
    eventId: 'golden_idol',
    resolved: false,
    pendingPurge: false,
    outcomeText: '',
    upgradedCardIds: [],
    addedCardIds: [],
  };
  assert.equal(chooseEventOption(idolState, 'accept_curse_gold').ok, true);
  assert.equal(idolState.player.gold, 99 + 175);
  assert.equal(idolState.player.deck.some((c) => c.cardId === 'regret'), true);

  // 6. Living Wall transform & upgrade
  const wallState = createNewRun({ seed: 702 });
  wallState.screen = 'event';
  wallState.eventState = {
    eventId: 'living_wall',
    resolved: false,
    pendingPurge: false,
    pendingCardAction: null,
    outcomeText: '',
    upgradedCardIds: [],
    addedCardIds: [],
  };
  assert.equal(chooseEventOption(wallState, 'wall_change').pendingCardAction, 'transform');
  assert.equal(cancelEventPurge(wallState).ok, true);
  assert.equal(chooseEventOption(wallState, 'wall_change').pendingCardAction, 'transform');
  const oldFirst = wallState.player.deck[0];
  const tfRes = completeEventCardAction(wallState, oldFirst.instanceId);
  assert.equal(tfRes.ok, true);
  assert.notEqual(tfRes.card.cardId, oldFirst.cardId);
  assert.equal(wallState.player.deck.length, 10);

  // 7. Cursed Tome rare card, Potion Alchemist, Mushroom Grotto, and Library Sanctum
  const tomeState = createNewRun({ seed: 703 });
  tomeState.screen = 'event';
  tomeState.eventState = {
    eventId: 'cursed_tome',
    resolved: false,
    outcomeText: '',
    upgradedCardIds: [],
    addedCardIds: [],
  };
  assert.equal(chooseEventOption(tomeState, 'read_final_chapter').ok, true);
  const addedRare = tomeState.player.deck[tomeState.player.deck.length - 1];
  assert.equal(CARD_LIBRARY[addedRare.cardId].rarity, 'rare');

  const alchState = createNewRun({ seed: 704 });
  alchState.screen = 'event';
  alchState.eventState = {
    eventId: 'potion_alchemist',
    resolved: false,
    outcomeText: '',
    upgradedCardIds: [],
    addedCardIds: [],
  };
  assert.equal(chooseEventOption(alchState, 'buy_potions').ok, true);
  assert.equal(alchState.player.gold, 99 - 35);
  assert.equal(alchState.player.potions.length, 3);
  assert.ok(alchState.player.potions[0] && alchState.player.potions[1] && alchState.player.potions[2]);

  const mushState = createNewRun({ seed: 705 });
  mushState.player.hp = 40;
  mushState.screen = 'event';
  mushState.eventState = {
    eventId: 'mushroom_grotto',
    resolved: false,
    outcomeText: '',
    upgradedCardIds: [],
    addedCardIds: [],
  };
  assert.equal(chooseEventOption(mushState, 'eat_blue_cap').ok, true);
  assert.equal(mushState.player.hp, 68);
  assert.equal(mushState.player.deck.some((c) => c.cardId === 'clumsy'), true);

  const libState = createNewRun({ seed: 706 });
  libState.rarePityBonus = 0.14;
  libState.screen = 'event';
  libState.eventState = {
    eventId: 'library_sanctum',
    resolved: false,
    libraryChoices: null,
    outcomeText: '',
    upgradedCardIds: [],
    addedCardIds: [],
  };
  assert.equal(chooseEventOption(libState, 'study_manuals').pendingLibrary, true);
  assert.equal(libState.eventState.libraryChoices.length, 3);
  assert.equal(libState.rarePityBonus, 0.14, 'Library card roll must not consume rare pity');
  assert.equal(pickEventLibraryCard(libState, libState.eventState.libraryChoices[1].instanceId).ok, true);
  assert.equal(continueFromEvent(libState).ok, true);
});

test('Treasure Chest + Cursed Key, Boss Relic Altar, Act 2 progression, Dynamic Rare Pity, Floor Gold Scaling, and Meta/Ascension 0-5', () => {
  // 1. Dynamic Rare Pity Bonus increases by +2% per non-rare card and resets to 0 on Rare roll
  const pityState = createNewRun({ seed: 10 });
  assert.equal(pityState.rarePityBonus, 0);
  let sawIncrease = false;
  let sawResetOnRare = false;
  for (let i = 0; i < 40; i += 1) {
    const before = pityState.rarePityBonus;
    const cards = rollRewardCards(pityState, 3, 'normal');
    const hasRare = cards.some((c) => CARD_LIBRARY[c.cardId].rarity === 'rare');
    if (!hasRare) {
      assert.ok(pityState.rarePityBonus > before);
      sawIncrease = true;
    } else if (CARD_LIBRARY[cards[2].cardId].rarity === 'rare') {
      assert.equal(pityState.rarePityBonus, 0);
      sawResetOnRare = true;
    }
  }
  assert.equal(sawIncrease, true);
  assert.ok(pityState.rarePityBonus <= 0.4);
  // Force high pity to confirm reset when rare rolls
  pityState.rarePityBonus = 0.4;
  for (let i = 0; i < 15; i += 1) {
    const cards = rollRewardCards(pityState, 1, 'elite');
    if (CARD_LIBRARY[cards[0].cardId].rarity === 'rare') {
      assert.equal(pityState.rarePityBonus, 0);
      sawResetOnRare = true;
      break;
    }
  }
  assert.equal(sawResetOnRare, true);

  // 2. Floor-scaled combat gold (Act 2 late floor earns meaningfully more than Act 1 Floor 1)
  const earlyState = createNewRun({ seed: 300 });
  earlyState.floor = 1;
  earlyState.combat = { role: 'normal' };
  transitionCombatVictory(earlyState);
  const earlyGold = earlyState.reward.gold;

  const lateState = createNewRun({ seed: 300 });
  lateState.act = 2;
  lateState.floor = 12;
  lateState.combat = { role: 'normal' };
  transitionCombatVictory(lateState);
  const lateGold = lateState.reward.gold;
  assert.ok(lateGold >= earlyGold + 35, `Expected Act 2 F12 gold (${lateGold}) >> Act 1 F1 gold (${earlyGold})`);

  // 3. Treasure Chest + Cursed Key adds a Curse on open (and allows skipping without opening)
  const chestState = createNewRun({ seed: 400 });
  grantRelicToPlayer(chestState, 'cursed_key');
  assert.equal(chestState.player.maxEnergy, 4);
  const treasureNode = chestState.map[8][0];
  const floor8Node = chestState.map[7][0];
  chestState.currentNodeId = floor8Node.id;
  floor8Node.nextIds = [treasureNode.id];
  assert.equal(selectMapNode(chestState, treasureNode.id).ok, true);
  assert.equal(chestState.screen, 'treasure');

  const openRes = openTreasureChest(chestState);
  assert.equal(openRes.ok, true);
  assert.ok(openRes.curseCard && CARD_LIBRARY[openRes.curseCard.cardId].type === 'curse');
  assert.equal(leaveTreasureRoom(chestState).ok, true);
  assert.equal(chestState.screen, 'map');

  // 4. Act 1 Boss -> 3 Rare Cards + Boss Relic Altar -> Proceed to Act 2 -> Defeat Act 2 Boss -> Victory!
  const actState = createNewRun({ seed: 500, unlockedTier: 0, unlockAllOverride: false });
  actState.rarePityBonus = 0.16;
  actState.player.hp = 40; // Missing 40 HP -> Act 2 transition heals 75% (30 HP) -> 70 HP!
  startCombat(actState, ENCOUNTERS.boss[0], 'boss');
  actState.combat.enemies[0].hp = 10;
  assert.equal(runUsePotion(actState, 0, actState.combat.enemies[0].id).ok, true);
  assert.equal(actState.screen, 'boss_reward');
  assert.equal(actState.rarePityBonus, 0, 'Act 1 Boss Rare reward should reset rarePityBonus');
  assert.equal(actState.bossReward.cardChoices.length, 3, 'Act 1 Boss must offer 3 Rare reward cards');
  const bossCardIds = new Set(actState.bossReward.cardChoices.map((c) => c.cardId));
  assert.equal(bossCardIds.size, 3, 'All 3 Act 1 Boss reward cards must be distinct');
  for (const c of actState.bossReward.cardChoices) {
    assert.equal(CARD_LIBRARY[c.cardId].rarity, 'rare', `Expected rare boss reward card, got ${c.cardId}`);
  }
  const deckBeforeBossCard = actState.player.deck.length;
  const firstRareChoice = actState.bossReward.cardChoices[0];
  assert.equal(claimBossRewardCard(actState, firstRareChoice.instanceId).ok, true);
  assert.equal(actState.player.deck.length, deckBeforeBossCard + 1);
  assert.equal(actState.bossReward.cardClaimed, true);
  assert.equal(claimBossRewardCard(actState, actState.bossReward.cardChoices[1].instanceId).ok, false);

  assert.equal(actState.bossReward.relicChoices.length, 3);
  assert.equal(claimBossRelic(actState, actState.bossReward.relicChoices[0]).ok, true);
  assert.equal(proceedToNextAct(actState).ok, true);
  assert.equal(actState.act, 2);
  assert.equal(actState.screen, 'map');
  assert.equal(actState.floor, 0);
  assert.ok(actState.player.hp >= 70, `Expected inter-act heal, got ${actState.player.hp}`);
  assert.ok(ENCOUNTERS.act2Boss.some((b) => b.id === actState.bossEncounterId));

  // Defeat Act 2 Boss -> Act 2 Boss Reward Altar -> proceed to Act 3 -> defeat Act 3 Boss -> final game_over victory
  actState.player.potions[0] = 'fire_potion';
  startCombat(actState, ENCOUNTERS.act2Boss[0], 'boss');
  actState.combat.enemies.forEach((e, idx) => {
    e.hp = idx === 0 ? 10 : 0;
  });
  assert.equal(runUsePotion(actState, 0, actState.combat.enemies[0].id).ok, true);
  assert.equal(actState.screen, 'boss_reward');
  assert.equal(actState.bossReward.actCleared, 2);
  assert.equal(proceedToNextAct(actState).ok, true);
  assert.equal(actState.act, 3);
  assert.ok(ENCOUNTERS.act3Boss.some((b) => b.id === actState.bossEncounterId));

  actState.player.potions[0] = 'fire_potion';
  startCombat(actState, ENCOUNTERS.act3Boss[0], 'boss');
  actState.combat.enemies.forEach((e, idx) => {
    e.hp = idx === 0 ? 10 : 0;
  });
  assert.equal(runUsePotion(actState, 0, actState.combat.enemies[0].id).ok, true);
  assert.equal(actState.screen, 'game_over');
  assert.equal(actState.runOutcome, 'victory');

  // 5. Ascension 5 modifiers & Meta XP / Unlock Tiers / Storage round-trip
  const a5 = createNewRun({ seed: 600, ascension: 5, unlockedTier: 0, unlockAllOverride: false });
  assert.equal(a5.player.maxHp, 75);
  assert.equal(a5.player.deck.length, 11);
  assert.equal(a5.player.deck.some((c) => c.cardId === 'clumsy'), true);
  assert.equal(getCurrentPurgeCost(a5), Math.round(75 * 1.15));

  const { lockedCardIds, lockedRelicIds } = getLockedContentSets(0, false);
  assert.equal(lockedCardIds.has('barricade'), true);
  assert.equal(lockedRelicIds.has('tungsten_rod'), true);
  assert.equal(getLockedContentSets(0, true).lockedCardIds.size, 0);

  const meta = createDefaultMeta();
  actState.ascension = 0;
  const rec1 = recordCompletedRun(meta, actState);
  assert.ok(rec1.xpGained >= 180);
  assert.equal(rec1.unlockedAscension, 1);
  assert.equal(meta.maxAscensionUnlocked, 1);
  assert.ok(meta.unlockedTier >= 1);
  // Idempotent on duplicate recording
  assert.equal(recordCompletedRun(meta, actState).alreadyRecorded, true);

  const fakeStorage = {
    data: new Map(),
    getItem(k) {
      return this.data.get(k) ?? null;
    },
    setItem(k, v) {
      this.data.set(k, String(v));
    },
  };
  saveMeta(meta, fakeStorage);
  const loaded = loadSavedMeta(fakeStorage);
  assert.equal(loaded.xp, meta.xp);
  assert.equal(loaded.maxAscensionUnlocked, 1);
});

test('P2: Seed code formatting/parsing, deterministic seeded runs, and persistent Run History cap', () => {
  assert.equal(formatSeedCode(42), 'S-16');
  assert.equal(parseSeedInput('S-16'), 42);
  assert.equal(parseSeedInput('  s-16  '), 42);
  assert.equal(parseSeedInput('987654'), 987654);
  assert.equal(parseSeedInput(''), null);
  assert.equal(parseSeedInput('   '), null);

  const customSeedA = parseSeedInput('好友竞速挑战2026');
  const customSeedB = parseSeedInput('好友竞速挑战2026');
  assert.ok(Number.isInteger(customSeedA) && customSeedA > 0);
  assert.equal(customSeedA, customSeedB);

  // Creating a run from string seed code S-16 matches numeric seed 42 deterministically
  const runA = createNewRun({ seed: 'S-16', ascension: 2 });
  const runB = createNewRun({ seed: 42, ascension: 2 });
  assert.equal(runA.seed, 42);
  assert.equal(runA.bossEncounterId, runB.bossEncounterId);
  assert.deepEqual(
    runA.map.map((row) => row.map((n) => ({ id: n.id, type: n.type, nextIds: n.nextIds }))),
    runB.map.map((row) => row.map((n) => ({ id: n.id, type: n.type, nextIds: n.nextIds })))
  );

  // Run history records entries newest-first, caps at 30, and persists cleanly
  const meta = createDefaultMeta();
  for (let i = 1; i <= 35; i += 1) {
    const r = createNewRun({ seed: 1000 + i, ascension: i % 3 });
    r.floor = (i % 16) + 1;
    r.stats.floorsCleared = i % 16;
    r.stats.enemiesSlain = i;
    r.runOutcome = i % 5 === 0 ? 'victory' : 'defeat';
    recordCompletedRun(meta, r);
  }
  assert.equal(meta.runHistory.length, 30);
  assert.equal(meta.runHistory[0].seed, 1035);
  assert.equal(meta.runHistory[0].seedCode, formatSeedCode(1035));
  assert.equal(meta.runHistory[0].outcome, 'victory');
  assert.equal(meta.runHistory[29].seed, 1006);

  const fakeStorage = {
    data: new Map(),
    getItem(k) {
      return this.data.get(k) ?? null;
    },
    setItem(k, v) {
      this.data.set(k, String(v));
    },
  };
  saveMeta(meta, fakeStorage);
  const reloaded = loadSavedMeta(fakeStorage);
  assert.equal(reloaded.runHistory.length, 30);
  assert.equal(reloaded.runHistory[0].seedCode, formatSeedCode(1035));
});

test('P2: Enemy next-turn intent prediction handles Ritual scaling, Boss cycles, Guardian mode shift, Slime split, and probabilistic weights', () => {
  // 1. Cultist: Turn 0 Incantation -> Turn 1 Dark Strike (6 dmg, Ritual skipped at end of Turn 1);
  //    Turn 1 Dark Strike -> Turn 2 Dark Strike (9 dmg after +3 Ritual at end of Turn 1!)
  const cultistRun = createNewRun({ seed: 77, ascension: 0 });
  startCombat(cultistRun, { id: 'test_cultist', name: '邪教徒', enemies: [{ templateId: 'cultist' }] }, 'monster');
  const cultist = cultistRun.combat.enemies[0];
  assert.equal(cultist.intent.id, 'incantation');

  const predT1 = predictNextTurnIntents(cultist, cultistRun.player, 0);
  assert.equal(predT1.candidates.length, 1);
  assert.equal(predT1.candidates[0].id, 'dark_strike');
  assert.equal(predT1.candidates[0].totalDamage, 6);
  assert.ok(predT1.summaryText.includes('暗黑打击'));

  runEndTurn(cultistRun);
  const predT2 = predictNextTurnIntents(cultistRun.combat.enemies[0], cultistRun.player, 0);
  assert.equal(predT2.candidates.length, 1);
  assert.equal(predT2.candidates[0].totalDamage, 9);

  // 2. Hexaghost: Turn 0 Activate Flames -> Turn 1 Divider scales as max(2, floor(player.hp / 14) + 1) per hit (x6)
  const hexRun = createNewRun({ seed: 88, ascension: 0 });
  startCombat(hexRun, { id: 'test_hex', name: '六火亡魂', enemies: [{ templateId: 'hexaghost' }] }, 'boss');
  const hexPredFull = predictNextTurnIntents(hexRun.combat.enemies[0], hexRun.player, 0);
  assert.equal(hexPredFull.candidates.length, 1);
  assert.equal(hexPredFull.candidates[0].label, '6×6');
  assert.equal(hexPredFull.candidates[0].totalDamage, 36);

  hexRun.player.hp = 36;
  const hexPredLow = predictNextTurnIntents(hexRun.combat.enemies[0], hexRun.player, 0);
  assert.equal(hexPredLow.candidates[0].label, '3×6');
  assert.equal(hexPredLow.candidates[0].totalDamage, 18);

  // 3. Slime Boss: above 50% HP includes split conditional note; at <= 50% HP predicts guaranteed Split
  const slimeRun = createNewRun({ seed: 99, ascension: 0 });
  startCombat(slimeRun, { id: 'test_slime', name: '史莱姆老大', enemies: [{ templateId: 'slime_boss' }] }, 'boss');
  const slime = slimeRun.combat.enemies[0];
  const aboveHalfPred = predictNextTurnIntents(slime, slimeRun.player, 0);
  assert.ok(aboveHalfPred.conditionalNote.includes('巨体分裂'));

  // 4. Probabilistic AI (Jaw Worm after Chomp): candidate probabilities sum to 1.0 and exclude 3x Bellow/Thrash streaks
  const jawRun = createNewRun({ seed: 101, ascension: 0 });
  startCombat(jawRun, { id: 'test_jaw', name: '大颚虫', enemies: [{ templateId: 'jaw_worm' }] }, 'monster');
  const jawPred = predictNextTurnIntents(jawRun.combat.enemies[0], jawRun.player, 0);
  assert.ok(jawPred.candidates.length >= 2);
  const probSum = jawPred.candidates.reduce((acc, c) => acc + c.probability, 0);
  assert.ok(Math.abs(probSum - 1) < 1e-6, `Expected probability sum 1.0, got ${probSum}`);
  assert.ok(jawPred.summaryText.startsWith('下回合：'));
});

test('P2: Automatic dependency-graph standalone bundler discovers all src/**/*.js modules with zero orphans or unbundled syntax', () => {
  const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

  function listAllJsUnder(dirRel) {
    const out = [];
    for (const entry of fs.readdirSync(path.join(repoRoot, dirRel), { withFileTypes: true })) {
      const childRel = path.posix.join(dirRel, entry.name);
      if (entry.isDirectory()) out.push(...listAllJsUnder(childRel));
      else if (entry.isFile() && entry.name.endsWith('.js')) out.push(childRel);
    }
    return out.sort();
  }

  const allSrcFiles = listAllJsUnder('src');
  const discovered = discoverModuleOrder('src/main.js', repoRoot);

  assert.deepEqual(
    [...discovered].sort(),
    allSrcFiles,
    'Every module under src/ must be automatically reachable and bundled from src/main.js'
  );
  assert.equal(discovered[discovered.length - 1], 'src/main.js');

  const { html } = buildStandaloneHtml(repoRoot);
  assert.ok(html.includes('@keyframes cardFlyGhost'));
  assert.ok(html.includes('@keyframes shieldShatterRing'));
  assert.equal(html.includes('<script type="module"'), false);
  assert.equal(html.includes('<link rel="stylesheet"'), false);
});

test('Floor 0 Neow Blessing: deterministic 4-choice panel, F1 lock/unlock, cancelable deck picker, remove-2 all-gold, Boss Swap (no Black Blood), and Coffee Dripper rest restriction', () => {
  assert.equal(BOSS_RELIC_IDS.length, 16);

  // 1. Deterministic Neow options & Floor 1 lock until resolved
  const runA = createNewRun({ seed: 'S-777', ascension: 1, unlockAllOverride: true });
  const runB = createNewRun({ seed: 'S-777', ascension: 1, unlockAllOverride: true });
  assert.equal(hasPendingNeowBlessing(runA), true);
  assert.equal(runA.neowState.options.length, 4);
  assert.deepEqual(
    runA.neowState.options.map((o) => o.id),
    runB.neowState.options.map((o) => o.id),
    'Same seed must produce identical Neow blessing choices'
  );
  assert.equal(runA.neowState.options[3].id, 'boss_swap');
  assert.deepEqual(getAvailableNodeIds(runA), [], 'Floor 1 must be locked before Neow blessing is resolved');
  assert.equal(selectMapNode(runA, runA.map[0][0].id).ok, false);

  // 2. Boss Swap removes Burning Blood, never rolls Black Blood, and filters Black Blood out of Act 1 Boss Altar!
  for (let s = 1; s <= 40; s += 1) {
    const swapRun = createNewRun({ seed: 9000 + s, unlockAllOverride: true });
    const res = chooseNeowOption(swapRun, 'boss_swap');
    assert.equal(res.ok, true);
    assert.equal(swapRun.player.relics.includes('burning_blood'), false);
    assert.equal(swapRun.player.relics.includes('black_blood'), false, 'Boss Swap must never roll black_blood');
    assert.equal(BOSS_RELIC_IDS.includes(res.relicId), true);
    assert.equal(hasPendingNeowBlessing(swapRun), false);
    assert.ok(getAvailableNodeIds(swapRun).length >= 3, 'Floor 1 nodes must unlock right after Neow');

    // Simulate Act 1 Boss victory -> black_blood must NOT be offered since burning_blood is gone
    swapRun.combat = { role: 'boss' };
    transitionCombatVictory(swapRun);
    assert.equal(swapRun.screen, 'boss_reward');
    assert.equal(swapRun.bossReward.relicChoices.includes('black_blood'), false);
  }

  // 3. Cancelable deck picker (upgrade_1) + 2-card removal all-gold cost (gold_for_remove_2) + card offer skip (hp_for_rare_card)
  const deckPickRun = createNewRun({ seed: 5501, unlockAllOverride: true });
  deckPickRun.neowState.options[0] = { id: 'upgrade_1', tier: 'small', badge: '稳健增益', title: '升级 1 张', detail: '' };
  deckPickRun.neowState.options[2] = { id: 'gold_for_remove_2', tier: 'risk', badge: '高风险', title: '全金币删 2', detail: '' };
  assert.equal(chooseNeowOption(deckPickRun, 'upgrade_1').pendingModal, 'neow_action');
  assert.equal(cancelNeowAction(deckPickRun).ok, true, 'Deck picker should be cancelable before confirming');
  assert.equal(hasPendingNeowBlessing(deckPickRun), true);

  assert.equal(chooseNeowOption(deckPickRun, 'gold_for_remove_2').pendingModal, 'neow_action');
  const startDeckLen = deckPickRun.player.deck.length;
  const r1 = completeNeowAction(deckPickRun, deckPickRun.player.deck[0].instanceId);
  assert.equal(r1.ok, true);
  assert.equal(r1.resolved, false);
  assert.equal(deckPickRun.player.gold, 0);
  assert.equal(cancelNeowAction(deckPickRun).ok, false, 'Cannot cancel after 1st removal paid gold');
  const r2 = completeNeowAction(deckPickRun, deckPickRun.player.deck[0].instanceId);
  assert.equal(r2.ok, true);
  assert.equal(r2.resolved, true);
  assert.equal(deckPickRun.player.deck.length, startDeckLen - 2);

  const rareOfferRun = createNewRun({ seed: 5502, unlockAllOverride: true });
  rareOfferRun.neowState.options[2] = { id: 'hp_for_rare_card', tier: 'risk', badge: '高风险', title: '失血换稀有', detail: '' };
  assert.equal(chooseNeowOption(rareOfferRun, 'hp_for_rare_card').pendingModal, 'neow_action');
  assert.equal(rareOfferRun.player.hp, 65);
  assert.equal(cancelNeowAction(rareOfferRun).ok, false, 'Revealed card offer must not be cancelable');
  assert.equal(skipNeowCardOffer(rareOfferRun).ok, true);
  assert.equal(hasPendingNeowBlessing(rareOfferRun), false);

  // 4. Coffee Dripper blocks Rest healing while allowing Smithing & Eternal Feather passive heal
  const dripRun = createNewRun({ seed: 5503, skipNeow: true });
  grantRelicToPlayer(dripRun, 'coffee_dripper');
  grantRelicToPlayer(dripRun, 'eternal_feather');
  assert.equal(dripRun.player.maxEnergy, 4);
  dripRun.player.hp = 40;
  dripRun.screen = 'rest';
  dripRun.restState = { completed: false, lastAction: null, featherHealed: 6 };
  const healTry = restHeal(dripRun);
  assert.equal(healTry.ok, false);
  assert.ok(healTry.reason.includes('咖啡滤杯'));
  assert.equal(dripRun.player.hp, 40);
  const upCard = getUpgradableDeckCards(dripRun)[0];
  assert.equal(restUpgradeCard(dripRun, upCard.instanceId).ok, true);
  assert.equal(dripRun.screen, 'map');
});

test('URL Seeded Challenge: buildChallengeUrl, parseChallengeInput (URL/query/seed), and anti-skip Ascension protection on Meta settlement', () => {
  const url = buildChallengeUrl('https://lishiyi.github.io/card-game/?old=1#hash', 42, 3);
  assert.equal(url, 'https://lishiyi.github.io/card-game/?seed=S-16&asc=3');

  const parsedFull = parseChallengeInput(url);
  assert.equal(parsedFull.seed, 42);
  assert.equal(parsedFull.seedCode, 'S-16');
  assert.equal(parsedFull.ascension, 3);
  assert.equal(parsedFull.isUrlLike, true);

  const parsedQuery = parseChallengeInput('?seed=S-16&asc=99', 5);
  assert.equal(parsedQuery.seed, 42);
  assert.equal(parsedQuery.ascension, 5, 'Ascension should clamp to maxAscension');
  assert.equal(parsedQuery.isUrlLike, true);

  const parsedPlain = parseChallengeInput('S-16');
  assert.equal(parsedPlain.seed, 42);
  assert.equal(parsedPlain.ascension, null);
  assert.equal(parsedPlain.isUrlLike, false);

  // Anti-skip protection: brand-new player (maxAscensionUnlocked = 0) winning an Asc 3 challenge link
  // records history with isChallenge: true + XP, WITHOUT jumping maxAscensionUnlocked to 4!
  const freshMeta = createDefaultMeta();
  const hiAscChallenge = createNewRun({
    seed: 42,
    ascension: 3,
    unlockAllOverride: true,
    isChallengeRun: true,
  });
  hiAscChallenge.floor = 16;
  hiAscChallenge.stats.floorsCleared = 16;
  hiAscChallenge.runOutcome = 'victory';
  const hiRec = recordCompletedRun(freshMeta, hiAscChallenge);
  assert.equal(hiRec.unlockedAscension, null);
  assert.equal(freshMeta.maxAscensionUnlocked, 0);
  assert.ok(hiRec.xpGained > 0);
  assert.equal(freshMeta.runHistory[0].isChallenge, true);
  assert.equal(freshMeta.runHistory[0].ascension, 3);

  // Winning an Asc 0 challenge link (<= maxAscensionUnlocked) DOES legitimately unlock Asc 1!
  const asc0Challenge = createNewRun({
    seed: 43,
    ascension: 0,
    unlockAllOverride: true,
    isChallengeRun: true,
  });
  asc0Challenge.floor = 16;
  asc0Challenge.stats.floorsCleared = 16;
  asc0Challenge.runOutcome = 'victory';
  const lowRec = recordCompletedRun(freshMeta, asc0Challenge);
  assert.equal(lowRec.unlockedAscension, 1);
  assert.equal(freshMeta.maxAscensionUnlocked, 1);
});

test('The Silent run setup: 70 HP (65 Asc 4), 12-card deck, Ring of the Snake (+2 T1 draw) -> Ring of the Serpent (+1/turn), strict character pool isolation, Silent Neow Boss Swap, and ?char=silent URL challenge', () => {
  const silentRun = createNewRun({ seed: 'S-SILENT', characterId: 'silent', unlockAllOverride: true });
  assert.equal(silentRun.characterId, 'silent');
  assert.equal(silentRun.player.name, '静默猎手');
  assert.equal(silentRun.player.artKey, 'silent');
  assert.equal(silentRun.player.hp, 70);
  assert.equal(silentRun.player.maxHp, 70);
  assert.deepEqual(silentRun.player.relics, ['ring_of_the_snake']);
  assert.equal(silentRun.player.potions[0], 'poison_potion');
  assert.equal(silentRun.player.deck.length, 12);
  assert.equal(silentRun.player.deck.filter((c) => c.cardId === 'neutralize').length, 1);
  assert.equal(silentRun.player.deck.filter((c) => c.cardId === 'survivor').length, 1);

  const silentAsc4 = createNewRun({ seed: 'S-SILENT', characterId: 'silent', ascension: 4, skipNeow: true });
  assert.equal(silentAsc4.player.maxHp, 65);

  // Ring of the Snake draws 7 on Turn 1; replacing with Ring of the Serpent draws 6 every turn!
  const mapStart = silentAsc4.map[0][0].id;
  assert.equal(selectMapNode(silentAsc4, mapStart).ok, true);
  assert.equal(silentAsc4.combat.hand.length, 7, 'Ring of the Snake must draw 7 cards on Turn 1');

  assert.equal(grantRelicToPlayer(silentAsc4, 'ring_of_the_serpent'), true);
  assert.equal(silentAsc4.player.relics.includes('ring_of_the_snake'), false, 'Ring of the Serpent must replace Ring of the Snake');
  assert.equal(silentAsc4.player.relics.includes('ring_of_the_serpent'), true);

  // Silent reward cards NEVER contain Ironclad cards or special token Shiv
  for (let i = 0; i < 20; i += 1) {
    const offers = rollRewardCards(silentRun, 3, i % 2 === 0 ? 'normal' : 'elite');
    for (const card of offers) {
      const def = CARD_LIBRARY[card.cardId];
      assert.equal(def.character, 'silent', `Silent reward leaked non-silent card ${def.id}`);
      assert.notEqual(def.rarity, 'special', 'Shiv token must never appear in reward pools');
    }
  }

  // Ironclad reward cards NEVER contain Silent cards
  const ironRun = createNewRun({ seed: 7007, characterId: 'ironclad', unlockAllOverride: true, skipNeow: true });
  for (let i = 0; i < 20; i += 1) {
    const offers = rollRewardCards(ironRun, 3, 'normal');
    for (const card of offers) {
      const def = CARD_LIBRARY[card.cardId];
      assert.notEqual(def.character, 'silent', `Ironclad reward leaked Silent card ${def.id}`);
    }
  }

  // Silent Neow Boss Swap removes ring_of_the_snake, never rolls black_blood or ring_of_the_serpent, and Act 1 Boss Altar filters out black_blood & ring_of_the_serpent
  for (let s = 1; s <= 30; s += 1) {
    const swapSilent = createNewRun({ seed: 9500 + s, characterId: 'silent', unlockAllOverride: true });
    assert.ok(swapSilent.neowState.options[3].title.includes('蛇之戒指'));
    const res = chooseNeowOption(swapSilent, 'boss_swap');
    assert.equal(res.ok, true);
    assert.equal(swapSilent.player.relics.includes('ring_of_the_snake'), false);
    assert.equal(swapSilent.player.relics.includes('ring_of_the_serpent'), false);
    assert.equal(swapSilent.player.relics.includes('black_blood'), false);

    swapSilent.combat = { role: 'boss' };
    transitionCombatVictory(swapSilent);
    assert.equal(swapSilent.bossReward.relicChoices.includes('ring_of_the_serpent'), false);
    assert.equal(swapSilent.bossReward.relicChoices.includes('black_blood'), false);
    for (const rc of swapSilent.bossReward.cardChoices) {
      assert.equal(CARD_LIBRARY[rc.cardId].character, 'silent');
      assert.equal(CARD_LIBRARY[rc.cardId].rarity, 'rare');
    }
  }

  // URL challenge round-trip with ?char=silent
  const url = buildChallengeUrl('https://lishiyi.github.io/card-game/', 4242, 2, 5, 'silent');
  assert.ok(url.includes('char=silent'));
  const parsed = parseChallengeInput(url, 5);
  assert.equal(parsed.seed, 4242);
  assert.equal(parsed.ascension, 2);
  assert.equal(parsed.characterId, 'silent');
  assert.equal(parsed.isUrlLike, true);

  // Meta run history preserves characterId & characterName
  const meta = createDefaultMeta();
  silentRun.floor = 10;
  silentRun.stats.floorsCleared = 10;
  silentRun.runOutcome = 'victory';
  recordCompletedRun(meta, silentRun);
  assert.equal(meta.runHistory[0].characterId, 'silent');
  assert.equal(meta.runHistory[0].characterName, '静默猎手');
});

test('Shop-exclusive Colorless shelf: strict isolation from combat rewards, 1 Uncommon + 1 Rare shelf, purchase & stats tracking', () => {
  assert.equal(COLORLESS_CARD_POOLS.uncommon.length, 12);
  assert.equal(COLORLESS_CARD_POOLS.rare.length, 8);

  // 1. 40+ normal/elite/boss reward rolls across both Ironclad and Silent must NEVER drop colorless cards
  for (const characterId of ['ironclad', 'silent']) {
    const run = createNewRun({ seed: characterId === 'ironclad' ? 3101 : 3102, characterId, unlockAllOverride: true, skipNeow: true });
    for (let i = 0; i < 25; i += 1) {
      const role = i % 3 === 0 ? 'normal' : i % 3 === 1 ? 'elite' : 'boss';
      const offers = rollRewardCards(run, 3, role);
      for (const card of offers) {
        const def = CARD_LIBRARY[card.cardId];
        assert.notEqual(getCardCharacter(def), 'colorless', `Combat reward (${role}) leaked colorless card ${card.cardId}`);
        assert.notEqual(def.shopOnly, true, `Combat reward leaked shopOnly card ${card.cardId}`);
      }
    }
  }

  // 2. Shop always stocks exactly 2 colorless cards (1 uncommon + 1 rare) for both classes, supports purchase, tracks stats, rejects double-buy
  for (const characterId of ['ironclad', 'silent']) {
    const shopRun = createNewRun({ seed: characterId === 'ironclad' ? 4201 : 4202, characterId, skipNeow: true });
    const shopNode = shopRun.map.flat().find((n) => n.type === 'shop');
    const prevNode = shopRun.map[shopNode.row - 1][0];
    shopRun.currentNodeId = prevNode.id;
    prevNode.nextIds = [shopNode.id];

    assert.equal(selectMapNode(shopRun, shopNode.id).ok, true);
    assert.equal(shopRun.screen, 'shop');
    assert.equal(shopRun.shop.colorlessCards.length, 2);

    const [uncOffer, rareOffer] = shopRun.shop.colorlessCards;
    assert.equal(getCardCharacter(CARD_LIBRARY[uncOffer.card.cardId]), 'colorless');
    assert.equal(CARD_LIBRARY[uncOffer.card.cardId].rarity, 'uncommon');
    assert.equal(getCardCharacter(CARD_LIBRARY[rareOffer.card.cardId]), 'colorless');
    assert.equal(CARD_LIBRARY[rareOffer.card.cardId].rarity, 'rare');
    assert.ok(uncOffer.price >= 60 && rareOffer.price > uncOffer.price);

    // Insufficient gold fails cleanly
    shopRun.player.gold = 10;
    assert.equal(buyShopColorlessCard(shopRun, 0).ok, false);
    assert.equal(uncOffer.sold, false);

    // Sufficient gold buys colorless card, deducts gold, increments colorlessBought, rejects duplicate buy
    shopRun.player.gold = 600;
    const deckLenBefore = shopRun.player.deck.length;
    const buyRes = buyShopColorlessCard(shopRun, 1);
    assert.equal(buyRes.ok, true);
    assert.equal(rareOffer.sold, true);
    assert.equal(shopRun.player.gold, 600 - rareOffer.price);
    assert.equal(shopRun.player.deck.length, deckLenBefore + 1);
    assert.equal(shopRun.stats.colorlessBought, 1);
    assert.equal(getCardCharacter(CARD_LIBRARY[buyRes.addedCard.cardId]), 'colorless');
    assert.equal(buyShopColorlessCard(shopRun, 1).ok, false);
  }
});

test('Daily Challenge determinism, ?daily= URL round-trip, all 10 modifiers, Run Scoring, dailyRecords & Shareable Battle Report', () => {
  assert.equal(Object.keys(DAILY_MODIFIERS).length, 10);
  assert.equal(isValidDailyDateKey('2026-11-19'), true);
  assert.equal(isValidDailyDateKey('2026-02-30'), false);
  assert.equal(isValidDailyDateKey('not-a-date'), false);

  // 1. Deterministic spec for same date + alternating heroes + A0-A6 deterministic Ascension + noNeow + 3 non-conflicting modifier categories
  assert.equal(DAILY_MIN_ASCENSION, 0);
  assert.equal(DAILY_MAX_ASCENSION, 6);
  const specA = getDailyChallengeSpec('2026-11-19');
  const specB = getDailyChallengeSpec('2026-11-19');
  const specNextDay = getDailyChallengeSpec('2026-11-20');
  assert.deepEqual(specA, specB);
  assert.equal(specA.noNeow, true);
  assert.ok(
    Number.isInteger(specA.ascension) &&
      specA.ascension >= DAILY_MIN_ASCENSION &&
      specA.ascension <= DAILY_MAX_ASCENSION,
    `Daily Ascension must be in [${DAILY_MIN_ASCENSION}, ${DAILY_MAX_ASCENSION}], got ${specA.ascension}`
  );
  assert.equal(specA.modifierIds.length, 3);
  assert.deepEqual(
    specA.modifiers.map((m) => m.category),
    ['build', 'twist', 'challenge']
  );
  assert.notEqual(specA.characterId, specNextDay.characterId, 'Adjacent daily dates should rotate featured hero');

  // 2. ?daily= URL round-trip
  const dailyUrl = buildDailyChallengeUrl('https://lishiyi.github.io/card-game/?seed=OLD', '2026-11-19');
  assert.equal(dailyUrl, 'https://lishiyi.github.io/card-game/?daily=2026-11-19');
  const parsedDaily = parseChallengeInput(dailyUrl);
  assert.equal(parsedDaily.isDaily, true);
  assert.equal(parsedDaily.dailyDateKey, '2026-11-19');
  assert.equal(parsedDaily.seed, specA.seed);
  assert.equal(parsedDaily.ascension, null);
  assert.equal(parsedDaily.isUrlLike, true);
  assert.equal(getDailyChallengeSpec(parsedDaily.dailyDateKey).characterId, specA.characterId);
  assert.equal(getDailyChallengeSpec(parsedDaily.dailyDateKey).ascension, specA.ascension);
  assert.equal(parseChallengeInput('?daily=invalid-date'), null);

  const parsedQueryDaily = parseChallengeInput('?daily=2026-11-20');
  assert.equal(parsedQueryDaily.dailyDateKey, '2026-11-20');
  assert.equal(parsedQueryDaily.seed, specNextDay.seed);

  // 3. Verify all 10 daily modifiers & all A0-A6 Ascension levels across deterministic dates + no Neow Blessing
  const seenModIds = new Set();
  const seenAscLevels = new Set();
  const sampleDateForMod = new Map();
  const sampleDateForAsc = new Map();
  for (let day = 1; day <= 90; day += 1) {
    const dt = new Date(Date.UTC(2026, 0, day));
    const dateKey = dt.toISOString().slice(0, 10);
    const sp = getDailyChallengeSpec(dateKey);
    assert.ok(
      Number.isInteger(sp.ascension) && sp.ascension >= 0 && sp.ascension <= 6,
      `Daily ${dateKey} ascension out of A0-A6 range: ${sp.ascension}`
    );
    seenAscLevels.add(sp.ascension);
    if (!sampleDateForAsc.has(sp.ascension)) sampleDateForAsc.set(sp.ascension, dateKey);
    for (const mid of sp.modifierIds) {
      seenModIds.add(mid);
      if (!sampleDateForMod.has(mid)) sampleDateForMod.set(mid, dateKey);
    }
  }
  assert.equal(seenModIds.size, 10, 'All 10 daily modifiers should be reachable across calendar rotation');
  assert.equal(seenAscLevels.size, 7, 'All 7 daily Ascension levels (A0-A6) should be reachable across calendar rotation');

  // Verify Daily Challenge never generates Neow Blessing even without skipNeow, and applies its rolled Ascension (e.g. A6)
  const dailyA6Run = createNewRun({ dailyDateKey: sampleDateForAsc.get(6) });
  assert.equal(dailyA6Run.ascension, 6);
  assert.equal(dailyA6Run.dailyChallenge.ascension, 6);
  assert.equal(dailyA6Run.neowState, null, 'Daily Challenge must not generate Neow Blessing');
  assert.equal(hasPendingNeowBlessing(dailyA6Run), false);
  assert.equal(dailyA6Run.player.potions.length, 2, 'Daily A6 must apply 2-slot potion limit');
  assert.ok(dailyA6Run.player.hp < dailyA6Run.player.maxHp, 'Daily A6 must apply 10% damaged start');
  assert.ok(
    dailyA6Run.player.deck.some((c) => c.cardId === 'clumsy'),
    'Daily A6 must include A5 Clumsy curse'
  );

  // 3a. Starting deck/relic/gold modifiers: all_star, shiny, heirloom, specialized, hoarder_gold, cursed_run
  const allStarRun = createNewRun({ dailyDateKey: sampleDateForMod.get('all_star') });
  assert.equal(allStarRun.neowState, null);
  const allStarColorless = allStarRun.player.deck.filter((c) => getCardCharacter(CARD_LIBRARY[c.cardId]) === 'colorless');
  assert.equal(allStarColorless.length, 2, 'all_star must add 2 colorless cards');
  assert.equal(allStarColorless.filter((c) => CARD_LIBRARY[c.cardId].rarity === 'uncommon').length, 1);
  assert.equal(allStarColorless.filter((c) => CARD_LIBRARY[c.cardId].rarity === 'rare').length, 1);

  const shinyRun = createNewRun({ dailyDateKey: sampleDateForMod.get('shiny') });
  const shinyRares = shinyRun.player.deck.filter(
    (c) => CARD_LIBRARY[c.cardId].rarity === 'rare' && getCardCharacter(CARD_LIBRARY[c.cardId]) === shinyRun.characterId
  );
  assert.equal(shinyRares.length, 2, 'shiny must add 2 class rare cards');

  const heirloomRun = createNewRun({ dailyDateKey: sampleDateForMod.get('heirloom') });
  assert.equal(heirloomRun.player.relics.length, 2, 'heirloom must add 1 extra relic');
  assert.equal(RELIC_LIBRARY[heirloomRun.player.relics[1]].tier, 'rare');

  const specRun = createNewRun({ dailyDateKey: sampleDateForMod.get('specialized') });
  assert.equal(specRun.player.deck.filter((c) => c.upgraded).length, 4, 'specialized must upgrade 4 starter cards');

  const hoarderRun = createNewRun({ dailyDateKey: sampleDateForMod.get('hoarder_gold') });
  assert.equal(hoarderRun.player.gold, 99 + 150, 'hoarder_gold must add +150 starting gold');
  const expectedHoarderPurge = Math.round(75 * (hoarderRun.ascension >= 5 ? 1.15 : 1) * 1.15);
  assert.equal(getCurrentPurgeCost(hoarderRun), expectedHoarderPurge, 'hoarder_gold must increase purge cost by 15% (stacking with A5 if active)');

  // 3b. midas: +65% combat gold & blocks restUpgradeCard
  const midasRun = createNewRun({ dailyDateKey: sampleDateForMod.get('midas') });
  midasRun.screen = 'rest';
  midasRun.restState = { completed: false, lastAction: null, featherHealed: 0 };
  const midasSmith = restUpgradeCard(midasRun, midasRun.player.deck[0].instanceId);
  assert.equal(midasSmith.ok, false);
  assert.ok(midasSmith.reason.includes('点金之手'));

  const baseGoldRun = createNewRun({ seed: 7777, skipNeow: true });
  baseGoldRun.floor = 4;
  baseGoldRun.combat = { role: 'normal' };
  transitionCombatVictory(baseGoldRun);
  const midasGoldRun = createNewRun({ seed: 7777, skipNeow: true });
  midasGoldRun.dailyChallenge = { dateKey: '2026-11-19', seedCode: 'S-T', characterId: 'ironclad', modifierIds: ['midas'] };
  midasGoldRun.floor = 4;
  midasGoldRun.combat = { role: 'normal' };
  transitionCombatVictory(midasGoldRun);
  assert.ok(midasGoldRun.reward.gold > Math.round(baseGoldRun.reward.gold * 1.5), 'midas must significantly boost combat gold');

  // 3c. big_game_hunter: >= 6 elites on map & +35 elite gold
  const bghRun = createNewRun({ dailyDateKey: sampleDateForMod.get('big_game_hunter') });
  const bghElites = bghRun.map.flat().filter((n) => n.type === 'elite').length;
  assert.ok(bghElites >= 6, `big_game_hunter expected >= 6 elites, got ${bghElites}`);
  const normalEliteRun = createNewRun({ seed: 8888, skipNeow: true });
  normalEliteRun.floor = 8;
  normalEliteRun.combat = { role: 'elite' };
  transitionCombatVictory(normalEliteRun);
  const bghEliteRun = createNewRun({ seed: 8888, skipNeow: true });
  bghEliteRun.dailyChallenge = { dateKey: '2026-11-19', seedCode: 'S-T', characterId: 'ironclad', modifierIds: ['big_game_hunter'] };
  bghEliteRun.floor = 8;
  bghEliteRun.combat = { role: 'elite' };
  transitionCombatVictory(bghEliteRun);
  assert.equal(bghEliteRun.reward.gold, normalEliteRun.reward.gold + 35);

  // 3d. lethality, time_dilation, cursed_run in combat
  const lethalRun = createNewRun({ seed: 601, skipNeow: true });
  lethalRun.dailyChallenge = { dateKey: '2026-11-19', seedCode: 'S-L', characterId: 'ironclad', modifierIds: ['lethality', 'time_dilation', 'cursed_run'] };
  const baselineCombatRun = createNewRun({ seed: 601, skipNeow: true });
  const testEnc = { id: 'daily_mod_probe', name: '探针怪', enemies: [{ templateId: 'jaw_worm' }] };
  startCombat(baselineCombatRun, testEnc, 'normal');
  startCombat(lethalRun, testEnc, 'normal');
  assert.equal(lethalRun.player.statuses.strength, 3, 'lethality grants player +3 Strength');
  assert.equal(lethalRun.combat.enemies[0].statuses.strength, 3, 'lethality grants enemies +3 Strength');
  assert.equal(lethalRun.player.energy, lethalRun.player.maxEnergy + 1, 'time_dilation grants T1 +1 Energy');
  assert.equal(lethalRun.combat.hand.length, 6, 'time_dilation grants T1 +1 Draw (5 -> 6)');
  assert.equal(lethalRun.combat.enemies[0].block, 6, 'time_dilation grants enemies +6 starting Block');
  assert.ok(
    lethalRun.combat.enemies[0].maxHp > baselineCombatRun.combat.enemies[0].maxHp,
    'cursed_run must boost enemy maxHp by +12%'
  );

  // 4. Deterministic Run Scoring, Grade thresholds, dailyRecords, anti-Ascension-skip, & Shareable Battle Report
  assert.equal(getScoreGrade(1400), 'S+');
  assert.equal(getScoreGrade(1050), 'S');
  assert.equal(getScoreGrade(750), 'A');
  assert.equal(getScoreGrade(450), 'B');
  assert.equal(getScoreGrade(200), 'C');

  const meta = createDefaultMeta();
  const dailyAttempt1 = createNewRun({ dailyDateKey: '2026-11-19' });
  dailyAttempt1.act = 1;
  dailyAttempt1.floor = 10;
  dailyAttempt1.stats.floorsCleared = 10;
  dailyAttempt1.stats.combatsWon = 5;
  dailyAttempt1.stats.perfectCombats = 2;
  dailyAttempt1.stats.elitesSlain = 1;
  dailyAttempt1.stats.enemiesSlain = 7;
  dailyAttempt1.stats.totalDamageDealt = 420;
  dailyAttempt1.stats.highestSingleHit = 28;
  dailyAttempt1.stats.defeatedBy = '六火亡魂';
  dailyAttempt1.runOutcome = 'defeat';

  const score1 = calculateRunScore(dailyAttempt1);
  assert.ok(score1.totalScore > 0);
  assert.ok(score1.breakdown.length >= 4);

  const rec1 = recordCompletedRun(meta, dailyAttempt1);
  assert.equal(rec1.alreadyRecorded, false);
  assert.equal(meta.dailyRecords['2026-11-19'].attempts, 1);
  assert.equal(meta.dailyRecords['2026-11-19'].bestScore, score1.totalScore);
  assert.equal(meta.dailyRecords['2026-11-19'].outcome, 'defeat');
  assert.equal(meta.runHistory[0].dailyDateKey, '2026-11-19');
  assert.ok(Array.isArray(meta.runHistory[0].deckSummary) && meta.runHistory[0].deckSummary.length > 0);
  assert.ok(Array.isArray(meta.runHistory[0].relicIds) && meta.runHistory[0].relicIds.length >= 1);

  // Duplicate call on same attempt stays idempotent
  assert.equal(recordCompletedRun(meta, dailyAttempt1).alreadyRecorded, true);
  assert.equal(meta.dailyRecords['2026-11-19'].attempts, 1);

  // Second attempt on same daily date winning Act 2 beats personal best & does NOT advance maxAscensionUnlocked
  const dailyAttempt2 = createNewRun({ dailyDateKey: '2026-11-19' });
  dailyAttempt2.act = 2;
  dailyAttempt2.floor = 16;
  dailyAttempt2.stats.floorsCleared = 32;
  dailyAttempt2.stats.combatsWon = 16;
  dailyAttempt2.stats.perfectCombats = 6;
  dailyAttempt2.stats.elitesSlain = 4;
  dailyAttempt2.stats.bossesSlain = 2;
  dailyAttempt2.stats.enemiesSlain = 24;
  dailyAttempt2.stats.totalDamageDealt = 1850;
  dailyAttempt2.stats.highestSingleHit = 64;
  dailyAttempt2.runOutcome = 'victory';

  const rec2 = recordCompletedRun(meta, dailyAttempt2);
  assert.equal(rec2.alreadyRecorded, false);
  assert.equal(rec2.unlockedAscension, null, 'Daily victory must not unlock Ascension');
  assert.equal(meta.maxAscensionUnlocked, 0);
  assert.equal(meta.dailyRecords['2026-11-19'].attempts, 2);
  assert.equal(meta.dailyRecords['2026-11-19'].outcome, 'victory');
  assert.ok(meta.dailyRecords['2026-11-19'].bestScore > score1.totalScore);
  assert.equal(meta.bestScore, meta.dailyRecords['2026-11-19'].bestScore);

  // Shareable battle report contains key highlights, daily Ascension & share URL
  const report = buildRunReportFromState(dailyAttempt2);
  const text = formatShareableBattleReport(report, dailyUrl);
  assert.ok(text.includes(`每日挑战 2026-11-19 · 进阶 ${dailyAttempt2.ascension}`));
  assert.ok(text.includes(report.grade));
  assert.ok(text.includes('今日词条：'));
  assert.ok(text.includes('总输出 1850'));
  assert.ok(text.includes('最高单击 64'));
  assert.ok(text.includes('?daily=2026-11-19'));
});

test('Relic Pool Tiering, Small/Medium/Large Chests, Dual Shop Relic Slots & Membership Card Discount, New Events, and Act 3 Meta Scoring', () => {
  // 1. Strict pool isolation: NON_STARTER_RELIC_IDS excludes starter, shop, event, and boss; character pools isolate class relics
  const ironPools = getRelicPoolsForCharacter('ironclad');
  const silentPools = getRelicPoolsForCharacter('silent');
  assert.equal(ironPools.common.includes('snecko_skull'), false);
  assert.equal(silentPools.common.includes('snecko_skull'), true);
  assert.equal(ironPools.uncommon.includes('red_skull'), true);
  assert.equal(silentPools.uncommon.includes('red_skull'), false);
  assert.equal(ironPools.shop.length, 7);
  assert.equal(ironPools.event.length, 4);
  assert.equal(ironPools.boss.length, 11);
  assert.equal(ironPools.boss.includes('black_blood'), true);
  assert.equal(ironPools.boss.includes('wrist_blade'), false);
  assert.equal(silentPools.boss.length, 12);
  assert.equal(silentPools.boss.includes('ring_of_the_serpent'), true);
  assert.equal(silentPools.boss.includes('black_blood'), false);
  for (const id of NON_STARTER_RELIC_IDS) {
    assert.ok(['common', 'uncommon', 'rare'].includes(RELIC_LIBRARY[id].tier));
  }

  // 2. Treasure chest generates small / medium / large tiers cleanly across seeds
  const seenChestTiers = new Set();
  for (let s = 1; s <= 40; s += 1) {
    const st = createNewRun({ seed: 8000 + s, skipNeow: true });
    const f9 = st.map[8][0];
    st.currentNodeId = st.map[7].find((n) => n.nextIds.includes(f9.id))?.id ?? null;
    if (!st.currentNodeId) continue;
    selectMapNode(st, f9.id);
    if (st.screen === 'treasure') {
      seenChestTiers.add(st.treasureState.chestTier);
      const opened = openTreasureChest(st);
      assert.equal(opened.ok, true);
      assert.ok(opened.relicId);
      assert.ok(['common', 'uncommon', 'rare'].includes(RELIC_LIBRARY[opened.relicId].tier));
    }
  }
  assert.ok(seenChestTiers.has('small') && seenChestTiers.has('medium') && seenChestTiers.has('large'));

  // 3. Shop offers 2 distinct relic slots (general + shop-exclusive) and Membership Card halves remaining prices live
  const shopState = createNewRun({ seed: 8100, skipNeow: true });
  shopState.player.gold = 999;
  const firstShop = shopState.map
    .flat()
    .find((n) => n.type === 'shop');
  if (firstShop) {
    shopState.currentNodeId =
      firstShop.floor === 1
        ? null
        : shopState.map[firstShop.floor - 2].find((n) => n.nextIds.includes(firstShop.id)).id;
    selectMapNode(shopState, firstShop.id);
    assert.equal(shopState.screen, 'shop');
    assert.ok(shopState.shop.relicOffer);
    assert.ok(['common', 'uncommon', 'rare'].includes(RELIC_LIBRARY[shopState.shop.relicOffer.relicId].tier));
    assert.ok(shopState.shop.shopRelicOffer);
    assert.equal(RELIC_LIBRARY[shopState.shop.shopRelicOffer.relicId].tier, 'shop');

    // Force membership_card into shopRelicOffer & buy -> assert unsold prices & purge drop by 50%
    shopState.shop.shopRelicOffer = { relicId: 'membership_card', basePrice: 150, price: 150, sold: false };
    const cardPriceBefore = shopState.shop.cards[0].price;
    const generalRelicPriceBefore = shopState.shop.relicOffer.price;
    const purgePriceBefore = shopState.shop.purgeCost;
    assert.equal(buyShopExclusiveRelic(shopState).ok, true);
    assert.equal(shopState.shop.shopRelicOffer.sold, true);
    assert.ok(shopState.shop.cards[0].price <= Math.ceil(cardPriceBefore * 0.5) + 1);
    assert.ok(shopState.shop.relicOffer.price <= Math.ceil(generalRelicPriceBefore * 0.5) + 1);
    assert.ok(shopState.shop.purgeCost <= Math.ceil(purgePriceBefore * 0.5) + 1);
  }

  // 4. Event Act gating + Golden Idol, Cursed Tome (Enchiridion), Masked Bandits (Red Mask), Mind Bloom
  const a1Events = getEventIdsForAct(1);
  const a2Events = getEventIdsForAct(2);
  const a3Events = getEventIdsForAct(3);
  assert.equal(a1Events.includes('masked_bandits'), false);
  assert.equal(a2Events.includes('masked_bandits'), true);
  assert.equal(a2Events.includes('mind_bloom'), false);
  assert.equal(a3Events.includes('mind_bloom'), true);

  const evtRun = createNewRun({ seed: 8200, skipNeow: true });
  evtRun.screen = 'event';
  evtRun.eventState = { eventId: 'golden_idol', resolved: false, pendingPurge: false, pendingCardAction: null, libraryChoices: null, outcomeText: '', upgradedCardIds: [], addedCardIds: [] };
  assert.equal(chooseEventOption(evtRun, 'smash_trap').ok, true);
  assert.equal(evtRun.player.relics.includes('golden_idol_relic'), true);
  assert.equal(continueFromEvent(evtRun).ok, true);

  evtRun.screen = 'event';
  evtRun.eventState = { eventId: 'cursed_tome', resolved: false, pendingPurge: false, pendingCardAction: null, libraryChoices: null, outcomeText: '', upgradedCardIds: [], addedCardIds: [] };
  assert.equal(chooseEventOption(evtRun, 'read_final_chapter').ok, true);
  assert.equal(evtRun.player.relics.includes('enchiridion'), true);
  assert.equal(continueFromEvent(evtRun).ok, true);

  evtRun.screen = 'event';
  evtRun.eventState = { eventId: 'masked_bandits', resolved: false, pendingPurge: false, pendingCardAction: null, libraryChoices: null, outcomeText: '', upgradedCardIds: [], addedCardIds: [] };
  assert.equal(chooseEventOption(evtRun, 'fight_bandits').ok, true);
  assert.equal(evtRun.screen, 'combat');
  evtRun.combat.enemies.forEach((e) => {
    e.hp = 0;
  });
  transitionCombatVictory(evtRun);
  assert.equal(evtRun.screen, 'reward');
  assert.equal(evtRun.reward.relicId, 'red_mask');
  assert.ok(evtRun.reward.gold > 75, 'Golden Idol should boost event combat gold by +25%');

  evtRun.screen = 'event';
  evtRun.act = 3;
  evtRun.eventState = { eventId: 'mind_bloom', resolved: false, pendingPurge: false, pendingCardAction: null, libraryChoices: null, outcomeText: '', upgradedCardIds: [], addedCardIds: [] };
  const maxHpBeforeBloom = evtRun.player.maxHp;
  assert.equal(chooseEventOption(evtRun, 'awake_memory').ok, true);
  assert.ok(evtRun.player.maxHp < maxHpBeforeBloom);
  assert.ok(evtRun.player.deck.every((c) => !canUpgradeCard(c)), 'Awake Memory upgrades all upgradable cards');

  // 5. Act 3 Meta Scoring & Battle Report
  const a3Win = createNewRun({ seed: 8300, skipNeow: true });
  a3Win.act = 3;
  a3Win.floor = 16;
  a3Win.runOutcome = 'victory';
  const a3Score = calculateRunScore(a3Win);
  assert.ok(a3Score.breakdown.some((b) => b.label === '三幕终极登顶' && b.points === 500));
  const a3Report = formatShareableBattleReport(buildRunReportFromState(a3Win));
  assert.ok(a3Report.includes('👑 三幕终极登顶'));
});

test('Ascension 6-10 rules: damaged start & 2 potion slots (A6), gold & upgrade compression (A7), dynamic events (A8), AI & status scaling (A9), and Act 3 Twin Boss (A10)', () => {
  // 0. Metadata & URL clamping at MAX_ASCENSION = 10
  assert.equal(MAX_ASCENSION, 10);
  assert.equal(ASCENSION_DEFS.length, 11);
  assert.equal(parseChallengeInput('?seed=S-16&asc=99').ascension, 10);
  assert.equal(
    buildChallengeUrl('https://lishiyi.github.io/card-game/', 42, 99),
    'https://lishiyi.github.io/card-game/?seed=S-16&asc=10'
  );

  // 1. A6: Damaged start (-10% HP rounded down) & 2 potion slots (vs 3 on A5)
  const a5Iron = createNewRun({ seed: 9101, ascension: 5, characterId: 'ironclad', skipNeow: true });
  const a6Iron = createNewRun({ seed: 9101, ascension: 6, characterId: 'ironclad', skipNeow: true });
  const a6Silent = createNewRun({ seed: 9101, ascension: 6, characterId: 'silent', skipNeow: true });
  assert.equal(getStarterPotionSlotCount(5), 3);
  assert.equal(getStarterPotionSlotCount(6), 2);
  assert.equal(a5Iron.player.hp, 75);
  assert.equal(a5Iron.player.potions.length, 3);
  assert.equal(a6Iron.player.maxHp, 75);
  assert.equal(a6Iron.player.hp, 68, 'Ironclad starts 68/75 on A6 (75 - floor(7.5))');
  assert.equal(a6Iron.player.potions.length, 2);
  assert.equal(a6Iron.player.potions[0], 'fire_potion');
  assert.equal(a6Silent.player.maxHp, 65);
  assert.equal(a6Silent.player.hp, 59, 'Silent starts 59/65 on A6 (65 - floor(6.5))');
  assert.equal(a6Silent.player.potions.length, 2);

  // 2. A7: Gold reduction (-15% normal/elite, -25% boss) & halved card reward upgrade rate
  const a6GoldRun = createNewRun({ seed: 9202, ascension: 6, skipNeow: true });
  const a7GoldRun = createNewRun({ seed: 9202, ascension: 7, skipNeow: true });
  a6GoldRun.floor = 10;
  a7GoldRun.floor = 10;
  a6GoldRun.combat = { role: 'elite', enemies: [] };
  a7GoldRun.combat = { role: 'elite', enemies: [] };
  transitionCombatVictory(a6GoldRun);
  transitionCombatVictory(a7GoldRun);
  assert.ok(a7GoldRun.reward.gold < a6GoldRun.reward.gold, 'A7 must drop ~15% less elite gold than A6');

  const a6BossGoldRun = createNewRun({ seed: 9203, ascension: 6, skipNeow: true });
  const a7BossGoldRun = createNewRun({ seed: 9203, ascension: 7, skipNeow: true });
  a6BossGoldRun.act = 1;
  a7BossGoldRun.act = 1;
  a6BossGoldRun.combat = { role: 'boss', enemies: [] };
  a7BossGoldRun.combat = { role: 'boss', enemies: [] };
  transitionCombatVictory(a6BossGoldRun);
  transitionCombatVictory(a7BossGoldRun);
  assert.ok(
    a7BossGoldRun.bossReward.bossGold <= Math.round(a6BossGoldRun.bossReward.bossGold * 0.78),
    `Expected A7 bossGold (${a7BossGoldRun.bossReward.bossGold}) <= 75% of A6 (${a6BossGoldRun.bossReward.bossGold})`
  );

  const a6UpgRun = createNewRun({ seed: 9204, ascension: 6, skipNeow: true });
  const a7UpgRun = createNewRun({ seed: 9204, ascension: 7, skipNeow: true });
  a6UpgRun.act = 3;
  a7UpgRun.act = 3;
  let a6Upgrades = 0;
  let a7Upgrades = 0;
  for (let i = 0; i < 100; i += 1) {
    a6Upgrades += rollRewardCards(a6UpgRun, 3, 'normal', { affectPity: false }).filter((c) => c.upgraded).length;
    a7Upgrades += rollRewardCards(a7UpgRun, 3, 'normal', { affectPity: false }).filter((c) => c.upgraded).length;
  }
  assert.ok(a7Upgrades < a6Upgrades, `Expected A7 upgrades (${a7Upgrades}) < A6 (${a6Upgrades})`);

  // 3. A8: Dynamic event penalties & descriptions
  const tune7 = getEventTuning(7);
  const tune8 = getEventTuning(8);
  assert.equal(tune7.isA8, false);
  assert.equal(tune8.isA8, true);
  assert.equal(tune8.shiningLightHpLoss, 16);
  assert.equal(tune8.alchemistBuyGold, 45);
  assert.equal(tune8.mindBloomRichGold, 360);
  const a8Choices = getEventChoicesForAscension('shining_light', 8);
  assert.ok(a8Choices[0].detail.includes('16 点生命'));

  const a8EvRun = createNewRun({ seed: 9301, ascension: 8, skipNeow: true });
  a8EvRun.screen = 'event';
  a8EvRun.eventState = { eventId: 'shining_light', resolved: false };
  a8EvRun.player.hp = 16;
  assert.equal(chooseEventOption(a8EvRun, 'enter_light').ok, false, 'A8 Shining Light requires HP > 16');
  a8EvRun.player.hp = 50;
  assert.equal(chooseEventOption(a8EvRun, 'enter_light').ok, true);
  assert.equal(a8EvRun.player.hp, 34);

  a8EvRun.eventState = { eventId: 'potion_alchemist', resolved: false };
  a8EvRun.player.gold = 40;
  assert.equal(chooseEventOption(a8EvRun, 'buy_potions').ok, false, 'A8 Alchemist requires >= 45 gold');
  a8EvRun.player.gold = 50;
  assert.equal(chooseEventOption(a8EvRun, 'buy_potions').ok, true);
  assert.equal(a8EvRun.player.gold, 5);

  // 4. A9: Enemy HP, Damage, Passive Status, & AI Intent upgrades
  const a8Laga = createEnemyInstance(createNewRun({ seed: 9401, ascension: 8, skipNeow: true }), {
    templateId: 'lagavulin',
  });
  const a9Laga = createEnemyInstance(createNewRun({ seed: 9401, ascension: 9, skipNeow: true }), {
    templateId: 'lagavulin',
  });
  assert.equal(a8Laga.statuses.metallicize, 5);
  assert.equal(a9Laga.statuses.metallicize, 6);
  assert.equal(a9Laga.block, 6);
  assert.ok(a9Laga.maxHp > a8Laga.maxHp, 'A9 elite HP +24% > A8 +15%');

  a9Laga.statuses.asleep = 0;
  a9Laga.awakeTurnIndex = 1;
  const lagaNext = predictNextTurnIntents(a9Laga, a8Laga, 9);
  assert.ok(lagaNext.tooltipLines[0].includes('失去 2 点力量与 2 点敏捷'));

  const a9Sentry = createEnemyInstance(createNewRun({ seed: 9402, ascension: 9, skipNeow: true }), {
    templateId: 'sentry',
    variantIndex: 0,
  });
  assert.equal(a9Sentry.intent.id, 'bolt');
  assert.equal(a9Sentry.intent.addDiscardCards[0].count, 3, 'A9 Sentry shuffles 3 Dazed instead of 2');
  assert.ok(a9Sentry.intent.summary.includes('3 张【晕眩】'));

  const a9Nob = createEnemyInstance(createNewRun({ seed: 9403, ascension: 9, skipNeow: true }), {
    templateId: 'gremlin_nob',
  });
  assert.equal(a9Nob.intent.applySelfStatuses.enrage, 3);

  const a9Cultist = createEnemyInstance(createNewRun({ seed: 9404, ascension: 9, skipNeow: true }), {
    templateId: 'cultist',
  });
  assert.equal(a9Cultist.intent.applySelfStatuses.ritual, 4);
  assert.ok(a9Cultist.maxHp >= createEnemyInstance(createNewRun({ seed: 9404, ascension: 8, skipNeow: true }), {
    templateId: 'cultist',
  }).maxHp);

  // 5. A10: Blocks early Act 1/2 victory; Act 3 Boss triggers 2nd distinct Act 3 Boss immediately
  const a10Run = createNewRun({ seed: 9500, ascension: 10, skipNeow: true });
  a10Run.bossReward = {
    actCleared: 2,
    bossGold: 100,
    cardChoices: [],
    cardClaimed: true,
    relicChoices: ['sozu'],
    pickedRelicId: null,
  };
  a10Run.act = 2;
  a10Run.screen = 'boss_reward';
  const earlySettle = settleVictory(a10Run);
  assert.equal(earlySettle.ok, false, 'A10 cannot settle victory early before Act 3 Twin Boss');

  assert.equal(proceedToNextAct(a10Run).ok, true);
  assert.equal(a10Run.act, 3);
  a10Run.floor = 15;
  a10Run.currentNodeId = a10Run.map[14][0].id;
  const act3BossNode = a10Run.map[15][0];
  a10Run.bossEncounterId = 'time_eater_boss';
  assert.equal(selectMapNode(a10Run, act3BossNode.id).ok, true);
  assert.equal(a10Run.screen, 'combat');
  assert.ok(a10Run.combat.encounterName.includes('终末双王 · 第 1/2 战'));
  const firstBossId = a10Run.bossEncounterId;

  // Player takes damage before finishing Boss 1 -> Burning Blood (+6) triggers before Boss 2 spawns
  a10Run.player.hp = 30;
  a10Run.combat.enemies.forEach((e) => {
    e.hp = 1;
    e.block = 0;
  });
  a10Run.combat.hand = [{ instanceId: 88001, cardId: 'strike', upgraded: true }];
  a10Run.player.energy = 3;
  const killBoss1 = runPlayCard(a10Run, 88001, a10Run.combat.enemies[0].id);
  assert.equal(killBoss1.ok, true);
  assert.equal(killBoss1.outcome, 'ongoing', 'PlayCard returns ongoing when Twin Boss phase 2 starts');
  assert.equal(a10Run.screen, 'combat');
  assert.equal(a10Run.act3BossRushStage, 2);
  assert.equal(a10Run.act3FirstBossId, firstBossId);
  assert.notEqual(a10Run.bossEncounterId, firstBossId, '2nd Act 3 Boss must be distinct from 1st');
  assert.ok(a10Run.combat.encounterName.includes('终末双王 · 第 2/2 战'));
  assert.equal(a10Run.player.hp, 36, 'Burning Blood (+6) healed after Boss 1 before Boss 2 starts without rest');

  // Verify runRestartCombat in Boss 2 restarts Boss 2 (NOT Boss 1!)
  a10Run.player.hp = 20;
  const restartBoss2 = runRestartCombat(a10Run);
  assert.equal(restartBoss2.ok, true);
  assert.equal(a10Run.act3BossRushStage, 2);
  assert.equal(a10Run.player.hp, 36);
  assert.ok(a10Run.combat.encounterName.includes('终末双王 · 第 2/2 战'));

  // Defeat Boss 2 -> Final Victory!
  a10Run.combat.enemies.forEach((e) => {
    if (e.templateId === 'awakened_one') e.unawakened = false;
    e.hp = 1;
    e.block = 0;
  });
  a10Run.combat.hand = [{ instanceId: 88002, cardId: 'cleave', upgraded: true }];
  a10Run.player.energy = 3;
  const killBoss2 = runPlayCard(a10Run, 88002);
  assert.equal(killBoss2.ok, true);
  assert.equal(a10Run.screen, 'game_over');
  assert.equal(a10Run.runOutcome, 'victory');
  assert.equal(a10Run.stats.bossesSlain, 2);

  // Meta A9 -> A10 progression cap
  const metaA9 = createDefaultMeta();
  metaA9.maxAscensionUnlocked = 9;
  const a9Win = createNewRun({ seed: 9501, ascension: 9, skipNeow: true });
  a9Win.act = 3;
  a9Win.floor = 16;
  a9Win.runOutcome = 'victory';
  const recA9 = recordCompletedRun(metaA9, a9Win);
  assert.equal(recA9.unlockedAscension, 10);
  assert.equal(metaA9.maxAscensionUnlocked, 10);

  const a10MetaRec = recordCompletedRun(metaA9, a10Run);
  assert.equal(a10MetaRec.unlockedAscension, null);
  assert.equal(metaA9.maxAscensionUnlocked, 10, 'Capped at MAX_ASCENSION 10');
});

test('Stage 1: Act-scoped 35-event pool, 7 Stage 1 events + Bloody Idol, Silent neutral copy, and independent per-character Ascension & legacy meta migration', () => {
  // 1. Act-scoped event pool integrity (35 total events, proper minAct/maxAct filtering)
  assert.equal(EVENT_IDS.length, 35, 'Expected 35 total events including P1 expansion');
  const act1Events = getEventIdsForAct(1);
  const act2Events = getEventIdsForAct(2);
  const act3Events = getEventIdsForAct(3);

  assert.ok(act1Events.includes('scrap_ooze') && !act2Events.includes('scrap_ooze') && !act3Events.includes('scrap_ooze'));
  assert.ok(act1Events.includes('golden_idol') && !act2Events.includes('golden_idol') && !act3Events.includes('golden_idol'));
  assert.ok(act1Events.includes('wing_statue') && act2Events.includes('wing_statue') && !act3Events.includes('wing_statue'));
  assert.ok(!act1Events.includes('council_of_ghosts') && act2Events.includes('council_of_ghosts') && !act3Events.includes('council_of_ghosts'));
  assert.ok(!act1Events.includes('forgotten_altar') && act2Events.includes('forgotten_altar') && !act3Events.includes('forgotten_altar'));
  assert.ok(!act1Events.includes('augmenter') && act2Events.includes('augmenter') && act3Events.includes('augmenter'));
  assert.ok(!act1Events.includes('sensory_stone') && !act2Events.includes('sensory_stone') && act3Events.includes('sensory_stone'));
  assert.ok(!act1Events.includes('winding_halls') && !act2Events.includes('winding_halls') && act3Events.includes('winding_halls'));
  assert.ok(!act1Events.includes('mind_bloom') && !act2Events.includes('mind_bloom') && act3Events.includes('mind_bloom'));

  // Neutral copy check: living_wall & Silent Neow blessings must NOT hardcode "铁甲战士"
  assert.equal(
    JSON.stringify(EVENT_LIBRARY.living_wall).includes('铁甲战士'),
    false,
    'living_wall copy must be character-neutral'
  );
  const silentNeowRun = createNewRun({ seed: 9911, characterId: 'silent', skipNeow: false });
  assert.equal(
    JSON.stringify(silentNeowRun.neowState.options).includes('铁甲战士'),
    false,
    'Silent Neow options must not reference Ironclad'
  );

  // Helper to stage an event cleanly
  const openEvent = (state, eventId) => {
    state.screen = 'event';
    state.eventState = {
      eventId,
      resolved: false,
      pendingPurge: false,
      pendingCardAction: null,
      libraryChoices: null,
      outcomeText: '',
      upgradedCardIds: [],
      addedCardIds: [],
      oozeAttempts: 0,
      lastAttemptNote: '',
      purgeHpCost: 0,
    };
  };

  // 2. Scrap Ooze (Act 1 repeatable escalating risk/chance -> relic)
  const oozeRun = createNewRun({ seed: 10101, skipNeow: true });
  oozeRun.player.hp = 70;
  openEvent(oozeRun, 'scrap_ooze');
  const relicsBeforeOoze = oozeRun.player.relics.length;
  let oozeResolved = false;
  let attempts = 0;
  while (!oozeResolved && attempts < 10) {
    attempts += 1;
    const hpBeforeTry = oozeRun.player.hp;
    const res = chooseEventOption(oozeRun, 'reach_ooze');
    assert.equal(res.ok, true);
    if (oozeRun.eventState.resolved) {
      oozeResolved = true;
      const expectedCost = 5 + (attempts - 1);
      assert.ok(
        oozeRun.eventState.outcomeText.includes(`-${expectedCost} 生命`),
        `Expected HP cost note -${expectedCost} in outcomeText: ${oozeRun.eventState.outcomeText}`
      );
    } else {
      assert.equal(oozeRun.player.hp, hpBeforeTry - (5 + (attempts - 1)));
      assert.equal(oozeRun.eventState.oozeAttempts, attempts);
      assert.ok(oozeRun.eventState.lastAttemptNote.includes('酸液'));
    }
  }
  assert.equal(oozeResolved, true, 'Scrap Ooze must eventually guarantee relic before 10 tries');
  assert.equal(oozeRun.player.relics.length, relicsBeforeOoze + 1);
  // Also guarantee at least one multi-attempt retry path across seeds 10110..10140
  let sawRetryEscalation = false;
  for (let s = 10110; s <= 10140; s += 1) {
    const r = createNewRun({ seed: s, skipNeow: true });
    r.player.hp = 70;
    openEvent(r, 'scrap_ooze');
    chooseEventOption(r, 'reach_ooze');
    if (!r.eventState.resolved) {
      assert.equal(r.player.hp, 65, 'First failed Scrap Ooze attempt costs 5 HP');
      assert.equal(r.eventState.oozeAttempts, 1);
      assert.ok(r.eventState.lastAttemptNote.includes('代价 6 生命'));
      assert.ok(r.eventState.lastAttemptNote.includes('60%'));
      sawRetryEscalation = true;
      break;
    }
  }
  assert.equal(sawRetryEscalation, true, 'Must verify Scrap Ooze retry HP/chance escalation');

  // 3. Wing Statue: purge HP cost deferred until confirm (cancel stays free) + heavy attack >= 10 check
  const wingRun = createNewRun({ seed: 10102, characterId: 'silent', skipNeow: true });
  wingRun.player.hp = 60;
  assert.equal(playerHasHeavyAttackCard(wingRun), false, 'Silent starter deck has no >=10 base dmg attack');
  openEvent(wingRun, 'wing_statue');
  const blockedDestroy = chooseEventOption(wingRun, 'destroy_wing');
  assert.equal(blockedDestroy.ok, false);
  // Pray -> cancel must NOT deduct HP
  const prayRes = chooseEventOption(wingRun, 'pray_wing');
  assert.equal(prayRes.ok, true);
  assert.equal(wingRun.eventState.pendingPurge, true);
  assert.equal(wingRun.eventState.purgeHpCost, 7);
  assert.equal(wingRun.player.hp, 60);
  cancelEventPurge(wingRun);
  assert.equal(wingRun.player.hp, 60, 'Canceling Wing Statue purge must not deduct HP');
  assert.equal(wingRun.eventState.purgeHpCost, 0);
  // Pray -> confirm deducts 7 HP and removes card
  chooseEventOption(wingRun, 'pray_wing');
  const deckBeforeWing = wingRun.player.deck.length;
  const purgeRes = completeEventPurge(wingRun, wingRun.player.deck[0].instanceId);
  assert.equal(purgeRes.ok, true);
  assert.equal(wingRun.player.hp, 53);
  assert.equal(wingRun.player.deck.length, deckBeforeWing - 1);
  // With a >=10 dmg attack (Predator), destroy_wing succeeds for +65 gold
  wingRun.player.deck.push(createCardInstance(wingRun, 'predator', false));
  assert.equal(playerHasHeavyAttackCard(wingRun), true);
  const goldBeforeWing = wingRun.player.gold;
  openEvent(wingRun, 'wing_statue');
  const destroyOk = chooseEventOption(wingRun, 'destroy_wing');
  assert.equal(destroyOk.ok, true);
  assert.equal(wingRun.player.gold, goldBeforeWing + 65);

  // 4. Council of Ghosts: lose 35% Max HP, gain 3x Apparition (ethereal/exhaust, upgraded removes ethereal)
  const ghostRun = createNewRun({ seed: 10103, skipNeow: true });
  ghostRun.player.maxHp = 80;
  ghostRun.player.hp = 80;
  openEvent(ghostRun, 'council_of_ghosts');
  const ghostRes = chooseEventOption(ghostRun, 'accept_ghosts');
  assert.equal(ghostRes.ok, true);
  assert.equal(ghostRun.player.maxHp, 52, '80 - floor(80 * 0.35) = 52');
  assert.equal(ghostRun.player.hp, 52);
  const apparitions = ghostRun.player.deck.filter((c) => c.cardId === 'apparition');
  assert.equal(apparitions.length, 3);
  assert.equal(getCardStats(apparitions[0]).ethereal, true);
  assert.equal(getCardStats(apparitions[0]).exhaust, true);
  apparitions[0].upgraded = true;
  assert.equal(getCardStats(apparitions[0]).ethereal, false, 'Apparition+ loses Ethereal');

  // 5. Forgotten Altar: Golden Idol -> Bloody Idol swap + full heal + +5 HP on subsequent gold gains
  const altarRun = createNewRun({ seed: 10104, skipNeow: true });
  altarRun.player.hp = 30;
  openEvent(altarRun, 'forgotten_altar');
  assert.equal(chooseEventOption(altarRun, 'offer_golden_idol').ok, false, 'Requires Golden Idol');
  grantRelicToPlayer(altarRun, 'golden_idol_relic');
  const altarSwap = chooseEventOption(altarRun, 'offer_golden_idol');
  assert.equal(altarSwap.ok, true);
  assert.equal(altarRun.player.relics.includes('golden_idol_relic'), false, 'Golden Idol replaced');
  assert.equal(altarRun.player.relics.includes('bloody_idol'), true, 'Bloody Idol granted');
  assert.equal(altarRun.player.hp, altarRun.player.maxHp, 'Full heal on offering Golden Idol');
  // Test Bloody Idol heals 5 HP when gaining gold (via reward claim & desecrate_altar)
  altarRun.player.hp = 50;
  openEvent(altarRun, 'forgotten_altar');
  assert.equal(chooseEventOption(altarRun, 'desecrate_altar').ok, true);
  assert.equal(altarRun.player.hp, 55, 'Bloody Idol must heal +5 HP on event gold gain');
  assert.ok(altarRun.player.deck.some((c) => c.cardId === 'regret'));

  // 6. Augmenter: transform_rare turns chosen card into a Rare class card
  const augRun = createNewRun({ seed: 10105, characterId: 'silent', skipNeow: true });
  openEvent(augRun, 'augmenter');
  const augPick = chooseEventOption(augRun, 'augment_rare_transform');
  assert.equal(augPick.ok, true);
  assert.equal(augRun.eventState.pendingCardAction, 'transform_rare');
  const targetStrike = augRun.player.deck.find((c) => c.cardId === 'strike');
  const augDone = completeEventCardAction(augRun, targetStrike.instanceId);
  assert.equal(augDone.ok, true);
  const transformedCard = augRun.player.deck.find((c) => c.instanceId === augRun.eventState.addedCardIds[0]);
  assert.ok(transformedCard);
  assert.equal(CARD_LIBRARY[transformedCard.cardId].rarity, 'rare');
  assert.equal(getCardCharacter(CARD_LIBRARY[transformedCard.cardId]), 'silent');

  // 7. Sensory Stone: recall_2 gives 3 upgraded Colorless+ choices; recall_3 gives Rare Colorless+ & relic
  const stoneRun = createNewRun({ seed: 10106, skipNeow: true });
  stoneRun.player.hp = 70;
  openEvent(stoneRun, 'sensory_stone');
  assert.equal(chooseEventOption(stoneRun, 'recall_2').ok, true);
  assert.equal(stoneRun.player.hp, 65);
  assert.equal(stoneRun.eventState.libraryChoices.length, 3);
  assert.equal(
    stoneRun.eventState.libraryChoices.every((c) => c.upgraded && getCardCharacter(CARD_LIBRARY[c.cardId]) === 'colorless'),
    true,
    'recall_2 must offer 3 upgraded Colorless+ cards'
  );
  pickEventLibraryCard(stoneRun, stoneRun.eventState.libraryChoices[0].instanceId);
  assert.equal(stoneRun.eventState.resolved, true);

  openEvent(stoneRun, 'sensory_stone');
  const stoneRelicsBefore = stoneRun.player.relics.length;
  assert.equal(chooseEventOption(stoneRun, 'recall_3').ok, true);
  assert.equal(stoneRun.player.hp, 53);
  assert.equal(stoneRun.player.relics.length, stoneRelicsBefore + 1);
  const addedRareColorless = stoneRun.player.deck.find((c) => c.instanceId === stoneRun.eventState.addedCardIds[0]);
  assert.equal(addedRareColorless.upgraded, true);
  assert.equal(CARD_LIBRARY[addedRareColorless.cardId].rarity, 'rare');
  assert.equal(getCardCharacter(CARD_LIBRARY[addedRareColorless.cardId]), 'colorless');

  // 8. Winding Halls: embrace_madness adds 2x 0-cost Colorless uncommon cards; retrace_steps heals + Doubt; push_through_halls loses 6% Max HP
  const hallRun = createNewRun({ seed: 10107, skipNeow: true });
  hallRun.player.hp = 70;
  openEvent(hallRun, 'winding_halls');
  assert.equal(chooseEventOption(hallRun, 'embrace_madness').ok, true);
  assert.equal(hallRun.player.hp, 58);
  assert.equal(hallRun.eventState.addedCardIds.length, 2);
  for (const cid of hallRun.eventState.addedCardIds) {
    const inst = hallRun.player.deck.find((c) => c.instanceId === cid);
    assert.ok(inst);
    assert.equal(getCardCharacter(CARD_LIBRARY[inst.cardId]), 'colorless');
    assert.equal(getCardStats(inst).cost, 0);
  }
  openEvent(hallRun, 'winding_halls');
  assert.equal(chooseEventOption(hallRun, 'retrace_steps').ok, true);
  assert.equal(hallRun.player.hp, 78, '58 + floor(80 * 0.25) = 78');
  assert.ok(hallRun.player.deck.some((c) => c.cardId === 'doubt'));

  // A8 tuning check for new events
  const a8Tune = getEventTuning(8);
  assert.equal(a8Tune.oozeBaseHpLoss, 7);
  assert.equal(a8Tune.oozeBaseChancePct, 35);
  assert.equal(a8Tune.ghostsMaxHpLossPct, 42);
  const a8GhostsChoices = getEventChoicesForAscension('council_of_ghosts', 8);
  assert.ok(a8GhostsChoices[0].detail.includes('42%'));

  // 9. Independent per-character Ascension progression & career stats
  const meta = createDefaultMeta();
  assert.equal(getMaxAscensionForCharacter(meta, 'ironclad'), 0);
  assert.equal(getMaxAscensionForCharacter(meta, 'silent'), 0);

  const ironWin = createNewRun({ seed: 10201, characterId: 'ironclad', ascension: 0, skipNeow: true });
  ironWin.act = 3;
  ironWin.floor = 16;
  ironWin.runOutcome = 'victory';
  const ironRec = recordCompletedRun(meta, ironWin);
  assert.equal(ironRec.unlockedAscension, 1);
  assert.equal(getMaxAscensionForCharacter(meta, 'ironclad'), 1, 'Ironclad unlocks A1');
  assert.equal(getMaxAscensionForCharacter(meta, 'silent'), 0, 'Silent stays at A0 independently');
  assert.equal(getCharacterProgress(meta, 'ironclad').victories, 1);
  assert.equal(getCharacterProgress(meta, 'silent').victories, 0);

  const silentWin = createNewRun({ seed: 10202, characterId: 'silent', ascension: 0, skipNeow: true });
  silentWin.act = 3;
  silentWin.floor = 16;
  silentWin.runOutcome = 'victory';
  const silentRec = recordCompletedRun(meta, silentWin);
  assert.equal(silentRec.unlockedAscension, 1, 'Silent independently unlocks A1 on her own A0 victory');
  assert.equal(getMaxAscensionForCharacter(meta, 'silent'), 1);
  assert.equal(getCharacterProgress(meta, 'silent').victories, 1);
  assert.equal(getCharacterProgress(meta, 'silent').runsPlayed, 1);

  // 10. Legacy Meta save migration (without characterProgress) migrates cleanly via loadSavedMeta
  const legacyPayload = {
    xp: 420,
    unlockedTier: 2,
    maxAscensionUnlocked: 3,
    selectedAscension: 2,
    runsPlayed: 5,
    victories: 2,
    bestFloor: 16,
    runHistory: [
      { id: 'h1', characterId: 'ironclad', outcome: 'victory', ascension: 2, floor: 16, score: 880 },
      { id: 'h2', characterId: 'silent', outcome: 'victory', ascension: 0, floor: 16, score: 740 },
      { id: 'h3', characterId: 'silent', outcome: 'defeat', ascension: 1, floor: 10, score: 310 },
    ],
  };
  const mockStorage = {
    getItem(key) {
      return key === META_STORAGE_KEY ? JSON.stringify(legacyPayload) : null;
    },
  };
  const migrated = loadSavedMeta(mockStorage);
  assert.equal(getMaxAscensionForCharacter(migrated, 'ironclad'), 3, 'Ironclad inherits legacy maxAscensionUnlocked=3');
  assert.equal(getMaxAscensionForCharacter(migrated, 'silent'), 1, 'Silent inferred A1 from A0 victory in legacy history');
  assert.equal(getCharacterProgress(migrated, 'silent').runsPlayed, 2);
  assert.equal(getCharacterProgress(migrated, 'silent').victories, 1);
  assert.equal(getCharacterProgress(migrated, 'silent').bestScore, 740);
  assert.equal(getCharacterProgress(migrated, 'ironclad').bestScore, 880);
});

test('Stage 1.1 & Stage 2: The Watcher run setup (72/68 HP, 10 cards, Pure/Holy Water), 3-hero pool isolation, Boss Swap, ?char=watcher URL, and Stage 1.1 event/boss fixes', () => {
  // 1. Watcher run setup at A0 and A4
  const wA0 = createNewRun({ seed: 12001, characterId: 'watcher', ascension: 0, unlockAllOverride: true });
  assert.equal(wA0.characterId, 'watcher');
  assert.equal(wA0.player.name, '观者');
  assert.equal(wA0.player.maxHp, 72);
  assert.equal(wA0.player.hp, 72);
  assert.equal(wA0.player.stance, 'neutral');
  assert.equal(wA0.player.deck.length, 10);
  assert.deepEqual(wA0.player.relics, ['pure_water']);
  assert.equal(wA0.player.potions[0], 'miracle_potion');
  assert.equal(wA0.player.deck.filter((c) => c.cardId === 'strike').length, 4);
  assert.equal(wA0.player.deck.filter((c) => c.cardId === 'defend').length, 4);
  assert.equal(wA0.player.deck.filter((c) => c.cardId === 'eruption').length, 1);
  assert.equal(wA0.player.deck.filter((c) => c.cardId === 'vigilance').length, 1);

  const wA4 = createNewRun({ seed: 12002, characterId: 'watcher', ascension: 4, unlockAllOverride: true });
  assert.equal(wA4.player.maxHp, 68);

  // 2. Strict 3-character relic & card pool isolation
  const ironRelics = getRelicPoolsForCharacter('ironclad');
  const silentRelics = getRelicPoolsForCharacter('silent');
  const watcherRelics = getRelicPoolsForCharacter('watcher');
  const allIronIds = Object.values(ironRelics).flat();
  const allSilentIds = Object.values(silentRelics).flat();
  const allWatcherIds = Object.values(watcherRelics).flat();
  assert.equal(allIronIds.includes('violet_lotus'), false);
  assert.equal(allIronIds.includes('golden_eye'), false);
  assert.equal(allSilentIds.includes('violet_lotus'), false);
  assert.equal(allSilentIds.includes('damaru'), false);
  assert.equal(allWatcherIds.includes('snecko_skull'), false);
  assert.equal(allWatcherIds.includes('charons_ashes'), false);
  assert.ok(allWatcherIds.includes('violet_lotus') && allWatcherIds.includes('holy_water'));
  assert.ok(allWatcherIds.includes('damaru') && allWatcherIds.includes('golden_eye'));

  // Rewards for Watcher only contain Watcher cards (never Ironclad/Silent)
  for (let s = 1; s <= 15; s += 1) {
    const rw = createNewRun({ seed: 12100 + s, characterId: 'watcher', skipNeow: true, unlockAllOverride: true });
    rw.combat = { role: 'normal' };
    transitionCombatVictory(rw);
    for (const card of rw.reward.cardChoices) {
      const ch = getCardCharacter(card);
      assert.equal(ch, 'watcher', `Watcher combat reward leaked non-watcher card: ${card.cardId} (${ch})`);
    }
  }

  // 3. Watcher Neow Boss Swap removes pure_water and never rolls holy_water / black_blood / ring_of_the_serpent
  for (let s = 1; s <= 35; s += 1) {
    const sw = createNewRun({ seed: 12200 + s, characterId: 'watcher', unlockAllOverride: true });
    const res = chooseNeowOption(sw, 'boss_swap');
    assert.equal(res.ok, true);
    assert.equal(sw.player.relics.includes('pure_water'), false);
    assert.equal(sw.player.relics.includes('holy_water'), false);
    assert.equal(sw.player.relics.includes('black_blood'), false);
    assert.equal(sw.player.relics.includes('ring_of_the_serpent'), false);
    sw.combat = { role: 'boss' };
    transitionCombatVictory(sw);
    assert.equal(sw.bossReward.relicChoices.includes('holy_water'), false);
  }

  // 4. Holy Water replaces Pure Water cleanly when granted
  const hwRun = createNewRun({ seed: 12301, characterId: 'watcher', skipNeow: true });
  assert.equal(grantRelicToPlayer(hwRun, 'holy_water'), true);
  assert.deepEqual(hwRun.player.relics, ['holy_water']);

  // 5. ?char=watcher Challenge URL round-trip & independent Watcher Meta Ascension progression
  const url = buildChallengeUrl('https://example.com/card-game/', 4242, 3, 10, 'watcher');
  assert.ok(url.includes('char=watcher'));
  const parsed = parseChallengeInput(url, 10);
  assert.equal(parsed.characterId, 'watcher');
  assert.equal(parsed.ascension, 3);

  const meta = createDefaultMeta();
  assert.equal(getMaxAscensionForCharacter(meta, 'watcher'), 0);
  const wWin = createNewRun({ seed: 12401, characterId: 'watcher', ascension: 0, skipNeow: true });
  wWin.act = 3;
  wWin.floor = 16;
  wWin.runOutcome = 'victory';
  const rec = recordCompletedRun(meta, wWin);
  assert.equal(rec.unlockedAscension, 1);
  assert.equal(getMaxAscensionForCharacter(meta, 'watcher'), 1);
  assert.equal(getMaxAscensionForCharacter(meta, 'ironclad'), 0);
  assert.equal(getCharacterProgress(meta, 'watcher').victories, 1);

  // 6. Stage 1.1 fixes: masked_bandits strictly Act 2 only; Act 2 Boss names have no '终幕首领：'; Mind Bloom war_memory has no double '首领：'
  assert.equal(getEventIdsForAct(1).includes('masked_bandits'), false, 'masked_bandits must not spawn in Act 1');
  assert.equal(getEventIdsForAct(2).includes('masked_bandits'), true, 'masked_bandits must spawn in Act 2');
  assert.equal(getEventIdsForAct(3).includes('masked_bandits'), false, 'masked_bandits must not spawn in Act 3');
  for (const b of ENCOUNTERS.act2Boss) {
    assert.equal(b.name.includes('终幕首领'), false, `Act 2 boss ${b.id} must not carry 终幕首领 prefix`);
    assert.ok(b.name.startsWith('首领：'), `Act 2 boss ${b.id} should use 首领： prefix`);
  }
  const mbRun = createNewRun({ seed: 12501, characterId: 'watcher', skipNeow: true });
  mbRun.act = 3;
  mbRun.floor = 5;
  mbRun.screen = 'event';
  mbRun.eventState = {
    eventId: 'mind_bloom',
    resolved: false,
    pendingPurge: false,
    pendingCardAction: null,
    libraryChoices: null,
    outcomeText: '',
    upgradedCardIds: [],
    addedCardIds: [],
  };
  assert.equal(chooseEventOption(mbRun, 'war_memory').ok, true);
  assert.equal(mbRun.screen, 'combat');
  assert.equal(mbRun.combat.encounterName.includes('首领：首领：'), false, 'Mind Bloom must not double-prefix 首领：');
});

test('Art Integrity: all 3 heroes & 61 enemies have unique hero-tier gradients & all 233 cards resolve valid, richly de-duplicated vector art', () => {
  const fallbackSvg = getCharacterSvg('__nonexistent_enemy_key__');
  const seenUnitGradIds = new Set();

  // Verify 3 playable hero portraits
  for (const heroId of ['ironclad', 'silent', 'watcher']) {
    const svg = getCharacterSvg(heroId);
    assert.notEqual(svg, fallbackSvg, `Hero ${heroId} must not fall back to generic SVG`);
    assert.ok(svg.includes('class="unit-svg hero-svg"'), `Hero ${heroId} must use hero-tier SVG class`);
    assert.ok(svg.includes('radialGradient') && svg.includes('linearGradient'), `Hero ${heroId} must use multi-layer shading & aura`);
    for (const m of svg.matchAll(/id="([^"]+)"/g)) {
      assert.equal(seenUnitGradIds.has(m[1]), false, `Duplicate hero SVG gradient id: ${m[1]} (${heroId})`);
      seenUnitGradIds.add(m[1]);
    }
    const tabSvg = getCharacterSvg(heroId, 'normal', 'tab');
    for (const m of tabSvg.matchAll(/id="([^"]+)"/g)) {
      assert.ok(m[1].endsWith('-tab'), `Scoped hero SVG gradient id must end with -tab: ${m[1]}`);
      assert.equal(seenUnitGradIds.has(m[1]), false, `Scoped hero SVG id must not collide with base id: ${m[1]}`);
    }
    for (const m of tabSvg.matchAll(/url\(#([^)]+)\)/g)) {
      assert.ok(m[1].endsWith('-tab'), `Scoped hero SVG url() reference must end with -tab: ${m[1]}`);
    }
  }

  const enemyEntries = Object.entries(ENEMY_TEMPLATES);
  assert.equal(enemyEntries.length, 64);

  for (const [id, tpl] of enemyEntries) {
    const svg = getCharacterSvg(tpl.artKey || id);
    assert.notEqual(svg, fallbackSvg, `Enemy ${id} must not fall back to generic SVG`);
    assert.ok(svg.includes('<svg') && svg.includes('</svg>'), `Enemy ${id} SVG must be well-formed`);
    assert.ok(
      svg.includes('linearGradient') || svg.includes('radialGradient'),
      `Enemy ${id} SVG must use hero-tier gradient shading`
    );
    for (const m of svg.matchAll(/id="([^"]+)"/g)) {
      assert.equal(seenUnitGradIds.has(m[1]), false, `Duplicate unit SVG gradient id: ${m[1]} (${id})`);
      seenUnitGradIds.add(m[1]);
    }
  }
  const guardianDefSvg = getCharacterSvg('the_guardian', 'defensive');
  assert.ok(guardianDefSvg.includes('ea-gd-orb') && guardianDefSvg.includes('radialGradient'));
  for (const m of guardianDefSvg.matchAll(/id="([^"]+)"/g)) {
    assert.equal(seenUnitGradIds.has(m[1]), false, `Duplicate Guardian defensive gradient id: ${m[1]}`);
    seenUnitGradIds.add(m[1]);
  }

  const cardEntries = Object.entries(CARD_LIBRARY);
  assert.equal(cardEntries.length, 234);
  const sigKeys = Object.keys(SIGNATURE_CARD_ART);
  assert.equal(sigKeys.length, 232, `Expected 100% bespoke signature art for all 232 non-shared cards, got ${sigKeys.length}`);
  const seenCardGradIds = new Set();
  for (const sigId of sigKeys) {
    assert.ok(CARD_LIBRARY[sigId], `Signature card art key ${sigId} must exist in CARD_LIBRARY`);
    for (const m of SIGNATURE_CARD_ART[sigId].matchAll(/id="([^"]+)"/g)) {
      assert.equal(seenCardGradIds.has(m[1]), false, `Duplicate card SVG gradient id: ${m[1]} (${sigId})`);
      seenCardGradIds.add(m[1]);
    }
  }
  const artBucketCounts = {};
  for (const [cid, cardDef] of cardEntries) {
    if (cid !== 'strike' && cid !== 'defend') {
      assert.ok(SIGNATURE_CARD_ART[cid], `Card ${cid} (${cardDef.rarity}/${cardDef.type}) must have bespoke signature art`);
    }
    const stats = getCardStats({ instanceId: `art_${cid}`, cardId: cid, upgraded: false });
    const key = getCardArtKey(cid, stats, cardDef.character);
    artBucketCounts[key] = (artBucketCounts[key] || 0) + 1;
    const svg = getCardArtSvg(cid, stats);
    assert.ok(svg.includes('class="card-art-svg"') && svg.includes('</svg>'), `Card ${cid} must render valid vector art`);
  }
  const maxSharedCount = Math.max(...Object.values(artBucketCounts));
  assert.equal(maxSharedCount, 1, `Every card must map to a unique bespoke illustration (got maxShared=${maxSharedCount})`);

  // Shared Strike/Defend tint dynamically by active hero
  const strikeStats = getCardStats({ instanceId: 's', cardId: 'strike', upgraded: false });
  const defendStats = getCardStats({ instanceId: 'd', cardId: 'defend', upgraded: false });
  assert.equal(getCardArtKey('strike', strikeStats, 'ironclad'), 'iron_slash');
  assert.equal(getCardArtKey('strike', strikeStats, 'silent'), 'silent_shiv');
  assert.equal(getCardArtKey('strike', strikeStats, 'watcher'), 'watcher_martial');
  assert.equal(getCardArtKey('defend', defendStats, 'ironclad'), 'iron_shield');
  assert.equal(getCardArtKey('defend', defendStats, 'silent'), 'silent_cloak');
  assert.equal(getCardArtKey('defend', defendStats, 'watcher'), 'watcher_calm');

  const hpVitalSvg = getVitalIconSvg('hp');
  const goldVitalSvg = getVitalIconSvg('gold');
  assert.ok(hpVitalSvg.includes('data-vital-icon="hp"') && hpVitalSvg.includes('radialGradient'));
  assert.ok(goldVitalSvg.includes('data-vital-icon="gold"') && goldVitalSvg.includes('radialGradient'));
});

test('P0: Compendium auto-discovery, legacy runHistory backfill, and PWA manifest/sw/icons & standalone stripping', () => {
  // 1. Default compendium & syncCompendiumFromRunState
  const meta = createDefaultMeta();
  assert.deepEqual(meta.compendium, createDefaultCompendium());
  const run = createNewRun({ seed: 22001, characterId: 'watcher', skipNeow: true });
  run.player.potions[0] = 'stance_potion';
  startCombat(run, ENCOUNTERS.floor1[0], 'normal');

  assert.equal(syncCompendiumFromRunState(meta, run), true);
  assert.equal(syncCompendiumFromRunState(meta, run), false, 'Second sync with unchanged state is a no-op');
  assert.ok(meta.compendium.cards.includes('eruption'));
  assert.ok(meta.compendium.relics.includes('pure_water'));
  assert.ok(meta.compendium.potions.includes('stance_potion'));
  assert.ok(meta.compendium.enemies.includes(run.combat.enemies[0].templateId));

  // 2. Legacy meta without compendium backfills from runHistory on loadSavedMeta
  const mockStore = new Map();
  const mockStorage = {
    getItem: (k) => (mockStore.has(k) ? mockStore.get(k) : null),
    setItem: (k, v) => mockStore.set(k, String(v)),
  };
  mockStorage.setItem(
    META_STORAGE_KEY,
    JSON.stringify({
      version: 1,
      runHistory: [
        {
          relicIds: ['burning_blood', 'nunchaku'],
          deckSnapshot: [{ cardId: 'bash' }, { cardId: 'double_tap' }],
        },
      ],
    })
  );
  const loaded = loadSavedMeta(mockStorage);
  assert.ok(loaded.compendium.relics.includes('nunchaku'), 'Backfills relics from runHistory');
  assert.ok(loaded.compendium.cards.includes('double_tap'), 'Backfills cards from runHistory');

  // 3. PWA assets exist & valid; standalone bundle strips external manifest/icon links cleanly
  const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const manifestRaw = fs.readFileSync(path.join(repoRoot, 'manifest.webmanifest'), 'utf8');
  const manifest = JSON.parse(manifestRaw);
  assert.equal(manifest.display, 'standalone');
  assert.ok(Array.isArray(manifest.icons) && manifest.icons.length >= 2);
  assert.ok(fs.existsSync(path.join(repoRoot, 'sw.js')));
  assert.ok(fs.existsSync(path.join(repoRoot, 'icons/icon-192.png')));
  assert.ok(fs.existsSync(path.join(repoRoot, 'icons/icon-512.png')));

  const { html } = buildStandaloneHtml(repoRoot);
  assert.equal(html.includes('manifest.webmanifest'), false, 'Standalone HTML strips external manifest link');
  assert.equal(html.includes('apple-touch-icon'), false, 'Standalone HTML strips external apple-touch-icon');
});

test('P1 Out-of-Combat Relics & All 16 New Events (Normal & A8 scaling): full lifecycle verification', () => {
  // 1. Ceramic Fish (+9g/card), Darkstone Periapt (+6 max HP/curse), Smiling Mask (fixed 50g purge), Whetstone/War Paint pickup upgrades, Meal Ticket (+15 HP on shop), Singing Bowl (+2 max HP on card skip), Black Star (+75g & extra Elite relic), White Beast Statue (100% potion)
  const st = createNewRun({ seed: 23001, characterId: 'ironclad', skipNeow: true, unlockAllOverride: true });
  st.player.hp = 50;
  st.player.maxHp = 80;
  st.player.gold = 100;
  grantRelicToPlayer(st, 'ceramic_fish');
  grantRelicToPlayer(st, 'darkstone_periapt');
  grantRelicToPlayer(st, 'smiling_mask');
  grantRelicToPlayer(st, 'meal_ticket');
  grantRelicToPlayer(st, 'singing_bowl');
  grantRelicToPlayer(st, 'white_beast_statue');

  addCardToMasterDeck(st, createCardInstance(st, 'doubt', false));
  assert.equal(st.player.gold, 109, 'Ceramic Fish grants +9 gold on card added');
  assert.equal(st.player.maxHp, 86, 'Darkstone Periapt grants +6 Max HP on curse added');
  assert.equal(getCurrentPurgeCost(st), 50, 'Smiling Mask locks shop purge cost to 50g');
  st.purgeCount = 4;
  assert.equal(getCurrentPurgeCost(st), 50, 'Smiling Mask keeps purge cost at 50g even after multiple purges');

  const upgradedBefore = st.player.deck.filter((c) => c.upgraded).length;
  grantRelicToPlayer(st, 'whetstone');
  grantRelicToPlayer(st, 'war_paint');
  assert.equal(st.player.deck.filter((c) => c.upgraded).length, upgradedBefore + 4, 'Whetstone + War Paint upgrade 2 Attacks + 2 Skills');

  const goldBeforeStar = st.player.gold;
  grantRelicToPlayer(st, 'black_star');
  assert.equal(st.player.gold, goldBeforeStar + 75, 'Black Star grants +75 gold on pickup');

  // Shop entry triggers Meal Ticket (+15 HP)
  const shopNode = st.map.flat().find((n) => n.type === 'shop');
  const prevNode = st.map[shopNode.row - 1][0];
  st.currentNodeId = prevNode.id;
  prevNode.nextIds = [shopNode.id];
  const hpBeforeShop = st.player.hp;
  selectMapNode(st, shopNode.id);
  assert.equal(st.screen, 'shop');
  assert.equal(st.player.hp, Math.min(st.player.maxHp, hpBeforeShop + 15), 'Meal Ticket heals 15 HP on shop entry');
  assert.equal(st.shop.mealTicketHealed, 15);
  leaveShop(st);

  // Elite victory triggers Black Star extraRelicId & White Beast Statue guaranteed potionId, and skipping card triggers Singing Bowl (+2 Max HP)
  startCombat(st, ENCOUNTERS.elite[0], 'elite');
  transitionCombatVictory(st);
  assert.equal(st.screen, 'reward');
  assert.ok(st.reward.relicId && st.reward.extraRelicId, 'Black Star drops 2 relics on Elite victory');
  assert.notEqual(st.reward.relicId, st.reward.extraRelicId);
  assert.ok(st.reward.potionId, 'White Beast Statue guarantees potion drop');
  assert.equal(getUnclaimedImportantRewards(st).items.length, 3, 'Gold + Relic + Extra Relic flagged before claiming');
  claimRewardGold(st);
  claimRewardRelic(st);
  assert.equal(claimRewardExtraRelic(st).ok, true);
  const maxHpBeforeSkip = st.player.maxHp;
  assert.equal(proceedFromReward(st).ok, true);
  assert.equal(st.player.maxHp, maxHpBeforeSkip + 2, 'Singing Bowl grants +2 Max HP when skipping card reward');

  // 2. Exercise all 16 new P1 events (Act 1/2/3 + A8 tuning check)
  const openEv = (runState, evId) => {
    runState.screen = 'event';
    runState.eventState = { eventId: evId, resolved: false, outcomeText: '', pendingPurge: false, purgeHpCost: 0, purgeGoldCost: 0, pendingCardAction: null, cardActionHpCost: 0, libraryChoices: null };
  };
  const evRun = createNewRun({ seed: 23002, characterId: 'ironclad', ascension: 8, skipNeow: true, unlockAllOverride: true });
  evRun.player.maxHp = 80;
  evRun.player.hp = 60;
  evRun.player.gold = 300;
  evRun.player.relics.push('blood_vial', 'red_mask', 'golden_idol_relic');

  // Verify A8 tuning & choice labels for new events
  const t0 = getEventTuning(0);
  const t8 = getEventTuning(8);
  assert.equal(t0.forgeAltarGold, 85);
  assert.equal(t8.forgeAltarGold, 100);
  assert.ok(getEventChoicesForAscension('spire_forge_altar', 8)[0].detail.includes('100'));

  const newEventCases = [
    ['big_fish', 'eat_donut'],
    ['cleric', 'cleric_purify'],
    ['dead_adventurer', 'salvage_weapon'],
    ['sssserpent', 'accept_serpent_gold'],
    ['world_of_goop', 'gather_goop_gold'],
    ['the_joust', 'bet_murderer'],
    ['the_mausoleum', 'open_coffin'],
    ['vampires_den', 'trade_blood_vial'],
    ['beggar_shrine', 'give_beggar_gold'],
    ['colosseum_trial', 'accept_trial'],
    ['tomb_of_red_mask', 'wear_red_mask'],
    ['falling_abyss', 'brace_fall_impact'],
    ['mysterious_sphere', 'smash_sphere'],
    ['moai_head', 'offer_golden_idol'],
    ['secret_portal', 'study_portal'],
    ['spire_forge_altar', 'altar_buy_colorless'],
  ];

  for (const [evId, chId] of newEventCases) {
    evRun.player.hp = Math.min(evRun.player.maxHp, Math.max(evRun.player.hp, 55));
    evRun.player.gold = Math.max(evRun.player.gold, 200);
    openEv(evRun, evId);
    const res = chooseEventOption(evRun, chId);
    assert.equal(res.ok, true, `Event ${evId} -> ${chId} failed: ${res.reason}`);
    if (evRun.eventState?.pendingPurge) {
      assert.equal(completeEventPurge(evRun, evRun.player.deck[0].instanceId).ok, true);
    } else if (evRun.eventState?.pendingCardAction) {
      assert.equal(completeEventCardAction(evRun, evRun.player.deck[0].instanceId).ok, true);
    } else if (Array.isArray(evRun.eventState?.libraryChoices)) {
      assert.equal(pickEventLibraryCard(evRun, evRun.eventState.libraryChoices[0].instanceId).ok, true);
    }
    assert.equal(evRun.eventState.resolved, true, `Event ${evId} did not resolve`);
    assert.equal(continueFromEvent(evRun).ok, true);
  }
});

test('v2 Mechanics: Last-2 encounter dedup, Campfire Relics (Girya/Shovel/Peace Pipe + max-2 cap), Parasite -3 Max HP, Save Backup Export/Import validation, and Battle Report combatRestarts', () => {
  // 1. Last-2 encounter deduplication (normal & elite) across Act 2/3 expanded encounter pools
  const dedupRun = createNewRun({ seed: 42001, characterId: 'ironclad', skipNeow: true, unlockAllOverride: true });
  dedupRun.act = 2;
  dedupRun.recentEncounterIds = [];
  const seenNormalSeq = [];
  for (let i = 0; i < 8; i += 1) {
    const node = { id: `n_${i}`, floor: i + 1, col: 0, type: 'combat', nextIds: [] };
    dedupRun.map[i] = [node];
    dedupRun.floor = i;
    dedupRun.currentNodeId = i === 0 ? null : `n_${i - 1}`;
    if (i > 0) dedupRun.map[i - 1][0].nextIds = [`n_${i}`];
    dedupRun.screen = 'map';
    const sel = selectMapNode(dedupRun, node.id);
    assert.equal(sel.ok, true);
    const encId = dedupRun.combat.encounterId;
    if (seenNormalSeq.length >= 1) {
      assert.notEqual(encId, seenNormalSeq[seenNormalSeq.length - 1], 'Must not repeat immediately previous encounter');
    }
    if (seenNormalSeq.length >= 2) {
      assert.notEqual(encId, seenNormalSeq[seenNormalSeq.length - 2], 'Must not repeat encounter from 2 combats ago');
    }
    seenNormalSeq.push(encId);
    assert.ok(dedupRun.recentEncounterIds.length <= 4);
  }
  assert.ok(ENCOUNTERS.act2Early.length >= 6 && ENCOUNTERS.act2Hard.length >= 8);
  assert.ok(ENCOUNTERS.act3Early.length >= 5 && ENCOUNTERS.act3Hard.length >= 6);

  // 2. Campfire Relics: Girya (Lift max 3 -> +3 starting Strength), Shovel (Dig relic), Peace Pipe (Toke + Parasite -3 Max HP)
  const campRun = createNewRun({ seed: 42002, characterId: 'ironclad', skipNeow: true, unlockAllOverride: true });
  campRun.player.relics.push('girya', 'shovel', 'peace_pipe');

  // Lift 3 times across 3 rest sites -> 4th lift rejected
  for (let i = 1; i <= 3; i += 1) {
    campRun.screen = 'rest';
    campRun.restState = { completed: false };
    const liftRes = liftAtCampfire(campRun);
    assert.equal(liftRes.ok, true);
    assert.equal(liftRes.lifts, i);
    assert.equal(campRun.screen, 'map');
  }
  campRun.screen = 'rest';
  campRun.restState = { completed: false };
  assert.equal(liftAtCampfire(campRun).ok, false, 'Girya Lift capped at 3 times per run');

  // Verify Girya grants +3 Strength at combat start
  startCombat(campRun, ENCOUNTERS.floor1[0], 'normal');
  assert.equal(campRun.player.statuses.strength, 3, 'Girya 3/3 grants +3 starting Strength in combat');

  // Dig with Shovel -> opens clickable reward screen (identical to post-combat relic pickup)
  campRun.screen = 'rest';
  campRun.restState = { completed: false };
  const relicsBeforeDig = campRun.player.relics.length;
  const digRes = digAtCampfire(campRun);
  assert.equal(digRes.ok, true);
  assert.ok(RELIC_LIBRARY[digRes.relicId], 'Shovel dug a valid relic');
  assert.equal(campRun.screen, 'reward', 'Shovel dig opens clickable reward screen');
  assert.equal(campRun.reward?.source, 'campfire_dig');
  assert.equal(campRun.reward?.relicId, digRes.relicId);
  assert.equal(campRun.reward?.relicClaimed, false);
  assert.equal(campRun.player.relics.length, relicsBeforeDig, 'Relic is not granted until clicked');
  assert.equal(proceedFromReward(campRun).requiresConfirm, true, 'Proceeding without claiming dug relic prompts confirmation');
  const claimDigRes = claimRewardRelic(campRun);
  assert.equal(claimDigRes.ok, true);
  assert.equal(campRun.player.relics.length, relicsBeforeDig + 1);
  assert.equal(campRun.player.relics.includes(digRes.relicId), true);
  const leaveDigRes = proceedFromReward(campRun);
  assert.equal(leaveDigRes.ok, true);
  assert.equal(leaveDigRes.singingBowlGain, 0);
  assert.equal(campRun.screen, 'map');

  // Toke with Peace Pipe -> removes Parasite curse and deducts 3 Max HP
  const parasiteCard = addCardToMasterDeck(campRun, createCardInstance(campRun, 'parasite'));
  const maxHpBeforeToke = campRun.player.maxHp;
  campRun.screen = 'rest';
  campRun.restState = { completed: false };
  const tokeRes = tokeAtCampfire(campRun, parasiteCard.instanceId);
  assert.equal(tokeRes.ok, true);
  assert.equal(tokeRes.lostMaxHp, 3, 'Removing Parasite via Peace Pipe loses 3 Max HP');
  assert.equal(campRun.player.maxHp, maxHpBeforeToke - 3);
  assert.equal(campRun.player.deck.some((c) => c.instanceId === parasiteCard.instanceId), false);

  // Max-2 campfire relics per run cap when rolling unowned relics
  const capRun = createNewRun({ seed: 42003, characterId: 'ironclad', skipNeow: true, unlockAllOverride: true });
  capRun.player.relics.push('girya', 'shovel');
  // Open 100 treasure chests and confirm peace_pipe is never rolled once 2 campfire relics are already held
  for (let i = 0; i < 40; i += 1) {
    capRun.screen = 'treasure';
    capRun.treasureState = { opened: false, chestTier: 'large', chestLabel: '远古大宝箱', relicId: null, gold: 0, curseCardId: null, outcomeText: '' };
    openTreasureChest(capRun);
    if (capRun.player.relics.length > 60) break;
  }
  const heldCampfireCount = CAMPFIRE_RELIC_IDS.filter((id) => capRun.player.relics.includes(id)).length;
  assert.equal(heldCampfireCount, 2, 'At most 2 of Girya/Shovel/Peace Pipe can be obtained in one run');

  // 3. Battle report & Run History include combatRestarts annotation
  const rrState = createNewRun({ seed: 42004, characterId: 'watcher', skipNeow: true });
  startCombat(rrState, ENCOUNTERS.floor1[0], 'normal');
  assert.equal(runRestartCombat(rrState).ok, true);
  assert.equal(runRestartCombat(rrState).ok, true);
  assert.equal(rrState.stats.combatRestarts, 2);
  rrState.screen = 'game_over';
  rrState.outcome = 'victory';
  const meta = createDefaultMeta();
  const recResult = recordCompletedRun(meta, rrState);
  assert.equal(recResult.historyEntry.combatRestarts, 2);
  const shareText = formatShareableBattleReport(recResult.historyEntry);
  assert.ok(shareText.includes('「重启本场战斗」2 次'), `Battle report must annotate combatRestarts, got: ${shareText}`);

  // Clean run without restarts omits restart remark cleanly
  const cleanReport = buildRunReportFromState(createNewRun({ seed: 42005, characterId: 'ironclad', skipNeow: true }));
  assert.equal(cleanReport.combatRestarts, 0);
  assert.equal(formatShareableBattleReport(cleanReport).includes('重启本场战斗'), false);

  // 4. Save Backup Export & Import Validation
  const jsonStr = exportSaveBackup({
    meta,
    settings: { soundEnabled: false, volume: 35, animSpeed: 'fast', showDamageNumbers: true, mobileTapConfirm: true, tutorialDismissed: true },
    activeRun: campRun,
  });
  const parsed = JSON.parse(jsonStr);
  assert.equal(parsed.app, SAVE_BACKUP_APP_ID);
  const validCheck = validateSaveBackup(jsonStr, TOTAL_FLOORS);
  assert.equal(validCheck.ok, true);
  assert.equal(validCheck.summary.hasActiveRun, true);
  assert.equal(validCheck.backup.meta.runHistory[0].combatRestarts, 2);
  assert.equal(validCheck.backup.settings.volume, 35);
  assert.equal(validCheck.backup.settings.animSpeed, 'fast');

  // Malformed / wrong app / corrupted activeRun rejected gracefully
  assert.equal(validateSaveBackup('not valid json').ok, false);
  assert.equal(validateSaveBackup(JSON.stringify({ app: 'other_game', meta })).ok, false);
  assert.equal(validateSaveBackup(JSON.stringify({ app: SAVE_BACKUP_APP_ID, schemaVersion: 1, meta: null })).ok, false);
  assert.equal(
    validateSaveBackup(JSON.stringify({ app: SAVE_BACKUP_APP_ID, schemaVersion: 1, meta, activeRun: { screen: 'combat', player: {} } })).ok,
    false
  );
});

test('Official Simplified Chinese card names (234 unique) & concise card keyword descriptions/extraction', () => {
  const allCards = Object.values(CARD_LIBRARY);
  assert.equal(allCards.length, 234);

  // Zero duplicate Chinese names across all 234 cards
  const seenNames = new Map();
  for (const c of allCards) {
    assert.equal(
      seenNames.has(c.name),
      false,
      `Duplicate card name "${c.name}" shared by ${seenNames.get(c.name)} and ${c.id}`
    );
    seenNames.set(c.name, c.id);
  }

  // Spot-check official Simplified Chinese names across Ironclad, Silent, Watcher, Colorless & Tokens
  const expectedNames = {
    cleave: '顺劈斩',
    thunderclap: '闪电霹雳',
    sword_boomerang: '飞剑回旋镖',
    immolate: '燔祭',
    reaper: '死亡收割',
    headbutt: '头槌',
    reckless_charge: '无谋冲锋',
    havoc: '破灭',
    blood_for_blood: '以血换血',
    sentinel: '哨位',
    survivor: '生存者',
    poisoned_stab: '带毒刺击',
    dagger_throw: '投掷匕首',
    dagger_spray: '匕首雨',
    slice: '切割',
    sucker_punch: '突然一拳',
    piercing_wail: '尖啸',
    bouncing_flask: '弹跳毒瓶',
    infinite_blades: '无限刀刃',
    skewer: '穿刺',
    tools_of_the_trade: '必备工具',
    alchemize: '炼制药水',
    outmaneuver: '抢占先机',
    heel_hook: '足跟勾',
    flechettes: '飞镖',
    choke: '勒脖',
    expertise: '独门技术',
    riddle_with_holes: '千穿百刺',
    well_laid_plans: '计划妥当',
    die_die_die: '死吧死吧死吧',
    eruption: '暴怒',
    smite: '惩恶',
    safety: '平安',
    insight: '洞见',
    omega: '欧米伽',
    through_violence: '以暴易暴',
    bowling_bash: '碰撞连击',
    consecrate: '供奉',
    cut_through_fate: '斩破命运',
    empty_fist: '化拳为空',
    empty_body: '化体为空',
    empty_mind: '化智为空',
    flying_sleeves: '流云飞袖',
    just_lucky: '幸运一击',
    sash_whip: '腰带抽打',
    halt: '停顿',
    prostrate: '五体投地',
    protect: '护身',
    third_eye: '天眼',
    tranquility: '安宁',
    carve_reality: '改造现实',
    conclude: '结末',
    fear_no_evil: '不惧妖邪',
    sands_of_time: '时之沙',
    talk_to_the_hand: '以手拒之',
    wallop: '当头棒喝',
    weave: '迂回',
    wheel_kick: '回环踢',
    deceive_reality: '欺瞒现实',
    inner_peace: '内心宁静',
    perseverance: '坚韧',
    simmering_fury: '怒火中烧',
    worship: '敬拜',
    like_water: '如水',
    rushdown: '猛虎下山',
    devotion: '虔信',
    establishment: '确立基础',
    lesson_learned: '勤学奋进',
    ragnarok: '诸神之黄昏',
    spirit_shield: '精神护盾',
    indignation: '义愤填膺',
    swivel: '旋身',
    windmill_strike: '旋转打击',
    reach_heaven: '立地升天',
    wave_of_the_hand: '摆手',
    master_reality: '操控现实',
    flash_of_steel: '亮剑',
    finesse: '妙计',
    dramatic_entrance: '闪亮登场',
    sadistic_nature: '残虐天性',
    apparition: '灵体',
    good_instincts: '优秀直觉',
    panacea: '万能药',
    panache: '神气制胜',
    thinking_ahead: '深谋远虑',
    the_bomb: '炸弹',
  };
  for (const [id, name] of Object.entries(expectedNames)) {
    assert.equal(CARD_LIBRARY[id]?.name, name, `Expected ${id} to be named "${name}", got "${CARD_LIBRARY[id]?.name}"`);
  }

  // Concise keyword descriptions (no inline parenthetical explanations for Ethereal/Scry/Mantra/Intangible/Artifact/Wound)
  const checkDesc = (cardId) => {
    const inst = { instanceId: `t_${cardId}`, cardId, upgraded: false };
    const stats = getCardStats(inst);
    const desc = formatCardDescription(inst, null);
    return { stats, text: desc.text, kws: extractCardKeywords(stats, desc.text) };
  };

  const ghost = checkDesc('ghostly_armor');
  assert.ok(ghost.text.startsWith('虚无。'));
  assert.equal(ghost.text.includes('虚无（'), false);
  assert.ok(ghost.kws.some((k) => k.key === '虚无' && k.desc.includes('自动消耗')));

  const app = checkDesc('apparition');
  assert.equal(app.text.includes('虚无（'), false);
  assert.equal(app.text.includes('无实体】（'), false);
  assert.deepEqual(
    app.kws.map((k) => k.key),
    ['虚无', '消耗', '无实体']
  );

  const eye = checkDesc('third_eye');
  assert.ok(eye.text.includes('预见 3。'));
  assert.equal(eye.text.includes('检视抽牌堆顶'), false);
  assert.ok(eye.kws.some((k) => k.key === '预见'));

  const pray = checkDesc('pray');
  assert.equal(pray.text.includes('满 10 点进入神格'), false);
  assert.ok(pray.kws.some((k) => k.key === '真言'));
  assert.ok(pray.kws.some((k) => k.key === '洞见'));

  const pan = checkDesc('panacea');
  assert.equal(pan.text.includes('免疫负面状态'), false);
  assert.ok(pan.kws.some((k) => k.key === '人工制品'));

  const wound = checkDesc('wound');
  assert.equal(wound.text, '不能被打出。');
  assert.ok(wound.kws.some((k) => k.key === '不能被打出'));

  const html = formatCardDescHtml(app.text);
  assert.ok(html.includes('<span class="card-kw-inline">虚无</span>'));
  assert.ok(html.includes('<span class="card-kw-inline">无实体</span>'));
});

test('Official Simplified Chinese relic names (103 unique) & War Paint / Whetstone upgrade tracking', () => {
  const allRelics = Object.values(RELIC_LIBRARY);
  assert.equal(allRelics.length, 103);
  const nameSet = new Set(allRelics.map((r) => r.name));
  assert.equal(nameSet.size, 103, 'All 103 relics must have unique Simplified Chinese names');

  const expectedOfficialRelicNames = {
    pure_water: '至纯之水',
    oddly_smooth_stone: '意外光滑的石头',
    lantern: '灯笼',
    blood_vial: '小血瓶',
    damaru: '手摇鼓',
    paper_phrog: '纸蛙',
    ornamental_fan: '精致折扇',
    mummified_hand: '干瘪之手',
    teardrop_locket: '泪滴吊坠盒',
    duality: '两仪',
    captains_wheel: '舵盘',
    tough_bandages: '结实绷带',
    the_specimen: '生物样本',
    golden_eye: '黄金眼',
    fossilized_helix: '螺类化石',
    calipers: '外卡钳',
    chemical_x: '化学物X',
    medical_kit: '医药箱',
    lees_waffle: '李家华夫饼',
    golden_idol_relic: '金神像',
    red_mask: '红面具',
    enchiridion: '英雄宝典',
    bloody_idol: '鲜血神像',
    black_blood: '黑暗之血',
    ring_of_the_serpent: '长蛇戒指',
    violet_lotus: '紫色莲花',
    wrist_blade: '袖剑',
    velvet_choker: '天鹅绒颈圈',
    coffee_dripper: '咖啡滤杯',
    ceramic_fish: '陶瓷小鱼',
    toy_ornithopter: '玩具扑翼飞机',
    preserved_insect: '昆虫标本',
    bronze_scales: '铜制鳞片',
    war_paint: '战纹涂料',
    whetstone: '磨刀石',
    self_forming_clay: '自成型黏土',
    letter_opener: '开信刀',
    paper_krane: '纸鹤',
    ninja_scroll: '忍术卷轴',
    gremlin_horn: '地精之角',
    melange: '美琅脂',
    dead_branch: '枯木树枝',
    clockwork_souvenir: '齿轮工艺品',
    hovering_kite: '悬浮风筝',
    slavers_collar: '奴隶贩子颈环',
    peace_pipe: '宁静烟斗',
  };
  for (const [id, expectedName] of Object.entries(expectedOfficialRelicNames)) {
    assert.equal(
      RELIC_LIBRARY[id]?.name,
      expectedName,
      `Expected relic ${id} to be named "${expectedName}", got "${RELIC_LIBRARY[id]?.name}"`
    );
  }

  // 1. Reward pickup of War Paint (战纹涂料) records exact 2 upgraded Skill cards & summary
  const st = createNewRun({ seed: 77881, characterId: 'ironclad', skipNeow: true });
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
  const wpRes = claimRewardRelic(st);
  assert.equal(wpRes.ok, true);
  assert.equal(wpRes.relicName, '战纹涂料');
  assert.equal(wpRes.upgradedCards.length, 2, 'War Paint upgrades 2 skill cards');
  for (const entry of wpRes.upgradedCards) {
    const deckCard = st.player.deck.find((c) => c.instanceId === entry.instanceId);
    assert.ok(deckCard && deckCard.upgraded === true);
    assert.equal(getCardStats(deckCard).type, 'skill');
    assert.ok(entry.name.endsWith('+'));
  }
  assert.ok(st.reward.relicUpgradeSummary.includes('战纹涂料'));
  assert.ok(st.reward.relicUpgradeSummary.includes(wpRes.upgradedCards[0].name));
  assert.equal(st.lastRelicPickup.relicId, 'war_paint');
  assert.equal(st.lastRelicPickup.upgradeType, 'skill');

  // 2. Shop purchase of Whetstone (磨刀石) records exact 2 upgraded Attack cards
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
  const whRes = buyShopRelic(st);
  assert.equal(whRes.ok, true);
  assert.equal(whRes.relicName, '磨刀石');
  assert.equal(whRes.upgradedCards.length, 2, 'Whetstone upgrades 2 attack cards');
  for (const entry of whRes.upgradedCards) {
    const deckCard = st.player.deck.find((c) => c.instanceId === entry.instanceId);
    assert.ok(deckCard && deckCard.upgraded === true);
    assert.equal(getCardStats(deckCard).type, 'attack');
    assert.ok(entry.name.endsWith('+'));
  }
  const whSummary = formatRelicUpgradeSummary(st.lastRelicPickup);
  assert.ok(whSummary.includes('磨刀石'));
  assert.ok(whSummary.includes(whRes.upgradedCards[0].name));

  // 3. When 0 eligible cards remain, formatRelicUpgradeSummary reports gracefully
  const maxedRun = createNewRun({ seed: 77882, characterId: 'ironclad', skipNeow: true });
  for (const c of maxedRun.player.deck) c.upgraded = true;
  assert.equal(grantRelicToPlayer(maxedRun, 'war_paint'), true);
  assert.equal(maxedRun.lastRelicPickup.upgradedCards.length, 0);
  assert.ok(formatRelicUpgradeSummary(maxedRun.lastRelicPickup).includes('暂无可升级的技能牌'));
});

test('Audio Engine: Web Audio dynamics compressor, stone-hall reverb send, and all 35 procedural sound cues execute cleanly', () => {
  assert.ok(AUDIO_CUES.length >= 35, `Expected >=35 audio cues, got ${AUDIO_CUES.length}`);
  const stats = {
    compressors: 0,
    delays: 0,
    oscillators: 0,
    noiseSources: 0,
    filters: 0,
    gains: 0,
  };
  const makeParam = (init = 0) => ({
    value: init,
    setValueAtTime() {},
    linearRampToValueAtTime() {},
    exponentialRampToValueAtTime() {},
  });
  const makeNode = () => ({
    connect() {
      return this;
    },
    start() {},
    stop() {},
  });

  class MockAudioContext {
    constructor() {
      this.currentTime = 0;
      this.sampleRate = 44100;
      this.state = 'running';
      this.destination = { __dest: true };
    }
    resume() {
      return Promise.resolve();
    }
    createGain() {
      stats.gains += 1;
      return { ...makeNode(), gain: makeParam(1) };
    }
    createDynamicsCompressor() {
      stats.compressors += 1;
      return {
        ...makeNode(),
        threshold: makeParam(-14),
        knee: makeParam(18),
        ratio: makeParam(6),
        attack: makeParam(0.003),
        release: makeParam(0.14),
      };
    }
    createDelay() {
      stats.delays += 1;
      return { ...makeNode(), delayTime: makeParam(0.03) };
    }
    createBiquadFilter() {
      stats.filters += 1;
      return { ...makeNode(), type: 'lowpass', frequency: makeParam(1200), Q: makeParam(1) };
    }
    createOscillator() {
      stats.oscillators += 1;
      return { ...makeNode(), type: 'sine', frequency: makeParam(440) };
    }
    createBuffer(channels, length) {
      return {
        getChannelData() {
          return new Float32Array(length);
        },
      };
    }
    createBufferSource() {
      stats.noiseSources += 1;
      return { ...makeNode(), buffer: null };
    }
  }

  const prevWindow = globalThis.window;
  try {
    globalThis.window = { AudioContext: MockAudioContext };
    const engine = createSoundEngine(() => ({ soundEnabled: true, volume: 75 }));
    for (const cue of AUDIO_CUES) {
      engine.play(cue, { hits: 3 });
    }
    assert.equal(stats.compressors, 1, 'Audio graph must initialize a master DynamicsCompressorNode');
    assert.equal(stats.delays, 2, 'Audio graph must initialize a two-tap stone-hall reverb delay pair');
    assert.ok(stats.oscillators >= 50, `Expected rich multi-voice synthesis across all cues, got ${stats.oscillators} oscillators`);
    assert.ok(stats.noiseSources >= 12, `Expected filtered noise synthesis cues, got ${stats.noiseSources} noise sources`);

    // Muted engine produces zero additional nodes
    const beforeOsc = stats.oscillators;
    const mutedEngine = createSoundEngine(() => ({ soundEnabled: false, volume: 75 }));
    mutedEngine.play('hit_heavy');
    mutedEngine.play('boss_intro');
    assert.equal(stats.oscillators, beforeOsc, 'Muted engine must not synthesize audio nodes');
  } finally {
    if (prevWindow === undefined) delete globalThis.window;
    else globalThis.window = prevWindow;
  }
});

test('Relic Art Integrity: all 103 relics have bespoke hand-crafted inline SVGs with unique gradient IDs & safe scoping', () => {
  const libIds = Object.keys(RELIC_LIBRARY);
  const artIds = Object.keys(RELIC_SVG_ART);
  assert.equal(libIds.length, 103, `Expected 103 relics in RELIC_LIBRARY, got ${libIds.length}`);
  assert.equal(artIds.length, libIds.length, 'RELIC_SVG_ART must match RELIC_LIBRARY count 1:1');

  const seenGradientIds = new Map();
  for (const id of libIds) {
    assert.ok(RELIC_SVG_ART[id], `Missing bespoke SVG illustration for relic "${id}"`);
    const svg = getRelicSvg(id);
    assert.ok(svg.startsWith('<svg') && svg.endsWith('</svg>'), `Relic "${id}" must return valid inline SVG`);
    assert.ok(svg.includes('viewBox="0 0 36 36"'), `Relic "${id}" must use standardized 36x36 medallion viewBox`);
    assert.ok(svg.includes(`data-relic-svg="${id}"`), `Relic "${id}" must expose data-relic-svg="${id}"`);

    const defsIds = [...svg.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
    assert.ok(defsIds.length >= 2, `Relic "${id}" must define radial/linear gradient IDs`);
    for (const gid of defsIds) {
      assert.equal(
        seenGradientIds.has(gid),
        false,
        `Duplicate SVG gradient ID "${gid}" shared by "${seenGradientIds.get(gid)}" and "${id}"`
      );
      seenGradientIds.set(gid, id);
    }

    const scoped = getRelicSvg(id, { scope: 'comp', className: 'relic-svg-lg' });
    assert.ok(scoped.includes('class="relic-svg relic-svg-lg"'), `Relic "${id}" must support custom className`);
    for (const gid of defsIds) {
      assert.ok(scoped.includes(`id="${gid}-comp"`), `Relic "${id}" must scope gradient id="${gid}"`);
      if (svg.includes(`url(#${gid})`)) {
        assert.ok(scoped.includes(`url(#${gid}-comp)`), `Relic "${id}" must rewrite url(#${gid}) reference`);
      }
    }
  }

  // Fallback & undiscovered silhouettes
  const fallback = getRelicSvg('non_existent_relic_id', { scope: 'fb' });
  assert.ok(fallback.includes('data-relic-svg="fallback"') && fallback.includes('-fb'));
  const undisc = getUndiscoveredRelicSvg('u-1');
  assert.ok(undisc.startsWith('<svg') && undisc.includes('data-relic-svg="undiscovered"'));

  // Service worker precache includes src/ui/relic_art.js
  const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const swText = fs.readFileSync(path.join(rootDir, 'sw.js'), 'utf8');
  assert.ok(swText.includes("'./src/ui/relic_art.js'"), 'sw.js PRECACHE_URLS must include ./src/ui/relic_art.js');
});

test('Status Art Integrity: all 102 combat buffs/debuffs have bespoke inline SVGs + negative Strength/Dexterity variants & safe scoping', () => {
  const metaKeys = Object.keys(STATUS_METADATA);
  const artKeys = Object.keys(STATUS_SVG_ART);
  assert.equal(metaKeys.length, 102, `Expected 102 statuses in STATUS_METADATA, got ${metaKeys.length}`);
  assert.equal(artKeys.length, metaKeys.length, 'STATUS_SVG_ART must match STATUS_METADATA count 1:1');

  const seenIds = new Map();
  for (const key of metaKeys) {
    assert.ok(STATUS_SVG_ART[key], `Missing bespoke SVG for status "${key}"`);
    const pol = STATUS_METADATA[key].polarity === 'debuff' ? 'debuff' : 'buff';
    const svg = getStatusSvg(key, { polarity: pol });
    assert.ok(svg.startsWith('<svg') && svg.endsWith('</svg>'), `Status "${key}" must return valid SVG`);
    assert.ok(svg.includes('viewBox="0 0 24 24"'), `Status "${key}" must use 24x24 viewBox`);
    assert.ok(svg.includes(`data-status-svg="${key}"`), `Status "${key}" must expose data-status-svg="${key}"`);
    assert.ok(svg.includes(`data-status-polarity="${pol}"`), `Status "${key}" must encode data-status-polarity="${pol}"`);
    if (pol === 'debuff') {
      assert.ok(svg.includes('<polygon points="4.8,0.9'), `Debuff "${key}" must render crimson beveled octagonal badge frame`);
    } else {
      assert.ok(svg.includes('<rect x="0.9" y="0.9"'), `Buff "${key}" must render emerald rounded-square badge frame`);
    }

    const defsIds = [...svg.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
    assert.ok(defsIds.length >= 1, `Status "${key}" must define background gradient ID`);
    for (const gid of defsIds) {
      assert.equal(seenIds.has(gid), false, `Duplicate gradient ID "${gid}" shared by "${seenIds.get(gid)}" and "${key}"`);
      seenIds.set(gid, key);
    }

    const scoped = getStatusSvg(key, { polarity: pol, scope: 'enemy_0', className: 'gloss-sm' });
    assert.ok(scoped.includes('class="status-svg gloss-sm"'), `Status "${key}" must support custom className`);
    for (const gid of defsIds) {
      assert.ok(scoped.includes(`id="${gid}-enemy_0"`), `Status "${key}" must scope gradient id="${gid}"`);
      assert.ok(scoped.includes(`url(#${gid}-enemy_0)`), `Status "${key}" must rewrite url(#${gid})`);
    }
  }

  // Negative Strength & Dexterity variants (crimson debuff beveled octagon)
  assert.ok(STATUS_NEGATIVE_SVG_ART.strength && STATUS_NEGATIVE_SVG_ART.dexterity);
  const negStr = getStatusSvg('strength', { polarity: 'debuff', scope: 'player' });
  const negDex = getStatusSvg('dexterity', { polarity: 'debuff', scope: 'player' });
  assert.ok(negStr.includes('data-status-svg="strength_down"') && negStr.includes('data-status-polarity="debuff"') && negStr.includes('-player'));
  assert.ok(negDex.includes('data-status-svg="dexterity_down"') && negDex.includes('data-status-polarity="debuff"') && negDex.includes('-player'));

  // Fallbacks & sw.js precache
  assert.ok(getStatusSvg('unknown_status', { polarity: 'buff' }).includes('data-status-svg="fallback_buff"'));
  assert.ok(getStatusSvg('unknown_status', { polarity: 'debuff' }).includes('data-status-svg="fallback_debuff"'));
  const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const swText = fs.readFileSync(path.join(rootDir, 'sw.js'), 'utf8');
  assert.ok(swText.includes("'./src/ui/status_art.js'"), 'sw.js PRECACHE_URLS must include ./src/ui/status_art.js');
});

test('Potion Art Integrity: all 28 potions have distinct hand-crafted bottle SVGs, unique gradient IDs, safe scoping & sw.js precache', () => {
  const libIds = Object.keys(POTION_LIBRARY);
  const artIds = Object.keys(POTION_SVG_ART);
  assert.equal(libIds.length, 28, `Expected 28 potions in POTION_LIBRARY, got ${libIds.length}`);
  assert.equal(artIds.length, libIds.length, 'POTION_SVG_ART must match POTION_LIBRARY count 1:1');

  const seenGradientIds = new Map();
  const distinctShapes = new Set();
  for (const id of libIds) {
    assert.ok(POTION_SVG_ART[id], `Missing bespoke SVG for potion "${id}"`);
    assert.ok(POTION_ACCENT_COLORS[id], `Missing accent color for potion "${id}"`);
    const svg = getPotionIconSvg(id, 24);
    assert.ok(svg.startsWith('<svg') && svg.endsWith('</svg>'), `Potion "${id}" must return valid inline SVG`);
    assert.ok(svg.includes(`data-potion-icon="${id}"`), `Potion "${id}" must expose data-potion-icon="${id}"`);

    const normalized = POTION_SVG_ART[id]
      .replace(/data-potion-icon="[^"]+"/, 'data-potion-icon="X"')
      .replace(/pt-[a-z_]+-[a-z0-9]+/g, 'G');
    distinctShapes.add(normalized);

    const defsIds = [...svg.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
    assert.ok(defsIds.length >= 1, `Potion "${id}" must define liquid gradient ID`);
    for (const gid of defsIds) {
      assert.equal(seenGradientIds.has(gid), false, `Duplicate gradient ID "${gid}" shared by "${seenGradientIds.get(gid)}" and "${id}"`);
      seenGradientIds.set(gid, id);
    }

    const scoped = getPotionIconSvg(id, 30, { scope: 'hud_1', lootIcon: true });
    assert.ok(scoped.includes('data-loot-icon="potion"'), `Potion "${id}" must support lootIcon attribute`);
    for (const gid of defsIds) {
      assert.ok(scoped.includes(`id="${gid}-hud_1"`) && scoped.includes(`url(#${gid}-hud_1)`));
    }
  }
  assert.equal(distinctShapes.size, libIds.length, 'Every single one of the 28 potions must have a unique, non-repeated SVG illustration');

  assert.ok(getPotionIconSvg(null).includes('data-potion-icon="empty"'));
  assert.ok(getUndiscoveredPotionSvg().includes('data-potion-icon="undiscovered"'));
  const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const swText = fs.readFileSync(path.join(rootDir, 'sw.js'), 'utf8');
  assert.ok(swText.includes("'./src/ui/potion_art.js'"), 'sw.js PRECACHE_URLS must include ./src/ui/potion_art.js');
});

test('Act 4 & Three Keys Full Lifecycle: Ruby Recall, Burning Elite Emerald Key, Treasure Sapphire Key choice, Act 3->4 Spire Door Gate, 4-floor linear map, Act 4 defeat Ascension unlock, Heart Victory score bonus & 4-floor backup validation', () => {
  const run = createNewRun({ seed: 77701, characterId: 'ironclad', ascension: 0, skipNeow: true });
  assert.deepEqual(run.keys, { ruby: false, emerald: false, sapphire: false });
  assert.equal(hasAllAct4Keys(run), false);

  // 1. Exactly 1 Burning Elite spawns on Act 1 map with valid burningBuff
  const act1Burning = run.map.flat().filter((n) => n.isBurningElite);
  assert.equal(act1Burning.length, 1, 'Act 1 map must mark exactly 1 Burning Elite');
  const bNode = act1Burning[0];
  assert.equal(bNode.type, 'elite');
  assert.ok(['maxHp', 'strength', 'metallicize', 'regenerating'].includes(bNode.burningBuff));

  // Entering Burning Elite applies buff & defeating it drops Emerald Key (guarded by getUnclaimedImportantRewards)
  const parentOfBurning = run.map[bNode.floor - 2].find((p) => p.nextIds.includes(bNode.id));
  run.currentNodeId = parentOfBurning.id;
  assert.equal(selectMapNode(run, bNode.id).ok, true);
  assert.equal(run.combat.isBurningElite, true);
  assert.equal(run.combat.burningBuff, bNode.burningBuff);
  assert.ok(run.combat.encounterName.includes('燃烧精英'));
  const enemy = run.combat.enemies[0];
  if (bNode.burningBuff === 'strength') assert.ok((enemy.statuses.strength ?? 0) >= 1);
  if (bNode.burningBuff === 'metallicize') assert.ok((enemy.statuses.metallicize ?? 0) >= 2);
  if (bNode.burningBuff === 'regenerating') assert.ok((enemy.statuses.regenerating ?? 0) >= 3);

  transitionCombatVictory(run);
  assert.equal(run.screen, 'reward');
  assert.equal(run.reward.emeraldKey, true);
  assert.equal(run.reward.emeraldKeyClaimed, false);
  const unclaimed = getUnclaimedImportantRewards(run);
  assert.equal(unclaimed.hasEmeraldKey, true);
  assert.ok(unclaimed.items.includes('【绿宝石钥匙】'));
  assert.equal(claimRewardEmeraldKey(run).ok, true);
  assert.equal(run.keys.emerald, true);
  assert.equal(proceedFromReward(run, { force: true }).ok, true);

  // 2. Ruby Key via Campfire Recall (works even with Coffee Dripper!)
  grantRelicToPlayer(run, 'coffee_dripper');
  run.screen = 'rest';
  run.restState = { completed: false, lastAction: null, featherHealed: 0 };
  assert.equal(restHeal(run).ok, false, 'Coffee Dripper disables rest heal');
  assert.equal(recallRubyKey(run).ok, true, 'Recall must still succeed with Coffee Dripper');
  assert.equal(run.keys.ruby, true);
  assert.equal(run.screen, 'map');
  run.screen = 'rest';
  run.restState = { completed: false, lastAction: null, featherHealed: 0 };
  assert.equal(recallRubyKey(run).ok, false, 'Cannot recall Ruby Key twice');

  // 3. Sapphire Key via Treasure reveal -> mutually exclusive Relic vs Sapphire Key
  run.screen = 'treasure';
  run.treasureState = { opened: false, chestTier: 'large', chestLabel: '远古大宝箱', relicId: null, gold: 0, curseCardId: null, outcomeText: '' };
  const revealRes = revealTreasureChest(run);
  assert.equal(revealRes.ok, true);
  assert.ok(revealRes.offeredRelicId);
  assert.equal(run.treasureState.sapphireKeyOffered, true);
  assert.equal(run.treasureState.choiceResolved, false);
  const relicsBefore = run.player.relics.length;
  assert.equal(claimTreasureSapphireKey(run).ok, true);
  assert.equal(run.keys.sapphire, true);
  assert.equal(run.player.relics.length, relicsBefore, 'Claiming Sapphire Key forfeits offered chest relic');
  assert.equal(claimTreasureRelic(run).ok, false, 'Cannot also claim chest relic after taking Sapphire Key');
  assert.equal(leaveTreasureRoom(run).ok, true);
  assert.equal(hasAllAct4Keys(run), true);

  // 4. Act 3 Boss with all 3 keys -> Act 4 Spire Door Gate -> Proceed to Act 4 4-floor linear map!
  run.act = 3;
  run.player.hp = 40;
  startCombat(run, ENCOUNTERS.act3Boss[0], 'boss', transitionCombatVictory);
  transitionCombatVictory(run);
  assert.equal(run.act3Cleared, true);
  assert.equal(run.screen, 'boss_reward');
  assert.equal(run.bossReward.isAct4Gate, true);

  const act4Res = proceedToNextAct(run);
  assert.equal(act4Res.ok, true);
  assert.equal(act4Res.act, 4);
  assert.equal(run.act, 4);
  assert.equal(run.map.length, 4);
  assert.deepEqual(
    run.map.map((row) => row[0].type),
    ['rest', 'shop', 'elite', 'boss']
  );
  assert.equal(run.bossEncounterId, 'corrupt_heart_boss');
  assert.ok(run.player.hp > 40, 'Entering Act 4 heals missing HP');

  // Backup export & validation accepts 4-floor Act 4 activeRun!
  const metaForBackup = createDefaultMeta();
  const backupJson = exportSaveBackup({ meta: metaForBackup, activeRun: run });
  const backupCheck = validateSaveBackup(backupJson, TOTAL_FLOORS);
  assert.equal(backupCheck.ok, true, `Expected valid Act 4 backup, got: ${backupCheck.reason}`);

  // Traverse Act 4 F1 Rest -> F2 Shop -> F3 Shield & Spear -> F4 Corrupt Heart
  assert.equal(selectMapNode(run, 'r0_c0').ok, true);
  assert.equal(run.screen, 'rest');
  run.screen = 'map';
  assert.equal(selectMapNode(run, 'r1_c0').ok, true);
  assert.equal(run.screen, 'shop');
  assert.equal(leaveShop(run).ok, true);
  assert.equal(selectMapNode(run, 'r2_c0').ok, true);
  assert.equal(run.screen, 'combat');
  assert.equal(run.combat.encounterId, 'spire_shield_and_spear');
  transitionCombatVictory(run);
  assert.equal(run.screen, 'reward');
  assert.equal(proceedFromReward(run, { force: true }).ok, true);

  // Act 4 defeat STILL unlocks next Ascension level because act3Cleared is true!
  const defeatAct4Copy = structuredClone(run);
  defeatAct4Copy.runId = 'act4_defeat_test';
  defeatAct4Copy.screen = 'game_over';
  defeatAct4Copy.runOutcome = 'defeat';
  const metaDefeat = createDefaultMeta();
  const defeatRec = recordCompletedRun(metaDefeat, defeatAct4Copy);
  assert.equal(defeatRec.unlockedAscension, 1, 'Dying in Act 4 after clearing Act 3 must still unlock Ascension 1');

  // Enter F4 Corrupt Heart and defeat it -> Heart Victory true ending + Heartbreaker +250 score bonus!
  assert.equal(selectMapNode(run, 'r3_c0').ok, true);
  assert.equal(run.combat.encounterId, 'corrupt_heart_boss');
  transitionCombatVictory(run);
  assert.equal(run.screen, 'game_over');
  assert.equal(run.runOutcome, 'victory');
  assert.equal(run.heartVictory, true);

  const scoreObj = calculateRunScore(run);
  assert.ok(
    scoreObj.breakdown.some((item) => item.label.includes('心脏斩杀') && item.points === 250),
    'Heart Victory must award +250 Heartbreaker score bonus'
  );
  const report = buildRunReportFromState(run);
  assert.equal(report.heartVictory, true);
  const shareText = formatShareableBattleReport(report);
  assert.ok(shareText.includes('心脏斩杀'), 'Shareable report must announce Heart Victory');
});
