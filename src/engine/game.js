/**
 * Run orchestration engine facade — re-exports the complete public run/outpost API from:
 * - ./run/state_helpers.js   (keys, deck/gold, relic/card pools, shop builders, map queries)
 * - ./run/combat_flow.js     (node entry, combat victory transition, wired run* combat wrappers)
 * - ./run/outpost.js         (treasure, boss altar, act progression, rewards, campfire, shop)
 * - ./run/neow.js            (createNewRun, daily modifiers, Floor 0 Neow blessing)
 * - ./run/events_resolver.js (table-driven 35-event resolver & interactive deck pickers)
 */

export {
  STARTER_POTION_SLOTS,
  getStarterPotionSlotCount,
  ensureRunKeys,
  getCollectedKeyCount,
  hasAllAct4Keys,
  getActTotalFloors,
  playerHasHeavyAttackCard,
  addCardToMasterDeck,
  getCurrentPurgeCost,
  getCurrentBossEncounter,
  getCurrentBossName,
  formatRelicUpgradeSummary,
  grantRelicToPlayer,
  hasPendingNeowBlessing,
  findMapNode,
  getAvailableNodeIds,
  rollRewardCards,
  applyShopMembershipDiscount,
  discardPotion,
  getUpgradableDeckCards,
} from './run/state_helpers.js';

export {
  transitionCombatVictory,
  selectMapNode,
  runPlayCard,
  runDiscardHandCard,
  runResolveCardChoice,
  runTogglePendingCardChoice,
  runConfirmPendingCardChoice,
  runInitiateScry,
  runToggleScryCard,
  runConfirmScry,
  runUsePotion,
  runEndTurn,
  runRestartCombat,
  runReconcileCombat,
} from './run/combat_flow.js';

export {
  openTreasureChest,
  revealTreasureChest,
  claimTreasureRelic,
  claimTreasureSapphireKey,
  leaveTreasureRoom,
  claimBossRelic,
  claimBossRewardCard,
  proceedToNextAct,
  settleVictory,
  settleAct1Victory,
  claimRewardGold,
  claimRewardEmeraldKey,
  claimRewardRelic,
  claimRewardExtraRelic,
  claimRewardPotion,
  claimRewardCard,
  getUnclaimedImportantRewards,
  proceedFromReward,
  restHeal,
  restUpgradeCard,
  liftAtCampfire,
  digAtCampfire,
  tokeAtCampfire,
  recallRubyKey,
  leaveRestSite,
  buyShopCard,
  buyShopColorlessCard,
  buyShopRelic,
  buyShopExclusiveRelic,
  buyShopPotion,
  buyShopPurge,
  leaveShop,
} from './run/outpost.js';

export {
  generateNeowState,
  chooseNeowOption,
  completeNeowAction,
  skipNeowCardOffer,
  cancelNeowAction,
  createNewRun,
} from './run/neow.js';

export {
  chooseEventOption,
  completeEventPurge,
  cancelEventPurge,
  completeEventCardAction,
  pickEventLibraryCard,
  continueFromEvent,
} from './run/events_resolver.js';
