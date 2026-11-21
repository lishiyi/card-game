/**
 * Pure combat tactical previews (Lethal, Poison-Lethal & Shield-Break projections)
 * and card synergy/warning detection for both The Ironclad and The Silent.
 * Used for real-time combat UI feedback during hover, selection, and drag-to-play.
 */

import {
  canUpgradeCard,
  countCombatStrikeCards,
  getCardAttackFlatBonus,
  getCardStats,
  getEffectiveCardCost,
} from '../data/cards.js';
import { POTION_LIBRARY, STANCE_METADATA } from '../data/relics.js';
import {
  getAliveEnemies,
  hasRelic,
  RUSHDOWN_MAX_TRIGGERS_PER_TURN,
  VELVET_CHOKER_CARD_LIMIT,
} from './combat.js';
import { calculateAttackDamage, getEnemyIntentPreview } from './math.js';

function simulateSequentialHits(enemy, perHitDamage, hits, options = {}) {
  const initialBlock = Math.max(0, enemy.block ?? 0);
  const initialHp = Math.max(0, enemy.hp ?? 0);
  let remBlock = initialBlock;
  let remHp = initialHp;
  const isAttack = options.isAttack !== false;
  let curlUpAvailable = isAttack ? (enemy.statuses?.curlUp ?? 0) : 0;
  let flightRemaining = isAttack ? (enemy.statuses?.flight ?? 0) : 0;
  let malleableStacks = isAttack ? (enemy.statuses?.malleable ?? 0) : 0;
  let totalDealt = 0;
  let initialBlockRemaining = initialBlock;
  let unblockedHits = 0;
  let firstHitEffective = Math.max(0, Math.floor(perHitDamage));

  for (let i = 0; i < hits; i += 1) {
    if (remHp <= 0) break;
    let dmg = Math.max(0, Math.floor(perHitDamage));
    if (isAttack && flightRemaining > 0) {
      dmg = Math.floor(dmg * 0.5);
    }
    if (dmg > 1 && (enemy.statuses?.intangible ?? 0) > 0) {
      dmg = 1;
    }
    if (i === 0) {
      firstHitEffective = dmg;
    }
    totalDealt += dmg;

    const blocked = Math.min(remBlock, dmg);
    remBlock -= blocked;
    if (initialBlockRemaining > 0) {
      initialBlockRemaining = Math.max(0, initialBlockRemaining - blocked);
    }

    const hpLoss = dmg - blocked;
    if (hpLoss > 0) {
      unblockedHits += 1;
      remHp = Math.max(0, remHp - hpLoss);
      if (remHp > 0 && curlUpAvailable > 0) {
        remBlock += curlUpAvailable;
        curlUpAvailable = 0;
      }
      if (remHp > 0 && flightRemaining > 0) {
        flightRemaining -= 1;
      }
      if (remHp > 0 && malleableStacks > 0) {
        remBlock += malleableStacks;
        malleableStacks += 1;
      }
    }
  }

  const totalHpLoss = Math.max(0, initialHp - remHp);
  const isShieldBreak = initialBlock > 0 && initialBlockRemaining <= 0;
  const isLethal = initialHp > 0 && remHp <= 0;

  return {
    hits,
    perHitDamage: firstHitEffective,
    totalDamage: totalDealt,
    hpLoss: totalHpLoss,
    unblockedHits,
    initialBlock,
    remainingBlock: remBlock,
    remainingHp: remHp,
    isShieldBreak,
    isLethal,
    poisonAdded: 0,
    projectedPoison: enemy.statuses?.poison ?? 0,
    isPoisonLethal: false,
  };
}

/**
 * Predicts damage, Shield Break, Direct Lethal, and Poison-Lethal outcome of playing `cardInstance` against `enemy`.
 * Returns `null` if the card deals neither damage nor deterministic poison to `enemy`.
 */
export function previewCardDamageOnEnemy(state, cardInstance, enemy) {
  if (!state?.combat || !cardInstance || !enemy || enemy.hp <= 0) return null;
  const stats = getCardStats(cardInstance);
  if (stats.unplayable) return null;
  if (stats.target !== 'enemy' && stats.target !== 'all_enemies') return null;

  const combat = state.combat;
  if (stats.randomEnemyHits && getAliveEnemies(combat).length > 1) {
    return null;
  }

  const hasSkull = hasRelic(state, 'snecko_skull');
  const skullBonus = hasSkull ? 1 : 0;
  const burstPasses =
    stats.type === 'skill' && !stats.noBurst && (state.player?.statuses?.burst ?? 0) > 0 ? 2 : 1;

  let basePerHit = null;
  let hits = 1;
  let directHpLossOverride = null;

  if (typeof stats.judgmentThreshold === 'number') {
    if (enemy.hp <= stats.judgmentThreshold) {
      directHpLossOverride = enemy.hp;
    } else {
      return null;
    }
  } else if (typeof stats.applyMarkAndTrigger === 'number') {
    const projectedMark = (enemy.statuses?.mark ?? 0) + stats.applyMarkAndTrigger * burstPasses;
    directHpLossOverride = Math.min(enemy.hp, projectedMark);
  } else if (stats.useBlockAsDamage) {
    basePerHit = Math.max(0, state.player?.block ?? 0);
    hits = 1;
  } else if (typeof stats.exhaustAllHandDamageEach === 'number') {
    basePerHit = stats.exhaustAllHandDamageEach;
    const otherHandCount = combat.hand.filter(
      (c) => c.instanceId !== cardInstance.instanceId
    ).length;
    hits = Math.max(0, otherHandCount);
  } else if (stats.hitsPerAttackPlayedThisTurn) {
    basePerHit = stats.damage ?? 0;
    hits = Math.max(0, combat.attacksPlayedThisTurn ?? 0);
  } else if (stats.hitsPerHandSkill) {
    basePerHit = stats.damage ?? 0;
    hits = combat.hand.filter((c) => getCardStats(c).type === 'skill').length;
  } else if (stats.hitsPerAliveEnemy) {
    basePerHit = stats.damage ?? 0;
    hits = Math.max(1, getAliveEnemies(combat).length);
  } else if (typeof stats.damage === 'number') {
    const strikeBonus = stats.bonusDamagePerStrike
      ? stats.bonusDamagePerStrike * countCombatStrikeCards(combat)
      : 0;
    basePerHit = stats.damage + strikeBonus;
    if (stats.isXCost) {
      hits = Math.max(0, (state.player?.energy ?? 0) + (hasRelic(state, 'chemical_x') ? 2 : 0));
    } else {
      hits = stats.hits ?? 1;
      if (stats.bonusHitIfPoisoned && (enemy.statuses?.poison ?? 0) > 0) {
        hits += 1;
      }
    }
  }

  let sim = null;
  if (directHpLossOverride !== null) {
    const remHp = Math.max(0, enemy.hp - directHpLossOverride);
    sim = {
      hits: 1,
      perHitDamage: directHpLossOverride,
      totalDamage: directHpLossOverride,
      hpLoss: directHpLossOverride,
      unblockedHits: directHpLossOverride > 0 ? 1 : 0,
      initialBlock: Math.max(0, enemy.block ?? 0),
      remainingBlock: Math.max(0, enemy.block ?? 0),
      remainingHp: remHp,
      isShieldBreak: false,
      isLethal: enemy.hp > 0 && remHp <= 0,
      poisonAdded: 0,
      projectedPoison: enemy.statuses?.poison ?? 0,
      isPoisonLethal: false,
    };
  } else if (basePerHit !== null) {
    const flatBonus = getCardAttackFlatBonus(stats, state.player, combat);
    const perHitDamage = calculateAttackDamage(basePerHit, state.player, enemy, {
      strengthMultiplier: stats.strengthMultiplier ?? 1,
      flatBonus,
      ignoreFlight: true,
    });
    sim = simulateSequentialHits(enemy, perHitDamage, hits, { isAttack: true });
  }

  // Deterministic poison projection (direct poison statuses, Catalyst, Burst, and Envenom)
  const currentPoison = enemy.statuses?.poison ?? 0;
  let poisonAdded = 0;

  if (sim && !sim.isLethal && sim.unblockedHits > 0 && (state.player?.statuses?.envenom ?? 0) > 0) {
    poisonAdded += sim.unblockedHits * (state.player.statuses.envenom + skullBonus);
  }

  if (stats.applyEnemyStatuses?.poison) {
    poisonAdded += (stats.applyEnemyStatuses.poison + skullBonus) * burstPasses;
  }

  if (stats.multiplyPoison) {
    for (let p = 0; p < burstPasses; p += 1) {
      const preCatPoison = currentPoison + poisonAdded;
      if (preCatPoison > 0) {
        poisonAdded += preCatPoison * (stats.multiplyPoison - 1) + skullBonus;
      }
    }
  }

  if (!sim && poisonAdded <= 0 && !stats.multiplyPoison) {
    return null;
  }

  const baseResult = sim || {
    hits: 0,
    perHitDamage: 0,
    totalDamage: 0,
    hpLoss: 0,
    unblockedHits: 0,
    initialBlock: Math.max(0, enemy.block ?? 0),
    remainingBlock: Math.max(0, enemy.block ?? 0),
    remainingHp: Math.max(0, enemy.hp ?? 0),
    isShieldBreak: false,
    isLethal: false,
  };

  const projectedPoison = currentPoison + poisonAdded;
  const isPoisonLethal =
    !baseResult.isLethal &&
    baseResult.remainingHp > 0 &&
    projectedPoison > 0 &&
    projectedPoison >= baseResult.remainingHp;

  return {
    ...baseResult,
    goldOnKill: stats.goldOnKill ?? 0,
    maxHpOnKill: stats.maxHpOnKill ?? 0,
    fatalPermanentUpgrade: Boolean(stats.fatalPermanentUpgrade),
    poisonAdded,
    projectedPoison,
    isPoisonLethal,
  };
}

/**
 * Predicts damage, Shield Break, Direct Lethal, or Poison-Lethal outcome of throwing a potion at `enemy`.
 */
export function previewPotionDamageOnEnemy(state, potionId, enemy) {
  if (!state?.combat || !potionId || !enemy || enemy.hp <= 0) return null;
  const pot = POTION_LIBRARY[potionId];
  if (!pot) return null;
  const mult = hasRelic(state, 'sacred_bark') ? 2 : 1;

  if (typeof pot.damage === 'number' || typeof pot.aoeDamage === 'number') {
    const raw = typeof pot.damage === 'number' ? pot.damage : pot.aoeDamage;
    return simulateSequentialHits(enemy, raw * mult, 1, { isAttack: false });
  }

  if (pot.applyEnemyStatuses?.poison) {
    const skullBonus = hasRelic(state, 'snecko_skull') ? 1 : 0;
    const poisonAdded = pot.applyEnemyStatuses.poison * mult + skullBonus;
    const projectedPoison = (enemy.statuses?.poison ?? 0) + poisonAdded;
    const remainingHp = Math.max(0, enemy.hp ?? 0);
    return {
      hits: 0,
      perHitDamage: 0,
      totalDamage: 0,
      hpLoss: 0,
      unblockedHits: 0,
      initialBlock: Math.max(0, enemy.block ?? 0),
      remainingBlock: Math.max(0, enemy.block ?? 0),
      remainingHp,
      isShieldBreak: false,
      isLethal: false,
      poisonAdded,
      projectedPoison,
      isPoisonLethal: remainingHp > 0 && projectedPoison >= remainingHp,
    };
  }

  return null;
}

/**
 * Computes all real-time synergy highlights and danger warnings triggered by selecting/hovering/dragging a hand card.
 */
export function computeCardSynergies(state, cardInstance, targetEnemyId = null) {
  const result = {
    relicHighlights: [], // { relicId, tone: 'buff' | 'warn' }
    playerStatusHighlights: [], // { key, tone: 'buff' | 'warn' }
    highlightPlayerBlock: false,
    enemyTriggers: [], // { enemyId, statusKey, tone: 'buff' | 'warn' }
    affectedHandCards: [], // { instanceId, tone: 'exhaust' | 'upgrade' | 'discard' }
    callouts: [], // { tone: 'buff' | 'warn', text }
  };

  if (!state?.combat || !cardInstance) return result;
  const stats = getCardStats(cardInstance);
  const canMedKitPlay = Boolean(
    stats.unplayable && stats.type === 'status' && hasRelic(state, 'medical_kit')
  );
  if (stats.unplayable && !canMedKitPlay) return result;

  const player = state.player;
  const combat = state.combat;
  const aliveEnemies = getAliveEnemies(combat);
  const targetedEnemies =
    stats.target === 'all_enemies'
      ? aliveEnemies
      : stats.target === 'enemy'
        ? targetEnemyId
          ? aliveEnemies.filter((e) => e.id === targetEnemyId)
          : aliveEnemies
        : [];

  const isAttack = stats.type === 'attack';
  const isSkill = stats.type === 'skill';
  const dealsDamage =
    typeof stats.damage === 'number' ||
    Boolean(stats.useBlockAsDamage) ||
    typeof stats.exhaustAllHandDamageEach === 'number';
  const grantsBlock =
    typeof stats.block === 'number' || typeof stats.exhaustNonAttacksBlockEach === 'number';
  const corruptionExhaust = isSkill && (player.statuses?.corruption ?? 0) > 0;
  const triggersSelfExhaust = Boolean(stats.exhaust) || corruptionExhaust || canMedKitPlay;
  const triggersHandExhaust = Boolean(
    stats.exhaustHandChoice ||
      stats.exhaustHandRandom ||
      stats.exhaustNonAttacksBlockEach ||
      stats.exhaustAllHandDamageEach
  );
  const triggersAnyExhaust = triggersSelfExhaust || triggersHandExhaust;
  const triggersManualDiscard = Boolean(
    stats.discardHand || stats.gambleDiscardAll || stats.discardAllForShivs
  );
  const createsShivs =
    stats.addCardsToHand?.cardId === 'shiv' || Boolean(stats.discardAllForShivs);
  const appliesPoison = Boolean(
    stats.applyEnemyStatuses?.poison || stats.bouncePoison || stats.multiplyPoison
  );

  const pushPlayerStatus = (key, tone = 'buff') => {
    if (!result.playerStatusHighlights.some((s) => s.key === key)) {
      result.playerStatusHighlights.push({ key, tone });
    }
  };
  const pushRelic = (relicId, tone = 'buff') => {
    if (!result.relicHighlights.some((r) => r.relicId === relicId)) {
      result.relicHighlights.push({ relicId, tone });
    }
  };

  if (canMedKitPlay) {
    pushRelic('medical_kit', 'buff');
    result.callouts.push({
      tone: 'buff',
      text: '✦ 【医疗箱】生效：可 0 费消耗打出此状态牌！',
    });
  }

  // 1. Enemy Danger / Synergy Triggers
  const enrageEnemies = [];
  const sharpHideEnemies = [];
  const curiosityEnemies = [];
  const thornsTargets = [];
  const flightTargets = [];
  const malleableTargets = [];
  const slowTargets = [];
  const vulnerableTargets = [];
  const poisonedTargets = [];
  const timeWarpEnemies = [];

  for (const enemy of aliveEnemies) {
    if (isSkill && (enemy.statuses?.enrage ?? 0) > 0) {
      result.enemyTriggers.push({ enemyId: enemy.id, statusKey: 'enrage', tone: 'warn' });
      enrageEnemies.push(enemy);
    }
    if (isAttack && (enemy.statuses?.sharpHide ?? 0) > 0) {
      result.enemyTriggers.push({ enemyId: enemy.id, statusKey: 'sharpHide', tone: 'warn' });
      sharpHideEnemies.push(enemy);
    }
    if (stats.type === 'power' && (enemy.statuses?.curiosity ?? 0) > 0) {
      result.enemyTriggers.push({ enemyId: enemy.id, statusKey: 'curiosity', tone: 'warn' });
      curiosityEnemies.push(enemy);
    }
    if ((enemy.statuses?.timeWarp ?? 0) === 1) {
      result.enemyTriggers.push({ enemyId: enemy.id, statusKey: 'timeWarp', tone: 'warn' });
      timeWarpEnemies.push(enemy);
    }
  }

  for (const enemy of targetedEnemies) {
    if (dealsDamage && (enemy.statuses?.vulnerable ?? 0) > 0) {
      result.enemyTriggers.push({ enemyId: enemy.id, statusKey: 'vulnerable', tone: 'buff' });
      vulnerableTargets.push(enemy);
    }
    if (dealsDamage && (enemy.statuses?.slow ?? 0) > 0 && (enemy.slowStacks ?? 0) > 0) {
      result.enemyTriggers.push({ enemyId: enemy.id, statusKey: 'slow', tone: 'buff' });
      slowTargets.push(enemy);
    }
    if ((stats.bonusHitIfPoisoned || stats.multiplyPoison) && (enemy.statuses?.poison ?? 0) > 0) {
      result.enemyTriggers.push({ enemyId: enemy.id, statusKey: 'poison', tone: 'buff' });
      poisonedTargets.push(enemy);
    }
    if (isAttack && (enemy.statuses?.thorns ?? 0) > 0) {
      result.enemyTriggers.push({ enemyId: enemy.id, statusKey: 'thorns', tone: 'warn' });
      thornsTargets.push(enemy);
    }
    if (isAttack && (enemy.statuses?.flight ?? 0) > 0) {
      result.enemyTriggers.push({ enemyId: enemy.id, statusKey: 'flight', tone: 'warn' });
      flightTargets.push(enemy);
    }
    if (isAttack && (enemy.statuses?.malleable ?? 0) > 0) {
      result.enemyTriggers.push({ enemyId: enemy.id, statusKey: 'malleable', tone: 'warn' });
      malleableTargets.push(enemy);
    }
    if (isAttack && (enemy.statuses?.angry ?? 0) > 0) {
      result.enemyTriggers.push({ enemyId: enemy.id, statusKey: 'angry', tone: 'warn' });
    }
    if (isAttack && (enemy.statuses?.curlUp ?? 0) > 0) {
      result.enemyTriggers.push({ enemyId: enemy.id, statusKey: 'curlUp', tone: 'warn' });
    }
  }

  if (enrageEnemies.length > 0) {
    const names = enrageEnemies.map((e) => `${e.name} +${e.statuses.enrage}力量`).join('、');
    result.callouts.push({
      tone: 'warn',
      text: `⚠ 技能牌将触发【激怒】：${names}`,
    });
  }
  if (sharpHideEnemies.length > 0) {
    const totalReflect = sharpHideEnemies.reduce((sum, e) => sum + (e.statuses.sharpHide ?? 0), 0);
    result.callouts.push({
      tone: 'warn',
      text: `⚠ 攻击牌将触发【锋利外壳】：受到 ${totalReflect} 点反伤`,
    });
  }
  if (thornsTargets.length > 0) {
    const maxThorns = Math.max(...thornsTargets.map((e) => e.statuses.thorns ?? 0));
    result.callouts.push({
      tone: 'warn',
      text: `⚠ 目标拥有【荆棘】：每次打击受到 ${maxThorns} 点反伤`,
    });
  }
  if (flightTargets.length > 0) {
    const minFlight = Math.min(...flightTargets.map((e) => e.statuses.flight ?? 0));
    result.callouts.push({
      tone: 'warn',
      text: `⚠ 目标处于【飞行】（伤害减半）：再命中 ${minFlight} 次攻击即可将其击落眩晕`,
    });
  }
  if (malleableTargets.length > 0) {
    const sample = malleableTargets[0];
    result.callouts.push({
      tone: 'warn',
      text: `⚠ 目标拥有【可塑护甲】：每次破甲攻击将使其获得 +${sample.statuses.malleable} 递增格挡`,
    });
  }
  if (curiosityEnemies.length > 0) {
    const names = curiosityEnemies.map((e) => `${e.name} +${e.statuses.curiosity}力量`).join('、');
    result.callouts.push({
      tone: 'warn',
      text: `⚠ 能力牌将触发【好奇】：${names}`,
    });
  }
  if (timeWarpEnemies.length > 0) {
    result.callouts.push({
      tone: 'warn',
      text: '⚠ 【时间扭曲】临近阈值：打出本牌后将立即强制结束回合！',
    });
  }
  if (slowTargets.length > 0) {
    const sample = slowTargets[0];
    result.callouts.push({
      tone: 'buff',
      text: `✦ 【迟缓】生效：本回合已打 ${sample.slowStacks} 张牌，攻击伤害 +${sample.slowStacks * 10}%`,
    });
  }

  // 2. Player Status & Relic Synergies
  if (dealsDamage) {
    if ((player.statuses?.strength ?? 0) !== 0) {
      pushPlayerStatus('strength', player.statuses.strength > 0 ? 'buff' : 'warn');
    }
    if (isAttack && (player.statuses?.vigor ?? 0) > 0) {
      pushPlayerStatus('vigor', 'buff');
      if (hasRelic(state, 'akabeko')) {
        pushRelic('akabeko', 'buff');
      }
      result.callouts.push({
        tone: 'buff',
        text: `✦ 【活力】加成：本张攻击牌每段伤害 +${player.statuses.vigor}`,
      });
    }
    if (
      isAttack &&
      hasRelic(state, 'red_skull') &&
      player.hp > 0 &&
      player.hp <= Math.floor(player.maxHp * 0.5)
    ) {
      pushRelic('red_skull', 'buff');
    }
    if ((player.statuses?.weak ?? 0) > 0) {
      pushPlayerStatus('weak', 'warn');
    }
    if (vulnerableTargets.length > 0 && hasRelic(state, 'paper_phrog')) {
      pushRelic('paper_phrog', 'buff');
      result.callouts.push({
        tone: 'buff',
        text: '✦ 【折纸青蛙】+【易伤】联动：伤害增幅提升至 +75%',
      });
    }
  }

  if (stats.isXCost && hasRelic(state, 'chemical_x')) {
    pushRelic('chemical_x', 'buff');
    result.callouts.push({
      tone: 'buff',
      text: '✦ 【化学物X】增幅：本牌 X 效果额外 +2！',
    });
  }

  // Silent: Accuracy + Wrist Blade + Envenom
  if ((stats.isShiv || createsShivs) && (player.statuses?.accuracy ?? 0) > 0) {
    pushPlayerStatus('accuracy', 'buff');
  }
  if (isAttack && hasRelic(state, 'wrist_blade')) {
    const effCost = getEffectiveCardCost(stats, player, combat);
    if (effCost === 0) {
      pushRelic('wrist_blade', 'buff');
      result.callouts.push({
        tone: 'buff',
        text: '✦ 【腕刃】生效：0 费攻击牌伤害额外 +4',
      });
    }
  } else if (createsShivs && hasRelic(state, 'wrist_blade')) {
    pushRelic('wrist_blade', 'buff');
  }

  if (isAttack && (player.statuses?.envenom ?? 0) > 0) {
    pushPlayerStatus('envenom', 'buff');
    if (hasRelic(state, 'snecko_skull')) {
      pushRelic('snecko_skull', 'buff');
    }
  }

  // Silent: Poison / Bane / Catalyst / Snecko Skull
  if (appliesPoison && hasRelic(state, 'snecko_skull')) {
    pushRelic('snecko_skull', 'buff');
  }

  // Colorless: Sadistic Nature triggers on any enemy debuff
  const appliesEnemyDebuff = Boolean(
    appliesPoison ||
      stats.applyEnemyStatuses?.weak ||
      stats.applyEnemyStatuses?.vulnerable ||
      stats.applyEnemyStatuses?.corpseExplosion ||
      (stats.applyEnemyStatuses?.strength ?? 0) < 0 ||
      stats.tempEnemyStrengthLoss ||
      stats.xEnemyStrengthLoss ||
      stats.xEnemyWeak
  );
  if (appliesEnemyDebuff && (player.statuses?.sadisticNature ?? 0) > 0) {
    pushPlayerStatus('sadisticNature', 'buff');
    result.callouts.push({
      tone: 'buff',
      text: `✦ 【残虐天性】触发：每次施加负面状态附加 ${player.statuses.sadisticNature} 点伤害`,
    });
  }

  if (stats.bonusHitIfPoisoned && poisonedTargets.length > 0) {
    result.callouts.push({
      tone: 'buff',
      text: '✦ 【灾祸】命中中毒目标：将造成双倍打击！',
    });
  }

  if (stats.multiplyPoison) {
    if (poisonedTargets.length > 0) {
      const sample = poisonedTargets[0];
      const cur = sample.statuses?.poison ?? 0;
      const skullBonus = hasRelic(state, 'snecko_skull') ? 1 : 0;
      const burstPasses = isSkill && !stats.noBurst && (player.statuses?.burst ?? 0) > 0 ? 2 : 1;
      let next = cur;
      for (let p = 0; p < burstPasses; p += 1) {
        next = next * stats.multiplyPoison + skullBonus;
      }
      result.callouts.push({
        tone: 'buff',
        text: `✦ 【催化剂】剧毒爆发：${sample.name} 中毒 ${cur} → ${next} 层！`,
      });
    } else if (targetedEnemies.length > 0) {
      result.callouts.push({
        tone: 'warn',
        text: '⚠ 目标当前没有【中毒】，催化剂不会生效',
      });
    }
  }

  if (stats.ifVulnerableBonusEnergy || stats.ifVulnerableDraw) {
    if (vulnerableTargets.length > 0) {
      result.callouts.push({
        tone: 'buff',
        text: '✦ 【飞膝踢】命中易伤目标：回 1 能量并抽 1 张牌！',
      });
    } else if (targetedEnemies.length > 0) {
      result.callouts.push({
        tone: 'warn',
        text: '⚠ 目标当前没有【易伤】，不会触发回能与抽牌',
      });
    }
  }

  if (stats.spotWeaknessStrength) {
    const intendsAtk = targetedEnemies.some(
      (e) => e.intent?.type?.startsWith('attack') || typeof e.intent?.damage === 'number'
    );
    if (intendsAtk) {
      result.callouts.push({
        tone: 'buff',
        text: `✦ 【洞悉弱点】识破攻击意图：将获得 ${stats.spotWeaknessStrength} 点力量！`,
      });
    } else if (targetedEnemies.length > 0) {
      result.callouts.push({
        tone: 'warn',
        text: '⚠ 目标当前未意图攻击，【洞悉弱点】不会获得力量',
      });
    }
  }

  if (stats.doubleStrength) {
    const curStr = player.statuses?.strength ?? 0;
    pushPlayerStatus('strength', curStr > 0 ? 'buff' : 'warn');
    result.callouts.push({
      tone: curStr > 0 ? 'buff' : 'warn',
      text:
        curStr > 0
          ? `✦ 【突破极限】力量翻倍：${curStr} → ${curStr * 2} 点力量！`
          : '⚠ 当前没有正力量，【突破极限】不会叠加力量',
    });
  }

  if (stats.loseHp && (player.statuses?.rupture ?? 0) > 0) {
    pushPlayerStatus('rupture', 'buff');
    result.callouts.push({
      tone: 'buff',
      text: `✦ 【撕裂】触发：卡牌损血将获得 ${player.statuses.rupture} 点力量`,
    });
  }

  // Silent: Finisher & Sneaky Strike & Shuriken / Kunai / Ornamental Fan
  if (stats.hitsPerAttackPlayedThisTurn) {
    const played = combat.attacksPlayedThisTurn ?? 0;
    result.callouts.push({
      tone: played > 0 ? 'buff' : 'warn',
      text:
        played > 0
          ? `✦ 【终结技】蓄力完成：本回合已打 ${played} 张攻击牌，将连击 ${played} 次！`
          : '⚠ 本回合尚未打出过攻击牌，【终结技】当前为 0 段伤害',
    });
  }

  if (stats.refundEnergyIfDiscarded && (combat.discardedThisTurn ?? 0) > 0) {
    result.callouts.push({
      tone: 'buff',
      text: `✦ 本回合已弃牌：【隐秘打击】将返还 ${stats.refundEnergyIfDiscarded} 点能量！`,
    });
  }

  if (isAttack) {
    const comboTriggers = [];
    if (hasRelic(state, 'shuriken')) {
      pushRelic('shuriken', 'buff');
      if ((combat.shurikenCounter ?? 0) === 2) comboTriggers.push('手里剑(+1力量)');
    }
    if (hasRelic(state, 'kunai')) {
      pushRelic('kunai', 'buff');
      if ((combat.kunaiCounter ?? 0) === 2) comboTriggers.push('苦无(+1敏捷)');
    }
    if (hasRelic(state, 'ornamental_fan')) {
      pushRelic('ornamental_fan', 'buff');
      if ((combat.ornamentalFanCounter ?? 0) === 2) comboTriggers.push('精致折扇(+4格挡)');
    }
    if (comboTriggers.length > 0) {
      result.callouts.push({
        tone: 'buff',
        text: `✦ 第 3 次攻击触发：${comboTriggers.join(' · ')}`,
      });
    }
  }

  if (stats.type === 'power' && hasRelic(state, 'mummified_hand')) {
    pushRelic('mummified_hand', 'buff');
    result.callouts.push({
      tone: 'buff',
      text: '✦ 【干瘪之手】联动：打出能力牌后随机令 1 张手牌本回合变为 0 费！',
    });
  }

  if (hasRelic(state, 'orange_pellets') && ['attack', 'skill', 'power'].includes(stats.type)) {
    const tracked = combat.playedCardTypesThisTurn || {};
    const willComplete =
      (tracked.attack || stats.type === 'attack') &&
      (tracked.skill || stats.type === 'skill') &&
      (tracked.power || stats.type === 'power');
    if (willComplete) {
      pushRelic('orange_pellets', 'buff');
      result.callouts.push({
        tone: 'buff',
        text: '✦ 【橙色药丸】齐聚攻/技/能：打出后将清除自身全部负面状态！',
      });
    }
  }

  // Per-card & Skill triggers (Burst, After Image, A Thousand Cuts)
  if (isSkill && !stats.noBurst && (player.statuses?.burst ?? 0) > 0) {
    pushPlayerStatus('burst', 'buff');
    result.callouts.push({
      tone: 'buff',
      text: '✦ 【爆发】生效：该技能牌将连续发动 2 次！',
    });
  }
  if ((player.statuses?.afterImage ?? 0) > 0 && stats.cardId !== 'after_image') {
    pushPlayerStatus('afterImage', 'buff');
  }
  if ((player.statuses?.thousandCuts ?? 0) > 0 && stats.cardId !== 'a_thousand_cuts') {
    pushPlayerStatus('thousandCuts', 'buff');
  }

  // Block synergies
  if (grantsBlock) {
    if ((player.statuses?.dexterity ?? 0) !== 0) {
      pushPlayerStatus('dexterity', player.statuses.dexterity > 0 ? 'buff' : 'warn');
    }
    if ((player.statuses?.frail ?? 0) > 0) {
      pushPlayerStatus('frail', 'warn');
    }
    if ((player.statuses?.barricade ?? 0) > 0) {
      pushPlayerStatus('barricade', 'buff');
    }
    if ((player.statuses?.juggernaut ?? 0) > 0) {
      pushPlayerStatus('juggernaut', 'buff');
      result.callouts.push({
        tone: 'buff',
        text: `✦ 【势不可挡】触发：获得格挡时对随机敌人造成 ${player.statuses.juggernaut} 点伤害`,
      });
    }
  }

  if (stats.useBlockAsDamage || stats.doubleBlock) {
    result.highlightPlayerBlock = true;
    if ((player.statuses?.barricade ?? 0) > 0 && stats.doubleBlock) {
      pushPlayerStatus('barricade', 'buff');
    }
  }

  if (corruptionExhaust) {
    pushPlayerStatus('corruption', 'buff');
  }

  if (triggersAnyExhaust) {
    const exhaustSynergyNames = [];
    if ((player.statuses?.feelNoPain ?? 0) > 0) {
      pushPlayerStatus('feelNoPain', 'buff');
      exhaustSynergyNames.push(`无惧疼痛(+${player.statuses.feelNoPain}盾)`);
    }
    if ((player.statuses?.darkEmbrace ?? 0) > 0) {
      pushPlayerStatus('darkEmbrace', 'buff');
      exhaustSynergyNames.push(`黑暗之拥(抽${player.statuses.darkEmbrace}张)`);
    }
    if (hasRelic(state, 'charons_ashes')) {
      pushRelic('charons_ashes', 'buff');
      exhaustSynergyNames.push('卡戎之灰(全体3伤)');
    }
    if (exhaustSynergyNames.length > 0) {
      result.callouts.push({
        tone: 'buff',
        text: `✦ 消耗联动：${exhaustSynergyNames.join(' · ')}`,
      });
    }
  }

  // Silent: Discard synergies
  if (triggersManualDiscard) {
    const discardSynergyNames = [];
    if (hasRelic(state, 'tough_bandages')) {
      pushRelic('tough_bandages', 'buff');
      discardSynergyNames.push('坚韧绷带(+3盾/张)');
    }
    if (hasRelic(state, 'tingsha')) {
      pushRelic('tingsha', 'buff');
      discardSynergyNames.push('铜钹(随机3伤/张)');
    }
    for (const c of combat.hand) {
      if (c.instanceId === cardInstance.instanceId) continue;
      const cStats = getCardStats(c);
      if (cStats.onDiscardGainEnergy || cStats.onDiscardDraw) {
        result.affectedHandCards.push({ instanceId: c.instanceId, tone: 'discard' });
        discardSynergyNames.push(cStats.name);
      } else if (cStats.reduceCostPerDiscardThisTurn || cStats.refundEnergyIfDiscarded) {
        result.affectedHandCards.push({ instanceId: c.instanceId, tone: 'discard' });
      }
    }
    if (discardSynergyNames.length > 0) {
      const uniqueNames = [...new Set(discardSynergyNames)];
      result.callouts.push({
        tone: 'buff',
        text: `✦ 弃牌联动：${uniqueNames.join(' · ')}`,
      });
    }
  }

  if ((stats.draw ?? 0) > 0 && (player.statuses?.noDraw ?? 0) > 0) {
    pushPlayerStatus('noDraw', 'warn');
    result.callouts.push({
      tone: 'warn',
      text: '⚠ 当前处于【禁抽】状态，抽牌效果不会生效',
    });
  }

  if (hasRelic(state, 'velvet_choker') && (combat.cardsPlayedThisTurn ?? 0) >= VELVET_CHOKER_CARD_LIMIT - 2) {
    const remaining = Math.max(0, VELVET_CHOKER_CARD_LIMIT - (combat.cardsPlayedThisTurn ?? 0));
    pushRelic('velvet_choker', 'warn');
    if (remaining <= 1) {
      result.callouts.push({
        tone: 'warn',
        text: `⚠ 【天鹅绒项圈】提醒：本回合仅剩最后 ${remaining} 张出牌额度`,
      });
    }
  }

  // Watcher: Stances, Mantra, Scry, Mark, Talk to the Hand, Duality & Oath warnings
  const curStance = combat.stance || 'neutral';
  let targetStance = null;
  if (stats.enterStance) {
    targetStance = stats.enterStance;
  } else if (stats.exitStance && curStance !== 'neutral') {
    targetStance = 'neutral';
  } else if (stats.ifInCalmDrawElseCalm && curStance !== 'calm') {
    targetStance = 'calm';
  } else if (stats.ifTargetAttackingEnterStance) {
    const intendsAtk = targetedEnemies.some(
      (e) => e.intent?.type?.startsWith('attack') || typeof e.intent?.damage === 'number'
    );
    if (intendsAtk) {
      targetStance = stats.ifTargetAttackingEnterStance;
    }
  }
  const willChangeStance = Boolean(targetStance && targetStance !== curStance);

  if (stats.applySelfStatuses?.blasphemer) {
    result.callouts.push({
      tone: 'warn',
      text: '⚠ 【渎神誓约】：进入神格（3× 伤害 +3 能量），但下回合开始时必死！请确保本回合斩杀',
    });
  }

  if (willChangeStance) {
    if (curStance === 'calm') {
      const calmEnergy = hasRelic(state, 'violet_lotus') ? 3 : 2;
      if (hasRelic(state, 'violet_lotus')) {
        pushRelic('violet_lotus', 'buff');
      }
      result.callouts.push({
        tone: 'buff',
        text: `✦ 退出【平静】：立即获得 +${calmEnergy} 点能量！`,
      });
    }
    if ((player.statuses?.mentalFortress ?? 0) > 0) {
      pushPlayerStatus('mentalFortress', 'buff');
      result.callouts.push({
        tone: 'buff',
        text: `✦ 【心灵堡垒】触发：切换姿态获得 +${player.statuses.mentalFortress} 格挡`,
      });
    }
    if (targetStance === 'wrath') {
      if ((player.statuses?.rushdown ?? 0) > 0) {
        pushPlayerStatus('rushdown', 'buff');
        result.callouts.push({
          tone: 'buff',
          text: `✦ 【猛虎下山】触发：进入愤怒立即抽 ${player.statuses.rushdown} 张牌！`,
        });
      }
      const wrathProxyPlayer = { ...player, stance: 'wrath' };
      const doubledIncoming = aliveEnemies.reduce((sum, enemy) => {
        const preview = getEnemyIntentPreview(enemy, wrathProxyPlayer);
        return sum + (preview.isAttack ? preview.totalDamage : 0);
      }, 0);
      if (doubledIncoming > 0) {
        result.callouts.push({
          tone: 'warn',
          text: `⚠ 进入【愤怒】：攻击伤害 ×2，但若未退出姿态，本回合将承受 ${doubledIncoming} 点双倍敌方伤害！`,
        });
      } else {
        result.callouts.push({
          tone: 'buff',
          text: '✦ 进入【愤怒】：所有攻击伤害翻倍（2×）！',
        });
      }
    } else if (targetStance === 'calm') {
      const calmMeta = STANCE_METADATA.calm;
      result.callouts.push({
        tone: 'buff',
        text: `✦ 进入【${calmMeta.name}】：退出时可获得 +${hasRelic(state, 'violet_lotus') ? 3 : 2} 点能量`,
      });
    }
  }

  if (stats.ifInCalmDrawElseCalm && curStance === 'calm') {
    result.callouts.push({
      tone: 'buff',
      text: `✦ 处于【平静】：【内心宁静】将直接抽 ${stats.ifInCalmDrawElseCalm} 张牌！`,
    });
  }

  if (stats.ifTargetAttackingEnterStance && !targetStance && targetedEnemies.length > 0) {
    result.callouts.push({
      tone: 'warn',
      text: '⚠ 目标当前未意图攻击，【不惧妖邪】不会进入平静',
    });
  }

  if (stats.wrathBonusBlock) {
    if (curStance === 'wrath') {
      result.callouts.push({
        tone: 'buff',
        text: `✦ 处于【愤怒】：【停顿】触发额外 +${stats.wrathBonusBlock} 基础格挡！`,
      });
    }
  }

  if (stats.ifLastCardType) {
    const expectedLabel = stats.ifLastCardType.type === 'skill' ? '技能牌' : '攻击牌';
    const matched = combat.lastCardTypePlayed === stats.ifLastCardType.type;
    result.callouts.push({
      tone: matched ? 'buff' : 'warn',
      text: matched
        ? `✦ 上一张牌为${expectedLabel}：【${stats.name}】将触发连携特效！`
        : `⚠ 上一张打出并非${expectedLabel}，【${stats.name}】不会触发连携特效`,
    });
  }

  if (stats.gainMantra) {
    const curMantra = player.statuses?.mantra ?? 0;
    const nextMantra = curMantra + stats.gainMantra;
    if (curMantra > 0) pushPlayerStatus('mantra', 'buff');
    result.callouts.push({
      tone: 'buff',
      text:
        nextMantra >= 10
          ? `✦ 真言突破 10 层（${curMantra} → ${nextMantra}）：立即进入【神格】（3× 伤害 +3 能量）！`
          : `✦ 真言积蓄：${curMantra} → ${nextMantra} / 10`,
    });
  }

  if (typeof stats.judgmentThreshold === 'number' && targetedEnemies.length > 0) {
    const canExecute = targetedEnemies.some((e) => e.hp <= stats.judgmentThreshold);
    result.callouts.push({
      tone: canExecute ? 'buff' : 'warn',
      text: canExecute
        ? `✦ 【审判】阈值达成（目标生命 ≤ ${stats.judgmentThreshold}）：立即斩杀！`
        : `⚠ 目标生命高于 ${stats.judgmentThreshold}，【审判】当前不会生效`,
    });
  }

  if (typeof stats.applyMarkAndTrigger === 'number') {
    const markedCount = aliveEnemies.filter(
      (e) => (e.statuses?.mark ?? 0) > 0 || targetedEnemies.some((t) => t.id === e.id)
    ).length;
    result.callouts.push({
      tone: 'buff',
      text: `✦ 【点穴】施加 +${stats.applyMarkAndTrigger} 印记并引爆全场 ${markedCount} 名带印记敌人（无视格挡）`,
    });
  }

  if (stats.scry) {
    const scryParts = [];
    if (hasRelic(state, 'golden_eye')) {
      pushRelic('golden_eye', 'buff');
      scryParts.push('黄金之眼(+2 预见)');
    }
    if ((player.statuses?.nirvana ?? 0) > 0) {
      pushPlayerStatus('nirvana', 'buff');
      scryParts.push(`涅槃(预见至少 +${player.statuses.nirvana}盾)`);
    }
    if (scryParts.length > 0) {
      result.callouts.push({
        tone: 'buff',
        text: `✦ 预见联动：${scryParts.join(' · ')}`,
      });
    }
  }

  if (isAttack && hasRelic(state, 'duality')) {
    pushRelic('duality', 'buff');
  }

  if (isAttack) {
    const tthTargets = targetedEnemies.filter((e) => (e.statuses?.talkToTheHand ?? 0) > 0);
    if (tthTargets.length > 0) {
      for (const e of tthTargets) {
        result.enemyTriggers.push({ enemyId: e.id, statusKey: 'talkToTheHand', tone: 'buff' });
      }
      const maxTth = Math.max(...tthTargets.map((e) => e.statuses.talkToTheHand ?? 0));
      result.callouts.push({
        tone: 'buff',
        text: `✦ 【以手拒之】生效：本张攻击每次命中获得 +${maxTth} 格挡`,
      });
    }
  }

  if (stats.endTurnAfter) {
    result.callouts.push({
      tone: 'warn',
      text: `⚠ 【${stats.name}】打出后将立即强制结束你的回合！`,
    });
  }

  if (stats.extraTurn) {
    result.callouts.push({
      tone: 'buff',
      text: '✦ 【腾跃】跳过敌方行动，立刻开启你的下一回合！',
    });
  }

  // 3. Affected other cards in hand (Second Wind / Fiend Fire / Armaments+)
  if (stats.exhaustNonAttacksBlockEach) {
    for (const c of combat.hand) {
      if (c.instanceId === cardInstance.instanceId) continue;
      if (getCardStats(c).type !== 'attack') {
        result.affectedHandCards.push({ instanceId: c.instanceId, tone: 'exhaust' });
      }
    }
  } else if (stats.exhaustAllHandDamageEach) {
    for (const c of combat.hand) {
      if (c.instanceId === cardInstance.instanceId) continue;
      result.affectedHandCards.push({ instanceId: c.instanceId, tone: 'exhaust' });
    }
  } else if (stats.upgradeAllHand || stats.upgradeAllCombatCards || stats.upgradeHandChoice) {
    for (const c of combat.hand) {
      if (c.instanceId === cardInstance.instanceId) continue;
      if (canUpgradeCard(c)) {
        result.affectedHandCards.push({ instanceId: c.instanceId, tone: 'upgrade' });
      }
    }
  }

  return result;
}

function isEnemyIntendingAttack(enemy) {
  return Boolean(
    enemy &&
      enemy.hp > 0 &&
      enemy.intent &&
      (enemy.intent.type?.startsWith('attack') || typeof enemy.intent.damage === 'number')
  );
}

/**
 * Original Slay the Spire golden-border glow check for hand cards whose
 * conditional bonus trigger is currently satisfied.
 */
export function isCardBonusConditionMet(state, cardInstance) {
  const combat = state?.combat;
  if (!combat || !cardInstance) return false;
  const stats = getCardStats(cardInstance);
  if (!stats) return false;

  const aliveEnemies = getAliveEnemies(combat);

  // Last-card-type combos: Sash Whip (腰带抽打), Crush Joints (粉碎关节), Follow-Up (追击), Sanctity (圣洁)
  if (stats.ifLastCardType) {
    return combat.lastCardTypePlayed === stats.ifLastCardType.type;
  }

  // Enemy status / intent / threshold combos (glows gold if ANY alive enemy satisfies condition, like original StS)
  if (stats.ifVulnerableBonusEnergy) {
    return aliveEnemies.some((e) => (e.statuses?.vulnerable ?? 0) > 0);
  }
  if (stats.ifWeakBonusEnergy) {
    return aliveEnemies.some((e) => (e.statuses?.weak ?? 0) > 0);
  }
  if (stats.bonusHitIfPoisoned) {
    return aliveEnemies.some((e) => (e.statuses?.poison ?? 0) > 0);
  }
  if (stats.spotWeaknessStrength || stats.ifTargetAttackingEnterStance) {
    return aliveEnemies.some((e) => isEnemyIntendingAttack(e));
  }
  if (typeof stats.judgmentThreshold === 'number') {
    return aliveEnemies.some((e) => e.hp <= stats.judgmentThreshold);
  }

  // Stance / turn-state / hand-composition combos
  const curStance = combat.stance ?? state?.player?.stance ?? 'neutral';
  if (stats.wrathBonusBlock) {
    return curStance === 'wrath';
  }
  if (stats.ifInCalmDrawElseCalm) {
    return curStance === 'calm';
  }
  if (stats.ifInWrathVulnAllElseWrath) {
    return curStance === 'wrath';
  }
  if (stats.refundEnergyIfDiscarded) {
    return (combat.discardedThisTurn ?? 0) > 0;
  }
  if (stats.drawIfNoAttackInHand) {
    return !combat.hand.some((c) => getCardStats(c).type === 'attack');
  }

  return false;
}

