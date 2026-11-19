/**
 * Pure combat tactical previews (Lethal & Shield-Break projections) and card synergy/warning detection.
 * Used for real-time combat UI feedback during hover, selection, and drag-to-play.
 */

import { canUpgradeCard, getCardStats } from '../data/cards.js';
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
    initialBlock,
    remainingBlock: remBlock,
    remainingHp: remHp,
    isShieldBreak,
    isLethal,
  };
}

/**
 * Predicts damage, Shield Break, and Lethal outcome of playing `cardInstance` against `enemy`.
 * Returns `null` if the card does not deal damage to enemies.
 */
export function previewCardDamageOnEnemy(state, cardInstance, enemy) {
  if (!state?.combat || !cardInstance || !enemy || enemy.hp <= 0) return null;
  const stats = getCardStats(cardInstance);
  if (stats.unplayable) return null;
  if (stats.target !== 'enemy' && stats.target !== 'all_enemies') return null;

  let basePerHit = null;
  let hits = 1;

  if (stats.useBlockAsDamage) {
    basePerHit = Math.max(0, state.player?.block ?? 0);
    hits = 1;
  } else if (typeof stats.exhaustAllHandDamageEach === 'number') {
    basePerHit = stats.exhaustAllHandDamageEach;
    const otherHandCount = state.combat.hand.filter(
      (c) => c.instanceId !== cardInstance.instanceId
    ).length;
    hits = Math.max(0, otherHandCount);
  } else if (typeof stats.damage === 'number') {
    basePerHit = stats.damage;
    hits = stats.isXCost ? Math.max(0, state.player?.energy ?? 0) : stats.hits ?? 1;
  } else {
    return null;
  }

  const perHitDamage = calculateAttackDamage(basePerHit, state.player, enemy, {
    strengthMultiplier: stats.strengthMultiplier ?? 1,
  });

  // Account for Charon's Ashes bonus AoE damage if card triggers exhaust (optional bonus stays separate; keep direct card hit math exact!)
  return simulateSequentialHits(enemy, perHitDamage, hits, { isAttack: true });
}

/**
 * Predicts damage, Shield Break, and Lethal outcome of throwing a damaging potion (e.g. Fire Potion) at `enemy`.
 */
export function previewPotionDamageOnEnemy(state, potionId, enemy) {
  if (!state?.combat || !potionId || !enemy || enemy.hp <= 0) return null;
  const pot = POTION_LIBRARY[potionId];
  if (!pot || typeof pot.damage !== 'number') return null;
  const mult = hasRelic(state, 'sacred_bark') ? 2 : 1;
  return simulateSequentialHits(enemy, pot.damage * mult, 1, { isAttack: false });
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
    affectedHandCards: [], // { instanceId, tone: 'exhaust' | 'upgrade' }
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
          : aliveEnemies.length === 1
            ? aliveEnemies
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

  // 1. Enemy Danger / Synergy Triggers
  const enrageEnemies = [];
  const sharpHideEnemies = [];
  const vulnerableTargets = [];

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
      result.playerStatusHighlights.push({
        key: 'strength',
        tone: player.statuses.strength > 0 ? 'buff' : 'warn',
      });
    }
    if ((player.statuses?.weak ?? 0) > 0) {
      result.playerStatusHighlights.push({ key: 'weak', tone: 'warn' });
    }
    if (vulnerableTargets.length > 0 && hasRelic(state, 'paper_phrog')) {
      result.relicHighlights.push({ relicId: 'paper_phrog', tone: 'buff' });
      result.callouts.push({
        tone: 'buff',
        text: '✦ 【折纸青蛙】+【易伤】联动：伤害增幅提升至 +75%',
      });
    }
  }

  if (grantsBlock) {
    if ((player.statuses?.dexterity ?? 0) !== 0) {
      result.playerStatusHighlights.push({
        key: 'dexterity',
        tone: player.statuses.dexterity > 0 ? 'buff' : 'warn',
      });
    }
    if ((player.statuses?.frail ?? 0) > 0) {
      result.playerStatusHighlights.push({ key: 'frail', tone: 'warn' });
    }
    if ((player.statuses?.barricade ?? 0) > 0) {
      result.playerStatusHighlights.push({ key: 'barricade', tone: 'buff' });
    }
  }

  if (stats.useBlockAsDamage || stats.doubleBlock) {
    result.highlightPlayerBlock = true;
    if ((player.statuses?.barricade ?? 0) > 0 && stats.doubleBlock) {
      result.playerStatusHighlights.push({ key: 'barricade', tone: 'buff' });
    }
  }

  if (corruptionExhaust) {
    result.playerStatusHighlights.push({ key: 'corruption', tone: 'buff' });
  }

  if (triggersAnyExhaust) {
    const exhaustSynergyNames = [];
    if ((player.statuses?.feelNoPain ?? 0) > 0) {
      result.playerStatusHighlights.push({ key: 'feelNoPain', tone: 'buff' });
      exhaustSynergyNames.push(`无惧疼痛(+${player.statuses.feelNoPain}盾)`);
    }
    if ((player.statuses?.darkEmbrace ?? 0) > 0) {
      result.playerStatusHighlights.push({ key: 'darkEmbrace', tone: 'buff' });
      exhaustSynergyNames.push(`黑暗之拥(抽${player.statuses.darkEmbrace}张)`);
    }
    if (hasRelic(state, 'charons_ashes')) {
      result.relicHighlights.push({ relicId: 'charons_ashes', tone: 'buff' });
      exhaustSynergyNames.push('卡戎之灰(全体3伤)');
    }
    if (exhaustSynergyNames.length > 0) {
      result.callouts.push({
        tone: 'buff',
        text: `✦ 消耗联动：${exhaustSynergyNames.join(' · ')}`,
      });
    }
  }

  if ((stats.draw ?? 0) > 0 && (player.statuses?.noDraw ?? 0) > 0) {
    result.playerStatusHighlights.push({ key: 'noDraw', tone: 'warn' });
    result.callouts.push({
      tone: 'warn',
      text: '⚠ 当前处于【禁抽】状态，抽牌效果不会生效',
    });
  }

  if (hasRelic(state, 'velvet_choker') && (combat.cardsPlayedThisTurn ?? 0) >= VELVET_CHOKER_CARD_LIMIT - 2) {
    const remaining = Math.max(0, VELVET_CHOKER_CARD_LIMIT - (combat.cardsPlayedThisTurn ?? 0));
    result.relicHighlights.push({ relicId: 'velvet_choker', tone: 'warn' });
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
  } else if (stats.upgradeAllHand) {
    for (const c of combat.hand) {
      if (c.instanceId === cardInstance.instanceId) continue;
      if (canUpgradeCard(c)) {
        result.affectedHandCards.push({ instanceId: c.instanceId, tone: 'upgrade' });
      }
    }
  }

  return result;
}
