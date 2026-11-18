import { calculateAttackDamage, calculateCardBlock } from '../engine/math.js';

function deepFreeze(obj) {
  if (obj && typeof obj === 'object') {
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

  // === Common Cards ===
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

  // === Uncommon Cards ===
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

  // === Rare Cards ===
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
  return Boolean(def && def.upgraded && def.type !== 'status');
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
    ...rawStats,
  };
}

export function formatCardDescription(cardInstance, combatContext = null) {
  const stats = getCardStats(cardInstance);
  const player = combatContext?.player ?? null;
  const targetEnemy = combatContext?.targetEnemy ?? null;

  let displayDamage = stats.damage ?? null;
  let damageState = 'normal';

  if (stats.useBlockAsDamage) {
    const baseFromBlock = player ? player.block : 0;
    displayDamage = player
      ? calculateAttackDamage(baseFromBlock, player, targetEnemy)
      : 0;
    if (player && displayDamage > baseFromBlock) damageState = 'boosted';
    else if (player && displayDamage < baseFromBlock) damageState = 'reduced';
  } else if (typeof stats.damage === 'number') {
    if (player) {
      displayDamage = calculateAttackDamage(stats.damage, player, targetEnemy, {
        strengthMultiplier: stats.strengthMultiplier ?? 1,
      });
      if (displayDamage > stats.damage) damageState = 'boosted';
      else if (displayDamage < stats.damage) damageState = 'reduced';
    }
  }

  let displayBlock = stats.block ?? null;
  let blockState = 'normal';
  if (typeof stats.block === 'number' && player) {
    displayBlock = calculateCardBlock(stats.block, player);
    if (displayBlock > stats.block) blockState = 'boosted';
    else if (displayBlock < stats.block) blockState = 'reduced';
  }

  const parts = [];

  if (stats.unplayable) {
    parts.push('不能被打出。');
  }
  if (stats.ethereal) {
    parts.push('虚无（回合结束时若仍在手牌则消耗）。');
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
  if (stats.useBlockAsDamage) {
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
    if (stats.applySelfStatuses.metallicize) {
      parts.push(`回合结束时，获得 ${stats.applySelfStatuses.metallicize} 点格挡。`);
    }
    if (stats.applySelfStatuses.demonForm) {
      parts.push(`每回合开始时，获得 ${stats.applySelfStatuses.demonForm} 点力量。`);
    }
  }
  if (stats.applySelfStatusesAfter?.noDraw) {
    parts.push('本回合内不能再抽牌。');
  }
  if (stats.exhaust) {
    parts.push('消耗。');
  }

  return {
    text: parts.join(' '),
    displayDamage,
    displayBlock,
    damageState,
    blockState,
    displayCost: stats.cost === null ? '—' : String(stats.cost),
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

