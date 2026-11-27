/**
 * Reusable smart simulation bot for all 4 Slay the Spire Lite classes
 * (Ironclad, Silent, Watcher, Defect), featuring a dedicated Watcher Stance Planner,
 * Defect Orb/Focus heuristics, smart pending-choice resolution, and class-aware drafting.
 */

import {
  canRemoveCard,
  canUpgradeCard,
  CARD_LIBRARY,
  getCardStats,
  getEffectiveCardCost,
} from '../../src/data/cards.js';
import { POTION_LIBRARY, RELIC_LIBRARY } from '../../src/data/relics.js';
import {
  canPlayCard,
  getOrbOutputValues,
  hasPendingCardChoice,
  hasRelic,
} from '../../src/engine/combat.js';
import { calculateAttackDamage, calculateCardBlock } from '../../src/engine/math.js';
import {
  buyShopCard,
  buyShopPotion,
  buyShopPurge,
  buyShopRelic,
  chooseEventOption,
  chooseNeowOption,
  claimBossRelic,
  claimBossRewardCard,
  claimRewardCard,
  claimRewardExtraRelic,
  claimRewardGold,
  claimRewardPotion,
  claimRewardRelic,
  claimTreasureRelic,
  completeEventCardAction,
  completeEventPurge,
  completeNeowAction,
  continueFromEvent,
  createNewRun,
  findMapNode,
  getAvailableNodeIds,
  getUpgradableDeckCards,
  hasPendingNeowBlessing,
  leaveRestSite,
  leaveShop,
  leaveTreasureRoom,
  liftAtCampfire,
  openTreasureChest,
  pickEventLibraryCard,
  proceedFromReward,
  proceedToNextAct,
  restHeal,
  restUpgradeCard,
  runConfirmPendingCardChoice,
  runConfirmScry,
  runEndTurn,
  runPlayCard,
  runResolveCardChoice,
  runTogglePendingCardChoice,
  runToggleScryCard,
  runUsePotion,
  selectMapNode,
  skipNeowCardOffer,
  tokeAtCampfire,
} from '../../src/engine/game.js';

// === Class Card Value Tables (drafting + upgrade priority) ===

const CARD_DRAFT_SCORES = {
  // Ironclad
  offering: 100,
  feel_no_pain: 94,
  dark_embrace: 92,
  corruption: 90,
  impervious: 90,
  battle_trance: 88,
  shrug_it_off: 86,
  pommel_strike: 84,
  shockwave: 86,
  inflame: 84,
  spot_weakness: 82,
  uppercut: 82,
  flame_barrier: 82,
  immolate: 92,
  whirlwind: 86,
  feed: 88,
  reaper: 86,
  disarm: 84,
  demon_form: 80,
  barricade: 78,
  fiend_fire: 84,
  limit_break: 78,
  true_grit: 80,
  burning_pact: 78,
  power_through: 78,
  second_wind: 80,
  metallicize: 74,
  carnage: 78,
  hemokinesis: 78,
  anger: 74,
  headbutt: 74,
  twin_strike: 70,
  body_slam: 72,
  armaments: 74,
  iron_wave: 66,
  clothesline: 68,
  cleave: 70,
  bludgeon: 76,
  sword_boomerang: 72,
  heavy_blade: 72,
  double_tap: 74,
  blood_for_blood: 76,
  rage: 72,
  seeing_red: 74,
  entrench: 70,
  juggernaut: 70,
  // Silent
  wraith_form: 100,
  adrenaline: 98,
  footwork: 95,
  after_image: 94,
  well_laid_plans: 92,
  corpse_explosion: 94,
  malaise: 90,
  noxious_fumes: 90,
  blade_dance: 90,
  backflip: 86,
  acrobatics: 86,
  leg_sweep: 86,
  crippling_cloud: 88,
  catalyst: 86,
  accuracy: 84,
  piercing_wail: 86,
  deadly_poison: 80,
  bouncing_flask: 82,
  dagger_spray: 80,
  cloak_and_dagger: 80,
  blur: 80,
  dash: 84,
  predator: 82,
  die_die_die: 86,
  glass_knife: 86,
  alchemize: 90,
  burst: 82,
  terror: 82,
  backstab: 80,
  prepared: 74,
  calculated_gamble: 82,
  tactician: 76,
  reflex: 74,
  infinite_blades: 76,
  envenom: 74,
  a_thousand_cuts: 76,
  skewer: 78,
  finisher: 76,
  eviscerate: 76,
  sneaky_strike: 74,
  dodge_and_roll: 74,
  sucker_punch: 74,
  poisoned_stab: 74,
  // Watcher
  tantrum: 98,
  rushdown: 98,
  mental_fortress: 98,
  talk_to_the_hand: 96,
  vault: 96,
  scrawl: 96,
  fear_no_evil: 94,
  inner_peace: 92,
  wallop: 92,
  halt: 90,
  empty_fist: 88,
  empty_mind: 90,
  empty_body: 84,
  cut_through_fate: 90,
  third_eye: 86,
  bowling_bash: 86,
  conclude: 84,
  flurry_of_blows: 84,
  indignation: 84,
  meditate: 86,
  tranquility: 80,
  crescendo: 80,
  lesson_learned: 92,
  omniscience: 88,
  deus_ex_machina: 86,
  simmering_fury: 82,
  prostrate: 76,
  worship: 78,
  pray: 80,
  devotion: 82,
  sanctity: 82,
  protect: 80,
  deceive_reality: 82,
  reach_heaven: 80,
  sands_of_time: 80,
  carve_reality: 78,
  crush_joints: 78,
  sash_whip: 78,
  follow_up: 78,
  flying_sleeves: 76,
  wheel_kick: 80,
  ragnarok: 84,
  spirit_shield: 82,
  like_water: 78,
  nirvana: 74,
  battle_hymn: 74,
  establishment: 78,
  // Defect
  echo_form: 98,
  defragment: 96,
  biased_cog: 96,
  glacier: 96,
  electrodynamics: 94,
  seek: 96,
  coolheaded: 90,
  capacitor: 90,
  loop: 88,
  ball_lightning: 88,
  cold_snap: 84,
  doom_and_gloom: 88,
  self_repair: 90,
  buffer: 88,
  core_surge: 88,
  genetic_algorithm: 86,
  charge_battery: 84,
  equilibrium: 84,
  hologram: 84,
  skim: 84,
  compile_driver: 84,
  chill: 84,
  darkness: 78,
  fusion: 80,
  fission: 88,
  rainbow: 82,
  consume: 82,
  creative_ai: 80,
  machine_learning: 78,
  heatsinks: 78,
  storm: 78,
  static_discharge: 78,
  blizzard: 74,
  sunder: 84,
  streamline: 78,
  ftl: 82,
  go_for_the_eyes: 82,
  sweeping_beam: 78,
  beam_cell: 76,
  bullseye: 76,
  barrage: 80,
  tempest: 78,
  multicast: 80,
  boot_sequence: 84,
  reinforced_body: 84,
  turbo: 80,
  double_energy: 78,
  auto_shields: 76,
  leap: 76,
  // Colorless standouts
  apotheosis: 100,
  master_of_strategy: 95,
  hand_of_greed: 92,
  panacea: 86,
  dark_shackles: 86,
  panic_button: 84,
};

const UPGRADE_PRIORITY = {
  eruption: 120,
  apotheosis: 118,
  zap: 112,
  dualcast: 108,
  defragment: 108,
  biased_cog: 106,
  rushdown: 105,
  mental_fortress: 104,
  talk_to_the_hand: 102,
  tantrum: 102,
  halt: 98,
  wallop: 96,
  empty_fist: 96,
  fear_no_evil: 94,
  inner_peace: 94,
  cut_through_fate: 92,
  vigilance: 86,
  glacier: 100,
  coolheaded: 100,
  fission: 106,
  electrodynamics: 98,
  capacitor: 96,
  loop: 96,
  seek: 104,
  hologram: 96,
  buffer: 98,
  wraith_form: 110,
  noxious_fumes: 102,
  footwork: 102,
  blade_dance: 100,
  catalyst: 104,
  neutralize: 96,
  after_image: 96,
  well_laid_plans: 98,
  accuracy: 96,
  crippling_cloud: 96,
  acrobatics: 94,
  corpse_explosion: 94,
  bash: 94,
  pommel_strike: 96,
  true_grit: 100,
  armaments: 98,
  whirlwind: 98,
  immolate: 100,
  shockwave: 98,
  inflame: 96,
  shrug_it_off: 94,
  feel_no_pain: 98,
  dark_embrace: 98,
  corruption: 98,
  battle_trance: 94,
  flame_barrier: 94,
  offering: 96,
};

const BOSS_RELIC_PRIORITY = {
  ironclad: [
    'cursed_key', 'coffee_dripper', 'fusion_hammer', 'sozu', 'runic_dome',
    'slavers_collar', 'black_blood', 'snecko_eye', 'runic_pyramid', 'philosophers_stone',
    'velvet_choker', 'black_star', 'mark_of_pain', 'ectoplasm', 'sacred_bark',
  ],
  silent: [
    'runic_pyramid', 'cursed_key', 'coffee_dripper', 'fusion_hammer', 'hovering_kite',
    'sozu', 'ring_of_the_serpent', 'slavers_collar', 'philosophers_stone', 'wrist_blade',
    'black_star', 'sacred_bark', 'snecko_eye', 'ectoplasm', 'velvet_choker',
  ],
  watcher: [
    'violet_lotus', 'runic_pyramid', 'cursed_key', 'coffee_dripper', 'fusion_hammer',
    'holy_water', 'sozu', 'slavers_collar', 'philosophers_stone', 'sacred_bark',
    'black_star', 'snecko_eye', 'ectoplasm', 'velvet_choker',
  ],
  defect: [
    'nuclear_battery', 'frozen_core', 'inserter', 'runic_pyramid', 'cursed_key',
    'coffee_dripper', 'fusion_hammer', 'sozu', 'slavers_collar', 'philosophers_stone',
    'snecko_eye', 'black_star', 'sacred_bark', 'velvet_choker', 'ectoplasm',
  ],
};

// === Incoming Damage & End-of-Turn Block Estimation ===

export function estimateEndOfTurnBonusBlock(state, stanceOverride = null) {
  const player = state.player;
  const combat = state.combat;
  if (!player || !combat) return 0;
  const stance = stanceOverride ?? combat.stance ?? 'neutral';
  let bonus = 0;
  bonus += player.statuses?.metallicize ?? 0;
  bonus += player.statuses?.platedArmor ?? 0;
  if (stance === 'calm' && (player.statuses?.likeWater ?? 0) > 0) {
    bonus += player.statuses.likeWater;
  }
  if (hasRelic(state, 'cloak_clasp')) {
    bonus += combat.hand.length;
  }
  // Defect Frost orb end-of-turn passives (+ Gold-Plated Cables on frontmost orb)
  const orbs = Array.isArray(player.orbs) ? player.orbs : [];
  const hasCables = hasRelic(state, 'gold_plated_cables');
  for (let i = 0; i < orbs.length; i += 1) {
    if (orbs[i]?.type === 'frost') {
      const { passive } = getOrbOutputValues(orbs[i], player);
      bonus += passive;
      if (i === 0 && hasCables) bonus += passive;
    }
  }
  if (hasRelic(state, 'orichalcum') && player.block === 0 && bonus === 0) {
    bonus += 6;
  }
  return bonus;
}

export function estimateIncomingDamage(state, stanceOverride = null) {
  const combat = state?.combat;
  const player = state?.player;
  if (!combat || !player) return 0;
  const stance = stanceOverride ?? combat.stance ?? 'neutral';
  const simPlayer = {
    ...player,
    stance,
    statuses: { ...(player.statuses || {}) },
  };
  let bufferLeft = player.statuses?.buffer ?? 0;
  const intangible = (player.statuses?.intangible ?? 0) > 0;
  const hasTorii = hasRelic(state, 'torii');
  const hasRod = hasRelic(state, 'tungsten_rod');
  let blockLeft = (player.block ?? 0) + estimateEndOfTurnBonusBlock(state, stance);
  let totalHpLoss = 0;

  for (const enemy of combat.enemies) {
    if (!enemy || enemy.hp <= 0) continue;
    // If enemy will die to Poison before acting, skip its attack!
    if ((enemy.statuses?.poison ?? 0) >= enemy.hp) continue;
    const intent = enemy.intent;
    if (!intent || typeof intent.damage !== 'number' || intent.damage <= 0) continue;
    if (intent.type !== 'attack' && intent.type !== 'attack_debuff' && intent.type !== 'attack_buff' && intent.type !== 'attack_defend') {
      continue;
    }
    const hits = Math.max(1, intent.hits ?? 1);
    const perHit = intent.isNonAttack
      ? intent.damage
      : calculateAttackDamage(intent.damage, enemy, simPlayer);

    for (let h = 0; h < hits; h += 1) {
      let dmg = perHit;
      if (intangible && dmg > 1) dmg = 1;
      let hpHit = 0;
      if (blockLeft >= dmg) {
        blockLeft -= dmg;
      } else {
        hpHit = dmg - blockLeft;
        blockLeft = 0;
      }
      if (hpHit > 0 && bufferLeft > 0) {
        bufferLeft -= 1;
        hpHit = 0;
      }
      if (hpHit > 0 && hasTorii && !intent.isNonAttack && hpHit >= 2 && hpHit <= 5) {
        hpHit = 1;
      }
      if (hpHit > 0 && hasRod) {
        hpHit = Math.max(0, hpHit - 1);
      }
      totalHpLoss += hpHit;
    }
  }
  return totalHpLoss;
}

function getEffectiveHpRemaining(enemy) {
  if (!enemy || enemy.hp <= 0) return 0;
  const poison = enemy.statuses?.poison ?? 0;
  const effectiveHp = Math.max(0, enemy.hp - poison);
  return effectiveHp + (enemy.block ?? 0);
}

function estimateCardDirectDamage(state, cardInstance, targetEnemy, stanceOverride = null) {
  const stats = getCardStats(cardInstance);
  if (!stats || stats.type !== 'attack') return 0;
  const simPlayer = {
    ...state.player,
    stance: stanceOverride ?? state.combat?.stance ?? 'neutral',
  };
  let baseDmg = stats.damage ?? 0;
  if (stats.damageFromBlock) baseDmg = state.player.block ?? 0;
  if (stats.damagePerOrb) baseDmg = (state.player.orbs?.length ?? 0) * stats.damagePerOrb;
  if (baseDmg <= 0) return 0;
  const hits = stats.xCost
    ? Math.max(0, state.player.energy + (hasRelic(state, 'chemical_x') ? 2 : 0))
    : Math.max(1, stats.hits ?? 1);
  if (stats.target === 'all') {
    let sum = 0;
    for (const e of state.combat.enemies) {
      if (e.hp <= 0) continue;
      sum += calculateAttackDamage(baseDmg, simPlayer, e) * hits;
    }
    return sum;
  }
  return calculateAttackDamage(baseDmg, simPlayer, targetEnemy) * hits;
}

// === Watcher Stance Planner ===

function isWrathExitCard(stats, enemiesAttacking) {
  if (!stats) return false;
  if (stats.enterStance === 'calm') return true;
  if (stats.exitStance) return true;
  if (stats.enterCalmIfAttacking && enemiesAttacking) return true;
  if (stats.endTurnEnterCalm) return true; // Meditate
  if (stats.enterStance === 'divinity') return true;
  return false;
}

function getStanceTransitionEnergyDelta(state, stats, enemiesAttacking) {
  const cur = state.combat?.stance || 'neutral';
  let next = cur;
  if (stats.enterStance) next = stats.enterStance;
  else if (stats.exitStance) next = 'neutral';
  else if (stats.enterCalmIfAttacking && enemiesAttacking) next = 'calm';
  else if (stats.endTurnEnterCalm) next = 'calm';
  else if ((state.player.statuses?.mantra ?? 0) + (stats.gainMantra ?? 0) >= 10) next = 'divinity';

  let delta = 0;
  if (cur === 'calm' && next !== 'calm') {
    delta += hasRelic(state, 'violet_lotus') ? 3 : 2;
  }
  if (next === 'divinity' && cur !== 'divinity') {
    delta += 3;
  }
  return { nextStance: next, energyDelta: delta };
}

/**
 * Estimates whether the player can lethal ALL remaining alive enemies this turn
 * if they enter `targetStance` by playing `triggerCard` right now.
 */
function canLethalAfterCard(state, triggerCard, targetEnemy, targetStance, energyAfterTrigger) {
  const alive = state.combat.enemies.filter((e) => e.hp > 0);
  if (alive.length === 0) return true;
  const totalEffHp = alive.reduce((acc, e) => acc + getEffectiveHpRemaining(e), 0);
  // Don't claim lethal against multi-phase Awakened One P1 or Darkling solo
  if (alive.some((e) => e.templateId === 'awakened_one' && e.awakenedPhase === 1)) {
    return false;
  }

  let totalBurst = estimateCardDirectDamage(state, triggerCard, targetEnemy, targetStance);
  let remainingEnergy = energyAfterTrigger;
  const otherAttacks = [];
  for (const c of state.combat.hand) {
    if (c.instanceId === triggerCard.instanceId) continue;
    const st = getCardStats(c);
    if (!st) continue;
    if (st.gainEnergy && getEffectiveCardCost(c, state.player, state.combat) === 0) {
      remainingEnergy += st.gainEnergy;
      continue;
    }
    if (st.type !== 'attack') continue;
    const cost = getEffectiveCardCost(c, state.player, state.combat);
    if (cost < 0) continue;
    const dmg = estimateCardDirectDamage(state, c, targetEnemy, targetStance);
    if (dmg > 0) {
      otherAttacks.push({ cost, dmg, ratio: dmg / Math.max(0.5, cost) });
    }
  }
  otherAttacks.sort((a, b) => b.ratio - a.ratio);
  for (const atk of otherAttacks) {
    if (atk.cost <= remainingEnergy) {
      remainingEnergy -= atk.cost;
      totalBurst += atk.dmg;
    }
  }
  return totalBurst >= totalEffHp;
}

/**
 * Checks whether an affordable Wrath-exit card exists in hand AFTER playing `entryCard`.
 */
function hasAffordableWrathExitInHand(state, entryCard, energyAfterEntry, enemiesAttacking) {
  for (const c of state.combat.hand) {
    if (c.instanceId === entryCard.instanceId) continue;
    const st = getCardStats(c);
    if (!isWrathExitCard(st, enemiesAttacking)) continue;
    const cost = getEffectiveCardCost(c, state.player, state.combat);
    if (cost >= 0 && cost <= energyAfterEntry) {
      return true;
    }
  }
  // Check Stance Potion / Ambrosia in potion belt as backup exit
  if (state.player.potions?.some((p) => p === 'stance_potion' || p === 'ambrosia')) {
    return true;
  }
  return false;
}

// === Pending Choice Resolver ===

function resolvePendingChoices(state) {
  let guard = 0;
  while (hasPendingCardChoice(state.combat) && guard < 16) {
    guard += 1;
    const pending = state.combat.pendingCardChoice;
    if (!pending) break;

    if (pending.mode === 'scry') {
      const candidates = pending.candidates || pending.cards || [];
      for (const c of candidates) {
        const st = getCardStats(c);
        const shouldDiscard =
          st.type === 'curse' ||
          st.type === 'status' ||
          (!c.upgraded && (c.cardId === 'strike' || (c.cardId === 'defend' && state.combat.turn > 1)));
        if (shouldDiscard) {
          runToggleScryCard(state, c.instanceId);
        }
      }
      runConfirmScry(state);
      continue;
    }

    if (pending.mode === 'wish') {
      const opt =
        (pending.options && pending.options[0]?.id) ||
        (state.combat.encounterType === 'boss' ? 'strength' : 'plated_armor');
      const r = runResolveCardChoice(state, opt);
      if (!r?.ok) break;
      continue;
    }

    const pool = Array.isArray(pending.candidates) && pending.candidates.length > 0
      ? pending.candidates
      : Array.isArray(pending.cards) && pending.cards.length > 0
        ? pending.cards
        : state.combat.hand || [];

    const isMultiConfirm =
      pending.optional === true ||
      pending.mode === 'exhaust_multi' ||
      pending.mode === 'retain' ||
      pending.mode === 'retrieve_discard_retain' ||
      pending.mode === 'hand_to_draw_bottom_multi';

    if (isMultiConfirm) {
      const limit = Math.min(pending.remaining ?? pending.count ?? 1, pool.length);
      const isBadMode =
        pending.mode === 'exhaust_multi' || pending.mode === 'hand_to_draw_bottom_multi';
      const sorted = [...pool].sort((a, b) => {
        const rank = (c) => {
          const st = getCardStats(c);
          if (isBadMode) {
            if (st.type === 'curse' || st.type === 'status') return -100;
            if (c.cardId === 'strike') return -30;
            if (c.cardId === 'defend') return -20;
            return CARD_DRAFT_SCORES[c.cardId] ?? 50;
          }
          return -(CARD_DRAFT_SCORES[c.cardId] ?? 50);
        };
        return rank(a) - rank(b);
      });
      const wantCount =
        pending.mode === 'exhaust_multi'
          ? sorted.filter((c) => {
              const st = getCardStats(c);
              return st.type === 'curse' || st.type === 'status';
            }).length
          : limit;
      const toToggle = Math.min(limit, wantCount);
      for (let i = 0; i < toToggle; i += 1) {
        runTogglePendingCardChoice(state, sorted[i].instanceId);
      }
      const res = runConfirmPendingCardChoice(state);
      if (!res?.ok) break;
      continue;
    }

    if (pool.length === 0) break;
    let pick = pool[0];
    if (pending.mode === 'discard' || pending.mode === 'exhaust' || pending.mode === 'hand_to_draw' || pending.mode === 'hand_to_draw_bottom') {
      pick = [...pool].sort((a, b) => {
        const score = (c) => {
          const st = getCardStats(c);
          if (st.type === 'curse' || st.type === 'status') return -100;
          if (pending.mode === 'discard' && (c.cardId === 'tactician' || c.cardId === 'reflex')) return -120;
          if (c.cardId === 'strike') return -30;
          if (c.cardId === 'defend') return -20;
          return CARD_DRAFT_SCORES[c.cardId] ?? 50;
        };
        return score(a) - score(b);
      })[0];
    } else if (pending.mode === 'upgrade') {
      pick = [...pool].sort((a, b) => (UPGRADE_PRIORITY[b.cardId] ?? 50) - (UPGRADE_PRIORITY[a.cardId] ?? 50))[0];
    } else {
      // pick_from_draw, omniscience, dual_wield, nightmare, retrieve_*, discover_card, discard_to_draw
      pick = [...pool].sort((a, b) => (CARD_DRAFT_SCORES[b.cardId] ?? 50) - (CARD_DRAFT_SCORES[a.cardId] ?? 50))[0];
    }
    const r = runResolveCardChoice(state, pick.instanceId);
    if (!r?.ok) {
      // Fallback: try any eligible candidate in pool (e.g. dual_wield only accepts attack/power)
      let ok = false;
      for (const alt of pool) {
        if (runResolveCardChoice(state, alt.instanceId)?.ok) {
          ok = true;
          break;
        }
      }
      if (!ok) break;
    }
  }
}

// === Target Selection ===

function pickBestEnemyTarget(state, cardStats = null) {
  const alive = state.combat.enemies.filter((e) => e.hp > 0);
  if (alive.length === 0) return null;
  if (alive.length === 1) return alive[0];

  // Prioritize killing low-HP enemies or dangerous attackers/buffers/summoners
  return [...alive].sort((a, b) => {
    const score = (e) => {
      let s = 0;
      const effHp = getEffectiveHpRemaining(e);
      // Poison-doomed enemies drop priority
      if ((e.statuses?.poison ?? 0) >= e.hp) s -= 200;
      // Avoid waking sleeping Lagavulin unnecessarily when others exist
      if ((e.statuses?.asleep ?? 0) > 0) s -= 60;
      // If Spire Shield & Spear and card is non-killing, prefer facing whoever is attacking harder
      if (e.intent?.damage > 0) {
        s += (e.intent.damage * Math.max(1, e.intent.hits ?? 1)) * 1.6;
      }
      // Prioritize killing low-HP enemies to cut incoming damage
      if (effHp <= 18) s += 80 - effHp * 2;
      // Prioritize minions/buffers like Mystic, Gremlin Leader's friends, Cultist, Torch Head, Dagger
      if (e.templateId === 'dagger' || e.templateId === 'mystic' || e.templateId === 'cultist') s += 45;
      // Apply weak to biggest attacker
      if (cardStats?.applyStatuses?.weak && e.intent?.damage > 0) s += 50;
      return s;
    };
    return score(b) - score(a);
  })[0];
}

// === Combat Card Scoring ===

function scoreCardPlay(state, cardInstance, targetEnemy) {
  const stats = getCardStats(cardInstance);
  if (!stats) return -9999;
  const combat = state.combat;
  const player = state.player;
  const cost = getEffectiveCardCost(cardInstance, player, combat);
  const stance = combat.stance || 'neutral';
  const alive = combat.enemies.filter((e) => e.hp > 0);
  const enemiesAttacking = alive.some(
    (e) =>
      (e.statuses?.poison ?? 0) < e.hp &&
      e.intent?.damage > 0 &&
      ['attack', 'attack_debuff', 'attack_buff', 'attack_defend'].includes(e.intent.type)
  );
  const incomingNow = estimateIncomingDamage(state, stance);
  const incomingNeutral = estimateIncomingDamage(state, 'neutral');
  const incomingWrath = estimateIncomingDamage(state, 'wrath');
  const totalEnemyHp = alive.reduce((acc, e) => acc + getEffectiveHpRemaining(e), 0);

  let score = 10;

  // Never play Blasphemy unless lethal this turn or surviving via Intangible/Buffer!
  if (cardInstance.cardId === 'blasphemy') {
    const canSurvive =
      (player.statuses?.intangible ?? 0) >= 2 ||
      (player.statuses?.buffer ?? 0) >= 1 ||
      (hasRelic(state, 'incense_burner') && (state.relicCounters?.incense_burner ?? 0) === 5);
    const lethalInDiv = canLethalAfterCard(
      state,
      cardInstance,
      targetEnemy,
      'divinity',
      player.energy - cost + (stance === 'calm' ? (hasRelic(state, 'violet_lotus') ? 3 : 2) : 0) + 3
    );
    return lethalInDiv || canSurvive ? 500 : -9999;
  }

  // Never play Conclude early if we still have playable energy/attacks unless lethal!
  if (cardInstance.cardId === 'conclude') {
    const dmg = estimateCardDirectDamage(state, cardInstance, targetEnemy, stance);
    if (dmg >= totalEnemyHp) return 600;
    // Play Conclude only near end of turn (low energy remaining)
    const remainingOtherPlayable = combat.hand.some(
      (c) =>
        c.instanceId !== cardInstance.instanceId &&
        canPlayCard(state, c.instanceId).playable &&
        getEffectiveCardCost(c, player, combat) <= player.energy - cost
    );
    if (remainingOtherPlayable && player.energy - cost >= 1) return -40;
  }

  // Never play Meditate early unless we need to exit Wrath or have no energy left
  if (cardInstance.cardId === 'meditate') {
    if (stance === 'wrath' && incomingWrath > 0) return 220;
    if (player.energy <= cost) return 65;
    return -50;
  }

  // Vault: play near end of turn (spend remaining energy first!) unless we have low energy
  if (cardInstance.cardId === 'vault') {
    if (player.energy - cost <= 1) return 260;
    return 15;
  }

  // Zero-cost freebies & card draw / energy generators early
  if (cost === 0 && (stats.gainEnergy || stats.draw || stats.enterStance === 'divinity')) {
    score += 110;
  }

  // High-value Powers early in combat (when combat isn't already ending this turn)
  if (stats.type === 'power') {
    if (totalEnemyHp <= 12 && incomingNow === 0) {
      score -= 20; // just kill instead of wasting energy on slow powers
    } else {
      const powerBoost = {
        rushdown: 185,
        mental_fortress: 185,
        echo_form: 195,
        defragment: 175,
        footwork: 170,
        after_image: 170,
        feel_no_pain: 165,
        dark_embrace: 160,
        noxious_fumes: 165,
        well_laid_plans: 155,
        electrodynamics: 175,
        capacitor: 155,
        loop: 155,
        inflame: 155,
        accuracy: 150,
        demon_form: 145,
        barricade: 140,
        corruption: 150,
        self_repair: 160,
        buffer: 155,
        like_water: 135,
        devotion: 140,
        establishment: 135,
      };
      score += powerBoost[cardInstance.cardId] ?? 105;

      // Wraith Form: strong when incoming is high or enemy HP is low enough to finish in 3-4 turns
      if (cardInstance.cardId === 'wraith_form') {
        score = incomingNow >= 14 || totalEnemyHp <= 95 ? 240 : 40;
      }
      // Biased Cognition: amazing with Artifact / Core Surge or when combat can finish quickly
      if (cardInstance.cardId === 'biased_cog') {
        const hasArt = (player.statuses?.artifact ?? 0) > 0;
        score = hasArt || totalEnemyHp <= 110 || combat.turn >= 2 ? 220 : 85;
      }
    }
  }

  // Talk to the Hand / Terror / Shockwave / Malaise / Crippling Cloud
  if (cardInstance.cardId === 'talk_to_the_hand' && targetEnemy) {
    score += 155;
  }
  if (cardInstance.cardId === 'corpse_explosion' && alive.length >= 2) {
    score += 170;
  }
  if (cardInstance.cardId === 'catalyst') {
    const p = targetEnemy?.statuses?.poison ?? 0;
    score += p >= 8 ? 220 : p >= 4 ? 120 : -80;
  }

  // === WATCHER STANCE PLANNER ===
  const { nextStance, energyDelta } = getStanceTransitionEnergyDelta(state, stats, enemiesAttacking);
  const freeMiracleEnergy = combat.hand.reduce((acc, c) => {
    if (c.instanceId === cardInstance.instanceId) return acc;
    const st = getCardStats(c);
    if (st?.gainEnergy && getEffectiveCardCost(c, player, combat) === 0) {
      return acc + st.gainEnergy;
    }
    return acc;
  }, 0);
  const energyAfter = player.energy - cost + energyDelta;
  const effectiveEnergyAfter = energyAfter + freeMiracleEnergy;

  // Value Calm-exit energy refund (+2/+3E) and Mental Fortress block on any stance change!
  if (energyDelta > 0 && nextStance !== stance) {
    score += energyDelta * 48;
  }
  if (nextStance !== stance && (player.statuses?.mentalFortress ?? 0) > 0) {
    score += player.statuses.mentalFortress * 12;
  }

  // 1) Entering Wrath evaluation
  if (nextStance === 'wrath' && stance !== 'wrath') {
    const canKill = canLethalAfterCard(state, cardInstance, targetEnemy, 'wrath', effectiveEnergyAfter);
    const hasExit = hasAffordableWrathExitInHand(state, cardInstance, effectiveEnergyAfter, enemiesAttacking);
    // Check if Halt/Wallop/Protect in hand can absorb Wrath incoming damage
    const wrathDefenseBlock = combat.hand.reduce((acc, c) => {
      if (c.instanceId === cardInstance.instanceId) return acc;
      const st = getCardStats(c);
      const cCost = getEffectiveCardCost(c, player, combat);
      if (cCost < 0 || cCost > effectiveEnergyAfter) return acc;
      if (c.cardId === 'halt') return acc + (c.upgraded ? 18 : 12);
      if (c.cardId === 'wallop') return acc + (c.upgraded ? 24 : 18);
      return acc;
    }, 0);
    const canTankWrath = incomingWrath <= wrathDefenseBlock + 4;
    const enemyNotAttacking = incomingWrath === 0;
    const rushdownDraw = (player.statuses?.rushdown ?? 0) > 0;

    if (canKill) {
      score += 460; // Lethal Wrath burst!
    } else if (enemyNotAttacking) {
      score += 210 + (stance === 'calm' ? 75 : 0) + (rushdownDraw ? 60 : 0);
    } else if (hasExit) {
      // Safe stance dance: enter Wrath, unload attacks, exit back to Calm/Neutral!
      score += 195 + (stance === 'calm' ? 85 : 0) + (rushdownDraw ? 70 : 0);
    } else if (canTankWrath) {
      score += 140 + (stance === 'calm' ? 50 : 0);
    } else if (incomingWrath <= 8 && player.hp > incomingWrath + 18) {
      score += 55;
    } else {
      // DANGER: Would eat massive 2x Wrath damage with no exit and no lethal!
      score -= 900;
    }
  }

  // 2) Currently in Wrath and facing heavy incoming damage without lethal -> EXIT WRATH!
  if (stance === 'wrath') {
    const currentlyLethal = canLethalAfterCard(state, cardInstance, targetEnemy, 'wrath', Math.max(0, effectiveEnergyAfter));
    const exitsWrath = nextStance !== 'wrath';
    if (incomingWrath > 0 && !currentlyLethal) {
      if (exitsWrath) {
        const saved = Math.max(0, incomingWrath - estimateIncomingDamage(state, nextStance));
        // Hold exit card (including attack-exits like Empty Fist/Fear No Evil!) until non-exit Wrath attacks fire at 2x!
        const nonExitAffordableAttacksLeft = combat.hand.filter((c) => {
          if (c.instanceId === cardInstance.instanceId) return false;
          const st = getCardStats(c);
          if (st?.type !== 'attack' || isWrathExitCard(st, enemiesAttacking)) return false;
          const cCost = getEffectiveCardCost(c, player, combat);
          return cCost >= 0 && cCost + cost <= player.energy + freeMiracleEnergy;
        });
        if (nonExitAffordableAttacksLeft.length > 0) {
          score += 55 + saved * 1.5;
        } else {
          // Exit Wrath NOW!
          score += 310 + saved * 4.5;
        }
      } else if (cardInstance.cardId === 'halt') {
        score += 250;
      } else if (cardInstance.cardId === 'wallop') {
        score += 270;
      } else if (stats.type === 'attack') {
        const bestExit = combat.hand
          .filter((c) => c.instanceId !== cardInstance.instanceId && isWrathExitCard(getCardStats(c), enemiesAttacking))
          .map((c) => getEffectiveCardCost(c, player, combat))
          .filter((cCost) => cCost >= 0)
          .sort((a, b) => a - b)[0];
        if (bestExit !== undefined && player.energy + freeMiracleEnergy - cost < bestExit) {
          score -= 450; // Do NOT strand yourself in Wrath without exit energy!
        } else {
          score += 160; // Unload 2x Wrath attack while keeping exit energy safe!
        }
      }
    } else if (stats.type === 'attack' && !exitsWrath) {
      // Safe or lethal in Wrath -> unleash 2x attacks BEFORE exiting!
      score += 180;
    }
  }

  // 3) Entering Calm when Neutral (banks +2/+3E for next turn's Wrath turn!)
  if (nextStance === 'calm' && stance === 'neutral') {
    score += 145 + (incomingNeutral > 0 && stats.block ? 50 : 0);
  }

  // 4) Divinity trigger (Mantra >= 10)
  if (nextStance === 'divinity' && stance !== 'divinity') {
    score += 280;
  }
  if (stance === 'divinity' && stats.type === 'attack') {
    score += 200; // 3x damage window!
  }

  // === DEFECT ORB LOGIC ===
  if (stats.channelOrbs?.length > 0) {
    const focus = player.statuses?.focus ?? 0;
    for (const o of stats.channelOrbs) {
      if (o === 'frost') score += (incomingNow > 0 ? 55 : 25) + Math.max(0, focus) * 8;
      if (o === 'lightning') score += 45 + Math.max(0, focus) * 6;
      if (o === 'dark') score += 50 + Math.max(0, focus) * 6;
      if (o === 'plasma') score += 85;
    }
  }
  if (stats.evokeFrontOrb) {
    const front = player.orbs?.[0];
    if (!front) {
      score -= 120;
    } else if (front.type === 'plasma') {
      score += 160;
    } else if (front.type === 'dark') {
      const darkVal = getOrbOutputValues(front, player).evoke;
      score += darkVal >= 18 ? 140 + darkVal * 2 : 20;
    } else if (front.type === 'frost' && incomingNow > 0) {
      score += 85;
    } else if (front.type === 'lightning') {
      score += 65;
    }
  }
  if (cardInstance.cardId === 'consume') {
    score += (player.maxOrbSlots ?? 0) >= 3 ? 130 : -200;
  }

  // === GENERAL BLOCK vs DAMAGE SCORING ===
  const blockGain = stats.block ? calculateCardBlock(stats.block, player) : 0;
  if (blockGain > 0) {
    if (incomingNow > 0) {
      const usefulBlock = Math.min(incomingNow, blockGain);
      score += usefulBlock * 5.2;
      if (usefulBlock >= incomingNow) score += 30;
    } else {
      // No incoming damage -> block cards low priority unless Barricade/Blur/Calipers/Body Slam
      const keepsBlock = (player.statuses?.barricade ?? 0) > 0 || (player.statuses?.blur ?? 0) > 0 || hasRelic(state, 'calipers');
      score += keepsBlock ? blockGain * 1.6 : -25;
    }
  }

  if (stats.type === 'attack' && targetEnemy) {
    const dmg = estimateCardDirectDamage(state, cardInstance, targetEnemy, stance);
    score += dmg * 3.1;
    // Lethal kill bonus!
    const targetEffHp = getEffectiveHpRemaining(targetEnemy);
    if (dmg >= targetEffHp && targetEffHp > 0) {
      score += 110;
      if (alive.length === 1) score += 200; // Ends the entire fight!
    }
    // Fatal reward bonus (Feed, Hand of Greed, Lesson Learned, Ritual Dagger)
    if (stats.fatal && dmg >= targetEffHp && !targetEnemy.isMinion) {
      score += 250;
    }
    // Apply Vulnerable BEFORE big attacks!
    if (stats.applyStatuses?.vulnerable && (targetEnemy.statuses?.vulnerable ?? 0) === 0) {
      score += 75;
    }
    if (stats.applyStatuses?.weak && targetEnemy.intent?.damage > 0 && (targetEnemy.statuses?.weak ?? 0) === 0) {
      score += 70;
    }
    if (stats.applyStatuses?.poison) {
      score += stats.applyStatuses.poison * 7;
    }
  } else if (stats.applyStatuses?.poison) {
    score += stats.applyStatuses.poison * (stats.target === 'all' ? 11 : 7);
  }

  // Draw & Scry utility
  if (stats.draw) score += stats.draw * 22;
  if (stats.scry) score += stats.scry * 10;
  if (stats.gainMantra) score += stats.gainMantra * 14;
  if (stats.addShivs) score += stats.addShivs * 24;

  // Prefer higher value per energy when energy is tight
  if (cost > 0) {
    score -= cost * 6;
  } else {
    score += 18;
  }

  return score;
}

// === Smart Potion Usage ===

function tryUseUsefulPotion(state) {
  const combat = state.combat;
  if (!combat || combat.status !== 'ongoing') return false;
  const isHardFight = combat.encounterType === 'boss' || combat.encounterType === 'elite';
  const incoming = estimateIncomingDamage(state);
  const lowHp = state.player.hp <= state.player.maxHp * 0.45;
  const urgent = incoming >= 16 || (incoming > 0 && incoming >= state.player.hp * 0.4) || (isHardFight && combat.turn <= 2);
  if (!urgent && !lowHp) return false;

  const target = pickBestEnemyTarget(state);
  for (let i = 0; i < state.player.potions.length; i += 1) {
    const pid = state.player.potions[i];
    if (!pid) continue;
    const def = POTION_LIBRARY[pid];
    if (!def || pid === 'fairy_in_a_bottle' || pid === 'smoke_bomb') continue;
    // Use defensive/healing/scaling potions appropriately
    if ((pid === 'blood_surge_potion' || pid === 'fruit_juice') && state.player.hp > state.player.maxHp - 8) {
      continue;
    }
    if (pid === 'ghost_in_a_jar' && incoming < 18) continue;
    if (pid === 'block_potion' && incoming < 8) continue;
    if (pid === 'stance_potion' && combat.stance !== 'wrath' && incoming < 14) continue;
    if (!isHardFight && !lowHp && incoming < 20) continue;

    const res = runUsePotion(state, i, target?.id ?? null);
    if (res?.ok) {
      resolvePendingChoices(state);
      return true;
    }
  }
  return false;
}

// === Play Full Combat ===

export function playSmartCombat(state, maxTurns = 75) {
  let turns = 0;
  while (state.screen === 'combat' && state.combat?.status === 'ongoing' && turns < maxTurns) {
    turns += 1;
    resolvePendingChoices(state);

    // Drink a potion if fight is dangerous/boss/elite
    tryUseUsefulPotion(state);

    let plays = 0;
    while (state.screen === 'combat' && state.combat?.status === 'ongoing' && plays < 40) {
      resolvePendingChoices(state);
      if (state.screen !== 'combat' || state.combat?.status !== 'ongoing') break;

      let bestCard = null;
      let bestTarget = null;
      let bestScore = -15; // Don't play actively harmful cards (like Wrath with no exit or Blasphemy without lethal!)

      for (const card of state.combat.hand) {
        const check = canPlayCard(state, card.instanceId);
        if (!check.playable) continue;
        const stats = getCardStats(card);
        const target = stats.target === 'enemy' ? pickBestEnemyTarget(state, stats) : null;
        if (stats.target === 'enemy' && !target) continue;
        const sc = scoreCardPlay(state, card, target);
        if (sc > bestScore) {
          bestScore = sc;
          bestCard = card;
          bestTarget = target;
        }
      }

      if (!bestCard) break;
      const res = runPlayCard(state, bestCard.instanceId, bestTarget?.id ?? null);
      if (!res?.ok) break;
      plays += 1;
      resolvePendingChoices(state);
    }

    if (state.screen !== 'combat' || state.combat?.status !== 'ongoing') break;
    // Emergency potion check right before ending turn if about to die or take huge hit
    if (estimateIncomingDamage(state) >= Math.min(22, state.player.hp)) {
      tryUseUsefulPotion(state);
    }
    runEndTurn(state);
    resolvePendingChoices(state);
  }
}

// === Run-Level Smart Decisions ===

function handleNeow(state) {
  if (!hasPendingNeowBlessing(state)) return;
  const options = state.neowState?.options || [];
  const preferredOrder = [
    'upgrade_1',
    'remove_1',
    'choose_rare_card',
    'common_relic',
    'gold_100',
    'max_hp_8',
    'choose_card',
    'transform_1',
    'fill_potions',
    'gold_for_rare_relic',
  ];
  let chosen = options[0];
  for (const pref of preferredOrder) {
    const found = options.find((c) => c.id === pref);
    if (found) {
      chosen = found;
      break;
    }
  }
  if (!chosen) return;
  const res = chooseNeowOption(state, chosen.id);
  if (!res?.ok) {
    chooseNeowOption(state, options[0].id);
  }
  let guard = 0;
  while (state.neowState?.pendingAction && guard < 6) {
    guard += 1;
    const action = state.neowState.pendingAction;
    if (action.type === 'upgrade') {
      const upg = getUpgradableDeckCards(state).sort(
        (a, b) => (UPGRADE_PRIORITY[b.cardId] ?? 50) - (UPGRADE_PRIORITY[a.cardId] ?? 50)
      );
      if (upg[0]) completeNeowAction(state, upg[0].instanceId);
      else break;
    } else if (action.type === 'remove' || action.type === 'transform') {
      const target =
        state.player.deck.find((c) => c.cardId === 'strike' && canRemoveCard(c)) ||
        state.player.deck.find((c) => canRemoveCard(c));
      if (target) completeNeowAction(state, target.instanceId);
      else break;
    } else if (action.type === 'pick_card') {
      const offers = action.cards || [];
      const best = [...offers].sort(
        (a, b) => (CARD_DRAFT_SCORES[b.cardId] ?? 60) - (CARD_DRAFT_SCORES[a.cardId] ?? 60)
      )[0];
      if (best) completeNeowAction(state, best.instanceId);
      else skipNeowCardOffer(state);
    } else {
      break;
    }
  }
}

function handleReward(state) {
  if (state.screen !== 'reward' || !state.reward) return;
  if (!state.reward.goldClaimed && state.reward.gold > 0) claimRewardGold(state);
  if (state.reward.relicId && !state.reward.relicClaimed) claimRewardRelic(state);
  if (state.reward.extraRelicId && !state.reward.extraRelicClaimed) claimRewardExtraRelic(state);
  if (state.reward.potionId && !state.reward.potionClaimed && state.player.potions.includes(null)) {
    claimRewardPotion(state);
  }
  const cardOffers = state.reward.cardChoices || state.reward.cards || [];
  if (!state.reward.cardClaimed && Array.isArray(cardOffers) && cardOffers.length > 0) {
    const deckSize = state.player.deck.length;
    const minScore = deckSize < 15 ? 64 : deckSize < 21 ? 76 : deckSize < 27 ? 84 : 92;
    // Slightly penalize duplicates past 2 copies unless super strong
    const counts = new Map();
    for (const c of state.player.deck) counts.set(c.cardId, (counts.get(c.cardId) ?? 0) + 1);

    const ranked = cardOffers
      .map((c) => {
        const base = CARD_DRAFT_SCORES[c.cardId] ?? 58;
        const dupPenalty = (counts.get(c.cardId) ?? 0) >= 2 ? 12 : 0;
        const upgBonus = c.upgraded ? 8 : 0;
        return { card: c, score: base + upgBonus - dupPenalty };
      })
      .sort((a, b) => b.score - a.score);

    if (ranked[0] && ranked[0].score >= minScore) {
      claimRewardCard(state, ranked[0].card.instanceId);
    }
  }
  proceedFromReward(state, { force: true });
}

function handleBossReward(state) {
  if (state.screen !== 'boss_reward' || !state.bossReward) return;
  if (!state.bossReward.cardClaimed && Array.isArray(state.bossReward.cardChoices) && state.bossReward.cardChoices.length > 0) {
    const best = [...state.bossReward.cardChoices].sort(
      (a, b) => (CARD_DRAFT_SCORES[b.cardId] ?? 60) - (CARD_DRAFT_SCORES[a.cardId] ?? 60)
    )[0];
    if (best && (CARD_DRAFT_SCORES[best.cardId] ?? 60) >= 70) {
      claimBossRewardCard(state, best.instanceId);
    }
  }
  if (!state.bossReward.pickedRelicId && state.bossReward.relicChoices?.length > 0) {
    const prefs = BOSS_RELIC_PRIORITY[state.characterId] || BOSS_RELIC_PRIORITY.ironclad;
    const picked = [...state.bossReward.relicChoices].sort((a, b) => {
      const ia = prefs.indexOf(a);
      const ib = prefs.indexOf(b);
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    })[0];
    if (picked) claimBossRelic(state, picked);
  }
  proceedToNextAct(state);
}

function handleRest(state) {
  if (state.screen !== 'rest') return;
  const hpRatio = state.player.hp / Math.max(1, state.player.maxHp);
  const needsHeal = hpRatio < (state.floor >= 13 ? 0.65 : 0.52) && !hasRelic(state, 'coffee_dripper');
  if (needsHeal) {
    const r = restHeal(state);
    if (r?.ok) return;
  }
  // Girya Lift if available
  if (hasRelic(state, 'girya') && (state.relicCounters?.girya ?? 0) < 3) {
    const r = liftAtCampfire(state);
    if (r?.ok) return;
  }
  // Peace Pipe Toke curse/strike
  if (hasRelic(state, 'peace_pipe')) {
    const removable =
      state.player.deck.find((c) => CARD_LIBRARY[c.cardId]?.type === 'curse' && canRemoveCard(c)) ||
      state.player.deck.find((c) => c.cardId === 'strike' && canRemoveCard(c));
    if (removable && state.player.deck.length > 6) {
      const r = tokeAtCampfire(state, removable.instanceId);
      if (r?.ok) return;
    }
  }
  // Smith highest-priority upgrade
  if (!hasRelic(state, 'fusion_hammer')) {
    const upg = getUpgradableDeckCards(state).sort(
      (a, b) => (UPGRADE_PRIORITY[b.cardId] ?? 50) - (UPGRADE_PRIORITY[a.cardId] ?? 50)
    );
    if (upg[0]) {
      const r = restUpgradeCard(state, upg[0].instanceId);
      if (r?.ok) return;
    }
  }
  // Fallback heal or leave
  if (!hasRelic(state, 'coffee_dripper') && state.player.hp < state.player.maxHp) {
    const r = restHeal(state);
    if (r?.ok) return;
  }
  leaveRestSite(state);
}

function handleShop(state) {
  if (state.screen !== 'shop' || !state.shop) return;
  // 1. Purge curse first, then basic Strike if affordable
  if (!state.shop.purgeUsed && state.player.gold >= state.shop.purgeCost && state.player.deck.length > 6) {
    const victim =
      state.player.deck.find((c) => CARD_LIBRARY[c.cardId]?.type === 'curse' && canRemoveCard(c)) ||
      state.player.deck.find((c) => c.cardId === 'strike' && canRemoveCard(c));
    if (victim) {
      buyShopPurge(state, victim.instanceId);
    }
  }
  // 2. Buy strong relic if affordable
  if (state.shop.relicOffer && !state.shop.relicOffer.sold && state.player.gold >= state.shop.relicOffer.price) {
    buyShopRelic(state);
  }
  // 3. Buy S-tier cards
  for (const offer of state.shop.cards || []) {
    if (offer.sold || state.player.gold < offer.price) continue;
    if ((CARD_DRAFT_SCORES[offer.card.cardId] ?? 50) >= 84) {
      buyShopCard(state, offer.card.instanceId);
    }
  }
  // 4. Buy potion if slot free and gold plenty
  if (
    state.shop.potionOffer &&
    !state.shop.potionOffer.sold &&
    state.player.gold >= state.shop.potionOffer.price &&
    state.player.potions.includes(null) &&
    state.player.gold >= 90
  ) {
    buyShopPotion(state);
  }
  leaveShop(state);
}

function handleEvent(state) {
  if (state.screen !== 'event' || !state.eventState) return;
  const evId = state.eventState.eventId;
  const hp = state.player.hp;
  const maxHp = state.player.maxHp;

  const preferredByEvent = {
    shining_light: hp > maxHp * 0.55 ? ['enter_light', 'leave'] : ['leave'],
    ancient_forge: ['temper_blade', 'scavenge_slag'],
    ancient_shrine: hp < maxHp * 0.65 ? ['drink_spring', 'pray_purge'] : ['pray_purge', 'gather_gold'],
    thorn_reliquary: hp > maxHp * 0.5 ? ['open_reliquary', 'take_coins'] : ['take_coins'],
    golden_idol: hp > maxHp * 0.55 ? ['smash_trap', 'leave_idol'] : ['leave_idol'],
    living_wall: ['wall_forget', 'wall_grow', 'wall_change'],
    cursed_tome: hp > maxHp * 0.65 ? ['read_final_chapter', 'close_tome'] : ['close_tome'],
    potion_alchemist: ['drink_mutagen', 'buy_potions'],
    mushroom_grotto: ['refine_red_spore', 'bypass_grotto'],
    library_sanctum: hp < maxHp * 0.55 ? ['nap_in_library', 'study_manuals'] : ['study_manuals', 'nap_in_library'],
    masked_bandits: hp > maxHp * 0.55 ? ['fight_bandits', 'pay_gold'] : ['pay_gold'],
    mind_bloom: hp > maxHp * 0.6 ? ['war_memory', 'awake_memory'] : ['awake_memory', 'war_memory'],
    scrap_ooze: ['leave_ooze'],
    wing_statue: ['destroy_wing', 'pray_wing', 'leave_wing'],
    council_of_ghosts: ['refuse_ghosts'],
    forgotten_altar: ['offer_golden_idol', 'shed_blood_altar', 'desecrate_altar'],
    augmenter: ['take_jax', 'augment_leave'],
    sensory_stone: ['recall_1'],
    winding_halls: ['push_through_halls'],
    big_fish: hp < maxHp * 0.65 ? ['eat_banana', 'eat_donut'] : ['eat_donut', 'eat_banana'],
    cleric: hp < maxHp * 0.6 ? ['cleric_heal', 'cleric_purify', 'cleric_leave'] : ['cleric_purify', 'cleric_leave'],
    dead_adventurer: ['leave_adventurer'],
    sssserpent: ['refuse_serpent'],
    world_of_goop: hp > maxHp * 0.5 ? ['gather_goop_gold', 'leave_goop'] : ['leave_goop'],
    the_joust: ['bet_murderer', 'leave_joust'],
    the_mausoleum: ['leave_mausoleum'],
    vampires_den: ['trade_blood_vial', 'refuse_vampires'],
    the_nest: ['smash_and_grab', 'join_ritual'],
    beggar_shrine: ['give_beggar_gold', 'leave_beggar'],
    colosseum_trial: hp > maxHp * 0.65 ? ['accept_trial', 'skip_trial'] : ['skip_trial'],
    tomb_of_red_mask: ['wear_red_mask', 'leave_red_tomb'],
    falling_abyss: ['brace_fall_impact', 'land_sacrifice_skill', 'land_sacrifice_attack'],
    mysterious_sphere: hp > maxHp * 0.65 ? ['smash_sphere', 'leave_sphere'] : ['leave_sphere'],
    moai_head: ['offer_golden_idol', 'leave_moai'],
    secret_portal: ['study_portal', 'leave_portal'],
    spire_forge_altar: ['leave_forge_altar'],
  };

  const candidates = preferredByEvent[evId] || [];
  let succeeded = false;
  for (const cid of candidates) {
    const res = chooseEventOption(state, cid);
    if (res?.ok) {
      succeeded = true;
      break;
    }
  }
  if (!succeeded && state.screen === 'event' && state.eventState && !state.eventState.resolved) {
    // Fallback: try any choice that works
    const fallbackIds = ['leave', 'leave_idol', 'leave_wing', 'leave_goop', 'leave_joust', 'leave_mausoleum', 'leave_beggar', 'leave_sphere', 'leave_moai', 'leave_portal', 'leave_forge_altar', 'leave_red_tomb', 'leave_ooze', 'leave_adventurer', 'close_tome', 'bypass_grotto', 'refuse_ghosts', 'refuse_vampires', 'refuse_serpent', 'skip_trial', 'augment_leave', 'wall_grow', 'wall_change', 'wall_forget'];
    for (const cid of fallbackIds) {
      if (chooseEventOption(state, cid)?.ok) break;
    }
  }

  if (state.screen === 'event' && state.eventState) {
    if (state.eventState.pendingPurge) {
      const victim =
        state.player.deck.find((c) => CARD_LIBRARY[c.cardId]?.type === 'curse' && canRemoveCard(c)) ||
        state.player.deck.find((c) => c.cardId === 'strike' && canRemoveCard(c)) ||
        state.player.deck.find((c) => canRemoveCard(c));
      if (victim) completeEventPurge(state, victim.instanceId);
    } else if (state.eventState.pendingCardAction) {
      if (state.eventState.pendingCardAction === 'upgrade') {
        const upg = getUpgradableDeckCards(state).sort(
          (a, b) => (UPGRADE_PRIORITY[b.cardId] ?? 50) - (UPGRADE_PRIORITY[a.cardId] ?? 50)
        );
        if (upg[0]) completeEventCardAction(state, upg[0].instanceId);
      } else {
        const victim =
          state.player.deck.find((c) => c.cardId === 'strike' && canRemoveCard(c)) ||
          state.player.deck.find((c) => canRemoveCard(c));
        if (victim) completeEventCardAction(state, victim.instanceId);
      }
    } else if (Array.isArray(state.eventState.libraryChoices)) {
      const best = [...state.eventState.libraryChoices].sort(
        (a, b) => (CARD_DRAFT_SCORES[b.cardId] ?? 55) - (CARD_DRAFT_SCORES[a.cardId] ?? 55)
      )[0];
      if (best) pickEventLibraryCard(state, best.instanceId);
    }
    if (state.eventState.resolved) {
      continueFromEvent(state);
    }
  }
}

function chooseNextMapNode(state) {
  const avail = getAvailableNodeIds(state);
  if (avail.length === 0) return null;
  const hpRatio = state.player.hp / Math.max(1, state.player.maxHp);
  const scored = avail.map((id) => {
    const node = findMapNode(state, id);
    let score = 0;
    if (!node) return { id, score: -100 };
    if (node.type === 'rest') score = hpRatio < 0.65 ? 95 : 70;
    else if (node.type === 'treasure') score = 90;
    else if (node.type === 'shop') score = state.player.gold >= 160 ? 85 : 35;
    else if (node.type === 'elite') score = hpRatio >= 0.72 && state.floor >= 7 ? 78 : 20;
    else if (node.type === 'event') score = 60;
    else if (node.type === 'combat') score = 58;
    else if (node.type === 'boss') score = 100;
    return { id, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored[0].id;
}

/**
 * Simulates a full 3-Act run for a given character, seed, and Ascension level.
 */
export function simulateFullRun({
  seed,
  characterId = 'ironclad',
  ascension = 0,
  unlockAllOverride = true,
  maxSteps = 400,
}) {
  const state = createNewRun({
    seed,
    characterId,
    ascension,
    unlockAllOverride,
  });

  let steps = 0;
  while (state.screen !== 'game_over' && steps < maxSteps) {
    steps += 1;
    if (state.screen === 'map') {
      if (hasPendingNeowBlessing(state)) {
        handleNeow(state);
        continue;
      }
      const nextId = chooseNextMapNode(state);
      if (!nextId) break;
      const res = selectMapNode(state, nextId);
      if (!res?.ok) break;
    } else if (state.screen === 'combat') {
      playSmartCombat(state);
    } else if (state.screen === 'reward') {
      handleReward(state);
    } else if (state.screen === 'boss_reward') {
      handleBossReward(state);
    } else if (state.screen === 'rest') {
      handleRest(state);
    } else if (state.screen === 'shop') {
      handleShop(state);
    } else if (state.screen === 'event') {
      handleEvent(state);
    } else if (state.screen === 'treasure') {
      if (state.treasureState && !state.treasureState.opened) {
        openTreasureChest(state);
      }
      if (state.treasureState && !state.treasureState.choiceResolved && state.treasureState.offeredRelicId) {
        claimTreasureRelic(state);
      }
      leaveTreasureRoom(state);
    } else {
      break;
    }
  }

  return {
    seed,
    characterId,
    ascension,
    outcome: state.outcome || state.runOutcome || (state.player.hp <= 0 ? 'defeat' : 'incomplete'),
    act: state.act,
    floor: state.floor,
    hp: state.player.hp,
    maxHp: state.player.maxHp,
    deckSize: state.player.deck.length,
    relicCount: state.player.relics.length,
    elitesKilled: state.stats?.elitesKilled ?? 0,
    bossesKilled: state.stats?.bossesKilled ?? 0,
    defeatEncounter: state.lastEncounterId || null,
  };
}
