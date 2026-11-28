/**
 * Modal, compendium filter, audio/animation/mobile settings, tutorial/help,
 * HUD menu, deck sorting, and save backup click action handlers.
 */

import { normalizeEnabledCharacterId } from '../../data/characters.js';
import { getLocalDateKey } from '../../engine/daily.js';
import { exportSaveBackup } from '../../engine/meta.js';
import { saveSettings } from '../settings.js';

export const MODAL_ACTIONS = {
  'set-compendium-tab'(ctx, target) {
    const { ui, soundEngine } = ctx;
    const nextTab = target.dataset.tab;
    if (['cards', 'relics', 'potions', 'enemies'].includes(nextTab)) {
      ui.compendiumTab = nextTab;
      soundEngine.play('ui_click');
      ctx.render();
    }
  },

  'set-compendium-char'(ctx, target) {
    const { ui, soundEngine } = ctx;
    ui.compendiumCharFilter = target.dataset.charFilter || 'all';
    soundEngine.play('ui_click');
    ctx.render();
  },

  'set-compendium-tier'(ctx, target) {
    const { ui, soundEngine } = ctx;
    ui.compendiumRelicTier = target.dataset.tierFilter || 'all';
    soundEngine.play('ui_click');
    ctx.render();
  },

  'toggle-compendium-upgrade'(ctx) {
    const { ui, soundEngine } = ctx;
    ui.compendiumShowUpgraded = !ui.compendiumShowUpgraded;
    soundEngine.play('ui_click');
    ctx.render();
  },

  'set-history-char'(ctx, target) {
    const { ui, soundEngine } = ctx;
    ui.historyCharFilter = target.dataset.charFilter || 'all';
    soundEngine.play('ui_click');
    ctx.render();
  },

  'set-history-outcome'(ctx, target) {
    const { ui, soundEngine } = ctx;
    const next = target.dataset.outcomeFilter || 'all';
    if (next === 'all' || next === 'victory' || next === 'defeat') {
      ui.historyOutcomeFilter = next;
      soundEngine.play('ui_click');
      ctx.render();
    }
  },

  'set-card-stats-char'(ctx, target) {
    const { ui, soundEngine } = ctx;
    ui.cardStatsCharFilter = target.dataset.charFilter || 'all';
    soundEngine.play('ui_click');
    ctx.render();
  },

  'set-card-stats-sort'(ctx, target) {
    const { ui, soundEngine } = ctx;
    const next = target.dataset.sortBy || 'winRate';
    if (next === 'winRate' || next === 'runs' || next === 'upgradeRate') {
      ui.cardStatsSort = next;
      soundEngine.play('ui_click');
      ctx.render();
    }
  },

  'toggle-card-stats-starters'(ctx) {
    const { ui, soundEngine } = ctx;
    ui.cardStatsIncludeStarters = !ui.cardStatsIncludeStarters;
    soundEngine.play('ui_click');
    ctx.render();
  },

  'toggle-sound'(ctx) {
    const { settings, soundEngine } = ctx;
    settings.soundEnabled = !settings.soundEnabled;
    saveSettings(settings);
    if (settings.soundEnabled) soundEngine.play('test');
    if (!ctx.syncSettingsModalDom?.()) ctx.render();
  },

  'test-sound'(ctx) {
    ctx.soundEngine.play('test');
  },

  'set-anim-speed'(ctx, target) {
    const { settings, fxManager, soundEngine } = ctx;
    const speed = target.dataset.speed;
    if (speed === 'normal' || speed === 'fast' || speed === 'off') {
      settings.animSpeed = speed;
      saveSettings(settings);
      const synced = ctx.syncSettingsModalDom?.();
      fxManager.applyAnimSpeedAttr();
      soundEngine.play('ui_click');
      if (!synced) ctx.render();
    }
  },

  'toggle-damage-numbers'(ctx) {
    const { settings, soundEngine } = ctx;
    settings.showDamageNumbers = !settings.showDamageNumbers;
    saveSettings(settings);
    soundEngine.play('ui_click');
    if (!ctx.syncSettingsModalDom?.()) ctx.render();
  },

  'toggle-mobile-tap-confirm'(ctx) {
    const { settings, soundEngine } = ctx;
    settings.mobileTapConfirm = !settings.mobileTapConfirm;
    saveSettings(settings);
    ctx.clearCombatSelection();
    soundEngine.play('ui_click');
    if (!ctx.syncSettingsModalDom?.()) ctx.render();
  },

  'toggle-mobile-hand-layout'(ctx) {
    const { settings, soundEngine } = ctx;
    settings.mobileHandLayout = settings.mobileHandLayout === 'spread' ? 'fan' : 'spread';
    saveSettings(settings);
    ctx.clearCombatSelection();
    soundEngine.play('ui_click');
    if (!ctx.syncSettingsModalDom?.()) ctx.render();
  },

  'toggle-mobile-log'(ctx) {
    const { ui, soundEngine } = ctx;
    ui.mobileLogExpanded = !ui.mobileLogExpanded;
    soundEngine.play('ui_click');
    ctx.render();
  },

  'dismiss-tutorial'(ctx) {
    const { settings, soundEngine } = ctx;
    settings.tutorialDismissed = true;
    saveSettings(settings);
    soundEngine.play('ui_click');
    ctx.render();
  },

  'reset-tutorial'(ctx) {
    const { ui, settings, soundEngine } = ctx;
    settings.tutorialDismissed = false;
    settings.showMechanicTips = true;
    settings.seenMechanicTips = [];
    saveSettings(settings);
    soundEngine.play('ui_click');
    ui.modal = null;
    ctx.render();
  },

  'toggle-mechanic-tips'(ctx) {
    const { settings, soundEngine } = ctx;
    settings.showMechanicTips = settings.showMechanicTips === false;
    saveSettings(settings);
    soundEngine.play('ui_click');
    if (!ctx.syncSettingsModalDom?.()) ctx.render();
  },

  'toggle-expansion-characters'(ctx) {
    const { ui, meta, settings, soundEngine } = ctx;
    settings.enableExpansionCharacters = !settings.enableExpansionCharacters;
    saveSettings(settings);
    if (!settings.enableExpansionCharacters) {
      const safeChar = normalizeEnabledCharacterId(
        ui.selectedCharacterId || meta.selectedCharacterId,
        settings
      );
      ui.selectedCharacterId = safeChar;
      if (
        ui.compendiumCharFilter &&
        ui.compendiumCharFilter !== 'all' &&
        ui.compendiumCharFilter !== 'colorless' &&
        ui.compendiumCharFilter !== 'special' &&
        normalizeEnabledCharacterId(ui.compendiumCharFilter, settings) !== ui.compendiumCharFilter
      ) {
        ui.compendiumCharFilter = 'all';
      }
      if (
        ui.historyCharFilter &&
        ui.historyCharFilter !== 'all' &&
        normalizeEnabledCharacterId(ui.historyCharFilter, settings) !== ui.historyCharFilter
      ) {
        ui.historyCharFilter = 'all';
      }
      if (
        ui.cardStatsCharFilter &&
        ui.cardStatsCharFilter !== 'all' &&
        ui.cardStatsCharFilter !== 'colorless' &&
        normalizeEnabledCharacterId(ui.cardStatsCharFilter, settings) !== ui.cardStatsCharFilter
      ) {
        ui.cardStatsCharFilter = 'all';
      }
    }
    soundEngine.play('ui_click');
    if (!ctx.syncSettingsModalDom?.()) ctx.render();
  },

  'dismiss-mechanic-tip'(ctx, target) {
    const { settings, soundEngine } = ctx;
    const tipId = target.dataset.tipId;
    if (tipId) {
      if (!Array.isArray(settings.seenMechanicTips)) settings.seenMechanicTips = [];
      if (!settings.seenMechanicTips.includes(tipId)) {
        settings.seenMechanicTips.push(tipId);
      }
      saveSettings(settings);
    }
    soundEngine.play('ui_click');
    ctx.render();
  },

  'disable-mechanic-tips'(ctx) {
    const { settings, soundEngine } = ctx;
    settings.showMechanicTips = false;
    saveSettings(settings);
    soundEngine.play('ui_click');
    ctx.render();
  },

  'open-tip-glossary'(ctx, target) {
    const { ui, settings, soundEngine } = ctx;
    const tipId = target.dataset.tipId;
    if (tipId) {
      if (!Array.isArray(settings.seenMechanicTips)) settings.seenMechanicTips = [];
      if (!settings.seenMechanicTips.includes(tipId)) {
        settings.seenMechanicTips.push(tipId);
      }
      saveSettings(settings);
    }
    ui.helpTab = 'glossary';
    ui.glossaryCategory = 'all';
    ui.glossaryQuery = target.dataset.glossaryQuery || '';
    ui.modal = 'help';
    soundEngine.play('ui_click');
    ctx.render();
  },

  'open-help-tab'(ctx, target) {
    const { ui, soundEngine } = ctx;
    ui.helpTab = target.dataset.helpTab || 'tutorial';
    ui.modal = 'help';
    soundEngine.play('ui_click');
    ctx.render();
  },

  'switch-help-tab'(ctx, target) {
    const { ui, soundEngine } = ctx;
    ui.helpTab = target.dataset.helpTab || 'glossary';
    soundEngine.play('ui_click');
    ctx.render();
  },

  'set-glossary-cat'(ctx, target) {
    const { ui, soundEngine } = ctx;
    ui.glossaryCategory = target.dataset.category || 'all';
    soundEngine.play('ui_click');
    ctx.render();
  },

  'toggle-hud-menu'(ctx) {
    const { ui, soundEngine } = ctx;
    ui.hudMenuOpen = !ui.hudMenuOpen;
    ui.activePotionPopoverSlot = null;
    soundEngine.play('ui_click');
    ctx.render();
  },

  'close-potion-popover'(ctx) {
    const { ui, soundEngine } = ctx;
    ui.activePotionPopoverSlot = null;
    soundEngine.play('ui_click');
    ctx.render();
  },

  'open-modal'(ctx, target) {
    const { ui, soundEngine } = ctx;
    const nextModal = target.dataset.modal || null;
    if (nextModal === 'settings') {
      ui.backupFeedback = '';
    }
    ui.hudMenuOpen = false;
    ui.activePotionPopoverSlot = null;
    ui.modal = nextModal;
    soundEngine.play('ui_click');
    ctx.render();
  },

  'set-deck-sort'(ctx, target) {
    const { ui, soundEngine } = ctx;
    const nextSort = target.dataset.sort || 'order';
    if (['order', 'type', 'cost', 'rarity'].includes(nextSort)) {
      ui.deckSort = nextSort;
      soundEngine.play('ui_click');
      ctx.render();
    }
  },

  'toggle-deck-stack'(ctx) {
    const { ui, soundEngine } = ctx;
    ui.deckStack = ui.deckStack === false;
    soundEngine.play('ui_click');
    ctx.render();
  },

  'export-save-file'(ctx) {
    const { ui, meta, settings, state, soundEngine } = ctx;
    const jsonStr = exportSaveBackup({ meta, settings, activeRun: state });
    try {
      const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sts-lite-backup-${getLocalDateKey()}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      ui.backupFeedback = `✓ 已导出存档文件（sts-lite-backup-${getLocalDateKey()}.json）。`;
      ui.backupFeedbackTone = 'ok';
    } catch {
      ui.backupJsonDraft = jsonStr;
      ui.backupFeedback = '浏览器限制了自动下载，已将完整 JSON 填入下方文本框，可手动复制保存。';
      ui.backupFeedbackTone = 'warn';
    }
    soundEngine.play('upgrade');
    ctx.render();
  },

  'copy-save-json'(ctx) {
    const { ui, meta, settings, state, soundEngine } = ctx;
    const jsonStr = exportSaveBackup({ meta, settings, activeRun: state });
    ctx.writeTextToClipboard(jsonStr);
    ui.backupJsonDraft = jsonStr;
    ui.backupFeedback = '✓ 已复制完整存档 JSON 到剪贴板（下方文本框也已填入，可全选备份）。';
    ui.backupFeedbackTone = 'ok';
    soundEngine.play('ui_click');
    ctx.render();
  },

  'trigger-import-save-file'(ctx) {
    const fileInput = ctx.rootEl.querySelector('#input-import-save-file');
    if (fileInput instanceof HTMLInputElement) {
      fileInput.click();
    }
  },

  'import-save-json'(ctx) {
    const { ui, rootEl } = ctx;
    const ta = rootEl.querySelector('#input-import-save-json');
    const raw = ta instanceof HTMLTextAreaElement ? ta.value : ui.backupJsonDraft || '';
    ctx.applyImportedBackup(raw);
  },

  'close-modal'(ctx) {
    ctx.dismissActiveModal();
  },

  'close-modal-backdrop'(ctx) {
    ctx.dismissActiveModal();
  },
};
