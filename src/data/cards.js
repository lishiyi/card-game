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
    character: 'shared',
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
    character: 'shared',
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
    character: 'ironclad',
    type: 'attack',
    rarity: 'starter',
    target: 'enemy',
    price: 60,
    base: { cost: 2, damage: 8, hits: 1, applyEnemyStatuses: { vulnerable: 2 } },
    upgraded: { cost: 2, damage: 10, hits: 1, applyEnemyStatuses: { vulnerable: 3 } },
  },

  // === Common Cards (18) ===
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
    upgraded: { cost: 1, block: 9, exhaustHandRandom: 0, exhaustHandChoice: 1 },
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
    base: { cost: 1, block: 5, upgradeHandChoice: 1 },
    upgraded: { cost: 1, block: 5, upgradeHandChoice: 0, upgradeAllHand: true },
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
  wild_strike: {
    id: 'wild_strike',
    name: '狂野打击',
    type: 'attack',
    rarity: 'common',
    target: 'enemy',
    price: 56,
    base: { cost: 1, damage: 12, hits: 1, addDrawCards: [{ cardId: 'wound', count: 1 }] },
    upgraded: { cost: 1, damage: 17, hits: 1, addDrawCards: [{ cardId: 'wound', count: 1 }] },
  },
  sword_boomerang: {
    id: 'sword_boomerang',
    name: '飞剑回旋',
    type: 'attack',
    rarity: 'common',
    target: 'all_enemies',
    price: 55,
    base: { cost: 1, damage: 3, hits: 3, randomEnemyHits: true },
    upgraded: { cost: 1, damage: 3, hits: 4, randomEnemyHits: true },
  },
  perfected_strike: {
    id: 'perfected_strike',
    name: '完美打击',
    type: 'attack',
    rarity: 'common',
    target: 'enemy',
    price: 58,
    base: { cost: 2, damage: 6, hits: 1, bonusDamagePerStrike: 2 },
    upgraded: { cost: 2, damage: 6, hits: 1, bonusDamagePerStrike: 3 },
  },
  clash: {
    id: 'clash',
    name: '交锋',
    type: 'attack',
    rarity: 'common',
    target: 'enemy',
    price: 52,
    base: { cost: 0, damage: 14, hits: 1, requireAllHandAttacks: true },
    upgraded: { cost: 0, damage: 18, hits: 1, requireAllHandAttacks: true },
  },

  // === Uncommon Cards (24) ===
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
  carnage: {
    id: 'carnage',
    name: '残杀',
    type: 'attack',
    rarity: 'uncommon',
    target: 'enemy',
    price: 82,
    ethereal: true,
    base: { cost: 2, ethereal: true, damage: 20, hits: 1 },
    upgraded: { cost: 2, ethereal: true, damage: 28, hits: 1 },
  },
  hemokinesis: {
    id: 'hemokinesis',
    name: '御血术',
    type: 'attack',
    rarity: 'uncommon',
    target: 'enemy',
    price: 76,
    base: { cost: 1, loseHp: 2, damage: 15, hits: 1 },
    upgraded: { cost: 1, loseHp: 2, damage: 20, hits: 1 },
  },
  dropkick: {
    id: 'dropkick',
    name: '飞身踢',
    type: 'attack',
    rarity: 'uncommon',
    target: 'enemy',
    price: 78,
    base: { cost: 1, damage: 5, hits: 1, ifVulnerableBonusEnergy: 1, ifVulnerableDraw: 1 },
    upgraded: { cost: 1, damage: 8, hits: 1, ifVulnerableBonusEnergy: 1, ifVulnerableDraw: 1 },
  },
  spot_weakness: {
    id: 'spot_weakness',
    name: '观察弱点',
    type: 'skill',
    rarity: 'uncommon',
    target: 'enemy',
    price: 80,
    base: { cost: 1, spotWeaknessStrength: 3 },
    upgraded: { cost: 1, spotWeaknessStrength: 4 },
  },
  disarm: {
    id: 'disarm',
    name: '缴械',
    type: 'skill',
    rarity: 'uncommon',
    target: 'enemy',
    price: 84,
    base: { cost: 1, applyEnemyStatuses: { strength: -2 }, exhaust: true },
    upgraded: { cost: 1, applyEnemyStatuses: { strength: -3 }, exhaust: true },
  },
  power_through: {
    id: 'power_through',
    name: '硬撑',
    type: 'skill',
    rarity: 'uncommon',
    target: 'self',
    price: 78,
    base: { cost: 1, addCardsToHand: { cardId: 'wound', count: 2, upgraded: false }, block: 15 },
    upgraded: { cost: 1, addCardsToHand: { cardId: 'wound', count: 2, upgraded: false }, block: 20 },
  },
  evolve: {
    id: 'evolve',
    name: '进化',
    type: 'power',
    rarity: 'uncommon',
    target: 'self',
    price: 78,
    base: { cost: 1, applySelfStatuses: { evolve: 1 } },
    upgraded: { cost: 1, applySelfStatuses: { evolve: 2 } },
  },
  fire_breathing: {
    id: 'fire_breathing',
    name: '火焰吐息',
    type: 'power',
    rarity: 'uncommon',
    target: 'self',
    price: 80,
    base: { cost: 1, applySelfStatuses: { fireBreathing: 6 } },
    upgraded: { cost: 1, applySelfStatuses: { fireBreathing: 10 } },
  },
  rupture: {
    id: 'rupture',
    name: '撕裂',
    type: 'power',
    rarity: 'uncommon',
    target: 'self',
    price: 78,
    base: { cost: 1, applySelfStatuses: { rupture: 1 } },
    upgraded: { cost: 1, applySelfStatuses: { rupture: 2 } },
  },

  // === Rare Cards (12) ===
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
  limit_break: {
    id: 'limit_break',
    name: '突破极限',
    type: 'skill',
    rarity: 'rare',
    target: 'self',
    price: 145,
    base: { cost: 1, doubleStrength: true, exhaust: true },
    upgraded: { cost: 1, doubleStrength: true, exhaust: false },
  },
  feed: {
    id: 'feed',
    name: '狂宴',
    type: 'attack',
    rarity: 'rare',
    target: 'enemy',
    price: 140,
    base: { cost: 1, damage: 10, hits: 1, maxHpOnKill: 3, exhaust: true },
    upgraded: { cost: 1, damage: 12, hits: 1, maxHpOnKill: 4, exhaust: true },
  },
  immolate: {
    id: 'immolate',
    name: '献祭',
    type: 'attack',
    rarity: 'rare',
    target: 'all_enemies',
    price: 145,
    base: {
      cost: 2,
      damage: 21,
      hits: 1,
      addDiscardCards: [{ cardId: 'burn', count: 1 }],
    },
    upgraded: {
      cost: 2,
      damage: 28,
      hits: 1,
      addDiscardCards: [{ cardId: 'burn', count: 1 }],
    },
  },
  juggernaut: {
    id: 'juggernaut',
    name: '势不可挡',
    type: 'power',
    rarity: 'rare',
    target: 'self',
    price: 138,
    base: { cost: 2, applySelfStatuses: { juggernaut: 5 } },
    upgraded: { cost: 2, applySelfStatuses: { juggernaut: 7 } },
  },

  // === The Silent Cards (Starter: 2, Special Token: 1, Common: 18, Uncommon: 22, Rare: 12) ===
  neutralize: {
    id: 'neutralize',
    name: '中和',
    character: 'silent',
    type: 'attack',
    rarity: 'starter',
    target: 'enemy',
    price: 55,
    base: { cost: 0, damage: 3, hits: 1, applyEnemyStatuses: { weak: 1 } },
    upgraded: { cost: 0, damage: 4, hits: 1, applyEnemyStatuses: { weak: 2 } },
  },
  survivor: {
    id: 'survivor',
    name: '幸存者',
    character: 'silent',
    type: 'skill',
    rarity: 'starter',
    target: 'self',
    price: 55,
    base: { cost: 1, block: 8, discardHand: 1 },
    upgraded: { cost: 1, block: 11, discardHand: 1 },
  },
  shiv: {
    id: 'shiv',
    name: '小刀',
    character: 'silent',
    type: 'attack',
    rarity: 'special',
    target: 'enemy',
    price: 0,
    isShiv: true,
    base: { cost: 0, damage: 4, hits: 1, exhaust: true, isShiv: true },
    upgraded: { cost: 0, damage: 6, hits: 1, exhaust: true, isShiv: true },
  },

  // --- Silent Common (18) ---
  deadly_poison: {
    id: 'deadly_poison',
    name: '致命毒药',
    character: 'silent',
    type: 'skill',
    rarity: 'common',
    target: 'enemy',
    price: 54,
    base: { cost: 1, applyEnemyStatuses: { poison: 5 } },
    upgraded: { cost: 1, applyEnemyStatuses: { poison: 7 } },
  },
  poisoned_stab: {
    id: 'poisoned_stab',
    name: '涂毒匕首',
    character: 'silent',
    type: 'attack',
    rarity: 'common',
    target: 'enemy',
    price: 56,
    base: { cost: 1, damage: 6, hits: 1, applyEnemyStatuses: { poison: 3 } },
    upgraded: { cost: 1, damage: 8, hits: 1, applyEnemyStatuses: { poison: 4 } },
  },
  bane: {
    id: 'bane',
    name: '灾祸',
    character: 'silent',
    type: 'attack',
    rarity: 'common',
    target: 'enemy',
    price: 56,
    base: { cost: 1, damage: 7, hits: 1, bonusHitIfPoisoned: true },
    upgraded: { cost: 1, damage: 10, hits: 1, bonusHitIfPoisoned: true },
  },
  blade_dance: {
    id: 'blade_dance',
    name: '刀刃之舞',
    character: 'silent',
    type: 'skill',
    rarity: 'common',
    target: 'self',
    price: 58,
    base: { cost: 1, addCardsToHand: { cardId: 'shiv', count: 3, upgraded: false } },
    upgraded: { cost: 1, addCardsToHand: { cardId: 'shiv', count: 4, upgraded: false } },
  },
  cloak_and_dagger: {
    id: 'cloak_and_dagger',
    name: '斗篷与匕首',
    character: 'silent',
    type: 'skill',
    rarity: 'common',
    target: 'self',
    price: 56,
    base: { cost: 1, block: 6, addCardsToHand: { cardId: 'shiv', count: 1, upgraded: false } },
    upgraded: { cost: 1, block: 6, addCardsToHand: { cardId: 'shiv', count: 2, upgraded: false } },
  },
  dagger_throw: {
    id: 'dagger_throw',
    name: '飞刀投掷',
    character: 'silent',
    type: 'attack',
    rarity: 'common',
    target: 'enemy',
    price: 54,
    base: { cost: 1, damage: 9, hits: 1, draw: 1, discardHand: 1 },
    upgraded: { cost: 1, damage: 12, hits: 1, draw: 1, discardHand: 1 },
  },
  acrobatics: {
    id: 'acrobatics',
    name: '杂技',
    character: 'silent',
    type: 'skill',
    rarity: 'common',
    target: 'self',
    price: 54,
    base: { cost: 1, draw: 3, discardHand: 1 },
    upgraded: { cost: 1, draw: 4, discardHand: 1 },
  },
  prepared: {
    id: 'prepared',
    name: '早有准备',
    character: 'silent',
    type: 'skill',
    rarity: 'common',
    target: 'self',
    price: 52,
    base: { cost: 0, draw: 1, discardHand: 1 },
    upgraded: { cost: 0, draw: 2, discardHand: 2 },
  },
  backflip: {
    id: 'backflip',
    name: '后空翻',
    character: 'silent',
    type: 'skill',
    rarity: 'common',
    target: 'self',
    price: 55,
    base: { cost: 1, block: 5, draw: 2 },
    upgraded: { cost: 1, block: 8, draw: 2 },
  },
  dagger_spray: {
    id: 'dagger_spray',
    name: '飞刀齐射',
    character: 'silent',
    type: 'attack',
    rarity: 'common',
    target: 'all_enemies',
    price: 55,
    base: { cost: 1, damage: 4, hits: 2 },
    upgraded: { cost: 1, damage: 6, hits: 2 },
  },
  slice: {
    id: 'slice',
    name: '割裂',
    character: 'silent',
    type: 'attack',
    rarity: 'common',
    target: 'enemy',
    price: 50,
    base: { cost: 0, damage: 6, hits: 1 },
    upgraded: { cost: 0, damage: 9, hits: 1 },
  },
  sneaky_strike: {
    id: 'sneaky_strike',
    name: '隐秘打击',
    character: 'silent',
    type: 'attack',
    rarity: 'common',
    target: 'enemy',
    price: 58,
    base: { cost: 2, damage: 12, hits: 1, refundEnergyIfDiscarded: 2 },
    upgraded: { cost: 2, damage: 16, hits: 1, refundEnergyIfDiscarded: 2 },
  },
  flying_knee: {
    id: 'flying_knee',
    name: '飞膝',
    character: 'silent',
    type: 'attack',
    rarity: 'common',
    target: 'enemy',
    price: 54,
    base: { cost: 1, damage: 8, hits: 1, applySelfStatuses: { energized: 1 } },
    upgraded: { cost: 1, damage: 11, hits: 1, applySelfStatuses: { energized: 1 } },
  },
  quick_slash: {
    id: 'quick_slash',
    name: '快斩',
    character: 'silent',
    type: 'attack',
    rarity: 'common',
    target: 'enemy',
    price: 54,
    base: { cost: 1, damage: 8, hits: 1, draw: 1 },
    upgraded: { cost: 1, damage: 12, hits: 1, draw: 1 },
  },
  sucker_punch: {
    id: 'sucker_punch',
    name: '偷袭',
    character: 'silent',
    type: 'attack',
    rarity: 'common',
    target: 'enemy',
    price: 54,
    base: { cost: 1, damage: 7, hits: 1, applyEnemyStatuses: { weak: 1 } },
    upgraded: { cost: 1, damage: 9, hits: 1, applyEnemyStatuses: { weak: 2 } },
  },
  dodge_and_roll: {
    id: 'dodge_and_roll',
    name: '闪躲翻滚',
    character: 'silent',
    type: 'skill',
    rarity: 'common',
    target: 'self',
    price: 54,
    base: { cost: 1, block: 4, gainSameBlockNextTurn: true },
    upgraded: { cost: 1, block: 6, gainSameBlockNextTurn: true },
  },
  piercing_wail: {
    id: 'piercing_wail',
    name: '刺耳尖啸',
    character: 'silent',
    type: 'skill',
    rarity: 'common',
    target: 'all_enemies',
    price: 60,
    base: { cost: 1, tempEnemyStrengthLoss: 6, exhaust: true },
    upgraded: { cost: 1, tempEnemyStrengthLoss: 8, exhaust: true },
  },
  deflect: {
    id: 'deflect',
    name: '偏折',
    character: 'silent',
    type: 'skill',
    rarity: 'common',
    target: 'self',
    price: 50,
    base: { cost: 0, block: 4 },
    upgraded: { cost: 0, block: 7 },
  },

  // --- Silent Uncommon (22) ---
  bouncing_flask: {
    id: 'bouncing_flask',
    name: '弹跳药瓶',
    character: 'silent',
    type: 'skill',
    rarity: 'uncommon',
    target: 'all_enemies',
    price: 80,
    base: { cost: 2, bouncePoison: 3, bounces: 3 },
    upgraded: { cost: 2, bouncePoison: 3, bounces: 4 },
  },
  crippling_cloud: {
    id: 'crippling_cloud',
    name: '致残毒云',
    character: 'silent',
    type: 'skill',
    rarity: 'uncommon',
    target: 'all_enemies',
    price: 82,
    base: { cost: 2, applyEnemyStatuses: { poison: 4, weak: 2 }, exhaust: true },
    upgraded: { cost: 2, applyEnemyStatuses: { poison: 7, weak: 2 }, exhaust: true },
  },
  noxious_fumes: {
    id: 'noxious_fumes',
    name: '毒雾',
    character: 'silent',
    type: 'power',
    rarity: 'uncommon',
    target: 'self',
    price: 80,
    base: { cost: 1, applySelfStatuses: { noxiousFumes: 2 } },
    upgraded: { cost: 1, applySelfStatuses: { noxiousFumes: 3 } },
  },
  catalyst: {
    id: 'catalyst',
    name: '催化剂',
    character: 'silent',
    type: 'skill',
    rarity: 'uncommon',
    target: 'enemy',
    price: 86,
    base: { cost: 1, multiplyPoison: 2, exhaust: true },
    upgraded: { cost: 1, multiplyPoison: 3, exhaust: true },
  },
  accuracy: {
    id: 'accuracy',
    name: '精准',
    character: 'silent',
    type: 'power',
    rarity: 'uncommon',
    target: 'self',
    price: 82,
    base: { cost: 1, applySelfStatuses: { accuracy: 4 } },
    upgraded: { cost: 1, applySelfStatuses: { accuracy: 6 } },
  },
  infinite_blades: {
    id: 'infinite_blades',
    name: '无尽刀刃',
    character: 'silent',
    type: 'power',
    rarity: 'uncommon',
    target: 'self',
    price: 78,
    base: { cost: 1, applySelfStatuses: { infiniteBlades: 1 } },
    upgraded: { cost: 1, innate: true, applySelfStatuses: { infiniteBlades: 1 } },
  },
  finisher: {
    id: 'finisher',
    name: '终结技',
    character: 'silent',
    type: 'attack',
    rarity: 'uncommon',
    target: 'enemy',
    price: 82,
    base: { cost: 1, damage: 6, hitsPerAttackPlayedThisTurn: true },
    upgraded: { cost: 1, damage: 8, hitsPerAttackPlayedThisTurn: true },
  },
  eviscerate: {
    id: 'eviscerate',
    name: '内脏切除',
    character: 'silent',
    type: 'attack',
    rarity: 'uncommon',
    target: 'enemy',
    price: 84,
    base: { cost: 3, damage: 7, hits: 3, reduceCostPerDiscardThisTurn: true },
    upgraded: { cost: 3, damage: 9, hits: 3, reduceCostPerDiscardThisTurn: true },
  },
  calculated_gamble: {
    id: 'calculated_gamble',
    name: '计算下注',
    character: 'silent',
    type: 'skill',
    rarity: 'uncommon',
    target: 'self',
    price: 78,
    base: { cost: 0, gambleDiscardAll: true, exhaust: true },
    upgraded: { cost: 0, gambleDiscardAll: true, exhaust: false },
  },
  tactician: {
    id: 'tactician',
    name: '战术大师',
    character: 'silent',
    type: 'skill',
    rarity: 'uncommon',
    target: 'none',
    unplayable: true,
    price: 76,
    base: { cost: null, unplayable: true, onDiscardGainEnergy: 1 },
    upgraded: { cost: null, unplayable: true, onDiscardGainEnergy: 2 },
  },
  reflex: {
    id: 'reflex',
    name: '本能反应',
    character: 'silent',
    type: 'skill',
    rarity: 'uncommon',
    target: 'none',
    unplayable: true,
    price: 76,
    base: { cost: null, unplayable: true, onDiscardDraw: 2 },
    upgraded: { cost: null, unplayable: true, onDiscardDraw: 3 },
  },
  footwork: {
    id: 'footwork',
    name: '灵动步法',
    character: 'silent',
    type: 'power',
    rarity: 'uncommon',
    target: 'self',
    price: 82,
    base: { cost: 1, applySelfStatuses: { dexterity: 2 } },
    upgraded: { cost: 1, applySelfStatuses: { dexterity: 3 } },
  },
  leg_sweep: {
    id: 'leg_sweep',
    name: '扫腿',
    character: 'silent',
    type: 'skill',
    rarity: 'uncommon',
    target: 'enemy',
    price: 78,
    base: { cost: 2, block: 11, applyEnemyStatuses: { weak: 2 } },
    upgraded: { cost: 2, block: 14, applyEnemyStatuses: { weak: 3 } },
  },
  backstab: {
    id: 'backstab',
    name: '背刺',
    character: 'silent',
    type: 'attack',
    rarity: 'uncommon',
    target: 'enemy',
    price: 78,
    innate: true,
    base: { cost: 0, innate: true, damage: 11, hits: 1, exhaust: true },
    upgraded: { cost: 0, innate: true, damage: 15, hits: 1, exhaust: true },
  },
  dash: {
    id: 'dash',
    name: '冲刺',
    character: 'silent',
    type: 'attack',
    rarity: 'uncommon',
    target: 'enemy',
    price: 82,
    base: { cost: 2, block: 10, damage: 10, hits: 1 },
    upgraded: { cost: 2, block: 13, damage: 13, hits: 1 },
  },
  skewer: {
    id: 'skewer',
    name: '串烧',
    character: 'silent',
    type: 'attack',
    rarity: 'uncommon',
    target: 'enemy',
    price: 80,
    base: { cost: 'X', isXCost: true, damage: 7 },
    upgraded: { cost: 'X', isXCost: true, damage: 10 },
  },
  predator: {
    id: 'predator',
    name: '猎杀者',
    character: 'silent',
    type: 'attack',
    rarity: 'uncommon',
    target: 'enemy',
    price: 80,
    base: { cost: 2, damage: 15, hits: 1, applySelfStatuses: { drawCardNextTurn: 2 } },
    upgraded: { cost: 2, damage: 20, hits: 1, applySelfStatuses: { drawCardNextTurn: 2 } },
  },
  blur: {
    id: 'blur',
    name: '残影',
    character: 'silent',
    type: 'skill',
    rarity: 'uncommon',
    target: 'self',
    price: 80,
    base: { cost: 1, block: 5, applySelfStatuses: { blur: 1 } },
    upgraded: { cost: 1, block: 8, applySelfStatuses: { blur: 1 } },
  },
  escape_plan: {
    id: 'escape_plan',
    name: '逃脱计划',
    character: 'silent',
    type: 'skill',
    rarity: 'uncommon',
    target: 'self',
    price: 78,
    base: { cost: 0, draw: 1, drawSkillGainBlock: 3 },
    upgraded: { cost: 0, draw: 1, drawSkillGainBlock: 5 },
  },
  terror: {
    id: 'terror',
    name: '恐怖',
    character: 'silent',
    type: 'skill',
    rarity: 'uncommon',
    target: 'enemy',
    price: 82,
    base: { cost: 1, applyEnemyStatuses: { vulnerable: 99 }, exhaust: true },
    upgraded: { cost: 0, applyEnemyStatuses: { vulnerable: 99 }, exhaust: true },
  },
  caltrops: {
    id: 'caltrops',
    name: '铁蒺藜',
    character: 'silent',
    type: 'power',
    rarity: 'uncommon',
    target: 'self',
    price: 78,
    base: { cost: 1, applySelfStatuses: { thorns: 3 } },
    upgraded: { cost: 1, applySelfStatuses: { thorns: 5 } },
  },
  concentrate: {
    id: 'concentrate',
    name: '全神贯注',
    character: 'silent',
    type: 'skill',
    rarity: 'uncommon',
    target: 'self',
    price: 76,
    base: { cost: 0, discardHand: 3, gainEnergy: 2 },
    upgraded: { cost: 0, discardHand: 2, gainEnergy: 2 },
  },

  // --- Silent Rare (8) ---
  corpse_explosion: {
    id: 'corpse_explosion',
    name: '尸爆术',
    character: 'silent',
    type: 'skill',
    rarity: 'rare',
    target: 'enemy',
    price: 142,
    base: { cost: 2, applyEnemyStatuses: { poison: 6, corpseExplosion: 1 } },
    upgraded: { cost: 2, applyEnemyStatuses: { poison: 9, corpseExplosion: 1 } },
  },
  envenom: {
    id: 'envenom',
    name: '涂毒',
    character: 'silent',
    type: 'power',
    rarity: 'rare',
    target: 'self',
    price: 138,
    base: { cost: 2, applySelfStatuses: { envenom: 1 } },
    upgraded: { cost: 1, applySelfStatuses: { envenom: 1 } },
  },
  after_image: {
    id: 'after_image',
    name: '余像',
    character: 'silent',
    type: 'power',
    rarity: 'rare',
    target: 'self',
    price: 145,
    base: { cost: 1, applySelfStatuses: { afterImage: 1 } },
    upgraded: { cost: 1, innate: true, applySelfStatuses: { afterImage: 1 } },
  },
  a_thousand_cuts: {
    id: 'a_thousand_cuts',
    name: '凌迟',
    character: 'silent',
    type: 'power',
    rarity: 'rare',
    target: 'self',
    price: 136,
    base: { cost: 2, applySelfStatuses: { thousandCuts: 1 } },
    upgraded: { cost: 2, applySelfStatuses: { thousandCuts: 2 } },
  },
  adrenaline: {
    id: 'adrenaline',
    name: '肾上腺素',
    character: 'silent',
    type: 'skill',
    rarity: 'rare',
    target: 'self',
    price: 145,
    base: { cost: 0, gainEnergy: 1, draw: 2, exhaust: true },
    upgraded: { cost: 0, gainEnergy: 2, draw: 2, exhaust: true },
  },
  storm_of_steel: {
    id: 'storm_of_steel',
    name: '钢铁风暴',
    character: 'silent',
    type: 'skill',
    rarity: 'rare',
    target: 'self',
    price: 134,
    base: { cost: 1, discardAllForShivs: true, shivUpgraded: false },
    upgraded: { cost: 1, discardAllForShivs: true, shivUpgraded: true },
  },
  wraith_form: {
    id: 'wraith_form',
    name: '幽魂形态',
    character: 'silent',
    type: 'power',
    rarity: 'rare',
    target: 'self',
    price: 150,
    base: { cost: 3, applySelfStatuses: { intangible: 2, wraithForm: 1 } },
    upgraded: { cost: 3, applySelfStatuses: { intangible: 3, wraithForm: 1 } },
  },
  tools_of_the_trade: {
    id: 'tools_of_the_trade',
    name: '独门秘技',
    character: 'silent',
    type: 'power',
    rarity: 'rare',
    target: 'self',
    price: 132,
    base: { cost: 1, applySelfStatuses: { toolsOfTheTrade: 1 } },
    upgraded: { cost: 0, applySelfStatuses: { toolsOfTheTrade: 1 } },
  },
  glass_knife: {
    id: 'glass_knife',
    name: '玻璃刀刃',
    character: 'silent',
    type: 'attack',
    rarity: 'rare',
    target: 'enemy',
    price: 142,
    base: { cost: 1, damage: 8, hits: 2, damageDecayPerPlay: 2 },
    upgraded: { cost: 1, damage: 12, hits: 2, damageDecayPerPlay: 2 },
  },
  burst: {
    id: 'burst',
    name: '爆发',
    character: 'silent',
    type: 'skill',
    rarity: 'rare',
    target: 'self',
    price: 145,
    base: { cost: 1, applySelfStatuses: { burst: 1 }, noBurst: true },
    upgraded: { cost: 1, applySelfStatuses: { burst: 2 }, noBurst: true },
  },
  malaise: {
    id: 'malaise',
    name: '萎靡',
    character: 'silent',
    type: 'skill',
    rarity: 'rare',
    target: 'enemy',
    price: 142,
    base: {
      cost: 'X',
      isXCost: true,
      xEnemyStrengthLoss: true,
      xEnemyWeak: true,
      xBonus: 0,
      exhaust: true,
    },
    upgraded: {
      cost: 'X',
      isXCost: true,
      xEnemyStrengthLoss: true,
      xEnemyWeak: true,
      xBonus: 1,
      exhaust: true,
    },
  },
  alchemize: {
    id: 'alchemize',
    name: '炼金术',
    character: 'silent',
    type: 'skill',
    rarity: 'rare',
    target: 'self',
    price: 138,
    base: { cost: 1, obtainRandomPotion: true, exhaust: true },
    upgraded: { cost: 0, obtainRandomPotion: true, exhaust: true },
  },

  // === Shop-Exclusive Colorless Cards (Uncommon: 6, Rare: 4) ===
  flash_of_steel: {
    id: 'flash_of_steel',
    name: '寒光一闪',
    character: 'colorless',
    shopOnly: true,
    type: 'attack',
    rarity: 'uncommon',
    target: 'enemy',
    price: 92,
    base: { cost: 0, damage: 3, hits: 1, draw: 1 },
    upgraded: { cost: 0, damage: 6, hits: 1, draw: 1 },
  },
  finesse: {
    id: 'finesse',
    name: '技巧',
    character: 'colorless',
    shopOnly: true,
    type: 'skill',
    rarity: 'uncommon',
    target: 'self',
    price: 92,
    base: { cost: 0, block: 2, draw: 1 },
    upgraded: { cost: 0, block: 4, draw: 1 },
  },
  dramatic_entrance: {
    id: 'dramatic_entrance',
    name: '华丽登场',
    character: 'colorless',
    shopOnly: true,
    type: 'attack',
    rarity: 'uncommon',
    target: 'all_enemies',
    price: 90,
    innate: true,
    base: { cost: 0, innate: true, damage: 8, hits: 1, exhaust: true },
    upgraded: { cost: 0, innate: true, damage: 12, hits: 1, exhaust: true },
  },
  blind: {
    id: 'blind',
    name: '致盲',
    character: 'colorless',
    shopOnly: true,
    type: 'skill',
    rarity: 'uncommon',
    target: 'enemy',
    price: 88,
    base: { cost: 0, target: 'enemy', applyEnemyStatuses: { weak: 2 } },
    upgraded: { cost: 0, target: 'all_enemies', applyEnemyStatuses: { weak: 2 } },
  },
  trip: {
    id: 'trip',
    name: '绊倒',
    character: 'colorless',
    shopOnly: true,
    type: 'skill',
    rarity: 'uncommon',
    target: 'enemy',
    price: 90,
    base: { cost: 0, target: 'enemy', applyEnemyStatuses: { vulnerable: 2 } },
    upgraded: { cost: 0, target: 'all_enemies', applyEnemyStatuses: { vulnerable: 2 } },
  },
  bandage_up: {
    id: 'bandage_up',
    name: '包扎',
    character: 'colorless',
    shopOnly: true,
    type: 'skill',
    rarity: 'uncommon',
    target: 'self',
    price: 96,
    base: { cost: 0, healHp: 4, exhaust: true },
    upgraded: { cost: 0, healHp: 6, exhaust: true },
  },
  apotheosis: {
    id: 'apotheosis',
    name: '神化',
    character: 'colorless',
    shopOnly: true,
    type: 'skill',
    rarity: 'rare',
    target: 'self',
    price: 168,
    base: { cost: 2, upgradeAllCombatCards: true, exhaust: true },
    upgraded: { cost: 1, upgradeAllCombatCards: true, exhaust: true },
  },
  hand_of_greed: {
    id: 'hand_of_greed',
    name: '贪婪之手',
    character: 'colorless',
    shopOnly: true,
    type: 'attack',
    rarity: 'rare',
    target: 'enemy',
    price: 165,
    base: { cost: 2, damage: 20, hits: 1, goldOnKill: 20 },
    upgraded: { cost: 2, damage: 25, hits: 1, goldOnKill: 25 },
  },
  master_of_strategy: {
    id: 'master_of_strategy',
    name: '战略大师',
    character: 'colorless',
    shopOnly: true,
    type: 'skill',
    rarity: 'rare',
    target: 'self',
    price: 158,
    base: { cost: 0, draw: 3, exhaust: true },
    upgraded: { cost: 0, draw: 4, exhaust: true },
  },
  sadistic_nature: {
    id: 'sadistic_nature',
    name: '残虐本性',
    character: 'colorless',
    shopOnly: true,
    type: 'power',
    rarity: 'rare',
    target: 'self',
    price: 155,
    base: { cost: 0, applySelfStatuses: { sadisticNature: 5 } },
    upgraded: { cost: 0, applySelfStatuses: { sadisticNature: 7 } },
  },
  apparition: {
    id: 'apparition',
    name: '幽灵化',
    character: 'colorless',
    type: 'skill',
    rarity: 'special',
    target: 'self',
    price: 0,
    base: { cost: 1, ethereal: true, exhaust: true, applySelfStatuses: { intangible: 1 } },
    upgraded: { cost: 1, ethereal: false, exhaust: true, applySelfStatuses: { intangible: 1 } },
  },

  // === Status Cards ===
  slimed: {
    id: 'slimed',
    name: '黏液',
    character: 'neutral',
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
    character: 'neutral',
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
    character: 'neutral',
    type: 'status',
    rarity: 'status',
    target: 'none',
    unplayable: true,
    price: 0,
    base: { cost: null, unplayable: true, endOfTurnSelfDamage: 2 },
    upgraded: null,
  },
  wound: {
    id: 'wound',
    name: '伤口',
    character: 'neutral',
    type: 'status',
    rarity: 'status',
    target: 'none',
    unplayable: true,
    price: 0,
    base: { cost: null, unplayable: true },
    upgraded: null,
  },

  // === Curse Cards ===
  clumsy: {
    id: 'clumsy',
    name: '笨拙',
    character: 'neutral',
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
    character: 'neutral',
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
    character: 'neutral',
    type: 'curse',
    rarity: 'curse',
    target: 'none',
    unplayable: true,
    price: 0,
    base: { cost: null, unplayable: true, endOfTurnLoseHp: 2 },
    upgraded: null,
  },
});

export function getCardCharacter(def) {
  if (!def) return 'ironclad';
  if (def.character) return def.character;
  if (def.type === 'status' || def.type === 'curse') return 'neutral';
  return 'ironclad';
}

export function getRewardCardPools(characterId = 'ironclad') {
  const byChar = Object.values(CARD_LIBRARY).filter((c) => getCardCharacter(c) === characterId);
  return {
    common: byChar.filter((c) => c.rarity === 'common').map((c) => c.id),
    uncommon: byChar.filter((c) => c.rarity === 'uncommon').map((c) => c.id),
    rare: byChar.filter((c) => c.rarity === 'rare').map((c) => c.id),
  };
}

export function getColorlessCardPools() {
  const colorless = Object.values(CARD_LIBRARY).filter((c) => getCardCharacter(c) === 'colorless');
  const uncommon = colorless.filter((c) => c.rarity === 'uncommon').map((c) => c.id);
  const rare = colorless.filter((c) => c.rarity === 'rare').map((c) => c.id);
  return {
    uncommon,
    rare,
    all: [...uncommon, ...rare],
  };
}

export const COLORLESS_CARD_POOLS = deepFreeze(getColorlessCardPools());

export const REWARD_CARD_POOLS = deepFreeze(getRewardCardPools('ironclad'));

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

export function isStrikeCard(cardId) {
  const def = CARD_LIBRARY[cardId];
  return Boolean(def && (cardId.includes('strike') || def.name.includes('打击')));
}

export function countCombatStrikeCards(combat) {
  if (!combat) return 0;
  const all = [...(combat.hand || []), ...(combat.drawPile || []), ...(combat.discardPile || [])];
  return all.filter((c) => isStrikeCard(c.cardId)).length;
}

export function getCardStats(cardInstance) {
  const def = CARD_LIBRARY[cardInstance?.cardId];
  if (!def) {
    throw new Error(`Unknown cardId on instance: ${cardInstance?.cardId}`);
  }
  const isUpgraded = Boolean(cardInstance.upgraded && def.upgraded);
  const rawStats = isUpgraded ? { ...def.base, ...def.upgraded } : { ...def.base };
  if (typeof cardInstance.combatDamageMod === 'number' && typeof rawStats.damage === 'number') {
    rawStats.damage = Math.max(0, rawStats.damage + cardInstance.combatDamageMod);
  }
  const costReduced = Boolean(
    isUpgraded &&
      typeof def.base.cost === 'number' &&
      typeof rawStats.cost === 'number' &&
      rawStats.cost < def.base.cost
  );

  return {
    instanceId: cardInstance.instanceId,
    cardId: def.id,
    character: getCardCharacter(def),
    name: isUpgraded ? `${def.name}+` : def.name,
    baseName: def.name,
    upgraded: isUpgraded,
    baseCost: def.base.cost,
    combatCost: typeof cardInstance.combatCost === 'number' ? cardInstance.combatCost : null,
    costReduced,
    type: def.type,
    rarity: def.rarity,
    shopOnly: Boolean(def.shopOnly),
    price: def.price ?? 50,
    isShiv: Boolean(def.isShiv || rawStats.isShiv),
    unplayable: Boolean(def.unplayable || rawStats.unplayable),
    ethereal: Boolean(def.ethereal || rawStats.ethereal),
    innate: Boolean(def.innate || rawStats.innate),
    retain: Boolean(def.retain || rawStats.retain),
    ...rawStats,
    target: rawStats.target || def.target,
  };
}

export function getEffectiveCardCost(stats, player = null, combat = null) {
  if (
    stats.unplayable &&
    stats.type === 'status' &&
    Array.isArray(player?.relics) &&
    player.relics.includes('medical_kit')
  ) {
    return 0;
  }
  if (stats.unplayable || stats.cost === null) return null;
  if (stats.isXCost) return 'X';
  if (stats.type === 'skill' && (player?.statuses?.corruption ?? 0) > 0) {
    return 0;
  }
  let base = typeof stats.combatCost === 'number' ? Math.max(0, stats.combatCost) : (stats.cost ?? 0);
  if (stats.reduceCostPerDiscardThisTurn && combat) {
    base = Math.max(0, base - (combat.discardedThisTurn ?? 0));
  }
  return base;
}

/**
 * Single source of truth for flat per-hit attack bonuses (Accuracy on Shivs, Wrist Blade on 0-cost attacks, Vigor).
 */
export function getCardAttackFlatBonus(stats, player = null, combat = null) {
  if (!stats || stats.type !== 'attack' || !player) return 0;
  let bonus = 0;
  if (stats.isShiv && (player.statuses?.accuracy ?? 0) > 0) {
    bonus += player.statuses.accuracy;
  }
  if ((player.statuses?.vigor ?? 0) > 0) {
    bonus += player.statuses.vigor;
  }
  if (Array.isArray(player.relics) && player.relics.includes('wrist_blade')) {
    const effCost = getEffectiveCardCost(stats, player, combat);
    if (effCost === 0) {
      bonus += 4;
    }
  }
  return bonus;
}

export function formatCardDescription(cardInstance, combatContext = null) {
  const stats = getCardStats(cardInstance);
  const player = combatContext?.player ?? null;
  const targetEnemy = combatContext?.targetEnemy ?? null;
  const combat = combatContext?.combat ?? null;

  let rawDamageBase = stats.damage ?? stats.exhaustAllHandDamageEach ?? null;
  let strikeBonusTotal = 0;
  if (typeof stats.bonusDamagePerStrike === 'number' && combat && typeof rawDamageBase === 'number') {
    strikeBonusTotal = stats.bonusDamagePerStrike * countCombatStrikeCards(combat);
    rawDamageBase += strikeBonusTotal;
  }
  const flatBonus = getCardAttackFlatBonus(stats, player, combat);
  let displayDamage = rawDamageBase;
  let damageState = 'normal';

  if (stats.useBlockAsDamage) {
    const baseFromBlock = player ? player.block : 0;
    displayDamage = player
      ? calculateAttackDamage(baseFromBlock, player, targetEnemy, { flatBonus })
      : 0;
    if (player && displayDamage > baseFromBlock) damageState = 'boosted';
    else if (player && displayDamage < baseFromBlock) damageState = 'reduced';
  } else if (typeof rawDamageBase === 'number') {
    if (player) {
      displayDamage = calculateAttackDamage(rawDamageBase, player, targetEnemy, {
        strengthMultiplier: stats.strengthMultiplier ?? 1,
        flatBonus,
      });
      const baselineDamage = stats.damage ?? rawDamageBase;
      if (displayDamage > baselineDamage) damageState = 'boosted';
      else if (displayDamage < baselineDamage) damageState = 'reduced';
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
  const displaySkillBonusBlock =
    typeof stats.drawSkillGainBlock === 'number'
      ? player
        ? calculateCardBlock(stats.drawSkillGainBlock, player)
        : stats.drawSkillGainBlock
      : null;
  if (displaySkillBonusBlock !== null && player) {
    if (displaySkillBonusBlock > stats.drawSkillGainBlock) blockState = 'boosted';
    else if (displaySkillBonusBlock < stats.drawSkillGainBlock && blockState === 'normal') blockState = 'reduced';
  }

  const hasSneckoSkull = Boolean(Array.isArray(player?.relics) && player.relics.includes('snecko_skull'));
  const poisonDisplay = (val) => (hasSneckoSkull ? val + 1 : val);

  const parts = [];

  if (stats.innate) {
    parts.push('固有。');
  }
  if (stats.retain) {
    parts.push('保留。');
  }
  if (stats.requireAllHandAttacks) {
    parts.push('只有当手牌中全是攻击牌时才能打出。');
  }
  if (stats.unplayable) {
    if (
      stats.type === 'status' &&
      Array.isArray(player?.relics) &&
      player.relics.includes('medical_kit')
    ) {
      parts.push('【医疗箱】可 0 费打出并消耗。');
    } else {
      parts.push('不能被打出。');
      if (
        stats.type === 'status' &&
        !stats.ethereal &&
        !stats.endOfTurnSelfDamage &&
        !stats.endOfTurnLoseHp &&
        !stats.endOfTurnWeak
      ) {
        parts.push('滞留牌堆直到被消耗或战斗结束。');
      }
    }
  }
  if (stats.onDiscardGainEnergy) {
    parts.push(`每当你主动弃掉本牌时，获得 ${stats.onDiscardGainEnergy} 点能量。`);
  }
  if (stats.onDiscardDraw) {
    parts.push(`每当你主动弃掉本牌时，抽 ${stats.onDiscardDraw} 张牌。`);
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
  if (stats.healHp) {
    parts.push(`回复 ${stats.healHp} 点生命。`);
  }
  if (stats.gainEnergy) {
    parts.push(`获得 ${stats.gainEnergy} 点能量。`);
  }
  if (stats.addCardsToHand) {
    const tokenDef = CARD_LIBRARY[stats.addCardsToHand.cardId];
    const tokenName = tokenDef
      ? stats.addCardsToHand.upgraded
        ? `${tokenDef.name}+`
        : tokenDef.name
      : stats.addCardsToHand.cardId;
    if (stats.addCardsToHand.cardId === 'wound') {
      parts.push(`将 ${stats.addCardsToHand.count} 张【${tokenName}】加入手牌。`);
    }
  }
  if (typeof stats.block === 'number') {
    if (stats.gainSameBlockNextTurn) {
      parts.push(`获得 ${displayBlock} 点格挡，并在下回合开始时再获得 ${displayBlock} 点格挡。`);
    } else {
      parts.push(`获得 ${displayBlock} 点格挡。`);
    }
  }
  if (stats.doubleBlock) {
    parts.push('将你当前的格挡值翻倍。');
  }
  if (stats.doubleStrength) {
    parts.push('将你当前的【力量】翻倍。');
  }
  if (stats.exhaustHandChoice) {
    parts.push(`从手牌中自选消耗 ${stats.exhaustHandChoice} 张牌。`);
  } else if (stats.exhaustHandRandom) {
    parts.push(
      stats.exhaustHandSmart
        ? '消耗 1 张手牌（优先状态或诅咒牌）。'
        : '随机消耗 1 张手牌。'
    );
  }
  if (stats.exhaustNonAttacksBlockEach) {
    parts.push(`消耗手牌中所有非攻击牌，每张获得 ${displayBlock} 点格挡。`);
  }
  if (stats.upgradeAllCombatCards) {
    parts.push('本场战斗中升级你的所有卡牌（手牌、抽牌堆与弃牌堆）。');
  } else if (stats.upgradeAllHand) {
    parts.push('本场战斗中升级所有手牌。');
  } else if (stats.upgradeHandChoice) {
    parts.push(`本场战斗中从手牌中自选升级 ${stats.upgradeHandChoice} 张牌。`);
  } else if (stats.upgradeHandRandom) {
    parts.push(`本场战斗中随机升级 ${stats.upgradeHandRandom} 张手牌。`);
  }
  if (stats.scry) {
    parts.push(`预见 ${stats.scry}（检视抽牌堆顶 ${stats.scry} 张牌并任意弃置）。`);
  }
  if (stats.exhaustAllHandDamageEach) {
    parts.push(`消耗所有手牌，每张对目标造成 ${displayDamage} 点伤害。`);
  } else if (stats.useBlockAsDamage) {
    const suffix = player ? `（当前 ${displayDamage} 点）` : '';
    parts.push(`造成等同于你当前格挡值的伤害${suffix}。`);
  } else if (stats.hitsPerAttackPlayedThisTurn) {
    const playedNote = combat ? `（本回合已打 ${combat.attacksPlayedThisTurn ?? 0} 张）` : '';
    parts.push(`本回合每打出 1 张攻击牌，造成 ${displayDamage} 点伤害${playedNote}。`);
  } else if (typeof stats.damage === 'number') {
    const targetPhrase = stats.randomEnemyHits
      ? '对随机一名敌人造成'
      : stats.target === 'all_enemies'
        ? '对所有敌人造成'
        : '造成';
    if (stats.isXCost) {
      parts.push(`${targetPhrase} ${displayDamage} 点伤害 X 次。`);
    } else if ((stats.hits ?? 1) > 1) {
      parts.push(`${targetPhrase} ${displayDamage} 点伤害 ${stats.hits} 次。`);
    } else {
      parts.push(`${targetPhrase} ${displayDamage} 点伤害。`);
    }
  }
  if (stats.bonusDamagePerStrike) {
    parts.push(`牌组中每有 1 张名字含“打击”的牌，本牌伤害额外 +${stats.bonusDamagePerStrike}。`);
  }
  if (stats.damageDecayPerPlay) {
    parts.push(`本场战斗每次打出后基础伤害降低 ${stats.damageDecayPerPlay} 点。`);
  }
  if (stats.goldOnKill) {
    parts.push(`若以此牌斩杀敌人，永久获得 ${stats.goldOnKill} 枚金币。`);
  }
  if (stats.maxHpOnKill) {
    parts.push(`若以此牌斩杀敌人，永久提高 ${stats.maxHpOnKill} 点最大生命。`);
  }
  if (stats.bonusHitIfPoisoned) {
    parts.push(`若目标已【中毒】，则再造成 ${displayDamage} 点伤害。`);
  }
  if (stats.ifVulnerableBonusEnergy && stats.ifVulnerableDraw) {
    parts.push(`若目标处于【易伤】状态，获得 ${stats.ifVulnerableBonusEnergy} 点能量并抽 ${stats.ifVulnerableDraw} 张牌。`);
  }
  if (stats.spotWeaknessStrength) {
    parts.push(`若目标的当前意图是攻击，则获得 ${stats.spotWeaknessStrength} 点力量。`);
  }
  if (stats.refundEnergyIfDiscarded) {
    const activeNote = combat && (combat.discardedThisTurn ?? 0) > 0 ? '（已满足！）' : '';
    parts.push(`若本回合你曾主动弃过牌，回复 ${stats.refundEnergyIfDiscarded} 点能量${activeNote}。`);
  }
  if (stats.reduceCostPerDiscardThisTurn) {
    parts.push('本回合每主动弃掉 1 张牌，本牌费用 -1。');
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
  if (stats.bouncePoison && stats.bounces) {
    parts.push(`随机给予敌人 ${poisonDisplay(stats.bouncePoison)} 层中毒，共弹跳 ${stats.bounces} 次。`);
  }
  if (stats.multiplyPoison) {
    parts.push(
      stats.multiplyPoison >= 3
        ? '将目标当前的【中毒】层数变为 3 倍。'
        : '将目标当前的【中毒】层数翻倍。'
    );
  }
  if (stats.tempEnemyStrengthLoss) {
    parts.push(`本回合使所有敌人临时失去 ${stats.tempEnemyStrengthLoss} 点力量。`);
  }
  if (stats.xEnemyStrengthLoss && stats.xEnemyWeak) {
    const xLabel = stats.xBonus ? `X+${stats.xBonus}` : 'X';
    parts.push(`使目标失去 ${xLabel} 点力量并施加 ${xLabel} 层虚弱。`);
  }
  if (stats.applyEnemyStatuses) {
    const targetLabel = stats.target === 'all_enemies' ? '所有敌人' : '目标';
    if (stats.applyEnemyStatuses.poison) {
      parts.push(`给予${targetLabel} ${poisonDisplay(stats.applyEnemyStatuses.poison)} 层中毒。`);
    }
    if (stats.applyEnemyStatuses.corpseExplosion) {
      parts.push('目标死亡时，对所有存活敌人造成等同于其最大生命值的伤害。');
    }
    if (stats.applyEnemyStatuses.weak) {
      parts.push(`给予${targetLabel} ${stats.applyEnemyStatuses.weak} 层虚弱。`);
    }
    if (stats.applyEnemyStatuses.vulnerable) {
      parts.push(`给予${targetLabel} ${stats.applyEnemyStatuses.vulnerable} 层易伤。`);
    }
    if (typeof stats.applyEnemyStatuses.strength === 'number' && stats.applyEnemyStatuses.strength < 0) {
      parts.push(`使${targetLabel}失去 ${Math.abs(stats.applyEnemyStatuses.strength)} 点力量。`);
    }
  }
  if (stats.addCardsToHand && stats.addCardsToHand.cardId !== 'wound') {
    const tokenDef = CARD_LIBRARY[stats.addCardsToHand.cardId];
    const tokenName = tokenDef
      ? stats.addCardsToHand.upgraded
        ? `${tokenDef.name}+`
        : tokenDef.name
      : stats.addCardsToHand.cardId;
    parts.push(`将 ${stats.addCardsToHand.count} 张【${tokenName}】加入手牌。`);
  }
  if (Array.isArray(stats.addDrawCards)) {
    for (const spec of stats.addDrawCards) {
      const cName = CARD_LIBRARY[spec.cardId]?.name || spec.cardId;
      parts.push(`将 ${spec.count} 张【${cName}】洗入抽牌堆。`);
    }
  }
  if (Array.isArray(stats.addDiscardCards)) {
    for (const spec of stats.addDiscardCards) {
      const cName = CARD_LIBRARY[spec.cardId]?.name || spec.cardId;
      parts.push(`将 ${spec.count} 张【${cName}】放入弃牌堆。`);
    }
  }
  if (stats.obtainRandomPotion) {
    parts.push('随机获得 1 瓶药水。');
  }
  if (stats.gambleDiscardAll) {
    parts.push('弃掉所有手牌，然后抽取同等数量的牌。');
  }
  if (stats.discardAllForShivs) {
    parts.push(
      stats.shivUpgraded
        ? '弃掉所有手牌，每弃 1 张便将 1 张【小刀+】加入手牌。'
        : '弃掉所有手牌，每弃 1 张便将 1 张【小刀】加入手牌。'
    );
  }
  if (stats.draw) {
    if (stats.drawSkillGainBlock) {
      parts.push(`抽 ${stats.draw} 张牌；若抽到技能牌，再获得 ${displaySkillBonusBlock} 点格挡。`);
    } else {
      parts.push(`抽 ${stats.draw} 张牌。`);
    }
  }
  if (stats.discardHand) {
    parts.push(`选择并弃掉 ${stats.discardHand} 张手牌。`);
  }
  if (stats.applySelfStatuses) {
    if (stats.applySelfStatuses.strength) {
      parts.push(`获得 ${stats.applySelfStatuses.strength} 点力量。`);
    }
    if (stats.applySelfStatuses.dexterity) {
      parts.push(`获得 ${stats.applySelfStatuses.dexterity} 点敏捷。`);
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
    if (stats.applySelfStatuses.blur) {
      parts.push('你的格挡在下回合开始时不会自动清零。');
    }
    if (stats.applySelfStatuses.energized) {
      parts.push(`下回合获得 ${stats.applySelfStatuses.energized} 点能量。`);
    }
    if (stats.applySelfStatuses.drawCardNextTurn) {
      parts.push(`下回合额外抽 ${stats.applySelfStatuses.drawCardNextTurn} 张牌。`);
    }
    if (stats.applySelfStatuses.evolve) {
      parts.push(`每当你抽到【状态】牌时，抽 ${stats.applySelfStatuses.evolve} 张牌。`);
    }
    if (stats.applySelfStatuses.fireBreathing) {
      parts.push(`每当你抽到【状态】或【诅咒】牌时，对所有敌人造成 ${stats.applySelfStatuses.fireBreathing} 点伤害。`);
    }
    if (stats.applySelfStatuses.rupture) {
      parts.push(`每当你从卡牌中失去生命时，获得 ${stats.applySelfStatuses.rupture} 点力量。`);
    }
    if (stats.applySelfStatuses.juggernaut) {
      parts.push(`每当你获得格挡时，对随机一名敌人造成 ${stats.applySelfStatuses.juggernaut} 点伤害。`);
    }
    if (stats.applySelfStatuses.thorns) {
      parts.push(`每当你被攻击时，反击攻击者 ${stats.applySelfStatuses.thorns} 点伤害。`);
    }
    if (stats.applySelfStatuses.burst) {
      parts.push(`本回合打出的下 ${stats.applySelfStatuses.burst} 张技能牌将额外再打出一次。`);
    }
    if (stats.applySelfStatuses.corruption) {
      parts.push('所有技能牌费用变为 0 点，但打出后将直接消耗。');
    }
    if (stats.applySelfStatuses.flameBarrier) {
      parts.push(`本回合每受一次攻击，反击 ${stats.applySelfStatuses.flameBarrier} 点伤害。`);
    }
    if (stats.applySelfStatuses.sadisticNature) {
      parts.push(`每当你对敌人施加 1 个负面状态时，对其造成 ${stats.applySelfStatuses.sadisticNature} 点伤害。`);
    }
    if (stats.applySelfStatuses.noxiousFumes) {
      parts.push(`每回合开始时，给予所有敌人 ${stats.applySelfStatuses.noxiousFumes} 层中毒。`);
    }
    if (stats.applySelfStatuses.accuracy) {
      parts.push(`【小刀】造成的伤害额外 +${stats.applySelfStatuses.accuracy}。`);
    }
    if (stats.applySelfStatuses.infiniteBlades) {
      parts.push(`每回合开始时，将 ${stats.applySelfStatuses.infiniteBlades} 张【小刀】加入手牌。`);
    }
    if (stats.applySelfStatuses.envenom) {
      parts.push(`每当你造成未格挡的攻击伤害时，给予目标 ${stats.applySelfStatuses.envenom} 层中毒。`);
    }
    if (stats.applySelfStatuses.afterImage) {
      parts.push(`每当你打出一张牌时，获得 ${stats.applySelfStatuses.afterImage} 点格挡。`);
    }
    if (stats.applySelfStatuses.thousandCuts) {
      parts.push(`每当你打出一张牌时，对所有敌人造成 ${stats.applySelfStatuses.thousandCuts} 点伤害。`);
    }
    if (stats.applySelfStatuses.intangible) {
      parts.push(`获得 ${stats.applySelfStatuses.intangible} 层【无实体】（受到的所有伤害降至 1 点）。`);
    }
    if (stats.applySelfStatuses.wraithForm) {
      parts.push(`每回合开始时，失去 ${stats.applySelfStatuses.wraithForm} 点敏捷。`);
    }
    if (stats.applySelfStatuses.toolsOfTheTrade) {
      parts.push(
        `每回合开始时，额外抽 ${stats.applySelfStatuses.toolsOfTheTrade} 张牌并弃掉 ${stats.applySelfStatuses.toolsOfTheTrade} 张手牌。`
      );
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

  const effectiveCost = getEffectiveCardCost(stats, player, combat);
  const corruptedZero =
    stats.type === 'skill' && Boolean(player && (player.statuses?.corruption ?? 0) > 0);
  const costRandomizedNow = typeof stats.combatCost === 'number' && !corruptedZero;
  const costIncreasedNow =
    typeof stats.cost === 'number' &&
    typeof effectiveCost === 'number' &&
    effectiveCost > stats.cost;
  const costReducedNow =
    !costIncreasedNow &&
    ((typeof stats.cost === 'number' &&
      typeof effectiveCost === 'number' &&
      effectiveCost < stats.cost) ||
      (!costRandomizedNow && stats.costReduced));

  return {
    text: parts.join(' '),
    displayDamage,
    displayBlock,
    damageState,
    blockState,
    displayCost: effectiveCost === null ? '—' : String(effectiveCost),
    costReducedNow,
    costIncreasedNow,
    costRandomizedNow,
  };
}

function tokenizeUpgradeDiff(text) {
  return String(text || '').match(/(\d+|【[^】]+】|\s+|.)/g) || [];
}

function diffUpgradeDescriptionSegments(baseText, nextText) {
  const a = tokenizeUpgradeDiff(baseText);
  const b = tokenizeUpgradeDiff(nextText);
  const n = a.length;
  const m = b.length;
  const dp = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1));

  for (let i = n - 1; i >= 0; i -= 1) {
    for (let j = m - 1; j >= 0; j -= 1) {
      if (a[i] === b[j]) {
        dp[i][j] = dp[i + 1][j + 1] + 1;
      } else {
        dp[i][j] = dp[i + 1][j] >= dp[i][j + 1] ? dp[i + 1][j] : dp[i][j + 1];
      }
    }
  }

  const raw = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      raw.push({ text: b[j], changed: false });
      i += 1;
      j += 1;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      i += 1;
    } else {
      raw.push({ text: b[j], changed: true });
      j += 1;
    }
  }
  while (j < m) {
    raw.push({ text: b[j], changed: true });
    j += 1;
  }

  const merged = [];
  for (const item of raw) {
    if (merged.length > 0 && merged[merged.length - 1].changed === item.changed) {
      merged[merged.length - 1].text += item.text;
    } else {
      merged.push({ ...item });
    }
  }

  // Merge whitespace-only separator sandwiched between two changed segments (e.g. "变为 3")
  for (let k = 1; k < merged.length - 1; k += 1) {
    if (
      !merged[k].changed &&
      /^\s+$/.test(merged[k].text) &&
      merged[k - 1].changed &&
      merged[k + 1].changed
    ) {
      merged[k - 1].text += merged[k].text + merged[k + 1].text;
      merged.splice(k, 2);
      k -= 1;
    }
  }

  // Keep leading/trailing whitespace outside changed spans
  const clean = [];
  const pushSeg = (text, changed) => {
    if (!text) return;
    if (clean.length > 0 && clean[clean.length - 1].changed === changed) {
      clean[clean.length - 1].text += text;
    } else {
      clean.push({ text, changed });
    }
  };
  for (const seg of merged) {
    if (!seg.changed) {
      pushSeg(seg.text, false);
    } else {
      const mLead = seg.text.match(/^(\s*)(.*?)(\s*)$/s);
      pushSeg(mLead[1], false);
      pushSeg(mLead[2], true);
      pushSeg(mLead[3], false);
    }
  }
  return clean;
}

export function formatUpgradePreview(cardInstance, combatContext = null) {
  if (!canUpgradeCard(cardInstance)) return null;

  const baseCard = { ...cardInstance, upgraded: false, combatCost: undefined };
  const nextCard = { ...cardInstance, upgraded: true, combatCost: undefined };
  const baseStats = getCardStats(baseCard);
  const nextStats = getCardStats(nextCard);
  const baseDesc = formatCardDescription(baseCard, combatContext);
  const nextDesc = formatCardDescription(nextCard, combatContext);

  const prefixParts = [];
  if (
    typeof baseStats.cost === 'number' &&
    typeof nextStats.cost === 'number' &&
    nextStats.cost < baseStats.cost
  ) {
    const reducedBy = baseStats.cost - nextStats.cost;
    prefixParts.push(`费用 ${baseStats.cost} → ${nextStats.cost}（减少 ${reducedBy} 点）。`);
  } else if (baseDesc.displayCost !== nextDesc.displayCost) {
    prefixParts.push(`费用 ${baseDesc.displayCost} → ${nextDesc.displayCost}。`);
  }
  if (baseStats.exhaust && !nextStats.exhaust) {
    prefixParts.push('不再消耗。');
  }
  if (baseStats.ethereal && !nextStats.ethereal) {
    prefixParts.push('不再虚无。');
  }
  const prefixText = prefixParts.join(' ');

  const descSegments = diffUpgradeDescriptionSegments(baseDesc.text, nextDesc.text);
  const segments = [];
  if (prefixText) {
    segments.push({ text: prefixText, changed: true });
    if (nextDesc.text) {
      segments.push({ text: ' ', changed: false });
    }
  }
  for (const seg of descSegments) {
    if (segments.length > 0 && segments[segments.length - 1].changed === seg.changed) {
      segments[segments.length - 1].text += seg.text;
    } else {
      segments.push(seg);
    }
  }

  return {
    text: prefixText ? `${prefixText} ${nextDesc.text}`.trim() : nextDesc.text,
    segments,
    costReduced: Boolean(
      typeof baseStats.cost === 'number' &&
        typeof nextStats.cost === 'number' &&
        nextStats.cost < baseStats.cost
    ),
    baseCost: baseDesc.displayCost,
    nextCost: nextDesc.displayCost,
  };
}
