/**
 * Daily Challenge generator & modifier definitions.
 * Every calendar date (YYYY-MM-DD) maps deterministically to a shared seed,
 * featured playable character, and 3 non-conflicting gameplay modifiers.
 */

import { getCharacterDef, VANILLA_CHARACTER_IDS } from '../data/characters.js';
import { formatSeedCode, parseSeedInput, pickRandom, randomInt } from './rng.js';

export const DAILY_MIN_ASCENSION = 0;
export const DAILY_MAX_ASCENSION = 6;

function deepFreeze(obj) {
  if (obj && typeof obj === 'object' && !Object.isFrozen(obj)) {
    Object.freeze(obj);
    for (const val of Object.values(obj)) {
      deepFreeze(val);
    }
  }
  return obj;
}

export const DAILY_MODIFIERS = deepFreeze({
  // === Category 1: Build / Starting Power ===
  all_star: {
    id: 'all_star',
    name: '无色秘宝',
    category: 'build',
    tone: 'buff',
    shortTag: '开局 +2 无色牌',
    description: '开局牌组直接加入 2 张商店专属【无色牌】（1 张罕见 + 1 张稀有），尽享跨职业连招！',
  },
  shiny: {
    id: 'shiny',
    name: '闪耀起手',
    category: 'build',
    tone: 'buff',
    shortTag: '开局 +2 稀有牌',
    description: '开局牌组额外加入 2 张随机本职业【稀有】卡牌，第一时间确立构筑核心。',
  },
  heirloom: {
    id: 'heirloom',
    name: '远古传家宝',
    category: 'build',
    tone: 'buff',
    shortTag: '开局 +1 稀有遗物',
    description: '攀登开始时额外携带 1 件随机【稀有】遗物，大幅拉高构筑上限。',
  },
  specialized: {
    id: 'specialized',
    name: '精工锻打',
    category: 'build',
    tone: 'buff',
    shortTag: '4 张初始牌升级+',
    description: '初始牌组中随机 4 张基础牌开局即完成【升级+】，大幅加速前五层节奏。',
  },

  // === Category 2: Combat / Economy Twist ===
  lethality: {
    id: 'lethality',
    name: '嗜血狂潮',
    category: 'twist',
    tone: 'mixed',
    shortTag: '敌我初始 +3 力量',
    description: '每场战斗开始时，你与所有敌人同时获得 +3 点【力量】——刀刀入肉的快节奏对决！',
  },
  hoarder_gold: {
    id: 'hoarder_gold',
    name: '商队资助',
    category: 'twist',
    tone: 'mixed',
    shortTag: '+150 金 · 商店 +15%',
    description: '开局额外携带 +150 金币，但商店全部商品与删牌价格上涨 15%，鼓励及早规划购物路线。',
  },
  midas: {
    id: 'midas',
    name: '点金之手',
    category: 'twist',
    tone: 'mixed',
    shortTag: '金币 +65% · 禁篝火锻造',
    description: '战斗金币掉落提升 65%，但无法在篝火营地进行【铁砧锻造】——用重金在商店武装自己！',
  },
  time_dilation: {
    id: 'time_dilation',
    name: '先发制人',
    category: 'twist',
    tone: 'mixed',
    shortTag: '首回合 +1能+1抽 · 敌+6盾',
    description: '每场战斗第 1 回合额外获得 +1 能量并多抽 1 张牌，但所有敌人开场获得 6 点初始格挡。',
  },

  // === Category 3: Spire Pressure / Score Challenge ===
  big_game_hunter: {
    id: 'big_game_hunter',
    name: '巨兽猎手',
    category: 'challenge',
    tone: 'challenge',
    shortTag: '精英激增 · 精英+35金',
    description: '尖塔中【精英】节点大幅增多，且每次击败精英额外赏金 +35 金币，以战养战冲击高分！',
  },
  cursed_run: {
    id: 'cursed_run',
    name: '暗影试炼',
    category: 'challenge',
    tone: 'challenge',
    shortTag: '+1诅咒 · 敌血+12% · 评分+15%',
    description: '开局牌组混入 1 张随机【诅咒】牌且所有敌人生命 +12%，但最终战绩评分额外享受 +15% 难度加成！',
  },
});

const BUILD_MOD_IDS = ['all_star', 'shiny', 'heirloom', 'specialized'];
const TWIST_MOD_IDS = ['lethality', 'hoarder_gold', 'midas', 'time_dilation'];
const CHALLENGE_MOD_IDS = ['big_game_hunter', 'cursed_run'];

export function isValidDailyDateKey(dateKey) {
  if (typeof dateKey !== 'string') return false;
  const trimmed = dateKey.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return false;
  const [y, m, d] = trimmed.split('-').map(Number);
  if (m < 1 || m > 12 || d < 1 || d > 31) return false;
  const probe = new Date(Date.UTC(y, m - 1, d));
  return (
    probe.getUTCFullYear() === y &&
    probe.getUTCMonth() === m - 1 &&
    probe.getUTCDate() === d
  );
}

export function getLocalDateKey(date = new Date()) {
  const safe = date instanceof Date && !Number.isNaN(date.getTime()) ? date : new Date();
  const y = safe.getFullYear();
  const m = String(safe.getMonth() + 1).padStart(2, '0');
  const d = String(safe.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getDailyChallengeSpec(dateKey = getLocalDateKey()) {
  const normalizedDate = isValidDailyDateKey(dateKey) ? dateKey.trim() : getLocalDateKey();
  const seed = parseSeedInput(`DAILY:${normalizedDate}:V1`);
  const seedCode = formatSeedCode(seed);
  const localRng = { rngState: seed };

  // Deterministic character rotation + 3 non-conflicting modifiers (1 build + 1 twist + 1 challenge)
  // Preserve historical 3-hero rotation prior to Defect's introduction, and keep daily rotation
  // strictly on vanilla heroes so every player shares identical daily specs regardless of expansion toggle.
  const DAILY_LEGACY_CHARACTER_IDS = ['ironclad', 'silent', 'watcher'];
  const DAILY_DEFECT_ROTATION_START_DATE = '2026-11-26';
  const rotationPool =
    normalizedDate < DAILY_DEFECT_ROTATION_START_DATE
      ? DAILY_LEGACY_CHARACTER_IDS
      : VANILLA_CHARACTER_IDS;
  const [y, m, d] = normalizedDate.split('-').map(Number);
  const dayOrdinal = Math.floor(Date.UTC(y, m - 1, d) / 86400000);
  const characterId = rotationPool[((dayOrdinal % rotationPool.length) + rotationPool.length) % rotationPool.length];
  const charDef = getCharacterDef(characterId);

  const modBuild = pickRandom(localRng, BUILD_MOD_IDS);
  const modTwist = pickRandom(localRng, TWIST_MOD_IDS);
  const modChallenge = pickRandom(localRng, CHALLENGE_MOD_IDS);
  const ascension = randomInt(localRng, DAILY_MIN_ASCENSION, DAILY_MAX_ASCENSION);
  const modifierIds = [modBuild, modTwist, modChallenge];
  const modifiers = modifierIds.map((id) => DAILY_MODIFIERS[id]).filter(Boolean);

  return {
    dateKey: normalizedDate,
    seed,
    seedCode,
    characterId: charDef.id,
    characterName: charDef.name,
    ascension,
    noNeow: true,
    modifierIds,
    modifiers,
  };
}

export function hasDailyModifier(state, modifierId) {
  return Boolean(
    state?.dailyChallenge &&
      Array.isArray(state.dailyChallenge.modifierIds) &&
      state.dailyChallenge.modifierIds.includes(modifierId)
  );
}

export function getDailyModifierDefs(modifierIds) {
  if (!Array.isArray(modifierIds)) return [];
  return modifierIds.map((id) => DAILY_MODIFIERS[id]).filter(Boolean);
}
