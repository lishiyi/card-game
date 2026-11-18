/**
 * Non-blocking combat visual feedback layer (#spire-fx-layer):
 * - Flying played-card ghost trail
 * - Floating damage / block / heal popups
 * - Shield shatter ring & hit-shake / buff-pulse unit classes
 */

import { ANIM_SPEED_OPTIONS } from './settings.js';

export function createFxManager(rootEl, fxLayerEl, getSettings) {
  function getAnimScale() {
    const settings = getSettings ? getSettings() : null;
    const found = ANIM_SPEED_OPTIONS.find((o) => o.id === settings?.animSpeed);
    return found ? found.scale : 1;
  }

  function applyAnimSpeedAttr() {
    const settings = getSettings ? getSettings() : null;
    const speed = settings?.animSpeed || 'normal';
    const scale = getAnimScale();
    rootEl.dataset.animSpeed = speed;
    rootEl.style.setProperty('--anim-scale', String(scale));
  }

  function captureCombatSnapshot(state) {
    if (!state || state.screen !== 'combat' || !state.combat) return null;
    const playerEl = rootEl.querySelector('#player-unit');
    const playerSnap = {
      hp: state.player.hp,
      block: state.player.block,
      rect: playerEl ? playerEl.getBoundingClientRect() : null,
    };
    const enemies = new Map();
    for (const enemy of state.combat.enemies) {
      const el = rootEl.querySelector(`#enemy-unit-${CSS.escape(enemy.id)}`);
      enemies.set(enemy.id, {
        id: enemy.id,
        name: enemy.name,
        hp: enemy.hp,
        block: enemy.block,
        rect: el ? el.getBoundingClientRect() : null,
      });
    }
    return { player: playerSnap, enemies };
  }

  function spawnElementWithCleanup(el, baseMs) {
    const scale = getAnimScale();
    if (scale <= 0 || !fxLayerEl) return;
    fxLayerEl.appendChild(el);
    const ttl = Math.max(120, Math.round(baseMs * scale) + 80);
    window.setTimeout(() => {
      el.remove();
    }, ttl);
  }

  function spawnFloatingPopup(rect, text, tone = 'damage', stackOffset = 0) {
    const settings = getSettings ? getSettings() : null;
    if (settings && !settings.showDamageNumbers) return;
    if (!rect || (rect.width === 0 && rect.height === 0)) return;
    const scale = getAnimScale();
    if (scale <= 0) return;

    const pop = document.createElement('div');
    pop.className = `fx-float-popup fx-tone-${tone}`;
    pop.textContent = text;
    const jitterX = Math.round((Math.random() - 0.5) * 24);
    const x = Math.round(rect.left + rect.width / 2 + jitterX);
    const y = Math.round(rect.top + rect.height * 0.28 + stackOffset * 24);
    pop.style.left = `${x}px`;
    pop.style.top = `${y}px`;
    spawnElementWithCleanup(pop, 820);
  }

  function spawnShieldBreakBurst(rect) {
    if (!rect || (rect.width === 0 && rect.height === 0)) return;
    const scale = getAnimScale();
    if (scale <= 0) return;

    const ring = document.createElement('div');
    ring.className = 'fx-shield-shatter';
    ring.style.left = `${Math.round(rect.left + rect.width / 2)}px`;
    ring.style.top = `${Math.round(rect.top + rect.height * 0.45)}px`;
    spawnElementWithCleanup(ring, 560);
  }

  function spawnCardFlyFx(cardEl, targetEl, cardStats) {
    const scale = getAnimScale();
    if (scale <= 0 || !cardEl || !fxLayerEl) return;
    const fromRect = cardEl.getBoundingClientRect();
    if (fromRect.width === 0 && fromRect.height === 0) return;

    const toRect = targetEl
      ? targetEl.getBoundingClientRect()
      : {
          left: window.innerWidth * 0.5 - 40,
          top: window.innerHeight * 0.32,
          width: 80,
          height: 80,
        };

    const ghost = document.createElement('div');
    ghost.className = `fx-card-ghost type-${cardStats?.type || 'attack'}`;
    ghost.textContent = cardStats?.name || '出牌';
    const startX = Math.round(fromRect.left + fromRect.width / 2);
    const startY = Math.round(fromRect.top + fromRect.height / 2);
    const dx = Math.round(toRect.left + toRect.width / 2 - startX);
    const dy = Math.round(toRect.top + toRect.height / 2 - startY);

    ghost.style.left = `${startX}px`;
    ghost.style.top = `${startY}px`;
    ghost.style.setProperty('--fly-dx', `${dx}px`);
    ghost.style.setProperty('--fly-dy', `${dy}px`);
    spawnElementWithCleanup(ghost, 420);
  }

  function triggerUnitClass(selector, className, baseMs = 420) {
    const scale = getAnimScale();
    if (scale <= 0) return;
    const el = rootEl.querySelector(selector);
    if (!el) return;
    el.classList.remove(className);
    // Force reflow so rapid consecutive hits re-trigger animation cleanly
    void el.offsetWidth;
    el.classList.add(className);
    window.setTimeout(() => {
      el.classList.remove(className);
    }, Math.max(120, Math.round(baseMs * scale)));
  }

  function reconcileCombatFx(prevSnap, nextState, kind, soundEngine) {
    if (!prevSnap || !nextState) return;

    let playedHit = false;
    let playedShieldBreak = false;
    let playedBlock = false;
    let playedHeal = false;

    // 1. Player diffs
    const nextPlayerEl = rootEl.querySelector('#player-unit');
    const playerRect = nextPlayerEl ? nextPlayerEl.getBoundingClientRect() : prevSnap.player.rect;
    const playerHpDelta = nextState.player.hp - prevSnap.player.hp;
    const playerBlockDelta = nextState.player.block - prevSnap.player.block;
    let pStack = 0;

    if (kind === 'endTurn' && prevSnap.player.block > 0 && playerHpDelta < 0) {
      spawnShieldBreakBurst(playerRect);
      spawnFloatingPopup(playerRect, '护盾击碎!', 'shatter', pStack++);
      triggerUnitClass('#player-unit', 'fx-shield-break', 520);
      playedShieldBreak = true;
    }

    if (playerHpDelta < 0) {
      spawnFloatingPopup(playerRect, `${playerHpDelta}`, 'damage', pStack++);
      triggerUnitClass('#player-unit', 'fx-hit-shake', 420);
      playedHit = true;
    } else if (playerHpDelta > 0) {
      spawnFloatingPopup(playerRect, `+${playerHpDelta} 生命`, 'heal', pStack++);
      triggerUnitClass('#player-unit', 'fx-buff-pulse', 420);
      playedHeal = true;
    }

    if ((kind === 'card' || kind === 'potion') && playerBlockDelta > 0) {
      spawnFloatingPopup(playerRect, `+${playerBlockDelta} 盾`, 'block', pStack++);
      triggerUnitClass('#player-unit', 'fx-buff-pulse', 380);
      playedBlock = true;
    }

    // 2. Enemy diffs
    const nextEnemiesById = new Map();
    if (nextState.combat?.enemies) {
      for (const e of nextState.combat.enemies) {
        nextEnemiesById.set(e.id, e);
      }
    }

    for (const [enemyId, prevEnemy] of prevSnap.enemies.entries()) {
      const nextEnemy = nextEnemiesById.get(enemyId);
      const nextHp = nextEnemy ? nextEnemy.hp : 0;
      const nextBlock = nextEnemy ? nextEnemy.block : 0;
      const domSelector = `#enemy-unit-${CSS.escape(enemyId)}`;
      const domEl = rootEl.querySelector(domSelector);
      const rect = domEl ? domEl.getBoundingClientRect() : prevEnemy.rect;
      let eStack = 0;

      const hpDelta = nextHp - prevEnemy.hp;
      const blockDelta = nextBlock - prevEnemy.block;

      if ((kind === 'card' || kind === 'potion') && prevEnemy.block > 0 && nextBlock === 0 && (blockDelta < 0 || hpDelta < 0)) {
        spawnShieldBreakBurst(rect);
        spawnFloatingPopup(rect, '破盾!', 'shatter', eStack++);
        triggerUnitClass(domSelector, 'fx-shield-break', 520);
        playedShieldBreak = true;
      } else if ((kind === 'card' || kind === 'potion') && blockDelta < 0 && hpDelta === 0) {
        spawnFloatingPopup(rect, `格挡 ${blockDelta}`, 'block', eStack++);
        triggerUnitClass(domSelector, 'fx-hit-shake', 320);
        playedBlock = true;
      }

      if (hpDelta < 0) {
        spawnFloatingPopup(rect, `${hpDelta}`, 'damage', eStack++);
        triggerUnitClass(domSelector, 'fx-hit-shake', 420);
        playedHit = true;
      }

      if (kind === 'endTurn' && blockDelta > 0 && nextBlock > 0) {
        spawnFloatingPopup(rect, `+${nextBlock} 盾`, 'block', eStack++);
      }
    }

    // Play highest-priority combat impact cue
    if (soundEngine) {
      if (nextState.screen === 'reward' || nextState.screen === 'boss_reward' || (nextState.screen === 'game_over' && nextState.runOutcome === 'victory')) {
        soundEngine.play('victory');
      } else if (nextState.screen === 'game_over' && nextState.runOutcome === 'defeat') {
        soundEngine.play('defeat');
      } else if (playedShieldBreak) {
        soundEngine.play('shield_break');
      } else if (playedHit) {
        soundEngine.play('hit');
      } else if (playedHeal) {
        soundEngine.play('heal');
      } else if (playedBlock) {
        soundEngine.play('block');
      }
    }
  }

  return {
    applyAnimSpeedAttr,
    captureCombatSnapshot,
    spawnCardFlyFx,
    reconcileCombatFx,
  };
}
