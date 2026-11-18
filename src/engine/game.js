import {
  canUpgradeCard,
  CARD_LIBRARY,
  createCardInstance,
  getCardStats,
  REWARD_CARD_POOLS,
  STARTER_DECK_RECIPE,
} from '../data/cards.js';
import { ENCOUNTERS } from '../data/enemies.js';
import { EVENT_IDS, EVENT_LIBRARY, generateSpireMap } from '../data/events.js';
import {
  ALL_POTION_IDS,
  NON_STARTER_RELIC_IDS,
  POTION_LIBRARY,
  RELIC_LIBRARY,
} from '../data/relics.js';
import {
  endPlayerTurn,
  hasRelic,
  playCard,
  restartCombat,
  startCombat,
  usePotion,
} from './combat.js';
import {
  nextRandom,
  normalizeSeed,
  pickDistinct,
  pickRandom,
  randomInt,
} from './rng.js';

export const MAX_POTION_SLOTS = 2;

export function createNewRun(options = {}) {
  const seed = normalizeSeed(options.seed);
  const state = {
    seed,
    rngState: seed,
    nextUid: 1,
    screen: 'map',
    runOutcome: null,
    floor: 0,
    currentNodeId: null,
    lastEncounterId: null,
    visitedEventIds: [],
    player: {
      name: '铁甲战士',
      hp: 80,
      maxHp: 80,
      gold: 99,
      maxEnergy: 3,
      energy: 3,
      block: 0,
      relics: ['burning_blood'],
      potions: ['fire_potion', null],
      deck: [],
      statuses: {},
      skipStatusTick: {},
    },
    map: [],
    combat: null,
    combatSnapshot: null,
    reward: null,
    restState: null,
    shop: null,
    eventState: null,
    stats: {
      floorsCleared: 0,
      combatsWon: 0,
      enemiesSlain: 0,
      cardsPlayed: 0,
    },
  };

  state.player.deck = STARTER_DECK_RECIPE.map((cardId) =>
    createCardInstance(state, cardId, false)
  );
  state.map = generateSpireMap(state);

  return state;
}

export function findMapNode(state, nodeId) {
  if (!state?.map || !nodeId) return null;
  for (const row of state.map) {
    for (const node of row) {
      if (node.id === nodeId) return node;
    }
  }
  return null;
}

export function getAvailableNodeIds(state) {
  if (!state?.map || state.map.length === 0) return [];
  if (!state.currentNodeId) {
    return state.map[0].map((n) => n.id);
  }
  const currentNode = findMapNode(state, state.currentNodeId);
  return currentNode ? [...currentNode.nextIds] : [];
}

function rollUnownedRelicId(state) {
  const candidates = NON_STARTER_RELIC_IDS.filter((id) => !hasRelic(state, id));
  if (candidates.length === 0) return null;
  return pickRandom(state, candidates);
}

function rollRewardCards(state, count = 3, role = 'normal') {
  const chosenCardIds = [];
  const allNonStarter = [
    ...REWARD_CARD_POOLS.common,
    ...REWARD_CARD_POOLS.uncommon,
    ...REWARD_CARD_POOLS.rare,
  ];

  for (let i = 0; i < count; i += 1) {
    const r = nextRandom(state);
    let pool;
    if (role === 'elite') {
      if (r < 0.22) pool = REWARD_CARD_POOLS.rare;
      else if (r < 0.62) pool = REWARD_CARD_POOLS.uncommon;
      else pool = REWARD_CARD_POOLS.common;
    } else {
      if (r < 0.08) pool = REWARD_CARD_POOLS.rare;
      else if (r < 0.38) pool = REWARD_CARD_POOLS.uncommon;
      else pool = REWARD_CARD_POOLS.common;
    }

    const available = pool.filter((id) => !chosenCardIds.includes(id));
    const fallback = allNonStarter.filter((id) => !chosenCardIds.includes(id));
    const pickedId = pickRandom(state, available.length > 0 ? available : fallback);
    if (pickedId) {
      chosenCardIds.push(pickedId);
    }
  }

  return chosenCardIds.map((cardId) => {
    const upgraded = state.floor >= 4 && nextRandom(state) < 0.15;
    return createCardInstance(state, cardId, upgraded);
  });
}

function buildShopState(state) {
  const commonOffers = pickDistinct(state, REWARD_CARD_POOLS.common, 3);
  const uncommonOffer = pickDistinct(state, REWARD_CARD_POOLS.uncommon, 1);
  const rareOffer = pickDistinct(state, REWARD_CARD_POOLS.rare, 1);
  const offerIds = [...commonOffers, ...uncommonOffer, ...rareOffer];
  const saleIndex = randomInt(state, 0, Math.max(0, offerIds.length - 1));

  const cards = offerIds.map((cardId, idx) => {
    const instance = createCardInstance(state, cardId, false);
    const stats = getCardStats(instance);
    const jitter = randomInt(state, -4, 6);
    const basePrice = Math.max(30, stats.price + jitter);
    const onSale = idx === saleIndex;
    return {
      card: instance,
      price: onSale ? Math.floor(basePrice * 0.65) : basePrice,
      onSale,
      sold: false,
    };
  });

  const relicId = rollUnownedRelicId(state);
  const relicOffer = relicId
    ? {
        relicId,
        price: RELIC_LIBRARY[relicId].price + randomInt(state, -8, 8),
        sold: false,
      }
    : null;

  const potionId = pickRandom(state, ALL_POTION_IDS);
  const potionOffer = potionId
    ? {
        potionId,
        price: POTION_LIBRARY[potionId].price,
        sold: false,
      }
    : null;

  return {
    cards,
    relicOffer,
    potionOffer,
    purgeCost: 75,
    purgeUsed: false,
  };
}

export function transitionCombatVictory(state) {
  const role = state.combat?.role ?? 'normal';
  if (role === 'boss') {
    state.screen = 'game_over';
    state.runOutcome = 'victory';
    return;
  }

  const isElite = role === 'elite';
  const gold = isElite ? randomInt(state, 42, 56) : randomInt(state, 24, 35);
  const relicId = isElite ? rollUnownedRelicId(state) : null;
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
  const available = getAvailableNodeIds(state);
  if (!available.includes(nodeId)) {
    return { ok: false, reason: '该节点当前不可前往' };
  }

  const node = findMapNode(state, nodeId);
  if (!node) {
    return { ok: false, reason: '地图节点不存在' };
  }

  node.visited = true;
  state.currentNodeId = node.id;
  state.floor = node.floor;
  state.stats.floorsCleared = (state.stats.floorsCleared ?? 0) + 1;

  switch (node.type) {
    case 'combat': {
      const pool = node.floor === 1 ? ENCOUNTERS.floor1 : ENCOUNTERS.normal;
      const nonRepeat = pool.filter((e) => e.id !== state.lastEncounterId);
      const encounter = pickRandom(state, nonRepeat.length > 0 ? nonRepeat : pool);
      state.lastEncounterId = encounter.id;
      startCombat(state, encounter, 'normal');
      return { ok: true, screen: state.screen };
    }
    case 'elite': {
      const encounter = pickRandom(state, ENCOUNTERS.elite);
      state.lastEncounterId = encounter.id;
      startCombat(state, encounter, 'elite');
      return { ok: true, screen: state.screen };
    }
    case 'boss': {
      const encounter = ENCOUNTERS.boss[0];
      state.lastEncounterId = encounter.id;
      startCombat(state, encounter, 'boss');
      return { ok: true, screen: state.screen };
    }
    case 'rest': {
      state.restState = { completed: false, lastAction: null };
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
        outcomeText: '',
        upgradedCardIds: [],
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
  if (!hasRelic(state, state.reward.relicId)) {
    state.player.relics.push(state.reward.relicId);
  }
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

export function proceedFromReward(state) {
  if (state.screen !== 'reward') {
    return { ok: false, reason: '当前不在战利品界面' };
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
  const healAmount = Math.max(1, Math.floor(state.player.maxHp * 0.3));
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
  if (!hasRelic(state, offer.relicId)) {
    state.player.relics.push(offer.relicId);
  }
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
        const relicId = rollUnownedRelicId(state);
        if (relicId) {
          state.player.relics.push(relicId);
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
  state.eventState.outcomeText = `祭坛微光化去了【${removedStats.name}】，你的牌组更加精炼了。`;
  return { ok: true, removed };
}

export function cancelEventPurge(state) {
  if (state.screen !== 'event' || !state.eventState?.pendingPurge) {
    return { ok: false, reason: '当前没有待取消的操作' };
  }
  state.eventState.pendingPurge = false;
  return { ok: true };
}

export function continueFromEvent(state) {
  if (state.screen !== 'event' || !state.eventState?.resolved || state.eventState.pendingPurge) {
    return { ok: false, reason: '请先完成当前事件抉择' };
  }
  state.eventState = null;
  state.screen = 'map';
  return { ok: true };
}
