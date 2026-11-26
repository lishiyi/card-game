/**
 * Pre-run Menu & Two-Level Mode Navigation (Original Slay the Spire style):
 * - Level 1 ('home'): Main Menu Hall (#main-menu-screen) with Continue Active Run,
 *   Standard Climb, Daily Challenge, and 2x2 / 4-col Global Utilities.
 * - Level 2A ('standard'): Dedicated Character Select (#character-select-screen) with
 *   3-hero selector right under the title, Ascension A0-A10, and collapsible Seed drawer.
 * - Level 2B ('daily'): Dedicated Daily Challenge screen (#daily-challenge-screen) with
 *   today's hero portrait, Ascension, modifiers, personal best, and one-tap launch.
 */

import { CARD_LIBRARY, formatCardDescription } from '../../data/cards.js';
import { CHARACTER_IDS, CHARACTER_LIBRARY, getCharacterDef } from '../../data/characters.js';
import { getRelicIcon, POTION_LIBRARY, RELIC_LIBRARY, RELIC_TIER_LABELS } from '../../data/relics.js';
import { getDailyChallengeSpec } from '../../engine/daily.js';
import {
  ASCENSION_DEFS,
  getCharacterProgress,
  getMaxAscensionForCharacter,
} from '../../engine/meta.js';
import { escapeHtml } from '../helpers.js';
import { getCharacterSvg, getPotionIconSvg } from '../icons.js';
import { getRelicSvg } from '../relic_art.js';

function summarizeStarterDeck(deckIds) {
  const counts = new Map();
  for (const id of deckIds) {
    counts.set(id, (counts.get(id) ?? 0) + 1);
  }
  return [...counts.entries()].map(([cardId, qty]) => {
    const def = CARD_LIBRARY[cardId];
    const desc = def
      ? formatCardDescription({ instanceId: `preview_${cardId}`, cardId, upgraded: false })
      : null;
    return {
      cardId,
      name: def?.name || cardId,
      qty,
      cost: desc?.displayCost ?? '1',
      desc: desc?.text || '',
    };
  });
}

export function renderCharacterSelectHeader({ menuView = 'home' } = {}) {
  if (menuView === 'home') {
    return `
      <header class="top-hud character-select-hud menu-home-hud">
        <div class="brand-cluster">
          <h1 class="game-title">杀戮尖塔<span class="title-subtitle"> · 简明版</span></h1>
          <span class="floor-indicator">尖塔大厅</span>
        </div>
      </header>
    `;
  }

  const modeLabel = menuView === 'daily' ? '每日挑战' : '标准攀登';
  return `
    <header class="top-hud character-select-hud submenu-hud">
      <div class="brand-cluster submenu-brand-cluster">
        <button
          type="button"
          id="btn-back-main-menu"
          class="btn-stone submenu-back-btn"
          data-action="open-menu-view"
          data-menu-view="home"
        >← 主菜单</button>
        <span class="floor-indicator">${escapeHtml(modeLabel)}</span>
      </div>
      <nav class="top-actions submenu-top-actions" aria-label="全局操作">
        <button type="button" id="btn-open-meta" class="btn-stone submenu-util-btn" data-action="open-modal" data-modal="meta" aria-label="进阶与生涯">
          <span class="nav-btn-emoji" aria-hidden="true">🏆</span><span class="submenu-util-label"> 进阶/生涯</span>
        </button>
        <button type="button" id="btn-open-compendium" class="btn-stone submenu-util-btn" data-action="open-modal" data-modal="compendium" aria-label="尖塔图鉴">
          <span class="nav-btn-emoji" aria-hidden="true">📖</span><span class="submenu-util-label"> 图鉴</span>
        </button>
        <button type="button" id="btn-open-help" class="btn-stone submenu-util-btn" data-action="open-modal" data-modal="help" aria-label="词典与引导">
          <span class="nav-btn-emoji" aria-hidden="true">💡</span><span class="submenu-util-label"> 词典</span>
        </button>
        <button type="button" id="btn-open-settings" class="btn-stone submenu-util-btn" data-action="open-modal" data-modal="settings" aria-label="游戏设置">
          <span class="nav-btn-emoji" aria-hidden="true">⚙️</span><span class="submenu-util-label"> 设置</span>
        </button>
      </nav>
    </header>
  `;
}

function renderMainMenuScreen({ state, meta, ui, hasActiveRun }) {
  const dailySpec = getDailyChallengeSpec();
  const dailyBest = meta.dailyRecords?.[dailySpec.dateKey] || null;
  const activeCharDef = hasActiveRun && state ? getCharacterDef(state.characterId) : null;
  const activeRunMetaParts = [];
  if (hasActiveRun && state && activeCharDef) {
    activeRunMetaParts.push(`第 ${state.act ?? 1} 幕 · F${state.floor ?? 1}`);
    activeRunMetaParts.push(`生命 ${state.player.hp}/${state.player.maxHp}`);
    activeRunMetaParts.push(`金币 ${state.player.gold}`);
  }

  const trioCrestHtml = CHARACTER_IDS.map((charId) => {
    const def = CHARACTER_LIBRARY[charId];
    return `
      <div class="main-menu-crest-avatar theme-${escapeHtml(def.accentTheme)}" aria-hidden="true">
        ${getCharacterSvg(def.artKey, 'normal', 'tab')}
      </div>
    `;
  }).join('');

  const careerAscParts = CHARACTER_IDS.map((charId) => {
    const def = CHARACTER_LIBRARY[charId];
    const maxA = getMaxAscensionForCharacter(meta, def.id);
    return `${def.name} A${maxA}`;
  }).join(' · ');

  return `
    <section class="panel-stage main-menu-stage" id="main-menu-screen" aria-labelledby="main-menu-heading">
      <div class="main-menu-hero">
        <div class="main-menu-crest-row">${trioCrestHtml}</div>
        <h2 id="main-menu-heading" class="main-menu-title">杀戮尖塔</h2>
        <p class="main-menu-subtitle">构筑专属牌组 · 运筹遗物协同 · 征服尖塔之巅</p>
      </div>

      ${ui.notice ? `<div class="toast-banner ${ui.noticeTone === 'warn' ? 'warn' : ''}" style="margin-bottom:12px;">${escapeHtml(ui.notice)}</div>` : ''}

      <div class="main-menu-primary-stack">
        ${
          hasActiveRun && state && activeCharDef
            ? `
              <button
                type="button"
                id="btn-resume-active-run"
                class="menu-action-card menu-card-resume"
                data-action="resume-active-run"
              >
                <span class="menu-card-icon" aria-hidden="true">▶</span>
                <span class="menu-card-body">
                  <span class="menu-card-title-row">
                    <span class="menu-card-title">继续当前对局</span>
                    <span class="character-hud-pill char-${escapeHtml(activeCharDef.id)}">${escapeHtml(activeCharDef.name)}</span>
                    ${
                      state.dailyChallenge?.dateKey
                        ? `<span class="daily-pill">每日</span>`
                        : (state.ascension ?? 0) > 0
                          ? `<span class="ascension-pill">A${escapeHtml(state.ascension)}</span>`
                          : ''
                    }
                  </span>
                  <span class="menu-card-desc">${escapeHtml(activeRunMetaParts.join(' · '))}</span>
                </span>
                <span class="menu-card-arrow" aria-hidden="true">→</span>
              </button>
            `
            : ''
        }

        <button
          type="button"
          id="btn-menu-standard"
          class="menu-action-card menu-card-standard ${hasActiveRun ? '' : 'menu-card-featured'}"
          data-action="open-menu-view"
          data-menu-view="standard"
        >
          <span class="menu-card-icon" aria-hidden="true">⚔️</span>
          <span class="menu-card-body">
            <span class="menu-card-title-row">
              <span class="menu-card-title">开始攀登</span>
              <span class="menu-card-tag">标准模式</span>
            </span>
            <span class="menu-card-desc">四职业自由选择 · 进阶 A0–A10 · 鲸鱼赐福开局</span>
          </span>
          <span class="menu-card-arrow" aria-hidden="true">→</span>
        </button>

        <button
          type="button"
          id="btn-menu-daily"
          class="menu-action-card menu-card-daily"
          data-action="open-menu-view"
          data-menu-view="daily"
        >
          <span class="menu-card-icon" aria-hidden="true">📅</span>
          <span class="menu-card-body">
            <span class="menu-card-title-row">
              <span class="menu-card-title">每日挑战</span>
              <span class="character-hud-pill char-${escapeHtml(dailySpec.characterId)}">${escapeHtml(dailySpec.characterName)}</span>
              <span class="ascension-pill">A${escapeHtml(dailySpec.ascension)}</span>
            </span>
            <span class="menu-card-desc">${
              dailyBest
                ? `今日最高 ${escapeHtml(dailyBest.bestScore.toLocaleString())} (${escapeHtml(dailyBest.bestGrade)}) · 同日同图冲分`
                : `${escapeHtml(dailySpec.dateKey)} · 全网同图同词条竞速`
            }</span>
          </span>
          <span class="menu-card-arrow" aria-hidden="true">→</span>
        </button>
      </div>

      <div class="main-menu-utility-grid" aria-label="系统入口">
        <button type="button" id="btn-open-meta" class="btn-stone menu-util-tile" data-action="open-modal" data-modal="meta">
          <span class="menu-util-icon" aria-hidden="true">🏆</span>
          <span class="menu-util-text">进阶与生涯</span>
        </button>
        <button type="button" id="btn-open-compendium" class="btn-stone menu-util-tile" data-action="open-modal" data-modal="compendium">
          <span class="menu-util-icon" aria-hidden="true">📖</span>
          <span class="menu-util-text">尖塔图鉴</span>
        </button>
        <button type="button" id="btn-open-help" class="btn-stone menu-util-tile" data-action="open-modal" data-modal="help">
          <span class="menu-util-icon" aria-hidden="true">💡</span>
          <span class="menu-util-text">词典与引导</span>
        </button>
        <button type="button" id="btn-open-settings" class="btn-stone menu-util-tile" data-action="open-modal" data-modal="settings">
          <span class="menu-util-icon" aria-hidden="true">⚙️</span>
          <span class="menu-util-text">游戏设置</span>
        </button>
      </div>

      <p class="main-menu-career-foot">最高解锁进阶：${escapeHtml(careerAscParts)}</p>
    </section>
  `;
}

function renderStandardCharacterSelectScreen({ meta, ui }) {
  const selectedId = ui.selectedCharacterId || meta.selectedCharacterId || 'ironclad';
  const selectedDef = getCharacterDef(selectedId);
  const maxAscAllowed = getMaxAscensionForCharacter(meta, selectedDef.id);
  const selectedAsc = Math.min(maxAscAllowed, meta.selectedAscension ?? 0);

  const cardsHtml = CHARACTER_IDS.map((charId) => {
    const def = CHARACTER_LIBRARY[charId];
    const isSelected = def.id === selectedDef.id;
    const starterRelic = RELIC_LIBRARY[def.starterRelic];
    const starterPotion = POTION_LIBRARY[def.starterPotion];
    const charProg = getCharacterProgress(meta, def.id);
    const charMaxAsc = getMaxAscensionForCharacter(meta, def.id);
    const winRate =
      charProg.runsPlayed > 0
        ? Math.round((charProg.victories / charProg.runsPlayed) * 100)
        : 0;
    const hpVal = selectedAsc >= 4 ? def.asc4MaxHp : def.maxHp;
    const startHp = selectedAsc >= 6 ? Math.max(1, hpVal - Math.floor(hpVal * 0.1)) : hpVal;
    const deckSummary = summarizeStarterDeck(def.starterDeck);

    const archetypeHtml = def.archetypes
      .map((tag) => `<span class="char-archetype-chip theme-${escapeHtml(def.accentTheme)}">${escapeHtml(tag)}</span>`)
      .join('');

    const deckChipsHtml = deckSummary
      .map(
        (item) => `
          <span
            class="char-deck-chip"
            tabindex="0"
            data-tooltip-title="${escapeHtml(`${item.name} (${item.cost} 费)`)}"
            data-tooltip-tag="初始牌组 ×${escapeHtml(item.qty)}"
            data-tooltip-desc="${escapeHtml(item.desc)}"
          >${escapeHtml(item.name)} ×${escapeHtml(item.qty)}</span>
        `
      )
      .join('');

    return `
      <article
        id="char-card-${escapeHtml(def.id)}"
        class="character-card theme-${escapeHtml(def.accentTheme)} ${isSelected ? 'selected' : ''}"
        role="button"
        tabindex="0"
        aria-pressed="${isSelected ? 'true' : 'false'}"
        data-action="select-character"
        data-character-id="${escapeHtml(def.id)}"
      >
        <div class="character-card-head">
          <div class="character-portrait-stage theme-${escapeHtml(def.accentTheme)}">
            ${getCharacterSvg(def.artKey)}
          </div>
          <div class="character-card-meta">
            <div class="character-name-row">
              <h2 class="character-name">${escapeHtml(def.name)}</h2>
              <span class="character-en-tag">${escapeHtml(def.englishName)}</span>
              ${isSelected ? '<span class="character-selected-badge">已选择</span>' : ''}
            </div>
            <p class="character-title-line">${escapeHtml(def.title)}</p>
            <div class="char-archetype-row">${archetypeHtml}</div>
          </div>
        </div>

        <p class="character-summary">${escapeHtml(def.summary)}</p>

        <div class="character-vitals-grid">
          <div class="char-stat-box">
            <span class="char-stat-label">${selectedAsc >= 6 ? '起始/最大生命' : '最大生命'}</span>
            <strong class="char-stat-val vital-hp">${escapeHtml(selectedAsc >= 6 ? `${startHp}/${hpVal}` : hpVal)}</strong>
          </div>
          <div class="char-stat-box">
            <span class="char-stat-label">初始金币</span>
            <strong class="char-stat-val vital-gold">${escapeHtml(def.startingGold)}</strong>
          </div>
          <div class="char-stat-box">
            <span class="char-stat-label">初始牌组</span>
            <strong class="char-stat-val">${escapeHtml(def.starterDeck.length)} 张</strong>
          </div>
        </div>

        <div class="char-career-strip" id="char-career-${escapeHtml(def.id)}">
          <span class="char-career-item">进阶解锁 <strong>A${escapeHtml(charMaxAsc)}</strong></span>
          <span class="char-career-item">胜/场 <strong>${escapeHtml(charProg.victories)}/${escapeHtml(charProg.runsPlayed)}</strong>${charProg.runsPlayed > 0 ? ` (${winRate}%)` : ''}</span>
          <span class="char-career-item">最高分 <strong>${escapeHtml((charProg.bestScore ?? 0).toLocaleString())}</strong></span>
        </div>

        <div class="character-gear-row">
          ${
            starterRelic
              ? `<span
                  class="relic-badge tier-starter"
                  tabindex="0"
                  data-tooltip-title="${escapeHtml(`${getRelicIcon(starterRelic.id)} ${starterRelic.name}`)}"
                  data-tooltip-tag="${escapeHtml(RELIC_TIER_LABELS.starter)}"
                  data-tooltip-desc="${escapeHtml(starterRelic.description)}"
                  data-tooltip-tone="relic"
                ><span class="relic-icon" aria-hidden="true">${getRelicSvg(starterRelic.id, { scope: `char-${def.id}` })}</span><span>遗物 · ${escapeHtml(starterRelic.name)}</span></span>`
              : ''
          }
          ${
            starterPotion
              ? `<span
                  class="char-potion-pill"
                  tabindex="0"
                  data-tooltip-title="${escapeHtml(starterPotion.name)}"
                  data-tooltip-tag="初始药水"
                  data-tooltip-desc="${escapeHtml(starterPotion.description)}"
                  data-tooltip-tone="potion"
                ><span class="potion-inline-sm" aria-hidden="true">${getPotionIconSvg(starterPotion.id, 18, { scope: `char-pot-${def.id}` })}</span><span>药水 · ${escapeHtml(starterPotion.name)}</span></span>`
              : ''
          }
        </div>

        <div class="character-deck-preview">
          <span class="char-deck-label">起手牌组：</span>
          <div class="char-deck-chips">${deckChipsHtml}</div>
        </div>
      </article>
    `;
  }).join('');

  const ascPillsHtml = ASCENSION_DEFS.map((def) => {
    const unlocked = def.level <= maxAscAllowed;
    const active = def.level === selectedAsc;
    if (!unlocked) {
      return `
        <span
          class="asc-pill-tooltip-anchor"
          tabindex="0"
          data-tooltip-title="${escapeHtml(def.name)}"
          data-tooltip-tag="通关上一阶解锁"
          data-tooltip-desc="${escapeHtml(def.description)}"
          data-tooltip-tone="debuff"
        >
          <button
            type="button"
            id="btn-char-asc-${def.level}"
            class="char-asc-pill"
            data-action="select-ascension"
            data-ascension="${def.level}"
            disabled
          >
            A${def.level}
          </button>
        </span>
      `;
    }
    return `
      <button
        type="button"
        id="btn-char-asc-${def.level}"
        class="char-asc-pill ${active ? 'active' : ''}"
        data-action="select-ascension"
        data-ascension="${def.level}"
        data-tooltip-title="${escapeHtml(def.name)}"
        data-tooltip-tag="${active ? '当前已选进阶' : '点击切换进阶'}"
        data-tooltip-desc="${escapeHtml(def.description)}"
        data-tooltip-tone="${def.level > 0 ? 'debuff' : 'buff'}"
      >
        A${def.level}
      </button>
    `;
  }).join('');

  const ascDef = ASCENSION_DEFS[selectedAsc] || ASCENSION_DEFS[0];

  const mobileTabsHtml = CHARACTER_IDS.map((charId) => {
    const def = CHARACTER_LIBRARY[charId];
    const isSelected = def.id === selectedDef.id;
    const charMaxAsc = getMaxAscensionForCharacter(meta, def.id);
    return `
      <button
        type="button"
        id="mobile-char-tab-${escapeHtml(def.id)}"
        class="mobile-char-tab theme-${escapeHtml(def.accentTheme)} ${isSelected ? 'active' : ''}"
        role="tab"
        aria-selected="${isSelected ? 'true' : 'false'}"
        data-action="select-character"
        data-character-id="${escapeHtml(def.id)}"
      >
        <span class="mobile-char-tab-portrait">${getCharacterSvg(def.artKey, 'normal', 'tab')}</span>
        <span class="mobile-char-tab-name">${escapeHtml(def.name)}</span>
        <span class="mobile-char-tab-meta">A${escapeHtml(charMaxAsc)}</span>
      </button>
    `;
  }).join('');

  const seedTrimmed = (ui.seedInput || '').trim();
  const seedDrawerOpen = Boolean(ui.seedDrawerOpen);

  return `
    <section class="panel-stage character-select-stage" id="character-select-screen" aria-labelledby="char-select-heading">
      <div class="stage-header character-select-header">
        <div>
          <h2 id="char-select-heading" class="stage-heading">选择你的尖塔攀登者</h2>
          <p class="stage-subtitle">每位角色拥有专属牌库、初始遗物与核心流派，开局进入第 0 层涅奥鲸鱼赐福。</p>
        </div>
      </div>

      ${ui.notice ? `<div class="toast-banner ${ui.noticeTone === 'warn' ? 'warn' : ''}" style="margin-bottom:12px;">${escapeHtml(ui.notice)}</div>` : ''}

      <div class="mobile-char-tabs" id="mobile-char-tabs" role="tablist" aria-label="切换攀登角色">
        ${mobileTabsHtml}
      </div>

      <div class="character-select-grid">
        ${cardsHtml}
      </div>

      <div class="character-launch-dock theme-${escapeHtml(selectedDef.accentTheme)}">
        <div class="launch-config-col">
          <div class="launch-asc-row">
            <span class="launch-label">进阶难度：</span>
            <div class="char-asc-group" role="group" aria-label="选择进阶难度">${ascPillsHtml}</div>
            <span class="launch-asc-note">${escapeHtml(ascDef.name)}</span>
          </div>
          <p class="launch-asc-desc" id="launch-asc-desc">${escapeHtml(ascDef.description)}</p>
          <div class="launch-seed-collapsible">
            <button
              type="button"
              id="btn-toggle-seed-drawer"
              class="btn-stone seed-drawer-toggle ${seedDrawerOpen ? 'open' : ''} ${seedTrimmed ? 'has-value' : ''}"
              data-action="toggle-seed-drawer"
              aria-expanded="${seedDrawerOpen ? 'true' : 'false'}"
              aria-controls="seed-drawer-body"
            >
              <span>🔑 ${seedTrimmed ? `自定义种子已填（${escapeHtml(seedTrimmed.slice(0, 14))}${seedTrimmed.length > 14 ? '…' : ''}）` : '种子 / 挑战链接（可选）'}</span>
              <span class="seed-drawer-caret" aria-hidden="true">${seedDrawerOpen ? '▾' : '▸'}</span>
            </button>
            ${
              seedDrawerOpen
                ? `
                  <div class="launch-seed-row" id="seed-drawer-body">
                    <input
                      type="text"
                      id="char-seed-input"
                      class="spire-input char-seed-input"
                      aria-label="种子或挑战链接"
                      placeholder="留空随机开局，或输入种子码 / 挑战链接 / ?daily=日期"
                      value="${escapeHtml(ui.seedInput || '')}"
                      maxlength="240"
                    />
                  </div>
                `
                : ''
            }
          </div>
        </div>

        <div class="launch-cta-col">
          <button
            type="button"
            id="btn-start-character-run"
            class="btn-brass btn-launch-hero theme-${escapeHtml(selectedDef.accentTheme)}"
            data-action="start-character-run"
          >
            以【${escapeHtml(selectedDef.name)}】踏入尖塔 →
          </button>
        </div>
      </div>
    </section>
  `;
}

function renderDailyChallengeScreen({ meta, ui }) {
  const dailySpec = getDailyChallengeSpec();
  const dailyHeroDef = getCharacterDef(dailySpec.characterId);
  const dailyAscDef = ASCENSION_DEFS[dailySpec.ascension] || ASCENSION_DEFS[0];
  const dailyBest = meta.dailyRecords?.[dailySpec.dateKey] || null;
  const starterRelic = RELIC_LIBRARY[dailyHeroDef.starterRelic];

  const dailyModsHtml = dailySpec.modifiers
    .map(
      (mod) => `
        <span
          class="daily-mod-chip tone-${escapeHtml(mod.tone)}"
          tabindex="0"
          data-tooltip-title="${escapeHtml(mod.name)}"
          data-tooltip-tag="今日词条 · ${escapeHtml(mod.shortTag)}"
          data-tooltip-desc="${escapeHtml(mod.description)}"
          data-tooltip-tone="${mod.tone === 'challenge' ? 'debuff' : 'buff'}"
        >${escapeHtml(mod.name)}</span>
      `
    )
    .join('');

  const dailyModCardsHtml = dailySpec.modifiers
    .map(
      (mod) => `
        <div class="daily-mod-detail-card tone-${escapeHtml(mod.tone)}">
          <div class="daily-mod-detail-head">
            <strong class="daily-mod-detail-name">${escapeHtml(mod.name)}</strong>
            <span class="daily-mod-detail-tag">${escapeHtml(mod.shortTag)}</span>
          </div>
          <p class="daily-mod-detail-desc">${escapeHtml(mod.description)}</p>
        </div>
      `
    )
    .join('');

  return `
    <section class="panel-stage daily-screen-stage" id="daily-challenge-screen" aria-labelledby="daily-screen-heading">
      <div class="stage-header daily-screen-header">
        <div>
          <h2 id="daily-screen-heading" class="stage-heading">📅 今日每日挑战</h2>
          <p class="stage-subtitle">全网同日同地图、同职业与随机进阶（A0–A6）统一开局，不提供第 0 层鲸鱼赐福。</p>
        </div>
      </div>

      ${ui.notice ? `<div class="toast-banner ${ui.noticeTone === 'warn' ? 'warn' : ''}" style="margin-bottom:12px;">${escapeHtml(ui.notice)}</div>` : ''}

      <div class="daily-challenge-banner daily-page-card" id="daily-challenge-banner" aria-label="今日每日挑战">
        <div class="daily-page-hero-row">
          <div class="character-portrait-stage daily-page-portrait theme-${escapeHtml(dailyHeroDef.accentTheme)}">
            ${getCharacterSvg(dailyHeroDef.artKey)}
          </div>
          <div class="daily-page-meta">
            <div class="daily-banner-top">
              <span
                class="daily-pill"
                tabindex="0"
                data-tooltip-title="每日挑战 · ${escapeHtml(dailySpec.dateKey)}"
                data-tooltip-tag="种子 ${escapeHtml(dailySpec.seedCode)} · 无鲸鱼赐福"
                data-tooltip-desc="${escapeHtml(`全网同日同图同进阶（${dailySpec.characterName} · 进阶 ${dailySpec.ascension}），不提供初始鲸鱼赐福。`)}"
                data-tooltip-tone="relic"
              >每日挑战 · ${escapeHtml(dailySpec.dateKey)}</span>
              <span class="character-hud-pill char-${escapeHtml(dailySpec.characterId)}">${escapeHtml(dailySpec.characterName)}</span>
              <span
                class="ascension-pill"
                id="daily-banner-ascension-pill"
                tabindex="0"
                data-tooltip-title="${escapeHtml(dailyAscDef.name)}"
                data-tooltip-tag="今日随机进阶（A0–A6）· 无鲸鱼赐福"
                data-tooltip-desc="${escapeHtml(`${dailyAscDef.description}（每日挑战不提供初始鲸鱼赐福，全网同日同进阶同起点。）`)}"
                data-tooltip-tone="${dailySpec.ascension > 0 ? 'debuff' : 'buff'}"
              >进阶 ${escapeHtml(dailySpec.ascension)}</span>
              <code class="seed-code-tag daily-page-seed">${escapeHtml(dailySpec.seedCode)}</code>
              ${
                dailyBest
                  ? `<span class="daily-best-pill">今日最高 ${escapeHtml(dailyBest.bestScore.toLocaleString())} (${escapeHtml(dailyBest.bestGrade)})</span>`
                  : ''
              }
            </div>
            <p class="daily-page-asc-note">
              <strong>${escapeHtml(dailyAscDef.name)}</strong>：${escapeHtml(dailyAscDef.description)}
              ${
                starterRelic
                  ? ` · 初始遗物 <span class="relic-inline-icon relic-inline-sm" aria-hidden="true">${getRelicSvg(starterRelic.id, { scope: 'daily' })}</span>【${escapeHtml(starterRelic.name)}】`
                  : ''
              }
            </p>
            <div class="daily-mod-row">${dailyModsHtml}</div>
          </div>
        </div>

        <div class="daily-mod-detail-grid" aria-label="今日词条详情">
          ${dailyModCardsHtml}
        </div>

        <div class="daily-page-actions">
          <button
            type="button"
            id="btn-copy-daily-link"
            class="btn-stone"
            data-action="copy-seed"
            data-daily-date="${escapeHtml(dailySpec.dateKey)}"
          >📋 复制今日挑战链接</button>
          <button
            type="button"
            id="btn-start-daily-challenge"
            class="btn-brass btn-launch-hero btn-daily-launch"
            data-action="start-daily-challenge"
            data-daily-date="${escapeHtml(dailySpec.dateKey)}"
          >开启今日挑战 →</button>
        </div>
      </div>
    </section>
  `;
}

export function renderCharacterSelectScreen({ state, meta, ui, hasActiveRun }) {
  const menuView = ui.menuView || 'home';
  if (menuView === 'standard') {
    return renderStandardCharacterSelectScreen({ meta, ui });
  }
  if (menuView === 'daily') {
    return renderDailyChallengeScreen({ meta, ui });
  }
  return renderMainMenuScreen({ state, meta, ui, hasActiveRun });
}
