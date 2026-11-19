import {
  canUpgradeCard,
  CARD_LIBRARY,
  createCardInstance,
  getCardStats,
  getEffectiveCardCost,
} from '../data/cards.js';
import {
  createEnemyInstance,
  getGuardianDefensiveIntent,
  rollEnemyIntent,
} from '../data/enemies.js';
import { POTION_LIBRARY, RELIC_LIBRARY, STATUS_METADATA } from '../data/relics.js';
import { calculateAttackDamage, calculateCardBlock } from './math.js';
import { pickRandom, randomInt, shuffled } from './rng.js';

export const MAX_HAND_SIZE = 10;
export const BASE_DRAW_PER_TURN = 5;
export const VELVET_CHOKER_CARD_LIMIT = 6;
const DECAYING_DEBUFFS = ['vulnerable', 'weak', 'frail'];
const SIGNED_STATUSES = new Set(['strength', 'dexterity']);

export function hasRelic(state, relicId) {
  return Array.isArray(state?.player?.relics) && state.player.relics.includes(relicId);
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
  if (!entity || !Number.isFinite(delta) || delta === 0) return;
  if (!entity.statuses) entity.statuses = {};
  if (!entity.skipStatusTick) entity.skipStatusTick = {};

  const prev = entity.statuses[statusKey] ?? 0;
  const next = prev + delta;

  if (SIGNED_STATUSES.has(statusKey)) {
    if (next === 0) {
      delete entity.statuses[statusKey];
    } else {
      entity.statuses[statusKey] = next;
    }
    return;
  }

  if (next <= 0) {
    delete entity.statuses[statusKey];
    delete entity.skipStatusTick[statusKey];
    return;
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
}

export function decayRoundStatuses(entity) {
  if (!entity?.statuses) return;
  if (!entity.skipStatusTick) entity.skipStatusTick = {};

  for (const key of DECAYING_DEBUFFS) {
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

export function drawCards(state, count) {
  const combat = state.combat;
  if (!combat || combat.status !== 'ongoing' || count <= 0) return 0;

  if ((state.player.statuses.noDraw ?? 0) > 0) {
    pushCombatLog(combat, '受【禁抽】影响，本回合无法再抽牌。', 'status');
    return 0;
  }

  let drawn = 0;
  for (let i = 0; i < count; i += 1) {
    if (combat.hand.length >= MAX_HAND_SIZE) {
      pushCombatLog(combat, `手牌已达上限（${MAX_HAND_SIZE} 张），停止抽牌。`, 'info');
      break;
    }

    if (combat.drawPile.length === 0) {
      if (combat.discardPile.length === 0) {
        break;
      }
      combat.drawPile = shuffled(state, combat.discardPile);
      combat.discardPile = [];
      pushCombatLog(combat, '弃牌堆已重新洗入抽牌堆。', 'info');
    }

    const nextCard = combat.drawPile.shift();
    if (!nextCard) break;
    if ((state.player.statuses.confused ?? 0) > 0) {
      const drawnStats = getCardStats(nextCard);
      if (
        !drawnStats.unplayable &&
        !drawnStats.isXCost &&
        typeof drawnStats.cost === 'number'
      ) {
        nextCard.combatCost = randomInt(state, 0, 3);
      }
    }
    combat.hand.push(nextCard);
    drawn += 1;
  }

  return drawn;
}

export function dealDamageToEnemy(state, enemy, rawAmount, options = { isAttack: true }) {
  const combat = state.combat;
  if (!combat || !enemy || enemy.hp <= 0 || rawAmount <= 0) return 0;

  const amount = Math.floor(rawAmount);
  const blocked = Math.min(enemy.block, amount);
  enemy.block -= blocked;
  const hpLoss = amount - blocked;

  if (hpLoss > 0) {
    enemy.hp = Math.max(0, enemy.hp - hpLoss);
    pushCombatLog(
      combat,
      `对【${enemy.name}】造成 ${hpLoss} 点伤害${blocked > 0 ? `（击穿 ${blocked} 点格挡）` : ''}。`,
      'attack'
    );
  } else if (blocked > 0) {
    pushCombatLog(combat, `【${enemy.name}】格挡了 ${blocked} 点伤害。`, 'block');
  }

  if (enemy.hp <= 0) {
    enemy.block = 0;
    enemy.intent = null;
    pushCombatLog(combat, `【${enemy.name}】被击败！`, 'victory');
    if ((enemy.statuses.sporeCloud ?? 0) > 0) {
      const spores = enemy.statuses.sporeCloud;
      applyStatus(state.player, 'vulnerable', spores, {
        appliedDuringEnemyTurn: combat.phase === 'enemy',
      });
      pushCombatLog(
        combat,
        `【${enemy.name}】的【孢子云】爆裂，使你获得 ${spores} 层【易伤】！`,
        'status'
      );
    }
    return hpLoss;
  }

  // Louse Curl Up trigger: first unblocked attack damage grants block once per combat
  if (options.isAttack && hpLoss > 0 && (enemy.statuses.curlUp ?? 0) > 0) {
    const curlBlock = enemy.statuses.curlUp;
    delete enemy.statuses.curlUp;
    enemy.block += curlBlock;
    pushCombatLog(combat, `【${enemy.name}】触发【蜷缩】，获得 ${curlBlock} 点格挡！`, 'block');
  }

  // Mad Gremlin Angry trigger: unblocked attack damage grants Strength
  if (options.isAttack && hpLoss > 0 && (enemy.statuses.angry ?? 0) > 0) {
    const gain = enemy.statuses.angry;
    applyStatus(enemy, 'strength', gain);
    pushCombatLog(combat, `【${enemy.name}】触发【愤怒】，获得 ${gain} 点力量！`, 'status');
  }

  // Boss Guardian Mode Shift
  if (
    enemy.templateId === 'the_guardian' &&
    enemy.mode === 'offensive' &&
    hpLoss > 0 &&
    (enemy.statuses.modeShift ?? 0) > 0
  ) {
    enemy.statuses.modeShift -= hpLoss;
    if (enemy.statuses.modeShift <= 0) {
      delete enemy.statuses.modeShift;
      enemy.mode = 'defensive';
      enemy.defensiveStep = 0;
      enemy.block += 16;
      applyStatus(enemy, 'sharpHide', 3);
      enemy.intent = getGuardianDefensiveIntent(0);
      pushCombatLog(
        combat,
        `【${enemy.name}】进入【防御形态】：获得 16 点格挡与 3 层【锋利外壳】！`,
        'status'
      );
    }
  }

  // Boss Slime Boss 50% HP Split trigger
  if (
    enemy.templateId === 'slime_boss' &&
    enemy.hp > 0 &&
    enemy.hp <= Math.floor(enemy.maxHp / 2) &&
    enemy.intent?.id !== 'split'
  ) {
    delete enemy.statuses.splitThreshold;
    enemy.intent = {
      id: 'split',
      name: '巨体分裂',
      type: 'buff',
      splitInto: ['acid_slime', 'spike_slime'],
      summary: '意图：分裂为巨型酸液史莱姆与巨型尖刺史莱姆（各自继承当前生命值）',
    };
    pushCombatLog(
      combat,
      `【${enemy.name}】生命跌破半数，打断原定行动并准备【巨体分裂】！`,
      'status'
    );
  }

  return hpLoss;
}

export function dealDamageToPlayer(state, rawAmount, sourceLabel = '敌人', options = { isAttack: true }) {
  const combat = state.combat;
  if (!combat || state.player.hp <= 0 || rawAmount <= 0) return 0;

  const amount = Math.floor(rawAmount);
  const blocked = Math.min(state.player.block, amount);
  state.player.block -= blocked;
  let hpLoss = amount - blocked;

  if (options.isAttack !== false && hpLoss > 1 && hpLoss <= 5 && hasRelic(state, 'torii')) {
    hpLoss = 1;
    pushCombatLog(combat, `遗物【${RELIC_LIBRARY.torii.name}】将未格挡攻击伤害降低至 1 点。`, 'block');
  }

  if (hpLoss > 0 && hasRelic(state, 'tungsten_rod')) {
    hpLoss = Math.max(0, hpLoss - 1);
    pushCombatLog(combat, `遗物【${RELIC_LIBRARY.tungsten_rod.name}】减免了 1 点生命损失。`, 'block');
  }

  if (hpLoss > 0) {
    state.player.hp = Math.max(0, state.player.hp - hpLoss);
    pushCombatLog(
      combat,
      `${sourceLabel}造成 ${hpLoss} 点伤害${blocked > 0 ? `（格挡 ${blocked} 点）` : ''}。`,
      'damage'
    );
  } else if (blocked > 0) {
    pushCombatLog(combat, `完全格挡了${sourceLabel}的 ${blocked} 点伤害。`, 'block');
  }

  if (state.player.hp <= 0) {
    handleCombatDefeat(state);
  }

  return hpLoss;
}

export function losePlayerHp(state, amount, reasonLabel = '效果') {
  const combat = state.combat;
  if (!combat || state.player.hp <= 0 || amount <= 0) return 0;

  let loss = Math.floor(amount);
  if (loss > 0 && hasRelic(state, 'tungsten_rod')) {
    loss = Math.max(0, loss - 1);
    if (loss === 0) {
      pushCombatLog(
        combat,
        `遗物【${RELIC_LIBRARY.tungsten_rod.name}】抵消了【${reasonLabel}】的 1 点生命损失。`,
        'block'
      );
      return 0;
    }
  }

  state.player.hp = Math.max(0, state.player.hp - loss);
  pushCombatLog(combat, `因【${reasonLabel}】失去 ${loss} 点生命。`, 'damage');

  if (state.player.hp <= 0) {
    handleCombatDefeat(state);
  }
  return loss;
}

export function exhaustCardsBatch(state, cardInstances) {
  const combat = state.combat;
  if (!combat || !Array.isArray(cardInstances) || cardInstances.length === 0) return 0;

  const valid = cardInstances.filter(Boolean);
  if (valid.length === 0) return 0;

  for (const c of valid) {
    combat.exhaustPile.push(c);
    pushCombatLog(combat, `【${getCardStats(c).name}】已消耗。`, 'info');
  }

  const count = valid.length;
  const fnp = state.player.statuses.feelNoPain ?? 0;
  if (fnp > 0) {
    const gain = fnp * count;
    state.player.block += gain;
    pushCombatLog(combat, `【无惧疼痛】生效：获得 ${gain} 点格挡。`, 'block');
  }

  if (hasRelic(state, 'charons_ashes')) {
    const ashDmg = 3 * count;
    const alive = getAliveEnemies(combat);
    if (alive.length > 0) {
      pushCombatLog(combat, `遗物【${RELIC_LIBRARY.charons_ashes.name}】触发：对全体敌人造成 ${ashDmg} 点伤害！`, 'attack');
      for (const enemy of alive) {
        dealDamageToEnemy(state, enemy, ashDmg, { isAttack: false });
      }
    }
  }

  const darkEmbrace = state.player.statuses.darkEmbrace ?? 0;
  if (darkEmbrace > 0 && combat.phase === 'player' && getAliveEnemies(combat).length > 0) {
    drawCards(state, darkEmbrace * count);
  }

  return count;
}

function captureCombatSnapshot(state) {
  return structuredClone({
    rngState: state.rngState,
    nextUid: state.nextUid,
    player: state.player,
    combat: state.combat,
    stats: state.stats,
  });
}

function handleCombatDefeat(state) {
  if (!state.combat || state.combat.status === 'defeat') return;
  state.combat.status = 'defeat';
  state.combat.phase = 'ended';
  state.player.block = 0;
  state.combatSnapshot = null;
  pushCombatLog(state.combat, '你在尖塔中倒下了……', 'defeat');
  state.screen = 'game_over';
  state.runOutcome = 'defeat';
}

export function startPlayerTurn(state, onVictoryCallback = null) {
  const combat = state.combat;
  if (!combat || combat.status !== 'ongoing') return;

  combat.turn += 1;
  combat.phase = 'player';
  combat.cardsPlayedThisTurn = 0;
  delete state.player.statuses.flameBarrier;

  if ((state.player.statuses.barricade ?? 0) > 0) {
    if (state.player.block > 0) {
      pushCombatLog(combat, `【壁垒】保留了 ${state.player.block} 点格挡。`, 'block');
    }
  } else {
    state.player.block = 0;
  }

  state.player.energy = state.player.maxEnergy;

  if (combat.turn === 1) {
    if (hasRelic(state, 'anchor')) {
      state.player.block += 10;
      pushCombatLog(combat, `遗物【${RELIC_LIBRARY.anchor.name}】生效：获得 10 点格挡。`, 'block');
    }
    if (hasRelic(state, 'lantern')) {
      state.player.energy += 1;
      pushCombatLog(combat, `遗物【${RELIC_LIBRARY.lantern.name}】生效：获得 1 点能量。`, 'info');
    }
  } else if (combat.turn === 2 && hasRelic(state, 'horn_cleat')) {
    state.player.block += 14;
    pushCombatLog(combat, `遗物【${RELIC_LIBRARY.horn_cleat.name}】生效：获得 14 点格挡。`, 'block');
  } else if (combat.turn === 3 && hasRelic(state, 'captains_wheel')) {
    state.player.block += 18;
    pushCombatLog(combat, `遗物【${RELIC_LIBRARY.captains_wheel.name}】生效：获得 18 点格挡。`, 'block');
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

  if ((state.player.statuses.demonForm ?? 0) > 0) {
    const gain = state.player.statuses.demonForm;
    applyStatus(state.player, 'strength', gain);
    pushCombatLog(combat, `【恶魔形态】生效：获得 ${gain} 点力量。`, 'status');
  }

  const bagDraw = combat.turn === 1 && hasRelic(state, 'bag_of_prep') ? 2 : 0;
  const sneckoDraw = hasRelic(state, 'snecko_eye') ? 2 : 0;
  drawCards(state, BASE_DRAW_PER_TURN + bagDraw + sneckoDraw);
}

export function startCombat(state, encounter, encounterRole = 'normal', onVictoryCallback = null) {
  state.combatSnapshot = null;
  state.player.block = 0;
  state.player.energy = state.player.maxEnergy;
  state.player.statuses = {};
  state.player.skipStatusTick = {};

  const deckCopies = state.player.deck.map((c) => ({
    instanceId: c.instanceId,
    cardId: c.cardId,
    upgraded: Boolean(c.upgraded),
  }));

  const shuffledDeck = shuffled(state, deckCopies);
  const innateCards = shuffledDeck.filter((c) => getCardStats(c).innate);
  const normalCards = shuffledDeck.filter((c) => !getCardStats(c).innate);

  const enemies = encounter.enemies.map((spec) => createEnemyInstance(state, spec));

  const combat = {
    encounterId: encounter.id,
    encounterName: encounter.name,
    role: encounterRole,
    turn: 0,
    phase: 'setup',
    status: 'ongoing',
    cardsPlayedThisTurn: 0,
    drawPile: [...innateCards, ...normalCards],
    hand: [],
    discardPile: [],
    exhaustPile: [],
    enemies,
    logs: [],
    logSeq: 0,
  };

  state.combat = combat;
  state.screen = 'combat';

  pushCombatLog(combat, `遭遇战斗：${encounter.name}！`, 'info');

  if (hasRelic(state, 'blood_vial') && state.player.hp > 0) {
    const before = state.player.hp;
    state.player.hp = Math.min(state.player.maxHp, state.player.hp + 2);
    if (state.player.hp > before) {
      pushCombatLog(combat, `遗物【${RELIC_LIBRARY.blood_vial.name}】回复了 ${state.player.hp - before} 点生命。`, 'info');
    }
  }
  if (hasRelic(state, 'vajra')) {
    applyStatus(state.player, 'strength', 1);
    pushCombatLog(combat, `遗物【${RELIC_LIBRARY.vajra.name}】生效：获得 1 点力量。`, 'status');
  }
  if (hasRelic(state, 'oddly_smooth_stone')) {
    applyStatus(state.player, 'dexterity', 1);
    pushCombatLog(
      combat,
      `遗物【${RELIC_LIBRARY.oddly_smooth_stone.name}】生效：获得 1 点敏捷。`,
      'status'
    );
  }
  if (hasRelic(state, 'snecko_eye')) {
    applyStatus(state.player, 'confused', 1);
    pushCombatLog(
      combat,
      `遗物【${RELIC_LIBRARY.snecko_eye.name}】生效：获得【混乱】，每回合额外抽 2 张牌，抽到的牌费用将随机重设！`,
      'status'
    );
  }
  if (hasRelic(state, 'bag_of_marbles')) {
    for (const enemy of getAliveEnemies(combat)) {
      applyStatus(enemy, 'vulnerable', 1);
    }
    pushCombatLog(
      combat,
      `遗物【${RELIC_LIBRARY.bag_of_marbles.name}】生效：所有敌人获得 1 层【易伤】。`,
      'status'
    );
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

  const snap = structuredClone(state.combatSnapshot);
  state.rngState = snap.rngState;
  state.nextUid = snap.nextUid;
  state.player = snap.player;
  state.combat = snap.combat;
  state.stats = snap.stats;
  state.screen = 'combat';
  state.runOutcome = null;

  return { ok: true };
}

function resolveEnemyTarget(combat, targetMode, targetEnemyId) {
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

export function canPlayCard(state, instanceId) {
  const combat = state?.combat;
  if (!combat || state.screen !== 'combat' || combat.status !== 'ongoing' || combat.phase !== 'player') {
    return { playable: false, reason: '当前不是玩家出牌阶段' };
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
      reason: `受【天鹅绒项圈】限制，每回合最多打出 ${VELVET_CHOKER_CARD_LIMIT} 张卡牌`,
    };
  }
  const stats = getCardStats(cardInstance);
  if (stats.unplayable) {
    return { playable: false, reason: '该卡牌不可打出' };
  }
  const effectiveCost = getEffectiveCardCost(stats, state.player);
  if (!stats.isXCost && (effectiveCost ?? 0) > state.player.energy) {
    return { playable: false, reason: '能量不足' };
  }
  return { playable: true, reason: '' };
}

export function playCard(state, instanceId, targetEnemyId = null, onVictoryCallback = null) {
  const check = canPlayCard(state, instanceId);
  if (!check.playable) {
    return { ok: false, reason: check.reason };
  }

  const combat = state.combat;
  const handIndex = combat.hand.findIndex((c) => c.instanceId === instanceId);
  const cardInstance = combat.hand[handIndex];
  const stats = getCardStats(cardInstance);

  const targetRes = resolveEnemyTarget(combat, stats.target, targetEnemyId);
  if (!targetRes.ok) {
    return { ok: false, reason: targetRes.reason };
  }
  const targetEnemy = targetRes.enemy;

  const effectiveCost = getEffectiveCardCost(stats, state.player);
  const energySpent = stats.isXCost ? state.player.energy : (effectiveCost ?? 0);
  const corruptionActive =
    stats.type === 'skill' && (state.player.statuses.corruption ?? 0) > 0;

  // 1. Remove from hand before resolving effects (prevents self-draw and frees hand slot)
  combat.hand.splice(handIndex, 1);
  state.player.energy -= energySpent;
  state.stats.cardsPlayed = (state.stats.cardsPlayed ?? 0) + 1;
  combat.cardsPlayedThisTurn = (combat.cardsPlayedThisTurn ?? 0) + 1;

  pushCombatLog(
    combat,
    `打出【${stats.name}】${stats.isXCost ? `（消耗 ${energySpent} 点能量）` : ''}。`,
    'card'
  );

  // 2. Self HP cost
  if (stats.loseHp) {
    losePlayerHp(state, stats.loseHp, stats.name);
    if (combat.status !== 'ongoing') {
      return { ok: true, outcome: combat.status };
    }
  }

  // 3. Energy gain
  if (stats.gainEnergy) {
    state.player.energy += stats.gainEnergy;
    pushCombatLog(combat, `获得 ${stats.gainEnergy} 点能量。`, 'info');
  }

  // 4. Block gain & Entrench double block (before Body Slam / Iron Wave attack resolution!)
  if (typeof stats.block === 'number') {
    const gainedBlock = calculateCardBlock(stats.block, state.player);
    state.player.block += gainedBlock;
    if (gainedBlock > 0) {
      pushCombatLog(combat, `获得 ${gainedBlock} 点格挡。`, 'block');
    }
  }
  if (stats.doubleBlock && state.player.block > 0) {
    const added = state.player.block;
    state.player.block += added;
    pushCombatLog(combat, `格挡值翻倍，额外获得 ${added} 点格挡！`, 'block');
  }

  // 4b. Armaments temporary in-combat hand upgrades
  if (stats.upgradeAllHand) {
    let upCount = 0;
    for (const hc of combat.hand) {
      if (canUpgradeCard(hc)) {
        hc.upgraded = true;
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
      chosen.upgraded = true;
      pushCombatLog(combat, `【${stats.name}】临时升级了【${getCardStats(chosen).name}】！`, 'info');
    }
  }

  // 4c. Hand-exhausting skills (True Grit / Second Wind)
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
        state.player.block += totalBlock;
        pushCombatLog(combat, `【${stats.name}】获得 ${totalBlock} 点格挡。`, 'block');
      }
      exhaustCardsBatch(state, nonAttacks);
    }
  }

  // 5. Attack hits (including Fiend Fire & Reaper lifesteal)
  if (stats.exhaustAllHandDamageEach) {
    const toExhaust = [...combat.hand];
    combat.hand = [];
    const hitCount = toExhaust.length;
    exhaustCardsBatch(state, toExhaust);

    if (targetEnemy && hitCount > 0) {
      for (let h = 0; h < hitCount; h += 1) {
        if (targetEnemy.hp <= 0) break;
        const dmg = calculateAttackDamage(stats.exhaustAllHandDamageEach, state.player, targetEnemy);
        dealDamageToEnemy(state, targetEnemy, dmg, { isAttack: true });
      }
    }
  } else {
    const hits = stats.isXCost ? energySpent : (stats.hits ?? 1);
    if ((typeof stats.damage === 'number' || stats.useBlockAsDamage) && hits > 0) {
      const baseDmg = stats.useBlockAsDamage ? state.player.block : stats.damage;
      const strMult = stats.strengthMultiplier ?? 1;
      let totalUnblocked = 0;

      if (stats.target === 'all_enemies') {
        for (let h = 0; h < hits; h += 1) {
          const targets = getAliveEnemies(combat);
          if (targets.length === 0) break;
          for (const enemy of targets) {
            const dmg = calculateAttackDamage(baseDmg, state.player, enemy, {
              strengthMultiplier: strMult,
            });
            totalUnblocked += dealDamageToEnemy(state, enemy, dmg, { isAttack: true });
          }
        }
      } else if (targetEnemy) {
        for (let h = 0; h < hits; h += 1) {
          if (targetEnemy.hp <= 0) break;
          const dmg = calculateAttackDamage(baseDmg, state.player, targetEnemy, {
            strengthMultiplier: strMult,
          });
          totalUnblocked += dealDamageToEnemy(state, targetEnemy, dmg, { isAttack: true });
        }
      }

      if (stats.lifestealUnblocked && totalUnblocked > 0 && state.player.hp > 0) {
        const before = state.player.hp;
        state.player.hp = Math.min(state.player.maxHp, state.player.hp + totalUnblocked);
        const healed = state.player.hp - before;
        if (healed > 0) {
          pushCombatLog(combat, `【${stats.name}】吸取生命，回复了 ${healed} 点生命！`, 'victory');
        }
      }
    }
  }

  if (stats.copySelfToDiscard) {
    const copy = createCardInstance(state, cardInstance.cardId, cardInstance.upgraded);
    combat.discardPile.push(copy);
    pushCombatLog(combat, `将 1 张【${stats.name}】复制品放入弃牌堆。`, 'info');
  }

  // 6. Enemy status application
  if (stats.applyEnemyStatuses) {
    const recipients =
      stats.target === 'all_enemies'
        ? getAliveEnemies(combat)
        : targetEnemy && targetEnemy.hp > 0
          ? [targetEnemy]
          : [];
    for (const enemy of recipients) {
      for (const [statusKey, val] of Object.entries(stats.applyEnemyStatuses)) {
        applyStatus(enemy, statusKey, val);
        const statusName = STATUS_METADATA[statusKey]?.name ?? statusKey;
        pushCombatLog(combat, `【${enemy.name}】获得 ${val} 层【${statusName}】。`, 'status');
      }
    }
  }

  // 7. Self status application
  if (stats.applySelfStatuses) {
    for (const [statusKey, val] of Object.entries(stats.applySelfStatuses)) {
      applyStatus(state.player, statusKey, val);
      const statusName = STATUS_METADATA[statusKey]?.name ?? statusKey;
      pushCombatLog(combat, `玩家获得 ${val} 层【${statusName}】。`, 'status');
    }
  }

  // 8. Draw cards
  if (stats.draw) {
    drawCards(state, stats.draw);
  }

  // 9. Post-draw self statuses (e.g. Battle Trance noDraw)
  if (stats.applySelfStatusesAfter) {
    for (const [statusKey, val] of Object.entries(stats.applySelfStatusesAfter)) {
      applyStatus(state.player, statusKey, val);
    }
  }

  // 10. Enemy reactive passives (Enrage on Skill, Sharp Hide on Attack)
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
        return { ok: true, outcome: combat.status };
      }
    }
  }

  // 11. Move card to final destination
  if (stats.type === 'power') {
    // Powers stay active on character and leave deck cycle for combat
  } else if (stats.exhaust || corruptionActive) {
    exhaustCardsBatch(state, [cardInstance]);
  } else {
    combat.discardPile.push(cardInstance);
  }

  // 12. Check victory
  if (getAliveEnemies(combat).length === 0 && state.player.hp > 0) {
    finalizeCombatVictory(state, onVictoryCallback);
  }

  return { ok: true, outcome: combat.status };
}

export function usePotion(state, slotIndex, targetEnemyId = null, onVictoryCallback = null) {
  const combat = state?.combat;
  if (!combat || state.screen !== 'combat' || combat.status !== 'ongoing' || combat.phase !== 'player') {
    return { ok: false, reason: '只能在战斗中的玩家回合使用药水' };
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

  const mult = hasRelic(state, 'sacred_bark') ? 2 : 1;

  state.player.potions[slotIndex] = null;
  pushCombatLog(
    combat,
    `饮用【${potion.name}】${mult > 1 ? '（神圣树皮效果翻倍）' : ''}！`,
    'info'
  );

  if (potion.damage && targetRes.enemy) {
    dealDamageToEnemy(state, targetRes.enemy, potion.damage * mult, { isAttack: false });
  }
  if (potion.aoeDamage) {
    for (const enemy of getAliveEnemies(combat)) {
      dealDamageToEnemy(state, enemy, potion.aoeDamage * mult, { isAttack: false });
    }
  }
  if (potion.block) {
    const val = potion.block * mult;
    state.player.block += val;
    pushCombatLog(combat, `获得 ${val} 点格挡。`, 'block');
  }
  if (potion.strength) {
    const val = potion.strength * mult;
    applyStatus(state.player, 'strength', val);
    pushCombatLog(combat, `获得 ${val} 点力量。`, 'status');
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
  if (potion.draw) {
    drawCards(state, potion.draw * mult);
  }
  if (potion.healPct && state.player.hp > 0) {
    const healAmt = Math.max(1, Math.floor((state.player.maxHp * (potion.healPct * mult)) / 100));
    const before = state.player.hp;
    state.player.hp = Math.min(state.player.maxHp, state.player.hp + healAmt);
    pushCombatLog(combat, `回复了 ${state.player.hp - before} 点生命。`, 'victory');
  }
  if (potion.applyEnemyStatuses && targetRes.enemy && targetRes.enemy.hp > 0) {
    for (const [sKey, sVal] of Object.entries(potion.applyEnemyStatuses)) {
      const val = sVal * mult;
      applyStatus(targetRes.enemy, sKey, val);
      const sName = STATUS_METADATA[sKey]?.name ?? sKey;
      pushCombatLog(combat, `【${targetRes.enemy.name}】获得 ${val} 层【${sName}】。`, 'status');
    }
  }

  if (getAliveEnemies(combat).length === 0 && state.player.hp > 0) {
    finalizeCombatVictory(state, onVictoryCallback);
  }

  return { ok: true, outcome: combat.status };
}

export function endPlayerTurn(state, onVictoryCallback = null) {
  const combat = state?.combat;
  if (!combat || state.screen !== 'combat' || combat.status !== 'ongoing' || combat.phase !== 'player') {
    return { ok: false, reason: '当前不能结束回合' };
  }

  combat.phase = 'enemy';
  delete state.player.statuses.noDraw;

  // 0. Temporary Strength decay (Flex)
  if ((state.player.statuses.tempStrengthDown ?? 0) > 0) {
    const drop = state.player.statuses.tempStrengthDown;
    delete state.player.statuses.tempStrengthDown;
    applyStatus(state.player, 'strength', -drop);
    pushCombatLog(combat, `临时强化消退，失去 ${drop} 点力量。`, 'status');
  }

  // 1. Resolve end-of-turn hand curses/statuses (Burn, Regret, Doubt), then Ethereal / Retain / Discard
  for (const cardInstance of combat.hand) {
    if (state.player.hp <= 0 || combat.status !== 'ongoing') break;
    const stats = getCardStats(cardInstance);
    if (stats.endOfTurnSelfDamage) {
      dealDamageToPlayer(state, stats.endOfTurnSelfDamage, `手牌【${stats.name}】`, {
        isAttack: false,
      });
    }
    if (state.player.hp <= 0 || combat.status !== 'ongoing') break;
    if (stats.endOfTurnLoseHp) {
      losePlayerHp(state, stats.endOfTurnLoseHp, stats.name);
    }
    if (state.player.hp <= 0 || combat.status !== 'ongoing') break;
    if (stats.endOfTurnWeak) {
      applyStatus(state.player, 'weak', stats.endOfTurnWeak, { appliedDuringEnemyTurn: true });
      pushCombatLog(combat, `手牌【${stats.name}】使你获得 ${stats.endOfTurnWeak} 层【虚弱】。`, 'status');
    }
  }

  if (state.player.hp <= 0 || combat.status !== 'ongoing') {
    return { ok: true, outcome: combat.status };
  }

  const keepHandByPyramid = hasRelic(state, 'runic_pyramid');
  const etherealToExhaust = [];
  const retainedHand = [];
  for (const cardInstance of combat.hand) {
    const stats = getCardStats(cardInstance);
    if (stats.ethereal) {
      etherealToExhaust.push(cardInstance);
    } else if (stats.retain || keepHandByPyramid) {
      retainedHand.push(cardInstance);
    } else {
      combat.discardPile.push(cardInstance);
    }
  }
  combat.hand = retainedHand;

  if (etherealToExhaust.length > 0) {
    exhaustCardsBatch(state, etherealToExhaust);
    if (getAliveEnemies(combat).length === 0 && state.player.hp > 0) {
      finalizeCombatVictory(state, onVictoryCallback);
      return { ok: true, outcome: combat.status };
    }
  }

  // 2. End of turn relics & powers
  if (hasRelic(state, 'orichalcum') && state.player.block === 0) {
    state.player.block += 6;
    pushCombatLog(combat, `遗物【${RELIC_LIBRARY.orichalcum.name}】生效：获得 6 点格挡。`, 'block');
  }
  if ((state.player.statuses.metallicize ?? 0) > 0) {
    const m = state.player.statuses.metallicize;
    state.player.block += m;
    pushCombatLog(combat, `【金属化】生效：获得 ${m} 点格挡。`, 'block');
  }

  // 3. Enemy phase: clear enemy previous block, then execute each alive enemy's intent
  for (const enemy of getAliveEnemies(combat)) {
    enemy.block = 0;
  }

  const actingEnemies = [...combat.enemies];
  for (const enemy of actingEnemies) {
    if (enemy.hp <= 0) continue;
    if (state.player.hp <= 0 || combat.status !== 'ongoing') break;

    const intent = enemy.intent;
    if (intent) {
      // Slime Boss Split execution
      if (Array.isArray(intent.splitInto) && intent.splitInto.length > 0) {
        const splitHp = Math.max(1, enemy.hp);
        const idx = combat.enemies.findIndex((e) => e.id === enemy.id);
        const childA = createEnemyInstance(state, {
          templateId: intent.splitInto[0],
          customName: '巨型酸液史莱姆',
          customHp: splitHp,
          customRole: 'normal',
        });
        const childB = createEnemyInstance(state, {
          templateId: intent.splitInto[1],
          customName: '巨型尖刺史莱姆',
          customHp: splitHp,
          customRole: 'normal',
        });
        if (hasRelic(state, 'philosophers_stone')) {
          applyStatus(childA, 'strength', 1);
          applyStatus(childB, 'strength', 1);
        }
        if (idx !== -1) {
          combat.enemies.splice(idx, 1, childA, childB);
        } else {
          enemy.hp = 0;
          combat.enemies.push(childA, childB);
        }
        pushCombatLog(
          combat,
          `【${enemy.name}】分裂为【${childA.name}】与【${childB.name}】（各 ${splitHp} 点生命）！`,
          'status'
        );
        continue;
      }

      if (typeof intent.damage === 'number') {
        const hits = intent.hits ?? 1;
        for (let h = 0; h < hits; h += 1) {
          if (state.player.hp <= 0 || enemy.hp <= 0 || combat.status !== 'ongoing') break;
          const dmg = calculateAttackDamage(intent.damage, enemy, state.player);
          dealDamageToPlayer(state, dmg, `【${enemy.name}】的${intent.name || '攻击'}`);
          if (
            state.player.hp > 0 &&
            enemy.hp > 0 &&
            (state.player.statuses.flameBarrier ?? 0) > 0
          ) {
            const fb = state.player.statuses.flameBarrier;
            pushCombatLog(combat, `【火焰屏障】反击【${enemy.name}】 ${fb} 点伤害！`, 'attack');
            dealDamageToEnemy(state, enemy, fb, { isAttack: false });
          }
        }
      }

      if (state.player.hp <= 0 || combat.status !== 'ongoing') break;
      if (enemy.hp <= 0) continue;

      if (intent.block) {
        enemy.block += intent.block;
        pushCombatLog(combat, `【${enemy.name}】获得 ${intent.block} 点格挡。`, 'block');
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

      if (intent.applyPlayerStatuses) {
        for (const [statusKey, val] of Object.entries(intent.applyPlayerStatuses)) {
          applyStatus(state.player, statusKey, val, { appliedDuringEnemyTurn: true });
          const statusName = STATUS_METADATA[statusKey]?.name ?? statusKey;
          pushCombatLog(
            combat,
            val < 0
              ? `【${enemy.name}】使你失去 ${Math.abs(val)} 点【${statusName}】！`
              : `【${enemy.name}】对你施加 ${val} 层【${statusName}】。`,
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

      enemy.lastMoveId = intent.id;
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

    enemy.turnIndex += 1;
    if (enemy.templateId === 'the_guardian') {
      if (enemy.mode === 'defensive') {
        enemy.defensiveStep += 1;
      } else {
        enemy.offensiveStep = (((enemy.offensiveStep + 1) % 4) + 4) % 4;
      }
    }
  }

  if (state.player.hp <= 0 || combat.status !== 'ongoing') {
    return { ok: true, outcome: combat.status };
  }

  if (getAliveEnemies(combat).length === 0) {
    finalizeCombatVictory(state, onVictoryCallback);
    return { ok: true, outcome: combat.status };
  }

  // 4. End of round decay on both Player and Enemies
  decayRoundStatuses(state.player);
  for (const enemy of getAliveEnemies(combat)) {
    decayRoundStatuses(enemy);
    enemy.intent = rollEnemyIntent(state, enemy);
  }

  // 5. Start next Player turn
  startPlayerTurn(state, onVictoryCallback);
  return { ok: true, outcome: combat.status };
}

function finalizeCombatVictory(state, onVictoryCallback = null) {
  const combat = state.combat;
  if (!combat || combat.status === 'victory') return;

  combat.status = 'victory';
  combat.phase = 'ended';
  state.player.block = 0;
  state.player.statuses = {};
  state.player.skipStatusTick = {};
  state.combatSnapshot = null;
  state.stats.enemiesSlain = (state.stats.enemiesSlain ?? 0) + combat.enemies.length;
  state.stats.combatsWon = (state.stats.combatsWon ?? 0) + 1;
  if (combat.role === 'elite') {
    state.stats.elitesSlain = (state.stats.elitesSlain ?? 0) + 1;
  }

  if (
    state.player.hp > 0 &&
    hasRelic(state, 'meat_on_the_bone') &&
    state.player.hp <= Math.floor(state.player.maxHp * 0.5)
  ) {
    const before = state.player.hp;
    state.player.hp = Math.min(state.player.maxHp, state.player.hp + 12);
    const healed = state.player.hp - before;
    if (healed > 0) {
      pushCombatLog(combat, `遗物【带骨肉】回复了 ${healed} 点生命。`, 'victory');
    }
  }

  if (state.player.hp > 0) {
    if (hasRelic(state, 'black_blood')) {
      const before = state.player.hp;
      state.player.hp = Math.min(state.player.maxHp, state.player.hp + 12);
      const healed = state.player.hp - before;
      if (healed > 0) {
        pushCombatLog(combat, `遗物【漆黑之血】回复了 ${healed} 点生命。`, 'victory');
      }
    } else if (hasRelic(state, 'burning_blood')) {
      const before = state.player.hp;
      state.player.hp = Math.min(state.player.maxHp, state.player.hp + 6);
      const healed = state.player.hp - before;
      if (healed > 0) {
        pushCombatLog(combat, `遗物【燃烧之血】回复了 ${healed} 点生命。`, 'victory');
      }
    }
  }

  if (typeof onVictoryCallback === 'function') {
    onVictoryCallback(state);
  }
}
