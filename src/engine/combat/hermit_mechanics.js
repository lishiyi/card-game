/**
 * Downfall — The Hermit (亡命之徒) core combat mechanics:
 * - Dead On (精准): center hand slot check (exact Downfall formula: |index + 0.5 - len/2| < 1)
 *   or active Concentration (专注).
 * - Snipe (狙击): doubles Dead On trigger count and consumes 1 stack per Dead On trigger.
 * - Bruise (瘀伤) & Horror (恐惧): additive attack damage taken; clears on enemy turn start unless Horror > 0.
 * - Rugged (坚固): clamps next N unblocked attack hits to 2 damage.
 * - Stun-Keep-Intent (保留意图眩晕): stuns enemy for 1 turn while preserving its original intent for the next turn.
 * - Curse draw / exhaust hooks (Clasped Locket, Shadow Cloak, Charred Glove).
 * - End-of-turn hooks (Concentration decay, Spyglass, Impending Doom, Overwhelming Power, Coalescence).
 */

import { CARD_LIBRARY, createCardInstance, getCardStats } from '../../data/cards.js';
import { RELIC_LIBRARY, STATUS_METADATA } from '../../data/relics.js';
import {
  countEntityDebuffs,
  getDeadOnRepeatCount,
  isCardDeadOnInHand,
  isHandIndexDeadOn,
} from '../math.js';
import { applyStatus, getAliveEnemies, hasRelic, MAX_HAND_SIZE, pushCombatLog } from './state.js';

export { countEntityDebuffs, getDeadOnRepeatCount, isCardDeadOnInHand, isHandIndexDeadOn };

/**
 * Triggers Red Scarf (+3 Block whenever applying a new debuff to an enemy) if equipped.
 */
export function maybeTriggerRedScarfOnNewDebuff(state, enemy, statusKey, hadStatusBefore, addPlayerBlockFn) {
  if (!state?.combat || !enemy || hadStatusBefore) return 0;
  const meta = STATUS_METADATA[statusKey];
  if (meta?.polarity !== 'debuff') return 0;
  if (!hasRelic(state, 'red_scarf') || typeof addPlayerBlockFn !== 'function') return 0;
  const gain = addPlayerBlockFn(state, 3);
  if (gain > 0) {
    pushCombatLog(
      state.combat,
      `遗物【${RELIC_LIBRARY.red_scarf.name}】触发：施加新减益，获得 ${gain} 点格挡！`,
      'block'
    );
  }
  return gain;
}

/**
 * Stuns an enemy for its upcoming turn while preserving its current intent so it resumes
 * that exact intent on the following turn (used by Hermit's Roundhouse Kick).
 */
export function applyStunKeepIntent(state, enemy, sourceName = '回旋踢') {
  const combat = state?.combat;
  if (!combat || !enemy || enemy.hp <= 0) return false;
  if (enemy.intent?.id === 'stunned' || enemy.intent?.id === 'stunned_keep_intent') {
    return false;
  }
  if (!enemy.statuses) enemy.statuses = {};
  enemy.stunnedSavedIntent = enemy.intent ? { ...enemy.intent } : null;
  enemy.statuses.stunned = 1;
  enemy.intent = {
    id: 'stunned_keep_intent',
    name: '眩晕',
    type: 'sleep',
    summary: '意图：陷入眩晕，本回合跳过行动（下回合保留原有意图）！',
  };
  pushCombatLog(
    combat,
    `【${sourceName}】使【${enemy.name}】陷入【眩晕】，跳过其下一次行动（保留原意图）！`,
    'status'
  );
  return true;
}

/**
 * Consumes Concentration after any Dead On-tagged card is played (matching Downfall Concentration.onUseCard).
 */
export function consumeConcentrationOnDeadOnCard(state, stats) {
  const combat = state?.combat;
  if (!combat || !stats?.deadOn) return false;
  if ((state.player?.statuses?.concentration ?? 0) > 0) {
    delete state.player.statuses.concentration;
    pushCombatLog(combat, `【专注】生效并消退（触发【${stats.name}】精准效果）。`, 'status');
    return true;
  }
  return false;
}

/**
 * Shared Dead On trigger bookkeeping & passive reactions:
 * - Tracks lastCardTriggeredDeadOn / deadOnTriggeredThisTurn / deadOnTriggeredThisCombat
 * - Consumes 1 stack of Snipe if active
 * - Triggers Black Powder (2 AoE thorns dmg per Dead On activation)
 * - Triggers Smoking Barrel (BigShotPower: +N Vigor per Dead On activation)
 * - Flags ComboPower return-to-hand for first N Dead On cards triggered each turn
 */
export function onHermitDeadOnTriggered(
  state,
  cardInstance,
  stats,
  times,
  { dealDamageToEnemyFn = null } = {}
) {
  const combat = state?.combat;
  if (!combat || !Number.isFinite(times) || times <= 0) return { returnToHandByCombo: false };

  combat.lastCardTriggeredDeadOn = true;
  combat.deadOnTriggeredThisTurn = (combat.deadOnTriggeredThisTurn ?? 0) + times;
  combat.deadOnTriggeredThisCombat = (combat.deadOnTriggeredThisCombat ?? 0) + times;

  if ((state.player?.statuses?.snipe ?? 0) > 0) {
    state.player.statuses.snipe -= 1;
    if (state.player.statuses.snipe <= 0) {
      delete state.player.statuses.snipe;
    }
    pushCombatLog(combat, `【狙击】生效：【${stats.name}】的【精准】效果触发 ${times} 次！`, 'status');
  }

  const smokingAmt = state.player?.statuses?.smokingBarrel ?? 0;
  if (smokingAmt > 0) {
    const vigorGain = smokingAmt * times;
    applyStatus(state.player, 'vigor', vigorGain);
    pushCombatLog(combat, `【冒烟枪管】触发：下次攻击额外造成 ${vigorGain} 点伤害！`, 'status');
  }

  if (hasRelic(state, 'black_powder') && typeof dealDamageToEnemyFn === 'function') {
    for (let t = 0; t < times; t += 1) {
      const alive = getAliveEnemies(combat);
      if (alive.length === 0 || combat.status !== 'ongoing') break;
      pushCombatLog(
        combat,
        `遗物【${RELIC_LIBRARY.black_powder.name}】爆裂：对所有敌人造成 2 点伤害！`,
        'attack'
      );
      for (const enemy of alive) {
        dealDamageToEnemyFn(state, enemy, 2, { isAttack: false });
      }
    }
  }

  let returnToHandByCombo = false;
  const comboLimit = state.player?.statuses?.combo ?? 0;
  if (comboLimit > 0 && (combat.comboUsedThisTurn ?? 0) < comboLimit && !stats.exhaust) {
    combat.comboUsedThisTurn = (combat.comboUsedThisTurn ?? 0) + 1;
    returnToHandByCombo = true;
  }

  return { returnToHandByCombo };
}

/**
 * Handles Hermit triggers when a Curse card is drawn into hand:
 * - Shadow Cloak: gain Block on Curse draw
 * - Charred Glove: gain +3 Vigor (next attack +3 damage)
 * - Clasped Locket: first Curse drawn each turn is exhausted immediately and draws 2 cards
 */
export function handleHermitCurseDrawn(
  state,
  cardInstance,
  cardStats,
  { addPlayerBlockFn = null, exhaustCardsBatchFn = null } = {}
) {
  const combat = state?.combat;
  if (!combat || !cardInstance || cardStats?.type !== 'curse') {
    return { exhaustedByLocket: false, bonusDraw: 0 };
  }

  const shadowAmt = state.player?.statuses?.shadowCloak ?? 0;
  if (shadowAmt > 0 && typeof addPlayerBlockFn === 'function') {
    const gained = addPlayerBlockFn(state, shadowAmt);
    if (gained > 0) {
      pushCombatLog(
        combat,
        `【暗影斗篷】触发：抽到诅咒【${cardStats.name}】，获得 ${gained} 点格挡！`,
        'block'
      );
    }
  }

  if (hasRelic(state, 'charred_glove')) {
    applyStatus(state.player, 'vigor', 3);
    pushCombatLog(
      combat,
      `遗物【${RELIC_LIBRARY.charred_glove.name}】触发：抽到诅咒，下次攻击伤害 +3！`,
      'status'
    );
  }

  if (
    hasRelic(state, 'clasped_locket') &&
    !combat.claspedLocketUsedThisTurn &&
    typeof exhaustCardsBatchFn === 'function'
  ) {
    const hIdx = combat.hand.findIndex((c) => c.instanceId === cardInstance.instanceId);
    if (hIdx !== -1) {
      combat.claspedLocketUsedThisTurn = true;
      combat.hand.splice(hIdx, 1);
      pushCombatLog(
        combat,
        `遗物【${RELIC_LIBRARY.clasped_locket.name}】触发：消耗抽到的诅咒【${cardStats.name}】并额外抽 2 张牌！`,
        'info'
      );
      exhaustCardsBatchFn(state, [cardInstance]);
      return { exhaustedByLocket: true, bonusDraw: 2 };
    }
  }

  return { exhaustedByLocket: false, bonusDraw: 0 };
}

/**
 * Handles Hermit triggers when a Curse card is exhausted (Shadow Cloak).
 */
export function handleHermitCurseExhausted(state, cardStats, { addPlayerBlockFn = null } = {}) {
  const combat = state?.combat;
  if (!combat || cardStats?.type !== 'curse') return 0;
  const shadowAmt = state.player?.statuses?.shadowCloak ?? 0;
  if (shadowAmt > 0 && typeof addPlayerBlockFn === 'function') {
    const gained = addPlayerBlockFn(state, shadowAmt);
    if (gained > 0) {
      pushCombatLog(
        combat,
        `【暗影斗篷】触发：消耗诅咒【${cardStats.name}】，获得 ${gained} 点格挡！`,
        'block'
      );
    }
    return gained;
  }
  return 0;
}

/**
 * Combat start Turn 1 Hermit relic triggers (Old Locket / Memento).
 */
export function handleHermitTurn1StartHooks(state, { addCardsToHandFn = null } = {}) {
  const combat = state?.combat;
  if (!combat || combat.turn !== 1) return;
  if (hasRelic(state, 'memento') && CARD_LIBRARY.memento_curse && typeof addCardsToHandFn === 'function') {
    addCardsToHandFn(state, 'memento_curse', 1, false);
    pushCombatLog(
      combat,
      `遗物【${RELIC_LIBRARY.memento.name}】生效：将 1 张【${CARD_LIBRARY.memento_curse.name}】加入手牌。`,
      'info'
    );
  }
}

/**
 * Turn-start Hermit bookkeeping & powers.
 */
export function handleHermitTurnStartHooks(
  state,
  { addCardsToHandFn = null, triggerSadisticNatureFn = null } = {}
) {
  const combat = state?.combat;
  if (!combat) return { bonusEnergy: 0, bonusDraw: 0 };

  combat.claspedLocketUsedThisTurn = false;
  combat.lastCardTriggeredDeadOn = false;
  combat.deadOnTriggeredThisTurn = 0;
  combat.comboUsedThisTurn = 0;

  let bonusEnergy = 0;
  let bonusDraw = 0;

  // Dented Plate: while HP <= 50%, gain +1 Energy and draw +1 card at turn start
  if (
    hasRelic(state, 'dented_plate') &&
    state.player.hp > 0 &&
    state.player.hp <= Math.floor(state.player.maxHp * 0.5)
  ) {
    bonusEnergy += 1;
    bonusDraw += 1;
    pushCombatLog(
      combat,
      `遗物【${RELIC_LIBRARY.dented_plate.name}】生效（生命 ≤ 50%）：获得 1 点能量并额外抽 1 张牌！`,
      'info'
    );
  }

  // Take Aim: Concentrate at start of turn
  if ((state.player.statuses?.takeAim ?? 0) > 0) {
    state.player.statuses.concentration = 1;
    pushCombatLog(combat, '【举枪瞄准】触发：本回合获得【专注】！', 'status');
  }

  // Brawl: Apply Bruise to all enemies at start of turn
  const brawlAmt = state.player.statuses?.brawl ?? 0;
  if (brawlAmt > 0) {
    const alive = getAliveEnemies(combat);
    for (const enemy of alive) {
      if (applyStatus(enemy, 'bruise', brawlAmt)) {
        if (typeof triggerSadisticNatureFn === 'function') triggerSadisticNatureFn(state, enemy);
      } else {
        pushCombatLog(combat, `【${enemy.name}】的【人工制品】抵消了【斗殴】的【瘀伤】！`, 'status');
      }
    }
    if (alive.length > 0) {
      pushCombatLog(combat, `【斗殴】触发：给予所有敌人 ${brawlAmt} 层【瘀伤】！`, 'status');
    }
  }

  // Fatal Desire: Draw N cards and add N Injury to hand
  const fatalDesireAmt = state.player.statuses?.fatalDesire ?? 0;
  if (fatalDesireAmt > 0) {
    bonusDraw += fatalDesireAmt;
    if (typeof addCardsToHandFn === 'function') {
      addCardsToHandFn(state, 'injury', fatalDesireAmt, false);
    }
    pushCombatLog(
      combat,
      `【自弑之欲】触发：额外抽 ${fatalDesireAmt} 张牌，并将 ${fatalDesireAmt} 张【受伤】加入手牌！`,
      'status'
    );
  }

  // Drained: Lose Energy at start of turn (applied by some Hermit cards)
  const drainedAmt = state.player.statuses?.drained ?? 0;
  if (drainedAmt > 0) {
    delete state.player.statuses.drained;
    bonusEnergy -= drainedAmt;
    pushCombatLog(combat, `【力尽】生效：本回合减少 ${drainedAmt} 点能量。`, 'status');
  }

  return { bonusEnergy, bonusDraw };
}

/**
 * End-of-player-turn Hermit triggers (before hand discard):
 * - Impending Doom in hand at Dead On position -> 13 thorns damage to player and all enemies
 * - Concentration wears off (triggers Spyglass +1 Energy next turn if still Concentrated)
 * - Snipe wears off
 * - Coalescence wears off (after retain choice already resolved)
 * - Overwhelming Power HP loss if ending turn at 0 Energy
 * - Brass Tacks (+2 Block at end of turn)
 */
export function handleHermitEndOfTurnHooks(
  state,
  { dealDamageToPlayerFn = null, dealDamageToEnemyFn = null, losePlayerHpFn = null, addPlayerBlockFn = null } = {}
) {
  const combat = state?.combat;
  if (!combat || combat.status !== 'ongoing') return;

  // Impending Doom: if in hand at Dead On position at end of turn, deal 13 thorns damage to EVERYONE
  const handSnapshot = [...combat.hand];
  for (let i = 0; i < handSnapshot.length; i += 1) {
    if (state.player.hp <= 0 || combat.status !== 'ongoing') break;
    const c = handSnapshot[i];
    const cStats = getCardStats(c);
    if (cStats.endOfTurnDeadOnDamageAll && isHandIndexDeadOn(i, handSnapshot.length)) {
      const dmg = cStats.endOfTurnDeadOnDamageAll;
      pushCombatLog(
        combat,
        `手牌【${cStats.name}】位于【精准】位置：对所有单位造成 ${dmg} 点伤害！`,
        'damage'
      );
      if (typeof dealDamageToPlayerFn === 'function') {
        dealDamageToPlayerFn(state, dmg, `手牌【${cStats.name}】`, { isAttack: false, fromCard: true });
      }
      if (typeof dealDamageToEnemyFn === 'function' && state.player.hp > 0) {
        for (const enemy of getAliveEnemies(combat)) {
          dealDamageToEnemyFn(state, enemy, dmg, { isAttack: false });
        }
      }
    }
  }

  if (state.player.hp <= 0 || combat.status !== 'ongoing') return;

  // Overwhelming Power: if ending turn with 0 Energy, lose N HP
  const overAmt = state.player.statuses?.overwhelmingPower ?? 0;
  if (overAmt > 0 && (state.player.energy ?? 0) <= 0 && typeof losePlayerHpFn === 'function') {
    losePlayerHpFn(state, overAmt, '压倒性力量', { fromCard: false });
  }

  if (state.player.hp <= 0 || combat.status !== 'ongoing') return;

  // Concentration wears off at end of turn (Spyglass grants +1 Energy next turn if still Concentrated)
  if ((state.player.statuses?.concentration ?? 0) > 0) {
    delete state.player.statuses.concentration;
    if (hasRelic(state, 'spyglass')) {
      applyStatus(state.player, 'energized', 1);
      pushCombatLog(
        combat,
        `遗物【${RELIC_LIBRARY.spyglass.name}】触发：携【专注】结束回合，下回合额外获得 1 点能量！`,
        'info'
      );
    }
  }

  delete state.player.statuses.snipe;
  delete state.player.statuses.coalescence;
  delete state.player.statuses.ryeStalkRetain;

  // Brass Tacks: gain 2 Block at end of turn
  if (hasRelic(state, 'brass_tacks') && typeof addPlayerBlockFn === 'function') {
    const gain = addPlayerBlockFn(state, 2);
    if (gain > 0) {
      pushCombatLog(
        combat,
        `遗物【${RELIC_LIBRARY.brass_tacks.name}】生效：回合结束获得 ${gain} 点格挡。`,
        'block'
      );
    }
  }
}

/**
 * Enemy-turn-start Hermit status ticks:
 * - Bruise clears at the start of the enemy's turn unless Horror > 0 (in which case Horror decrements by 1).
 */
export function handleEnemyTurnStartHermitHooks(state, enemy) {
  const combat = state?.combat;
  if (!combat || !enemy || enemy.hp <= 0 || !enemy.statuses) return;
  if ((enemy.statuses.bruise ?? 0) > 0) {
    if ((enemy.statuses.horror ?? 0) > 0) {
      enemy.statuses.horror -= 1;
      if (enemy.statuses.horror <= 0) {
        delete enemy.statuses.horror;
      }
      pushCombatLog(
        combat,
        `【${enemy.name}】受【恐惧】震慑，【瘀伤】未消退！`,
        'status'
      );
    } else {
      delete enemy.statuses.bruise;
    }
  } else if ((enemy.statuses.horror ?? 0) > 0) {
    enemy.statuses.horror -= 1;
    if (enemy.statuses.horror <= 0) {
      delete enemy.statuses.horror;
    }
  }
}

/**
 * Adds a high-caliber upgraded Strike (+2 = 12 dmg, +3 = 15 dmg) to hand.
 */
export function createHighCaliberStrikeInHand(state, plusLevel = 2) {
  const combat = state?.combat;
  if (!combat || !CARD_LIBRARY.strike) return null;
  const strike = createCardInstance(state, 'strike', true);
  // Base Strike = 6, Strike+ = 9 (+3). Each extra upgrade level adds +3 damage (Strike+2 = 12, Strike+3 = 15).
  const extraLevels = Math.max(1, Math.floor(plusLevel) - 1);
  strike.combatDamageMod = extraLevels * 3;
  strike.displayUpgradePlus = Math.floor(plusLevel);
  if (combat.hand.length < MAX_HAND_SIZE) {
    combat.hand.push(strike);
  } else {
    combat.discardPile.push(strike);
  }
  pushCombatLog(
    combat,
    `将 1 张【打击+${Math.floor(plusLevel)}】（${9 + strike.combatDamageMod} 点伤害）加入${combat.hand.includes(strike) ? '手牌' : '弃牌堆'}！`,
    'info'
  );
  return strike;
}
