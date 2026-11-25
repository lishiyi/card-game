/**
 * Top global HUD: Title, Floor/Act/Ascension/Seed indicators, Vitals, Relics, Potions, and Action bar.
 */

import { getCharacterDef } from '../../data/characters.js';
import { getRelicIcon, POTION_LIBRARY, RELIC_LIBRARY, RELIC_TIER_LABELS } from '../../data/relics.js';
import { getDailyModifierDefs } from '../../engine/daily.js';
import { getActTotalFloors, getCollectedKeyCount } from '../../engine/game.js';
import { ASCENSION_DEFS } from '../../engine/meta.js';
import { formatSeedCode } from '../../engine/rng.js';
import { escapeHtml } from '../helpers.js';
import { getKeysEmblemSvg, getPotionAccentColor, getPotionIconSvg, getVitalIconSvg } from '../icons.js';
import { getRelicSvg } from '../relic_art.js';

export function renderTopHud({ state, ui }) {
  const hasSacredBark = state.player.relics.includes('sacred_bark');
  const seedCode = formatSeedCode(state.seed);
  const daily = state.dailyChallenge || null;
  const dailyMods = daily ? getDailyModifierDefs(daily.modifierIds) : [];
  const dailyTooltipDesc = dailyMods
    .map((m) => `【${m.name}】${m.description}`)
    .join('\n');

  const canDrinkNow =
    state.screen === 'combat' &&
    state.combat?.status === 'ongoing' &&
    state.combat?.phase === 'player' &&
    !state.combat?.pendingCardChoice &&
    !state.combat?.pendingDiscard;
  const aliveEnemiesCount = state.combat?.enemies
    ? state.combat.enemies.filter((e) => e.hp > 0).length
    : 0;

  const relicsHtml = state.player.relics
    .map((id, idx) => {
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
      ><span class="relic-icon" aria-hidden="true">${getRelicSvg(id, { scope: `hud-${idx}` })}</span><span class="relic-name-label">${escapeHtml(r.name)}</span>${counterHtml}</span>`;
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
            <button type="button" id="potion-slot-${idx}" class="potion-slot empty" aria-label="空药水栏" disabled><span class="potion-icon" aria-hidden="true">${getPotionIconSvg(null)}</span><span class="potion-name-label">空药水栏</span></button>
          </span>
        `;
      }
      const pot = POTION_LIBRARY[potionId];
      if (!pot) return '';
      const selected = ui.selectedPotionSlot === idx;
      const popoverOpen = ui.activePotionPopoverSlot === idx;
      const showDiscard =
        (state.screen === 'reward' && state.reward?.potionId && !state.reward.potionClaimed) ||
        state.screen === 'shop' ||
        state.screen === 'event';
      const targetLabel =
        pot.target === 'enemy' ? '单体目标' : pot.target === 'all_enemies' ? '全体目标' : '自身';
      const stateHint = canDrinkNow ? '点击饮用' : '战斗中可用';
      const descText = hasSacredBark
        ? `${pot.description}（神圣树皮生效：效果翻倍！）`
        : pot.description;
      const accent = getPotionAccentColor(potionId);

      return `
        <span class="potion-slot-group">
          <span
            class="potion-tooltip-anchor"
            data-filled-potion-slot="${idx}"
            tabindex="0"
            data-tooltip-title="${escapeHtml(pot.name)}"
            data-tooltip-tag="${escapeHtml(`药水 · ${targetLabel}（${stateHint}）`)}"
            data-tooltip-desc="${escapeHtml(descText)}"
            data-tooltip-tone="potion"
          >
            <button
              type="button"
              id="potion-slot-${idx}"
              class="potion-slot filled${selected ? ' selected' : ''}${popoverOpen ? ' popover-active' : ''}"
              data-action="use-potion"
              data-slot="${idx}"
              aria-label="${escapeHtml(pot.name)}"
              ${canDrinkNow ? '' : 'disabled'}
              style="--potion-accent: ${escapeHtml(accent)};${selected ? ' outline: 2px solid var(--accent-brass);' : ''}"
            >
              <span class="potion-icon" aria-hidden="true">${getPotionIconSvg(potionId, 20, { scope: `hud-${idx}` })}</span><span class="potion-name-label">${escapeHtml(pot.name)}</span>
            </button>
          </span>
          ${
            showDiscard
              ? `<button type="button" id="discard-potion-${idx}" class="potion-slot potion-discard-inline" data-action="discard-potion" data-slot="${idx}" data-tooltip-title="丢弃药水" data-tooltip-tag="药水管理" data-tooltip-desc="${escapeHtml(`丢弃【${pot.name}】以腾出药水栏位。`)}">×</button>`
              : ''
          }
        </span>
      `;
    })
    .join('');

  let potionPopoverHtml = '';
  const activeSlot = ui.activePotionPopoverSlot;
  if (Number.isInteger(activeSlot) && state.player.potions[activeSlot]) {
    const activePotId = state.player.potions[activeSlot];
    const activePot = POTION_LIBRARY[activePotId];
    if (activePot) {
      const targetLabel =
        activePot.target === 'enemy'
          ? '单体目标'
          : activePot.target === 'all_enemies'
            ? '全体目标'
            : '自身';
      const descText = hasSacredBark
        ? `${activePot.description}（神圣树皮生效：效果翻倍！）`
        : activePot.description;
      const accent = getPotionAccentColor(activePotId);
      const drinkLabel = canDrinkNow
        ? activePot.target === 'enemy' && aliveEnemiesCount > 1
          ? '🎯 选择目标饮用'
          : '🧪 立即饮用'
        : '仅战斗中可用';
      potionPopoverHtml = `
        <div
          id="hud-potion-popover"
          class="hud-potion-popover"
          role="dialog"
          aria-label="${escapeHtml(activePot.name)}"
          style="--potion-accent: ${escapeHtml(accent)};"
        >
          <div class="hud-potion-popover-head">
            <span class="hud-potion-popover-icon" aria-hidden="true">${getPotionIconSvg(activePotId, 26, { scope: 'popover' })}</span>
            <div class="hud-potion-popover-title-wrap">
              <strong class="hud-potion-popover-title">${escapeHtml(activePot.name)}</strong>
              <span class="hud-potion-popover-tag">${escapeHtml(`药水 · ${targetLabel}`)}</span>
            </div>
            <button
              type="button"
              id="btn-close-potion-popover"
              class="hud-popover-close"
              data-action="close-potion-popover"
              aria-label="关闭药水详情"
            >✕</button>
          </div>
          <p class="hud-potion-popover-desc">${escapeHtml(descText)}</p>
          <div class="hud-potion-popover-actions">
            <button
              type="button"
              id="btn-popover-drink-potion"
              class="btn-brass btn-compact"
              data-action="confirm-use-potion"
              data-slot="${activeSlot}"
              ${canDrinkNow ? '' : 'disabled'}
            >${escapeHtml(drinkLabel)}</button>
            <button
              type="button"
              id="btn-popover-discard-potion"
              class="btn-stone btn-compact btn-danger-subtle"
              data-action="discard-potion"
              data-slot="${activeSlot}"
            >🗑 丢弃</button>
          </div>
        </div>
      `;
    }
  }

  const actPrefix = (state.act ?? 1) >= 2 ? `第 ${state.act} 幕 · ` : '';
  const actTotalFloors = getActTotalFloors(state);
  const keys = state.keys || { ruby: false, emerald: false, sapphire: false };
  const keyCount = getCollectedKeyCount(state);
  const keyTooltipLines = [
    `红宝石钥匙：${keys.ruby ? '✓ 已获取' : '未获取（篝火营地选择「召回」）'}`,
    `绿宝石钥匙：${keys.emerald ? '✓ 已获取' : '未获取（击败地图上的燃烧精英）'}`,
    `蓝宝石钥匙：${keys.sapphire ? '✓ 已获取' : '未获取（在宝箱室放弃遗物换取）'}`,
    keyCount === 3
      ? '✨ 三钥齐聚！击败第 3 幕首领后将开启第 4 幕【终末尖顶】！'
      : '集齐全部 3 把钥匙后，击败第 3 幕首领将解锁第 4 幕【盾牌与长矛 + 腐化之心】！',
  ].join('\n');
  const asc = state.ascension ?? 0;
  const ascDef = ASCENSION_DEFS[asc] || ASCENSION_DEFS[0];
  const charId = state.characterId || 'ironclad';
  const charName = state.player?.name || getCharacterDef(charId).name;
  const menuOpen = Boolean(ui.hudMenuOpen);

  return `
    <header class="top-hud run-hud">
      <div class="brand-cluster">
        <h1 class="game-title">杀戮尖塔<span class="title-subtitle"> · 简明版</span></h1>
        <span class="character-hud-pill char-${escapeHtml(charId)}" id="hud-character-pill">${escapeHtml(charName)}</span>
        <span class="floor-indicator">${escapeHtml(actPrefix)}第 ${escapeHtml(Math.max(1, state.floor || 1))} / ${escapeHtml(actTotalFloors)} 层</span>
        <span
          class="keys-hud-pill ${keyCount === 3 ? 'keys-complete' : ''}"
          id="hud-keys-pill"
          tabindex="0"
          data-ruby="${keys.ruby ? '1' : '0'}"
          data-emerald="${keys.emerald ? '1' : '0'}"
          data-sapphire="${keys.sapphire ? '1' : '0'}"
          aria-label="${escapeHtml(`第四幕钥匙 ${keyCount}/3`)}"
          data-tooltip-title="终末尖顶钥匙 (${keyCount}/3)"
          data-tooltip-tag="${keyCount === 3 ? '已集齐 · 解锁第 4 幕' : '红 / 绿 / 蓝三把钥匙'}"
          data-tooltip-desc="${escapeHtml(keyTooltipLines)}"
          data-tooltip-tone="relic"
        >${getKeysEmblemSvg(keys)}<span class="keys-hud-count">${escapeHtml(keyCount)}/3</span></span>
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
        <div class="potion-strip" aria-label="药水栏">${potionsHtml}</div>
      </div>

      <nav class="top-actions" aria-label="全局操作">
        <div class="top-actions-primary">
          <button
            type="button"
            id="btn-open-deck"
            class="btn-stone hud-quick-btn hud-deck-btn"
            data-action="open-modal"
            data-modal="deck"
            aria-label="${escapeHtml(`查看牌组 (${state.player.deck.length} 张)`)}"
          >
            <span class="nav-btn-emoji" aria-hidden="true">🃏</span><span class="nav-btn-label"> 牌组</span><span class="nav-btn-count"><span class="nav-btn-paren"> (</span>${escapeHtml(state.player.deck.length)}<span class="nav-btn-paren">)</span></span>
          </button>
          ${
            state.screen !== 'map' && state.screen !== 'game_over'
              ? `<button
                  type="button"
                  id="btn-open-map"
                  class="btn-stone hud-quick-btn hud-map-btn"
                  data-action="open-modal"
                  data-modal="map"
                  aria-label="查看尖塔地图"
                  data-tooltip-title="查看尖塔地图 (M)"
                  data-tooltip-tag="路线预览"
                  data-tooltip-desc="随时查看当前幕完整攀登路线、当前所在位置、后续可选分支与关底首领，关闭后直接回到当前房间。"
                >
                  <span class="nav-btn-emoji" aria-hidden="true">🗺️</span><span class="nav-btn-label"> 地图</span>
                </button>`
              : ''
          }
        </div>
        <div class="top-actions-more-wrap${menuOpen ? ' open' : ''}">
          <button
            type="button"
            id="btn-hud-more"
            class="btn-stone hud-quick-btn hud-more-btn${menuOpen ? ' active' : ''}"
            data-action="toggle-hud-menu"
            aria-label="更多菜单"
            aria-haspopup="menu"
            aria-expanded="${menuOpen ? 'true' : 'false'}"
            aria-controls="hud-more-menu"
          >
            <span aria-hidden="true">${menuOpen ? '✕' : '☰'}</span>
          </button>
          <div class="top-actions-secondary${menuOpen ? ' open' : ''}" id="hud-more-menu" role="menu">
            <button type="button" id="btn-open-meta" class="btn-stone" data-action="open-modal" data-modal="meta">
              <span class="nav-btn-emoji" aria-hidden="true">🏆</span><span class="nav-btn-text"> 进阶<span class="hud-btn-long">/生涯</span></span>
            </button>
            <button type="button" id="btn-open-compendium" class="btn-stone" data-action="open-modal" data-modal="compendium">
              <span class="nav-btn-emoji" aria-hidden="true">📖</span><span class="nav-btn-text"> 图鉴</span>
            </button>
            <button type="button" id="btn-open-help" class="btn-stone" data-action="open-modal" data-modal="help">
              <span class="nav-btn-emoji" aria-hidden="true">💡</span><span class="nav-btn-text"> 词典<span class="hud-btn-long">/引导</span></span>
            </button>
            <button type="button" id="btn-open-settings" class="btn-stone" data-action="open-modal" data-modal="settings">
              <span class="nav-btn-emoji" aria-hidden="true">⚙️</span><span class="nav-btn-text"> 设置</span>
            </button>
            <span class="hud-menu-divider" aria-hidden="true"></span>
            <button type="button" id="btn-new-run" class="btn-stone" data-action="new-run">
              <span class="nav-btn-emoji" aria-hidden="true">🔄</span><span class="nav-btn-text"> 新<span class="hud-btn-long">的一</span>局</span>
            </button>
          </div>
        </div>
      </nav>
      ${potionPopoverHtml}
    </header>
  `;
}
