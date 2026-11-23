import test from 'node:test';
import assert from 'node:assert/strict';

import {
  CARD_LIBRARY,
  COLORLESS_CARD_POOLS,
  createCardInstance,
  formatCardDescription,
  formatUpgradePreview,
  getCardCharacter,
  getCardStats,
  getEffectiveCardCost,
} from '../src/data/cards.js';
import { ENCOUNTERS, GREMLIN_POOL } from '../src/data/enemies.js';
import {
  getRelicIcon,
  POTION_LIBRARY,
  RELIC_ICONS,
  RELIC_LIBRARY,
  STANCE_METADATA,
  STATUS_METADATA,
} from '../src/data/relics.js';
import {
  applyStatus,
  canPlayCard,
  confirmPendingCardChoice,
  confirmScryChoice,
  dealDamageToEnemy,
  discardHandCard,
  drawCards,
  endPlayerTurn,
  initiateScry,
  MAX_HAND_SIZE,
  playCard,
  reconcileCombatState,
  resolveCardChoice,
  restartCombat,
  RUSHDOWN_MAX_TRIGGERS_PER_TURN,
  startCombat,
  togglePendingCardChoice,
  toggleScryChoice,
  usePotion,
} from '../src/engine/combat.js';
import { chooseEventOption, createNewRun, grantRelicToPlayer } from '../src/engine/game.js';
import {
  calculateAttackDamage,
  calculateCardBlock,
  getEnemyIntentPreview,
} from '../src/engine/math.js';
import {
  computeCardSynergies,
  isCardBonusConditionMet,
  previewCardDamageOnEnemy,
  previewPotionDamageOnEnemy,
} from '../src/engine/tactics.js';

function setupCustomCombat(seed = 42, encounter = ENCOUNTERS.floor1[0], deckCardIds = null) {
  const state = createNewRun({ seed });
  if (deckCardIds) {
    state.player.deck = deckCardIds.map((spec) =>
      typeof spec === 'string'
        ? createCardInstance(state, spec, false)
        : createCardInstance(state, spec.id, Boolean(spec.upgraded))
    );
  }
  startCombat(state, encounter, 'normal');
  return state;
}

test('Initial combat setup draws 5 cards, sets 3 energy, and leaves 5 cards in drawPile', () => {
  const state = setupCustomCombat(101);
  assert.equal(state.screen, 'combat');
  assert.equal(state.combat.turn, 1);
  assert.equal(state.player.energy, 3);
  assert.equal(state.combat.hand.length, 5);
  assert.equal(state.combat.drawPile.length, 5);
  assert.equal(state.combat.discardPile.length, 0);
});

test('Attack & Block math handles Strength, Heavy Blade multiplier, Weak, Vulnerable, Dexterity, and Frail', () => {
  const attacker = { statuses: { strength: 3, weak: 1 } };
  const defender = { statuses: { vulnerable: 2 } };
  // (6 + 3) * 0.75 * 1.5 = 10.125 -> 10
  assert.equal(calculateAttackDamage(6, attacker, defender), 10);

  // Heavy Blade+ (5x strength): (14 + 3*5) = 29
  assert.equal(
    calculateAttackDamage(14, { statuses: { strength: 3 } }, null, { strengthMultiplier: 5 }),
    29
  );

  // Negative strength clamps at 0
  assert.equal(calculateAttackDamage(6, { statuses: { strength: -10 } }, defender), 0);

  // Block with Dexterity +2 and Frail: (5 + 2) * 0.75 = 5.25 -> 5
  assert.equal(calculateCardBlock(5, { statuses: { dexterity: 2, frail: 1 } }), 5);
});

test('Draw & reshuffle draws remaining drawPile first, never self-draws card currently in play, and respects hand cap 10', () => {
  const state = setupCustomCombat(202, ENCOUNTERS.floor1[0], [
    'pommel_strike',
    'strike',
    'defend',
    'defend',
    'defend',
  ]);
  // All 5 cards are in hand; drawPile and discardPile are empty!
  assert.equal(state.combat.drawPile.length, 0);
  assert.equal(state.combat.discardPile.length, 0);

  const pommel = state.combat.hand.find((c) => c.cardId === 'pommel_strike');
  const res = playCard(state, pommel.instanceId);
  assert.equal(res.ok, true);
  // Pommel Strike must NOT draw itself while resolving; it ends up in discardPile after!
  assert.equal(state.combat.hand.length, 4);
  assert.equal(state.combat.discardPile.length, 1);
  assert.equal(state.combat.discardPile[0].instanceId, pommel.instanceId);

  // Hand cap test: fill hand to 10 cards, put 3 cards in drawPile, play Offering (1 slot freed -> draws 1 to reach 10, leaves 2 in drawPile)
  const offering = createCardInstance(state, 'offering', false);
  state.combat.hand = [offering];
  for (let i = 0; i < 9; i += 1) {
    state.combat.hand.push(createCardInstance(state, 'strike', false));
  }
  state.combat.drawPile = [
    createCardInstance(state, 'defend', false),
    createCardInstance(state, 'defend', false),
    createCardInstance(state, 'defend', false),
  ];
  assert.equal(state.combat.hand.length, MAX_HAND_SIZE);

  playCard(state, offering.instanceId);
  assert.equal(state.combat.hand.length, MAX_HAND_SIZE);
  assert.equal(state.combat.drawPile.length, 2);
  assert.equal(state.combat.exhaustPile.length, 1);
});

test('Battle Trance draws cards and prevents further card draws only until end of player turn', () => {
  const state = setupCustomCombat(303, ENCOUNTERS.floor1[0], [
    'battle_trance',
    'pommel_strike',
    'strike',
    'strike',
    'defend',
    'defend',
    'defend',
    'defend',
    'strike',
    'strike',
  ]);

  const bt = createCardInstance(state, 'battle_trance', false);
  const ps = createCardInstance(state, 'pommel_strike', false);
  state.combat.hand = [bt, ps];
  state.combat.drawPile = [
    createCardInstance(state, 'strike', false),
    createCardInstance(state, 'strike', false),
    createCardInstance(state, 'strike', false),
    createCardInstance(state, 'strike', false),
  ];

  playCard(state, bt.instanceId);
  // Hand had 2 -> played bt (1 left) -> drew 3 -> 4 in hand, 1 left in drawPile
  assert.equal(state.combat.hand.length, 4);
  assert.equal(state.player.statuses.noDraw, 1);

  // Playing Pommel Strike now deals damage but draws 0 due to noDraw
  playCard(state, ps.instanceId);
  assert.equal(state.combat.hand.length, 3);
  assert.equal(state.combat.drawPile.length, 1);

  // Next turn clears noDraw and draws 5 normally
  endPlayerTurn(state);
  assert.equal(state.player.statuses.noDraw, undefined);
  assert.equal(state.combat.hand.length, 5);
});

test('Debuff duration timing: enemy-applied debuffs survive End-of-Round 1 and decay properly after Round 2', () => {
  const state = setupCustomCombat(404, {
    id: 'green_louse_test',
    name: '测试绿虱虫',
    enemies: [{ templateId: 'green_louse' }],
  });
  const enemy = state.combat.enemies[0];
  enemy.hp = 60;
  enemy.maxHp = 60;

  // Player applies 2 Vulnerable to enemy during Player Turn 1
  applyStatus(enemy, 'vulnerable', 2);
  // Force enemy Turn 1 intent to apply 2 Weak to player
  enemy.intent = {
    id: 'spit_web',
    name: '粘性蛛网',
    type: 'debuff',
    applyPlayerStatuses: { weak: 2 },
  };

  endPlayerTurn(state);

  // Now in Player Turn 2:
  // Enemy Vulnerable ticked 2 -> 1; Player Weak MUST still be 2 (not 1!)
  assert.equal(state.combat.turn, 2);
  assert.equal(enemy.statuses.vulnerable, 1);
  assert.equal(state.player.statuses.weak, 2);

  // Force harmless defend intent on Turn 2 and end turn
  enemy.intent = { id: 'wait', name: '防御', type: 'defend', block: 3 };
  endPlayerTurn(state);

  // Now in Player Turn 3:
  // Enemy Vulnerable ticked 1 -> undefined; Player Weak ticked 2 -> 1; Enemy still has 3 Block!
  assert.equal(state.combat.turn, 3);
  assert.equal(enemy.statuses.vulnerable, undefined);
  assert.equal(state.player.statuses.weak, 1);
  assert.equal(enemy.block, 3);
});

test('Cultist Ritual skips Turn 1 end-of-turn Strength gain and starts scaling on Turn 2', () => {
  const state = setupCustomCombat(505, {
    id: 'cultist_test',
    name: '邪教徒测试',
    enemies: [{ templateId: 'cultist' }],
  });
  const cultist = state.combat.enemies[0];
  assert.equal(cultist.intent.id, 'incantation');

  // End Turn 1: Cultist casts Incantation (+3 Ritual), strength is STILL 0 on Turn 2!
  endPlayerTurn(state);
  assert.equal(cultist.statuses.ritual, 3);
  assert.equal(cultist.statuses.strength ?? 0, 0);
  assert.equal(getEnemyIntentPreview(cultist, state.player).totalDamage, 6);

  // End Turn 2: Cultist attacks for 6, THEN Ritual grants +3 Strength -> Turn 3 intent shows 9!
  endPlayerTurn(state);
  assert.equal(cultist.statuses.strength, 3);
  assert.equal(getEnemyIntentPreview(cultist, state.player).totalDamage, 9);
});

test('Louse Curl Up triggers after first unblocked hit and absorbs second hit of Twin Strike', () => {
  const state = setupCustomCombat(606, {
    id: 'louse_test',
    name: '红虱虫测试',
    enemies: [{ templateId: 'red_louse' }],
  });
  const louse = state.combat.enemies[0];
  louse.hp = 15;
  louse.maxHp = 15;
  assert.equal(louse.statuses.curlUp, 4);

  const twin = createCardInstance(state, 'twin_strike', false);
  state.combat.hand = [twin];

  playCard(state, twin.instanceId, louse.id);
  // Hit 1: 5 dmg -> HP 10, Curl Up 4 triggers (+4 block, curlUp removed)
  // Hit 2: 5 dmg vs 4 block -> 1 HP dmg -> HP 9, block 0
  assert.equal(louse.hp, 9);
  assert.equal(louse.block, 0);
  assert.equal(louse.statuses.curlUp, undefined);
});

test('Gremlin Nob Enrage reacts to Skills and Boss Guardian Mode Shift cycles Offensive <-> Defensive', () => {
  // 1. Gremlin Nob Enrage
  const nobState = setupCustomCombat(707, {
    id: 'nob_test',
    name: '大块头测试',
    enemies: [{ templateId: 'gremlin_nob' }],
  });
  const nob = nobState.combat.enemies[0];
  endPlayerTurn(nobState); // Turn 1: Nob casts Bellow (+2 Enrage)
  assert.equal(nob.statuses.enrage, 2);

  const defendCard = createCardInstance(nobState, 'defend', false);
  nobState.combat.hand = [defendCard];
  playCard(nobState, defendCard.instanceId);
  assert.equal(nob.statuses.strength, 2);

  // 2. Boss Guardian Mode Shift
  const bossState = setupCustomCombat(808, ENCOUNTERS.boss[0]);
  const guardian = bossState.combat.enemies[0];
  assert.equal(guardian.mode, 'offensive');
  assert.equal(guardian.statuses.modeShift, 25);

  // Play Bludgeon (32 dmg) -> breaks Mode Shift 25 -> Guardian enters Defensive Mode with 16 Block & Sharp Hide 3!
  const bludgeon = createCardInstance(bossState, 'bludgeon', false);
  const strike = createCardInstance(bossState, 'strike', false);
  bossState.player.energy = 5;
  bossState.combat.hand = [bludgeon, strike];

  playCard(bossState, bludgeon.instanceId, guardian.id);
  assert.equal(guardian.hp, 103);
  assert.equal(guardian.mode, 'defensive');
  assert.equal(guardian.block, 16);
  assert.equal(guardian.statuses.sharpHide, 3);
  assert.equal(guardian.intent.id, 'roll_attack');

  // Playing Strike against Sharp Hide 3 deals 3 damage back to player!
  const hpBeforeStrike = bossState.player.hp;
  playCard(bossState, strike.instanceId, guardian.id);
  assert.equal(bossState.player.hp, hpBeforeStrike - 3);

  // Turn 1 of Defensive: Roll Attack -> next intent becomes Twin Slam
  endPlayerTurn(bossState);
  assert.equal(guardian.intent.id, 'twin_slam');

  // Turn 2 of Defensive: Twin Slam executes and shifts Guardian back to Offensive with Mode Shift 35!
  endPlayerTurn(bossState);
  assert.equal(guardian.mode, 'offensive');
  assert.equal(guardian.statuses.sharpHide, undefined);
  assert.equal(guardian.statuses.modeShift, 35);
});

test('New monsters: Fungi Beast Spore Cloud, Mad Gremlin Angry, and Elite Lagavulin Metallicize & Siphon Soul', () => {
  // 1. Fungi Beast Spore Cloud applies 2 Vulnerable to player on death when an ally survives
  const fungiState = setupCustomCombat(818, {
    id: 'fungi_test',
    name: '菌兽测试',
    enemies: [{ templateId: 'fungi_beast' }, { templateId: 'slaver_blue' }],
  });
  const fungi = fungiState.combat.enemies[0];
  fungi.hp = 6;
  const strike = createCardInstance(fungiState, 'strike', false);
  fungiState.combat.hand = [strike];
  playCard(fungiState, strike.instanceId, fungi.id);
  assert.equal(fungi.hp, 0);
  assert.equal(fungiState.player.statuses.vulnerable, 2);

  // 2. Mad Gremlin Angry gains +1 Strength per unblocked attack hit
  const gremState = setupCustomCombat(828, {
    id: 'grem_test',
    name: '狂怒地精测试',
    enemies: [{ templateId: 'mad_gremlin' }],
  });
  const grem = gremState.combat.enemies[0];
  grem.hp = 22;
  const twin = createCardInstance(gremState, 'twin_strike', false);
  gremState.combat.hand = [twin];
  playCard(gremState, twin.instanceId, grem.id);
  // Hit 1: 5 dmg -> Angry +1 Str; Hit 2: 5 dmg -> Angry +1 Str => total Strength 2
  assert.equal(grem.hp, 12);
  assert.equal(grem.statuses.strength, 2);

  // 3. Elite Lagavulin starts asleep (asleep: 3) with Metallicize 5 & 5 Block; natural wake after 3 turns or early wake-stun on HP loss
  const lagaNaturalState = setupCustomCombat(838, {
    id: 'laga_test',
    name: '乐加维林测试',
    enemies: [{ templateId: 'lagavulin' }],
  });
  const lagaNatural = lagaNaturalState.combat.enemies[0];
  assert.equal(lagaNatural.statuses.metallicize, 5);
  assert.equal(lagaNatural.statuses.asleep, 3);
  assert.equal(lagaNatural.block, 5);
  assert.equal(lagaNatural.intent.id, 'asleep_idle');

  endPlayerTurn(lagaNaturalState); // Turn 1 sleep (metallicize +5 -> 5 block; asleep 3->2)
  assert.equal(lagaNatural.block, 5);
  assert.equal(lagaNatural.statuses.asleep, 2);
  assert.equal(lagaNatural.intent.id, 'asleep_idle');

  endPlayerTurn(lagaNaturalState); // Turn 2 sleep (asleep 2->1)
  assert.equal(lagaNatural.statuses.asleep, 1);
  assert.equal(lagaNatural.intent.id, 'asleep_idle');

  endPlayerTurn(lagaNaturalState); // Turn 3 sleep ends -> wakes naturally unstunned on Turn 4!
  assert.equal(lagaNatural.statuses.asleep, undefined);
  assert.equal(lagaNatural.statuses.metallicize, undefined);
  assert.equal(lagaNatural.intent.id, 'claw_crush');

  lagaNaturalState.player.block = 40;
  endPlayerTurn(lagaNaturalState); // Turn 4 claw_crush -> Turn 5 claw_crush
  assert.equal(lagaNatural.intent.id, 'claw_crush');

  lagaNaturalState.player.block = 40;
  endPlayerTurn(lagaNaturalState); // Turn 5 claw_crush -> Turn 6 siphon_soul
  assert.equal(lagaNatural.intent.id, 'siphon_soul');

  endPlayerTurn(lagaNaturalState); // Turn 6 siphon_soul applies -1 Strength & -1 Dexterity
  assert.equal(lagaNaturalState.player.statuses.strength, -1);
  assert.equal(lagaNaturalState.player.statuses.dexterity, -1);

  // Early wake-up by penetrating damage stuns Lagavulin for that turn!
  const lagaWakeState = setupCustomCombat(839, {
    id: 'laga_wake_test',
    name: '乐加维林惊醒测试',
    enemies: [{ templateId: 'lagavulin' }],
  });
  const lagaWake = lagaWakeState.combat.enemies[0];
  const heavyStrike = createCardInstance(lagaWakeState, 'bash', false); // 8 dmg breaks 5 block -> 3 HP loss!
  lagaWakeState.combat.hand = [heavyStrike];
  assert.equal(playCard(lagaWakeState, heavyStrike.instanceId, lagaWake.id).ok, true);
  assert.equal(lagaWake.statuses.asleep, undefined);
  assert.equal(lagaWake.statuses.metallicize, undefined);
  assert.equal(lagaWake.statuses.stunned, 1);
  assert.equal(lagaWake.intent.id, 'stunned');

  endPlayerTurn(lagaWakeState); // Stunned skips action cleanly and readies Turn 2 claw_crush
  assert.equal(lagaWake.statuses.stunned, undefined);
  assert.equal(lagaWakeState.player.hp, 80);
  assert.equal(lagaWake.intent.id, 'claw_crush');
});

test('Body Slam description and execution dynamically reflect live Block + Modifiers, and Potions work accurately', () => {
  const state = setupCustomCombat(909);
  const enemy = state.combat.enemies[0];
  enemy.hp = 50;
  state.player.block = 12;
  applyStatus(enemy, 'vulnerable', 1);

  const bodySlam = createCardInstance(state, 'body_slam', true);
  state.combat.hand = [bodySlam];

  const desc = formatCardDescription(bodySlam, { player: state.player, targetEnemy: enemy });
  // 12 * 1.5 = 18, cost 0 when upgraded
  assert.equal(desc.displayDamage, 18);
  assert.equal(desc.displayCost, '0');

  playCard(state, bodySlam.instanceId, enemy.id);
  assert.equal(enemy.hp, 32);

  // Use Fire Potion in slot 0 (deals 20 fixed damage, ignoring Vulnerable!)
  const potRes = usePotion(state, 0, enemy.id);
  assert.equal(potRes.ok, true);
  assert.equal(enemy.hp, 12);
  assert.equal(state.player.potions[0], null);
});

test('restartCombat restores initial Turn 1 snapshot (HP, potions, piles, relics, enemy stats) while tracking cumulative combatRestarts', () => {
  const state = createNewRun({ seed: 1337 });
  state.player.hp = 64;
  state.player.relics.push('anchor', 'vajra');
  startCombat(state, ENCOUNTERS.normal[1], 'normal'); // Slime duo (Acid + Spike Slime)

  const snapshotWithoutRestarts = (s) =>
    JSON.stringify({
      rngState: s.rngState,
      nextUid: s.nextUid,
      player: s.player,
      combat: s.combat,
      stats: { ...s.stats, combatRestarts: 0 },
    });
  const turn1Snapshot = snapshotWithoutRestarts(state);
  assert.equal(state.stats.combatRestarts, 0);

  // Burn potion, play cards, end turn (Slimes attack and shuffle Slimed into discardPile)
  usePotion(state, 0, state.combat.enemies[0].id);
  const firstPlayable = state.combat.hand.find((c) => c.cardId === 'strike');
  if (firstPlayable) {
    playCard(state, firstPlayable.instanceId, state.combat.enemies[0].id);
  }
  endPlayerTurn(state);

  assert.equal(state.combat.turn, 2);
  assert.equal(state.player.potions[0], null);
  assert.ok(state.stats.cardsPlayed >= 1 || state.player.hp < 64);

  // Restart #1
  const res1 = restartCombat(state);
  assert.equal(res1.ok, true);
  assert.equal(res1.combatRestarts, 1);
  assert.equal(state.stats.combatRestarts, 1);
  assert.equal(snapshotWithoutRestarts(state), turn1Snapshot);

  // Play turn again and Restart #2 to verify snapshot wasn't mutated on Restart #1 and counter accumulates
  usePotion(state, 0, state.combat.enemies[1].id);
  endPlayerTurn(state);
  const res2 = restartCombat(state);
  assert.equal(res2.ok, true);
  assert.equal(res2.combatRestarts, 2);
  assert.equal(state.stats.combatRestarts, 2);
  assert.equal(snapshotWithoutRestarts(state), turn1Snapshot);
});

test('Upgrade preview and getCardStats explicitly surface cost reductions (Seeing Red & Body Slam) without false positives', () => {
  const state = createNewRun({ seed: 2026 });

  // 1. Seeing Red (盛怒): cost 1 -> 0
  const seeingRed = createCardInstance(state, 'seeing_red', false);
  const srBaseStats = getCardStats(seeingRed);
  assert.equal(srBaseStats.rarity, 'uncommon');
  assert.equal(srBaseStats.cost, 1);
  assert.equal(srBaseStats.baseCost, 1);
  assert.equal(srBaseStats.costReduced, false);

  const srPreview = formatUpgradePreview(seeingRed);
  assert.ok(srPreview, 'Seeing Red should have an upgrade preview');
  assert.equal(srPreview.costReduced, true);
  assert.equal(srPreview.baseCost, '1');
  assert.equal(srPreview.nextCost, '0');
  assert.match(srPreview.text, /^费用 1 → 0（减少 1 点）。/);
  assert.match(srPreview.text, /获得 2 点能量。/);

  assert.deepEqual(
    srPreview.segments.filter((s) => s.changed).map((s) => s.text),
    ['费用 1 → 0（减少 1 点）。'],
    'Seeing Red should highlight only cost reduction in green'
  );

  const seeingRedPlus = createCardInstance(state, 'seeing_red', true);
  const srPlusStats = getCardStats(seeingRedPlus);
  assert.equal(srPlusStats.cost, 0);
  assert.equal(srPlusStats.baseCost, 1);
  assert.equal(srPlusStats.costReduced, true);
  assert.equal(formatUpgradePreview(seeingRedPlus), null);

  // 2. Body Slam (全身撞击): cost 1 -> 0
  const bodySlam = createCardInstance(state, 'body_slam', false);
  const bsPreview = formatUpgradePreview(bodySlam);
  assert.ok(bsPreview);
  assert.equal(bsPreview.costReduced, true);
  assert.match(bsPreview.text, /^费用 1 → 0（减少 1 点）。/);

  // 3. Strike (打击): cost 1 -> 1 (damage 6 -> 9, no cost reduction)
  const strike = createCardInstance(state, 'strike', false);
  const strikePreview = formatUpgradePreview(strike);
  assert.ok(strikePreview);
  assert.equal(strikePreview.costReduced, false);
  assert.equal(strikePreview.text.includes('费用'), false);
  assert.match(strikePreview.text, /造成 9 点伤害。/);
  assert.deepEqual(
    strikePreview.segments.filter((s) => s.changed).map((s) => s.text),
    ['9'],
    'Strike should highlight only the changed damage value 9'
  );
  assert.equal(getCardStats(createCardInstance(state, 'strike', true)).costReduced, false);

  // 3b. Keyword & clause changes (Bash multi-number, Calculated Gamble exhaust removal, Infinite Blades innate)
  const bashPreview = formatUpgradePreview(createCardInstance(state, 'bash', false));
  assert.deepEqual(
    bashPreview.segments.filter((s) => s.changed).map((s) => s.text),
    ['10', '3']
  );
  const gamblePreview = formatUpgradePreview(createCardInstance(state, 'calculated_gamble', false));
  assert.deepEqual(
    gamblePreview.segments.filter((s) => s.changed).map((s) => s.text),
    ['不再消耗。']
  );
  const bladesPreview = formatUpgradePreview(createCardInstance(state, 'infinite_blades', false));
  assert.deepEqual(
    bladesPreview.segments.filter((s) => s.changed).map((s) => s.text),
    ['固有。']
  );

  // 4. Status card Slimed (粘液): cannot upgrade, costReduced false
  const slimed = createCardInstance(state, 'slimed', false);
  assert.equal(formatUpgradePreview(slimed), null);
  assert.equal(getCardStats(slimed).costReduced, false);

  // 5. Rarity coverage across CARD_LIBRARY: common, uncommon, rare all exist
  const rarities = new Set(Object.values(CARD_LIBRARY).map((c) => c.rarity));
  assert.ok(rarities.has('common'));
  assert.ok(rarities.has('uncommon'));
  assert.ok(rarities.has('rare'));
});

test('Relics, Potions, and all player/enemy Buff & Debuff metadata provide concrete non-empty descriptions', () => {
  assert.equal(Object.keys(RELIC_LIBRARY).length, 103);
  assert.equal(Object.values(RELIC_LIBRARY).filter((r) => r.tier === 'starter').length, 3);
  assert.equal(Object.values(RELIC_LIBRARY).filter((r) => r.tier === 'common').length, 25);
  assert.equal(Object.values(RELIC_LIBRARY).filter((r) => r.tier === 'uncommon').length, 25);
  assert.equal(Object.values(RELIC_LIBRARY).filter((r) => r.tier === 'rare').length, 22);
  assert.equal(Object.values(RELIC_LIBRARY).filter((r) => r.tier === 'shop').length, 8);
  assert.equal(Object.values(RELIC_LIBRARY).filter((r) => r.tier === 'event').length, 4);
  assert.equal(
    Object.values(RELIC_LIBRARY).filter((r) => r.tier === 'boss').length,
    16
  );
  for (const id of Object.keys(RELIC_LIBRARY)) {
    assert.ok(RELIC_ICONS[id] && getRelicIcon(id).length > 0, `Relic ${id} must have a dedicated icon`);
  }
  assert.equal(Object.keys(POTION_LIBRARY).length, 28);
  assert.equal(Object.keys(CARD_LIBRARY).length, 234);
  assert.equal(
    Object.values(CARD_LIBRARY).filter((c) => getCardCharacter(c) === 'ironclad').length,
    65
  );
  assert.equal(
    Object.values(CARD_LIBRARY).filter((c) => getCardCharacter(c) === 'silent').length,
    65
  );
  assert.equal(
    Object.values(CARD_LIBRARY).filter((c) => getCardCharacter(c) === 'watcher').length,
    72
  );
  assert.equal(ENCOUNTERS.act2Boss.length, 3);
  assert.equal(ENCOUNTERS.act3Boss.length, 3);
  assert.ok(CARD_LIBRARY.wound, 'CARD_LIBRARY must include Wound status card');
  assert.ok(CARD_LIBRARY.parasite, 'CARD_LIBRARY must include Parasite curse card');
  assert.ok(CARD_LIBRARY.apparition, 'CARD_LIBRARY must include Apparition event card');
  assert.ok(STATUS_METADATA.confused, 'STATUS_METADATA must include confused for Snecko Eye');
  assert.ok(STATUS_METADATA.poison, 'STATUS_METADATA must include poison for The Silent');
  assert.ok(STATUS_METADATA.intangible, 'STATUS_METADATA must include intangible for Wraith Form');
  assert.ok(STATUS_METADATA.vigor && STATUS_METADATA.buffer && STATUS_METADATA.slow);
  assert.ok(STATUS_METADATA.timeWarp && STATUS_METADATA.curiosity && STATUS_METADATA.regenerating);
  assert.ok(STATUS_METADATA.flight && STATUS_METADATA.malleable);
  assert.ok(
    STATUS_METADATA.mantra &&
      STATUS_METADATA.mark &&
      STATUS_METADATA.talkToTheHand &&
      STATUS_METADATA.mentalFortress &&
      STATUS_METADATA.rushdown &&
      STATUS_METADATA.blasphemer
  );
  assert.ok(STANCE_METADATA.calm && STANCE_METADATA.wrath && STANCE_METADATA.divinity);
  assert.equal(STANCE_METADATA.wrath.shortLabel, '愤怒 · 敌我攻击 ×2');
  assert.equal(STANCE_METADATA.wrath.shortLabel.includes('攻防'), false);
  for (const relic of Object.values(RELIC_LIBRARY)) {
    assert.ok(relic.name && relic.description.length >= 6, `Missing description on relic ${relic.id}`);
  }
  for (const potion of Object.values(POTION_LIBRARY)) {
    assert.ok(potion.name && potion.description.length >= 6, `Missing description on potion ${potion.id}`);
  }
  for (const [key, meta] of Object.entries(STATUS_METADATA)) {
    const posText = meta.describe(2);
    assert.ok(meta.name && posText.length >= 6, `Missing positive description on status ${key}`);
    if (key === 'strength' || key === 'dexterity') {
      const negText = meta.describe(-2);
      assert.ok(negText.includes('减少'), `Negative ${key} should describe reduction: ${negText}`);
    }
  }
});

test('Exhaust archetype: Feel No Pain, Dark Embrace, Charons Ashes, Corruption, Second Wind, True Grit+, and Fiend Fire', () => {
  const state = setupCustomCombat(1501, {
    id: 'exhaust_test',
    name: '消耗流测试',
    enemies: [{ templateId: 'slaver_blue' }],
  });
  const enemy = state.combat.enemies[0];
  enemy.hp = 120;
  enemy.maxHp = 120;

  state.player.relics.push('charons_ashes');
  state.player.energy = 10;

  const fnp = createCardInstance(state, 'feel_no_pain', false); // 3 block per exhaust
  const de = createCardInstance(state, 'dark_embrace', false); // 1 draw per exhaust
  const corr = createCardInstance(state, 'corruption', false); // skills cost 0 & exhaust
  const shrug = createCardInstance(state, 'shrug_it_off', false); // skill: normally cost 1
  state.combat.hand = [fnp, de, corr, shrug];
  state.combat.drawPile = [
    createCardInstance(state, 'strike', false),
    createCardInstance(state, 'strike', false),
    createCardInstance(state, 'strike', false),
    createCardInstance(state, 'strike', false),
    createCardInstance(state, 'strike', false),
  ];

  playCard(state, fnp.instanceId);
  playCard(state, de.instanceId);
  playCard(state, corr.instanceId);

  // Under Corruption, Shrug It Off displays cost 0, spends 0 energy, and exhausts -> triggers Feel No Pain (+3 block), Charon's Ashes (3 dmg), Dark Embrace (+1 draw)
  const shrugDesc = formatCardDescription(shrug, { player: state.player });
  assert.equal(shrugDesc.displayCost, '0');
  assert.equal(shrugDesc.costReducedNow, true);

  const energyBeforeShrug = state.player.energy;
  playCard(state, shrug.instanceId);
  assert.equal(state.player.energy, energyBeforeShrug);
  assert.equal(state.player.block, 8 + 3); // 8 from Shrug + 3 from Feel No Pain
  assert.equal(enemy.hp, 117); // 3 from Charon's Ashes
  assert.equal(state.combat.exhaustPile.some((c) => c.instanceId === shrug.instanceId), true);
  assert.equal(state.combat.hand.length, 2); // 1 drawn by Shrug + 1 drawn by Dark Embrace

  // Second Wind exhausts all non-Attack cards in hand and grants block per card
  delete state.player.statuses.corruption;
  delete state.player.statuses.darkEmbrace;
  state.player.block = 0;
  const secondWind = createCardInstance(state, 'second_wind', false); // 5 block per non-attack
  const wound = createCardInstance(state, 'slimed', false);
  const curse = createCardInstance(state, 'regret', false);
  const keepAtk = createCardInstance(state, 'strike', false);
  state.combat.hand = [secondWind, wound, curse, keepAtk];
  playCard(state, secondWind.instanceId);
  // Exhausted wound + curse (2 cards) -> Second Wind +10 block, Feel No Pain +6 block = 16 block; Strike remains in hand!
  assert.equal(state.player.block, 16);
  assert.equal(state.combat.hand.length, 1);
  assert.equal(state.combat.hand[0].instanceId, keepAtk.instanceId);

  // True Grit+ lets player interactively choose which card in hand to exhaust
  const trueGritPlus = createCardInstance(state, 'true_grit', true);
  const clumsy = createCardInstance(state, 'clumsy', false);
  state.combat.hand = [trueGritPlus, keepAtk, clumsy];
  playCard(state, trueGritPlus.instanceId);
  assert.equal(state.combat.pendingCardChoice?.mode, 'exhaust');
  assert.equal(resolveCardChoice(state, clumsy.instanceId).ok, true);
  assert.equal(state.combat.pendingCardChoice, null);
  assert.equal(state.combat.hand.length, 1);
  assert.equal(state.combat.hand[0].instanceId, keepAtk.instanceId);

  // Fiend Fire exhausts entire remaining hand and deals 7 dmg per exhausted card
  enemy.hp = 80;
  const fiendFire = createCardInstance(state, 'fiend_fire', false);
  state.combat.hand = [
    fiendFire,
    createCardInstance(state, 'strike', false),
    createCardInstance(state, 'defend', false),
    createCardInstance(state, 'strike', false),
  ];
  state.player.energy = 5;
  playCard(state, fiendFire.instanceId, enemy.id);
  // 3 hand cards exhausted -> Charon's Ashes (3*3=9) + Fiend Fire hits (7*3=21) + Fiend Fire itself exhausts (Charon's Ashes +3) = 33 dmg!
  assert.equal(enemy.hp, 80 - 33);
  assert.equal(state.combat.hand.length, 0);
});

test('Block archetype & Keywords: Barricade, Entrench, Flame Barrier, Retain (Steadfast Guard), Ethereal (Ghostly Armor), Innate (Ambush Slash), Reaper, Armaments+, Anger, and Flex', () => {
  // 1. Innate Ambush Slash is guaranteed in Turn 1 hand even in a 20-card deck
  const deckSpecs = Array.from({ length: 19 }, () => 'strike').concat(['ambush_slash']);
  const state = setupCustomCombat(1601, ENCOUNTERS.floor1[0], deckSpecs);
  assert.equal(state.combat.hand.some((c) => c.cardId === 'ambush_slash'), true);

  const enemy = state.combat.enemies[0];
  enemy.hp = 100;
  enemy.maxHp = 100;
  enemy.intent = { id: 'multi_poke', name: '二连刺', type: 'attack', damage: 4, hits: 2 };

  // 2. Barricade + Flame Barrier + Entrench + Steadfast Guard (Retain) + Ghostly Armor (Ethereal)
  state.player.energy = 10;
  const barricade = createCardInstance(state, 'barricade', false);
  const fb = createCardInstance(state, 'flame_barrier', false); // 12 block, 4 thorns per hit
  const entrench = createCardInstance(state, 'entrench', false); // doubles block -> 24
  const retainCard = createCardInstance(state, 'steadfast_guard', false);
  const ghostly = createCardInstance(state, 'ghostly_armor', false);
  state.combat.hand = [barricade, fb, entrench, retainCard, ghostly];

  playCard(state, barricade.instanceId);
  playCard(state, fb.instanceId);
  playCard(state, entrench.instanceId);
  assert.equal(state.player.block, 24);

  // End Turn: Ghostly Armor exhausts (Ethereal), Steadfast Guard stays in hand (Retain), Enemy hits 4x2 (8 blocked -> 16 block left, takes 4x2=8 Flame Barrier damage), Barricade preserves remaining 16 block on Turn 2!
  endPlayerTurn(state);
  assert.equal(state.combat.exhaustPile.some((c) => c.instanceId === ghostly.instanceId), true);
  assert.equal(state.combat.hand.some((c) => c.instanceId === retainCard.instanceId), true);
  assert.equal(enemy.hp, 92);
  assert.equal(state.player.block, 16);
  assert.equal(state.player.statuses.flameBarrier, undefined);

  // 3. Flex temporary +2 Strength decays at end of turn; Armaments+ upgrades entire hand; Anger copies self to discard; Reaper heals unblocked AoE damage
  const flex = createCardInstance(state, 'flex', false);
  const armPlus = createCardInstance(state, 'armaments', true);
  const anger = createCardInstance(state, 'anger', false);
  const reaper = createCardInstance(state, 'reaper', false);
  state.player.hp = 50;
  state.player.energy = 6;
  state.combat.hand = [flex, armPlus, anger, reaper];
  state.combat.discardPile = [];

  playCard(state, flex.instanceId);
  assert.equal(state.player.statuses.strength, 2);

  playCard(state, armPlus.instanceId);
  assert.equal(anger.upgraded, true);
  assert.equal(reaper.upgraded, true); // Reaper+ base 5 + 2 Str = 7 dmg & 7 heal!

  const discardBeforeAnger = state.combat.discardPile.length;
  playCard(state, anger.instanceId, enemy.id);
  // Anger itself + 1 copy = +2 cards in discardPile
  assert.equal(state.combat.discardPile.length, discardBeforeAnger + 2);

  playCard(state, reaper.instanceId);
  assert.equal(state.player.hp, 57);

  enemy.intent = { id: 'idle', name: '待机', type: 'buff' };
  endPlayerTurn(state);
  assert.equal(state.player.statuses.strength ?? 0, 0);
});

test('Curses (Clumsy, Doubt, Regret), Burn status, Relics (Paper Phrog, Torii, Tungsten Rod, Horn Cleat, Velvet Choker, Meat on the Bone, Black Blood, Sacred Bark), Hexaghost, and Slime Boss 50% Split', () => {
  // 1. Paper Phrog boosts Vulnerable to 1.75x
  const phrogPlayer = { statuses: {}, relics: ['paper_phrog'] };
  assert.equal(calculateAttackDamage(12, phrogPlayer, { statuses: { vulnerable: 1 } }), 21);

  // 2. Curses, Burn, Torii, Tungsten Rod, Horn Cleat (Turn 2 +14 block), Velvet Choker (6-card limit), Sacred Bark (2x potions)
  const state = setupCustomCombat(1701, {
    id: 'relic_curse_test',
    name: '遗物诅咒测试',
    enemies: [{ templateId: 'hexaghost' }],
  });
  const hexa = state.combat.enemies[0];
  assert.equal(hexa.intent.id, 'activate_flames'); // Hexaghost Turn 1 Activate Flames

  state.player.relics.push('torii', 'tungsten_rod', 'horn_cleat', 'velvet_choker', 'sacred_bark');
  state.player.hp = 60;
  state.player.potions = ['swift_potion', 'explosive_potion'];

  // Sacred Bark doubles Explosive Potion (10 -> 20 AoE damage) & Swift Potion (3 -> 6 draw)
  const hpBeforePot = hexa.hp;
  assert.equal(usePotion(state, 1).ok, true);
  assert.equal(hexa.hp, hpBeforePot - 20);

  // Velvet Choker blocks 7th card in the same turn
  state.player.energy = 10;
  state.combat.hand = Array.from({ length: 7 }, () => createCardInstance(state, 'anger', false));
  for (let i = 0; i < 6; i += 1) {
    assert.equal(playCard(state, state.combat.hand[0].instanceId, hexa.id).ok, true);
  }
  const seventhRes = playCard(state, state.combat.hand[0].instanceId, hexa.id);
  assert.equal(seventhRes.ok, false);
  assert.ok(seventhRes.reason.includes('天鹅绒颈圈'));

  // Put Burn (2 non-attack dmg -> Tungsten Rod reduces to 1), Regret (3 HP loss -> Tungsten Rod reduces to 2), Doubt (1 Weak), Clumsy (Ethereal) in hand
  state.combat.hand = [
    createCardInstance(state, 'burn', false),
    createCardInstance(state, 'regret', false),
    createCardInstance(state, 'doubt', false),
    createCardInstance(state, 'clumsy', false),
  ];
  // Hexaghost Sear deals 6 attack dmg -> wait: make it deal 5 attack dmg to verify Torii (5 -> 1) + Tungsten Rod (1 -> 0)!
  hexa.intent = {
    id: 'sear',
    name: '炙烤',
    type: 'attack_debuff',
    damage: 5,
    addDiscardCards: [{ cardId: 'burn', count: 1 }],
  };
  const hpBeforeEnd = state.player.hp;
  endPlayerTurn(state);

  // Burn dealt 2-1=1, Regret lost 2-1=1, Hexaghost 5 attack reduced to 1 by Torii then 0 by Tungsten Rod => total HP loss = 2!
  assert.equal(state.player.hp, hpBeforeEnd - 2);
  assert.equal(state.player.statuses.weak, 1); // Doubt applied 1 Weak surviving into Turn 2
  assert.equal(state.combat.exhaustPile.some((c) => c.cardId === 'clumsy'), true);
  assert.equal(state.player.block, 14); // Horn Cleat granted 14 block on Turn 2!
  assert.equal(state.combat.discardPile.some((c) => c.cardId === 'burn'), true);

  // 3. Slime Boss interrupts intent at <= 50% HP and splits into 2 slimes inheriting current HP, plus Meat on the Bone + Black Blood victory healing
  const slimeState = setupCustomCombat(1702, {
    id: 'slime_boss_test',
    name: '史莱姆老大测试',
    enemies: [{ templateId: 'slime_boss' }],
  });
  slimeState.player.relics = ['black_blood', 'meat_on_the_bone'];
  slimeState.player.hp = 30; // <= 50% of 80 -> Meat on the Bone (+12) + Black Blood (+12) on victory!

  const boss = slimeState.combat.enemies[0];
  boss.hp = 80;
  boss.maxHp = 140;
  const bludgeon = createCardInstance(slimeState, 'bludgeon', false); // 32 dmg -> drops boss to 48 HP (<= 70)
  slimeState.combat.hand = [bludgeon];
  playCard(slimeState, bludgeon.instanceId, boss.id);
  assert.equal(boss.hp, 48);
  assert.equal(boss.intent.id, 'split');

  endPlayerTurn(slimeState);
  assert.equal(slimeState.combat.enemies.length, 2);
  assert.equal(slimeState.combat.enemies[0].hp, 48);
  assert.equal(slimeState.combat.enemies[1].hp, 48);

  // Defeat both split slimes -> verify Meat on the Bone (+12) + Black Blood (+12) heals 30 -> 54!
  slimeState.combat.enemies[0].hp = 1;
  slimeState.combat.enemies[1].hp = 10;
  slimeState.player.hp = 30;
  const cleave = createCardInstance(slimeState, 'cleave', true); // 11 AoE dmg
  slimeState.combat.hand = [cleave];
  playCard(slimeState, cleave.instanceId);
  assert.equal(slimeState.combat.status, 'victory');
  assert.equal(slimeState.player.hp, 54);
});

test('New Boss Relics: Runic Pyramid hand retention, Snecko Eye Confusion (+2 draw & 0-3 cost), and Philosopher Stone enemy Strength (+Slime split)', () => {
  // 1. Runic Pyramid: retains non-ethereal hand cards, still exhausts Ethereal, still triggers Burn and keeps it, respects hand cap 10
  const pyrState = createNewRun({ seed: 2401 });
  grantRelicToPlayer(pyrState, 'runic_pyramid');
  startCombat(pyrState, ENCOUNTERS.floor1[0], 'normal');
  pyrState.combat.enemies[0].intent = { id: 'wait', name: '蓄力', type: 'buff', summary: '蓄力' };

  const strike = createCardInstance(pyrState, 'strike', false);
  const dazed = createCardInstance(pyrState, 'dazed', false);
  const burn = createCardInstance(pyrState, 'burn', false);
  pyrState.combat.hand = [strike, dazed, burn];
  pyrState.combat.discardPile = [];
  pyrState.combat.drawPile = Array.from({ length: 12 }, () => createCardInstance(pyrState, 'defend', false));

  const hpBefore = pyrState.player.hp;
  endPlayerTurn(pyrState);
  assert.equal(pyrState.player.hp, hpBefore - 2, 'Burn should still deal 2 damage at end of turn');
  assert.equal(pyrState.combat.exhaustPile.some((c) => c.instanceId === dazed.instanceId), true);
  assert.equal(pyrState.combat.hand.some((c) => c.instanceId === strike.instanceId), true);
  assert.equal(pyrState.combat.hand.some((c) => c.instanceId === burn.instanceId), true);
  assert.equal(pyrState.combat.discardPile.length, 0);
  assert.equal(pyrState.combat.hand.length, 7); // 2 retained + 5 drawn!

  // 2. Snecko Eye: +2 draw per turn (7 total), Confusion status applied, randomized 0-3 costs on playable non-X cards, Corruption overrides skills to 0, permanent deck untouched
  const sneckoState = createNewRun({ seed: 2402 });
  grantRelicToPlayer(sneckoState, 'snecko_eye');
  sneckoState.player.deck = [
    createCardInstance(sneckoState, 'bludgeon', false), // cost 3
    createCardInstance(sneckoState, 'whirlwind', false), // X-cost
    createCardInstance(sneckoState, 'dazed', false), // unplayable
    createCardInstance(sneckoState, 'shrug_it_off', false), // skill cost 1
    createCardInstance(sneckoState, 'strike', false),
    createCardInstance(sneckoState, 'defend', false),
    createCardInstance(sneckoState, 'bash', false),
    createCardInstance(sneckoState, 'heavy_blade', false),
  ];
  startCombat(sneckoState, ENCOUNTERS.floor1[0], 'normal');

  assert.equal(sneckoState.player.statuses.confused, 1);
  assert.equal(sneckoState.combat.hand.length, 7);
  for (const c of sneckoState.combat.hand) {
    const st = getCardStats(c);
    if (st.unplayable || st.isXCost) {
      assert.equal(c.combatCost, undefined, `Unplayable/X card ${st.cardId} must not get combatCost`);
    } else {
      assert.ok(
        Number.isInteger(c.combatCost) && c.combatCost >= 0 && c.combatCost <= 3,
        `Expected 0..3 combatCost on ${st.cardId}, got ${c.combatCost}`
      );
    }
  }
  // Corruption still forces Skills to 0 even when Snecko rolled combatCost = 3
  const skillCard = sneckoState.combat.hand.find((c) => getCardStats(c).type === 'skill');
  assert.ok(skillCard);
  skillCard.combatCost = 3;
  assert.equal(getEffectiveCardCost(getCardStats(skillCard), sneckoState.player), 3);
  const raisedDesc = formatCardDescription(skillCard, { player: sneckoState.player });
  assert.equal(raisedDesc.costIncreasedNow, true);
  assert.equal(raisedDesc.costRandomizedNow, true);
  sneckoState.player.statuses.corruption = 1;
  assert.equal(getEffectiveCardCost(getCardStats(skillCard), sneckoState.player), 0);

  // Permanent deck instances never get polluted with combatCost
  assert.equal(sneckoState.player.deck.every((c) => c.combatCost === undefined), true);

  // 3. Philosopher's Stone: +1 maxEnergy, enemies start with +1 Strength, Slime Boss split children also get +1 Strength
  const stoneState = createNewRun({ seed: 2403 });
  assert.equal(stoneState.player.maxEnergy, 3);
  grantRelicToPlayer(stoneState, 'philosophers_stone');
  assert.equal(stoneState.player.maxEnergy, 4);
  startCombat(stoneState, { id: 'slime_stone', name: '史莱姆老大', enemies: [{ templateId: 'slime_boss' }] }, 'boss');
  const sb = stoneState.combat.enemies[0];
  assert.equal(sb.statuses.strength, 1);

  sb.hp = 60;
  sb.maxHp = 140;
  const bash = createCardInstance(stoneState, 'bash', false);
  stoneState.combat.hand = [bash];
  playCard(stoneState, bash.instanceId, sb.id);
  assert.equal(sb.intent.id, 'split');
  endPlayerTurn(stoneState);
  assert.equal(stoneState.combat.enemies.length, 2);
  assert.equal(stoneState.combat.enemies[0].statuses.strength, 1);
  assert.equal(stoneState.combat.enemies[1].statuses.strength, 1);
});

test('Combat Tactics Engine: Lethal & Shield-Break projections (incl. Curl Up, Paper Phrog, Multi-hit, X-cost, Potion) and Card Synergy/Warning detection', () => {
  const state = createNewRun({ seed: 2501, skipNeow: true });
  grantRelicToPlayer(state, 'paper_phrog');
  grantRelicToPlayer(state, 'charons_ashes');
  grantRelicToPlayer(state, 'sacred_bark');
  startCombat(
    state,
    {
      id: 'tactics_enc',
      name: '联动测试',
      enemies: [{ templateId: 'gremlin_nob' }, { templateId: 'red_louse' }],
    },
    'elite'
  );

  const nob = state.combat.enemies[0];
  const louse = state.combat.enemies[1];
  nob.hp = 12;
  nob.maxHp = 84;
  nob.block = 6;
  nob.statuses.enrage = 2;
  nob.statuses.vulnerable = 2;

  louse.hp = 9;
  louse.maxHp = 15;
  louse.block = 0;
  louse.statuses.curlUp = 5;

  state.player.statuses.strength = 2;
  state.player.statuses.feelNoPain = 3;
  state.player.block = 10;

  const strike = createCardInstance(state, 'strike', false); // (6 + 2) * 1.75 = 14 -> breaks 6 block, deals 8 HP -> 4 HP left (Shield Break, NOT Lethal)
  const bludgeon = createCardInstance(state, 'bludgeon', false); // (32 + 2) * 1.75 = 59 -> Shield Break + Lethal
  const twin = createCardInstance(state, 'twin_strike', false); // (5 + 2) = 7 x 2 vs Louse (9 HP, Curl Up 5): hit 1 deals 7 (2 HP left, Curl Up +5 block), hit 2 deals 7 (5 blocked, 2 HP -> Lethal!)
  const defend = createCardInstance(state, 'defend', false);
  const secondWind = createCardInstance(state, 'second_wind', false);
  const bodySlam = createCardInstance(state, 'body_slam', false);
  state.combat.hand = [strike, bludgeon, twin, defend, secondWind, bodySlam];

  const pStrike = previewCardDamageOnEnemy(state, strike, nob);
  assert.equal(pStrike.totalDamage, 14);
  assert.equal(pStrike.isShieldBreak, true);
  assert.equal(pStrike.isLethal, false);
  assert.equal(pStrike.remainingHp, 4);

  const pBludgeon = previewCardDamageOnEnemy(state, bludgeon, nob);
  assert.equal(pBludgeon.isShieldBreak, true);
  assert.equal(pBludgeon.isLethal, true);
  assert.equal(pBludgeon.remainingHp, 0);

  // Louse with 10 HP + Curl Up 5 vs Twin Strike (7x2): hit 1 -> 3 HP + 5 block; hit 2 -> 5 blocked, 2 HP -> 1 HP left (NOT lethal!)
  louse.hp = 10;
  const pTwinNotLethal = previewCardDamageOnEnemy(state, twin, louse);
  assert.equal(pTwinNotLethal.isLethal, false);
  assert.equal(pTwinNotLethal.remainingHp, 1);

  // Fire Potion with Sacred Bark = 40 fixed damage -> Lethal on Nob (6 block + 12 HP)
  const pFire = previewPotionDamageOnEnemy(state, 'fire_potion', nob);
  assert.equal(pFire.totalDamage, 40);
  assert.equal(pFire.isShieldBreak, true);
  assert.equal(pFire.isLethal, true);

  // Synergy & Warning checks:
  // 1) Defend (Skill) triggers Gremlin Nob Enrage warning
  const synDefend = computeCardSynergies(state, defend);
  assert.ok(synDefend.enemyTriggers.some((t) => t.enemyId === nob.id && t.statusKey === 'enrage' && t.tone === 'warn'));
  assert.ok(synDefend.callouts.some((c) => c.tone === 'warn' && c.text.includes('激怒')));

  // 2) Strike vs Vulnerable Nob highlights Strength, enemy Vulnerable, and Paper Phrog relic
  const synStrike = computeCardSynergies(state, strike, nob.id);
  assert.ok(synStrike.relicHighlights.some((r) => r.relicId === 'paper_phrog' && r.tone === 'buff'));
  assert.ok(synStrike.playerStatusHighlights.some((s) => s.key === 'strength' && s.tone === 'buff'));
  assert.ok(synStrike.enemyTriggers.some((t) => t.enemyId === nob.id && t.statusKey === 'vulnerable' && t.tone === 'buff'));

  // 3) Second Wind highlights Feel No Pain, Charon's Ashes, and other non-attack cards in hand (defend)
  const synSecondWind = computeCardSynergies(state, secondWind);
  assert.ok(synSecondWind.relicHighlights.some((r) => r.relicId === 'charons_ashes'));
  assert.ok(synSecondWind.playerStatusHighlights.some((s) => s.key === 'feelNoPain'));
  assert.ok(synSecondWind.affectedHandCards.some((h) => h.instanceId === defend.instanceId && h.tone === 'exhaust'));
  assert.equal(synSecondWind.affectedHandCards.some((h) => h.instanceId === strike.instanceId), false);

  // 4) Body Slam highlights player's current Block pill
  const synBodySlam = computeCardSynergies(state, bodySlam, nob.id);
  assert.equal(synBodySlam.highlightPlayerBlock, true);
});

test('The Silent Poison archetype: Deadly Poison, Snecko Skull, Bane double-hit, Catalyst 2x/3x, Noxious Fumes, Poison tick skipping lethal enemy intent, The Specimen, Corpse Explosion chain, and Poison-Lethal preview', () => {
  const state = createNewRun({ seed: 6101, characterId: 'silent', skipNeow: true });
  startCombat(
    state,
    {
      id: 'silent_poison_test',
      name: '静默剧毒测试',
      enemies: [{ templateId: 'cultist' }, { templateId: 'red_louse' }],
    },
    'normal'
  );
  const [cultist, louse] = state.combat.enemies;
  cultist.hp = 35;
  cultist.maxHp = 35;
  cultist.block = 10;
  cultist.intent = { id: 'big_hit', name: '重击', type: 'attack', damage: 20, hits: 1 };
  louse.hp = 30;
  louse.maxHp = 30;
  louse.block = 0;

  grantRelicToPlayer(state, 'snecko_skull');
  grantRelicToPlayer(state, 'the_specimen');
  state.player.energy = 10;

  const dp = createCardInstance(state, 'deadly_poison', false); // 5 + 1 skull = 6 poison
  const bane = createCardInstance(state, 'bane', false); // 7 dmg x2 on poisoned target
  const catPlus = createCardInstance(state, 'catalyst', true); // 3x poison (+1 skull)
  const ce = createCardInstance(state, 'corpse_explosion', false); // 6+1=7 poison + corpseExplosion
  const fumes = createCardInstance(state, 'noxious_fumes', false);
  state.combat.hand = [dp, bane, catPlus, ce, fumes];

  // 1. Deadly Poison applies 5 + 1 (Snecko Skull) = 6 poison
  assert.equal(playCard(state, dp.instanceId, cultist.id).ok, true);
  assert.equal(cultist.statuses.poison, 6);

  // 2. Bane preview & execution deals 2 hits against poisoned enemy (7+7 = 14 -> breaks 10 block + 4 HP -> 31 HP)
  const banePreview = previewCardDamageOnEnemy(state, bane, cultist);
  assert.equal(banePreview.hits, 2);
  assert.equal(banePreview.isShieldBreak, true);
  assert.equal(banePreview.remainingHp, 31);
  assert.equal(playCard(state, bane.instanceId, cultist.id).ok, true);
  assert.equal(cultist.hp, 31);

  // 3. Corpse Explosion adds 6+1=7 poison (now 13) + corpseExplosion 1
  assert.equal(playCard(state, ce.instanceId, cultist.id).ok, true);
  assert.equal(cultist.statuses.poison, 13);
  assert.equal(cultist.statuses.corpseExplosion, 1);

  // 4. Catalyst+ preview predicts Poison-Lethal (13 * 3 + 1 skull = 40 >= 31 HP!)
  const catPreview = previewCardDamageOnEnemy(state, catPlus, cultist);
  assert.equal(catPreview.projectedPoison, 40);
  assert.equal(catPreview.isPoisonLethal, true);
  const catSyn = computeCardSynergies(state, catPlus, cultist.id);
  assert.ok(catSyn.relicHighlights.some((r) => r.relicId === 'snecko_skull'));
  assert.ok(catSyn.callouts.some((c) => c.tone === 'buff' && c.text.includes('催化剂')));

  assert.equal(playCard(state, catPlus.instanceId, cultist.id).ok, true);
  assert.equal(cultist.statuses.poison, 40);

  // 5. End turn -> Cultist ticks 40 poison at start of enemy turn (bypasses block), dies WITHOUT executing 20 dmg attack,
  //    transfers 40 poison via The Specimen AND triggers Corpse Explosion (35 dmg) killing 30 HP Louse immediately!
  const hpBeforeEnd = state.player.hp;
  assert.equal(endPlayerTurn(state).ok, true);
  assert.equal(cultist.hp, 0);
  assert.equal(louse.hp, 0);
  assert.equal(state.combat.status, 'victory');
  assert.equal(state.player.hp, hpBeforeEnd, 'Lethal poison at enemy turn start must skip enemy attack');
});

test('The Silent Shiv & Agile archetype: Blade Dance, Accuracy, Wrist Blade, Envenom, After Image, A Thousand Cuts, Shuriken/Kunai, Finisher, Cunning Potion, and Wraith Form Intangible', () => {
  const state = createNewRun({ seed: 6102, characterId: 'silent', skipNeow: true });
  startCombat(
    state,
    {
      id: 'silent_shiv_test',
      name: '静默小刀测试',
      enemies: [{ templateId: 'jaw_worm' }],
    },
    'normal'
  );
  const enemy = state.combat.enemies[0];
  enemy.hp = 200;
  enemy.maxHp = 200;
  enemy.block = 0;
  enemy.intent = { id: 'chomp', name: '重咬', type: 'attack', damage: 24, hits: 1 };

  grantRelicToPlayer(state, 'wrist_blade');
  grantRelicToPlayer(state, 'shuriken');
  grantRelicToPlayer(state, 'kunai');
  state.player.energy = 12;

  const acc = createCardInstance(state, 'accuracy', false); // +4 on Shiv
  const env = createCardInstance(state, 'envenom', false); // +1 poison on unblocked attack
  const ai = createCardInstance(state, 'after_image', false); // +1 block per card
  const cuts = createCardInstance(state, 'a_thousand_cuts', false); // 1 AoE dmg per card
  const bd = createCardInstance(state, 'blade_dance', false); // adds 3 Shivs
  const fin = createCardInstance(state, 'finisher', false); // 6 dmg per attack played this turn
  const wf = createCardInstance(state, 'wraith_form', false); // 2 Intangible, -1 dex/turn
  state.combat.hand = [acc, env, ai, cuts, bd, fin, wf];

  assert.equal(playCard(state, acc.instanceId).ok, true);
  assert.equal(playCard(state, env.instanceId).ok, true);
  assert.equal(playCard(state, ai.instanceId).ok, true);
  assert.equal(playCard(state, cuts.instanceId).ok, true);
  assert.equal(playCard(state, bd.instanceId).ok, true);

  const shivs = state.combat.hand.filter((c) => c.cardId === 'shiv');
  assert.equal(shivs.length, 3);
  // Each Shiv = base 4 + Accuracy 4 + Wrist Blade 4 = 12 dmg!
  assert.equal(previewCardDamageOnEnemy(state, shivs[0], enemy).perHitDamage, 12);

  // Play all 3 Shivs: triggers Envenom (3 poison), Shuriken (+1 Str on 3rd), Kunai (+1 Dex on 3rd), After Image, A Thousand Cuts
  const blockBeforeShivs = state.player.block;
  for (const s of shivs) {
    assert.equal(playCard(state, s.instanceId, enemy.id).ok, true);
  }
  assert.equal(state.player.statuses.strength, 1, '3 Shivs must trigger Shuriken (+1 Strength)');
  assert.equal(state.player.statuses.dexterity, 1, '3 Shivs must trigger Kunai (+1 Dexterity)');
  assert.equal(enemy.statuses.poison, 3, '3 unblocked Shiv hits must apply 3 Poison via Envenom');
  assert.equal(state.player.block, blockBeforeShivs + 3, 'After Image must grant +1 block per Shiv');
  assert.equal(state.combat.attacksPlayedThisTurn, 3);

  // Finisher hits 3 times (base 6 + 1 Str = 7 x 3 = 21) + 1 A Thousand Cuts = 22
  const finPreview = previewCardDamageOnEnemy(state, fin, enemy);
  assert.equal(finPreview.hits, 3);
  assert.equal(finPreview.perHitDamage, 7);
  const hpBeforeFin = enemy.hp;
  assert.equal(playCard(state, fin.instanceId, enemy.id).ok, true);
  assert.equal(enemy.hp, hpBeforeFin - 22);

  // Cunning Potion adds 3 Shiv+ to hand (6 with Sacred Bark)
  state.player.potions = ['cunning_potion', null, null];
  assert.equal(usePotion(state, 0).ok, true);
  assert.equal(state.combat.hand.filter((c) => c.cardId === 'shiv' && c.upgraded).length, 3);

  // Wraith Form grants 2 Intangible -> Enemy 24 dmg intent previews as 1 and deals at most 1 (fully blocked by 1+ block!)
  assert.equal(playCard(state, wf.instanceId).ok, true);
  assert.equal(state.player.statuses.intangible, 2);
  assert.equal(getEnemyIntentPreview(enemy, state.player).perHitDamage, 1);

  state.player.block = 0; // Ensure unblocked Intangible caps 24 dmg to 1!
  const hpBeforeHit = state.player.hp;
  assert.equal(endPlayerTurn(state).ok, true);
  assert.equal(state.player.hp, hpBeforeHit - 1, 'Intangible must reduce 24 unblocked attack damage to 1');
  assert.equal(state.player.statuses.intangible, 1, 'Intangible decays from 2 -> 1 after Round 1');
  assert.equal(state.player.statuses.dexterity || 0, 0, 'Wraith Form drops Dexterity 1 -> 0 at start of next turn');
});

test('The Silent Discard archetype: pendingDiscard selection, Tactician, Reflex, Tough Bandages, Tingsha, Eviscerate dynamic cost + Wrist Blade, Sneaky Strike refund, Calculated Gamble, Storm of Steel, and Tools of the Trade', () => {
  const state = createNewRun({ seed: 6103, characterId: 'silent', skipNeow: true });
  startCombat(
    state,
    {
      id: 'silent_discard_test',
      name: '静默弃牌测试',
      enemies: [{ templateId: 'slaver_blue' }],
    },
    'normal'
  );
  const enemy = state.combat.enemies[0];
  enemy.hp = 150;
  enemy.maxHp = 150;
  enemy.block = 0;

  grantRelicToPlayer(state, 'tough_bandages');
  grantRelicToPlayer(state, 'tingsha');
  grantRelicToPlayer(state, 'wrist_blade');
  state.player.energy = 3;

  const survivor = createCardInstance(state, 'survivor', false); // 1 cost, 8 block, discard 1
  const tact = createCardInstance(state, 'tactician', true); // +2 energy when discarded
  const refl = createCardInstance(state, 'reflex', false); // +2 draw when discarded
  const evis = createCardInstance(state, 'eviscerate', false); // 3 cost -> 0 after 3 discards!
  const sneaky = createCardInstance(state, 'sneaky_strike', false); // 2 cost, refunds 2 if discarded
  const prep = createCardInstance(state, 'prepared', true); // 0 cost, draw 2, discard 2
  const gamble = createCardInstance(state, 'calculated_gamble', true); // 0 cost, discard all, draw equal, NO exhaust!
  state.combat.drawPile = [
    createCardInstance(state, 'strike', false),
    createCardInstance(state, 'defend', false),
    createCardInstance(state, 'strike', false),
    createCardInstance(state, 'defend', false),
    createCardInstance(state, 'strike', false),
  ];
  state.combat.hand = [survivor, tact, refl, evis, sneaky, prep, gamble];

  // Synergy check: hovering Survivor highlights Tough Bandages, Tingsha, and Tactician/Reflex/Eviscerate/Sneaky in hand
  const survSyn = computeCardSynergies(state, survivor);
  assert.ok(survSyn.relicHighlights.some((r) => r.relicId === 'tough_bandages'));
  assert.ok(survSyn.relicHighlights.some((r) => r.relicId === 'tingsha'));
  assert.ok(survSyn.affectedHandCards.some((h) => h.instanceId === tact.instanceId && h.tone === 'discard'));
  assert.ok(survSyn.affectedHandCards.some((h) => h.instanceId === refl.instanceId && h.tone === 'discard'));

  // 1. Play Survivor -> enters pendingDiscard (remaining 1), blocks other plays & endTurn until resolved
  assert.equal(playCard(state, survivor.instanceId).ok, true);
  assert.equal(state.combat.pendingDiscard.remaining, 1);
  assert.equal(endPlayerTurn(state).ok, false);
  assert.equal(playCard(state, sneaky.instanceId, enemy.id).ok, false);

  // 2. Discard Tactician+ -> clears pendingDiscard, +2 energy (2 -> 4), +3 block (Tough Bandages: 8 -> 11), 3 dmg (Tingsha: 150 -> 147)
  assert.equal(discardHandCard(state, tact.instanceId).ok, true);
  assert.equal(state.combat.pendingDiscard, null);
  assert.equal(state.player.energy, 4);
  assert.equal(state.player.block, 11);
  assert.equal(enemy.hp, 147);
  assert.equal(state.combat.discardedThisTurn, 1);
  assert.equal(getEffectiveCardCost(getCardStats(evis), state.player, state.combat), 2);

  // 3. Play Sneaky Strike (2 cost, refunds 2 -> net 0 energy!)
  assert.equal(playCard(state, sneaky.instanceId, enemy.id).ok, true);
  assert.equal(state.player.energy, 4);

  // 4. Play Prepared+ (draw 2, discard 2) -> discard Reflex (+2 draw!) & 1 other card -> discardedThisTurn = 3 -> Eviscerate costs 0!
  assert.equal(playCard(state, prep.instanceId).ok, true);
  assert.equal(state.combat.pendingDiscard.remaining, 2);
  const handCountBeforeReflex = state.combat.hand.length;
  assert.equal(discardHandCard(state, refl.instanceId).ok, true);
  assert.equal(state.combat.hand.length, handCountBeforeReflex - 1 + 2, 'Reflex must draw 2 cards on manual discard');
  const filler = state.combat.hand.find((c) => c.instanceId !== evis.instanceId && c.instanceId !== gamble.instanceId);
  assert.equal(discardHandCard(state, filler.instanceId).ok, true);
  assert.equal(state.combat.pendingDiscard, null);
  assert.equal(state.combat.discardedThisTurn, 3);

  // 5. Eviscerate is now 0 cost AND benefits from Wrist Blade (+4 per hit => 7+4 = 11 x 3 = 33 dmg)!
  assert.equal(getEffectiveCardCost(getCardStats(evis), state.player, state.combat), 0);
  const evisPreview = previewCardDamageOnEnemy(state, evis, enemy);
  assert.equal(evisPreview.perHitDamage, 11);
  assert.equal(evisPreview.totalDamage, 33);
  const hpBeforeEvis = enemy.hp;
  assert.equal(playCard(state, evis.instanceId, enemy.id).ok, true);
  assert.equal(enemy.hp, hpBeforeEvis - 33);

  // 6. Calculated Gamble+ discards all hand, draws equal count, and goes to discardPile (not exhaustPile!)
  const otherCards = state.combat.hand.length - 1;
  assert.equal(playCard(state, gamble.instanceId).ok, true);
  assert.equal(state.combat.exhaustPile.some((c) => c.instanceId === gamble.instanceId), false);
  assert.equal(state.combat.discardPile.some((c) => c.instanceId === gamble.instanceId), true);
  assert.ok(state.combat.hand.length <= otherCards);

  // 7. Storm of Steel+ discards all remaining hand and converts each into Shiv+
  const sos = createCardInstance(state, 'storm_of_steel', true);
  const d1 = createCardInstance(state, 'defend', false);
  const d2 = createCardInstance(state, 'strike', false);
  state.combat.hand = [sos, d1, d2];
  assert.equal(playCard(state, sos.instanceId).ok, true);
  assert.equal(state.combat.hand.length, 2);
  assert.equal(state.combat.hand.every((c) => c.cardId === 'shiv' && c.upgraded), true);

  // 8. End-of-turn natural discard MUST NOT trigger Tough Bandages, Tingsha, Tactician, or Reflex
  const enemyHpBeforeEnd = enemy.hp;
  const tactEnd = createCardInstance(state, 'tactician', true);
  state.combat.hand = [tactEnd];
  state.player.block = 0;
  // Also test Tools of the Trade at next turn start
  state.player.statuses.toolsOfTheTrade = 1;
  assert.equal(endPlayerTurn(state).ok, true);
  assert.equal(enemy.hp, enemyHpBeforeEnd, 'Natural end-of-turn discard must NOT trigger Tingsha');
  assert.equal(state.player.energy, state.player.maxEnergy, 'Natural end-of-turn discard must NOT trigger Tactician');
  assert.equal(state.combat.pendingDiscard?.sourceName, '必备工具', 'Tools of the Trade must prompt 1 discard at turn start');
});

test('Shop-exclusive Colorless Cards (20): Flash of Steel, Finesse, Dramatic Entrance, Blind+/Trip+ AoE, Bandage Up, Apotheosis, Hand of Greed, Master of Strategy, Sadistic Nature & battle stats', () => {
  assert.equal(COLORLESS_CARD_POOLS.uncommon.length, 12);
  assert.equal(COLORLESS_CARD_POOLS.rare.length, 8);
  assert.equal(COLORLESS_CARD_POOLS.all.length, 20);
  for (const cid of COLORLESS_CARD_POOLS.all) {
    assert.equal(CARD_LIBRARY[cid].character, 'colorless');
    assert.equal(CARD_LIBRARY[cid].shopOnly, true);
  }

  // Verify Blind & Trip upgrade diff highlights target change from 目标 -> 所有敌人
  const blindPrev = formatUpgradePreview({ instanceId: 'b1', cardId: 'blind', upgraded: false });
  assert.ok(blindPrev.segments.some((s) => s.changed && s.text.includes('所有敌人')));
  const tripPrev = formatUpgradePreview({ instanceId: 't1', cardId: 'trip', upgraded: false });
  assert.ok(tripPrev.segments.some((s) => s.changed && s.text.includes('所有敌人')));

  // Build 2-enemy encounter to test AoE, debuff triggers, Hand of Greed kill gold, Apotheosis, and stats
  const state = createNewRun({ seed: 9191, characterId: 'silent', skipNeow: true, unlockAllOverride: true });
  state.player.hp = 50;
  state.player.maxHp = 70;
  state.player.gold = 100;
  state.player.relics = ['wrist_blade'];
  state.player.deck = [
    createCardInstance(state, 'dramatic_entrance', false),
    createCardInstance(state, 'strike', false),
    createCardInstance(state, 'defend', false),
    createCardInstance(state, 'strike', false),
    createCardInstance(state, 'defend', false),
    createCardInstance(state, 'strike', false),
    createCardInstance(state, 'defend', false),
  ];

  startCombat(
    state,
    {
      id: 'colorless_test_enc',
      name: '双敌试炼',
      enemies: [
        { templateId: 'jaw_worm', customHp: 50 },
        { templateId: 'cultist', customHp: 50 },
      ],
    },
    'normal'
  );
  const [e1, e2] = state.combat.enemies;

  // 1. Dramatic Entrance is Innate -> starts in T1 hand, 0 cost, benefits from Wrist Blade (+4 => 12 dmg AoE), exhausts!
  const de = state.combat.hand.find((c) => c.cardId === 'dramatic_entrance');
  assert.ok(de, 'Dramatic Entrance must start in Turn 1 hand (Innate)');
  assert.equal(playCard(state, de.instanceId).ok, true);
  assert.equal(e1.hp, 38);
  assert.equal(e2.hp, 38);
  assert.equal(state.combat.exhaustPile.some((c) => c.instanceId === de.instanceId), true);
  assert.ok(state.stats.totalDamageDealt >= 24);

  // 2. Bandage Up+ heals 6 HP and exhausts
  const bandage = createCardInstance(state, 'bandage_up', true);
  state.combat.hand.push(bandage);
  assert.equal(playCard(state, bandage.instanceId).ok, true);
  assert.equal(state.player.hp, 56);
  assert.equal(state.combat.exhaustPile.some((c) => c.instanceId === bandage.instanceId), true);

  // 3. Sadistic Nature (5 dmg per debuff applied) + Blind+ (AoE 2 weak) + Trip+ (AoE 2 vuln) + synergy check
  const sadistic = createCardInstance(state, 'sadistic_nature', false);
  const blindUp = createCardInstance(state, 'blind', true);
  const tripUp = createCardInstance(state, 'trip', true);
  state.combat.hand.push(sadistic, blindUp, tripUp);
  assert.equal(playCard(state, sadistic.instanceId).ok, true);
  assert.equal(state.player.statuses.sadisticNature, 5);

  const blindSyn = computeCardSynergies(state, blindUp);
  assert.equal(
    blindSyn.playerStatusHighlights.some((s) => s.key === 'sadisticNature'),
    true,
    'Hovering debuff card must highlight Sadistic Nature status'
  );

  assert.equal(playCard(state, blindUp.instanceId).ok, true);
  assert.equal(e1.statuses.weak, 2);
  assert.equal(e2.statuses.weak, 2);
  assert.equal(e1.hp, 33, 'Sadistic Nature must deal 5 dmg to e1 on Weak');
  assert.equal(e2.hp, 33, 'Sadistic Nature must deal 5 dmg to e2 on Weak');

  assert.equal(playCard(state, tripUp.instanceId).ok, true);
  assert.equal(e1.statuses.vulnerable, 2);
  assert.equal(e2.statuses.vulnerable, 2);
  assert.equal(e1.hp, 28, 'Sadistic Nature must deal 5 dmg to e1 on Vulnerable');
  assert.equal(e2.hp, 28, 'Sadistic Nature must deal 5 dmg to e2 on Vulnerable');

  // 4. Flash of Steel (0-cost attack -> Wrist Blade +4 = 7, x1.5 vuln = 10, draws 1) & Finesse (2 block, draws 1)
  const flash = createCardInstance(state, 'flash_of_steel', false);
  const fin = createCardInstance(state, 'finesse', false);
  const mos = createCardInstance(state, 'master_of_strategy', false);
  state.combat.drawPile.push(
    createCardInstance(state, 'strike', false),
    createCardInstance(state, 'defend', false),
    createCardInstance(state, 'strike', false),
    createCardInstance(state, 'defend', false),
    createCardInstance(state, 'strike', false)
  );
  state.combat.hand = [flash, fin, mos];
  assert.equal(playCard(state, flash.instanceId, e1.id).ok, true);
  assert.equal(e1.hp, 18); // (3 + 4 Wrist Blade) * 1.5 = 10
  assert.equal(state.combat.hand.length, 3); // -1 played +1 drawn

  assert.equal(playCard(state, fin.instanceId).ok, true);
  assert.equal(state.player.block, 2);
  assert.equal(state.stats.totalBlockGained, 2);

  assert.equal(playCard(state, mos.instanceId).ok, true);
  assert.equal(state.combat.exhaustPile.some((c) => c.instanceId === mos.instanceId), true);

  // 5. Apotheosis upgrades all cards in hand, drawPile, and discardPile without mutating master deck!
  const apo = createCardInstance(state, 'apotheosis', false);
  const unupHand = createCardInstance(state, 'strike', false);
  const unupDraw = createCardInstance(state, 'defend', false);
  const unupDisc = createCardInstance(state, 'bash', false);
  state.combat.hand = [apo, unupHand];
  state.combat.drawPile = [unupDraw];
  state.combat.discardPile = [unupDisc];
  state.player.energy = 5;

  const apoSyn = computeCardSynergies(state, apo);
  assert.equal(
    apoSyn.affectedHandCards.some((x) => x.instanceId === unupHand.instanceId && x.tone === 'upgrade'),
    true
  );

  assert.equal(playCard(state, apo.instanceId).ok, true);
  assert.equal(unupHand.upgraded, true);
  assert.equal(unupDraw.upgraded, true);
  assert.equal(unupDisc.upgraded, true);
  assert.equal(
    state.player.deck.every((c) => !c.upgraded),
    true,
    'Apotheosis must NOT permanently mutate master deck cards'
  );

  // 6. Hand of Greed: non-lethal does NOT grant gold; lethal grants +20 permanent gold & tracks stats/preview!
  const hog = createCardInstance(state, 'hand_of_greed', false);
  state.combat.hand = [hog];
  state.player.energy = 6;
  e1.statuses = {};
  e2.statuses = {};
  e1.hp = 30;
  e2.hp = 18;

  const hogNonLethalPreview = previewCardDamageOnEnemy(state, hog, e1);
  assert.equal(hogNonLethalPreview.isLethal, false);
  assert.equal(hogNonLethalPreview.goldOnKill, 20);
  const goldBeforeMiss = state.player.gold;
  assert.equal(playCard(state, hog.instanceId, e1.id).ok, true);
  assert.equal(e1.hp, 10);
  assert.equal(state.player.gold, goldBeforeMiss, 'Hand of Greed must not grant gold on non-lethal hit');

  const hogLethal = createCardInstance(state, 'hand_of_greed', false);
  state.combat.hand = [hogLethal];
  const hogLethalPreview = previewCardDamageOnEnemy(state, hogLethal, e2);
  assert.equal(hogLethalPreview.isLethal, true);
  assert.equal(hogLethalPreview.goldOnKill, 20);
  assert.equal(playCard(state, hogLethal.instanceId, e2.id).ok, true);
  assert.equal(e2.hp, 0);
  assert.equal(state.player.gold, goldBeforeMiss + 20, 'Hand of Greed must grant +20 gold on kill');
  assert.equal(state.stats.goldEarned, 20);

  // Finish e1 cleanly with 0 HP lost -> perfectCombats increments to 1!
  const finisherStrike = createCardInstance(state, 'bludgeon', false);
  state.combat.hand = [finisherStrike];
  state.player.energy = 3;
  assert.equal(playCard(state, finisherStrike.instanceId, e1.id).ok, true);
  assert.equal(state.stats.perfectCombats, 1);
  assert.ok(state.stats.highestSingleHit >= 20);
});

test('Priority 1 Enemies: Wound, Book of Stabbing Painful Stabs, Taskmaster, Hexaghost Divider, and The Champ Phase 1 & 2', () => {
  // 1. Book of Stabbing starts with painfulStabs 1; unblocked hits add Wound, blocked hits do NOT; Multi-Stab scales 2 -> 3
  const bookState = setupCustomCombat(1801, {
    id: 'book_test',
    name: '刺击魔典测试',
    enemies: [{ templateId: 'book_of_stabbing' }],
  });
  const book = bookState.combat.enemies[0];
  assert.equal(book.statuses.painfulStabs, 1);
  assert.equal(book.intent.id, 'multi_stab');
  assert.equal(book.intent.hits, 2);

  bookState.player.block = 20; // fully blocks 6x2 = 12 -> 0 Wounds added!
  endPlayerTurn(bookState);
  assert.equal(
    bookState.combat.discardPile.filter((c) => c.cardId === 'wound').length,
    0,
    'Blocked hits from Book of Stabbing must NOT add Wound cards'
  );
  assert.equal(book.intent.id, 'multi_stab');
  assert.equal(book.intent.hits, 3, 'Book of Stabbing Multi-Stab must scale from 2 to 3 hits');

  bookState.player.block = 8; // 6x3=18 splits: Hit1=0 lost, Hit2=4 lost (+1 Wound), Hit3=6 lost (+1 Wound) => 2 Wounds!
  endPlayerTurn(bookState);
  const allBookCombatCards = [
    ...bookState.combat.hand,
    ...bookState.combat.drawPile,
    ...bookState.combat.discardPile,
  ];
  assert.equal(
    allBookCombatCards.filter((c) => c.cardId === 'wound').length,
    2,
    'Each unblocked hit from Painful Stabs must add 1 Wound to player piles'
  );
  assert.equal(book.intent.id, 'big_stab');
  assert.equal(book.intent.damage, 21);

  // 2. Slaver Taskmaster adds Wound on Scouring Whip
  const tmState = setupCustomCombat(1802, {
    id: 'tm_test',
    name: '奴隶贩子测试',
    enemies: [{ templateId: 'slaver_taskmaster' }],
  });
  tmState.player.block = 20;
  endPlayerTurn(tmState);
  assert.equal(tmState.combat.discardPile.some((c) => c.cardId === 'wound'), true);

  // 3. Hexaghost Turn 2 Divider scales dynamically with live player HP max(2, floor(hp/14)+1)
  const hexState = setupCustomCombat(1803, {
    id: 'hex_test',
    name: '六火亡魂测试',
    enemies: [{ templateId: 'hexaghost' }],
  });
  hexState.player.hp = 60; // Turn 2 Divider becomes max(2, floor(60/14)+1) = 5x6
  endPlayerTurn(hexState);
  assert.equal(hexState.combat.enemies[0].intent.id, 'divider');
  assert.equal(hexState.combat.enemies[0].intent.damage, 5);
  assert.equal(hexState.combat.enemies[0].intent.hits, 6);

  // 4. Act 2 Boss The Champ (240 HP): in ENCOUNTERS.act2Boss, Defensive Stance caps at 2, Phase 2 Anger purges debuffs & gains +6 Str, followed immediately by Execute
  assert.equal(ENCOUNTERS.act2Boss.some((b) => b.id === 'champ_boss'), true);
  const champState = setupCustomCombat(1804, {
    id: 'champ_test',
    name: '钢铁勇士测试',
    enemies: [{ templateId: 'the_champ' }],
  });
  const champ = champState.combat.enemies[0];
  assert.equal(champ.hp, 240);
  assert.equal(champ.champPhase, 1);

  // Apply debuffs & negative strength then drop Champ <= 50% HP (120)
  applyStatus(champ, 'vulnerable', 3);
  applyStatus(champ, 'weak', 2);
  applyStatus(champ, 'poison', 5);
  applyStatus(champ, 'strength', -2);
  champ.hp = 115;

  endPlayerTurn(champState); // End of Turn 1 triggers Phase 2 transition -> Turn 2 rolls champ_anger
  assert.equal(champ.champPhase, 2);
  assert.equal(champ.intent.id, 'champ_anger');

  endPlayerTurn(champState); // Turn 2 executes champ_anger -> purges debuffs & neg Strength, grants +6 Str, rolls champ_execute!
  assert.equal(champ.statuses.vulnerable, undefined);
  assert.equal(champ.statuses.weak, undefined);
  assert.equal(champ.statuses.poison, undefined);
  assert.equal(champ.statuses.strength, 6);
  assert.equal(champ.intent.id, 'champ_execute');
  assert.equal(champ.intent.damage, 7);
  assert.equal(champ.intent.hits, 2);

  champState.player.block = 50;
  const beforeExecHp = champState.player.hp;
  endPlayerTurn(champState); // Execute deals (7+6)*2 = 26 -> 50 block absorbs all, next turn is NOT immediate Execute (step advances)
  assert.equal(champState.player.hp, beforeExecHp);
  assert.notEqual(champ.intent.id, 'champ_execute');
});

test('Priority 1 Cards: New Ironclad & Silent card mechanics and Tactics previews execute accurately', () => {
  // === IRONCLAD ===
  // 1. Evolve + Fire Breathing + Wild Strike + Power Through + Wound
  const s1 = setupCustomCombat(1901, ENCOUNTERS.floor1[0]);
  const e1 = s1.combat.enemies[0];
  e1.hp = 80;
  e1.block = 0;
  s1.player.energy = 10;
  s1.combat.drawPile = [
    createCardInstance(s1, 'strike', false),
    createCardInstance(s1, 'defend', false),
  ];
  const evolve = createCardInstance(s1, 'evolve', false);
  const fireBr = createCardInstance(s1, 'fire_breathing', false);
  const pwrThrough = createCardInstance(s1, 'power_through', false);
  const wildStrike = createCardInstance(s1, 'wild_strike', false);
  s1.combat.hand = [evolve, fireBr, pwrThrough, wildStrike];

  assert.equal(playCard(s1, evolve.instanceId).ok, true);
  assert.equal(playCard(s1, fireBr.instanceId).ok, true);
  assert.equal(playCard(s1, pwrThrough.instanceId).ok, true);
  assert.equal(s1.player.block, 15);
  assert.equal(s1.combat.hand.filter((c) => c.cardId === 'wound').length, 2);
  // Put only a Wound on top of drawPile, followed by Strike & Burn to verify Evolve+Fire Breathing trigger!
  s1.combat.drawPile = [
    createCardInstance(s1, 'wound', false),
    createCardInstance(s1, 'strike', false),
    createCardInstance(s1, 'defend', false),
  ];
  const pommel = createCardInstance(s1, 'pommel_strike', false);
  s1.combat.hand = [pommel];
  const hpBeforeFb = e1.hp;
  assert.equal(playCard(s1, pommel.instanceId, e1.id).ok, true); // 9 dmg + draws Wound -> Fire Breathing (6 dmg) + Evolve (draws Strike)
  assert.equal(e1.hp, hpBeforeFb - 9 - 6);
  assert.equal(s1.combat.hand.some((c) => c.cardId === 'strike'), true);

  // Wild Strike shuffles a Wound into drawPile & cannot play Wound
  const e1BeforeWild = e1.hp;
  s1.combat.drawPile = [];
  s1.combat.hand = [wildStrike];
  assert.equal(playCard(s1, wildStrike.instanceId, e1.id).ok, true);
  assert.equal(e1.hp, e1BeforeWild - 12);
  assert.equal(s1.combat.drawPile.some((c) => c.cardId === 'wound'), true);
  const woundCard = createCardInstance(s1, 'wound', false);
  s1.combat.hand = [woundCard];
  assert.equal(playCard(s1, woundCard.instanceId).ok, false);

  // 2. Clash, Perfected Strike (self + other strikes parity), Sword Boomerang, Hemokinesis+Rupture, Dropkick, Spot Weakness, Disarm+Sadistic, Limit Break, Feed, Immolate, Juggernaut
  const s2 = setupCustomCombat(1902, ENCOUNTERS.hardNormal[0]); // keep multi-target or single strong enemy
  const target = s2.combat.enemies[0];
  target.hp = 120;
  target.maxHp = 120;
  target.block = 0;
  target.intent = { id: 'hit', name: '重击', type: 'attack', damage: 10, hits: 1 };
  s2.player.energy = 20;

  const clash = createCardInstance(s2, 'clash', false);
  const blockCard = createCardInstance(s2, 'defend', false);
  s2.combat.hand = [clash, blockCard];
  assert.equal(playCard(s2, clash.instanceId, target.id).ok, false, 'Clash cannot play with non-attack in hand');
  s2.combat.hand = [clash];
  assert.equal(playCard(s2, clash.instanceId, target.id).ok, true);
  assert.equal(target.hp, 120 - 14);

  // Perfected Strike: 2 strikes in hand/piles + perfected_strike itself => 3 strikes -> 6 + 2*3 = 12 dmg (matches tactics preview!)
  target.block = 0; // clear Curl Up block triggered by Clash
  const pStrike = createCardInstance(s2, 'perfected_strike', false);
  s2.combat.hand = [pStrike, createCardInstance(s2, 'strike', false)];
  s2.combat.drawPile = [createCardInstance(s2, 'pommel_strike', false)];
  s2.combat.discardPile = [];
  const psPreview = previewCardDamageOnEnemy(s2, pStrike, target);
  assert.equal(psPreview.totalDamage, 12);
  const hpBeforePs = target.hp;
  assert.equal(playCard(s2, pStrike.instanceId, target.id).ok, true);
  assert.equal(hpBeforePs - target.hp, psPreview.totalDamage);

  // Rupture + Hemokinesis -> +1 Str from card HP loss, then Spot Weakness (+3 Str on attack intent), then Limit Break (doubles 4 -> 8 Str!)
  const rupture = createCardInstance(s2, 'rupture', false);
  const hemo = createCardInstance(s2, 'hemokinesis', false);
  const spot = createCardInstance(s2, 'spot_weakness', false);
  const limitBr = createCardInstance(s2, 'limit_break', false);
  s2.combat.hand = [rupture, hemo, spot, limitBr];
  const hpBeforeHemo = s2.player.hp;
  assert.equal(playCard(s2, rupture.instanceId).ok, true);
  assert.equal(playCard(s2, hemo.instanceId, target.id).ok, true);
  assert.equal(s2.player.hp, hpBeforeHemo - 2);
  assert.equal(s2.player.statuses.strength, 1);
  assert.equal(playCard(s2, spot.instanceId, target.id).ok, true);
  assert.equal(s2.player.statuses.strength, 4);
  assert.equal(playCard(s2, limitBr.instanceId).ok, true);
  assert.equal(s2.player.statuses.strength, 8);
  assert.equal(s2.combat.exhaustPile.some((c) => c.cardId === 'limit_break'), true);

  // Limit Break+ does NOT exhaust
  const limitBrPlus = createCardInstance(s2, 'limit_break', true);
  s2.combat.hand = [limitBrPlus];
  assert.equal(playCard(s2, limitBrPlus.instanceId).ok, true);
  assert.equal(s2.player.statuses.strength, 16);
  assert.equal(s2.combat.discardPile.some((c) => c.instanceId === limitBrPlus.instanceId), true);

  // Dropkick on Vulnerable enemy refunds 1 Energy + draws 1 even if Dropkick kills! + Sadistic Nature + Disarm + Immolate + Sword Boomerang + Juggernaut + Feed
  const s3 = setupCustomCombat(1903, {
    id: 'ironclad_combo_test',
    name: '力量收割测试',
    enemies: [{ templateId: 'jaw_worm' }],
  });
  const e3 = s3.combat.enemies[0];
  e3.hp = 60;
  e3.maxHp = 60;
  e3.block = 0;
  s3.player.energy = 10;
  const sad = createCardInstance(s3, 'sadistic_nature', false); // 5 dmg per debuff
  const disarm = createCardInstance(s3, 'disarm', false); // -2 Str + triggers Sadistic Nature!
  const jugg = createCardInstance(s3, 'juggernaut', false); // 5 dmg on block
  const defend = createCardInstance(s3, 'defend', false);
  const boom = createCardInstance(s3, 'sword_boomerang', false); // 3x3 = 9
  const immo = createCardInstance(s3, 'immolate', false); // 21 AoE + Burn into discardPile
  s3.combat.hand = [sad, disarm, jugg, defend, boom, immo];
  assert.equal(playCard(s3, sad.instanceId).ok, true);
  assert.equal(playCard(s3, disarm.instanceId, e3.id).ok, true);
  assert.equal(e3.statuses.strength, -2);
  assert.equal(e3.hp, 55, 'Disarm negative strength must trigger Sadistic Nature for 5 damage');
  assert.equal(playCard(s3, jugg.instanceId).ok, true);
  assert.equal(playCard(s3, defend.instanceId).ok, true);
  assert.equal(e3.hp, 50, 'Juggernaut must deal 5 damage when Defend grants block');
  assert.equal(playCard(s3, boom.instanceId).ok, true);
  assert.equal(e3.hp, 41);
  assert.equal(playCard(s3, immo.instanceId).ok, true);
  assert.equal(e3.hp, 20);
  assert.equal(s3.combat.discardPile.some((c) => c.cardId === 'burn'), true);

  // Test Feed lethal preview & +3 MaxHP gain + Dropkick energy/draw refund
  applyStatus(e3, 'vulnerable', 1); // Dropkick 5*1.5=7, Feed 10*1.5=15 -> drops 20 HP enemy to 13 then killed by Feed!
  s3.combat.drawPile = [createCardInstance(s3, 'strike', false)];
  const dropkick = createCardInstance(s3, 'dropkick', false);
  const feed = createCardInstance(s3, 'feed', true); // +4 MaxHP on kill, 12*1.5 = 18
  s3.combat.hand = [dropkick, feed];
  const energyBeforeDrop = s3.player.energy;
  assert.equal(playCard(s3, dropkick.instanceId, e3.id).ok, true);
  assert.equal(s3.player.energy, energyBeforeDrop, 'Dropkick (cost 1) on Vulnerable refunds 1 net energy');
  assert.equal(s3.combat.hand.some((c) => c.cardId === 'strike'), true, 'Dropkick on Vulnerable draws 1 card');
  e3.hp = 15; // Feed+ (12 * 1.5 = 18) is lethal!
  const feedPreview = previewCardDamageOnEnemy(s3, feed, e3);
  assert.equal(feedPreview.isLethal, true);
  assert.equal(feedPreview.maxHpOnKill, 4);
  const maxHpBefore = s3.player.maxHp;
  const hpBeforeFeed = s3.player.hp;
  assert.equal(playCard(s3, feed.instanceId, e3.id).ok, true);
  assert.equal(s3.player.maxHp, maxHpBefore + 4);
  assert.equal(s3.player.hp, Math.min(s3.player.maxHp, hpBeforeFeed + 4));

  // === SILENT ===
  // 3. Flying Knee, Dodge and Roll, Blur, Escape Plan, Piercing Wail, Terror, Caltrops, Glass Knife, Burst + Catalyst, Malaise, Alchemize
  const silState = setupCustomCombat(1904, {
    id: 'silent_p1_test',
    name: '猎手进阶测试',
    enemies: [{ templateId: 'jaw_worm' }],
  });
  const se = silState.combat.enemies[0];
  se.hp = 120;
  se.maxHp = 120;
  se.block = 0;
  silState.player.energy = 15;
  silState.player.potions = [null, null, null];

  // Glass Knife decays 12->10 after play without touching master deck
  const gk = createCardInstance(silState, 'glass_knife', false); // 8x2 = 16
  silState.combat.hand = [gk];
  assert.equal(playCard(silState, gk.instanceId, se.id).ok, true);
  assert.equal(se.hp, 120 - 16);
  assert.equal(getCardStats(gk).damage, 6, 'Glass Knife must lose 2 base damage per play');

  // Escape Plan draws a Skill -> gains 3 Block; drawing Attack -> gains 0 Block
  silState.combat.drawPile = [createCardInstance(silState, 'defend', false)];
  const ep1 = createCardInstance(silState, 'escape_plan', false);
  silState.combat.hand = [ep1];
  assert.equal(playCard(silState, ep1.instanceId).ok, true);
  assert.equal(silState.player.block, 3);

  // Flying Knee (+1 energy next turn) + Dodge and Roll (next turn block) + Blur (keeps block) + Piercing Wail (-6 Str temp) + Caltrops (Thorns)
  const knee = createCardInstance(silState, 'flying_knee', false);
  const dodge = createCardInstance(silState, 'dodge_and_roll', false);
  const blur = createCardInstance(silState, 'blur', false);
  const wail = createCardInstance(silState, 'piercing_wail', false);
  const caltrops = createCardInstance(silState, 'caltrops', false);
  const alchemize = createCardInstance(silState, 'alchemize', false);
  silState.combat.hand = [knee, dodge, blur, wail, caltrops, alchemize];
  assert.equal(playCard(silState, knee.instanceId, se.id).ok, true);
  assert.equal(playCard(silState, dodge.instanceId).ok, true);
  assert.equal(playCard(silState, blur.instanceId).ok, true);
  assert.equal(playCard(silState, wail.instanceId).ok, true);
  assert.equal(se.statuses.strength, -6);
  assert.equal(playCard(silState, caltrops.instanceId).ok, true);
  assert.equal(silState.player.statuses.thorns, 3);
  assert.equal(playCard(silState, alchemize.instanceId).ok, true);
  assert.ok(silState.player.potions[0], 'Alchemize must brew a potion into empty slot');

  const carriedBlock = silState.player.block; // 3 (Escape Plan) + 4 (Dodge) + 5 (Blur) = 12
  se.intent = { id: 'bite', name: '啮咬', type: 'attack', damage: 8, hits: 1 };
  const seHpBeforeAttack = se.hp;
  endPlayerTurn(silState);
  // Enemy dealt max(0, 8-6)=2 -> fully blocked by 12 -> 10 remaining carried by Blur + 4 from nextTurnBlock = 14!
  assert.equal(silState.player.block, carriedBlock - 2 + 4, 'Blur must preserve remaining block + Dodge adds nextTurnBlock');
  assert.equal(silState.player.energy, silState.player.maxEnergy + 1, 'Flying Knee energized must add +1 energy');
  assert.equal(se.statuses.strength, undefined, 'Piercing Wail temp Strength loss must restore at end of enemy turn');
  assert.equal(se.hp, seHpBeforeAttack - 3, 'Caltrops Thorns must retaliate when enemy attacks');

  // Burst + Catalyst doubles Poison TWICE & tactics preview matches! + Malaise permanent -Str & Weak
  const burst = createCardInstance(silState, 'burst', false);
  const cat = createCardInstance(silState, 'catalyst', false);
  applyStatus(se, 'poison', 3);
  silState.combat.hand = [burst, cat];
  assert.equal(playCard(silState, burst.instanceId).ok, true);
  assert.equal(silState.player.statuses.burst, 1);
  const burstCatPreview = previewCardDamageOnEnemy(silState, cat, se);
  assert.equal(burstCatPreview.projectedPoison, 12, 'Burst + Catalyst must preview 3 -> 6 -> 12 Poison');
  assert.equal(playCard(silState, cat.instanceId, se.id).ok, true);
  assert.equal(se.statuses.poison, 12);

  // Malaise X-cost + Terror + Concentrate discard
  const malaise = createCardInstance(silState, 'malaise', true); // X+1 permanent -Str & Weak
  silState.player.energy = 2;
  silState.combat.hand = [malaise];
  assert.equal(playCard(silState, malaise.instanceId, se.id).ok, true);
  assert.equal(se.statuses.strength, -3);
  assert.equal(se.statuses.weak, 3);
  assert.equal(silState.player.energy, 0);

  const terror = createCardInstance(silState, 'terror', false);
  const conc = createCardInstance(silState, 'concentrate', false);
  silState.combat.hand = [
    terror,
    conc,
    createCardInstance(silState, 'defend', false),
    createCardInstance(silState, 'strike', false),
    createCardInstance(silState, 'survivor', false),
    createCardInstance(silState, 'deflect', false),
  ];
  assert.equal(playCard(silState, terror.instanceId, se.id).ok, false, 'Unupgraded Terror costs 1 energy');
  silState.player.energy = 1;
  assert.equal(playCard(silState, terror.instanceId, se.id).ok, true);
  assert.equal(se.statuses.vulnerable, 99);
  assert.equal(playCard(silState, conc.instanceId).ok, true);
  assert.equal(silState.player.energy, 2);
  assert.equal(silState.combat.pendingDiscard.remaining, 3);
});

test('19 New Tiered Relics: MaxHP/Waffle, Akabeko, Happy Flower, Incense Burner, Fan, Red Skull, Mummified Hand, Helix, Calipers, Chemical X, Medical Kit, Orange Pellets, Red Mask, and Enchiridion', () => {
  // 1. MaxHP relics + Lee's Waffle full heal
  const hpState = createNewRun({ seed: 7101, skipNeow: true });
  hpState.player.hp = 40;
  assert.equal(grantRelicToPlayer(hpState, 'strawberry'), true); // +7 maxHp & +7 hp
  assert.equal(grantRelicToPlayer(hpState, 'pear'), true); // +10 maxHp & +10 hp
  assert.equal(grantRelicToPlayer(hpState, 'mango'), true); // +14 maxHp & +14 hp
  assert.equal(hpState.player.maxHp, 80 + 7 + 10 + 14);
  assert.equal(hpState.player.hp, 40 + 7 + 10 + 14);
  assert.equal(grantRelicToPlayer(hpState, 'lees_waffle'), true); // +7 maxHp & full heal
  assert.equal(hpState.player.maxHp, 80 + 7 + 10 + 14 + 7);
  assert.equal(hpState.player.hp, hpState.player.maxHp);

  // 2. Akabeko (Vigor 8) + Fossilized Helix (Buffer 1) + Red Mask (all Weak 1) + Red Skull (+3 Str <=50% HP) + Medical Kit + Calipers + Mummified Hand + Orange Pellets + Enchiridion
  const relState = createNewRun({ seed: 7102, skipNeow: true });
  relState.player.hp = 35; // <= 50% of 80 -> activates Red Skull (+3 Str)
  for (const rId of [
    'akabeko',
    'fossilized_helix',
    'red_mask',
    'red_skull',
    'medical_kit',
    'calipers',
    'mummified_hand',
    'orange_pellets',
    'enchiridion',
    'ornamental_fan',
    'happy_flower',
    'incense_burner',
    'chemical_x',
  ]) {
    grantRelicToPlayer(relState, rId);
  }
  startCombat(
    relState,
    {
      id: 'new_relic_arena',
      name: '新遗物综合演武',
      enemies: [{ templateId: 'jaw_worm' }],
    },
    'normal'
  );
  const foe = relState.combat.enemies[0];
  foe.hp = 200;
  foe.maxHp = 200;
  foe.block = 0;

  assert.equal(relState.player.statuses.vigor, 8, 'Akabeko starts combat with 8 Vigor');
  assert.equal(relState.player.statuses.buffer, 1, 'Fossilized Helix starts combat with 1 Buffer');
  assert.equal(relState.player.statuses.strength, 3, 'Red Skull activates +3 Strength at <=50% HP');
  assert.equal(foe.statuses.weak, 1, 'Red Mask applies 1 Weak to all enemies on combat start');
  assert.equal(
    relState.combat.hand.some((c) => getCardStats(c).type === 'power' && getEffectiveCardCost(getCardStats(c), relState.player, relState.combat) === 0),
    true,
    'Enchiridion adds a 0-cost Power card on Turn 1'
  );

  // First Attack uses Vigor 8 + Red Skull 3 (+11 total) -> Strike = 17, then Vigor is consumed
  const strike1 = createCardInstance(relState, 'strike', false);
  const strike2 = createCardInstance(relState, 'strike', false);
  const strike3 = createCardInstance(relState, 'strike', false);
  const defend1 = createCardInstance(relState, 'defend', false);
  const power1 = createCardInstance(relState, 'inflame', false);
  const wound1 = createCardInstance(relState, 'wound', false);
  const cleave1 = createCardInstance(relState, 'cleave', false);
  relState.player.energy = 10;
  relState.combat.hand = [strike1, strike2, strike3, defend1, power1, wound1, cleave1];

  // Medical Kit lets Wound play at 0 cost & exhaust!
  const woundEffCost = getEffectiveCardCost(getCardStats(wound1), relState.player, relState.combat);
  assert.equal(woundEffCost, 0, 'Medical Kit makes Wound 0 cost');
  assert.equal(playCard(relState, wound1.instanceId).ok, true);
  assert.equal(relState.combat.exhaustPile.some((c) => c.instanceId === wound1.instanceId), true);

  // Chemical X preview + execution on Whirlwind (+2 hits)
  const whirl = createCardInstance(relState, 'whirlwind', false); // 5 base dmg X times (+2 from Chemical X)
  relState.combat.hand.push(whirl);
  const whirlSyn = computeCardSynergies(relState, whirl, foe.id);
  assert.ok(whirlSyn.callouts.some((c) => c.text.includes('化学物X')));
  const whirlPreview = previewCardDamageOnEnemy(relState, whirl, foe);
  assert.equal(whirlPreview.hits, relState.player.energy + 2);

  // Play Attack -> consumes Vigor 8!
  const hpBeforeStrike = foe.hp;
  assert.equal(playCard(relState, strike1.instanceId, foe.id).ok, true);
  assert.equal(foe.hp, hpBeforeStrike - 17, 'Akabeko (+8) + Red Skull (+3) + Strike (6) = 17 dmg');
  assert.equal(relState.player.statuses.vigor, undefined, 'Vigor must clear after first Attack');

  // Play 2 more Attacks -> Ornamental Fan triggers (+4 Block on 3rd Attack)
  const blockBefore3rdAtk = relState.player.block;
  assert.equal(playCard(relState, strike2.instanceId, foe.id).ok, true);
  assert.equal(playCard(relState, strike3.instanceId, foe.id).ok, true);
  assert.equal(relState.player.block, blockBefore3rdAtk + 4, 'Ornamental Fan grants +4 Block per 3 Attacks');

  // Mummified Hand turns nonzero hand card to 0 cost THIS turn when Power is played + Orange Pellets clears debuffs on Attack+Skill+Power
  applyStatus(relState.player, 'vulnerable', 2);
  applyStatus(relState.player, 'confused', 1);
  assert.equal(playCard(relState, defend1.instanceId).ok, true); // Skill played
  // Put only one nonzero-cost card (cleave1) in hand alongside Inflame
  const bashTemp = createCardInstance(relState, 'bash', false);
  relState.combat.hand = [power1, bashTemp];
  assert.equal(playCard(relState, power1.instanceId).ok, true); // Power played -> Mummified Hand + Orange Pellets!
  assert.equal(relState.player.statuses.vulnerable, undefined, 'Orange Pellets clears debuffs');
  assert.equal(relState.player.statuses.confused, undefined, 'Orange Pellets clears Confused');
  assert.equal(
    getEffectiveCardCost(getCardStats(bashTemp), relState.player, relState.combat),
    0,
    'Mummified Hand makes random hand card cost 0 this turn'
  );

  // Buffer absorbs lethal 25 dmg hit -> 0 HP lost, Calipers retains (block - 15) at next turn start
  relState.player.block = 25;
  foe.intent = { id: 'big_hit', name: '重砸', type: 'attack', damage: 0, hits: 1 };
  const hpBeforeTurn = relState.player.hp;
  assert.equal(endPlayerTurn(relState).ok, true); // Turn 2 starts: Calipers loses 15 (25 -> 10 kept) & Bash temp zero-cost cleared in discard
  assert.equal(relState.player.block, 10, 'Calipers must retain (25 - 15) = 10 Block');
  assert.equal(bashTemp.combatCost, undefined, 'Mummified Hand 0-cost must revert after turn ends');
  assert.equal(relState.player.hp, hpBeforeTurn);

  // Turn 3 -> Happy Flower counter reaches 3 (next = 0) -> +1 Energy!
  foe.intent = { id: 'idle_hit', name: '攻击', type: 'attack', damage: 18, hits: 1 };
  relState.player.block = 0; // Unblocked 18 dmg triggers Fossilized Helix Buffer!
  assert.equal(endPlayerTurn(relState).ok, true); // Turn 3 starts!
  assert.equal(relState.player.hp, hpBeforeTurn, 'Buffer must completely negate 18 unblocked damage');
  assert.equal(relState.player.statuses.buffer, undefined, 'Buffer consumes 1 stack on absorption');
  assert.equal(relState.player.energy, relState.player.maxEnergy + 1, 'Happy Flower grants +1 Energy on Turn 3');

  // Red Skull deactivates when HP heals above 50%
  relState.player.hp = 70;
  relState.player.potions[0] = 'regen_potion'; // healPct -> triggers syncRedSkullStatus
  assert.equal(usePotion(relState, 0).ok, true);
  assert.equal(relState.player.statuses.strength, 2, 'Red Skull -3 removes its +3 (only Inflame +2 remains)');

  // Incense Burner triggers on Turn 6 (turns 4, 5, 6) -> +1 Intangible
  for (let t = 0; t < 3; t += 1) {
    foe.intent = { id: 'poke', name: '轻击', type: 'attack', damage: 1, hits: 1 };
    endPlayerTurn(relState);
  }
  assert.equal(relState.player.statuses.intangible, 1, 'Incense Burner must grant 1 Intangible every 6 turns');
});

test('Act 3 Enemies, Elites, and Bosses: Spiker Thorns, Exploder, Repulsor, Giant Head Slow, Nemesis Intangible, Reptomancer, Time Eater, Awakened One Rebirth, and Donu/Deca', () => {
  // 1. Spiker Thorns + Exploder countdown/selfDestruct + Repulsor draw-pile Dazed
  const normalAct3 = createNewRun({ seed: 7201, skipNeow: true });
  startCombat(normalAct3, ENCOUNTERS.act3Hard[0], 'normal'); // spiker, exploder, repulsor
  const spiker = normalAct3.combat.enemies.find((e) => e.templateId === 'spiker');
  const exploder = normalAct3.combat.enemies.find((e) => e.templateId === 'exploder');
  const repulsor = normalAct3.combat.enemies.find((e) => e.templateId === 'repulsor');
  assert.ok(spiker && exploder && repulsor);
  assert.ok((spiker.statuses.thorns ?? 0) >= 3);
  const strike = createCardInstance(normalAct3, 'strike', false);
  normalAct3.combat.hand = [strike];
  normalAct3.player.block = 0;
  const hpBeforeSpikerHit = normalAct3.player.hp;
  assert.equal(playCard(normalAct3, strike.instanceId, spiker.id).ok, true);
  assert.equal(normalAct3.player.hp, hpBeforeSpikerHit - spiker.statuses.thorns, 'Spiker Thorns must damage attacker');

  // Force Exploder selfDestruct & Repulsor addDrawCards
  exploder.intent = { id: 'explode', name: '引爆', type: 'attack', damage: 15, hits: 1, selfDestruct: true };
  repulsor.intent = { id: 'repulse', name: '斥力', type: 'debuff', addDrawCards: [{ cardId: 'dazed', count: 2 }] };
  spiker.intent = { id: 'spike_wait', name: '蓄力', type: 'buff', applySelfStatuses: { thorns: 2 } };
  normalAct3.player.block = 20;
  normalAct3.combat.drawPile = [];
  endPlayerTurn(normalAct3);
  assert.equal(exploder.hp, 0, 'Exploder must die after selfDestruct');
  assert.ok(
    normalAct3.combat.hand.filter((c) => c.cardId === 'dazed').length +
      normalAct3.combat.drawPile.filter((c) => c.cardId === 'dazed').length >=
      2,
    'Repulsor addDrawCards must shuffle Dazed into draw pile'
  );

  // 2. Giant Head Slow + Nemesis alternating Intangible + Reptomancer Dagger cap
  const eliteAct3 = createNewRun({ seed: 7202, skipNeow: true });
  startCombat(eliteAct3, { id: 'a3_elites', name: 'Act3精英合测', enemies: [{ templateId: 'giant_head' }, { templateId: 'nemesis' }, { templateId: 'reptomancer' }] }, 'elite');
  const gh = eliteAct3.combat.enemies.find((e) => e.templateId === 'giant_head');
  const nem = eliteAct3.combat.enemies.find((e) => e.templateId === 'nemesis');
  const repto = eliteAct3.combat.enemies.find((e) => e.templateId === 'reptomancer');
  assert.equal(gh.statuses.slow, 1);
  assert.equal(gh.slowStacks, 0);
  assert.equal(nem.statuses.intangible ?? 0, 0, 'Nemesis is not Intangible on Turn 1');

  // Play 2 zero-cost skills -> Giant Head slowStacks increments to 2 (+20% attack dmg) -> 10 dmg becomes 12
  const sA = createCardInstance(eliteAct3, 'deflect', false);
  const sB = createCardInstance(eliteAct3, 'deflect', false);
  const cleaveTest = createCardInstance(eliteAct3, 'strike', true); // 9 dmg -> *1.2 = 10 dmg
  eliteAct3.combat.hand = [sA, sB, cleaveTest];
  eliteAct3.player.energy = 5;
  playCard(eliteAct3, sA.instanceId);
  playCard(eliteAct3, sB.instanceId);
  assert.equal(gh.slowStacks, 2);
  assert.equal(calculateAttackDamage(10, eliteAct3.player, gh), 12);

  // Reptomancer Turn 0 summons 2 daggers; cap at 4 alive even if summoned multiple times
  repto.intent = { id: 'repto_summon', name: '召唤', type: 'buff', summonMinions: 'dagger', summonCount: 2 };
  endPlayerTurn(eliteAct3);
  assert.equal(eliteAct3.combat.enemies.filter((e) => e.templateId === 'dagger' && e.hp > 0).length, 2);
  assert.equal(nem.statuses.intangible, 1, 'Nemesis gains 1 Intangible entering Turn 2');
  assert.equal(gh.slowStacks, 0, 'Giant Head slowStacks resets at turn start');
  // Intangible reduces 100 damage against Nemesis to 1
  const bludgeon = createCardInstance(eliteAct3, 'bludgeon', false);
  eliteAct3.combat.hand = [bludgeon];
  eliteAct3.player.energy = 5;
  const nemHpT2 = nem.hp;
  playCard(eliteAct3, bludgeon.instanceId, nem.id);
  assert.equal(nem.hp, nemHpT2 - 1, 'Nemesis Intangible must reduce massive hit to 1');

  // 3. Time Eater Time Warp (12 cards -> force end turn +2 Str) & Time Haste heal-to-50%
  const teState = createNewRun({ seed: 7203, skipNeow: true });
  startCombat(teState, ENCOUNTERS.act3Boss[0], 'boss'); // Time Eater
  const te = teState.combat.enemies[0];
  assert.equal(te.statuses.timeWarp, 12);
  te.hp = Math.floor(te.maxHp / 2) - 10; // below 50% -> triggers pendingHaste after round
  const cards12 = Array.from({ length: 12 }, () => createCardInstance(teState, 'deflect', false));
  teState.combat.hand = [...cards12];
  teState.player.energy = 3;
  // Play 11 -> Turn stays on player
  for (let i = 0; i < 11; i += 1) {
    assert.equal(playCard(teState, cards12[i].instanceId).ok, true);
  }
  assert.equal(te.statuses.timeWarp, 1);
  assert.equal(teState.combat.turn, 1);
  // Play 12th card -> Time Warp triggers, +2 Str, resets to 12, forces endPlayerTurn (Turn advances to 2!)
  assert.equal(playCard(teState, cards12[11].instanceId).ok, true);
  assert.equal(te.statuses.timeWarp, 12);
  assert.equal(te.statuses.strength, 2);
  assert.equal(teState.combat.turn, 2, '12th card must force-end player turn to Turn 2');
  assert.equal(te.intent.id, 'time_haste', 'Half HP Time Eater queues time_haste');
  endPlayerTurn(teState);
  assert.equal(te.hp, Math.floor(te.maxHp / 2), 'Time Haste must heal Time Eater to 50% Max HP');

  // 4. Awakened One Curiosity + Phase 1 -> 2 Rebirth + Regenerating
  const awState = createNewRun({ seed: 7204, skipNeow: true });
  startCombat(awState, ENCOUNTERS.act3Boss[1], 'boss'); // Awakened One
  const aw = awState.combat.enemies[0];
  const infl = createCardInstance(awState, 'inflame', false);
  awState.combat.hand = [infl];
  awState.player.energy = 3;
  playCard(awState, infl.instanceId);
  assert.equal(aw.statuses.strength, aw.statuses.curiosity, 'Awakened One Curiosity grants Strength on Power play');
  aw.hp = 5;
  aw.block = 0;
  awState.combat.hand = [createCardInstance(awState, 'strike', false)];
  playCard(awState, awState.combat.hand[0].instanceId, aw.id);
  assert.equal(aw.unawakened, false, 'Phase 1 kill must trigger Rebirth into Phase 2');
  assert.equal(aw.hp, aw.maxHp);
  assert.equal(awState.combat.status, 'ongoing', 'Combat continues into Phase 2 after Rebirth');
  assert.equal(aw.statuses.curiosity, undefined, 'Curiosity is removed in Phase 2');
  assert.ok((aw.statuses.regenerating ?? 0) > 0, 'Phase 2 gains Regenerating');
  aw.hp = 100;
  endPlayerTurn(awState);
  assert.ok(aw.hp > 100, 'Regenerating heals Awakened One at end of enemy turn');

  // 5. Donu & Deca dual boss team buff & team block
  const ddState = createNewRun({ seed: 7205, skipNeow: true });
  startCombat(ddState, ENCOUNTERS.act3Boss[2], 'boss');
  const donu = ddState.combat.enemies.find((e) => e.templateId === 'donu');
  const deca = ddState.combat.enemies.find((e) => e.templateId === 'deca');
  assert.ok(donu && deca);
  donu.intent = { id: 'circle_of_power', name: '力量法阵', type: 'buff', applyAllEnemiesStatuses: { strength: 3 } };
  deca.intent = { id: 'square_of_protection', name: '守护方阵', type: 'defend', allEnemiesBlock: 14, block: 14 };
  endPlayerTurn(ddState);
  assert.equal(donu.statuses.strength, 3);
  assert.equal(deca.statuses.strength, 3);
  assert.equal(donu.block, 14);
  assert.equal(deca.block, 14, 'Deca must not double-count allEnemiesBlock + block');
});

test('Stage 1: Act 2 Enemies (Byrd Flight, Spheric Guardian Barricade, Snake Plant Malleable, Gremlin Leader), Ironclad Potions, Interactive Armaments/True Grit+, and Scry', () => {
  // 1. Byrd Flight 50% attack halving, multi-hit grounding + stun, grounded headbutt -> fly up
  const byrdState = setupCustomCombat(9101, ENCOUNTERS.act2Early.find((e) => e.id === 'byrd_flock'));
  const byrd = byrdState.combat.enemies[0];
  assert.equal(byrd.statuses.flight, 3);
  byrd.hp = 30;
  byrd.maxHp = 30;
  byrdState.player.energy = 10;

  // Tactics preview accurately simulates 3-hit Flight halving then 4th hit full damage
  const ww = createCardInstance(byrdState, 'whirlwind', false); // 5 dmg x X
  byrdState.combat.hand = [ww];
  byrdState.player.energy = 4;
  const wwPreview = previewCardDamageOnEnemy(byrdState, ww, byrd);
  // Hits 1-3 halved: floor(5*0.5)=2 each = 6; Hit 4 full: 5 -> total 11
  assert.equal(wwPreview.totalDamage, 11, 'Flight preview must halve hits 1-3 and deal full dmg on hit 4');

  const strike = createCardInstance(byrdState, 'strike', false); // 6 dmg -> halved to 3
  const twin = createCardInstance(byrdState, 'twin_strike', false); // 5x2 -> hit 1 halved to 2, hit 2 halved to 2 -> breaks Flight!
  byrdState.combat.hand = [strike, twin];
  playCard(byrdState, strike.instanceId, byrd.id);
  assert.equal(byrd.hp, 27);
  assert.equal(byrd.statuses.flight, 2);
  playCard(byrdState, twin.instanceId, byrd.id);
  assert.equal(byrd.hp, 23);
  assert.equal(byrd.statuses.flight, undefined, '3rd attack hit grounds Byrd');
  assert.equal(byrd.grounded, true);
  assert.equal(byrd.intent.id, 'stunned', 'Grounded Byrd is immediately stunned');

  // After stunned turn -> grounded headbutt -> fly up restores Flight
  endPlayerTurn(byrdState);
  assert.equal(byrd.intent.id, 'byrd_headbutt');
  endPlayerTurn(byrdState);
  assert.equal(byrd.intent.id, 'byrd_fly_up');
  endPlayerTurn(byrdState);
  assert.equal(byrd.statuses.flight, 3, 'Fly Up restores Byrd Flight stacks');
  assert.equal(byrd.grounded, false);

  // 2. Spheric Guardian initialBlock + Barricade persistence across enemy turns
  const sgState = setupCustomCombat(9102, ENCOUNTERS.act2Early.find((e) => e.id === 'spheric_guardian_solo'));
  const sg = sgState.combat.enemies[0];
  assert.ok(sg.block >= 32, 'Spheric Guardian starts with high initial block');
  assert.equal(sg.statuses.barricade, 1);
  const beforeBlock = sg.block;
  endPlayerTurn(sgState); // Turn 1 Activate adds +18 block without clearing existing block
  assert.equal(sg.block, beforeBlock + 18, 'Enemy Barricade must preserve block across turns');

  // 3. Snake Plant Malleable escalating block & enemy-turn reset + tactics preview
  const spState = setupCustomCombat(9103, ENCOUNTERS.act2Hard.find((e) => e.id === 'snake_plant_solo'));
  const sp = spState.combat.enemies[0];
  assert.equal(sp.statuses.malleable, 3);
  sp.hp = 80;
  sp.maxHp = 80;
  spState.player.energy = 6;
  const twinSp = createCardInstance(spState, 'twin_strike', true); // 7 dmg x 2
  const spPrev = previewCardDamageOnEnemy(spState, twinSp, sp);
  // Hit 1: 7 HP loss -> gains 3 block (malleable 4). Hit 2: 7 dmg vs 3 block -> 4 HP loss -> gains 4 block. Total HP loss = 11!
  assert.equal(spPrev.hpLoss, 11, 'Malleable preview must simulate escalating block mid-multi-hit');
  spState.combat.hand = [twinSp];
  playCard(spState, twinSp.instanceId, sp.id);
  assert.equal(sp.hp, 69);
  assert.equal(sp.block, 4);
  assert.equal(sp.statuses.malleable, 5);
  endPlayerTurn(spState);
  assert.equal(sp.statuses.malleable, 3, 'Malleable resets to 3 at start of enemy turn');

  // 4. Gremlin Leader elite spawns with 2 minions and honors summonMax = 2
  const glState = setupCustomCombat(9104, ENCOUNTERS.act2Elite.find((e) => e.id === 'gremlin_leader_elite'));
  assert.equal(glState.combat.enemies.length, 3);
  const leader = glState.combat.enemies.find((e) => e.templateId === 'gremlin_leader');
  assert.ok(leader);
  for (const e of glState.combat.enemies) {
    if (e.id !== leader.id) e.hp = 0;
  }
  leader.intent = {
    id: 'leader_rally',
    name: '集结号角',
    type: 'buff',
    summonMinions: 'mad_gremlin',
    summonCount: 2,
    summonMax: 2,
    summonHp: 20,
  };
  endPlayerTurn(glState);
  const aliveGremlins = glState.combat.enemies.filter((e) => e.hp > 0 && e.templateId === 'mad_gremlin');
  assert.equal(aliveGremlins.length, 2, 'Gremlin Leader Rally summons up to summonMax=2 Mad Gremlins');

  // 5. Ironclad exclusive potions: Heart of Iron (+6 Metallicize) & Fury Potion (+5 temp Str & draw 1) with Sacred Bark
  const potState = setupCustomCombat(9105, ENCOUNTERS.floor1[0]);
  potState.player.relics.push('sacred_bark');
  potState.player.potions = ['heart_of_iron', 'fury_potion', null];
  potState.combat.drawPile = [
    createCardInstance(potState, 'strike', false),
    createCardInstance(potState, 'defend', false),
    createCardInstance(potState, 'strike', false),
  ];
  potState.combat.hand = [];
  assert.equal(usePotion(potState, 0).ok, true);
  assert.equal(potState.player.statuses.metallicize, 12, 'Sacred Bark doubles Heart of Iron Metallicize (6 -> 12)');
  assert.equal(usePotion(potState, 1).ok, true);
  assert.equal(potState.player.statuses.strength, 10, 'Sacred Bark doubles Fury Potion temp Strength (5 -> 10)');
  assert.equal(potState.player.statuses.tempStrengthDown, 10);
  assert.equal(potState.combat.hand.length, 2, 'Sacred Bark doubles Fury Potion draw (1 -> 2)');
  endPlayerTurn(potState);
  assert.equal(potState.player.statuses.strength, undefined, 'Fury Potion temporary Strength decays at end of turn');

  // 6. Interactive Armaments (base) upgrade choice & Scry (draw-pile top preview + discard + order preservation)
  const choiceState = setupCustomCombat(9106, ENCOUNTERS.floor1[0]);
  choiceState.player.energy = 5;
  const arm = createCardInstance(choiceState, 'armaments', false);
  const c1 = createCardInstance(choiceState, 'strike', false);
  const c2 = createCardInstance(choiceState, 'bash', false);
  const c3 = createCardInstance(choiceState, 'defend', true); // already upgraded
  choiceState.combat.hand = [arm, c1, c2, c3];
  playCard(choiceState, arm.instanceId);
  assert.equal(choiceState.combat.pendingCardChoice?.mode, 'upgrade');
  assert.equal(resolveCardChoice(choiceState, c3.instanceId).ok, false, 'Cannot pick already-upgraded card');
  assert.equal(resolveCardChoice(choiceState, c2.instanceId).ok, true);
  assert.equal(c2.upgraded, true);
  assert.equal(c1.upgraded, false);
  assert.equal(choiceState.combat.pendingCardChoice, null);

  // Scry top 3 cards of draw pile: discard middle card, keep 1st and 3rd in exact draw order!
  const dTop1 = createCardInstance(choiceState, 'strike', false);
  const dTop2 = createCardInstance(choiceState, 'wound', false);
  const dTop3 = createCardInstance(choiceState, 'bash', false);
  const dRest = createCardInstance(choiceState, 'defend', false);
  choiceState.combat.drawPile = [dTop1, dTop2, dTop3, dRest];
  choiceState.combat.discardPile = [];
  const scryStart = initiateScry(choiceState, 3, '预见测试');
  assert.equal(scryStart.ok, true);
  assert.equal(choiceState.combat.pendingCardChoice?.mode, 'scry');
  assert.equal(choiceState.combat.pendingCardChoice.candidates.length, 3);
  assert.equal(toggleScryChoice(choiceState, dTop2.instanceId).ok, true);
  const scryRes = confirmScryChoice(choiceState);
  assert.equal(scryRes.ok, true);
  assert.equal(scryRes.discardedCount, 1);
  assert.equal(scryRes.keptCount, 2);
  assert.equal(choiceState.combat.pendingCardChoice, null);
  assert.deepEqual(
    choiceState.combat.drawPile.map((c) => c.instanceId),
    [dTop1.instanceId, dTop3.instanceId, dRest.instanceId],
    'Unmarked scried cards must preserve draw order at top of drawPile'
  );
  assert.equal(choiceState.combat.discardPile.some((c) => c.instanceId === dTop2.instanceId), true);
});

test('Stage 2: The Watcher stances (Calm/Wrath/Divinity), Mantra, Rushdown 2-trigger cap, Scry synergies, Retain scaling, Mark/Judgment/Lesson Learned, Vault/Conclude, Watcher Relics/Potions, and Enchiridion/Alchemize pool isolation', () => {
  // 1. Pure Water (T1 Miracle), Teardrop Locket (start Calm), Violet Lotus (+3E Calm exit), Wrath 2x outgoing/incoming, Mental Fortress, Flurry of Blows, Rushdown cap (2/turn)
  const wState = createNewRun({ seed: 13001, characterId: 'watcher', skipNeow: true });
  wState.player.relics = ['pure_water', 'teardrop_locket', 'violet_lotus'];
  startCombat(wState, ENCOUNTERS.floor1[0], 'normal');
  const enemy = wState.combat.enemies[0];
  enemy.hp = 200;
  enemy.maxHp = 200;
  enemy.block = 0;
  enemy.intent = { id: 'atk', name: '挥击', type: 'attack', damage: 10, hits: 1 };

  assert.equal(wState.combat.stance, 'calm', 'Teardrop Locket starts combat in Calm');
  assert.equal(wState.player.stance, 'calm');
  assert.ok(wState.combat.hand.some((c) => c.cardId === 'miracle'), 'Pure Water adds Miracle on Turn 1');

  // Set up Rushdown + Mental Fortress + Flurry in discard + 3 Wrath/Calm swaps
  wState.player.statuses.mentalFortress = 5;
  wState.player.statuses.rushdown = 2;
  wState.player.energy = 6;
  wState.player.block = 0;
  const flurry = createCardInstance(wState, 'flurry_of_blows', false);
  wState.combat.discardPile = [flurry];
  wState.combat.drawPile = Array.from({ length: 8 }, () => createCardInstance(wState, 'strike', false));
  const erup1 = createCardInstance(wState, 'eruption', true); // 1E Wrath
  const tranq1 = createCardInstance(wState, 'tranquility', true); // 0E Calm
  const cresc1 = createCardInstance(wState, 'crescendo', true); // 0E Wrath
  const tranq2 = createCardInstance(wState, 'tranquility', true); // 0E Calm
  const cresc2 = createCardInstance(wState, 'crescendo', true); // 0E Wrath
  wState.combat.hand = [erup1, tranq1, cresc1, tranq2, cresc2];

  // Check Tactics Wrath danger warning BEFORE entering Wrath
  const wrathSyn = computeCardSynergies(wState, erup1, enemy.id);
  assert.ok(wrathSyn.callouts.some((c) => c.text.includes('退出【平静】') && c.text.includes('+3')));
  assert.ok(wrathSyn.callouts.some((c) => c.tone === 'warn' && c.text.includes('20 点双倍')));

  // Swap 1 (Calm -> Wrath): +3E (Violet Lotus) - 1E = 8E, Mental Fortress +5 block, Flurry returns from discard, Rushdown #1 draws 2!
  assert.equal(playCard(wState, erup1.instanceId, enemy.id).ok, true);
  assert.equal(wState.combat.stance, 'wrath');
  assert.equal(wState.player.energy, 8);
  assert.equal(wState.player.block, 5);
  assert.equal(wState.combat.hand.some((c) => c.instanceId === flurry.instanceId), true, 'Flurry of Blows returns from discard on stance change');
  assert.equal(wState.combat.rushdownTriggersThisTurn, 1);
  assert.equal(getEnemyIntentPreview(enemy, wState.player).totalDamage, 20, 'Enemy attack doubles in Wrath');
  assert.equal(calculateAttackDamage(6, wState.player, enemy), 12, 'Player attack doubles in Wrath');

  // Swap 2 (Wrath -> Calm -> Wrath): Rushdown #2 draws 2
  const handBeforeR2 = wState.combat.hand.length;
  playCard(wState, tranq1.instanceId);
  playCard(wState, cresc1.instanceId);
  assert.equal(wState.combat.rushdownTriggersThisTurn, 2);
  assert.equal(wState.combat.hand.length, handBeforeR2, 'Played 2 cards, Rushdown #2 drew 2');

  // Swap 3 (Wrath -> Calm -> Wrath): Rushdown is UNCAPPED like original Slay the Spire -> draws 2 again!
  const drawPileBeforeR3 = wState.combat.drawPile.length;
  playCard(wState, tranq2.instanceId);
  const synR3 = computeCardSynergies(wState, cresc2);
  assert.ok(synR3.callouts.some((c) => c.tone === 'buff' && c.text.includes('猛虎下山')));
  playCard(wState, cresc2.instanceId);
  assert.equal(wState.combat.rushdownTriggersThisTurn, 3);
  assert.equal(wState.combat.drawPile.length, drawPileBeforeR3 - 2, 'Uncapped Rushdown draws 2 on 3rd Wrath entry');

  // 2. Mantra -> Divinity (3x damage, +3E, auto-exit on next turn) + Damaru + Devotion + Brilliance
  const mState = createNewRun({ seed: 13002, characterId: 'watcher', skipNeow: true });
  mState.player.relics = ['damaru'];
  startCombat(mState, ENCOUNTERS.floor1[0], 'normal');
  const mEnemy = mState.combat.enemies[0];
  mEnemy.hp = 200;
  mEnemy.maxHp = 200;
  mEnemy.intent = { id: 'idle', name: '待机', type: 'buff', summary: '待机' };
  assert.equal(mState.player.statuses.mantra, 1, 'Damaru grants 1 Mantra on Turn 1');
  mState.player.energy = 5;
  const pray = createCardInstance(mState, 'pray', true); // +5 Mantra -> 6
  const worship = createCardInstance(mState, 'worship', true); // +5 Mantra -> 11 -> Divinity + 1 leftover!
  const brilliance = createCardInstance(mState, 'brilliance', false); // 12 + 11 combat mantra = 23 * 3 = 69!
  mState.combat.hand = [pray, worship, brilliance];
  playCard(mState, pray.instanceId);
  assert.equal(mState.player.statuses.mantra, 6);
  playCard(mState, worship.instanceId);
  assert.equal(mState.combat.stance, 'divinity');
  assert.equal(mState.player.statuses.mantra, 1, 'Excess Mantra carries over past 10');
  assert.equal(mState.player.energy, 6, '5 - 1 - 1 + 3 (Divinity) = 6');
  const hpBeforeBril = mEnemy.hp;
  playCard(mState, brilliance.instanceId, mEnemy.id);
  assert.equal(hpBeforeBril - mEnemy.hp, 69, 'Brilliance scales with combatMantra (12+11=23) and triples in Divinity (69)');
  endPlayerTurn(mState);
  assert.equal(mState.combat.stance, 'neutral', 'Divinity automatically exits at start of next player turn');

  // 3. Blasphemy lethal oath kills player at start of next turn
  const bState = createNewRun({ seed: 13003, characterId: 'watcher', skipNeow: true });
  startCombat(bState, ENCOUNTERS.floor1[0], 'normal');
  bState.combat.enemies[0].hp = 200;
  bState.combat.enemies[0].intent = { id: 'idle', name: '待机', type: 'buff', summary: '待机' };
  const blas = createCardInstance(bState, 'blasphemy', false);
  bState.combat.hand = [blas];
  const blasSyn = computeCardSynergies(bState, blas);
  assert.ok(blasSyn.callouts.some((c) => c.tone === 'warn' && c.text.includes('渎神誓约')));
  playCard(bState, blas.instanceId);
  assert.equal(bState.combat.stance, 'divinity');
  assert.equal(bState.player.statuses.blasphemer, 1);
  endPlayerTurn(bState);
  assert.equal(bState.player.hp, 0);
  assert.equal(bState.runOutcome, 'defeat');
  assert.equal(bState.player.stance, 'neutral');

  // 4. Scry ecosystem: Golden Eye (+2), Nirvana (+4 block/discard), Weave (return from discard), Cut Through Fate (Scry then draw), Foresight (start-of-turn Scry)
  const scState = createNewRun({ seed: 13004, characterId: 'watcher', skipNeow: true });
  scState.player.relics = ['golden_eye'];
  startCombat(scState, ENCOUNTERS.floor1[0], 'normal');
  const scEnemy = scState.combat.enemies[0];
  scEnemy.hp = 120;
  scState.player.statuses.nirvana = 4;
  scState.player.block = 0;
  const weave = createCardInstance(scState, 'weave', false);
  const ctf = createCardInstance(scState, 'cut_through_fate', false); // Scry 2 + 2 Golden Eye = 4, then Draw 1
  const topA = createCardInstance(scState, 'wound', false);
  const topB = createCardInstance(scState, 'strike', false);
  const topC = createCardInstance(scState, 'halt', false);
  const topD = createCardInstance(scState, 'defend', false);
  scState.combat.hand = [ctf];
  scState.combat.discardPile = [weave];
  scState.combat.drawPile = [topA, topB, topC, topD];
  playCard(scState, ctf.instanceId, scEnemy.id);
  assert.equal(scState.combat.pendingCardChoice?.mode, 'scry');
  assert.equal(scState.combat.pendingCardChoice.candidates.length, 4, 'Golden Eye adds +2 to Scry 2 -> 4');
  toggleScryChoice(scState, topA.instanceId);
  toggleScryChoice(scState, topB.instanceId);
  confirmScryChoice(scState);
  assert.equal(scState.player.block, 8, 'Nirvana grants 4*2 = 8 block on 2 Scry discards');
  assert.equal(scState.combat.hand.some((c) => c.instanceId === weave.instanceId), true, 'Weave returns from discard on Scry');
  assert.equal(scState.combat.hand.some((c) => c.instanceId === topC.instanceId), true, 'Cut Through Fate draws top remaining card after Scry');

  // 5. Talk to the Hand, Wallop, Halt (Wrath), Fear No Evil, Inner Peace, Crush Joints (ifLastCardType), Bowling Bash, Pressure Points (Mark), Judgment, Lesson Learned
  const kState = createNewRun({ seed: 13005, characterId: 'watcher', skipNeow: true });
  kState.player.relics = ['duality'];
  startCombat(kState, ENCOUNTERS.normal[0], 'normal'); // 2 enemies
  const [e1, e2] = kState.combat.enemies;
  e1.hp = 100;
  e1.maxHp = 100;
  e1.block = 10;
  e1.intent = { id: 'atk', name: '撕咬', type: 'attack', damage: 8, hits: 1 };
  e2.hp = 25;
  e2.maxHp = 40;
  e2.block = 15;
  kState.player.energy = 10;
  kState.player.block = 0;

  const tth = createCardInstance(kState, 'talk_to_the_hand', false); // 5 dmg + 2 TTH
  const bb = createCardInstance(kState, 'bowling_bash', false); // 7 * 2 enemies = 14
  const pp = createCardInstance(kState, 'pressure_points', false); // +9 Mark & trigger (ignores block!)
  const judg = createCardInstance(kState, 'judgment', false); // <=30 instant kill!
  const halt = createCardInstance(kState, 'halt', false);
  const cj = createCardInstance(kState, 'crush_joints', false); // skill -> vulnerable
  const fne = createCardInstance(kState, 'fear_no_evil', false); // attacking -> Calm
  kState.combat.hand = [tth, bb, pp, judg, halt, cj, fne];

  // Judgment preview is lethal on e2 (hp 25 <= 30), null on e1 (hp 100 > 30)
  assert.equal(previewCardDamageOnEnemy(kState, judg, e2)?.isLethal, true);
  assert.equal(previewCardDamageOnEnemy(kState, judg, e1), null);

  // Pressure Points ignores e1's 10 block and deals 9 direct HP loss
  const e1HpBeforeMark = e1.hp;
  playCard(kState, pp.instanceId, e1.id);
  assert.equal(e1.statuses.mark, 9);
  assert.equal(e1.hp, e1HpBeforeMark - 9, 'Pressure Points Mark ignores enemy block');
  assert.equal(e1.block, 10);

  // Crush Joints after Pressure Points (a Skill!) triggers Vulnerable
  const cjSyn = computeCardSynergies(kState, cj, e1.id);
  assert.ok(cjSyn.callouts.some((c) => c.tone === 'buff' && c.text.includes('技能牌')));
  playCard(kState, cj.instanceId, e1.id);
  assert.ok((e1.statuses.vulnerable ?? 0) >= 1, 'Crush Joints applies Vulnerable after a Skill');
  assert.equal(kState.player.statuses.dexterity, 1, 'Duality grants +1 temp Dex on Attack');

  // Talk to the Hand + Bowling Bash multi-hit -> block per hit
  playCard(kState, tth.instanceId, e1.id);
  const blkBeforeBB = kState.player.block;
  playCard(kState, bb.instanceId, e1.id);
  assert.ok(kState.player.block >= blkBeforeBB + 4, 'Talk to the Hand triggers on every Bowling Bash hit');

  // Judgment kills e2 through 15 block
  playCard(kState, judg.instanceId, e2.id);
  assert.equal(e2.hp, 0, 'Judgment instantly kills enemy with HP <= 30 through Block');

  // Fear No Evil vs attacking e1 enters Calm
  playCard(kState, fne.instanceId, e1.id);
  assert.equal(kState.combat.stance, 'calm');

  // Lesson Learned fatal permanently upgrades a card in master deck
  const llState = createNewRun({ seed: 13006, characterId: 'watcher', skipNeow: true });
  const unupgradedBefore = llState.player.deck.filter((c) => !c.upgraded).length;
  startCombat(llState, ENCOUNTERS.floor1[0], 'normal');
  llState.combat.enemies[0].hp = 8;
  const llCard = createCardInstance(llState, 'lesson_learned', false);
  llState.combat.hand = [llCard];
  playCard(llState, llCard.instanceId, llState.combat.enemies[0].id);
  const unupgradedAfter = llState.player.deck.filter((c) => !c.upgraded).length;
  assert.equal(unupgradedAfter, unupgradedBefore - 1, 'Lesson Learned fatal must permanently upgrade 1 master deck card');

  // 6. Retain scaling (Sands of Time, Perseverance, Establishment), Vault extra turn, Conclude end turn, Fasting, Deva Form, Omega, Miracle Potion & Ambrosia
  const rState = createNewRun({ seed: 13007, characterId: 'watcher', skipNeow: true });
  rState.player.potions = ['miracle_potion', 'ambrosia', null];
  startCombat(rState, ENCOUNTERS.floor1[0], 'normal');
  rState.combat.enemies[0].hp = 200;
  rState.combat.enemies[0].intent = { id: 'atk', name: '攻击', type: 'attack', damage: 15, hits: 1 };
  const sands = createCardInstance(rState, 'sands_of_time', false); // cost 4 -> 2 after retain + establishment!
  const pers = createCardInstance(rState, 'perseverance', false); // block 6 -> 9 on retain
  const vault = createCardInstance(rState, 'vault', true); // 2E extra turn
  rState.player.statuses.establishment = 1;
  rState.player.statuses.omega = 50;
  rState.combat.hand = [sands, pers, vault];

  // Vault skips enemy attack and still triggers Retain scaling & Omega!
  const hpBeforeVault = rState.player.hp;
  playCard(rState, vault.instanceId);
  assert.equal(rState.player.hp, hpBeforeVault, 'Vault extra turn skips enemy attack completely');
  assert.equal(rState.combat.enemies[0].hp, 150, 'Omega deals 50 AoE damage at end of turn');
  assert.equal(getEffectiveCardCost(getCardStats(sands), rState.player, rState.combat), 2, 'Sands of Time (-1) + Establishment (-1) drops cost 4 -> 2');
  assert.equal(getCardStats(pers).block, 9, 'Perseverance grows +3 block when retained');

  // Miracle Potion & Ambrosia potions
  assert.equal(usePotion(rState, 0).ok, true);
  assert.ok(rState.combat.hand.filter((c) => c.cardId === 'miracle').length >= 2, 'Miracle Potion adds 2 Miracles');
  assert.equal(usePotion(rState, 1).ok, true);
  assert.equal(rState.combat.stance, 'divinity', 'Ambrosia enters Divinity immediately');

  // 7. Enchiridion strictly draws Powers from Watcher's own pool (never Ironclad/Silent)
  const enchState = createNewRun({ seed: 13008, characterId: 'watcher', skipNeow: true });
  enchState.player.relics.push('enchiridion');
  startCombat(enchState, ENCOUNTERS.floor1[0], 'normal');
  const zeroCostPowers = enchState.combat.hand.filter((c) => c.tempZeroCostTurn && getCardStats(c).type === 'power');
  assert.equal(zeroCostPowers.length, 1);
  const pChar = getCardCharacter(zeroCostPowers[0]);
  assert.ok(pChar === 'watcher' || pChar === 'colorless', `Enchiridion leaked ${pChar} power to Watcher`);
});

test('P1 Relics & Potions: Artifact, Nunchaku, Pen Nib, Paper Krane, Strike Dummy, Lizard Tail, Dead Branch, Clay/Runic Cube caps, Hovering Kite, Cloak Clasp, Magic Flower, Champion Belt, Pocketwatch, Art of War, Sundial, Melange, Brimstone, Twisted Funnel, Thread & Needle, Insect, Pantograph, Slavers Collar, Toy Ornithopter & 12 New Potions', () => {
  // 1. Artifact (Clockwork Souvenir / Ancient Potion) blocks debuff, Paper Krane reduces Weak attack to 65%, Pen Nib doubles 10th attack, Strike Dummy adds +3 to Strikes, Nunchaku grants +1 energy on 10th attack
  const s1 = createNewRun({ seed: 20001, characterId: 'silent', skipNeow: true });
  s1.player.relics = ['clockwork_souvenir', 'paper_krane', 'strike_dummy', 'nunchaku', 'pen_nib', 'bronze_scales', 'thread_and_needle', 'twisted_funnel'];
  s1.relicCounters = { nunchaku: 9, pen_nib: 9 };
  startCombat(s1, ENCOUNTERS.floor1[0], 'normal');
  const en1 = s1.combat.enemies[0];
  en1.hp = 120;
  assert.equal(s1.player.statuses.artifact, 1, 'Clockwork Souvenir grants 1 Artifact');
  assert.equal(s1.player.statuses.thorns, 3, 'Bronze Scales grants 3 Thorns');
  assert.equal(s1.player.statuses.platedArmor, 3, 'Thread and Needle grants 3 Plated Armor');
  assert.equal(en1.statuses.poison, 3, 'Twisted Funnel poisons all enemies for 3');
  assert.equal(s1.player.penNibActive, true, 'Pen Nib arms at counter 9/10');

  // Artifact blocks incoming Vulnerable cleanly
  assert.equal(applyStatus(s1.player, 'vulnerable', 2), false);
  assert.equal(s1.player.statuses.vulnerable ?? 0, 0);
  assert.equal(s1.player.statuses.artifact ?? 0, 0);

  // Paper Krane Weak multiplier (0.65x instead of 0.75x)
  en1.statuses.weak = 2;
  assert.equal(calculateAttackDamage(20, en1, s1.player), 13, 'Paper Krane reduces 20 dmg Weak attack to 13 (65%)');

  // Strike Dummy (+3) + Pen Nib (2x) + Nunchaku (+1 energy) on 10th attack!
  const strike = createCardInstance(s1, 'strike', false); // 6 + 3 = 9, *2 Pen Nib = 18
  s1.combat.hand = [strike];
  s1.player.energy = 3;
  const hpBeforeStrike = en1.hp;
  playCard(s1, strike.instanceId, en1.id);
  assert.equal(hpBeforeStrike - en1.hp, 18, 'Strike Dummy (+3) & Pen Nib (2x) deal 18 damage');
  assert.equal(s1.player.energy, 3, 'Nunchaku refunded +1 energy on 10th attack (3 - 1 + 1 = 3)');
  assert.equal(s1.relicCounters.nunchaku, 0);
  assert.equal(s1.relicCounters.pen_nib, 0);
  assert.equal(s1.player.penNibActive, false);

  // 2. Lizard Tail 30% revive once + restartCombat restores unused state; Self-Forming Clay (max 2/turn) & Runic Cube (max 1/phase) & Magic Flower (+50% combat heal) & Champion Belt & Dead Branch
  const s2 = createNewRun({ seed: 20002, characterId: 'ironclad', skipNeow: true });
  s2.player.maxHp = 80;
  s2.player.hp = 10;
  s2.player.relics = ['lizard_tail', 'self_forming_clay', 'runic_cube', 'magic_flower', 'champion_belt', 'dead_branch', 'brimstone', 'toy_ornithopter'];
  s2.player.potions = ['blood_surge_potion', 'ancient_potion', 'duplication_potion'];
  startCombat(s2, ENCOUNTERS.floor1[0], 'normal');
  const en2 = s2.combat.enemies[0];
  en2.hp = 150;
  assert.equal(s2.player.statuses.strength, 2, 'Brimstone grants +2 player Strength on turn 1');
  assert.equal(en2.statuses.strength, 1, 'Brimstone grants +1 enemy Strength on turn 1');

  // Champion Belt applies Weak when applying Vulnerable (e.g. Bash)
  const bash = createCardInstance(s2, 'bash', false);
  s2.combat.hand = [bash];
  s2.player.energy = 3;
  playCard(s2, bash.instanceId, en2.id);
  assert.equal(en2.statuses.vulnerable, 2);
  assert.equal(en2.statuses.weak, 1, 'Champion Belt adds 1 Weak alongside Vulnerable');

  // Toy Ornithopter + Magic Flower (+50% heal): Blood Surge (8 heal -> 12) + Ornithopter (5 heal -> 7) = +19 HP!
  const hpBeforePot = s2.player.hp;
  usePotion(s2, 0);
  assert.equal(s2.player.hp - hpBeforePot, 19, 'Magic Flower boosts both Blood Surge (8->12) and Ornithopter (5->7)');

  // Dead Branch adds a card to hand on Exhaust
  const seeingRed = createCardInstance(s2, 'seeing_red', false);
  s2.combat.hand = [seeingRed];
  s2.player.energy = 3;
  playCard(s2, seeingRed.instanceId);
  assert.equal(s2.combat.hand.length, 1, 'Dead Branch generated 1 card into hand on Exhaust');

  // Lizard Tail triggers on fatal enemy attack -> revives to 30% maxHp (24 HP) once
  s2.player.hp = 5;
  s2.player.block = 0;
  en2.intent = { id: 'fatal', name: '致命斩', type: 'attack', damage: 50, hits: 1 };
  endPlayerTurn(s2);
  assert.equal(s2.combat.status, 'ongoing', 'Lizard Tail prevented defeat');
  assert.equal(s2.player.hp, 24, 'Lizard Tail revived player to 30% of 80 Max HP = 24');
  assert.equal(s2.relicFlags.lizardTailUsed, true);
  assert.equal(restartCombat(s2).ok, true);
  assert.equal(Boolean(s2.relicFlags.lizardTailUsed), false, 'restartCombat restores Lizard Tail unused state');

  // 3. Hovering Kite, Pocketwatch (+2 draw if <=3 cards), Art of War (+1E if 0 attacks), Sundial, Melange, Cloak Clasp (pre-discard *2 capped at 10)
  const s3 = createNewRun({ seed: 20003, characterId: 'watcher', skipNeow: true });
  s3.player.relics = ['hovering_kite', 'pocketwatch', 'art_of_war', 'cloak_clasp', 'melange', 'sundial'];
  s3.relicCounters = { sundial: 2 };
  s3.player.potions = ['stance_potion', 'mantra_elixir', 'essence_of_steel'];
  startCombat(s3, ENCOUNTERS.floor1[0], 'normal');
  const en3 = s3.combat.enemies[0];
  en3.hp = 200;
  en3.intent = { id: 'idle', name: '待机', type: 'buff', summary: '待机' };
  // Stance Potion enters Wrath (+8 block + 1 draw), then Mantra Elixir (+6 mantra + 6 block), then Essence of Steel (+4 Plated Armor)
  assert.equal(usePotion(s3, 0).ok, true);
  assert.equal(s3.combat.stance, 'wrath');
  assert.ok(s3.player.block >= 8);
  assert.equal(usePotion(s3, 1).ok, true);
  if (s3.combat.pendingCardChoice?.mode === 'scry') confirmScryChoice(s3);
  assert.equal(s3.player.statuses.mantra, 6);
  assert.equal(usePotion(s3, 2).ok, true);
  assert.equal(s3.player.statuses.platedArmor, 4);
  // End turn with 0 cards played -> Art of War (+1E) + Pocketwatch (+2 draw triggers reshuffle -> Sundial +2E & Melange +4 Mantra => Divinity +3E! Total 3+1+2+3=9!)
  endPlayerTurn(s3);
  if (s3.combat.pendingCardChoice?.mode === 'scry') confirmScryChoice(s3);
  assert.equal(s3.combat.stance, 'divinity', 'Melange (+4 Mantra) + Mantra Elixir (6) reached 10 Mantra -> Divinity!');
  assert.equal(s3.player.energy, 9, 'Base 3 + Art of War (1) + Sundial (2) + Divinity (3) = 9 energy');
  assert.equal(s3.combat.hand.length, 7, 'Pocketwatch granted +2 extra draw (5 + 2 = 7) after <=3 cards played');

  // 4. Preserved Insect (-25% Elite HP), Pantograph (+25 Boss HP), Slaver's Collar (+1E in Elite/Boss), Ghost in a Jar, Gambler's Brew, Elixir Potion
  const s4Base = createNewRun({ seed: 20004, characterId: 'silent', skipNeow: true });
  startCombat(s4Base, ENCOUNTERS.elite[0], 'elite');
  const baseEliteMaxHp = s4Base.combat.enemies[0].maxHp;

  const s4 = createNewRun({ seed: 20004, characterId: 'silent', skipNeow: true });
  s4.player.hp = 30;
  s4.player.maxHp = 70;
  s4.player.relics = ['preserved_insect', 'pantograph', 'slavers_collar'];
  s4.player.potions = ['ghost_in_a_jar', 'gamblers_brew', 'elixir_potion'];
  startCombat(s4, ENCOUNTERS.elite[0], 'elite');
  assert.equal(s4.player.energy, 4, 'Slaver Collar grants +1 Energy in Elite combat');
  assert.equal(
    s4.combat.enemies[0].maxHp,
    Math.floor(baseEliteMaxHp * 0.75),
    'Preserved Insect reduces Elite starting HP by 25%'
  );
  assert.equal(usePotion(s4, 0).ok, true);
  assert.equal(s4.player.statuses.intangible, 1, 'Ghost in a Jar grants 1 Intangible');
  assert.equal(usePotion(s4, 1).ok, true);
  s4.combat.hand.push(createCardInstance(s4, 'wound', false));
  const blockBeforeElixir = s4.player.block;
  assert.equal(usePotion(s4, 2).ok, true);
  assert.equal(s4.player.block, blockBeforeElixir + 10, 'Elixir Potion grants 10 Block and exhausts status cards');
  assert.equal(s4.combat.hand.some((c) => c.cardId === 'wound'), false);

  startCombat(s4, ENCOUNTERS.boss[0], 'boss');
  assert.equal(s4.player.hp, 55, 'Pantograph heals 25 HP when entering Boss combat (30 -> 55)');
  assert.equal(s4.player.energy, 4, 'Slaver Collar grants +1 Energy in Boss combat');
});

test('P1 New Cards (Ironclad, Silent, Watcher & Colorless): core mechanics, triggers, synergies & previews', () => {
  // 1. Ironclad P1: Blood for Blood cost reduction, Rage block-on-attack, Double Tap, Combust, Sentinel exhaust energy, Berserk, Havoc
  const ic = createNewRun({ seed: 21001, characterId: 'ironclad', skipNeow: true });
  startCombat(ic, ENCOUNTERS.floor1[0], 'normal');
  const enIc = ic.combat.enemies[0];
  enIc.hp = 200;
  enIc.intent = { id: 'idle', name: '待机', type: 'buff', summary: '待机' };
  const bfb = createCardInstance(ic, 'blood_for_blood', false);
  const rage = createCardInstance(ic, 'rage', false);
  const dt = createCardInstance(ic, 'double_tap', false);
  const combust = createCardInstance(ic, 'combust', false);
  const sentinel = createCardInstance(ic, 'sentinel', false);
  const extraDefend = createCardInstance(ic, 'defend', false);
  const trueGrit = createCardInstance(ic, 'true_grit', true);
  const berserk = createCardInstance(ic, 'berserk', true);
  ic.combat.hand = [rage, dt, bfb, combust, sentinel, extraDefend, trueGrit, berserk];
  ic.player.energy = 10;

  assert.equal(getEffectiveCardCost(getCardStats(bfb), ic.player, ic.combat), 4);
  playCard(ic, combust.instanceId);
  playCard(ic, berserk.instanceId);
  assert.equal(ic.player.statuses.berserk, 1);
  assert.equal(ic.player.statuses.vulnerable, 1, 'Berserk+ applies 1 self Vulnerable');
  playCard(ic, rage.instanceId);
  playCard(ic, dt.instanceId);
  const hpBeforeBfb = enIc.hp;
  playCard(ic, bfb.instanceId, enIc.id);
  assert.equal(hpBeforeBfb - enIc.hp, 36, 'Double Tap plays Blood for Blood twice (18*2 = 36)');
  assert.ok(ic.player.block >= 3, 'Rage grants block on Attack');

  // Exhaust Sentinel via True Grit+ -> +2 energy
  const energyBeforeGrit = ic.player.energy;
  playCard(ic, trueGrit.instanceId);
  assert.equal(ic.combat.pendingCardChoice?.mode, 'exhaust');
  resolveCardChoice(ic, sentinel.instanceId);
  assert.equal(ic.player.energy, energyBeforeGrit - 1 + 2, 'Exhausting Sentinel grants +2 energy');

  // End turn -> Combust deals 5 AoE & loses 1 HP, reducing Blood for Blood cost by 1!
  const hpPreCombust = ic.player.hp;
  const enHpPreCombust = enIc.hp;
  endPlayerTurn(ic);
  assert.equal(ic.player.hp, hpPreCombust - 1, 'Combust deals 1 self HP loss');
  assert.equal(enHpPreCombust - enIc.hp, 5, 'Combust deals 5 AoE damage');
  assert.equal(ic.player.energy, 4, 'Berserk grants +1 energy at start of next turn');
  assert.equal(getEffectiveCardCost(getCardStats(bfb), ic.player, ic.combat), 3, 'Blood for Blood cost reduced after HP loss');

  // 2. Silent P1: Flechettes preview & hits, Choke, Heel Hook, Expertise, Well-Laid Plans, Phantasmal Killer, Die Die Die
  const si = createNewRun({ seed: 21002, characterId: 'silent', skipNeow: true });
  startCombat(si, ENCOUNTERS.floor1[0], 'normal');
  const enSi = si.combat.enemies[0];
  enSi.hp = 200;
  enSi.statuses.weak = 2;
  enSi.intent = { id: 'idle', name: '待机', type: 'buff', summary: '待机' };
  const flech = createCardInstance(si, 'flechettes', false);
  const def1 = createCardInstance(si, 'defend', false);
  const def2 = createCardInstance(si, 'defend', false);
  const choke = createCardInstance(si, 'choke', false);
  const heel = createCardInstance(si, 'heel_hook', false);
  const pk = createCardInstance(si, 'phantasmal_killer', false);
  const wlp = createCardInstance(si, 'well_laid_plans', false);
  si.combat.hand = [flech, def1, def2, choke, heel, pk, wlp];
  si.player.energy = 10;

  const flechPrev = previewCardDamageOnEnemy(si, flech, enSi);
  assert.equal(flechPrev.hits, 3, 'Flechettes counts 3 Skill cards in hand (2 Defends + Phantasmal Killer)');
  playCard(si, choke.instanceId, enSi.id);
  const hpAfterChoke = enSi.hp;
  const ePreHeel = si.player.energy;
  playCard(si, heel.instanceId, enSi.id);
  assert.equal(si.player.energy, ePreHeel, 'Heel Hook refunds 1 energy against Weak enemy');
  assert.equal(hpAfterChoke - enSi.hp, 5 + 3, 'Heel Hook (5) + Choke trigger (3) = 8 damage');

  playCard(si, pk.instanceId);
  playCard(si, wlp.instanceId);
  const wlpEndRes = endPlayerTurn(si);
  assert.equal(wlpEndRes.awaitingRetainChoice, true, 'Well-Laid Plans pauses end of turn for player retain selection');
  assert.equal(si.combat.pendingCardChoice?.mode, 'retain');
  const wlpConfirm = confirmPendingCardChoice(si, [def1.instanceId]);
  assert.equal(wlpConfirm.ok, true);
  assert.equal(si.player.statuses.doubleDamage, 1, 'Phantasmal Killer activates Double Damage next turn');
  assert.ok(si.combat.hand.some((c) => c.instanceId === def1.instanceId), 'Chosen Defend was retained by Well-Laid Plans');
  assert.ok(si.combat.hand.length >= 6, 'Well-Laid Plans retained 1 card + drew 5 next turn');

  // 3. Watcher P1: Master Reality (+Safety+), Battle Hymn (+Smite+), Wave of the Hand, Indignation, Swivel, Windmill Strike, Reach Heaven -> Through Violence, Meditate, Deus Ex Machina
  const wa = createNewRun({ seed: 21003, characterId: 'watcher', skipNeow: true });
  startCombat(wa, ENCOUNTERS.floor1[0], 'normal');
  const enWa = wa.combat.enemies[0];
  enWa.hp = 200;
  enWa.intent = { id: 'idle', name: '待机', type: 'buff', summary: '待机' };
  const mr = createCardInstance(wa, 'master_reality', false);
  const woth = createCardInstance(wa, 'wave_of_the_hand', false);
  const swivel = createCardInstance(wa, 'swivel', false);
  const windmill = createCardInstance(wa, 'windmill_strike', false);
  const reach = createCardInstance(wa, 'reach_heaven', false);
  const meditate = createCardInstance(wa, 'meditate', false);
  wa.combat.hand = [mr, woth, swivel, windmill, reach, meditate];
  wa.combat.drawPile = [createCardInstance(wa, 'deus_ex_machina', false)];
  const strikeDiscWa = createCardInstance(wa, 'strike', false);
  wa.combat.discardPile = [strikeDiscWa];
  wa.player.energy = 10;

  playCard(wa, mr.instanceId);
  assert.equal(wa.player.statuses.masterReality, 1);
  assert.ok(wa.combat.hand.some((c) => c.cardId === 'safety' && c.upgraded), 'Master Reality generates upgraded Safety+');

  playCard(wa, reach.instanceId, enWa.id);
  const tvCard = wa.combat.drawPile.find((c) => c.cardId === 'through_violence');
  assert.ok(tvCard && tvCard.upgraded, 'Master Reality upgrades Through Violence shuffled by Reach Heaven');

  playCard(wa, woth.instanceId);
  assert.ok((enWa.statuses.weak ?? 0) >= 1, 'Wave of the Hand applies Weak to all enemies');
  playCard(wa, swivel.instanceId);
  assert.equal(wa.player.statuses.freeAttackPower, 1, 'Swivel arms freeAttackPower');
  assert.equal(getEffectiveCardCost(getCardStats(windmill), wa.player, wa.combat), 0, 'Swivel makes Windmill Strike cost 0');

  // Meditate enters Calm, opens interactive discard-pile pick, and ends turn on confirm (retaining Windmill Strike -> +6 dmg!)
  playCard(wa, meditate.instanceId);
  assert.equal(wa.combat.stance, 'calm', 'Meditate enters Calm');
  assert.equal(wa.combat.pendingCardChoice?.mode, 'retrieve_discard_retain', 'Meditate prompts interactive discard choice');
  assert.equal(confirmPendingCardChoice(wa, [strikeDiscWa.instanceId]).ok, true);
  assert.equal(windmill.combatDamageMod, 6, 'Windmill Strike gained +6 permanent combat damage on retain');
  assert.ok(wa.combat.hand.some((c) => c.instanceId === strikeDiscWa.instanceId), 'Meditate retrieved chosen card and retained it into next turn');
  assert.ok(wa.combat.hand.some((c) => c.cardId === 'miracle' && c.upgraded), 'Deus Ex Machina auto-exhausted on draw into upgraded Miracles+');

  // 4. Colorless P1: Panacea (Artifact), Dark Shackles (-9 Str), Panache (every 5 cards 8 AoE), The Bomb (30 AoE after 3 turns)
  const co = createNewRun({ seed: 21004, characterId: 'ironclad', skipNeow: true });
  startCombat(co, ENCOUNTERS.floor1[0], 'normal');
  const enCo = co.combat.enemies[0];
  enCo.hp = 150;
  enCo.intent = { id: 'idle', name: '待机', type: 'buff', summary: '待机' };
  const panacea = createCardInstance(co, 'panacea', false);
  const shackles = createCardInstance(co, 'dark_shackles', false);
  const panache = createCardInstance(co, 'panache', false);
  const bomb = createCardInstance(co, 'the_bomb', false);
  const sA = createCardInstance(co, 'good_instincts', false);
  const sB = createCardInstance(co, 'good_instincts', false);
  co.combat.hand = [panache, panacea, shackles, bomb, sA, sB];
  co.player.energy = 10;

  playCard(co, panache.instanceId);
  playCard(co, panacea.instanceId);
  assert.equal(co.player.statuses.artifact, 1);
  playCard(co, shackles.instanceId, enCo.id);
  assert.equal(enCo.statuses.strength, -9);
  playCard(co, bomb.instanceId);
  assert.equal(co.combat.activeBombs.length, 1);
  playCard(co, sA.instanceId); // 4th card after Panache
  const hpPre5th = enCo.hp;
  playCard(co, sB.instanceId); // 5th card after Panache -> triggers Panache!
  assert.equal(hpPre5th - enCo.hp, 8, 'Panache deals 8 AoE on 5th card played after activation');

  // Tick 3 turns for The Bomb detonation (30 AoE)
  endPlayerTurn(co);
  assert.equal(co.combat.activeBombs[0].turns, 2);
  endPlayerTurn(co);
  assert.equal(co.combat.activeBombs[0].turns, 1);
  const hpPreBomb = enCo.hp;
  endPlayerTurn(co);
  assert.equal(hpPreBomb - enCo.hp, 30, 'The Bomb detonates for 30 AoE after 3 turns');
});

test('Watcher Original-StS Restorations: uncapped Rushdown, rarities, Omega 50/60, cross-turn Chain & Swivel, Nirvana 0-discard/empty Scry, Blasphemy+Intangible, Vault vs Time Eater, 0-dmg Talk to the Hand, interactive Meditate', () => {
  // 1. Original-StS Rarities & Omega 50/60
  assert.equal(RUSHDOWN_MAX_TRIGGERS_PER_TURN, Infinity);
  assert.equal(CARD_LIBRARY.omega.base.applySelfStatuses.omega, 50);
  assert.equal(CARD_LIBRARY.omega.upgraded.applySelfStatuses.omega, 60);
  assert.equal(CARD_LIBRARY.pressure_points.rarity, 'common');
  assert.equal(CARD_LIBRARY.indignation.rarity, 'uncommon');
  assert.equal(CARD_LIBRARY.sanctity.rarity, 'uncommon');
  assert.equal(CARD_LIBRARY.swivel.rarity, 'uncommon');

  // 2. Cross-turn lastCardTypePlayed (Crush Joints/Sanctity/Follow-Up/Sash Whip) & Cross-turn Swivel freeAttackPower
  const st = createNewRun({ seed: 23001, characterId: 'watcher', skipNeow: true });
  startCombat(st, ENCOUNTERS.floor1[0], 'normal');
  const en = st.combat.enemies[0];
  en.hp = 150;
  en.intent = { id: 'idle', name: '待机', type: 'buff', summary: '待机' };
  const swiv = createCardInstance(st, 'swivel', false); // Skill -> also sets lastCardTypePlayed='skill' & arms freeAttackPower
  const cj = createCardInstance(st, 'crush_joints', false); // Needs previous Skill for Vulnerable
  const rag = createCardInstance(st, 'ragnarok', false); // 3E Attack -> should cost 0E next turn from Swivel!
  st.combat.hand = [swiv];
  st.combat.drawPile = [cj, rag, createCardInstance(st, 'strike', false), createCardInstance(st, 'defend', false), createCardInstance(st, 'strike', false)];
  st.player.energy = 3;
  assert.equal(playCard(st, swiv.instanceId).ok, true);
  assert.equal(st.player.statuses.freeAttackPower, 1);
  assert.equal(st.combat.lastCardTypePlayed, 'skill');

  // End Turn 1 -> Turn 2 must preserve BOTH lastCardTypePlayed='skill' AND freeAttackPower=1!
  endPlayerTurn(st);
  assert.equal(st.combat.lastCardTypePlayed, 'skill', 'lastCardTypePlayed must persist across turns');
  assert.equal(st.player.statuses.freeAttackPower, 1, 'Swivel freeAttackPower must persist across turns');
  assert.equal(getEffectiveCardCost(getCardStats(rag), st.player, st.combat), 0, 'Ragnarok costs 0E on Turn 2 via Swivel');
  st.player.energy = 1; // Only 1 energy left -> play 0E Ragnarok? Wait, test Crush Joints first while lastCardTypePlayed==='skill'!
  assert.equal(playCard(st, cj.instanceId, en.id).ok, true);
  assert.equal(en.statuses.vulnerable, 1, 'Crush Joints triggers Vulnerable on Turn 2 from Turn 1 Skill');
  assert.equal(st.player.statuses.freeAttackPower, undefined, 'Swivel consumed on Crush Joints (cost 0E)');
  assert.equal(st.player.energy, 1, 'Crush Joints cost 0E thanks to cross-turn Swivel');

  // 3. Nirvana triggers on BOTH 0-discard Scry AND empty draw pile Scry
  const nv = createNewRun({ seed: 23002, characterId: 'watcher', skipNeow: true });
  startCombat(nv, ENCOUNTERS.floor1[0], 'normal');
  nv.combat.enemies[0].hp = 100;
  nv.player.statuses.nirvana = 4;
  nv.player.block = 0;
  const te1 = createCardInstance(nv, 'third_eye', false); // 7 block + Scry 3
  const te2 = createCardInstance(nv, 'third_eye', false);
  nv.combat.hand = [te1, te2];
  nv.combat.drawPile = [createCardInstance(nv, 'eruption', true)];
  playCard(nv, te1.instanceId);
  confirmScryChoice(nv, []); // Discard 0 cards!
  assert.equal(nv.player.block, 7 + 4, 'Nirvana grants 4 Block even when keeping all scried cards');
  nv.player.block = 0;
  nv.combat.drawPile = []; // Empty draw pile!
  playCard(nv, te2.instanceId);
  assert.equal(nv.player.block, 7 + 4, 'Nirvana grants 4 Block even when scrying an empty draw pile');

  // 4. Blasphemy + Intangible reduces lethal oath to 1 damage
  const bi = createNewRun({ seed: 23003, characterId: 'watcher', skipNeow: true });
  startCombat(bi, ENCOUNTERS.floor1[0], 'normal');
  bi.combat.enemies[0].hp = 200;
  bi.combat.enemies[0].intent = { id: 'idle', name: '待机', type: 'buff', summary: '待机' };
  bi.player.hp = 50;
  bi.player.statuses.intangible = 2; // 2 -> decays to 1 on end of turn, still active at start of next turn!
  const blas2 = createCardInstance(bi, 'blasphemy', false);
  bi.combat.hand = [blas2];
  playCard(bi, blas2.instanceId);
  endPlayerTurn(bi);
  assert.equal(bi.player.hp, 49, 'Intangible reduces Blasphemy lethal oath to 1 damage');
  assert.equal(bi.combat.status, 'ongoing');

  // 5. Vault played as Time Eater 12th card STILL grants extra turn & skips Time Eater attack!
  const vt = createNewRun({ seed: 23004, characterId: 'watcher', skipNeow: true });
  startCombat(vt, ENCOUNTERS.floor1[0], 'boss');
  const teBoss = vt.combat.enemies[0];
  teBoss.hp = 300;
  teBoss.statuses.timeWarp = 1; // Next card is the 12th card!
  teBoss.intent = { id: 'smash', name: '重击', type: 'attack', damage: 40, hits: 1 };
  vt.player.hp = 60;
  vt.player.block = 0;
  const vaultCard = createCardInstance(vt, 'vault', true);
  vt.combat.hand = [vaultCard];
  vt.player.energy = 3;
  const turnBefore = vt.combat.turn;
  playCard(vt, vaultCard.instanceId);
  assert.equal(vt.combat.turn, turnBefore + 1, 'Vault advanced to player extra turn');
  assert.equal(vt.player.hp, 60, 'Vault skipped Time Eater 40-damage attack even on 12th card');
  assert.equal(teBoss.statuses.timeWarp, 12, 'Time Warp counter reset after 12th card');

  // 6. Talk to the Hand triggers even on 0-damage attack hit + Interactive Meditate lets player choose Eruption+ from discard
  const tm = createNewRun({ seed: 23005, characterId: 'watcher', skipNeow: true });
  startCombat(tm, ENCOUNTERS.floor1[0], 'normal');
  const tEn = tm.combat.enemies[0];
  tEn.hp = 100;
  tEn.intent = { id: 'idle', name: '待机', type: 'buff', summary: '待机' };
  tEn.statuses.talkToTheHand = 3;
  tm.player.statuses.strength = -10; // Forces Strike to deal 0 damage!
  tm.player.block = 0;
  const zeroStrike = createCardInstance(tm, 'strike', false);
  const erupDiscard = createCardInstance(tm, 'eruption', true);
  const strikeDiscard = createCardInstance(tm, 'strike', false);
  const med = createCardInstance(tm, 'meditate', false);
  tm.combat.hand = [zeroStrike, med];
  tm.combat.discardPile = [erupDiscard, strikeDiscard]; // Basic strike is LAST in discard!
  tm.player.energy = 3;
  playCard(tm, zeroStrike.instanceId, tEn.id);
  assert.equal(tm.player.block, 3, 'Talk to the Hand grants Block even on 0-damage attack hits');
  playCard(tm, med.instanceId);
  assert.equal(tm.combat.pendingCardChoice?.mode, 'retrieve_discard_retain');
  assert.equal(togglePendingCardChoice(tm, erupDiscard.instanceId).ok, true);
  assert.equal(confirmPendingCardChoice(tm).ok, true);
  assert.ok(
    tm.combat.hand.some((c) => c.instanceId === erupDiscard.instanceId),
    'Interactive Meditate retrieves player-chosen Eruption+ from discard pile'
  );
});

test('Interactive Headbutt (discard_to_draw), Meditate+ (up to 2), Well-Laid Plans+ (up to 2) & all 7 new Act 2/3 enemies', () => {
  // 1. Headbutt interactive discard_to_draw (cannot pick itself, puts chosen card on top of drawPile)
  const hb = createNewRun({ seed: 43001, characterId: 'ironclad', skipNeow: true });
  startCombat(hb, ENCOUNTERS.floor1[0], 'normal');
  const hbEn = hb.combat.enemies[0];
  hbEn.hp = 100;
  const headbutt = createCardInstance(hb, 'headbutt', false);
  const bashDisc = createCardInstance(hb, 'bash', true);
  const strikeDisc = createCardInstance(hb, 'strike', false);
  hb.combat.hand = [headbutt];
  hb.combat.discardPile = [bashDisc, strikeDisc];
  hb.combat.drawPile = [createCardInstance(hb, 'defend', false)];
  hb.player.energy = 3;
  assert.equal(playCard(hb, headbutt.instanceId, hbEn.id).ok, true);
  assert.equal(hb.combat.pendingCardChoice?.mode, 'discard_to_draw');
  assert.equal(
    hb.combat.pendingCardChoice.candidates.some((c) => c.instanceId === headbutt.instanceId),
    false,
    'Headbutt must not offer itself as a discard candidate'
  );
  assert.equal(resolveCardChoice(hb, bashDisc.instanceId).ok, true);
  assert.equal(hb.combat.pendingCardChoice, null);
  assert.equal(hb.combat.drawPile[0].instanceId, bashDisc.instanceId, 'Chosen card placed on top of drawPile');

  // 2. Well-Laid Plans+ allows toggling up to 2 cards and retaining both across turn boundary
  const wlpRun = createNewRun({ seed: 43002, characterId: 'silent', skipNeow: true });
  startCombat(wlpRun, ENCOUNTERS.floor1[0], 'normal');
  wlpRun.combat.enemies[0].hp = 100;
  wlpRun.combat.enemies[0].intent = { id: 'idle', name: '待机', type: 'buff', summary: '待机' };
  const wlpPlus = createCardInstance(wlpRun, 'well_laid_plans', true);
  const c1 = createCardInstance(wlpRun, 'neutralize', false);
  const c2 = createCardInstance(wlpRun, 'survivor', false);
  const c3 = createCardInstance(wlpRun, 'strike', false);
  wlpRun.combat.hand = [wlpPlus, c1, c2, c3];
  wlpRun.player.energy = 3;
  playCard(wlpRun, wlpPlus.instanceId);
  const endRes = endPlayerTurn(wlpRun);
  assert.equal(endRes.awaitingRetainChoice, true);
  assert.equal(wlpRun.combat.pendingCardChoice.count, 2);
  assert.equal(togglePendingCardChoice(wlpRun, c1.instanceId).ok, true);
  assert.equal(togglePendingCardChoice(wlpRun, c2.instanceId).ok, true);
  assert.equal(togglePendingCardChoice(wlpRun, c3.instanceId).ok, false, 'Cannot exceed retain limit of 2');
  assert.equal(confirmPendingCardChoice(wlpRun).ok, true);
  assert.ok(wlpRun.combat.hand.some((c) => c.instanceId === c1.instanceId));
  assert.ok(wlpRun.combat.hand.some((c) => c.instanceId === c2.instanceId));
  assert.equal(wlpRun.combat.hand.some((c) => c.instanceId === c3.instanceId), false);

  // 3. Chosen (Turn 1 Poke, Turn 2 Hex -> adds Dazed to drawPile on Skill/Power, not on Attack)
  const chRun = createNewRun({ seed: 43003, characterId: 'ironclad', skipNeow: true });
  startCombat(chRun, ENCOUNTERS.act2Early.find((e) => e.id === 'chosen_solo'), 'normal');
  const chosen = chRun.combat.enemies[0];
  chosen.hp = 150;
  assert.equal(chosen.intent.id, 'chosen_poke', 'Chosen opens with Poke on Turn 1');
  endPlayerTurn(chRun);
  assert.equal(chosen.intent.id, 'chosen_hex', 'Chosen queues Hex on Turn 2');
  endPlayerTurn(chRun);
  assert.equal(chRun.player.statuses.hex, 1, 'Chosen applied Hex debuff on Turn 2');
  const dazedBefore = chRun.combat.drawPile.filter((c) => c.cardId === 'dazed').length;
  const stCard = createCardInstance(chRun, 'strike', false);
  const dfCard = createCardInstance(chRun, 'defend', false);
  chRun.combat.hand = [stCard, dfCard];
  chRun.player.energy = 3;
  playCard(chRun, stCard.instanceId, chosen.id);
  assert.equal(chRun.combat.drawPile.filter((c) => c.cardId === 'dazed').length, dazedBefore, 'Hex does NOT trigger on Attack');
  playCard(chRun, dfCard.instanceId);
  assert.equal(chRun.combat.drawPile.filter((c) => c.cardId === 'dazed').length, dazedBefore + 1, 'Hex shuffles Dazed into drawPile on Skill');

  // 4. Shelled Parasite (Plated Armor break stuns + Suck lifesteal)
  const spRun = createNewRun({ seed: 43004, characterId: 'ironclad', skipNeow: true });
  startCombat(spRun, ENCOUNTERS.act2Early.find((e) => e.id === 'shelled_parasite_solo'), 'normal');
  const parasite = spRun.combat.enemies[0];
  assert.ok(parasite.statuses.platedArmor >= 10, 'Shelled Parasite starts with Plated Armor');
  parasite.statuses.platedArmor = 1;
  parasite.block = 0;
  parasite.intent = { id: 'fell', name: '重击', type: 'attack', damage: 18, hits: 1 };
  const strikeBreak = createCardInstance(spRun, 'strike', false);
  spRun.combat.hand = [strikeBreak];
  spRun.player.energy = 3;
  playCard(spRun, strikeBreak.instanceId, parasite.id);
  assert.equal(parasite.statuses.platedArmor, undefined, 'Plated Armor broke to 0');
  assert.equal(parasite.intent.id, 'stunned', 'Breaking Shelled Parasite Plated Armor stuns it!');

  // Test Suck lifesteal
  parasite.hp = 40;
  parasite.intent = { id: 'suck', name: '吸血啃噬', type: 'attack_buff', damage: 10, hits: 1, lifesteal: true };
  spRun.player.block = 4;
  endPlayerTurn(spRun);
  assert.equal(parasite.hp, 46, 'Shelled Parasite Suck healed for 6 unblocked HP damage dealt');

  // 5. Snecko (Perplexing Glare applies Confused -> randomizes drawn card costs 0-3)
  const snRun = createNewRun({ seed: 43005, characterId: 'ironclad', skipNeow: true });
  startCombat(snRun, ENCOUNTERS.act2Hard.find((e) => e.id === 'snecko_solo'), 'normal');
  assert.equal(snRun.combat.enemies[0].intent.id, 'perplexing_glare');
  endPlayerTurn(snRun);
  assert.equal(snRun.player.statuses.confused, 1, 'Snecko applied Confused');
  assert.ok(
    snRun.combat.hand.every((c) => typeof c.combatCost === 'number' && c.combatCost >= 0 && c.combatCost <= 3),
    'Confused randomized all drawn card costs in 0..3'
  );

  // 6. Darkling x3 (Life Link regrows after 2 turns with 50% HP while an ally survives; simultaneous down wins combat)
  const dkRun = createNewRun({ seed: 43006, characterId: 'ironclad', skipNeow: true });
  startCombat(dkRun, ENCOUNTERS.act3Early.find((e) => e.id === 'darkling_trio'), 'normal');
  assert.equal(dkRun.combat.enemies.length, 3);
  const [dk0, dk1, dk2] = dkRun.combat.enemies;
  dk0.hp = 4;
  dk1.hp = 50;
  dk2.hp = 50;
  dk1.intent = { id: 'idle', name: '待机', type: 'buff', summary: '待机' };
  dk2.intent = { id: 'idle', name: '待机', type: 'buff', summary: '待机' };
  const killDk0 = createCardInstance(dkRun, 'strike', false);
  dkRun.combat.hand = [killDk0];
  dkRun.player.energy = 3;
  playCard(dkRun, killDk0.instanceId, dk0.id);
  assert.equal(dk0.hp, 0);
  assert.equal(dk0.darklingRegrowTurns, 2, 'Darkling enters 2-turn regrow while allies live');
  assert.equal(dkRun.combat.status, 'ongoing');
  endPlayerTurn(dkRun); // 2 -> 1
  assert.equal(dk0.hp, 0);
  assert.equal(dk0.darklingRegrowTurns, 1);
  dk1.intent = { id: 'idle', name: '待机', type: 'buff', summary: '待机' };
  dk2.intent = { id: 'idle', name: '待机', type: 'buff', summary: '待机' };
  endPlayerTurn(dkRun); // 1 -> revives at 50% HP!
  assert.equal(dk0.hp, Math.max(1, Math.floor(dk0.maxHp / 2)), 'Darkling revived at 50% max HP via Life Link');

  // Down all 3 Darklings -> immediate victory!
  dk0.hp = 3;
  dk1.hp = 3;
  dk2.hp = 3;
  const cleaveWin = createCardInstance(dkRun, 'cleave', false);
  dkRun.combat.hand = [cleaveWin];
  dkRun.player.energy = 3;
  playCard(dkRun, cleaveWin.instanceId);
  assert.equal(dkRun.combat.status, 'victory', 'Downing all 3 Darklings wins combat immediately');

  // 7. Spire Growth (Constricted end-of-turn blockable damage)
  const sgRun = createNewRun({ seed: 43007, characterId: 'ironclad', skipNeow: true });
  startCombat(sgRun, ENCOUNTERS.act3Hard.find((e) => e.id === 'spire_growth_solo'), 'normal');
  const sg = sgRun.combat.enemies[0];
  sg.intent = { id: 'idle', name: '待机', type: 'buff', summary: '待机' };
  sgRun.player.statuses.constricted = 10;
  sgRun.player.block = 4;
  const hpBeforeConstr = sgRun.player.hp;
  endPlayerTurn(sgRun);
  assert.equal(sgRun.player.hp, hpBeforeConstr - 6, 'Constricted 10 blocked 4 and dealt 6 HP damage at end of turn');

  // 8. Transient (Shifting temporary Strength drop & restore + Fading countdown auto-victory)
  const trRun = createNewRun({ seed: 43008, characterId: 'ironclad', skipNeow: true });
  startCombat(trRun, ENCOUNTERS.act3Hard.find((e) => e.id === 'transient_solo'), 'normal');
  const tr = trRun.combat.enemies[0];
  assert.equal(tr.statuses.shifting, 1);
  assert.equal(tr.statuses.fading, 5);
  tr.block = 0;
  const trStrike = createCardInstance(trRun, 'strike', false);
  trRun.combat.hand = [trStrike];
  trRun.player.energy = 3;
  playCard(trRun, trStrike.instanceId, tr.id);
  assert.equal(tr.statuses.strength, -6, 'Shifting dropped Transient Strength by 6 unblocked damage');
  assert.equal(tr.tempStrengthRestore, 6);
  tr.intent = { id: 'idle', name: '待机', type: 'buff', summary: '待机' };
  endPlayerTurn(trRun);
  assert.equal(tr.statuses.strength, undefined, 'Transient restored temporary Strength after its turn');
  assert.equal(tr.statuses.fading, 4, 'Fading decremented from 5 to 4');
  tr.statuses.fading = 1;
  tr.intent = { id: 'idle', name: '待机', type: 'buff', summary: '待机' };
  endPlayerTurn(trRun);
  assert.equal(trRun.combat.status, 'victory', 'Transient vanished when Fading hit 0, granting victory');

  // 9. Writhing Mass (Malleable + Reactive intent reroll on unblocked attack + Implant adds Parasite curse once)
  const wmRun = createNewRun({ seed: 43009, characterId: 'ironclad', skipNeow: true });
  wmRun.player.relics.push('darkstone_periapt');
  startCombat(wmRun, ENCOUNTERS.act3Hard.find((e) => e.id === 'writhing_mass_solo'), 'normal');
  const wm = wmRun.combat.enemies[0];
  assert.equal(wm.statuses.reactive, 1);
  assert.ok(wm.statuses.malleable >= 3);
  wm.block = 0;
  const prevIntentId = wm.intent.id;
  const wmStrike = createCardInstance(wmRun, 'strike', false);
  wmRun.combat.hand = [wmStrike];
  wmRun.player.energy = 3;
  playCard(wmRun, wmStrike.instanceId, wm.id);
  assert.notEqual(wm.intent.id, prevIntentId, 'Reactive rerolled Writhing Mass intent on unblocked attack damage');
  assert.ok(wm.block >= 3, 'Malleable granted Writhing Mass block on hit');

  // Force Implant intent and verify Parasite added to master deck + Darkstone Periapt +6 Max HP
  const maxHpPreImplant = wmRun.player.maxHp;
  wm.intent = { id: 'implant', name: '寄生植入', type: 'debuff', addCurseToDeck: 'parasite' };
  endPlayerTurn(wmRun);
  assert.equal(wm.implantUsed, true);
  assert.ok(wmRun.player.deck.some((c) => c.cardId === 'parasite'), 'Writhing Mass Implant added Parasite curse to deck');
  assert.equal(wmRun.player.maxHp, maxHpPreImplant + 6, 'Darkstone Periapt triggered +6 Max HP on Parasite curse');
});

test('Golden condition-met hand highlight (isCardBonusConditionMet) covers all 15 conditional cards across Watcher/Ironclad/Silent/Colorless', () => {
  const st = setupCustomCombat(44001, ENCOUNTERS.floor1[0]);
  const enemy = st.combat.enemies[0];
  enemy.hp = 50;
  enemy.statuses = {};
  enemy.intent = { id: 'defend', name: '防守', type: 'defend', block: 8 };
  st.combat.lastCardTypePlayed = null;
  st.combat.stance = 'neutral';
  st.combat.discardedThisTurn = 0;

  const mk = (cardId) => ({ instanceId: `m_${cardId}`, cardId, upgraded: false });

  // 1. Last-card-type combos: Sash Whip, Follow-Up (attack) vs Crush Joints, Sanctity (skill)
  assert.equal(isCardBonusConditionMet(st, mk('sash_whip')), false);
  assert.equal(isCardBonusConditionMet(st, mk('follow_up')), false);
  assert.equal(isCardBonusConditionMet(st, mk('crush_joints')), false);
  assert.equal(isCardBonusConditionMet(st, mk('sanctity')), false);

  st.combat.lastCardTypePlayed = 'attack';
  assert.equal(isCardBonusConditionMet(st, mk('sash_whip')), true);
  assert.equal(isCardBonusConditionMet(st, mk('follow_up')), true);
  assert.equal(isCardBonusConditionMet(st, mk('crush_joints')), false);
  assert.equal(isCardBonusConditionMet(st, mk('sanctity')), false);

  st.combat.lastCardTypePlayed = 'skill';
  assert.equal(isCardBonusConditionMet(st, mk('sash_whip')), false);
  assert.equal(isCardBonusConditionMet(st, mk('follow_up')), false);
  assert.equal(isCardBonusConditionMet(st, mk('crush_joints')), true);
  assert.equal(isCardBonusConditionMet(st, mk('sanctity')), true);

  // 2. Enemy status / intent / threshold combos
  assert.equal(isCardBonusConditionMet(st, mk('dropkick')), false);
  assert.equal(isCardBonusConditionMet(st, mk('heel_hook')), false);
  assert.equal(isCardBonusConditionMet(st, mk('bane')), false);
  assert.equal(isCardBonusConditionMet(st, mk('spot_weakness')), false);
  assert.equal(isCardBonusConditionMet(st, mk('fear_no_evil')), false);
  assert.equal(isCardBonusConditionMet(st, mk('judgment')), false);

  enemy.statuses = { vulnerable: 2, weak: 1, poison: 4 };
  enemy.intent = { id: 'chomp', name: '猛咬', type: 'attack', damage: 11, hits: 1 };
  enemy.hp = 25;
  assert.equal(isCardBonusConditionMet(st, mk('dropkick')), true);
  assert.equal(isCardBonusConditionMet(st, mk('heel_hook')), true);
  assert.equal(isCardBonusConditionMet(st, mk('bane')), true);
  assert.equal(isCardBonusConditionMet(st, mk('spot_weakness')), true);
  assert.equal(isCardBonusConditionMet(st, mk('fear_no_evil')), true);
  assert.equal(isCardBonusConditionMet(st, mk('judgment')), true);

  // 3. Stance, discard & hand-composition combos
  assert.equal(isCardBonusConditionMet(st, mk('halt')), false);
  assert.equal(isCardBonusConditionMet(st, mk('inner_peace')), false);
  assert.equal(isCardBonusConditionMet(st, mk('indignation')), false);
  assert.equal(isCardBonusConditionMet(st, mk('sneaky_strike')), false);

  st.combat.stance = 'wrath';
  assert.equal(isCardBonusConditionMet(st, mk('halt')), true);
  assert.equal(isCardBonusConditionMet(st, mk('indignation')), true);
  assert.equal(isCardBonusConditionMet(st, mk('inner_peace')), false);

  st.combat.stance = 'calm';
  assert.equal(isCardBonusConditionMet(st, mk('inner_peace')), true);
  assert.equal(isCardBonusConditionMet(st, mk('halt')), false);

  st.combat.discardedThisTurn = 1;
  assert.equal(isCardBonusConditionMet(st, mk('sneaky_strike')), true);

  st.combat.hand = [mk('impatience'), mk('defend')];
  assert.equal(isCardBonusConditionMet(st, mk('impatience')), true);
  st.combat.hand = [mk('impatience'), mk('strike')];
  assert.equal(isCardBonusConditionMet(st, mk('impatience')), false);
  assert.equal(isCardBonusConditionMet(st, mk('strike')), false);
});

test('Dead enemy battlefield cleanup & Minion flee-on-leader-death victory (Gremlin Leader, Reptomancer, Darkling regrow & legacy save reconcile)', () => {
  // 1. Gremlin Leader: killing a minion prunes it immediately; re-summoning keeps battlefield compact; killing Leader causes surviving minions to flee for immediate victory!
  const glRun = createNewRun({ seed: 99101, characterId: 'ironclad', skipNeow: true });
  startCombat(glRun, ENCOUNTERS.act2Elite.find((e) => e.id === 'gremlin_leader_elite'), 'elite');
  assert.equal(glRun.combat.enemies.length, 3);
  const leader = glRun.combat.enemies.find((e) => e.templateId === 'gremlin_leader');
  const minion1 = glRun.combat.enemies.find((e) => e.isMinion);
  assert.ok(leader && minion1);

  // Kill minion1 while Leader is alive -> pruned off battlefield immediately, combat stays ongoing
  minion1.hp = 5;
  const strike1 = createCardInstance(glRun, 'strike', true);
  glRun.combat.hand = [strike1];
  glRun.player.energy = 5;
  assert.equal(playCard(glRun, strike1.instanceId, minion1.id).ok, true);
  assert.equal(glRun.combat.status, 'ongoing');
  assert.equal(glRun.combat.enemies.length, 2, 'Dead minion must be pruned off combat.enemies immediately');
  assert.equal(glRun.combat.enemies.some((e) => e.id === minion1.id), false);

  // Leader rallies -> summons back to cap (2 live minions + 1 leader = 3 total, ZERO dead corpses)
  leader.intent = {
    id: 'leader_rally',
    name: '集结号角',
    type: 'buff',
    summonMinions: 'mad_gremlin',
    summonCount: 2,
    summonMax: 2,
    summonHp: 17,
  };
  endPlayerTurn(glRun);
  assert.equal(glRun.combat.enemies.length, 3, 'Battlefield must stay compact at 3 units (no dead corpse accumulation)');
  assert.equal(glRun.combat.enemies.filter((e) => e.isMinion && e.hp > 0).length, 2);

  // Kill Gremlin Leader while BOTH minions are still at 17/17 HP -> minions flee & combat immediately wins!
  leader.hp = 6;
  const killLeaderCard = createCardInstance(glRun, 'strike', true);
  glRun.combat.hand = [killLeaderCard];
  glRun.player.energy = 5;
  const resKill = playCard(glRun, killLeaderCard.instanceId, leader.id);
  assert.equal(resKill.ok, true);
  assert.equal(glRun.combat.status, 'victory', 'Killing Gremlin Leader must immediately win combat as surviving minions flee');
  assert.equal(glRun.combat.enemies.length, 0, 'All defeated and fleeing enemies cleared off battlefield');
  assert.equal(glRun.combat.fledEnemyIds.length, 2, 'Both surviving Mad Gremlin minions recorded as fled');
  assert.ok(glRun.combat.logs.some((l) => (l.message || l.text || '').includes('仓皇逃窜')), 'Log must record minions fleeing');
  assert.ok(glRun.stats.enemiesSlain >= 2, `Slain count must accurately include defeated enemies, got ${glRun.stats.enemiesSlain}`);

  // 2. Reptomancer: summon 2 Daggers -> killing Reptomancer causes surviving Daggers to flee immediately!
  const reptoRun = createNewRun({ seed: 99102, characterId: 'silent', skipNeow: true });
  startCombat(reptoRun, ENCOUNTERS.act3Elite.find((e) => e.id === 'reptomancer_elite'), 'elite');
  const repto = reptoRun.combat.enemies[0];
  repto.intent = { id: 'repto_summon', name: '召唤', type: 'buff', summonMinions: 'dagger', summonCount: 2 };
  endPlayerTurn(reptoRun);
  assert.equal(reptoRun.combat.enemies.length, 3, 'Reptomancer + 2 live Dagger minions');
  repto.hp = 5;
  const shiv = createCardInstance(reptoRun, 'shiv', true);
  reptoRun.combat.hand = [shiv];
  playCard(reptoRun, shiv.instanceId, repto.id);
  assert.equal(reptoRun.combat.status, 'victory', 'Killing Reptomancer must make surviving Daggers flee for instant victory');
  assert.equal(reptoRun.combat.fledEnemyIds.length, 2);

  // 3. Darkling Trio: downed Darkling entering regrow MUST remain on battlefield while allies live
  const dkRun = createNewRun({ seed: 99103, characterId: 'ironclad', skipNeow: true });
  startCombat(dkRun, ENCOUNTERS.act3Early.find((e) => e.id === 'darkling_trio'), 'normal');
  const dk0 = dkRun.combat.enemies[0];
  dk0.hp = 4;
  const sDk = createCardInstance(dkRun, 'strike', true);
  dkRun.combat.hand = [sDk];
  dkRun.player.energy = 3;
  playCard(dkRun, sDk.instanceId, dk0.id);
  assert.equal(dkRun.combat.status, 'ongoing');
  assert.equal(dkRun.combat.enemies.length, 3, 'Regrowing Darkling must stay visible on battlefield during regrow countdown');
  assert.equal(dk0.darklingRegrowTurns, 2);

  // 4. Legacy saved combat reconciliation (reproduces exact dead-leader + dead-corpses + 2-live-minions save state!)
  const legacyRun = createNewRun({ seed: 99104, characterId: 'silent', skipNeow: true });
  startCombat(legacyRun, ENCOUNTERS.act2Elite.find((e) => e.id === 'gremlin_leader_elite'), 'elite');
  delete legacyRun.combat.hadNonMinionEnemy;
  delete legacyRun.combat.defeatedEnemiesCount;
  const legLeader = legacyRun.combat.enemies.find((e) => e.templateId === 'gremlin_leader');
  legLeader.hp = 0;
  // Add 3 extra dead minions to mirror screenshot clutter
  legacyRun.combat.enemies.push(
    { ...structuredClone(legacyRun.combat.enemies[0]), id: 'dead_m1', hp: 0, isMinion: true },
    { ...structuredClone(legacyRun.combat.enemies[0]), id: 'dead_m2', hp: 0, isMinion: true },
    { ...structuredClone(legacyRun.combat.enemies[0]), id: 'dead_m3', hp: 0, isMinion: true }
  );
  const reconciled = reconcileCombatState(legacyRun);
  assert.equal(reconciled, true);
  assert.equal(legacyRun.combat.status, 'victory', 'Resuming a legacy save with dead leader + live minions must immediately trigger flee victory');
  assert.equal(legacyRun.combat.enemies.length, 0);
});

test('Canonical Enemy Artifact (Option A): Sentry 1, Spheric Guardian 3, Bronze Automaton 3, Donu/Deca 2 (A9+: 3) & full debuff negation parity', () => {
  // 1. Sentry (Act 1 Elite): 1 Artifact each -> Bash strips 1 Artifact without applying Vulnerable; second Bash applies Vulnerable
  const sentryRun = createNewRun({ seed: 99201, characterId: 'ironclad', skipNeow: true });
  startCombat(sentryRun, ENCOUNTERS.elite.find((e) => e.id === 'twin_sentries_elite'), 'elite');
  assert.equal(sentryRun.combat.enemies.length, 2);
  assert.equal(sentryRun.combat.enemies[0].statuses.artifact, 1, 'Sentry A must start with 1 Artifact');
  assert.equal(sentryRun.combat.enemies[1].statuses.artifact, 1, 'Sentry B must start with 1 Artifact');

  const s0 = sentryRun.combat.enemies[0];
  const bash1 = createCardInstance(sentryRun, 'bash', false);
  const bash2 = createCardInstance(sentryRun, 'bash', false);
  sentryRun.combat.hand = [bash1, bash2];
  sentryRun.player.energy = 6;
  playCard(sentryRun, bash1.instanceId, s0.id);
  assert.equal(s0.statuses.artifact ?? 0, 0, 'First Bash strips Sentry Artifact 1 -> 0');
  assert.equal(s0.statuses.vulnerable ?? 0, 0, 'Artifact must block Vulnerable from first Bash');
  assert.ok(
    sentryRun.combat.logs.some((l) => (l.message || '').includes('人工制品') && (l.message || '').includes('易伤')),
    'Combat log must record Artifact negating Vulnerable'
  );
  playCard(sentryRun, bash2.instanceId, s0.id);
  assert.equal(s0.statuses.vulnerable, 2, 'Second Bash applies Vulnerable after Artifact is stripped');

  // 2. Bag of Marbles vs Sentry: strips Artifact at combat start without applying Vulnerable
  const marbleRun = createNewRun({ seed: 99202, characterId: 'ironclad', skipNeow: true });
  grantRelicToPlayer(marbleRun, 'bag_of_marbles');
  startCombat(marbleRun, ENCOUNTERS.elite.find((e) => e.id === 'twin_sentries_elite'), 'elite');
  for (const sentry of marbleRun.combat.enemies) {
    assert.equal(sentry.statuses.artifact ?? 0, 0, 'Bag of Marbles strips Sentry 1 Artifact');
    assert.equal(sentry.statuses.vulnerable ?? 0, 0, 'Artifact blocks Bag of Marbles Vulnerable');
  }
  assert.ok(
    marbleRun.combat.logs.some((l) => (l.message || '').includes('人工制品') && (l.message || '').includes('弹珠袋')),
    'Combat log must record Artifact blocking Bag of Marbles'
  );

  // 3. Spheric Guardian (Act 2 Normal): 3 Artifact + Barricade -> Pressure Points blocked cleanly (no undefined log, no Sadistic Nature trigger)
  const sgRun = createNewRun({ seed: 99203, characterId: 'watcher', skipNeow: true });
  startCombat(sgRun, ENCOUNTERS.act2Early.find((e) => e.id === 'spheric_guardian_solo'), 'normal');
  const sg = sgRun.combat.enemies[0];
  assert.equal(sg.statuses.artifact, 3, 'Spheric Guardian must start with 3 Artifact');
  assert.equal(sg.statuses.barricade, 1);
  sgRun.player.statuses.sadisticNature = 5;
  const sgBlockBefore = sg.block;
  const sgHpBefore = sg.hp;
  const pp = createCardInstance(sgRun, 'pressure_points', false);
  sgRun.combat.hand = [pp];
  sgRun.player.energy = 3;
  playCard(sgRun, pp.instanceId, sg.id);
  assert.equal(sg.statuses.artifact, 2, 'Pressure Points strips 1 Artifact from Spheric Guardian (3 -> 2)');
  assert.equal(sg.statuses.mark ?? 0, 0, 'Artifact must block Mark from Pressure Points');
  assert.equal(sg.block, sgBlockBefore, 'Blocked Mark must NOT falsely trigger Sadistic Nature damage');
  assert.equal(sg.hp, sgHpBefore, 'Blocked Mark must NOT trigger HP loss');
  assert.equal(
    sgRun.combat.logs.some((l) => (l.message || '').includes('undefined')),
    false,
    'Blocked Pressure Points must never log undefined Mark stacks'
  );
  assert.ok(
    sgRun.combat.logs.some((l) => (l.message || '').includes('人工制品') && (l.message || '').includes('印记')),
    'Combat log must record Artifact negating Mark'
  );

  // 4. Bronze Automaton (Act 2 Boss): 3 Artifact + Metallicize 4 -> Piercing Wail & Fear Potion negated safely (no free enemy Strength!)
  const baRun = createNewRun({ seed: 99204, characterId: 'silent', skipNeow: true });
  startCombat(baRun, ENCOUNTERS.act2Boss.find((e) => e.id === 'automaton_boss'), 'boss');
  const ba = baRun.combat.enemies[0];
  assert.equal(ba.statuses.artifact, 3, 'Bronze Automaton must start with 3 Artifact');
  assert.equal(ba.statuses.metallicize, 4);
  const wail = createCardInstance(baRun, 'piercing_wail', false);
  baRun.combat.hand = [wail];
  baRun.player.energy = 3;
  playCard(baRun, wail.instanceId, ba.id);
  assert.equal(ba.statuses.artifact, 2, 'Piercing Wail strips 1 Artifact (3 -> 2)');
  assert.equal(ba.statuses.strength ?? 0, 0, 'Blocked Piercing Wail must not change Strength');
  assert.equal(ba.statuses.gainStrengthEndTurn ?? 0, 0, 'Blocked Piercing Wail must not grant enemy free GainStrength');
  baRun.player.potions[0] = 'fear_potion';
  usePotion(baRun, 0, ba.id);
  assert.equal(ba.statuses.artifact, 1, 'Fear Potion strips 1 Artifact (2 -> 1)');
  assert.equal(ba.statuses.vulnerable ?? 0, 0, 'Artifact blocks Fear Potion Vulnerable');
  assert.ok(
    baRun.combat.logs.some((l) => (l.message || '').includes('人工制品') && (l.message || '').includes('易伤')),
    'Combat log must record Artifact blocking Fear Potion Vulnerable'
  );

  // 5. Donu & Deca (Act 3 Twin Boss): 2 Artifact each at A0, scaling to 3 Artifact each at A9+
  const ddA0 = createNewRun({ seed: 99205, characterId: 'ironclad', ascension: 0, skipNeow: true });
  startCombat(ddA0, ENCOUNTERS.act3Boss.find((e) => e.id === 'donu_deca_boss'), 'boss');
  assert.equal(ddA0.combat.enemies.find((e) => e.templateId === 'donu').statuses.artifact, 2, 'Donu starts with 2 Artifact at A0');
  assert.equal(ddA0.combat.enemies.find((e) => e.templateId === 'deca').statuses.artifact, 2, 'Deca starts with 2 Artifact at A0');

  const ddA9 = createNewRun({ seed: 99206, characterId: 'ironclad', ascension: 9, skipNeow: true });
  startCombat(ddA9, ENCOUNTERS.act3Boss.find((e) => e.id === 'donu_deca_boss'), 'boss');
  assert.equal(ddA9.combat.enemies.find((e) => e.templateId === 'donu').statuses.artifact, 3, 'Donu scales to 3 Artifact at A9+');
  assert.equal(ddA9.combat.enemies.find((e) => e.templateId === 'deca').statuses.artifact, 3, 'Deca scales to 3 Artifact at A9+');
});

test('Section A1 — Full Gremlin Family (Fat, Shield, Sneaky, Wizard, Mad) & Randomized Gremlin Gang / Leader Summons', () => {
  // 1. Gremlin Pack draws 4 gremlins from the canonical 5-type pool (max 1 Shield, max 1 Wizard)
  const seenTypes = new Set();
  for (let seed = 99301; seed <= 99315; seed += 1) {
    const run = createNewRun({ seed, characterId: 'ironclad', skipNeow: true });
    startCombat(run, ENCOUNTERS.hardNormal.find((e) => e.id === 'gremlin_pack'), 'normal');
    assert.equal(run.combat.enemies.length, 4, 'Gremlin Pack must spawn 4 gremlins');
    for (const e of run.combat.enemies) {
      assert.ok(GREMLIN_POOL.includes(e.templateId), `Unexpected gremlin template: ${e.templateId}`);
      seenTypes.add(e.templateId);
    }
    assert.ok(run.combat.enemies.filter((e) => e.templateId === 'shield_gremlin').length <= 1);
    assert.ok(run.combat.enemies.filter((e) => e.templateId === 'gremlin_wizard').length <= 1);
  }
  assert.equal(seenTypes.size, 5, 'All 5 gremlin archetypes must appear across randomized packs');

  // 2. Fat Gremlin applies Weak; Sneaky Gremlin deals 9; Shield Gremlin protects ally then switches to Shield Bash when alone; Wizard charges 2 turns then deals 25
  const squad = setupCustomCombat(99320, {
    id: 'gremlin_mechanics_test',
    name: '地精全家测试',
    enemies: [
      { templateId: 'fat_gremlin' },
      { templateId: 'shield_gremlin' },
      { templateId: 'sneaky_gremlin' },
      { templateId: 'gremlin_wizard' },
    ],
  });
  const [fat, shield, sneaky, wizard] = squad.combat.enemies;
  assert.equal(fat.intent.damage, 4);
  assert.equal(fat.intent.applyPlayerStatuses.weak, 1);
  assert.equal(shield.intent.id, 'gremlin_protect');
  assert.equal(shield.intent.protectRandomAlly, true);
  assert.equal(sneaky.intent.damage, 9);
  assert.equal(wizard.intent.id, 'wizard_charge_1');

  squad.player.block = 30;
  endPlayerTurn(squad);
  assert.ok((squad.player.statuses.weak ?? 0) >= 1, 'Fat Gremlin must inflict Weak');
  assert.ok(
    [fat, sneaky, wizard].some((ally) => ally.block >= 7),
    'Shield Gremlin must shield a living ally'
  );
  assert.equal(wizard.intent.id, 'wizard_charge_2', 'Wizard advances to 2nd charge turn');

  squad.player.block = 30;
  endPlayerTurn(squad);
  assert.equal(wizard.intent.id, 'ultimate_blast', 'Wizard charges into 25-dmg Ultimate Blast on Turn 3');
  assert.equal(wizard.intent.damage, 25);

  // Solo Shield Gremlin uses Shield Bash (6 dmg) instead of Protect
  const soloShield = setupCustomCombat(99321, {
    id: 'solo_shield_test',
    name: '独狼盾地精',
    enemies: [{ templateId: 'shield_gremlin' }],
  });
  assert.equal(soloShield.combat.enemies[0].intent.id, 'shield_bash');
  assert.equal(soloShield.combat.enemies[0].intent.damage, 6);

  // 3. Gremlin Leader spawns with 2 random minions from GREMLIN_POOL and rallies from GREMLIN_POOL
  const leaderTypes = new Set();
  for (let s = 99330; s <= 99342; s += 1) {
    const r = createNewRun({ seed: s, characterId: 'ironclad', skipNeow: true });
    startCombat(r, ENCOUNTERS.act2Elite.find((e) => e.id === 'gremlin_leader_elite'), 'elite');
    const minions = r.combat.enemies.filter((e) => e.isMinion);
    assert.equal(minions.length, 2);
    for (const m of minions) leaderTypes.add(m.templateId);
  }
  assert.ok(leaderTypes.size >= 4, `Gremlin Leader minions must diversify across GREMLIN_POOL, saw ${[...leaderTypes]}`);
});

test('Section A2 — Slime L/M/S Sizes & 2-Stage Split Chain (Slime Boss -> Large -> Medium + Poison Split + Small Slimes)', () => {
  // 1. Slime Boss splits into Acid Slime (L) + Spike Slime (L) at <= 50% HP, and EACH Large Slime splits into 2 Medium Slimes at <= 50% HP!
  const run = setupCustomCombat(99401, ENCOUNTERS.boss.find((e) => e.id === 'slime_boss_enc'));
  const boss = run.combat.enemies[0];
  boss.hp = 60;
  const strike = createCardInstance(run, 'strike', false); // 6 dmg -> 54 HP (<= 70)
  run.combat.hand = [strike];
  run.player.energy = 3;
  playCard(run, strike.instanceId, boss.id);
  assert.equal(boss.intent.id, 'split');
  assert.deepEqual(boss.intent.splitInto, ['acid_slime_l', 'spike_slime_l']);

  endPlayerTurn(run);
  assert.equal(run.combat.enemies.length, 2);
  const [acidL, spikeL] = run.combat.enemies;
  assert.equal(acidL.templateId, 'acid_slime_l');
  assert.equal(spikeL.templateId, 'spike_slime_l');
  assert.equal(acidL.hp, 54);
  assert.equal(acidL.maxHp, 54);
  assert.equal(acidL.statuses.splitThreshold, 1, 'Split Large Acid Slime must have splitThreshold');
  assert.equal(spikeL.statuses.splitThreshold, 1, 'Split Large Spike Slime must have splitThreshold');

  // Drop Acid Slime (L) below half HP (54 -> 24) via attack, and drop Spike Slime (L) via Poison!
  acidL.hp = 30;
  const bash = createCardInstance(run, 'bash', false); // 8 dmg -> 22 HP (<= 27)
  run.combat.hand = [bash];
  run.player.energy = 3;
  playCard(run, bash.instanceId, acidL.id);
  assert.equal(acidL.intent.id, 'split', 'Large Acid Slime must interrupt to split at <= 50% HP');
  assert.deepEqual(acidL.intent.splitInto, ['acid_slime', 'acid_slime']);

  spikeL.hp = 29;
  spikeL.statuses.poison = 4; // Poison tick drops 29 -> 25 (<= 27) and triggers split on its turn!
  run.player.block = 40;
  endPlayerTurn(run);

  assert.equal(run.combat.enemies.length, 4, 'Both Large Slimes must split into 2 Medium Slimes each (4 total)');
  const mediums = run.combat.enemies;
  assert.equal(mediums.filter((e) => e.templateId === 'acid_slime').length, 2);
  assert.equal(mediums.filter((e) => e.templateId === 'spike_slime').length, 2);
  assert.equal(mediums.every((e) => !e.statuses.splitThreshold), true, 'Medium Slimes must not split further');
  assert.equal(mediums.filter((e) => e.templateId === 'acid_slime')[0].hp, 22);
  assert.equal(mediums.filter((e) => e.templateId === 'spike_slime')[0].hp, 25);

  // 2. Small Slimes (S) swarm encounter & movesets
  const swarm = setupCustomCombat(99402, ENCOUNTERS.hardNormal.find((e) => e.id === 'slime_swarm_small'));
  assert.equal(swarm.combat.enemies.length, 5);
  assert.equal(swarm.combat.enemies.filter((e) => e.templateId === 'spike_slime_s').length, 3);
  assert.equal(swarm.combat.enemies.filter((e) => e.templateId === 'acid_slime_s').length, 2);
  assert.equal(swarm.combat.enemies.find((e) => e.templateId === 'spike_slime_s').intent.damage, 5);
  assert.equal(swarm.combat.enemies.find((e) => e.templateId === 'acid_slime_s').intent.id, 'lick_s');
});

test('Section A3 — Act 2 Boss Summons: Bronze Automaton + Bronze Orbs (Stasis steal/return & cooldown) and The Collector + Torch Heads', () => {
  // 1. Bronze Automaton: Turn 0 spawns 2 Bronze Orb minions -> Orb steals highest-rarity card via Stasis -> killing Orb returns card -> killing Automaton makes remaining Orb flee
  const baRun = createNewRun({ seed: 99501, characterId: 'ironclad', skipNeow: true });
  startCombat(baRun, ENCOUNTERS.act2Boss.find((e) => e.id === 'automaton_boss'), 'boss');
  const auto = baRun.combat.enemies[0];
  assert.equal(auto.intent.id, 'spawn_orbs', 'Bronze Automaton Turn 0 must intend Spawn Orbs');

  endPlayerTurn(baRun);
  const orbs = baRun.combat.enemies.filter((e) => e.templateId === 'bronze_orb');
  assert.equal(orbs.length, 2, 'Bronze Automaton must summon 2 Bronze Orbs');
  assert.equal(orbs.every((o) => o.isMinion), true, 'Bronze Orbs must be flagged as minions');
  assert.equal(auto.intent.id, 'flail_beams', 'Automaton Turn 1 follows with Flail');

  // Place a Rare card (Bludgeon) + starter Strikes in drawPile; force Orb 0 to execute Stasis and Orb 1 to execute Support Beam
  const rareBludgeon = createCardInstance(baRun, 'bludgeon', false);
  baRun.combat.drawPile = [
    createCardInstance(baRun, 'strike', false),
    rareBludgeon,
    createCardInstance(baRun, 'defend', false),
  ];
  baRun.combat.discardPile = [];
  orbs[0].intent = { id: 'orb_stasis', name: '静止力场', type: 'debuff', stasisSteal: true };
  orbs[1].intent = { id: 'orb_support', name: '支援光束', type: 'defend', block: 8, supportBossBlock: true };
  auto.block = 0;
  baRun.player.block = 40;
  endPlayerTurn(baRun);

  assert.equal(orbs[0].stasisUsed, true);
  assert.equal(orbs[0].statuses.stasis, 1, 'Bronze Orb must display stasis status after stealing');
  assert.equal(orbs[0].stasisCard.instanceId, rareBludgeon.instanceId, 'Stasis must steal the highest-rarity card (Rare Bludgeon)');
  assert.equal(
    baRun.combat.drawPile.some((c) => c.instanceId === rareBludgeon.instanceId) ||
      baRun.combat.hand.some((c) => c.instanceId === rareBludgeon.instanceId),
    false,
    'Sealed card must be removed from player piles while held by Bronze Orb'
  );
  assert.ok(auto.block >= 8, 'Orb 1 Support Beam must shield Bronze Automaton');

  // Destroy Orb 0 -> Bludgeon immediately returns to hand!
  orbs[0].hp = 4;
  orbs[0].block = 0;
  const finisher = createCardInstance(baRun, 'strike', false);
  baRun.combat.hand = [finisher];
  baRun.player.energy = 3;
  playCard(baRun, finisher.instanceId, orbs[0].id);
  assert.equal(
    baRun.combat.hand.some((c) => c.instanceId === rareBludgeon.instanceId),
    true,
    'Destroying Bronze Orb must immediately return sealed card to hand'
  );
  assert.equal(baRun.combat.enemies.some((e) => e.id === orbs[0].id), false, 'Dead Bronze Orb pruned from battlefield');

  // Kill Bronze Automaton while Orb 1 is still alive -> Orb 1 flees for instant victory!
  auto.hp = 5;
  auto.block = 0;
  const killBoss = createCardInstance(baRun, 'strike', false);
  baRun.combat.hand = [killBoss];
  baRun.player.energy = 3;
  playCard(baRun, killBoss.instanceId, auto.id);
  assert.equal(baRun.combat.status, 'victory', 'Killing Bronze Automaton causes surviving Bronze Orb minion to flee');
  assert.equal(baRun.combat.fledEnemyIds.length, 1);

  // Verify Automaton Hyper Beam -> Cooldown (automaton_stunned) on A0
  const baCycle = createNewRun({ seed: 99502, characterId: 'ironclad', ascension: 0, skipNeow: true });
  startCombat(baCycle, ENCOUNTERS.act2Boss.find((e) => e.id === 'automaton_boss'), 'boss');
  const bossC = baCycle.combat.enemies[0];
  bossC.turnIndex = 5; // step = (5-1)%6 = 4 -> Hyper Beam
  bossC.intent = { id: 'hyper_beam', name: '超能光束', type: 'attack', damage: 38, hits: 1 };
  baCycle.player.block = 50;
  endPlayerTurn(baCycle);
  assert.equal(bossC.intent.id, 'automaton_stunned', 'Automaton must enter overload cooldown after Hyper Beam at A0');
  assert.equal(getEnemyIntentPreview(bossC, baCycle.player).label, '冷却');

  // 2. The Collector: Turn 0 spawns 2 Torch Head minions -> Turn 3 You Are Mine -> killing Collector makes Torch Heads flee
  const colRun = createNewRun({ seed: 99503, characterId: 'ironclad', skipNeow: true });
  startCombat(colRun, ENCOUNTERS.act2Boss.find((e) => e.id === 'collector_boss'), 'boss');
  const collector = colRun.combat.enemies[0];
  assert.equal(collector.intent.id, 'collector_spawn', 'The Collector Turn 0 must spawn Torch Heads');

  endPlayerTurn(colRun);
  const torches = colRun.combat.enemies.filter((e) => e.templateId === 'torch_head');
  assert.equal(torches.length, 2, 'The Collector must summon 2 Torch Head minions');
  assert.equal(torches.every((t) => t.isMinion), true);
  assert.equal(torches[0].intent.damage, 7);

  // Advance to Turn 3 -> You Are Mine mega debuff
  collector.turnIndex = 2;
  colRun.player.block = 50;
  endPlayerTurn(colRun);
  assert.equal(collector.intent.id, 'you_are_mine', 'The Collector must queue You Are Mine on Turn 4 (turnIndex=3)');

  // Kill Collector while Torch Heads live -> instant minion-flee victory!
  collector.hp = 5;
  collector.block = 0;
  const killCol = createCardInstance(colRun, 'strike', false);
  colRun.combat.hand = [killCol];
  colRun.player.energy = 3;
  playCard(colRun, killCol.instanceId, collector.id);
  assert.equal(colRun.combat.status, 'victory', 'Killing The Collector causes Torch Head minions to flee');
  assert.equal(colRun.combat.fledEnemyIds.length, 2);
});

test('Section A4 — Red Slaver (Entangled + Slavers Trio), Masked Bandits Trio (Pointy/Romeo/Bear), and Act 3 Jaw Worm Horde', () => {
  // 1. Red Slaver Entangled blocks Attacks (but Skills remain playable), Artifact blocks Entangled, and Entangled clears at end of player turn
  const rsRun = setupCustomCombat(99601, {
    id: 'red_slaver_test',
    name: '红衣奴隶贩测试',
    enemies: [{ templateId: 'slaver_red' }],
  });
  const redSlaver = rsRun.combat.enemies[0];
  assert.equal(redSlaver.intent.id, 'stab_red', 'Red Slaver opens with 13-dmg Stab');
  assert.equal(redSlaver.intent.damage, 13);

  redSlaver.intent = {
    id: 'entangle',
    name: '投网缠缚',
    type: 'debuff',
    applyPlayerStatuses: { entangled: 1 },
    markEntangleUsed: true,
  };
  endPlayerTurn(rsRun);
  assert.equal(redSlaver.entangleUsed, true);
  assert.equal(rsRun.player.statuses.entangled, 1);

  const strike = createCardInstance(rsRun, 'strike', false);
  const defend = createCardInstance(rsRun, 'defend', false);
  rsRun.combat.hand = [strike, defend];
  rsRun.player.energy = 3;
  assert.equal(canPlayCard(rsRun, strike.instanceId).playable, false, 'Entangled must block Attack cards');
  assert.equal(canPlayCard(rsRun, defend.instanceId).playable, true, 'Entangled must still allow Skill cards');
  assert.equal(playCard(rsRun, defend.instanceId).ok, true);

  // End turn clears Entangled; Artifact blocks Entangled cleanly
  redSlaver.intent = {
    id: 'entangle',
    name: '投网缠缚',
    type: 'debuff',
    applyPlayerStatuses: { entangled: 1 },
    markEntangleUsed: true,
  };
  rsRun.player.statuses.artifact = 1;
  endPlayerTurn(rsRun);
  assert.equal(rsRun.player.statuses.entangled ?? 0, 0, 'Entangled clears at end of turn and Artifact blocks re-application');
  assert.equal(rsRun.player.statuses.artifact ?? 0, 0, 'Artifact consumed blocking Entangled');

  // Act 2 Slavers Elite spawns all 3 canonical Slavers (Blue + Taskmaster + Red)
  const slaverElite = setupCustomCombat(99602, ENCOUNTERS.act2Elite.find((e) => e.id === 'slaver_taskmaster_elite'));
  assert.deepEqual(
    slaverElite.combat.enemies.map((e) => e.templateId),
    ['slaver_blue', 'slaver_taskmaster', 'slaver_red']
  );

  // 2. Masked Bandits event spawns Pointy + Romeo + Bear with canonical Turn 0 / Turn 1 movesets
  const mbRun = createNewRun({ seed: 99603, characterId: 'ironclad', skipNeow: true });
  mbRun.act = 2;
  mbRun.screen = 'event';
  mbRun.eventState = {
    eventId: 'masked_bandits',
    resolved: false,
    pendingPurge: false,
    pendingCardAction: null,
    libraryChoices: null,
    outcomeText: '',
    upgradedCardIds: [],
    addedCardIds: [],
  };
  assert.equal(chooseEventOption(mbRun, 'fight_bandits').ok, true);
  assert.deepEqual(
    mbRun.combat.enemies.map((e) => e.templateId),
    ['bandit_pointy', 'bandit_romeo', 'bandit_bear']
  );
  const [pointy, romeo, bear] = mbRun.combat.enemies;
  assert.equal(pointy.intent.damage, 5);
  assert.equal(pointy.intent.hits, 2);
  assert.equal(romeo.intent.id, 'romeo_mock');
  assert.equal(bear.intent.id, 'bear_hug');

  mbRun.player.block = 20;
  endPlayerTurn(mbRun);
  assert.equal(mbRun.player.statuses.dexterity, -2, 'Bear Hug must reduce player Dexterity by 2');
  assert.equal(romeo.intent.id, 'agonizing_slash', 'Romeo follows Mock with Agonizing Slash');
  assert.equal(bear.intent.id, 'bear_lunge', 'Bear follows Bear Hug with Lunge');

  // 3. Act 3 Jaw Worm Horde spawns 3 Jaw Worms pre-buffed with Bellow (+3 Str, +6 Block; A9+: +4 Str, +8 Block)
  const jwA0 = createNewRun({ seed: 99604, characterId: 'ironclad', ascension: 0, skipNeow: true });
  startCombat(jwA0, ENCOUNTERS.act3Hard.find((e) => e.id === 'jaw_worm_horde'), 'normal');
  assert.equal(jwA0.combat.enemies.length, 3);
  assert.equal(jwA0.combat.enemies.every((e) => e.templateId === 'jaw_worm' && e.hordeMode), true);
  assert.equal(jwA0.combat.enemies.every((e) => e.statuses.strength === 3 && e.block === 6), true);

  const jwA9 = createNewRun({ seed: 99605, characterId: 'ironclad', ascension: 9, skipNeow: true });
  startCombat(jwA9, ENCOUNTERS.act3Hard.find((e) => e.id === 'jaw_worm_horde'), 'normal');
  assert.equal(jwA9.combat.enemies.every((e) => e.statuses.strength === 4 && e.block === 8), true);
});

test('Act 4 Combat: Void energy drain, Spire Shield & Spear (Artifact + Surrounded back-attack flip & clear), and Corrupt Heart (Invincible cap/reset, Beat of Death, Debilitate 5 statuses, Escalating Buffs & A9 scaling)', () => {
  // 1. Void status card: Unplayable, Ethereal, drains 1 energy when drawn
  const voidRun = setupCustomCombat(99701, ENCOUNTERS.floor1[0]);
  voidRun.combat.hand = [];
  voidRun.combat.drawPile = [createCardInstance(voidRun, 'void', false)];
  voidRun.player.energy = 3;
  drawCards(voidRun, 1);
  assert.equal(voidRun.player.energy, 2, 'Drawing Void must drain 1 energy');
  assert.equal(voidRun.combat.hand.length, 1);
  assert.equal(canPlayCard(voidRun, voidRun.combat.hand[0].instanceId).playable, false, 'Void must be unplayable');
  endPlayerTurn(voidRun);
  assert.equal(
    voidRun.combat.exhaustPile.some((c) => c.cardId === 'void'),
    true,
    'Void must exhaust at end of turn via Ethereal'
  );

  // 2. Spire Shield & Spire Spear: Artifact (1 on A0, 2 on A9+), Surrounded +50% back-attack flip & clear on kill
  const ssRun = createNewRun({ seed: 99702, characterId: 'ironclad', ascension: 0, skipNeow: true });
  startCombat(ssRun, ENCOUNTERS.act4Elite[0], 'elite');
  const [shield, spear] = ssRun.combat.enemies;
  assert.equal(shield.templateId, 'spire_shield');
  assert.equal(spear.templateId, 'spire_spear');
  assert.equal(shield.statuses.artifact, 1);
  assert.equal(spear.statuses.artifact, 1);
  assert.equal(ssRun.player.statuses.surrounded, 1, 'Shield & Spear must inflict Surrounded');
  assert.equal(shield.backAttack, false, 'Player faces Spire Shield initially');
  assert.equal(spear.backAttack, true, 'Spire Spear starts behind player');
  assert.equal(spear.intent.id, 'spear_burn_strike');
  // Spear base 5 dmg with +50% back-attack = floor(5 * 1.5) = 7 per hit!
  assert.equal(calculateAttackDamage(5, spear, ssRun.player), 7, 'Back-attack enemy deals +50% damage');
  assert.equal(calculateAttackDamage(12, shield, ssRun.player), 12, 'Faced enemy deals normal damage');

  // Attacking Spire Spear flips facing so Spear is faced and Shield is behind!
  const atkSpear = createCardInstance(ssRun, 'strike', false);
  ssRun.combat.hand = [atkSpear];
  ssRun.player.energy = 3;
  assert.equal(playCard(ssRun, atkSpear.instanceId, spear.id).ok, true);
  assert.equal(spear.backAttack, false, 'Attacking Spear turns player to face Spear');
  assert.equal(shield.backAttack, true, 'Shield is now behind player');
  assert.equal(calculateAttackDamage(5, spear, ssRun.player), 5, 'Faced Spear no longer gets +50%');
  assert.equal(calculateAttackDamage(12, shield, ssRun.player), 18, 'Behind Shield now deals +50%');

  // Killing Spire Shield clears Surrounded and backAttack immediately
  shield.hp = 1;
  shield.block = 0;
  const finishShield = createCardInstance(ssRun, 'strike', false);
  ssRun.combat.hand = [finishShield];
  ssRun.player.energy = 3;
  assert.equal(playCard(ssRun, finishShield.instanceId, shield.id).ok, true);
  assert.equal(ssRun.player.statuses.surrounded ?? 0, 0, 'Killing one guard clears Surrounded');
  assert.equal(spear.backAttack, false, 'Surviving guard loses backAttack');

  // A9+ Shield & Spear get 2 Artifact and Spear shuffles Burns into drawPile
  const ssA9 = createNewRun({ seed: 99703, characterId: 'ironclad', ascension: 9, skipNeow: true });
  startCombat(ssA9, ENCOUNTERS.act4Elite[0], 'elite');
  assert.equal(ssA9.combat.enemies[0].statuses.artifact, 2);
  assert.equal(ssA9.combat.enemies[1].statuses.artifact, 2);
  assert.equal(ssA9.combat.enemies[1].intent.addDrawCards?.[0]?.cardId, 'burn', 'A9+ Spear puts Burns in draw pile');

  // 3. Corrupt Heart: Invincible 200 cap (A9+: 150) across Attack/Poison/Mark/Choke + reset on turn start,
  //    Beat of Death (1 / A9+: 2), Debilitate 5 statuses, Blood Shots/Echo + Escalating Buffs!
  const hRun = createNewRun({ seed: 99704, characterId: 'ironclad', ascension: 0, skipNeow: true });
  startCombat(hRun, ENCOUNTERS.act4Boss[0], 'boss');
  const heart = hRun.combat.enemies[0];
  assert.equal(heart.templateId, 'corrupt_heart');
  assert.equal(heart.hp, 550);
  assert.equal(heart.statuses.invincible, 200);
  assert.equal(heart.statuses.beatOfDeath, 1);
  assert.equal(heart.intent.id, 'heart_debilitate');

  // Beat of Death triggers on card play and respects Block
  hRun.player.hp = 80;
  hRun.player.block = 0;
  const defendCard = createCardInstance(hRun, 'defend', false); // Gains 5 block first, then Beat of Death hits block for 1 -> 4 block, 80 HP!
  const strikeCard = createCardInstance(hRun, 'strike', false);
  hRun.combat.hand = [defendCard, strikeCard];
  hRun.player.energy = 3;
  assert.equal(playCard(hRun, defendCard.instanceId).ok, true);
  assert.equal(hRun.player.hp, 80, 'Beat of Death must be blocked by Block gained from the card');
  assert.equal(hRun.player.block, 4, 'Beat of Death (1) consumes 1 point of Block');

  // Invincible caps total HP loss to 200 per turn (including Attack, Mark, Choke, Poison)
  hRun.player.statuses.strength = 250;
  assert.equal(playCard(hRun, strikeCard.instanceId, heart.id).ok, true);
  assert.equal(heart.hp, 350, 'Invincible 200 caps single 256-dmg strike to 200 HP loss');
  assert.equal(heart.statuses.invincible, 0, 'Invincible decrements to 0 when cap reached');
  // Further damage (attack / poison) this turn deals 0 HP loss!
  dealDamageToEnemy(hRun, heart, 99, { isAttack: true });
  assert.equal(heart.hp, 350, 'Heart cannot lose more HP once Invincible reaches 0');

  // End Turn 1 -> Heart casts Debilitate (Vulnerable 2, Weak 2, Frail 2 + 5 status cards in draw pile)
  // and Start Turn 2 resets Invincible back to 200!
  hRun.combat.drawPile = [];
  hRun.combat.discardPile = [];
  endPlayerTurn(hRun);
  assert.equal(hRun.player.statuses.vulnerable, 2);
  assert.equal(hRun.player.statuses.weak, 2);
  assert.equal(hRun.player.statuses.frail, 2);
  const allTurn2Cards = [...hRun.combat.hand, ...hRun.combat.drawPile, ...hRun.combat.discardPile].map((c) => c.cardId);
  for (const statusCardId of ['dazed', 'slimed', 'wound', 'burn', 'void']) {
    assert.ok(allTurn2Cards.includes(statusCardId), `Debilitate must shuffle ${statusCardId} into draw pile`);
  }
  assert.equal(heart.statuses.invincible, 200, 'Invincible must reset to 200 at start of next player turn');
  assert.ok(['heart_blood_shots', 'heart_echo'].includes(heart.intent.id), 'Turn 2 Heart attacks with Blood Shots or Echo');

  // Test Escalating Heart Buffs (1st: Artifact 2, 2nd: Beat of Death +1, 3rd: Painful Stabs, 4th: +10 Str, 5th: +50 Str)
  heart.statuses.strength = -4;
  heart.intent = { id: 'heart_buff', name: '心脏脉动', type: 'buff', isHeartBuff: true };
  endPlayerTurn(hRun);
  assert.equal(heart.statuses.strength, 2, 'Heart Buff clears negative Strength and gains +2');
  assert.equal(heart.statuses.artifact, 2, '1st Heart Buff grants 2 Artifact');

  heart.intent = { id: 'heart_buff', name: '心脏脉动', type: 'buff', isHeartBuff: true };
  endPlayerTurn(hRun);
  assert.equal(heart.statuses.beatOfDeath, 2, '2nd Heart Buff increases Beat of Death by +1');

  heart.intent = { id: 'heart_buff', name: '心脏脉动', type: 'buff', isHeartBuff: true };
  endPlayerTurn(hRun);
  assert.equal(heart.statuses.painfulStabs, 1, '3rd Heart Buff grants Painful Stabs');

  const strBefore4th = heart.statuses.strength;
  heart.intent = { id: 'heart_buff', name: '心脏脉动', type: 'buff', isHeartBuff: true };
  endPlayerTurn(hRun);
  assert.equal(heart.statuses.strength, strBefore4th + 12, '4th Heart Buff grants +2 +10 Strength');

  const strBefore5th = heart.statuses.strength;
  heart.intent = { id: 'heart_buff', name: '心脏脉动', type: 'buff', isHeartBuff: true };
  endPlayerTurn(hRun);
  assert.equal(heart.statuses.strength, strBefore5th + 52, '5th Heart Buff grants +2 +50 Strength');

  // A9+ Heart scaling: Invincible 150, Beat of Death 2, Blood Shots 2x15, Echo 45
  const hA9 = createNewRun({ seed: 99705, characterId: 'ironclad', ascension: 9, skipNeow: true });
  startCombat(hA9, ENCOUNTERS.act4Boss[0], 'boss');
  const heartA9 = hA9.combat.enemies[0];
  assert.equal(heartA9.statuses.invincible, 150);
  assert.equal(heartA9.statuses.beatOfDeath, 2);
  endPlayerTurn(hA9);
  if (heartA9.intent.id === 'heart_blood_shots') {
    assert.equal(heartA9.intent.hits, 15, 'A9+ Blood Shots hits 15 times');
  } else {
    assert.equal(heartA9.intent.damage, 45, 'A9+ Echo deals 45 damage');
  }
});

test('Havoc & random card effects emit structured cardReveals, clear logs, and follow canonical STS rules', () => {
  // 1. Havoc playing an Attack (Bash): free, exhausted, target & card revealed
  const s1 = setupCustomCombat(77101, ENCOUNTERS.floor1[0]);
  const enemy1 = s1.combat.enemies[0];
  enemy1.hp = 60;
  enemy1.maxHp = 60;
  const havoc1 = createCardInstance(s1, 'havoc', false);
  const bash1 = createCardInstance(s1, 'bash', false);
  s1.combat.hand = [havoc1];
  s1.combat.drawPile = [bash1];
  s1.combat.discardPile = [];
  s1.player.energy = 3;

  const res1 = playCard(s1, havoc1.instanceId);
  assert.equal(res1.ok, true);
  assert.equal(s1.player.energy, 2, 'Havoc costs 1 energy and plays top card for free');
  assert.equal(enemy1.hp, 52, 'Bash played via Havoc deals 8 damage');
  assert.equal(enemy1.statuses.vulnerable, 2, 'Bash played via Havoc applies 2 Vulnerable');
  assert.ok(s1.combat.exhaustPile.some((c) => c.instanceId === bash1.instanceId), 'Attack played via Havoc is exhausted');
  assert.equal(res1.cardReveals.length, 1);
  assert.equal(res1.cardReveals[0].kind, 'auto_play');
  assert.equal(res1.cardReveals[0].card.cardId, 'bash');
  assert.equal(res1.cardReveals[0].exhausted, true);
  assert.equal(res1.cardReveals[0].targetName, enemy1.name);
  assert.ok(res1.cardReveals[0].summary.includes('痛击'));

  // 2. Havoc playing a Power (Inflame): power activates and is NOT placed into exhaustPile (canonical STS)
  const s2 = setupCustomCombat(77102, ENCOUNTERS.floor1[0]);
  const havoc2 = createCardInstance(s2, 'havoc', true); // 0 cost
  const inflame2 = createCardInstance(s2, 'inflame', false);
  s2.combat.hand = [havoc2];
  s2.combat.drawPile = [inflame2];
  s2.combat.discardPile = [];
  s2.player.energy = 3;

  const res2 = playCard(s2, havoc2.instanceId);
  assert.equal(res2.ok, true);
  assert.equal(s2.player.statuses.strength, 2, 'Inflame played via Havoc grants +2 Strength');
  assert.equal(
    s2.combat.exhaustPile.some((c) => c.instanceId === inflame2.instanceId),
    false,
    'Powers played via Havoc remain active and must NOT enter exhaustPile'
  );
  assert.equal(res2.cardReveals.length, 1);
  assert.equal(res2.cardReveals[0].kind, 'auto_play');
  assert.equal(res2.cardReveals[0].card.cardId, 'inflame');
  assert.equal(res2.cardReveals[0].exhausted, false);

  // 3. Havoc playing an X-cost card (Whirlwind): uses current remaining energy as X WITHOUT spending energy
  const s3 = setupCustomCombat(77103, ENCOUNTERS.floor1[0]);
  const enemy3 = s3.combat.enemies[0];
  enemy3.hp = 60;
  enemy3.maxHp = 60;
  const havoc3 = createCardInstance(s3, 'havoc', false); // costs 1 -> 2 energy left
  const whirl3 = createCardInstance(s3, 'whirlwind', false); // 5 dmg * X
  s3.combat.hand = [havoc3];
  s3.combat.drawPile = [whirl3];
  s3.combat.discardPile = [];
  s3.player.energy = 3;

  const res3 = playCard(s3, havoc3.instanceId);
  assert.equal(res3.ok, true);
  assert.equal(s3.player.energy, 2, 'Havoc playing Whirlwind must NOT drain remaining energy');
  assert.equal(enemy3.hp, 50, 'Whirlwind via Havoc deals 5 * 2 = 10 damage using remaining 2 energy');
  assert.ok(s3.combat.exhaustPile.some((c) => c.instanceId === whirl3.instanceId));

  // 4. Havoc flipping Unplayable (Wound) or blocked Clash: exhausts and reports auto_exhaust reveal
  const s4 = setupCustomCombat(77104, ENCOUNTERS.floor1[0]);
  const havoc4 = createCardInstance(s4, 'havoc', true);
  const wound4 = createCardInstance(s4, 'wound', false);
  s4.combat.hand = [havoc4];
  s4.combat.drawPile = [wound4];
  s4.combat.discardPile = [];

  const res4 = playCard(s4, havoc4.instanceId);
  assert.equal(res4.ok, true);
  assert.ok(s4.combat.exhaustPile.some((c) => c.instanceId === wound4.instanceId));
  assert.equal(res4.cardReveals[0].kind, 'auto_exhaust');
  assert.equal(res4.cardReveals[0].card.cardId, 'wound');

  const s4b = setupCustomCombat(77105, ENCOUNTERS.floor1[0]);
  const enemy4b = s4b.combat.enemies[0];
  enemy4b.hp = 50;
  const havoc4b = createCardInstance(s4b, 'havoc', true);
  const defend4b = createCardInstance(s4b, 'defend', false);
  const clash4b = createCardInstance(s4b, 'clash', false);
  s4b.combat.hand = [havoc4b, defend4b];
  s4b.combat.drawPile = [clash4b];
  s4b.combat.discardPile = [];

  const res4b = playCard(s4b, havoc4b.instanceId);
  assert.equal(res4b.ok, true);
  assert.equal(enemy4b.hp, 50, 'Clash flipped by Havoc with non-attack in hand must not deal damage');
  assert.ok(s4b.combat.exhaustPile.some((c) => c.instanceId === clash4b.instanceId));
  assert.equal(res4b.cardReveals[0].kind, 'auto_exhaust');
  assert.equal(res4b.cardReveals[0].card.cardId, 'clash');

  // 5. Havoc with empty draw + discard pile reports empty reveal
  const s5 = setupCustomCombat(77106, ENCOUNTERS.floor1[0]);
  const havoc5 = createCardInstance(s5, 'havoc', true);
  s5.combat.hand = [havoc5];
  s5.combat.drawPile = [];
  s5.combat.discardPile = [];

  const res5 = playCard(s5, havoc5.instanceId);
  assert.equal(res5.ok, true);
  assert.equal(res5.cardReveals.length, 1);
  assert.equal(res5.cardReveals[0].kind, 'empty');
  assert.equal(res5.cardReveals[0].card, null);

  // 6. Havoc -> Havoc -> Strike chain emits both reveals in order
  const s6 = setupCustomCombat(77107, ENCOUNTERS.floor1[0]);
  const enemy6 = s6.combat.enemies[0];
  enemy6.hp = 60;
  const havoc6a = createCardInstance(s6, 'havoc', true);
  const havoc6b = createCardInstance(s6, 'havoc', false);
  const strike6 = createCardInstance(s6, 'strike', false);
  s6.combat.hand = [havoc6a];
  s6.combat.drawPile = [havoc6b, strike6];
  s6.combat.discardPile = [];

  const res6 = playCard(s6, havoc6a.instanceId);
  assert.equal(res6.ok, true);
  assert.equal(enemy6.hp, 54);
  assert.equal(res6.cardReveals.length, 2);
  assert.equal(res6.cardReveals[0].card.cardId, 'havoc');
  assert.equal(res6.cardReveals[1].card.cardId, 'strike');

  // 7. True Grit (unupgraded) random exhaust + All-Out Attack random discard + Dead Branch generation
  const s7 = setupCustomCombat(77108, ENCOUNTERS.floor1[0]);
  grantRelicToPlayer(s7, 'dead_branch');
  const tg = createCardInstance(s7, 'true_grit', false);
  const d1 = createCardInstance(s7, 'defend', false);
  s7.combat.hand = [tg, d1];
  s7.player.energy = 3;

  const res7 = playCard(s7, tg.instanceId);
  assert.equal(res7.ok, true);
  assert.ok(res7.cardReveals.some((r) => r.kind === 'random_exhaust' && r.card.cardId === 'defend'));
  assert.ok(res7.cardReveals.some((r) => r.kind === 'random_generate' && Boolean(r.card?.cardId)));
  assert.ok(
    s7.combat.logs.some((l) => l.message.includes('枯木树枝') && l.message.includes('生成了 【')),
    'Dead Branch log must include the exact generated card name'
  );

  const s8 = setupCustomCombat(77109, ENCOUNTERS.floor1[0]);
  const aoa = createCardInstance(s8, 'all_out_attack', false);
  const sCard = createCardInstance(s8, 'strike', false);
  s8.combat.hand = [aoa, sCard];
  s8.player.energy = 3;
  const res8 = playCard(s8, aoa.instanceId);
  assert.equal(res8.ok, true);
  assert.ok(res8.cardReveals.some((r) => r.kind === 'random_discard' && r.card.cardId === 'strike'));

  // 8. Elixir potion exhausting Status with Dead Branch also surfaces cardReveals
  const s9 = setupCustomCombat(77110, ENCOUNTERS.floor1[0]);
  grantRelicToPlayer(s9, 'dead_branch');
  s9.player.potions = ['elixir_potion', null, null];
  s9.combat.hand = [createCardInstance(s9, 'wound', false)];
  const res9 = usePotion(s9, 0);
  assert.equal(res9.ok, true);
  assert.ok(res9.cardReveals.some((r) => r.kind === 'random_generate' && Boolean(r.card?.cardId)));
});

test('Canonical Fatal (斩杀) keyword: Feed, Hand of Greed & Lesson Learned exclude Minions, revivable Darklings & Phase-1 Awakened One', () => {
  // 1. All 3 Fatal cards declare fatal: true
  for (const id of ['feed', 'hand_of_greed', 'lesson_learned']) {
    assert.equal(CARD_LIBRARY[id].base.fatal, true, `${id} base must have fatal: true`);
    assert.equal(CARD_LIBRARY[id].upgraded.fatal, true, `${id} upgraded must have fatal: true`);
  }

  // 2. Gremlin Leader encounter: killing Minion gremlin with Feed / Hand of Greed / Lesson Learned must NOT trigger Fatal!
  const glEnc = ENCOUNTERS.act2Elite.find((e) => e.id === 'gremlin_leader_elite');
  assert.ok(glEnc);

  const sMinion = createNewRun({ seed: 77201, characterId: 'ironclad', skipNeow: true });
  startCombat(sMinion, glEnc, 'elite');
  const gremlinMinion = sMinion.combat.enemies.find((e) => e.isMinion);
  const gremlinLeader = sMinion.combat.enemies.find((e) => e.templateId === 'gremlin_leader');
  assert.ok(gremlinMinion && gremlinLeader);

  gremlinMinion.hp = 5;
  gremlinMinion.block = 0;
  gremlinLeader.hp = 5;
  gremlinLeader.block = 0;

  const feedCard = createCardInstance(sMinion, 'feed', false);
  const hogCard = createCardInstance(sMinion, 'hand_of_greed', false);
  const llCard = createCardInstance(sMinion, 'lesson_learned', false);
  sMinion.combat.hand = [feedCard, hogCard, llCard];
  sMinion.player.energy = 10;

  // Preview on Minion must suppress Fatal bonuses and flag isFatalBlockedByMinion
  const feedMinionPrev = previewCardDamageOnEnemy(sMinion, feedCard, gremlinMinion);
  assert.equal(feedMinionPrev.isLethal, true);
  assert.equal(feedMinionPrev.maxHpOnKill, 0, 'Feed preview on Minion must NOT show +maxHp');
  assert.equal(feedMinionPrev.fatalEligible, false);
  assert.equal(feedMinionPrev.isFatalBlockedByMinion, true);

  const hogMinionPrev = previewCardDamageOnEnemy(sMinion, hogCard, gremlinMinion);
  assert.equal(hogMinionPrev.goldOnKill, 0, 'Hand of Greed preview on Minion must NOT show +gold');
  assert.equal(hogMinionPrev.isFatalBlockedByMinion, true);

  const llMinionPrev = previewCardDamageOnEnemy(sMinion, llCard, gremlinMinion);
  assert.equal(llMinionPrev.fatalPermanentUpgrade, false, 'Lesson Learned preview on Minion must NOT show +upgrade');
  assert.equal(llMinionPrev.isFatalBlockedByMinion, true);

  // Preview on non-Minion Gremlin Leader MUST show +3 maxHp
  const feedLeaderPrev = previewCardDamageOnEnemy(sMinion, feedCard, gremlinLeader);
  assert.equal(feedLeaderPrev.isLethal, true);
  assert.equal(feedLeaderPrev.maxHpOnKill, 3);
  assert.equal(feedLeaderPrev.fatalEligible, true);
  assert.equal(feedLeaderPrev.isFatalBlockedByMinion, false);

  // Kill Minion #1 with Feed -> maxHp unchanged + explicit log
  const maxHpBefore = sMinion.player.maxHp;
  assert.equal(playCard(sMinion, feedCard.instanceId, gremlinMinion.id).ok, true);
  assert.equal(sMinion.player.maxHp, maxHpBefore, 'Killing Minion with Feed must NOT increase maxHp');
  assert.ok(sMinion.combat.logs.some((l) => l.message.includes('爪牙单位不会触发【斩杀】')));

  // Kill Minion #2 with Hand of Greed -> gold unchanged!
  const gremlinMinion2 = sMinion.combat.enemies.find((e) => e.isMinion && e.hp > 0);
  assert.ok(gremlinMinion2);
  gremlinMinion2.hp = 5;
  gremlinMinion2.block = 0;
  const goldBefore = sMinion.player.gold;
  assert.equal(playCard(sMinion, hogCard.instanceId, gremlinMinion2.id).ok, true);
  assert.equal(sMinion.player.gold, goldBefore, 'Killing Minion with Hand of Greed must NOT grant gold');

  // Also test Lesson Learned on Bronze Orb / Torch Head / Dagger minions -> 0 deck upgrades
  const sOrb = createNewRun({ seed: 77202, characterId: 'watcher', skipNeow: true });
  startCombat(sOrb, ENCOUNTERS.act2Boss.find((e) => e.id === 'automaton_boss'), 'boss');
  endPlayerTurn(sOrb); // Automaton spawns 2 Bronze Orbs
  const orb = sOrb.combat.enemies.find((e) => e.templateId === 'bronze_orb');
  assert.ok(orb && orb.isMinion);
  orb.hp = 5;
  orb.block = 0;
  const llOrb = createCardInstance(sOrb, 'lesson_learned', false);
  sOrb.combat.hand = [llOrb];
  sOrb.player.energy = 3;
  const upgradedBefore = sOrb.player.deck.filter((c) => c.upgraded).length;
  assert.equal(playCard(sOrb, llOrb.instanceId, orb.id).ok, true);
  assert.equal(
    sOrb.player.deck.filter((c) => c.upgraded).length,
    upgradedBefore,
    'Killing Bronze Orb minion with Lesson Learned must NOT permanently upgrade deck'
  );

  // 3. Darklings (Life Link): killing 1st Darkling does NOT trigger Fatal; killing FINAL Darkling DOES trigger Fatal!
  const darkEnc = ENCOUNTERS.act3Early.find((e) => e.id === 'darkling_trio');
  const sDark = createNewRun({ seed: 77203, characterId: 'ironclad', skipNeow: true });
  startCombat(sDark, darkEnc, 'normal');
  const [dA, dB, dC] = sDark.combat.enemies;
  dA.hp = 5;
  dB.hp = 5;
  dC.hp = 5;
  const feedD1 = createCardInstance(sDark, 'feed', false);
  const hogD2 = createCardInstance(sDark, 'hand_of_greed', false);
  const llD3 = createCardInstance(sDark, 'lesson_learned', false);
  sDark.combat.hand = [feedD1, hogD2, llD3];
  sDark.player.energy = 10;

  // Non-final Darkling preview suppresses Fatal
  const prevNonFinal = previewCardDamageOnEnemy(sDark, feedD1, dA);
  assert.equal(prevNonFinal.fatalEligible, false);
  assert.equal(prevNonFinal.isFatalBlockedNonFinal, true);
  assert.equal(prevNonFinal.maxHpOnKill, 0);

  const darkMaxHpBefore = sDark.player.maxHp;
  assert.equal(playCard(sDark, feedD1.instanceId, dA.id).ok, true);
  assert.equal(sDark.player.maxHp, darkMaxHpBefore, 'Revivable Darkling #1 must NOT trigger Feed');
  assert.ok(dA.darklingRegrowTurns > 0);

  const darkGoldBefore = sDark.player.gold;
  assert.equal(playCard(sDark, hogD2.instanceId, dB.id).ok, true);
  assert.equal(sDark.player.gold, darkGoldBefore, 'Revivable Darkling #2 must NOT trigger Hand of Greed');

  // Final living Darkling preview ALLOWS Fatal & executing Lesson Learned upgrades a deck card + emits reveal!
  const prevFinal = previewCardDamageOnEnemy(sDark, llD3, dC);
  assert.equal(prevFinal.fatalEligible, true);
  assert.equal(prevFinal.fatalPermanentUpgrade, true);
  const darkUpgBefore = sDark.player.deck.filter((c) => c.upgraded).length;
  const resFinalDark = playCard(sDark, llD3.instanceId, dC.id);
  assert.equal(resFinalDark.ok, true);
  assert.equal(
    sDark.player.deck.filter((c) => c.upgraded).length,
    darkUpgBefore + 1,
    'Killing FINAL Darkling MUST trigger Fatal Lesson Learned permanent upgrade'
  );
  assert.ok(resFinalDark.cardReveals.some((r) => r.kind === 'random_upgrade'));

  // 4. Awakened One Phase 1 vs Phase 2
  const awkEnc = ENCOUNTERS.act3Boss.find((e) => e.id === 'awakened_one_boss');
  const sAwk = createNewRun({ seed: 77204, characterId: 'ironclad', skipNeow: true });
  startCombat(sAwk, awkEnc, 'boss');
  const awk = sAwk.combat.enemies[0];
  awk.hp = 5;
  awk.block = 0;
  const feedP1 = createCardInstance(sAwk, 'feed', false);
  sAwk.combat.hand = [feedP1];
  sAwk.player.energy = 3;

  const p1Prev = previewCardDamageOnEnemy(sAwk, feedP1, awk);
  assert.equal(p1Prev.fatalEligible, false);
  assert.equal(p1Prev.isFatalBlockedNonFinal, true);
  assert.equal(p1Prev.maxHpOnKill, 0);

  const awkMaxHpBefore = sAwk.player.maxHp;
  assert.equal(playCard(sAwk, feedP1.instanceId, awk.id).ok, true);
  assert.equal(awk.unawakened, false, 'Awakened One enters Phase 2');
  assert.equal(sAwk.player.maxHp, awkMaxHpBefore, 'Killing Awakened One Phase 1 must NOT trigger Feed');

  // Phase 2 Awakened One DOES trigger Feed!
  awk.hp = 5;
  awk.block = 0;
  const feedP2 = createCardInstance(sAwk, 'feed', false);
  sAwk.combat.hand = [feedP2];
  sAwk.player.energy = 3;
  assert.equal(previewCardDamageOnEnemy(sAwk, feedP2, awk).maxHpOnKill, 3);
  assert.equal(playCard(sAwk, feedP2.instanceId, awk.id).ok, true);
  assert.equal(sAwk.player.maxHp, awkMaxHpBefore + 3, 'Killing Awakened One Phase 2 MUST trigger Feed +3 maxHp');

  // 5. Act 1 Gremlin Pack (non-minion gremlins) DOES trigger Feed!
  const packEnc = ENCOUNTERS.hardNormal.find((e) => e.id === 'gremlin_pack');
  const sPack = createNewRun({ seed: 77205, characterId: 'ironclad', skipNeow: true });
  startCombat(sPack, packEnc, 'normal');
  const packGremlin = sPack.combat.enemies[0];
  assert.equal(packGremlin.isMinion, false);
  packGremlin.hp = 5;
  packGremlin.block = 0;
  const feedPack = createCardInstance(sPack, 'feed', false);
  sPack.combat.hand = [feedPack];
  sPack.player.energy = 3;
  const packMaxHpBefore = sPack.player.maxHp;
  assert.equal(playCard(sPack, feedPack.instanceId, packGremlin.id).ok, true);
  assert.equal(sPack.player.maxHp, packMaxHpBefore + 3, 'Non-minion Act 1 Gremlin Pack enemy MUST trigger Feed');

  // 6. Legacy save compatibility: reconcileCombatState backfills missing isMinion flags
  const sLegacy = createNewRun({ seed: 77206, characterId: 'ironclad', skipNeow: true });
  startCombat(sLegacy, glEnc, 'elite');
  for (const e of sLegacy.combat.enemies) {
    delete e.isMinion;
  }
  reconcileCombatState(sLegacy);
  const backfilledMinions = sLegacy.combat.enemies.filter((e) => e.templateId !== 'gremlin_leader');
  assert.ok(backfilledMinions.length >= 2);
  assert.ok(backfilledMinions.every((e) => e.isMinion === true), 'reconcileCombatState must backfill isMinion on Gremlin Leader minions');
});
