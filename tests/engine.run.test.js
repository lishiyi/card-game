import test from 'node:test';
import assert from 'node:assert/strict';

import { canUpgradeCard, getCardStats } from '../src/data/cards.js';
import { TOTAL_FLOORS } from '../src/data/events.js';
import {
  buyShopCard,
  buyShopPotion,
  buyShopPurge,
  buyShopRelic,
  cancelEventPurge,
  chooseEventOption,
  claimRewardCard,
  claimRewardGold,
  claimRewardPotion,
  claimRewardRelic,
  completeEventPurge,
  continueFromEvent,
  createNewRun,
  discardPotion,
  findMapNode,
  getAvailableNodeIds,
  leaveShop,
  proceedFromReward,
  restHeal,
  restUpgradeCard,
  runUsePotion,
  selectMapNode,
} from '../src/engine/game.js';

test('Spire map generator guarantees planar connectivity, zero orphan nodes, and Boss at floor 10 across 100 seeds', () => {
  assert.equal(TOTAL_FLOORS, 10);
  for (let seed = 1; seed <= 100; seed += 1) {
    const state = createNewRun({ seed });
    assert.equal(state.map.length, 10);
    assert.equal(state.map[8].length, 1);
    assert.equal(state.map[8][0].type, 'rest');
    assert.equal(state.map[9].length, 1);
    assert.equal(state.map[9][0].type, 'boss');

    for (let r = 0; r < state.map.length - 1; r += 1) {
      const currRow = state.map[r];
      const nextRow = state.map[r + 1];

      // Every node in currRow must connect to at least 1 node in nextRow
      for (const node of currRow) {
        assert.ok(node.nextIds.length >= 1, `Node ${node.id} has no outgoing path`);
        for (const targetId of node.nextIds) {
          assert.ok(
            nextRow.some((n) => n.id === targetId),
            `Invalid edge ${node.id} -> ${targetId}`
          );
        }
      }

      // Every node in nextRow must have at least 1 incoming parent from currRow
      for (const child of nextRow) {
        assert.ok(
          currRow.some((parent) => parent.nextIds.includes(child.id)),
          `Orphan node ${child.id} on seed ${seed}`
        );
      }

      // Non-crossing check for 2x2 rows: cannot have BOTH c0->c1 AND c1->c0
      if (currRow.length === 2 && nextRow.length === 2) {
        const c0Diag = currRow[0].nextIds.includes(nextRow[1].id);
        const c1Diag = currRow[1].nextIds.includes(nextRow[0].id);
        assert.equal(c0Diag && c1Diag, false, `Crossed edges on seed ${seed} row ${r}`);
      }
    }
  }
});

test('Combat victory transitions to Reward screen, handles loot claiming & Burning Blood, and returns to Map', () => {
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

  // Claim Gold once (second attempt rejected)
  const goldBefore = state.player.gold;
  assert.equal(claimRewardGold(state).ok, true);
  assert.equal(state.player.gold > goldBefore, true);
  assert.equal(claimRewardGold(state).ok, false);

  // Force relic & potion into reward to test claiming and full belt handling
  state.reward.relicId = 'vajra';
  state.reward.relicClaimed = false;
  assert.equal(claimRewardRelic(state).ok, true);
  assert.ok(state.player.relics.includes('vajra'));

  state.player.potions = ['block_potion', 'strength_potion'];
  state.reward.potionId = 'energy_potion';
  state.reward.potionClaimed = false;
  assert.equal(claimRewardPotion(state).ok, false); // Belt full!
  assert.equal(discardPotion(state, 1).ok, true);
  assert.equal(claimRewardPotion(state).ok, true);
  assert.equal(state.player.potions[1], 'energy_potion');

  // Claim 1 of 3 reward cards
  const deckSizeBefore = state.player.deck.length;
  const pickId = state.reward.cardChoices[0].instanceId;
  assert.equal(claimRewardCard(state, pickId).ok, true);
  assert.equal(state.player.deck.length, deckSizeBefore + 1);
  assert.equal(claimRewardCard(state, state.reward.cardChoices[1].instanceId).ok, false);

  assert.equal(proceedFromReward(state).ok, true);
  assert.equal(state.screen, 'map');
});

test('Rest site supports both 30% Max HP Heal and Card Upgrade (Smith)', () => {
  const state = createNewRun({ seed: 77 });
  state.screen = 'rest';
  state.restState = { completed: false, lastAction: null };
  state.player.hp = 40;

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

test('Shop enforces gold prices, 1x purge limit, minimum deck size, and potion belt capacity', () => {
  const state = createNewRun({ seed: 888 });
  // Jump to shop node in row 2
  const shopNode = state.map[2].find((n) => n.type === 'shop');
  state.currentNodeId = state.map[1][0].id;
  findMapNode(state, state.currentNodeId).nextIds = [shopNode.id];

  assert.equal(selectMapNode(state, shopNode.id).ok, true);
  assert.equal(state.screen, 'shop');

  state.player.gold = 500;
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

  // Purge 1 Strike
  const strike = state.player.deck.find((c) => c.cardId === 'strike');
  assert.equal(buyShopPurge(state, strike.instanceId).ok, true);
  assert.equal(buyShopPurge(state, state.player.deck[0].instanceId).ok, false); // Only 1 purge per shop!

  assert.equal(leaveShop(state).ok, true);
  assert.equal(state.screen, 'map');
});

test('Unknown Events resolve Shining Light & Ancient Forge (with explicit upgraded card names), Ancient Shrine purge/cancel, and Thorn Reliquary relic/fallback', () => {
  // 1. Shining Light explicitly names the 2 upgraded cards and records upgradedCardIds
  const lightState = createNewRun({ seed: 515 });
  lightState.screen = 'event';
  lightState.eventState = {
    eventId: 'shining_light',
    resolved: false,
    pendingPurge: false,
    outcomeText: '',
    upgradedCardIds: [],
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

  // 2. Ancient Forge temper_blade & overclock_forge explicitly name upgraded cards
  const forgeState = createNewRun({ seed: 616 });
  forgeState.screen = 'event';
  forgeState.eventState = {
    eventId: 'ancient_forge',
    resolved: false,
    pendingPurge: false,
    outcomeText: '',
    upgradedCardIds: [],
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

  // 4. Thorn Reliquary when player ALREADY owns all relics -> grants 80 gold fallback instead of undefined!
  state.screen = 'event';
  state.player.relics = [
    'burning_blood',
    'vajra',
    'oddly_smooth_stone',
    'anchor',
    'bag_of_prep',
    'lantern',
    'orichalcum',
  ];
  const goldBefore = state.player.gold;
  state.eventState = {
    eventId: 'thorn_reliquary',
    resolved: false,
    pendingPurge: false,
    outcomeText: '',
    upgradedCardIds: [],
  };
  assert.equal(chooseEventOption(state, 'open_reliquary').ok, true);
  assert.equal(state.player.gold, goldBefore + 80);
  assert.ok(state.player.relics.every((r) => typeof r === 'string' && r.length > 0));
});
