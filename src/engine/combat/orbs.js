/**
 * The Defect's Orb combat subsystem:
 * - FIFO orb slot queue (default 3 for Defect, expandable up to 10)
 * - Lightning, Frost, Dark, and Plasma passive & evoke resolution
 * - Focus (signed, clamped at 0 for Lightning/Frost/Dark; ignored by Plasma) & Lock-On (×1.5 orb dmg)
 * - Start-of-turn (Inserter, Emotion Chip, Plasma, Loop) & end-of-turn (Frozen Core, passive loop, Gold-Plated Cables) triggers
 */

import { ORB_METADATA, RELIC_LIBRARY } from '../../data/relics.js';
import { pickRandom } from '../rng.js';
import { getAliveEnemies, hasRelic, pushCombatLog } from './state.js';
import { addPlayerBlock, dealDamageToEnemy } from './resolution.js';

export const MAX_ORB_SLOTS = 10;
export const ORB_TYPES = Object.freeze(['lightning', 'frost', 'dark', 'plasma']);

export function ensureOrbState(player) {
  if (!player) return;
  if (!Array.isArray(player.orbs)) {
    player.orbs = [];
  }
  if (!Number.isInteger(player.maxOrbSlots) || player.maxOrbSlots < 0) {
    player.maxOrbSlots = 0;
  }
  if (player.maxOrbSlots > MAX_ORB_SLOTS) {
    player.maxOrbSlots = MAX_ORB_SLOTS;
  }
}

export function ensureOrbCombatStats(combat) {
  if (!combat) return;
  if (typeof combat.orbsChanneledThisCombat !== 'number') {
    combat.orbsChanneledThisCombat = 0;
  }
  if (!combat.orbsChanneledByType || typeof combat.orbsChanneledByType !== 'object') {
    combat.orbsChanneledByType = { lightning: 0, frost: 0, dark: 0, plasma: 0 };
  }
  if (!Array.isArray(combat.orbFxEvents)) {
    combat.orbFxEvents = [];
  }
}

export function pushOrbFx(combat, event) {
  if (!combat || !event) return;
  ensureOrbCombatStats(combat);
  combat.orbFxEvents.push(event);
}

export function getOrbOutputValues(orb, player) {
  const focus = player?.statuses?.focus ?? 0;
  if (!orb) return { passive: 0, evoke: 0, displayVal: 0 };
  switch (orb.type) {
    case 'lightning': {
      const passive = Math.max(0, 3 + focus);
      const evoke = Math.max(0, 8 + focus);
      return { passive, evoke, displayVal: passive };
    }
    case 'frost': {
      const passive = Math.max(0, 2 + focus);
      const evoke = Math.max(0, 5 + focus);
      return { passive, evoke, displayVal: passive };
    }
    case 'dark': {
      const passive = Math.max(0, 6 + focus);
      const evoke = Math.max(0, orb.darkStored ?? 6);
      return { passive, evoke, displayVal: evoke };
    }
    case 'plasma':
      return { passive: 1, evoke: 2, displayVal: 1 };
    default:
      return { passive: 0, evoke: 0, displayVal: 0 };
  }
}

export function countUniqueOrbs(player) {
  if (!player || !Array.isArray(player.orbs) || player.orbs.length === 0) return 0;
  return new Set(player.orbs.map((o) => o.type)).size;
}

export function applyLockOnMultiplier(rawDamage, enemy) {
  const base = Math.max(0, Math.floor(rawDamage || 0));
  if (base <= 0) return 0;
  if ((enemy?.statuses?.lockOn ?? 0) > 0) {
    return Math.floor(base * 1.5);
  }
  return base;
}

export function findLowestHpAliveEnemy(combat) {
  const alive = getAliveEnemies(combat);
  if (alive.length === 0) return null;
  let target = alive[0];
  for (let i = 1; i < alive.length; i += 1) {
    if (alive[i].hp < target.hp) {
      target = alive[i];
    }
  }
  return target;
}

export function gainOrbSlots(state, count, options = {}) {
  const combat = state?.combat;
  if (!state?.player || !Number.isFinite(count) || count <= 0) return 0;
  ensureOrbState(state.player);
  const before = state.player.maxOrbSlots;
  const next = Math.min(MAX_ORB_SLOTS, before + Math.floor(count));
  const added = next - before;
  state.player.maxOrbSlots = next;
  if (added > 0 && combat && !options.silent) {
    const prefix = options.sourceName ? `【${options.sourceName}】` : '';
    pushCombatLog(
      combat,
      `${prefix}获得 ${added} 个充能球槽位（当前上限 ${next}/${MAX_ORB_SLOTS}）。`,
      'status'
    );
  }
  return added;
}

export function removeOrbSlots(state, count, options = {}) {
  const combat = state?.combat;
  if (!state?.player || !Number.isFinite(count) || count <= 0) return 0;
  ensureOrbState(state.player);
  const before = state.player.maxOrbSlots;
  const next = Math.max(0, before - Math.floor(count));
  const removed = before - next;
  state.player.maxOrbSlots = next;
  while (state.player.orbs.length > next) {
    state.player.orbs.pop();
  }
  if (removed > 0 && combat && !options.silent) {
    const prefix = options.sourceName ? `【${options.sourceName}】` : '';
    pushCombatLog(
      combat,
      `${prefix}失去 ${removed} 个充能球槽位（当前上限 ${next}/${MAX_ORB_SLOTS}）。`,
      'status'
    );
  }
  return removed;
}

function dealOrbDamageToEnemy(state, enemy, rawBaseDmg) {
  if (!enemy || enemy.hp <= 0) return 0;
  const dmg = applyLockOnMultiplier(rawBaseDmg, enemy);
  if (dmg <= 0) return 0;
  dealDamageToEnemy(state, enemy, dmg, { isAttack: false, isOrb: true });
  return dmg;
}

export function triggerOrbPassive(state, orb, options = {}) {
  const combat = state?.combat;
  if (!combat || combat.status !== 'ongoing' || state.player.hp <= 0 || !orb) {
    return { triggered: false };
  }
  ensureOrbCombatStats(combat);
  const meta = ORB_METADATA[orb.type];
  const { passive } = getOrbOutputValues(orb, state.player);
  const sourcePrefix = options.sourceName ? `【${options.sourceName}】` : '';

  if (orb.type === 'lightning') {
    const alive = getAliveEnemies(combat);
    if (alive.length === 0) return { triggered: false };
    const isElectro = (state.player.statuses?.electro ?? 0) > 0;
    const targetIds = [];
    let totalDealt = 0;
    if (isElectro) {
      for (const enemy of [...alive]) {
        if (enemy.hp <= 0) continue;
        const dealt = dealOrbDamageToEnemy(state, enemy, passive);
        totalDealt += dealt;
        targetIds.push(enemy.id);
      }
      if (!options.silent) {
        pushCombatLog(
          combat,
          `${sourcePrefix}【闪电球】被动（电动力学）：对所有敌人造成 ${passive} 点闪电伤害！`,
          'damage'
        );
      }
    } else {
      const target = pickRandom(state, alive);
      if (target) {
        const dealt = dealOrbDamageToEnemy(state, target, passive);
        totalDealt = dealt;
        targetIds.push(target.id);
        if (!options.silent) {
          pushCombatLog(
            combat,
            `${sourcePrefix}【闪电球】被动：对【${target.name}】造成 ${dealt} 点闪电伤害。`,
            'damage'
          );
        }
      }
    }
    pushOrbFx(combat, { kind: 'passive', orbType: 'lightning', amount: totalDealt, targetIds });
    return { triggered: true, orbType: 'lightning', amount: totalDealt, targetIds };
  }

  if (orb.type === 'frost') {
    if (passive > 0) {
      addPlayerBlock(state, passive);
    }
    if (!options.silent) {
      pushCombatLog(
        combat,
        `${sourcePrefix}【冰霜球】被动：获得 ${passive} 点格挡。`,
        'block'
      );
    }
    pushOrbFx(combat, { kind: 'passive', orbType: 'frost', amount: passive, targetIds: [] });
    return { triggered: true, orbType: 'frost', amount: passive };
  }

  if (orb.type === 'dark') {
    orb.darkStored = Math.max(0, (orb.darkStored ?? 6) + passive);
    if (!options.silent) {
      pushCombatLog(
        combat,
        `${sourcePrefix}【黑暗球】被动蓄能 +${passive}（当前累计 ${orb.darkStored} 点伤害）。`,
        'status'
      );
    }
    pushOrbFx(combat, { kind: 'passive', orbType: 'dark', amount: orb.darkStored, targetIds: [] });
    return { triggered: true, orbType: 'dark', amount: orb.darkStored };
  }

  if (orb.type === 'plasma') {
    state.player.energy += passive;
    if (!options.silent) {
      pushCombatLog(
        combat,
        `${sourcePrefix}【${meta?.name || '等离子球'}】被动：获得 ${passive} 点能量！`,
        'info'
      );
    }
    pushOrbFx(combat, { kind: 'passive', orbType: 'plasma', amount: passive, targetIds: [] });
    return { triggered: true, orbType: 'plasma', amount: passive };
  }

  return { triggered: false };
}

export function evokeFrontOrb(state, times = 1, options = {}) {
  const combat = state?.combat;
  if (!combat || combat.status !== 'ongoing' || state.player.hp <= 0) {
    return { ok: false, evoked: false };
  }
  ensureOrbState(state.player);
  ensureOrbCombatStats(combat);

  const count = Math.max(0, Math.floor(times));
  if (count <= 0 || state.player.orbs.length === 0) {
    return { ok: false, evoked: false };
  }

  const orb = state.player.orbs.shift();
  const meta = ORB_METADATA[orb.type];
  const { evoke } = getOrbOutputValues(orb, state.player);
  const targetIds = [];
  let totalAmount = 0;

  for (let i = 0; i < count; i += 1) {
    if (state.player.hp <= 0 || combat.status !== 'ongoing') break;

    if (orb.type === 'lightning') {
      const alive = getAliveEnemies(combat);
      if (alive.length === 0) break;
      const isElectro = (state.player.statuses?.electro ?? 0) > 0;
      if (isElectro) {
        for (const enemy of [...alive]) {
          if (enemy.hp <= 0) continue;
          const dealt = dealOrbDamageToEnemy(state, enemy, evoke);
          totalAmount += dealt;
          if (!targetIds.includes(enemy.id)) targetIds.push(enemy.id);
        }
      } else {
        const target = pickRandom(state, alive);
        if (target) {
          const dealt = dealOrbDamageToEnemy(state, target, evoke);
          totalAmount += dealt;
          if (!targetIds.includes(target.id)) targetIds.push(target.id);
        }
      }
    } else if (orb.type === 'frost') {
      if (evoke > 0) {
        addPlayerBlock(state, evoke);
        totalAmount += evoke;
      }
    } else if (orb.type === 'dark') {
      const target = findLowestHpAliveEnemy(combat);
      if (!target) break;
      const dealt = dealOrbDamageToEnemy(state, target, evoke);
      totalAmount += dealt;
      if (!targetIds.includes(target.id)) targetIds.push(target.id);
    } else if (orb.type === 'plasma') {
      state.player.energy += evoke;
      totalAmount += evoke;
    }
  }

  if (!options.silent) {
    const timesNote = count > 1 ? ` ×${count}` : '';
    const prefix = options.autoOverflow ? '槽位已满，自动激发队首' : '激发队首';
    if (orb.type === 'lightning') {
      pushCombatLog(
        combat,
        `${prefix}【闪电球】${timesNote}：共造成 ${totalAmount} 点闪电伤害！`,
        'damage'
      );
    } else if (orb.type === 'frost') {
      pushCombatLog(
        combat,
        `${prefix}【冰霜球】${timesNote}：共获得 ${totalAmount} 点格挡！`,
        'block'
      );
    } else if (orb.type === 'dark') {
      pushCombatLog(
        combat,
        `${prefix}【黑暗球】${timesNote}：向生命最低的敌人倾泻 ${totalAmount} 点暗影伤害！`,
        'damage'
      );
    } else if (orb.type === 'plasma') {
      pushCombatLog(
        combat,
        `${prefix}【${meta?.name || '等离子球'}】${timesNote}：获得 ${totalAmount} 点能量！`,
        'info'
      );
    }
  }

  pushOrbFx(combat, {
    kind: 'evoke',
    orbType: orb.type,
    times: count,
    amount: totalAmount,
    targetIds,
  });

  if (options.rechannel && state.player.maxOrbSlots > 0 && state.player.hp > 0 && combat.status === 'ongoing') {
    state.player.orbs.push(orb);
    combat.orbsChanneledThisCombat += 1;
    combat.orbsChanneledByType[orb.type] = (combat.orbsChanneledByType[orb.type] ?? 0) + 1;
    pushOrbFx(combat, { kind: 'channel', orbType: orb.type });
    if (!options.silent) {
      const darkNote = orb.type === 'dark' ? `（保留 ${orb.darkStored} 点蓄能）` : '';
      pushCombatLog(
        combat,
        `【递归】将【${meta?.name || orb.type}】重新充能至队尾${darkNote}！`,
        'status'
      );
    }
  }

  return { ok: true, evoked: true, orbType: orb.type, totalAmount, targetIds };
}

export function channelOrb(state, orbType, options = {}) {
  const combat = state?.combat;
  if (!combat || combat.status !== 'ongoing' || state.player.hp <= 0) {
    return { ok: false, reason: 'not_in_combat' };
  }
  if (!ORB_METADATA[orbType]) {
    return { ok: false, reason: 'invalid_orb_type' };
  }
  ensureOrbState(state.player);
  ensureOrbCombatStats(combat);

  if (state.player.maxOrbSlots <= 0) {
    if (!options.silent) {
      pushCombatLog(combat, '当前没有充能球槽位，无法充能！', 'info');
    }
    return { ok: false, reason: 'no_slots' };
  }

  let overflowEvoked = false;
  if (state.player.orbs.length >= state.player.maxOrbSlots) {
    evokeFrontOrb(state, 1, { autoOverflow: true, silent: options.silent });
    overflowEvoked = true;
    if (combat.status !== 'ongoing' || state.player.hp <= 0) {
      return { ok: true, overflowEvoked };
    }
  }

  state.nextUid = (state.nextUid ?? 1) + 1;
  const newOrb = {
    id: `orb_${state.nextUid}`,
    type: orbType,
    ...(orbType === 'dark' ? { darkStored: 6 } : {}),
  };
  state.player.orbs.push(newOrb);
  combat.orbsChanneledThisCombat += 1;
  combat.orbsChanneledByType[orbType] = (combat.orbsChanneledByType[orbType] ?? 0) + 1;
  pushOrbFx(combat, { kind: 'channel', orbType });

  if (!options.silent) {
    const prefix = options.sourceName ? `【${options.sourceName}】` : '';
    pushCombatLog(
      combat,
      `${prefix}充能 1 个【${ORB_METADATA[orbType].name}】（${state.player.orbs.length}/${state.player.maxOrbSlots}）。`,
      'status'
    );
  }

  return { ok: true, orb: newOrb, overflowEvoked };
}

export function triggerAllDarkPassives(state, options = {}) {
  const combat = state?.combat;
  if (!combat || combat.status !== 'ongoing' || state.player.hp <= 0) return 0;
  ensureOrbState(state.player);
  let count = 0;
  for (const orb of state.player.orbs) {
    if (orb.type === 'dark') {
      triggerOrbPassive(state, orb, options);
      count += 1;
    }
  }
  return count;
}

export function removeAllOrbs(state) {
  ensureOrbState(state?.player);
  const count = state?.player?.orbs?.length ?? 0;
  if (state?.player) {
    state.player.orbs = [];
  }
  return count;
}

export function evokeAllOrbs(state, options = {}) {
  ensureOrbState(state?.player);
  let count = 0;
  while (
    state?.player?.orbs?.length > 0 &&
    state.combat?.status === 'ongoing' &&
    state.player.hp > 0
  ) {
    const res = evokeFrontOrb(state, 1, options);
    if (!res.evoked) break;
    count += 1;
  }
  return count;
}

export function triggerStartOfTurnOrbs(state) {
  const combat = state?.combat;
  if (!combat || combat.status !== 'ongoing' || state.player.hp <= 0) return;
  ensureOrbState(state.player);
  ensureOrbCombatStats(combat);

  // 1. Inserter: every 2 turns (turn 2, 4, 6...) gain 1 Orb slot
  if (hasRelic(state, 'inserter') && combat.turn > 0 && combat.turn % 2 === 0) {
    gainOrbSlots(state, 1, { sourceName: RELIC_LIBRARY.inserter.name });
  }

  // 2. Emotion Chip: if player lost HP last turn, trigger passive of ALL orbs at start of turn
  if (hasRelic(state, 'emotion_chip') && combat.lostHpLastTurn && state.player.orbs.length > 0) {
    pushCombatLog(
      combat,
      `遗物【${RELIC_LIBRARY.emotion_chip.name}】触发：上回合受损，立即触发全部 ${state.player.orbs.length} 个充能球的被动效果！`,
      'status'
    );
    for (const orb of [...state.player.orbs]) {
      if (state.player.hp <= 0 || combat.status !== 'ongoing') break;
      triggerOrbPassive(state, orb, { sourceName: '情感芯片' });
    }
  }

  // 3. Plasma start-of-turn passive (+1 Energy per Plasma; +1 extra if frontmost with Gold-Plated Cables)
  const hasCables = hasRelic(state, 'gold_plated_cables');
  for (let i = 0; i < state.player.orbs.length; i += 1) {
    const orb = state.player.orbs[i];
    if (orb.type === 'plasma') {
      triggerOrbPassive(state, orb);
      if (i === 0 && hasCables) {
        triggerOrbPassive(state, orb, { sourceName: RELIC_LIBRARY.gold_plated_cables.name });
      }
    }
  }

  // 4. Loop power: trigger frontmost orb passive N extra times at start of turn
  const loopStacks = state.player.statuses?.loop ?? 0;
  if (loopStacks > 0 && state.player.orbs.length > 0 && getAliveEnemies(combat).length > 0) {
    const front = state.player.orbs[0];
    for (let k = 0; k < loopStacks; k += 1) {
      if (state.player.hp <= 0 || combat.status !== 'ongoing') break;
      triggerOrbPassive(state, front, { sourceName: '循环' });
    }
  }
}

export function triggerEndOfTurnOrbs(state) {
  const combat = state?.combat;
  if (!combat || combat.status !== 'ongoing' || state.player.hp <= 0) return;
  ensureOrbState(state.player);
  ensureOrbCombatStats(combat);

  // 1. Frozen Core: if there is an empty orb slot at end of turn, channel 1 Frost orb
  if (
    hasRelic(state, 'frozen_core') &&
    state.player.maxOrbSlots > 0 &&
    state.player.orbs.length < state.player.maxOrbSlots
  ) {
    channelOrb(state, 'frost', { sourceName: RELIC_LIBRARY.frozen_core.name });
  }

  // 2. End-of-turn orb passives (Lightning / Frost / Dark; Plasma is start-of-turn only)
  const hasCables = hasRelic(state, 'gold_plated_cables');
  for (let i = 0; i < state.player.orbs.length; i += 1) {
    if (state.player.hp <= 0 || combat.status !== 'ongoing') break;
    const orb = state.player.orbs[i];
    if (orb.type === 'plasma') continue;
    triggerOrbPassive(state, orb);
    if (i === 0 && hasCables && state.player.hp > 0 && combat.status === 'ongoing') {
      triggerOrbPassive(state, orb, { sourceName: RELIC_LIBRARY.gold_plated_cables.name });
    }
  }
}
