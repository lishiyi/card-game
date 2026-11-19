import {
  canUpgradeCard,
  CARD_LIBRARY,
  createCardInstance,
  CURSE_CARD_IDS,
  getCardStats,
  REWARD_CARD_POOLS,
  STARTER_DECK_RECIPE,
} from '../data/cards.js';
import { ENCOUNTERS, ENEMY_TEMPLATES } from '../data/enemies.js';
import { EVENT_IDS, EVENT_LIBRARY, generateSpireMap, TOTAL_FLOORS } from '../data/events.js';
import {
  ALL_POTION_IDS,
  BOSS_RELIC_IDS,
  NON_STARTER_RELIC_IDS,
  POTION_LIBRARY,
  RELIC_LIBRARY,
  RELIC_POOLS,
} from '../data/relics.js';
import {
  endPlayerTurn,
  hasRelic,
  playCard,
  restartCombat,
  startCombat,
  usePotion,
} from './combat.js';
import { getLockedContentSets, MAX_ASCENSION } from './meta.js';
import { nextRandom, normalizeSeed, pickDistinct, pickRandom, randomInt } from './rng.js';

export const STARTER_POTION_SLOTS = 3;

export function getCurrentPurgeCost(state) {
  const base = 75 + (state?.purgeCount ?? 0) * 25;
  return (state?.ascension ?? 0) >= 5 ? Math.round(base * 1.15) : base;
}

export function getCurrentBossEncounter(state) {
  const pool = (state?.act ?? 1) >= 2 ? ENCOUNTERS.act2Boss : ENCOUNTERS.boss;
  const found = pool.find((e) => e.id === state?.bossEncounterId);
  return found || pool[0];
}

export function getCurrentBossName(state) {
  const enc = getCurrentBossEncounter(state);
  const tplId = enc?.enemies?.[0]?.templateId;
  return ENEMY_TEMPLATES[tplId]?.name || enc?.name || '尖塔首领';
}

export function grantRelicToPlayer(state, relicId) {
  if (!relicId || !RELIC_LIBRARY[relicId] || hasRelic(state, relicId)) return false;
  state.player.relics.push(relicId);
  const def = RELIC_LIBRARY[relicId];
  if (def.energyBonus) {
    state.player.maxEnergy += def.energyBonus;
    state.player.energy = state.player.maxEnergy;
  }
  return true;
}

export function createNewRun(options = {}) {
  const seed = normalizeSeed(options.seed);
  const ascension = Math.max(0, Math.min(MAX_ASCENSION, Math.floor(options.ascension ?? 0)));
  const unlockedTier = options.unlockedTier ?? 3;
  const unlockAllOverride = Boolean(options.unlockAllOverride);
  const startingHp = ascension >= 4 ? 75 : 80;

  const state = {
    seed,
    rngState: seed,
    nextUid: 1,
    act: 1,
    ascension,
    unlockedTier,
    unlockAllOverride,
    isChallengeRun: Boolean(options.isChallengeRun),
    purgeCount: 0,
    rarePityBonus: 0,
    bossEncounterId: null,
    screen: 'map',
    runOutcome: null,
    floor: 0,
    currentNodeId: null,
    visitedEdges: [],
    lastEncounterId: null,
    lastEliteId: null,
    visitedEventIds: [],
    neowState: null,
    player: {
      name: '铁甲战士',
      hp: startingHp,
      maxHp: startingHp,
      gold: 99,
      maxEnergy: 3,
      energy: 3,
      block: 0,
      relics: ['burning_blood'],
      potions: ['fire_potion', null, null],
      deck: [],
      statuses: {},
      skipStatusTick: {},
    },
    map: [],
    combat: null,
    combatSnapshot: null,
    reward: null,
    bossReward: null,
    treasureState: null,
    restState: null,
    shop: null,
    eventState: null,
    stats: {
      floorsCleared: 0,
      combatsWon: 0,
      elitesSlain: 0,
      enemiesSlain: 0,
      cardsPlayed: 0,
    },
  };

  state.player.deck = STARTER_DECK_RECIPE.map((cardId) =>
    createCardInstance(state, cardId, false)
  );
  if (ascension >= 5) {
    state.player.deck.push(createCardInstance(state, 'clumsy', false));
  }

  state.map = generateSpireMap(state);
  state.bossEncounterId = pickRandom(state, ENCOUNTERS.boss).id;
  state.neowState = options.skipNeow ? null : generateNeowState(state);

  return state;
}

export function hasPendingNeowBlessing(state) {
  return Boolean(
    state &&
      (state.act ?? 1) === 1 &&
      !state.currentNodeId &&
      state.neowState &&
      !state.neowState.resolved
  );
}

export function findMapNode(state, nodeId) {
  for (const row of state.map) {
    for (const node of row) {
      if (node.id === nodeId) return node;
    }
  }
  return null;
}

export function getAvailableNodeIds(state) {
  if (!state?.map || state.map.length === 0) return [];
  if (hasPendingNeowBlessing(state)) return [];
  if (!state.currentNodeId) {
    return state.map[0].map((n) => n.id);
  }
  const currentNode = findMapNode(state, state.currentNodeId);
  return currentNode ? [...currentNode.nextIds] : [];
}

function getUnlockedPools(state) {
  const { lockedCardIds, lockedRelicIds } = getLockedContentSets(
    state?.unlockedTier ?? 3,
    Boolean(state?.unlockAllOverride)
  );
  const filterCards = (ids) => {
    const unlocked = ids.filter((id) => !lockedCardIds.has(id));
    return unlocked.length > 0 ? unlocked : ids;
  };
  const filterRelics = (ids) => ids.filter((id) => !lockedRelicIds.has(id));
  return {
    cards: {
      common: filterCards(REWARD_CARD_POOLS.common),
      uncommon: filterCards(REWARD_CARD_POOLS.uncommon),
      rare: filterCards(REWARD_CARD_POOLS.rare),
    },
    relics: {
      common: filterRelics(RELIC_POOLS.common),
      uncommon: filterRelics(RELIC_POOLS.uncommon),
      rare: filterRelics(RELIC_POOLS.rare),
      allNonBoss: NON_STARTER_RELIC_IDS.filter((id) => !lockedRelicIds.has(id)),
    },
  };
}

function rollUnownedRelicId(state, source = 'elite') {
  const { relics } = getUnlockedPools(state);
  const unowned = (pool) => pool.filter((id) => !hasRelic(state, id));
  const fallback = unowned(relics.allNonBoss);
  if (fallback.length === 0) return null;

  const r = nextRandom(state);
  let tierPool;
  if (source === 'elite') {
    if (r < 0.2) tierPool = unowned(relics.rare);
    else if (r < 0.58) tierPool = unowned(relics.uncommon);
    else tierPool = unowned(relics.common);
  } else if (source === 'treasure' || source === 'shop') {
    if (r < 0.16) tierPool = unowned(relics.rare);
    else if (r < 0.52) tierPool = unowned(relics.uncommon);
    else tierPool = unowned(relics.common);
  } else {
    if (r < 0.12) tierPool = unowned(relics.rare);
    else if (r < 0.46) tierPool = unowned(relics.uncommon);
    else tierPool = unowned(relics.common);
  }

  return pickRandom(state, tierPool.length > 0 ? tierPool : fallback);
}

export function rollRewardCards(state, count = 3, role = 'normal', options = {}) {
  const chosenCardIds = [];
  const { cards } = getUnlockedPools(state);
  const allNonStarter = [...cards.common, ...cards.uncommon, ...cards.rare];
  const trackPity = options.affectPity !== false;

  for (let i = 0; i < count; i += 1) {
    const r = nextRandom(state);
    const baseRare = role === 'elite' ? 0.16 : 0.05;
    const rareChance = Math.min(0.65, baseRare + (state.rarePityBonus ?? 0));
    const uncommonCeiling = rareChance + (role === 'elite' ? 0.44 : 0.35);

    let pool;
    let rolledRare = false;
    if (r < rareChance) {
      pool = cards.rare;
      rolledRare = true;
    } else if (r < uncommonCeiling) {
      pool = cards.uncommon;
    } else {
      pool = cards.common;
    }

    const available = pool.filter((id) => !chosenCardIds.includes(id));
    const fallback = allNonStarter.filter((id) => !chosenCardIds.includes(id));
    const pickedId = pickRandom(state, available.length > 0 ? available : fallback);
    if (pickedId) {
      chosenCardIds.push(pickedId);
      if (trackPity) {
        if (rolledRare || CARD_LIBRARY[pickedId]?.rarity === 'rare') {
          state.rarePityBonus = 0;
        } else {
          state.rarePityBonus = Math.min(
            0.4,
            Number(((state.rarePityBonus ?? 0) + 0.02).toFixed(4))
          );
        }
      }
    }
  }

  const upgradeChance =
    (state.act ?? 1) >= 2
      ? 0.35
      : state.floor >= 11
        ? 0.22
        : state.floor >= 5
          ? 0.12
          : 0;

  return chosenCardIds.map((cardId) => {
    const upgraded = upgradeChance > 0 && nextRandom(state) < upgradeChance;
    return createCardInstance(state, cardId, upgraded);
  });
}

function buildShopState(state) {
  const { cards: unlockedCards } = getUnlockedPools(state);
  const priceMult = (state.ascension ?? 0) >= 5 ? 1.15 : 1;

  const commonOffers = pickDistinct(state, unlockedCards.common, 3);
  const uncommonOffer = pickDistinct(state, unlockedCards.uncommon, 1);
  const rareOffer = pickDistinct(state, unlockedCards.rare, 1);
  const offerIds = [...commonOffers, ...uncommonOffer, ...rareOffer];
  const saleIndex = randomInt(state, 0, Math.max(0, offerIds.length - 1));

  const cards = offerIds.map((cardId, idx) => {
    const instance = createCardInstance(state, cardId, false);
    const stats = getCardStats(instance);
    const jitter = randomInt(state, -4, 6);
    const basePrice = Math.round(Math.max(30, stats.price + jitter) * priceMult);
    const onSale = idx === saleIndex;
    return {
      card: instance,
      price: onSale ? Math.floor(basePrice * 0.65) : basePrice,
      onSale,
      sold: false,
    };
  });

  const relicId = rollUnownedRelicId(state, 'shop');
  const relicOffer = relicId
    ? {
        relicId,
        price: Math.round((RELIC_LIBRARY[relicId].price + randomInt(state, -8, 8)) * priceMult),
        sold: false,
      }
    : null;

  const potionId = pickRandom(state, ALL_POTION_IDS);
  const potionOffer = potionId
    ? {
        potionId,
        price: Math.round(POTION_LIBRARY[potionId].price * priceMult),
        sold: false,
      }
    : null;

  return {
    cards,
    relicOffer,
    potionOffer,
    purgeCost: getCurrentPurgeCost(state),
    purgeUsed: false,
  };
}

export function transitionCombatVictory(state) {
  const role = state.combat?.role ?? 'normal';
  if (role === 'boss') {
    if ((state.act ?? 1) >= 2) {
      state.screen = 'game_over';
      state.runOutcome = 'victory';
      return;
    }

    const bossGold = randomInt(state, 92, 115);
    state.player.gold += bossGold;
    const cardChoices = rollDistinctRareCards(state, 3);
    state.rarePityBonus = 0;
    const unownedBossRelics = BOSS_RELIC_IDS.filter((id) => {
      if (hasRelic(state, id)) return false;
      const req = RELIC_LIBRARY[id]?.requiresRelic;
      if (req && !hasRelic(state, req)) return false;
      return true;
    });
    const relicChoices = pickDistinct(state, unownedBossRelics, 3);
    state.bossReward = {
      bossGold,
      cardChoices,
      cardClaimed: false,
      pickedCardId: null,
      relicChoices,
      pickedRelicId: null,
    };
    state.screen = 'boss_reward';
    return;
  }

  const isElite = role === 'elite';
  const effectiveFloor = ((state.act ?? 1) - 1) * TOTAL_FLOORS + Math.max(1, state.floor || 1);
  const gold = isElite
    ? randomInt(state, 38, 50) + Math.floor(effectiveFloor * 2.2)
    : randomInt(state, 18, 26) + Math.floor(effectiveFloor * 1.5);

  const relicId = isElite ? rollUnownedRelicId(state, 'elite') : null;
  const dropPotion = nextRandom(state) < (isElite ? 0.65 : 0.42);
  const potionId = dropPotion ? pickRandom(state, ALL_POTION_IDS) : null;
  const cardChoices = rollRewardCards(state, 3, role);

  state.reward = {
    role,
    gold,
    goldClaimed: false,
    relicId,
    relicClaimed: !relicId,
    potionId,
    potionClaimed: !potionId,
    cardChoices,
    cardClaimed: false,
    pickedCardId: null,
  };
  state.screen = 'reward';
}

export function selectMapNode(state, nodeId) {
  if (state.screen !== 'map') {
    return { ok: false, reason: '当前不在尖塔地图界面' };
  }
  if (hasPendingNeowBlessing(state)) {
    return { ok: false, reason: '请先在地图上方选择一项【鲸鱼赐福】，再开启第 1 层攀登' };
  }
  const available = getAvailableNodeIds(state);
  if (!available.includes(nodeId)) {
    return { ok: false, reason: '该节点当前不可前往' };
  }

  const node = findMapNode(state, nodeId);
  if (!node) {
    return { ok: false, reason: '地图节点不存在' };
  }

  if (state.currentNodeId) {
    if (!Array.isArray(state.visitedEdges)) state.visitedEdges = [];
    const edgeKey = `${state.currentNodeId}->${node.id}`;
    if (!state.visitedEdges.includes(edgeKey)) {
      state.visitedEdges.push(edgeKey);
    }
  }

  node.visited = true;
  state.currentNodeId = node.id;
  state.floor = node.floor;
  state.stats.floorsCleared = (state.stats.floorsCleared ?? 0) + 1;

  const isAct2 = (state.act ?? 1) >= 2;

  switch (node.type) {
    case 'combat': {
      const pool = isAct2
        ? node.floor <= 5
          ? ENCOUNTERS.act2Early
          : ENCOUNTERS.act2Hard
        : node.floor <= 2
          ? ENCOUNTERS.floor1
          : node.floor <= 8
            ? ENCOUNTERS.normal
            : ENCOUNTERS.hardNormal;
      const nonRepeat = pool.filter((e) => e.id !== state.lastEncounterId);
      const encounter = pickRandom(state, nonRepeat.length > 0 ? nonRepeat : pool);
      state.lastEncounterId = encounter.id;
      startCombat(state, encounter, 'normal', transitionCombatVictory);
      return { ok: true, screen: state.screen };
    }
    case 'elite': {
      const elitePool = isAct2 ? ENCOUNTERS.act2Elite : ENCOUNTERS.elite;
      const nonRepeat = elitePool.filter((e) => e.id !== state.lastEliteId);
      const encounter = pickRandom(state, nonRepeat.length > 0 ? nonRepeat : elitePool);
      state.lastEliteId = encounter.id;
      state.lastEncounterId = encounter.id;
      startCombat(state, encounter, 'elite', transitionCombatVictory);
      return { ok: true, screen: state.screen };
    }
    case 'boss': {
      const encounter = getCurrentBossEncounter(state);
      state.lastEncounterId = encounter.id;
      startCombat(state, encounter, 'boss', transitionCombatVictory);
      return { ok: true, screen: state.screen };
    }
    case 'treasure': {
      state.treasureState = {
        opened: false,
        relicId: null,
        gold: 0,
        curseCardId: null,
        outcomeText: '',
      };
      state.screen = 'treasure';
      return { ok: true, screen: state.screen };
    }
    case 'rest': {
      let featherHealed = 0;
      if (hasRelic(state, 'eternal_feather') && state.player.hp > 0) {
        const heal = Math.floor(state.player.deck.length / 5) * 3;
        if (heal > 0) {
          const before = state.player.hp;
          state.player.hp = Math.min(state.player.maxHp, state.player.hp + heal);
          featherHealed = state.player.hp - before;
        }
      }
      state.restState = { completed: false, lastAction: null, featherHealed };
      state.screen = 'rest';
      return { ok: true, screen: state.screen };
    }
    case 'shop': {
      state.shop = buildShopState(state);
      state.screen = 'shop';
      return { ok: true, screen: state.screen };
    }
    case 'event': {
      const unseen = EVENT_IDS.filter((id) => !state.visitedEventIds.includes(id));
      const eventId = pickRandom(state, unseen.length > 0 ? unseen : EVENT_IDS);
      state.visitedEventIds.push(eventId);
      state.eventState = {
        eventId,
        resolved: false,
        pendingPurge: false,
        pendingCardAction: null, // 'transform' | 'upgrade' | null
        libraryChoices: null,
        outcomeText: '',
        upgradedCardIds: [],
        addedCardIds: [],
      };
      state.screen = 'event';
      return { ok: true, screen: state.screen };
    }
    default:
      return { ok: false, reason: `未知节点类型: ${node.type}` };
  }
}

// === Combat Action Wrappers (auto-wiring post-combat transition) ===

export function runPlayCard(state, instanceId, targetEnemyId = null) {
  return playCard(state, instanceId, targetEnemyId, transitionCombatVictory);
}

export function runUsePotion(state, slotIndex, targetEnemyId = null) {
  return usePotion(state, slotIndex, targetEnemyId, transitionCombatVictory);
}

export function runEndTurn(state) {
  return endPlayerTurn(state, transitionCombatVictory);
}

export function runRestartCombat(state) {
  return restartCombat(state);
}

export function discardPotion(state, slotIndex) {
  if (!Number.isInteger(slotIndex) || slotIndex < 0 || slotIndex >= state.player.potions.length) {
    return { ok: false, reason: '药水栏位无效' };
  }
  if (!state.player.potions[slotIndex]) {
    return { ok: false, reason: '该栏位为空' };
  }
  state.player.potions[slotIndex] = null;
  return { ok: true };
}

function findEmptyPotionSlot(state) {
  return state.player.potions.findIndex((p) => p === null);
}

// === Treasure Chest Actions ===

export function openTreasureChest(state) {
  if (state.screen !== 'treasure' || !state.treasureState || state.treasureState.opened) {
    return { ok: false, reason: '当前宝箱已开启或不在宝箱界面' };
  }
  const relicId = rollUnownedRelicId(state, 'treasure');
  const gold = relicId ? (nextRandom(state) < 0.55 ? randomInt(state, 24, 48) : 0) : 85;

  if (relicId) {
    grantRelicToPlayer(state, relicId);
  }
  if (gold > 0) {
    state.player.gold += gold;
  }

  let curseCard = null;
  if (hasRelic(state, 'cursed_key')) {
    const curseId = pickRandom(state, CURSE_CARD_IDS);
    curseCard = createCardInstance(state, curseId, false);
    state.player.deck.push(curseCard);
  }

  const parts = [];
  if (relicId) parts.push(`获得遗物【${RELIC_LIBRARY[relicId].name}】`);
  if (gold > 0) parts.push(`获得 ${gold} 金币`);
  if (curseCard) {
    parts.push(`受【诅咒钥匙】影响，牌组加入了诅咒【${getCardStats(curseCard).name}】`);
  }

  state.treasureState.opened = true;
  state.treasureState.relicId = relicId;
  state.treasureState.gold = gold;
  state.treasureState.curseCardId = curseCard?.instanceId ?? null;
  state.treasureState.outcomeText = `${parts.join('，')}！`;

  return { ok: true, relicId, gold, curseCard };
}

export function leaveTreasureRoom(state) {
  if (state.screen !== 'treasure') {
    return { ok: false, reason: '当前不在宝箱界面' };
  }
  state.treasureState = null;
  state.screen = 'map';
  return { ok: true };
}

// === Boss Relic Altar & Act 2 Progression ===

export function claimBossRelic(state, relicId) {
  if (state.screen !== 'boss_reward' || !state.bossReward) {
    return { ok: false, reason: '当前不在首领遗物祭坛界面' };
  }
  if (state.bossReward.pickedRelicId) {
    return { ok: false, reason: '已选择过首领遗物' };
  }
  if (!state.bossReward.relicChoices.includes(relicId)) {
    return { ok: false, reason: '该首领遗物不在候选中' };
  }
  grantRelicToPlayer(state, relicId);
  state.bossReward.pickedRelicId = relicId;
  return { ok: true };
}

export function claimBossRewardCard(state, instanceId) {
  if (state.screen !== 'boss_reward' || !state.bossReward) {
    return { ok: false, reason: '当前不在首领战利品界面' };
  }
  if (state.bossReward.cardClaimed) {
    return { ok: false, reason: '已选择过首领稀有卡牌' };
  }
  const choices = Array.isArray(state.bossReward.cardChoices) ? state.bossReward.cardChoices : [];
  const chosen = choices.find((c) => c.instanceId === instanceId);
  if (!chosen) {
    return { ok: false, reason: '未找到该首领稀有卡牌' };
  }
  const added = createCardInstance(state, chosen.cardId, chosen.upgraded);
  state.player.deck.push(added);
  state.bossReward.cardClaimed = true;
  state.bossReward.pickedCardId = chosen.instanceId;
  return { ok: true, addedCard: added };
}

export function proceedToNextAct(state) {
  if (state.screen !== 'boss_reward' || !state.bossReward) {
    return { ok: false, reason: '当前不在首领遗物祭坛界面' };
  }
  const missingHp = Math.max(0, state.player.maxHp - state.player.hp);
  const healRatio = (state.ascension ?? 0) >= 4 ? 0.6 : 0.75;
  state.player.hp = Math.min(state.player.maxHp, state.player.hp + Math.round(missingHp * healRatio));

  state.act = 2;
  state.floor = 0;
  state.currentNodeId = null;
  state.visitedEdges = [];
  state.lastEncounterId = null;
  state.lastEliteId = null;
  state.bossReward = null;
  state.combat = null;
  state.map = generateSpireMap(state);
  state.bossEncounterId = pickRandom(state, ENCOUNTERS.act2Boss).id;
  state.screen = 'map';
  return { ok: true };
}

export function settleAct1Victory(state) {
  if (state.screen !== 'boss_reward' || !state.bossReward) {
    return { ok: false, reason: '当前不在首领遗物祭坛界面' };
  }
  state.bossReward = null;
  state.combat = null;
  state.screen = 'game_over';
  state.runOutcome = 'victory';
  return { ok: true };
}

// === Reward Actions ===

export function claimRewardGold(state) {
  if (state.screen !== 'reward' || !state.reward) {
    return { ok: false, reason: '当前不在战利品界面' };
  }
  if (state.reward.goldClaimed) {
    return { ok: false, reason: '金币已领取' };
  }
  state.player.gold += state.reward.gold;
  state.reward.goldClaimed = true;
  return { ok: true };
}

export function claimRewardRelic(state) {
  if (state.screen !== 'reward' || !state.reward) {
    return { ok: false, reason: '当前不在战利品界面' };
  }
  if (state.reward.relicClaimed || !state.reward.relicId) {
    return { ok: false, reason: '没有可领取的遗物' };
  }
  grantRelicToPlayer(state, state.reward.relicId);
  state.reward.relicClaimed = true;
  return { ok: true };
}

export function claimRewardPotion(state) {
  if (state.screen !== 'reward' || !state.reward) {
    return { ok: false, reason: '当前不在战利品界面' };
  }
  if (state.reward.potionClaimed || !state.reward.potionId) {
    return { ok: false, reason: '没有可领取的药水' };
  }
  const emptySlot = findEmptyPotionSlot(state);
  if (emptySlot === -1) {
    return { ok: false, reason: '药水栏已满，请先丢弃一瓶现有药水' };
  }
  state.player.potions[emptySlot] = state.reward.potionId;
  state.reward.potionClaimed = true;
  return { ok: true };
}

export function claimRewardCard(state, instanceId) {
  if (state.screen !== 'reward' || !state.reward) {
    return { ok: false, reason: '当前不在战利品界面' };
  }
  if (state.reward.cardClaimed) {
    return { ok: false, reason: '已选择过奖励卡牌' };
  }
  const chosen = state.reward.cardChoices.find((c) => c.instanceId === instanceId);
  if (!chosen) {
    return { ok: false, reason: '未找到该奖励卡牌' };
  }
  const added = createCardInstance(state, chosen.cardId, chosen.upgraded);
  state.player.deck.push(added);
  state.reward.cardClaimed = true;
  state.reward.pickedCardId = chosen.instanceId;
  return { ok: true, addedCard: added };
}

export function getUnclaimedImportantRewards(state) {
  const rw = state?.reward;
  if (state?.screen !== 'reward' || !rw) {
    return {
      hasUnclaimed: false,
      items: [],
      hasGold: false,
      hasRelic: false,
      message: '',
    };
  }
  const items = [];
  const hasGold = rw.gold > 0 && !rw.goldClaimed;
  const hasRelic = Boolean(rw.relicId) && !rw.relicClaimed;
  if (hasGold) {
    items.push(`【${rw.gold} 金币】`);
  }
  if (hasRelic) {
    const relicName = RELIC_LIBRARY[rw.relicId]?.name ?? rw.relicId;
    items.push(`遗物【${relicName}】`);
  }
  const hasUnclaimed = items.length > 0;
  const message = hasUnclaimed
    ? `你还有 ${items.join('、')} 尚未拾取，确定不拾取直接继续前进吗？`
    : '';
  return { hasUnclaimed, items, hasGold, hasRelic, message };
}

export function proceedFromReward(state, options = {}) {
  if (state.screen !== 'reward') {
    return { ok: false, reason: '当前不在战利品界面' };
  }
  if (!options.force) {
    const check = getUnclaimedImportantRewards(state);
    if (check.hasUnclaimed) {
      return {
        ok: false,
        requiresConfirm: true,
        unclaimedItems: check.items,
        reason: check.message,
      };
    }
  }
  state.reward = null;
  state.combat = null;
  state.screen = 'map';
  return { ok: true };
}

// === Rest Site Actions ===

export function getUpgradableDeckCards(state) {
  if (!state?.player?.deck) return [];
  return state.player.deck.filter((c) => canUpgradeCard(c));
}

export function restHeal(state) {
  if (state.screen !== 'rest' || !state.restState || state.restState.completed) {
    return { ok: false, reason: '当前不能在营地休息' };
  }
  if (hasRelic(state, 'coffee_dripper')) {
    return { ok: false, reason: '持有遗物【咖啡滤滴器】，无法在篝火营地通过休息回复生命' };
  }
  const healPct = (state.ascension ?? 0) >= 4 ? 0.25 : 0.3;
  const healAmount = Math.max(1, Math.floor(state.player.maxHp * healPct));
  const before = state.player.hp;
  state.player.hp = Math.min(state.player.maxHp, state.player.hp + healAmount);
  state.restState.completed = true;
  state.restState.lastAction = `回复了 ${state.player.hp - before} 点生命`;
  state.screen = 'map';
  return { ok: true, healed: state.player.hp - before };
}

export function restUpgradeCard(state, instanceId) {
  if (state.screen !== 'rest' || !state.restState || state.restState.completed) {
    return { ok: false, reason: '当前不能在营地锻造' };
  }
  const card = state.player.deck.find((c) => c.instanceId === instanceId);
  if (!card || !canUpgradeCard(card)) {
    return { ok: false, reason: '该卡牌无法升级' };
  }
  card.upgraded = true;
  state.restState.completed = true;
  state.restState.lastAction = `升级了【${CARD_LIBRARY[card.cardId].name}+】`;
  state.screen = 'map';
  return { ok: true, card };
}

export function leaveRestSite(state) {
  if (state.screen !== 'rest') {
    return { ok: false, reason: '当前不在营地界面' };
  }
  state.screen = 'map';
  return { ok: true };
}

// === Shop Actions ===

export function buyShopCard(state, offerIndex) {
  if (state.screen !== 'shop' || !state.shop) {
    return { ok: false, reason: '当前不在商店界面' };
  }
  const offer = state.shop.cards[offerIndex];
  if (!offer || offer.sold) {
    return { ok: false, reason: '该卡牌已售出或不存在' };
  }
  if (state.player.gold < offer.price) {
    return { ok: false, reason: '金币不足' };
  }
  state.player.gold -= offer.price;
  offer.sold = true;
  const added = createCardInstance(state, offer.card.cardId, offer.card.upgraded);
  state.player.deck.push(added);
  return { ok: true, addedCard: added };
}

export function buyShopRelic(state) {
  if (state.screen !== 'shop' || !state.shop?.relicOffer) {
    return { ok: false, reason: '没有可购买的遗物' };
  }
  const offer = state.shop.relicOffer;
  if (offer.sold) {
    return { ok: false, reason: '该遗物已售出' };
  }
  if (state.player.gold < offer.price) {
    return { ok: false, reason: '金币不足' };
  }
  state.player.gold -= offer.price;
  offer.sold = true;
  grantRelicToPlayer(state, offer.relicId);
  return { ok: true };
}

export function buyShopPotion(state) {
  if (state.screen !== 'shop' || !state.shop?.potionOffer) {
    return { ok: false, reason: '没有可购买的药水' };
  }
  const offer = state.shop.potionOffer;
  if (offer.sold) {
    return { ok: false, reason: '该药水已售出' };
  }
  if (state.player.gold < offer.price) {
    return { ok: false, reason: '金币不足' };
  }
  const emptySlot = findEmptyPotionSlot(state);
  if (emptySlot === -1) {
    return { ok: false, reason: '药水栏已满' };
  }
  state.player.gold -= offer.price;
  offer.sold = true;
  state.player.potions[emptySlot] = offer.potionId;
  return { ok: true };
}

export function buyShopPurge(state, instanceId) {
  if (state.screen !== 'shop' || !state.shop) {
    return { ok: false, reason: '当前不在商店界面' };
  }
  if (state.shop.purgeUsed) {
    return { ok: false, reason: '本次商店的卡牌移除服务已使用' };
  }
  if (state.player.deck.length <= 1) {
    return { ok: false, reason: '牌组至少需要保留 1 张卡牌' };
  }
  if (state.player.gold < state.shop.purgeCost) {
    return { ok: false, reason: '金币不足' };
  }
  const idx = state.player.deck.findIndex((c) => c.instanceId === instanceId);
  if (idx === -1) {
    return { ok: false, reason: '未在牌组中找到该卡牌' };
  }
  state.player.gold -= state.shop.purgeCost;
  state.shop.purgeUsed = true;
  state.purgeCount = (state.purgeCount ?? 0) + 1;
  const [removed] = state.player.deck.splice(idx, 1);
  return { ok: true, removed };
}

export function leaveShop(state) {
  if (state.screen !== 'shop') {
    return { ok: false, reason: '当前不在商店界面' };
  }
  state.shop = null;
  state.screen = 'map';
  return { ok: true };
}

// === Event Actions ===

function upgradeRandomCardsInEvent(state, count) {
  const upgradable = getUpgradableDeckCards(state);
  const chosen = pickDistinct(state, upgradable, count);
  for (const c of chosen) {
    c.upgraded = true;
  }
  state.eventState.upgradedCardIds = chosen.map((c) => c.instanceId);
  const names = chosen.map((c) => `【${getCardStats(c).name}】`).join('、');
  return { chosen, names };
}

export function chooseEventOption(state, choiceId) {
  if (state.screen !== 'event' || !state.eventState || state.eventState.resolved) {
    return { ok: false, reason: '当前事件已结算或不在事件界面' };
  }
  const eventDef = EVENT_LIBRARY[state.eventState.eventId];
  if (!eventDef) {
    return { ok: false, reason: '未知事件' };
  }

  state.eventState.upgradedCardIds = [];
  state.eventState.addedCardIds = [];

  switch (eventDef.id) {
    case 'shining_light': {
      if (choiceId === 'enter_light') {
        if (state.player.hp <= 12) {
          return { ok: false, reason: '当前生命值不足（需大于 12 点）' };
        }
        state.player.hp -= 12;
        const { chosen, names } = upgradeRandomCardsInEvent(state, 2);
        state.eventState.resolved = true;
        state.eventState.outcomeText =
          chosen.length > 0
            ? `失去 12 点生命，成功升级了 ${chosen.length} 张卡牌：${names}！`
            : '失去 12 点生命，但当前牌组中已没有可升级的卡牌。';
        return { ok: true };
      }
      if (choiceId === 'leave') {
        state.eventState.resolved = true;
        state.eventState.outcomeText = '你绕开了炽白光束，稳步向更高层进发。';
        return { ok: true };
      }
      return { ok: false, reason: '无效的事件选项' };
    }

    case 'ancient_forge': {
      if (choiceId === 'temper_blade') {
        const { chosen, names } = upgradeRandomCardsInEvent(state, 1);
        state.eventState.resolved = true;
        state.eventState.outcomeText =
          chosen.length > 0
            ? `借助炉膛余温，成功升级了 ${chosen.length} 张卡牌：${names}！`
            : '炉火微温，但当前牌组中已没有可升级的卡牌。';
        return { ok: true };
      }
      if (choiceId === 'overclock_forge') {
        if (state.player.hp <= 6) {
          return { ok: false, reason: '当前生命值不足（需大于 6 点）' };
        }
        if (state.player.gold < 30) {
          return { ok: false, reason: '金币不足（需至少 30 金币）' };
        }
        state.player.hp -= 6;
        state.player.gold -= 30;
        const { chosen, names } = upgradeRandomCardsInEvent(state, 2);
        state.eventState.resolved = true;
        state.eventState.outcomeText =
          chosen.length > 0
            ? `失去 6 点生命并花费 30 金币，成功升级了 ${chosen.length} 张卡牌：${names}！`
            : '失去 6 点生命并花费 30 金币，但当前牌组中已没有可升级的卡牌。';
        return { ok: true };
      }
      if (choiceId === 'scavenge_slag') {
        state.player.gold += 40;
        state.eventState.resolved = true;
        state.eventState.outcomeText = '你拾取了锻台旁的精铁锭，获得 40 金币。';
        return { ok: true };
      }
      return { ok: false, reason: '无效的事件选项' };
    }

    case 'ancient_shrine': {
      if (choiceId === 'pray_purge') {
        if (state.player.deck.length <= 1) {
          return { ok: false, reason: '牌组至少需要保留 1 张卡牌' };
        }
        state.eventState.pendingPurge = true;
        return { ok: true, pendingPurge: true };
      }
      if (choiceId === 'drink_spring') {
        const heal = Math.max(1, Math.floor(state.player.maxHp * 0.25));
        const before = state.player.hp;
        state.player.hp = Math.min(state.player.maxHp, state.player.hp + heal);
        state.eventState.resolved = true;
        state.eventState.outcomeText = `清冽圣泉抚平了伤痛，回复了 ${state.player.hp - before} 点生命。`;
        return { ok: true };
      }
      if (choiceId === 'gather_gold') {
        state.player.gold += 65;
        state.eventState.resolved = true;
        state.eventState.outcomeText = '你将石盘中的金砂收入囊中，获得 65 金币。';
        return { ok: true };
      }
      return { ok: false, reason: '无效的事件选项' };
    }

    case 'thorn_reliquary': {
      if (choiceId === 'open_reliquary') {
        if (state.player.hp <= 8) {
          return { ok: false, reason: '当前生命值不足（需大于 8 点）' };
        }
        state.player.hp -= 8;
        const relicId = rollUnownedRelicId(state, 'event');
        if (relicId) {
          grantRelicToPlayer(state, relicId);
          state.eventState.outcomeText = `你忍痛扯断铁刺（-8 生命），获得了遗物【${RELIC_LIBRARY[relicId].name}】！`;
        } else {
          state.player.gold += 80;
          state.eventState.outcomeText = '秘匣中已无新遗物，你取出了底层封存的 80 金币（-8 生命）。';
        }
        state.eventState.resolved = true;
        return { ok: true };
      }
      if (choiceId === 'take_coins') {
        state.player.gold += 45;
        state.eventState.resolved = true;
        state.eventState.outcomeText = '你拾取了石台周围散落的古币，获得 45 金币。';
        return { ok: true };
      }
      return { ok: false, reason: '无效的事件选项' };
    }

    case 'golden_idol': {
      if (choiceId === 'smash_trap') {
        if (state.player.hp <= 14) {
          return { ok: false, reason: '当前生命值不足（需大于 14 点）' };
        }
        state.player.hp -= 14;
        state.player.gold += 135;
        state.eventState.resolved = true;
        state.eventState.outcomeText = '你夺下纯金神像冲出滚石通道（-14 生命），获得 135 金币！';
        return { ok: true };
      }
      if (choiceId === 'accept_curse_gold') {
        state.player.gold += 175;
        const curse = createCardInstance(state, 'regret', false);
        state.player.deck.push(curse);
        state.eventState.addedCardIds = [curse.instanceId];
        state.eventState.resolved = true;
        state.eventState.outcomeText = '你收下神像与厚重金币（+175 金币），但暗影诅咒【悔恨】缠上了你的牌组！';
        return { ok: true };
      }
      if (choiceId === 'leave_idol') {
        state.eventState.resolved = true;
        state.eventState.outcomeText = '你压下贪念绕开机关基座，平安离开。';
        return { ok: true };
      }
      return { ok: false, reason: '无效的事件选项' };
    }

    case 'living_wall': {
      if (choiceId === 'wall_forget') {
        if (state.player.deck.length <= 1) {
          return { ok: false, reason: '牌组至少需要保留 1 张卡牌' };
        }
        state.eventState.pendingPurge = true;
        return { ok: true, pendingPurge: true };
      }
      if (choiceId === 'wall_change') {
        state.eventState.pendingCardAction = 'transform';
        return { ok: true, pendingCardAction: 'transform' };
      }
      if (choiceId === 'wall_grow') {
        if (getUpgradableDeckCards(state).length === 0) {
          return { ok: false, reason: '当前牌组中没有可升级的卡牌' };
        }
        state.eventState.pendingCardAction = 'upgrade';
        return { ok: true, pendingCardAction: 'upgrade' };
      }
      return { ok: false, reason: '无效的事件选项' };
    }

    case 'cursed_tome': {
      const { cards } = getUnlockedPools(state);
      if (choiceId === 'read_final_chapter') {
        if (state.player.hp <= 14) {
          return { ok: false, reason: '当前生命值不足（需大于 14 点）' };
        }
        state.player.hp -= 14;
        const cardId = pickRandom(state, cards.rare);
        const created = createCardInstance(state, cardId, false);
        state.player.deck.push(created);
        state.eventState.addedCardIds = [created.instanceId];
        state.eventState.resolved = true;
        state.eventState.outcomeText = `鲜血浸透书页（-14 生命），你领悟了稀有战技【${getCardStats(created).name}】！`;
        return { ok: true };
      }
      if (choiceId === 'skim_preface') {
        if (state.player.hp <= 5) {
          return { ok: false, reason: '当前生命值不足（需大于 5 点）' };
        }
        state.player.hp -= 5;
        const cardId = pickRandom(state, cards.uncommon);
        const created = createCardInstance(state, cardId, false);
        state.player.deck.push(created);
        state.eventState.addedCardIds = [created.instanceId];
        state.eventState.resolved = true;
        state.eventState.outcomeText = `你强忍魔典反噬（-5 生命），习得了罕见卡牌【${getCardStats(created).name}】！`;
        return { ok: true };
      }
      if (choiceId === 'close_tome') {
        state.eventState.resolved = true;
        state.eventState.outcomeText = '你合上赤红魔典，稳步向塔顶进发。';
        return { ok: true };
      }
      return { ok: false, reason: '无效的事件选项' };
    }

    case 'potion_alchemist': {
      if (choiceId === 'buy_potions') {
        if (state.player.gold < 35) {
          return { ok: false, reason: '金币不足（需至少 35 金币）' };
        }
        if (findEmptyPotionSlot(state) === -1) {
          return { ok: false, reason: '药水栏已满，无法购买' };
        }
        state.player.gold -= 35;
        const gainedNames = [];
        for (let i = 0; i < state.player.potions.length; i += 1) {
          if (state.player.potions[i] === null) {
            const pid = pickRandom(state, ALL_POTION_IDS);
            state.player.potions[i] = pid;
            gainedNames.push(`【${POTION_LIBRARY[pid].name}】`);
          }
        }
        state.eventState.resolved = true;
        state.eventState.outcomeText = `花费 35 金币，获得了 ${gainedNames.join('、')}！`;
        return { ok: true };
      }
      if (choiceId === 'drink_mutagen') {
        state.player.maxHp += 6;
        state.player.hp = Math.min(state.player.maxHp, state.player.hp + 6);
        state.eventState.resolved = true;
        state.eventState.outcomeText = '狂野热流涌遍全身，最大生命值永久 +6 并回复了 6 点生命！';
        return { ok: true };
      }
      if (choiceId === 'rob_alchemist') {
        state.player.gold += 60;
        const curse = createCardInstance(state, 'doubt', false);
        state.player.deck.push(curse);
        state.eventState.addedCardIds = [curse.instanceId];
        state.eventState.resolved = true;
        state.eventState.outcomeText = '你席卷了 60 金币，但炼金师的怨毒咒言化作【疑虑】混入了你的牌组！';
        return { ok: true };
      }
      return { ok: false, reason: '无效的事件选项' };
    }

    case 'mushroom_grotto': {
      if (choiceId === 'eat_blue_cap') {
        const heal = Math.max(1, Math.floor(state.player.maxHp * 0.35));
        const before = state.player.hp;
        state.player.hp = Math.min(state.player.maxHp, state.player.hp + heal);
        const curse = createCardInstance(state, 'clumsy', false);
        state.player.deck.push(curse);
        state.eventState.addedCardIds = [curse.instanceId];
        state.eventState.resolved = true;
        state.eventState.outcomeText = `甘美菌肉回复了 ${state.player.hp - before} 点生命，但微麻孢子使你获得了诅咒【笨拙】。`;
        return { ok: true };
      }
      if (choiceId === 'refine_red_spore') {
        if (state.player.hp <= 7) {
          return { ok: false, reason: '当前生命值不足（需大于 7 点）' };
        }
        state.player.hp -= 7;
        state.player.maxHp += 5;
        state.eventState.resolved = true;
        state.eventState.outcomeText = '灼热菌核锤炼了体魄（-7 当前生命），你的最大生命值永久 +5！';
        return { ok: true };
      }
      if (choiceId === 'bypass_grotto') {
        state.eventState.resolved = true;
        state.eventState.outcomeText = '你屏住呼吸穿过了荧光菌丛。';
        return { ok: true };
      }
      return { ok: false, reason: '无效的事件选项' };
    }

    case 'library_sanctum': {
      if (choiceId === 'study_manuals') {
        state.eventState.libraryChoices = rollRewardCards(state, 3, 'normal', {
          affectPity: false,
        });
        return { ok: true, pendingLibrary: true };
      }
      if (choiceId === 'nap_in_library') {
        const before = state.player.hp;
        state.player.hp = Math.min(state.player.maxHp, state.player.hp + 20);
        state.eventState.resolved = true;
        state.eventState.outcomeText = `你在静谧书阁中沉沉睡去，醒来回复了 ${state.player.hp - before} 点生命。`;
        return { ok: true };
      }
      return { ok: false, reason: '无效的事件选项' };
    }

    default:
      return { ok: false, reason: '未知事件处理' };
  }
}

export function completeEventPurge(state, instanceId) {
  if (state.screen !== 'event' || !state.eventState?.pendingPurge) {
    return { ok: false, reason: '当前没有待执行的卡牌净化' };
  }
  if (state.player.deck.length <= 1) {
    return { ok: false, reason: '牌组至少需保留 1 张卡牌' };
  }
  const idx = state.player.deck.findIndex((c) => c.instanceId === instanceId);
  if (idx === -1) {
    return { ok: false, reason: '未在牌组中找到该卡牌' };
  }
  const [removed] = state.player.deck.splice(idx, 1);
  const removedStats = getCardStats(removed);
  state.eventState.pendingPurge = false;
  state.eventState.resolved = true;
  state.eventState.outcomeText = `古老秘力化去了【${removedStats.name}】，你的牌组更加精炼了。`;
  return { ok: true, removed };
}

export function cancelEventPurge(state) {
  if (
    state.screen !== 'event' ||
    (!state.eventState?.pendingPurge && !state.eventState?.pendingCardAction)
  ) {
    return { ok: false, reason: '当前没有待取消的操作' };
  }
  state.eventState.pendingPurge = false;
  state.eventState.pendingCardAction = null;
  return { ok: true };
}

export function completeEventCardAction(state, instanceId) {
  const mode = state?.eventState?.pendingCardAction;
  if (state.screen !== 'event' || !mode) {
    return { ok: false, reason: '当前没有待执行的事件选牌操作' };
  }
  const idx = state.player.deck.findIndex((c) => c.instanceId === instanceId);
  if (idx === -1) {
    return { ok: false, reason: '未在牌组中找到该卡牌' };
  }

  if (mode === 'upgrade') {
    const target = state.player.deck[idx];
    if (!canUpgradeCard(target)) {
      return { ok: false, reason: '该卡牌无法升级' };
    }
    target.upgraded = true;
    state.eventState.pendingCardAction = null;
    state.eventState.upgradedCardIds = [target.instanceId];
    state.eventState.resolved = true;
    state.eventState.outcomeText = `活体石墙赐予成长之力，成功升级了【${getCardStats(target).name}】！`;
    return { ok: true, card: target };
  }

  if (mode === 'transform') {
    const oldCard = state.player.deck[idx];
    const oldName = getCardStats(oldCard).name;
    const { cards } = getUnlockedPools(state);
    const pool = [...cards.common, ...cards.uncommon, ...cards.rare].filter(
      (cid) => cid !== oldCard.cardId
    );
    const nextCardId = pickRandom(state, pool.length > 0 ? pool : cards.common);
    const created = createCardInstance(state, nextCardId, false);
    state.player.deck.splice(idx, 1, created);
    state.eventState.pendingCardAction = null;
    state.eventState.addedCardIds = [created.instanceId];
    state.eventState.resolved = true;
    state.eventState.outcomeText = `石墙秘力重塑了【${oldName}】，蜕变为全新卡牌【${getCardStats(created).name}】！`;
    return { ok: true, card: created };
  }

  return { ok: false, reason: '未知的事件卡牌操作' };
}

export function pickEventLibraryCard(state, instanceId) {
  const choices = state?.eventState?.libraryChoices;
  if (state.screen !== 'event' || !Array.isArray(choices)) {
    return { ok: false, reason: '当前不在藏书阁选牌阶段' };
  }
  const chosen = choices.find((c) => c.instanceId === instanceId);
  if (!chosen) {
    return { ok: false, reason: '未找到所选书卷卡牌' };
  }
  const added = createCardInstance(state, chosen.cardId, chosen.upgraded);
  state.player.deck.push(added);
  state.eventState.libraryChoices = null;
  state.eventState.addedCardIds = [added.instanceId];
  state.eventState.resolved = true;
  state.eventState.outcomeText = `你将武学手札【${getCardStats(added).name}】收入了牌组！`;
  return { ok: true, addedCard: added };
}

export function continueFromEvent(state) {
  if (
    state.screen !== 'event' ||
    !state.eventState?.resolved ||
    state.eventState.pendingPurge ||
    state.eventState.pendingCardAction ||
    state.eventState.libraryChoices
  ) {
    return { ok: false, reason: '请先完成当前事件抉择' };
  }
  state.eventState = null;
  state.screen = 'map';
  return { ok: true };
}

// === Floor 0 Neow's Blessing ===

const NEOW_SMALL_POOL = Object.freeze([
  Object.freeze({
    id: 'max_hp_8',
    tier: 'small',
    badge: '稳健增益',
    title: '最大生命 +8',
    detail: '立即提升 8 点最大生命并同步回复 8 点生命，稳健度过前五层。',
  }),
  Object.freeze({
    id: 'gold_100',
    tier: 'small',
    badge: '稳健增益',
    title: '获得 100 金币',
    detail: '开局额外携带 100 金币，抢先在早期神秘商人处购入遗物或删牌。',
  }),
  Object.freeze({
    id: 'upgrade_1',
    tier: 'small',
    badge: '稳健增益',
    title: '锻造升级 1 张牌',
    detail: '从初始牌组中自选 1 张卡牌永久强化（如痛击+ 或 防御+）。',
  }),
  Object.freeze({
    id: 'choose_card',
    tier: 'small',
    badge: '稳健增益',
    title: '3 选 1 奖励卡牌',
    detail: '从 3 张随机铁甲战士卡牌中挑选 1 张加入牌组。',
  }),
]);

const NEOW_MEDIUM_POOL = Object.freeze([
  Object.freeze({
    id: 'common_relic',
    tier: 'medium',
    badge: '实用增益',
    title: '随机普通遗物',
    detail: '立即获得 1 件随机【普通】遗物，显著提升开局战斗下限。',
  }),
  Object.freeze({
    id: 'remove_1',
    tier: 'medium',
    badge: '实用增益',
    title: '移除 1 张卡牌',
    detail: '从牌组中自选 1 张基础牌或诅咒永久移除，加快牌组循环。',
  }),
  Object.freeze({
    id: 'transform_1',
    tier: 'medium',
    badge: '实用增益',
    title: '变化 1 张卡牌',
    detail: '从牌组中自选 1 张卡牌，将其随机变化为 1 张非基础铁甲战士卡牌。',
  }),
  Object.freeze({
    id: 'choose_rare_card',
    tier: 'medium',
    badge: '实用增益',
    title: '3 选 1 稀有卡牌',
    detail: '从 3 张金色【稀有】卡牌中挑选 1 张，直接确立开局构筑核心。',
  }),
  Object.freeze({
    id: 'fill_potions',
    tier: 'medium',
    badge: '实用增益',
    title: '填满药水腰带',
    detail: '将所有空药水栏位装满随机药水（共 3 栏），前期迎战强敌底气更足。',
  }),
]);

const NEOW_RISK_POOL = Object.freeze([
  Object.freeze({
    id: 'curse_for_gold',
    tier: 'risk',
    badge: '高风险高回报',
    title: '得 1 张随机诅咒 · 换 250 金币',
    detail: '代价：向牌组加入 1 张随机【诅咒】牌。回报：立即获得 250 金币！',
  }),
  Object.freeze({
    id: 'max_hp_for_rare_relic',
    tier: 'risk',
    badge: '高风险高回报',
    title: '最大生命 -7 · 换随机稀有遗物',
    detail: '代价：永久失去 7 点最大生命。回报：立即获得 1 件随机【稀有】遗物！',
  }),
  Object.freeze({
    id: 'hp_for_rare_card',
    tier: 'risk',
    badge: '高风险高回报',
    title: '失去 15 点生命 · 换 3 选 1 稀有牌',
    detail: '代价：立即失去 15 点当前生命。回报：从 3 张金色【稀有】卡牌中任选 1 张！',
  }),
  Object.freeze({
    id: 'gold_for_remove_2',
    tier: 'risk',
    badge: '高风险高回报',
    title: '失去全部金币 · 换移除 2 张卡牌',
    detail: '代价：失去当前全部金币。回报：从牌组中自选 2 张卡牌永久移除！',
  }),
]);

const NEOW_BOSS_SWAP_OPTION = Object.freeze({
  id: 'boss_swap',
  tier: 'boss_swap',
  badge: '换核博弈',
  title: '放弃【燃烧之血】· 换随机首领遗物',
  detail: '失去初始遗物【燃烧之血】，随机获得 1 件【首领遗物】（含金字塔、异蛇之眼、能量遗物等 7 选 1）！',
});

function rollUnownedRelicByTier(state, tier) {
  const { relics } = getUnlockedPools(state);
  const unowned = (pool) => pool.filter((id) => !hasRelic(state, id));
  const preferred = unowned(relics[tier] || []);
  if (preferred.length > 0) {
    return pickRandom(state, preferred);
  }
  const fallback = unowned(relics.allNonBoss);
  return fallback.length > 0 ? pickRandom(state, fallback) : null;
}

function rollDistinctRareCards(state, count = 3) {
  const { cards } = getUnlockedPools(state);
  const pickedIds = pickDistinct(state, cards.rare, count);
  return pickedIds.map((cardId) => createCardInstance(state, cardId, false));
}

export function generateNeowState(state) {
  const opt1 = pickRandom(state, NEOW_SMALL_POOL);
  const opt2 = pickRandom(state, NEOW_MEDIUM_POOL);
  const opt3 = pickRandom(state, NEOW_RISK_POOL);
  const opt4 = NEOW_BOSS_SWAP_OPTION;

  return {
    resolved: false,
    chosenId: null,
    outcomeText: '',
    pendingAction: null,
    options: [
      { ...opt1 },
      { ...opt2 },
      { ...opt3 },
      { ...opt4 },
    ],
  };
}

export function chooseNeowOption(state, optionId) {
  if (state.screen !== 'map' || !hasPendingNeowBlessing(state)) {
    return { ok: false, reason: '当前没有待选择的鲸鱼赐福' };
  }
  const neow = state.neowState;
  if (neow.pendingAction && neow.pendingAction.committed) {
    return { ok: false, reason: '请先完成当前赐福选牌操作' };
  }
  const option = neow.options.find((opt) => opt.id === optionId);
  if (!option) {
    return { ok: false, reason: '未找到该赐福选项' };
  }

  switch (option.id) {
    case 'max_hp_8': {
      state.player.maxHp += 8;
      state.player.hp = Math.min(state.player.maxHp, state.player.hp + 8);
      neow.resolved = true;
      neow.chosenId = option.id;
      neow.pendingAction = null;
      neow.outcomeText = `涅奥赐福生效：最大生命 +8，当前生命 ${state.player.hp} / ${state.player.maxHp}。`;
      return { ok: true, resolved: true, outcomeText: neow.outcomeText };
    }

    case 'gold_100': {
      state.player.gold += 100;
      neow.resolved = true;
      neow.chosenId = option.id;
      neow.pendingAction = null;
      neow.outcomeText = `涅奥赐福生效：获得 100 金币（当前共 ${state.player.gold} 金币）。`;
      return { ok: true, resolved: true, outcomeText: neow.outcomeText };
    }

    case 'common_relic': {
      const relicId = rollUnownedRelicByTier(state, 'common');
      if (relicId) {
        grantRelicToPlayer(state, relicId);
        const def = RELIC_LIBRARY[relicId];
        neow.outcomeText = `涅奥赐福生效：获得普通遗物【${def.name}】（${def.description}）`;
      } else {
        state.player.gold += 100;
        neow.outcomeText = '涅奥赐福生效：普通遗物已集齐，改为获得 100 金币。';
      }
      neow.resolved = true;
      neow.chosenId = option.id;
      neow.pendingAction = null;
      return { ok: true, resolved: true, outcomeText: neow.outcomeText, relicId };
    }

    case 'fill_potions': {
      const gainedNames = [];
      for (let i = 0; i < state.player.potions.length; i += 1) {
        if (!state.player.potions[i]) {
          const potId = pickRandom(state, ALL_POTION_IDS);
          state.player.potions[i] = potId;
          gainedNames.push(POTION_LIBRARY[potId]?.name || potId);
        }
      }
      neow.resolved = true;
      neow.chosenId = option.id;
      neow.pendingAction = null;
      neow.outcomeText =
        gainedNames.length > 0
          ? `涅奥赐福生效：药水腰带已补满，获得【${gainedNames.join('】、【')}】！`
          : '涅奥赐福生效：药水腰带已满。';
      return { ok: true, resolved: true, outcomeText: neow.outcomeText };
    }

    case 'curse_for_gold': {
      const curseId = pickRandom(state, CURSE_CARD_IDS);
      const curseCard = createCardInstance(state, curseId, false);
      state.player.deck.push(curseCard);
      state.player.gold += 250;
      neow.resolved = true;
      neow.chosenId = option.id;
      neow.pendingAction = null;
      neow.outcomeText = `涅奥赐福生效：承受诅咒【${getCardStats(curseCard).name}】，换得 250 金币！`;
      return { ok: true, resolved: true, outcomeText: neow.outcomeText };
    }

    case 'max_hp_for_rare_relic': {
      state.player.maxHp = Math.max(1, state.player.maxHp - 7);
      state.player.hp = Math.min(state.player.hp, state.player.maxHp);
      const relicId = rollUnownedRelicByTier(state, 'rare');
      if (relicId) {
        grantRelicToPlayer(state, relicId);
        const def = RELIC_LIBRARY[relicId];
        neow.outcomeText = `涅奥赐福生效：最大生命 -7，换得稀有遗物【${def.name}】（${def.description}）`;
      } else {
        state.player.gold += 220;
        neow.outcomeText = '涅奥赐福生效：最大生命 -7，改为获得 220 金币。';
      }
      neow.resolved = true;
      neow.chosenId = option.id;
      neow.pendingAction = null;
      return { ok: true, resolved: true, outcomeText: neow.outcomeText, relicId };
    }

    case 'boss_swap': {
      const bbIdx = state.player.relics.indexOf('burning_blood');
      if (bbIdx !== -1) {
        state.player.relics.splice(bbIdx, 1);
      }
      const eligibleSwaps = BOSS_RELIC_IDS.filter(
        (id) => id !== 'black_blood' && !hasRelic(state, id)
      );
      const swappedId = pickRandom(state, eligibleSwaps);
      if (swappedId) {
        grantRelicToPlayer(state, swappedId);
        const def = RELIC_LIBRARY[swappedId];
        neow.outcomeText = `涅奥换核成功：失去【燃烧之血】，获得首领遗物【${def.name}】（${def.description}）`;
      } else {
        neow.outcomeText = '涅奥换核完成。';
      }
      neow.resolved = true;
      neow.chosenId = option.id;
      neow.pendingAction = null;
      return { ok: true, resolved: true, outcomeText: neow.outcomeText, relicId: swappedId };
    }

    case 'choose_card': {
      const offered = rollRewardCards(state, 3, 'normal', { trackPity: false });
      neow.pendingAction = {
        type: 'pick_card',
        optionId: option.id,
        title: '鲸鱼赐福 · 3 选 1 奖励卡牌',
        subtitle: '点击任意一张卡牌加入初始牌组，或选择跳过。',
        cards: offered,
        hpLost: 0,
        allowCancel: false,
        committed: true,
      };
      return { ok: true, resolved: false, pendingModal: 'neow_action' };
    }

    case 'choose_rare_card':
    case 'hp_for_rare_card': {
      let hpLost = 0;
      if (option.id === 'hp_for_rare_card') {
        hpLost = Math.min(Math.max(0, state.player.hp - 1), 15);
        state.player.hp -= hpLost;
      }
      const offered = rollDistinctRareCards(state, 3);
      neow.pendingAction = {
        type: 'pick_card',
        optionId: option.id,
        title:
          option.id === 'hp_for_rare_card'
            ? `鲸鱼赐福 · 失去 ${hpLost} 血换 3 选 1 稀有卡牌`
            : '鲸鱼赐福 · 3 选 1 稀有卡牌',
        subtitle: '从 3 张金色稀有卡牌中挑选 1 张作为本局核心，或选择跳过。',
        cards: offered,
        hpLost,
        allowCancel: false,
        committed: true,
      };
      return { ok: true, resolved: false, pendingModal: 'neow_action' };
    }

    case 'upgrade_1': {
      if (getUpgradableDeckCards(state).length === 0) {
        return { ok: false, reason: '当前牌组没有可升级的卡牌' };
      }
      neow.pendingAction = {
        type: 'upgrade',
        optionId: option.id,
        title: '鲸鱼赐福 · 选择 1 张卡牌永久升级',
        subtitle: '底部绿色文字显示升级后效果，点击任意卡牌立即完成锻造。',
        remaining: 1,
        allowCancel: true,
        committed: false,
      };
      return { ok: true, resolved: false, pendingModal: 'neow_action' };
    }

    case 'remove_1': {
      if (state.player.deck.length <= 1) {
        return { ok: false, reason: '牌组至少保留 1 张卡牌' };
      }
      neow.pendingAction = {
        type: 'remove',
        optionId: option.id,
        title: '鲸鱼赐福 · 选择 1 张卡牌永久移除',
        subtitle: '点击任意一张卡牌将其从牌组中永久移除。',
        remaining: 1,
        payAllGold: false,
        goldPaid: false,
        lostGold: 0,
        removedNames: [],
        allowCancel: true,
        committed: false,
      };
      return { ok: true, resolved: false, pendingModal: 'neow_action' };
    }

    case 'gold_for_remove_2': {
      if (state.player.deck.length <= 1) {
        return { ok: false, reason: '牌组至少保留 1 张卡牌' };
      }
      const count = Math.min(2, state.player.deck.length - 1);
      neow.pendingAction = {
        type: 'remove',
        optionId: option.id,
        title: `鲸鱼赐福 · 失去全部金币换移除 ${count} 张卡牌`,
        subtitle: `确认移除第 1 张卡牌时将扣除当前全部 ${state.player.gold} 金币；共需选择 ${count} 张牌。`,
        remaining: count,
        payAllGold: true,
        goldPaid: false,
        lostGold: 0,
        removedNames: [],
        allowCancel: true,
        committed: false,
      };
      return { ok: true, resolved: false, pendingModal: 'neow_action' };
    }

    case 'transform_1': {
      if (state.player.deck.length === 0) {
        return { ok: false, reason: '当前牌组为空' };
      }
      neow.pendingAction = {
        type: 'transform',
        optionId: option.id,
        title: '鲸鱼赐福 · 选择 1 张卡牌进行变化',
        subtitle: '所选卡牌将随机蜕变为 1 张非基础铁甲战士卡牌。',
        remaining: 1,
        allowCancel: true,
        committed: false,
      };
      return { ok: true, resolved: false, pendingModal: 'neow_action' };
    }

    default:
      return { ok: false, reason: '未知的赐福选项' };
  }
}

export function completeNeowAction(state, instanceId) {
  if (state.screen !== 'map' || !hasPendingNeowBlessing(state)) {
    return { ok: false, reason: '当前没有待完成的赐福操作' };
  }
  const neow = state.neowState;
  const action = neow.pendingAction;
  if (!action) {
    return { ok: false, reason: '当前无需选择卡牌' };
  }

  if (action.type === 'pick_card') {
    const chosen = (action.cards || []).find((c) => c.instanceId === instanceId);
    if (!chosen) {
      return { ok: false, reason: '未找到所选赐福卡牌' };
    }
    const added = createCardInstance(state, chosen.cardId, chosen.upgraded);
    state.player.deck.push(added);
    const cardName = getCardStats(added).name;
    neow.resolved = true;
    neow.chosenId = action.optionId;
    neow.pendingAction = null;
    neow.outcomeText =
      action.hpLost > 0
        ? `涅奥赐福生效：失去 ${action.hpLost} 点生命，获得稀有卡牌【${cardName}】！`
        : `涅奥赐福生效：已将【${cardName}】收入牌组！`;
    return { ok: true, resolved: true, addedCard: added, outcomeText: neow.outcomeText };
  }

  const idx = state.player.deck.findIndex((c) => c.instanceId === instanceId);
  if (idx === -1) {
    return { ok: false, reason: '未在牌组中找到该卡牌' };
  }

  if (action.type === 'upgrade') {
    const card = state.player.deck[idx];
    if (!canUpgradeCard(card)) {
      return { ok: false, reason: '该卡牌无法升级' };
    }
    card.upgraded = true;
    const upgradedName = getCardStats(card).name;
    neow.resolved = true;
    neow.chosenId = action.optionId;
    neow.pendingAction = null;
    neow.outcomeText = `涅奥赐福生效：成功升级了【${upgradedName}】！`;
    return { ok: true, resolved: true, card, outcomeText: neow.outcomeText };
  }

  if (action.type === 'transform') {
    const oldCard = state.player.deck[idx];
    const oldName = getCardStats(oldCard).name;
    const { cards } = getUnlockedPools(state);
    const pool = [...cards.common, ...cards.uncommon, ...cards.rare].filter(
      (cid) => cid !== oldCard.cardId
    );
    const nextCardId = pickRandom(state, pool.length > 0 ? pool : cards.common);
    const created = createCardInstance(state, nextCardId, false);
    state.player.deck.splice(idx, 1, created);
    neow.resolved = true;
    neow.chosenId = action.optionId;
    neow.pendingAction = null;
    neow.outcomeText = `涅奥赐福生效：【${oldName}】变化为全新卡牌【${getCardStats(created).name}】！`;
    return { ok: true, resolved: true, card: created, outcomeText: neow.outcomeText };
  }

  if (action.type === 'remove') {
    if (state.player.deck.length <= 1) {
      return { ok: false, reason: '牌组至少保留 1 张卡牌' };
    }
    if (action.payAllGold && !action.goldPaid) {
      action.lostGold = state.player.gold;
      state.player.gold = 0;
      action.goldPaid = true;
      action.allowCancel = false;
      action.committed = true;
    }
    const [removed] = state.player.deck.splice(idx, 1);
    const removedName = getCardStats(removed).name;
    action.removedNames = [...(action.removedNames || []), removedName];
    action.remaining = Math.max(0, (action.remaining ?? 1) - 1);

    if (action.remaining > 0 && state.player.deck.length > 1) {
      action.title = `鲸鱼赐福 · 还需选择 ${action.remaining} 张卡牌移除`;
      action.subtitle = `已移除【${action.removedNames.join('】、【')}】，请继续选择剩余卡牌。`;
      return { ok: true, resolved: false, remaining: action.remaining, removed };
    }

    neow.resolved = true;
    neow.chosenId = action.optionId;
    neow.pendingAction = null;
    const namesText = `【${action.removedNames.join('】、【')}】`;
    neow.outcomeText = action.payAllGold
      ? `涅奥赐福生效：失去 ${action.lostGold} 金币，永久移除了 ${namesText}！`
      : `涅奥赐福生效：永久移除了 ${namesText}！`;
    return { ok: true, resolved: true, removed, outcomeText: neow.outcomeText };
  }

  return { ok: false, reason: '未知的赐福选牌操作' };
}

export function skipNeowCardOffer(state) {
  if (state.screen !== 'map' || !hasPendingNeowBlessing(state)) {
    return { ok: false, reason: '当前没有可跳过的赐福选牌' };
  }
  const neow = state.neowState;
  const action = neow.pendingAction;
  if (!action || action.type !== 'pick_card') {
    return { ok: false, reason: '当前赐福不支持跳过选牌' };
  }
  neow.resolved = true;
  neow.chosenId = action.optionId;
  neow.pendingAction = null;
  neow.outcomeText =
    action.hpLost > 0
      ? `涅奥赐福完成：失去 ${action.hpLost} 点生命，已跳过奖励卡牌。`
      : '涅奥赐福完成：已跳过奖励卡牌。';
  return { ok: true, resolved: true, outcomeText: neow.outcomeText };
}

export function cancelNeowAction(state) {
  if (state.screen !== 'map' || !hasPendingNeowBlessing(state)) {
    return { ok: false, reason: '当前没有可取消的赐福操作' };
  }
  const neow = state.neowState;
  if (!neow.pendingAction || !neow.pendingAction.allowCancel) {
    return { ok: false, reason: '当前赐福已生效，请完成选牌' };
  }
  neow.pendingAction = null;
  return { ok: true };
}

