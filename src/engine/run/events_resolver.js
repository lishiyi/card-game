/**
 * Table-driven event option resolution (EVENT_OPTION_HANDLERS) and interactive event
 * deck/library sub-flows.
 */

import {
  canUpgradeCard,
  CARD_LIBRARY,
  createCardInstance,
  getCardStats,
  getColorlessCardPools,
} from '../../data/cards.js';
import { ENCOUNTERS } from '../../data/enemies.js';
import { EVENT_LIBRARY, getEventTuning } from '../../data/events.js';
import { POTION_LIBRARY, RELIC_LIBRARY } from '../../data/relics.js';
import { hasRelic, startCombat } from '../combat.js';
import { nextRandom, pickDistinct, pickRandom } from '../rng.js';
import {
  addPlayerGold,
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
} from './state_helpers.js';
import { transitionCombatVictory } from './combat_flow.js';

export function upgradeRandomCardsInEvent(state, count) {
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
  },

  ancient_shrine(state, choiceId, tune) {
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
  },

  thorn_reliquary(state, choiceId, tune) {
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
  },

  golden_idol(state, choiceId, tune) {
  if (choiceId === 'smash_trap') {
    if (state.player.hp <= tune.idolSmashHpLoss) {
      return { ok: false, reason: `当前生命值不足（需大于 ${tune.idolSmashHpLoss} 点）` };
    }
    state.player.hp -= tune.idolSmashHpLoss;
    addPlayerGold(state, tune.idolSmashGold);
    const gotIdol = grantRelicToPlayer(state, 'golden_idol_relic');
    state.eventState.resolved = true;
    state.eventState.outcomeText = gotIdol
      ? `你夺下纯金神像冲出滚石通道（-${tune.idolSmashHpLoss} 生命），获得 ${tune.idolSmashGold} 金币与事件遗物【金神像】！`
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
  },

  living_wall(state, choiceId, tune) {
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
  },

  cursed_tome(state, choiceId, tune) {
  const { cards } = getUnlockedPools(state);
  if (choiceId === 'read_final_chapter') {
    if (state.player.hp <= tune.tomeFinalHpLoss) {
      return { ok: false, reason: `当前生命值不足（需大于 ${tune.tomeFinalHpLoss} 点）` };
    }
    state.player.hp -= tune.tomeFinalHpLoss;
    const gotEnchiridion = grantRelicToPlayer(state, 'enchiridion');
    if (gotEnchiridion) {
      state.eventState.resolved = true;
      state.eventState.outcomeText = `鲜血浸透书页（-${tune.tomeFinalHpLoss} 生命），你领悟并收获了事件遗物【${RELIC_LIBRARY.enchiridion.name}】！`;
      return { ok: true };
    }
    const cardId = pickRandom(state, cards.rare);
    const created = createCardInstance(state, cardId, false);
    addCardToMasterDeck(state, created);
    state.eventState.addedCardIds = [created.instanceId];
    state.eventState.resolved = true;
    state.eventState.outcomeText = `鲜血浸透书页（-${tune.tomeFinalHpLoss} 生命），你已持有【${RELIC_LIBRARY.enchiridion.name}】，转而领悟稀有战技【${getCardStats(created).name}】！`;
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
  },

  scrap_ooze(state, choiceId, tune) {
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
  },

  wing_statue(state, choiceId, tune) {
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
  },

  council_of_ghosts(state, choiceId, tune) {
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
  },

  augmenter(state, choiceId, tune) {
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
  },

  winding_halls(state, choiceId, tune) {
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
  if (choiceId === 'refuse_vampires') {
    state.eventState.resolved = true;
    state.eventState.outcomeText = '你婉拒了暗夜血族的邀约，平静离开。';
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
  },

  falling_abyss(state, choiceId, tune) {
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
  },

  mysterious_sphere(state, choiceId, tune) {
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
  },

  moai_head(state, choiceId, tune) {
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
