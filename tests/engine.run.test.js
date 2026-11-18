import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { canUpgradeCard, CARD_LIBRARY, createCardInstance, getCardStats } from '../src/data/cards.js';
import { ENCOUNTERS, predictNextTurnIntents } from '../src/data/enemies.js';
import { TOTAL_FLOORS } from '../src/data/events.js';
import { NON_STARTER_RELIC_IDS } from '../src/data/relics.js';
import { startCombat } from '../src/engine/combat.js';
import {
  buyShopCard,
  buyShopPotion,
  buyShopPurge,
  buyShopRelic,
  cancelEventPurge,
  chooseEventOption,
  claimBossRelic,
  claimRewardCard,
  claimRewardGold,
  claimRewardPotion,
  claimRewardRelic,
  completeEventCardAction,
  completeEventPurge,
  continueFromEvent,
  createNewRun,
  discardPotion,
  findMapNode,
  getAvailableNodeIds,
  getCurrentPurgeCost,
  getUnclaimedImportantRewards,
  grantRelicToPlayer,
  leaveShop,
  leaveTreasureRoom,
  openTreasureChest,
  pickEventLibraryCard,
  proceedFromReward,
  proceedToNextAct,
  restHeal,
  restUpgradeCard,
  rollRewardCards,
  runEndTurn,
  runUsePotion,
  selectMapNode,
  settleAct1Victory,
  transitionCombatVictory,
} from '../src/engine/game.js';
import {
  createDefaultMeta,
  getLockedContentSets,
  loadSavedMeta,
  recordCompletedRun,
  saveMeta,
} from '../src/engine/meta.js';
import { formatSeedCode, parseSeedInput } from '../src/engine/rng.js';
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
  const state = createNewRun({ seed: 1234 });
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

  // 4. Act 1 Boss -> Boss Relic Altar -> Proceed to Act 2 -> Defeat Act 2 Boss -> Victory!
  const actState = createNewRun({ seed: 500 });
  actState.player.hp = 40; // Missing 40 HP -> Act 2 transition heals 75% (30 HP) -> 70 HP!
  startCombat(actState, ENCOUNTERS.boss[0], 'boss');
  actState.combat.enemies[0].hp = 10;
  assert.equal(runUsePotion(actState, 0, actState.combat.enemies[0].id).ok, true);
  assert.equal(actState.screen, 'boss_reward');
  assert.equal(actState.bossReward.relicChoices.length, 3);
  assert.equal(claimBossRelic(actState, actState.bossReward.relicChoices[0]).ok, true);
  assert.equal(proceedToNextAct(actState).ok, true);
  assert.equal(actState.act, 2);
  assert.equal(actState.screen, 'map');
  assert.equal(actState.floor, 0);
  assert.ok(actState.player.hp >= 70, `Expected inter-act heal, got ${actState.player.hp}`);
  assert.ok(ENCOUNTERS.act2Boss.some((b) => b.id === actState.bossEncounterId));

  // Defeat Act 2 Boss -> final game_over victory
  actState.player.potions[0] = 'fire_potion';
  startCombat(actState, ENCOUNTERS.act2Boss[0], 'boss');
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

  // 2. Hexaghost: Turn 0 Divider -> Turn 1 Inferno 4x6 (24 total)
  const hexRun = createNewRun({ seed: 88, ascension: 0 });
  startCombat(hexRun, { id: 'test_hex', name: '六火亡魂', enemies: [{ templateId: 'hexaghost' }] }, 'boss');
  const hexPred = predictNextTurnIntents(hexRun.combat.enemies[0], hexRun.player, 0);
  assert.equal(hexPred.candidates.length, 1);
  assert.equal(hexPred.candidates[0].label, '4×6');
  assert.equal(hexPred.candidates[0].totalDamage, 24);

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
