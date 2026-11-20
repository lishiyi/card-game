function deepFreeze(obj) {
  if (obj && typeof obj === 'object' && !Object.isFrozen(obj)) {
    Object.freeze(obj);
    for (const val of Object.values(obj)) {
      deepFreeze(val);
    }
  }
  return obj;
}

export const RELIC_TIER_LABELS = deepFreeze({
  starter: '初始遗物',
  common: '普通遗物',
  uncommon: '罕见遗物',
  rare: '稀有遗物',
  boss: '首领遗物',
});

export const RELIC_LIBRARY = deepFreeze({
  // === Starter ===
  burning_blood: {
    id: 'burning_blood',
    name: '燃烧之血',
    tier: 'starter',
    character: 'ironclad',
    price: 150,
    description: '战斗胜利后，回复 6 点生命。',
  },
  ring_of_the_snake: {
    id: 'ring_of_the_snake',
    name: '蛇之戒指',
    tier: 'starter',
    character: 'silent',
    price: 150,
    description: '每场战斗第 1 回合开始时，额外抽 2 张牌。',
  },

  // === Common (9) ===
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
  bag_of_marbles: {
    id: 'bag_of_marbles',
    name: '弹珠袋',
    tier: 'common',
    price: 148,
    description: '每场战斗开始时，给予所有敌人 1 层易伤。',
  },
  blood_vial: {
    id: 'blood_vial',
    name: '鲜血小瓶',
    tier: 'common',
    price: 142,
    description: '每场战斗开始时，回复 2 点生命。',
  },
  snecko_skull: {
    id: 'snecko_skull',
    name: '异蛇头骨',
    tier: 'common',
    character: 'silent',
    price: 155,
    description: '每当你给予敌人【中毒】时，额外多施加 1 层中毒。',
  },

  // === Uncommon (7) ===
  horn_cleat: {
    id: 'horn_cleat',
    name: '船夹板',
    tier: 'uncommon',
    price: 195,
    description: '每场战斗第 2 回合开始时，获得 14 点格挡。',
  },
  mercury_hourglass: {
    id: 'mercury_hourglass',
    name: '水银沙漏',
    tier: 'uncommon',
    price: 200,
    description: '每回合开始时，对所有敌人造成 3 点固定伤害。',
  },
  meat_on_the_bone: {
    id: 'meat_on_the_bone',
    name: '带骨肉',
    tier: 'uncommon',
    price: 210,
    description: '战斗胜利时，若你的生命值不高于 50%，额外回复 12 点生命。',
  },
  eternal_feather: {
    id: 'eternal_feather',
    name: '永恒羽毛',
    tier: 'uncommon',
    price: 205,
    description: '每当你踏入篝火营地时，牌组中每满 5 张牌便回复 3 点生命。',
  },
  paper_phrog: {
    id: 'paper_phrog',
    name: '折纸青蛙',
    tier: 'uncommon',
    character: 'ironclad',
    price: 215,
    description: '处于【易伤】状态的敌人受到你的攻击伤害加成由 50% 提升至 75%。',
  },
  shuriken: {
    id: 'shuriken',
    name: '手里剑',
    tier: 'uncommon',
    price: 215,
    description: '每当你单回合内打出 3 张攻击牌时，获得 1 点力量。',
  },
  kunai: {
    id: 'kunai',
    name: '苦无',
    tier: 'uncommon',
    price: 215,
    description: '每当你单回合内打出 3 张攻击牌时，获得 1 点敏捷。',
  },

  // === Rare (7) ===
  captains_wheel: {
    id: 'captains_wheel',
    name: '船长舵轮',
    tier: 'rare',
    price: 270,
    description: '每场战斗第 3 回合开始时，获得 18 点格挡。',
  },
  torii: {
    id: 'torii',
    name: '鸟居',
    tier: 'rare',
    price: 275,
    description: '每当你即将受到 1 至 5 点未格挡的敌方攻击伤害时，将其降低至 1 点。',
  },
  charons_ashes: {
    id: 'charons_ashes',
    name: '卡戎之灰',
    tier: 'rare',
    character: 'ironclad',
    price: 265,
    description: '每当你消耗 1 张卡牌时，对所有敌人造成 3 点固定伤害。',
  },
  tungsten_rod: {
    id: 'tungsten_rod',
    name: '钨合金棍',
    tier: 'rare',
    price: 285,
    description: '每当你将失去生命值时，少失去 1 点生命。',
  },
  tough_bandages: {
    id: 'tough_bandages',
    name: '坚韧绷带',
    tier: 'rare',
    character: 'silent',
    price: 275,
    description: '每当你在自己回合中主动弃掉 1 张牌时，立即获得 3 点格挡。',
  },
  tingsha: {
    id: 'tingsha',
    name: '铜钹',
    tier: 'rare',
    character: 'silent',
    price: 275,
    description: '每当你在自己回合中主动弃掉 1 张牌时，对随机一名存活敌人造成 3 点固定伤害。',
  },
  the_specimen: {
    id: 'the_specimen',
    name: '毒标本',
    tier: 'rare',
    character: 'silent',
    price: 280,
    description: '每当一名带有【中毒】的敌人被击败时，将其剩余全部【中毒】层数转移给随机一名存活敌人。',
  },

  // === Boss (10) ===
  black_blood: {
    id: 'black_blood',
    name: '漆黑之血',
    tier: 'boss',
    character: 'ironclad',
    price: 320,
    requiresRelic: 'burning_blood',
    replacesRelic: 'burning_blood',
    description: '强化初始之血：战斗胜利后回复生命提升至 12 点（替代燃烧之血效果）。',
  },
  ring_of_the_serpent: {
    id: 'ring_of_the_serpent',
    name: '蛇王戒指',
    tier: 'boss',
    character: 'silent',
    price: 320,
    requiresRelic: 'ring_of_the_snake',
    replacesRelic: 'ring_of_the_snake',
    description: '替换【蛇之戒指】：此后每回合开始时，均额外抽 1 张牌。',
  },
  wrist_blade: {
    id: 'wrist_blade',
    name: '腕刃',
    tier: 'boss',
    character: 'silent',
    price: 320,
    description: '所有当前费用为 0 的攻击牌（含【小刀】、【中和】等）每次攻击伤害额外 +4。',
  },
  cursed_key: {
    id: 'cursed_key',
    name: '诅咒钥匙',
    tier: 'boss',
    price: 320,
    energyBonus: 1,
    description: '最大能量 +1；但此后每次开启宝箱时，会将 1 张随机【诅咒】牌加入牌组。',
  },
  velvet_choker: {
    id: 'velvet_choker',
    name: '天鹅绒项圈',
    tier: 'boss',
    price: 320,
    energyBonus: 1,
    description: '最大能量 +1；但你每回合最多只能打出 6 张卡牌。',
  },
  sacred_bark: {
    id: 'sacred_bark',
    name: '神圣树皮',
    tier: 'boss',
    price: 320,
    description: '所有药水的数值效果翻倍（伤害、格挡、属性、中毒、小刀、能量、抽牌与回复全部 ×2）。',
  },
  runic_pyramid: {
    id: 'runic_pyramid',
    name: '符文金字塔',
    tier: 'boss',
    price: 320,
    description: '回合结束时不再弃掉你的手牌（【虚无】牌仍会自动消耗，手牌上限仍为 10 张）。',
  },
  snecko_eye: {
    id: 'snecko_eye',
    name: '异蛇之眼',
    tier: 'boss',
    price: 320,
    description: '每回合额外抽 2 张牌；但每场战斗开始时获得【混乱】，抽到的可打出卡牌费用将在 0–3 点间随机重设。',
  },
  coffee_dripper: {
    id: 'coffee_dripper',
    name: '咖啡滤滴器',
    tier: 'boss',
    price: 320,
    energyBonus: 1,
    description: '最大能量 +1；但你无法再在篝火营地通过【休息】回复生命（仍可锻造，永恒羽毛不受影响）。',
  },
  philosophers_stone: {
    id: 'philosophers_stone',
    name: '贤者之石',
    tier: 'boss',
    price: 320,
    energyBonus: 1,
    description: '最大能量 +1；但每场战斗开始时，所有敌人初始获得 1 点【力量】。',
  },
});

export function isRelicAllowedForCharacter(relicDef, characterId = 'ironclad') {
  if (!relicDef) return false;
  return !relicDef.character || relicDef.character === characterId;
}

export function getRelicPoolsForCharacter(characterId = 'ironclad') {
  const allowed = Object.values(RELIC_LIBRARY).filter((r) =>
    isRelicAllowedForCharacter(r, characterId)
  );
  const common = allowed.filter((r) => r.tier === 'common').map((r) => r.id);
  const uncommon = allowed.filter((r) => r.tier === 'uncommon').map((r) => r.id);
  const rare = allowed.filter((r) => r.tier === 'rare').map((r) => r.id);
  const boss = allowed.filter((r) => r.tier === 'boss').map((r) => r.id);
  return {
    common,
    uncommon,
    rare,
    boss,
    allNonBoss: [...common, ...uncommon, ...rare],
  };
}

export const RELIC_POOLS = deepFreeze({
  common: Object.values(RELIC_LIBRARY)
    .filter((r) => r.tier === 'common')
    .map((r) => r.id),
  uncommon: Object.values(RELIC_LIBRARY)
    .filter((r) => r.tier === 'uncommon')
    .map((r) => r.id),
  rare: Object.values(RELIC_LIBRARY)
    .filter((r) => r.tier === 'rare')
    .map((r) => r.id),
  boss: Object.values(RELIC_LIBRARY)
    .filter((r) => r.tier === 'boss')
    .map((r) => r.id),
});

export const NON_STARTER_RELIC_IDS = deepFreeze([
  ...RELIC_POOLS.common,
  ...RELIC_POOLS.uncommon,
  ...RELIC_POOLS.rare,
]);

export const BOSS_RELIC_IDS = RELIC_POOLS.boss;

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
  swift_potion: {
    id: 'swift_potion',
    name: '迅捷药水',
    target: 'self',
    price: 50,
    draw: 3,
    description: '立即抽 3 张牌。',
  },
  fear_potion: {
    id: 'fear_potion',
    name: '恐惧药水',
    target: 'enemy',
    price: 52,
    applyEnemyStatuses: { vulnerable: 3 },
    description: '给予目标敌人 3 层易伤。',
  },
  weak_potion: {
    id: 'weak_potion',
    name: '虚弱药水',
    target: 'enemy',
    price: 50,
    applyEnemyStatuses: { weak: 3 },
    description: '给予目标敌人 3 层虚弱。',
  },
  dexterity_potion: {
    id: 'dexterity_potion',
    name: '敏捷药水',
    target: 'self',
    price: 55,
    dexterity: 2,
    description: '本场战斗获得 2 点敏捷。',
  },
  regen_potion: {
    id: 'regen_potion',
    name: '鲜血药水',
    target: 'self',
    price: 62,
    healPct: 20,
    description: '立即回复最大生命值 20% 的生命。',
  },
  explosive_potion: {
    id: 'explosive_potion',
    name: '爆炸药水',
    target: 'all_enemies',
    price: 58,
    aoeDamage: 10,
    description: '对所有敌人造成 10 点固定伤害。',
  },
  poison_potion: {
    id: 'poison_potion',
    name: '剧毒药水',
    character: 'silent',
    target: 'enemy',
    price: 52,
    applyEnemyStatuses: { poison: 6 },
    description: '给予目标敌人 6 层【中毒】。',
  },
  cunning_potion: {
    id: 'cunning_potion',
    name: '诡计药水',
    character: 'silent',
    target: 'self',
    price: 56,
    addCardsToHand: { cardId: 'shiv', count: 3, upgraded: true },
    description: '将 3 张【小刀+】加入手牌。',
  },
});

export const ALL_POTION_IDS = deepFreeze(Object.keys(POTION_LIBRARY));

export function getAvailablePotionIds(characterId = 'ironclad') {
  return Object.values(POTION_LIBRARY)
    .filter((p) => !p.character || p.character === characterId)
    .map((p) => p.id);
}

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
  poison: {
    id: 'poison',
    name: '中毒',
    polarity: 'debuff',
    describe: (v) => `回合开始时无视格挡直接失去 ${v} 点生命，随后层数减 1。`,
  },
  corpseExplosion: {
    id: 'corpseExplosion',
    name: '尸爆',
    polarity: 'debuff',
    describe: () => '被击败时发生剧烈爆裂，对所有存活敌人造成等同于自身最大生命值的伤害。',
  },
  noxiousFumes: {
    id: 'noxiousFumes',
    name: '毒雾',
    polarity: 'buff',
    describe: (v) => `每回合开始时，给予所有敌人 ${v} 层【中毒】。`,
  },
  accuracy: {
    id: 'accuracy',
    name: '精准',
    polarity: 'buff',
    describe: (v) => `本场战斗中，所有【小刀】造成的伤害额外 +${v}。`,
  },
  infiniteBlades: {
    id: 'infiniteBlades',
    name: '无尽刀刃',
    polarity: 'buff',
    describe: (v) => `每回合开始时，将 ${v} 张【小刀】加入手牌。`,
  },
  envenom: {
    id: 'envenom',
    name: '涂毒',
    polarity: 'buff',
    describe: (v) => `每当你对敌人造成未格挡的攻击伤害时，给予目标 ${v} 层【中毒】。`,
  },
  afterImage: {
    id: 'afterImage',
    name: '余像',
    polarity: 'buff',
    describe: (v) => `每当你打出一张卡牌时，立即获得 ${v} 点格挡。`,
  },
  thousandCuts: {
    id: 'thousandCuts',
    name: '凌迟',
    polarity: 'buff',
    describe: (v) => `每当你打出一张卡牌时，对所有敌人造成 ${v} 点固定伤害。`,
  },
  intangible: {
    id: 'intangible',
    name: '无实体',
    polarity: 'buff',
    describe: (v) => `将受到的所有伤害降至 1 点，持续 ${v} 回合。`,
  },
  wraithForm: {
    id: 'wraithForm',
    name: '幽魂衰减',
    polarity: 'debuff',
    describe: (v) => `每回合开始时，失去 ${v} 点【敏捷】。`,
  },
  toolsOfTheTrade: {
    id: 'toolsOfTheTrade',
    name: '独门秘技',
    polarity: 'buff',
    describe: (v) => `每回合开始时，额外抽 ${v} 张牌并选择弃掉 ${v} 张手牌。`,
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
  feelNoPain: {
    id: 'feelNoPain',
    name: '无惧疼痛',
    polarity: 'buff',
    describe: (v) => `每当你消耗 1 张卡牌时，立即获得 ${v} 点格挡。`,
  },
  darkEmbrace: {
    id: 'darkEmbrace',
    name: '黑暗之拥',
    polarity: 'buff',
    describe: (v) => `每当你消耗 1 张卡牌时，立即抽 ${v} 张牌。`,
  },
  barricade: {
    id: 'barricade',
    name: '壁垒',
    polarity: 'buff',
    describe: () => '你的格挡在每回合开始时不再自动清零。',
  },
  corruption: {
    id: 'corruption',
    name: '腐化',
    polarity: 'buff',
    describe: () => '所有技能牌费用变为 0 点，但打出后将直接消耗。',
  },
  flameBarrier: {
    id: 'flameBarrier',
    name: '火焰屏障',
    polarity: 'buff',
    describe: (v) => `本回合每受到一次敌方攻击，便对攻击者反击 ${v} 点固定伤害。`,
  },
  sadisticNature: {
    id: 'sadisticNature',
    name: '残虐本性',
    polarity: 'buff',
    describe: (v) => `每当你对敌人施加 1 个负面状态（中毒/虚弱/易伤/尸爆）时，对其造成 ${v} 点固定伤害。`,
  },
  tempStrengthDown: {
    id: 'tempStrengthDown',
    name: '力量消退',
    polarity: 'debuff',
    describe: (v) => `本回合结束时，将失去 ${v} 点临时力量。`,
  },
  noDraw: {
    id: 'noDraw',
    name: '禁抽',
    polarity: 'debuff',
    describe: () => '本回合内无法再抽取任何卡牌。',
  },
  confused: {
    id: 'confused',
    name: '混乱',
    polarity: 'debuff',
    describe: () => '每当你抽到一张可打出的卡牌时，其本次能量消耗将在 0 至 3 点间随机重设（X 费牌不受影响）。',
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
  sporeCloud: {
    id: 'sporeCloud',
    name: '孢子云',
    polarity: 'buff',
    describe: (v) => `被击败时爆裂毒孢，使玩家获得 ${v} 层易伤。`,
  },
  angry: {
    id: 'angry',
    name: '愤怒',
    polarity: 'buff',
    describe: (v) => `每当受到玩家的攻击伤害，立即获得 ${v} 点力量。`,
  },
  splitThreshold: {
    id: 'splitThreshold',
    name: '分裂体',
    polarity: 'buff',
    describe: () => '生命值降至 50% 或以下时，将在敌方回合分裂为两只史莱姆并继承当前生命值。',
  },
});
