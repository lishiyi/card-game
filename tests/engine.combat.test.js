import test from 'node:test';
import assert from 'node:assert/strict';

import {
  CARD_LIBRARY,
  createCardInstance,
  formatCardDescription,
  formatUpgradePreview,
  getCardStats,
  getEffectiveCardCost,
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
import { createNewRun, grantRelicToPlayer } from '../src/engine/game.js';
import {
  calculateAttackDamage,
  calculateCardBlock,
  getEnemyIntentPreview,
} from '../src/engine/math.js';
import {
  computeCardSynergies,
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
  assert.equal(Object.keys(RELIC_LIBRARY).length, 26);
  assert.equal(
    Object.values(RELIC_LIBRARY).filter((r) => r.tier === 'boss').length,
    8
  );
  assert.equal(Object.keys(POTION_LIBRARY).length, 10);
  assert.equal(Object.keys(CARD_LIBRARY).length, 46);
  assert.ok(STATUS_METADATA.confused, 'STATUS_METADATA must include confused for Snecko Eye');
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

  // True Grit+ smartly prefers exhausting Status/Curse cards in hand
  const trueGritPlus = createCardInstance(state, 'true_grit', true);
  const clumsy = createCardInstance(state, 'clumsy', false);
  state.combat.hand = [trueGritPlus, keepAtk, clumsy];
  playCard(state, trueGritPlus.instanceId);
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
  assert.ok(seventhRes.reason.includes('天鹅绒项圈'));

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





