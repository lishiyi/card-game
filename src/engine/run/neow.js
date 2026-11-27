/**
 * New run bootstrap, Daily Challenge start modifiers, and Floor 0 Neow blessing flow.
 */

import {
  canRemoveCard,
  canUpgradeCard,
  createCardInstance,
  CURSE_CARD_IDS,
  getCardStats,
  getColorlessCardPools,
  upgradeCardInstance,
} from '../../data/cards.js';
import { getCharacterDef, normalizeCharacterId } from '../../data/characters.js';
import { ENCOUNTERS } from '../../data/enemies.js';
import { generateSpireMap } from '../../data/events.js';
import {
  getRelicPoolsForCharacter,
  POTION_LIBRARY,
  RELIC_LIBRARY,
  rollWeightedPotionId,
} from '../../data/relics.js';
import { hasRelic } from '../combat.js';
import { getDailyChallengeSpec, hasDailyModifier } from '../daily.js';
import { MAX_ASCENSION } from '../meta.js';
import { nextRandom, normalizeSeed, pickDistinct, pickRandom } from '../rng.js';
import {
  getStarterPotionSlotCount,
  addPlayerGold,
  addCardToMasterDeck,
  applyCardRemovalSideEffects,
  transformCardInMasterDeck,
  formatRelicUpgradeSummary,
  grantRelicToPlayer,
  hasPendingNeowBlessing,
  getUnlockedPools,
  rollRewardCards,
  getUpgradableDeckCards,
  rollUnownedRelicByTier,
  rollDistinctRareCards,
} from './state_helpers.js';


let nextRunNonce = 1;

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
    detail: '代价：从 10 种随机诅咒（含高危【凡庸】【疼痛】）中加入 1 张进牌组。回报：立即获得 250 金币！',
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

export function generateNeowState(state) {
  const charDef = getCharacterDef(state?.characterId);
  const starterRelicName = RELIC_LIBRARY[charDef.starterRelic]?.name || charDef.starterRelic;
  const charName = charDef.name;
  const upgradeHint =
    charDef.id === 'silent'
      ? '如中和+ 或 生存者+'
      : charDef.id === 'watcher'
        ? '如暴怒+ 或 警惕+'
        : charDef.id === 'defect'
          ? '如电击+ 或 双重释放+'
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
  // Avoid spawning strictly-dominated duplicate rare-card choices together
  const riskCandidates =
    opt2.id === 'choose_rare_card'
      ? NEOW_RISK_POOL.filter((item) => item.id !== 'hp_for_rare_card')
      : NEOW_RISK_POOL;
  const opt3 = localizeOpt(pickRandom(state, riskCandidates));
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
  const prevSeq = state?._relicPickupSeq || 0;
  const res = chooseNeowOptionCore(state, optionId);
  if (
    res?.ok &&
    (state._relicPickupSeq || 0) > prevSeq &&
    state.lastRelicPickup?.upgradeType
  ) {
    const pickup = state.lastRelicPickup;
    const summary = formatRelicUpgradeSummary(pickup);
    if (summary && state.neowState) {
      state.neowState.outcomeText = state.neowState.outcomeText
        ? `${state.neowState.outcomeText}；${summary}！`
        : `${summary}！`;
    }
    return {
      ...res,
      outcomeText: state.neowState?.outcomeText || res.outcomeText,
      upgradedCards: pickup.upgradedCards || [],
    };
  }
  return res;
}

export function chooseNeowOptionCore(state, optionId) {
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
      addPlayerGold(state, 100);
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
        addPlayerGold(state, 100);
        neow.outcomeText = '涅奥赐福生效：普通遗物已集齐，改为获得 100 金币。';
      }
      neow.resolved = true;
      neow.chosenId = option.id;
      neow.pendingAction = null;
      return { ok: true, resolved: true, outcomeText: neow.outcomeText, relicId };
    }

    case 'fill_potions': {
      const charId = state.characterId ?? state.player.characterId ?? 'ironclad';
      const gainedNames = [];
      for (let i = 0; i < state.player.potions.length; i += 1) {
        if (!state.player.potions[i]) {
          const potId = rollWeightedPotionId(charId, () => nextRandom(state));
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
      addPlayerGold(state, 250);
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
        addPlayerGold(state, 220);
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
      const offered = rollRewardCards(state, 3, 'normal', { affectPity: false });
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
      if (state.player.deck.length <= 1 || !state.player.deck.some((c) => canRemoveCard(c))) {
        return { ok: false, reason: '牌组中没有可移除的卡牌' };
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
      const removableCount = state.player.deck.filter((c) => canRemoveCard(c)).length;
      if (state.player.deck.length <= 1 || removableCount === 0) {
        return { ok: false, reason: '牌组中没有可移除的卡牌' };
      }
      const count = Math.min(2, state.player.deck.length - 1, removableCount);
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
      if (!state.player.deck.some((c) => canRemoveCard(c))) {
        return { ok: false, reason: '当前牌组没有可变化的卡牌' };
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
    upgradeCardInstance(card);
    const upgradedName = getCardStats(card).name;
    neow.resolved = true;
    neow.chosenId = action.optionId;
    neow.pendingAction = null;
    neow.outcomeText = `涅奥赐福生效：成功升级了【${upgradedName}】！`;
    return { ok: true, resolved: true, card, outcomeText: neow.outcomeText };
  }

  if (action.type === 'transform') {
    const oldCard = state.player.deck[idx];
    if (!canRemoveCard(oldCard)) {
      return { ok: false, reason: '该诅咒无法变化' };
    }
    const oldName = getCardStats(oldCard).name;
    const { created, removalEffect } = transformCardInMasterDeck(state, idx);
    neow.resolved = true;
    neow.chosenId = action.optionId;
    neow.pendingAction = null;
    const createdStats = getCardStats(created);
    const sideNote =
      removalEffect.lostMaxHp > 0 ? `（失去 ${removalEffect.lostMaxHp} 点最大生命）` : '';
    neow.outcomeText = `涅奥赐福生效：【${oldName}】${sideNote}变化为全新卡牌【${createdStats.name}】（${createdStats.description}）！`;
    return { ok: true, resolved: true, card: created, outcomeText: neow.outcomeText };
  }

  if (action.type === 'remove') {
    if (state.player.deck.length <= 1) {
      return { ok: false, reason: '牌组至少保留 1 张卡牌' };
    }
    if (!canRemoveCard(state.player.deck[idx])) {
      return { ok: false, reason: '该诅咒无法从牌组中移除' };
    }
    if (action.payAllGold && !action.goldPaid) {
      action.lostGold = state.player.gold;
      state.player.gold = 0;
      action.goldPaid = true;
      action.allowCancel = false;
      action.committed = true;
    }
    const [removed] = state.player.deck.splice(idx, 1);
    applyCardRemovalSideEffects(state, removed);
    const removedName = getCardStats(removed).name;
    action.removedNames = [...(action.removedNames || []), removedName];
    action.remaining = Math.max(0, (action.remaining ?? 1) - 1);

    if (
      action.remaining > 0 &&
      state.player.deck.length > 1 &&
      state.player.deck.some((c) => canRemoveCard(c))
    ) {
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

export function applyDailyStartModifiers(state) {
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
      upgradeCardInstance(c);
    }
  }
  if (hasDailyModifier(state, 'cursed_run')) {
    const curseId = pickRandom(state, CURSE_CARD_IDS);
    if (curseId) {
      state.player.deck.push(createCardInstance(state, curseId, false));
    }
  }
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
    keys: { ruby: false, emerald: false, sapphire: false },
    act3Cleared: false,
    heartVictory: false,
    purgeCount: 0,
    rarePityBonus: 0,
    potionDropChance: 40,
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
    shopSnapshot: null,
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
    state.player.deck.push(createCardInstance(state, 'ascenders_bane', false));
  }

  state.map = generateSpireMap(state);
  state.bossEncounterId = pickRandom(state, ENCOUNTERS.boss).id;
  state.neowState = options.skipNeow || dailySpec ? null : generateNeowState(state);

  if (state.dailyChallenge) {
    applyDailyStartModifiers(state);
  }

  return state;
}
