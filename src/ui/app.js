/**
 * Main UI controller orchestrating modular screens, non-blocking FX, Web Audio SFX,
 * hover + touch tooltips, settings, seed sharing, and keyboard shortcuts.
 */

import { formatCardDescription, getCardStats } from '../data/cards.js';
import { getCharacterDef, normalizeCharacterId } from '../data/characters.js';
import { TOTAL_FLOORS } from '../data/events.js';
import { POTION_LIBRARY } from '../data/relics.js';
import { canPlayCard, getAliveEnemies } from '../engine/combat.js';
import { getDailyChallengeSpec, getLocalDateKey } from '../engine/daily.js';
import {
  buyShopCard,
  buyShopColorlessCard,
  buyShopPotion,
  buyShopPurge,
  buyShopRelic,
  cancelEventPurge,
  cancelNeowAction,
  chooseEventOption,
  chooseNeowOption,
  claimBossRelic,
  claimBossRewardCard,
  claimRewardCard,
  claimRewardGold,
  claimRewardPotion,
  claimRewardRelic,
  completeEventCardAction,
  completeEventPurge,
  completeNeowAction,
  continueFromEvent,
  createNewRun,
  discardPotion,
  hasPendingNeowBlessing,
  leaveRestSite,
  leaveShop,
  leaveTreasureRoom,
  openTreasureChest,
  pickEventLibraryCard,
  proceedFromReward,
  proceedToNextAct,
  restHeal,
  restUpgradeCard,
  runDiscardHandCard,
  runEndTurn,
  runPlayCard,
  runRestartCombat,
  runUsePotion,
  selectMapNode,
  settleAct1Victory,
  skipNeowCardOffer,
  STARTER_POTION_SLOTS,
} from '../engine/game.js';
import {
  buildRunReportFromState,
  formatShareableBattleReport,
  getRunRecordKey,
  loadSavedMeta,
  MAX_ASCENSION,
  recordCompletedRun,
  saveMeta,
  UNLOCK_TIERS,
} from '../engine/meta.js';
import {
  buildChallengeUrl,
  buildDailyChallengeUrl,
  formatSeedCode,
  parseChallengeInput,
  parseSeedInput,
} from '../engine/rng.js';
import { createSoundEngine } from './audio.js';
import {
  applyCombatTacticsUI,
  clearCombatTacticsUI,
  createCombatDragController,
} from './combat_interact.js';
import { createFxManager } from './fx.js';
import { escapeHtml } from './helpers.js';
import {
  renderCharacterSelectHeader,
  renderCharacterSelectScreen,
} from './screens/character_select.js';
import { renderCombatScreen } from './screens/combat.js';
import { renderEventScreen } from './screens/event.js';
import { renderTopHud } from './screens/hud.js';
import { renderMapScreen } from './screens/map.js';
import { renderGlossaryItemsHtml, renderModal } from './screens/modals.js';
import {
  renderBossRewardScreen,
  renderGameOverScreen,
  renderRestScreen,
  renderRewardScreen,
  renderShopScreen,
  renderTreasureScreen,
} from './screens/outpost.js';
import { loadSettings, saveSettings } from './settings.js';

const STORAGE_KEY = 'sts_lite_saved_run_v2';

function loadSavedRun() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed === 'object' &&
      parsed.player &&
      Array.isArray(parsed.player.deck) &&
      Array.isArray(parsed.map) &&
      parsed.map.length === TOTAL_FLOORS &&
      typeof parsed.screen === 'string'
    ) {
      const charId = normalizeCharacterId(parsed.characterId);
      const charDef = getCharacterDef(charId);
      parsed.characterId = charId;
      if (!parsed.player.artKey) {
        parsed.player.artKey = charDef.artKey;
      }
      if (!Array.isArray(parsed.player.potions)) {
        parsed.player.potions = [charDef.starterPotion, null, null];
      } else {
        while (parsed.player.potions.length < STARTER_POTION_SLOTS) {
          parsed.player.potions.push(null);
        }
      }
      if (!Array.isArray(parsed.visitedEdges)) {
        parsed.visitedEdges = [];
      }
      return parsed;
    }
  } catch {
    // Ignore storage access or parse errors
  }
  return null;
}

function persistRun(state) {
  if (!state) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage quota errors
  }
}

function readIncomingChallengeFromLocation() {
  try {
    const search = window.location?.search || '';
    if (!search || (!search.includes('seed=') && !search.includes('daily='))) return null;
    const parsed = parseChallengeInput(search, MAX_ASCENSION);
    if (!parsed || !parsed.isUrlLike) return null;
    if (parsed.isDaily && parsed.dailyDateKey) {
      const spec = getDailyChallengeSpec(parsed.dailyDateKey);
      return {
        seed: spec.seed,
        seedCode: spec.seedCode,
        ascension: 0,
        characterId: spec.characterId,
        isDaily: true,
        dailyDateKey: spec.dateKey,
      };
    }
    return {
      seed: parsed.seed,
      seedCode: parsed.seedCode,
      ascension: parsed.ascension ?? 0,
      characterId: normalizeCharacterId(parsed.characterId),
      isDaily: false,
      dailyDateKey: null,
    };
  } catch {
    return null;
  }
}

function clearChallengeQueryFromLocation() {
  try {
    if (window.history?.replaceState && window.location?.search) {
      const cleanUrl = `${window.location.pathname}${window.location.hash || ''}`;
      window.history.replaceState(null, '', cleanUrl);
    }
  } catch {
    // Ignore history API restrictions in sandboxed/file contexts
  }
}

export function mountSpireApp(rootEl) {
  let meta = loadSavedMeta();
  let settings = loadSettings();

  function buildNewRunOptions(overrides = {}) {
    return {
      characterId: normalizeCharacterId(overrides.characterId ?? meta.selectedCharacterId),
      ascension: overrides.ascension ?? meta.selectedAscension ?? 0,
      unlockedTier: meta.unlockedTier ?? 0,
      unlockAllOverride: Boolean(meta.unlockAllOverride),
      ...overrides,
    };
  }

  const incomingChallenge = readIncomingChallengeFromLocation();
  if (incomingChallenge) {
    clearChallengeQueryFromLocation();
  }

  const savedRun = loadSavedRun();
  const hasActiveSave = Boolean(savedRun && savedRun.screen !== 'game_over');
  let initialModal = null;
  let initialPendingChallenge = null;
  let initialNotice = '';
  let initialShowCharacterSelect = false;
  let state = null;

  if (incomingChallenge && !hasActiveSave) {
    if (incomingChallenge.isDaily && incomingChallenge.dailyDateKey) {
      const spec = getDailyChallengeSpec(incomingChallenge.dailyDateKey);
      state = createNewRun(buildNewRunOptions({ dailyDateKey: spec.dateKey }));
      const modNames = spec.modifiers.map((m) => m.name).join(' · ');
      initialNotice = `已通过直连进入每日挑战【${spec.dateKey} · ${spec.characterName}】（词条：${modNames}）！`;
    } else {
      const chChar = normalizeCharacterId(incomingChallenge.characterId);
      const chCharDef = getCharacterDef(chChar);
      state = createNewRun(
        buildNewRunOptions({
          characterId: chChar,
          seed: incomingChallenge.seed,
          ascension: incomingChallenge.ascension,
          unlockAllOverride: true,
          isChallengeRun: true,
        })
      );
      initialNotice = `已通过挑战链接开启同图对局【${chCharDef.name} · ${incomingChallenge.seedCode} · 进阶 ${incomingChallenge.ascension}】（全图鉴临时对齐，不影响生涯解锁）！`;
    }
  } else if (hasActiveSave) {
    state = savedRun;
    if (incomingChallenge) {
      initialPendingChallenge = incomingChallenge;
      initialModal = 'confirm_challenge';
    } else if (
      state.screen === 'map' &&
      hasPendingNeowBlessing(state) &&
      state.neowState?.pendingAction
    ) {
      initialModal = 'neow_action';
    }
  } else {
    state = null;
    initialShowCharacterSelect = true;
  }

  let lastGameOverSummary = null;

  rootEl.innerHTML = '';
  const stageRoot = document.createElement('div');

  const fxLayerEl = document.createElement('div');
  fxLayerEl.id = 'spire-fx-layer';
  fxLayerEl.className = 'spire-fx-layer';
  fxLayerEl.setAttribute('aria-hidden', 'true');

  const dragLayerEl = document.createElement('div');
  dragLayerEl.id = 'spire-drag-layer';
  dragLayerEl.className = 'spire-drag-layer';
  dragLayerEl.setAttribute('aria-hidden', 'true');

  const tooltipEl = document.createElement('div');
  tooltipEl.id = 'spire-tooltip';
  tooltipEl.className = 'spire-tooltip';
  tooltipEl.setAttribute('role', 'tooltip');
  tooltipEl.hidden = true;

  rootEl.append(stageRoot, fxLayerEl, dragLayerEl, tooltipEl);

  const soundEngine = createSoundEngine(() => settings);
  const fxManager = createFxManager(rootEl, fxLayerEl, () => settings);
  fxManager.applyAnimSpeedAttr();

  let activeTooltipAnchor = null;

  function hideTooltip() {
    activeTooltipAnchor = null;
    tooltipEl.hidden = true;
  }

  function positionTooltip(anchorEl) {
    if (!anchorEl || tooltipEl.hidden) return;
    const rect = anchorEl.getBoundingClientRect();
    const tipRect = tooltipEl.getBoundingClientRect();
    const margin = 10;

    let left = rect.left + rect.width / 2 - tipRect.width / 2;
    left = Math.max(margin, Math.min(window.innerWidth - tipRect.width - margin, left));

    let top = rect.bottom + 8;
    if (
      top + tipRect.height > window.innerHeight - margin &&
      rect.top - tipRect.height - 8 >= margin
    ) {
      top = rect.top - tipRect.height - 8;
    }
    top = Math.max(margin, Math.min(window.innerHeight - tipRect.height - margin, top));

    tooltipEl.style.left = `${Math.round(left)}px`;
    tooltipEl.style.top = `${Math.round(top)}px`;
  }

  function showTooltip(anchorEl) {
    if (!anchorEl) {
      hideTooltip();
      return;
    }
    if (activeTooltipAnchor === anchorEl && !tooltipEl.hidden) {
      return;
    }
    const title = anchorEl.dataset.tooltipTitle || '';
    const tag = anchorEl.dataset.tooltipTag || '';
    const desc = anchorEl.dataset.tooltipDesc || '';
    const tone = anchorEl.dataset.tooltipTone || '';
    if (!desc) {
      hideTooltip();
      return;
    }

    activeTooltipAnchor = anchorEl;
    tooltipEl.innerHTML = `
      <div class="spire-tooltip-head">
        <span class="spire-tooltip-title ${tone ? `tone-${escapeHtml(tone)}` : ''}">${escapeHtml(title)}</span>
        ${tag ? `<span class="spire-tooltip-tag">${escapeHtml(tag)}</span>` : ''}
      </div>
      <p class="spire-tooltip-desc">${escapeHtml(desc)}</p>
    `;
    tooltipEl.hidden = false;
    positionTooltip(anchorEl);
  }

  const ui = {
    showCharacterSelect: initialShowCharacterSelect,
    selectedCharacterId: state?.characterId || meta.selectedCharacterId || 'ironclad',
    selectedCardId: null,
    selectedPotionSlot: null,
    hoveredCardId: null,
    hoveredPotionSlot: null,
    hoveredEnemyId: null,
    modal: initialModal,
    pendingChallenge: initialPendingChallenge,
    inspectedHistoryIdx: null,
    mobileLogExpanded: false,
    lastCopiedReport: '',
    helpTab: 'glossary',
    glossaryCategory: 'all',
    glossaryQuery: '',
    seedInput: '',
    notice: initialNotice,
    noticeTone: 'normal',
  };

  let lastRenderedScreen = null;
  let lastRenderedModal = null;

  function clearCombatSelection() {
    ui.selectedCardId = null;
    ui.selectedPotionSlot = null;
    ui.hoveredCardId = null;
    ui.hoveredPotionSlot = null;
    ui.hoveredEnemyId = null;
  }

  function setNotice(msg, tone = 'normal') {
    ui.notice = msg || '';
    ui.noticeTone = tone;
  }

  function ensureRunRecorded() {
    if (!state) return null;
    const currentRunKey = getRunRecordKey(state);
    if (!lastGameOverSummary || lastGameOverSummary.runKey !== currentRunKey) {
      const rec = recordCompletedRun(meta, state);
      saveMeta(meta);
      lastGameOverSummary = { runKey: currentRunKey, ...rec };
    }
    return lastGameOverSummary;
  }

  function sanitizeUiState() {
    if (
      ui.modal === 'map' &&
      (!state || ui.showCharacterSelect || state.screen === 'map' || state.screen === 'game_over')
    ) {
      ui.modal = null;
    }
    if (!state || ui.showCharacterSelect || state.screen !== 'combat' || !state.combat) {
      clearCombatSelection();
      return;
    }
    if (ui.selectedCardId && !state.combat.hand.some((c) => c.instanceId === ui.selectedCardId)) {
      ui.selectedCardId = null;
    }
    if (ui.hoveredCardId && !state.combat.hand.some((c) => c.instanceId === ui.hoveredCardId)) {
      ui.hoveredCardId = null;
    }
    if (ui.selectedPotionSlot !== null && !state.player.potions[ui.selectedPotionSlot]) {
      ui.selectedPotionSlot = null;
    }
    if (ui.hoveredPotionSlot !== null && !state.player.potions[ui.hoveredPotionSlot]) {
      ui.hoveredPotionSlot = null;
    }
    if (
      ui.hoveredEnemyId &&
      !state.combat.enemies.some((e) => e.id === ui.hoveredEnemyId && e.hp > 0)
    ) {
      ui.hoveredEnemyId = null;
    }
  }

  function getPreviewTargetEnemy() {
    if (!state || ui.showCharacterSelect || state.screen !== 'combat' || !state.combat) return null;
    const alive = getAliveEnemies(state.combat);
    if (ui.hoveredEnemyId) {
      const hovered = alive.find((e) => e.id === ui.hoveredEnemyId);
      if (hovered) return hovered;
    }
    if (alive.length === 1) return alive[0];
    return null;
  }

  function syncCombatTactics(override = null) {
    if (!state || ui.showCharacterSelect || state.screen !== 'combat' || !state.combat || ui.modal) {
      clearCombatTacticsUI(rootEl);
      return;
    }
    const activeCardId =
      override?.activeCardId !== undefined
        ? override.activeCardId
        : ui.selectedCardId || (ui.selectedPotionSlot === null ? ui.hoveredCardId : null);
    const activePotionSlot =
      override?.activePotionSlot !== undefined
        ? override.activePotionSlot
        : activeCardId
          ? null
          : ui.selectedPotionSlot !== null
            ? ui.selectedPotionSlot
            : ui.hoveredPotionSlot;
    const hoveredEnemyId =
      override?.hoveredEnemyId !== undefined ? override.hoveredEnemyId : ui.hoveredEnemyId;

    applyCombatTacticsUI(rootEl, state, {
      activeCardId,
      activePotionSlot,
      hoveredEnemyId,
    });
  }

  function render() {
    hideTooltip();
    sanitizeUiState();
    fxManager.applyAnimSpeedAttr();
    const prevModal = lastRenderedModal;
    lastRenderedModal = ui.modal;

    if (ui.showCharacterSelect || !state) {
      const prevScreen = lastRenderedScreen;
      lastRenderedScreen = 'character_select';
      fxLayerEl.innerHTML = '';
      const hasActiveRun = Boolean(state && state.screen !== 'game_over');
      const previewCharId = normalizeCharacterId(ui.selectedCharacterId || meta.selectedCharacterId);
      stageRoot.innerHTML = `
        <div class="spire-shell" data-character="${escapeHtml(previewCharId)}">
          ${renderCharacterSelectHeader({ hasActiveRun })}
          <main class="stage-viewport">
            ${renderCharacterSelectScreen({ meta, ui, hasActiveRun })}
          </main>
        </div>
        ${renderModal({ state, meta, settings, ui })}
      `;
      clearCombatTacticsUI(rootEl);
      if (prevScreen && prevScreen !== 'character_select' && typeof window.scrollTo === 'function') {
        window.scrollTo(0, 0);
      }
      return;
    }

    persistRun(state);
    const prevScreen = lastRenderedScreen;
    lastRenderedScreen = state.screen;
    if (state.screen !== 'combat') {
      fxLayerEl.innerHTML = '';
    }

    let mainHtml = '';
    switch (state.screen) {
      case 'map':
        mainHtml = renderMapScreen({ state, settings, ui });
        break;
      case 'combat':
        mainHtml = renderCombatScreen({ state, ui, settings, getPreviewTargetEnemy });
        break;
      case 'reward':
        mainHtml = renderRewardScreen({ state, ui });
        break;
      case 'boss_reward':
        mainHtml = renderBossRewardScreen({ state, ui });
        break;
      case 'treasure':
        mainHtml = renderTreasureScreen({ state });
        break;
      case 'rest':
        mainHtml = renderRestScreen({ state });
        break;
      case 'shop':
        mainHtml = renderShopScreen({ state, ui });
        break;
      case 'event':
        mainHtml = renderEventScreen({ state, ui });
        break;
      case 'game_over':
        mainHtml = renderGameOverScreen({ state, ui, ensureRunRecorded });
        break;
      default:
        mainHtml = renderMapScreen({ state, settings, ui });
    }

    const shellCharId = normalizeCharacterId(state.characterId);
    stageRoot.innerHTML = `
      <div class="spire-shell" data-character="${escapeHtml(shellCharId)}">
        ${renderTopHud({ state, ui })}
        <main class="stage-viewport">
          ${mainHtml}
        </main>
      </div>
      ${renderModal({ state, meta, settings, ui })}
    `;

    if (ui.modal === 'map' && prevModal !== 'map' && state.currentNodeId) {
      const modalNodeEl = rootEl.querySelector(`#map-modal-node-${CSS.escape(state.currentNodeId)}`);
      if (modalNodeEl && typeof modalNodeEl.scrollIntoView === 'function') {
        modalNodeEl.scrollIntoView({ block: 'center', behavior: 'auto' });
      }
    }

    if (state.screen === 'combat') {
      syncCombatTactics();
      if (prevScreen && prevScreen !== 'combat' && typeof window.scrollTo === 'function') {
        window.scrollTo(0, 0);
      }
    } else if (
      state.screen === 'map' &&
      prevScreen !== 'map' &&
      state.currentNodeId &&
      !ui.modal
    ) {
      const currentNodeEl = rootEl.querySelector(`#map-node-${CSS.escape(state.currentNodeId)}`);
      if (currentNodeEl && typeof currentNodeEl.scrollIntoView === 'function') {
        currentNodeEl.scrollIntoView({ block: 'center', behavior: 'auto' });
      }
    } else if (prevScreen && prevScreen !== state.screen && !ui.modal && typeof window.scrollTo === 'function') {
      window.scrollTo(0, 0);
    }
  }

  function executeCardPlayWithFx(instanceId, targetEnemyId) {
    const card = state.combat?.hand?.find((c) => c.instanceId === instanceId);
    const stats = card ? getCardStats(card) : null;
    const cardEl = rootEl.querySelector(`#hand-card-${CSS.escape(instanceId)}`);
    const targetEl = targetEnemyId
      ? rootEl.querySelector(`#enemy-unit-${CSS.escape(targetEnemyId)}`)
      : stats?.target === 'self'
        ? rootEl.querySelector('#player-unit')
        : rootEl.querySelector('.fighters-group.enemy-side');

    const prevSnap = fxManager.captureCombatSnapshot(state);
    if (cardEl && stats) {
      fxManager.spawnCardFlyFx(cardEl, targetEl, stats);
    }

    const res = runPlayCard(state, instanceId, targetEnemyId);
    clearCombatSelection();
    setNotice(res.ok ? '' : res.reason, res.ok ? 'normal' : 'warn');
    render();

    if (res.ok) {
      if (stats?.type === 'power') soundEngine.play('card_power');
      else if (stats?.type === 'skill') soundEngine.play('card_skill');
      else soundEngine.play('card_attack');
      fxManager.reconcileCombatFx(prevSnap, state, 'card', soundEngine);
    }
  }

  function executeDiscardHandCardWithFx(instanceId) {
    if (!state || state.screen !== 'combat' || !state.combat?.pendingDiscard) return;
    const prevSnap = fxManager.captureCombatSnapshot(state);
    const res = runDiscardHandCard(state, instanceId);
    clearCombatSelection();
    setNotice(res.ok ? '' : res.reason, res.ok ? 'normal' : 'warn');
    render();
    if (res.ok) {
      soundEngine.play('card_skill');
      fxManager.reconcileCombatFx(prevSnap, state, 'card', soundEngine);
    }
  }

  function executePotionWithFx(slot, targetEnemyId) {
    const prevSnap = fxManager.captureCombatSnapshot(state);
    const res = runUsePotion(state, slot, targetEnemyId);
    clearCombatSelection();
    setNotice(res.ok ? '' : res.reason, res.ok ? 'normal' : 'warn');
    render();
    if (res.ok) {
      soundEngine.play('potion');
      fxManager.reconcileCombatFx(prevSnap, state, 'potion', soundEngine);
    }
  }

  function executeEndTurnWithFx() {
    clearCombatSelection();
    const prevSnap = fxManager.captureCombatSnapshot(state);
    const res = runEndTurn(state);
    setNotice(res.ok ? '' : res.reason, res.ok ? 'normal' : 'warn');
    render();
    if (res.ok) {
      soundEngine.play('ui_click');
      fxManager.reconcileCombatFx(prevSnap, state, 'endTurn', soundEngine);
    }
  }

  function handleHandCardInteraction(instanceId) {
    if (!state || state.screen !== 'combat' || !state.combat) return;
    if (state.combat.pendingDiscard) {
      executeDiscardHandCardWithFx(instanceId);
      return;
    }
    const card = state.combat.hand.find((c) => c.instanceId === instanceId);
    if (!card) return;

    ui.selectedPotionSlot = null;
    const check = canPlayCard(state, instanceId);
    if (!check.playable) {
      setNotice(check.reason, 'warn');
      render();
      return;
    }

    const stats = getCardStats(card);
    const alive = getAliveEnemies(state.combat);

    if (stats.target === 'enemy' && alive.length > 1) {
      ui.selectedCardId = ui.selectedCardId === instanceId ? null : instanceId;
      soundEngine.play('ui_click');
      setNotice('');
      render();
      return;
    }

    // Optional two-tap confirmation mode for mobile anti-misclick
    if (settings.mobileTapConfirm && ui.selectedCardId !== instanceId) {
      ui.selectedCardId = instanceId;
      soundEngine.play('ui_click');
      setNotice('');
      render();
      return;
    }

    const targetId = stats.target === 'enemy' ? alive[0]?.id ?? null : null;
    executeCardPlayWithFx(instanceId, targetId);
  }

  function handleEnemyClick(enemyId) {
    if (!state || state.screen !== 'combat' || !state.combat || state.combat.pendingDiscard) return;

    if (ui.selectedCardId) {
      executeCardPlayWithFx(ui.selectedCardId, enemyId);
      return;
    }

    if (ui.selectedPotionSlot !== null) {
      executePotionWithFx(ui.selectedPotionSlot, enemyId);
    }
  }

  function launchRunForCharacter(characterId, overrides = {}) {
    const safeChar = normalizeCharacterId(characterId || ui.selectedCharacterId || meta.selectedCharacterId);
    meta.selectedCharacterId = safeChar;
    saveMeta(meta);
    ui.selectedCharacterId = safeChar;
    ui.showCharacterSelect = false;
    state = createNewRun(buildNewRunOptions({ characterId: safeChar, ...overrides }));
    lastGameOverSummary = null;
    ui.pendingChallenge = null;
    ui.modal = null;
    ui.seedInput = '';
    ui.mobileLogExpanded = false;
    clearCombatSelection();
  }

  function startDailyChallengeRun(dateKeyOverride = '') {
    const spec = getDailyChallengeSpec(dateKeyOverride || getLocalDateKey());
    launchRunForCharacter(spec.characterId, {
      dailyDateKey: spec.dateKey,
    });
    const modNames = spec.modifiers.map((m) => m.name).join(' · ');
    soundEngine.play('upgrade');
    setNotice(`已开启每日挑战【${spec.dateKey} · ${spec.characterName}】（词条：${modNames}）！`);
    render();
  }

  function startChallengeRun(spec) {
    if (spec?.isDaily && spec?.dailyDateKey) {
      startDailyChallengeRun(spec.dailyDateKey);
      return;
    }
    const targetAsc = Number.isFinite(Number(spec?.ascension))
      ? Math.max(0, Math.min(MAX_ASCENSION, Math.floor(Number(spec.ascension))))
      : 0;
    const targetChar = normalizeCharacterId(
      spec?.characterId || ui.selectedCharacterId || meta.selectedCharacterId
    );
    const targetCharDef = getCharacterDef(targetChar);
    launchRunForCharacter(targetChar, {
      seed: spec.seed,
      ascension: targetAsc,
      unlockAllOverride: true,
      isChallengeRun: true,
    });
    soundEngine.play('upgrade');
    setNotice(
      `已进入好友种子挑战【${targetCharDef.name} · ${formatSeedCode(state.seed)} · 进阶 ${state.ascension}】（全图鉴临时对齐，不修改生涯解锁进度）！`
    );
    render();
  }

  function writeTextToClipboard(text) {
    try {
      if (navigator.clipboard?.writeText) {
        Promise.resolve(navigator.clipboard.writeText(text)).catch(() => {});
      }
    } catch {
      // Clipboard API may be restricted in non-HTTPS contexts
    }
  }

  function copySeedToClipboard(
    seedCode,
    ascensionOverride = null,
    characterIdOverride = null,
    dailyDateKeyOverride = ''
  ) {
    const dailyKey = (dailyDateKeyOverride || '').trim();
    if (dailyKey) {
      const dailyUrl = buildDailyChallengeUrl(window.location?.href || '', dailyKey);
      writeTextToClipboard(dailyUrl);
      ui.seedInput = dailyUrl;
      soundEngine.play('ui_click');
      setNotice(`已复制每日挑战链接（${dailyKey}）：${dailyUrl}`);
      render();
      return;
    }

    const parsedSeed = parseSeedInput(seedCode) ?? state?.seed;
    if (parsedSeed === undefined || parsedSeed === null) return;
    const code = formatSeedCode(parsedSeed);
    const ascVal =
      ascensionOverride !== null && ascensionOverride !== undefined && ascensionOverride !== ''
        ? Number(ascensionOverride)
        : state?.ascension ?? 0;
    const safeAsc = Number.isFinite(ascVal)
      ? Math.max(0, Math.min(MAX_ASCENSION, Math.floor(ascVal)))
      : 0;
    const charId = normalizeCharacterId(
      characterIdOverride || state?.characterId || ui.selectedCharacterId
    );
    const charDef = getCharacterDef(charId);
    const shareUrl = buildChallengeUrl(
      window.location?.href || '',
      parsedSeed,
      safeAsc,
      MAX_ASCENSION,
      charId
    );
    writeTextToClipboard(shareUrl);
    ui.seedInput = shareUrl;
    soundEngine.play('ui_click');
    setNotice(`已复制挑战链接（${charDef.name} · 种子 ${code} · 进阶 ${safeAsc}）：${shareUrl}`);
    render();
  }

  function copyBattleReportToClipboard(report) {
    if (!report) return;
    const shareUrl = report.dailyDateKey
      ? buildDailyChallengeUrl(window.location?.href || '', report.dailyDateKey)
      : buildChallengeUrl(
          window.location?.href || '',
          report.seed,
          report.ascension ?? 0,
          MAX_ASCENSION,
          report.characterId || 'ironclad'
        );
    const text = formatShareableBattleReport(report, shareUrl);
    ui.lastCopiedReport = text;
    writeTextToClipboard(text);
    soundEngine.play('upgrade');
    setNotice(`已复制战绩卡到剪贴板（评分 ${report.score ?? 0} · ${report.grade || ''}），可直接粘贴分享给好友！`);
    render();
  }

  function startSeededRunFromInput(inputSelector = '#seed-input-box') {
    const inputEl = rootEl.querySelector(inputSelector);
    const rawVal = inputEl ? inputEl.value : ui.seedInput;
    ui.seedInput = rawVal || '';
    const parsed = parseChallengeInput(rawVal, MAX_ASCENSION);
    if (!parsed) {
      soundEngine.play('ui_click');
      if (inputEl) inputEl.focus();
      return false;
    }
    if (parsed.isDaily && parsed.dailyDateKey) {
      startDailyChallengeRun(parsed.dailyDateKey);
      return true;
    }
    const fallbackChar = normalizeCharacterId(
      ui.showCharacterSelect
        ? ui.selectedCharacterId
        : state?.characterId || ui.selectedCharacterId || meta.selectedCharacterId
    );
    if (parsed.isUrlLike) {
      startChallengeRun({
        seed: parsed.seed,
        ascension: parsed.ascension ?? meta.selectedAscension ?? 0,
        characterId: parsed.characterId || fallbackChar,
      });
      return true;
    }
    launchRunForCharacter(fallbackChar, { seed: parsed.seed });
    soundEngine.play('upgrade');
    setNotice(`已按指定种子【${getCharacterDef(fallbackChar).name} · ${formatSeedCode(state.seed)}】开启新的一局！`);
    render();
    return true;
  }

  function startCharacterSelectRun() {
    const seedEl = rootEl.querySelector('#char-seed-input');
    const rawSeed = (seedEl ? seedEl.value : ui.seedInput || '').trim();
    if (rawSeed) {
      startSeededRunFromInput('#char-seed-input');
      return;
    }
    launchRunForCharacter(ui.selectedCharacterId);
    soundEngine.play('upgrade');
    setNotice('');
    render();
  }

  function dismissActiveModal() {
    if (!ui.modal) return;
    if (ui.modal === 'neow_action') {
      if (state?.neowState?.pendingAction?.allowCancel) {
        cancelNeowAction(state);
        ui.modal = null;
        soundEngine.play('ui_click');
        render();
      } else {
        setNotice('请完成当前鲸鱼赐福选牌（或点击跳过）后再继续。', 'warn');
        render();
      }
      return;
    }
    if (ui.modal === 'confirm_challenge') {
      ui.pendingChallenge = null;
    }
    ui.modal = null;
    soundEngine.play('ui_click');
    render();
  }

  const dragController = createCombatDragController({
    rootEl,
    dragLayerEl,
    getState: () => (ui.showCharacterSelect ? null : state),
    getUi: () => ui,
    hideTooltip,
    onPlayCard: (instanceId, targetEnemyId) => executeCardPlayWithFx(instanceId, targetEnemyId),
    onSyncTactics: (override) => syncCombatTactics(override),
  });

  rootEl.addEventListener('click', (event) => {
    if (dragController.shouldSuppressClick()) return;
    const targetEl = event.target instanceof Element ? event.target : null;
    const target = targetEl ? targetEl.closest('[data-action]') : null;
    const tipAnchor = targetEl ? targetEl.closest('[data-tooltip-desc]') : null;

    // Mobile / touch tap-to-inspect support for passive badges (relics, statuses, intents, disabled potions)
    const isPassiveClick =
      !target ||
      target.dataset.action === 'noop' ||
      (target.dataset.action === 'click-enemy' && !ui.selectedCardId && ui.selectedPotionSlot === null);

    if (isPassiveClick) {
      if (tipAnchor) {
        if (activeTooltipAnchor === tipAnchor && !tooltipEl.hidden) {
          hideTooltip();
        } else {
          showTooltip(tipAnchor);
        }
      } else {
        hideTooltip();
      }
      return;
    }

    const action = target.dataset.action;
    if (
      (action === 'close-modal-backdrop' ||
        action === 'cancel-neow-action' ||
        action === 'decline-challenge') &&
      target.id === 'modal-backdrop' &&
      event.target !== target
    ) {
      return;
    }

    switch (action) {
      case 'select-character': {
        const nextChar = normalizeCharacterId(target.dataset.characterId);
        ui.selectedCharacterId = nextChar;
        meta.selectedCharacterId = nextChar;
        saveMeta(meta);
        soundEngine.play('ui_click');
        render();
        break;
      }
      case 'start-character-run': {
        startCharacterSelectRun();
        break;
      }
      case 'resume-active-run': {
        if (state && state.screen !== 'game_over') {
          ui.showCharacterSelect = false;
          ui.modal = null;
          soundEngine.play('ui_click');
          setNotice('');
          render();
        }
        break;
      }
      case 'new-run': {
        ui.selectedCharacterId = state?.characterId || meta.selectedCharacterId || 'ironclad';
        ui.showCharacterSelect = true;
        ui.modal = null;
        ui.seedInput = '';
        clearCombatSelection();
        soundEngine.play('ui_click');
        setNotice('');
        render();
        break;
      }
      case 'start-ascension-run': {
        const activeChar = state?.characterId || ui.selectedCharacterId || meta.selectedCharacterId;
        launchRunForCharacter(activeChar);
        soundEngine.play('ui_click');
        setNotice('');
        render();
        break;
      }
      case 'accept-challenge': {
        if (ui.pendingChallenge) {
          startChallengeRun(ui.pendingChallenge);
        } else {
          ui.modal = null;
          render();
        }
        break;
      }
      case 'decline-challenge': {
        ui.pendingChallenge = null;
        ui.modal = null;
        soundEngine.play('ui_click');
        setNotice('已保留你当前的尖塔进度。');
        render();
        break;
      }
      case 'start-seeded-run': {
        startSeededRunFromInput('#seed-input-box');
        break;
      }
      case 'replay-history-seed': {
        const seedVal = parseSeedInput(target.dataset.seed);
        const maxAllowed = meta.unlockAllOverride ? MAX_ASCENSION : meta.maxAscensionUnlocked ?? 0;
        const reqAsc = Number(target.dataset.ascension ?? 0);
        const safeAsc = Number.isFinite(reqAsc)
          ? Math.max(0, Math.min(maxAllowed, Math.floor(reqAsc)))
          : 0;
        const reqChar = normalizeCharacterId(target.dataset.characterId || state?.characterId);
        meta.selectedAscension = safeAsc;
        saveMeta(meta);
        launchRunForCharacter(reqChar, {
          seed: seedVal ?? undefined,
          ascension: safeAsc,
        });
        soundEngine.play('upgrade');
        setNotice(`已按种子【${getCharacterDef(reqChar).name} · ${formatSeedCode(state.seed)}】开启同图挑战！`);
        render();
        break;
      }
      case 'start-daily-challenge': {
        startDailyChallengeRun(target.dataset.dailyDate || '');
        break;
      }
      case 'copy-seed': {
        copySeedToClipboard(
          target.dataset.seedCode,
          target.dataset.ascension,
          target.dataset.characterId,
          target.dataset.dailyDate || ''
        );
        break;
      }
      case 'copy-battle-report': {
        const rec = ensureRunRecorded()?.historyEntry || (state ? buildRunReportFromState(state) : null);
        copyBattleReportToClipboard(rec);
        break;
      }
      case 'copy-history-report': {
        const idx = Number(target.dataset.historyIdx);
        const rec = Array.isArray(meta.runHistory) ? meta.runHistory[idx] : null;
        if (rec) {
          copyBattleReportToClipboard(rec);
        }
        break;
      }
      case 'inspect-history-run': {
        const idx = Number(target.dataset.historyIdx);
        if (Array.isArray(meta.runHistory) && meta.runHistory[idx]) {
          ui.inspectedHistoryIdx = idx;
          ui.modal = 'history_detail';
          soundEngine.play('ui_click');
          render();
        }
        break;
      }
      case 'choose-neow': {
        const res = chooseNeowOption(state, target.dataset.optionId);
        if (!res.ok) {
          setNotice(res.reason, 'warn');
        } else if (res.pendingModal === 'neow_action') {
          ui.modal = 'neow_action';
          soundEngine.play('ui_click');
          setNotice('');
        } else {
          ui.modal = null;
          soundEngine.play('upgrade');
          setNotice('');
        }
        render();
        break;
      }
      case 'open-neow-pending': {
        if (state.neowState?.pendingAction) {
          ui.modal = 'neow_action';
          soundEngine.play('ui_click');
          render();
        }
        break;
      }
      case 'complete-neow-action': {
        const res = completeNeowAction(state, target.dataset.instanceId);
        if (!res.ok) {
          setNotice(res.reason, 'warn');
        } else if (res.resolved) {
          ui.modal = null;
          soundEngine.play('upgrade');
          setNotice('');
        } else {
          soundEngine.play('card_attack');
          setNotice('');
        }
        render();
        break;
      }
      case 'skip-neow-card': {
        const res = skipNeowCardOffer(state);
        if (res.ok) {
          ui.modal = null;
          soundEngine.play('ui_click');
          setNotice('');
        } else {
          setNotice(res.reason, 'warn');
        }
        render();
        break;
      }
      case 'cancel-neow-action': {
        const res = cancelNeowAction(state);
        if (res.ok) {
          ui.modal = null;
          soundEngine.play('ui_click');
          setNotice('');
        } else {
          setNotice(res.reason, 'warn');
        }
        render();
        break;
      }
      case 'select-ascension': {
        const lvl = Number(target.dataset.ascension);
        const maxAllowed = meta.unlockAllOverride ? MAX_ASCENSION : meta.maxAscensionUnlocked ?? 0;
        if (Number.isInteger(lvl) && lvl >= 0 && lvl <= maxAllowed) {
          meta.selectedAscension = lvl;
          saveMeta(meta);
          soundEngine.play('ui_click');
          render();
        }
        break;
      }
      case 'toggle-unlock-all': {
        meta.unlockAllOverride = true;
        meta.unlockedTier = UNLOCK_TIERS.length;
        meta.maxAscensionUnlocked = MAX_ASCENSION;
        saveMeta(meta);
        soundEngine.play('upgrade');
        render();
        break;
      }
      case 'toggle-sound': {
        settings.soundEnabled = !settings.soundEnabled;
        saveSettings(settings);
        if (settings.soundEnabled) soundEngine.play('test');
        render();
        break;
      }
      case 'test-sound': {
        soundEngine.play('test');
        break;
      }
      case 'set-anim-speed': {
        const speed = target.dataset.speed;
        if (speed === 'normal' || speed === 'fast' || speed === 'off') {
          settings.animSpeed = speed;
          saveSettings(settings);
          fxManager.applyAnimSpeedAttr();
          soundEngine.play('ui_click');
          render();
        }
        break;
      }
      case 'toggle-damage-numbers': {
        settings.showDamageNumbers = !settings.showDamageNumbers;
        saveSettings(settings);
        soundEngine.play('ui_click');
        render();
        break;
      }
      case 'toggle-mobile-tap-confirm': {
        settings.mobileTapConfirm = !settings.mobileTapConfirm;
        saveSettings(settings);
        clearCombatSelection();
        soundEngine.play('ui_click');
        render();
        break;
      }
      case 'toggle-mobile-log': {
        ui.mobileLogExpanded = !ui.mobileLogExpanded;
        soundEngine.play('ui_click');
        render();
        break;
      }
      case 'dismiss-tutorial': {
        settings.tutorialDismissed = true;
        saveSettings(settings);
        soundEngine.play('ui_click');
        render();
        break;
      }
      case 'reset-tutorial': {
        settings.tutorialDismissed = false;
        saveSettings(settings);
        soundEngine.play('ui_click');
        ui.modal = null;
        render();
        break;
      }
      case 'open-help-tab': {
        ui.helpTab = target.dataset.helpTab || 'tutorial';
        ui.modal = 'help';
        soundEngine.play('ui_click');
        render();
        break;
      }
      case 'switch-help-tab': {
        ui.helpTab = target.dataset.helpTab || 'glossary';
        soundEngine.play('ui_click');
        render();
        break;
      }
      case 'set-glossary-cat': {
        ui.glossaryCategory = target.dataset.category || 'all';
        soundEngine.play('ui_click');
        render();
        break;
      }
      case 'restart-combat': {
        const res = runRestartCombat(state);
        if (res.ok) {
          ui.modal = null;
          clearCombatSelection();
          soundEngine.play('ui_click');
          setNotice('已重启本场战斗，恢复至第 1 回合初始状态。');
        } else {
          setNotice(res.reason, 'warn');
        }
        render();
        break;
      }
      case 'open-modal': {
        ui.modal = target.dataset.modal || null;
        soundEngine.play('ui_click');
        render();
        break;
      }
      case 'close-modal':
      case 'close-modal-backdrop': {
        dismissActiveModal();
        break;
      }
      case 'select-node': {
        if (target.getAttribute('aria-disabled') === 'true') {
          if (
            hasPendingNeowBlessing(state) &&
            state.map[0]?.some((n) => n.id === target.dataset.nodeId)
          ) {
            setNotice('请先在上方【第 0 层 · 涅奥的鲸鱼赐福】中 4 选 1，选定后立即解锁第 1 层起点！', 'warn');
            render();
          }
          break;
        }
        const res = selectMapNode(state, target.dataset.nodeId);
        if (res.ok) soundEngine.play('ui_click');
        setNotice(res.ok ? '' : res.reason, res.ok ? 'normal' : 'warn');
        render();
        break;
      }
      case 'click-hand-card': {
        handleHandCardInteraction(target.dataset.instanceId);
        break;
      }
      case 'discard-hand-card': {
        executeDiscardHandCardWithFx(target.dataset.instanceId);
        break;
      }
      case 'click-enemy': {
        handleEnemyClick(target.dataset.enemyId);
        break;
      }
      case 'end-turn': {
        executeEndTurnWithFx();
        break;
      }
      case 'use-potion': {
        const slot = Number(target.dataset.slot);
        const potionId = state.player.potions[slot];
        const pot = POTION_LIBRARY[potionId];
        if (!pot) break;

        ui.selectedCardId = null;
        const alive = state.combat ? getAliveEnemies(state.combat) : [];
        if (pot.target === 'enemy' && alive.length > 1) {
          ui.selectedPotionSlot = ui.selectedPotionSlot === slot ? null : slot;
          soundEngine.play('ui_click');
          render();
          break;
        }
        executePotionWithFx(slot, pot.target === 'enemy' ? alive[0]?.id : null);
        break;
      }
      case 'discard-potion': {
        discardPotion(state, Number(target.dataset.slot));
        soundEngine.play('ui_click');
        setNotice('已丢弃一瓶药水。');
        render();
        break;
      }
      case 'open-treasure': {
        openTreasureChest(state);
        soundEngine.play('gold');
        setNotice('');
        render();
        break;
      }
      case 'leave-treasure': {
        leaveTreasureRoom(state);
        soundEngine.play('ui_click');
        setNotice('');
        render();
        break;
      }
      case 'claim-boss-card': {
        const res = claimBossRewardCard(state, target.dataset.instanceId);
        if (res.ok) soundEngine.play('card_skill');
        setNotice(res.ok ? '已将首领稀有卡牌收入牌组！' : res.reason, res.ok ? 'normal' : 'warn');
        render();
        break;
      }
      case 'claim-boss-relic': {
        const res = claimBossRelic(state, target.dataset.relicId);
        if (res.ok) soundEngine.play('upgrade');
        setNotice(res.ok ? '已吸收首领遗物之力！' : res.reason, res.ok ? 'normal' : 'warn');
        render();
        break;
      }
      case 'proceed-next-act': {
        const res = proceedToNextAct(state);
        if (res.ok) soundEngine.play('victory');
        setNotice(res.ok ? '' : res.reason, res.ok ? 'normal' : 'warn');
        render();
        break;
      }
      case 'settle-act1-victory': {
        const res = settleAct1Victory(state);
        if (res.ok) soundEngine.play('victory');
        setNotice(res.ok ? '' : res.reason, res.ok ? 'normal' : 'warn');
        render();
        break;
      }
      case 'claim-gold': {
        claimRewardGold(state);
        soundEngine.play('gold');
        setNotice('');
        render();
        break;
      }
      case 'claim-relic': {
        claimRewardRelic(state);
        soundEngine.play('upgrade');
        setNotice('');
        render();
        break;
      }
      case 'claim-potion': {
        const res = claimRewardPotion(state);
        if (res.ok) soundEngine.play('potion');
        setNotice(res.ok ? '' : res.reason, res.ok ? 'normal' : 'warn');
        render();
        break;
      }
      case 'claim-card': {
        const res = claimRewardCard(state, target.dataset.instanceId);
        if (res.ok) soundEngine.play('card_skill');
        setNotice(res.ok ? '已将该卡牌加入牌组！' : res.reason, res.ok ? 'normal' : 'warn');
        render();
        break;
      }
      case 'proceed-reward': {
        const res = proceedFromReward(state);
        if (res.requiresConfirm) {
          ui.modal = 'confirm_skip_reward';
          setNotice(res.reason, 'warn');
        } else {
          ui.modal = null;
          soundEngine.play('ui_click');
          setNotice('');
        }
        render();
        break;
      }
      case 'confirm-proceed-reward': {
        proceedFromReward(state, { force: true });
        ui.modal = null;
        soundEngine.play('ui_click');
        setNotice('');
        render();
        break;
      }
      case 'claim-important-and-proceed': {
        if (state.reward) {
          if (!state.reward.goldClaimed && state.reward.gold > 0) {
            claimRewardGold(state);
          }
          if (state.reward.relicId && !state.reward.relicClaimed) {
            claimRewardRelic(state);
          }
        }
        proceedFromReward(state, { force: true });
        ui.modal = null;
        soundEngine.play('gold');
        setNotice('');
        render();
        break;
      }
      case 'rest-heal': {
        const res = restHeal(state);
        if (res.ok) {
          soundEngine.play('heal');
          setNotice('');
        } else {
          setNotice(res.reason, 'warn');
        }
        render();
        break;
      }
      case 'confirm-smith': {
        const res = restUpgradeCard(state, target.dataset.instanceId);
        if (res.ok) {
          ui.modal = null;
          soundEngine.play('upgrade');
          setNotice('');
        } else {
          setNotice(res.reason, 'warn');
        }
        render();
        break;
      }
      case 'leave-rest': {
        leaveRestSite(state);
        soundEngine.play('ui_click');
        render();
        break;
      }
      case 'buy-shop-card': {
        const res = buyShopCard(state, Number(target.dataset.offerIndex));
        if (res.ok) soundEngine.play('gold');
        setNotice(res.ok ? '购买成功，卡牌已加入牌组！' : res.reason, res.ok ? 'normal' : 'warn');
        render();
        break;
      }
      case 'buy-shop-colorless-card': {
        const res = buyShopColorlessCard(state, Number(target.dataset.offerIndex));
        if (res.ok) soundEngine.play('upgrade');
        setNotice(
          res.ok ? '已购入商店专属无色秘牌，卡牌已加入牌组！' : res.reason,
          res.ok ? 'normal' : 'warn'
        );
        render();
        break;
      }
      case 'buy-shop-relic': {
        const res = buyShopRelic(state);
        if (res.ok) soundEngine.play('gold');
        setNotice(res.ok ? '已购入遗物！' : res.reason, res.ok ? 'normal' : 'warn');
        render();
        break;
      }
      case 'buy-shop-potion': {
        const res = buyShopPotion(state);
        if (res.ok) soundEngine.play('gold');
        setNotice(res.ok ? '已购入药水！' : res.reason, res.ok ? 'normal' : 'warn');
        render();
        break;
      }
      case 'confirm-shop-purge': {
        const res = buyShopPurge(state, target.dataset.instanceId);
        if (res.ok) {
          ui.modal = null;
          soundEngine.play('card_attack');
          setNotice('已永久移除 1 张卡牌！');
        } else {
          setNotice(res.reason, 'warn');
        }
        render();
        break;
      }
      case 'leave-shop': {
        leaveShop(state);
        soundEngine.play('ui_click');
        setNotice('');
        render();
        break;
      }
      case 'choose-event': {
        const res = chooseEventOption(state, target.dataset.choiceId);
        if (res.ok) soundEngine.play('ui_click');
        setNotice(res.ok ? '' : res.reason, res.ok ? 'normal' : 'warn');
        render();
        break;
      }
      case 'confirm-event-purge': {
        completeEventPurge(state, target.dataset.instanceId);
        soundEngine.play('card_attack');
        setNotice('');
        render();
        break;
      }
      case 'confirm-event-card-action': {
        completeEventCardAction(state, target.dataset.instanceId);
        soundEngine.play('upgrade');
        setNotice('');
        render();
        break;
      }
      case 'pick-event-library-card': {
        pickEventLibraryCard(state, target.dataset.instanceId);
        soundEngine.play('card_skill');
        setNotice('');
        render();
        break;
      }
      case 'cancel-event-purge': {
        cancelEventPurge(state);
        soundEngine.play('ui_click');
        setNotice('');
        render();
        break;
      }
      case 'continue-event': {
        continueFromEvent(state);
        soundEngine.play('ui_click');
        setNotice('');
        render();
        break;
      }
      default:
        break;
    }
  });

  // Live slider & text input handlers without losing focus / IME composition
  rootEl.addEventListener('input', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    if (target.id === 'input-sound-volume' && target instanceof HTMLInputElement) {
      const vol = Math.max(0, Math.min(100, Math.round(Number(target.value) || 0)));
      settings.volume = vol;
      saveSettings(settings);
      const labelEl = rootEl.querySelector('#settings-volume-label');
      if (labelEl) labelEl.textContent = `${vol}%`;
    } else if (target.id === 'input-glossary-search' && target instanceof HTMLInputElement) {
      ui.glossaryQuery = target.value;
      const resultsEl = rootEl.querySelector('#glossary-results-container');
      if (resultsEl) {
        resultsEl.innerHTML = renderGlossaryItemsHtml(ui);
      }
    } else if (
      (target.id === 'seed-input-box' || target.id === 'char-seed-input') &&
      target instanceof HTMLInputElement
    ) {
      ui.seedInput = target.value;
    }
  });

  rootEl.addEventListener('change', (event) => {
    const target = event.target;
    if (target instanceof HTMLInputElement && target.id === 'input-sound-volume') {
      soundEngine.play('test');
    }
  });

  let hoveredMapNodeId = null;
  function updateHoveredMapEdges(nextNodeId) {
    if (nextNodeId === hoveredMapNodeId) return;
    hoveredMapNodeId = nextNodeId;
    const edgePaths = rootEl.querySelectorAll('.map-edge-path');
    edgePaths.forEach((pathEl) => {
      const match =
        Boolean(nextNodeId) &&
        (pathEl.dataset.fromNode === nextNodeId || pathEl.dataset.toNode === nextNodeId);
      pathEl.classList.toggle('edge-hover-highlight', match);
    });
  }

  // Instant hover tooltips + map route highlight + live combat Lethal/Shield-Break & Synergy previews in-place
  rootEl.addEventListener('mouseover', (event) => {
    if (dragController.isDragging()) return;
    const targetEl = event.target instanceof Element ? event.target : null;
    const tipAnchor = targetEl ? targetEl.closest('[data-tooltip-desc]') : null;
    if (tipAnchor) {
      showTooltip(tipAnchor);
    } else {
      hideTooltip();
    }

    if (!state || ui.showCharacterSelect) return;

    if (state.screen === 'map' || ui.modal === 'map') {
      const mapBtn = targetEl ? targetEl.closest('.map-node-btn[data-node-id]') : null;
      updateHoveredMapEdges(mapBtn ? mapBtn.dataset.nodeId : null);
      return;
    }

    if (hoveredMapNodeId) {
      updateHoveredMapEdges(null);
    }

    if (state.screen !== 'combat' || !state.combat) return;
    const enemyEl = targetEl ? targetEl.closest('[data-enemy-id]') : null;
    const handCardEl = targetEl ? targetEl.closest('#hand-tray .game-card[data-instance-id]') : null;
    const potionEl = targetEl ? targetEl.closest('button.potion-slot.filled[data-slot]') : null;

    const nextHoverEnemy = enemyEl ? enemyEl.dataset.enemyId : null;
    const nextHoverCard = handCardEl ? handCardEl.dataset.instanceId : null;
    const nextHoverPotion = potionEl ? Number(potionEl.dataset.slot) : null;

    const changed =
      nextHoverEnemy !== ui.hoveredEnemyId ||
      nextHoverCard !== ui.hoveredCardId ||
      nextHoverPotion !== ui.hoveredPotionSlot;
    if (!changed) return;

    ui.hoveredEnemyId = nextHoverEnemy;
    ui.hoveredCardId = nextHoverCard;
    ui.hoveredPotionSlot = Number.isInteger(nextHoverPotion) ? nextHoverPotion : null;

    if (ui.selectedCardId) {
      const selectedCard = state.combat.hand.find((c) => c.instanceId === ui.selectedCardId);
      const cardEl = rootEl.querySelector(`#hand-card-${CSS.escape(ui.selectedCardId)} .card-desc`);
      if (selectedCard && cardEl) {
        const desc = formatCardDescription(selectedCard, {
          player: state.player,
          targetEnemy: getPreviewTargetEnemy(),
          combat: state.combat,
        });
        cardEl.textContent = desc.text;
        cardEl.classList.toggle('boosted', desc.damageState === 'boosted' || desc.blockState === 'boosted');
        cardEl.classList.toggle('reduced', desc.damageState === 'reduced' || desc.blockState === 'reduced');
      }
    }

    syncCombatTactics();
  });

  rootEl.addEventListener('mouseleave', () => {
    hideTooltip();
    updateHoveredMapEdges(null);
    if (
      ui.hoveredCardId !== null ||
      ui.hoveredPotionSlot !== null ||
      ui.hoveredEnemyId !== null
    ) {
      ui.hoveredCardId = null;
      ui.hoveredPotionSlot = null;
      ui.hoveredEnemyId = null;
      syncCombatTactics();
    }
  });

  rootEl.addEventListener('focusin', (event) => {
    const targetEl = event.target instanceof Element ? event.target : null;
    const tipAnchor = targetEl ? targetEl.closest('[data-tooltip-desc]') : null;
    if (tipAnchor) {
      showTooltip(tipAnchor);
    }
    if (state && !ui.showCharacterSelect && state.screen === 'combat' && state.combat) {
      const handCardEl = targetEl ? targetEl.closest('#hand-tray .game-card[data-instance-id]') : null;
      if (handCardEl) {
        ui.hoveredCardId = handCardEl.dataset.instanceId;
        syncCombatTactics();
      }
    }
  });

  rootEl.addEventListener('focusout', () => {
    hideTooltip();
  });

  window.addEventListener(
    'scroll',
    () => {
      if (activeTooltipAnchor && !tooltipEl.hidden) {
        positionTooltip(activeTooltipAnchor);
      }
    },
    true
  );

  window.addEventListener('resize', () => {
    hideTooltip();
  });

  rootEl.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && event.target instanceof HTMLInputElement) {
      if (event.target.id === 'seed-input-box') {
        event.preventDefault();
        startSeededRunFromInput('#seed-input-box');
        return;
      }
      if (event.target.id === 'char-seed-input') {
        event.preventDefault();
        startCharacterSelectRun();
        return;
      }
    }

    if (
      (event.key === 'Enter' || event.key === ' ') &&
      event.target?.matches('[role="button"][data-action="select-character"]')
    ) {
      event.preventDefault();
      const nextChar = normalizeCharacterId(event.target.dataset.characterId);
      ui.selectedCharacterId = nextChar;
      meta.selectedCharacterId = nextChar;
      saveMeta(meta);
      soundEngine.play('ui_click');
      render();
      return;
    }

    if (
      (event.key === 'Enter' || event.key === ' ') &&
      event.target?.matches('[role="button"][data-action="click-enemy"]')
    ) {
      event.preventDefault();
      handleEnemyClick(event.target.dataset.enemyId);
    }
  });

  // Keyboard shortcuts: 1-9 play/select/discard hand cards, E ends turn, D opens deck, M toggles map, H/? opens help, Escape cancels
  window.addEventListener('keydown', (event) => {
    if (event.target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName)) {
      if (event.key === 'Escape' && ui.modal) {
        dismissActiveModal();
      }
      return;
    }

    if (event.key === 'Escape') {
      if (dragController.isDragging()) {
        dragController.cancel();
        return;
      }
      if (ui.modal) {
        dismissActiveModal();
      } else if (ui.selectedCardId || ui.selectedPotionSlot !== null) {
        clearCombatSelection();
        render();
      }
      return;
    }

    if (event.key === 'm' || event.key === 'M') {
      if (ui.modal === 'map') {
        dismissActiveModal();
        return;
      }
      if (
        !ui.modal &&
        state &&
        !ui.showCharacterSelect &&
        state.screen !== 'map' &&
        state.screen !== 'game_over'
      ) {
        ui.modal = 'map';
        soundEngine.play('ui_click');
        render();
        return;
      }
    }

    if (ui.modal) return;

    if (event.key === 'd' || event.key === 'D') {
      if (state && !ui.showCharacterSelect) {
        ui.modal = 'deck';
        render();
      }
      return;
    }

    if (event.key === 'h' || event.key === 'H' || event.key === '?') {
      ui.modal = 'help';
      render();
      return;
    }

    if (state && !ui.showCharacterSelect && state.screen === 'combat' && state.combat?.phase === 'player') {
      if ((event.key === 'e' || event.key === 'E') && !state.combat.pendingDiscard) {
        event.preventDefault();
        executeEndTurnWithFx();
        return;
      }

      const num = Number(event.key);
      if (num >= 1 && num <= 9) {
        const card = state.combat.hand[num - 1];
        if (card) {
          handleHandCardInteraction(card.instanceId);
        }
      }
    }
  });

  render();
  return {
    getState: () => state,
    getMeta: () => meta,
    getSettings: () => settings,
    getLastCopiedReport: () => ui.lastCopiedReport,
    isCharacterSelect: () => Boolean(ui.showCharacterSelect || !state),
    render,
    openModal: (modalName) => {
      ui.modal = modalName;
      render();
    },
  };
}
