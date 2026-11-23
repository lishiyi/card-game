/**
 * Unified UI click action registry combining menu, modal, combat, and outpost dispatchers.
 */

import { MENU_ACTIONS } from './menu.js';
import { MODAL_ACTIONS } from './modals.js';
import { COMBAT_ACTIONS } from './combat.js';
import { OUTPOST_ACTIONS } from './outpost.js';

export const ACTION_HANDLERS = Object.freeze({
  ...MENU_ACTIONS,
  ...MODAL_ACTIONS,
  ...COMBAT_ACTIONS,
  ...OUTPOST_ACTIONS,
});

export function dispatchUiAction(action, ctx, target) {
  const handler = ACTION_HANDLERS[action];
  if (!handler) return false;
  handler(ctx, target);
  return true;
}
