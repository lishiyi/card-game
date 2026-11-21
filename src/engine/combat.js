import {
  canUpgradeCard,
  CARD_LIBRARY,
  countCombatStrikeCards,
  createCardInstance,
  getCardAttackFlatBonus,
  getCardCharacter,
  getCardStats,
  getEffectiveCardCost,
  isStrikeCard,
} from '../data/cards.js';
import {
  createEnemyInstance,
  getGuardianDefensiveIntent,
  rollEnemyIntent,
} from '../data/enemies.js';
import {
  getAvailablePotionIds,
  POTION_LIBRARY,
  RELIC_LIBRARY,
  STANCE_METADATA,
  STATUS_METADATA,
} from '../data/relics.js';
import { hasDailyModifier } from './daily.js';
import { calculateAttackDamage, calculateCardBlock } from './math.js';
import { pickRandom, randomInt, shuffled } from './rng.js';

export const MAX_HAND_SIZE = 10;
export const BASE_DRAW_PER_TURN = 5;
export const VELVET_CHOKER_CARD_LIMIT = 6;
export const RUSHDOWN_MAX_TRIGGERS_PER_TURN = 2;
const VALID_STANCES = new Set(['neutral', 'calm', 'wrath', 'divinity']);
const DECAYING_DEBUFFS = ['vulnerable', 'weak', 'frail'];
const ROUND_DECAY_STATUSES = ['vulnerable', 'weak', 'frail', 'intangible'];
const SIGNED_STATUSES = new Set(['strength', 'dexterity']);

export function hasRelic(state, relicId) {
  return Array.isArray(state?.player?.relics) && state.player.relics.includes(relicId);
}

function addPlayerBlock(state, amount) {
  const gain = Math.floor(amount);
  if (!state?.player || !Number.isFinite(gain) || gain <= 0) return 0;
  state.player.block += gain;
  if (state.stats) {
    state.stats.totalBlockGained = (state.stats.totalBlockGained ?? 0) + gain;
  }
  const juggDmg = state.player.statuses?.juggernaut ?? 0;
  const combat = state.combat;
  if (juggDmg > 0 && combat && combat.status === 'ongoing' && !state._resolvingJuggernaut) {
    const alive = getAliveEnemies(combat);
    if (alive.length > 0) {
      const recipient = pickRandom(state, alive);
      if (recipient) {
        state._resolvingJuggernaut = true;
        try {
          pushCombatLog(
            combat,
            `【势不可挡】触发：获得格挡并对【${recipient.name}】造成 ${juggDmg} 点伤害！`,
            'attack'
          );
          dealDamageToEnemy(state, recipient, juggDmg, { isAttack: false });
        } finally {
          delete state._resolvingJuggernaut;
        }
      }
    }
  }
  return gain;
}

function triggerSadisticNature(state, enemy) {
  const combat = state?.combat;
  const dmg = state?.player?.statuses?.sadisticNature ?? 0;
  if (!combat || !enemy || enemy.hp <= 0 || dmg <= 0) return;
  pushCombatLog(combat, `【残虐本性】触发：对【${enemy.name}】造成 ${dmg} 点伤害！`, 'attack');
  dealDamageToEnemy(state, enemy, dmg, { isAttack: false });
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

export function applyPoisonToEnemy(state, enemy, amount, options = {}) {
  const combat = state?.combat;
  if (!combat || !enemy || enemy.hp <= 0 || !Number.isFinite(amount) || amount <= 0) return 0;
  const skullBonus = !options.skipSneckoSkull && hasRelic(state, 'snecko_skull') ? 1 : 0;
  const total = Math.floor(amount) + skullBonus;
  applyStatus(enemy, 'poison', total);
  pushCombatLog(
    combat,
    `【${enemy.name}】获得 ${total} 层【中毒】${skullBonus > 0 ? '（异蛇头骨 +1）' : ''}。`,
    'status'
  );
  triggerSadisticNature(state, enemy);
  return total;
}

export function addCardsToHand(state, cardId, count, upgraded = false) {
  const combat = state?.combat;
  if (!combat || count <= 0) return [];
  const created = [];
  let overflow = 0;
  for (let i = 0; i < count; i += 1) {
    const card = createCardInstance(state, cardId, upgraded);
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

function syncRedSkullStatus(state) {
  const combat = state?.combat;
  if (!combat || combat.status !== 'ongoing' || !hasRelic(state, 'red_skull')) return;
  const shouldBeActive =
    state.player.hp > 0 && state.player.hp <= Math.floor(state.player.maxHp * 0.5);
  const wasActive = Boolean(combat.redSkullActive);
  if (shouldBeActive && !wasActive) {
    combat.redSkullActive = true;
    applyStatus(state.player, 'strength', 3);
    pushCombatLog(
      combat,
      `遗物【${RELIC_LIBRARY.red_skull.name}】觉醒：生命值 ≤ 50%，获得 3 点【力量】！`,
      'status'
    );
  } else if (!shouldBeActive && wasActive) {
    combat.redSkullActive = false;
    applyStatus(state.player, 'strength', -3);
    pushCombatLog(
      combat,
      `遗物【${RELIC_LIBRARY.red_skull.name}】平息：生命高于 50%，失去 3 点临时【力量】。`,
      'status'
    );
  }
}

function handleEnemyZeroHp(state, enemy) {
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
  return false;
}

function handleEnemyDeathPassives(state, deadEnemy) {
  const combat = state?.combat;
  if (!combat || !deadEnemy || deadEnemy._deathHandled) return;
  deadEnemy._deathHandled = true;

  if ((deadEnemy.statuses?.sporeCloud ?? 0) > 0) {
    const spores = deadEnemy.statuses.sporeCloud;
    applyStatus(state.player, 'vulnerable', spores, {
      appliedDuringEnemyTurn: combat.phase === 'enemy',
    });
    pushCombatLog(
      combat,
      `【${deadEnemy.name}】的【孢子云】爆裂，使你获得 ${spores} 层【易伤】！`,
      'status'
    );
  }

  // The Specimen: transfer remaining poison to a random alive enemy
  const remPoison = deadEnemy.statuses?.poison ?? 0;
  if (remPoison > 0 && hasRelic(state, 'the_specimen')) {
    const alive = getAliveEnemies(combat);
    const recipient = pickRandom(state, alive);
    if (recipient) {
      applyStatus(recipient, 'poison', remPoison);
      pushCombatLog(
        combat,
        `遗物【${RELIC_LIBRARY.the_specimen.name}】生效：将 ${remPoison} 层【中毒】转移给【${recipient.name}】！`,
        'status'
      );
    }
  }

  // Corpse Explosion: deal deadEnemy.maxHp non-attack damage to all alive enemies (chains!)
  const ceStacks = deadEnemy.statuses?.corpseExplosion ?? 0;
  if (ceStacks > 0) {
    const alive = getAliveEnemies(combat);
    if (alive.length > 0) {
      const blastDmg = Math.max(1, deadEnemy.maxHp ?? 0) * ceStacks;
      pushCombatLog(
        combat,
        `【${deadEnemy.name}】触发【尸爆】：对所有存活敌人造成 ${blastDmg} 点爆炸伤害！`,
        'attack'
      );
      for (const other of alive) {
        dealDamageToEnemy(state, other, blastDmg, { isAttack: false });
      }
    }
  }
}

export function drawCards(state, count, options = {}) {
  const combat = state.combat;
  if (!combat || combat.status !== 'ongoing' || count <= 0) return 0;

  if ((state.player.statuses.noDraw ?? 0) > 0) {
    pushCombatLog(combat, '受【禁抽】影响，本回合无法再抽牌。', 'status');
    return 0;
  }

  let drawn = 0;
  let remaining = count;
  while (remaining > 0) {
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
    const drawnStats = getCardStats(nextCard);
    if ((state.player.statuses.confused ?? 0) > 0) {
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
    remaining -= 1;
    if (Array.isArray(options.outDrawnCards)) {
      options.outDrawnCards.push(nextCard);
    }

    if (drawnStats.type === 'status' || drawnStats.type === 'curse') {
      const fbDmg = state.player.statuses.fireBreathing ?? 0;
      if (fbDmg > 0) {
        const alive = getAliveEnemies(combat);
        if (alive.length > 0) {
          pushCombatLog(
            combat,
            `【火焰吐息】触发：抽到【${drawnStats.name}】，对所有敌人造成 ${fbDmg} 点伤害！`,
            'attack'
          );
          for (const enemy of alive) {
            dealDamageToEnemy(state, enemy, fbDmg, { isAttack: false });
          }
          if (getAliveEnemies(combat).length === 0) {
            break;
          }
        }
      }
    }

    if (drawnStats.type === 'status') {
      const evolveDraw = state.player.statuses.evolve ?? 0;
      if (evolveDraw > 0) {
        remaining += evolveDraw;
        pushCombatLog(
          combat,
          `【进化】触发：抽到状态牌【${drawnStats.name}】，额外抽 ${evolveDraw} 张牌。`,
          'info'
        );
      }
    }
  }

  return drawn;
}

export function dealDamageToEnemy(state, enemy, rawAmount, options = { isAttack: true }) {
  const combat = state.combat;
  if (!combat || !enemy || enemy.hp <= 0 || rawAmount <= 0) return 0;

  let amount = Math.floor(rawAmount);
  if (amount > 1 && (enemy.statuses?.intangible ?? 0) > 0) {
    amount = 1;
  }
  const blocked = Math.min(enemy.block, amount);
  enemy.block -= blocked;
  const hpLoss = amount - blocked;

  if (hpLoss > 0) {
    const actualLoss = Math.min(enemy.hp, hpLoss);
    enemy.hp = Math.max(0, enemy.hp - hpLoss);
    if (state.stats) {
      state.stats.totalDamageDealt = (state.stats.totalDamageDealt ?? 0) + actualLoss;
      state.stats.highestSingleHit = Math.max(state.stats.highestSingleHit ?? 0, actualLoss);
    }
    pushCombatLog(
      combat,
      `对【${enemy.name}】造成 ${hpLoss} 点伤害${blocked > 0 ? `（击穿 ${blocked} 点格挡）` : ''}。`,
      'attack'
    );
  } else if (blocked > 0) {
    pushCombatLog(combat, `【${enemy.name}】格挡了 ${blocked} 点伤害。`, 'block');
  }

  // Talk to the Hand: player gains Block on every attack hit against marked target
  if (
    options.isAttack &&
    (blocked > 0 || hpLoss > 0) &&
    state.player.hp > 0 &&
    (enemy.statuses?.talkToTheHand ?? 0) > 0
  ) {
    const ttthBlock = enemy.statuses.talkToTheHand;
    addPlayerBlock(state, ttthBlock);
    pushCombatLog(combat, `【别烦我】触发：获得 ${ttthBlock} 点格挡！`, 'block');
  }

  // Spiker Thorns passive: triggers per attack hit (before lethal return)
  if (options.isAttack && state.player.hp > 0 && (enemy.statuses?.thorns ?? 0) > 0) {
    const thorns = enemy.statuses.thorns;
    dealDamageToPlayer(state, thorns, `【${enemy.name}】的荆棘`, { isAttack: false });
  }

  if (enemy.hp <= 0) {
    if (handleEnemyZeroHp(state, enemy)) {
      return hpLoss;
    }
    enemy.block = 0;
    enemy.intent = null;
    pushCombatLog(combat, `【${enemy.name}】被击败！`, 'victory');
    handleEnemyDeathPassives(state, enemy);
    return hpLoss;
  }

  // Envenom: unblocked attack damage applies Poison
  if (options.isAttack && hpLoss > 0 && (state.player.statuses.envenom ?? 0) > 0) {
    applyPoisonToEnemy(state, enemy, state.player.statuses.envenom);
  }

  // Louse Curl Up trigger: first unblocked attack damage grants block once per combat
  if (options.isAttack && hpLoss > 0 && (enemy.statuses.curlUp ?? 0) > 0) {
    const curlBlock = enemy.statuses.curlUp;
    delete enemy.statuses.curlUp;
    enemy.block += curlBlock;
    pushCombatLog(combat, `【${enemy.name}】触发【蜷缩】，获得 ${curlBlock} 点格挡！`, 'block');
  }

  // Byrd Flight trigger: attack damage removes 1 Flight; reaching 0 grounds & stuns Byrd
  if (options.isAttack && hpLoss > 0 && (enemy.statuses.flight ?? 0) > 0) {
    enemy.statuses.flight -= 1;
    if (enemy.statuses.flight <= 0) {
      delete enemy.statuses.flight;
      enemy.grounded = true;
      enemy.byrdGroundStep = 0;
      enemy.statuses.stunned = 1;
      enemy.intent = {
        id: 'stunned',
        name: '坠落眩晕',
        type: 'sleep',
        summary: '意图：被击落坠地并陷入眩晕，本回合无法行动！',
      };
      pushCombatLog(
        combat,
        `【${enemy.name}】失去全部【飞行】，坠落地面并陷入【眩晕】！`,
        'status'
      );
    } else {
      pushCombatLog(
        combat,
        `【${enemy.name}】的【飞行】削减至 ${enemy.statuses.flight} 层。`,
        'status'
      );
    }
  }

  // Snake Plant Malleable trigger: unblocked attack damage grants escalating block until next enemy turn
  if (options.isAttack && hpLoss > 0 && (enemy.statuses.malleable ?? 0) > 0) {
    const mBlock = enemy.statuses.malleable;
    enemy.block += mBlock;
    enemy.statuses.malleable = mBlock + 1;
    pushCombatLog(
      combat,
      `【${enemy.name}】触发【可塑护甲】，获得 ${mBlock} 点格挡（下次 +${mBlock + 1}）！`,
      'block'
    );
  }

  // Mad Gremlin Angry trigger: unblocked attack damage grants Strength
  if (options.isAttack && hpLoss > 0 && (enemy.statuses.angry ?? 0) > 0) {
    const gain = enemy.statuses.angry;
    applyStatus(enemy, 'strength', gain);
    pushCombatLog(combat, `【${enemy.name}】触发【愤怒】，获得 ${gain} 点力量！`, 'status');
  }

  // Lagavulin Asleep wake-up & stun on penetrating HP loss
  if (hpLoss > 0 && enemy.hp > 0 && (enemy.statuses.asleep ?? 0) > 0) {
    delete enemy.statuses.asleep;
    delete enemy.statuses.metallicize;
    enemy.statuses.stunned = 1;
    enemy.awakeTurnIndex = 0;
    enemy.intent = {
      id: 'stunned',
      name: '惊醒眩晕',
      type: 'sleep',
      summary: '意图：刚被破甲惊醒并陷入眩晕，本回合无法行动！',
    };
    pushCombatLog(
      combat,
      `【${enemy.name}】受破甲伤害惊醒，失去金属化并陷入【眩晕】！`,
      'status'
    );
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

  let amount = Math.floor(rawAmount);
  if (amount > 1 && (state.player.statuses.intangible ?? 0) > 0) {
    amount = 1;
  }

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

  if (hpLoss > 0 && (state.player.statuses?.buffer ?? 0) > 0) {
    state.player.statuses.buffer -= 1;
    if (state.player.statuses.buffer <= 0) {
      delete state.player.statuses.buffer;
    }
    pushCombatLog(combat, `【缓冲】生效：完全抵消了 ${hpLoss} 点生命损失！`, 'block');
    hpLoss = 0;
  }

  if (hpLoss > 0) {
    const actualLoss = Math.min(state.player.hp, hpLoss);
    state.player.hp = Math.max(0, state.player.hp - hpLoss);
    combat.hpLostThisCombat = (combat.hpLostThisCombat ?? 0) + actualLoss;
    if (state.stats) {
      state.stats.totalDamageTaken = (state.stats.totalDamageTaken ?? 0) + actualLoss;
    }
    pushCombatLog(
      combat,
      `${sourceLabel}造成 ${hpLoss} 点伤害${blocked > 0 ? `（格挡 ${blocked} 点）` : ''}。`,
      'damage'
    );
    if (state.player.hp > 0) {
      syncRedSkullStatus(state);
    }
    if (options?.fromCard && state.player.hp > 0 && (state.player.statuses.rupture ?? 0) > 0) {
      const rup = state.player.statuses.rupture;
      applyStatus(state.player, 'strength', rup);
      pushCombatLog(combat, `【撕裂】触发：因卡牌损血获得 ${rup} 点【力量】！`, 'status');
    }
  } else if (blocked > 0) {
    pushCombatLog(combat, `完全格挡了${sourceLabel}的 ${blocked} 点伤害。`, 'block');
  }

  if (state.player.hp <= 0) {
    handleCombatDefeat(state);
  }

  return hpLoss;
}

export function losePlayerHp(state, amount, reasonLabel = '效果', options = {}) {
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

  if (loss > 0 && (state.player.statuses?.buffer ?? 0) > 0) {
    state.player.statuses.buffer -= 1;
    if (state.player.statuses.buffer <= 0) {
      delete state.player.statuses.buffer;
    }
    pushCombatLog(combat, `【缓冲】生效：完全抵消了【${reasonLabel}】造成的 ${loss} 点生命损失！`, 'block');
    return 0;
  }

  const actualLoss = Math.min(state.player.hp, loss);
  state.player.hp = Math.max(0, state.player.hp - loss);
  combat.hpLostThisCombat = (combat.hpLostThisCombat ?? 0) + actualLoss;
  if (state.stats) {
    state.stats.totalDamageTaken = (state.stats.totalDamageTaken ?? 0) + actualLoss;
  }
  pushCombatLog(combat, `因【${reasonLabel}】失去 ${loss} 点生命。`, 'damage');

  if (state.player.hp > 0) {
    syncRedSkullStatus(state);
  }

  if (options?.fromCard && loss > 0 && state.player.hp > 0 && (state.player.statuses.rupture ?? 0) > 0) {
    const rup = state.player.statuses.rupture;
    applyStatus(state.player, 'strength', rup);
    pushCombatLog(combat, `【撕裂】触发：因卡牌损血获得 ${rup} 点【力量】！`, 'status');
  }

  if (state.player.hp <= 0) {
    handleCombatDefeat(state);
  }
  return loss;
}

export function discardCardsBatch(state, cardInstances, { manual = true } = {}) {
  const combat = state?.combat;
  if (!combat || !Array.isArray(cardInstances) || cardInstances.length === 0) return 0;

  const valid = cardInstances.filter(Boolean);
  if (valid.length === 0) return 0;

  let totalEnergyGain = 0;
  let totalDrawGain = 0;

  for (const c of valid) {
    combat.discardPile.push(c);
    if (manual) {
      const cStats = getCardStats(c);
      pushCombatLog(combat, `主动弃置了【${cStats.name}】。`, 'info');
      if (cStats.onDiscardGainEnergy) {
        totalEnergyGain += cStats.onDiscardGainEnergy;
      }
      if (cStats.onDiscardDraw) {
        totalDrawGain += cStats.onDiscardDraw;
      }
    }
  }

  if (!manual) return valid.length;

  const count = valid.length;
  combat.discardedThisTurn = (combat.discardedThisTurn ?? 0) + count;

  if (totalEnergyGain > 0) {
    state.player.energy += totalEnergyGain;
    pushCombatLog(combat, `【战术大师】触发：获得 ${totalEnergyGain} 点能量！`, 'info');
  }

  if (hasRelic(state, 'tough_bandages')) {
    const gain = 3 * count;
    addPlayerBlock(state, gain);
    pushCombatLog(combat, `遗物【${RELIC_LIBRARY.tough_bandages.name}】触发：获得 ${gain} 点格挡！`, 'block');
  }

  if (hasRelic(state, 'tingsha')) {
    for (let i = 0; i < count; i += 1) {
      const alive = getAliveEnemies(combat);
      if (alive.length === 0) break;
      const target = pickRandom(state, alive);
      if (target) {
        pushCombatLog(combat, `遗物【${RELIC_LIBRARY.tingsha.name}】响鸣，对【${target.name}】造成 3 点伤害！`, 'attack');
        dealDamageToEnemy(state, target, 3, { isAttack: false });
      }
    }
  }

  if (totalDrawGain > 0 && combat.phase === 'player' && getAliveEnemies(combat).length > 0) {
    pushCombatLog(combat, `【本能反应】触发：抽 ${totalDrawGain} 张牌！`, 'info');
    drawCards(state, totalDrawGain);
  }

  return count;
}

function setPendingCardChoice(combat, choice) {
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

function getPendingChoiceBlockReason(combat) {
  const active = getActivePendingCardChoice(combat);
  if (!active) return '';
  switch (active.mode) {
    case 'exhaust':
      return '请先选择要消耗的手牌';
    case 'upgrade':
      return '请先选择要升级的手牌';
    case 'scry':
      return '请先完成预见选择';
    default:
      return '请先选择要弃置的手牌';
  }
}

function requestHandCardChoice(
  state,
  mode,
  count,
  sourceName = '选牌',
  onVictoryCallback = null
) {
  const combat = state?.combat;
  if (
    !combat ||
    combat.status !== 'ongoing' ||
    combat.phase !== 'player' ||
    count <= 0 ||
    getAliveEnemies(combat).length === 0
  ) {
    return;
  }

  if (mode === 'discard') {
    if (combat.hand.length === 0) return;
    if (combat.hand.length <= count) {
      const allHand = [...combat.hand];
      combat.hand = [];
      discardCardsBatch(state, allHand, { manual: true });
      if (getAliveEnemies(combat).length === 0 && state.player.hp > 0) {
        setPendingCardChoice(combat, null);
        finalizeCombatVictory(state, onVictoryCallback);
      }
      return;
    }
    setPendingCardChoice(combat, {
      mode: 'discard',
      sourceName,
      count,
      remaining: count,
      optional: false,
      candidates: null,
      selectedIds: [],
    });
    return;
  }

  if (mode === 'exhaust') {
    if (combat.hand.length === 0) return;
    if (combat.hand.length <= count) {
      const allHand = [...combat.hand];
      combat.hand = [];
      exhaustCardsBatch(state, allHand);
      if (getAliveEnemies(combat).length === 0 && state.player.hp > 0) {
        setPendingCardChoice(combat, null);
        finalizeCombatVictory(state, onVictoryCallback);
      }
      return;
    }
    setPendingCardChoice(combat, {
      mode: 'exhaust',
      sourceName,
      count,
      remaining: count,
      optional: false,
      candidates: null,
      selectedIds: [],
    });
    return;
  }

  if (mode === 'upgrade') {
    const upgradable = combat.hand.filter((hc) => canUpgradeCard(hc));
    if (upgradable.length === 0) {
      pushCombatLog(combat, `【${sourceName}】生效，但当前手牌中已无可升级的卡牌。`, 'info');
      return;
    }
    if (upgradable.length <= count) {
      for (const hc of upgradable) {
        hc.upgraded = true;
        pushCombatLog(combat, `【${sourceName}】临时升级了【${getCardStats(hc).name}】！`, 'info');
      }
      return;
    }
    setPendingCardChoice(combat, {
      mode: 'upgrade',
      sourceName,
      count,
      remaining: count,
      optional: false,
      candidates: null,
      selectedIds: [],
    });
  }
}

function requestManualDiscard(state, count, sourceName = '弃牌', onVictoryCallback = null) {
  requestHandCardChoice(state, 'discard', count, sourceName, onVictoryCallback);
}

function returnDiscardCardsByFlag(state, flagName, sourceLabel) {
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

export function changeStance(state, nextStance = 'neutral', options = {}) {
  const combat = state?.combat;
  if (!combat || combat.status !== 'ongoing') {
    return { changed: false, prev: 'neutral', next: 'neutral' };
  }
  const normalizedNext = VALID_STANCES.has(nextStance) ? nextStance : 'neutral';
  const prev = VALID_STANCES.has(combat.stance) ? combat.stance : 'neutral';
  if (prev === normalizedNext) {
    return { changed: false, prev, next: normalizedNext };
  }

  combat.stance = normalizedNext;
  state.player.stance = normalizedNext;

  const prevName = STANCE_METADATA[prev]?.name ?? prev;
  const nextName = STANCE_METADATA[normalizedNext]?.name ?? normalizedNext;
  pushCombatLog(
    combat,
    normalizedNext === 'neutral'
      ? `退出【${prevName}】姿态，回归常态。`
      : `切换姿态：【${prevName}】→【${nextName}】！`,
    'status'
  );

  // Exiting Calm grants +2 Energy (+3 with Violet Lotus)
  if (prev === 'calm') {
    const calmGain = hasRelic(state, 'violet_lotus') ? 3 : 2;
    state.player.energy += calmGain;
    pushCombatLog(
      combat,
      hasRelic(state, 'violet_lotus')
        ? `退出【平静】（【紫莲花】加持）：获得 ${calmGain} 点能量！`
        : `退出【平静】：获得 ${calmGain} 点能量！`,
      'info'
    );
  }

  // Entering Divinity grants +3 Energy immediately
  if (normalizedNext === 'divinity') {
    state.player.energy += 3;
    pushCombatLog(combat, '步入【神格】：立即获得 3 点能量，本回合攻击伤害 ×3！', 'victory');
  }

  // Mental Fortress: gain Block on every stance change
  if ((state.player.statuses?.mentalFortress ?? 0) > 0 && !options.silent) {
    const mfBlock = state.player.statuses.mentalFortress;
    addPlayerBlock(state, mfBlock);
    pushCombatLog(combat, `【心灵堡垒】触发：获得 ${mfBlock} 点格挡！`, 'block');
  }

  // Rushdown: draw on entering Wrath (capped at RUSHDOWN_MAX_TRIGGERS_PER_TURN per turn)
  if (
    normalizedNext === 'wrath' &&
    (state.player.statuses?.rushdown ?? 0) > 0 &&
    !options.silent
  ) {
    const triggers = combat.rushdownTriggersThisTurn ?? 0;
    if (triggers < RUSHDOWN_MAX_TRIGGERS_PER_TURN) {
      combat.rushdownTriggersThisTurn = triggers + 1;
      const drawAmt = state.player.statuses.rushdown;
      pushCombatLog(
        combat,
        `【猛冲】触发（${combat.rushdownTriggersThisTurn}/${RUSHDOWN_MAX_TRIGGERS_PER_TURN}）：抽 ${drawAmt} 张牌！`,
        'info'
      );
      drawCards(state, drawAmt);
    } else {
      pushCombatLog(
        combat,
        `【猛冲】本回合已达上限（${RUSHDOWN_MAX_TRIGGERS_PER_TURN} 次），不再继续抽牌。`,
        'info'
      );
    }
  }

  // Flurry of Blows: return from discard pile on stance change
  if (!options.silent) {
    returnDiscardCardsByFlag(state, 'returnOnStanceChange', '姿态切换');
  }

  return { changed: true, prev, next: normalizedNext };
}

export function gainMantra(state, amount, options = {}) {
  const combat = state?.combat;
  const gain = Math.max(0, Math.floor(amount ?? 0));
  if (!combat || combat.status !== 'ongoing' || gain <= 0) return { enteredDivinity: false };

  combat.mantraGainedThisCombat = (combat.mantraGainedThisCombat ?? 0) + gain;
  applyStatus(state.player, 'mantra', gain);
  pushCombatLog(
    combat,
    `获得 ${gain} 点【真言】（当前 ${state.player.statuses.mantra ?? 0}/10）。`,
    'status'
  );

  let enteredDivinity = false;
  while ((state.player.statuses.mantra ?? 0) >= 10) {
    state.player.statuses.mantra -= 10;
    if (state.player.statuses.mantra <= 0) {
      delete state.player.statuses.mantra;
    }
    changeStance(state, 'divinity', options);
    enteredDivinity = true;
  }
  return { enteredDivinity };
}

export function initiateScry(state, amount, sourceName = '预见', options = {}) {
  const combat = state?.combat;
  if (
    !combat ||
    state.screen !== 'combat' ||
    combat.status !== 'ongoing' ||
    combat.phase !== 'player'
  ) {
    return { ok: false, reason: '当前无法执行预见' };
  }
  const baseAmt = Math.max(0, Math.floor(amount ?? 0));
  const goldenEyeBonus = baseAmt > 0 && hasRelic(state, 'golden_eye') ? 2 : 0;
  const safeAmt = baseAmt + goldenEyeBonus;
  const drawAfterScry = Math.max(0, Math.floor(options.drawAfterScry ?? 0));

  if (safeAmt <= 0 || combat.drawPile.length === 0) {
    pushCombatLog(combat, `【${sourceName}】抽牌堆为空，无需预见。`, 'info');
    if (safeAmt > 0) {
      returnDiscardCardsByFlag(state, 'returnOnScry', '【预见】');
    }
    if (drawAfterScry > 0) {
      drawCards(state, drawAfterScry);
    }
    return { ok: true, count: 0 };
  }
  const topCount = Math.min(safeAmt, combat.drawPile.length);
  const candidates = combat.drawPile.slice(0, topCount);
  setPendingCardChoice(combat, {
    mode: 'scry',
    sourceName,
    count: topCount,
    remaining: topCount,
    optional: true,
    candidates,
    selectedIds: [],
    drawAfterScry,
  });
  pushCombatLog(
    combat,
    goldenEyeBonus > 0
      ? `【${sourceName}】触发预见（【黄金之眼】+2）：检视抽牌堆顶 ${topCount} 张卡牌。`
      : `【${sourceName}】触发预见：检视抽牌堆顶 ${topCount} 张卡牌。`,
    'info'
  );
  return { ok: true, count: topCount };
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

export function confirmScryChoice(state, explicitDiscardIds = null, onVictoryCallback = null) {
  const combat = state?.combat;
  const pending = getActivePendingCardChoice(combat);
  if (
    !combat ||
    state.screen !== 'combat' ||
    combat.status !== 'ongoing' ||
    combat.phase !== 'player' ||
    !pending ||
    pending.mode !== 'scry'
  ) {
    return { ok: false, reason: '当前不在预见选牌阶段' };
  }

  const candidateIds = new Set((pending.candidates || []).map((c) => c.instanceId));
  const rawIds = Array.isArray(explicitDiscardIds) ? explicitDiscardIds : pending.selectedIds || [];
  const discardSet = new Set(rawIds.filter((id) => candidateIds.has(id)));
  const drawAfterScry = Math.max(0, Math.floor(pending.drawAfterScry ?? 0));

  const toDiscard = [];
  const nextDraw = [];
  for (let i = 0; i < combat.drawPile.length; i += 1) {
    const card = combat.drawPile[i];
    if (i < pending.count && discardSet.has(card.instanceId)) {
      toDiscard.push(card);
    } else {
      nextDraw.push(card);
    }
  }
  combat.drawPile = nextDraw;
  const keptCount = Math.max(0, pending.count - toDiscard.length);
  setPendingCardChoice(combat, null);

  if (toDiscard.length > 0) {
    discardCardsBatch(state, toDiscard, { manual: false });
    if ((state.player.statuses?.nirvana ?? 0) > 0) {
      const nirvBlock = toDiscard.length * state.player.statuses.nirvana;
      addPlayerBlock(state, nirvBlock);
      pushCombatLog(combat, `【涅槃】触发：预见弃置 ${toDiscard.length} 张牌，获得 ${nirvBlock} 点格挡！`, 'block');
    }
  }
  pushCombatLog(
    combat,
    toDiscard.length > 0
      ? `【${pending.sourceName}】预见完成：弃置 ${toDiscard.length} 张牌，保留 ${keptCount} 张于抽牌堆顶。`
      : `【${pending.sourceName}】预见完成：保留全部 ${keptCount} 张牌于抽牌堆顶。`,
    'info'
  );

  // Weave returns from discard pile whenever Scry resolves
  returnDiscardCardsByFlag(state, 'returnOnScry', '【预见】');

  // Deferred draw (e.g., Cut Through Fate or Foresight start-of-turn Scry)
  if (drawAfterScry > 0 && getAliveEnemies(combat).length > 0 && state.player.hp > 0) {
    drawCards(state, drawAfterScry);
  }

  if (getAliveEnemies(combat).length === 0 && state.player.hp > 0) {
    finalizeCombatVictory(state, onVictoryCallback);
  }

  return {
    ok: true,
    discardedCount: toDiscard.length,
    keptCount,
    outcome: state.combat?.status ?? combat.status,
  };
}

export function resolveCardChoice(state, instanceId, onVictoryCallback = null) {
  const combat = state?.combat;
  const pending = getActivePendingCardChoice(combat);
  if (
    !combat ||
    state.screen !== 'combat' ||
    combat.status !== 'ongoing' ||
    combat.phase !== 'player' ||
    !pending
  ) {
    return { ok: false, reason: '当前不需要进行手牌选择' };
  }

  if (pending.mode === 'scry') {
    return toggleScryChoice(state, instanceId);
  }

  const idx = combat.hand.findIndex((c) => c.instanceId === instanceId);
  if (idx === -1) {
    return { ok: false, reason: '未在手牌中找到该卡牌' };
  }

  if (pending.mode === 'upgrade') {
    const card = combat.hand[idx];
    if (!canUpgradeCard(card)) {
      return { ok: false, reason: '该卡牌已达满级或无法升级' };
    }
    card.upgraded = true;
    pushCombatLog(combat, `【${pending.sourceName}】临时升级了【${getCardStats(card).name}】！`, 'info');

    pending.remaining = Math.max(0, (pending.remaining ?? 1) - 1);
    const remainingUpgradable = combat.hand.filter((hc) => canUpgradeCard(hc));
    if (pending.remaining <= 0 || remainingUpgradable.length === 0) {
      setPendingCardChoice(combat, null);
    } else if (remainingUpgradable.length <= pending.remaining) {
      for (const hc of remainingUpgradable) {
        hc.upgraded = true;
        pushCombatLog(combat, `【${pending.sourceName}】临时升级了【${getCardStats(hc).name}】！`, 'info');
      }
      setPendingCardChoice(combat, null);
    }

    return {
      ok: true,
      mode: 'upgrade',
      outcome: state.combat?.status ?? combat.status,
      remaining: combat.pendingCardChoice?.remaining ?? 0,
    };
  }

  if (pending.mode === 'exhaust') {
    const [card] = combat.hand.splice(idx, 1);
    pending.remaining = Math.max(0, (pending.remaining ?? 1) - 1);
    if (pending.remaining <= 0) {
      setPendingCardChoice(combat, null);
    }

    exhaustCardsBatch(state, [card]);

    if (getAliveEnemies(combat).length === 0 && state.player.hp > 0) {
      setPendingCardChoice(combat, null);
      finalizeCombatVictory(state, onVictoryCallback);
      return { ok: true, mode: 'exhaust', outcome: state.combat?.status ?? combat.status, remaining: 0 };
    }

    if (combat.pendingCardChoice && combat.hand.length === 0) {
      setPendingCardChoice(combat, null);
    } else if (
      combat.pendingCardChoice &&
      combat.hand.length <= combat.pendingCardChoice.remaining
    ) {
      const rest = [...combat.hand];
      combat.hand = [];
      setPendingCardChoice(combat, null);
      exhaustCardsBatch(state, rest);
      if (getAliveEnemies(combat).length === 0 && state.player.hp > 0) {
        finalizeCombatVictory(state, onVictoryCallback);
      }
    }

    return {
      ok: true,
      mode: 'exhaust',
      outcome: state.combat?.status ?? combat.status,
      remaining: combat.pendingCardChoice?.remaining ?? 0,
    };
  }

  // Default: mode === 'discard'
  const [card] = combat.hand.splice(idx, 1);
  pending.remaining = Math.max(0, (pending.remaining ?? 1) - 1);
  if (pending.remaining <= 0) {
    setPendingCardChoice(combat, null);
  }

  discardCardsBatch(state, [card], { manual: true });

  if (getAliveEnemies(combat).length === 0 && state.player.hp > 0) {
    setPendingCardChoice(combat, null);
    finalizeCombatVictory(state, onVictoryCallback);
    return { ok: true, mode: 'discard', outcome: state.combat?.status ?? combat.status, remaining: 0 };
  }

  if (combat.pendingCardChoice && combat.hand.length === 0) {
    setPendingCardChoice(combat, null);
  } else if (combat.pendingCardChoice && combat.hand.length <= combat.pendingCardChoice.remaining) {
    const rest = [...combat.hand];
    combat.hand = [];
    setPendingCardChoice(combat, null);
    discardCardsBatch(state, rest, { manual: true });
    if (getAliveEnemies(combat).length === 0 && state.player.hp > 0) {
      finalizeCombatVictory(state, onVictoryCallback);
    }
  }

  return {
    ok: true,
    mode: 'discard',
    outcome: state.combat?.status ?? combat.status,
    remaining: combat.pendingCardChoice?.remaining ?? 0,
  };
}

export function discardHandCard(state, instanceId, onVictoryCallback = null) {
  const pending = getActivePendingCardChoice(state?.combat);
  if (!pending || pending.mode !== 'discard') {
    return { ok: false, reason: '当前不需要弃置手牌' };
  }
  return resolveCardChoice(state, instanceId, onVictoryCallback);
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
    addPlayerBlock(state, gain);
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
  state.player.stance = 'neutral';
  state.combatSnapshot = null;
  if (state.stats) {
    state.stats.defeatedBy = `第 ${state.act ?? 1} 幕 F${Math.max(1, state.floor ?? 1)} · ${state.combat.encounterName || '未知强敌'}`;
  }
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
  combat.attacksPlayedThisTurn = 0;
  combat.discardedThisTurn = 0;
  combat.shurikenCounter = 0;
  combat.kunaiCounter = 0;
  combat.ornamentalFanCounter = 0;
  combat.rushdownTriggersThisTurn = 0;
  combat.lastCardTypePlayed = null;
  combat.playedCardTypesThisTurn = { attack: false, skill: false, power: false };
  setPendingCardChoice(combat, null);
  delete state.player.statuses.flameBarrier;
  for (const e of combat.enemies || []) {
    if (e.slowStacks) e.slowStacks = 0;
  }

  // Blasphemy lethal oath triggers at start of next player turn
  if ((state.player.statuses.blasphemer ?? 0) > 0) {
    delete state.player.statuses.blasphemer;
    pushCombatLog(combat, '【渎神誓约】反噬降临！', 'damage');
    losePlayerHp(state, 999, '渎神誓约');
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

  if (!state.relicCounters) state.relicCounters = {};
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
    pushCombatLog(combat, `【暗涌之怒】爆发：进入【愤怒】并额外抽 ${simmeringDraw} 张牌！`, 'status');
    changeStance(state, 'wrath');
  }

  const bagDraw = combat.turn === 1 && hasRelic(state, 'bag_of_prep') ? 2 : 0;
  const snakeDraw = combat.turn === 1 && hasRelic(state, 'ring_of_the_snake') ? 2 : 0;
  const dailyT1Draw = combat.turn === 1 && hasDailyModifier(state, 'time_dilation') ? 1 : 0;
  const serpentDraw = hasRelic(state, 'ring_of_the_serpent') ? 1 : 0;
  const sneckoDraw = hasRelic(state, 'snecko_eye') ? 2 : 0;
  const toolsDraw = state.player.statuses.toolsOfTheTrade ?? 0;
  const nextTurnDraw = state.player.statuses.drawCardNextTurn ?? 0;
  if (nextTurnDraw > 0) {
    delete state.player.statuses.drawCardNextTurn;
    pushCombatLog(combat, `【预谋抽牌】生效：额外抽 ${nextTurnDraw} 张牌。`, 'info');
  }

  if (snakeDraw > 0) {
    pushCombatLog(combat, `遗物【${RELIC_LIBRARY.ring_of_the_snake.name}】生效：第 1 回合额外抽 2 张牌。`, 'info');
  }
  if (serpentDraw > 0) {
    pushCombatLog(combat, `遗物【${RELIC_LIBRARY.ring_of_the_serpent.name}】生效：本回合额外抽 1 张牌。`, 'info');
  }

  const totalTurnDraw =
    BASE_DRAW_PER_TURN +
    bagDraw +
    snakeDraw +
    dailyT1Draw +
    serpentDraw +
    sneckoDraw +
    toolsDraw +
    nextTurnDraw +
    simmeringDraw;

  // Foresight: Scry before drawing turn cards (resumes turn draw via drawAfterScry)
  const foresightAmt = state.player.statuses.foresight ?? 0;
  if (foresightAmt > 0 && combat.drawPile.length > 0 && toolsDraw === 0) {
    initiateScry(state, foresightAmt, '先见之明', { drawAfterScry: totalTurnDraw });
  } else {
    if (foresightAmt > 0 && combat.drawPile.length === 0) {
      returnDiscardCardsByFlag(state, 'returnOnScry', '【先见之明】');
    }
    drawCards(state, totalTurnDraw);
  }

  if (combat.turn === 1) {
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
  }

  if (combat.turn === 1 && hasRelic(state, 'enchiridion') && getAliveEnemies(combat).length > 0) {
    const charId = state.characterId ?? state.player.characterId ?? 'ironclad';
    const powerPool = Object.values(CARD_LIBRARY)
      .filter(
        (c) =>
          c.type === 'power' &&
          !c.shopOnly &&
          c.rarity !== 'special' &&
          (getCardCharacter(c) === charId || getCardCharacter(c) === 'colorless')
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

  if (getAliveEnemies(combat).length === 0 && state.player.hp > 0) {
    finalizeCombatVictory(state, onVictoryCallback);
    return;
  }

  if (toolsDraw > 0) {
    requestManualDiscard(state, toolsDraw, '独门秘技', onVictoryCallback);
  }
}

export function startCombat(state, encounter, encounterRole = 'normal', onVictoryCallback = null) {
  state.combatSnapshot = null;
  state.player.block = 0;
  state.player.energy = state.player.maxEnergy;
  state.player.statuses = {};
  state.player.skipStatusTick = {};
  state.player.stance = 'neutral';

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
    stance: 'neutral',
    mantraGainedThisCombat: 0,
    lastCardTypePlayed: null,
    rushdownTriggersThisTurn: 0,
    extraTurnQueued: false,
    hpLostThisCombat: 0,
    cardsPlayedThisTurn: 0,
    attacksPlayedThisTurn: 0,
    discardedThisTurn: 0,
    shurikenCounter: 0,
    kunaiCounter: 0,
    ornamentalFanCounter: 0,
    redSkullActive: false,
    playedCardTypesThisTurn: { attack: false, skill: false, power: false },
    pendingCardChoice: null,
    pendingDiscard: null,
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
    applyStatus(state.player, 'confused', 1);
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
    for (const enemy of getAliveEnemies(combat)) {
      applyStatus(enemy, 'vulnerable', 1);
    }
    pushCombatLog(
      combat,
      `遗物【${RELIC_LIBRARY.bag_of_marbles.name}】生效：所有敌人获得 1 层【易伤】。`,
      'status'
    );
  }
  if (hasRelic(state, 'red_mask')) {
    for (const enemy of getAliveEnemies(combat)) {
      applyStatus(enemy, 'weak', 1);
    }
    pushCombatLog(
      combat,
      `遗物【${RELIC_LIBRARY.red_mask.name}】生效：所有敌人获得 1 层【虚弱】。`,
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
      reason: `受【天鹅绒项圈】限制，每回合最多打出 ${VELVET_CHOKER_CARD_LIMIT} 张卡牌`,
    };
  }
  const stats = getCardStats(cardInstance);
  const canMedKitPlay = stats.unplayable && stats.type === 'status' && hasRelic(state, 'medical_kit');
  if (stats.unplayable && !canMedKitPlay) {
    return { playable: false, reason: '该卡牌不可打出' };
  }
  if (
    stats.requireAllHandAttacks &&
    combat.hand.some((c) => getCardStats(c).type !== 'attack')
  ) {
    return { playable: false, reason: '手牌中存在非攻击牌，无法打出【交锋】' };
  }
  const effectiveCost = getEffectiveCardCost(stats, state.player, combat);
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

  const effectiveCost = getEffectiveCardCost(stats, state.player, combat);
  const flatBonus = getCardAttackFlatBonus(stats, state.player, combat);
  const attacksBeforeThis = combat.attacksPlayedThisTurn ?? 0;
  const hadDiscardedBeforeThis = (combat.discardedThisTurn ?? 0) > 0;
  const prevCardType = combat.lastCardTypePlayed ?? null;
  const targetIntendsAttackBefore = Boolean(
    targetEnemy &&
      targetEnemy.hp > 0 &&
      targetEnemy.intent &&
      (targetEnemy.intent.type?.startsWith('attack') ||
        typeof targetEnemy.intent.damage === 'number')
  );
  const energySpent = stats.isXCost ? state.player.energy : (effectiveCost ?? 0);
  const chemXBonus = stats.isXCost && hasRelic(state, 'chemical_x') ? 2 : 0;
  const effectiveX = energySpent + chemXBonus;
  const corruptionActive =
    stats.type === 'skill' && (state.player.statuses.corruption ?? 0) > 0;
  const burstStacks = state.player.statuses?.burst ?? 0;
  const burstActive = stats.type === 'skill' && !stats.noBurst && burstStacks > 0;
  const repeatTimes = burstActive ? 2 : 1;

  // 1. Remove from hand before resolving effects (prevents self-draw and frees hand slot)
  combat.hand.splice(handIndex, 1);
  state.player.energy -= energySpent;
  state.stats.cardsPlayed = (state.stats.cardsPlayed ?? 0) + 1;
  combat.cardsPlayedThisTurn = (combat.cardsPlayedThisTurn ?? 0) + 1;

  pushCombatLog(
    combat,
    `打出【${stats.name}】${stats.isXCost ? `（消耗 ${energySpent} 点能量${chemXBonus > 0 ? `，化学物X +${chemXBonus}` : ''}）` : ''}。`,
    'card'
  );

  if (burstActive) {
    if (burstStacks - 1 <= 0) {
      delete state.player.statuses.burst;
    } else {
      state.player.statuses.burst = burstStacks - 1;
    }
    pushCombatLog(combat, `【爆发】生效：技能【${stats.name}】将连续发动 2 次！`, 'status');
  }

  let totalManualDiscard = 0;
  let totalManualExhaust = 0;
  let totalManualUpgrade = 0;
  let totalScry = 0;
  let totalDrawAfterScry = 0;

  for (let pass = 0; pass < repeatTimes; pass += 1) {
    if (pass > 0) {
      if (combat.status !== 'ongoing' || state.player.hp <= 0 || getAliveEnemies(combat).length === 0) {
        break;
      }
      pushCombatLog(combat, `【爆发】回响：再次触发【${stats.name}】！`, 'info');
    }

    // 2. Self HP cost & self heal (Bandage Up)
    if (stats.loseHp) {
      losePlayerHp(state, stats.loseHp, stats.name, { fromCard: true });
      if (combat.status !== 'ongoing') {
        return { ok: true, outcome: state.combat?.status ?? combat.status };
      }
    }
    if (stats.healHp && state.player.hp > 0) {
      const before = state.player.hp;
      state.player.hp = Math.min(state.player.maxHp, state.player.hp + stats.healHp);
      const healed = state.player.hp - before;
      syncRedSkullStatus(state);
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
    if (typeof stats.block === 'number') {
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
          c.upgraded = true;
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
          addPlayerBlock(state, totalBlock);
          pushCombatLog(combat, `【${stats.name}】获得 ${totalBlock} 点格挡。`, 'block');
        }
        exhaustCardsBatch(state, nonAttacks);
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
      applyStatus(targetEnemy, 'mark', stats.applyMarkAndTrigger);
      pushCombatLog(
        combat,
        `【${targetEnemy.name}】获得 ${stats.applyMarkAndTrigger} 层【印记】（当前 ${targetEnemy.statuses.mark} 层）。`,
        'status'
      );
      triggerSadisticNature(state, targetEnemy);
      for (const enemy of [...getAliveEnemies(combat)]) {
        if (enemy.hp <= 0) continue;
        const markStacks = enemy.statuses?.mark ?? 0;
        if (markStacks > 0) {
          const markLoss = Math.min(enemy.hp, markStacks);
          enemy.hp = Math.max(0, enemy.hp - markStacks);
          if (state.stats && markLoss > 0) {
            state.stats.totalDamageDealt = (state.stats.totalDamageDealt ?? 0) + markLoss;
            state.stats.highestSingleHit = Math.max(state.stats.highestSingleHit ?? 0, markLoss);
          }
          pushCombatLog(
            combat,
            `【印记】引爆：【${enemy.name}】无视格挡失去 ${markStacks} 点生命！`,
            'attack'
          );
          if (enemy.hp <= 0 && !handleEnemyZeroHp(state, enemy)) {
            enemy.block = 0;
            enemy.intent = null;
            pushCombatLog(combat, `【${enemy.name}】被【印记】击倒！`, 'victory');
            handleEnemyDeathPassives(state, enemy);
          }
        }
      }
    }

    // 5. Attack hits (Fiend Fire, Reaper, Bane, Finisher, Bowling Bash, Wallop, Lesson Learned, Ragnarok, etc.)
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
      let hits;
      if (stats.hitsPerAttackPlayedThisTurn) {
        hits = attacksBeforeThis;
      } else if (stats.hitsPerAliveEnemy) {
        hits = Math.max(1, getAliveEnemies(combat).length);
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

      if ((typeof stats.damage === 'number' || stats.useBlockAsDamage) && hits > 0) {
        const strikeCountOffset = isStrikeCard(cardInstance.cardId) ? 1 : 0;
        const extraStrikeBonus = stats.bonusDamagePerStrike
          ? stats.bonusDamagePerStrike * (countCombatStrikeCards(combat) + strikeCountOffset)
          : 0;
        const baseDmg = (stats.useBlockAsDamage ? state.player.block : stats.damage) + extraStrikeBonus;
        const strMult = stats.strengthMultiplier ?? 1;
        const targetAliveBefore = Boolean(targetEnemy && targetEnemy.hp > 0);
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
          return { ok: true, outcome: state.combat?.status ?? combat.status };
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

        if (stats.goldOnKill && targetAliveBefore && targetEnemy && targetEnemy.hp <= 0) {
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

        if (
          stats.maxHpOnKill &&
          targetAliveBefore &&
          targetEnemy &&
          targetEnemy.hp <= 0 &&
          !targetEnemy.isMinion
        ) {
          state.player.maxHp += stats.maxHpOnKill;
          state.player.hp = Math.min(state.player.maxHp, state.player.hp + stats.maxHpOnKill);
          syncRedSkullStatus(state);
          pushCombatLog(
            combat,
            `【${stats.name}】吞噬目标，最大生命永久 +${stats.maxHpOnKill}（当前 ${state.player.hp}/${state.player.maxHp}）！`,
            'victory'
          );
        }

        if (
          stats.fatalPermanentUpgrade &&
          targetAliveBefore &&
          targetEnemy &&
          targetEnemy.hp <= 0 &&
          !targetEnemy.isMinion
        ) {
          const upgradableDeck = (state.player.deck || []).filter((c) => canUpgradeCard(c));
          const chosenDeckCard = pickRandom(state, upgradableDeck);
          if (chosenDeckCard) {
            chosenDeckCard.upgraded = true;
            pushCombatLog(
              combat,
              `【${stats.name}】斩杀领悟：永久升级了牌组中的【${getCardStats(chosenDeckCard).name}】！`,
              'victory'
            );
          }
        }

        if (stats.lifestealUnblocked && totalUnblocked > 0 && state.player.hp > 0) {
          const before = state.player.hp;
          state.player.hp = Math.min(state.player.maxHp, state.player.hp + totalUnblocked);
          const healed = state.player.hp - before;
          syncRedSkullStatus(state);
          if (healed > 0) {
            pushCombatLog(combat, `【${stats.name}】吸取生命，回复了 ${healed} 点生命！`, 'victory');
          }
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
    }

    if (stats.type === 'attack' && (state.player.statuses?.vigor ?? 0) > 0) {
      delete state.player.statuses.vigor;
    }

    if (stats.copySelfToDiscard) {
      const copy = createCardInstance(state, cardInstance.cardId, cardInstance.upgraded);
      combat.discardPile.push(copy);
      pushCombatLog(combat, `将 1 张【${stats.name}】复制品放入弃牌堆。`, 'info');
    }

    // 5b. Watcher last-card-type chain bonuses (Crush Joints, Sash Whip, Follow-Up)
    if (stats.ifLastCardType && prevCardType === stats.ifLastCardType.type) {
      if (stats.ifLastCardType.applyEnemyStatuses && targetEnemy && targetEnemy.hp > 0) {
        for (const [sKey, sVal] of Object.entries(stats.ifLastCardType.applyEnemyStatuses)) {
          applyStatus(targetEnemy, sKey, sVal);
          const sMeta = STATUS_METADATA[sKey];
          pushCombatLog(
            combat,
            `【${stats.name}】连携触发：【${targetEnemy.name}】获得 ${sVal} 层【${sMeta?.name ?? sKey}】！`,
            'status'
          );
          if (sMeta?.polarity === 'debuff') {
            triggerSadisticNature(state, targetEnemy);
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

    // 6. Enemy status application (Poison, Disarm, Piercing Wail, Malaise, Bouncing Flask, Catalyst, Talk to the Hand)
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
            applyStatus(enemy, statusKey, val);
            const statusMeta = STATUS_METADATA[statusKey];
            const statusName = statusMeta?.name ?? statusKey;
            pushCombatLog(
              combat,
              val < 0
                ? `【${enemy.name}】失去 ${Math.abs(val)} 点【${statusName}】。`
                : `【${enemy.name}】获得 ${val} 层【${statusName}】。`,
              'status'
            );
            if (statusMeta?.polarity === 'debuff' || (statusKey === 'strength' && val < 0)) {
              triggerSadisticNature(state, enemy);
            }
          }
        }
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
        applyStatus(enemy, 'strength', -stats.tempEnemyStrengthLoss);
        applyStatus(enemy, 'gainStrengthEndTurn', stats.tempEnemyStrengthLoss);
        pushCombatLog(
          combat,
          `【${enemy.name}】本回合失去 ${stats.tempEnemyStrengthLoss} 点力量（回合结束恢复）。`,
          'status'
        );
        triggerSadisticNature(state, enemy);
      }
    }

    if (stats.xEnemyStrengthLoss || stats.xEnemyWeak) {
      const xVal = effectiveX + (stats.xBonus ?? 0);
      if (xVal > 0 && targetEnemy && targetEnemy.hp > 0) {
        if (stats.xEnemyStrengthLoss) {
          applyStatus(targetEnemy, 'strength', -xVal);
          pushCombatLog(combat, `【${targetEnemy.name}】永久失去 ${xVal} 点【力量】。`, 'status');
          triggerSadisticNature(state, targetEnemy);
        }
        if (stats.xEnemyWeak && targetEnemy.hp > 0) {
          applyStatus(targetEnemy, 'weak', xVal);
          pushCombatLog(combat, `【${targetEnemy.name}】获得 ${xVal} 层【虚弱】。`, 'status');
          triggerSadisticNature(state, targetEnemy);
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
        applyPoisonToEnemy(state, targetEnemy, added);
        pushCombatLog(
          combat,
          `【${stats.name}】催化剧毒：【${targetEnemy.name}】的中毒层数跃升至 ${targetEnemy.statuses.poison} 层！`,
          'status'
        );
      } else {
        pushCombatLog(combat, `【${targetEnemy.name}】当前没有中毒，【${stats.name}】未能催化。`, 'info');
      }
    }

    // 6b. Generated cards into hand / drawPile / discardPile & Potion generation
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
        for (let c = 0; c < qty; c += 1) {
          const created = createCardInstance(state, spec.cardId, Boolean(spec.upgraded));
          const insertIdx = randomInt(state, 0, combat.drawPile.length);
          combat.drawPile.splice(insertIdx, 0, created);
        }
        const cName = CARD_LIBRARY[spec.cardId]?.name ?? spec.cardId;
        pushCombatLog(combat, `将 ${qty} 张【${cName}】洗入抽牌堆。`, 'status');
      }
    }

    if (Array.isArray(stats.addDiscardCards)) {
      for (const spec of stats.addDiscardCards) {
        const qty = spec.count ?? 1;
        for (let c = 0; c < qty; c += 1) {
          const created = createCardInstance(state, spec.cardId, Boolean(spec.upgraded));
          combat.discardPile.push(created);
        }
        const cName = CARD_LIBRARY[spec.cardId]?.name ?? spec.cardId;
        pushCombatLog(combat, `将 ${qty} 张【${cName}】放入弃牌堆。`, 'status');
      }
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

    // 7. Self status application, Limit Break, Stances & Mantra
    if (stats.applySelfStatuses) {
      for (const [statusKey, val] of Object.entries(stats.applySelfStatuses)) {
        applyStatus(state.player, statusKey, val);
        const statusName = STATUS_METADATA[statusKey]?.name ?? statusKey;
        pushCombatLog(combat, `玩家获得 ${val} 层【${statusName}】。`, 'status');
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

    // 8. Draw cards (& Scrawl draw-to-full / Escape Plan conditional Skill Block / deferred Scry+Draw)
    if (stats.drawUntilHandFull) {
      const needDraw = Math.max(0, MAX_HAND_SIZE - combat.hand.length);
      if (needDraw > 0) {
        drawCards(state, needDraw);
      }
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

    // 9. Post-draw self statuses (e.g. Battle Trance noDraw)
    if (stats.applySelfStatusesAfter) {
      for (const [statusKey, val] of Object.entries(stats.applySelfStatusesAfter)) {
        applyStatus(state.player, statusKey, val);
      }
    }

    // 9b. Player per-card & per-attack reactive powers & relics (Duality, After Image, A Thousand Cuts, Shuriken, Kunai)
    if (stats.type === 'attack') {
      combat.attacksPlayedThisTurn = (combat.attacksPlayedThisTurn ?? 0) + 1;
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
          return { ok: true, outcome: state.combat?.status ?? combat.status };
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
    if (stats.upgradeHandChoice) {
      totalManualUpgrade += stats.upgradeHandChoice;
    }
    if (stats.scry) {
      totalScry += stats.scry;
    }
  }

  combat.lastCardTypePlayed = stats.type;

  // 11. Move card to final destination (before pendingCardChoice so deck cycle stays exact)
  if (stats.type === 'power') {
    // Powers stay active on character and leave deck cycle for combat
  } else if (
    stats.exhaust ||
    corruptionActive ||
    (stats.type === 'status' && stats.unplayable && hasRelic(state, 'medical_kit'))
  ) {
    exhaustCardsBatch(state, [cardInstance]);
  } else if (stats.shuffleSelfToDraw) {
    const insertIdx = randomInt(state, 0, combat.drawPile.length);
    combat.drawPile.splice(insertIdx, 0, cardInstance);
    pushCombatLog(combat, `【${stats.name}】已洗回抽牌堆。`, 'info');
  } else {
    combat.discardPile.push(cardInstance);
  }

  if (stats.type === 'power' && hasRelic(state, 'mummified_hand') && getAliveEnemies(combat).length > 0) {
    const candidates = combat.hand.filter((hc) => {
      const cStats = getCardStats(hc);
      if (cStats.unplayable || cStats.isXCost) return false;
      return (getEffectiveCardCost(cStats, state.player, combat) ?? 0) > 0;
    });
    const chosen = pickRandom(state, candidates);
    if (chosen) {
      chosen.prevCombatCost = chosen.combatCost ?? null;
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

  for (const enemy of getAliveEnemies(combat)) {
    if ((enemy.statuses?.slow ?? 0) > 0) {
      enemy.slowStacks = (enemy.slowStacks ?? 0) + 1;
    }
  }

  if (state.player.hp <= 0 || combat.status !== 'ongoing') {
    return { ok: true, outcome: state.combat?.status ?? combat.status };
  }

  // 12. Check victory before Time Warp interruption
  if (getAliveEnemies(combat).length === 0 && state.player.hp > 0) {
    setPendingCardChoice(combat, null);
    finalizeCombatVictory(state, onVictoryCallback);
    return { ok: true, outcome: state.combat?.status ?? combat.status };
  }

  let triggeredTimeWarp = false;
  for (const enemy of getAliveEnemies(combat)) {
    if ((enemy.statuses?.timeWarp ?? 0) > 0) {
      enemy.statuses.timeWarp -= 1;
      if (enemy.statuses.timeWarp <= 0) {
        enemy.statuses.timeWarp = 12;
        applyStatus(enemy, 'strength', 2);
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
    return endPlayerTurn(state, onVictoryCallback);
  }

  // 11b. Request interactive hand/draw card choices (Discard / Exhaust / Upgrade / Scry)
  if (getAliveEnemies(combat).length > 0 && state.player.hp > 0) {
    if (totalManualDiscard > 0) {
      requestHandCardChoice(state, 'discard', totalManualDiscard, stats.name, onVictoryCallback);
    } else if (totalManualExhaust > 0) {
      requestHandCardChoice(state, 'exhaust', totalManualExhaust, stats.name, onVictoryCallback);
    } else if (totalManualUpgrade > 0) {
      requestHandCardChoice(state, 'upgrade', totalManualUpgrade, stats.name, onVictoryCallback);
    } else if (totalScry > 0) {
      initiateScry(state, totalScry, stats.name, { drawAfterScry: totalDrawAfterScry });
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
      return endPlayerTurn(state, onVictoryCallback);
    }
    if (stats.endTurnAfter) {
      pushCombatLog(combat, `【${stats.name}】落下终章，自动结束本回合。`, 'info');
      return endPlayerTurn(state, onVictoryCallback);
    }
  }

  return { ok: true, outcome: state.combat?.status ?? combat.status };
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
  if (potion.metallicize) {
    const val = potion.metallicize * mult;
    applyStatus(state.player, 'metallicize', val);
    pushCombatLog(combat, `获得 ${val} 层【金属化】！`, 'status');
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
  if (potion.healPct && state.player.hp > 0) {
    const healAmt = Math.max(1, Math.floor((state.player.maxHp * (potion.healPct * mult)) / 100));
    const before = state.player.hp;
    state.player.hp = Math.min(state.player.maxHp, state.player.hp + healAmt);
    syncRedSkullStatus(state);
    pushCombatLog(combat, `回复了 ${state.player.hp - before} 点生命。`, 'victory');
  }
  if (potion.applyEnemyStatuses && targetRes.enemy && targetRes.enemy.hp > 0) {
    for (const [sKey, sVal] of Object.entries(potion.applyEnemyStatuses)) {
      if (targetRes.enemy.hp <= 0) break;
      const val = sVal * mult;
      if (sKey === 'poison') {
        applyPoisonToEnemy(state, targetRes.enemy, val);
      } else {
        applyStatus(targetRes.enemy, sKey, val);
        const sMeta = STATUS_METADATA[sKey];
        const sName = sMeta?.name ?? sKey;
        pushCombatLog(combat, `【${targetRes.enemy.name}】获得 ${val} 层【${sName}】。`, 'status');
        if (sMeta?.polarity === 'debuff') {
          triggerSadisticNature(state, targetRes.enemy);
        }
      }
    }
  }

  if (getAliveEnemies(combat).length === 0 && state.player.hp > 0) {
    finalizeCombatVictory(state, onVictoryCallback);
  }

  return { ok: true, outcome: state.combat?.status ?? combat.status };
}

export function endPlayerTurn(state, onVictoryCallback = null) {
  const combat = state?.combat;
  if (!combat || state.screen !== 'combat' || combat.status !== 'ongoing' || combat.phase !== 'player') {
    return { ok: false, reason: '当前不能结束回合' };
  }
  if (hasPendingCardChoice(combat)) {
    return { ok: false, reason: `${getPendingChoiceBlockReason(combat)}再结束回合` };
  }

  combat.phase = 'enemy';
  delete state.player.statuses.noDraw;
  delete state.player.statuses.burst;

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

  // 0. Temporary Strength & Dexterity decay (Flex / Duality)
  if ((state.player.statuses.tempStrengthDown ?? 0) > 0) {
    const drop = state.player.statuses.tempStrengthDown;
    delete state.player.statuses.tempStrengthDown;
    applyStatus(state.player, 'strength', -drop);
    pushCombatLog(combat, `临时强化消退，失去 ${drop} 点力量。`, 'status');
  }
  if ((state.player.statuses.tempDexterityDown ?? 0) > 0) {
    const dropDex = state.player.statuses.tempDexterityDown;
    delete state.player.statuses.tempDexterityDown;
    applyStatus(state.player, 'dexterity', -dropDex);
  }

  // 1. Resolve end-of-turn hand curses/statuses (Burn, Regret, Doubt), then Ethereal / Retain / Discard
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
      applyStatus(state.player, 'weak', stats.endOfTurnWeak, { appliedDuringEnemyTurn: true });
      pushCombatLog(combat, `手牌【${stats.name}】使你获得 ${stats.endOfTurnWeak} 层【虚弱】。`, 'status');
    }
  }

  if (state.player.hp <= 0 || combat.status !== 'ongoing') {
    return { ok: true, outcome: state.combat?.status ?? combat.status };
  }

  const keepHandByPyramid = hasRelic(state, 'runic_pyramid');
  const establishmentDiscount = state.player.statuses.establishment ?? 0;
  const etherealToExhaust = [];
  const retainedHand = [];
  for (const cardInstance of combat.hand) {
    const stats = getCardStats(cardInstance);
    if (stats.ethereal) {
      etherealToExhaust.push(cardInstance);
    } else if (stats.retain || keepHandByPyramid) {
      retainedHand.push(cardInstance);
      if (stats.retainCostReduce) {
        cardInstance.retainedCostDiscount =
          (cardInstance.retainedCostDiscount ?? 0) + stats.retainCostReduce;
      }
      if (stats.retainScaleBlock) {
        cardInstance.combatBlockMod =
          (cardInstance.combatBlockMod ?? 0) + stats.retainScaleBlock;
      }
      if (establishmentDiscount > 0 && !stats.unplayable && !stats.isXCost && typeof stats.cost === 'number') {
        cardInstance.retainedCostDiscount =
          (cardInstance.retainedCostDiscount ?? 0) + establishmentDiscount;
      }
    } else {
      combat.discardPile.push(cardInstance);
    }
  }
  combat.hand = retainedHand;

  if (etherealToExhaust.length > 0) {
    exhaustCardsBatch(state, etherealToExhaust);
    if (getAliveEnemies(combat).length === 0 && state.player.hp > 0) {
      finalizeCombatVictory(state, onVictoryCallback);
      return { ok: true, outcome: state.combat?.status ?? combat.status };
    }
  }

  // 2. End of turn relics & powers (Orichalcum, Metallicize, Like Water, Omega)
  if (hasRelic(state, 'orichalcum') && state.player.block === 0) {
    addPlayerBlock(state, 6);
    pushCombatLog(combat, `遗物【${RELIC_LIBRARY.orichalcum.name}】生效：获得 6 点格挡。`, 'block');
  }
  if ((state.player.statuses.metallicize ?? 0) > 0) {
    const m = state.player.statuses.metallicize;
    addPlayerBlock(state, m);
    pushCombatLog(combat, `【金属化】生效：获得 ${m} 点格挡。`, 'block');
  }
  if ((state.player.statuses.likeWater ?? 0) > 0 && combat.stance === 'calm') {
    const lw = state.player.statuses.likeWater;
    addPlayerBlock(state, lw);
    pushCombatLog(combat, `【上善若水】生效（平静姿态）：获得 ${lw} 点格挡！`, 'block');
  }
  if ((state.player.statuses.omega ?? 0) > 0) {
    const omegaDmg = state.player.statuses.omega;
    const alive = getAliveEnemies(combat);
    if (alive.length > 0) {
      pushCombatLog(combat, `【终焉】降临：对所有敌人造成 ${omegaDmg} 点毁灭性伤害！`, 'attack');
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
    startPlayerTurn(state, onVictoryCallback);
    return { ok: true, outcome: state.combat?.status ?? combat.status };
  }

  // 3. Enemy phase: clear enemy previous block (unless Barricade), reset Malleable, tick Poison, then execute each alive enemy's intent
  for (const enemy of getAliveEnemies(combat)) {
    if (!((enemy.statuses?.barricade ?? 0) > 0)) {
      enemy.block = 0;
    }
    if ((enemy.malleableBase ?? 0) > 0 && enemy.statuses) {
      enemy.statuses.malleable = enemy.malleableBase;
    }
  }

  const actingEnemies = [...combat.enemies];
  for (const enemy of actingEnemies) {
    if (enemy.hp <= 0) continue;
    if (state.player.hp <= 0 || combat.status !== 'ongoing') break;

    // Poison ticks at the start of the enemy's turn (bypasses block, decrements by 1; lethal Poison skips enemy intent!)
    if ((enemy.statuses?.poison ?? 0) > 0) {
      const poisonStacks = enemy.statuses.poison;
      const poisonDmg =
        (enemy.statuses?.intangible ?? 0) > 0 ? Math.min(1, poisonStacks) : poisonStacks;
      const actualPoisonLoss = Math.min(enemy.hp, poisonDmg);
      enemy.hp = Math.max(0, enemy.hp - poisonDmg);
      if (state.stats && actualPoisonLoss > 0) {
        state.stats.totalDamageDealt = (state.stats.totalDamageDealt ?? 0) + actualPoisonLoss;
        state.stats.highestSingleHit = Math.max(state.stats.highestSingleHit ?? 0, actualPoisonLoss);
      }
      pushCombatLog(combat, `【${enemy.name}】受【中毒】折磨失去 ${poisonDmg} 点生命！`, 'damage');
      if (enemy.hp <= 0) {
        if (handleEnemyZeroHp(state, enemy)) {
          continue;
        }
        enemy.block = 0;
        enemy.intent = null;
        pushCombatLog(combat, `【${enemy.name}】毒发倒下！`, 'victory');
        handleEnemyDeathPassives(state, enemy);
        continue;
      }
      if (actualPoisonLoss > 0 && (enemy.statuses?.asleep ?? 0) > 0) {
        delete enemy.statuses.asleep;
        delete enemy.statuses.metallicize;
        enemy.statuses.stunned = 1;
        enemy.awakeTurnIndex = 0;
        enemy.intent = {
          id: 'stunned',
          name: '惊醒眩晕',
          type: 'sleep',
          summary: '意图：刚被中毒惊醒并陷入眩晕，本回合无法行动！',
        };
        pushCombatLog(
          combat,
          `【${enemy.name}】受毒伤惊醒，失去金属化并陷入【眩晕】！`,
          'status'
        );
      }
      if (poisonStacks - 1 <= 0) {
        delete enemy.statuses.poison;
      } else {
        enemy.statuses.poison = poisonStacks - 1;
      }
    }

    const intent = enemy.intent;
    if (intent) {
      if (intent.id === 'asleep_idle' || intent.id === 'stunned') {
        if (intent.id === 'stunned') {
          delete enemy.statuses.stunned;
          enemy.awakeTurnIndex = 0;
          pushCombatLog(
            combat,
            `【${enemy.name}】处于眩晕状态，本回合跳过行动并恢复清醒！`,
            'status'
          );
        } else {
          pushCombatLog(combat, `【${enemy.name}】正在沉睡，没有采取进攻行动。`, 'info');
        }
        enemy.lastMoveId = intent.id;
      } else {
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
          if (hasDailyModifier(state, 'lethality')) {
            applyStatus(childA, 'strength', 3);
            applyStatus(childB, 'strength', 3);
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
            const hpLost = dealDamageToPlayer(state, dmg, `【${enemy.name}】的${intent.name || '攻击'}`);
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
                `【痛苦刺击】触发：将 ${woundCount} 张【伤口】塞入你的弃牌堆！`,
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

        if (intent.summonMinions) {
          const currentMinions = getAliveEnemies(combat).filter(
            (e) => e.templateId === intent.summonMinions
          ).length;
          const summonCap = intent.summonMax ?? 4;
          const canSpawn = Math.max(0, Math.min(intent.summonCount ?? 1, summonCap - currentMinions));
          let spawnedCount = 0;
          for (let s = 0; s < canSpawn; s += 1) {
            const minion = createEnemyInstance(state, {
              templateId: intent.summonMinions,
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
            spawnedCount += 1;
          }
          if (spawnedCount > 0) {
            pushCombatLog(
              combat,
              `【${enemy.name}】召唤了 ${spawnedCount} 个【${combat.enemies[combat.enemies.length - 1].name}】！`,
              'status'
            );
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
      enemy.awakeTurnIndex = (enemy.awakeTurnIndex ?? 0) + 1;
    }

    if ((enemy.statuses?.gainStrengthEndTurn ?? 0) > 0) {
      const restore = enemy.statuses.gainStrengthEndTurn;
      delete enemy.statuses.gainStrengthEndTurn;
      applyStatus(enemy, 'strength', restore);
      pushCombatLog(combat, `【${enemy.name}】在回合结束恢复了 ${restore} 点力量。`, 'status');
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
    enemy.intent = rollEnemyIntent(state, enemy, state.player, combat);
  }

  // 5. Start next Player turn
  startPlayerTurn(state, onVictoryCallback);
  return { ok: true, outcome: state.combat?.status ?? combat.status };
}

function finalizeCombatVictory(state, onVictoryCallback = null) {
  const combat = state.combat;
  if (!combat || combat.status === 'victory') return;

  combat.status = 'victory';
  combat.phase = 'ended';
  state.player.block = 0;
  state.player.stance = 'neutral';
  state.player.statuses = {};
  state.player.skipStatusTick = {};
  state.combatSnapshot = null;
  state.stats.enemiesSlain = (state.stats.enemiesSlain ?? 0) + combat.enemies.length;
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
