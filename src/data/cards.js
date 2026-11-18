import { calculateAttackDamage, calculateCardBlock } from '../engine/math.js';

function deepFreeze(obj) {
  if (obj && typeof obj === 'object' && !Object.isFrozen(obj)) {
    Object.freeze(obj);
    for (const value of Object.values(obj)) {
      deepFreeze(value);
    }
  }
  return obj;
}

export const CARD_LIBRARY = deepFreeze({
  // === Starter Cards ===
  strike: {
    id: 'strike',
    name: '打击',
    type: 'attack',
    rarity: 'starter',
    target: 'enemy',
    price: 45,
    base: { cost: 1, damage: 6, hits: 1 },
    upgraded: { cost: 1, damage: 9, hits: 1 },
  },
  defend: {
    id: 'defend',
    name: '防御',
    type: 'skill',
    rarity: 'starter',
    target: 'self',
    price: 45,
    base: { cost: 1, block: 5 },
    upgraded: { cost: 1, block: 8 },
  },
  bash: {
    id: 'bash',
    name: '痛击',
    type: 'attack',
    rarity: 'starter',
    target: 'enemy',
    price: 60,
    base: { cost: 2, damage: 8, hits: 1, applyEnemyStatuses: { vulnerable: 2 } },
    upgraded: { cost: 2, damage: 10, hits: 1, applyEnemyStatuses: { vulnerable: 3 } },
  },

  // === Common Cards (14) ===
  pommel_strike: {
    id: 'pommel_strike',
    name: '剑柄打击',
    type: 'attack',
    rarity: 'common',
    target: 'enemy',
    price: 52,
    base: { cost: 1, damage: 9, hits: 1, draw: 1 },
    upgraded: { cost: 1, damage: 10, hits: 1, draw: 2 },
  },
  shrug_it_off: {
    id: 'shrug_it_off',
    name: '耸肩无视',
    type: 'skill',
    rarity: 'common',
    target: 'self',
    price: 55,
    base: { cost: 1, block: 8, draw: 1 },
    upgraded: { cost: 1, block: 11, draw: 1 },
  },
  twin_strike: {
    id: 'twin_strike',
    name: '双重打击',
    type: 'attack',
    rarity: 'common',
    target: 'enemy',
    price: 55,
    base: { cost: 1, damage: 5, hits: 2 },
    upgraded: { cost: 1, damage: 7, hits: 2 },
  },
  cleave: {
    id: 'cleave',
    name: '顺势斩',
    type: 'attack',
    rarity: 'common',
    target: 'all_enemies',
    price: 55,
    base: { cost: 1, damage: 8, hits: 1 },
    upgraded: { cost: 1, damage: 11, hits: 1 },
  },
  clothesline: {
    id: 'clothesline',
    name: '金刚臂',
    type: 'attack',
    rarity: 'common',
    target: 'enemy',
    price: 58,
    base: { cost: 2, damage: 12, hits: 1, applyEnemyStatuses: { weak: 2 } },
    upgraded: { cost: 2, damage: 14, hits: 1, applyEnemyStatuses: { weak: 3 } },
  },
  iron_wave: {
    id: 'iron_wave',
    name: '铁斩波',
    type: 'attack',
    rarity: 'common',
    target: 'enemy',
    price: 54,
    base: { cost: 1, block: 5, damage: 5, hits: 1 },
    upgraded: { cost: 1, block: 7, damage: 7, hits: 1 },
  },
  body_slam: {
    id: 'body_slam',
    name: '全身撞击',
    type: 'attack',
    rarity: 'common',
    target: 'enemy',
    price: 56,
    base: { cost: 1, useBlockAsDamage: true, hits: 1 },
    upgraded: { cost: 0, useBlockAsDamage: true, hits: 1 },
  },
  thunderclap: {
    id: 'thunderclap',
    name: '霹雳',
    type: 'attack',
    rarity: 'common',
    target: 'all_enemies',
    price: 56,
    base: { cost: 1, damage: 4, hits: 1, applyEnemyStatuses: { vulnerable: 1 } },
    upgraded: { cost: 1, damage: 7, hits: 1, applyEnemyStatuses: { vulnerable: 1 } },
  },
  heavy_blade: {
    id: 'heavy_blade',
    name: '重刃',
    type: 'attack',
    rarity: 'common',
    target: 'enemy',
    price: 60,
    base: { cost: 2, damage: 14, hits: 1, strengthMultiplier: 3 },
    upgraded: { cost: 2, damage: 14, hits: 1, strengthMultiplier: 5 },
  },
  true_grit: {
    id: 'true_grit',
    name: '坚毅',
    type: 'skill',
    rarity: 'common',
    target: 'self',
    price: 54,
    base: { cost: 1, block: 7, exhaustHandRandom: 1 },
    upgraded: { cost: 1, block: 9, exhaustHandRandom: 1, exhaustHandSmart: true },
  },
  anger: {
    id: 'anger',
    name: '愤怒',
    type: 'attack',
    rarity: 'common',
    target: 'enemy',
    price: 50,
    base: { cost: 0, damage: 6, hits: 1, copySelfToDiscard: true },
    upgraded: { cost: 0, damage: 8, hits: 1, copySelfToDiscard: true },
  },
  flex: {
    id: 'flex',
    name: '活动肌肉',
    type: 'skill',
    rarity: 'common',
    target: 'self',
    price: 50,
    base: { cost: 0, applySelfStatuses: { strength: 2, tempStrengthDown: 2 } },
    upgraded: { cost: 0, applySelfStatuses: { strength: 4, tempStrengthDown: 4 } },
  },
  armaments: {
    id: 'armaments',
    name: '武装',
    type: 'skill',
    rarity: 'common',
    target: 'self',
    price: 55,
    base: { cost: 1, block: 5, upgradeHandRandom: 1 },
    upgraded: { cost: 1, block: 5, upgradeHandRandom: 0, upgradeAllHand: true },
  },
  steadfast_guard: {
    id: 'steadfast_guard',
    name: '磐石守备',
    type: 'skill',
    rarity: 'common',
    target: 'self',
    price: 58,
    retain: true,
    base: { cost: 1, block: 9, retain: true },
    upgraded: { cost: 1, block: 13, retain: true },
  },

  // === Uncommon Cards (15) ===
  whirlwind: {
    id: 'whirlwind',
    name: '旋风斩',
    type: 'attack',
    rarity: 'uncommon',
    target: 'all_enemies',
    price: 78,
    base: { cost: 'X', isXCost: true, damage: 5 },
    upgraded: { cost: 'X', isXCost: true, damage: 8 },
  },
  inflame: {
    id: 'inflame',
    name: '燃烧',
    type: 'power',
    rarity: 'uncommon',
    target: 'self',
    price: 75,
    base: { cost: 1, applySelfStatuses: { strength: 2 } },
    upgraded: { cost: 1, applySelfStatuses: { strength: 3 } },
  },
  metallicize: {
    id: 'metallicize',
    name: '金属化',
    type: 'power',
    rarity: 'uncommon',
    target: 'self',
    price: 76,
    base: { cost: 1, applySelfStatuses: { metallicize: 3 } },
    upgraded: { cost: 1, applySelfStatuses: { metallicize: 4 } },
  },
  battle_trance: {
    id: 'battle_trance',
    name: '战斗专注',
    type: 'skill',
    rarity: 'uncommon',
    target: 'self',
    price: 78,
    base: { cost: 0, draw: 3, applySelfStatusesAfter: { noDraw: 1 } },
    upgraded: { cost: 0, draw: 4, applySelfStatusesAfter: { noDraw: 1 } },
  },
  bloodletting: {
    id: 'bloodletting',
    name: '放血',
    type: 'skill',
    rarity: 'uncommon',
    target: 'self',
    price: 70,
    base: { cost: 0, loseHp: 3, gainEnergy: 2 },
    upgraded: { cost: 0, loseHp: 3, gainEnergy: 3 },
  },
  seeing_red: {
    id: 'seeing_red',
    name: '盛怒',
    type: 'skill',
    rarity: 'uncommon',
    target: 'self',
    price: 68,
    base: { cost: 1, gainEnergy: 2, exhaust: true },
    upgraded: { cost: 0, gainEnergy: 2, exhaust: true },
  },
  uppercut: {
    id: 'uppercut',
    name: '上勾拳',
    type: 'attack',
    rarity: 'uncommon',
    target: 'enemy',
    price: 82,
    base: { cost: 2, damage: 13, hits: 1, applyEnemyStatuses: { weak: 1, vulnerable: 1 } },
    upgraded: { cost: 2, damage: 13, hits: 1, applyEnemyStatuses: { weak: 2, vulnerable: 2 } },
  },
  feel_no_pain: {
    id: 'feel_no_pain',
    name: '无惧疼痛',
    type: 'power',
    rarity: 'uncommon',
    target: 'self',
    price: 82,
    base: { cost: 1, applySelfStatuses: { feelNoPain: 3 } },
    upgraded: { cost: 1, applySelfStatuses: { feelNoPain: 4 } },
  },
  dark_embrace: {
    id: 'dark_embrace',
    name: '黑暗之拥',
    type: 'power',
    rarity: 'uncommon',
    target: 'self',
    price: 84,
    base: { cost: 2, applySelfStatuses: { darkEmbrace: 1 } },
    upgraded: { cost: 1, applySelfStatuses: { darkEmbrace: 1 } },
  },
  second_wind: {
    id: 'second_wind',
    name: '重振精神',
    type: 'skill',
    rarity: 'uncommon',
    target: 'self',
    price: 76,
    base: { cost: 1, exhaustNonAttacksBlockEach: 5 },
    upgraded: { cost: 1, exhaustNonAttacksBlockEach: 7 },
  },
  entrench: {
    id: 'entrench',
    name: '巩固',
    type: 'skill',
    rarity: 'uncommon',
    target: 'self',
    price: 78,
    base: { cost: 2, doubleBlock: true },
    upgraded: { cost: 1, doubleBlock: true },
  },
  flame_barrier: {
    id: 'flame_barrier',
    name: '火焰屏障',
    type: 'skill',
    rarity: 'uncommon',
    target: 'self',
    price: 80,
    base: { cost: 2, block: 12, applySelfStatuses: { flameBarrier: 4 } },
    upgraded: { cost: 2, block: 16, applySelfStatuses: { flameBarrier: 6 } },
  },
  shockwave: {
    id: 'shockwave',
    name: '震荡波',
    type: 'skill',
    rarity: 'uncommon',
    target: 'all_enemies',
    price: 84,
    base: { cost: 2, applyEnemyStatuses: { weak: 3, vulnerable: 3 }, exhaust: true },
    upgraded: { cost: 2, applyEnemyStatuses: { weak: 5, vulnerable: 5 }, exhaust: true },
  },
  ambush_slash: {
    id: 'ambush_slash',
    name: '先制猛袭',
    type: 'attack',
    rarity: 'uncommon',
    target: 'enemy',
    price: 74,
    innate: true,
    base: { cost: 0, innate: true, damage: 11, hits: 1, exhaust: true },
    upgraded: { cost: 0, innate: true, damage: 15, hits: 1, exhaust: true },
  },
  ghostly_armor: {
    id: 'ghostly_armor',
    name: '幽灵铠甲',
    type: 'skill',
    rarity: 'uncommon',
    target: 'self',
    price: 72,
    ethereal: true,
    base: { cost: 1, ethereal: true, block: 10 },
    upgraded: { cost: 1, ethereal: true, block: 13 },
  },

  // === Rare Cards (8) ===
  impervious: {
    id: 'impervious',
    name: '岿然不动',
    type: 'skill',
    rarity: 'rare',
    target: 'self',
    price: 125,
    base: { cost: 2, block: 30, exhaust: true },
    upgraded: { cost: 2, block: 40, exhaust: true },
  },
  offering: {
    id: 'offering',
    name: '祭品',
    type: 'skill',
    rarity: 'rare',
    target: 'self',
    price: 140,
    base: { cost: 0, loseHp: 6, gainEnergy: 2, draw: 3, exhaust: true },
    upgraded: { cost: 0, loseHp: 6, gainEnergy: 2, draw: 5, exhaust: true },
  },
  demon_form: {
    id: 'demon_form',
    name: '恶魔形态',
    type: 'power',
    rarity: 'rare',
    target: 'self',
    price: 145,
    base: { cost: 3, applySelfStatuses: { demonForm: 2 } },
    upgraded: { cost: 3, applySelfStatuses: { demonForm: 3 } },
  },
  bludgeon: {
    id: 'bludgeon',
    name: '重锤',
    type: 'attack',
    rarity: 'rare',
    target: 'enemy',
    price: 135,
    base: { cost: 3, damage: 32, hits: 1 },
    upgraded: { cost: 3, damage: 42, hits: 1 },
  },
  barricade: {
    id: 'barricade',
    name: '壁垒',
    type: 'power',
    rarity: 'rare',
    target: 'self',
    price: 145,
    base: { cost: 3, applySelfStatuses: { barricade: 1 } },
    upgraded: { cost: 2, applySelfStatuses: { barricade: 1 } },
  },
  corruption: {
    id: 'corruption',
    name: '腐化',
    type: 'power',
    rarity: 'rare',
    target: 'self',
    price: 142,
    base: { cost: 3, applySelfStatuses: { corruption: 1 } },
    upgraded: { cost: 2, applySelfStatuses: { corruption: 1 } },
  },
  fiend_fire: {
    id: 'fiend_fire',
    name: '恶魔之焰',
    type: 'attack',
    rarity: 'rare',
    target: 'enemy',
    price: 138,
    base: { cost: 2, exhaustAllHandDamageEach: 7, exhaust: true },
    upgraded: { cost: 2, exhaustAllHandDamageEach: 10, exhaust: true },
  },
  reaper: {
    id: 'reaper',
    name: '死神收割',
    type: 'attack',
    rarity: 'rare',
    target: 'all_enemies',
    price: 145,
    base: { cost: 2, damage: 4, hits: 1, lifestealUnblocked: true, exhaust: true },
    upgraded: { cost: 2, damage: 5, hits: 1, lifestealUnblocked: true, exhaust: true },
  },

  // === Status Cards ===
  slimed: {
    id: 'slimed',
    name: '黏液',
    type: 'status',
    rarity: 'status',
    target: 'self',
    price: 0,
    base: { cost: 1, exhaust: true },
    upgraded: null,
  },
  dazed: {
    id: 'dazed',
    name: '晕眩',
    type: 'status',
    rarity: 'status',
    target: 'none',
    unplayable: true,
    ethereal: true,
    price: 0,
    base: { cost: null, unplayable: true, ethereal: true },
    upgraded: null,
  },
  burn: {
    id: 'burn',
    name: '灼伤',
    type: 'status',
    rarity: 'status',
    target: 'none',
    unplayable: true,
    price: 0,
    base: { cost: null, unplayable: true, endOfTurnSelfDamage: 2 },
    upgraded: null,
  },

  // === Curse Cards ===
  clumsy: {
    id: 'clumsy',
    name: '笨拙',
    type: 'curse',
    rarity: 'curse',
    target: 'none',
    unplayable: true,
    ethereal: true,
    price: 0,
    base: { cost: null, unplayable: true, ethereal: true },
    upgraded: null,
  },
  doubt: {
    id: 'doubt',
    name: '疑虑',
    type: 'curse',
    rarity: 'curse',
    target: 'none',
    unplayable: true,
    price: 0,
    base: { cost: null, unplayable: true, endOfTurnWeak: 1 },
    upgraded: null,
  },
  regret: {
    id: 'regret',
    name: '悔恨',
    type: 'curse',
    rarity: 'curse',
    target: 'none',
    unplayable: true,
    price: 0,
    base: { cost: null, unplayable: true, endOfTurnLoseHp: 2 },
    upgraded: null,
  },
});

export const REWARD_CARD_POOLS = deepFreeze({
  common: Object.values(CARD_LIBRARY)
    .filter((c) => c.rarity === 'common')
    .map((c) => c.id),
  uncommon: Object.values(CARD_LIBRARY)
    .filter((c) => c.rarity === 'uncommon')
    .map((c) => c.id),
  rare: Object.values(CARD_LIBRARY)
    .filter((c) => c.rarity === 'rare')
    .map((c) => c.id),
});

export const CURSE_CARD_IDS = deepFreeze(
  Object.values(CARD_LIBRARY)
    .filter((c) => c.type === 'curse')
    .map((c) => c.id)
);

export const STARTER_DECK_RECIPE = deepFreeze([
  'strike',
  'strike',
  'strike',
  'strike',
  'strike',
  'defend',
  'defend',
  'defend',
  'defend',
  'bash',
]);

export function createCardInstance(state, cardId, upgraded = false) {
  const def = CARD_LIBRARY[cardId];
  if (!def) {
    throw new Error(`Unknown cardId: ${cardId}`);
  }
  state.nextUid = (state.nextUid ?? 1) + 1;
  return {
    instanceId: `card_${state.nextUid}`,
    cardId,
    upgraded: Boolean(upgraded && def.upgraded),
  };
}

export function canUpgradeCard(cardInstance) {
  if (!cardInstance || cardInstance.upgraded) return false;
  const def = CARD_LIBRARY[cardInstance.cardId];
  return Boolean(def && def.upgraded && def.type !== 'status' && def.type !== 'curse');
}

export function getCardStats(cardInstance) {
  const def = CARD_LIBRARY[cardInstance?.cardId];
  if (!def) {
    throw new Error(`Unknown cardId on instance: ${cardInstance?.cardId}`);
  }
  const isUpgraded = Boolean(cardInstance.upgraded && def.upgraded);
  const rawStats = isUpgraded ? { ...def.base, ...def.upgraded } : { ...def.base };
  const costReduced = Boolean(
    isUpgraded &&
      typeof def.base.cost === 'number' &&
      typeof rawStats.cost === 'number' &&
      rawStats.cost < def.base.cost
  );

  return {
    instanceId: cardInstance.instanceId,
    cardId: def.id,
    name: isUpgraded ? `${def.name}+` : def.name,
    baseName: def.name,
    upgraded: isUpgraded,
    baseCost: def.base.cost,
    costReduced,
    type: def.type,
    rarity: def.rarity,
    target: def.target,
    price: def.price ?? 50,
    unplayable: Boolean(def.unplayable || rawStats.unplayable),
    ethereal: Boolean(def.ethereal || rawStats.ethereal),
    innate: Boolean(def.innate || rawStats.innate),
    retain: Boolean(def.retain || rawStats.retain),
    ...rawStats,
  };
}

export function getEffectiveCardCost(stats, player = null) {
  if (stats.unplayable || stats.cost === null) return null;
  if (stats.isXCost) return 'X';
  if (stats.type === 'skill' && (player?.statuses?.corruption ?? 0) > 0) {
    return 0;
  }
  return stats.cost ?? 0;
}

export function formatCardDescription(cardInstance, combatContext = null) {
  const stats = getCardStats(cardInstance);
  const player = combatContext?.player ?? null;
  const targetEnemy = combatContext?.targetEnemy ?? null;

  const rawDamageBase = stats.damage ?? stats.exhaustAllHandDamageEach ?? null;
  let displayDamage = rawDamageBase;
  let damageState = 'normal';

  if (stats.useBlockAsDamage) {
    const baseFromBlock = player ? player.block : 0;
    displayDamage = player
      ? calculateAttackDamage(baseFromBlock, player, targetEnemy)
      : 0;
    if (player && displayDamage > baseFromBlock) damageState = 'boosted';
    else if (player && displayDamage < baseFromBlock) damageState = 'reduced';
  } else if (typeof rawDamageBase === 'number') {
    if (player) {
      displayDamage = calculateAttackDamage(rawDamageBase, player, targetEnemy, {
        strengthMultiplier: stats.strengthMultiplier ?? 1,
      });
      if (displayDamage > rawDamageBase) damageState = 'boosted';
      else if (displayDamage < rawDamageBase) damageState = 'reduced';
    }
  }

  const rawBlockBase = stats.block ?? stats.exhaustNonAttacksBlockEach ?? null;
  let displayBlock = rawBlockBase;
  let blockState = 'normal';
  if (typeof rawBlockBase === 'number' && player) {
    displayBlock = calculateCardBlock(rawBlockBase, player);
    if (displayBlock > rawBlockBase) blockState = 'boosted';
    else if (displayBlock < rawBlockBase) blockState = 'reduced';
  }

  const parts = [];

  if (stats.innate) {
    parts.push('固有。');
  }
  if (stats.retain) {
    parts.push('保留。');
  }
  if (stats.unplayable) {
    parts.push('不能被打出。');
  }
  if (stats.ethereal) {
    parts.push('虚无（回合结束时若仍在手牌则消耗）。');
  }
  if (stats.endOfTurnSelfDamage) {
    parts.push(`回合结束时若仍在手牌，受到 ${stats.endOfTurnSelfDamage} 点伤害。`);
  }
  if (stats.endOfTurnLoseHp) {
    parts.push(`回合结束时若仍在手牌，失去 ${stats.endOfTurnLoseHp} 点生命。`);
  }
  if (stats.endOfTurnWeak) {
    parts.push(`回合结束时若仍在手牌，获得 ${stats.endOfTurnWeak} 层虚弱。`);
  }
  if (stats.loseHp) {
    parts.push(`失去 ${stats.loseHp} 点生命。`);
  }
  if (stats.gainEnergy) {
    parts.push(`获得 ${stats.gainEnergy} 点能量。`);
  }
  if (typeof stats.block === 'number') {
    parts.push(`获得 ${displayBlock} 点格挡。`);
  }
  if (stats.doubleBlock) {
    parts.push('将你当前的格挡值翻倍。');
  }
  if (stats.exhaustHandRandom) {
    parts.push(
      stats.exhaustHandSmart
        ? '消耗 1 张手牌（优先状态或诅咒牌）。'
        : '随机消耗 1 张手牌。'
    );
  }
  if (stats.exhaustNonAttacksBlockEach) {
    parts.push(`消耗手牌中所有非攻击牌，每张获得 ${displayBlock} 点格挡。`);
  }
  if (stats.upgradeAllHand) {
    parts.push('本场战斗中升级所有手牌。');
  } else if (stats.upgradeHandRandom) {
    parts.push(`本场战斗中随机升级 ${stats.upgradeHandRandom} 张手牌。`);
  }
  if (stats.exhaustAllHandDamageEach) {
    parts.push(`消耗所有手牌，每张对目标造成 ${displayDamage} 点伤害。`);
  } else if (stats.useBlockAsDamage) {
    const suffix = player ? `（当前 ${displayDamage} 点）` : '';
    parts.push(`造成等同于你当前格挡值的伤害${suffix}。`);
  } else if (typeof stats.damage === 'number') {
    const targetPhrase = stats.target === 'all_enemies' ? '对所有敌人造成' : '造成';
    if (stats.isXCost) {
      parts.push(`${targetPhrase} ${displayDamage} 点伤害 X 次。`);
    } else if ((stats.hits ?? 1) > 1) {
      parts.push(`${targetPhrase} ${displayDamage} 点伤害 ${stats.hits} 次。`);
    } else {
      parts.push(`${targetPhrase} ${displayDamage} 点伤害。`);
    }
  }
  if (stats.lifestealUnblocked) {
    parts.push('回复等同于未格挡伤害量的生命。');
  }
  if (stats.copySelfToDiscard) {
    parts.push('在弃牌堆中加入 1 张本牌的复制品。');
  }
  if (stats.strengthMultiplier && stats.strengthMultiplier > 1) {
    parts.push(`力量在该牌上发挥 ${stats.strengthMultiplier} 倍效果。`);
  }
  if (stats.applyEnemyStatuses) {
    const targetLabel = stats.target === 'all_enemies' ? '所有敌人' : '目标';
    if (stats.applyEnemyStatuses.weak) {
      parts.push(`给予${targetLabel} ${stats.applyEnemyStatuses.weak} 层虚弱。`);
    }
    if (stats.applyEnemyStatuses.vulnerable) {
      parts.push(`给予${targetLabel} ${stats.applyEnemyStatuses.vulnerable} 层易伤。`);
    }
  }
  if (stats.draw) {
    parts.push(`抽 ${stats.draw} 张牌。`);
  }
  if (stats.applySelfStatuses) {
    if (stats.applySelfStatuses.strength) {
      parts.push(`获得 ${stats.applySelfStatuses.strength} 点力量。`);
    }
    if (stats.applySelfStatuses.tempStrengthDown) {
      parts.push(`本回合结束时，失去 ${stats.applySelfStatuses.tempStrengthDown} 点力量。`);
    }
    if (stats.applySelfStatuses.metallicize) {
      parts.push(`回合结束时，获得 ${stats.applySelfStatuses.metallicize} 点格挡。`);
    }
    if (stats.applySelfStatuses.demonForm) {
      parts.push(`每回合开始时，获得 ${stats.applySelfStatuses.demonForm} 点力量。`);
    }
    if (stats.applySelfStatuses.feelNoPain) {
      parts.push(`每当你消耗 1 张牌时，获得 ${stats.applySelfStatuses.feelNoPain} 点格挡。`);
    }
    if (stats.applySelfStatuses.darkEmbrace) {
      parts.push(`每当你消耗 1 张牌时，抽 ${stats.applySelfStatuses.darkEmbrace} 张牌。`);
    }
    if (stats.applySelfStatuses.barricade) {
      parts.push('你的格挡在回合开始时不再自动清零。');
    }
    if (stats.applySelfStatuses.corruption) {
      parts.push('所有技能牌费用变为 0 点，但打出后将直接消耗。');
    }
    if (stats.applySelfStatuses.flameBarrier) {
      parts.push(`本回合每受一次攻击，反击 ${stats.applySelfStatuses.flameBarrier} 点伤害。`);
    }
  }
  if (stats.applySelfStatusesAfter?.noDraw) {
    parts.push('本回合内不能再抽牌。');
  }

  const corruptedExhaust =
    stats.type === 'skill' && !stats.exhaust && Boolean(player && (player.statuses?.corruption ?? 0) > 0);
  if (stats.exhaust || corruptedExhaust) {
    parts.push('消耗。');
  }

  const effectiveCost = getEffectiveCardCost(stats, player);
  const costReducedNow =
    stats.costReduced ||
    (typeof stats.cost === 'number' && typeof effectiveCost === 'number' && effectiveCost < stats.cost);

  return {
    text: parts.join(' '),
    displayDamage,
    displayBlock,
    damageState,
    blockState,
    displayCost: effectiveCost === null ? '—' : String(effectiveCost),
    costReducedNow,
  };
}

export function formatUpgradePreview(cardInstance, combatContext = null) {
  if (!canUpgradeCard(cardInstance)) return null;

  const baseCard = { ...cardInstance, upgraded: false };
  const nextCard = { ...cardInstance, upgraded: true };
  const baseStats = getCardStats(baseCard);
  const nextStats = getCardStats(nextCard);
  const baseDesc = formatCardDescription(baseCard, combatContext);
  const nextDesc = formatCardDescription(nextCard, combatContext);

  let costPrefix = '';
  if (
    typeof baseStats.cost === 'number' &&
    typeof nextStats.cost === 'number' &&
    nextStats.cost < baseStats.cost
  ) {
    const reducedBy = baseStats.cost - nextStats.cost;
    costPrefix = `费用 ${baseStats.cost} → ${nextStats.cost}（减少 ${reducedBy} 点）。`;
  } else if (baseDesc.displayCost !== nextDesc.displayCost) {
    costPrefix = `费用 ${baseDesc.displayCost} → ${nextDesc.displayCost}。`;
  }

  return {
    text: costPrefix ? `${costPrefix} ${nextDesc.text}`.trim() : nextDesc.text,
    costReduced: Boolean(
      typeof baseStats.cost === 'number' &&
        typeof nextStats.cost === 'number' &&
        nextStats.cost < baseStats.cost
    ),
    baseCost: baseDesc.displayCost,
    nextCost: nextDesc.displayCost,
  };
}
