/**
 * Pure combat tactical previews (Lethal, Poison-Lethal & Shield-Break projections)
 * and card synergy/warning detection for both The Ironclad and The Silent.
 * Used for real-time combat UI feedback during hover, selection, and drag-to-play.
 */

import {
  canUpgradeCard,
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
  let curlUpAvailable = options.isAttack !== false ? (enemy.statuses?.curlUp ?? 0) : 0;
  let totalDealt = 0;
  let initialBlockRemaining = initialBlock;
  let unblockedHits = 0;

  for (let i = 0; i < hits; i += 1) {
    if (remHp <= 0) break;
    const dmg = Math.max(0, Math.floor(perHitDamage));
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
    }
  }

  const totalHpLoss = Math.max(0, initialHp - remHp);
  const isShieldBreak = initialBlock > 0 && initialBlockRemaining <= 0;
  const isLethal = initialHp > 0 && remHp <= 0;

  return {
    hits,
    perHitDamage: Math.max(0, Math.floor(perHitDamage)),
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
  const hasSkull = hasRelic(state, 'snecko_skull');
  const skullBonus = hasSkull ? 1 : 0;

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
    basePerHit = stats.damage;
    if (stats.isXCost) {
      hits = Math.max(0, state.player?.energy ?? 0);
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
    });
    sim = simulateSequentialHits(enemy, perHitDamage, hits, { isAttack: true });
  }

  // Deterministic poison projection (direct poison statuses, Catalyst, and Envenom on unblocked attack hits)
  const currentPoison = enemy.statuses?.poison ?? 0;
  let poisonAdded = 0;

  if (sim && !sim.isLethal && sim.unblockedHits > 0 && (state.player?.statuses?.envenom ?? 0) > 0) {
    poisonAdded += sim.unblockedHits * (state.player.statuses.envenom + skullBonus);
  }

  if (stats.applyEnemyStatuses?.poison) {
    poisonAdded += stats.applyEnemyStatuses.poison + skullBonus;
  }

  if (stats.multiplyPoison) {
    const preCatPoison = currentPoison + poisonAdded;
    if (preCatPoison > 0) {
      poisonAdded += preCatPoison * (stats.multiplyPoison - 1) + skullBonus;
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
  if (stats.unplayable) return result;

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
  const triggersSelfExhaust = Boolean(stats.exhaust) || corruptionExhaust;
  const triggersHandExhaust = Boolean(
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

  // 1. Enemy Danger / Synergy Triggers
  const enrageEnemies = [];
  const sharpHideEnemies = [];
  const vulnerableTargets = [];
  const poisonedTargets = [];

  for (const enemy of aliveEnemies) {
    if (isSkill && (enemy.statuses?.enrage ?? 0) > 0) {
      result.enemyTriggers.push({ enemyId: enemy.id, statusKey: 'enrage', tone: 'warn' });
      enrageEnemies.push(enemy);
    }
    if (isAttack && (enemy.statuses?.sharpHide ?? 0) > 0) {
      result.enemyTriggers.push({ enemyId: enemy.id, statusKey: 'sharpHide', tone: 'warn' });
      sharpHideEnemies.push(enemy);
    }
  }

  for (const enemy of targetedEnemies) {
    if (dealsDamage && (enemy.statuses?.vulnerable ?? 0) > 0) {
      result.enemyTriggers.push({ enemyId: enemy.id, statusKey: 'vulnerable', tone: 'buff' });
      vulnerableTargets.push(enemy);
    }
    if ((stats.bonusHitIfPoisoned || stats.multiplyPoison) && (enemy.statuses?.poison ?? 0) > 0) {
      result.enemyTriggers.push({ enemyId: enemy.id, statusKey: 'poison', tone: 'buff' });
      poisonedTargets.push(enemy);
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

  // 2. Player Status & Relic Synergies
  if (dealsDamage) {
    if ((player.statuses?.strength ?? 0) !== 0) {
      pushPlayerStatus('strength', player.statuses.strength > 0 ? 'buff' : 'warn');
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
      stats.applyEnemyStatuses?.corpseExplosion
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
      const next = cur * stats.multiplyPoison + skullBonus;
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

  // Silent: Finisher & Sneaky Strike & Shuriken / Kunai
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
    if (comboTriggers.length > 0) {
      result.callouts.push({
        tone: 'buff',
        text: `✦ 第 3 次攻击触发：${comboTriggers.join(' · ')}`,
      });
    }
  }

  // Per-card Silent powers (After Image / A Thousand Cuts)
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
  } else if (stats.upgradeAllHand || stats.upgradeAllCombatCards) {
    for (const c of combat.hand) {
      if (c.instanceId === cardInstance.instanceId) continue;
      if (canUpgradeCard(c)) {
        result.affectedHandCards.push({ instanceId: c.instanceId, tone: 'upgrade' });
      }
    }
  }

  return result;
}
