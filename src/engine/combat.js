/**
 * Combat engine facade — re-exports the complete public combat API from modular submodules:
 * - ./combat/state.js      (constants, logging, statuses, enemy zero-HP/minions, choice state)
 * - ./combat/resolution.js (damage, block, poison, draw/discard/exhaust, stances, scry)
 * - ./combat/turn_flow.js  (startCombat, startPlayerTurn, restartCombat, endPlayerTurn)
 * - ./combat/card_play.js  (canPlayCard, playCard, usePotion)
 */

export {
  MAX_HAND_SIZE,
  BASE_DRAW_PER_TURN,
  VELVET_CHOKER_CARD_LIMIT,
  RUSHDOWN_MAX_TRIGGERS_PER_TURN,
  hasRelic,
  getAliveEnemies,
  pushCombatLog,
  applyStatus,
  decayRoundStatuses,
  addCardsToHand,
  reconcileCombatState,
  hasPendingCardChoice,
  getActivePendingCardChoice,
  toggleScryChoice,
  togglePendingCardChoice,
} from './combat/state.js';

export {
  applyPoisonToEnemy,
  drawCards,
  dealDamageToEnemy,
  dealDamageToPlayer,
  losePlayerHp,
  discardCardsBatch,
  changeStance,
  gainMantra,
  initiateScry,
  confirmScryChoice,
  resolveCardChoice,
  discardHandCard,
  exhaustCardsBatch,
} from './combat/resolution.js';

export {
  confirmPendingCardChoice,
  startPlayerTurn,
  startCombat,
  restartCombat,
  endPlayerTurn,
} from './combat/turn_flow.js';

export {
  canPlayCard,
  playCard,
  usePotion,
} from './combat/card_play.js';

export {
  MAX_ORB_SLOTS,
  ORB_TYPES,
  ensureOrbState,
  getOrbOutputValues,
  countUniqueOrbs,
  applyLockOnMultiplier,
  findLowestHpAliveEnemy,
  gainOrbSlots,
  removeOrbSlots,
  channelOrb,
  triggerOrbPassive,
  evokeFrontOrb,
  evokeAllOrbs,
  removeAllOrbs,
  triggerAllDarkPassives,
  triggerStartOfTurnOrbs,
  triggerEndOfTurnOrbs,
} from './combat/orbs.js';
