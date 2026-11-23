/**
 * Map node entry, post-combat victory reward generation, and auto-wired combat wrappers.
 */

import { ENCOUNTERS } from '../../data/enemies.js';
import { getEventIdsForAct, TOTAL_FLOORS } from '../../data/events.js';
import { RELIC_LIBRARY } from '../../data/relics.js';
import {
  confirmPendingCardChoice,
  confirmScryChoice,
  discardHandCard,
  endPlayerTurn,
  hasRelic,
  initiateScry,
  playCard,
  reconcileCombatState,
  resolveCardChoice,
  restartCombat,
  startCombat,
  togglePendingCardChoice,
  toggleScryChoice,
  usePotion,
} from '../combat.js';
import { hasDailyModifier } from '../daily.js';
import {
  nextRandom,
  pickDistinct,
  pickRandom,
  randomInt,
} from '../rng.js';
import {
  ensureRunKeys,
  hasAllAct4Keys,
  addPlayerGold,
  getCurrentBossEncounter,
  hasPendingNeowBlessing,
  findMapNode,
  getAvailableNodeIds,
  getUnlockedPools,
  rollChestProfile,
  rollUnownedRelicId,
  rollRewardCards,
  buildShopState,
  rollDistinctRareCards,
} from './state_helpers.js';

export function transitionCombatVictory(state) {
  const role = state.combat?.role ?? 'normal';
  const asc = state.ascension ?? 0;
  const { relics, potions } = getUnlockedPools(state);
  const goldMult =
    (hasDailyModifier(state, 'midas') ? 1.65 : 1) *
    (hasRelic(state, 'golden_idol_relic') ? 1.25 : 1);

  if (role === 'boss') {
    if ((state.act ?? 1) >= 4) {
      state.heartVictory = true;
      state.screen = 'game_over';
      state.runOutcome = 'victory';
      return;
    }

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
      state.act3Cleared = true;
      if (hasAllAct4Keys(state)) {
        state.bossReward = {
          actCleared: 3,
          isAct4Gate: true,
          bossGold: 0,
          cardChoices: [],
          cardClaimed: true,
          pickedCardId: null,
          relicChoices: [],
          pickedRelicId: null,
        };
        state.screen = 'boss_reward';
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
  const dropEmeraldKey = Boolean(state.combat?.isBurningElite && !ensureRunKeys(state).emerald);

  state.reward = {
    role,
    gold,
    goldClaimed: false,
    relicId,
    relicClaimed: !relicId,
    extraRelicId,
    extraRelicClaimed: !extraRelicId,
    emeraldKey: dropEmeraldKey,
    emeraldKeyClaimed: !dropEmeraldKey,
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
        act >= 4
          ? ENCOUNTERS.act4Elite
          : act >= 3
            ? ENCOUNTERS.act3Elite
            : act >= 2
              ? ENCOUNTERS.act2Elite
              : ENCOUNTERS.elite;
      if (!Array.isArray(state.recentEliteIds)) {
        state.recentEliteIds = state.lastEliteId ? [state.lastEliteId] : [];
      }
      const recent2Elites = state.recentEliteIds.slice(-2);
      let eliteCandidates = elitePool.filter((e) => !recent2Elites.includes(e.id));
      if (eliteCandidates.length === 0) {
        eliteCandidates = elitePool.filter((e) => e.id !== state.lastEliteId);
      }
      const baseEncounter = pickRandom(state, eliteCandidates.length > 0 ? eliteCandidates : elitePool);
      const isBurning = Boolean(node.isBurningElite && act <= 3 && !ensureRunKeys(state).emerald);
      const encounter = isBurning
        ? {
            ...baseEncounter,
            name: `🔥 ${baseEncounter.name}（燃烧精英）`,
            isBurningElite: true,
            burningBuff: node.burningBuff || 'strength',
          }
        : baseEncounter;
      state.lastEliteId = baseEncounter.id;
      state.recentEliteIds.push(baseEncounter.id);
      if (state.recentEliteIds.length > 4) {
        state.recentEliteIds = state.recentEliteIds.slice(-4);
      }
      state.lastEncounterId = baseEncounter.id;
      startCombat(state, encounter, 'elite', transitionCombatVictory);
      return { ok: true, screen: state.screen };
    }
    case 'boss': {
      const baseEncounter = getCurrentBossEncounter(state);
      const isA10Act3Twin = (state.act ?? 1) === 3 && (state.ascension ?? 0) >= 10;
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

export function runReconcileCombat(state) {
  return reconcileCombatState(state, transitionCombatVictory);
}
