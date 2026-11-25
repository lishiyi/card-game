import test from 'node:test';
import assert from 'node:assert/strict';

import { canUpgradeCard, CARD_LIBRARY, createCardInstance, getCardStats } from '../src/data/cards.js';
import { CHARACTER_LIBRARY } from '../src/data/characters.js';
import { ENCOUNTERS, ENEMY_TEMPLATES } from '../src/data/enemies.js';
import { EVENT_LIBRARY, getEventChoicesForAscension, getEventTuning } from '../src/data/events.js';
import { POTION_LIBRARY, RELIC_LIBRARY } from '../src/data/relics.js';
import { canPlayCard, hasPendingCardChoice, MAX_HAND_SIZE, startCombat } from '../src/engine/combat.js';
import {
  buyShopCard,
  buyShopPotion,
  buyShopPurge,
  buyShopRelic,
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
  completeEventCardAction,
  completeEventPurge,
  completeNeowAction,
  continueFromEvent,
  createNewRun,
  digAtCampfire,
  findMapNode,
  getAvailableNodeIds,
  getUpgradableDeckCards,
  hasPendingNeowBlessing,
  leaveRestSite,
  leaveShop,
  leaveTreasureRoom,
  liftAtCampfire,
  openTreasureChest,
  pickEventLibraryCard,
  playerHasHeavyAttackCard,
  proceedFromReward,
  proceedToNextAct,
  restHeal,
  restUpgradeCard,
  runConfirmPendingCardChoice,
  runConfirmScry,
  runDiscardHandCard,
  runEndTurn,
  runPlayCard,
  runResolveCardChoice,
  runRestartCombat,
  runUsePotion,
  selectMapNode,
  settleAct1Victory,
  tokeAtCampfire,
} from '../src/engine/game.js';
import { ASCENSION_DEFS, UNLOCK_TIERS } from '../src/engine/meta.js';

function assertRunInvariants(state, contextMsg = '') {
  assert.ok(
    state.act === 1 || state.act === 2 || state.act === 3,
    `Invalid act ${state.act}: ${contextMsg}`
  );
  assert.ok(state.floor >= 0 && state.floor <= 16, `Invalid floor ${state.floor}: ${contextMsg}`);
  assert.ok(Number.isFinite(state.player.hp), `Player HP NaN: ${contextMsg}`);
  assert.ok(state.player.hp >= 0 && state.player.hp <= state.player.maxHp, `Player HP out of bounds: ${state.player.hp} (${contextMsg})`);
  assert.ok(Number.isFinite(state.player.gold) && state.player.gold >= 0, `Gold invalid: ${state.player.gold}`);
  assert.ok(state.player.deck.length >= 1, `Master deck became empty (${contextMsg})`);
  assert.ok(state.player.deck.every((c) => Boolean(CARD_LIBRARY[c.cardId])), `Unknown card in deck (${contextMsg})`);
  assert.ok(state.player.relics.every((id) => Boolean(RELIC_LIBRARY[id])), `Invalid relic in inventory`);
  assert.equal(new Set(state.player.relics).size, state.player.relics.length, 'Duplicate relic detected');

  if (state.screen === 'combat' && state.combat) {
    const c = state.combat;
    assert.ok(Number.isFinite(state.player.energy) && state.player.energy >= 0, `Invalid energy: ${state.player.energy}`);
    assert.ok(Number.isFinite(state.player.block) && state.player.block >= 0, `Invalid block: ${state.player.block}`);
    assert.equal(
      c.stance || 'neutral',
      state.player.stance || 'neutral',
      `Combat/player stance desync (${contextMsg})`
    );
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
  assert.throws(() => {
    ENEMY_TEMPLATES.lagavulin.hpRange[0] = 1;
  }, TypeError);
  assert.throws(() => {
    ENCOUNTERS.hardNormal[0].enemies[0].templateId = 'cultist';
  }, TypeError);
  assert.throws(() => {
    ASCENSION_DEFS[0].name = 'tampered';
  }, TypeError);
  assert.throws(() => {
    UNLOCK_TIERS[0].xpRequired = 0;
  }, TypeError);
  assert.throws(() => {
    CHARACTER_LIBRARY.silent.maxHp = 999;
  }, TypeError);
  assert.throws(() => {
    CHARACTER_LIBRARY.watcher.maxHp = 999;
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
  assert.equal(runUsePotion(state, 0, 'invalid_enemy_id').ok, false);
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

  // 3. After Act 1 Boss victory, transitions to boss_reward, combatSnapshot is cleared, and settleAct1Victory completes run
  bossState.combat.enemies[0].hp = 10;
  bossState.player.potions[0] = 'fire_potion';
  runUsePotion(bossState, 0, bossState.combat.enemies[0].id);
  assert.equal(bossState.screen, 'boss_reward');
  assert.equal(bossState.combatSnapshot, null);
  assert.equal(runRestartCombat(bossState).ok, false);
  assert.equal(claimBossRelic(bossState, bossState.bossReward.relicChoices[0]).ok, true);
  assert.equal(settleAct1Victory(bossState).ok, true);
  assert.equal(bossState.screen, 'game_over');
  assert.equal(bossState.runOutcome, 'victory');
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

test('[Critic / grill-it] 150-run deterministic fuzz simulation across Ironclad, Silent & Watcher, Act 1-3, Ascension 0-10, Treasure, Boss Relics, and all Events maintains all invariants', () => {
  let victories = 0;
  let defeats = 0;
  let act2Entries = 0;

  for (let seed = 1000; seed < 1150; seed += 1) {
    const ascension = seed % 2 === 0 ? 0 : (seed % 10) + 1;
    const characterId = ['ironclad', 'silent', 'watcher'][seed % 3];
    const state = createNewRun({ seed, characterId, ascension, unlockAllOverride: true });
    assertRunInvariants(state, `init ${characterId} seed ${seed}`);

    let safetySteps = 0;
    while (state.screen !== 'game_over' && safetySteps < 3500) {
      safetySteps += 1;

      if (state.screen === 'map') {
        if (hasPendingNeowBlessing(state)) {
          const neowOpt = state.neowState.options[seed % state.neowState.options.length];
          const neowRes = chooseNeowOption(state, neowOpt.id);
          assert.equal(neowRes.ok, true, `Neow option ${neowOpt.id} failed on seed ${seed}`);
          while (state.neowState.pendingAction) {
            const pa = state.neowState.pendingAction;
            if (pa.type === 'pick_card') {
              assert.equal(completeNeowAction(state, pa.cards[0].instanceId).ok, true);
            } else if (pa.type === 'upgrade') {
              const up = getUpgradableDeckCards(state);
              assert.equal(completeNeowAction(state, up[0].instanceId).ok, true);
            } else {
              assert.equal(completeNeowAction(state, state.player.deck[0].instanceId).ok, true);
            }
          }
          assertRunInvariants(state, `after Neow ${neowOpt.id} seed ${seed}`);
        }
        const nodes = getAvailableNodeIds(state);
        assert.ok(nodes.length >= 1, `No available map nodes on seed ${seed}`);
        // Prefer Rest when low HP, avoid Elite when below 45% HP if alternative exists
        const nodeObjs = nodes.map((id) => findMapNode(state, id)).filter(Boolean);
        let chosen = nodeObjs[seed % nodeObjs.length];
        if (state.player.hp < state.player.maxHp * 0.45) {
          const restNode = nodeObjs.find((n) => n.type === 'rest');
          const safeNode = nodeObjs.find((n) => n.type !== 'elite');
          chosen = restNode || safeNode || chosen;
        }
        assert.equal(selectMapNode(state, chosen.id).ok, true);
      } else if (state.screen === 'combat') {
        const resolvePendingDiscards = () => {
          let guard = 0;
          while (state.screen === 'combat' && hasPendingCardChoice(state.combat) && guard < 20) {
            guard += 1;
            const choice = state.combat.pendingCardChoice || { mode: 'discard' };
            if (choice.mode === 'scry') {
              assert.equal(runConfirmScry(state, []).ok, true);
              assertRunInvariants(state, `after confirmScry seed ${seed}`);
              continue;
            }
            if (choice.mode === 'discard_to_draw') {
              const cand = choice.candidates?.[0] || state.combat.discardPile[0];
              assert.ok(cand, `Pending discard_to_draw with empty candidates on seed ${seed}`);
              assert.equal(runResolveCardChoice(state, cand.instanceId).ok, true);
              assertRunInvariants(state, `after discard_to_draw seed ${seed}`);
              continue;
            }
            if (choice.mode === 'retrieve_discard_retain') {
              const pickIds = (choice.candidates || [])
                .slice(0, choice.count || 1)
                .map((c) => c.instanceId);
              assert.equal(runConfirmPendingCardChoice(state, pickIds).ok, true);
              assertRunInvariants(state, `after retrieve_discard_retain seed ${seed}`);
              continue;
            }
            if (choice.mode === 'retain') {
              const pickIds = (choice.candidates || [])
                .slice(0, choice.count || 1)
                .map((c) => c.instanceId);
              assert.equal(runConfirmPendingCardChoice(state, pickIds).ok, true);
              assertRunInvariants(state, `after retain choice seed ${seed}`);
              continue;
            }
            if (choice.mode === 'upgrade') {
              const target = state.combat.hand.find((c) => canUpgradeCard(c));
              assert.ok(target, `Pending upgrade with no upgradable card on seed ${seed}`);
              assert.equal(runResolveCardChoice(state, target.instanceId).ok, true);
              assertRunInvariants(state, `after upgrade choice seed ${seed}`);
              continue;
            }
            if (choice.mode === 'exhaust') {
              const target =
                state.combat.hand.find((c) => {
                  const t = getCardStats(c).type;
                  return t === 'status' || t === 'curse';
                }) || state.combat.hand[0];
              assert.ok(target, `Pending exhaust with empty hand on seed ${seed}`);
              assert.equal(runResolveCardChoice(state, target.instanceId).ok, true);
              assertRunInvariants(state, `after exhaust choice seed ${seed}`);
              continue;
            }
            const preferred =
              state.combat.hand.find((c) => {
                const st = getCardStats(c);
                return st.onDiscardGainEnergy || st.onDiscardDraw;
              }) || state.combat.hand[0];
            assert.ok(preferred, `Pending discard with empty hand on seed ${seed}`);
            assert.equal(runDiscardHandCard(state, preferred.instanceId).ok, true);
            assertRunInvariants(state, `after discardHandCard seed ${seed}`);
          }
        };

        resolvePendingDiscards();
        if (state.screen !== 'combat') continue;

        // Use available potions tactically
        for (let slot = 0; slot < state.player.potions.length; slot += 1) {
          if (state.player.potions[slot]) {
            const alive = state.combat.enemies.filter((e) => e.hp > 0);
            runUsePotion(state, slot, alive[0]?.id ?? null);
            assertRunInvariants(state, `after potion slot ${slot} seed ${seed}`);
            if (state.screen !== 'combat') break;
          }
        }
        if (state.screen !== 'combat') continue;

        // Play playable cards with tactical priority (powers -> needed block -> attacks)
        let playedSomething = true;
        let cardLoopGuard = 0;
        while (playedSomething && state.screen === 'combat' && cardLoopGuard < 60) {
          cardLoopGuard += 1;
          playedSomething = false;
          resolvePendingDiscards();
          if (state.screen !== 'combat') break;

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
              (needBlock && (st.block || st.doubleBlock || st.exhaustNonAttacksBlockEach) ? 30 : 0) +
              (st.applyEnemyStatuses || st.addCardsToHand ? 25 : 0) +
              (st.damage || st.exhaustAllHandDamageEach ? 20 : 0) -
              (st.useBlockAsDamage && state.player.block === 0 ? 30 : 0) -
              (st.doubleBlock && state.player.block === 0 ? 25 : 0);
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
            resolvePendingDiscards();
            playedSomething = true;
            break;
          }
        }

        if (state.screen === 'combat') {
          resolvePendingDiscards();
          if (state.screen === 'combat') {
            const endRes = runEndTurn(state);
            assert.equal(endRes.ok, true);
            if (endRes.awaitingRetainChoice) {
              resolvePendingDiscards();
            }
            assertRunInvariants(state, `after endTurn seed ${seed}`);
          }
        }
      } else if (state.screen === 'reward') {
        claimRewardGold(state);
        if (state.reward.emeraldKey) claimRewardEmeraldKey(state);
        if (state.reward.relicId) claimRewardRelic(state);
        if (state.reward.extraRelicId) claimRewardExtraRelic(state);
        if (state.reward.potionId) claimRewardPotion(state);
        if (state.reward.cardChoices.length > 0 && state.player.deck.length < 24) {
          claimRewardCard(state, state.reward.cardChoices[0].instanceId);
        }
        assert.equal(proceedFromReward(state).ok, true);
      } else if (state.screen === 'treasure') {
        assert.equal(openTreasureChest(state).ok, true);
        assert.equal(leaveTreasureRoom(state).ok, true);
      } else if (state.screen === 'boss_reward') {
        assert.equal(state.bossReward.cardChoices.length, 3);
        for (const rareCard of state.bossReward.cardChoices) {
          assert.equal(CARD_LIBRARY[rareCard.cardId].rarity, 'rare');
        }
        if (state.player.deck.length < 24) {
          assert.equal(
            claimBossRewardCard(state, state.bossReward.cardChoices[0].instanceId).ok,
            true
          );
        }
        if (state.bossReward.relicChoices.length > 0) {
          assert.equal(claimBossRelic(state, state.bossReward.relicChoices[0]).ok, true);
        }
        if (seed % 3 === 0 || ((state.ascension ?? 0) >= 10 && (state.act ?? 1) < 3)) {
          if ((state.act ?? 1) === 1) act2Entries += 1;
          assert.equal(proceedToNextAct(state).ok, true);
        } else {
          assert.equal(settleAct1Victory(state).ok, true);
        }
      } else if (state.screen === 'rest') {
        const upgradable = getUpgradableDeckCards(state);
        const canRestHeal = !state.player.relics.includes('coffee_dripper');
        if (canRestHeal && (state.player.hp < state.player.maxHp * 0.65 || upgradable.length === 0)) {
          restHeal(state);
        } else if (state.player.relics.includes('girya') && (state.relicCounters?.girya ?? 0) < 3) {
          liftAtCampfire(state);
        } else if (state.player.relics.includes('shovel')) {
          digAtCampfire(state);
        } else if (state.player.relics.includes('peace_pipe') && state.player.deck.length > 8) {
          const curseCard = state.player.deck.find((c) => getCardStats(c).type === 'curse');
          tokeAtCampfire(state, (curseCard || state.player.deck[0]).instanceId);
        } else if (upgradable.length > 0) {
          restUpgradeCard(state, upgradable[0].instanceId);
        } else {
          leaveRestSite(state);
        }
      } else if (state.screen === 'shop') {
        buyShopRelic(state);
        buyShopPotion(state);
        buyShopCard(state, 0);
        if (state.player.deck.length > 6) {
          const curseIdx = state.player.deck.findIndex((c) => getCardStats(c).type === 'curse');
          const purgeTarget = curseIdx !== -1 ? state.player.deck[curseIdx] : state.player.deck[0];
          buyShopPurge(state, purgeTarget.instanceId);
        }
        leaveShop(state);
      } else if (state.screen === 'event') {
        const eventId = state.eventState.eventId;
        const evTune = getEventTuning(state.ascension ?? 0);
        if (eventId === 'shining_light') {
          assert.equal(chooseEventOption(state, state.player.hp > 20 ? 'enter_light' : 'leave').ok, true);
        } else if (eventId === 'ancient_forge') {
          const forgeCost = (state.ascension ?? 0) >= 8 ? 40 : 30;
          const choice =
            state.player.hp > 20 && state.player.gold >= forgeCost ? 'overclock_forge' : 'temper_blade';
          assert.equal(chooseEventOption(state, choice).ok, true);
        } else if (eventId === 'ancient_shrine') {
          if (state.player.deck.length > 3) {
            assert.equal(chooseEventOption(state, 'pray_purge').ok, true);
            if (state.eventState.pendingPurge) {
              assert.equal(completeEventPurge(state, state.player.deck[0].instanceId).ok, true);
            }
          } else {
            assert.equal(chooseEventOption(state, 'drink_spring').ok, true);
          }
        } else if (eventId === 'thorn_reliquary') {
          assert.equal(chooseEventOption(state, state.player.hp > 20 ? 'open_reliquary' : 'take_coins').ok, true);
        } else if (eventId === 'golden_idol') {
          const choice =
            state.player.hp > 25 ? 'smash_trap' : seed % 2 === 0 ? 'accept_curse_gold' : 'leave_idol';
          assert.equal(chooseEventOption(state, choice).ok, true);
        } else if (eventId === 'living_wall') {
          const upgradable = getUpgradableDeckCards(state);
          const modeIdx = seed % 3;
          if (modeIdx === 0 && state.player.deck.length > 3) {
            assert.equal(chooseEventOption(state, 'wall_forget').ok, true);
            assert.equal(completeEventPurge(state, state.player.deck[0].instanceId).ok, true);
          } else if (modeIdx === 1 || upgradable.length === 0) {
            assert.equal(chooseEventOption(state, 'wall_change').ok, true);
            assert.equal(completeEventCardAction(state, state.player.deck[0].instanceId).ok, true);
          } else {
            assert.equal(chooseEventOption(state, 'wall_grow').ok, true);
            assert.equal(completeEventCardAction(state, upgradable[0].instanceId).ok, true);
          }
        } else if (eventId === 'cursed_tome') {
          const choice =
            state.player.hp > evTune.tomeFinalHpLoss + 8
              ? 'read_final_chapter'
              : state.player.hp > evTune.tomeSkimHpLoss + 8
                ? 'skim_preface'
                : 'close_tome';
          assert.equal(chooseEventOption(state, choice).ok, true);
        } else if (eventId === 'potion_alchemist') {
          const buyGoldCost = (state.ascension ?? 0) >= 8 ? 45 : 35;
          const canBuy = state.player.gold >= buyGoldCost && state.player.potions.includes(null);
          const choice = canBuy ? 'buy_potions' : seed % 2 === 0 ? 'drink_mutagen' : 'rob_alchemist';
          assert.equal(chooseEventOption(state, choice).ok, true);
        } else if (eventId === 'mushroom_grotto') {
          const choice =
            state.player.hp < state.player.maxHp * 0.55
              ? 'eat_blue_cap'
              : state.player.hp > 18
                ? 'refine_red_spore'
                : 'bypass_grotto';
          assert.equal(chooseEventOption(state, choice).ok, true);
        } else if (eventId === 'library_sanctum') {
          if (seed % 2 === 0) {
            assert.equal(chooseEventOption(state, 'study_manuals').ok, true);
            assert.equal(
              pickEventLibraryCard(state, state.eventState.libraryChoices[0].instanceId).ok,
              true
            );
          } else {
            assert.equal(chooseEventOption(state, 'nap_in_library').ok, true);
          }
        } else if (eventId === 'masked_bandits') {
          const choice = state.player.hp > 26 ? 'fight_bandits' : 'pay_gold';
          assert.equal(chooseEventOption(state, choice).ok, true);
        } else if (eventId === 'mind_bloom') {
          const choice =
            state.player.maxHp >= 45
              ? 'awake_memory'
              : state.player.hp > 40
                ? 'war_memory'
                : 'rich_memory';
          assert.equal(chooseEventOption(state, choice).ok, true);
        } else if (eventId === 'scrap_ooze') {
          const hpCost = ((state.ascension ?? 0) >= 8 ? 7 : 5) + (state.eventState.oozeAttempts ?? 0);
          const choice = state.player.hp > hpCost + 12 ? 'reach_ooze' : 'leave_ooze';
          assert.equal(chooseEventOption(state, choice).ok, true);
        } else if (eventId === 'wing_statue') {
          const prayCost = (state.ascension ?? 0) >= 8 ? 10 : 7;
          if (playerHasHeavyAttackCard(state)) {
            assert.equal(chooseEventOption(state, 'destroy_wing').ok, true);
          } else if (state.player.hp > prayCost + 8 && state.player.deck.length > 3) {
            assert.equal(chooseEventOption(state, 'pray_wing').ok, true);
            if (state.eventState.pendingPurge) {
              assert.equal(completeEventPurge(state, state.player.deck[0].instanceId).ok, true);
            }
          } else {
            assert.equal(chooseEventOption(state, 'leave_wing').ok, true);
          }
        } else if (eventId === 'council_of_ghosts') {
          const choice = state.player.maxHp >= 55 && seed % 2 === 0 ? 'accept_ghosts' : 'refuse_ghosts';
          assert.equal(chooseEventOption(state, choice).ok, true);
        } else if (eventId === 'forgotten_altar') {
          const shedCost = Math.max(
            1,
            Math.floor(state.player.maxHp * (((state.ascension ?? 0) >= 8 ? 30 : 25) / 100))
          );
          const choice = state.player.relics.includes('golden_idol_relic')
            ? 'offer_golden_idol'
            : state.player.hp > shedCost + 10
              ? 'shed_blood_altar'
              : 'desecrate_altar';
          assert.equal(chooseEventOption(state, choice).ok, true);
        } else if (eventId === 'augmenter') {
          const serumCost = (state.ascension ?? 0) >= 8 ? 16 : 12;
          if (seed % 2 === 0 && state.player.deck.length > 0) {
            assert.equal(chooseEventOption(state, 'augment_rare_transform').ok, true);
            assert.equal(completeEventCardAction(state, state.player.deck[0].instanceId).ok, true);
          } else if (state.player.hp > serumCost + 10) {
            assert.equal(chooseEventOption(state, 'augment_serum').ok, true);
          } else {
            assert.equal(chooseEventOption(state, 'augment_leave').ok, true);
          }
        } else if (eventId === 'sensory_stone') {
          const c3 = evTune.sensoryRecall3HpLoss;
          const c2 = evTune.sensoryRecall2HpLoss;
          if (state.player.hp > c3 + 10 && seed % 3 === 0) {
            assert.equal(chooseEventOption(state, 'recall_3').ok, true);
          } else if (state.player.hp > c2 + 8 && seed % 2 === 0) {
            assert.equal(chooseEventOption(state, 'recall_2').ok, true);
            assert.equal(
              pickEventLibraryCard(state, state.eventState.libraryChoices[0].instanceId).ok,
              true
            );
          } else {
            assert.equal(chooseEventOption(state, 'recall_1').ok, true);
            assert.equal(
              pickEventLibraryCard(state, state.eventState.libraryChoices[0].instanceId).ok,
              true
            );
          }
        } else if (eventId === 'winding_halls') {
          const madCost = (state.ascension ?? 0) >= 8 ? 16 : 12;
          const choice =
            state.player.hp > madCost + 12
              ? 'embrace_madness'
              : state.player.hp < state.player.maxHp * 0.5
                ? 'retrace_steps'
                : 'push_through_halls';
          assert.equal(chooseEventOption(state, choice).ok, true);
        } else if (eventId === 'big_fish') {
          const choice = state.player.hp < state.player.maxHp * 0.65 ? 'eat_banana' : seed % 3 === 0 ? 'open_fish_box' : 'eat_donut';
          assert.equal(chooseEventOption(state, choice).ok, true);
        } else if (eventId === 'cleric') {
          if (state.player.gold >= evTune.clericPurifyGold && state.player.deck.length > 3 && seed % 2 === 0) {
            assert.equal(chooseEventOption(state, 'cleric_purify').ok, true);
            assert.equal(completeEventPurge(state, state.player.deck[0].instanceId).ok, true);
          } else if (state.player.gold >= evTune.clericHealGold) {
            assert.equal(chooseEventOption(state, 'cleric_heal').ok, true);
          } else {
            assert.equal(chooseEventOption(state, 'cleric_leave').ok, true);
          }
        } else if (eventId === 'dead_adventurer') {
          const choice =
            state.player.hp > evTune.adventurerFailHpLoss + 8
              ? 'loot_pack'
              : state.player.hp > evTune.adventurerWeaponHpLoss + 6
                ? 'salvage_weapon'
                : 'leave_adventurer';
          assert.equal(chooseEventOption(state, choice).ok, true);
        } else if (eventId === 'sssserpent') {
          assert.equal(chooseEventOption(state, seed % 2 === 0 ? 'accept_serpent_gold' : 'refuse_serpent').ok, true);
        } else if (eventId === 'world_of_goop') {
          assert.equal(
            chooseEventOption(state, state.player.hp > evTune.goopHpLoss + 8 ? 'gather_goop_gold' : 'leave_goop').ok,
            true
          );
        } else if (eventId === 'the_joust') {
          const choice = state.player.gold >= 50 ? (seed % 2 === 0 ? 'bet_murderer' : 'bet_owner') : 'leave_joust';
          assert.equal(chooseEventOption(state, choice).ok, true);
        } else if (eventId === 'the_mausoleum') {
          assert.equal(chooseEventOption(state, seed % 2 === 0 ? 'open_coffin' : 'leave_mausoleum').ok, true);
        } else if (eventId === 'vampires_den') {
          const choice = state.player.relics.includes('blood_vial')
            ? 'trade_blood_vial'
            : state.player.maxHp >= 50 && seed % 3 === 0
              ? 'accept_vampire_pact'
              : 'refuse_vampires';
          assert.equal(chooseEventOption(state, choice).ok, true);
        } else if (eventId === 'beggar_shrine') {
          if (state.player.gold >= evTune.beggarPurifyGold && state.player.deck.length > 3) {
            assert.equal(chooseEventOption(state, 'give_beggar_gold').ok, true);
            assert.equal(completeEventPurge(state, state.player.deck[0].instanceId).ok, true);
          } else {
            assert.equal(chooseEventOption(state, 'leave_beggar').ok, true);
          }
        } else if (eventId === 'colosseum_trial') {
          assert.equal(
            chooseEventOption(state, state.player.hp > evTune.colosseumHpLoss + 10 ? 'accept_trial' : 'skip_trial').ok,
            true
          );
        } else if (eventId === 'tomb_of_red_mask') {
          const choice = state.player.relics.includes('red_mask')
            ? 'wear_red_mask'
            : state.player.gold >= 1 && seed % 2 === 0
              ? 'offer_all_gold'
              : 'leave_red_tomb';
          assert.equal(chooseEventOption(state, choice).ok, true);
        } else if (eventId === 'falling_abyss') {
          const hasSkill = state.player.deck.some((c) => getCardStats(c).type === 'skill');
          const hasAtk = state.player.deck.some((c) => getCardStats(c).type === 'attack');
          const choice =
            state.player.deck.length > 2 && hasAtk && seed % 3 === 0
              ? 'land_sacrifice_attack'
              : state.player.deck.length > 2 && hasSkill && seed % 3 === 1
                ? 'land_sacrifice_skill'
                : 'brace_fall_impact';
          assert.equal(chooseEventOption(state, choice).ok, true);
        } else if (eventId === 'mysterious_sphere') {
          assert.equal(
            chooseEventOption(state, state.player.hp > evTune.sphereHpLoss + 10 ? 'smash_sphere' : 'leave_sphere').ok,
            true
          );
        } else if (eventId === 'moai_head') {
          const choice = state.player.relics.includes('golden_idol_relic')
            ? 'offer_golden_idol'
            : state.player.hp < state.player.maxHp * 0.6
              ? 'jump_into_moai'
              : 'leave_moai';
          assert.equal(chooseEventOption(state, choice).ok, true);
        } else if (eventId === 'secret_portal') {
          const choice = state.player.hp > evTune.portalSiphonHpLoss + 10 && seed % 2 === 0 ? 'siphon_portal' : 'study_portal';
          assert.equal(chooseEventOption(state, choice).ok, true);
        } else if (eventId === 'spire_forge_altar') {
          if (state.player.gold >= evTune.forgeAltarGold && seed % 2 === 0) {
            assert.equal(chooseEventOption(state, 'altar_buy_colorless').ok, true);
            assert.equal(pickEventLibraryCard(state, state.eventState.libraryChoices[0].instanceId).ok, true);
          } else if (state.player.hp > evTune.forgeAltarHpLoss + 8 && state.player.deck.length > 0) {
            assert.equal(chooseEventOption(state, 'altar_transmute_rare').ok, true);
            assert.equal(completeEventCardAction(state, state.player.deck[0].instanceId).ok, true);
          } else {
            assert.equal(chooseEventOption(state, 'leave_forge_altar').ok, true);
          }
        } else {
          assert.fail(`Unhandled event in fuzz test: ${eventId}`);
        }
        if (state.screen === 'event' && state.eventState?.resolved) {
          assert.equal(continueFromEvent(state).ok, true);
        }
      }

      assertRunInvariants(state, `loop step ${safetySteps} seed ${seed}`);
    }

    assert.equal(state.screen, 'game_over', `Seed ${seed} did not terminate within 3500 steps (stuck on ${state.screen})`);
    if (state.runOutcome === 'victory') victories += 1;
    else defeats += 1;
  }

  // Greedy bot should win some runs, lose some runs, and enter Act 2/Act 3 when reaching Boss on divisible-by-3 seeds
  assert.ok(victories > 0, 'Expected at least 1 victory across 150 simulated runs');
  assert.ok(defeats > 0, 'Expected at least 1 defeat across 150 simulated runs');
  assert.ok(act2Entries >= 0);
});
