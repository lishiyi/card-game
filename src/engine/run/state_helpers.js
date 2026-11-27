/**
 * Shared run-state primitives: keys, deck/gold mutations, relic & card reward pools,
 * shop pricing/inventory builders, and map traversal helpers.
 */

import {
  canUpgradeCard,
  CARD_LIBRARY,
  createCardInstance,
  CURSE_CARD_IDS,
  getCardCharacter,
  getCardStats,
  getColorlessCardPools,
  getRewardCardPools,
  upgradeCardInstance,
} from '../../data/cards.js';
import { normalizeCharacterId } from '../../data/characters.js';
import { ENCOUNTERS, ENEMY_TEMPLATES } from '../../data/enemies.js';
import { ACT4_TOTAL_FLOORS, TOTAL_FLOORS } from '../../data/events.js';
import {
  CAMPFIRE_RELIC_IDS,
  getAvailablePotionIds,
  getRelicPoolsForCharacter,
  POTION_LIBRARY,
  RELIC_LIBRARY,
  rollWeightedPotionId,
} from '../../data/relics.js';
import { hasRelic } from '../combat.js';
import { hasDailyModifier } from '../daily.js';
import { getLockedContentSets } from '../meta.js';
import {
  nextRandom,
  pickDistinct,
  pickRandom,
  randomInt,
} from '../rng.js';

export const STARTER_POTION_SLOTS = 3;

export function getStarterPotionSlotCount(ascension = 0) {
  return (ascension ?? 0) >= 6 ? 2 : STARTER_POTION_SLOTS;
}

export function ensureRunKeys(state) {
  if (!state) return { ruby: false, emerald: false, sapphire: false };
  if (!state.keys || typeof state.keys !== 'object') {
    state.keys = { ruby: false, emerald: false, sapphire: false };
  }
  state.keys.ruby = Boolean(state.keys.ruby);
  state.keys.emerald = Boolean(state.keys.emerald);
  state.keys.sapphire = Boolean(state.keys.sapphire);
  return state.keys;
}

export function getCollectedKeyCount(state) {
  const k = state?.keys;
  if (!k) return 0;
  return (k.ruby ? 1 : 0) + (k.emerald ? 1 : 0) + (k.sapphire ? 1 : 0);
}

export function hasAllAct4Keys(state) {
  const k = state?.keys;
  return Boolean(k && k.ruby && k.emerald && k.sapphire);
}

export function getActTotalFloors(stateOrAct) {
  const act = typeof stateOrAct === 'number' ? stateOrAct : (stateOrAct?.act ?? 1);
  return act >= 4 ? ACT4_TOTAL_FLOORS : TOTAL_FLOORS;
}


export function addPlayerGold(state, amount) {
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
  const pool =
    act >= 4
      ? ENCOUNTERS.act4Boss
      : act >= 3
        ? ENCOUNTERS.act3Boss
        : act >= 2
          ? ENCOUNTERS.act2Boss
          : ENCOUNTERS.boss;
  const found = pool.find((e) => e.id === state?.bossEncounterId);
  return found || pool[0];
}

export function getCurrentBossName(state) {
  const enc = getCurrentBossEncounter(state);
  const tplId = enc?.enemies?.[0]?.templateId;
  return ENEMY_TEMPLATES[tplId]?.name || enc?.name || '尖塔首领';
}

export function formatRelicUpgradeSummary(pickup) {
  if (!pickup || !pickup.upgradeType) return '';
  const typeLabel =
    pickup.upgradeType === 'attack' ? '攻击' : pickup.upgradeType === 'skill' ? '技能' : '';
  const list = Array.isArray(pickup.upgradedCards) ? pickup.upgradedCards : [];
  if (list.length > 0) {
    return `【${pickup.relicName}】随机永久升级了 ${list.length} 张${typeLabel}牌：${list
      .map((c) => `【${c.name}】`)
      .join('、')}`;
  }
  return `【${pickup.relicName}】生效（当前牌组暂无可升级的${typeLabel}牌）`;
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
  const upgradedCards = [];
  if (def.upgradeOnPickup && Array.isArray(state.player.deck)) {
    const matching = state.player.deck.filter(
      (c) => canUpgradeCard(c) && getCardStats(c).type === def.upgradeOnPickup.type
    );
    const chosen = pickDistinct(state, matching, def.upgradeOnPickup.count ?? 2);
    for (const c of chosen) {
      upgradeCardInstance(c);
      upgradedCards.push({
        instanceId: c.instanceId,
        cardId: c.cardId,
        name: getCardStats(c).name,
      });
    }
  }
  if (relicId === 'smiling_mask' && state.shop && !state.shop.purgeUsed) {
    state.shop.purgeCost = getCurrentPurgeCost(state);
  }
  state._relicPickupSeq = (state._relicPickupSeq || 0) + 1;
  state.lastRelicPickup = {
    seq: state._relicPickupSeq,
    relicId,
    relicName: def.name,
    upgradeType: def.upgradeOnPickup?.type || null,
    upgradedCards,
  };
  return true;
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

export function getUnlockedPools(state) {
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

export function getEliteTierOddsForAct(act = 1) {
  if (act >= 3) {
    return { rare: 0.3, uncommon: 0.45, common: 0.25 };
  }
  if (act >= 2) {
    return { rare: 0.22, uncommon: 0.4, common: 0.38 };
  }
  return { rare: 0.17, uncommon: 0.33, common: 0.5 };
}

export function rollChestProfile(state) {
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

export function rollUnownedRelicId(state, source = 'elite', tierOddsOverride = null, excludeIds = []) {
  const { relics } = getUnlockedPools(state);
  const excludedSet = new Set(Array.isArray(excludeIds) ? excludeIds : []);
  const ownedCampfireCount =
    CAMPFIRE_RELIC_IDS.filter((id) => hasRelic(state, id)).length +
    CAMPFIRE_RELIC_IDS.filter((id) => excludedSet.has(id) && !hasRelic(state, id)).length;
  const unowned = (pool) =>
    Array.isArray(pool)
      ? pool.filter(
          (id) =>
            !hasRelic(state, id) &&
            !excludedSet.has(id) &&
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

export function getShopDiscountMult(state) {
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

export function buildShopState(state) {
  const { cards: unlockedCards } = getUnlockedPools(state);
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

  const charId = state.characterId ?? state.player.characterId ?? 'ironclad';
  const potionId = rollWeightedPotionId(charId, () => nextRandom(state));
  const potionBase = potionId ? Math.round(POTION_LIBRARY[potionId].price * priceMult) : 0;
  const potionOffer = potionId
    ? {
        potionId,
        basePrice: potionBase,
        price: Math.max(1, Math.round(potionBase * discount)),
        sold: false,
      }
    : null;

  // Shop-exclusive Colorless shelf: 2 Uncommon Colorless + 1 Rare Colorless
  const colorlessPools = getColorlessCardPools();
  const colorlessUncommon = pickDistinct(state, colorlessPools.uncommon, 2);
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

export function captureShopSnapshot(state) {
  return structuredClone({
    rngState: state.rngState,
    nextUid: state.nextUid,
    purgeCount: state.purgeCount ?? 0,
    player: state.player,
    shop: state.shop,
    stats: state.stats || {},
    relicCounters: state.relicCounters || {},
    relicFlags: state.relicFlags || {},
    _relicPickupSeq: state._relicPickupSeq || 0,
    lastRelicPickup: state.lastRelicPickup || null,
  });
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

export function findEmptyPotionSlot(state) {
  return state.player.potions.findIndex((p) => p === null);
}

// === Treasure Chest Actions ===

export function getUpgradableDeckCards(state) {
  if (!state?.player?.deck) return [];
  return state.player.deck.filter((c) => canUpgradeCard(c));
}

export function applyCardRemovalSideEffects(state, removedCard) {
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

/**
 * Official STS1 Master-Deck Transform:
 * - Triggers removal side effects (e.g. Parasite -3 Max HP)
 * - Curse -> random different Curse; Colorless -> random different Colorless; Class -> random different Class card (or Rare-only when requested)
 * - Triggers addCardToMasterDeck hooks (Ceramic Fish +9g, Darkstone Periapt +6 Max HP on Curse)
 */
export function transformCardInMasterDeck(state, deckIndex, { rareOnly = false } = {}) {
  const oldCard = state.player.deck[deckIndex];
  const oldDef = CARD_LIBRARY[oldCard.cardId];
  const oldChar = getCardCharacter(oldDef);
  const { cards } = getUnlockedPools(state);

  let rawPool;
  if (rareOnly) {
    rawPool = [...cards.rare];
  } else if (oldDef?.type === 'curse') {
    rawPool = [...CURSE_CARD_IDS];
  } else if (oldChar === 'colorless') {
    const colorless = getColorlessCardPools();
    rawPool = [...colorless.uncommon, ...colorless.rare];
  } else {
    rawPool = [...cards.common, ...cards.uncommon, ...cards.rare];
  }
  const pool = rawPool.filter((cid) => cid !== oldCard.cardId);
  const fallbackPool = rareOnly ? cards.rare : rawPool.length > 0 ? rawPool : cards.common;
  const nextCardId = pickRandom(state, pool.length > 0 ? pool : fallbackPool);

  state.player.deck.splice(deckIndex, 1);
  const removalEffect = applyCardRemovalSideEffects(state, oldCard);
  const created = createCardInstance(state, nextCardId, false);
  addCardToMasterDeck(state, created);
  return { oldCard, created, removalEffect };
}

export function rollUnownedRelicByTier(state, tier) {
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
  const preferred = unowned(relics[tier] || []);
  if (preferred.length > 0) {
    return pickRandom(state, preferred);
  }
  const fallback = unowned(relics.allStandard);
  return fallback.length > 0 ? pickRandom(state, fallback) : null;
}

export function rollDistinctRareCards(state, count = 3) {
  const { cards } = getUnlockedPools(state);
  const pickedIds = pickDistinct(state, cards.rare, count);
  return pickedIds.map((cardId) => createCardInstance(state, cardId, false));
}
