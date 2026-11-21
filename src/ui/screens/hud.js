/**
 * Top global HUD: Title, Floor/Act/Ascension/Seed indicators, Vitals, Relics, Potions, and Action bar.
 */

import { getCharacterDef } from '../../data/characters.js';
import { TOTAL_FLOORS } from '../../data/events.js';
import { getRelicIcon, POTION_LIBRARY, RELIC_LIBRARY, RELIC_TIER_LABELS } from '../../data/relics.js';
import { getDailyModifierDefs } from '../../engine/daily.js';
import { ASCENSION_DEFS } from '../../engine/meta.js';
import { formatSeedCode } from '../../engine/rng.js';
import { escapeHtml } from '../helpers.js';
import { getVitalIconSvg } from '../icons.js';

export function renderTopHud({ state, ui }) {
  const hasSacredBark = state.player.relics.includes('sacred_bark');
  const seedCode = formatSeedCode(state.seed);
  const daily = state.dailyChallenge || null;
  const dailyMods = daily ? getDailyModifierDefs(daily.modifierIds) : [];
  const dailyTooltipDesc = dailyMods
    .map((m) => `【${m.name}】${m.description}`)
    .join('\n');

  const relicsHtml = state.player.relics
    .map((id) => {
      const r = RELIC_LIBRARY[id];
      if (!r) return '';
      const tierLabel = RELIC_TIER_LABELS[r.tier] || '遗物';
      const icon = getRelicIcon(id);
      let counterText = '';
      let counterShort = '';
      let tooltipExtra = '';
      if (id === 'happy_flower') {
        const count = state.relicCounters?.happy_flower ?? 0;
        counterText = `${count}/3`;
        counterShort = `${count}`;
        tooltipExtra = `\n当前计数：${count}/3`;
      } else if (id === 'incense_burner') {
        const count = state.relicCounters?.incense_burner ?? 0;
        counterText = `${count}/6`;
        counterShort = `${count}`;
        tooltipExtra = `\n当前计数：${count}/6`;
      } else if (id === 'nunchaku') {
        const count = state.relicCounters?.nunchaku ?? 0;
        counterText = `${count}/10`;
        counterShort = `${count}`;
        tooltipExtra = `\n当前计数：${count}/10`;
      } else if (id === 'pen_nib') {
        const count = state.relicCounters?.pen_nib ?? 0;
        counterText = count === 9 ? '9/10 就绪!' : `${count}/10`;
        counterShort = count === 9 ? '⚡' : `${count}`;
        tooltipExtra = `\n当前计数：${count}/10${count === 9 ? '（下一次攻击双倍！）' : ''}`;
      } else if (id === 'sundial') {
        const count = state.relicCounters?.sundial ?? 0;
        counterText = `${count}/3`;
        counterShort = `${count}`;
        tooltipExtra = `\n当前计数：${count}/3`;
      } else if (id === 'girya') {
        const count = state.relicCounters?.girya ?? 0;
        counterText = `${count}/3`;
        counterShort = `+${count}`;
        tooltipExtra = `\n已举重：${count}/3 次（开战 +${count} 力量）`;
      } else if (id === 'lizard_tail' && state.relicFlags?.lizardTailUsed) {
        counterText = '已耗尽';
        counterShort = '×';
        tooltipExtra = '\n状态：已消耗';
      }
      const counterHtml = counterText
        ? `<span class="relic-counter-pill"><span class="relic-counter-full">${escapeHtml(counterText)}</span><span class="relic-counter-short" aria-hidden="true">${escapeHtml(counterShort)}</span></span>`
        : '';
      return `<span
        class="relic-badge tier-${escapeHtml(r.tier)}${counterText ? ' has-counter' : ''}"
        data-relic-id="${escapeHtml(id)}"
        tabindex="0"
        aria-label="${escapeHtml(`${r.name}${counterText ? ` (${counterText})` : ''}`)}"
        data-tooltip-title="${escapeHtml(`${icon} ${r.name}`)}"
        data-tooltip-tag="${escapeHtml(tierLabel)}"
        data-tooltip-desc="${escapeHtml(`${r.description}${tooltipExtra}`)}"
        data-tooltip-tone="relic"
      ><span class="relic-icon" aria-hidden="true">${escapeHtml(icon)}</span><span class="relic-name-label">${escapeHtml(r.name)}</span>${counterHtml}</span>`;
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
            data-tooltip-desc="${escapeHtml(
              (state.ascension ?? 0) >= 6 && state.player.potions.length < 3
                ? `受进阶 6 限制：初始仅 ${state.player.potions.length} 个药水栏（常规为 3 格）；可在战斗战利品、炼金师事件或神秘商人处获得药水。`
                : `最多可携带 ${state.player.potions.length} 瓶药水，可在战斗战利品、炼金师事件或神秘商人处获得。`
            )}"
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
        state.combat?.phase === 'player' &&
        !state.combat?.pendingCardChoice &&
        !state.combat?.pendingDiscard;
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
        <span class="potion-slot-group">
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
  const charId = state.characterId || 'ironclad';
  const charName = state.player?.name || getCharacterDef(charId).name;

  return `
    <header class="top-hud">
      <div class="brand-cluster">
        <h1 class="game-title">杀戮尖塔<span class="title-subtitle"> · 简明版</span></h1>
        <span class="character-hud-pill char-${escapeHtml(charId)}" id="hud-character-pill">${escapeHtml(charName)}</span>
        <span class="floor-indicator">${escapeHtml(actPrefix)}第 ${escapeHtml(Math.max(1, state.floor || 1))} / ${escapeHtml(TOTAL_FLOORS)} 层</span>
        ${
          daily
            ? `<span class="daily-pill" id="hud-daily-pill" tabindex="0" data-tooltip-title="每日挑战 · ${escapeHtml(daily.dateKey)}" data-tooltip-tag="今日进阶 ${escapeHtml(asc)} · 无鲸鱼赐福" data-tooltip-desc="${escapeHtml(dailyTooltipDesc)}" data-tooltip-tone="relic">每日 ${escapeHtml(daily.dateKey.slice(5))}</span>`
            : ''
        }
        ${
          asc > 0
            ? `<span class="ascension-pill" id="hud-ascension-pill" tabindex="0" data-tooltip-title="${escapeHtml(ascDef.name)}" data-tooltip-tag="当前进阶难度" data-tooltip-desc="${escapeHtml(ascDef.description)}" data-tooltip-tone="debuff">进阶 ${escapeHtml(asc)}</span>`
            : ''
        }
        ${
          state.isChallengeRun && !daily
            ? `<span class="challenge-pill" id="hud-challenge-pill" tabindex="0" data-tooltip-title="好友种子挑战模式" data-tooltip-tag="全图鉴临时对齐" data-tooltip-desc="本局通过挑战链接开启，已临时对齐全图鉴卡池与目标进阶难度，确保与好友 100% 同图同掉落；不会覆盖你的本地生涯解锁进度。" data-tooltip-tone="buff">挑战</span>`
            : ''
        }
        <button
          type="button"
          id="btn-copy-seed"
          class="seed-pill"
          data-action="copy-seed"
          data-seed-code="${escapeHtml(seedCode)}"
          data-ascension="${escapeHtml(asc)}"
          data-character-id="${escapeHtml(charId)}"
          data-daily-date="${escapeHtml(daily?.dateKey || '')}"
          data-tooltip-title="${daily ? `分享每日挑战：${escapeHtml(daily.dateKey)}` : `分享挑战链接：${escapeHtml(seedCode)}`}"
          data-tooltip-tag="点击一键复制链接"
          data-tooltip-desc="${
            daily
              ? `点击直接复制今日每日挑战直连链接（?daily=${escapeHtml(daily.dateKey)}）。好友点开即可体验完全相同的角色、词条、地图与掉落！`
              : `点击直接复制完整挑战链接（含角色【${escapeHtml(charName)}】、本局种子与进阶 ${escapeHtml(asc)}）。好友点开链接即可体验 100% 相同的地图、鲸鱼赐福与掉落！`
          }"
        >
          种子 ${escapeHtml(seedCode)}
        </button>
      </div>

      <div class="vitals-cluster">
        <div class="vitals-top-row">
          <div class="vitals-numbers-row">
            <span
              class="vital-chip vital-hp"
              id="hud-player-hp"
              tabindex="0"
              aria-label="${escapeHtml(`生命 ${state.player.hp}/${state.player.maxHp}`)}"
              data-tooltip-title="当前生命值"
              data-tooltip-tag="${escapeHtml(`${state.player.hp} / ${state.player.maxHp}`)}"
              data-tooltip-desc="生命值归零即本局失败。可通过篝火休息、药水、遗物、事件或吸血类卡牌回复生命。"
              data-tooltip-tone="buff"
            ><span class="vital-icon" aria-hidden="true">${getVitalIconSvg('hp')}</span><span class="vital-value">${escapeHtml(state.player.hp)}/${escapeHtml(state.player.maxHp)}</span></span>
            <span
              class="vital-chip vital-gold"
              id="hud-player-gold"
              tabindex="0"
              aria-label="${escapeHtml(`金币 ${state.player.gold}`)}"
              data-tooltip-title="当前金币"
              data-tooltip-tag="${escapeHtml(`${state.player.gold} 枚`)}"
              data-tooltip-desc="可在神秘商人处购买卡牌、遗物、药水或移除冗余卡牌。"
              data-tooltip-tone="relic"
            ><span class="vital-icon" aria-hidden="true">${getVitalIconSvg('gold')}</span><span class="vital-value">${escapeHtml(state.player.gold)}</span></span>
          </div>
          <div class="hud-gear-scroll" aria-label="遗物栏区域">
            <div class="relic-strip" aria-label="已拥有遗物">${relicsHtml}</div>
          </div>
        </div>
        <div class="potion-strip" aria-label="药水栏">${potionsHtml}</div>
      </div>

      <nav class="top-actions" aria-label="全局操作">
        <button type="button" id="btn-open-deck" class="btn-stone" data-action="open-modal" data-modal="deck">
          <span class="nav-btn-emoji" aria-hidden="true">🃏</span> 牌组 (${escapeHtml(state.player.deck.length)})
        </button>
        ${
          state.screen !== 'map' && state.screen !== 'game_over'
            ? `<button
                type="button"
                id="btn-open-map"
                class="btn-stone"
                data-action="open-modal"
                data-modal="map"
                data-tooltip-title="查看尖塔地图 (M)"
                data-tooltip-tag="路线预览"
                data-tooltip-desc="随时查看当前幕完整攀登路线、当前所在位置、后续可选分支与关底首领，关闭后直接回到当前房间。"
              >
                <span class="nav-btn-emoji" aria-hidden="true">🗺️</span> 地图
              </button>`
            : ''
        }
        <button type="button" id="btn-open-meta" class="btn-stone" data-action="open-modal" data-modal="meta">
          <span class="nav-btn-emoji" aria-hidden="true">🏆</span> 进阶<span class="hud-btn-long">/生涯</span>
        </button>
        <button type="button" id="btn-open-compendium" class="btn-stone" data-action="open-modal" data-modal="compendium">
          <span class="nav-btn-emoji" aria-hidden="true">📖</span> 图鉴
        </button>
        <button type="button" id="btn-open-help" class="btn-stone" data-action="open-modal" data-modal="help">
          <span class="nav-btn-emoji" aria-hidden="true">💡</span> 词典<span class="hud-btn-long">/引导</span>
        </button>
        <button type="button" id="btn-open-settings" class="btn-stone" data-action="open-modal" data-modal="settings">
          <span class="nav-btn-emoji" aria-hidden="true">⚙️</span> 设置
        </button>
        <button type="button" id="btn-new-run" class="btn-stone" data-action="new-run">
          <span class="nav-btn-emoji" aria-hidden="true">🔄</span> 新<span class="hud-btn-long">的一</span>局
        </button>
      </nav>
    </header>
  `;
}
