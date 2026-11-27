/**
 * Card playability checks, full card effect resolution pipeline (playCard), and potion usage.
 */

import {
  canUpgradeCard,
  CARD_LIBRARY,
  GENERATABLE_COLORLESS_CARD_IDS,
  countCombatStrikeCards,
  createCardInstance,
  getCardAttackFlatBonus,
  getCardCharacter,
  getCardStats,
  getEffectiveCardCost,
  isGeneratableCombatCard,
  isStrikeCard,
  upgradeCardInstance,
} from '../../data/cards.js';
import {
  getAvailablePotionIds,
  POTION_LIBRARY,
  RELIC_LIBRARY,
  STATUS_METADATA,
} from '../../data/relics.js';
import { calculateAttackDamage, calculateCardBlock, isFatalEnemyKill } from '../math.js';
import { pickRandom, randomInt, shuffled } from '../rng.js';
import {
  MAX_HAND_SIZE,
  VELVET_CHOKER_CARD_LIMIT,
  pushCardReveal,
  hasRelic,
  healPlayerInCombat,
  getAliveEnemies,
  pushCombatLog,
  applyStatus,
  addCardsToHand,
  syncRedSkullStatus,
  handleEnemyZeroHp,
  reshuffleDiscardIntoDraw,
  applyEnemyInvincibleCap,
  setPendingCardChoice,
  hasPendingCardChoice,
  registerPlayCardHandler,
  getPendingChoiceBlockReason,
  requestDiscardPileChoice,
  requestDrawPileChoice,
  requestExhaustPileChoice,
  requestDiscoverCardChoice,
  requestWishChoice,
  resolveEnemyTarget,
  finalizeCombatVictory,
} from './state.js';
import {
  addPlayerBlock,
  triggerSadisticNature,
  triggerChampionBeltIfVulnerable,
  applyPoisonToEnemy,
  handleEnemyDeathPassives,
  drawCards,
  dealDamageToEnemy,
  dealDamageToPlayer,
  losePlayerHp,
  discardCardsBatch,
  requestHandCardChoice,
  changeStance,
  gainMantra,
  initiateScry,
  exhaustCardsBatch,
} from './resolution.js';
import {
  ORB_TYPES,
  countUniqueOrbs,
  gainOrbSlots,
  removeOrbSlots,
  channelOrb,
  evokeFrontOrb,
  evokeAllOrbs,
  removeAllOrbs,
  triggerAllDarkPassives,
} from './orbs.js';
import { endPlayerTurn } from './turn_flow.js';

export function canPlayCard(state, instanceId) {
  const combat = state?.combat;
  if (!combat || state.screen !== 'combat' || combat.status !== 'ongoing' || combat.phase !== 'player') {
    return { playable: false, reason: '当前不是玩家出牌阶段' };
  }
  if (hasPendingCardChoice(combat)) {
    return { playable: false, reason: getPendingChoiceBlockReason(combat) };
  }
  const cardInstance = combat.hand.find((c) => c.instanceId === instanceId);
  if (!cardInstance) {
    return { playable: false, reason: '卡牌不在手牌中' };
  }
  if (
    hasRelic(state, 'velvet_choker') &&
    (combat.cardsPlayedThisTurn ?? 0) >= VELVET_CHOKER_CARD_LIMIT
  ) {
    return {
      playable: false,
      reason: `受【天鹅绒颈圈】限制，每回合最多打出 ${VELVET_CHOKER_CARD_LIMIT} 张卡牌`,
    };
  }
  const normalityCard = combat.hand.find((c) => getCardStats(c).normalityLimit);
  if (normalityCard) {
    const limit = getCardStats(normalityCard).normalityLimit;
    if ((combat.cardsPlayedThisTurn ?? 0) >= limit) {
      return {
        playable: false,
        reason: `受手牌【凡庸】限制，本回合最多打出 ${limit} 张牌`,
      };
    }
  }
  const stats = getCardStats(cardInstance);
  const canMedKitPlay = stats.unplayable && stats.type === 'status' && hasRelic(state, 'medical_kit');
  if (stats.unplayable && !canMedKitPlay) {
    return { playable: false, reason: '该卡牌不可打出' };
  }
  if (stats.type === 'attack' && (state.player.statuses?.entangled ?? 0) > 0) {
    return { playable: false, reason: '处于【缠网】状态，本回合无法打出攻击牌' };
  }
  if (
    stats.requireAllHandAttacks &&
    combat.hand.some((c) => getCardStats(c).type !== 'attack')
  ) {
    return { playable: false, reason: '手牌中存在非攻击牌，无法打出【交锋】' };
  }
  if (
    stats.requireOnlyAttackInHand &&
    combat.hand.some((c) => c.instanceId !== instanceId && getCardStats(c).type === 'attack')
  ) {
    return { playable: false, reason: '手牌中存在其他攻击牌，无法打出【招牌技】' };
  }
  if (stats.requireEmptyDrawPile && (combat.drawPile?.length ?? 0) > 0) {
    return { playable: false, reason: '抽牌堆必须为空才能打出【华丽收场】' };
  }
  const effectiveCost = getEffectiveCardCost(stats, state.player, combat);
  if (!stats.isXCost && (effectiveCost ?? 0) > state.player.energy) {
    return { playable: false, reason: '能量不足' };
  }
  return { playable: true, reason: '' };
}

export function playCard(
  state,
  instanceId,
  targetEnemyId = null,
  onVictoryCallback = null,
  internalOpts = {}
) {
  if (!internalOpts.forceFree) {
    const check = canPlayCard(state, instanceId);
    if (!check.playable) {
      return { ok: false, reason: check.reason };
    }
  }

  const combat = state.combat;
  const buildPlayResult = (extra = {}) => ({
    ok: true,
    outcome: state.combat?.status ?? combat.status,
    cardReveals: Array.isArray(combat.pendingCardReveals) ? [...combat.pendingCardReveals] : [],
    orbFxEvents: Array.isArray(combat.orbFxEvents) ? [...combat.orbFxEvents] : [],
    ...extra,
  });
  const handIndex = combat.hand.findIndex((c) => c.instanceId === instanceId);
  if (handIndex === -1) {
    return { ok: false, reason: '卡牌不在手牌中' };
  }
  const cardInstance = combat.hand[handIndex];
  const stats = getCardStats(cardInstance);

  const targetRes = resolveEnemyTarget(combat, stats.target, targetEnemyId);
  if (!targetRes.ok) {
    return { ok: false, reason: targetRes.reason };
  }
  const targetEnemy = targetRes.enemy;

  if (!internalOpts.fromHavoc && !internalOpts.fromDup) {
    combat.fledEnemyIds = [];
    combat.pendingCardReveals = [];
    combat.orbFxEvents = [];
  }

  const effectiveCost = internalOpts.forceFree ? 0 : getEffectiveCardCost(stats, state.player, combat);
  const flatBonus = getCardAttackFlatBonus(stats, state.player, combat);
  const cardsPlayedBeforeThis = combat.cardsPlayedThisTurn ?? 0;
  const attacksBeforeThis = combat.attacksPlayedThisTurn ?? 0;
  const hadDiscardedBeforeThis = (combat.discardedThisTurn ?? 0) > 0;
  const prevCardType = combat.lastCardTypePlayed ?? null;
  const reboundWasActive = (state.player.statuses?.rebound ?? 0) > 0;
  const heatsinksBefore = state.player.statuses?.heatsinks ?? 0;
  const stormBefore = state.player.statuses?.storm ?? 0;
  const chokedEnemiesBefore = new Map(
    getAliveEnemies(combat)
      .filter((e) => (e.statuses?.choke ?? 0) > 0)
      .map((e) => [e.id, e.statuses.choke])
  );
  const targetIntendsAttackBefore = Boolean(
    targetEnemy &&
      targetEnemy.hp > 0 &&
      targetEnemy.intent &&
      (targetEnemy.intent.type?.startsWith('attack') ||
        typeof targetEnemy.intent.damage === 'number')
  );
  const usedFreeAttack =
    !internalOpts.forceFree &&
    stats.type === 'attack' &&
    !stats.isXCost &&
    (state.player.statuses?.freeAttackPower ?? 0) > 0;
  const energySpent = internalOpts.forceFree
    ? 0
    : stats.isXCost
      ? state.player.energy
      : (effectiveCost ?? 0);
  const xEnergy = stats.isXCost
    ? internalOpts.forceFree
      ? Math.max(0, state.player.energy)
      : energySpent
    : 0;
  const chemXBonus = stats.isXCost && hasRelic(state, 'chemical_x') ? 2 : 0;
  const effectiveX = xEnergy + chemXBonus;
  const corruptionActive =
    stats.type === 'skill' && (state.player.statuses.corruption ?? 0) > 0;
  const useAutoMulti = !internalOpts.forceRepeatCount;
  const burstStacks = state.player.statuses?.burst ?? 0;
  const burstActive = useAutoMulti && stats.type === 'skill' && !stats.noBurst && burstStacks > 0;
  const doubleTapStacks = state.player.statuses?.doubleTap ?? 0;
  const doubleTapActive = useAutoMulti && stats.type === 'attack' && doubleTapStacks > 0;
  const dupStacks = state.player.statuses?.duplication ?? 0;
  const dupActive = useAutoMulti && !stats.noBurst && dupStacks > 0;
  const amplifyStacks = state.player.statuses?.amplify ?? 0;
  const amplifyActive = useAutoMulti && stats.type === 'power' && !stats.noBurst && amplifyStacks > 0;
  const echoStacks = state.player.statuses?.echoForm ?? 0;
  const echoActive =
    useAutoMulti &&
    !internalOpts.fromHavoc &&
    !internalOpts.fromDup &&
    !stats.noBurst &&
    echoStacks > 0 &&
    (combat.echoFormUsedThisTurn ?? 0) < echoStacks;
  const repeatTimes = internalOpts.forceRepeatCount
    ? internalOpts.forceRepeatCount
    : 1 +
      (burstActive ? 1 : 0) +
      (doubleTapActive ? 1 : 0) +
      (dupActive ? 1 : 0) +
      (amplifyActive ? 1 : 0) +
      (echoActive ? 1 : 0);

  // 1. Remove from hand before resolving effects (prevents self-draw and frees hand slot)
  combat.hand.splice(handIndex, 1);
  if (cardInstance.zeroCostUntilPlayed) {
    delete cardInstance.zeroCostUntilPlayed;
  }
  state.player.energy -= energySpent;
  if (usedFreeAttack) {
    state.player.statuses.freeAttackPower -= 1;
    if (state.player.statuses.freeAttackPower <= 0) {
      delete state.player.statuses.freeAttackPower;
    }
  }
  state.stats.cardsPlayed = (state.stats.cardsPlayed ?? 0) + 1;
  combat.cardsPlayedThisTurn = (combat.cardsPlayedThisTurn ?? 0) + 1;
  if (stats.type === 'power') {
    combat.powersPlayedThisCombat = (combat.powersPlayedThisCombat ?? 0) + 1;
  }
  if (echoActive) {
    combat.echoFormUsedThisTurn = (combat.echoFormUsedThisTurn ?? 0) + 1;
  }

  const xCostLogNote = stats.isXCost
    ? internalOpts.forceFree
      ? `（免费 X=${xEnergy}${chemXBonus > 0 ? `，化学物X +${chemXBonus}` : ''}）`
      : `（消耗 ${energySpent} 点能量${chemXBonus > 0 ? `，化学物X +${chemXBonus}` : ''}）`
    : '';
  pushCombatLog(combat, `打出【${stats.name}】${xCostLogNote}。`, 'card');

  // Pain curse in hand: lose 1 HP whenever another card is played
  let painLoss = 0;
  for (const hc of combat.hand) {
    const hcPain = getCardStats(hc).painOnOtherCardPlay ?? 0;
    if (hcPain > 0) painLoss += hcPain;
  }
  if (painLoss > 0) {
    losePlayerHp(state, painLoss, '疼痛', { fromCard: true });
    if (state.player.hp <= 0 || combat.status !== 'ongoing') {
      return buildPlayResult();
    }
  }

  if (
    stats.type === 'attack' &&
    stats.target === 'enemy' &&
    targetEnemy &&
    targetEnemy.hp > 0 &&
    (state.player.statuses?.surrounded ?? 0) > 0 &&
    targetEnemy.backAttack
  ) {
    targetEnemy.backAttack = false;
    const otherNames = [];
    for (const e of getAliveEnemies(combat)) {
      if (e.id !== targetEnemy.id) {
        e.backAttack = true;
        otherNames.push(`【${e.name}】`);
      }
    }
    pushCombatLog(
      combat,
      `🔄 你转身正面迎击【${targetEnemy.name}】${otherNames.length > 0 ? `（背侧转为${otherNames.join('、')}）` : ''}！`,
      'status'
    );
  }

  if (burstActive) {
    if (burstStacks - 1 <= 0) {
      delete state.player.statuses.burst;
    } else {
      state.player.statuses.burst = burstStacks - 1;
    }
    pushCombatLog(combat, `【爆发】生效：技能【${stats.name}】将连续发动 2 次！`, 'status');
  }
  if (doubleTapActive) {
    if (doubleTapStacks - 1 <= 0) {
      delete state.player.statuses.doubleTap;
    } else {
      state.player.statuses.doubleTap = doubleTapStacks - 1;
    }
    pushCombatLog(combat, `【双发】生效：攻击【${stats.name}】将额外再发动 1 次！`, 'status');
  }
  if (dupActive) {
    if (dupStacks - 1 <= 0) {
      delete state.player.statuses.duplication;
    } else {
      state.player.statuses.duplication = dupStacks - 1;
    }
    pushCombatLog(combat, `【复制】生效：卡牌【${stats.name}】将额外再发动 1 次！`, 'status');
  }
  if (amplifyActive) {
    if (amplifyStacks - 1 <= 0) {
      delete state.player.statuses.amplify;
    } else {
      state.player.statuses.amplify = amplifyStacks - 1;
    }
    pushCombatLog(combat, `【增幅】生效：能力【${stats.name}】将额外再发动 1 次！`, 'status');
  }
  if (echoActive) {
    pushCombatLog(combat, `【回响形态】生效：【${stats.name}】产生回响，额外再发动 1 次！`, 'status');
  }

  let totalManualDiscard = 0;
  let totalManualExhaust = 0;
  let totalDrawAfterExhaust = 0;
  let totalExhaustMulti = 0;
  let totalExhaustForEnergy = 0;
  let totalManualUpgrade = 0;
  let totalHandToDrawTop = 0;
  let totalHandToDrawTopZero = false;
  let totalHandToDrawBottom = 0;
  let totalHandToDrawBottomMulti = false;
  let totalHandToDrawBottomZero = false;
  let totalDualWieldCopies = 0;
  let totalNightmareCopies = 0;
  let totalScry = 0;
  let totalDrawAfterScry = 0;
  let totalDiscardToDraw = 0;
  let totalRetrieveDiscardRetain = 0;
  let totalRetrieveDiscardToHand = 0;
  let totalRetrieveExhaust = 0;
  let totalPickFromDraw = 0;
  let pickFromDrawType = null;
  let totalOmniscience = 0;
  let pendingDiscoverCfg = null;
  let pendingWishCfg = null;

  for (let pass = 0; pass < repeatTimes; pass += 1) {
    if (pass > 0) {
      if (combat.status !== 'ongoing' || state.player.hp <= 0 || getAliveEnemies(combat).length === 0) {
        break;
      }
      pushCombatLog(combat, `回响触发：再次发动【${stats.name}】！`, 'info');
    }

    // 2. Self HP cost & self heal (Bandage Up)
    if (stats.loseHp) {
      losePlayerHp(state, stats.loseHp, stats.name, { fromCard: true });
      if (combat.status !== 'ongoing') {
        return buildPlayResult();
      }
    }
    if (stats.healHp && state.player.hp > 0) {
      const healed = healPlayerInCombat(state, stats.healHp);
      pushCombatLog(
        combat,
        healed > 0 ? `【${stats.name}】回复了 ${healed} 点生命。` : `【${stats.name}】生效，生命值已满。`,
        'victory'
      );
    }

    // 3. Energy gain & Sneaky Strike discard refund
    if (stats.gainEnergy) {
      state.player.energy += stats.gainEnergy;
      pushCombatLog(combat, `获得 ${stats.gainEnergy} 点能量。`, 'info');
    }
    if (stats.refundEnergyIfDiscarded && hadDiscardedBeforeThis) {
      state.player.energy += stats.refundEnergyIfDiscarded;
      pushCombatLog(
        combat,
        `【${stats.name}】触发弃牌返还：回复 ${stats.refundEnergyIfDiscarded} 点能量！`,
        'info'
      );
    }
    if (stats.doubleEnergy && state.player.energy > 0) {
      const gained = state.player.energy;
      state.player.energy += gained;
      pushCombatLog(combat, `【${stats.name}】使能量翻倍，额外获得 ${gained} 点能量！`, 'info');
    }
    if (stats.energyPerDrawCards) {
      const gained = Math.floor((combat.drawPile?.length ?? 0) / stats.energyPerDrawCards);
      if (gained > 0) {
        state.player.energy += gained;
        pushCombatLog(
          combat,
          `【${stats.name}】根据抽牌堆 ${combat.drawPile.length} 张牌，获得 ${gained} 点能量！`,
          'info'
        );
      } else {
        pushCombatLog(combat, `抽牌堆不足 ${stats.energyPerDrawCards} 张，【${stats.name}】未获得能量。`, 'info');
      }
    }

    // 3b. Conditional intent check (Spot Weakness)
    if (stats.spotWeaknessStrength) {
      const enemyIntendsAttack = Boolean(
        targetEnemy &&
          targetEnemy.hp > 0 &&
          targetEnemy.intent &&
          (targetEnemy.intent.type?.startsWith('attack') ||
            typeof targetEnemy.intent.damage === 'number')
      );
      if (enemyIntendsAttack) {
        applyStatus(state.player, 'strength', stats.spotWeaknessStrength);
        pushCombatLog(
          combat,
          `【${stats.name}】识破攻势，获得 ${stats.spotWeaknessStrength} 点【力量】！`,
          'status'
        );
      } else {
        pushCombatLog(combat, `目标当前并未意图攻击，【${stats.name}】未获得力量。`, 'info');
      }
    }

    // 4. Block gain, Halt Wrath bonus, Spirit Shield, Dodge and Roll next-turn block, & Entrench double block
    if (typeof stats.blockPerX === 'number') {
      let totalXBlock = 0;
      for (let bx = 0; bx < effectiveX; bx += 1) {
        const gained = calculateCardBlock(stats.blockPerX, state.player);
        addPlayerBlock(state, gained);
        totalXBlock += gained;
      }
      if (totalXBlock > 0) {
        pushCombatLog(
          combat,
          `【${stats.name}】生效 ${effectiveX} 次，共获得 ${totalXBlock} 点格挡！`,
          'block'
        );
      }
    } else if (stats.blockFromDiscardSize) {
      const rawStackBlock = (stats.block ?? 0) + (combat.discardPile?.length ?? 0);
      const gainedBlock = calculateCardBlock(rawStackBlock, state.player);
      addPlayerBlock(state, gainedBlock);
      if (gainedBlock > 0) {
        pushCombatLog(
          combat,
          `【${stats.name}】依据弃牌堆 ${combat.discardPile.length} 张牌，获得 ${gainedBlock} 点格挡！`,
          'block'
        );
      }
    } else if (typeof stats.block === 'number') {
      if (stats.onlyBlockIfNoBlock && state.player.block > 0) {
        pushCombatLog(combat, `你当前已有格挡，【${stats.name}】未生效。`, 'info');
      } else {
        const gainedBlock = calculateCardBlock(stats.block, state.player);
        addPlayerBlock(state, gainedBlock);
        if (gainedBlock > 0) {
          pushCombatLog(combat, `获得 ${gainedBlock} 点格挡。`, 'block');
        }
        if (stats.gainSameBlockNextTurn && gainedBlock > 0) {
          applyStatus(state.player, 'nextTurnBlock', gainedBlock);
          pushCombatLog(combat, `【${stats.name}】将在下回合开始时获得 ${gainedBlock} 点格挡。`, 'block');
        }
      }
    }
    if (stats.shrinkBlockOnPlay) {
      cardInstance.combatBlockMod = (cardInstance.combatBlockMod ?? 0) - stats.shrinkBlockOnPlay;
    }
    if (stats.geneticBlockGrowth) {
      cardInstance.miscBonus = (cardInstance.miscBonus ?? 0) + stats.geneticBlockGrowth;
      const masterCard = (state.player.deck || []).find((c) => c.instanceId === cardInstance.instanceId);
      if (masterCard) {
        masterCard.miscBonus = (masterCard.miscBonus ?? 0) + stats.geneticBlockGrowth;
      }
      pushCombatLog(
        combat,
        `【${stats.name}】进化：基础格挡永久 +${stats.geneticBlockGrowth}（下次 ${1 + (cardInstance.miscBonus ?? 0)} 点）！`,
        'block'
      );
    }
    if (typeof stats.wrathBonusBlock === 'number' && combat.stance === 'wrath') {
      const wrathBlock = calculateCardBlock(stats.wrathBonusBlock, state.player);
      addPlayerBlock(state, wrathBlock);
      if (wrathBlock > 0) {
        pushCombatLog(combat, `【${stats.name}】愤怒加成：额外获得 ${wrathBlock} 点格挡！`, 'block');
      }
    }
    if (typeof stats.blockPerOtherHandCard === 'number' && combat.hand.length > 0) {
      const ssBlock = calculateCardBlock(combat.hand.length * stats.blockPerOtherHandCard, state.player);
      addPlayerBlock(state, ssBlock);
      if (ssBlock > 0) {
        pushCombatLog(
          combat,
          `【${stats.name}】根据手中 ${combat.hand.length} 张其他卡牌，获得 ${ssBlock} 点格挡！`,
          'block'
        );
      }
    }
    if (stats.doubleBlock && state.player.block > 0) {
      const added = state.player.block;
      addPlayerBlock(state, added);
      pushCombatLog(combat, `格挡值翻倍，额外获得 ${added} 点格挡！`, 'block');
    }

    // 4b. Apotheosis & Armaments temporary in-combat upgrades
    if (stats.upgradeAllCombatCards) {
      let upCount = 0;
      const allCombatCards = [...combat.hand, ...combat.drawPile, ...combat.discardPile];
      for (const c of allCombatCards) {
        if (canUpgradeCard(c)) {
          upgradeCardInstance(c);
          upCount += 1;
        }
      }
      pushCombatLog(
        combat,
        upCount > 0
          ? `【${stats.name}】神圣光芒降临，本场战斗升级了 ${upCount} 张卡牌！`
          : `【${stats.name}】生效，所有在场卡牌均已达到满级！`,
        'info'
      );
    } else if (stats.upgradeAllHand) {
      let upCount = 0;
      for (const hc of combat.hand) {
        if (canUpgradeCard(hc)) {
          upgradeCardInstance(hc);
          upCount += 1;
        }
      }
      if (upCount > 0) {
        pushCombatLog(combat, `【${stats.name}】强化了手中的 ${upCount} 张卡牌！`, 'info');
      }
    } else if (stats.upgradeHandRandom) {
      const upgradableInHand = combat.hand.filter((hc) => canUpgradeCard(hc));
      const chosen = pickRandom(state, upgradableInHand);
      if (chosen) {
        upgradeCardInstance(chosen);
        const upgName = getCardStats(chosen).name;
        pushCombatLog(combat, `【${stats.name}】临时升级了【${upgName}】！`, 'info');
        pushCardReveal(combat, {
          sourceName: stats.name,
          kind: 'random_upgrade',
          card: chosen,
          summary: `${stats.name}随机升级【${upgName}】`,
        });
      }
    }

    // 4c. Hand-exhausting skills & attacks (True Grit / Second Wind / Sever Soul)
    if (stats.exhaustHandRandom && combat.hand.length > 0) {
      let targetToExhaust = null;
      if (stats.exhaustHandSmart) {
        const badCards = combat.hand.filter((hc) => {
          const t = getCardStats(hc).type;
          return t === 'status' || t === 'curse';
        });
        if (badCards.length > 0) {
          targetToExhaust = pickRandom(state, badCards);
        }
      }
      if (!targetToExhaust) {
        targetToExhaust = pickRandom(state, combat.hand);
      }
      if (targetToExhaust) {
        const idx = combat.hand.findIndex((hc) => hc.instanceId === targetToExhaust.instanceId);
        if (idx !== -1) combat.hand.splice(idx, 1);
        const exhName = getCardStats(targetToExhaust).name;
        pushCardReveal(combat, {
          sourceName: stats.name,
          kind: 'random_exhaust',
          card: targetToExhaust,
          exhausted: true,
          summary: `${stats.name}随机消耗【${exhName}】`,
        });
        exhaustCardsBatch(state, [targetToExhaust]);
      }
    }

    if (stats.exhaustNonAttacksBlockEach) {
      const nonAttacks = combat.hand.filter((hc) => getCardStats(hc).type !== 'attack');
      if (nonAttacks.length > 0) {
        combat.hand = combat.hand.filter((hc) => getCardStats(hc).type === 'attack');
        const perCardBlock = calculateCardBlock(stats.exhaustNonAttacksBlockEach, state.player);
        const totalBlock = perCardBlock * nonAttacks.length;
        if (totalBlock > 0) {
          addPlayerBlock(state, totalBlock);
          pushCombatLog(combat, `【${stats.name}】获得 ${totalBlock} 点格挡。`, 'block');
        }
        exhaustCardsBatch(state, nonAttacks);
      }
    }

    if (stats.exhaustNonAttacksHand) {
      const nonAttacks = combat.hand.filter((hc) => getCardStats(hc).type !== 'attack');
      if (nonAttacks.length > 0) {
        combat.hand = combat.hand.filter((hc) => getCardStats(hc).type === 'attack');
        exhaustCardsBatch(state, nonAttacks);
        if (state.player.hp <= 0 || combat.status !== 'ongoing') {
          return buildPlayResult();
        }
      }
    }

    // 4d. Discard-all hand cards (Calculated Gamble / Storm of Steel)
    if (stats.gambleDiscardAll && combat.hand.length > 0) {
      const toDiscard = [...combat.hand];
      combat.hand = [];
      const discardedCount = discardCardsBatch(state, toDiscard, { manual: true });
      if (getAliveEnemies(combat).length > 0 && state.player.hp > 0) {
        drawCards(state, discardedCount);
      }
    } else if (stats.discardAllForShivs && combat.hand.length > 0) {
      const toDiscard = [...combat.hand];
      combat.hand = [];
      const discardedCount = discardCardsBatch(state, toDiscard, { manual: true });
      if (getAliveEnemies(combat).length > 0 && state.player.hp > 0 && discardedCount > 0) {
        addCardsToHand(state, 'shiv', discardedCount, Boolean(stats.shivUpgraded));
      }
    }

    // 4e. Judgment instant execute & Pressure Points Mark trigger
    if (stats.judgmentThreshold && targetEnemy && targetEnemy.hp > 0) {
      if (targetEnemy.hp <= stats.judgmentThreshold) {
        const prevHp = targetEnemy.hp;
        targetEnemy.hp = 0;
        if (state.stats) {
          state.stats.totalDamageDealt = (state.stats.totalDamageDealt ?? 0) + prevHp;
        }
        pushCombatLog(
          combat,
          `【${stats.name}】神圣裁决！【${targetEnemy.name}】生命值（${prevHp} ≤ ${stats.judgmentThreshold}）瞬间归零！`,
          'victory'
        );
        if (!handleEnemyZeroHp(state, targetEnemy)) {
          targetEnemy.block = 0;
          targetEnemy.intent = null;
          handleEnemyDeathPassives(state, targetEnemy);
        }
      } else {
        pushCombatLog(
          combat,
          `【${targetEnemy.name}】生命值（${targetEnemy.hp}）高于 ${stats.judgmentThreshold}，【${stats.name}】未能裁决。`,
          'info'
        );
      }
    }

    if (stats.applyMarkAndTrigger && targetEnemy && targetEnemy.hp > 0) {
      if (applyStatus(targetEnemy, 'mark', stats.applyMarkAndTrigger)) {
        pushCombatLog(
          combat,
          `【${targetEnemy.name}】获得 ${stats.applyMarkAndTrigger} 层【印记】（当前 ${targetEnemy.statuses.mark} 层）。`,
          'status'
        );
        triggerSadisticNature(state, targetEnemy);
      } else {
        pushCombatLog(combat, `【${targetEnemy.name}】的【人工制品】抵消了【印记】！`, 'status');
      }
      for (const enemy of [...getAliveEnemies(combat)]) {
        if (enemy.hp <= 0) continue;
        const markStacks = enemy.statuses?.mark ?? 0;
        if (markStacks > 0) {
          const cappedMark = applyEnemyInvincibleCap(combat, enemy, markStacks);
          const markLoss = Math.min(enemy.hp, cappedMark);
          enemy.hp = Math.max(0, enemy.hp - cappedMark);
          if (state.stats && markLoss > 0) {
            state.stats.totalDamageDealt = (state.stats.totalDamageDealt ?? 0) + markLoss;
            state.stats.highestSingleHit = Math.max(state.stats.highestSingleHit ?? 0, markLoss);
          }
          if (cappedMark > 0) {
            pushCombatLog(
              combat,
              `【印记】引爆：【${enemy.name}】无视格挡失去 ${cappedMark} 点生命！`,
              'attack'
            );
          }
          if (enemy.hp <= 0 && !handleEnemyZeroHp(state, enemy)) {
            enemy.block = 0;
            enemy.intent = null;
            pushCombatLog(combat, `【${enemy.name}】被【印记】击倒！`, 'victory');
            handleEnemyDeathPassives(state, enemy);
          }
        }
      }
    }

    // 5. Attack hits (Fiend Fire, Reaper, Bane, Finisher, Bowling Bash, Wallop, Lesson Learned, Ragnarok, Mind Blast, Rampage, Ritual Dagger, Unload, etc.)
    if (stats.exhaustAllHandDamageEach) {
      const toExhaust = [...combat.hand];
      combat.hand = [];
      const hitCount = toExhaust.length;
      exhaustCardsBatch(state, toExhaust);

      if (targetEnemy && hitCount > 0) {
        for (let h = 0; h < hitCount; h += 1) {
          if (targetEnemy.hp <= 0 || state.player.hp <= 0 || combat.status !== 'ongoing') break;
          const dmg = calculateAttackDamage(stats.exhaustAllHandDamageEach, state.player, targetEnemy, {
            flatBonus,
          });
          dealDamageToEnemy(state, targetEnemy, dmg, { isAttack: true });
        }
      }
    } else {
      if (stats.removeEnemyBlockBeforeDamage && targetEnemy && targetEnemy.hp > 0 && targetEnemy.block > 0) {
        const stripped = targetEnemy.block;
        targetEnemy.block = 0;
        pushCombatLog(
          combat,
          `【${stats.name}】熔毁了【${targetEnemy.name}】的 ${stripped} 点格挡！`,
          'attack'
        );
      }
      let hits;
      if (stats.hitsPerAttackPlayedThisTurn) {
        hits = attacksBeforeThis;
      } else if (stats.hitsPerOrb) {
        hits = state.player.orbs?.length ?? 0;
      } else if (stats.hitsPerLightningChanneled) {
        hits = combat.orbsChanneledByType?.lightning ?? 0;
      } else if (stats.hitsPerAliveEnemy) {
        hits = Math.max(1, getAliveEnemies(combat).length);
      } else if (stats.hitsPerHandSkill) {
        hits = combat.hand.filter((hc) => getCardStats(hc).type === 'skill').length;
      } else if (stats.isXCost) {
        hits = effectiveX;
      } else {
        hits = stats.hits ?? 1;
        if (stats.bonusHitIfPoisoned && targetEnemy && (targetEnemy.statuses?.poison ?? 0) > 0) {
          hits += 1;
          pushCombatLog(combat, `【${stats.name}】触发中毒增伤：追加 1 次打击！`, 'attack');
        }
      }

      const targetWasVulnerable = Boolean(
        targetEnemy && targetEnemy.hp > 0 && (targetEnemy.statuses?.vulnerable ?? 0) > 0
      );
      const targetWasWeak = Boolean(
        targetEnemy && targetEnemy.hp > 0 && (targetEnemy.statuses?.weak ?? 0) > 0
      );

      if (
        (typeof stats.damage === 'number' || stats.useBlockAsDamage || stats.damageFromDrawPileSize) &&
        hits > 0
      ) {
        const strikeCountOffset = isStrikeCard(cardInstance.cardId) ? 1 : 0;
        const extraStrikeBonus = stats.bonusDamagePerStrike
          ? stats.bonusDamagePerStrike * (countCombatStrikeCards(combat) + strikeCountOffset)
          : 0;
        const rawBaseDmg = stats.useBlockAsDamage
          ? state.player.block
          : stats.damageFromDrawPileSize
            ? (combat.drawPile?.length ?? 0)
            : stats.damage;
        const baseDmg = rawBaseDmg + extraStrikeBonus;
        const strMult = stats.strengthMultiplier ?? 1;
        const targetAliveBefore = Boolean(targetEnemy && targetEnemy.hp > 0);
        const targetUnawakenedBefore = Boolean(
          targetEnemy && targetEnemy.templateId === 'awakened_one' && targetEnemy.unawakened
        );
        let totalUnblocked = 0;

        if (stats.randomEnemyHits) {
          for (let h = 0; h < hits; h += 1) {
            if (state.player.hp <= 0 || combat.status !== 'ongoing') break;
            const alive = getAliveEnemies(combat);
            if (alive.length === 0) break;
            const recipient = pickRandom(state, alive);
            if (!recipient) break;
            const dmg = calculateAttackDamage(baseDmg, state.player, recipient, {
              strengthMultiplier: strMult,
              flatBonus,
            });
            totalUnblocked += dealDamageToEnemy(state, recipient, dmg, { isAttack: true });
          }
        } else if (stats.target === 'all_enemies') {
          for (let h = 0; h < hits; h += 1) {
            if (state.player.hp <= 0 || combat.status !== 'ongoing') break;
            const targets = getAliveEnemies(combat);
            if (targets.length === 0) break;
            for (const enemy of targets) {
              if (state.player.hp <= 0 || combat.status !== 'ongoing') break;
              const dmg = calculateAttackDamage(baseDmg, state.player, enemy, {
                strengthMultiplier: strMult,
                flatBonus,
              });
              totalUnblocked += dealDamageToEnemy(state, enemy, dmg, { isAttack: true });
            }
          }
        } else if (targetEnemy) {
          for (let h = 0; h < hits; h += 1) {
            if (targetEnemy.hp <= 0 || state.player.hp <= 0 || combat.status !== 'ongoing') break;
            const dmg = calculateAttackDamage(baseDmg, state.player, targetEnemy, {
              strengthMultiplier: strMult,
              flatBonus,
            });
            totalUnblocked += dealDamageToEnemy(state, targetEnemy, dmg, { isAttack: true });
          }
        }

        if (state.player.hp <= 0 || combat.status !== 'ongoing') {
          return buildPlayResult();
        }

        if (stats.gainEnergyOnKill && targetAliveBefore && targetEnemy && targetEnemy.hp <= 0) {
          state.player.energy += stats.gainEnergyOnKill;
          pushCombatLog(
            combat,
            `【${stats.name}】击杀目标！返还 ${stats.gainEnergyOnKill} 点能量！`,
            'info'
          );
        }

        if (stats.combatDamageScaleOnPlay) {
          cardInstance.combatDamageMod =
            (cardInstance.combatDamageMod ?? 0) + stats.combatDamageScaleOnPlay;
          pushCombatLog(
            combat,
            `【${stats.name}】愈战愈狂：本场战斗基础伤害 +${stats.combatDamageScaleOnPlay}！`,
            'attack'
          );
        }

        if (stats.clawScale) {
          const allCards = [
            cardInstance,
            ...combat.hand,
            ...combat.drawPile,
            ...combat.discardPile,
            ...combat.exhaustPile,
          ];
          const seen = new Set();
          for (const c of allCards) {
            if (c && c.cardId === 'claw' && !seen.has(c.instanceId)) {
              seen.add(c.instanceId);
              c.combatDamageMod = (c.combatDamageMod ?? 0) + stats.clawScale;
            }
          }
          pushCombatLog(combat, `【爪击】协同强化：本场战斗所有爪击伤害 +${stats.clawScale}！`, 'attack');
        }

        if (stats.reduceSelfCostOnPlay) {
          const curCost =
            typeof cardInstance.combatCost === 'number' ? cardInstance.combatCost : (stats.cost ?? 0);
          cardInstance.combatCost = Math.max(0, curCost - stats.reduceSelfCostOnPlay);
        }

        if (stats.weakIfEnemyAttacking && targetIntendsAttackBefore && targetEnemy && targetEnemy.hp > 0) {
          if (applyStatus(targetEnemy, 'weak', stats.weakIfEnemyAttacking)) {
            pushCombatLog(
              combat,
              `【${stats.name}】打断攻势：给予【${targetEnemy.name}】${stats.weakIfEnemyAttacking} 层【虚弱】！`,
              'status'
            );
            triggerSadisticNature(state, targetEnemy);
          } else {
            pushCombatLog(combat, `【${targetEnemy.name}】的【人工制品】抵消了【虚弱】！`, 'status');
          }
        }

        if (stats.blockEqualUnblockedDamage && totalUnblocked > 0) {
          addPlayerBlock(state, totalUnblocked);
          pushCombatLog(
            combat,
            `【${stats.name}】以攻代守：根据未格挡伤害获得 ${totalUnblocked} 点格挡！`,
            'block'
          );
        }

        if (stats.damageDecayPerPlay) {
          cardInstance.combatDamageMod =
            (cardInstance.combatDamageMod ?? 0) - stats.damageDecayPerPlay;
          pushCombatLog(
            combat,
            `【${stats.name}】刃口磨损，本场战斗基础伤害降低 ${stats.damageDecayPerPlay} 点。`,
            'info'
          );
        }

        const hasFatalEffect = Boolean(
          stats.fatal ||
            stats.goldOnKill ||
            stats.maxHpOnKill ||
            stats.fatalPermanentUpgrade ||
            stats.ritualDamageGrowth
        );
        const fatalTriggered = isFatalEnemyKill(targetEnemy, targetAliveBefore);

        if (stats.goldOnKill && fatalTriggered) {
          state.player.gold += stats.goldOnKill;
          if (state.stats) {
            state.stats.goldEarned = (state.stats.goldEarned ?? 0) + stats.goldOnKill;
          }
          pushCombatLog(
            combat,
            `【${stats.name}】斩杀目标，永久获得 ${stats.goldOnKill} 枚金币！`,
            'victory'
          );
          if (hasRelic(state, 'bloody_idol') && state.player.hp > 0) {
            const beforeHp = state.player.hp;
            state.player.hp = Math.min(state.player.maxHp, state.player.hp + 5);
            const healed = state.player.hp - beforeHp;
            syncRedSkullStatus(state);
            if (healed > 0) {
              pushCombatLog(
                combat,
                `遗物【${RELIC_LIBRARY.bloody_idol.name}】触发：获得金币并回复 ${healed} 点生命！`,
                'victory'
              );
            }
          }
        }

        if (stats.maxHpOnKill && fatalTriggered) {
          state.player.maxHp += stats.maxHpOnKill;
          state.player.hp = Math.min(state.player.maxHp, state.player.hp + stats.maxHpOnKill);
          syncRedSkullStatus(state);
          pushCombatLog(
            combat,
            `【${stats.name}】斩杀吞噬目标，最大生命永久 +${stats.maxHpOnKill}（当前 ${state.player.hp}/${state.player.maxHp}）！`,
            'victory'
          );
        }

        if (stats.ritualDamageGrowth && fatalTriggered) {
          cardInstance.ritualBonus = (cardInstance.ritualBonus ?? 0) + stats.ritualDamageGrowth;
          const masterCard = (state.player.deck || []).find(
            (c) => c.instanceId === cardInstance.instanceId
          );
          if (masterCard) {
            masterCard.ritualBonus = (masterCard.ritualBonus ?? 0) + stats.ritualDamageGrowth;
          }
          const nextBase = 15 + (cardInstance.ritualBonus ?? 0);
          pushCombatLog(
            combat,
            `【${stats.name}】斩杀献祭：伤害永久 +${stats.ritualDamageGrowth}（当前基础伤害 ${nextBase}）！`,
            'victory'
          );
        }

        if (stats.fatalPermanentUpgrade && fatalTriggered) {
          const upgradableDeck = (state.player.deck || []).filter((c) => canUpgradeCard(c));
          const chosenDeckCard = pickRandom(state, upgradableDeck);
          if (chosenDeckCard) {
            upgradeCardInstance(chosenDeckCard);
            const upgradedName = getCardStats(chosenDeckCard).name;
            pushCombatLog(
              combat,
              `【${stats.name}】斩杀领悟：永久升级了牌组中的【${upgradedName}】！`,
              'victory'
            );
            pushCardReveal(combat, {
              sourceName: stats.name,
              kind: 'random_upgrade',
              card: chosenDeckCard,
              summary: `${stats.name}斩杀！永久升级【${upgradedName}】`,
            });
          }
        }

        if (hasFatalEffect && targetAliveBefore && targetEnemy && !fatalTriggered) {
          if (targetEnemy.isMinion && targetEnemy.hp <= 0) {
            pushCombatLog(
              combat,
              `【${stats.name}】击杀了爪牙【${targetEnemy.name}】，爪牙单位不会触发【斩杀】效果。`,
              'info'
            );
          } else if ((targetEnemy.darklingRegrowTurns ?? 0) > 0) {
            pushCombatLog(
              combat,
              `【${targetEnemy.name}】触发【生命链接】进入复活状态，未触发【${stats.name}】的【斩杀】效果。`,
              'info'
            );
          } else if (targetUnawakenedBefore && targetEnemy.unawakened === false) {
            pushCombatLog(
              combat,
              `【${targetEnemy.name}】苏醒进入二阶段，未触发【${stats.name}】的【斩杀】效果。`,
              'info'
            );
          }
        }

        if (stats.lifestealUnblocked && totalUnblocked > 0 && state.player.hp > 0) {
          const healed = healPlayerInCombat(state, totalUnblocked);
          if (healed > 0) {
            pushCombatLog(combat, `【${stats.name}】吸取生命，回复了 ${healed} 点生命！`, 'victory');
          }
        }
      }

      if (stats.discardNonAttacksHand && state.player.hp > 0 && combat.status === 'ongoing') {
        const nonAttacks = combat.hand.filter((hc) => getCardStats(hc).type !== 'attack');
        if (nonAttacks.length > 0) {
          combat.hand = combat.hand.filter((hc) => getCardStats(hc).type === 'attack');
          discardCardsBatch(state, nonAttacks, { manual: true });
          pushCombatLog(combat, `【${stats.name}】弃置了手牌中 ${nonAttacks.length} 张非攻击牌。`, 'info');
        }
      }

      if (targetWasVulnerable) {
        if (stats.ifVulnerableBonusEnergy) {
          state.player.energy += stats.ifVulnerableBonusEnergy;
          pushCombatLog(
            combat,
            `【${stats.name}】命中易伤目标：获得 ${stats.ifVulnerableBonusEnergy} 点能量！`,
            'info'
          );
        }
        if (stats.ifVulnerableDraw && getAliveEnemies(combat).length > 0) {
          drawCards(state, stats.ifVulnerableDraw);
        }
      }
      if (targetWasWeak) {
        if (stats.ifWeakBonusEnergy) {
          state.player.energy += stats.ifWeakBonusEnergy;
          pushCombatLog(
            combat,
            `【${stats.name}】命中虚弱目标：获得 ${stats.ifWeakBonusEnergy} 点能量！`,
            'info'
          );
        }
        if (stats.ifWeakDraw && getAliveEnemies(combat).length > 0) {
          drawCards(state, stats.ifWeakDraw);
        }
      }
    }

    if (stats.type === 'attack' && (state.player.statuses?.vigor ?? 0) > 0) {
      delete state.player.statuses.vigor;
    }

    if (stats.putTopDiscardToDraw) {
      totalDiscardToDraw += stats.putTopDiscardToDraw;
    }

    if (stats.shuffleDiscardIntoDraw) {
      reshuffleDiscardIntoDraw(state);
    }

    if (stats.retrieveDiscardRetain) {
      totalRetrieveDiscardRetain += stats.retrieveDiscardRetain;
    }
    if (stats.retrieveDiscardToHand) {
      totalRetrieveDiscardToHand += stats.retrieveDiscardToHand;
    }
    if (stats.pickFromDraw) {
      totalPickFromDraw += stats.pickFromDraw;
    }
    if (stats.exhaustChooseHandForEnergy) {
      totalExhaustForEnergy += stats.exhaustChooseHandForEnergy;
    }

    if (stats.copySelfToDiscard) {
      const copy = createCardInstance(state, cardInstance.cardId, cardInstance.upgraded);
      combat.discardPile.push(copy);
      pushCombatLog(combat, `将 1 张【${stats.name}】复制品放入弃牌堆。`, 'info');
    }

    // 5b. Watcher last-card-type chain bonuses (Crush Joints, Sash Whip, Follow-Up, Sanctity)
    if (stats.ifLastCardType && prevCardType === stats.ifLastCardType.type) {
      if (stats.ifLastCardType.applyEnemyStatuses && targetEnemy && targetEnemy.hp > 0) {
        for (const [sKey, sVal] of Object.entries(stats.ifLastCardType.applyEnemyStatuses)) {
          const sMeta = STATUS_METADATA[sKey];
          if (applyStatus(targetEnemy, sKey, sVal)) {
            pushCombatLog(
              combat,
              `【${stats.name}】连携触发：【${targetEnemy.name}】获得 ${sVal} 层【${sMeta?.name ?? sKey}】！`,
              'status'
            );
            triggerChampionBeltIfVulnerable(state, targetEnemy, sKey, sVal);
            if (sMeta?.polarity === 'debuff') {
              triggerSadisticNature(state, targetEnemy);
            }
          } else {
            pushCombatLog(
              combat,
              `【${targetEnemy.name}】的【人工制品】抵消了【${sMeta?.name ?? sKey}】！`,
              'status'
            );
          }
        }
      }
      if (stats.ifLastCardType.gainEnergy) {
        state.player.energy += stats.ifLastCardType.gainEnergy;
        pushCombatLog(
          combat,
          `【${stats.name}】连携触发：获得 ${stats.ifLastCardType.gainEnergy} 点能量！`,
          'info'
        );
      }
      if (stats.ifLastCardType.draw && getAliveEnemies(combat).length > 0) {
        drawCards(state, stats.ifLastCardType.draw);
      }
    }

    // 6. Enemy status application (Poison, Disarm, Piercing Wail, Malaise, Bouncing Flask, Catalyst, Talk to the Hand, Choke, Dark Shackles, Indignation)
    if (stats.applyEnemyStatuses) {
      const recipients =
        stats.target === 'all_enemies'
          ? getAliveEnemies(combat)
          : targetEnemy && targetEnemy.hp > 0
            ? [targetEnemy]
            : [];
      for (const enemy of recipients) {
        for (const [statusKey, val] of Object.entries(stats.applyEnemyStatuses)) {
          if (enemy.hp <= 0) break;
          if (statusKey === 'poison') {
            applyPoisonToEnemy(state, enemy, val);
          } else {
            const applied = applyStatus(enemy, statusKey, val);
            const statusMeta = STATUS_METADATA[statusKey];
            const statusName = statusMeta?.name ?? statusKey;
            if (!applied) {
              pushCombatLog(combat, `【${enemy.name}】的【人工制品】抵消了【${statusName}】！`, 'status');
            } else {
              pushCombatLog(
                combat,
                val < 0
                  ? `【${enemy.name}】失去 ${Math.abs(val)} 点【${statusName}】。`
                  : `【${enemy.name}】获得 ${val} 层【${statusName}】。`,
                'status'
              );
              triggerChampionBeltIfVulnerable(state, enemy, statusKey, val);
              if (statusMeta?.polarity === 'debuff' || (statusKey === 'strength' && val < 0)) {
                triggerSadisticNature(state, enemy);
              }
            }
          }
        }
      }
    }

    if (stats.ifInWrathVulnAllElseWrath) {
      if (combat.stance === 'wrath') {
        const vulnAmt = stats.ifInWrathVulnAllElseWrath;
        for (const enemy of getAliveEnemies(combat)) {
          if (applyStatus(enemy, 'vulnerable', vulnAmt)) {
            pushCombatLog(combat, `【${stats.name}】愤怒爆发：【${enemy.name}】获得 ${vulnAmt} 层【易伤】！`, 'status');
            triggerChampionBeltIfVulnerable(state, enemy, 'vulnerable', vulnAmt);
            triggerSadisticNature(state, enemy);
          } else {
            pushCombatLog(combat, `【${enemy.name}】的【人工制品】抵消了【易伤】！`, 'status');
          }
        }
      } else {
        changeStance(state, 'wrath');
      }
    }

    if (stats.tempSingleEnemyStrengthLoss && targetEnemy && targetEnemy.hp > 0) {
      if (applyStatus(targetEnemy, 'strength', -stats.tempSingleEnemyStrengthLoss)) {
        applyStatus(targetEnemy, 'gainStrengthEndTurn', stats.tempSingleEnemyStrengthLoss);
        pushCombatLog(
          combat,
          `【${targetEnemy.name}】本回合失去 ${stats.tempSingleEnemyStrengthLoss} 点力量（回合结束恢复）。`,
          'status'
        );
        triggerSadisticNature(state, targetEnemy);
      } else {
        pushCombatLog(combat, `【${targetEnemy.name}】的【人工制品】抵消了力量削减！`, 'status');
      }
    }

    if (stats.tempEnemyStrengthLoss) {
      const recipients =
        stats.target === 'all_enemies'
          ? getAliveEnemies(combat)
          : targetEnemy && targetEnemy.hp > 0
            ? [targetEnemy]
            : [];
      for (const enemy of recipients) {
        if (enemy.hp <= 0) continue;
        if (applyStatus(enemy, 'strength', -stats.tempEnemyStrengthLoss)) {
          applyStatus(enemy, 'gainStrengthEndTurn', stats.tempEnemyStrengthLoss);
          pushCombatLog(
            combat,
            `【${enemy.name}】本回合失去 ${stats.tempEnemyStrengthLoss} 点力量（回合结束恢复）。`,
            'status'
          );
          triggerSadisticNature(state, enemy);
        } else {
          pushCombatLog(combat, `【${enemy.name}】的【人工制品】抵消了力量削减！`, 'status');
        }
      }
    }

    if (stats.xEnemyStrengthLoss || stats.xEnemyWeak) {
      const xVal = effectiveX + (stats.xBonus ?? 0);
      if (xVal > 0 && targetEnemy && targetEnemy.hp > 0) {
        if (stats.xEnemyStrengthLoss) {
          if (applyStatus(targetEnemy, 'strength', -xVal)) {
            pushCombatLog(combat, `【${targetEnemy.name}】永久失去 ${xVal} 点【力量】。`, 'status');
            triggerSadisticNature(state, targetEnemy);
          } else {
            pushCombatLog(combat, `【${targetEnemy.name}】的【人工制品】抵消了力量削减！`, 'status');
          }
        }
        if (stats.xEnemyWeak && targetEnemy.hp > 0) {
          if (applyStatus(targetEnemy, 'weak', xVal)) {
            pushCombatLog(combat, `【${targetEnemy.name}】获得 ${xVal} 层【虚弱】。`, 'status');
            triggerSadisticNature(state, targetEnemy);
          } else {
            pushCombatLog(combat, `【${targetEnemy.name}】的【人工制品】抵消了【虚弱】！`, 'status');
          }
        }
      }
    }

    if (stats.bouncePoison && stats.bounces) {
      for (let b = 0; b < stats.bounces; b += 1) {
        const alive = getAliveEnemies(combat);
        if (alive.length === 0) break;
        const recipient = pickRandom(state, alive);
        if (recipient) {
          applyPoisonToEnemy(state, recipient, stats.bouncePoison);
        }
      }
    }

    if (stats.multiplyPoison && targetEnemy && targetEnemy.hp > 0) {
      const currentPoison = targetEnemy.statuses?.poison ?? 0;
      if (currentPoison > 0) {
        const added = currentPoison * (stats.multiplyPoison - 1);
        if (applyPoisonToEnemy(state, targetEnemy, added) > 0) {
          pushCombatLog(
            combat,
            `【${stats.name}】催化剧毒：【${targetEnemy.name}】的中毒层数跃升至 ${targetEnemy.statuses.poison} 层！`,
            'status'
          );
        }
      } else {
        pushCombatLog(combat, `【${targetEnemy.name}】当前没有中毒，【${stats.name}】未能催化。`, 'info');
      }
    }

    // 6b. Generated cards into hand / drawPile / discardPile & Potion generation
    const masterUp = (state.player.statuses?.masterReality ?? 0) > 0;
    if (stats.addCardsToHand) {
      addCardsToHand(
        state,
        stats.addCardsToHand.cardId,
        stats.addCardsToHand.count,
        Boolean(stats.addCardsToHand.upgraded)
      );
    }

    if (Array.isArray(stats.addDrawCards)) {
      for (const spec of stats.addDrawCards) {
        const qty = spec.count ?? 1;
        const up = Boolean(spec.upgraded || (masterUp && CARD_LIBRARY[spec.cardId]?.upgraded));
        for (let c = 0; c < qty; c += 1) {
          const created = createCardInstance(state, spec.cardId, up);
          const insertIdx = randomInt(state, 0, combat.drawPile.length);
          combat.drawPile.splice(insertIdx, 0, created);
        }
        const cName = CARD_LIBRARY[spec.cardId]?.name ?? spec.cardId;
        pushCombatLog(combat, `将 ${qty} 张【${up ? `${cName}+` : cName}】洗入抽牌堆。`, 'status');
      }
    }

    if (Array.isArray(stats.addDiscardCards)) {
      for (const spec of stats.addDiscardCards) {
        const qty = spec.count ?? 1;
        const up = Boolean(spec.upgraded || (masterUp && CARD_LIBRARY[spec.cardId]?.upgraded));
        for (let c = 0; c < qty; c += 1) {
          const created = createCardInstance(state, spec.cardId, up);
          combat.discardPile.push(created);
        }
        const cName = CARD_LIBRARY[spec.cardId]?.name ?? spec.cardId;
        pushCombatLog(combat, `将 ${qty} 张【${up ? `${cName}+` : cName}】放入弃牌堆。`, 'status');
      }
    }

    if (stats.plantBombDamage) {
      if (!Array.isArray(combat.activeBombs)) combat.activeBombs = [];
      const turns = stats.plantBombTurns || 3;
      combat.activeBombs.push({ turns, damage: stats.plantBombDamage });
      state.player.statuses.theBomb = Math.min(...combat.activeBombs.map((b) => b.turns));
      pushCombatLog(
        combat,
        `埋下【${stats.name}】：${turns} 回合后对所有敌人造成 ${stats.plantBombDamage} 点爆炸伤害！`,
        'status'
      );
    }

    if (stats.obtainRandomPotion) {
      const emptySlot = Array.isArray(state.player.potions)
        ? state.player.potions.findIndex((p) => p === null)
        : -1;
      if (emptySlot !== -1) {
        const potionPool = getAvailablePotionIds(
          state.characterId ?? state.player.characterId ?? 'ironclad'
        );
        const potId = pickRandom(state, potionPool);
        if (potId) {
          state.player.potions[emptySlot] = potId;
          pushCombatLog(
            combat,
            `【${stats.name}】调配出【${POTION_LIBRARY[potId]?.name ?? potId}】！`,
            'victory'
          );
        }
      } else {
        pushCombatLog(combat, `药水栏位已满，【${stats.name}】未能保留新药水。`, 'info');
      }
    }

    if (stats.addRandomCardToHand) {
      const cfg = stats.addRandomCardToHand;
      const targetChar = cfg.character || state.characterId || state.player.characterId || 'ironclad';
      const pool = Object.values(CARD_LIBRARY)
        .filter(
          (c) =>
            getCardCharacter(c) === targetChar &&
            (!cfg.type || c.type === cfg.type) &&
            !c.shopOnly &&
            isGeneratableCombatCard(c)
        )
        .map((c) => c.id);
      const pickedId = pickRandom(state, pool);
      if (pickedId) {
        const added = addCardsToHand(state, pickedId, 1, false);
        if (added[0] && cfg.tempZeroCostTurn && !CARD_LIBRARY[pickedId]?.base?.isXCost) {
          if (!added[0].tempZeroCostTurn) {
            added[0].prevCombatCost = added[0].combatCost ?? null;
          }
          added[0].combatCost = 0;
          added[0].tempZeroCostTurn = true;
        }
        if (added[0]) {
          const addedName = getCardStats(added[0]).name;
          pushCardReveal(combat, {
            sourceName: stats.name,
            kind: 'generated_card',
            card: added[0],
            summary: `${stats.name}生成【${addedName}】${cfg.tempZeroCostTurn ? '（本回合 0 费）' : ''}`,
          });
        }
      }
    }

    if (stats.addRandomColorlessToHand) {
      for (let j = 0; j < stats.addRandomColorlessToHand; j += 1) {
        const pickedId = pickRandom(state, GENERATABLE_COLORLESS_CARD_IDS);
        if (pickedId) {
          addCardsToHand(state, pickedId, 1, false);
        }
      }
    }

    if (stats.shuffleRandomZeroCostToDraw) {
      const cfg = stats.shuffleRandomZeroCostToDraw;
      const charId = state.characterId ?? state.player.characterId ?? 'ironclad';
      const pool = Object.values(CARD_LIBRARY)
        .filter(
          (c) =>
            getCardCharacter(c) === charId &&
            c.type === cfg.type &&
            !c.shopOnly &&
            isGeneratableCombatCard(c)
        )
        .map((c) => c.id);
      const createdNames = [];
      for (let k = 0; k < (cfg.count || 3); k += 1) {
        const pickedId = pickRandom(state, pool);
        if (!pickedId) continue;
        const created = createCardInstance(
          state,
          pickedId,
          Boolean(masterUp && CARD_LIBRARY[pickedId]?.upgraded)
        );
        if (!CARD_LIBRARY[pickedId]?.base?.isXCost) {
          created.combatCost = 0;
        }
        const insertIdx = randomInt(state, 0, combat.drawPile.length);
        combat.drawPile.splice(insertIdx, 0, created);
        createdNames.push(`【${getCardStats(created).name}】`);
      }
      if (createdNames.length > 0) {
        pushCombatLog(
          combat,
          `【${stats.name}】将 ${createdNames.length} 张 0 费${cfg.type === 'attack' ? '攻击' : '技能'}牌洗入抽牌堆：${createdNames.join('、')}！`,
          'info'
        );
      }
    }

    if (stats.transmuteColorlessX && effectiveX > 0) {
      for (let tx = 0; tx < effectiveX; tx += 1) {
        const pickedId = pickRandom(state, GENERATABLE_COLORLESS_CARD_IDS);
        if (!pickedId) continue;
        const added = addCardsToHand(state, pickedId, 1, Boolean(stats.transmuteUpgraded));
        if (added[0] && !CARD_LIBRARY[pickedId]?.base?.isXCost) {
          if (!added[0].tempZeroCostTurn) {
            added[0].prevCombatCost = added[0].combatCost ?? null;
          }
          added[0].combatCost = 0;
          added[0].tempZeroCostTurn = true;
        }
      }
    }

    if (stats.randomHandZeroCostCombat && combat.hand.length > 0) {
      const nonZeroCandidates = combat.hand.filter((hc) => {
        const cStats = getCardStats(hc);
        if (cStats.unplayable || cStats.isXCost) return false;
        const eff = getEffectiveCardCost(cStats, state.player, combat);
        return typeof eff === 'number' && eff > 0;
      });
      const fallbackCandidates =
        nonZeroCandidates.length > 0
          ? nonZeroCandidates
          : combat.hand.filter((hc) => {
              const cStats = getCardStats(hc);
              return !cStats.unplayable && !cStats.isXCost;
            });
      const chosen = pickRandom(state, fallbackCandidates);
      if (chosen) {
        chosen.combatCost = 0;
        delete chosen.tempZeroCostTurn;
        delete chosen.prevCombatCost;
        const cName = getCardStats(chosen).name;
        pushCombatLog(combat, `【${stats.name}】使手牌【${cName}】在本场战斗中费用变为 0！`, 'info');
        pushCardReveal(combat, {
          sourceName: stats.name,
          kind: 'cost_reduce',
          card: chosen,
          summary: `${stats.name}将【${cName}】本场战斗降为 0 费`,
        });
      }
    }

    if (stats.capHandCostToOne) {
      let reducedCount = 0;
      const isCombatPermanent = stats.capHandCostToOne === 'combat';
      for (const hc of combat.hand) {
        const cStats = getCardStats(hc);
        if (cStats.unplayable || cStats.isXCost) continue;
        const eff = getEffectiveCardCost(cStats, state.player, combat);
        if (typeof eff === 'number' && eff > 1) {
          if (isCombatPermanent) {
            hc.combatCost = 1;
            delete hc.tempZeroCostTurn;
            delete hc.prevCombatCost;
          } else {
            if (!hc.tempZeroCostTurn) {
              hc.prevCombatCost = hc.combatCost ?? null;
            }
            hc.combatCost = 1;
            hc.tempZeroCostTurn = true;
          }
          reducedCount += 1;
        }
      }
      pushCombatLog(
        combat,
        reducedCount > 0
          ? `【${stats.name}】将手牌中 ${reducedCount} 张高费牌${isCombatPermanent ? '本场战斗' : '本回合'}费用降至 1！`
          : `【${stats.name}】生效，手牌中当前没有高于 1 费的卡牌。`,
        'info'
      );
    }

    if (stats.zeroAllHandCostThisTurn) {
      let zeroed = 0;
      for (const hc of combat.hand) {
        const cStats = getCardStats(hc);
        if (cStats.unplayable || cStats.isXCost) continue;
        if (!hc.tempZeroCostTurn) {
          hc.prevCombatCost = hc.combatCost ?? null;
        }
        hc.combatCost = 0;
        hc.tempZeroCostTurn = true;
        zeroed += 1;
      }
      pushCombatLog(
        combat,
        `【${stats.name}】生效：本回合所有手牌（${zeroed} 张）费用变为 0，且本回合无法再抽牌！`,
        'status'
      );
    }

    if (typeof stats.nextTurnDrawAndEnergyX === 'number') {
      const amt = Math.max(0, effectiveX + stats.nextTurnDrawAndEnergyX);
      if (amt > 0) {
        applyStatus(state.player, 'energized', amt);
        applyStatus(state.player, 'drawCardNextTurn', amt);
        pushCombatLog(
          combat,
          `【${stats.name}】生效：下回合开始时额外获得 ${amt} 点能量并多抽 ${amt} 张牌！`,
          'status'
        );
      }
    }

    if (typeof stats.collectMiracleTurnsX === 'number') {
      const turns = Math.max(0, effectiveX + stats.collectMiracleTurnsX);
      if (turns > 0) {
        applyStatus(state.player, 'collect', turns);
        pushCombatLog(
          combat,
          `【${stats.name}】生效：接下来 ${turns} 回合开始时各获得 1 张【奇迹+】！`,
          'status'
        );
      }
    }

    if (typeof stats.conjureExpungerX === 'number') {
      const hits = Math.max(1, effectiveX + stats.conjureExpungerX);
      const expunger = createCardInstance(state, 'expunger', Boolean(masterUp));
      expunger.expungerHits = hits;
      const insertIdx = randomInt(state, 0, combat.drawPile.length);
      combat.drawPile.splice(insertIdx, 0, expunger);
      pushCombatLog(
        combat,
        `【${stats.name}】凝结出 ${hits} 段连击的【${getCardStats(expunger).name}】并洗入抽牌堆！`,
        'info'
      );
    }

    // 7. Self status application, Limit Break, Stances, Mantra & Orbs
    if (stats.applySelfStatuses) {
      for (const [statusKey, val] of Object.entries(stats.applySelfStatuses)) {
        const applied = applyStatus(state.player, statusKey, val);
        const statusName = STATUS_METADATA[statusKey]?.name ?? statusKey;
        if (!applied) {
          pushCombatLog(combat, `【人工制品】抵消了【${statusName}】！`, 'status');
        } else if (val < 0) {
          pushCombatLog(combat, `玩家失去 ${Math.abs(val)} 点【${statusName}】。`, 'status');
        } else {
          pushCombatLog(combat, `玩家获得 ${val} 层【${statusName}】。`, 'status');
        }
      }
    }
    if (stats.doubleStrength) {
      const curStr = state.player.statuses?.strength ?? 0;
      if (curStr > 0) {
        applyStatus(state.player, 'strength', curStr);
        pushCombatLog(
          combat,
          `【${stats.name}】使力量翻倍（当前力量 ${state.player.statuses.strength} 点）！`,
          'status'
        );
      } else {
        pushCombatLog(combat, `当前力量为 ${curStr}，【${stats.name}】未能叠加更多力量。`, 'info');
      }
    }

    if (stats.ifTargetAttackingEnterStance && targetIntendsAttackBefore) {
      changeStance(state, stats.ifTargetAttackingEnterStance);
    }
    if (stats.ifInCalmDrawElseCalm) {
      if (combat.stance === 'calm') {
        drawCards(state, stats.ifInCalmDrawElseCalm);
      } else {
        changeStance(state, 'calm');
      }
    }
    if (stats.enterStance) {
      changeStance(state, stats.enterStance);
    }
    if (stats.exitStance) {
      changeStance(state, 'neutral');
    }
    if (stats.gainMantra) {
      gainMantra(state, stats.gainMantra);
    }

    // 7b. Defect Orb slots, channeling, evoking, Recursion, Darkness+, and Fission
    if (stats.gainOrbSlots) {
      gainOrbSlots(state, stats.gainOrbSlots, { sourceName: stats.name });
    }
    if (stats.removeOrbSlots) {
      removeOrbSlots(state, stats.removeOrbSlots, { sourceName: stats.name });
    }
    if (stats.channelOrb) {
      channelOrb(state, stats.channelOrb, { sourceName: stats.name });
    }
    if (Array.isArray(stats.channelOrbs)) {
      for (const orbType of stats.channelOrbs) {
        if (state.player.hp <= 0 || combat.status !== 'ongoing') break;
        channelOrb(state, orbType, { sourceName: stats.name });
      }
    }
    if (stats.channelRandomOrbs) {
      for (let r = 0; r < stats.channelRandomOrbs; r += 1) {
        if (state.player.hp <= 0 || combat.status !== 'ongoing') break;
        const randType = pickRandom(state, ORB_TYPES);
        if (randType) {
          channelOrb(state, randType, { sourceName: stats.name });
        }
      }
    }
    if (stats.channelFrostPerEnemy) {
      const aliveCount = getAliveEnemies(combat).length;
      for (let f = 0; f < aliveCount; f += 1) {
        if (state.player.hp <= 0 || combat.status !== 'ongoing') break;
        channelOrb(state, 'frost', { sourceName: stats.name });
      }
    }
    if (typeof stats.channelLightningX === 'number') {
      const totalLight = Math.max(0, effectiveX + stats.channelLightningX);
      for (let l = 0; l < totalLight; l += 1) {
        if (state.player.hp <= 0 || combat.status !== 'ongoing') break;
        channelOrb(state, 'lightning', { sourceName: stats.name });
      }
    }
    if (stats.triggerAllDarkPassives) {
      triggerAllDarkPassives(state, { sourceName: stats.name });
    }
    if (stats.evokeFront) {
      evokeFrontOrb(state, stats.evokeFront);
    }
    if (typeof stats.evokeFrontX === 'number') {
      const totalEvokes = Math.max(0, effectiveX + stats.evokeFrontX);
      if (totalEvokes > 0) {
        evokeFrontOrb(state, totalEvokes);
      }
    }
    if (stats.recursionFront) {
      evokeFrontOrb(state, 1, { rechannel: true });
    }
    if (stats.fissionOrbs) {
      const count =
        stats.fissionOrbs === 'evoke' ? evokeAllOrbs(state) : removeAllOrbs(state);
      if (count > 0 && state.player.hp > 0 && combat.status === 'ongoing') {
        state.player.energy += count;
        pushCombatLog(
          combat,
          `【${stats.name}】${stats.fissionOrbs === 'evoke' ? '激发' : '移除'}了 ${count} 个充能球，获得 ${count} 点能量并抽 ${count} 张牌！`,
          'info'
        );
        if (getAliveEnemies(combat).length > 0) {
          drawCards(state, count);
        }
      }
    }

    if (state.player.hp <= 0 || combat.status !== 'ongoing') {
      return buildPlayResult();
    }

    // 7c. Defect card manipulation & conditional draws (Compile Driver, FTL, Scrape, All for One, White Noise, Reboot)
    if (stats.drawPerUniqueOrb) {
      const uniqueCount = countUniqueOrbs(state.player);
      if (uniqueCount > 0) {
        drawCards(state, uniqueCount * stats.drawPerUniqueOrb);
      }
    }
    if (stats.drawIfCardsPlayedUnder && cardsPlayedBeforeThis + pass < stats.drawIfCardsPlayedUnder) {
      drawCards(state, 1);
    }
    if (stats.drawAndDiscardNonZeroCost) {
      const drawnNow = [];
      drawCards(state, stats.drawAndDiscardNonZeroCost, { outDrawnCards: drawnNow });
      const nonZero = [];
      for (const dc of drawnNow) {
        const dcStats = getCardStats(dc);
        const dcCost = getEffectiveCardCost(dcStats, state.player, combat);
        if (dcCost !== 0) {
          const hIdx = combat.hand.findIndex((h) => h.instanceId === dc.instanceId);
          if (hIdx !== -1) {
            combat.hand.splice(hIdx, 1);
            nonZero.push(dc);
          }
        }
      }
      if (nonZero.length > 0) {
        discardCardsBatch(state, nonZero, { manual: true });
        pushCombatLog(combat, `【${stats.name}】弃置了 ${nonZero.length} 张非 0 费牌。`, 'info');
      }
    }
    if (stats.retrieveAllZeroCostFromDiscard) {
      const picked = [];
      const keptDiscard = [];
      for (const dc of combat.discardPile) {
        const dcStats = getCardStats(dc);
        const dcCost = getEffectiveCardCost(dcStats, state.player, combat);
        if (dcCost === 0 && combat.hand.length < MAX_HAND_SIZE) {
          combat.hand.push(dc);
          picked.push(dcStats.name);
        } else {
          keptDiscard.push(dc);
        }
      }
      combat.discardPile = keptDiscard;
      if (picked.length > 0) {
        pushCombatLog(
          combat,
          `【${stats.name}】从弃牌堆取回 ${picked.length} 张 0 费牌：${picked.map((n) => `【${n}】`).join('、')}！`,
          'info'
        );
      }
    }
    if (stats.addRandomPowerZeroCost) {
      const defectPowerPool = Object.values(CARD_LIBRARY)
        .filter((c) => getCardCharacter(c) === 'defect' && c.type === 'power' && isGeneratableCombatCard(c))
        .map((c) => c.id);
      const pickedId = pickRandom(state, defectPowerPool);
      if (pickedId && combat.hand.length < MAX_HAND_SIZE) {
        const created = createCardInstance(
          state,
          pickedId,
          Boolean(masterUp && CARD_LIBRARY[pickedId]?.upgraded)
        );
        created.prevCombatCost = null;
        created.combatCost = 0;
        created.tempZeroCostTurn = true;
        combat.hand.push(created);
        pushCombatLog(
          combat,
          `【${stats.name}】生成了 0 费能力牌【${getCardStats(created).name}】加入手牌！`,
          'info'
        );
      }
    }
    if (stats.rebootDraw) {
      const recycled = [...combat.hand, ...combat.discardPile];
      combat.hand = [];
      combat.discardPile = [];
      combat.drawPile = shuffled(state, [...combat.drawPile, ...recycled]);
      combat.reshuffleCount = (combat.reshuffleCount ?? 0) + 1;
      pushCombatLog(
        combat,
        `【${stats.name}】将手牌与弃牌堆全部洗回抽牌堆，重新抽 ${stats.rebootDraw} 张牌！`,
        'info'
      );
      drawCards(state, stats.rebootDraw);
    }

    // 8. Draw cards (& Scrawl / Expertise / Impatience / Violence / Escape Plan / deferred Scry+Draw)
    if (stats.drawUntilHandFull) {
      const needDraw = Math.max(0, MAX_HAND_SIZE - combat.hand.length);
      if (needDraw > 0) {
        drawCards(state, needDraw);
      }
    } else if (stats.drawUpToHandSize) {
      const needDraw = Math.max(0, stats.drawUpToHandSize - combat.hand.length);
      if (needDraw > 0) {
        drawCards(state, needDraw);
      }
    } else if (stats.drawIfNoAttackInHand) {
      const hasAttack = combat.hand.some((hc) => getCardStats(hc).type === 'attack');
      if (!hasAttack) {
        drawCards(state, stats.drawIfNoAttackInHand);
      } else {
        pushCombatLog(combat, `手牌中仍有攻击牌，【${stats.name}】未抽牌。`, 'info');
      }
    } else if (stats.drawAttacksFromDrawPile) {
      const want = stats.drawAttacksFromDrawPile;
      let moved = 0;
      for (let k = 0; k < want; k += 1) {
        if (combat.hand.length >= MAX_HAND_SIZE) break;
        const attackIndices = [];
        for (let idx = 0; idx < combat.drawPile.length; idx += 1) {
          if (getCardStats(combat.drawPile[idx]).type === 'attack') {
            attackIndices.push(idx);
          }
        }
        if (attackIndices.length === 0) break;
        const chosenIdx = pickRandom(state, attackIndices);
        const [drawnAtk] = combat.drawPile.splice(chosenIdx, 1);
        if (drawnAtk) {
          combat.hand.push(drawnAtk);
          moved += 1;
        }
      }
      pushCombatLog(combat, `【${stats.name}】从抽牌堆抽取了 ${moved} 张攻击牌！`, 'info');
    } else if (stats.draw) {
      if (stats.scry && !stats.drawSkillGainBlock) {
        totalDrawAfterScry += stats.draw;
      } else {
        const drawnNow = [];
        drawCards(state, stats.draw, { outDrawnCards: drawnNow });
        if (
          stats.drawSkillGainBlock &&
          drawnNow.length > 0 &&
          getCardStats(drawnNow[0]).type === 'skill'
        ) {
          const epBlock = calculateCardBlock(stats.drawSkillGainBlock, state.player);
          addPlayerBlock(state, epBlock);
          pushCombatLog(combat, `【${stats.name}】抽到了技能牌，获得 ${epBlock} 点格挡！`, 'block');
        }
      }
    }

    if (stats.discardRandomHand && combat.hand.length > 0) {
      const toDiscard = [];
      for (let d = 0; d < stats.discardRandomHand; d += 1) {
        if (combat.hand.length === 0) break;
        const randIdx = randomInt(state, 0, combat.hand.length - 1);
        const [removed] = combat.hand.splice(randIdx, 1);
        if (removed) {
          toDiscard.push(removed);
          const discName = getCardStats(removed).name;
          pushCardReveal(combat, {
            sourceName: stats.name,
            kind: 'random_discard',
            card: removed,
            summary: `${stats.name}随机弃置【${discName}】`,
          });
        }
      }
      if (toDiscard.length > 0) {
        discardCardsBatch(state, toDiscard, { manual: true });
      }
    }

    // 8b. Havoc: play top card of draw pile and exhaust it (safe chain depth <= 5)
    const havocDepth = internalOpts.havocDepth ?? 0;
    if (stats.playTopDrawAndExhaust && havocDepth < 5 && getAliveEnemies(combat).length > 0) {
      if (combat.drawPile.length === 0 && combat.discardPile.length > 0) {
        reshuffleDiscardIntoDraw(state);
      }
      const topCard = combat.drawPile.shift();
      if (!topCard) {
        const emptySummary = `【${stats.name}】发动，但抽牌堆与弃牌堆均为空，未能打出卡牌。`;
        pushCombatLog(combat, emptySummary, 'info');
        pushCardReveal(combat, {
          sourceName: stats.name,
          kind: 'empty',
          card: null,
          summary: emptySummary,
        });
      } else {
        const topStats = getCardStats(topCard);
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
        if (
          blockedByEntangle ||
          blockedByClash ||
          blockedBySignature ||
          blockedByGrandFinale ||
          (topStats.unplayable && !(topStats.type === 'status' && hasRelic(state, 'medical_kit')))
        ) {
          const reasonText = blockedByEntangle
            ? `处于【缠网】状态，【${stats.name}】翻出的攻击牌【${topStats.name}】无法打出并被消耗。`
            : blockedByClash
              ? `手牌存在非攻击牌，【${stats.name}】翻出的【${topStats.name}】无法打出并被消耗。`
              : blockedBySignature
                ? `手牌存在其他攻击牌，【${stats.name}】翻出的【${topStats.name}】无法打出并被消耗。`
                : blockedByGrandFinale
                  ? `抽牌堆非空，【${stats.name}】翻出的【${topStats.name}】无法打出并被消耗。`
                  : `【${stats.name}】翻出不可打出的【${topStats.name}】并将其消耗。`;
          pushCombatLog(combat, reasonText, 'info');
          pushCardReveal(combat, {
            sourceName: stats.name,
            kind: 'auto_exhaust',
            card: topCard,
            exhausted: true,
            summary: blockedByEntangle
              ? `${stats.name}翻出【${topStats.name}】（受缠网无法打出，已消耗）`
              : blockedByClash
                ? `${stats.name}翻出【${topStats.name}】（不满足仅攻击牌条件，已消耗）`
                : blockedBySignature
                  ? `${stats.name}翻出【${topStats.name}】（手牌含其他攻击牌，已消耗）`
                  : blockedByGrandFinale
                    ? `${stats.name}翻出【${topStats.name}】（抽牌堆非空，已消耗）`
                    : `${stats.name}翻出不可打出的【${topStats.name}】并消耗`,
          });
          exhaustCardsBatch(state, [topCard]);
        } else {
          const aliveForHavoc = getAliveEnemies(combat);
          const havocTarget = topStats.target === 'enemy' ? pickRandom(state, aliveForHavoc) : null;
          const willExhaust = topStats.type !== 'power';
          combat.hand.push(topCard);
          const targetSuffix = havocTarget ? `（目标：${havocTarget.name}）` : '';
          const actionSuffix = willExhaust ? '并将其消耗' : '（能力生效）';
          pushCombatLog(
            combat,
            `【${stats.name}】触发：免费打出抽牌堆顶的【${topStats.name}】${actionSuffix}${targetSuffix}！`,
            'card'
          );
          pushCardReveal(combat, {
            sourceName: stats.name,
            kind: 'auto_play',
            card: topCard,
            targetName: havocTarget?.name || null,
            exhausted: willExhaust,
            summary: `${stats.name}自动打出【${topStats.name}】${actionSuffix}${targetSuffix}`,
          });
          playCard(state, topCard.instanceId, havocTarget?.id ?? null, onVictoryCallback, {
            forceFree: true,
            forceExhaust: willExhaust,
            fromHavoc: true,
            havocDepth: havocDepth + 1,
          });
          if (combat.status !== 'ongoing' || state.player.hp <= 0) {
            return buildPlayResult();
          }
        }
      }
    }

    // 9. Post-draw self statuses (e.g. Battle Trance noDraw, Bullet Time noDraw, Panic Button noBlock)
    if (stats.applySelfStatusesAfter) {
      for (const [statusKey, val] of Object.entries(stats.applySelfStatusesAfter)) {
        const applied = applyStatus(state.player, statusKey, val);
        const statusName = STATUS_METADATA[statusKey]?.name ?? statusKey;
        if (!applied) {
          pushCombatLog(combat, `【人工制品】抵消了【${statusName}】！`, 'status');
        } else if (statusKey === 'noBlock') {
          pushCombatLog(combat, `玩家获得 ${val} 回合【无法格挡】。`, 'status');
        }
      }
    }

    // 9b. Player per-card, per-attack & per-skill reactive powers & relics
    if (stats.type === 'attack') {
      combat.attacksPlayedThisTurn = (combat.attacksPlayedThisTurn ?? 0) + 1;
      if ((state.player.statuses?.rage ?? 0) > 0) {
        const rageBlock = state.player.statuses.rage;
        addPlayerBlock(state, rageBlock);
        pushCombatLog(combat, `【狂怒】触发：获得 ${rageBlock} 点格挡。`, 'block');
      }
      if (hasRelic(state, 'nunchaku')) {
        if (!state.relicCounters) state.relicCounters = {};
        const next = ((state.relicCounters.nunchaku ?? 0) + 1) % 10;
        state.relicCounters.nunchaku = next;
        if (next === 0) {
          state.player.energy += 1;
          pushCombatLog(
            combat,
            `遗物【${RELIC_LIBRARY.nunchaku.name}】触发（累计 10 次攻击）：获得 1 点能量！`,
            'info'
          );
        }
      }
      if (hasRelic(state, 'pen_nib') && pass === 0) {
        if (!state.relicCounters) state.relicCounters = {};
        const next = ((state.relicCounters.pen_nib ?? 0) + 1) % 10;
        state.relicCounters.pen_nib = next;
        state.player.penNibActive = next === 9;
      }
      if (hasRelic(state, 'duality')) {
        applyStatus(state.player, 'dexterity', 1);
        applyStatus(state.player, 'tempDexterityDown', 1);
      }
      if (hasRelic(state, 'shuriken')) {
        combat.shurikenCounter = (combat.shurikenCounter ?? 0) + 1;
        if (combat.shurikenCounter >= 3) {
          combat.shurikenCounter = 0;
          applyStatus(state.player, 'strength', 1);
          pushCombatLog(combat, `遗物【${RELIC_LIBRARY.shuriken.name}】触发：获得 1 点【力量】！`, 'status');
        }
      }
      if (hasRelic(state, 'kunai')) {
        combat.kunaiCounter = (combat.kunaiCounter ?? 0) + 1;
        if (combat.kunaiCounter >= 3) {
          combat.kunaiCounter = 0;
          applyStatus(state.player, 'dexterity', 1);
          pushCombatLog(combat, `遗物【${RELIC_LIBRARY.kunai.name}】触发：获得 1 点【敏捷】！`, 'status');
        }
      }
      if (hasRelic(state, 'ornamental_fan')) {
        combat.ornamentalFanCounter = (combat.ornamentalFanCounter ?? 0) + 1;
        if (combat.ornamentalFanCounter >= 3) {
          combat.ornamentalFanCounter = 0;
          addPlayerBlock(state, 4);
          pushCombatLog(combat, `遗物【${RELIC_LIBRARY.ornamental_fan.name}】触发：获得 4 点格挡！`, 'block');
        }
      }
    }

    if (stats.type === 'skill' && hasRelic(state, 'letter_opener')) {
      combat.skillsPlayedThisTurn = (combat.skillsPlayedThisTurn ?? 0) + 1;
      if (combat.skillsPlayedThisTurn % 3 === 0) {
        const alive = getAliveEnemies(combat);
        if (alive.length > 0) {
          pushCombatLog(
            combat,
            `遗物【${RELIC_LIBRARY.letter_opener.name}】触发（本回合第 ${combat.skillsPlayedThisTurn} 张技能）：对所有敌人造成 5 点伤害！`,
            'attack'
          );
          for (const enemy of alive) {
            dealDamageToEnemy(state, enemy, 5, { isAttack: false });
          }
        }
      }
    }

    if ((state.player.statuses.panache ?? 0) > 0 && stats.cardId !== 'panache') {
      combat.panacheCounter = (combat.panacheCounter ?? 0) + 1;
      if (combat.panacheCounter >= 5) {
        combat.panacheCounter = 0;
        const pDmg = state.player.statuses.panache;
        const alive = getAliveEnemies(combat);
        if (alive.length > 0) {
          pushCombatLog(combat, `【神气制胜】触发（连出 5 牌）：对所有敌人造成 ${pDmg} 点伤害！`, 'attack');
          for (const enemy of alive) {
            dealDamageToEnemy(state, enemy, pDmg, { isAttack: false });
          }
        }
      }
    }

    // Choke trigger on enemies that already had Choke before this card
    for (const [eid, chokeDmg] of chokedEnemiesBefore.entries()) {
      const chokedEnemy = combat.enemies.find((e) => e.id === eid && e.hp > 0);
      if (chokedEnemy && chokeDmg > 0) {
        const cappedChoke = applyEnemyInvincibleCap(combat, chokedEnemy, chokeDmg);
        const loss = Math.min(chokedEnemy.hp, cappedChoke);
        chokedEnemy.hp = Math.max(0, chokedEnemy.hp - cappedChoke);
        if (state.stats && loss > 0) {
          state.stats.totalDamageDealt = (state.stats.totalDamageDealt ?? 0) + loss;
          state.stats.highestSingleHit = Math.max(state.stats.highestSingleHit ?? 0, loss);
        }
        if (cappedChoke > 0) {
          pushCombatLog(combat, `【勒脖】触发：【${chokedEnemy.name}】失去 ${cappedChoke} 点生命！`, 'attack');
        }
        if (chokedEnemy.hp <= 0 && !handleEnemyZeroHp(state, chokedEnemy)) {
          chokedEnemy.block = 0;
          chokedEnemy.intent = null;
          handleEnemyDeathPassives(state, chokedEnemy);
        }
      }
    }

    if ((state.player.statuses.afterImage ?? 0) > 0 && stats.cardId !== 'after_image') {
      const aiBlock = state.player.statuses.afterImage;
      addPlayerBlock(state, aiBlock);
    }
    if ((state.player.statuses.thousandCuts ?? 0) > 0 && stats.cardId !== 'a_thousand_cuts') {
      const cutDmg = state.player.statuses.thousandCuts;
      const alive = getAliveEnemies(combat);
      for (const enemy of alive) {
        dealDamageToEnemy(state, enemy, cutDmg, { isAttack: false });
      }
    }

    // 10. Enemy reactive passives (Enrage on Skill, Sharp Hide on Attack, Curiosity on Power)
    for (const enemy of getAliveEnemies(combat)) {
      if (stats.type === 'skill' && (enemy.statuses.enrage ?? 0) > 0) {
        const gain = enemy.statuses.enrage;
        applyStatus(enemy, 'strength', gain);
        pushCombatLog(combat, `【${enemy.name}】因【激怒】获得 ${gain} 点力量！`, 'status');
      }
      if (stats.type === 'attack' && (enemy.statuses.sharpHide ?? 0) > 0) {
        const thorns = enemy.statuses.sharpHide;
        dealDamageToPlayer(state, thorns, `【${enemy.name}】的锋利外壳`);
        if (combat.status !== 'ongoing') {
          return buildPlayResult();
        }
      }
      if (stats.type === 'power' && (enemy.statuses.curiosity ?? 0) > 0) {
        const gain = enemy.statuses.curiosity;
        applyStatus(enemy, 'strength', gain);
        pushCombatLog(
          combat,
          `【${enemy.name}】因【好奇】目睹能力牌，获得 ${gain} 点力量！`,
          'status'
        );
      }
    }

    if (stats.discardHand) {
      totalManualDiscard += stats.discardHand;
    }
    if (stats.exhaustHandChoice) {
      totalManualExhaust += stats.exhaustHandChoice;
    }
    if (stats.drawAfterExhaustChoice) {
      totalDrawAfterExhaust += stats.drawAfterExhaustChoice;
    }
    if (stats.exhaustUpToHandChoice) {
      totalExhaustMulti += stats.exhaustUpToHandChoice;
    }
    if (stats.upgradeHandChoice) {
      totalManualUpgrade += stats.upgradeHandChoice;
    }
    if (stats.putHandToDrawTopChoice) {
      totalHandToDrawTop += stats.putHandToDrawTopChoice;
      if (stats.setZeroCostUntilPlayedOnDrawTop) totalHandToDrawTopZero = true;
    }
    if (stats.putHandToDrawBottomChoice) {
      totalHandToDrawBottom += stats.putHandToDrawBottomChoice;
      if (stats.setZeroCostUntilPlayedOnDrawBottom) totalHandToDrawBottomZero = true;
    }
    if (stats.putHandToDrawBottomMultiChoice) {
      totalHandToDrawBottomMulti = true;
      if (stats.setZeroCostUntilPlayedOnDrawBottom) totalHandToDrawBottomZero = true;
    }
    if (stats.duplicateAttackOrPowerHandChoice) {
      totalDualWieldCopies += stats.duplicateAttackOrPowerHandChoice;
    }
    if (stats.nightmareHandChoice) {
      totalNightmareCopies += stats.nightmareHandChoice;
    }
    if (stats.retrieveExhaustToHand) {
      totalRetrieveExhaust += stats.retrieveExhaustToHand;
    }
    if (stats.pickFromDrawType) {
      pickFromDrawType = stats.pickFromDrawType;
    }
    if (stats.playFromDrawTwiceAndExhaust) {
      totalOmniscience += stats.playFromDrawTwiceAndExhaust;
    }
    if (stats.discoverCardChoice) {
      pendingDiscoverCfg = stats.discoverCardChoice;
    }
    if (stats.wishChoice) {
      pendingWishCfg = stats.wishChoice;
    }
    if (stats.scry) {
      totalScry += stats.scry;
    }
  }

  if (stats.type === 'attack' || stats.type === 'skill' || stats.type === 'power') {
    combat.lastCardTypePlayed = stats.type;
  }

  // 11. Move card to final destination (before pendingCardChoice so deck cycle stays exact)
  if (stats.type === 'power') {
    // Powers stay active on character and leave deck cycle for combat (never exhausted even via Havoc)
  } else if (
    internalOpts.forceExhaust ||
    stats.exhaust ||
    corruptionActive ||
    (stats.type === 'status' && stats.unplayable && hasRelic(state, 'medical_kit'))
  ) {
    exhaustCardsBatch(state, [cardInstance]);
  } else if (reboundWasActive && (state.player.statuses?.rebound ?? 0) > 0) {
    state.player.statuses.rebound -= 1;
    if (state.player.statuses.rebound <= 0) {
      delete state.player.statuses.rebound;
    }
    combat.drawPile.unshift(cardInstance);
    pushCombatLog(combat, `【弹回】生效：【${stats.name}】已置于抽牌堆顶！`, 'info');
  } else if (stats.shuffleSelfToDraw) {
    const insertIdx = randomInt(state, 0, combat.drawPile.length);
    combat.drawPile.splice(insertIdx, 0, cardInstance);
    pushCombatLog(combat, `【${stats.name}】已洗回抽牌堆。`, 'info');
  } else {
    combat.discardPile.push(cardInstance);
  }

  if (stats.type === 'power' && getAliveEnemies(combat).length > 0 && state.player.hp > 0) {
    if (heatsinksBefore > 0) {
      drawCards(state, heatsinksBefore);
      pushCombatLog(combat, `【散热片】触发：打出能力牌，额外抽 ${heatsinksBefore} 张牌！`, 'info');
    }
    if (stormBefore > 0) {
      for (let st = 0; st < stormBefore; st += 1) {
        if (state.player.hp <= 0 || combat.status !== 'ongoing') break;
        channelOrb(state, 'lightning', { sourceName: '雷暴' });
      }
    }
  }

  if (stats.type === 'power' && hasRelic(state, 'bird_faced_urn') && state.player.hp > 0) {
    const urnHealed = healPlayerInCombat(state, 2);
    if (urnHealed > 0) {
      pushCombatLog(
        combat,
        `遗物【${RELIC_LIBRARY.bird_faced_urn.name}】触发：打出能力牌回复 ${urnHealed} 点生命！`,
        'victory'
      );
    }
  }

  if (stats.type === 'power' && hasRelic(state, 'mummified_hand') && getAliveEnemies(combat).length > 0) {
    const candidates = combat.hand.filter((hc) => {
      const cStats = getCardStats(hc);
      if (cStats.unplayable || cStats.isXCost) return false;
      return (getEffectiveCardCost(cStats, state.player, combat) ?? 0) > 0;
    });
    const chosen = pickRandom(state, candidates);
    if (chosen) {
      if (!chosen.tempZeroCostTurn) {
        chosen.prevCombatCost = chosen.combatCost ?? null;
      }
      chosen.combatCost = 0;
      chosen.tempZeroCostTurn = true;
      pushCombatLog(
        combat,
        `遗物【${RELIC_LIBRARY.mummified_hand.name}】触发：手牌【${getCardStats(chosen).name}】本回合费用变为 0！`,
        'info'
      );
    }
  }

  if (combat.playedCardTypesThisTurn && ['attack', 'skill', 'power'].includes(stats.type)) {
    combat.playedCardTypesThisTurn[stats.type] = true;
    if (
      hasRelic(state, 'orange_pellets') &&
      combat.playedCardTypesThisTurn.attack &&
      combat.playedCardTypesThisTurn.skill &&
      combat.playedCardTypesThisTurn.power
    ) {
      combat.playedCardTypesThisTurn = { attack: false, skill: false, power: false };
      const removed = [];
      for (const sKey of Object.keys(state.player.statuses || {})) {
        if (
          STATUS_METADATA[sKey]?.polarity === 'debuff' ||
          sKey === 'confused' ||
          sKey === 'noDraw'
        ) {
          delete state.player.statuses[sKey];
          if (state.player.skipStatusTick) delete state.player.skipStatusTick[sKey];
          removed.push(STATUS_METADATA[sKey]?.name ?? sKey);
        }
      }
      pushCombatLog(
        combat,
        removed.length > 0
          ? `遗物【${RELIC_LIBRARY.orange_pellets.name}】激活：清除了全部负面状态（${removed.join('、')}）！`
          : `遗物【${RELIC_LIBRARY.orange_pellets.name}】激活：已凑齐攻/技/能组合（当前无负面状态）。`,
        'status'
      );
    }
  }

  // Hex debuff (Chosen): playing any non-Attack card shuffles Dazed into draw pile
  if (stats.type !== 'attack' && (state.player.statuses?.hex ?? 0) > 0) {
    const hexCount = state.player.statuses.hex;
    for (let h = 0; h < hexCount; h += 1) {
      const dazed = createCardInstance(state, 'dazed', false);
      const insertIdx = randomInt(state, 0, combat.drawPile.length);
      combat.drawPile.splice(insertIdx, 0, dazed);
    }
    pushCombatLog(
      combat,
      `【妖术】触发：打出非攻击牌，将 ${hexCount} 张【晕眩】洗入抽牌堆！`,
      'status'
    );
  }

  for (const enemy of getAliveEnemies(combat)) {
    if ((enemy.statuses?.slow ?? 0) > 0) {
      enemy.slowStacks = (enemy.slowStacks ?? 0) + 1;
    }
  }

  // Beat of Death (Corrupt Heart): triggers after card resolves if Heart is still alive
  if (state.player.hp > 0 && combat.status === 'ongoing') {
    for (const enemy of getAliveEnemies(combat)) {
      const beatDmg = enemy.statuses?.beatOfDeath ?? 0;
      if (beatDmg > 0 && state.player.hp > 0) {
        dealDamageToPlayer(state, beatDmg, `【${enemy.name}】的死亡律动`, { isAttack: false });
      }
    }
  }

  if (state.player.hp <= 0 || combat.status !== 'ongoing') {
    return buildPlayResult();
  }

  // 12. Check victory before Time Warp interruption
  if (getAliveEnemies(combat).length === 0 && state.player.hp > 0) {
    setPendingCardChoice(combat, null);
    finalizeCombatVictory(state, onVictoryCallback);
    return buildPlayResult();
  }

  let triggeredTimeWarp = false;
  for (const enemy of getAliveEnemies(combat)) {
    if ((enemy.statuses?.timeWarp ?? 0) > 0) {
      enemy.statuses.timeWarp -= 1;
      if (enemy.statuses.timeWarp <= 0) {
        enemy.statuses.timeWarp = 12;
        applyStatus(enemy, 'strength', 2);
        combat.queuedOmnisciencePicks = 0;
        setPendingCardChoice(combat, null);
        triggeredTimeWarp = true;
        pushCombatLog(
          combat,
          `【${enemy.name}】触发【时间扭曲】！获得 2 点力量并强制结束你的回合！`,
          'status'
        );
      }
    }
  }
  if (triggeredTimeWarp) {
    if (stats.extraTurn && getAliveEnemies(combat).length > 0 && state.player.hp > 0) {
      combat.extraTurnQueued = true;
      pushCombatLog(combat, `【${stats.name}】时空跃迁：抵消时间扭曲并跳过敌方回合，立即开启新回合！`, 'victory');
    }
    const cardReveals = buildPlayResult().cardReveals;
    return { ...endPlayerTurn(state, onVictoryCallback), cardReveals };
  }

  // 11b. Request interactive hand/draw/discard/exhaust/discover/wish card choices
  if (getAliveEnemies(combat).length > 0 && state.player.hp > 0) {
    if (totalManualDiscard > 0) {
      requestHandCardChoice(state, 'discard', totalManualDiscard, stats.name, onVictoryCallback);
    } else if (totalExhaustForEnergy > 0) {
      requestHandCardChoice(state, 'exhaust', totalExhaustForEnergy, stats.name, onVictoryCallback, {
        grantEnergyFromCost: true,
      });
    } else if (totalManualExhaust > 0) {
      requestHandCardChoice(state, 'exhaust', totalManualExhaust, stats.name, onVictoryCallback, {
        drawAfterExhaust: totalDrawAfterExhaust,
      });
    } else if (totalExhaustMulti > 0) {
      requestHandCardChoice(state, 'exhaust_multi', totalExhaustMulti, stats.name, onVictoryCallback);
    } else if (totalManualUpgrade > 0) {
      requestHandCardChoice(state, 'upgrade', totalManualUpgrade, stats.name, onVictoryCallback);
    } else if (totalHandToDrawTop > 0) {
      requestHandCardChoice(state, 'hand_to_draw', totalHandToDrawTop, stats.name, onVictoryCallback, {
        zeroCostUntilPlayed: totalHandToDrawTopZero,
      });
    } else if (totalHandToDrawBottomMulti) {
      requestHandCardChoice(state, 'hand_to_draw_bottom_multi', 1, stats.name, onVictoryCallback, {
        zeroCostUntilPlayed: totalHandToDrawBottomZero,
      });
    } else if (totalHandToDrawBottom > 0) {
      requestHandCardChoice(
        state,
        'hand_to_draw_bottom',
        totalHandToDrawBottom,
        stats.name,
        onVictoryCallback,
        { zeroCostUntilPlayed: totalHandToDrawBottomZero }
      );
    } else if (totalDualWieldCopies > 0) {
      requestHandCardChoice(state, 'dual_wield', totalDualWieldCopies, stats.name, onVictoryCallback, {
        copies: totalDualWieldCopies,
      });
    } else if (totalNightmareCopies > 0) {
      requestHandCardChoice(state, 'nightmare', totalNightmareCopies, stats.name, onVictoryCallback, {
        copies: totalNightmareCopies,
      });
    } else if (totalScry > 0) {
      initiateScry(state, totalScry, stats.name, { drawAfterScry: totalDrawAfterScry });
    } else if (totalDiscardToDraw > 0) {
      requestDiscardPileChoice(state, 'discard_to_draw', totalDiscardToDraw, stats.name, {
        excludeInstanceId: cardInstance.instanceId,
      });
    } else if (totalRetrieveDiscardToHand > 0) {
      requestDiscardPileChoice(
        state,
        'retrieve_discard_to_hand',
        totalRetrieveDiscardToHand,
        stats.name,
        {
          excludeInstanceId: cardInstance.instanceId,
        }
      );
    } else if (totalRetrieveExhaust > 0) {
      requestExhaustPileChoice(state, totalRetrieveExhaust, stats.name);
    } else if (totalOmniscience > 0) {
      requestDrawPileChoice(state, totalOmniscience, stats.name, { mode: 'omniscience' });
    } else if (totalPickFromDraw > 0) {
      requestDrawPileChoice(state, totalPickFromDraw, stats.name, { filterType: pickFromDrawType });
    } else if (pendingDiscoverCfg) {
      requestDiscoverCardChoice(state, pendingDiscoverCfg, stats.name);
    } else if (pendingWishCfg) {
      requestWishChoice(state, pendingWishCfg, stats.name);
    } else if (totalRetrieveDiscardRetain > 0) {
      requestDiscardPileChoice(
        state,
        'retrieve_discard_retain',
        totalRetrieveDiscardRetain,
        stats.name,
        {
          excludeInstanceId: cardInstance.instanceId,
          endTurnAfter: Boolean(stats.endTurnAfter),
        }
      );
    }
  }

  // 12b. Vault (extra turn skipping enemies) & Conclude (immediate end turn)
  if (
    getAliveEnemies(combat).length > 0 &&
    state.player.hp > 0 &&
    combat.status === 'ongoing' &&
    !hasPendingCardChoice(combat)
  ) {
    if (stats.extraTurn) {
      combat.extraTurnQueued = true;
      pushCombatLog(combat, `【${stats.name}】时空跃迁：跳过敌方回合，立即开启新回合！`, 'victory');
      const cardReveals = buildPlayResult().cardReveals;
      return { ...endPlayerTurn(state, onVictoryCallback), cardReveals };
    }
    if (stats.endTurnAfter) {
      pushCombatLog(combat, `【${stats.name}】落下终章，自动结束本回合。`, 'info');
      const cardReveals = buildPlayResult().cardReveals;
      return { ...endPlayerTurn(state, onVictoryCallback), cardReveals };
    }
  }

  return buildPlayResult();
}

export function usePotion(state, slotIndex, targetEnemyId = null, onVictoryCallback = null) {
  const combat = state?.combat;
  if (!combat || state.screen !== 'combat' || combat.status !== 'ongoing' || combat.phase !== 'player') {
    return { ok: false, reason: '只能在战斗中的玩家回合使用药水' };
  }
  if (hasPendingCardChoice(combat)) {
    return { ok: false, reason: getPendingChoiceBlockReason(combat) };
  }
  if (!Number.isInteger(slotIndex) || slotIndex < 0 || slotIndex >= state.player.potions.length) {
    return { ok: false, reason: '药水栏位无效' };
  }
  const potionId = state.player.potions[slotIndex];
  if (!potionId) {
    return { ok: false, reason: '该栏位没有药水' };
  }
  const potion = POTION_LIBRARY[potionId];
  if (!potion) {
    return { ok: false, reason: '未知药水' };
  }

  const targetRes = resolveEnemyTarget(combat, potion.target, targetEnemyId);
  if (!targetRes.ok) {
    return { ok: false, reason: targetRes.reason };
  }
  combat.fledEnemyIds = [];
  combat.pendingCardReveals = [];
  combat.orbFxEvents = [];

  const mult = hasRelic(state, 'sacred_bark') ? 2 : 1;

  state.player.potions[slotIndex] = null;
  pushCombatLog(
    combat,
    `饮用【${potion.name}】${mult > 1 ? '（神圣树皮效果翻倍）' : ''}！`,
    'info'
  );

  if (hasRelic(state, 'toy_ornithopter') && state.player.hp > 0) {
    const healed = healPlayerInCombat(state, 5);
    if (healed > 0) {
      pushCombatLog(
        combat,
        `遗物【${RELIC_LIBRARY.toy_ornithopter.name}】生效：饮用药水回复 ${healed} 点生命！`,
        'victory'
      );
    }
  }

  if (potion.damage && targetRes.enemy) {
    dealDamageToEnemy(state, targetRes.enemy, potion.damage * mult, { isAttack: false });
  }
  if (potion.aoeDamage) {
    for (const enemy of getAliveEnemies(combat)) {
      dealDamageToEnemy(state, enemy, potion.aoeDamage * mult, { isAttack: false });
    }
  }
  if (potion.exhaustStatusCurseDraw) {
    const toExhaust = combat.hand.filter((hc) => {
      const t = getCardStats(hc).type;
      return t === 'status' || t === 'curse';
    });
    if (toExhaust.length > 0) {
      combat.hand = combat.hand.filter((hc) => !toExhaust.includes(hc));
      exhaustCardsBatch(state, toExhaust);
      if (getAliveEnemies(combat).length > 0) {
        drawCards(state, toExhaust.length * mult);
      }
    }
  }
  if (potion.block) {
    const val = potion.block * mult;
    addPlayerBlock(state, val);
    pushCombatLog(combat, `获得 ${val} 点格挡。`, 'block');
  }
  if (potion.strength) {
    const val = potion.strength * mult;
    applyStatus(state.player, 'strength', val);
    pushCombatLog(combat, `获得 ${val} 点力量。`, 'status');
  }
  if (potion.tempStrength) {
    const val = potion.tempStrength * mult;
    applyStatus(state.player, 'strength', val);
    applyStatus(state.player, 'tempStrengthDown', val);
    pushCombatLog(combat, `本回合临时获得 ${val} 点【力量】！`, 'status');
  }
  if (potion.tempDexterity) {
    const val = potion.tempDexterity * mult;
    applyStatus(state.player, 'dexterity', val);
    applyStatus(state.player, 'tempDexterityDown', val);
    pushCombatLog(combat, `本回合临时获得 ${val} 点【敏捷】！`, 'status');
  }
  if (potion.metallicize) {
    const val = potion.metallicize * mult;
    applyStatus(state.player, 'metallicize', val);
    pushCombatLog(combat, `获得 ${val} 层【金属化】！`, 'status');
  }
  if (potion.platedArmor) {
    const val = potion.platedArmor * mult;
    applyStatus(state.player, 'platedArmor', val);
    pushCombatLog(combat, `获得 ${val} 层【多层护甲】！`, 'block');
  }
  if (potion.artifact) {
    const val = potion.artifact * mult;
    applyStatus(state.player, 'artifact', val);
    pushCombatLog(combat, `获得 ${val} 层【人工制品】！`, 'status');
  }
  if (potion.intangible) {
    const val = potion.intangible * mult;
    applyStatus(state.player, 'intangible', val);
    pushCombatLog(combat, `获得 ${val} 层【无实体】！`, 'status');
  }
  if (potion.duplication) {
    const val = potion.duplication * mult;
    applyStatus(state.player, 'duplication', val);
    pushCombatLog(combat, `获得 ${val} 层【复制】：本回合下 ${val} 张牌将额外再打出一次！`, 'status');
  }
  if (potion.drawCardNextTurn) {
    const val = potion.drawCardNextTurn * mult;
    applyStatus(state.player, 'drawCardNextTurn', val);
    pushCombatLog(combat, `下回合开始额外抽 ${val} 张牌。`, 'info');
  }
  if (potion.dexterity) {
    const val = potion.dexterity * mult;
    applyStatus(state.player, 'dexterity', val);
    pushCombatLog(combat, `获得 ${val} 点敏捷。`, 'status');
  }
  if (potion.energy) {
    const val = potion.energy * mult;
    state.player.energy += val;
    pushCombatLog(combat, `获得 ${val} 点能量。`, 'info');
  }
  if (potion.gambleHand && combat.hand.length > 0) {
    const discardCount = combat.hand.length;
    const batch = [...combat.hand];
    combat.hand = [];
    discardCardsBatch(state, batch, { manual: true });
    if (getAliveEnemies(combat).length > 0) {
      drawCards(state, discardCount * mult);
    }
  }
  if (potion.toggleWrathCalm) {
    const targetStance = combat.stance === 'wrath' ? 'calm' : 'wrath';
    changeStance(state, targetStance);
  }
  if (potion.gainMantra) {
    gainMantra(state, potion.gainMantra * mult);
  }
  if (potion.draw) {
    drawCards(state, potion.draw * mult);
  }
  if (potion.addCardsToHand) {
    addCardsToHand(
      state,
      potion.addCardsToHand.cardId,
      potion.addCardsToHand.count * mult,
      Boolean(potion.addCardsToHand.upgraded)
    );
  }
  if (potion.enterStance) {
    changeStance(state, potion.enterStance);
    if (potion.enterStance === 'divinity' && mult > 1) {
      state.player.energy += 3;
      pushCombatLog(combat, '【神圣树皮】加持【神格甘露】：额外再获得 3 点能量！', 'info');
    }
  }
  if (potion.healFlat && state.player.hp > 0) {
    const healed = healPlayerInCombat(state, potion.healFlat * mult);
    pushCombatLog(combat, `回复了 ${healed} 点生命。`, 'victory');
  }
  if (potion.healPct && state.player.hp > 0) {
    const healAmt = Math.max(1, Math.floor((state.player.maxHp * (potion.healPct * mult)) / 100));
    const healed = healPlayerInCombat(state, healAmt);
    pushCombatLog(combat, `回复了 ${healed} 点生命。`, 'victory');
  }
  if (potion.applyEnemyStatuses && targetRes.enemy && targetRes.enemy.hp > 0) {
    for (const [sKey, sVal] of Object.entries(potion.applyEnemyStatuses)) {
      if (targetRes.enemy.hp <= 0) break;
      const val = sVal * mult;
      if (sKey === 'poison') {
        applyPoisonToEnemy(state, targetRes.enemy, val);
      } else {
        const sMeta = STATUS_METADATA[sKey];
        const sName = sMeta?.name ?? sKey;
        if (applyStatus(targetRes.enemy, sKey, val)) {
          pushCombatLog(combat, `【${targetRes.enemy.name}】获得 ${val} 层【${sName}】。`, 'status');
          triggerChampionBeltIfVulnerable(state, targetRes.enemy, sKey, val);
          if (sMeta?.polarity === 'debuff') {
            triggerSadisticNature(state, targetRes.enemy);
          }
        } else {
          pushCombatLog(combat, `【${targetRes.enemy.name}】的【人工制品】抵消了【${sName}】！`, 'status');
        }
      }
    }
  }
  if (potion.focus) {
    const val = potion.focus * mult;
    applyStatus(state.player, 'focus', val);
    pushCombatLog(combat, `获得 ${val} 点【集中】！`, 'status');
  }
  if (potion.orbSlots) {
    gainOrbSlots(state, potion.orbSlots * mult, { sourceName: potion.name });
  }
  if (potion.channelDarkPerSlot) {
    const slots = state.player.maxOrbSlots ?? 0;
    const totalDarks = slots * potion.channelDarkPerSlot * mult;
    for (let d = 0; d < totalDarks; d += 1) {
      if (state.player.hp <= 0 || combat.status !== 'ongoing') break;
      channelOrb(state, 'dark', { sourceName: potion.name });
    }
  }
  if (potion.channelOrb) {
    for (let c = 0; c < mult; c += 1) {
      if (state.player.hp <= 0 || combat.status !== 'ongoing') break;
      channelOrb(state, potion.channelOrb, { sourceName: potion.name });
    }
  }
  if (potion.evokeFront) {
    evokeFrontOrb(state, potion.evokeFront * mult);
  }
  if (potion.scry && getAliveEnemies(combat).length > 0 && state.player.hp > 0) {
    initiateScry(state, potion.scry * mult, potion.name);
  }

  if (getAliveEnemies(combat).length === 0 && state.player.hp > 0) {
    finalizeCombatVictory(state, onVictoryCallback);
  }

  return {
    ok: true,
    outcome: state.combat?.status ?? combat.status,
    cardReveals: Array.isArray(combat.pendingCardReveals) ? [...combat.pendingCardReveals] : [],
    orbFxEvents: Array.isArray(combat.orbFxEvents) ? [...combat.orbFxEvents] : [],
  };
}

registerPlayCardHandler(playCard);
