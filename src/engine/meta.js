/**
 * Meta-progression: Ascension difficulty levels (0-5), career XP, unlockable card/relic tiers,
 * deterministic run scoring, Daily Challenge personal bests, detailed run review history,
 * and one-click shareable battle reports.
 */

import { CARD_LIBRARY, getCardCharacter, getCardStats } from '../data/cards.js';
import { CHARACTER_IDS, getCharacterDef, normalizeCharacterId } from '../data/characters.js';
import { ENEMY_TEMPLATES } from '../data/enemies.js';
import { POTION_LIBRARY, RELIC_LIBRARY } from '../data/relics.js';
import { getDailyModifierDefs, hasDailyModifier } from './daily.js';
import { formatSeedCode } from './rng.js';

export const MAX_ASCENSION = 10;
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
    description: '含进阶 1；所有普通敌人生命上限提升 7%，基础攻击伤害 +1。',
  },
  {
    level: 3,
    name: '进阶 3 · 致命强敌',
    shortLabel: '进阶 3',
    description: '含进阶 1–2；所有精英与首领生命上限提升 8%，基础攻击伤害 +2。',
  },
  {
    level: 4,
    name: '进阶 4 · 荒芜补给',
    shortLabel: '进阶 4',
    description: '含进阶 1–3；开局最大生命 -5，幕间休整回复降至 65%。',
  },
  {
    level: 5,
    name: '进阶 5 · 尖塔诅咒',
    shortLabel: '进阶 5',
    description: '含进阶 1–4；开局牌组加入 1 张诅咒【笨拙】，商店商品与删牌价格上涨 15%。',
  },
  {
    level: 6,
    name: '进阶 6 · 负伤启程',
    shortLabel: '进阶 6',
    description: '含进阶 1–5；开局初始损失 10% 当前生命（带伤入塔），初始药水栏位由 3 格减至 2 格。',
  },
  {
    level: 7,
    name: '进阶 7 · 贫瘠战果',
    shortLabel: '进阶 7',
    description: '含进阶 1–6；普通与精英战斗金币掉落减少 15%，首领战金币减少 25%，奖励卡牌自带升级概率减半。',
  },
  {
    level: 8,
    name: '进阶 8 · 险恶奇遇',
    shortLabel: '进阶 8',
    description: '含进阶 1–7；未知事件的生命与金币代价大幅提高，回复、金币与属性增益全面收紧。',
  },
  {
    level: 9,
    name: '进阶 9 · 强敌狂化',
    shortLabel: '进阶 9',
    description: '含进阶 1–8；普通敌生命提至 +9%、攻击再 +1；精英与首领生命提至 +12%、攻击再 +1，且格挡、负面状态与状态牌威胁全面升级。',
  },
  {
    level: 10,
    name: '进阶 10 · 终末双王',
    shortLabel: '进阶 10',
    description: '含进阶 1–9；必须攻克第 3 幕【深渊圣殿】方算通关，且击败首位第 3 幕首领后不回复生命立即迎战第 2 位第 3 幕首领！',
  },
]);

export const LEGACY_CARD_ID_MIGRATION = deepFreeze({
  steadfast_guard: 'warcry',
  ambush_slash: 'pummel',
});

export function migrateLegacyCardId(cardId) {
  if (typeof cardId !== 'string') return cardId;
  return LEGACY_CARD_ID_MIGRATION[cardId] || cardId;
}

function migrateCardList(list) {
  if (!Array.isArray(list)) return;
  for (const item of list) {
    if (item && typeof item === 'object' && typeof item.cardId === 'string') {
      item.cardId = migrateLegacyCardId(item.cardId);
    }
  }
}

export function migrateLegacyRunCards(run) {
  if (!run || typeof run !== 'object') return run;
  migrateCardList(run.player?.deck);
  if (run.combat && typeof run.combat === 'object') {
    migrateCardList(run.combat.hand);
    migrateCardList(run.combat.drawPile);
    migrateCardList(run.combat.discardPile);
    migrateCardList(run.combat.exhaustPile);
    migrateCardList(run.combat.pendingCardChoice?.candidates);
  }
  if (run.pendingReward && typeof run.pendingReward === 'object') {
    migrateCardList(run.pendingReward.cards);
  }
  if (run.shop && typeof run.shop === 'object') {
    migrateCardList(run.shop.cards);
    migrateCardList(run.shop.colorlessCards);
  }
  if (run.shopSnapshot && typeof run.shopSnapshot === 'object') {
    migrateCardList(run.shopSnapshot.deck);
    migrateCardList(run.shopSnapshot.shop?.cards);
    migrateCardList(run.shopSnapshot.shop?.colorlessCards);
  }
  if (run.combatStartSnapshot && typeof run.combatStartSnapshot === 'object') {
    migrateCardList(run.combatStartSnapshot.player?.deck);
  }
  return run;
}

export const UNLOCK_TIERS = deepFreeze([
  {
    tier: 1,
    xpRequired: 100,
    title: '一阶觉醒 · 鲜血、剧毒与渎神',
    summary: '解锁【死亡收割】、【连续拳】、【涂毒】、【渎神】与稀有遗物【钨合金棍】。',
    cardIds: ['reaper', 'pummel', 'envenom', 'blasphemy'],
    relicIds: ['tungsten_rod'],
  },
  {
    tier: 2,
    xpRequired: 240,
    title: '二阶觉醒 · 灰烬、催化与天眼',
    summary: '解锁【腐化】、【恶魔之焰】、【催化剂】、【天人形态】与稀有遗物【卡戎之灰】、【结实绷带】、【黄金眼】。',
    cardIds: ['corruption', 'fiend_fire', 'catalyst', 'deva_form'],
    relicIds: ['charons_ashes', 'tough_bandages', 'golden_eye'],
  },
  {
    tier: 3,
    xpRequired: 420,
    title: '三阶觉醒 · 壁垒、幽魂与诸神之黄昏',
    summary: '解锁【壁垒】、【黑暗之拥】、【幽魂形态】、【诸神之黄昏】与稀有遗物【舵盘】、【生物样本】。',
    cardIds: ['barricade', 'dark_embrace', 'wraith_form', 'ragnarok'],
    relicIds: ['captains_wheel', 'the_specimen'],
  },
]);

function createDefaultCharEntry() {
  return {
    runsPlayed: 0,
    victories: 0,
    maxAscensionUnlocked: 0,
    bestFloor: 0,
    bestScore: 0,
  };
}

export function createDefaultCharacterProgress() {
  const map = {};
  for (const cid of CHARACTER_IDS) {
    map[cid] = createDefaultCharEntry();
  }
  return map;
}

export function ensureCharacterProgress(meta) {
  if (!meta) return createDefaultCharacterProgress();
  if (!meta.characterProgress || typeof meta.characterProgress !== 'object') {
    meta.characterProgress = createDefaultCharacterProgress();
  }
  for (const cid of CHARACTER_IDS) {
    if (!meta.characterProgress[cid] || typeof meta.characterProgress[cid] !== 'object') {
      meta.characterProgress[cid] = createDefaultCharEntry();
    }
  }
  return meta.characterProgress;
}

export function getCharacterProgress(meta, characterId = 'ironclad') {
  const cid = normalizeCharacterId(characterId);
  const progressMap = ensureCharacterProgress(meta);
  if (!progressMap[cid]) {
    progressMap[cid] = createDefaultCharEntry();
  }
  return progressMap[cid];
}

export function getMaxAscensionForCharacter(meta, characterId = 'ironclad') {
  if (!meta) return 0;
  if (meta.unlockAllOverride) return MAX_ASCENSION;
  const cid = normalizeCharacterId(characterId);
  const entry = getCharacterProgress(meta, cid);
  const allCharMax = Math.max(
    0,
    ...Object.values(ensureCharacterProgress(meta)).map((p) => p?.maxAscensionUnlocked ?? 0)
  );
  // Legacy save/test compat: if meta.maxAscensionUnlocked was set directly without per-char progress
  if (cid === 'ironclad' && (meta.maxAscensionUnlocked ?? 0) > allCharMax) {
    return Math.max(0, Math.min(MAX_ASCENSION, Math.floor(meta.maxAscensionUnlocked)));
  }
  return Math.max(0, Math.min(MAX_ASCENSION, Math.floor(entry.maxAscensionUnlocked ?? 0)));
}

export function createDefaultCompendium() {
  return {
    cards: [],
    relics: [],
    potions: [],
    enemies: [],
  };
}

export function ensureCompendium(meta) {
  if (!meta) return createDefaultCompendium();
  if (!meta.compendium || typeof meta.compendium !== 'object' || Array.isArray(meta.compendium)) {
    meta.compendium = createDefaultCompendium();
  }
  const c = meta.compendium;
  c.cards = Array.isArray(c.cards)
    ? [...new Set(c.cards.map((id) => migrateLegacyCardId(id)).filter((id) => Boolean(CARD_LIBRARY[id])))]
    : [];
  c.relics = Array.isArray(c.relics) ? [...new Set(c.relics.filter((id) => Boolean(RELIC_LIBRARY[id])))] : [];
  c.potions = Array.isArray(c.potions) ? [...new Set(c.potions.filter((id) => Boolean(POTION_LIBRARY[id])))] : [];
  c.enemies = Array.isArray(c.enemies) ? [...new Set(c.enemies.filter((id) => Boolean(ENEMY_TEMPLATES[id])))] : [];
  return c;
}

export function recordCompendiumDiscovery(meta, { cards = [], relics = [], potions = [], enemies = [] } = {}) {
  if (!meta) return false;
  const c = ensureCompendium(meta);
  let changed = false;

  const addUnique = (arr, ids, lib) => {
    const existing = new Set(arr);
    for (const id of ids) {
      if (id && lib[id] && !existing.has(id)) {
        existing.add(id);
        arr.push(id);
        changed = true;
      }
    }
  };

  addUnique(c.cards, cards, CARD_LIBRARY);
  addUnique(c.relics, relics, RELIC_LIBRARY);
  addUnique(c.potions, potions, POTION_LIBRARY);
  addUnique(c.enemies, enemies, ENEMY_TEMPLATES);
  return changed;
}

export function syncCompendiumFromRunState(meta, state) {
  if (!meta || !state) return false;
  const cards = [];
  const relics = [];
  const potions = [];
  const enemies = [];

  for (const item of state.player?.deck || []) {
    if (item?.cardId) cards.push(item.cardId);
  }
  for (const rid of state.player?.relics || []) {
    if (rid) relics.push(rid);
  }
  for (const pid of state.player?.potions || []) {
    if (pid) potions.push(pid);
  }

  if (state.combat) {
    for (const pile of [state.combat.hand, state.combat.drawPile, state.combat.discardPile, state.combat.exhaustPile]) {
      for (const item of pile || []) {
        if (item?.cardId) cards.push(item.cardId);
      }
    }
    for (const enemy of state.combat.enemies || []) {
      if (enemy?.templateId) enemies.push(enemy.templateId);
    }
  }
  if (state.reward) {
    for (const item of state.reward.cardChoices || []) {
      if (item?.cardId) cards.push(item.cardId);
    }
    if (state.reward.relicId) relics.push(state.reward.relicId);
    if (state.reward.extraRelicId) relics.push(state.reward.extraRelicId);
    if (state.reward.potionId) potions.push(state.reward.potionId);
  }
  if (state.bossReward) {
    for (const item of state.bossReward.cardChoices || []) {
      if (item?.cardId) cards.push(item.cardId);
    }
    for (const rid of state.bossReward.relicChoices || []) {
      if (rid) relics.push(rid);
    }
  }
  if (state.shop) {
    for (const entry of state.shop.cards || []) {
      if (entry?.card?.cardId) cards.push(entry.card.cardId);
    }
    for (const entry of state.shop.colorlessCards || []) {
      if (entry?.card?.cardId) cards.push(entry.card.cardId);
    }
    for (const entry of state.shop.relics || []) {
      if (entry?.relicId) relics.push(entry.relicId);
    }
    for (const entry of state.shop.potions || []) {
      if (entry?.potionId) potions.push(entry.potionId);
    }
  }
  if (state.eventState?.libraryChoices) {
    for (const item of state.eventState.libraryChoices) {
      if (item?.cardId) cards.push(item.cardId);
    }
  }
  if (state.neowState?.pendingAction?.cards) {
    for (const item of state.neowState.pendingAction.cards) {
      if (item?.cardId) cards.push(item.cardId);
    }
  }

  return recordCompendiumDiscovery(meta, { cards, relics, potions, enemies });
}

export function createDefaultMeta() {
  return {
    xp: 0,
    unlockedTier: 0,
    maxAscensionUnlocked: 0,
    selectedAscension: 0,
    selectedCharacterId: 'ironclad',
    characterProgress: createDefaultCharacterProgress(),
    unlockAllOverride: false,
    runsPlayed: 0,
    victories: 0,
    bestFloor: 0,
    bestScore: 0,
    totalEnemiesSlain: 0,
    recordedRunKeys: [],
    dailyRecords: {},
    runHistory: [],
    compendium: createDefaultCompendium(),
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
  const act = state?.act ?? 1;
  const actBonus = act >= 4 ? 190 : act >= 3 ? 130 : act >= 2 ? 60 : 0;
  const winBonus = state?.runOutcome === 'victory' ? 120 + (state?.ascension ?? 0) * 25 : 0;
  const heartBonus = state?.runOutcome === 'victory' && state?.heartVictory ? 80 : 0;
  const dailyBonus = state?.dailyChallenge ? 25 : 0;
  return Math.max(
    15,
    floors * 8 + wins * 12 + elites * 18 + actBonus + winBonus + heartBonus + dailyBonus
  );
}

export function getScoreGrade(score) {
  const s = Number.isFinite(score) ? score : 0;
  if (s >= 1350) return 'S+';
  if (s >= 1000) return 'S';
  if (s >= 700) return 'A';
  if (s >= 400) return 'B';
  return 'C';
}

export function calculateRunScore(state) {
  if (!state) {
    return { totalScore: 0, grade: 'C', breakdown: [] };
  }
  const act = Math.max(1, state.act ?? 1);
  const floor = Math.max(1, state.floor ?? 1);
  const totalFloorsReached = (act - 1) * 16 + floor;
  const enemiesSlain = state.stats?.enemiesSlain ?? 0;
  const elitesSlain = state.stats?.elitesSlain ?? 0;
  const bossesSlain =
    state.stats?.bossesSlain ??
    (state.runOutcome === 'victory' ? act : Math.max(0, act - 1));
  const perfectCombats = state.stats?.perfectCombats ?? 0;
  const deck = Array.isArray(state.player?.deck) ? state.player.deck : [];
  const relics = Array.isArray(state.player?.relics) ? state.player.relics : [];
  const upgradedCount = deck.filter((c) => Boolean(c.upgraded)).length;
  const colorlessCount = deck.filter((c) => getCardCharacter(CARD_LIBRARY[c.cardId]) === 'colorless').length;
  const isVictory = state.runOutcome === 'victory';

  const breakdown = [];
  breakdown.push({
    label: '攀登层数',
    points: totalFloorsReached * 10,
    detail: `第 ${act} 幕 F${floor}（共 ${totalFloorsReached} 层）`,
  });
  if (enemiesSlain > 0) {
    breakdown.push({
      label: '斩敌战功',
      points: enemiesSlain * 8,
      detail: `击败 ${enemiesSlain} 名敌人`,
    });
  }
  if (elitesSlain > 0) {
    breakdown.push({
      label: '精英猎手',
      points: elitesSlain * 35,
      detail: `击败 ${elitesSlain} 名精英`,
    });
  }
  if (bossesSlain > 0) {
    breakdown.push({
      label: '首领击破',
      points: bossesSlain * 120,
      detail: `击败 ${bossesSlain} 位首领`,
    });
  }
  if (isVictory) {
    breakdown.push({
      label: act >= 3 ? '三幕终极登顶' : act >= 2 ? '双幕登顶凯旋' : '第一幕凯旋结算',
      points: act >= 3 ? 500 : act >= 2 ? 300 : 150,
      detail: act >= 3 ? '彻底征服深渊圣殿终战' : act >= 2 ? '征服钢铁城邦终战' : '成功斩落第一幕首领',
    });
    if (state.heartVictory) {
      breakdown.push({
        label: '心脏斩杀（真结局）',
        points: 250,
        detail: '集齐三把钥匙并击碎第四幕【腐化之心】',
      });
    }
  }
  if (perfectCombats > 0) {
    breakdown.push({
      label: '无伤完美战斗',
      points: perfectCombats * 25,
      detail: `${perfectCombats} 场 0 失血胜仗`,
    });
  }
  if (relics.length > 0) {
    breakdown.push({
      label: '遗物收藏',
      points: relics.length * 15,
      detail: `共持有 ${relics.length} 件遗物`,
    });
  }
  if (upgradedCount > 0) {
    breakdown.push({
      label: '精工锻造',
      points: upgradedCount * 8,
      detail: `${upgradedCount} 张已升级卡牌`,
    });
  }
  if (colorlessCount > 0) {
    breakdown.push({
      label: '无色秘宝',
      points: colorlessCount * 20,
      detail: `购入 ${colorlessCount} 张商店无色牌`,
    });
  }
  if (isVictory && deck.length > 0 && deck.length <= 20) {
    breakdown.push({
      label: '精简构筑',
      points: 60,
      detail: `通关牌组仅 ${deck.length} 张`,
    });
  }

  const subtotal = breakdown.reduce((sum, item) => sum + item.points, 0);
  let totalScore = subtotal;

  const asc = Math.max(0, state.ascension ?? 0);
  if (asc > 0) {
    const ascBonus = Math.round(subtotal * asc * 0.15);
    totalScore += ascBonus;
    breakdown.push({
      label: `进阶 ${asc} 倍率加成`,
      points: ascBonus,
      detail: `+${asc * 15}% 难度评分`,
    });
  }

  if (hasDailyModifier(state, 'cursed_run')) {
    const cursedBonus = Math.round(subtotal * 0.15);
    totalScore += cursedBonus;
    breakdown.push({
      label: '暗影试炼加成',
      points: cursedBonus,
      detail: '每日词条 +15% 评分',
    });
  }

  return {
    totalScore,
    grade: getScoreGrade(totalScore),
    breakdown,
  };
}

const RARITY_SORT_WEIGHT = Object.freeze({
  rare: 0,
  uncommon: 1,
  common: 2,
  starter: 3,
  curse: 4,
  status: 5,
  special: 6,
});

export function summarizeDeckForHistory(deck) {
  if (!Array.isArray(deck)) return [];
  const grouped = new Map();
  for (const card of deck) {
    if (!card || !CARD_LIBRARY[card.cardId]) continue;
    const key = `${card.cardId}|${card.upgraded ? '1' : '0'}`;
    const existing = grouped.get(key);
    if (existing) {
      existing.count += 1;
    } else {
      grouped.set(key, {
        cardId: card.cardId,
        upgraded: Boolean(card.upgraded),
        count: 1,
      });
    }
  }
  return [...grouped.values()].sort((a, b) => {
    const da = CARD_LIBRARY[a.cardId];
    const db = CARD_LIBRARY[b.cardId];
    const ra = RARITY_SORT_WEIGHT[da?.rarity] ?? 9;
    const rb = RARITY_SORT_WEIGHT[db?.rarity] ?? 9;
    if (ra !== rb) return ra - rb;
    if (a.upgraded !== b.upgraded) return a.upgraded ? -1 : 1;
    return (da?.name || a.cardId).localeCompare(db?.name || b.cardId, 'zh-CN');
  });
}

export function buildRunReportFromState(state) {
  const charId = state.characterId || 'ironclad';
  const scoreObj = calculateRunScore(state);
  const deck = Array.isArray(state.player?.deck) ? state.player.deck : [];
  const relics = Array.isArray(state.player?.relics) ? [...state.player.relics] : [];
  const startedAt = Number.isFinite(state.stats?.startedAt) ? state.stats.startedAt : null;
  const durationSec = startedAt ? Math.max(1, Math.round((Date.now() - startedAt) / 1000)) : null;

  return {
    characterId: charId,
    characterName: state.player?.name || getCharacterDef(charId).name,
    seed: state.seed,
    seedCode: formatSeedCode(state.seed),
    outcome: state.runOutcome === 'victory' ? 'victory' : 'defeat',
    heartVictory: Boolean(state.heartVictory),
    act3Cleared: Boolean(state.act3Cleared),
    act: state.act ?? 1,
    floor: Math.max(1, state.floor ?? 1),
    ascension: state.ascension ?? 0,
    isChallenge: Boolean(state.isChallengeRun),
    dailyDateKey: state.dailyChallenge?.dateKey || null,
    dailyModifierIds: Array.isArray(state.dailyChallenge?.modifierIds)
      ? [...state.dailyChallenge.modifierIds]
      : [],
    score: scoreObj.totalScore,
    grade: scoreObj.grade,
    scoreBreakdown: scoreObj.breakdown,
    deckSize: deck.length,
    upgradedCount: deck.filter((c) => Boolean(c.upgraded)).length,
    relicCount: relics.length,
    relicIds: relics,
    deckSummary: summarizeDeckForHistory(deck),
    combatsWon: state.stats?.combatsWon ?? 0,
    perfectCombats: state.stats?.perfectCombats ?? 0,
    elitesSlain: state.stats?.elitesSlain ?? 0,
    bossesSlain: state.stats?.bossesSlain ?? 0,
    enemiesSlain: state.stats?.enemiesSlain ?? 0,
    cardsPlayed: state.stats?.cardsPlayed ?? 0,
    totalDamageDealt: state.stats?.totalDamageDealt ?? 0,
    totalBlockGained: state.stats?.totalBlockGained ?? 0,
    totalDamageTaken: state.stats?.totalDamageTaken ?? 0,
    highestSingleHit: state.stats?.highestSingleHit ?? 0,
    goldEarned: state.stats?.goldEarned ?? 0,
    combatRestarts: state.stats?.combatRestarts ?? 0,
    defeatedBy: state.stats?.defeatedBy || '',
    durationSec,
  };
}

export function formatShareableBattleReport(report, shareUrl = '') {
  if (!report) return '';
  const isWin = report.outcome === 'victory';
  const modeHeader = report.dailyDateKey
    ? `每日挑战 ${report.dailyDateKey} · 进阶 ${report.ascension ?? 0}`
    : (report.ascension ?? 0) > 0
      ? `进阶 ${report.ascension}`
      : '标准攀登';
  const outcomeTitle = isWin
    ? report.heartVictory
      ? '❤️‍🔥 心脏斩杀 · 第四幕真结局'
      : (report.act ?? 1) >= 3
        ? '👑 三幕终极登顶'
        : (report.act ?? 1) >= 2
          ? '🏆 双幕登顶凯旋'
          : '🏆 第一幕凯旋'
    : `💀 折戟于第 ${report.act ?? 1} 幕 · F${report.floor ?? 1}`;

  const lines = [
    `【杀戮尖塔 · 简明版】${modeHeader} 战绩卡`,
    `${outcomeTitle}（第 ${report.act ?? 1} 幕 · F${report.floor ?? 1}）| 总分：${(report.score ?? 0).toLocaleString()} 分 (${report.grade || getScoreGrade(report.score)})`,
    `🧙 角色：${report.characterName || '铁甲战士'} | 种子：${report.seedCode || formatSeedCode(report.seed)}`,
  ];

  const modDefs = getDailyModifierDefs(report.dailyModifierIds);
  if (modDefs.length > 0) {
    lines.push(`🎲 今日词条：${modDefs.map((m) => m.name).join(' · ')}`);
  }

  const statBits = [
    `胜 ${report.combatsWon ?? 0} 场${(report.perfectCombats ?? 0) > 0 ? `（无伤 ${report.perfectCombats}）` : ''}`,
    `精英 ${report.elitesSlain ?? 0}`,
  ];
  if ((report.totalDamageDealt ?? 0) > 0) {
    statBits.push(`总输出 ${report.totalDamageDealt}`);
  }
  if ((report.highestSingleHit ?? 0) > 0) {
    statBits.push(`最高单击 ${report.highestSingleHit}`);
  }
  if ((report.combatRestarts ?? 0) > 0) {
    statBits.push(`重启战斗 ${report.combatRestarts} 次`);
  }
  lines.push(`⚔️ 战绩：${statBits.join(' | ')}`);

  if ((report.combatRestarts ?? 0) > 0) {
    lines.push(`🔄 备注：本局共使用「重启本场战斗」${report.combatRestarts} 次`);
  }

  if (!isWin && report.defeatedBy) {
    lines.push(`🕯️ 败因：${report.defeatedBy}`);
  }

  const relicNames = (report.relicIds || [])
    .map((id) => RELIC_LIBRARY[id]?.name)
    .filter(Boolean);
  if (relicNames.length > 0) {
    const shown = relicNames.slice(0, 7).join('、');
    const suffix = relicNames.length > 7 ? ` 等 ${relicNames.length} 件` : '';
    lines.push(`💎 遗物 (${relicNames.length})：${shown}${suffix}`);
  }

  const deckItems = Array.isArray(report.deckSummary) ? report.deckSummary : [];
  if (deckItems.length > 0) {
    const highlights = deckItems
      .filter((item) => {
        const def = CARD_LIBRARY[item.cardId];
        return def && def.rarity !== 'starter';
      })
      .slice(0, 8)
      .map((item) => {
        const stats = getCardStats({ instanceId: 'r', cardId: item.cardId, upgraded: item.upgraded });
        return item.count > 1 ? `${stats.name}×${item.count}` : stats.name;
      });
    const upgCount =
      report.upgradedCount ??
      deckItems.reduce((sum, item) => sum + (item.upgraded ? item.count : 0), 0);
    lines.push(
      `🃏 牌组 (${report.deckSize ?? 0} 张，升级 ${upgCount})${highlights.length > 0 ? `：${highlights.join('、')}` : ''}`
    );
  }

  if (shareUrl) {
    lines.push(`🔗 来挑战同图：${shareUrl}`);
  }

  return lines.join('\n');
}

export function getRunRecordKey(state) {
  if (!state) return '';
  if (state.runId) return String(state.runId);
  const charId = state.characterId || 'ironclad';
  const dailyPart = state.dailyChallenge?.dateKey ? `_daily_${state.dailyChallenge.dateKey}` : '';
  return `${charId}_${state.seed}_${state.ascension ?? 0}_${state.stats?.floorsCleared ?? 0}_${state.runOutcome ?? 'end'}${state.isChallengeRun ? '_ch' : ''}${dailyPart}`;
}

export function recordCompletedRun(meta, state) {
  if (!meta || !state) {
    return { xpGained: 0, newlyUnlockedTiers: [], unlockedAscension: null, alreadyRecorded: false };
  }
  const runKey = getRunRecordKey(state);
  if (!Array.isArray(meta.recordedRunKeys)) {
    meta.recordedRunKeys = [];
  }
  if (!Array.isArray(meta.runHistory)) {
    meta.runHistory = [];
  }
  if (!meta.dailyRecords || typeof meta.dailyRecords !== 'object') {
    meta.dailyRecords = {};
  }
  if (meta.recordedRunKeys.includes(runKey)) {
    const existing = meta.runHistory.find((r) => r.id === runKey) || null;
    return {
      xpGained: existing?.xpGained ?? 0,
      newlyUnlockedTiers: [],
      unlockedAscension: null,
      alreadyRecorded: true,
      historyEntry: existing,
    };
  }

  meta.recordedRunKeys.push(runKey);
  if (meta.recordedRunKeys.length > 60) {
    meta.recordedRunKeys.splice(0, meta.recordedRunKeys.length - 60);
  }

  const prevTier = computeUnlockedTierFromXp(meta.xp);
  const xpGained = calculateRunXp(state);
  meta.xp = (meta.xp ?? 0) + xpGained;
  const nextTier = computeUnlockedTierFromXp(meta.xp);
  meta.unlockedTier = Math.max(meta.unlockedTier ?? 0, nextTier);

  const newlyUnlockedTiers = UNLOCK_TIERS.filter(
    (t) => t.tier > prevTier && t.tier <= meta.unlockedTier
  );

  const report = buildRunReportFromState(state);

  meta.runsPlayed = (meta.runsPlayed ?? 0) + 1;
  meta.totalEnemiesSlain = (meta.totalEnemiesSlain ?? 0) + (state.stats?.enemiesSlain ?? 0);
  const totalFloorReached = ((state.act ?? 1) - 1) * 16 + (state.floor ?? 0);
  meta.bestFloor = Math.max(meta.bestFloor ?? 0, totalFloorReached);
  meta.bestScore = Math.max(meta.bestScore ?? 0, report.score);

  const charId = normalizeCharacterId(state.characterId);
  const progressMap = ensureCharacterProgress(meta);
  const charProg = getCharacterProgress(meta, charId);
  const allCharMaxBefore = Math.max(
    0,
    ...Object.values(progressMap).map((p) => p?.maxAscensionUnlocked ?? 0)
  );
  if (charId === 'ironclad' && (meta.maxAscensionUnlocked ?? 0) > allCharMaxBefore) {
    charProg.maxAscensionUnlocked = Math.max(
      charProg.maxAscensionUnlocked ?? 0,
      Math.min(MAX_ASCENSION, Math.floor(meta.maxAscensionUnlocked))
    );
  }
  charProg.runsPlayed = (charProg.runsPlayed ?? 0) + 1;
  charProg.bestFloor = Math.max(charProg.bestFloor ?? 0, totalFloorReached);
  charProg.bestScore = Math.max(charProg.bestScore ?? 0, report.score);

  let unlockedAscension = null;
  if (state.runOutcome === 'victory') {
    meta.victories = (meta.victories ?? 0) + 1;
    charProg.victories = (charProg.victories ?? 0) + 1;
  }
  if (state.runOutcome === 'victory' || state.act3Cleared) {
    const asc = state.ascension ?? 0;
    const currentCharMax = charProg.maxAscensionUnlocked ?? 0;
    const canAdvanceAscension =
      !state.dailyChallenge && (!state.isChallengeRun || asc <= currentCharMax);
    if (canAdvanceAscension && asc >= currentCharMax && currentCharMax < MAX_ASCENSION) {
      charProg.maxAscensionUnlocked = Math.min(MAX_ASCENSION, asc + 1);
      unlockedAscension = charProg.maxAscensionUnlocked;
      meta.maxAscensionUnlocked = Math.max(
        meta.maxAscensionUnlocked ?? 0,
        charProg.maxAscensionUnlocked
      );
    }
  }

  if (report.dailyDateKey) {
    const prevDaily = meta.dailyRecords[report.dailyDateKey];
    const isNewBest = !prevDaily || report.score >= (prevDaily.bestScore ?? 0);
    meta.dailyRecords[report.dailyDateKey] = {
      dateKey: report.dailyDateKey,
      bestScore: isNewBest ? report.score : prevDaily.bestScore,
      bestGrade: isNewBest ? report.grade : prevDaily.bestGrade,
      outcome:
        prevDaily?.outcome === 'victory' || report.outcome === 'victory' ? 'victory' : 'defeat',
      attempts: (prevDaily?.attempts ?? 0) + 1,
      bestFloor: Math.max(prevDaily?.bestFloor ?? 0, totalFloorReached),
      lastPlayedAt: Date.now(),
    };
    const dateKeys = Object.keys(meta.dailyRecords).sort();
    while (dateKeys.length > 45) {
      const oldest = dateKeys.shift();
      delete meta.dailyRecords[oldest];
    }
  }

  const historyEntry = {
    id: runKey,
    timestamp: Date.now(),
    ...report,
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

export function normalizeMetaData(parsed) {
  const base = createDefaultMeta();
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return base;
  const xp = Number.isFinite(parsed.xp) ? Math.max(0, parsed.xp) : 0;
  const maxAsc = Number.isFinite(parsed.maxAscensionUnlocked)
    ? Math.max(0, Math.min(MAX_ASCENSION, Math.floor(parsed.maxAscensionUnlocked)))
    : 0;
  const selChar = normalizeCharacterId(parsed.selectedCharacterId);
  const runHistory = Array.isArray(parsed.runHistory)
    ? parsed.runHistory.slice(0, MAX_RUN_HISTORY)
    : [];
  const characterProgress = createDefaultCharacterProgress();

  if (
    parsed.characterProgress &&
    typeof parsed.characterProgress === 'object' &&
    !Array.isArray(parsed.characterProgress)
  ) {
    for (const cid of CHARACTER_IDS) {
      const src = parsed.characterProgress[cid];
      if (!src || typeof src !== 'object') continue;
      characterProgress[cid] = {
        runsPlayed: Number.isFinite(src.runsPlayed) ? Math.max(0, Math.floor(src.runsPlayed)) : 0,
        victories: Number.isFinite(src.victories) ? Math.max(0, Math.floor(src.victories)) : 0,
        maxAscensionUnlocked: Number.isFinite(src.maxAscensionUnlocked)
          ? Math.max(0, Math.min(MAX_ASCENSION, Math.floor(src.maxAscensionUnlocked)))
          : 0,
        bestFloor: Number.isFinite(src.bestFloor) ? Math.max(0, Math.floor(src.bestFloor)) : 0,
        bestScore: Number.isFinite(src.bestScore) ? Math.max(0, Math.floor(src.bestScore)) : 0,
      };
    }
  } else {
    for (const rec of runHistory) {
      const cid = normalizeCharacterId(rec?.characterId);
      const entry = characterProgress[cid];
      if (!entry) continue;
      entry.runsPlayed += 1;
      const floorReached = ((rec.act ?? 1) - 1) * 16 + (rec.floor ?? 0);
      entry.bestFloor = Math.max(entry.bestFloor, floorReached);
      if (Number.isFinite(rec.score)) {
        entry.bestScore = Math.max(entry.bestScore, rec.score);
      }
      if (rec.outcome === 'victory') {
        entry.victories += 1;
        if (!rec.dailyDateKey && !rec.isChallenge) {
          entry.maxAscensionUnlocked = Math.max(
            entry.maxAscensionUnlocked,
            Math.min(MAX_ASCENSION, Math.floor((rec.ascension ?? 0) + 1))
          );
        }
      }
    }
    characterProgress.ironclad.maxAscensionUnlocked = Math.max(
      characterProgress.ironclad.maxAscensionUnlocked,
      maxAsc
    );
  }

  const effectiveMaxAsc = Math.max(
    maxAsc,
    ...Object.values(characterProgress).map((p) => p.maxAscensionUnlocked ?? 0)
  );
  const unlockAllOverride = Boolean(parsed.unlockAllOverride);
  const selCharMaxAsc = unlockAllOverride
    ? MAX_ASCENSION
    : characterProgress[selChar]?.maxAscensionUnlocked ?? 0;
  const selAsc = Number.isFinite(parsed.selectedAscension)
    ? Math.max(0, Math.min(selCharMaxAsc, Math.floor(parsed.selectedAscension)))
    : 0;
  const dailyRecords =
    parsed.dailyRecords && typeof parsed.dailyRecords === 'object' && !Array.isArray(parsed.dailyRecords)
      ? parsed.dailyRecords
      : {};
  const loaded = {
    xp,
    unlockedTier: Math.max(
      computeUnlockedTierFromXp(xp),
      Number.isFinite(parsed.unlockedTier) ? parsed.unlockedTier : 0
    ),
    maxAscensionUnlocked: effectiveMaxAsc,
    selectedAscension: selAsc,
    selectedCharacterId: selChar,
    characterProgress,
    unlockAllOverride,
    runsPlayed: Number.isFinite(parsed.runsPlayed) ? Math.max(0, Math.floor(parsed.runsPlayed)) : 0,
    victories: Number.isFinite(parsed.victories) ? Math.max(0, Math.floor(parsed.victories)) : 0,
    bestFloor: Number.isFinite(parsed.bestFloor) ? Math.max(0, Math.floor(parsed.bestFloor)) : 0,
    bestScore: Number.isFinite(parsed.bestScore) ? Math.max(0, Math.floor(parsed.bestScore)) : 0,
    totalEnemiesSlain: Number.isFinite(parsed.totalEnemiesSlain)
      ? Math.max(0, Math.floor(parsed.totalEnemiesSlain))
      : 0,
    recordedRunKeys: Array.isArray(parsed.recordedRunKeys) ? parsed.recordedRunKeys.slice(-60) : [],
    dailyRecords,
    runHistory,
    compendium: parsed.compendium,
  };
  ensureCompendium(loaded);
  for (const rec of runHistory) {
    migrateCardList(rec?.deckSnapshot);
    migrateCardList(rec?.deckSummary);
    recordCompendiumDiscovery(loaded, {
      cards: (rec?.deckSnapshot || []).map((c) => c?.cardId).filter(Boolean),
      relics: Array.isArray(rec?.relicIds) ? rec.relicIds : [],
    });
  }
  return loaded;
}

export function loadSavedMeta(storage = globalThis?.localStorage) {
  const base = createDefaultMeta();
  if (!storage) return base;
  try {
    const raw = storage.getItem(META_STORAGE_KEY);
    if (!raw) return base;
    const parsed = JSON.parse(raw);
    return normalizeMetaData(parsed);
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

export const SAVE_BACKUP_APP_ID = 'slay-the-spire-lite';
export const SAVE_BACKUP_SCHEMA_VERSION = 1;

export function exportSaveBackup({ meta, settings = null, activeRun = null } = {}) {
  const safeMeta = normalizeMetaData(meta);
  const safeRun =
    activeRun &&
    typeof activeRun === 'object' &&
    activeRun.screen !== 'game_over' &&
    activeRun.player &&
    Array.isArray(activeRun.player.deck) &&
    Array.isArray(activeRun.map)
      ? structuredClone(activeRun)
      : null;

  return JSON.stringify(
    {
      app: SAVE_BACKUP_APP_ID,
      schemaVersion: SAVE_BACKUP_SCHEMA_VERSION,
      exportedAt: new Date().toISOString(),
      meta: structuredClone(safeMeta),
      settings: settings && typeof settings === 'object' ? { ...settings } : null,
      activeRun: safeRun,
    },
    null,
    2
  );
}

export function validateSaveBackup(rawInput, expectedFloors = 16) {
  let obj = rawInput;
  if (typeof rawInput === 'string') {
    const trimmed = rawInput.trim();
    if (!trimmed) {
      return { ok: false, reason: '存档内容为空，请粘贴或选择有效的 JSON 存档文件。' };
    }
    try {
      obj = JSON.parse(trimmed);
    } catch {
      return { ok: false, reason: 'JSON 格式解析失败，请确认粘贴了完整的导出内容。' };
    }
  }

  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    return { ok: false, reason: '存档结构无效：顶层必须为 JSON 对象。' };
  }
  if (obj.app !== SAVE_BACKUP_APP_ID) {
    return {
      ok: false,
      reason: '这不是《杀戮尖塔 · 简明版》的存档备份文件（缺少有效应用标识）。',
    };
  }
  if (
    !Number.isInteger(obj.schemaVersion) ||
    obj.schemaVersion < 1 ||
    obj.schemaVersion > SAVE_BACKUP_SCHEMA_VERSION
  ) {
    return {
      ok: false,
      reason: `不支持的存档格式版本（v${String(obj.schemaVersion ?? '未知')}）。`,
    };
  }
  if (!obj.meta || typeof obj.meta !== 'object' || Array.isArray(obj.meta)) {
    return { ok: false, reason: '存档缺少生涯数据字段（meta）。' };
  }
  if (obj.meta.xp !== undefined && (!Number.isFinite(obj.meta.xp) || obj.meta.xp < 0)) {
    return { ok: false, reason: '存档生涯历练（xp）数值无效。' };
  }
  if (obj.meta.runHistory !== undefined && !Array.isArray(obj.meta.runHistory)) {
    return { ok: false, reason: '存档历史记录（runHistory）格式损坏。' };
  }

  let validatedRun = null;
  if (obj.activeRun !== null && obj.activeRun !== undefined) {
    const r = obj.activeRun;
    const expectedMapLen = r && r.act === 4 ? 4 : expectedFloors;
    if (
      !r ||
      typeof r !== 'object' ||
      !r.player ||
      typeof r.player !== 'object' ||
      !Array.isArray(r.player.deck) ||
      !Array.isArray(r.map) ||
      r.map.length !== expectedMapLen ||
      typeof r.screen !== 'string' ||
      !Number.isFinite(r.player.hp) ||
      !Number.isFinite(r.player.maxHp)
    ) {
      return { ok: false, reason: '存档中的进行中对局数据（activeRun）结构损坏或不兼容。' };
    }
    validatedRun = migrateLegacyRunCards(structuredClone(r));
  }

  let validatedSettings = null;
  if (obj.settings !== null && obj.settings !== undefined) {
    if (typeof obj.settings !== 'object' || Array.isArray(obj.settings)) {
      return { ok: false, reason: '存档中的设置项（settings）格式无效。' };
    }
    const s = obj.settings;
    validatedSettings = {
      soundEnabled: typeof s.soundEnabled === 'boolean' ? s.soundEnabled : true,
      volume: Number.isFinite(s.volume) ? Math.max(0, Math.min(100, Math.round(s.volume))) : 65,
      animSpeed:
        s.animSpeed === 'normal' || s.animSpeed === 'fast' || s.animSpeed === 'off'
          ? s.animSpeed
          : 'normal',
      showDamageNumbers: typeof s.showDamageNumbers === 'boolean' ? s.showDamageNumbers : true,
      tutorialDismissed: Boolean(s.tutorialDismissed),
      mobileTapConfirm: Boolean(s.mobileTapConfirm),
    };
  }

  const normalizedMeta = normalizeMetaData(obj.meta);
  const comp = ensureCompendium(normalizedMeta);
  const compendiumCount =
    comp.cards.length + comp.relics.length + comp.potions.length + comp.enemies.length;

  return {
    ok: true,
    backup: {
      meta: normalizedMeta,
      settings: validatedSettings,
      activeRun: validatedRun,
      exportedAt: typeof obj.exportedAt === 'string' ? obj.exportedAt : null,
    },
    summary: {
      runsPlayed: normalizedMeta.runsPlayed ?? 0,
      victories: normalizedMeta.victories ?? 0,
      xp: normalizedMeta.xp ?? 0,
      compendiumCount,
      historyCount: normalizedMeta.runHistory?.length ?? 0,
      hasActiveRun: Boolean(validatedRun),
    },
  };
}
