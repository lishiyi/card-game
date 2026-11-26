/**
 * Non-combat room handlers: Treasure chests, Boss Altar / Act progression,
 * post-combat Rewards, Campfire actions, and Shop transactions.
 */

import {
  canUpgradeCard,
  CARD_LIBRARY,
  createCardInstance,
  CURSE_CARD_IDS,
  getCardStats,
} from '../../data/cards.js';
import { ENCOUNTERS } from '../../data/enemies.js';
import { generateAct4Map, generateSpireMap } from '../../data/events.js';
import { RELIC_LIBRARY } from '../../data/relics.js';
import { hasRelic } from '../combat.js';
import { hasDailyModifier } from '../daily.js';
import { nextRandom, pickRandom, randomInt } from '../rng.js';
import {
  ensureRunKeys,
  hasAllAct4Keys,
  addPlayerGold,
  addCardToMasterDeck,
  formatRelicUpgradeSummary,
  grantRelicToPlayer,
  rollChestProfile,
  rollUnownedRelicId,
  applyShopMembershipDiscount,
  findEmptyPotionSlot,
  applyCardRemovalSideEffects,
} from './state_helpers.js';

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

  let upgradedCards = [];
  let upgradeSummary = '';
  if (relicId) {
    grantRelicToPlayer(state, relicId);
    if (state.lastRelicPickup?.relicId === relicId && state.lastRelicPickup.upgradeType) {
      upgradedCards = state.lastRelicPickup.upgradedCards || [];
      upgradeSummary = formatRelicUpgradeSummary(state.lastRelicPickup);
    }
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
  if (upgradeSummary) parts.push(upgradeSummary);
  if (gold > 0) parts.push(`获得 ${gold} 金币`);
  if (curseCard) {
    parts.push(`受【诅咒钥匙】影响，牌组加入了诅咒【${getCardStats(curseCard).name}】`);
  }

  ts.opened = true;
  ts.chestTier = chestTier;
  ts.chestLabel = chestLabel;
  ts.relicId = relicId;
  ts.offeredRelicId = relicId;
  ts.choiceResolved = true;
  ts.choicePicked = 'relic';
  ts.sapphireKeyOffered = false;
  ts.gold = gold;
  ts.curseCardId = curseCard?.instanceId ?? null;
  ts.upgradedCardIds = upgradedCards.map((c) => c.instanceId);
  ts.outcomeText = `${chestLabel}开启：${parts.join('，')}！`;

  return { ok: true, chestTier, chestLabel, relicId, gold, curseCard, upgradedCards };
}

export function revealTreasureChest(state) {
  if (state.screen !== 'treasure' || !state.treasureState || state.treasureState.opened) {
    return { ok: false, reason: '当前宝箱已开启或不在宝箱界面' };
  }
  const keys = ensureRunKeys(state);
  if (keys.sapphire || (state.act ?? 1) >= 4) {
    return openTreasureChest(state);
  }
  const ts = state.treasureState;
  const fallbackProfile = ts.chestOdds ? null : rollChestProfile(state);
  const chestTier = ts.chestTier || fallbackProfile.tier;
  const chestLabel = ts.chestLabel || fallbackProfile.label;
  const odds = ts.chestOdds || fallbackProfile.odds;
  const goldRange = ts.chestGoldRange || fallbackProfile.goldRange;
  const goldChance = ts.chestGoldChance ?? fallbackProfile.goldChance;

  const offeredRelicId = rollUnownedRelicId(state, 'treasure', odds);
  const gold = offeredRelicId
    ? nextRandom(state) < goldChance
      ? randomInt(state, goldRange[0], goldRange[1])
      : 0
    : 85;

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
  if (gold > 0) parts.push(`附赠 ${gold} 金币已收入囊中`);
  if (curseCard) {
    parts.push(`受【诅咒钥匙】影响，牌组加入了诅咒【${getCardStats(curseCard).name}】`);
  }
  parts.push('请在【遗物】与【蓝宝石钥匙】之间二选一');

  ts.opened = true;
  ts.chestTier = chestTier;
  ts.chestLabel = chestLabel;
  ts.offeredRelicId = offeredRelicId;
  ts.relicId = null;
  ts.sapphireKeyOffered = true;
  ts.choiceResolved = false;
  ts.choicePicked = null;
  ts.gold = gold;
  ts.curseCardId = curseCard?.instanceId ?? null;
  ts.upgradedCardIds = [];
  ts.outcomeText = `${chestLabel}开启：${parts.join('；')}！`;

  return { ok: true, chestTier, chestLabel, offeredRelicId, gold, curseCard };
}

export function claimTreasureRelic(state) {
  if (state.screen !== 'treasure' || !state.treasureState || !state.treasureState.opened) {
    return { ok: false, reason: '宝箱尚未开启' };
  }
  const ts = state.treasureState;
  if (ts.choiceResolved) {
    return { ok: false, reason: '已做出宝箱抉择' };
  }
  const relicId = ts.offeredRelicId;
  if (!relicId) {
    return { ok: false, reason: '本宝箱没有可拾取的遗物' };
  }
  let upgradedCards = [];
  let upgradeSummary = '';
  grantRelicToPlayer(state, relicId);
  if (state.lastRelicPickup?.relicId === relicId && state.lastRelicPickup.upgradeType) {
    upgradedCards = state.lastRelicPickup.upgradedCards || [];
    upgradeSummary = formatRelicUpgradeSummary(state.lastRelicPickup);
  }
  ts.relicId = relicId;
  ts.choiceResolved = true;
  ts.choicePicked = 'relic';
  ts.upgradedCardIds = upgradedCards.map((c) => c.instanceId);
  ts.outcomeText = `${ts.chestLabel || '远古宝箱'}：已装备遗物【${RELIC_LIBRARY[relicId].name}】${upgradeSummary ? `（${upgradeSummary}）` : ''}，放弃了本宝箱的蓝宝石钥匙。`;
  return { ok: true, relicId, upgradedCards };
}

export function claimTreasureSapphireKey(state) {
  if (state.screen !== 'treasure' || !state.treasureState || !state.treasureState.opened) {
    return { ok: false, reason: '宝箱尚未开启' };
  }
  const ts = state.treasureState;
  if (ts.choiceResolved) {
    return { ok: false, reason: '已做出宝箱抉择' };
  }
  const keys = ensureRunKeys(state);
  if (keys.sapphire) {
    return { ok: false, reason: '已拥有蓝宝石钥匙' };
  }
  keys.sapphire = true;
  ts.relicId = null;
  ts.choiceResolved = true;
  ts.choicePicked = 'sapphire_key';
  const skippedRelicName = ts.offeredRelicId ? RELIC_LIBRARY[ts.offeredRelicId]?.name : '';
  ts.outcomeText = `${ts.chestLabel || '远古宝箱'}：舍弃了${skippedRelicName ? `遗物【${skippedRelicName}】` : '宝箱遗物'}，成功取得【蓝宝石钥匙】！`;
  return { ok: true, key: 'sapphire' };
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
  const nextAct = Math.min(4, (state.act ?? 1) + 1);
  if (nextAct === 4 && !hasAllAct4Keys(state)) {
    return { ok: false, reason: '需要集齐红、绿、蓝三把钥匙才能开启第四幕终末之门' };
  }
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
  if (nextAct === 4) {
    state.map = generateAct4Map();
    state.bossEncounterId = ENCOUNTERS.act4Boss[0].id;
  } else {
    state.map = generateSpireMap(state);
    const bossPool = nextAct >= 3 ? ENCOUNTERS.act3Boss : ENCOUNTERS.act2Boss;
    state.bossEncounterId = pickRandom(state, bossPool).id;
  }
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

export function claimRewardEmeraldKey(state) {
  if (state.screen !== 'reward' || !state.reward) {
    return { ok: false, reason: '当前不在战利品界面' };
  }
  if (!state.reward.emeraldKey || state.reward.emeraldKeyClaimed) {
    return { ok: false, reason: '没有可领取的绿宝石钥匙' };
  }
  ensureRunKeys(state).emerald = true;
  state.reward.emeraldKeyClaimed = true;
  return { ok: true, key: 'emerald' };
}

export function claimRewardRelic(state) {
  if (state.screen !== 'reward' || !state.reward) {
    return { ok: false, reason: '当前不在战利品界面' };
  }
  if (!state.reward.relicClaimed && state.reward.relicId) {
    const relicId = state.reward.relicId;
    grantRelicToPlayer(state, relicId);
    state.reward.relicClaimed = true;
    const pickup = state.lastRelicPickup?.relicId === relicId ? state.lastRelicPickup : null;
    if (pickup?.upgradeType) {
      state.reward.relicUpgradeSummary = formatRelicUpgradeSummary(pickup);
    }
    return {
      ok: true,
      relicId,
      relicName: RELIC_LIBRARY[relicId]?.name || relicId,
      upgradedCards: pickup?.upgradedCards || [],
    };
  }
  if (!state.reward.extraRelicClaimed && state.reward.extraRelicId) {
    const extraRelicId = state.reward.extraRelicId;
    grantRelicToPlayer(state, extraRelicId);
    state.reward.extraRelicClaimed = true;
    const pickup = state.lastRelicPickup?.relicId === extraRelicId ? state.lastRelicPickup : null;
    if (pickup?.upgradeType) {
      state.reward.extraRelicUpgradeSummary = formatRelicUpgradeSummary(pickup);
    }
    return {
      ok: true,
      relicId: extraRelicId,
      relicName: RELIC_LIBRARY[extraRelicId]?.name || extraRelicId,
      upgradedCards: pickup?.upgradedCards || [],
    };
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
  const extraRelicId = state.reward.extraRelicId;
  grantRelicToPlayer(state, extraRelicId);
  state.reward.extraRelicClaimed = true;
  const pickup = state.lastRelicPickup?.relicId === extraRelicId ? state.lastRelicPickup : null;
  if (pickup?.upgradeType) {
    state.reward.extraRelicUpgradeSummary = formatRelicUpgradeSummary(pickup);
  }
  return {
    ok: true,
    relicId: extraRelicId,
    relicName: RELIC_LIBRARY[extraRelicId]?.name || extraRelicId,
    upgradedCards: pickup?.upgradedCards || [],
  };
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
      hasEmeraldKey: false,
      message: '',
    };
  }
  const items = [];
  const hasGold = rw.gold > 0 && !rw.goldClaimed;
  const hasRelic =
    (Boolean(rw.relicId) && !rw.relicClaimed) ||
    (Boolean(rw.extraRelicId) && !rw.extraRelicClaimed);
  const hasEmeraldKey = Boolean(rw.emeraldKey && !rw.emeraldKeyClaimed);
  if (hasGold) {
    items.push(`【${rw.gold} 金币】`);
  }
  if (hasEmeraldKey) {
    items.push('【绿宝石钥匙】');
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
  return { hasUnclaimed, items, hasGold, hasRelic, hasEmeraldKey, message };
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

export function restHeal(state) {
  if (state.screen !== 'rest' || !state.restState || state.restState.completed) {
    return { ok: false, reason: '当前不能在营地休息' };
  }
  if (hasRelic(state, 'coffee_dripper')) {
    return { ok: false, reason: '持有遗物【咖啡滤杯】，无法在篝火营地通过休息回复生命' };
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
  const relicName = RELIC_LIBRARY[relicId]?.name || relicId;
  state.restState.completed = true;
  state.restState.lastAction = `挖掘发现了遗物【${relicName}】`;
  state.reward = {
    source: 'campfire_dig',
    gold: 0,
    goldClaimed: true,
    relicId,
    relicClaimed: false,
    extraRelicId: null,
    extraRelicClaimed: true,
    potionId: null,
    potionClaimed: true,
    cardChoices: [],
    cardClaimed: true,
    pickedCardId: null,
  };
  state.screen = 'reward';
  return { ok: true, relicId, relicName };
}

export function tokeAtCampfire(state, instanceId) {
  if (state.screen !== 'rest' || !state.restState || state.restState.completed) {
    return { ok: false, reason: '当前不能在营地吞云移除卡牌' };
  }
  if (!hasRelic(state, 'peace_pipe')) {
    return { ok: false, reason: '需要持有遗物【宁静烟斗】才能在营地移除卡牌' };
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

export function recallRubyKey(state) {
  if (state.screen !== 'rest' || !state.restState || state.restState.completed) {
    return { ok: false, reason: '当前不能在营地执行召回' };
  }
  const keys = ensureRunKeys(state);
  if (keys.ruby) {
    return { ok: false, reason: '你已经取得【红宝石钥匙】' };
  }
  if ((state.act ?? 1) >= 4) {
    return { ok: false, reason: '当前已在第四幕，无需再次召回' };
  }
  keys.ruby = true;
  state.restState.completed = true;
  state.restState.lastAction = '召回并取得了【红宝石钥匙】';
  state.screen = 'map';
  return { ok: true, key: 'ruby' };
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
  const pickup = state.lastRelicPickup?.relicId === offer.relicId ? state.lastRelicPickup : null;
  return {
    ok: true,
    relicId: offer.relicId,
    relicName: RELIC_LIBRARY[offer.relicId]?.name || offer.relicId,
    upgradedCards: pickup?.upgradedCards || [],
  };
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
  const pickup = state.lastRelicPickup?.relicId === offer.relicId ? state.lastRelicPickup : null;
  return {
    ok: true,
    relicId: offer.relicId,
    relicName: RELIC_LIBRARY[offer.relicId]?.name || offer.relicId,
    upgradedCards: pickup?.upgradedCards || [],
  };
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

export function hasShopChanges(state) {
  if (!state || state.screen !== 'shop' || !state.shop || !state.shopSnapshot) {
    return false;
  }
  const shop = state.shop;
  const snap = state.shopSnapshot;
  if (shop.purgeUsed) return true;
  if (Array.isArray(shop.cards) && shop.cards.some((o) => o.sold)) return true;
  if (Array.isArray(shop.colorlessCards) && shop.colorlessCards.some((o) => o.sold)) return true;
  if (shop.relicOffer?.sold || shop.shopRelicOffer?.sold || shop.potionOffer?.sold) return true;
  if (state.player?.gold !== snap.player?.gold) return true;
  if ((state.player?.deck?.length ?? 0) !== (snap.player?.deck?.length ?? 0)) return true;
  const curPotions = state.player?.potions || [];
  const snapPotions = snap.player?.potions || [];
  if (curPotions.length !== snapPotions.length) return true;
  for (let i = 0; i < curPotions.length; i += 1) {
    if (curPotions[i] !== snapPotions[i]) return true;
  }
  return false;
}

export function resetShop(state) {
  if (!state || state.screen !== 'shop' || !state.shop || !state.shopSnapshot) {
    return { ok: false, reason: '当前没有可恢复的商店状态' };
  }
  if (!hasShopChanges(state)) {
    return { ok: false, reason: '尚未进行任何购买或改动，无需重新购买' };
  }
  const snap = structuredClone(state.shopSnapshot);
  state.rngState = snap.rngState;
  state.nextUid = snap.nextUid;
  state.purgeCount = snap.purgeCount ?? 0;
  state.player = snap.player;
  state.shop = snap.shop;
  state.stats = snap.stats || {};
  if (snap.relicCounters) state.relicCounters = snap.relicCounters;
  if (snap.relicFlags) state.relicFlags = snap.relicFlags;
  state._relicPickupSeq = snap._relicPickupSeq || 0;
  state.lastRelicPickup = snap.lastRelicPickup || null;
  state.screen = 'shop';
  return { ok: true, gold: state.player.gold };
}

export function leaveShop(state) {
  if (state.screen !== 'shop') {
    return { ok: false, reason: '当前不在商店界面' };
  }
  state.shop = null;
  state.shopSnapshot = null;
  state.screen = 'map';
  return { ok: true };
}

// === Event Actions ===
