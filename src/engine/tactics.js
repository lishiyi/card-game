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
import { POTION_LIBRARY } from '../data/relics.js';
import { getAliveEnemies, hasRelic, VELVET_CHOKER_CARD_LIMIT } from './combat.js';
import { calculateAttackDamage } from './math.js';

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

  if (stats.useBlockAsDamage) {
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
  if (basePerHit !== null) {
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
      text: `✦ 【残虐本性】触发：每次施加负面状态附加 ${player.statuses.sadisticNature} 点伤害`,
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
