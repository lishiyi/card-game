/**
 * Combat live DOM interaction layer:
 * 1. Real-time Lethal (斩杀) & Shield-Break (破盾) HP bar projections + badges
 * 2. Real-time Card Selection / Hover / Drag Synergy & Danger Highlights
 * 3. Desktop Pointer Drag-to-Play (curved SVG aiming arrow for single-target, floating ghost & arena drop-zone for self/AoE)
 */

import { getCardStats } from '../data/cards.js';
import { POTION_LIBRARY } from '../data/relics.js';
import { canPlayCard, getAliveEnemies, hasPendingCardChoice } from '../engine/combat.js';
import {
  computeCardSynergies,
  previewCardDamageOnEnemy,
  previewPotionDamageOnEnemy,
} from '../engine/tactics.js';
import { escapeHtml } from './helpers.js';

const DRAG_THRESHOLD_PX = 10;

export function clearCombatTacticsUI(rootEl) {
  if (!rootEl) return;

  rootEl
    .querySelectorAll('.preview-lethal, .preview-poison-lethal, .preview-shield-break, .preview-target-focus')
    .forEach((el) => {
      el.classList.remove(
        'preview-lethal',
        'preview-poison-lethal',
        'preview-shield-break',
        'preview-target-focus'
      );
    });

  rootEl.querySelectorAll('[data-preview-badges]').forEach((el) => {
    el.innerHTML = '';
    el.hidden = true;
  });

  rootEl.querySelectorAll('[data-preview-cut]').forEach((el) => {
    el.style.width = '0%';
    el.style.left = '0%';
    el.classList.remove('lethal-cut', 'poison-cut');
  });

  rootEl
    .querySelectorAll(
      '.synergy-glow-buff, .synergy-glow-warn, .synergy-card-exhaust, .synergy-card-upgrade, .synergy-card-discard'
    )
    .forEach((el) => {
      el.classList.remove(
        'synergy-glow-buff',
        'synergy-glow-warn',
        'synergy-card-exhaust',
        'synergy-card-upgrade',
        'synergy-card-discard'
      );
    });

  const calloutBar = rootEl.querySelector('#synergy-callout-bar');
  if (calloutBar) {
    calloutBar.innerHTML = '';
    calloutBar.hidden = true;
  }
}

function renderEnemyPreviewBadge(rootEl, enemy, preview, isFocused) {
  const unitEl = rootEl.querySelector(`#enemy-unit-${CSS.escape(enemy.id)}`);
  const badgeBox = rootEl.querySelector(`[data-preview-badges="${CSS.escape(enemy.id)}"]`);
  const cutEl = rootEl.querySelector(`[data-preview-cut="${CSS.escape(enemy.id)}"]`);
  if (!unitEl || !badgeBox || !cutEl || !preview) return;

  if (isFocused) {
    unitEl.classList.add('preview-target-focus');
  }

  // Update HP bar projected cut segment (direct damage or lethal poison tick)
  if (enemy.maxHp > 0) {
    if (preview.hpLoss > 0) {
      const startPct = Math.max(0, Math.min(100, (preview.remainingHp / enemy.maxHp) * 100));
      const endPct = Math.max(0, Math.min(100, (enemy.hp / enemy.maxHp) * 100));
      const widthPct = Math.max(2, endPct - startPct);
      cutEl.style.left = `${startPct.toFixed(1)}%`;
      cutEl.style.width = `${widthPct.toFixed(1)}%`;
      cutEl.classList.toggle('lethal-cut', preview.isLethal);
    } else if (preview.projectedPoison > 0 && preview.poisonAdded > 0) {
      const afterPoisonHp = Math.max(0, enemy.hp - preview.projectedPoison);
      const startPct = Math.max(0, Math.min(100, (afterPoisonHp / enemy.maxHp) * 100));
      const endPct = Math.max(0, Math.min(100, (enemy.hp / enemy.maxHp) * 100));
      const widthPct = Math.max(2, endPct - startPct);
      cutEl.style.left = `${startPct.toFixed(1)}%`;
      cutEl.style.width = `${widthPct.toFixed(1)}%`;
      cutEl.classList.add('poison-cut');
    }
  }

  const pills = [];
  if (preview.isLethal) {
    unitEl.classList.add('preview-lethal');
    const bonusParts = [];
    if (preview.goldOnKill > 0) bonusParts.push(`+${preview.goldOnKill}金`);
    if (preview.maxHpOnKill > 0) bonusParts.push(`+${preview.maxHpOnKill}上限`);
    if (preview.fatalPermanentUpgrade) bonusParts.push('+永久升级');
    const bonusNote = bonusParts.length > 0 ? ` ${bonusParts.join(' ')}` : '';
    let label;
    if (preview.isFatalBlockedByMinion) {
      label = preview.isShieldBreak
        ? `破盾击杀 (-${preview.totalDamage} · 爪牙不触发斩杀)`
        : `击杀 (-${preview.totalDamage} · 爪牙不触发斩杀)`;
    } else if (preview.isFatalBlockedNonFinal) {
      label = preview.isShieldBreak
        ? `破盾击倒 (-${preview.totalDamage} · 非斩杀)`
        : `击倒 (-${preview.totalDamage} · 非斩杀)`;
    } else {
      label = preview.isShieldBreak
        ? `破盾斩杀 (-${preview.totalDamage}${bonusNote})`
        : `斩杀 (-${preview.totalDamage}${bonusNote})`;
    }
    pills.push(`<span class="preview-pill lethal" data-preview-kind="lethal">☠ ${escapeHtml(label)}</span>`);
  } else if (preview.isPoisonLethal) {
    unitEl.classList.add('preview-poison-lethal');
    pills.push(
      `<span class="preview-pill poison-lethal" data-preview-kind="poison-lethal">☠ 毒杀 (回合初 -${escapeHtml(preview.projectedPoison)})</span>`
    );
  } else {
    if (preview.isShieldBreak) {
      unitEl.classList.add('preview-shield-break');
      const remNote = preview.hpLoss > 0 ? `余 ${preview.remainingHp} 血` : '护盾击碎';
      pills.push(
        `<span class="preview-pill shield-break" data-preview-kind="shield-break">🛡 破盾 · ${escapeHtml(remNote)}</span>`
      );
    } else if (preview.totalDamage > 0) {
      const note =
        preview.hpLoss > 0
          ? `预计 -${preview.totalDamage} → ${preview.remainingHp} 血`
          : `被格挡 (-${preview.totalDamage} 盾)`;
      pills.push(`<span class="preview-pill dmg-preview" data-preview-kind="damage">${escapeHtml(note)}</span>`);
    }
    if (preview.poisonAdded > 0) {
      pills.push(
        `<span class="preview-pill poison-preview" data-preview-kind="poison">☠ 中毒 +${escapeHtml(preview.poisonAdded)} → ${escapeHtml(preview.projectedPoison)}</span>`
      );
    }
  }

  if (pills.length > 0) {
    badgeBox.innerHTML = pills.join('');
    badgeBox.hidden = false;
  }
}

export function applyCombatTacticsUI(
  rootEl,
  state,
  { activeCardId = null, activePotionSlot = null, hoveredEnemyId = null } = {}
) {
  clearCombatTacticsUI(rootEl);
  if (!rootEl || !state || state.screen !== 'combat' || !state.combat) return;
  if (state.combat.status !== 'ongoing' || state.combat.phase !== 'player') return;
  if (hasPendingCardChoice(state.combat)) return;

  const aliveEnemies = getAliveEnemies(state.combat);
  if (aliveEnemies.length === 0) return;

  // Case A: Damaging / Poison Potion preview
  if (activePotionSlot !== null && activePotionSlot !== undefined) {
    const potionId = state.player.potions[activePotionSlot];
    const pot = potionId ? POTION_LIBRARY[potionId] : null;
    if (
      pot &&
      (typeof pot.damage === 'number' ||
        typeof pot.aoeDamage === 'number' ||
        pot.applyEnemyStatuses?.poison)
    ) {
      const targets =
        pot.target === 'enemy' && hoveredEnemyId
          ? aliveEnemies.filter((e) => e.id === hoveredEnemyId)
          : aliveEnemies;
      for (const enemy of targets) {
        const preview = previewPotionDamageOnEnemy(state, potionId, enemy);
        if (preview) {
          renderEnemyPreviewBadge(
            rootEl,
            enemy,
            preview,
            Boolean(hoveredEnemyId && hoveredEnemyId === enemy.id)
          );
        }
      }
    }
    return;
  }

  if (!activeCardId) return;
  const cardInstance = state.combat.hand.find((c) => c.instanceId === activeCardId);
  if (!cardInstance) return;
  if (!canPlayCard(state, cardInstance.instanceId).playable) return;

  const stats = getCardStats(cardInstance);

  // 1. Apply Lethal / Poison-Lethal / Shield-Break / Damage previews on targeted enemies
  if (stats.target === 'all_enemies' || stats.target === 'enemy') {
    const targets =
      stats.target === 'all_enemies'
        ? aliveEnemies
        : hoveredEnemyId && aliveEnemies.some((e) => e.id === hoveredEnemyId)
          ? aliveEnemies.filter((e) => e.id === hoveredEnemyId)
          : aliveEnemies;

    for (const enemy of targets) {
      const preview = previewCardDamageOnEnemy(state, cardInstance, enemy);
      if (preview) {
        renderEnemyPreviewBadge(
          rootEl,
          enemy,
          preview,
          stats.target === 'all_enemies' || hoveredEnemyId === enemy.id
        );
      }
    }
  }

  // 2. Apply Synergy & Warning Highlights
  const synergies = computeCardSynergies(state, cardInstance, hoveredEnemyId);

  for (const r of synergies.relicHighlights) {
    const relicEl = rootEl.querySelector(`.relic-badge[data-relic-id="${CSS.escape(r.relicId)}"]`);
    if (relicEl) {
      relicEl.classList.add(r.tone === 'warn' ? 'synergy-glow-warn' : 'synergy-glow-buff');
    }
  }

  for (const ps of synergies.playerStatusHighlights) {
    const chipEl = rootEl.querySelector(
      `#player-unit .status-chip[data-status-key="${CSS.escape(ps.key)}"]`
    );
    if (chipEl) {
      chipEl.classList.add(ps.tone === 'warn' ? 'synergy-glow-warn' : 'synergy-glow-buff');
    }
  }

  if (synergies.highlightPlayerBlock) {
    const blockPill = rootEl.querySelector('#player-block-pill');
    if (blockPill) {
      blockPill.classList.add('synergy-glow-buff');
    }
  }

  for (const et of synergies.enemyTriggers) {
    const chipEl = rootEl.querySelector(
      `#enemy-unit-${CSS.escape(et.enemyId)} .status-chip[data-status-key="${CSS.escape(et.statusKey)}"]`
    );
    if (chipEl) {
      chipEl.classList.add(et.tone === 'warn' ? 'synergy-glow-warn' : 'synergy-glow-buff');
    }
  }

  for (const hc of synergies.affectedHandCards) {
    const handCardEl = rootEl.querySelector(`#hand-card-${CSS.escape(hc.instanceId)}`);
    if (handCardEl) {
      const cls =
        hc.tone === 'upgrade'
          ? 'synergy-card-upgrade'
          : hc.tone === 'discard'
            ? 'synergy-card-discard'
            : 'synergy-card-exhaust';
      handCardEl.classList.add(cls);
    }
  }

  const calloutBar = rootEl.querySelector('#synergy-callout-bar');
  if (calloutBar && synergies.callouts.length > 0) {
    calloutBar.innerHTML = synergies.callouts
      .map(
        (c) =>
          `<span class="synergy-callout-pill ${c.tone === 'warn' ? 'warn' : 'buff'}">${escapeHtml(c.text)}</span>`
      )
      .join('');
    calloutBar.hidden = false;
  }
}

/**
 * Desktop & Mobile pointer drag-to-play controller.
 * - Mouse / pen: activates after >= 10px drag in any direction.
 * - Touch: preserves horizontal hand scrolling (cancels on horizontal swipe) and activates
 *   drag-to-play on clear upward swipe (>= 24px upward & steeper than 1.25x horizontal),
 *   lifting the aim point above the thumb so targets & lethal previews stay unobstructed.
 */
export function createCombatDragController({
  rootEl,
  dragLayerEl,
  getState,
  getUi,
  hideTooltip,
  onPlayCard,
  onSyncTactics,
}) {
  let drag = null;
  let suppressNextClickUntil = 0;

  function findHoveredEnemyId(clientX, clientY, isTouch = false) {
    const enemyEls = rootEl.querySelectorAll('[id^="enemy-unit-"][data-enemy-id]:not(.dead)');
    const pad = isTouch ? 14 : 6;
    const probeYs = isTouch ? [clientY - 38, clientY] : [clientY];
    for (const py of probeYs) {
      for (const el of enemyEls) {
        const rect = el.getBoundingClientRect();
        if (
          clientX >= rect.left - pad &&
          clientX <= rect.right + pad &&
          py >= rect.top - pad &&
          py <= rect.bottom + pad
        ) {
          return { enemyId: el.dataset.enemyId, rect };
        }
      }
    }
    return { enemyId: null, rect: null };
  }

  function isInArenaDropZone(clientX, clientY, isTouch = false) {
    const effectiveY = isTouch ? clientY - 30 : clientY;
    const handTray = rootEl.querySelector('#hand-tray');
    const arena = rootEl.querySelector('#combat-arena');
    if (arena) {
      const aRect = arena.getBoundingClientRect();
      if (
        clientX >= aRect.left - 18 &&
        clientX <= aRect.right + 18 &&
        effectiveY >= aRect.top - 28 &&
        effectiveY <= aRect.bottom + 54
      ) {
        return true;
      }
    }
    if (handTray) {
      const hRect = handTray.getBoundingClientRect();
      return effectiveY < hRect.top - 12;
    }
    return false;
  }

  function renderAimArrow(startX, startY, endX, endY, lockedOnEnemy) {
    const midX = (startX + endX) / 2;
    const controlY = Math.min(startY, endY) - Math.max(55, Math.abs(endX - startX) * 0.25);
    const angle = Math.atan2(endY - controlY, endX - midX);
    const headLen = 15;
    const ax1 = endX - headLen * Math.cos(angle - Math.PI / 6);
    const ay1 = endY - headLen * Math.sin(angle - Math.PI / 6);
    const ax2 = endX - headLen * Math.cos(angle + Math.PI / 6);
    const ay2 = endY - headLen * Math.sin(angle + Math.PI / 6);
    const stroke = lockedOnEnemy ? 'hsl(10, 88%, 62%)' : 'hsl(38, 86%, 60%)';

    return `
      <svg class="drag-aim-svg" viewBox="0 0 ${window.innerWidth} ${window.innerHeight}" width="${window.innerWidth}" height="${window.innerHeight}" aria-hidden="true">
        <path
          d="M ${startX.toFixed(1)} ${startY.toFixed(1)} Q ${midX.toFixed(1)} ${controlY.toFixed(1)} ${endX.toFixed(1)} ${endY.toFixed(1)}"
          fill="none"
          stroke="${stroke}"
          stroke-width="${lockedOnEnemy ? 5 : 4}"
          stroke-dasharray="10 7"
          stroke-linecap="round"
          class="drag-aim-path ${lockedOnEnemy ? 'locked' : ''}"
        />
        <polygon
          points="${endX.toFixed(1)},${endY.toFixed(1)} ${ax1.toFixed(1)},${ay1.toFixed(1)} ${ax2.toFixed(1)},${ay2.toFixed(1)}"
          fill="${stroke}"
        />
        <circle cx="${endX.toFixed(1)}" cy="${endY.toFixed(1)}" r="${lockedOnEnemy ? 9 : 5}" fill="none" stroke="${stroke}" stroke-width="2.2" />
      </svg>
    `;
  }

  function cleanupDrag({ restoreTactics = true } = {}) {
    if (!drag) return;
    if (drag.cardEl) {
      drag.cardEl.classList.remove('is-dragging-source', 'is-aiming-source');
    }
    rootEl.querySelectorAll('.drag-target-hover, .drag-enemy-candidate').forEach((el) => {
      el.classList.remove('drag-target-hover', 'drag-enemy-candidate');
    });
    const arena = rootEl.querySelector('#combat-arena');
    if (arena) {
      arena.classList.remove('drag-drop-ready');
      delete arena.dataset.dragPrompt;
    }
    dragLayerEl.innerHTML = '';
    document.body.classList.remove('spire-dragging');
    drag = null;
    if (restoreTactics) {
      onSyncTactics();
    }
  }

  function activateDrag(event) {
    if (!drag || drag.active) return;
    drag.active = true;
    hideTooltip();
    document.body.classList.add('spire-dragging');

    if (drag.stats.target === 'enemy') {
      drag.cardEl.classList.add('is-aiming-source');
      rootEl.querySelectorAll('[id^="enemy-unit-"][data-enemy-id]:not(.dead)').forEach((el) => {
        el.classList.add('drag-enemy-candidate');
      });
    } else {
      drag.cardEl.classList.add('is-dragging-source');
      const ghost = drag.cardEl.cloneNode(true);
      ghost.removeAttribute('id');
      ghost.classList.remove('is-dragging-source', 'selected-card', 'card-deal-in');
      ghost.classList.add('drag-card-ghost');
      ghost.style.width = `${Math.round(drag.originRect.width)}px`;
      dragLayerEl.innerHTML = '';
      dragLayerEl.appendChild(ghost);
      drag.ghostEl = ghost;
    }

    updateDragPosition(event.clientX, event.clientY);
  }

  function updateDragPosition(clientX, clientY) {
    if (!drag || !drag.active) return;
    const state = getState();
    const aliveEnemies = getAliveEnemies(state.combat);
    const arena = rootEl.querySelector('#combat-arena');
    const isTouch = Boolean(drag.isTouch);
    const visualY = isTouch ? clientY - 40 : clientY;

    if (drag.stats.target === 'enemy') {
      const hit = findHoveredEnemyId(clientX, clientY, isTouch);
      const inArenaSingle =
        !hit.enemyId && aliveEnemies.length === 1 && isInArenaDropZone(clientX, clientY, isTouch);
      const effectiveEnemyId = hit.enemyId || (inArenaSingle ? aliveEnemies[0].id : null);
      drag.hoveredEnemyId = effectiveEnemyId;

      rootEl.querySelectorAll('.drag-target-hover').forEach((el) => {
        el.classList.remove('drag-target-hover');
      });

      let targetX = clientX;
      let targetY = visualY;
      if (effectiveEnemyId) {
        const enemyEl = rootEl.querySelector(`#enemy-unit-${CSS.escape(effectiveEnemyId)}`);
        if (enemyEl) {
          enemyEl.classList.add('drag-target-hover');
          const eRect = enemyEl.getBoundingClientRect();
          targetX = eRect.left + eRect.width / 2;
          targetY = eRect.top + eRect.height * 0.44;
        }
      }

      const originX = drag.originRect.left + drag.originRect.width / 2;
      const originY = drag.originRect.top + 14;
      dragLayerEl.innerHTML = renderAimArrow(
        originX,
        originY,
        targetX,
        targetY,
        Boolean(effectiveEnemyId)
      );

      onSyncTactics({
        activeCardId: drag.instanceId,
        hoveredEnemyId: effectiveEnemyId,
      });
    } else {
      const ready = isInArenaDropZone(clientX, clientY, isTouch);
      drag.dropReady = ready;
      if (arena) {
        arena.classList.toggle('drag-drop-ready', ready);
        if (ready) {
          arena.dataset.dragPrompt = `松手打出【${drag.stats.name}】`;
        } else {
          delete arena.dataset.dragPrompt;
        }
      }
      if (drag.ghostEl) {
        const dx = clientX - drag.lastX;
        const tilt = Math.max(-14, Math.min(14, dx * 0.45));
        drag.ghostEl.style.left = `${Math.round(clientX)}px`;
        drag.ghostEl.style.top = `${Math.round(visualY)}px`;
        drag.ghostEl.style.transform = `translate(-50%, -56%) rotate(${tilt.toFixed(1)}deg) scale(${ready ? 1.05 : 0.96})`;
        drag.ghostEl.classList.toggle('ready-to-drop', ready);
      }
      onSyncTactics({
        activeCardId: drag.instanceId,
        hoveredEnemyId: null,
      });
    }

    drag.lastX = clientX;
    drag.lastY = clientY;
  }

  rootEl.addEventListener('pointerdown', (event) => {
    const isTouch = event.pointerType === 'touch';
    if (!isTouch && event.button !== 0) return;
    const state = getState();
    const ui = getUi();
    if (
      ui.modal ||
      !state ||
      state.screen !== 'combat' ||
      !state.combat ||
      state.combat.phase !== 'player' ||
      hasPendingCardChoice(state.combat)
    ) {
      return;
    }

    const targetEl = event.target instanceof Element ? event.target : null;
    if (targetEl?.closest('.card-kw-trigger')) return;
    const cardEl = targetEl ? targetEl.closest('#hand-tray .game-card.playable[data-instance-id]') : null;
    if (!cardEl) return;

    const instanceId = cardEl.dataset.instanceId;
    if (!canPlayCard(state, instanceId).playable) return;
    const cardObj = state.combat.hand.find((c) => c.instanceId === instanceId);
    if (!cardObj) return;

    drag = {
      pointerId: event.pointerId,
      isTouch,
      instanceId,
      cardEl,
      stats: getCardStats(cardObj),
      originRect: cardEl.getBoundingClientRect(),
      startX: event.clientX,
      startY: event.clientY,
      lastX: event.clientX,
      lastY: event.clientY,
      active: false,
      hoveredEnemyId: null,
      dropReady: false,
      ghostEl: null,
    };
  });

  let trayTouch = null;

  rootEl.addEventListener(
    'touchstart',
    (event) => {
      if (event.touches.length !== 1) {
        trayTouch = null;
        return;
      }
      const t = event.touches[0];
      const targetEl = event.target instanceof Element ? event.target : null;
      const tray = targetEl ? targetEl.closest('#hand-tray') : null;
      if (!tray) {
        trayTouch = null;
        return;
      }
      trayTouch = {
        tray,
        startX: t.clientX,
        startY: t.clientY,
        lastX: t.clientX,
        lastY: t.clientY,
        lockedAxis: null,
      };
    },
    { passive: true }
  );

  window.addEventListener('pointermove', (event) => {
    if (!drag || event.pointerId !== drag.pointerId) return;
    if (!drag.active) {
      const dx = event.clientX - drag.startX;
      const dy = event.clientY - drag.startY;
      if (drag.isTouch) {
        const absDx = Math.abs(dx);
        const absDy = Math.abs(dy);
        // Horizontal swipe -> hand-out immediately to native horizontal hand-tray scrolling!
        if (absDx >= 7 && absDx >= absDy * 0.75) {
          drag = null;
          return;
        }
        // Clear upward swipe -> lift & drag-play card!
        if (drag.startY - event.clientY >= 24 && drag.startY - event.clientY > absDx * 1.25) {
          activateDrag(event);
        }
        return;
      }
      const dist = Math.hypot(dx, dy);
      if (dist < DRAG_THRESHOLD_PX) return;
      activateDrag(event);
      return;
    }
    updateDragPosition(event.clientX, event.clientY);
  });

  // 1) Prevent browser pull-to-refresh / vertical scroll while actively dragging a card by touch
  // 2) Prevent horizontal page panning / iOS Safari rubber-band overscroll when swiping #hand-tray past its edges
  window.addEventListener(
    'touchmove',
    (event) => {
      if (drag && drag.active && drag.isTouch) {
        event.preventDefault();
        return;
      }
      if (!trayTouch || event.touches.length !== 1) return;
      const t = event.touches[0];
      const totalDx = t.clientX - trayTouch.startX;
      const totalDy = t.clientY - trayTouch.startY;
      const stepDx = t.clientX - trayTouch.lastX;
      trayTouch.lastX = t.clientX;
      trayTouch.lastY = t.clientY;

      if (!trayTouch.lockedAxis && (Math.abs(totalDx) >= 5 || Math.abs(totalDy) >= 5)) {
        trayTouch.lockedAxis = Math.abs(totalDx) >= Math.abs(totalDy) ? 'x' : 'y';
      }

      if (trayTouch.lockedAxis === 'x') {
        const tray = trayTouch.tray;
        const maxScroll = Math.max(0, tray.scrollWidth - tray.clientWidth);
        const atLeftEdge = tray.scrollLeft <= 0 && stepDx >= 1;
        const atRightEdge = tray.scrollLeft >= maxScroll - 1 && stepDx <= -1;
        if (maxScroll <= 0 || atLeftEdge || atRightEdge) {
          event.preventDefault();
        }
      }
    },
    { passive: false }
  );

  const clearTrayTouch = () => {
    trayTouch = null;
  };
  window.addEventListener('touchend', clearTrayTouch, { passive: true });
  window.addEventListener('touchcancel', clearTrayTouch, { passive: true });

  function finishDrag(event, cancelled = false) {
    if (!drag) return;
    if (event && event.pointerId !== undefined && event.pointerId !== drag.pointerId) return;

    const wasActive = drag.active;
    const instanceId = drag.instanceId;
    const targetType = drag.stats.target;
    const hoveredEnemyId = drag.hoveredEnemyId;
    const dropReady = drag.dropReady;

    if (!wasActive) {
      drag = null;
      return;
    }

    suppressNextClickUntil = Date.now() + 260;
    cleanupDrag({ restoreTactics: false });

    if (cancelled) {
      onSyncTactics();
      return;
    }

    if (targetType === 'enemy') {
      if (hoveredEnemyId) {
        onPlayCard(instanceId, hoveredEnemyId);
        return;
      }
    } else if (dropReady) {
      onPlayCard(instanceId, null);
      return;
    }

    onSyncTactics();
  }

  window.addEventListener('pointerup', (event) => finishDrag(event, false));
  window.addEventListener('pointercancel', (event) => finishDrag(event, true));

  return {
    isDragging: () => Boolean(drag && drag.active),
    cancel: () => finishDrag(null, true),
    shouldSuppressClick: () => Date.now() < suppressNextClickUntil,
  };
}
