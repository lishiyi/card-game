function deepFreeze(obj) {
  if (obj && typeof obj === 'object') {
    Object.freeze(obj);
    for (const val of Object.values(obj)) {
      deepFreeze(val);
    }
  }
  return obj;
}

export const RELIC_LIBRARY = deepFreeze({
  burning_blood: {
    id: 'burning_blood',
    name: '燃烧之血',
    tier: 'starter',
    price: 150,
    description: '战斗胜利后，回复 6 点生命。',
  },
  vajra: {
    id: 'vajra',
    name: '金刚杵',
    tier: 'common',
    price: 145,
    description: '每场战斗开始时，获得 1 点力量。',
  },
  oddly_smooth_stone: {
    id: 'oddly_smooth_stone',
    name: '光滑石头',
    tier: 'common',
    price: 145,
    description: '每场战斗开始时，获得 1 点敏捷。',
  },
  anchor: {
    id: 'anchor',
    name: '锚',
    tier: 'common',
    price: 150,
    description: '每场战斗第 1 回合开始时，获得 10 点格挡。',
  },
  bag_of_prep: {
    id: 'bag_of_prep',
    name: '准备背包',
    tier: 'common',
    price: 150,
    description: '每场战斗第 1 回合额外抽 2 张牌。',
  },
  lantern: {
    id: 'lantern',
    name: '提灯',
    tier: 'common',
    price: 140,
    description: '每场战斗第 1 回合额外获得 1 点能量。',
  },
  orichalcum: {
    id: 'orichalcum',
    name: '奥利哈钢',
    tier: 'common',
    price: 145,
    description: '回合结束时，若你没有任何格挡，则获得 6 点格挡。',
  },
});

export const NON_STARTER_RELIC_IDS = deepFreeze(
  Object.values(RELIC_LIBRARY)
    .filter((r) => r.tier !== 'starter')
    .map((r) => r.id)
);

export const POTION_LIBRARY = deepFreeze({
  fire_potion: {
    id: 'fire_potion',
    name: '火焰药水',
    target: 'enemy',
    price: 50,
    damage: 20,
    description: '对目标敌人造成 20 点固定伤害。',
  },
  block_potion: {
    id: 'block_potion',
    name: '格挡药水',
    target: 'self',
    price: 48,
    block: 12,
    description: '立即获得 12 点格挡。',
  },
  strength_potion: {
    id: 'strength_potion',
    name: '力量药水',
    target: 'self',
    price: 55,
    strength: 2,
    description: '本场战斗获得 2 点力量。',
  },
  energy_potion: {
    id: 'energy_potion',
    name: '能量药水',
    target: 'self',
    price: 52,
    energy: 2,
    description: '本回合获得 2 点能量。',
  },
});

export const ALL_POTION_IDS = deepFreeze(Object.keys(POTION_LIBRARY));

export const STATUS_METADATA = deepFreeze({
  strength: {
    id: 'strength',
    name: '力量',
    polarity: 'buff',
    describe: (v) =>
      v >= 0
        ? `每次攻击额外造成 ${v} 点伤害。`
        : `每次攻击造成的伤害减少 ${Math.abs(v)} 点。`,
  },
  dexterity: {
    id: 'dexterity',
    name: '敏捷',
    polarity: 'buff',
    describe: (v) =>
      v >= 0
        ? `从卡牌获得的格挡额外增加 ${v} 点。`
        : `从卡牌获得的格挡减少 ${Math.abs(v)} 点。`,
  },
  vulnerable: {
    id: 'vulnerable',
    name: '易伤',
    polarity: 'debuff',
    describe: (v) => `受到的攻击伤害增加 50%，持续 ${v} 回合。`,
  },
  weak: {
    id: 'weak',
    name: '虚弱',
    polarity: 'debuff',
    describe: (v) => `造成的攻击伤害降低 25%，持续 ${v} 回合。`,
  },
  frail: {
    id: 'frail',
    name: '脆弱',
    polarity: 'debuff',
    describe: (v) => `从卡牌获得的格挡降低 25%，持续 ${v} 回合。`,
  },
  metallicize: {
    id: 'metallicize',
    name: '金属化',
    polarity: 'buff',
    describe: (v) => `每回合结束时，自动获得 ${v} 点格挡。`,
  },
  demonForm: {
    id: 'demonForm',
    name: '恶魔形态',
    polarity: 'buff',
    describe: (v) => `每回合开始时，自动获得 ${v} 点力量。`,
  },
  noDraw: {
    id: 'noDraw',
    name: '禁抽',
    polarity: 'debuff',
    describe: () => '本回合内无法再抽取任何卡牌。',
  },
  ritual: {
    id: 'ritual',
    name: '仪式',
    polarity: 'buff',
    describe: (v) => `每回合结束时，获得 ${v} 点力量。`,
  },
  curlUp: {
    id: 'curlUp',
    name: '蜷缩',
    polarity: 'buff',
    describe: (v) => `首次受到未格挡的攻击伤害时，立即获得 ${v} 点格挡（每场战斗仅触发一次）。`,
  },
  enrage: {
    id: 'enrage',
    name: '激怒',
    polarity: 'buff',
    describe: (v) => `每当玩家打出一张技能牌，立即获得 ${v} 点力量。`,
  },
  modeShift: {
    id: 'modeShift',
    name: '形态转换',
    polarity: 'buff',
    describe: (v) => `再失去 ${v} 点生命后，立即获得 16 点格挡并切换至防御形态。`,
  },
  sharpHide: {
    id: 'sharpHide',
    name: '锋利外壳',
    polarity: 'buff',
    describe: (v) => `每当玩家打出一张攻击牌，对玩家造成 ${v} 点反伤。`,
  },
});
