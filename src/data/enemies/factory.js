import { hasDailyModifier } from '../../engine/daily.js';
import { randomInt } from '../../engine/rng.js';
import { ENEMY_TEMPLATES } from './templates.js';
import { rollEnemyIntent } from './ai.js';

export function createEnemyInstance(state, spec) {
  const tpl = ENEMY_TEMPLATES[spec.templateId];
  if (!tpl) {
    throw new Error(`Unknown enemy templateId: ${spec.templateId}`);
  }
  state.nextUid = (state.nextUid ?? 1) + 1;

  const asc = state?.ascension ?? 0;
  let maxHp =
    typeof spec.customHp === 'number'
      ? Math.max(1, Math.floor(spec.customHp))
      : randomInt(state, tpl.hpRange[0], tpl.hpRange[1]);

  if (!spec.skipHpScaling) {
    if (tpl.role === 'normal') {
      if (asc >= 9) maxHp = Math.round(maxHp * 1.09);
      else if (asc >= 2) maxHp = Math.round(maxHp * 1.07);
    } else if (tpl.role === 'elite' || tpl.role === 'boss') {
      if (asc >= 9) maxHp = Math.round(maxHp * 1.12);
      else if (asc >= 3) maxHp = Math.round(maxHp * 1.08);
    }
    if (hasDailyModifier(state, 'cursed_run')) {
      maxHp = Math.round(maxHp * 1.12);
    }
  }

  const statuses = { ...tpl.initialStatuses };
  if (asc >= 9) {
    if (tpl.id === 'lagavulin') statuses.metallicize = 6;
    if (tpl.id === 'the_guardian') statuses.modeShift = 28;
    if (tpl.id === 'red_louse' || tpl.id === 'green_louse') statuses.curlUp = 5;
    if (tpl.id === 'fungi_beast') statuses.sporeCloud = 3;
    if (tpl.id === 'mad_gremlin') statuses.angry = 2;
    if (tpl.id === 'byrd') statuses.flight = 4;
    if (tpl.id === 'orb_walker') statuses.ritual = 3;
    if (tpl.id === 'spiker') statuses.thorns = 4;
    if (tpl.id === 'shelled_parasite') statuses.platedArmor = 14;
    if (tpl.id === 'awakened_one') {
      statuses.curiosity = 2;
      statuses.regenerating = 7;
    }
    if (tpl.id === 'donu' || tpl.id === 'deca') {
      statuses.artifact = 3;
    }
    if (tpl.id === 'spire_shield' || tpl.id === 'spire_spear') {
      statuses.artifact = 2;
    }
    if (tpl.id === 'corrupt_heart') {
      statuses.invincible = 150;
      statuses.beatOfDeath = 2;
    }
  }

  if (spec.initialStatuses) {
    for (const [k, v] of Object.entries(spec.initialStatuses)) {
      statuses[k] = (statuses[k] ?? 0) + v;
    }
  }

  let initialBlock = statuses.metallicize ? statuses.metallicize : 0;
  if (typeof tpl.initialBlock === 'number' && tpl.initialBlock > 0) {
    initialBlock += tpl.initialBlock + (asc >= 9 ? (tpl.id === 'shelled_parasite' ? 4 : 6) : 0);
  }
  if (spec.hordeMode && tpl.id === 'jaw_worm') {
    // Canonical Act 3 Jaw Worm Horde: starts as if Bellow was already cast
    statuses.strength = (statuses.strength ?? 0) + (asc >= 9 ? 4 : 3);
    initialBlock += asc >= 9 ? 8 : 6;
  }
  if (typeof spec.customBlock === 'number' && spec.customBlock > 0) {
    initialBlock += Math.floor(spec.customBlock);
  }

  const enemy = {
    id: `enemy_${state.nextUid}`,
    templateId: tpl.id,
    name: spec.customName || tpl.name,
    role: spec.customRole || tpl.role,
    artKey: tpl.artKey,
    ascension: asc,
    hp: maxHp,
    maxHp,
    block: initialBlock,
    statuses,
    skipStatusTick: {},
    skipRitualThisTurn: false,
    turnIndex: 0,
    lastMoveId: null,
    variantIndex: spec.variantIndex ?? 0,
    mode: tpl.id === 'the_guardian' ? 'offensive' : 'normal',
    modeShiftMax: tpl.id === 'the_guardian' ? (asc >= 9 ? 28 : 25) : 0,
    malleableBase: tpl.malleableBase ?? 0,
    flightBase: tpl.id === 'byrd' ? (asc >= 9 ? 4 : 3) : 0,
    grounded: false,
    byrdGroundStep: 0,
    offensiveStep: 0,
    defensiveStep: 0,
    awakeTurnIndex: 0,
    multiStabUsed: 0,
    champPhase: 1,
    defensiveStanceCount: 0,
    champPhase2PendingAnger: false,
    champPhase2Step: 0,
    slowStacks: 0,
    unawakened: tpl.id === 'awakened_one',
    awakenedPhase: 1,
    pendingHaste: false,
    hasteUsed: false,
    darklingRegrowTurns: 0,
    implantUsed: false,
    entangleUsed: false,
    stasisUsed: false,
    stasisCard: null,
    invincibleMax: statuses.invincible ?? 0,
    heartBuffCount: 0,
    backAttack: false,
    hordeMode: Boolean(spec.hordeMode),
    tempStrengthRestore: 0,
    isMinion: Boolean(spec.isMinion || tpl.isMinion),
    intent: null,
  };

  enemy.intent = rollEnemyIntent(state, enemy);
  return enemy;
}
