/**
 * Combat arena, enemy current & next-turn intent prediction badges, hand tray, and log strip.
 */

import { getCardStats } from '../../data/cards.js';
import { predictNextTurnIntents } from '../../data/enemies.js';
import { POTION_LIBRARY } from '../../data/relics.js';
import { canPlayCard, getAliveEnemies } from '../../engine/combat.js';
import { getEnemyIntentPreview } from '../../engine/math.js';
import { escapeHtml, renderCardHtml, renderStatusesHtml } from '../helpers.js';
import { getCharacterSvg, getIntentIconSvg } from '../icons.js';

export function renderCombatScreen({ state, ui, getPreviewTargetEnemy }) {
  const combat = state.combat;
  const aliveEnemies = getAliveEnemies(combat);
  const selectedCard = ui.selectedCardId
    ? combat.hand.find((c) => c.instanceId === ui.selectedCardId)
    : null;
  const selectedCardStats = selectedCard ? getCardStats(selectedCard) : null;
  const isTargetingEnemy =
    (selectedCardStats && selectedCardStats.target === 'enemy') ||
    (ui.selectedPotionSlot !== null &&
      POTION_LIBRARY[state.player.potions[ui.selectedPotionSlot]]?.target === 'enemy');

  const playerHpPct = Math.max(
    0,
    Math.min(100, Math.round((state.player.hp / state.player.maxHp) * 100))
  );

  const enemiesHtml = combat.enemies
    .map((enemy) => {
      const hpPct = Math.max(0, Math.min(100, Math.round((enemy.hp / enemy.maxHp) * 100)));
      const intentPreview = getEnemyIntentPreview(enemy, state.player);
      const nextPred =
        enemy.hp > 0
          ? predictNextTurnIntents(enemy, state.player, state.ascension ?? 0)
          : { summaryText: '', tooltipLines: [] };

      const intentClass = intentPreview.isAttack
        ? 'attack'
        : intentPreview.type.startsWith('defend')
          ? 'defend'
          : 'buff';
      const targetable = enemy.hp > 0 && isTargetingEnemy;

      const combinedTooltipDesc =
        enemy.hp > 0 && intentPreview.detail
          ? nextPred.tooltipLines.length > 0
            ? `${intentPreview.detail}\n────────────\n下回合可能行动：\n${nextPred.tooltipLines.join('\n')}`
            : intentPreview.detail
          : '';

      return `
        <div
          id="enemy-unit-${escapeHtml(enemy.id)}"
          class="fighter-unit ${enemy.hp <= 0 ? 'dead' : ''} ${targetable ? 'enemy-targetable' : ''}"
          data-action="${enemy.hp > 0 ? 'click-enemy' : 'noop'}"
          data-enemy-id="${escapeHtml(enemy.id)}"
          role="${targetable ? 'button' : 'group'}"
          tabindex="${targetable ? '0' : '-1'}"
          aria-label="${escapeHtml(`${enemy.name} 生命 ${enemy.hp}/${enemy.maxHp}`)}"
        >
          <div class="intent-stack">
            <div
              class="intent-badge ${intentClass}"
              tabindex="0"
              ${
                combinedTooltipDesc
                  ? `data-tooltip-title="${escapeHtml(enemy.intent?.name ? `行动意图：${enemy.intent.name}` : '敌方行动意图')}" data-tooltip-tag="${escapeHtml(enemy.name)}" data-tooltip-desc="${escapeHtml(combinedTooltipDesc)}"`
                  : ''
              }
            >
              ${enemy.hp > 0 ? getIntentIconSvg(intentPreview.type) : ''}
              <span>${enemy.hp > 0 ? escapeHtml(intentPreview.label) : '已击败'}</span>
            </div>
            ${
              enemy.hp > 0 && nextPred.summaryText
                ? `<div
                    class="next-intent-hint"
                    tabindex="0"
                    data-tooltip-title="${escapeHtml(`${enemy.name} · 下回合预测`)}"
                    data-tooltip-tag="行动预判"
                    data-tooltip-desc="${escapeHtml(nextPred.tooltipLines.join('\n'))}"
                  >${escapeHtml(nextPred.summaryText)}</div>`
                : ''
            }
          </div>
          <div class="unit-figure">
            ${getCharacterSvg(enemy.artKey, enemy.mode)}
          </div>
          <div class="unit-name-row">
            <span class="unit-name-text">${escapeHtml(enemy.name)}</span>
            ${
              enemy.block > 0
                ? `<span class="block-pill" tabindex="0" data-tooltip-title="${escapeHtml(`格挡 (${enemy.block})`)}" data-tooltip-tag="${escapeHtml(enemy.name)}" data-tooltip-desc="优先抵消受到的攻击伤害，下回合开始时清零。">盾 ${escapeHtml(enemy.block)}</span>`
                : ''
            }
          </div>
          <div class="hp-track">
            <div class="hp-fill ${enemy.block > 0 ? 'shielded' : ''}" style="width: ${hpPct}%;"></div>
            <span class="hp-label">${escapeHtml(enemy.hp)} / ${escapeHtml(enemy.maxHp)}</span>
          </div>
          ${renderStatusesHtml(enemy, enemy.name)}
        </div>
      `;
    })
    .join('');

  const previewTarget = getPreviewTargetEnemy();
  const handHtml = combat.hand
    .map((card, idx) => {
      const check = canPlayCard(state, card.instanceId);
      return renderCardHtml(card, {
        idPrefix: 'hand-card',
        action: 'click-hand-card',
        playable: check.playable,
        selected: ui.selectedCardId === card.instanceId,
        dimmed: !check.playable,
        hotkey: idx < 9 ? idx + 1 : undefined,
        dealIndex: idx,
        combatContext: {
          player: state.player,
          targetEnemy: previewTarget,
        },
      });
    })
    .join('');

  const recentLogs = combat.logs
    .slice(-8)
    .reverse()
    .map(
      (entry) =>
        `<div class="log-entry"><span class="log-turn">[T${escapeHtml(entry.turn)}]</span><span>${escapeHtml(entry.message)}</span></div>`
    )
    .join('');

  let bannerText = ui.notice;
  let bannerClass = ui.noticeTone === 'warn' ? 'warn' : '';
  if (isTargetingEnemy) {
    const itemName = selectedCardStats
      ? selectedCardStats.name
      : POTION_LIBRARY[state.player.potions[ui.selectedPotionSlot]]?.name;
    bannerText = `请点击一名敌人作为【${itemName}】的目标（再次点击卡牌或按 Esc 取消）`;
    bannerClass = 'targeting';
  } else if (!bannerText) {
    bannerText = `第 ${combat.turn} 回合 · ${combat.encounterName}（数字键 1-9 快速出牌，E 键结束回合）`;
  }

  const enemyDensity = Math.min(3, Math.max(1, combat.enemies.length));

  return `
    <div class="toast-banner ${bannerClass}" id="combat-banner">${escapeHtml(bannerText)}</div>

    <section class="combat-arena" data-enemy-count="${enemyDensity}" aria-label="战斗舞台">
      <div class="fighters-group player-side">
        <div class="fighter-unit" id="player-unit">
          <div class="intent-stack">
            <div class="intent-badge">第 ${escapeHtml(combat.turn)} 回合</div>
          </div>
          <div class="unit-figure">${getCharacterSvg('ironclad')}</div>
          <div class="unit-name-row">
            <span class="unit-name-text">${escapeHtml(state.player.name)}</span>
            ${
              state.player.block > 0
                ? `<span class="block-pill" tabindex="0" data-tooltip-title="${escapeHtml(`格挡 (${state.player.block})`)}" data-tooltip-tag="自身" data-tooltip-desc="优先抵消敌方攻击伤害，下回合开始时清零。">盾 ${escapeHtml(state.player.block)}</span>`
                : ''
            }
          </div>
          <div class="hp-track">
            <div class="hp-fill ${state.player.block > 0 ? 'shielded' : ''}" style="width: ${playerHpPct}%;"></div>
            <span class="hp-label">${escapeHtml(state.player.hp)} / ${escapeHtml(state.player.maxHp)}</span>
          </div>
          ${renderStatusesHtml(state.player, '自身')}
        </div>
      </div>

      <div class="fighters-group enemy-side">
        ${enemiesHtml}
      </div>
    </section>

    <section class="combat-dock" aria-label="手牌与能量控制区">
      <div class="dock-controls">
        <div class="pile-group">
          <button type="button" id="btn-draw-pile" class="btn-stone" data-action="open-modal" data-modal="draw">
            抽牌堆 (${escapeHtml(combat.drawPile.length)})
          </button>
          <div class="energy-orb" id="energy-orb" aria-label="当前能量">
            ${escapeHtml(state.player.energy)}/${escapeHtml(state.player.maxEnergy)}
            <span>能量</span>
          </div>
        </div>

        <div class="pile-group">
          <button
            type="button"
            id="btn-end-turn"
            class="btn-brass"
            data-action="end-turn"
            ${combat.phase !== 'player' || aliveEnemies.length === 0 ? 'disabled' : ''}
          >
            结束回合 (E)
          </button>
          <button type="button" id="btn-discard-pile" class="btn-stone" data-action="open-modal" data-modal="discard">
            弃牌堆 (${escapeHtml(combat.discardPile.length)})
          </button>
          <button type="button" id="btn-exhaust-pile" class="btn-stone" data-action="open-modal" data-modal="exhaust">
            消耗堆 (${escapeHtml(combat.exhaustPile.length)})
          </button>
        </div>
      </div>

      <div class="hand-tray" id="hand-tray">
        ${handHtml || '<p class="stage-subtitle">当前无手牌，请点击“结束回合”。</p>'}
      </div>

      <div class="combat-log" id="combat-log" aria-live="polite">
        ${recentLogs}
      </div>
    </section>
  `;
}
