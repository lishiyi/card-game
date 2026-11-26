/**
 * Non-blocking combat visual feedback layer (#spire-fx-layer):
 * - Flying played-card ghost trail
 * - Floating damage / block / heal / poison / stance popups
 * - Bespoke SVG impact overlays (slash, heavy cleave, shiv dart, venom splash, divine burst, block aegis, exhaust ash, KO shatter, stance rings)
 * - Attacker lunge, hit-flash, heavy shake, KO dissolve & audio escalation
 */

import { escapeHtml, renderCardHtml } from './helpers.js';
import { ANIM_SPEED_OPTIONS } from './settings.js';

const IMPACT_SVG_TEMPLATES = Object.freeze({
  slash: `<svg viewBox="0 0 120 120" class="fx-impact-svg-el" aria-hidden="true">
    <path class="fx-slash-arc" d="M18 96 Q54 44 106 18" fill="none" stroke="hsl(38, 100%, 82%)" stroke-width="7" stroke-linecap="round"/>
    <path class="fx-slash-arc-inner" d="M24 98 Q58 50 104 24" fill="none" stroke="hsl(10, 96%, 60%)" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M84 22 L98 12 M72 34 L86 28 M34 78 L22 92" stroke="hsl(48, 100%, 86%)" stroke-width="2.4" stroke-linecap="round"/>
  </svg>`,
  heavy: `<svg viewBox="0 0 120 120" class="fx-impact-svg-el" aria-hidden="true">
    <circle class="fx-shock-ring" cx="60" cy="60" r="40" fill="none" stroke="hsl(24, 100%, 64%)" stroke-width="5"/>
    <path class="fx-slash-arc" d="M12 98 Q54 46 108 14" fill="none" stroke="hsl(44, 100%, 84%)" stroke-width="9" stroke-linecap="round"/>
    <path class="fx-slash-arc-inner" d="M18 20 Q60 56 104 98" fill="none" stroke="hsl(6, 98%, 58%)" stroke-width="7" stroke-linecap="round"/>
    <polygon points="60,26 67,50 92,48 70,64 80,90 60,72 40,90 50,64 28,48 53,50" fill="hsla(46, 100%, 80%, 0.78)"/>
  </svg>`,
  shiv: `<svg viewBox="0 0 120 120" class="fx-impact-svg-el" aria-hidden="true">
    <path class="fx-slash-arc" d="M10 46 L108 38" fill="none" stroke="hsl(148, 100%, 74%)" stroke-width="4.5" stroke-linecap="round"/>
    <path class="fx-slash-arc-inner" d="M16 74 L106 60" fill="none" stroke="hsl(164, 96%, 84%)" stroke-width="3.4" stroke-linecap="round"/>
    <polygon points="94,32 114,38 95,46" fill="hsl(144, 100%, 82%)"/>
    <polygon points="92,54 112,60 94,68" fill="hsl(152, 100%, 84%)"/>
  </svg>`,
  poison: `<svg viewBox="0 0 120 120" class="fx-impact-svg-el" aria-hidden="true">
    <circle class="fx-shock-ring" cx="60" cy="64" r="32" fill="hsla(132, 92%, 44%, 0.22)" stroke="hsl(126, 96%, 62%)" stroke-width="3.2"/>
    <path d="M60 22 Q72 42 60 54 Q48 42 60 22 Z" fill="hsl(124, 96%, 62%)"/>
    <path d="M32 54 Q40 68 32 76 Q24 68 32 54 Z" fill="hsl(138, 92%, 56%)"/>
    <path d="M88 48 Q96 62 88 70 Q80 62 88 48 Z" fill="hsl(118, 96%, 64%)"/>
    <circle cx="48" cy="78" r="5" fill="hsl(116, 100%, 74%)"/>
    <circle cx="76" cy="82" r="4" fill="hsl(132, 96%, 68%)"/>
    <circle cx="62" cy="90" r="3.2" fill="hsl(112, 100%, 78%)"/>
  </svg>`,
  divine: `<svg viewBox="0 0 120 120" class="fx-impact-svg-el" aria-hidden="true">
    <circle class="fx-shock-ring" cx="60" cy="60" r="38" fill="hsla(292, 92%, 64%, 0.16)" stroke="hsl(46, 100%, 76%)" stroke-width="3.4"/>
    <path d="M60 8 L67 48 L108 60 L67 72 L60 112 L53 72 L12 60 L53 48 Z" fill="hsla(48, 100%, 84%, 0.85)" stroke="hsl(292, 94%, 72%)" stroke-width="2"/>
    <circle cx="60" cy="60" r="11" fill="hsl(52, 100%, 96%)"/>
  </svg>`,
  block: `<svg viewBox="0 0 120 120" class="fx-impact-svg-el" aria-hidden="true">
    <path class="fx-shock-ring" d="M60 14 L98 30 V62 C98 84 82 99 60 108 C38 99 22 84 22 62 V30 Z" fill="hsla(198, 92%, 60%, 0.2)" stroke="hsl(196, 98%, 74%)" stroke-width="4.2"/>
    <path d="M60 28 V86 M38 56 H82" stroke="hsla(196, 100%, 88%, 0.82)" stroke-width="3.2" stroke-linecap="round"/>
  </svg>`,
  heal: `<svg viewBox="0 0 120 120" class="fx-impact-svg-el" aria-hidden="true">
    <circle class="fx-shock-ring" cx="60" cy="60" r="34" fill="hsla(146, 86%, 54%, 0.16)" stroke="hsl(144, 92%, 68%)" stroke-width="3"/>
    <path d="M60 30 V90 M30 60 H90" stroke="hsl(146, 98%, 78%)" stroke-width="7" stroke-linecap="round"/>
    <circle cx="34" cy="34" r="4" fill="hsl(48, 100%, 80%)"/>
    <circle cx="86" cy="38" r="3.5" fill="hsl(146, 100%, 82%)"/>
    <circle cx="78" cy="86" r="3.5" fill="hsl(48, 100%, 80%)"/>
  </svg>`,
  exhaust: `<svg viewBox="0 0 120 120" class="fx-impact-svg-el" aria-hidden="true">
    <path class="fx-shock-ring" d="M30 92 Q48 56 40 30 M60 98 Q74 58 60 22 M90 92 Q76 58 84 32" fill="none" stroke="hsl(288, 86%, 72%)" stroke-width="4" stroke-linecap="round" stroke-dasharray="10 6"/>
    <circle cx="44" cy="40" r="4" fill="hsl(32, 100%, 68%)"/>
    <circle cx="72" cy="30" r="3.5" fill="hsl(292, 96%, 76%)"/>
    <circle cx="60" cy="54" r="4.5" fill="hsl(24, 100%, 64%)"/>
  </svg>`,
  ko: `<svg viewBox="0 0 120 120" class="fx-impact-svg-el" aria-hidden="true">
    <circle class="fx-shock-ring" cx="60" cy="60" r="44" fill="hsla(12, 96%, 54%, 0.22)" stroke="hsl(44, 100%, 76%)" stroke-width="4.5" stroke-dasharray="14 8"/>
    <path d="M22 22 L48 48 M98 22 L72 48 M22 98 L48 72 M98 98 L72 72" stroke="hsl(46, 100%, 84%)" stroke-width="4.5" stroke-linecap="round"/>
    <polygon points="60,34 68,54 88,60 68,66 60,86 52,66 32,60 52,54" fill="hsl(48, 100%, 88%)"/>
  </svg>`,
  stance_calm: `<svg viewBox="0 0 120 120" class="fx-impact-svg-el" aria-hidden="true">
    <circle class="fx-shock-ring" cx="60" cy="60" r="44" fill="hsla(194, 96%, 60%, 0.18)" stroke="hsl(192, 100%, 76%)" stroke-width="4"/>
    <circle cx="60" cy="60" r="28" fill="none" stroke="hsl(210, 96%, 82%)" stroke-width="2.4" stroke-dasharray="8 5"/>
  </svg>`,
  stance_wrath: `<svg viewBox="0 0 120 120" class="fx-impact-svg-el" aria-hidden="true">
    <circle class="fx-shock-ring" cx="60" cy="60" r="44" fill="hsla(4, 96%, 52%, 0.24)" stroke="hsl(12, 100%, 66%)" stroke-width="4.8"/>
    <polygon points="60,12 72,38 102,36 80,60 98,88 68,80 60,108 52,80 22,88 40,60 18,36 48,38" fill="none" stroke="hsl(42, 100%, 74%)" stroke-width="2.6"/>
  </svg>`,
  stance_divinity: `<svg viewBox="0 0 120 120" class="fx-impact-svg-el" aria-hidden="true">
    <circle class="fx-shock-ring" cx="60" cy="60" r="46" fill="hsla(46, 100%, 64%, 0.22)" stroke="hsl(46, 100%, 78%)" stroke-width="4.5"/>
    <circle cx="60" cy="60" r="32" fill="none" stroke="hsl(292, 96%, 76%)" stroke-width="3" stroke-dasharray="10 5"/>
    <path d="M60 10 L66 48 L110 60 L66 72 L60 110 L54 72 L10 60 L54 48 Z" fill="hsla(50, 100%, 88%, 0.55)"/>
  </svg>`,
});

const POSITIVE_BUFF_KEYS = new Set([
  'strength',
  'dexterity',
  'metallicize',
  'thorns',
  'plated_armor',
  'intangible',
  'artifact',
  'vigor',
  'barricade',
  'demon_form',
  'juggernaut',
  'feel_no_pain',
  'dark_embrace',
  'corruption',
  'evolve',
  'fire_breathing',
  'rupture',
  'combust',
  'noxious_fumes',
  'after_image',
  'thousand_cuts',
  'envenom',
  'accuracy',
  'infinite_blades',
  'well_laid_plans',
  'tools_of_the_trade',
  'rushdown',
  'mental_fortress',
  'like_water',
  'foresight',
  'nirvana',
  'devotion',
  'battle_hymn',
  'establishment',
  'study',
  'deva_form',
  'master_reality',
  'energized',
  'freeAttackPower',
  'blur',
  'double_tap',
  'burst',
  'phantasmal',
  'omega',
]);

const NEGATIVE_DEBUFF_KEYS = new Set(['vulnerable', 'weak', 'frail', 'mark', 'constricted', 'entangled']);

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

  function getRectPair(el) {
    if (!el) return { rect: null, figRect: null };
    const figEl = el.querySelector('.unit-figure');
    return {
      rect: el.getBoundingClientRect(),
      figRect: figEl ? figEl.getBoundingClientRect() : el.getBoundingClientRect(),
    };
  }

  const pendingTimers = new Set();

  function scheduleFxTimer(fn, ms) {
    const id = window.setTimeout(() => {
      pendingTimers.delete(id);
      fn();
    }, ms);
    pendingTimers.add(id);
    return id;
  }

  function clearPendingFx() {
    for (const id of pendingTimers) {
      window.clearTimeout(id);
    }
    pendingTimers.clear();
  }

  function captureCombatSnapshot(state) {
    if (!state || state.screen !== 'combat' || !state.combat) return null;
    const playerEl = rootEl.querySelector('#player-unit');
    const pRects = getRectPair(playerEl);
    const playerSnap = {
      hp: state.player.hp,
      block: state.player.block,
      stance: state.combat.stance || state.player.stance || 'neutral',
      statuses: { ...(state.player.statuses || {}) },
      rect: pRects.rect,
      figRect: pRects.figRect,
    };
    const enemies = new Map();
    for (const enemy of state.combat.enemies) {
      const el = rootEl.querySelector(`#enemy-unit-${CSS.escape(enemy.id)}`);
      const eRects = getRectPair(el);
      enemies.set(enemy.id, {
        id: enemy.id,
        name: enemy.name,
        hp: enemy.hp,
        block: enemy.block,
        dead: enemy.hp <= 0,
        intentType: enemy.intent?.type || '',
        statuses: { ...(enemy.statuses || {}) },
        rect: eRects.rect,
        figRect: eRects.figRect,
      });
    }
    const handCardRects = [];
    const handEls = rootEl.querySelectorAll('#hand-tray .game-card');
    for (const cardEl of handEls) {
      if (handCardRects.length >= 6) break;
      const r = cardEl.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) {
        handCardRects.push({
          left: r.left,
          top: r.top,
          width: r.width,
          height: r.height,
        });
      }
    }
    const discardBtn = rootEl.querySelector('#btn-discard-pile');
    const drawBtn = rootEl.querySelector('#btn-draw-pile');
    return {
      player: playerSnap,
      enemies,
      exhaustCount: state.combat.exhaustPile?.length ?? 0,
      handCount: state.combat.hand?.length ?? 0,
      handInstanceIds: new Set((state.combat.hand || []).map((c) => String(c.instanceId))),
      handCardRects,
      discardPileRect: discardBtn ? discardBtn.getBoundingClientRect() : null,
      drawPileRect: drawBtn ? drawBtn.getBoundingClientRect() : null,
      encounterId: state.combat.encounterId || '',
      reshuffleCount: state.combat.reshuffleCount ?? 0,
      turn: state.combat.turn ?? 1,
    };
  }

  function spawnElementWithCleanup(el, baseMs) {
    const scale = getAnimScale();
    if (scale <= 0 || !fxLayerEl) return;
    fxLayerEl.appendChild(el);
    const ttl = Math.max(120, Math.round(baseMs * scale) + 90);
    scheduleFxTimer(() => {
      el.remove();
    }, ttl);
  }

  function spawnFloatingPopup(rect, text, tone = 'damage', stackOffset = 0, options = {}) {
    const settings = getSettings ? getSettings() : null;
    if (!options.ignoreDamageSetting && settings && !settings.showDamageNumbers) return;
    if (!rect || (rect.width === 0 && rect.height === 0)) return;
    const scale = getAnimScale();
    if (scale <= 0) return;

    const pop = document.createElement('div');
    pop.className = `fx-float-popup fx-tone-${tone}`;
    pop.textContent = text;
    const jitterX = options.noJitter ? 0 : Math.round((Math.random() - 0.5) * 24);
    const x = Math.round(rect.left + rect.width / 2 + jitterX);
    const y = Math.round(rect.top + rect.height * 0.26 + stackOffset * 24);
    pop.style.left = `${x}px`;
    pop.style.top = `${y}px`;
    spawnElementWithCleanup(pop, options.baseMs ?? 820);
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

  function spawnImpactSvg(rect, effectType = 'slash') {
    if (!rect || (rect.width === 0 && rect.height === 0)) return;
    const scale = getAnimScale();
    if (scale <= 0) return;
    const markup = IMPACT_SVG_TEMPLATES[effectType] || IMPACT_SVG_TEMPLATES.slash;

    const fxEl = document.createElement('div');
    fxEl.className = `fx-impact-svg fx-impact-${effectType}`;
    fxEl.dataset.fxType = effectType;
    fxEl.innerHTML = markup;
    const size = Math.max(78, Math.min(132, Math.round(Math.max(rect.width, rect.height) * 1.18)));
    fxEl.style.width = `${size}px`;
    fxEl.style.height = `${size}px`;
    fxEl.style.left = `${Math.round(rect.left + rect.width / 2)}px`;
    fxEl.style.top = `${Math.round(rect.top + rect.height / 2)}px`;
    const baseMs =
      effectType === 'heavy' || effectType === 'ko' || effectType.startsWith('stance_') ? 560 : 440;
    spawnElementWithCleanup(fxEl, baseMs);
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
    scheduleFxTimer(() => {
      el.classList.remove(className);
    }, Math.max(120, Math.round(baseMs * scale)));
  }

  function pickAttackImpactKind(meta, damageAbs, charId) {
    const cardId = meta?.cardId || '';
    const stats = meta?.cardStats || null;
    if (cardId === 'shiv' || (stats?.addShivs ?? 0) > 0) return 'shiv';
    if (
      (stats?.applyEnemyStatuses?.poison ?? 0) > 0 ||
      (stats?.applyAllEnemiesStatuses?.poison ?? 0) > 0
    ) {
      return 'poison';
    }
    if (
      charId === 'watcher' ||
      stats?.enterStance ||
      stats?.applyMarkAndTrigger ||
      (stats?.gainMantra ?? 0) > 0
    ) {
      return damageAbs >= 15 ? 'heavy' : 'divine';
    }
    return damageAbs >= 15 ? 'heavy' : 'slash';
  }

  function reconcileCombatFx(prevSnap, nextState, kind, soundEngine, meta = {}) {
    if (!prevSnap || !nextState) return;

    let playedHit = false;
    let maxDamageDealt = 0;
    let hitEnemyCount = 0;
    let playedKill = false;
    let playedShieldBreak = false;
    let playedBlock = false;
    let playedHeal = false;
    let playedPoison = false;
    let playedBuff = false;
    let playedDebuff = false;
    let playedExhaust = false;
    let newStanceCue = null;

    // 1. Player diffs
    const nextPlayerEl = rootEl.querySelector('#player-unit');
    const pRects = getRectPair(nextPlayerEl);
    const playerRect = pRects.rect || prevSnap.player.rect;
    const playerFigRect = pRects.figRect || prevSnap.player.figRect || playerRect;
    const playerHpDelta = nextState.player.hp - prevSnap.player.hp;
    const playerBlockDelta = nextState.player.block - prevSnap.player.block;
    const nextStance = nextState.combat?.stance || nextState.player.stance || 'neutral';
    let pStack = 0;

    if (kind === 'endTurn' && prevSnap.player.block > 0 && playerHpDelta < 0) {
      spawnShieldBreakBurst(playerFigRect);
      spawnFloatingPopup(playerRect, '护盾击碎!', 'shatter', pStack++);
      triggerUnitClass('#player-unit', 'fx-shield-break', 520);
      playedShieldBreak = true;
    }

    if (playerHpDelta < 0) {
      const dmgAbs = Math.abs(playerHpDelta);
      maxDamageDealt = Math.max(maxDamageDealt, dmgAbs);
      spawnFloatingPopup(playerRect, `${playerHpDelta}`, dmgAbs >= 15 ? 'heavy' : 'damage', pStack++);
      spawnImpactSvg(playerFigRect, dmgAbs >= 15 ? 'heavy' : 'slash');
      triggerUnitClass('#player-unit', dmgAbs >= 15 ? 'fx-hit-heavy' : 'fx-hit-shake', 440);
      triggerUnitClass('#player-unit', 'fx-hit-flash', 260);
      playedHit = true;
    } else if (playerHpDelta > 0) {
      spawnFloatingPopup(playerRect, `+${playerHpDelta} 生命`, 'heal', pStack++);
      spawnImpactSvg(playerFigRect, 'heal');
      triggerUnitClass('#player-unit', 'fx-buff-pulse', 420);
      playedHeal = true;
    }

    if ((kind === 'card' || kind === 'potion') && playerBlockDelta > 0) {
      spawnFloatingPopup(playerRect, `+${playerBlockDelta} 盾`, 'block', pStack++);
      spawnImpactSvg(playerFigRect, 'block');
      triggerUnitClass('#player-unit', 'fx-buff-pulse', 380);
      playedBlock = true;
    }

    // Stance transition FX
    if (nextStance !== prevSnap.player.stance && nextStance !== 'neutral') {
      const stanceLabels = { calm: '进入平静', wrath: '进入愤怒!', divinity: '神格降临!' };
      const fxKey = `stance_${nextStance}`;
      spawnImpactSvg(playerFigRect, fxKey);
      spawnFloatingPopup(playerRect, stanceLabels[nextStance] || nextStance, fxKey, pStack++);
      triggerUnitClass('#player-unit', 'fx-buff-pulse', 440);
      newStanceCue = fxKey;
    }

    // Player buff / debuff diffs
    const nextPlayerStatuses = nextState.player.statuses || {};
    if ((nextPlayerStatuses.artifact ?? 0) < (prevSnap.player.statuses?.artifact ?? 0)) {
      spawnFloatingPopup(playerRect, '免疫!', 'artifact', pStack++);
      triggerUnitClass('#player-unit', 'fx-buff-pulse', 340);
      playedBlock = true;
    }
    for (const [sKey, sVal] of Object.entries(nextPlayerStatuses)) {
      const prevVal = prevSnap.player.statuses?.[sKey] ?? 0;
      if (sVal > prevVal) {
        if (POSITIVE_BUFF_KEYS.has(sKey)) {
          playedBuff = true;
          triggerUnitClass('#player-unit', 'fx-buff-pulse', 360);
        } else if (NEGATIVE_DEBUFF_KEYS.has(sKey)) {
          playedDebuff = true;
        }
      }
    }

    // Exhaust pile growth visual wisp
    const nextExhaustCount = nextState.combat?.exhaustPile?.length ?? prevSnap.exhaustCount;
    if ((kind === 'card' || kind === 'potion') && nextExhaustCount > prevSnap.exhaustCount) {
      spawnImpactSvg(playerFigRect, 'exhaust');
      playedExhaust = true;
    }

    // 2. Enemy diffs
    const nextEnemiesById = new Map();
    if (nextState.combat?.enemies) {
      for (const e of nextState.combat.enemies) {
        nextEnemiesById.set(e.id, e);
      }
    }

    let playerStruckAnyEnemy = false;
    const attackingEnemySelectors = [];

    for (const [enemyId, prevEnemy] of prevSnap.enemies.entries()) {
      const nextEnemy = nextEnemiesById.get(enemyId);
      const nextHp = nextEnemy ? nextEnemy.hp : 0;
      const nextBlock = nextEnemy ? nextEnemy.block : 0;
      const domSelector = `#enemy-unit-${CSS.escape(enemyId)}`;
      const domEl = rootEl.querySelector(domSelector);
      const eRects = getRectPair(domEl);
      const rect = eRects.rect || prevEnemy.rect;
      const figRect = eRects.figRect || prevEnemy.figRect || rect;
      let eStack = 0;

      const hpDelta = nextHp - prevEnemy.hp;
      const blockDelta = nextBlock - prevEnemy.block;
      const prevPoison = prevEnemy.statuses?.poison ?? 0;
      const nextPoison = nextEnemy?.statuses?.poison ?? 0;
      const poisonDelta = nextPoison - prevPoison;

      if (kind === 'endTurn' && !prevEnemy.dead && prevEnemy.intentType.includes('attack')) {
        attackingEnemySelectors.push(domSelector);
      }

      if ((kind === 'card' || kind === 'potion') && prevEnemy.block > 0 && nextBlock === 0 && (blockDelta < 0 || hpDelta < 0)) {
        spawnShieldBreakBurst(figRect);
        spawnFloatingPopup(rect, '破盾!', 'shatter', eStack++);
        triggerUnitClass(domSelector, 'fx-shield-break', 520);
        playedShieldBreak = true;
        playerStruckAnyEnemy = true;
      } else if ((kind === 'card' || kind === 'potion') && blockDelta < 0 && hpDelta === 0) {
        spawnFloatingPopup(rect, `格挡 ${blockDelta}`, 'block', eStack++);
        spawnImpactSvg(figRect, pickAttackImpactKind(meta, Math.abs(blockDelta), nextState.characterId));
        triggerUnitClass(domSelector, 'fx-hit-shake', 320);
        triggerUnitClass(domSelector, 'fx-hit-flash', 220);
        playedBlock = true;
        playerStruckAnyEnemy = true;
      }

      const fledIds = Array.isArray(nextState.combat?.fledEnemyIds) ? nextState.combat.fledEnemyIds : [];
      if (!prevEnemy.dead && !nextEnemy && fledIds.includes(enemyId)) {
        spawnFloatingPopup(rect, '逃跑!', 'buff', eStack++);
        continue;
      }

      if (hpDelta < 0) {
        const dmgAbs = Math.abs(hpDelta);
        maxDamageDealt = Math.max(maxDamageDealt, dmgAbs);
        hitEnemyCount += 1;
        const isKo = !prevEnemy.dead && nextHp <= 0;
        const impactType =
          kind === 'endTurn' && prevPoison > 0 && dmgAbs <= prevPoison
            ? 'poison'
            : isKo
              ? 'ko'
              : pickAttackImpactKind(meta, dmgAbs, nextState.characterId);
        spawnFloatingPopup(rect, `${hpDelta}`, dmgAbs >= 15 ? 'heavy' : 'damage', eStack++);
        spawnImpactSvg(figRect, impactType);
        triggerUnitClass(domSelector, dmgAbs >= 15 ? 'fx-hit-heavy' : 'fx-hit-shake', 440);
        triggerUnitClass(domSelector, 'fx-hit-flash', 260);
        if (isKo) {
          triggerUnitClass(domSelector, 'fx-enemy-ko', 520);
          playedKill = true;
        }
        playedHit = true;
        if (kind === 'card' || kind === 'potion') {
          playerStruckAnyEnemy = true;
        }
      }

      if (poisonDelta > 0) {
        spawnImpactSvg(figRect, 'poison');
        spawnFloatingPopup(rect, `+${poisonDelta} 毒`, 'poison', eStack++);
        triggerUnitClass(domSelector, 'fx-hit-flash', 220);
        playedPoison = true;
        playerStruckAnyEnemy = true;
      }

      // Enemy Artifact blocked a debuff (card, potion, or turn-start power like Noxious Fumes)
      if (nextEnemy && nextHp > 0 && (nextEnemy.statuses?.artifact ?? 0) < (prevEnemy.statuses?.artifact ?? 0)) {
        spawnFloatingPopup(rect, '免疫!', 'artifact', eStack++);
        triggerUnitClass(domSelector, 'fx-buff-pulse', 340);
        playedBlock = true;
      }

      // Enemy debuffs applied by player
      if (kind === 'card' || kind === 'potion') {
        const nextEStatuses = nextEnemy?.statuses || {};
        for (const dKey of NEGATIVE_DEBUFF_KEYS) {
          if ((nextEStatuses[dKey] ?? 0) > (prevEnemy.statuses?.[dKey] ?? 0)) {
            playedDebuff = true;
          }
        }
      }

      if (kind === 'endTurn' && blockDelta > 0 && nextBlock > 0) {
        spawnFloatingPopup(rect, `+${nextBlock} 盾`, 'block', eStack++);
        spawnImpactSvg(figRect, 'block');
      }
    }

    // 3. Attacker lunge choreography
    if (playerStruckAnyEnemy && (kind === 'card' || kind === 'potion')) {
      triggerUnitClass('#player-unit', 'fx-lunge-right', 300);
    }
    if (kind === 'endTurn' && (playerHpDelta < 0 || (prevSnap.player.block > 0 && playerBlockDelta < 0))) {
      for (const sel of attackingEnemySelectors) {
        triggerUnitClass(sel, 'fx-lunge-left', 320);
      }
    }

    // 4. Escalated combat audio cue selection
    if (soundEngine) {
      const hitsCount = meta?.cardStats?.hits ?? 1;
      if (
        nextState.screen === 'reward' ||
        nextState.screen === 'boss_reward' ||
        (nextState.screen === 'game_over' && nextState.runOutcome === 'victory')
      ) {
        soundEngine.play('victory');
      } else if (nextState.screen === 'game_over' && nextState.runOutcome === 'defeat') {
        soundEngine.play('defeat');
      } else if (playedKill) {
        soundEngine.play('enemy_kill');
      } else if (playedShieldBreak) {
        soundEngine.play('shield_break');
      } else if (newStanceCue) {
        soundEngine.play(newStanceCue);
      } else if (playedHit) {
        if (maxDamageDealt >= 15) {
          soundEngine.play('hit_heavy');
        } else if (hitsCount >= 2 || hitEnemyCount >= 2) {
          soundEngine.play('hit_multi', { hits: Math.max(hitsCount, hitEnemyCount) });
        } else {
          soundEngine.play('hit');
        }
      } else if (playedPoison) {
        soundEngine.play('poison');
      } else if (playedHeal) {
        soundEngine.play('heal');
      } else if (playedBlock) {
        soundEngine.play('block');
      } else if (playedExhaust) {
        soundEngine.play('exhaust');
      } else if (playedBuff) {
        soundEngine.play('buff');
      } else if (playedDebuff) {
        soundEngine.play('debuff');
      }
    }

    // 5. Turn transition choreography (discard sweep -> turn banner -> reshuffle -> draw sweep)
    //    or mid-turn deck reshuffle feedback
    if (nextState.screen === 'combat' && nextState.combat && nextState.combat.status === 'ongoing') {
      const turnAdvanced =
        (nextState.combat.turn ?? 1) > (prevSnap.turn ?? 1) ||
        (nextState.combat.encounterId || '') !== (prevSnap.encounterId || '');
      if (turnAdvanced) {
        spawnTurnTransitionFx(prevSnap, nextState, soundEngine);
      } else if ((nextState.combat.reshuffleCount ?? 0) > (prevSnap.reshuffleCount ?? 0)) {
        const drawBtn = rootEl.querySelector('#btn-draw-pile');
        const drawRect = drawBtn ? drawBtn.getBoundingClientRect() : prevSnap.drawPileRect;
        triggerUnitClass('#btn-draw-pile', 'fx-pile-pulse-shuffle', 560);
        if (drawRect && (drawRect.width > 0 || drawRect.height > 0)) {
          spawnFloatingPopup(drawRect, '↻ 洗牌', 'shuffle', -1, {
            ignoreDamageSetting: true,
            noJitter: true,
            baseMs: 900,
          });
        }
        if (soundEngine) {
          soundEngine.play('card_shuffle');
        }
      }
    }
  }

  function spawnPileSweepGhost(fromRect, toRect, mode = 'to-discard', delayMs = 0) {
    const scale = getAnimScale();
    if (scale <= 0 || !fxLayerEl || !fromRect || !toRect) return;
    if (
      (fromRect.width === 0 && fromRect.height === 0) ||
      (toRect.width === 0 && toRect.height === 0)
    ) {
      return;
    }

    const startX = Math.round(fromRect.left + fromRect.width / 2);
    const startY = Math.round(fromRect.top + fromRect.height / 2);
    const dx = Math.round(toRect.left + toRect.width / 2 - startX);
    const dy = Math.round(toRect.top + toRect.height / 2 - startY);

    const ghost = document.createElement('div');
    ghost.className = `fx-pile-card-ghost ${mode}`;
    ghost.dataset.fxSweep = mode;
    ghost.style.left = `${startX}px`;
    ghost.style.top = `${startY}px`;
    ghost.style.setProperty('--sweep-dx', `${dx}px`);
    ghost.style.setProperty('--sweep-dy', `${dy}px`);
    ghost.style.setProperty('--sweep-rot-start', mode === 'to-discard' ? '-6deg' : '-12deg');
    ghost.style.setProperty('--sweep-rot-end', mode === 'to-discard' ? '14deg' : '4deg');
    if (delayMs > 0) {
      ghost.style.animationDelay = `${Math.round(delayMs * scale)}ms`;
    }
    spawnElementWithCleanup(ghost, 310 + delayMs);
  }

  function spawnTurnTransitionFx(prevSnap, nextState, soundEngine = null) {
    if (!nextState || nextState.screen !== 'combat' || !nextState.combat) return;
    if (nextState.combat.status !== 'ongoing') return;
    const scale = getAnimScale();
    if (scale <= 0 || !fxLayerEl) return;

    const combat = nextState.combat;
    const turn = combat.turn ?? 1;
    const fallbackOpening = !prevSnap && turn === 1;
    const summary = combat.lastTurnSummary || {
      turn,
      isOpeningTurn: fallbackOpening,
      wasExtraTurn: false,
      discardedCount: prevSnap ? prevSnap.handCount ?? 0 : 0,
      retainedCount: 0,
      etherealExhaustedCount: 0,
      reshuffled: Boolean(prevSnap && (combat.reshuffleCount ?? 0) > (prevSnap.reshuffleCount ?? 0)),
      drawnCount: combat.hand?.length ?? 0,
      pendingScryDraw: false,
      energy: nextState.player?.energy ?? 0,
    };

    const isOpening = Boolean(summary.isOpeningTurn || fallbackOpening);
    const wasExtraTurn = Boolean(summary.wasExtraTurn);
    const discardedCount = Math.max(0, summary.discardedCount ?? 0);
    const retainedCount = Math.max(0, summary.retainedCount ?? 0);
    const etherealExhaustedCount = Math.max(0, summary.etherealExhaustedCount ?? 0);
    const reshuffled = Boolean(summary.reshuffled);
    const drawnCount = Math.max(0, summary.drawnCount ?? 0);
    const pendingScryDraw = Boolean(summary.pendingScryDraw);

    // 1. Slay-the-Spire Turn Transition Banner (non-blocking)
    for (const stale of fxLayerEl.querySelectorAll('.fx-turn-banner')) {
      stale.remove();
    }

    const bannerKind = isOpening ? 'opening' : wasExtraTurn ? 'extra' : 'turn';
    const eyebrowText = isOpening
      ? combat.role === 'boss'
        ? '👑 首领战 · 战斗开始'
        : combat.role === 'elite'
          ? '🔥 强敌遭遇 · 战斗开始'
          : '⚔️ 战斗开始'
      : wasExtraTurn
        ? '✨ 额外回合'
        : '你的回合';
    const titleText = isOpening ? `第 ${turn} 回合 · 你的回合` : `第 ${turn} 回合`;

    const flowChips = [];
    if (!isOpening && discardedCount > 0) {
      flowChips.push(
        `<span class="fx-turn-chip tone-discard" data-turn-chip="discard">弃牌 ${discardedCount}</span>`
      );
    }
    if (!isOpening && retainedCount > 0) {
      flowChips.push(
        `<span class="fx-turn-chip tone-retain" data-turn-chip="retain">保留 ${retainedCount}</span>`
      );
    }
    if (!isOpening && etherealExhaustedCount > 0) {
      flowChips.push(
        `<span class="fx-turn-chip tone-exhaust" data-turn-chip="exhaust">虚无消耗 ${etherealExhaustedCount}</span>`
      );
    }
    if (reshuffled) {
      flowChips.push(
        `<span class="fx-turn-chip tone-shuffle" data-turn-chip="shuffle">↻ 洗牌重抽</span>`
      );
    }
    if (pendingScryDraw) {
      flowChips.push(
        `<span class="fx-turn-chip tone-draw" data-turn-chip="draw">预见后抽牌</span>`
      );
    } else if (drawnCount > 0) {
      flowChips.push(
        `<span class="fx-turn-chip tone-draw" data-turn-chip="draw">抽牌 +${drawnCount}</span>`
      );
    }
    if (isOpening) {
      flowChips.push(
        `<span class="fx-turn-chip tone-energy" data-turn-chip="energy">⚡ 能量 ${escapeHtml(summary.energy ?? nextState.player?.energy ?? 0)}</span>`
      );
    }

    const banner = document.createElement('div');
    banner.className = `fx-turn-banner kind-${bannerKind}`;
    banner.dataset.fxTurnBanner = 'true';
    banner.dataset.turn = String(turn);
    banner.dataset.turnKind = bannerKind;
    banner.setAttribute('aria-hidden', 'true');
    banner.innerHTML = `
      <div class="fx-turn-eyebrow">${escapeHtml(eyebrowText)}</div>
      <div class="fx-turn-title">${escapeHtml(titleText)}</div>
      ${
        flowChips.length > 0
          ? `<div class="fx-turn-flow">${flowChips.join('<span class="fx-turn-sep" aria-hidden="true">›</span>')}</div>`
          : ''
      }
    `;
    spawnElementWithCleanup(banner, 1360);
    triggerUnitClass('#combat-banner', 'fx-banner-turn-flash', 520);

    // 2. Phase A — End-of-turn discard sweep into #btn-discard-pile
    const discardBtn = rootEl.querySelector('#btn-discard-pile');
    const discardRect = discardBtn ? discardBtn.getBoundingClientRect() : prevSnap?.discardPileRect;
    if (!isOpening && discardedCount > 0) {
      const sweepCount = Math.min(discardedCount, 5);
      const sourceRects = Array.isArray(prevSnap?.handCardRects) ? prevSnap.handCardRects : [];
      const handTray = rootEl.querySelector('#hand-tray');
      const fallbackRect = handTray
        ? handTray.getBoundingClientRect()
        : {
            left: window.innerWidth * 0.38,
            top: window.innerHeight * 0.78,
            width: Math.max(120, window.innerWidth * 0.24),
            height: 80,
          };
      if (discardRect) {
        for (let i = 0; i < sweepCount; i += 1) {
          const src = sourceRects[i] || {
            left: fallbackRect.left + ((i + 0.5) / sweepCount) * fallbackRect.width - 20,
            top: fallbackRect.top + fallbackRect.height * 0.35,
            width: 40,
            height: 54,
          };
          spawnPileSweepGhost(src, discardRect, 'to-discard', i * 26);
        }
        triggerUnitClass('#btn-discard-pile', 'fx-pile-pulse-discard', 420);
        spawnFloatingPopup(discardRect, `弃牌 +${discardedCount}`, 'discard', -1, {
          ignoreDamageSetting: true,
          noJitter: true,
          baseMs: 840,
        });
      }
    }
    if (!isOpening && etherealExhaustedCount > 0) {
      triggerUnitClass('#btn-exhaust-pile', 'fx-pile-pulse-exhaust', 420);
    }

    // 3. Pre-arm fresh-draw card deal-in immediately at t=0 with base delay (zero flicker with .card-deal-in)
    const drawDelayMs = !isOpening && discardedCount > 0 ? Math.round(145 * scale) : 0;
    const prevHandIds = prevSnap?.handInstanceIds || null;
    const initialHandCards = [...rootEl.querySelectorAll('#hand-tray .game-card')];
    const initialFreshCards =
      prevHandIds && prevHandIds.size > 0
        ? initialHandCards.filter((el) => !prevHandIds.has(String(el.dataset.instanceId || '')))
        : initialHandCards;
    const targetDrawCards = drawnCount > 0
      ? (initialFreshCards.length > 0 ? initialFreshCards : initialHandCards)
      : [];

    targetDrawCards.forEach((cardEl, idx) => {
      cardEl.style.setProperty('--fresh-idx', String(idx));
      cardEl.style.setProperty('--fresh-base-delay', `${drawDelayMs}ms`);
      cardEl.classList.remove('fx-card-fresh-draw');
      void cardEl.offsetWidth;
      cardEl.classList.add('fx-card-fresh-draw');
      scheduleFxTimer(() => {
        cardEl.classList.remove('fx-card-fresh-draw');
      }, drawDelayMs + Math.max(180, Math.round((360 + idx * 42) * scale)));
    });

    // 4. Phase B — Reshuffle & new-turn draw sweep from #btn-draw-pile into #hand-tray
    const runDrawPhase = () => {
      if (nextState.screen !== 'combat' || !nextState.combat || nextState.combat.status !== 'ongoing') {
        return;
      }
      const drawBtn = rootEl.querySelector('#btn-draw-pile');
      const drawRect = drawBtn ? drawBtn.getBoundingClientRect() : prevSnap?.drawPileRect;
      triggerUnitClass('#energy-orb', 'fx-energy-refill', 440);

      let drawPopupOffset = -1;
      if (reshuffled) {
        triggerUnitClass('#btn-draw-pile', 'fx-pile-pulse-shuffle', 560);
        if (drawRect && (drawRect.width > 0 || drawRect.height > 0)) {
          spawnFloatingPopup(drawRect, '↻ 洗牌', 'shuffle', drawPopupOffset, {
            ignoreDamageSetting: true,
            noJitter: true,
            baseMs: 920,
          });
          drawPopupOffset -= 1;
        }
        if (soundEngine) {
          soundEngine.play('card_shuffle');
        }
      }

      if (drawnCount > 0) {
        if (!reshuffled) {
          triggerUnitClass('#btn-draw-pile', 'fx-pile-pulse-draw', 420);
        }
        const liveCards = targetDrawCards.filter((el) => el.isConnected);
        const sweepCount = Math.min(drawnCount, Math.max(liveCards.length, 1), 6);
        const handTray = rootEl.querySelector('#hand-tray');
        const trayRect = handTray ? handTray.getBoundingClientRect() : null;
        if (drawRect && (drawRect.width > 0 || drawRect.height > 0)) {
          for (let i = 0; i < sweepCount; i += 1) {
            const cardRect = liveCards[i]?.getBoundingClientRect();
            const destRect =
              cardRect && cardRect.width > 0 && cardRect.height > 0
                ? cardRect
                : trayRect
                  ? {
                      left: trayRect.left + ((i + 0.5) / sweepCount) * trayRect.width - 20,
                      top: trayRect.top + trayRect.height * 0.4,
                      width: 40,
                      height: 54,
                    }
                  : null;
            if (destRect) {
              spawnPileSweepGhost(drawRect, destRect, 'from-draw', i * 36);
            }
          }
          spawnFloatingPopup(drawRect, `抽牌 +${drawnCount}`, 'draw', drawPopupOffset, {
            ignoreDamageSetting: true,
            noJitter: true,
            baseMs: 860,
          });
        }
        if (soundEngine && !reshuffled) {
          soundEngine.play('card_draw');
        }
      }
    };

    if (drawDelayMs > 0) {
      scheduleFxTimer(runDrawPhase, drawDelayMs);
    } else {
      runDrawPhase();
    }
  }

  function getCardRevealBadgeText(item) {
    const src = item.sourceName || '效果';
    switch (item.kind) {
      case 'auto_play': {
        const tail = item.exhausted ? '消耗' : '能力生效';
        const target = item.targetName ? ` · → ${item.targetName}` : '';
        return `🔥 ${src}自动打出 · ${tail}${target}`;
      }
      case 'auto_exhaust':
        return `💀 ${src}翻出 · 不可打出消耗`;
      case 'random_exhaust':
        return `🔥 ${src}随机消耗`;
      case 'random_discard':
        return `💨 ${src}随机弃置`;
      case 'random_upgrade':
        return `✨ ${src}随机升级`;
      case 'random_generate':
        return `🌿 ${src}随机生成`;
      default:
        return item.summary || `${src}触发`;
    }
  }

  function spawnCardRevealFx(reveals, state) {
    if (!Array.isArray(reveals) || reveals.length === 0) return;
    const scale = getAnimScale();
    if (scale <= 0 || !fxLayerEl) return;

    const cardItems = reveals.filter((r) => r && r.card && r.card.cardId);
    if (cardItems.length === 0) return;

    for (const stale of fxLayerEl.querySelectorAll('.fx-card-reveal-stage')) {
      stale.remove();
    }

    const maxVisible = typeof window !== 'undefined' && window.innerWidth <= 520 ? 2 : 3;
    const shown = cardItems.slice(0, maxVisible);
    const overflowCount = Math.max(0, cardItems.length - shown.length);

    const stage = document.createElement('div');
    stage.className = 'fx-card-reveal-stage';
    stage.dataset.fxReveal = 'true';
    stage.setAttribute('aria-hidden', 'true');

    const itemsHtml = shown
      .map((item, idx) => {
        const badgeText = getCardRevealBadgeText(item);
        const cardHtml = renderCardHtml(item.card, {
          idPrefix: `fx-reveal-${idx}`,
          action: 'noop',
          disabled: false,
          combatContext: state?.combat
            ? { player: state.player, targetEnemy: null, combat: state.combat }
            : null,
        });
        const tone = item.kind || 'auto_play';
        return `
          <div
            class="fx-card-reveal-item tone-${escapeHtml(tone)}"
            data-reveal-kind="${escapeHtml(tone)}"
            data-reveal-card-id="${escapeHtml(item.card.cardId)}"
          >
            <div class="fx-card-reveal-badge">${escapeHtml(badgeText)}</div>
            <div class="fx-card-reveal-card-wrap">${cardHtml}</div>
          </div>
        `;
      })
      .join('');

    const overflowHtml =
      overflowCount > 0 ? `<div class="fx-card-reveal-more">+${overflowCount} 张</div>` : '';

    stage.innerHTML = `${itemsHtml}${overflowHtml}`;
    spawnElementWithCleanup(stage, 2150);
  }

  return {
    applyAnimSpeedAttr,
    clearPendingFx,
    captureCombatSnapshot,
    spawnCardFlyFx,
    spawnCardRevealFx,
    spawnTurnTransitionFx,
    spawnImpactSvg,
    reconcileCombatFx,
  };
}
