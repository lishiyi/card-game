/**
 * Main UI controller orchestrating modular screens, non-blocking FX, Web Audio SFX,
 * hover + touch tooltips, settings, seed sharing, and keyboard shortcuts.
 */

import { formatCardDescription, getCardStats } from '../data/cards.js';
import { getCharacterDef, normalizeCharacterId } from '../data/characters.js';
import { ACT4_TOTAL_FLOORS, TOTAL_FLOORS } from '../data/events.js';
import { POTION_LIBRARY } from '../data/relics.js';
import {
  canPlayCard,
  getActivePendingCardChoice,
  getAliveEnemies,
  hasPendingCardChoice,
} from '../engine/combat.js';
import { getDailyChallengeSpec, getLocalDateKey } from '../engine/daily.js';
import {
  cancelNeowAction,
  createNewRun,
  ensureRunKeys,
  formatRelicUpgradeSummary,
  getStarterPotionSlotCount,
  hasPendingNeowBlessing,
  runConfirmPendingCardChoice,
  runConfirmScry,
  runDiscardHandCard,
  runEndTurn,
  runInitiateScry,
  runPlayCard,
  runReconcileCombat,
  runResolveCardChoice,
  runTogglePendingCardChoice,
  runToggleScryCard,
  runUsePotion,
} from '../engine/game.js';
import {
  formatShareableBattleReport,
  getMaxAscensionForCharacter,
  getRunRecordKey,
  loadSavedMeta,
  MAX_ASCENSION,
  migrateLegacyRunCards,
  recordCompletedRun,
  saveMeta,
  syncCompendiumFromRunState,
  validateSaveBackup,
} from '../engine/meta.js';
import {
  buildChallengeUrl,
  buildDailyChallengeUrl,
  formatSeedCode,
  parseChallengeInput,
  parseSeedInput,
} from '../engine/rng.js';
import { dispatchUiAction } from './actions/index.js';
import { createSoundEngine } from './audio.js';
import {
  ensureAllCardArtLoaded,
  ensureCharacterCardArtLoaded,
  onCardArtLoaded,
  patchRenderedCardArtFrames,
} from './card_art.js';
import {
  applyCombatTacticsUI,
  clearCombatTacticsUI,
  createCombatDragController,
} from './combat_interact.js';
import { createFxManager } from './fx.js';
import { escapeHtml, formatCardDescHtml } from './helpers.js';
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
    const validMapLen = (parsed?.act ?? 1) === 4 ? ACT4_TOTAL_FLOORS : TOTAL_FLOORS;
    if (
      parsed &&
      typeof parsed === 'object' &&
      parsed.player &&
      Array.isArray(parsed.player.deck) &&
      Array.isArray(parsed.map) &&
      parsed.map.length === validMapLen &&
      typeof parsed.screen === 'string'
    ) {
      const charId = normalizeCharacterId(parsed.characterId);
      const charDef = getCharacterDef(charId);
      parsed.characterId = charId;
      ensureRunKeys(parsed);
      migrateLegacyRunCards(parsed);
      if (!parsed.player.artKey) {
        parsed.player.artKey = charDef.artKey;
      }
      const targetPotionSlots = getStarterPotionSlotCount(parsed.ascension ?? 0);
      if (!Array.isArray(parsed.player.potions)) {
        parsed.player.potions = [
          charDef.starterPotion,
          ...Array(Math.max(0, targetPotionSlots - 1)).fill(null),
        ];
      } else {
        while (parsed.player.potions.length < targetPotionSlots) {
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
        ascension: spec.ascension,
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
    const charId = normalizeCharacterId(overrides.characterId ?? meta.selectedCharacterId);
    const charMaxAsc = getMaxAscensionForCharacter(meta, charId);
    const defaultAsc = Math.max(0, Math.min(charMaxAsc, meta.selectedAscension ?? 0));
    return {
      characterId: charId,
      ascension: overrides.ascension ?? defaultAsc,
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
      initialNotice = `已通过直连进入每日挑战【${spec.dateKey} · ${spec.characterName} · 进阶 ${spec.ascension}】（无鲸鱼赐福 · 词条：${modNames}）！`;
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
    if (state.screen === 'combat' && state.combat?.status === 'ongoing') {
      runReconcileCombat(state);
    }
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
  let tooltipPinnedByTap = false;
  let lastTouchInteractionTs = 0;

  function markTouchInteraction() {
    lastTouchInteractionTs = Date.now();
  }

  function isRecentTouchInteraction() {
    return Date.now() - lastTouchInteractionTs < 1000;
  }

  function isCoarseTouchDevice() {
    return (
      isRecentTouchInteraction() ||
      (typeof window.matchMedia === 'function' &&
        window.matchMedia('(hover: none) and (pointer: coarse)').matches)
    );
  }

  function hideTooltip() {
    const prevAnchor = activeTooltipAnchor;
    if (prevAnchor) {
      prevAnchor.classList.remove('tooltip-active');
      if (
        isRecentTouchInteraction() &&
        document.activeElement === prevAnchor &&
        typeof prevAnchor.blur === 'function'
      ) {
        prevAnchor.blur();
      }
    }
    activeTooltipAnchor = null;
    tooltipPinnedByTap = false;
    tooltipEl.hidden = true;
  }

  function positionTooltip(anchorEl) {
    if (!anchorEl || tooltipEl.hidden) return;
    if (!anchorEl.isConnected) {
      hideTooltip();
      return;
    }
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

  function showTooltip(anchorEl, { pinned = false } = {}) {
    if (!anchorEl) {
      hideTooltip();
      return;
    }
    if (activeTooltipAnchor === anchorEl && !tooltipEl.hidden) {
      if (pinned) tooltipPinnedByTap = true;
      anchorEl.classList.add('tooltip-active');
      positionTooltip(anchorEl);
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

    if (activeTooltipAnchor && activeTooltipAnchor !== anchorEl) {
      activeTooltipAnchor.classList.remove('tooltip-active');
    }
    activeTooltipAnchor = anchorEl;
    activeTooltipAnchor.classList.add('tooltip-active');
    tooltipPinnedByTap = Boolean(pinned);
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

  const initialDebugMode = (() => {
    try {
      return new URLSearchParams(window.location?.search || '').get('debug') === '1';
    } catch {
      return false;
    }
  })();

  function isCompactHudViewport() {
    return typeof window !== 'undefined' && window.innerWidth <= 768;
  }

  const ui = {
    debugMode: initialDebugMode,
    showCharacterSelect: initialShowCharacterSelect,
    menuView: 'home',
    seedDrawerOpen: false,
    selectedCharacterId: state?.characterId || meta.selectedCharacterId || 'ironclad',
    selectedCardId: null,
    selectedPotionSlot: null,
    activePotionPopoverSlot: null,
    hudMenuOpen: false,
    hoveredCardId: null,
    hoveredPotionSlot: null,
    hoveredEnemyId: null,
    modal: initialModal,
    relicUpgradeReveal: null,
    pendingChallenge: initialPendingChallenge,
    inspectedHistoryIdx: null,
    mobileLogExpanded: false,
    lastCopiedReport: '',
    helpTab: 'glossary',
    glossaryCategory: 'all',
    glossaryQuery: '',
    compendiumTab: 'cards',
    compendiumCharFilter: 'all',
    compendiumRelicTier: 'all',
    compendiumShowUpgraded: false,
    historyCharFilter: 'all',
    historyOutcomeFilter: 'all',
    cardStatsCharFilter: 'all',
    cardStatsSort: 'winRate',
    cardStatsIncludeStarters: false,
    deckSort: 'order',
    deckStack: true,
    inspectedMapNodeId: null,
    mapTypeFilter: null,
    backupFeedback: '',
    backupFeedbackTone: 'ok',
    backupJsonDraft: '',
    seedInput: '',
    notice: initialNotice,
    noticeTone: 'normal',
  };

  let lastRenderedScreen = null;
  let lastRenderedModal = null;
  let hoveredMapNodeId = null;
  let hoveredMapTypeFilter = null;

  function clearMapInspectState({ clearTypeFilter = false } = {}) {
    hoveredMapNodeId = null;
    ui.inspectedMapNodeId = null;
    if (clearTypeFilter) {
      hoveredMapTypeFilter = null;
      ui.mapTypeFilter = null;
    }
  }

  function syncMapHighlights() {
    if (!state || ui.showCharacterSelect) return;
    const isMapVisible = state.screen === 'map' || ui.modal === 'map';
    if (!isMapVisible) return;

    const scopeEl =
      ui.modal === 'map'
        ? rootEl.querySelector('#map-inspector-modal') || rootEl
        : rootEl;
    const boardEl = scopeEl.querySelector('.map-board');
    if (!boardEl) return;

    const activeNodeId = hoveredMapNodeId || ui.inspectedMapNodeId || null;
    const connectedNodeIds = new Set();
    if (activeNodeId && Array.isArray(state.map)) {
      for (const row of state.map) {
        for (const node of row) {
          if (node.id === activeNodeId) {
            for (const nextId of node.nextIds || []) {
              connectedNodeIds.add(nextId);
            }
          } else if (Array.isArray(node.nextIds) && node.nextIds.includes(activeNodeId)) {
            connectedNodeIds.add(node.id);
          }
        }
      }
    }

    boardEl.classList.toggle('has-node-inspect', Boolean(activeNodeId));

    const edgePaths = boardEl.querySelectorAll('.map-edge-path');
    edgePaths.forEach((pathEl) => {
      const match =
        Boolean(activeNodeId) &&
        (pathEl.dataset.fromNode === activeNodeId || pathEl.dataset.toNode === activeNodeId);
      pathEl.classList.toggle('edge-hover-highlight', match);
    });

    const effectiveType = hoveredMapTypeFilter || ui.mapTypeFilter || null;
    boardEl.classList.toggle('has-type-filter', Boolean(effectiveType));

    const nodeBtns = boardEl.querySelectorAll('.map-node-btn[data-node-id]');
    nodeBtns.forEach((btn) => {
      const nid = btn.dataset.nodeId;
      btn.classList.toggle('map-node-inspected', Boolean(activeNodeId) && nid === activeNodeId);
      btn.classList.toggle(
        'map-node-connected',
        Boolean(activeNodeId) && connectedNodeIds.has(nid)
      );
      btn.classList.toggle(
        'map-node-type-match',
        Boolean(effectiveType) && btn.dataset.nodeType === effectiveType
      );
    });

    const filterBtns = scopeEl.querySelectorAll('.map-type-filter-btn[data-filter-node-type]');
    filterBtns.forEach((btn) => {
      const t = btn.dataset.filterNodeType;
      const locked = ui.mapTypeFilter === t;
      btn.classList.toggle('active', locked);
      btn.classList.toggle(
        'hover-preview',
        Boolean(hoveredMapTypeFilter) && hoveredMapTypeFilter === t && !locked
      );
      btn.setAttribute('aria-pressed', locked ? 'true' : 'false');
    });
  }

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
    if (!state || ui.showCharacterSelect || ui.modal) {
      ui.hudMenuOpen = false;
      ui.activePotionPopoverSlot = null;
    }
    if (
      ui.activePotionPopoverSlot !== null &&
      (!state?.player?.potions?.[ui.activePotionPopoverSlot] || !isCompactHudViewport())
    ) {
      ui.activePotionPopoverSlot = null;
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

  let isModalScrollLocked = false;
  let lockedWindowScrollY = 0;

  function syncModalScrollLock(shouldLock, { restoreScroll = true } = {}) {
    const htmlEl = document.documentElement;
    const bodyEl = document.body;
    if (!htmlEl || !bodyEl) return;

    if (shouldLock && !isModalScrollLocked) {
      lockedWindowScrollY = Math.max(
        0,
        Math.round(window.scrollY || window.pageYOffset || htmlEl.scrollTop || 0)
      );
      isModalScrollLocked = true;
      htmlEl.classList.add('spire-modal-open');
      bodyEl.classList.add('spire-modal-open');
      bodyEl.style.position = 'fixed';
      bodyEl.style.top = `-${lockedWindowScrollY}px`;
      bodyEl.style.left = '0';
      bodyEl.style.right = '0';
      bodyEl.style.width = '100%';
    } else if (!shouldLock && isModalScrollLocked) {
      const prevY = lockedWindowScrollY;
      isModalScrollLocked = false;
      lockedWindowScrollY = 0;
      htmlEl.classList.remove('spire-modal-open');
      bodyEl.classList.remove('spire-modal-open');
      bodyEl.style.position = '';
      bodyEl.style.top = '';
      bodyEl.style.left = '';
      bodyEl.style.right = '';
      bodyEl.style.width = '';
      if (restoreScroll && prevY > 0 && typeof window.scrollTo === 'function') {
        window.scrollTo(0, prevY);
      }
    }
  }

  function render() {
    hideTooltip();
    sanitizeUiState();
    fxManager.applyAnimSpeedAttr();
    const prevModal = lastRenderedModal;

    const artCharTarget = normalizeCharacterId(
      state?.characterId || ui.selectedCharacterId || meta.selectedCharacterId
    );
    ensureCharacterCardArtLoaded(artCharTarget);
    if (ui.modal === 'compendium' || ui.modal === 'history_detail') {
      ensureAllCardArtLoaded();
    }

    if (ui.showCharacterSelect || !state) {
      const menuView = ui.menuView || 'home';
      const menuScreenKey = `menu:${menuView}`;
      const prevScreen = lastRenderedScreen;
      const screenChanged = Boolean(prevScreen && prevScreen !== menuScreenKey);
      lastRenderedScreen = menuScreenKey;
      fxManager.clearPendingFx();
      fxLayerEl.innerHTML = '';
      const hasActiveRun = Boolean(state && state.screen !== 'game_over');
      const previewCharId = normalizeCharacterId(ui.selectedCharacterId || meta.selectedCharacterId);
      stageRoot.innerHTML = `
        <div class="spire-shell" data-character="${escapeHtml(previewCharId)}">
          ${renderCharacterSelectHeader({ hasActiveRun, menuView })}
          <main class="stage-viewport">
            ${renderCharacterSelectScreen({ state, meta, ui, hasActiveRun })}
          </main>
        </div>
        ${renderModal({ state, meta, settings, ui })}
      `;
      lastRenderedModal = ui.modal;
      syncModalScrollLock(Boolean(rootEl.querySelector('#modal-backdrop')), {
        restoreScroll: !screenChanged,
      });
      clearCombatTacticsUI(rootEl);
      if (screenChanged && !ui.modal && typeof window.scrollTo === 'function') {
        window.scrollTo(0, 0);
      }
      return;
    }

    persistRun(state);
    if (syncCompendiumFromRunState(meta, state)) {
      saveMeta(meta);
    }
    const prevScreen = lastRenderedScreen;
    const screenChanged = Boolean(prevScreen && prevScreen !== state.screen);
    lastRenderedScreen = state.screen;
    if (screenChanged) {
      ui.hudMenuOpen = false;
      ui.activePotionPopoverSlot = null;
    }
    if (state.screen !== 'combat') {
      fxManager.clearPendingFx();
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

    const prevHandTray = rootEl.querySelector('#hand-tray');
    const currentCombatKey =
      state.screen === 'combat' && state.combat
        ? `${state.runId}:${state.floor}:${state.combat.turn}`
        : '';
    const shouldKeepHandScroll =
      Boolean(prevHandTray) &&
      Boolean(currentCombatKey) &&
      ui.lastCombatScrollKey === currentCombatKey;
    const savedHandScrollLeft = shouldKeepHandScroll ? prevHandTray.scrollLeft : 0;

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
    ui.lastCombatScrollKey = currentCombatKey;
    if (shouldKeepHandScroll && savedHandScrollLeft > 0) {
      const nextHandTray = rootEl.querySelector('#hand-tray');
      if (nextHandTray) {
        const maxHandScroll = Math.max(0, nextHandTray.scrollWidth - nextHandTray.clientWidth);
        nextHandTray.scrollLeft = Math.min(savedHandScrollLeft, maxHandScroll);
      }
    }
    if (state.screen === 'combat' && state.combat && state.combat.status === 'ongoing') {
      const combatTurnKey = `${state.runId}:${state.act}:${state.floor}:${state.combat.encounterId}:${state.combat.turn}:${state.stats?.combatRestarts ?? 0}`;
      if (screenChanged && state.combat.turn === 1 && ui.lastAnnouncedTurnKey !== combatTurnKey) {
        ui.lastAnnouncedTurnKey = combatTurnKey;
        fxManager.spawnTurnTransitionFx(null, state, soundEngine);
      } else if (!prevScreen) {
        ui.lastAnnouncedTurnKey = combatTurnKey;
      }
    }
    lastRenderedModal = ui.modal;
    syncModalScrollLock(Boolean(rootEl.querySelector('#modal-backdrop')), {
      restoreScroll: !screenChanged,
    });

    if (ui.modal === 'map' && prevModal !== 'map' && state.currentNodeId) {
      const modalBodyEl = rootEl.querySelector('#map-inspector-modal .modal-body');
      const modalNodeEl = rootEl.querySelector(`#map-modal-node-${CSS.escape(state.currentNodeId)}`);
      if (modalBodyEl && modalNodeEl) {
        const bodyRect = modalBodyEl.getBoundingClientRect();
        const nodeRect = modalNodeEl.getBoundingClientRect();
        const scaleY =
          modalBodyEl.clientHeight > 0 && bodyRect.height > 0
            ? bodyRect.height / modalBodyEl.clientHeight
            : 1;
        const offsetInBody = (nodeRect.top - bodyRect.top) / scaleY + modalBodyEl.scrollTop;
        const nodeHeight = nodeRect.height / scaleY;
        const targetTop = offsetInBody - (modalBodyEl.clientHeight - nodeHeight) / 2;
        const maxScroll = Math.max(0, modalBodyEl.scrollHeight - modalBodyEl.clientHeight);
        modalBodyEl.scrollTop = Math.max(0, Math.min(maxScroll, Math.round(targetTop)));
      }
    }

    if (state.screen !== 'map') {
      ui.lastMapAutoScrollKey = '';
      if (ui.modal !== 'map') {
        clearMapInspectState({ clearTypeFilter: true });
      }
    }

    if (state.screen === 'map' || ui.modal === 'map') {
      syncMapHighlights();
    }

    if (state.screen === 'combat') {
      syncCombatTactics();
      if (screenChanged && !ui.modal && typeof window.scrollTo === 'function') {
        window.scrollTo(0, 0);
      }
    } else if (state.screen === 'map' && !ui.modal) {
      const pendingNeow = hasPendingNeowBlessing(state);
      const mapScrollKey = `${state.runId}:${state.act ?? 1}:${state.currentNodeId || 'f0'}:${pendingNeow ? 'neow' : 'ready'}`;
      if (ui.lastMapAutoScrollKey !== mapScrollKey) {
        ui.lastMapAutoScrollKey = mapScrollKey;
        if (pendingNeow) {
          if (typeof window.scrollTo === 'function') {
            window.scrollTo(0, 0);
          }
        } else {
          const outcomeEl = !state.currentNodeId
            ? rootEl.querySelector('#neow-outcome-banner')
            : null;
          const focusEl = state.currentNodeId
            ? rootEl.querySelector(`#map-node-${CSS.escape(state.currentNodeId)}`)
            : outcomeEl || rootEl.querySelector('.map-node-btn.available');
          if (focusEl && typeof focusEl.scrollIntoView === 'function') {
            focusEl.scrollIntoView({
              block: outcomeEl && focusEl === outcomeEl ? 'end' : 'center',
              behavior: 'auto',
            });
          }
        }
      }
    } else if (screenChanged && !ui.modal && typeof window.scrollTo === 'function') {
      window.scrollTo(0, 0);
    }
  }

  function formatCardRevealNotice(res) {
    const reveals = Array.isArray(res?.cardReveals) ? res.cardReveals : [];
    if (reveals.length === 0) return '';
    return reveals
      .map((r) => r?.summary)
      .filter(Boolean)
      .join(' · ');
  }

  function triggerCardRevealFx(res) {
    const reveals = Array.isArray(res?.cardReveals) ? res.cardReveals : [];
    if (reveals.length > 0) {
      fxManager.spawnCardRevealFx(reveals, state);
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
    const revealNotice = res.ok ? formatCardRevealNotice(res) : '';
    setNotice(res.ok ? revealNotice : res.reason, res.ok ? 'normal' : 'warn');
    render();

    if (res.ok) {
      if (card?.cardId === 'apotheosis' || (card?.cardId === 'armaments' && card?.upgraded)) {
        soundEngine.play('smith');
      } else if (card?.cardId === 'shiv' || (stats?.addShivs ?? 0) > 0) soundEngine.play('shiv');
      else if (
        stats?.type === 'skill' &&
        ((stats?.applyEnemyStatuses?.poison ?? 0) > 0 ||
          (stats?.applyAllEnemiesStatuses?.poison ?? 0) > 0)
      ) {
        soundEngine.play('poison');
      } else if (stats?.type === 'power') soundEngine.play('card_power');
      else if (stats?.type === 'skill') soundEngine.play('card_skill');
      else soundEngine.play('card_attack');
      fxManager.reconcileCombatFx(prevSnap, state, 'card', soundEngine, {
        cardId: card?.cardId,
        cardStats: stats,
        targetEnemyId,
      });
      if (Array.isArray(res.orbFxEvents) && res.orbFxEvents.length > 0) {
        fxManager.spawnOrbFxEvents(res.orbFxEvents, soundEngine);
      }
      triggerCardRevealFx(res);
    } else {
      soundEngine.play('error');
    }
  }

  function executeResolveCardChoiceWithFx(instanceId) {
    if (!state || state.screen !== 'combat' || !hasPendingCardChoice(state.combat)) return;
    const pending = getActivePendingCardChoice(state.combat);
    const prevSnap = fxManager.captureCombatSnapshot(state);
    const res =
      pending?.mode === 'discard'
        ? runDiscardHandCard(state, instanceId)
        : runResolveCardChoice(state, instanceId);
    clearCombatSelection();
    const revealNotice = res.ok ? formatCardRevealNotice(res) : '';
    setNotice(res.ok ? revealNotice : res.reason, res.ok ? 'normal' : 'warn');
    render();
    if (res.ok) {
      const cue =
        pending?.mode === 'upgrade'
          ? 'smith'
          : pending?.mode === 'exhaust'
            ? 'exhaust'
            : pending?.mode === 'discard'
              ? 'card_draw'
              : 'card_skill';
      soundEngine.play(cue);
      fxManager.reconcileCombatFx(prevSnap, state, 'card', soundEngine);
      triggerCardRevealFx(res);
    } else {
      soundEngine.play('error');
    }
  }

  function executeToggleScryWithFx(instanceId) {
    if (!state || state.screen !== 'combat' || state.combat?.pendingCardChoice?.mode !== 'scry') {
      return;
    }
    const res = runToggleScryCard(state, instanceId);
    if (res.ok) {
      soundEngine.play('card_select');
      render();
    }
  }

  function executeConfirmScryWithFx() {
    if (!state || state.screen !== 'combat' || state.combat?.pendingCardChoice?.mode !== 'scry') {
      return;
    }
    const prevSnap = fxManager.captureCombatSnapshot(state);
    const res = runConfirmScry(state);
    clearCombatSelection();
    setNotice(res.ok ? '' : res.reason, res.ok ? 'normal' : 'warn');
    render();
    if (res.ok) {
      soundEngine.play('card_draw');
      fxManager.reconcileCombatFx(prevSnap, state, 'card', soundEngine);
    }
  }

  function executeTogglePendingChoiceWithFx(instanceId) {
    if (!state || state.screen !== 'combat' || !state.combat?.pendingCardChoice) return;
    const res = runTogglePendingCardChoice(state, instanceId);
    if (res.ok) {
      soundEngine.play('card_select');
      setNotice('');
      render();
    } else if (res.reason) {
      soundEngine.play('error');
      setNotice(res.reason, 'warn');
      render();
    }
  }

  function executeConfirmPendingChoiceWithFx() {
    if (!state || state.screen !== 'combat' || !state.combat?.pendingCardChoice) return;
    const mode = state.combat.pendingCardChoice.mode;
    const prevSnap = fxManager.captureCombatSnapshot(state);
    const res = runConfirmPendingCardChoice(state);
    clearCombatSelection();
    setNotice(res.ok ? '' : res.reason, res.ok ? 'normal' : 'warn');
    render();
    if (res.ok) {
      soundEngine.play(mode === 'retain' ? 'end_turn' : 'card_draw');
      fxManager.reconcileCombatFx(prevSnap, state, mode === 'retain' ? 'endTurn' : 'card', soundEngine);
    }
  }

  function applyImportedBackup(rawInput) {
    const check = validateSaveBackup(rawInput, TOTAL_FLOORS);
    if (!check.ok) {
      ui.backupFeedback = `导入失败：${check.reason}`;
      ui.backupFeedbackTone = 'warn';
      soundEngine.play('error');
      render();
      return false;
    }
    const { backup, summary } = check;
    meta = backup.meta;
    saveMeta(meta);
    if (backup.settings) {
      settings = backup.settings;
      saveSettings(settings);
      fxManager.applyAnimSpeedAttr();
    }
    if (backup.activeRun) {
      state = backup.activeRun;
      persistRun(state);
      ui.showCharacterSelect = false;
      ui.menuView = 'home';
      ui.seedDrawerOpen = false;
      ui.selectedCharacterId = state.characterId || meta.selectedCharacterId || 'ironclad';
    } else {
      state = null;
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {
        // Ignore storage errors
      }
      ui.showCharacterSelect = true;
      ui.menuView = 'home';
      ui.seedDrawerOpen = false;
      ui.selectedCharacterId = meta.selectedCharacterId || 'ironclad';
    }
    lastGameOverSummary = null;
    clearCombatSelection();
    ui.backupJsonDraft = '';
    ui.backupFeedback = `✓ 校验通过并已导入存档：累计 ${summary.runsPlayed} 场（胜 ${summary.victories} 场）· ${summary.xp} XP · 图鉴 ${summary.compendiumCount} 项${summary.hasActiveRun ? '（含进行中对局）' : ''}。`;
    ui.backupFeedbackTone = 'ok';
    soundEngine.play('upgrade');
    render();
    return true;
  }

  function executePotionWithFx(slot, targetEnemyId) {
    const prevSnap = fxManager.captureCombatSnapshot(state);
    const res = runUsePotion(state, slot, targetEnemyId);
    clearCombatSelection();
    const revealNotice = res.ok ? formatCardRevealNotice(res) : '';
    setNotice(res.ok ? revealNotice : res.reason, res.ok ? 'normal' : 'warn');
    render();
    if (res.ok) {
      soundEngine.play('potion');
      fxManager.reconcileCombatFx(prevSnap, state, 'potion', soundEngine);
      if (Array.isArray(res.orbFxEvents) && res.orbFxEvents.length > 0) {
        fxManager.spawnOrbFxEvents(res.orbFxEvents, soundEngine);
      }
      triggerCardRevealFx(res);
    } else {
      soundEngine.play('error');
    }
  }

  function executeEndTurnWithFx() {
    clearCombatSelection();
    const prevSnap = fxManager.captureCombatSnapshot(state);
    const res = runEndTurn(state);
    setNotice(res.ok ? '' : res.reason, res.ok ? 'normal' : 'warn');
    render();
    if (res.ok) {
      soundEngine.play('end_turn');
      if (!res.awaitingRetainChoice) {
        fxManager.reconcileCombatFx(prevSnap, state, 'endTurn', soundEngine);
        if (Array.isArray(res.orbFxEvents) && res.orbFxEvents.length > 0) {
          fxManager.spawnOrbFxEvents(res.orbFxEvents, soundEngine);
        }
      }
    }
  }

  function handleHandCardInteraction(instanceId) {
    if (!state || state.screen !== 'combat' || !state.combat) return;
    if (hasPendingCardChoice(state.combat)) {
      const pending = getActivePendingCardChoice(state.combat);
      if (
        pending?.mode === 'scry' ||
        pending?.mode === 'discard_to_draw' ||
        pending?.mode === 'retrieve_discard_retain' ||
        pending?.mode === 'retrieve_discard_to_hand' ||
        pending?.mode === 'retrieve_exhaust_to_hand' ||
        pending?.mode === 'pick_from_draw' ||
        pending?.mode === 'omniscience' ||
        pending?.mode === 'discover_card' ||
        pending?.mode === 'wish'
      ) {
        return;
      }
      if (
        pending?.mode === 'retain' ||
        pending?.mode === 'exhaust_multi' ||
        pending?.mode === 'hand_to_draw_bottom_multi'
      ) {
        executeTogglePendingChoiceWithFx(instanceId);
        return;
      }
      executeResolveCardChoiceWithFx(instanceId);
      return;
    }
    const card = state.combat.hand.find((c) => c.instanceId === instanceId);
    if (!card) return;

    ui.selectedPotionSlot = null;
    const check = canPlayCard(state, instanceId);
    if (!check.playable) {
      soundEngine.play('error');
      setNotice(check.reason, 'warn');
      render();
      return;
    }

    const stats = getCardStats(card);
    const alive = getAliveEnemies(state.combat);

    if (stats.target === 'enemy' && alive.length > 1) {
      ui.selectedCardId = ui.selectedCardId === instanceId ? null : instanceId;
      soundEngine.play('card_select');
      setNotice('');
      render();
      return;
    }

    // Optional two-tap confirmation mode for mobile anti-misclick
    if (settings.mobileTapConfirm && ui.selectedCardId !== instanceId) {
      ui.selectedCardId = instanceId;
      soundEngine.play('card_select');
      setNotice('');
      render();
      return;
    }

    const targetId = stats.target === 'enemy' ? alive[0]?.id ?? null : null;
    executeCardPlayWithFx(instanceId, targetId);
  }

  function handleEnemyClick(enemyId) {
    if (
      !state ||
      state.screen !== 'combat' ||
      !state.combat ||
      hasPendingCardChoice(state.combat)
    ) {
      return;
    }

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
    ui.menuView = 'home';
    ui.seedDrawerOpen = false;
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
    setNotice(`已开启每日挑战【${spec.dateKey} · ${spec.characterName} · 进阶 ${spec.ascension}】（无鲸鱼赐福 · 词条：${modNames}）！`);
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
    if (ui.modal === 'relic_upgrade_reveal') {
      ui.relicUpgradeReveal = null;
    }
    if (ui.modal === 'map') {
      clearMapInspectState({ clearTypeFilter: true });
    }
    ui.modal = null;
    soundEngine.play('ui_click');
    render();
  }

  function showRelicUpgradePickup(pickup) {
    if (!pickup || !pickup.upgradeType) return false;
    ui.relicUpgradeReveal = pickup;
    ui.modal = 'relic_upgrade_reveal';
    const summary = formatRelicUpgradeSummary(pickup);
    if (summary) {
      setNotice(`✨ ${summary}！`);
    }
    const didUpgrade = Array.isArray(pickup.upgradedCards) && pickup.upgradedCards.length > 0;
    soundEngine.play(didUpgrade ? 'smith' : 'upgrade');
    return true;
  }

  function maybeShowRelicUpgradeReveal(prevSeq) {
    if (
      state &&
      (state._relicPickupSeq || 0) > prevSeq &&
      state.lastRelicPickup?.upgradeType
    ) {
      return showRelicUpgradePickup(state.lastRelicPickup);
    }
    return false;
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

  function executePotionSlotAction(slot) {
    const potionId = state?.player?.potions?.[slot];
    const pot = POTION_LIBRARY[potionId];
    if (!pot) return;

    ui.selectedCardId = null;
    const alive = state.combat ? getAliveEnemies(state.combat) : [];
    if (pot.target === 'enemy' && alive.length > 1) {
      ui.selectedPotionSlot = ui.selectedPotionSlot === slot ? null : slot;
      soundEngine.play('ui_click');
      render();
      return;
    }
    executePotionWithFx(slot, pot.target === 'enemy' ? alive[0]?.id : null);
  }

  const actionCtx = {
    rootEl,
    ui,
    soundEngine,
    fxManager,
    get state() {
      return state;
    },
    get meta() {
      return meta;
    },
    get settings() {
      return settings;
    },
    get hoveredMapNodeId() {
      return hoveredMapNodeId;
    },
    set hoveredMapNodeId(val) {
      hoveredMapNodeId = val;
    },
    get hoveredMapTypeFilter() {
      return hoveredMapTypeFilter;
    },
    set hoveredMapTypeFilter(val) {
      hoveredMapTypeFilter = val;
    },
    isTooltipPinnedTo(el) {
      return activeTooltipAnchor === el && !tooltipEl.hidden && tooltipPinnedByTap;
    },
    isCoarseTouchDevice,
    hideTooltip,
    showTooltip,
    isCompactHudViewport,
    clearMapInspectState,
    syncMapHighlights,
    clearCombatSelection,
    setNotice,
    ensureRunRecorded,
    render,
    executeResolveCardChoiceWithFx,
    executeToggleScryWithFx,
    executeConfirmScryWithFx,
    executeTogglePendingChoiceWithFx,
    executeConfirmPendingChoiceWithFx,
    applyImportedBackup,
    executeEndTurnWithFx,
    handleHandCardInteraction,
    handleEnemyClick,
    launchRunForCharacter,
    startDailyChallengeRun,
    startChallengeRun,
    writeTextToClipboard,
    copySeedToClipboard,
    copyBattleReportToClipboard,
    startSeededRunFromInput,
    startCharacterSelectRun,
    dismissActiveModal,
    showRelicUpgradePickup,
    maybeShowRelicUpgradeReveal,
    executePotionSlotAction,
  };

  rootEl.addEventListener('click', (event) => {
    if (dragController.shouldSuppressClick()) return;
    const targetEl = event.target instanceof Element ? event.target : null;
    const rawTarget = targetEl ? targetEl.closest('[data-action]') : null;
    const isBackdropInnerClick =
      Boolean(rawTarget) &&
      rawTarget.id === 'modal-backdrop' &&
      event.target !== rawTarget;
    const target = isBackdropInnerClick ? null : rawTarget;
    const tipAnchor = targetEl ? targetEl.closest('[data-tooltip-desc]') : null;
    const filledPotionAnchor = targetEl
      ? targetEl.closest('.potion-tooltip-anchor[data-filled-potion-slot]')
      : null;

    if (isCompactHudViewport() && filledPotionAnchor && !target) {
      const slot = Number(filledPotionAnchor.dataset.filledPotionSlot);
      if (Number.isInteger(slot) && state?.player?.potions?.[slot]) {
        ui.activePotionPopoverSlot = ui.activePotionPopoverSlot === slot ? null : slot;
        ui.hudMenuOpen = false;
        hideTooltip();
        soundEngine.play('ui_click');
        render();
        return;
      }
    }

    const clickedInsideHudMenu = Boolean(targetEl?.closest('.top-actions-more-wrap'));
    const clickedInsidePotionPopover = Boolean(
      targetEl?.closest('#hud-potion-popover, .potion-tooltip-anchor[data-filled-potion-slot]')
    );
    let dismissedHudOverlay = false;
    if (ui.hudMenuOpen && !clickedInsideHudMenu) {
      ui.hudMenuOpen = false;
      dismissedHudOverlay = true;
    }
    if (ui.activePotionPopoverSlot !== null && !clickedInsidePotionPopover) {
      ui.activePotionPopoverSlot = null;
      dismissedHudOverlay = true;
    }

    // Nested inspect chips (relic, potion, starter-deck badges, enemy intent badge, card keyword chip) inspect cleanly without triggering parent action
    const isNestedInspectChip =
      Boolean(tipAnchor) &&
      Boolean(target) &&
      tipAnchor !== target &&
      (target.dataset.action === 'select-character' ||
        tipAnchor.classList.contains('intent-badge') ||
        tipAnchor.classList.contains('card-kw-trigger'));

    // Mobile / touch tap-to-inspect support for passive badges (relics, potions, daily chips, locked Ascension pills, statuses, intents, card keywords)
    const isPassiveClick =
      !target ||
      target.dataset.action === 'noop' ||
      isNestedInspectChip ||
      (target.dataset.action === 'click-enemy' && !ui.selectedCardId && ui.selectedPotionSlot === null);

    if (isPassiveClick) {
      if (dismissedHudOverlay) {
        hideTooltip();
        render();
        return;
      }
      if (tipAnchor) {
        if (activeTooltipAnchor === tipAnchor && !tooltipEl.hidden && tooltipPinnedByTap) {
          hideTooltip();
        } else {
          showTooltip(tipAnchor, { pinned: true });
        }
      } else {
        hideTooltip();
        if (ui.inspectedMapNodeId && (state?.screen === 'map' || ui.modal === 'map')) {
          ui.inspectedMapNodeId = null;
          hoveredMapNodeId = null;
          syncMapHighlights();
        }
      }
      return;
    }

    const action = target.dataset.action;

    dispatchUiAction(action, actionCtx, target);
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
    } else if (target.id === 'input-import-save-json' && target instanceof HTMLTextAreaElement) {
      ui.backupJsonDraft = target.value;
    }
  });

  rootEl.addEventListener('change', (event) => {
    const target = event.target;
    if (target instanceof HTMLInputElement && target.id === 'input-sound-volume') {
      soundEngine.play('test');
    } else if (target instanceof HTMLInputElement && target.id === 'input-import-save-file') {
      const file = target.files?.[0];
      if (!file) return;
      const handleText = (text) => {
        applyImportedBackup(text);
        target.value = '';
      };
      if (typeof file.text === 'function') {
        file
          .text()
          .then(handleText)
          .catch(() => {
            ui.backupFeedback = '导入失败：无法读取所选文件内容。';
            ui.backupFeedbackTone = 'warn';
            target.value = '';
            render();
          });
      } else {
        const reader = new FileReader();
        reader.onload = () => handleText(String(reader.result || ''));
        reader.onerror = () => {
          ui.backupFeedback = '导入失败：无法读取所选文件内容。';
          ui.backupFeedbackTone = 'warn';
          target.value = '';
          render();
        };
        reader.readAsText(file);
      }
    }
  });

  window.addEventListener('touchstart', markTouchInteraction, { capture: true, passive: true });
  window.addEventListener(
    'pointerdown',
    (event) => {
      if (event.pointerType === 'touch' || event.pointerType === 'pen') {
        markTouchInteraction();
      }
    },
    { capture: true, passive: true }
  );

  // Instant hover tooltips + map route/type highlight + live combat Lethal/Shield-Break & Synergy previews in-place
  rootEl.addEventListener('mouseover', (event) => {
    if (dragController.isDragging() || isRecentTouchInteraction()) return;
    const targetEl = event.target instanceof Element ? event.target : null;
    const tipAnchor = targetEl ? targetEl.closest('[data-tooltip-desc]') : null;
    if (tipAnchor) {
      if (!tooltipPinnedByTap || activeTooltipAnchor !== tipAnchor) {
        showTooltip(tipAnchor, { pinned: false });
      }
    } else if (!tooltipPinnedByTap) {
      hideTooltip();
    }

    if (!state || ui.showCharacterSelect) return;

    if (state.screen === 'map' || ui.modal === 'map') {
      const filterBtn = targetEl
        ? targetEl.closest('.map-type-filter-btn[data-filter-node-type]')
        : null;
      const mapBtn = targetEl ? targetEl.closest('.map-node-btn[data-node-id]') : null;
      const nextFilter = filterBtn ? filterBtn.dataset.filterNodeType : null;
      const nextNode = mapBtn ? mapBtn.dataset.nodeId : null;
      if (nextFilter !== hoveredMapTypeFilter || nextNode !== hoveredMapNodeId) {
        hoveredMapTypeFilter = nextFilter;
        hoveredMapNodeId = nextNode;
        syncMapHighlights();
      }
      return;
    }

    if (hoveredMapNodeId || hoveredMapTypeFilter) {
      hoveredMapNodeId = null;
      hoveredMapTypeFilter = null;
      syncMapHighlights();
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
        cardEl.innerHTML = formatCardDescHtml(desc.text);
        cardEl.classList.toggle('boosted', desc.damageState === 'boosted' || desc.blockState === 'boosted');
        cardEl.classList.toggle('reduced', desc.damageState === 'reduced' || desc.blockState === 'reduced');
      }
    }

    syncCombatTactics();
  });

  rootEl.addEventListener('mouseleave', () => {
    if (!tooltipPinnedByTap) {
      hideTooltip();
    }
    if (hoveredMapNodeId || hoveredMapTypeFilter) {
      hoveredMapNodeId = null;
      hoveredMapTypeFilter = null;
      syncMapHighlights();
    }
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
    if (tipAnchor && !isRecentTouchInteraction()) {
      showTooltip(tipAnchor, { pinned: false });
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
    if (!tooltipPinnedByTap) {
      hideTooltip();
    }
  });

  let modalTouchLastY = 0;
  let modalTouchLastX = 0;

  rootEl.addEventListener(
    'touchstart',
    (event) => {
      markTouchInteraction();
      if (!(ui.modal || rootEl.querySelector('#modal-backdrop')) || event.touches.length !== 1) return;
      modalTouchLastY = event.touches[0].clientY;
      modalTouchLastX = event.touches[0].clientX;
    },
    { passive: true }
  );

  rootEl.addEventListener(
    'touchmove',
    (event) => {
      if (!(ui.modal || rootEl.querySelector('#modal-backdrop')) || event.touches.length !== 1) return;
      const targetEl = event.target instanceof Element ? event.target : null;
      if (targetEl?.closest('input[type="range"]')) return;

      const touch = event.touches[0];
      const deltaY = touch.clientY - modalTouchLastY;
      const deltaX = touch.clientX - modalTouchLastX;
      modalTouchLastY = touch.clientY;
      modalTouchLastX = touch.clientX;

      const bodyEl = targetEl ? targetEl.closest('.modal-body') : null;
      if (!bodyEl) {
        event.preventDefault();
        return;
      }

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        let cur = targetEl;
        while (cur && cur !== bodyEl) {
          if (cur.scrollWidth > cur.clientWidth + 1) {
            const ovX = window.getComputedStyle(cur).overflowX;
            if (ovX === 'auto' || ovX === 'scroll') return;
          }
          cur = cur.parentElement;
        }
      }

      const maxScrollTop = bodyEl.scrollHeight - bodyEl.clientHeight;
      if (maxScrollTop <= 1) {
        event.preventDefault();
        return;
      }

      const atTop = bodyEl.scrollTop <= 0;
      const atBottom = bodyEl.scrollTop >= maxScrollTop - 1;
      if ((deltaY > 0 && atTop) || (deltaY < 0 && atBottom)) {
        event.preventDefault();
      }
    },
    { passive: false }
  );

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
      const maxForChar = getMaxAscensionForCharacter(meta, nextChar);
      if ((meta.selectedAscension ?? 0) > maxForChar) {
        meta.selectedAscension = maxForChar;
      }
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
      } else if (ui.hudMenuOpen || ui.activePotionPopoverSlot !== null) {
        ui.hudMenuOpen = false;
        ui.activePotionPopoverSlot = null;
        render();
      } else if (ui.selectedCardId || ui.selectedPotionSlot !== null) {
        clearCombatSelection();
        render();
      } else if ((ui.showCharacterSelect || !state) && ui.menuView && ui.menuView !== 'home') {
        ui.menuView = 'home';
        ui.seedDrawerOpen = false;
        soundEngine.play('ui_click');
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
      const activeChoice = getActivePendingCardChoice(state.combat);
      if (activeChoice?.mode === 'scry') {
        if (event.key === 'Enter') {
          event.preventDefault();
          executeConfirmScryWithFx();
          return;
        }
        const scryNum = Number(event.key);
        if (scryNum >= 1 && scryNum <= 9) {
          const cand = activeChoice.candidates?.[scryNum - 1];
          if (cand) {
            executeToggleScryWithFx(cand.instanceId);
          }
        }
        return;
      }

      if (
        activeChoice?.mode === 'discard_to_draw' ||
        activeChoice?.mode === 'retrieve_discard_to_hand' ||
        activeChoice?.mode === 'retrieve_exhaust_to_hand' ||
        activeChoice?.mode === 'pick_from_draw' ||
        activeChoice?.mode === 'omniscience' ||
        activeChoice?.mode === 'discover_card' ||
        activeChoice?.mode === 'wish'
      ) {
        const pickNum = Number(event.key);
        if (pickNum >= 1 && pickNum <= 9) {
          const cand = activeChoice.candidates?.[pickNum - 1];
          if (cand) {
            executeResolveCardChoiceWithFx(cand.instanceId);
          }
        }
        return;
      }

      if (activeChoice?.mode === 'retrieve_discard_retain') {
        if (event.key === 'Enter') {
          event.preventDefault();
          executeConfirmPendingChoiceWithFx();
          return;
        }
        const pickNum = Number(event.key);
        if (pickNum >= 1 && pickNum <= 9) {
          const cand = activeChoice.candidates?.[pickNum - 1];
          if (cand) {
            executeTogglePendingChoiceWithFx(cand.instanceId);
          }
        }
        return;
      }

      if (
        activeChoice?.mode === 'retain' ||
        activeChoice?.mode === 'exhaust_multi' ||
        activeChoice?.mode === 'hand_to_draw_bottom_multi'
      ) {
        if (event.key === 'Enter') {
          event.preventDefault();
          executeConfirmPendingChoiceWithFx();
          return;
        }
        const retainNum = Number(event.key);
        if (retainNum >= 1 && retainNum <= 9) {
          const card = state.combat.hand[retainNum - 1];
          if (card) {
            executeTogglePendingChoiceWithFx(card.instanceId);
          }
        }
        return;
      }

      if ((event.key === 'e' || event.key === 'E') && !hasPendingCardChoice(state.combat)) {
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

  onCardArtLoaded(() => {
    patchRenderedCardArtFrames(rootEl);
  });

  render();
  return {
    getState: () => state,
    getMeta: () => meta,
    getSettings: () => settings,
    getLastCopiedReport: () => ui.lastCopiedReport,
    getLastAudioCue: () => soundEngine.getLastCue(),
    getRecentAudioCues: () => soundEngine.getRecentCues(),
    clearRecentAudioCues: () => soundEngine.clearRecentCues(),
    ensureAllCardArtLoaded,
    isCharacterSelect: () => Boolean(ui.showCharacterSelect || !state),
    render,
    openModal: (modalName) => {
      ui.modal = modalName;
      render();
    },
    initiateScry: (count = 3, sourceName = '预见') => {
      const res = runInitiateScry(state, count, sourceName);
      render();
      return res;
    },
  };
}
