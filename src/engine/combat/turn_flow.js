/**
 * Combat lifecycle & turn choreography: startCombat, startPlayerTurn, restartCombat,
 * confirmPendingCardChoice, and endPlayerTurn (including enemy intent execution).
 */

import {
  CARD_LIBRARY,
  GENERATABLE_COLORLESS_CARD_IDS,
  createCardInstance,
  getCardCharacter,
  getCardStats,
  isGeneratableCombatCard,
} from '../../data/cards.js';
import {
  createEnemyInstance,
  drawGremlinGang,
  resolveEncounterSpecs,
  rollEnemyIntent,
} from '../../data/enemies.js';
import { RELIC_LIBRARY, STATUS_METADATA } from '../../data/relics.js';
import { hasDailyModifier } from '../daily.js';
import { calculateAttackDamage } from '../math.js';
import { pickRandom, randomInt, shuffled } from '../rng.js';
import {
  MAX_HAND_SIZE,
  BASE_DRAW_PER_TURN,
  VELVET_CHOKER_CARD_LIMIT,
  pushCardReveal,
  hasRelic,
  healPlayerInCombat,
  getAliveEnemies,
  pushCombatLog,
  applyStatus,
  decayRoundStatuses,
  addCardsToHand,
  syncRedSkullStatus,
  handleEnemyZeroHp,
  pruneDefeatedEnemies,
  reshuffleDiscardIntoDraw,
  applyEnemyInvincibleCap,
  checkSlimeSplitTrigger,
  setPendingCardChoice,
  hasPendingCardChoice,
  getActivePendingCardChoice,
  invokePlayCard,
  registerEndPlayerTurnHandler,
  getPendingChoiceBlockReason,
  requestEndTurnRetainChoice,
  returnDiscardCardsByFlag,
  captureCombatSnapshot,
  finalizeCombatVictory,
} from './state.js';
import {
  addPlayerBlock,
  triggerChampionBeltIfVulnerable,
  triggerSadisticNature,
  applyPoisonToEnemy,
  handleEnemyDeathPassives,
  flushPostChoiceQueues,
  drawCards,
  dealDamageToEnemy,
  dealDamageToPlayer,
  losePlayerHp,
  requestManualDiscard,
  changeStance,
  gainMantra,
  initiateScry,
  confirmScryChoice,
  exhaustCardsBatch,
} from './resolution.js';
import {
  channelOrb,
  gainOrbSlots,
  triggerStartOfTurnOrbs,
  triggerEndOfTurnOrbs,
} from './orbs.js';
import {
  handleEnemyTurnStartHermitHooks,
  handleHermitEndOfTurnHooks,
  handleHermitTurn1StartHooks,
  handleHermitTurnStartHooks,
} from './hermit_mechanics.js';

export function confirmPendingCardChoice(state, explicitIds = null, onVictoryCallback = null) {
  const result = confirmPendingCardChoiceInner(state, explicitIds, onVictoryCallback);
  if (result?.ok) {
    flushPostChoiceQueues(state, onVictoryCallback);
  }
  return result;
}

function confirmPendingCardChoiceInner(state, explicitIds = null, onVictoryCallback = null) {
  const combat = state?.combat;
  const pending = getActivePendingCardChoice(combat);
  if (
    !combat ||
    state.screen !== 'combat' ||
    combat.status !== 'ongoing' ||
    combat.phase !== 'player' ||
    !pending
  ) {
    return { ok: false, reason: '当前没有待确认的选牌操作' };
  }

  if (pending.mode === 'scry') {
    return confirmScryChoice(state, explicitIds, onVictoryCallback);
  }

  const candidateIds = new Set((pending.candidates || []).map((c) => c.instanceId));
  const rawIds = Array.isArray(explicitIds) ? explicitIds : pending.selectedIds || [];
  const uniqueValidIds = [];
  for (const id of rawIds) {
    if (candidateIds.has(id) && !uniqueValidIds.includes(id)) {
      uniqueValidIds.push(id);
      if (uniqueValidIds.length >= pending.count) break;
    }
  }

  if (pending.mode === 'retrieve_discard_retain') {
    const pickedNames = [];
    for (const id of uniqueValidIds) {
      if (combat.hand.length >= MAX_HAND_SIZE) break;
      const dIdx = combat.discardPile.findIndex((c) => c.instanceId === id);
      if (dIdx === -1) continue;
      const [card] = combat.discardPile.splice(dIdx, 1);
      if (card) {
        card.tempRetainTurn = true;
        combat.hand.push(card);
        pickedNames.push(getCardStats(card).name);
      }
    }
    const shouldEndTurn = Boolean(pending.endTurnAfter);
    const sourceName = pending.sourceName;
    setPendingCardChoice(combat, null);

    if (pickedNames.length > 0) {
      pushCombatLog(
        combat,
        `【${sourceName}】从弃牌堆取回并保留：${pickedNames.map((n) => `【${n}】`).join('、')}。`,
        'info'
      );
    } else {
      pushCombatLog(combat, `【${sourceName}】未从弃牌堆取回卡牌。`, 'info');
    }

    if (shouldEndTurn && getAliveEnemies(combat).length > 0 && state.player.hp > 0 && combat.status === 'ongoing') {
      pushCombatLog(combat, `【${sourceName}】落下终章，自动结束本回合。`, 'info');
      return endPlayerTurn(state, onVictoryCallback);
    }

    return {
      ok: true,
      mode: 'retrieve_discard_retain',
      retrievedCount: pickedNames.length,
      outcome: state.combat?.status ?? combat.status,
    };
  }

  if (pending.mode === 'retain') {
    const retainedNames = [];
    for (const id of uniqueValidIds) {
      const card = combat.hand.find((c) => c.instanceId === id);
      if (card) {
        card.tempRetainTurn = true;
        retainedNames.push(getCardStats(card).name);
      }
    }
    const sourceName = pending.sourceName;
    setPendingCardChoice(combat, null);

    if (retainedNames.length > 0) {
      pushCombatLog(
        combat,
        `【${sourceName}】选择保留至下回合：${retainedNames.map((n) => `【${n}】`).join('、')}。`,
        'info'
      );
    }

    return endPlayerTurn(state, onVictoryCallback, { skipWellLaidPlansPrompt: true });
  }

  if (pending.mode === 'exhaust_multi') {
    const sourceName = pending.sourceName || '净化';
    const pickedCards = [];
    for (const id of uniqueValidIds) {
      const hIdx = combat.hand.findIndex((c) => c.instanceId === id);
      if (hIdx === -1) continue;
      const [card] = combat.hand.splice(hIdx, 1);
      if (card) pickedCards.push(card);
    }
    setPendingCardChoice(combat, null);
    if (pickedCards.length > 0) {
      exhaustCardsBatch(state, pickedCards);
      if (getAliveEnemies(combat).length === 0 && state.player.hp > 0) {
        finalizeCombatVictory(state, onVictoryCallback);
      }
    } else {
      pushCombatLog(combat, `【${sourceName}】未消耗任何手牌。`, 'info');
    }
    return {
      ok: true,
      mode: 'exhaust_multi',
      exhaustedCount: pickedCards.length,
      outcome: state.combat?.status ?? combat.status,
    };
  }

  if (pending.mode === 'hand_to_draw_bottom_multi') {
    const sourceName = pending.sourceName || '预谋';
    const zeroCost = Boolean(pending.zeroCostUntilPlayed);
    const movedNames = [];
    for (const id of uniqueValidIds) {
      const hIdx = combat.hand.findIndex((c) => c.instanceId === id);
      if (hIdx === -1) continue;
      const [card] = combat.hand.splice(hIdx, 1);
      if (card) {
        if (zeroCost && !getCardStats(card).isXCost && !getCardStats(card).unplayable) {
          card.zeroCostUntilPlayed = true;
        }
        combat.drawPile.push(card);
        movedNames.push(getCardStats(card).name);
      }
    }
    setPendingCardChoice(combat, null);
    if (movedNames.length > 0) {
      pushCombatLog(
        combat,
        `【${sourceName}】将${movedNames.map((n) => `【${n}】`).join('、')}置于抽牌堆底${zeroCost ? '（打出前 0 费）' : ''}！`,
        'info'
      );
    }
    return {
      ok: true,
      mode: 'hand_to_draw_bottom_multi',
      movedCount: movedNames.length,
      outcome: state.combat?.status ?? combat.status,
    };
  }

  if (pending.mode === 'discard_to_draw') {
    const movedNames = [];
    for (const id of uniqueValidIds) {
      const dIdx = combat.discardPile.findIndex((c) => c.instanceId === id);
      if (dIdx === -1) continue;
      const [card] = combat.discardPile.splice(dIdx, 1);
      if (card) {
        combat.drawPile.unshift(card);
        movedNames.push(getCardStats(card).name);
      }
    }
    const sourceName = pending.sourceName;
    setPendingCardChoice(combat, null);
    if (movedNames.length > 0) {
      pushCombatLog(
        combat,
        `【${sourceName}】将弃牌堆中的${movedNames.map((n) => `【${n}】`).join('、')}置于抽牌堆顶。`,
        'info'
      );
    }
    return {
      ok: true,
      mode: 'discard_to_draw',
      movedCount: movedNames.length,
      outcome: state.combat?.status ?? combat.status,
    };
  }

  if (pending.mode === 'retrieve_discard_to_hand') {
    const pickedNames = [];
    for (const id of uniqueValidIds) {
      if (combat.hand.length >= MAX_HAND_SIZE) break;
      const dIdx = combat.discardPile.findIndex((c) => c.instanceId === id);
      if (dIdx === -1) continue;
      const [card] = combat.discardPile.splice(dIdx, 1);
      if (card) {
        combat.hand.push(card);
        pickedNames.push(getCardStats(card).name);
      }
    }
    const sourceName = pending.sourceName;
    setPendingCardChoice(combat, null);
    if (pickedNames.length > 0) {
      pushCombatLog(
        combat,
        `【${sourceName}】从弃牌堆取回：${pickedNames.map((n) => `【${n}】`).join('、')}。`,
        'info'
      );
    }
    return {
      ok: true,
      mode: 'retrieve_discard_to_hand',
      retrievedCount: pickedNames.length,
      outcome: state.combat?.status ?? combat.status,
    };
  }

  if (pending.mode === 'pick_from_draw') {
    const pickedNames = [];
    for (const id of uniqueValidIds) {
      if (combat.hand.length >= MAX_HAND_SIZE) break;
      const dIdx = combat.drawPile.findIndex((c) => c.instanceId === id);
      if (dIdx === -1) continue;
      const [card] = combat.drawPile.splice(dIdx, 1);
      if (card) {
        combat.hand.push(card);
        pickedNames.push(getCardStats(card).name);
      }
    }
    const sourceName = pending.sourceName;
    setPendingCardChoice(combat, null);
    if (pickedNames.length > 0) {
      pushCombatLog(
        combat,
        `【${sourceName}】从抽牌堆检索：${pickedNames.map((n) => `【${n}】`).join('、')}。`,
        'info'
      );
    }
    return {
      ok: true,
      mode: 'pick_from_draw',
      retrievedCount: pickedNames.length,
      outcome: state.combat?.status ?? combat.status,
    };
  }

  return { ok: false, reason: '当前选牌模式不支持统一确认' };
}

export function startPlayerTurn(state, onVictoryCallback = null) {
  const combat = state.combat;
  if (!combat || combat.status !== 'ongoing') return;

  const prevTurnTransition = combat._pendingTurnSummary || null;
  delete combat._pendingTurnSummary;
  const reshuffleBeforeTurn = prevTurnTransition
    ? (prevTurnTransition.reshuffleCountBefore ?? 0)
    : (combat.reshuffleCount ?? 0);

  combat.turn += 1;
  combat.phase = 'player';
  combat.cardsPlayedThisTurn = 0;
  combat.attacksPlayedThisTurn = 0;
  combat.skillsPlayedThisTurn = 0;
  combat.discardedThisTurn = 0;
  combat.hoveringKiteUsedThisTurn = false;
  combat.clayTriggersThisTurn = 0;
  combat.panacheCounter = 0;
  combat.shurikenCounter = 0;
  combat.kunaiCounter = 0;
  combat.ornamentalFanCounter = 0;
  combat.rushdownTriggersThisTurn = 0;
  combat.echoFormUsedThisTurn = 0;
  combat.lostHpLastTurn = Boolean(combat.lostHpThisTurn);
  combat.lostHpThisTurn = false;
  combat.playedCardTypesThisTurn = { attack: false, skill: false, power: false };
  setPendingCardChoice(combat, null);
  delete state.player.statuses.flameBarrier;
  delete state.player.statuses.rage;
  delete state.player.statuses.doubleTap;
  delete state.player.statuses.duplication;
  delete state.player.statuses.waveOfTheHand;
  delete state.player.statuses.doubleDamage;
  delete state.player.statuses.amplify;
  delete state.player.statuses.equilibrium;
  delete state.player.statuses.rebound;
  for (const e of combat.enemies || []) {
    if (e.slowStacks) e.slowStacks = 0;
    if (e.statuses?.choke) delete e.statuses.choke;
  }

  // Incense Burner ticks before Blasphemy so Intangible on counter 5 -> 0 saves the player!
  if (!state.relicCounters) state.relicCounters = {};
  if (hasRelic(state, 'incense_burner')) {
    const next = ((state.relicCounters.incense_burner ?? 0) + 1) % 6;
    state.relicCounters.incense_burner = next;
    if (next === 0) {
      applyStatus(state.player, 'intangible', 1);
      pushCombatLog(
        combat,
        `遗物【${RELIC_LIBRARY.incense_burner.name}】清烟缭绕（每 6 回合）：获得 1 层【无实体】！`,
        'status'
      );
    }
  }

  // Phantasmal Killer: activates Double Damage for this turn
  if ((state.player.statuses.phantasmal ?? 0) > 0) {
    state.player.statuses.phantasmal -= 1;
    if (state.player.statuses.phantasmal <= 0) {
      delete state.player.statuses.phantasmal;
    }
    state.player.statuses.doubleDamage = 1;
    pushCombatLog(combat, '【幻影杀手】触发：本回合所有攻击伤害翻倍（×2）！', 'status');
  }

  // Blasphemy lethal oath triggers at start of next player turn (Intangible reduces to 1; Buffer blocks)
  if ((state.player.statuses.blasphemer ?? 0) > 0) {
    delete state.player.statuses.blasphemer;
    const isIntangible = (state.player.statuses.intangible ?? 0) > 0;
    const oathDmg = isIntangible ? 1 : 999;
    pushCombatLog(
      combat,
      isIntangible ? '【渎神誓约】反噬降临，但【无实体】将其降至 1 点！' : '【渎神誓约】反噬降临！',
      'damage'
    );
    losePlayerHp(state, oathDmg, '渎神誓约');
    if (state.player.hp <= 0 || combat.status !== 'ongoing') {
      return;
    }
  }

  // Divinity automatically exits back to Neutral at start of player turn
  if (combat.stance === 'divinity') {
    changeStance(state, 'neutral');
  }

  const hasBarricade = (state.player.statuses.barricade ?? 0) > 0;
  const blurTurns = state.player.statuses.blur ?? 0;
  if (hasBarricade || blurTurns > 0) {
    if (state.player.block > 0) {
      pushCombatLog(
        combat,
        hasBarricade
          ? `【壁垒】保留了 ${state.player.block} 点格挡。`
          : `【残影】保留了 ${state.player.block} 点格挡。`,
        'block'
      );
    }
  } else if (hasRelic(state, 'calipers')) {
    if (state.player.block > 0) {
      const beforeBlock = state.player.block;
      state.player.block = Math.max(0, state.player.block - 15);
      const kept = state.player.block;
      pushCombatLog(
        combat,
        kept > 0
          ? `遗物【${RELIC_LIBRARY.calipers.name}】生效：仅失去 15 点格挡，保留 ${kept} 点格挡（原 ${beforeBlock}）。`
          : `遗物【${RELIC_LIBRARY.calipers.name}】触发：格挡降至 0（原 ${beforeBlock} ≤ 15）。`,
        kept > 0 ? 'block' : 'info'
      );
    }
  } else {
    state.player.block = 0;
  }
  if (blurTurns > 0) {
    if (blurTurns - 1 <= 0) {
      delete state.player.statuses.blur;
    } else {
      state.player.statuses.blur = blurTurns - 1;
    }
  }

  const energyPenalty = state.player.statuses.energyDownEachTurn ?? 0;
  state.player.energy = Math.max(0, state.player.maxEnergy - energyPenalty);
  if (energyPenalty > 0) {
    pushCombatLog(combat, `【斋戒】生效：本回合初始能量减少 ${energyPenalty} 点。`, 'status');
  }

  if ((state.player.statuses.berserk ?? 0) > 0) {
    const bGain = state.player.statuses.berserk;
    state.player.energy += bGain;
    pushCombatLog(combat, `【狂暴】生效：额外获得 ${bGain} 点能量！`, 'info');
  }

  if (hasRelic(state, 'slavers_collar') && (combat.role === 'elite' || combat.role === 'boss')) {
    state.player.energy += 1;
    pushCombatLog(
      combat,
      `遗物【${RELIC_LIBRARY.slavers_collar.name}】生效（强敌战）：额外获得 1 点能量！`,
      'info'
    );
  }

  if (combat.turn > 1 && hasRelic(state, 'art_of_war') && !combat.playedAttackLastTurn) {
    state.player.energy += 1;
    pushCombatLog(
      combat,
      `遗物【${RELIC_LIBRARY.art_of_war.name}】生效（上回合未攻击）：额外获得 1 点能量！`,
      'info'
    );
  }

  if ((state.player.statuses.devaForm ?? 0) > 0) {
    const devaGain = state.player.statuses.devaForm;
    state.player.energy += devaGain;
    state.player.statuses.devaForm = devaGain + 1;
    pushCombatLog(
      combat,
      `【天人形态】生效：额外获得 ${devaGain} 点能量（下回合 +${devaGain + 1}）！`,
      'info'
    );
  }

  if (hasRelic(state, 'happy_flower')) {
    const next = ((state.relicCounters.happy_flower ?? 0) + 1) % 3;
    state.relicCounters.happy_flower = next;
    if (next === 0) {
      state.player.energy += 1;
      pushCombatLog(
        combat,
        `遗物【${RELIC_LIBRARY.happy_flower.name}】绽放（每 3 回合）：获得 1 点能量！`,
        'info'
      );
    }
  }

  if ((state.player.statuses.nextTurnBlock ?? 0) > 0) {
    const ntb = state.player.statuses.nextTurnBlock;
    delete state.player.statuses.nextTurnBlock;
    addPlayerBlock(state, ntb);
    pushCombatLog(combat, `【下回合格挡】生效：获得 ${ntb} 点格挡。`, 'block');
  }
  if ((state.player.statuses.energized ?? 0) > 0) {
    const energizedGain = state.player.statuses.energized;
    delete state.player.statuses.energized;
    state.player.energy += energizedGain;
    pushCombatLog(combat, `【精力充沛】生效：额外获得 ${energizedGain} 点能量。`, 'info');
  }

  if (combat.turn === 1) {
    if (hasRelic(state, 'anchor')) {
      addPlayerBlock(state, 10);
      pushCombatLog(combat, `遗物【${RELIC_LIBRARY.anchor.name}】生效：获得 10 点格挡。`, 'block');
    }
    if (hasRelic(state, 'lantern')) {
      state.player.energy += 1;
      pushCombatLog(combat, `遗物【${RELIC_LIBRARY.lantern.name}】生效：获得 1 点能量。`, 'info');
    }
    if (hasDailyModifier(state, 'time_dilation')) {
      state.player.energy += 1;
      pushCombatLog(combat, '每日词条【先发制人】生效：第 1 回合额外获得 1 点能量并多抽 1 张牌！', 'info');
    }
  } else if (combat.turn === 2 && hasRelic(state, 'horn_cleat')) {
    addPlayerBlock(state, 14);
    pushCombatLog(combat, `遗物【${RELIC_LIBRARY.horn_cleat.name}】生效：获得 14 点格挡。`, 'block');
  } else if (combat.turn === 3 && hasRelic(state, 'captains_wheel')) {
    addPlayerBlock(state, 18);
    pushCombatLog(combat, `遗物【${RELIC_LIBRARY.captains_wheel.name}】生效：获得 18 点格挡。`, 'block');
  }

  if (getAliveEnemies(combat).length === 0 && state.player.hp > 0) {
    finalizeCombatVictory(state, onVictoryCallback);
    return;
  }

  if (hasRelic(state, 'mercury_hourglass')) {
    const alive = getAliveEnemies(combat);
    if (alive.length > 0) {
      pushCombatLog(combat, `遗物【${RELIC_LIBRARY.mercury_hourglass.name}】对所有敌人造成 3 点伤害。`, 'attack');
      for (const enemy of alive) {
        dealDamageToEnemy(state, enemy, 3, { isAttack: false });
      }
      if (getAliveEnemies(combat).length === 0 && state.player.hp > 0) {
        finalizeCombatVictory(state, onVictoryCallback);
        return;
      }
    }
  }

  if (hasRelic(state, 'brimstone')) {
    applyStatus(state.player, 'strength', 2);
    for (const enemy of getAliveEnemies(combat)) {
      applyStatus(enemy, 'strength', 1);
    }
    pushCombatLog(
      combat,
      `遗物【${RELIC_LIBRARY.brimstone.name}】沸腾：你获得 2 点【力量】，所有敌人获得 1 点【力量】！`,
      'status'
    );
  }

  if ((state.player.statuses.demonForm ?? 0) > 0) {
    const gain = state.player.statuses.demonForm;
    applyStatus(state.player, 'strength', gain);
    pushCombatLog(combat, `【恶魔形态】生效：获得 ${gain} 点力量。`, 'status');
  }

  if ((state.player.statuses.wraithForm ?? 0) > 0) {
    const drop = state.player.statuses.wraithForm;
    applyStatus(state.player, 'dexterity', -drop);
    pushCombatLog(combat, `【幽魂形态】副作用：失去 ${drop} 点敏捷。`, 'status');
  }

  if ((state.player.statuses.biasedCognition ?? 0) > 0) {
    const focusDrop = state.player.statuses.biasedCognition;
    applyStatus(state.player, 'focus', -focusDrop, { bypassArtifact: true });
    pushCombatLog(combat, `【偏差认知】衰减：失去 ${focusDrop} 点【集中】。`, 'status');
  }

  // Defect start-of-turn Orb passives (Inserter, Emotion Chip, Plasma +1E, Loop)
  triggerStartOfTurnOrbs(state);
  if (getAliveEnemies(combat).length === 0 && state.player.hp > 0) {
    finalizeCombatVictory(state, onVictoryCallback);
    return;
  }

  if ((state.player.statuses.noxiousFumes ?? 0) > 0) {
    const fumes = state.player.statuses.noxiousFumes;
    const alive = getAliveEnemies(combat);
    if (alive.length > 0) {
      pushCombatLog(combat, `【毒雾】弥漫，给予所有敌人 ${fumes} 层中毒。`, 'status');
      for (const enemy of alive) {
        applyPoisonToEnemy(state, enemy, fumes);
      }
      if (getAliveEnemies(combat).length === 0 && state.player.hp > 0) {
        finalizeCombatVictory(state, onVictoryCallback);
        return;
      }
    }
  }

  if ((state.player.statuses.infiniteBlades ?? 0) > 0) {
    addCardsToHand(state, 'shiv', state.player.statuses.infiniteBlades, false);
  }

  if (Array.isArray(combat.nightmareQueue) && combat.nightmareQueue.length > 0) {
    const entries = combat.nightmareQueue.splice(0);
    delete state.player.statuses.nightmare;
    for (const entry of entries) {
      let addedToHand = 0;
      let addedToDiscard = 0;
      let cardLabel = CARD_LIBRARY[entry.cardId]?.name ?? entry.cardId;
      for (let n = 0; n < (entry.count || 3); n += 1) {
        const copy = createCardInstance(state, entry.cardId, Boolean(entry.upgraded));
        if (Number.isInteger(entry.upgradeLevel)) copy.upgradeLevel = entry.upgradeLevel;
        if (typeof entry.expungerHits === 'number') copy.expungerHits = entry.expungerHits;
        if (typeof entry.ritualBonus === 'number') copy.ritualBonus = entry.ritualBonus;
        cardLabel = getCardStats(copy).name;
        if (combat.hand.length < MAX_HAND_SIZE) {
          combat.hand.push(copy);
          addedToHand += 1;
        } else {
          combat.discardPile.push(copy);
          addedToDiscard += 1;
        }
      }
      pushCombatLog(
        combat,
        `【夜魇】降临：将 ${addedToHand} 张【${cardLabel}】加入手牌${addedToDiscard > 0 ? `（另有 ${addedToDiscard} 张溢入弃牌堆）` : ''}！`,
        'info'
      );
    }
  }

  if ((state.player.statuses.battleHymn ?? 0) > 0) {
    addCardsToHand(state, 'smite', state.player.statuses.battleHymn, false);
  }

  if ((state.player.statuses.collect ?? 0) > 0) {
    addCardsToHand(state, 'miracle', 1, true);
    state.player.statuses.collect -= 1;
    if (state.player.statuses.collect <= 0) {
      delete state.player.statuses.collect;
    }
    pushCombatLog(combat, '【收集】生效：将 1 张【奇迹+】加入手牌！', 'info');
  }

  if ((state.player.statuses.helloWorld ?? 0) > 0) {
    const commonDefectPool = Object.values(CARD_LIBRARY)
      .filter((c) => getCardCharacter(c) === 'defect' && c.rarity === 'common' && isGeneratableCombatCard(c))
      .map((c) => c.id);
    const hwCount = state.player.statuses.helloWorld;
    for (let h = 0; h < hwCount; h += 1) {
      const picked = pickRandom(state, commonDefectPool);
      if (picked) {
        addCardsToHand(state, picked, 1, false);
      }
    }
  }

  if ((state.player.statuses.creativeAi ?? 0) > 0) {
    const defectPowerPool = Object.values(CARD_LIBRARY)
      .filter((c) => getCardCharacter(c) === 'defect' && c.type === 'power' && isGeneratableCombatCard(c))
      .map((c) => c.id);
    const aiCount = state.player.statuses.creativeAi;
    for (let a = 0; a < aiCount; a += 1) {
      const picked = pickRandom(state, defectPowerPool);
      if (picked) {
        addCardsToHand(state, picked, 1, false);
      }
    }
  }

  if ((state.player.statuses.magnetism ?? 0) > 0) {
    const magCount = state.player.statuses.magnetism;
    for (let mg = 0; mg < magCount; mg += 1) {
      const picked = pickRandom(state, GENERATABLE_COLORLESS_CARD_IDS);
      if (picked) {
        addCardsToHand(state, picked, 1, false);
      }
    }
  }

  let brutalityDraw = 0;
  if ((state.player.statuses.brutality ?? 0) > 0) {
    brutalityDraw = state.player.statuses.brutality;
    losePlayerHp(state, brutalityDraw, '残暴', { fromCard: true });
    if (state.player.hp <= 0 || combat.status !== 'ongoing') {
      return;
    }
  }

  // Watcher start-of-turn Mantra & Stance triggers (Damaru, Devotion, Simmering Fury)
  if (hasRelic(state, 'damaru')) {
    gainMantra(state, 1);
  }
  if ((state.player.statuses.devotion ?? 0) > 0) {
    gainMantra(state, state.player.statuses.devotion);
  }

  let simmeringDraw = 0;
  if ((state.player.statuses.simmeringFury ?? 0) > 0) {
    simmeringDraw = state.player.statuses.simmeringFury;
    delete state.player.statuses.simmeringFury;
    pushCombatLog(combat, `【怒火中烧】爆发：进入【愤怒】并额外抽 ${simmeringDraw} 张牌！`, 'status');
    changeStance(state, 'wrath');
  }

  const bagDraw = combat.turn === 1 && hasRelic(state, 'bag_of_prep') ? 2 : 0;
  const snakeDraw = combat.turn === 1 && hasRelic(state, 'ring_of_the_snake') ? 2 : 0;
  const dailyT1Draw = combat.turn === 1 && hasDailyModifier(state, 'time_dilation') ? 1 : 0;
  const serpentDraw = hasRelic(state, 'ring_of_the_serpent') ? 1 : 0;
  const sneckoDraw = hasRelic(state, 'snecko_eye') ? 2 : 0;
  const machineLearningDraw = state.player.statuses.machineLearning ?? 0;
  const pocketwatchDraw =
    combat.turn > 1 && hasRelic(state, 'pocketwatch') && (combat.cardsPlayedLastTurn ?? 0) <= 3
      ? 3
      : 0;
  const toolsDraw = state.player.statuses.toolsOfTheTrade ?? 0;
  const hermitTurnBonus = handleHermitTurnStartHooks(state, {
    addCardsToHandFn: addCardsToHand,
    triggerSadisticNatureFn: triggerSadisticNature,
  });
  if (hermitTurnBonus.bonusEnergy !== 0) {
    state.player.energy = Math.max(0, state.player.energy + hermitTurnBonus.bonusEnergy);
  }
  let drawReductionPenalty = 0;
  if ((state.player.statuses.drawReduction ?? 0) > 0) {
    drawReductionPenalty = 1;
    state.player.statuses.drawReduction -= 1;
    if (state.player.statuses.drawReduction <= 0) {
      delete state.player.statuses.drawReduction;
    }
    pushCombatLog(combat, '【抽牌减少】生效：本回合少抽 1 张牌。', 'status');
  }
  const nextTurnDraw = state.player.statuses.drawCardNextTurn ?? 0;
  if (nextTurnDraw > 0) {
    delete state.player.statuses.drawCardNextTurn;
    pushCombatLog(combat, `【预谋抽牌】生效：额外抽 ${nextTurnDraw} 张牌。`, 'info');
  }
  if (pocketwatchDraw > 0) {
    pushCombatLog(
      combat,
      `遗物【${RELIC_LIBRARY.pocketwatch.name}】生效（上回合出牌 ≤ 3）：额外抽 ${pocketwatchDraw} 张牌！`,
      'info'
    );
  }

  if (snakeDraw > 0) {
    pushCombatLog(combat, `遗物【${RELIC_LIBRARY.ring_of_the_snake.name}】生效：第 1 回合额外抽 2 张牌。`, 'info');
  }
  if (serpentDraw > 0) {
    pushCombatLog(combat, `遗物【${RELIC_LIBRARY.ring_of_the_serpent.name}】生效：本回合额外抽 1 张牌。`, 'info');
  }

  const totalTurnDraw = Math.max(
    0,
    BASE_DRAW_PER_TURN +
      bagDraw +
      snakeDraw +
      dailyT1Draw +
      serpentDraw +
      sneckoDraw +
      machineLearningDraw +
      pocketwatchDraw +
      toolsDraw +
      nextTurnDraw +
      simmeringDraw +
      brutalityDraw +
      hermitTurnBonus.bonusDraw -
      drawReductionPenalty
  );

  const handBeforeTurnDraw = combat.hand.length;
  let pendingScryDraw = false;

  // Foresight: Scry before drawing turn cards (resumes turn draw via drawAfterScry)
  const foresightAmt = state.player.statuses.foresight ?? 0;
  if (foresightAmt > 0 && combat.drawPile.length > 0 && toolsDraw === 0) {
    pendingScryDraw = true;
    initiateScry(state, foresightAmt, '先见之明', { drawAfterScry: totalTurnDraw });
  } else {
    if (foresightAmt > 0 && combat.drawPile.length === 0) {
      returnDiscardCardsByFlag(state, 'returnOnScry', '【先见之明】');
    }
    drawCards(state, totalTurnDraw);
  }

  if (combat.turn === 1) {
    if (hasRelic(state, 'ninja_scroll')) {
      addCardsToHand(state, 'shiv', 3, false);
      pushCombatLog(
        combat,
        `遗物【${RELIC_LIBRARY.ninja_scroll.name}】生效：将 3 张【小刀】加入手牌！`,
        'info'
      );
    }
    if (hasRelic(state, 'holy_water')) {
      addCardsToHand(state, 'miracle', 3, false);
      pushCombatLog(
        combat,
        `遗物【${RELIC_LIBRARY.holy_water.name}】生效：将 3 张【奇迹】加入手牌！`,
        'info'
      );
    } else if (hasRelic(state, 'pure_water')) {
      addCardsToHand(state, 'miracle', 1, false);
      pushCombatLog(
        combat,
        `遗物【${RELIC_LIBRARY.pure_water.name}】生效：将 1 张【奇迹】加入手牌。`,
        'info'
      );
    }
    handleHermitTurn1StartHooks(state, { addCardsToHandFn: addCardsToHand });
  }

  if (combat.turn === 1 && hasRelic(state, 'enchiridion') && getAliveEnemies(combat).length > 0) {
    const charId = state.characterId ?? state.player.characterId ?? 'ironclad';
    const powerPool = Object.values(CARD_LIBRARY)
      .filter(
        (c) =>
          c.type === 'power' &&
          !c.shopOnly &&
          isGeneratableCombatCard(c) &&
          getCardCharacter(c) === charId
      )
      .map((c) => c.id);
    const chosenPowerId = pickRandom(state, powerPool);
    if (chosenPowerId) {
      const added = addCardsToHand(state, chosenPowerId, 1, false);
      if (added[0]) {
        added[0].prevCombatCost = added[0].combatCost ?? null;
        added[0].combatCost = 0;
        added[0].tempZeroCostTurn = true;
      }
      pushCombatLog(
        combat,
        `遗物【${RELIC_LIBRARY.enchiridion.name}】生效：本回合免费获得能力牌【${CARD_LIBRARY[chosenPowerId].name}】！`,
        'info'
      );
    }
  }

  combat.lastTurnSummary = {
    turn: combat.turn,
    isOpeningTurn: combat.turn === 1 && !prevTurnTransition,
    wasExtraTurn: Boolean(prevTurnTransition?.wasExtraTurn),
    discardedCount: prevTurnTransition?.discardedCount ?? 0,
    retainedCount: prevTurnTransition?.retainedCount ?? 0,
    etherealExhaustedCount: prevTurnTransition?.etherealExhaustedCount ?? 0,
    reshuffled: (combat.reshuffleCount ?? 0) > reshuffleBeforeTurn,
    drawnCount: Math.max(0, combat.hand.length - handBeforeTurnDraw),
    pendingScryDraw,
    energy: state.player.energy,
  };

  if (getAliveEnemies(combat).length === 0 && state.player.hp > 0) {
    finalizeCombatVictory(state, onVictoryCallback);
    return;
  }

  if (
    !hasPendingCardChoice(combat) &&
    (state.player.statuses.mayhem ?? 0) > 0 &&
    getAliveEnemies(combat).length > 0 &&
    state.player.hp > 0 &&
    combat.status === 'ongoing'
  ) {
    const mayhemCount = state.player.statuses.mayhem;
    for (let m = 0; m < mayhemCount; m += 1) {
      if (
        hasPendingCardChoice(combat) ||
        getAliveEnemies(combat).length === 0 ||
        state.player.hp <= 0 ||
        combat.status !== 'ongoing'
      ) {
        break;
      }
      if (combat.drawPile.length === 0 && combat.discardPile.length > 0) {
        reshuffleDiscardIntoDraw(state);
      }
      const topCard = combat.drawPile.shift();
      if (!topCard) break;
      const topStats = getCardStats(topCard);
      const blockedByVelvetChoker = Boolean(
        hasRelic(state, 'velvet_choker') &&
          (combat.cardsPlayedThisTurn ?? 0) >= VELVET_CHOKER_CARD_LIMIT
      );
      const blockedByEntangle =
        topStats.type === 'attack' && (state.player.statuses?.entangled ?? 0) > 0;
      const blockedByClash = Boolean(
        topStats.requireAllHandAttacks &&
          combat.hand.some((c) => getCardStats(c).type !== 'attack')
      );
      const blockedBySignature = Boolean(
        topStats.requireOnlyAttackInHand &&
          combat.hand.some((c) => getCardStats(c).type === 'attack')
      );
      const blockedByGrandFinale = Boolean(
        topStats.requireEmptyDrawPile && combat.drawPile.length > 0
      );
      const isUnplayable =
        topStats.unplayable && !(topStats.type === 'status' && hasRelic(state, 'medical_kit'));
      if (
        isUnplayable ||
        blockedByVelvetChoker ||
        blockedByEntangle ||
        blockedByClash ||
        blockedBySignature ||
        blockedByGrandFinale
      ) {
        combat.discardPile.push(topCard);
        pushCombatLog(
          combat,
          `【乱战】翻出无法打出的【${topStats.name}】，已置入弃牌堆。`,
          'info'
        );
      } else {
        const aliveNow = getAliveEnemies(combat);
        const mayhemTarget = topStats.target === 'enemy' ? pickRandom(state, aliveNow) : null;
        combat.hand.push(topCard);
        const targetSuffix = mayhemTarget ? `（目标：${mayhemTarget.name}）` : '';
        pushCombatLog(
          combat,
          `【乱战】触发：免费打出抽牌堆顶的【${topStats.name}】${targetSuffix}！`,
          'card'
        );
        pushCardReveal(combat, {
          sourceName: '乱战',
          kind: 'auto_play',
          card: topCard,
          targetName: mayhemTarget?.name || null,
          summary: `乱战自动打出【${topStats.name}】${targetSuffix}`,
        });
        invokePlayCard(state, topCard.instanceId, mayhemTarget?.id ?? null, onVictoryCallback, {
          forceFree: true,
          fromHavoc: true,
        });
      }
    }
    if (getAliveEnemies(combat).length === 0 && state.player.hp > 0 && combat.status === 'ongoing') {
      finalizeCombatVictory(state, onVictoryCallback);
      return;
    }
  }

  if (
    toolsDraw > 0 &&
    !hasPendingCardChoice(combat) &&
    combat.status === 'ongoing' &&
    getAliveEnemies(combat).length > 0
  ) {
    requestManualDiscard(state, toolsDraw, '必备工具', onVictoryCallback);
  }
}

export function startCombat(state, encounter, encounterRole = 'normal', onVictoryCallback = null) {
  state.combatSnapshot = null;
  state.player.block = 0;
  state.player.energy = state.player.maxEnergy;
  state.player.statuses = {};
  state.player.skipStatusTick = {};
  state.player.stance = 'neutral';
  state.player.orbs = [];
  state.player.maxOrbSlots = state.characterId === 'defect' ? 3 : 0;

  const deckCopies = state.player.deck.map((c) => ({
    instanceId: c.instanceId,
    cardId: c.cardId,
    upgraded: Boolean(c.upgraded),
    ...(Number.isInteger(c.upgradeLevel) ? { upgradeLevel: c.upgradeLevel } : {}),
    ...(typeof c.miscBonus === 'number' ? { miscBonus: c.miscBonus } : {}),
    ...(typeof c.ritualBonus === 'number' ? { ritualBonus: c.ritualBonus } : {}),
  }));

  const shuffledDeck = shuffled(state, deckCopies);
  const innateCards = shuffledDeck.filter((c) => getCardStats(c).innate);
  const normalCards = shuffledDeck.filter((c) => !getCardStats(c).innate);

  const resolvedSpecs = resolveEncounterSpecs(state, encounter);
  const enemies = resolvedSpecs.map((spec) => createEnemyInstance(state, spec));

  const combat = {
    encounterId: encounter.id,
    encounterName: encounter.name,
    role: encounterRole,
    isBurningElite: Boolean(encounter.isBurningElite),
    burningBuff: encounter.burningBuff || null,
    turn: 0,
    phase: 'setup',
    status: 'ongoing',
    stance: 'neutral',
    mantraGainedThisCombat: 0,
    orbsChanneledThisCombat: 0,
    orbsChanneledByType: { lightning: 0, frost: 0, dark: 0, plasma: 0 },
    orbFxEvents: [],
    powersPlayedThisCombat: 0,
    echoFormUsedThisTurn: 0,
    lostHpLastTurn: false,
    lostHpThisTurn: false,
    lastCardTypePlayed: null,
    rushdownTriggersThisTurn: 0,
    extraTurnQueued: false,
    hpLostThisCombat: 0,
    hpLossCountThisCombat: 0,
    centennialUsed: false,
    activeBombs: [],
    nightmareQueue: [],
    playedAttackLastTurn: false,
    cardsPlayedLastTurn: 0,
    cardsPlayedThisTurn: 0,
    attacksPlayedThisTurn: 0,
    skillsPlayedThisTurn: 0,
    discardedThisTurn: 0,
    hoveringKiteUsedThisTurn: false,
    panacheCounter: 0,
    shurikenCounter: 0,
    kunaiCounter: 0,
    ornamentalFanCounter: 0,
    redSkullActive: false,
    playedCardTypesThisTurn: { attack: false, skill: false, power: false },
    pendingCardChoice: null,
    pendingDiscard: null,
    queuedOmnisciencePicks: 0,
    queuedOmniscienceSource: '通晓万物',
    drawPile: [...innateCards, ...normalCards],
    hand: [],
    discardPile: [],
    exhaustPile: [],
    enemies,
    hadNonMinionEnemy: enemies.some((e) => !e.isMinion),
    defeatedEnemiesCount: 0,
    fledEnemyIds: [],
    pendingCardReveals: [],
    reshuffleCount: 0,
    lastTurnSummary: null,
    logs: [],
    logSeq: 0,
  };

  state.combat = combat;
  state.screen = 'combat';
  if (enemies.length === 1 && enemies[0].templateId === 'shield_gremlin') {
    enemies[0].intent = rollEnemyIntent(state, enemies[0]);
  }
  state.player.penNibActive = hasRelic(state, 'pen_nib') && (state.relicCounters?.pen_nib ?? 0) === 9;

  pushCombatLog(combat, `遭遇战斗：${encounter.name}！`, 'info');

  if (combat.isBurningElite && combat.burningBuff) {
    const actScale = Math.max(1, Math.min(3, state.act ?? 1));
    let buffDesc = '';
    for (const enemy of enemies) {
      if (combat.burningBuff === 'maxHp') {
        const extraHp = Math.max(1, Math.round(enemy.maxHp * 0.25));
        enemy.maxHp += extraHp;
        enemy.hp += extraHp;
        buffDesc = '最大生命 +25%';
      } else if (combat.burningBuff === 'strength') {
        applyStatus(enemy, 'strength', actScale);
        buffDesc = `初始力量 +${actScale}`;
      } else if (combat.burningBuff === 'metallicize') {
        const mVal = actScale * 2;
        applyStatus(enemy, 'metallicize', mVal);
        enemy.block += mVal;
        buffDesc = `金属化 ${mVal}`;
      } else if (combat.burningBuff === 'regenerating') {
        const rVal = actScale * 2 + 1;
        applyStatus(enemy, 'regenerating', rVal);
        buffDesc = `再生 ${rVal}`;
      }
    }
    if (buffDesc) {
      pushCombatLog(
        combat,
        `🔥【燃烧精英】碧绿烈焰加持：敌方获得【${buffDesc}】（击败后必掉绿宝石钥匙）！`,
        'status'
      );
    }
  }

  if (encounter.id === 'spire_shield_and_spear' && enemies.length >= 2) {
    state.player.statuses.surrounded = 1;
    const frontEnemy = enemies.find((e) => e.templateId === 'spire_spear') || enemies[0];
    const backEnemies = [];
    for (const e of enemies) {
      if (e.id === frontEnemy.id) {
        e.backAttack = false;
      } else {
        e.backAttack = true;
        backEnemies.push(`【${e.name}】`);
      }
    }
    pushCombatLog(
      combat,
      `⚠️ 陷入【夹击】：你正面对【${frontEnemy.name}】，背对${backEnemies.join('、')}（背侧攻击伤害 +50%，对目标打出指向牌或药水可转向迎击）！`,
      'status'
    );
  }

  if (encounterRole === 'elite' && hasRelic(state, 'preserved_insect')) {
    for (const enemy of getAliveEnemies(combat)) {
      const reduced = Math.max(1, Math.floor(enemy.maxHp * 0.75));
      enemy.maxHp = reduced;
      enemy.hp = Math.min(enemy.hp, reduced);
    }
    pushCombatLog(
      combat,
      `遗物【${RELIC_LIBRARY.preserved_insect.name}】生效：精英敌人生命值降低 25%！`,
      'status'
    );
  }
  if (encounterRole === 'boss' && hasRelic(state, 'pantograph') && state.player.hp > 0) {
    const healed = healPlayerInCombat(state, 25);
    if (healed > 0) {
      pushCombatLog(
        combat,
        `遗物【${RELIC_LIBRARY.pantograph.name}】生效（首领战）：回复了 ${healed} 点生命！`,
        'victory'
      );
    }
  }
  if (hasRelic(state, 'blood_vial') && state.player.hp > 0) {
    const healed = healPlayerInCombat(state, 2);
    if (healed > 0) {
      pushCombatLog(combat, `遗物【${RELIC_LIBRARY.blood_vial.name}】回复了 ${healed} 点生命。`, 'info');
    }
  }
  if (hasRelic(state, 'bronze_scales')) {
    applyStatus(state.player, 'thorns', 3);
    pushCombatLog(combat, `遗物【${RELIC_LIBRARY.bronze_scales.name}】生效：获得 3 层【荆棘】。`, 'status');
  }
  if (hasRelic(state, 'thread_and_needle')) {
    applyStatus(state.player, 'platedArmor', 4);
    pushCombatLog(combat, `遗物【${RELIC_LIBRARY.thread_and_needle.name}】生效：获得 4 层【多层护甲】。`, 'block');
  }
  if (hasRelic(state, 'clockwork_souvenir')) {
    applyStatus(state.player, 'artifact', 1);
    pushCombatLog(combat, `遗物【${RELIC_LIBRARY.clockwork_souvenir.name}】生效：获得 1 层【人工制品】。`, 'status');
  }
  if (hasRelic(state, 'vajra')) {
    applyStatus(state.player, 'strength', 1);
    pushCombatLog(combat, `遗物【${RELIC_LIBRARY.vajra.name}】生效：获得 1 点力量。`, 'status');
  }
  if (hasRelic(state, 'girya') && (state.relicCounters?.girya ?? 0) > 0) {
    const lifts = state.relicCounters.girya;
    applyStatus(state.player, 'strength', lifts);
    pushCombatLog(
      combat,
      `遗物【${RELIC_LIBRARY.girya.name}】生效（已举重 ${lifts}/3 次）：获得 ${lifts} 点力量！`,
      'status'
    );
  }
  if (hasRelic(state, 'oddly_smooth_stone')) {
    applyStatus(state.player, 'dexterity', 1);
    pushCombatLog(
      combat,
      `遗物【${RELIC_LIBRARY.oddly_smooth_stone.name}】生效：获得 1 点敏捷。`,
      'status'
    );
  }
  if (hasRelic(state, 'akabeko')) {
    applyStatus(state.player, 'vigor', 8);
    pushCombatLog(
      combat,
      `遗物【${RELIC_LIBRARY.akabeko.name}】生效：获得 8 层【活力】（本战打出的第一张攻击牌伤害 +8）。`,
      'status'
    );
  }
  if (hasRelic(state, 'fossilized_helix')) {
    applyStatus(state.player, 'buffer', 1);
    pushCombatLog(
      combat,
      `遗物【${RELIC_LIBRARY.fossilized_helix.name}】生效：获得 1 层【缓冲】（抵消下 1 次生命损失）。`,
      'block'
    );
  }
  if (hasRelic(state, 'snecko_eye')) {
    applyStatus(state.player, 'confused', 1, { bypassArtifact: true });
    pushCombatLog(
      combat,
      `遗物【${RELIC_LIBRARY.snecko_eye.name}】生效：获得【混乱】，每回合额外抽 2 张牌，抽到的牌费用将随机重设！`,
      'status'
    );
  }
  if (hasRelic(state, 'teardrop_locket')) {
    changeStance(state, 'calm', { silent: true });
    pushCombatLog(
      combat,
      `遗物【${RELIC_LIBRARY.teardrop_locket.name}】生效：以【平静】姿态开启战斗！`,
      'status'
    );
  }
  if (hasRelic(state, 'bag_of_marbles')) {
    let appliedCount = 0;
    for (const enemy of getAliveEnemies(combat)) {
      if (applyStatus(enemy, 'vulnerable', 1)) {
        appliedCount += 1;
        triggerChampionBeltIfVulnerable(state, enemy, 'vulnerable', 1);
      } else {
        pushCombatLog(
          combat,
          `【${enemy.name}】的【人工制品】抵消了【${RELIC_LIBRARY.bag_of_marbles.name}】的【易伤】！`,
          'status'
        );
      }
    }
    if (appliedCount > 0) {
      pushCombatLog(
        combat,
        `遗物【${RELIC_LIBRARY.bag_of_marbles.name}】生效：给予敌人 1 层【易伤】。`,
        'status'
      );
    }
  }
  if (hasRelic(state, 'twisted_funnel')) {
    let appliedCount = 0;
    for (const enemy of getAliveEnemies(combat)) {
      if (applyPoisonToEnemy(state, enemy, 4) > 0) {
        appliedCount += 1;
      }
    }
    if (appliedCount > 0) {
      pushCombatLog(
        combat,
        `遗物【${RELIC_LIBRARY.twisted_funnel.name}】生效：给予敌人 4 层【中毒】！`,
        'status'
      );
    }
  }
  if (hasRelic(state, 'red_mask')) {
    let appliedCount = 0;
    for (const enemy of getAliveEnemies(combat)) {
      if (applyStatus(enemy, 'weak', 1)) {
        appliedCount += 1;
      } else {
        pushCombatLog(
          combat,
          `【${enemy.name}】的【人工制品】抵消了【${RELIC_LIBRARY.red_mask.name}】的【虚弱】！`,
          'status'
        );
      }
    }
    if (appliedCount > 0) {
      pushCombatLog(
        combat,
        `遗物【${RELIC_LIBRARY.red_mask.name}】生效：给予敌人 1 层【虚弱】。`,
        'status'
      );
    }
  }
  if (hasRelic(state, 'philosophers_stone')) {
    for (const enemy of getAliveEnemies(combat)) {
      applyStatus(enemy, 'strength', 1);
    }
    pushCombatLog(
      combat,
      `遗物【${RELIC_LIBRARY.philosophers_stone.name}】副作用：所有敌人初始获得 1 点【力量】。`,
      'status'
    );
  }
  if (hasDailyModifier(state, 'lethality')) {
    applyStatus(state.player, 'strength', 3);
    for (const enemy of getAliveEnemies(combat)) {
      applyStatus(enemy, 'strength', 3);
    }
    pushCombatLog(combat, '每日词条【嗜血狂潮】生效：敌我双方初始获得 +3 点【力量】！', 'status');
  }
  if (hasDailyModifier(state, 'time_dilation')) {
    for (const enemy of getAliveEnemies(combat)) {
      enemy.block += 6;
    }
    pushCombatLog(combat, '每日词条【先发制人】生效：所有敌人开场获得 6 点初始格挡。', 'block');
  }
  if (hasRelic(state, 'runic_capacitor')) {
    gainOrbSlots(state, 3, { sourceName: RELIC_LIBRARY.runic_capacitor.name });
  }
  if (hasRelic(state, 'data_disk')) {
    applyStatus(state.player, 'focus', 1);
    pushCombatLog(
      combat,
      `遗物【${RELIC_LIBRARY.data_disk.name}】生效：获得 1 点【集中】！`,
      'status'
    );
  }
  if (hasRelic(state, 'cracked_core')) {
    channelOrb(state, 'lightning', { sourceName: RELIC_LIBRARY.cracked_core.name });
  }
  if (hasRelic(state, 'symbiotic_virus')) {
    channelOrb(state, 'dark', { sourceName: RELIC_LIBRARY.symbiotic_virus.name });
  }
  if (hasRelic(state, 'nuclear_battery')) {
    channelOrb(state, 'plasma', { sourceName: RELIC_LIBRARY.nuclear_battery.name });
  }
  syncRedSkullStatus(state);

  startPlayerTurn(state, onVictoryCallback);
  if (combat.status === 'ongoing') {
    state.combatSnapshot = captureCombatSnapshot(state);
  }
  return state;
}

export function restartCombat(state) {
  if (
    !state ||
    state.screen !== 'combat' ||
    !state.combat ||
    state.combat.status !== 'ongoing' ||
    !state.combatSnapshot
  ) {
    return { ok: false, reason: '当前没有可重启的战斗' };
  }

  const nextRestarts = (state.stats?.combatRestarts ?? 0) + 1;
  const snap = structuredClone(state.combatSnapshot);
  state.rngState = snap.rngState;
  state.nextUid = snap.nextUid;
  state.player = snap.player;
  state.combat = snap.combat;
  state.stats = snap.stats || {};
  state.stats.combatRestarts = nextRestarts;
  if (state.combatSnapshot.stats) {
    state.combatSnapshot.stats.combatRestarts = nextRestarts;
  }
  if (snap.relicCounters) state.relicCounters = snap.relicCounters;
  if (snap.relicFlags) state.relicFlags = snap.relicFlags;
  state.screen = 'combat';
  state.runOutcome = null;

  return { ok: true, combatRestarts: nextRestarts };
}

export function endPlayerTurn(state, onVictoryCallback = null, options = {}) {
  const combat = state?.combat;
  if (!combat || state.screen !== 'combat' || combat.status !== 'ongoing' || combat.phase !== 'player') {
    return { ok: false, reason: '当前不能结束回合' };
  }
  if (hasPendingCardChoice(combat)) {
    return { ok: false, reason: `${getPendingChoiceBlockReason(combat)}再结束回合` };
  }

  const keepHandByPyramid = hasRelic(state, 'runic_pyramid');
  const keepHandByEquilibrium =
    (state.player.statuses.equilibrium ?? 0) > 0 || (state.player.statuses.ryeStalkRetain ?? 0) > 0;
  const wellLaidPlansAmt = state.player.statuses.wellLaidPlans ?? 0;
  const coalescenceAmt = state.player.statuses.coalescence ?? 0;
  const wellLaidPlansQuota =
    keepHandByPyramid || keepHandByEquilibrium ? 0 : wellLaidPlansAmt + coalescenceAmt;
  if (
    !options.skipWellLaidPlansPrompt &&
    wellLaidPlansQuota > 0 &&
    getAliveEnemies(combat).length > 0 &&
    state.player.hp > 0
  ) {
    const retainSource = coalescenceAmt > 0 && wellLaidPlansAmt === 0 ? '愈合' : '计划妥当';
    if (requestEndTurnRetainChoice(state, wellLaidPlansQuota, retainSource)) {
      return { ok: true, awaitingRetainChoice: true, outcome: state.combat?.status ?? combat.status };
    }
  }

  combat.phase = 'enemy';
  combat.queuedOmnisciencePicks = 0;
  combat.fledEnemyIds = [];
  combat.orbFxEvents = [];
  combat.playedAttackLastTurn = (combat.attacksPlayedThisTurn ?? 0) > 0;
  combat.cardsPlayedLastTurn = combat.cardsPlayedThisTurn ?? 0;
  delete state.player.statuses.noDraw;
  delete state.player.statuses.entangled;
  delete state.player.statuses.burst;
  delete state.player.statuses.doubleTap;
  delete state.player.statuses.duplication;
  delete state.player.statuses.waveOfTheHand;
  delete state.player.statuses.amplify;
  delete state.player.statuses.equilibrium;
  delete state.player.statuses.rebound;

  for (const pileCard of [...combat.hand, ...combat.discardPile, ...combat.drawPile]) {
    if (pileCard.tempZeroCostTurn) {
      if (pileCard.prevCombatCost === null || pileCard.prevCombatCost === undefined) {
        delete pileCard.combatCost;
      } else {
        pileCard.combatCost = pileCard.prevCombatCost;
      }
      delete pileCard.prevCombatCost;
      delete pileCard.tempZeroCostTurn;
    }
  }

  // 0. Temporary Strength & Dexterity decay (Flex / Duality / Speed & Flex Potions — Artifact blocks the decay!)
  if ((state.player.statuses.tempStrengthDown ?? 0) > 0) {
    const drop = state.player.statuses.tempStrengthDown;
    delete state.player.statuses.tempStrengthDown;
    if (applyStatus(state.player, 'strength', -drop)) {
      pushCombatLog(combat, `临时强化消退，失去 ${drop} 点力量。`, 'status');
    } else {
      pushCombatLog(combat, '【人工制品】抵消了临时力量消退，力量永久保留！', 'status');
    }
  }
  if ((state.player.statuses.tempDexterityDown ?? 0) > 0) {
    const dropDex = state.player.statuses.tempDexterityDown;
    delete state.player.statuses.tempDexterityDown;
    if (applyStatus(state.player, 'dexterity', -dropDex)) {
      pushCombatLog(combat, `临时敏捷消退，失去 ${dropDex} 点敏捷。`, 'status');
    } else {
      pushCombatLog(combat, '【人工制品】抵消了临时敏捷消退，敏捷永久保留！', 'status');
    }
  }

  // 1. Resolve end-of-turn hand curses/statuses (Burn, Regret, Doubt, Decay, Shame, Pride) + Constricted, then Ethereal / Retain / Discard
  for (const cardInstance of combat.hand) {
    if (state.player.hp <= 0 || combat.status !== 'ongoing') break;
    const stats = getCardStats(cardInstance);
    if (stats.endOfTurnSelfDamage) {
      dealDamageToPlayer(state, stats.endOfTurnSelfDamage, `手牌【${stats.name}】`, {
        isAttack: false,
        fromCard: true,
      });
    }
    if (state.player.hp <= 0 || combat.status !== 'ongoing') break;
    if (stats.endOfTurnLoseHp) {
      losePlayerHp(state, stats.endOfTurnLoseHp, stats.name, { fromCard: true });
    }
    if (state.player.hp <= 0 || combat.status !== 'ongoing') break;
    if (stats.endOfTurnWeak) {
      if (applyStatus(state.player, 'weak', stats.endOfTurnWeak, { appliedDuringEnemyTurn: true })) {
        pushCombatLog(combat, `手牌【${stats.name}】使你获得 ${stats.endOfTurnWeak} 层【虚弱】。`, 'status');
      }
    }
    if (stats.endOfTurnFrail) {
      if (applyStatus(state.player, 'frail', stats.endOfTurnFrail, { appliedDuringEnemyTurn: true })) {
        pushCombatLog(combat, `手牌【${stats.name}】使你获得 ${stats.endOfTurnFrail} 层【脆弱】。`, 'status');
      }
    }
    if (stats.endOfTurnCopyToDrawTop) {
      const copy = createCardInstance(state, cardInstance.cardId, false);
      combat.drawPile.unshift(copy);
      pushCombatLog(
        combat,
        `手牌【${stats.name}】触发：将 1 张【${stats.name}】复制品置于抽牌堆顶！`,
        'status'
      );
    }
  }

  if (state.player.hp > 0 && combat.status === 'ongoing' && (state.player.statuses.constricted ?? 0) > 0) {
    dealDamageToPlayer(state, state.player.statuses.constricted, '状态【缠绕】', {
      isAttack: false,
      fromCard: false,
    });
  }

  if (state.player.hp <= 0 || combat.status !== 'ongoing') {
    return { ok: true, outcome: state.combat?.status ?? combat.status };
  }

  handleHermitEndOfTurnHooks(state, {
    dealDamageToPlayerFn: dealDamageToPlayer,
    dealDamageToEnemyFn: dealDamageToEnemy,
    losePlayerHpFn: losePlayerHp,
    addPlayerBlockFn: addPlayerBlock,
  });

  if (state.player.hp <= 0 || combat.status !== 'ongoing') {
    return { ok: true, outcome: state.combat?.status ?? combat.status };
  }

  const handCountBeforeDiscard = combat.hand.length;
  const reshuffleCountBeforeEndTurn = combat.reshuffleCount ?? 0;
  const establishmentDiscount = state.player.statuses.establishment ?? 0;
  const etherealToExhaust = [];
  const retainedHand = [];
  let discardedEndOfTurnCount = 0;
  for (const cardInstance of combat.hand) {
    const stats = getCardStats(cardInstance);
    const keepByTempRetain = Boolean(cardInstance.tempRetainTurn);
    delete cardInstance.tempRetainTurn;
    const isActuallyRetained = Boolean(stats.retain || keepHandByEquilibrium || keepByTempRetain);
    if (stats.ethereal) {
      etherealToExhaust.push(cardInstance);
    } else if (isActuallyRetained || keepHandByPyramid) {
      retainedHand.push(cardInstance);
      if (stats.retainCostReduce) {
        cardInstance.retainedCostDiscount =
          (cardInstance.retainedCostDiscount ?? 0) + stats.retainCostReduce;
      }
      if (stats.retainScaleBlock) {
        cardInstance.combatBlockMod =
          (cardInstance.combatBlockMod ?? 0) + stats.retainScaleBlock;
      }
      if (stats.retainScaleDamage) {
        cardInstance.combatDamageMod =
          (cardInstance.combatDamageMod ?? 0) + stats.retainScaleDamage;
      }
      // Runic Pyramid prevents discarding without triggering "Retain" for Establishment
      if (
        isActuallyRetained &&
        establishmentDiscount > 0 &&
        !stats.unplayable &&
        !stats.isXCost &&
        typeof stats.cost === 'number'
      ) {
        cardInstance.retainedCostDiscount =
          (cardInstance.retainedCostDiscount ?? 0) + establishmentDiscount;
      }
    } else {
      combat.discardPile.push(cardInstance);
      discardedEndOfTurnCount += 1;
    }
  }
  combat.hand = retainedHand;

  const endTurnSummaryBase = {
    discardedCount: discardedEndOfTurnCount,
    retainedCount: retainedHand.length,
    etherealExhaustedCount: etherealToExhaust.length,
    reshuffleCountBefore: reshuffleCountBeforeEndTurn,
  };

  if (etherealToExhaust.length > 0) {
    exhaustCardsBatch(state, etherealToExhaust, { allowEndOfTurn: true });
    if (getAliveEnemies(combat).length === 0 && state.player.hp > 0) {
      finalizeCombatVictory(state, onVictoryCallback);
      return { ok: true, outcome: state.combat?.status ?? combat.status };
    }
  }

  // 2. End of turn relics & powers (Cloak Clasp, Orichalcum, Orbs/Frozen Core, Metallicize, Plated Armor, Like Water, Study, Combust, The Bomb, Omega)
  if (hasRelic(state, 'cloak_clasp') && handCountBeforeDiscard > 0) {
    const claspBlock = handCountBeforeDiscard;
    addPlayerBlock(state, claspBlock);
    pushCombatLog(
      combat,
      `遗物【${RELIC_LIBRARY.cloak_clasp.name}】生效：回合结束剩余 ${handCountBeforeDiscard} 张手牌，获得 ${claspBlock} 点格挡！`,
      'block'
    );
  }
  if (hasRelic(state, 'orichalcum') && state.player.block === 0) {
    addPlayerBlock(state, 6);
    pushCombatLog(combat, `遗物【${RELIC_LIBRARY.orichalcum.name}】生效：获得 6 点格挡。`, 'block');
  }
  // Defect end-of-turn orbs (after Orichalcum so Orichalcum + Frost synergy works just like original STS!)
  triggerEndOfTurnOrbs(state);
  if (getAliveEnemies(combat).length === 0 && state.player.hp > 0) {
    finalizeCombatVictory(state, onVictoryCallback);
    return {
      ok: true,
      outcome: state.combat?.status ?? combat.status,
      orbFxEvents: [...(combat.orbFxEvents || [])],
    };
  }
  if ((state.player.statuses.metallicize ?? 0) > 0) {
    const m = state.player.statuses.metallicize;
    addPlayerBlock(state, m);
    pushCombatLog(combat, `【金属化】生效：获得 ${m} 点格挡。`, 'block');
  }
  if ((state.player.statuses.platedArmor ?? 0) > 0) {
    const pa = state.player.statuses.platedArmor;
    addPlayerBlock(state, pa);
    pushCombatLog(combat, `【多层护甲】生效：获得 ${pa} 点格挡。`, 'block');
  }
  if ((state.player.statuses.likeWater ?? 0) > 0 && combat.stance === 'calm') {
    const lw = state.player.statuses.likeWater;
    addPlayerBlock(state, lw);
    pushCombatLog(combat, `【如水】生效（平静姿态）：获得 ${lw} 点格挡！`, 'block');
  }
  if ((state.player.statuses.study ?? 0) > 0) {
    const studyCount = state.player.statuses.study;
    const upInsight = (state.player.statuses.masterReality ?? 0) > 0;
    for (let s = 0; s < studyCount; s += 1) {
      const insightCard = createCardInstance(state, 'insight', upInsight);
      const insertIdx = randomInt(state, 0, combat.drawPile.length);
      combat.drawPile.splice(insertIdx, 0, insightCard);
    }
    pushCombatLog(
      combat,
      `【研习】生效：将 ${studyCount} 张【${upInsight ? '洞见+' : '洞见'}】洗入抽牌堆！`,
      'info'
    );
  }
  if ((state.player.statuses.combust ?? 0) > 0 && state.player.hp > 0) {
    const combustDmg = state.player.statuses.combust;
    losePlayerHp(state, 1, '自燃', { fromCard: true });
    if (state.player.hp <= 0 || combat.status !== 'ongoing') {
      return { ok: true, outcome: state.combat?.status ?? combat.status };
    }
    const alive = getAliveEnemies(combat);
    if (alive.length > 0) {
      pushCombatLog(combat, `【自燃】爆发：对所有敌人造成 ${combustDmg} 点伤害！`, 'attack');
      for (const enemy of alive) {
        dealDamageToEnemy(state, enemy, combustDmg, { isAttack: false });
      }
    }
  }
  if (Array.isArray(combat.activeBombs) && combat.activeBombs.length > 0) {
    const remainingBombs = [];
    for (const bomb of combat.activeBombs) {
      bomb.turns -= 1;
      if (bomb.turns <= 0) {
        const alive = getAliveEnemies(combat);
        if (alive.length > 0) {
          pushCombatLog(combat, `【炸弹】轰然引爆：对所有敌人造成 ${bomb.damage} 点巨额伤害！`, 'attack');
          for (const enemy of alive) {
            dealDamageToEnemy(state, enemy, bomb.damage, { isAttack: false });
          }
        }
      } else {
        remainingBombs.push(bomb);
      }
    }
    combat.activeBombs = remainingBombs;
    if (remainingBombs.length > 0) {
      state.player.statuses.theBomb = Math.min(...remainingBombs.map((b) => b.turns));
    } else {
      delete state.player.statuses.theBomb;
    }
  }
  if ((state.player.statuses.omega ?? 0) > 0) {
    const omegaDmg = state.player.statuses.omega;
    const alive = getAliveEnemies(combat);
    if (alive.length > 0) {
      pushCombatLog(combat, `【欧米伽】降临：对所有敌人造成 ${omegaDmg} 点毁灭性伤害！`, 'attack');
      for (const enemy of alive) {
        dealDamageToEnemy(state, enemy, omegaDmg, { isAttack: false });
      }
    }
  }
  if (getAliveEnemies(combat).length === 0 && state.player.hp > 0) {
    finalizeCombatVictory(state, onVictoryCallback);
    return { ok: true, outcome: state.combat?.status ?? combat.status };
  }

  // Vault extra turn: skip enemy phase completely and immediately start player's next turn
  if (combat.extraTurnQueued) {
    combat.extraTurnQueued = false;
    decayRoundStatuses(state.player);
    combat._pendingTurnSummary = { ...endTurnSummaryBase, wasExtraTurn: true };
    startPlayerTurn(state, onVictoryCallback);
    return { ok: true, outcome: state.combat?.status ?? combat.status };
  }

  // 3. Enemy phase: reset Invincible, clear previous block (unless Barricade), reset Malleable, tick Poison on all enemies first, then execute intents
  for (const enemy of getAliveEnemies(combat)) {
    if ((enemy.invincibleMax ?? 0) > 0) {
      if (!enemy.statuses) enemy.statuses = {};
      enemy.statuses.invincible = enemy.invincibleMax;
    }
    if (!((enemy.statuses?.barricade ?? 0) > 0)) {
      enemy.block = 0;
    }
    if ((enemy.malleableBase ?? 0) > 0 && enemy.statuses) {
      enemy.statuses.malleable = enemy.malleableBase;
    }
  }

  // Dedicated Poison pre-pass across all living enemies before any regrow/intent executes
  // (fixes Darkling Life Link order, Minion fleeing, Transient Shifting; Poison does NOT wake sleeping Lagavulin)
  for (const enemy of [...combat.enemies]) {
    if (state.player.hp <= 0 || combat.status !== 'ongoing') break;
    if (enemy.hp <= 0) continue;
    if ((enemy.statuses?.poison ?? 0) > 0) {
      const poisonStacks = enemy.statuses.poison;
      const rawPoisonDmg =
        (enemy.statuses?.intangible ?? 0) > 0 ? Math.min(1, poisonStacks) : poisonStacks;
      const poisonDmg = applyEnemyInvincibleCap(combat, enemy, rawPoisonDmg);
      const actualPoisonLoss = Math.min(enemy.hp, poisonDmg);
      enemy.hp = Math.max(0, enemy.hp - poisonDmg);
      if (state.stats && actualPoisonLoss > 0) {
        state.stats.totalDamageDealt = (state.stats.totalDamageDealt ?? 0) + actualPoisonLoss;
        state.stats.highestSingleHit = Math.max(state.stats.highestSingleHit ?? 0, actualPoisonLoss);
      }
      if (poisonDmg > 0) {
        pushCombatLog(combat, `【${enemy.name}】受【中毒】折磨失去 ${poisonDmg} 点生命！`, 'damage');
      }
      if (enemy.hp <= 0) {
        if (!handleEnemyZeroHp(state, enemy)) {
          enemy.block = 0;
          enemy.intent = null;
          pushCombatLog(combat, `【${enemy.name}】毒发倒下！`, 'victory');
          handleEnemyDeathPassives(state, enemy);
        }
        continue;
      }
      if (actualPoisonLoss > 0) {
        if ((enemy.statuses?.shifting ?? 0) > 0) {
          enemy.statuses.strength = (enemy.statuses.strength ?? 0) - actualPoisonLoss;
          if (enemy.statuses.strength === 0) delete enemy.statuses.strength;
          enemy.tempStrengthRestore = (enemy.tempStrengthRestore ?? 0) + actualPoisonLoss;
          pushCombatLog(
            combat,
            `【${enemy.name}】触发【游移】，本回合力量降低 ${actualPoisonLoss} 点！`,
            'status'
          );
        }
        checkSlimeSplitTrigger(combat, enemy);
      }
      if (poisonStacks - 1 <= 0) {
        delete enemy.statuses.poison;
      } else {
        enemy.statuses.poison = poisonStacks - 1;
      }
    }
  }

  if (state.player.hp <= 0 || combat.status !== 'ongoing') {
    return { ok: true, outcome: state.combat?.status ?? combat.status };
  }
  if (getAliveEnemies(combat).length === 0) {
    finalizeCombatVictory(state, onVictoryCallback);
    return { ok: true, outcome: state.combat?.status ?? combat.status };
  }

  const actingEnemies = [...combat.enemies];
  for (const enemy of actingEnemies) {
    if (state.player.hp <= 0 || combat.status !== 'ongoing') break;
    if (enemy.hp <= 0) {
      if ((enemy.darklingRegrowTurns ?? 0) > 0 && getAliveEnemies(combat).length > 0) {
        enemy.darklingRegrowTurns -= 1;
        if (enemy.darklingRegrowTurns <= 0) {
          const reviveHp = Math.max(1, Math.floor(enemy.maxHp / 2));
          enemy.hp = reviveHp;
          enemy.darklingRegrowTurns = 0;
          enemy.turnIndex += 1;
          enemy.intent = rollEnemyIntent(state, enemy);
          pushCombatLog(
            combat,
            `【${enemy.name}】触发【暗影复苏】，以 ${reviveHp}/${enemy.maxHp} 生命重新复活！`,
            'status'
          );
        } else {
          enemy.intent = {
            id: 'reincarnate',
            name: '暗影复苏 (下回合复活)',
            type: 'buff',
            summary: `生命链接生效！下回合将恢复 ${Math.max(1, Math.floor(enemy.maxHp / 2))} 点生命复活！`,
          };
          pushCombatLog(
            combat,
            `【${enemy.name}】正在凝聚暗影，下回合即将复活！`,
            'status'
          );
        }
      }
      continue;
    }

    handleEnemyTurnStartHermitHooks(state, enemy);

    const intent = enemy.intent;
    if (intent) {
      if (
        intent.id === 'asleep_idle' ||
        intent.id === 'stunned' ||
        intent.id === 'stunned_keep_intent' ||
        intent.id === 'automaton_stunned' ||
        intent.id === 'awakened_rebirth'
      ) {
        if (intent.id === 'awakened_rebirth') {
          enemy.hp = enemy.maxHp;
          enemy.awakenedRebirthing = false;
          if (!enemy.statuses) enemy.statuses = {};
          enemy.statuses.regenerating = Math.max(enemy.statuses.regenerating ?? 0, 10);
          enemy.awakeTurnIndex = 0;
          enemy._justCompletedRebirth = true;
          pushCombatLog(
            combat,
            `【${enemy.name}】完成【黑暗重生】，以完整形态苏醒！`,
            'status'
          );
          enemy.lastMoveId = intent.id;
        } else if (intent.id === 'stunned_keep_intent') {
          delete enemy.statuses.stunned;
          enemy._restoreSavedIntent = true;
          pushCombatLog(
            combat,
            `【${enemy.name}】处于眩晕状态，本回合跳过行动（下回合保留原有意图）！`,
            'status'
          );
        } else if (intent.id === 'stunned') {
          delete enemy.statuses.stunned;
          enemy.awakeTurnIndex = 0;
          pushCombatLog(
            combat,
            `【${enemy.name}】处于眩晕状态，本回合跳过行动并恢复清醒！`,
            'status'
          );
          enemy.lastMoveId = intent.id;
        } else if (intent.id === 'automaton_stunned') {
          pushCombatLog(combat, `【${enemy.name}】核心过载冷却中，本回合跳过行动！`, 'info');
          enemy.lastMoveId = intent.id;
        } else {
          pushCombatLog(combat, `【${enemy.name}】正在沉睡，没有采取进攻行动。`, 'info');
          enemy.lastMoveId = intent.id;
        }
      } else {
        // Generic Slime Split execution (Slime Boss -> Large Slimes -> Medium Slimes)
        if (Array.isArray(intent.splitInto) && intent.splitInto.length > 0) {
          const splitHp = Math.max(1, enemy.hp);
          const idx = combat.enemies.findIndex((e) => e.id === enemy.id);
          const children = intent.splitInto.map((childTplId) => {
            const child = createEnemyInstance(state, {
              templateId: childTplId,
              customHp: splitHp,
              skipHpScaling: true,
              customRole: 'normal',
            });
            if (hasRelic(state, 'philosophers_stone')) {
              applyStatus(child, 'strength', 1);
            }
            if (hasDailyModifier(state, 'lethality')) {
              applyStatus(child, 'strength', 3);
            }
            return child;
          });
          if (idx !== -1) {
            combat.enemies.splice(idx, 1, ...children);
          } else {
            enemy.hp = 0;
            combat.enemies.push(...children);
          }
          const childLabels = children.map((c) => `【${c.name}】`).join('与');
          pushCombatLog(
            combat,
            `【${enemy.name}】分裂为${childLabels}（各 ${splitHp} 点生命）！`,
            'status'
          );
          continue;
        }

        if (typeof intent.damage === 'number') {
          if (intent.isNonAttack) {
            dealDamageToPlayer(state, intent.damage, `【${enemy.name}】的${intent.name || '爆炸'}`, {
              isAttack: false,
            });
          } else {
            const hits = intent.hits ?? 1;
            for (let h = 0; h < hits; h += 1) {
              if (state.player.hp <= 0 || enemy.hp <= 0 || combat.status !== 'ongoing') break;
              const dmg = calculateAttackDamage(intent.damage, enemy, state.player);
              const hpLost = dealDamageToPlayer(state, dmg, `【${enemy.name}】的${intent.name || '攻击'}`);
              if (
                hpLost > 0 &&
                state.player.hp > 0 &&
                combat.status === 'ongoing' &&
                (state.player.statuses?.staticDischarge ?? 0) > 0
              ) {
                const sdCount = state.player.statuses.staticDischarge;
                for (let sd = 0; sd < sdCount; sd += 1) {
                  if (state.player.hp <= 0 || combat.status !== 'ongoing') break;
                  channelOrb(state, 'lightning', { sourceName: '静电释放' });
                }
                if (getAliveEnemies(combat).length === 0 && state.player.hp > 0) {
                  finalizeCombatVictory(state, onVictoryCallback);
                  return {
                    ok: true,
                    outcome: state.combat?.status ?? combat.status,
                    orbFxEvents: [...(combat.orbFxEvents || [])],
                  };
                }
              }
              if (hpLost > 0 && intent.lifesteal && enemy.hp > 0) {
                const prevHp = enemy.hp;
                enemy.hp = Math.min(enemy.maxHp, enemy.hp + hpLost);
                const healed = enemy.hp - prevHp;
                if (healed > 0) {
                  pushCombatLog(
                    combat,
                    `【${enemy.name}】吸血回复了 ${healed} 点生命（${enemy.hp}/${enemy.maxHp}）！`,
                    'status'
                  );
                }
              }
              if (
                hpLost > 0 &&
                state.player.hp > 0 &&
                (enemy.statuses?.painfulStabs ?? 0) > 0
              ) {
                const woundCount = enemy.statuses.painfulStabs;
                for (let w = 0; w < woundCount; w += 1) {
                  combat.discardPile.push(createCardInstance(state, 'wound', false));
                }
                pushCombatLog(
                  combat,
                  `【痛刺】触发：将 ${woundCount} 张【伤口】塞入你的弃牌堆！`,
                  'status'
                );
              }
              const thornsTotal =
                (state.player.statuses.flameBarrier ?? 0) + (state.player.statuses.thorns ?? 0);
              if (state.player.hp > 0 && enemy.hp > 0 && thornsTotal > 0) {
                pushCombatLog(
                  combat,
                  `反伤效果对【${enemy.name}】造成 ${thornsTotal} 点伤害！`,
                  'attack'
                );
                dealDamageToEnemy(state, enemy, thornsTotal, { isAttack: false });
              }
            }
          }
        }

        if (state.player.hp <= 0 || combat.status !== 'ongoing') break;
        if (enemy.hp <= 0) continue;

        if (intent.selfDestruct) {
          enemy.hp = 0;
          enemy.block = 0;
          enemy.intent = null;
          pushCombatLog(combat, `【${enemy.name}】自我引爆消散！`, 'victory');
          handleEnemyDeathPassives(state, enemy);
          continue;
        }

        if (intent.allEnemiesBlock) {
          for (const ally of getAliveEnemies(combat)) {
            ally.block += intent.allEnemiesBlock;
          }
          pushCombatLog(
            combat,
            `【${enemy.name}】为全体敌方单位施加 ${intent.allEnemiesBlock} 点格挡！`,
            'block'
          );
        } else if (intent.protectRandomAlly && intent.block) {
          const otherAllies = getAliveEnemies(combat).filter((e) => e.id !== enemy.id);
          const shieldTarget = otherAllies.length > 0 ? pickRandom(state, otherAllies) : enemy;
          shieldTarget.block += intent.block;
          pushCombatLog(
            combat,
            shieldTarget.id === enemy.id
              ? `【${enemy.name}】举盾自保，获得 ${intent.block} 点格挡！`
              : `【${enemy.name}】举盾护卫，为【${shieldTarget.name}】施加 ${intent.block} 点格挡！`,
            'block'
          );
        } else if (intent.supportBossBlock && intent.block) {
          const aliveNow = getAliveEnemies(combat);
          const bossTarget =
            aliveNow.find((e) => !e.isMinion && e.id !== enemy.id) ||
            pickRandom(
              state,
              aliveNow.filter((e) => e.id !== enemy.id)
            ) ||
            enemy;
          bossTarget.block += intent.block;
          pushCombatLog(
            combat,
            `【${enemy.name}】发射支援光束，为【${bossTarget.name}】提供 ${intent.block} 点格挡！`,
            'block'
          );
        } else if (intent.block) {
          enemy.block += intent.block;
          pushCombatLog(combat, `【${enemy.name}】获得 ${intent.block} 点格挡。`, 'block');
        }

        if (intent.clearSelfDebuffs && enemy.statuses) {
          for (const debuffKey of [
            'vulnerable',
            'weak',
            'frail',
            'poison',
            'corpseExplosion',
            'gainStrengthEndTurn',
          ]) {
            delete enemy.statuses[debuffKey];
          }
          if ((enemy.statuses.strength ?? 0) < 0) {
            delete enemy.statuses.strength;
          }
          pushCombatLog(combat, `【${enemy.name}】震碎了自身的全部负面状态！`, 'status');
        }

        if (intent.healToHalfMax && enemy.hp > 0) {
          const halfHp = Math.floor(enemy.maxHp / 2);
          if (enemy.hp < halfHp) {
            const healed = halfHp - enemy.hp;
            enemy.hp = halfHp;
            pushCombatLog(
              combat,
              `【${enemy.name}】回溯时间，生命恢复至 ${halfHp}/${enemy.maxHp}（+${healed}）！`,
              'status'
            );
          }
        }
        if (intent.id === 'time_haste') {
          enemy.pendingHaste = false;
          enemy.hasteUsed = true;
        }
        if (intent.markEntangleUsed) {
          enemy.entangleUsed = true;
        }

        if (intent.stasisSteal) {
          enemy.stasisUsed = true;
          const sourcePile =
            combat.drawPile.length > 0
              ? combat.drawPile
              : combat.discardPile.length > 0
                ? combat.discardPile
                : null;
          if (sourcePile) {
            const RARITY_RANK = {
              rare: 4,
              uncommon: 3,
              common: 2,
              starter: 1,
              special: 1,
              status: 0,
              curse: 0,
            };
            let maxRank = -1;
            for (const c of sourcePile) {
              const rank = RARITY_RANK[getCardStats(c)?.rarity] ?? 0;
              if (rank > maxRank) maxRank = rank;
            }
            const topCandidates = sourcePile.filter(
              (c) => (RARITY_RANK[getCardStats(c)?.rarity] ?? 0) === maxRank
            );
            const stolen = pickRandom(state, topCandidates);
            if (stolen) {
              const removeIdx = sourcePile.indexOf(stolen);
              if (removeIdx !== -1) sourcePile.splice(removeIdx, 1);
              enemy.stasisCard = stolen;
              applyStatus(enemy, 'stasis', 1);
              const stolenName = getCardStats(stolen)?.name || stolen.cardId;
              pushCombatLog(
                combat,
                `【${enemy.name}】释放【静止力场】，封印了你的【${stolenName}】（摧毁该单位即可归还）！`,
                'status'
              );
            }
          } else {
            pushCombatLog(
              combat,
              `【${enemy.name}】释放【静止力场】，但你的抽牌堆与弃牌堆已空，未能封印任何卡牌！`,
              'info'
            );
          }
        }

        if (intent.applyAllEnemiesStatuses) {
          for (const ally of getAliveEnemies(combat)) {
            for (const [statusKey, val] of Object.entries(intent.applyAllEnemiesStatuses)) {
              applyStatus(ally, statusKey, val);
            }
          }
          const summaryDesc = Object.entries(intent.applyAllEnemiesStatuses)
            .map(([k, v]) => `${v} 层【${STATUS_METADATA[k]?.name ?? k}】`)
            .join('、');
          pushCombatLog(combat, `【${enemy.name}】使全体敌方获得 ${summaryDesc}！`, 'status');
        }

        if (intent.applySelfStatuses) {
          for (const [statusKey, val] of Object.entries(intent.applySelfStatuses)) {
            applyStatus(enemy, statusKey, val);
            const statusName = STATUS_METADATA[statusKey]?.name ?? statusKey;
            pushCombatLog(combat, `【${enemy.name}】获得 ${val} 层【${statusName}】。`, 'status');
          }
          if (intent.skipRitualThisTurn) {
            enemy.skipRitualThisTurn = true;
          }
        }

        if (intent.isHeartBuff) {
          if ((enemy.statuses?.strength ?? 0) < 0) {
            delete enemy.statuses.strength;
          }
          applyStatus(enemy, 'strength', 2);
          const buffStage = enemy.heartBuffCount ?? 0;
          enemy.heartBuffCount = buffStage + 1;
          let stageMsg = '';
          if (buffStage === 0) {
            applyStatus(enemy, 'artifact', 2);
            stageMsg = '2 层【人工制品】';
          } else if (buffStage === 1) {
            applyStatus(enemy, 'beatOfDeath', 1);
            stageMsg = '+1 层【死亡律动】';
          } else if (buffStage === 2) {
            applyStatus(enemy, 'painfulStabs', 1);
            stageMsg = '【痛刺】';
          } else if (buffStage === 3) {
            applyStatus(enemy, 'strength', 10);
            stageMsg = '额外 +10 点【力量】';
          } else {
            applyStatus(enemy, 'strength', 50);
            stageMsg = '额外 +50 点【力量】';
          }
          pushCombatLog(
            combat,
            `【${enemy.name}】剧烈脉动：清除负面力量，获得 2 点【力量】与 ${stageMsg}！`,
            'status'
          );
        }

        if (intent.applyPlayerStatuses) {
          for (const [statusKey, val] of Object.entries(intent.applyPlayerStatuses)) {
            const statusName = STATUS_METADATA[statusKey]?.name ?? statusKey;
            if (applyStatus(state.player, statusKey, val, { appliedDuringEnemyTurn: true })) {
              pushCombatLog(
                combat,
                val < 0
                  ? `【${enemy.name}】使你失去 ${Math.abs(val)} 点【${statusName}】！`
                  : `【${enemy.name}】对你施加 ${val} 层【${statusName}】。`,
                'status'
              );
            } else {
              pushCombatLog(
                combat,
                `你的【人工制品】抵消了【${enemy.name}】的【${statusName}】！`,
                'status'
              );
            }
          }
        }

        if (Array.isArray(intent.addDrawCards)) {
          for (const spec of intent.addDrawCards) {
            const qty = spec.count ?? 1;
            for (let c = 0; c < qty; c += 1) {
              const created = createCardInstance(state, spec.cardId, false);
              const insertIdx = randomInt(state, 0, combat.drawPile.length);
              combat.drawPile.splice(insertIdx, 0, created);
            }
            const cName = CARD_LIBRARY[spec.cardId]?.name ?? spec.cardId;
            pushCombatLog(
              combat,
              `【${enemy.name}】将 ${qty} 张【${cName}】洗入你的抽牌堆！`,
              'status'
            );
          }
        }

        if (Array.isArray(intent.addDiscardCards)) {
          for (const spec of intent.addDiscardCards) {
            const qty = spec.count ?? 1;
            for (let c = 0; c < qty; c += 1) {
              const created = createCardInstance(state, spec.cardId, false);
              combat.discardPile.push(created);
            }
            const cName = CARD_LIBRARY[spec.cardId]?.name ?? spec.cardId;
            pushCombatLog(
              combat,
              `【${enemy.name}】将 ${qty} 张【${cName}】塞入你的弃牌堆！`,
              'status'
            );
          }
        }

        if (intent.addCurseToDeck && CARD_LIBRARY[intent.addCurseToDeck]) {
          enemy.implantUsed = true;
          // Official STS1: Implant adds Parasite ONLY to the Master Deck (not to the active combat piles)
          const curseMaster = createCardInstance(state, intent.addCurseToDeck, false);
          state.player.deck.push(curseMaster);
          const cName = CARD_LIBRARY[intent.addCurseToDeck]?.name ?? intent.addCurseToDeck;
          const bonusNotes = [];
          if (hasRelic(state, 'darkstone_periapt')) {
            state.player.maxHp += 6;
            state.player.hp += 6;
            syncRedSkullStatus(state);
            bonusNotes.push(`【${RELIC_LIBRARY.darkstone_periapt.name}】最大生命 +6`);
          }
          if (hasRelic(state, 'ceramic_fish')) {
            state.player.gold = (state.player.gold ?? 0) + 9;
            if (state.stats) state.stats.goldEarned = (state.stats.goldEarned ?? 0) + 9;
            bonusNotes.push(`【${RELIC_LIBRARY.ceramic_fish.name}】+9 金币`);
            if (hasRelic(state, 'bloody_idol') && state.player.hp > 0) {
              const healed = healPlayerInCombat(state, 5);
              if (healed > 0) {
                bonusNotes.push(`【${RELIC_LIBRARY.bloody_idol.name}】回复 ${healed} 生命`);
              }
            }
          }
          pushCombatLog(
            combat,
            bonusNotes.length > 0
              ? `【${enemy.name}】将永久诅咒【${cName}】植入了你的主牌组！（${bonusNotes.join('、')}）`
              : `【${enemy.name}】将永久诅咒【${cName}】植入了你的主牌组！`,
            'status'
          );
        }

        if (intent.summonMinions) {
          pruneDefeatedEnemies(combat);
          const aliveMinions = getAliveEnemies(combat).filter((e) => e.isMinion);
          const currentMinions = aliveMinions.length;
          const summonCap = intent.summonMax ?? 4;
          const canSpawn = Math.max(0, Math.min(intent.summonCount ?? 1, summonCap - currentMinions));
          let templateIdsToSpawn = [];
          if (canSpawn > 0) {
            if (Array.isArray(intent.summonMinions)) {
              templateIdsToSpawn = drawGremlinGang(state, canSpawn, {
                existingTemplateIds: aliveMinions.map((e) => e.templateId),
              });
            } else {
              templateIdsToSpawn = Array.from({ length: canSpawn }, () => intent.summonMinions);
            }
          }
          const spawnedNames = [];
          for (const tplId of templateIdsToSpawn) {
            const minion = createEnemyInstance(state, {
              templateId: tplId,
              customHp: intent.summonHp,
              isMinion: true,
            });
            if (hasRelic(state, 'philosophers_stone')) {
              applyStatus(minion, 'strength', 1);
            }
            if (hasDailyModifier(state, 'lethality')) {
              applyStatus(minion, 'strength', 3);
            }
            combat.enemies.push(minion);
            spawnedNames.push(minion.name);
          }
          if (spawnedNames.length > 0) {
            const uniqueNames = [...new Set(spawnedNames)];
            const desc =
              uniqueNames.length === 1
                ? `${spawnedNames.length} 个【${uniqueNames[0]}】`
                : spawnedNames.map((n) => `【${n}】`).join('、');
            pushCombatLog(combat, `【${enemy.name}】召唤了 ${desc}！`, 'status');
          } else {
            pushCombatLog(combat, `【${enemy.name}】尝试召唤爪牙，但场上已达上限（${summonCap} 个）。`, 'info');
          }
        }

        if (intent.restoreFlight) {
          enemy.statuses.flight = intent.restoreFlight;
          enemy.grounded = false;
          enemy.byrdGroundStep = 0;
          pushCombatLog(
            combat,
            `【${enemy.name}】振翅升空，恢复了 ${intent.restoreFlight} 层【飞行】！`,
            'status'
          );
        } else if (enemy.templateId === 'byrd' && enemy.grounded) {
          enemy.byrdGroundStep = (enemy.byrdGroundStep ?? 0) + 1;
        }

        if (intent.exitDefensiveMode && enemy.templateId === 'the_guardian') {
          delete enemy.statuses.sharpHide;
          enemy.mode = 'offensive';
          enemy.modeShiftMax += 10;
          enemy.statuses.modeShift = enemy.modeShiftMax;
          enemy.offensiveStep = -1;
          pushCombatLog(
            combat,
            `【${enemy.name}】重回【进攻形态】（形态转换 ${enemy.modeShiftMax}）！`,
            'status'
          );
        }

        if (intent.incrementDefensiveStance) {
          enemy.defensiveStanceCount = (enemy.defensiveStanceCount ?? 0) + 1;
        }
        if (intent.id === 'multi_stab') {
          enemy.multiStabUsed = (enemy.multiStabUsed ?? 0) + 1;
        }
        if (intent.id === 'champ_anger') {
          enemy.champPhase2PendingAnger = false;
          enemy.champPhase2Step = 0;
        } else if (
          enemy.templateId === 'the_champ' &&
          (enemy.champPhase ?? 1) >= 2 &&
          !enemy.champPhase2PendingAnger
        ) {
          enemy.champPhase2Step = ((enemy.champPhase2Step ?? 0) + 1) % 3;
        }

        enemy.lastMoveId = intent.id;
      }
    }

    // Lagavulin natural Turn-3 wake-up happens BEFORE end-of-turn Metallicize Block so it does not gain Block on the turn it wakes!
    if (enemy.templateId === 'lagavulin') {
      if ((enemy.statuses?.asleep ?? 0) > 0) {
        enemy.statuses.asleep -= 1;
        if (enemy.statuses.asleep <= 0) {
          delete enemy.statuses.asleep;
          delete enemy.statuses.metallicize;
          enemy.awakeTurnIndex = 0;
          pushCombatLog(
            combat,
            `【${enemy.name}】从沉睡中自然苏醒，失去金属化并准备发起猛攻！`,
            'status'
          );
        }
      } else if (
        (enemy.statuses?.stunned ?? 0) <= 0 &&
        intent?.id !== 'asleep_idle' &&
        intent?.id !== 'stunned'
      ) {
        enemy.awakeTurnIndex = (enemy.awakeTurnIndex ?? 0) + 1;
      }
    } else if (enemy.templateId === 'awakened_one' && enemy.unawakened === false) {
      if (enemy._justCompletedRebirth) {
        delete enemy._justCompletedRebirth;
      } else {
        enemy.awakeTurnIndex = (enemy.awakeTurnIndex ?? 0) + 1;
      }
    }

    // Ritual & Metallicize trigger at end of enemy turn
    if ((enemy.statuses.ritual ?? 0) > 0) {
      if (enemy.skipRitualThisTurn) {
        enemy.skipRitualThisTurn = false;
      } else {
        const gain = enemy.statuses.ritual;
        applyStatus(enemy, 'strength', gain);
        pushCombatLog(combat, `【${enemy.name}】的【仪式】触发，获得 ${gain} 点力量！`, 'status');
      }
    }
    if ((enemy.statuses.metallicize ?? 0) > 0) {
      const m = enemy.statuses.metallicize;
      enemy.block += m;
      pushCombatLog(combat, `【${enemy.name}】的【金属化】生效，获得 ${m} 点格挡。`, 'block');
    }
    if (enemy.hp > 0 && (enemy.statuses.platedArmor ?? 0) > 0) {
      const pa = enemy.statuses.platedArmor;
      enemy.block += pa;
      pushCombatLog(combat, `【${enemy.name}】的【多层护甲】生效，获得 ${pa} 点格挡。`, 'block');
    }
    if (enemy.hp > 0 && (enemy.statuses?.regenerating ?? 0) > 0) {
      const regen = enemy.statuses.regenerating;
      const before = enemy.hp;
      enemy.hp = Math.min(enemy.maxHp, enemy.hp + regen);
      const healed = enemy.hp - before;
      if (healed > 0) {
        pushCombatLog(
          combat,
          `【${enemy.name}】触发【再生】，回复 ${healed} 点生命（${enemy.hp}/${enemy.maxHp}）。`,
          'status'
        );
      }
    }
    if (enemy.hp > 0 && (enemy.statuses?.explosive ?? 0) > 0 && !intent?.selfDestruct) {
      enemy.statuses.explosive = Math.max(1, enemy.statuses.explosive - 1);
    }

    if ((enemy.statuses?.gainStrengthEndTurn ?? 0) > 0) {
      const restore = enemy.statuses.gainStrengthEndTurn;
      delete enemy.statuses.gainStrengthEndTurn;
      applyStatus(enemy, 'strength', restore);
      pushCombatLog(combat, `【${enemy.name}】在回合结束恢复了 ${restore} 点力量。`, 'status');
    }

    if ((enemy.tempStrengthRestore ?? 0) > 0) {
      const restore = enemy.tempStrengthRestore;
      enemy.tempStrengthRestore = 0;
      enemy.statuses.strength = (enemy.statuses.strength ?? 0) + restore;
      if (enemy.statuses.strength === 0) delete enemy.statuses.strength;
    }

    if (enemy.hp > 0 && (enemy.statuses?.fading ?? 0) > 0) {
      enemy.statuses.fading -= 1;
      if (enemy.statuses.fading <= 0) {
        delete enemy.statuses.fading;
        enemy.hp = 0;
        enemy.block = 0;
        enemy.intent = null;
        pushCombatLog(combat, `【消逝】倒计时归零，【${enemy.name}】化作虚无消散了！`, 'victory');
        handleEnemyDeathPassives(state, enemy);
        continue;
      }
    }

    enemy.turnIndex += 1;
    if (enemy.templateId === 'the_guardian') {
      if (enemy.mode === 'defensive') {
        enemy.defensiveStep += 1;
      } else {
        enemy.offensiveStep = (((enemy.offensiveStep + 1) % 4) + 4) % 4;
      }
    }
  }

  pruneDefeatedEnemies(combat);

  if (state.player.hp <= 0 || combat.status !== 'ongoing') {
    return { ok: true, outcome: state.combat?.status ?? combat.status };
  }

  if (getAliveEnemies(combat).length === 0) {
    finalizeCombatVictory(state, onVictoryCallback);
    return { ok: true, outcome: state.combat?.status ?? combat.status };
  }

  // 4. End of round decay on both Player and Enemies
  decayRoundStatuses(state.player);
  for (const enemy of getAliveEnemies(combat)) {
    decayRoundStatuses(enemy);
    if (enemy.templateId === 'nemesis' && enemy.turnIndex % 2 === 1) {
      applyStatus(enemy, 'intangible', 1);
      pushCombatLog(combat, `【${enemy.name}】身形虚化，下回合获得 1 层【无实体】！`, 'status');
    }
    if (
      enemy.templateId === 'the_champ' &&
      (enemy.champPhase ?? 1) === 1 &&
      enemy.hp > 0 &&
      enemy.hp <= Math.floor(enemy.maxHp / 2)
    ) {
      enemy.champPhase = 2;
      enemy.champPhase2PendingAnger = true;
      enemy.champPhase2Step = 0;
    }
    if (
      enemy.templateId === 'time_eater' &&
      !enemy.hasteUsed &&
      !enemy.pendingHaste &&
      enemy.hp > 0 &&
      enemy.hp <= Math.floor(enemy.maxHp / 2)
    ) {
      enemy.pendingHaste = true;
      pushCombatLog(
        combat,
        `【${enemy.name}】时砂倒流震颤：下回合将施放【狂潮加速】！`,
        'status'
      );
    }
    if (enemy._restoreSavedIntent && enemy.stunnedSavedIntent) {
      enemy.intent = enemy.stunnedSavedIntent;
      delete enemy.stunnedSavedIntent;
      delete enemy._restoreSavedIntent;
    } else {
      delete enemy._restoreSavedIntent;
      delete enemy.stunnedSavedIntent;
      enemy.intent = rollEnemyIntent(state, enemy);
    }
  }

  // 5. Start next Player turn
  combat._pendingTurnSummary = { ...endTurnSummaryBase, wasExtraTurn: false };
  startPlayerTurn(state, onVictoryCallback);
  return {
    ok: true,
    outcome: state.combat?.status ?? combat.status,
    orbFxEvents: [...(combat.orbFxEvents || [])],
  };
}

registerEndPlayerTurnHandler(endPlayerTurn);
