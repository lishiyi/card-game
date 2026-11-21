/**
 * Character Select Screen (Run Start / Switch Hero):
 * Side-by-side showcase for The Ironclad & The Silent with portraits, starter relics/potions,
 * archetype highlights, starter deck breakdown, Ascension quick-pick, and optional seed launcher.
 */

import { CARD_LIBRARY, formatCardDescription } from '../../data/cards.js';
import { CHARACTER_IDS, CHARACTER_LIBRARY, getCharacterDef } from '../../data/characters.js';
import { POTION_LIBRARY, RELIC_LIBRARY, RELIC_TIER_LABELS } from '../../data/relics.js';
import { getDailyChallengeSpec } from '../../engine/daily.js';
import {
  ASCENSION_DEFS,
  getCharacterProgress,
  getMaxAscensionForCharacter,
  MAX_ASCENSION,
} from '../../engine/meta.js';
import { escapeHtml } from '../helpers.js';
import { getCharacterSvg } from '../icons.js';

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

export function renderCharacterSelectHeader({ hasActiveRun }) {
  return `
    <header class="top-hud character-select-hud">
      <div class="brand-cluster">
        <h1 class="game-title">杀戮尖塔 · 简明版</h1>
        <span class="floor-indicator">选择攀登角色</span>
      </div>
      <nav class="top-actions" aria-label="全局操作">
        ${
          hasActiveRun
            ? `<button type="button" id="btn-resume-active-run" class="btn-brass" data-action="resume-active-run">← 返回当前对局</button>`
            : ''
        }
        <button type="button" id="btn-open-meta" class="btn-stone" data-action="open-modal" data-modal="meta">
          进阶/生涯
        </button>
        <button type="button" id="btn-open-help" class="btn-stone" data-action="open-modal" data-modal="help">
          词典/引导
        </button>
        <button type="button" id="btn-open-settings" class="btn-stone" data-action="open-modal" data-modal="settings">
          设置
        </button>
      </nav>
    </header>
  `;
}

export function renderCharacterSelectScreen({ meta, ui, hasActiveRun }) {
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
                  data-tooltip-title="${escapeHtml(starterRelic.name)}"
                  data-tooltip-tag="${escapeHtml(RELIC_TIER_LABELS.starter)}"
                  data-tooltip-desc="${escapeHtml(starterRelic.description)}"
                  data-tooltip-tone="relic"
                >遗物 · ${escapeHtml(starterRelic.name)}</span>`
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
                >药水 · ${escapeHtml(starterPotion.name)}</span>`
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
    return `
      <button
        type="button"
        id="btn-char-asc-${def.level}"
        class="char-asc-pill ${active ? 'active' : ''}"
        data-action="select-ascension"
        data-ascension="${def.level}"
        data-tooltip-title="${escapeHtml(def.name)}"
        data-tooltip-tag="${unlocked ? '点击切换进阶' : '通关上一阶解锁'}"
        data-tooltip-desc="${escapeHtml(def.description)}"
        ${unlocked ? '' : 'disabled'}
      >
        A${def.level}
      </button>
    `;
  }).join('');

  const ascDef = ASCENSION_DEFS[selectedAsc] || ASCENSION_DEFS[0];
  const dailySpec = getDailyChallengeSpec();
  const dailyAscDef = ASCENSION_DEFS[dailySpec.ascension] || ASCENSION_DEFS[0];
  const dailyBest = meta.dailyRecords?.[dailySpec.dateKey] || null;
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
        >${escapeHtml(mod.name)} · ${escapeHtml(mod.shortTag)}</span>
      `
    )
    .join('');

  return `
    <section class="panel-stage character-select-stage" id="character-select-screen" aria-labelledby="char-select-heading">
      <div class="stage-header character-select-header">
        <div>
          <h2 id="char-select-heading" class="stage-heading">选择你的尖塔攀登者</h2>
          <p class="stage-subtitle">每位角色拥有专属牌库、初始遗物、专属药水与截然不同的核心流派。常规模式开局进入第 0 层鲸鱼赐福，每日挑战则由随机进阶（A0–A6）与当日词条统一开局。</p>
        </div>
      </div>

      ${ui.notice ? `<div class="toast-banner ${ui.noticeTone === 'warn' ? 'warn' : ''}" style="margin-bottom:14px;">${escapeHtml(ui.notice)}</div>` : ''}

      <div class="daily-challenge-banner" id="daily-challenge-banner" aria-label="今日每日挑战">
        <div class="daily-banner-main">
          <div class="daily-banner-top">
            <span class="daily-pill">每日挑战 · ${escapeHtml(dailySpec.dateKey)}</span>
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
            <code class="seed-code-tag">${escapeHtml(dailySpec.seedCode)}</code>
            ${
              dailyBest
                ? `<span class="daily-best-pill">今日最高 ${escapeHtml(dailyBest.bestScore.toLocaleString())} 分 (${escapeHtml(dailyBest.bestGrade)}) · 已战 ${escapeHtml(dailyBest.attempts)} 次</span>`
                : `<span class="daily-best-pill fresh">无鲸鱼赐福 · 全网同图同进阶冲分</span>`
            }
          </div>
          <div class="daily-mod-row">${dailyModsHtml}</div>
        </div>
        <div class="daily-banner-cta">
          <button
            type="button"
            id="btn-start-daily-challenge"
            class="btn-brass btn-daily-launch"
            data-action="start-daily-challenge"
            data-daily-date="${escapeHtml(dailySpec.dateKey)}"
          >
            开启今日挑战 →
          </button>
        </div>
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
          <div class="launch-seed-row">
            <label for="char-seed-input" class="launch-label">种子 / 挑战链接（可选）：</label>
            <input
              type="text"
              id="char-seed-input"
              class="spire-input char-seed-input"
              placeholder="留空随机开局，或输入种子码 / 挑战链接 / ?daily=日期"
              value="${escapeHtml(ui.seedInput || '')}"
              maxlength="240"
            />
          </div>
        </div>

        <div class="launch-cta-col">
          ${
            hasActiveRun
              ? `<button type="button" class="btn-stone" data-action="resume-active-run">继续原对局</button>`
              : ''
          }
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
