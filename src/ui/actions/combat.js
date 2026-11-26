/**
 * Combat screen click action handlers: card play, pending card choices,
 * scry/retain/discard overlays, enemy targeting, end turn, combat restart, and potions.
 */

import { POTION_LIBRARY } from '../../data/relics.js';
import { discardPotion, runRestartCombat } from '../../engine/game.js';

export const COMBAT_ACTIONS = {
  'restart-combat'(ctx) {
    const { ui, state, soundEngine } = ctx;
    const res = runRestartCombat(state);
    if (res.ok) {
      ui.modal = null;
      ctx.clearCombatSelection();
      soundEngine.play('ui_click');
      ctx.setNotice(
        `已重启本场战斗，恢复至第 1 回合初始状态（本局累计重启 ${res.combatRestarts ?? state.stats?.combatRestarts ?? 1} 次）。`
      );
    } else {
      ctx.setNotice(res.reason, 'warn');
    }
    ctx.render();
    if (res.ok && ctx.fxManager) {
      ctx.fxManager.spawnTurnTransitionFx(null, state, soundEngine);
    }
  },

  'click-hand-card'(ctx, target) {
    ctx.handleHandCardInteraction(target.dataset.instanceId);
  },

  'discard-hand-card'(ctx, target) {
    ctx.executeResolveCardChoiceWithFx(target.dataset.instanceId);
  },

  'resolve-card-choice'(ctx, target) {
    ctx.executeResolveCardChoiceWithFx(target.dataset.instanceId);
  },

  'toggle-scry-card'(ctx, target) {
    ctx.executeToggleScryWithFx(target.dataset.instanceId);
  },

  'confirm-scry-choice'(ctx) {
    ctx.executeConfirmScryWithFx();
  },

  'toggle-retain-card'(ctx, target) {
    ctx.executeTogglePendingChoiceWithFx(target.dataset.instanceId);
  },

  'toggle-discard-choice-card'(ctx, target) {
    ctx.executeTogglePendingChoiceWithFx(target.dataset.instanceId);
  },

  'confirm-retain-choice'(ctx) {
    ctx.executeConfirmPendingChoiceWithFx();
  },

  'confirm-discard-choice'(ctx) {
    ctx.executeConfirmPendingChoiceWithFx();
  },

  'click-enemy'(ctx, target) {
    ctx.handleEnemyClick(target.dataset.enemyId);
  },

  'end-turn'(ctx) {
    ctx.executeEndTurnWithFx();
  },

  'use-potion'(ctx, target) {
    const { ui, state, soundEngine } = ctx;
    const slot = Number(target.dataset.slot);
    const potionId = state.player.potions[slot];
    if (!POTION_LIBRARY[potionId]) return;

    if (ctx.isCompactHudViewport()) {
      if (ui.selectedPotionSlot === slot) {
        ui.selectedPotionSlot = null;
      } else {
        ui.activePotionPopoverSlot = ui.activePotionPopoverSlot === slot ? null : slot;
      }
      ui.hudMenuOpen = false;
      soundEngine.play('ui_click');
      ctx.render();
      return;
    }
    ctx.executePotionSlotAction(slot);
  },

  'confirm-use-potion'(ctx, target) {
    const { ui } = ctx;
    const slot = Number(target.dataset.slot);
    ui.activePotionPopoverSlot = null;
    ctx.executePotionSlotAction(slot);
  },

  'discard-potion'(ctx, target) {
    const { ui, state, soundEngine } = ctx;
    const slot = Number(target.dataset.slot);
    discardPotion(state, slot);
    ui.activePotionPopoverSlot = null;
    if (ui.selectedPotionSlot === slot) {
      ui.selectedPotionSlot = null;
    }
    soundEngine.play('ui_click');
    ctx.setNotice('已丢弃一瓶药水。');
    ctx.render();
  },
};
