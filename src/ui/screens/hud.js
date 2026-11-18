/**
 * Top global HUD: Title, Floor/Act/Ascension/Seed indicators, Vitals, Relics, Potions, and Action bar.
 */

import { TOTAL_FLOORS } from '../../data/events.js';
import { POTION_LIBRARY, RELIC_LIBRARY, RELIC_TIER_LABELS } from '../../data/relics.js';
import { ASCENSION_DEFS } from '../../engine/meta.js';
import { formatSeedCode } from '../../engine/rng.js';
import { escapeHtml } from '../helpers.js';

export function renderTopHud({ state, ui }) {
  const hasSacredBark = state.player.relics.includes('sacred_bark');
  const seedCode = formatSeedCode(state.seed);

  const relicsHtml = state.player.relics
    .map((id) => {
      const r = RELIC_LIBRARY[id];
      if (!r) return '';
      const tierLabel = RELIC_TIER_LABELS[r.tier] || '遗物';
      return `<span
        class="relic-badge tier-${escapeHtml(r.tier)}"
        tabindex="0"
        data-tooltip-title="${escapeHtml(r.name)}"
        data-tooltip-tag="${escapeHtml(tierLabel)}"
        data-tooltip-desc="${escapeHtml(r.description)}"
        data-tooltip-tone="relic"
      >${escapeHtml(r.name)}</span>`;
    })
    .join('');

  const potionsHtml = state.player.potions
    .map((potionId, idx) => {
      if (!potionId) {
        return `
          <span
            class="potion-tooltip-anchor"
            tabindex="0"
            data-tooltip-title="空药水栏"
            data-tooltip-tag="药水栏位"
            data-tooltip-desc="最多可携带 2 瓶药水，可在战斗战利品、炼金师事件或神秘商人处获得。"
          >
            <button type="button" id="potion-slot-${idx}" class="potion-slot" disabled>空药水栏</button>
          </span>
        `;
      }
      const pot = POTION_LIBRARY[potionId];
      if (!pot) return '';
      const selected = ui.selectedPotionSlot === idx;
      const canDrink =
        state.screen === 'combat' &&
        state.combat?.status === 'ongoing' &&
        state.combat?.phase === 'player';
      const showDiscard =
        (state.screen === 'reward' && state.reward?.potionId && !state.reward.potionClaimed) ||
        state.screen === 'shop' ||
        state.screen === 'event';
      const targetLabel =
        pot.target === 'enemy' ? '单体目标' : pot.target === 'all_enemies' ? '全体目标' : '自身';
      const stateHint = canDrink ? '点击饮用' : '战斗中可用';
      const descText = hasSacredBark
        ? `${pot.description}（神圣树皮生效：效果翻倍！）`
        : pot.description;

      return `
        <span style="display:inline-flex;align-items:center;gap:3px;">
          <span
            class="potion-tooltip-anchor"
            tabindex="0"
            data-tooltip-title="${escapeHtml(pot.name)}"
            data-tooltip-tag="${escapeHtml(`药水 · ${targetLabel}（${stateHint}）`)}"
            data-tooltip-desc="${escapeHtml(descText)}"
            data-tooltip-tone="potion"
          >
            <button
              type="button"
              id="potion-slot-${idx}"
              class="potion-slot filled"
              data-action="use-potion"
              data-slot="${idx}"
              ${canDrink ? '' : 'disabled'}
              style="${selected ? 'outline: 2px solid var(--accent-brass);' : ''}"
            >
              ${escapeHtml(pot.name)}
            </button>
          </span>
          ${
            showDiscard
              ? `<button type="button" id="discard-potion-${idx}" class="potion-slot" data-action="discard-potion" data-slot="${idx}" data-tooltip-title="丢弃药水" data-tooltip-tag="药水管理" data-tooltip-desc="${escapeHtml(`丢弃【${pot.name}】以腾出药水栏位。`)}">×</button>`
              : ''
          }
        </span>
      `;
    })
    .join('');

  const actPrefix = (state.act ?? 1) >= 2 ? `第 ${state.act} 幕 · ` : '';
  const asc = state.ascension ?? 0;
  const ascDef = ASCENSION_DEFS[asc] || ASCENSION_DEFS[0];

  return `
    <header class="top-hud">
      <div class="brand-cluster">
        <h1 class="game-title">杀戮尖塔 · 简明版</h1>
        <span class="floor-indicator">${escapeHtml(actPrefix)}第 ${escapeHtml(Math.max(1, state.floor || 1))} / ${escapeHtml(TOTAL_FLOORS)} 层</span>
        ${
          asc > 0
            ? `<span class="ascension-pill" id="hud-ascension-pill" tabindex="0" data-tooltip-title="${escapeHtml(ascDef.name)}" data-tooltip-tag="当前进阶难度" data-tooltip-desc="${escapeHtml(ascDef.description)}" data-tooltip-tone="debuff">进阶 ${escapeHtml(asc)}</span>`
            : ''
        }
        <button
          type="button"
          id="btn-copy-seed"
          class="seed-pill"
          data-action="copy-seed"
          data-seed-code="${escapeHtml(seedCode)}"
          data-tooltip-title="本局地图种子：${escapeHtml(seedCode)}"
          data-tooltip-tag="点击复制分享"
          data-tooltip-desc="点击复制种子码。好友可在【进阶/生涯】→【用种子开局】中输入该代码，体验完全相同的路线与掉落！"
        >
          种子 ${escapeHtml(seedCode)}
        </button>
      </div>

      <div class="vitals-cluster">
        <span class="vital-chip vital-hp" id="hud-player-hp">生命 ${escapeHtml(state.player.hp)} / ${escapeHtml(state.player.maxHp)}</span>
        <span class="vital-chip vital-gold" id="hud-player-gold">金币 ${escapeHtml(state.player.gold)}</span>
        <div class="relic-strip" aria-label="已拥有遗物">${relicsHtml}</div>
        <div class="potion-strip" aria-label="药水栏">${potionsHtml}</div>
      </div>

      <nav class="top-actions" aria-label="全局操作">
        <button type="button" id="btn-open-deck" class="btn-stone" data-action="open-modal" data-modal="deck">
          牌组 (${escapeHtml(state.player.deck.length)})
        </button>
        <button type="button" id="btn-open-meta" class="btn-stone" data-action="open-modal" data-modal="meta">
          进阶/生涯
        </button>
        <button type="button" id="btn-open-help" class="btn-stone" data-action="open-modal" data-modal="help">
          词典/引导
        </button>
        <button type="button" id="btn-open-settings" class="btn-stone" data-action="open-modal" data-modal="settings">
          设置
        </button>
        ${
          state.screen === 'combat' && state.combat?.status === 'ongoing'
            ? `<button
                type="button"
                id="btn-restart-combat"
                class="btn-stone"
                data-action="restart-combat"
                ${
                  state.combatSnapshot
                    ? 'data-tooltip-title="重启本场战斗" data-tooltip-tag="战斗操作" data-tooltip-desc="放弃当前回合进度，恢复到本场战斗第 1 回合初始状态。"'
                    : 'disabled'
                }
              >
                重启本场战斗
              </button>`
            : ''
        }
        <button type="button" id="btn-new-run" class="btn-stone" data-action="new-run">
          新的一局
        </button>
      </nav>
    </header>
  `;
}
