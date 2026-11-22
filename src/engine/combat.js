import {
  canUpgradeCard,
  CARD_LIBRARY,
  countCombatStrikeCards,
  createCardInstance,
  getCardAttackFlatBonus,
  getCardCharacter,
  getCardStats,
  getEffectiveCardCost,
  getRewardCardPools,
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
export const RUSHDOWN_MAX_TRIGGERS_PER_TURN = Infinity;
const VALID_STANCES = new Set(['neutral', 'calm', 'wrath', 'divinity']);
const DECAYING_DEBUFFS = ['vulnerable', 'weak', 'frail'];
const ROUND_DECAY_STATUSES = ['vulnerable', 'weak', 'frail', 'intangible'];
const SIGNED_STATUSES = new Set(['strength', 'dexterity']);

export function hasRelic(state, relicId) {
  return Array.isArray(state?.player?.relics) && state.player.relics.includes(relicId);
}

function healPlayerInCombat(state, rawAmount) {
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

function addPlayerBlock(state, amount) {
  const gain = Math.floor(amount);
  if (!state?.player || !Number.isFinite(gain) || gain <= 0) return 0;
  state.player.block += gain;
  if (state.stats) {
    state.stats.totalBlockGained = (state.stats.totalBlockGained ?? 0) + gain;
  }
  const combat = state.combat;
  const waveWeak = state.player.statuses?.waveOfTheHand ?? 0;
  if (waveWeak > 0 && combat && combat.status === 'ongoing' && !state._resolvingWaveOfTheHand) {
    const alive = getAliveEnemies(combat);
    if (alive.length > 0) {
      state._resolvingWaveOfTheHand = true;
      try {
        for (const enemy of alive) {
          if (enemy.hp <= 0) continue;
          if (applyStatus(enemy, 'weak', waveWeak)) {
            triggerSadisticNature(state, enemy);
          }
        }
        pushCombatLog(combat, `【摆手】触发：给予所有敌人 ${waveWeak} 层【虚弱】！`, 'status');
      } finally {
        delete state._resolvingWaveOfTheHand;
      }
    }
  }
  const juggDmg = state.player.statuses?.juggernaut ?? 0;
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
  pushCombatLog(combat, `【残虐天性】触发：对【${enemy.name}】造成 ${dmg} 点伤害！`, 'attack');
  dealDamageToEnemy(state, enemy, dmg, { isAttack: false });
}

function triggerChampionBeltIfVulnerable(state, enemy, statusKey, delta) {
  if (
    statusKey === 'vulnerable' &&
    delta > 0 &&
    enemy &&
    enemy.hp > 0 &&
    hasRelic(state, 'champion_belt')
  ) {
    if (applyStatus(enemy, 'weak', 1)) {
      pushCombatLog(
        state.combat,
        `遗物【${RELIC_LIBRARY.champion_belt.name}】触发：【${enemy.name}】额外获得 1 层【虚弱】！`,
        'status'
      );
      triggerSadisticNature(state, enemy);
    }
  }
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

export function applyPoisonToEnemy(state, enemy, amount, options = {}) {
  const combat = state?.combat;
  if (!combat || !enemy || enemy.hp <= 0 || !Number.isFinite(amount) || amount <= 0) return 0;
  const skullBonus = !options.skipSneckoSkull && hasRelic(state, 'snecko_skull') ? 1 : 0;
  const total = Math.floor(amount) + skullBonus;
  if (!applyStatus(enemy, 'poison', total)) {
    pushCombatLog(combat, `【${enemy.name}】的【人工制品】抵消了中毒！`, 'status');
    return 0;
  }
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

function syncRedSkullStatus(state) {
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
  // Gremlin Horn: +1 energy & draw 1 card whenever an enemy dies
  if (hasRelic(state, 'gremlin_horn') && combat.status === 'ongoing' && state.player.hp > 0) {
    state.player.energy += 1;
    pushCombatLog(
      combat,
      `遗物【${RELIC_LIBRARY.gremlin_horn.name}】触发：击杀【${deadEnemy.name}】，获得 1 点能量并抽 1 张牌！`,
      'info'
    );
    if (combat.phase === 'player' && getAliveEnemies(combat).length > 0) {
      drawCards(state, 1);
    }
  }
}

function reshuffleDiscardIntoDraw(state, { triggerRelics = true } = {}) {
  const combat = state?.combat;
  if (!combat || combat.discardPile.length === 0) return false;
  combat.drawPile = [...combat.drawPile, ...shuffled(state, combat.discardPile)];
  combat.discardPile = [];
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
      reshuffleDiscardIntoDraw(state);
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

    // Deus Ex Machina: auto-exhaust on draw and add Miracles to hand
    if (drawnStats.autoExhaustOnDrawMiracles) {
      const idx = combat.hand.findIndex((c) => c.instanceId === nextCard.instanceId);
      if (idx !== -1) combat.hand.splice(idx, 1);
      pushCombatLog(
        combat,
        `【${drawnStats.name}】神迹降临：自动消耗并将 ${drawnStats.autoExhaustOnDrawMiracles} 张【奇迹】加入手牌！`,
        'victory'
      );
      exhaustCardsBatch(state, [nextCard]);
      addCardsToHand(state, 'miracle', drawnStats.autoExhaustOnDrawMiracles, false);
      continue;
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

  if (
    combat._melangeScryQueued &&
    combat.status === 'ongoing' &&
    combat.phase === 'player' &&
    !hasPendingCardChoice(combat) &&
    getAliveEnemies(combat).length > 0
  ) {
    combat._melangeScryQueued = false;
    addPlayerBlock(state, 7);
    gainMantra(state, 4);
    pushCombatLog(
      combat,
      `遗物【${RELIC_LIBRARY.melange.name}】触发：获得 4 点【真言】与 7 点格挡！`,
      'status'
    );
    if (combat.drawPile.length > 0 && combat.status === 'ongoing') {
      initiateScry(state, 3, RELIC_LIBRARY.melange.name);
    }
  } else {
    combat._melangeScryQueued = false;
  }

  return drawn;
}

export function dealDamageToEnemy(state, enemy, rawAmount, options = { isAttack: true }) {
  const combat = state.combat;
  if (!combat || !enemy || enemy.hp <= 0 || rawAmount < 0) return 0;
  if (rawAmount === 0 && !options.isAttack) return 0;

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
    state.player.hp > 0 &&
    (enemy.statuses?.talkToTheHand ?? 0) > 0
  ) {
    const ttthBlock = enemy.statuses.talkToTheHand;
    addPlayerBlock(state, ttthBlock);
    pushCombatLog(combat, `【以手拒之】触发：获得 ${ttthBlock} 点格挡！`, 'block');
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

  // Snake Plant / Writhing Mass Malleable trigger: unblocked attack damage grants escalating block until next enemy turn
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

  // Shelled Parasite Plated Armor break trigger: unblocked attack damage strips 1 layer; hitting 0 stuns it
  if (options.isAttack && hpLoss > 0 && (enemy.statuses.platedArmor ?? 0) > 0) {
    enemy.statuses.platedArmor -= 1;
    if (enemy.statuses.platedArmor <= 0) {
      delete enemy.statuses.platedArmor;
      if (enemy.templateId === 'shelled_parasite') {
        enemy.statuses.stunned = 1;
        enemy.intent = {
          id: 'stunned',
          name: '硬壳碎裂 · 眩晕',
          type: 'debuff',
          summary: '多层护甲已被击碎！本回合陷入眩晕无法行动。',
        };
        pushCombatLog(
          combat,
          `【${enemy.name}】的【多层护甲】彻底碎裂，陷入【眩晕】！`,
          'status'
        );
      } else {
        pushCombatLog(combat, `【${enemy.name}】的【多层护甲】已耗尽！`, 'status');
      }
    }
  }

  // Transient Shifting trigger: losing HP reduces Strength for the rest of the turn
  if (hpLoss > 0 && enemy.hp > 0 && (enemy.statuses.shifting ?? 0) > 0) {
    enemy.statuses.strength = (enemy.statuses.strength ?? 0) - hpLoss;
    if (enemy.statuses.strength === 0) delete enemy.statuses.strength;
    enemy.tempStrengthRestore = (enemy.tempStrengthRestore ?? 0) + hpLoss;
    pushCombatLog(
      combat,
      `【${enemy.name}】触发【游移】，本回合力量降低 ${hpLoss} 点！`,
      'status'
    );
  }

  // Writhing Mass Reactive trigger: unblocked attack damage re-rolls its intent immediately
  if (options.isAttack && hpLoss > 0 && enemy.hp > 0 && (enemy.statuses.reactive ?? 0) > 0) {
    const prevId = enemy.intent?.id ?? null;
    enemy.intent = rollEnemyIntent(state, enemy, { forceDifferentFromId: prevId });
    pushCombatLog(
      combat,
      `【${enemy.name}】触发【应激反应】，意图立即切换为【${enemy.intent?.name || '新行动'}】！`,
      'status'
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

function handlePlayerHpLostTriggers(state, { isAttack = false } = {}) {
  const combat = state?.combat;
  if (!combat || combat.status !== 'ongoing') return;
  combat.hpLossCountThisCombat = (combat.hpLossCountThisCombat ?? 0) + 1;

  if (isAttack && (state.player.statuses?.platedArmor ?? 0) > 0) {
    state.player.statuses.platedArmor -= 1;
    if (state.player.statuses.platedArmor <= 0) {
      delete state.player.statuses.platedArmor;
    }
    pushCombatLog(combat, '受到未格挡攻击伤害，【多层护甲】减少 1 层。', 'status');
  }

  if (state.player.hp <= 0) return;

  if (hasRelic(state, 'self_forming_clay') && (combat.clayTriggersThisTurn ?? 0) < 2) {
    combat.clayTriggersThisTurn = (combat.clayTriggersThisTurn ?? 0) + 1;
    applyStatus(state.player, 'nextTurnBlock', 2);
    pushCombatLog(
      combat,
      `遗物【${RELIC_LIBRARY.self_forming_clay.name}】触发：下回合开始获得 2 点格挡！`,
      'block'
    );
  }

  if (hasRelic(state, 'centennial_puzzle') && !combat.centennialUsed) {
    combat.centennialUsed = true;
    if (combat.phase === 'player' && getAliveEnemies(combat).length > 0) {
      pushCombatLog(
        combat,
        `遗物【${RELIC_LIBRARY.centennial_puzzle.name}】触发：首次损血，立即抽 3 张牌！`,
        'info'
      );
      drawCards(state, 3);
    } else {
      applyStatus(state.player, 'drawCardNextTurn', 3);
      pushCombatLog(
        combat,
        `遗物【${RELIC_LIBRARY.centennial_puzzle.name}】触发：首次损血，下回合开始额外抽 3 张牌！`,
        'info'
      );
    }
  }

  if (hasRelic(state, 'runic_cube')) {
    const phaseKey = `${combat.turn}:${combat.phase}`;
    if (combat.runicCubeLastPhaseKey !== phaseKey) {
      combat.runicCubeLastPhaseKey = phaseKey;
      if (combat.phase === 'player' && getAliveEnemies(combat).length > 0) {
        pushCombatLog(
          combat,
          `遗物【${RELIC_LIBRARY.runic_cube.name}】触发：损血抽 1 张牌！`,
          'info'
        );
        drawCards(state, 1);
      } else {
        applyStatus(state.player, 'drawCardNextTurn', 1);
        pushCombatLog(
          combat,
          `遗物【${RELIC_LIBRARY.runic_cube.name}】触发：下回合开始额外抽 1 张牌！`,
          'info'
        );
      }
    }
  }
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
    if (state.player.hp <= 0) {
      handleCombatDefeat(state);
    }
    if (state.player.hp > 0 && combat.status === 'ongoing') {
      syncRedSkullStatus(state);
      handlePlayerHpLostTriggers(state, { isAttack: options.isAttack !== false });
    }
    if (options?.fromCard && state.player.hp > 0 && (state.player.statuses.rupture ?? 0) > 0) {
      const rup = state.player.statuses.rupture;
      applyStatus(state.player, 'strength', rup);
      pushCombatLog(combat, `【撕裂】触发：因卡牌损血获得 ${rup} 点【力量】！`, 'status');
    }
  } else if (blocked > 0) {
    pushCombatLog(combat, `完全格挡了${sourceLabel}的 ${blocked} 点伤害。`, 'block');
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

  if (state.player.hp <= 0) {
    handleCombatDefeat(state);
  }

  if (state.player.hp > 0 && combat.status === 'ongoing') {
    syncRedSkullStatus(state);
    handlePlayerHpLostTriggers(state, { isAttack: false });
  }

  if (options?.fromCard && loss > 0 && state.player.hp > 0 && (state.player.statuses.rupture ?? 0) > 0) {
    const rup = state.player.statuses.rupture;
    applyStatus(state.player, 'strength', rup);
    pushCombatLog(combat, `【撕裂】触发：因卡牌损血获得 ${rup} 点【力量】！`, 'status');
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

  if (hasRelic(state, 'hovering_kite') && !combat.hoveringKiteUsedThisTurn) {
    combat.hoveringKiteUsedThisTurn = true;
    state.player.energy += 1;
    pushCombatLog(
      combat,
      `遗物【${RELIC_LIBRARY.hovering_kite.name}】触发：本回合首次弃牌获得 1 点能量！`,
      'info'
    );
  }

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
    case 'discard_to_draw':
      return '请先从弃牌堆选择要置顶的卡牌';
    case 'retrieve_discard_retain':
      return '请先从弃牌堆选择要取回并保留的卡牌';
    case 'retain':
      return '请先选择本回合要保留的手牌并确认结束回合';
    default:
      return '请先选择要弃置的手牌';
  }
}

function requestDiscardPileChoice(
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

function requestEndTurnRetainChoice(state, quota, sourceName = '计划妥当') {
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
        ? `退出【平静】（【紫色莲花】加持）：获得 ${calmGain} 点能量！`
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

  // Rushdown: draw on every entry into Wrath (uncapped, matching original Slay the Spire)
  if (
    normalizedNext === 'wrath' &&
    (state.player.statuses?.rushdown ?? 0) > 0 &&
    !options.silent
  ) {
    combat.rushdownTriggersThisTurn = (combat.rushdownTriggersThisTurn ?? 0) + 1;
    const drawAmt = state.player.statuses.rushdown;
    pushCombatLog(
      combat,
      `【猛虎下山】触发（本回合第 ${combat.rushdownTriggersThisTurn} 次）：抽 ${drawAmt} 张牌！`,
      'info'
    );
    drawCards(state, drawAmt);
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
      if ((state.player.statuses?.nirvana ?? 0) > 0) {
        const nirvBlock = state.player.statuses.nirvana;
        addPlayerBlock(state, nirvBlock);
        pushCombatLog(combat, `【涅槃】触发：预见获得 ${nirvBlock} 点格挡！`, 'block');
      }
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
      ? `【${sourceName}】触发预见（【黄金眼】+2）：检视抽牌堆顶 ${topCount} 张卡牌。`
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
  }
  if ((state.player.statuses?.nirvana ?? 0) > 0) {
    const nirvMult = Math.max(1, toDiscard.length);
    const nirvBlock = nirvMult * state.player.statuses.nirvana;
    addPlayerBlock(state, nirvBlock);
    pushCombatLog(
      combat,
      toDiscard.length > 0
        ? `【涅槃】触发：预见弃置 ${toDiscard.length} 张牌，获得 ${nirvBlock} 点格挡！`
        : `【涅槃】触发：预见完成，获得 ${nirvBlock} 点格挡！`,
      'block'
    );
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
  if (pending.mode !== 'retrieve_discard_retain' && pending.mode !== 'retain') {
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

export function confirmPendingCardChoice(state, explicitIds = null, onVictoryCallback = null) {
  const combat = state?.combat;
  const pending = getActivePendingCardChoice(combat);
  if (
    !combat ||
    state.screen !== 'combat' ||
    combat.status !== 'ongoing' ||
    combat.phase !== 'player' ||
    !pending
  ) {
    return { ok: false, reason: '当前没有待确认的选牌操作' };
  }

  if (pending.mode === 'scry') {
    return confirmScryChoice(state, explicitIds, onVictoryCallback);
  }

  const candidateIds = new Set((pending.candidates || []).map((c) => c.instanceId));
  const rawIds = Array.isArray(explicitIds) ? explicitIds : pending.selectedIds || [];
  const uniqueValidIds = [];
  for (const id of rawIds) {
    if (candidateIds.has(id) && !uniqueValidIds.includes(id)) {
      uniqueValidIds.push(id);
      if (uniqueValidIds.length >= pending.count) break;
    }
  }

  if (pending.mode === 'retrieve_discard_retain') {
    const pickedNames = [];
    for (const id of uniqueValidIds) {
      if (combat.hand.length >= MAX_HAND_SIZE) break;
      const dIdx = combat.discardPile.findIndex((c) => c.instanceId === id);
      if (dIdx === -1) continue;
      const [card] = combat.discardPile.splice(dIdx, 1);
      if (card) {
        card.tempRetainTurn = true;
        combat.hand.push(card);
        pickedNames.push(getCardStats(card).name);
      }
    }
    const shouldEndTurn = Boolean(pending.endTurnAfter);
    const sourceName = pending.sourceName;
    setPendingCardChoice(combat, null);

    if (pickedNames.length > 0) {
      pushCombatLog(
        combat,
        `【${sourceName}】从弃牌堆取回并保留：${pickedNames.map((n) => `【${n}】`).join('、')}。`,
        'info'
      );
    } else {
      pushCombatLog(combat, `【${sourceName}】未从弃牌堆取回卡牌。`, 'info');
    }

    if (shouldEndTurn && getAliveEnemies(combat).length > 0 && state.player.hp > 0 && combat.status === 'ongoing') {
      pushCombatLog(combat, `【${sourceName}】落下终章，自动结束本回合。`, 'info');
      return endPlayerTurn(state, onVictoryCallback);
    }

    return {
      ok: true,
      mode: 'retrieve_discard_retain',
      retrievedCount: pickedNames.length,
      outcome: state.combat?.status ?? combat.status,
    };
  }

  if (pending.mode === 'retain') {
    const retainedNames = [];
    for (const id of uniqueValidIds) {
      const card = combat.hand.find((c) => c.instanceId === id);
      if (card) {
        card.tempRetainTurn = true;
        retainedNames.push(getCardStats(card).name);
      }
    }
    const sourceName = pending.sourceName;
    setPendingCardChoice(combat, null);

    if (retainedNames.length > 0) {
      pushCombatLog(
        combat,
        `【${sourceName}】选择保留至下回合：${retainedNames.map((n) => `【${n}】`).join('、')}。`,
        'info'
      );
    }

    return endPlayerTurn(state, onVictoryCallback, { skipWellLaidPlansPrompt: true });
  }

  if (pending.mode === 'discard_to_draw') {
    const movedNames = [];
    for (const id of uniqueValidIds) {
      const dIdx = combat.discardPile.findIndex((c) => c.instanceId === id);
      if (dIdx === -1) continue;
      const [card] = combat.discardPile.splice(dIdx, 1);
      if (card) {
        combat.drawPile.unshift(card);
        movedNames.push(getCardStats(card).name);
      }
    }
    const sourceName = pending.sourceName;
    setPendingCardChoice(combat, null);
    if (movedNames.length > 0) {
      pushCombatLog(
        combat,
        `【${sourceName}】将弃牌堆中的${movedNames.map((n) => `【${n}】`).join('、')}置于抽牌堆顶。`,
        'info'
      );
    }
    return {
      ok: true,
      mode: 'discard_to_draw',
      movedCount: movedNames.length,
      outcome: state.combat?.status ?? combat.status,
    };
  }

  return { ok: false, reason: '当前选牌模式不支持统一确认' };
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

  if (
    pending.mode === 'scry' ||
    pending.mode === 'retrieve_discard_retain' ||
    pending.mode === 'retain'
  ) {
    return togglePendingCardChoice(state, instanceId);
  }

  if (pending.mode === 'discard_to_draw') {
    const valid = (pending.candidates || []).some((c) => c.instanceId === instanceId);
    const dIdx = combat.discardPile.findIndex((c) => c.instanceId === instanceId);
    if (!valid || dIdx === -1) {
      return { ok: false, reason: '未在弃牌堆中找到该卡牌' };
    }
    const [card] = combat.discardPile.splice(dIdx, 1);
    combat.drawPile.unshift(card);
    pending.candidates = (pending.candidates || []).filter((c) => c.instanceId !== instanceId);
    pending.remaining = Math.max(0, (pending.remaining ?? 1) - 1);
    pushCombatLog(
      combat,
      `【${pending.sourceName}】将弃牌堆中的【${getCardStats(card).name}】置于抽牌堆顶。`,
      'info'
    );
    if (pending.remaining <= 0 || pending.candidates.length === 0) {
      setPendingCardChoice(combat, null);
    }
    return {
      ok: true,
      mode: 'discard_to_draw',
      outcome: state.combat?.status ?? combat.status,
      remaining: combat.pendingCardChoice?.remaining ?? 0,
    };
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

  let sentinelEnergy = 0;
  for (const c of valid) {
    combat.exhaustPile.push(c);
    const cStats = getCardStats(c);
    pushCombatLog(combat, `【${cStats.name}】已消耗。`, 'info');
    if (cStats.onExhaustGainEnergy) {
      sentinelEnergy += cStats.onExhaustGainEnergy;
    }
  }

  if (sentinelEnergy > 0 && combat.status === 'ongoing') {
    state.player.energy += sentinelEnergy;
    pushCombatLog(combat, `【哨位】被消耗，立即获得 ${sentinelEnergy} 点能量！`, 'info');
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

  if (
    hasRelic(state, 'dead_branch') &&
    combat.status === 'ongoing' &&
    combat.phase === 'player' &&
    getAliveEnemies(combat).length > 0
  ) {
    const charId = state.characterId ?? state.player.characterId ?? 'ironclad';
    const pools = getRewardCardPools(charId);
    const allClassCards = [...pools.common, ...pools.uncommon, ...pools.rare];
    for (let i = 0; i < count; i += 1) {
      const randId = pickRandom(state, allClassCards);
      if (randId) {
        addCardsToHand(state, randId, 1, false);
      }
    }
    pushCombatLog(
      combat,
      `遗物【${RELIC_LIBRARY.dead_branch.name}】触发：生成了 ${count} 张随机职业卡牌！`,
      'info'
    );
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
    relicCounters: state.relicCounters || {},
    relicFlags: state.relicFlags || {},
  });
}

function handleCombatDefeat(state) {
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
  combat.skillsPlayedThisTurn = 0;
  combat.discardedThisTurn = 0;
  combat.hoveringKiteUsedThisTurn = false;
  combat.clayTriggersThisTurn = 0;
  combat.panacheCounter = 0;
  combat.shurikenCounter = 0;
  combat.kunaiCounter = 0;
  combat.ornamentalFanCounter = 0;
  combat.rushdownTriggersThisTurn = 0;
  combat.playedCardTypesThisTurn = { attack: false, skill: false, power: false };
  setPendingCardChoice(combat, null);
  delete state.player.statuses.flameBarrier;
  delete state.player.statuses.rage;
  delete state.player.statuses.doubleTap;
  delete state.player.statuses.duplication;
  delete state.player.statuses.waveOfTheHand;
  delete state.player.statuses.doubleDamage;
  for (const e of combat.enemies || []) {
    if (e.slowStacks) e.slowStacks = 0;
    if (e.statuses?.choke) delete e.statuses.choke;
  }

  // Phantasmal Killer: activates Double Damage for this turn
  if ((state.player.statuses.phantasmal ?? 0) > 0) {
    state.player.statuses.phantasmal -= 1;
    if (state.player.statuses.phantasmal <= 0) {
      delete state.player.statuses.phantasmal;
    }
    state.player.statuses.doubleDamage = 1;
    pushCombatLog(combat, '【幻影杀手】触发：本回合所有攻击伤害翻倍（×2）！', 'status');
  }

  // Blasphemy lethal oath triggers at start of next player turn (Intangible reduces to 1; Buffer blocks)
  if ((state.player.statuses.blasphemer ?? 0) > 0) {
    delete state.player.statuses.blasphemer;
    const isIntangible = (state.player.statuses.intangible ?? 0) > 0;
    const oathDmg = isIntangible ? 1 : 999;
    pushCombatLog(
      combat,
      isIntangible ? '【渎神誓约】反噬降临，但【无实体】将其降至 1 点！' : '【渎神誓约】反噬降临！',
      'damage'
    );
    losePlayerHp(state, oathDmg, '渎神誓约');
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

  if ((state.player.statuses.berserk ?? 0) > 0) {
    const bGain = state.player.statuses.berserk;
    state.player.energy += bGain;
    pushCombatLog(combat, `【狂暴】生效：额外获得 ${bGain} 点能量！`, 'info');
  }

  if (hasRelic(state, 'slavers_collar') && (combat.role === 'elite' || combat.role === 'boss')) {
    state.player.energy += 1;
    pushCombatLog(
      combat,
      `遗物【${RELIC_LIBRARY.slavers_collar.name}】生效（强敌战）：额外获得 1 点能量！`,
      'info'
    );
  }

  if (combat.turn > 1 && hasRelic(state, 'art_of_war') && !combat.playedAttackLastTurn) {
    state.player.energy += 1;
    pushCombatLog(
      combat,
      `遗物【${RELIC_LIBRARY.art_of_war.name}】生效（上回合未攻击）：额外获得 1 点能量！`,
      'info'
    );
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

  if (hasRelic(state, 'brimstone')) {
    applyStatus(state.player, 'strength', 2);
    for (const enemy of getAliveEnemies(combat)) {
      applyStatus(enemy, 'strength', 1);
    }
    pushCombatLog(
      combat,
      `遗物【${RELIC_LIBRARY.brimstone.name}】沸腾：你获得 2 点【力量】，所有敌人获得 1 点【力量】！`,
      'status'
    );
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

  if ((state.player.statuses.battleHymn ?? 0) > 0) {
    addCardsToHand(state, 'smite', state.player.statuses.battleHymn, false);
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
    pushCombatLog(combat, `【怒火中烧】爆发：进入【愤怒】并额外抽 ${simmeringDraw} 张牌！`, 'status');
    changeStance(state, 'wrath');
  }

  const bagDraw = combat.turn === 1 && hasRelic(state, 'bag_of_prep') ? 2 : 0;
  const snakeDraw = combat.turn === 1 && hasRelic(state, 'ring_of_the_snake') ? 2 : 0;
  const dailyT1Draw = combat.turn === 1 && hasDailyModifier(state, 'time_dilation') ? 1 : 0;
  const serpentDraw = hasRelic(state, 'ring_of_the_serpent') ? 1 : 0;
  const sneckoDraw = hasRelic(state, 'snecko_eye') ? 2 : 0;
  const pocketwatchDraw =
    combat.turn > 1 && hasRelic(state, 'pocketwatch') && (combat.cardsPlayedLastTurn ?? 0) <= 3
      ? 2
      : 0;
  const toolsDraw = state.player.statuses.toolsOfTheTrade ?? 0;
  const nextTurnDraw = state.player.statuses.drawCardNextTurn ?? 0;
  if (nextTurnDraw > 0) {
    delete state.player.statuses.drawCardNextTurn;
    pushCombatLog(combat, `【预谋抽牌】生效：额外抽 ${nextTurnDraw} 张牌。`, 'info');
  }
  if (pocketwatchDraw > 0) {
    pushCombatLog(
      combat,
      `遗物【${RELIC_LIBRARY.pocketwatch.name}】生效（上回合出牌 ≤ 3）：额外抽 2 张牌！`,
      'info'
    );
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
    pocketwatchDraw +
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
    if (hasRelic(state, 'ninja_scroll')) {
      addCardsToHand(state, 'shiv', 3, false);
      pushCombatLog(
        combat,
        `遗物【${RELIC_LIBRARY.ninja_scroll.name}】生效：将 3 张【小刀】加入手牌！`,
        'info'
      );
    }
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
    requestManualDiscard(state, toolsDraw, '必备工具', onVictoryCallback);
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
    hpLossCountThisCombat: 0,
    centennialUsed: false,
    activeBombs: [],
    playedAttackLastTurn: false,
    cardsPlayedLastTurn: 0,
    cardsPlayedThisTurn: 0,
    attacksPlayedThisTurn: 0,
    skillsPlayedThisTurn: 0,
    discardedThisTurn: 0,
    hoveringKiteUsedThisTurn: false,
    panacheCounter: 0,
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
  state.player.penNibActive = hasRelic(state, 'pen_nib') && (state.relicCounters?.pen_nib ?? 0) === 9;

  pushCombatLog(combat, `遭遇战斗：${encounter.name}！`, 'info');

  if (encounterRole === 'elite' && hasRelic(state, 'preserved_insect')) {
    for (const enemy of getAliveEnemies(combat)) {
      const reduced = Math.max(1, Math.floor(enemy.maxHp * 0.75));
      enemy.maxHp = reduced;
      enemy.hp = Math.min(enemy.hp, reduced);
    }
    pushCombatLog(
      combat,
      `遗物【${RELIC_LIBRARY.preserved_insect.name}】生效：精英敌人生命值降低 25%！`,
      'status'
    );
  }
  if (encounterRole === 'boss' && hasRelic(state, 'pantograph') && state.player.hp > 0) {
    const healed = healPlayerInCombat(state, 25);
    if (healed > 0) {
      pushCombatLog(
        combat,
        `遗物【${RELIC_LIBRARY.pantograph.name}】生效（首领战）：回复了 ${healed} 点生命！`,
        'victory'
      );
    }
  }
  if (hasRelic(state, 'blood_vial') && state.player.hp > 0) {
    const healed = healPlayerInCombat(state, 2);
    if (healed > 0) {
      pushCombatLog(combat, `遗物【${RELIC_LIBRARY.blood_vial.name}】回复了 ${healed} 点生命。`, 'info');
    }
  }
  if (hasRelic(state, 'bronze_scales')) {
    applyStatus(state.player, 'thorns', 3);
    pushCombatLog(combat, `遗物【${RELIC_LIBRARY.bronze_scales.name}】生效：获得 3 层【荆棘】。`, 'status');
  }
  if (hasRelic(state, 'thread_and_needle')) {
    applyStatus(state.player, 'platedArmor', 3);
    pushCombatLog(combat, `遗物【${RELIC_LIBRARY.thread_and_needle.name}】生效：获得 3 层【多层护甲】。`, 'block');
  }
  if (hasRelic(state, 'clockwork_souvenir')) {
    applyStatus(state.player, 'artifact', 1);
    pushCombatLog(combat, `遗物【${RELIC_LIBRARY.clockwork_souvenir.name}】生效：获得 1 层【人工制品】。`, 'status');
  }
  if (hasRelic(state, 'vajra')) {
    applyStatus(state.player, 'strength', 1);
    pushCombatLog(combat, `遗物【${RELIC_LIBRARY.vajra.name}】生效：获得 1 点力量。`, 'status');
  }
  if (hasRelic(state, 'girya') && (state.relicCounters?.girya ?? 0) > 0) {
    const lifts = state.relicCounters.girya;
    applyStatus(state.player, 'strength', lifts);
    pushCombatLog(
      combat,
      `遗物【${RELIC_LIBRARY.girya.name}】生效（已举重 ${lifts}/3 次）：获得 ${lifts} 点力量！`,
      'status'
    );
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
      if (applyStatus(enemy, 'vulnerable', 1)) {
        triggerChampionBeltIfVulnerable(state, enemy, 'vulnerable', 1);
      }
    }
    pushCombatLog(
      combat,
      `遗物【${RELIC_LIBRARY.bag_of_marbles.name}】生效：所有敌人获得 1 层【易伤】。`,
      'status'
    );
  }
  if (hasRelic(state, 'twisted_funnel')) {
    for (const enemy of getAliveEnemies(combat)) {
      applyPoisonToEnemy(state, enemy, 3);
    }
    pushCombatLog(
      combat,
      `遗物【${RELIC_LIBRARY.twisted_funnel.name}】生效：所有敌人获得 3 层【中毒】！`,
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

  const nextRestarts = (state.stats?.combatRestarts ?? 0) + 1;
  const snap = structuredClone(state.combatSnapshot);
  state.rngState = snap.rngState;
  state.nextUid = snap.nextUid;
  state.player = snap.player;
  state.combat = snap.combat;
  state.stats = snap.stats || {};
  state.stats.combatRestarts = nextRestarts;
  if (state.combatSnapshot.stats) {
    state.combatSnapshot.stats.combatRestarts = nextRestarts;
  }
  if (snap.relicCounters) state.relicCounters = snap.relicCounters;
  if (snap.relicFlags) state.relicFlags = snap.relicFlags;
  state.screen = 'combat';
  state.runOutcome = null;

  return { ok: true, combatRestarts: nextRestarts };
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
      reason: `受【天鹅绒颈圈】限制，每回合最多打出 ${VELVET_CHOKER_CARD_LIMIT} 张卡牌`,
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

  const effectiveCost = internalOpts.forceFree ? 0 : getEffectiveCardCost(stats, state.player, combat);
  const flatBonus = getCardAttackFlatBonus(stats, state.player, combat);
  const attacksBeforeThis = combat.attacksPlayedThisTurn ?? 0;
  const hadDiscardedBeforeThis = (combat.discardedThisTurn ?? 0) > 0;
  const prevCardType = combat.lastCardTypePlayed ?? null;
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
  const chemXBonus = stats.isXCost && hasRelic(state, 'chemical_x') ? 2 : 0;
  const effectiveX = energySpent + chemXBonus;
  const corruptionActive =
    stats.type === 'skill' && (state.player.statuses.corruption ?? 0) > 0;
  const burstStacks = state.player.statuses?.burst ?? 0;
  const burstActive = stats.type === 'skill' && !stats.noBurst && burstStacks > 0;
  const doubleTapStacks = state.player.statuses?.doubleTap ?? 0;
  const doubleTapActive = stats.type === 'attack' && doubleTapStacks > 0;
  const dupStacks = state.player.statuses?.duplication ?? 0;
  const dupActive = !stats.noBurst && dupStacks > 0;
  const repeatTimes = 1 + (burstActive ? 1 : 0) + (doubleTapActive ? 1 : 0) + (dupActive ? 1 : 0);

  // 1. Remove from hand before resolving effects (prevents self-draw and frees hand slot)
  combat.hand.splice(handIndex, 1);
  state.player.energy -= energySpent;
  if (usedFreeAttack) {
    state.player.statuses.freeAttackPower -= 1;
    if (state.player.statuses.freeAttackPower <= 0) {
      delete state.player.statuses.freeAttackPower;
    }
  }
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

  let totalManualDiscard = 0;
  let totalManualExhaust = 0;
  let totalManualUpgrade = 0;
  let totalScry = 0;
  let totalDrawAfterScry = 0;
  let totalDiscardToDraw = 0;
  let totalRetrieveDiscardRetain = 0;

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
        return { ok: true, outcome: state.combat?.status ?? combat.status };
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
          const healed = healPlayerInCombat(state, totalUnblocked);
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

    if (stats.copySelfToDiscard) {
      const copy = createCardInstance(state, cardInstance.cardId, cardInstance.upgraded);
      combat.discardPile.push(copy);
      pushCombatLog(combat, `将 1 张【${stats.name}】复制品放入弃牌堆。`, 'info');
    }

    // 5b. Watcher last-card-type chain bonuses (Crush Joints, Sash Whip, Follow-Up, Sanctity)
    if (stats.ifLastCardType && prevCardType === stats.ifLastCardType.type) {
      if (stats.ifLastCardType.applyEnemyStatuses && targetEnemy && targetEnemy.hp > 0) {
        for (const [sKey, sVal] of Object.entries(stats.ifLastCardType.applyEnemyStatuses)) {
          if (applyStatus(targetEnemy, sKey, sVal)) {
            const sMeta = STATUS_METADATA[sKey];
            pushCombatLog(
              combat,
              `【${stats.name}】连携触发：【${targetEnemy.name}】获得 ${sVal} 层【${sMeta?.name ?? sKey}】！`,
              'status'
            );
            triggerChampionBeltIfVulnerable(state, targetEnemy, sKey, sVal);
            if (sMeta?.polarity === 'debuff') {
              triggerSadisticNature(state, targetEnemy);
            }
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
          }
        }
        if (stats.xEnemyWeak && targetEnemy.hp > 0) {
          if (applyStatus(targetEnemy, 'weak', xVal)) {
            pushCombatLog(combat, `【${targetEnemy.name}】获得 ${xVal} 层【虚弱】。`, 'status');
            triggerSadisticNature(state, targetEnemy);
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

    // 7. Self status application, Limit Break, Stances & Mantra
    if (stats.applySelfStatuses) {
      for (const [statusKey, val] of Object.entries(stats.applySelfStatuses)) {
        const applied = applyStatus(state.player, statusKey, val);
        const statusName = STATUS_METADATA[statusKey]?.name ?? statusKey;
        if (!applied) {
          pushCombatLog(combat, `【人工制品】抵消了【${statusName}】！`, 'status');
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
        if (removed) toDiscard.push(removed);
      }
      if (toDiscard.length > 0) {
        discardCardsBatch(state, toDiscard, { manual: true });
      }
    }

    // 8b. Havoc: play top card of draw pile and exhaust it
    if (stats.playTopDrawAndExhaust && !internalOpts.fromHavoc && getAliveEnemies(combat).length > 0) {
      if (combat.drawPile.length === 0 && combat.discardPile.length > 0) {
        reshuffleDiscardIntoDraw(state);
      }
      const topCard = combat.drawPile.shift();
      if (topCard) {
        const topStats = getCardStats(topCard);
        if (topStats.unplayable && !(topStats.type === 'status' && hasRelic(state, 'medical_kit'))) {
          pushCombatLog(combat, `【${stats.name}】翻出不可打出的【${topStats.name}】并将其消耗。`, 'info');
          exhaustCardsBatch(state, [topCard]);
        } else {
          const aliveForHavoc = getAliveEnemies(combat);
          const havocTarget = topStats.target === 'enemy' ? pickRandom(state, aliveForHavoc) : null;
          combat.hand.push(topCard);
          pushCombatLog(combat, `【${stats.name}】触发：免费打出抽牌堆顶的【${topStats.name}】并将其消耗！`, 'card');
          playCard(state, topCard.instanceId, havocTarget?.id ?? null, onVictoryCallback, {
            forceFree: true,
            forceExhaust: true,
            fromHavoc: true,
          });
          if (combat.status !== 'ongoing' || state.player.hp <= 0) {
            return { ok: true, outcome: state.combat?.status ?? combat.status };
          }
        }
      }
    }

    // 9. Post-draw self statuses (e.g. Battle Trance noDraw)
    if (stats.applySelfStatusesAfter) {
      for (const [statusKey, val] of Object.entries(stats.applySelfStatusesAfter)) {
        applyStatus(state.player, statusKey, val);
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
        const loss = Math.min(chokedEnemy.hp, chokeDmg);
        chokedEnemy.hp = Math.max(0, chokedEnemy.hp - chokeDmg);
        if (state.stats && loss > 0) {
          state.stats.totalDamageDealt = (state.stats.totalDamageDealt ?? 0) + loss;
          state.stats.highestSingleHit = Math.max(state.stats.highestSingleHit ?? 0, loss);
        }
        pushCombatLog(combat, `【勒脖】触发：【${chokedEnemy.name}】失去 ${chokeDmg} 点生命！`, 'attack');
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

  if (stats.type === 'attack' || stats.type === 'skill' || stats.type === 'power') {
    combat.lastCardTypePlayed = stats.type;
  }

  // 11. Move card to final destination (before pendingCardChoice so deck cycle stays exact)
  if (stats.type === 'power' && !internalOpts.forceExhaust) {
    // Powers stay active on character and leave deck cycle for combat
  } else if (
    internalOpts.forceExhaust ||
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
    if (stats.extraTurn && getAliveEnemies(combat).length > 0 && state.player.hp > 0) {
      combat.extraTurnQueued = true;
      pushCombatLog(combat, `【${stats.name}】时空跃迁：抵消时间扭曲并跳过敌方回合，立即开启新回合！`, 'victory');
    }
    return endPlayerTurn(state, onVictoryCallback);
  }

  // 11b. Request interactive hand/draw/discard card choices (Discard / Exhaust / Upgrade / Scry / Discard-Pile)
  if (getAliveEnemies(combat).length > 0 && state.player.hp > 0) {
    if (totalManualDiscard > 0) {
      requestHandCardChoice(state, 'discard', totalManualDiscard, stats.name, onVictoryCallback);
    } else if (totalManualExhaust > 0) {
      requestHandCardChoice(state, 'exhaust', totalManualExhaust, stats.name, onVictoryCallback);
    } else if (totalManualUpgrade > 0) {
      requestHandCardChoice(state, 'upgrade', totalManualUpgrade, stats.name, onVictoryCallback);
    } else if (totalScry > 0) {
      initiateScry(state, totalScry, stats.name, { drawAfterScry: totalDrawAfterScry });
    } else if (totalDiscardToDraw > 0) {
      requestDiscardPileChoice(state, 'discard_to_draw', totalDiscardToDraw, stats.name, {
        excludeInstanceId: cardInstance.instanceId,
      });
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
        if (applyStatus(targetRes.enemy, sKey, val)) {
          const sMeta = STATUS_METADATA[sKey];
          const sName = sMeta?.name ?? sKey;
          pushCombatLog(combat, `【${targetRes.enemy.name}】获得 ${val} 层【${sName}】。`, 'status');
          triggerChampionBeltIfVulnerable(state, targetRes.enemy, sKey, val);
          if (sMeta?.polarity === 'debuff') {
            triggerSadisticNature(state, targetRes.enemy);
          }
        }
      }
    }
  }
  if (potion.scry && getAliveEnemies(combat).length > 0 && state.player.hp > 0) {
    initiateScry(state, potion.scry * mult, potion.name);
  }

  if (getAliveEnemies(combat).length === 0 && state.player.hp > 0) {
    finalizeCombatVictory(state, onVictoryCallback);
  }

  return { ok: true, outcome: state.combat?.status ?? combat.status };
}

export function endPlayerTurn(state, onVictoryCallback = null, options = {}) {
  const combat = state?.combat;
  if (!combat || state.screen !== 'combat' || combat.status !== 'ongoing' || combat.phase !== 'player') {
    return { ok: false, reason: '当前不能结束回合' };
  }
  if (hasPendingCardChoice(combat)) {
    return { ok: false, reason: `${getPendingChoiceBlockReason(combat)}再结束回合` };
  }

  const keepHandByPyramid = hasRelic(state, 'runic_pyramid');
  const wellLaidPlansQuota = keepHandByPyramid ? 0 : (state.player.statuses.wellLaidPlans ?? 0);
  if (
    !options.skipWellLaidPlansPrompt &&
    wellLaidPlansQuota > 0 &&
    getAliveEnemies(combat).length > 0 &&
    state.player.hp > 0
  ) {
    if (requestEndTurnRetainChoice(state, wellLaidPlansQuota, '计划妥当')) {
      return { ok: true, awaitingRetainChoice: true, outcome: state.combat?.status ?? combat.status };
    }
  }

  combat.phase = 'enemy';
  combat.playedAttackLastTurn = (combat.attacksPlayedThisTurn ?? 0) > 0;
  combat.cardsPlayedLastTurn = combat.cardsPlayedThisTurn ?? 0;
  delete state.player.statuses.noDraw;
  delete state.player.statuses.burst;
  delete state.player.statuses.doubleTap;
  delete state.player.statuses.duplication;
  delete state.player.statuses.waveOfTheHand;

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

  // 0. Temporary Strength & Dexterity decay (Flex / Duality / Speed & Flex Potions — Artifact blocks the decay!)
  if ((state.player.statuses.tempStrengthDown ?? 0) > 0) {
    const drop = state.player.statuses.tempStrengthDown;
    delete state.player.statuses.tempStrengthDown;
    if (applyStatus(state.player, 'strength', -drop)) {
      pushCombatLog(combat, `临时强化消退，失去 ${drop} 点力量。`, 'status');
    } else {
      pushCombatLog(combat, '【人工制品】抵消了临时力量消退，力量永久保留！', 'status');
    }
  }
  if ((state.player.statuses.tempDexterityDown ?? 0) > 0) {
    const dropDex = state.player.statuses.tempDexterityDown;
    delete state.player.statuses.tempDexterityDown;
    if (!applyStatus(state.player, 'dexterity', -dropDex)) {
      pushCombatLog(combat, '【人工制品】抵消了临时敏捷消退，敏捷永久保留！', 'status');
    }
  }

  // 1. Resolve end-of-turn hand curses/statuses (Burn, Regret, Doubt) + Constricted, then Ethereal / Retain / Discard
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
      if (applyStatus(state.player, 'weak', stats.endOfTurnWeak, { appliedDuringEnemyTurn: true })) {
        pushCombatLog(combat, `手牌【${stats.name}】使你获得 ${stats.endOfTurnWeak} 层【虚弱】。`, 'status');
      }
    }
  }

  if (state.player.hp > 0 && combat.status === 'ongoing' && (state.player.statuses.constricted ?? 0) > 0) {
    dealDamageToPlayer(state, state.player.statuses.constricted, '状态【缠绕】', {
      isAttack: false,
      fromCard: false,
    });
  }

  if (state.player.hp <= 0 || combat.status !== 'ongoing') {
    return { ok: true, outcome: state.combat?.status ?? combat.status };
  }

  const handCountBeforeDiscard = combat.hand.length;
  const establishmentDiscount = state.player.statuses.establishment ?? 0;
  const etherealToExhaust = [];
  const retainedHand = [];
  for (const cardInstance of combat.hand) {
    const stats = getCardStats(cardInstance);
    const keepByTempRetain = Boolean(cardInstance.tempRetainTurn);
    delete cardInstance.tempRetainTurn;
    if (stats.ethereal) {
      etherealToExhaust.push(cardInstance);
    } else if (stats.retain || keepHandByPyramid || keepByTempRetain) {
      retainedHand.push(cardInstance);
      if (stats.retainCostReduce) {
        cardInstance.retainedCostDiscount =
          (cardInstance.retainedCostDiscount ?? 0) + stats.retainCostReduce;
      }
      if (stats.retainScaleBlock) {
        cardInstance.combatBlockMod =
          (cardInstance.combatBlockMod ?? 0) + stats.retainScaleBlock;
      }
      if (stats.retainScaleDamage) {
        cardInstance.combatDamageMod =
          (cardInstance.combatDamageMod ?? 0) + stats.retainScaleDamage;
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

  // 2. End of turn relics & powers (Cloak Clasp, Orichalcum, Metallicize, Plated Armor, Like Water, Combust, The Bomb, Omega)
  if (hasRelic(state, 'cloak_clasp') && handCountBeforeDiscard > 0) {
    const claspBlock = Math.min(10, handCountBeforeDiscard * 2);
    addPlayerBlock(state, claspBlock);
    pushCombatLog(
      combat,
      `遗物【${RELIC_LIBRARY.cloak_clasp.name}】生效：回合结束剩余 ${handCountBeforeDiscard} 张手牌，获得 ${claspBlock} 点格挡！`,
      'block'
    );
  }
  if (hasRelic(state, 'orichalcum') && state.player.block === 0) {
    addPlayerBlock(state, 6);
    pushCombatLog(combat, `遗物【${RELIC_LIBRARY.orichalcum.name}】生效：获得 6 点格挡。`, 'block');
  }
  if ((state.player.statuses.metallicize ?? 0) > 0) {
    const m = state.player.statuses.metallicize;
    addPlayerBlock(state, m);
    pushCombatLog(combat, `【金属化】生效：获得 ${m} 点格挡。`, 'block');
  }
  if ((state.player.statuses.platedArmor ?? 0) > 0) {
    const pa = state.player.statuses.platedArmor;
    addPlayerBlock(state, pa);
    pushCombatLog(combat, `【多层护甲】生效：获得 ${pa} 点格挡。`, 'block');
  }
  if ((state.player.statuses.likeWater ?? 0) > 0 && combat.stance === 'calm') {
    const lw = state.player.statuses.likeWater;
    addPlayerBlock(state, lw);
    pushCombatLog(combat, `【如水】生效（平静姿态）：获得 ${lw} 点格挡！`, 'block');
  }
  if ((state.player.statuses.combust ?? 0) > 0 && state.player.hp > 0) {
    const combustDmg = state.player.statuses.combust;
    losePlayerHp(state, 1, '自燃', { fromCard: true });
    if (state.player.hp <= 0 || combat.status !== 'ongoing') {
      return { ok: true, outcome: state.combat?.status ?? combat.status };
    }
    const alive = getAliveEnemies(combat);
    if (alive.length > 0) {
      pushCombatLog(combat, `【自燃】爆发：对所有敌人造成 ${combustDmg} 点伤害！`, 'attack');
      for (const enemy of alive) {
        dealDamageToEnemy(state, enemy, combustDmg, { isAttack: false });
      }
    }
  }
  if (Array.isArray(combat.activeBombs) && combat.activeBombs.length > 0) {
    const remainingBombs = [];
    for (const bomb of combat.activeBombs) {
      bomb.turns -= 1;
      if (bomb.turns <= 0) {
        const alive = getAliveEnemies(combat);
        if (alive.length > 0) {
          pushCombatLog(combat, `【炸弹】轰然引爆：对所有敌人造成 ${bomb.damage} 点巨额伤害！`, 'attack');
          for (const enemy of alive) {
            dealDamageToEnemy(state, enemy, bomb.damage, { isAttack: false });
          }
        }
      } else {
        remainingBombs.push(bomb);
      }
    }
    combat.activeBombs = remainingBombs;
    if (remainingBombs.length > 0) {
      state.player.statuses.theBomb = Math.min(...remainingBombs.map((b) => b.turns));
    } else {
      delete state.player.statuses.theBomb;
    }
  }
  if ((state.player.statuses.omega ?? 0) > 0) {
    const omegaDmg = state.player.statuses.omega;
    const alive = getAliveEnemies(combat);
    if (alive.length > 0) {
      pushCombatLog(combat, `【欧米伽】降临：对所有敌人造成 ${omegaDmg} 点毁灭性伤害！`, 'attack');
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
    if (state.player.hp <= 0 || combat.status !== 'ongoing') break;
    if (enemy.hp <= 0) {
      if ((enemy.darklingRegrowTurns ?? 0) > 0 && getAliveEnemies(combat).length > 0) {
        enemy.darklingRegrowTurns -= 1;
        if (enemy.darklingRegrowTurns <= 0) {
          const reviveHp = Math.max(1, Math.floor(enemy.maxHp / 2));
          enemy.hp = reviveHp;
          enemy.darklingRegrowTurns = 0;
          enemy.turnIndex += 1;
          enemy.intent = rollEnemyIntent(state, enemy);
          pushCombatLog(
            combat,
            `【${enemy.name}】触发【暗影复苏】，以 ${reviveHp}/${enemy.maxHp} 生命重新复活！`,
            'status'
          );
        } else {
          enemy.intent = {
            id: 'reincarnate',
            name: '暗影复苏 (下回合复活)',
            type: 'buff',
            summary: `生命链接生效！下回合将恢复 ${Math.max(1, Math.floor(enemy.maxHp / 2))} 点生命复活！`,
          };
          pushCombatLog(
            combat,
            `【${enemy.name}】正在凝聚暗影，下回合即将复活！`,
            'status'
          );
        }
      }
      continue;
    }

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
            if (hpLost > 0 && intent.lifesteal && enemy.hp > 0) {
              const prevHp = enemy.hp;
              enemy.hp = Math.min(enemy.maxHp, enemy.hp + hpLost);
              const healed = enemy.hp - prevHp;
              if (healed > 0) {
                pushCombatLog(
                  combat,
                  `【${enemy.name}】吸血回复了 ${healed} 点生命（${enemy.hp}/${enemy.maxHp}）！`,
                  'status'
                );
              }
            }
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

        if (intent.addCurseToDeck && CARD_LIBRARY[intent.addCurseToDeck]) {
          enemy.implantUsed = true;
          const curseMaster = createCardInstance(state, intent.addCurseToDeck, false);
          state.player.deck.push(curseMaster);
          const curseCombat = createCardInstance(state, intent.addCurseToDeck, false);
          combat.discardPile.push(curseCombat);
          const cName = CARD_LIBRARY[intent.addCurseToDeck]?.name ?? intent.addCurseToDeck;
          if (hasRelic(state, 'darkstone_periapt')) {
            state.player.maxHp += 6;
            state.player.hp += 6;
            pushCombatLog(
              combat,
              `【${enemy.name}】将永久诅咒【${cName}】植入了你的牌组！（【黑石护符】触发：最大生命 +6）`,
              'status'
            );
          } else {
            pushCombatLog(
              combat,
              `【${enemy.name}】将永久诅咒【${cName}】植入了你的牌组与弃牌堆！`,
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
    if (enemy.hp > 0 && (enemy.statuses.platedArmor ?? 0) > 0) {
      const pa = enemy.statuses.platedArmor;
      enemy.block += pa;
      pushCombatLog(combat, `【${enemy.name}】的【多层护甲】生效，获得 ${pa} 点格挡。`, 'block');
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

    if ((enemy.tempStrengthRestore ?? 0) > 0) {
      const restore = enemy.tempStrengthRestore;
      enemy.tempStrengthRestore = 0;
      enemy.statuses.strength = (enemy.statuses.strength ?? 0) + restore;
      if (enemy.statuses.strength === 0) delete enemy.statuses.strength;
    }

    if (enemy.hp > 0 && (enemy.statuses?.fading ?? 0) > 0) {
      enemy.statuses.fading -= 1;
      if (enemy.statuses.fading <= 0) {
        delete enemy.statuses.fading;
        enemy.hp = 0;
        enemy.block = 0;
        enemy.intent = null;
        pushCombatLog(combat, `【消逝】倒计时归零，【${enemy.name}】化作虚无消散了！`, 'victory');
        continue;
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
    const healed = healPlayerInCombat(state, 12);
    if (healed > 0) {
      pushCombatLog(combat, `遗物【带骨肉】回复了 ${healed} 点生命。`, 'victory');
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
