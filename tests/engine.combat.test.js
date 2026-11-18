import test from 'node:test';
import assert from 'node:assert/strict';

import {
  CARD_LIBRARY,
  createCardInstance,
  formatCardDescription,
  formatUpgradePreview,
  getCardStats,
} from '../src/data/cards.js';
import { ENCOUNTERS } from '../src/data/enemies.js';
import { POTION_LIBRARY, RELIC_LIBRARY, STATUS_METADATA } from '../src/data/relics.js';
import {
  applyStatus,
  endPlayerTurn,
  MAX_HAND_SIZE,
  playCard,
  restartCombat,
  startCombat,
  usePotion,
} from '../src/engine/combat.js';
import { createNewRun } from '../src/engine/game.js';
import {
  calculateAttackDamage,
  calculateCardBlock,
  getEnemyIntentPreview,
} from '../src/engine/math.js';

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
  assert.equal(guardian.hp, 123);
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

  // 3. Elite Lagavulin starts with Metallicize 5 & 5 Block, gains block on Turn 1, and Siphon Soul drains -1 Str / -1 Dex on Turn 4
  const lagaState = setupCustomCombat(838, {
    id: 'laga_test',
    name: '乐加维林测试',
    enemies: [{ templateId: 'lagavulin' }],
  });
  const laga = lagaState.combat.enemies[0];
  assert.equal(laga.statuses.metallicize, 5);
  assert.equal(laga.block, 5);
  assert.equal(laga.intent.id, 'shell_awaken');

  endPlayerTurn(lagaState); // Turn 1: shell_awaken (8) + metallicize (5) = 13 block; next intent claw_crush
  assert.equal(laga.block, 13);
  assert.equal(laga.intent.id, 'claw_crush');

  lagaState.player.block = 40;
  endPlayerTurn(lagaState); // Turn 2: claw_crush -> next intent claw_crush
  assert.equal(laga.intent.id, 'claw_crush');

  lagaState.player.block = 40;
  endPlayerTurn(lagaState); // Turn 3: claw_crush -> next intent siphon_soul
  assert.equal(laga.intent.id, 'siphon_soul');

  endPlayerTurn(lagaState); // Turn 4: siphon_soul applies -1 Strength & -1 Dexterity
  assert.equal(lagaState.player.statuses.strength, -1);
  assert.equal(lagaState.player.statuses.dexterity, -1);
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

test('restartCombat restores initial Turn 1 snapshot (HP, potions, piles, relics, enemy stats) and supports repeated restarts', () => {
  const state = createNewRun({ seed: 1337 });
  state.player.hp = 64;
  state.player.relics.push('anchor', 'vajra');
  startCombat(state, ENCOUNTERS.normal[1], 'normal'); // Slime duo (Acid + Spike Slime)

  const turn1Snapshot = JSON.stringify({
    rngState: state.rngState,
    nextUid: state.nextUid,
    player: state.player,
    combat: state.combat,
    stats: state.stats,
  });

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
  assert.equal(
    JSON.stringify({
      rngState: state.rngState,
      nextUid: state.nextUid,
      player: state.player,
      combat: state.combat,
      stats: state.stats,
    }),
    turn1Snapshot
  );

  // Play turn again and Restart #2 to verify snapshot wasn't mutated on Restart #1
  usePotion(state, 0, state.combat.enemies[1].id);
  endPlayerTurn(state);
  const res2 = restartCombat(state);
  assert.equal(res2.ok, true);
  assert.equal(
    JSON.stringify({
      rngState: state.rngState,
      nextUid: state.nextUid,
      player: state.player,
      combat: state.combat,
      stats: state.stats,
    }),
    turn1Snapshot
  );
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
  assert.equal(getCardStats(createCardInstance(state, 'strike', true)).costReduced, false);

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


