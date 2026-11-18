import { CARD_LIBRARY, createCardInstance, getCardStats } from '../data/cards.js';
import {
  createEnemyInstance,
  getGuardianDefensiveIntent,
  rollEnemyIntent,
} from '../data/enemies.js';
import { POTION_LIBRARY, RELIC_LIBRARY, STATUS_METADATA } from '../data/relics.js';
import { calculateAttackDamage, calculateCardBlock } from './math.js';
import { shuffled } from './rng.js';

export const MAX_HAND_SIZE = 10;
export const BASE_DRAW_PER_TURN = 5;
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
  if (combat.logs.length > 60) {
    combat.logs.splice(0, combat.logs.length - 60);
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
    return hpLoss;
  }

  // Louse Curl Up trigger: first unblocked attack damage grants block once per combat
  if (options.isAttack && hpLoss > 0 && (enemy.statuses.curlUp ?? 0) > 0) {
    const curlBlock = enemy.statuses.curlUp;
    delete enemy.statuses.curlUp;
    enemy.block += curlBlock;
    pushCombatLog(combat, `【${enemy.name}】触发【蜷缩】，获得 ${curlBlock} 点格挡！`, 'block');
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

  return hpLoss;
}

export function dealDamageToPlayer(state, rawAmount, sourceLabel = '敌人') {
  const combat = state.combat;
  if (!combat || state.player.hp <= 0 || rawAmount <= 0) return 0;

  const amount = Math.floor(rawAmount);
  const blocked = Math.min(state.player.block, amount);
  state.player.block -= blocked;
  const hpLoss = amount - blocked;

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

  const loss = Math.floor(amount);
  state.player.hp = Math.max(0, state.player.hp - loss);
  pushCombatLog(combat, `因【${reasonLabel}】失去 ${loss} 点生命。`, 'damage');

  if (state.player.hp <= 0) {
    handleCombatDefeat(state);
  }
  return loss;
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

export function startPlayerTurn(state) {
  const combat = state.combat;
  if (!combat || combat.status !== 'ongoing') return;

  combat.turn += 1;
  combat.phase = 'player';
  state.player.block = 0;
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
  }

  if ((state.player.statuses.demonForm ?? 0) > 0) {
    const gain = state.player.statuses.demonForm;
    applyStatus(state.player, 'strength', gain);
    pushCombatLog(combat, `【恶魔形态】生效：获得 ${gain} 点力量。`, 'status');
  }

  const extraDraw = combat.turn === 1 && hasRelic(state, 'bag_of_prep') ? 2 : 0;
  drawCards(state, BASE_DRAW_PER_TURN + extraDraw);
}

export function startCombat(state, encounter, encounterRole = 'normal') {
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

  const enemies = encounter.enemies.map((spec) => createEnemyInstance(state, spec));

  const combat = {
    encounterId: encounter.id,
    encounterName: encounter.name,
    role: encounterRole,
    turn: 0,
    phase: 'setup',
    status: 'ongoing',
    drawPile: shuffled(state, deckCopies),
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

  startPlayerTurn(state);
  state.combatSnapshot = captureCombatSnapshot(state);
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
  if (targetMode !== 'enemy') {
    return { ok: true, enemy: null };
  }
  const alive = getAliveEnemies(combat);
  if (alive.length === 0) {
    return { ok: false, reason: '场上没有存活的敌人' };
  }
  if (!targetEnemyId) {
    if (alive.length === 1) {
      return { ok: true, enemy: alive[0] };
    }
    return { ok: false, reason: '请先选择一名目标敌人' };
  }
  const found = alive.find((e) => e.id === targetEnemyId);
  if (!found) {
    return { ok: false, reason: '目标无效或已被击败' };
  }
  return { ok: true, enemy: found };
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
  const stats = getCardStats(cardInstance);
  if (stats.unplayable) {
    return { playable: false, reason: '该卡牌不可打出' };
  }
  if (!stats.isXCost && (stats.cost ?? 0) > state.player.energy) {
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

  const energySpent = stats.isXCost ? state.player.energy : (stats.cost ?? 0);

  // 1. Remove from hand before resolving effects (prevents self-draw and frees hand slot)
  combat.hand.splice(handIndex, 1);
  state.player.energy -= energySpent;
  state.stats.cardsPlayed = (state.stats.cardsPlayed ?? 0) + 1;

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

  // 4. Block gain (before Body Slam / Iron Wave attack resolution!)
  if (typeof stats.block === 'number') {
    const gainedBlock = calculateCardBlock(stats.block, state.player);
    state.player.block += gainedBlock;
    if (gainedBlock > 0) {
      pushCombatLog(combat, `获得 ${gainedBlock} 点格挡。`, 'block');
    }
  }

  // 5. Attack hits
  const hits = stats.isXCost ? energySpent : (stats.hits ?? 1);
  if ((typeof stats.damage === 'number' || stats.useBlockAsDamage) && hits > 0) {
    const baseDmg = stats.useBlockAsDamage ? state.player.block : stats.damage;
    const strMult = stats.strengthMultiplier ?? 1;

    if (stats.target === 'all_enemies') {
      for (let h = 0; h < hits; h += 1) {
        const targets = getAliveEnemies(combat);
        if (targets.length === 0) break;
        for (const enemy of targets) {
          const dmg = calculateAttackDamage(baseDmg, state.player, enemy, {
            strengthMultiplier: strMult,
          });
          dealDamageToEnemy(state, enemy, dmg, { isAttack: true });
        }
      }
    } else if (targetEnemy) {
      for (let h = 0; h < hits; h += 1) {
        if (targetEnemy.hp <= 0) break;
        const dmg = calculateAttackDamage(baseDmg, state.player, targetEnemy, {
          strengthMultiplier: strMult,
        });
        dealDamageToEnemy(state, targetEnemy, dmg, { isAttack: true });
      }
    }
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
  } else if (stats.exhaust) {
    combat.exhaustPile.push(cardInstance);
    pushCombatLog(combat, `【${stats.name}】已消耗。`, 'info');
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

  state.player.potions[slotIndex] = null;
  pushCombatLog(combat, `饮用【${potion.name}】！`, 'info');

  if (potion.damage && targetRes.enemy) {
    dealDamageToEnemy(state, targetRes.enemy, potion.damage, { isAttack: false });
  }
  if (potion.block) {
    state.player.block += potion.block;
    pushCombatLog(combat, `获得 ${potion.block} 点格挡。`, 'block');
  }
  if (potion.strength) {
    applyStatus(state.player, 'strength', potion.strength);
    pushCombatLog(combat, `获得 ${potion.strength} 点力量。`, 'status');
  }
  if (potion.energy) {
    state.player.energy += potion.energy;
    pushCombatLog(combat, `获得 ${potion.energy} 点能量。`, 'info');
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

  // 1. Discard or exhaust remaining hand
  for (const cardInstance of combat.hand) {
    const stats = getCardStats(cardInstance);
    if (stats.ethereal) {
      combat.exhaustPile.push(cardInstance);
      pushCombatLog(combat, `【${stats.name}】因虚无被消耗。`, 'info');
    } else {
      combat.discardPile.push(cardInstance);
    }
  }
  combat.hand = [];

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

  for (const enemy of combat.enemies) {
    if (enemy.hp <= 0) continue;
    if (state.player.hp <= 0 || combat.status !== 'ongoing') break;

    const intent = enemy.intent;
    if (intent) {
      if (typeof intent.damage === 'number') {
        const hits = intent.hits ?? 1;
        for (let h = 0; h < hits; h += 1) {
          if (state.player.hp <= 0 || enemy.hp <= 0 || combat.status !== 'ongoing') break;
          const dmg = calculateAttackDamage(intent.damage, enemy, state.player);
          dealDamageToPlayer(state, dmg, `【${enemy.name}】的${intent.name || '攻击'}`);
        }
      }

      if (state.player.hp <= 0 || combat.status !== 'ongoing') break;

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
            `【${enemy.name}】对你施加 ${val} 层【${statusName}】。`,
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

    // Ritual triggers at end of enemy turn (except turn cast)
    if ((enemy.statuses.ritual ?? 0) > 0) {
      if (enemy.skipRitualThisTurn) {
        enemy.skipRitualThisTurn = false;
      } else {
        const gain = enemy.statuses.ritual;
        applyStatus(enemy, 'strength', gain);
        pushCombatLog(combat, `【${enemy.name}】的【仪式】触发，获得 ${gain} 点力量！`, 'status');
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
  startPlayerTurn(state);
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

  if (state.player.hp > 0 && hasRelic(state, 'burning_blood')) {
    const before = state.player.hp;
    state.player.hp = Math.min(state.player.maxHp, state.player.hp + 6);
    const healed = state.player.hp - before;
    if (healed > 0) {
      pushCombatLog(combat, `遗物【燃烧之血】回复了 ${healed} 点生命。`, 'victory');
    }
  }

  pushCombatLog(combat, '战斗胜利！', 'victory');

  if (typeof onVictoryCallback === 'function') {
    onVictoryCallback(state);
  }
}
