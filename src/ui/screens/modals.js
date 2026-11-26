/**
 * Modal overlays:
 * - Meta / Ascension / Seeded Run / Run History (#meta-progression-modal)
 * - Settings: Audio Volume & Animation Speed (#settings-modal)
 * - Help: Keyword & Status Glossary + 3-Step Onboarding Tutorial (#help-glossary-modal)
 * - Deck / Draw / Discard / Exhaust / Smith / Shop Purge / Unclaimed Loot Alert
 */

import { canUpgradeCard, CARD_LIBRARY, getCardCharacter, getCardStats } from '../../data/cards.js';
import { CHARACTER_IDS, CHARACTER_LIBRARY, getCharacterDef } from '../../data/characters.js';
import { ENEMY_TEMPLATES } from '../../data/enemies.js';
import { TOTAL_FLOORS } from '../../data/events.js';
import { getRelicIcon, POTION_LIBRARY, RELIC_LIBRARY, RELIC_TIER_LABELS } from '../../data/relics.js';
import { getDailyChallengeSpec, getDailyModifierDefs } from '../../engine/daily.js';
import {
  formatRelicUpgradeSummary,
  getActTotalFloors,
  getCurrentBossName,
  getUnclaimedImportantRewards,
  getUpgradableDeckCards,
} from '../../engine/game.js';
import {
  ASCENSION_DEFS,
  ensureCompendium,
  getCharacterProgress,
  getMaxAscensionForCharacter,
  getScoreGrade,
  MAX_ASCENSION,
  UNLOCK_TIERS,
} from '../../engine/meta.js';
import { formatSeedCode } from '../../engine/rng.js';
import { getEnemySvg } from '../enemy_art.js';
import { getGlossaryEntries, TUTORIAL_STEPS } from '../glossary.js';
import { escapeHtml, renderCardHtml } from '../helpers.js';
import { getPotionIconSvg, getUndiscoveredPotionSvg } from '../icons.js';
import { getRelicSvg, getUndiscoveredRelicSvg } from '../relic_art.js';
import { ANIM_SPEED_OPTIONS } from '../settings.js';
import { getStatusSvg } from '../status_art.js';
import { renderMapBoardHtml, renderMapTypeFilterBar } from './map.js';

function formatRunDate(ts) {
  if (!Number.isFinite(ts)) return '';
  try {
    const d = new Date(ts);
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const mi = String(d.getMinutes()).padStart(2, '0');
    return `${mm}-${dd} ${hh}:${mi}`;
  } catch {
    return '';
  }
}

export function renderGlossaryItemsHtml(ui) {
  const entries = getGlossaryEntries();
  const cat = ui.glossaryCategory || 'all';
  const q = (ui.glossaryQuery || '').trim().toLowerCase();

  const filtered = entries.filter((item) => {
    if (cat !== 'all' && item.category !== cat) return false;
    if (!q) return true;
    return (
      item.name.toLowerCase().includes(q) ||
      item.tag.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q)
    );
  });

  if (filtered.length === 0) {
    return '<p class="stage-subtitle">没有匹配的关键词或状态，请尝试其他搜索词。</p>';
  }

  return filtered
    .map((item) => {
      const toneCls =
        item.category === 'buffs'
          ? 'tone-buff'
          : item.category === 'debuffs'
            ? 'tone-debuff'
            : 'tone-mechanic';
      const iconHtml = item.statusKey
        ? `<span class="glossary-status-icon" aria-hidden="true">${getStatusSvg(item.statusKey, {
            polarity: item.polarity,
            scope: 'gloss',
          })}</span>`
        : '';
      return `
        <article class="glossary-card ${toneCls}">
          <div class="glossary-card-head">
            <strong class="glossary-card-title">${iconHtml}<span>${escapeHtml(item.name)}</span></strong>
            <span class="glossary-card-tag">${escapeHtml(item.tag)}</span>
          </div>
          <p class="glossary-card-desc">${escapeHtml(item.description)}</p>
        </article>
      `;
    })
    .join('');
}

function getRankCssClass(grade) {
  if (grade === 'S+') return 'rank-sp';
  if (grade === 'S') return 'rank-s';
  if (grade === 'A') return 'rank-a';
  if (grade === 'B') return 'rank-b';
  return 'rank-c';
}

function renderMetaModal({ state, meta, ui }) {
  const maxTierXp = UNLOCK_TIERS[UNLOCK_TIERS.length - 1].xpRequired;
  const effectiveTier = meta.unlockAllOverride ? UNLOCK_TIERS.length : meta.unlockedTier ?? 0;
  const xpPct = meta.unlockAllOverride
    ? 100
    : Math.min(100, Math.round(((meta.xp ?? 0) / maxTierXp) * 100));
  const currentSeedCode = state ? formatSeedCode(state.seed) : '';
  const activeCharId = state?.characterId || ui.selectedCharacterId || meta.selectedCharacterId || 'ironclad';
  const activeCharDef = getCharacterDef(activeCharId);
  const maxAscAllowed = getMaxAscensionForCharacter(meta, activeCharId);
  const effectiveSelectedAsc = Math.min(maxAscAllowed, meta.selectedAscension ?? 0);

  const charArchiveHtml = CHARACTER_IDS.map((cid) => {
    const cDef = CHARACTER_LIBRARY[cid];
    const prog = getCharacterProgress(meta, cid);
    const cMaxAsc = getMaxAscensionForCharacter(meta, cid);
    const winRate =
      prog.runsPlayed > 0 ? Math.round((prog.victories / prog.runsPlayed) * 100) : 0;
    const isActive = cid === activeCharId;
    return `
      <div class="meta-char-card ${isActive ? 'active' : ''}" id="meta-char-card-${escapeHtml(cid)}">
        <div class="meta-char-card-head">
          <span class="character-hud-pill char-${escapeHtml(cid)}">${escapeHtml(cDef.name)}</span>
          <span class="ascension-pill">最高进阶 A${escapeHtml(cMaxAsc)}</span>
        </div>
        <div class="meta-char-stats">
          <span>胜/场：<strong>${escapeHtml(prog.victories)}/${escapeHtml(prog.runsPlayed)}</strong>${prog.runsPlayed > 0 ? ` (${winRate}%)` : ''}</span>
          <span>最高层：<strong>${escapeHtml(prog.bestFloor ?? 0)}</strong></span>
          <span>最高分：<strong style="color:var(--accent-brass);">${escapeHtml((prog.bestScore ?? 0).toLocaleString())}</strong></span>
        </div>
      </div>
    `;
  }).join('');

  const dailySpec = getDailyChallengeSpec();
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
        >${escapeHtml(mod.name)}</span>
      `
    )
    .join('');

  const ascensionButtonsHtml = ASCENSION_DEFS.map((def) => {
    const unlocked = def.level <= maxAscAllowed;
    const isSelected = effectiveSelectedAsc === def.level;
    return `
      <button
        type="button"
        id="btn-select-ascension-${def.level}"
        class="ascension-btn ${isSelected ? 'active' : ''}"
        data-action="select-ascension"
        data-ascension="${def.level}"
        ${unlocked ? '' : 'disabled'}
      >
        <span class="choice-title">${escapeHtml(def.name)}${isSelected ? ' [已选]' : unlocked ? '' : ' [通关上一阶解锁]'}</span>
        <span class="choice-detail">${escapeHtml(def.description)}</span>
      </button>
    `;
  }).join('');

  const unlockTiersHtml = UNLOCK_TIERS.map((t) => {
    const isUnlocked = effectiveTier >= t.tier;
    const cardNames = t.cardIds.map((cid) => `【${CARD_LIBRARY[cid]?.name || cid}】`).join('、');
    const relicNames = t.relicIds.map((rid) => `【${RELIC_LIBRARY[rid]?.name || rid}】`).join('、');
    return `
      <div class="unlock-tier-card ${isUnlocked ? 'unlocked' : ''}">
        <div>
          <div style="font-weight:700;color:${isUnlocked ? 'var(--jade-upgrade)' : 'var(--text-ivory)'};">
            ${escapeHtml(t.title)} ${isUnlocked ? '（已解锁）' : `（需 ${t.xpRequired} XP）`}
          </div>
          <div style="font-size:0.81rem;color:var(--text-sand);margin-top:2px;">
            卡牌：${escapeHtml(cardNames)} · 遗物：${escapeHtml(relicNames)}
          </div>
        </div>
        <span style="font-size:0.78rem;font-family:var(--font-mono);color:${isUnlocked ? 'var(--jade-upgrade)' : 'var(--text-ash)'};">
          ${isUnlocked ? '✓ 已加入掉落池' : `${meta.xp ?? 0} / ${t.xpRequired} XP`}
        </span>
      </div>
    `;
  }).join('');

  const historyList = Array.isArray(meta.runHistory) ? meta.runHistory : [];
  const historyHtml =
    historyList.length === 0
      ? '<p class="stage-subtitle" style="margin:4px 0 0;">尚无已完成战绩记录。完成或折戟任意一局后，战绩、评分、遗物与完整牌组将自动保存在此供复盘。</p>'
      : `<div class="history-list" id="run-history-list">
          ${historyList
            .map((rec, idx) => {
              const isWin = rec.outcome === 'victory';
              const sCode = rec.seedCode || formatSeedCode(rec.seed);
              const dateLabel = formatRunDate(rec.timestamp);
              const recCharId = rec.characterId || 'ironclad';
              const recCharName = rec.characterName || getCharacterDef(recCharId).name;
              const recScore = Number.isFinite(rec.score) ? rec.score : null;
              const recGrade = rec.grade || (recScore !== null ? getScoreGrade(recScore) : '');
              const isDaily = Boolean(rec.dailyDateKey);
              return `
                <div class="history-row ${isWin ? 'win' : 'loss'}" data-history-idx="${idx}">
                  <div class="history-main">
                    <span class="history-badge ${isWin ? 'win' : 'loss'}">${isWin ? '凯旋' : '折戟'}</span>
                    <span class="character-hud-pill char-${escapeHtml(recCharId)}">${escapeHtml(recCharName)}</span>
                    ${isDaily ? `<span class="history-badge daily">每日 ${escapeHtml(rec.dailyDateKey.slice(5))}</span>` : rec.isChallenge ? `<span class="history-badge challenge">挑战</span>` : ''}
                    ${
                      recScore !== null
                        ? `<span class="history-score-pill ${getRankCssClass(recGrade)}">${escapeHtml(recScore.toLocaleString())}分 · ${escapeHtml(recGrade)}</span>`
                        : ''
                    }
                    <span class="history-floor">第 ${escapeHtml(rec.act ?? 1)} 幕 · F${escapeHtml(rec.floor ?? 1)}</span>
                    ${(rec.ascension ?? 0) > 0 ? `<span class="ascension-pill">进阶 ${escapeHtml(rec.ascension)}</span>` : ''}
                    ${(rec.combatRestarts ?? 0) > 0 ? `<span class="history-badge restart">🔄 重启 ${escapeHtml(rec.combatRestarts)}次</span>` : ''}
                    <span class="history-meta">牌组 ${escapeHtml(rec.deckSize ?? 0)} · 遗物 ${escapeHtml(rec.relicCount ?? 0)} · 斩敌 ${escapeHtml(rec.enemiesSlain ?? 0)}</span>
                    ${dateLabel ? `<span class="history-date">${escapeHtml(dateLabel)}</span>` : ''}
                  </div>
                  <div class="history-actions">
                    <code class="seed-code-tag">${escapeHtml(sCode)}</code>
                    <button
                      type="button"
                      class="btn-stone btn-compact"
                      data-action="inspect-history-run"
                      data-history-idx="${idx}"
                    >复盘</button>
                    <button
                      type="button"
                      class="btn-stone btn-compact"
                      data-action="copy-seed"
                      data-seed-code="${escapeHtml(sCode)}"
                      data-ascension="${escapeHtml(rec.ascension ?? 0)}"
                      data-character-id="${escapeHtml(recCharId)}"
                      data-daily-date="${escapeHtml(rec.dailyDateKey || '')}"
                    >复制链接</button>
                    <button
                      type="button"
                      class="btn-brass btn-compact"
                      data-action="${isDaily ? 'start-daily-challenge' : 'replay-history-seed'}"
                      data-daily-date="${escapeHtml(rec.dailyDateKey || '')}"
                      data-seed="${escapeHtml(rec.seed)}"
                      data-ascension="${escapeHtml(Math.min(maxAscAllowed, rec.ascension ?? 0))}"
                      data-character-id="${escapeHtml(recCharId)}"
                    >${isDaily ? '再战每日' : '重玩种子'}</button>
                  </div>
                </div>
              `;
            })
            .join('')}
        </div>`;

  return `
    <div class="modal-backdrop" id="modal-backdrop" data-action="close-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div class="modal-sheet" id="meta-progression-modal">
        <div class="modal-header">
          <div>
            <h2 id="modal-title" class="stage-heading">进阶挑战 · 每日挑战 · 历史复盘</h2>
            <p class="stage-subtitle">每日全网同图冲分、输入种子或粘贴挑战链接与好友同图竞速，点击任意战绩即可查看完整牌组与遗物复盘。</p>
          </div>
          <button type="button" id="btn-close-modal" class="btn-stone" data-action="close-modal">关闭 (Esc)</button>
        </div>

        <div class="modal-body">
          <div class="summary-stats" style="margin-top:0;">
            <span>总攀登场次：<strong>${escapeHtml(meta.runsPlayed ?? 0)}</strong></span>
            <span>凯旋通关：<strong>${escapeHtml(meta.victories ?? 0)}</strong></span>
            <span>最高推进总层数：<strong>${escapeHtml(meta.bestFloor ?? 0)} 层</strong></span>
            <span>最高战绩评分：<strong style="color:var(--accent-brass);">${escapeHtml((meta.bestScore ?? 0).toLocaleString())}</strong></span>
            <span>累计击败敌人：<strong>${escapeHtml(meta.totalEnemiesSlain ?? 0)}</strong></span>
            <span>累计历练：<strong style="color:var(--jade-upgrade);">${escapeHtml(meta.xp ?? 0)} XP</strong></span>
          </div>

          <div class="meta-section">
            <h3 style="margin:0 0 8px;">分角色攀登档案（独立进阶进度）</h3>
            <div class="meta-char-grid" id="meta-char-archive">${charArchiveHtml}</div>
          </div>

          <div class="meta-section">
            <div class="daily-challenge-banner compact" id="meta-daily-banner">
              <div class="daily-banner-main">
                <div class="daily-banner-top">
                  <span class="daily-pill">今日每日挑战 · ${escapeHtml(dailySpec.dateKey)}</span>
                  <span class="character-hud-pill char-${escapeHtml(dailySpec.characterId)}">${escapeHtml(dailySpec.characterName)}</span>
                  <span
                    class="ascension-pill"
                    tabindex="0"
                    data-tooltip-title="${escapeHtml((ASCENSION_DEFS[dailySpec.ascension] || ASCENSION_DEFS[0]).name)}"
                    data-tooltip-tag="今日随机进阶（A0–A6）· 无鲸鱼赐福"
                    data-tooltip-desc="${escapeHtml(`${(ASCENSION_DEFS[dailySpec.ascension] || ASCENSION_DEFS[0]).description}（每日挑战不提供初始鲸鱼赐福。）`)}"
                    data-tooltip-tone="${dailySpec.ascension > 0 ? 'debuff' : 'buff'}"
                  >进阶 ${escapeHtml(dailySpec.ascension)}</span>
                  ${
                    dailyBest
                      ? `<span class="daily-best-pill">今日最高 ${escapeHtml(dailyBest.bestScore.toLocaleString())} 分 (${escapeHtml(dailyBest.bestGrade)})</span>`
                      : ''
                  }
                </div>
                <div class="daily-mod-row">${dailyModsHtml}</div>
              </div>
              <button
                type="button"
                id="btn-meta-start-daily"
                class="btn-brass btn-compact"
                data-action="start-daily-challenge"
                data-daily-date="${escapeHtml(dailySpec.dateKey)}"
              >
                立即挑战 →
              </button>
            </div>
          </div>

          <div class="meta-section">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:8px;">
              <h3 style="margin:0;">用种子或挑战链接开局（当前角色：${escapeHtml(activeCharDef.name)}${currentSeedCode ? ` · 本局种子：${escapeHtml(currentSeedCode)}` : ''}）</h3>
              ${
                currentSeedCode
                  ? `<button
                      type="button"
                      id="btn-copy-active-seed"
                      class="btn-stone btn-compact"
                      data-action="copy-seed"
                      data-seed-code="${escapeHtml(currentSeedCode)}"
                      data-ascension="${escapeHtml(state.ascension ?? 0)}"
                      data-character-id="${escapeHtml(activeCharId)}"
                      data-daily-date="${escapeHtml(state.dailyChallenge?.dateKey || '')}"
                    >
                      复制挑战链接
                    </button>`
                  : ''
              }
            </div>
            <div class="seed-launcher-bar">
              <input
                type="text"
                id="seed-input-box"
                class="spire-input"
                placeholder="输入种子代码（如 S-16）或粘贴挑战链接（?seed=... / ?daily=YYYY-MM-DD）"
                value="${escapeHtml(ui.seedInput || '')}"
                maxlength="240"
                aria-label="指定种子代码或挑战链接"
              />
              <button type="button" id="btn-start-seeded-run" class="btn-brass" data-action="start-seeded-run">
                以此种子开启【${escapeHtml(activeCharDef.name)} · 进阶 ${escapeHtml(effectiveSelectedAsc)}】
              </button>
            </div>
          </div>

          <div class="meta-section">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:8px;">
              <h3 style="margin:0;">选择【${escapeHtml(activeCharDef.name)}】下局进阶难度（已解锁至 A${escapeHtml(maxAscAllowed)}${state ? ` · 本局进阶 ${escapeHtml(state.ascension ?? 0)}` : ''}）</h3>
              <button type="button" id="btn-start-ascension-run" class="btn-brass" data-action="start-ascension-run">
                以【${escapeHtml(activeCharDef.name)} · 进阶 ${escapeHtml(effectiveSelectedAsc)}】开启新局
              </button>
            </div>
            <div class="ascension-grid">${ascensionButtonsHtml}</div>
            <div style="display:flex;justify-content:flex-end;margin-top:10px;">
              <button type="button" id="btn-start-ascension-run-bottom" class="btn-brass" data-action="start-ascension-run">
                以【${escapeHtml(activeCharDef.name)} · 进阶 ${escapeHtml(effectiveSelectedAsc)}】开启新局
              </button>
            </div>
          </div>

          <div class="meta-section">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;">
              <h3 style="margin:0;">历练觉醒解锁进度（已解锁 ${effectiveTier} / ${UNLOCK_TIERS.length} 阶）</h3>
              ${
                meta.unlockAllOverride && maxAscAllowed >= MAX_ASCENSION
                  ? `<span style="font-size:0.8rem;color:var(--jade-upgrade);font-weight:700;">已开启全图鉴与全进阶</span>`
                  : ui.debugMode
                    ? `<button type="button" id="btn-unlock-all-meta" class="btn-stone" data-action="toggle-unlock-all">一键解锁全部进阶与图鉴（调试）</button>`
                    : ''
              }
            </div>
            <div class="xp-bar-track"><div class="xp-bar-fill" style="width: ${xpPct}%;"></div></div>
            <div class="unlock-tier-list">${unlockTiersHtml}</div>
          </div>

          <div class="meta-section">
            <h3>历史战绩编年史（最近 ${escapeHtml(historyList.length)} 场 · 点击“复盘”查看完整构筑）</h3>
            ${historyHtml}
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderHistoryDetailModal({ meta, ui }) {
  const idx = Number(ui.inspectedHistoryIdx);
  const rec = Array.isArray(meta.runHistory) ? meta.runHistory[idx] : null;
  if (!rec) {
    return renderMetaModal({ state: null, meta, ui });
  }

  const isWin = rec.outcome === 'victory';
  const recCharId = rec.characterId || 'ironclad';
  const recCharName = rec.characterName || getCharacterDef(recCharId).name;
  const sCode = rec.seedCode || formatSeedCode(rec.seed);
  const score = Number.isFinite(rec.score) ? rec.score : 0;
  const grade = rec.grade || getScoreGrade(score);
  const isDaily = Boolean(rec.dailyDateKey);
  const dailyMods = isDaily ? getDailyModifierDefs(rec.dailyModifierIds) : [];
  const maxAscAllowed = meta.unlockAllOverride ? MAX_ASCENSION : meta.maxAscensionUnlocked ?? 0;

  const relicsHtml = (rec.relicIds || [])
    .map((rid) => {
      const r = RELIC_LIBRARY[rid];
      if (!r) return '';
      const tierLabel = RELIC_TIER_LABELS[r.tier] || '遗物';
      const icon = getRelicIcon(rid);
      return `<span
        class="relic-badge tier-${escapeHtml(r.tier)}"
        tabindex="0"
        data-tooltip-title="${escapeHtml(`${icon} ${r.name}`)}"
        data-tooltip-tag="${escapeHtml(tierLabel)}"
        data-tooltip-desc="${escapeHtml(r.description)}"
        data-tooltip-tone="relic"
      ><span class="relic-icon" aria-hidden="true">${getRelicSvg(rid, { scope: 'report' })}</span><span>${escapeHtml(r.name)}</span></span>`;
    })
    .join('');

  const breakdownHtml = (rec.scoreBreakdown || [])
    .map(
      (item) => `
        <div class="score-breakdown-item">
          <span class="score-bd-label">${escapeHtml(item.label)}</span>
          <span class="score-bd-detail">${escapeHtml(item.detail)}</span>
          <strong class="score-bd-pts">+${escapeHtml(item.points)}</strong>
        </div>
      `
    )
    .join('');

  const deckCardsHtml =
    Array.isArray(rec.deckSummary) && rec.deckSummary.length > 0
      ? rec.deckSummary
          .map((item, cIdx) => {
            if (!CARD_LIBRARY[item.cardId]) return '';
            return renderCardHtml(
              {
                instanceId: `hist_${idx}_${cIdx}`,
                cardId: item.cardId,
                upgraded: Boolean(item.upgraded),
              },
              {
                idPrefix: 'history-card',
                disabled: true,
                stackCount: item.count,
              }
            );
          })
          .join('')
      : '<p class="stage-subtitle">该早期战绩未保存详细牌组快照。</p>';

  const dailyModsHtml = dailyMods
    .map(
      (mod) => `
        <span
          class="daily-mod-chip tone-${escapeHtml(mod.tone)}"
          tabindex="0"
          data-tooltip-title="${escapeHtml(mod.name)}"
          data-tooltip-tag="${escapeHtml(mod.shortTag)}"
          data-tooltip-desc="${escapeHtml(mod.description)}"
          data-tooltip-tone="${mod.tone === 'challenge' ? 'debuff' : 'buff'}"
        >${escapeHtml(mod.name)} · ${escapeHtml(mod.shortTag)}</span>
      `
    )
    .join('');

  const histRestarts = rec.combatRestarts ?? 0;

  return `
    <div class="modal-backdrop" id="modal-backdrop" data-action="close-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div class="modal-sheet" id="history-detail-modal">
        <div class="modal-header">
          <div>
            <h2 id="modal-title" class="stage-heading" style="color:${isWin ? 'var(--jade-upgrade)' : 'var(--rust-warn)'};">
              战绩复盘 · ${isWin ? (rec.heartVictory ? '心脏斩杀（真结局）' : '凯旋通关') : '攀登折戟'}（第 ${escapeHtml(rec.act ?? 1)} 幕 F${escapeHtml(rec.floor ?? 1)} / ${escapeHtml(getActTotalFloors(rec.act ?? 1))}）
            </h2>
            <p class="stage-subtitle">
              ${escapeHtml(formatRunDate(rec.timestamp))} · ${escapeHtml(recCharName)} · 种子 ${escapeHtml(sCode)}
              ${!isWin && rec.defeatedBy ? ` · 败于 ${escapeHtml(rec.defeatedBy)}` : ''}
            </p>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <button type="button" id="btn-history-back" class="btn-stone btn-compact" data-action="open-modal" data-modal="meta">← 返回列表</button>
            <button type="button" id="btn-close-modal" class="btn-stone btn-compact" data-action="close-modal">关闭 (Esc)</button>
          </div>
        </div>

        <div class="modal-body">
          <div class="battle-report-card ${isWin ? 'report-win' : 'report-loss'}">
            <div class="report-hero-row">
              <div class="report-identity">
                <div class="report-tags-row">
                  <span class="character-hud-pill char-${escapeHtml(recCharId)}">${escapeHtml(recCharName)}</span>
                  ${isDaily ? `<span class="daily-pill">每日挑战 ${escapeHtml(rec.dailyDateKey)}</span>` : ''}
                  ${(rec.ascension ?? 0) > 0 ? `<span class="ascension-pill">进阶 ${escapeHtml(rec.ascension)}</span>` : ''}
                  ${histRestarts > 0 ? `<span class="restart-count-pill">🔄 重启 ${escapeHtml(histRestarts)} 次</span>` : ''}
                  <code class="seed-code-tag">${escapeHtml(sCode)}</code>
                </div>
                ${dailyModsHtml ? `<div class="daily-mod-row" style="margin-top:6px;">${dailyModsHtml}</div>` : ''}
              </div>
              <div class="score-rank-badge ${getRankCssClass(grade)}">
                <span class="score-rank-letter">${escapeHtml(grade)}</span>
                <div class="score-rank-meta">
                  <span class="score-rank-label">战绩评分</span>
                  <strong class="score-rank-value">${escapeHtml(score.toLocaleString())}</strong>
                </div>
              </div>
            </div>

            <div class="report-stats-grid">
              <div class="report-stat-cell">
                <span class="report-stat-label">获胜战斗</span>
                <strong class="report-stat-val">${escapeHtml(rec.combatsWon ?? 0)}${(rec.perfectCombats ?? 0) > 0 ? ` <small class="stat-jade">(无伤 ${escapeHtml(rec.perfectCombats)})</small>` : ''}</strong>
              </div>
              <div class="report-stat-cell">
                <span class="report-stat-label">精英 / 强敌</span>
                <strong class="report-stat-val">${escapeHtml(rec.elitesSlain ?? 0)} / ${escapeHtml(rec.enemiesSlain ?? 0)}</strong>
              </div>
              <div class="report-stat-cell">
                <span class="report-stat-label">总输出伤害</span>
                <strong class="report-stat-val">${escapeHtml((rec.totalDamageDealt ?? 0).toLocaleString())}</strong>
              </div>
              <div class="report-stat-cell">
                <span class="report-stat-label">最高单次伤害</span>
                <strong class="report-stat-val">${escapeHtml((rec.highestSingleHit ?? 0).toLocaleString())}</strong>
              </div>
              <div class="report-stat-cell">
                <span class="report-stat-label">累计格挡</span>
                <strong class="report-stat-val">${escapeHtml((rec.totalBlockGained ?? 0).toLocaleString())}</strong>
              </div>
              <div class="report-stat-cell">
                <span class="report-stat-label">${histRestarts > 0 ? '牌组 / 重启战斗' : '牌组 / 遗物'}</span>
                <strong class="report-stat-val">${escapeHtml(rec.deckSize ?? 0)} 张 / ${histRestarts > 0 ? `<small class="stat-warn">重启 ${escapeHtml(histRestarts)} 次</small>` : `${escapeHtml(rec.relicCount ?? 0)} 件`}</strong>
              </div>
            </div>

            ${
              breakdownHtml
                ? `<div class="score-breakdown-wrap">
                    <div class="report-subhead">评分明细</div>
                    <div class="score-breakdown-grid">${breakdownHtml}</div>
                  </div>`
                : ''
            }

            <div class="report-relics-wrap">
              <div class="report-subhead">最终遗物（${escapeHtml(rec.relicIds?.length ?? rec.relicCount ?? 0)} 件）</div>
              <div class="report-relics-strip">${relicsHtml || '<span class="stage-subtitle">未记录遗物详情</span>'}</div>
            </div>
          </div>

          <div class="history-detail-actions">
            <button
              type="button"
              id="btn-copy-history-report"
              class="btn-brass"
              data-action="copy-history-report"
              data-history-idx="${idx}"
            >
              复制本局战绩卡
            </button>
            <button
              type="button"
              class="btn-stone"
              data-action="${isDaily ? 'start-daily-challenge' : 'replay-history-seed'}"
              data-daily-date="${escapeHtml(rec.dailyDateKey || '')}"
              data-seed="${escapeHtml(rec.seed)}"
              data-ascension="${escapeHtml(Math.min(maxAscAllowed, rec.ascension ?? 0))}"
              data-character-id="${escapeHtml(recCharId)}"
            >
              ${isDaily ? '再战该日每日挑战 →' : '以此种子再战 →'}
            </button>
          </div>

          <h3 style="margin:14px 0 8px;font-size:0.95rem;color:var(--text-sand);">
            最终牌组快照（共 ${escapeHtml(rec.deckSize ?? 0)} 张 · 相同牌自动合并展示数量）
          </h3>
          <div class="card-showcase">${deckCardsHtml}</div>
        </div>
      </div>
    </div>
  `;
}

function renderSettingsModal({ settings, ui }) {
  const speedButtonsHtml = ANIM_SPEED_OPTIONS.map((opt) => {
    const active = settings.animSpeed === opt.id;
    return `
      <button
        type="button"
        id="btn-anim-speed-${escapeHtml(opt.id)}"
        class="btn-stone ${active ? 'btn-active-choice' : ''}"
        data-action="set-anim-speed"
        data-speed="${escapeHtml(opt.id)}"
      >
        ${escapeHtml(opt.label)}
      </button>
    `;
  }).join('');

  const backupFeedback = ui?.backupFeedback || '';
  const backupTone = ui?.backupFeedbackTone === 'warn' ? 'warn' : 'ok';
  const backupText = ui?.backupJsonDraft || '';

  return `
    <div class="modal-backdrop" id="modal-backdrop" data-action="close-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div class="modal-sheet modal-medium-sheet" id="settings-modal">
        <div class="modal-header">
          <div>
            <h2 id="modal-title" class="stage-heading">⚙️ 游戏设置</h2>
            <p class="stage-subtitle">自定义音效、动画速度、防误触体验，并支持本地存档 JSON 一键备份导出与跨设备导入迁移。</p>
          </div>
          <button type="button" id="btn-close-modal" class="btn-stone" data-action="close-modal">关闭 (Esc)</button>
        </div>

        <div class="modal-body">
          <div class="settings-list">
            <div class="settings-row">
              <div>
                <div class="settings-label">战斗与界面音效</div>
                <div class="settings-desc">启用零外部依赖 Web Audio 实时合成音效（斩击、叠盾、破盾、铁砧锻造等）。</div>
              </div>
              <div style="display:flex;gap:8px;align-items:center;">
                <button
                  type="button"
                  id="btn-toggle-sound"
                  class="${settings.soundEnabled ? 'btn-brass' : 'btn-stone'}"
                  data-action="toggle-sound"
                >
                  ${settings.soundEnabled ? '音效：已开启' : '音效：已静音'}
                </button>
                <button type="button" id="btn-test-sound" class="btn-stone" data-action="test-sound" ${settings.soundEnabled ? '' : 'disabled'}>
                  试听
                </button>
              </div>
            </div>

            <div class="settings-row">
              <div>
                <div class="settings-label">主音量大小：<span id="settings-volume-label">${escapeHtml(settings.volume)}%</span></div>
                <div class="settings-desc">拖动滑块实时调节合成音效响度。</div>
              </div>
              <div class="settings-slider-wrap">
                <input
                  type="range"
                  id="input-sound-volume"
                  min="0"
                  max="100"
                  step="5"
                  value="${escapeHtml(settings.volume)}"
                  aria-label="主音量百分比"
                />
              </div>
            </div>

            <div class="settings-row">
              <div>
                <div class="settings-label">动画速度</div>
                <div class="settings-desc">调节出牌飞行、受击震动、发牌与护盾击碎动画节奏。</div>
              </div>
              <div class="segmented-group">
                ${speedButtonsHtml}
              </div>
            </div>

            <div class="settings-row">
              <div>
                <div class="settings-label">伤害与格挡飘字</div>
                <div class="settings-desc">受击扣血、治疗回血、获得护盾与破盾时在角色上方弹出动态数字。</div>
              </div>
              <button
                type="button"
                id="btn-toggle-damage-numbers"
                class="${settings.showDamageNumbers ? 'btn-brass' : 'btn-stone'}"
                data-action="toggle-damage-numbers"
              >
                ${settings.showDamageNumbers ? '飘字：显示' : '飘字：隐藏'}
              </button>
            </div>

            <div class="settings-row">
              <div>
                <div class="settings-label">二段点击确认出牌（防误触）</div>
                <div class="settings-desc">开启后，点击手牌先高亮并预览斩杀/破盾与联动提示，再次点击该牌（或直接上滑拖出）才真正打出；非常适合手机端防误触。</div>
              </div>
              <button
                type="button"
                id="btn-toggle-mobile-tap-confirm"
                class="${settings.mobileTapConfirm ? 'btn-brass' : 'btn-stone'}"
                data-action="toggle-mobile-tap-confirm"
              >
                ${settings.mobileTapConfirm ? '二段确认：已开启' : '二段确认：已关闭'}
              </button>
            </div>

            <div class="settings-row">
              <div>
                <div class="settings-label">地图顶部新手提示条</div>
                <div class="settings-desc">恢复第 1 层出发前的新手快捷引导横幅。</div>
              </div>
              <button type="button" id="btn-reset-tutorial" class="btn-stone" data-action="reset-tutorial">
                重新开启新手提示
              </button>
            </div>

            <div class="settings-backup-box" id="settings-backup-box">
              <div class="settings-backup-head">
                <div>
                  <div class="settings-label">💾 存档备份与迁移（导出 / 导入）</div>
                  <div class="settings-desc">包含进阶解锁、生涯战绩、图鉴进度、设置偏好与当前进行中的对局；导入前自动执行格式与字段完整性校验。</div>
                </div>
              </div>
              <div class="settings-backup-actions">
                <button type="button" id="btn-export-save-file" class="btn-brass btn-compact" data-action="export-save-file">
                  💾 下载存档 (.json)
                </button>
                <button type="button" id="btn-copy-save-json" class="btn-stone btn-compact" data-action="copy-save-json">
                  📋 复制存档 JSON
                </button>
                <button type="button" id="btn-trigger-import-file" class="btn-stone btn-compact" data-action="trigger-import-save-file">
                  📂 选择文件导入
                </button>
                <input
                  type="file"
                  id="input-import-save-file"
                  accept=".json,application/json"
                  style="display:none;"
                  aria-label="选择 JSON 存档文件"
                />
              </div>
              <div class="settings-backup-paste">
                <textarea
                  id="input-import-save-json"
                  class="spire-textarea"
                  rows="3"
                  placeholder="也可在此粘贴已导出的 JSON 存档文本，然后点击下方「校验并导入存档」……"
                  aria-label="粘贴存档 JSON 文本"
                >${escapeHtml(backupText)}</textarea>
                <button type="button" id="btn-import-save-json" class="btn-stone btn-compact" data-action="import-save-json">
                  📥 校验并导入存档
                </button>
              </div>
              ${
                backupFeedback
                  ? `<div id="settings-backup-feedback" class="settings-backup-feedback tone-${backupTone}" role="status">${escapeHtml(backupFeedback)}</div>`
                  : ''
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderHelpModal({ ui }) {
  const activeTab = ui.helpTab || 'glossary';
  const activeCat = ui.glossaryCategory || 'all';

  let contentHtml = '';
  if (activeTab === 'tutorial') {
    const stepsHtml = TUTORIAL_STEPS.map(
      (s) => `
        <div class="tutorial-step-card">
          <span class="tutorial-step-badge">${escapeHtml(s.badge)}</span>
          <h3 class="tutorial-step-title">${escapeHtml(s.title)}</h3>
          <p class="tutorial-step-body">${escapeHtml(s.body)}</p>
        </div>
      `
    ).join('');

    contentHtml = `
      <div class="tutorial-grid">
        ${stepsHtml}
      </div>
      <div class="summary-stats" style="margin-top:16px;flex-direction:column;gap:6px;">
        <strong style="color:var(--accent-brass);">伤害与格挡速算公式（悬停敌人时手牌自动实时预览！）</strong>
        <span>• 攻击最终伤害 = 向下取整( (基础伤害 + 力量) × [自身虚弱 0.75] × [目标易伤 1.5，有纸蛙为 1.75] )</span>
        <span>• 技能最终格挡 = 向下取整( (基础格挡 + 敏捷) × [自身脆弱 0.75] )</span>
        <span>• 快捷键与触控：战斗中按 <strong>1–9</strong> 出牌、<strong>E</strong> 结束回合、<strong>D</strong> 查看牌组、<strong>M</strong> 查看地图、<strong>Esc</strong> 取消选中；手机端可<strong>左右滑选手牌、上滑直接拖出牌</strong>，或在设置中开启二段点击确认防误触！</span>
      </div>
    `;
  } else {
    const categories = [
      { id: 'all', label: '全部词条' },
      { id: 'mechanics', label: '核心机制' },
      { id: 'buffs', label: '正面状态' },
      { id: 'debuffs', label: '负面状态' },
    ];
    const catBtns = categories
      .map(
        (c) => `
          <button
            type="button"
            class="btn-stone btn-compact ${activeCat === c.id ? 'btn-active-choice' : ''}"
            data-action="set-glossary-cat"
            data-category="${escapeHtml(c.id)}"
          >${escapeHtml(c.label)}</button>
        `
      )
      .join('');

    contentHtml = `
      <div class="glossary-toolbar">
        <input
          type="search"
          id="input-glossary-search"
          class="spire-input"
          placeholder="搜索关键词（例如：力量、易伤、消耗、无色、每日、残虐天性...）"
          value="${escapeHtml(ui.glossaryQuery || '')}"
          aria-label="搜索关键词词典"
        />
        <div class="segmented-group">${catBtns}</div>
      </div>
      <div class="glossary-grid" id="glossary-results-container">
        ${renderGlossaryItemsHtml(ui)}
      </div>
    `;
  }

  return `
    <div class="modal-backdrop" id="modal-backdrop" data-action="close-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div class="modal-sheet" id="help-glossary-modal">
        <div class="modal-header">
          <div>
            <h2 id="modal-title" class="stage-heading">尖塔百科 · 关键词词典与新手引导</h2>
            <p class="stage-subtitle">随时查阅所有卡牌词条、增益/减益状态结算规则与三步上手攻略。</p>
          </div>
          <button type="button" id="btn-close-modal" class="btn-stone" data-action="close-modal">关闭 (Esc)</button>
        </div>

        <div class="modal-body">
          <div class="help-tab-bar" role="tablist">
            <button
              type="button"
              id="tab-help-glossary"
              class="btn-stone ${activeTab === 'glossary' ? 'btn-active-choice' : ''}"
              data-action="switch-help-tab"
              data-help-tab="glossary"
            >
              关键词与状态词典
            </button>
            <button
              type="button"
              id="tab-help-tutorial"
              class="btn-stone ${activeTab === 'tutorial' ? 'btn-active-choice' : ''}"
              data-action="switch-help-tab"
              data-help-tab="tutorial"
            >
              三步新手引导
            </button>
          </div>

          ${contentHtml}
        </div>
      </div>
    </div>
  `;
}

function renderMapModal({ state, ui }) {
  const act = state.act ?? 1;
  const actTotalFloors = getActTotalFloors(state);
  const actLabel =
    act >= 4
      ? '第四幕 · 终末尖顶地图'
      : act >= 3
        ? '第三幕 · 深渊圣殿地图'
        : act >= 2
          ? '第二幕 · 钢铁城邦地图'
          : '第一幕 · 尖塔攀登地图';
  const bossName = getCurrentBossName(state);
  const floorNum = Math.max(1, state.floor || 1);

  return `
    <div class="modal-backdrop" id="modal-backdrop" data-action="close-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div class="modal-sheet modal-map-sheet" id="map-inspector-modal">
        <div class="modal-header">
          <div>
            <h2 id="modal-title" class="stage-heading">
              ${actLabel}（当前第 ${escapeHtml(floorNum)} / ${escapeHtml(actTotalFloors)} 层）
            </h2>
            <p class="stage-subtitle">
              只读路线预览：点击任意房间可高亮其直接相连房间，点选下方图例可按类型高亮全图房间，第 ${escapeHtml(actTotalFloors)} 层首领为【${escapeHtml(bossName)}】。
            </p>
          </div>
          <button type="button" id="btn-close-modal" class="btn-stone" data-action="close-modal">关闭 (Esc / M)</button>
        </div>
        <div class="modal-body">
          <div class="map-legend-strip" aria-hidden="true">
            <span class="map-legend-item"><i class="legend-swatch swatch-active"></i>下层可选路线</span>
            <span class="map-legend-item"><i class="legend-swatch swatch-traveled"></i>已攀登足迹</span>
            <span class="map-legend-item"><i class="legend-swatch swatch-reachable"></i>后续可达分支</span>
          </div>
          ${renderMapTypeFilterBar(state, ui?.mapTypeFilter || null)}
          ${renderMapBoardHtml(state, { interactive: false, idPrefix: 'map-modal-node' })}
        </div>
      </div>
    </div>
  `;
}

function renderScryChoiceModal({ state }) {
  const pending = state?.combat?.pendingCardChoice;
  if (!pending || pending.mode !== 'scry') return '';
  const candidates = Array.isArray(pending.candidates) ? pending.candidates : [];
  const selectedSet = new Set(pending.selectedIds || []);
  const discardCount = selectedSet.size;
  const keepCount = Math.max(0, candidates.length - discardCount);

  const cardsHtml = candidates
    .map((c, idx) =>
      renderCardHtml(c, {
        idPrefix: 'scry-card',
        action: 'toggle-scry-card',
        playable: true,
        scrySelectable: true,
        scryMarkedDiscard: selectedSet.has(c.instanceId),
        hotkey: idx < 9 ? idx + 1 : undefined,
        combatContext: {
          player: state.player,
          combat: state.combat,
        },
      })
    )
    .join('');

  return `
    <div class="modal-backdrop" id="modal-backdrop" data-action="noop" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div class="modal-sheet scry-modal-sheet" id="scry-choice-modal">
        <div class="modal-header scry-modal-header">
          <div class="scry-header-copy">
            <h2 id="modal-title" class="stage-heading">预见（Scry）· ${escapeHtml(pending.sourceName)}</h2>
            <p class="stage-subtitle">抽牌堆顶 ${escapeHtml(candidates.length)} 张牌（从左至右依次抽取）。点击标记弃置，未标记按原序保留。</p>
          </div>
          <button type="button" id="btn-confirm-scry" class="btn-brass scry-confirm-btn" data-action="confirm-scry-choice">
            确认预见（弃置 ${escapeHtml(discardCount)} · 保留 ${escapeHtml(keepCount)}）
          </button>
        </div>
        <div class="modal-body">
          <div class="card-showcase scry-showcase" id="scry-card-list">${cardsHtml}</div>
        </div>
      </div>
    </div>
  `;
}

function renderDiscardPileChoiceModal({ state }) {
  const pending = state?.combat?.pendingCardChoice;
  if (
    !pending ||
    (pending.mode !== 'discard_to_draw' &&
      pending.mode !== 'retrieve_discard_retain' &&
      pending.mode !== 'retrieve_discard_to_hand' &&
      pending.mode !== 'pick_from_draw')
  ) {
    return '';
  }
  const candidates = Array.isArray(pending.candidates) ? pending.candidates : [];
  const selectedSet = new Set(pending.selectedIds || []);
  const isMeditate = pending.mode === 'retrieve_discard_retain';
  const isDrawPick = pending.mode === 'pick_from_draw';
  const isDiscardToHand = pending.mode === 'retrieve_discard_to_hand';

  const heading = isMeditate
    ? `冥想 · 从弃牌堆取回并保留（${pending.sourceName}）`
    : isDrawPick
      ? `搜寻 · 从抽牌堆检索（${pending.sourceName}）`
      : isDiscardToHand
        ? `全息取回 · 从弃牌堆加入手牌（${pending.sourceName}）`
        : `弃牌置顶 · ${pending.sourceName}`;
  const subtitle = isMeditate
    ? `点击选择最多 ${pending.count} 张弃牌加入手牌并赋予本回合保留（已选 ${selectedSet.size}/${pending.count}），完成后点击确认。`
    : isDrawPick
      ? `点击选择 ${pending.remaining} 张抽牌堆中的卡牌直接加入手牌（已按费用与名称排序）。`
      : isDiscardToHand
        ? `点击选择 ${pending.remaining} 张弃牌直接加入手牌。`
        : `点击选择 ${pending.remaining} 张弃牌直接置于抽牌堆顶（下一张抽到）。`;
  const pickLabel = isMeditate
    ? '点击取回保留'
    : isDrawPick
      ? '点击检索入手'
      : isDiscardToHand
        ? '点击取回入手'
        : '点击置于牌堆顶';

  const cardsHtml = candidates
    .map((c, idx) =>
      renderCardHtml(c, {
        idPrefix: 'discard-choice-card',
        action: isMeditate ? 'toggle-discard-choice-card' : 'resolve-card-choice',
        playable: true,
        selected: isMeditate && selectedSet.has(c.instanceId),
        discardPickSelectable: true,
        discardPickSelected: isMeditate && selectedSet.has(c.instanceId),
        discardPickLabel: pickLabel,
        hotkey: idx < 9 ? idx + 1 : undefined,
        combatContext: {
          player: state.player,
          combat: state.combat,
        },
      })
    )
    .join('');

  return `
    <div class="modal-backdrop" id="modal-backdrop" data-action="noop" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div class="modal-sheet scry-modal-sheet" id="discard-choice-modal" data-choice-mode="${escapeHtml(pending.mode)}">
        <div class="modal-header scry-modal-header">
          <div class="scry-header-copy">
            <h2 id="modal-title" class="stage-heading">${escapeHtml(heading)}</h2>
            <p class="stage-subtitle">${escapeHtml(subtitle)}</p>
          </div>
          ${
            isMeditate
              ? `<button type="button" id="btn-confirm-discard-choice" class="btn-brass scry-confirm-btn" data-action="confirm-discard-choice">
                  确认取回（已选 ${escapeHtml(selectedSet.size)}/${escapeHtml(pending.count)}）${pending.endTurnAfter ? '并结束回合' : ''}
                </button>`
              : ''
          }
        </div>
        <div class="modal-body">
          <div class="card-showcase scry-showcase" id="discard-choice-card-list">${cardsHtml}</div>
        </div>
      </div>
    </div>
  `;
}

function renderCompendiumModal({ meta, ui }) {
  const comp = ensureCompendium(meta);
  const revealAll = Boolean(meta?.unlockAllOverride);
  const discoveredCards = new Set(comp.cards);
  const discoveredRelics = new Set(comp.relics);
  const discoveredPotions = new Set(comp.potions);
  const discoveredEnemies = new Set(comp.enemies);

  const tab = ui.compendiumTab || 'cards';
  const charFilter = ui.compendiumCharFilter || 'all';
  const relicTierFilter = ui.compendiumRelicTier || 'all';
  const showUpgraded = Boolean(ui.compendiumShowUpgraded);

  const allCardIds = Object.keys(CARD_LIBRARY);
  const allRelicIds = Object.keys(RELIC_LIBRARY);
  const allPotionIds = Object.keys(POTION_LIBRARY);
  const allEnemyIds = Object.keys(ENEMY_TEMPLATES);

  const countSeen = (ids, set) => (revealAll ? ids.length : ids.filter((id) => set.has(id)).length);
  const cardSeen = countSeen(allCardIds, discoveredCards);
  const relicSeen = countSeen(allRelicIds, discoveredRelics);
  const potionSeen = countSeen(allPotionIds, discoveredPotions);
  const enemySeen = countSeen(allEnemyIds, discoveredEnemies);

  const RARITY_LABELS = {
    starter: '初始',
    common: '普通',
    uncommon: '罕见',
    rare: '稀有',
    special: '衍生',
    status: '状态',
    curse: '诅咒',
  };
  const CLASS_LABELS = {
    ironclad: '铁甲战士',
    silent: '静默猎手',
    watcher: '观者',
    defect: '故障机器人',
    colorless: '无色',
    any: '通用',
  };
  const KIND_LABELS = {
    normal: '普通敌人',
    elite: '精英强敌',
    boss: '关底首领',
  };

  let progressCurrent = cardSeen;
  let progressTotal = allCardIds.length;
  let contentHtml = '';

  if (tab === 'cards') {
    const classOrder = { ironclad: 0, silent: 1, watcher: 2, defect: 3, colorless: 4, special: 5 };
    const rarityOrder = { starter: 0, common: 1, uncommon: 2, rare: 3, special: 4, status: 5, curse: 6 };
    const getCardGroup = (def) => {
      if (def.type === 'curse' || def.type === 'status' || def.rarity === 'special') return 'special';
      return getCardCharacter(def) || 'ironclad';
    };
    const filteredIds = allCardIds
      .filter((id) => charFilter === 'all' || getCardGroup(CARD_LIBRARY[id]) === charFilter)
      .sort((a, b) => {
        const ca = CARD_LIBRARY[a];
        const cb = CARD_LIBRARY[b];
        return (
          (classOrder[getCardGroup(ca)] ?? 9) - (classOrder[getCardGroup(cb)] ?? 9) ||
          (rarityOrder[ca.rarity] ?? 9) - (rarityOrder[cb.rarity] ?? 9) ||
          a.localeCompare(b)
        );
      });

    const charChips = [
      ['all', '全部'],
      ['ironclad', '铁甲战士'],
      ['silent', '静默猎手'],
      ['watcher', '观者'],
      ['defect', '故障机器人'],
      ['colorless', '无色'],
      ['special', '衍生/状态/诅咒'],
    ]
      .map(
        ([key, label]) => `
          <button
            type="button"
            class="filter-chip ${charFilter === key ? 'active' : ''}"
            data-action="set-compendium-char"
            data-char-filter="${escapeHtml(key)}"
          >${escapeHtml(label)}</button>
        `
      )
      .join('');

    const cardsGridHtml = filteredIds
      .map((cardId) => {
        const def = CARD_LIBRARY[cardId];
        const seen = revealAll || discoveredCards.has(cardId);
        if (!seen) {
          const rLabel = RARITY_LABELS[def.rarity] || '卡牌';
          return `
            <div class="compendium-silhouette-card rarity-${escapeHtml(def.rarity || 'common')}" data-compendium-id="${escapeHtml(cardId)}" data-discovered="false">
              <div class="compendium-silhouette-cost">?</div>
              <div class="compendium-silhouette-art" aria-hidden="true"><span>?</span></div>
              <div class="compendium-silhouette-name">未发现卡牌</div>
              <div class="compendium-silhouette-meta">${escapeHtml(rLabel)} · 攀登中解锁</div>
            </div>
          `;
        }
        const canUp = canUpgradeCard({ cardId, upgraded: false });
        const previewInst = {
          instanceId: `comp_${cardId}`,
          cardId,
          upgraded: Boolean(showUpgraded && canUp),
        };
        return renderCardHtml(previewInst, {
          idPrefix: 'compendium-card',
          action: 'noop',
          playable: false,
          disabled: true,
        });
      })
      .join('');

    contentHtml = `
      <div class="compendium-toolbar">
        <div class="glossary-filter-chips">${charChips}</div>
        <button
          type="button"
          id="btn-compendium-toggle-upgrade"
          class="filter-chip ${showUpgraded ? 'active' : ''}"
          data-action="toggle-compendium-upgrade"
        >
          ${showUpgraded ? '✓ 升级预览 (+)' : '查看升级 (+)'}
        </button>
      </div>
      <div class="card-showcase compendium-card-grid" id="compendium-cards-grid">${cardsGridHtml}</div>
    `;
  } else if (tab === 'relics') {
    progressCurrent = relicSeen;
    progressTotal = allRelicIds.length;
    const tierOrder = { starter: 0, common: 1, uncommon: 2, rare: 3, shop: 4, event: 5, boss: 6 };
    const filteredIds = allRelicIds
      .filter((id) => relicTierFilter === 'all' || RELIC_LIBRARY[id].tier === relicTierFilter)
      .sort((a, b) => (tierOrder[RELIC_LIBRARY[a].tier] ?? 9) - (tierOrder[RELIC_LIBRARY[b].tier] ?? 9));

    const tierChips = [
      ['all', '全部'],
      ['starter', '初始'],
      ['common', '普通'],
      ['uncommon', '罕见'],
      ['rare', '稀有'],
      ['shop', '商店'],
      ['event', '事件'],
      ['boss', '首领'],
    ]
      .map(
        ([key, label]) => `
          <button
            type="button"
            class="filter-chip ${relicTierFilter === key ? 'active' : ''}"
            data-action="set-compendium-tier"
            data-tier-filter="${escapeHtml(key)}"
          >${escapeHtml(label)}</button>
        `
      )
      .join('');

    const relicsGridHtml = filteredIds
      .map((relicId) => {
        const r = RELIC_LIBRARY[relicId];
        const seen = revealAll || discoveredRelics.has(relicId);
        const tierLabel = RELIC_TIER_LABELS[r.tier] || '遗物';
        const ownerLabel = CLASS_LABELS[r.character || 'any'] || '通用';
        if (!seen) {
          return `
            <article class="compendium-entry-card undiscovered" data-compendium-id="${escapeHtml(relicId)}" data-discovered="false">
              <div class="compendium-entry-head">
                <span class="compendium-entry-name"><span class="relic-icon relic-icon-comp" aria-hidden="true">${getUndiscoveredRelicSvg(`u-${relicId}`)}</span><span>???</span></span>
                <span class="relic-badge tier-${escapeHtml(r.tier)}">${escapeHtml(tierLabel)}</span>
              </div>
              <p class="compendium-entry-desc">尚未在尖塔冒险中发现这件遗物。</p>
            </article>
          `;
        }
        return `
          <article class="compendium-entry-card" data-compendium-id="${escapeHtml(relicId)}" data-discovered="true">
            <div class="compendium-entry-head">
              <span class="compendium-entry-name"><span class="relic-icon relic-icon-comp" aria-hidden="true">${getRelicSvg(relicId, { scope: 'comp' })}</span><span>${escapeHtml(r.name)}</span></span>
              <div class="compendium-entry-badges">
                <span class="relic-badge tier-${escapeHtml(r.tier)}">${escapeHtml(tierLabel)}</span>
                <span class="compendium-owner-pill">${escapeHtml(ownerLabel)}</span>
              </div>
            </div>
            <p class="compendium-entry-desc">${escapeHtml(r.description)}</p>
          </article>
        `;
      })
      .join('');

    contentHtml = `
      <div class="compendium-toolbar">
        <div class="glossary-filter-chips">${tierChips}</div>
      </div>
      <div class="compendium-entry-grid" id="compendium-relics-grid">${relicsGridHtml}</div>
    `;
  } else if (tab === 'potions') {
    progressCurrent = potionSeen;
    progressTotal = allPotionIds.length;
    const targetLabels = { enemy: '单体敌人', all_enemies: '全体敌人', self: '自身' };

    const potionsGridHtml = allPotionIds
      .map((potionId) => {
        const p = POTION_LIBRARY[potionId];
        const seen = revealAll || discoveredPotions.has(potionId);
        const ownerLabel = CLASS_LABELS[p.character || 'any'] || '通用';
        const targetLabel = targetLabels[p.target] || '自身';
        if (!seen) {
          return `
            <article class="compendium-entry-card undiscovered" data-compendium-id="${escapeHtml(potionId)}" data-discovered="false">
              <div class="compendium-entry-head">
                <span class="compendium-entry-name"><span class="potion-icon-comp" aria-hidden="true">${getUndiscoveredPotionSvg(26)}</span><span>???</span></span>
                <span class="compendium-owner-pill">${escapeHtml(ownerLabel)}</span>
              </div>
              <p class="compendium-entry-desc">尚未在战利品、炼金师或商店中发现此药水。</p>
            </article>
          `;
        }
        return `
          <article class="compendium-entry-card" data-compendium-id="${escapeHtml(potionId)}" data-discovered="true">
            <div class="compendium-entry-head">
              <span class="compendium-entry-name"><span class="potion-icon-comp" aria-hidden="true">${getPotionIconSvg(potionId, 26, { scope: `comp-${potionId}` })}</span><span>${escapeHtml(p.name)}</span></span>
              <div class="compendium-entry-badges">
                <span class="compendium-owner-pill">${escapeHtml(ownerLabel)}</span>
                <span class="compendium-owner-pill">${escapeHtml(targetLabel)}</span>
              </div>
            </div>
            <p class="compendium-entry-desc">${escapeHtml(p.description)}</p>
          </article>
        `;
      })
      .join('');

    contentHtml = `<div class="compendium-entry-grid" id="compendium-potions-grid">${potionsGridHtml}</div>`;
  } else {
    progressCurrent = enemySeen;
    progressTotal = allEnemyIds.length;
    const kindOrder = { normal: 0, elite: 1, boss: 2 };
    const sortedEnemyIds = [...allEnemyIds].sort((a, b) => {
      const ea = ENEMY_TEMPLATES[a];
      const eb = ENEMY_TEMPLATES[b];
      return (kindOrder[ea.kind] ?? 9) - (kindOrder[eb.kind] ?? 9) || a.localeCompare(b);
    });

    const enemiesGridHtml = sortedEnemyIds
      .map((enemyId) => {
        const e = ENEMY_TEMPLATES[enemyId];
        const seen = revealAll || discoveredEnemies.has(enemyId);
        const kindLabel = KIND_LABELS[e.kind] || '敌人';
        const hpRange = Array.isArray(e.hpRange) ? `${e.hpRange[0]}–${e.hpRange[1]} HP` : '';
        return `
          <article class="compendium-enemy-card ${seen ? '' : 'undiscovered'}" data-compendium-id="${escapeHtml(enemyId)}" data-discovered="${seen ? 'true' : 'false'}">
            <div class="compendium-enemy-portrait ${seen ? '' : 'silhouette'}" aria-hidden="true">
              ${getEnemySvg(enemyId)}
            </div>
            <div class="compendium-enemy-info">
              <div class="compendium-entry-head">
                <span class="compendium-entry-name">${seen ? escapeHtml(e.name) : '???'}</span>
                <span class="compendium-kind-pill kind-${escapeHtml(e.kind || 'normal')}">${escapeHtml(kindLabel)}</span>
              </div>
              <p class="compendium-entry-desc">
                ${
                  seen
                    ? escapeHtml(`${e.subtitle || '尖塔敌对生物'}${hpRange ? ` · 基础生命 ${hpRange}` : ''}`)
                    : '尚未在战斗中遭遇此敌人。'
                }
              </p>
            </div>
          </article>
        `;
      })
      .join('');

    contentHtml = `<div class="compendium-enemy-grid" id="compendium-enemies-grid">${enemiesGridHtml}</div>`;
  }

  const pct = progressTotal > 0 ? Math.round((progressCurrent / progressTotal) * 100) : 0;

  return `
    <div class="modal-backdrop" id="modal-backdrop" data-action="close-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div class="modal-sheet modal-compendium-sheet" id="compendium-modal">
        <div class="modal-header">
          <div>
            <h2 id="modal-title" class="stage-heading">尖塔全览图鉴</h2>
            <p class="stage-subtitle">已发现 ${escapeHtml(progressCurrent)} / ${escapeHtml(progressTotal)}（${escapeHtml(pct)}%）· 冒险中遇到的卡牌、遗物、药水与怪物会自动收录</p>
          </div>
          <button type="button" id="btn-close-modal" class="btn-stone" data-action="close-modal">关闭 (Esc)</button>
        </div>
        <div class="modal-body">
          <div class="help-tab-bar compendium-tab-bar" role="tablist" aria-label="图鉴分页">
            <button type="button" id="btn-comp-tab-cards" class="help-tab-btn ${tab === 'cards' ? 'active' : ''}" data-action="set-compendium-tab" data-tab="cards">
              卡牌 (${escapeHtml(cardSeen)}/${escapeHtml(allCardIds.length)})
            </button>
            <button type="button" id="btn-comp-tab-relics" class="help-tab-btn ${tab === 'relics' ? 'active' : ''}" data-action="set-compendium-tab" data-tab="relics">
              遗物 (${escapeHtml(relicSeen)}/${escapeHtml(allRelicIds.length)})
            </button>
            <button type="button" id="btn-comp-tab-potions" class="help-tab-btn ${tab === 'potions' ? 'active' : ''}" data-action="set-compendium-tab" data-tab="potions">
              药水 (${escapeHtml(potionSeen)}/${escapeHtml(allPotionIds.length)})
            </button>
            <button type="button" id="btn-comp-tab-enemies" class="help-tab-btn ${tab === 'enemies' ? 'active' : ''}" data-action="set-compendium-tab" data-tab="enemies">
              敌人 (${escapeHtml(enemySeen)}/${escapeHtml(allEnemyIds.length)})
            </button>
          </div>
          <div class="xp-bar-track compendium-progress-track"><div class="xp-bar-fill" style="width: ${pct}%;"></div></div>
          ${contentHtml}
        </div>
      </div>
    </div>
  `;
}

export function renderModal({ state, meta, settings, ui }) {
  if (!ui.modal) {
    if (state?.screen === 'combat' && state?.combat?.status === 'ongoing') {
      const pendingMode = state?.combat?.pendingCardChoice?.mode;
      if (pendingMode === 'scry') {
        return renderScryChoiceModal({ state });
      }
      if (
        pendingMode === 'discard_to_draw' ||
        pendingMode === 'retrieve_discard_retain' ||
        pendingMode === 'retrieve_discard_to_hand' ||
        pendingMode === 'pick_from_draw'
      ) {
        return renderDiscardPileChoiceModal({ state });
      }
    }
    return '';
  }

  if (ui.modal === 'meta') {
    return renderMetaModal({ state, meta, ui });
  }

  if (ui.modal === 'compendium') {
    return renderCompendiumModal({ meta, ui });
  }

  if (ui.modal === 'history_detail') {
    return renderHistoryDetailModal({ meta, ui });
  }

  if (ui.modal === 'settings') {
    return renderSettingsModal({ settings, ui });
  }

  if (ui.modal === 'help') {
    return renderHelpModal({ ui });
  }

  if (ui.modal === 'confirm_challenge') {
    const req = ui.pendingChallenge;
    if (!req || !state) {
      ui.modal = null;
      return '';
    }
    const curSeed = formatSeedCode(state.seed);
    const curAct = state.act ?? 1;
    const curFloor = Math.max(0, state.floor ?? 0);
    const curCharName = state.player?.name || getCharacterDef(state.characterId).name;

    let headingText = '收到好友种子挑战邀请！';
    let descHtml = '';
    if (req.isDaily && req.dailyDateKey) {
      const spec = getDailyChallengeSpec(req.dailyDateKey);
      headingText = `收到每日挑战邀请（${spec.dateKey}）！`;
      const modText = spec.modifiers.map((m) => `【${m.name}】`).join('、');
      descHtml = `挑战角色：<strong>${escapeHtml(spec.characterName)}</strong> · 难度：<strong>进阶 ${escapeHtml(spec.ascension)}</strong>（无鲸鱼赐福） · 日期种子：<strong style="font-family:var(--font-mono);color:var(--accent-brass);">${escapeHtml(spec.seedCode)}</strong> · 规则词条：<strong>${escapeHtml(modText)}</strong>。`;
    } else {
      const ascLabel = `进阶 ${req.ascension ?? 0}`;
      const reqCharDef = getCharacterDef(req.characterId);
      descHtml = `挑战角色：<strong>${escapeHtml(reqCharDef.name)}</strong> · 目标种子：<strong style="font-family:var(--font-mono);color:var(--accent-brass);">${escapeHtml(req.seedCode)}</strong> · 难度：<strong>${escapeHtml(ascLabel)}</strong>（本局将临时对齐全图鉴卡池与目标进阶，不修改你的本地生涯解锁进度）。`;
    }

    return `
      <div class="modal-backdrop" id="modal-backdrop" data-action="decline-challenge" role="alertdialog" aria-modal="true" aria-labelledby="modal-title" aria-describedby="challenge-invite-desc">
        <div class="modal-sheet modal-confirm-sheet" id="challenge-invite-modal">
          <div class="modal-header">
            <div>
              <h2 id="modal-title" class="stage-heading" style="color: var(--accent-brass);">${escapeHtml(headingText)}</h2>
              <p id="challenge-invite-desc" class="stage-subtitle" style="margin-top:6px;font-size:0.92rem;color:var(--text-ivory);line-height:1.55;">
                ${descHtml}
              </p>
            </div>
          </div>
          <div class="modal-body">
            <div class="challenge-current-save-note">
              你本地尚有一局进行中的存档（${escapeHtml(curCharName)} · 种子 <code>${escapeHtml(curSeed)}</code> · 第 ${escapeHtml(curAct)} 幕 · 第 ${escapeHtml(curFloor)} 层 · 生命 ${escapeHtml(state.player.hp)}/${escapeHtml(state.player.maxHp)}）。是否覆盖当前进度并接受挑战？
            </div>
            <div class="confirm-actions">
              <button type="button" id="btn-decline-challenge" class="btn-stone" data-action="decline-challenge">保留当前进度</button>
              <button type="button" id="btn-accept-challenge" class="btn-brass" data-action="accept-challenge">接受挑战并开新局 →</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  if (!state) return '';

  if (ui.modal === 'confirm_new_run') {
    const curAct = state.act ?? 1;
    const curFloor = Math.max(0, state.floor ?? 0);
    const curCharName = state.player?.name || getCharacterDef(state.characterId).name;
    const relicCount = state.player?.relics?.length ?? 0;
    const deckCount = state.player?.deck?.length ?? 0;
    return `
      <div class="modal-backdrop" id="modal-backdrop" data-action="close-modal-backdrop" role="alertdialog" aria-modal="true" aria-labelledby="modal-title" aria-describedby="new-run-confirm-desc">
        <div class="modal-sheet modal-confirm-sheet" id="confirm-new-run-modal">
          <div class="modal-header">
            <div>
              <h2 id="modal-title" class="stage-heading" style="color: var(--accent-brass);">离开当前对局？</h2>
              <p id="new-run-confirm-desc" class="stage-subtitle" style="margin-top:6px;font-size:0.92rem;color:var(--text-ivory);line-height:1.55;">
                你正处于一局进行中的冒险，前往角色选择界面后，仍可点击顶部「继续当前对局」随时回来。确认暂离并前往选角 / 开新局吗？
              </p>
            </div>
          </div>
          <div class="modal-body">
            <div class="challenge-current-save-note">
              当前对局：<strong>${escapeHtml(curCharName)}</strong> · 第 ${escapeHtml(curAct)} 幕 F${escapeHtml(curFloor)} · 生命 <strong>${escapeHtml(state.player.hp)}/${escapeHtml(state.player.maxHp)}</strong> · 金币 ${escapeHtml(state.player.gold)} · 遗物 ${escapeHtml(relicCount)} 件 · 牌组 ${escapeHtml(deckCount)} 张
            </div>
            <div class="confirm-actions">
              <button type="button" id="btn-cancel-new-run" class="btn-stone" data-action="close-modal">继续当前对局 (Esc)</button>
              <button type="button" id="btn-confirm-new-run" class="btn-brass" data-action="confirm-new-run">前往选择角色 / 开启新局 →</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  if (ui.modal === 'map') {
    return renderMapModal({ state, ui });
  }

  if (ui.modal === 'neow_action') {
    const action = state.neowState?.pendingAction;
    if (!action) {
      ui.modal = null;
      return '';
    }

    let cards = [];
    let showUpgradePreview = false;
    if (action.type === 'pick_card') {
      cards = action.cards || [];
    } else if (action.type === 'upgrade') {
      cards = getUpgradableDeckCards(state);
      showUpgradePreview = true;
    } else {
      cards = state.player.deck;
    }

    const cardsHtml =
      cards.length > 0
        ? cards
            .map((c) =>
              renderCardHtml(c, {
                idPrefix: 'neow-card',
                action: 'complete-neow-action',
                playable: true,
                disabled: false,
                showUpgradePreview,
                characterId: state?.characterId,
              })
            )
            .join('')
        : '<p class="stage-subtitle">当前没有可选卡牌。</p>';

    const headerActions = [];
    if (action.type === 'pick_card') {
      headerActions.push(
        `<button type="button" id="btn-neow-skip-card" class="btn-stone" data-action="skip-neow-card">跳过卡牌</button>`
      );
    } else if (action.allowCancel) {
      headerActions.push(
        `<button type="button" id="btn-cancel-neow-action" class="btn-stone" data-action="cancel-neow-action">返回重选赐福 (Esc)</button>`
      );
    }

    return `
      <div class="modal-backdrop" id="modal-backdrop" data-action="${action.allowCancel ? 'cancel-neow-action' : 'noop'}" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div class="modal-sheet" id="neow-action-modal">
          <div class="modal-header">
            <div>
              <h2 id="modal-title" class="stage-heading">${escapeHtml(action.title)}</h2>
              ${action.subtitle ? `<p class="stage-subtitle">${escapeHtml(action.subtitle)}</p>` : ''}
            </div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;">${headerActions.join('')}</div>
          </div>
          <div class="modal-body">
            <div class="card-showcase">${cardsHtml}</div>
          </div>
        </div>
      </div>
    `;
  }

  if (ui.modal === 'confirm_skip_reward') {
    const check = getUnclaimedImportantRewards(state);
    if (!check.hasUnclaimed) {
      ui.modal = null;
      return '';
    }
    return `
      <div class="modal-backdrop" id="modal-backdrop" data-action="close-modal-backdrop" role="alertdialog" aria-modal="true" aria-labelledby="modal-title" aria-describedby="reward-skip-desc">
        <div class="modal-sheet modal-confirm-sheet" id="reward-unclaimed-modal">
          <div class="modal-header">
            <div>
              <h2 id="modal-title" class="stage-heading" style="color: var(--accent-brass);">还有战利品未拾取！</h2>
              <p id="reward-skip-desc" class="stage-subtitle" style="margin-top:6px;font-size:0.94rem;color:var(--text-ivory);">
                ${escapeHtml(check.message)}
              </p>
            </div>
          </div>
          <div class="modal-body">
            <div class="confirm-actions">
              <button type="button" id="btn-cancel-skip-reward" class="btn-stone" data-action="close-modal">返回拾取</button>
              <button type="button" id="btn-claim-and-proceed" class="btn-brass" data-action="claim-important-and-proceed">一键拾取并继续 →</button>
              <button type="button" id="btn-confirm-skip-reward" class="btn-stone btn-danger-subtle" data-action="confirm-proceed-reward">放弃并继续</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  if (ui.modal === 'relic_upgrade_reveal') {
    const pickup = ui.relicUpgradeReveal || state?.lastRelicPickup;
    if (!pickup || !pickup.upgradeType) {
      ui.modal = null;
      return '';
    }
    const summaryText = formatRelicUpgradeSummary(pickup);
    const upgradedDeckCards = (pickup.upgradedCards || []).map((entry) => {
      return (
        state?.player?.deck?.find((c) => c.instanceId === entry.instanceId) || {
          instanceId: entry.instanceId,
          cardId: entry.cardId,
          upgraded: true,
        }
      );
    });
    const cardsHtml =
      upgradedDeckCards.length > 0
        ? `<div class="card-showcase" id="relic-upgrade-reveal-cards">${upgradedDeckCards
            .map((c) =>
              renderCardHtml(c, {
                idPrefix: 'relic-upgraded-card',
                action: 'noop',
                playable: false,
                disabled: false,
                characterId: state?.characterId,
              })
            )
            .join('')}</div>`
        : '<p class="stage-subtitle" style="margin:6px 0 0;">当前牌组中暂无尚未升级的对应类型卡牌。</p>';

    return `
      <div class="modal-backdrop" id="modal-backdrop" data-action="close-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-title" aria-describedby="relic-upgrade-reveal-summary">
        <div class="modal-sheet modal-upgrade-reveal-sheet" id="relic-upgrade-reveal-modal">
          <div class="modal-header">
            <div>
              <h2 id="modal-title" class="stage-heading modal-heading-with-relic" style="color: var(--jade-upgrade);">
                <span class="relic-modal-icon" aria-hidden="true">${getRelicSvg(pickup.relicId, { scope: 'reveal', className: 'relic-svg-lg' })}</span>
                <span>【${escapeHtml(pickup.relicName)}】升级卡牌</span>
              </h2>
              <p id="relic-upgrade-reveal-summary" class="stage-subtitle" style="margin-top:6px;font-size:0.92rem;color:var(--text-ivory);">
                ${escapeHtml(summaryText)}
              </p>
            </div>
            <button type="button" id="btn-close-upgrade-reveal" class="btn-brass" style="white-space:nowrap;" data-action="close-modal">
              确认 (Esc)
            </button>
          </div>
          <div class="modal-body">
            ${cardsHtml}
          </div>
        </div>
      </div>
    `;
  }

  let title = '牌组总览';
  let subtitle = '';
  let cards = [];
  let cardAction = 'noop';
  let playable = false;
  let showUpgradePreview = false;
  const isDrawPile = ui.modal === 'draw';

  if (ui.modal === 'deck') {
    title = `🃏 当前总牌组（${state.player.deck.length} 张）`;
    cards = state.player.deck;
  } else if (ui.modal === 'draw' && state.combat) {
    title = `抽牌堆（${state.combat.drawPile.length} 张）`;
    subtitle = '为保持策略公平性，抽牌堆不会按真实抽牌顺序展示。';
    cards = state.combat.drawPile;
  } else if (ui.modal === 'discard' && state.combat) {
    title = `弃牌堆（${state.combat.discardPile.length} 张）`;
    cards = state.combat.discardPile;
  } else if (ui.modal === 'exhaust' && state.combat) {
    title = `消耗堆（${state.combat.exhaustPile.length} 张）`;
    cards = state.combat.exhaustPile;
  } else if (ui.modal === 'smith') {
    cards = getUpgradableDeckCards(state);
    title = `🔨 铁砧锻造 · 选择 1 张卡牌永久升级（可选 ${cards.length} 张）`;
    subtitle = '底部预览中以绿色突出“升级后”及发生变化的数值与效果。点击卡牌即可完成锻造。';
    cardAction = 'confirm-smith';
    playable = true;
    showUpgradePreview = true;
  } else if (ui.modal === 'shop_purge') {
    cards = state.player.deck;
    title = `移除卡牌（花费 ${state.shop?.purgeCost ?? 75} 金币）`;
    subtitle = '点击任意一张卡牌将其从牌组中永久移除。';
    cardAction = 'confirm-shop-purge';
    playable = true;
  } else if (ui.modal === 'rest_toke') {
    cards = state.player.deck;
    title = `🪈 宁静烟斗 · 选择 1 张卡牌永久移除（共 ${cards.length} 张）`;
    subtitle = '点击任意一张卡牌将其从牌组中永久移除（合并堆点击将移除其中 1 张）。';
    cardAction = 'confirm-rest-toke';
    playable = true;
  }

  // Deck / pile composition summary
  let atkCount = 0;
  let sklCount = 0;
  let pwrCount = 0;
  let curseStatusCount = 0;
  let upgradedCount = 0;
  let costSum = 0;
  let costCardCount = 0;
  for (const c of cards) {
    const st = getCardStats(c);
    if (st.type === 'attack') atkCount += 1;
    else if (st.type === 'skill') sklCount += 1;
    else if (st.type === 'power') pwrCount += 1;
    else curseStatusCount += 1;
    if (c.upgraded) upgradedCount += 1;
    if (!st.unplayable && !st.isXCost && typeof st.cost === 'number') {
      costSum += st.cost;
      costCardCount += 1;
    }
  }
  const avgCostText = costCardCount > 0 ? (costSum / costCardCount).toFixed(2) : '—';

  const activeSort =
    isDrawPile && (!ui.deckSort || ui.deckSort === 'order')
      ? 'type'
      : ui.deckSort || (isDrawPile ? 'type' : 'order');
  const stackCopies = ui.deckStack !== false;

  const TYPE_SORT_WEIGHT = { attack: 0, skill: 1, power: 2, status: 3, curse: 4 };
  const RARITY_SORT_WEIGHT = {
    rare: 0,
    uncommon: 1,
    common: 2,
    starter: 3,
    special: 4,
    curse: 5,
    status: 6,
  };

  const indexedCards = cards.map((card, origIdx) => ({ card, origIdx, stats: getCardStats(card) }));
  const costKey = (st) =>
    st.unplayable ? 99 : st.isXCost ? 50 : typeof st.cost === 'number' ? st.cost : 98;

  indexedCards.sort((a, b) => {
    if (activeSort === 'order') {
      return a.origIdx - b.origIdx;
    }
    if (activeSort === 'type') {
      return (
        (TYPE_SORT_WEIGHT[a.stats.type] ?? 9) - (TYPE_SORT_WEIGHT[b.stats.type] ?? 9) ||
        costKey(a.stats) - costKey(b.stats) ||
        a.stats.name.localeCompare(b.stats.name, 'zh-CN')
      );
    }
    if (activeSort === 'cost') {
      return (
        costKey(a.stats) - costKey(b.stats) ||
        (TYPE_SORT_WEIGHT[a.stats.type] ?? 9) - (TYPE_SORT_WEIGHT[b.stats.type] ?? 9) ||
        a.stats.name.localeCompare(b.stats.name, 'zh-CN')
      );
    }
    if (activeSort === 'rarity') {
      return (
        (RARITY_SORT_WEIGHT[a.stats.rarity] ?? 9) - (RARITY_SORT_WEIGHT[b.stats.rarity] ?? 9) ||
        (TYPE_SORT_WEIGHT[a.stats.type] ?? 9) - (TYPE_SORT_WEIGHT[b.stats.type] ?? 9) ||
        a.stats.name.localeCompare(b.stats.name, 'zh-CN')
      );
    }
    return a.origIdx - b.origIdx;
  });

  const displayItems = [];
  if (stackCopies) {
    const bucketMap = new Map();
    for (const entry of indexedCards) {
      const c = entry.card;
      const key = `${c.cardId}|${c.upgraded ? '1' : '0'}|${c.combatDamageMod ?? 0}|${c.combatBlockMod ?? 0}|${c.retainedCostDiscount ?? 0}|${c.combatCost ?? ''}`;
      const existing = bucketMap.get(key);
      if (existing) {
        existing.count += 1;
      } else {
        const item = { card: c, count: 1 };
        bucketMap.set(key, item);
        displayItems.push(item);
      }
    }
  } else {
    for (const entry of indexedCards) {
      displayItems.push({ card: entry.card, count: 1 });
    }
  }

  const sortOptions = [
    ...(isDrawPile ? [] : [{ id: 'order', label: '获得顺序' }]),
    { id: 'type', label: '按类型' },
    { id: 'cost', label: '按费用' },
    { id: 'rarity', label: '按稀有度' },
  ];

  const sortChipsHtml = sortOptions
    .map(
      (opt) => `
        <button
          type="button"
          id="btn-deck-sort-${escapeHtml(opt.id)}"
          class="filter-chip ${activeSort === opt.id ? 'active' : ''}"
          data-action="set-deck-sort"
          data-sort="${escapeHtml(opt.id)}"
        >${escapeHtml(opt.label)}</button>
      `
    )
    .join('');

  const deckToolbarHtml =
    cards.length > 0
      ? `
        <div class="deck-modal-toolbar" id="deck-modal-toolbar">
          <div class="deck-stats-bar" id="deck-stats-bar">
            <span class="deck-stat-chip stat-attack">⚔️ 攻击 <strong>${escapeHtml(atkCount)}</strong></span>
            <span class="deck-stat-chip stat-skill">🛡️ 技能 <strong>${escapeHtml(sklCount)}</strong></span>
            <span class="deck-stat-chip stat-power">⚡ 能力 <strong>${escapeHtml(pwrCount)}</strong></span>
            ${
              curseStatusCount > 0
                ? `<span class="deck-stat-chip stat-curse">💀 诅咒/状态 <strong>${escapeHtml(curseStatusCount)}</strong></span>`
                : ''
            }
            <span class="deck-stat-chip stat-cost">📈 均费 <strong>${escapeHtml(avgCostText)}</strong></span>
            <span class="deck-stat-chip stat-upg">✨ 已升级 <strong>${escapeHtml(upgradedCount)}</strong></span>
          </div>
          <div class="deck-controls-bar">
            <div class="glossary-filter-chips" role="group" aria-label="排序方式">${sortChipsHtml}</div>
            <button
              type="button"
              id="btn-toggle-deck-stack"
              class="filter-chip ${stackCopies ? 'active' : ''}"
              data-action="toggle-deck-stack"
            >${stackCopies ? '✓ 合并同名 (×N)' : '展开全部单张'}</button>
          </div>
        </div>
      `
      : '';

  const cardsHtml =
    displayItems.length > 0
      ? displayItems
          .map((item) =>
            renderCardHtml(item.card, {
              idPrefix: 'modal-card',
              action: cardAction,
              playable,
              disabled: !playable,
              showUpgradePreview,
              stackCount: stackCopies ? item.count : undefined,
              characterId: state?.characterId,
            })
          )
          .join('')
      : '<p class="stage-subtitle">此处当前没有任何卡牌。</p>';

  return `
    <div class="modal-backdrop" id="modal-backdrop" data-action="close-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div class="modal-sheet">
        <div class="modal-header">
          <div>
            <h2 id="modal-title" class="stage-heading">${escapeHtml(title)}</h2>
            ${subtitle ? `<p class="stage-subtitle">${escapeHtml(subtitle)}</p>` : ''}
          </div>
          <button type="button" id="btn-close-modal" class="btn-stone" data-action="close-modal">关闭 (Esc)</button>
        </div>
        <div class="modal-body">
          ${deckToolbarHtml}
          <div class="card-showcase">${cardsHtml}</div>
        </div>
      </div>
    </div>
  `;
}
