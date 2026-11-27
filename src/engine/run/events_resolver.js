/**
 * Table-driven event option resolution (EVENT_OPTION_HANDLERS) and interactive event
 * deck/library sub-flows.
 */

import {
  canRemoveCard,
  canUpgradeCard,
  createCardInstance,
  getCardStats,
  getColorlessCardPools,
  upgradeCardInstance,
} from '../../data/cards.js';
import { ENCOUNTERS } from '../../data/enemies.js';
import { EVENT_LIBRARY, getEventTuning } from '../../data/events.js';
import { POTION_LIBRARY, RELIC_LIBRARY, rollWeightedPotionId } from '../../data/relics.js';
import { hasRelic, startCombat } from '../combat.js';
import { nextRandom, pickDistinct, pickRandom } from '../rng.js';
import {
  addPlayerGold,
  applyCardRemovalSideEffects,
  playerHasHeavyAttackCard,
  addCardToMasterDeck,
  formatRelicUpgradeSummary,
  grantRelicToPlayer,
  getUnlockedPools,
  rollUnownedRelicId,
  rollRewardCards,
  findEmptyPotionSlot,
  getUpgradableDeckCards,
  rollUnownedRelicByTier,
  transformCardInMasterDeck,
} from './state_helpers.js';
import { transitionCombatVictory } from './combat_flow.js';

/** Tungsten Rod reduces non-zero event HP loss by 1 (STS1 faithful). */
function effectiveEventHpCost(state, rawLoss) {
  const loss = Math.max(0, Math.floor(rawLoss));
  if (loss <= 0) return 0;
  return hasRelic(state, 'tungsten_rod') ? Math.max(0, loss - 1) : loss;
}

function applyEventHpLoss(state, rawLoss) {
  const actual = effectiveEventHpCost(state, rawLoss);
  if (actual > 0) {
    state.player.hp = Math.max(0, state.player.hp - actual);
  }
  return actual;
}

/** Clamped Max HP % loss that never increases maxHp when already below minFloor. */
function applyEventMaxHpPctLoss(state, pct, minFloor = 1) {
  const lost = Math.max(1, Math.floor(state.player.maxHp * (pct / 100)));
  const nextMaxHp = Math.min(state.player.maxHp, Math.max(minFloor, state.player.maxHp - lost));
  const actualLoss = Math.max(0, state.player.maxHp - nextMaxHp);
  state.player.maxHp = nextMaxHp;
  state.player.hp = Math.min(state.player.maxHp, state.player.hp);
  return actualLoss;
}

export function upgradeRandomCardsInEvent(state, count) {
  const upgradable = getUpgradableDeckCards(state);
  const chosen = pickDistinct(state, upgradable, count);
  for (const c of chosen) {
    upgradeCardInstance(c);
  }
  state.eventState.upgradedCardIds = chosen.map((c) => c.instanceId);
  const names = chosen.map((c) => `【${getCardStats(c).name}】`).join('、');
  return { chosen, names };
}

export function chooseEventOption(state, choiceId) {
  const prevSeq = state?._relicPickupSeq || 0;
  const res = chooseEventOptionCore(state, choiceId);
  if (
    res?.ok &&
    (state._relicPickupSeq || 0) > prevSeq &&
    state.lastRelicPickup?.upgradeType
  ) {
    const pickup = state.lastRelicPickup;
    const summary = formatRelicUpgradeSummary(pickup);
    if (state.eventState) {
      if (summary) {
        state.eventState.outcomeText = state.eventState.outcomeText
          ? `${state.eventState.outcomeText} ${summary}！`
          : `${summary}！`;
      }
      if (Array.isArray(pickup.upgradedCards) && pickup.upgradedCards.length > 0) {
        const existing = Array.isArray(state.eventState.upgradedCardIds)
          ? state.eventState.upgradedCardIds
          : [];
        state.eventState.upgradedCardIds = [
          ...new Set([...existing, ...pickup.upgradedCards.map((c) => c.instanceId)]),
        ];
      }
    }
    return { ...res, upgradedCards: pickup.upgradedCards || [] };
  }
  return res;
}

const EVENT_OPTION_HANDLERS = {
  shining_light(state, choiceId, tune) {
  if (choiceId === 'enter_light') {
    const effHp = effectiveEventHpCost(state, tune.shiningLightHpLoss);
    if (state.player.hp <= effHp) {
      return { ok: false, reason: `当前生命值不足（需大于 ${effHp} 点）` };
    }
    const lost = applyEventHpLoss(state, tune.shiningLightHpLoss);
    const { chosen, names } = upgradeRandomCardsInEvent(state, 2);
    state.eventState.resolved = true;
    state.eventState.outcomeText =
      chosen.length > 0
        ? `失去 ${lost} 点生命，成功升级了 ${chosen.length} 张卡牌：${names}！`
        : `失去 ${lost} 点生命，但当前牌组中已没有可升级的卡牌。`;
    return { ok: true };
  }
  if (choiceId === 'leave') {
    state.eventState.resolved = true;
    state.eventState.outcomeText = '你绕开了炽白光束，稳步向更高层进发。';
    return { ok: true };
  }
  return { ok: false, reason: '无效的事件选项' };
  },

  ancient_forge(state, choiceId, tune) {
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
    const effHp = effectiveEventHpCost(state, tune.forgeOverclockHpLoss);
    if (state.player.hp <= effHp) {
      return { ok: false, reason: `当前生命值不足（需大于 ${effHp} 点）` };
    }
    if (state.player.gold < tune.forgeOverclockGold) {
      return { ok: false, reason: `金币不足（需至少 ${tune.forgeOverclockGold} 金币）` };
    }
    const lost = applyEventHpLoss(state, tune.forgeOverclockHpLoss);
    state.player.gold -= tune.forgeOverclockGold;
    const { chosen, names } = upgradeRandomCardsInEvent(state, 2);
    state.eventState.resolved = true;
    state.eventState.outcomeText =
      chosen.length > 0
        ? `失去 ${lost} 点生命并花费 ${tune.forgeOverclockGold} 金币，成功升级了 ${chosen.length} 张卡牌：${names}！`
        : `失去 ${lost} 点生命并花费 ${tune.forgeOverclockGold} 金币，但当前牌组中已没有可升级的卡牌。`;
    return { ok: true };
  }
  if (choiceId === 'scavenge_slag') {
    addPlayerGold(state, tune.forgeScavengeGold);
    state.eventState.resolved = true;
    state.eventState.outcomeText = `你拾取了锻台旁的精铁锭，获得 ${tune.forgeScavengeGold} 金币。`;
    return { ok: true };
  }
  return { ok: false, reason: '无效的事件选项' };
  },

  ancient_shrine(state, choiceId, tune) {
  if (choiceId === 'pray_purge') {
    if (state.player.deck.length <= 1) {
      return { ok: false, reason: '牌组至少需要保留 1 张卡牌' };
    }
    if (!state.player.deck.some((c) => canRemoveCard(c))) {
      return { ok: false, reason: '牌组中没有可移除的卡牌' };
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
  },

  thorn_reliquary(state, choiceId, tune) {
  if (choiceId === 'open_reliquary') {
    const effHp = effectiveEventHpCost(state, tune.thornOpenHpLoss);
    if (state.player.hp <= effHp) {
      return { ok: false, reason: `当前生命值不足（需大于 ${effHp} 点）` };
    }
    const lost = applyEventHpLoss(state, tune.thornOpenHpLoss);
    const relicId = rollUnownedRelicId(state, 'event');
    if (relicId) {
      grantRelicToPlayer(state, relicId);
      state.eventState.outcomeText = `你忍痛扯断铁刺（-${lost} 生命），获得了遗物【${RELIC_LIBRARY[relicId].name}】！`;
    } else {
      addPlayerGold(state, 80);
      state.eventState.outcomeText = `秘匣中已无新遗物，你取出了底层封存的 80 金币（-${lost} 生命）。`;
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
  },

  golden_idol(state, choiceId, tune) {
  if (choiceId === 'smash_trap') {
    const effHp = effectiveEventHpCost(state, tune.idolSmashHpLoss);
    if (state.player.hp <= effHp) {
      return { ok: false, reason: `当前生命值不足（需大于 ${effHp} 点）` };
    }
    const lost = applyEventHpLoss(state, tune.idolSmashHpLoss);
    addPlayerGold(state, tune.idolSmashGold);
    const gotIdol = grantRelicToPlayer(state, 'golden_idol_relic');
    state.eventState.resolved = true;
    state.eventState.outcomeText = gotIdol
      ? `你夺下纯金神像冲出滚石通道（-${lost} 生命），获得 ${tune.idolSmashGold} 金币与事件遗物【金神像】！`
      : `你夺下纯金神像冲出滚石通道（-${lost} 生命），获得 ${tune.idolSmashGold} 金币！`;
    return { ok: true };
  }
  if (choiceId === 'accept_curse_gold') {
    addPlayerGold(state, tune.idolCurseGold);
    const curse = createCardInstance(state, 'regret', false);
    addCardToMasterDeck(state, curse);
    state.eventState.addedCardIds = [curse.instanceId];
    state.eventState.resolved = true;
    state.eventState.outcomeText = `你收下厚重金币（+${tune.idolCurseGold} 金币），但暗影诅咒【悔恨】缠上了你的牌组！`;
    return { ok: true };
  }
  if (choiceId === 'leave_idol') {
    state.eventState.resolved = true;
    state.eventState.outcomeText = '你压下贪念绕开机关基座，平安离开。';
    return { ok: true };
  }
  return { ok: false, reason: '无效的事件选项' };
  },

  living_wall(state, choiceId, tune) {
  const canForget =
    state.player.deck.length > 1 && state.player.deck.some((c) => canRemoveCard(c));
  const canChange = state.player.deck.some((c) => canRemoveCard(c));
  const canGrow = getUpgradableDeckCards(state).length > 0;
  if (!canForget && !canChange && !canGrow) {
    if (choiceId === 'wall_forget' || choiceId === 'wall_change' || choiceId === 'wall_grow') {
      state.eventState.resolved = true;
      state.eventState.outcomeText =
        '石墙面孔沉默审视着你的牌组——既无可移除或变化之牌，也无可升级之牌，便默默放你通行。';
      return { ok: true };
    }
  }
  if (choiceId === 'wall_forget') {
    if (!canForget) {
      return {
        ok: false,
        reason:
          state.player.deck.length <= 1
            ? '牌组至少需要保留 1 张卡牌'
            : '牌组中没有可移除的卡牌',
      };
    }
    state.eventState.pendingPurge = true;
    return { ok: true, pendingPurge: true };
  }
  if (choiceId === 'wall_change') {
    if (!canChange) {
      return { ok: false, reason: '牌组中没有可变化的卡牌' };
    }
    state.eventState.pendingCardAction = 'transform';
    return { ok: true, pendingCardAction: 'transform' };
  }
  if (choiceId === 'wall_grow') {
    if (!canGrow) {
      return { ok: false, reason: '当前牌组中没有可升级的卡牌' };
    }
    state.eventState.pendingCardAction = 'upgrade';
    return { ok: true, pendingCardAction: 'upgrade' };
  }
  return { ok: false, reason: '无效的事件选项' };
  },

  cursed_tome(state, choiceId, tune) {
  const { cards } = getUnlockedPools(state);
  if (choiceId === 'read_final_chapter') {
    const effHp = effectiveEventHpCost(state, tune.tomeFinalHpLoss);
    if (state.player.hp <= effHp) {
      return { ok: false, reason: `当前生命值不足（需大于 ${effHp} 点）` };
    }
    const lost = applyEventHpLoss(state, tune.tomeFinalHpLoss);
    const gotEnchiridion = grantRelicToPlayer(state, 'enchiridion');
    if (gotEnchiridion) {
      state.eventState.resolved = true;
      state.eventState.outcomeText = `鲜血浸透书页（-${lost} 生命），你领悟并收获了事件遗物【${RELIC_LIBRARY.enchiridion.name}】！`;
      return { ok: true };
    }
    const cardId = pickRandom(state, cards.rare);
    const created = createCardInstance(state, cardId, false);
    addCardToMasterDeck(state, created);
    state.eventState.addedCardIds = [created.instanceId];
    state.eventState.resolved = true;
    state.eventState.outcomeText = `鲜血浸透书页（-${lost} 生命），你已持有【${RELIC_LIBRARY.enchiridion.name}】，转而领悟稀有战技【${getCardStats(created).name}】！`;
    return { ok: true };
  }
  if (choiceId === 'skim_preface') {
    const effHp = effectiveEventHpCost(state, tune.tomeSkimHpLoss);
    if (state.player.hp <= effHp) {
      return { ok: false, reason: `当前生命值不足（需大于 ${effHp} 点）` };
    }
    const lost = applyEventHpLoss(state, tune.tomeSkimHpLoss);
    const cardId = pickRandom(state, cards.uncommon);
    const created = createCardInstance(state, cardId, false);
    addCardToMasterDeck(state, created);
    state.eventState.addedCardIds = [created.instanceId];
    state.eventState.resolved = true;
    state.eventState.outcomeText = `你强忍魔典反噬（-${lost} 生命），习得了罕见卡牌【${getCardStats(created).name}】！`;
    return { ok: true };
  }
  if (choiceId === 'embrace_necronomicurse') {
    const effHp = effectiveEventHpCost(state, tune.tomeNecroHpLoss);
    if (state.player.hp <= effHp) {
      return { ok: false, reason: `当前生命值不足（需大于 ${effHp} 点）` };
    }
    const lost = applyEventHpLoss(state, tune.tomeNecroHpLoss);
    const relicId = rollUnownedRelicByTier(state, 'rare');
    if (relicId) {
      grantRelicToPlayer(state, relicId);
    } else {
      addPlayerGold(state, 100);
    }
    const rareId = pickRandom(state, cards.rare);
    const created = createCardInstance(state, rareId, false);
    addCardToMasterDeck(state, created);
    const curse = createCardInstance(state, 'necronomicurse', false);
    addCardToMasterDeck(state, curse);
    state.eventState.addedCardIds = [created.instanceId, curse.instanceId];
    state.eventState.resolved = true;
    const lootText = relicId ? `稀有遗物【${RELIC_LIBRARY[relicId].name}】` : '100 金币';
    state.eventState.outcomeText = `死灵密卷噬去鲜血（-${lost} 生命），赋予你${lootText}与【${getCardStats(created).name}】，但不可移除的【死灵诅咒】已烙印在牌组中！`;
    return { ok: true };
  }
  if (choiceId === 'close_tome') {
    state.eventState.resolved = true;
    state.eventState.outcomeText = '你合上赤红魔典，稳步向塔顶进发。';
    return { ok: true };
  }
  return { ok: false, reason: '无效的事件选项' };
  },

  potion_alchemist(state, choiceId, tune) {
  if (choiceId === 'buy_potions') {
    if (state.player.gold < tune.alchemistBuyGold) {
      return { ok: false, reason: `金币不足（需至少 ${tune.alchemistBuyGold} 金币）` };
    }
    if (findEmptyPotionSlot(state) === -1) {
      return { ok: false, reason: '药水栏已满，无法购买' };
    }
    state.player.gold -= tune.alchemistBuyGold;
    const gainedNames = [];
    for (let i = 0; i < state.player.potions.length; i += 1) {
      if (state.player.potions[i] === null) {
        const pid = rollWeightedPotionId(state.characterId, () => nextRandom(state));
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
  },

  mushroom_grotto(state, choiceId, tune) {
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
    const effHp = effectiveEventHpCost(state, tune.grottoRedHpLoss);
    if (state.player.hp <= effHp) {
      return { ok: false, reason: `当前生命值不足（需大于 ${effHp} 点）` };
    }
    const lost = applyEventHpLoss(state, tune.grottoRedHpLoss);
    state.player.maxHp += tune.grottoRedMaxHp;
    state.eventState.resolved = true;
    state.eventState.outcomeText = `灼热菌核锤炼了体魄（-${lost} 当前生命），你的最大生命值永久 +${tune.grottoRedMaxHp}！`;
    return { ok: true };
  }
  if (choiceId === 'bypass_grotto') {
    state.eventState.resolved = true;
    state.eventState.outcomeText = '你屏住呼吸穿过了荧光菌丛。';
    return { ok: true };
  }
  return { ok: false, reason: '无效的事件选项' };
  },

  library_sanctum(state, choiceId, tune) {
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
  },

  masked_bandits(state, choiceId, tune) {
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
        { templateId: 'bandit_pointy' },
        { templateId: 'bandit_romeo' },
        { templateId: 'bandit_bear' },
      ],
    };
    state.lastEncounterId = banditsEncounter.id;
    startCombat(state, banditsEncounter, 'normal', transitionCombatVictory);
    return { ok: true, screen: state.screen, startedCombat: true };
  }
  return { ok: false, reason: '无效的事件选项' };
  },

  mind_bloom(state, choiceId, tune) {
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
    const actualMaxLoss = applyEventMaxHpPctLoss(state, tune.mindBloomAwakeMaxHpPct, 25);
    const upgraded = [];
    for (const c of state.player.deck) {
      if (canUpgradeCard(c)) {
        upgradeCardInstance(c);
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
      const c = createCardInstance(state, 'normality', false);
      addCardToMasterDeck(state, c);
      addedIds.push(c.instanceId);
    }
    state.eventState.addedCardIds = addedIds;
    state.eventState.resolved = true;
    state.eventState.outcomeText = `黄金涌入行囊（+${tune.mindBloomRichGold} 金币），但贪婪幻念凝成 2 张【凡庸】沉入你的牌组！`;
    return { ok: true };
  }
  return { ok: false, reason: '无效的事件选项' };
  },

  scrap_ooze(state, choiceId, tune) {
  if (choiceId === 'reach_ooze') {
    const attempts = state.eventState.oozeAttempts ?? 0;
    const rawHpCost = tune.oozeBaseHpLoss + attempts;
    const effHpCost = effectiveEventHpCost(state, rawHpCost);
    const chancePct = Math.min(100, tune.oozeBaseChancePct + attempts * 15);
    if (state.player.hp <= effHpCost) {
      return { ok: false, reason: `当前生命值不足（需大于 ${effHpCost} 点）` };
    }
    const lost = applyEventHpLoss(state, rawHpCost);
    const roll = nextRandom(state) * 100;
    if (roll < chancePct) {
      const relicId = rollUnownedRelicId(state, 'event');
      state.eventState.resolved = true;
      if (relicId) {
        grantRelicToPlayer(state, relicId);
        state.eventState.outcomeText = `忍住酸液灼烧（-${lost} 生命），你终于从软泥深处掏出了遗物【${RELIC_LIBRARY[relicId].name}】！`;
      } else {
        addPlayerGold(state, 90);
        state.eventState.outcomeText = `你从软泥深处掏出了一袋亮晶晶的金币（+90 金币，-${lost} 生命）！`;
      }
      return { ok: true, foundRelic: Boolean(relicId) };
    }
    state.eventState.oozeAttempts = attempts + 1;
    const nextEffCost = effectiveEventHpCost(state, rawHpCost + 1);
    state.eventState.lastAttemptNote = `酸液灼痛了你的手臂（-${lost} 生命），但尚未触到宝物！下次尝试代价 ${nextEffCost} 生命，成功率升至 ${Math.min(100, chancePct + 15)}%。`;
    return { ok: true, foundRelic: false, retryAvailable: true };
  }
  if (choiceId === 'leave_ooze') {
    state.eventState.resolved = true;
    state.eventState.outcomeText = '你收回手掌，果断远离了冒着气泡的废料软泥。';
    return { ok: true };
  }
  return { ok: false, reason: '无效的事件选项' };
  },

  wing_statue(state, choiceId, tune) {
  if (choiceId === 'pray_wing') {
    const effHp = effectiveEventHpCost(state, tune.wingPrayHpLoss);
    if (state.player.hp <= effHp) {
      return { ok: false, reason: `当前生命值不足（需大于 ${effHp} 点）` };
    }
    if (state.player.deck.length <= 1) {
      return { ok: false, reason: '牌组中仅剩 1 张卡牌，无法继续移除' };
    }
    if (!state.player.deck.some((c) => canRemoveCard(c))) {
      return { ok: false, reason: '牌组中没有可移除的卡牌' };
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
  },

  council_of_ghosts(state, choiceId, tune) {
  if (choiceId === 'accept_ghosts') {
    const actualLoss = applyEventMaxHpPctLoss(state, tune.ghostsMaxHpLossPct, 20);
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
  },

  forgotten_altar(state, choiceId, tune) {
  if (choiceId === 'offer_golden_idol') {
    if (!hasRelic(state, 'golden_idol_relic')) {
      return { ok: false, reason: '需要持有事件遗物【金神像】' };
    }
    grantRelicToPlayer(state, 'bloody_idol');
    const before = state.player.hp;
    state.player.hp = state.player.maxHp;
    state.eventState.resolved = true;
    state.eventState.outcomeText = `【金神像】在鲜血祭坛上升华为【鲜血神像】（每次获金回复 5 点生命），并为你回满生命（+${state.player.hp - before}）！`;
    return { ok: true };
  }
  if (choiceId === 'shed_blood_altar') {
    const rawHpCost = Math.max(1, Math.floor(state.player.maxHp * (tune.altarShedHpPct / 100)));
    const effHpCost = effectiveEventHpCost(state, rawHpCost);
    if (state.player.hp <= effHpCost) {
      return { ok: false, reason: `当前生命值不足（需大于 ${effHpCost} 点）` };
    }
    const lost = applyEventHpLoss(state, rawHpCost);
    state.player.maxHp += tune.altarShedMaxHpGain;
    const upgradable = getUpgradableDeckCards(state);
    const chosen = pickRandom(state, upgradable);
    const upgradedIds = [];
    if (chosen) {
      upgradeCardInstance(chosen);
      upgradedIds.push(chosen.instanceId);
    }
    state.eventState.upgradedCardIds = upgradedIds;
    state.eventState.resolved = true;
    state.eventState.outcomeText = chosen
      ? `祭坛畅饮你的鲜血（-${lost} 生命），回报以最大生命 +${tune.altarShedMaxHpGain}，并淬炼升级了【${getCardStats(chosen).name}】！`
      : `祭坛畅饮你的鲜血（-${lost} 生命），回报以最大生命 +${tune.altarShedMaxHpGain}！`;
    return { ok: true };
  }
  if (choiceId === 'desecrate_altar') {
    addPlayerGold(state, tune.altarDesecrateGold);
    const curse = createCardInstance(state, 'decay', false);
    addCardToMasterDeck(state, curse);
    state.eventState.addedCardIds = [curse.instanceId];
    state.eventState.resolved = true;
    state.eventState.outcomeText = `你撬走了祭坛供奉的 ${tune.altarDesecrateGold} 枚金币，但阴冷诅咒【腐朽】缠上了你！`;
    return { ok: true };
  }
  return { ok: false, reason: '无效的事件选项' };
  },

  augmenter(state, choiceId, tune) {
  if (choiceId === 'augment_rare_transform') {
    if (state.player.deck.length === 0 || !state.player.deck.some((c) => canRemoveCard(c))) {
      return { ok: false, reason: '牌组中没有可变化的卡牌' };
    }
    state.eventState.pendingCardAction = 'transform_rare';
    return { ok: true, pendingCardAction: 'transform_rare' };
  }
  if (choiceId === 'augment_serum') {
    const effHp = effectiveEventHpCost(state, tune.augmentSerumHpLoss);
    if (state.player.hp <= effHp) {
      return { ok: false, reason: `当前生命值不足（需大于 ${effHp} 点）` };
    }
    const lost = applyEventHpLoss(state, tune.augmentSerumHpLoss);
    state.player.maxHp += tune.augmentSerumMaxHpGain;
    const { cards } = getUnlockedPools(state);
    const pool = [...cards.uncommon, ...cards.rare];
    const cardId = pickRandom(state, pool.length > 0 ? pool : cards.common);
    const added = createCardInstance(state, cardId, false);
    addCardToMasterDeck(state, added);
    state.eventState.addedCardIds = [added.instanceId];
    state.eventState.resolved = true;
    state.eventState.outcomeText = `血清在血脉中沸腾（-${lost} 生命，最大生命 +${tune.augmentSerumMaxHpGain}），并激发领悟了【${getCardStats(added).name}】！`;
    return { ok: true };
  }
  if (choiceId === 'take_jax') {
    const added = createCardInstance(state, 'jax', false);
    addCardToMasterDeck(state, added);
    state.eventState.addedCardIds = [added.instanceId];
    state.eventState.resolved = true;
    state.eventState.outcomeText = '你接过了闪着荧光的【J.A.X.】针剂，将其收入牌组！';
    return { ok: true };
  }
  if (choiceId === 'augment_leave') {
    state.eventState.resolved = true;
    state.eventState.outcomeText = '你摆手谢绝了改造师的实验邀请，继续前进。';
    return { ok: true };
  }
  return { ok: false, reason: '无效的事件选项' };
  },

  sensory_stone(state, choiceId, tune) {
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
    const effHp = effectiveEventHpCost(state, tune.sensoryRecall2HpLoss);
    if (state.player.hp <= effHp) {
      return { ok: false, reason: `当前生命值不足（需大于 ${effHp} 点）` };
    }
    applyEventHpLoss(state, tune.sensoryRecall2HpLoss);
    const pickedIds = pickDistinct(state, allColorless, 3);
    state.eventState.libraryChoices = pickedIds.map((cid) =>
      createCardInstance(state, cid, true)
    );
    return { ok: true, pendingLibrary: true };
  }
  if (choiceId === 'recall_3') {
    const effHp = effectiveEventHpCost(state, tune.sensoryRecall3HpLoss);
    if (state.player.hp <= effHp) {
      return { ok: false, reason: `当前生命值不足（需大于 ${effHp} 点）` };
    }
    const lost = applyEventHpLoss(state, tune.sensoryRecall3HpLoss);
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
      ? `真相的冲击令你失去 ${lost} 点生命，但你收获了无色稀有牌【${getCardStats(added).name}】与遗物【${RELIC_LIBRARY[relicId].name}】！`
      : `真相的冲击令你失去 ${lost} 点生命，但你收获了无色稀有牌【${getCardStats(added).name}】！`;
    return { ok: true };
  }
  return { ok: false, reason: '无效的事件选项' };
  },

  winding_halls(state, choiceId, tune) {
  if (choiceId === 'embrace_madness') {
    const effHp = effectiveEventHpCost(state, tune.windingMadnessHpLoss);
    if (state.player.hp <= effHp) {
      return { ok: false, reason: `当前生命值不足（需大于 ${effHp} 点）` };
    }
    const lost = applyEventHpLoss(state, tune.windingMadnessHpLoss);
    const addedIds = [];
    for (let i = 0; i < 2; i += 1) {
      const card = createCardInstance(state, 'madness', false);
      addCardToMasterDeck(state, card);
      addedIds.push(card.instanceId);
    }
    state.eventState.addedCardIds = addedIds;
    state.eventState.resolved = true;
    state.eventState.outcomeText = `回廊低语刺痛双耳（-${lost} 生命），灵光乍现间你获得了 2 张【疯狂】！`;
    return { ok: true };
  }
  if (choiceId === 'retrace_steps') {
    const heal = Math.max(1, Math.floor(state.player.maxHp * (tune.windingRetraceHealPct / 100)));
    const before = state.player.hp;
    state.player.hp = Math.min(state.player.maxHp, state.player.hp + heal);
    const curse = createCardInstance(state, 'writhe', false);
    addCardToMasterDeck(state, curse);
    state.eventState.addedCardIds = [curse.instanceId];
    state.eventState.resolved = true;
    state.eventState.outcomeText = `暂歇片刻回复了 ${state.player.hp - before} 点生命，但迷茫化作诅咒【苦恼】渗入了牌组。`;
    return { ok: true };
  }
  if (choiceId === 'push_through_halls') {
    const actualLoss = applyEventMaxHpPctLoss(state, tune.windingPushMaxHpPct, 25);
    state.eventState.resolved = true;
    state.eventState.outcomeText = `你强行破开扭曲石壁冲出回廊，永久失去 ${actualLoss} 点最大生命（上限 ${state.player.maxHp}），未沾染任何诅咒。`;
    return { ok: true };
  }
  return { ok: false, reason: '无效的事件选项' };
  },

  big_fish(state, choiceId, tune) {
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
  },

  cleric(state, choiceId, tune) {
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
    if (!state.player.deck.some((c) => canRemoveCard(c))) {
      return { ok: false, reason: '牌组中没有可移除的卡牌' };
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
  },

  dead_adventurer(state, choiceId, tune) {
  if (choiceId === 'loot_pack') {
    const effHp = effectiveEventHpCost(state, tune.adventurerFailHpLoss);
    if (state.player.hp <= effHp) {
      return { ok: false, reason: `当前生命值不足（需大于 ${effHp} 点）` };
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
      const lost = applyEventHpLoss(state, tune.adventurerFailHpLoss);
      addPlayerGold(state, 55);
      state.eventState.outcomeText = `暗处捕食者骤然扑出！你负伤撤退（-${lost} 生命），顺手抢回了 55 金币。`;
    }
    state.eventState.resolved = true;
    return { ok: true };
  }
  if (choiceId === 'salvage_weapon') {
    const effHp = effectiveEventHpCost(state, tune.adventurerWeaponHpLoss);
    if (state.player.hp <= effHp) {
      return { ok: false, reason: `当前生命值不足（需大于 ${effHp} 点）` };
    }
    const lost = applyEventHpLoss(state, tune.adventurerWeaponHpLoss);
    const upgradable = getUpgradableDeckCards(state);
    const attackUpgradable = upgradable.filter((c) => getCardStats(c).type === 'attack');
    const chosen = pickRandom(
      state,
      attackUpgradable.length > 0 ? attackUpgradable : upgradable
    );
    const upgradedIds = [];
    if (chosen) {
      upgradeCardInstance(chosen);
      upgradedIds.push(chosen.instanceId);
    }
    state.eventState.upgradedCardIds = upgradedIds;
    state.eventState.resolved = true;
    state.eventState.outcomeText = chosen
      ? `你顶着擦伤（-${lost} 生命）磨砺兵刃，永久升级了【${getCardStats(chosen).name}】！`
      : `你顶着擦伤（-${lost} 生命）检查残刃，但你的卡牌已全部满级。`;
    return { ok: true };
  }
  if (choiceId === 'leave_adventurer') {
    state.eventState.resolved = true;
    state.eventState.outcomeText = '你没有惊动阴影中的捕食者，悄然绕道离开。';
    return { ok: true };
  }
  return { ok: false, reason: '无效的事件选项' };
  },

  sssserpent(state, choiceId, tune) {
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
  },

  world_of_goop(state, choiceId, tune) {
  if (choiceId === 'gather_goop_gold') {
    const effHp = effectiveEventHpCost(state, tune.goopHpLoss);
    if (state.player.hp <= effHp) {
      return { ok: false, reason: `当前生命值不足（需大于 ${effHp} 点）` };
    }
    const lost = applyEventHpLoss(state, tune.goopHpLoss);
    addPlayerGold(state, 75);
    state.eventState.resolved = true;
    state.eventState.outcomeText = `酸液灼伤双臂（-${lost} 生命），但你成功捞出了 75 枚金币！`;
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
  },

  the_joust(state, choiceId, tune) {
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
  },

  the_mausoleum(state, choiceId, tune) {
  if (choiceId === 'open_coffin') {
    const relicId = rollUnownedRelicId(state, 'event');
    if (relicId) {
      grantRelicToPlayer(state, relicId);
    } else {
      addPlayerGold(state, 100);
    }
    const cursed = tune.isA8 ? true : nextRandom(state) < 0.5;
    let curseName = '';
    if (cursed) {
      const curse = createCardInstance(state, 'writhe', false);
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
  if (choiceId === 'ring_cursed_bell') {
    const relicId = rollUnownedRelicByTier(state, 'uncommon');
    if (relicId) {
      grantRelicToPlayer(state, relicId);
    } else {
      addPlayerGold(state, 90);
    }
    const { cards } = getUnlockedPools(state);
    const uncId = pickRandom(state, cards.uncommon);
    const uncCard = createCardInstance(state, uncId, false);
    addCardToMasterDeck(state, uncCard);
    const bellCurse = createCardInstance(state, 'curse_of_the_bell', false);
    addCardToMasterDeck(state, bellCurse);
    state.eventState.addedCardIds = [uncCard.instanceId, bellCurse.instanceId];
    state.eventState.resolved = true;
    const lootText = relicId ? `罕见遗物【${RELIC_LIBRARY[relicId].name}】` : '90 金币';
    state.eventState.outcomeText = `铃声震荡陵墓：你收获了${lootText}与【${getCardStats(uncCard).name}】，但也背负了不可移除的【铃铛的诅咒】！`;
    return { ok: true };
  }
  if (choiceId === 'leave_mausoleum') {
    state.eventState.resolved = true;
    state.eventState.outcomeText = '你合掌致意，不惊扰陵墓中的长眠者。';
    return { ok: true };
  }
  return { ok: false, reason: '无效的事件选项' };
  },

  vampires_den(state, choiceId, tune) {
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
      upgradeCardInstance(c);
    }
    state.eventState.upgradedCardIds = picked.map((c) => c.instanceId);
    return picked;
  };

  if (choiceId === 'accept_vampire_pact') {
    const actualLoss = applyEventMaxHpPctLoss(state, tune.vampMaxHpLossPct, 25);
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
      return { ok: false, reason: '需要持有遗物【小血瓶】' };
    }
    const idx = state.player.relics.indexOf('blood_vial');
    if (idx !== -1) state.player.relics.splice(idx, 1);
    state.player.hp = state.player.maxHp;
    const upgraded = upgradeTwoAttacks();
    state.eventState.resolved = true;
    state.eventState.outcomeText =
      upgraded.length > 0
        ? `血族欣然收下【小血瓶】，为你全额回满生命并淬炼升级了 ${upgraded.map((c) => `【${getCardStats(c).name}】`).join('、')}！`
        : '血族欣然收下【小血瓶】，为你全额回满生命！';
    return { ok: true };
  }
  if (choiceId === 'embrace_bites') {
    let costNote = '';
    if (hasRelic(state, 'blood_vial')) {
      const bIdx = state.player.relics.indexOf('blood_vial');
      if (bIdx !== -1) state.player.relics.splice(bIdx, 1);
      costNote = '献出了【小血瓶】';
    } else {
      const actualLoss = applyEventMaxHpPctLoss(state, tune.vampBitesMaxHpLossPct, 25);
      costNote = `永久失去 ${actualLoss} 点最大生命（上限 ${state.player.maxHp}）`;
    }
    const beforeLen = state.player.deck.length;
    state.player.deck = state.player.deck.filter((c) => c.cardId !== 'strike');
    const removedStrikes = beforeLen - state.player.deck.length;
    const biteIds = [];
    for (let i = 0; i < 5; i += 1) {
      const bite = createCardInstance(state, 'bite', false);
      addCardToMasterDeck(state, bite);
      biteIds.push(bite.instanceId);
    }
    state.eventState.addedCardIds = biteIds;
    state.eventState.resolved = true;
    state.eventState.outcomeText = `暗夜初拥降临！你${costNote}，移除了 ${removedStrikes} 张【打击】并获得 5 张【噬咬】！`;
    return { ok: true };
  }
  if (choiceId === 'refuse_vampires') {
    state.eventState.resolved = true;
    state.eventState.outcomeText = '你婉拒了暗夜血族的邀约，平静离开。';
    return { ok: true };
  }
  return { ok: false, reason: '无效的事件选项' };
  },

  the_nest(state, choiceId, tune) {
  if (choiceId === 'join_ritual') {
    const effHp = effectiveEventHpCost(state, tune.nestHpLoss);
    if (state.player.hp <= effHp) {
      return { ok: false, reason: `当前生命值不足（需大于 ${effHp} 点）` };
    }
    const lost = applyEventHpLoss(state, tune.nestHpLoss);
    const dagger = createCardInstance(state, 'ritual_dagger', false);
    addCardToMasterDeck(state, dagger);
    state.eventState.addedCardIds = [dagger.instanceId];
    state.eventState.resolved = true;
    state.eventState.outcomeText = `你随狂信徒高呼“咔咔！”并献出鲜血（-${lost} 生命），获赐特殊卡牌【仪式匕首】！`;
    return { ok: true };
  }
  if (choiceId === 'smash_and_grab') {
    addPlayerGold(state, tune.nestGold);
    state.eventState.resolved = true;
    state.eventState.outcomeText = `趁教徒闭目狂热祷告，你一把抓走祭坛上的 ${tune.nestGold} 枚金币扬长而去！`;
    return { ok: true };
  }
  return { ok: false, reason: '无效的事件选项' };
  },

  beggar_shrine(state, choiceId, tune) {
  if (choiceId === 'give_beggar_gold') {
    if (state.player.gold < tune.beggarPurifyGold) {
      return { ok: false, reason: `金币不足（需至少 ${tune.beggarPurifyGold} 金币）` };
    }
    if (state.player.deck.length <= 1) {
      return { ok: false, reason: '牌组中仅剩 1 张卡牌，无法继续移除' };
    }
    if (!state.player.deck.some((c) => canRemoveCard(c))) {
      return { ok: false, reason: '牌组中没有可移除的卡牌' };
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
  },

  colosseum_trial(state, choiceId, tune) {
  if (choiceId === 'accept_trial') {
    const effHp = effectiveEventHpCost(state, tune.colosseumHpLoss);
    if (state.player.hp <= effHp) {
      return { ok: false, reason: `当前生命值不足（需大于 ${effHp} 点）` };
    }
    const lost = applyEventHpLoss(state, tune.colosseumHpLoss);
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
      ? `你在血腥斗技场中力克强敌（-${lost} 生命），赢得 ${tune.colosseumGold} 金币与遗物【${RELIC_LIBRARY[relicId].name}】！`
      : `你在血腥斗技场中力克强敌（-${lost} 生命），赢得 ${tune.colosseumGold + 100} 金币！`;
    return { ok: true };
  }
  if (choiceId === 'skip_trial') {
    state.eventState.resolved = true;
    state.eventState.outcomeText = '你婉拒了奴隶主的角斗邀约，保存体力继续前进。';
    return { ok: true };
  }
  return { ok: false, reason: '无效的事件选项' };
  },

  tomb_of_red_mask(state, choiceId, tune) {
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
    let relicId = null;
    if (!hasRelic(state, 'red_mask')) {
      state.player.gold = 0;
      grantRelicToPlayer(state, 'red_mask');
      relicId = 'red_mask';
    } else {
      relicId = rollUnownedRelicByTier(state, 'rare');
      if (relicId) {
        state.player.gold = 0;
        grantRelicToPlayer(state, relicId);
      }
    }
    state.eventState.resolved = true;
    state.eventState.outcomeText = relicId
      ? `你将全部 ${paid} 枚金币投入祭盘，换得了遗物【${RELIC_LIBRARY[relicId].name}】！`
      : `石像已无更多遗物可赠，便将你的 ${paid} 枚金币原封不动地退还。`;
    return { ok: true };
  }
  if (choiceId === 'leave_red_tomb') {
    state.eventState.resolved = true;
    state.eventState.outcomeText = '你转身离开红面具石棺，继续深入圣殿。';
    return { ok: true };
  }
  return { ok: false, reason: '无效的事件选项' };
  },

  falling_abyss(state, choiceId, tune) {
  if (choiceId === 'land_sacrifice_skill') {
    if (state.player.deck.length <= 1) {
      return { ok: false, reason: '牌组中仅剩 1 张卡牌，无法继续舍弃' };
    }
    const skills = state.player.deck.filter(
      (c) => canRemoveCard(c) && getCardStats(c).type === 'skill'
    );
    if (skills.length === 0) {
      return { ok: false, reason: '牌组中没有可舍弃的技能牌' };
    }
    const victim = pickRandom(state, skills);
    const idx = state.player.deck.findIndex((c) => c.instanceId === victim.instanceId);
    if (idx !== -1) state.player.deck.splice(idx, 1);
    applyCardRemovalSideEffects(state, victim);
    state.eventState.resolved = true;
    state.eventState.outcomeText = `千钧一发之际你舍弃了技能牌【${getCardStats(victim).name}】借力缓冲，毫发无损地平稳着陆！`;
    return { ok: true };
  }
  if (choiceId === 'land_sacrifice_attack') {
    if (state.player.deck.length <= 1) {
      return { ok: false, reason: '牌组中仅剩 1 张卡牌，无法继续舍弃' };
    }
    const attacks = state.player.deck.filter(
      (c) => canRemoveCard(c) && getCardStats(c).type === 'attack'
    );
    if (attacks.length === 0) {
      return { ok: false, reason: '牌组中没有可舍弃的攻击牌' };
    }
    const victim = pickRandom(state, attacks);
    const idx = state.player.deck.findIndex((c) => c.instanceId === victim.instanceId);
    if (idx !== -1) state.player.deck.splice(idx, 1);
    applyCardRemovalSideEffects(state, victim);
    state.eventState.resolved = true;
    state.eventState.outcomeText = `你舍弃了攻击牌【${getCardStats(victim).name}】嵌入石壁减速，毫发无损地落回平台！`;
    return { ok: true };
  }
  if (choiceId === 'brace_fall_impact') {
    const effLoss = effectiveEventHpCost(state, tune.fallingImpactHpLoss);
    const actualLoss = Math.min(Math.max(0, state.player.hp - 1), effLoss);
    state.player.hp -= actualLoss;
    state.eventState.resolved = true;
    state.eventState.outcomeText = `你死死护住所有卡牌硬扛坠地冲击（-${actualLoss} 生命），牌组完整无缺！`;
    return { ok: true };
  }
  return { ok: false, reason: '无效的事件选项' };
  },

  mysterious_sphere(state, choiceId, tune) {
  if (choiceId === 'smash_sphere') {
    const effHp = effectiveEventHpCost(state, tune.sphereHpLoss);
    if (state.player.hp <= effHp) {
      return { ok: false, reason: `当前生命值不足（需大于 ${effHp} 点）` };
    }
    const lost = applyEventHpLoss(state, tune.sphereHpLoss);
    addPlayerGold(state, 55);
    const relicId = rollUnownedRelicByTier(state, 'rare');
    if (relicId) {
      grantRelicToPlayer(state, relicId);
    } else {
      addPlayerGold(state, 120);
    }
    state.eventState.resolved = true;
    state.eventState.outcomeText = relicId
      ? `你顶着守护电弧击碎球壳（-${lost} 生命），夺取了稀有遗物【${RELIC_LIBRARY[relicId].name}】与 55 金币！`
      : `你顶着守护电弧击碎球壳（-${lost} 生命），夺取了 175 金币！`;
    return { ok: true };
  }
  if (choiceId === 'leave_sphere') {
    state.eventState.resolved = true;
    state.eventState.outcomeText = '你避开了噼啪作响的电弧球体，安然离开。';
    return { ok: true };
  }
  return { ok: false, reason: '无效的事件选项' };
  },

  moai_head(state, choiceId, tune) {
  if (choiceId === 'jump_into_moai') {
    const actualLoss = applyEventMaxHpPctLoss(state, tune.moaiMaxHpLossPct, 25);
    state.player.hp = state.player.maxHp;
    state.eventState.resolved = true;
    state.eventState.outcomeText = `治愈圣光包裹全身：永久失去 ${actualLoss} 点最大生命（上限 ${state.player.maxHp}），但生命值已瞬间回满！`;
    return { ok: true };
  }
  if (choiceId === 'offer_golden_idol') {
    if (!hasRelic(state, 'golden_idol_relic')) {
      return { ok: false, reason: '需要持有事件遗物【金神像】' };
    }
    const idx = state.player.relics.indexOf('golden_idol_relic');
    if (idx !== -1) state.player.relics.splice(idx, 1);
    addPlayerGold(state, 333);
    state.eventState.resolved = true;
    state.eventState.outcomeText = '摩艾巨像吞下【金神像】，喷涌出整整 333 枚沉甸甸的金币！';
    return { ok: true };
  }
  if (choiceId === 'leave_moai') {
    state.eventState.resolved = true;
    state.eventState.outcomeText = '你向古老巨像微微鞠躬，继续前行。';
    return { ok: true };
  }
  return { ok: false, reason: '无效的事件选项' };
  },

  secret_portal(state, choiceId, tune) {
  if (choiceId === 'study_portal') {
    const upgraded = pickDistinct(state, getUpgradableDeckCards(state), 1);
    for (const c of upgraded) {
      upgradeCardInstance(c);
    }
    state.eventState.upgradedCardIds = upgraded.map((c) => c.instanceId);
    let gainedPotionName = '';
    const emptySlot = findEmptyPotionSlot(state);
    if (emptySlot !== -1) {
      const pid = rollWeightedPotionId(state.characterId, () => nextRandom(state));
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
    const effHp = effectiveEventHpCost(state, tune.portalSiphonHpLoss);
    if (state.player.hp <= effHp) {
      return { ok: false, reason: `当前生命值不足（需大于 ${effHp} 点）` };
    }
    const lost = applyEventHpLoss(state, tune.portalSiphonHpLoss);
    const colorless = getColorlessCardPools();
    const rareCid = pickRandom(state, colorless.rare);
    const added = createCardInstance(state, rareCid, true);
    addCardToMasterDeck(state, added);
    state.eventState.addedCardIds = [added.instanceId];
    const relicId = rollUnownedRelicId(state, 'event');
    if (relicId) grantRelicToPlayer(state, relicId);
    state.eventState.resolved = true;
    state.eventState.outcomeText = relicId
      ? `狂暴星能反噬了你的身体（-${lost} 生命），但你捕获了无色稀有牌【${getCardStats(added).name}】与遗物【${RELIC_LIBRARY[relicId].name}】！`
      : `狂暴星能反噬了你的身体（-${lost} 生命），但你捕获了无色稀有牌【${getCardStats(added).name}】！`;
    return { ok: true };
  }
  if (choiceId === 'leave_portal') {
    state.eventState.resolved = true;
    state.eventState.outcomeText = '你绕开了不稳定的时空裂隙，稳步走向终点。';
    return { ok: true };
  }
  return { ok: false, reason: '无效的事件选项' };
  },

  spire_forge_altar(state, choiceId, tune) {
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
    const effHp = effectiveEventHpCost(state, tune.forgeAltarHpLoss);
    if (state.player.hp <= effHp) {
      return { ok: false, reason: `当前生命值不足（需大于 ${effHp} 点）` };
    }
    if (state.player.deck.length === 0 || !state.player.deck.some((c) => canRemoveCard(c))) {
      return { ok: false, reason: '牌组中没有可变化的卡牌' };
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
  },
};

export function chooseEventOptionCore(state, choiceId) {
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

  const handler = EVENT_OPTION_HANDLERS[eventDef.id];
  if (handler) {
    return handler(state, choiceId, tune);
  }
  return { ok: false, reason: '未知事件处理' };
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
  if (!canRemoveCard(state.player.deck[idx])) {
    return { ok: false, reason: '该诅咒无法从牌组中移除' };
  }
  const hpCost = state.eventState.purgeHpCost ?? 0;
  let actualHpLost = 0;
  if (hpCost > 0) {
    const effHp = effectiveEventHpCost(state, hpCost);
    if (state.player.hp <= effHp) {
      return { ok: false, reason: `当前生命值不足（需大于 ${effHp} 点）` };
    }
    actualHpLost = applyEventHpLoss(state, hpCost);
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
  const removalEffect = applyCardRemovalSideEffects(state, removed);
  const maxHpNote =
    removalEffect.lostMaxHp > 0 ? `（最大生命 -${removalEffect.lostMaxHp}）` : '';
  state.eventState.pendingPurge = false;
  state.eventState.purgeHpCost = 0;
  state.eventState.purgeGoldCost = 0;
  state.eventState.resolved = true;
  state.eventState.outcomeText =
    hpCost > 0
      ? `虔诚献出 ${actualHpLost} 点生命，石像微光净化移除了【${removedStats.name}】${maxHpNote}！`
      : goldCost > 0
        ? `花费 ${goldCost} 金币净化移除了【${removedStats.name}】${maxHpNote}，你的牌组更加精炼了！`
        : `古老秘力化去了【${removedStats.name}】${maxHpNote}，你的牌组更加精炼了。`;
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
    upgradeCardInstance(target);
    state.eventState.pendingCardAction = null;
    state.eventState.cardActionHpCost = 0;
    state.eventState.upgradedCardIds = [target.instanceId];
    state.eventState.resolved = true;
    state.eventState.outcomeText = `活体石墙赐予成长之力，成功升级了【${getCardStats(target).name}】！`;
    return { ok: true, card: target };
  }

  if (mode === 'transform' || mode === 'transform_rare') {
    const oldCard = state.player.deck[idx];
    if (!canRemoveCard(oldCard)) {
      return { ok: false, reason: '该诅咒无法变化' };
    }
    const hpCost = state.eventState.cardActionHpCost ?? 0;
    let actualHpLost = 0;
    if (hpCost > 0) {
      const effHp = effectiveEventHpCost(state, hpCost);
      if (state.player.hp <= effHp) {
        return { ok: false, reason: `当前生命值不足（需大于 ${effHp} 点）` };
      }
      actualHpLost = applyEventHpLoss(state, hpCost);
    }
    const oldName = getCardStats(oldCard).name;
    const { created, removalEffect } = transformCardInMasterDeck(state, idx, {
      rareOnly: mode === 'transform_rare',
    });
    const maxHpNote =
      removalEffect.lostMaxHp > 0 ? `（最大生命 -${removalEffect.lostMaxHp}）` : '';
    state.eventState.pendingCardAction = null;
    state.eventState.cardActionHpCost = 0;
    state.eventState.addedCardIds = [created.instanceId];
    state.eventState.resolved = true;
    state.eventState.outcomeText =
      mode === 'transform_rare'
        ? hpCost > 0
          ? `献血重铸（-${actualHpLost} 生命）将【${oldName}】${maxHpNote}锻造成金色稀有牌【${getCardStats(created).name}】！`
          : `秘术改造重塑了【${oldName}】${maxHpNote}，定向蜕变为金色稀有牌【${getCardStats(created).name}】！`
        : `石墙秘力重塑了【${oldName}】${maxHpNote}，蜕变为全新卡牌【${getCardStats(created).name}】！`;
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
