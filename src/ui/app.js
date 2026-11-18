/**
 * Main UI controller orchestrating modular screens, non-blocking FX, Web Audio SFX,
 * hover + touch tooltips, settings, seed sharing, and keyboard shortcuts.
 */

import { formatCardDescription, getCardStats } from '../data/cards.js';
import { TOTAL_FLOORS } from '../data/events.js';
import { POTION_LIBRARY } from '../data/relics.js';
import { canPlayCard, getAliveEnemies } from '../engine/combat.js';
import {
  buyShopCard,
  buyShopPotion,
  buyShopPurge,
  buyShopRelic,
  cancelEventPurge,
  chooseEventOption,
  claimBossRelic,
  claimRewardCard,
  claimRewardGold,
  claimRewardPotion,
  claimRewardRelic,
  completeEventCardAction,
  completeEventPurge,
  continueFromEvent,
  createNewRun,
  discardPotion,
  leaveRestSite,
  leaveShop,
  leaveTreasureRoom,
  openTreasureChest,
  pickEventLibraryCard,
  proceedFromReward,
  proceedToNextAct,
  restHeal,
  restUpgradeCard,
  runEndTurn,
  runPlayCard,
  runRestartCombat,
  runUsePotion,
  selectMapNode,
  settleAct1Victory,
  STARTER_POTION_SLOTS,
} from '../engine/game.js';
import {
  loadSavedMeta,
  MAX_ASCENSION,
  recordCompletedRun,
  saveMeta,
  UNLOCK_TIERS,
} from '../engine/meta.js';
import { formatSeedCode, parseSeedInput } from '../engine/rng.js';
import { createSoundEngine } from './audio.js';
import { createFxManager } from './fx.js';
import { escapeHtml } from './helpers.js';
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
      if (!Array.isArray(parsed.player.potions)) {
        parsed.player.potions = ['fire_potion', null, null];
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
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage quota errors
  }
}

export function mountSpireApp(rootEl) {
  let meta = loadSavedMeta();
  let settings = loadSettings();

  function buildNewRunOptions(overrides = {}) {
    return {
      ascension: overrides.ascension ?? meta.selectedAscension ?? 0,
      unlockedTier: meta.unlockedTier ?? 0,
      unlockAllOverride: Boolean(meta.unlockAllOverride),
      ...overrides,
    };
  }

  let state = loadSavedRun() || createNewRun(buildNewRunOptions());
  let lastGameOverSummary = null;

  rootEl.innerHTML = '';
  const stageRoot = document.createElement('div');

  const fxLayerEl = document.createElement('div');
  fxLayerEl.id = 'spire-fx-layer';
  fxLayerEl.className = 'spire-fx-layer';
  fxLayerEl.setAttribute('aria-hidden', 'true');

  const tooltipEl = document.createElement('div');
  tooltipEl.id = 'spire-tooltip';
  tooltipEl.className = 'spire-tooltip';
  tooltipEl.setAttribute('role', 'tooltip');
  tooltipEl.hidden = true;

  rootEl.append(stageRoot, fxLayerEl, tooltipEl);

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
    selectedCardId: null,
    selectedPotionSlot: null,
    hoveredEnemyId: null,
    modal: null,
    helpTab: 'glossary',
    glossaryCategory: 'all',
    glossaryQuery: '',
    seedInput: '',
    notice: '',
    noticeTone: 'normal',
  };

  function clearCombatSelection() {
    ui.selectedCardId = null;
    ui.selectedPotionSlot = null;
    ui.hoveredEnemyId = null;
  }

  function setNotice(msg, tone = 'normal') {
    ui.notice = msg || '';
    ui.noticeTone = tone;
  }

  function ensureRunRecorded() {
    const currentRunKey = `${state.seed}_${state.stats?.floorsCleared ?? 0}_${state.runOutcome ?? 'end'}`;
    if (!lastGameOverSummary || lastGameOverSummary.runKey !== currentRunKey) {
      const rec = recordCompletedRun(meta, state);
      saveMeta(meta);
      lastGameOverSummary = { runKey: currentRunKey, ...rec };
    }
    return lastGameOverSummary;
  }

  function sanitizeUiState() {
    if (state.screen !== 'combat' || !state.combat) {
      clearCombatSelection();
      return;
    }
    if (ui.selectedCardId && !state.combat.hand.some((c) => c.instanceId === ui.selectedCardId)) {
      ui.selectedCardId = null;
    }
    if (ui.selectedPotionSlot !== null && !state.player.potions[ui.selectedPotionSlot]) {
      ui.selectedPotionSlot = null;
    }
    if (
      ui.hoveredEnemyId &&
      !state.combat.enemies.some((e) => e.id === ui.hoveredEnemyId && e.hp > 0)
    ) {
      ui.hoveredEnemyId = null;
    }
  }

  function getPreviewTargetEnemy() {
    if (state.screen !== 'combat' || !state.combat) return null;
    const alive = getAliveEnemies(state.combat);
    if (ui.hoveredEnemyId) {
      const hovered = alive.find((e) => e.id === ui.hoveredEnemyId);
      if (hovered) return hovered;
    }
    if (alive.length === 1) return alive[0];
    return null;
  }

  function render() {
    hideTooltip();
    sanitizeUiState();
    fxManager.applyAnimSpeedAttr();
    persistRun(state);

    let mainHtml = '';
    switch (state.screen) {
      case 'map':
        mainHtml = renderMapScreen({ state, settings, ui });
        break;
      case 'combat':
        mainHtml = renderCombatScreen({ state, ui, getPreviewTargetEnemy });
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

    stageRoot.innerHTML = `
      <div class="spire-shell">
        ${renderTopHud({ state, ui })}
        <main class="stage-viewport">
          ${mainHtml}
        </main>
      </div>
      ${renderModal({ state, meta, settings, ui })}
    `;
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
    if (state.screen !== 'combat' || !state.combat) return;
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

    const targetId = stats.target === 'enemy' ? alive[0]?.id ?? null : null;
    executeCardPlayWithFx(instanceId, targetId);
  }

  function handleEnemyClick(enemyId) {
    if (state.screen !== 'combat' || !state.combat) return;

    if (ui.selectedCardId) {
      executeCardPlayWithFx(ui.selectedCardId, enemyId);
      return;
    }

    if (ui.selectedPotionSlot !== null) {
      executePotionWithFx(ui.selectedPotionSlot, enemyId);
    }
  }

  async function copySeedToClipboard(seedCode) {
    const code = seedCode || formatSeedCode(state.seed);
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
      }
    } catch {
      // Clipboard API may be restricted in non-HTTPS contexts; notice still displays code
    }
    ui.seedInput = code;
    soundEngine.play('ui_click');
    setNotice(`已复制种子代码【${code}】！可在“进阶/生涯 → 用种子开局”中粘贴同图挑战。`);
    render();
  }

  function startSeededRunFromInput() {
    const inputEl = rootEl.querySelector('#seed-input-box');
    const rawVal = inputEl ? inputEl.value : ui.seedInput;
    ui.seedInput = rawVal || '';
    const parsedSeed = parseSeedInput(rawVal);
    if (parsedSeed === null) {
      soundEngine.play('ui_click');
      if (inputEl) inputEl.focus();
      return;
    }
    state = createNewRun(buildNewRunOptions({ seed: parsedSeed }));
    lastGameOverSummary = null;
    ui.modal = null;
    clearCombatSelection();
    soundEngine.play('upgrade');
    setNotice(`已按指定种子【${formatSeedCode(state.seed)}】开启新的一局！`);
    render();
  }

  rootEl.addEventListener('click', (event) => {
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
    if (action === 'close-modal-backdrop' && event.target !== target) {
      return;
    }

    switch (action) {
      case 'new-run':
      case 'start-ascension-run': {
        state = createNewRun(buildNewRunOptions());
        lastGameOverSummary = null;
        ui.modal = null;
        clearCombatSelection();
        soundEngine.play('ui_click');
        setNotice('');
        render();
        break;
      }
      case 'start-seeded-run': {
        startSeededRunFromInput();
        break;
      }
      case 'replay-history-seed': {
        const seedVal = parseSeedInput(target.dataset.seed);
        const maxAllowed = meta.unlockAllOverride ? MAX_ASCENSION : meta.maxAscensionUnlocked ?? 0;
        const reqAsc = Number(target.dataset.ascension ?? 0);
        const safeAsc = Number.isFinite(reqAsc)
          ? Math.max(0, Math.min(maxAllowed, Math.floor(reqAsc)))
          : 0;
        meta.selectedAscension = safeAsc;
        saveMeta(meta);
        state = createNewRun(
          buildNewRunOptions({
            seed: seedVal ?? undefined,
            ascension: safeAsc,
          })
        );
        lastGameOverSummary = null;
        ui.modal = null;
        clearCombatSelection();
        soundEngine.play('upgrade');
        setNotice(`已按种子【${formatSeedCode(state.seed)}】开启同图挑战！`);
        render();
        break;
      }
      case 'copy-seed': {
        copySeedToClipboard(target.dataset.seedCode);
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
        ui.modal = null;
        soundEngine.play('ui_click');
        render();
        break;
      }
      case 'select-node': {
        if (target.getAttribute('aria-disabled') === 'true') break;
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
        restHeal(state);
        soundEngine.play('heal');
        setNotice('');
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
    } else if (target.id === 'seed-input-box' && target instanceof HTMLInputElement) {
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

  // Instant hover tooltips + map route highlight + selected card's live damage preview in-place
  rootEl.addEventListener('mouseover', (event) => {
    const targetEl = event.target instanceof Element ? event.target : null;
    const tipAnchor = targetEl ? targetEl.closest('[data-tooltip-desc]') : null;
    if (tipAnchor) {
      showTooltip(tipAnchor);
    } else {
      hideTooltip();
    }

    if (state.screen === 'map') {
      const mapBtn = targetEl ? targetEl.closest('.map-node-btn[data-node-id]') : null;
      updateHoveredMapEdges(mapBtn ? mapBtn.dataset.nodeId : null);
      return;
    }

    if (hoveredMapNodeId) {
      updateHoveredMapEdges(null);
    }

    if (state.screen !== 'combat' || !state.combat) return;
    const enemyEl = targetEl ? targetEl.closest('[data-enemy-id]') : null;
    const nextHover = enemyEl ? enemyEl.dataset.enemyId : null;
    if (nextHover === ui.hoveredEnemyId) return;
    ui.hoveredEnemyId = nextHover;

    if (ui.selectedCardId) {
      const selectedCard = state.combat.hand.find((c) => c.instanceId === ui.selectedCardId);
      const cardEl = rootEl.querySelector(`#hand-card-${CSS.escape(ui.selectedCardId)} .card-desc`);
      if (selectedCard && cardEl) {
        const desc = formatCardDescription(selectedCard, {
          player: state.player,
          targetEnemy: getPreviewTargetEnemy(),
        });
        cardEl.textContent = desc.text;
        cardEl.classList.toggle('boosted', desc.damageState === 'boosted' || desc.blockState === 'boosted');
        cardEl.classList.toggle('reduced', desc.damageState === 'reduced' || desc.blockState === 'reduced');
      }
    }
  });

  rootEl.addEventListener('mouseleave', () => {
    hideTooltip();
    updateHoveredMapEdges(null);
  });

  rootEl.addEventListener('focusin', (event) => {
    const targetEl = event.target instanceof Element ? event.target : null;
    const tipAnchor = targetEl ? targetEl.closest('[data-tooltip-desc]') : null;
    if (tipAnchor) {
      showTooltip(tipAnchor);
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
    if (event.key === 'Enter' && event.target instanceof HTMLInputElement && event.target.id === 'seed-input-box') {
      event.preventDefault();
      startSeededRunFromInput();
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

  // Keyboard shortcuts: 1-9 play/select hand cards, E ends turn, D opens deck, H/? opens help, Escape cancels
  window.addEventListener('keydown', (event) => {
    if (event.target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName)) {
      if (event.key === 'Escape' && ui.modal) {
        ui.modal = null;
        render();
      }
      return;
    }

    if (event.key === 'Escape') {
      if (ui.modal) {
        ui.modal = null;
        render();
      } else if (ui.selectedCardId || ui.selectedPotionSlot !== null) {
        clearCombatSelection();
        render();
      }
      return;
    }

    if (ui.modal) return;

    if (event.key === 'd' || event.key === 'D') {
      ui.modal = 'deck';
      render();
      return;
    }

    if (event.key === 'h' || event.key === 'H' || event.key === '?') {
      ui.modal = 'help';
      render();
      return;
    }

    if (state.screen === 'combat' && state.combat?.phase === 'player') {
      if (event.key === 'e' || event.key === 'E') {
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
    render,
    openModal: (modalName) => {
      ui.modal = modalName;
      render();
    },
  };
}
