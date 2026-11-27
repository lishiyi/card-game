/**
 * Reactive combat resolution: damage, block, poison, draw/discard/exhaust,
 * stances, mantra, scry, and interactive hand-card choice resolution.
 */

import {
  canUpgradeCard,
  createCardInstance,
  getCardStats,
  getEffectiveCardCost,
  getRewardCardPools,
  upgradeCardInstance,
} from '../../data/cards.js';
import { getGuardianDefensiveIntent, rollEnemyIntent } from '../../data/enemies.js';
import { RELIC_LIBRARY, STANCE_METADATA } from '../../data/relics.js';
import { pickRandom, randomInt } from '../rng.js';
import {
  MAX_HAND_SIZE,
  VALID_STANCES,
  pushCardReveal,
  hasRelic,
  getAliveEnemies,
  pushCombatLog,
  applyStatus,
  addCardsToHand,
  syncRedSkullStatus,
  handleEnemyZeroHp,
  pruneDefeatedEnemies,
  handleMinionsFleeIfLeaderDead,
  reshuffleDiscardIntoDraw,
  applyEnemyInvincibleCap,
  checkSlimeSplitTrigger,
  setPendingCardChoice,
  hasPendingCardChoice,
  getActivePendingCardChoice,
  invokePlayCard,
  returnDiscardCardsByFlag,
  togglePendingCardChoice,
  handleCombatDefeat,
  finalizeCombatVictory,
} from './state.js';

export function addPlayerBlock(state, amount) {
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
        let appliedCount = 0;
        for (const enemy of alive) {
          if (enemy.hp <= 0) continue;
          if (applyStatus(enemy, 'weak', waveWeak)) {
            appliedCount += 1;
            triggerSadisticNature(state, enemy);
          } else {
            pushCombatLog(combat, `【${enemy.name}】的【人工制品】抵消了【摆手】的【虚弱】！`, 'status');
          }
        }
        if (appliedCount > 0) {
          pushCombatLog(combat, `【摆手】触发：给予敌人 ${waveWeak} 层【虚弱】！`, 'status');
        }
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
            `【势不可当】触发：获得格挡并对【${recipient.name}】造成 ${juggDmg} 点伤害！`,
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

export function triggerSadisticNature(state, enemy) {
  const combat = state?.combat;
  const dmg = state?.player?.statuses?.sadisticNature ?? 0;
  if (!combat || !enemy || enemy.hp <= 0 || dmg <= 0) return;
  pushCombatLog(combat, `【残虐天性】触发：对【${enemy.name}】造成 ${dmg} 点伤害！`, 'attack');
  dealDamageToEnemy(state, enemy, dmg, { isAttack: false });
}

export function triggerChampionBeltIfVulnerable(state, enemy, statusKey, delta) {
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
    } else {
      pushCombatLog(
        state.combat,
        `【${enemy.name}】的【人工制品】抵消了【${RELIC_LIBRARY.champion_belt.name}】的【虚弱】！`,
        'status'
      );
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

export function handleEnemyDeathPassives(state, deadEnemy) {
  const combat = state?.combat;
  if (!combat || !deadEnemy || deadEnemy._deathHandled) return;
  deadEnemy._deathHandled = true;
  combat.defeatedEnemiesCount = (combat.defeatedEnemiesCount ?? 0) + 1;

  if (deadEnemy.stasisCard) {
    const returnedCard = deadEnemy.stasisCard;
    deadEnemy.stasisCard = null;
    if (deadEnemy.statuses) {
      delete deadEnemy.statuses.stasis;
    }
    const cardName = getCardStats(returnedCard)?.name || returnedCard.cardId;
    if (combat.hand.length < MAX_HAND_SIZE) {
      combat.hand.push(returnedCard);
      pushCombatLog(
        combat,
        `【${deadEnemy.name}】被摧毁，被封印的【${cardName}】已归还至你的手牌！`,
        'status'
      );
    } else {
      combat.discardPile.push(returnedCard);
      pushCombatLog(
        combat,
        `【${deadEnemy.name}】被摧毁，手牌已满，被封印的【${cardName}】已归还至你的弃牌堆！`,
        'status'
      );
    }
  }

  if ((state.player?.statuses?.surrounded ?? 0) > 0 && getAliveEnemies(combat).length <= 1) {
    delete state.player.statuses.surrounded;
    for (const e of combat.enemies || []) {
      e.backAttack = false;
    }
    pushCombatLog(combat, '敌方夹击阵型已破，【夹击】状态解除！', 'status');
  }

  if ((deadEnemy.statuses?.sporeCloud ?? 0) > 0) {
    const spores = deadEnemy.statuses.sporeCloud;
    if (
      applyStatus(state.player, 'vulnerable', spores, {
        appliedDuringEnemyTurn: combat.phase === 'enemy',
      })
    ) {
      pushCombatLog(
        combat,
        `【${deadEnemy.name}】的【孢子云】爆裂，使你获得 ${spores} 层【易伤】！`,
        'status'
      );
    } else {
      pushCombatLog(combat, `【人工制品】抵消了【${deadEnemy.name}】孢子云的【易伤】！`, 'status');
    }
  }

  // The Specimen: transfer remaining poison to a random alive enemy
  const remPoison = deadEnemy.statuses?.poison ?? 0;
  if (remPoison > 0 && hasRelic(state, 'the_specimen')) {
    const alive = getAliveEnemies(combat);
    const recipient = pickRandom(state, alive);
    if (recipient) {
      if (applyStatus(recipient, 'poison', remPoison)) {
        pushCombatLog(
          combat,
          `遗物【${RELIC_LIBRARY.the_specimen.name}】生效：将 ${remPoison} 层【中毒】转移给【${recipient.name}】！`,
          'status'
        );
      } else {
        pushCombatLog(
          combat,
          `【${recipient.name}】的【人工制品】抵消了【${RELIC_LIBRARY.the_specimen.name}】转移的【中毒】！`,
          'status'
        );
      }
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

  // Minions flee immediately once all non-minion bosses/leaders have fallen
  handleMinionsFleeIfLeaderDead(state);

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

  // Clear permanently defeated / fled enemies off the battlefield (keep regrowing Darklings)
  pruneDefeatedEnemies(combat);
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

    if (drawnStats.onDrawLoseEnergy) {
      const lost = Math.min(state.player.energy, drawnStats.onDrawLoseEnergy);
      state.player.energy = Math.max(0, state.player.energy - drawnStats.onDrawLoseEnergy);
      pushCombatLog(
        combat,
        `抽到【${drawnStats.name}】：能量被虚空吞噬${lost > 0 ? `，失去 ${lost} 点能量` : '（当前能量已为 0）'}！`,
        'status'
      );
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

    // Endless Agony: whenever drawn, add a copy to hand (respecting hand limit)
    if (drawnStats.copyOnDraw && combat.hand.length < MAX_HAND_SIZE) {
      const copy = createCardInstance(state, nextCard.cardId, nextCard.upgraded);
      combat.hand.push(copy);
      pushCombatLog(combat, `【${drawnStats.name}】复制增殖：额外将 1 张【${drawnStats.name}】加入手牌！`, 'info');
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
    gainMantra(state, 2);
    pushCombatLog(
      combat,
      `遗物【${RELIC_LIBRARY.melange.name}】触发：获得 2 点【真言】！`,
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
  const rawHpLoss = amount - blocked;
  const hpLoss = applyEnemyInvincibleCap(combat, enemy, rawHpLoss);

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

  checkSlimeSplitTrigger(combat, enemy);

  return hpLoss;
}

export function handlePlayerHpLostTriggers(state, { isAttack = false } = {}) {
  const combat = state?.combat;
  if (!combat || combat.status !== 'ongoing') return;
  combat.hpLossCountThisCombat = (combat.hpLossCountThisCombat ?? 0) + 1;
  combat.lostHpThisTurn = true;

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

function computeRecycleEnergy(state, cardInstance) {
  if (!state || !cardInstance) return 0;
  const stats = getCardStats(cardInstance);
  if (stats.isXCost) {
    return Math.max(0, state.player.energy ?? 0);
  }
  const effCost = getEffectiveCardCost(stats, state.player, state.combat);
  return typeof effCost === 'number' && effCost > 0 ? effCost : 0;
}

export function requestHandCardChoice(
  state,
  mode,
  count,
  sourceName = '选牌',
  onVictoryCallback = null,
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
    const drawAfter = Math.max(0, options.drawAfterExhaust ?? 0);
    if (combat.hand.length === 0) {
      if (drawAfter > 0) drawCards(state, drawAfter);
      return;
    }
    if (combat.hand.length <= count) {
      const allHand = [...combat.hand];
      combat.hand = [];
      if (options.grantEnergyFromCost) {
        for (const c of allHand) {
          const gained = computeRecycleEnergy(state, c);
          if (gained > 0) {
            state.player.energy += gained;
            pushCombatLog(
              combat,
              `【${sourceName}】回收【${getCardStats(c).name}】，获得 ${gained} 点能量！`,
              'info'
            );
          }
        }
      }
      exhaustCardsBatch(state, allHand);
      if (drawAfter > 0 && getAliveEnemies(combat).length > 0 && state.player.hp > 0) {
        drawCards(state, drawAfter);
      }
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
      grantEnergyFromCost: Boolean(options.grantEnergyFromCost),
      drawAfterExhaust: drawAfter,
    });
    return;
  }

  if (mode === 'exhaust_multi') {
    if (combat.hand.length === 0) return;
    const maxPick = Math.min(count, combat.hand.length);
    setPendingCardChoice(combat, {
      mode: 'exhaust_multi',
      sourceName,
      count: maxPick,
      remaining: maxPick,
      optional: true,
      candidates: [...combat.hand],
      selectedIds: [],
    });
    return;
  }

  if (mode === 'hand_to_draw' || mode === 'hand_to_draw_bottom') {
    if (combat.hand.length === 0) return;
    const isBottom = mode === 'hand_to_draw_bottom';
    const zeroCostUntilPlayed = Boolean(options.zeroCostUntilPlayed);
    if (combat.hand.length <= count) {
      const allHand = [...combat.hand];
      combat.hand = [];
      for (const c of allHand) {
        if (zeroCostUntilPlayed && !getCardStats(c).isXCost && !getCardStats(c).unplayable) {
          c.zeroCostUntilPlayed = true;
        }
        if (isBottom) combat.drawPile.push(c);
        else combat.drawPile.unshift(c);
        pushCombatLog(
          combat,
          `【${sourceName}】将【${getCardStats(c).name}】置于抽牌堆${isBottom ? '底' : '顶'}${zeroCostUntilPlayed ? '（打出前 0 费）' : ''}！`,
          'info'
        );
      }
      return;
    }
    setPendingCardChoice(combat, {
      mode,
      sourceName,
      count,
      remaining: count,
      optional: false,
      zeroCostUntilPlayed,
      candidates: null,
      selectedIds: [],
    });
    return;
  }

  if (mode === 'hand_to_draw_bottom_multi') {
    if (combat.hand.length === 0) return;
    setPendingCardChoice(combat, {
      mode: 'hand_to_draw_bottom_multi',
      sourceName,
      count: combat.hand.length,
      remaining: combat.hand.length,
      optional: true,
      zeroCostUntilPlayed: Boolean(options.zeroCostUntilPlayed),
      candidates: [...combat.hand],
      selectedIds: [],
    });
    return;
  }

  if (mode === 'dual_wield') {
    const eligible = combat.hand.filter((hc) => {
      const t = getCardStats(hc).type;
      return t === 'attack' || t === 'power';
    });
    if (eligible.length === 0) {
      pushCombatLog(combat, `【${sourceName}】生效，但当前手牌中没有攻击牌或能力牌可复制。`, 'info');
      return;
    }
    const copies = Math.max(1, options.copies ?? count ?? 1);
    if (eligible.length === 1) {
      const target = eligible[0];
      let addedCount = 0;
      for (let i = 0; i < copies; i += 1) {
        if (combat.hand.length >= MAX_HAND_SIZE) break;
        const copy = createCardInstance(state, target.cardId, target.upgraded);
        if (Number.isInteger(target.upgradeLevel)) copy.upgradeLevel = target.upgradeLevel;
        if (typeof target.combatCost === 'number') copy.combatCost = target.combatCost;
        if (typeof target.combatDamageMod === 'number') copy.combatDamageMod = target.combatDamageMod;
        if (typeof target.combatBlockMod === 'number') copy.combatBlockMod = target.combatBlockMod;
        if (typeof target.ritualBonus === 'number') copy.ritualBonus = target.ritualBonus;
        if (typeof target.expungerHits === 'number') copy.expungerHits = target.expungerHits;
        if (target.zeroCostUntilPlayed) copy.zeroCostUntilPlayed = true;
        combat.hand.push(copy);
        addedCount += 1;
      }
      pushCombatLog(
        combat,
        `【${sourceName}】复制了【${getCardStats(target).name}】，将 ${addedCount} 张复制品加入手牌！`,
        'info'
      );
      return;
    }
    setPendingCardChoice(combat, {
      mode: 'dual_wield',
      sourceName,
      count: 1,
      remaining: 1,
      copies,
      optional: false,
      candidates: [...eligible],
      selectedIds: [],
    });
    return;
  }

  if (mode === 'nightmare') {
    if (combat.hand.length === 0) {
      pushCombatLog(combat, `【${sourceName}】生效，但手牌为空，没有可复制的卡牌。`, 'info');
      return;
    }
    const copies = Math.max(1, options.copies ?? count ?? 3);
    if (combat.hand.length === 1) {
      const target = combat.hand[0];
      if (!Array.isArray(combat.nightmareQueue)) combat.nightmareQueue = [];
      combat.nightmareQueue.push({
        cardId: target.cardId,
        upgraded: Boolean(target.upgraded),
        upgradeLevel: Number.isInteger(target.upgradeLevel) ? target.upgradeLevel : undefined,
        expungerHits: typeof target.expungerHits === 'number' ? target.expungerHits : undefined,
        ritualBonus: typeof target.ritualBonus === 'number' ? target.ritualBonus : undefined,
        count: copies,
      });
      applyStatus(state.player, 'nightmare', copies);
      pushCombatLog(
        combat,
        `【${sourceName}】锁定【${getCardStats(target).name}】：下回合开始时将获得 ${copies} 张复制品！`,
        'status'
      );
      return;
    }
    setPendingCardChoice(combat, {
      mode: 'nightmare',
      sourceName,
      count: 1,
      remaining: 1,
      copies,
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
        upgradeCardInstance(hc);
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

export function requestManualDiscard(state, count, sourceName = '弃牌', onVictoryCallback = null) {
  requestHandCardChoice(state, 'discard', count, sourceName, onVictoryCallback);
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
    pending.mode === 'retain' ||
    pending.mode === 'exhaust_multi' ||
    pending.mode === 'hand_to_draw_bottom_multi'
  ) {
    return togglePendingCardChoice(state, instanceId);
  }

  if (pending.mode === 'wish') {
    const picked = (pending.candidates || []).find((c) => c.instanceId === instanceId);
    if (!picked) {
      return { ok: false, reason: '无效的愿望选项' };
    }
    const sourceName = pending.sourceName || '许愿';
    setPendingCardChoice(combat, null);
    if (picked.wishKey === 'platedArmor') {
      applyStatus(state.player, 'platedArmor', picked.value);
      pushCombatLog(combat, `【${sourceName}】选择「活命」：获得 ${picked.value} 层【多层护甲】！`, 'block');
    } else if (picked.wishKey === 'strength') {
      applyStatus(state.player, 'strength', picked.value);
      pushCombatLog(combat, `【${sourceName}】选择「成名」：获得 ${picked.value} 点【力量】！`, 'status');
    } else if (picked.wishKey === 'gold') {
      state.player.gold = (state.player.gold ?? 0) + picked.value;
      if (state.stats) state.stats.goldEarned = (state.stats.goldEarned ?? 0) + picked.value;
      pushCombatLog(combat, `【${sourceName}】选择「暴富」：立即获得 ${picked.value} 金币！`, 'victory');
    }
    return {
      ok: true,
      mode: 'wish',
      wishKey: picked.wishKey,
      outcome: state.combat?.status ?? combat.status,
      remaining: 0,
    };
  }

  if (pending.mode === 'discover_card') {
    const picked = (pending.candidates || []).find((c) => c.instanceId === instanceId);
    if (!picked) {
      return { ok: false, reason: '未在候选卡牌中找到该卡牌' };
    }
    const sourceName = pending.sourceName || '发现';
    setPendingCardChoice(combat, null);
    const pName = getCardStats(picked).name;
    if (combat.hand.length < MAX_HAND_SIZE) {
      combat.hand.push(picked);
      pushCombatLog(
        combat,
        `【${sourceName}】选择了【${pName}】加入手牌${pending.tempZeroCostTurn ? '（本回合 0 费）' : ''}！`,
        'info'
      );
    } else {
      combat.discardPile.push(picked);
      pushCombatLog(combat, `【${sourceName}】选择了【${pName}】（手牌已满，放入弃牌堆）。`, 'info');
    }
    return {
      ok: true,
      mode: 'discover_card',
      outcome: state.combat?.status ?? combat.status,
      remaining: 0,
    };
  }

  if (pending.mode === 'retrieve_exhaust_to_hand') {
    const valid = (pending.candidates || []).some((c) => c.instanceId === instanceId);
    const eIdx = combat.exhaustPile.findIndex((c) => c.instanceId === instanceId);
    if (!valid || eIdx === -1) {
      return { ok: false, reason: '未在消耗堆中找到该卡牌' };
    }
    const [card] = combat.exhaustPile.splice(eIdx, 1);
    if (combat.hand.length < MAX_HAND_SIZE) {
      combat.hand.push(card);
    }
    pending.candidates = (pending.candidates || []).filter((c) => c.instanceId !== instanceId);
    pending.remaining = Math.max(0, (pending.remaining ?? 1) - 1);
    pushCombatLog(
      combat,
      `【${pending.sourceName}】从消耗堆发掘【${getCardStats(card).name}】加入手牌！`,
      'info'
    );
    if (
      pending.remaining <= 0 ||
      pending.candidates.length === 0 ||
      combat.hand.length >= MAX_HAND_SIZE
    ) {
      setPendingCardChoice(combat, null);
    }
    return {
      ok: true,
      mode: 'retrieve_exhaust_to_hand',
      outcome: state.combat?.status ?? combat.status,
      remaining: combat.pendingCardChoice?.remaining ?? 0,
    };
  }

  if (pending.mode === 'omniscience') {
    const valid = (pending.candidates || []).some((c) => c.instanceId === instanceId);
    const dIdx = combat.drawPile.findIndex((c) => c.instanceId === instanceId);
    if (!valid || dIdx === -1) {
      return { ok: false, reason: '未在抽牌堆中找到该卡牌' };
    }
    const sourceName = pending.sourceName || '通晓万物';
    const [card] = combat.drawPile.splice(dIdx, 1);
    setPendingCardChoice(combat, null);
    const cStats = getCardStats(card);
    if (cStats.unplayable) {
      exhaustCardsBatch(state, [card]);
      pushCombatLog(combat, `【${sourceName}】选中不可打出的【${cStats.name}】，已直接消耗。`, 'info');
    } else {
      const alive = getAliveEnemies(combat);
      const targetEnemy = cStats.target === 'enemy' ? pickRandom(state, alive) : null;
      const willExhaust = cStats.type !== 'power';
      combat.hand.push(card);
      pushCombatLog(
        combat,
        `【${sourceName}】发动：免费连续打出【${cStats.name}】2 次${willExhaust ? '并将其消耗' : ''}！`,
        'card'
      );
      pushCardReveal(combat, {
        sourceName,
        kind: 'auto_play',
        card,
        targetName: targetEnemy?.name || null,
        exhausted: willExhaust,
        summary: `${sourceName}连续打出【${cStats.name}】×2`,
      });
      invokePlayCard(state, card.instanceId, targetEnemy?.id ?? null, onVictoryCallback, {
        forceFree: true,
        forceExhaust: willExhaust,
        forceRepeatCount: 2,
        fromHavoc: true,
      });
    }
    return {
      ok: true,
      mode: 'omniscience',
      outcome: state.combat?.status ?? combat.status,
      remaining: combat.pendingCardChoice?.remaining ?? 0,
      cardReveals: [...(combat.pendingCardReveals || [])],
    };
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

  if (pending.mode === 'retrieve_discard_to_hand') {
    const valid = (pending.candidates || []).some((c) => c.instanceId === instanceId);
    const dIdx = combat.discardPile.findIndex((c) => c.instanceId === instanceId);
    if (!valid || dIdx === -1) {
      return { ok: false, reason: '未在弃牌堆中找到该卡牌' };
    }
    const [card] = combat.discardPile.splice(dIdx, 1);
    if (combat.hand.length < MAX_HAND_SIZE) {
      combat.hand.push(card);
    }
    pending.candidates = (pending.candidates || []).filter((c) => c.instanceId !== instanceId);
    pending.remaining = Math.max(0, (pending.remaining ?? 1) - 1);
    pushCombatLog(
      combat,
      `【${pending.sourceName}】从弃牌堆取回【${getCardStats(card).name}】加入手牌！`,
      'info'
    );
    if (
      pending.remaining <= 0 ||
      pending.candidates.length === 0 ||
      combat.hand.length >= MAX_HAND_SIZE
    ) {
      setPendingCardChoice(combat, null);
    }
    return {
      ok: true,
      mode: 'retrieve_discard_to_hand',
      outcome: state.combat?.status ?? combat.status,
      remaining: combat.pendingCardChoice?.remaining ?? 0,
    };
  }

  if (pending.mode === 'pick_from_draw') {
    const valid = (pending.candidates || []).some((c) => c.instanceId === instanceId);
    const dIdx = combat.drawPile.findIndex((c) => c.instanceId === instanceId);
    if (!valid || dIdx === -1) {
      return { ok: false, reason: '未在抽牌堆中找到该卡牌' };
    }
    const [card] = combat.drawPile.splice(dIdx, 1);
    if (combat.hand.length < MAX_HAND_SIZE) {
      combat.hand.push(card);
    }
    pending.candidates = (pending.candidates || []).filter((c) => c.instanceId !== instanceId);
    pending.remaining = Math.max(0, (pending.remaining ?? 1) - 1);
    pushCombatLog(
      combat,
      `【${pending.sourceName}】从抽牌堆检索【${getCardStats(card).name}】加入手牌！`,
      'info'
    );
    if (
      pending.remaining <= 0 ||
      pending.candidates.length === 0 ||
      combat.hand.length >= MAX_HAND_SIZE
    ) {
      setPendingCardChoice(combat, null);
    }
    return {
      ok: true,
      mode: 'pick_from_draw',
      outcome: state.combat?.status ?? combat.status,
      remaining: combat.pendingCardChoice?.remaining ?? 0,
    };
  }

  const idx = combat.hand.findIndex((c) => c.instanceId === instanceId);
  if (idx === -1) {
    return { ok: false, reason: '未在手牌中找到该卡牌' };
  }

  if (pending.mode === 'dual_wield') {
    const card = combat.hand[idx];
    const cStats = getCardStats(card);
    if (cStats.type !== 'attack' && cStats.type !== 'power') {
      return { ok: false, reason: '【双持】只能选择攻击牌或能力牌' };
    }
    const copies = Math.max(1, pending.copies ?? 1);
    const sourceName = pending.sourceName || '双持';
    setPendingCardChoice(combat, null);
    let addedCount = 0;
    for (let i = 0; i < copies; i += 1) {
      if (combat.hand.length >= MAX_HAND_SIZE) break;
      const copy = createCardInstance(state, card.cardId, card.upgraded);
      if (Number.isInteger(card.upgradeLevel)) copy.upgradeLevel = card.upgradeLevel;
      if (typeof card.combatCost === 'number') copy.combatCost = card.combatCost;
      if (typeof card.combatDamageMod === 'number') copy.combatDamageMod = card.combatDamageMod;
      if (typeof card.combatBlockMod === 'number') copy.combatBlockMod = card.combatBlockMod;
      if (typeof card.ritualBonus === 'number') copy.ritualBonus = card.ritualBonus;
      if (typeof card.expungerHits === 'number') copy.expungerHits = card.expungerHits;
      if (card.zeroCostUntilPlayed) copy.zeroCostUntilPlayed = true;
      combat.hand.push(copy);
      addedCount += 1;
    }
    pushCombatLog(combat, `【${sourceName}】复制了【${cStats.name}】，将 ${addedCount} 张复制品加入手牌！`, 'info');
    return {
      ok: true,
      mode: 'dual_wield',
      outcome: state.combat?.status ?? combat.status,
      remaining: 0,
    };
  }

  if (pending.mode === 'nightmare') {
    const card = combat.hand[idx];
    const copies = Math.max(1, pending.copies ?? 3);
    const sourceName = pending.sourceName || '夜魇';
    setPendingCardChoice(combat, null);
    if (!Array.isArray(combat.nightmareQueue)) combat.nightmareQueue = [];
    combat.nightmareQueue.push({
      cardId: card.cardId,
      upgraded: Boolean(card.upgraded),
      upgradeLevel: Number.isInteger(card.upgradeLevel) ? card.upgradeLevel : undefined,
      expungerHits: typeof card.expungerHits === 'number' ? card.expungerHits : undefined,
      ritualBonus: typeof card.ritualBonus === 'number' ? card.ritualBonus : undefined,
      count: copies,
    });
    applyStatus(state.player, 'nightmare', copies);
    pushCombatLog(
      combat,
      `【${sourceName}】锁定【${getCardStats(card).name}】：下回合开始时将获得 ${copies} 张复制品！`,
      'status'
    );
    return {
      ok: true,
      mode: 'nightmare',
      outcome: state.combat?.status ?? combat.status,
      remaining: 0,
    };
  }

  if (pending.mode === 'upgrade') {
    const card = combat.hand[idx];
    if (!canUpgradeCard(card)) {
      return { ok: false, reason: '该卡牌已达满级或无法升级' };
    }
    upgradeCardInstance(card);
    pushCombatLog(combat, `【${pending.sourceName}】临时升级了【${getCardStats(card).name}】！`, 'info');

    pending.remaining = Math.max(0, (pending.remaining ?? 1) - 1);
    const remainingUpgradable = combat.hand.filter((hc) => canUpgradeCard(hc));
    if (pending.remaining <= 0 || remainingUpgradable.length === 0) {
      setPendingCardChoice(combat, null);
    } else if (remainingUpgradable.length <= pending.remaining) {
      for (const hc of remainingUpgradable) {
        upgradeCardInstance(hc);
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
    combat.pendingCardReveals = [];
    const grantEnergy = Boolean(pending.grantEnergyFromCost);
    const drawAfter = Math.max(0, pending.drawAfterExhaust ?? 0);
    const sourceName = pending.sourceName || '消耗';
    const [card] = combat.hand.splice(idx, 1);
    pending.remaining = Math.max(0, (pending.remaining ?? 1) - 1);
    const choiceDoneNow = pending.remaining <= 0;
    if (choiceDoneNow) {
      setPendingCardChoice(combat, null);
    }

    if (grantEnergy) {
      const gained = computeRecycleEnergy(state, card);
      if (gained > 0) {
        state.player.energy += gained;
        pushCombatLog(
          combat,
          `【${sourceName}】回收【${getCardStats(card).name}】，获得 ${gained} 点能量！`,
          'info'
        );
      }
    }

    exhaustCardsBatch(state, [card]);

    if (getAliveEnemies(combat).length === 0 && state.player.hp > 0) {
      setPendingCardChoice(combat, null);
      finalizeCombatVictory(state, onVictoryCallback);
      return {
        ok: true,
        mode: 'exhaust',
        outcome: state.combat?.status ?? combat.status,
        remaining: 0,
        cardReveals: [...(combat.pendingCardReveals || [])],
      };
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
      if (grantEnergy) {
        for (const c of rest) {
          const gained = computeRecycleEnergy(state, c);
          if (gained > 0) {
            state.player.energy += gained;
            pushCombatLog(
              combat,
              `【${sourceName}】回收【${getCardStats(c).name}】，获得 ${gained} 点能量！`,
              'info'
            );
          }
        }
      }
      exhaustCardsBatch(state, rest);
      if (getAliveEnemies(combat).length === 0 && state.player.hp > 0) {
        finalizeCombatVictory(state, onVictoryCallback);
      }
    }

    if (
      drawAfter > 0 &&
      !combat.pendingCardChoice &&
      getAliveEnemies(combat).length > 0 &&
      state.player.hp > 0
    ) {
      drawCards(state, drawAfter);
    }

    return {
      ok: true,
      mode: 'exhaust',
      outcome: state.combat?.status ?? combat.status,
      remaining: combat.pendingCardChoice?.remaining ?? 0,
      cardReveals: [...(combat.pendingCardReveals || [])],
    };
  }

  if (pending.mode === 'hand_to_draw' || pending.mode === 'hand_to_draw_bottom') {
    const isBottom = pending.mode === 'hand_to_draw_bottom';
    const zeroCost = Boolean(pending.zeroCostUntilPlayed);
    const sourceName = pending.sourceName || (isBottom ? '预谋' : '战吼');
    const [card] = combat.hand.splice(idx, 1);
    if (zeroCost && !getCardStats(card).isXCost && !getCardStats(card).unplayable) {
      card.zeroCostUntilPlayed = true;
    }
    if (isBottom) combat.drawPile.push(card);
    else combat.drawPile.unshift(card);
    pushCombatLog(
      combat,
      `【${sourceName}】将【${getCardStats(card).name}】置于抽牌堆${isBottom ? '底' : '顶'}${zeroCost ? '（打出前 0 费）' : ''}！`,
      'info'
    );
    pending.remaining = Math.max(0, (pending.remaining ?? 1) - 1);
    if (pending.remaining <= 0 || combat.hand.length === 0) {
      setPendingCardChoice(combat, null);
    } else if (combat.hand.length <= pending.remaining) {
      const rest = [...combat.hand];
      combat.hand = [];
      setPendingCardChoice(combat, null);
      for (const c of rest) {
        if (zeroCost && !getCardStats(c).isXCost && !getCardStats(c).unplayable) {
          c.zeroCostUntilPlayed = true;
        }
        if (isBottom) combat.drawPile.push(c);
        else combat.drawPile.unshift(c);
        pushCombatLog(
          combat,
          `【${sourceName}】将【${getCardStats(c).name}】置于抽牌堆${isBottom ? '底' : '顶'}${zeroCost ? '（打出前 0 费）' : ''}！`,
          'info'
        );
      }
    }
    return {
      ok: true,
      mode: pending.mode,
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
  const returnToHandAfter = [];
  for (const c of valid) {
    combat.exhaustPile.push(c);
    const cStats = getCardStats(c);
    pushCombatLog(combat, `【${cStats.name}】已消耗。`, 'info');
    if (cStats.onExhaustGainEnergy) {
      sentinelEnergy += cStats.onExhaustGainEnergy;
    }
    if (cStats.returnOnExhaust) {
      returnToHandAfter.push(c.cardId);
    }
  }

  for (const returnCardId of returnToHandAfter) {
    const reborn = createCardInstance(state, returnCardId, false);
    if (combat.hand.length < MAX_HAND_SIZE) {
      combat.hand.push(reborn);
    } else {
      combat.discardPile.push(reborn);
    }
    pushCombatLog(
      combat,
      `【${getCardStats(reborn).name}】不灭诅咒回响：重新回到你的手中！`,
      'status'
    );
  }

  if (sentinelEnergy > 0 && combat.status === 'ongoing') {
    state.player.energy += sentinelEnergy;
    pushCombatLog(combat, `【哨卫】被消耗，立即获得 ${sentinelEnergy} 点能量！`, 'info');
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
    const generatedNames = [];
    for (let i = 0; i < count; i += 1) {
      const randId = pickRandom(state, allClassCards);
      if (randId) {
        const created = addCardsToHand(state, randId, 1, false);
        const genCard = created[0];
        if (genCard) {
          const gName = getCardStats(genCard).name;
          generatedNames.push(`【${gName}】`);
          pushCardReveal(combat, {
            sourceName: RELIC_LIBRARY.dead_branch.name,
            kind: 'random_generate',
            card: genCard,
            summary: `${RELIC_LIBRARY.dead_branch.name}生成【${gName}】`,
          });
        }
      }
    }
    pushCombatLog(
      combat,
      generatedNames.length > 0
        ? `遗物【${RELIC_LIBRARY.dead_branch.name}】触发：生成了 ${generatedNames.join('、')}！`
        : `遗物【${RELIC_LIBRARY.dead_branch.name}】触发：生成了 ${count} 张随机职业卡牌！`,
      'info'
    );
  }

  return count;
}
