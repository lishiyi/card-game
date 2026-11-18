/**
 * Meta-progression: Ascension difficulty levels (0-5), career XP, unlockable card/relic tiers, and run history.
 */

import { formatSeedCode } from './rng.js';

export const MAX_ASCENSION = 5;
export const MAX_RUN_HISTORY = 30;
export const META_STORAGE_KEY = 'sts_lite_meta_v1';

function deepFreeze(obj) {
  if (obj && typeof obj === 'object' && !Object.isFrozen(obj)) {
    Object.freeze(obj);
    for (const val of Object.values(obj)) {
      deepFreeze(val);
    }
  }
  return obj;
}

export const ASCENSION_DEFS = deepFreeze([
  {
    level: 0,
    name: '进阶 0 · 标准模式',
    shortLabel: '进阶 0',
    description: '标准尖塔攀登难度，适合熟悉流派与首领机制。',
  },
  {
    level: 1,
    name: '进阶 1 · 精英涌动',
    shortLabel: '进阶 1',
    description: '尖塔中精英强敌出现频率提高（更多遗物机会与更高路线压力）。',
  },
  {
    level: 2,
    name: '进阶 2 · 凶暴怪物',
    shortLabel: '进阶 2',
    description: '含进阶 1；所有普通敌人生命上限提升 12%，基础攻击伤害 +1。',
  },
  {
    level: 3,
    name: '进阶 3 · 致命强敌',
    shortLabel: '进阶 3',
    description: '含进阶 1–2；所有精英与首领生命上限提升 15%，基础攻击伤害 +2。',
  },
  {
    level: 4,
    name: '进阶 4 · 荒芜补给',
    shortLabel: '进阶 4',
    description: '含进阶 1–3；开局最大生命 -5，篝火休息回复降至 25%，幕间休整回复降至 60%。',
  },
  {
    level: 5,
    name: '进阶 5 · 尖塔诅咒',
    shortLabel: '进阶 5',
    description: '含进阶 1–4；开局牌组加入 1 张诅咒【笨拙】，商店商品与删牌价格上涨 15%。',
  },
]);

export const UNLOCK_TIERS = deepFreeze([
  {
    tier: 1,
    xpRequired: 100,
    title: '一阶觉醒 · 鲜血与不屈',
    summary: '解锁稀有吸血卡【死神收割】、保留防御卡【磐石守备】与稀有遗物【钨合金棍】。',
    cardIds: ['reaper', 'steadfast_guard'],
    relicIds: ['tungsten_rod'],
  },
  {
    tier: 2,
    xpRequired: 240,
    title: '二阶觉醒 · 灰烬消耗流',
    summary: '解锁消耗流核心【腐化】、【恶魔之焰】与稀有遗物【卡戎之灰】。',
    cardIds: ['corruption', 'fiend_fire'],
    relicIds: ['charons_ashes'],
  },
  {
    tier: 3,
    xpRequired: 420,
    title: '三阶觉醒 · 不破钢铁堡垒',
    summary: '解锁格挡流终极核心【壁垒】、【黑暗之拥】与稀有遗物【船长舵轮】。',
    cardIds: ['barricade', 'dark_embrace'],
    relicIds: ['captains_wheel'],
  },
]);

export function createDefaultMeta() {
  return {
    xp: 0,
    unlockedTier: 0,
    maxAscensionUnlocked: 0,
    selectedAscension: 0,
    unlockAllOverride: false,
    runsPlayed: 0,
    victories: 0,
    bestFloor: 0,
    totalEnemiesSlain: 0,
    recordedRunKeys: [],
    runHistory: [],
  };
}

export function computeUnlockedTierFromXp(xp) {
  const safeXp = Number.isFinite(xp) ? Math.max(0, xp) : 0;
  let tier = 0;
  for (const def of UNLOCK_TIERS) {
    if (safeXp >= def.xpRequired) {
      tier = def.tier;
    }
  }
  return tier;
}

export function getLockedContentSets(unlockedTier = 3, unlockAllOverride = false) {
  const effectiveTier = unlockAllOverride ? UNLOCK_TIERS.length : Math.max(0, unlockedTier ?? 0);
  const lockedCardIds = new Set();
  const lockedRelicIds = new Set();

  for (const def of UNLOCK_TIERS) {
    if (def.tier > effectiveTier) {
      for (const cId of def.cardIds) lockedCardIds.add(cId);
      for (const rId of def.relicIds) lockedRelicIds.add(rId);
    }
  }
  return { effectiveTier, lockedCardIds, lockedRelicIds };
}

export function calculateRunXp(state) {
  const floors = state?.stats?.floorsCleared ?? 0;
  const wins = state?.stats?.combatsWon ?? 0;
  const elites = state?.stats?.elitesSlain ?? 0;
  const actBonus = (state?.act ?? 1) >= 2 ? 60 : 0;
  const winBonus = state?.runOutcome === 'victory' ? 120 + (state?.ascension ?? 0) * 25 : 0;
  return Math.max(15, floors * 8 + wins * 12 + elites * 18 + actBonus + winBonus);
}

export function recordCompletedRun(meta, state) {
  if (!meta || !state) {
    return { xpGained: 0, newlyUnlockedTiers: [], unlockedAscension: null, alreadyRecorded: false };
  }
  const runKey = `${state.seed}_${state.stats?.floorsCleared ?? 0}_${state.runOutcome ?? 'end'}`;
  if (!Array.isArray(meta.recordedRunKeys)) {
    meta.recordedRunKeys = [];
  }
  if (!Array.isArray(meta.runHistory)) {
    meta.runHistory = [];
  }
  if (meta.recordedRunKeys.includes(runKey)) {
    return { xpGained: 0, newlyUnlockedTiers: [], unlockedAscension: null, alreadyRecorded: true };
  }

  meta.recordedRunKeys.push(runKey);
  if (meta.recordedRunKeys.length > 40) {
    meta.recordedRunKeys.splice(0, meta.recordedRunKeys.length - 40);
  }

  const prevTier = computeUnlockedTierFromXp(meta.xp);
  const xpGained = calculateRunXp(state);
  meta.xp = (meta.xp ?? 0) + xpGained;
  const nextTier = computeUnlockedTierFromXp(meta.xp);
  meta.unlockedTier = Math.max(meta.unlockedTier ?? 0, nextTier);

  const newlyUnlockedTiers = UNLOCK_TIERS.filter(
    (t) => t.tier > prevTier && t.tier <= meta.unlockedTier
  );

  meta.runsPlayed = (meta.runsPlayed ?? 0) + 1;
  meta.totalEnemiesSlain = (meta.totalEnemiesSlain ?? 0) + (state.stats?.enemiesSlain ?? 0);
  const totalFloorReached = ((state.act ?? 1) - 1) * 16 + (state.floor ?? 0);
  meta.bestFloor = Math.max(meta.bestFloor ?? 0, totalFloorReached);

  let unlockedAscension = null;
  if (state.runOutcome === 'victory') {
    meta.victories = (meta.victories ?? 0) + 1;
    const asc = state.ascension ?? 0;
    if (asc >= (meta.maxAscensionUnlocked ?? 0) && (meta.maxAscensionUnlocked ?? 0) < MAX_ASCENSION) {
      meta.maxAscensionUnlocked = Math.min(MAX_ASCENSION, asc + 1);
      unlockedAscension = meta.maxAscensionUnlocked;
    }
  }

  const historyEntry = {
    id: runKey,
    timestamp: Date.now(),
    seed: state.seed,
    seedCode: formatSeedCode(state.seed),
    outcome: state.runOutcome === 'victory' ? 'victory' : 'defeat',
    act: state.act ?? 1,
    floor: Math.max(1, state.floor ?? 1),
    ascension: state.ascension ?? 0,
    deckSize: state.player?.deck?.length ?? 0,
    relicCount: state.player?.relics?.length ?? 0,
    combatsWon: state.stats?.combatsWon ?? 0,
    elitesSlain: state.stats?.elitesSlain ?? 0,
    enemiesSlain: state.stats?.enemiesSlain ?? 0,
    xpGained,
  };
  meta.runHistory.unshift(historyEntry);
  if (meta.runHistory.length > MAX_RUN_HISTORY) {
    meta.runHistory.length = MAX_RUN_HISTORY;
  }

  return {
    xpGained,
    newlyUnlockedTiers,
    unlockedAscension,
    alreadyRecorded: false,
    historyEntry,
  };
}

export function loadSavedMeta(storage = globalThis?.localStorage) {
  const base = createDefaultMeta();
  if (!storage) return base;
  try {
    const raw = storage.getItem(META_STORAGE_KEY);
    if (!raw) return base;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return base;
    const xp = Number.isFinite(parsed.xp) ? Math.max(0, parsed.xp) : 0;
    const maxAsc = Number.isFinite(parsed.maxAscensionUnlocked)
      ? Math.max(0, Math.min(MAX_ASCENSION, Math.floor(parsed.maxAscensionUnlocked)))
      : 0;
    const selAsc = Number.isFinite(parsed.selectedAscension)
      ? Math.max(0, Math.min(maxAsc, Math.floor(parsed.selectedAscension)))
      : 0;
    return {
      xp,
      unlockedTier: Math.max(
        computeUnlockedTierFromXp(xp),
        Number.isFinite(parsed.unlockedTier) ? parsed.unlockedTier : 0
      ),
      maxAscensionUnlocked: maxAsc,
      selectedAscension: selAsc,
      unlockAllOverride: Boolean(parsed.unlockAllOverride),
      runsPlayed: Number.isFinite(parsed.runsPlayed) ? parsed.runsPlayed : 0,
      victories: Number.isFinite(parsed.victories) ? parsed.victories : 0,
      bestFloor: Number.isFinite(parsed.bestFloor) ? parsed.bestFloor : 0,
      totalEnemiesSlain: Number.isFinite(parsed.totalEnemiesSlain) ? parsed.totalEnemiesSlain : 0,
      recordedRunKeys: Array.isArray(parsed.recordedRunKeys) ? parsed.recordedRunKeys.slice(-40) : [],
      runHistory: Array.isArray(parsed.runHistory) ? parsed.runHistory.slice(0, MAX_RUN_HISTORY) : [],
    };
  } catch {
    return base;
  }
}

export function saveMeta(meta, storage = globalThis?.localStorage) {
  if (!storage || !meta) return;
  try {
    storage.setItem(META_STORAGE_KEY, JSON.stringify(meta));
  } catch {
    // Ignore storage quota errors
  }
}
