import {
  canUpgradeCard,
  CARD_LIBRARY,
  createCardInstance,
  CURSE_CARD_IDS,
  getCardStats,
  getColorlessCardPools,
  getRewardCardPools,
} from '../data/cards.js';
import { getCharacterDef, normalizeCharacterId } from '../data/characters.js';
import { ENCOUNTERS, ENEMY_TEMPLATES } from '../data/enemies.js';
import {
  EVENT_IDS,
  EVENT_LIBRARY,
  generateSpireMap,
  getEventIdsForAct,
  getEventTuning,
  TOTAL_FLOORS,
} from '../data/events.js';
import {
  CAMPFIRE_RELIC_IDS,
  getAvailablePotionIds,
  getRelicPoolsForCharacter,
  POTION_LIBRARY,
  RELIC_LIBRARY,
} from '../data/relics.js';
import {
  confirmPendingCardChoice,
  confirmScryChoice,
  discardHandCard,
  endPlayerTurn,
  hasRelic,
  initiateScry,
  playCard,
  resolveCardChoice,
  restartCombat,
  startCombat,
  togglePendingCardChoice,
  toggleScryChoice,
  usePotion,
} from './combat.js';
import { getDailyChallengeSpec, hasDailyModifier } from './daily.js';
import { getLockedContentSets, MAX_ASCENSION } from './meta.js';
import { nextRandom, normalizeSeed, pickDistinct, pickRandom, randomInt } from './rng.js';

export const STARTER_POTION_SLOTS = 3;

export function getStarterPotionSlotCount(ascension = 0) {
  return (ascension ?? 0) >= 6 ? 2 : STARTER_POTION_SLOTS;
}

let nextRunNonce = 1;

function addPlayerGold(state, amount) {
  const gain = Math.floor(amount);
  if (!state?.player || !Number.isFinite(gain) || gain <= 0) return 0;
  state.player.gold += gain;
  if (state.stats) {
    state.stats.goldEarned = (state.stats.goldEarned ?? 0) + gain;
  }
  if (hasRelic(state, 'bloody_idol') && state.player.hp > 0) {
    state.player.hp = Math.min(state.player.maxHp, state.player.hp + 5);
  }
  return gain;
}

export function playerHasHeavyAttackCard(state) {
  if (!Array.isArray(state?.player?.deck)) return false;
  return state.player.deck.some((c) => {
    const st = getCardStats(c);
    return st.type === 'attack' && typeof st.damage === 'number' && st.damage >= 10;
  });
}

export function addCardToMasterDeck(state, cardInstance, { triggerRelics = true } = {}) {
  if (!state?.player || !cardInstance) return cardInstance;
  state.player.deck.push(cardInstance);
  if (!triggerRelics) return cardInstance;
  const def = CARD_LIBRARY[cardInstance.cardId];
  if (hasRelic(state, 'ceramic_fish')) {
    addPlayerGold(state, 9);
  }
  if (def?.type === 'curse' && hasRelic(state, 'darkstone_periapt')) {
    state.player.maxHp += 6;
    state.player.hp = Math.min(state.player.maxHp, state.player.hp + 6);
  }
  return cardInstance;
}

export function getCurrentPurgeCost(state) {
  if (hasRelic(state, 'smiling_mask')) {
    return 50;
  }
  const base = 75 + (state?.purgeCount ?? 0) * 25;
  const ascMult = (state?.ascension ?? 0) >= 5 ? 1.15 : 1;
  const dailyMult = hasDailyModifier(state, 'hoarder_gold') ? 1.15 : 1;
  const memberMult = hasRelic(state, 'membership_card') ? 0.5 : 1;
  return Math.max(1, Math.round(base * ascMult * dailyMult * memberMult));
}

export function getCurrentBossEncounter(state) {
  const act = state?.act ?? 1;
  const pool = act >= 3 ? ENCOUNTERS.act3Boss : act >= 2 ? ENCOUNTERS.act2Boss : ENCOUNTERS.boss;
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
  const def = RELIC_LIBRARY[relicId];
  if (def.replacesRelic) {
    const repIdx = state.player.relics.indexOf(def.replacesRelic);
    if (repIdx !== -1) {
      state.player.relics.splice(repIdx, 1, relicId);
    } else {
      state.player.relics.push(relicId);
    }
  } else {
    state.player.relics.push(relicId);
  }
  if (def.energyBonus) {
    state.player.maxEnergy += def.energyBonus;
    state.player.energy = state.player.maxEnergy;
  }
  if (def.maxHpBonus) {
    state.player.maxHp += def.maxHpBonus;
    state.player.hp = Math.min(state.player.maxHp, state.player.hp + def.maxHpBonus);
  }
  if (def.healFullOnPickup) {
    state.player.hp = state.player.maxHp;
  }
  if (def.upgradeOnPickup && Array.isArray(state.player.deck)) {
    const matching = state.player.deck.filter(
      (c) => canUpgradeCard(c) && getCardStats(c).type === def.upgradeOnPickup.type
    );
    const chosen = pickDistinct(state, matching, def.upgradeOnPickup.count ?? 2);
    for (const c of chosen) {
      c.upgraded = true;
    }
  }
  if (relicId === 'smiling_mask' && state.shop && !state.shop.purgeUsed) {
    state.shop.purgeCost = getCurrentPurgeCost(state);
  }
  if (relicId === 'black_star') {
    addPlayerGold(state, 75);
  }
  return true;
}

export function createNewRun(options = {}) {
  const dailySpec = options.dailyChallenge
    ? getDailyChallengeSpec(options.dailyChallenge.dateKey || options.dailyDateKey)
    : options.dailyDateKey
      ? getDailyChallengeSpec(options.dailyDateKey)
      : null;

  const seed = dailySpec ? dailySpec.seed : normalizeSeed(options.seed);
  const characterId = normalizeCharacterId(dailySpec ? dailySpec.characterId : options.characterId);
  const charDef = getCharacterDef(characterId);
  const ascension = dailySpec
    ? Math.max(0, Math.min(MAX_ASCENSION, Math.floor(dailySpec.ascension ?? 0)))
    : Math.max(0, Math.min(MAX_ASCENSION, Math.floor(options.ascension ?? 0)));
  const unlockedTier = dailySpec ? 3 : options.unlockedTier ?? 3;
  const unlockAllOverride = dailySpec ? true : Boolean(options.unlockAllOverride);
  const startingMaxHp = ascension >= 4 ? charDef.asc4MaxHp : charDef.maxHp;
  const startingHp =
    ascension >= 6
      ? Math.max(1, startingMaxHp - Math.floor(startingMaxHp * 0.1))
      : startingMaxHp;
  const potionSlotCount = getStarterPotionSlotCount(ascension);

  nextRunNonce += 1;
  const runId = `run_${Date.now().toString(36)}_${nextRunNonce}_${(seed >>> 0).toString(36)}`;

  const state = {
    runId,
    seed,
    rngState: seed,
    nextUid: 1,
    characterId: charDef.id,
    act: 1,
    ascension,
    unlockedTier,
    unlockAllOverride,
    isChallengeRun: dailySpec ? true : Boolean(options.isChallengeRun),
    dailyChallenge: dailySpec
      ? {
          dateKey: dailySpec.dateKey,
          seedCode: dailySpec.seedCode,
          characterId: dailySpec.characterId,
          ascension: dailySpec.ascension,
          noNeow: true,
          modifierIds: [...dailySpec.modifierIds],
        }
      : null,
    purgeCount: 0,
    rarePityBonus: 0,
    bossEncounterId: null,
    act3BossRushStage: 1,
    act3FirstBossId: null,
    screen: 'map',
    runOutcome: null,
    floor: 0,
    currentNodeId: null,
    visitedEdges: [],
    lastEncounterId: null,
    lastEliteId: null,
    recentEncounterIds: [],
    recentEliteIds: [],
    visitedEventIds: [],
    neowState: null,
    relicCounters: { happy_flower: 0, incense_burner: 0, girya: 0 },
    eventCombatReward: null,
    player: {
      name: charDef.name,
      artKey: charDef.artKey,
      hp: startingHp,
      maxHp: startingMaxHp,
      gold: charDef.startingGold ?? 99,
      maxEnergy: charDef.maxEnergy ?? 3,
      energy: charDef.maxEnergy ?? 3,
      block: 0,
      stance: 'neutral',
      relics: [charDef.starterRelic],
      potions: [
        charDef.starterPotion,
        ...Array(Math.max(0, potionSlotCount - 1)).fill(null),
      ],
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
      perfectCombats: 0,
      elitesSlain: 0,
      bossesSlain: 0,
      enemiesSlain: 0,
      cardsPlayed: 0,
      totalDamageDealt: 0,
      totalBlockGained: 0,
      totalDamageTaken: 0,
      highestSingleHit: 0,
      goldEarned: 0,
      colorlessBought: 0,
      combatRestarts: 0,
      defeatedBy: '',
      startedAt: Date.now(),
    },
  };

  state.player.deck = charDef.starterDeck.map((cardId) =>
    createCardInstance(state, cardId, false)
  );
  if (ascension >= 5) {
    state.player.deck.push(createCardInstance(state, 'clumsy', false));
  }

  state.map = generateSpireMap(state);
  state.bossEncounterId = pickRandom(state, ENCOUNTERS.boss).id;
  state.neowState = options.skipNeow || dailySpec ? null : generateNeowState(state);

  if (state.dailyChallenge) {
    applyDailyStartModifiers(state);
  }

  return state;
}

function applyDailyStartModifiers(state) {
  if (hasDailyModifier(state, 'hoarder_gold')) {
    addPlayerGold(state, 150);
  }
  if (hasDailyModifier(state, 'all_star')) {
    const colorless = getColorlessCardPools();
    const uncId = pickRandom(state, colorless.uncommon);
    const rareId = pickRandom(state, colorless.rare);
    if (uncId) state.player.deck.push(createCardInstance(state, uncId, false));
    if (rareId) state.player.deck.push(createCardInstance(state, rareId, false));
  }
  if (hasDailyModifier(state, 'shiny')) {
    const { cards } = getUnlockedPools(state);
    const rares = pickDistinct(state, cards.rare, 2);
    for (const cid of rares) {
      state.player.deck.push(createCardInstance(state, cid, false));
    }
  }
  if (hasDailyModifier(state, 'heirloom')) {
    const relicId = rollUnownedRelicByTier(state, 'rare');
    if (relicId) {
      grantRelicToPlayer(state, relicId);
    }
  }
  if (hasDailyModifier(state, 'specialized')) {
    const upgradable = getUpgradableDeckCards(state);
    const chosen = pickDistinct(state, upgradable, 4);
    for (const c of chosen) {
      c.upgraded = true;
    }
  }
  if (hasDailyModifier(state, 'cursed_run')) {
    const curseId = pickRandom(state, CURSE_CARD_IDS);
    if (curseId) {
      state.player.deck.push(createCardInstance(state, curseId, false));
    }
  }
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
  const characterId = normalizeCharacterId(state?.characterId);
  const { lockedCardIds, lockedRelicIds } = getLockedContentSets(
    state?.unlockedTier ?? 3,
    Boolean(state?.unlockAllOverride)
  );
  const charCards = getRewardCardPools(characterId);
  const charRelics = getRelicPoolsForCharacter(characterId);
  const filterCards = (ids) => {
    const unlocked = ids.filter((id) => !lockedCardIds.has(id));
    return unlocked.length > 0 ? unlocked : ids;
  };
  const filterRelics = (ids) => ids.filter((id) => !lockedRelicIds.has(id));
  return {
    cards: {
      common: filterCards(charCards.common),
      uncommon: filterCards(charCards.uncommon),
      rare: filterCards(charCards.rare),
    },
    relics: {
      common: filterRelics(charRelics.common),
      uncommon: filterRelics(charRelics.uncommon),
      rare: filterRelics(charRelics.rare),
      shop: filterRelics(charRelics.shop || []),
      event: filterRelics(charRelics.event || []),
      boss: charRelics.boss,
      allStandard: (charRelics.allStandard || charRelics.allNonBoss).filter(
        (id) => !lockedRelicIds.has(id)
      ),
      allNonBoss: charRelics.allNonBoss.filter((id) => !lockedRelicIds.has(id)),
    },
    potions: getAvailablePotionIds(characterId),
  };
}

function getEliteTierOddsForAct(act = 1) {
  if (act >= 3) {
    return { rare: 0.3, uncommon: 0.45, common: 0.25 };
  }
  if (act >= 2) {
    return { rare: 0.22, uncommon: 0.4, common: 0.38 };
  }
  return { rare: 0.17, uncommon: 0.33, common: 0.5 };
}

function rollChestProfile(state) {
  const r = nextRandom(state);
  if (r < 0.5) {
    return {
      tier: 'small',
      label: '小宝箱',
      odds: { rare: 0, uncommon: 0.25, common: 0.75 },
      goldRange: [24, 38],
      goldChance: 0.5,
    };
  }
  if (r < 0.83) {
    return {
      tier: 'medium',
      label: '中宝箱',
      odds: { rare: 0.15, uncommon: 0.5, common: 0.35 },
      goldRange: [40, 65],
      goldChance: 0.65,
    };
  }
  return {
    tier: 'large',
    label: '大宝箱',
    odds: { rare: 0.25, uncommon: 0.75, common: 0 },
    goldRange: [68, 95],
    goldChance: 0.85,
  };
}

function rollUnownedRelicId(state, source = 'elite', tierOddsOverride = null) {
  const { relics } = getUnlockedPools(state);
  const ownedCampfireCount = CAMPFIRE_RELIC_IDS.filter((id) => hasRelic(state, id)).length;
  const unowned = (pool) =>
    Array.isArray(pool)
      ? pool.filter(
          (id) =>
            !hasRelic(state, id) &&
            !(ownedCampfireCount >= 2 && CAMPFIRE_RELIC_IDS.includes(id))
        )
      : [];

  if (source === 'shop_exclusive') {
    const shopPool = unowned(relics.shop);
    return shopPool.length > 0 ? pickRandom(state, shopPool) : null;
  }

  const standardFallback = unowned(relics.allStandard);
  if (standardFallback.length === 0) return null;

  let odds = tierOddsOverride;
  if (!odds) {
    if (source === 'elite') {
      odds = getEliteTierOddsForAct(state?.act ?? 1);
    } else if (source === 'treasure' || source === 'shop') {
      odds = { rare: 0.16, uncommon: 0.36, common: 0.48 };
    } else {
      odds = { rare: 0.12, uncommon: 0.34, common: 0.54 };
    }
  }

  const r = nextRandom(state);
  const rareCut = odds.rare ?? 0;
  const uncommonCut = rareCut + (odds.uncommon ?? 0);
  let tierPool;
  if (r < rareCut) tierPool = unowned(relics.rare);
  else if (r < uncommonCut) tierPool = unowned(relics.uncommon);
  else tierPool = unowned(relics.common);

  if (tierPool.length === 0) {
    const orderedFallbacks =
      r < rareCut
        ? [unowned(relics.uncommon), unowned(relics.common)]
        : r < uncommonCut
          ? [unowned(relics.common), unowned(relics.rare)]
          : [unowned(relics.uncommon), unowned(relics.rare)];
    for (const candidatePool of orderedFallbacks) {
      if (candidatePool.length > 0) {
        tierPool = candidatePool;
        break;
      }
    }
  }

  return pickRandom(state, tierPool.length > 0 ? tierPool : standardFallback);
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

  const baseUpgradeChance =
    (state.act ?? 1) >= 3
      ? 0.5
      : (state.act ?? 1) >= 2
        ? 0.35
        : state.floor >= 11
          ? 0.22
          : state.floor >= 5
            ? 0.12
            : 0;
  const upgradeChance =
    (state.ascension ?? 0) >= 7 ? baseUpgradeChance * 0.5 : baseUpgradeChance;

  return chosenCardIds.map((cardId) => {
    const upgraded = upgradeChance > 0 && nextRandom(state) < upgradeChance;
    return createCardInstance(state, cardId, upgraded);
  });
}

function getShopDiscountMult(state) {
  return hasRelic(state, 'membership_card') ? 0.5 : 1;
}

export function applyShopMembershipDiscount(state) {
  const shop = state?.shop;
  if (!shop) return;
  const discount = getShopDiscountMult(state);
  for (const offer of [...(shop.cards || []), ...(shop.colorlessCards || [])]) {
    if (offer && !offer.sold) {
      const rawBase = offer.basePrice ?? offer.price;
      offer.basePrice = rawBase;
      const salePrice = offer.onSale ? Math.floor(rawBase * 0.65) : rawBase;
      offer.price = Math.max(1, Math.round(salePrice * discount));
    }
  }
  for (const ro of [shop.relicOffer, shop.shopRelicOffer]) {
    if (ro && !ro.sold) {
      const rawBase = ro.basePrice ?? ro.price;
      ro.basePrice = rawBase;
      ro.price = Math.max(1, Math.round(rawBase * discount));
    }
  }
  if (shop.potionOffer && !shop.potionOffer.sold) {
    const rawBase = shop.potionOffer.basePrice ?? shop.potionOffer.price;
    shop.potionOffer.basePrice = rawBase;
    shop.potionOffer.price = Math.max(1, Math.round(rawBase * discount));
  }
  if (!shop.purgeUsed) {
    shop.purgeCost = getCurrentPurgeCost(state);
  }
}

function buildShopState(state) {
  const { cards: unlockedCards, potions } = getUnlockedPools(state);
  const priceMult =
    ((state.ascension ?? 0) >= 5 ? 1.15 : 1) *
    (hasDailyModifier(state, 'hoarder_gold') ? 1.15 : 1);
  const discount = getShopDiscountMult(state);

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
    const preDiscount = onSale ? Math.floor(basePrice * 0.65) : basePrice;
    return {
      card: instance,
      basePrice,
      price: Math.max(1, Math.round(preDiscount * discount)),
      onSale,
      sold: false,
    };
  });

  const relicId = rollUnownedRelicId(state, 'shop');
  const relicOfferBase = relicId
    ? Math.round((RELIC_LIBRARY[relicId].price + randomInt(state, -8, 8)) * priceMult)
    : 0;
  const relicOffer = relicId
    ? {
        relicId,
        basePrice: relicOfferBase,
        price: Math.max(1, Math.round(relicOfferBase * discount)),
        sold: false,
      }
    : null;

  const shopRelicId = rollUnownedRelicId(state, 'shop_exclusive');
  const shopRelicBase = shopRelicId
    ? Math.round((RELIC_LIBRARY[shopRelicId].price + randomInt(state, -6, 6)) * priceMult)
    : 0;
  const shopRelicOffer = shopRelicId
    ? {
        relicId: shopRelicId,
        basePrice: shopRelicBase,
        price: Math.max(1, Math.round(shopRelicBase * discount)),
        sold: false,
      }
    : null;

  const potionId = pickRandom(state, potions);
  const potionBase = potionId ? Math.round(POTION_LIBRARY[potionId].price * priceMult) : 0;
  const potionOffer = potionId
    ? {
        potionId,
        basePrice: potionBase,
        price: Math.max(1, Math.round(potionBase * discount)),
        sold: false,
      }
    : null;

  // Shop-exclusive Colorless shelf: 1 Uncommon Colorless + 1 Rare Colorless
  const colorlessPools = getColorlessCardPools();
  const colorlessUncommon = pickDistinct(state, colorlessPools.uncommon, 1);
  const colorlessRare = pickDistinct(state, colorlessPools.rare, 1);
  const colorlessIds = [...colorlessUncommon, ...colorlessRare];
  const colorlessCards = colorlessIds.map((cardId) => {
    const instance = createCardInstance(state, cardId, false);
    const stats = getCardStats(instance);
    const jitter = randomInt(state, -6, 8);
    const basePrice = Math.round(Math.max(60, stats.price + jitter) * priceMult);
    return {
      card: instance,
      basePrice,
      price: Math.max(1, Math.round(basePrice * discount)),
      onSale: false,
      sold: false,
    };
  });

  return {
    cards,
    colorlessCards,
    relicOffer,
    shopRelicOffer,
    potionOffer,
    purgeCost: getCurrentPurgeCost(state),
    purgeUsed: false,
  };
}

export function transitionCombatVictory(state) {
  const role = state.combat?.role ?? 'normal';
  const asc = state.ascension ?? 0;
  const { relics, potions } = getUnlockedPools(state);
  const goldMult =
    (hasDailyModifier(state, 'midas') ? 1.65 : 1) *
    (hasRelic(state, 'golden_idol_relic') ? 1.25 : 1);

  if (role === 'boss') {
    if ((state.act ?? 1) >= 3) {
      if (asc >= 10 && (state.act3BossRushStage ?? 1) < 2) {
        state.act3FirstBossId = state.bossEncounterId;
        state.act3BossRushStage = 2;
        const remainingAct3Bosses = ENCOUNTERS.act3Boss.filter(
          (e) => e.id !== state.bossEncounterId
        );
        const secondBoss = pickRandom(
          state,
          remainingAct3Bosses.length > 0 ? remainingAct3Bosses : ENCOUNTERS.act3Boss
        );
        state.bossEncounterId = secondBoss.id;
        state.lastEncounterId = secondBoss.id;
        const cleanSecondName = secondBoss.name.replace(/^第三幕首领：/, '');
        const secondEncounter = {
          ...secondBoss,
          name: `${secondBoss.name}（终末双王 · 第 2/2 战）`,
        };
        startCombat(state, secondEncounter, 'boss', transitionCombatVictory);
        if (state.combat?.logs) {
          state.combat.logs.push({
            turn: 1,
            type: 'warning',
            message: `【进阶 10 · 终末双王】首位首领已陨落！第 2 位第 3 幕首领【${cleanSecondName}】无休整降临！`,
          });
        }
        return;
      }
      state.screen = 'game_over';
      state.runOutcome = 'victory';
      return;
    }

    const actCleared = state.act ?? 1;
    const bossGoldMult = goldMult * (asc >= 7 ? 0.75 : 1);
    const bossGold = Math.round(
      (actCleared >= 2 ? randomInt(state, 125, 150) : randomInt(state, 92, 115)) * bossGoldMult
    );
    addPlayerGold(state, bossGold);
    const cardChoices = rollDistinctRareCards(state, 3);
    state.rarePityBonus = 0;
    const unownedBossRelics = relics.boss.filter((id) => {
      if (hasRelic(state, id)) return false;
      const req = RELIC_LIBRARY[id]?.requiresRelic;
      if (req && !hasRelic(state, req)) return false;
      return true;
    });
    const relicChoices = pickDistinct(state, unownedBossRelics, 3);
    state.bossReward = {
      actCleared,
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

  const eventRewardSpec = state.eventCombatReward || null;
  state.eventCombatReward = null;

  const isElite = role === 'elite';
  const effectiveFloor = ((state.act ?? 1) - 1) * TOTAL_FLOORS + Math.max(1, state.floor || 1);
  const baseGold = eventRewardSpec?.gold
    ? eventRewardSpec.gold
    : isElite
      ? randomInt(state, 38, 50) + Math.floor(effectiveFloor * 2.2) + (hasDailyModifier(state, 'big_game_hunter') ? 35 : 0)
      : randomInt(state, 18, 26) + Math.floor(effectiveFloor * 1.5);
  const combatGoldMult = goldMult * (!eventRewardSpec?.gold && asc >= 7 ? 0.85 : 1);
  const gold = Math.round(baseGold * combatGoldMult);

  let relicId = null;
  let extraRelicId = null;
  if (eventRewardSpec?.relicId) {
    relicId = !hasRelic(state, eventRewardSpec.relicId) ? eventRewardSpec.relicId : null;
  } else if (eventRewardSpec?.relicTier === 'rare') {
    relicId = rollUnownedRelicId(state, 'event_reward', { rare: 1, uncommon: 0, common: 0 });
  } else if (isElite) {
    relicId = rollUnownedRelicId(state, 'elite');
    if (relicId && hasRelic(state, 'black_star')) {
      const candidates = getUnlockedPools(state).relics.allStandard.filter(
        (id) => !hasRelic(state, id) && id !== relicId
      );
      if (candidates.length > 0) {
        extraRelicId = pickRandom(state, candidates);
      }
    }
  }

  const dropPotion =
    hasRelic(state, 'white_beast_statue') || nextRandom(state) < (isElite ? 0.65 : 0.42);
  const potionId = dropPotion ? pickRandom(state, potions) : null;
  const cardChoices = rollRewardCards(state, 3, role);

  state.reward = {
    role,
    gold,
    goldClaimed: false,
    relicId,
    relicClaimed: !relicId,
    extraRelicId,
    extraRelicClaimed: !extraRelicId,
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

  const act = state.act ?? 1;

  switch (node.type) {
    case 'combat': {
      const pool =
        act >= 3
          ? node.floor <= 5
            ? ENCOUNTERS.act3Early
            : ENCOUNTERS.act3Hard
          : act >= 2
            ? node.floor <= 5
              ? ENCOUNTERS.act2Early
              : ENCOUNTERS.act2Hard
            : node.floor <= 2
              ? ENCOUNTERS.floor1
              : node.floor <= 6
                ? ENCOUNTERS.normal
                : ENCOUNTERS.hardNormal;
      if (!Array.isArray(state.recentEncounterIds)) {
        state.recentEncounterIds = state.lastEncounterId ? [state.lastEncounterId] : [];
      }
      const recent2 = state.recentEncounterIds.slice(-2);
      let candidates = pool.filter((e) => !recent2.includes(e.id));
      if (candidates.length === 0) {
        candidates = pool.filter((e) => e.id !== state.lastEncounterId);
      }
      const encounter = pickRandom(state, candidates.length > 0 ? candidates : pool);
      state.lastEncounterId = encounter.id;
      state.recentEncounterIds.push(encounter.id);
      if (state.recentEncounterIds.length > 4) {
        state.recentEncounterIds = state.recentEncounterIds.slice(-4);
      }
      startCombat(state, encounter, 'normal', transitionCombatVictory);
      return { ok: true, screen: state.screen };
    }
    case 'elite': {
      const elitePool =
        act >= 3 ? ENCOUNTERS.act3Elite : act >= 2 ? ENCOUNTERS.act2Elite : ENCOUNTERS.elite;
      if (!Array.isArray(state.recentEliteIds)) {
        state.recentEliteIds = state.lastEliteId ? [state.lastEliteId] : [];
      }
      const recent2Elites = state.recentEliteIds.slice(-2);
      let eliteCandidates = elitePool.filter((e) => !recent2Elites.includes(e.id));
      if (eliteCandidates.length === 0) {
        eliteCandidates = elitePool.filter((e) => e.id !== state.lastEliteId);
      }
      const encounter = pickRandom(state, eliteCandidates.length > 0 ? eliteCandidates : elitePool);
      state.lastEliteId = encounter.id;
      state.recentEliteIds.push(encounter.id);
      if (state.recentEliteIds.length > 4) {
        state.recentEliteIds = state.recentEliteIds.slice(-4);
      }
      state.lastEncounterId = encounter.id;
      startCombat(state, encounter, 'elite', transitionCombatVictory);
      return { ok: true, screen: state.screen };
    }
    case 'boss': {
      const baseEncounter = getCurrentBossEncounter(state);
      const isA10Act3Twin = (state.act ?? 1) >= 3 && (state.ascension ?? 0) >= 10;
      if (isA10Act3Twin) {
        state.act3BossRushStage = 1;
        state.act3FirstBossId = null;
      }
      const encounter = isA10Act3Twin
        ? { ...baseEncounter, name: `${baseEncounter.name}（终末双王 · 第 1/2 战）` }
        : baseEncounter;
      state.lastEncounterId = encounter.id;
      startCombat(state, encounter, 'boss', transitionCombatVictory);
      return { ok: true, screen: state.screen };
    }
    case 'treasure': {
      const chestProfile = rollChestProfile(state);
      state.treasureState = {
        opened: false,
        chestTier: chestProfile.tier,
        chestLabel: chestProfile.label,
        chestOdds: chestProfile.odds,
        chestGoldRange: chestProfile.goldRange,
        chestGoldChance: chestProfile.goldChance,
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
      let mealTicketHealed = 0;
      if (hasRelic(state, 'meal_ticket') && state.player.hp > 0) {
        const before = state.player.hp;
        state.player.hp = Math.min(state.player.maxHp, state.player.hp + 15);
        mealTicketHealed = state.player.hp - before;
      }
      state.shop = buildShopState(state);
      state.shop.mealTicketHealed = mealTicketHealed;
      state.screen = 'shop';
      return { ok: true, screen: state.screen };
    }
    case 'event': {
      const eligibleEvents = getEventIdsForAct(act);
      const unseen = eligibleEvents.filter((id) => !state.visitedEventIds.includes(id));
      const eventId = pickRandom(state, unseen.length > 0 ? unseen : eligibleEvents);
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

export function runDiscardHandCard(state, instanceId) {
  return discardHandCard(state, instanceId, transitionCombatVictory);
}

export function runResolveCardChoice(state, instanceId) {
  return resolveCardChoice(state, instanceId, transitionCombatVictory);
}

export function runTogglePendingCardChoice(state, instanceId) {
  return togglePendingCardChoice(state, instanceId);
}

export function runConfirmPendingCardChoice(state, explicitIds = null) {
  return confirmPendingCardChoice(state, explicitIds, transitionCombatVictory);
}

export function runInitiateScry(state, amount, sourceName = '预见') {
  return initiateScry(state, amount, sourceName);
}

export function runToggleScryCard(state, instanceId) {
  return toggleScryChoice(state, instanceId);
}

export function runConfirmScry(state, explicitDiscardIds = null) {
  return confirmScryChoice(state, explicitDiscardIds, transitionCombatVictory);
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
  const ts = state.treasureState;
  const fallbackProfile = ts.chestOdds ? null : rollChestProfile(state);
  const chestTier = ts.chestTier || fallbackProfile.tier;
  const chestLabel = ts.chestLabel || fallbackProfile.label;
  const odds = ts.chestOdds || fallbackProfile.odds;
  const goldRange = ts.chestGoldRange || fallbackProfile.goldRange;
  const goldChance = ts.chestGoldChance ?? fallbackProfile.goldChance;

  const relicId = rollUnownedRelicId(state, 'treasure', odds);
  const gold = relicId
    ? nextRandom(state) < goldChance
      ? randomInt(state, goldRange[0], goldRange[1])
      : 0
    : 85;

  if (relicId) {
    grantRelicToPlayer(state, relicId);
  }
  if (gold > 0) {
    addPlayerGold(state, gold);
  }

  let curseCard = null;
  if (hasRelic(state, 'cursed_key')) {
    const curseId = pickRandom(state, CURSE_CARD_IDS);
    curseCard = createCardInstance(state, curseId, false);
    addCardToMasterDeck(state, curseCard);
  }

  const parts = [];
  if (relicId) parts.push(`获得遗物【${RELIC_LIBRARY[relicId].name}】`);
  if (gold > 0) parts.push(`获得 ${gold} 金币`);
  if (curseCard) {
    parts.push(`受【诅咒钥匙】影响，牌组加入了诅咒【${getCardStats(curseCard).name}】`);
  }

  ts.opened = true;
  ts.chestTier = chestTier;
  ts.chestLabel = chestLabel;
  ts.relicId = relicId;
  ts.gold = gold;
  ts.curseCardId = curseCard?.instanceId ?? null;
  ts.outcomeText = `${chestLabel}开启：${parts.join('，')}！`;

  return { ok: true, chestTier, chestLabel, relicId, gold, curseCard };
}

export function leaveTreasureRoom(state) {
  if (state.screen !== 'treasure') {
    return { ok: false, reason: '当前不在宝箱界面' };
  }
  state.treasureState = null;
  state.screen = 'map';
  return { ok: true };
}

// === Boss Relic Altar & Act Progression ===

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
  addCardToMasterDeck(state, added);
  state.bossReward.cardClaimed = true;
  state.bossReward.pickedCardId = chosen.instanceId;
  return { ok: true, addedCard: added };
}

export function proceedToNextAct(state) {
  if (state.screen !== 'boss_reward' || !state.bossReward) {
    return { ok: false, reason: '当前不在首领遗物祭坛界面' };
  }
  const nextAct = Math.min(3, (state.act ?? 1) + 1);
  const missingHp = Math.max(0, state.player.maxHp - state.player.hp);
  const healRatio = (state.ascension ?? 0) >= 4 ? 0.65 : 0.75;
  state.player.hp = Math.min(state.player.maxHp, state.player.hp + Math.round(missingHp * healRatio));

  state.act = nextAct;
  state.floor = 0;
  state.currentNodeId = null;
  state.visitedEdges = [];
  state.lastEncounterId = null;
  state.lastEliteId = null;
  state.recentEncounterIds = [];
  state.recentEliteIds = [];
  state.bossReward = null;
  state.combat = null;
  state.map = generateSpireMap(state);
  const bossPool = nextAct >= 3 ? ENCOUNTERS.act3Boss : ENCOUNTERS.act2Boss;
  state.bossEncounterId = pickRandom(state, bossPool).id;
  state.act3BossRushStage = 1;
  state.act3FirstBossId = null;
  state.screen = 'map';
  return { ok: true, act: nextAct };
}

export function settleVictory(state) {
  if (state.screen !== 'boss_reward' || !state.bossReward) {
    return { ok: false, reason: '当前不在首领遗物祭坛界面' };
  }
  if ((state.ascension ?? 0) >= 10 && (state.act ?? 1) < 3) {
    return { ok: false, reason: '进阶 10【终末双王】须通关第 3 幕并击败双首领方可凯旋！' };
  }
  state.bossReward = null;
  state.combat = null;
  state.screen = 'game_over';
  state.runOutcome = 'victory';
  return { ok: true };
}

export const settleAct1Victory = settleVictory;

// === Reward Actions ===

export function claimRewardGold(state) {
  if (state.screen !== 'reward' || !state.reward) {
    return { ok: false, reason: '当前不在战利品界面' };
  }
  if (state.reward.goldClaimed) {
    return { ok: false, reason: '金币已领取' };
  }
  addPlayerGold(state, state.reward.gold);
  state.reward.goldClaimed = true;
  return { ok: true };
}

export function claimRewardRelic(state) {
  if (state.screen !== 'reward' || !state.reward) {
    return { ok: false, reason: '当前不在战利品界面' };
  }
  if (!state.reward.relicClaimed && state.reward.relicId) {
    grantRelicToPlayer(state, state.reward.relicId);
    state.reward.relicClaimed = true;
    return { ok: true };
  }
  if (!state.reward.extraRelicClaimed && state.reward.extraRelicId) {
    grantRelicToPlayer(state, state.reward.extraRelicId);
    state.reward.extraRelicClaimed = true;
    return { ok: true };
  }
  return { ok: false, reason: '没有可领取的遗物' };
}

export function claimRewardExtraRelic(state) {
  if (state.screen !== 'reward' || !state.reward) {
    return { ok: false, reason: '当前不在战利品界面' };
  }
  if (state.reward.extraRelicClaimed || !state.reward.extraRelicId) {
    return { ok: false, reason: '没有可领取的额外遗物' };
  }
  grantRelicToPlayer(state, state.reward.extraRelicId);
  state.reward.extraRelicClaimed = true;
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
  addCardToMasterDeck(state, added);
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
  const hasRelic =
    (Boolean(rw.relicId) && !rw.relicClaimed) ||
    (Boolean(rw.extraRelicId) && !rw.extraRelicClaimed);
  if (hasGold) {
    items.push(`【${rw.gold} 金币】`);
  }
  if (Boolean(rw.relicId) && !rw.relicClaimed) {
    const relicName = RELIC_LIBRARY[rw.relicId]?.name ?? rw.relicId;
    items.push(`遗物【${relicName}】`);
  }
  if (Boolean(rw.extraRelicId) && !rw.extraRelicClaimed) {
    const extraName = RELIC_LIBRARY[rw.extraRelicId]?.name ?? rw.extraRelicId;
    items.push(`黑星遗物【${extraName}】`);
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
  let singingBowlGain = 0;
  if (
    state.reward &&
    !state.reward.cardClaimed &&
    Array.isArray(state.reward.cardChoices) &&
    state.reward.cardChoices.length > 0 &&
    hasRelic(state, 'singing_bowl')
  ) {
    state.player.maxHp += 2;
    state.player.hp = Math.min(state.player.maxHp, state.player.hp + 2);
    singingBowlGain = 2;
  }
  state.reward = null;
  state.combat = null;
  state.screen = 'map';
  return { ok: true, singingBowlGain };
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
  const healPct = 0.3;
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
  if (hasDailyModifier(state, 'midas')) {
    return { ok: false, reason: '受每日词条【点金之手】限制，本局无法在篝火营地进行铁砧锻造' };
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

function applyCardRemovalSideEffects(state, removedCard) {
  if (!removedCard || !state?.player) return { lostMaxHp: 0 };
  const stats = getCardStats(removedCard);
  if ((stats.onRemoveLoseMaxHp ?? 0) > 0) {
    const loss = stats.onRemoveLoseMaxHp;
    state.player.maxHp = Math.max(1, state.player.maxHp - loss);
    state.player.hp = Math.min(state.player.hp, state.player.maxHp);
    return { lostMaxHp: loss };
  }
  return { lostMaxHp: 0 };
}

export function liftAtCampfire(state) {
  if (state.screen !== 'rest' || !state.restState || state.restState.completed) {
    return { ok: false, reason: '当前不能在营地举重' };
  }
  if (!hasRelic(state, 'girya')) {
    return { ok: false, reason: '需要持有遗物【壶铃】才能在营地举重' };
  }
  if (!state.relicCounters) state.relicCounters = {};
  const current = state.relicCounters.girya ?? 0;
  if (current >= 3) {
    return { ok: false, reason: '【壶铃】已达最大举重次数（3/3）' };
  }
  state.relicCounters.girya = current + 1;
  state.restState.completed = true;
  state.restState.lastAction = `举重锻炼（初始力量 +1，当前 ${state.relicCounters.girya}/3）`;
  state.screen = 'map';
  return { ok: true, lifts: state.relicCounters.girya };
}

export function digAtCampfire(state) {
  if (state.screen !== 'rest' || !state.restState || state.restState.completed) {
    return { ok: false, reason: '当前不能在营地挖掘' };
  }
  if (!hasRelic(state, 'shovel')) {
    return { ok: false, reason: '需要持有遗物【铲子】才能在营地挖掘' };
  }
  const relicId = rollUnownedRelicId(state, 'treasure');
  if (!relicId) {
    return { ok: false, reason: '已收集全部可发掘遗物，暂无更多遗物可挖' };
  }
  grantRelicToPlayer(state, relicId);
  const relicName = RELIC_LIBRARY[relicId]?.name || relicId;
  state.restState.completed = true;
  state.restState.lastAction = `挖掘发现了遗物【${relicName}】`;
  state.screen = 'map';
  return { ok: true, relicId, relicName };
}

export function tokeAtCampfire(state, instanceId) {
  if (state.screen !== 'rest' || !state.restState || state.restState.completed) {
    return { ok: false, reason: '当前不能在营地吞云移除卡牌' };
  }
  if (!hasRelic(state, 'peace_pipe')) {
    return { ok: false, reason: '需要持有遗物【和平烟斗】才能在营地移除卡牌' };
  }
  if (state.player.deck.length <= 1) {
    return { ok: false, reason: '牌组至少需要保留 1 张卡牌' };
  }
  const idx = state.player.deck.findIndex((c) => c.instanceId === instanceId);
  if (idx === -1) {
    return { ok: false, reason: '未在牌组中找到该卡牌' };
  }
  const [removed] = state.player.deck.splice(idx, 1);
  const side = applyCardRemovalSideEffects(state, removed);
  state.restState.completed = true;
  state.restState.lastAction = `吞云移除了【${getCardStats(removed).name}】`;
  state.screen = 'map';
  return { ok: true, removed, lostMaxHp: side.lostMaxHp };
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
  addCardToMasterDeck(state, added);
  return { ok: true, addedCard: added };
}

export function buyShopColorlessCard(state, offerIndex) {
  if (state.screen !== 'shop' || !state.shop || !Array.isArray(state.shop.colorlessCards)) {
    return { ok: false, reason: '当前不在商店界面' };
  }
  const offer = state.shop.colorlessCards[offerIndex];
  if (!offer || offer.sold) {
    return { ok: false, reason: '该无色卡牌已售出或不存在' };
  }
  if (state.player.gold < offer.price) {
    return { ok: false, reason: '金币不足' };
  }
  state.player.gold -= offer.price;
  offer.sold = true;
  const added = createCardInstance(state, offer.card.cardId, offer.card.upgraded);
  addCardToMasterDeck(state, added);
  if (state.stats) {
    state.stats.colorlessBought = (state.stats.colorlessBought ?? 0) + 1;
  }
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
  if (offer.relicId === 'membership_card') {
    applyShopMembershipDiscount(state);
  }
  return { ok: true, relicId: offer.relicId };
}

export function buyShopExclusiveRelic(state) {
  if (state.screen !== 'shop' || !state.shop?.shopRelicOffer) {
    return { ok: false, reason: '没有可购买的商店专属遗物' };
  }
  const offer = state.shop.shopRelicOffer;
  if (offer.sold) {
    return { ok: false, reason: '该商店专属遗物已售出' };
  }
  if (state.player.gold < offer.price) {
    return { ok: false, reason: '金币不足' };
  }
  state.player.gold -= offer.price;
  offer.sold = true;
  grantRelicToPlayer(state, offer.relicId);
  if (offer.relicId === 'membership_card') {
    applyShopMembershipDiscount(state);
  }
  return { ok: true, relicId: offer.relicId };
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
  const side = applyCardRemovalSideEffects(state, removed);
  return { ok: true, removed, lostMaxHp: side.lostMaxHp };
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
  const tune = getEventTuning(state.ascension ?? 0);

  switch (eventDef.id) {
    case 'shining_light': {
      if (choiceId === 'enter_light') {
        if (state.player.hp <= tune.shiningLightHpLoss) {
          return { ok: false, reason: `当前生命值不足（需大于 ${tune.shiningLightHpLoss} 点）` };
        }
        state.player.hp -= tune.shiningLightHpLoss;
        const { chosen, names } = upgradeRandomCardsInEvent(state, 2);
        state.eventState.resolved = true;
        state.eventState.outcomeText =
          chosen.length > 0
            ? `失去 ${tune.shiningLightHpLoss} 点生命，成功升级了 ${chosen.length} 张卡牌：${names}！`
            : `失去 ${tune.shiningLightHpLoss} 点生命，但当前牌组中已没有可升级的卡牌。`;
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
        if (state.player.hp <= tune.forgeOverclockHpLoss) {
          return { ok: false, reason: `当前生命值不足（需大于 ${tune.forgeOverclockHpLoss} 点）` };
        }
        if (state.player.gold < tune.forgeOverclockGold) {
          return { ok: false, reason: `金币不足（需至少 ${tune.forgeOverclockGold} 金币）` };
        }
        state.player.hp -= tune.forgeOverclockHpLoss;
        state.player.gold -= tune.forgeOverclockGold;
        const { chosen, names } = upgradeRandomCardsInEvent(state, 2);
        state.eventState.resolved = true;
        state.eventState.outcomeText =
          chosen.length > 0
            ? `失去 ${tune.forgeOverclockHpLoss} 点生命并花费 ${tune.forgeOverclockGold} 金币，成功升级了 ${chosen.length} 张卡牌：${names}！`
            : `失去 ${tune.forgeOverclockHpLoss} 点生命并花费 ${tune.forgeOverclockGold} 金币，但当前牌组中已没有可升级的卡牌。`;
        return { ok: true };
      }
      if (choiceId === 'scavenge_slag') {
        addPlayerGold(state, tune.forgeScavengeGold);
        state.eventState.resolved = true;
        state.eventState.outcomeText = `你拾取了锻台旁的精铁锭，获得 ${tune.forgeScavengeGold} 金币。`;
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
        const heal = Math.max(1, Math.floor(state.player.maxHp * (tune.shrineSpringHealPct / 100)));
        const before = state.player.hp;
        state.player.hp = Math.min(state.player.maxHp, state.player.hp + heal);
        state.eventState.resolved = true;
        state.eventState.outcomeText = `清冽圣泉抚平了伤痛，回复了 ${state.player.hp - before} 点生命。`;
        return { ok: true };
      }
      if (choiceId === 'gather_gold') {
        addPlayerGold(state, tune.shrineGatherGold);
        state.eventState.resolved = true;
        state.eventState.outcomeText = `你将石盘中的金砂收入囊中，获得 ${tune.shrineGatherGold} 金币。`;
        return { ok: true };
      }
      return { ok: false, reason: '无效的事件选项' };
    }

    case 'thorn_reliquary': {
      if (choiceId === 'open_reliquary') {
        if (state.player.hp <= tune.thornOpenHpLoss) {
          return { ok: false, reason: `当前生命值不足（需大于 ${tune.thornOpenHpLoss} 点）` };
        }
        state.player.hp -= tune.thornOpenHpLoss;
        const relicId = rollUnownedRelicId(state, 'event');
        if (relicId) {
          grantRelicToPlayer(state, relicId);
          state.eventState.outcomeText = `你忍痛扯断铁刺（-${tune.thornOpenHpLoss} 生命），获得了遗物【${RELIC_LIBRARY[relicId].name}】！`;
        } else {
          addPlayerGold(state, 80);
          state.eventState.outcomeText = `秘匣中已无新遗物，你取出了底层封存的 80 金币（-${tune.thornOpenHpLoss} 生命）。`;
        }
        state.eventState.resolved = true;
        return { ok: true };
      }
      if (choiceId === 'take_coins') {
        addPlayerGold(state, tune.thornCoinsGold);
        state.eventState.resolved = true;
        state.eventState.outcomeText = `你拾取了石台周围散落的古币，获得 ${tune.thornCoinsGold} 金币。`;
        return { ok: true };
      }
      return { ok: false, reason: '无效的事件选项' };
    }

    case 'golden_idol': {
      if (choiceId === 'smash_trap') {
        if (state.player.hp <= tune.idolSmashHpLoss) {
          return { ok: false, reason: `当前生命值不足（需大于 ${tune.idolSmashHpLoss} 点）` };
        }
        state.player.hp -= tune.idolSmashHpLoss;
        addPlayerGold(state, tune.idolSmashGold);
        const gotIdol = grantRelicToPlayer(state, 'golden_idol_relic');
        state.eventState.resolved = true;
        state.eventState.outcomeText = gotIdol
          ? `你夺下纯金神像冲出滚石通道（-${tune.idolSmashHpLoss} 生命），获得 ${tune.idolSmashGold} 金币与事件遗物【黄金神像】！`
          : `你夺下纯金神像冲出滚石通道（-${tune.idolSmashHpLoss} 生命），获得 ${tune.idolSmashGold} 金币！`;
        return { ok: true };
      }
      if (choiceId === 'accept_curse_gold') {
        addPlayerGold(state, tune.idolCurseGold);
        const curse = createCardInstance(state, 'regret', false);
        addCardToMasterDeck(state, curse);
        state.eventState.addedCardIds = [curse.instanceId];
        state.eventState.resolved = true;
        state.eventState.outcomeText = `你收下神像与厚重金币（+${tune.idolCurseGold} 金币），但暗影诅咒【悔恨】缠上了你的牌组！`;
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
        if (state.player.hp <= tune.tomeFinalHpLoss) {
          return { ok: false, reason: `当前生命值不足（需大于 ${tune.tomeFinalHpLoss} 点）` };
        }
        state.player.hp -= tune.tomeFinalHpLoss;
        const cardId = pickRandom(state, cards.rare);
        const created = createCardInstance(state, cardId, false);
        addCardToMasterDeck(state, created);
        state.eventState.addedCardIds = [created.instanceId];
        const gotEnchiridion = grantRelicToPlayer(state, 'enchiridion');
        state.eventState.resolved = true;
        state.eventState.outcomeText = gotEnchiridion
          ? `鲜血浸透书页（-${tune.tomeFinalHpLoss} 生命），你领悟了稀有战技【${getCardStats(created).name}】并收获事件遗物【${RELIC_LIBRARY.enchiridion.name}】！`
          : `鲜血浸透书页（-${tune.tomeFinalHpLoss} 生命），你领悟了稀有战技【${getCardStats(created).name}】！`;
        return { ok: true };
      }
      if (choiceId === 'skim_preface') {
        if (state.player.hp <= tune.tomeSkimHpLoss) {
          return { ok: false, reason: `当前生命值不足（需大于 ${tune.tomeSkimHpLoss} 点）` };
        }
        state.player.hp -= tune.tomeSkimHpLoss;
        const cardId = pickRandom(state, cards.uncommon);
        const created = createCardInstance(state, cardId, false);
        addCardToMasterDeck(state, created);
        state.eventState.addedCardIds = [created.instanceId];
        state.eventState.resolved = true;
        state.eventState.outcomeText = `你强忍魔典反噬（-${tune.tomeSkimHpLoss} 生命），习得了罕见卡牌【${getCardStats(created).name}】！`;
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
        if (state.player.gold < tune.alchemistBuyGold) {
          return { ok: false, reason: `金币不足（需至少 ${tune.alchemistBuyGold} 金币）` };
        }
        if (findEmptyPotionSlot(state) === -1) {
          return { ok: false, reason: '药水栏已满，无法购买' };
        }
        state.player.gold -= tune.alchemistBuyGold;
        const { potions } = getUnlockedPools(state);
        const gainedNames = [];
        for (let i = 0; i < state.player.potions.length; i += 1) {
          if (state.player.potions[i] === null) {
            const pid = pickRandom(state, potions);
            state.player.potions[i] = pid;
            gainedNames.push(`【${POTION_LIBRARY[pid].name}】`);
          }
        }
        state.eventState.resolved = true;
        state.eventState.outcomeText = `花费 ${tune.alchemistBuyGold} 金币，获得了 ${gainedNames.join('、')}！`;
        return { ok: true };
      }
      if (choiceId === 'drink_mutagen') {
        state.player.maxHp += tune.alchemistMutagenMaxHp;
        state.player.hp = Math.min(state.player.maxHp, state.player.hp + tune.alchemistMutagenMaxHp);
        state.eventState.resolved = true;
        state.eventState.outcomeText = `狂野热流涌遍全身，最大生命值永久 +${tune.alchemistMutagenMaxHp} 并回复了 ${tune.alchemistMutagenMaxHp} 点生命！`;
        return { ok: true };
      }
      if (choiceId === 'rob_alchemist') {
        addPlayerGold(state, tune.alchemistRobGold);
        const curse = createCardInstance(state, 'doubt', false);
        addCardToMasterDeck(state, curse);
        state.eventState.addedCardIds = [curse.instanceId];
        state.eventState.resolved = true;
        state.eventState.outcomeText = `你席卷了 ${tune.alchemistRobGold} 金币，但炼金师的怨毒咒言化作【疑虑】混入了你的牌组！`;
        return { ok: true };
      }
      return { ok: false, reason: '无效的事件选项' };
    }

    case 'mushroom_grotto': {
      if (choiceId === 'eat_blue_cap') {
        const heal = Math.max(1, Math.floor(state.player.maxHp * (tune.grottoBlueHealPct / 100)));
        const before = state.player.hp;
        state.player.hp = Math.min(state.player.maxHp, state.player.hp + heal);
        const curse = createCardInstance(state, 'clumsy', false);
        addCardToMasterDeck(state, curse);
        state.eventState.addedCardIds = [curse.instanceId];
        state.eventState.resolved = true;
        state.eventState.outcomeText = `甘美菌肉回复了 ${state.player.hp - before} 点生命，但微麻孢子使你获得了诅咒【笨拙】。`;
        return { ok: true };
      }
      if (choiceId === 'refine_red_spore') {
        if (state.player.hp <= tune.grottoRedHpLoss) {
          return { ok: false, reason: `当前生命值不足（需大于 ${tune.grottoRedHpLoss} 点）` };
        }
        state.player.hp -= tune.grottoRedHpLoss;
        state.player.maxHp += tune.grottoRedMaxHp;
        state.eventState.resolved = true;
        state.eventState.outcomeText = `灼热菌核锤炼了体魄（-${tune.grottoRedHpLoss} 当前生命），你的最大生命值永久 +${tune.grottoRedMaxHp}！`;
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
        state.player.hp = Math.min(state.player.maxHp, state.player.hp + tune.libraryNapHeal);
        state.eventState.resolved = true;
        state.eventState.outcomeText = `你在静谧书阁中沉沉睡去，醒来回复了 ${state.player.hp - before} 点生命。`;
        return { ok: true };
      }
      return { ok: false, reason: '无效的事件选项' };
    }

    case 'masked_bandits': {
      if (choiceId === 'pay_gold') {
        const lostGold = state.player.gold;
        state.player.gold = 0;
        state.eventState.resolved = true;
        state.eventState.outcomeText = `你交出了全部 ${lostGold} 枚金币买下通行权，平安甩开了蒙面强盗。`;
        return { ok: true };
      }
      if (choiceId === 'fight_bandits') {
        state.eventCombatReward = { gold: tune.banditsFightGold, relicId: 'red_mask' };
        state.eventState = null;
        const banditsEncounter = {
          id: 'masked_bandits_event',
          name: '蒙面强盗团',
          enemies: [
            { templateId: 'looter', customName: '赤面盗匪·尖刺' },
            { templateId: 'slaver_blue', customName: '赤面盗匪·罗密欧' },
          ],
        };
        state.lastEncounterId = banditsEncounter.id;
        startCombat(state, banditsEncounter, 'normal', transitionCombatVictory);
        return { ok: true, screen: state.screen, startedCombat: true };
      }
      return { ok: false, reason: '无效的事件选项' };
    }

    case 'mind_bloom': {
      if (choiceId === 'war_memory') {
        const bossTemplateEnc = pickRandom(state, ENCOUNTERS.boss);
        const cloneEnc = {
          id: `mind_bloom_${bossTemplateEnc.id}`,
          name: `心花幻影：${bossTemplateEnc.name.replace(/^(?:终幕)?首领：/, '')}`,
          enemies: bossTemplateEnc.enemies.map((e) => ({ ...e, customRole: 'normal' })),
        };
        state.eventCombatReward = { gold: tune.mindBloomWarGold, relicTier: 'rare' };
        state.eventState = null;
        state.lastEncounterId = cloneEnc.id;
        startCombat(state, cloneEnc, 'normal', transitionCombatVictory);
        return { ok: true, screen: state.screen, startedCombat: true };
      }
      if (choiceId === 'awake_memory') {
        const lostMaxHp = Math.max(
          1,
          Math.floor(state.player.maxHp * (tune.mindBloomAwakeMaxHpPct / 100))
        );
        const nextMaxHp = Math.max(25, state.player.maxHp - lostMaxHp);
        const actualMaxLoss = Math.max(0, state.player.maxHp - nextMaxHp);
        state.player.maxHp = nextMaxHp;
        state.player.hp = Math.min(state.player.maxHp, state.player.hp);
        const upgraded = [];
        for (const c of state.player.deck) {
          if (canUpgradeCard(c)) {
            c.upgraded = true;
            upgraded.push(c.instanceId);
          }
        }
        state.eventState.upgradedCardIds = upgraded;
        state.eventState.resolved = true;
        state.eventState.outcomeText =
          upgraded.length > 0
            ? `幻象灼烧灵魂（最大生命 -${actualMaxLoss}，上限 ${state.player.maxHp}），牌组中全部 ${upgraded.length} 张可升级卡牌均已飞升！`
            : `幻象灼烧灵魂（最大生命 -${actualMaxLoss}），你的牌组本就全部达到满级。`;
        return { ok: true };
      }
      if (choiceId === 'rich_memory') {
        addPlayerGold(state, tune.mindBloomRichGold);
        const addedIds = [];
        for (let i = 0; i < 2; i += 1) {
          const c = createCardInstance(state, 'doubt', false);
          addCardToMasterDeck(state, c);
          addedIds.push(c.instanceId);
        }
        state.eventState.addedCardIds = addedIds;
        state.eventState.resolved = true;
        state.eventState.outcomeText = `黄金涌入行囊（+${tune.mindBloomRichGold} 金币），但贪婪幻念凝成 2 张【疑虑】沉入你的牌组！`;
        return { ok: true };
      }
      return { ok: false, reason: '无效的事件选项' };
    }

    case 'scrap_ooze': {
      if (choiceId === 'reach_ooze') {
        const attempts = state.eventState.oozeAttempts ?? 0;
        const hpCost = tune.oozeBaseHpLoss + attempts;
        const chancePct = Math.min(100, tune.oozeBaseChancePct + attempts * 15);
        if (state.player.hp <= hpCost) {
          return { ok: false, reason: `当前生命值不足（需大于 ${hpCost} 点）` };
        }
        state.player.hp -= hpCost;
        const roll = nextRandom(state) * 100;
        if (roll < chancePct) {
          const relicId = rollUnownedRelicId(state, 'event');
          state.eventState.resolved = true;
          if (relicId) {
            grantRelicToPlayer(state, relicId);
            state.eventState.outcomeText = `忍住酸液灼烧（-${hpCost} 生命），你终于从软泥深处掏出了遗物【${RELIC_LIBRARY[relicId].name}】！`;
          } else {
            addPlayerGold(state, 90);
            state.eventState.outcomeText = `你从软泥深处掏出了一袋亮晶晶的金币（+90 金币，-${hpCost} 生命）！`;
          }
          return { ok: true, foundRelic: Boolean(relicId) };
        }
        state.eventState.oozeAttempts = attempts + 1;
        state.eventState.lastAttemptNote = `酸液灼痛了你的手臂（-${hpCost} 生命），但尚未触到宝物！下次尝试代价 ${hpCost + 1} 生命，成功率升至 ${Math.min(100, chancePct + 15)}%。`;
        return { ok: true, foundRelic: false, retryAvailable: true };
      }
      if (choiceId === 'leave_ooze') {
        state.eventState.resolved = true;
        state.eventState.outcomeText = '你收回手掌，果断远离了冒着气泡的废料软泥。';
        return { ok: true };
      }
      return { ok: false, reason: '无效的事件选项' };
    }

    case 'wing_statue': {
      if (choiceId === 'pray_wing') {
        if (state.player.hp <= tune.wingPrayHpLoss) {
          return { ok: false, reason: `当前生命值不足（需大于 ${tune.wingPrayHpLoss} 点）` };
        }
        if (state.player.deck.length <= 1) {
          return { ok: false, reason: '牌组中仅剩 1 张卡牌，无法继续移除' };
        }
        state.eventState.pendingPurge = true;
        state.eventState.purgeHpCost = tune.wingPrayHpLoss;
        return { ok: true, pendingPurge: true };
      }
      if (choiceId === 'destroy_wing') {
        if (!playerHasHeavyAttackCard(state)) {
          return { ok: false, reason: '需要牌组中有基础伤害 ≥ 10 的攻击牌' };
        }
        addPlayerGold(state, tune.wingDestroyGold);
        state.eventState.resolved = true;
        state.eventState.outcomeText = `你以重击震碎翼龙石像，暗格中滚出 ${tune.wingDestroyGold} 枚金币！`;
        return { ok: true };
      }
      if (choiceId === 'leave_wing') {
        state.eventState.resolved = true;
        state.eventState.outcomeText = '你向翼龙石像颔首致意后径直离开。';
        return { ok: true };
      }
      return { ok: false, reason: '无效的事件选项' };
    }

    case 'council_of_ghosts': {
      if (choiceId === 'accept_ghosts') {
        const lostMaxHp = Math.max(
          1,
          Math.floor(state.player.maxHp * (tune.ghostsMaxHpLossPct / 100))
        );
        const nextMaxHp = Math.max(20, state.player.maxHp - lostMaxHp);
        const actualLoss = Math.max(0, state.player.maxHp - nextMaxHp);
        state.player.maxHp = nextMaxHp;
        state.player.hp = Math.min(state.player.maxHp, state.player.hp);
        const addedIds = [];
        for (let i = 0; i < 3; i += 1) {
          const card = createCardInstance(state, 'apparition', false);
          addCardToMasterDeck(state, card);
          addedIds.push(card.instanceId);
        }
        state.eventState.addedCardIds = addedIds;
        state.eventState.resolved = true;
        state.eventState.outcomeText = `幽灵议会汲取了你的凡胎生机（最大生命 -${actualLoss}，上限 ${state.player.maxHp}），赐予 3 张【灵体】加入牌组！`;
        return { ok: true };
      }
      if (choiceId === 'refuse_ghosts') {
        state.eventState.resolved = true;
        state.eventState.outcomeText = '你婉拒了幽灵们的邀约，它们化作轻雾消散在废墟之间。';
        return { ok: true };
      }
      return { ok: false, reason: '无效的事件选项' };
    }

    case 'forgotten_altar': {
      if (choiceId === 'offer_golden_idol') {
        if (!hasRelic(state, 'golden_idol_relic')) {
          return { ok: false, reason: '需要持有事件遗物【黄金神像】' };
        }
        grantRelicToPlayer(state, 'bloody_idol');
        const before = state.player.hp;
        state.player.hp = state.player.maxHp;
        state.eventState.resolved = true;
        state.eventState.outcomeText = `【黄金神像】在鲜血祭坛上升华为【染血神像】（每次获金回复 5 点生命），并为你回满生命（+${state.player.hp - before}）！`;
        return { ok: true };
      }
      if (choiceId === 'shed_blood_altar') {
        const hpCost = Math.max(1, Math.floor(state.player.maxHp * (tune.altarShedHpPct / 100)));
        if (state.player.hp <= hpCost) {
          return { ok: false, reason: `当前生命值不足（需大于 ${hpCost} 点）` };
        }
        state.player.hp -= hpCost;
        state.player.maxHp += tune.altarShedMaxHpGain;
        const upgradable = getUpgradableDeckCards(state);
        const chosen = pickRandom(state, upgradable);
        const upgradedIds = [];
        if (chosen) {
          chosen.upgraded = true;
          upgradedIds.push(chosen.instanceId);
        }
        state.eventState.upgradedCardIds = upgradedIds;
        state.eventState.resolved = true;
        state.eventState.outcomeText = chosen
          ? `祭坛畅饮你的鲜血（-${hpCost} 生命），回报以最大生命 +${tune.altarShedMaxHpGain}，并淬炼升级了【${getCardStats(chosen).name}】！`
          : `祭坛畅饮你的鲜血（-${hpCost} 生命），回报以最大生命 +${tune.altarShedMaxHpGain}！`;
        return { ok: true };
      }
      if (choiceId === 'desecrate_altar') {
        addPlayerGold(state, tune.altarDesecrateGold);
        const curse = createCardInstance(state, 'regret', false);
        addCardToMasterDeck(state, curse);
        state.eventState.addedCardIds = [curse.instanceId];
        state.eventState.resolved = true;
        state.eventState.outcomeText = `你撬走了祭坛供奉的 ${tune.altarDesecrateGold} 枚金币，但阴冷诅咒【悔恨】缠上了你！`;
        return { ok: true };
      }
      return { ok: false, reason: '无效的事件选项' };
    }

    case 'augmenter': {
      if (choiceId === 'augment_rare_transform') {
        if (state.player.deck.length === 0) {
          return { ok: false, reason: '当前牌组为空' };
        }
        state.eventState.pendingCardAction = 'transform_rare';
        return { ok: true, pendingCardAction: 'transform_rare' };
      }
      if (choiceId === 'augment_serum') {
        if (state.player.hp <= tune.augmentSerumHpLoss) {
          return { ok: false, reason: `当前生命值不足（需大于 ${tune.augmentSerumHpLoss} 点）` };
        }
        state.player.hp -= tune.augmentSerumHpLoss;
        state.player.maxHp += tune.augmentSerumMaxHpGain;
        const { cards } = getUnlockedPools(state);
        const pool = [...cards.uncommon, ...cards.rare];
        const cardId = pickRandom(state, pool.length > 0 ? pool : cards.common);
        const added = createCardInstance(state, cardId, false);
        addCardToMasterDeck(state, added);
        state.eventState.addedCardIds = [added.instanceId];
        state.eventState.resolved = true;
        state.eventState.outcomeText = `血清在血脉中沸腾（-${tune.augmentSerumHpLoss} 生命，最大生命 +${tune.augmentSerumMaxHpGain}），并激发领悟了【${getCardStats(added).name}】！`;
        return { ok: true };
      }
      if (choiceId === 'augment_leave') {
        state.eventState.resolved = true;
        state.eventState.outcomeText = '你摆手谢绝了改造师的实验邀请，继续前进。';
        return { ok: true };
      }
      return { ok: false, reason: '无效的事件选项' };
    }

    case 'sensory_stone': {
      const colorless = getColorlessCardPools();
      const allColorless = [...colorless.uncommon, ...colorless.rare];
      if (choiceId === 'recall_1') {
        const pickedIds = pickDistinct(state, allColorless, 3);
        state.eventState.libraryChoices = pickedIds.map((cid) =>
          createCardInstance(state, cid, false)
        );
        return { ok: true, pendingLibrary: true };
      }
      if (choiceId === 'recall_2') {
        if (state.player.hp <= tune.sensoryRecall2HpLoss) {
          return { ok: false, reason: `当前生命值不足（需大于 ${tune.sensoryRecall2HpLoss} 点）` };
        }
        state.player.hp -= tune.sensoryRecall2HpLoss;
        const pickedIds = pickDistinct(state, allColorless, 3);
        state.eventState.libraryChoices = pickedIds.map((cid) =>
          createCardInstance(state, cid, true)
        );
        return { ok: true, pendingLibrary: true };
      }
      if (choiceId === 'recall_3') {
        if (state.player.hp <= tune.sensoryRecall3HpLoss) {
          return { ok: false, reason: `当前生命值不足（需大于 ${tune.sensoryRecall3HpLoss} 点）` };
        }
        state.player.hp -= tune.sensoryRecall3HpLoss;
        const rareCid = pickRandom(state, colorless.rare);
        const added = createCardInstance(state, rareCid, true);
        addCardToMasterDeck(state, added);
        state.eventState.addedCardIds = [added.instanceId];
        const relicId = rollUnownedRelicId(state, 'event');
        if (relicId) {
          grantRelicToPlayer(state, relicId);
        }
        state.eventState.resolved = true;
        state.eventState.outcomeText = relicId
          ? `真相的冲击令你失去 ${tune.sensoryRecall3HpLoss} 点生命，但你收获了无色稀有牌【${getCardStats(added).name}】与遗物【${RELIC_LIBRARY[relicId].name}】！`
          : `真相的冲击令你失去 ${tune.sensoryRecall3HpLoss} 点生命，但你收获了无色稀有牌【${getCardStats(added).name}】！`;
        return { ok: true };
      }
      return { ok: false, reason: '无效的事件选项' };
    }

    case 'winding_halls': {
      if (choiceId === 'embrace_madness') {
        if (state.player.hp <= tune.windingMadnessHpLoss) {
          return { ok: false, reason: `当前生命值不足（需大于 ${tune.windingMadnessHpLoss} 点）` };
        }
        state.player.hp -= tune.windingMadnessHpLoss;
        const colorless = getColorlessCardPools();
        const zeroCostPool = colorless.uncommon.filter(
          (cid) => CARD_LIBRARY[cid]?.base?.cost === 0
        );
        const sourcePool = zeroCostPool.length > 0 ? zeroCostPool : colorless.uncommon;
        const chosenIds = pickDistinct(state, sourcePool, 2);
        const addedIds = [];
        const names = [];
        for (const cid of chosenIds) {
          const card = createCardInstance(state, cid, false);
          addCardToMasterDeck(state, card);
          addedIds.push(card.instanceId);
          names.push(`【${getCardStats(card).name}】`);
        }
        state.eventState.addedCardIds = addedIds;
        state.eventState.resolved = true;
        state.eventState.outcomeText = `回廊低语刺痛双耳（-${tune.windingMadnessHpLoss} 生命），灵光乍现间你习得了 ${names.join('、')}！`;
        return { ok: true };
      }
      if (choiceId === 'retrace_steps') {
        const heal = Math.max(1, Math.floor(state.player.maxHp * (tune.windingRetraceHealPct / 100)));
        const before = state.player.hp;
        state.player.hp = Math.min(state.player.maxHp, state.player.hp + heal);
        const curse = createCardInstance(state, 'doubt', false);
        addCardToMasterDeck(state, curse);
        state.eventState.addedCardIds = [curse.instanceId];
        state.eventState.resolved = true;
        state.eventState.outcomeText = `暂歇片刻回复了 ${state.player.hp - before} 点生命，但迷茫化作诅咒【疑虑】渗入了牌组。`;
        return { ok: true };
      }
      if (choiceId === 'push_through_halls') {
        const lostMaxHp = Math.max(
          1,
          Math.floor(state.player.maxHp * (tune.windingPushMaxHpPct / 100))
        );
        const nextMaxHp = Math.max(25, state.player.maxHp - lostMaxHp);
        const actualLoss = Math.max(0, state.player.maxHp - nextMaxHp);
        state.player.maxHp = nextMaxHp;
        state.player.hp = Math.min(state.player.maxHp, state.player.hp);
        state.eventState.resolved = true;
        state.eventState.outcomeText = `你强行破开扭曲石壁冲出回廊，永久失去 ${actualLoss} 点最大生命（上限 ${state.player.maxHp}），未沾染任何诅咒。`;
        return { ok: true };
      }
      return { ok: false, reason: '无效的事件选项' };
    }

    // === P1 Expansion: Act 1 Events (+5) ===
    case 'big_fish': {
      if (choiceId === 'eat_banana') {
        const heal = Math.max(1, Math.floor(state.player.maxHp * (tune.bigFishBananaPct / 100)));
        const before = state.player.hp;
        state.player.hp = Math.min(state.player.maxHp, state.player.hp + heal);
        state.eventState.resolved = true;
        state.eventState.outcomeText = `香甜香蕉驱散了疲惫，回复了 ${state.player.hp - before} 点生命！`;
        return { ok: true };
      }
      if (choiceId === 'eat_donut') {
        state.player.maxHp += tune.bigFishDonutMaxHp;
        state.player.hp = Math.min(state.player.maxHp, state.player.hp + tune.bigFishDonutMaxHp);
        state.eventState.resolved = true;
        state.eventState.outcomeText = `松软甜甜圈令体力倍增：最大生命永久 +${tune.bigFishDonutMaxHp}（并回复 ${tune.bigFishDonutMaxHp} 点生命）！`;
        return { ok: true };
      }
      if (choiceId === 'open_fish_box') {
        const relicId = rollUnownedRelicId(state, 'event');
        if (relicId) {
          grantRelicToPlayer(state, relicId);
        } else {
          addPlayerGold(state, 90);
        }
        const curse = createCardInstance(state, 'regret', false);
        addCardToMasterDeck(state, curse);
        state.eventState.addedCardIds = [curse.instanceId];
        state.eventState.resolved = true;
        state.eventState.outcomeText = relicId
          ? `木匣中藏着遗物【${RELIC_LIBRARY[relicId].name}】，但随之涌出的诅咒【悔恨】渗入了你的牌组！`
          : `木匣中藏着 90 金币，但诅咒【悔恨】渗入了你的牌组！`;
        return { ok: true };
      }
      return { ok: false, reason: '无效的事件选项' };
    }

    case 'cleric': {
      if (choiceId === 'cleric_heal') {
        if (state.player.gold < tune.clericHealGold) {
          return { ok: false, reason: `金币不足（需至少 ${tune.clericHealGold} 金币）` };
        }
        state.player.gold -= tune.clericHealGold;
        const heal = Math.max(1, Math.floor(state.player.maxHp * 0.25));
        const before = state.player.hp;
        state.player.hp = Math.min(state.player.maxHp, state.player.hp + heal);
        state.eventState.resolved = true;
        state.eventState.outcomeText = `花费 ${tune.clericHealGold} 金币接受圣光疗愈，回复了 ${state.player.hp - before} 点生命！`;
        return { ok: true };
      }
      if (choiceId === 'cleric_purify') {
        if (state.player.gold < tune.clericPurifyGold) {
          return { ok: false, reason: `金币不足（需至少 ${tune.clericPurifyGold} 金币）` };
        }
        if (state.player.deck.length <= 1) {
          return { ok: false, reason: '牌组中仅剩 1 张卡牌，无法继续移除' };
        }
        state.eventState.pendingPurge = true;
        state.eventState.purgeGoldCost = tune.clericPurifyGold;
        return { ok: true, pendingPurge: true };
      }
      if (choiceId === 'cleric_leave') {
        state.eventState.resolved = true;
        state.eventState.outcomeText = '你向尖塔牧师颔首道别，继续踏上征途。';
        return { ok: true };
      }
      return { ok: false, reason: '无效的事件选项' };
    }

    case 'dead_adventurer': {
      if (choiceId === 'loot_pack') {
        if (state.player.hp <= tune.adventurerFailHpLoss) {
          return { ok: false, reason: `当前生命值不足（需大于 ${tune.adventurerFailHpLoss} 点）` };
        }
        if (nextRandom(state) < 0.55) {
          const relicId = rollUnownedRelicId(state, 'event');
          if (relicId) {
            grantRelicToPlayer(state, relicId);
            state.eventState.outcomeText = `趁着阴影尚未察觉，你利落搜出了遗物【${RELIC_LIBRARY[relicId].name}】！`;
          } else {
            addPlayerGold(state, 95);
            state.eventState.outcomeText = '你悄无声息地翻出了 95 枚金币！';
          }
        } else {
          state.player.hp -= tune.adventurerFailHpLoss;
          addPlayerGold(state, 55);
          state.eventState.outcomeText = `暗处捕食者骤然扑出！你负伤撤退（-${tune.adventurerFailHpLoss} 生命），顺手抢回了 55 金币。`;
        }
        state.eventState.resolved = true;
        return { ok: true };
      }
      if (choiceId === 'salvage_weapon') {
        if (state.player.hp <= tune.adventurerWeaponHpLoss) {
          return { ok: false, reason: `当前生命值不足（需大于 ${tune.adventurerWeaponHpLoss} 点）` };
        }
        state.player.hp -= tune.adventurerWeaponHpLoss;
        const upgradable = getUpgradableDeckCards(state);
        const attackUpgradable = upgradable.filter((c) => getCardStats(c).type === 'attack');
        const chosen = pickRandom(
          state,
          attackUpgradable.length > 0 ? attackUpgradable : upgradable
        );
        const upgradedIds = [];
        if (chosen) {
          chosen.upgraded = true;
          upgradedIds.push(chosen.instanceId);
        }
        state.eventState.upgradedCardIds = upgradedIds;
        state.eventState.resolved = true;
        state.eventState.outcomeText = chosen
          ? `你顶着擦伤（-${tune.adventurerWeaponHpLoss} 生命）磨砺兵刃，永久升级了【${getCardStats(chosen).name}】！`
          : `你顶着擦伤（-${tune.adventurerWeaponHpLoss} 生命）检查残刃，但你的卡牌已全部满级。`;
        return { ok: true };
      }
      if (choiceId === 'leave_adventurer') {
        state.eventState.resolved = true;
        state.eventState.outcomeText = '你没有惊动阴影中的捕食者，悄然绕道离开。';
        return { ok: true };
      }
      return { ok: false, reason: '无效的事件选项' };
    }

    case 'sssserpent': {
      if (choiceId === 'accept_serpent_gold') {
        addPlayerGold(state, tune.serpentGold);
        const curse = createCardInstance(state, 'doubt', false);
        addCardToMasterDeck(state, curse);
        state.eventState.addedCardIds = [curse.instanceId];
        state.eventState.resolved = true;
        state.eventState.outcomeText = `你收下巨蛇吐出的 ${tune.serpentGold} 枚金币，但心中滋生了诅咒【疑虑】！`;
        return { ok: true };
      }
      if (choiceId === 'refuse_serpent') {
        state.eventState.resolved = true;
        state.eventState.outcomeText = '巨蛇发出失望的嘶鸣，你毫发无损地离开了残垣。';
        return { ok: true };
      }
      return { ok: false, reason: '无效的事件选项' };
    }

    case 'world_of_goop': {
      if (choiceId === 'gather_goop_gold') {
        if (state.player.hp <= tune.goopHpLoss) {
          return { ok: false, reason: `当前生命值不足（需大于 ${tune.goopHpLoss} 点）` };
        }
        state.player.hp -= tune.goopHpLoss;
        addPlayerGold(state, 75);
        state.eventState.resolved = true;
        state.eventState.outcomeText = `酸液灼伤双臂（-${tune.goopHpLoss} 生命），但你成功捞出了 75 枚金币！`;
        return { ok: true };
      }
      if (choiceId === 'leave_goop') {
        const lostGold = Math.min(state.player.gold, tune.goopLeaveGoldLoss);
        state.player.gold -= lostGold;
        state.eventState.resolved = true;
        state.eventState.outcomeText =
          lostGold > 0
            ? `你迅速跃出泥潭未受丝毫伤害，但在慌忙间滑落了 ${lostGold} 枚金币。`
            : '你迅速跃出泥潭，分文未损也毫发无伤。';
        return { ok: true };
      }
      return { ok: false, reason: '无效的事件选项' };
    }

    // === P1 Expansion: Act 2 Events (+5) ===
    case 'the_joust': {
      if (choiceId === 'bet_murderer' || choiceId === 'bet_owner') {
        if (state.player.gold < 50) {
          return { ok: false, reason: '金币不足（下注需至少 50 金币）' };
        }
        state.player.gold -= 50;
        const isSafeBet = choiceId === 'bet_murderer';
        const winChance = isSafeBet ? 0.7 : 0.3;
        const payout = isSafeBet ? 100 : 250;
        const won = nextRandom(state) < winChance;
        if (won) {
          addPlayerGold(state, payout);
          state.eventState.outcomeText = isSafeBet
            ? `黑甲骑士势如破竹赢得对决！你押注 50 金币赢回 ${payout} 金币（净赚 +${payout - 50}）！`
            : `爆冷逆转！白衣骑士一枪挑落强敌，你押注 50 金币豪赢 ${payout} 金币（净赚 +${payout - 50}）！`;
        } else {
          state.eventState.outcomeText = isSafeBet
            ? '意外爆冷！黑甲骑士落马，你失去了下注的 50 金币。'
            : '白衣骑士惜败于长矛之下，你失去了下注的 50 金币。';
        }
        state.eventState.resolved = true;
        return { ok: true, won };
      }
      if (choiceId === 'leave_joust') {
        state.eventState.resolved = true;
        state.eventState.outcomeText = '你冷静旁观片刻后转身离去，保住了口袋里的金币。';
        return { ok: true };
      }
      return { ok: false, reason: '无效的事件选项' };
    }

    case 'the_mausoleum': {
      if (choiceId === 'open_coffin') {
        const relicId = rollUnownedRelicId(state, 'event');
        if (relicId) {
          grantRelicToPlayer(state, relicId);
        } else {
          addPlayerGold(state, 100);
        }
        const cursed = nextRandom(state) < 0.5;
        let curseName = '';
        if (cursed) {
          const curse = createCardInstance(state, 'doubt', false);
          addCardToMasterDeck(state, curse);
          state.eventState.addedCardIds = [curse.instanceId];
          curseName = getCardStats(curse).name;
        }
        state.eventState.resolved = true;
        const lootStr = relicId ? `遗物【${RELIC_LIBRARY[relicId].name}】` : '100 金币';
        state.eventState.outcomeText = cursed
          ? `你推开石棺取出了${lootStr}，但溢出的黑雾化作诅咒【${curseName}】缠上了牌组！`
          : `你推开石棺顺利取出了${lootStr}，黑雾缓缓散去，未沾染任何诅咒！`;
        return { ok: true, cursed };
      }
      if (choiceId === 'leave_mausoleum') {
        state.eventState.resolved = true;
        state.eventState.outcomeText = '你合掌致意，不惊扰陵墓中的长眠者。';
        return { ok: true };
      }
      return { ok: false, reason: '无效的事件选项' };
    }

    case 'vampires_den': {
      const upgradeTwoAttacks = () => {
        const upgradable = getUpgradableDeckCards(state);
        const attackUpgradable = upgradable.filter((c) => getCardStats(c).type === 'attack');
        const otherUpgradable = upgradable.filter((c) => getCardStats(c).type !== 'attack');
        const picked = [
          ...pickDistinct(state, attackUpgradable, 2),
        ];
        if (picked.length < 2) {
          picked.push(...pickDistinct(state, otherUpgradable, 2 - picked.length));
        }
        for (const c of picked) {
          c.upgraded = true;
        }
        state.eventState.upgradedCardIds = picked.map((c) => c.instanceId);
        return picked;
      };

      if (choiceId === 'accept_vampire_pact') {
        const lostMaxHp = Math.max(
          1,
          Math.floor(state.player.maxHp * (tune.vampMaxHpLossPct / 100))
        );
        const nextMaxHp = Math.max(25, state.player.maxHp - lostMaxHp);
        const actualLoss = Math.max(0, state.player.maxHp - nextMaxHp);
        state.player.maxHp = nextMaxHp;
        state.player.hp = state.player.maxHp;
        const upgraded = upgradeTwoAttacks();
        state.eventState.resolved = true;
        state.eventState.outcomeText =
          upgraded.length > 0
            ? `猩红血契令你永久失去 ${actualLoss} 点最大生命（上限 ${state.player.maxHp}），但瞬间回满生命并升级了 ${upgraded.map((c) => `【${getCardStats(c).name}】`).join('、')}！`
            : `猩红血契令你永久失去 ${actualLoss} 点最大生命（上限 ${state.player.maxHp}），并瞬间回满生命！`;
        return { ok: true };
      }
      if (choiceId === 'trade_blood_vial') {
        if (!hasRelic(state, 'blood_vial')) {
          return { ok: false, reason: '需要持有遗物【鲜血小瓶】' };
        }
        const idx = state.player.relics.indexOf('blood_vial');
        if (idx !== -1) state.player.relics.splice(idx, 1);
        state.player.hp = state.player.maxHp;
        const upgraded = upgradeTwoAttacks();
        state.eventState.resolved = true;
        state.eventState.outcomeText =
          upgraded.length > 0
            ? `血族欣然收下【鲜血小瓶】，为你全额回满生命并淬炼升级了 ${upgraded.map((c) => `【${getCardStats(c).name}】`).join('、')}！`
            : '血族欣然收下【鲜血小瓶】，为你全额回满生命！';
        return { ok: true };
      }
      if (choiceId === 'refuse_vampires') {
        state.eventState.resolved = true;
        state.eventState.outcomeText = '你婉拒了暗夜血族的邀约，平静离开。';
        return { ok: true };
      }
      return { ok: false, reason: '无效的事件选项' };
    }

    case 'beggar_shrine': {
      if (choiceId === 'give_beggar_gold') {
        if (state.player.gold < tune.beggarPurifyGold) {
          return { ok: false, reason: `金币不足（需至少 ${tune.beggarPurifyGold} 金币）` };
        }
        if (state.player.deck.length <= 1) {
          return { ok: false, reason: '牌组中仅剩 1 张卡牌，无法继续移除' };
        }
        state.eventState.pendingPurge = true;
        state.eventState.purgeGoldCost = tune.beggarPurifyGold;
        return { ok: true, pendingPurge: true };
      }
      if (choiceId === 'leave_beggar') {
        state.eventState.resolved = true;
        state.eventState.outcomeText = '你径直走过街角，没有施舍金币。';
        return { ok: true };
      }
      return { ok: false, reason: '无效的事件选项' };
    }

    case 'colosseum_trial': {
      if (choiceId === 'accept_trial') {
        if (state.player.hp <= tune.colosseumHpLoss) {
          return { ok: false, reason: `当前生命值不足（需大于 ${tune.colosseumHpLoss} 点）` };
        }
        state.player.hp -= tune.colosseumHpLoss;
        addPlayerGold(state, tune.colosseumGold);
        const tier = nextRandom(state) < 0.4 ? 'rare' : 'uncommon';
        const relicId = rollUnownedRelicByTier(state, tier);
        if (relicId) {
          grantRelicToPlayer(state, relicId);
        } else {
          addPlayerGold(state, 100);
        }
        state.eventState.resolved = true;
        state.eventState.outcomeText = relicId
          ? `你在血腥斗技场中力克强敌（-${tune.colosseumHpLoss} 生命），赢得 ${tune.colosseumGold} 金币与遗物【${RELIC_LIBRARY[relicId].name}】！`
          : `你在血腥斗技场中力克强敌（-${tune.colosseumHpLoss} 生命），赢得 ${tune.colosseumGold + 100} 金币！`;
        return { ok: true };
      }
      if (choiceId === 'skip_trial') {
        state.eventState.resolved = true;
        state.eventState.outcomeText = '你婉拒了奴隶主的角斗邀约，保存体力继续前进。';
        return { ok: true };
      }
      return { ok: false, reason: '无效的事件选项' };
    }

    // === P1 Expansion: Act 3 & Act 2-3 Events (+6) ===
    case 'tomb_of_red_mask': {
      if (choiceId === 'wear_red_mask') {
        if (!hasRelic(state, 'red_mask')) {
          return { ok: false, reason: '需要持有事件遗物【红面具】' };
        }
        addPlayerGold(state, 222);
        state.eventState.resolved = true;
        state.eventState.outcomeText = '石像向你的【红面具】致敬，石棺应声开启，赠予你 222 枚金币！';
        return { ok: true };
      }
      if (choiceId === 'offer_all_gold') {
        if (state.player.gold < 1) {
          return { ok: false, reason: '需要至少拥有 1 枚金币才可献祭' };
        }
        const paid = state.player.gold;
        state.player.gold = 0;
        let relicId = null;
        if (!hasRelic(state, 'red_mask')) {
          grantRelicToPlayer(state, 'red_mask');
          relicId = 'red_mask';
        } else {
          relicId = rollUnownedRelicByTier(state, 'rare');
          if (relicId) grantRelicToPlayer(state, relicId);
        }
        state.eventState.resolved = true;
        state.eventState.outcomeText = relicId
          ? `你将全部 ${paid} 枚金币投入祭盘，换得了遗物【${RELIC_LIBRARY[relicId].name}】！`
          : `你将全部 ${paid} 枚金币投入祭盘，石像向你微微颔首。`;
        return { ok: true };
      }
      if (choiceId === 'leave_red_tomb') {
        state.eventState.resolved = true;
        state.eventState.outcomeText = '你转身离开红面具石棺，继续深入圣殿。';
        return { ok: true };
      }
      return { ok: false, reason: '无效的事件选项' };
    }

    case 'falling_abyss': {
      if (choiceId === 'land_sacrifice_skill') {
        if (state.player.deck.length <= 1) {
          return { ok: false, reason: '牌组中仅剩 1 张卡牌，无法继续舍弃' };
        }
        const skills = state.player.deck.filter((c) => getCardStats(c).type === 'skill');
        if (skills.length === 0) {
          return { ok: false, reason: '牌组中没有可舍弃的技能牌' };
        }
        const victim = pickRandom(state, skills);
        const idx = state.player.deck.findIndex((c) => c.instanceId === victim.instanceId);
        if (idx !== -1) state.player.deck.splice(idx, 1);
        state.eventState.resolved = true;
        state.eventState.outcomeText = `千钧一发之际你舍弃了技能牌【${getCardStats(victim).name}】借力缓冲，毫发无损地平稳着陆！`;
        return { ok: true };
      }
      if (choiceId === 'land_sacrifice_attack') {
        if (state.player.deck.length <= 1) {
          return { ok: false, reason: '牌组中仅剩 1 张卡牌，无法继续舍弃' };
        }
        const attacks = state.player.deck.filter((c) => getCardStats(c).type === 'attack');
        if (attacks.length === 0) {
          return { ok: false, reason: '牌组中没有可舍弃的攻击牌' };
        }
        const victim = pickRandom(state, attacks);
        const idx = state.player.deck.findIndex((c) => c.instanceId === victim.instanceId);
        if (idx !== -1) state.player.deck.splice(idx, 1);
        state.eventState.resolved = true;
        state.eventState.outcomeText = `你舍弃了攻击牌【${getCardStats(victim).name}】嵌入石壁减速，毫发无损地落回平台！`;
        return { ok: true };
      }
      if (choiceId === 'brace_fall_impact') {
        const actualLoss = Math.min(Math.max(0, state.player.hp - 1), tune.fallingImpactHpLoss);
        state.player.hp -= actualLoss;
        state.eventState.resolved = true;
        state.eventState.outcomeText = `你死死护住所有卡牌硬扛坠地冲击（-${actualLoss} 生命），牌组完整无缺！`;
        return { ok: true };
      }
      return { ok: false, reason: '无效的事件选项' };
    }

    case 'mysterious_sphere': {
      if (choiceId === 'smash_sphere') {
        if (state.player.hp <= tune.sphereHpLoss) {
          return { ok: false, reason: `当前生命值不足（需大于 ${tune.sphereHpLoss} 点）` };
        }
        state.player.hp -= tune.sphereHpLoss;
        addPlayerGold(state, 55);
        const relicId = rollUnownedRelicByTier(state, 'rare');
        if (relicId) {
          grantRelicToPlayer(state, relicId);
        } else {
          addPlayerGold(state, 120);
        }
        state.eventState.resolved = true;
        state.eventState.outcomeText = relicId
          ? `你顶着守护电弧击碎球壳（-${tune.sphereHpLoss} 生命），夺取了稀有遗物【${RELIC_LIBRARY[relicId].name}】与 55 金币！`
          : `你顶着守护电弧击碎球壳（-${tune.sphereHpLoss} 生命），夺取了 175 金币！`;
        return { ok: true };
      }
      if (choiceId === 'leave_sphere') {
        state.eventState.resolved = true;
        state.eventState.outcomeText = '你避开了噼啪作响的电弧球体，安然离开。';
        return { ok: true };
      }
      return { ok: false, reason: '无效的事件选项' };
    }

    case 'moai_head': {
      if (choiceId === 'jump_into_moai') {
        const lostMaxHp = Math.max(
          1,
          Math.floor(state.player.maxHp * (tune.moaiMaxHpLossPct / 100))
        );
        const nextMaxHp = Math.max(25, state.player.maxHp - lostMaxHp);
        const actualLoss = Math.max(0, state.player.maxHp - nextMaxHp);
        state.player.maxHp = nextMaxHp;
        state.player.hp = state.player.maxHp;
        state.eventState.resolved = true;
        state.eventState.outcomeText = `治愈圣光包裹全身：永久失去 ${actualLoss} 点最大生命（上限 ${state.player.maxHp}），但生命值已瞬间回满！`;
        return { ok: true };
      }
      if (choiceId === 'offer_golden_idol') {
        if (!hasRelic(state, 'golden_idol_relic')) {
          return { ok: false, reason: '需要持有事件遗物【黄金神像】' };
        }
        const idx = state.player.relics.indexOf('golden_idol_relic');
        if (idx !== -1) state.player.relics.splice(idx, 1);
        addPlayerGold(state, 333);
        state.eventState.resolved = true;
        state.eventState.outcomeText = '摩艾巨像吞下【黄金神像】，喷涌出整整 333 枚沉甸甸的金币！';
        return { ok: true };
      }
      if (choiceId === 'leave_moai') {
        state.eventState.resolved = true;
        state.eventState.outcomeText = '你向古老巨像微微鞠躬，继续前行。';
        return { ok: true };
      }
      return { ok: false, reason: '无效的事件选项' };
    }

    case 'secret_portal': {
      if (choiceId === 'study_portal') {
        const upgraded = pickDistinct(state, getUpgradableDeckCards(state), 2);
        for (const c of upgraded) {
          c.upgraded = true;
        }
        state.eventState.upgradedCardIds = upgraded.map((c) => c.instanceId);
        let gainedPotionName = '';
        const emptySlot = findEmptyPotionSlot(state);
        if (emptySlot !== -1) {
          const { potions } = getUnlockedPools(state);
          const pid = pickRandom(state, potions);
          if (pid) {
            state.player.potions[emptySlot] = pid;
            gainedPotionName = POTION_LIBRARY[pid]?.name || pid;
          }
        }
        state.eventState.resolved = true;
        const parts = [];
        if (upgraded.length > 0) {
          parts.push(`升级了 ${upgraded.map((c) => `【${getCardStats(c).name}】`).join('、')}`);
        }
        if (gainedPotionName) {
          parts.push(`并凝聚出药水【${gainedPotionName}】`);
        }
        state.eventState.outcomeText =
          parts.length > 0
            ? `星门符文为你揭示奥秘：${parts.join('，')}！`
            : '星门符文熠熠生辉，你的牌组与药水栏均已完备。';
        return { ok: true };
      }
      if (choiceId === 'siphon_portal') {
        if (state.player.hp <= tune.portalSiphonHpLoss) {
          return { ok: false, reason: `当前生命值不足（需大于 ${tune.portalSiphonHpLoss} 点）` };
        }
        state.player.hp -= tune.portalSiphonHpLoss;
        const colorless = getColorlessCardPools();
        const rareCid = pickRandom(state, colorless.rare);
        const added = createCardInstance(state, rareCid, true);
        addCardToMasterDeck(state, added);
        state.eventState.addedCardIds = [added.instanceId];
        const relicId = rollUnownedRelicId(state, 'event');
        if (relicId) grantRelicToPlayer(state, relicId);
        state.eventState.resolved = true;
        state.eventState.outcomeText = relicId
          ? `狂暴星能反噬了你的身体（-${tune.portalSiphonHpLoss} 生命），但你捕获了无色稀有牌【${getCardStats(added).name}】与遗物【${RELIC_LIBRARY[relicId].name}】！`
          : `狂暴星能反噬了你的身体（-${tune.portalSiphonHpLoss} 生命），但你捕获了无色稀有牌【${getCardStats(added).name}】！`;
        return { ok: true };
      }
      if (choiceId === 'leave_portal') {
        state.eventState.resolved = true;
        state.eventState.outcomeText = '你绕开了不稳定的时空裂隙，稳步走向终点。';
        return { ok: true };
      }
      return { ok: false, reason: '无效的事件选项' };
    }

    case 'spire_forge_altar': {
      if (choiceId === 'altar_buy_colorless') {
        if (state.player.gold < tune.forgeAltarGold) {
          return { ok: false, reason: `金币不足（需至少 ${tune.forgeAltarGold} 金币）` };
        }
        state.player.gold -= tune.forgeAltarGold;
        const colorless = getColorlessCardPools();
        const allColorless = [...colorless.uncommon, ...colorless.rare];
        const pickedIds = pickDistinct(state, allColorless, 3);
        state.eventState.libraryChoices = pickedIds.map((cid) =>
          createCardInstance(state, cid, false)
        );
        return { ok: true, pendingLibrary: true };
      }
      if (choiceId === 'altar_transmute_rare') {
        if (state.player.hp <= tune.forgeAltarHpLoss) {
          return { ok: false, reason: `当前生命值不足（需大于 ${tune.forgeAltarHpLoss} 点）` };
        }
        if (state.player.deck.length === 0) {
          return { ok: false, reason: '当前牌组为空' };
        }
        state.eventState.pendingCardAction = 'transform_rare';
        state.eventState.cardActionHpCost = tune.forgeAltarHpLoss;
        return { ok: true, pendingCardAction: 'transform_rare' };
      }
      if (choiceId === 'leave_forge_altar') {
        state.eventState.resolved = true;
        state.eventState.outcomeText = '你离开秘银祭坛，继续攀登尖塔。';
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
  const hpCost = state.eventState.purgeHpCost ?? 0;
  if (hpCost > 0) {
    if (state.player.hp <= hpCost) {
      return { ok: false, reason: `当前生命值不足（需大于 ${hpCost} 点）` };
    }
    state.player.hp -= hpCost;
  }
  const goldCost = state.eventState.purgeGoldCost ?? 0;
  if (goldCost > 0) {
    if (state.player.gold < goldCost) {
      return { ok: false, reason: `金币不足（需至少 ${goldCost} 金币）` };
    }
    state.player.gold -= goldCost;
  }
  const [removed] = state.player.deck.splice(idx, 1);
  const removedStats = getCardStats(removed);
  state.eventState.pendingPurge = false;
  state.eventState.purgeHpCost = 0;
  state.eventState.purgeGoldCost = 0;
  state.eventState.resolved = true;
  state.eventState.outcomeText =
    hpCost > 0
      ? `虔诚献出 ${hpCost} 点生命，石像微光净化移除了【${removedStats.name}】！`
      : goldCost > 0
        ? `花费 ${goldCost} 金币净化移除了【${removedStats.name}】，你的牌组更加精炼了！`
        : `古老秘力化去了【${removedStats.name}】，你的牌组更加精炼了。`;
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
  state.eventState.purgeHpCost = 0;
  state.eventState.purgeGoldCost = 0;
  state.eventState.pendingCardAction = null;
  state.eventState.cardActionHpCost = 0;
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
    state.eventState.cardActionHpCost = 0;
    state.eventState.upgradedCardIds = [target.instanceId];
    state.eventState.resolved = true;
    state.eventState.outcomeText = `活体石墙赐予成长之力，成功升级了【${getCardStats(target).name}】！`;
    return { ok: true, card: target };
  }

  if (mode === 'transform' || mode === 'transform_rare') {
    const hpCost = state.eventState.cardActionHpCost ?? 0;
    if (hpCost > 0) {
      if (state.player.hp <= hpCost) {
        return { ok: false, reason: `当前生命值不足（需大于 ${hpCost} 点）` };
      }
      state.player.hp -= hpCost;
    }
    const oldCard = state.player.deck[idx];
    const oldName = getCardStats(oldCard).name;
    const { cards } = getUnlockedPools(state);
    const rawPool =
      mode === 'transform_rare'
        ? [...cards.rare]
        : [...cards.common, ...cards.uncommon, ...cards.rare];
    const pool = rawPool.filter((cid) => cid !== oldCard.cardId);
    const nextCardId = pickRandom(
      state,
      pool.length > 0 ? pool : mode === 'transform_rare' ? cards.rare : cards.common
    );
    const created = createCardInstance(state, nextCardId, false);
    state.player.deck.splice(idx, 1, created);
    state.eventState.pendingCardAction = null;
    state.eventState.cardActionHpCost = 0;
    state.eventState.addedCardIds = [created.instanceId];
    state.eventState.resolved = true;
    state.eventState.outcomeText =
      mode === 'transform_rare'
        ? hpCost > 0
          ? `献血重铸（-${hpCost} 生命）将【${oldName}】锻造成金色稀有牌【${getCardStats(created).name}】！`
          : `秘术改造重塑了【${oldName}】，定向蜕变为金色稀有牌【${getCardStats(created).name}】！`
        : `石墙秘力重塑了【${oldName}】，蜕变为全新卡牌【${getCardStats(created).name}】！`;
    return { ok: true, card: created };
  }

  return { ok: false, reason: '未知的事件卡牌操作' };
}

export function pickEventLibraryCard(state, instanceId) {
  const choices = state?.eventState?.libraryChoices;
  if (state.screen !== 'event' || !Array.isArray(choices)) {
    return { ok: false, reason: '当前不在选牌阶段' };
  }
  const chosen = choices.find((c) => c.instanceId === instanceId);
  if (!chosen) {
    return { ok: false, reason: '未找到所选卡牌' };
  }
  const added = createCardInstance(state, chosen.cardId, chosen.upgraded);
  addCardToMasterDeck(state, added);
  state.eventState.libraryChoices = null;
  state.eventState.addedCardIds = [added.instanceId];
  state.eventState.resolved = true;
  state.eventState.outcomeText = `你将【${getCardStats(added).name}】收入了牌组！`;
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
    detail: '从初始牌组中自选 1 张卡牌永久强化（如初始核心牌或防御+）。',
  }),
  Object.freeze({
    id: 'choose_card',
    tier: 'small',
    badge: '稳健增益',
    title: '3 选 1 奖励卡牌',
    detail: '从 3 张随机职业卡牌中挑选 1 张加入牌组。',
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
    detail: '从牌组中自选 1 张卡牌，将其随机变化为 1 张非基础职业卡牌。',
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
    detail: '将当前所有空药水栏位装满随机药水，前期迎战强敌底气更足。',
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
  const charDef = getCharacterDef(state?.characterId);
  const starterRelicName = RELIC_LIBRARY[charDef.starterRelic]?.name || charDef.starterRelic;
  const charName = charDef.name;
  const upgradeHint =
    charDef.id === 'silent'
      ? '如中和+ 或 生存者+'
      : charDef.id === 'watcher'
        ? '如暴怒+ 或 警惕+'
        : '如痛击+ 或 防御+';
  const swapPoolCount = getRelicPoolsForCharacter(charDef.id).boss.filter(
    (id) => !RELIC_LIBRARY[id]?.requiresRelic
  ).length;

  const localizeOpt = (raw) => {
    const opt = { ...raw };
    if (opt.id === 'upgrade_1') {
      opt.detail = `从初始牌组中自选 1 张卡牌永久强化（${upgradeHint}）。`;
    } else if (opt.id === 'choose_card') {
      opt.detail = `从 3 张随机${charName}卡牌中挑选 1 张加入牌组。`;
    } else if (opt.id === 'transform_1') {
      opt.detail = `从牌组中自选 1 张卡牌，将其随机变化为 1 张非基础${charName}卡牌。`;
    }
    return opt;
  };

  const opt1 = localizeOpt(pickRandom(state, NEOW_SMALL_POOL));
  const opt2 = localizeOpt(pickRandom(state, NEOW_MEDIUM_POOL));
  const opt3 = localizeOpt(pickRandom(state, NEOW_RISK_POOL));
  const opt4 = {
    ...NEOW_BOSS_SWAP_OPTION,
    title: `放弃【${starterRelicName}】· 换随机首领遗物`,
    detail: `失去初始遗物【${starterRelicName}】，随机获得 1 件【首领遗物】（含金字塔、异蛇之眼、能量遗物等 ${swapPoolCount} 选 1）！`,
  };

  return {
    resolved: false,
    chosenId: null,
    outcomeText: '',
    pendingAction: null,
    options: [opt1, opt2, opt3, opt4],
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
      const { potions } = getUnlockedPools(state);
      const gainedNames = [];
      for (let i = 0; i < state.player.potions.length; i += 1) {
        if (!state.player.potions[i]) {
          const potId = pickRandom(state, potions);
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
      addCardToMasterDeck(state, curseCard);
      state.player.gold += 250;
      neow.resolved = true;
      neow.chosenId = option.id;
      neow.pendingAction = null;
      const curseStats = getCardStats(curseCard);
      neow.outcomeText = `涅奥赐福生效：承受诅咒【${curseStats.name}】（${curseStats.description}），换得 250 金币！`;
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
      const charDef = getCharacterDef(state?.characterId);
      const starterRelicId = charDef.starterRelic;
      const starterRelicName = RELIC_LIBRARY[starterRelicId]?.name || starterRelicId;
      const srIdx = state.player.relics.indexOf(starterRelicId);
      if (srIdx !== -1) {
        state.player.relics.splice(srIdx, 1);
      }
      const { relics } = getUnlockedPools(state);
      const eligibleSwaps = relics.boss.filter(
        (id) => !RELIC_LIBRARY[id]?.requiresRelic && !hasRelic(state, id)
      );
      const swappedId = pickRandom(state, eligibleSwaps);
      if (swappedId) {
        grantRelicToPlayer(state, swappedId);
        const def = RELIC_LIBRARY[swappedId];
        neow.outcomeText = `涅奥换核成功：失去【${starterRelicName}】，获得首领遗物【${def.name}】（${def.description}）`;
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
      const charName = getCharacterDef(state?.characterId).name;
      neow.pendingAction = {
        type: 'transform',
        optionId: option.id,
        title: '鲸鱼赐福 · 选择 1 张卡牌进行变化',
        subtitle: `所选卡牌将随机蜕变为 1 张非基础${charName}卡牌。`,
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
    addCardToMasterDeck(state, added);
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
    const createdStats = getCardStats(created);
    neow.outcomeText = `涅奥赐福生效：【${oldName}】变化为全新卡牌【${createdStats.name}】（${createdStats.description}）！`;
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

