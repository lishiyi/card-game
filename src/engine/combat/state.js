/**
 * Core combat state primitives, status bookkeeping, enemy zero-HP/minion handling,
 * and pending card-choice state helpers.
 */

import { CARD_LIBRARY, createCardInstance, getCardCharacter, getCardStats } from '../../data/cards.js';
import { ENEMY_TEMPLATES, GREMLIN_POOL, rollEnemyIntent } from '../../data/enemies.js';
import { RELIC_LIBRARY, STATUS_METADATA } from '../../data/relics.js';
import { pickDistinct, shuffled } from '../rng.js';

export const MAX_HAND_SIZE = 10;
export const BASE_DRAW_PER_TURN = 5;
export const VELVET_CHOKER_CARD_LIMIT = 6;
export const RUSHDOWN_MAX_TRIGGERS_PER_TURN = Infinity;
export const VALID_STANCES = new Set(['neutral', 'calm', 'wrath', 'divinity']);
export const DECAYING_DEBUFFS = ['vulnerable', 'weak', 'frail', 'lockOn', 'noBlock'];
export const ROUND_DECAY_STATUSES = ['vulnerable', 'weak', 'frail', 'lockOn', 'noBlock', 'intangible'];
export const SIGNED_STATUSES = new Set(['strength', 'dexterity', 'focus']);

export function cloneCardForReveal(cardInstance) {
  if (!cardInstance || !cardInstance.cardId) return null;
  return {
    instanceId: cardInstance.instanceId,
    cardId: cardInstance.cardId,
    upgraded: Boolean(cardInstance.upgraded),
    ...(Number.isInteger(cardInstance.upgradeLevel) ? { upgradeLevel: cardInstance.upgradeLevel } : {}),
    combatCost: cardInstance.combatCost ?? null,
    combatDamageMod: cardInstance.combatDamageMod ?? 0,
    combatBlockMod: cardInstance.combatBlockMod ?? 0,
    retainedCostDiscount: cardInstance.retainedCostDiscount ?? 0,
    ...(cardInstance.zeroCostUntilPlayed ? { zeroCostUntilPlayed: true } : {}),
    ...(typeof cardInstance.miscBonus === 'number' ? { miscBonus: cardInstance.miscBonus } : {}),
    ...(typeof cardInstance.ritualBonus === 'number' ? { ritualBonus: cardInstance.ritualBonus } : {}),
    ...(typeof cardInstance.expungerHits === 'number' ? { expungerHits: cardInstance.expungerHits } : {}),
  };
}

export function pushCardReveal(combat, reveal) {
  if (!combat || !reveal) return;
  if (!Array.isArray(combat.pendingCardReveals)) {
    combat.pendingCardReveals = [];
  }
  combat.pendingCardReveals.push({
    sourceName: reveal.sourceName || '',
    kind: reveal.kind || 'auto_play',
    card: cloneCardForReveal(reveal.card),
    targetName: reveal.targetName || null,
    exhausted: Boolean(reveal.exhausted),
    summary: reveal.summary || '',
  });
}

export function hasRelic(state, relicId) {
  return Array.isArray(state?.player?.relics) && state.player.relics.includes(relicId);
}

export function healPlayerInCombat(state, rawAmount) {
  if (!state?.player || state.player.hp <= 0 || !Number.isFinite(rawAmount) || rawAmount <= 0) return 0;
  let amt = Math.floor(rawAmount);
  if (hasRelic(state, 'magic_flower')) {
    amt = Math.max(1, Math.floor(amt * 1.5));
  }
  const before = state.player.hp;
  state.player.hp = Math.min(state.player.maxHp, state.player.hp + amt);
  const healed = state.player.hp - before;
  if (healed > 0) {
    syncRedSkullStatus(state);
  }
  return healed;
}

export function getAliveEnemies(combat) {
  if (!combat || !Array.isArray(combat.enemies)) return [];
  return combat.enemies.filter((e) => e.hp > 0);
}

export function pushCombatLog(combat, message, category = 'info') {
  if (!combat) return;
  combat.logSeq = (combat.logSeq ?? 0) + 1;
  combat.logs.push({
    id: combat.logSeq,
    turn: combat.turn,
    message,
    category,
  });
  if (combat.logs.length > 70) {
    combat.logs.splice(0, combat.logs.length - 70);
  }
}

export function applyStatus(entity, statusKey, delta, options = {}) {
  if (!entity || !Number.isFinite(delta) || delta === 0) return false;
  if (!entity.statuses) entity.statuses = {};
  if (!entity.skipStatusTick) entity.skipStatusTick = {};

  const isNegativeDebuff =
    (STATUS_METADATA[statusKey]?.polarity === 'debuff' && delta > 0) ||
    (SIGNED_STATUSES.has(statusKey) && delta < 0);

  if (!options.bypassArtifact && isNegativeDebuff && (entity.statuses.artifact ?? 0) > 0) {
    entity.statuses.artifact -= 1;
    if (entity.statuses.artifact <= 0) {
      delete entity.statuses.artifact;
    }
    return false;
  }

  const prev = entity.statuses[statusKey] ?? 0;
  const next = prev + delta;

  if (SIGNED_STATUSES.has(statusKey)) {
    if (next === 0) {
      delete entity.statuses[statusKey];
    } else {
      entity.statuses[statusKey] = next;
    }
    return true;
  }

  if (next <= 0) {
    delete entity.statuses[statusKey];
    delete entity.skipStatusTick[statusKey];
    return true;
  }

  entity.statuses[statusKey] = next;
  if (
    DECAYING_DEBUFFS.includes(statusKey) &&
    delta > 0 &&
    prev <= 0 &&
    options.appliedDuringEnemyTurn
  ) {
    entity.skipStatusTick[statusKey] = true;
  }
  return true;
}

export function decayRoundStatuses(entity) {
  if (!entity?.statuses) return;
  if (!entity.skipStatusTick) entity.skipStatusTick = {};

  for (const key of ROUND_DECAY_STATUSES) {
    const current = entity.statuses[key] ?? 0;
    if (current <= 0) continue;

    if (entity.skipStatusTick[key]) {
      delete entity.skipStatusTick[key];
      continue;
    }

    if (current - 1 <= 0) {
      delete entity.statuses[key];
    } else {
      entity.statuses[key] = current - 1;
    }
  }
}

export function addCardsToHand(state, cardId, count, upgraded = false) {
  const combat = state?.combat;
  if (!combat || count <= 0) return [];
  const masterUp = (state.player?.statuses?.masterReality ?? 0) > 0;
  const effUpgraded = Boolean(upgraded || (masterUp && CARD_LIBRARY[cardId]?.upgraded));
  const created = [];
  let overflow = 0;
  for (let i = 0; i < count; i += 1) {
    const card = createCardInstance(state, cardId, effUpgraded);
    created.push(card);
    if (combat.hand.length < MAX_HAND_SIZE) {
      combat.hand.push(card);
    } else {
      combat.discardPile.push(card);
      overflow += 1;
    }
  }
  const cName = created[0] ? getCardStats(created[0]).name : cardId;
  pushCombatLog(
    combat,
    `将 ${count} 张【${cName}】加入手牌${overflow > 0 ? `（手牌已满，${overflow} 张溢入弃牌堆）` : ''}。`,
    'info'
  );
  return created;
}

export function syncRedSkullStatus(state) {
  const combat = state?.combat;
  if (!combat || combat.status !== 'ongoing' || !hasRelic(state, 'red_skull')) return;
  const shouldBeActive =
    state.player.hp > 0 && state.player.hp <= Math.floor(state.player.maxHp * 0.5);
  const wasActive = Boolean(combat.redSkullActive);
  if (shouldBeActive && !wasActive) {
    combat.redSkullActive = true;
    applyStatus(state.player, 'strength', 3, { bypassArtifact: true });
    pushCombatLog(
      combat,
      `遗物【${RELIC_LIBRARY.red_skull.name}】觉醒：生命值 ≤ 50%，获得 3 点【力量】！`,
      'status'
    );
  } else if (!shouldBeActive && wasActive) {
    combat.redSkullActive = false;
    applyStatus(state.player, 'strength', -3, { bypassArtifact: true });
    pushCombatLog(
      combat,
      `遗物【${RELIC_LIBRARY.red_skull.name}】平息：生命高于 50%，失去 3 点临时【力量】。`,
      'status'
    );
  }
}

export function handleEnemyZeroHp(state, enemy) {
  const combat = state?.combat;
  if (!combat || !enemy || enemy.hp > 0) return false;
  if (enemy.templateId === 'awakened_one' && enemy.unawakened) {
    enemy.unawakened = false;
    enemy.awakenedPhase = 2;
    enemy.awakeTurnIndex = 0;
    enemy.hp = enemy.maxHp;
    enemy.block = 0;
    if (!enemy.statuses) enemy.statuses = {};
    for (const debuffKey of [
      'vulnerable',
      'weak',
      'frail',
      'poison',
      'corpseExplosion',
      'gainStrengthEndTurn',
      'curiosity',
    ]) {
      delete enemy.statuses[debuffKey];
      if (enemy.skipStatusTick) delete enemy.skipStatusTick[debuffKey];
    }
    if ((enemy.statuses.strength ?? 0) < 0) {
      delete enemy.statuses.strength;
    }
    if ((enemy.statuses.regenerating ?? 0) <= 0) {
      enemy.statuses.regenerating = 10;
    }
    enemy.intent = rollEnemyIntent(state, enemy);
    pushCombatLog(
      combat,
      `【${enemy.name}】触发【黑暗重生】！清除负面并摆脱好奇限制，以 ${enemy.hp} 点生命苏醒进入二阶段！`,
      'status'
    );
    return true;
  }
  if ((enemy.statuses?.lifeLink ?? 0) > 0) {
    const otherAlive = combat.enemies.some((e) => e.id !== enemy.id && e.hp > 0);
    if (otherAlive) {
      enemy.hp = 0;
      enemy.block = 0;
      enemy.darklingRegrowTurns = 2;
      if (enemy.statuses) {
        for (const debuffKey of [
          'vulnerable',
          'weak',
          'frail',
          'poison',
          'corpseExplosion',
          'choke',
          'mark',
          'talkToTheHand',
          'gainStrengthEndTurn',
        ]) {
          delete enemy.statuses[debuffKey];
          if (enemy.skipStatusTick) delete enemy.skipStatusTick[debuffKey];
        }
      }
      enemy.intent = {
        id: 'regrow_wait',
        name: '暗影凝聚 (2回合)',
        type: 'buff',
        summary: '生命链接生效！正在凝聚暗影（2 回合后恢复 50% 生命复活），请尽快击倒其余暗影虫！',
      };
      pushCombatLog(
        combat,
        `【${enemy.name}】倒下但触发【生命链接】：开始凝聚暗影，将在 2 回合后复苏！`,
        'status'
      );
      return true;
    }
    // Last living enemy fell — permanently extinguish all regrowing Darklings
    for (const ally of combat.enemies) {
      if ((ally.darklingRegrowTurns ?? 0) > 0) {
        ally.darklingRegrowTurns = 0;
        ally.intent = null;
      }
    }
  }
  return false;
}

export function pruneDefeatedEnemies(combat) {
  if (!combat || !Array.isArray(combat.enemies)) return;
  combat.enemies = combat.enemies.filter(
    (e) => e.hp > 0 || (e.darklingRegrowTurns ?? 0) > 0
  );
}

export function handleMinionsFleeIfLeaderDead(state) {
  const combat = state?.combat;
  if (!combat || combat.status !== 'ongoing' || !Array.isArray(combat.enemies)) return false;
  const hadNonMinion =
    combat.hadNonMinionEnemy !== undefined
      ? Boolean(combat.hadNonMinionEnemy)
      : combat.enemies.some((e) => !e.isMinion);
  if (!hadNonMinion) return false;

  const remainingActive = combat.enemies.filter(
    (e) => e.hp > 0 || (e.darklingRegrowTurns ?? 0) > 0
  );
  if (remainingActive.length === 0) return false;
  if (remainingActive.some((e) => !e.isMinion)) return false;

  const fleeingMinions = remainingActive.filter((e) => e.isMinion && e.hp > 0);
  if (fleeingMinions.length === 0) return false;

  if (!Array.isArray(combat.fledEnemyIds)) combat.fledEnemyIds = [];
  const names = fleeingMinions.map((m) => `【${m.name}】`).join('、');
  for (const m of fleeingMinions) {
    m.hp = 0;
    m.block = 0;
    m.intent = null;
    m.fled = true;
    m.stasisCard = null;
    m._deathHandled = true;
    combat.fledEnemyIds.push(m.id);
  }
  pushCombatLog(
    combat,
    `主敌已倒下，剩余爪牙${names}仓皇逃窜，战斗直接胜利！`,
    'victory'
  );
  return true;
}

export function reconcileCombatState(state, onVictoryCallback = null) {
  const combat = state?.combat;
  if (!combat || state.screen !== 'combat' || combat.status !== 'ongoing') return false;
  if (!Array.isArray(combat.enemies)) return false;
  const hasGremlinLeader = combat.enemies.some((e) => e.templateId === 'gremlin_leader');
  for (const e of combat.enemies) {
    if (!e.isMinion) {
      if (ENEMY_TEMPLATES[e.templateId]?.isMinion) {
        e.isMinion = true;
      } else if (hasGremlinLeader && GREMLIN_POOL.includes(e.templateId)) {
        e.isMinion = true;
      }
    }
  }
  if (combat.hadNonMinionEnemy === undefined) {
    combat.hadNonMinionEnemy = combat.enemies.some((e) => !e.isMinion);
  }
  if (combat.defeatedEnemiesCount === undefined) {
    combat.defeatedEnemiesCount = combat.enemies.filter(
      (e) => e.hp <= 0 && !((e.darklingRegrowTurns ?? 0) > 0) && !e.fled
    ).length;
  }
  const fled = handleMinionsFleeIfLeaderDead(state);
  const prevLen = combat.enemies.length;
  pruneDefeatedEnemies(combat);
  if (getAliveEnemies(combat).length === 0 && state.player.hp > 0) {
    finalizeCombatVictory(state, onVictoryCallback);
    return true;
  }
  return fled || combat.enemies.length !== prevLen;
}

export function reshuffleDiscardIntoDraw(state, { triggerRelics = true } = {}) {
  const combat = state?.combat;
  if (!combat || combat.discardPile.length === 0) return false;
  combat.drawPile = [...combat.drawPile, ...shuffled(state, combat.discardPile)];
  combat.discardPile = [];
  combat.reshuffleCount = (combat.reshuffleCount ?? 0) + 1;
  pushCombatLog(combat, '弃牌堆已重新洗入抽牌堆。', 'info');

  if (triggerRelics && combat.status === 'ongoing') {
    if (hasRelic(state, 'sundial')) {
      if (!state.relicCounters) state.relicCounters = {};
      const next = ((state.relicCounters.sundial ?? 0) + 1) % 3;
      state.relicCounters.sundial = next;
      if (next === 0) {
        state.player.energy += 2;
        pushCombatLog(
          combat,
          `遗物【${RELIC_LIBRARY.sundial.name}】触发（每 3 次洗牌）：立即获得 2 点能量！`,
          'info'
        );
      }
    }
    if (hasRelic(state, 'melange') && combat.phase === 'player') {
      combat._melangeScryQueued = true;
    }
  }
  return true;
}

export function applyEnemyInvincibleCap(combat, enemy, rawHpLoss) {
  if (!enemy || rawHpLoss <= 0) return rawHpLoss;
  if ((enemy.invincibleMax ?? 0) <= 0 && enemy.statuses?.invincible === undefined) {
    return rawHpLoss;
  }
  const remaining = Math.max(0, enemy.statuses?.invincible ?? 0);
  const capped = Math.min(rawHpLoss, remaining);
  enemy.statuses.invincible = Math.max(0, remaining - capped);
  if (capped < rawHpLoss) {
    pushCombatLog(
      combat,
      capped === 0
        ? `【${enemy.name}】的【无敌】屏障阻挡了全部伤害（本回合已达承伤上限）！`
        : `【${enemy.name}】的【无敌】屏障将伤害限制为 ${capped} 点（本回合已达承伤上限）！`,
      'status'
    );
  }
  return capped;
}

export function checkSlimeSplitTrigger(combat, enemy) {
  if (!combat || !enemy || enemy.hp <= 0) return false;
  const splitChildren = ENEMY_TEMPLATES[enemy.templateId]?.splitInto;
  if (!Array.isArray(splitChildren) || splitChildren.length === 0) return false;
  if ((enemy.statuses?.splitThreshold ?? 0) <= 0) return false;
  if (enemy.hp > Math.floor(enemy.maxHp / 2)) return false;
  if (enemy.intent?.id === 'split') return false;

  delete enemy.statuses.splitThreshold;
  const splitName =
    enemy.templateId === 'slime_boss'
      ? '巨体分裂'
      : enemy.templateId === 'acid_slime_l'
        ? '酸液分裂'
        : '尖刺分裂';
  const childNames = splitChildren
    .map((cid) => ENEMY_TEMPLATES[cid]?.name || cid)
    .join('与');
  enemy.intent = {
    id: 'split',
    name: splitName,
    type: 'buff',
    splitInto: [...splitChildren],
    summary: `意图：分裂为${childNames}（各自继承当前生命值）`,
  };
  pushCombatLog(
    combat,
    `【${enemy.name}】生命跌破半数，打断原定行动并准备【${splitName}】！`,
    'status'
  );
  return true;
}

export function setPendingCardChoice(combat, choice) {
  if (!combat) return;
  combat.pendingCardChoice = choice || null;
  combat.pendingDiscard = choice && choice.mode === 'discard' ? choice : null;
}

export function hasPendingCardChoice(combat) {
  return Boolean(combat && (combat.pendingCardChoice || combat.pendingDiscard));
}

export function getActivePendingCardChoice(combat) {
  if (!combat) return null;
  if (combat.pendingCardChoice) return combat.pendingCardChoice;
  if (combat.pendingDiscard) {
    return {
      mode: 'discard',
      sourceName: combat.pendingDiscard.sourceName || '弃牌',
      count: combat.pendingDiscard.count ?? 1,
      remaining: combat.pendingDiscard.remaining ?? 1,
      optional: false,
      candidates: null,
      selectedIds: [],
    };
  }
  return null;
}

let _playCardHandler = null;

export function registerPlayCardHandler(fn) {
  _playCardHandler = fn;
}

export function invokePlayCard(state, instanceId, targetEnemyId = null, onVictoryCallback = null, internalOpts = {}) {
  if (typeof _playCardHandler !== 'function') {
    return { ok: false, reason: '出牌处理器未就绪' };
  }
  return _playCardHandler(state, instanceId, targetEnemyId, onVictoryCallback, internalOpts);
}

export function getPendingChoiceBlockReason(combat) {
  const active = getActivePendingCardChoice(combat);
  if (!active) return '';
  switch (active.mode) {
    case 'exhaust':
      return '请先选择要消耗的手牌';
    case 'exhaust_multi':
      return '请先选择要消耗的手牌并确认';
    case 'upgrade':
      return '请先选择要升级的手牌';
    case 'dual_wield':
      return '请先选择要复制的攻击牌或能力牌';
    case 'nightmare':
      return '请先选择下回合要复制的手牌';
    case 'scry':
      return '请先完成预见选择';
    case 'discard_to_draw':
      return '请先从弃牌堆选择要置顶的卡牌';
    case 'retrieve_discard_retain':
      return '请先从弃牌堆选择要取回并保留的卡牌';
    case 'retrieve_discard_to_hand':
      return '请先从弃牌堆选择要加入手牌的卡牌';
    case 'retrieve_exhaust_to_hand':
      return '请先从消耗堆选择要发掘加入手牌的卡牌';
    case 'pick_from_draw':
      return '请先从抽牌堆选择要加入手牌的卡牌';
    case 'omniscience':
      return '请先从抽牌堆选择要连续打出 2 次的卡牌';
    case 'discover_card':
      return '请先从 3 张候选卡牌中选择 1 张加入手牌';
    case 'wish':
      return '请先选择一项愿望';
    case 'hand_to_draw':
      return '请先选择要置于抽牌堆顶的手牌';
    case 'hand_to_draw_bottom':
      return '请先选择要置于抽牌堆底的手牌';
    case 'hand_to_draw_bottom_multi':
      return '请先选择要置于抽牌堆底的手牌并确认';
    case 'retain':
      return '请先选择本回合要保留的手牌并确认结束回合';
    default:
      return '请先选择要弃置的手牌';
  }
}

export function requestDiscardPileChoice(
  state,
  mode,
  count,
  sourceName = '选牌',
  options = {}
) {
  const combat = state?.combat;
  if (
    !combat ||
    combat.status !== 'ongoing' ||
    combat.phase !== 'player' ||
    count <= 0 ||
    getAliveEnemies(combat).length === 0
  ) {
    return false;
  }
  const excludeId = options.excludeInstanceId || null;
  const eligible = (combat.discardPile || []).filter((c) => c.instanceId !== excludeId);
  if (eligible.length === 0) {
    pushCombatLog(combat, `【${sourceName}】弃牌堆中没有可选卡牌。`, 'info');
    return false;
  }

  if (mode === 'retrieve_discard_retain') {
    const handRoom = Math.max(0, MAX_HAND_SIZE - combat.hand.length);
    const maxPick = Math.min(count, handRoom, eligible.length);
    if (maxPick <= 0) {
      pushCombatLog(combat, `【${sourceName}】手牌已满，无法从弃牌堆取回卡牌。`, 'info');
      return false;
    }
    setPendingCardChoice(combat, {
      mode: 'retrieve_discard_retain',
      sourceName,
      count: maxPick,
      remaining: maxPick,
      optional: true,
      candidates: [...eligible],
      selectedIds: [],
      endTurnAfter: Boolean(options.endTurnAfter),
    });
    return true;
  }

  if (mode === 'retrieve_discard_to_hand') {
    const handRoom = Math.max(0, MAX_HAND_SIZE - combat.hand.length);
    const maxPick = Math.min(count, handRoom, eligible.length);
    if (maxPick <= 0) {
      pushCombatLog(combat, `【${sourceName}】手牌已满，无法从弃牌堆取回卡牌。`, 'info');
      return false;
    }
    setPendingCardChoice(combat, {
      mode: 'retrieve_discard_to_hand',
      sourceName,
      count: maxPick,
      remaining: maxPick,
      optional: false,
      candidates: [...eligible],
      selectedIds: [],
    });
    return true;
  }

  if (mode === 'discard_to_draw') {
    const maxPick = Math.min(count, eligible.length);
    setPendingCardChoice(combat, {
      mode: 'discard_to_draw',
      sourceName,
      count: maxPick,
      remaining: maxPick,
      optional: false,
      candidates: [...eligible],
      selectedIds: [],
    });
    return true;
  }

  return false;
}

export function requestDrawPileChoice(state, count, sourceName = '搜寻', options = {}) {
  const combat = state?.combat;
  if (
    !combat ||
    combat.status !== 'ongoing' ||
    combat.phase !== 'player' ||
    count <= 0 ||
    getAliveEnemies(combat).length === 0
  ) {
    return false;
  }
  const mode = options.mode === 'omniscience' ? 'omniscience' : 'pick_from_draw';
  const filterType = options.filterType || null;
  const eligible = (combat.drawPile || []).filter((c) => {
    if (!filterType) return true;
    return getCardStats(c).type === filterType;
  });
  if (eligible.length === 0) {
    const typeLabel = filterType === 'skill' ? '技能' : filterType === 'attack' ? '攻击' : '';
    pushCombatLog(combat, `【${sourceName}】抽牌堆中没有可选的${typeLabel}牌。`, 'info');
    return false;
  }
  const maxPick =
    mode === 'omniscience'
      ? Math.min(count, eligible.length)
      : Math.min(count, Math.max(0, MAX_HAND_SIZE - combat.hand.length), eligible.length);
  if (maxPick <= 0) {
    pushCombatLog(combat, `【${sourceName}】手牌已满，无法从抽牌堆检索卡牌。`, 'info');
    return false;
  }
  // Sort candidates by name/cost rather than draw order so Seek/Omniscience do not spoil upcoming draws
  const sortedCandidates = [...eligible].sort((a, b) => {
    const sa = getCardStats(a);
    const sb = getCardStats(b);
    const ca = typeof sa.cost === 'number' ? sa.cost : 99;
    const cb = typeof sb.cost === 'number' ? sb.cost : 99;
    return ca - cb || sa.name.localeCompare(sb.name, 'zh-CN');
  });
  setPendingCardChoice(combat, {
    mode,
    sourceName,
    count: maxPick,
    remaining: maxPick,
    optional: false,
    filterType,
    candidates: sortedCandidates,
    selectedIds: [],
  });
  return true;
}

export function requestExhaustPileChoice(state, count, sourceName = '发掘') {
  const combat = state?.combat;
  if (
    !combat ||
    combat.status !== 'ongoing' ||
    combat.phase !== 'player' ||
    count <= 0 ||
    getAliveEnemies(combat).length === 0
  ) {
    return false;
  }
  const eligible = (combat.exhaustPile || []).filter((c) => c.cardId !== 'exhume');
  if (eligible.length === 0) {
    pushCombatLog(combat, `【${sourceName}】消耗堆中没有可发掘的卡牌。`, 'info');
    return false;
  }
  const handRoom = Math.max(0, MAX_HAND_SIZE - combat.hand.length);
  const maxPick = Math.min(count, handRoom, eligible.length);
  if (maxPick <= 0) {
    pushCombatLog(combat, `【${sourceName}】手牌已满，无法从消耗堆取回卡牌。`, 'info');
    return false;
  }
  setPendingCardChoice(combat, {
    mode: 'retrieve_exhaust_to_hand',
    sourceName,
    count: maxPick,
    remaining: maxPick,
    optional: false,
    candidates: [...eligible],
    selectedIds: [],
  });
  return true;
}

export function requestDiscoverCardChoice(state, cfg = {}, sourceName = '发现') {
  const combat = state?.combat;
  if (
    !combat ||
    combat.status !== 'ongoing' ||
    combat.phase !== 'player' ||
    getAliveEnemies(combat).length === 0
  ) {
    return false;
  }
  const charId = state.characterId ?? state.player?.characterId ?? 'ironclad';
  const poolKind = cfg.pool || 'class_any';
  const count = cfg.count || 3;
  const masterUp = (state.player?.statuses?.masterReality ?? 0) > 0;
  let eligibleIds = [];
  if (poolKind === 'any_attack') {
    eligibleIds = Object.values(CARD_LIBRARY)
      .filter(
        (c) =>
          c.type === 'attack' &&
          !c.shopOnly &&
          c.rarity !== 'starter' &&
          c.rarity !== 'special' &&
          c.rarity !== 'status' &&
          c.rarity !== 'curse' &&
          c.id !== 'strike'
      )
      .map((c) => c.id);
  } else {
    eligibleIds = Object.values(CARD_LIBRARY)
      .filter(
        (c) =>
          getCardCharacter(c) === charId &&
          !c.shopOnly &&
          c.rarity !== 'starter' &&
          c.rarity !== 'special' &&
          c.type !== 'status' &&
          c.type !== 'curse' &&
          !c.base?.healHp &&
          c.id !== 'feed' &&
          c.id !== 'reaper' &&
          c.id !== 'alchemize' &&
          c.id !== 'self_repair' &&
          c.id !== 'lesson_learned' &&
          c.id !== 'wish'
      )
      .map((c) => c.id);
  }
  const pickedIds = pickDistinct(state, eligibleIds, count);
  if (pickedIds.length === 0) return false;
  const candidates = pickedIds.map((cid) => {
    const inst = createCardInstance(state, cid, Boolean(masterUp && CARD_LIBRARY[cid]?.upgraded));
    if (cfg.tempZeroCostTurn && !CARD_LIBRARY[cid]?.base?.isXCost) {
      inst.prevCombatCost = null;
      inst.combatCost = 0;
      inst.tempZeroCostTurn = true;
    }
    return inst;
  });
  setPendingCardChoice(combat, {
    mode: 'discover_card',
    sourceName,
    count: 1,
    remaining: 1,
    optional: false,
    tempZeroCostTurn: Boolean(cfg.tempZeroCostTurn),
    candidates,
    selectedIds: [],
  });
  return true;
}

export function requestWishChoice(state, wishCfg, sourceName = '许愿') {
  const combat = state?.combat;
  if (
    !combat ||
    combat.status !== 'ongoing' ||
    combat.phase !== 'player' ||
    !wishCfg ||
    getAliveEnemies(combat).length === 0
  ) {
    return false;
  }
  const candidates = [
    {
      instanceId: 'wish_plated_armor',
      wishKey: 'platedArmor',
      title: '活命',
      subtitle: `获得 ${wishCfg.platedArmor} 层【多层护甲】`,
      value: wishCfg.platedArmor,
      tone: 'block',
    },
    {
      instanceId: 'wish_strength',
      wishKey: 'strength',
      title: '成名',
      subtitle: `获得 ${wishCfg.strength} 点【力量】`,
      value: wishCfg.strength,
      tone: 'attack',
    },
    {
      instanceId: 'wish_gold',
      wishKey: 'gold',
      title: '暴富',
      subtitle: `立即获得 ${wishCfg.gold} 金币`,
      value: wishCfg.gold,
      tone: 'gold',
    },
  ];
  setPendingCardChoice(combat, {
    mode: 'wish',
    sourceName,
    count: 1,
    remaining: 1,
    optional: false,
    candidates,
    selectedIds: [],
  });
  return true;
}

export function requestEndTurnRetainChoice(state, quota, sourceName = '计划妥当') {
  const combat = state?.combat;
  if (
    !combat ||
    combat.status !== 'ongoing' ||
    combat.phase !== 'player' ||
    quota <= 0 ||
    getAliveEnemies(combat).length === 0
  ) {
    return false;
  }
  const eligible = (combat.hand || []).filter((c) => {
    const st = getCardStats(c);
    return !st.ethereal && !st.retain && !c.tempRetainTurn;
  });
  const meaningful = eligible.filter((c) => {
    const t = getCardStats(c).type;
    return t !== 'curse' && t !== 'status';
  });
  if (eligible.length === 0 || meaningful.length === 0) {
    return false;
  }
  const maxPick = Math.min(quota, eligible.length);
  setPendingCardChoice(combat, {
    mode: 'retain',
    sourceName,
    count: maxPick,
    remaining: maxPick,
    optional: true,
    candidates: [...eligible],
    selectedIds: [],
  });
  return true;
}

export function returnDiscardCardsByFlag(state, flagName, sourceLabel) {
  const combat = state?.combat;
  if (!combat || !Array.isArray(combat.discardPile) || combat.discardPile.length === 0) return 0;
  let returned = 0;
  const remainingDiscard = [];
  for (const card of combat.discardPile) {
    const stats = getCardStats(card);
    if (stats[flagName] && combat.hand.length < MAX_HAND_SIZE) {
      combat.hand.push(card);
      returned += 1;
    } else {
      remainingDiscard.push(card);
    }
  }
  combat.discardPile = remainingDiscard;
  if (returned > 0) {
    pushCombatLog(
      combat,
      `${sourceLabel}触发：${returned} 张卡牌从弃牌堆返回手牌！`,
      'info'
    );
  }
  return returned;
}

export function toggleScryChoice(state, instanceId) {
  const combat = state?.combat;
  const pending = getActivePendingCardChoice(combat);
  if (!combat || !pending || pending.mode !== 'scry') {
    return { ok: false, reason: '当前不在预见选牌阶段' };
  }
  const valid = (pending.candidates || []).some((c) => c.instanceId === instanceId);
  if (!valid) {
    return { ok: false, reason: '该卡牌不在本次预见范围内' };
  }
  const idx = pending.selectedIds.indexOf(instanceId);
  if (idx === -1) {
    pending.selectedIds.push(instanceId);
  } else {
    pending.selectedIds.splice(idx, 1);
  }
  return { ok: true, selectedIds: [...pending.selectedIds] };
}

export function togglePendingCardChoice(state, instanceId) {
  const combat = state?.combat;
  const pending = getActivePendingCardChoice(combat);
  if (
    !combat ||
    state.screen !== 'combat' ||
    combat.status !== 'ongoing' ||
    combat.phase !== 'player' ||
    !pending
  ) {
    return { ok: false, reason: '当前不在选牌阶段' };
  }
  if (pending.mode === 'scry') {
    return toggleScryChoice(state, instanceId);
  }
  if (
    pending.mode !== 'retrieve_discard_retain' &&
    pending.mode !== 'retain' &&
    pending.mode !== 'exhaust_multi' &&
    pending.mode !== 'hand_to_draw_bottom_multi'
  ) {
    return { ok: false, reason: '当前选牌模式不支持多选切换' };
  }
  const valid = (pending.candidates || []).some((c) => c.instanceId === instanceId);
  if (!valid) {
    return { ok: false, reason: '该卡牌不在可选范围内' };
  }
  if (!Array.isArray(pending.selectedIds)) {
    pending.selectedIds = [];
  }
  const idx = pending.selectedIds.indexOf(instanceId);
  if (idx !== -1) {
    pending.selectedIds.splice(idx, 1);
  } else if (pending.selectedIds.length < pending.count) {
    pending.selectedIds.push(instanceId);
  } else if (pending.count === 1) {
    pending.selectedIds = [instanceId];
  } else {
    return { ok: false, reason: `最多只能选择 ${pending.count} 张卡牌（再次点击已选卡牌可取消）` };
  }
  pending.remaining = Math.max(0, pending.count - pending.selectedIds.length);
  return {
    ok: true,
    mode: pending.mode,
    selectedIds: [...pending.selectedIds],
    remaining: pending.remaining,
  };
}

export function captureCombatSnapshot(state) {
  return structuredClone({
    rngState: state.rngState,
    nextUid: state.nextUid,
    player: state.player,
    combat: state.combat,
    stats: state.stats,
    relicCounters: state.relicCounters || {},
    relicFlags: state.relicFlags || {},
  });
}

export function handleCombatDefeat(state) {
  if (!state.combat || state.combat.status === 'defeat') return;
  if (hasRelic(state, 'lizard_tail') && !state.relicFlags?.lizardTailUsed) {
    if (!state.relicFlags) state.relicFlags = {};
    state.relicFlags.lizardTailUsed = true;
    state.player.hp = Math.max(1, Math.floor(state.player.maxHp * 0.3));
    syncRedSkullStatus(state);
    pushCombatLog(
      state.combat,
      `遗物【${RELIC_LIBRARY.lizard_tail.name}】触发！奇迹般免于阵亡并回复至 ${state.player.hp} 点生命！`,
      'victory'
    );
    return;
  }
  state.combat.status = 'defeat';
  state.combat.phase = 'ended';
  state.player.block = 0;
  state.player.stance = 'neutral';
  state.player.orbs = [];
  state.player.maxOrbSlots = 0;
  state.combatSnapshot = null;
  if (state.stats) {
    state.stats.defeatedBy = `第 ${state.act ?? 1} 幕 F${Math.max(1, state.floor ?? 1)} · ${state.combat.encounterName || '未知强敌'}`;
  }
  pushCombatLog(state.combat, '你在尖塔中倒下了……', 'defeat');
  state.screen = 'game_over';
  state.runOutcome = 'defeat';
}

export function resolveEnemyTarget(combat, targetMode, targetEnemyId) {
  const alive = getAliveEnemies(combat);
  if (targetEnemyId !== null && targetEnemyId !== undefined) {
    const found = alive.find((e) => e.id === targetEnemyId);
    if (!found) {
      return { ok: false, reason: '目标无效或已被击败' };
    }
    return { ok: true, enemy: targetMode === 'enemy' ? found : null };
  }
  if (targetMode !== 'enemy') {
    return { ok: true, enemy: null };
  }
  if (alive.length === 0) {
    return { ok: false, reason: '场上没有存活的敌人' };
  }
  if (alive.length === 1) {
    return { ok: true, enemy: alive[0] };
  }
  return { ok: false, reason: '请先选择一名目标敌人' };
}

export function finalizeCombatVictory(state, onVictoryCallback = null) {
  const combat = state.combat;
  if (!combat || combat.status === 'victory') return;

  const selfRepairHeal = state.player.statuses?.selfRepair ?? 0;

  combat.status = 'victory';
  combat.phase = 'ended';
  state.player.block = 0;
  state.player.stance = 'neutral';
  state.player.orbs = [];
  state.player.maxOrbSlots = 0;
  state.player.statuses = {};
  state.player.skipStatusTick = {};
  state.combatSnapshot = null;
  const slainCount = Math.max(combat.defeatedEnemiesCount ?? 0, combat.enemies.length);
  state.stats.enemiesSlain = (state.stats.enemiesSlain ?? 0) + slainCount;
  state.stats.combatsWon = (state.stats.combatsWon ?? 0) + 1;
  if (combat.role === 'elite') {
    state.stats.elitesSlain = (state.stats.elitesSlain ?? 0) + 1;
  } else if (combat.role === 'boss') {
    state.stats.bossesSlain = (state.stats.bossesSlain ?? 0) + 1;
  }
  if ((combat.hpLostThisCombat ?? 0) === 0) {
    state.stats.perfectCombats = (state.stats.perfectCombats ?? 0) + 1;
  }

  if (
    state.player.hp > 0 &&
    hasRelic(state, 'meat_on_the_bone') &&
    state.player.hp <= Math.floor(state.player.maxHp * 0.5)
  ) {
    const healed = healPlayerInCombat(state, 12);
    if (healed > 0) {
      pushCombatLog(combat, `遗物【带骨肉】回复了 ${healed} 点生命。`, 'victory');
    }
  }

  if (state.player.hp > 0 && selfRepairHeal > 0) {
    const healed = healPlayerInCombat(state, selfRepairHeal);
    if (healed > 0) {
      pushCombatLog(combat, `【自我修复】生效：战后回复了 ${healed} 点生命！`, 'victory');
    }
  }

  if (state.player.hp > 0) {
    if (hasRelic(state, 'black_blood')) {
      const healed = healPlayerInCombat(state, 12);
      if (healed > 0) {
        pushCombatLog(combat, `遗物【黑暗之血】回复了 ${healed} 点生命。`, 'victory');
      }
    } else if (hasRelic(state, 'burning_blood')) {
      const healed = healPlayerInCombat(state, 6);
      if (healed > 0) {
        pushCombatLog(combat, `遗物【燃烧之血】回复了 ${healed} 点生命。`, 'victory');
      }
    }
  }

  if (typeof onVictoryCallback === 'function') {
    onVictoryCallback(state);
  }
}
