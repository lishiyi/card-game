/**
 * Menu, character selection, seed/challenge sharing, daily challenge,
 * ascension selection, and run history inspection click action handlers.
 */

import { getCharacterDef, normalizeCharacterId } from '../../data/characters.js';
import {
  buildRunReportFromState,
  ensureCharacterProgress,
  getMaxAscensionForCharacter,
  MAX_ASCENSION,
  saveMeta,
  UNLOCK_TIERS,
} from '../../engine/meta.js';
import { formatSeedCode, parseSeedInput } from '../../engine/rng.js';

export const MENU_ACTIONS = {
  'select-character'(ctx, target) {
    const { ui, meta, soundEngine } = ctx;
    const nextChar = normalizeCharacterId(target.dataset.characterId);
    ui.selectedCharacterId = nextChar;
    meta.selectedCharacterId = nextChar;
    const maxForChar = getMaxAscensionForCharacter(meta, nextChar);
    if ((meta.selectedAscension ?? 0) > maxForChar) {
      meta.selectedAscension = maxForChar;
    }
    saveMeta(meta);
    soundEngine.play('ui_click');
    ctx.render();
  },

  'open-menu-view'(ctx, target) {
    const { ui, soundEngine } = ctx;
    const nextView = target.dataset.menuView || 'home';
    if (['home', 'standard', 'daily'].includes(nextView)) {
      ui.menuView = nextView;
      if (nextView === 'home') {
        ui.seedDrawerOpen = false;
      }
      soundEngine.play('ui_click');
      ctx.setNotice('');
      ctx.render();
    }
  },

  'toggle-seed-drawer'(ctx) {
    const { ui, rootEl, soundEngine } = ctx;
    ui.seedDrawerOpen = !ui.seedDrawerOpen;
    soundEngine.play('ui_click');
    ctx.render();
    if (ui.seedDrawerOpen && !ctx.isCoarseTouchDevice()) {
      rootEl.querySelector('#char-seed-input')?.focus();
    }
  },

  'start-character-run'(ctx) {
    ctx.startCharacterSelectRun();
  },

  'resume-active-run'(ctx) {
    const { ui, state, soundEngine } = ctx;
    if (state && state.screen !== 'game_over') {
      ui.showCharacterSelect = false;
      ui.menuView = 'home';
      ui.seedDrawerOpen = false;
      ui.modal = null;
      soundEngine.play('ui_click');
      ctx.setNotice('');
      ctx.render();
    }
  },

  'new-run'(ctx, target) {
    const { ui, meta, state, soundEngine } = ctx;
    ui.hudMenuOpen = false;
    ui.activePotionPopoverSlot = null;
    if (state && state.screen !== 'game_over' && target.id !== 'btn-restart-gameover') {
      ui.modal = 'confirm_new_run';
      soundEngine.play('ui_click');
      ctx.render();
      return;
    }
    ui.selectedCharacterId = state?.characterId || meta.selectedCharacterId || 'ironclad';
    ui.showCharacterSelect = true;
    ui.menuView = 'home';
    ui.seedDrawerOpen = false;
    ui.modal = null;
    ui.seedInput = '';
    ctx.clearCombatSelection();
    soundEngine.play('ui_click');
    ctx.setNotice('');
    ctx.render();
  },

  'confirm-new-run'(ctx) {
    const { ui, meta, state, soundEngine } = ctx;
    ui.selectedCharacterId = state?.characterId || meta.selectedCharacterId || 'ironclad';
    ui.showCharacterSelect = true;
    ui.menuView = 'home';
    ui.seedDrawerOpen = false;
    ui.modal = null;
    ui.seedInput = '';
    ctx.clearCombatSelection();
    soundEngine.play('ui_click');
    ctx.setNotice('');
    ctx.render();
  },

  'start-ascension-run'(ctx) {
    const { ui, meta, state, soundEngine } = ctx;
    const activeChar = state?.characterId || ui.selectedCharacterId || meta.selectedCharacterId;
    ctx.launchRunForCharacter(activeChar);
    soundEngine.play('ui_click');
    ctx.setNotice('');
    ctx.render();
  },

  'accept-challenge'(ctx) {
    const { ui } = ctx;
    if (ui.pendingChallenge) {
      ctx.startChallengeRun(ui.pendingChallenge);
    } else {
      ui.modal = null;
      ctx.render();
    }
  },

  'decline-challenge'(ctx) {
    const { ui, soundEngine } = ctx;
    ui.pendingChallenge = null;
    ui.modal = null;
    soundEngine.play('ui_click');
    ctx.setNotice('已保留你当前的尖塔进度。');
    ctx.render();
  },

  'start-seeded-run'(ctx) {
    ctx.startSeededRunFromInput('#seed-input-box');
  },

  'replay-history-seed'(ctx, target) {
    const { meta, soundEngine } = ctx;
    const seedVal = parseSeedInput(target.dataset.seed);
    const reqChar = normalizeCharacterId(target.dataset.characterId || ctx.state?.characterId);
    const maxAllowed = getMaxAscensionForCharacter(meta, reqChar);
    const reqAsc = Number(target.dataset.ascension ?? 0);
    const safeAsc = Number.isFinite(reqAsc)
      ? Math.max(0, Math.min(maxAllowed, Math.floor(reqAsc)))
      : 0;
    meta.selectedAscension = safeAsc;
    saveMeta(meta);
    ctx.launchRunForCharacter(reqChar, {
      seed: seedVal ?? undefined,
      ascension: safeAsc,
    });
    soundEngine.play('upgrade');
    ctx.setNotice(`已按种子【${getCharacterDef(reqChar).name} · ${formatSeedCode(ctx.state.seed)}】开启同图挑战！`);
    ctx.render();
  },

  'start-daily-challenge'(ctx, target) {
    ctx.startDailyChallengeRun(target.dataset.dailyDate || '');
  },

  'copy-seed'(ctx, target) {
    ctx.copySeedToClipboard(
      target.dataset.seedCode,
      target.dataset.ascension,
      target.dataset.characterId,
      target.dataset.dailyDate || ''
    );
  },

  'copy-battle-report'(ctx) {
    const rec = ctx.ensureRunRecorded()?.historyEntry || (ctx.state ? buildRunReportFromState(ctx.state) : null);
    ctx.copyBattleReportToClipboard(rec);
  },

  'copy-history-report'(ctx, target) {
    const { meta } = ctx;
    const idx = Number(target.dataset.historyIdx);
    const rec = Array.isArray(meta.runHistory) ? meta.runHistory[idx] : null;
    if (rec) {
      ctx.copyBattleReportToClipboard(rec);
    }
  },

  'inspect-history-run'(ctx, target) {
    const { ui, meta, soundEngine } = ctx;
    const idx = Number(target.dataset.historyIdx);
    if (Array.isArray(meta.runHistory) && meta.runHistory[idx]) {
      ui.inspectedHistoryIdx = idx;
      ui.modal = 'history_detail';
      soundEngine.play('ui_click');
      ctx.render();
    }
  },

  'select-ascension'(ctx, target) {
    const { ui, meta, state, rootEl, soundEngine } = ctx;
    const lvl = Number(target.dataset.ascension);
    const activeChar = ui.showCharacterSelect
      ? ui.selectedCharacterId || meta.selectedCharacterId
      : state?.characterId || ui.selectedCharacterId || meta.selectedCharacterId;
    const maxAllowed = getMaxAscensionForCharacter(meta, activeChar);
    const isCharAscPill = target.classList.contains('char-asc-pill');
    if (Number.isInteger(lvl) && lvl >= 0 && lvl <= maxAllowed) {
      const prevAsc = Math.min(maxAllowed, meta.selectedAscension ?? 0);
      if (isCharAscPill && lvl === prevAsc) {
        if (ctx.isTooltipPinnedTo(target)) {
          ctx.hideTooltip();
        } else {
          ctx.showTooltip(target, { pinned: true });
        }
        return;
      }
      meta.selectedAscension = lvl;
      saveMeta(meta);
      soundEngine.play('ui_click');
      ctx.render();
      if (isCharAscPill) {
        const refreshedBtn = rootEl.querySelector(`#btn-char-asc-${lvl}`);
        if (refreshedBtn) {
          ctx.showTooltip(refreshedBtn, { pinned: ctx.isCoarseTouchDevice() });
        }
      }
    }
  },

  'toggle-unlock-all'(ctx) {
    const { ui, meta, soundEngine } = ctx;
    if (!ui.debugMode) return;
    meta.unlockAllOverride = true;
    meta.unlockedTier = UNLOCK_TIERS.length;
    meta.maxAscensionUnlocked = MAX_ASCENSION;
    const progMap = ensureCharacterProgress(meta);
    for (const entry of Object.values(progMap)) {
      entry.maxAscensionUnlocked = MAX_ASCENSION;
    }
    saveMeta(meta);
    soundEngine.play('upgrade');
    ctx.render();
  },
};
