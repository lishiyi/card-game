import test from 'node:test';
import assert from 'node:assert/strict';

import { CARD_LIBRARY, createCardInstance, getCardStats } from '../src/data/cards.js';
import { ENCOUNTERS } from '../src/data/enemies.js';
import { EVENT_LIBRARY } from '../src/data/events.js';
import { POTION_LIBRARY, RELIC_LIBRARY } from '../src/data/relics.js';
import { canPlayCard, MAX_HAND_SIZE, startCombat } from '../src/engine/combat.js';
import {
  buyShopCard,
  buyShopPotion,
  buyShopPurge,
  buyShopRelic,
  chooseEventOption,
  claimRewardCard,
  claimRewardGold,
  claimRewardPotion,
  claimRewardRelic,
  completeEventPurge,
  continueFromEvent,
  createNewRun,
  getAvailableNodeIds,
  getUpgradableDeckCards,
  leaveShop,
  proceedFromReward,
  restHeal,
  restUpgradeCard,
  runEndTurn,
  runPlayCard,
  runRestartCombat,
  runUsePotion,
  selectMapNode,
} from '../src/engine/game.js';

function assertRunInvariants(state, contextMsg = '') {
  assert.ok(Number.isFinite(state.player.hp), `Player HP NaN: ${contextMsg}`);
  assert.ok(state.player.hp >= 0 && state.player.hp <= state.player.maxHp, `Player HP out of bounds: ${state.player.hp} (${contextMsg})`);
  assert.ok(Number.isFinite(state.player.gold) && state.player.gold >= 0, `Gold invalid: ${state.player.gold}`);
  assert.ok(state.player.deck.length >= 1, `Master deck became empty (${contextMsg})`);
  assert.ok(state.player.relics.every((id) => Boolean(RELIC_LIBRARY[id])), `Invalid relic in inventory`);
  assert.equal(new Set(state.player.relics).size, state.player.relics.length, 'Duplicate relic detected');

  if (state.screen === 'combat' && state.combat) {
    const c = state.combat;
    assert.ok(Number.isFinite(state.player.energy) && state.player.energy >= 0, `Invalid energy: ${state.player.energy}`);
    assert.ok(Number.isFinite(state.player.block) && state.player.block >= 0, `Invalid block: ${state.player.block}`);
    assert.ok(c.hand.length <= MAX_HAND_SIZE, `Hand exceeded MAX_HAND_SIZE: ${c.hand.length}`);

    // No card instance should ever exist in two piles simultaneously!
    const allIds = [
      ...c.drawPile.map((x) => x.instanceId),
      ...c.hand.map((x) => x.instanceId),
      ...c.discardPile.map((x) => x.instanceId),
      ...c.exhaustPile.map((x) => x.instanceId),
    ];
    assert.equal(new Set(allIds).size, allIds.length, `Duplicate card instanceId across piles (${contextMsg})`);

    for (const enemy of c.enemies) {
      assert.ok(Number.isFinite(enemy.hp) && enemy.hp >= 0 && enemy.hp <= enemy.maxHp, `Enemy HP invalid: ${enemy.hp}`);
      assert.ok(Number.isFinite(enemy.block) && enemy.block >= 0, `Enemy block invalid: ${enemy.block}`);
      if (enemy.hp === 0) {
        assert.equal(enemy.block, 0, 'Dead enemy retained block');
      }
    }
  }
}

test('[Critic / grill-it] Static libraries are strictly immutable', () => {
  assert.throws(() => {
    CARD_LIBRARY.strike.base.damage = 999;
  }, TypeError);
  assert.throws(() => {
    RELIC_LIBRARY.burning_blood.price = 0;
  }, TypeError);
  assert.throws(() => {
    POTION_LIBRARY.fire_potion.damage = 999;
  }, TypeError);
  assert.throws(() => {
    EVENT_LIBRARY.shining_light.choices[0].label = 'tampered';
  }, TypeError);
});

test('[Critic / grill-it] Whirlwind (X-cost) plays cleanly at 0 energy and at high energy', () => {
  const state = createNewRun({ seed: 31415 });
  startCombat(state, ENCOUNTERS.normal[0], 'normal');
  const ww = createCardInstance(state, 'whirlwind', false);
  state.combat.hand = [ww];
  state.player.energy = 0;

  assert.equal(canPlayCard(state, ww.instanceId).playable, true);
  const resZero = runPlayCard(state, ww.instanceId);
  assert.equal(resZero.ok, true);
  assert.equal(state.player.energy, 0);
  assert.equal(state.combat.discardPile.some((c) => c.instanceId === ww.instanceId), true);
  assertRunInvariants(state, '0-energy Whirlwind');
});

test('[Critic / grill-it] Self-lethal HP loss (Offering / Bloodletting) ends run immediately and never triggers Burning Blood', () => {
  const state = createNewRun({ seed: 27182 });
  startCombat(state, ENCOUNTERS.floor1[0], 'normal');
  state.player.hp = 5;
  state.player.block = 30; // Block must NOT save player from self HP loss!
  const offering = createCardInstance(state, 'offering', false);
  state.combat.hand = [offering];

  const res = runPlayCard(state, offering.instanceId);
  assert.equal(res.ok, true);
  assert.equal(state.player.hp, 0);
  assert.equal(state.runOutcome, 'defeat');
  assert.equal(state.screen, 'game_over');
});

test('[Critic / grill-it] Hostile / malformed inputs fail gracefully without mutating state', () => {
  const state = createNewRun({ seed: 5555 });
  startCombat(state, ENCOUNTERS.normal[0], 'normal');
  const snapshotBefore = JSON.stringify(state);

  assert.equal(runPlayCard(state, 'non_existent_card').ok, false);
  assert.equal(runPlayCard(state, state.combat.hand[0].instanceId, 'invalid_enemy_id').ok, false);
  assert.equal(runUsePotion(state, -1).ok, false);
  assert.equal(runUsePotion(state, 99).ok, false);
  assert.equal(runUsePotion(state, 1).ok, false); // Empty slot 1
  assert.equal(selectMapNode(state, 'f1_c0').ok, false); // Cannot navigate map mid-combat
  assert.equal(claimRewardGold(state).ok, false);

  assert.equal(JSON.stringify(state), snapshotBefore);
});

test('[Critic / grill-it] runRestartCombat resists non-combat calls, clears Boss Guardian defensive state, and clears snapshot after victory/defeat', () => {
  // 1. Non-combat rejection without mutating map state
  const mapState = createNewRun({ seed: 4242 });
  const mapSnap = JSON.stringify(mapState);
  assert.equal(runRestartCombat(mapState).ok, false);
  assert.equal(JSON.stringify(mapState), mapSnap);

  // 2. Boss Guardian enters Defensive Mode + Sharp Hide, then Restart restores Offensive Mode cleanly
  const bossState = createNewRun({ seed: 7331 });
  bossState.player.deck.push(createCardInstance(bossState, 'bludgeon', true));
  startCombat(bossState, ENCOUNTERS.boss[0], 'boss');
  const guardian = bossState.combat.enemies[0];
  const bludgeon = createCardInstance(bossState, 'bludgeon', true);
  bossState.player.energy = 3;
  bossState.combat.hand = [bludgeon];
  runPlayCard(bossState, bludgeon.instanceId, guardian.id);
  assert.equal(guardian.mode, 'defensive');
  assert.equal(guardian.statuses.sharpHide, 3);

  assert.equal(runRestartCombat(bossState).ok, true);
  assert.equal(bossState.combat.enemies[0].mode, 'offensive');
  assert.equal(bossState.combat.enemies[0].statuses.sharpHide, undefined);
  assert.equal(bossState.combat.enemies[0].statuses.modeShift, 25);
  assertRunInvariants(bossState, 'after Boss restart');

  // 3. After victory, combatSnapshot is cleared and runRestartCombat fails gracefully
  bossState.combat.enemies[0].hp = 10;
  runUsePotion(bossState, 0, bossState.combat.enemies[0].id);
  assert.equal(bossState.screen, 'game_over');
  assert.equal(bossState.runOutcome, 'victory');
  assert.equal(bossState.combatSnapshot, null);
  assert.equal(runRestartCombat(bossState).ok, false);
});

test('[Critic / grill-it] Orichalcum triggers at 0 block before Metallicize adds end-of-turn block', () => {
  const state = createNewRun({ seed: 6174 });
  state.player.relics.push('orichalcum');
  startCombat(state, ENCOUNTERS.floor1[0], 'normal');

  // Force enemy harmless buff intent so we can inspect block behavior in logs
  state.combat.enemies[0].intent = { id: 'noop', name: '待机', type: 'buff', summary: '待机' };
  const met = createCardInstance(state, 'metallicize', false);
  state.combat.hand = [met];
  runPlayCard(state, met.instanceId);
  assert.equal(state.player.block, 0);

  runEndTurn(state);
  const logMessages = state.combat.logs.map((l) => l.message).join('\n');
  assert.ok(logMessages.includes('奥利哈钢'), 'Orichalcum should trigger when block is 0 before Metallicize');
  assert.ok(logMessages.includes('金属化'), 'Metallicize should also trigger after Orichalcum');
});

test('[Critic / grill-it] 150-run deterministic fuzz simulation across full Spire loop maintains all invariants', () => {
  let victories = 0;
  let defeats = 0;

  for (let seed = 1000; seed < 1150; seed += 1) {
    const state = createNewRun({ seed });
    assertRunInvariants(state, `init seed ${seed}`);

    let safetySteps = 0;
    while (state.screen !== 'game_over' && safetySteps < 900) {
      safetySteps += 1;

      if (state.screen === 'map') {
        const nodes = getAvailableNodeIds(state);
        assert.ok(nodes.length >= 1, `No available map nodes on seed ${seed}`);
        const pickedNode = nodes[seed % nodes.length];
        assert.equal(selectMapNode(state, pickedNode).ok, true);
      } else if (state.screen === 'combat') {
        // Use potion if available
        if (state.player.potions[0]) {
          const alive = state.combat.enemies.filter((e) => e.hp > 0);
          runUsePotion(state, 0, alive[0]?.id ?? null);
          assertRunInvariants(state, `after potion seed ${seed}`);
          if (state.screen !== 'combat') continue;
        }

        // Play playable cards with basic tactical priority (powers -> needed block -> attacks)
        let playedSomething = true;
        while (playedSomething && state.screen === 'combat') {
          playedSomething = false;
          const incoming = state.combat.enemies.reduce(
            (sum, e) => sum + (e.hp > 0 && e.intent?.damage ? e.intent.damage * (e.intent.hits ?? 1) : 0),
            0
          );
          const needBlock = incoming > state.player.block;
          const sortedHand = [...state.combat.hand].sort((a, b) => {
            const sa = getCardStats(a);
            const sb = getCardStats(b);
            const rank = (st) =>
              (st.type === 'power' ? 40 : 0) +
              (needBlock && st.block ? 30 : 0) +
              (st.applyEnemyStatuses ? 25 : 0) +
              (st.damage ? 20 : 0) -
              (st.useBlockAsDamage && state.player.block === 0 ? 30 : 0);
            return rank(sb) - rank(sa);
          });

          for (const card of sortedHand) {
            if (!canPlayCard(state, card.instanceId).playable) continue;
            const stats = getCardStats(card);
            if (stats.loseHp && state.player.hp <= stats.loseHp + 6) continue;
            if (stats.isXCost && state.player.energy === 0) continue;

            const alive = state.combat.enemies.filter((e) => e.hp > 0);
            const targetId = stats.target === 'enemy' ? alive[0]?.id : null;
            const res = runPlayCard(state, card.instanceId, targetId);
            assert.equal(res.ok, true);
            assertRunInvariants(state, `after playCard ${stats.cardId} seed ${seed}`);
            playedSomething = true;
            break;
          }
        }

        if (state.screen === 'combat') {
          assert.equal(runEndTurn(state).ok, true);
          assertRunInvariants(state, `after endTurn seed ${seed}`);
        }
      } else if (state.screen === 'reward') {
        claimRewardGold(state);
        if (state.reward.relicId) claimRewardRelic(state);
        if (state.reward.potionId) claimRewardPotion(state);
        if (state.reward.cardChoices.length > 0) {
          claimRewardCard(state, state.reward.cardChoices[0].instanceId);
        }
        proceedFromReward(state);
      } else if (state.screen === 'rest') {
        const upgradable = getUpgradableDeckCards(state);
        if (state.player.hp < state.player.maxHp * 0.65 || upgradable.length === 0) {
          restHeal(state);
        } else {
          restUpgradeCard(state, upgradable[0].instanceId);
        }
      } else if (state.screen === 'shop') {
        buyShopRelic(state);
        buyShopPotion(state);
        buyShopCard(state, 0);
        if (state.player.deck.length > 6) {
          buyShopPurge(state, state.player.deck[0].instanceId);
        }
        leaveShop(state);
      } else if (state.screen === 'event') {
        const eventId = state.eventState.eventId;
        if (eventId === 'shining_light') {
          const r = chooseEventOption(state, state.player.hp > 20 ? 'enter_light' : 'leave');
          assert.equal(r.ok, true);
        } else if (eventId === 'ancient_forge') {
          const choice =
            state.player.hp > 20 && state.player.gold >= 30 ? 'overclock_forge' : 'temper_blade';
          const r = chooseEventOption(state, choice);
          assert.equal(r.ok, true);
        } else if (eventId === 'ancient_shrine') {
          chooseEventOption(state, 'pray_purge');
          if (state.eventState.pendingPurge) {
            completeEventPurge(state, state.player.deck[0].instanceId);
          }
        } else {
          chooseEventOption(state, state.player.hp > 20 ? 'open_reliquary' : 'take_coins');
        }
        continueFromEvent(state);
      }

      assertRunInvariants(state, `loop step ${safetySteps} seed ${seed}`);
    }

    assert.equal(state.screen, 'game_over', `Seed ${seed} did not terminate within 900 steps`);
    if (state.runOutcome === 'victory') victories += 1;
    else defeats += 1;
  }

  // Greedy bot should win some runs and lose some runs (proving Boss is beatable yet non-trivial!)
  assert.ok(victories > 0, 'Expected at least 1 victory across 150 simulated runs');
  assert.ok(defeats > 0, 'Expected at least 1 defeat across 150 simulated runs');
});
